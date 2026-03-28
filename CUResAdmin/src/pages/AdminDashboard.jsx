import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import culogo from "../assets/campus-life-horizontal.png";
import { useState, useEffect } from "react";
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

  const [adminName, setAdminName] = useState("");
    useEffect(() => {
      const user = auth.currentUser;
      if (user) {
        setAdminName(user.displayName || user.email.split("@")[0]);
      }
    }, []);
  
  return(
    <PageTransition>
      <div className="fluid-dash-page">
        <div className="fluid-dash-card">
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: '10px' }}>
                    {/* New CL Logo to replace bear logo */}
                    <img src={culogo} alt="CLLogo" className="fluid-dash-logo-large" style={{ marginBottom: '8px' }} /> 
                    
                    {/* Added a Greeting for the specific Admin with their name*/}
            
                    <p1 style={{ fontSize: '1.5rem', marginTop: '40px', marginBottom: '2px' , fontWeight: '600', color: 'rgb(0, 0, 0)' }}>
                      Welcome, {adminName}!
                    </p1>
                    <p1 style={{ fontSize: '2rem', marginTop: '10px', marginBottom: '5px' , fontWeight: '800', color: 'rgb(0, 40, 104)' }}>
                      Admin Dashboard
                    </p1>
          </div>          
          </div>

          <div className="fluid-menu-grid">
            <button className="fluid-dash-btn" onClick={() => navigate("/admin/roomchecks")}>
              Review Roomchecks
            </button>
            <button className="fluid-dash-btn" onClick={() => navigate("/admin/checkouts")}>
              Review Checkouts
            </button>
            <button className="fluid-dash-btn" onClick={() => navigate("/admin/huddles")}>
              Hall Huddle Logs
            </button>
            <button className="fluid-dash-btn" onClick={() => navigate("/admin/manage-users")}>
              Manage Users
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

export default AdminDashboard;