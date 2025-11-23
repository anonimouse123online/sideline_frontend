import React from "react";
import "./LoginSuccessModal.css";

const LoginSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <span className="checkmark">✅</span>
          <h2>Login Successful!</h2>
        </div>
        <p>Welcome back! You are now logged in.</p>
        <button className="modal-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default LoginSuccessModal;
