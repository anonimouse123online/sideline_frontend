import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Loading from "../function/loading";
import ViewApplicants from "../pages/ViewApplicants";
import AppliedJobs from "../pages/AppliedJobs";
import VerifyAccountModal from "../pages/VerifyAccountModal";
import "./Profile.css";

const API_URL = import.meta.env.VITE_API_URL;



const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [userJobs, setUserJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [isJobsModalOpen, setIsJobsModalOpen] = useState(false);
  const [viewingApplicants, setViewingApplicants] = useState(null);
  const [isAppliedModalOpen, setIsAppliedModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  // --------------------- FETCH PROFILE --------------------- //
  // --------------------- FETCH PROFILE --------------------- //
const fetchProfile = async () => {
  setLoading(true);
  setError(null);

  try {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser?.id || !storedUser?.email) throw new Error("Please log in first.");

    console.log("📡 Fetching profile for user:", storedUser.id);

    // 1️⃣ Fetch user profile info
    const profileRes = await fetch(`${API_URL}/api/profile?email=${storedUser.email}`);
    if (!profileRes.ok) {
      const data = await profileRes.json();
      throw new Error(data.error || "Failed to fetch profile");
    }
    const profileData = await profileRes.json();

    // 2️⃣ Only fetch applicant/verification info if userProfile is not verified
    let isVerified = false;
    let applicantId = null;

    const applicantsRes = await fetch(`${API_URL}/api/applicants/user/${storedUser.id}/applications`);
    if (applicantsRes.ok) {
      const applicantsData = await applicantsRes.json();
      console.log("🛡️ Applicant data returned:", applicantsData);

      const latestApplicant = applicantsData[0];
      applicantId = latestApplicant?.application_id || null;
      isVerified = latestApplicant?.status === "approved" || latestApplicant?.email_sent === true;
    }

    // 3️⃣ Update state
    setUserProfile({
      ...profileData.user,
      applicantId,
      isVerified
    });

  } catch (err) {
    setError(err.message);
    console.error("❌ Fetch profile error:", err);
  } finally {
    setLoading(false);
  }
};




  // --------------------- POLL VERIFICATION STATUS --------------------- //
useEffect(() => {
  fetchProfile();
}, []);


  // --------------------- FETCH USER JOBS --------------------- //
  const fetchUserJobs = async () => {
    setJobsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");

      console.log("📡 Fetching jobs for logged-in user...");

      const res = await fetch(`${API_URL}/api/jobs/user/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      console.log("📥 Jobs fetched from backend:", data);

      if (!res.ok) throw new Error(data.error || "Failed to fetch jobs");
      setUserJobs(data || []);
    } catch (err) {
      console.error("❌ Fetch user jobs error:", err);
      alert(err.message);
    } finally {
      setJobsLoading(false);
    }
  };

  // --------------------- SAVE PROFILE --------------------- //
  const handleSaveProfile = async e => {
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
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          email: storedUser.email,
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          phone: userProfile.phone
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      alert("Profile updated successfully!");
      setIsEditing(false);
      localStorage.setItem("user", JSON.stringify({
        ...storedUser,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName
      }));
    } catch (err) {
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

  // --------------------- FETCH PROFILE ON MOUNT --------------------- //
  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <Loading />;
  if (error) return (
    <div className="profile-page">
      <Navbar />
      <main className="profile-container">
        <div className="error-card">
          <h2>⚠️ Oops!</h2>
          <p>{error}</p>
          <button className="login-btn" onClick={handleLoginRedirect}>Go to Login</button>
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
          <button className="login-btn" onClick={handleLoginRedirect}>Go to Login</button>
        </div>
      </main>
    </div>
  );

  // --------------------- RENDER --------------------- //
  return (
    <div className="profile-page">
      <Navbar />
      <main className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <img 
            src="https://placehold.co/150x150/4f46e5/white?text=User" 
            alt="User avatar" 
            className="profile-avatar"
            style={{ borderRadius: '50%', width: '100px', height: '100px', objectFit: 'cover', border: '3px solid #4f46e5' }}
/>
            <div className="profile-info">
              <h1 className="profile-name">{userProfile.firstName} {userProfile.lastName}</h1>
              <p className="profile-email">📧 {userProfile.email}</p>
              <p className="profile-phone">📱 {userProfile.phone || "—"}</p>
              <p className="profile-role">👤 {userProfile.role || "User"}</p>
              {userProfile.isVerified 
                ? <p style={{ color: "#34d399", fontWeight: "bold", marginBottom: "8px" }}>✔️ Verified</p>
                : <p style={{ color: "#f59e0b", fontWeight: "bold", marginBottom: "8px" }}>⚠️ Not Verified</p>}
              <button className="logout-btn" onClick={handleLoginRedirect}>Logout</button>
            </div>
          </div>

          {/* Account Info */}
          <div className="profile-section">
            <div className="section-header"><h2>Account Info</h2></div>
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="profile-form">
                <input type="text" value={userProfile.firstName || ""} onChange={e => setUserProfile(prev => ({ ...prev, firstName: e.target.value }))} placeholder="First Name" className="input-field" />
                <input type="text" value={userProfile.lastName || ""} onChange={e => setUserProfile(prev => ({ ...prev, lastName: e.target.value }))} placeholder="Last Name" className="input-field" />
                <input type="tel" value={userProfile.phone || ""} onChange={e => setUserProfile(prev => ({ ...prev, phone: e.target.value }))} placeholder="Phone Number" className="input-field" />
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
              onClick={async () => {
                console.log("📌 View Jobs Posted clicked");
                await fetchUserJobs();
                setIsJobsModalOpen(true);
              }}
            >
              View Jobs Posted
            </button>
            <button className="fetch-applied-btn" onClick={() => setIsAppliedModalOpen(true)}>View Applied Jobs</button>
            <button className="verify-account-btn" onClick={() => setIsVerifyModalOpen(true)}>Verify Account</button>
          </div>
        </div>
      </main>
      <VerifyAccountModal
        isVisible={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        userId={userProfile?.id}
        onVerified={() => setUserProfile(prev => ({ ...prev, isVerified: true }))}
      />

      {isJobsModalOpen && (
        <div className="modal-overlay" onClick={() => setIsJobsModalOpen(false)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <button className="back-btn" onClick={() => setIsJobsModalOpen(false)}>← Back</button>
              <h2>My Posted Jobs</h2>
              <button className="modal-close-btn" onClick={() => setIsJobsModalOpen(false)}>×</button>
            </div>
            <div className="modal-content">
              {jobsLoading ? <p>Loading your jobs...</p>
                : userJobs.length === 0 ? <p>You haven't posted any jobs yet.</p>
                : userJobs.map(job => (
                  <div key={job.id} className="job-item">
                    <h3>{job.title}</h3>
                    <p>{job.description}</p>
                    <div className="job-item-actions">
                      <button className="view-applicants-btn" onClick={() => setViewingApplicants(job)}>View Applicants</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      <AppliedJobs userId={userProfile.id} isVisible={isAppliedModalOpen} onClose={() => setIsAppliedModalOpen(false)} />
      {viewingApplicants && <ViewApplicants job={viewingApplicants} onClose={() => setViewingApplicants(null)} isVisible={!!viewingApplicants} />}
    </div>
  );
};

export default Profile;
