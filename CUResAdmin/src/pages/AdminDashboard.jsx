import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import seal from "../assets/bearlogo.png"; 
import "./Dashboards.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirect after logout
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <img src={seal} alt="Bruin Head Logo" className="dashboard-bearlogo" />
      
      <h1>Welcome to CUResLife!</h1>
      <p>Administration Dashboard</p>

      {/* Admin Specific Buttons */}
      <button className="btn-primary" onClick={() => navigate("/admin/roomchecks")}>
        Check Roomchecks
      </button>
      <button className="btn-primary" onClick={() => navigate("/admin/checkouts")}>
        Check Dorm Checkouts
      </button>
      <button className="btn-primary" onClick={() => navigate("/admin/huddles")}>
        Check Hall Huddles
      </button>
      <button className="btn-primary" onClick={() => navigate("/admin/manage-users")}>
        Manage Users
      </button>

      <button className="btn-logout" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
}

export default AdminDashboard;