// screens/JobFullDetailJobScreen.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc,getDoc, updateDoc, arrayUnion, increment, collection, addDoc ,onSnapshot} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firbase/Firebase";

export default function JobFullDetailJobScreen() {
  const { id: jobId } = useParams();   // <-- FIX
  const auth = getAuth();
  const user = auth.currentUser;

  const [job, setJob] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "jobs", jobId), snap => {
      if (snap.exists()) setJob({ id: snap.id, ...snap.data() });
    });
    return unsub;
  }, [jobId]);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), snap => {
      setIsFavorite((snap.data()?.favoriteJobs || []).includes(jobId));
    });
    return unsub;
  }, [user, jobId]);

  useEffect(() => {
    if (job && user) {
      const applicants = job.applicants || [];
      setIsApplied(applicants.some(a => a.freelancerId === user.uid));
    }
  }, [job, user]);


  //handle apply

async function handleApply(jobId) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    alert("Please log in to apply.");
    return;
  }

  try {
    const userId = user.uid;

    // Fetch freelancer data
    const freelancerSnap = await getDoc(doc(db, "users", userId));
    const freelancer = freelancerSnap.data() || {};
    const freelancerName = `${freelancer.firstName || ""} ${freelancer.lastName || ""}`.trim();
    const freelancerImage = freelancer.profileImage || "";

    // Fetch job data
    const jobRef = doc(db, "jobs", jobId);
    const jobSnap = await getDoc(jobRef);
    const jobData = jobSnap.data() || {};
    const jobTitle = jobData.title || "";
    const clientUid = jobData.userId || "";
    const budget_from = jobData.budget_from || "";
    const budget_to = jobData.budget_to || "";

    // Prevent duplicate application
    const applicants = Array.isArray(jobData.applicants) ? jobData.applicants : [];
    if (applicants.some(a => a.freelancerId === userId)) {
      alert("You have already applied!");
      return;
    }

    // Add freelancer to job's applicants
    await updateDoc(jobRef, {
      applicants: arrayUnion({
        freelancerId: userId,
        name: freelancerName,
        profileImage: freelancerImage,
        appliedAt: new Date(),
      }),
      applicants_count: increment(1),
    });

    // Add a separate notification document
    await addDoc(collection(db, "notifications"), {
      title: jobTitle,
      body: `${freelancerName} applied for ${jobTitle}`,
      type: "application",
      freelancerName,
      freelancerImage,
      freelancerId: userId,
      jobTitle,
      jobId,
      clientUid,
      timestamp: new Date(),
      read: false,
      budget_from,
      budget_to,
    });

    alert("Application sent successfully!");
  } catch (e) {
    console.error("Apply error:", e);
    alert("Something went wrong, try again.");
  }
}

  if (!job) return <div>Loading...</div>;
return (
  <div
    style={{
      padding: "20px",
      maxWidth: "900px",
      margin: "20px auto",
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      fontFamily: "Arial, sans-serif",
    }}
  >
    {/* Job Title */}
    <h1
      style={{
        fontSize: "28px",
        fontWeight: "700",
        marginBottom: "10px",
        color: "#222",
      }}
    >
      {job.title}
    </h1>

    {/* Category + Level */}
    <p style={{ color: "#777", marginBottom: "8px" }}>
      <strong>Category:</strong> {job.category || "Not specified"}
    </p>

    <p style={{ color: "#777", marginBottom: "20px" }}>
      <strong>Experience:</strong> {job.experience || "Not specified"}
    </p>

    {/* Budget */}
    <div
      style={{
        background: "#f7f7f7",
        padding: "12px 16px",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      <p style={{ margin: 0, fontSize: "16px", color: "#333" }}>
        💰 <strong>Budget:</strong> ₹{job.budget_from} - ₹{job.budget_to}
      </p>
    </div>

    {/* Description */}
    <h3 style={{ marginTop: "16px", color: "#333" }}>Job Description</h3>
    <p
      style={{
        fontSize: "16px",
        lineHeight: "1.6",
        color: "#555",
        marginBottom: "25px",
        whiteSpace: "pre-line",
      }}
    >
      {job.description}
    </p>

    {/* Posted Date */}
    <p style={{ color: "#777", marginBottom: "20px" }}>
      ⏱ Posted:{" "}
      {job.created_at?.toDate
        ? job.created_at.toDate().toLocaleDateString()
        : "Unknown"}
    </p>

    {/* Skills */}
    {job.skills?.length > 0 && (
      <div style={{ marginBottom: "25px" }}>
        <h3 style={{ color: "#333" }}>Required Skills</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {job.skills.map((s, i) => (
            <div
              key={i}
              style={{
                background: "#e8f0ff",
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#1a57f2",
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Client Info */}
    {job.clientName && (
      <div
        style={{
          background: "#fafafa",
          padding: "14px",
          borderRadius: "8px",
          marginBottom: "30px",
          border: "1px solid #eee",
        }}
      >
        <h3 style={{ marginBottom: "8px", color: "#333" }}>Client Details</h3>
        <p style={{ margin: 0, color: "#555" }}>
          <strong>Name:</strong> {job.clientName}
        </p>
        {job.clientCompany && (
          <p style={{ margin: 0, color: "#555" }}>
            <strong>Company:</strong> {job.clientCompany}
          </p>
        )}
      </div>
    )}

    {/* Buttons */}
    <button
  onClick={() => handleApply(job.id)}
  disabled={isApplied}
  style={{
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: isApplied ? "#999" : "#007bff",
    color: "#fff",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
  }}
>
  {isApplied ? "Already Applied" : "Apply Now"}
</button>

  </div>
);

}
