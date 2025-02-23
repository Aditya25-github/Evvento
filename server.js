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
