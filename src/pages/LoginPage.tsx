import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/slices/authSlice';
import firebaseAuth from '../firebase/authService';
import './AuthPage.css';

const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .matches(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, 'Invalid email format'),
  password: yup
    .string()
    .required('Password is required')
    .min(7, 'Password must be at least 7 characters'),
});

export interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      // 1. Firebase'e giriş yap
      const firebaseUser = await firebaseAuth.login(data.email, data.password);
      
      // 2. Backend API'ye giriş yap
      const { authAPI } = await import('../services/api');
      let backendResponse;
      try {
        backendResponse = await authAPI.login(data.email, data.password);
      } catch (backendError: any) {
        // Backend'de kullanıcı yoksa kayıt et
        if (backendError.response?.status === 401 || backendError.response?.status === 404) {
          try {
            backendResponse = await authAPI.register(firebaseUser.name, data.email, data.password);
          } catch (registerError: any) {
            if (registerError.response?.status === 409) {
              alert('This email already exists in the backend. Please check your password.');
              return;
            }
            throw registerError;
          }
        } else {
          throw backendError;
        }
      }
      
      // 3. Redux state'i güncelle
      dispatch(setCredentials({ 
        user: firebaseUser, 
        token: backendResponse.token 
      }));
      
      navigate('/recommended');
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.message || 'Authentication failed. Please check your email and password.');
    }
  };

  return (
    <div className="auth-layout">
      {/* SOL KISIM */}
      <div className="auth-left">
        <div className="auth-form">
          <h1 className="auth-title">
            Expand your
            <br />
            mind, reading
            <span className="subtitle"> a book</span>
          </h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>Mail:</label>
              <input
                type="email"
                placeholder="Your@email.com"
                {...register('email')}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && (
                <span className="error-message">{errors.email.message}</span>
              )}
            </div>

            <div className="form-group password-input">
              <label>Password:</label>
              <input
                type="password"
                placeholder="Yourpasswordhere"
                {...register('password')}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && (
                <span className="error-message">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="auth-bottom">
              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-button"
              >
                Log In
              </button>
              <p className="auth-link-inline">
                Don’t have an account? <Link to="/register">Register</Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* SAĞ KISIM */}
      <div className="auth-right">
        <img src="src/assets/loginimg.png" alt="App Preview" />
      </div>
    </div>
  );
};

export default LoginPage;
