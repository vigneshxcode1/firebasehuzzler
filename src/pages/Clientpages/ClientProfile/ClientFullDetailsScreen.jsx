

// import React, { useEffect, useState, useCallback } from "react";
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
// import {
//   FiArrowLeft,
//   FiShare2,
//   FiFlag,
//   FiMoreHorizontal,
// } from "react-icons/fi";

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
//     navigate(-1);
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
//           <button onClick={blockUser} style={styles.iconBtn}>
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

//         {isAccepted ? (
//           <button style={styles.primary}>Message</button>
//         ) : isRequested ? (
//           <button style={styles.disabled}>Requested</button>
//         ) : (
//           <button style={styles.primary} onClick={sendRequest}>
//             Connect
//           </button>
//         )}
//       </div>

//       {/* ABOUT */}
//       <Section title="About">
//         <p>{profile.about || "No description available"}</p>
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
//     fontFamily: "Inter, sans-serif",
//   },
//   center: {
//     padding: 40,
//     textAlign: "center",
//   },
//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     padding: 16,
//   },
//   iconBtn: {
//     background: "rgba(0,0,0,0.3)",
//     border: "none",
//     borderRadius: "50%",
//     padding: 8,
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
//   avatar: {
//     width: 80,
//     height: 80,
//     borderRadius: 12,
//     objectFit: "cover",
//   },
//   subtitle: {
//     color: "#666",
//     fontSize: 13,
//   },
//   primary: {
//     background: "#FDFD96",
//     border: "none",
//     padding: "10px 24px",
//     borderRadius: 24,
//     fontWeight: 600,
//     cursor: "pointer",
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
//   tabs: {
//     display: "flex",
//     justifyContent: "center",
//     marginTop: 16,
//   },
//   tab: {
//     padding: "10px 20px",
//     border: "none",
//     background: "transparent",
//     cursor: "pointer",
//   },
//   tabActive: {
//     padding: "10px 20px",
//     borderBottom: "3px solid black",
//     fontWeight: 600,
//     background: "transparent",
//   },
//   jobCard: {
//     background: "#fff",
//     margin: "12px 16px",
//     padding: 16,
//     borderRadius: 16,
//   },
//   jobHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//   },
//   price: {
//     fontWeight: 600,
//     marginTop: 6,
//   },
//   desc: {
//     fontSize: 13,
//     marginTop: 6,
//   },
//   chips: {
//     display: "flex",
//     gap: 6,
//     marginTop: 10,
//   },
//   chip: {
//     background: "#FFF7C2",
//     padding: "4px 10px",
//     borderRadius: 14,
//     fontSize: 12,
//   },
// };




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
//    REPORT CONSTANTS
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

//   // ===== Report / Block popup states =====
//   const [showMainPopup, setShowMainPopup] = useState(false);
//   const [showReasonPopup, setShowReasonPopup] = useState(false);
//   const [showConfirmPopup, setShowConfirmPopup] = useState(false);
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

//   const blockUser = async () => {
//     if (!currentUid) return;

//     await addDoc(collection(db, "blocked_users"), {
//       blockedBy: currentUid,
//       blockedUserId: userId,
//       blockedAt: serverTimestamp(),
//     });

//     alert("User blocked");
//     closeAllPopups();
//     navigate(-1);
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
//     closeAllPopups();
//   };

//   const closeAllPopups = () => {
//     setShowMainPopup(false);
//     setShowReasonPopup(false);
//     setShowConfirmPopup(false);
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
//           <button
//             style={styles.iconBtn}
//             onClick={() => setShowMainPopup(true)}
//           >
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

//       {/* MAIN */}
//       {showMainPopup && (
//         <Popup>
//           <h3>Report or block</h3>
//           <p style={styles.sub}>Select an action</p>

//           <PopupItem
//             text={`Block ${fullName}`}
//             onClick={blockUser}
//           />
//           <PopupItem
//             text={`Report ${fullName}`}
//             onClick={() => {
//               setShowMainPopup(false);
//               setShowReasonPopup(true);
//             }}
//           />

//           <button style={styles.cancelBtn} onClick={closeAllPopups}>
//             Cancel
//           </button>
//         </Popup>
//       )}

//       {/* REASONS */}
//       {showReasonPopup && (
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
//                 setShowReasonPopup(false);
//                 setShowMainPopup(true);
//               }}
//             >
//               Back
//             </button>

//             <button
//               style={styles.nextBtn}
//               disabled={!selectedReason}
//               onClick={() => {
//                 setShowReasonPopup(false);
//                 setShowConfirmPopup(true);
//               }}
//             >
//               Next
//             </button>
//           </div>
//         </Popup>
//       )}

//       {/* CONFIRM */}
//       {showConfirmPopup && (
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
//                 setShowConfirmPopup(false);
//                 setShowReasonPopup(true);
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
//     </div>
//   );
// }

// /* ======================================================
//    POPUP COMPONENTS
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
//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     padding: 16,
//   },
//   iconBtn: {
//     background: "rgba(0,0,0,0.3)",
//     border: "none",
//     borderRadius: 20,
//     padding: "6px 10px",
//     color: "#fff",
//     cursor: "pointer",
//     marginLeft: 6,
//   },
//   card: {
//     background: "#fff",
//     margin: 16,
//     padding: 16,
//     borderRadius: 16,
//     textAlign: "center",
//   },
//   avatar: {
//     width: 80,
//     height: 80,
//     borderRadius: 12,
//     objectFit: "cover",
//   },
//   subtitle: { fontSize: 13, color: "#666" },

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
//     display: "flex",
//     justifyContent: "space-between",
//     cursor: "pointer",
//     borderBottom: "1px solid #ddd",
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
//   reasonChip: {
//     padding: "10px 14px",
//     borderRadius: 20,
//     cursor: "pointer",
//     fontSize: 13,
//   },
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



import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// ===== Firebase (assume initialized) =====
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

// ===== Icons =====
import { FiArrowLeft, FiShare2, FiMoreHorizontal } from "react-icons/fi";

/* ======================================================
   REPORT CONSTANTS (FROM ReportBlockPopup.jsx)
====================================================== */
const REPORT_REASONS = [
  "Fraud or scam",
  "Misinformation",
  "Harassment",
  "Threats or violence",
  "Hateful speech",
  "Illegal goods and service",
];

function reasonDescription(reason) {
  switch (reason) {
    case "Fraud or scam":
      return "Illegal activities or scams";
    case "Misinformation":
      return "False or misleading information";
    case "Harassment":
      return "Abusive behavior";
    case "Threats or violence":
      return "Threats or harm";
    case "Hateful speech":
      return "Attacking based on identity";
    default:
      return "Violation of community guidelines";
  }
}

/* ======================================================
   MAIN COMPONENT
====================================================== */
export default function ClientFullDetailScreen() {
  const { userId, jobId } = useParams();
  const navigate = useNavigate();

  const auth = getAuth();
  const db = getFirestore();
  const currentUid = auth.currentUser?.uid;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRequested, setIsRequested] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [activeTab, setActiveTab] = useState("work");

  // 🔥 Report / Block popup states
  const [showMain, setShowMain] = useState(false);
  const [showReasons, setShowReasons] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    if (!userId) return;

    const unsub = onSnapshot(doc(db, "users", userId), snap => {
      if (snap.exists()) setProfile(snap.data());
      setLoading(false);
    });

    return () => unsub();
  }, [db, userId]);

  /* ================= CHECK REQUEST ================= */
  useEffect(() => {
    if (!currentUid || !userId) return;

    async function checkRequest() {
      const q = query(
        collection(db, "collaboration_requests"),
        where("clientId", "==", currentUid),
        where("freelancerId", "==", userId),
        where("status", "==", "sent"),
        ...(jobId ? [where("jobId", "==", jobId)] : [])
      );

      const snap = await getDocs(q);
      setIsRequested(!snap.empty);
    }

    checkRequest();
  }, [db, currentUid, userId, jobId]);

  /* ================= CHECK ACCEPTED ================= */
  useEffect(() => {
    if (!currentUid || !userId || !jobId) return;

    async function checkAccepted() {
      const q = query(
        collection(db, "accepted_jobs"),
        where("clientId", "==", currentUid),
        where("freelancerId", "==", userId),
        where("jobId", "==", jobId)
      );

      const snap = await getDocs(q);
      setIsAccepted(!snap.empty);
    }

    checkAccepted();
  }, [db, currentUid, userId, jobId]);

  /* ================= ACTIONS ================= */
  const shareProfile = async () => {
    const name = `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`;
    const link = profile?.linkedin || window.location.href;

    if (navigator.share) {
      await navigator.share({
        title: name,
        text: `Check out ${name}'s profile`,
        url: link,
      });
    } else {
      alert("Sharing not supported");
    }
  };

  const sendRequest = async () => {
    if (!currentUid) return alert("Login required");

    await addDoc(collection(db, "collaboration_requests"), {
      clientId: currentUid,
      freelancerId: userId,
      jobId: jobId || null,
      status: "sent",
      timestamp: serverTimestamp(),
    });

    setIsRequested(true);
    alert("Request sent");
  };

  const blockUser = async () => {
    if (!currentUid) return;

    await addDoc(collection(db, "blocked_users"), {
      blockedBy: currentUid,
      blockedUserId: userId,
      blockedAt: serverTimestamp(),
    });

    alert("User blocked");
    closeAll();
    navigate(-1);
  };

  const submitReport = async () => {
    if (!currentUid || !selectedReason) return;

    await addDoc(collection(db, "reports"), {
      reportedBy: currentUid,
      reportedUserId: userId,
      reason: selectedReason,
      createdAt: serverTimestamp(),
    });

    alert("Report submitted");
    closeAll();
  };

  const closeAll = () => {
    setShowMain(false);
    setShowReasons(false);
    setShowConfirm(false);
    setSelectedReason(null);
  };

  /* ================= STATES ================= */
  if (loading) return <div style={styles.center}>Loading…</div>;
  if (!profile) return <div style={styles.center}>Profile not found</div>;

  const fullName =
    `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "User";

  /* ================= UI ================= */
  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.iconBtn}>
          <FiArrowLeft />
        </button>

        <div>
          {/* 🔥 UPDATED: Report / Block opens popup */}
          <button onClick={() => setShowMain(true)} style={styles.iconBtn}>
            Report / Block
          </button>

          <button onClick={shareProfile} style={styles.iconBtn}>
            <FiShare2 />
          </button>
        </div>
      </div>

      {/* PROFILE CARD */}
      <div style={styles.card}>
        <img
          src={profile.profileImage || "/assets/profile.png"}
          alt="profile"
          style={styles.avatar}
        />

        <h3>{fullName}</h3>
        <p style={styles.subtitle}>
          {profile.sector || "No Title"} · {profile.location || "India"}
        </p>

        
      </div>

      {/* ================= REPORT / BLOCK POPUPS ================= */}

      {showMain && (
        <Popup>
          <h3>Report or block</h3>
          <p style={styles.sub}>Select an action</p>

          <PopupItem text={`Block ${fullName}`} onClick={blockUser} />
          <PopupItem
            text={`Report ${fullName}`}
            onClick={() => {
              setShowMain(false);
              setShowReasons(true);
            }}
          />

          <button style={styles.cancelBtn} onClick={closeAll}>
            Cancel
          </button>
        </Popup>
      )}

      {showReasons && (
        <Popup big>
          <h3>Report this profile</h3>
          <p style={styles.sub}>Select a reason</p>

          <div style={styles.reasonWrap}>
            {REPORT_REASONS.map(r => (
              <div
                key={r}
                style={{
                  ...styles.reasonChip,
                  background:
                    selectedReason === r ? "#7C3CFF" : "#E6DCFF",
                  color: selectedReason === r ? "#fff" : "#000",
                }}
                onClick={() => setSelectedReason(r)}
              >
                {r}
              </div>
            ))}
          </div>

          <div style={styles.row}>
            <button
              style={styles.backBtn}
              onClick={() => {
                setShowReasons(false);
                setShowMain(true);
              }}
            >
              Back
            </button>

            <button
              style={styles.nextBtn}
              disabled={!selectedReason}
              onClick={() => {
                setShowReasons(false);
                setShowConfirm(true);
              }}
            >
              Next
            </button>
          </div>
        </Popup>
      )}

      {showConfirm && (
        <Popup>
          <h3>Confirm report</h3>

          <div style={styles.confirmBox}>
            <strong>{selectedReason}</strong>
            <p>{reasonDescription(selectedReason)}</p>
          </div>

          <div style={styles.row}>
            <button
              style={styles.backBtn}
              onClick={() => {
                setShowConfirm(false);
                setShowReasons(true);
              }}
            >
              Back
            </button>

            <button style={styles.submitBtn} onClick={submitReport}>
              Submit Report
            </button>
          </div>
        </Popup>
      )}

      {/* ABOUT */}
      <Section title="About">
        <p>{profile.about || "No description available"}</p>
      </Section>

      <Section title="Industry">{profile.sector}</Section>
      <Section title="Category">{profile.category}</Section>
      <Section title="Company Size">{profile.team_size}</Section>
      <Section title="Email">{profile.email}</Section>

      {/* SERVICES */}
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
          24 Hour
        </button>
      </div>

      {activeTab === "work" ? (
        <ServicesList uid={userId} collectionName="jobs" />
      ) : (
        <ServicesList uid={userId} collectionName="jobs_24h" />
      )}
    </div>
  );
}

/* ======================================================
   POPUP HELPERS
====================================================== */
function Popup({ children, big }) {
  return (
    <div style={styles.overlay}>
      <div
        style={{
          ...styles.popup,
          height: big ? "70vh" : "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function PopupItem({ text, onClick }) {
  return (
    <div style={styles.popupItem} onClick={onClick}>
      {text}
      <FiMoreHorizontal />
    </div>
  );
}

/* ======================================================
   SERVICES LIST
====================================================== */
function ServicesList({ uid, collectionName }) {
  const db = getFirestore();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const q = query(collection(db, collectionName), where("userId", "==", uid));
    const unsub = onSnapshot(q, snap => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [db, uid, collectionName]);

  if (!items.length) {
    return <div style={styles.center}>No services available</div>;
  }

  return (
    <div>
      {items.map(job => (
        <div key={job.id} style={styles.jobCard}>
          <div style={styles.jobHeader}>
            <h4>{job.title}</h4>
            <FiMoreHorizontal />
          </div>

          <p style={styles.price}>
            ₹ {job.budget_from || job.budget || 0}
          </p>

          <p style={styles.desc}>{job.description}</p>

          <div style={styles.chips}>
            {[...(job.skills || []), ...(job.tools || [])]
              .slice(0, 3)
              .map((s, i) => (
                <span key={i} style={styles.chip}>
                  {s}
                </span>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ======================================================
   HELPERS
====================================================== */
function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h4>{title}</h4>
      {children}
    </div>
  );
}

/* ======================================================
   STYLES
====================================================== */
const styles = {
  page: {
    maxWidth: 420,
    margin: "0 auto",
    background: "#f6f6f6",
    minHeight: "100vh",
  },
  center: { padding: 40, textAlign: "center" },
  header: { display: "flex", justifyContent: "space-between", padding: 16 },
  iconBtn: {
    background: "rgba(0,0,0,0.3)",
    border: "none",
    borderRadius: 20,
    padding: "6px 10px",
    color: "#fff",
    marginLeft: 6,
    cursor: "pointer",
  },
  card: {
    background: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 16,
    textAlign: "center",
  },
  avatar: { width: 80, height: 80, borderRadius: 12, objectFit: "cover" },
  subtitle: { fontSize: 13, color: "#666" },
  primary: {
    background: "#FDFD96",
    border: "none",
    padding: "10px 24px",
    borderRadius: 24,
    fontWeight: 600,
  },
  disabled: {
    background: "#ddd",
    border: "none",
    padding: "10px 24px",
    borderRadius: 24,
  },
  section: {
    background: "#fff",
    margin: "12px 16px",
    padding: 16,
    borderRadius: 16,
  },
  tabs: { display: "flex", justifyContent: "center", marginTop: 16 },
  tab: { padding: "10px 20px", background: "transparent", border: "none" },
  tabActive: {
    padding: "10px 20px",
    borderBottom: "3px solid black",
    fontWeight: 600,
  },
  jobCard: {
    background: "#fff",
    margin: "12px 16px",
    padding: 16,
    borderRadius: 16,
  },
  jobHeader: { display: "flex", justifyContent: "space-between" },
  price: { fontWeight: 600, marginTop: 6 },
  desc: { fontSize: 13, marginTop: 6 },
  chips: { display: "flex", gap: 6, marginTop: 10 },
  chip: {
    background: "#FFF7C2",
    padding: "4px 10px",
    borderRadius: 14,
    fontSize: 12,
  },

  /* popup */
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    zIndex: 999,
  },
  popup: {
    background: "#FFFDE7",
    width: "100%",
    maxWidth: 420,
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  popupItem: {
    padding: "14px 0",
    borderBottom: "1px solid #ddd",
    display: "flex",
    justifyContent: "space-between",
    cursor: "pointer",
  },
  cancelBtn: {
    width: "100%",
    padding: 12,
    borderRadius: 24,
    border: "1px solid #000",
    background: "transparent",
    marginTop: 16,
  },
  sub: { fontSize: 14, color: "#666", marginBottom: 12 },
  reasonWrap: { display: "flex", flexWrap: "wrap", gap: 10 },
  reasonChip: { padding: "10px 14px", borderRadius: 20, cursor: "pointer" },
  row: { display: "flex", gap: 12, marginTop: 20 },
  backBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 24,
    border: "1px solid #000",
    background: "transparent",
  },
  nextBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 24,
    background: "#7C3CFF",
    color: "#fff",
    border: "none",
  },
  confirmBox: {
    background: "#E6DCFF",
    padding: 14,
    borderRadius: 16,
    marginTop: 16,
  },
  submitBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 24,
    background: "#7C3CFF",
    color: "#fff",
    border: "none",
  },
};
