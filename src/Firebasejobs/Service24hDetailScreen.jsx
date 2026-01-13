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

//   const handleConnect = () => navigate(`/connect/${job.userId}`);
//   const handleFavorite = async () => {
//     const user = auth.currentUser;
//     if (!user) {
//       alert("Please login to save this job.");
//       navigate("/firelogin");
//       return;
//     }
//     try {
//       await updateDoc(doc(db, "users", user.uid), {
//         savedJobs: arrayUnion(id),
//       });
//       alert("Saved!");
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const initials = (job.clientName || job.title || "UN")
//     .substring(0, 2)
//     .toUpperCase();

//   return (
//     <div
//       style={{
//         maxWidth: "900px",
//         margin: "0 auto",
//         background: "#fff",
//         paddingBottom: 20,
//         borderRadius: 18,
//         boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
//         fontFamily: "'Inter', sans-serif",
//       }}
//     >
//       {/* HEADER */}
//       <div
//         style={{
//           padding: "25px 30px 10px",
//           display: "flex",
//           justifyContent: "space-between",
//         }}
//       >
//         <h2 style={{ fontSize: 24, fontWeight: 700 }}>Project Details</h2>

//         <div style={{ display: "flex", gap: 18 }}>
//           <span style={{ cursor: "pointer" }}>🔗</span>
//           <span style={{ cursor: "pointer" }}>🔔</span>
//           <span
//             style={{ cursor: "pointer" }}
//             onClick={() => navigate(-1)}
//           >
//             ❌
//           </span>
//         </div>
//       </div>

//       {/* PROFILE SECTION */}
//       <div
//         style={{
//           padding: "10px 30px",
//           display: "flex",
//           alignItems: "center",
//           gap: 20,
//         }}
//       >
//         <div
//           style={{
//             width: 65,
//             height: 65,
//             borderRadius: 18,
//             background: "linear-gradient(180deg,#9A70FF,#6A3EFF)",
//             color: "#fff",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             fontWeight: 700,
//             fontSize: 22,
//           }}
//         >
//           {initials}
//         </div>

//         <div>
//           <div style={{ fontSize: 28, fontWeight: 600 }}>{job.clientName}</div>
//           <div style={{ fontSize: 16, color: "#7C3CFF" }}>UIUX Designer</div>
//         </div>

//         <div style={{ marginLeft: "auto", marginRight: 40 }}>
//           <button
//             style={{
//               background: "#7A4DFF",
//               color: "#fff",
//               border: "none",
//               padding: "10px 22px",
//               borderRadius: 12,
//               fontWeight: 600,
//               cursor: "pointer",
//             }}
//           >
//             View Profile
//           </button>
//         </div>
//       </div>

//       {/* META ROW */}
//       <div
//         style={{
//           padding: "0px 30px 20px",
//           display: "flex",
//           gap: 30,
//           color: "#555",
//           fontSize: 14,
//         }}
//       >
//         <span>👥 10 Applicants</span>
//         <span>🕒 5 days ago</span>
//       </div>

//       {/* BUDGET & TIMELINE */}
//       <div
//         style={{
//           padding: "0px 30px 14px",
//           display: "flex",
//           gap: 50,
//           fontSize: 16,
//         }}
//       >
//         <div>
//           <strong>Budget:</strong> ₹{job.price} – ₹6000
//         </div>

//         <div>
//           <strong>Timeline:</strong> {job.timeline || "2 - 3 weeks"}
//         </div>

//         <div>
//           <strong>Location:</strong> Remote
//         </div>
//       </div>

//       {/* EXTRA META */}
//       <div
//         style={{
//           padding: "5px 30px 20px",
//           display: "flex",
//           gap: 80,
//           fontSize: 15,
//         }}
//       >
//         <div>Service Posted: {job.posted || 3}</div>
//         <div>Completed Projects: {job.completed || 10}</div>
//       </div>

//       {/* SKILLS */}
//       <div style={{ padding: "10px 30px", fontSize: 20, fontWeight: 600 }}>
//         Skills Required
//       </div>

//       <div
//         style={{
//           padding: "0px 30px 25px",
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
//           <span
//             key={i}
//             style={{
//               background: "#FFEB99",
//               padding: "8px 14px",
//               borderRadius: 10,
//               fontSize: 14,
//               fontWeight: 600,
//             }}
//           >
//             {s}
//           </span>
//         ))}
//       </div>

//       {/* DESCRIPTION */}
//       <div
//         style={{
//           padding: "10px 30px",
//           fontSize: 20,
//           fontWeight: 600,
//         }}
//       >
//         Project Description
//       </div>

//       <div
//         style={{
//           padding: "0px 30px 20px",
//           lineHeight: 1.6,
//           fontSize: 15,
//           color: "#444",
//         }}
//       >
//         {job.description}
//       </div>

//       {/* FOOTER BUTTONS */}
//       <div
//         style={{
//           padding: "16px 30px",
//           display: "flex",
//           justifyContent: "space-between",
//           borderTop: "1px solid #eee",
//         }}
//       >
//         <button
//           style={{
//             width: "48%",
//             padding: "14px",
//             borderRadius: 12,
//             fontWeight: 700,
//             border: "2px solid #A58BFF",
//             background: "#fff",
//             color: "#7A4DFF",
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
//             borderRadius: 12,
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








// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
// import { db } from "../firbase/Firebase";
// import { getAuth } from "firebase/auth";
// import share from "../assets/share.png";

// import { FiUsers, FiClock, FiX } from "react-icons/fi";

// export default function Service24hPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [job, setJob] = useState(null);
//   const auth = getAuth();

//   useEffect(() => {
//     async function fetchJob() {
//       const docRef = doc(db, "service_24h", id);
//       const snap = await getDoc(docRef);
//       if (snap.exists()) setJob({ ...snap.data(), _id: snap.id });
//     }
//     fetchJob();
//   }, [id]);

//   if (!job) return <div>Loading...</div>;

//   const handleConnect = () => navigate(`/connect/${job.userId}`);

//   const handleFavorite = async () => {
//     const user = auth.currentUser;

//     if (!user) {
//       alert("Please login");
//       navigate("/firelogin");
//       return;
//     }

//     await updateDoc(doc(db, "users", user.uid), {
//       savedJobs: arrayUnion(id),
//     });

//     alert("Job saved!");
//   };

//   const handleShare = () => {
//     navigator.share
//       ? navigator.share({
//           title: job.title,
//           text: "Check this project",
//           url: window.location.href,
//         })
//       : alert("Share not supported");
//   };

//   const profileInitials = (job.clientName || job.title || "UN")
//     .substring(0, 2)
//     .toUpperCase();

//     console.log(job)
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
//       {/* HEADER */}
//       <div
//         style={{
//           padding: "22px 28px",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <div style={{ fontSize: 22, fontWeight: 700 }}>Project Details</div>

//         <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
//           <img
//             src={share}
//             width={20}
//             style={{ cursor: "pointer" }}
//             onClick={handleShare}
//           />
//           <FiX size={22} onClick={() => navigate(-1)} style={{ cursor: "pointer" }} />
//         </div>
//       </div>

//       {/* PROFILE */}
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
//           <div style={{ fontSize: 32, fontWeight: 500 }}>{job.title|| "Helen Angle"}</div>
//           <div style={{ fontSize: 18, color: "#7C3CFF", marginTop: 4 }}>{job.category}</div>
//         </div>
//       </div>

//       {/* META */}
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

//       {/* MONEY */}
//       <div
//         style={{
//           padding: "18px 28px 24px",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <div>
//           <div style={{ fontSize: 18, marginBottom: 4 }}>
//             <strong>Budget:</strong> ₹{job.budget_from} – {job.budget_to}
//           </div>
//           <div style={{ fontSize: 16 }}>
//             <strong>Timeline:</strong>{job.timeline}
//           </div>
//           <div style={{ fontSize: 16 }}>
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

//       {/* SKILLS */}
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

//       {/* DESCRIPTION */}
//       <div style={{ padding: "6px 28px", fontSize: 20, fontWeight: 600 }}>
//         Project Description
//       </div>

//       <div
//         style={{
//           padding: "10px 28px 20px",
//           lineHeight: 1.6,
//           fontSize: 15,
//           color: "#444",
//         }}
//       >
//         {job.description || "No description available."}
//       </div>

//       {/* FOOTER */}
//       <div
//         style={{
//           padding: "18px 28px",
//           display: "flex",
//           justifyContent: "space-between",
//           borderTop: "1px solid #eee",
//         }}
//       >
//         <button
//           style={{
//             width: "48%",
//             padding: "14px",
//             borderRadius: 14,
//             border: "2px solid #A58BFF",
//             color: "#7A4DFF",
//             fontWeight: 700,
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
//             background: "#A258FF",
//             color: "#fff",
//             fontWeight: 700,
//             cursor: "pointer",
//             border: "none",
//           }}
//         >
//           CONNECT
//         </button>
//       </div>
//     </div>
//   );
// }







// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   doc,
//   getDoc,
//   updateDoc,
//   arrayUnion,
//   collection,
//   query,
//   where,
//   getDocs,
//   onSnapshot,
// } from "firebase/firestore";

// import { db, auth } from "../firbase/Firebase";

// import { FiBookmark, FiX } from "react-icons/fi";
// import share from "../assets/share.png";
// import ConnectPopup from "../Firebasejobs/Connectpop/Connectpop";





// const css = `
// *{font-family:'Inter', sans-serif;}
// .page-wrap{
//   width:100%;
//   max-width:1100px;
//   margin:30px auto;
//   background:#fff;
//   border-radius:18px;
//   overflow:hidden;
//   box-shadow:0 8px 26px rgba(0,0,0,0.08);
// }
// .top-header{
//   padding:20px 24px;
//   display:flex;
//   justify-content:space-between;
//   align-items:center;
// }
// .top-left-title{font-size:22px;font-weight:700;}
// .top-icons{display:flex;gap:16px;font-size:20px;opacity:0.7;}
// .profile-box{padding:20px 24px;display:flex;gap:18px;}
// .profile-circle{
//   width:58px;height:58px;border-radius:16px;
//   background:linear-gradient(180deg,#9A70FF,#7A4DFF);
//   display:flex;align-items:center;justify-content:center;
//   font-size:20px;color:#fff;
// }
// .profile-info .name{font-size:36px;}
// .profile-info .role{font-size:20px;color:#7C3CFF;}
// .meta-row{padding:10px 24px;font-size:14px;color:#555;}
// .money-box{padding:20px 24px;display:flex;justify-content:space-between;}
// .range{font-size:22px;font-weight:700;}
// .sub-text{font-size:14px;color:#555;}
// .view-btn{
//   background:#7A4DFF;padding:12px 28px;border-radius:12px;
//   color:#fff;border:none;font-weight:600;
// }
// .skill-title,.desc-title{padding:10px 24px;font-size:20px;font-weight:700;}
// .skills-box{padding:8px 24px 20px;display:flex;flex-wrap:wrap;gap:10px;}
// .skill-chip{padding:8px 14px;background:#FFEB99;border-radius:10px;font-weight:600;}
// .desc-text{padding:10px 24px 20px;font-size:15px;color:#444;}
// .footer-actions{
//   display:flex;justify-content:space-between;
//   padding:18px 24px;border-top:1px solid #eee;
// }
// .cancel-btn{
//   width:48%;padding:14px;border-radius:12px;
//   border:2px solid #A58BFF;background:#fff;color:#7A4DFF;font-weight:700;
// }
// .connect-btn{
//   width:48%;padding:14px;border-radius:12px;
//   border:none;background:#A258FF;color:#fff;font-weight:700;
// }
// `;

// export default function Service24hPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [job, setJob] = useState(null);
//   const [clientServices, setClientServices] = useState([]);
//   const [connectOpen, setConnectOpen] = useState(false);
//   const [isFavorite, setIsFavorite] = useState(false);


//   const [isAccepted, setIsAccepted] = useState(false);
//   const [chatFreelancerId, setChatFreelancerId] = useState(null);



//   console.log(isAccepted)


//   useEffect(() => {
//     if (!id) return;

//     const unsubscribe = onSnapshot(
//       query(
//         collection(db, "notifications"),
//         where("jobId", "==", id),
//         where("clientUid", "==", auth.currentUser?.uid)
//       ),
//       (snap) => {
//         if (!snap.empty) {
//           const acceptedNotif = snap.docs.find(doc => doc.data().read === true);
//           if (acceptedNotif) {
//             setIsAccepted(true);
//             setChatFreelancerId(acceptedNotif.data().freelancerId);
//           } else {
//             setIsAccepted("applied");
//             setChatFreelancerId(snap.docs[0].data().freelancerId);
//           }
//         } else {
//           setIsAccepted(false);
//           setChatFreelancerId(null);
//         }
//       }
//     );

//     return () => unsubscribe();
//   }, [id]);



//   useEffect(() => {
//     const s = document.createElement("style");
//     s.innerHTML = css;
//     document.head.appendChild(s);
//     return () => s.remove();
//   }, []);


//   useEffect(() => {
//     if (!id) return;

//     const ref = doc(db, "service_24h", id);

//     const unsubscribe = onSnapshot(ref, (snap) => {
//       if (snap.exists()) {
//         setJob({ ...snap.data(), _id: snap.id });
//       }
//     });

//     return () => unsubscribe();
//   }, [id]);



//   useEffect(() => {
//     const loadClientServices = async () => {
//       if (!auth.currentUser) return;

//       const q = query(
//         collection(db, "services"),
//         where("userId", "==", auth.currentUser.uid)
//       );

//       const snap = await getDocs(q);
//       setClientServices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
//     };

//     loadClientServices();
//   }, []);

//   if (!job) return <div style={{ padding: 40, textAlign: "center" }}>Loading…</div>;

//   /* actions */
//   const handleSave = async () => {
//     if (!auth.currentUser) {
//       navigate("/firelogin");
//       return;
//     }
//     await updateDoc(doc(db, "users", auth.currentUser.uid), {
//       savedJobs: arrayUnion(id),
//     });
//     setIsFavorite(true);
//   };

//   const handleConnect = () => {
//     setConnectOpen(true);
//   };



//   const handleShare = () => {
//     navigator.share
//       ? navigator.share({
//         title: job.title,
//         text: "Check this project",
//         url: window.location.href,
//       })
//       : alert("Share not supported");
//   };

//   return (
//     <div className="page-wrap">
//       {/* HEADER */}
//       <div className="top-header">
//         <div className="top-left-title">Project Details</div>
//         <div className="top-icons">
//           <FiBookmark
//             onClick={handleSave}
//             style={{
//               cursor: "pointer",
//               color: isFavorite ? "#7B2BFF" : "inherit",
//               fill: isFavorite ? "#7B2BFF" : "none",
//             }}
//           />
//           <img src={share} width={18} onClick={handleShare} />
//           <FiX onClick={() => navigate(-1)} />
//         </div>
//       </div>

//       {/* PROFILE */}
//       <div className="profile-box">
//         <div className="profile-circle">
//           {job.title?.substring(0, 2).toUpperCase()}
//         </div>
//         <div className="profile-info">
//           <div className="name">{job.title}</div>
//           <div className="role">{job.category}</div>
//         </div>
//       </div>

//       {/* META */}
//       <div className="meta-row">
//         🕒 {job.createdAt ? job.createdAt.toDate().toLocaleString() : "—"}
//       </div>

//       {/* MONEY */}
//       <div className="money-box">
//         <div>
//           <div className="range">₹{job.budget_from} - ₹{job.budget_to}</div>
//           <div className="sub-text">Timeline: {job.timeline || "24 Hours"}</div>
//           <div className="sub-text">Location: Remote</div>
//         </div>
//         <button
//           className="view-btn"
//           onClick={() => navigate(`/connect/${job.userId}`)}
//         >
//           View Profile
//         </button>
//       </div>

//       {/* SKILLS */}
//       <div className="skill-title">Skills Required</div>
//       <div className="skills-box">
//         {(job.skills || []).map((s, i) => (
//           <div key={i} className="skill-chip">{s}</div>
//         ))}
//       </div>

//       {/* DESCRIPTION */}
//       <div className="desc-title">Project Description</div>
//       <div className="desc-text">{job.description}</div>

//       {/* FOOTER */}
//       <div className="footer-actions">
//         <button className="cancel-btn" onClick={() => navigate(-1)}>
//           Cancel
//         </button>



//         <button
//           className="connect-btn"
//           style={{
//             background: isAccepted === true ? "#4CAF50" : "#A258FF",
//             cursor: isAccepted === "applied" ? "not-allowed" : "pointer",
//           }}
//           onClick={() => {
//             if (isAccepted === true) {
//               navigate(`/chat/${chatFreelancerId}`);
//             } else if (isAccepted === false) {
//               handleConnect();
//             }
//           }}
//         >
//           {isAccepted === true
//             ? "Start Chat"
//             : isAccepted === "applied"
//               ? "Applied By"
//               : "Hire Me"}
//         </button>



//         <ConnectPopup
//           open={connectOpen}
//           onClose={() => setConnectOpen(false)}
//           freelancerId={job.userId}
//           freelancerName={job.title}
//           services={clientServices}
//         />
//       </div>
//     </div>
//   );
// }





import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

import { db, auth } from "../firbase/Firebase";

import { FiBookmark, FiX } from "react-icons/fi";
import share from "../assets/share.png";
import ConnectPopup from "../Firebasejobs/Connectpop/Connectpop";
import { onAuthStateChanged } from "firebase/auth";





const css = `
*{font-family:'Inter', sans-serif;}
.page-wrap{
  width:100%;
  max-width:1100px;
  margin:30px auto;
  background:#fff;
  border-radius:18px;
  overflow:hidden;
  box-shadow:0 8px 26px rgba(0,0,0,0.08);
}
.top-header{
  padding:20px 24px;
  display:flex;
  justify-content:space-between;
  align-items:center;
}
.top-left-title{font-size:22px;font-weight:700;}
.top-icons{display:flex;gap:16px;font-size:20px;opacity:0.7;}
.profile-box{padding:20px 24px;display:flex;gap:18px;}
.profile-circle{
  width:58px;height:58px;border-radius:16px;
  background:linear-gradient(180deg,#9A70FF,#7A4DFF);
  display:flex;align-items:center;justify-content:center;
  font-size:20px;color:#fff;
}
.profile-info .name{font-size:36px;}
.profile-info .role{font-size:20px;color:#7C3CFF;}
.meta-row{padding:10px 24px;font-size:14px;color:#555;}
.money-box{padding:20px 24px;display:flex;justify-content:space-between;}
.range{font-size:22px;font-weight:700;}
.sub-text{font-size:14px;color:#555;}
.view-btn{
  background:#7A4DFF;padding:12px 28px;border-radius:12px;
  color:#fff;border:none;font-weight:600;
}
.skill-title,.desc-title{padding:10px 24px;font-size:20px;font-weight:700;}
.skills-box{padding:8px 24px 20px;display:flex;flex-wrap:wrap;gap:10px;}
.skill-chip{padding:8px 14px;background:#FFEB99;border-radius:10px;font-weight:600;}
.desc-text{padding:10px 24px 20px;font-size:15px;color:#444;}
.footer-actions{
  display:flex;justify-content:space-between;
  padding:18px 24px;border-top:1px solid #eee;
}
.cancel-btn{
  width:48%;padding:14px;border-radius:12px;
  border:2px solid #A58BFF;background:#fff;color:#7A4DFF;font-weight:700;
}
.connect-btn{
  width:48%;padding:14px;border-radius:12px;
  border:none;background:#A258FF;color:#fff;font-weight:700;
}
`;

export default function Service24hPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [clientServices, setClientServices] = useState([]);
  const [connectOpen, setConnectOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);


  const [isAccepted, setIsAccepted] = useState(false);

  // null | "hire" | "chat"
  const [requestStatus, setRequestStatus] = useState("hire");
  const [chatFreelancerId, setChatFreelancerId] = useState(null);

  const [notification, setNotification] = useState(null);



useEffect(() => {
  if (!id) return;

  let unsubscribeSnap = null;

  const fetchNotifications = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      where("jobId", "==", id),
      where("clientUid", "==", user.uid),
      // where("type", "==", "application")
    );

    console.log()

    unsubscribeSnap = onSnapshot(q, (snap) => {
      if (snap.empty) {
        setNotification([]);
        setRequestStatus("hire");
        setChatFreelancerId(null);
        setIsAccepted(false);
        return;
      }

      const allNotifications = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNotification(allNotifications);

      // Decide requestStatus based on **any unread notification**
      const unreadNotification = allNotifications.find(n => n.read === false);
      if (unreadNotification) {
        setRequestStatus("chat");
        setChatFreelancerId(unreadNotification.freelancerId);
      } else {
        setRequestStatus("hire");
        setChatFreelancerId(null);
      }

      // Check if any notification is accepted
      setIsAccepted(allNotifications.some(n => n.status === "accepted"));
    });
  };

  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    if (user) fetchNotifications();
  });

  // If user is already logged in
  if (auth.currentUser) fetchNotifications();

  return () => {
    unsubscribeAuth();
    if (unsubscribeSnap) unsubscribeSnap();
  };
}, [id]);



  console.log("notifiaction :", notification)

  console.log(id)

  console.log()

  useEffect(() => {
    const s = document.createElement("style");
    s.innerHTML = css;
    document.head.appendChild(s);
    return () => s.remove();
  }, []);


  useEffect(() => {
    if (!id) return;

    const ref = doc(db, "service_24h", id);

    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setJob({ ...snap.data(), _id: snap.id });
      }
    });

    return () => unsubscribe();
  }, [id]);



  useEffect(() => {
    const loadClientServices = async () => {
      if (!auth.currentUser) return;

      const q = query(
        collection(db, "services"),
        where("userId", "==", auth.currentUser.uid)
      );

      const snap = await getDocs(q);
      setClientServices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    loadClientServices();
  }, []);

  if (!job) return <div style={{ padding: 40, textAlign: "center" }}>Loading…</div>;

  /* actions */
  const handleSave = async () => {
    if (!auth.currentUser) {
      navigate("/firelogin");
      return;
    }
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      savedJobs: arrayUnion(id),
    });
    setIsFavorite(true);
  };



  const handleConnect = async () => {
    setConnectOpen(true);

    if (!notification) return;

    await updateDoc(doc(db, "notifications", notification.id), { read: true });
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

  return (
    <div className="page-wrap">
      {/* HEADER */}
      <div className="top-header">
        <div className="top-left-title">Project Details</div>
        <div className="top-icons">
          <FiBookmark
            onClick={handleSave}
            style={{
              cursor: "pointer",
              color: isFavorite ? "#7B2BFF" : "inherit",
              fill: isFavorite ? "#7B2BFF" : "none",
            }}
          />
          <img src={share} width={18} onClick={handleShare} />
          <FiX onClick={() => navigate(-1)} />
        </div>
      </div>

      {/* PROFILE */}
      <div className="profile-box">
        <div className="profile-circle">
          {job.title?.substring(0, 2).toUpperCase()}
        </div>
        <div className="profile-info">
          <div className="name">{job.title}</div>
          <div className="role">{job.category}</div>
        </div>
      </div>

      {/* META */}
      <div className="meta-row">
        🕒 {job.createdAt ? job.createdAt.toDate().toLocaleString() : "—"}
      </div>

      {/* MONEY */}
      <div className="money-box">
        <div>
          <div className="range">₹{job.budget_from} - ₹{job.budget_to}</div>
          <div className="sub-text">Timeline: {job.timeline || "24 Hours"}</div>
          <div className="sub-text">Location: Remote</div>
        </div>
        <button
          className="view-btn"
          onClick={() => navigate(`/connect/${job.userId}`)}
        >
          View Profile
        </button>
      </div>

      {/* SKILLS */}
      <div className="skill-title">Skills Required</div>
      <div className="skills-box">
        {(job.skills || []).map((s, i) => (
          <div key={i} className="skill-chip">{s}</div>
        ))}
      </div>

      {/* DESCRIPTION */}
      <div className="desc-title">Project Description</div>
      <div className="desc-text">{job.description}</div>

      {/* FOOTER */}
      <div className="footer-actions">
        <button className="cancel-btn" onClick={() => navigate(-1)}>
          Cancel
        </button>


        <button
          className="connect-btn"
          style={{
            background: requestStatus === "chat" ? "#4CAF50" : "#A258FF",
          }}
          onClick={() => {
            if (requestStatus === "chat") {
              navigate(`/chat/${chatFreelancerId}`);
            } else {
              handleConnect();
            }
          }}
        >
          {requestStatus === "chat" ? "Start Message" : "Hire Me"}
        </button>


        <ConnectPopup
          open={connectOpen}
          onClose={() => setConnectOpen(false)}
          freelancerId={job.userId}
          freelancerName={job.title}
          services={clientServices}
        />
      </div>
    </div>
  );
}












// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   doc,
//   getDocs,
//   updateDoc,
//   arrayUnion,
//   collection,
//   query,
//   where,
//   onSnapshot,
//   orderBy,
// } from "firebase/firestore";
// import { db, auth } from "../firbase/Firebase";
// import clock from "../assets/clock.png"

// import { FiBookmark, FiX } from "react-icons/fi";
// import share from "../assets/share.png";
// import ConnectPopup from "../Firebasejobs/Connectpop/Connectpop";

// /* ======================= STYLES ======================= */
// const css = `
// *{font-family:'Inter', sans-serif;}
// .page-wrap{
//   max-width:1100px;
//   margin:30px auto;
//   background:#fff;
//   border-radius:18px;
//   box-shadow:0 8px 26px rgba(0,0,0,0.08);
// }
// .top-header{padding:20px 24px;display:flex;justify-content:space-between;}
// .top-left-title{font-size:22px;font-weight:700;}
// .top-icons{display:flex;gap:16px;font-size:20px;opacity:0.7;}
// .profile-box{padding:20px 24px;display:flex;gap:18px;}
// .profile-circle{
//   width:58px;height:58px;border-radius:16px;
//   background:linear-gradient(180deg,#9A70FF,#7A4DFF);
//   display:flex;align-items:center;justify-content:center;
//   color:#fff;font-size:20px;
// }
// .profile-info .name{font-size:36px;}
// .profile-info .role{font-size:20px;color:#7C3CFF;}
// .meta-row{padding:10px 24px;color:#555;}
// .money-box{padding:20px 24px;display:flex;justify-content:space-between;}
// .range{font-size:22px;font-weight:700;}
// .sub-text{font-size:14px;color:#555;}
// .view-btn{background:#7A4DFF;color:#fff;border:none;padding:12px 28px;border-radius:12px;}
// .skill-title,.desc-title{padding:10px 24px;font-size:20px;font-weight:700;}
// .skills-box{padding:8px 24px 20px;display:flex;flex-wrap:wrap;gap:10px;}
// .skill-chip{background:#FFEB99;padding:8px 14px;border-radius:10px;}
// .desc-text{padding:10px 24px 20px;color:#444;}
// .footer-actions{
//   display:flex;justify-content:space-between;
//   padding:18px 24px;border-top:1px solid #eee;
// }
// .cancel-btn{
//   width:48%;padding:14px;border-radius:12px;
//   border:2px solid #A58BFF;background:#fff;color:#7A4DFF;
// }
// .connect-btn{
//   width:48%;padding:14px;border-radius:12px;
//   border:none;background:#A258FF;color:#fff;font-weight:700;
// }
// `;

// /* ======================= COMPONENT ======================= */
// export default function Service24hPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [job, setJob] = useState(null);
//   const [clientServices, setClientServices] = useState([]);
//   const [connectOpen, setConnectOpen] = useState(false);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [notifications, setNotifications] = useState([]);

//   /* ======================= LOAD CSS ======================= */
//   useEffect(() => {
//     const style = document.createElement("style");
//     style.innerHTML = css;
//     document.head.appendChild(style);
//     return () => style.remove();
//   }, []);

//   /* ======================= LOAD JOB ======================= */
//   useEffect(() => {
//     if (!id) return;

//     const unsub = onSnapshot(doc(db, "service_24h", id), snap => {
//       if (snap.exists()) {
//         setJob({ ...snap.data(), _id: snap.id });
//       }
//     });

//     return () => unsub();
//   }, [id]);

//   /* ======================= LOAD SERVICES ======================= */
//   useEffect(() => {
//     if (!auth.currentUser) return;

//     getDocs(
//       query(collection(db, "services"), where("userId", "==", auth.currentUser.uid))
//     ).then(snap =>
//       setClientServices(snap.docs.map(d => ({ id: d.id, ...d.data() })))
//     );
//   }, []);

//   /* ======================= LOAD NOTIFICATIONS ======================= */
//   useEffect(() => {
//     if (!auth.currentUser) return;
//     const uid = auth.currentUser.uid;

//     const q1 = query(
//       collection(db, "notifications"),
//       where("clientUid", "==", uid),
//       orderBy("timestamp", "desc")
//     );

//     const q2 = query(
//       collection(db, "notifications"),
//       where("freelancerId", "==", uid),
//       orderBy("timestamp", "desc")
//     );

//     let a = [], b = [];

//     const merge = () => {
//       const map = new Map();
//       [...clientData, ...freelancerData].forEach(n => map.set(n.id, n));
//       setNotifications([...map.values()]);
//     };

//     const u1 = onSnapshot(q1, s => {
//       clientData = s.docs.map(d => ({ id: d.id, ...d.data() }));
//       merge();
//     });

//     const u2 = onSnapshot(q2, s => {
//       freelancerData = s.docs.map(d => ({ id: d.id, ...d.data() }));
//       merge();
//     });

//     return () => {
//       u1();
//       u2();
//     };
//   }, []);

//   if (!job) return <div style={{ padding: 40 }}>Loading…</div>;

//   /* ======================= CURRENT NOTIFICATION ======================= */
//   const currentNotification = notifications.find(
//     n =>
//       n.serviceId === id &&
//       (n.clientUid === auth.currentUser?.uid ||
//         n.freelancerId === auth.currentUser?.uid)
//   );

//   /* ======================= ACTIONS ======================= */
//   const handleSave = async () => {
//     await updateDoc(doc(db, "users", auth.currentUser.uid), {
//       savedJobs: arrayUnion(id),
//     });
//     setIsFavorite(true);
//   };

//   const handleHire = async () => {
//     setConnectOpen(true);
//   };

//   const handleStartChat = () => {
//     navigate("/chat", {
//       state: {
//         currentUid: auth.currentUser.uid,
//         otherUid:
//           auth.currentUser.uid === currentNotification.clientUid
//             ? currentNotification.freelancerId
//             : currentNotification.clientUid,
//         otherName: job.title,
//         otherImage: job.profileImage || "",
//         initialMessage: "Hi, I would like to discuss this project",
//       },
//     });
//   };

//   /* ======================= RENDER ======================= */
//   return (
//     <div className="page-wrap">
//       {/* HEADER */}
//       <div className="top-header">
//         <div className="top-left-title">Project Details</div>
//         <div className="top-icons">
//           <FiBookmark onClick={handleSave} style={{ color: isFavorite ? "#7B2BFF" : "" }} />
//           <img src={share} width={18} onClick={() => navigator.share?.({ url: window.location.href })} />
//           <FiX onClick={() => navigate(-1)} />
//         </div>
//       </div>

//       {/* PROFILE */}
//       <div className="profile-box">
//         <div className="profile-circle">{job.title?.slice(0, 2).toUpperCase()}</div>
//         <div className="profile-info">
//           <div className="name">{job.title}</div>
//           <div className="role">{job.category}</div>
//         </div>
//       </div>

//       <div className="meta-row"><img style={{width:"15px",marginTop:"10px"}} src={clock} alt="clock" /> {job.createdAt?.toDate().toLocaleString()}</div>

//       <div className="money-box">
//         <div>
//           <div className="range">₹{job.budget_from} - ₹{job.budget_to}</div>
//           <div className="sub-text">Timeline: 24 Hours</div>
//         </div>
//         <button
//           className="view-btn"
//           onClick={() =>
//             navigate(`/client-dashbroad2/freelancerblockSreen/${job.freelancerId || job.userId}`)
//           }
//         >          View Profile.
//         </button>
//       </div>

//       <div className="skill-title">Skills Required</div>
//       <div className="skills-box">
//         {(job.skills || []).map((s, i) => <div key={i} className="skill-chip">{s}</div>)}
//       </div>

//       <div className="desc-title">Project Description</div>
//       <div className="desc-text">{job.description}</div>

//       {/* FOOTER */}
//       <div className="footer-actions">
//         <button className="cancel-btn" onClick={() => navigate(-1)}>Cancel</button>

//         {currentNotification ? (
//           currentNotification.read ? (
//             <button className="connect-btn" style={{ background: "#4CAF50" }} onClick={handleStartChat}>
//               Start Message
//             </button>
//           ) : (
//             <button className="connect-btn" disabled style={{ background: "#BDBDBD" }}>
//               Request Sent
//             </button>
//           )
//         ) : (
//           <button className="connect-btn" onClick={handleHire}>
//             Hire now
//           </button>
//         )}

//         <ConnectPopup
//           open={connectOpen}
//           onClose={() => setConnectOpen(false)}
//           freelancerId={job.userId}
//           freelancerName={job.title}
//           services={clientServices}
//         />
//       </div>
//     </div>
//   );
// }