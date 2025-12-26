// import React, { useEffect, useState, useMemo } from "react";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   updateDoc,
//   arrayUnion,
//   arrayRemove,
//   getDoc,
// } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth, db } from "../firbase/Firebase";
// import { Link, useNavigate } from "react-router-dom";

// import backarrow from "../assets/icons/backarrow.png";
// import message from "../assets/icons/message.png";
// import notification from "../assets/notification.png";
// import profile from "../assets/icons/profile.png";
// import save from "../assets/icons/save.png";
// import saved from "../assets/icons/saved.png";
// import search from "../assets/icons/search.png";
// import { MdAccessTime } from "react-icons/md";
// import { FaEye } from "react-icons/fa";

// // --------------------------------------------------
// // HELPER FUNCTIONS
// // --------------------------------------------------

// const formatAmount = (amount) => {
//   if (!amount) return "0";
//   const n = Number(amount);
//   if (n < 1000) return n;
//   if (n < 1000000) return (n / 1000).toFixed(1) + "K";
//   return (n / 1000000).toFixed(1) + "M";
// };

// const timeAgo = (date) => {
//   if (!date) return "";
//   const diff = Date.now() - date.getTime();
//   const mins = diff / 60000;
//   if (mins < 1) return "just now";
//   if (mins < 60) return `${Math.floor(mins)} min ago`;
//   const hrs = mins / 60;
//   if (hrs < 24) return `${Math.floor(hrs)} hr ago`;
//   const days = hrs / 24;
//   return `${Math.floor(days)} day${days > 1 ? "s" : ""} ago`;
// };

// const parseCreatedAt = (v) => {
//   if (!v) return new Date();
//   if (v instanceof Date) return v;
//   if (typeof v?.toDate === "function") return v.toDate();
//   return new Date(v);
// };

// // --------------------------------------------------
// // STYLES
// // --------------------------------------------------

// const styles = {
//   root: {
//     backgroundColor: "#FFFFFF",
//     minHeight: "100vh",
//     fontFamily: "'Rubik', sans-serif",
//     padding: "16px",
//     marginLeft:'50px'
//   },
//   topRow: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 12,
//     width: "100%",
//   },
//   leftRow: {
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//   },
//   backbtn: {
//     width: 38,
//     height: 38,
//     borderRadius: 12,
//     border: "1px solid #ccc",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     cursor: "pointer",
//     backgroundColor: "#fff",
//   },
//   backbtnimg: {
//     height: 18,
//     width: 18,
//   },
//   heading: {
//     fontSize: 34,
//     fontWeight: 500,
//   },
//   rightIcons: {
//     display: "flex",
//     alignItems: "center",
//     gap: 14,
//   },
//   iconImg: {
//     width: 31,
//     height: 29,
//     cursor: "pointer",
//   },
//   searchBar: {
//     width: "95%",
//     height: 48,
//     borderRadius: 25,
//     backgroundColor: "#F3F3F3",
//     display: "flex",
//     alignItems: "center",
//     padding: "0 16px",
//     marginBottom: 20,
//     marginTop: 30,
//     gap: 12,
//   },
//   searchIcon: {
//     width: 20,
//     height: 20,
//     opacity: 0.65,
//   },
//   searchInput: {
//     border: "none",
//     outline: "none",
//     background: "transparent",
//     width: "100%",
//     fontSize: 15,
//     fontFamily: "'Rubik', sans-serif",
//     marginTop: 15,
//   },
//   jobCard: {
//     cursor:"pointer",
//     width: "95%",
//     margin: "0 auto",
//     borderRadius: 18,
//     backgroundColor: "#fff",
//     border: "1px solid #ececec",
//     padding: 16,
//     marginBottom: 16,
//     boxShadow: "0 3px 6px rgba(0,0,0,0.07)",
//   },
//   cardTop: {
//     display: "flex",
//     alignItems: "flex-start",
//     justifyContent: "space-between",
//     width: "100%",
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 400,
//     marginBottom: 6,
//     lineHeight: "20px",
//   },
//   meta: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     color: "#777",
//     fontSize: 12,
//     marginTop: 10,
//   },
//   time: {
//     marginLeft: "20px",
//   },
//   budgetTop: {
//     fontWeight: 600,
//     fontSize: 15,
//   },
//   saveIcon: {
//     cursor: "pointer",
//     width: 20,
//     height: 20,
//     marginTop: 6,
//   },
//   skillsrequired: {
//     fontWeight: 400,
//     fontSize: 14,
//     opacity: "70%",
//     marginTop: 10,
//   },
//   desc: {
//     marginTop: 10,
//     fontSize: 13,
//     color: "#555",
//     lineHeight: "18px",
//   },
//   chipsRow: {
//     marginTop: 10,
//     display: "flex",
//     flexWrap: "wrap",
//     gap: 6,
//   },
//   chip: {
//     backgroundColor: "rgba(255, 240, 133, 0.7)",
//     padding: "4px 10px",
//     borderRadius: 12,
//     fontSize: 12,
//   },
//   plusBtn: {
//     position: "fixed",
//     bottom: 26,
//     right: 26,
//     width: 58,
//     height: 58,
//     borderRadius: "50%",
//     backgroundColor: "#8b5cf6",
//     color: "#fff",
//     fontSize: 34,
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     cursor: "pointer",
//     boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//   },
// };

// // --------------------------------------------------
// // COMPONENT
// // --------------------------------------------------

// export default function SavedJobsScreen() {
//   const [currentUser, setCurrentUser] = useState(auth.currentUser);
//   const [worksJobs, setWorksJobs] = useState([]);
//   const [jobs24h, setJobs24h] = useState([]);
//   const [savedIds, setSavedIds] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [userProfile, setUserProfile] = useState(null);

//   const navigate = useNavigate();

//   // ------------------------------------
//   // ⭐ 1️⃣ SIDEBAR COLLAPSED STATE
//   // ------------------------------------
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   // ⭐ 2️⃣ LISTEN FOR SIDEBAR TOGGLE EVENT
//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);

//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   // Fetch profile
//   const fetchUserProfile = async (uid) => {
//     try {
//       const snap = await getDoc(doc(db, "users", uid));
//       if (snap.exists()) setUserProfile(snap.data());
//     } catch (e) {
//       console.error("Profile fetch error:", e);
//     }
//   };

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (!user) return;
//     fetchUserProfile(user.uid);
//   }, []);

//   useEffect(() => onAuthStateChanged(auth, (u) => setCurrentUser(u)), []);

//   useEffect(() =>
//     onSnapshot(collection(db, "jobs"), (snap) => {
//       setWorksJobs(
//         snap.docs.map((d) => {
//           const x = d.data();
//           return {
//             id: d.id,
//             title: x.title,
//             description: x.description,
//             budget_from: x.budget_from,
//             budget_to: x.budget_to,
//             views: x.views,
//             timeline: x.timeline,
//             skills: x.skills || [],
//             tools: x.tools || [],
//             created_at: parseCreatedAt(x.created_at),
//           };
//         })
//       );
//     })
//   , []);

//   useEffect(() =>
//     onSnapshot(collection(db, "jobs_24h"), (snap) => {
//       setJobs24h(
//         snap.docs.map((d) => {
//           const x = d.data();
//           return {
//             id: d.id,
//             title: x.title,
//             description: x.description,
//             budget: x.budget,
//             views: x.views,
//             skills: x.skills || [],
//             tools: x.tools || [],
//             created_at: parseCreatedAt(x.created_at),
//           };
//         })
//       );
//     })
//   , []);

//   useEffect(() => {
//     if (!currentUser) return;
//     return onSnapshot(doc(db, "users", currentUser.uid), (snap) => {
//       setSavedIds(snap.data()?.favoriteJobs || []);
//     });
//   }, [currentUser]);

//   const savedCombined = useMemo(() => {
//     const a = worksJobs.filter((j) => savedIds.includes(j.id));
//     const b = jobs24h.filter((j) => savedIds.includes(j.id));
//     return [...a, ...b];
//   }, [worksJobs, jobs24h, savedIds]);

//   const filteredJobs = useMemo(() => {
//     if (!searchQuery.trim()) return savedCombined;

//     const q = searchQuery.toLowerCase();

//     return savedCombined.filter((job) => {
//       const t = job.title?.toLowerCase().includes(q);
//       const d = job.description?.toLowerCase().includes(q);
//       const s = (job.skills || []).join(" ").toLowerCase().includes(q);
//       const tool = (job.tools || []).join(" ").toLowerCase().includes(q);
//       return t || d || s || tool;
//     });
//   }, [savedCombined, searchQuery]);

//   const toggleSave = async (jobId) => {
//     if (!currentUser) return;
//     const ref = doc(db, "users", currentUser.uid);
//     const exists = savedIds.includes(jobId);

//     await updateDoc(ref, {
//       favoriteJobs: exists ? arrayRemove(jobId) : arrayUnion(jobId),
//     });
//   };

//   const renderCard = (job) => {
//     const chips = [...job.skills, ...job.tools];

//     return (
//       <div
//         key={job.id}
//         style={styles.jobCard}
//         onClick={() => navigate(`/freelance-dashboard/job-full/${job.id}`)}
//       >
//         <div style={styles.cardTop}>
//           <div style={{ flex: 1 }}>
//             <div style={styles.title}>{job.title}</div>
//           </div>

//           <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", }}>
//             <div style={styles.budgetTop}>
//               {job.budget_from
//                 ? `₹${formatAmount(job.budget_from)} - ₹${formatAmount(job.budget_to)}`
//                 : `₹${formatAmount(job.budget)}`}
//             </div>

//             <img
//               src={savedIds.includes(job.id) ? save : saved}
//               style={styles.saveIcon}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 toggleSave(job.id);
//               }}
//             />
//           </div>
//         </div>

//         <div style={styles.skillsrequired}>Skills Required</div>
//         <div style={styles.chipsRow}>
//           {chips.slice(0, 3).map((c) => (
//             <span key={c} style={styles.chip}>{c}</span>
//           ))}
//           {chips.length > 3 && <span style={styles.chip}>+{chips.length - 3}</span>}
//         </div>

//         <div style={styles.desc}>{job.description}</div>

//         <div style={styles.meta}>
//           <FaEye size={14} /> {job.views}
//           <MdAccessTime size={14} style={styles.time} /> {timeAgo(job.created_at)}
//         </div>
//       </div>
//     );
//   };

//   // --------------------------------------------------
//   // ⭐ 3️⃣ WRAP ENTIRE UI WITH margin-left ANIMATION
//   // --------------------------------------------------

//   return (
//     <div
//       className="freelance-wrapper"
//       style={{
//         marginLeft: collapsed ? "-160px" : "50px",
//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       <div style={styles.root}>
//         {/* TOP ROW */}
//         <div style={styles.topRow}>
//           <div style={styles.leftRow}>
//             <div style={styles.backbtn} onClick={() => navigate(-1)}>
//               <img style={styles.backbtnimg} src={backarrow} />
//             </div>

//             <div style={styles.heading}>Saved Jobs</div>
//           </div>

//           <div style={styles.rightIcons}>
//             <img
//               onClick={() => navigate("/freelancermessages")}
//               src={message}
//               style={styles.iconImg}
//             />

//             <img src={notification} style={styles.iconImg} />

//             <div className="fh-avatar">
//               <Link to={"/client-dashbroad2/ClientProfile"}>
//                 <img
//                   src={
//                     userProfile?.profileImage ||
//                     profile ||
//                     "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
//                   }
//                 />
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* SEARCH BAR */}
//         <div style={styles.searchBar}>
//           <img src={search} style={styles.searchIcon} />
//           <input
//             style={styles.searchInput}
//             placeholder="Search"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>

//         {/* LIST */}
//         {!currentUser ? (
//           <div style={{ textAlign: "center", marginTop: 40 }}>
//             Login to see saved jobs
//           </div>
//         ) : filteredJobs.length === 0 ? (
//           <div style={{ textAlign: "center", marginTop: 40 }}>
//             No saved jobs found
//           </div>
//         ) : (
//           <div>{filteredJobs.map((job) => renderCard(job))}</div>
//         )}

//         {/* Floating + Button */}
//         <div style={styles.plusBtn}>+</div>
//       </div>
//     </div>
//   );
// }



// import React, { useEffect, useState, useMemo } from "react";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   updateDoc,
//   arrayUnion,
//   arrayRemove,
//   getDoc,
// } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth, db } from "../firbase/Firebase";
// import { Link, useNavigate } from "react-router-dom";

// import backarrow from "../assets/icons/backarrow.png";
// import message from "../assets/icons/message.png";
// import notification from "../assets/notification.png";
// import profile from "../assets/icons/profile.png";
// import save from "../assets/icons/save.png";
// import saved from "../assets/icons/saved.png";
// import search from "../assets/icons/search.png";
// import { MdAccessTime } from "react-icons/md";
// import { FaEye } from "react-icons/fa";

// /* ---------------- HELPERS ---------------- */

// const formatAmount = (amount) => {
//   if (!amount) return "0";
//   const n = Number(amount);
//   if (n < 1000) return n;
//   if (n < 1000000) return (n / 1000).toFixed(1) + "K";
//   return (n / 1000000).toFixed(1) + "M";
// };

// const timeAgo = (date) => {
//   if (!date) return "";
//   const diff = Date.now() - date.getTime();
//   const mins = diff / 60000;
//   if (mins < 1) return "just now";
//   if (mins < 60) return `${Math.floor(mins)} min ago`;
//   const hrs = mins / 60;
//   if (hrs < 24) return `${Math.floor(hrs)} hr ago`;
//   const days = hrs / 24;
//   return `${Math.floor(days)} day${days > 1 ? "s" : ""} ago`;
// };

// const parseCreatedAt = (v) => {
//   if (!v) return new Date();
//   if (v instanceof Date) return v;
//   if (typeof v?.toDate === "function") return v.toDate();
//   return new Date(v);
// };

// /* ---------------- COMPONENT ---------------- */

// export default function SavedJobsScreen() {
//   const [currentUser, setCurrentUser] = useState(auth.currentUser);
//   const [worksJobs, setWorksJobs] = useState([]);
//   const [jobs24h, setJobs24h] = useState([]);
//   const [savedIds, setSavedIds] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [userProfile, setUserProfile] = useState(null);

//   const navigate = useNavigate();

//   /* ⭐ SIDEBAR STATE */
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   /* ⭐ RESPONSIVE FLAG */
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   useEffect(() => {
//     const resize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", resize);
//     return () => window.removeEventListener("resize", resize);
//   }, []);

//   /* ⭐ SIDEBAR TOGGLE LISTENER */
//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   /* PROFILE */
//   useEffect(() => {
//     const u = auth.currentUser;
//     if (!u) return;
//     getDoc(doc(db, "users", u.uid)).then((snap) => {
//       if (snap.exists()) setUserProfile(snap.data());
//     });
//   }, []);

//   useEffect(() => onAuthStateChanged(auth, (u) => setCurrentUser(u)), []);

//   /* JOBS */
//   useEffect(
//     () =>
//       onSnapshot(collection(db, "jobs"), (snap) =>
//         setWorksJobs(
//           snap.docs.map((d) => {
//             const x = d.data();
//             return {
//               id: d.id,
//               title: x.title,
//               description: x.description,
//               budget_from: x.budget_from,
//               budget_to: x.budget_to,
//               views: x.views,
//               skills: x.skills || [],
//               tools: x.tools || [],
//               created_at: parseCreatedAt(x.created_at),
//             };
//           })
//         )
//       ),
//     []
//   );

//   useEffect(
//     () =>
//       onSnapshot(collection(db, "jobs_24h"), (snap) =>
//         setJobs24h(
//           snap.docs.map((d) => {
//             const x = d.data();
//             return {
//               id: d.id,
//               title: x.title,
//               description: x.description,
//               budget: x.budget,
//               views: x.views,
//               skills: x.skills || [],
//               tools: x.tools || [],
//               created_at: parseCreatedAt(x.created_at),
//             };
//           })
//         )
//       ),
//     []
//   );

//   useEffect(() => {
//     if (!currentUser) return;
//     return onSnapshot(doc(db, "users", currentUser.uid), (snap) => {
//       setSavedIds(snap.data()?.favoriteJobs || []);
//     });
//   }, [currentUser]);

//   const savedCombined = useMemo(() => {
//     const a = worksJobs.filter((j) => savedIds.includes(j.id));
//     const b = jobs24h.filter((j) => savedIds.includes(j.id));
//     return [...a, ...b];
//   }, [worksJobs, jobs24h, savedIds]);

//   const filteredJobs = useMemo(() => {
//     if (!searchQuery.trim()) return savedCombined;
//     const q = searchQuery.toLowerCase();
//     return savedCombined.filter(
//       (j) =>
//         j.title?.toLowerCase().includes(q) ||
//         j.description?.toLowerCase().includes(q) ||
//         j.skills.join(" ").toLowerCase().includes(q) ||
//         j.tools.join(" ").toLowerCase().includes(q)
//     );
//   }, [savedCombined, searchQuery]);

//   const toggleSave = async (jobId) => {
//     if (!currentUser) return;
//     const ref = doc(db, "users", currentUser.uid);
//     await updateDoc(ref, {
//       favoriteJobs: savedIds.includes(jobId)
//         ? arrayRemove(jobId)
//         : arrayUnion(jobId),
//     });
//   };

//   const renderCard = (job) => {
//     const chips = [...job.skills, ...job.tools];

//     return (
//       <div
//         key={job.id}
//         style={{
//           ...styles.jobCard,
//           width: isMobile ? "100%" : "95%",
//         }}
//         onClick={() => navigate(`/freelance-dashboard/job-full/${job.id}`)}
//       >
//         <div style={styles.cardTop}>
//           <div style={{ flex: 1 }}>
//             <div style={styles.title}>{job.title}</div>
//           </div>

//           <div style={{ textAlign: "right" }}>
//             <div style={styles.budgetTop}>
//               {job.budget_from
//                 ? `₹${formatAmount(job.budget_from)} - ₹${formatAmount(
//                     job.budget_to
//                   )}`
//                 : `₹${formatAmount(job.budget)}`}
//             </div>

//             <img
//               src={savedIds.includes(job.id) ? save : saved}
//               style={styles.saveIcon}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 toggleSave(job.id);
//               }}
//             />
//           </div>
//         </div>

//         <div style={styles.skillsrequired}>Skills Required</div>

//         <div style={styles.chipsRow}>
//           {chips.slice(0, 3).map((c) => (
//             <span key={c} style={styles.chip}>{c}</span>
//           ))}
//           {chips.length > 3 && <span style={styles.chip}>+{chips.length - 3}</span>}
//         </div>

//         <div style={styles.desc}>{job.description}</div>

//         <div style={styles.meta}>
//           <FaEye size={14} /> {job.views}
//           <MdAccessTime size={14} style={styles.time} />{" "}
//           {timeAgo(job.created_at)}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div
//       className="freelance-wrapper"
//       style={{
//         marginLeft: isMobile ? "0px" : collapsed ? "-160px" : "50px",
//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       <div
//         style={{
//           ...styles.root,
//           marginLeft: isMobile ? "0px" : "50px",
//         }}
//       >
//         {/* HEADER */}
//         <div
//           style={{
//             ...styles.topRow,
//             flexWrap: isMobile ? "wrap" : "nowrap",
//           }}
//         >
//           <div style={styles.leftRow}>
//             <div style={styles.backbtn} onClick={() => navigate(-1)}>
//               <img src={backarrow} style={styles.backbtnimg} />
//             </div>
//             <div style={styles.heading}>Saved Jobs</div>
//           </div>

//           <div style={styles.rightIcons}>
//             <img src={message} style={styles.iconImg} />
//             <img src={notification} style={styles.iconImg} />
//             <Link to={"/client-dashbroad2/ClientProfile"}>
//               <img
//                 src={userProfile?.profileImage || profile}
//                 style={{ width: 34, height: 34, borderRadius: "50%" }}
//               />
//             </Link>
//           </div>
//         </div>

//         {/* SEARCH */}
//         <div
//           style={{
//             ...styles.searchBar,
//             width: isMobile ? "100%" : "95%",
//           }}
//         >
//           <img src={search} style={styles.searchIcon} />
//           <input
//             style={styles.searchInput}
//             placeholder="Search"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>

//         {filteredJobs.map((job) => renderCard(job))}

//         {/* FLOATING BTN */}
//         <div
//           style={{
//             ...styles.plusBtn,
//             right: isMobile ? 16 : 26,
//             bottom: isMobile ? 16 : 26,
//           }}
//         >
//           +
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ---------------- STYLES ---------------- */

// const styles = {
//   root: {
//     backgroundColor: "#FFFFFF",
//     minHeight: "100vh",
//     fontFamily: "'Rubik', sans-serif",
//     padding: "16px",
//   },
//   topRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     marginBottom: 12,
//   },
//   leftRow: { display: "flex", alignItems: "center", gap: 12 },
//   backbtn: {
//     width: 38,
//     height: 38,
//     borderRadius: 12,
//     border: "1px solid #ccc",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     background: "#fff",
//     cursor: "pointer",
//   },
//   backbtnimg: { width: 18 },
//   heading: { fontSize: 34, fontWeight: 500 },
//   rightIcons: { display: "flex", gap: 14 },
//   iconImg: { width: 30, cursor: "pointer" },
//   searchBar: {
//     height: 48,
//     borderRadius: 25,
//     backgroundColor: "#F3F3F3",
//     display: "flex",
//     alignItems: "center",
//     padding: "0 16px",
//     margin: "20px auto",
//     gap: 12,
//   },
//   searchIcon: { width: 20, opacity: 0.6 },
//   searchInput: {
//     border: "none",
//     outline: "none",
//     background: "transparent",
//     width: "100%",
//     fontSize: 15,
//   },
//   jobCard: {
//     margin: "0 auto 16px",
//     borderRadius: 18,
//     background: "#fff",
//     border: "1px solid #ececec",
//     padding: 16,
//     boxShadow: "0 3px 6px rgba(0,0,0,0.07)",
//     cursor: "pointer",
//   },
//   title: { fontSize: 18, marginBottom: 6 },
//   budgetTop: { fontWeight: 600, fontSize: 15 },
//   saveIcon: { width: 20, cursor: "pointer", marginTop: 6 },
//   skillsrequired: { fontSize: 14, opacity: 0.7, marginTop: 10 },
//   chipsRow: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 },
//   chip: {
//     background: "rgba(255,240,133,.7)",
//     padding: "4px 10px",
//     borderRadius: 12,
//     fontSize: 12,
//   },
//   desc: { fontSize: 13, color: "#555", marginTop: 10 },
//   meta: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     fontSize: 12,
//     color: "#777",
//     marginTop: 10,
//   },
//   time: { marginLeft: 20 },
//   plusBtn: {
//     position: "fixed",
//     width: 58,
//     height: 58,
//     borderRadius: "50%",
//     background: "#8b5cf6",
//     color: "#fff",
//     fontSize: 34,
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//     cursor: "pointer",
//   },
// };





import React, { useEffect, useState, useMemo } from "react";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firbase/Firebase";
import { Link, useNavigate } from "react-router-dom";

import backarrow from "../assets/icons/backarrow.png";
import message from "../assets/icons/message.png";
import notification from "../assets/notification.png";
import profile from "../assets/icons/profile.png";
import save from "../assets/icons/save.png";
import saved from "../assets/icons/saved.png";
import search from "../assets/icons/search.png";
import { MdAccessTime } from "react-icons/md";
import { FaEye } from "react-icons/fa";

/* ---------------- HELPERS ---------------- */

const formatAmount = (amount) => {
  if (!amount) return "0";
  const n = Number(amount);
  if (n < 1000) return n;
  if (n < 1000000) return (n / 1000).toFixed(1) + "K";
  return (n / 1000000).toFixed(1) + "M";
};

const timeAgo = (date) => {
  if (!date) return "";
  const diff = Date.now() - date.getTime();
  const mins = diff / 60000;
  if (mins < 1) return "just now";
  if (mins < 60) return `${Math.floor(mins)} min ago`;
  const hrs = mins / 60;
  if (hrs < 24) return `${Math.floor(hrs)} hr ago`;
  const days = hrs / 24;
  return `${Math.floor(days)} day${days > 1 ? "s" : ""} ago`;
};

const parseCreatedAt = (v) => {
  if (!v) return new Date();
  if (v instanceof Date) return v;
  if (typeof v?.toDate === "function") return v.toDate();
  return new Date(v);
};

/* ---------------- COMPONENT ---------------- */

export default function SavedJobsScreen() {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [worksJobs, setWorksJobs] = useState([]);
  const [jobs24h, setJobs24h] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userProfile, setUserProfile] = useState(null);

  const navigate = useNavigate();

  /* ⭐ SIDEBAR STATE */
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  /* ⭐ RESPONSIVE FLAG */
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ⭐ SIDEBAR TOGGLE LISTENER */
  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  /* PROFILE */
  useEffect(() => {
    const u = auth.currentUser;
    if (!u) return;
    getDoc(doc(db, "users", u.uid)).then((snap) => {
      if (snap.exists()) setUserProfile(snap.data());
    });
  }, []);

  useEffect(() => onAuthStateChanged(auth, (u) => setCurrentUser(u)), []);

  /* JOBS */
  useEffect(
    () =>
      onSnapshot(collection(db, "jobs"), (snap) =>
        setWorksJobs(
          snap.docs.map((d) => {
            const x = d.data();
            return {
              id: d.id,
              title: x.title,
              description: x.description,
              budget_from: x.budget_from,
              budget_to: x.budget_to,
              views: x.views,
              skills: x.skills || [],
              tools: x.tools || [],
              created_at: parseCreatedAt(x.created_at),
            };
          })
        )
      ),
    []
  );

  useEffect(
    () =>
      onSnapshot(collection(db, "jobs_24h"), (snap) =>
        setJobs24h(
          snap.docs.map((d) => {
            const x = d.data();
            return {
              id: d.id,
              title: x.title,
              description: x.description,
              budget: x.budget,
              views: x.views,
              skills: x.skills || [],
              tools: x.tools || [],
              created_at: parseCreatedAt(x.created_at),
            };
          })
        )
      ),
    []
  );

  useEffect(() => {
    if (!currentUser) return;
    return onSnapshot(doc(db, "users", currentUser.uid), (snap) => {
      setSavedIds(snap.data()?.favoriteJobs || []);
    });
  }, [currentUser]);

  const savedCombined = useMemo(() => {
    const a = worksJobs.filter((j) => savedIds.includes(j.id));
    const b = jobs24h.filter((j) => savedIds.includes(j.id));
    return [...a, ...b];
  }, [worksJobs, jobs24h, savedIds]);

  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return savedCombined;
    const q = searchQuery.toLowerCase();
    return savedCombined.filter(
      (j) =>
        j.title?.toLowerCase().includes(q) ||
        j.description?.toLowerCase().includes(q) ||
        j.skills.join(" ").toLowerCase().includes(q) ||
        j.tools.join(" ").toLowerCase().includes(q)
    );
  }, [savedCombined, searchQuery]);

  const toggleSave = async (jobId) => {
    if (!currentUser) return;
    const ref = doc(db, "users", currentUser.uid);
    await updateDoc(ref, {
      favoriteJobs: savedIds.includes(jobId)
        ? arrayRemove(jobId)
        : arrayUnion(jobId),
    });
  };

  const renderCard = (job) => {
    const chips = [...job.skills, ...job.tools];

    return (
      <div
        key={job.id}
        style={{
          ...styles.jobCard,
          width: isMobile ? "100%" : "95%",
        }}
        onClick={() => navigate(`/freelance-dashboard/job-full/${job.id}`)}
      >
        <div style={styles.cardTop}>
          <div style={{ flex: 1 }}>
            <div style={styles.title}>{job.title}</div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={styles.budgetTop}>
              {job.budget_from
                ? `₹${formatAmount(job.budget_from)} - ₹${formatAmount(
                    job.budget_to
                  )}`
                : `₹${formatAmount(job.budget)}`}
            </div>

            <img
              src={savedIds.includes(job.id) ? save : saved}
              style={styles.saveIcon}
              onClick={(e) => {
                e.stopPropagation();
                toggleSave(job.id);
              }}
            />
          </div>
        </div>

        <div style={styles.skillsrequired}>Skills Required</div>

        <div style={styles.chipsRow}>
          {chips.slice(0, 3).map((c) => (
            <span key={c} style={styles.chip}>{c}</span>
          ))}
          {chips.length > 3 && <span style={styles.chip}>+{chips.length - 3}</span>}
        </div>

        <div style={styles.desc}>{job.description}</div>

        <div style={styles.meta}>
          <FaEye size={14} /> {job.views}
          <MdAccessTime size={14} style={styles.time} />{" "}
          {timeAgo(job.created_at)}
        </div>
      </div>
    );
  };

  return (
    <div
      className="freelance-wrapper"
      style={{
        marginLeft: isMobile ? "0px" : collapsed ? "-160px" : "50px",
        transition: "margin-left 0.25s ease",
      }}
    >
      <div
        style={{
          ...styles.root,
          marginTop: isMobile ? "30px" : "0px",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            ...styles.topRow,
            flexWrap: isMobile ? "wrap" : "nowrap",
          }}
        >
          
          <div style={styles.leftRow}>
            <div style={styles.backbtn} onClick={() => navigate(-1)}>
              <img src={backarrow} style={styles.backbtnimg} />
            </div>
            <div style={styles.heading}>Saved</div>
          </div>

          <div style={styles.rightIcons}>
            <img src={message} style={styles.iconImg} />
            <img src={notification} style={styles.iconImg} />
            <Link to={"/client-dashbroad2/ClientProfile"}>
              <img
                src={userProfile?.profileImage || profile}
                style={{ width: 34, height: 34, borderRadius: "50%" }}
              />
            </Link>
          </div>
        </div>

        {/* SEARCH */}
        <div
          style={{
            ...styles.searchBar,
            width: isMobile ? "100%" : "95%",
          }}
        >
          <img src={search} style={styles.searchIcon} />
          <input
            style={styles.searchInput}
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredJobs.map((job) => renderCard(job))}

        {/* FLOATING BTN */}
        <div
          style={{
            ...styles.plusBtn,
            right: isMobile ? 16 : 26,
            bottom: isMobile ? 16 : 26,
          }}
        >
          +
        </div>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  root: {
    backgroundColor: "#FFFFFF",
    minHeight: "100vh",
    fontFamily: "'Rubik', sans-serif",
    padding: "16px",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    width: "100%",
  },
  leftRow: { display: "flex", alignItems: "center", gap: 12 },
  backbtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    border: "1px solid #ccc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#fff",
    cursor: "pointer",
  },
  backbtnimg: { width: 18 },
  heading: { fontSize: 34, fontWeight: 500 },
  rightIcons: {
    display: "flex",
    gap: 14,
    marginLeft: "auto",
    alignItems: "center",
  },
  iconImg: { width: 30, cursor: "pointer" },
  searchBar: {
    height: 48,
    borderRadius: 25,
    backgroundColor: "#F3F3F3",
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    margin: "20px auto",
    gap: 12,
  },
  searchIcon: { width: 20, opacity: 0.6 },
  searchInput: {
    border: "none",
    outline: "none",
    background: "transparent",
    width: "100%",
    fontSize: 15,
    padding: "65px 0px 50px 0px",
  },
  jobCard: {
    margin: "0 auto 16px",
    borderRadius: 18,
    background: "#fff",
    border: "1px solid #ececec",
    padding: 16,
    boxShadow: "0 3px 6px rgba(0,0,0,0.07)",
    cursor: "pointer",
  },
  title: { fontSize: 18, marginBottom: 6 },
  budgetTop: { fontWeight: 600, fontSize: 15 },
  saveIcon: { width: 20, cursor: "pointer", marginTop: 6 },
  skillsrequired: { fontSize: 14, opacity: 0.7, marginTop: 10 },
  chipsRow: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 },
  chip: {
    background: "rgba(255,240,133,.7)",
    padding: "4px 10px",
    borderRadius: 12,
    fontSize: 12,
  },
  desc: { fontSize: 13, color: "#555", marginTop: 10 },
  meta: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    color: "#777",
    marginTop: 10,
  },
  time: { marginLeft: 20 },
  plusBtn: {
    position: "fixed",
    width: 58,
    height: 58,
    borderRadius: "50%",
    background: "#8b5cf6",
    color: "#fff",
    fontSize: 34,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    cursor: "pointer",
  },
};