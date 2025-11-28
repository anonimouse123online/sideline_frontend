// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Login.css";

const API_URL = import.meta.env.VITE_API_URL;

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1 = email, 2 = OTP
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await fetch(`${API_URL}/api/applicants/forgot-password/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // Backend always returns JSON
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to send OTP");

      setSuccessMsg("OTP sent to your email. It will expire in 2 minutes.");
      setStep(2);
    } catch (err) {
      console.error("Send OTP Error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and reset password
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await fetch(`${API_URL}/api/applicants/forgot-password/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");

      setSuccessMsg("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      console.error("Verify OTP Error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Navbar />
      <div className="login-main">
        <div className="login-hero">
          <div className="hero-content">
            <h1 className="hero-title">Reset Your Password</h1>
            <p className="hero-subtitle">
              {step === 1
                ? "Enter your email and we'll send a one-time password (OTP)."
                : "Enter the OTP sent to your email and your new password."}
            </p>
          </div>
        </div>

        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <h1 className="login-title">Forgot Password</h1>
              <p className="login-subtitle">Don’t worry, it happens to the best of us.</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {successMsg && <div className="alert alert-success">{successMsg}</div>}

            {step === 1 ? (
              <form onSubmit={handleSendOtp} className="login-form">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <div className="password-wrapper">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="form-input"
                      required
                    />
                    <Mail className="eye-icon" />
                  </div>
                </div>
                <button type="submit" className="login-submit-btn" disabled={loading}>
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="login-form">
                <div className="form-group">
                  <label htmlFor="otp" className="form-label">OTP</label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="form-input"
                    required
                  />
                </div>

                <button type="submit" className="login-submit-btn" disabled={loading}>
                  {loading ? "Verifying..." : "Reset Password"}
                </button>
              </form>
            )}

            <div className="forgot-password-wrapper" style={{ marginTop: "15px" }}>
              <a
                onClick={() => navigate("/login")}
                className="forgot-password-link"
                style={{ cursor: "pointer" }}
              >
                Back to login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
