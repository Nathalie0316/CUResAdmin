import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function RADashboard() {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>RA Dashboard</h1>

      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}

export default RADashboard;
