// src/pages/JobDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MapPin, Clock, DollarSign, Star } from "lucide-react";
import "./JobDetails.css";

const API_URL = import.meta.env.VITE_API_URL;

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token") && !!localStorage.getItem("id");

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_URL}/api/jobs/${id}`);
        if (!res.ok) {
          setError(res.status === 404 ? "Job not found." : "Failed to fetch job.");
          return;
        }
        const data = await res.json();
        setJob(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load job. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!isLoggedIn) {
      alert("❌ You must be logged in to apply for this job.");
      navigate("/login");
      return;
    }

    if (!job) return;

    setApplying(true);

    try {
      const payload = {
        job_id: job.id,
        user_id: Number(localStorage.getItem("id")),
        experience: null,
        location: null,
        cover_letter: null,
        resume_url: null,
        skills: [],
        position: "Applicant",
      };

      const res = await fetch(`${API_URL}/api/applicants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error?.toLowerCase().includes("already applied")) {
          alert("⚠️ You have already applied for this job.");
        } else {
          alert(data.error || "Failed to apply for this job.");
        }
        return;
      }

      navigate("/you-applied", { state: { job } });
    } catch (err) {
      console.error("Application error:", err);
      alert("Failed to submit application.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <p className="loading-text">Loading job...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <>
      <Navbar />
      <main className="job-details-page">
        <div className="job-details-container">
          <h1>{job.title}</h1>
          <p className="company">{job.company || "Unknown Company"}</p>

          <div className="details">
            <div><MapPin size={16} /> {job.location || "N/A"}</div>
            <div><Clock size={16} /> {job.jobtype || "Full-time"}</div>
            <div><DollarSign size={16} /> AUD {job.salary || "0"}</div>
            <div><Star size={16} /> 4.8 rating</div>
          </div>

          <h3>Description</h3>
          <p>{job.description || "No description available."}</p>

          {job.skills?.length > 0 && (
            <>
              <h3>Skills</h3>
              <ul>
                {job.skills.map((skill, i) => <li key={i}>{skill}</li>)}
              </ul>
            </>
          )}

          <button
            className={`apply-btn ${!isLoggedIn ? "disabled-btn" : ""}`}
            onClick={handleApply}
            disabled={applying || !isLoggedIn}
            title={!isLoggedIn ? "Log in to apply" : ""}
          >
            {applying ? "Applying..." : "Apply Now"}
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default JobDetails;
