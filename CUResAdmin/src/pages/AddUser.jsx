import { useState } from "react";
import { db } from "../firebase"; 
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
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

function AddUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "TemporaryPassword123!",
    role: "RA",
    area: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(false); // Start loading
    
    // Initialize a secondary, temporary Firebase app
    const secondaryApp = initializeApp(firebaseConfig, "Secondary");
    const secondaryAuth = getAuth(secondaryApp);

    try {
      // Create user using the secondary auth instance
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth, 
        formData.email, 
        formData.password
      );
      const newUserId = userCredential.user.uid;

      // Save to Firestore using your primary app (where I am still Admin)
      // Main session never changed, isAdmin() will still be TRUE
      await setDoc(doc(db, "users", newUserId), {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        area: formData.area,
        createdAt: new Date()
      });

      // Log out the secondary user and clean up the temporary app
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
            <option value="">Select Area</option>
            <option value="RA">Residential Assistant</option>
            <option value="Admin">Administrator</option>
          </select>
        </div>

        <div className="form-group">
          <label>Area:</label>
          <select required onChange={(e) => setFormData({...formData, area: e.target.value})}>
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

        <button type="submit" className="btn-add-new" disabled={loading}>
          {loading ? "Creating..." : "Add User"}
        </button>
      </form>
    </div>
  );
}

export default AddUser;