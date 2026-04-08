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

          {/* Add New User Button */}
          <div className="manage-users-topbar">
            <button
              className="btn-add-new"
              onClick={() => navigate("/admin/manage-users/add")}
            >
              + Add New User
            </button>
          </div>

          {/* User Details Table */}
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
                    <th>Email</th>
                    <th>Role</th>
                    <th>Assigned Area</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>

                      {/* User Name */}
                      <td>
                        <div className="user-name-cell">
                          {user.name || "Unnamed User"}
                        </div>
                      </td>
                      
                      {/* User Email */}
                      <td>
                        <a className="manage-user-email" href={`mailto:${user.email}`}>
                          {user.email || "No Email"}
                        </a>
                      </td>

                      {/* User Role */}
                      <td>
                       <span className="fluid-badge role-badge">
                          {user.role || "No Role"}
                        </span>
                      </td>

                      {/* User Area */}
                      <td className="manage-user-area">
                        {user.area && user.area.includes(" > ") ? (
                          (() => {
                            const [building, floor] = user.area.split(" > ");
                            return (
                              <div>
                                <span style={{ color: "rgb(0, 24, 104)", fontWeight: "600" }}>
                                  {building}
                                </span>
                                {" | "}
                                <span style={{ color: "rgb(51, 51, 51)", fontWeight: "600" }}>
                                  {floor}
                                </span>
                              </div>
                            );
                          })()
                        ) : (
                          <span style={{ color: "rgb(180, 180, 180)" }}>
                            Not Assigned
                          </span>
                        )}
                      </td>

                      {/* User Management Actions */}
                      <td>
                        <div className="manage-user-actions">
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/manage-users/edit/${user.id}`)}
                            className="admin-edit-icon-btn"
                            title="Edit User"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M12 20h9"></path>
                              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path>
                            </svg>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemove(user.id, user.name)}
                            className="admin-delete-icon-btn"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M3 6h18"></path>
                              <path d="M8 6V4h8v2"></path>
                              <path d="M19 6l-1 14H6L5 6"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
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