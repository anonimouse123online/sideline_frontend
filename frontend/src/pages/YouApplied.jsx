import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, MapPin, Clock, DollarSign, ArrowLeft, Mail } from "lucide-react";
import Navbar from "../components/Navbar";
import Loading from '../function/loading'; 
import "./YouApplied.css";

const YouApplied = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const job = location.state?.job;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="youapplied-container">
      <Navbar />

      {job ? (
        <div className="youapplied-content">
          {/* Success Header */}
          <div className="success-header">
            <div className="success-icon">
              <CheckCircle size={48} />
            </div>
            <h1 className="success-title">Application Submitted Successfully!</h1>
            <p className="success-subtitle">
              Your application has been sent to the employer and is under review
            </p>
          </div>

          {/* Job Details Card */}
          <div className="job-details-card">
            <div className="card-header">
              <h2 className="job-title">{job.title}</h2>
              <p className="company-name">{job.company}</p>
            </div>

            <div className="job-meta-grid">
              <div className="meta-item">
                <MapPin className="meta-icon" size={18} />
                <div>
                  <span className="meta-label">Location</span>
                  <span className="meta-value">{job.location || "Remote"}</span>
                </div>
              </div>

              <div className="meta-item">
                <Clock className="meta-icon" size={18} />
                <div>
                  <span className="meta-label">Job Type</span>
                  <span className="meta-value">{job.job_type || "Full-time"}</span>
                </div>
              </div>

              <div className="meta-item">
                <DollarSign className="meta-icon" size={18} />
                <div>
                  <span className="meta-label">Budget</span>
                  <span className="meta-value">
                    ${job.min_budget || "0"} - ${job.max_budget || "Negotiable"}
                  </span>
                </div>
              </div>
            </div>

            {job.description && (
              <div className="job-description">
                <h3>Job Description</h3>
                <p>{job.description}</p>
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="next-steps-card">
            <h3>What's Next?</h3>
            <div className="steps-list">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <strong>Application Review</strong>
                  <p>The employer will review your application within 2-3 business days</p>
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <strong>Interview Process</strong>
                  <p>If selected, you'll be contacted for an interview</p>
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <strong>Final Decision</strong>
                  <p>You'll receive a response regarding the final decision</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className="btn-secondary" 
              onClick={() => navigate("/find-work")}
            >
              <ArrowLeft size={18} />
              Browse More Jobs
            </button>
            <button className="btn-primary">
              <Mail size={18} />
              Contact Support
            </button>
          </div>
        </div>
      ) : (
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>No Job Selected</h2>
          <p>Please go back and select a job to apply for.</p>
          <button 
            className="btn-primary" 
            onClick={() => navigate("/find-work")}
          >
            Back to Job Listings
          </button>
        </div>
      )}
    </div>
  );
};

export default YouApplied;