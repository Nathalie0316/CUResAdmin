import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "./ManageUsers.css";

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", role: "", area: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData(docSnap.data());
      }
      setLoading(false);
    };
    fetchUser();
  }, [id]);

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
            <option value="">Select Area</option>
            <option value="RA">Residential Assistant</option>
            <option value="Admin">Administrator</option>
          </select>
        </div>
        <div className="form-group">
          <label>Area:</label>
          <select value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})}>
            <option value="">Select Area</option>
            <option value="Griffith > 1st Floor">Griffith 1st</option>
            <option value="Griffith > 2nd Floor">Griffith 2nd</option>
            <option value="Griffith > 3rd Floor">Griffith 3rd</option>
            <option value="Stevens > 1st Floor">Stevens 1st</option>
            <option value="Stevens > 2nd Floor">Stevens 2nd</option>
            <option value="Stevens > 3rd Floor">Stevens 3rd</option>
            <option value="Stevens > 4th Floor">Stevens 4th</option>
            <option value="Lee > 1st Floor">Lee 1st</option>
            <option value="Lee > 2nd Floor">Lee 2nd</option>
            <option value="Lee > 3rd Floor">Lee 3rd</option>
            <option value="Patterson > 1st Floor">Patterson 1st</option>
            <option value="Patterson > 2nd Floor">Patterson 2nd</option>
            <option value="Patterson > 3rd Floor">Patterson 3rd</option>
            <option value="Patterson > 4th Floor">Patterson 4th</option>
          </select>
        </div>
        <button type="submit" className="btn-edit" style={{marginTop: '20px'}}>Save Changes</button>
      </form>
    </div>
  );
}

export default EditUser;