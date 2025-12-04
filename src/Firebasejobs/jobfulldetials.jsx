import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  increment,
  collection,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firbase/Firebase";

import { MdDateRange, MdAccessTime } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { FiX, FiBookmark } from "react-icons/fi";

export default function JobDetail24hoursScreen() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  const [job, setJob] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Load Job
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "jobs", jobId), (snap) => {
      if (snap.exists()) setJob({ id: snap.id, ...snap.data() });
    });
    return unsub;
  }, [jobId]);

  // Load saved jobs
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      const favorites = snap.data()?.favoriteJobs || [];
      setIsFavorite(favorites.includes(jobId));
    });
    return unsub;
  }, [user, jobId]);

  // Check if already applied
  useEffect(() => {
    if (job && user) {
      const applicants = job.applicants || [];
      setIsApplied(applicants.some((a) => a.freelancerId === user.uid));
    }
  }, [job, user]);

  // Apply button handler
  const handleApply = async () => {
    if (!user) return alert("Please login first.");

    try {
      const userId = user.uid;
      const freelancerSnap = await getDoc(doc(db, "users", userId));
      const freelancer = freelancerSnap.data() || {};
      const freelancerName = `${freelancer.firstName || ""} ${freelancer.lastName || ""}`.trim();
      const freelancerImage = freelancer.profileImage || "";

      const jobRef = doc(db, "jobs", jobId);
      const jobSnap = await getDoc(jobRef);
      const jobData = jobSnap.data() || {};

      if ((jobData.applicants || []).some((a) => a.freelancerId === userId)) {
        alert("You have already applied!");
        setIsApplied(true);
        return;
      }

      await updateDoc(jobRef, {
        applicants: arrayUnion({
          freelancerId: userId,
          name: freelancerName,
          profileImage: freelancerImage,
          appliedAt: new Date(),
        }),
        applicants_count: increment(1),
      });

      await addDoc(collection(db, "notifications"), {
        title: jobData.title,
        body: `${freelancerName} applied for ${jobData.title}`,
        freelancerName,
        freelancerImage,
        freelancerId: userId,
        jobTitle: jobData.title,
        jobId,
        clientUid: jobData.userId,
        timestamp: new Date(),
        read: false,
      });

      setIsApplied(true);
      alert("Applied successfully!");
    } catch (e) {
      console.error(e);
      alert("Error applying.");
    }
  };

  if (!job) return <div>Loading...</div>;

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        padding: "20px",
        background: "#F5F5F5",
        fontFamily: "'Rubik', sans-serif",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "620px",
          maxWidth: "100%",
          background: "#fff",
          borderRadius: "16px",
          padding: "30px",
          position: "relative",
          boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
          overflowY: "hidden",
        }}
      >
        {/* TOP ICONS */}
        <div
          style={{
            position: "absolute",
            top: "18px",
            right: "18px",
            display: "flex",
            gap: "16px",
            fontSize: "22px",
            color: "#444",
          }}
        >
          <FiBookmark style={{ cursor: "pointer" }} />
          <FiX onClick={() => navigate(-1)} style={{ cursor: "pointer" }} />
        </div>

        {/* PAGE TITLE */}
        <h2 style={{ fontSize: "24px", fontWeight: "400", lineHeight: "32px", opacity: "60%", marginBottom: "10px" }}>
          Project Details
        </h2>

        {/* JOB TITLE & CATEGORY */}
        <h1 style={{ fontSize: "36px", fontWeight: "400", lineHeight: "40px" }}>
          {job.title}
        </h1>
        <p style={{ fontSize: "20px", fontWeight: "400", opacity: "60%" }}>
          {job.category}
        </p>

        {/* BUDGET, TIMELINE, LOCATION */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: "600", marginBottom: "18px", marginTop: "6px" }}>
          <span>₹{job.budget_from} - ₹{job.budget_to}</span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <MdDateRange size={18} /> {job.timeline}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <IoLocationOutline size={18} /> Remote
          </span>
        </div>

        {/* APPLICANTS & POSTED DATE */}
        <div style={{ display: "flex", gap: "28px", opacity: "60%", fontSize: "14px", marginBottom: "22px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <FaUsers size={14} /> {job.applicants_count || 0} Applicants
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <MdAccessTime size={14} />
            {job.created_at?.toDate
              ? job.created_at.toDate().toLocaleDateString()
              : "Recently"}
          </span>
        </div>

        {/* SKILLS */}
        <h3 style={{ marginBottom: "10px", fontSize: "20px", fontWeight: "400", marginTop: "30px" }}>
          Skills & Tools
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "30px" }}>
          {(job.skills || []).map((skill, i) => (
            <span
              key={i}
              style={{
                background: "rgba(255, 240, 133, 0.7)",
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "500",
                color: "#000",
              }}
            >
              {skill}
            </span>
          ))}
          {(job.tools || []).map((tool, i) => (
            <span
              key={i}
              style={{
                background: "rgba(200, 200, 200, 0.3)",
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "500",
                color: "#000",
              }}
            >
              {tool}
            </span>
          ))}
        </div>

        {/* DESCRIPTION */}
        <h3 style={{ marginBottom: "10px", fontSize: "20px", fontWeight: "400", lineHeight: "28px" }}>
          Project Description
        </h3>
        <div style={{ maxHeight: "250px", overflowY: "auto", paddingRight: "5px" }}>
          <p style={{ color: "#555", lineHeight: "1.6", whiteSpace: "pre-line", fontSize: "15px" }}>
            {job.description}
          </p>
        </div>

        {/* APPLY BUTTON */}
        <button
          onClick={handleApply}
          disabled={isApplied}
          style={{
            width: "100%",
            padding: "14px 0",
            background: isApplied ? "#aaa" : "linear-gradient(90deg,#A155FF,#7B2BFF)",
            borderRadius: "10px",
            border: "none",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            marginTop: "10px",
            transition: "0.2s",
          }}
        >
          {isApplied ? "Already Applied" : "Apply for this Project"}
        </button>
      </div>
    </div>
  );
}
