







// import React, { useEffect, useMemo, useState } from "react";
// import JobFiltersFullScreen from "./FreelancerFilter";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   orderBy,
//   query,
//   updateDoc,
//   arrayUnion,
//   arrayRemove,
// } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { db } from "../../firbase/Firebase";

// import search from "../../assets/search.png";   // 🔥 FIXED
// import eye from "../../assets/eye.png";
// import clock from "../../assets/clock.png";
// import saved from "../../assets/save.png";
// import save from "../../assets/save2.png";

// /* =========================
//    ENUMS
// ========================= */
// const JobSortOption = {
//   BEST_MATCH: "bestMatch",
//   NEWEST: "newest",
//   AVAILABILITY: "availability",
// };

// /* =========================
//    DEFAULT FILTERS
// ========================= */
// const defaultFilters = {
//   searchQuery: "",
//   categories: [],
//   skills: [],
//   postingTime: "",
//   budgetRange: { start: 0, end: 100000 },
//   sortOption: JobSortOption.BEST_MATCH,
// };

// /* =========================
//    HELPERS
// ========================= */
// const formatCurrency = (amount = 0) => {
//   if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`;
//   if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
//   return amount;
// };

// const timeAgo = (date) => {
//   if (!date) return "";
//   const diff = Date.now() - date.getTime();
//   const mins = Math.floor(diff / 60000);
//   if (mins < 60) return `${mins}m ago`;
//   const hrs = Math.floor(mins / 60);
//   if (hrs < 24) return `${hrs}h ago`;
//   return `${Math.floor(hrs / 24)}d ago`;
// };

// const matchScore = (job, userSkills) => {
//   let score = 0;
//   job.skills?.forEach((s) => userSkills.includes(s) && (score += 3));
//   userSkills.includes(job.category) && (score += 2);
//   return score;
// };

// export default function ExploreFreelancer() {
//   const auth = getAuth();
//   const uid = auth.currentUser?.uid;

//   const [jobs, setJobs] = useState([]);
//   const [savedJobs, setSavedJobs] = useState([]);
//   const [userSkills, setUserSkills] = useState([]);

//   const [filters, setFilters] = useState(defaultFilters);
//   const [selectedTab, setSelectedTab] = useState(0);
//   const [showFilter, setShowFilter] = useState(false);

//   // 🔥 MISSING STATE ADDED
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   /* =========================
//      JOB STREAMS
//   ========================= */
//   useEffect(() => {
//     const qJobs = query(collection(db, "jobs"), orderBy("created_at", "desc"));
//     const qFast = query(
//       collection(db, "jobs_24h"),
//       orderBy("created_at", "desc")
//     );

//     const unsub1 = onSnapshot(qJobs, (snap) => {
//       const data = snap.docs.map((d) => ({
//         id: d.id,
//         source: "jobs",
//         is24h: false,
//         views: d.data().views || 0,
//         ...d.data(),
//         createdAt: d.data().created_at?.toDate?.() || null,   // 🔥 SAFETY FIX
//       }));
//       setJobs((prev) => [...prev.filter((j) => j.source !== "jobs"), ...data]);
//     });

//     const unsub2 = onSnapshot(qFast, (snap) => {
//       const data = snap.docs.map((d) => ({
//         id: d.id,
//         source: "jobs_24h",
//         is24h: true,
//         views: d.data().views || 0,
//         ...d.data(),
//         createdAt: d.data().created_at?.toDate?.() || null,   // 🔥 SAFETY FIX
//       }));
//       setJobs((prev) => [
//         ...prev.filter((j) => j.source !== "jobs_24h"),
//         ...data,
//       ]);
//     });

//     return () => {
//       unsub1();
//       unsub2();
//     };
//   }, []);

//   /* =========================
//      USER DATA
//   ========================= */
//   useEffect(() => {
//     if (!uid) return;
//     return onSnapshot(doc(db, "users", uid), (snap) => {
//       const data = snap.data() || {};
//       setSavedJobs(data.favoriteJobs || []);
//       setUserSkills(data.skills || []);
//     });
//   }, [uid]);

//   /* =========================
//      FILTER + SORT LOGIC ✅
//   ========================= */
//   const filteredJobs = useMemo(() => {
//     let list = jobs.filter((job) => {
//       // Tabs
//       if (selectedTab === 0 && job.source !== "jobs") return false;
//       if (selectedTab === 1 && job.source !== "jobs_24h") return false;
//       if (selectedTab === 2 && !savedJobs.includes(job.id)) return false;

//       // Search
//       if (
//         filters.searchQuery &&
//         !job.title?.toLowerCase().includes(filters.searchQuery.toLowerCase())
//       )
//         return false;

//       // Categories
//       if (
//         filters.categories.length &&
//         !filters.categories.includes(job.category)
//       )
//         return false;

//       // Skills
//       if (
//         filters.skills.length &&
//         !filters.skills.some((s) => job.skills?.includes(s))
//       )
//         return false;

//       // Budget
//       const budget = job.budget || 0;
//       if (
//         budget < filters.budgetRange.start ||
//         budget > filters.budgetRange.end
//       )
//         return false;

//       return true;
//     });

//     // Sort
//     if (filters.sortOption === JobSortOption.NEWEST)
//       list.sort((a, b) => b.createdAt - a.createdAt);

//     if (filters.sortOption === JobSortOption.AVAILABILITY)
//       list.sort((a, b) => a.views - b.views);

//     if (filters.sortOption === JobSortOption.BEST_MATCH)
//       list.sort(
//         (a, b) => matchScore(b, userSkills) - matchScore(a, userSkills)
//       );

//     return list;
//   }, [jobs, filters, selectedTab, savedJobs, userSkills]);

//   /* =========================
//      ACTIONS
//   ========================= */
//   const toggleSave = async (jobId) => {
//     if (!uid) return;
//     await updateDoc(doc(db, "users", uid), {
//       favoriteJobs: savedJobs.includes(jobId)
//         ? arrayRemove(jobId)
//         : arrayUnion(jobId),
//     });
//   };
//   /* =========================
//      UI
//   ========================= */
//   return (
//     <div
//       className="freelance-wrapper"
//       style={{
//         marginLeft: collapsed ? "-110px" : "90px",
//         transition: "margin-left 0.25s ease",
//         overflowX: "hidden",
//         maxWidth: "100vw",
//         boxSizing: "border-box",
//       }}
//     >
//       <div
//         className="job-search"
//         style={{
//           width: "100%",
//           overflowX: "hidden",
//           boxSizing: "border-box",
//         }}
//       >
//         <h2>Browse Projects</h2>

//         {/* ================= SEARCH + FILTER ================= */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 12,
//             flexWrap: "wrap",
//           }}
//         >
//           <input
//             placeholder="Search job"
//             value={filters.searchQuery}
//             onChange={(e) =>
//               setFilters({ ...filters, searchQuery: e.target.value })
//             }
//             style={{
//               width: "70%",
//               maxWidth: "90%",
//               padding: "10px 14px",
//               borderRadius: 10,
//               border: "1px solid #ddd",
//               outline: "none",
//             }}
//           />

//           <button
//             onClick={() => setShowFilter(true)}
//             style={{
//               padding: "10px 18px",
//               borderRadius: 10,
//               border: "none",
//               background: "#6D28D9",
//               color: "#fff",
//               cursor: "pointer",
//               fontWeight: 500,
//             }}
//           >
//             Filter
//           </button>
//         </div>

//         {/* ================= SORT ================= */}
//         <div className="sort" style={{ marginTop: 14 }}>
//           {Object.values(JobSortOption).map((opt) => (
//             <button
//               key={opt}
//               onClick={() => setFilters({ ...filters, sortOption: opt })}
//               className={filters.sortOption === opt ? "active" : ""}
//               style={{
//                 marginRight: 10,
//                 padding: "8px 14px",
//                 borderRadius: 999,
//                 border: "1px solid #ddd",
//                 background:
//                   filters.sortOption === opt ? "#000" : "transparent",
//                 color: filters.sortOption === opt ? "#fff" : "#000",
//                 cursor: "pointer",
//               }}
//             >
//               {opt}
//             </button>
//           ))}
//         </div>

//         {/* ================= TABS ================= */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             gap: 10,
//             padding: 10,
//             margin: "16px 10px",
//             borderRadius: 20,
//             boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
//           }}
//         >
//           {["Work", "24 Hours", "Saved"].map((t, i) => {
//             const isActive = selectedTab === i;

//             return (
//               <button
//                 key={i}
//                 onClick={() => setSelectedTab(i)}
//                 style={{
//                   border: "none",
//                   cursor: "pointer",
//                   padding: "9px 42px",
//                   borderRadius: 999,
//                   fontSize: 14,
//                   fontWeight: 500,
//                   background: isActive ? "#fff" : "transparent",
//                   boxShadow: isActive
//                     ? "0 6px 20px rgba(0,0,0,0.19)"
//                     : "none",
//                   transition: "all 0.25s ease",
//                 }}
//               >
//                 {t}
//               </button>
//             );
//           })}
//         </div>

//         {/* ================= JOB LIST ================= */}
//         <div
//           className="jobs"
//           style={{
//             width: "92%",
//             maxWidth: "100%",
//             overflowX: "hidden",
//           }}
//         >
//           {filteredJobs.length === 0 && (
//             <p style={{ opacity: 0.6 }}>No jobs found</p>
//           )}

//           {filteredJobs.map((job) => (
//             <div
//               key={job.id}
//               style={{
//                 marginTop: 20,
//                 background: "#fff",
//                 borderRadius: 20,
//                 padding: 22,
//                 marginBottom: 18,
//                 boxShadow: "0 0 6px rgba(0,0,0,0.15)",
//                 width: "82%",
//                 boxSizing: "border-box",
//               }}
//             >
//               {/* ===== TOP ROW ===== */}
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   gap: 16,
//                 }}
//               >
//                 <div>
//                   <div
//                     style={{
//                       fontSize: 15,
//                       fontWeight: 400,
//                       marginTop: 6,
//                       color: "#222",
//                     }}
//                   >
//                     {job.title}
//                   </div>
//                 </div>

//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 16,
//                   }}
//                 >
//                   <div>
//                     <div style={{ fontSize: 15 }}>Budget</div>
//                     <div style={{ marginTop: 4, fontSize: 13, fontWeight: 500, color: "rgba(124,60,255,1)" }}>
//                       ₹{job.budget_from} -   ₹{job.budget_to}
//                     </div>
//                   </div>

//                   <button
//                     onClick={() => toggleSave(job.id)}
//                     style={{
//                       background: "transparent",
//                       border: "none",
//                       cursor: "pointer",
//                     }}
//                   >
//                     <img
//                       src={savedJobs.includes(job.id) ? saved : save}
//                       alt="save"
//                       width={20}
//                     />
//                   </button>
//                 </div>
//               </div>

//               {/* ===== SKILLS ===== */}
//               <div style={{ marginTop: 14 }}>
//                 <div style={{ fontSize: 13, color: "#555" }}>
//                   Skills Required
//                 </div>

//                 <div
//                   style={{
//                     display: "flex",
//                     gap: 8,
//                     flexWrap: "wrap",
//                     marginTop: 6,
//                   }}
//                 >
//                   {job.skills?.slice(0, 3).map((s) => (
//                     <span
//                       key={s}
//                       style={{
//                         background: "#FFF3A0",
//                         padding: "6px 12px",
//                         borderRadius: 999,
//                         fontSize: 12,
//                         fontWeight: 500,
//                       }}
//                     >
//                       {s}
//                     </span>
//                   ))}

//                   {job.skills?.length > 3 && (
//                     <span
//                       style={{
//                         background: "#FFF3A0",
//                         padding: "6px 12px",
//                         borderRadius: 999,
//                         fontSize: 12,
//                         fontWeight: 500,
//                       }}
//                     >
//                       4+
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* ===== DESCRIPTION ===== */}
//               <p
//                 style={{
//                   marginTop: 14,
//                   fontSize: 14,
//                   color: "#444",
//                   lineHeight: 1.6,
//                 }}
//               >
//                 {job.description}
//               </p>

//               {/* ===== FOOTER ===== */}
//               <div
//                 style={{
//                   marginTop: 16,
//                   display: "flex",
//                   gap: 16,
//                   fontSize: 12,
//                   color: "#666",
//                 }}
//               >
//                 <span>
//                   <img src={eye} width={14} /> {job.views} Impression
//                 </span>
//                 <span>
//                   <img src={clock} width={14} /> {timeAgo(job.createdAt)}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>

//       </div>
//       {/* ================= FILTER POPUP ================= */}
//       {showFilter && (
//         <JobFiltersFullScreen
//           currentFilters={filters}
//           onApply={(newFilters) => {
//             setFilters((prev) => ({
//               ...prev,
//               ...newFilters,
//             }));
//           }}
//           onClose={() => setShowFilter(false)}
//         />
//       )}

//     </div>
//   );

// }






// import React, { useEffect, useMemo, useState } from "react";
// import JobFiltersFullScreen from "./FreelancerFilter";
// import {
//  collection,
//  doc,
//  onSnapshot,
//  orderBy,
//  query,
//  updateDoc,
//  arrayUnion,
//  arrayRemove,
// } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { db } from "../../firbase/Firebase";

// import search from "../../assets/search.png"; // 🔥 FIXED
// import eye from "../../assets/eye.png";
// import clock from "../../assets/clock.png";
// import saved from "../../assets/save.png";
// import save from "../../assets/save2.png";
// import { useNavigate } from "react-router-dom";



// const JobSortOption = {
//  BEST_MATCH: "bestMatch",
//  NEWEST: "newest",
//  AVAILABILITY: "availability",
// };

// /* =========================
//  DEFAULT FILTERS
// ========================= */
// const defaultFilters = {
//  searchQuery: "",
//  categories: [],
//  skills: [],
//  postingTime: "",
//  budgetRange: { start: 0, end: 100000 },
//  sortOption: JobSortOption.BEST_MATCH,
// };

// /* =========================
//  HELPERS
// ========================= */
// const formatCurrency = (amount = 0) => {
//  if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`;
//  if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
//  return amount;
// };

// const timeAgo = (date) => {
//  if (!date) return "";
//  const diff = Date.now() - date.getTime();
//  const mins = Math.floor(diff / 60000);
//  if (mins < 60) return `${mins}m ago`;
//  const hrs = Math.floor(mins / 60);
//  if (hrs < 24) return `${hrs}h ago`;
//  return `${Math.floor(hrs / 24)}d ago`;
// };

// const matchScore = (job, userSkills) => {
//  let score = 0;
//  job.skills?.forEach((s) => userSkills.includes(s) && (score += 3));
//  userSkills.includes(job.category) && (score += 2);
//  return score;
// };

// export default function ExploreFreelancer() {
//  const auth = getAuth();
//  const uid = auth.currentUser?.uid;

//  const [jobs, setJobs] = useState([]);
//  const [savedJobs, setSavedJobs] = useState([]);
//  const [userSkills, setUserSkills] = useState([]);

//  const [filters, setFilters] = useState(defaultFilters);
//  const [selectedTab, setSelectedTab] = useState(0);
//  const [showFilter, setShowFilter] = useState(false);
//  const navigate = useNavigate();





//  // 🔥 MISSING STATE ADDED
//  const [collapsed, setCollapsed] = useState(
//  localStorage.getItem("sidebar-collapsed") === "true"
//  );

//  console.log(jobs)

//  /* =========================
//  JOB STREAMS
//  ========================= */
//  useEffect(() => {
//  const qJobs = query(collection(db, "jobs"), orderBy("created_at", "desc"));
//  const qFast = query(
//  collection(db, "jobs_24h"),
//  orderBy("created_at", "desc")
//  );

//  const unsub1 = onSnapshot(qJobs, (snap) => {
//  const data = snap.docs.map((d) => ({
//  id: d.id,
//  source: "jobs",
//  is24h: false,
//  views: d.data().views || 0,
//  ...d.data(),
//  createdAt: d.data().created_at?.toDate?.() || null, // 🔥 SAFETY FIX
//  }));
//  setJobs((prev) => [...prev.filter((j) => j.source !== "jobs"), ...data]);
//  });

//  const unsub2 = onSnapshot(qFast, (snap) => {
//  const data = snap.docs.map((d) => ({
//  id: d.id,
//  source: "jobs_24h",
//  is24h: true,
//  views: d.data().views || 0,
//  ...d.data(),
//  createdAt: d.data().created_at?.toDate?.() || null, // 🔥 SAFETY FIX
//  }));
//  setJobs((prev) => [
//  ...prev.filter((j) => j.source !== "jobs_24h"),
//  ...data,
//  ]);
//  });

//  return () => {
//  unsub1();
//  unsub2();
//  };
//  }, []);

//  useEffect(() => {
//  if (!uid) return;
//  return onSnapshot(doc(db, "users", uid), (snap) => {
//  const data = snap.data() || {};
//  setSavedJobs(data.favoriteJobs || []);
//  setUserSkills(data.skills || []);
//  });
//  }, [uid]);


//  const filteredJobs = useMemo(() => {
//  let list = jobs.filter((job) => {
//  // Tabs
//  if (selectedTab === 0 && job.source !== "jobs") return false;
//  if (selectedTab === 1 && job.source !== "jobs_24h") return false;
//  if (selectedTab === 2 && !savedJobs.includes(job.id)) return false;

//  // Search
//  if (
//  filters.searchQuery &&
//  !job.title?.toLowerCase().includes(filters.searchQuery.toLowerCase())
//  )
//  return false;

//  // Categories
//  if (
//  filters.categories.length &&
//  !filters.categories.includes(job.category)
//  )
//  return false;

//  // Skills
//  if (
//  filters.skills.length &&
//  !filters.skills.some((s) => job.skills?.includes(s))
//  )
//  return false;

//  // Budget
//  const budget = job.budget || 0;
//  if (
//  budget < filters.budgetRange.start ||
//  budget > filters.budgetRange.end
//  )
//  return false;

//  return true;
//  });

//  // Sort
//  if (filters.sortOption === JobSortOption.NEWEST)
//  list.sort((a, b) => b.createdAt - a.createdAt);

//  if (filters.sortOption === JobSortOption.AVAILABILITY)
//  list.sort((a, b) => a.views - b.views);

//  if (filters.sortOption === JobSortOption.BEST_MATCH)
//  list.sort(
//  (a, b) => matchScore(b, userSkills) - matchScore(a, userSkills)
//  );

//  return list;
//  }, [jobs, filters, selectedTab, savedJobs, userSkills]);

//  const toggleSave = async (jobId) => {
//  if (!uid) return;
//  await updateDoc(doc(db, "users", uid), {
//  favoriteJobs: savedJobs.includes(jobId)
//  ? arrayRemove(jobId)
//  : arrayUnion(jobId),
//  });
//  };

//  return (
//  <div
//  className="freelance-wrapper"
//  style={{
//  marginLeft: collapsed ? "-110px" : "90px",
//  transition: "margin-left 0.25s ease",
//  overflowX: "hidden",
//  maxWidth: "100vw",
//  boxSizing: "border-box",
//  }}
//  >
//  <div
//  className="job-search"
//  style={{
//  width: "100%",
//  overflowX: "hidden",
//  boxSizing: "border-box",
//  }}
//  >
//  <h2>Browse Projects</h2>

//  {/* ================= SEARCH + FILTER ================= */}
//  <div
//  style={{
//  display: "flex",
//  alignItems: "center",
//  gap: 12,
//  flexWrap: "wrap",
//  }}
//  >
//  <input
//  placeholder="Search job"
//  value={filters.searchQuery}
//  onChange={(e) =>
//  setFilters({ ...filters, searchQuery: e.target.value })
//  }
//  style={{
//  width: "70%",
//  maxWidth: "90%",
//  padding: "10px 14px",
//  borderRadius: 10,
//  border: "1px solid #ddd",
//  outline: "none",
//  }}
//  />

//  <button
//  onClick={() => setShowFilter(true)}
//  style={{
//  padding: "10px 18px",
//  borderRadius: 10,
//  border: "none",
//  background: "#6D28D9",
//  color: "#fff",
//  cursor: "pointer",
//  fontWeight: 500,
//  }}
//  >
//  Filter
//  </button>
//  </div>

//  {/* ================= SORT ================= */}
//  <div className="sort" style={{ marginTop: 14 }}>
//  {Object.values(JobSortOption).map((opt) => (
//  <button
//  key={opt}
//  onClick={() => setFilters({ ...filters, sortOption: opt })}
//  className={filters.sortOption === opt ? "active" : ""}
//  style={{
//  marginRight: 10,
//  padding: "8px 14px",
//  borderRadius: 999,
//  border: "1px solid #ddd",
//  background:
//  filters.sortOption === opt ? "#000" : "transparent",
//  color: filters.sortOption === opt ? "#fff" : "#000",
//  cursor: "pointer",
//  }}
//  >
//  {opt}
//  </button>
//  ))}
//  </div>

//  {/* ================= TABS ================= */}
//  <div
//  style={{
//  display: "flex",
//  justifyContent: "center",
//  gap: 10,
//  padding: 10,
//  margin: "16px 10px",
//  borderRadius: 20,
//  boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
//  }}
//  >
//  {["Work", "24 Hours", "Saved"].map((t, i) => {
//  const isActive = selectedTab === i;

//  return (
//  <button
//  key={i}
//  onClick={() => setSelectedTab(i)}
//  style={{
//  border: "none",
//  cursor: "pointer",
//  padding: "9px 42px",
//  borderRadius: 999,
//  fontSize: 14,
//  fontWeight: 500,
//  background: isActive ? "#fff" : "transparent",
//  boxShadow: isActive
//  ? "0 6px 20px rgba(0,0,0,0.19)"
//  : "none",
//  transition: "all 0.25s ease",
//  }}
//  >
//  {t}
//  </button>
//  );
//  })}
//  </div>

//  {/* ================= JOB LIST ================= */}
//  <div
//  className="jobs"
//  style={{
//  width: "92%",
//  maxWidth: "100%",
//  overflowX: "hidden",
//  }}
//  >
//  {filteredJobs.length === 0 && (
//  <p style={{ opacity: 0.6 }}>No jobs found</p>
//  )}

//  {filteredJobs.map((job) => (
//  <div
//  key={job.id}
//  onClick={()=>navigate(`/freelance-dashboard/job-full/${job.id}`, { state: job })}
//  style={{
//  marginTop: 20,
//  background: "#fff",
//  borderRadius: 20,
//  padding: 22,
//  marginBottom: 18,
//  boxShadow: "0 0 6px rgba(0,0,0,0.15)",
//  width: "82%",
//  boxSizing: "border-box",
//  }}
//  >
//  {/* ===== TOP ROW ===== */}
//  <div
//  style={{
//  display: "flex",
//  justifyContent: "space-between",
//  gap: 16,
//  }}
//  >
//  <div>
//  <div
//  style={{
//  fontSize: 15,
//  fontWeight: 400,
//  marginTop: 6,
//  color: "#222",
//  }}
//  >
//  {job.title}
//  </div>
//  </div>

//  <div
//  style={{
//  display: "flex",
//  alignItems: "center",
//  gap: 16,
//  }}
//  >
//  <div style={{ fontWeight: 500 }}>
//  ₹ {formatCurrency(job.budget_from)} / day
//  </div>

//  <button
//  onClick={() => toggleSave(job.id)}
//  style={{
//  background: "transparent",
//  border: "none",
//  cursor: "pointer",
//  }}
//  >
//  <img
//  src={savedJobs.includes(job.id) ? saved : save}
//  alt="save"
//  width={20}
//  />
//  </button>
//  </div>
//  </div>

//  {/* ===== SKILLS ===== */}
//  <div style={{ marginTop: 14 }}>
//  <div style={{ fontSize: 13, color: "#555" }}>
//  Skills Required
//  </div>

//  <div
//  style={{
//  display: "flex",
//  gap: 8,
//  flexWrap: "wrap",
//  marginTop: 6,
//  }}
//  >
//  {job.skills?.slice(0, 3).map((s) => (
//  <span
//  key={s}
//  style={{
//  background: "#FFF3A0",
//  padding: "6px 12px",
//  borderRadius: 999,
//  fontSize: 12,
//  fontWeight: 500,
//  }}
//  >
//  {s}
//  </span>
//  ))}

//  {job.skills?.length > 3 && (
//  <span
//  style={{
//  background: "#FFF3A0",
//  padding: "6px 12px",
//  borderRadius: 999,
//  fontSize: 12,
//  fontWeight: 500,
//  }}
//  >
//  4+
//  </span>
//  )}
//  </div>
//  </div>

//  {/* ===== DESCRIPTION ===== */}
//  <p
//  style={{
//  marginTop: 14,
//  fontSize: 14,
//  color: "#444",
//  lineHeight: 1.6,
//  }}
//  >
//  {job.description}
//  </p>

//  {/* ===== FOOTER ===== */}
//  <div
//  style={{
//  marginTop: 16,
//  display: "flex",
//  gap: 16,
//  fontSize: 12,
//  color: "#666",
//  }}
//  >
//  <span>
//  <img src={eye} width={14} /> {job.views} Impression
//  </span>
//  <span>
//  <img src={clock} width={14} /> {timeAgo(job.createdAt)}
//  </span>
//  </div>
//  </div>
//  ))}
//  </div>

//  </div>
//  {/* ================= FILTER POPUP ================= */}
//  {showFilter && (
//  <JobFiltersFullScreen
//  currentFilters={filters}
//  onApply={(newFilters) => {
//  setFilters((prev) => ({
//  ...prev,
//  ...newFilters,
//  }));
//  }}
//  onClose={() => setShowFilter(false)}
//  />
//  )}

//  </div>
//  );

// }








// import React, { useEffect, useMemo, useState } from "react";
// import JobFiltersFullScreen from "./FreelancerFilter";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   orderBy,
//   query,
//   updateDoc,
//   arrayUnion,
//   arrayRemove,
// } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { db } from "../../firbase/Firebase";

// import search from "../../assets/search.png"; // 🔥 FIXED
// import eye from "../../assets/eye.png";
// import clock from "../../assets/clock.png";
// import saved from "../../assets/save.png";
// import save from "../../assets/save2.png";
// import backarrow from "../../assets/backarrow.png";
// import { useNavigate } from "react-router-dom";



// const JobSortOption = {
//   BEST_MATCH: "bestMatch",
//   NEWEST: "newest",
//   AVAILABILITY: "availability",
// };


// const defaultFilters = {
//   searchQuery: "",
//   categories: [],
//   skills: [],
//   postingTime: "",
//   budgetRange: { start: 0, end: 100000 },
//   sortOption: JobSortOption.BEST_MATCH,
// };


// const formatCurrency = (amount = 0) => {
//   if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`;
//   if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
//   return amount;
// };

// const timeAgo = (date) => {
//   if (!date) return "";
//   const diff = Date.now() - date.getTime();
//   const mins = Math.floor(diff / 60000);
//   if (mins < 60) return `${mins}m ago`;
//   const hrs = Math.floor(mins / 60);
//   if (hrs < 24) return `${hrs}h ago`;
//   return `${Math.floor(hrs / 24)}d ago`;
// };

// const matchScore = (job, userSkills) => {
//   let score = 0;
//   job.skills?.forEach((s) => userSkills.includes(s) && (score += 3));
//   userSkills.includes(job.category) && (score += 2);
//   return score;
// };

// export default function ExploreFreelancer() {
//   const auth = getAuth();
//   const uid = auth.currentUser?.uid;

//   const [jobs, setJobs] = useState([]);
//   const [savedJobs, setSavedJobs] = useState([]);
//   const [userSkills, setUserSkills] = useState([]);

//   const [filters, setFilters] = useState(defaultFilters);
//   const [selectedTab, setSelectedTab] = useState(0);
//   const [showFilter, setShowFilter] = useState(false);
//   const navigate = useNavigate();
//   const [showSort, setShowSort] = useState(false);
//   const [unreadMsgCount, setUnreadMsgCount] = useState(0);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);



//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   console.log(jobs)

//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);


//   useEffect(() => {
//     const qJobs = query(collection(db, "jobs"), orderBy("created_at", "desc"));
//     const qFast = query(
//       collection(db, "jobs_24h"),
//       orderBy("created_at", "desc")
//     );

//     const unsub1 = onSnapshot(qJobs, (snap) => {
//       const data = snap.docs.map((d) => ({
//         id: d.id,
//         source: "jobs",
//         is24h: false,
//         views: d.data().views || 0,
//         ...d.data(),
//         createdAt: d.data().created_at?.toDate?.() || null, // 🔥 SAFETY FIX
//       }));
//       setJobs((prev) => [...prev.filter((j) => j.source !== "jobs"), ...data]);
//     });

//     const unsub2 = onSnapshot(qFast, (snap) => {
//       const data = snap.docs.map((d) => ({
//         id: d.id,
//         source: "jobs_24h",
//         is24h: true,
//         views: d.data().views || 0,
//         ...d.data(),
//         createdAt: d.data().created_at?.toDate?.() || null, // 🔥 SAFETY FIX
//       }));
//       setJobs((prev) => [
//         ...prev.filter((j) => j.source !== "jobs_24h"),
//         ...data,
//       ]);
//     });

//     return () => {
//       unsub1();
//       unsub2();
//     };
//   }, []);

//   useEffect(() => {
//     if (!uid) return;
//     return onSnapshot(doc(db, "users", uid), (snap) => {
//       const data = snap.data() || {};
//       setSavedJobs(data.favoriteJobs || []);
//       setUserSkills(data.skills || []);
//     });
//   }, [uid]);

//   useEffect(() => {
//     if (!user) return;

//     const q = query(
//       collection(db, "chats"),
//       where("members", "array-contains", user.uid)
//     );

//     return onSnapshot(q, snap => {
//       let count = 0;
//       snap.forEach(d => {
//         const data = d.data();
//         count += data.unread?.[user.uid] || 0;
//       });
//       setUnreadMsgCount(count);
//     });
//   }, [user]);


//   const filteredJobs = jobs.filter((job) => {
//     // Budget overlap logic
//     const jobMin = Number(job.budget_from) || 0;
//     const jobMax = Number(job.budget_to) || 0;

//     const filterMin = filters.budgetRange.start;
//     const filterMax = filters.budgetRange.end;

//     // ❌ No overlap → remove job
//     if (jobMax < filterMin || jobMin > filterMax) return false;

//     // Category filter
//     if (
//       filters.categories.length &&
//       !filters.categories.includes(job.category)
//     ) {
//       return false;
//     }

//     // Skills filter
//     if (
//       filters.skills.length &&
//       !filters.skills.some((s) => job.skills?.includes(s))
//     ) {
//       return false;
//     }

//     // Posting time filter (optional)
//     if (filters.postingTime) {
//       const postedAt = job.createdAt?.toMillis?.() || job.createdAt;
//       const now = Date.now();

//       const daysMap = {
//         "Posted Today": 1,
//         "Last 3 Days": 3,
//         "Last 7 Days": 7,
//         "Last 30 Days": 30,
//       };

//       const limitDays = daysMap[filters.postingTime];
//       if (limitDays) {
//         const diffDays = (now - postedAt) / (1000 * 60 * 60 * 24);
//         if (diffDays > limitDays) return false;
//       }
//     }

//     return true;
//   });
//   const [notifications, setNotifications] = useState([]);
// const [notifCount, setNotifCount] = useState(0);

// useEffect(() => {
//   if (!user) return;

//   const q = query(
//     collection(db, "notifications"),
//     where("freelancerId", "==", user.uid)
//   );

//   return onSnapshot(q, snap => {
//     const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
//     setNotifications(items);
//     setNotifCount(items.filter(n => !n.read).length);
//   });
// }, [user]);


// const handleNotificationClick = async (notif) => {
//   if (!notif.read) {
//     await updateDoc(doc(db, "notifications", notif.id), { read: true });
//   }

//   setNotifOpen(false);

//   if (notif.type === "job") {
//     navigate(`/freelance-dashboard/job-full/${notif.jobId}`);
//   }

//   if (notif.type === "message") {
//     navigate("/freelance-dashboard/freelancermessages", {
//       state: { otherUid: notif.clientUid },
//     });
//   }
// };


//   const toggleSave = async (jobId) => {
//     if (!uid) return;
//     await updateDoc(doc(db, "users", uid), {
//       favoriteJobs: savedJobs.includes(jobId)
//         ? arrayRemove(jobId)
//         : arrayUnion(jobId),
//     });
//   };

//   return (
//     <div
//       className="freelance-wrapper"
//       style={{
//         marginLeft: collapsed ? "-20px" : "210px",
//         transition: "margin-left 0.25s ease",
//         overflowX: "hidden",
//         maxWidth: "100vw",
//         boxSizing: "border-box",
//         marginTop: "40px",
//         width: "80%",
//       }}
//     >
//       <div
//         className="job-search"
//         style={{
//           width: "100%",
//           overflowX: "hidden",
//           boxSizing: "border-box",

//         }}
//       >
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
//               alt="Back"
//               style={{
//                 width: 16,
//                 height: 18,
//                 objectFit: "contain",
//               }}
//             />
//           </div>

//           <div>
//             <div style={{ fontSize: 32, fontWeight: 400 }}>
//               Explore Freelancer
//             </div>
//           </div>
//         </div>
//         <div className="icon-wrapper" onClick={() => navigate("/freelance-dashboard/freelancermessages")}>
//           <img src={message} style={{ width: 28 }} />
//           {unreadMsgCount > 0 && <span className="dot" />}
//         </div>
//         <div className="fh-avatar" onClick={() => navigate("/freelance-dashboard/Profilebuilder")}>
//           <img src={userInfo.profileImage || profile} />
//         </div>
// {notifOpen && (
//   <div className="notif-dropdown">
//     {notifications.length === 0 && <p>No notifications</p>}

//     {notifications.map(n => (
//       <div
//         key={n.id}
//         className={`notif-item ${!n.read ? "unread" : ""}`}
//         onClick={() => handleNotificationClick(n)}
//       >
//         <div className="notif-title">{n.title}</div>
//         <div className="notif-body">{n.body}</div>
//         <div className="notif-time">{timeAgo(n.timestamp)}</div>
//       </div>
//     ))}
//   </div>
// )}


//         <div className="icon-wrapper">
//   <img
//     src={notification}
//     style={{ width: 32 }}
//     onClick={() => setNotifOpen(p => !p)}
//   />
//   {notifCount > 0 && <span className="dot" />}
// </div>





//         {/* ================= SEARCH + FILTER ================= */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 10,
//             flexWrap: "wrap",
//             width: "100%",
//             marginLeft: isMobile ? "10px" : "0px",
//             marginTop: "20px"
//           }}
//         >
//           <input
//             placeholder="Search job"
//             value={filters.searchQuery}
//             onChange={(e) =>
//               setFilters({ ...filters, searchQuery: e.target.value })
//             }
//             style={{
//               flex: "1 1 220px",                         // 🔥 mobile flexible
//               width: "100%",
//               maxWidth: "80%",
//               padding: "clamp(9px, 3vw, 10px) 14px",     // 🔥 responsive padding
//               borderRadius: 10,
//               marginLeft: "-30",
//               border: "1px solid #ddd",
//               outline: "none",
//               fontSize: "clamp(13px, 3.5vw, 14px)",      // 🔥 mobile font
//             }}
//           />

//           <button
//             onClick={() => setShowFilter(true)}
//             style={{
//               flex: "0 0 auto",
//               padding: "clamp(9px, 3vw, 10px) clamp(14px, 5vw, 18px)",
//               borderRadius: 10,
//               border: "none",
//               background: "#6D28D9",
//               color: "#fff",
//               cursor: "pointer",
//               fontWeight: 500,
//               whiteSpace: "nowrap",
//             }}
//           >
//             Filter
//           </button>
//         </div>


//         {/* ================= SORT ================= */}
//         <button
//           onClick={() => setShowSort(!showSort)}
//           style={{
//             padding: "8px 16px",
//             borderRadius: "999px",
//             border: "1px solid #ddd",
//             background: "#fff",
//             cursor: "pointer",
//             fontWeight: 500,
//           }}
//         >
//           Sort
//         </button>

//         {showSort && (
//           <div
//             className="sort"
//             style={{
//               marginTop: 14,
//               display: "flex",
//               gap: 10,
//               flexWrap: "nowrap",
//               overflowX: "auto",
//               paddingBottom: 4,
//               background: "#fff",
//               padding: "12px",
//               borderRadius: "14px",
//               boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
//               maxWidth: "100%",
//             }}
//           >
//             {Object.values(JobSortOption).map((opt) => (
//               <button
//                 key={opt}
//                 onClick={() => {
//                   setFilters({ ...filters, sortOption: opt });
//                   setShowSort(false); // 👈 select pannina apram close
//                 }}
//                 style={{
//                   padding: "8px 14px",
//                   borderRadius: 999,
//                   border: "1px solid #ddd",
//                   background:
//                     filters.sortOption === opt ? "#6D28D9" : "transparent",
//                   color:
//                     filters.sortOption === opt ? "#fff" : "#6D28D9",
//                   cursor: "pointer",
//                   fontSize: "clamp(12px, 3.5vw, 14px)",
//                   whiteSpace: "nowrap",
//                   flexShrink: 0,
//                 }}
//               >
//                 {opt}
//               </button>
//             ))}
//           </div>
//         )}


//         {/* ================= TABS ================= */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             gap: 8,
//             padding: "clamp(6px, 2.5vw, 8px)",      // 🔥 mobile padding
//             margin: "12px auto",
//             borderRadius: 16,
//             boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
//             width: "90%",                          // 🔥 mobile full width
//             maxWidth: 1540,
//             marginLeft: "10px",                          // 🔥 desktop limit
//             overflowX: "auto",                      // 🔥 mobile scroll safe
//           }}
//         >
//           {["Work", "24 Hours", "Saved"].map((t, i) => {
//             const isActive = selectedTab === i;

//             return (
//               <button
//                 key={i}
//                 onClick={() => setSelectedTab(i)}
//                 style={{
//                   border: "none",
//                   cursor: "pointer",
//                   padding: "clamp(8px, 3vw, 10px) clamp(18px, 6vw, 42px)", // 🔥 responsive
//                   borderRadius: 999,
//                   fontSize: "clamp(12px, 3.5vw, 14px)",                  // 🔥
//                   fontWeight: 500,
//                   whiteSpace: "nowrap",                                  // 🔥 no wrap
//                   background: isActive ? "#fff" : "transparent",
//                   boxShadow: isActive
//                     ? "0 6px 20px rgba(0,0,0,0.19)"
//                     : "none",
//                   transition: "all 0.25s ease",
//                   flexShrink: 0,                                         // 🔥 keep size
//                 }}
//               >
//                 {t}
//               </button>
//             );
//           })}
//         </div>


//         {/* ================= JOB LIST ================= */}
//         <div
//           className="jobs"
//           style={{
//             width: "99%",
//             maxWidth: "100%",
//             overflowX: "hidden",
//             marginLeft: isMobile ? "30px" : "0px"
//           }}
//         >
//           {filteredJobs.length === 0 && (
//             <p style={{ opacity: 0.6 }}>No jobs found</p>
//           )}

//           {filteredJobs.map((job) => (

//             <div
//               key={job.id}
//               onClick={() => navigate(`/freelance-dashboard/job-full/${job.id}`, { state: job })}
//               style={{
//                 marginTop: 20,
//                 background: "#fff",
//                 marginLeft: "10px",
//                 borderRadius: 20,
//                 padding: 22,
//                 marginBottom: 18,
//                 boxShadow: "0 0 6px rgba(0,0,0,0.15)",
//                 width: "81.5%",
//                 boxSizing: "border-box",
//               }}
//             >
//               {/* ===== TOP ROW ===== */}
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   gap: 16,
//                 }}
//               >
//                 <div>
//                   <div
//                     style={{
//                       fontSize: 15,
//                       fontWeight: 400,
//                       marginTop: 6,
//                       color: "#222",
//                     }}
//                   >
//                     {job.title}
//                   </div>
//                 </div>

//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 16,
//                   }}
//                 >
//                   <div style={{ fontWeight: 500 }}>
//                     ₹ {formatCurrency(job.budget_from)} / day
//                   </div>

//                   <button
//                     onClick={() => toggleSave(job.id)}
//                     style={{
//                       background: "transparent",
//                       border: "none",
//                       cursor: "pointer",
//                     }}
//                   >
//                     <img
//                       src={savedJobs.includes(job.id) ? saved : save}
//                       alt="save"
//                       width={20}
//                     />
//                   </button>
//                 </div>
//               </div>

//               {/* ===== SKILLS ===== */}
//               <div style={{ marginTop: 14 }}>
//                 <div style={{ fontSize: 13, color: "#555" }}>
//                   Skills Required
//                 </div>

//                 <div
//                   style={{
//                     display: "flex",
//                     gap: 8,
//                     flexWrap: "wrap",
//                     marginTop: 6,
//                   }}
//                 >
//                   {job.skills?.slice(0, 3).map((s) => (
//                     <span
//                       key={s}
//                       style={{
//                         background: "#FFF3A0",
//                         padding: "6px 12px",
//                         borderRadius: 999,
//                         fontSize: 12,
//                         fontWeight: 500,
//                       }}
//                     >
//                       {s}
//                     </span>
//                   ))}

//                   {job.skills?.length > 3 && (
//                     <span
//                       style={{
//                         background: "#FFF3A0",
//                         padding: "6px 12px",
//                         borderRadius: 999,
//                         fontSize: 12,
//                         fontWeight: 500,
//                       }}
//                     >
//                       4+
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* ===== DESCRIPTION ===== */}
//               <p
//                 style={{
//                   marginTop: 14,
//                   fontSize: 14,
//                   color: "#444",
//                   lineHeight: 1.6,
//                 }}
//               >
//                 {job.description}
//               </p>

//               {/* ===== FOOTER ===== */}
//               <div
//                 style={{
//                   marginTop: 16,
//                   display: "flex",
//                   gap: 16,
//                   fontSize: 12,
//                   color: "#666",
//                 }}
//               >
//                 <span>
//                   <img src={eye} width={14} /> {job.views} Impression
//                 </span>
//                 <span>
//                   <img src={clock} width={14} /> {timeAgo(job.createdAt)}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>

//       </div>
//       {/* ================= FILTER POPUP ================= */}
//       {showFilter && (
//         <JobFiltersFullScreen
//           currentFilters={filters}
//           onApply={(newFilters) => {
//             setFilters((prev) => ({
//               ...prev,
//               ...newFilters,
//             }));
//           }}
//           onClose={() => setShowFilter(false)}
//         />
//       )}

//     </div>
//   );

// }




// import React, { useEffect, useMemo, useState } from "react";
// import JobFiltersFullScreen from "./FreelancerFilter";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   orderBy,
//   query,
//   updateDoc,
//   arrayUnion,
//   arrayRemove,
//   where,
// } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { db } from "../../firbase/Firebase";

// import search from "../../assets/search.png";
// import eye from "../../assets/eye.png";
// import clock from "../../assets/clock.png";
// import saved from "../../assets/save.png";
// import save from "../../assets/save2.png";
// import backarrow from "../../assets/backarrow.png";
// import message from "../../assets/message.png"; // ✅ ADD THIS
// import notification from "../../assets/notification.png"; // ✅ ADD THIS
// import profile from "../../assets/profile.png"; // ✅ ADD THIS
// import Filter from "../../assets/Filter.png"; // ✅ ADD THIS
// import sort from "../../assets/sort.png"; // ✅ ADD THIS
// import { useNavigate } from "react-router-dom";

// const JobSortOption = {
//   BEST_MATCH: "bestMatch",
//   NEWEST: "newest",
//   AVAILABILITY: "availability",
// };

// const defaultFilters = {
//   searchQuery: "",
//   categories: [],
//   skills: [],
//   postingTime: "",
//   budgetRange: { start: 0, end: 100000 },
//   sortOption: JobSortOption.BEST_MATCH,
// };

// const formatCurrency = (amount = 0) => {
//   if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`;
//   if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
//   return amount;
// };

// const timeAgo = (date) => {
//   if (!date) return "";
//   const diff = Date.now() - date.getTime();
//   const mins = Math.floor(diff / 60000);
//   if (mins < 60) return `${mins}m ago`;
//   const hrs = Math.floor(mins / 60);
//   if (hrs < 24) return `${hrs}h ago`;
//   return `${Math.floor(hrs / 24)}d ago`;
// };

// const matchScore = (job, userSkills) => {
//   let score = 0;
//   job.skills?.forEach((s) => userSkills.includes(s) && (score += 3));
//   userSkills.includes(job.category) && (score += 2);
//   return score;
// };

// export default function ExploreFreelancer() {
//   const auth = getAuth();
//   const uid = auth.currentUser?.uid;
//   const user = auth.currentUser; // ✅ FIXED

//   const [jobs, setJobs] = useState([]);
//   const [savedJobs, setSavedJobs] = useState([]);
//   const [userSkills, setUserSkills] = useState([]);
//   const [userInfo, setUserInfo] = useState({}); // ✅ FIXED

//   const [filters, setFilters] = useState(defaultFilters);
//   const [selectedTab, setSelectedTab] = useState(0);
//   const [showFilter, setShowFilter] = useState(false);
//   const navigate = useNavigate();
//   const [showSort, setShowSort] = useState(false);
//   const [unreadMsgCount, setUnreadMsgCount] = useState(0);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//   const [notifications, setNotifications] = useState([]);
//   const [notifCount, setNotifCount] = useState(0);
//   const [notifOpen, setNotifOpen] = useState(false); // ✅ FIXED

//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   console.log(jobs);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   // ✅ JOBS LISTENER
//   useEffect(() => {
//     const qJobs = query(collection(db, "jobs"), orderBy("created_at", "desc"));
//     const qFast = query(
//       collection(db, "jobs_24h"),
//       orderBy("created_at", "desc")
//     );

//     const unsub1 = onSnapshot(qJobs, (snap) => {
//       const data = snap.docs.map((d) => ({
//         id: d.id,
//         source: "jobs",
//         is24h: false,
//         views: d.data().views || 0,
//         ...d.data(),
//         createdAt: d.data().created_at?.toDate?.() || null,
//       }));
//       setJobs((prev) => [...prev.filter((j) => j.source !== "jobs"), ...data]);
//     });

//     const unsub2 = onSnapshot(qFast, (snap) => {
//       const data = snap.docs.map((d) => ({
//         id: d.id,
//         source: "jobs_24h",
//         is24h: true,
//         views: d.data().views || 0,
//         ...d.data(),
//         createdAt: d.data().created_at?.toDate?.() || null,
//       }));
//       setJobs((prev) => [
//         ...prev.filter((j) => j.source !== "jobs_24h"),
//         ...data,
//       ]);
//     });

//     return () => {
//       unsub1();
//       unsub2();
//     };
//   }, []);

//   // ✅ USER DATA LISTENER
//   useEffect(() => {
//     if (!uid) return;
//     return onSnapshot(doc(db, "users", uid), (snap) => {
//       const data = snap.data() || {};
//       setSavedJobs(data.favoriteJobs || []);
//       setUserSkills(data.skills || []);
//       setUserInfo(data); // ✅ FIXED
//     });
//   }, [uid]);

//   // ✅ UNREAD MESSAGES LISTENER
//   useEffect(() => {
//     if (!user) return;

//     const q = query(
//       collection(db, "chats"),
//       where("members", "array-contains", user.uid)
//     );

//     return onSnapshot(q, (snap) => {
//       let count = 0;
//       snap.forEach((d) => {
//         const data = d.data();
//         count += data.unread?.[user.uid] || 0;
//       });
//       setUnreadMsgCount(count);
//     });
//   }, [user]);

//   // ✅ NOTIFICATIONS LISTENER
//   useEffect(() => {
//     if (!user) return;

//     const q = query(
//       collection(db, "notifications"),
//       where("freelancerId", "==", user.uid)
//     );

//     return onSnapshot(q, (snap) => {
//       const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setNotifications(items);
//       setNotifCount(items.filter((n) => !n.read).length);
//     });
//   }, [user]);

//   // ✅ NOTIFICATION CLICK HANDLER
//   const handleNotificationClick = async (notif) => {
//     if (!notif.read) {
//       await updateDoc(doc(db, "notifications", notif.id), { read: true });
//     }

//     setNotifOpen(false);

//     if (notif.type === "job") {
//       navigate(`/freelance-dashboard/job-full/${notif.jobId}`);
//     }

//     if (notif.type === "message") {
//       navigate("/freelance-dashboard/freelancermessages", {
//         state: { otherUid: notif.clientUid },
//       });
//     }
//   };

//   // ✅ FILTERED JOBS
//   const filteredJobs = useMemo(() => {
//     let result = jobs.filter((job) => {
//       // Search query
//       if (
//         filters.searchQuery &&
//         !job.title?.toLowerCase().includes(filters.searchQuery.toLowerCase())
//       ) {
//         return false;
//       }

//       // Budget overlap logic
//       const jobMin = Number(job.budget_from) || 0;
//       const jobMax = Number(job.budget_to) || 0;
//       const filterMin = filters.budgetRange.start;
//       const filterMax = filters.budgetRange.end;

//       if (jobMax < filterMin || jobMin > filterMax) return false;

//       // Category filter
//       if (
//         filters.categories.length &&
//         !filters.categories.includes(job.category)
//       ) {
//         return false;
//       }

//       // Skills filter
//       if (
//         filters.skills.length &&
//         !filters.skills.some((s) => job.skills?.includes(s))
//       ) {
//         return false;
//       }

//       // Posting time filter
//       if (filters.postingTime) {
//         const postedAt = job.createdAt?.getTime?.() || 0;
//         const now = Date.now();

//         const daysMap = {
//           "Posted Today": 1,
//           "Last 3 Days": 3,
//           "Last 7 Days": 7,
//           "Last 30 Days": 30,
//         };

//         const limitDays = daysMap[filters.postingTime];
//         if (limitDays) {
//           const diffDays = (now - postedAt) / (1000 * 60 * 60 * 24);
//           if (diffDays > limitDays) return false;
//         }
//       }

//       // Tab filter
//       if (selectedTab === 1 && !job.is24h) return false; // 24 Hours
//       if (selectedTab === 2 && !savedJobs.includes(job.id)) return false; // Saved

//       return true;
//     });

//     // Sort
//     if (filters.sortOption === JobSortOption.BEST_MATCH) {
//       result.sort((a, b) => matchScore(b, userSkills) - matchScore(a, userSkills));
//     } else if (filters.sortOption === JobSortOption.NEWEST) {
//       result.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
//     } else if (filters.sortOption === JobSortOption.AVAILABILITY) {
//       result.sort((a, b) => (a.views || 0) - (b.views || 0));
//     }

//     return result;
//   }, [jobs, filters, selectedTab, savedJobs, userSkills]);

//   const toggleSave = async (e, jobId) => {
//     e.stopPropagation(); // ✅ Prevent navigation
//     if (!uid) return;
//     await updateDoc(doc(db, "users", uid), {
//       favoriteJobs: savedJobs.includes(jobId)
//         ? arrayRemove(jobId)
//         : arrayUnion(jobId),
//     });
//   };

//   return (
//     <div
//       className="freelance-wrapper"
//       style={{
//         marginLeft: collapsed ? "140px" : "210px",
//         transition: "margin-left 0.25s ease",
//         overflowX: "hidden",
//         maxWidth: "100vw",
//         boxSizing: "border-box",
//         marginTop: "60px",
//         width: "80%",
//       }}
//     >
//       <div
//         className="job-search"
//         style={{
//           width: "100%",
//           overflowX: "hidden",
//           boxSizing: "border-box",
//         }}
//       >
//         {/* ================= HEADER ================= */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             gap: 12,
//             marginBottom: 20,
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//             <div
//               onClick={() => navigate(-1)}
//               style={{
//                 width: 36,
//                 height: 36,
//                 borderRadius: 14,
//                 border: "0.8px solid #E0E0E0",
//                 backgroundColor: "#FFFFFF",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 cursor: "pointer",
//                 boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
//                 flexShrink: 0,
//               }}
//             >
//               <img
//                 src={backarrow}
//                 alt="Back"
//                 style={{
//                   width: 16,
//                   height: 18,
//                   objectFit: "contain",
//                 }}
//               />
//             </div>

//             <div>
//               <div style={{ fontSize: 32, fontWeight: 400 }}>
//                 Explore Freelancer
//               </div>
//             </div>
//           </div>

//           <div style={{ display: "flex", alignItems: "center", gap: 12, marginRight: "60px" }}>
//             <div
//               className="icon-wrapper"
//               onClick={() =>
//                 navigate("/freelance-dashboard/freelancermessages")
//               }
//               style={{ position: "relative", cursor: "pointer" }}
//             >
//               <img src={message} style={{ width: 26, }} alt="Messages" />
//               {unreadMsgCount > 0 && (
//                 <span
//                   className="dot"
//                   style={{
//                     position: "absolute",
//                     top: 0,
//                     right: 0,
//                     width: 8,
//                     height: 8,
//                     background: "red",
//                     borderRadius: "50%",
//                   }}
//                 />
//               )}
//             </div>

//             <div
//               className="icon-wrapper"
//               style={{ position: "relative", cursor: "pointer" }}
//             >
//               <img
//                 src={notification}
//                 style={{ width: 26 }}
//                 onClick={() => setNotifOpen((p) => !p)}
//                 alt="Notifications"
//               />
//               {notifCount > 0 && (
//                 <span
//                   className="dot"
//                   style={{

//                     position: "absolute",
//                     top: 0,
//                     right: 0,
//                     width: 8,
//                     height: 8,
//                     background: "red",
//                     borderRadius: "50%",
//                   }}
//                 />
//               )}
//             </div>

//             <div
//               className="fh-avatar"
//               onClick={() => navigate("/freelance-dashboard/Profilebuilder")}
//               style={{ cursor: "pointer" }}
//             >
//               <img
//                 src={userInfo.profileImage || profile}
//                 alt="Profile"
//                 style={{ width: "34px", padding: "3px", height: "34px", borderRadius: "50%", }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* ================= NOTIFICATION DROPDOWN ================= */}
//         {notifOpen && (
//           <div
//             className="notif-dropdown"
//             style={{
//               position: "absolute",
//               right: 60,
//               top: 80,
//               background: "#fff",
//               borderRadius: 12,
//               boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
//               padding: 12,
//               width: 300,
//               maxHeight: 400,
//               overflowY: "auto",
//               zIndex: 999,
//             }}
//           >
//             {notifications.length === 0 && <p>No notifications</p>}

//             {notifications.map((n) => (
//               <div
//                 key={n.id}
//                 className={`notif-item ${!n.read ? "unread" : ""}`}
//                 onClick={() => handleNotificationClick(n)}
//                 style={{
//                   padding: 12,
//                   borderBottom: "1px solid #eee",
//                   cursor: "pointer",
//                   background: !n.read ? "#f0f0f0" : "transparent",
//                 }}
//               >
//                 <div className="notif-title" style={{ fontWeight: 600 }}>
//                   {n.title}
//                 </div>
//                 <div className="notif-body" style={{ fontSize: 13, marginTop: 4 }}>
//                   {n.body}
//                 </div>
//                 <div
//                   className="notif-time"
//                   style={{ fontSize: 11, color: "#999", marginTop: 4 }}
//                 >
//                   {timeAgo(n.timestamp?.toDate?.())}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* ================= SEARCH + FILTER ================= */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 10,
//             width: "96%",
//             marginLeft: isMobile ? "10px" : "0px",
//             marginTop: "20px",
//           }}
//         >
//           {/* SEARCH BOX */}
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 8,
//               flex: 1,
//               padding: "clamp(9px, 3vw, 10px) 14px",
//               borderRadius: 12,
//               border: "1px solid #ddd",
//               background: "#fff",
//               height: "50px"
//             }}
//           >
//             <img
//               src={search}
//               alt="search"
//               style={{
//                 width: 18,
//                 height: 18,
//                 opacity: 0.6,
//                 flexShrink: 0,

//               }}
//             />

//             <input

//               placeholder="Search job"
//               value={filters.searchQuery}
//               onChange={(e) =>
//                 setFilters({ ...filters, searchQuery: e.target.value })
//               }
//               style={{
//                 flex: 1,
//                 border: "none",
//                 outline: "none",
//                 fontSize: "clamp(13px, 3.5vw, 14px)",
//                 background: "transparent",
//                 marginTop: "14px",
//                 marginLeft: "-15px"
//               }}
//             />
//           </div>


//         </div>


//         {/* ================= TABS ================= */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             gap: 8,
//             padding: "clamp(6px, 2.5vw, 8px)",
//             margin: "12px auto",
//             borderRadius: 16,
//             boxShadow: " 0 4px 8px 0 rgba(0, 0, 0, 0.2)",
//             width: "96%",
//             maxWidth: 1540,
//             marginLeft: "10px",
//             overflowX: "auto",
//             marginLeft: '1px',
//             marginTop: "40px"
//           }}
//         >
//           {["Work", "24 Hours", "Saved"].map((t, i) => {
//             const isActive = selectedTab === i;

//             return (
//               <button
//                 key={i}
//                 onClick={() => setSelectedTab(i)}
//                 style={{
//                   border: "none",
//                   cursor: "pointer",
//                   padding: "clamp(8px, 3vw, 10px) clamp(18px, 6vw, 42px)",
//                   borderRadius: 999,
//                   fontSize: "clamp(12px, 3.5vw, 14px)",
//                   fontWeight: 500,
//                   whiteSpace: "nowrap",

//                   // 🔥 THIS IS THE FIX
//                   color: isActive ? "#FFFFFF" : "#333",

//                   background: isActive ? "#7C3CFF" : "transparent",
//                   boxShadow: isActive
//                     ? "0 6px 20px rgba(0,0,0,0.19)"
//                     : "none",
//                   transition: "all 0.25s ease",
//                   flexShrink: 0,
//                 }}
//               >
//                 {t}
//               </button>
//             );
//           })}

//         </div>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             width: "100%",
//             padding: "12px 16px",
//           }}
//         >
//           {/* ================= FILTER ================= */}
//           <div
//             onClick={() => setShowFilter(true)}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "6px",
//               cursor: "pointer",
//               fontSize: "14px",
//               fontWeight: 500,
//               marginLeft: "1120px",
//               marginTop: "7px"
//             }}
//           >
//             <img
//               src={Filter}
//               alt="filter"
//               style={{
//                 width: 18,
//                 height: 18,
//                 opacity: 0.7,
//               }}
//             />
//             <span>Filter</span>
//           </div>

//           {/* ================= SORT ================= */}
//           <div
//             onClick={() => setShowSort(!showSort)}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "6px",
//               cursor: "pointer",
//               fontSize: "14px",
//               fontWeight: 500,
//               marginRight: "40px",
//               marginTop: "7px"

//             }}
//           >
//             <img
//               src={sort}
//               alt="sort"
//               style={{
//                 width: 18,
//                 height: 18,
//                 opacity: 0.7,

//               }}
//             />
//             <span>Sort</span>
//           </div>
//         </div>


//         {showSort && (
//           <div
//             className="sort"
//             style={{
//               marginTop: 14,
//               display: "flex",
//               gap: 10,
//               flexWrap: "nowrap",
//               overflowX: "auto",
//               paddingBottom: 4,
//               background: "#fff",
//               padding: "12px",
//               borderRadius: "14px",
//               boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
//               maxWidth: "100%",

//             }}
//           >
//             {Object.values(JobSortOption).map((opt) => (
//               <button
//                 key={opt}
//                 onClick={() => {
//                   setFilters({ ...filters, sortOption: opt });
//                   setShowSort(false);
//                 }}
//                 style={{
//                   padding: "8px 14px",
//                   borderRadius: 999,
//                   border: "1px solid #ddd",
//                   background:
//                     filters.sortOption === opt ? "#6D28D9" : "transparent",
//                   color: filters.sortOption === opt ? "#fff" : "#6D28D9",
//                   cursor: "pointer",
//                   fontSize: "clamp(12px, 3.5vw, 14px)",
//                   whiteSpace: "nowrap",
//                   flexShrink: 0,
//                 }}
//               >
//                 {opt}
//               </button>
//             ))}
//           </div>
//         )}

//         {/* ================= JOB LIST ================= */}
//         <div
//           className="jobs"
//           style={{
//             width: "99%",
//             maxWidth: "100%",
//             overflowX: "hidden",
//             marginLeft: isMobile ? "30px" : "0px",
//           }}
//         >
//           {filteredJobs.length === 0 && (
//             <p style={{ opacity: 0.6 }}>No jobs found</p>
//           )}

//           {filteredJobs.map((job) => (
//             <div
//               key={job.id}
//               onClick={() =>
//                 navigate(`/freelance-dashboard/job-full/${job.id}`, {
//                   state: job,
//                 })
//               }
//               style={{
//                 marginTop: 20,
//                 background: "#fff",
//                 marginLeft: "10px",
//                 borderRadius: 20,
//                 padding: 22,
//                 marginBottom: 18,
//                 boxShadow: "0 0 6px rgba(0,0,0,0.15)",
//                 width: "97%",
//                 boxSizing: "border-box",
//                 cursor: "pointer",
//                 marginLeft: "2px"
//               }}
//             >
//               {/* ===== TOP ROW ===== */}
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   gap: 16,
//                 }}
//               >
//                 <div>
//                   <div
//                     style={{
//                       fontSize: 18,
//                       fontWeight: 400,
//                       marginTop: 6,
//                       color: "#222",
//                     }}
//                   >
//                     {job.title}
//                   </div>
//                 </div>

//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 16,
//                   }}
//                 >
//                   <div id="job-budget" className="job-budget">₹{job.budget_from || job.budget} - ₹{job.budget_to || job.budget}</div>


//                 </div>

//               </div>
//               <button
//                 onClick={(e) => toggleSave(e, job.id)}
//                 style={{
//                   background: "transparent",
//                   border: "none",
//                   cursor: "pointer",
//                   marginLeft: "1190px",
//                   marginTop: "8px"
//                 }}
//               >
//                 <img
//                   src={savedJobs.includes(job.id) ? saved : save}
//                   alt="save"
//                   width={20}
//                 />
//               </button>
//               {/* ===== SKILLS ===== */}
//               <div style={{ marginTop: -4 }}>
//                 <div style={{ fontSize: 14, fontWeight: "400", color: "gray" }}>
//                   Skills Required
//                 </div>

//                 <div
//                   style={{
//                     display: "flex",
//                     gap: 8,
//                     flexWrap: "wrap",
//                     marginTop: 16,

//                   }}
//                 >
//                   {job.skills?.slice(0, 3).map((s) => (
//                     <span
//                       key={s}
//                       style={{
//                         background: "#FFF3A0",
//                         padding: "6px 12px",
//                         borderRadius: 999,
//                         fontSize: 12,
//                         fontWeight: 500,
//                       }}
//                     >
//                       {s}
//                     </span>
//                   ))}

//                   {job.skills?.length > 3 && (
//                     <span
//                       style={{
//                         background: "#FFF3A0",
//                         padding: "6px 12px",
//                         borderRadius: 999,
//                         fontSize: 12,
//                         fontWeight: 500,
//                       }}
//                     >
//                       {job.skills.length - 3}+
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* ===== DESCRIPTION ===== */}
//               <p
//                 style={{
//                   marginTop: 14,
//                   fontSize: 14,
//                   color: "#444",
//                   lineHeight: 1.6,
//                 }}
//               >
//                 {job.description}
//               </p>

//               {/* ===== FOOTER ===== */}
//               <div
//                 style={{
//                   marginTop: 16,
//                   display: "flex",
//                   gap: 16,
//                   fontSize: 12,
//                   color: "#666",
//                 }}
//               >
//                 <span
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "6px",
//                     fontSize: "13px",
//                   }}
//                 >
//                   <img
//                     src={eye}
//                     width={14}
//                     alt="views"
//                     style={{ display: "block" }}
//                   />
//                   <span>
//                     {job.views} Impression
//                   </span>
//                 </span>

//                 <span
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "6px",
//                     fontSize: "13px",
//                   }}
//                 >
//                   <img
//                     src={clock}
//                     width={14}
//                     alt="time"
//                     style={{ display: "block" }}
//                   />
//                   <span>{timeAgo(job.createdAt)}</span>
//                 </span>

//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ================= FILTER POPUP ================= */}
//       {showFilter && (
//         <JobFiltersFullScreen
//           currentFilters={filters}
//           onApply={(newFilters) => {
//             setFilters((prev) => ({
//               ...prev,
//               ...newFilters,
//             }));
//           }}
//           onClose={() => setShowFilter(false)}
//         />
//       )}
//     </div>
//   );
// }



import React, { useEffect, useMemo, useState } from "react";
import JobFiltersFullScreen from "./FreelancerFilter";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  arrayUnion,
  arrayRemove,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firbase/Firebase";

import search from "../../assets/search.png";
import eye from "../../assets/eye.png";
import clock from "../../assets/clock.png";
import saved from "../../assets/save.png";
import save from "../../assets/save2.png";
import backarrow from "../../assets/backarrow.png";
import message from "../../assets/message.png"; // ✅ ADD THIS
import notification from "../../assets/notification.png"; // ✅ ADD THIS
import profile from "../../assets/profile.png"; // ✅ ADD THIS
import Filter from "../../assets/Filter.png"; // ✅ ADD THIS
import sort from "../../assets/sort.png"; // ✅ ADD THIS
import { useNavigate } from "react-router-dom";
import "../../pages/Freelancerpage/ExploreFreelancer.responsive.css";
// import "./ExploreFreelancer.responsive.css";


const JobSortOption = {
  BEST_MATCH: "bestMatch",
  NEWEST: "newest",
  AVAILABILITY: "availability",
};

const defaultFilters = {
  searchQuery: "",
  categories: [],
  skills: [],
  postingTime: "",
  budgetRange: { start: 0, end: 100000 },
  sortOption: JobSortOption.BEST_MATCH,
};

const formatCurrency = (amount = 0) => {
  if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
  return amount;
};

const timeAgo = (date) => {
  if (!date) return "";
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const matchScore = (job, userSkills) => {
  let score = 0;
  job.skills?.forEach((s) => userSkills.includes(s) && (score += 3));
  userSkills.includes(job.category) && (score += 2);
  return score;
};

export default function ExploreFreelancer() {
  const auth = getAuth();
  const uid = auth.currentUser?.uid;
  const user = auth.currentUser; // ✅ FIXED

  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [userInfo, setUserInfo] = useState({}); // ✅ FIXED

  const [filters, setFilters] = useState(defaultFilters);
  const [selectedTab, setSelectedTab] = useState(3);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const [showSort, setShowSort] = useState(false);
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [notifications, setNotifications] = useState([]);
  const [notifCount, setNotifCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false); // ✅ FIXED

  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  console.log(jobs);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  // ✅ JOBS LISTENER
  useEffect(() => {
    const qJobs = query(collection(db, "jobs"), orderBy("created_at", "desc"));
    const qFast = query(
      collection(db, "jobs_24h"),
      orderBy("created_at", "desc")
    );

    const unsub1 = onSnapshot(qJobs, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        source: "jobs",
        is24h: false,
        views: d.data().views || 0,
        ...d.data(),
        createdAt: d.data().created_at?.toDate?.() || null,
      }));
      setJobs((prev) => [...prev.filter((j) => j.source !== "jobs"), ...data]);
    });

    const unsub2 = onSnapshot(qFast, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        source: "jobs_24h",
        is24h: true,
        views: d.data().views || 0,
        ...d.data(),
        createdAt: d.data().created_at?.toDate?.() || null,
      }));
      setJobs((prev) => [
        ...prev.filter((j) => j.source !== "jobs_24h"),
        ...data,
      ]);
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  // ✅ USER DATA LISTENER
  useEffect(() => {
    if (!uid) return;
    return onSnapshot(doc(db, "users", uid), (snap) => {
      const data = snap.data() || {};
      setSavedJobs(data.favoriteJobs || []);
      setUserSkills(data.skills || []);
      setUserInfo(data); // ✅ FIXED
    });
  }, [uid]);

  // ✅ UNREAD MESSAGES LISTENER
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "chats"),
      where("members", "array-contains", user.uid)
    );

    return onSnapshot(q, (snap) => {
      let count = 0;
      snap.forEach((d) => {
        const data = d.data();
        count += data.unread?.[user.uid] || 0;
      });
      setUnreadMsgCount(count);
    });
  }, [user]);

  // ✅ NOTIFICATIONS LISTENER
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      where("freelancerId", "==", user.uid)
    );

    return onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setNotifications(items);
      setNotifCount(items.filter((n) => !n.read).length);
    });
  }, [user]);

  // ✅ NOTIFICATION CLICK HANDLER
  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      await updateDoc(doc(db, "notifications", notif.id), { read: true });
    }

    setNotifOpen(false);

    if (notif.type === "job") {
      navigate(`/freelance-dashboard/job-full/${notif.jobId}`);
    }

    if (notif.type === "message") {
      navigate("/freelance-dashboard/freelancermessages", {
        state: { otherUid: notif.clientUid },
      });
    }
  };

  // ✅ FILTERED JOBS
  const filteredJobs = useMemo(() => {
    let result = jobs.filter((job) => {
      // Search query
      if (
        filters.searchQuery &&
        !job.title?.toLowerCase().includes(filters.searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Budget overlap logic
      const jobMin = Number(job.budget_from) || 0;
      const jobMax = Number(job.budget_to) || 0;
      const filterMin = filters.budgetRange.start;
      const filterMax = filters.budgetRange.end;

      if (jobMax < filterMin || jobMin > filterMax) return false;

      // Category filter
      if (
        filters.categories.length &&
        !filters.categories.includes(job.category)
      ) {
        return false;
      }

      // Skills filter
      if (
        filters.skills.length &&
        !filters.skills.some((s) => job.skills?.includes(s))
      ) {
        return false;
      }

      // Posting time filter
      if (filters.postingTime) {
        const postedAt = job.createdAt?.getTime?.() || 0;
        const now = Date.now();

        const daysMap = {
          "Posted Today": 1,
          "Last 3 Days": 3,
          "Last 7 Days": 7,
          "Last 30 Days": 30,
        };

        const limitDays = daysMap[filters.postingTime];
        if (limitDays) {
          const diffDays = (now - postedAt) / (1000 * 60 * 60 * 24);
          if (diffDays > limitDays) return false;
        }
      }

      // Tab filter
      if (selectedTab === 1 && !job.is24h) return false; // 24 Hours
      if (selectedTab === 2 && !savedJobs.includes(job.id)) return false; // Saved

      return true;
    });

    // Sort
    if (filters.sortOption === JobSortOption.BEST_MATCH) {
      result.sort((a, b) => matchScore(b, userSkills) - matchScore(a, userSkills));
    } else if (filters.sortOption === JobSortOption.NEWEST) {
      result.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    } else if (filters.sortOption === JobSortOption.AVAILABILITY) {
      result.sort((a, b) => (a.views || 0) - (b.views || 0));
    }

    return result;
  }, [jobs, filters, selectedTab, savedJobs, userSkills]);

  const toggleSave = async (e, jobId) => {
    e.stopPropagation(); // ✅ Prevent navigation
    if (!uid) return;
    await updateDoc(doc(db, "users", uid), {
      favoriteJobs: savedJobs.includes(jobId)
        ? arrayRemove(jobId)
        : arrayUnion(jobId),
    });
  };

  return (
    <div
      className="freelance-wrapper"
      style={{
        marginLeft: collapsed ? "140px" : "210px",
        transition: "margin-left 0.25s ease",
        overflowX: "hidden",
        maxWidth: "100vw",
        boxSizing: "border-box",
        marginTop: "60px",
        width: "80%",
      }}
    >
      <div
        className="job-search"
        style={{
          width: "100%",
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* ================= HEADER ================= */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 20,
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
                // boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
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
            className="top-icons"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginRight: "20px",
              paddingRight: "20px",
            }}
          >
            <div
              className="top-icon"
              onClick={() =>
                navigate("/freelance-dashboard/freelancermessages")
              }
              style={{ position: "relative", cursor: "pointer" }}
            >
              <img src={message} alt="Messages" />
              {unreadMsgCount > 0 && (
                <span
                  className="dot"
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 8,
                    height: 8,
                    background: "red",
                    borderRadius: "50%",
                  }}
                />
              )}
            </div>

            <div
              className="top-icon"
              style={{ position: "relative", cursor: "pointer" }}
            >
              <img
                src={notification}
                onClick={() => setNotifOpen((p) => !p)}
                alt="Notifications"
              />
              {notifCount > 0 && (
                <span
                  className="dot"
                  style={{

                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 8,
                    height: 8,
                    background: "red",
                    borderRadius: "50%",
                  }}
                />
              )}
            </div>
{/* 
            <div
              className="top-icon"
              onClick={() => navigate("/freelance-dashboard/Profilebuilder")}
              style={{ cursor: "pointer", border: "none" }}
            >
              <img
                src={userInfo.profileImage || profile}
                alt="Profile"
              />
            </div> */}
          </div>
        </div>

        {/* ================= NOTIFICATION DROPDOWN ================= */}
        {notifOpen && (
          <div
            className="notif-dropdown"
            style={{
              position: "absolute",
              right: 60,
              top: 80,
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              padding: 12,
              width: 300,
              maxHeight: 400,
              overflowY: "auto",
              zIndex: 999,
            }}
          >
            {notifications.length === 0 && <p>No notifications</p>}

            {notifications.map((n) => (
              <div
                key={n.id}
                className={`notif-item ${!n.read ? "unread" : ""}`}
                onClick={() => handleNotificationClick(n)}
                style={{
                  padding: 12,
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                  background: !n.read ? "#f0f0f0" : "transparent",
                }}
              >
                <div className="notif-title" style={{ fontWeight: 600 }}>
                  {n.title}
                </div>
                <div className="notif-body" style={{ fontSize: 13, marginTop: 4 }}>
                  {n.body}
                </div>
                <div
                  className="notif-time"
                  style={{ fontSize: 11, color: "#999", marginTop: 4 }}
                >
                  {timeAgo(n.timestamp?.toDate?.())}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= SEARCH + FILTER ================= */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "96%",
            marginLeft: isMobile ? "10px" : "0px",
            marginTop: "20px",
          }}
        >
          {/* SEARCH BOX */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flex: 1,
              padding: "clamp(9px, 3vw, 10px) 14px",
              borderRadius: 12,
              border: "1px solid #ddd",
              background: "#fff",
              height: "50px"
            }}
          >
            <img
              src={search}
              alt="search"
              style={{
                width: 18,
                height: 18,
                opacity: 0.6,
                flexShrink: 0,

              }}
            />

            <input

              placeholder="Search job"
              value={filters.searchQuery}
              onChange={(e) =>
                setFilters({ ...filters, searchQuery: e.target.value })
              }
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "clamp(13px, 3.5vw, 14px)",
                background: "transparent",
                marginTop: "14px",
                marginLeft: "-15px"
              }}
            />
          </div>


        </div>


        {/* ================= TABS ================= */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            padding: "clamp(6px, 2.5vw, 8px)",
            margin: "12px auto",
            borderRadius: 16,
            // boxShadow: " 0 4px 8px 0 rgba(0, 0, 0, 0.2)",
            border:"1px solid #0e02020e",
            width: "96%",
            maxWidth: 1540,
            marginLeft: "10px",
            overflowX: "auto",
            marginLeft: '1px',
            marginTop: "40px"
          }}
        >
          {["Work", "24 Hours", "Saved"].map((t, i) => {
            const isActive = selectedTab === i;

            return (
              <button
                key={i}
                onClick={() => setSelectedTab(i)}
                style={{
                  border: "none",
                  cursor: "pointer",
                  padding: "clamp(8px, 3vw, 10px) clamp(18px, 6vw, 42px)",
                  borderRadius: 999,
                  fontSize: "clamp(12px, 3.5vw, 14px)",
                  fontWeight: 500,
                  whiteSpace: "nowrap",

                  // 🔥 THIS IS THE FIX
                  color: isActive ? "#FFFFFF" : "#333",

                  background: isActive ? "#7C3CFF" : "transparent",
                  // boxShadow: isActive
                  //   ? "0 6px 20px rgba(0,0,0,0.19)"
                  //   : "none",
                  transition: "all 0.25s ease",
                  flexShrink: 0,
                }}
              >
                {t}
              </button>
            );
          })}

        </div>
        <div
          className="filter-sort-row"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            width: "100%",
            padding: "12px 26px",
          }}
        >

          {/* ================= FILTER ================= */}
          <div
            className="filter-btn"
            onClick={() => setShowFilter(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
              marginTop: "7px",
              marginRight: "5px",
            }}
          >

            <img
              src={Filter}
              alt="filter"
              style={{
                width: 18,
                height: 18,
                opacity: 0.7,
              }}
            />
            <span>Filter</span>
          </div>

          {/* ================= SORT ================= */}
          <div
            className="sort-btnn"
            onClick={() => setShowSort(!showSort)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
              marginTop: "7px",
              marginRight: "40px",
              justifyContent: "flex-end",

            }}
          >

            <img
              src={sort}
              alt="sort"
              style={{
                width: 18,
                height: 18,
                opacity: 0.7,

              }}
            />
            <span>Sort</span>
          </div>
        </div>


        {showSort && (
<div
  style={{
    marginTop: 0,
    marginLeft:"510px",
    display: "flex",
    gap: "10px",
    background: "#fff",
    padding: "10px",
    borderRadius: "20px",
    // boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    border:"1px solid #0e02020e",
    width: "fit-content",
  }}
>
  {Object.values(JobSortOption).map((opt) => {
    const active = filters.sortOption === opt;

    return (
      <button
        key={opt}
        onClick={() => {
          setFilters({ ...filters, sortOption: opt });
          setShowSort(false);
        }}
        style={{
          padding: "10px 22px",
          borderRadius: "14px",
          border: "none",
          background: active ? "#7C3AED" : "#F3F4F6",
          color: active ? "#fff" : "#000",
          fontWeight: 600,
          fontSize: "14px",
          cursor: "pointer",
          // boxShadow: active
          //   ? "0 6px 14px rgba(124,58,237,0.5)"
          //   : "none",
          transition: "all 0.25s ease",
        }}
      >
        {opt}
      </button>
    );
  })}
</div>

        )}

        {/* ================= JOB LIST ================= */}
        <div
          className="jobs"
          style={{
            width: "99%",
            maxWidth: "100%",
            overflowX: "hidden",
            marginLeft: isMobile ? "30px" : "0px",
          }}
        >
          {filteredJobs.length === 0 && (
            <p style={{ opacity: 0.6 }}>No jobs found</p>
          )}

          {filteredJobs.map((job) => (
            <div
              className="job-card"
              key={job.id}
              onClick={() =>
                navigate(`/freelance-dashboard/job-full/${job.id}`, {
                  state: job,
                })
              }
              style={{
                marginTop: 20,
                background: "#fff",
                marginLeft: "10px",
                borderRadius: 20,
                padding: 22,
                marginBottom: 18,
                // boxShadow: "0 0 6px rgba(0,0,0,0.15)",
                width: "97%",
                boxSizing: "border-box",
                cursor: "pointer",
                marginLeft: "2px",
              }}
            >
              {/* ===== TOP ROW ===== */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 400,
                      marginTop: 6,
                      color: "#222",
                    }}
                  >
                    {job.title}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div id="job-budget" className="job-budget">₹{job.budget_from || job.budget} - ₹{job.budget_to || job.budget}</div>


                </div>

              </div>
              <button
                className="job-save-btn"
                onClick={(e) => toggleSave(e, job.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "8px",
                  marginLeft: "95%"
                }}
              >

                <img
                  className=""
                  src={savedJobs.includes(job.id) ? saved : save}
                  alt="save"
                  width={20}
                />
              </button>
              {/* ===== SKILLS ===== */}
              <div style={{ marginTop: -4 }}>
                <div style={{ fontSize: 14, fontWeight: "400", color: "gray" }}>
                  Skills Required
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    marginTop: 16,

                  }}
                >
                  {job.skills?.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      style={{
                        background: "#FFF3A0",
                        padding: "6px 12px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      {s}
                    </span>
                  ))}

                  {job.skills?.length > 3 && (
                    <span
                      style={{
                        background: "#FFF3A0",
                        padding: "6px 12px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      {job.skills.length - 3}+
                    </span>
                  )}
                </div>
              </div>

              {/* ===== DESCRIPTION ===== */}
              <p
                style={{
                  marginTop: 14,
                  fontSize: 14,
                  color: "#444",
                  lineHeight: 1.6,
                }}
              >
                {job.description}
              </p>

              {/* ===== FOOTER ===== */}
              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  gap: 16,
                  fontSize: 12,
                  color: "#666",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                  }}
                >
                  <img
                    src={eye}
                    width={14}
                    alt="views"
                    style={{ display: "block" }}
                  />
                  <span>
                    {job.views} Impression
                  </span>
                </span>

                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                  }}
                >
                  <img
                    src={clock}
                    width={14}
                    alt="time"
                    style={{ display: "block" }}
                  />
                  <span>{timeAgo(job.createdAt)}</span>
                </span>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= FILTER POPUP ================= */}
      {showFilter && (
        <JobFiltersFullScreen
          currentFilters={filters}
          onApply={(newFilters) => {
            setFilters((prev) => ({
              ...prev,
              ...newFilters,
            }));
          }}
          onClose={() => setShowFilter(false)}
        />
      )}
    </div>
  );
}