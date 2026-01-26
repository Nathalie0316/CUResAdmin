import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Define the ProtectedRoute component. 
// Take 'children' as a prop (the components wrapped inside it).
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // Get the current user from AuthContext.

// If no user is logged in, redirect to the login page.
  if (!user) {
    return <Navigate to="/login" replace />;
  }
// If a user is logged in, render the child components (the protected page).
  return children;
};

export default ProtectedRoute;
