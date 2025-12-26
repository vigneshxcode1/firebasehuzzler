// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   query,
//   where,
//   updateDoc,
//   serverTimestamp,
// } from "firebase/firestore";

// import { db } from "../firbase/Firebase";

// import backarrow from "../assets/backarrow.png";
// import arrow from "../assets/arrow.png";
// import serviceEmpty from "../assets/service.png";
// import search from "../assets/search.png";

// //---------------------------------------------------------------
// // SIDEBAR SUPPORT (ADDED)
// //---------------------------------------------------------------
// const useSidebar = () => {
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }

//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   return collapsed;
// };

// //---------------------------------------------------------------
// // STYLES
// //---------------------------------------------------------------
// const styles = {
//   page: {
//     backgroundColor: "#FFFFFF",
//     minHeight: "100vh",
//     fontFamily:
//       "'Rubik', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     paddingTop: 32,
//     paddingBottom: 80,
//     width:"100%"
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
//   headerSubtitle: {
//     fontSize: 14,
//     marginTop: 15,
//     fontWeight: 400,
//     marginLeft: -40,
//   },

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
//     marginLeft: 20,
//   },

//   searchInput: {
//     border: "none",
//     outline: "none",
//     flex: 1,
//     marginLeft: 1,
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
//     background:
//       "linear-gradient(135deg, #51A2FF, #9B42FF 60%, #AD46FF)",
//     color: "#FFF",
//     fontWeight: 700,
//   },

//   jobTitle: {
//     fontWeight: 500,
//     marginBottom: 4,
//     fontSize: 18,
//     textTransform: "uppercase",
//   },

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
//     backgroundColor: "rgba(253,253,150,1)",
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

//   // ⭐ ADDED SIDEBAR LOGIC
//   const collapsed = useSidebar();

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

//     const q = query(
//       collection(db, "services"),
//       where("userId", "==", user.uid)
//     );

//     return onSnapshot(q, (snap) => {
//       const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       arr.sort(
//         (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
//       );
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

//     const q = query(
//       collection(db, "service_24h"),
//       where("userId", "==", user.uid)
//     );

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
//   // PAUSE JOB
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
//         Showcase your skills with a service offering that attracts the right
//         clients. Start now and turn your expertise into opportunities!
//       </div>

//       <button style={styles.emptyBtn} onClick={onClick}>
//         {btnText}
//       </button>
//     </div>
//   );

//   //---------------------------------------------------------------
//   // CARD COMPONENTS
//   //---------------------------------------------------------------
//   const WorkCard = (job) => {
//     const initials = getInitials(job.title);

//     return (
//       <div
//         key={job.id}
//         style={styles.card}
//         onClick={() =>
//           navigate(`/serviceDetailsModel/${job.id}`, { state: { job } })
//         }
//       >
//         <img src={arrow} style={styles.cardArrow} />

//         <div style={{ display: "flex" }}>
//           <div
//             style={{
//               ...styles.avatarBox,
//               width: 56,
//               height: 66,
//               fontSize: 20,
//               marginLeft: "1px",
//               paddingLeft: "14px",
//               textAlign: "center",
//             }}
//           >
//             {initials}
//           </div>

//           <div style={{ flex: 1, marginLeft: 27 }}>
//             <div style={{ ...styles.jobTitle, fontSize: 16 }}>{job.title}</div>

//             <div style={styles.skillsRowWrapper}>
//               {job.skills?.slice(0, 2).map((s, i) => (
//                 <div key={i} style={styles.skillChip}>
//                   {s}
//                 </div>
//               ))}
//               {job.skills?.length > 2 && (
//                 <div style={styles.moreChip}>
//                   +{job.skills.length - 2}
//                 </div>
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
//               navigate(
//                 `/freelance-dashboard/freelanceredit-service/${job.id}`,
//                 {
//                   state: { jobId: job.id, jobData: job },
//                 }
//               );
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
//         onClick={() =>
//           navigate(`/service-24h/${job.id}`, { state: { job } })
//         }
//       >
//         <img src={arrow} style={styles.cardArrow} />

//         <div style={{ display: "flex" }}>
//           <div
//             style={{
//               ...styles.avatarBox,
//               width: 60,
//               height: 60,
//               fontSize: 22,
//             }}
//           >
//             {initials}
//           </div>

//           <div style={{ flex: 1, marginLeft: 12 }}>
//             <div style={{ ...styles.jobTitle, fontSize: 16 }}>{job.title}</div>

//             <div style={styles.skillsRowWrapper}>
//               {job.skills?.slice(0, 2).map((s, i) => (
//                 <div key={i} style={styles.skillChip}>
//                   {s}
//                 </div>
//               ))}
//               {job.skills?.length > 2 && (
//                 <div style={styles.moreChip}>
//                   +{job.skills.length - 2}
//                 </div>
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
//         return renderEmptyState("Create Service", () =>
//           navigate("/freelance-dashboard/add-service-form")
//         );

//       return finalServices.map(WorkCard);
//     }

//     if (selectedTab === "24 Hours") {
//       if (jobs24Loading) return <div style={{ marginTop: 40 }}>Loading...</div>;
//       if (final24.length === 0)
//         return renderEmptyState("Create 24h Service", () =>
//           navigate("/freelance-dashboard/add-service-form")
//         );

//       return final24.map(Card24);
//     }
//   };

//   //---------------------------------------------------------------
//   // MAIN UI WITH SIDEBAR OFFSET
//   //---------------------------------------------------------------
//   return (
//     <div
//       style={{
//         ...styles.page,
//         marginLeft: collapsed ? "-280px" : "-150px",
//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       {/* HEADER */}
//       <div style={styles.headerRowWrap}>
//         <div style={styles.backbtn} onClick={() => navigate(-1)}>
//           <img src={backarrow} style={{ width: 17, height: 19 }} />
//         </div>

//         <div style={styles.headerTextBlock}>
//           <div style={styles.headerTitle}>Your Service</div>
//           <div style={styles.headerSubtitle}>
//             List Your service, Reach More People
//           </div>
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
//           <span>
//             <img src={search} alt="search" style={{ width: "20px" }} />
//           </span>
//           <input
//             style={styles.searchInput}
//             placeholder="Search services"
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//           />
//         </div>

//         <div style={styles.sortButtonWrapper} ref={sortRef}>
//           <div
//             style={styles.sortBtnBox}
//             onClick={() => setSortMenuOpen(!sortMenuOpen)}
//           >
//             Sort
//           </div>

//           {sortMenuOpen && (
//             <div style={styles.sortMenu}>
//               <div
//                 style={styles.sortMenuItem}
//                 onClick={() => setSortOption("newest")}
//               >
//                 Newest
//               </div>
//               <div
//                 style={styles.sortMenuItem}
//                 onClick={() => setSortOption("oldest")}
//               >
//                 Oldest
//               </div>
//               <div
//                 style={styles.sortMenuItem}
//                 onClick={() => setSortOption("paused")}
//               >
//                 Paused
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* CARDS */}
//       <div style={styles.cardsWrap}>{renderCards()}</div>

//       {/* FAB */}
//       <button
//         style={styles.fab}
//         onClick={() => navigate("/freelance-dashboard/add-service-form")}
//       >
//         +
//       </button>
//     </div>
//   );
// }



import React, { useEffect, useRef, useState } from "react";
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
// MAIN COMPONENT
//---------------------------------------------------------------
export default function ServiceScreenOne() {
  const navigate = useNavigate();
  const auth = getAuth();
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

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // ---------------------------------------------------------------
  // HANDLE RESIZE FOR RESPONSIVENESS
  // ---------------------------------------------------------------
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

    const q = query(collection(db, "services"), where("userId", "==", user.uid));

    return onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      arr.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
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

    const q = query(collection(db, "service_24h"), where("userId", "==", user.uid));

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

  const renderEmptyState = (btnText, onClick) => (
    <div
      style={{
        width: isMobile ? "90%" : 928,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 40,
        gridColumn: "1 / span 2",
      }}
    >
      <img src={serviceEmpty} style={{ width: isMobile ? 200 : 260, marginBottom: 20 }} />
      <div style={{ fontSize: isMobile ? 18 : 20, fontWeight: 600, marginBottom: 6 }}>
        Start your first service today.
      </div>
      <div
        style={{
          fontSize: 14,
          width: isMobile ? "95%" : 810,
          textAlign: "center",
          lineHeight: "20px",
          color: "#444",
          marginBottom: 20,
        }}
      >
        Showcase your skills with a service offering that attracts the right
        clients. Start now and turn your expertise into opportunities!
      </div>

      <button
        style={{
          height: 44,
          padding: "0 22px",
          borderRadius: 30,
          backgroundColor: "rgba(253,253,150,1)",
          border: "none",
          color: "#000",
          cursor: "pointer",
          fontWeight: 600,
        }}
        onClick={onClick}
      >
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
        style={{
          width: isMobile ? "100%" : 420,
          height: isMobile ? "auto" : 220,
          borderRadius: 24,
          border: "0.8px solid #DADADA",
          backgroundColor: "#FFFFFF",
          padding: 16,
          marginBottom: 16,
          boxShadow: "0 8px 20px rgba(16,24,40,0.04)",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
        }}
        onClick={() => navigate(`/serviceDetailsModel/${job.id}`, { state: { job } })}
      >
        <img src={arrow} style={{ width: 16, height: 16, position: "absolute", top: 16, right: 16 }} />

        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background:
                "linear-gradient(135deg, #51A2FF, #9B42FF 60%, #AD46FF)",
              color: "#FFF",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              marginBottom: isMobile ? 12 : 0,
            }}
          >
            {initials}
          </div>

          <div style={{ flex: 1, marginLeft: isMobile ? 0 : 27 }}>
            <div style={{ fontWeight: 500, fontSize: 16, textTransform: "uppercase", marginBottom: 4 }}>
              {job.title}
            </div>

            <div style={{ display: "flex", overflowX: "auto", gap: 8 }}>
              {job.skills?.slice(0, 2).map((s, i) => (
                <div key={i} style={{ padding: "4px 12px", borderRadius: 20, border: "1px solid rgba(255,255,190,1)", backgroundColor: "rgba(255,255,190,1)", fontSize: 14 }}>
                  {s}
                </div>
              ))}
              {job.skills?.length > 2 && <div style={{ padding: "4px 12px", borderRadius: 20, backgroundColor: "rgba(255,255,190,1)", fontSize: 11 }}>+{job.skills.length - 2}</div>}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 15 }}>Budget</div>
            <div style={{ marginTop: 4, fontSize: 13, fontWeight: 500, color: "rgba(124,60,255,1)" }}>
              ₹{job.budget_from || job.budget}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 15 }}>Timeline</div>
            <div style={{ marginTop: 4, fontSize: 13, fontWeight: 500 }}>{job.deliveryDuration || "N/A"}</div>
          </div>

          <div>
            <div style={{ fontSize: 15 }}>Location</div>
            <div style={{ marginTop: 4, fontSize: 13, fontWeight: 500 }}>{job.location || "Remote"}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 12, flexDirection: isMobile ? "column" : "row" }}>
          <button
            style={{ flex: 1, height: 40, borderRadius: 30, border: "1px solid #BDBDBD", backgroundColor: "#FFF", fontSize: 13, fontWeight: 600 }}
            onClick={(e) => togglePause(job, "services", e)}
          >
            {job.paused ? "Unpause" : "Pause Service"}
          </button>

          <button
            style={{ flex: 1, height: 40, borderRadius: 30, border: "none", backgroundColor: "rgba(253,253,150,1)", fontWeight: 700 }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/freelance-dashboard/freelanceredit-service/${job.id}`, { state: { job } });
            }}
          >
            Edit Service
          </button>
        </div>
      </div>
    );
  };

  // Card24 is similar, adapt width/height same as WorkCard for responsiveness
  const Card24 = (job) => <WorkCard {...job} />;

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
  // MAIN UI
  //---------------------------------------------------------------
  return (
    <div
      style={{
        marginLeft: isMobile ? 0 : collapsed ? "-450px" : "-90px",
        transition: "margin-left 0.25s ease",
        minHeight: "100vh",
        fontFamily: "'Rubik', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        paddingTop: 32,
        paddingBottom: 80,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          width: isMobile ? "90%" : 928,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <div
          style={{
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
          }}
          onClick={() => navigate(-1)}
        >
          <img src={backarrow} style={{ width: 17, height: 19 }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginLeft: isMobile ? 0 : 4 }}>
          <div style={{ fontWeight: 400, fontSize: isMobile ? 24 : 36 }}>Your Service</div>
          <div style={{ fontSize: 14, marginTop: 6, fontWeight: 400 }}>
            List Your service, Reach More People.
          </div>
        </div>
      </div>

      {/* TABS */}
      <div
        style={{
          width: isMobile ? "90%" : 928,
          height: 52,
          borderRadius: 16,
          padding: 6,
          display: "flex",
          alignItems: "center",
          marginTop: 18,
          backgroundColor: "#FFF8E1",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {["Works", "24 Hours"].map((tab) => (
          <div
            key={tab}
            onClick={() => setSelectedTab(tab)}
            style={{
              width: isMobile ? "45%" : 165,
              height: 36,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: selectedTab === tab ? "#FFF" : "#FFF8E1",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: selectedTab === tab ? "0 4px 10px rgba(124,60,255,0.06)" : "none",
            }}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* SEARCH + SORT */}
      <div
        style={{
          width: isMobile ? "80%" : 928,
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginTop: 18,
          flexDirection: isMobile ? "row" : "row",
        }}
      >
        <div
          style={{
            flex: 1,
            height: 44,
            borderRadius: 14,
            border: "1px solid #DADADA",
            paddingLeft: 14,
            paddingRight: 14,
            display: "flex",
            alignItems: "center",
            backgroundColor: "#FFF",
          }}
        >
          <img src={search} alt="search" style={{ width: "20px" }} />
          <input
            style={{ border: "none", outline: "none", flex: 1, marginLeft: 8, fontSize: 14 }}
            placeholder="Search services"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div style={{ position: "relative", marginTop: isMobile ? 8 : 0 }}>
          <div
            style={{
              minWidth: 90,
              height: 40,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #E0E0E0",
              background: "#FFF",
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={() => setSortMenuOpen(!sortMenuOpen)}
          >
            Sort
          </div>

          {sortMenuOpen && (
            <div
              style={{
                position: "absolute",
                top: 48,
                right: 0,
                backgroundColor: "#FFF",
                borderRadius: 12,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                padding: 8,
                minWidth: 180,
                zIndex: 90,
              }}
            >
              {["newest", "oldest", "paused"].map((opt) => (
                <div
                  key={opt}
                  style={{ padding: "8px 12px", cursor: "pointer", fontSize: 14 }}
                  onClick={() => {
                    setSortOption(opt);
                    setSortMenuOpen(false);
                  }}
                >
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CARDS */}
      <div
        style={{
          width: isMobile ? "90%" : 928,
          marginTop: 24,
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 446px)",
          gap: 24,
        }}
      >
        {renderCards()}
      </div>

      {/* FAB */}
      <button
        style={{
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
        }}
        onClick={() => navigate("/freelance-dashboard/add-service-form")}
      >
        +
      </button>
    </div>
  );
}
