import { initializeApp } from "firebase/app" // Import initializeApp from firebase/app 
import { getAuth } from "firebase/auth" // Import getAuth from firebase/auth
import { getFirestore } from "firebase/firestore" // Import getFirestore from firebase/firestore
import { setPersistence, browserLocalPersistence } from "firebase/auth"; // Import setPersistence and browserLocalPersistence

// App specific Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCimMqW13cbnEqfNDRQ6G8PKC_FiI7IwDs",
  authDomain: "curesadmin.firebaseapp.com",
  projectId: "curesadmin",
  storageBucket: "curesadmin.firebasestorage.app",
  messagingSenderId: "46873507426",
  appId: "1:46873507426:web:9af5334a97a75abacf433b"
};

// Initialize Firebase connection using the config
const app = initializeApp(firebaseConfig);

// Initialize the Auth service and export it so it can be used in Login and AuthContext
export const auth = getAuth(app)

// Set the login state to persist even if the user closes the browser tab (Local Persistence).
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Auth persistence error:", error);
  });

// Initialize the Firestore database and export it 
export const db = getFirestore(app)

console.log("Firebase initialized.")
