// src/pages/Explore.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
// Heart icon import is removed
import { Clock, MapPin, DollarSign, CheckCircle, X } from 'lucide-react'; 
import Loading from '../function/loading';
import './Explore.css';
import './SiteNoticeModal.css';
import SiteNoticeModal from './SiteNoticeModal';


const Explore = () => {
  // Removed 'favorites' state
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search).get('search');
  const API_URL = import.meta.env.VITE_API_URL;



useEffect(() => {
  const navbarClicked = sessionStorage.getItem("siteNoticeClicked");

  if (!navbarClicked) {
    setModalOpen(true); 
  }
}, []);


const handleNavbarClick = () => {
  setModalOpen(false); // hide modal
  sessionStorage.setItem("siteNoticeClicked", "true"); 
};


  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setLoaded(false);
      try {
        const endpoint = query
          ? `${API_URL}/api/jobs/search?q=${encodeURIComponent(query)}`
          : `${API_URL}/api/jobs`;

        const res = await fetch(endpoint);

        if (!res.ok) throw new Error(`Server returned ${res.status} ${res.statusText}`);

        const data = await res.json();

        if (!Array.isArray(data)) throw new Error('API did not return an array');

        setJobs(data);
        setLoaded(true);
      } catch (error) {
        console.error('❌ FetchJobs failed:', error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [query]);

  // Removed 'toggleFavorite' function

  // --- Helper Function for Salary Display (Copied from FindWork logic) ---
  const formatSalary = (job) => {
    // Assuming 'min_budget' and 'max_budget' are the correct keys from the API
    const min = job.min_budget;
    const max = job.max_budget;
    
    if (min && max) {
      return `$${min} – $${max}`;
    }
    if (min) {
      return `From $${min}`;
    }
    return 'Negotiable';
  };
  
  if (loading) {
    return <Loading />;
  }

  return (
    <>
     <SiteNoticeModal />

      <Navbar />

      <main className="explore-page">
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">
              {query ? `Search results for "${query}"` : 'Popular sideline jobs'}
            </h2>
            <a href="#" className="section-link">Show all</a>
          </div>

          {jobs.length === 0 ? (
            <p>No jobs found.</p>
          ) : (
            <>
              <div className="job-grid">
                {jobs.map((job) => (
                  <div
                    className="job-card"
                    key={job.id}
                    onClick={() =>
                      job?.id ? navigate(`/job/${job.id}`) : console.error("Job ID missing")
                    }
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="job-content">
                      <div className="job-header">
                        <h3 className="job-title">{job.title}</h3>

                        {/* REMOVED FAVORITE BUTTON JSX */}
                      </div>

                      <p className="job-company">
                        {job.company || 'Unknown Company'}
                      </p>

                      <div className="job-details">
                        <div className="job-detail">
                          <MapPin size={16} className="detail-icon" />
                          <span className="detail-text">{job.location || 'Metro Manila'}</span>
                        </div>
                        <div className="job-detail">
                          <Clock size={16} className="detail-icon" />
                          <span className="detail-text">{job.jobtype || 'Full-time'}</span>
                        </div>
                        <div className="job-detail">
                          <DollarSign size={16} className="detail-icon" />
                          <span className="detail-text salary">
                            {formatSalary(job)}
                          </span>
                        </div>
                      </div>

                      {job.skills && job.skills.length > 0 && (
                        <div className="job-tags">
                          {job.skills.map((skill, index) => (
                            <span key={index} className="job-tag">{skill}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {loaded && (
                <div className="confirmation-message">
                  <CheckCircle size={20} className="confirm-icon" />
                  <span>All jobs loaded successfully!</span>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Explore;