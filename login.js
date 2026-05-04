import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDiuLz7pmzSJUkK5WpeH0epbzzt8rTx-VU",
  authDomain: "mileage-assist-user-accounts.firebaseapp.com",
  projectId: "mileage-assist-user-accounts",
  storageBucket: "mileage-assist-user-accounts.appspot.com",
  messagingSenderId: "831846666309",
  appId: "1:831846666309:web:d7e4ecdd23e9fcc2c6532c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginContainer = document.querySelector(".login-container");
const signUpBtn = document.querySelector(".sign-up-btn");
const loginBtn = document.querySelector(".login-btn");

console.log("js loaded");
console.log(loginContainer);
console.log(signUpBtn);
console.log(loginBtn);

function renderSignUpForm() {
  loginContainer.innerHTML = `
    <h1>Sign Up</h1>
            <input type="text" placeholder="First name" id="firstName">
        <input type="text" placeholder="Last name" name="Last name" id="lastName">
    <input id="email" type="email" placeholder="Email">
      <input id="password" type="password" placeholder="Password">
    <input id="confirm-password" type="password" placeholder="Confirm Password">
    <button class="login-btn" id="signup-submit" type="button">Submit</button>
  `;

  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const signupSubmitBtn = document.getElementById("signup-submit");
  const emailInput = document.getElementById("email");

  signupSubmitBtn.addEventListener("click", () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (email === "" || password === "" || confirmPassword === "") {
      alert("Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("Account created!");
        window.location.href = "index.html";
      })
      .catch((error) => {
        alert(error.message);
      });
  });
}

function handleLogin() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  if (!emailInput || !passwordInput) {
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (email === "" || password === "") {
    alert("Please fill out email and password.");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert(error.message);
    });
}

if (signUpBtn) {
  signUpBtn.addEventListener("click", renderSignUpForm);
}

if (loginBtn) {
  loginBtn.addEventListener("click", handleLogin);
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User:", user.email);
  } else {
    console.log("No user logged in");
  }
});