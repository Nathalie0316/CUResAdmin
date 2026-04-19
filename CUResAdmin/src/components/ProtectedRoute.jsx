import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Protect routes based on auth and role
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, role, loading } = useAuth();

  // Wait for auth state
  if (loading) {
    return null;
  }

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if role not allowed
  if (allowedRole && role?.trim().toLowerCase() !== allowedRole.toLowerCase()) {
    const fallbackRoute =
      role?.trim().toLowerCase() === "admin" ? "/admin" : "/ra";
    return <Navigate to={fallbackRoute} replace />;
  }

  return children;
};

export default ProtectedRoute;