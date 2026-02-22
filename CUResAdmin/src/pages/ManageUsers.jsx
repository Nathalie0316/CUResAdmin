import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import seal from "../assets/bearlogo.png"; // Import your logo
import "./ManageUsers.css";

function ManageUsers() {
  // Local state to hold the list of users fetched from Firestore.
  const [users, setUsers] = useState([]);
  // Manage loading state to show a message while fetching users from the database.
  const [loading, setLoading] = useState(true);
  // Initialize the navigate function.
  const navigate = useNavigate();

  // Effect that runs once when the component mounts to fetch the list of users from Firestore.
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users")); // Fetch all documents from the "users" collection in Firestore.
        setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); // Map the documents to an array of user objects with their ID included.
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // Set loading to false after the fetch is complete.
      }
    };
    fetchUsers(); // Call the function to fetch users when the component mounts.
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
                  key={user.id} // Each button navigates to the Edit User page for that specific user using their ID.
                  className="user-item-btn"
                  onClick={() => navigate(`/admin/manage-users/${user.id}`)}
                >
                  {/* Fallback text if the user has no name */}
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