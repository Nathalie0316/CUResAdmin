import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import "./ManageUsers.css";

function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setUserData(docSnap.data());
    };
    fetchUser();
  }, [id]);

  const handleRemove = async () => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      await deleteDoc(doc(db, "users", id));
      navigate("/admin/manage-users");
    }
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="manage-container">
      <button className="back-link" onClick={() => navigate("/admin/manage-users")}>Back</button>
      
      <h1 className="user-detail-name">{userData.name}</h1>

      <div className="detail-row">
        <label>Email:</label>
        <a href={`mailto:${userData.email}`}>{userData.email}</a>
      </div>
      <div className="detail-row">
        <label>Role:</label>
        <span>{userData.role}</span>
      </div>
      <div className="detail-row">
        <label>Area:</label>
        <span>{userData.area || "Not Assigned"}</span>
      </div>

      <div className="detail-actions">
        <button className="btn-edit" onClick={() => navigate(`/admin/manage-users/edit/${id}`)}>
          Edit User
        </button>
        <button className="btn-remove" onClick={handleRemove}>
          Remove User
        </button>
      </div>
    </div>
  );
}

export default UserDetails;