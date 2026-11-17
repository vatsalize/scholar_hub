import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  CalendarCheck,
  Kanban,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import authService from '../services/authService';
import '../styles/Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useApp();

  // Remembered email if available
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Validation & Error states
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Prepopulate remembered email
  useEffect(() => {
    const remembered = authService.getRememberedEmail();
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  // Quick fill demo student account
  const handleFillDemo = () => {
    setEmail('alex.morgan@scholarhub.edu');
    setPassword('password123');
    setErrors({});
    setAuthError('');
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please provide a valid email format (e.g. student@college.edu).';
    }

    if (!password) {
      newErrors.password = 'Password cannot be empty.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!validate()) return;

    try {
      setIsLoading(true);
      await login(email, password, rememberMe);

      // Redirect to destination path or dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      setAuthError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-bg-blob-1" />
      <div className="auth-bg-blob-2" />

      <div className="auth-container">
        {/* Left Side: Brand & Feature Showcase */}
        <div className="auth-hero-side">
          <div className="auth-brand-badge">
            <div className="auth-brand-icon">
              <GraduationCap size={22} color="#ffffff" />
            </div>
            <div className="auth-brand-text">
              Scholar<span>Hub</span>
            </div>
          </div>

          <div className="auth-hero-content">
            <h1 className="auth-hero-title">
              Your Complete <span>Academic Suite</span> in One Place.
            </h1>
            <p className="auth-hero-desc">
              Manage course attendance, organize homework on dynamic Kanban boards, and collaborate on capstone projects seamlessly.
            </p>

            <div className="auth-feature-pills">
              <div className="auth-feature-pill">
                <div className="auth-pill-icon">
                  <CalendarCheck size={16} />
                </div>
                <span>75% Minimum Attendance & Safe Bunk Tracking</span>
              </div>

              <div className="auth-feature-pill">
                <div className="auth-pill-icon purple">
                  <Kanban size={16} />
                </div>
                <span>Sprint Task Management & Kanban Board</span>
              </div>

              <div className="auth-feature-pill">
                <div className="auth-pill-icon green">
                  <Users size={16} />
                </div>
                <span>Real-Time Collaborative Project Workspaces</span>
              </div>
            </div>
          </div>

          <div className="auth-hero-footer">
            © 2026 Scholar Hub Academic Platform. Designed for modern students.
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="auth-form-side">
          <div className="auth-form-header">
            <h2>Welcome Back</h2>
            <p>Enter your student credentials to access your dashboard.</p>
          </div>

          {authError && (
            <div className="auth-alert-banner error">
              <AlertCircle size={16} style={{ minWidth: '16px', marginTop: '2px' }} />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Email Field */}
            <div className="auth-input-group">
              <label className="auth-input-label" htmlFor="login-email">
                Institutional / Student Email
              </label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <Mail size={16} />
                </span>
                <input
                  id="login-email"
                  type="email"
                  className={`auth-input ${errors.email ? 'error' : ''}`}
                  placeholder="student@scholarhub.edu"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="auth-field-error">{errors.email}</span>}
            </div>

            {/* Password Field */}
            <div className="auth-input-group">
              <label className="auth-input-label" htmlFor="login-password">
                Password
              </label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <Lock size={16} />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`auth-input has-toggle ${errors.password ? 'error' : ''}`}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: null });
                  }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth-password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="auth-field-error">{errors.password}</span>}
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="auth-options-row">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="auth-link">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In to Dashboard'}
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Quick Demo Credentials Helper */}
          <div className="auth-demo-hint">
            <div className="demo-hint-text">
              <span className="demo-hint-title">Quick Demo Login</span>
              <span className="demo-hint-creds">
                <strong>alex.morgan@scholarhub.edu</strong> • pass: <strong>password123</strong>
              </span>
            </div>
            <button
              type="button"
              className="btn-fill-demo"
              onClick={handleFillDemo}
            >
              Autofill
            </button>
          </div>

          {/* Footer Prompt */}
          <div className="auth-footer-prompt">
            Don't have a Scholar Hub account?{' '}
            <Link to="/register" className="auth-link">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
