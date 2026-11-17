import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Mail,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import '../styles/Auth.css';

const ForgotPassword = () => {
  const { forgotPassword } = useApp();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError('Please provide your registered institutional email.');
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await forgotPassword(email);
      setSuccessMessage(res.message || `Password reset link dispatched to ${email}.`);
    } catch (err) {
      setError(err.message || 'Unable to process reset request. Please verify your email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-bg-blob-1" />
      <div className="auth-bg-blob-2" />

      <div className="auth-container single-column">
        <div className="auth-form-side">
          {/* Back link */}
          <Link to="/login" className="auth-back-link">
            <ArrowLeft size={16} /> Back to Sign In
          </Link>

          {!successMessage ? (
            <>
              <div className="auth-form-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                  <div className="auth-brand-icon" style={{ width: '32px', height: '32px' }}>
                    <KeyRound size={17} color="#ffffff" />
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)' }}>
                    Password Recovery
                  </span>
                </div>
                <h2>Forgot Password?</h2>
                <p>
                  No worries! Enter your registered academic email address, and we'll dispatch password recovery instructions.
                </p>
              </div>

              {error && (
                <div className="auth-alert-banner error">
                  <AlertCircle size={16} style={{ minWidth: '16px', marginTop: '2px' }} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form" noValidate>
                <div className="auth-input-group">
                  <label className="auth-input-label" htmlFor="reset-email">
                    Student Email Address
                  </label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">
                      <Mail size={16} />
                    </span>
                    <input
                      id="reset-email"
                      type="email"
                      className="auth-input"
                      placeholder="student@scholarhub.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary auth-submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? 'Dispatching Link...' : 'Send Reset Link'}
                  {!isLoading && <ArrowRight size={16} />}
                </button>
              </form>
            </>
          ) : (
            <div className="auth-success-card">
              <div className="auth-success-icon-wrapper">
                <CheckCircle2 size={30} />
              </div>
              <h3>Reset Link Sent!</h3>
              <p>{successMessage}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', marginTop: '1rem' }}>
                <Link to="/login" className="btn btn-primary auth-submit-btn">
                  Return to Sign In
                </Link>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSuccessMessage('');
                    setEmail('');
                  }}
                  style={{ fontSize: '0.8125rem' }}
                >
                  Try another email
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
