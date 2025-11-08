import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./config";

/**
 * 🔹 Uygulama içinde kullanılacak sade kullanıcı tipi
 * Firebase'in karmaşık `User` tipinden ayırıyoruz.
 */
export interface AppUser {
  id: string;
  name: string;
  email: string;
}

/**
 * 🔹 Firebase Authentication + Firestore Wrapper
 * Kullanıcı kayıt, giriş, çıkış ve mevcut kullanıcı işlemleri burada.
 */
export const firebaseAuth = {
  /** ✅ Kullanıcı kaydı oluşturur (hem Firebase Auth hem Firestore'da) */
  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<AppUser> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userData: AppUser = {
        id: user.uid,
        name,
        email: user.email || email,
      };

      // Firestore'a ek olarak kullanıcı kaydı
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        createdAt: new Date().toISOString(),
      });

      return userData;
    } catch (err: any) {
      console.error("🔥 Firebase register error:", err.code, err.message);
      throw new Error(
        err.message ||
          "Registration failed. Please check your email and password."
      );
    }
  },

  /** ✅ Kullanıcı giriş yapar, Firestore'dan isim bilgisini çeker */
  login: async (email: string, password: string): Promise<AppUser> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      let userName = user.displayName || "User";

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const data = userDoc.data();
        if (data?.name) userName = data.name;
      } catch (firestoreErr) {
        console.warn("⚠️ Firestore kullanıcı verisi alınamadı:", firestoreErr);
      }

      return {
        id: user.uid,
        name: userName,
        email: user.email || email,
      };
    } catch (err: any) {
      console.error("🔥 Firebase login error:", err.code, err.message);
      throw new Error(
        err.message || "Login failed. Please check your credentials."
      );
    }
  },

  /** ✅ Oturumu kapatır */
  logout: async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error("⚠️ Logout error:", err.message);
      throw new Error("Logout failed.");
    }
  },

  /** ✅ Aktif kullanıcıyı döner */
  getCurrentUser: (): FirebaseUser | null => {
    return auth.currentUser;
  },
};

export default firebaseAuth;
