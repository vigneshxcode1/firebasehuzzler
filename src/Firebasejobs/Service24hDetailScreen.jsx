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


// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
// import { db } from "../firbase/Firebase";
// import { getAuth } from "firebase/auth";
// import share from "../assets/share.png"; // <-- PUT your share icon path


// import {
//   FiShare2,
//   FiUsers,
//   FiClock,
//   FiX,
// } from "react-icons/fi";

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
//       alert("Please login");
//       navigate("/firelogin");
//       return;
//     }

//     try {
//       await updateDoc(doc(db, "users", user.uid), {
//         savedJobs: arrayUnion(id),
//       });

//       alert("Job saved!");
//     } catch (e) {
//       console.error(e);
//     }
//   };
//     // FIXED: share handler
//     const handleShare = () => {
//       navigator.share
//         ? navigator.share({
//             title: job.title,
//             text: "Check this project",
//             url: window.location.href,
//           })
//         : alert("Share not supported");
//     };

//   const profileInitials =
//     (job.clientName || job.title || "UN")
//       .substring(0, 2)
//       .toUpperCase();

//   return (
//     <div
//       style={{
//         width: "100%",
//         maxWidth: 900,
//         margin: "0 auto",
//         paddingBottom: 20,
//         background: "#fff",
//         borderRadius: 18,
//         overflow: "hidden",
//         boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
//         fontFamily: "'Inter', sans-serif",
//       }}
//     >
//       {/* ------------------- HEADER ------------------- */}
//       <div
//         style={{
//           padding: "22px 28px",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <div style={{ fontSize: 22, fontWeight: 700 }}>Project Details</div>
//       {/* TOP BAR */}
      
//         <div className="top-left-title">Project Details</div>

//         <div className="top-icons">
//           <img
//             src={share}
//             alt="share"
//             width={18}
//             style={{ cursor: "pointer" }}
//             onClick={handleShare}
//           />

//           <FiX
//             onClick={() => navigate(-1)}
//             style={{ cursor: "pointer" }}
//           />
//         </div>
      

//       {/* ------------------- PROFILE BOX ------------------- */}
//       <div
//         style={{
//           padding: "10px 28px",
//           display: "flex",
//           alignItems: "center",
//           gap: 20,
//         }}
//       >
//         <div
//           style={{
//             width: 70,
//             height: 70,
//             borderRadius: 18,
//             background: "linear-gradient(180deg,#9A70FF,#7A4DFF)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             color: "#fff",
//             fontWeight: 700,
//             fontSize: 24,
//           }}
//         >
//           {profileInitials}
//         </div>

//         <div>
//           <div style={{ fontSize: 32, fontWeight: 500, color: "#0A0A0A" }}>
//             {job.clientName || "Helen Angle"}
//           </div>
//           <div
//             style={{
//               fontSize: 18,
//               color: "#7C3CFF",
//               marginTop: 4,
//               fontWeight: 400,
//             }}
//           >
//             UIUX Designer
//           </div>
//         </div>
//       </div>

//       {/* ------------------- META ROW ------------------- */}
//       <div
//         style={{
//           padding: "0px 28px 10px",
//           display: "flex",
//           alignItems: "center",
//           gap: 28,
//           fontSize: 15,
//           color: "#555",
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//           <FiUsers />
//           10 Applicants
//         </div>

//         <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//           <FiClock />
//           5 days ago
//         </div>
//       </div>

//       {/* ------------------- ROW: BUDGET / TIMELINE / LOCATION ------------------- */}
//       <div
//         style={{
//           padding: "18px 28px 24px",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <div>
//           <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>
//             <span style={{ fontWeight: 600 }}>Budget:</span>{" "}
//             ₹{job.price || "1000"} – ₹6000
//           </div>

//           <div style={{ fontSize: 16, color: "#444" }}>
//             <strong>Timeline:</strong> 2 – 3 weeks
//           </div>

//           <div style={{ fontSize: 16, color: "#444" }}>
//             <strong>Location:</strong> Remote
//           </div>
//         </div>

//         <button
//           style={{
//             background: "#7A4DFF",
//             padding: "12px 26px",
//             borderRadius: 12,
//             color: "#fff",
//             border: "none",
//             fontWeight: 600,
//             cursor: "pointer",
//           }}
//         >
//           View Profile
//         </button>
//       </div>

//       {/* ------------------- SKILLS ------------------- */}
//       <div style={{ padding: "6px 28px", fontSize: 20, fontWeight: 600 }}>
//         Skills Required
//       </div>

//       <div
//         style={{
//           padding: "12px 28px 20px",
//           display: "flex",
//           flexWrap: "wrap",
//           gap: 12,
//         }}
//       >
//         {(job.skills || [
//           "UI Design",
//           "Web Design",
//           "UX",
//           "Figma",
//           "Visual Design",
//           "Interactive Design",
//           "Adobe XD",
//         ]).map((s, i) => (
//           <div
//             key={i}
//             style={{
//               padding: "10px 16px",
//               background: "#FFEB99",
//               borderRadius: 10,
//               fontSize: 14,
//               fontWeight: 600,
//             }}
//           >
//             {s}
//           </div>
//         ))}
//       </div>

//       {/* ------------------- DESCRIPTION ------------------- */}
//       <div style={{ padding: "6px 28px", fontSize: 20, fontWeight: 600 }}>
//         Project Description
//       </div>

//       <div
//         style={{
//           padding: "10px 28px 20px",
//           lineHeight: 1.6,
//           fontSize: 15,
//           color: "#444",
//           whiteSpace: "pre-line",
//         }}
//       >
//         {job.description || "No description available."}
//       </div>

//       {/* ------------------- BOTTOM ACTION BUTTONS ------------------- */}
//       <div
//         style={{
//           padding: "18px 28px",
//           display: "flex",
//           justifyContent: "space-between",
//           borderTop: "1px solid #eee",
//           background: "#fff",
//         }}
//       >
//         <button
//           style={{
//             width: "48%",
//             padding: "14px",
//             borderRadius: 14,
//             fontSize: 16,
//             fontWeight: 700,
//             border: "2px solid #A58BFF",
//             color: "#7A4DFF",
//             background: "#fff",
//             cursor: "pointer",
//           }}
//         >
//           Cancel
//         </button>

//         <button
//           onClick={handleConnect}
//           style={{
//             width: "48%",
//             padding: "14px",
//             borderRadius: 14,
//             fontSize: 16,
//             fontWeight: 700,
//             border: "none",
//             background: "#A258FF",
//             color: "#fff",
//             cursor: "pointer",
//           }}
//         >
//           CONNECT
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
import share from "../assets/share.png";

import { FiUsers, FiClock, FiX } from "react-icons/fi";

export default function Service24hPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    async function fetchJob() {
      const docRef = doc(db, "service_24h", id);
      const snap = await getDoc(docRef);
      if (snap.exists()) setJob({ ...snap.data(), _id: snap.id });
    }
    fetchJob();
  }, [id]);

  if (!job) return <div>Loading...</div>;

  const handleConnect = () => navigate(`/connect/${job.userId}`);

  const handleFavorite = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login");
      navigate("/firelogin");
      return;
    }

    await updateDoc(doc(db, "users", user.uid), {
      savedJobs: arrayUnion(id),
    });

    alert("Job saved!");
  };

  const handleShare = () => {
    navigator.share
      ? navigator.share({
          title: job.title,
          text: "Check this project",
          url: window.location.href,
        })
      : alert("Share not supported");
  };

  const profileInitials = (job.clientName || job.title || "UN")
    .substring(0, 2)
    .toUpperCase();

    console.log(job)
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
        paddingBottom: 20,
        background: "#fff",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "22px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 700 }}>Project Details</div>

        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <img
            src={share}
            width={20}
            style={{ cursor: "pointer" }}
            onClick={handleShare}
          />
          <FiX size={22} onClick={() => navigate(-1)} style={{ cursor: "pointer" }} />
        </div>
      </div>

      {/* PROFILE */}
      <div
        style={{
          padding: "10px 28px",
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: 18,
            background: "linear-gradient(180deg,#9A70FF,#7A4DFF)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
            fontSize: 24,
          }}
        >
          {profileInitials}
        </div>

        <div>
          <div style={{ fontSize: 32, fontWeight: 500 }}>{job.title|| "Helen Angle"}</div>
          <div style={{ fontSize: 18, color: "#7C3CFF", marginTop: 4 }}>{job.category}</div>
        </div>
      </div>

      {/* META */}
      <div
        style={{
          padding: "0px 28px 10px",
          display: "flex",
          alignItems: "center",
          gap: 28,
          fontSize: 15,
          color: "#555",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FiUsers />
          10 Applicants
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FiClock />
          5 days ago
        </div>
      </div>

      {/* MONEY */}
      <div
        style={{
          padding: "18px 28px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 18, marginBottom: 4 }}>
            <strong>Budget:</strong> ₹{job.budget_from} – {job.budget_to}
          </div>
          <div style={{ fontSize: 16 }}>
            <strong>Timeline:</strong>{job.timeline}
          </div>
          <div style={{ fontSize: 16 }}>
            <strong>Location:</strong> Remote
          </div>
        </div>

        <button
          style={{
            background: "#7A4DFF",
            padding: "12px 26px",
            borderRadius: 12,
            color: "#fff",
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          View Profile
        </button>
      </div>

      {/* SKILLS */}
      <div style={{ padding: "6px 28px", fontSize: 20, fontWeight: 600 }}>
        Skills Required
      </div>

      <div
        style={{
          padding: "12px 28px 20px",
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
          <div
            key={i}
            style={{
              padding: "10px 16px",
              background: "#FFEB99",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {s}
          </div>
        ))}
      </div>

      {/* DESCRIPTION */}
      <div style={{ padding: "6px 28px", fontSize: 20, fontWeight: 600 }}>
        Project Description
      </div>

      <div
        style={{
          padding: "10px 28px 20px",
          lineHeight: 1.6,
          fontSize: 15,
          color: "#444",
        }}
      >
        {job.description || "No description available."}
      </div>

      {/* FOOTER */}
      <div
        style={{
          padding: "18px 28px",
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #eee",
        }}
      >
        <button
          style={{
            width: "48%",
            padding: "14px",
            borderRadius: 14,
            border: "2px solid #A58BFF",
            color: "#7A4DFF",
            fontWeight: 700,
            background: "#fff",
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
            borderRadius: 14,
            background: "#A258FF",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
            border: "none",
          }}
        >
          CONNECT
        </button>
      </div>
    </div>
  );
}
