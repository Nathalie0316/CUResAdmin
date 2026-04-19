import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "./context/AuthContext";

// Pages
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import RADashboard from "./pages/RADashboard";
import EditUser from "./pages/EditUser";
import RoomCheckForm from "./pages/RoomCheckForm";
import DormCheckout from "./pages/DormCheckout";
import HallHuddle from "./pages/HallHuddle";
import Profile from "./pages/Profile";
import AboutPage from "./pages/AboutPage";
import HallHuddleLogs from "./pages/HallHuddleLogs";
import CheckoutLogs from "./pages/CheckoutLogs";
import RoomCheckLogs from "./pages/RoomCheckLogs";
import ManageUsers from "./pages/ManageUsers";
import AddUser from "./pages/AddUser";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  // Auth state from context
  const { user, role, loading } = useAuth();

  // Used for page transition animations
  const location = useLocation();

  // Show loading screen while auth state is initializing
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading CUResAdmin...</p>
      </div>
    );
  }

  // Determine default route based on authentication & role
  const defaultRoute = user
    ? role?.toLowerCase() === "admin"
      ? "/admin"
      : "/ra"
    : "/login";

  return (
    // Animate route transitions
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        {/* Root route redirects based on auth/role */}
        <Route path="/" element={<Navigate to={defaultRoute} replace />} />

        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-users"
          element={
            <ProtectedRoute allowedRole="admin">
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-users/add"
          element={
            <ProtectedRoute allowedRole="admin">
              <AddUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-users/edit/:id"
          element={
            <ProtectedRoute allowedRole="admin">
              <EditUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/huddles"
          element={
            <ProtectedRoute allowedRole="admin">
              <HallHuddleLogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/checkouts"
          element={
            <ProtectedRoute allowedRole="admin">
              <CheckoutLogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/roomchecks"
          element={
            <ProtectedRoute allowedRole="admin">
              <RoomCheckLogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/about"
          element={
            <ProtectedRoute allowedRole="admin">
              <AboutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute allowedRole="admin">
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ================= RA ROUTES ================= */}
        <Route
          path="/ra"
          element={
            <ProtectedRoute allowedRole="ra">
              <RADashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ra/room-check"
          element={
            <ProtectedRoute allowedRole="ra">
              <RoomCheckForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ra/dorm-checkouts"
          element={
            <ProtectedRoute allowedRole="ra">
              <DormCheckout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ra/hall-huddle"
          element={
            <ProtectedRoute allowedRole="ra">
              <HallHuddle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRole="ra">
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route (fallback) */}
        <Route path="*" element={<Navigate to={defaultRoute} replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;