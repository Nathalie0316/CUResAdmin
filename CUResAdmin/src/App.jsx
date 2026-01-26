import Login from "./pages/Login"
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute component to guard routes
import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import RADashboard from "./pages/RADashboard";
import { useAuth } from "./context/AuthContext";

function App() {
  // Get loading state from AuthContext to know if Firebase auth is still checking status
  const { loading } = useAuth();

  // If the app is still verifying the user, it stops shows a loading spinner instead of the pages (or it should)
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div> 
        <p>Loading CUResLife...</p>
      </div>
    );
  }

  // Once loading is finished, return routing configuration.
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Defines the path for the Login page. */}
      <Route path="/login" element={<Login />} />

      {/* Defines the Admin path. It is wrapped in ProtectedRoute to ensure only 'admin' roles can enter. */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Defines the RA path. It is wrapped in ProtectedRoute to ensure only 'RA' roles can enter. */}
      <Route
        path="/ra"
        element={
          <ProtectedRoute allowedRole="RA">
            <RADashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;


