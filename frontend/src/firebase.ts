import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDhUhxhy6_sHjOvR2vbfT-09mF5fLT1Hjc",
  authDomain: "travel-stream.firebaseapp.com",
  projectId: "travel-stream",
  storageBucket: "travel-stream.firebasestorage.app",
  messagingSenderId: "733203797875",
  appId: "1:733203797875:web:a210785cf4c5716ac3d706",
  measurementId: "G-LGT73Z8SLV",
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);

const auth = getAuth(app);

export { auth };
