// src/pages/SignUpPage.jsx
import React, { useState } from 'react';
import { Eye, EyeOff, Phone } from 'lucide-react';
import Navbar from '../components/Navbar';
import './Signup.css';

const API_URL = import.meta.env.VITE_API_URL;

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await fetch(`${API_URL}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || "",
        password: formData.password
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Signup failed");
    }

    alert("✅ Account created successfully!");
    window.location.href = "/Login";

  } catch (err) {
    console.error("Signup error:", err);
    setError(err.message || "Failed to create account. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="signup-page">
      <Navbar />

      <div className="signup-main">
        {/* Left Side — Hero Content */}
        <div className="signup-hero">
          <div className="hero-content">
            <h1 className="hero-title">Start Earning on Your Own Terms</h1>
            <p className="hero-subtitle">
              Join Sideline today and unlock flexible work opportunities tailored to your skills and schedule.
            </p>
            <div className="hero-benefits">
              <div className="benefit-item">
                <div className="benefit-icon">✓</div>
                <div>
                  <h3 className="benefit-title">Flexible Hours</h3>
                  <p className="benefit-desc">Work when it suits you — no fixed schedules.</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">✓</div>
                <div>
                  <h3 className="benefit-title">Multiple Income Streams</h3>
                  <p className="benefit-desc">Take on multiple gigs to boost your earnings.</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">✓</div>
                <div>
                  <h3 className="benefit-title">Secure Payments</h3>
                  <p className="benefit-desc">Get paid safely and on time, every time.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side — Signup Form */}
        <div className="signup-container">
          <div className="signup-card">
            <div className="signup-header">
              <h1 className="signup-title">Create your account</h1>
              <p className="signup-subtitle">Join Sideline and start your journey today.</p>
            </div>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="signup-form">
              <div className="name-grid">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">First name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    className="form-input"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">Last name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    className="form-input"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="form-input"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone number (optional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className="form-input"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a password"
                    className="form-input password-field"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle-btn"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="eye-icon" /> : <Eye className="eye-icon" />}
                  </button>
                </div>
              </div>

              <div className="terms-wrapper">
                <p className="terms-text">
                  By creating an account, you agree to our{' '}
                  <a href="#" className="terms-link">Terms of Service</a>{' '}
                  and acknowledge our{' '}
                  <a href="#" className="terms-link">Privacy Policy</a>.
                </p>
              </div>

              <button 
                type="submit" 
                className="signup-submit-btn"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>

              <div className="divider">
                <div className="divider-line"></div>
                <span className="divider-text">or continue with</span>
                <div className="divider-line"></div>
              </div>

              <div className="social-login-buttons">
                <button type="button" className="social-btn" disabled>
                  <svg className="social-icon google-icon" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button type="button" className="social-btn" disabled>
                  <svg className="social-icon facebook-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
                <button type="button" className="social-btn" disabled>
                  <Phone className="social-icon" />
                  Phone
                </button>
              </div>
            </form>

            <div className="login-link-wrapper">
              <p className="login-text">
                Already have an account? <a href="/login" className="login-link">Sign in</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;