import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup,
  onAuthStateChanged, signOut, setPersistence, browserLocalPersistence, GoogleAuthProvider,
  RecaptchaVerifier, multiFactor, PhoneAuthProvider, sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

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
const provider = new GoogleAuthProvider();

// Enable session persistence
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Session persistence enabled"))
  .catch((error) => console.error("Persistence error:", error));

// Wait until DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  console.log("DOM Loaded!");

  // 🔹 Form Switching Logic
  const signupBox = document.getElementById('signup-box');
  const loginBox = document.getElementById('login-box');
  const switchToSignup = document.getElementById('switch-to-signup');
  const switchToLogin = document.getElementById('switch-to-login');

  if (switchToSignup) {
    switchToSignup.addEventListener('click', function (event) {
      event.preventDefault();
      console.log("Switching to Signup Form");
      loginBox.style.display = "none";
      signupBox.style.display = "block";
    });
  }

  if (switchToLogin) {
    switchToLogin.addEventListener('click', function (event) {
      event.preventDefault();
      console.log("Switching to Login Form");
      signupBox.style.display = "none";
      loginBox.style.display = "block";
    });
  }

  // 🔹 Handle user sign-up
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', function (event) {
      event.preventDefault();
      console.log("Signup button clicked!");

      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;

      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log("User created:", userCredential.user);
          alert("Account created successfully!");
          window.location.href = "index.html"; // Redirect after signup
        })
        .catch((error) => {
          console.error("Signup Error:", error.message);
          alert("Signup Error: " + error.message);
        });
    });
  }

  // 🔹 Handle user login with MFA
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();
      console.log("Login button clicked!");

      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;

          // 🔹 Check if MFA is required
          if (multiFactor(user).enrolledFactors.length > 0) {
            setupRecaptcha();
            sendVerificationCode(user);
          } else {
            alert("Login successful!");
            window.location.href = "index.html";
          }
        })
        .catch((error) => {
          console.error("Login Error:", error.message);
          alert("Login Error: " + error.message);
        });
    });
  }
  // 🔹 Forgot Password Logic
  const forgotPasswordLink = document.getElementById("forgot-password");

  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", function (event) {
      event.preventDefault();

      const email = document.getElementById("login-email").value; // ✅ Get email from input field

      if (!email) {
        alert("Please enter your email in the input field before clicking 'Forgot Password'.");
        return;
      }

      sendPasswordResetEmail(auth, email)
        .then(() => {
          alert("Password reset link sent! Check your email.");
        })
        .catch((error) => {
          console.error("Error sending password reset email:", error.message);
          alert("Error: " + error.message);
        });
    });
  }

  // 🔹 Google Sign-In
  const googleLoginButton = document.getElementById('google-login');
  if (googleLoginButton) {
    googleLoginButton.addEventListener('click', function () {
      console.log("Google Login Clicked!");

      signInWithPopup(auth, provider)
        .then((result) => {
          console.log("Google Sign-In Successful:", result.user);
          alert("Google Login Successful!");
          window.location.href = "index.html"; // Redirect after login
        })
        .catch((error) => {
          console.error("Google Login Error:", error.message);
          alert("Google Login Error: " + error.message);
        });
    });
  }

  // 🔹 Check authentication state
  const authButton = document.getElementById('auth-button');
  const greeting = document.getElementById('navbar-greeting');

  if (authButton && greeting) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        greeting.textContent = `Hi, ${user.displayName || user.email.split("@")[0]}`;
        authButton.textContent = "Logout";
        authButton.onclick = () => {
          signOut(auth).then(() => {
            window.location.href = "index.html";
          }).catch((error) => {
            alert("Logout Error: " + error.message);
          });
        };
      } else {
        greeting.textContent = "Hi, Guest";
        authButton.textContent = "Login";
        authButton.onclick = () => {
          window.location.href = "login.html";
        };
      }
    });
  }
});

// 🔹 Setup reCAPTCHA for Firebase Phone Verification
function setupRecaptcha() {
  window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
    'size': 'normal',  // 🔹 Change from 'invisible' to 'normal'
    'callback': (response) => {
      console.log("reCAPTCHA solved:", response);
    },
    'expired-callback': () => {
      console.log("reCAPTCHA expired. Please refresh.");
    }
  }, auth);
}

// 🔹 Send OTP for Multi-Factor Authentication
function sendVerificationCode(user) {
  if (!user) {
    console.error("MFA Error: User not found.");
    return;
  }

  if (multiFactor(user).enrolledFactors.length === 0) {
    console.log("User does not have MFA enabled.");
    return;
  }

  setupRecaptcha(); // Ensure reCAPTCHA is set up before sending OTP

  const phoneNumber = prompt("Enter your phone number for MFA verification:");
  if (!phoneNumber) {
    alert("Phone number is required for MFA.");
    return;
  }

  const phoneAuthProvider = new PhoneAuthProvider(auth);

  multiFactor(user).getSession()
    .then((multiFactorSession) => {
      return phoneAuthProvider.verifyPhoneNumber(phoneNumber, window.recaptchaVerifier);
    })
    .then((verificationId) => {
      const otpCode = prompt("Enter the verification code sent to your phone:");
      if (!otpCode) {
        alert("OTP is required.");
        return;
      }

      const credential = PhoneAuthProvider.credential(verificationId, otpCode);
      return multiFactor(user).enroll(credential, "Phone Number");
    })
    .then(() => {
      alert("Multi-Factor Authentication enabled successfully!");
    })
    .catch((error) => {
      console.error("MFA Setup Error:", error.message);
      alert("MFA Error: " + error.message);
    });
}
