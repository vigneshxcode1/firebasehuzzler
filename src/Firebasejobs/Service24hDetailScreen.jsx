// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../firbase/Firebase";
// import { getAuth } from "firebase/auth";
// import { updateDoc, arrayUnion } from "firebase/firestore";

// export default function Service24hPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [job, setJob] = useState(null);
//   const auth = getAuth();

//   useEffect(() => {
//     async function fetchJob() {
//       const docRef = doc(db, "service_24h", id);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) setJob({ ...docSnap.data(), _id: docSnap.id });
//     }
//     fetchJob();
//   }, [id]);

//   if (!job) return <div>Loading...</div>;

//   const handleConnect = () => navigate(`/freelancer/${job.freelancerId}`);

//   const handleFavorite = async () => {
//     const user = auth.currentUser;

//     if (!user) {
//       alert("Please login to save this job.");
//       navigate("/firelogin");
//       return;
//     }

//     try {
//       const userRef = doc(db, "users", user.uid);

//       await updateDoc(userRef, {
//         savedJobs: arrayUnion(id)   // <-- save the service_24h job ID
//       });

//       alert("Job added tosaved!");
//     } catch (error) {
//       console.error("Error saving job:", error);
//       alert("Failed to save job. Try again.");
//     }
//   };
//   return (
//     <div style={{
//       padding: 20,
//       maxWidth: 800,
//       margin: "40px auto",
//       background: "#fff8e0",
//       borderRadius: 14,
//       boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//       fontFamily: "'Rubik', sans-serif"
//     }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
//         <h1 style={{ fontSize: 28, fontWeight: 700 }}>{job.title}</h1>
//         <h1 style={{ fontSize: 28, fontWeight: 700 }}>remote - location</h1>
//         <button style={{ background: 'transparent', border: 'none', fontSize: 18, cursor: 'pointer' }} onClick={() => navigate(-1)}>← Back</button>
//       </div>
//       <div style={{ fontSize: 14, color: '#555', marginTop: 8 }}>
//         <strong>Category:</strong> {job.category || "Uncategorized"}<br />
//         <strong>Views:</strong> {job.views || 0}
//         <strong>created at:{job.created_at}</strong>
//       </div>
//       <p style={{ marginTop: 16, lineHeight: 1.5, color: '#333' }}>{job.description}</p>
//       <div style={{
//         marginTop: 12, fontWeight: 600, padding: '8px 12px', borderRadius: 8, display: 'inline-block', background: '#FDFD96'
//       }}>Budget: ₹{job.price ?? job.budget}</div>
//       <div style={{
//         marginTop: 12, fontWeight: 600, padding: '8px 12px', borderRadius: 8, display: 'inline-block', marginLeft: 8, background: '#FCE76A'
//       }}>Timeline: 24 Hours</div>

//       <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
//         <button style={{ padding: '10px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 600, background: '#4CAF50', color: '#fff' }} onClick={handleConnect}>Connect</button>
//         <button
//           style={{
//             padding: "10px 16px",
//             borderRadius: 10,
//             border: "none",
//             cursor: "pointer",
//             fontWeight: 600,
//             background: "#FF4081",
//             color: "#fff"
//           }}
//           onClick={handleFavorite}
//         >
//          Save
//         </button>
//       </div>
//     </div>
//   );
// }





import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firbase/Firebase";
import { getAuth } from "firebase/auth";

export default function Service24hPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    async function fetchJob() {
      const docRef = doc(db, "service_24h", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setJob({ ...docSnap.data(), _id: docSnap.id });
    }
    fetchJob();
  }, [id]);

  if (!job) return <div>Loading...</div>;

  const handleConnect = () => navigate(`/connect/${job.userId}`);
  const handleFavorite = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please login to save this job.");
      navigate("/firelogin");
      return;
    }
    try {
      await updateDoc(doc(db, "users", user.uid), {
        savedJobs: arrayUnion(id),
      });
      alert("Saved!");
    } catch (e) {
      console.error(e);
    }
  };

  const initials = (job.clientName || job.title || "UN")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        background: "#fff",
        paddingBottom: 20,
        borderRadius: 18,
        boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "25px 30px 10px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>Project Details</h2>

        <div style={{ display: "flex", gap: 18 }}>
          <span style={{ cursor: "pointer" }}>🔗</span>
          <span style={{ cursor: "pointer" }}>🔔</span>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => navigate(-1)}
          >
            ❌
          </span>
        </div>
      </div>

      {/* PROFILE SECTION */}
      <div
        style={{
          padding: "10px 30px",
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            width: 65,
            height: 65,
            borderRadius: 18,
            background: "linear-gradient(180deg,#9A70FF,#6A3EFF)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 22,
          }}
        >
          {initials}
        </div>

        <div>
          <div style={{ fontSize: 28, fontWeight: 600 }}>{job.clientName}</div>
          <div style={{ fontSize: 16, color: "#7C3CFF" }}>UIUX Designer</div>
        </div>

        <div style={{ marginLeft: "auto", marginRight: 40 }}>
          <button
            style={{
              background: "#7A4DFF",
              color: "#fff",
              border: "none",
              padding: "10px 22px",
              borderRadius: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            View Profile
          </button>
        </div>
      </div>

      {/* META ROW */}
      <div
        style={{
          padding: "0px 30px 20px",
          display: "flex",
          gap: 30,
          color: "#555",
          fontSize: 14,
        }}
      >
        <span>👥 10 Applicants</span>
        <span>🕒 5 days ago</span>
      </div>

      {/* BUDGET & TIMELINE */}
      <div
        style={{
          padding: "0px 30px 14px",
          display: "flex",
          gap: 50,
          fontSize: 16,
        }}
      >
        <div>
          <strong>Budget:</strong> ₹{job.price} – ₹6000
        </div>

        <div>
          <strong>Timeline:</strong> {job.timeline || "2 - 3 weeks"}
        </div>

        <div>
          <strong>Location:</strong> Remote
        </div>
      </div>

      {/* EXTRA META */}
      <div
        style={{
          padding: "5px 30px 20px",
          display: "flex",
          gap: 80,
          fontSize: 15,
        }}
      >
        <div>Service Posted: {job.posted || 3}</div>
        <div>Completed Projects: {job.completed || 10}</div>
      </div>

      {/* SKILLS */}
      <div style={{ padding: "10px 30px", fontSize: 20, fontWeight: 600 }}>
        Skills Required
      </div>

      <div
        style={{
          padding: "0px 30px 25px",
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        {(job.skills || [
          "UI Design",
          "Web Design",
          "UX",
          "Figma",
          "Visual Design",
          "Interactive Design",
          "Adobe XD",
        ]).map((s, i) => (
          <span
            key={i}
            style={{
              background: "#FFEB99",
              padding: "8px 14px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {s}
          </span>
        ))}
      </div>

      {/* DESCRIPTION */}
      <div
        style={{
          padding: "10px 30px",
          fontSize: 20,
          fontWeight: 600,
        }}
      >
        Project Description
      </div>

      <div
        style={{
          padding: "0px 30px 20px",
          lineHeight: 1.6,
          fontSize: 15,
          color: "#444",
        }}
      >
        {job.description}
      </div>

      {/* FOOTER BUTTONS */}
      <div
        style={{
          padding: "16px 30px",
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #eee",
        }}
      >
        <button
          style={{
            width: "48%",
            padding: "14px",
            borderRadius: 12,
            fontWeight: 700,
            border: "2px solid #A58BFF",
            background: "#fff",
            color: "#7A4DFF",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>

        <button
          onClick={handleConnect}
          style={{
            width: "48%",
            padding: "14px",
            borderRadius: 12,
            fontWeight: 700,
            border: "none",
            background: "#A258FF",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          CONNECT
        </button>
      </div>
    </div>
  );
}
