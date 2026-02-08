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

        <input
          className="fluid-login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

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
