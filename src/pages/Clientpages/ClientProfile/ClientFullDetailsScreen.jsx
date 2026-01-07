
// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// // ===== Firebase (assume initialized) =====
// import { getAuth } from "firebase/auth";
// import {
//   getFirestore,
//   doc,
//   onSnapshot,
//   collection,
//   query,
//   where,
//   getDocs,
//   addDoc,
//   serverTimestamp,
// } from "firebase/firestore";

// // ===== Icons =====
// import { FiArrowLeft, FiShare2, FiMoreHorizontal } from "react-icons/fi";

// /* ======================================================
//    REPORT CONSTANTS (FROM ReportBlockPopup.jsx)
// ====================================================== */
// const REPORT_REASONS = [
//   "Fraud or scam",
//   "Misinformation",
//   "Harassment",
//   "Threats or violence",
//   "Hateful speech",
//   "Illegal goods and service",
// ];

// function reasonDescription(reason) {
//   switch (reason) {
//     case "Fraud or scam":
//       return "Illegal activities or scams";
//     case "Misinformation":
//       return "False or misleading information";
//     case "Harassment":
//       return "Abusive behavior";
//     case "Threats or violence":
//       return "Threats or harm";
//     case "Hateful speech":
//       return "Attacking based on identity";
//     default:
//       return "Violation of community guidelines";
//   }
// }

// /* ======================================================
//    MAIN COMPONENT
// ====================================================== */
// export default function ClientFullDetailScreen() {
//   const { userId, jobId } = useParams();
//   const navigate = useNavigate();

//   const auth = getAuth();
//   const db = getFirestore();
//   const currentUid = auth.currentUser?.uid;

//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isRequested, setIsRequested] = useState(false);
//   const [isAccepted, setIsAccepted] = useState(false);
//   const [activeTab, setActiveTab] = useState("work");

//   // 🔥 Report / Block popup states
//   const [showMain, setShowMain] = useState(false);
//   const [showReasons, setShowReasons] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [selectedReason, setSelectedReason] = useState(null);

//   /* ================= FETCH PROFILE ================= */
//   useEffect(() => {
//     if (!userId) return;

//     const unsub = onSnapshot(doc(db, "users", userId), snap => {
//       if (snap.exists()) setProfile(snap.data());
//       setLoading(false);
//     });

//     return () => unsub();
//   }, [db, userId]);

//   /* ================= CHECK REQUEST ================= */
//   useEffect(() => {
//     if (!currentUid || !userId) return;

//     async function checkRequest() {
//       const q = query(
//         collection(db, "collaboration_requests"),
//         where("clientId", "==", currentUid),
//         where("freelancerId", "==", userId),
//         where("status", "==", "sent"),
//         ...(jobId ? [where("jobId", "==", jobId)] : [])
//       );

//       const snap = await getDocs(q);
//       setIsRequested(!snap.empty);
//     }

//     checkRequest();
//   }, [db, currentUid, userId, jobId]);

//   /* ================= CHECK ACCEPTED ================= */
//   useEffect(() => {
//     if (!currentUid || !userId || !jobId) return;

//     async function checkAccepted() {
//       const q = query(
//         collection(db, "accepted_jobs"),
//         where("clientId", "==", currentUid),
//         where("freelancerId", "==", userId),
//         where("jobId", "==", jobId)
//       );

//       const snap = await getDocs(q);
//       setIsAccepted(!snap.empty);
//     }

//     checkAccepted();
//   }, [db, currentUid, userId, jobId]);

//   /* ================= ACTIONS ================= */
//   const shareProfile = async () => {
//     const name = `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`;
//     const link = profile?.linkedin || window.location.href;

//     if (navigator.share) {
//       await navigator.share({
//         title: name,
//         text: `Check out ${name}'s profile`,
//         url: link,
//       });
//     } else {
//       alert("Sharing not supported");
//     }
//   };

//   const sendRequest = async () => {
//     if (!currentUid) return alert("Login required");

//     await addDoc(collection(db, "collaboration_requests"), {
//       clientId: currentUid,
//       freelancerId: userId,
//       jobId: jobId || null,
//       status: "sent",
//       timestamp: serverTimestamp(),
//     });

//     setIsRequested(true);
//     alert("Request sent");
//   };

//   const blockUser = async () => {
//     if (!currentUid) return;

//     await addDoc(collection(db, "blocked_users"), {
//       blockedBy: currentUid,
//       blockedUserId: userId,
//       blockedAt: serverTimestamp(),
//     });

//     alert("User blocked");
//     closeAll();
//     navigate("/freelance-dashboard");
//   };

//   const submitReport = async () => {
//     if (!currentUid || !selectedReason) return;

//     await addDoc(collection(db, "reports"), {
//       reportedBy: currentUid,
//       reportedUserId: userId,
//       reason: selectedReason,
//       createdAt: serverTimestamp(),
//     });

//     alert("Report submitted");
//     closeAll();
//   };

//   const closeAll = () => {
//     setShowMain(false);
//     setShowReasons(false);
//     setShowConfirm(false);
//     setSelectedReason(null);
//   };

//   /* ================= STATES ================= */
//   if (loading) return <div style={styles.center}>Loading…</div>;
//   if (!profile) return <div style={styles.center}>Profile not found</div>;

//   const fullName =
//     `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "User";

//   /* ================= UI ================= */
//   return (
//     <div style={styles.page}>
//       {/* HEADER */}
//       <div style={styles.header}>
//         <button onClick={() => navigate(-1)} style={styles.iconBtn}>
//           <FiArrowLeft />
//         </button>

//         <div>
//           {/* 🔥 UPDATED: Report / Block opens popup */}
//           <button onClick={() => setShowMain(true)} style={styles.iconBtn}>
//             Report / Block
//           </button>

//           <button onClick={shareProfile} style={styles.iconBtn}>
//             <FiShare2 />
//           </button>
//         </div>
//       </div>

//       {/* PROFILE CARD */}
//       <div style={styles.card}>
//         <img
//           src={profile.profileImage || "/assets/profile.png"}
//           alt="profile"
//           style={styles.avatar}
//         />

//         <h3>{fullName}</h3>
//         <p style={styles.subtitle}>
//           {profile.sector || "No Title"} · {profile.location || "India"}
//         </p>


//       </div>

//       {/* ================= REPORT / BLOCK POPUPS ================= */}

//       {showMain && (
//         <Popup>
//           <h3>Report or block</h3>
//           <p style={styles.sub}>Select an action</p>

//           <PopupItem text={`Block ${fullName}`} onClick={blockUser} />
//           <PopupItem
//             text={`Report ${fullName}`}
//             onClick={() => {
//               setShowMain(false);
//               setShowReasons(true);
//             }}
//           />

//           <button style={styles.cancelBtn} onClick={closeAll}>
//             Cancel
//           </button>
//         </Popup>
//       )}

//       {showReasons && (
//         <Popup big>
//           <h3>Report this profile</h3>
//           <p style={styles.sub}>Select a reason</p>

//           <div style={styles.reasonWrap}>
//             {REPORT_REASONS.map(r => (
//               <div
//                 key={r}
//                 style={{
//                   ...styles.reasonChip,
//                   background:
//                     selectedReason === r ? "#7C3CFF" : "#E6DCFF",
//                   color: selectedReason === r ? "#fff" : "#000",
//                 }}
//                 onClick={() => setSelectedReason(r)}
//               >
//                 {r}
//               </div>
//             ))}
//           </div>

//           <div style={styles.row}>
//             <button
//               style={styles.backBtn}
//               onClick={() => {
//                 setShowReasons(false);
//                 setShowMain(true);
//               }}
//             >
//               Back
//             </button>

//             <button
//               style={styles.nextBtn}
//               disabled={!selectedReason}
//               onClick={() => {
//                 setShowReasons(false);
//                 setShowConfirm(true);
//               }}
//             >
//               Next
//             </button>
//           </div>
//         </Popup>
//       )}

//       {showConfirm && (
//         <Popup>
//           <h3>Confirm report</h3>

//           <div style={styles.confirmBox}>
//             <strong>{selectedReason}</strong>
//             <p>{reasonDescription(selectedReason)}</p>
//           </div>

//           <div style={styles.row}>
//             <button
//               style={styles.backBtn}
//               onClick={() => {
//                 setShowConfirm(false);
//                 setShowReasons(true);
//               }}
//             >
//               Back
//             </button>

//             <button style={styles.submitBtn} onClick={submitReport}>
//               Submit Report
//             </button>
//           </div>
//         </Popup>
//       )}

//       {/* ABOUT */}
//       <Section title="About">
//         <p>{profile.description || "No description available"}</p>
//       </Section>

//       <Section title="Industry">{profile.sector}</Section>
//       <Section title="Category">{profile.category}</Section>
//       <Section title="Company Size">{profile.team_size}</Section>
//       <Section title="Email">{profile.email}</Section>

//       {/* SERVICES */}
//       <div style={styles.tabs}>
//         <button
//           onClick={() => setActiveTab("work")}
//           style={activeTab === "work" ? styles.tabActive : styles.tab}
//         >
//           Work
//         </button>
//         <button
//           onClick={() => setActiveTab("24h")}
//           style={activeTab === "24h" ? styles.tabActive : styles.tab}
//         >
//           24 Hour
//         </button>
//       </div>

//       {activeTab === "work" ? (
//         <ServicesList uid={userId} collectionName="jobs" />
//       ) : (
//         <ServicesList uid={userId} collectionName="jobs_24h" />
//       )}
//     </div>
//   );
// }

// /* ======================================================
//    POPUP HELPERS
// ====================================================== */
// function Popup({ children, big }) {
//   return (
//     <div style={styles.overlay}>
//       <div
//         style={{
//           ...styles.popup,
//           height: big ? "70vh" : "auto",
//         }}
//       >
//         {children}
//       </div>
//     </div>
//   );
// }

// function PopupItem({ text, onClick }) {
//   return (
//     <div style={styles.popupItem} onClick={onClick}>
//       {text}
//       <FiMoreHorizontal />
//     </div>
//   );
// }

// /* ======================================================
//    SERVICES LIST
// ====================================================== */
// function ServicesList({ uid, collectionName }) {
//   const db = getFirestore();
//   const [items, setItems] = useState([]);

//   useEffect(() => {
//     const q = query(collection(db, collectionName), where("userId", "==", uid));
//     const unsub = onSnapshot(q, snap => {
//       setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
//     });
//     return () => unsub();
//   }, [db, uid, collectionName]);

//   if (!items.length) {
//     return <div style={styles.center}>No services available</div>;
//   }

//   return (
//     <div>
//       {items.map(job => (
//         <div key={job.id} style={styles.jobCard}>
//           <div style={styles.jobHeader}>
//             <h4>{job.title}</h4>
//             <FiMoreHorizontal />
//           </div>

//           <p style={styles.price}>
//             ₹ {job.budget_from || job.budget || 0}
//           </p>

//           <p style={styles.desc}>{job.description}</p>

//           <div style={styles.chips}>
//             {[...(job.skills || []), ...(job.tools || [])]
//               .slice(0, 3)
//               .map((s, i) => (
//                 <span key={i} style={styles.chip}>
//                   {s}
//                 </span>
//               ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// /* ======================================================
//    HELPERS
// ====================================================== */
// function Section({ title, children }) {
//   return (
//     <div style={styles.section}>
//       <h4>{title}</h4>
//       {children}
//     </div>
//   );
// }

// /* ======================================================
//    STYLES
// ====================================================== */
// const styles = {
//   page: {
//     maxWidth: 420,
//     margin: "0 auto",
//     background: "#f6f6f6",
//     minHeight: "100vh",
//   },
//   center: { padding: 40, textAlign: "center" },
//   header: { display: "flex", justifyContent: "space-between", padding: 16 },
//   iconBtn: {
//     background: "rgba(0,0,0,0.3)",
//     border: "none",
//     borderRadius: 20,
//     padding: "6px 10px",
//     color: "#fff",
//     marginLeft: 6,
//     cursor: "pointer",
//   },
//   card: {
//     background: "#fff",
//     margin: 16,
//     padding: 16,
//     borderRadius: 16,
//     textAlign: "center",
//   },
//   avatar: { width: 80, height: 80, borderRadius: 12, objectFit: "cover" },
//   subtitle: { fontSize: 13, color: "#666" },
//   primary: {
//     background: "#FDFD96",
//     border: "none",
//     padding: "10px 24px",
//     borderRadius: 24,
//     fontWeight: 600,
//   },
//   disabled: {
//     background: "#ddd",
//     border: "none",
//     padding: "10px 24px",
//     borderRadius: 24,
//   },
//   section: {
//     background: "#fff",
//     margin: "12px 16px",
//     padding: 16,
//     borderRadius: 16,
//   },
//   tabs: { display: "flex", justifyContent: "center", marginTop: 16 },
//   tab: { padding: "10px 20px", background: "transparent", border: "none" },
//   tabActive: {
//     padding: "10px 20px",
//     borderBottom: "3px solid black",
//     fontWeight: 600,
//   },
//   jobCard: {
//     background: "#fff",
//     margin: "12px 16px",
//     padding: 16,
//     borderRadius: 16,
//   },
//   jobHeader: { display: "flex", justifyContent: "space-between" },
//   price: { fontWeight: 600, marginTop: 6 },
//   desc: { fontSize: 13, marginTop: 6 },
//   chips: { display: "flex", gap: 6, marginTop: 10 },
//   chip: {
//     background: "#FFF7C2",
//     padding: "4px 10px",
//     borderRadius: 14,
//     fontSize: 12,
//   },

//   /* popup */
//   overlay: {
//     position: "fixed",
//     inset: 0,
//     background: "rgba(0,0,0,0.4)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "flex-end",
//     zIndex: 999,
//   },
//   popup: {
//     background: "#FFFDE7",
//     width: "100%",
//     maxWidth: 420,
//     padding: 20,
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//   },
//   popupItem: {
//     padding: "14px 0",
//     borderBottom: "1px solid #ddd",
//     display: "flex",
//     justifyContent: "space-between",
//     cursor: "pointer",
//   },
//   cancelBtn: {
//     width: "100%",
//     padding: 12,
//     borderRadius: 24,
//     border: "1px solid #000",
//     background: "transparent",
//     marginTop: 16,
//   },
//   sub: { fontSize: 14, color: "#666", marginBottom: 12 },
//   reasonWrap: { display: "flex", flexWrap: "wrap", gap: 10 },
//   reasonChip: { padding: "10px 14px", borderRadius: 20, cursor: "pointer" },
//   row: { display: "flex", gap: 12, marginTop: 20 },
//   backBtn: {
//     flex: 1,
//     padding: 12,
//     borderRadius: 24,
//     border: "1px solid #000",
//     background: "transparent",
//   },
//   nextBtn: {
//     flex: 1,
//     padding: 12,
//     borderRadius: 24,
//     background: "#7C3CFF",
//     color: "#fff",
//     border: "none",
//   },
//   confirmBox: {
//     background: "#E6DCFF",
//     padding: 14,
//     borderRadius: 16,
//     marginTop: 16,
//   },
//   submitBtn: {
//     flex: 1,
//     padding: 12,
//     borderRadius: 24,
//     background: "#7C3CFF",
//     color: "#fff",
//     border: "none",
//   },
// };










// import React, { useState, useEffect, useMemo } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   collection,
//   doc,
//   onSnapshot,
//   query,
//   where,
//   addDoc,
//   serverTimestamp,
// } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';
// import { db } from '../../../firbase/Firebase';
// import {
//   Share2,
//   ArrowLeft,
//   Flag,
//   ChevronRight,
//   X,
//   AlertCircle,
//   CheckCircle,
//   Linkedin,
//   Globe
// } from 'lucide-react';

// /* ======================================================
//    CLIENT FULL DETAIL SCREEN - COMPLETE REACT VERSION
// ====================================================== */

// export default function ClientFullDetailScreen() {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const auth = getAuth();

//   const [currentUser, setCurrentUser] = useState(auth.currentUser);
//   const [profile, setProfile] = useState(null);
//   const [loadingProfile, setLoadingProfile] = useState(true);

//   const [jobs, setJobs] = useState([]);
//   const [jobs24h, setJobs24h] = useState([]);
//   const [loadingJobs, setLoadingJobs] = useState(true);

//   const [isAccepted, setIsAccepted] = useState(false);
//   const [isRequested, setIsRequested] = useState(false);

//   const [activeTab, setActiveTab] = useState('work');
//   const [showReportModal, setShowReportModal] = useState(false);
//   const [showBlockDialog, setShowBlockDialog] = useState(false);
//   const [showReportReasons, setShowReportReasons] = useState(false);
//   const [showReportProfile, setShowReportProfile] = useState(false);
//   const [showReportConfirm, setShowReportConfirm] = useState(false);
//   const [selectedReasons, setSelectedReasons] = useState(new Set());
//   const [selectedProfileReason, setSelectedProfileReason] = useState(null);
//   const [confirmReason, setConfirmReason] = useState('');

//   /* ================= FETCH PROFILE ================= */
//   useEffect(() => {
//     if (!userId) return;

//     const unsub = onSnapshot(doc(db, 'users', userId), (snap) => {
//       setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null);
//       setLoadingProfile(false);
//     });

//     return () => unsub();
//   }, [userId]);

//   /* ================= FETCH JOBS ================= */
//   useEffect(() => {
//     if (!userId) return;

//     const q1 = query(
//       collection(db, 'jobs'),
//       where('userId', '==', userId)
//     );

//     const q2 = query(
//       collection(db, 'jobs_24h'),
//       where('userId', '==', userId)
//     );

//     const u1 = onSnapshot(q1, (snap) => {
//       setJobs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
//       setLoadingJobs(false);
//     });

//     const u2 = onSnapshot(q2, (snap) => {
//       setJobs24h(snap.docs.map(d => ({ id: d.id, ...d.data() })));
//       setLoadingJobs(false);
//     });

//     return () => {
//       u1();
//       u2();
//     };
//   }, [userId]);

//   /* ================= BLOCK USER ================= */
//   const handleBlock = async () => {
//     if (!currentUser || !userId) return;

//     try {
//       await addDoc(collection(db, 'blocked_users'), {
//         blockedBy: currentUser.uid,
//         blockedUserId: userId,
//         blockedUserName: `${profile?.first_name} ${profile?.last_name}`,
//         blockedAt: serverTimestamp(),
//       });

//       showToast('User blocked successfully', 'success');
//       setShowBlockDialog(false);

//       setTimeout(() => {
//         navigate(-1);
//       }, 1000);
//     } catch (error) {
//       console.error('Error blocking user:', error);
//       showToast('Failed to block user', 'error');
//     }
//   };

//   /* ================= REPORT USER ================= */
//   const handleReportSubmit = async (reason) => {
//     if (!currentUser || !userId) return;

//     try {
//       await addDoc(collection(db, 'reports'), {
//         reportedUserId: userId,
//         reportedUserName: `${profile?.first_name} ${profile?.last_name}`,
//         reportedBy: currentUser.uid,
//         reason,
//         status: 'pending',
//         createdAt: serverTimestamp(),
//       });

//       showToast('Report submitted successfully', 'success');
//       setShowReportProfile(false);
//       setShowReportReasons(false);
//       setShowReportConfirm(false);
//     } catch (error) {
//       console.error('Error submitting report:', error);
//       showToast('Failed to submit report', 'error');
//     }
//   };

//   /* ================= SHARE PROFILE ================= */
//   const handleShare = () => {
//     const shareText = `Check out ${profile?.first_name} ${profile?.last_name}'s professional profile`;
//     const shareUrl = profile?.linkedin || window.location.href;

//     if (navigator.share) {
//       navigator.share({
//         title: 'Professional Profile',
//         text: shareText,
//         url: shareUrl,
//       });
//     } else {
//       navigator.clipboard.writeText(shareUrl);
//       showToast('Link copied to clipboard!', 'success');
//     }
//   };

//   /* ================= OPEN LINK ================= */
//   const openLink = (url) => {
//     if (!url) return;
//     const fixedUrl = url.startsWith('http') ? url : `https://${url}`;
//     window.open(fixedUrl, '_blank');
//   };

//   /* ================= TOAST NOTIFICATION ================= */
//   const showToast = (message, type = 'info') => {
//     const toast = document.createElement('div');
//     const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-gray-800';
//     toast.className = `fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in`;
//     toast.textContent = message;
//     document.body.appendChild(toast);
//     setTimeout(() => toast.remove(), 3000);
//   };

//   /* ================= REASON DESCRIPTIONS ================= */
//   const getReasonDescription = (reason) => {
//     const descriptions = {
//       'Fraud or scam': 'Illegal activities, malware, or promotion of illegal products or services',
//       'Misinformation': 'False or misleading information presented as fact',
//       'Harassment': 'Abusive or harmful behavior toward individuals or groups',
//       'Threats or violence': 'Threats or promotion of physical harm',
//       'Hateful speech': 'Content that attacks or demeans based on identity',
//     };
//     return descriptions[reason] || 'This content violates our community guidelines';
//   };

//   /* ================= LOADING STATE ================= */
//   if (loadingProfile) {
//     return (
//       <div style={styles.loadingContainer}>
//         <div style={styles.spinner}></div>
//         <p style={styles.loadingText}>Loading profile...</p>
//       </div>
//     );
//   }

//   if (!profile) {
//     return (
//       <div style={styles.errorContainer}>
//         <AlertCircle size={64} color="#9ca3af" />
//         <p style={styles.errorText}>User profile not found</p>
//         <button onClick={() => navigate(-1)} style={styles.retryBtn}>
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User';
//   const displayedJobs = activeTab === 'work' ? jobs : jobs24h;

//   /* ================= RENDER ================= */
//   return (
//     <div style={styles.container}>
//       {/* HEADER */}
//       {/* CLIENT PROFILE HEADER */}
//       <div
//         style={{
//           background: "#fbfbd7",
//           padding: "24px 28px 36px",
//           borderBottomLeftRadius: 18,
//           borderBottomRightRadius: 18,
//           position: "relative",
//         }}
//       >
//         {/* TOP BAR */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 12,
//             marginBottom: 28,
//           }}
//         >
//           <button
//             onClick={() => navigate(-1)}
//             style={{
//               width: 36,
//               height: 36,
//               borderRadius: 12,
//               border: "none",
//               background: "#fff",
//               boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               cursor: "pointer",
//             }}
//           >
//             <ArrowLeft size={18} />
//           </button>

//           <h2 style={{ margin: 0, fontWeight: 600 }}>Client Profile</h2>

//           <div style={{ marginLeft: "auto" }}>
//             <button
//               onClick={() => setShowReportModal(true)}
//               style={{
//                 border: "none",
//                 background: "transparent",
//                 fontSize: 22,
//                 cursor: "pointer",
//               }}
//             >
//               ⋮
//             </button>
//           </div>
//         </div>

//         {/* PROFILE ROW */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 20,
//           }}
//         >
//           {/* AVATAR */}
//           <div
//             style={{
//               width: 86,
//               height: 86,
//               borderRadius: "50%",
//               background: "#d8c7ff",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
//               overflow: "hidden",
//             }}
//           >
//             <img
//               src={profile.profileImage || "/assets/profile.png"}
//               alt={fullName}
//               style={{
//                 width: "100%",
//                 height: "100%",
//                 objectFit: "cover",
//               }}
//             />
//           </div>

//           {/* INFO */}
//           <div style={{ flex: 1 }}>
//             <h1
//               style={{
//                 margin: 0,
//                 fontSize: 26,
//                 fontWeight: 600,
//               }}
//             >
//               {profile.company_name || "Pixel studios Pvt Ltd"}
//             </h1>

//             <p
//               style={{
//                 margin: "6px 0",
//                 color: "#555",
//               }}
//             >
//               {profile.email || "pixelstudios@example.com"}
//             </p>

//             <p style={{ margin: "6px 0" }}>
//               <span
//                 style={{
//                   color: "#8b5cf6",
//                   fontWeight: 600,
//                 }}
//               >
//                 {profile.sector || "Video and audio"}
//               </span>
//               <span style={{ color: "#777" }}>
//                 {" "}
//                 · {profile.location || "Chennai, Tamil Nadu"}
//               </span>
//             </p>

//             {/* LINKS */}
//             <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
//               {profile.linkedin && (
//                 <span
//                   onClick={() => openLink(profile.linkedin)}
//                   style={{
//                     color: "#2563eb",
//                     cursor: "pointer",
//                     fontSize: 14,
//                   }}
//                 >
//                   Linkedin
//                 </span>
//               )}

//               {profile.website && (
//                 <span
//                   onClick={() => openLink(profile.website)}
//                   style={{
//                     color: "#2563eb",
//                     cursor: "pointer",
//                     fontSize: 14,
//                   }}
//                 >
//                   Website
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* ACTION CARD */}
//           <div
//             style={{
//               background: "#fff",
//               borderRadius: 14,
//               padding: "14px 16px",
//               boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
//               display: "flex",
//               flexDirection: "column",
//               gap: 12,
//             }}
//           >
//             <div
//               onClick={handleShare}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 10,
//                 cursor: "pointer",
//               }}
//             >
//               <Share2 size={16} />
//               <span>Share this profile</span>
//             </div>

//             <div
//               onClick={() => setShowReportModal(true)}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 10,
//                 cursor: "pointer",
//               }}
//             >
//               <Flag size={16} />
//               <span>Report / Block</span>
//             </div>
//           </div>
//         </div>
//       </div>


//       {/* ABOUT + DETAILS SECTION */}
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           gap: 24,
//           maxWidth: 520,
//         }}
//       >
//         {/* ABOUT CARD */}
//         <div
//           style={{
//             background: "#fffef3",
//             borderRadius: 22,
//             padding: "22px 26px",
//             boxShadow: "0 14px 30px rgba(0,0,0,0.12)",
//           }}
//         >
//           <h3
//             style={{
//               margin: "0 0 10px",
//               fontSize: 18,
//               fontWeight: 600,
//             }}
//           >
//             About
//           </h3>

//           <p
//             style={{
//               margin: 0,
//               fontSize: 14.5,
//               lineHeight: 1.7,
//               color: "#444",
//             }}
//           >
//             {profile.about || "No description available."}
//           </p>
//         </div>

//         {/* DETAILS CARD */}
//         <div
//           style={{
//             background: "#fffef3",
//             borderRadius: 22,
//             padding: "22px 26px",
//             boxShadow: "0 14px 30px rgba(0,0,0,0.12)",
//           }}
//         >
//           {/* Industry */}
//           <div style={{ marginBottom: 18 }}>
//             <h4
//               style={{
//                 margin: 0,
//                 fontSize: 14,
//                 fontWeight: 600,
//               }}
//             >
//               Industry
//             </h4>
//             <p
//               style={{
//                 marginTop: 6,
//                 fontSize: 14,
//                 color: "#555",
//               }}
//             >
//               {profile.sector || "N/A"}
//             </p>
//           </div>

//           {/* Company Size */}
//           <div style={{ marginBottom: 18 }}>
//             <h4
//               style={{
//                 margin: 0,
//                 fontSize: 14,
//                 fontWeight: 600,
//               }}
//             >
//               Company size
//             </h4>
//             <p
//               style={{
//                 marginTop: 6,
//                 fontSize: 14,
//                 color: "#555",
//               }}
//             >
//               {profile.team_size || "N/A"}
//             </p>
//           </div>

//           {/* Account Handler */}
//           <div style={{ marginBottom: 18 }}>
//             <h4
//               style={{
//                 margin: 0,
//                 fontSize: 14,
//                 fontWeight: 600,
//               }}
//             >
//               Account Handler
//             </h4>
//             <p
//               style={{
//                 marginTop: 6,
//                 fontSize: 14,
//                 color: "#555",
//               }}
//             >
//               {profile.team_size || "N/A"}
//             </p>
//           </div>

//           {/* Email */}
//           <div>
//             <h4
//               style={{
//                 margin: 0,
//                 fontSize: 14,
//                 fontWeight: 600,
//               }}
//             >
//               Email Address
//             </h4>
//             <p
//               style={{
//                 marginTop: 6,
//                 fontSize: 14,
//                 color: "#555",
//               }}
//             >
//               {profile.email || "N/A"}
//             </p>
//           </div>
//         </div>
//       </div>


//       {/* JOBS SECTION */}
//       <div style={styles.jobsSection}>
//         <div style={styles.tabContainer}>
//           <button
//             onClick={() => setActiveTab("work")}
//             style={activeTab === "work" ? styles.tabActive : styles.tab}
//           >
//             Work
//           </button>
//           <button
//             onClick={() => setActiveTab("24h")}
//             style={activeTab === "24h" ? styles.tabActive : styles.tab}
//           >
//             24 Hours
//           </button>
//         </div>

//         <div style={styles.jobsList}>
//           {loadingJobs ? (
//             <p style={styles.emptyText}>Loading jobs...</p>
//           ) : displayedJobs.length === 0 ? (
//             <p style={styles.emptyText}>No jobs posted yet</p>
//           ) : (
//             displayedJobs.map((job) => (
//               <div key={job.id} style={styles.card}>
//                 {/* TOP */}
//                 <div style={styles.topRow}>
//                   <div style={styles.avatar}>JA</div>

//                   <div style={{ flex: 1 }}>
//                     <div style={styles.titleRow}>
//                       <h3 style={styles.title}>{job.title || "UIUX Designer"}</h3>
//                       <span style={styles.arrow}>›</span>
//                     </div>

//                     <div style={styles.skillRow}>
//                       {(job.skills || ["UI Design", "Web Design", "UX"])
//                         .slice(0, 3)
//                         .map((s, i) => (
//                           <span key={i} style={styles.skill}>
//                             {s}
//                           </span>
//                         ))}
//                       {(job.skills || []).length > 3 && (
//                         <span style={styles.skill}>4+</span>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* DETAILS */}
//                 <div style={styles.detailsRow}>
//                   <div>
//                     <p style={styles.label}>Budget</p>
//                     <p style={styles.valuePurple}>
//                       ₹{job.budget_from || 1000} – ₹{job.budget_to || 8000}
//                     </p>
//                   </div>

//                   <div>
//                     <p style={styles.label}>Timeline</p>
//                     <p style={styles.value}>2 – 3 weeks</p>
//                   </div>

//                   <div>
//                     <p style={styles.label}>Location</p>
//                     <p style={styles.value}>Remote</p>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>


//       {/* REPORT MODAL */}
//       {showReportModal && (
//         <div
//           onClick={() => setShowReportModal(false)}
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,0.45)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 1000,
//           }}
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             style={{
//               width: 520,
//               background: "#fff",
//               borderRadius: 12,
//               padding: 20,
//             }}
//           >
//             <div style={{ display: "flex", justifyContent: "space-between" }}>
//               <h3 style={{ margin: 0 }}>Report or block</h3>
//               <button
//                 onClick={() => setShowReportModal(false)}
//                 style={{ border: "none", background: "none", fontSize: 20 }}
//               >
//                 ✕
//               </button>
//             </div>

//             <p style={{ color: "#666", marginTop: 6 }}>Select an action</p>

//             {[
//               {
//                 label: `Block ${fullName}`,
//                 action: () => {
//                   setShowReportModal(false);
//                   setShowBlockDialog(true);
//                 },
//               },
//               {
//                 label: `Report ${fullName}`,
//                 action: () => {
//                   setShowReportModal(false);
//                   setShowReportProfile(true);
//                 },
//               },
//               {
//                 label: "Report profile element",
//                 action: () => {
//                   setShowReportModal(false);
//                   setShowReportReasons(true);
//                 },
//               },
//             ].map((item) => (
//               <div
//                 key={item.label}
//                 onClick={item.action}
//                 style={{
//                   padding: "14px 0",
//                   display: "flex",
//                   justifyContent: "space-between",
//                   cursor: "pointer",
//                   borderBottom: "1px solid #eee",
//                 }}
//               >
//                 <span>{item.label}</span>
//                 <span>›</span>
//               </div>
//             ))}

//             <div
//               style={{
//                 background: "#fffde7",
//                 padding: 14,
//                 borderRadius: 8,
//                 marginTop: 16,
//                 fontSize: 13,
//                 color: "#555",
//               }}
//             >
//               To report posts, comments, or messages, select the overflow menu next
//               to that content and select Report.
//             </div>
//           </div>
//         </div>
//       )}


//       {/* BLOCK DIALOG */}
//       {showBlockDialog && (
//         <div
//           onClick={() => setShowBlockDialog(false)}
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,0.45)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 1000,
//           }}
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             style={{
//               width: 520,
//               background: "#fff",
//               borderRadius: 8,
//               boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
//             }}
//           >
//             {/* HEADER */}
//             <div
//               style={{
//                 padding: "16px 20px",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 borderBottom: "1px solid #e5e5e5",
//               }}
//             >
//               <h3 style={{ margin: 0, fontWeight: 600 }}>Block</h3>
//               <button
//                 onClick={() => setShowBlockDialog(false)}
//                 style={{
//                   border: "none",
//                   background: "transparent",
//                   fontSize: 18,
//                   cursor: "pointer",
//                 }}
//               >
//                 ✕
//               </button>
//             </div>

//             {/* CONTENT */}
//             <div style={{ padding: "20px" }}>
//               <p
//                 style={{
//                   margin: 0,
//                   fontSize: 15,
//                   lineHeight: 1.6,
//                   color: "#111",
//                 }}
//               >
//                 You're about to block {fullName}. You'll no longer be connected,
//                 and will lose any endorsements or recommendations from this person.
//               </p>
//             </div>

//             {/* ACTIONS */}
//             <div
//               style={{
//                 padding: "14px 20px",
//                 display: "flex",
//                 justifyContent: "flex-end",
//                 gap: 12,
//                 borderTop: "1px solid #e5e5e5",
//               }}
//             >
//               <button
//                 onClick={() => setShowBlockDialog(false)}
//                 style={{
//                   padding: "8px 18px",
//                   borderRadius: 8,
//                   border: "1px solid #cfcfcf",
//                   background: "#fff",
//                   cursor: "pointer",
//                 }}
//               >
//                 Back
//               </button>

//               <button
//                 onClick={handleBlock}
//                 style={{
//                   padding: "8px 22px",
//                   borderRadius: 8,
//                   border: "none",
//                   background: "#fff176",
//                   fontWeight: 600,
//                   cursor: "pointer",
//                 }}
//               >
//                 Block
//               </button>
//             </div>
//           </div>
//         </div>
//       )}


//       {/* REPORT REASONS MODAL */}
//       {showReportReasons && (
//         <div
//           onClick={() => setShowReportReasons(false)}
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,0.45)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 1000,
//           }}
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             style={{
//               width: 600,
//               background: "#fff",
//               borderRadius: 12,
//               padding: 24,
//             }}
//           >
//             <h3>Report this profile</h3>
//             <p style={{ color: "#666" }}>Select our policy that applies</p>

//             <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
//               {[
//                 "Fraud or scam",
//                 "Misinformation",
//                 "Harassment",
//                 "Dangerous or extremist organizations",
//                 "Threats or violence",
//                 "Self-harm",
//                 "Hateful speech",
//                 "Graphic content",
//                 "Sexual content",
//                 "Child exploitation",
//                 "Illegal goods and service",
//                 "Infringement",
//               ].map((reason) => {
//                 const active = selectedReasons.has(reason);
//                 return (
//                   <button
//                     key={reason}
//                     onClick={() => {
//                       const s = new Set(selectedReasons);
//                       active ? s.delete(reason) : s.add(reason);
//                       setSelectedReasons(s);
//                     }}
//                     style={{
//                       padding: "8px 14px",
//                       borderRadius: 20,
//                       border: "1px solid #ccc",
//                       background: active ? "#fff9c4" : "#fff",
//                       cursor: "pointer",
//                     }}
//                   >
//                     {reason}
//                   </button>
//                 );
//               })}
//             </div>

//             <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
//               <button
//                 onClick={() => setShowReportReasons(false)}
//                 style={{ padding: "8px 16px", borderRadius: 8 }}
//               >
//                 Back
//               </button>
//               <button
//                 disabled={!selectedReasons.size}
//                 onClick={() => {
//                   const r = Array.from(selectedReasons)[0];
//                   setConfirmReason(r);
//                   setShowReportReasons(false);
//                   setShowReportConfirm(true);
//                 }}
//                 style={{
//                   padding: "8px 18px",
//                   borderRadius: 8,
//                   background: "#fff176",
//                   border: "none",
//                   opacity: selectedReasons.size ? 1 : 0.5,
//                 }}
//               >
//                 Submit report
//               </button>
//             </div>
//           </div>
//         </div>
//       )}


//       {/* REPORT PROFILE MODAL */}
//       {showReportProfile && (
//         <div
//           onClick={() => setShowReportProfile(false)}
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,0.45)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 1000,
//           }}
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             style={{
//               width: 560,
//               background: "#fff",
//               borderRadius: 8,
//               boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
//             }}
//           >
//             {/* HEADER */}
//             <div
//               style={{
//                 padding: "16px 20px",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 borderBottom: "1px solid #e5e5e5",
//               }}
//             >
//               <h3 style={{ margin: 0, fontWeight: 600 }}>Report this profile</h3>
//               <button
//                 onClick={() => setShowReportProfile(false)}
//                 style={{
//                   border: "none",
//                   background: "transparent",
//                   fontSize: 18,
//                   cursor: "pointer",
//                 }}
//               >
//                 ✕
//               </button>
//             </div>

//             {/* CONTENT */}
//             <div style={{ padding: "20px" }}>
//               <p style={{ margin: "0 0 14px", fontSize: 14, color: "#444" }}>
//                 Select an option that applies
//               </p>

//               {/* RADIO OPTIONS */}
//               {[
//                 "This person is impersonating someone",
//                 "This account has been hacked",
//                 "This account is not a real person",
//               ].map((reason) => (
//                 <label
//                   key={reason}
//                   onClick={() => setSelectedProfileReason(reason)}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 12,
//                     padding: "10px 0",
//                     cursor: "pointer",
//                   }}
//                 >
//                   <div
//                     style={{
//                       width: 16,
//                       height: 16,
//                       borderRadius: "50%",
//                       border: "2px solid #666",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                   >
//                     {selectedProfileReason === reason && (
//                       <div
//                         style={{
//                           width: 8,
//                           height: 8,
//                           borderRadius: "50%",
//                           background: "#111",
//                         }}
//                       />
//                     )}
//                   </div>

//                   <span style={{ fontSize: 14 }}>{reason}</span>
//                 </label>
//               ))}

//               {/* INFO BOX */}
//               <div
//                 style={{
//                   marginTop: 14,
//                   background: "#fff9c4",
//                   padding: "12px 14px",
//                   borderRadius: 6,
//                   fontSize: 13,
//                   color: "#333",
//                 }}
//               >
//                 If you believe this person is no longer with us, you can let us know
//                 this person is deceased
//               </div>
//             </div>

//             {/* ACTIONS */}
//             <div
//               style={{
//                 padding: "14px 20px",
//                 display: "flex",
//                 justifyContent: "flex-end",
//                 gap: 12,
//                 borderTop: "1px solid #e5e5e5",
//               }}
//             >
//               <button
//                 onClick={() => {
//                   setShowReportProfile(false);
//                   setSelectedProfileReason(null);
//                 }}
//                 style={{
//                   padding: "8px 18px",
//                   borderRadius: 8,
//                   border: "1px solid #cfcfcf",
//                   background: "#fff",
//                   cursor: "pointer",
//                 }}
//               >
//                 Back
//               </button>

//               <button
//                 disabled={!selectedProfileReason}
//                 onClick={() => {
//                   if (selectedProfileReason) {
//                     handleReportSubmit(selectedProfileReason);
//                   }
//                 }}
//                 style={{
//                   padding: "8px 22px",
//                   borderRadius: 8,
//                   border: "none",
//                   background: "#fff176",
//                   fontWeight: 600,
//                   cursor: selectedProfileReason ? "pointer" : "not-allowed",
//                   opacity: selectedProfileReason ? 1 : 0.5,
//                 }}
//               >
//                 Submit report
//               </button>
//             </div>
//           </div>
//         </div>
//       )}




//       {/* REPORT CONFIRM MODAL */}
//       {showReportConfirm && (
//         <div style={styles.modalOverlay} onClick={() => setShowReportConfirm(false)}>
//           <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
//             <h2 style={styles.modalTitle}>Report this profile</h2>

//             <div style={styles.confirmBox}>
//               <h4 style={styles.confirmTitle}>{confirmReason}</h4>
//               <p style={styles.confirmDesc}>{getReasonDescription(confirmReason)}</p>
//             </div>

//             <div style={styles.modalActions}>
//               <button
//                 style={styles.actionBtn}
//                 onClick={() => setShowReportConfirm(false)}
//               >
//                 Back
//               </button>
//               <button
//                 style={styles.actionBtnPrimary}
//                 onClick={() => handleReportSubmit(confirmReason)}
//               >
//                 Submit Report
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <style>{`
//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }
//         @keyframes fade-in {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in {
//           animation: fade-in 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }

// /* ================= STYLES ================= */
// const styles = {
//   container: {
//     minHeight: '100vh',
//     backgroundColor: '#F6F6F6',
//     paddingBottom: 40,
//   },

//   loadingContainer: {
//     minHeight: '100vh',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#F6F6F6',
//   },

//   spinner: {
//     width: 48,
//     height: 48,
//     border: '4px solid #e5e7eb',
//     borderTopColor: '#7C3CFF',
//     borderRadius: '50%',
//     animation: 'spin 1s linear infinite',
//   },

//   loadingText: {
//     marginTop: 16,
//     fontSize: 16,
//     color: '#6b7280',
//   },

//   errorContainer: {
//     minHeight: '100vh',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#F6F6F6',
//     padding: 32,
//   },

//   errorText: {
//     marginTop: 16,
//     fontSize: 18,
//     color: '#6b7280',
//   },

//   retryBtn: {
//     marginTop: 20,
//     padding: '12px 24px',
//     borderRadius: 10,
//     border: 'none',
//     backgroundColor: '#6366f1',
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: 600,
//     cursor: 'pointer',
//   },

//   header: {
//     backgroundColor: '#fff',
//     paddingBottom: 100,
//   },

//   coverImage: {
//     height: 220,
//     backgroundSize: 'cover',
//     backgroundPosition: 'center',
//     position: 'relative',
//   },

//   backBtn: {
//     position: 'absolute',
//     top: 20,
//     left: 20,
//     width: 40,
//     height: 40,
//     borderRadius: '50%',
//     border: 'none',
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     cursor: 'pointer',
//   },

//   actionBtns: {
//     position: 'absolute',
//     top: 20,
//     right: 20,
//     display: 'flex',
//     gap: 8,
//   },

//   iconBtn: {
//     width: 40,
//     height: 40,
//     borderRadius: '50%',
//     border: 'none',
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     cursor: 'pointer',
//   },

//   profileCard: {
//     margin: '0 20px',
//     marginTop: -60,
//     position: 'relative',
//     zIndex: 1,
//   },

//   profileRow: {
//     display: 'flex',
//     gap: 16,
//   },

//   profileImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 14,
//     border: '4px solid #fff',
//     objectFit: 'cover',
//     boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
//   },

//   profileInfo: {
//     flex: 1,
//     paddingTop: 8,
//   },

//   profileName: {
//     margin: 0,
//     fontSize: 16,
//     fontWeight: 600,
//     color: '#000',
//   },

//   profileSector: {
//     margin: '4px 0',
//     fontSize: 14,
//   },

//   sectorText: {
//     color: '#7C3CFF',
//     fontWeight: 500,
//   },

//   locationText: {
//     color: '#6b7280',
//   },

//   teamSize: {
//     margin: '4px 0',
//     fontSize: 12,
//     color: '#000',
//   },

//   socialLinks: {
//     display: 'flex',
//     gap: 16,
//     marginTop: 8,
//   },

//   linkBtn: {
//     display: 'flex',
//     alignItems: 'center',
//     padding: 0,
//     border: 'none',
//     background: 'none',
//     color: '#317CFF',
//     fontSize: 13,
//     fontWeight: 500,
//     cursor: 'pointer',
//   },

//   section: {
//     backgroundColor: '#fff',
//     padding: 20,
//     marginTop: 10,
//   },

//   sectionTitle: {
//     margin: 0,
//     fontSize: 16,
//     fontWeight: 600,
//     color: '#000',
//     marginBottom: 8,
//   },

//   sectionText: {
//     margin: 0,
//     fontSize: 14,
//     lineHeight: 1.6,
//     color: '#374151',
//   },

//   jobsSection: {
//     backgroundColor: '#fff',
//     marginTop: 10,
//     paddingTop: 16,
//   },

//   tabContainer: {
//     display: 'flex',
//     borderBottom: '1px solid #e5e7eb',
//     padding: '0 16px',
//   },

//   tab: {
//     flex: 1,
//     padding: '12px 0',
//     border: 'none',
//     background: 'none',
//     fontSize: 16,
//     fontWeight: 500,
//     color: '#6b7280',
//     cursor: 'pointer',
//     borderBottom: '4px solid transparent',
//   },

//   tabActive: {
//     flex: 1,
//     padding: '12px 0',
//     border: 'none',
//     background: 'none',
//     fontSize: 16,
//     fontWeight: 600,
//     color: '#000',
//     cursor: 'pointer',
//     borderBottom: '4px solid #000',
//   },

//   jobsList: {
//     padding: 16,
//     minHeight: 300,
//   },

//   emptyText: {
//     textAlign: 'center',
//     color: '#9ca3af',
//     fontSize: 16,
//     paddingTop: 60,
//   },

//   jobCard: {
//     backgroundColor: '#FFFFEA',
//     border: '1px solid #CECECE',
//     borderRadius: 24,
//     padding: 20,
//     marginBottom: 12,
//   },

//   jobHeader: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 12,
//   },

//   jobTitle: {
//     margin: 0,
//     fontSize: 16,
//     fontWeight: 500,
//     color: '#000',
//     flex: 1,
//   },

//   jobBudget: {
//     fontSize: 14,
//     fontWeight: 500,
//     color: '#000',
//     marginLeft: 12,
//   },

//   skillsLabel: {
//     margin: '12px 0 8px',
//     fontSize: 10,
//     color: '#6b7280',
//   },

//   skillsContainer: {
//     display: 'flex',
//     gap: 8,
//     flexWrap: 'wrap',
//     marginBottom: 12,
//   },

//   skillChip: {
//     padding: '6px 12px',
//     backgroundColor: '#FFFFBE',
//     borderRadius: 20,
//     fontSize: 13,
//     fontWeight: 500,
//     color: '#000',
//   },

//   jobDescription: {
//     margin: 0,
//     fontSize: 12,
//     lineHeight: 1.6,
//     color: '#374151',
//     display: '-webkit-box',
//     WebkitLineClamp: 3,
//     WebkitBoxOrient: 'vertical',
//     overflow: 'hidden',
//   },

//   modalOverlay: {
//     position: 'fixed',
//     inset: 0,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     display: 'flex',
//     alignItems: 'flex-end',
//     justifyContent: 'center',
//     zIndex: 1000,
//   },
//   jobsSection: {
//     padding: "30px 0",
//   },

//   tabContainer: {
//     display: "flex",
//     gap: 12,
//     background: "#fff",
//     padding: 10,
//     borderRadius: 30,
//     width: "fit-content",
//     marginBottom: 30,
//     boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
//   },

//   tab: {
//     padding: "10px 28px",
//     borderRadius: 24,
//     border: "none",
//     background: "transparent",
//     cursor: "pointer",
//     fontWeight: 500,
//   },

//   tabActive: {
//     padding: "10px 28px",
//     borderRadius: 24,
//     border: "none",
//     background: "#8b5cf6",
//     color: "#fff",
//     cursor: "pointer",
//     fontWeight: 500,
//   },

//   jobsList: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
//     gap: 30,
//   },

//   card: {
//     background: "#fff",
//     borderRadius: 26,
//     padding: 26,
//     boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
//   },

//   topRow: {
//     display: "flex",
//     gap: 18,
//     marginBottom: 24,
//   },

//   avatar: {
//     width: 64,
//     height: 64,
//     borderRadius: 20,
//     background: "#8b5cf6",
//     color: "#fff",
//     fontSize: 22,
//     fontWeight: 600,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   titleRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },

//   title: {
//     margin: 0,
//     fontSize: 20,
//     fontWeight: 600,
//   },

//   arrow: {
//     fontSize: 28,
//     opacity: 0.4,
//   },

//   skillRow: {
//     display: "flex",
//     gap: 10,
//     marginTop: 8,
//     flexWrap: "wrap",
//   },

//   skill: {
//     background: "#FFF9B0",
//     padding: "6px 14px",
//     borderRadius: 20,
//     fontSize: 13,
//     fontWeight: 500,
//   },

//   detailsRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     marginTop: 10,
//   },

//   label: {
//     margin: 0,
//     fontSize: 13,
//     color: "#777",
//   },

//   value: {
//     margin: "6px 0 0",
//     fontWeight: 600,
//   },

//   valuePurple: {
//     margin: "6px 0 0",
//     fontWeight: 600,
//     color: "#7c3aed",
//   },

//   emptyText: {
//     textAlign: "center",
//     color: "#777",
//   },
// };








import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../../firbase/Firebase';
import {
  Share2,
  ArrowLeft,
  Flag,
  AlertCircle,
  Linkedin,
  Globe
} from 'lucide-react';

export default function ClientFullDetailScreen() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();

  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [jobs, setJobs] = useState([]);
  const [jobs24h, setJobs24h] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const [activeTab, setActiveTab] = useState('work');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showReportReasons, setShowReportReasons] = useState(false);
  const [showReportProfile, setShowReportProfile] = useState(false);
  const [showReportConfirm, setShowReportConfirm] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState(new Set());
  const [selectedProfileReason, setSelectedProfileReason] = useState(null);
  const [confirmReason, setConfirmReason] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    if (!userId) return;

    const unsub = onSnapshot(doc(db, 'users', userId), (snap) => {
      setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      setLoadingProfile(false);
    });

    return () => unsub();
  }, [userId]);

  /* ================= FETCH JOBS ================= */
  useEffect(() => {
    if (!userId) return;

    const q1 = query(
      collection(db, 'jobs'),
      where('userId', '==', userId)
    );

    const q2 = query(
      collection(db, 'jobs_24h'),
      where('userId', '==', userId)
    );

    const u1 = onSnapshot(q1, (snap) => {
      setJobs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoadingJobs(false);
    });

    const u2 = onSnapshot(q2, (snap) => {
      setJobs24h(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoadingJobs(false);
    });

    return () => {
      u1();
      u2();
    };
  }, [userId]);

  /* ================= BLOCK USER ================= */
  const handleBlock = async () => {
    if (!currentUser || !userId) return;

    try {
      await addDoc(collection(db, 'blocked_users'), {
        blockedBy: currentUser.uid,
        blockedUserId: userId,
        blockedUserName: `${profile?.first_name} ${profile?.last_name}`,
        blockedAt: serverTimestamp(),
      });

      setToastMessage('User blocked successfully');
      setTimeout(() => setToastMessage(""), 3000);
      setShowBlockDialog(false);

      setTimeout(() => {
        navigate(-1);
      }, 1000);
    } catch (error) {
      console.error('Error blocking user:', error);
      setToastMessage('Failed to block user');
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  /* ================= REPORT USER ================= */
  const handleReportSubmit = async (reason) => {
    if (!currentUser || !userId) return;

    try {
      await addDoc(collection(db, 'reports'), {
        reportedUserId: userId,
        reportedUserName: `${profile?.first_name} ${profile?.last_name}`,
        reportedBy: currentUser.uid,
        reason,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      setToastMessage('Report submitted successfully');
      setTimeout(() => setToastMessage(""), 3000);
      setShowReportProfile(false);
      setShowReportReasons(false);
      setShowReportConfirm(false);
    } catch (error) {
      console.error('Error submitting report:', error);
      setToastMessage('Failed to submit report');
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  /* ================= SHARE PROFILE ================= */
  const handleShare = async () => {
    const shareText = `Check out ${profile?.first_name} ${profile?.last_name}'s professional profile`;
    const shareUrl = profile?.linkedin || window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Professional Profile',
          text: shareText,
          url: shareUrl,
        });
        setShowMenu(false);
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      setToastMessage('Link copied to clipboard!');
      setTimeout(() => setToastMessage(""), 3000);
      setShowMenu(false);
    }
  };

  /* ================= OPEN LINK ================= */
  const openLink = (url) => {
    if (!url) return;
    const fixedUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(fixedUrl, '_blank');
  };

  /* ================= LOADING STATE ================= */
  if (loadingProfile) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={styles.errorContainer}>
        <AlertCircle size={64} color="#9ca3af" />
        <p style={styles.errorText}>User profile not found</p>
        <button onClick={() => navigate(-1)} style={styles.retryBtn}>
          Go Back
        </button>
      </div>
    );
  }

  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User';
  const displayedJobs = activeTab === 'work' ? jobs : jobs24h;

  /* ================= RENDER ================= */
  return (

    <div id="fh-page" className="fh-page rubik-font">
      <div id="fh-containers" className="fh-container" >
        <div style={styles.container}>
         
          {toastMessage && (
            <div style={styles.toast}>
              {toastMessage}
            </div>
          )}

          {/* PROFILE HEADER */}
          <div style={styles.profileHeader}>
            <button onClick={() => navigate(-1)} style={styles.backBtn}>
              <ArrowLeft size={18} />
            </button>

            {currentUser?.uid !== userId && (
              <div style={styles.menuWrap}>
                <button style={styles.menuBtn} onClick={() => setShowMenu(!showMenu)}>
                  ⋮
                </button>
                {showMenu && (
                  <div style={styles.menuDropdown}>
                    <div style={styles.menuItem} onClick={handleShare}>
                      <Share2 size={16} /> Share profile
                    </div>
                    <div
                      style={styles.menuItem}
                      onClick={() => {
                        setShowMenu(false);
                        setShowReportModal(true);
                      }}
                    >
                      <Flag size={16} /> Report/Block
                    </div>
                  </div>
                )}
              </div>
            )}

            <img
              src={profile.profileImage || "/assets/profile.png"}
              alt={fullName}
              style={styles.profileImg}
            />

            <div style={styles.profileInfo}>
              <h2 style={styles.companyName}>
                {profile.company_name || fullName}
              </h2>
              <p style={styles.email}>{profile.email}</p>
              <p style={styles.sectorLocation}>
                <span style={styles.sector}>{profile.sector || "N/A"}</span>
                <span style={styles.location}> · {profile.location || "N/A"}</span>
              </p>

              <div style={styles.linksRow}>
                {profile.linkedin && (
                  <span onClick={() => openLink(profile.linkedin)} style={styles.link}>
                    <Linkedin size={14} /> LinkedIn
                  </span>
                )}
                {profile.website && (
                  <span onClick={() => openLink(profile.website)} style={styles.link}>
                    <Globe size={14} /> Website
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ABOUT + DETAILS SECTION */}
          <div style={styles.twoCol}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>About</h3>
              <p style={styles.cardText}>{profile.about || "No description available."}</p>
            </div>

            <div style={{ ...styles.card, background: "#FFFEEF" }}>
              <div style={styles.detailItem}>
                <h4 style={styles.detailLabel}>Industry</h4>
                <p style={styles.detailValue}>{profile.sector || "N/A"}</p>
              </div>

              <div style={styles.detailItem}>
                <h4 style={styles.detailLabel}>Company size</h4>
                <p style={styles.detailValue}>{profile.team_size || "N/A"}</p>
              </div>

              <div style={styles.detailItem}>
                <h4 style={styles.detailLabel}>Account Handler</h4>
                <p style={styles.detailValue}>{fullName}</p>
              </div>

              <div style={{ marginBottom: 0 }}>
                <h4 style={styles.detailLabel}>Email Address</h4>
                <p style={styles.detailValue}>{profile.email || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* JOBS SECTION */}
          {/* ================= POSTED JOBS ================= */}
          <div style={styles.section}>
            {/* Header */}
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Posted Jobs</h3>
              <span style={styles.viewAllLink}>View All</span>
            </div>

            {/* Tabs */}
            <div style={styles.tabs}>
              <button
                onClick={() => setActiveTab("work")}
                style={activeTab === "work" ? styles.tabActive : styles.tab}
              >
                Work
              </button>
              <button
                onClick={() => setActiveTab("24h")}
                style={activeTab === "24h" ? styles.tabActive : styles.tab}
              >
                24 Hours
              </button>
            </div>

            {/* Jobs Grid */}
            {loadingJobs ? (
              <p style={styles.emptyText}>Loading jobs...</p>
            ) : displayedJobs.length === 0 ? (
              <p style={styles.emptyText}>No jobs posted yet</p>
            ) : (
              <div style={styles.jobsGrid}>
                {displayedJobs.map((job) => {
                  const skills = Array.isArray(job.skills) ? job.skills : [];
                  const initials = job.title
                    ? job.title.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
                    : "JB";

                  return (
                    <div key={job.id} style={styles.jobCard}>
                      {/* Card Header with Avatar */}
                      <div style={styles.jobCardHeader}>
                        <div style={styles.jobAvatar}>{initials}</div>
                        <div style={styles.jobTitleWrap}>
                          <h4 style={styles.jobTitle}>{job.title || "Job Title"}</h4>
                          <p style={styles.jobDescription}>
                            {job.description?.slice(0, 60) || "No description"}
                            {job.description?.length > 60 ? "..." : ""}
                          </p>
                        </div>
                      </div>

                      {/* Skills */}
                      <div style={styles.skillsContainer}>
                        {skills.slice(0, 3).map((s, i) => (
                          <span key={i} style={styles.skillChip}>{s}</span>
                        ))}
                        {skills.length > 3 && (
                          <span style={styles.skillChipMore}>{skills.length - 3}+</span>
                        )}
                      </div>

                      {/* Meta Details */}
                      <div style={styles.jobDetails}>
                        <div style={styles.detailItem}>
                          <p style={styles.detailLabel}>Budget</p>
                          <p style={styles.budgetValue}>
                            ₹{job.budget_from || 1000} – ₹{job.budget_to || 8000}
                          </p>
                        </div>
                        <div style={styles.detailItem}>
                          <p style={styles.detailLabel}>Timeline</p>
                          <p style={styles.detailValue}>
                            {job.deliveryDuration || "2 – 3 weeks"}
                          </p>
                        </div>
                        <div style={styles.detailItem}>
                          <p style={styles.detailLabel}>Location</p>
                          <p style={styles.detailValue}>{job.location || "Remote"}</p>
                        </div>
                      </div>

                      {/* Actions (Owner Only) */}
                      {currentUser?.uid === userId && (
                        <div style={styles.jobActions}>
                          <button
                            style={{
                              ...styles.pauseBtn,
                              backgroundColor: job.paused ? "#ef4444" : "#8b5cf6",
                            }}
                            onClick={() => togglePause(job)}
                          >
                            {job.paused ? "Unpause" : "Pause Service"}
                          </button>
                          <button style={styles.editBtn}>Edit Service</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>


          {/* REPORT MODAL */}
          {showReportModal && (
            <>
              <div style={styles.overlay} onClick={() => setShowReportModal(false)} />
              <div style={styles.modal}>
                <div style={styles.modalHeader}>
                  <h3 style={styles.modalTitle}>Report or block</h3>
                  <button onClick={() => setShowReportModal(false)} style={styles.closeBtn}>
                    ✕
                  </button>
                </div>

                <p style={styles.modalSubtitle}>Select an action</p>

                {[
                  { label: `Block ${fullName}`, action: () => { setShowReportModal(false); setShowBlockDialog(true); } },
                  { label: `Report ${fullName}`, action: () => { setShowReportModal(false); setShowReportProfile(true); } },
                  { label: "Report profile element", action: () => { setShowReportModal(false); setShowReportReasons(true); } },
                ].map((item) => (
                  <div key={item.label} onClick={item.action} style={styles.modalOption}>
                    <span>{item.label}</span>
                    <span>›</span>
                  </div>
                ))}

                <div style={styles.infoBox}>
                  To report posts, comments, or messages, select the overflow menu next to that content and select Report.
                </div>
              </div>
            </>
          )}

          {/* BLOCK DIALOG */}
          {showBlockDialog && (
            <>
              <div style={styles.overlay} onClick={() => setShowBlockDialog(false)} />
              <div style={styles.confirmModal}>
                <div style={styles.confirmHeader}>
                  <h3 style={styles.confirmTitle}>Block</h3>
                  <button onClick={() => setShowBlockDialog(false)} style={styles.closeBtn}>✕</button>
                </div>

                <div style={styles.confirmContent}>
                  <p style={styles.confirmText}>
                    You're about to block {fullName}. You'll no longer be connected, and will lose any endorsements or recommendations from this person.
                  </p>
                </div>

                <div style={styles.confirmActions}>
                  <button onClick={() => setShowBlockDialog(false)} style={styles.cancelBtn}>
                    Back
                  </button>
                  <button onClick={handleBlock} style={styles.confirmBtn}>
                    Block
                  </button>
                </div>
              </div>
            </>
          )}

          {/* REPORT PROFILE MODAL */}
          {showReportProfile && (
            <>
              <div style={styles.overlay} onClick={() => setShowReportProfile(false)} />
              <div style={styles.confirmModal}>
                <div style={styles.confirmHeader}>
                  <h3 style={styles.confirmTitle}>Report this profile</h3>
                  <button onClick={() => setShowReportProfile(false)} style={styles.closeBtn}>✕</button>
                </div>

                <div style={styles.confirmContent}>
                  <p style={styles.optionSubtitle}>Select an option that applies</p>

                  {[
                    "This person is impersonating someone",
                    "This account has been hacked",
                    "This account is not a real person",
                  ].map((reason) => (
                    <label key={reason} onClick={() => setSelectedProfileReason(reason)} style={styles.radioOption}>
                      <div style={styles.radioCircle}>
                        {selectedProfileReason === reason && <div style={styles.radioDot} />}
                      </div>
                      <span style={styles.radioLabel}>{reason}</span>
                    </label>
                  ))}

                  <div style={styles.warningBox}>
                    If you believe this person is no longer with us, you can let us know this person is deceased
                  </div>
                </div>

                <div style={styles.confirmActions}>
                  <button onClick={() => { setShowReportProfile(false); setSelectedProfileReason(null); }} style={styles.cancelBtn}>
                    Back
                  </button>
                  <button
                    disabled={!selectedProfileReason}
                    onClick={() => { if (selectedProfileReason) handleReportSubmit(selectedProfileReason); }}
                    style={{ ...styles.confirmBtn, opacity: selectedProfileReason ? 1 : 0.5 }}
                  >
                    Submit report
                  </button>
                </div>
              </div>
            </>
          )}

          <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
      </div>
    </div>


  );
}

/* ================= STYLES ================= */
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#F6F6F6',
    paddingBottom: 40,
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F6F6',
  },
  spinner: {
    width: 48,
    height: 48,
    border: '4px solid #e5e7eb',
    borderTopColor: '#FFF9A8',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F6F6',
    padding: 32,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: '#6b7280',
  },
  retryBtn: {
    marginTop: 20,
    padding: '12px 24px',
    borderRadius: 10,
    border: 'none',
    backgroundColor: '#FFF9A8',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  profileHeader: {
    background: "#FFF9A8",
    padding: "32px 24px",
    display: "flex",
    gap: 20,
    alignItems: "flex-start",
    position: "relative",
  },
  backBtn: {
    position: "absolute",
    top: 20,
    left: 20,
    border: "none",
    background: "#fff",
    borderRadius: "50%",
    width: 36,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  profileImg: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #fff",
    flexShrink: 0,
  },
  menuWrap: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  menuBtn: {
    border: "none",
    background: "#fff",
    borderRadius: "50%",
    width: 36,
    height: 36,
    fontSize: 20,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  menuDropdown: {
    position: "absolute",
    right: 0,
    top: 45,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,.15)",
    minWidth: 180,
    overflow: "hidden",
    zIndex: 100,
  },
  menuItem: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    padding: "14px 18px",
    cursor: "pointer",
    borderBottom: "1px solid #f0f0f0",
    fontSize: 14,
  },
  profileInfo: {
    flex: 1,
  },
  companyName: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
  },
  email: {
    margin: "8px 0",
    fontSize: 14,
    color: "#555",
  },
  sectorLocation: {
    margin: "6px 0",
    fontSize: 14,
  },
  sector: {
    color: "#8b5cf6",
    fontWeight: 600,
  },
  location: {
    color: "#777",
  },
  linksRow: {
    display: "flex",
    gap: 16,
    marginTop: 8,
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#2563eb",
    fontSize: 13,
    cursor: "pointer",
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 20,
    padding: "20px 20px 0",
  },
  card: {
    background: "#fff",
    padding: 24,
    borderRadius: 20,
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  cardTitle: {
    margin: "0 0 12px 0",
    fontSize: 18,
    fontWeight: 600,
  },
  cardText: {
    margin: 0,
    lineHeight: 1.6,
    color: "#555",
    fontSize: 14,
  },
  detailItem: {
    marginBottom: 18,
  },
  detailLabel: {
    margin: 0,
    fontSize: 14,
    fontWeight: 600,
    color: "#000",
  },
  detailValue: {
    marginTop: 6,
    fontSize: 14,
    color: "#555",
  },
  section: {
    background: "#fff",
    margin: "20px 20px 0",
    padding: 24,
    borderRadius: 20,
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  tabs: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
  },
  tab: {
    padding: "10px 24px",
    borderRadius: 20,
    border: "none",
    background: "#f5f5f5",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
  },
  tabActive: {
    padding: "10px 24px",
    borderRadius: 20,
    border: "none",
    background: "#FFF9A8",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 16,
    padding: '40px 0',
  },
  jobCard: {
    border: "1px solid #f0f0f0",
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    background: "#fafafa",
  },
  jobTitle: {
    margin: "0 0 8px 0",
    fontSize: 16,
    fontWeight: 600,
  },
  jobDescription: {
    margin: "0 0 12px 0",
    color: "#555",
    fontSize: 14,
    lineHeight: 1.5,
  },
  skillsContainer: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 16,
  },
  skillChip: {
    background: "#FFF9A8",
    padding: "6px 14px",
    borderRadius: 16,
    fontSize: 13,
    fontWeight: 600,
  },
  jobDetails: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  budgetValue: {
    marginTop: 6,
    fontWeight: 600,
    color: "#7c3aed",
    fontSize: 14,
  },
  jobActions: {
    display: "flex",
    gap: 12,
    marginTop: 20,
  },
  pauseBtn: {
    flex: 1,
    padding: "10px",
    borderRadius: 20,
    border: "1px solid #ccc",
    background: "#fff",
    fontWeight: 500,
    cursor: "pointer",
  },
  editBtn: {
    flex: 1,
    padding: "10px",
    borderRadius: 20,
    border: "none",
    background: "#FFF9A8",
    fontWeight: 600,
    cursor: "pointer",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 999,
  },
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 520,
    background: "#fff",
    borderRadius: 12,
    padding: 20,
    zIndex: 1000,
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 600,
  },
  closeBtn: {
    border: "none",
    background: "none",
    fontSize: 24,
    cursor: "pointer",
    color: "#666",
  },
  modalSubtitle: {
    color: "#666",
    marginBottom: 16,
    fontSize: 14,
  },
  modalOption: {
    padding: "14px 0",
    display: "flex",
    justifyContent: "space-between",
    cursor: "pointer",
    borderBottom: "1px solid #eee",
    fontSize: 15,
  },
  infoBox: {
    background: "#fffde7",
    padding: 14,
    borderRadius: 8,
    marginTop: 16,
    fontSize: 13,
    color: "#555",
    lineHeight: 1.5,
  },
  confirmModal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 520,
    background: "#fff",
    borderRadius: 8,
    boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
    zIndex: 1000,
  },
  confirmHeader: {
    padding: "16px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e5e5e5",
  },
  confirmTitle: {
    margin: 0,
    fontWeight: 600,
    fontSize: 18,
  },
  confirmContent: {
    padding: "20px",
  },
  confirmText: {
    margin: 0,
    fontSize: 15,
    lineHeight: 1.6,
    color: "#111",
  },
  confirmActions: {
    padding: "14px 20px",
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    borderTop: "1px solid #e5e5e5",
  },
  cancelBtn: {
    padding: "8px 18px",
    borderRadius: 8,
    border: "1px solid #cfcfcf",
    background: "#fff",
    cursor: "pointer",
    fontSize: 14,
  },
  confirmBtn: {
    padding: "8px 22px",
    borderRadius: 8,
    border: "none",
    background: "#FFF9A8",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 14,
  },
  optionSubtitle: {
    margin: "0 0 14px",
    fontSize: 14,
    color: "#444",
  },
  radioOption: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 0",
    cursor: "pointer",
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: "50%",
    border: "2px solid #666",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#111",
  },
  radioLabel: {
    fontSize: 14,
  },
  warningBox: {
    marginTop: 14,
    background: "#fff9c4",
    padding: "12px 14px",
    borderRadius: 6,
    fontSize: 13,
    color: "#333",
    lineHeight: 1.5,
  },
  toast: {
    position: "fixed",
    top: 20,
    right: 20,
    background: "#34d399",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: 1000,
    fontWeight: 600,
  },

  section: {
    background: "#fff", margin: "20px 20px 0", padding: 24, borderRadius: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  }, sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, }, sectionTitle: { margin: 0, fontSize: 20, fontWeight: 700, color: "#1a1a1a", }, viewAllLink: { color: "#9ca3af", fontSize: 14, cursor: "pointer", textDecoration: "none", },  /* ================= TABS ================= */  tabs: { display: "inline-flex", gap: 10, marginBottom: 24, }, tab: { padding: "10px 28px", border: "2px dashed #d1d5db", background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#6b7280", borderRadius: 25, transition: "all 0.2s ease", }, tabActive: { padding: "10px 28px", border: "2px solid #8b5cf6", background: "#8b5cf6", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", borderRadius: 25, transition: "all 0.2s ease", },  /* ================= JOBS GRID - 2 PER ROW ================= */  jobsGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, },  /* ================= JOB CARD ================= */  jobCard: { background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)", border: "1px solid #f0f0f0", transition: "transform 0.2s, box-shadow 0.2s", }, jobCardHeader: { display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16, }, jobAvatar: { width: 50, height: 50, borderRadius: "50%", background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16, flexShrink: 0, }, jobTitleWrap: { flex: 1, minWidth: 0, }, jobTitle: { margin: 0, fontSize: 16, fontWeight: 600, color: "#1a1a1a", marginBottom: 4, }, jobDescription: { margin: 0, fontSize: 13, color: "#6b7280", lineHeight: 1.4, },  /* ================= SKILLS ================= */  skillsContainer: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16, }, skillChip: { background: "#f3f0ff", color: "#7c3aed", padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500, }, skillChipMore: { background: "#8b5cf6", color: "#fff", padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, },  /* ================= META DETAILS ================= */  jobDetails: { display: "flex", justifyContent: "space-between", gap: 12, paddingTop: 16, borderTop: "1px solid #f0f0f0", }, detailItem: { flex: 1, }, detailLabel: { margin: 0, fontSize: 12, color: "#9ca3af", fontWeight: 500, marginBottom: 4, }, detailValue: { margin: 0, fontSize: 13, color: "#1a1a1a", fontWeight: 600, }, budgetValue: { margin: 0, fontSize: 13, color: "#059669", fontWeight: 700, },  /* ================= ACTIONS ================= */  jobActions: { display: "flex", gap: 10, marginTop: 16, }, pauseBtn: { flex: 1, padding: "10px 16px", borderRadius: 12, border: "none", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 13, transition: "all 0.2s ease", }, editBtn: { flex: 1, padding: "10px 16px", borderRadius: 12, border: "2px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 600, cursor: "pointer", fontSize: 13, transition: "all 0.2s ease", }, emptyText: { textAlign: "center", color: "#9ca3af", fontSize: 14, padding: "40px 0", },
};