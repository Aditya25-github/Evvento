// Import Firebase modules for v9+
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBkYpQg_rtRNP0VObYsnMGIvpr4-Jx2nk",
  authDomain: "login-page-67d9a.firebaseapp.com",
  projectId: "login-page-67d9a",
  storageBucket: "login-page-67d9a.firebasestorage.app",
  messagingSenderId: "1086797334173",
  appId: "1:1086797334173:web:dacec82d8835ab74b03674"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Wait until DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Switch to login form
  document.getElementById('switch-to-login').addEventListener('click', function () {
    document.getElementById('signup-box').style.display = 'none';
    document.getElementById('login-box').style.display = 'block';
  });

  // Switch to signup form
  document.getElementById('switch-to-signup').addEventListener('click', function () {
    document.getElementById('login-box').style.display = 'none';
    document.getElementById('signup-box').style.display = 'block';
  });

  // Sign up user
  document.getElementById('signup-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("Account created successfully!");
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  });

  // Login user
  document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // Ensure login-button exists before updating
        const loginButton = document.getElementById('login-button');
        if (loginButton) {
          if (user.displayName) {
            loginButton.textContent = `Welcome, ${user.displayName}`;
          } else {
            loginButton.textContent = `Welcome, ${user.email}`;
          }
        }

        // Optionally redirect or update the page
        window.location.href = "index.html";
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  });

  // Listen for auth state changes (to keep track of logged-in user)
  onAuthStateChanged(auth, (user) => {
    const loginButton = document.getElementById('login-button');
    if (loginButton) {
      if (user) {
        if (user.displayName) {
          loginButton.textContent = `Welcome, ${user.displayName}`;
        } else {
          loginButton.textContent = `Welcome, ${user.email}`;
        }
      } else {
        loginButton.textContent = 'Hi, Aditya';
      }
    }
  });
});
