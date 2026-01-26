import { createContext, useContext, useEffect, useState } from "react"; // Import necessary React hooks to manage context and state.
import { onAuthStateChanged } from "firebase/auth"; // Import Firebase auth state listener to track user login status.
import { auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions to get user role from the database.
import { db } from "../firebase"; // Import Firestore database instance.

const AuthContext = createContext(); // Create a new context for authentication data.

// AuthProvider component that wraps the app and provides auth state and role to its children.
export const AuthProvider = ({ children }) => {
// State to hold the current user, their role, and loading status.
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
// Listen for changes in authentication state.
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    setLoading(true); // Start loading whenever auth state changes.
    setUser(currentUser);

    if (currentUser) {
    // If a user exists and is logged in, fetch their role from Firestore.
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setRole(userSnap.data().role); // Set the role from Firestore data.
        } else {
          setRole(null); // No role found in database, set to null.
        }
      } catch (error) {
        console.error("Error fetching role:", error); // Log any errors during role fetch.
        setRole(null);
      }
    } else {
      setRole(null); // No user is logged in, set role to null.
    }

    // Finally, set loading to false after processing auth state change.
    setLoading(false); // ONLY stop loading after the role check is DONE.
  });

  return () => unsubscribe();
}, []);

  return (
    /* Provides the user, role, and loading status to any component that asks for it. */
    <AuthContext.Provider value={{ user, role, loading }}>

    {/* Ensures the rest of the app doesn't even try to load until we know if the user is logged in. */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily access the AuthContext in other components.
export const useAuth = () => {
  return useContext(AuthContext);
};
