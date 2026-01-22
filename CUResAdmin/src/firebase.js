import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { setPersistence, browserLocalPersistence } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCimMqW13cbnEqfNDRQ6G8PKC_FiI7IwDs",
  authDomain: "curesadmin.firebaseapp.com",
  projectId: "curesadmin",
  storageBucket: "curesadmin.firebasestorage.app",
  messagingSenderId: "46873507426",
  appId: "1:46873507426:web:9af5334a97a75abacf433b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)

setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Auth persistence error:", error);
  });
  
export const db = getFirestore(app)

console.log("Firebase initialized.")
