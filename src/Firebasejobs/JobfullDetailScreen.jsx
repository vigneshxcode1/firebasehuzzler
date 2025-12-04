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

import { FiX, FiBookmark, FiShare2 } from "react-icons/fi";
import { MdAccessTime, MdDateRange } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import share from "../assets/share.png";

// ---- Add Rubik font globally ----
const rubikFontStyle = {
  fontFamily: "'Rubik', sans-serif",
};

export default function JobFullDetailJobScreen() {
  const { id: jobId } = useParams();
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // -------------------------
  // 🔥 Load Job Data
  // -------------------------
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "jobs", jobId), (snap) => {
      if (snap.exists()) setJob({ id: snap.id, ...snap.data() });
    });
    return unsub;
  }, [jobId]);

  // -------------------------
  // ⭐ Load Saved Jobs
  // -------------------------
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      const favorites = snap.data()?.favoriteJobs || [];
      setIsFavorite(favorites.includes(jobId));
    });
    return unsub;
  }, [user, jobId]);

  // -------------------------
  // 📝 Check Applied
  // -------------------------
  useEffect(() => {
    if (job && user) {
      const applicants = job.applicants || [];
      setIsApplied(applicants.some((a) => a.freelancerId === user.uid));
    }
  }, [job, user]);

  // -------------------------
  // ⭐ Save / Unsave Job
  // -------------------------
  async function handleSave() {
    if (!user) return alert("Login required!");

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const favorites = userSnap.data()?.favoriteJobs || [];

    let updated;

    if (favorites.includes(jobId)) {
      updated = favorites.filter((id) => id !== jobId); // ❌ remove
    } else {
      updated = [...favorites, jobId]; // ✔ add
    }

    await updateDoc(userRef, { favoriteJobs: updated });

    setIsFavorite(updated.includes(jobId));
  }



  // -------------------------
  // ⚡ Apply for Job
  // -------------------------
  async function handleApply(jobId) {
    try {
      const userId = user.uid;

      const freelancerSnap = await getDoc(doc(db, "users", userId));
      const freelancer = freelancerSnap.data() || {};
      const freelancerName = `${freelancer.firstName || ""} ${freelancer.lastName || ""
        }`.trim();
      const freelancerImage = freelancer.profileImage || "";

      const jobRef = doc(db, "jobs", jobId);
      const jobSnap = await getDoc(jobRef);
      const jobData = jobSnap.data() || {};

      if ((jobData.applicants || []).some((a) => a.freelancerId === userId)) {
        alert("Already applied!");
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

      alert("Applied successfully!");
    } catch (e) {
      console.error(e);
      alert("Error applying.");
    }
  }

  const handleShare = async () => {

    if (isSharing) return; // prevent multiple calls
    setIsSharing(true);

    try {
      if (navigator.share) {
        await navigator.share({
          title: job.title,
          text: "Check this project",
          url: window.location.href,
        });
        console.log("Shared successfully");
      } else {
        alert("Share not supported on this browser");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Share cancelled");
      } else {
        console.error("Share failed", err);
      }
    } finally {
      setIsSharing(false); // reset button state
    }
  };
  console.log(job)
  if (!job) return <div>Loading...</div>;

  return (
    <div
      style={{
        ...rubikFontStyle,
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        padding: "20px",
        overflowX: "hidden",
        background: "#F5F5F5",
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
          boxSizing: "border-box",
        }}
      >
        {/* ===== TOP RIGHT ICONS ===== */}
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
          {/* ⭐ SAVE BUTTON */}
          <div onClick={handleSave} style={{ cursor: "pointer" }}>
            {isFavorite ? (
              <FiBookmark style={{ color: "#7B2BFF", fill: "#7B2BFF" }} />
            ) : (
              <FiBookmark />
            )}
          </div>

          <div className="flex items-center gap-3">

            {/* <button */}
            {/* onClick={handleShare}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200" */}
            {/* > */}
            <img
              src={share}
              alt="share"
              width={18}
              style={{ cursor: isSharing ? "not-allowed" : "pointer", opacity: isSharing ? 0.6 : 1 }}
              onClick={handleShare}
            />

            {/* <FiShare2 size={20} /> */}
            {/* </button> */}
          </div>

          <FiX onClick={() => navigate(-1)} style={{ cursor: "pointer" }} />
        </div>

        {/* PAGE TITLE */}
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "400",
            lineHeight: "32px",
            marginLeft: "-400px",
            marginBottom: "-15px",
            opacity: "60%",
          }}
        >
          Project Details
        </h2>

        {/* MAIN TITLE */}
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "400",
            marginBottom: "2px",
            lineHeight: "40px",
          }}
        >
          {job.title}
        </h1>

        <p
          style={{
            fontSize: "20px",
            fontWeight: "400",
            lineHeight: "28px",
            opacity: "60%",
          }}
        >
          {job.category}
        </p>

        {/* ===== LABELS ===== */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            opacity: "60%",
            fontSize: "14px",
            marginBottom: "6px",
          }}
        >

          <span>budget - {job.budget}</span>

          <span>Location</span>
        </div>

        {/* ===== VALUES ===== */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "16px",
            fontWeight: "600",
            marginBottom: "18px",
          }}
        >
          <span>
            ₹{job.budget_from} - ₹{job.budget_to}
          </span>

          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <MdDateRange size={18} /> {job.timeline}
          </span>

          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <IoLocationOutline size={18} /> Remote
          </span>
        </div>

        {/* ===== APPLICANTS ===== */}
        <div
          style={{
            display: "flex",
            gap: "28px",
            opacity: "60%",
            fontSize: "14px",
            marginBottom: "22px",
          }}
        >
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

        {/* ===== SKILLS ===== */}
        <h3
          style={{
            marginBottom: "10px",
            fontSize: "20px",
            fontWeight: "400",
            lineHeight: "28px",
            marginTop: "30px",
          }}
        >
          Skills Required
        </h3>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "30px",
          }}
        >
          {job.skills?.map((skill, i) => (
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
        </div>

        {/* ===== DESCRIPTION ===== */}
        <h3
          style={{
            marginBottom: "10px",
            fontSize: "20px",
            fontWeight: "400",
            lineHeight: "28px",
          }}
        >
          Project Description
        </h3>

        <div
          style={{
            maxHeight: "250px",
            overflowY: "auto",
            paddingRight: "5px",
          }}
        >
          <p
            style={{
              color: "#555",
              lineHeight: "1.6",
              whiteSpace: "pre-line",
              marginBottom: "30px",
              fontSize: "15px",
            }}
          >
            {job.description}
          </p>
        </div>

        {/* ===== APPLY BUTTON ===== */}
        <button
          onClick={() => handleApply(job.id)}
          disabled={isApplied}
          style={{
            width: "100%",
            padding: "14px 0",
            background: isApplied
              ? "#aaa"
              : "linear-gradient(90deg,#A155FF,#7B2BFF)",
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
