import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from
  "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBvKbWiKOzPWkjLu3MPuKkSrLqtNZjPcg0",
  authDomain: "digital-footprint-quiz.firebaseapp.com",
  projectId: "digital-footprint-quiz",
  storageBucket: "digital-footprint-quiz.firebasestorage.app",
  messagingSenderId: "970607514225",
  appId: "1:970607514225:web:57ef2adebef1fe83dcc1d0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account"
});

const loginButton = document.getElementById("google-login-btn");
const loginError = document.getElementById("login-error");

loginButton.addEventListener("click", async () => {
  loginButton.disabled = true;
  loginError.hidden = true;

  try {
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();

    // Ask our server to verify the Firebase token.
    const response = await fetch("/api/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "same-origin",
      body: JSON.stringify({ token })
    });

    if (!response.ok) {
      throw new Error("Please sign in with your university account.");
    }

    // Remove the client Firebase session.
    // The server cookie is now responsible for access.
    await signOut(auth);

    window.location.replace("/");

  } catch (error) {
    loginError.textContent =
      error.message || "Unable to sign in.";
    loginError.hidden = false;

  } finally {
    loginButton.disabled = false;
  }
});