import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import seal from "../assets/bearlogo.png"; 
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

  if (!userData) return <div className="fluid-dash-page"><p>Loading...</p></div>;

  return (
    <div className="fluid-dash-page">
      <div className="fluid-dash-card">
        
        <div className="fluid-header">
          <button className="back-link" onClick={() => navigate("/admin/manage-users")}>Back</button>
          <h1>User Profile</h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginBottom: '30px' }}>
          <img src={seal} alt="Logo" className="fluid-dash-logo-large" style={{ marginBottom: '15px' }} />
          <h1 style={{ fontSize: '2.4rem', margin: '0', fontWeight: '800', color: '#000' }}>{userData.name}</h1>
          <span style={{ fontSize: '1.1rem', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {userData.role}
          </span>
        </div>

        <div style={{ width: '100%', maxWidth: '450px' }}>
          <div className="detail-row" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '15px' }}>
            <label>Email:</label>
            <a href={`mailto:${userData.email}`} style={{ color: '#001868', fontWeight: '600' }}>{userData.email}</a>
          </div>
          <div className="detail-row" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '15px', paddingTop: '15px' }}>
            <label>Assigned Area:</label>
            <span style={{ fontWeight: '600', color: '#333' }}>{userData.area || "Not Assigned"}</span>
          </div>

          <div className="detail-actions" style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn-edit" onClick={() => navigate(`/admin/manage-users/edit/${id}`)}>
              Edit User Details
            </button>
            <button className="btn-remove" onClick={handleRemove}>
              Remove User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetails;