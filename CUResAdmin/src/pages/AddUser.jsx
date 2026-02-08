import { useState, useEffect } from "react";
import { db } from "../firebase"; 
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
// Import initializeApp and deleteApp to create a "temporary" connection to Firebase.
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth"; 
import "./ManageUsers.css";

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
  
  // Track what the user selects in the dropdowns separately from the final form data (UI state vs. submission state).
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");

  // The object that will be sent to the database (Form state).
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "TemporaryPassword123!",
    role: "RA",
    area: ""
  });

  // Prevents multiple clicks while waiting for Firebase (Loading state).
  const [loading, setLoading] = useState(false);

  // Effect that runs every time selectedBuilding or selectedFloor changes and combines them into a single string for the database.
  useEffect(() => {
    if (selectedBuilding && selectedFloor) {
      setFormData(prev => ({
        ...prev,
        area: `${selectedBuilding} > ${selectedFloor}`
      }));
    } else {
      setFormData(prev => ({ ...prev, area: "" }));
    }
  }, [selectedBuilding, selectedFloor]);

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

      alert("User Created! You are still logged in as Admin.");
      navigate("/admin/manage-users");
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manage-container">
      <button className="back-link" onClick={() => navigate("/admin/manage-users")}>Back</button>
      
      <h1 className="form-title">Add New User</h1>

      <form className="add-user-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input 
            type="text" 
            placeholder="Input value here"
            required
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            placeholder="Input value here"
            required
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Role:</label>
          <select onChange={(e) => setFormData({...formData, role: e.target.value})}>
            <option value="RA">Residential Assistant</option>
            <option value="Admin">Administrator</option>
          </select>
        </div>

        {/* Select Building */}
        <div className="form-group">
          <label>Building:</label>
          <select 
            required 
            value={selectedBuilding}
            onChange={(e) => {
              setSelectedBuilding(e.target.value);
              setSelectedFloor(""); // Reset floor if building changes
            }}
          >
            <option value="">Select Building</option>
            {Object.keys(areaData).map((building) => (
              <option key={building} value={building}>{building}</option>
            ))}
          </select>
        </div>

        {/* Select Floor (Conditionally Rendered by Building Selection) */}
        {selectedBuilding && (
          <div className="form-group" style={{ animation: "fadeIn 0.3s ease-in-out" }}>
            <label>Floor:</label>
            <select 
              required 
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
            >
              <option value="">Select Floor</option>
              {areaData[selectedBuilding].map((floor) => (
                <option key={floor} value={floor}>{floor}</option>
              ))}
            </select>
          </div>
        )}

        <button type="submit" className="btn-add-new" disabled={loading}>
          {loading ? "Creating..." : "Add User"}
        </button>
      </form>
    </div>
  );
}

export default AddUser;