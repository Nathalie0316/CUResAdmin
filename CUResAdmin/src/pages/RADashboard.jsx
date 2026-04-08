import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import seal from "../assets/bearlogo.png"; 
import culogo from "../assets/campus-life-horizontal.png";
import { useEffect, useState } from "react";
import PageTransition from "../components/PageTransition";
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

   const [RAName, setRAName] = useState("");
    useEffect(() => {
      const user = auth.currentUser;
      if (user) {
        setRAName(user.displayName || user.email.split("@")[0]);
      }
    }, []);

  return (
    <PageTransition>
    <div className="fluid-dash-page">
      <div className="fluid-dash-card">
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: '10px' }}>
          {/* New CL Logo to replace bear logo */}
          <img src={culogo} alt="CLLogo" className="fluid-dash-logo-large" style={{ marginBottom: '8px' }} /> 
          
          {/* Added a Greeting for the specific RA with their name*/}

          <p1 style={{ fontSize: '1.5rem', marginTop: '40px', marginBottom: '2px' , fontWeight: '600', color: 'rgb(0, 0, 0)' }}>
            Welcome, {RAName}!
          </p1>
          <p1 style={{ fontSize: '2rem', marginTop: '10px', marginBottom: '5px' , fontWeight: '800', color: 'rgb(0, 40, 104)' }}>
            RA Dashboard
          </p1>

        </div>

        <div className="fluid-menu-grid">
          <button className="fluid-dash-btn" onClick={() => navigate("/ra/room-check")}>
            Roomchecks
          </button>
          <button className="fluid-dash-btn" onClick={() => navigate("/ra/dorm-checkouts")}>
            Dorm Checkouts
          </button>
          <button className="fluid-dash-btn" onClick={() => navigate("/ra/hall-huddle")}>
            Hall Huddle Reports
          </button>
          <button className="fluid-dash-btn" onClick={() => navigate("/profile")}>
            Password Management
          </button>
        </div>

        <div className="fluid-logout-wrap">
          <button className="fluid-dash-logout-btn" onClick={handleLogout}>
            Log Out
          </button>
        </div>

      </div>
    </div>
    </PageTransition>
  );
}

export default RADashboard;