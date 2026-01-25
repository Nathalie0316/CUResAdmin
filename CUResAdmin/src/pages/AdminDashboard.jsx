import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function AdminDashboard() {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Dashboard</h1>

      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}

export default AdminDashboard;
