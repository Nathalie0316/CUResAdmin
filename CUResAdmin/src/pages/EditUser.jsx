import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "./ManageUsers.css";
import PageTransition from "../components/PageTransition";

// Define the building and floor relationship
const areaData = {
  "Griffith": ["1st Floor", "2nd Floor", "3rd Floor"],
  "Stevens": ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],
  "Lee": ["1st Floor", "2nd Floor", "3rd Floor"],
  "Patterson": ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"]
};

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Local state for the dynamic dropdowns
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const [formData, setFormData] = useState({ name: "", role: "", area: "" });
  const [loading, setLoading] = useState(true);

  // Fetch user data and initialize the dropdowns based on the "Building > Floor" format in the area field.
  useEffect(() => {
    const fetchUser = async () => {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData(data);
        setSelectedRole(data.role || "");

        if (data.role === "RA" && data.area && data.area.includes(" > ")) {
          const [building, floor] = data.area.split(" > ");
          setSelectedBuilding(building);
          setSelectedFloor(floor);
        } else {
          setSelectedBuilding("");
          setSelectedFloor("");
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [id]);

  // Synchronize building/floor selection back into the main formData.area string
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

  // Handle form submission to update the user document in Firestore.
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "users", id), formData);
      alert("User updated successfully!");
      navigate("/admin/manage-users");
    } catch (err) {
      alert("Error updating user: " + err.message);
    }
  };

  // Show loading state while fetching user data.
  if (loading) return <div className="fluid-dash-page"><p>Loading...</p></div>;

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

            <h1 className="fluid-title">Edit User</h1>
          </div>

          <form className="add-user-form" style={{ width: '100%', maxWidth: '450px' }} onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Name:</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Role:</label>
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
            </div>

            {selectedRole === "RA" && (
              <div className="fade-in-section role-dependent-section">
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
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </PageTransition>
  );
}

export default EditUser;