import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Briefcase, Star, Search, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Loading from '../function/loading'; 
import './FindWork.css';

const API_URL = import.meta.env.VITE_API_URL;

const FindWork = () => {
  const navigate = useNavigate();

  // --- State for Inputs ---
  // Removed keywordInput state
  const [locationInput, setLocationInput] = useState(''); 

  // --- State for Applied Filters (What is sent to the API) ---
  const [appliedFilters, setAppliedFilters] = useState({
    keyword: '', // Retained keyword in appliedFilters but it will remain empty
    location: '',
    category: '', 
  });

  const [jobs, setJobs] = useState([]);
  // Initial load to full-screen Loading, searches are full-screen loading too as per original logic.
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [navigatingToJob, setNavigatingToJob] = useState(false);

  // Check for mobile size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- Fetch Jobs Function (The core search logic) ---
  const fetchJobs = useCallback(async (keyword, location) => {
    setLoading(true);
    setError('');

    try {
      let endpoint = `${API_URL}/api/jobs`;
      const params = new URLSearchParams();

      // If location is present, add it to the query parameters
      if (location) {
        params.append('location', location);
      }
      
      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }

      const res = await fetch(endpoint);

      if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Failed to load jobs (HTTP ${res.status})`);
        }

      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Error fetching jobs:', err);
      setError(err.message || 'Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);
    
  // --- Effect to Trigger Fetch on Load and on Search Submit ---
  useEffect(() => {
    // Only pass location since keyword will always be empty
    fetchJobs('', appliedFilters.location);
  }, [fetchJobs, appliedFilters]); 


  // --- Handler for Search Submission ---
  const handleSearch = (e) => {
    e.preventDefault();
    
    // Update the appliedFilters state using the current input values.
    // This state update triggers the useEffect above to call fetchJobs.
    setAppliedFilters({
      keyword: '', // Always empty
      location: locationInput, 
      category: appliedFilters.category, 
    });
  };

  // --- Other Handlers and Filtering (same as before) ---
  const handleJobClick = (jobId) => {
    if (!jobId) return;
    setNavigatingToJob(true);
    navigate(`/job/${jobId}`);
  };

  // Frontend filtering (only for category, as keyword/location are handled server-side)
  const filteredJobs = jobs.filter((job) => {
    const jobCategory = job.category || '';
    const matchesCategory =
      !appliedFilters.category || appliedFilters.category === 'All' || jobCategory === appliedFilters.category;
    return matchesCategory;
  });


  if (navigatingToJob || loading) {
    return <Loading />;
  }
  
  const jobCountMessage = error
    ? 'Error loading jobs'
    : `${filteredJobs.length} job${filteredJobs.length !== 1 ? 's' : ''} found${appliedFilters.location ? ` in ${appliedFilters.location}` : ''}`;

  
  return (
    <div className="findwork-container">
      <Navbar />

      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">
          Find Your Perfect <span className="hero-accent">Sideline</span>
        </h1>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="main-search-bar single-input">
            
            {/* The single location input group */}
            <div className="location-input-group">
                <MapPin size={20} className="location-icon" />
                <input
                    type="text"
                    // Updated placeholder for clarity as the primary search
                    placeholder="Search by City, Province, or Country (e.g., Cebu)"
                    value={locationInput} 
                    onChange={(e) => setLocationInput(e.target.value)}
                    className="location-input"
                />
            </div>
            
            <button type="submit" className="search-submit-btn">
                Search
            </button>
        </form>
        
        {/* Single set of action buttons */}
        <div className="hero-actions">
          <button
            className="action-btn find-jobs-btn"
            onClick={() => window.scrollTo(0, 600)}
          >
            Browse Jobs
          </button>
          <button
            className="action-btn post-job-btn"
            onClick={() => navigate('/post-job')}
          >
            Post a Job
          </button>
        </div>
      </div>
      {isMobile && (
  <button
    className="mobile-post-job-btn"
    onClick={() => navigate('/post-job')}
  >
    +
  </button>
)}


      {/* Results Section (same as before) */}
      <div className="results-section">
        <div className="results-header">
          <h2 className="results-title">{jobCountMessage}</h2>
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
            <p>Try adjusting your search or location filters.</p>
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