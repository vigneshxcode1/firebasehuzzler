import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firbase/Firebase";

const css = `
.detail-wrapper{
  padding:20px; max-width:800px; margin:40px auto; background:#fff;
  border-radius:14px; box-shadow:0 4px 12px rgba(0,0,0,0.1); font-family: 'Rubik', sans-serif;
}
.detail-header{display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;}
.detail-title{font-size:28px;font-weight:700;color:#111;}
.detail-meta{font-size:14px;color:#555; margin-top:8px;}
.detail-desc{margin-top:16px;line-height:1.5;color:#333;}
.detail-budget, .detail-timeline{margin-top:12px; font-weight:600; padding:8px 12px; border-radius:8px; display:inline-block;}
.detail-budget{background:#FDFD96;}
.detail-timeline{background:#FCE76A;}
.back-btn{background:transparent;border:none;font-size:18px;cursor:pointer;}
.action-buttons{margin-top:20px; display:flex; gap:12px;}
.btn{padding:10px 16px; border-radius:10px; border:none; cursor:pointer; font-weight:600;}
.btn-connect{background:#4CAF50;color:#fff;}
.btn-fav{background:#FF4081;color:#fff;}
`;

export default function ServicePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = css;
    document.head.appendChild(styleEl);
    return () => styleEl.remove();
  }, []);

  useEffect(() => {
    async function fetchJob() {
      if (!id) return;
      const docRef = doc(db, "services", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setJob({ ...docSnap.data(), _id: docSnap.id });
      } else {
        setJob(null);
      }
    }
    fetchJob();
  }, [id]);

  if (!job) return <div className="p-8 text-center">Loading service...</div>;

  const handleConnect = () => {
    const freelancerId = job.freelancerId || job.userId;
    if (!freelancerId) {
      alert("Freelancer ID not found!");
      return;
    }
    navigate(`/freelancer/${freelancerId}`);
  };

  const handleFavorite = () => {
    alert("Added to favorites!");
    // TODO: save in Firestore
  };

  return (
    <div className="detail-wrapper">
      <div className="detail-header">
        <div className="detail-title">{job.title}</div>
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      </div>

      <div className="detail-meta">
        <strong>Category:</strong> {job.category || "Uncategorized"}<br/>
        <strong>Views:</strong> {job.views || 0}
      </div>

      <div className="detail-desc">{job.description}</div>

      <div className="detail-budget">Budget: ₹{job.price ?? job.budget}</div>
      <div className="detail-timeline">Timeline: {job.deliveryDuration ?? job.timeline}</div>

      <div className="action-buttons">
        <button className="btn btn-connect" onClick={handleConnect}>Connect</button>
        <button className="btn btn-fav" onClick={handleFavorite}>Favorite</button>
      </div>
    </div>
  );
}
