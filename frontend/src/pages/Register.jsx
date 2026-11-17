import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  BookOpen,
  Hash,
  ArrowRight,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import '../styles/Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    university: 'Metropolitan Institute of Technology',
    department: 'Computer Science & Engineering',
    semester: '5th Semester',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required.';
    }

    if (!formData.university.trim()) {
      newErrors.university = 'College / University is required.';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Academic department is required.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!validate()) return;

    try {
      setIsLoading(true);
      await register(formData);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setAuthError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-bg-blob-1" />
      <div className="auth-bg-blob-2" />

      <div className="auth-container">
        {/* Left Side Feature Showcase */}
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
              Join Thousands of Students <span>Excelling Academically</span>.
            </h1>
            <p className="auth-hero-desc">
              Get full control of your college workload. Never miss attendance thresholds or project deadlines again.
            </p>

            <div className="auth-feature-pills">
              <div className="auth-feature-pill">
                <div className="auth-pill-icon">
                  <CheckCircle2 size={16} />
                </div>
                <span>Automated Shortfall & Attendance Calculator</span>
              </div>

              <div className="auth-feature-pill">
                <div className="auth-pill-icon purple">
                  <CheckCircle2 size={16} />
                </div>
                <span>Course-wise To-Do and Task Boards</span>
              </div>

              <div className="auth-feature-pill">
                <div className="auth-pill-icon green">
                  <CheckCircle2 size={16} />
                </div>
                <span>Shared Project Deliverables & Discussion Feeds</span>
              </div>
            </div>
          </div>

          <div className="auth-hero-footer">
            Free academic platform for students and project groups.
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="auth-form-side">
          <div className="auth-form-header">
            <h2>Create Student Account</h2>
            <p>Set up your profile to start organizing your courses and projects.</p>
          </div>

          {authError && (
            <div className="auth-alert-banner error">
              <AlertCircle size={16} style={{ minWidth: '16px', marginTop: '2px' }} />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Full Name & Student ID */}
            <div className="auth-form-grid">
              <div className="auth-input-group">
                <label className="auth-input-label" htmlFor="reg-name">
                  Full Name *
                </label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">
                    <User size={16} />
                  </span>
                  <input
                    id="reg-name"
                    type="text"
                    className={`auth-input ${errors.name ? 'error' : ''}`}
                    placeholder="e.g. Jordan Hayes"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>
                {errors.name && <span className="auth-field-error">{errors.name}</span>}
              </div>

              <div className="auth-input-group">
                <label className="auth-input-label" htmlFor="reg-id">
                  Student ID *
                </label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">
                    <Hash size={16} />
                  </span>
                  <input
                    id="reg-id"
                    type="text"
                    className={`auth-input ${errors.studentId ? 'error' : ''}`}
                    placeholder="e.g. CS-2024-8841"
                    value={formData.studentId}
                    onChange={(e) => handleChange('studentId', e.target.value)}
                  />
                </div>
                {errors.studentId && <span className="auth-field-error">{errors.studentId}</span>}
              </div>
            </div>

            {/* Email Address */}
            <div className="auth-input-group">
              <label className="auth-input-label" htmlFor="reg-email">
                Institutional Email Address *
              </label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <Mail size={16} />
                </span>
                <input
                  id="reg-email"
                  type="email"
                  className={`auth-input ${errors.email ? 'error' : ''}`}
                  placeholder="jordan.hayes@scholarhub.edu"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="auth-field-error">{errors.email}</span>}
            </div>

            {/* University & Department */}
            <div className="auth-form-grid">
              <div className="auth-input-group">
                <label className="auth-input-label" htmlFor="reg-university">
                  College / University *
                </label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">
                    <Building2 size={16} />
                  </span>
                  <input
                    id="reg-university"
                    type="text"
                    className={`auth-input ${errors.university ? 'error' : ''}`}
                    placeholder="e.g. Apex Institute of Technology"
                    value={formData.university}
                    onChange={(e) => handleChange('university', e.target.value)}
                  />
                </div>
                {errors.university && <span className="auth-field-error">{errors.university}</span>}
              </div>

              <div className="auth-input-group">
                <label className="auth-input-label" htmlFor="reg-department">
                  Department *
                </label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">
                    <BookOpen size={16} />
                  </span>
                  <input
                    id="reg-department"
                    type="text"
                    className={`auth-input ${errors.department ? 'error' : ''}`}
                    placeholder="e.g. Computer Science & Eng"
                    value={formData.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                  />
                </div>
                {errors.department && <span className="auth-field-error">{errors.department}</span>}
              </div>
            </div>

            {/* Semester */}
            <div className="auth-input-group">
              <label className="auth-input-label" htmlFor="reg-semester">
                Current Semester
              </label>
              <select
                id="reg-semester"
                className="auth-input"
                style={{ paddingLeft: '0.875rem' }}
                value={formData.semester}
                onChange={(e) => handleChange('semester', e.target.value)}
              >
                <option value="1st Semester">1st Semester</option>
                <option value="2nd Semester">2nd Semester</option>
                <option value="3rd Semester">3rd Semester</option>
                <option value="4th Semester">4th Semester</option>
                <option value="5th Semester">5th Semester</option>
                <option value="6th Semester">6th Semester</option>
                <option value="7th Semester">7th Semester</option>
                <option value="8th Semester">8th Semester</option>
              </select>
            </div>

            {/* Passwords */}
            <div className="auth-form-grid">
              <div className="auth-input-group">
                <label className="auth-input-label" htmlFor="reg-password">
                  Password *
                </label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">
                    <Lock size={16} />
                  </span>
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    className={`auth-input has-toggle ${errors.password ? 'error' : ''}`}
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
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

              <div className="auth-input-group">
                <label className="auth-input-label" htmlFor="reg-confirm">
                  Confirm Password *
                </label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">
                    <Lock size={16} />
                  </span>
                  <input
                    id="reg-confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`auth-input has-toggle ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Re-type password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  />
                  <button
                    type="button"
                    className="auth-password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="auth-field-error">{errors.confirmPassword}</span>}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Complete Registration'}
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Footer Prompt */}
          <div className="auth-footer-prompt">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
