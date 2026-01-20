
// import React, { useEffect, useState } from "react";
// import {
//   collection,
//   doc,
//   getDoc,
//   onSnapshot,
//   updateDoc,
//   deleteDoc,
// } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { Link, useNavigate } from "react-router-dom";
// import { db } from "../firbase/Firebase";

// import {
//   FiBell,
//   FiMessageSquare,
//   FiUser,
//   FiArrowLeft,
//   FiBookmark,
//   FiPlus,
//   FiEye,
//   FiClock,
// } from "react-icons/fi";
// import backarrow from '../assets/backarrow.png';

// export default function SavedServicesOnly() {
//   const auth = getAuth();
//   const user = auth.currentUser;
//   const navigate = useNavigate();

//   // -------------------------
//   // Sidebar collapsed state
//   // -------------------------
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   useEffect(() => {
//     try {
//       localStorage.setItem("sidebar-collapsed", collapsed ? "true" : "false");
//     } catch (e) {
//       // ignore storage errors
//     }
//   }, [collapsed]);

//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   // -------------------------
//   // existing state
//   // -------------------------
//   const [jobs, setJobs] = useState([]);
//   const [savedJobs, setSavedJobs] = useState([]);

//   const [searchText, setSearchText] = useState("");
//   const [suggestions, setSuggestions] = useState([]);

//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [currentUserCategory, setCurrentUserCategory] = useState("");
//   const [userProfile, setUserProfile] = useState(null);
//   const isMobile = window.innerWidth <= 768;

//   /* =====================================================
//         FETCH USER PROFILE
//   ===================================================== */
//   const fetchUserProfile = async (uid) => {
//     try {
//       const snap = await getDoc(doc(db, "users", uid));
//       if (snap.exists()) {
//         setUserProfile(snap.data());
//       }
//     } catch (e) {
//       console.error("Profile fetch error:", e);
//     }
//   };

//   useEffect(() => {
//     const userCurrent = auth.currentUser;
//     if (!userCurrent) return;
//     fetchUserProfile(userCurrent.uid);
//   }, []);

//   /* =====================================================
//         NOTIFICATION STATE + BACKEND FETCH
//   ===================================================== */
//   const [notifications, setNotifications] = useState([]);
//   const [notifOpen, setNotifOpen] = useState(false);

//   useEffect(() => {
//     if (!user) return;

//     const unsub = onSnapshot(collection(db, "notifications"), (snap) => {
//       const userNots = snap.docs
//         .map((d) => ({ id: d.id, ...d.data() }))
//         .filter((n) => n.clientUid === user.uid);

//       setNotifications(userNots);
//     });

//     return unsub;
//   }, [user]);

//   const pending = notifications.filter((n) => !n.read).length;

//   async function acceptNotif(item) {
//     await updateDoc(doc(db, "notifications", item.id), { read: true });
//   }

//   async function declineNotif(item) {
//     await deleteDoc(doc(db, "notifications", item.id));
//   }

//   /* =====================================================
//         LOAD USER CATEGORY
//   ===================================================== */
//   useEffect(() => {
//     if (!user) return;
//     return onSnapshot(doc(db, "users", user.uid), (snap) => {
//       setCurrentUserCategory(snap.data()?.category || "");
//     });
//   }, [user]);

//   /* =====================================================
//         LOAD USER LIST CATEGORIES
//   ===================================================== */
//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "users"), (snap) => {
//       const allCats = snap.docs
//         .map((d) => d.data().category)
//         .filter((cat) => cat && cat.trim() !== "");

//       const uniqueCats = [...new Set(allCats)];

//       const finalCats = uniqueCats.map((name, index) => ({
//         id: index + 1,
//         name,
//       }));

//       setCategories(finalCats);
//     });

//     return unsub;
//   }, []);

//   /* =====================================================
//         LOAD ALL JOBS (services + service_24h)
//   ===================================================== */
//   useEffect(() => {
//     const unsub1 = onSnapshot(collection(db, "services"), (snap) => {
//       const normalJobs = snap.docs.map((docSnap) => ({
//         id: docSnap.id,
//         ...docSnap.data(),
//         jobtype: "services",
//       }));

//       setJobs((prev) => {
//         const only24h = prev.filter((j) => j.jobtype === "service_24h");
//         return [...only24h, ...normalJobs];
//       });
//     });

//     const unsub2 = onSnapshot(collection(db, "service_24h"), (snap) => {
//       const fastJobs = snap.docs.map((docSnap) => ({
//         id: docSnap.id,
//         ...docSnap.data(),
//         jobtype: "service_24h",
//       }));

//       setJobs((prev) => {
//         const onlyNormal = prev.filter((j) => j.jobtype === "services");
//         return [...onlyNormal, ...fastJobs];
//       });
//     });

//     return () => {
//       unsub1();
//       unsub2();
//     };
//   }, []);

//   /* =====================================================
//         LOAD SAVED JOBS
//   ===================================================== */
//   useEffect(() => {
//     if (!user) return;

//     const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
//       setSavedJobs(snap.data()?.favoriteJobs || []);
//     });

//     return unsub;
//   }, [user]);

//   /* =====================================================
//         SAVE / UNSAVE JOB
//   ===================================================== */
//   async function toggleSave(jobId) {
//     if (!user) return;

//     const ref = doc(db, "users", user.uid);
//     const updated = savedJobs.includes(jobId)
//       ? savedJobs.filter((id) => id !== jobId)
//       : [...savedJobs, jobId];

//     setSavedJobs(updated);
//     await updateDoc(ref, { favoriteJobs: updated });
//   }

//   /* =====================================================
//         SEARCH AUTOSUGGEST
//   ===================================================== */
//   function updateSuggestions(text) {
//     const q = text.toLowerCase();
//     const s = new Set();

//     jobs.forEach((job) => {
//       if (job.title?.toLowerCase().includes(q)) s.add(job.title);
//       if (job.skills) {
//         job.skills.forEach((sk) => {
//           if (sk.toLowerCase().includes(q)) s.add(sk);
//         });
//       }
//     });

//     setSuggestions([...s].slice(0, 6));
//   }

//   useEffect(() => {
//     if (!searchText.trim()) {
//       setSuggestions([]);
//       return;
//     }
//     updateSuggestions(searchText);
//   }, [searchText]);

//   /* =====================================================
//         FILTER JOBS (SAVED ONLY)
//   ===================================================== */
//   const filteredJobs = jobs.filter((job) => {
//     const matchSaved = savedJobs.includes(job.id);

//     const matchSearch =
//       job.title?.toLowerCase().includes(searchText.toLowerCase()) ||
//       job.description?.toLowerCase().includes(searchText.toLowerCase());

//     const matchCategory =
//       selectedCategory === "" ||
//         selectedCategory === "No Category Assigned"
//         ? true
//         : job.category === selectedCategory;

//     return matchSaved && matchSearch && matchCategory;
//   });

//   /* =====================================================
//         OPEN JOB DETAILS
//   ===================================================== */
//   function onViewJob(job) {
//     if (job.jobtype === "service_24h") {
//       navigate(`/client-dashbroad2/service-24h/${job.id}`);
//     } else {
//       navigate(`/client-dashbroad2/service/${job.id}`);
//     }
//   }

//   /* =====================================================
//         PAGE UI (SAVED ONLY)
//   ===================================================== */
//   return (
//     <div
//       className="freelance-wrapper"
//       style={{
//   marginLeft: isMobile
//     ? "12px"                     // 🔥 MOBILE → small left gap
//     : collapsed
//     ? "40px"
//     : "150px",

//   marginRight: isMobile ? "12px" : "0", // 🔥 MOBILE RIGHT SPACE

//   transition: "margin-left 0.25s ease",
//   marginTop: "40px",
//   padding: isMobile ? "16px" : "20px 22px",

//   width: isMobile ? "100%" : "80%",     // 🔥 MOBILE FULL WIDTH
//   boxSizing: "border-box",
// }}

//     >
//       {/* HEADER */}
//       <div className="topbar">
//         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//           <div
//             onClick={() => navigate(-1)}
//             style={{
//               width: 36,
//               height: 36,
//               borderRadius: 14,
//               border: "0.8px solid #E0E0E0",
//               backgroundColor: "#FFFFFF",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               cursor: "pointer",
//               boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
//               flexShrink: 0,
//             }}
//           >
//             <img
//               src={backarrow}
//               alt="back"
//               style={{ width: 16, height: 16 }}
//             />
//           </div>
//           <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
//             Saved
//           </h1>
//         </div>

//         <div className="top-right">
//           <FiMessageSquare
//             className="top-icon"
//             onClick={() => {
//               navigate("/client-dashbroad2/messages");
//             }}
//           />

//           {/* NOTIFICATION BUTTON */}
//           <div
//             style={{ position: "relative" }}
//             onClick={() => setNotifOpen(true)}
//           >
//             <FiBell className="top-icon" />

//             {pending > 0 && (
//               <span
//                 style={{
//                   position: "absolute",
//                   top: -6,
//                   right: -6,
//                   background: "red",
//                   color: "#fff",
//                   fontSize: "10px",
//                   borderRadius: "50%",
//                   padding: "2px 6px",
//                 }}
//               >
//                 {pending}
//               </span>
//             )}
//           </div>

//           <div className="fh-avatar">
//             <Link to={"/client-dashbroad2/ClientProfile"}>
//               <img
//                 src={
//                   userProfile?.profileImage ||
//                   "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
//                 }
//                 alt="Profile"
//               />
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Search */}
//       <div style={{ position: "relative" }}>
//         <input
//           type="text"
//           className="search-input"
//           placeholder="Search"
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//         />

//         {suggestions.length > 0 && (
//           <div className="suggestion-box">
//             {suggestions.map((s, i) => (
//               <p
//                 key={i}
//                 onClick={() => {
//                   setSearchText(s);
//                   setSuggestions([]);
//                 }}
//                 className="suggestion-item"
//               >
//                 {s}
//               </p>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Categories */}
//       {/* {categories.length > 0 ? (
//         <div className="category-row">
//           {categories.map((cat) => (
//             <button
//               key={cat.id}
//               className={
//                 selectedCategory === cat.name
//                   ? "category-active"
//                   : "category-btn"
//               }
//               onClick={() =>
//                 setSelectedCategory(
//                   selectedCategory === cat.name ? "" : cat.name
//                 )
//               }
//             >
//               {cat.name}
//             </button>
//           ))}
//         </div>
//       ) : (
//         <div style={{ padding: "10px 0", opacity: 0.5 }}>
//           No categories found in database.
//         </div>
//       )} */}

//       {/* Tabs UI (same look – Saved active only) */}
//       <div style={{marginLeft:"-10px"}} className="jobtabs-wrapper">

//         <button  className="jobtab active-tab">Saved</button>
//       </div>

//       {/* Job List (SAVED ONLY) */}
//       <div className="job-list">
//         {filteredJobs.length === 0 && (
//           <div style={{ padding: "20px 0", opacity: 0.6 }}>
//             No saved services found.
//           </div>
//         )}

//         {filteredJobs.map((job) => (
//           <div
//             key={job.id}
//             className="job-card"
//             onClick={() => onViewJob(job)}
//           >
//             <div className="job-top">
//               <h3 className="job-title">{job.title}</h3>
//               <FiBookmark
//                 className={`bookmark-icon ${savedJobs.includes(job.id) ? "bookmarked" : ""
//                   }`}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   toggleSave(job.id);
//                 }}
//               />
//             </div>

//             <p className="job-desc">{job.description}</p>

//             <div className="job-info-row">
//               <span className="job-amount">
//                 ₹{job.budget_from} - ₹{job.budget_to}
//               </span>

//               <div className="job-icon-group">
//                 <span className="tag-icon">
//                   <FiEye /> {job.views || "4+"}
//                 </span>
//                 <span className="tag-icon">
//                   <FiClock /> {job.time || "1h ago"}
//                 </span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Floating Add Button */}
//       <button
//         className="floating-plus"
//         onClick={() => navigate("/client-dashbroad2/PostJob")}
//       >
//         <FiPlus size={22} />
//       </button>

//       {/* ================================================================= */}
//       {/* ======================= NOTIFICATION POPUP ======================= */}
//       {/* ================================================================= */}
//       {notifOpen && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,0.4)",
//             backdropFilter: "blur(2px)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 9999,
//           }}
//           onClick={(e) => {
//             if (e.target === e.currentTarget) setNotifOpen(false);
//           }}
//         >
//           <div
//             style={{
//               width: "90%",
//               maxWidth: 420,
//               background: "#fff",
//               padding: 20,
//               borderRadius: 16,
//               maxHeight: "80vh",
//               overflowY: "auto",
//             }}
//           >
//             <h3 style={{ marginBottom: 15 }}>Notifications</h3>

//             {notifications.length === 0 && (
//               <div style={{ padding: 20, textAlign: "center" }}>
//                 No notifications
//               </div>
//             )}

//             {notifications.map((item, i) => (
//               <div
//                 key={i}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: 15,
//                   background: "#f7f7f7",
//                   padding: 10,
//                   borderRadius: 10,
//                 }}
//               >
//                 <img
//                   src={
//                     item.freelancerImage ||
//                     "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
//                   }
//                   width={48}
//                   height={48}
//                   style={{ borderRadius: "50%", marginRight: 10 }}
//                 />

//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontWeight: 600 }}>
//                     {item.freelancerName}
//                   </div>
//                   <div>applied for {item.jobTitle}</div>
//                 </div>

//                 {!item.read ? (
//                   <>
//                     <button
//                       onClick={() => acceptNotif(item)}
//                       style={{ marginRight: 8 }}
//                     >
//                       ✅
//                     </button>
//                     <button onClick={() => declineNotif(item)}>❌</button>
//                   </>
//                 ) : (
//                   <button onClick={() => acceptNotif(item)}>💬</button>
//                 )}
//               </div>
//             ))}

//             <button
//               style={{
//                 marginTop: 10,
//                 width: "100%",
//                 padding: 10,
//                 borderRadius: 10,
//                 background: "#000",
//                 color: "#fff",
//               }}
//               onClick={() => setNotifOpen(false)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ================================================================= */}
//       {/* =============================== CSS =============================== */}
//       {/* ================================================================= */}
//       <style>{`
//         * { font-family: 'Poppins', sans-serif; }
//         .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
//         .top-left { display: flex; align-items: center; gap: 12px; }
//         .back-btn { width: 44px; height: 44px; background: #efe9ff; border-radius: 14px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
//         .page-title { font-size: 21px; font-weight: 700; }
//         .top-right { display: flex; gap: 16px; }
//         .top-icon { font-size: 20px; cursor: pointer; }

//         .fh-avatar img {
//           width: 40px;
//           height: 40px;
//           border-radius: 50%;
//           object-fit: cover;
//         }

//         .search-input {
//           width: 100%; padding: 12px 14px;
//           border-radius: 12px; background: #fff;
//           border: 1px solid #e6e7ee; font-size: 15px;
//         }
//         .suggestion-box {
//           background: #fff; border: 1px solid #ddd; position: absolute;
//           top: 50px; width: 100%; border-radius: 12px;
//           box-shadow: 0 4px 18px rgba(0,0,0,.1); z-index: 10; padding: 8px;
//         }
//         .suggestion-item { padding: 8px; cursor: pointer; }

//         .category-row { display: flex; gap: 10px; margin: 14px 0; overflow-x: auto; }
//         .category-btn, .category-active {
//           padding: 8px 14px; white-space: nowrap;
//           border-radius: 999px; cursor: pointer; font-weight: 600;
//         }
//         .category-btn { background: white; border: 1px solid #e2e8f0; color: #444; }
//         .category-active { background: #7c3aed; color: #fff; }

//         .jobtabs-wrapper {
//           background: #fff; display: flex; gap: 10px;
//           padding: 10px; border-radius: 14px; border: 1px solid #ececec;
//           margin-top: 4px;
//         }
//         .jobtab {
//           padding: 10px 14px; border-radius: 10px;
//           font-weight: 700; cursor: default; opacity: .6; width: 100px; border: none;
//         }
//         .active-tab { background: #7c3aed; color: white; opacity: 1; }

//         .job-list { display: flex; flex-direction: column; gap: 18px; margin-top: 20px; }
//         .job-card {
//           background: #fff; border-radius: 18px; padding: 18px;
//           border: 1px solid #ececec; cursor: pointer;
//           transition: .2s;
//         }
//         .job-card:hover { transform: translateY(-3px); box-shadow: 0 6px 18px rgba(0,0,0,.08); }

//         .job-top { display: flex; justify-content: space-between; align-items: flex-start; }
//         .job-title { font-size: 17px; font-weight: 700; margin: 0; }
//         .job-desc { font-size: 14px; opacity: .85; margin: 0; margin-top: 4px; }

//         .bookmark-icon { font-size: 20px; cursor: pointer; color: #777; }
//         .bookmarked { color: #7c3aed !important; }

//         .job-info-row {
//           display: flex; justify-content: space-between; align-items: center; margin-top: 10px;
//         }
//         .job-amount { font-size: 17px; font-weight: 700; }
//         .job-icon-group { display: flex; gap: 12px; }
//         .tag-icon { display: flex; align-items: center; gap: 4px; font-size: 12px; }

//         .floating-plus {
//           position: fixed; right: 22px; bottom: 22px;
//           width: 56px; height: 56px; border-radius: 50%;
//           background: #7c3aed; color: white;
//           display: flex; align-items: center; justify-content: center;
//           box-shadow: 0 8px 18px rgba(99,102,241,.2); border: none;
//         }
//       `}</style>
//     </div>
//   );
// }






// import React, { useEffect, useMemo, useState, useRef } from "react";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   runTransaction,
//   updateDoc,
//   arrayUnion,
//   arrayRemove,
//   Timestamp,
//   query,
//   where,
//   getDoc,
// } from "firebase/firestore";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { db } from "../firbase/Firebase";
// import { useNavigate, Link } from "react-router-dom";
// import { FiEye, FiMessageCircle, FiBell } from "react-icons/fi";
// import FilterScreen, { JobFilter } from "../firebaseClientScreen/Postjob/Filter";
// import { Bookmark, Clock } from "lucide-react";
// import { BsBookmarkFill } from "react-icons/bs";
// // import "./clientsideCategorypage.css";
// import sortimg from "../assets/sort.png";
// import backarrow from "../assets/backarrow.png";
// import profile from "../assets/profile.png";
// import message from "../assets/message.png";
// import notifiaction from "../assets/notification.png";
// import filter1 from "../assets/Filter.png";
// import search1 from "../assets/search.png";

// const formatCurrency = (value = 0) => {
//   const v = Number(value) || 0;
//   if (v >= 100000) return (v / 100000).toFixed(1) + "L";
//   if (v >= 1000) return (v / 1000).toFixed(1) + "K";
//   return v.toString();
// };

// const skillColor = (skill) => {
//   const colors = [
//     "#FFC1B6",
//     "#BDF4FF",
//     "#E6C9FF",
//     "#C6F7D6",
//     "#FFF3B0",
//     "#FFD6E8",
//     "#D7E3FC",
//   ];
//   return colors[skill.length % colors.length];
// };

// export default function CategoryPage({ initialTab = "Saved" }) {

//   const auth = getAuth();
//   const user = auth.currentUser;
//   const navigate = useNavigate();

//   const [tab, setTab] = useState(initialTab);
//   const [search, setSearch] = useState("");
//   const [sort, setSort] = useState("");

//   const [filter, setFilter] = useState(new JobFilter());
//   const [showFilter, setShowFilter] = useState(false);
//   const isMobile = window.innerWidth <= 768;

//   const [services, setServices] = useState([]);
//   const [services24, setServices24] = useState([]);
//   const [savedIds, setSavedIds] = useState([]);
//   const [userProfile, setUserProfile] = useState(null);
//   const [notifications, setNotifications] = useState([]);
//   const [notifOpen, setNotifOpen] = useState(false);
//   const [showSort, setShowSort] = useState(false);
//   const sortRef = useRef(null);

//   const pending = notifications.filter((n) => !n.read).length;

//   const getJobDate = (date) => {
//     if (!date) return null;

//     if (date instanceof Timestamp) {
//       return date.toDate();
//     }

//     if (date?.seconds) {
//       return new Date(date.seconds * 1000);
//     }

//     if (date instanceof Date) return date;

//     const parsed = new Date(date);
//     if (!isNaN(parsed)) return parsed;

//     return null;
//   };

//   function timeAgo(ts) {
//     if (!ts) return "Just now";
//     const d = ts instanceof Timestamp ? ts.toDate() : new Date(ts);
//     const diff = (Date.now() - d.getTime()) / 1000;

//     if (diff < 60) return `${Math.floor(diff)}s ago`;
//     if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
//     if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
//     return `${Math.floor(diff / 86400)}d ago`;
//   }

//   useEffect(() => {
//     function handleOutsideClick(e) {
//       if (sortRef.current && !sortRef.current.contains(e.target)) {
//         setShowSort(false);
//       }
//     }

//     if (showSort) {
//       document.addEventListener("mousedown", handleOutsideClick);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleOutsideClick);
//     };
//   }, [showSort]);

//   useEffect(() => {
//     if (!user) return;

//     const unsub1 = onSnapshot(collection(db, "services"), (snap) => {
//       setServices(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//     });

//     const unsub2 = onSnapshot(collection(db, "service_24h"), (snap) => {
//       setServices24(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//     });

//     const unsubUser = onSnapshot(doc(db, "users", user.uid), (snap) => {
//       setSavedIds(snap.data()?.savedJobs || []);
//     });

//     return () => {
//       unsub1();
//       unsub2();
//       unsubUser();
//     };
//   }, [user]);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) return;

//       const userRef = doc(db, "users", currentUser.uid);
//       const snap = await getDoc(userRef);

//       if (snap.exists()) {
//         setUserProfile(snap.data());
//       }
//     });

//     return unsubscribe;
//   }, []);

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (!user) return;

//     const q = query(
//       collection(db, "notifications"),
//       where("clientUid", "==", user.uid)
//     );

//     return onSnapshot(q, (snap) => {
//       setNotifications(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//     });
//   }, []);

//   async function acceptNotif(item) {
//     await updateDoc(doc(db, "notifications", item.id), { read: true });

//     navigate("/chat", {
//       state: {
//         currentUid: auth.currentUser.uid,
//         otherUid: item.freelancerId,
//         otherName: item.freelancerName,
//         otherImage: item.freelancerImage,
//         initialMessage: `Your application for ${item.jobTitle} accepted!`,
//       },
//     });
//   }

//   const incrementViewOnce = async (collectionName, jobId) => {
//     const ref = doc(db, collectionName, jobId);

//     await runTransaction(db, async (tx) => {
//       const snap = await tx.get(ref);
//       if (!snap.exists()) return;

//       const viewedBy = snap.data().viewedBy || [];
//       if (viewedBy.includes(user.uid)) return;

//       tx.update(ref, {
//         views: (snap.data().views || 0) + 1,
//         viewedBy: arrayUnion(user.uid),
//       });
//     });
//   };

//   const applyFilter = (jobs) => {
//     return jobs
//       .filter((j) => {
//         const title = (j.title || "").toLowerCase();
//         const category = (j.category || "").toLowerCase();
//         const skills = j.skills || [];

//         if (search) {
//           const q = search.toLowerCase();
//           if (
//             !title.includes(q) &&
//             !category.includes(q) &&
//             !skills.some((s) => s.toLowerCase().includes(q))
//           )
//             return false;
//         }

//         if (filter.categories.length && !filter.categories.includes(j.category))
//           return false;

//         if (
//           filter.skills.length &&
//           !skills.some((s) => filter.skills.includes(s))
//         )
//           return false;

//         const from = Number(j.budget_from ?? j.budget ?? 0);
//         const to = Number(j.budget_to ?? j.budget ?? from);

//         if (filter.minPrice !== null && to < filter.minPrice) return false;
//         if (filter.maxPrice !== null && from > filter.maxPrice) return false;

//         if (filter.deliveryTime) {
//           const createdDate = getJobDate(j.createdAt || j.postedAt);

//           if (!createdDate) return true;

//           const now = new Date();
//           const diffDays =
//             (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);

//           if (filter.deliveryTime === "today") {
//             const startOfToday = new Date();
//             startOfToday.setHours(0, 0, 0, 0);
//             return createdDate >= startOfToday;
//           }

//           if (filter.deliveryTime === "3d") return diffDays <= 3;
//           if (filter.deliveryTime === "7d") return diffDays <= 7;
//           if (filter.deliveryTime === "30d") return diffDays <= 30;
//         }

//         return true;
//       })
//       .sort((a, b) => {
//         if (sort === "Newest")
//           return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
//         if (sort === "Oldest")
//           return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0);
//         return 0;
//       });
//   };

//   const jobs = useMemo(() => {
//     if (tab === "Work") return applyFilter(services);
//     if (tab === "24 hour") return applyFilter(services24);
//     return [...services, ...services24].filter((j) => savedIds.includes(j.id));
//   }, [tab, services, services24, savedIds, search, filter, sort]);

//   const toggleSave = async (jobId, isSaved) => {
//     await updateDoc(doc(db, "users", user.uid), {
//       savedJobs: isSaved ? arrayRemove(jobId) : arrayUnion(jobId),
//     });
//   };

//   return (
//     <div
//       style={{
//         padding: isMobile ? "16px" : 210,
//         marginTop: isMobile ? "0px" : "-160px",
//       }}
//     >

//       <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//         <div
//           onClick={() => navigate(-1)}
//           style={{
//             width: 36,
//             height: 36,
//             borderRadius: 14,
//             border: "0.8px solid #E0E0E0",
//             backgroundColor: "#FFFFFF",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             cursor: "pointer",
//             boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
//             flexShrink: 0,
//           }}
//         >
//           <img
//             src={backarrow}
//             alt="Back"
//             style={{
//               width: 16,
//               height: 18,
//               objectFit: "contain",
//             }}
//           />
//         </div>

//         <div>
//           <div style={{ fontSize: 32, fontWeight: 400 }}>
//             Explore Freelancer
//           </div>
//         </div>
//       </div>

//       <div id="fh-header-right" className="fh-header-right" style={{
//         marginTop: "1px",
//         marginRight: isMobile ? "0px" : "190px",
//       }}
//       >

//         <img onClick={() => navigate("/client-dashbroad2/messages")} style={{ width: "26px" }} src={message} alt="message" />




//         <img onClick={() => setNotifOpen(true)} src={notifiaction} style={{ width: "26px" }} alt="notifiaction" />
//         {pending > 0 && (
//           <span
//             style={{
//               width: 8,
//               height: 8,
//               borderRadius: "50%",
//               background: "red",
//               position: "absolute",
//               top: 6,
//               right: 5,
//             }}
//           ></span>
//         )}


//         {/* <div className="fh-avatr">
//           <Link to={"/client-dashbroad2/companyprofileview"}>
//             <img style={{ width: "34px", padding: "3px", height: "34px" }} src={userProfile?.profileImage || profile} alt="Profile" />
//           </Link>
//         </div> */}
//       </div>

//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           gap: "12px",
//           width: "100%",
//         }}
//       >
//         {/* LEFT – SEARCH */}
//         <div
//           style={{
//             display: "flex",
//             marginTop: "34px",
//             alignItems: "center",
//             gap: "8px",
//             border: "1px solid #ddd",
//             borderRadius: "10px",
//             width: "100%",
//             height: "44px"
//           }}
//         >
//           <img
//             src={search1}
//             alt="search"
//             style={{
//               width: 18,
//               height: 18,
//               opacity: 0.6,
//               marginLeft: '13px',
//             }}
//           />

//           <input
//             id="job-search"
//             placeholder="Search"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             style={{
//               flex: 1,
//               border: "none",
//               outline: "none",
//               fontSize: "14px",
//               marginLeft: '0px',

//               height: "19px",        // ✅ INPUT HEIGHT SMALL
//               lineHeight: "21px",    // ✅ TEXT CENTER ALIGN
//               padding: "0",          // ✅ EXTRA SPACE REMOVE
//               marginTop: "12px"
//             }}
//           />

//         </div>

//       </div>

//       {showSort && (
//         <div
//           ref={sortRef}        // ✅ IMPORTANT
//           id="sort-wrapper"
//           style={{
//             position: "absolute",
//             marginLeft: isMobile ? "0px" : "810px",
//             marginTop: isMobile ? "70px" : "130px",
//             background: "#fff",
//             borderRadius: "30px",
//             boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
//             padding: "16px",
//             zIndex: 1000,
//             width: isMobile ? "90%" : "360px",
//             left: isMobile ? "5%" : "auto",
//           }}
//         >
//           {["Newest", "Oldest", "Availability"].map((s, i) => (
//             <button
//               key={s}
//               onClick={() => {
//                 setSort(s);
//                 setShowSort(false);
//               }}
//               style={{
//                 width: "100%",
//                 textAlign: "left",
//                 padding: "12px 14px",
//                 marginBottom: "10px",
//                 border: "none",
//                 borderRadius: "10px",
//                 cursor: "pointer",
//                 fontWeight: 500,
//                 background: sort === s ? "#7C3CFF" : "#f9f9f9",

//                 /* 👇 animation magic */
//                 opacity: showSort ? 1 : 0,
//                 transform: showSort
//                   ? "translateY(0px)"
//                   : "translateY(10px)",
//                 transition: "all 0.35s ease",
//                 transitionDelay: `${i * 0.12}s`,
//               }}
//             >
//               {s}
//             </button>
//           ))}
//         </div>
//       )}


//       <div
//         style={{
//           width: "100%",
//           padding: "12px 16px",
//           // background: "linear-gradient(90deg, #f6e9ff, #fff7d6)",
//           borderRadius: "18px",
//           boxShadow: "0 10px 22px rgba(0,0,0,0.12)",
//           marginTop: "30px"
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "14px",
//           }}
//         >
//           {["Work", "24 Hours", "Saved"].map((t) => {
//             const isActive = tab === t;

//             return (
//               <span
//                 key={t}
//                 onClick={() => setTab(t)}
//                 style={{
//                   padding: "7px 28px",
//                   borderRadius: "999px",
//                   cursor: "pointer",
//                   fontSize: "14px",
//                   fontWeight: isActive ? 600 : 500,

//                   // 🔥 CHANGE HERE
//                   color: isActive ? "#FFFFFF" : "#333",

//                   background: isActive ? "#7C3CFF" : "transparent",
//                   boxShadow: isActive
//                     ? "0 4px 10px rgba(0,0,0,0.15)"
//                     : "none",
//                   transition: "all 0.25s ease",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 {t}
//               </span>

//             );
//           })}
//         </div>
//       </div>

//       {/* FILTER + SORT BAR */}
//       <div
//         style={{
//           display: "flex",
//           // alignItems: "center",
//           justifyContent: isMobile ? "space-between" : "flex-end",

//           width: "100%",
//           padding: "10px 14px",
//           marginTop: "15px",
//           flexWrap: "wrap", // mobile safety
//           gap: "10px",
//           // marginLeft:
//         }}
//       >
//         {/* LEFT – FILTER */}
//         <div
//           onClick={() => setShowFilter(true)}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "6px",
//             cursor: "pointer",
//             fontWeight: 500,
//           }}
//         >
//           <img
//             src={filter1}
//             alt="Filter"
//             style={{ width: 18, height: 18 }}
//           />
//           <span>Filter</span>
//         </div>

//         {/* RIGHT – SORT */}
//         <div
//           onClick={() => setShowSort(!showSort)}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "6px",
//             cursor: "pointer",
//             fontWeight: 500,
//           }}
//         >
//           <img
//             src={sortimg}
//             alt="Sort"
//             style={{ width: 18, height: 18 }}
//           />
//           <span>Sort</span>
//         </div>
//       </div>



//       <div style={{ marginTop: 20 }}>
//         {jobs.length === 0 && <p>No jobs found</p>}

//         {jobs.map((job) => {
//           const isSaved = savedIds.includes(job.id);
//           return (
//             <div
//               key={job.id}
//               onClick={() => {
//                 incrementViewOnce(
//                   tab === "24 hour" ? "service_24h" : "services",
//                   job.id
//                 );
//                 navigate(`/client-dashbroad2/service/${job.id}`);
//               }}
//               style={{
//                 background: "#fff",
//                 borderRadius: 20,
//                 padding: "22px",
//                 marginBottom: 22,
//                 cursor: "pointer",
//                 boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
//                 position: "relative", // 🔥 MUST
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "flex-start",
//                 }}
//               >
//                 <h3 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>
//                   {job.title}
//                 </h3>


//                 <div id="job-budget" className="job-budget">₹{job.budget_from || job.budget} - {job.budget_to || job.budget}</div>
//               </div>
//               <div style={{ fontSize: "14", marginTop: "10px", color: "gray", fontWeight: "400" }}>Skills Required</div>
//               <div
//                 style={{
//                   display: "flex",
//                   gap: 8,
//                   margin: "12px 0",
//                   flexWrap: "wrap", // 🔥 mobile la next line pogum
//                 }}
//               >
//                 {(job.skills || []).slice(0, 3).map((s) => (
//                   <span
//                     key={s}
//                     style={{
//                       background: "#FFF085B2",
//                       padding: isMobile ? "4px 10px" : "6px 14px", // mobile small
//                       borderRadius: 999,
//                       fontSize: isMobile ? 11 : 13, // mobile small text
//                       fontWeight: 500,
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     {s}
//                   </span>
//                 ))}

//                 {job.skills?.length > 3 && (
//                   <span
//                     style={{
//                       background: "#FFF085B2",
//                       padding: isMobile ? "4px 10px" : "6px 14px",
//                       borderRadius: 999,
//                       fontSize: isMobile ? 11 : 13,
//                       fontWeight: 500,
//                     }}
//                   >
//                     +{job.skills.length - 3}
//                   </span>
//                 )}
//               </div>


//               <p
//                 style={{
//                   fontSize: 14,
//                   color: "#555",
//                   lineHeight: 1.6,
//                   marginBottom: 14,
//                 }}
//               >
//                 {job.description?.slice(0, 320)}
//                 {job.description?.length > 200 ? "..." : ""}
//               </p>

//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     gap: 18,
//                     fontSize: 13,
//                     color: "#777",
//                   }}
//                 >
//                   <span
//                     style={{ display: "flex", gap: 6, alignItems: "center" }}
//                   >
//                     <FiEye /> {job.views || 0} Impression
//                   </span>
//                   <span
//                     style={{ display: "flex", gap: 6, alignItems: "center" }}
//                   >
//                     <Clock size={14} />
//                     {timeAgo(job.createdAt)}
//                   </span>
//                 </div>

//                 <div
//                   style={{
//                     position: "absolute",
//                     top: 60,
//                     right: 20,
//                     cursor: "pointer",
//                     zIndex: 10,
//                   }}
//                   onClick={(e) => {
//                     e.stopPropagation(); // 🔥 card click stop
//                     toggleSave(job.id, savedIds.includes(job.id));
//                   }}
//                 >
//                   {savedIds.includes(job.id) ? (
//                     <BsBookmarkFill size={20} />
//                   ) : (
//                     <Bookmark size={20} />
//                   )}
//                 </div>

//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {showFilter && (
//         <div style={modalStyle}>
//           <FilterScreen
//             initialFilter={filter}
//             onClose={() => setShowFilter(false)}
//             onApply={(appliedFilter) => {
//               setFilter(appliedFilter);
//               setShowFilter(false);
//             }}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// const modalStyle = {
//   position: "fixed",
//   inset: 0,
//   background: "rgba(0,0,0,0.35)",
//   zIndex: 999,
//   overflowY: "auto",
// };






import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  collection,
  doc,
  onSnapshot,
  runTransaction,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firbase/Firebase";
import { useNavigate, Link } from "react-router-dom";
import { FiEye, FiMessageCircle, FiBell } from "react-icons/fi";
import FilterScreen, { JobFilter } from "../firebaseClientScreen/Postjob/Filter";
import { Bookmark, Clock } from "lucide-react";
import { BsBookmarkFill } from "react-icons/bs";
// import "./clientsideCategorypage.css";
import sortimg from "../assets/sort.png";
import backarrow from "../assets/backarrow.png";
import profile from "../assets/profile.png";
import message from "../assets/message.png";
import notifiaction from "../assets/notification.png";
import filter1 from "../assets/Filter.png";
import search1 from "../assets/search.png";

const formatCurrency = (value = 0) => {
  const v = Number(value) || 0;
  if (v >= 100000) return (v / 100000).toFixed(1) + "L";
  if (v >= 1000) return (v / 1000).toFixed(1) + "K";
  return v.toString();
};

const skillColor = (skill) => {
  const colors = [
    "#FFC1B6",
    "#BDF4FF",
    "#E6C9FF",
    "#C6F7D6",
    "#FFF3B0",
    "#FFD6E8",
    "#D7E3FC",
  ];
  return colors[skill.length % colors.length];
};

export default function CategoryPage({ initialTab = "Saved" }) {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [tab, setTab] = useState(initialTab);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const [filter, setFilter] = useState(new JobFilter());
  const [showFilter, setShowFilter] = useState(false);
  const isMobile = window.innerWidth <= 768;

  const [services, setServices] = useState([]);
  const [services24, setServices24] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const sortRef = useRef(null);

  const pending = notifications.filter((n) => !n.read).length;

  const getJobDate = (date) => {
    if (!date) return null;

    if (date instanceof Timestamp) {
      return date.toDate();
    }

    if (date?.seconds) {
      return new Date(date.seconds * 1000);
    }

    if (date instanceof Date) return date;

    const parsed = new Date(date);
    if (!isNaN(parsed)) return parsed;

    return null;
  };

  function timeAgo(ts) {
    if (!ts) return "Just now";
    const d = ts instanceof Timestamp ? ts.toDate() : new Date(ts);
    const diff = (Date.now() - d.getTime()) / 1000;

    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  useEffect(() => {
    function handleOutsideClick(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setShowSort(false);
      }
    }

    if (showSort) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showSort]);

  useEffect(() => {
    if (!user) return;

    const unsub1 = onSnapshot(collection(db, "services"), (snap) => {
      setServices(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const unsub2 = onSnapshot(collection(db, "service_24h"), (snap) => {
      setServices24(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const unsubUser = onSnapshot(doc(db, "users", user.uid), (snap) => {
      setSavedIds(snap.data()?.savedJobs || []);
    });

    return () => {
      unsub1();
      unsub2();
      unsubUser();
    };
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) return;

      const userRef = doc(db, "users", currentUser.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        setUserProfile(snap.data());
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      where("clientUid", "==", user.uid)
    );

    return onSnapshot(q, (snap) => {
      setNotifications(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, []);

  async function acceptNotif(item) {
    try {
      await updateDoc(doc(db, "notifications", item.id), { read: true });

      navigate("/chat", {
        state: {
          currentUid: auth.currentUser.uid,
          otherUid: item.freelancerId,
          otherName: item.freelancerName,
          otherImage: item.freelancerImage,
          initialMessage: `Your application for ${item.jobTitle} accepted!`,
        },
      });
    } catch (error) {
      console.error("Error accepting notification:", error);
    }
  }

  async function declineNotif(item) {
    try {
      await deleteDoc(doc(db, "notifications", item.id));
    } catch (error) {
      console.error("Error declining notification:", error);
    }
  }

  const incrementViewOnce = async (collectionName, jobId) => {
    try {
      const ref = doc(db, collectionName, jobId);

      await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists()) return;

        const viewedBy = snap.data().viewedBy || [];
        if (viewedBy.includes(user.uid)) return;

        tx.update(ref, {
          views: (snap.data().views || 0) + 1,
          viewedBy: arrayUnion(user.uid),
        });
      });
    } catch (error) {
      console.error("Error incrementing view:", error);
    }
  };

  const applyFilter = (jobs) => {
    return jobs
      .filter((j) => {
        const title = (j.title || "").toLowerCase();
        const category = (j.category || "").toLowerCase();
        const skills = j.skills || [];

        if (search) {
          const q = search.toLowerCase();
          if (
            !title.includes(q) &&
            !category.includes(q) &&
            !skills.some((s) => s.toLowerCase().includes(q))
          )
            return false;
        }

        if (filter.categories.length && !filter.categories.includes(j.category))
          return false;

        if (
          filter.skills.length &&
          !skills.some((s) => filter.skills.includes(s))
        )
          return false;

        const from = Number(j.budget_from ?? j.budget ?? 0);
        const to = Number(j.budget_to ?? j.budget ?? from);

        if (filter.minPrice !== null && to < filter.minPrice) return false;
        if (filter.maxPrice !== null && from > filter.maxPrice) return false;

        if (filter.deliveryTime) {
          const createdDate = getJobDate(j.createdAt || j.postedAt);

          if (!createdDate) return true;

          const now = new Date();
          const diffDays =
            (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);

          if (filter.deliveryTime === "today") {
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);
            return createdDate >= startOfToday;
          }

          if (filter.deliveryTime === "3d") return diffDays <= 3;
          if (filter.deliveryTime === "7d") return diffDays <= 7;
          if (filter.deliveryTime === "30d") return diffDays <= 30;
        }

        return true;
      })
      .sort((a, b) => {
        if (sort === "Newest")
          return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
        if (sort === "Oldest")
          return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0);
        return 0;
      });
  };

  const jobs = useMemo(() => {
    if (tab === "Work") return applyFilter(services);
    if (tab === "24 hour") return applyFilter(services24);
    return [...services, ...services24].filter((j) => savedIds.includes(j.id));
  }, [tab, services, services24, savedIds, search, filter, sort]);

  const toggleSave = async (jobId, isSaved) => {
    try {
      await updateDoc(doc(db, "users", user.uid), {
        savedJobs: isSaved ? arrayRemove(jobId) : arrayUnion(jobId),
      });
    } catch (error) {
      console.error("Error toggling save:", error);
    }
  };

  return (
    <div
      style={{
        padding: isMobile ? "16px" : 210,
        marginTop: isMobile ? "0px" : "-160px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          onClick={() => navigate(-1)}
          style={{
            width: 36,
            height: 36,
            borderRadius: 14,
            border: "0.8px solid #E0E0E0",
            backgroundColor: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
            flexShrink: 0,
          }}
        >
          <img
            src={backarrow}
            alt="Back"
            style={{
              width: 16,
              height: 18,
              objectFit: "contain",
            }}
          />
        </div>

        <div>
          <div style={{ fontSize: 32, fontWeight: 400 }}>
            Explore Freelancer
          </div>
        </div>
      </div>

      <div
        id="fh-header-right"
        className="fh-header-right"
        style={{
          marginTop: "1px",
          marginRight: isMobile ? "0px" : "190px",
        }}
      >
        <img
          onClick={() => navigate("/client-dashbroad2/messages")}
          style={{ width: "26px", cursor: "pointer" }}
          src={message}
          alt="message"
        />

        <div
          className="ibtan"
          onClick={() => setNotifOpen(true)}
          style={{ cursor: "pointer" }}
        >
          <img src={notifiaction} alt="notification" />
          {pending > 0 && (
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "red",
                position: "absolute",
                top: 6,
                right: 5,
              }}
            />
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          width: "100%",
        }}
      >
        {/* LEFT – SEARCH */}
        <div
          style={{
            display: "flex",
            marginTop: "34px",
            alignItems: "center",
            gap: "8px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            width: "100%",
            height: "44px",
          }}
        >
          <img
            src={search1}
            alt="search"
            style={{
              width: 18,
              height: 18,
              opacity: 0.6,
              marginLeft: "13px",
            }}
          />

          <input
            id="job-search"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "14px",
              marginLeft: "0px",
              height: "19px",
              lineHeight: "21px",
              padding: "0",
              marginTop: "12px",
            }}
          />
        </div>
      </div>

      {showSort && (
        <div
          ref={sortRef}
          id="sort-wrapper"
          style={{
            position: "absolute",
            marginLeft: isMobile ? "0px" : "470px",
            marginTop: isMobile ? "70px" : "130px",
            background: "#fff",
            borderRadius: "30px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
            padding: "16px",
            zIndex: 1000,
            width: isMobile ? "90%" : "360px",
            left: isMobile ? "5%" : "auto",
          }}
        >
          {["Newest", "Oldest", "Availability"].map((s, i) => (
            <button
              key={s}
              onClick={() => {
                setSort(s);
                setShowSort(false);
              }}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "12px 14px",
                marginBottom: "10px",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: 500,
                background: sort === s ? "#7C3CFF" : "#f9f9f9",
                color: sort === s ? "#fff" : "#333",
                opacity: showSort ? 1 : 0,
                transform: showSort ? "translateY(0px)" : "translateY(10px)",
                transition: "all 0.35s ease",
                transitionDelay: `${i * 0.12}s`,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: "18px",
          boxShadow: "0 10px 22px rgba(0,0,0,0.12)",
          marginTop: "30px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          {["Work", "24 Hours", "Saved"].map((t) => {
            const isActive = tab === t;

            return (
              <span
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "7px 28px",
                  borderRadius: "999px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#FFFFFF" : "#333",
                  background: isActive ? "#7C3CFF" : "transparent",
                  boxShadow: isActive ? "0 4px 10px rgba(0,0,0,0.15)" : "none",
                  transition: "all 0.25s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {t}
              </span>
            );
          })}
        </div>
      </div>

      {notifOpen && (
        <div
          onClick={() => setNotifOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.25)",
            backdropFilter: "blur(2px)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* POPUP CARD */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "92%",
              maxWidth: 420,
              background: "#fff",
              borderRadius: 20,
              padding: 18,
              boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
            }}
          >
            {/* TITLE */}
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 14,
              }}
            >
              Notifications
            </div>

            {/* EMPTY */}
            {notifications.length === 0 && (
              <div
                style={{
                  padding: 30,
                  textAlign: "center",
                  color: "#777",
                }}
              >
                No notifications
              </div>
            )}

            {/* LIST */}
            {notifications.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#f7f7f7",
                  padding: 12,
                  borderRadius: 14,
                  marginBottom: 12,
                }}
              >
                <img
                  src={
                    item.freelancerImage ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  }
                  alt="freelancer"
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{item.freelancerName}</div>
                  <div style={{ fontSize: 13, color: "#555" }}>
                    applied for {item.jobTitle}
                  </div>
                </div>

                {!item.read ? (
                  <>
                    <button
                      onClick={() => acceptNotif(item)}
                      style={{
                        background: "#000",
                        color: "#fff",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: 8,
                        cursor: "pointer",
                      }}
                    >
                      Chat
                    </button>

                    <button
                      onClick={() => declineNotif(item)}
                      style={{
                        background: "transparent",
                        border: "1px solid #ccc",
                        padding: "6px 10px",
                        borderRadius: 8,
                        cursor: "pointer",
                      }}
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => acceptNotif(item)}
                    style={{
                      background: "#000",
                      color: "#fff",
                      border: "none",
                      padding: "6px 14px",
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                  >
                    Chat
                  </button>
                )}
              </div>
            ))}

            {/* CLOSE */}
            <button
              onClick={() => setNotifOpen(false)}
              style={{
                marginTop: 6,
                width: "100%",
                padding: 12,
                borderRadius: 12,
                border: "none",
                background: "#000",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* FILTER + SORT BAR */}
      <div
        style={{
          display: "flex",
          justifyContent: isMobile ? "space-between" : "flex-end",
          width: "100%",
          padding: "10px 14px",
          marginTop: "15px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {/* LEFT – FILTER */}
        <div
          onClick={() => setShowFilter(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          <img src={filter1} alt="Filter" style={{ width: 18, height: 18 }} />
          <span>Filter</span>
        </div>

        {/* RIGHT – SORT */}
        <div
          onClick={() => setShowSort(!showSort)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          <img src={sortimg} alt="Sort" style={{ width: 18, height: 18 }} />
          <span>Sort</span>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        {jobs.length === 0 && <p>No jobs found</p>}

        {jobs.map((job) => {
          const isSaved = savedIds.includes(job.id);
          return (
            <div
              key={job.id}
              onClick={() => {
                incrementViewOnce(
                  tab === "24 hour" ? "service_24h" : "services",
                  job.id
                );
                navigate(`/client-dashbroad2/service/${job.id}`);
              }}
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: "22px",
                marginBottom: 22,
                cursor: "pointer",
                boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <h3 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>
                  {job.title}
                </h3>

                <div id="job-budget" className="job-budget">
                  ₹{job.budget_from || job.budget} - {job.budget_to || job.budget}
                </div>
              </div>
              <div
                style={{
                  fontSize: "14",
                  marginTop: "10px",
                  color: "gray",
                  fontWeight: "400",
                }}
              >
                Skills Required
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  margin: "12px 0",
                  flexWrap: "wrap",
                }}
              >
                {(job.skills || []).slice(0, 3).map((s) => (
                  <span
                    key={s}
                    style={{
                      background: "#FFF085B2",
                      padding: isMobile ? "4px 10px" : "6px 14px",
                      borderRadius: 999,
                      fontSize: isMobile ? 11 : 13,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s}
                  </span>
                ))}

                {job.skills?.length > 3 && (
                  <span
                    style={{
                      background: "#FFF085B2",
                      padding: isMobile ? "4px 10px" : "6px 14px",
                      borderRadius: 999,
                      fontSize: isMobile ? 11 : 13,
                      fontWeight: 500,
                    }}
                  >
                    +{job.skills.length - 3}
                  </span>
                )}
              </div>

              <p
                style={{
                  fontSize: 14,
                  color: "#555",
                  lineHeight: 1.6,
                  marginBottom: 14,
                }}
              >
                {job.description?.slice(0, 320)}
                {job.description?.length > 200 ? "..." : ""}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 18,
                    fontSize: 13,
                    color: "#777",
                  }}
                >
                  <span
                    style={{ display: "flex", gap: 6, alignItems: "center" }}
                  >
                    <FiEye /> {job.views || 0} Impression
                  </span>
                  <span
                    style={{ display: "flex", gap: 6, alignItems: "center" }}
                  >
                    <Clock size={14} />
                    {timeAgo(job.createdAt)}
                  </span>
                </div>

                <div
                  style={{
                    position: "absolute",
                    top: 60,
                    right: 20,
                    cursor: "pointer",
                    zIndex: 10,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSave(job.id, savedIds.includes(job.id));
                  }}
                >
                  {savedIds.includes(job.id) ? (
                    <BsBookmarkFill size={20} />
                  ) : (
                    <Bookmark size={20} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showFilter && (
        <div style={modalStyle}>
          <FilterScreen
            initialFilter={filter}
            onClose={() => setShowFilter(false)}
            onApply={(appliedFilter) => {
              setFilter(appliedFilter);
              setShowFilter(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

const modalStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.35)",
  zIndex: 999,
  overflowY: "auto",
};