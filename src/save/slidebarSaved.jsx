


// // ServiceScreenOne.jsx
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
// import { collection, doc, onSnapshot, query, where, updateDoc, serverTimestamp } from "firebase/firestore";

// import { db } from "../firbase/Firebase";

// import backarrow from "../assets/backarrow.png";
// import arrow from "../assets/arrow.png";

// // ---------------------------------- NOTIFICATIONS ----------------------------------
// const NotificationService = {
//   notifications: [],
//   addNotification(item) { this.notifications.push(item); },
//   clearAll() { this.notifications = []; },
// };

// // ---------------------------------- STYLES ----------------------------------
// const styles = {
//   page: { backgroundColor: "#FFFFFF", minHeight: "100vh", fontFamily: `'Rubik', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 32, paddingBottom: 80 },
//   headerRowWrap: { width: 928, display: "flex", flexDirection: "row", alignItems: "center", gap: 8, marginLeft: 32, marginTop: 0 },
//   headerTextBlock: { display: "flex", flexDirection: "column", marginLeft: 4 },
//   headerTitle: { fontWeight: 400, fontSize: "36px", lineHeight: "28px", },
//   headerSubtitle: { fontSize: 14, marginTop: 15,fontWeight: 400,marginLeft: -40  },
//   backbtn: { width: "30px", height: "30px", borderRadius: "14px", border: "0.8px solid #ccc", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", fontSize: "20px", opacity: 1, flexShrink: 0, marginBottom: "18px" },
//   toggleBarWrapper: { width: 928, height: 52, borderRadius: 16, padding: 6, display: "flex", alignItems: "center", marginTop: 18, marginLeft: 32, backgroundColor: "#FFF8E1", boxSizing: "border-box", boxShadow: "0 2px 8px rgba(16,24,40,0.04)" },
//   toggleGroup: { width: 335.587, height: 36, display: "flex", gap: 6, borderRadius: 14, alignItems: "center", padding: 4, backgroundColor: "transparent" },
//   toggleButton: (active) => ({ width: 165.793, height: 36, borderRadius: 12, padding: "0 18px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: active ? "#FFFFFF":"#FFF8E1" , fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: active ? "0 4px 10px rgba(124,60,255,0.06)" : "none" }),
//   searchSortRow: { width: 928, display: "flex", gap: 12, alignItems: "center", marginTop: 16, marginLeft: 32, paddingRight: 32, boxSizing: "border-box" },
//   searchContainer: { flex: 1, height: 44, borderRadius: 14, border: "1px solid #DADADA", paddingLeft: 14, paddingRight: 14, display: "flex", alignItems: "center", backgroundColor: "#FFF", boxSizing: "border-box" },
//   searchIcon: { fontSize: 18, color: "#757575" },
//   searchInput: { border: "none", outline: "none", flex: 1, marginLeft: 10,marginTop: 15, fontSize: 14 },
//   sortButtonWrapper: { display: "flex", alignItems: "center", cursor: "pointer", gap: 8, position: "relative" },
//   sortBtnBox: { minWidth: 90, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #E0E0E0", background: "#FFF", cursor: "pointer", fontWeight: 600 },
//   sortMenu: { position: "absolute", top: 48, right: 0, backgroundColor: "#FFFFFF", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", padding: "8px 8px", minWidth: 180, zIndex: 90 },
//   sortMenuItem: { padding: "8px 12px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 },
//   cardsWrap: { width: 928, marginTop: 24, marginLeft: 32, display: "grid", gridTemplateColumns: "repeat(2, 446px)", gap: "24px 24px" },
//   card: { width: 446, height: 220, borderRadius: 24, borderWidth: 0.8, borderStyle: "solid", borderColor: "#DADADA", backgroundColor: "#FFFFFF", padding: 20, boxSizing: "border-box", boxShadow: "0 8px 20px rgba(16,24,40,0.04)", cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" },
//   cardArrow: { width: 16, height: 16, position: "absolute", top: 20, right: 20, objectFit: "contain", opacity: 0.95 },
//   smallIconPos: { width: 16, height: 16, position: "absolute", top: 24, left: 24 },
//   jobCardRowTop: { display: "flex", alignItems: "flex-start" },
//   avatarBox: { display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 14, background: "linear-gradient(135deg, #51A2FF 0%, #9B42FF 60%, #AD46FF 100%)", color: "#FFFFFF", fontWeight: 700,flexShrink:0, },
//   jobTitle: { fontWeight: 500, marginBottom: 4, fontSize: 18, textTransform: "uppercase", },
//   skillsRowWrapper: { marginTop: 4, height: 32, overflowX: "auto", display: "flex", alignItems: "center" },
//   skillChip: { display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "4px 12px", marginRight: 8, borderRadius: 20, border: "1px solid rgba(255, 255, 190, 1)#90CAF9", backgroundColor: "rgba(255, 255, 190, 1)", fontSize: 14, fontWeight:400, whiteSpace: "nowrap", color: "#000" },
//   moreChip: { padding: "4px 12px", borderRadius: 20, backgroundColor: "rgba(255, 255, 190, 1)", fontSize: 11, fontWeight: 600 },
//   jobInfoRow: { marginTop: 0, display: "flex", justifyContent: "space-between" },
//   label: { fontSize: 15, fontWeight: 400 },
//   value: { marginTop: 4, fontSize: 13, fontWeight: 500 },
//   valueHighlight: { color: "rgba(124, 60, 255, 1)" },
//   buttonRow: { marginTop: 0, display: "flex", gap: 12 },
//   secondaryBtn: { flex: 1, height: 40, borderRadius: 30, border: "1px solid #BDBDBD", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, backgroundColor: "#FFFFFF", cursor: "pointer" },
//   primaryBtn: { flex: 1, height: 40, borderRadius: 30, border: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, backgroundColor: "rgba(253, 253, 150, 1)", cursor: "pointer" },
//   emptyStateWrapper: { marginTop: 40, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingLeft: 32, paddingRight: 32 },
//   emptyImagePlaceholder: { width: 140, height: 180, borderRadius: 16, backgroundColor: "#FFF9C4", marginBottom: 16 },
//   emptyTitle: { fontWeight: 500, fontSize: 15, marginBottom: 6 },
//   fab: { position: "fixed", right: 32, bottom: 32, width: 64, height: 64, borderRadius: 9999, backgroundColor: "rgba(124, 60, 255, 1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontSize: 32, border: "none", cursor: "pointer", boxShadow: "0 8px 16px rgba(124, 60, 255, 0.4)", zIndex: 20 },
// };

// // ==============================================================
// // Utility functions
// // ==============================================================
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

// // ==============================================================
// // Main Component
// // ==============================================================
// export default function ServiceScreenOne() {
//   const navigate = useNavigate();
//   const auth = getAuth();

//   const [selectedTab, setSelectedTab] = useState("Works");
//   const [searchText, setSearchText] = useState("");
//   const [services, setServices] = useState([]);
//   const [servicesLoading, setServicesLoading] = useState(true);
//   const [jobs24, setJobs24] = useState([]);
//   const [jobs24Loading, setJobs24Loading] = useState(true);
//   const [user, setUser] = useState(null);
//   const [sortMenuOpen, setSortMenuOpen] = useState(false);
//   const [sortOption, setSortOption] = useState("newest");
//   const sortRef = useRef(null);

//   // ----------------------- AUTH LISTENER -----------------------
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => setUser(u));
//     return () => unsub();
//   }, [auth]);

//   // ----------------------- SERVICES STREAM -----------------------
//   useEffect(() => {
//     if (!user) return;
//     setServicesLoading(true);
//     const q = query(collection(db, "services"), where("userId", "==", user.uid));
//     const unsub = onSnapshot(q, (snap) => {
//       const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       arr.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
//       setServices(arr);
//       setServicesLoading(false);
//     });
//     return () => unsub();
//   }, [user]);

//   // ----------------------- 24H STREAM -----------------------
//   useEffect(() => {
//     if (!user) return;
//     setJobs24Loading(true);
//     const q = query(collection(db, "service_24h"), where("userId", "==", user.uid));
//     const unsub = onSnapshot(q, (snap) => {
//       const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       arr.sort((a, b) => (b.created_at?.seconds || b.createdAt?.seconds || 0) - (a.created_at?.seconds || a.createdAt?.seconds || 0));
//       setJobs24(arr);
//       setJobs24Loading(false);
//     });
//     return () => unsub();
//   }, [user]);

//   // ----------------------- PAUSE / UNPAUSE -----------------------
//   async function togglePauseService(job, source = "services", e) {
//     if (e) e.stopPropagation();
//     const newPaused = !job.paused;
//     try {
//       const ref = doc(db, source, job.id);
//       await updateDoc(ref, {
//         paused: newPaused,
//         pausedAt: newPaused ? serverTimestamp() : null,
//       });
//     } catch (err) {
//       alert("Failed to update pause status.");
//     }
//   }

//   // ----------------------- SEARCH & SORT -----------------------
//   const filteredServices = useMemo(() => {
//     if (!searchText) return services;
//     const t = searchText.toLowerCase();
//     return services.filter((s) => (s.title || "").toLowerCase().includes(t));
//   }, [services, searchText]);

//   const filteredJobs24 = useMemo(() => {
//     if (!searchText) return jobs24;
//     const t = searchText.toLowerCase();
//     return jobs24.filter((s) => (s.title || "").toLowerCase().includes(t));
//   }, [jobs24, searchText]);

//   const applySort = (arr) => {
//     if (!Array.isArray(arr)) return arr;
//     if (sortOption === "paused") return arr.filter((i) => i.paused === true);
//     if (sortOption === "oldest") {
//       return [...arr].sort((a, b) => (a.createdAt?.seconds || a.created_at?.seconds || 0) - (b.createdAt?.seconds || b.created_at?.seconds || 0));
//     }
//     return [...arr].sort((a, b) => (b.createdAt?.seconds || b.created_at?.seconds || 0) - (a.createdAt?.seconds || a.created_at?.seconds || 0));
//   };

//   const sortedServices = useMemo(() => applySort(filteredServices), [filteredServices, sortOption]);
//   const sortedJobs24 = useMemo(() => applySort(filteredJobs24), [filteredJobs24, sortOption]);

//   const handleSortClick = () => setSortMenuOpen((p) => !p);
//   const handleSortSelect = (v) => { setSortOption(v); setSortMenuOpen(false); };

//   useEffect(() => {
//     const outside = (e) => { if (sortRef.current && !sortRef.current.contains(e.target)) setSortMenuOpen(false); };
//     if (sortMenuOpen) document.addEventListener("mousedown", outside);
//     return () => document.removeEventListener("mousedown", outside);
//   }, [sortMenuOpen]);

//   const handleLogout = async () => { await signOut(auth); navigate("/firelogin"); };

//   // ----------------------- RENDER CARD FUNCTIONS -----------------------
//   const renderWorkJobCard = (job) => {
//     const initials = getInitialsFromTitle(job.title);
//     return (
//       <div key={job.id} style={styles.card} onClick={() => navigate(`/serviceDetailsModel/${job.id}`, { state: { job } })}>
//         <img src={arrow} alt="arrow" style={styles.cardArrow} />
//         <div style={styles.smallIconPos} />
//         <div style={styles.jobCardRowTop}>
//           <div style={{ ...styles.avatarBox, width: 56, height: 56, fontSize: 20 }}>{initials}</div>
//           <div style={{ flex: 1, marginLeft: 12 }}>
//             <div style={{ ...styles.jobTitle, fontSize: 16 }}>{job.title}</div>
//             <div style={styles.skillsRowWrapper}>
//               {Array.isArray(job.skills) && job.skills.slice(0, 2).map((s, i) => <div key={i} style={styles.skillChip}>{s}</div>)}
//               {job.skills?.length > 2 && <div style={styles.moreChip}>+{job.skills.length - 2}</div>}
//             </div>
//           </div>
//         </div>
//         <div style={styles.jobInfoRow}>
//           <div><div style={styles.label}>Budget</div><div style={{ ...styles.value, ...styles.valueHighlight }}>₹{formatBudget(job.budget_from || job.budget)}</div></div>
//           <div><div style={styles.label}>Timeline</div><div style={styles.value}>{job.deliveryDuration || "N/A"}</div></div>
//           <div><div style={styles.label}>Location</div><div style={styles.value}>{job.location || "Remote"}</div></div>
//         </div>
//         <div style={styles.buttonRow}>
//           <button type="button" style={styles.secondaryBtn} onClick={(e) => togglePauseService(job, "services", e)}>{job.paused ? "Unpause" : "Pause Service"}</button>
//           <button type="button" style={styles.primaryBtn} onClick={(e) => { e.stopPropagation(); navigate(`/freelance-dashboard/freelanceredit-service/${job.id}`, { state: { jobId: job.id, jobData: job } }); }}>Edit Service</button>
//         </div>
//       </div>
//     );
//   };

//   const render24hJobCard = (job) => {
//     const initials = getInitialsFromTitle(job.title);
//     return (
//       <div key={job.id} style={styles.card} onClick={() => navigate(`/service-24h/${job.id}`, { state: { job } })}>
//         <img src={arrow} alt="arrow" style={styles.cardArrow} />
//         <div style={styles.smallIconPos} />
//         <div style={styles.jobCardRowTop}>
//           <div style={{ ...styles.avatarBox, width: 60, height: 60, fontSize: 22 }}>{initials}</div>
//           <div style={{ flex: 1, marginLeft: 12 }}>
//             <div style={{ ...styles.jobTitle, fontSize: 16 }}>{job.title}</div>
//             <div style={styles.skillsRowWrapper}>
//               {Array.isArray(job.skills) && job.skills.slice(0, 2).map((s, i) => <div key={i} style={styles.skillChip}>{s}</div>)}
//               {job.skills?.length > 2 && <div style={styles.moreChip}>+{job.skills.length - 2}</div>}
//             </div>
//           </div>
//         </div>
//         <div style={styles.jobInfoRow}>
//           <div><div style={styles.label}>Budget</div><div style={{ ...styles.value, ...styles.valueHighlight }}>₹{formatBudget(job.budget_from || job.budget)}</div></div>
//           <div><div style={styles.label}>Timeline</div><div style={styles.value}>{job.deliveryDuration || "N/A"}</div></div>
//           <div><div style={styles.label}>Location</div><div style={styles.value}>{job.location || "Remote"}</div></div>
//         </div>
//         <div style={styles.buttonRow}>
//           <button type="button" style={styles.secondaryBtn} onClick={(e) => togglePauseService(job, "service_24h", e)}>{job.paused ? "Unpause" : "Pause Service"}</button>
//           <button type="button" style={styles.primaryBtn} onClick={(e) => { e.stopPropagation(); navigate(`/service-24h-edit/${job.id}`, { state: { job } }); }}>Edit Service</button>
//         </div>
//       </div>
//     );
//   };

//   const renderCards = () => {
//     if (selectedTab === "Works") {
//       if (servicesLoading) return <div style={{ marginTop: 40 }}>Loading your services...</div>;
//       if (sortedServices.length === 0) return <div style={styles.emptyStateWrapper}><div style={styles.emptyImagePlaceholder}></div><div style={styles.emptyTitle}>No Services Yet</div></div>;
//       return sortedServices.map(renderWorkJobCard);
//     } else if (selectedTab === "24 Hours") {
//       if (jobs24Loading) return <div style={{ marginTop: 40 }}>Loading 24h services...</div>;
//       if (sortedJobs24.length === 0) return <div style={styles.emptyStateWrapper}><div style={styles.emptyImagePlaceholder}></div><div style={styles.emptyTitle}>No 24h Services Yet</div></div>;
//       return sortedJobs24.map(render24hJobCard);
//     }
//   };

//   // ----------------------- MAIN RENDER -----------------------
//   return (
//     <div style={styles.page}>
//       <div style={styles.headerRowWrap}>
//         <div style={styles.backbtn} onClick={() => navigate(-1)}><img src={backarrow} alt="back" style={{ width: 17, height: 19 }} /></div>
//         <div style={styles.headerTextBlock}>
//           <div style={styles.headerTitle}>Your Service</div>
//           <div style={styles.headerSubtitle}>List Your service,Reach More People</div>
//         </div>
//       </div>

//       <div style={styles.toggleBarWrapper}>
//         <div style={styles.toggleGroup}>
//           <div role="button" tabIndex={0} onClick={() => setSelectedTab("Works")} style={styles.toggleButton(selectedTab === "Works")}>Works</div>
//           <div role="button" tabIndex={0} onClick={() => setSelectedTab("24 Hours")} style={styles.toggleButton(selectedTab === "24 Hours")}>24 Hours</div>
//         </div>
//       </div>

//       <div style={styles.searchSortRow}>
//         <div style={styles.searchContainer}>
//           <span style={styles.searchIcon}>🔍</span>
//           <input style={styles.searchInput} placeholder="Search services..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
//         </div>
//         <div style={styles.sortButtonWrapper} ref={sortRef}>
//           <div style={styles.sortBtnBox} onClick={handleSortClick}>Sort</div>
//           {sortMenuOpen && (
//             <div style={styles.sortMenu}>
//               <div style={styles.sortMenuItem} onClick={() => handleSortSelect("newest")}>Newest</div>
//               <div style={styles.sortMenuItem} onClick={() => handleSortSelect("oldest")}>Oldest</div>
//               <div style={styles.sortMenuItem} onClick={() => handleSortSelect("paused")}>Paused</div>
//             </div>
//           )}
//         </div>
//       </div>

//       <div style={styles.cardsWrap}>
//         {renderCards()}
//       </div>

//       <button style={styles.fab} onClick={() => navigate("/create-service")}>+</button>
//     </div>
//   );
// }


// FULL UPDATED ServiceScreenOne.jsx
// Includes: Empty state image, title, subtitle for BOTH Works & 24 Hours
// Matches the request exactly

// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { collection, doc, onSnapshot, query, where, updateDoc, serverTimestamp } from "firebase/firestore";

// import { db } from "../firbase/Firebase";

// import backarrow from "../assets/backarrow.png";
// import arrow from "../assets/arrow.png";
// import serviceEmpty from "../assets/service.png"; // EMPTY IMAGE
// import search from "../assets/search.png";

// //---------------------------------------------------------------
// // NOTIFICATIONS
// //---------------------------------------------------------------
// const NotificationService = {
//   notifications: [],
//   addNotification(item) { this.notifications.push(item); },
//   clearAll() { this.notifications = []; },
// };

// //---------------------------------------------------------------
// // STYLES
// //---------------------------------------------------------------
// const styles = {
//   page: {
//     backgroundColor: "#FFFFFF",
//     minHeight: "100vh",
//     fontFamily: `'Rubik', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     paddingTop: 32,
//     paddingBottom: 80,
//   },

//   headerRowWrap: {
//     width: 928,
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     marginLeft: 32,
//   },

//   headerTextBlock: { display: "flex", flexDirection: "column", marginLeft: 4 },
//   headerTitle: { fontWeight: 400, fontSize: "36px", lineHeight: "28px" },
//   headerSubtitle: { fontSize: 14, marginTop: 15, fontWeight: 400, marginLeft: -40 },

//   backbtn: {
//     width: 30,
//     height: 30,
//     borderRadius: 14,
//     border: "0.8px solid #ccc",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     cursor: "pointer",
//     flexShrink: 0,
//     marginBottom: 18,
//   },

//   // Tabs
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
//     boxShadow: "0 2px 8px rgba(16,24,40,0.04)",
//   },
//   toggleGroup: {
//     width: 335,
//     height: 36,
//     display: "flex",
//     gap: 6,
//     borderRadius: 14,
//     alignItems: "center",
//     padding: 4,
//   },
//   toggleButton: (active) => ({
//     width: 165,
//     height: 36,
//     borderRadius: 12,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: active ? "#FFFFFF" : "#FFF8E1",
//     fontSize: 14,
//     fontWeight: 600,
//     cursor: "pointer",
//     boxShadow: active ? "0 4px 10px rgba(124,60,255,0.06)" : "none",
//   }),

//   // Search + Sort
//   searchSortRow: {
//     width: 928,
//     display: "flex",
//     gap: 12,
//     alignItems: "center",
//     marginTop: 16,
//     marginLeft: 32,
//     paddingRight: 32,
//   },

//   searchContainer: {
//     flex: 1,
//     height: 44,
//     borderRadius: 14,
//     border: "1px solid #DADADA",
//     paddingLeft: 14,
//     paddingRight: 14,
//     display: "flex",
//     alignItems: "center",
//     backgroundColor: "#FFF",
//     marginLeft:20,
//   },

//   searchInput: {
//     border: "none",
//     outline: "none",
//     flex: 1,
//     marginLeft:1,
//     marginTop: 15,
//     fontSize: 14,
//   },

//   sortButtonWrapper: {
//     display: "flex",
//     alignItems: "center",
//     cursor: "pointer",
//     gap: 8,
//     position: "relative",
//   },

//   sortBtnBox: {
//     minWidth: 90,
//     height: 40,
//     borderRadius: 12,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     border: "1px solid #E0E0E0",
//     background: "#FFF",
//     fontWeight: 600,
//   },

//   sortMenu: {
//     position: "absolute",
//     top: 48,
//     right: 0,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 12,
//     boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
//     padding: 8,
//     minWidth: 180,
//     zIndex: 90,
//   },

//   sortMenuItem: {
//     padding: "8px 12px",
//     display: "flex",
//     alignItems: "center",
//     cursor: "pointer",
//     fontSize: 14,
//   },

//   // Cards grid
//   cardsWrap: {
//     width: 928,
//     marginTop: 24,
//     marginLeft: 32,
//     display: "grid",
//     gridTemplateColumns: "repeat(2, 446px)",
//     gap: "24px 24px",
//   },

//   // Card
//   card: {
//     width: 420,
//     height: 220,
//     borderRadius: 24,
//     border: "0.8px solid #DADADA",
//     backgroundColor: "#FFFFFF",
//     padding: 20,
//     boxShadow: "0 8px 20px rgba(16,24,40,0.04)",
//     cursor: "pointer",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "space-between",
//     position: "relative",
  
//   },

//   cardArrow: { width: 16, height: 16, position: "absolute", top: 20, right: 20 },

//   avatarBox: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: 14,
//     background: "linear-gradient(135deg, #51A2FF, #9B42FF 60%, #AD46FF)",
//     color: "#FFF",
//     fontWeight: 700,
//   },

//   jobTitle: { fontWeight: 500, marginBottom: 4, fontSize: 18, textTransform: "uppercase" },

//   skillsRowWrapper: {
//     marginTop: 4,
//     height: 32,
//     overflowX: "auto",
//     display: "flex",
//     alignItems: "center",
//   },

//   skillChip: {
//     padding: "4px 12px",
//     marginRight: 8,
//     borderRadius: 20,
//     border: "1px solid rgba(255,255,190,1)",
//     backgroundColor: "rgba(255,255,190,1)",
//     fontSize: 14,
//     whiteSpace: "nowrap",
//   },

//   moreChip: {
//     padding: "4px 12px",
//     borderRadius: 20,
//     backgroundColor: "rgba(255,255,190,1)",
//     fontSize: 11,
//   },

//   jobInfoRow: { display: "flex", justifyContent: "space-between" },
//   label: { fontSize: 15 },
//   value: { marginTop: 4, fontSize: 13, fontWeight: 500 },
//   valueHighlight: { color: "rgba(124,60,255,1)" },

//   buttonRow: {
//     display: "flex",
//     gap: 12,
//   },

//   secondaryBtn: {
//     flex: 1,
//     height: 40,
//     borderRadius: 30,
//     border: "1px solid #BDBDBD",
//     backgroundColor: "#FFFFFF",
//     fontSize: 13,
//     fontWeight: 600,
//   },

//   primaryBtn: {
//     flex: 1,
//     height: 40,
//     borderRadius: 30,
//     border: "none",
//     backgroundColor: "rgba(253,253,150,1)",
//     fontWeight: 700,
//   },

//   // EMPTY STATE
//   emptyWrap: {
//     width: 928,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     marginTop: 40,
//     gridColumn: "1 / span 2",
//   },

//   emptyImg: { width: 260, marginBottom: 20 },
//   emptyTitle: { fontSize: 20, fontWeight: 600, marginBottom: 6 },
//   emptySub: {
//     fontSize: 14,
//     width: 810,
//     textAlign: "center",
//     lineHeight: "20px",
//     color: "#444",
//     marginBottom: 20,
    
//   },

//   emptyBtn: {
//     height: 44,
//     padding: "0 22px",
//     borderRadius: 30,
//     backgroundColor: "rgba(253, 253, 150, 1)",
//     border: "none",
//     color: "#000",
//     cursor: "pointer",
//     fontWeight: 600,
//   },

//   fab: {
//     position: "fixed",
//     right: 32,
//     bottom: 32,
//     width: 64,
//     height: 64,
//     borderRadius: "50%",
//     backgroundColor: "rgba(124,60,255,1)",
//     color: "#FFF",
//     fontSize: 32,
//     border: "none",
//     cursor: "pointer",
//     boxShadow: "0 8px 16px rgba(124,60,255,0.4)",
//   },
// };

// //---------------------------------------------------------------
// // HELPERS
// //---------------------------------------------------------------
// function formatBudget(val) {
//   if (!val) return 0;
//   const num = Number(val);
//   if (num >= 100000) return (num / 100000).toFixed(1) + "L";
//   if (num >= 1000) return (num / 1000).toFixed(1) + "k";
//   return num;
// }

// function getInitials(title) {
//   if (!title) return "";
//   const w = title.trim().split(" ");
//   if (w.length > 1) return (w[0][0] + w[1][0]).toUpperCase();
//   return w[0][0].toUpperCase();
// }

// //---------------------------------------------------------------
// // MAIN COMPONENT
// //---------------------------------------------------------------
// export default function ServiceScreenOne() {
//   const navigate = useNavigate();
//   const auth = getAuth();

//   const [selectedTab, setSelectedTab] = useState("Works");
//   const [searchText, setSearchText] = useState("");

//   const [services, setServices] = useState([]);
//   const [jobs24, setJobs24] = useState([]);
//   const [servicesLoading, setServicesLoading] = useState(true);
//   const [jobs24Loading, setJobs24Loading] = useState(true);

//   const [user, setUser] = useState(null);

//   const [sortMenuOpen, setSortMenuOpen] = useState(false);
//   const [sortOption, setSortOption] = useState("newest");
//   const sortRef = useRef(null);

//   //---------------------------------------------------------------
//   // AUTH
//   //---------------------------------------------------------------
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => setUser(u));
//     return () => unsub();
//   }, []);

//   //---------------------------------------------------------------
//   // WORKS STREAM
//   //---------------------------------------------------------------
//   useEffect(() => {
//     if (!user) return;
//     setServicesLoading(true);

//     const q = query(collection(db, "services"), where("userId", "==", user.uid));

//     return onSnapshot(q, (snap) => {
//       const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       arr.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
//       setServices(arr);
//       setServicesLoading(false);
//     });
//   }, [user]);

//   //---------------------------------------------------------------
//   // 24 HOURS STREAM
//   //---------------------------------------------------------------
//   useEffect(() => {
//     if (!user) return;
//     setJobs24Loading(true);

//     const q = query(collection(db, "service_24h"), where("userId", "==", user.uid));

//     return onSnapshot(q, (snap) => {
//       const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       arr.sort(
//         (a, b) =>
//           (b.created_at?.seconds || b.createdAt?.seconds || 0) -
//           (a.created_at?.seconds || a.createdAt?.seconds || 0)
//       );

//       setJobs24(arr);
//       setJobs24Loading(false);
//     });
//   }, [user]);

//   //---------------------------------------------------------------
//   // PAUSE
//   //---------------------------------------------------------------
//   async function togglePause(job, collectionName, e) {
//     e.stopPropagation();
//     try {
//       await updateDoc(doc(db, collectionName, job.id), {
//         paused: !job.paused,
//         pausedAt: !job.paused ? serverTimestamp() : null,
//       });
//     } catch (err) {}
//   }

//   //---------------------------------------------------------------
//   // SEARCH + SORT
//   //---------------------------------------------------------------
//   const filterSearch = (arr) => {
//     if (!searchText) return arr;
//     const t = searchText.toLowerCase();
//     return arr.filter((i) => (i.title || "").toLowerCase().includes(t));
//   };

//   const sortArr = (arr) => {
//     if (sortOption === "paused") return arr.filter((i) => i.paused);

//     if (sortOption === "oldest")
//       return [...arr].sort(
//         (a, b) =>
//           (a.createdAt?.seconds || a.created_at?.seconds || 0) -
//           (b.createdAt?.seconds || b.created_at?.seconds || 0)
//       );

//     return [...arr].sort(
//       (a, b) =>
//         (b.createdAt?.seconds || b.created_at?.seconds || 0) -
//         (a.createdAt?.seconds || a.created_at?.seconds || 0)
//     );
//   };

//   const finalServices = sortArr(filterSearch(services));
//   const final24 = sortArr(filterSearch(jobs24));

//   //---------------------------------------------------------------
//   // EMPTY STATE
//   //---------------------------------------------------------------
//   const renderEmptyState = (btnText, onClick) => (
//     <div style={styles.emptyWrap}>
//       <img src={serviceEmpty} style={styles.emptyImg} />
//       <div style={styles.emptyTitle}>Start your first service today.</div>
//       <div style={styles.emptySub}>
//    Post a job with clear details to find toShowcase your skills with a service offering that attracts the right clients. Start now and turn your expertise into opportunities!p freelancers who can bring your vision to life.     Start by creating your first post so that clients can discover
//         your work and reach out to you.
//       </div>

//       <button style={styles.emptyBtn} onClick={onClick}>
//         {btnText}
//       </button>
//     </div>
//   );

//   //---------------------------------------------------------------
//   // CARD UI — SHARED
//   //---------------------------------------------------------------
//   const WorkCard = (job) => {
//     const initials = getInitials(job.title);

//     return (
//       <div
//         key={job.id}
//         style={styles.card}
//         onClick={() => navigate(`/serviceDetailsModel/${job.id}`, { state: { job } })}
//       >
//         <img src={arrow} style={styles.cardArrow} />

//         <div style={{ display: "flex" }}>
//           <div style={{ ...styles.avatarBox, width: 56, height: 66, fontSize: 20,marginLeft:"1px",paddingLeft:"14px", textAlign:"center" }}>
//             {initials}
//           </div>

//           <div style={{ flex: 1, marginLeft: 27 }}>
//             <div style={{ ...styles.jobTitle, fontSize: 16 }}>{job.title}</div>

//             <div style={styles.skillsRowWrapper}>
//               {job.skills?.slice(0, 2).map((s, i) => (
//                 <div key={i} style={styles.skillChip}>{s}</div>
//               ))}
//               {job.skills?.length > 2 && (
//                 <div style={styles.moreChip}>+{job.skills.length - 2}</div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div style={styles.jobInfoRow}>
//           <div>
//             <div style={styles.label}>Budget</div>
//             <div style={{ ...styles.value, ...styles.valueHighlight }}>
//               ₹{formatBudget(job.budget_from || job.budget)}
//             </div>
//           </div>

//           <div>
//             <div style={styles.label}>Timeline</div>
//             <div style={styles.value}>{job.deliveryDuration || "N/A"}</div>
//           </div>

//           <div>
//             <div style={styles.label}>Location</div>
//             <div style={styles.value}>{job.location || "Remote"}</div>
//           </div>
//         </div>

//         <div style={styles.buttonRow}>
//           <button
//             style={styles.secondaryBtn}
//             onClick={(e) => togglePause(job, "services", e)}
//           >
//             {job.paused ? "Unpause" : "Pause Service"}
//           </button>

//           <button
//             style={styles.primaryBtn}
//             onClick={(e) => {
//               e.stopPropagation();
//               navigate(`/freelance-dashboard/freelanceredit-service/${job.id}`, {
//                 state: { jobId: job.id, jobData: job },
//               });
//             }}
//           >
//             Edit Service
//           </button>
//         </div>
//       </div>
//     );
//   };

//   const Card24 = (job) => {
//     const initials = getInitials(job.title);

//     return (
//       <div
//         key={job.id}
//         style={styles.card}
//         onClick={() => navigate(`/service-24h/${job.id}`, { state: { job } })}
//       >
//         <img src={arrow} style={styles.cardArrow} />

//         <div style={{ display: "flex" }}>
//           <div style={{ ...styles.avatarBox, width: 60, height: 60, fontSize: 22 }}>
//             {initials}
//           </div>

//           <div style={{ flex: 1, marginLeft: 12 }}>
//             <div style={{ ...styles.jobTitle, fontSize: 16 }}>{job.title}</div>

//             <div style={styles.skillsRowWrapper}>
//               {job.skills?.slice(0, 2).map((s, i) => (
//                 <div key={i} style={styles.skillChip}>{s}</div>
//               ))}
//               {job.skills?.length > 2 && (
//                 <div style={styles.moreChip}>+{job.skills.length - 2}</div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div style={styles.jobInfoRow}>
//           <div>
//             <div style={styles.label}>Budget</div>
//             <div style={{ ...styles.value, ...styles.valueHighlight }}>
//               ₹{formatBudget(job.budget_from || job.budget)}
//             </div>
//           </div>

//           <div>
//             <div style={styles.label}>Timeline</div>
//             <div style={styles.value}>{job.deliveryDuration || "N/A"}</div>
//           </div>

//           <div>
//             <div style={styles.label}>Location</div>
//             <div style={styles.value}>{job.location || "Remote"}</div>
//           </div>
//         </div>

//         <div style={styles.buttonRow}>
//           <button
//             style={styles.secondaryBtn}
//             onClick={(e) => togglePause(job, "service_24h", e)}
//           >
//             {job.paused ? "Unpause" : "Pause Service"}
//           </button>

//           <button
//             style={styles.primaryBtn}
//             onClick={(e) => {
//               e.stopPropagation();
//               navigate(`/service-24h-edit/${job.id}`, { state: { job } });
//             }}
//           >
//             Edit Service
//           </button>
//         </div>
//       </div>
//     );
//   };

//   //---------------------------------------------------------------
//   // RENDER CARDS
//   //---------------------------------------------------------------
//   const renderCards = () => {
//     if (selectedTab === "Works") {
//       if (servicesLoading) return <div style={{ marginTop: 40 }}>Loading...</div>;
//       if (finalServices.length === 0)
//         return renderEmptyState("Create Service", () => navigate("/freelance-dashboard/add-service-form"));

//       return finalServices.map(WorkCard);
//     }

//     if (selectedTab === "24 Hours") {
//       if (jobs24Loading) return <div style={{ marginTop: 40 }}>Loading...</div>;
//       if (final24.length === 0)
//         return renderEmptyState("Create 24h Service", () => navigate("/freelance-dashboard/add-service-form"));

//       return final24.map(Card24);
//     }
//   };

//   //---------------------------------------------------------------
//   // MAIN UI
//   //---------------------------------------------------------------
//   return (
//     <div style={styles.page}>
//       {/* HEADER */}
//       <div style={styles.headerRowWrap}>
//         <div style={styles.backbtn} onClick={() => navigate(-1)}>
//           <img src={backarrow} style={{ width: 17, height: 19 }} />
//         </div>

//         <div style={styles.headerTextBlock}>
//           <div style={styles.headerTitle}>Your Service</div>
//           <div style={styles.headerSubtitle}>List Your service, Reach More People</div>
//         </div>
//       </div>

//       {/* TABS */}
//       <div style={styles.toggleBarWrapper}>
//         <div style={styles.toggleGroup}>
//           <div
//             tabIndex={0}
//             onClick={() => setSelectedTab("Works")}
//             style={styles.toggleButton(selectedTab === "Works")}
//           >
//             Works
//           </div>

//           <div
//             tabIndex={0}
//             onClick={() => setSelectedTab("24 Hours")}
//             style={styles.toggleButton(selectedTab === "24 Hours")}
//           >
//             24 Hours
//           </div>
//         </div>
//       </div>

//       {/* SEARCH + SORT */}
//       <div style={styles.searchSortRow}>
//         <div style={styles.searchContainer}>
//           <span><img src={search} alt="search" style={{width:"20px"}} /></span>
//           <input
//             style={styles.searchInput}
//             placeholder="Search services"
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//           />
//         </div>

//         <div style={styles.sortButtonWrapper} ref={sortRef}>
//           <div style={styles.sortBtnBox} onClick={() => setSortMenuOpen(!sortMenuOpen)}>Sort</div>

//           {sortMenuOpen && (
//             <div style={styles.sortMenu}>
//               <div style={styles.sortMenuItem} onClick={() => setSortOption("newest")}>Newest</div>
//               <div style={styles.sortMenuItem} onClick={() => setSortOption("oldest")}>Oldest</div>
//               <div style={styles.sortMenuItem} onClick={() => setSortOption("paused")}>Paused</div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* CARDS */}
//       <div style={styles.cardsWrap}>{renderCards()}</div>

//       {/* FAB */}
//       <button style={styles.fab} onClick={() => navigate("/freelance-dashboard/add-service-form")}>+</button>
//     </div>
//   );
// }


import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firbase/Firebase";

import backarrow from "../assets/backarrow.png";
import arrow from "../assets/arrow.png";
import serviceEmpty from "../assets/service.png";
import search from "../assets/search.png";

//---------------------------------------------------------------
// SIDEBAR SUPPORT (ADDED)
//---------------------------------------------------------------
const useSidebar = () => {
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }

    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  return collapsed;
};

//---------------------------------------------------------------
// STYLES
//---------------------------------------------------------------
const styles = {
  page: {
    backgroundColor: "#FFFFFF",
    minHeight: "100vh",
    fontFamily:
      "'Rubik', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 80,
    width:"100%"
  },

  headerRowWrap: {
    width: 928,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: 32,
  },

  headerTextBlock: { display: "flex", flexDirection: "column", marginLeft: 4 },
  headerTitle: { fontWeight: 400, fontSize: "36px", lineHeight: "28px" },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 15,
    fontWeight: 400,
    marginLeft: -40,
  },

  backbtn: {
    width: 30,
    height: 30,
    borderRadius: 14,
    border: "0.8px solid #ccc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    flexShrink: 0,
    marginBottom: 18,
  },

  // Tabs
  toggleBarWrapper: {
    width: 928,
    height: 52,
    borderRadius: 16,
    padding: 6,
    display: "flex",
    alignItems: "center",
    marginTop: 18,
    marginLeft: 32,
    backgroundColor: "#FFF8E1",
    boxShadow: "0 2px 8px rgba(16,24,40,0.04)",
  },
  toggleGroup: {
    width: 335,
    height: 36,
    display: "flex",
    gap: 6,
    borderRadius: 14,
    alignItems: "center",
    padding: 4,
  },
  toggleButton: (active) => ({
    width: 165,
    height: 36,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: active ? "#FFFFFF" : "#FFF8E1",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: active ? "0 4px 10px rgba(124,60,255,0.06)" : "none",
  }),

  // Search + Sort
  searchSortRow: {
    width: 928,
    display: "flex",
    gap: 12,
    alignItems: "center",
    marginTop: 16,
    marginLeft: 32,
    paddingRight: 32,
  },

  searchContainer: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    border: "1px solid #DADADA",
    paddingLeft: 14,
    paddingRight: 14,
    display: "flex",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginLeft: 20,
  },

  searchInput: {
    border: "none",
    outline: "none",
    flex: 1,
    marginLeft: 1,
    marginTop: 15,
    fontSize: 14,
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
    fontWeight: 600,
  },

  sortMenu: {
    position: "absolute",
    top: 48,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    padding: 8,
    minWidth: 180,
    zIndex: 90,
  },

  sortMenuItem: {
    padding: "8px 12px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    fontSize: 14,
  },

  // Cards grid
  cardsWrap: {
    width: 928,
    marginTop: 24,
    marginLeft: 32,
    display: "grid",
    gridTemplateColumns: "repeat(2, 446px)",
    gap: "24px 24px",
  },

  // Card
  card: {
    width: 420,
    height: 220,
    borderRadius: 24,
    border: "0.8px solid #DADADA",
    backgroundColor: "#FFFFFF",
    padding: 20,
    boxShadow: "0 8px 20px rgba(16,24,40,0.04)",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
  },

  cardArrow: { width: 16, height: 16, position: "absolute", top: 20, right: 20 },

  avatarBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    background:
      "linear-gradient(135deg, #51A2FF, #9B42FF 60%, #AD46FF)",
    color: "#FFF",
    fontWeight: 700,
  },

  jobTitle: {
    fontWeight: 500,
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
    padding: "4px 12px",
    marginRight: 8,
    borderRadius: 20,
    border: "1px solid rgba(255,255,190,1)",
    backgroundColor: "rgba(255,255,190,1)",
    fontSize: 14,
    whiteSpace: "nowrap",
  },

  moreChip: {
    padding: "4px 12px",
    borderRadius: 20,
    backgroundColor: "rgba(255,255,190,1)",
    fontSize: 11,
  },

  jobInfoRow: { display: "flex", justifyContent: "space-between" },
  label: { fontSize: 15 },
  value: { marginTop: 4, fontSize: 13, fontWeight: 500 },
  valueHighlight: { color: "rgba(124,60,255,1)" },

  buttonRow: {
    display: "flex",
    gap: 12,
  },

  secondaryBtn: {
    flex: 1,
    height: 40,
    borderRadius: 30,
    border: "1px solid #BDBDBD",
    backgroundColor: "#FFFFFF",
    fontSize: 13,
    fontWeight: 600,
  },

  primaryBtn: {
    flex: 1,
    height: 40,
    borderRadius: 30,
    border: "none",
    backgroundColor: "rgba(253,253,150,1)",
    fontWeight: 700,
  },

  emptyWrap: {
    width: 928,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 40,
    gridColumn: "1 / span 2",
  },

  emptyImg: { width: 260, marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: 600, marginBottom: 6 },
  emptySub: {
    fontSize: 14,
    width: 810,
    textAlign: "center",
    lineHeight: "20px",
    color: "#444",
    marginBottom: 20,
  },

  emptyBtn: {
    height: 44,
    padding: "0 22px",
    borderRadius: 30,
    backgroundColor: "rgba(253,253,150,1)",
    border: "none",
    color: "#000",
    cursor: "pointer",
    fontWeight: 600,
  },

  fab: {
    position: "fixed",
    right: 32,
    bottom: 32,
    width: 64,
    height: 64,
    borderRadius: "50%",
    backgroundColor: "rgba(124,60,255,1)",
    color: "#FFF",
    fontSize: 32,
    border: "none",
    cursor: "pointer",
    boxShadow: "0 8px 16px rgba(124,60,255,0.4)",
  },
};

//---------------------------------------------------------------
// HELPERS
//---------------------------------------------------------------
function formatBudget(val) {
  if (!val) return 0;
  const num = Number(val);
  if (num >= 100000) return (num / 100000).toFixed(1) + "L";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num;
}

function getInitials(title) {
  if (!title) return "";
  const w = title.trim().split(" ");
  if (w.length > 1) return (w[0][0] + w[1][0]).toUpperCase();
  return w[0][0].toUpperCase();
}

//---------------------------------------------------------------
// MAIN COMPONENT
//---------------------------------------------------------------
export default function ServiceScreenOne() {
  const navigate = useNavigate();
  const auth = getAuth();

  // ⭐ ADDED SIDEBAR LOGIC
  const collapsed = useSidebar();

  const [selectedTab, setSelectedTab] = useState("Works");
  const [searchText, setSearchText] = useState("");

  const [services, setServices] = useState([]);
  const [jobs24, setJobs24] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [jobs24Loading, setJobs24Loading] = useState(true);

  const [user, setUser] = useState(null);

  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const sortRef = useRef(null);

  //---------------------------------------------------------------
  // AUTH
  //---------------------------------------------------------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  //---------------------------------------------------------------
  // WORKS STREAM
  //---------------------------------------------------------------
  useEffect(() => {
    if (!user) return;
    setServicesLoading(true);

    const q = query(
      collection(db, "services"),
      where("userId", "==", user.uid)
    );

    return onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      arr.sort(
        (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
      );
      setServices(arr);
      setServicesLoading(false);
    });
  }, [user]);

  //---------------------------------------------------------------
  // 24 HOURS STREAM
  //---------------------------------------------------------------
  useEffect(() => {
    if (!user) return;
    setJobs24Loading(true);

    const q = query(
      collection(db, "service_24h"),
      where("userId", "==", user.uid)
    );

    return onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      arr.sort(
        (a, b) =>
          (b.created_at?.seconds || b.createdAt?.seconds || 0) -
          (a.created_at?.seconds || a.createdAt?.seconds || 0)
      );

      setJobs24(arr);
      setJobs24Loading(false);
    });
  }, [user]);

  //---------------------------------------------------------------
  // PAUSE JOB
  //---------------------------------------------------------------
  async function togglePause(job, collectionName, e) {
    e.stopPropagation();
    try {
      await updateDoc(doc(db, collectionName, job.id), {
        paused: !job.paused,
        pausedAt: !job.paused ? serverTimestamp() : null,
      });
    } catch (err) {}
  }

  //---------------------------------------------------------------
  // SEARCH + SORT
  //---------------------------------------------------------------
  const filterSearch = (arr) => {
    if (!searchText) return arr;
    const t = searchText.toLowerCase();
    return arr.filter((i) => (i.title || "").toLowerCase().includes(t));
  };

  const sortArr = (arr) => {
    if (sortOption === "paused") return arr.filter((i) => i.paused);

    if (sortOption === "oldest")
      return [...arr].sort(
        (a, b) =>
          (a.createdAt?.seconds || a.created_at?.seconds || 0) -
          (b.createdAt?.seconds || b.created_at?.seconds || 0)
      );

    return [...arr].sort(
      (a, b) =>
        (b.createdAt?.seconds || b.created_at?.seconds || 0) -
        (a.createdAt?.seconds || a.created_at?.seconds || 0)
    );
  };

  const finalServices = sortArr(filterSearch(services));
  const final24 = sortArr(filterSearch(jobs24));

  //---------------------------------------------------------------
  // EMPTY STATE
  //---------------------------------------------------------------
  const renderEmptyState = (btnText, onClick) => (
    <div style={styles.emptyWrap}>
      <img src={serviceEmpty} style={styles.emptyImg} />
      <div style={styles.emptyTitle}>Start your first service today.</div>
      <div style={styles.emptySub}>
        Showcase your skills with a service offering that attracts the right
        clients. Start now and turn your expertise into opportunities!
      </div>

      <button style={styles.emptyBtn} onClick={onClick}>
        {btnText}
      </button>
    </div>
  );

  //---------------------------------------------------------------
  // CARD COMPONENTS
  //---------------------------------------------------------------
  const WorkCard = (job) => {
    const initials = getInitials(job.title);

    return (
      <div
        key={job.id}
        style={styles.card}
        onClick={() =>
          navigate(`/serviceDetailsModel/${job.id}`, { state: { job } })
        }
      >
        <img src={arrow} style={styles.cardArrow} />

        <div style={{ display: "flex" }}>
          <div
            style={{
              ...styles.avatarBox,
              width: 56,
              height: 66,
              fontSize: 20,
              marginLeft: "1px",
              paddingLeft: "14px",
              textAlign: "center",
            }}
          >
            {initials}
          </div>

          <div style={{ flex: 1, marginLeft: 27 }}>
            <div style={{ ...styles.jobTitle, fontSize: 16 }}>{job.title}</div>

            <div style={styles.skillsRowWrapper}>
              {job.skills?.slice(0, 2).map((s, i) => (
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
            <div style={{ ...styles.value, ...styles.valueHighlight }}>
              ₹{formatBudget(job.budget_from || job.budget)}
            </div>
          </div>

          <div>
            <div style={styles.label}>Timeline</div>
            <div style={styles.value}>{job.deliveryDuration || "N/A"}</div>
          </div>

          <div>
            <div style={styles.label}>Location</div>
            <div style={styles.value}>{job.location || "Remote"}</div>
          </div>
        </div>

        <div style={styles.buttonRow}>
          <button
            style={styles.secondaryBtn}
            onClick={(e) => togglePause(job, "services", e)}
          >
            {job.paused ? "Unpause" : "Pause Service"}
          </button>

          <button
            style={styles.primaryBtn}
            onClick={(e) => {
              e.stopPropagation();
              navigate(
                `/freelance-dashboard/freelanceredit-service/${job.id}`,
                {
                  state: { jobId: job.id, jobData: job },
                }
              );
            }}
          >
            Edit Service
          </button>
        </div>
      </div>
    );
  };

  const Card24 = (job) => {
    const initials = getInitials(job.title);

    return (
      <div
        key={job.id}
        style={styles.card}
        onClick={() =>
          navigate(`/service-24h/${job.id}`, { state: { job } })
        }
      >
        <img src={arrow} style={styles.cardArrow} />

        <div style={{ display: "flex" }}>
          <div
            style={{
              ...styles.avatarBox,
              width: 60,
              height: 60,
              fontSize: 22,
            }}
          >
            {initials}
          </div>

          <div style={{ flex: 1, marginLeft: 12 }}>
            <div style={{ ...styles.jobTitle, fontSize: 16 }}>{job.title}</div>

            <div style={styles.skillsRowWrapper}>
              {job.skills?.slice(0, 2).map((s, i) => (
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
            <div style={{ ...styles.value, ...styles.valueHighlight }}>
              ₹{formatBudget(job.budget_from || job.budget)}
            </div>
          </div>

          <div>
            <div style={styles.label}>Timeline</div>
            <div style={styles.value}>{job.deliveryDuration || "N/A"}</div>
          </div>

          <div>
            <div style={styles.label}>Location</div>
            <div style={styles.value}>{job.location || "Remote"}</div>
          </div>
        </div>

        <div style={styles.buttonRow}>
          <button
            style={styles.secondaryBtn}
            onClick={(e) => togglePause(job, "service_24h", e)}
          >
            {job.paused ? "Unpause" : "Pause Service"}
          </button>

          <button
            style={styles.primaryBtn}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/service-24h-edit/${job.id}`, { state: { job } });
            }}
          >
            Edit Service
          </button>
        </div>
      </div>
    );
  };

  //---------------------------------------------------------------
  // RENDER CARDS
  //---------------------------------------------------------------
  const renderCards = () => {
    if (selectedTab === "Works") {
      if (servicesLoading) return <div style={{ marginTop: 40 }}>Loading...</div>;
      if (finalServices.length === 0)
        return renderEmptyState("Create Service", () =>
          navigate("/freelance-dashboard/add-service-form")
        );

      return finalServices.map(WorkCard);
    }

    if (selectedTab === "24 Hours") {
      if (jobs24Loading) return <div style={{ marginTop: 40 }}>Loading...</div>;
      if (final24.length === 0)
        return renderEmptyState("Create 24h Service", () =>
          navigate("/freelance-dashboard/add-service-form")
        );

      return final24.map(Card24);
    }
  };

  //---------------------------------------------------------------
  // MAIN UI WITH SIDEBAR OFFSET
  //---------------------------------------------------------------
  return (
    <div
      style={{
        ...styles.page,
        marginLeft: collapsed ? "-280px" : "-70px",
        transition: "margin-left 0.25s ease",
      }}
    >
      {/* HEADER */}
      <div style={styles.headerRowWrap}>
        <div style={styles.backbtn} onClick={() => navigate(-1)}>
          <img src={backarrow} style={{ width: 17, height: 19 }} />
        </div>

        <div style={styles.headerTextBlock}>
          <div style={styles.headerTitle}>Your Service</div>
          <div style={styles.headerSubtitle}>
            List Your service, Reach More People
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={styles.toggleBarWrapper}>
        <div style={styles.toggleGroup}>
          <div
            tabIndex={0}
            onClick={() => setSelectedTab("Works")}
            style={styles.toggleButton(selectedTab === "Works")}
          >
            Works
          </div>

          <div
            tabIndex={0}
            onClick={() => setSelectedTab("24 Hours")}
            style={styles.toggleButton(selectedTab === "24 Hours")}
          >
            24 Hours
          </div>
        </div>
      </div>

      {/* SEARCH + SORT */}
      <div style={styles.searchSortRow}>
        <div style={styles.searchContainer}>
          <span>
            <img src={search} alt="search" style={{ width: "20px" }} />
          </span>
          <input
            style={styles.searchInput}
            placeholder="Search services"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div style={styles.sortButtonWrapper} ref={sortRef}>
          <div
            style={styles.sortBtnBox}
            onClick={() => setSortMenuOpen(!sortMenuOpen)}
          >
            Sort
          </div>

          {sortMenuOpen && (
            <div style={styles.sortMenu}>
              <div
                style={styles.sortMenuItem}
                onClick={() => setSortOption("newest")}
              >
                Newest
              </div>
              <div
                style={styles.sortMenuItem}
                onClick={() => setSortOption("oldest")}
              >
                Oldest
              </div>
              <div
                style={styles.sortMenuItem}
                onClick={() => setSortOption("paused")}
              >
                Paused
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CARDS */}
      <div style={styles.cardsWrap}>{renderCards()}</div>

      {/* FAB */}
      <button
        style={styles.fab}
        onClick={() => navigate("/freelance-dashboard/add-service-form")}
      >
        +
      </button>
    </div>
  );
}
