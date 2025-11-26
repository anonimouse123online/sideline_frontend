// src/pages/FindWork.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Briefcase, Star, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Loading from '../function/loading'; 
import './FindWork.css';

const API_URL = import.meta.env.VITE_API_URL;


const FindWork = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [navigatingToJob, setNavigatingToJob] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError('');

      try {
        const endpoint = `${API_URL}/api/jobs`;
        const res = await fetch(endpoint);

        const contentType = res.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          const text = await res.text();
          throw new Error(`Expected JSON, got HTML: ${text.substring(0, 100)}...`);
        }

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP ${res.status}`);
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error('API did not return an array');
        }

        setJobs(data);
      } catch (err) {
        console.error('❌ Error fetching jobs:', err);
        setError(err.message || 'Failed to load jobs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleJobClick = (jobId) => {
    if (!jobId) {
      console.error("Job ID missing");
      return;
    }


    setNavigatingToJob(true);
    navigate(`/job/${jobId}`);
  };

  const filteredJobs = jobs.filter((job) => {
    const title = (job.title || '').toLowerCase();
    const company = (job.company || '').toLowerCase();
    const location = (job.location || '').toLowerCase();
    const category = job.category || '';

    const matchesSearch = searchTerm
      ? title.includes(searchTerm.toLowerCase()) || company.includes(searchTerm.toLowerCase())
      : true;

    const matchesLocation = locationFilter
      ? location.includes(locationFilter.toLowerCase())
      : true;

    const matchesCategory =
      !categoryFilter || categoryFilter === 'All' || category === categoryFilter;

    return matchesSearch && matchesLocation && matchesCategory;
  });


  if (navigatingToJob) {
    return <Loading />;
  }


  if (loading) {
    return <Loading />;
  }

  return (
    <div className="findwork-container">
      <Navbar />

      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">
          Find Your Perfect <span className="hero-accent">Sideline</span>
        </h1>
        <p className="hero-subtitle">
          Discover opportunities that fit your lifestyle and skills
        </p>

        {/* Single set of action buttons */}
        <div className="hero-actions">
          <button
            className="action-btn find-jobs-btn"
            onClick={() => window.scrollTo(0, 600)}
          >
            Find Jobs
          </button>
          <button
            className="action-btn post-job-btn"
            onClick={() => navigate('/post-job')}
          >
            Post a Job
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="results-section">
        <div className="results-header">
          <h2 className="results-title">
            {error
              ? 'Error loading jobs'
              : `${filteredJobs.length} job${filteredJobs.length !== 1 ? 's' : ''} found`}
          </h2>
          {!error && (
            <div className="results-subtitle">
              Showing results for "{searchTerm || 'all jobs'}"
            </div>
          )}
        </div>

        {error && (
          <div className="error-banner">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && filteredJobs.length === 0 && (
          <div className="no-jobs">
            <Briefcase size={48} />
            <h3>No jobs found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        )}

        {!loading && !error && filteredJobs.length > 0 && (
          <div className="job-listings">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="job-card"
                onClick={() => handleJobClick(job.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="job-content">
                  <div className="job-header">
                    <div className="company-logo">
                      {job.logo ? (
                        <img src={job.logo} alt={job.company || 'Company'} />
                      ) : (
                        '🏢'
                      )}
                    </div>
                    <div className="job-details">
                      <div className="job-main">
                        <div className="job-info">
                          <h3 className="job-title">{job.title || 'Untitled Job'}</h3>
                          <div className="company-info">
                            <Briefcase className="company-icon" size={14} />
                            <span className="company-name">
                              {job.company || 'Unknown Company'}
                            </span>
                            <span className="separator">•</span>
                            <div className="rating">
                              <Star className="rating-star" size={14} fill="#FFD700" stroke="#FFD700" />
                              <span className="rating-value">{job.rating || 'N/A'}</span>
                              <span className="rating-reviews">
                                {job.reviews ? `(${job.reviews})` : ''}
                              </span>
                            </div>
                          </div>

                          <div className="job-meta">
                            <div className="meta-item">
                              <MapPin className="meta-icon" size={14} />
                              <span>{job.location || 'Remote'}</span>
                            </div>
                            <div className="meta-item">
                              <Clock className="meta-icon" size={14} />
                              <span>{job.job_type || 'Full-time'}</span>
                            </div>
                            <div className="meta-item">
                              <DollarSign className="meta-icon" size={14} />
                              <span>
                                {job.min_budget && job.max_budget
                                  ? `$${job.min_budget} – $${job.max_budget}`
                                  : job.min_budget
                                    ? `From $${job.min_budget}`
                                    : 'Negotiable'}
                              </span>
                            </div>
                          </div>

                          <p className="job-description">
                            {job.description?.length > 100
                              ? job.description.substring(0, 100) + '…'
                              : job.description || 'No description provided.'}
                          </p>

                          <div className="job-footer">
                            <div className="job-tags">
                              <span
                                className={`category-badge category-${(job.category || 'general')
                                  .toLowerCase()
                                  .replace(/\s+/g, '-')}`}
                              >
                                {job.category || 'General'}
                              </span>
                              <span className="posted-time">
                                Posted {job.created_at
                                  ? new Date(job.created_at).toLocaleDateString()
                                  : 'Recently'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredJobs.length > 0 && (
          <div className="load-more-section">
            <button className="load-more-btn">Load More Jobs</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindWork;