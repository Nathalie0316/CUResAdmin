import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import seal from "../assets/bearlogo.png"; // Import your logo
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
    <div className="fluid-dash-page">
      <div className="fluid-dash-card">
        
        {/* Header with Top-Left Back Button */}
        <div className="fluid-header">
          <button className="back-link" onClick={() => navigate("/admin")}>
            Back
          </button>
          <h1>Manage Users</h1>
        </div>

        {/* Stacked Branding Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <img src={seal} alt="Logo" className="fluid-dash-logo-large" style={{ marginBottom: '8px' }} />
          <h2 style={{ fontSize: '1rem', color: '#666', margin: '0', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Administration
          </h2>
        </div>

        {/* Action Section */}
        <div className="manage-action-container">
          <button className="btn-add-new" onClick={() => navigate("/admin/manage-users/add")}>
            + Add New User
          </button>

          <div className="user-button-list">
            {loading ? (
              <p style={{ marginTop: '20px', color: '#666' }}>Loading Users...</p>
            ) : (
              users.map(user => (
                <button 
                  key={user.id} 
                  className="user-item-btn"
                  onClick={() => navigate(`/admin/manage-users/${user.id}`)}
                >
                  {user.name || "Unnamed User"}
                  <span className="user-arrow">→</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;