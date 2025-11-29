import React from "react";
import './AccountCreated.css';

const AccountCreated = () => {
  return (
    <div className="success-overlay">
      <div className="success-container">
        <h1>Account Created!</h1>
        <p>Redirecting to login...</p>
      </div>
    </div>
  );
};

export default AccountCreated;
