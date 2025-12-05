import React, { useState } from "react";
import "./VerifyAccountModal.css";

const API_URL = import.meta.env.VITE_API_URL;

const VerifyAccountModal = ({ isVisible, onClose, userId, onVerified }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isVisible) return null;

  const handleSubmit = async () => {
    if (!selectedOption) {
      alert("Please select an option before submitting.");
      return;
    }
    if (!userId) {
      console.error("❌ Missing userId!");
      alert("User ID is missing. Cannot update email status.");
      return;
    }

    const sent = selectedOption === "yes";

    setLoading(true);
    console.log("userId:", userId, "sent_email:", sent);
    console.log("➡️ Sending verification PUT request", {
      userId,
      sent_email: sent,
    });

    try {
      console.log("VerifyAccountModal userId:", userId);

      const response = await fetch(
        `${API_URL}/api/applicants/${userId}/sent-email`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sent_email: sent }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update email status");
      }
      console.log("✅ Email status updated:", data);
      alert("✅ Email status updated successfully!");
      if (sent) onVerified();
      onClose();
    } catch (err) {
      console.error("❌ Email update error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleApprove = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/applicants/${userId}/sent-email`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sent_email: true }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to approve");

      console.log("User verified:", data);

      onVerified();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="back-btn" onClick={onClose}>
            ← Back
          </button>
          <h2>Verify Account</h2>
        </div>

        <p>
          To verify your account, please send an email to the team including
          your ID, selfie, and social media account.
        </p>

        <p>
          <strong>Have you sent the verification email?</strong>
        </p>
        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="verify-dropdown"
        >
          <option value="">Select an option</option>
          <option value="yes">Yes, I sent the email. Please check.</option>
          <option value="no">No, I haven't sent it yet.</option>
        </select>

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default VerifyAccountModal;
