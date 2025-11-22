import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firbase/Firebase";

export default function Service24hPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    async function fetchJob() {
      const docRef = doc(db, "service_24h", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setJob({ ...docSnap.data(), _id: docSnap.id });
    }
    fetchJob();
  }, [id]);

  if (!job) return <div>Loading...</div>;

  const handleConnect = () => navigate(`/freelancer/${job.freelancerId}`);
  const handleFavorite = () => alert("Added to favorites!");

  return (
    <div style={{
      padding:20,
      maxWidth:800,
      margin:"40px auto",
      background:"#fff8e0",
      borderRadius:14,
      boxShadow:"0 4px 12px rgba(0,0,0,0.1)",
      fontFamily: "'Rubik', sans-serif"
    }}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
        <h1 style={{fontSize:28, fontWeight:700}}>{job.title}</h1>
        <button style={{background:'transparent', border:'none', fontSize:18, cursor:'pointer'}} onClick={() => navigate(-1)}>← Back</button>
      </div>
      <div style={{fontSize:14, color:'#555', marginTop:8}}>
        <strong>Category:</strong> {job.category || "Uncategorized"}<br/>
        <strong>Views:</strong> {job.views || 0}
      </div>
      <p style={{marginTop:16, lineHeight:1.5, color:'#333'}}>{job.description}</p>
      <div style={{
        marginTop:12, fontWeight:600, padding:'8px 12px', borderRadius:8, display:'inline-block', background:'#FDFD96'
      }}>Budget: ₹{job.price ?? job.budget}</div>
      <div style={{
        marginTop:12, fontWeight:600, padding:'8px 12px', borderRadius:8, display:'inline-block', marginLeft:8, background:'#FCE76A'
      }}>Timeline: 24 Hours</div>

      <div style={{marginTop:20, display:'flex', gap:12}}>
        <button style={{padding:'10px 16px', borderRadius:10, border:'none', cursor:'pointer', fontWeight:600, background:'#4CAF50', color:'#fff'}} onClick={handleConnect}>Connect</button>
        <button style={{padding:'10px 16px', borderRadius:10, border:'none', cursor:'pointer', fontWeight:600, background:'#FF4081', color:'#fff'}} onClick={handleFavorite}>Favorite</button>
      </div>
    </div>
  );
}
