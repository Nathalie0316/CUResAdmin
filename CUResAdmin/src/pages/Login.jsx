import { useState, useEffect } from "react"; // Import useEffect for local state and side effects
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import "./Login.css";
import seal from "../assets/seal.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import useAuth to access authentication context and roles

function Login() {
  // Pull the current user object and their role from the global AuthContext.
  const { user, role } = useAuth();
  // Initialize navigation function.
  const navigate = useNavigate();

  // Local state variables to store what the user types into the input boxes.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Local state to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  // Local state to store and display error messages to the user.
  const [error, setError] = useState("");
  
  // Local state to disable the button and show a "Logging in..." message.
  const [loading, setLoading] = useState(false);

  // Function that runs when the user clicks the "Log In" button.
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page refresh on form submit
    setError(""); // Clear previous errors
    setLoading(true); // Start loading state

    try {
      // Sending the email and password to Firebase for authentication.
      await signInWithEmailAndPassword(auth, email, password);
      // Success: useEffect will handle the redirect
    } catch (err) {
      console.error(err);
      // If the user is offline, tell them it's a network issue, not a wrong password.
      if (err.code === "auth/network-request-failed") {
        setError("Network error. Please check your internet connection.");
      } else {
        setError("Invalid email or password. Please try again.");
      }
      
      setLoading(false); // Stop loading on error
    }
  };

  // Watcher that runs every time the user's login status or role changes.
  useEffect(() => {
    if (user && role) {
      const cleanRole = role.trim().toLowerCase(); // Normalize role string to avoid case/whitespace issues.
      // Redirects the user to the correct dashboard based on their role.
      if (cleanRole === "admin") {
        navigate("/admin");
      } else if (cleanRole === "ra") {
        navigate("/ra");
      }
    }
  }, [user, role, navigate]); // Dependencies: runs when user, role, or navigate function changes.

  return (
  <div className="fluid-login-container">
    <div className="fluid-login-card">
      <img src={seal} alt="CU Seal" className="fluid-login-seal" />
      <h1 className="fluid-login-title">CUResAdmin</h1>
      <p className="fluid-login-subtitle">Please enter your CU Credentials to Log In!</p>

      <form className="fluid-login-form" onSubmit={handleLogin}>
        <input
          className="fluid-login-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      
        {/* Wrapped password input for the toggle button */}
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            className="fluid-login-input"
            // Dynamic type based on showPassword state to toggle visibility
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ paddingRight: '45px' }} // Make sure text doesn't hide behind icon
          />
          {/* Toggle Button */}
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              color: '#666'
            }}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            )}
          </button>
        </div>

        <button className="fluid-login-btn" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>
        
        {error && <p className="fluid-login-error">{error}</p>}
      </form>
    </div>
  </div>
);
}

export default Login;
