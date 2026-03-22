import React, { useState } from "react";
import { auth } from "../firebase";
import { updatePassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle state
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) return alert("Password must be at least 6 characters."); // Basic client-side validation for password length, I plan to add more complex validation later.

    // Start loading state to disable the button and show "Updating..." text while the password update is in progress.
    setLoading(true);
    
    try {
      const user = auth.currentUser;
      await updatePassword(user, newPassword);
      alert("Password updated successfully!");
      setNewPassword("");
      navigate("/ra-dashboard"); // Redirect to dashboard after successful password change.
    } catch (error) {
      console.error(error);
      alert(error.message.includes("requires-recent-login") // Provide a specific message if the error is due to the need for recent login.
      ? "Security: Please log out and log back in before changing your password."
        : error.message);
    } finally {
      setLoading(false); // End loading state regardless of success or failure to re-enable the button.
    }
  };

  return (
    <div className="fluid-container">
      <div className="fluid-card" style={{ maxWidth: '400px', margin: 'auto' }}>
        <div className="fluid-header">
          <button className="back-link" onClick={() => navigate(-1)}>Back</button>
          <h1>Profile Settings</h1>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label className="fluid-label">Email</label>
          <input className="fluid-input" value={auth.currentUser?.email} disabled />
        </div>

        <form onSubmit={handlePasswordChange}>
          <label className="fluid-label">New Password</label>
          <div className="profile-password-wrapper">
            <input 
              type={showPassword ? "text" : "password"} // Switch input type based on showPassword state to toggle visibility.
              className="fluid-input" 
              placeholder="Enter at least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            {/* SVG toggle button */}
            <button 
              className="profile-eye-toggle-btn"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                /* Hidden SVG */
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                /* Visible SVG */
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
          
          <button 
            type="submit" 
            className="fluid-submit-btn" 
            disabled={loading}
            style={{ 
              width: '100%', 
              marginTop: '20px', 
              backgroundColor: 'rgb(0, 24, 104)', 
              color: 'white' 
            }}
          >
            {loading ? "Updating..." : "Update Password"} 
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;

