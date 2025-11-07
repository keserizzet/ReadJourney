import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './store/hooks';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './components/MainLayout';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import RecommendedPage from './pages/RecommendedPage';
import LibraryPage from './pages/LibraryPage';
import ReadingPage from './pages/ReadingPage';

function App() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/recommended" replace /> : <RegisterPage />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/recommended" replace /> : <LoginPage />}
        />
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
        <Route path="*" element={<Navigate to="/recommended" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
