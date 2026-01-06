// import React, { useEffect, useMemo, useState } from "react";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   runTransaction,
//   updateDoc,
//   arrayUnion,
//   arrayRemove,
// } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { db } from "../../firbase/Firebase";
// import { useNavigate } from "react-router-dom";

// import FilterScreen, { JobFilter } from "./Filter"; // ✅ FILTER IMPORT

// /* ======================================================
//    HELPERS
// ====================================================== */
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

// /* ======================================================
//    MAIN COMPONENT
// ====================================================== */
// export default function CategoryPage({ initialTab = "Freelancer" }) {
//   const auth = getAuth();
//   const user = auth.currentUser;
//   const navigate = useNavigate();

//   /* ================= STATE ================= */
//   const [tab, setTab] = useState(initialTab);
//   const [search, setSearch] = useState("");
//   const [sort, setSort] = useState("");

//   const [filter, setFilter] = useState(new JobFilter()); // 🔥 FILTER STATE
//   const [showFilter, setShowFilter] = useState(false);  // 🔥 MODAL STATE

//   const [services, setServices] = useState([]);
//   const [services24, setServices24] = useState([]);
//   const [savedIds, setSavedIds] = useState([]);

//   /* ======================================================
//      FIRESTORE LISTENERS
//   ====================================================== */
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

//   /* ======================================================
//      VIEW INCREMENT (ONCE PER USER)
//   ====================================================== */
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

//   /* ======================================================
//      FILTER + SORT LOGIC
//   ====================================================== */
//   const applyFilter = (jobs) => {
//     return jobs
//       .filter((j) => {
//         const title = (j.title || "").toLowerCase();
//         const category = (j.category || "").toLowerCase();
//         const skills = j.skills || [];

//         // 🔍 SEARCH
//         if (search) {
//           const q = search.toLowerCase();
//           if (
//             !title.includes(q) &&
//             !category.includes(q) &&
//             !skills.some((s) => s.toLowerCase().includes(q))
//           )
//             return false;
//         }

//         // 🎯 CATEGORY
//         if (
//           filter.categories.length &&
//           !filter.categories.includes(j.category)
//         )
//           return false;

//         // 🛠 SKILLS
//         if (
//           filter.skills.length &&
//           !skills.some((s) => filter.skills.includes(s))
//         )
//           return false;

//         // 💰 PRICE
//         const from = Number(j.budget_from || 0);
//         const to = Number(j.budget_to || 0);

//         if (filter.minPrice !== null && to < filter.minPrice) return false;
//         if (filter.maxPrice !== null && from > filter.maxPrice) return false;

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

//   /* ======================================================
//      FINAL JOB LIST
//   ====================================================== */
//   const jobs = useMemo(() => {
//     if (tab === "Freelancer") return applyFilter(services);
//     if (tab === "24 hour") return applyFilter(services24);
//     return [...services, ...services24].filter((j) =>
//       savedIds.includes(j.id)
//     );
//   }, [tab, services, services24, savedIds, search, filter, sort]);

//   /* ======================================================
//      SAVE / UNSAVE
//   ====================================================== */
//   const toggleSave = async (jobId, isSaved) => {
//     await updateDoc(doc(db, "users", user.uid), {
//       savedJobs: isSaved
//         ? arrayRemove(jobId)
//         : arrayUnion(jobId),
//     });
//   };

//   /* ======================================================
//      UI
//   ====================================================== */
//   return (
//     <div style={{ padding: 20 }}>
//       <h2 style={{ textAlign: "center" }}>Explore Freelancer</h2>

//       {/* TABS */}
//       <div style={{ display: "flex", gap: 24 }}>
//         {["Freelancer", "24 hour", "Saved"].map((t) => (
//           <span
//             key={t}
//             onClick={() => setTab(t)}
//             style={{
//               cursor: "pointer",
//               borderBottom: tab === t ? "3px solid gold" : "none",
//               paddingBottom: 6,
//             }}
//           >
//             {t}
//           </span>
//         ))}
//       </div>

//       {/* SEARCH */}
//       <input
//         placeholder="Search jobs, skills…"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         style={{ width: "100%", margin: "12px 0", padding: 10 }}
//       />

//       {/* FILTER BUTTON */}
//       <button
//         onClick={() => setShowFilter(true)}
//         style={{ marginBottom: 12 }}
//       >
//         Filter
//       </button>

//       {/* SORT */}
//       <div style={{ display: "flex", gap: 10 }}>
//         {["Newest", "Oldest"].map((s) => (
//           <button
//             key={s}
//             onClick={() => setSort(sort === s ? "" : s)}
//           >
//             {s}
//           </button>
//         ))}
//       </div>

//       {/* JOB LIST */}
//       <div style={{ marginTop: 20 }}>
//         {jobs.length === 0 && <p>No jobs found</p>}

//         {jobs.map((job) => {
//           const isSaved = savedIds.includes(job.id);
//           return (
//             <div
//               key={job.id}
//               style={{
//                 border: "1px solid #ccc",
//                 borderRadius: 16,
//                 padding: 16,
//                 marginBottom: 16,
//                 cursor: "pointer",
//               }}
//               onClick={() => {
//                 incrementViewOnce(
//                   tab === "24 hour" ? "service_24h" : "services",
//                   job.id
//                 );
//                 navigate(`/job/${job.id}`);
//               }}
//             >
//               <h3>{job.title}</h3>

//               {/* SKILLS */}
//               <div style={{ display: "flex", gap: 6 }}>
//                 {(job.skills || []).slice(0, 3).map((s) => (
//                   <span
//                     key={s}
//                     style={{
//                       background: skillColor(s),
//                       padding: "4px 10px",
//                       borderRadius: 20,
//                     }}
//                   >
//                     {s}
//                   </span>
//                 ))}
//               </div>

//               {/* FOOTER */}
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   marginTop: 10,
//                 }}
//               >
//                 <span>
//                   ₹{formatCurrency(job.budget_from)} – ₹
//                   {formatCurrency(job.budget_to)}
//                 </span>

//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     toggleSave(job.id, isSaved);
//                   }}
//                 >
//                   {isSaved ? "★" : "☆"}
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* ==================================================
//          FILTER MODAL
//       ================================================== */}
//       {showFilter && (
//         <div style={modalStyle}>
//           <FilterScreen
//             initialFilter={filter}
//             onClose={() => setShowFilter(false)}
//             onApply={(appliedFilter) => {
//               setFilter(appliedFilter); // ✅ APPLY FILTER
//               setShowFilter(false);
//             }}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// /* ======================================================
//    MODAL STYLE
// ====================================================== */
// const modalStyle = {
//   position: "fixed",
//   inset: 0,
//   background: "rgba(0,0,0,0.35)",
//   zIndex: 999,
//   overflowY: "auto",
// };












// import React, { useEffect, useMemo, useState } from "react";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   runTransaction,
//   updateDoc,
//   arrayUnion,
//   arrayRemove,
//   Timestamp,
// } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { db } from "../../firbase/Firebase";
// import { useNavigate } from "react-router-dom";
// import { FiEye } from "react-icons/fi";
// import FilterScreen, { JobFilter } from "./Filter"; // ✅ FILTER IMPORT

// /* ======================================================
//    HELPERS
// ====================================================== */
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

// /* ======================================================
//    MAIN COMPONENT
// ====================================================== */
// export default function CategoryPage({ initialTab = "Freelancer" }) {
//   const auth = getAuth();
//   const user = auth.currentUser;
//   const navigate = useNavigate();

//   /* ================= STATE ================= */
//   const [tab, setTab] = useState(initialTab);
//   const [search, setSearch] = useState("");
//   const [sort, setSort] = useState("");

//   const [filter, setFilter] = useState(new JobFilter()); // 🔥 FILTER STATE
//   const [showFilter, setShowFilter] = useState(false);  // 🔥 MODAL STATE

//   const [services, setServices] = useState([]);
//   const [services24, setServices24] = useState([]);
//   const [savedIds, setSavedIds] = useState([]);

//   function timeAgo(ts) {
//     if (!ts) return "Just now";
//     const d = ts instanceof Timestamp ? ts.toDate() : new Date(ts);
//     const diff = (Date.now() - d.getTime()) / 1000;

//     if (diff < 60) return `${Math.floor(diff)}s ago`;
//     if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
//     if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
//     return `${Math.floor(diff / 86400)}d ago`;
//   }


//   /* ======================================================
//      FIRESTORE LISTENERS
//   ====================================================== */
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

//   /* ======================================================
//      VIEW INCREMENT (ONCE PER USER)
//   ====================================================== */
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

//   /* ======================================================
//      FILTER + SORT LOGIC
//   ====================================================== */
//   const applyFilter = (jobs) => {
//     return jobs
//       .filter((j) => {
//         const title = (j.title || "").toLowerCase();
//         const category = (j.category || "").toLowerCase();
//         const skills = j.skills || [];

//         // 🔍 SEARCH
//         if (search) {
//           const q = search.toLowerCase();
//           if (
//             !title.includes(q) &&
//             !category.includes(q) &&
//             !skills.some((s) => s.toLowerCase().includes(q))
//           )
//             return false;
//         }

//         // 🎯 CATEGORY
//         if (
//           filter.categories.length &&
//           !filter.categories.includes(j.category)
//         )
//           return false;

//         // 🛠 SKILLS
//         if (
//           filter.skills.length &&
//           !skills.some((s) => filter.skills.includes(s))
//         )
//           return false;

//         // 💰 PRICE
//         const from = Number(j.budget_from || 0);
//         const to = Number(j.budget_to || 0);

//         if (filter.minPrice !== null && to < filter.minPrice) return false;
//         if (filter.maxPrice !== null && from > filter.maxPrice) return false;

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

//   /* ======================================================
//      FINAL JOB LIST
//   ====================================================== */
//   const jobs = useMemo(() => {
//     if (tab === "Freelancer") return applyFilter(services);
//     if (tab === "24 hour") return applyFilter(services24);
//     return [...services, ...services24].filter((j) =>
//       savedIds.includes(j.id)
//     );
//   }, [tab, services, services24, savedIds, search, filter, sort]);

//   /* ======================================================
//      SAVE / UNSAVE
//   ====================================================== */
//   const toggleSave = async (jobId, isSaved) => {
//     await updateDoc(doc(db, "users", user.uid), {
//       savedJobs: isSaved
//         ? arrayRemove(jobId)
//         : arrayUnion(jobId),
//     });
//   };

//   /* ======================================================
//      UI
//   ====================================================== */
//   return (
//     <div style={{ padding: 20 }}>
//       <h2 style={{ textAlign: "center" }}>Explore Freelancer</h2>

//       {/* TABS */}
//       <div style={{ display: "flex", gap: 24 }}>
//         {["Freelancer", "24 hour", "Saved"].map((t) => (
//           <span
//             key={t}
//             onClick={() => setTab(t)}
//             style={{
//               cursor: "pointer",
//               borderBottom: tab === t ? "3px solid gold" : "none",
//               paddingBottom: 6,
//             }}
//           >
//             {t}
//           </span>
//         ))}
//       </div>

//       {/* SEARCH */}
//       <input
//         placeholder="Search jobs, skills..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         style={{ width: "100%", margin: "12px 0", padding: 10 }}
//       />

//       {/* FILTER BUTTON */}
//       <button
//         onClick={() => setShowFilter(true)}
//         style={{ marginBottom: 12 }}
//       >
//         Filter
//       </button>

//       {/* SORT */}
//       <div style={{ display: "flex", gap: 10 }}>
//         {["Newest", "Oldest"].map((s) => (
//           <button
//             key={s}
//             onClick={() => setSort(sort === s ? "" : s)}
//           >
//             {s}
//           </button>
//         ))}
//       </div>

//       {/* JOB LIST */}
//       <div style={{ marginTop: 20 }}>
//         {jobs.length === 0 && <p>No jobs found</p>}

//         {jobs.map((job) => {
//           const isSaved = savedIds.includes(job.id);
//           return (
//             <div
//               key={job.id}
//               style={{
//                 border: "1px solid #ccc",
//                 borderRadius: 16,
//                 padding: 16,
//                 marginBottom: 16,
//                 cursor: "pointer",
//               }}
//               onClick={() => {
//                 incrementViewOnce(
//                   tab === "24 hour" ? "service_24h" : "services",
//                   job.id
//                 );
//                 navigate(`/job/${job.id}`);
//               }}
//             >
//               <h3>{job.title}</h3>


//               {/* SKILLS */}
//               <div style={{ display: "flex", gap: 6 }}>
//                 {(job.skills || []).slice(0, 3).map((s) => (
//                   <span
//                     key={s}
//                     style={{
//                       background: skillColor(s),
//                       padding: "4px 10px",
//                       borderRadius: 20,
//                     }}
//                   >
//                     {s}
//                   </span>
//                 ))}
//               </div>

//               {/* FOOTER */}
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   marginTop: 10,
//                 }}
//               >
//                 <span>
//                   ₹{formatCurrency(job.budget_from)} – ₹
//                   {formatCurrency(job.budget_to)}
//                 </span>
//                 {/* <FiEye /> <span>{job.views || 0} view</span> */}
//                 <p className="job-desc">
//                   {job.description?.slice(0, 180)}
//                   {job.description?.length > 180 ? "..." : ""}
//                 </p>
//                 <span style={{ fontSize: 12, color: "#777" }}>
//                   {timeAgo(job.createdAt)}
//                 </span>
//                 <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
//                   <FiEye /> {job.views || 0}
//                 </span>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     toggleSave(job.id, isSaved);
//                   }}
//                 >
//                   {isSaved ? "★" : "☆"}
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* ==================================================
//          FILTER MODAL
//       ================================================== */}
//       {showFilter && (
//         <div style={modalStyle}>
//           <FilterScreen
//             initialFilter={filter}
//             onClose={() => setShowFilter(false)}
//             onApply={(appliedFilter) => {
//               setFilter(appliedFilter); // ✅ APPLY FILTER
//               setShowFilter(false);
//             }}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// /* ======================================================
//    MODAL STYLE
// ====================================================== */
// const modalStyle = {
//   position: "fixed",
//   inset: 0,
//   background: "rgba(0,0,0,0.35)",
//   zIndex: 999,
//   overflowY: "auto",
// };















// import React, { useEffect, useMemo, useState } from "react";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   runTransaction,
//   updateDoc,
//   arrayUnion,
//   arrayRemove,
//   Timestamp,
// } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { db } from "../../firbase/Firebase";
// import { useNavigate } from "react-router-dom";
// import { FiEye } from "react-icons/fi";
// import FilterScreen, { JobFilter } from "./Filter"; // ✅ FILTER IMPORT

// /* ======================================================
//    HELPERS
// ====================================================== */
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

// /* ======================================================
//    MAIN COMPONENT
// ====================================================== */
// export default function CategoryPage({ initialTab = "Freelancer" }) {
//   const auth = getAuth();
//   const user = auth.currentUser;
//   const navigate = useNavigate();

//   /* ================= STATE ================= */
//   const [tab, setTab] = useState(initialTab);
//   const [search, setSearch] = useState("");
//   const [sort, setSort] = useState("");

//   const [filter, setFilter] = useState(new JobFilter()); // 🔥 FILTER STATE
//   const [showFilter, setShowFilter] = useState(false);  // 🔥 MODAL STATE

//   const [services, setServices] = useState([]);
//   const [services24, setServices24] = useState([]);
//   const [savedIds, setSavedIds] = useState([]);

//   function timeAgo(ts) {
//     if (!ts) return "Just now";
//     const d = ts instanceof Timestamp ? ts.toDate() : new Date(ts);
//     const diff = (Date.now() - d.getTime()) / 1000;

//     if (diff < 60) return `${Math.floor(diff)}s ago`;
//     if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
//     if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
//     return `${Math.floor(diff / 86400)}d ago`;
//   }


//   /* ======================================================
//      FIRESTORE LISTENERS
//   ====================================================== */
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

//   /* ======================================================
//      VIEW INCREMENT (ONCE PER USER)
//   ====================================================== */
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

//   /* ======================================================
//      FILTER + SORT LOGIC
//   ====================================================== */
//   const applyFilter = (jobs) => {
//     return jobs
//       .filter((j) => {
//         const title = (j.title || "").toLowerCase();
//         const category = (j.category || "").toLowerCase();
//         const skills = j.skills || [];

//         // 🔍 SEARCH
//         if (search) {
//           const q = search.toLowerCase();
//           if (
//             !title.includes(q) &&
//             !category.includes(q) &&
//             !skills.some((s) => s.toLowerCase().includes(q))
//           )
//             return false;
//         }

//         // 🎯 CATEGORY
//         if (
//           filter.categories.length &&
//           !filter.categories.includes(j.category)
//         )
//           return false;

//         // 🛠 SKILLS
//         if (
//           filter.skills.length &&
//           !skills.some((s) => filter.skills.includes(s))
//         )
//           return false;

//         // 💰 PRICE
//         const from = Number(j.budget_from || 0);
//         const to = Number(j.budget_to || 0);

//         if (filter.minPrice !== null && to < filter.minPrice) return false;
//         if (filter.maxPrice !== null && from > filter.maxPrice) return false;

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

//   /* ======================================================
//      FINAL JOB LIST
//   ====================================================== */
//   const jobs = useMemo(() => {
//     if (tab === "Freelancer") return applyFilter(services);
//     if (tab === "24 hour") return applyFilter(services24);
//     return [...services, ...services24].filter((j) =>
//       savedIds.includes(j.id)
//     );
//   }, [tab, services, services24, savedIds, search, filter, sort]);

//   /* ======================================================
//      SAVE / UNSAVE
//   ====================================================== */
//   const toggleSave = async (jobId, isSaved) => {
//     await updateDoc(doc(db, "users", user.uid), {
//       savedJobs: isSaved
//         ? arrayRemove(jobId)
//         : arrayUnion(jobId),
//     });
//   };

//   /* ======================================================
//      UI
//   ====================================================== */
//   return (
//     <div style={{ padding: 20 }}>
//       <h2 style={{ textAlign: "center" }}>Explore Freelancer</h2>

//       {/* TABS */}
//       <div style={{ display: "flex", gap: 24 }}>
//         {["Freelancer", "24 hour", "Saved"].map((t) => (
//           <span
//             key={t}
//             onClick={() => setTab(t)}
//             style={{
//               cursor: "pointer",
//               borderBottom: tab === t ? "3px solid gold" : "none",
//               paddingBottom: 6,
//             }}
//           >
//             {t}
//           </span>
//         ))}
//       </div>

//       {/* SEARCH */}
//       <input
//         placeholder="Search jobs, skills..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         style={{ width: "100%", margin: "12px 0", padding: 10 }}
//       />

//       {/* FILTER BUTTON */}
//       <button
//         onClick={() => setShowFilter(true)}
//         style={{ marginBottom: 12 }}
//       >
//         Filter
//       </button>

//       {/* SORT */}
//       <div style={{ display: "flex", gap: 10 }}>
//         {["Newest", "Oldest"].map((s) => (
//           <button
//             key={s}
//             onClick={() => setSort(sort === s ? "" : s)}
//           >
//             {s}
//           </button>
//         ))}
//       </div>

//       {/* JOB LIST */}
//       <div style={{ marginTop: 20 }}>
//         {jobs.length === 0 && <p>No jobs found</p>}

//         {jobs.map((job) => {
//           const isSaved = savedIds.includes(job.id);
//           return (
//             <div
//               key={job.id}
//               style={{
//                 border: "1px solid #ccc",
//                 borderRadius: 16,
//                 padding: 16,
//                 marginBottom: 16,
//                 cursor: "pointer",
//               }}
//               onClick={() => {
//                 incrementViewOnce(
//                   tab === "24 hour" ? "service_24h" : "services",
//                   job.id
//                 );
//                 navigate(`/client-dashbroad2/service/${job.id}`);
//               }}
//             >
//               <h3>{job.title}</h3>


//               {/* SKILLS */}
//               <div style={{ display: "flex", gap: 6 }}>
//                 {(job.skills || []).slice(0, 3).map((s) => (
//                   <span
//                     key={s}
//                     style={{
//                       background: skillColor(s),
//                       padding: "4px 10px",
//                       borderRadius: 20,
//                     }}
//                   >
//                     {s}
//                   </span>
//                 ))}
//               </div>

//               {/* FOOTER */}
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   marginTop: 10,
//                 }}
//               >
//                 <span>
//                   ₹{formatCurrency(job.budget_from)} – ₹
//                   {formatCurrency(job.budget_to)}
//                 </span>
//                 {/* <FiEye /> <span>{job.views || 0} view</span> */}
//                 <p className="job-desc">
//                   {job.description?.slice(0, 180)}
//                   {job.description?.length > 180 ? "..." : ""}
//                 </p>
//                 <span style={{ fontSize: 12, color: "#777" }}>
//                   {timeAgo(job.createdAt)}
//                 </span>
//                 <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
//                   <FiEye /> {job.views || 0}
//                 </span>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     toggleSave(job.id, isSaved);
//                   }}
//                 >
//                   {isSaved ? "★" : "☆"}
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* ==================================================
//          FILTER MODAL
//       ================================================== */}
//       {showFilter && (
//         <div style={modalStyle}>
//           <FilterScreen
//             initialFilter={filter}
//             onClose={() => setShowFilter(false)}
//             onApply={(appliedFilter) => {
//               setFilter(appliedFilter); // ✅ APPLY FILTER
//               setShowFilter(false);
//             }}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// /* ======================================================
//    MODAL STYLE
// ====================================================== */
// const modalStyle = {
//   position: "fixed",
//   inset: 0,
//   background: "rgba(0,0,0,0.35)",
//   zIndex: 999,
//   overflowY: "auto",
// };





// import React, { useEffect, useMemo, useState } from "react";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   runTransaction,
//   updateDoc,
//   arrayUnion,
//   arrayRemove,
//   Timestamp,
// } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { db } from "../../firbase/Firebase";
// import { useNavigate } from "react-router-dom";
// import { FiEye } from "react-icons/fi";
// import FilterScreen, { JobFilter } from "./Filter"; // ✅ FILTER IMPORT
// import { Bookmark, Clock } from "lucide-react";
// import { BsBookmarkFill, BsFillBookFill, BsFillBookmarkCheckFill } from "react-icons/bs";

// /* ======================================================
//    HELPERS
// ====================================================== */
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

// /* ======================================================
//    MAIN COMPONENT
// ====================================================== */
// export default function CategoryPage({ initialTab = "Freelancer" }) {
//   const auth = getAuth();
//   const user = auth.currentUser;
//   const navigate = useNavigate();

//   /* ================= STATE ================= */
//   const [tab, setTab] = useState(initialTab);
//   const [search, setSearch] = useState("");
//   const [sort, setSort] = useState("");

//   const [filter, setFilter] = useState(new JobFilter()); // 🔥 FILTER STATE
//   const [showFilter, setShowFilter] = useState(false);  // 🔥 MODAL STATE

//   const [services, setServices] = useState([]);
//   const [services24, setServices24] = useState([]);
//   const [savedIds, setSavedIds] = useState([]);

//   function timeAgo(ts) {
//     if (!ts) return "Just now";
//     const d = ts instanceof Timestamp ? ts.toDate() : new Date(ts);
//     const diff = (Date.now() - d.getTime()) / 1000;

//     if (diff < 60) return `${Math.floor(diff)}s ago`;
//     if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
//     if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
//     return `${Math.floor(diff / 86400)}d ago`;
//   }


//   /* ======================================================
//      FIRESTORE LISTENERS
//   ====================================================== */
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

//   /* ======================================================
//      VIEW INCREMENT (ONCE PER USER)
//   ====================================================== */
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

//   /* ======================================================
//      FILTER + SORT LOGIC
//   ====================================================== */
//   const applyFilter = (jobs) => {
//     return jobs
//       .filter((j) => {
//         const title = (j.title || "").toLowerCase();
//         const category = (j.category || "").toLowerCase();
//         const skills = j.skills || [];

//         // 🔍 SEARCH
//         if (search) {
//           const q = search.toLowerCase();
//           if (
//             !title.includes(q) &&
//             !category.includes(q) &&
//             !skills.some((s) => s.toLowerCase().includes(q))
//           )
//             return false;
//         }

//         // 🎯 CATEGORY
//         if (
//           filter.categories.length &&
//           !filter.categories.includes(j.category)
//         )
//           return false;

//         // 🛠 SKILLS
//         if (
//           filter.skills.length &&
//           !skills.some((s) => filter.skills.includes(s))
//         )
//           return false;

//         // 💰 PRICE
//         const from = Number(j.budget_from || 0);
//         const to = Number(j.budget_to || 0);

//         if (filter.minPrice !== null && to < filter.minPrice) return false;
//         if (filter.maxPrice !== null && from > filter.maxPrice) return false;

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

//   /* ======================================================
//      FINAL JOB LIST
//   ====================================================== */
//   const jobs = useMemo(() => {
//     if (tab === "Freelancer") return applyFilter(services);
//     if (tab === "24 hour") return applyFilter(services24);
//     return [...services, ...services24].filter((j) =>
//       savedIds.includes(j.id)
//     );
//   }, [tab, services, services24, savedIds, search, filter, sort]);

//   /* ======================================================
//      SAVE / UNSAVE
//   ====================================================== */
//   const toggleSave = async (jobId, isSaved) => {
//     await updateDoc(doc(db, "users", user.uid), {
//       savedJobs: isSaved
//         ? arrayRemove(jobId)
//         : arrayUnion(jobId),
//     });
//   };

//   /* ======================================================
//      UI
//   ====================================================== */
//   return (
//     <div style={{ padding: 20 }}>
//       <h2 style={{ textAlign: "center" }}>Explore Freelancer</h2>

//       {/* TABS */}
//       <div style={{ display: "flex", gap: 24 }}>
//         {["Freelancer", "24 hour", "Saved"].map((t) => (
//           <span
//             key={t}
//             onClick={() => setTab(t)}
//             style={{
//               cursor: "pointer",
//               borderBottom: tab === t ? "3px solid gold" : "none",
//               paddingBottom: 6,
//             }}
//           >
//             {t}
//           </span>
//         ))}
//       </div>

//       {/* SEARCH */}
//       <input
//         placeholder="Search jobs, skills..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         style={{ width: "100%", margin: "12px 0", padding: 10 }}
//       />

//       {/* FILTER BUTTON */}
//       {/* <button
//         onClick={() => setShowFilter(true)}
//         style={{ marginBottom: 12 }}
//       >
//         Filter
//       </button> */}

//       {/* SORT */}
//       {/* <div style={{ display: "flex", gap: 10 }}>
//         {["Newest", "Oldest"].map((s) => (
//           <button
//             key={s}
//             onClick={() => setSort(sort === s ? "" : s)}
//           >
//             {s}
//           </button>
//         ))}
//       </div> */}

//       {/* JOB LIST */}
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
//                 boxShadow: "0 14px 40px rgba(0,0,0,0.12)",
//               }}
//             >
//               {/* HEADER */}
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

//                 <div style={{ fontSize: 18, fontWeight: 600 }}>
//                   ₹ {formatCurrency(job.budget_from)} / per day
//                 </div>
//               </div>

//               {/* SKILLS */}
//               <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
//                 {(job.skills || []).slice(0, 3).map((s) => (
//                   <span
//                     key={s}
//                     style={{
//                       // background: skillColor(s),
//                       background:"#FFF085B2",
//                       padding: "6px 14px",
//                       borderRadius: 999,
//                       fontSize: 13,
//                       fontWeight: 500,
//                     }}
//                   >
//                     {s}
//                   </span>
//                 ))}
//                 {job.skills?.length > 3 && (
//                   <span
//                     style={{
//                       background: "#FFF085B2",
//                       padding: "6px 14px",
//                       borderRadius: 999,
//                       fontSize: 13,
//                     }}
//                   >
//                    + {job.skills.length - 3}
//                   </span>
//                 )}
//               </div>

//               {/* DESCRIPTION */}
//               <p
//                 style={{
//                   fontSize: 14,
//                   color: "#555",
//                   lineHeight: 1.6,
//                   marginBottom: 14,
//                 }}
//               >
//                 {job.description?.slice(0, 180)}
//                 {job.description?.length > 180 ? "..." : ""}
//               </p>

//               {/* FOOTER */}
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
//                   <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
//                     <FiEye /> {job.views || 0} Impression
//                   </span>
//                     <span style={{ display: "flex", gap: 6, alignItems: "center" }}><Clock size={14}/>{timeAgo(job.createdAt)}</span>
//                 </div>

//                 <div
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     toggleSave(job.id, savedIds.includes(job.id));
//                   }}

//                 >
//                   {savedIds.includes(job.id) ? <BsBookmarkFill size={20}/>:<Bookmark/>  }
//                 </div>
//               </div>
//             </div>

//           );
//         })}
//       </div>

//       {/* ==================================================
//          FILTER MODAL
//       ================================================== */}
//       {showFilter && (
//         <div style={modalStyle}>
//           <FilterScreen
//             initialFilter={filter}
//             onClose={() => setShowFilter(false)}
//             onApply={(appliedFilter) => {
//               setFilter(appliedFilter); // ✅ APPLY FILTER
//               setShowFilter(false);
//             }}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// /* ======================================================
//    MODAL STYLE
// ====================================================== */
// const modalStyle = {
//   position: "fixed",
//   inset: 0,
//   background: "rgba(0,0,0,0.35)",
//   zIndex: 999,
//   overflowY: "auto",
// };




// import React, { useEffect, useMemo, useState } from "react";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   runTransaction,
//   updateDoc,
//   arrayUnion,
//   arrayRemove,
//   Timestamp,
// } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { db } from "../../firbase/Firebase";
// import { useNavigate } from "react-router-dom";
// import { FiEye } from "react-icons/fi";
// import FilterScreen, { JobFilter } from "./Filter"; // ✅ FILTER IMPORT
// import { Bookmark, Clock } from "lucide-react";
// import { BsBookmarkFill, BsFillBookFill, BsFillBookmarkCheckFill } from "react-icons/bs";
// import "./clientsideCategorypage.css"
// import sortimg from "../../assets/sort.png"
// import backarrow from "../../assets/backarrow.png"

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

// /* ======================================================
//    MAIN COMPONENT
// ====================================================== */
// export default function CategoryPage({ initialTab = "Work" }) {
//   const auth = getAuth();
//   const user = auth.currentUser;
//   const navigate = useNavigate();

//   /* ================= STATE ================= */
//   const [tab, setTab] = useState(initialTab);
//   const [search, setSearch] = useState("");
//   const [sort, setSort] = useState("");

//   const [filter, setFilter] = useState(new JobFilter()); // 🔥 FILTER STATE
//   const [showFilter, setShowFilter] = useState(false);  // 🔥 MODAL STATE

//   const [services, setServices] = useState([]);
//   const [services24, setServices24] = useState([]);
//   const [savedIds, setSavedIds] = useState([]);



//   const getJobDate = (date) => {
//     if (!date) return null;

//     // Firestore Timestamp
//     if (date instanceof Timestamp) {
//       return date.toDate();
//     }

//     // Timestamp object
//     if (date?.seconds) {
//       return new Date(date.seconds * 1000);
//     }

//     // JS Date
//     if (date instanceof Date) return date;

//     // String date
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


//   /* ======================================================
//      FIRESTORE LISTENERS
//   ====================================================== */
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
//   const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//     if (!currentUser) return;

//     const userRef = doc(db, "users", currentUser.uid);
//     const snap = await getDoc(userRef);

//     if (snap.exists()) {
//       setUserProfile(snap.data());
//     }
//   });

//   return unsubscribe;
// }, []);

// useEffect(() => {
//   const user = auth.currentUser;
//   if (!user) return;

//   const q = query(
//     collection(db, "notifications"),
//     where("clientUid", "==", user.uid)
//   );

//   return onSnapshot(q, (snap) => {
//     setNotifications(
//       snap.docs.map((d) => ({ id: d.id, ...d.data() }))
//     );
//   });
// }, []);

// async function acceptNotif(item) {
//   await updateDoc(
//     doc(db, "notifications", item.id),
//     { read: true }
//   );

//   navigate("/chat", {
//     state: {
//       currentUid: auth.currentUser.uid,
//       otherUid: item.freelancerId,
//       otherName: item.freelancerName,
//       otherImage: item.freelancerImage,
//       initialMessage: `Your application for ${item.jobTitle} accepted!`,
//     },
//   });
// }






//   /* ======================================================
//      VIEW INCREMENT (ONCE PER USER)
//   ====================================================== */
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

//         // 🔍 SEARCH
//         if (search) {
//           const q = search.toLowerCase();
//           if (
//             !title.includes(q) &&
//             !category.includes(q) &&
//             !skills.some((s) => s.toLowerCase().includes(q))
//           ) return false;
//         }

//         // 🎯 CATEGORY
//         if (filter.categories.length && !filter.categories.includes(j.category))
//           return false;

//         // 🛠 SKILLS
//         if (
//           filter.skills.length &&
//           !skills.some((s) => filter.skills.includes(s))
//         ) return false;

//         // 💰 PRICE
//         const from = Number(j.budget_from ?? j.budget ?? 0);
//         const to = Number(j.budget_to ?? j.budget ?? from);

//         if (filter.minPrice !== null && to < filter.minPrice) return false;
//         if (filter.maxPrice !== null && from > filter.maxPrice) return false;

//         // ⏱ POSTED TIME


//         // ⏱ POSTED TIME (FIXED)
//         if (filter.deliveryTime) {
//           const createdDate = getJobDate(j.createdAt || j.postedAt);

//           // If job has no date, don't hide it
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

//   /* ======================================================
//      FINAL JOB LIST
//   ====================================================== */
//   const jobs = useMemo(() => {
//     if (tab === "Work") return applyFilter(services);
//     if (tab === "24 hour") return applyFilter(services24);
//     return [...services, ...services24].filter((j) =>
//       savedIds.includes(j.id)
//     );
//   }, [tab, services, services24, savedIds, search, filter, sort]);

//   /* ======================================================
//      SAVE / UNSAVE
//   ====================================================== */
//   const toggleSave = async (jobId, isSaved) => {
//     await updateDoc(doc(db, "users", user.uid), {
//       savedJobs: isSaved
//         ? arrayRemove(jobId)
//         : arrayUnion(jobId),
//     });
//   };

//   /* ======================================================
//      UI
//   ====================================================== */
//   return (
//     <div style={{ padding: 210, marginTop: "-160px" }}>
//       <div style={{ display: "flex", alignItems: "center", gap: 12, }}>
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
//           <div style={{ fontSize: 32, fontWeight: 400 }}>Explore Freelancer</div>
//         </div>
//       </div>
//       <div id="fh-header-right" className="fh-header-right">
//         <button className="icon-btn" onClick={() => navigate("/client-dashbroad2/messages")}>
//           <FiMessageCircle />
//         </button>

//         <button className="icon-btn" onClick={() => setNotifOpen(true)}>
//           <FiBell />
//           {pending > 0 && (
//             <span
//               style={{
//                 width: 8,
//                 height: 8,
//                 borderRadius: "50%",
//                 background: "red",
//                 position: "absolute",
//                 top: 6,
//                 right: 5,
//               }}
//             ></span>
//           )}
//         </button>

//         <div className="fh-avatar">
//           <Link to={"/client-dashbroad2/CompanyProfileScreen"}>
//             <img
//               src={
//                 userProfile?.profileImage || profile
//               }
//               alt="Profile"
//             />
//           </Link>
//         </div>

//       </div>


//       <input
//         id="job-search"
//         placeholder="Search jobs, skills..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />
//       <button
//         id="sortimg"
//         onClick={() => setShowFilter(true)}
//       >
//         <img src={sortimg} alt="Sort" />
//         Sort
//       </button>
//       {/* FILTER BUTTON */}
//       <div id="sort-wrapper">


//         {/* SORT */}

//         {["Newest", "Oldest"].map((s) => (
//           <button
//             key={s}
//             className={`sort-btn ${sort === s ? "active" : ""}`}
//             onClick={() => setSort(sort === s ? "" : s)}
//           >
//             {s}
//           </button>
//         ))}

//       </div>

//       {/* TABS */}
//       <div id="job-tabs">
//         {["Work", "24 hour", "Saved"].map((t) => (
//           <span
//             key={t}
//             id={`tab-${t.replace(" ", "").toLowerCase()}`}
//             className={`job-tab ${tab === t ? "active" : ""}`}
//             onClick={() => setTab(t)}
//           >
//             {t}
//           </span>
//         ))}
//       </div>





//       {/* JOB LIST */}

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
//                 boxShadow: "0 14px 40px rgba(0,0,0,0.12)",
//               }}
//             >
//               {/* HEADER */}
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

//                 <div style={{ fontSize: 18, fontWeight: 600 }}>
//                   ₹ {formatCurrency(job.budget_from)} / per day
//                 </div>
//               </div>

//               {/* SKILLS */}
//               <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
//                 {(job.skills || []).slice(0, 3).map((s) => (
//                   <span
//                     key={s}
//                     style={{
//                       // background: skillColor(s),
//                       background: "#FFF085B2",
//                       padding: "6px 14px",
//                       borderRadius: 999,
//                       fontSize: 13,
//                       fontWeight: 500,
//                     }}
//                   >
//                     {s}
//                   </span>
//                 ))}
//                 {job.skills?.length > 3 && (
//                   <span
//                     style={{
//                       background: "#FFF085B2",
//                       padding: "6px 14px",
//                       borderRadius: 999,
//                       fontSize: 13,
//                     }}
//                   >
//                     + {job.skills.length - 3}
//                   </span>
//                 )}
//               </div>

//               {/* DESCRIPTION */}
//               <p
//                 style={{
//                   fontSize: 14,
//                   color: "#555",
//                   lineHeight: 1.6,
//                   marginBottom: 14,
//                 }}
//               >
//                 {job.description?.slice(0, 180)}
//                 {job.description?.length > 180 ? "..." : ""}
//               </p>

//               {/* FOOTER */}
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
//                   <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
//                     <FiEye /> {job.views || 0} Impression
//                   </span>
//                   <span style={{ display: "flex", gap: 6, alignItems: "center" }}><Clock size={14} />{timeAgo(job.createdAt)}</span>
//                 </div>

//                 <div
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     toggleSave(job.id, savedIds.includes(job.id));
//                   }}

//                 >
//                   {savedIds.includes(job.id) ? <BsBookmarkFill size={20} /> : <Bookmark />}
//                 </div>
//               </div>
//             </div>

//           );
//         })}
//       </div>

//       {/* ==================================================
//          FILTER MODAL
//       ================================================== */}
//       {showFilter && (
//         <div style={modalStyle}>
//           <FilterScreen
//             initialFilter={filter}
//             onClose={() => setShowFilter(false)}
//             onApply={(appliedFilter) => {
//               setFilter(appliedFilter); // ✅ APPLY FILTER
//               setShowFilter(false);
//             }}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// /* ======================================================
//    MODAL STYLE
// ====================================================== */
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
import { db } from "../../firbase/Firebase";
import { useNavigate, Link } from "react-router-dom";
import { FiEye, FiMessageCircle, FiBell } from "react-icons/fi";
import FilterScreen, { JobFilter } from "./Filter";
import { Bookmark, Clock } from "lucide-react";
import { BsBookmarkFill } from "react-icons/bs";
import "./clientsideCategorypage.css";
import sortimg from "../../assets/sort.png";
import backarrow from "../../assets/backarrow.png";
import profile from "../../assets/profile.png";
import message from "../../assets/message.png";
import notifiaction from "../../assets/notification.png";
import filter1 from "../../assets/Filter.png";
import search1 from "../../assets/search.png";

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

export default function CategoryPage({ initialTab = "Work" }) {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [tab, setTab] = useState(initialTab);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const [filter, setFilter] = useState(new JobFilter());
  const [showFilter, setShowFilter] = useState(false);

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
  }

  const incrementViewOnce = async (collectionName, jobId) => {
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
    await updateDoc(doc(db, "users", user.uid), {
      savedJobs: isSaved ? arrayRemove(jobId) : arrayUnion(jobId),
    });
  };

  return (
    <div style={{ padding: 210, marginTop: "-160px" }}>
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

      <div id="fh-header-right" className="fh-header-right" style={{ marginTop: "1px" }}>

        <img onClick={() => navigate("/client-dashbroad2/messages")} style={{ width: "26px" }} src={message} alt="message" />




        <img onClick={() => setNotifOpen(true)} src={notifiaction} style={{ width: "26px" }} alt="notifiaction" />
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
          ></span>
        )}


        <div className="fh-avatar">
          <Link to={"/client-dashbroad2/companyprofileview"}>
            <img style={{ width: "34px", padding: "3px", height: "34px" }} src={userProfile?.profileImage || profile} alt="Profile" />
          </Link>
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
            height: "1%"
          }}
        >
          <img
            src={search1}
            alt="search"
            style={{
              width: 18,
              height: 18,
              opacity: 0.6,
              marginLeft: '13px',
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
              marginLeft: '0px',

              height: "19px",        // ✅ INPUT HEIGHT SMALL
              lineHeight: "21px",    // ✅ TEXT CENTER ALIGN
              padding: "0",          // ✅ EXTRA SPACE REMOVE
              marginTop: "12px"
            }}
          />

        </div>

      </div>

      {showSort && (
        <div
          ref={sortRef}        // ✅ IMPORTANT
          id="sort-wrapper"
          style={{
            position: "absolute",
            marginLeft: "810px",
            marginTop: "130px",
            background: "#fff",
            borderRadius: "30px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
            padding: "16px",
            zIndex: 1000,
            width: "360px",
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

                /* 👇 animation magic */
                opacity: showSort ? 1 : 0,
                transform: showSort
                  ? "translateY(0px)"
                  : "translateY(10px)",
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
          // background: "linear-gradient(90deg, #f6e9ff, #fff7d6)",
          borderRadius: "18px",
          boxShadow: "0 10px 22px rgba(0,0,0,0.12)",
          marginTop: "30px"
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
                  padding: "4px 28px",
                  borderRadius: "999px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: isActive ? 600 : 500,
                  color: "#333",
                  background: isActive ? "#7C3CFF" : "transparent",
                  boxShadow: isActive
                    ? "0 4px 10px rgba(0,0,0,0.15)"
                    : "none",
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

      {/* RIGHT – SORT */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "10px 14px",
          // backgroundColor:"green",
          marginTop: '15px'
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
            marginLeft: "1000px",


          }}
        >
          <img
            src={filter1}
            alt="Filter"
            style={{ width: 18, height: 18 }}
          />
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
          <img
            src={sortimg}
            alt="Sort"
            style={{ width: 18, height: 18 }}
          />
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


                <div id="job-budget" className="job-budget">₹{job.budget_from || job.budget} - {job.budget_to || job.budget}</div>
              </div>
              <div style={{ fontSize: "14", marginTop: "10px", color: "gray", fontWeight: "400" }}>Skills Required</div>
              <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
                {(job.skills || []).slice(0, 3).map((s) => (
                  <span
                    key={s}
                    style={{
                      background: "#FFF085B2",
                      padding: "6px 14px",
                      borderRadius: 999,
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    {s}
                  </span>
                ))}
                {job.skills?.length > 3 && (
                  <span
                    style={{
                      background: "#FFF085B2",
                      padding: "6px 14px",
                      borderRadius: 999,
                      fontSize: 13,
                    }}
                  >
                    + {job.skills.length - 3}
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
                  style={{ marginTop: '-240px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSave(job.id, savedIds.includes(job.id));
                  }}
                >
                  {savedIds.includes(job.id) ? (
                    <BsBookmarkFill size={20} />
                  ) : (
                    <Bookmark />
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