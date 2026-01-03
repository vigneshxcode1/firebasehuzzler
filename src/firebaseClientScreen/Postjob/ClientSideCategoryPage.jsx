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












import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  runTransaction,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firbase/Firebase";
import { useNavigate } from "react-router-dom";
import { FiEye } from "react-icons/fi";
import FilterScreen, { JobFilter } from "./Filter"; // ✅ FILTER IMPORT

/* ======================================================
   HELPERS
====================================================== */
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

/* ======================================================
   MAIN COMPONENT
====================================================== */
export default function CategoryPage({ initialTab = "Freelancer" }) {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [tab, setTab] = useState(initialTab);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const [filter, setFilter] = useState(new JobFilter()); // 🔥 FILTER STATE
  const [showFilter, setShowFilter] = useState(false);  // 🔥 MODAL STATE

  const [services, setServices] = useState([]);
  const [services24, setServices24] = useState([]);
  const [savedIds, setSavedIds] = useState([]);

  function timeAgo(ts) {
    if (!ts) return "Just now";
    const d = ts instanceof Timestamp ? ts.toDate() : new Date(ts);
    const diff = (Date.now() - d.getTime()) / 1000;

    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }


  /* ======================================================
     FIRESTORE LISTENERS
  ====================================================== */
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

  /* ======================================================
     VIEW INCREMENT (ONCE PER USER)
  ====================================================== */
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

  /* ======================================================
     FILTER + SORT LOGIC
  ====================================================== */
  const applyFilter = (jobs) => {
    return jobs
      .filter((j) => {
        const title = (j.title || "").toLowerCase();
        const category = (j.category || "").toLowerCase();
        const skills = j.skills || [];

        // 🔍 SEARCH
        if (search) {
          const q = search.toLowerCase();
          if (
            !title.includes(q) &&
            !category.includes(q) &&
            !skills.some((s) => s.toLowerCase().includes(q))
          )
            return false;
        }

        // 🎯 CATEGORY
        if (
          filter.categories.length &&
          !filter.categories.includes(j.category)
        )
          return false;

        // 🛠 SKILLS
        if (
          filter.skills.length &&
          !skills.some((s) => filter.skills.includes(s))
        )
          return false;

        // 💰 PRICE
        const from = Number(j.budget_from || 0);
        const to = Number(j.budget_to || 0);

        if (filter.minPrice !== null && to < filter.minPrice) return false;
        if (filter.maxPrice !== null && from > filter.maxPrice) return false;

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

  /* ======================================================
     FINAL JOB LIST
  ====================================================== */
  const jobs = useMemo(() => {
    if (tab === "Freelancer") return applyFilter(services);
    if (tab === "24 hour") return applyFilter(services24);
    return [...services, ...services24].filter((j) =>
      savedIds.includes(j.id)
    );
  }, [tab, services, services24, savedIds, search, filter, sort]);

  /* ======================================================
     SAVE / UNSAVE
  ====================================================== */
  const toggleSave = async (jobId, isSaved) => {
    await updateDoc(doc(db, "users", user.uid), {
      savedJobs: isSaved
        ? arrayRemove(jobId)
        : arrayUnion(jobId),
    });
  };

  /* ======================================================
     UI
  ====================================================== */
  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: "center" }}>Explore Freelancer</h2>

      {/* TABS */}
      <div style={{ display: "flex", gap: 24 }}>
        {["Freelancer", "24 hour", "Saved"].map((t) => (
          <span
            key={t}
            onClick={() => setTab(t)}
            style={{
              cursor: "pointer",
              borderBottom: tab === t ? "3px solid gold" : "none",
              paddingBottom: 6,
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search jobs, skills..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", margin: "12px 0", padding: 10 }}
      />

      {/* FILTER BUTTON */}
      <button
        onClick={() => setShowFilter(true)}
        style={{ marginBottom: 12 }}
      >
        Filter
      </button>

      {/* SORT */}
      <div style={{ display: "flex", gap: 10 }}>
        {["Newest", "Oldest"].map((s) => (
          <button
            key={s}
            onClick={() => setSort(sort === s ? "" : s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* JOB LIST */}
      <div style={{ marginTop: 20 }}>
        {jobs.length === 0 && <p>No jobs found</p>}

        {jobs.map((job) => {
          const isSaved = savedIds.includes(job.id);
          return (
            <div
              key={job.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: 16,
                padding: 16,
                marginBottom: 16,
                cursor: "pointer",
              }}
              onClick={() => {
                incrementViewOnce(
                  tab === "24 hour" ? "service_24h" : "services",
                  job.id
                );
                navigate(`/job/${job.id}`);
              }}
            >
              <h3>{job.title}</h3>


              {/* SKILLS */}
              <div style={{ display: "flex", gap: 6 }}>
                {(job.skills || []).slice(0, 3).map((s) => (
                  <span
                    key={s}
                    style={{
                      background: skillColor(s),
                      padding: "4px 10px",
                      borderRadius: 20,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* FOOTER */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <span>
                  ₹{formatCurrency(job.budget_from)} – ₹
                  {formatCurrency(job.budget_to)}
                </span>
                {/* <FiEye /> <span>{job.views || 0} view</span> */}
                <p className="job-desc">
                  {job.description?.slice(0, 180)}
                  {job.description?.length > 180 ? "..." : ""}
                </p>
                <span style={{ fontSize: 12, color: "#777" }}>
                  {timeAgo(job.createdAt)}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <FiEye /> {job.views || 0}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSave(job.id, isSaved);
                  }}
                >
                  {isSaved ? "★" : "☆"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ==================================================
         FILTER MODAL
      ================================================== */}
      {showFilter && (
        <div style={modalStyle}>
          <FilterScreen
            initialFilter={filter}
            onClose={() => setShowFilter(false)}
            onApply={(appliedFilter) => {
              setFilter(appliedFilter); // ✅ APPLY FILTER
              setShowFilter(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

/* ======================================================
   MODAL STYLE
====================================================== */
const modalStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.35)",
  zIndex: 999,
  overflowY: "auto",
};









