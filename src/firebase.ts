import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAQ_i5bgYjTdD7WTyPJK4MIHWTVpkT9Tdk",
  authDomain: "waterstrip-frontend.firebaseapp.com",
  projectId: "waterstrip-frontend",
  storageBucket: "waterstrip-frontend.firebasestorage.app",
  messagingSenderId: "900978134719",
  appId: "1:900978134719:web:c2386ff566e8e141a7400a",
  measurementId: "G-VXCGEXX1YJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ฟังก์ชันเข้าสู่ระบบด้วย Google
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};

// ฟังก์ชันออกจากระบบ
const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout Error:", error);
  }
};

export { auth, signInWithGoogle, logout };
