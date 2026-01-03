
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










import React, { useState, useEffect, useMemo } from 'react';
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
  ChevronRight, 
  X, 
  AlertCircle,
  CheckCircle,
  Linkedin,
  Globe
} from 'lucide-react';

/* ======================================================
   CLIENT FULL DETAIL SCREEN - COMPLETE REACT VERSION
====================================================== */

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

  const [isAccepted, setIsAccepted] = useState(false);
  const [isRequested, setIsRequested] = useState(false);

  const [activeTab, setActiveTab] = useState('work');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showReportReasons, setShowReportReasons] = useState(false);
  const [showReportProfile, setShowReportProfile] = useState(false);
  const [showReportConfirm, setShowReportConfirm] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState(new Set());
  const [selectedProfileReason, setSelectedProfileReason] = useState(null);
  const [confirmReason, setConfirmReason] = useState('');

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

      showToast('User blocked successfully', 'success');
      setShowBlockDialog(false);
      
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    } catch (error) {
      console.error('Error blocking user:', error);
      showToast('Failed to block user', 'error');
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

      showToast('Report submitted successfully', 'success');
      setShowReportProfile(false);
      setShowReportReasons(false);
      setShowReportConfirm(false);
    } catch (error) {
      console.error('Error submitting report:', error);
      showToast('Failed to submit report', 'error');
    }
  };

  /* ================= SHARE PROFILE ================= */
  const handleShare = () => {
    const shareText = `Check out ${profile?.first_name} ${profile?.last_name}'s professional profile`;
    const shareUrl = profile?.linkedin || window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: 'Professional Profile',
        text: shareText,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      showToast('Link copied to clipboard!', 'success');
    }
  };

  /* ================= OPEN LINK ================= */
  const openLink = (url) => {
    if (!url) return;
    const fixedUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(fixedUrl, '_blank');
  };

  /* ================= TOAST NOTIFICATION ================= */
  const showToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-gray-800';
    toast.className = `fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  /* ================= REASON DESCRIPTIONS ================= */
  const getReasonDescription = (reason) => {
    const descriptions = {
      'Fraud or scam': 'Illegal activities, malware, or promotion of illegal products or services',
      'Misinformation': 'False or misleading information presented as fact',
      'Harassment': 'Abusive or harmful behavior toward individuals or groups',
      'Threats or violence': 'Threats or promotion of physical harm',
      'Hateful speech': 'Content that attacks or demeans based on identity',
    };
    return descriptions[reason] || 'This content violates our community guidelines';
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
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div
          style={{
            ...styles.coverImage,
            backgroundImage: profile.coverImage 
              ? `url(${profile.coverImage})` 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <button onClick={() => navigate(-1)} style={styles.backBtn}>
            <ArrowLeft size={20} color="#fff" />
          </button>

          <div style={styles.actionBtns}>
            <button onClick={() => setShowReportModal(true)} style={styles.iconBtn}>
              <Flag size={18} color="#fff" />
            </button>
            <button onClick={handleShare} style={styles.iconBtn}>
              <Share2 size={18} color="#fff" />
            </button>
          </div>
        </div>

        {/* PROFILE CARD */}
        <div style={styles.profileCard}>
          <div style={styles.profileRow}>
            <img
              src={profile.profileImage || '/assets/profile.png'}
              alt={fullName}
              style={styles.profileImage}
            />

            <div style={styles.profileInfo}>
              <h1 style={styles.profileName}>
                {fullName} · {profile.company_name || 'Company'}
              </h1>
              <p style={styles.profileSector}>
                <span style={styles.sectorText}>{profile.sector || 'Technology'}</span>
                <span style={styles.locationText}> · {profile.location || 'India'}, Tamil Nadu</span>
              </p>
              <p style={styles.teamSize}>{profile.team_size || '10-50 employees'}</p>

              <div style={styles.socialLinks}>
                {profile.linkedin && (
                  <button onClick={() => openLink(profile.linkedin)} style={styles.linkBtn}>
                    <Linkedin size={14} style={{ marginRight: 4 }} />
                    LinkedIn
                  </button>
                )}
                {profile.website && (
                  <button onClick={() => openLink(profile.website)} style={styles.linkBtn}>
                    <Globe size={14} style={{ marginRight: 4 }} />
                    Website
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ABOUT SECTION */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>About</h3>
        <p style={styles.sectionText}>{profile.about || 'No description available.'}</p>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Industry</h3>
        <p style={styles.sectionText}>{profile.sector || 'N/A'}</p>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Category</h3>
        <p style={styles.sectionText}>{profile.category || 'N/A'}</p>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Company size</h3>
        <p style={styles.sectionText}>{profile.team_size || 'N/A'}</p>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Email Address</h3>
        <p style={styles.sectionText}>{profile.email || 'N/A'}</p>
      </div>

      {/* JOBS SECTION */}
      <div style={styles.jobsSection}>
        <div style={styles.tabContainer}>
          <button
            onClick={() => setActiveTab('work')}
            style={activeTab === 'work' ? styles.tabActive : styles.tab}
          >
            Work
          </button>
          <button
            onClick={() => setActiveTab('24h')}
            style={activeTab === '24h' ? styles.tabActive : styles.tab}
          >
            24 hour
          </button>
        </div>

        <div style={styles.jobsList}>
          {loadingJobs ? (
            <p style={styles.emptyText}>Loading jobs...</p>
          ) : displayedJobs.length === 0 ? (
            <p style={styles.emptyText}>No jobs posted yet</p>
          ) : (
            displayedJobs.map((job) => (
              <div key={job.id} style={styles.jobCard}>
                <div style={styles.jobHeader}>
                  <h4 style={styles.jobTitle}>{job.title}</h4>
                  <span style={styles.jobBudget}>
                    ₹{job.budget_from || job.budget || '0'} - {job.budget_to || '0'}
                  </span>
                </div>

                <p style={styles.skillsLabel}>Skills Required</p>
                <div style={styles.skillsContainer}>
                  {(job.skills || []).slice(0, 3).map((skill, idx) => (
                    <span key={idx} style={styles.skillChip}>
                      {skill}
                    </span>
                  ))}
                  {(job.skills || []).length > 3 && (
                    <span style={styles.skillChip}>
                      +{(job.skills || []).length - 3}
                    </span>
                  )}
                </div>

                <p style={styles.jobDescription}>{job.description}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* REPORT MODAL */}
      {showReportModal && (
        <div style={styles.modalOverlay} onClick={() => setShowReportModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Report or block</h2>
            <p style={styles.modalSubtitle}>Select an action</p>

            <div style={styles.optionsList}>
              <button
                style={styles.optionBtn}
                onClick={() => {
                  setShowReportModal(false);
                  setShowBlockDialog(true);
                }}
              >
                <span>Block {fullName}</span>
                <ChevronRight size={20} />
              </button>

              <button
                style={styles.optionBtn}
                onClick={() => {
                  setShowReportModal(false);
                  setShowReportProfile(true);
                }}
              >
                <span>Report {fullName}</span>
                <ChevronRight size={20} />
              </button>

              <button
                style={styles.optionBtn}
                onClick={() => {
                  setShowReportModal(false);
                  setShowReportReasons(true);
                }}
              >
                <span>Report profile element</span>
                <ChevronRight size={20} />
              </button>
            </div>

            <div style={styles.infoBox}>
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <p style={styles.infoText}>
                To report posts, comments, or messages, select the overflow menu next to that content and select Report.
              </p>
            </div>

            <button style={styles.cancelBtn} onClick={() => setShowReportModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* BLOCK DIALOG */}
      {showBlockDialog && (
        <div style={styles.dialogOverlay} onClick={() => setShowBlockDialog(false)}>
          <div style={styles.dialogContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.iconCircle}>
              <X size={28} color="#7C3CFF" />
            </div>

            <h2 style={styles.dialogTitle}>Block {fullName}?</h2>
            <p style={styles.dialogText}>
              You're about to block {fullName}.<br />
              You'll no longer be connected,<br />
              and will lose any endorsements or<br />
              recommendations from this person.
            </p>

            <button style={styles.blockBtn} onClick={handleBlock}>
              Block
            </button>
            <button style={styles.backBtn2} onClick={() => setShowBlockDialog(false)}>
              Back
            </button>
          </div>
        </div>
      )}

      {/* REPORT REASONS MODAL */}
      {showReportReasons && (
        <div style={styles.modalOverlay} onClick={() => setShowReportReasons(false)}>
          <div style={styles.largeModalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Report this profile</h2>
            <p style={styles.modalSubtitle}>Select our policy that applies</p>

            <div style={styles.reasonsScroll}>
              <div style={styles.reasonsGrid}>
                {[
                  'Fraud or scam',
                  'Misinformation',
                  'Harassment',
                  'Threats or violence',
                  'Dangerous or extremist organizations',
                  'Self-harm',
                  'Hateful speech',
                  'Graphic content',
                  'Sexual content',
                  'Child exploitation',
                  'Infringement',
                  'Illegal goods and service',
                ].map((reason) => {
                  const isSelected = selectedReasons.has(reason);
                  return (
                    <button
                      key={reason}
                      style={isSelected ? styles.reasonChipActive : styles.reasonChip}
                      onClick={() => {
                        const newSet = new Set(selectedReasons);
                        if (isSelected) {
                          newSet.delete(reason);
                        } else {
                          newSet.add(reason);
                        }
                        setSelectedReasons(newSet);
                      }}
                    >
                      {reason}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={styles.modalActions}>
              <button
                style={styles.actionBtn}
                onClick={() => {
                  setShowReportReasons(false);
                  setSelectedReasons(new Set());
                }}
              >
                Back
              </button>
              <button
                style={{
                  ...styles.actionBtnPrimary,
                  opacity: selectedReasons.size === 0 ? 0.5 : 1,
                  cursor: selectedReasons.size === 0 ? 'not-allowed' : 'pointer',
                }}
                disabled={selectedReasons.size === 0}
                onClick={() => {
                  if (selectedReasons.size > 0) {
                    const reason = Array.from(selectedReasons)[0];
                    setConfirmReason(reason);
                    setShowReportReasons(false);
                    setShowReportConfirm(true);
                  }
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPORT PROFILE MODAL */}
      {showReportProfile && (
        <div style={styles.modalOverlay} onClick={() => setShowReportProfile(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Report {fullName}</h2>
            <p style={styles.modalSubtitle}>Select an option that applies</p>

            <div style={styles.radioOptions}>
              {[
                'This person is impersonating someone',
                'This account has been hacked',
                'This account is not a real person',
              ].map((reason) => (
                <button
                  key={reason}
                  style={styles.radioOption}
                  onClick={() => setSelectedProfileReason(reason)}
                >
                  <span style={styles.radioText}>{reason}</span>
                  <div
                    style={
                      selectedProfileReason === reason
                        ? styles.radioChecked
                        : styles.radioUnchecked
                    }
                  >
                    {selectedProfileReason === reason && <div style={styles.radioDot} />}
                  </div>
                </button>
              ))}
            </div>

            <div style={styles.warningBox}>
              <p style={styles.warningText}>
                If you believe this person is no longer with us, you can let us know this person is deceased.
              </p>
            </div>

            <div style={styles.modalActions}>
              <button
                style={styles.actionBtn}
                onClick={() => {
                  setShowReportProfile(false);
                  setSelectedProfileReason(null);
                }}
              >
                Back
              </button>
              <button
                style={{
                  ...styles.actionBtnPrimary,
                  opacity: !selectedProfileReason ? 0.5 : 1,
                  cursor: !selectedProfileReason ? 'not-allowed' : 'pointer',
                }}
                disabled={!selectedProfileReason}
                onClick={() => {
                  if (selectedProfileReason) {
                    handleReportSubmit(selectedProfileReason);
                  }
                }}
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPORT CONFIRM MODAL */}
      {showReportConfirm && (
        <div style={styles.modalOverlay} onClick={() => setShowReportConfirm(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Report this profile</h2>

            <div style={styles.confirmBox}>
              <h4 style={styles.confirmTitle}>{confirmReason}</h4>
              <p style={styles.confirmDesc}>{getReasonDescription(confirmReason)}</p>
            </div>

            <div style={styles.modalActions}>
              <button
                style={styles.actionBtn}
                onClick={() => setShowReportConfirm(false)}
              >
                Back
              </button>
              <button
                style={styles.actionBtnPrimary}
                onClick={() => handleReportSubmit(confirmReason)}
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
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
    borderTopColor: '#7C3CFF',
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
    backgroundColor: '#6366f1',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },

  header: {
    backgroundColor: '#fff',
    paddingBottom: 100,
  },

  coverImage: {
    height: 220,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
  },

  backBtn: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },

  actionBtns: {
    position: 'absolute',
    top: 20,
    right: 20,
    display: 'flex',
    gap: 8,
  },

  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },

  profileCard: {
    margin: '0 20px',
    marginTop: -60,
    position: 'relative',
    zIndex: 1,
  },

  profileRow: {
    display: 'flex',
    gap: 16,
  },

  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 14,
    border: '4px solid #fff',
    objectFit: 'cover',
    boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
  },

  profileInfo: {
    flex: 1,
    paddingTop: 8,
  },

  profileName: {
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
    color: '#000',
  },

  profileSector: {
    margin: '4px 0',
    fontSize: 14,
  },

  sectorText: {
    color: '#7C3CFF',
    fontWeight: 500,
  },

  locationText: {
    color: '#6b7280',
  },

  teamSize: {
    margin: '4px 0',
    fontSize: 12,
    color: '#000',
  },

  socialLinks: {
    display: 'flex',
    gap: 16,
    marginTop: 8,
  },

  linkBtn: {
    display: 'flex',
    alignItems: 'center',
    padding: 0,
    border: 'none',
    background: 'none',
    color: '#317CFF',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
  },

  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
  },

  sectionTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
    color: '#000',
    marginBottom: 8,
  },

  sectionText: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.6,
    color: '#374151',
  },

  jobsSection: {
    backgroundColor: '#fff',
    marginTop: 10,
    paddingTop: 16,
  },

  tabContainer: {
    display: 'flex',
    borderBottom: '1px solid #e5e7eb',
    padding: '0 16px',
  },

  tab: {
    flex: 1,
    padding: '12px 0',
    border: 'none',
    background: 'none',
    fontSize: 16,
    fontWeight: 500,
    color: '#6b7280',
    cursor: 'pointer',
    borderBottom: '4px solid transparent',
  },

  tabActive: {
    flex: 1,
    padding: '12px 0',
    border: 'none',
    background: 'none',
    fontSize: 16,
    fontWeight: 600,
    color: '#000',
    cursor: 'pointer',
    borderBottom: '4px solid #000',
  },

  jobsList: {
    padding: 16,
    minHeight: 300,
  },

  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 16,
    paddingTop: 60,
  },

  jobCard: {
    backgroundColor: '#FFFFEA',
    border: '1px solid #CECECE',
    borderRadius: 24,
    padding: 20,
    marginBottom: 12,
  },

  jobHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  jobTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 500,
    color: '#000',
    flex: 1,
  },

  jobBudget: {
    fontSize: 14,
    fontWeight: 500,
    color: '#000',
    marginLeft: 12,
  },

  skillsLabel: {
    margin: '12px 0 8px',
    fontSize: 10,
    color: '#6b7280',
  },

  skillsContainer: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 12,
  },

  skillChip: {
    padding: '6px 12px',
    backgroundColor: '#FFFFBE',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 500,
    color: '#000',
  },

  jobDescription: {
    margin: 0,
    fontSize: 12,
    lineHeight: 1.6,
    color: '#374151',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },

  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 1000,
  },

}





