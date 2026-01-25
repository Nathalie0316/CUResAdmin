import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import "./Login.css";
import seal from "../assets/seal.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // CHANGED: Added loading state for button feedback
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
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
      
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && role) {
      const cleanRole = role.trim().toLowerCase();
      if (cleanRole === "admin") {
        navigate("/admin");
      } else if (cleanRole === "ra") {
        navigate("/ra");
      }
    }
  }, [user, role, navigate]);

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={seal} alt="CU Seal" className="login-seal" />
        <h1>CUResAdmin</h1>
        <p>Please enter your CU Credentials to Log In!</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* CHANGED: Button disables while loading */}
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>

          {error && <p className="login-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;
