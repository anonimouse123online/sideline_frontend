import React from "react";
import "./JobDeletedAlert.css";

const JobDeletedAlert = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="job-deleted-overlay">
      <div className="job-deleted-container">
        <p>✅ Job deleted successfully!</p>
      </div>
    </div>
  );
};

export default JobDeletedAlert;
