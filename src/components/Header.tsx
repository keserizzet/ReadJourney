import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { firebaseAuth } from '../firebase/authService';
import './Header.css';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      // Backend API logout
      const { authAPI } = await import('../services/api');
      await authAPI.logout();
    } catch (error) {
      console.error('Backend logout error:', error);
    }
    
    try {
      // Firebase logout
      await firebaseAuth.logout();
    } catch (error) {
      console.error('Firebase logout error:', error);
    } finally {
      dispatch(logout());
      navigate('/login');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => location.pathname === path || location.pathname === path.replace('/recommended', '/');
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/recommended" className="logo">
          READ JOURNEY
        </Link>
        
        <nav className={`user-nav ${isMenuOpen ? 'open' : ''}`}>
          <Link
            to="/recommended"
            className={`nav-link ${isActive('/recommended') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/library"
            className={`nav-link ${isActive('/library') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            My library
          </Link>
        </nav>

        <div className={`user-bar ${isMenuOpen ? 'open' : ''}`}>
          <div className="user-info">
            <div className="user-avatar">
              {user?.name ? getInitials(user.name) : 'U'}
            </div>
            <span className="user-name">{user?.name || 'User'}</span>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Log out
          </button>
        </div>

        <button 
          className={`burger-menu ${isMenuOpen ? 'open' : ''}`} 
          aria-label="Menu"
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;

