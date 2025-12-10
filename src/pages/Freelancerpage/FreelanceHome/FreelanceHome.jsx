// // import React, { useEffect, useState } from "react";
// // import {
// //   collection,
// //   doc,
// //   onSnapshot,
// //   updateDoc,
// //   query,
// //   where,
// //   getDoc,
// // } from "firebase/firestore";
// // import { getAuth, onAuthStateChanged } from "firebase/auth";
// // import { Link, useNavigate } from "react-router-dom";
// // import { db } from "../../../firbase/Firebase";

// // import {
// //   FiBookmark,
// //   FiPlus,
// //   FiSearch,
// //   FiMessageCircle,
// //   FiBell,
// //   FiEye,
// //   FiClock,
// // } from "react-icons/fi";

// // import browseImg1 from "../../../assets/Container.png";
// // import browseImg2 from "../../../assets/wave.png";
// // import worksImg1 from "../../../assets/file.png";
// // import worksImg2 from "../../../assets/yellowwave.png";
// // import arrow from "../../../assets/arrow.png";
// // import profile from "../../../assets/profile.png";

// // // 🔥 NEW EMPTY STATE IMAGES
// // import noCardsImg from "../../../assets/dashboard.png";
// // import noInternetImg from "../../../assets/nointernet.png";
// // import notification from "../../../assets/notification.png";
// // import message from "../../../assets/message.png";
// // import search from "../../../assets/search.png";

// // import "./FreelanceHome.css";

// // export default function FreelanceHome() {
// //   const [searchText, setSearchText] = useState("");
// //   const [category, setCategory] = useState("");
// //   const [suggestions, setSuggestions] = useState([]);
// //   const [jobs, setJobs] = useState([]);
// //   const [savedJobs, setSavedJobs] = useState([]);
// //   const [userMap, setUserMap] = useState({});

// //   const [userInfo, setUserInfo] = useState({
// //     firstName: "",
// //     lastName: "",
// //     role: "",
// //     profileImage: "",
// //   });

// //   const [notifCount, setNotifCount] = useState(0);
// //   const [notifications, setNotifications] = useState([]);
// //   const [isNotifOpen, setIsNotifOpen] = useState(false);

// //   const [isOnline, setIsOnline] = useState(true); // 🔥 NEW – Internet check

// //   const navigate = useNavigate();
// //   const auth = getAuth();
// //   const user = auth.currentUser;

// //   // 🔥 INTERNET LISTENERS
// //   useEffect(() => {
// //     function updateStatus() {
// //       setIsOnline(navigator.onLine);
// //     }
// //     window.addEventListener("online", updateStatus);
// //     window.addEventListener("offline", updateStatus);
// //     updateStatus();
// //     return () => {
// //       window.removeEventListener("online", updateStatus);
// //       window.removeEventListener("offline", updateStatus);
// //     };
// //   }, []);

// //   useEffect(() => {
// //     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
// //       if (!currentUser) return;
// //       try {
// //         const userRef = doc(db, "users", currentUser.uid);
// //         const snap = await getDoc(userRef);
// //         if (snap.exists()) {
// //           const data = snap.data();
// //           setUserInfo({
// //             firstName: data.firstName || "",
// //             lastName: data.lastName || "",
// //             role: data.role || "",
// //             profileImage: data.profileImage || "",
// //           });
// //         }
// //       } catch (err) {
// //         console.error("Error fetching user:", err);
// //       }
// //     });
// //     return unsubscribe;
// //   }, []);

// //   function updateSuggestions(text) {
// //     const q = text.toLowerCase();
// //     const setData = new Set();
// //     jobs.forEach((job) => {
// //       if (job.title?.toLowerCase().includes(q)) setData.add(job.title);
// //       if (job.skills) {
// //         job.skills.forEach((skill) => {
// //           if (skill.toLowerCase().includes(q)) setData.add(skill);
// //         });
// //       }
// //     });
// //     setSuggestions(Array.from(setData).slice(0, 6));
// //   }

// //   useEffect(() => {
// //     if (!searchText.trim()) return setSuggestions([]);
// //     updateSuggestions(searchText);
// //   }, [searchText, jobs]);

// //   useEffect(() => {
// //     const unsub = onSnapshot(collection(db, "jobs"), (snap) => {
// //       setJobs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
// //     });
// //     return unsub;
// //   }, []);

// //   useEffect(() => {
// //     if (!user) return;
// //     const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
// //       setSavedJobs(snap.data()?.favoriteJobs || []);
// //     });
// //     return unsub;
// //   }, [user]);

// //   useEffect(() => {
// //     const unsub = onSnapshot(collection(db, "users"), (snap) => {
// //       const map = {};
// //       snap.docs.forEach((u) => (map[u.id] = u.data()));
// //       setUserMap(map);
// //     });
// //     return unsub;
// //   }, []);

// //   async function toggleSave(jobId) {
// //     if (!user) return;
// //     const ref = doc(db, "users", user.uid);
// //     const newList = savedJobs.includes(jobId)
// //       ? savedJobs.filter((x) => x !== jobId)
// //       : [...savedJobs, jobId];
// //     setSavedJobs(newList);
// //     await updateDoc(ref, { favoriteJobs: newList });
// //   }

// //   function onViewJob(job) {
// //     if (job.jobtype === "jobs_24h") {
// //       navigate(`/freelance-dashboard/job-24/${job.id}`);
// //     } else {
// //       navigate(`/freelance-dashboard/job-full/${job.id}`);
// //     }
// //   }

// //   useEffect(() => {
// //     if (!user) return;
// //     const refColl = collection(db, "accepted_jobs");
// //     const q = query(refColl, where("freelancerId", "==", user.uid));
// //     const unsub = onSnapshot(q, (snap) => {
// //       const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
// //       setNotifications(items);
// //       const unread =
// //         items.filter((it) => it.isRead === false || it.isRead == null).length;
// //       setNotifCount(unread);
// //     });
// //     return unsub;
// //   }, [user]);

// //   const filteredJobs = jobs.filter((job) => {
// //     const txt = searchText.toLowerCase();
// //     const matchSearch =
// //       !searchText.trim() ||
// //       job.title?.toLowerCase().includes(txt) ||
// //       job.description?.toLowerCase().includes(txt) ||
// //       job.skills?.some((s) => s.toLowerCase().includes(txt));

// //     const matchCategory =
// //       category === "" ||
// //       (job.category && job.category.toLowerCase() === category.toLowerCase());

// //     return matchSearch && matchCategory;
// //   });

// //   function timeAgo(date) {
// //     if (!date) return "N/A";
// //     const time =
// //       typeof date.toDate === "function"
// //         ? date.toDate().getTime()
// //         : new Date(date).getTime();
// //     const diff = (Date.now() - time) / 1000;
// //     if (diff < 60) return `${Math.floor(diff)} sec ago`;
// //     if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
// //     if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
// //     return `${Math.floor(diff / 86400)} days ago`;
// //   }

// //   return (
// //     <div className="fh-page rubik-font">
// //       {/* HEADER */}
// //       <header className="fh-header">
// //         <div className="fh-header-left">
// //           <div className="fh-welcome">
// //             <h1 className="fh-title">
// //               Welcome,<div>{userInfo.firstName || "Huzzlers"}</div>
// //             </h1>
// //             <div className="fh-subtitle">
// //               Discover projects that match your skills
// //             </div>
// //           </div>
// //         </div>

// //         <div className="fh-header-right">
// //           {/* 💬 Message Icon + Count */}
// //           <img src={message} alt="messages" style={{ width: "31px", height: "29px", cursor: "pointer" }} />


// //           {/* 🔔 Notification Icon */}
// //           <img src={notification} alt="notification" style={{ width: "31px", height: "29px", cursor: "pointer" }} />
// //           {notifCount > 0 && (
// //             <span className="notif-count">
// //               {notifCount > 9 ? "9+" : notifCount}
// //             </span>
// //           )}


// //           {/* 👤 Profile Avatar */}
// //           <div className="fh-avatar">
// //             <Link to={"/freelance-dashboard/Profilebuilder"}>
// //               <img src={profile} alt="avatar" />
// //             </Link>
// //           </div>

// //         </div>
// // <div
// //   style={{
// //     width: "1216px",
// //     height: "49.6px",
// //     background: "linear-gradient(90deg, #fffce3, #ffffff)",
// //     borderRadius: "16px",
// //     border: "0.8px solid #e6e6e6",
// //     display: "flex",
// //     alignItems: "center",
// //     padding: "0 16px",
// //     boxShadow: "0px 4px 18px rgba(0,0,0,0.10)",
// //   }}
// // >
// //   <img
// //     src={search}
// //     alt="search"
// //     style={{ width: 18, opacity: 0.6 }}
// //   />

// //   <input
// //     placeholder="Search"
// //     value={searchText}
// //     onChange={(e) => setSearchText(e.target.value)}
// //     style={{
// //       marginLeft: "-10px",
// //       marginTop:"15px",
// //       flex: 1,
// //       border: "none",
// //       outline: "none",
// //       background: "transparent",
// //       fontSize: "15px",
// //     }}
// //   />

// //   {searchText && (
// //     <button
// //       onClick={() => setSearchText("")}
// //       style={{
// //         background: "none",
// //         border: "none",
// //         fontSize: "18px",
// //         cursor: "pointer",
// //         color: "#777",
// //       }}
// //     >
// //       ✕
// //     </button>
// //   )}
// // </div>

// //       </header>

// //       {/* MAIN */}
// //       <main className="fh-main">

// //         {/* HERO SECTION */}
// //         <section className="fh-hero">
// //           <div className="fh-hero-card primary"style={{cursor:"pointer"}} onClick={()=>{navigate("/freelance-dashboard/freelancebrowesproject")}}>
// //             <img src={browseImg1} className="hero-img img-1" alt="icon" />
// //             <img src={browseImg2} className="hero-img img-2" alt="icon" />
// //             <div className="hero-left" >
// //               <h3>Browse All Projects</h3>
// //               <p>Explore all available opportunities</p>
// //             </div>
// //             <div className="hero-right">
// //               <img className="arrow" src={arrow} width={25} alt="" />
// //             </div>
// //           </div>

// //           <div className="fh-hero-card secondary" style={{cursor:"pointer"}} onClick={()=>{navigate("/freelance-dashboard/freelancebrowesproject")}} >
// //             <img src={worksImg1} className="hero-img img-3" alt="icon" />
// //             <img src={worksImg2} className="hero-img img-4" alt="icon" />
// //             <div>
// //               <h4>My Works</h4>
// //               <p>Track your Work</p>
// //             </div>
// //             <div className="hero-right">
// //               <img className="arrow" src={arrow} width={25} alt="" />
// //             </div>
// //           </div>
// //         </section>

// //         {/* JOB LIST SECTION */}
// //         <section className="fh-section">
// //           <div className="section-header">
// //             <h2>Top Recommendations for You</h2>
// //             <Link className="view-all" to="/freelance-dashboard/freelancebrowesproject">
// //               View All →
// //             </Link>
// //           </div>

// //           <div className="jobs-list">

// //             {/* 🔥 NO INTERNET */}
// //             {!isOnline && (
// //               <div className="empty-state">
// //                 <img src={noInternetImg} className="empty-img" alt="No internet" />

// //                 <div className="empty-title">You're Offline!</div>
// //                 <div className="empty-sub">
// //                   Your projects and messages are safe here.
// //                   Reconnect to get back to work.
// //                 </div>

// //                 <button className="empty-btn" onClick={() => window.location.reload()}>
// //                   Retry
// //                 </button>


// //               </div>
// //             )}

// //             {/* 🔥 NO JOBS */}
// //             {isOnline && filteredJobs.length === 0 && (
// //               <div className="empty-state">
// //                 <img src={noCardsImg} className="empty-img" alt="No cards" />

// //                 <div className="empty-title">Oops! Looks like you’ve wandered off the project path</div>
// //                 <div className="empty-sub">
// //                   The page you’re looking for might have been moved, deleted, or is still under development.
// //                 </div>

// //                 <button className="empty-btn" onClick={() => navigate("/")}>
// //                   Return to Home
// //                 </button>
// //               </div>
// //             )}

// //             {/* 🔥 JOB CARDS */}
// //             {isOnline &&
// //               filteredJobs.length > 0 &&
// //               filteredJobs.map((job) => (
// //                 <article
// //                   key={job.id}
// //                   className="job-card"
// //                   onClick={() => onViewJob(job)}
// //                 >
// //                   <div className="job-card-top">
// //                     <div>
// //                       <h3 className="job-title">{job.title}</h3>
// //                       <div className="job-sub">
// //                         {job.company}  {job.role}
// //                       </div>
// //                     </div>

// //                     <div className="job-budget-wrapper">
// //                       <div className="job-budget">
// //                         ₹{job.budget_from || job.budget}/day
// //                       </div>

// //                       <button
// //                         className={`save-btn ${savedJobs.includes(job.id) ? "saved" : ""}`}
// //                         onClick={(e) => {
// //                           e.stopPropagation();
// //                           toggleSave(job.id);
// //                         }}
// //                       >
// //                         <FiBookmark />
// //                       </button>
// //                     </div>
// //                   </div>

// //                   <div className="job-skills">
// //                     {job.skills?.map((skill, i) => (
// //                       <span key={i} className="skill-chip">
// //                         {skill}
// //                       </span>
// //                     ))}
// //                   </div>

// //                   <p className="job-desc">
// //                     {job.description?.slice(0, 180)}
// //                     {job.description?.length > 180 ? "..." : ""}
// //                   </p>

// //                   <div className="job-meta">
// //                     <div className="job-stats">
// //                       <div className="views">
// //                         <FiEye /> <span>{job.views || 0} view</span>
// //                       </div>
// //                       <div className="created">
// //                         <FiClock />
// //                         {timeAgo(job.created_at)}
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </article>
// //               ))}
// //           </div>
// //         </section>
// //       </main>

// //       <button
// //         className="fh-fab"
// //         onClick={() => navigate("/freelance-dashboard/add-service-form")}
// //       >
// //         <FiPlus />
// //       </button>
// //     </div>
// //   );
// // }


// import React, { useEffect, useState } from "react";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   updateDoc,
//   query,
//   where,
//   getDoc,
// } from "firebase/firestore";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { Link, useNavigate } from "react-router-dom";
// import { db } from "../../../firbase/Firebase";

// import {
//   FiBookmark,
//   FiPlus,
//   FiSearch,
//   FiMessageCircle,
//   FiBell,
//   FiEye,
//   FiClock,
// } from "react-icons/fi";

// import browseImg1 from "../../../assets/Container.png";
// import browseImg2 from "../../../assets/wave.png";
// import worksImg1 from "../../../assets/file.png";
// import worksImg2 from "../../../assets/yellowwave.png";
// import arrow from "../../../assets/arrow.png";
// import profile from "../../../assets/profile.png";

// // 🔥 NEW EMPTY STATE IMAGES
// import noCardsImg from "../../../assets/dashboard.png";
// import noInternetImg from "../../../assets/nointernet.png";
// import notification from "../../../assets/notification.png";
// import message from "../../../assets/message.png";
// import search from "../../../assets/search.png";

// import "./FreelanceHome.css";

// export default function FreelanceHome() {
//   const [searchText, setSearchText] = useState("");
//   const [category, setCategory] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [jobs, setJobs] = useState([]);
//   const [savedJobs, setSavedJobs] = useState([]);
//   const [userMap, setUserMap] = useState({});

//   const [userInfo, setUserInfo] = useState({
//     firstName: "",
//     lastName: "",
//     role: "",
//     profileImage: "",
//   });

//   const [notifCount, setNotifCount] = useState(0);
//   const [notifications, setNotifications] = useState([]);
//   const [isNotifOpen, setIsNotifOpen] = useState(false);

//   const [isOnline, setIsOnline] = useState(true);

//   const navigate = useNavigate();
//   const auth = getAuth();
//   const user = auth.currentUser;

//   // ⭐ NEW — SIDEBAR STATE
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   // ⭐ LISTEN FOR SIDEBAR TOGGLE
//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   // 🔥 INTERNET LISTENERS
//   useEffect(() => {
//     function updateStatus() {
//       setIsOnline(navigator.onLine);
//     }
//     window.addEventListener("online", updateStatus);
//     window.addEventListener("offline", updateStatus);
//     updateStatus();
//     return () => {
//       window.removeEventListener("online", updateStatus);
//       window.removeEventListener("offline", updateStatus);
//     };
//   }, []);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) return;
//       try {
//         const userRef = doc(db, "users", currentUser.uid);
//         const snap = await getDoc(userRef);
//         if (snap.exists()) {
//           const data = snap.data();
//           setUserInfo({
//             firstName: data.firstName || "",
//             lastName: data.lastName || "",
//             role: data.role || "",
//             profileImage: data.profileImage || "",
//           });
//         }
//       } catch (err) {
//         console.error("Error fetching user:", err);
//       }
//     });
//     return unsubscribe;
//   }, []);

//   function updateSuggestions(text) {
//     const q = text.toLowerCase();
//     const setData = new Set();
//     jobs.forEach((job) => {
//       if (job.title?.toLowerCase().includes(q)) setData.add(job.title);
//       if (job.skills) {
//         job.skills.forEach((skill) => {
//           if (skill.toLowerCase().includes(q)) setData.add(skill);
//         });
//       }
//     });
//     setSuggestions(Array.from(setData).slice(0, 6));
//   }

//   useEffect(() => {
//     if (!searchText.trim()) return setSuggestions([]);
//     updateSuggestions(searchText);
//   }, [searchText, jobs]);

//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "jobs"), (snap) => {
//       setJobs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//     });
//     return unsub;
//   }, []);

//   useEffect(() => {
//     if (!user) return;
//     const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
//       setSavedJobs(snap.data()?.favoriteJobs || []);
//     });
//     return unsub;
//   }, [user]);

//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "users"), (snap) => {
//       const map = {};
//       snap.docs.forEach((u) => (map[u.id] = u.data()));
//       setUserMap(map);
//     });
//     return unsub;
//   }, []);

//   async function toggleSave(jobId) {
//     if (!user) return;
//     const ref = doc(db, "users", user.uid);
//     const newList = savedJobs.includes(jobId)
//       ? savedJobs.filter((x) => x !== jobId)
//       : [...savedJobs, jobId];
//     setSavedJobs(newList);
//     await updateDoc(ref, { favoriteJobs: newList });
//   }

//   function onViewJob(job) {
//     if (job.jobtype === "jobs_24h") {
//       navigate(`/freelance-dashboard/job-24/${job.id}`);
//     } else {
//       navigate(`/freelance-dashboard/job-full/${job.id}`);
//     }
//   }

//   useEffect(() => {
//     if (!user) return;
//     const refColl = collection(db, "accepted_jobs");
//     const q = query(refColl, where("freelancerId", "==", user.uid));
//     const unsub = onSnapshot(q, (snap) => {
//       const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setNotifications(items);
//       const unread =
//         items.filter((it) => it.isRead === false || it.isRead == null).length;
//       setNotifCount(unread);
//     });
//     return unsub;
//   }, [user]);

//   const filteredJobs = jobs.filter((job) => {
//     const txt = searchText.toLowerCase();
//     const matchSearch =
//       !searchText.trim() ||
//       job.title?.toLowerCase().includes(txt) ||
//       job.description?.toLowerCase().includes(txt) ||
//       job.skills?.some((s) => s.toLowerCase().includes(txt));

//     const matchCategory =
//       category === "" ||
//       (job.category && job.category.toLowerCase() === category.toLowerCase());

//     return matchSearch && matchCategory;
//   });

//   function timeAgo(date) {
//     if (!date) return "N/A";
//     const time =
//       typeof date.toDate === "function"
//         ? date.toDate().getTime()
//         : new Date(date).getTime();
//     const diff = (Date.now() - time) / 1000;
//     if (diff < 60) return `${Math.floor(diff)} sec ago`;
//     if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
//     if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
//     return `${Math.floor(diff / 86400)} days ago`;
//   }

//   return (
//     <div
//       className="fh-page rubik-font"
//       style={{
//         marginLeft: collapsed ? "-100px" : "100px",
//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       {/* HEADER */}
//       <header className="fh-header">
//         <div className="fh-header-left">
//           <div className="fh-welcome">
//             <h1 className="fh-title">
//               Welcome,<div>{userInfo.firstName || "Huzzlers"}</div>
//             </h1>
//             <div className="fh-subtitle">
//               Discover projects that match your skills
//             </div>
//           </div>
//         </div>

//         <div className="fh-header-right">
//           <img src={message} style={{ width: 31, height: 29, cursor: "pointer" }} />

//           <img src={notification} style={{ width: 31, height: 29, cursor: "pointer" }} />
//           {notifCount > 0 && (
//             <span className="notif-count">{notifCount > 9 ? "9+" : notifCount}</span>
//           )}

//           <div className="fh-avatar">
//             <Link to={"/freelance-dashboard/Profilebuilder"}>
//               <img src={profile} alt="avatar" />
//             </Link>
//           </div>
//         </div>

//         {/* SEARCH BAR */}
//         <div
//           style={{
//             width: "1216px",
//             height: "49.6px",
//             background: "linear-gradient(90deg,#fffce3,#ffffff)",
//             borderRadius: "16px",
//             border: "0.8px solid #e6e6e6",
//             display: "flex",
//             alignItems: "center",
//             padding: "0 16px",
//             boxShadow: "0px 4px 18px rgba(0,0,0,0.10)",
//           }}
//         >
//           <img src={search} style={{ width: 18, opacity: 0.6 }} />

//           <input
//             placeholder="Search"
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//             style={{
//               marginLeft: "-10px",
//               marginTop: "15px",
//               flex: 1,
//               border: "none",
//               outline: "none",
//               background: "transparent",
//               fontSize: "15px",
//             }}
//           />

//           {searchText && (
//             <button
//               onClick={() => setSearchText("")}
//               style={{
//                 background: "none",
//                 border: "none",
//                 fontSize: "18px",
//                 cursor: "pointer",
//                 color: "#777",
//               }}
//             >
//               ✕
//             </button>
//           )}
//         </div>
//       </header>

//       {/* MAIN CONTENT */}
//       <main className="fh-main">
//         {/* HERO */} 
//         <section className="fh-hero">
//           <div
//             className="fh-hero-card primary"
//             style={{ cursor: "pointer" }}
//             onClick={() =>
//               navigate("/freelance-dashboard/freelancebrowesproject")
//             }
//           >
//             <img src={browseImg1} className="hero-img img-1" />
//             <img src={browseImg2} className="hero-img img-2" />
//             <div className="hero-left">
//               <h3>Browse All Projects</h3>
//               <p>Explore all available opportunities</p>
//             </div>
//             <div className="hero-right">
//               <img className="arrow" src={arrow} width={25} />
//             </div>
//           </div>

//           <div
//             className="fh-hero-card secondary"
//             style={{ cursor: "pointer" }}
//             onClick={() =>
//               navigate("/freelance-dashboard/freelancebrowesproject")
//             }
//           >
//             <img src={worksImg1} className="hero-img img-3" />
//             <img src={worksImg2} className="hero-img img-4" />
//             <div>
//               <h4>My Works</h4>
//               <p>Track your Work</p>
//             </div>
//             <div className="hero-right">
//               <img className="arrow" src={arrow} width={25} />
//             </div>
//           </div>
//         </section>

//         {/* JOB LIST */}
//         <section className="fh-section">
//           <div className="section-header">
//             <h2>Top Recommendations for You</h2>
//             <Link className="view-all" to="/freelance-dashboard/freelancebrowesproject">
//               View All →
//             </Link>
//           </div>

//           <div className="jobs-list">
//             {!isOnline && (
//               <div className="empty-state">
//                 <img src={noInternetImg} className="empty-img" />
//                 <div className="empty-title">You're Offline!</div>
//                 <button className="empty-btn" onClick={() => window.location.reload()}>
//                   Retry
//                 </button>
//               </div>
//             )}

//             {isOnline && filteredJobs.length === 0 && (
//               <div className="empty-state">
//                 <img src={noCardsImg} className="empty-img" />
//                 <div className="empty-title">No Projects Found</div>
//                 <button className="empty-btn" onClick={() => navigate("/")}>
//                   Return Home
//                 </button>
//               </div>
//             )}

//             {isOnline &&
//               filteredJobs.length > 0 &&
//               filteredJobs.map((job) => (
//                 <article key={job.id} className="job-card" onClick={() => onViewJob(job)}>
//                   <div className="job-card-top">
//                     <div>
//                       <h3 className="job-title">{job.title}</h3>
//                       <div className="job-sub">
//                         {job.company} {job.role}
//                       </div>
//                     </div>

//                     <div className="job-budget-wrapper">
//                       <div className="job-budget">₹{job.budget_from || job.budget}/day</div>

//                       <button
//                         className={`save-btn ${
//                           savedJobs.includes(job.id) ? "saved" : ""
//                         }`}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           toggleSave(job.id);
//                         }}
//                       >
//                         <FiBookmark />
//                       </button>
//                     </div>
//                   </div>

//                   <div className="job-skills">
//                     {job.skills?.map((skill, i) => (
//                       <span key={i} className="skill-chip">
//                         {skill}
//                       </span>
//                     ))}
//                   </div>

//                   <p className="job-desc">
//                     {job.description?.slice(0, 180)}
//                     {job.description?.length > 180 ? "..." : ""}
//                   </p>

//                   <div className="job-meta">
//                     <div className="job-stats">
//                       <div className="views">
//                         <FiEye /> <span>{job.views || 0} view</span>
//                       </div>
//                       <div className="created">
//                         <FiClock /> {timeAgo(job.created_at)}
//                       </div>
//                     </div>
//                   </div>
//                 </article>
//               ))}
//           </div>
//         </section>
//       </main>

//       <button
//         className="fh-fab"
//         onClick={() => navigate("/freelance-dashboard/add-service-form")}
//       >
//         <FiPlus />
//       </button>
//     </div>
//   );
// }




// import React, { useEffect, useState } from "react";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   updateDoc,
//   query,
//   where,
//   getDoc,
// } from "firebase/firestore";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { Link, useNavigate } from "react-router-dom";
// import { db } from "../../../firbase/Firebase";

// import {
//   FiBookmark,
//   FiPlus,
//   FiSearch,
//   FiMessageCircle,
//   FiBell,
//   FiEye,
//   FiClock,
// } from "react-icons/fi";



// import browseImg1 from "../../../assets/Container.png";
// import browseImg2 from "../../../assets/wave.png";
// import worksImg1 from "../../../assets/file.png";
// import worksImg2 from "../../../assets/yellowwave.png";
// import arrow from "../../../assets/arrow.png";
// import profile from "../../../assets/profile.png";

// // 🔥 NEW EMPTY STATE IMAGES
// import noCardsImg from "../../../assets/dashboard.png";
// import noInternetImg from "../../../assets/nointernet.png";
// import notification from "../../../assets/notification.png";
// import message from "../../../assets/message.png";
// import search from "../../../assets/search.png";

// import "./FreelanceHome.css";

// export default function FreelanceHome() {
//   const [searchText, setSearchText] = useState("");
//   const [category, setCategory] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [jobs, setJobs] = useState([]);
//   const [savedJobs, setSavedJobs] = useState([]);
//   const [userMap, setUserMap] = useState({});

//   const [userInfo, setUserInfo] = useState({
//     firstName: "",
//     lastName: "",
//     role: "",
//     profileImage: "",
//   });

//   const [notifCount, setNotifCount] = useState(0);
//   const [notifications, setNotifications] = useState([]);
//   const [isNotifOpen, setIsNotifOpen] = useState(false);

//   const [isOnline, setIsOnline] = useState(true); // 🔥 NEW – Internet check

//   const navigate = useNavigate();
//   const auth = getAuth();
//   const user = auth.currentUser;

//   // 🔥 INTERNET LISTENERS
//   useEffect(() => {
//     function updateStatus() {
//       setIsOnline(navigator.onLine);
//     }
//     window.addEventListener("online", updateStatus);
//     window.addEventListener("offline", updateStatus);
//     updateStatus();
//     return () => {
//       window.removeEventListener("online", updateStatus);
//       window.removeEventListener("offline", updateStatus);
//     };
//   }, []);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) return;
//       try {
//         const userRef = doc(db, "users", currentUser.uid);
//         const snap = await getDoc(userRef);
//         if (snap.exists()) {
//           const data = snap.data();
//           setUserInfo({
//             firstName: data.firstName || "",
//             lastName: data.lastName || "",
//             role: data.role || "",
//             profileImage: data.profileImage || "",
//           });
//         }
//       } catch (err) {
//         console.error("Error fetching user:", err);
//       }
//     });
//     return unsubscribe;
//   }, []);

//   function updateSuggestions(text) {
//     const q = text.toLowerCase();
//     const setData = new Set();
//     jobs.forEach((job) => {
//       if (job.title?.toLowerCase().includes(q)) setData.add(job.title);
//       if (job.skills) {
//         job.skills.forEach((skill) => {
//           if (skill.toLowerCase().includes(q)) setData.add(skill);
//         });
//       }
//     });
//     setSuggestions(Array.from(setData).slice(0, 6));
//   }

//   useEffect(() => {
//     if (!searchText.trim()) return setSuggestions([]);
//     updateSuggestions(searchText);
//   }, [searchText, jobs]);

//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "jobs"), (snap) => {
//       setJobs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//     });
//     return unsub;
//   }, []);

//   useEffect(() => {
//     if (!user) return;
//     const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
//       setSavedJobs(snap.data()?.favoriteJobs || []);
//     });
//     return unsub;
//   }, [user]);

//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "users"), (snap) => {
//       const map = {};
//       snap.docs.forEach((u) => (map[u.id] = u.data()));
//       setUserMap(map);
//     });
//     return unsub;
//   }, []);

//   async function toggleSave(jobId) {
//     if (!user) return;
//     const ref = doc(db, "users", user.uid);
//     const newList = savedJobs.includes(jobId)
//       ? savedJobs.filter((x) => x !== jobId)
//       : [...savedJobs, jobId];
//     setSavedJobs(newList);
//     await updateDoc(ref, { favoriteJobs: newList });
//   }

//   function onViewJob(job) {
//     if (job.jobtype === "jobs_24h") {
//       navigate(`/freelance-dashboard/job-24/${job.id}`);
//     } else {
//       navigate(`/freelance-dashboard/job-full/${job.id}`);
//     }
//   }

//   useEffect(() => {
//     if (!user) return;
//     const refColl = collection(db, "accepted_jobs");
//     const q = query(refColl, where("freelancerId", "==", user.uid));
//     const unsub = onSnapshot(q, (snap) => {
//       const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setNotifications(items);
//       const unread =
//         items.filter((it) => it.isRead === false || it.isRead == null).length;
//       setNotifCount(unread);
//     });
//     return unsub;
//   }, [user]);

//   const filteredJobs = jobs.filter((job) => {
//     const txt = searchText.toLowerCase();
//     const matchSearch =
//       !searchText.trim() ||
//       job.title?.toLowerCase().includes(txt) ||
//       job.description?.toLowerCase().includes(txt) ||
//       job.skills?.some((s) => s.toLowerCase().includes(txt));

//     const matchCategory =
//       category === "" ||
//       (job.category && job.category.toLowerCase() === category.toLowerCase());

//     return matchSearch && matchCategory;
//   });

//   function timeAgo(date) {
//     if (!date) return "N/A";
//     const time =
//       typeof date.toDate === "function"
//         ? date.toDate().getTime()
//         : new Date(date).getTime();
//     const diff = (Date.now() - time) / 1000;
//     if (diff < 60) return `${Math.floor(diff)} sec ago`;
//     if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
//     if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
//     return `${Math.floor(diff / 86400)} days ago`;
//   }

//   return (
//     <div className="fh-page rubik-font">

//       {/* HEADER */}
//       <header className="fh-header">
//         <div className="fh-header-left">
//           <div className="fh-welcome">
//             <h1 className="fh-title">
//               Welcome,<div>{userInfo.firstName || "Huzzlers"}</div>
//             </h1>
//             <div className="fh-subtitle">
//               Discover projects that match your skills
//             </div>
//           </div>
//         </div>

//         <div className="fh-header-right">
//           {/* 💬 Message Icon + Count */}
//           <Link to={"/freelance-dashboard/freelancermessages"}><img src={message} alt="messages" style={{ width: "31px", height: "29px", cursor: "pointer" }} />
//           </Link>

//           {/* 🔔 Notification Icon */}
//           <img src={notification} alt="notification" style={{ width: "31px", height: "29px", cursor: "pointer" }} />
//           {notifCount > 0 && (
//             <span className="notif-count">
//               {notifCount > 9 ? "9+" : notifCount}
//             </span>
//           )}


//           {/* 👤 Profile Avatar */}
//           <div className="fh-avatar">
//             <Link to={"/freelance-dashboard/Profilebuilder"}>
//               <img src={profile} alt="avatar" />
//             </Link>
//           </div>

//         </div>
//         <div
//           style={{
//             width: "1216px",
//             height: "49.6px",
//             background: "linear-gradient(90deg, #fffce3, #ffffff)",
//             borderRadius: "16px",
//             border: "0.8px solid #e6e6e6",
//             display: "flex",
//             alignItems: "center",
//             padding: "0 16px",
//             boxShadow: "0px 4px 18px rgba(0,0,0,0.10)",
//           }}
//         >
//           <img
//             src={search}
//             alt="search"
//             style={{ width: 18, opacity: 0.6 }}
//           />

//           <input
//             placeholder="Search"
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//             style={{
//               marginLeft: "-10px",
//               marginTop: "15px",
//               flex: 1,
//               border: "none",
//               outline: "none",
//               background: "transparent",
//               fontSize: "15px",
//             }}
//           />

//           {searchText && (
//             <button
//               onClick={() => setSearchText("")}
//               style={{
//                 background: "none",
//                 border: "none",
//                 fontSize: "18px",
//                 cursor: "pointer",
//                 color: "#777",
//               }}
//             >
//               ✕
//             </button>
//           )}
//         </div>

//       </header>

//       {/* MAIN */}
//       <main className="fh-main">

//         {/* HERO SECTION */}
//         <section className="fh-hero">
//           <div className="fh-hero-card primary">
//             <img src={browseImg1} className="hero-img img-1" alt="icon" />
//             <img src={browseImg2} className="hero-img img-2" alt="icon" />
//             <div className="hero-left">
//               <h3>Browse All Projects</h3>
//               <p>Explore all available opportunities</p>
//             </div>
//             <div className="hero-right">
//               <img className="arrow" src={arrow} width={25} alt="" />
//             </div>
//           </div>

//           <div className="fh-hero-card secondary">
//             <img src={worksImg1} className="hero-img img-3" alt="icon" />
//             <img src={worksImg2} className="hero-img img-4" alt="icon" />
//             <div>
//               <h4>My Works</h4>
//               <p>Track your Work</p>
//             </div>
//             <div className="hero-right">
//               <img className="arrow" src={arrow} width={25} alt="" />
//             </div>
//           </div>
//         </section>

//         {/* JOB LIST SECTION */}
//         <section className="fh-section">
//           <div className="section-header">
//             <h2>Top Recommendations for You</h2>
//             <Link className="view-all" to="/freelance-dashboard/browse-projects">
//               View All →
//             </Link>
//           </div>

//           <div className="jobs-list">

//             {/* 🔥 NO INTERNET */}
//             {!isOnline && (
//               <div className="empty-state">
//                 <img src={noInternetImg} className="empty-img" alt="No internet" />

//                 <div className="empty-title">You're Offline!</div>
//                 <div className="empty-sub">
//                   Your projects and messages are safe here.
//                   Reconnect to get back to work.
//                 </div>

//                 <button className="empty-btn" onClick={() => window.location.reload()}>
//                   Retry
//                 </button>


//               </div>
//             )}

//             {/* 🔥 NO JOBS */}
//             {isOnline && filteredJobs.length === 0 && (
//               <div className="empty-state">
//                 <img src={noCardsImg} className="empty-img" alt="No cards" />

//                 <div className="empty-title">Oops! Looks like you’ve wandered off the project path</div>
//                 <div className="empty-sub">
//                   The page you’re looking for might have been moved, deleted, or is still under development.
//                 </div>

//                 <button className="empty-btn" onClick={() => navigate("/")}>
//                   Return to Home
//                 </button>
//               </div>
//             )}

//             {/* 🔥 JOB CARDS */}
//             {isOnline &&
//               filteredJobs.length > 0 &&
//               filteredJobs.map((job) => (
//                 <article
//                   key={job.id}
//                   className="job-card"
//                   onClick={() => onViewJob(job)}
//                 >
//                   <div className="job-card-top">
//                     <div>
//                       <h3 className="job-title">{job.title}</h3>
//                       <div className="job-sub">
//                         {job.company}  {job.role}
//                       </div>
//                     </div>

//                     <div className="job-budget-wrapper">
//                       <div className="job-budget">
//                         ₹{job.budget_from || job.budget}/day
//                       </div>

//                       <button
//                         className={`save-btn ${savedJobs.includes(job.id) ? "saved" : ""}`}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           toggleSave(job.id);
//                         }}
//                       >
//                         <FiBookmark />
//                       </button>
//                     </div>
//                   </div>

//                   <div className="job-skills">
//                     {job.skills?.map((skill, i) => (
//                       <span key={i} className="skill-chip">
//                         {skill}
//                       </span>
//                     ))}
//                   </div>

//                   <p className="job-desc">
//                     {job.description?.slice(0, 180)}
//                     {job.description?.length > 180 ? "..." : ""}
//                   </p>

//                   <div className="job-meta">
//                     <div className="job-stats">
//                       <div className="views">
//                         <FiEye /> <span>{job.views || 0} view</span>
//                       </div>
//                       <div className="created">
//                         <FiClock />
//                         {timeAgo(job.created_at)}
//                       </div>
//                     </div>
//                   </div>
//                 </article>
//               ))}
//           </div>
//         </section>
//       </main>

//       <button
//         className="fh-fab"
//         onClick={() => navigate("/freelance-dashboard/add-service-form")}
//       >
//         <FiPlus />
//       </button>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../../../firbase/Firebase";

import {
  FiBookmark,
  FiPlus,
  FiSearch,
  FiMessageCircle,
  FiBell,
  FiEye,
  FiClock,
} from "react-icons/fi";

import browseImg1 from "../../../assets/Container.png";
import browseImg2 from "../../../assets/wave.png";
import worksImg1 from "../../../assets/file.png";
import worksImg2 from "../../../assets/yellowwave.png";
import arrow from "../../../assets/arrow.png";
import profile from "../../../assets/profile.png";

// 🔥 NEW EMPTY STATE IMAGES
import noCardsImg from "../../../assets/dashboard.png";
import noInternetImg from "../../../assets/nointernet.png";
import notification from "../../../assets/notification.png";
import message from "../../../assets/message.png";
import search from "../../../assets/search.png";

import "./FreelanceHome.css";

export default function FreelanceHome() {
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [userMap, setUserMap] = useState({});

  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    role: "",
    profileImage: "",
  });

  const [notifCount, setNotifCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const [isOnline, setIsOnline] = useState(true); // 🔥 NEW – Internet check

  // ------------------------------
  // ✅ SIDEBAR COLLAPSE STATE (ADDED)
  // ------------------------------
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  useEffect(() => {
    function handleToggle(e) {
      // expecting custom event with detail boolean
      setCollapsed(!!e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  // persist collapsed to localStorage whenever it changes (helpful)
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed ? "true" : "false");
  }, [collapsed]);
  // ------------------------------

  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  // 🔥 INTERNET LISTENERS
  useEffect(() => {
    function updateStatus() {
      setIsOnline(navigator.onLine);
    }
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    updateStatus();
    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) return;
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          setUserInfo({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            role: data.role || "",
            profileImage: data.profileImage || "",
          });
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    });
    return unsubscribe;
  }, []);

  function updateSuggestions(text) {
    const q = text.toLowerCase();
    const setData = new Set();
    jobs.forEach((job) => {
      if (job.title?.toLowerCase().includes(q)) setData.add(job.title);
      if (job.skills) {
        job.skills.forEach((skill) => {
          if (skill.toLowerCase().includes(q)) setData.add(skill);
        });
      }
    });
    setSuggestions(Array.from(setData).slice(0, 6));
  }

  useEffect(() => {
    if (!searchText.trim()) return setSuggestions([]);
    updateSuggestions(searchText);
  }, [searchText, jobs]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "jobs"), (snap) => {
      setJobs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      setSavedJobs(snap.data()?.favoriteJobs || []);
    });
    return unsub;
  }, [user]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      const map = {};
      snap.docs.forEach((u) => (map[u.id] = u.data()));
      setUserMap(map);
    });
    return unsub;
  }, []);

  async function toggleSave(jobId) {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    const newList = savedJobs.includes(jobId)
      ? savedJobs.filter((x) => x !== jobId)
      : [...savedJobs, jobId];
    setSavedJobs(newList);
    await updateDoc(ref, { favoriteJobs: newList });
  }

  function onViewJob(job) {
    if (job.jobtype === "jobs_24h") {
      navigate(`/freelance-dashboard/job-24/${job.id}`);
    } else {
      navigate(`/freelance-dashboard/job-full/${job.id}`);
    }
  }

  useEffect(() => {
    if (!user) return;
    const refColl = collection(db, "accepted_jobs");
    const q = query(refColl, where("freelancerId", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setNotifications(items);
      const unread =
        items.filter((it) => it.isRead === false || it.isRead == null).length;
      setNotifCount(unread);
    });
    return unsub;
  }, [user]);

  const filteredJobs = jobs.filter((job) => {
    const txt = searchText.toLowerCase();
    const matchSearch =
      !searchText.trim() ||
      job.title?.toLowerCase().includes(txt) ||
      job.description?.toLowerCase().includes(txt) ||
      job.skills?.some((s) => s.toLowerCase().includes(txt));

    const matchCategory =
      category === "" ||
      (job.category && job.category.toLowerCase() === category.toLowerCase());

    return matchSearch && matchCategory;
  });

  function timeAgo(date) {
    if (!date) return "N/A";
    const time =
      typeof date.toDate === "function"
        ? date.toDate().getTime()
        : new Date(date).getTime();
    const diff = (Date.now() - time) / 1000;
    if (diff < 60) return `${Math.floor(diff)} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  }

  return (
    <div
      className="freelance-wrapper"
      style={{
        marginLeft: collapsed ? "-110px" : "100px",
        transition: "margin-left 0.25s ease",
      }}
    >
      <div className="fh-page rubik-font">

        {/* HEADER */}
        <header className="fh-header">
          <div className="fh-header-left">
            <div className="fh-welcome">
              <h1 className="fh-title">
                Welcome,<div>{userInfo.firstName || "Huzzlers"}</div>
              </h1>
              <div className="fh-subtitle">Discover projects that match your skills</div>
            </div>
          </div>

          <div className="fh-header-right">
            {/* 💬 Message Icon + Count */}
            <Link to={'/freelance-dashboard/freelancermessages'}>
              <img src={message} alt="messages" style={{ width: "31px", height: "29px", cursor: "pointer" }} />
            </Link>

            {/* 🔔 Notification Icon */}
            <img src={notification} alt="notification" style={{ width: "31px", height: "29px", cursor: "pointer" }} />
            {notifCount > 0 && (
              <span className="notif-count">{notifCount > 9 ? "9+" : notifCount}</span>
            )}

            {/* 👤 Profile Avatar */}
            <div className="fh-avatar">
              <Link to={'/freelance-dashboard/Profilebuilder'}>
                <img src={profile} alt="avatar" />
              </Link>
            </div>

          </div>
          <div
            style={{
              width: "1216px",
              height: "49.6px",
              background: "linear-gradient(90deg, #fffce3, #ffffff)",
              borderRadius: "16px",
              border: "0.8px solid #e6e6e6",
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              boxShadow: "0px 4px 18px rgba(0,0,0,0.10)",
            }}
          >
            <img src={search} alt="search" style={{ width: 18, opacity: 0.6 }} />

            <input
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                marginLeft: "-10px",
                marginTop: "15px",
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "15px",
              }}
            />

            {searchText && (
              <button
                onClick={() => setSearchText("")}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                  color: "#777",
                }}
              >
                ✕
              </button>
            )}
          </div>

        </header>

        {/* MAIN */}
        <main className="fh-main">

          {/* HERO SECTION */}
          <section className="fh-hero">
            <div className="fh-hero-card primary">
              <img src={browseImg1} className="hero-img img-1" alt="icon" />
              <img src={browseImg2} className="hero-img img-2" alt="icon" />
              <div className="hero-left">
                <h3>Browse All Projects</h3>
                <p>Explore all available opportunities</p>
              </div>
              <div className="hero-right">
                <img className="arrow" src={arrow} width={25} alt="" />
              </div>
            </div>

            <div className="fh-hero-card secondary">
              <img src={worksImg1} className="hero-img img-3" alt="icon" />
              <img src={worksImg2} className="hero-img img-4" alt="icon" />
              <div>
                <h4>My Works</h4>
                <p>Track your Work</p>
              </div>
              <div className="hero-right">
                <img className="arrow" src={arrow} width={25} alt="" />
              </div>
            </div>
          </section>

          {/* JOB LIST SECTION */}
          <section className="fh-section">
            <div className="section-header">
              <h2>Top Recommendations for You</h2>
              <Link className="view-all" to="/freelance-dashboard/browse-projects">View All →</Link>
            </div>

            <div className="jobs-list">

              {/* 🔥 NO INTERNET */}
              {!isOnline && (
                <div className="empty-state">
                  <img src={noInternetImg} className="empty-img" alt="No internet" />

                  <div className="empty-title">You're Offline!</div>
                  <div className="empty-sub">Your projects and messages are safe here. Reconnect to get back to work.</div>

                  <button className="empty-btn" onClick={() => window.location.reload()}>Retry</button>

                </div>
              )}

              {/* 🔥 NO JOBS */}
              {isOnline && filteredJobs.length === 0 && (
                <div className="empty-state">
                  <img src={noCardsImg} className="empty-img" alt="No cards" />

                  <div className="empty-title">Oops! Looks like you’ve wandered off the project path</div>
                  <div className="empty-sub">The page you’re looking for might have been moved, deleted, or is still under development.</div>

                  <button className="empty-btn" onClick={() => navigate("/")}>Return to Home</button>
                </div>
              )}

              {/* 🔥 JOB CARDS */}
              {isOnline &&
                filteredJobs.length > 0 &&
                filteredJobs.map((job) => (
                  <article
                    key={job.id}
                    className="job-card"
                    onClick={() => onViewJob(job)}
                  >
                    <div className="job-card-top">
                      <div>
                        <h3 className="job-title">{job.title}</h3>
                        <div className="job-sub">{job.company}  {job.role}</div>
                      </div>

                      <div className="job-budget-wrapper">
                        <div className="job-budget">₹{job.budget_from || job.budget}/day</div>

                        <button
                          className={`save-btn ${savedJobs.includes(job.id) ? "saved" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSave(job.id);
                          }}
                        >
                          <FiBookmark />
                        </button>
                      </div>
                    </div>

                    <div className="job-skills">
                      {job.skills?.map((skill, i) => (
                        <span key={i} className="skill-chip">{skill}</span>
                      ))}
                    </div>

                    <p className="job-desc">{job.description?.slice(0, 180)}{job.description?.length > 180 ? "..." : ""}</p>

                    <div className="job-meta">
                      <div className="job-stats">
                        <div className="views"><FiEye /> <span>{job.views || 0} view</span></div>
                        <div className="created"><FiClock />{timeAgo(job.created_at)}</div>
                      </div>
                    </div>
                  </article>
                ))}
            </div>
          </section>
        </main>

        <button
          className="fh-fab"
          onClick={() => navigate("/freelance-dashboard/add-service-form")}
        >
          <FiPlus />
        </button>
      </div>
    </div>
  );
}
