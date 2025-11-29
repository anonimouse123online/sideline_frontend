import React from "react";
import "./JobDeleteConfirm.css";

const JobDeleteConfirm = ({ isVisible, onConfirm, onCancel }) => {
  if (!isVisible) return null;

  return (
    <div className="job-delete-confirm">
      <p>Are you sure you want to delete this job?</p>
      <div className="job-delete-actions">
        <button className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button className="confirm-btn" onClick={onConfirm}>Delete</button>
      </div>
    </div>
  );
};

export default JobDeleteConfirm;
