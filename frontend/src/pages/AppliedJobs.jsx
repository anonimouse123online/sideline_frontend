// src/pages/AppliedJobs.jsx
import React, { useState, useEffect } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import './AppliedJobs.css';

const API_URL = import.meta.env.VITE_API_URL;

const AppliedJobs = ({ userId, isVisible, onClose }) => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isVisible && userId) {
      fetchAppliedJobs();
    }
  }, [isVisible, userId]);

  const fetchAppliedJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/applicants/user/${userId}/applications`);
      const text = await res.text(); // raw response

      let data = [];
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Server did not return valid JSON. Response: ' + text);
      }

      if (!res.ok) throw new Error(data.error || 'Failed to fetch applied jobs');

      setAppliedJobs(data);
    } catch (err) {
      console.error('Error fetching applied jobs:', err);
      setError('Failed to load applied jobs');
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="applied-modal-overlay" onClick={onClose}>
      <div className="applied-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="applied-modal-header">
          <button className="back-btn" onClick={onClose}>
            <ArrowLeft size={18} /> Back
          </button>
          <h2>Applied Jobs</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="applied-modal-content">
          {loading ? (
            <p className="loading-text">Loading applied jobs...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : appliedJobs.length === 0 ? (
            <p className="empty-text">You haven't applied to any jobs yet.</p>
          ) : (
            <div className="applied-jobs-list">
              {appliedJobs.map((job) => (
                <div key={job.application_id} className="applied-job-item">
                  <h3>{job.job_title || 'Untitled Job'}</h3>
                  <p>{job.job_description || 'No description provided'}</p>
                  <p>Status: <strong>{job.status || 'Pending'}</strong></p>
                  <p>Position: {job.position || 'Not specified'}</p>
                  <p>Applied on: {job.applied_at ? new Date(job.applied_at).toLocaleDateString() : 'Unknown'}</p>
                  {job.contact_email && <p>Contact: {job.contact_email}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppliedJobs;
