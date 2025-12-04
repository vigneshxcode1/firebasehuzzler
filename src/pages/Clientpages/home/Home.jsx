
// import React, { useEffect, useRef, useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   collection,
//   query,
//   orderBy,
//   onSnapshot,
//   Timestamp,
// } from "firebase/firestore";
// import { db } from "../firbase/Firebase";

// // ====== ASSETS ======
// import browseImg1 from "../assets/Container.png";
// import browseImg2 from "../assets/wave.png";
// import worksImg1 from "../assets/file.png";
// import worksImg2 from "../assets/yellowwave.png";
// import arrow from "../assets/arrow.png";
// import profile from "../assets/profile.png";

// // ====== ICONS ======
// import {
//   FiSearch,
//   FiMessageCircle,
//   FiBell,
//   FiPlus,
//   FiBookmark,
//   FiEye,
// } from "react-icons/fi";

// // ======================================================
// // HELPER FUNCTIONS
// // ======================================================
// function parseIntSafe(v) {
//   if (v === undefined || v === null) return null;
//   if (typeof v === "number") return Math.floor(v);
//   const s = String(v).replace(/[^0-9]/g, "");
//   const n = parseInt(s, 10);
//   return Number.isNaN(n) ? null : n;
// }

// function timeAgo(input) {
//   if (!input) return "N/A";
//   let date;
//   if (input instanceof Timestamp) {
//     date = input.toDate();
//   } else if (input instanceof Date) {
//     date = input;
//   } else {
//     date = new Date(input);
//   }
//   const diff = (Date.now() - date.getTime()) / 1000;
//   if (diff < 60) return `${Math.floor(diff)} sec ago`;
//   if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
//   if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
//   return `${Math.floor(diff / 86400)} days ago`;
// }

// function formatCurrency(amount) {
//   if (!amount && amount !== 0) return "₹0";
//   if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
//   if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
//   return `₹${amount}`;
// }

// // ======================================================
// // MAIN COMPONENT
// // ======================================================
// export default function ClientHomeUI() {
//   const navigate = useNavigate();

//   const [jobs, setJobs] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [savedJobs, setSavedJobs] = useState(new Set());
//   const searchRef = useRef(null);

//   // Fetch jobs
//   useEffect(() => {
//     const col1 = collection(db, "services");
//     const col2 = collection(db, "service_24h");

//     const unsub1 = onSnapshot(
//       query(col1, orderBy("createdAt", "desc")),
//       (snap) => {
//         const data = snap.docs.map((d) => ({
//           _id: d.id,
//           ...d.data(),
//           _source: "services",
//         }));
//         setJobs((prev) => mergeJobs(prev, data));
//       }
//     );

//     const unsub2 = onSnapshot(
//       query(col2, orderBy("createdAt", "desc")),
//       (snap) => {
//         const data = snap.docs.map((d) => ({
//           _id: d.id,
//           ...d.data(),
//           _source: "service_24h",
//         }));
//         setJobs((prev) => mergeJobs(prev, data));
//       }
//     );

//     return () => {
//       unsub1();
//       unsub2();
//     };
//   }, []);

//   function mergeJobs(prev, incoming) {
//     const map = new Map();
//     for (const p of prev) map.set(p._id + "::" + (p._source || ""), p);
//     for (const n of incoming) map.set(n._id + "::" + (n._source || ""), n);
//     return Array.from(map.values());
//   }

//   // Autocomplete
//   useEffect(() => {
//     const q = searchText.trim().toLowerCase();
//     if (!q) return setSuggestions([]);

//     const setS = new Set();
//     for (const job of jobs) {
//       if (job.title?.toLowerCase().includes(q)) setS.add(job.title);
//       if (Array.isArray(job.skills)) {
//         for (const s of job.skills) {
//           if (String(s).toLowerCase().includes(q)) setS.add(s);
//         }
//       }
//     }
//     setSuggestions(Array.from(setS).slice(0, 6));
//   }, [searchText, jobs]);

//   // Filtered jobs
//   const filteredJobs = useMemo(() => {
//     const q = searchText.trim().toLowerCase();
//     return jobs
//       .filter((j) => {
//         const title = (j.title || "").toLowerCase();
//         const desc = (j.description || "").toLowerCase();
//         const skills = Array.isArray(j.skills)
//           ? j.skills.map((s) => String(s).toLowerCase())
//           : [];
//         return (
//           !q ||
//           title.includes(q) ||
//           desc.includes(q) ||
//           skills.some((s) => s.includes(q))
//         );
//       })
//       .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
//   }, [jobs, searchText]);

//   function openJob(job) {
//     if (job._source === "service_24h") {
//       navigate(`/client-dashbroad2/service-24h/${job._id}`);
//     } else {
//       navigate(`/client-dashbroad2/service/${job._id}`);
//     }
//   }

//   function toggleSaveJob(jobId) {
//     setSavedJobs((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(jobId)) newSet.delete(jobId);
//       else newSet.add(jobId);
//       return newSet;
//     });
//   }

//   return (
//     <div className="fh-page rubik-font">
//       {/* CONTAINER */}
//       <div className="fh-container">
//         {/* HEADER */}
//         <header className="fh-header">
//           <div className="fh-header-left">
//             <h1 className="fh-title">
//               Welcome,
//               <div>Pixel Studios Pvt Ltd</div>
//             </h1>
//             <div className="fh-subtitle">
//               Discover projects that match your skills
//             </div>
//           </div>

//           <div className="fh-header-right">
//             <button className="icon-btn"><FiMessageCircle onClick={() => navigate("/messages")} /></button>
//             <button className="icon-btn"><FiBell /></button>

//             <div className="fh-avatar">
//               <img src={profile} alt="avatar" />
//             </div>
//           </div>

//           {/* SEARCH BAR */}
//           <div className="fh-search-row">
//             <div className="fh-search fh-search-small" ref={searchRef}>
//               <FiSearch className="search-icon" />
//               <input
//                 className="search-input"
//                 placeholder="Search"
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//               />
//               {searchText && (
//                 <button
//                   className="clear-btn"
//                   onClick={() => setSearchText("")}
//                 >
//                   ✕
//                 </button>
//               )}
//             </div>

//             {suggestions.length > 0 && (
//               <div className="autocomplete-list">
//                 {suggestions.map((s, i) => (
//                   <div
//                     key={i}
//                     className="autocomplete-item"
//                     onClick={() => {
//                       setSearchText(s);
//                       setSuggestions([]);
//                     }}
//                   >
//                     {s}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </header>

//         {/* MAIN */}
//         <main className="fh-main">
//           {/* HERO CARDS */}
//           <section className="fh-hero">

//             <div
//               className="fh-hero-card primary"
//               onClick={() => navigate("/client-dashbroad2/clientcategories")}
//               style={{ cursor: "pointer" }}
//             >
//               <img src={browseImg1} className="hero-img img-1" alt="" />
//               <img src={browseImg2} className="hero-img img-2" alt="" />

//               <div>
//                 <h3>Browse All Projects</h3>
//                 <p>Explore verified professionals</p>
//               </div>

//               <div className="hero-right">
//                 <img src={arrow} className="arrow" width={25} alt="" />
//               </div>
//             </div>


//             <div
//               className="fh-hero-card secondary"
//               onClick={() => navigate("/client-dashbroad2/AddJobScreen")}
//               style={{ cursor: "pointer" }}
//             >
//               <img src={worksImg1} className="hero-img img-3" alt="" />
//               <img src={worksImg2} className="hero-img img-4" alt="" />

//               <div>
//                 <h4>Job proposal</h4>
//                 <p>Find the right freelancers for your project</p>
//               </div>

//               <div className="hero-right">
//                 <img src={arrow} className="arrow" width={25} alt="" />
//               </div>
//             </div>

//           </section>


//           {/* RECOMMENDATIONS */}
//           <section className="fh-section">
//             <div className="section-header">
//               <h2>Top Services for You</h2>
//             </div>

//             <div className="jobs-list">
//               {filteredJobs.map((job) => (
//                 <article
//                   key={job._id}
//                   className="job-card"
//                   onClick={() => openJob(job)}
//                 >
//                   <div className="job-card-top">
//                     <div>
//                       <h3 className="job-title">{job.title}</h3>
//                       <div className="job-sub">
//                         {job.category || "Service"}
//                       </div>
//                     </div>

//                     <div className="job-budget-wrapper">
//                       <div className="job-budget">
//                         {formatCurrency(parseIntSafe(job.price ?? job.budget))}
//                       </div>
//                       <button
//                         className={`save-btn ${savedJobs.has(job._id) ? "saved" : ""}`}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           toggleSaveJob(job._id);
//                         }}
//                       >
//                         <FiBookmark />
//                       </button>
//                     </div>
//                   </div>

//                   <div className="job-skills">
//                     {(job.skills || []).slice(0, 3).map((skill, i) => (
//                       <span key={i} className="skill-chip">{skill}</span>
//                     ))}
//                   </div>

//                   <p className="job-desc">
//                     {job.description?.slice(0, 180)}
//                     {job.description?.length > 180 ? "..." : ""}
//                   </p>

//                   <div className="job-meta">
//                     <span className="views-count">
//                       <FiEye style={{ marginRight: "4px" }} />
//                       {job.views || job.impressions || 0} views
//                     </span>

//                     <div className="created">
//                       {timeAgo(job.createdAt)}
//                     </div>

//                     {job._source === "service_24h" && (
//                       <div className="views">⏱ 24 Hours</div>
//                     )}
//                   </div>
//                 </article>
//               ))}
//             </div>
//           </section>
//         </main>

//         {/* FAB BUTTON */}
//         <button
//           className="fh-fab"
//           onClick={() => navigate("/client-dashbroad2/PostJob")}
//         >
//           <FiPlus />
//         </button>
//       </div>

//       {/* EMBEDDED CSS */}
//       <style>{`
//         .fh-container {
//           max-width: 1200px;
//           margin: 0 auto;
//           padding: 0 20px;
//           margin-left:100px
//         }

//         .autocomplete-list {
//           position: absolute;
//           top: 100%;
//           left: 0;
//           right: 0;
//           background: #fff;
//           border: 1px solid #ccc;
//           border-radius: 6px;
//           max-height: 200px;
//           overflow-y: auto;
//           z-index: 10;
//         }
//         .autocomplete-item {
//           padding: 8px 12px;
//           cursor: pointer;
//         }
//         .autocomplete-item:hover {
//           background: #f0f0f0;
//         }

//         .save-btn {
//           background: none;
//           border: none;
//           cursor: pointer;
//           color: #888;
//           font-size: 1.3rem;
//           margin-left: 8px;
//           transition: color 0.2s;
//         }
//         .save-btn.saved {
//           color: #ff9800;
//         }
//         .save-btn:hover {
//           color: #ff9800;
//         }

//         .views-count {
//           display: inline-flex;
//           align-items: center;
//           gap: 4px;
//           color: #555;
//           font-size: 0.9rem;
//         }

//         @media (max-width: 768px) {
//           .fh-hero {
//             display: flex;
//             flex-direction: column;
//             gap: 20px;
//           }
//           .fh-hero-card, .job-card {
//             width: 100%;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }



import React, { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  where,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../../../firbase/Firebase";

// ====== ASSETS ======
// import browseImg1 from "../assets//Container.png";
// import browseImg2 from "../assets/wave.png";
// import worksImg1 from "../assets/file.png";
// import worksImg2 from "../assets/yellowwave.png";
// import arrow from "../assets/arrow.png";
// import profile from "../assets/profile.png";

// ====== ICONS ======
import {
  FiSearch,
  FiMessageCircle,
  FiBell,
  FiPlus,
  FiBookmark,
  FiEye,
} from "react-icons/fi";


// ======================================================
// HELPERS
// ======================================================
function parseIntSafe(v) {
  if (v === undefined || v === null) return null;
  if (typeof v === "number") return Math.floor(v);
  const s = String(v).replace(/[^0-9]/g, "");
  const n = parseInt(s, 10);
  return Number.isNaN(n) ? null : n;
}

function timeAgo(input) {
  if (!input) return "N/A";
  let d = input instanceof Timestamp ? input.toDate() : new Date(input);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)} sec ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

function formatCurrency(amount) {
  if (!amount && amount !== 0) return "₹0";
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
}

// ======================================================
// MAIN
// ======================================================
export default function ClientHomeUI() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const searchRef = useRef(null);

  // ================= NOTIFICATIONS ==================
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);

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

  const pending = notifications.filter((n) => !n.read).length;

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

  async function declineNotif(item) {
    await deleteDoc(doc(db, "notifications", item.id));
  }

  // ================= JOB FETCH ==================
  useEffect(() => {
    const col1 = collection(db, "services");
    const col2 = collection(db, "service_24h");

    const unsub1 = onSnapshot(
      query(col1, orderBy("createdAt", "desc")),
      (snap) => {
        const data = snap.docs.map((d) => ({
          _id: d.id,
          ...d.data(),
          _source: "services",
        }));
        setJobs((prev) => mergeJobs(prev, data));
      }
    );

    const unsub2 = onSnapshot(
      query(col2, orderBy("createdAt", "desc")),
      (snap) => {
        const data = snap.docs.map((d) => ({
          _id: d.id,
          ...d.data(),
          _source: "service_24h",
        }));
        setJobs((prev) => mergeJobs(prev, data));
      }
    );

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  function mergeJobs(prev, incoming) {
    const map = new Map();
    for (const p of prev) map.set(p._id + "::" + (p._source || ""), p);
    for (const n of incoming) map.set(n._id + "::" + (n._source || ""), n);
    return Array.from(map.values());
  }

  // ================= AUTOCOMPLETE ==================
  useEffect(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return setSuggestions([]);

    const setS = new Set();
    for (const job of jobs) {
      if (job.title?.toLowerCase().includes(q)) setS.add(job.title);
      if (Array.isArray(job.skills)) {
        for (const s of job.skills) {
          if (String(s).toLowerCase().includes(q)) setS.add(s);
        }
      }
    }
    setSuggestions(Array.from(setS).slice(0, 6));
  }, [searchText, jobs]);

  // ================= FILTER ==================
  const filteredJobs = useMemo(() => {
    const q = searchText.trim().toLowerCase();

    return jobs
      .filter((j) => {
        const t = (j.title || "").toLowerCase();
        const d = (j.description || "").toLowerCase();
        const skills = Array.isArray(j.skills)
          ? j.skills.map((s) => String(s).toLowerCase())
          : [];
        return (
          !q ||
          t.includes(q) ||
          d.includes(q) ||
          skills.some((s) => s.includes(q))
        );
      })
      .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
  }, [jobs, searchText]);

  // ================= OPEN JOB ==================
  function openJob(job) {
    if (job._source === "service_24h")
      navigate(`/client-dashbroad2/service-24h/${job._id}`);
    else navigate(`/client-dashbroad2/service/${job._id}`);
  }

  function toggleSaveJob(id) {
    setSavedJobs((prev) => {
      const ns = new Set(prev);
      if (ns.has(id)) ns.delete(id);
      else ns.add(id);
      return ns;
    });
  }

  // ======================================================
  // UI
  // ======================================================
  return (
    <div className="fh-page rubik-font">
      <div className="fh-container">
        {/* HEADER */}
        <header className="fh-header">
          <div className="fh-header-left">
            <h1 className="fh-title">
              Welcome,
              <div>Pixel Studios Pvt Ltd</div>
            </h1>
            <div className="fh-subtitle">Discover projects that match your skills</div>
          </div>

          <div className="fh-header-right">
            <button className="icon-btn" onClick={() => navigate("/messages")}>
              <FiMessageCircle />
            </button>

            {/* ------------------ NOTIFICATION BUTTON ------------------ */}
            <button className="icon-btn" onClick={() => setNotifOpen(true)}>
              <FiBell />
              {pending > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -3,
                    right: -3,
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
            </button>

            <div className="fh-avatar">
              <img src={profile} alt="avatar" />
            </div>
          </div>

          {/* SEARCH */}
          <div className="fh-search-row" ref={searchRef}>
            <div className="fh-search fh-search-small">
              <FiSearch className="search-icon" />
              <input
                className="search-input"
                placeholder="Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              {searchText && (
                <button className="clear-btn" onClick={() => setSearchText("")}>
                  ✕
                </button>
              )}
            </div>

            {suggestions.length > 0 && (
              <div className="autocomplete-list">
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    className="autocomplete-item"
                    onClick={() => {
                      setSearchText(s);
                      setSuggestions([]);
                    }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* ================= MAIN ================= */}
        <main className="fh-main">
          {/* HERO */}
          <section className="fh-hero">
            <div
              className="fh-hero-card primary"
              onClick={() => navigate("/client-dashbroad2/clientcategories")}
            >
              <img src={browseImg1} className="hero-img img-1" />
              <img src={browseImg2} className="hero-img img-2" />
              <div>
                <h3>Browse All Projects</h3>
                <p>Explore verified professionals</p>
              </div>
              <div className="hero-right">
                <img src={arrow} className="arrow" width={25} />
              </div>
            </div>

            <div
              className="fh-hero-card secondary"
              onClick={() => navigate("/client-dashbroad2/AddJobScreen")}
            >
              <img src={worksImg1} className="hero-img img-3" />
              <img src={worksImg2} className="hero-img img-4" />
              <div>
                <h4>Job proposal</h4>
                <p>Find the right freelancers</p>
              </div>
              <div className="hero-right">
                <img src={arrow} className="arrow" width={25} />
              </div>
            </div>
          </section>

          {/* ================= JOB LIST ================= */}
          <section className="fh-section">
            <div className="section-header">
              <h2>Top Services for You</h2>
            </div>

            <div className="jobs-list">
              {filteredJobs.map((job) => (
                <article key={job._id} className="job-card" onClick={() => openJob(job)}>
                  <div className="job-card-top">
                    <div>
                      <h3 className="job-title">{job.title}</h3>
                      <div className="job-sub">{job.category || "Service"}</div>
                    </div>

                    <div className="job-budget-wrapper">
                      <div className="job-budget">{formatCurrency(parseIntSafe(job.price))}</div>
                      <button
                        className={`save-btn ${savedJobs.has(job._id) ? "saved" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveJob(job._id);
                        }}
                      >
                        <FiBookmark />
                      </button>
                    </div>
                  </div>

                  <div className="job-skills">
                    {(job.skills || []).slice(0, 3).map((skill, i) => (
                      <span key={i} className="skill-chip">{skill}</span>
                    ))}
                  </div>

                  <p className="job-desc">
                    {job.description?.slice(0, 180)}
                    {job.description?.length > 180 ? "..." : ""}
                  </p>

                  <div className="job-meta">
                    <span className="views-count">
                      <FiEye />
                      {job.views || 0} views
                    </span>
                    <div>{timeAgo(job.createdAt)}</div>
                    {job._source === "service_24h" && <div>⏱ 24 Hours</div>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>

        {/* FAB */}
        <button className="fh-fab" onClick={() => navigate("/client-dashbroad2/PostJob")}>
          <FiPlus />
        </button>
      </div>

      {/* ================= NOTIFICATION POPUP ================= */}
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
            zIndex: 999,
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
              <div style={{ padding: 20, textAlign: "center" }}>No notifications</div>
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
                  src={item.freelancerImage || profile}
                  width={48}
                  height={48}
                  style={{ borderRadius: "50%", marginRight: 10 }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{item.freelancerName}</div>
                  <div>applied for {item.jobTitle}</div>
                </div>

                {!item.read ? (
                  <>
                    <button onClick={() => acceptNotif(item)} style={{ marginRight: 8 }}>
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

      {/* Embedded CSS */}
      <style>{`
        .autocomplete-list {
          position: absolute;
          background: #fff;
          width: 100%;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin-top: 4px;
          z-index: 20;
        }
        .autocomplete-item {
          padding: 8px 12px;
          cursor: pointer;
        }
        .autocomplete-item:hover {
          background: #eee;
        }
        .save-btn.saved {
          color: orange;
        }
      `}</style>
    </div>
  );
}
