// import React, { useEffect, useState, useMemo, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   collection,
//   query,
//   where,
//   onSnapshot,
//   doc,
//   setDoc,
//   deleteDoc,
//   updateDoc,
//   serverTimestamp,
// } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import backarrow from "../../assets/backarrow.png"
// // 🔹 KEEP YOUR FIREBASE PATH (unchanged)
// import { db } from "../../firbase/Firebase";
// import emptyWorks from "../../assets/job.png";   // dummy image
// import empty24 from "../../assets/job24.png";        // dummy image

// // ----------------- Styles (based on ServiceScreenOne) -----------------
// const styles = {
//   page: {
//     backgroundColor: "#FFFFFF",
//     minHeight: "100vh",
//     fontFamily:
//       "'Rubik', Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     paddingTop: 32,
//     paddingBottom: 80,
//     color: "#111827",
//   },
//   headerRowWrap: {
//     width: 928,
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     marginLeft: 32,
//     marginTop: 0,
//   },
//   backbtn: {
//     width: "36px",
//     height: "36px",
//     borderRadius: "14px",
//     border: "0.8px solid #ccc",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     cursor: "pointer",
//     fontSize: "20px",
//     opacity: 1,
//     flexShrink: 0,
//     marginBottom: "18px",
//   },
//   headerTextBlock: { display: "flex", flexDirection: "column", marginLeft: 4 },
//   headerTitle: { fontWeight: 700, fontSize: "28px", lineHeight: "32px" },
//   headerSubtitle: { fontSize: 13, marginTop: 8, color: "#6B7280",marginLeft:"-50px" },

//   toggleBarWrapper: {
//     width: 928,
//     height: 52,
//     borderRadius: 16,
//     padding: 6,
//     display: "flex",
//     alignItems: "center",
//     marginTop: 18,
//     marginLeft: 32,
//     backgroundColor: "#FFF8E1",
//     boxSizing: "border-box",
//     boxShadow: "0 2px 8px rgba(16,24,40,0.04)",
// marginBottom: 6, 
//   },
//   toggleGroup: {
//     width: 335.587,
//     height: 36,
//     display: "flex",
//     gap: 6,
//     borderRadius: 14,
//     alignItems: "center",
//     padding: 4,
//     backgroundColor: "transparent",
//   },
//   toggleButton: (active) => ({
//     width: 165.793,
//     height: 36,
//     borderRadius: 12,
//     padding: "0 18px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: active ? "#FFFFFF" : "#FFF8E1",
//     fontSize: 14,
//     fontWeight: 600,
//     cursor: "pointer",
//     boxShadow: active ? "0 4px 10px rgba(124,60,255,0.06)" : "none",
//   }),

//   searchSortRow: {
//     width: 928,
//     display: "flex",
//     gap: 12,
//     alignItems: "center",
//     marginTop: 16,
//     marginLeft: 32,
//     paddingRight: 32,
//     boxSizing: "border-box",
//   },
//   searchContainer: {
//     flex: 1,
//     height: 44,
//     borderRadius: 14,
//     border: "1px solid #DADADA",
//      borderTop: "1.2px solid #D0D0D0",
//     paddingLeft: 14,
//     paddingRight: 14,
//     display: "flex",
//     alignItems: "center",
//     backgroundColor: "#FFF",
//     boxSizing: "border-box",
//        // ⭐ Slight shadow for better visibility
//     boxShadow: "0px 1px 3px rgba(0,0,0,0.06)",
//   },
//   searchIcon: { fontSize: 18, color: "#757575" },
//   searchInput: { border: "none", outline: "none", flex: 1, marginLeft: 10, fontSize: 14 ,marginTop:15,},

//   sortButtonWrapper: { display: "flex", alignItems: "center", cursor: "pointer", gap: 8, position: "relative" },
//   sortBtnBox: {
//     minWidth: 90,
//     height: 40,
//     borderRadius: 12,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     border: "1px solid #E0E0E0",
//     background: "#FFF",
//     cursor: "pointer",
//     fontWeight: 600,
//   },
//   sortMenu: {
//     position: "absolute",
//     top: 48,
//     right: 0,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 12,
//     boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
//     padding: "8px 8px",
//     minWidth: 180,
//     zIndex: 90,
//   },
//   sortMenuItem: { padding: "8px 12px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 },

//   // cards / grid
//   cardsWrap: { width: 928, marginTop: 24, marginLeft: 32, display: "grid", gridTemplateColumns: "repeat(2, 446px)", gap: "24px 24px" },
//   card: {
//     width: 446,
//     minHeight: 220,
//     borderRadius: 24,
//     borderWidth: 0.8,
//     borderStyle: "solid",
//     borderColor: "#DADADA",
//     backgroundColor: "#FFFFFF",
//     padding: 20,
//     boxSizing: "border-box",
//     boxShadow: "0 8px 20px rgba(16,24,40,0.04)",
//     cursor: "pointer",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "space-between",
//     position: "relative",
//     overflow: "hidden",
//   },
//   cardArrow: { width: 16, height: 16, position: "absolute", top: 20, right: 20, objectFit: "contain", opacity: 0.95 },
//   jobCardRowTop: { display: "flex", alignItems: "flex-start" },
//   avatarBox: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: 14,
//     background: "linear-gradient(135deg, #51A2FF 0%, #9B42FF 60%, #AD46FF 100%)",
//     color: "#FFFFFF",
//     fontWeight: 700,
//     flexShrink: 0,
//   },
//   jobTitle: { fontWeight: 800, marginBottom: 4, fontSize: 18, textTransform: "uppercase" },
//   skillsRowWrapper: { marginTop: 4, height: 32, overflowX: "auto", display: "flex", alignItems: "center" },
//   skillChip: {
//     display: "inline-flex",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: "4px 12px",
//     marginRight: 8,
//     borderRadius: 20,
//     backgroundColor: "rgba(255, 255, 190, 1)",
//     fontSize: 14,
//     fontWeight: 400,
//     whiteSpace: "nowrap",
//     color: "#000",
//   },
//   moreChip: { padding: "4px 12px", borderRadius: 20, backgroundColor: "rgba(255, 255, 190, 1)", fontSize: 11, fontWeight: 600 },

//   jobInfoRow: { marginTop: 12, display: "flex", justifyContent: "space-between", gap: 12 },
//   label: { fontSize: 13, fontWeight: 400, color: "#6B7280" },
//   value: { marginTop: 4, fontSize: 14, fontWeight: 700 },
//   valueHighlight: { color: "rgba(124, 60, 255, 1)" },

//   buttonRow: { marginTop: 14, display: "flex", gap: 12 },
//   secondaryBtn: {
//     flex: 1,
//     height: 40,
//     borderRadius: 30,
//     border: "1px solid #BDBDBD",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: 13,
//     fontWeight: 600,
//     backgroundColor: "#FFFFFF",
//     cursor: "pointer",
//   },
//   primaryBtn: {
//     flex: 1,
//     height: 40,
//     borderRadius: 30,
//     border: "none",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: 13,
//     fontWeight: 700,
//     backgroundColor: "rgba(253, 253, 150, 1)",
//     cursor: "pointer",
//   },

//   emptyStateWrapper: { marginTop: 40, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingLeft: 32, paddingRight: 32 },
//   emptyImagePlaceholder: { width: 140, height: 180, borderRadius: 16, backgroundColor: "#FFF9C4", marginBottom: 16 },
//   emptyTitle: { fontWeight: 500, fontSize: 15, marginBottom: 6 },

//   fab: {
//     position: "fixed",
//     right: 32,
//     bottom: 32,
//     width: 64,
//     height: 64,
//     borderRadius: 9999,
//     backgroundColor: "rgba(124, 60, 255, 1)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     color: "#FFFFFF",
//     fontSize: 32,
//     border: "none",
//     cursor: "pointer",
//     boxShadow: "0 8px 16px rgba(124, 60, 255, 0.4)",
//     zIndex: 20,
//   },
// };

// // ----------------- Keep original hashCode helper (unchanged) -----------------
// if (!String.prototype.hashCode) {
//   // eslint-disable-next-line no-extend-native
//   String.prototype.hashCode = function () {
//     let hash = 0;
//     for (let i = 0; i < this.length; i++) {
//       hash = (hash << 5) - hash + this.charCodeAt(i);
//       hash |= 0;
//     }
//     return hash;
//   };
// }

// // ----------------- KEEP UTILITY FUNCTIONS (unchanged) -----------------
// function formatBudget(value) {
//   if (value == null) return "0";
//   const num = Number(value) || 0;
//   if (num >= 100000) return (num / 100000).toFixed(1) + "L";
//   if (num >= 1000) return (num / 1000).toFixed(1) + "k";
//   return String(num);
// }

// function getInitialsFromTitle(title) {
//   if (!title) return "";
//   const words = title.trim().split(" ");
//   if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
//   return words[0][0].toUpperCase();
// }

// // ----------------- MAIN COMPONENT (logic preserved) -----------------
// export default function AddJobScreen() {
//   const navigate = useNavigate();
//   const auth = getAuth();
//   const currentUser = auth.currentUser;

//   // Original state from your AddJobScreen (preserved)
//   const [selectedTab, setSelectedTab] = useState("Works"); // "Works" | "24 hour"
//   const [sortType, setSortType] = useState("Newest"); // "Newest" | "Paused" | "Budget High" | "Budget Low"
//   const [searchText, setSearchText] = useState("");

//   const [worksJobs, setWorksJobs] = useState([]);
//   const [jobs24h, setJobs24h] = useState([]);
//   const [loadingWorks, setLoadingWorks] = useState(true);
//   const [loading24h, setLoading24h] = useState(true);

//   const [showSortModal, setShowSortModal] = useState(false);

//   const [pausedWorksJobs, setPausedWorksJobs] = useState([]);
//   const [paused24hJobs, setPaused24hJobs] = useState([]);

//   // ---------------- FIREBASE SUBSCRIPTIONS (exactly as before) ---------------- //
//   useEffect(() => {
//     if (!currentUser) return;

//     // Works jobs
//     const qWorks = query(collection(db, "jobs"), where("userId", "==", currentUser.uid));

//     const unsubPausedWorks = onSnapshot(
//       query(collection(db, "pausedJobs"), where("userId", "==", currentUser.uid), where("is24", "==", false)),
//       (snapshot) => setPausedWorksJobs(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
//     );
//     const unsubPaused24h = onSnapshot(
//       query(collection(db, "pausedJobs"), where("userId", "==", currentUser.uid), where("is24", "==", true)),
//       (snapshot) => setPaused24hJobs(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
//     );

//     const unsubWorks = onSnapshot(
//       qWorks,
//       (snapshot) => {
//         const items = snapshot.docs.map((docSnap) => ({
//           id: docSnap.id,
//           ...docSnap.data(),
//         }));
//         setWorksJobs(items);
//         setLoadingWorks(false);
//       },
//       (err) => {
//         console.error("Error fetching jobs:", err);
//         setLoadingWorks(false);
//       }
//     );

//     // 24h jobs
//     const q24h = query(collection(db, "jobs_24h"), where("userId", "==", currentUser.uid));

//     const unsub24h = onSnapshot(
//       q24h,
//       (snapshot) => {
//         const items = snapshot.docs.map((docSnap) => ({
//           id: docSnap.id,
//           ...docSnap.data(),
//         }));
//         setJobs24h(items);
//         setLoading24h(false);
//       },
//       (err) => {
//         console.error("Error fetching 24h jobs:", err);
//         setLoading24h(false);
//       }
//     );

//     return () => {
//       try {
//         unsubWorks && unsubWorks();
//         unsub24h && unsub24h();
//         unsubPausedWorks && unsubPausedWorks();
//         unsubPaused24h && unsubPaused24h();
//       } catch (e) {
//         // ignore if already unsubscribed
//       }
//     };
//   }, [currentUser, db]);

//   // ---------------- FILTER + SORT LOGIC (preserved) ---------------- //
//   const applyFilters = (jobs, is24h = false) => {
//     let data = [...jobs];

//     // Paused filter
//     if (sortType === "Paused") {
//       // Fetch paused jobs from pausedJobs collection instead of active jobs
//       return is24h ? paused24hJobs : pausedWorksJobs;
//     }

//     // Search
//     if (searchText.trim()) {
//       const q = searchText.trim().toLowerCase();
//       data = data.filter((job) => {
//         const title = (job.title || "").toLowerCase();
//         const skills = (job.skills || []).join(" ").toLowerCase();
//         const tools = (job.tools || []).join(" ").toLowerCase();
//         return title.includes(q) || skills.includes(q) || tools.includes(q);
//       });
//     }

//     // Sort
//     if (sortType === "Newest") {
//       data.sort(
//         (a, b) =>
//           (b.created_at?.seconds || b.created_at || 0) -
//           (a.created_at?.seconds || a.created_at || 0)
//       );
//     } else if (sortType === "Budget High") {
//       data.sort(
//         (a, b) =>
//           Number(b.budget_to || b.budget || 0) -
//           Number(a.budget_to || a.budget || 0)
//       );
//     } else if (sortType === "Budget Low") {
//       data.sort(
//         (a, b) =>
//           Number(a.budget_from || a.budget || 0) -
//           Number(b.budget_from || b.budget || 0)
//       );
//     }

//     return data;
//   };

//   const filteredWorksJobs = useMemo(() => applyFilters(worksJobs), [worksJobs, searchText, sortType, pausedWorksJobs, paused24hJobs]);

//   const filtered24hJobs = useMemo(() => applyFilters(jobs24h, true), [jobs24h, searchText, sortType, pausedWorksJobs, paused24hJobs]);

//   // ---------------- EVENT HANDLERS (preserved) ---------------- //
//   const handlePauseWorksJob = async (job) => {
//     try {
//       if (!job.id) return;
//       await setDoc(doc(db, "pausedJobs", job.id), {
//         ...job,
//         is24: false,
//       });
//       await deleteDoc(doc(db, "jobs", job.id));
//       alert("Service paused");
//     } catch (err) {
//       console.error("Pause job error:", err);
//       alert("Something went wrong while pausing the service.");
//     }
//   };

//   const handlePause24hJob = async (job) => {
//     try {
//       if (!job.id) return;
//       await setDoc(doc(db, "pausedJobs", job.id), {
//         ...job,
//         is24: true,
//       });
//       await deleteDoc(doc(db, "jobs_24h", job.id));
//       alert("Job paused");
//     } catch (err) {
//       console.error("Pause 24h job error:", err);
//       alert("Something went wrong while pausing the 24h job.");
//     }
//   };

//   const handleEditWorksJob = (job) => {
//     // 🔹 Update route to your edit job screen (preserved)
//     navigate("/client-dashbroad2/clienteditjob", { state: { jobData: job } });
//   };

//   const handleEdit24hJob = (job) => {
//     // 🔹 Update route to your edit 24h job screen (preserved)
//     navigate("/client-dashbroad2/clientedit24jobs", {
//       state: { jobId: job.id, jobData: job },
//     });
//   };

//   const handleOpenPostJob = () => {
//     // 🔹 Update route to your "Post Job" screen (preserved)
//     navigate("/client-dashbroad2/PostJob", { state: { jobData: {} } });
//   };

//   const handleOpenAdd24hJob = () => {
//     // 🔹 Update route to your "Add 24 Hours" screen (preserved)
//     navigate("/client-dashbroad2/PostJob");
//   };

//   const handleOpenJobDetail = (job) => {
//  console.log("Job ID:", job.id); // debug to confirm
//    navigate(`/client-dashbroad2/job-full/${job.id}`);
//   };

//     const handleOpen24JobDetail = (job) => {
//  console.log("Job ID:", job.id); // debug to confirm
//    navigate(`/client-dashbroad2/job-full24/${job.id}`);
//   };

//   // ---------------- RENDER HELPERS (adapted to card UI) ---------------- //
//   const renderSortOption = (label) => {
//     const isActive = sortType === label;
//     return (
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           padding: "8px 10px",
//           cursor: "pointer",
//         }}
//         onClick={() => {
//           setSortType(label);
//           setShowSortModal(false);
//         }}
//       >
//         <span
//           style={{
//             width: 16,
//             height: 16,
//             borderRadius: "50%",
//             border: `2px solid ${isActive ? "#7C3CFF" : "#D1D5DB"}`,
//             display: "inline-block",
//             marginRight: 10,
//             boxSizing: "border-box",
//             background: isActive ? "#7C3CFF" : "transparent",
//           }}
//         />
//         <span style={{ fontWeight: 700 }}>{label}</span>
//       </div>
//     );
//   };


//   const renderEmptyState = (title, subtitle, action, actionLabel, type) => {
//   const image = type === "works" ? emptyWorks : empty24;

//   return (
//     <div
//       style={{
//         width: "100%",
//         padding: "40px 20px",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         textAlign: "center",
//         fontFamily: "Rubik",
//         marginLeft:"150px",
//         fontSize:"20px",
//         fontWeight:500,
//       }}
//     >
//       <img
//         src={image}
//         alt="empty"
//         style={{
//           width: 180,
//           height: "auto",
//           marginBottom: 20,
//           opacity: 0.9,
//         }}
//       />

//       <div style={{ fontSize: 16, fontWeight: 500 }}>{title}</div>

//       <div
//         style={{
//           fontSize: 15,
//           opacity: 0.6,
//           marginTop: 10,
//           maxWidth: 320,
//         }}
//       >
//         {subtitle}
//       </div>

//       <button
//         onClick={action}
//         style={{
//           marginTop: 25,
//           padding: "12px 22px",
//           background: "rgba(253, 253, 150, 1)",
//           border: "none",
//           color: "#000",
//           borderRadius: 50,
//           fontSize: 20,
//           fontWeight:500,
//           cursor: "pointer",
//           fontFamily: "Rubik",
//           width:"195px",
         
//         }}
//       >
//         {actionLabel}
//       </button>
//     </div>
//   );
// };


//   const chipBgColors = ["#FFCCBC", "#B3E5FC", "#E1BEE7", "#C8E6C9"];

//   const renderLimitedChips = (items) => {
//     const flat = (items || []).map((x) => String(x));
//     const limit = 2;
//     const visible = flat.slice(0, limit);
//     const hidden = flat.slice(limit);

//     return (
//       <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
//         {visible.map((text, idx) => {
//           const color = chipBgColors[Math.abs(text.hashCode?.() || text.length) % chipBgColors.length] || chipBgColors[idx % chipBgColors.length];
//           return (
//             <div key={idx} style={{ padding: "6px 10px", borderRadius: 999, fontWeight: 700, fontSize: 12, backgroundColor: color }}>
//               {text}
//             </div>
//           );
//         })}
//         {hidden.length > 0 && <div style={{ padding: "6px 10px", borderRadius: 999, backgroundColor: "#e0e0e0" }}>+{hidden.length}</div>}
//       </div>
//     );
//   };

//   // ---------------- CARD RENDERS (ui only, logic preserved) ----------------
//   const renderWorksJobCard = (job) => {
//     return (
//       <div key={job.id} style={styles.card} onClick={() => handleOpenJobDetail(job)}>
//         <div style={{ position: "absolute", top: 18, right: 18, color: "#9CA3AF" }}>{">"}</div>
//         <div style={styles.jobCardRowTop}>
//           <div style={{ ...styles.avatarBox, width: 56, height: 56, fontSize: 20 }}>
//             {(job.title || "JA").substring(0, 2).toUpperCase()}
//           </div>
//           <div style={{ flex: 1, marginLeft: 12 }}>
//             <div style={{ ...styles.jobTitle, fontSize: 16 }}>{job.title || "Title"}</div>
//             <div style={styles.skillsRowWrapper}>
//               {Array.isArray(job.skills) && job.skills.slice(0, 2).map((s, i) => <div key={i} style={styles.skillChip}>{s}</div>)}
//               {job.skills?.length > 2 && <div style={styles.moreChip}>+{job.skills.length - 2}</div>}
//             </div>
//           </div>
//         </div>

//         <div style={styles.jobInfoRow}>
//           <div>
//             <div style={styles.label}>Budget</div>
//             <div style={{ ...styles.value, ...styles.valueHighlight }}>₹{job.budget_from || job.budget_to || 0}</div>
//           </div>
//           <div>
//             <div style={styles.label}>Timeline</div>
//             <div style={styles.value}>{job.timeline || "N/A"}</div>
//           </div>
//           <div>
//             <div style={styles.label}>Location</div>
//             <div style={styles.value}>Remote</div>
//           </div>
//         </div>

//         <div style={styles.buttonRow}>
//           <button
//             style={styles.secondaryBtn}
//             onClick={(e) => {
//               e.stopPropagation();
//               handlePauseWorksJob(job);
//             }}
//           >
//             Pause Service
//           </button>
//           <button
//             style={styles.primaryBtn}
//             onClick={(e) => {
//               e.stopPropagation();
//               handleEditWorksJob(job);
//             }}
//           >
//             Edit Service
//           </button>
//         </div>
//       </div>
//     );
//   };

//   const render24hJobCard = (job) => {
//     return (
//       <div key={job.id} style={styles.card} onClick={() => handleOpen24JobDetail (job)}>
//         <div style={{ position: "absolute", top: 18, right: 18, color: "#9CA3AF" }}>{">"}</div>
//         <div style={styles.jobCardRowTop}>
//           <div style={{ ...styles.avatarBox, width: 56, height: 56, fontSize: 20 }}>
//             {(job.title || "JA").substring(0, 2).toUpperCase()}
//           </div>
//           <div style={{ flex: 1, marginLeft: 12 }}>
//             <div style={{ ...styles.jobTitle, fontSize: 16 }}>{job.title || "Title"}</div>
//             <div style={styles.skillsRowWrapper}>
//               {Array.isArray(job.skills) && job.skills.slice(0, 2).map((s, i) => <div key={i} style={styles.skillChip}>{s}</div>)}
//               {job.skills?.length > 2 && <div style={styles.moreChip}>+{job.skills.length - 2}</div>}
//             </div>
//           </div>
//         </div>

//         <div style={styles.jobInfoRow}>
//           <div>
//             <div style={styles.label}>Budget</div>
//             <div style={{ ...styles.value, ...styles.valueHighlight }}>₹{job.budget || 0}</div>
//           </div>
//           <div>
//             <div style={styles.label}>Timeline</div>
//             <div style={styles.value}>24 hours</div>
//           </div>
//           <div>
//             <div style={styles.label}>Location</div>
//             <div style={styles.value}>Remote</div>
//           </div>
//         </div>

//         <div style={styles.buttonRow}>
//           <button
//             style={styles.secondaryBtn}
//             onClick={(e) => {
//               e.stopPropagation();
//               handlePause24hJob(job);
//             }}
//           >
//             Pause Service
//           </button>
//           <button
//             style={styles.primaryBtn}
//             onClick={(e) => {
//               e.stopPropagation();
//               handleEdit24hJob(job);
//             }}
//           >
//             Edit Service
//           </button>
//         </div>
//       </div>
//     );
//   };






//   // ---------------- MAIN RENDER ----------------
// const isWorksTab = selectedTab === "Works";
// const is24hTab =
//   selectedTab === "24 hour" ||
//   selectedTab === "24h" ||
//   selectedTab === "24 Hours";

// const listContent = (() => {
//   if (isWorksTab) {
//     if (loadingWorks) {
//       return <div style={{ marginTop: 40 }}>Loading...</div>;
//     }
//     if (!filteredWorksJobs.length) {
//       return renderEmptyState(
//         "All set – just add your first job!",
//         "Post a job with clear details to find top freelancers who can bring your vision to life.",
//         handleOpenPostJob,
//         "Post a Job",
//         "works" // <-- dummy PNG for works
//       );
//     }
//     return filteredWorksJobs.map((job) => renderWorksJobCard(job));
//   }

//   if (loading24h) {
//     return <div style={{ marginTop: 40 }}>Loading...</div>;
//   }
//   if (!filtered24hJobs.length) {
//     return renderEmptyState(
//       "All set – just add your first 24h job!",
//       "Post a job with clear details to find top freelancers who can bring your vision to life.",
//       handleOpenAdd24hJob,
//       "Post a Job",
//       "24h" // <-- dummy PNG for 24h
//     );
//   }

//   return filtered24hJobs.map((job) => render24hJobCard(job));
// })();

//   // ----------------- Sort modal & search handlers (kept for parity) -----------------
//   const sortRef = useRef(null);

//   useEffect(() => {
//     const outside = (e) => {
//       if (sortRef.current && !sortRef.current.contains(e.target)) setShowSortModal(false);
//     };
//     if (showSortModal) document.addEventListener("mousedown", outside);
//     return () => document.removeEventListener("mousedown", outside);
//   }, [showSortModal]);

//   // ---------------- Render ----------------
//   return (
//     <div style={styles.page}>
//       <div style={styles.headerRowWrap}>
//         <div style={styles.backbtn} onClick={() => navigate(-1)} aria-label="Back">
//           <img src={backarrow} alt="back arrow" height={20}/>
//         </div>
//         <div style={styles.headerTextBlock}>
//           <div style={styles.headerTitle}>job proposal</div>
//           <div style={styles.headerSubtitle}>Turn your ideas into action — post your job today.</div>
//         </div>
//       </div>

//       <div style={styles.toggleBarWrapper}>
//         <div style={styles.toggleGroup}>
//           <div
//             role="button"
//             tabIndex={0}
//             onClick={() => setSelectedTab("Works")}
//             style={styles.toggleButton(selectedTab === "Works")}
//           >
//             Works
//           </div>
//           <div
//             role="button"
//             tabIndex={0}
//             onClick={() => setSelectedTab("24 Hours")}
//             style={styles.toggleButton(selectedTab === "24 Hours" || selectedTab === "24h")}
//           >
//             24 Hours
//           </div>
//         </div>
//       </div>

//       <div style={styles.searchSortRow}>
//         <div style={styles.searchContainer}>
//           <span style={styles.searchIcon}>🔍</span>
//           <input
//             style={styles.searchInput}
//             placeholder="Search"
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//           />
//         </div>

//         <div style={styles.sortButtonWrapper} ref={sortRef}>
//           <div style={styles.sortBtnBox} onClick={() => setShowSortModal((s) => !s)}>
//             Sort
//           </div>
//           {showSortModal && <div style={styles.sortMenu}>
//             {renderSortOption("Newest")}
//             {renderSortOption("Paused")}
//             {renderSortOption("Budget High")}
//             {renderSortOption("Budget Low")}
//           </div>}
//         </div>
//       </div>

//       <div style={styles.cardsWrap}>{listContent}</div>

//       <button
//         style={styles.fab}
//         onClick={isWorksTab ? handleOpenPostJob : handleOpenAdd24hJob}
//         aria-label="Add"
//       >
//         +
//       </button>
//     </div>
//   );
// }




// frontend/src/firebaseClientScreen/Postjob/AddJobScreen.jsx

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import backarrow from "../../assets/backarrow.png";
// 🔹 KEEP YOUR FIREBASE PATH (unchanged)
import { db } from "../../firbase/Firebase";
import emptyWorks from "../../assets/job.png"; // dummy image
import empty24 from "../../assets/job24.png"; // dummy image
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(
    window.innerWidth < 1024
  );

  React.useEffect(() => {
    const resize = () =>
      setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return isMobile;
}

// ----------------- Styles (based on ServiceScreenOne) -----------------
const styles = {
  page: {
    backgroundColor: "#FFFFFF",
    minHeight: "100vh",
    fontFamily:
      "'Rubik', Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 80,
    color: "#111827",
     overflowX: "hidden",
  },
  headerRowWrap: {
    width: 928,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: 32,
    marginTop: 0,
      maxWidth: 928, 
  },
  backbtn: {
    width: "36px",
    height: "36px",
    borderRadius: "14px",
    border: "0.8px solid #ccc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "20px",
    opacity: 1,
    flexShrink: 0,
    marginBottom: "18px",
  },
  headerTextBlock: { display: "flex", flexDirection: "column", marginLeft: 4 },
  headerTitle: { fontWeight: 700, fontSize: "28px", lineHeight: "32px" },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 8,
    color: "#6B7280",
    marginLeft: "-50px",
  },

  toggleBarWrapper: {
    width: 928,
    height: 52,
    borderRadius: 16,
    padding: 6,
    display: "flex",
       maxWidth: 928, // ✅ FIX
    alignItems: "center",
    marginTop: 18,
    marginLeft: 32,
    backgroundColor: "#FFF8E1",
    boxSizing: "border-box",
    boxShadow: "0 2px 8px rgba(16,24,40,0.04)",
    marginBottom: 6,
  },
  toggleGroup: {
    width: 335.587,
    height: 36,
    display: "flex",
    gap: 6,
    borderRadius: 14,
    alignItems: "center",
    padding: 4,
    backgroundColor: "transparent",
  },
  toggleButton: (active) => ({
    width: 165.793,
    height: 36,
    borderRadius: 12,
    padding: "0 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: active ? "#FFFFFF" : "#FFF8E1",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: active ? "0 4px 10px rgba(124,60,255,0.06)" : "none",
  }),

  searchSortRow: {
    width: 928,
    display: "flex",
    gap: 12,
    alignItems: "center",
    marginTop: 16,
    marginLeft: 32,
    paddingRight: 32,
    boxSizing: "border-box",
      maxWidth: 928,
  },
  searchContainer: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    border: "1px solid #DADADA",
    borderTop: "1.2px solid #D0D0D0",
    paddingLeft: 14,
    paddingRight: 14,
    display: "flex",
    alignItems: "center",
    backgroundColor: "#FFF",
    boxSizing: "border-box",
    boxShadow: "0px 1px 3px rgba(0,0,0,0.06)", // ⭐ Slight shadow for better visibility
  },
  searchIcon: { fontSize: 18, color: "#757575" },
  searchInput: {
    border: "none",
    outline: "none",
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    marginTop: 15,
  },

  sortButtonWrapper: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    gap: 8,
    position: "relative",
  },
  sortBtnBox: {
    minWidth: 90,
    height: 40,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #E0E0E0",
    background: "#FFF",
    cursor: "pointer",
    fontWeight: 600,
  },
  sortMenu: {
    position: "absolute",
    top: 48,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    padding: "8px 8px",
    minWidth: 180,
    zIndex: 90,
  },
  sortMenuItem: {
    padding: "8px 12px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
    fontSize: 14,
  },

  // cards / grid
 cardsWrap: {
    width: "100%", // ✅ FIX
    maxWidth: 928, // ✅ FIX
    marginTop: 24,
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))", // ✅ FIX
    gap: 24,
    boxSizing: "border-box",
  },
  card: {
    width:"100%",
        maxWidth: 446,
    minHeight: 220,
    borderRadius: 24,
    borderWidth: 0.8,
    borderStyle: "solid",
    borderColor: "#DADADA",
    backgroundColor: "#FFFFFF",
    padding: 20,
    boxSizing: "border-box",
    boxShadow: "0 8px 20px rgba(16,24,40,0.04)",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    overflow: "hidden",
  },
  cardArrow: {
    width: 16,
    height: 16,
    position: "absolute",
    top: 20,
    right: 20,
    objectFit: "contain",
    opacity: 0.95,
  },
  jobCardRowTop: { display: "flex", alignItems: "flex-start" },
  avatarBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    background:
      "linear-gradient(135deg, #51A2FF 0%, #9B42FF 60%, #AD46FF 100%)",
    color: "#FFFFFF",
    fontWeight: 700,
    flexShrink: 0,
  },
  jobTitle: {
    fontWeight: 800,
    marginBottom: 4,
    fontSize: 18,
    textTransform: "uppercase",
  },
  skillsRowWrapper: {
    marginTop: 4,
    height: 32,
    overflowX: "auto",
    display: "flex",
    alignItems: "center",
  },
  skillChip: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px 12px",
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 190, 1)",
    fontSize: 14,
    fontWeight: 400,
    whiteSpace: "nowrap",
    color: "#000",
  },
  moreChip: {
    padding: "4px 12px",
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 190, 1)",
    fontSize: 11,
    fontWeight: 600,
  },

  jobInfoRow: {
    marginTop: 12,
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
  },
  label: { fontSize: 13, fontWeight: 400, color: "#6B7280" },
  value: { marginTop: 4, fontSize: 14, fontWeight: 700 },
  valueHighlight: { color: "rgba(124, 60, 255, 1)" },

  buttonRow: { marginTop: 14, display: "flex", gap: 12 },
  secondaryBtn: {
    flex: 1,
    height: 40,
    borderRadius: 30,
    border: "1px solid #BDBDBD",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 600,
    backgroundColor: "#FFFFFF",
    cursor: "pointer",
  },
  primaryBtn: {
    flex: 1,
    height: 40,
    borderRadius: 30,
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 700,
    backgroundColor: "rgba(253, 253, 150, 1)",
    cursor: "pointer",
  },

  emptyStateWrapper: {
    marginTop: 40,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    paddingLeft: 32,
    paddingRight: 32,
  },
  emptyImagePlaceholder: {
    width: 140,
    height: 180,
    borderRadius: 16,
    backgroundColor: "#FFF9C4",
    marginBottom: 16,
  },
  emptyTitle: { fontWeight: 500, fontSize: 15, marginBottom: 6 },

  fab: {
    position: "fixed",
    right: 32,
    bottom: 32,
    width: 64,
    height: 64,
    borderRadius: 9999,
    backgroundColor: "rgba(124, 60, 255, 1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#FFFFFF",
    fontSize: 32,
    border: "none",
    cursor: "pointer",
    boxShadow: "0 8px 16px rgba(124, 60, 255, 0.4)",
    zIndex: 20,
  },
};

// ----------------- Keep original hashCode helper (unchanged) -----------------
if (!String.prototype.hashCode) {
  // eslint-disable-next-line no-extend-native
  String.prototype.hashCode = function () {
    let hash = 0;
    for (let i = 0; i < this.length; i++) {
      hash = (hash << 5) - hash + this.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  };
}

// ----------------- KEEP UTILITY FUNCTIONS (unchanged) -----------------
function formatBudget(value) {
  if (value == null) return "0";
  const num = Number(value) || 0;
  if (num >= 100000) return (num / 100000).toFixed(1) + "L";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return String(num);
}

function getInitialsFromTitle(title) {
  if (!title) return "";
  const words = title.trim().split(" ");
  if (words.length > 1)
    return (words[0][0] + words[1][0]).toUpperCase();
  return words[0][0].toUpperCase();
}

// ----------------- MAIN COMPONENT (logic preserved) -----------------
export default function AddJobScreen() {
  const navigate = useNavigate();
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const isMobile = useIsMobile();


  // 🔻 1️⃣ SIDEBAR COLLAPSED STATE (added, UI only)
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  // Original state from your AddJobScreen (preserved)
  const [selectedTab, setSelectedTab] = useState("Works"); // "Works" | "24 hour"
  const [sortType, setSortType] = useState("Newest"); // "Newest" | "Paused" | "Budget High" | "Budget Low"
  const [searchText, setSearchText] = useState("");

  const [worksJobs, setWorksJobs] = useState([]);
  const [jobs24h, setJobs24h] = useState([]);
  const [loadingWorks, setLoadingWorks] = useState(true);
  const [loading24h, setLoading24h] = useState(true);

  const [showSortModal, setShowSortModal] = useState(false);

  const [pausedWorksJobs, setPausedWorksJobs] = useState([]);
  const [paused24hJobs, setPaused24hJobs] = useState([]);

  // 🔻 2️⃣ LISTEN FOR SIDEBAR TOGGLE (UI only, no backend change)
  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  // ---------------- FIREBASE SUBSCRIPTIONS (exactly as before) ---------------- //
  useEffect(() => {
    if (!currentUser) return;

    // Works jobs
    const qWorks = query(
      collection(db, "jobs"),
      where("userId", "==", currentUser.uid)
    );

    const unsubPausedWorks = onSnapshot(
      query(
        collection(db, "pausedJobs"),
        where("userId", "==", currentUser.uid),
        where("is24", "==", false)
      ),
      (snapshot) =>
        setPausedWorksJobs(
          snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        )
    );
    const unsubPaused24h = onSnapshot(
      query(
        collection(db, "pausedJobs"),
        where("userId", "==", currentUser.uid),
        where("is24", "==", true)
      ),
      (snapshot) =>
        setPaused24hJobs(
          snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        )
    );

    const unsubWorks = onSnapshot(
      qWorks,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setWorksJobs(items);
        setLoadingWorks(false);
      },
      (err) => {
        console.error("Error fetching jobs:", err);
        setLoadingWorks(false);
      }
    );

    // 24h jobs
    const q24h = query(
      collection(db, "jobs_24h"),
      where("userId", "==", currentUser.uid)
    );

    const unsub24h = onSnapshot(
      q24h,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setJobs24h(items);
        setLoading24h(false);
      },
      (err) => {
        console.error("Error fetching 24h jobs:", err);
        setLoading24h(false);
      }
    );

    return () => {
      try {
        unsubWorks && unsubWorks();
        unsub24h && unsub24h();
        unsubPausedWorks && unsubPausedWorks();
        unsubPaused24h && unsubPaused24h();
      } catch (e) {
        // ignore if already unsubscribed
      }
    };
  }, [currentUser, db]);

  // ---------------- FILTER + SORT LOGIC (preserved) ---------------- //
  const applyFilters = (jobs, is24h = false) => {
    let data = [...jobs];

    // Paused filter
    if (sortType === "Paused") {
      // Fetch paused jobs from pausedJobs collection instead of active jobs
      return is24h ? paused24hJobs : pausedWorksJobs;
    }

    // Search
    if (searchText.trim()) {
      const q = searchText.trim().toLowerCase();
      data = data.filter((job) => {
        const title = (job.title || "").toLowerCase();
        const skills = (job.skills || []).join(" ").toLowerCase();
        const tools = (job.tools || []).join(" ").toLowerCase();
        return (
          title.includes(q) ||
          skills.includes(q) ||
          tools.includes(q)
        );
      });
    }

    // Sort
    if (sortType === "Newest") {
      data.sort(
        (a, b) =>
          (b.created_at?.seconds || b.created_at || 0) -
          (a.created_at?.seconds || a.created_at || 0)
      );
    } else if (sortType === "Budget High") {
      data.sort(
        (a, b) =>
          Number(b.budget_to || b.budget || 0) -
          Number(a.budget_to || a.budget || 0)
      );
    } else if (sortType === "Budget Low") {
      data.sort(
        (a, b) =>
          Number(a.budget_from || a.budget || 0) -
          Number(b.budget_from || b.budget || 0)
      );
    }

    return data;
  };

  const filteredWorksJobs = useMemo(
    () => applyFilters(worksJobs),
    [worksJobs, searchText, sortType, pausedWorksJobs, paused24hJobs]
  );

  const filtered24hJobs = useMemo(
    () => applyFilters(jobs24h, true),
    [jobs24h, searchText, sortType, pausedWorksJobs, paused24hJobs]
  );

  // ---------------- EVENT HANDLERS (preserved) ---------------- //
  const handlePauseWorksJob = async (job) => {
    try {
      if (!job.id) return;
      await setDoc(doc(db, "pausedJobs", job.id), {
        ...job,
        is24: false,
      });
      await deleteDoc(doc(db, "jobs", job.id));
      alert("Service paused");
    } catch (err) {
      console.error("Pause job error:", err);
      alert("Something went wrong while pausing the service.");
    }
  };

  const handlePause24hJob = async (job) => {
    try {
      if (!job.id) return;
      await setDoc(doc(db, "pausedJobs", job.id), {
        ...job,
        is24: true,
      });
      await deleteDoc(doc(db, "jobs_24h", job.id));
      alert("Job paused");
    } catch (err) {
      console.error("Pause 24h job error:", err);
      alert("Something went wrong while pausing the 24h job.");
    }
  };

  const handleEditWorksJob = (job) => {
    // 🔹 Update route to your edit job screen (preserved)
    navigate("/client-dashbroad2/clienteditjob", {
      state: { jobData: job },
    });
  };

  const handleEdit24hJob = (job) => {
    // 🔹 Update route to your edit 24h job screen (preserved)
    navigate("/client-dashbroad2/clientedit24jobs", {
      state: { jobId: job.id, jobData: job },
    });
  };

  const handleOpenPostJob = () => {
    // 🔹 Update route to your "Post Job" screen (preserved)
    navigate("/client-dashbroad2/PostJob", { state: { jobData: {} } });
  };

  const handleOpenAdd24hJob = () => {
    // 🔹 Update route to your "Add 24 Hours" screen (preserved)
    navigate("/client-dashbroad2/PostJob");
  };

  const handleOpenJobDetail = (job) => {
    // 🔹 Update route to your job detail page (preserved)
    navigate("", { state: { jobId: job.id } });
  };

  // ---------------- RENDER HELPERS (adapted to card UI) ---------------- //
  const renderSortOption = (label) => {
    const isActive = sortType === label;
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 10px",
          cursor: "pointer",
        }}
        onClick={() => {
          setSortType(label);
          setShowSortModal(false);
        }}
      >
          {/* ✅ GLOBAL MOBILE OVERFLOW FIX */}
      <style>{`
        body { overflow-x: hidden; }
      `}</style>

        <span
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            border: `2px solid ${
              isActive ? "#7C3CFF" : "#D1D5DB"
            }`,
            display: "inline-block",
            marginRight: 10,
            boxSizing: "border-box",
            background: isActive ? "#7C3CFF" : "transparent",
          }}
        />
        <span style={{ fontWeight: 700 }}>{label}</span>
      </div>
    );
  };

  const renderEmptyState = (
    title,
    subtitle,
    action,
    actionLabel,
    type
  ) => {
    const image = type === "works" ? emptyWorks : empty24;

    return (
      <div
        style={{
          width: "100%",
          padding: "40px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          fontFamily: "Rubik",
          marginLeft: "150px",
          fontSize: "20px",
          fontWeight: 500,
        }}
      >
        <img
          src={image}
          alt="empty"
          style={{
            width: 180,
            height: "auto",
            marginBottom: 20,
            opacity: 0.9,
          }}
        />

        <div style={{ fontSize: 16, fontWeight: 500 }}>{title}</div>

        <div
          style={{
            fontSize: 15,
            opacity: 0.6,
            marginTop: 10,
            maxWidth: 320,
          }}
        >
          {subtitle}
        </div>

        <button
          onClick={action}
          style={{
            marginTop: 25,
            padding: "12px 22px",
            background: "rgba(253, 253, 150, 1)",
            border: "none",
            color: "#000",
            borderRadius: 50,
            fontSize: 20,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "Rubik",
            width: "195px",
          }}
        >
          {actionLabel}
        </button>
      </div>
    );
  };

  const chipBgColors = [
    "#FFCCBC",
    "#B3E5FC",
    "#E1BEE7",
    "#C8E6C9",
  ];

  const renderLimitedChips = (items) => {
    const flat = (items || []).map((x) => String(x));
    const limit = 2;
    const visible = flat.slice(0, limit);
    const hidden = flat.slice(limit);
   
    return (
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 8,
          alignItems: "center",
        }}
      >
        {visible.map((text, idx) => {
          const color =
            chipBgColors[
              Math.abs(text.hashCode?.() || text.length) %
                chipBgColors.length
            ] || chipBgColors[idx % chipBgColors.length];
          return (
            <div
              key={idx}
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 12,
                backgroundColor: color,
              }}
            >
              {text}
            </div>
          );
        })}
        {hidden.length > 0 && (
          <div
            style={{
              padding: "6px 10px",
              borderRadius: 999,
              backgroundColor: "#e0e0e0",
            }}
          >
            +{hidden.length}
          </div>
        )}
      </div>
    );
  };

  // ---------------- CARD RENDERS (ui only, logic preserved) ----------------
  const renderWorksJobCard = (job) => {
    return (
      <div
        key={job.id}
        style={styles.card}
        onClick={() => handleOpenJobDetail(job)}
      >
        <div
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            color: "#9CA3AF",
          }}
        >
          {">"}
        </div>
        <div style={styles.jobCardRowTop}>
          <div
            style={{
              ...styles.avatarBox,
              width: 56,
              height: 56,
              fontSize: 20,
            }}
          >
            {(job.title || "JA").substring(0, 2).toUpperCase()}
          </div>
          <div style={{ flex: 1, marginLeft: 12 }}>
            <div
              style={{ ...styles.jobTitle, fontSize: 16 }}
            >
              {job.title || "Title"}
            </div>
            <div style={styles.skillsRowWrapper}>
              {Array.isArray(job.skills) &&
                job.skills.slice(0, 2).map((s, i) => (
                  <div key={i} style={styles.skillChip}>
                    {s}
                  </div>
                ))}
              {job.skills?.length > 2 && (
                <div style={styles.moreChip}>
                  +{job.skills.length - 2}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={styles.jobInfoRow}>
          <div>
            <div style={styles.label}>Budget</div>
            <div
              style={{
                ...styles.value,
                ...styles.valueHighlight,
              }}
            >
              ₹{job.budget_from || job.budget_to || 0}
            </div>
          </div>
          <div>
            <div style={styles.label}>Timeline</div>
            <div style={styles.value}>
              {job.timeline || "N/A"}
            </div>
          </div>
          <div>
            <div style={styles.label}>Location</div>
            <div style={styles.value}>Remote</div>
          </div>
        </div>

        <div style={styles.buttonRow}>
          <button
            style={styles.secondaryBtn}
            onClick={(e) => {
              e.stopPropagation();
              handlePauseWorksJob(job);
            }}
          >
            Pause Service
          </button>
          <button
            style={styles.primaryBtn}
            onClick={(e) => {
              e.stopPropagation();
              handleEditWorksJob(job);
            }}
          >
            Edit Service
          </button>
        </div>
      </div>
    );
  };

  const render24hJobCard = (job) => {
    return (
      <div
        key={job.id}
        style={styles.card}
        onClick={() => handleOpenJobDetail(job)}
      >
        <div
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            color: "#9CA3AF",
          }}
        >
          {">"}
        </div>
        <div style={styles.jobCardRowTop}>
          <div
            style={{
              ...styles.avatarBox,
              width: 56,
              height: 56,
              fontSize: 20,
            }}
          >
            {(job.title || "JA").substring(0, 2).toUpperCase()}
          </div>
          <div style={{ flex: 1, marginLeft: 12 }}>
            <div
              style={{ ...styles.jobTitle, fontSize: 16 }}
            >
              {job.title || "Title"}
            </div>
            <div style={styles.skillsRowWrapper}>
              {Array.isArray(job.skills) &&
                job.skills.slice(0, 2).map((s, i) => (
                  <div key={i} style={styles.skillChip}>
                    {s}
                  </div>
                ))}
              {job.skills?.length > 2 && (
                <div style={styles.moreChip}>
                  +{job.skills.length - 2}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={styles.jobInfoRow}>
          <div>
            <div style={styles.label}>Budget</div>
            <div
              style={{
                ...styles.value,
                ...styles.valueHighlight,
              }}
            >
              ₹{job.budget || 0}
            </div>
          </div>
          <div>
            <div style={styles.label}>Timeline</div>
            <div style={styles.value}>24 hours</div>
          </div>
          <div>
            <div style={styles.label}>Location</div>
            <div style={styles.value}>Remote</div>
          </div>
        </div>

        <div style={styles.buttonRow}>
          <button
            style={styles.secondaryBtn}
            onClick={(e) => {
              e.stopPropagation();
              handlePause24hJob(job);
            }}
          >
            Pause Service
          </button>
          <button
            style={styles.primaryBtn}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit24hJob(job);
            }}
          >
            Edit Service
          </button>
        </div>
      </div>
    );
  };

  // ---------------- MAIN RENDER ----------------
  const isWorksTab = selectedTab === "Works";
  const is24hTab =
    selectedTab === "24 hour" ||
    selectedTab === "24h" ||
    selectedTab === "24 Hours";

  const listContent = (() => {
    if (isWorksTab) {
      if (loadingWorks) {
        return (
          <div style={{ marginTop: 40 }}>Loading...</div>
        );
      }
      if (!filteredWorksJobs.length) {
        return renderEmptyState(
          "All set – just add your first job!",
          "Post a job with clear details to find top freelancers who can bring your vision to life.",
          handleOpenPostJob,
          "Post a Job",
          "works" // <-- dummy PNG for works
        );
      }
      return filteredWorksJobs.map((job) =>
        renderWorksJobCard(job)
      );
    }

    if (loading24h) {
      return (
        <div style={{ marginTop: 40 }}>Loading...</div>
      );
    }
    if (!filtered24hJobs.length) {
      return renderEmptyState(
        "All set – just add your first 24h job!",
        "Post a job with clear details to find top freelancers who can bring your vision to life.",
        handleOpenAdd24hJob,
        "Post a Job",
        "24h" // <-- dummy PNG for 24h
      );
    }

    return filtered24hJobs.map((job) =>
      render24hJobCard(job)
    );
  })();

  // ----------------- Sort modal & search handlers (kept for parity) -----------------
  const sortRef = useRef(null);

  useEffect(() => {
    const outside = (e) => {
      if (
        sortRef.current &&
        !sortRef.current.contains(e.target)
      )
        setShowSortModal(false);
    };
    if (showSortModal)
      document.addEventListener("mousedown", outside);
    return () =>
      document.removeEventListener("mousedown", outside);
  }, [showSortModal]);

  // ---------------- Render ----------------
  // 🔻 3️⃣ WRAP WHOLE UI INSIDE MARGIN-LEFT CONTAINER (for sidebar)

   return (
  <div
    className="freelance-wrapper"
    style={{
      marginLeft: isMobile ? 0 : collapsed ? "-510px" : "-60px",
      transition: "margin-left 0.25s ease",
      width: "100%",
    }}
  >
    <div style={styles.page}>
      {/* HEADER */}
      <div
        style={{
          ...styles.headerRowWrap,
          width: isMobile ? "100%" : 928,
          marginLeft: isMobile ? 0 : 32,
          paddingLeft: isMobile ? 16 : 0,
          paddingRight: isMobile ? 16 : 0,
        }}
      >
        <div
          style={styles.backbtn}
          onClick={() => navigate(-1)}
        >
          <img src={backarrow} alt="back" height={20} />
        </div>

        <div style={styles.headerTextBlock}>
          <div style={styles.headerTitle}>
            job proposal
          </div>
          <div style={styles.headerSubtitle}>
            Turn your ideas into action — post your job
            today.
          </div>
        </div>
      </div>

      {/* TOGGLE */}
      <div
        style={{
          ...styles.toggleBarWrapper,
          width: isMobile ? "100%" : 928,
          marginLeft: isMobile ? 0 : 32,
          paddingLeft: isMobile ? 12 : 6,
          paddingRight: isMobile ? 12 : 6,
        }}
      >
        <div style={styles.toggleGroup}>
          <div
            onClick={() => setSelectedTab("Works")}
            style={styles.toggleButton(
              selectedTab === "Works"
            )}
          >
            Works
          </div>
          <div
            onClick={() => setSelectedTab("24 Hours")}
            style={styles.toggleButton(
              selectedTab === "24 Hours"
            )}
          >
            24 Hours
          </div>
        </div>
      </div>

      {/* SEARCH + SORT */}
      <div
        style={{
          ...styles.searchSortRow,
          width: isMobile ? "100%" : 928,
          marginLeft: isMobile ? 0 : 32,
          paddingLeft: isMobile ? 16 : 0,
          paddingRight: isMobile ? 16 : 32,
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <div style={styles.searchContainer}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            style={styles.searchInput}
            placeholder="Search"
            value={searchText}
            onChange={(e) =>
              setSearchText(e.target.value)
            }
          />
        </div>

        <div
          style={styles.sortButtonWrapper}
          ref={sortRef}
        >
          <div
            style={styles.sortBtnBox}
            onClick={() =>
              setShowSortModal((s) => !s)
            }
          >
            Sort
          </div>

          {showSortModal && (
            <div style={styles.sortMenu}>
              {renderSortOption("Newest")}
              {renderSortOption("Paused")}
              {renderSortOption("Budget High")}
              {renderSortOption("Budget Low")}
            </div>
          )}
        </div>
      </div>

      {/* CARDS */}
      <div
        style={{
          ...styles.cardsWrap,
          width: isMobile ? "100%" : 928,
          marginLeft: isMobile ? 0 : 32,
          paddingLeft: isMobile ? 16 : 0,
          paddingRight: isMobile ? 16 : 0,
          gridTemplateColumns: isMobile
            ? "1fr"
            : "repeat(2, 446px)",
        }}
      >
        {listContent}
      </div>

      {/* FAB */}
      <button
        style={{
          ...styles.fab,
          right: isMobile ? 16 : 32,
          bottom: isMobile ? 16 : 32,
        }}
        onClick={
          selectedTab === "Works"
            ? handleOpenPostJob
            : handleOpenAdd24hJob
        }
      >
        +
      </button>
    </div>
  </div>
);

}
