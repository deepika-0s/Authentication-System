import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import useForm from '../hooks/useForm';

const validate = (values) => {
  const errors = {};
  if (!values.email.trim()) errors.email = 'Email is required';
  else if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'Enter a valid email address';
  if (!values.password) errors.password = 'Password is required';
  return errors;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('session') === 'expired') {
      setSessionExpired(true);
    }
  }, [location]);

  const { values, errors, touched, handleChange, handleBlur, validateAll } = useForm(
    { email: '', password: '' },
    validate
  );

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSessionExpired(false);

    if (!validateAll()) return;

    setLoading(true);
    try {
      const res = await authService.login(values);
      const { token, user } = res.data;
      login(token, user);
      navigate(from, { replace: true });
    } catch (err) {
      const data = err.response?.data;
      setServerError(data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">⬡</div>
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        {sessionExpired && (
          <div className="alert alert-warning">Your session expired. Please log in again.</div>
        )}
        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className={`field ${touched.email && errors.email ? 'field-error' : ''}`}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="email"
            />
            {touched.email && errors.email && <span className="field-msg">{errors.email}</span>}
          </div>

          <div className={`field ${touched.password && errors.password ? 'field-error' : ''}`}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Your password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="current-password"
            />
            {touched.password && errors.password && <span className="field-msg">{errors.password}</span>}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <span className="spinner-sm" /> : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
