// import React, { useEffect, useState } from "react";
// import {
//   collection,
//   doc,
//   getDoc,
//   onSnapshot,
//   updateDoc
// } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { Link, useNavigate } from "react-router-dom";
// import { db } from "../../../firbase/Firebase";

// import {
//   FiBell,
//   FiMessageSquare,
//   FiUser,
//   FiArrowLeft,
//   FiBookmark,
//   FiPlus,
//   FiEye,
//   FiClock
// } from "react-icons/fi";




// export default function FreelanceHome() {
//   const auth = getAuth();
//   const user = auth.currentUser;
//   const navigate = useNavigate();

//   const [jobs, setJobs] = useState([]);
//   const [savedJobs, setSavedJobs] = useState([]);

//   const [searchText, setSearchText] = useState("");
//   const [suggestions, setSuggestions] = useState([]);

//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [currentUserCategory, setCurrentUserCategory] = useState("");
//   const [userProfile, setUserProfile] = useState(null);

//   const [jobTab, setJobTab] = useState("24h");


//   const fetchUserProfile = async (uid) => {
//     try {
//       const snap = await getDoc(doc(db, "users", uid));
//       if (snap.exists()) {
//         setUserProfile(snap.data());
//       } else {
//         console.log("User profile not found");
//       }
//     } catch (e) {
//       console.error("Profile fetch error:", e);
//     }
//   };

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (!user) return;
//     fetchUserProfile(user.uid);
//   }, []);




//   /* ---------------------------------------------------
//         LOAD USER CATEGORY
//   --------------------------------------------------- */
//   useEffect(() => {
//     if (!user) return;

//     const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
//       setCurrentUserCategory(snap.data()?.category || "");
//     });

//     return unsub;
//   }, [user]);

//   /* ---------------------------------------------------
//         LOAD ALL CATEGORIES FROM USERS
//   --------------------------------------------------- */
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

//   /* ---------------------------------------------------
//          LOAD JOBS FROM BOTH COLLECTIONS  
//          services + service_24h
//   --------------------------------------------------- */
//   useEffect(() => {
//     const unsub1 = onSnapshot(collection(db, "services"), (snap) => {
//       const normalJobs = snap.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//         jobtype: "services",
//       }));

//       setJobs((prev) => {
//         const only24h = prev.filter((j) => j.jobtype === "service_24h");
//         return [...only24h, ...normalJobs];
//       });
//     });

//     const unsub2 = onSnapshot(collection(db, "service_24h"), (snap) => {
//       const fastJobs = snap.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
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

//   /* ---------------------------------------------------
//         LOAD SAVED JOBS
//   --------------------------------------------------- */
//   useEffect(() => {
//     if (!user) return;

//     const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
//       setSavedJobs(snap.data()?.favoriteJobs || []);
//     });

//     return unsub;
//   }, [user]);

//   /* ---------------------------------------------------
//          SAVE / UNSAVE JOB
//   --------------------------------------------------- */
//   async function toggleSave(jobId) {
//     if (!user) return;

//     const ref = doc(db, "users", user.uid);
//     const updated = savedJobs.includes(jobId)
//       ? savedJobs.filter((id) => id !== jobId)
//       : [...savedJobs, jobId];

//     setSavedJobs(updated);
//     await updateDoc(ref, { favoriteJobs: updated });
//   }

//   /* ---------------------------------------------------
//          SEARCH SUGGESTIONS
//   --------------------------------------------------- */
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

//   /* ---------------------------------------------------
//          FILTER JOBS
//   --------------------------------------------------- */
//   const filteredJobs = jobs.filter((job) => {
//     const matchTab =
//       jobTab === "24h"
//         ? job.jobtype === "service_24h"
//         : jobTab === "full"
//           ? job.jobtype === "services"
//           : savedJobs.includes(job.id);

//     const matchSearch =
//       job.title?.toLowerCase().includes(searchText.toLowerCase()) ||
//       job.description?.toLowerCase().includes(searchText.toLowerCase());

//     const matchCategory =
//       selectedCategory === "" ||
//         selectedCategory === "No Category Assigned"
//         ? true
//         : job.category === selectedCategory;

//     return matchTab && matchSearch && matchCategory;
//   });

//   /* ---------------------------------------------------
//          OPEN JOB DETAILS
//   --------------------------------------------------- */
//   function onViewJob(job) {
//     if (job.jobtype === "service_24h") {
//       navigate(`/client-dashbroad2/service-24h/${job.id}`);
//     } else {
//       navigate(`/client-dashbroad2/service/${job.id}`);
//     }
//   }

//   /* ---------------------------------------------------
//          PAGE UI
//   --------------------------------------------------- */
//   return (
//     <div className="freelance-wrapper">
//       {/* HEADER */}
//       <div className="topbar">
//         <div className="top-left">
//           <div className="back-btn" onClick={() => navigate(-1)}>
//             <FiArrowLeft size={20} />
//           </div>
//           <h2 className="page-title">Browse Services</h2>
//         </div>

//         <div className="top-right">
//           <FiMessageSquare className="top-icon" />
//           <FiBell className="top-icon" />

//           <div className="fh-avatar">
//             <Link to={"/client-dashbroad2/ClientProfile"}>
//               <img
//                 src={
//                   userProfile?.profileImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
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
//           placeholder="Search services..."
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
//       {categories.length > 0 ? (
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
//       )}

//       {/* Tabs */}
//       <div className="jobtabs-wrapper">
//         <button
//           className={`jobtab ${jobTab === "full" ? "active-tab" : ""}`}
//           onClick={() => setJobTab("full")}
//         >
//           Works
//         </button>
//         <button
//           className={`jobtab ${jobTab === "24h" ? "active-tab" : ""}`}
//           onClick={() => setJobTab("24h")}
//         >
//           24H Jobs
//         </button>
//         <button
//           className={`jobtab ${jobTab === "saved" ? "active-tab" : ""}`}
//           onClick={() => setJobTab("saved")}
//         >
//           Saved
//         </button>
//       </div>

//       {/* Job List */}
//       <div className="job-list">
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

//       {/* ================= CSS ================= */}
//       <style>{`
//         * { font-family: 'Poppins', sans-serif; }
//         .freelance-wrapper { padding: 20px 22px; }

//         .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
//         .top-left { display: flex; align-items: center; gap: 12px; }
//         .back-btn { width: 44px; height: 44px; background: #efe9ff; border-radius: 14px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
//         .page-title { font-size: 21px; font-weight: 700; }
//         .top-right { display: flex; gap: 16px; }
//         .top-icon { font-size: 20px; cursor: pointer; }

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
//         }
//         .jobtab {
//           padding: 10px 14px; border-radius: 10px;
//           font-weight: 700; cursor: pointer; opacity: .6; width: 100px; border: none;
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
//         .job-desc { font-size: 14px; opacity: .85; margin: 0; }

//         .bookmark-icon { font-size: 20px; cursor: pointer; color: #777; }
//         .bookmarked { color: #7c3aed !important; }

//         .job-info-row {
//           display: flex; justify-content: space-between; align-items: center; margin-top: 6px;
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


// import React, { useEffect, useState } from "react";
// import {
//   collection,
//   doc,
//   getDoc,
//   onSnapshot,
//   updateDoc,
//   deleteDoc
// } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { Link, useNavigate } from "react-router-dom";
// import { db } from "../../../firbase/Firebase";

// import {
//   FiBell,
//   FiMessageSquare,
//   FiUser,
//   FiArrowLeft,
//   FiBookmark,
//   FiPlus,
//   FiEye,
//   FiClock
// } from "react-icons/fi";

// export default function FreelanceHome() {
//   const auth = getAuth();
//   const user = auth.currentUser;
//   const navigate = useNavigate();

//   const [jobs, setJobs] = useState([]);
//   const [savedJobs, setSavedJobs] = useState([]);

//   const [searchText, setSearchText] = useState("");
//   const [suggestions, setSuggestions] = useState([]);

//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [currentUserCategory, setCurrentUserCategory] = useState("");
//   const [userProfile, setUserProfile] = useState(null);

//   const [jobTab, setJobTab] = useState("24h");

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
//     const user = auth.currentUser;
//     if (!user) return;
//     fetchUserProfile(user.uid);
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
//       const normalJobs = snap.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//         jobtype: "services",
//       }));

//       setJobs((prev) => {
//         const only24h = prev.filter((j) => j.jobtype === "service_24h");
//         return [...only24h, ...normalJobs];
//       });
//     });

//     const unsub2 = onSnapshot(collection(db, "service_24h"), (snap) => {
//       const fastJobs = snap.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
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
//         FILTER JOBS
//   ===================================================== */
//   const filteredJobs = jobs.filter((job) => {
//     const matchTab =
//       jobTab === "24h"
//         ? job.jobtype === "service_24h"
//         : jobTab === "full"
//         ? job.jobtype === "services"
//         : savedJobs.includes(job.id);

//     const matchSearch =
//       job.title?.toLowerCase().includes(searchText.toLowerCase()) ||
//       job.description?.toLowerCase().includes(searchText.toLowerCase());

//     const matchCategory =
//       selectedCategory === "" ||
//       selectedCategory === "No Category Assigned"
//         ? true
//         : job.category === selectedCategory;

//     return matchTab && matchSearch && matchCategory;
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
//         PAGE UI
//   ===================================================== */
//   return (
//     <div className="freelance-wrapper">
//       {/* HEADER */}
//       <div className="topbar">
//         <div className="top-left">
//           <div className="back-btn" onClick={() => navigate(-1)}>
//             <FiArrowLeft size={20} />
//           </div>
//           <h2 className="page-title">Browse Services</h2>
//         </div>

//         <div className="top-right">
//           <FiMessageSquare className="top-icon" onClick={()=>{navigate("/client-dashbroad2/messages")}} />

//           {/* 🟣 NOTIFICATION BUTTON */}
//           <div style={{ position: "relative" }} onClick={() => setNotifOpen(true)}>
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
//           placeholder="Search services..."
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
//       {categories.length > 0 ? (
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
//       )}

//       {/* Tabs */}
//       <div className="jobtabs-wrapper">
//         <button
//           className={`jobtab ${jobTab === "full" ? "active-tab" : ""}`}
//           onClick={() => setJobTab("full")}
//         >
//           Works
//         </button>
//         <button
//           className={`jobtab ${jobTab === "24h" ? "active-tab" : ""}`}
//           onClick={() => setJobTab("24h")}
//         >
//           24H Jobs
//         </button>
//         <button
//           className={`jobtab ${jobTab === "saved" ? "active-tab" : ""}`}
//           onClick={() => setJobTab("saved")}
//         >
//           Saved
//         </button>
//       </div>

//       {/* Job List */}
//       <div className="job-list">
//         {filteredJobs.map((job) => (
//           <div
//             key={job.id}
//             className="job-card"
//             onClick={() => onViewJob(job)}
//           >
//             <div className="job-top">
//               <h3 className="job-title">{job.title}</h3>
//               <FiBookmark
//                 className={`bookmark-icon ${
//                   savedJobs.includes(job.id) ? "bookmarked" : ""
//                 }`}
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
//         .freelance-wrapper { padding: 20px 22px; }

//         .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
//         .top-left { display: flex; align-items: center; gap: 12px; }
//         .back-btn { width: 44px; height: 44px; background: #efe9ff; border-radius: 14px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
//         .page-title { font-size: 21px; font-weight: 700; }
//         .top-right { display: flex; gap: 16px; }
//         .top-icon { font-size: 20px; cursor: pointer; }

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
//         }
//         .jobtab {
//           padding: 10px 14px; border-radius: 10px;
//           font-weight: 700; cursor: pointer; opacity: .6; width: 100px; border: none;
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
//         .job-desc { font-size: 14px; opacity: .85; margin: 0; }

//         .bookmark-icon { font-size: 20px; cursor: pointer; color: #777; }
//         .bookmarked { color: #7c3aed !important; }

//         .job-info-row {
//           display: flex; justify-content: space-between; align-items: center; margin-top: 6px;
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


// import React, { useEffect, useState } from "react";
// import {
//   collection,
//   doc,
//   getDoc,
//   onSnapshot,
//   updateDoc,
//   deleteDoc
// } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { Link, useNavigate } from "react-router-dom";
// import { db } from "../../../firbase/Firebase";

// import {
//   FiBell,
//   FiMessageSquare,
//   FiUser,
//   FiArrowLeft,
//   FiBookmark,
//   FiPlus,
//   FiEye,
//   FiClock
// } from "react-icons/fi";

// export default function FreelanceHome() {
//   const auth = getAuth();
//   const user = auth.currentUser;
//   const navigate = useNavigate();

//   /* ============================================================
//         ⭐ 1️⃣ Sidebar Collapsed State
//   ============================================================ */
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   /* ============================================================
//         ⭐ 2️⃣ Sidebar Toggle Listener
//   ============================================================ */
//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);

//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   /* ============================================================
//         ORIGINAL STATES (UNTOUCHED)
//   ============================================================ */
//   const [jobs, setJobs] = useState([]);
//   const [savedJobs, setSavedJobs] = useState([]);

//   const [searchText, setSearchText] = useState("");
//   const [suggestions, setSuggestions] = useState([]);

//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [currentUserCategory, setCurrentUserCategory] = useState("");
//   const [userProfile, setUserProfile] = useState(null);

//   const [jobTab, setJobTab] = useState("24h");

//   /* =====================================================
//         FETCH USER PROFILE
//   ===================================================== */
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

//   /* =====================================================
//         NOTIFICATIONS
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
//         CATEGORY LIST
//   ===================================================== */
//   useEffect(() => {
//     if (!user) return;
//     return onSnapshot(doc(db, "users", user.uid), (snap) => {
//       setCurrentUserCategory(snap.data()?.category || "");
//     });
//   }, [user]);

//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "users"), (snap) => {
//       const allCats = snap.docs
//         .map((d) => d.data().category)
//         .filter((cat) => cat && cat.trim() !== "");

//       const finalCats = [...new Set(allCats)].map((name, i) => ({
//         id: i + 1,
//         name
//       }));

//       setCategories(finalCats);
//     });

//     return unsub;
//   }, []);

//   /* =====================================================
//         JOBS FETCH
//   ===================================================== */
//   useEffect(() => {
//     const unsub1 = onSnapshot(collection(db, "services"), (snap) => {
//       const normal = snap.docs.map((d) => ({
//         id: d.id,
//         ...d.data(),
//         jobtype: "services"
//       }));

//       setJobs((prev) => {
//         const only24h = prev.filter((j) => j.jobtype === "service_24h");
//         return [...only24h, ...normal];
//       });
//     });

//     const unsub2 = onSnapshot(collection(db, "service_24h"), (snap) => {
//       const fast = snap.docs.map((d) => ({
//         id: d.id,
//         ...d.data(),
//         jobtype: "service_24h"
//       }));

//       setJobs((prev) => {
//         const onlyNormal = prev.filter((j) => j.jobtype === "services");
//         return [...onlyNormal, ...fast];
//       });
//     });

//     return () => {
//       unsub1();
//       unsub2();
//     };
//   }, []);

//   /* =====================================================
//         SAVED JOBS
//   ===================================================== */
//   useEffect(() => {
//     if (!user) return;

//     return onSnapshot(doc(db, "users", user.uid), (snap) => {
//       setSavedJobs(snap.data()?.favoriteJobs || []);
//     });
//   }, [user]);

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
//         SEARCH / FILTER
//   ===================================================== */
//   function updateSuggestions(text) {
//     const q = text.toLowerCase();
//     const s = new Set();

//     jobs.forEach((job) => {
//       if (job.title?.toLowerCase().includes(q)) s.add(job.title);
//       if (job.skills)
//         job.skills.forEach((sk) => {
//           if (sk.toLowerCase().includes(q)) s.add(sk);
//         });
//     });

//     setSuggestions([...s].slice(0, 6));
//   }

//   useEffect(() => {
//     if (!searchText.trim()) return setSuggestions([]);
//     updateSuggestions(searchText);
//   }, [searchText]);

//   const filteredJobs = jobs.filter((job) => {
//     const matchTab =
//       jobTab === "24h"
//         ? job.jobtype === "service_24h"
//         : jobTab === "full"
//         ? job.jobtype === "services"
//         : savedJobs.includes(job.id);

//     const matchSearch =
//       job.title?.toLowerCase().includes(searchText.toLowerCase()) ||
//       job.description?.toLowerCase().includes(searchText.toLowerCase());

//     const matchCategory =
//       selectedCategory === "" ||
//       selectedCategory === "No Category Assigned"
//         ? true
//         : job.category === selectedCategory;

//     return matchTab && matchSearch && matchCategory;
//   });

//   /* =====================================================
//         OPEN JOB
//   ===================================================== */
//   function onViewJob(job) {
//     if (job.jobtype === "service_24h") {
//       navigate(`/client-dashbroad2/service-24h/${job.id}`);
//     } else {
//       navigate(`/client-dashbroad2/service/${job.id}`);
//     }
//   }

//   /* =====================================================
//         ⭐ 3️⃣ WRAP PAGE WITH COLLAPSED MARGIN
//   ===================================================== */
//   return (
//     <div
//       className="freelance-wrapper"
//       style={{
//         marginLeft: collapsed ? "-110px" : "50px",
//         transition: "margin-left 0.25s ease"
//       }}
//     >
//       {/* ------------------ HEADER ------------------ */}
//       <div className="topbar">
//         <div className="top-left">
//           <div className="back-btn" onClick={() => navigate(-1)}>
//             <FiArrowLeft size={20} />
//           </div>
//           <h2 className="page-title">Browse Services</h2>
//         </div>

//         <div className="top-right">
//           <FiMessageSquare
//             className="top-icon"
//             onClick={() => navigate("/client-dashbroad2/messages")}
//           />

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
//                   padding: "2px 6px"
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

//       {/* ------------------ SEARCH ------------------ */}
//       <div style={{ position: "relative" }}>
//         <input
//           type="text"
//           className="search-input"
//           placeholder="Search services..."
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

//       {/* ------------------ CATEGORIES ------------------ */}
//       {categories.length > 0 ? (
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
//           No categories found.
//         </div>
//       )}

//       {/* ------------------ TABS ------------------ */}
//       <div className="jobtabs-wrapper">
//         <button
//           className={`jobtab ${jobTab === "full" ? "active-tab" : ""}`}
//           onClick={() => setJobTab("full")}
//         >
//           Works
//         </button>
//         <button
//           className={`jobtab ${jobTab === "24h" ? "active-tab" : ""}`}
//           onClick={() => setJobTab("24h")}
//         >
//           24H Jobs
//         </button>
//         <button
//           className={`jobtab ${jobTab === "saved" ? "active-tab" : ""}`}
//           onClick={() => setJobTab("saved")}
//         >
//           Saved
//         </button>
//       </div>

//       {/* ------------------ JOB LIST ------------------ */}
//       <div className="job-list">
//         {filteredJobs.map((job) => (
//           <div
//             key={job.id}
//             className="job-card"
//             onClick={() => onViewJob(job)}
//           >
//             <div className="job-top">
//               <h3 className="job-title">{job.title}</h3>
//               <FiBookmark
//                 className={`bookmark-icon ${
//                   savedJobs.includes(job.id) ? "bookmarked" : ""
//                 }`}
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

//       {/* ------------------ ADD BUTTON ------------------ */}
//       <button
//         className="floating-plus"
//         onClick={() => navigate("/client-dashbroad2/PostJob")}
//       >
//         <FiPlus size={22} />
//       </button>

//       {/* ------------------ NOTIFICATIONS POPUP ------------------ */}
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
//             zIndex: 9999
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
//               overflowY: "auto"
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
//                   borderRadius: 10
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
//                 color: "#fff"
//               }}
//               onClick={() => setNotifOpen(false)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ------------------ CSS ------------------ */}
//       <style>{`
//         * { font-family: 'Poppins', sans-serif; }
//         .freelance-wrapper { padding: 20px 22px; }

//         .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
//         .top-left { display: flex; align-items: center; gap: 12px; }
//         .back-btn { width: 44px; height: 44px; background: #efe9ff; border-radius: 14px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
//         .page-title { font-size: 21px; font-weight: 700; }
//         .top-right { display: flex; gap: 16px; }
//         .top-icon { font-size: 20px; cursor: pointer; }

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
//         }
//         .jobtab {
//           padding: 10px 14px; border-radius: 10px;
//           font-weight: 700; cursor: pointer; opacity: .6; width: 100px; border: none;
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
//         .job-desc { font-size: 14px; opacity: .85; margin: 0; }

//         .bookmark-icon { font-size: 20px; cursor: pointer; color: #777; }
//         .bookmarked { color: #7c3aed !important; }

//         .job-info-row {
//           display: flex; justify-content: space-between; align-items: center; margin-top: 6px;
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






// import React, { useEffect, useState } from "react";
// import {
//   collection,
//   doc,
//   getDoc,
//   onSnapshot,
//   updateDoc,
//   deleteDoc
// } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { Link, useNavigate } from "react-router-dom";
// import { db } from "../../../firbase/Firebase";

// import {
//   FiBell,
//   FiMessageSquare,
//   FiUser,
//   FiArrowLeft,
//   FiBookmark,
//   FiPlus,
//   FiEye,
//   FiClock
// } from "react-icons/fi";

// export default function FreelanceHome() {
//   const auth = getAuth();
//   const user = auth.currentUser;
//   const navigate = useNavigate();

//   const [jobs, setJobs] = useState([]);
//   const [savedJobs, setSavedJobs] = useState([]);

//   const [searchText, setSearchText] = useState("");
//   const [suggestions, setSuggestions] = useState([]);

//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [currentUserCategory, setCurrentUserCategory] = useState("");
//   const [userProfile, setUserProfile] = useState(null);

//   const [jobTab, setJobTab] = useState("24h");

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
//     const user = auth.currentUser;
//     if (!user) return;
//     fetchUserProfile(user.uid);
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
//       const normalJobs = snap.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//         jobtype: "services",
//       }));

//       setJobs((prev) => {
//         const only24h = prev.filter((j) => j.jobtype === "service_24h");
//         return [...only24h, ...normalJobs];
//       });
//     });

//     const unsub2 = onSnapshot(collection(db, "service_24h"), (snap) => {
//       const fastJobs = snap.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
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
//         FILTER JOBS
//   ===================================================== */
//   const filteredJobs = jobs.filter((job) => {
//     const matchTab =
//       jobTab === "24h"
//         ? job.jobtype === "service_24h"
//         : jobTab === "full"
//         ? job.jobtype === "services"
//         : savedJobs.includes(job.id);

//     const matchSearch =
//       job.title?.toLowerCase().includes(searchText.toLowerCase()) ||
//       job.description?.toLowerCase().includes(searchText.toLowerCase());

//     const matchCategory =
//       selectedCategory === "" ||
//       selectedCategory === "No Category Assigned"
//         ? true
//         : job.category === selectedCategory;

//     return matchTab && matchSearch && matchCategory;
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
//         PAGE UI
//   ===================================================== */
//   return (
//     <div className="freelance-wrapper">
//       {/* HEADER */}
//       <div className="topbar">
//         <div className="top-left">
//           <div className="back-btn" onClick={() => navigate(-1)}>
//             <FiArrowLeft size={20} />
//           </div>
//           <h2 className="page-title">Browse Services</h2>
//         </div>

//         <div className="top-right">
//           <FiMessageSquare className="top-icon" onClick={()=>{navigate("/client-dashbroad2/messages")}} />

//           {/* 🟣 NOTIFICATION BUTTON */}
//           <div style={{ position: "relative" }} onClick={() => setNotifOpen(true)}>
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
//           placeholder="Search services..."
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
//       {categories.length > 0 ? (
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
//       )}

//       {/* Tabs */}
//       <div className="jobtabs-wrapper">
//         <button
//           className={`jobtab ${jobTab === "full" ? "active-tab" : ""}`}
//           onClick={() => setJobTab("full")}
//         >
//           Works
//         </button>
//         <button
//           className={`jobtab ${jobTab === "24h" ? "active-tab" : ""}`}
//           onClick={() => setJobTab("24h")}
//         >
//           24H Jobs
//         </button>
//         <button
//           className={`jobtab ${jobTab === "saved" ? "active-tab" : ""}`}
//           onClick={() => setJobTab("saved")}
//         >
//           Saved
//         </button>
//       </div>

//       {/* Job List */}
//       <div className="job-list">
//         {filteredJobs.map((job) => (
//           <div
//             key={job.id}
//             className="job-card"
//             onClick={() => onViewJob(job)}
//           >
//             <div className="job-top">
//               <h3 className="job-title">{job.title}</h3>
//               <FiBookmark
//                 className={`bookmark-icon ${
//                   savedJobs.includes(job.id) ? "bookmarked" : ""
//                 }`}
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
//         .freelance-wrapper { padding: 20px 22px; }

//         .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
//         .top-left { display: flex; align-items: center; gap: 12px; }
//         .back-btn { width: 44px; height: 44px; background: #efe9ff; border-radius: 14px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
//         .page-title { font-size: 21px; font-weight: 700; }
//         .top-right { display: flex; gap: 16px; }
//         .top-icon { font-size: 20px; cursor: pointer; }

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
//         }
//         .jobtab {
//           padding: 10px 14px; border-radius: 10px;
//           font-weight: 700; cursor: pointer; opacity: .6; width: 100px; border: none;
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
//         .job-desc { font-size: 14px; opacity: .85; margin: 0; }

//         .bookmark-icon { font-size: 20px; cursor: pointer; color: #777; }
//         .bookmarked { color: #7c3aed !important; }

//         .job-info-row {
//           display: flex; justify-content: space-between; align-items: center; margin-top: 6px;
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



import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../../../firbase/Firebase";

import {
  FiBell,
  FiMessageSquare,
  FiUser,
  FiArrowLeft,
  FiBookmark,
  FiPlus,
  FiEye,
  FiClock
} from "react-icons/fi";

export default function FreelanceHome() {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  // -------------------------
  // Sidebar collapsed state
  // -------------------------
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  // Persist collapsed to localStorage when it changes (keeps behavior consistent)
  useEffect(() => {
    try {
      localStorage.setItem("sidebar-collapsed", collapsed ? "true" : "false");
    } catch (e) {
      // ignore storage errors
    }
  }, [collapsed]);

  // Listen for sidebar toggle events
  useEffect(() => {
    function handleToggle(e) {
      // event.detail should be boolean collapsed state
      setCollapsed(e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  // -------------------------
  // existing state
  // -------------------------
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentUserCategory, setCurrentUserCategory] = useState("");
  const [userProfile, setUserProfile] = useState(null);

  const [jobTab, setJobTab] = useState("24h");

  /* =====================================================
        FETCH USER PROFILE
  ===================================================== */
  const fetchUserProfile = async (uid) => {
    try {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        setUserProfile(snap.data());
      }
    } catch (e) {
      console.error("Profile fetch error:", e);
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    fetchUserProfile(user.uid);
  }, []);

  /* =====================================================
        NOTIFICATION STATE + BACKEND FETCH
  ===================================================== */
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(collection(db, "notifications"), (snap) => {
      const userNots = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((n) => n.clientUid === user.uid);

      setNotifications(userNots);
    });

    return unsub;
  }, [user]);

  const pending = notifications.filter((n) => !n.read).length;

  async function acceptNotif(item) {
    await updateDoc(doc(db, "notifications", item.id), { read: true });
  }

  async function declineNotif(item) {
    await deleteDoc(doc(db, "notifications", item.id));
  }

  /* =====================================================
        LOAD USER CATEGORY
  ===================================================== */
  useEffect(() => {
    if (!user) return;
    return onSnapshot(doc(db, "users", user.uid), (snap) => {
      setCurrentUserCategory(snap.data()?.category || "");
    });
  }, [user]);

  /* =====================================================
        LOAD USER LIST CATEGORIES
  ===================================================== */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      const allCats = snap.docs
        .map((d) => d.data().category)
        .filter((cat) => cat && cat.trim() !== "");

      const uniqueCats = [...new Set(allCats)];

      const finalCats = uniqueCats.map((name, index) => ({
        id: index + 1,
        name,
      }));

      setCategories(finalCats);
    });

    return unsub;
  }, []);

  /* =====================================================
        LOAD ALL JOBS (services + service_24h)
  ===================================================== */
  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, "services"), (snap) => {
      const normalJobs = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        jobtype: "services",
      }));

      setJobs((prev) => {
        const only24h = prev.filter((j) => j.jobtype === "service_24h");
        return [...only24h, ...normalJobs];
      });
    });

    const unsub2 = onSnapshot(collection(db, "service_24h"), (snap) => {
      const fastJobs = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        jobtype: "service_24h",
      }));

      setJobs((prev) => {
        const onlyNormal = prev.filter((j) => j.jobtype === "services");
        return [...onlyNormal, ...fastJobs];
      });
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  /* =====================================================
        LOAD SAVED JOBS
  ===================================================== */
  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      setSavedJobs(snap.data()?.favoriteJobs || []);
    });

    return unsub;
  }, [user]);

  /* =====================================================
        SAVE / UNSAVE JOB
  ===================================================== */
  async function toggleSave(jobId) {
    if (!user) return;

    const ref = doc(db, "users", user.uid);
    const updated = savedJobs.includes(jobId)
      ? savedJobs.filter((id) => id !== jobId)
      : [...savedJobs, jobId];

    setSavedJobs(updated);
    await updateDoc(ref, { favoriteJobs: updated });
  }

  /* =====================================================
        SEARCH AUTOSUGGEST
  ===================================================== */
  function updateSuggestions(text) {
    const q = text.toLowerCase();
    const s = new Set();

    jobs.forEach((job) => {
      if (job.title?.toLowerCase().includes(q)) s.add(job.title);
      if (job.skills) {
        job.skills.forEach((sk) => {
          if (sk.toLowerCase().includes(q)) s.add(sk);
        });
      }
    });

    setSuggestions([...s].slice(0, 6));
  }

  useEffect(() => {
    if (!searchText.trim()) {
      setSuggestions([]);
      return;
    }
    updateSuggestions(searchText);
  }, [searchText]);

  /* =====================================================
        FILTER JOBS
  ===================================================== */
  const filteredJobs = jobs.filter((job) => {
    const matchTab =
      jobTab === "24h"
        ? job.jobtype === "service_24h"
        : jobTab === "full"
        ? job.jobtype === "services"
        : savedJobs.includes(job.id);

    const matchSearch =
      job.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchText.toLowerCase());

    const matchCategory =
      selectedCategory === "" ||
      selectedCategory === "No Category Assigned"
        ? true
        : job.category === selectedCategory;

    return matchTab && matchSearch && matchCategory;
  });

  /* =====================================================
        OPEN JOB DETAILS
  ===================================================== */
  function onViewJob(job) {
    if (job.jobtype === "service_24h") {
      navigate(`/client-dashbroad2/service-24h/${job.id}`);
    } else {
      navigate(`/client-dashbroad2/service/${job.id}`);
    }
  }

  /* =====================================================
        PAGE UI
     - Note: wrapper marginLeft adapts to `collapsed`
  ===================================================== */
  return (
    <div
      className="freelance-wrapper"
      style={{
        marginLeft: collapsed ? "-110px" : "110px",
        transition: "margin-left 0.25s ease",
        padding: "20px 22px", // keep original padding intact (moved from CSS to inline so spacing remains same)
      }}
    >
      {/* HEADER */}
      <div className="topbar">
        <div className="top-left">
          <div className="back-btn" onClick={() => navigate(-1)}>
            <FiArrowLeft size={20} />
          </div>
          <h2 className="page-title">Browse Services</h2>
        </div>

        <div className="top-right">
          <FiMessageSquare className="top-icon" onClick={()=>{navigate("/client-dashbroad2/messages")}} />

          {/* 🟣 NOTIFICATION BUTTON */}
          <div style={{ position: "relative" }} onClick={() => setNotifOpen(true)}>
            <FiBell className="top-icon" />

            {pending > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  background: "red",
                  color: "#fff",
                  fontSize: "10px",
                  borderRadius: "50%",
                  padding: "2px 6px",
                }}
              >
                {pending}
              </span>
            )}
          </div>

          <div className="fh-avatar">
            <Link to={"/client-dashbroad2/ClientProfile"}>
              <img
                src={
                  userProfile?.profileImage ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="Profile"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: "relative" }}>
        <input
          type="text"
          className="search-input"
          placeholder="Search services..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        {suggestions.length > 0 && (
          <div className="suggestion-box">
            {suggestions.map((s, i) => (
              <p
                key={i}
                onClick={() => {
                  setSearchText(s);
                  setSuggestions([]);
                }}
                className="suggestion-item"
              >
                {s}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Categories */}
      {categories.length > 0 ? (
        <div className="category-row">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={
                selectedCategory === cat.name
                  ? "category-active"
                  : "category-btn"
              }
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === cat.name ? "" : cat.name
                )
              }
            >
              {cat.name}
            </button>
          ))}
        </div>
      ) : (
        <div style={{ padding: "10px 0", opacity: 0.5 }}>
          No categories found in database.
        </div>
      )}

      {/* Tabs */}
      <div className="jobtabs-wrapper">
        <button
          className={`jobtab ${jobTab === "full" ? "active-tab" : ""}`}
          onClick={() => setJobTab("full")}
        >
          Works
        </button>
        <button
          className={`jobtab ${jobTab === "24h" ? "active-tab" : ""}`}
          onClick={() => setJobTab("24h")}
        >
          24H Jobs
        </button>
        <button
          className={`jobtab ${jobTab === "saved" ? "active-tab" : ""}`}
          onClick={() => setJobTab("saved")}
        >
          Saved
        </button>
      </div>

      {/* Job List */}
      <div className="job-list">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="job-card"
            onClick={() => onViewJob(job)}
          >
            <div className="job-top">
              <h3 className="job-title">{job.title}</h3>
              <FiBookmark
                className={`bookmark-icon ${
                  savedJobs.includes(job.id) ? "bookmarked" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSave(job.id);
                }}
              />
            </div>

            <p className="job-desc">{job.description}</p>

            <div className="job-info-row">
              <span className="job-amount">
                ₹{job.budget_from} - ₹{job.budget_to}
              </span>

              <div className="job-icon-group">
                <span className="tag-icon">
                  <FiEye /> {job.views || "4+"}
                </span>
                <span className="tag-icon">
                  <FiClock /> {job.time || "1h ago"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Add Button */}
      <button
        className="floating-plus"
        onClick={() => navigate("/client-dashbroad2/PostJob")}
      >
        <FiPlus size={22} />
      </button>

      {/* ================================================================= */}
      {/* ======================= NOTIFICATION POPUP ======================= */}
      {/* ================================================================= */}
      {notifOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(2px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setNotifOpen(false);
          }}
        >
          <div
            style={{
              width: "90%",
              maxWidth: 420,
              background: "#fff",
              padding: 20,
              borderRadius: 16,
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <h3 style={{ marginBottom: 15 }}>Notifications</h3>

            {notifications.length === 0 && (
              <div style={{ padding: 20, textAlign: "center" }}>
                No notifications
              </div>
            )}

            {notifications.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 15,
                  background: "#f7f7f7",
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <img
                  src={
                    item.freelancerImage ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  }
                  width={48}
                  height={48}
                  style={{ borderRadius: "50%", marginRight: 10 }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>
                    {item.freelancerName}
                  </div>
                  <div>applied for {item.jobTitle}</div>
                </div>

                {!item.read ? (
                  <>
                    <button
                      onClick={() => acceptNotif(item)}
                      style={{ marginRight: 8 }}
                    >
                      ✅
                    </button>
                    <button onClick={() => declineNotif(item)}>❌</button>
                  </>
                ) : (
                  <button onClick={() => acceptNotif(item)}>💬</button>
                )}
              </div>
            ))}

            <button
              style={{
                marginTop: 10,
                width: "100%",
                padding: 10,
                borderRadius: 10,
                background: "#000",
                color: "#fff",
              }}
              onClick={() => setNotifOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* =============================== CSS =============================== */}
      {/* ================================================================= */}
      <style>{`
        * { font-family: 'Poppins', sans-serif; }
        .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .top-left { display: flex; align-items: center; gap: 12px; }
        .back-btn { width: 44px; height: 44px; background: #efe9ff; border-radius: 14px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .page-title { font-size: 21px; font-weight: 700; }
        .top-right { display: flex; gap: 16px; }
        .top-icon { font-size: 20px; cursor: pointer; }

        .search-input {
          width: 100%; padding: 12px 14px;
          border-radius: 12px; background: #fff;
          border: 1px solid #e6e7ee; font-size: 15px;
        }
        .suggestion-box {
          background: #fff; border: 1px solid #ddd; position: absolute;
          top: 50px; width: 100%; border-radius: 12px;
          box-shadow: 0 4px 18px rgba(0,0,0,.1); z-index: 10; padding: 8px;
        }
        .suggestion-item { padding: 8px; cursor: pointer; }

        .category-row { display: flex; gap: 10px; margin: 14px 0; overflow-x: auto; }
        .category-btn, .category-active {
          padding: 8px 14px; white-space: nowrap;
          border-radius: 999px; cursor: pointer; font-weight: 600;
        }
        .category-btn { background: white; border: 1px solid #e2e8f0; color: #444; }
        .category-active { background: #7c3aed; color: #fff; }

        .jobtabs-wrapper {
          background: #fff; display: flex; gap: 10px;
          padding: 10px; border-radius: 14px; border: 1px solid #ececec;
        }
        .jobtab {
          padding: 10px 14px; border-radius: 10px;
          font-weight: 700; cursor: pointer; opacity: .6; width: 100px; border: none;
        }
        .active-tab { background: #7c3aed; color: white; opacity: 1; }

        .job-list { display: flex; flex-direction: column; gap: 18px; margin-top: 20px; }
        .job-card {
          background: #fff; border-radius: 18px; padding: 18px;
          border: 1px solid #ececec; cursor: pointer;
          transition: .2s;
        }
        .job-card:hover { transform: translateY(-3px); box-shadow: 0 6px 18px rgba(0,0,0,.08); }

        .job-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .job-title { font-size: 17px; font-weight: 700; margin: 0; }
        .job-desc { font-size: 14px; opacity: .85; margin: 0; }

        .bookmark-icon { font-size: 20px; cursor: pointer; color: #777; }
        .bookmarked { color: #7c3aed !important; }

        .job-info-row {
          display: flex; justify-content: space-between; align-items: center; margin-top: 6px;
        }
        .job-amount { font-size: 17px; font-weight: 700; }
        .job-icon-group { display: flex; gap: 12px; }
        .tag-icon { display: flex; align-items: center; gap: 4px; font-size: 12px; }

        .floating-plus {
          position: fixed; right: 22px; bottom: 22px;
          width: 56px; height: 56px; border-radius: 50%;
          background: #7c3aed; color: white;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 18px rgba(99,102,241,.2); border: none;
        }
      `}</style>
    </div>
  );
}
