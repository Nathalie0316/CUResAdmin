import Login from "./pages/Login"
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute component to guard routes
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AdminDashboard from "./pages/AdminDashboard";
import RADashboard from "./pages/RADashboard";
import { useAuth } from "./context/AuthContext";
import EditUser from "./pages/EditUser";
import RoomCheckForm from "./pages/RoomCheckForm";
import DormCheckout from "./pages/DormCheckout"; 
import HallHuddle from "./pages/HallHuddle"; 
import Profile from "./pages/Profile"; // New Profile Management Page
import AboutPage from "./pages/AboutPage";

// New Page Imports for Logs for Admins
import HallHuddleLogs from "./pages/HallHuddleLogs";
import CheckoutLogs from "./pages/CheckoutLogs";
import RoomCheckLogs from "./pages/RoomCheckLogs";

// Page Imports for User Management
import ManageUsers from "./pages/ManageUsers";
import AddUser from "./pages/AddUser";

function App() {
  // Get loading state from AuthContext to know if Firebase auth is still checking status
  const { loading } = useAuth();
  const location = useLocation(); // Get current location for AnimatePresence.

  // If the app is still verifying the user, it shows a loading spinner instead of the pages
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
    <AnimatePresence mode="wait">
      <Routes>
        {/* Root redirect: Sends users to login by default */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Defines the path for the Login page. */}
        <Route path="/login" element={<Login />} />

        {/* --- ADMIN ROUTES --- */}
        {/* Main Admin Dashboard: Wrapped in ProtectedRoute to ensure only 'admin' roles can enter. */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Manage Users List: Shows the list of all RAs and Admins. */}
        <Route
          path="/admin/manage-users"
          element={
            <ProtectedRoute allowedRole="admin">
              <ManageUsers />
            </ProtectedRoute>
          }
        />

        {/* Add New User: form to create a new Auth account and Firestore document. */}
        <Route
          path="/admin/manage-users/add"
          element={
            <ProtectedRoute allowedRole="admin">
              <AddUser />
            </ProtectedRoute>
          }
        />

        {/* Edit User Page: A dynamic route to edit a specific user's info. */}
        <Route
          path="/admin/manage-users/edit/:id"
          element={
            <ProtectedRoute allowedRole="Admin">
            <EditUser />
            </ProtectedRoute>
        }
        />

          {/* Hall Huddle Logs Page */}
        <Route
          path="/admin/huddles"
          element={
            <ProtectedRoute allowedRole="admin">
              <HallHuddleLogs />
            </ProtectedRoute>
          }
        />

        {/* Checkout Logs Page */}
        <Route
          path="/admin/checkouts"
          element={
            <ProtectedRoute allowedRole="admin">
              <CheckoutLogs />
            </ProtectedRoute>
          }
        />

        {/* Room Check Logs Page */}
        <Route
          path="/admin/roomchecks"
          element={
            <ProtectedRoute allowedRole="admin">
              <RoomCheckLogs />
            </ProtectedRoute>
          }
        />

        {/* About Page */}
        <Route
          path="/admin/about"
          element={
            <ProtectedRoute allowedRole="admin">
              <AboutPage />
            </ProtectedRoute>
          }
        />

        {/* --- RA ROUTES --- */}
        {/* Defines the RA path. Wrapped in ProtectedRoute to ensure only 'RA' roles can enter. */}
        <Route
          path="/ra"
          element={
            <ProtectedRoute allowedRole="RA">
              <RADashboard />
            </ProtectedRoute>
          }
        />

        {/* Route for submitting weekly roomchecks. Restricted to RA access only. */}
        <Route
          path="/ra/room-check"
          element={
            <ProtectedRoute allowedRole="RA">
              <RoomCheckForm />
            </ProtectedRoute>
          }
        />
        {/* Route for dorm checkout form.*/}
        <Route
          path="/ra/dorm-checkouts"
          element={
            <ProtectedRoute allowedRole="RA">
              <DormCheckout />
            </ProtectedRoute>
          }
        />
        {/* Route for Hall Huddle form. */}
        <Route
          path="/ra/hall-huddle"
          element={
            <ProtectedRoute allowedRole="RA">
              <HallHuddle />
            </ProtectedRoute>
          }
        />
        {/* Route for Profile Management */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRole="RA">
              <Profile />
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

        {/* Catch-all Route: If a user types a random URL, redirect them back to Login. */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;