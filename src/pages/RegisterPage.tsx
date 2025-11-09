import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/slices/authSlice';
import firebaseAuth from '../firebase/authService';
import RegisterForm from '../components/RegisterForm';
import './AuthPage.css';

const registerSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup
    .string()
    .required('Email is required')
    .matches(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, 'Invalid email format'),
  password: yup
    .string()
    .required('Password is required')
    .min(7, 'Password must be at least 7 characters'),
});

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // 1. Firebase'e kayıt yap
      const firebaseUser = await firebaseAuth.register(data.name, data.email, data.password);
      
      // 2. Backend API'ye kayıt yap
      const { authAPI } = await import('../services/api');
      const backendResponse = await authAPI.register(data.name, data.email, data.password);
      
      // 3. Redux state'i güncelle
      dispatch(setCredentials({ 
        user: firebaseUser, 
        token: backendResponse.token 
      }));
      
      navigate('/recommended');
    } catch (error: any) {
      console.error('Registration error:', error);
      alert(error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <RegisterForm
        register={register}
        onSubmit={handleSubmit(onSubmit)}
        errors={errors}
        isSubmitting={isSubmitting}
      />
      <p className="auth-link">
        Already have an account? <Link to="/login">Log In</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
