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
  const { isAuthenticated, user: currentReduxUser } = useAppSelector((state) => state.auth);

  /**
   * ✅ Firebase oturum değişikliklerini dinler
   * (Sayfa yenilenince otomatik giriş sağlar)
   */
  useEffect(() => {
    let isMounted = true;
    let hasInitialized = false;
    
    const unsubscribe = firebaseAuth.listenAuthChanges(async (user: any) => {
      if (!isMounted) return;
      
      // İlk yüklemede sadece bir kez çalış (loop önleme)
      if (!hasInitialized) {
        hasInitialized = true;
      }
      
      if (user) {
        // Backend token'ı koru, sadece user bilgisini güncelle
        const existingToken = localStorage.getItem("token");
        
        // Sadece kullanıcı değiştiyse veya Redux'ta yoksa dispatch et
        if (!currentReduxUser || currentReduxUser.id !== user.id) {
          if (existingToken) {
            // Backend token varsa onu kullan
            dispatch(setCredentials({ user, token: existingToken }));
          } else {
            // Token yoksa sadece user bilgisini kaydet (backend token login/register'da alınır)
            localStorage.setItem("user", JSON.stringify(user));
          }
        }
      } else {
        // Kullanıcı yoksa logout yap (sadece bir kez)
        if (isMounted && currentReduxUser && hasInitialized) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          dispatch(logout());
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [dispatch, currentReduxUser]);

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
