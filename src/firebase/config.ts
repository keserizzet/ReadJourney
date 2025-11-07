import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * 🔧 Firebase yapılandırması (.env dosyasındaki VITE_ değişkenlerini kullanır)
 * Her alan için fallback (yedek) değer atanmıştır, eksik olursa hata vermez.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBcaVQwIKx8i_qzTCQ-OoqeZxWPeTCXihk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "readjourney-3ba9c.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "readjourney-3ba9c",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "readjourney-3ba9c.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "615022793143",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:615022793143:web:6359a595eb018bd1c49832",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ERY46RZSSJ",
};

// 🔥 Firebase'i başlat
const app = initializeApp(firebaseConfig);

// 🧩 Auth & Firestore servisleri
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
