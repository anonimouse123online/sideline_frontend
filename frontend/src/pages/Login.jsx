// src/pages/LogInPage.jsx
import React, { useState } from 'react';
import { Eye, EyeOff, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Login.css';

const API_URL = import.meta.env.VITE_API_URL;

const LogInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

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
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();
      console.log('🔍 LOGIN RESPONSE:', { status: response.status, ok: response.ok, data });

      if (!response.ok) throw new Error(data.error || "Login failed");

      // Store user info in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("id", data.user.id);
      localStorage.setItem("token", data.token || data.accessToken || "");

      // Show modal
      setLoginSuccess(true);

      // Auto navigate after 2.5s
      setTimeout(() => {
        setLoginSuccess(false);
        navigate("/find-work");
      }, 2500);

    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Navbar />

      {/* Login Success Modal */}
      {loginSuccess && (
        <div className="login-success-modal">
          <div className="modal-content">
            <span className="checkmark">✅</span>
            <h2>Login Successful!</h2>
            <p>Welcome back! Redirecting...</p>
          </div>
        </div>
      )}

      <div className="login-main">
        <div className="login-hero">
          <div className="hero-content">
            <h1 className="hero-title">Find Your Perfect Side Hustle</h1>
            <p className="hero-subtitle">
              Join thousands of freelancers and part-timers earning extra income on their own schedule.
            </p>
          </div>
        </div>

        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <h1 className="login-title">Log in to Sideline</h1>
              <p className="login-subtitle">Welcome back! Please enter your details.</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
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
                <label htmlFor="password" className="form-label">Password</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
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

              <div className="forgot-password-wrapper">
                <a href="#" className="forgot-password-link">Forgot your password?</a>
              </div>

              <button 
                type="submit" 
                className="login-submit-btn"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;
