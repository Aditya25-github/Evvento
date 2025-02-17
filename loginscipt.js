// Firebase configuration (Replace with your own Firebase credentials)
const firebaseConfig = {
  apiKey: "AIzaSyBZSReQJ-EfPAwzFIMls06oOXomi2F1uWQ",
  authDomain: "evvento-330ee.firebaseapp.com",
  projectId: "evvento-330ee",
  storageBucket: "evvento-330ee.firebasestorage.app",
  messagingSenderId: "918550839957",
  appId: "1:918550839957:web:ec7c69bae0f4d19713519c",
  measurementId: "G-PFG9EPSECB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

let isSignup = false; // Track login/signup mode

function handleAuth() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const message = document.getElementById("message");

  if (isSignup) {
      // Signup new user
      auth.createUserWithEmailAndPassword(email, password)
          .then(() => message.textContent = "Signup successful! You can now login.")
          .catch(error => message.textContent = error.message);
  } else {
      // Login existing user
      auth.signInWithEmailAndPassword(email, password)
          .then(() => message.textContent = "Login successful!")
          .catch(error => message.textContent = error.message);
  }
}

function toggleForm() {
  isSignup = !isSignup;
  document.getElementById("form-title").textContent = isSignup ? "Sign Up" : "Login";
  document.getElementById("auth-btn").textContent = isSignup ? "Sign Up" : "Login";
  document.querySelector(".toggle-btn").textContent = isSignup ? "Switch to Login" : "Switch to Signup";
}
