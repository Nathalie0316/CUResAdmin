import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "./ManageUsers.css";

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

  const [formData, setFormData] = useState({ name: "", role: "", area: "" });
  const [loading, setLoading] = useState(true);

  // Fetch user data and initialize the dropdowns
  useEffect(() => {
    const fetchUser = async () => {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData(data);

        // Split the "Building > Floor" string to pre-fill dropdowns
        if (data.area && data.area.includes(" > ")) {
          const [building, floor] = data.area.split(" > ");
          setSelectedBuilding(building);
          setSelectedFloor(floor);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [id]);

  // Synchronize building/floor selection back into the main formData.area string
  useEffect(() => {
    if (selectedBuilding && selectedFloor) {
      setFormData(prev => ({
        ...prev,
        area: `${selectedBuilding} > ${selectedFloor}`
      }));
    }
  }, [selectedBuilding, selectedFloor]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "users", id), formData);
      alert("User updated successfully!");
      navigate(`/admin/manage-users/${id}`);
    } catch (err) {
      alert("Error updating user: " + err.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="manage-container">
      <button className="back-link" onClick={() => navigate(-1)}>Back</button>
      <h1>Edit User</h1>
      <form className="add-user-form" onSubmit={handleUpdate}>
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
          <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
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

        {/* Select Floor */}
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

        <button type="submit" className="btn-edit" style={{marginTop: '20px'}}>Save Changes</button>
      </form>
    </div>
  );
}

export default EditUser;