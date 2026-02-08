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
  <div className="fluid-dash-page">
    <div className="fluid-dash-card">
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: '10px' }}>
        <img src={seal} alt="Logo" className="fluid-dash-logo-large" style={{ marginBottom: '8px' }} />
        
        <h2 style={{ fontSize: '1rem', color: 'rgb(55, 55, 55)', margin: '0', fontWeight: '600', letterSpacing: '0.5px' }}>
          CUResLife
        </h2>
        
        <h1 style={{ fontSize: '2.2rem', margin: '2px 0 10px 0', fontWeight: '800', color: 'rgb(0, 0, 0)' }}>
          RA Dashboard
        </h1>

        <p style={{ textAlign: 'center', color: 'rgb(55, 55, 55)', margin: '0 0 25px 0', fontSize: '0.95rem' }}>
          What are you working on today?
        </p>
      </div>

      <div className="fluid-menu-grid">
        <button className="fluid-dash-btn" onClick={() => navigate("/ra/room-check")}>
          Roomchecks
        </button>
        <button className="fluid-dash-btn" onClick={() => navigate("/ra/checkouts")}>
          Dorm Checkouts
        </button>
        <button className="fluid-dash-btn" onClick={() => navigate("/ra/huddle-reports")}>
          Hall Huddle Reports
        </button>
      </div>

      <div className="fluid-logout-wrap">
        <button className="fluid-dash-logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </div>

    </div>
  </div>
  );
}

export default RADashboard;