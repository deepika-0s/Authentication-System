import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import useForm from '../hooks/useForm';

const validate = (values) => {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Name is required';
  else if (values.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';

  if (!values.email.trim()) errors.email = 'Email is required';
  else if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'Enter a valid email address';

  if (!values.password) errors.password = 'Password is required';
  else if (values.password.length < 6) errors.password = 'Password must be at least 6 characters';

  if (!values.confirmPassword) errors.confirmPassword = 'Please confirm your password';
  else if (values.password !== values.confirmPassword) errors.confirmPassword = 'Passwords do not match';

  return errors;
};

const SignupPage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, validateAll } = useForm(
    { name: '', email: '', password: '', confirmPassword: '' },
    validate
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMsg('');

    if (!validateAll()) return;

    setLoading(true);
    try {
      const res = await authService.signup(values);
      setSuccessMsg(res.data.message);
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors?.length) {
        setServerError(data.errors[0].message);
      } else {
        setServerError(data?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">⬡</div>
          <h1>Create Account</h1>
          <p>Join us today. It's free.</p>
        </div>

        {serverError && <div className="alert alert-error">{serverError}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className={`field ${touched.name && errors.name ? 'field-error' : ''}`}>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="name"
            />
            {touched.name && errors.name && <span className="field-msg">{errors.name}</span>}
          </div>

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
              placeholder="Min. 6 characters"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="new-password"
            />
            {touched.password && errors.password && <span className="field-msg">{errors.password}</span>}
          </div>

          <div className={`field ${touched.confirmPassword && errors.confirmPassword ? 'field-error' : ''}`}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="new-password"
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <span className="field-msg">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <span className="spinner-sm" /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
