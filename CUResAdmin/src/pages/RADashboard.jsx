import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import seal from "../assets/bearlogo.png"; 
import "./Dashboards.css";

function RADashboard() {
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
      <p>What are working on today?</p>

      {/* RA Specific Buttons */}
      <button className="btn-primary" onClick={() => navigate("/ra/roomchecks")}>
        Roomchecks
      </button>
      <button className="btn-primary" onClick={() => navigate("/ra/checkouts")}>
        Dorm Checkouts
      </button>
      <button className="btn-primary" onClick={() => navigate("/ra/huddle-reports")}>
        Hall Huddle Reports
      </button>

      <button className="btn-logout" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
}

export default RADashboard;