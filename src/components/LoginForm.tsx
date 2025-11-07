import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { LoginFormData } from '../pages/LoginPage';
import { useState } from 'react';

interface LoginFormProps {
  register: UseFormRegister<LoginFormData>;
  onSubmit: (e: React.FormEvent) => void;
  errors: FieldErrors<LoginFormData>;
  isSubmitting: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  register,
  onSubmit,
  errors,
  isSubmitting,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <h1 className="auth-title">
        Expand your mind, reading <span className="subtitle">a book</span>
      </h1>
      <div className="form-group">
        <label htmlFor="email">Mail:</label>
        <input
          id="email"
          type="email"
          placeholder="Your@email.com"
          {...register('email')}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-message">{errors.email.message}</span>}
      </div>
      <div className="form-group password-input">
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Yourpasswordhere"
          {...register('password')}
          className={errors.password ? 'error' : ''}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </button>
        {errors.password && <span className="error-message">{errors.password.message}</span>}
      </div>
      <button type="submit" className="submit-button" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Log In'}
      </button>
    </form>
  );
};

export default LoginForm;
