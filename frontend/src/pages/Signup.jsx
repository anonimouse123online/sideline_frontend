// src/pages/SignUpPage.jsx
import React, { useState } from 'react';
import { Eye, EyeOff, Phone } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import './Signup.css';

const API_URL = import.meta.env.VITE_API_URL;


const SignUpPage = () => {
  const navigate = useNavigate();

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

      navigate("/login");

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
                  <label className="form-label">First name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Last name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone number (optional)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
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
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="signup-submit-btn"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>

            </form>

            <div className="login-link-wrapper">
              <p>
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
