import Login from "./pages/Login"
import ProtectedRoute from "./components/ProtectedRoute";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import RADashboard from "./pages/RADashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

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


