import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./config";

/**
 * 🔹 Uygulamada kullanılacak sade kullanıcı tipi
 */
export interface AppUser {
  id: string;
  name: string;
  email: string;
}

/**
 * 🔹 Firebase Authentication + Firestore Wrapper
 */
export const firebaseAuth = {
  /** ✅ Kullanıcı kaydı (Firebase + Firestore) */
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

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        createdAt: new Date().toISOString(),
      });

      // localStorage'a kalıcı kayıt (Netlify'da oturumun düşmesini engeller)
      localStorage.setItem("user", JSON.stringify(userData));
      const token = await user.getIdToken();
      localStorage.setItem("token", token);

      return userData;
    } catch (err: any) {
      console.error("🔥 Firebase register error:", err.code, err.message);
      throw new Error(err.message || "Registration failed.");
    }
  },

  /** ✅ Giriş yapar + Firestore’dan ismi çeker */
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

      const userData: AppUser = {
        id: user.uid,
        name: userName,
        email: user.email || email,
      };

      // 🔐 Oturum kalıcı olsun
      localStorage.setItem("user", JSON.stringify(userData));
      const token = await user.getIdToken();
      localStorage.setItem("token", token);

      return userData;
    } catch (err: any) {
      console.error("🔥 Firebase login error:", err.code, err.message);
      throw new Error(err.message || "Login failed.");
    }
  },

  /** 🚪 Oturumu kapatır */
  logout: async (): Promise<void> => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } catch (err: any) {
      console.error("⚠️ Logout error:", err.message);
      throw new Error("Logout failed.");
    }
  },

  /** 👀 Aktif kullanıcıyı döner */
  getCurrentUser: (): FirebaseUser | null => {
    return auth.currentUser;
  },

  /** 🧠 Oturum değişimlerini dinler (Netlify reload sonrası bile kalır) */
  listenAuthChanges: (callback: (user: AppUser | null) => void) => {
    return onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      if (user) {
        let name = user.displayName || "User";
        try {
          const docSnap = await getDoc(doc(db, "users", user.uid));
          const data = docSnap.data();
          if (data?.name) name = data.name;
        } catch {}

        const userData: AppUser = {
          id: user.uid,
          name,
          email: user.email || "",
        };

        // token yenileme
        const token = await user.getIdToken();
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
        callback(userData);
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        callback(null);
      }
    });
  },
};

export default firebaseAuth;
