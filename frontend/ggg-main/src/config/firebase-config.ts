
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDfUWrOCgO0elT7zOOtoYSOr5zvC-QRZ4",
  authDomain: "securibottest.firebaseapp.com",
  projectId: "securibottest",
  storageBucket: "securibottest.firebasestorage.app",
  messagingSenderId: "842591098286",
  appId: "1:842591098286:web:9f0ffa0e35e8d7add3643f"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

