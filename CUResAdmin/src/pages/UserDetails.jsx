import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import "./ManageUsers.css";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setUsers(userList);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRemove = async (id, name) => {
    const confirmed = window.confirm(`Are you sure you want to remove ${name || "this user"}?`);
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "users", id));
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Error removing user:", err);
      alert("Failed to remove user.");
    }
  };

  return (
    <PageTransition>
      <div className="fluid-dash-page">
        <div className="fluid-dash-card">

          <div className="fluid-header">
            <button className="back-link" onClick={() => navigate("/admin")}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6"></path>
              </svg>
            </button>

            <h1 className="fluid-title">Manage Users</h1>
          </div>

          <div className="manage-users-topbar">
            <button
              className="btn-add-new"
              onClick={() => navigate("/admin/manage-users/add")}
            >
              + Add New User
            </button>
          </div>

          <div className="fluid-table-container">
            {loading ? (
              <p className="manage-loading-text">Loading Users...</p>
            ) : users.length === 0 ? (
              <p className="manage-loading-text">No users found.</p>
            ) : (
              <table className="fluid-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Email</th>
                    <th>Assigned Area</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-name-cell">
                          {user.name || "Unnamed User"}
                        </div>
                      </td>

                      <td>
                        <span className={`fluid-badge ${user.role === "admin" ? "fail" : "pass"}`}>
                          {user.role || "No Role"}
                        </span>
                      </td>

                      <td>
                        <a className="manage-user-email" href={`mailto:${user.email}`}>
                          {user.email || "No Email"}
                        </a>
                      </td>

                      <td>
                        <span className="manage-user-area">
                          {user.area || "Not Assigned"}
                        </span>
                      </td>

                      <td>
                        <div className="manage-user-actions">
                          <button
                            className="admin-action-btn"
                            onClick={() => navigate(`/admin/manage-users/edit/${user.id}`)}
                          >
                            Edit
                          </button>

                          <button
                            className="manage-remove-btn"
                            onClick={() => handleRemove(user.id, user.name)}
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </PageTransition>
  );
}

export default ManageUsers;