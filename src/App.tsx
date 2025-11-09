import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "./store/hooks";
import { setCredentials, logout } from "./store/slices/authSlice";
import firebaseAuth from "./firebase/authService";

// Sayfalar
import PrivateRoute from "./components/PrivateRoute";
import MainLayout from "./components/MainLayout";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import RecommendedPage from "./pages/RecommendedPage";
import LibraryPage from "./pages/LibraryPage";
import ReadingPage from "./pages/ReadingPage";

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  /**
   * ✅ Firebase oturum değişikliklerini dinler
   * (Sayfa yenilenince veya token yenilenince otomatik giriş sağlar)
   */
  useEffect(() => {
    let isMounted = true;
    
    const unsubscribe = firebaseAuth.listenAuthChanges(async (user: any) => {
      if (!isMounted) return;
      
      if (user) {
        // Token kontrolü - eğer token yoksa veya geçersizse, backend'den token al
        let token: string | null = localStorage.getItem("token");
        
        // Token yoksa veya geçersizse, Firebase token'ı kullan
        if (!token) {
          try {
            token = await user.getIdToken();
            if (token) {
              localStorage.setItem("token", token);
            }
          } catch (err) {
            console.error("Token alınamadı:", err);
            dispatch(logout());
            return;
          }
        }
        
        if (token) {
          dispatch(setCredentials({ user, token }));
        }
      } else {
        // Kullanıcı yoksa logout yap
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch(logout());
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* 🔹 Register Sayfası */}
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/recommended" replace />
            ) : (
              <RegisterPage />
            )
          }
        />

        {/* 🔹 Login Sayfası */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/recommended" replace />
            ) : (
              <LoginPage />
            )
          }
        />

        {/* 🔹 Ana Uygulama (korumalı alan) */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/recommended" replace />} />
          <Route path="recommended" element={<RecommendedPage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="reading/:bookId" element={<ReadingPage />} />
        </Route>

        {/* 🔹 Hatalı yönlendirmelerde varsayılan sayfa */}
        <Route path="*" element={<Navigate to="/recommended" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
