import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./ManageUsers.css";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="manage-container">
      <button className="back-link" onClick={() => navigate("/admin")}>Back</button>
      
      <h1>Manage Users</h1>

      {/* Add New User button */}
      <button className="btn-add-new" onClick={() => navigate("/admin/manage-users/add")}>
        Add New User
      </button>

      <div className="user-button-list">
        {loading ? <p>Loading Users...</p> : users.map(user => (
          <button 
            key={user.id} 
            className="user-item-btn"
            onClick={() => navigate(`/admin/manage-users/${user.id}`)}
          >
            {user.name || "Unnamed User"}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ManageUsers;