import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import seal from "../assets/bearlogo.png"; 
import "./ManageUsers.css";

function UserDetails() {
  // Get the user ID from the URL parameters and initialize navigation.
  const { id } = useParams(); // Get the user ID from the URL parameters. (useParams is a hook from react-router-dom that allows us to access the dynamic segments of the URL, in this case, the user ID.)
  const navigate = useNavigate();
  // Local state to hold the user data fetched from Firestore.
  const [userData, setUserData] = useState(null);

  // Effect that runs when the component mounts to fetch the user data from Firestore based on the ID from the URL. 
  useEffect(() => {
    const fetchUser = async () => {
      const docRef = doc(db, "users", id); // Create a reference to the specific user document.
      const docSnap = await getDoc(docRef); // Fetch the document snapshot from Firestore.
      if (docSnap.exists()) setUserData(docSnap.data()); // If the document exists, set the userData state with the data from Firestore.
    };
    fetchUser(); 
  }, [id]); // The effect depends on the "id" parameter, so it will re-run if the ID changes.

  // Function to handle user removal. 
  const handleRemove = async () => {
    // Confirm with the admin before deleting the user document from Firestore. 
    if (window.confirm("Are you sure you want to remove this user?")) {
      await deleteDoc(doc(db, "users", id)); // Delete the user document from Firestore using the ID.
      navigate("/admin/manage-users"); // After deletion, navigate back to the Manage Users page.
    }
  };

  // If userData is still null (because it's loading), show a loading message. 
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