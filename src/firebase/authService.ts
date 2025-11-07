import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    type User as FirebaseUser,
  } from "firebase/auth";
  import { doc, setDoc, getDoc } from "firebase/firestore";
  import { auth, db } from "./config";
  
  // App içinde kullanılacak sade user tipi:
  export interface AppUser {
    id: string;
    name: string;
    email: string;
  }
  
  /**
   * Firebase Authentication + Firestore wrapper
   * FirebaseUser (firebase tipi) ve AppUser (bizim tipi) ayrı tutulur.
   */
  export const firebaseAuth = {
    /** 🔹 Kullanıcı kaydı oluşturur (Firebase + Firestore) */
    register: async (
      name: string,
      email: string,
      password: string
    ): Promise<AppUser> => {
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
  
      try {
        await setDoc(doc(db, "users", user.uid), {
          name,
          email,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn("⚠️ Firestore kaydı başarısız oldu:", err);
      }
  
      return userData;
    },
  
    /** 🔹 Giriş yapar, Firestore’dan isim bilgisini de çeker */
    login: async (email: string, password: string): Promise<AppUser> => {
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
      } catch (err) {
        console.warn("⚠️ Firestore kullanıcı verisi alınamadı:", err);
      }
  
      return {
        id: user.uid,
        name: userName,
        email: user.email || email,
      };
    },
  
    /** 🔹 Oturumu kapatır */
    logout: async (): Promise<void> => {
      await signOut(auth);
    },
  
    /** 🔹 Aktif kullanıcıyı döner */
    getCurrentUser: (): FirebaseUser | null => {
      return auth.currentUser;
    },
  };
  