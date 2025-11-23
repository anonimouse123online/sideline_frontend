import React, { useState, useEffect } from 'react';
import { X, Mail, User, Calendar, Phone, MapPin, Briefcase, Download } from 'lucide-react';
import './ViewApplicants.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000';

const ViewApplicants = ({ job, onClose, isVisible }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isVisible && job) {
      fetchApplicants();
    }
  }, [job, isVisible]);

  const fetchApplicants = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/applicants/jobs/${job.id}/applicants`);
      if (!res.ok) throw new Error(`Failed to fetch applicants: ${res.status}`);
      const data = await res.json();
      setApplicants(data);
    } catch (err) {
      console.error('Error fetching applicants:', err);
      setError('Failed to load applicants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicantId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/applicants/${applicantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update status');
      setApplicants(prev =>
        prev.map(a => (a.id === applicantId ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update application status');
    }
  };

  const handleDownloadResume = (applicant) => {
    if (applicant.resume_url) {
      window.open(applicant.resume_url, '_blank');
    } else {
      alert(`No resume available for ${applicant.first_name || ''} ${applicant.last_name || ''}`);
    }
  };

  const handleContact = (applicant) => {
    if (applicant.email) {
      window.location.href = `mailto:${applicant.email}?subject=Regarding your application for ${job.title}`;
    } else {
      alert('No email available to contact this applicant.');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="applicants-modal-overlay">
      <div className="applicants-modal">
        {/* Header */}
        <div className="applicants-header">
          <div className="applicants-title">
            <h2>Applicants for {job.title}</h2>
            <p className="applicants-subtitle">{applicants.length} applicants</p>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Applicants List */}
        <div className="applicants-content">
          {loading ? (
            <div className="loading-applicants">
              <div className="spinner"></div>
              <p>Loading applicants...</p>
            </div>
          ) : error ? (
            <div className="error-applicants">
              <p>{error}</p>
              <button onClick={fetchApplicants} className="retry-btn">Retry</button>
            </div>
          ) : applicants.length === 0 ? (
            <div className="no-applicants">
              <User size={48} className="no-applicants-icon" />
              <h3>No applicants yet</h3>
              <p>Applications will appear here when people apply to your job.</p>
            </div>
          ) : (
            <div className="applicants-list">
              {applicants.map((applicant) => {
                const fullName = `${applicant.first_name || ''} ${applicant.last_name || ''}`.trim() || 'Unknown Applicant';


                let skills = [];
                if (applicant.skills) {
                  if (Array.isArray(applicant.skills)) {
                    skills = applicant.skills;
                  } else if (typeof applicant.skills === 'string') {
                    try {
                      skills = JSON.parse(applicant.skills);
                      if (!Array.isArray(skills)) skills = [skills];
                    } catch {
                      skills = applicant.skills.split(',').map(s => s.trim());
                    }
                  }
                }

                return (
                  <div key={applicant.id} className="applicant-card">
                    {/* Applicant Header */}
                    <div className="applicant-header">
                      <div className="applicant-avatar">
                        {fullName.split(' ').map(n => n[0]).join('') || 'U'}
                      </div>
                      <div className="applicant-info">
                        <h3 className="applicant-name">{fullName}</h3>
                        <div className="applicant-meta">
                          <span className="applicant-location">
                            <MapPin size={14} />
                            {applicant.location || 'Location not specified'}
                          </span>
                          <span className="applicant-experience">
                            <Briefcase size={14} />
                            {applicant.experience || 'Experience not specified'}
                          </span>
                          <span className="applicant-date">
                            <Calendar size={14} />
                            Applied {applicant.applied_at ? new Date(applicant.applied_at).toLocaleDateString() : 'Date unknown'}
                          </span>
                        </div>
                      </div>
                      <div className="applicant-status-section">
                        <select
                          className={`status-select status-${applicant.status || 'pending'}`}
                          value={applicant.status || 'pending'}
                          onChange={(e) => handleStatusChange(applicant.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                    {/* Applicant Details */}
                    <div className="applicant-details">
                      <div className="contact-info">
                        <div className="contact-item">
                          <Mail size={16} />
                          <span>{applicant.email || 'No email provided'}</span>
                        </div>
                        <div className="contact-item">
                          <Phone size={16} />
                          <span>{applicant.phone || 'No phone provided'}</span>
                        </div>
                      </div>

                      {applicant.cover_letter && (
                        <div className="cover-letter">
                          <h4>Cover Letter</h4>
                          <p>{applicant.cover_letter}</p>
                        </div>
                      )}

                      {skills.length > 0 && (
                        <div className="applicant-skills">
                          <h4>Skills</h4>
                          <div className="skills-list">
                            {skills.map((skill, idx) => (
                              <span key={idx} className="skill-tag">{skill}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Applicant Actions */}
                    <div className="applicant-actions">
                      <button
                        className="action-btn resume-btn"
                        onClick={() => handleDownloadResume(applicant)}
                        disabled={!applicant.resume_url}
                      >
                        <Download size={16} />
                        {applicant.resume_url ? 'Download Resume' : 'No Resume'}
                      </button>
                      <button
                        className="action-btn contact-btn"
                        onClick={() => handleContact(applicant)}
                        disabled={!applicant.email}
                      >
                        <Mail size={16} />
                        Contact
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="applicants-footer">
          <button className="btn-secondary" onClick={onClose}>Close</button>
          {applicants.length > 0 && (
            <div className="applicants-stats">
              <span className="stat pending">{applicants.filter(a => a.status === 'pending').length} Pending</span>
              <span className="stat reviewed">{applicants.filter(a => a.status === 'reviewed').length} Reviewed</span>
              <span className="stat accepted">{applicants.filter(a => a.status === 'accepted').length} Accepted</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewApplicants;
