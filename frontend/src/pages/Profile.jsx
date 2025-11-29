import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Loading from "../function/loading";
import ViewApplicants from "../pages/ViewApplicants";
import AppliedJobs from "../pages/AppliedJobs";
import VerifyAccountModal from "../pages/VerifyAccountModal";
import "./Profile.css";
import JobDeleteConfirm from "../components/JobDeleteConfirm";
import JobDeletedAlert from "../components/JobDeletedAlert";

const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showJobDeleted, setShowJobDeleted] = useState(false);

  const [userJobs, setUserJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [isJobsModalOpen, setIsJobsModalOpen] = useState(false);
  const [viewingApplicants, setViewingApplicants] = useState(null);
  const [isAppliedModalOpen, setIsAppliedModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [showDeleteConfirmId, setShowDeleteConfirmId] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser?.id || !storedUser?.email) throw new Error("Please log in first.");

      console.log("📡 Fetching profile for user:", storedUser.id);

      const profileRes = await fetch(`${API_URL}/api/profile?email=${storedUser.email}`);
      if (!profileRes.ok) {
        const data = await profileRes.json();
        throw new Error(data.error || "Failed to fetch profile");
      }
      const profileData = await profileRes.json();

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

  useEffect(() => {
    fetchProfile();
  }, []);

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

  const handleDeleteJob = async (job) => {
    try {
      const res = await fetch(`${API_URL}/api/jobs/${job.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setUserJobs(prev => prev.filter(j => j.id !== job.id));
        setShowJobDeleted(true); // show alert
        setTimeout(() => setShowJobDeleted(false), 2000); // auto-dismiss after 2s
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete job");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting job");
    } finally {
      setShowDeleteConfirmId(null);
    }
  };

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

  // Inline styles for inputs since they weren't strictly in the CSS file
  const inputStyle = {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    width: "100%",
    marginBottom: "10px",
    boxSizing: "border-box"
  };

  if (loading) return <Loading />;
  if (error) return (
    <div className="profile-page">
      <Navbar />
      <main className="profile-container">
        <div className="profile-card" style={{ padding: "40px", textAlign: "center" }}>
          <h2>⚠️ Oops!</h2>
          <p>{error}</p>
          <button className="logout-btn" onClick={handleLoginRedirect}>Go to Login</button>
        </div>
      </main>
    </div>
  );

  if (!userProfile) return (
    <div className="profile-page">
      <Navbar />
      <main className="profile-container">
        <div className="profile-card" style={{ padding: "40px", textAlign: "center" }}>
          <p>No profile data available.</p>
          <button className="logout-btn" onClick={handleLoginRedirect}>Go to Login</button>
        </div>
      </main>
    </div>
  );

  // --------------------- RENDER --------------------- //
  return (
    <div className="profile-page">
      <Navbar />
      
      <main className="profile-container">
        {/* === HERO CARD === */}
        <div className="profile-card">
          <div className="profile-header">
            <img
              src="https://placehold.co/150x150/4f46e5/white?text=User"
              alt="User avatar"
              className="profile-avatar"
              // Removed inline styles to let CSS handle the 150px size and border
            />
            
            <div className="profile-info">
              <h1 className="profile-name">{userProfile.firstName} {userProfile.lastName}</h1>
              <span className="profile-role">👤 {userProfile.role || "User"}</span>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "15px" }}>
                <span className="profile-email">📧 {userProfile.email}</span>
                <span className="profile-phone">📱 {userProfile.phone || "No phone added"}</span>
                
                {userProfile.isVerified
                  ? <span style={{ color: "#34d399", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px" }}>✔️ Verified Account</span>
                  : <span style={{ color: "#f59e0b", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px" }}>⚠️ Not Verified</span>
                }
              </div>

              <button className="logout-btn" onClick={handleLoginRedirect}>Logout</button>
            </div>
          </div>
        </div>

        {/* === ACCOUNT INFO SECTION === */}
        <div className="profile-section">
          <div className="section-header">
            <h2>Account Info</h2>
            {!isEditing && (
               <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>✏️ Edit</button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="profile-form">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                  <div>
                    <label style={{display:"block", marginBottom: "5px", fontSize: "0.9rem", fontWeight: "600"}}>First Name</label>
                    <input type="text" value={userProfile.firstName || ""} onChange={e => setUserProfile(prev => ({ ...prev, firstName: e.target.value }))} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{display:"block", marginBottom: "5px", fontSize: "0.9rem", fontWeight: "600"}}>Last Name</label>
                    <input type="text" value={userProfile.lastName || ""} onChange={e => setUserProfile(prev => ({ ...prev, lastName: e.target.value }))} style={inputStyle} />
                  </div>
              </div>
              
              <label style={{display:"block", marginBottom: "5px", fontSize: "0.9rem", fontWeight: "600"}}>Phone Number</label>
              <input type="tel" value={userProfile.phone || ""} onChange={e => setUserProfile(prev => ({ ...prev, phone: e.target.value }))} style={inputStyle} />
              
              <div className="form-actions" style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="submit" className="edit-profile-btn" disabled={loading}>{loading ? "Saving..." : "💾 Save Changes"}</button>
                <button type="button" className="logout-btn" style={{backgroundColor: "#666"}} onClick={() => setIsEditing(false)} disabled={loading}>❌ Cancel</button>
              </div>
            </form>
          ) : (
            <div className="profile-info-list" style={{ lineHeight: "1.8", color: "#444" }}>
              <p><strong>Full Name:</strong> {userProfile.firstName} {userProfile.lastName}</p>
              <p><strong>Email:</strong> {userProfile.email}</p>
              <p><strong>Phone:</strong> {userProfile.phone || "—"}</p>
              <p><strong>Role:</strong> {userProfile.role || "User"}</p>
            </div>
          )}
        </div>

        {/* === ACTIONS SECTION === */}
        <div className="profile-section">
            <div className="section-header">
                <h2>Job Management</h2>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
                <button
                    className="fetch-jobs-btn"
                    onClick={async () => {
                    console.log("📌 View Jobs Posted clicked");
                    await fetchUserJobs();
                    setIsJobsModalOpen(true);
                    }}
                >
                    📂 View Jobs Posted
                </button>
                
                <button 
                  className="fetch-applied-btn" 
                  onClick={() => setIsAppliedModalOpen(true)}
                >
                  📄 View Applied Jobs
                </button>

                {/* Restored Button - Matches Professional Styling */}
                <button 
                  className="view-applicants-btn" 
                  style={{backgroundColor: "#f59e0b"}} 
                  onClick={() => setIsVerifyModalOpen(true)}
                >
                  🛡️ Verify Account
                </button>
            </div>
        </div>
      </main>

      {/* === MODALS === */}
      
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
              <h2>My Posted Jobs</h2>
              <button className="modal-close-btn" onClick={() => setIsJobsModalOpen(false)}>×</button>
            </div>

            <div className="modal-content">
              {jobsLoading ? (
                <div className="modal-loading">Loading your jobs...</div>
              ) : userJobs.length === 0 ? (
                <div className="modal-empty">You haven't posted any jobs yet.</div>
              ) : (
                userJobs.map(job => (
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
                      <button
                        className="delete-job-btn"
                        onClick={() => setShowDeleteConfirmId(job.id)}
                      >
                        Delete Job
                      </button>
                    </div>

                    {/* Delete confirmation modal specific to this job */}
                    {showDeleteConfirmId === job.id && (
                      <JobDeleteConfirm
                        isVisible={true}
                        onCancel={() => setShowDeleteConfirmId(null)}
                        onConfirm={() => handleDeleteJob(job)}
                      />
                    )}
                  </div>
                ))
              )}

              {/* Global alert for successful deletion */}
              <JobDeletedAlert 
                isVisible={showJobDeleted} 
                onClose={() => setShowJobDeleted(false)} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Applied Jobs & View Applicants Modals */}
      <AppliedJobs userId={userProfile?.id} isVisible={isAppliedModalOpen} onClose={() => setIsAppliedModalOpen(false)} />
      
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