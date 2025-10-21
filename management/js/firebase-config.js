// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxDfuKB3gYgArg_ukdn9L1dm2gWT57WQA",
  authDomain: "personal-f5656.firebaseapp.com",
  projectId: "personal-f5656",
  storageBucket: "personal-f5656.firebasestorage.app",
  messagingSenderId: "587145077681",
  appId: "1:587145077681:web:db6c1cf5274ee153c5d390",
  measurementId: "G-M4QMQ1TYFB",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Export Firebase services for use in other modules
const auth = firebase.auth();

// Set persistence to local to keep user logged in
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .catch((error) => {
        console.error("Firebase persistence error:", error);
    });

// Export the Firebase services
window.db = db;
window.auth = auth;