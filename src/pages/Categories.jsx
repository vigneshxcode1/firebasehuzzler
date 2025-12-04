// import React, { useEffect, useState } from "react";
// import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
// import { db } from "../firbase/Firebase";
// import {
//   FiBell,
//   FiMessageSquare,
//   FiUser,
//   FiArrowLeft,
//   FiBookmark,
//   FiPlus,
//   FiFilter,
//   FiChevronDown,
//   FiEye,
//   FiClock,
// } from "react-icons/fi";

// export default function FreelanceHome() {
//   const auth = getAuth();
//   const user = auth.currentUser;
//   const navigate = useNavigate();

//   // TWO COLLECTIONS
//   const [jobs, setJobs] = useState([]);        // FULL SERVICES
//   const [jobs24, setJobs24] = useState([]);    // 24H SERVICES

//   const [savedJobs, setSavedJobs] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [jobTab, setJobTab] = useState("24h");

//   const [categories, setCategories] = useState([]);

//   // ------------------------------
//   // FETCH FULL JOBS
//   // ------------------------------
//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "jobs"), (snap) => {
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data(), jobtype: "jobs" }));
//       setJobs(
//         list.sort(
//           (a, b) =>
//             (b.created_at?.toDate?.() || 0) - (a.created_at?.toDate?.() || 0)
//         )
//       );
//     });
//     return unsub;
//   }, []);

//   // ------------------------------
//   // FETCH 24H JOBS
//   // ------------------------------
//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "jobs_24h"), (snap) => {
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data(), jobtype: "jobs_24h" }));
//       setJobs24(
//         list.sort(
//           (a, b) =>
//             (b.created_at?.toDate?.() || 0) - (a.created_at?.toDate?.() || 0)
//         )
//       );
//     });
//     return unsub;
//   }, []);

//   // ------------------------------
//   // FETCH SAVED JOBS
//   // ------------------------------
//   useEffect(() => {
//     if (!user) return;
//     const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
//       setSavedJobs(snap.data()?.favoriteJobs || []);
//     });
//     return unsub;
//   }, [user]);

//   // ------------------------------
//   // FETCH CATEGORY LIST
//   // ------------------------------
//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "users"), (snap) => {
//       const allCats = snap.docs
//         .map((d) => d.data().category)
//         .filter((cat) => cat && cat.trim() !== "");

//       const uniqueCats = [...new Set(allCats)];

//       setCategories(
//         uniqueCats.map((name, index) => ({ id: index + 1, name }))
//       );
//     });

//     return unsub;
//   }, []);

//   // ------------------------------
//   // SAVE / UNSAVE
//   // ------------------------------
//   const toggleSave = async (jobId) => {
//     if (!user) return;

//     const ref = doc(db, "users", user.uid);
//     const updated = savedJobs.includes(jobId)
//       ? savedJobs.filter((id) => id !== jobId)
//       : [...savedJobs, jobId];

//     await updateDoc(ref, { favoriteJobs: updated });
//   };

//   // ------------------------------
//   // FULL FILTERED LIST
//   // ------------------------------
//   const getFilteredJobs = () => {
//     let data =
//       jobTab === "24h"
//         ? jobs24
//         : jobTab === "full"
//         ? jobs
//         : [...jobs, ...jobs24].filter((j) => savedJobs.includes(j.id));

//     return data.filter((job) => {
//       const matchSearch =
//         job.title?.toLowerCase().includes(searchText.toLowerCase()) ||
//         job.description?.toLowerCase().includes(searchText.toLowerCase());

//       const matchCategory = selectedCategory
//         ? job.category === selectedCategory
//         : true;

//       return matchSearch && matchCategory;
//     });
//   };

//   const filteredJobs = getFilteredJobs();

//   return (
//     <div className="freelance-wrapper">

//       {/* TOP BAR */}
//       <div className="topbar">
//         <div className="top-left">
//           <div className="back-btn" onClick={() => navigate(-1)}>
//             <FiArrowLeft size={20} />
//           </div>
//           <h2 className="page-title">Browse Projects</h2>
//         </div>

//         <div className="top-right">
//           <FiMessageSquare className="top-icon" />
//           <FiBell className="top-icon" />
//           <FiUser className="top-icon" />
//         </div>
//       </div>

//       {/* Search */}
//       <div className="search-row">
//         <input
//           type="text"
//           className="search-input"
//           placeholder="Search projects..."
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//         />
//       </div>

//       {/* CATEGORY ROW */}
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

//       {/* Filter + Sort */}
//       <div className="filter-sort-row">
//         <button className="filter-btn">
//           <FiFilter /> Filter
//         </button>
//         <button className="sort-btn">
//           Sort <FiChevronDown />
//         </button>
//       </div>

//       {/* JOB LIST */}
//       <div className="job-list">
//         {filteredJobs.map((job) => (
//           <div
//             key={job.id}
//             className="job-card"
//             onClick={() =>
//               navigate(
//                 job.jobtype === "jobs_24h"
//                   ? `/freelance-dashboard/job-24/${job.id}`
//                   : `/freelance-dashboard/job-full/${job.id}`
//               )
//             }
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
//               <span className="job-amount">₹{job.budget_from} / day</span>

//               <div className="job-icon-group">
//                 <span className="tag-icon">
//                   <FiEye /> {job.rating || "4+"}
//                 </span>
//                 <span className="tag-icon">
//                   <FiClock /> {job.time || "2 hours ago"}
//                 </span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Floating + Button */}
//       <button
//         className="floating-plus"
//         onClick={() => navigate("/freelance-dashboard/add-service-form")}
//       >
//         <FiPlus size={22} />
//       </button>

//       {/* CSS */}
//       <style>{`
//         * { font-family: 'Poppins', sans-serif; }
//         .freelance-wrapper { padding: 20px 22px; }
//         .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
//         .top-left { display: flex; align-items: center; gap: 12px; }
//         .back-btn {
//           width: 44px; height: 44px; background: #efe9ff;
//           border-radius: 14px; display: flex; align-items: center;
//           justify-content: center; cursor: pointer;
//         }
//         .page-title { font-size: 21px; font-weight: 700; }
//         .top-right { display: flex; gap: 16px; }
//         .top-icon { font-size: 20px; cursor: pointer; }

//         .search-input {
//           width: 100%; padding: 12px 14px;
//           border-radius: 12px; background: #fff;
//           border: 1px solid #e6e7ee; font-size: 15px;
//         }

//         .category-row { display: flex; gap: 10px; margin: 14px 0; overflow-x: auto; }
//         .category-btn, .category-active {
//           padding: 8px 14px; white-space: nowrap;
//           border-radius: 999px; cursor: pointer; font-weight: 600;
//         }
//         .category-btn { background: white; border: 1px solid #e2e8f0; color: #444; }
//         .category-active { background: #7c3aed; color: #fff; border: 1px solid #7c3aed; }

//         .jobtabs-wrapper {
//           background: #fff; display: flex; gap: 10px;
//           padding: 10px; border-radius: 14px; border: 1px solid #ececec;
//         }
//         .jobtab {
//           padding: 10px 14px; border-radius: 10px; border: none;
//           font-weight: 700; cursor: pointer; opacity: .6; width: 100px;
//         }
//         .active-tab { background: #7c3aed; color: white; opacity: 1; }

//         .filter-sort-row { display: flex; gap: 10px; margin: 12px 0; }
//         .filter-btn, .sort-btn {
//           display: flex; gap: 8px; align-items: center;
//           padding: 9px 12px; background: #fff; border: 1px solid #e6e7ee;
//           border-radius: 10px; cursor: pointer; font-weight: 600;
//         }

//         .job-list { display: flex; flex-direction: column; gap: 18px; }
//         .job-card {
//           background: #fff; border-radius: 18px; padding: 18px;
//           border: 1px solid #ececec; cursor: pointer;
//           transition: .2s; display: flex; flex-direction: column; gap: 8px;
//         }
//         .job-card:hover { transform: translateY(-3px); box-shadow: 0 6px 18px rgba(0,0,0,.08); }

//         .job-top { display: flex; justify-content: space-between; align-items: flex-start; }
//         .job-title { font-size: 17px; font-weight: 700; margin: 0; }
//         .job-desc { font-size: 14px; opacity: .85; margin: 0; }

//         .bookmark-icon { font-size: 20px; cursor: pointer; color: #777; }
//         .bookmarked { color: #7c3aed !important; }

//         .job-info-row {
//           display: flex; justify-content: space-between;
//           align-items: center; margin-top: 6px;
//         }
//         .job-amount { font-size: 17px; font-weight: 700; color: #222; }
//         .job-icon-group { display: flex; gap: 12px; }
//         .tag-icon { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #616161; }

//         .floating-plus {
//           position: fixed; right: 22px; bottom: 22px;
//           width: 56px; height: 56px; border-radius: 50%;
//           background: linear-gradient(180deg, #7c3aed, #6d28d9);
//           color: white; border: none; cursor: pointer;
//           display: flex; align-items: center; justify-content: center;
//           box-shadow: 0 8px 18px rgba(99,102,241,.2);
//         }
//       `}</style>
//     </div>
//   );
// }







// // import React, { useEffect, useState } from "react";
// // import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
// // import { getAuth } from "firebase/auth";
// // import { useNavigate } from "react-router-dom";
// // import { db } from "../firbase/Firebase";
// // import {
// //   FiBell,
// //   FiMessageSquare,
// //   FiUser,
// //   FiArrowLeft,
// //   FiBookmark,
// //   FiPlus,
// //   FiFilter,
// //   FiChevronDown,
// //   FiEye,
// //   FiClock,
// // } from "react-icons/fi";

// // export default function FreelanceHome() {
// //   const auth = getAuth();
// //   const user = auth.currentUser;
// //   const navigate = useNavigate();

// //   const [jobs, setJobs] = useState([]);
// //   const [jobs24, setJobs24] = useState([]);
// //   const [savedJobs, setSavedJobs] = useState([]);
// //   const [searchText, setSearchText] = useState("");
// //   const [selectedCategory, setSelectedCategory] = useState("");
// //   const [jobTab, setJobTab] = useState("24h");
// //   const [categories, setCategories] = useState([]);

// //   // ⚡ Sort States
// //   const [showSort, setShowSort] = useState(false);
// //   const [selectedSort, setSelectedSort] = useState("");

// //   const sortOptions = [
// //     "Latest",
// //     "Oldest",
// //     "Price: Low to High",
// //     "Price: High to Low",
// //     "Most Viewed",
// //     "Top Rated",
// //   ];

// //   // JOB FETCHERS
// //   useEffect(() => {
// //     const unsub = onSnapshot(collection(db, "jobs"), (snap) => {
// //       const list = snap.docs.map((d) => ({
// //         id: d.id,
// //         ...d.data(),
// //         jobtype: "jobs",
// //       }));
// //       setJobs(
// //         list.sort(
// //           (a, b) =>
// //             (b.created_at?.toDate?.() || 0) -
// //             (a.created_at?.toDate?.() || 0)
// //         )
// //       );
// //     });
// //     return unsub;
// //   }, []);

// //   useEffect(() => {
// //     const unsub = onSnapshot(collection(db, "jobs_24h"), (snap) => {
// //       const list = snap.docs.map((d) => ({
// //         id: d.id,
// //         ...d.data(),
// //         jobtype: "jobs_24h",
// //       }));
// //       setJobs24(
// //         list.sort(
// //           (a, b) =>
// //             (b.created_at?.toDate?.() || 0) -
// //             (a.created_at?.toDate?.() || 0)
// //         )
// //       );
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
// //       const allCats = snap.docs
// //         .map((d) => d.data().category)
// //         .filter((cat) => cat && cat.trim() !== "");

// //       const uniqueCats = [...new Set(allCats)];

// //       setCategories(
// //         uniqueCats.map((name, index) => ({
// //           id: index + 1,
// //           name,
// //         }))
// //       );
// //     });

// //     return unsub;
// //   }, []);

// //   // SAVE JOB
// //   const toggleSave = async (jobId) => {
// //     if (!user) return;

// //     const ref = doc(db, "users", user.uid);
// //     const updated = savedJobs.includes(jobId)
// //       ? savedJobs.filter((id) => id !== jobId)
// //       : [...savedJobs, jobId];

// //     await updateDoc(ref, { favoriteJobs: updated });
// //   };

// //   // FILTERS
// //   const getFilteredJobs = () => {
// //     let data =
// //       jobTab === "24h"
// //         ? jobs24
// //         : jobTab === "full"
// //         ? jobs
// //         : [...jobs, ...jobs24].filter((j) =>
// //             savedJobs.includes(j.id)
// //           );

// //     return data.filter((job) => {
// //       const matchSearch =
// //         job.title?.toLowerCase().includes(searchText.toLowerCase()) ||
// //         job.description?.toLowerCase().includes(searchText.toLowerCase());

// //       const matchCategory = selectedCategory
// //         ? job.category === selectedCategory
// //         : true;

// //       return matchSearch && matchCategory;
// //     });
// //   };

// //   const filteredJobs = getFilteredJobs();

// //   return (
// //     <div className="freelance-wrapper">
// //       {/* TOP BAR */}
// //       <div className="topbar">
// //         <div className="top-left">
// //           <div className="back-btn" onClick={() => navigate(-1)}>
// //             <FiArrowLeft size={20} />
// //           </div>
// //           <h2 className="page-title">Browse Projects</h2>
// //         </div>

// //         <div className="top-right">
// //           <FiMessageSquare className="top-icon" />
// //           <FiBell className="top-icon" />
// //           <FiUser className="top-icon" />
// //         </div>
// //       </div>

// //       {/* SEARCH */}
// //       <div className="search-row">
// //         <input
// //           type="text"
// //           className="search-input"
// //           placeholder="Search projects..."
// //           value={searchText}
// //           onChange={(e) => setSearchText(e.target.value)}
// //         />
// //       </div>

// //       {/* CATEGORY ROW */}
// //       <div className="category-row">
// //         {categories.map((cat) => (
// //           <button
// //             key={cat.id}
// //             className={
// //               selectedCategory === cat.name
// //                 ? "category-active"
// //                 : "category-btn"
// //             }
// //             onClick={() =>
// //               setSelectedCategory(
// //                 selectedCategory === cat.name ? "" : cat.name
// //               )
// //             }
// //           >
// //             {cat.name}
// //           </button>
// //         ))}
// //       </div>

// //       {/* TABS */}
// //       <div className="jobtabs-wrapper">
// //         <button
// //           className={`jobtab ${
// //             jobTab === "full" ? "active-tab" : ""
// //           }`}
// //           onClick={() => setJobTab("full")}
// //         >
// //           Works
// //         </button>
// //         <button
// //           className={`jobtab ${
// //             jobTab === "24h" ? "active-tab" : ""
// //           }`}
// //           onClick={() => setJobTab("24h")}
// //         >
// //           24H Jobs
// //         </button>
// //         <button
// //           className={`jobtab ${
// //             jobTab === "saved" ? "active-tab" : ""
// //           }`}
// //           onClick={() => setJobTab("saved")}
// //         >
// //           Saved
// //         </button>
// //       </div>

// //       {/* FILTER + SORT */}
// //       <div className="filter-sort-row">
// //         {/* <button className="filter-btn">
// //           <FiFilter /> Filter
// //         </button> */}

// //         <button
// //           className="sort-btn"
// //           onClick={() => setShowSort(!showSort)}
// //         >
// //           Sort <FiChevronDown />
// //         </button>
// //       </div>

// //       {/* SORT DROPDOWN */}
// //       {showSort && (
// //         <div className="sort-small-wrapper" onClick={() => setShowSort(false)}>
// //           <div
// //             className="sort-small-card"
// //             onClick={(e) => e.stopPropagation()}
// //           >
// //             {sortOptions.map((opt) => (
// //               <label key={opt} className="sort-small-option">
// //                 <input
// //                   type="radio"
// //                   name="sort"
// //                   checked={selectedSort === opt}
// //                   onChange={() => {
// //                     setSelectedSort(opt);
// //                     setShowSort(false);
// //                   }}
// //                 />
// //                 {opt}
// //               </label>
// //             ))}
// //           </div>
// //         </div>
// //       )}

// //       {/* JOB LIST */}
// //       <div className="job-list">
// //         {filteredJobs.map((job) => (
// //           <div key={job.id} className="job-card">
// //             <div className="job-top">
// //               <h2 className="job-company">
// //                 {job.company_name || "Zuntra digital PVT"}
// //               </h2>

// //               <div className="job-right">
// //                 <span className="job-salary">
// //                   ₹{job.budget_from || 1000}/per day
// //                 </span>

// //                 <FiBookmark
// //                   className={`bookmark-icon ${
// //                     savedJobs.includes(job.id) ? "bookmarked" : ""
// //                   }`}
// //                   onClick={(e) => {
// //                     e.stopPropagation();
// //                     toggleSave(job.id);
// //                   }}
// //                 />
// //               </div>
// //             </div>

// //             <h3 className="job-position">
// //               {job.title || "UIUX Designer"}
// //             </h3>

// //             <div className="skills-title">Skills Required</div>

// //             <div className="skills-row">
// //               {["UI Design", "Web Design", "UX", "4+"].map((s) => (
// //                 <div key={s} className="skill-pill">
// //                   {s}
// //                 </div>
// //               ))}
// //             </div>

// //             <p className="job-description">
// //               {job.description ||
// //                 "We're seeking a passionate UI/UX Designer to design intuitive digital experiences."}
// //             </p>

// //             <div className="job-footer">
// //               <span className="job-footer-item">
// //                 <FiEye /> {job.impressions || "29"} Impression
// //               </span>

// //               <span className="job-footer-item">
// //                 <FiClock /> {job.time || "1 min ago"}
// //               </span>
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       <button
// //         className="floating-plus"
// //         onClick={() => navigate("/freelance-dashboard/add-service-form")}
// //       >
// //         <FiPlus size={22} />
// //       </button>

// //       {/* CSS */}
// //       <style>{`
// //         * { font-family: 'Rubik', sans-serif; }
// //         .freelance-wrapper { padding: 20px 22px; overflow-x: hidden; }

// //         /* SORT SMALL CARD */
// //         .sort-small-wrapper {
// //           position: fixed;
// //           inset: 0;
// //           background: transparent;
// //           z-index: 50;
// //         }
// //         .sort-small-card {
// //           position: absolute;
// //           right: 20px;
// //           top: 260px;
// //           width: 210px;
// //           background: white;
// //           border-radius: 18px;
// //           padding: 12px;
// //           box-shadow: 0 8px 22px rgba(0,0,0,0.12);
// //         }
// //         .sort-small-option {
// //           display: flex;
// //           align-items: center;
// //           gap: 10px;
// //           padding: 8px 4px;
// //           font-size: 14px;
// //         }
// //         .sort-small-option input {
// //           transform: scale(1.2);
// //         }

// //         /* REST OF YOUR CSS (unchanged) */
// //         .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
// //         .top-left { display: flex; align-items: center; gap: 12px; }
// //         .back-btn {
// //           width: 44px; height: 44px; background: #efe9ff;
// //           border-radius: 14px; display: flex; align-items: center;
// //           justify-content: center; cursor: pointer;
// //         }
// //         .page-title { font-size: 21px; font-weight: 700; }
// //         .top-right { display: flex; gap: 16px; }
// //         .top-icon { font-size: 20px; cursor: pointer; }

// //         .search-input {
// //           width: 90%; padding: 12px 14px;
// //           border-radius: 12px; border: 1px solid #e6e7ee;
// //         }

// //         .category-row { display: flex; gap: 10px; overflow-x: auto; margin: 14px 0; padding-bottom: 4px; }
// //         .category-btn, .category-active {
// //           padding: 8px 14px; border-radius: 999px;
// //           white-space: nowrap; cursor: pointer;
// //         }
// //         .category-btn { background: white; border: 1px solid #e2e8f0; }
// //         .category-active { background: #7c3aed; color: white; }

// //         .jobtabs-wrapper {
// //           background: #fff; padding: 10px; display: flex;
// //           border-radius: 14px; gap: 10px; border: 1px solid #ececec;
// //         }
// //         .jobtab {
// //           padding: 10px 14px; opacity: .6; font-weight: 700;
// //           width: 100px; border-radius: 10px;
// //         }
// //         .active-tab { background: #7c3aed; color: white; opacity: 1; }

// //         .filter-sort-row { display: flex; justify-content: space-between; margin: 12px 0; }
// //         .sort-btn {
// //           display: flex; align-items: center; gap: 8px;
// //           padding: 9px 12px; border: 1px solid #e6e7ee;
// //           border-radius: 10px; background: white; font-weight: 600;
// //           margin-left:95%;
// //         }

// //         .job-card {
// //           // background: linear-gradient(135deg, white, #fffdf4);
// //           border-radius: 22px;
// //           padding: 22px;
// //           margin-bottom: 16px;
// //           border: 1px solid #f1f1f1;
// //         }
// //         .job-top {
// //           display: flex; justify-content: space-between; align-items: center;
// //         }
// //         .job-company { font-size: 19px; font-weight: 700; }
// //         .job-right { display: flex; align-items: center; gap: 10px; }
// //         .job-salary { font-weight: 700; }
// //         .bookmark-icon { font-size: 20px; cursor: pointer; }
// //         .bookmarked { color: #7c3aed; }

// //         .job-position { font-size: 17px; font-weight: 600; margin-top: 6px; }
// //         .skills-title { font-weight: 600; font-size: 14px; margin: 10px 0 6px; }
// //         .skills-row { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 12px; }
// //         .skill-pill {
// //           background: #fff4b8; padding: 6px 14px; border-radius: 999px;
// //           font-size: 13px; font-weight: 500;
// //         }
// //         .job-description { font-size: 14px; color: #444; line-height: 1.45; margin-bottom: 14px; }

// //         .job-footer { display: flex; gap: 20px; color: #666; font-size: 13px; }

// //         .floating-plus {
// //           position: fixed; right: 22px; bottom: 22px;
// //           width: 56px; height: 56px; background: #7c3aed;
// //           border-radius: 50%; color: white; border: none;
// //           display: flex; align-items: center; justify-content: center;
// //         }
// //       `}</style>
// //     </div>
// //   );
// // }

// import React, { useEffect, useState } from "react";
// import { collection, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { Link, useNavigate } from "react-router-dom";
// import { db } from "../firbase/Firebase";
// import {
//  FiBell,
//  FiMessageSquare,
//  FiUser,
//  FiArrowLeft,
//  FiBookmark,
//  FiPlus,
//  FiFilter,
//  FiChevronDown,
//  FiEye,
//  FiClock,
// } from "react-icons/fi";




// export default function FreelanceHome() {
//  const auth = getAuth();
//  const user = auth.currentUser;
//  const navigate = useNavigate();

//  const [jobs, setJobs] = useState([]);
//  const [jobs24, setJobs24] = useState([]);
//  const [savedJobs, setSavedJobs] = useState([]);
//  const [searchText, setSearchText] = useState("");
//  const [selectedCategory, setSelectedCategory] = useState("");
//  const [jobTab, setJobTab] = useState("24h");
//  const [categories, setCategories] = useState([]);
//  const [profile, setProfile] = useState(null);

//  const [userInfo, setUserInfo] = useState({
//  firstName: "",
//  lastName: "",
//  role: "",
//  profileImage: "",
//  });




//  const fetchUserProfile = async (uid) => {
//  try {
//  const userRef = doc(db, "users", uid);
//  const snap = await getDoc(userRef);
//  if (snap.exists()) {
//  setProfile(snap.data());
//  }
//  } catch (e) {
//  console.log("Profile fetch error:", e);
//  }
//  };

//  useEffect(() => {
//  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//  if (!currentUser) return;

//  try {
//  const userRef = doc(db, "users", currentUser.uid);
//  const snap = await getDoc(userRef);

//  if (snap.exists()) {
//  const data = snap.data();
//  setUserInfo({
//  firstName: data.firstName || "",
//  lastName: data.lastName || "",
//  role: data.role || "",
//  profileImage: data.profileImage || "",
//  });

//  // fetch profile for header
//  fetchUserProfile(currentUser.uid);
//  }
//  } catch (err) {
//  console.error("Error fetching user:", err);
//  }
//  });

//  return unsubscribe;
//  }, []);


//  // ⚡ Sort States
//  const [showSort, setShowSort] = useState(false);
//  const [selectedSort, setSelectedSort] = useState("");

//  const sortOptions = [
//  "Latest",
//  "Oldest",
//  "Price: Low to High",
//  "Price: High to Low",
//  "Most Viewed",
//  "Top Rated",
//  ];

//  // JOB FETCHERS
//  useEffect(() => {
//  const unsub = onSnapshot(collection(db, "jobs"), (snap) => {
//  const list = snap.docs.map((d) => ({
//  id: d.id,
//  ...d.data(),
//  jobtype: "jobs",
//  }));
//  setJobs(
//  list.sort(
//  (a, b) =>
//  (b.created_at?.toDate?.() || 0) -
//  (a.created_at?.toDate?.() || 0)
//  )
//  );
//  });
//  return unsub;
//  }, []);

//  useEffect(() => {
//  const unsub = onSnapshot(collection(db, "jobs_24h"), (snap) => {
//  const list = snap.docs.map((d) => ({
//  id: d.id,
//  ...d.data(),
//  jobtype: "jobs_24h",
//  }));
//  setJobs24(
//  list.sort(
//  (a, b) =>
//  (b.created_at?.toDate?.() || 0) -
//  (a.created_at?.toDate?.() || 0)
//  )
//  );
//  });
//  return unsub;
//  }, []);

//  useEffect(() => {
//  if (!user) return;
//  const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
//  setSavedJobs(snap.data()?.favoriteJobs || []);
//  });
//  return unsub;
//  }, [user]);

//  useEffect(() => {
//  const unsub = onSnapshot(collection(db, "users"), (snap) => {
//  const allCats = snap.docs
//  .map((d) => d.data().category)
//  .filter((cat) => cat && cat.trim() !== "");

//  const uniqueCats = [...new Set(allCats)];

//  setCategories(
//  uniqueCats.map((name, index) => ({
//  id: index + 1,
//  name,
//  }))
//  );
//  });

//  return unsub;
//  }, []);

//  // SAVE JOB
//  const toggleSave = async (jobId) => {
//  if (!user) return;

//  const ref = doc(db, "users", user.uid);
//  const updated = savedJobs.includes(jobId)
//  ? savedJobs.filter((id) => id !== jobId)
//  : [...savedJobs, jobId];

//  await updateDoc(ref, { favoriteJobs: updated });
//  };

//  // FILTERS
//  const getFilteredJobs = () => {
//  let data =
//  jobTab === "24h"
//  ? jobs24
//  : jobTab === "full"
//  ? jobs
//  : [...jobs, ...jobs24].filter((j) =>
//  savedJobs.includes(j.id)
//  );

//  return data.filter((job) => {
//  const matchSearch =
//  job.title?.toLowerCase().includes(searchText.toLowerCase()) ||
//  job.description?.toLowerCase().includes(searchText.toLowerCase());

//  const matchCategory = selectedCategory
//  ? job.category === selectedCategory
//  : true;

//  return matchSearch && matchCategory;
//  });
//  };

//  const filteredJobs = getFilteredJobs();

//  return (
//  <div className="freelance-wrapper">
//  {/* TOP BAR */}
//  <div className="topbar">
//  <div className="top-left">
//  <div className="back-btn" onClick={() => navigate(-1)}>
//  <FiArrowLeft size={20} />
//  </div>
//  <h2 className="page-title">Browse Projects</h2>
//  </div>

//  <div className="top-right">
//  <FiMessageSquare className="top-icon" />
//  <FiBell className="top-icon" />
//  <div className="fh-avatar">
//  <Link to={"/freelance-dashboard/accountfreelancer"}>
//  <img src={profile?.profileImage || profile || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} />
//  </Link>
//  </div>
//  </div>
//  </div>

//  {/* SEARCH */}
//  <div className="search-row">
//  <input
//  type="text"
//  className="search-input"
//  placeholder="Search projects..."
//  value={searchText}
//  onChange={(e) => setSearchText(e.target.value)}
//  />
//  </div>

//  {/* CATEGORY ROW */}
//  <div className="category-row">
//  {categories.map((cat) => (
//  <button
//  key={cat.id}
//  className={
//  selectedCategory === cat.name
//  ? "category-active"
//  : "category-btn"
//  }
//  onClick={() =>
//  setSelectedCategory(
//  selectedCategory === cat.name ? "" : cat.name
//  )
//  }
//  >
//  {cat.name}
//  </button>
//  ))}
//  </div>

//  {/* TABS */}
//  <div className="jobtabs-wrapper">
//  <button
//  className={`jobtab ${jobTab === "full" ? "active-tab" : ""
//  }`}
//  onClick={() => setJobTab("full")}
//  >
//  Works
//  </button>
//  <button
//  className={`jobtab ${jobTab === "24h" ? "active-tab" : ""
//  }`}
//  onClick={() => setJobTab("24h")}
//  >
//  24H Jobs
//  </button>
//  <button
//  className={`jobtab ${jobTab === "saved" ? "active-tab" : ""
//  }`}
//  onClick={() => setJobTab("saved")}
//  >
//  Saved
//  </button>
//  </div>

//  {/* FILTER + SORT */}
//  <div className="filter-sort-row">
//  {/* <button className="filter-btn">
//  <FiFilter /> Filter
//  </button> */}

//  <button
//  className="sort-btn"
//  onClick={() => setShowSort(!showSort)}
//  >
//  Sort <FiChevronDown />
//  </button>
//  </div>

//  {/* SORT DROPDOWN */}
//  {showSort && (
//  <div className="sort-small-wrapper" onClick={() => setShowSort(false)}>
//  <div
//  className="sort-small-card"
//  onClick={(e) => e.stopPropagation()}
//  >
//  {sortOptions.map((opt) => (
//  <label key={opt} className="sort-small-option">
//  <input
//  type="radio"
//  name="sort"
//  checked={selectedSort === opt}
//  onChange={() => {
//  setSelectedSort(opt);
//  setShowSort(false);
//  }}
//  />
//  {opt}
//  </label>
//  ))}
//  </div>
//  </div>
//  )}

//  {/* JOB LIST */}
//  <div className="job-list">
//  {filteredJobs.map((job) => (
//  <div key={job.id} className="job-card">
//  <div className="job-top">
//  <h2 className="job-company">
//  {job.company_name || "Zuntra digital PVT"}
//  </h2>

//  <div className="job-right">
//  <span className="job-salary">
//  ₹{job.budget_from || 1000}/per day
//  </span>

//  <FiBookmark
//  className={`bookmark-icon ${savedJobs.includes(job.id) ? "bookmarked" : ""
//  }`}
//  onClick={(e) => {
//  e.stopPropagation();
//  toggleSave(job.id);
//  }}
//  />
//  </div>
//  </div>

//  <h3 className="job-position">
//  {job.title || "UIUX Designer"}
//  </h3>

//  <div className="skills-title">Skills Required</div>

//  <div className="skills-row">
//  {["UI Design", "Web Design", "UX", "4+"].map((s) => (
//  <div key={s} className="skill-pill">
//  {s}
//  </div>
//  ))}
//  </div>

//  <p className="job-description">
//  {job.description ||
//  "We're seeking a passionate UI/UX Designer to design intuitive digital experiences."}
//  </p>

//  <div className="job-footer">
//  <span className="job-footer-item">
//  <FiEye /> {job.impressions || "29"} Impression
//  </span>

//  <span className="job-footer-item">
//  <FiClock /> {job.time || "1 min ago"}
//  </span>
//  </div>
//  </div>
//  ))}
//  </div>

//  <button
//  className="floating-plus"
//  onClick={() => navigate("/freelance-dashboard/add-service-form")}
//  >
//  <FiPlus size={22} />
//  </button>

//  {/* CSS */}
//  <style>{`
//  * { font-family: 'Rubik', sans-serif; }
//  .freelance-wrapper { padding: 20px 22px; overflow-x: hidden; }

//  /* SORT SMALL CARD */
//  .sort-small-wrapper {
//  position: fixed;
//  inset: 0;
//  background: transparent;
//  z-index: 50;
//  }
//  .sort-small-card {
//  position: absolute;
//  right: 20px;
//  top: 260px;
//  width: 210px;
//  background: white;
//  border-radius: 18px;
//  padding: 12px;
//  box-shadow: 0 8px 22px rgba(0,0,0,0.12);
//  }
//  .sort-small-option {
//  display: flex;
//  align-items: center;
//  gap: 10px;
//  padding: 8px 4px;
//  font-size: 14px;
//  }
//  .sort-small-option input {
//  transform: scale(1.2);
//  }

//  /* REST OF YOUR CSS (unchanged) */
//  .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
//  .top-left { display: flex; align-items: center; gap: 12px; }
//  .back-btn {
//  width: 44px; height: 44px; background: #efe9ff;
//  border-radius: 14px; display: flex; align-items: center;
//  justify-content: center; cursor: pointer;
//  }
//  .page-title { font-size: 21px; font-weight: 700; }
//  .top-right { display: flex; gap: 16px; }
//  .top-icon { font-size: 20px; cursor: pointer; }

//  .search-input {
//  width: 90%; padding: 12px 14px;
//  border-radius: 12px; border: 1px solid #e6e7ee;
//  }

//  .category-row { display: flex; gap: 10px; overflow-x: auto; margin: 14px 0; padding-bottom: 4px; }
//  .category-btn, .category-active {
//  padding: 8px 14px; border-radius: 999px;
//  white-space: nowrap; cursor: pointer;
//  }
//  .category-btn { background: white; border: 1px solid #e2e8f0; }
//  .category-active { background: #7c3aed; color: white; }

//  .jobtabs-wrapper {
//  background: #fff; padding: 10px; display: flex;
//  border-radius: 14px; gap: 10px; border: 1px solid #ececec;
//  }
//  .jobtab {
//  padding: 10px 14px; opacity: .6; font-weight: 700;
//  width: 100px; border-radius: 10px;
//  }
//  .active-tab { background: #7c3aed; color: white; opacity: 1; }

//  .filter-sort-row { display: flex; justify-content: space-between; margin: 12px 0; }
//  .sort-btn {
//  display: flex; align-items: center; gap: 8px;
//  padding: 9px 12px; border: 1px solid #e6e7ee;
//  border-radius: 10px; background: white; font-weight: 600;
//  margin-left:95%;
//  }

//  .job-card {
//  // background: linear-gradient(135deg, white, #fffdf4);
//  border-radius: 22px;
//  padding: 22px;
//  margin-bottom: 16px;
//  border: 1px solid #f1f1f1;
//  }
//  .job-top {
//  display: flex; justify-content: space-between; align-items: center;
//  }
//  .job-company { font-size: 19px; font-weight: 700; }
//  .job-right { display: flex; align-items: center; gap: 10px; }
//  .job-salary { font-weight: 700; }
//  .bookmark-icon { font-size: 20px; cursor: pointer; }
//  .bookmarked { color: #7c3aed; }

//  .job-position { font-size: 17px; font-weight: 600; margin-top: 6px; }
//  .skills-title { font-weight: 600; font-size: 14px; margin: 10px 0 6px; }
//  .skills-row { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 12px; }
//  .skill-pill {
//  background: #fff4b8; padding: 6px 14px; border-radius: 999px;
//  font-size: 13px; font-weight: 500;
//  }
//  .job-description { font-size: 14px; color: #444; line-height: 1.45; margin-bottom: 14px; }

//  .job-footer { display: flex; gap: 20px; color: #666; font-size: 13px; }

//  .floating-plus {
//  position: fixed; right: 22px; bottom: 22px;
//  width: 56px; height: 56px; background: #7c3aed;
//  border-radius: 50%; color: white; border: none;
//  display: flex; align-items: center; justify-content: center;
//  }
//  `}</style>
//  </div>
//  );
// }




import React, { useEffect, useState } from "react";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { db } from "../firbase/Firebase";
import {
  FiBell,
  FiMessageSquare,
  FiUser,
  FiArrowLeft,
  FiBookmark,
  FiPlus,
  FiFilter,
  FiChevronDown,
  FiEye,
  FiClock,
} from "react-icons/fi";

export default function FreelanceHome() {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [jobTab, setJobTab] = useState("24h");

  const [categories, setCategories] = useState([]);

  // FETCH JOBS
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "jobs"), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setJobs(
        list.sort(
          (a, b) =>
            (b.created_at?.toDate?.() || 0) - (a.created_at?.toDate?.() || 0)
        )
      );
    });
    return unsub;
  }, []);

  // FETCH SAVED JOBS
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      setSavedJobs(snap.data()?.favoriteJobs || []);
    });
    return unsub;
  }, [user]);

  // FETCH CATEGORIES FROM DB
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {

      // Get all category fields from users
      const allCats = snap.docs
        .map((d) => d.data().category)
        .filter((cat) => cat && cat.trim() !== ""); // remove empty/null

      // Remove duplicates
      const uniqueCats = [...new Set(allCats)];

      // Convert to array of objects for UI
      const finalCats = uniqueCats.map((name, index) => ({
        id: index + 1,
        name,
      }));

      setCategories(finalCats);
    });

    return unsub;
  }, []);


   useEffect(() => {
      const unsub1 = onSnapshot(collection(db, "jobs"), (snap) => {
        const normalJobs = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          jobtype: "jobs",
        }));
  
        setJobs((prev) => {
          const only24h = prev.filter((j) => j.jobtype === "jobs_24h");
          return [...only24h, ...normalJobs];
        });
      });
  
      const unsub2 = onSnapshot(collection(db, "jobs_24h"), (snap) => {
        const fastJobs = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          jobtype: "jobs_24h",
        }));
  
        setJobs((prev) => {
          const onlyNormal = prev.filter((j) => j.jobtype === "jobs");
          return [...onlyNormal, ...fastJobs];
        });
      });
  
      return () => {
        unsub1();
        unsub2();
      };
    }, []);
  const toggleSave = async (jobId) => {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    const updated = savedJobs.includes(jobId)
      ? savedJobs.filter((id) => id !== jobId)
      : [...savedJobs, jobId];

    setSavedJobs(updated);
    await updateDoc(ref, { favoriteJobs: updated });
  };

  const filteredJobs = jobs.filter((job) => {
    const matchTab =
      jobTab === "24h"
        ? job.jobtype === "jobs_24h"
        : jobTab === "full"
          ? job.jobtype !== "jobs_24h"
          : savedJobs.includes(job.id);

    const matchSearch =
      job.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchText.toLowerCase());

    const matchCategory = selectedCategory
      ? job.category === selectedCategory
      : true;

    return matchTab && matchSearch && matchCategory;
  });

  return (
    <div className="freelance-wrapper">

      {/* TOP BAR */}
      <div className="topbar">
        <div className="top-left">
          <div className="back-btn" onClick={() => navigate(-1)}>
            <FiArrowLeft size={20} />
          </div>
          <h2 className="page-title">Browse Projects</h2>
        </div>

        <div className="top-right">
          <FiMessageSquare className="top-icon" />
          <FiBell className="top-icon" />
          <FiUser className="top-icon" />
        </div>
      </div>

      {/* Search */}
      <div className="search-row">
        <input
          type="text"
          className="search-input"
          placeholder="Search projects..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* CATEGORIES (ONLY IF LIST > 0) */}
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

      {/* Filter + Sort */}
      <div className="filter-sort-row">
        <button className="filter-btn">
          <FiFilter /> Filter
        </button>
        <button className="sort-btn">
          Sort <FiChevronDown />
        </button>
      </div>

      {/* JOB LIST */}
      <div className="job-list">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="job-card"
            onClick={() =>
              navigate(
                job.jobtype === "jobs_24h"
                  ? `/freelance-dashboard/job-24/${job.id}`
                  : `/freelance-dashboard/job-full/${job.id}`
              )
            }
          >
            <div className="job-top">
              <h3 className="job-title">{job.title}</h3>
              <FiBookmark
                className={`bookmark-icon ${savedJobs.includes(job.id) ? "bookmarked" : ""
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSave(job.id);
                }}
              />
            </div>

            <p className="job-desc">{job.description}</p>

            <div className="job-info-row">
              <span className="job-amount">₹{job.budget_from} / day</span>

              <div className="job-icon-group">
                <span className="tag-icon">
                  <FiEye /> {job.rating || "4+"}
                </span>
                <span className="tag-icon">
                  <FiClock /> {job.time || "2 hours ago"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating + Button */}
      <button
        className="floating-plus"
        onClick={() => navigate("/freelance-dashboard/add-service-form")}
      >
        <FiPlus size={22} />
      </button>

      {/* CSS */}
      <style>{`
        * { font-family: 'Poppins', sans-serif; }

        .freelance-wrapper { padding: 20px 22px; }

        .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .top-left { display: flex; align-items: center; gap: 12px; }
        .back-btn {
          width: 44px; height: 44px; background: #efe9ff;
          border-radius: 14px; display: flex; align-items: center;
          justify-content: center; cursor: pointer;
        }
        .page-title { font-size: 21px; font-weight: 700; }
        .top-right { display: flex; gap: 16px; }
        .top-icon { font-size: 20px; cursor: pointer; }

        .search-input {
          width: 100%; padding: 12px 14px;
          border-radius: 12px; background: #fff;
          border: 1px solid #e6e7ee; font-size: 15px;
        }

        /* CATEGORIES */
        .category-row { display: flex; gap: 10px; margin: 14px 0; overflow-x: auto; }
        .category-btn, .category-active {
          padding: 8px 14px; white-space: nowrap;
          border-radius: 999px; cursor: pointer; font-weight: 600;
        }
        .category-btn { background: white; border: 1px solid #e2e8f0; color: #444; }
        .category-active { background: #7c3aed; color: #fff; border: 1px solid #7c3aed; }

        /* Tabs */
        .jobtabs-wrapper {
          background: #fff; display: flex; gap: 10px;
          padding: 10px; border-radius: 14px; border: 1px solid #ececec;
        }
        .jobtab {
          padding: 10px 14px; border-radius: 10px; border: none;
          font-weight: 700; cursor: pointer; opacity: .6; width: 100px;
        }
        .active-tab { background: #7c3aed; color: white; opacity: 1; }

        .filter-sort-row { display: flex; gap: 10px; margin: 12px 0; }
        .filter-btn, .sort-btn {
          display: flex; gap: 8px; align-items: center;
          padding: 9px 12px; background: #fff; border: 1px solid #e6e7ee;
          border-radius: 10px; cursor: pointer; font-weight: 600;
        }

        .job-list { display: flex; flex-direction: column; gap: 18px; }
        .job-card {
          background: #fff; border-radius: 18px; padding: 18px;
          border: 1px solid #ececec; cursor: pointer;
          transition: .2s; display: flex; flex-direction: column; gap: 8px;
        }
        .job-card:hover { transform: translateY(-3px); box-shadow: 0 6px 18px rgba(0,0,0,.08); }

        .job-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .job-title { font-size: 17px; font-weight: 700; margin: 0; }
        .job-desc { font-size: 14px; opacity: .85; margin: 0; }

        .bookmark-icon { font-size: 20px; cursor: pointer; color: #777; }
        .bookmarked { color: #7c3aed !important; }

        .job-info-row {
          display: flex; justify-content: space-between;
          align-items: center; margin-top: 6px;
        }
        .job-amount { font-size: 17px; font-weight: 700; color: #222; }
        .job-icon-group { display: flex; gap: 12px; }
        .tag-icon { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #616161; }

        .floating-plus {
          position: fixed; right: 22px; bottom: 22px;
          width: 56px; height: 56px; border-radius: 50%;
          background: linear-gradient(180deg, #7c3aed, #6d28d9);
          color: white; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 18px rgba(99,102,241,.2);
        }
      `}</style>
    </div>
  );
}
