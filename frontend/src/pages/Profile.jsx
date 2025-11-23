// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Loading from '../function/loading';
import ViewApplicants from '../pages/ViewApplicants';
import AppliedJobs from '../pages/AppliedJobs';
import "./Profile.css";

const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Jobs posted state
  const [userJobs, setUserJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [isJobsModalOpen, setIsJobsModalOpen] = useState(false);
  const [viewingApplicants, setViewingApplicants] = useState(null);

  // Applied jobs modal state
  const [isAppliedModalOpen, setIsAppliedModalOpen] = useState(false);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser || !storedUser.email) throw new Error("Please log in first.");

        const res = await fetch(`${API_URL}/api/profile?email=${storedUser.email}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch profile");
        setUserProfile(data.user);
      } catch (err) {
        console.error("Fetch profile error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Fetch jobs posted by user
  const fetchUserJobs = async () => {
    setJobsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/jobs`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch jobs");

      const storedUser = JSON.parse(localStorage.getItem("user"));
      const storedEmail = storedUser.email.toLowerCase();
      const myJobs = Array.isArray(data)
        ? data.filter(job => job.contact_email?.toLowerCase() === storedEmail)
        : [];

      setUserJobs(myJobs);
    } catch (err) {
      console.error("Fetch user jobs error:", err);
      setError(err.message);
    } finally {
      setJobsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found. Please log in again.");

      const res = await fetch(`${API_URL}/api/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: storedUser.email,
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          phone: userProfile.phone,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      alert("Profile updated successfully!");
      setIsEditing(false);

      const updatedUser = { ...storedUser, firstName: userProfile.firstName, lastName: userProfile.lastName };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Update profile error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) return <Loading />;

  if (error) return (
    <div className="profile-page">
      <Navbar />
      <main className="profile-container">
        <div className="error-card">
          <h2>⚠️ Oops!</h2>
          <p>{error}</p>
          <button className="login-btn" onClick={handleLoginRedirect}>
            Go to Login
          </button>
        </div>
      </main>
    </div>
  );

  if (!userProfile) return (
    <div className="profile-page">
      <Navbar />
      <main className="profile-container">
        <div className="info-card">
          <p>No profile data available.</p>
          <button className="login-btn" onClick={handleLoginRedirect}>
            Go to Login
          </button>
        </div>
      </main>
    </div>
  );

  return (
    <div className="profile-page">
      <Navbar />
      <main className="profile-container">
        <div className="profile-card">
          {/* Profile Header */}
          <div className="profile-header">
            <img src={userProfile.profilePic ? `${API_URL}${userProfile.profilePic}` : "https://via.placeholder.com/150"} alt="User avatar" className="profile-avatar"/>
            <div className="profile-info">
              <h1 className="profile-name">{userProfile.firstName} {userProfile.lastName}</h1>
              <p className="profile-email">📧 {userProfile.email}</p>
              <p className="profile-phone">📱 {userProfile.phone || "—"}</p>
              <p className="profile-role">👤 {userProfile.role || "User"}</p>
              <button className="logout-btn" onClick={handleLoginRedirect}>Logout</button>
            </div>
          </div>

          {/* Account Info */}
          <div className="profile-section">
            <div className="section-header"><h2>Account Info</h2></div>
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="profile-form">
                <input type="text" name="firstName" value={userProfile.firstName || ""} onChange={handleInputChange} placeholder="First Name" className="input-field"/>
                <input type="text" name="lastName" value={userProfile.lastName || ""} onChange={handleInputChange} placeholder="Last Name" className="input-field"/>
                <input type="tel" name="phone" value={userProfile.phone || ""} onChange={handleInputChange} placeholder="Phone Number" className="input-field"/>
                <div className="form-actions">
                  <button type="submit" className="save-button" disabled={loading}>{loading ? "Saving..." : "💾 Save Changes"}</button>
                  <button type="button" className="cancel-button" onClick={() => setIsEditing(false)} disabled={loading}>❌ Cancel</button>
                </div>
              </form>
            ) : (
              <div className="profile-info-list">
                <p><strong>First Name:</strong> {userProfile.firstName}</p>
                <p><strong>Last Name:</strong> {userProfile.lastName}</p>
                <p><strong>Email:</strong> {userProfile.email}</p>
                <p><strong>Phone:</strong> {userProfile.phone || "—"}</p>
                <p><strong>Role:</strong> {userProfile.role || "User"}</p>
                <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>✏️ Edit Profile</button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="profile-section">
            <button
              className="fetch-jobs-btn"
              onClick={() => { fetchUserJobs(); setIsJobsModalOpen(true); }}
            >
              View Jobs Posted
            </button>

           <button
  className="fetch-applied-btn"
  onClick={() => setIsAppliedModalOpen(true)} // open modal
>
  View Applied Jobs
</button>
          </div>
        </div>
      </main>

      {/* Jobs Posted Modal */}
      {isJobsModalOpen && (
        <div className="modal-overlay" onClick={() => setIsJobsModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>My Posted Jobs</h2>
              <button className="modal-close-btn" onClick={() => setIsJobsModalOpen(false)}>×</button>
            </div>
            <div className="modal-content">
              {jobsLoading ? (
                <p className="modal-loading">Loading your jobs...</p>
              ) : userJobs.length === 0 ? (
                <p className="modal-empty">You haven't posted any jobs yet.</p>
              ) : (
                <div className="jobs-posted-list">
                  {userJobs.map(job => (
                    <div key={job.id} className="job-item">
                      <h3>{job.title}</h3>
                      <p>{job.description}</p>
                      <div className="job-item-actions">
                        <button
                          className="view-applicants-btn"
                          onClick={() => setViewingApplicants(job)}
                        >
                          View Applicants
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Applied Jobs Modal */}
<AppliedJobs
  userId={userProfile.id}         // pass logged-in user's id
  isVisible={isAppliedModalOpen}  // controls modal visibility
  onClose={() => setIsAppliedModalOpen(false)} // closes modal
/>

      {/* View Applicants Modal */}
      {viewingApplicants && (
        <ViewApplicants
          job={viewingApplicants}
          onClose={() => setViewingApplicants(null)}
          isVisible={!!viewingApplicants}
        />
      )}
    </div>
  );
};

export default Profile;
