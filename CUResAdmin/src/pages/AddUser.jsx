import { useState, useEffect } from "react";
import { db } from "../firebase"; 
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
// Import initializeApp and deleteApp to create a "temporary" connection to Firebase.
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth"; 
import PageTransition from "../components/PageTransition";
import "./ManageUsers.css";

// Firebase configuration for the secondary app (same as main).
const firebaseConfig = {
  apiKey: "AIzaSyCimMqW13cbnEqfNDRQ6G8PKC_FiI7IwDs",
  authDomain: "curesadmin.firebaseapp.com",
  projectId: "curesadmin",
  storageBucket: "curesadmin.firebasestorage.app",
  messagingSenderId: "46873507426",
  appId: "1:46873507426:web:9af5334a97a75abacf433b"
};

// Define the building and floor relationship for dynamic dropdowns.
const areaData = {
  "Griffith": ["1st Floor", "2nd Floor", "3rd Floor"],
  "Stevens": ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],
  "Lee": ["1st Floor", "2nd Floor", "3rd Floor"],
  "Patterson": ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"]
};

function AddUser() {
  const navigate = useNavigate();

  // Track Roles 
  const [selectedRole, setSelectedRole] = useState("");
  
  // Track what the user selects in the dropdowns separately from the final form data (UI state vs. submission state).
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");

  // The object that will be sent to the database (Form state).
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "TemporaryPassword123!", // Default password for new users (should be changed on first login, I have to add an option for this).
    role: "",
    area: ""
  });

  // Prevents multiple clicks while waiting for Firebase (Loading state).
  const [loading, setLoading] = useState(false);

  // Effect that runs every time selectedBuilding or selectedFloor changes and combines them into a single string for the database.
  useEffect(() => {
    if (selectedRole === "RA" && selectedBuilding && selectedFloor) {
      setFormData(prev => ({
        ...prev,
        area: `${selectedBuilding} > ${selectedFloor}`
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        area: ""
      }));
    }
  }, [selectedBuilding, selectedFloor, selectedRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading state
    
    // Initialize a secondary, temporary Firebase app to create the new user without affecting the current admin session.
    const secondaryApp = initializeApp(firebaseConfig, "Secondary");
    const secondaryAuth = getAuth(secondaryApp);

    try {
      // Create user using the secondary auth instance so that the main session (Admin) remains logged in.
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth, 
        formData.email, 
        formData.password
      );

      // Get the UID of the newly created user to use as the document ID in Firestore.
      const newUserId = userCredential.user.uid;

      // Save new user to Firestore using the main session (Admin).
      await setDoc(doc(db, "users", newUserId), {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        area: formData.area,
        createdAt: new Date()
      });

      // Log out the secondary user and clean up the temporary app.
      await signOut(secondaryAuth);
      await deleteApp(secondaryApp);

      alert("User Created! You are still logged into your account.");
      navigate("/admin/manage-users");
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false); // End loading state regardless of success or failure to re-enable the form.
    }
  };

  return (
    <PageTransition>
      <div className="fluid-dash-page">
        <div className="fluid-dash-card">
          
          <div className="fluid-header">
            <button className="back-link" onClick={() => navigate("/admin/manage-users")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"></path>
              </svg>
            </button>

            <h1 className="fluid-title">Add New User</h1>
          </div>

          <form className="add-user-form" style={{ width: '100%', maxWidth: '450px' }} onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input 
                type="text" 
                placeholder="Full Name"
                required
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input 
                type="email" 
                placeholder="Email Address"
                required
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="select-wrapper-users">
              <select
                value={selectedRole}
                onChange={(e) => {
                  const role = e.target.value;
                  setSelectedRole(role);

                  setFormData(prev => ({
                    ...prev,
                    role,
                    area: role === "Admin" ? "" : prev.area
                  }));

                  setSelectedBuilding("");
                  setSelectedFloor("");
                }}
                required
                className="fluid-input"
              >
                <option value="">Select Role</option>
                <option value="RA">Residential Assistant</option>
                <option value="Admin">Administrator</option>
              </select>

              <span className="select-arrow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </span>
            </div>

            {selectedRole === "RA" && (
              <div className="fade-in-section role-dependent-section">
                {/* Select Building */}
                <div className="form-group">
                  <label>Building:</label>
                  <div className="select-wrapper-users">
                    <select
                      required
                      value={selectedBuilding}
                      onChange={(e) => {
                        setSelectedBuilding(e.target.value);
                        setSelectedFloor("");
                      }}
                      className="fluid-input"
                    >
                      <option value="">Select Building</option>
                      {Object.keys(areaData).map((building) => (
                        <option key={building} value={building}>{building}</option>
                      ))}
                    </select>

                    <span className="select-arrow">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Select Floor */}
                {selectedBuilding && (
                  <div className="form-group fade-in-section">
                    <label>Floor:</label>
                    <div className="select-wrapper-users">
                      <select
                        required
                        value={selectedFloor}
                        onChange={(e) => setSelectedFloor(e.target.value)}
                        className="fluid-input"
                      >
                        <option value="">Select Floor</option>
                        {areaData[selectedBuilding].map((floor) => (
                          <option key={floor} value={floor}>{floor}</option>
                        ))}
                      </select>

                      <span className="select-arrow">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 9l6 6 6-6"></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

           <div className="form-submit-container">
            <button
              type="submit"
              className="btn-submit-user"
              disabled={loading}
            >
              {loading ? "Creating..." : "Submit New User"}
            </button>
           </div>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}

export default AddUser;