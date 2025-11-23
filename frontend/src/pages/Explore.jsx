// src/pages/Explore.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Heart, Star, Clock, MapPin, DollarSign, CheckCircle } from 'lucide-react';
import Loading from '../function/loading'; // Import your loading component
import './Explore.css';
import { useNavigate } from "react-router-dom";

const Explore = () => {
  const [favorites, setFavorites] = useState(new Set());
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false); // ✅ for confirmation message
  const location = useLocation();
  const navigate = useNavigate(); // ✅ MUST be inside component

  const query = new URLSearchParams(location.search).get('search');
  const API_URL = import.meta.env.VITE_API_URL;

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

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) newFavorites.delete(id);
    else newFavorites.add(id);
    setFavorites(newFavorites);
  };

  // Show loading component during initial load
  if (loading) {
    return <Loading />;
  }

  return (
    <>
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
                    onClick={() => job?.id ? navigate(`/job/${job.id}`) : console.error("Job ID missing")}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Remove image container */}

                    <div className="job-content">
                      <div className="job-header">
                        <h3 className="job-title">{job.title}</h3>
                        <div className="job-rating">
                          <Star size={16} className="star-icon" />
                          <span className="rating-text">4.8</span>
                        </div>
                        <button
                          className="favorite-btn"
                          onClick={(e) => toggleFavorite(job.id, e)}
                        >
                          <Heart
                            size={16}
                            className={`favorite-icon ${
                              favorites.has(job.id) ? 'active' : 'inactive'
                            }`}
                          />
                        </button>
                      </div>

                      <p className="job-company">{job.company || 'Unknown Company'}</p>

                      <div className="job-details">
                        <div className="job-detail">
                          <MapPin size={16} className="detail-icon" />
                          <span className="detail-text">
                            {job.location || 'Metro Manila'}
                          </span>
                        </div>
                        <div className="job-detail">
                          <Clock size={16} className="detail-icon" />
                          <span className="detail-text">
                            {job.jobtype || 'Full-time'}
                          </span>
                        </div>
                        <div className="job-detail">
                          <DollarSign size={16} className="detail-icon" />
                          <span className="detail-text salary">
                            {job.salary ? `${job.salary} AUD` : '0 AUD'}
                          </span>
                        </div>
                      </div>

                      {job.skills && job.skills.length > 0 && (
                        <div className="job-tags">
                          {Array.isArray(job.skills) &&
                            job.skills.map((skill, index) => (
                              <span key={index} className="job-tag">{skill}</span>
                            ))
                          }
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