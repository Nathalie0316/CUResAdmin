import React, { useState } from "react";
import { auth } from "../firebase";
import { updatePassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

function Profile() {
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { role } = useAuth();

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      return alert("Password must be at least 6 characters.");
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      await updatePassword(user, newPassword);
      alert("Password updated successfully!");
      setNewPassword("");

      if (role?.toLowerCase() === "admin") {
        navigate("/admin");
      } else {
        navigate("/ra");
      }

    } catch (error) {
      console.error(error);
      alert(
        error.message.includes("requires-recent-login")
          ? "Security: Please log out and log back in before changing your password."
          : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="fluid-container">
        <div className="fluid-card profile-card">
          <div className="fluid-header">
            <button className="back-link" onClick={() => navigate(-1)}>
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

            <h1 className="fluid-title">Reset Password</h1>
          </div>

          <div className="profile-section">
            <label className="fluid-label">Email</label>
            <input className="fluid-input" value={auth.currentUser?.email || ""} disabled />
          </div>

          <form onSubmit={handlePasswordChange} className="profile-form">
            <label className="fluid-label">New Password</label>

            <div className="profile-password-wrapper">
              <input 
                type={showPassword ? "text" : "password"}
                className="fluid-input"
                placeholder="Enter at least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <button 
                className="profile-eye-toggle-btn"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>

            <button 
              type="submit"
              className="profile-submit-btn"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}

export default Profile;

