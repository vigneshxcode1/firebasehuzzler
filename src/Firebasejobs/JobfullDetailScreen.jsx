// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   doc,
//   getDoc,
//   updateDoc,
//   arrayUnion,
//   increment,
//   collection,
//   addDoc,
//   onSnapshot,
// } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { db } from "../firbase/Firebase";

// import { FiX, FiBookmark, FiShare2 } from "react-icons/fi";
// import { MdAccessTime, MdDateRange } from "react-icons/md";
// import { IoLocationOutline } from "react-icons/io5";
// import { FaUsers } from "react-icons/fa";
// import share from "../assets/share.png";

// // ---- Add Rubik font globally ----
// const rubikFontStyle = {
//   fontFamily: "'Rubik', sans-serif",
// };

// export default function JobFullDetailJobScreen() {
//   const { id: jobId } = useParams();
//   const auth = getAuth();
//   const user = auth.currentUser;
//   const navigate = useNavigate();

//   const [job, setJob] = useState(null);
//   const [isApplied, setIsApplied] = useState(false);
//   const [isFavorite, setIsFavorite] = useState(false);

//   // -------------------------
//   // 🔥 Load Job Data
//   // -------------------------
//   useEffect(() => {
//     const unsub = onSnapshot(doc(db, "jobs", jobId), (snap) => {
//       if (snap.exists()) setJob({ id: snap.id, ...snap.data() });
//     });
//     return unsub;
//   }, [jobId]);

//   // -------------------------
//   // ⭐ Load Saved Jobs
//   // -------------------------
//   useEffect(() => {
//     if (!user) return;
//     const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
//       const favorites = snap.data()?.favoriteJobs || [];
//       setIsFavorite(favorites.includes(jobId));
//     });
//     return unsub;
//   }, [user, jobId]);

//   // -------------------------
//   // 📝 Check Applied
//   // -------------------------
//   useEffect(() => {
//     if (job && user) {
//       const applicants = job.applicants || [];
//       setIsApplied(applicants.some((a) => a.freelancerId === user.uid));
//     }
//   }, [job, user]);

//   // -------------------------
//   // ⭐ Save / Unsave Job
//   // -------------------------
//   async function handleSave() {
//     if (!user) return alert("Login required!");

//     const userRef = doc(db, "users", user.uid);
//     const userSnap = await getDoc(userRef);
//     const favorites = userSnap.data()?.favoriteJobs || [];

//     let updated;

//     if (favorites.includes(jobId)) {
//       updated = favorites.filter((id) => id !== jobId); // ❌ remove
//     } else {
//       updated = [...favorites, jobId]; // ✔ add
//     }

//     await updateDoc(userRef, { favoriteJobs: updated });

//     setIsFavorite(updated.includes(jobId));
//   }



//   // -------------------------
//   // ⚡ Apply for Job
//   // -------------------------
//   async function handleApply(jobId) {
//     try {
//       const userId = user.uid;

//       const freelancerSnap = await getDoc(doc(db, "users", userId));
//       const freelancer = freelancerSnap.data() || {};
//       const freelancerName = `${freelancer.firstName || ""} ${freelancer.lastName || ""
//         }`.trim();
//       const freelancerImage = freelancer.profileImage || "";

//       const jobRef = doc(db, "jobs", jobId);
//       const jobSnap = await getDoc(jobRef);
//       const jobData = jobSnap.data() || {};

//       if ((jobData.applicants || []).some((a) => a.freelancerId === userId)) {
//         alert("Already applied!");
//         return;
//       }

//       await updateDoc(jobRef, {
//         applicants: arrayUnion({
//           freelancerId: userId,
//           name: freelancerName,
//           profileImage: freelancerImage,
//           appliedAt: new Date(),
//         }),
//         applicants_count: increment(1),
//       });

//       await addDoc(collection(db, "notifications"), {
//         title: jobData.title,
//         body: `${freelancerName} applied for ${jobData.title}`,
//         freelancerName,
//         freelancerImage,
//         freelancerId: userId,
//         jobTitle: jobData.title,
//         jobId,
//         clientUid: jobData.userId,
//         timestamp: new Date(),
//         read: false,
//       });

//       alert("Applied successfully!");
//     } catch (e) {
//       console.error(e);
//       alert("Error applying.");
//     }
//   }

//   const handleShare = async () => {
//     const shareData = {
//       title: job.title,
//       text: job.description,
//       url: window.location.href, // or your job details page
//     };

//     // 👉 Mobile browser native share
//     if (navigator.share) {
//       try {
//         await navigator.share(shareData);
//       } catch (error) {
//         console.log("Share cancelled", error);
//       }
//       return;
//     }

//     // 👉 Fallback for browsers without navigator.share
//     navigator.clipboard.writeText(window.location.href);
//     alert("Link copied to clipboard!");
//   };


//   if (!job) return <div>Loading...</div>;

//   return (
//     <div
//       style={{
//         ...rubikFontStyle,
//         width: "100%",
//         minHeight: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         padding: "20px",
//         overflowX: "hidden",
//         background: "#F5F5F5",
//         boxSizing: "border-box",
//       }}
//     >
//       <div
//         style={{
//           width: "620px",
//           maxWidth: "100%",
//           background: "#fff",
//           borderRadius: "16px",
//           padding: "30px",
//           position: "relative",
//           boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
//           overflowY: "hidden",
//           boxSizing: "border-box",
//         }}
//       >
//         {/* ===== TOP RIGHT ICONS ===== */}
//         <div
//           style={{
//             position: "absolute",
//             top: "18px",
//             right: "18px",
//             display: "flex",
//             gap: "16px",
//             fontSize: "22px",
//             color: "#444",
//           }}
//         >
//           {/* ⭐ SAVE BUTTON */}
//           <div onClick={handleSave} style={{ cursor: "pointer" }}>
//             {isFavorite ? (
//               <FiBookmark style={{ color: "#7B2BFF", fill: "#7B2BFF" }} />
//             ) : (
//               <FiBookmark />
//             )}
//           </div>

//           <div className="flex items-center gap-3">

//             {/* <button */}
//               {/* onClick={handleShare}
//               className="p-2 rounded-full bg-gray-100 hover:bg-gray-200" */}
//             {/* > */}
//               <img src={share} alt="share" width={18} style={{ cursor: "pointer" }} onClick={handleShare} />
//               {/* <FiShare2 size={20} /> */}
//             {/* </button> */}
//           </div>

//           <FiX onClick={() => navigate(-1)} style={{ cursor: "pointer" }} />
//         </div>

//         {/* PAGE TITLE */}
//         <h2
//           style={{
//             fontSize: "24px",
//             fontWeight: "400",
//             lineHeight: "32px",
//             marginLeft: "-400px",
//             marginBottom: "-15px",
//             opacity: "60%",
//           }}
//         >
//           Project Details
//         </h2>

//         {/* MAIN TITLE */}
//         <h1
//           style={{
//             fontSize: "36px",
//             fontWeight: "400",
//             marginBottom: "2px",
//             lineHeight: "40px",
//           }}
//         >
//           {job.title}
//         </h1>

//         <p
//           style={{
//             fontSize: "20px",
//             fontWeight: "400",
//             lineHeight: "28px",
//             opacity: "60%",
//           }}
//         >
//           {job.category}
//         </p>

//         {/* ===== LABELS ===== */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             opacity: "60%",
//             fontSize: "14px",
//             marginBottom: "6px",
//           }}
//         >
//           <span>Budget</span>
//           <span>Timeline</span>
//           <span>Location</span>
//         </div>

//         {/* ===== VALUES ===== */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             fontSize: "16px",
//             fontWeight: "600",
//             marginBottom: "18px",
//           }}
//         >
//           <span>
//             ₹{job.budget_from} - ₹{job.budget_to}
//           </span>

//           <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
//             <MdDateRange size={18} /> {job.timeline}
//           </span>

//           <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
//             <IoLocationOutline size={18} /> Remote
//           </span>
//         </div>

//         {/* ===== APPLICANTS ===== */}
//         <div
//           style={{
//             display: "flex",
//             gap: "28px",
//             opacity: "60%",
//             fontSize: "14px",
//             marginBottom: "22px",
//           }}
//         >
//           <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
//             <FaUsers size={14} /> {job.applicants_count || 0} Applicants
//           </span>

//           <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
//             <MdAccessTime size={14} />
//             {job.created_at?.toDate
//               ? job.created_at.toDate().toLocaleDateString()
//               : "Recently"}
//           </span>
//         </div>

//         {/* ===== SKILLS ===== */}
//         <h3
//           style={{
//             marginBottom: "10px",
//             fontSize: "20px",
//             fontWeight: "400",
//             lineHeight: "28px",
//             marginTop: "30px",
//           }}
//         >
//           Skills Required
//         </h3>

//         <div
//           style={{
//             display: "flex",
//             flexWrap: "wrap",
//             gap: "10px",
//             marginBottom: "30px",
//           }}
//         >
//           {job.skills?.map((skill, i) => (
//             <span
//               key={i}
//               style={{
//                 background: "rgba(255, 240, 133, 0.7)",
//                 padding: "8px 14px",
//                 borderRadius: "8px",
//                 fontSize: "13px",
//                 fontWeight: "500",
//                 color: "#000",
//               }}
//             >
//               {skill}
//             </span>
//           ))}
//         </div>

//         {/* ===== DESCRIPTION ===== */}
//         <h3
//           style={{
//             marginBottom: "10px",
//             fontSize: "20px",
//             fontWeight: "400",
//             lineHeight: "28px",
//           }}
//         >
//           Project Description
//         </h3>

//         <div
//           style={{
//             maxHeight: "250px",
//             overflowY: "auto",
//             paddingRight: "5px",
//           }}
//         >
//           <p
//             style={{
//               color: "#555",
//               lineHeight: "1.6",
//               whiteSpace: "pre-line",
//               marginBottom: "30px",
//               fontSize: "15px",
//             }}
//           >
//             {job.description}
//           </p>
//         </div>

//         {/* ===== APPLY BUTTON ===== */}
//         <button
//           onClick={() => handleApply(job.id)}
//           disabled={isApplied}
//           style={{
//             width: "100%",
//             padding: "14px 0",
//             background: isApplied
//               ? "#aaa"
//               : "linear-gradient(90deg,#A155FF,#7B2BFF)",
//             borderRadius: "10px",
//             border: "none",
//             color: "#fff",
//             fontSize: "16px",
//             fontWeight: "600",
//             cursor: "pointer",
//             marginTop: "10px",
//             transition: "0.2s",
//           }}
//         >
//           {isApplied ? "Already Applied" : "Apply for this Project"}
//         </button>
//       </div>
//     </div>
//   );
// }



// ⭐ FULL UPDATED WITH SIDEBAR SUPPORT ⭐

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   doc,
//   getDoc,
//   updateDoc,
//   arrayUnion,
//   increment,
//   collection,
//   addDoc,
//   onSnapshot,
// } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { db } from "../firbase/Firebase";

// import { FiX, FiBookmark } from "react-icons/fi";
// import { MdAccessTime, MdDateRange } from "react-icons/md";
// import { IoLocationOutline } from "react-icons/io5";
// import { FaUsers } from "react-icons/fa";
// import share from "../assets/share.png";

// const rubikFontStyle = {
//   fontFamily: "'Rubik', sans-serif",
// };

// export default function JobFullDetailJobScreen() {
//   const { id: jobId } = useParams();
//   const auth = getAuth();
//   const user = auth.currentUser;
//   const navigate = useNavigate();

//   const [job, setJob] = useState(null);
//   const [isApplied, setIsApplied] = useState(false);
//   const [isFavorite, setIsFavorite] = useState(false);

//   // ⭐ Sidebar Collapsed State
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   // ⭐ Listen for sidebar toggle events
//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   // 🔥 Fetch job data
//   useEffect(() => {
//     const unsub = onSnapshot(doc(db, "jobs", jobId), (snap) => {
//       if (snap.exists()) setJob({ id: snap.id, ...snap.data() });
//     });
//     return unsub;
//   }, [jobId]);

//   // ⭐ Fetch saved jobs
//   useEffect(() => {
//     if (!user) return;
//     const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
//       const favorites = snap.data()?.favoriteJobs || [];
//       setIsFavorite(favorites.includes(jobId));
//     });
//     return unsub;
//   }, [user, jobId]);

//   // 📝 Check applied
//   useEffect(() => {
//     if (job && user) {
//       const applied = job.applicants?.some((a) => a.freelancerId === user.uid);
//       setIsApplied(applied);
//     }
//   }, [job, user]);

//   // ⭐ Save/Unsave Job
//   async function handleSave() {
//     if (!user) return alert("Login required!");

//     const userRef = doc(db, "users", user.uid);
//     const userSnap = await getDoc(userRef);
//     const favorites = userSnap.data()?.favoriteJobs || [];

//     const updated = favorites.includes(jobId)
//       ? favorites.filter((id) => id !== jobId)
//       : [...favorites, jobId];

//     await updateDoc(userRef, { favoriteJobs: updated });
//     setIsFavorite(updated.includes(jobId));
//   }

//   // ⚡ Apply
//   async function handleApply(jobId) {
//     if (!user) return;
//     try {
//       const userId = user.uid;

//       const freelancerData = (await getDoc(doc(db, "users", userId))).data() || {};
//       const jobData = (await getDoc(doc(db, "jobs", jobId))).data() || {};

//       if (jobData.applicants?.some((a) => a.freelancerId === userId)) {
//         alert("Already applied!");
//         return;
//       }

//       await updateDoc(doc(db, "jobs", jobId), {
//         applicants: arrayUnion({
//           freelancerId: userId,
//           name: `${freelancerData.firstName || ""} ${freelancerData.lastName || ""}`,
//           profileImage: freelancerData.profileImage || "",
//           appliedAt: new Date(),
//         }),
//         applicants_count: increment(1),
//       });

//       await addDoc(collection(db, "notifications"), {
//         freelancerId: userId,
//         freelancerName: `${freelancerData.firstName || ""} ${freelancerData.lastName || ""}`,
//         freelancerImage: freelancerData.profileImage || "",
//         jobId,
//         jobTitle: jobData.title,
//         clientUid: jobData.userId,
//         title: jobData.title,
//         timestamp: new Date(),
//         read: false,
//       });

//       alert("Applied successfully!");
//     } catch {
//       alert("Error applying.");
//     }
//   }

//   const handleShare = async () => {
//     const shareData = {
//       title: job.title,
//       text: job.description,
//       url: window.location.href,
//     };

//     if (navigator.share) return navigator.share(shareData);

//     navigator.clipboard.writeText(window.location.href);
//     alert("Link copied!");
//   };

//   if (!job) return <div>Loading...</div>;

//   return (
//     <div
//       style={{
//         marginLeft: collapsed ? "-110px" : "50px",
//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       <div
//         style={{
//           ...rubikFontStyle,
//           width: "100%",
//           minHeight: "100vh",
//           display: "flex",
//           justifyContent: "center",
//           padding: "20px",
//           overflowX: "hidden",
//           background: "#F5F5F5",
//         }}
//       >
//         <div
//           style={{
//             width: "620px",
//             background: "#fff",
//             borderRadius: "16px",
//             padding: "30px",
//             position: "relative",
//             boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
//           }}
//         >
//           {/* TOP BUTTONS */}
//           <div style={{ position: "absolute", right: 18, top: 18, display: "flex", gap: 16 }}>
//             <div onClick={handleSave} style={{ cursor: "pointer" }}>
//               {isFavorite ? (
//                 <FiBookmark style={{ color: "#7B2BFF", fill: "#7B2BFF" }} />
//               ) : (
//                 <FiBookmark />
//               )}
//             </div>

//             <img src={share} width={18} style={{ cursor: "pointer" }} onClick={handleShare} />

//             <FiX onClick={() => navigate(-1)} style={{ cursor: "pointer" }} />
//           </div>

//           {/* PAGE TITLE */}
//           <h2 style={{ fontSize: 24, opacity: "60%", marginLeft: "5px", marginBottom: "-15px",color:"block" }}>
//             Project Details
//           </h2>

//           {/* JOB TITLE */}
//           <h1 style={{ fontSize: 36 }}>{job.title}</h1>
//           <p style={{ opacity: 0.6, fontSize: 20 }}>{job.category}</p>

//           {/* LABELS */}
//           <div style={{ display: "flex", justifyContent: "space-between", opacity: 0.6 }}>
//             <span>Budget</span>
//             <span>Timeline</span>
//             <span>Location</span>
//           </div>

//           {/* VALUES */}
//           <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600 }}>
//             <span>
//               ₹{job.budget_from} - ₹{job.budget_to}
//             </span>

//             <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
//               <MdDateRange size={18} /> {job.timeline}
//             </span>

//             <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
//               <IoLocationOutline size={18} /> Remote
//             </span>
//           </div>

//           {/* APPLICANTS */}
//           <div style={{ display: "flex", gap: 28, marginTop: 18, opacity: 0.6 }}>
//             <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
//               <FaUsers size={14} /> {job.applicants_count || 0} Applicants
//             </span>

//             <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
//               <MdAccessTime size={14} />
//               {job.created_at?.toDate
//                 ? job.created_at.toDate().toLocaleDateString()
//                 : "Recently"}
//             </span>
//           </div>

//           {/* SKILLS */}
//           <h3 style={{ marginTop: 30, fontSize: 20 }}>Skills Required</h3>

//           <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
//             {job.skills?.map((skill, i) => (
//               <span
//                 key={i}
//                 style={{
//                   background: "rgba(255, 240, 133, 0.7)",
//                   padding: "8px 14px",
//                   borderRadius: "8px",
//                   fontSize: 13,
//                 }}
//               >
//                 {skill}
//               </span>
//             ))}
//           </div>

//           {/* DESCRIPTION */}
//           <h3 style={{ marginTop: 25, fontSize: 20 }}>Project Description</h3>

//           <p style={{ lineHeight: 1.6, color: "#555", maxHeight: 250, overflowY: "auto" }}>
//             {job.description}
//           </p>

//           {/* APPLY BUTTON */}
//           <button
//             onClick={() => handleApply(job.id)}
//             disabled={isApplied}
//             style={{
//               width: "100%",
//               padding: "14px 0",
//               background: isApplied ? "#aaa" : "linear-gradient(90deg,#A155FF,#7B2BFF)",
//               borderRadius: 10,
//               color: "#fff",
//               fontWeight: 600,
//               marginTop: 20,
//             }}
//           >
//             {isApplied ? "Already Applied" : "Apply for this Project"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



// screens/JobFullDetailJobScreen.jsx
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getAuth } from "firebase/auth";
// import {
//     getFirestore,
//     doc,
//     getDoc,
//     onSnapshot,
//     updateDoc,
//     arrayUnion,
//     arrayRemove,
//     increment,
//     collection,
//     addDoc,
//     serverTimestamp,
// } from "firebase/firestore";
// import { db } from "../firbase/Firebase";
// import { useNavigate } from "react-router-dom";
// import { deleteDoc } from "firebase/firestore";


// // Optional notification service
// const NotificationService = { notifications: [] };

// // Helper: time ago
// function timeAgo(createdAt) {
//     const diff = Date.now() - createdAt.getTime();
//     const mins = Math.floor(diff / 60000);
//     if (mins < 1) return "just now";
//     if (mins < 60) return `${mins} min ago`;
//     const hours = Math.floor(mins / 60);
//     if (hours < 24) return `${hours} hr ago`;
//     const days = Math.floor(hours / 24);
//     return `${days} day${days > 1 ? "s" : ""} ago`;
// }

// export default function JobFullDetailJobScreen() {
//     const { id: jobId } = useParams();
//     const auth = getAuth();
//     const dbFirestore = getFirestore();

//     const [job, setJob] = useState(null);
//     const [isApplied, setIsApplied] = useState(false);
//     const [isFavorite, setIsFavorite] = useState(false);
//     const [jobLoading, setJobLoading] = useState(true);
//     const [jobError, setJobError] = useState(null);


//     const navigate = useNavigate();

//     const handleEditJob = () => {
//         // Navigate to your job edit page with job ID
//         navigate("/client-dashbroad2/clienteditjob", { state: { jobData: job } });
//     };

//     const handleDeleteJob = async () => {
//         const confirmDelete = window.confirm("Are you sure you want to delete this job?");
//         if (!confirmDelete) return;

//         try {
//             await deleteDoc(doc(dbFirestore, "jobs", jobId));
//             alert("Job deleted successfully!");
//             navigate(-1); // go back after deletion
//         } catch (err) {
//             console.error("Delete job error:", err);
//             alert("Failed to delete job.");
//         }
//     };


//     // Load job realtime
//     useEffect(() => {
//         if (!jobId) return;
//         const ref = doc(dbFirestore, "jobs", jobId);
//         const unsub = onSnapshot(
//             ref,
//             (snap) => {
//                 if (!snap.exists()) {
//                     setJob(null);
//                     setJobLoading(false);
//                     return;
//                 }
//                 const data = snap.data();
//                 const createdAt = data.created_at?.toDate?.() || new Date();
//                 const applicants = Array.isArray(data.applicants) ? data.applicants : [];
//                 const userId = auth.currentUser?.uid || "";
//                 setIsApplied(applicants.some((a) => a.freelancerId === userId));

//                 setJob({
//                     id: snap.id,
//                     title: data.title || "",
//                     description: data.description || "",
//                     budgetFrom: data.budget_from ?? "",
//                     budgetTo: data.budget_to ?? "",
//                     timeline: data.timeline || "",
//                     category: data.category || "",
//                     subCategory: data.sub_category || "",
//                     applicantsCount: data.applicants_count ?? 0,
//                     views: data.views ?? 0,
//                     skills: Array.isArray(data.skills) ? data.skills : [],
//                     tools: Array.isArray(data.tools) ? data.tools : [],
//                     createdAt,
//                     userId: data.userId || "",
//                 });

//                 setJobLoading(false);
//             },
//             (err) => {
//                 console.error(err);
//                 setJobError(err);
//                 setJobLoading(false);
//             }
//         );
//         return () => unsub();
//     }, [jobId, auth, dbFirestore]);

//     // Load favorite status
//     useEffect(() => {
//         const user = auth.currentUser;
//         if (!user || !jobId) return;
//         const uRef = doc(dbFirestore, "users", user.uid);
//         const unsub = onSnapshot(
//             uRef,
//             (snap) => {
//                 if (!snap.exists()) return;
//                 const favList = Array.isArray(snap.data()?.favoriteJobs) ? snap.data().favoriteJobs : [];
//                 setIsFavorite(favList.includes(jobId));
//             },
//             (err) => console.error(err)
//         );
//         return () => unsub();
//     }, [jobId, auth, dbFirestore]);

//     // Apply to job
//     async function handleApply() {
//         console.log("Apply clicked");
//         if (isApplied) return;
//         const user = auth.currentUser;
//         if (!user || !job) return alert("Please login first.");

//         try {
//             const userId = user.uid;
//             const freelancerSnap = await getDoc(doc(dbFirestore, "users", userId));
//             const freelancer = freelancerSnap.data() || {};
//             const freelancerName = `${freelancer.firstName || ""} ${freelancer.lastName || ""}`.trim();
//             const freelancerImage = freelancer.profileImage || "";

//             const jobRef = doc(dbFirestore, "jobs", jobId);
//             const jobSnap = await getDoc(jobRef);
//             const jobDoc = jobSnap.data() || {};
//             const jobTitle = jobDoc.title || "";
//             const clientUid = jobDoc.userId || "";

//             const applicants = Array.isArray(jobDoc.applicants) ? jobDoc.applicants : [];
//             if (applicants.some((a) => a.freelancerId === userId)) {
//                 setIsApplied(true);
//                 return alert("You have already applied!");
//             }

//             await updateDoc(jobRef, {
//                 applicants: arrayUnion({ freelancerId: userId, name: freelancerName, profileImage: freelancerImage, appliedAt: new Date() }),
//                 applicants_count: increment(1),
//             });

//             await addDoc(collection(dbFirestore, "notifications"), {
//                 title: jobTitle,
//                 body: `${freelancerName} applied for ${jobTitle}`,
//                 type: "application",
//                 freelancerName,
//                 freelancerImage,
//                 freelancerId: userId,
//                 jobTitle,
//                 jobId,
//                 clientUid,
//                 timestamp: serverTimestamp(),
//                 read: false,
//             });

//             setIsApplied(true);
//             alert("Applied successfully!");
//         } catch (e) {
//             console.error(e);
//             alert("Something went wrong!");
//         }
//     }

//     // Toggle favorite
//     async function toggleBookmark() {
//         const user = auth.currentUser;
//         if (!user) return alert("Please login to save jobs.");
//         const userRef = doc(dbFirestore, "users", user.uid);
//         try {
//             if (isFavorite) await updateDoc(userRef, { favoriteJobs: arrayRemove(jobId) });
//             else await updateDoc(userRef, { favoriteJobs: arrayUnion(jobId) });
//             setIsFavorite(!isFavorite);
//         } catch (e) {
//             console.error(e);
//         }
//     }

//     if (jobLoading) return <div style={{ padding: 40 }}>Loading...</div>;
//     if (jobError) return <div style={{ padding: 40 }}>Error: {jobError.message}</div>;
//     if (!job) return <div style={{ padding: 40 }}>Job not found ❌</div>;

//     const { title, description, budgetFrom, budgetTo, timeline, skills, tools, views, createdAt } = job;

//     return (
//         <div style={{ padding: 20, maxWidth: 900, margin: "0 auto", background: "#fff", borderRadius: 12, fontFamily: "Arial, sans-serif" }}>
//             <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 10 }}>{title}</h1>
//             <p style={{ color: "#777", marginBottom: 8 }}><strong>Category:</strong> {job.category || "Not specified"}</p>
//             <div style={{ marginBottom: 20, background: "#f7f7f7", padding: 12, borderRadius: 8 }}>
//                 💰 <strong>Budget:</strong> ₹{budgetFrom} - ₹{budgetTo}
//             </div>
//             <p style={{ color: "#777", marginBottom: 20 }}>⏱ Posted: {createdAt?.toLocaleDateString()}</p>

//             <h3>Description</h3>
//             <p style={{ lineHeight: 1.6, color: "#555", whiteSpace: "pre-line" }}>{description}</p>

//             {skills?.length > 0 && (
//                 <div style={{ margin: "20px 0" }}>
//                     <h3>Skills</h3>
//                     <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//                         {skills.map((s, i) => <div key={i} style={{ background: "#e8f0ff", padding: "6px 12px", borderRadius: 8 }}>{s}</div>)}
//                     </div>
//                 </div>
//             )}

//             <div style={{ display: "flex", gap: 12 }}>
//                 {/* <button
//                     onClick={isApplied ? undefined : handleApply}
//                     disabled={isApplied}
//                 >
//                     {isApplied ? "Applied" : "Apply"}
//                 </button>
//                 <button onClick={toggleBookmark} style={{ padding: "10px 18px", borderRadius: 8, border: "none", background: isFavorite ? "#ff4747" : "#ff9800", color: "#fff" }}>
//                     {isFavorite ? "Favorited" : "Save Job"}
//                 </button> */}

//                 <div style={{ display: "flex", gap: 12 }}>
//                     <button
//                         onClick={handleEditJob}
//                         style={{
//                             padding: "10px 18px",
//                             borderRadius: 8,
//                             border: "none",
//                             background: "#4caf50",
//                             color: "#fff",
//                             cursor: "pointer"
//                         }}
//                     >
//                         Edit Job
//                     </button>

//                     <button
//                         onClick={handleDeleteJob}
//                         style={{
//                             padding: "10px 18px",
//                             borderRadius: 8,
//                             border: "none",
//                             background: "#f44336",
//                             color: "#fff",
//                             cursor: "pointer"
//                         }}
//                     >
//                         Delete Job
//                     </button>
//                 </div>

//             </div>
//         </div>
//     );
// }














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
            <button
              onClick={() =>
                navigate(
                  `/freelance-dashboard/view-profile/${job.userId}/job/${job.id}`
                )
              }
              style={{
                cursor: "pointer",
                background: "transparent",
                border: "none",
                color: "#7B2BFF",
                fontWeight: 600,
              }}
            >
              View Profile
            </button>



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

