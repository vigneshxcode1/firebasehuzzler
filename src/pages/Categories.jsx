



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

//   const [jobs, setJobs] = useState([]);
//   const [savedJobs, setSavedJobs] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [jobTab, setJobTab] = useState("24h");

//   const [categories, setCategories] = useState([]);

//   // FETCH JOBS
//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "jobs"), (snap) => {
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setJobs(
//         list.sort(
//           (a, b) =>
//             (b.created_at?.toDate?.() || 0) - (a.created_at?.toDate?.() || 0)
//         )
//       );
//     });
//     return unsub;
//   }, []);

//   // FETCH SAVED JOBS
//   useEffect(() => {
//     if (!user) return;
//     const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
//       setSavedJobs(snap.data()?.favoriteJobs || []);
//     });
//     return unsub;
//   }, [user]);

//   // FETCH CATEGORIES FROM DB
//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "users"), (snap) => {

//       // Get all category fields from users
//       const allCats = snap.docs
//         .map((d) => d.data().category)
//         .filter((cat) => cat && cat.trim() !== ""); // remove empty/null

//       // Remove duplicates
//       const uniqueCats = [...new Set(allCats)];

//       // Convert to array of objects for UI
//       const finalCats = uniqueCats.map((name, index) => ({
//         id: index + 1,
//         name,
//       }));

//       setCategories(finalCats);
//     });

//     return unsub;
//   }, []);


//    useEffect(() => {
//       const unsub1 = onSnapshot(collection(db, "jobs"), (snap) => {
//         const normalJobs = snap.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//           jobtype: "jobs",
//         }));
  
//         setJobs((prev) => {
//           const only24h = prev.filter((j) => j.jobtype === "jobs_24h");
//           return [...only24h, ...normalJobs];
//         });
//       });
  
//       const unsub2 = onSnapshot(collection(db, "jobs_24h"), (snap) => {
//         const fastJobs = snap.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//           jobtype: "jobs_24h",
//         }));
  
//         setJobs((prev) => {
//           const onlyNormal = prev.filter((j) => j.jobtype === "jobs");
//           return [...onlyNormal, ...fastJobs];
//         });
//       });
  
//       return () => {
//         unsub1();
//         unsub2();
//       };
//     }, []);
//   const toggleSave = async (jobId) => {
//     if (!user) return;
//     const ref = doc(db, "users", user.uid);
//     const updated = savedJobs.includes(jobId)
//       ? savedJobs.filter((id) => id !== jobId)
//       : [...savedJobs, jobId];

//     setSavedJobs(updated);
//     await updateDoc(ref, { favoriteJobs: updated });
//   };

//   const filteredJobs = jobs.filter((job) => {
//     const matchTab =
//       jobTab === "24h"
//         ? job.jobtype === "jobs_24h"
//         : jobTab === "full"
//           ? job.jobtype !== "jobs_24h"
//           : savedJobs.includes(job.id);

//     const matchSearch =
//       job.title?.toLowerCase().includes(searchText.toLowerCase()) ||
//       job.description?.toLowerCase().includes(searchText.toLowerCase());

//     const matchCategory = selectedCategory
//       ? job.category === selectedCategory
//       : true;

//     return matchTab && matchSearch && matchCategory;
//   });

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

//       {/* CATEGORIES (ONLY IF LIST > 0) */}
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

//         /* CATEGORIES */
//         .category-row { display: flex; gap: 10px; margin: 14px 0; overflow-x: auto; }
//         .category-btn, .category-active {
//           padding: 8px 14px; white-space: nowrap;
//           border-radius: 999px; cursor: pointer; font-weight: 600;
//         }
//         .category-btn { background: white; border: 1px solid #e2e8f0; color: #444; }
//         .category-active { background: #7c3aed; color: #fff; border: 1px solid #7c3aed; }

//         /* Tabs */
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




import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  query,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  where,
} from "firebase/firestore";

// NOTE: This file DOES NOT include Firebase initialization/config.
// Initialize Firebase in your app (e.g. firebase.js) and import it before using this component.
// Example: import "./firebase"; // where firebase initializes app

export default function SkillUsers({ skill = "" }) {
  const db = getFirestore();
  const auth = getAuth();
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState("Works Jobs");
  const [jobs, setJobs] = useState([]);
  const [jobs24, setJobs24] = useState([]);
  const [userDoc, setUserDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---------------- helpers ----------------
  const formatAmount = (amount) => {
    if (amount < 1000) return Math.round(amount).toString();
    if (amount < 1000000) return `${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}K`;
    return `${(amount / 1000000).toFixed(amount % 1000000 === 0 ? 0 : 1)}M`;
  };

  const timeAgo = (date) => {
    if (!date) return "";
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return `${diff} sec ago`;
    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
    const years = Math.floor(days / 365);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  };

  const parseCreatedAt = (value) => {
    if (!value) return null;
    // Firestore Timestamp has toDate(), but to avoid direct dependency we'll check
    if (value.toDate && typeof value.toDate === "function") return value.toDate();
    if (value instanceof Date) return value;
    if (typeof value === "string") return new Date(value);
    return null;
  };

  const safeNum = (v) => {
    if (v == null) return 0;
    if (typeof v === "number") return v;
    const n = Number(v.toString());
    return isNaN(n) ? 0 : n;
  };

  const randomSkillColor = (skillText) => {
    const colors = [
      "bg-blue-100",
      "bg-yellow-100",
      "bg-sky-100",
      "bg-purple-100",
      "bg-rose-100",
      "bg-green-100",
    ];
    return colors[Math.abs(hashCode(skillText)) % colors.length];
  };

  const hashCode = (s) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
      h = (h << 5) - h + s.charCodeAt(i);
      h |= 0;
    }
    return h;
  };

  // ---------------- data processing ----------------
  const processDocs = (docs) => {
    const arr = docs
      .map((d) => {
        const data = d.data();
        const title = (data.title || "").toString().trim();
        const description = (data.description || "").toString().trim();
        if (!title || !description) return null;
        return {
          id: d.id,
          title,
          description,
          skills: Array.isArray(data.skills) ? data.skills : [],
          tools: Array.isArray(data.tools) ? data.tools : [],
          budget_from: data.budget_from ?? data.budget ?? 0,
          budget_to: data.budget_to ?? "",
          budget: data.budget ?? 0,
          timeline: data.timeline ?? "",
          views: safeNum(data.views),
          applicants_count: safeNum(data.applicants_count),
          created_at: parseCreatedAt(data.created_at) || new Date(),
          raw: data,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.created_at - a.created_at);
    return arr;
  };

  const filterBySkill = (list, skillStr) => {
    if (!skillStr) return list;
    const norm = skillStr.trim().toLowerCase();
    return list.filter((job) => {
      const skills = (job.skills || []).map((s) => s.toString().toLowerCase());
      const tools = (job.tools || []).map((t) => t.toString().toLowerCase());
      return (
        skills.includes(norm) ||
        tools.includes(norm) ||
        skills.some((s) => s.includes(norm)) ||
        tools.some((t) => t.includes(norm))
      );
    });
  };

  // ---------------- listeners ----------------
  useEffect(() => {
    setLoading(true);
    setError(null);

    const jobsCol = collection(db, "jobs");
    const jobs24Col = collection(db, "jobs_24h");

    const unsubJobs = onSnapshot(
      jobsCol,
      (snap) => {
        setJobs(processDocs(snap.docs));
        setLoading(false);
      },
      (err) => setError(err)
    );

    const unsubJobs24 = onSnapshot(
      jobs24Col,
      (snap) => {
        setJobs24(processDocs(snap.docs));
        setLoading(false);
      },
      (err) => setError(err)
    );

    // listen to current user doc (if logged in)
    let unsubUser = () => {};
    const u = auth.currentUser;
    if (u) {
      const userRef = doc(db, "users", u.uid);
      unsubUser = onSnapshot(userRef, (snap) => setUserDoc(snap.exists() ? snap.data() : null));
    }

    return () => {
      unsubJobs();
      unsubJobs24();
      unsubUser();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------- derived data ----------------
  const displayedJobs = useMemo(() => {
    if (selectedTab === "Works Jobs") return filterBySkill(jobs, skill);
    if (selectedTab === "24 Hour Jobs") return filterBySkill(jobs24, skill);
    return []; // saved handled separately
  }, [selectedTab, jobs, jobs24, skill]);

  const savedJobIds = useMemo(() => {
    return userDoc?.favoriteJobs ? Array.from(userDoc.favoriteJobs) : [];
  }, [userDoc]);

  // ---------------- interactions ----------------
  const navigateToDetail = async (job, is24) => {
    try {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const colName = is24 ? "jobs_24h" : "jobs";
        const jobRef = doc(db, colName, job.id);
        // optimistic update for view count
        await updateDoc(jobRef, {
          viewedBy: arrayUnion(userId),
          views: increment(1),
        });
      }
    } catch (e) {
      // ignore errors for view increment
    }

    // use navigation (route names depend on your app)
    navigate(is24 ? `/job24/${job.id}` : `/job/${job.id}`, { state: { job } });
  };

  const toggleFavorite = async (jobId, isSaved) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return alert("Please login to save jobs");
    const userRef = doc(db, "users", uid);
    try {
      if (isSaved) {
        await updateDoc(userRef, { favoriteJobs: arrayRemove(jobId) });
      } else {
        await updateDoc(userRef, { favoriteJobs: arrayUnion(jobId) });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSavedJobs = async () => {
    const ids = savedJobIds;
    if (!ids || ids.length === 0) return [];
    // naive strategy: query both collections and filter locally
    const snaps = await Promise.all([getDocs(collection(db, "jobs")), getDocs(collection(db, "jobs_24h"))]);
    const all = [...snaps[0].docs, ...snaps[1].docs];
    return all.filter((d) => ids.includes(d.id));
  };

  // ---------------- UI components ----------------
  const Tab = ({ label }) => {
    const isSelected = selectedTab === label;
    return (
      <button
        onClick={() => setSelectedTab(label)}
        className={`flex flex-col items-center px-3 py-2 ${isSelected ? "text-black" : "text-gray-600"}`}
      >
        <span className="text-base">{label}</span>
        <div className={`mt-1 h-1 transition-all ${isSelected ? "w-20 bg-black" : "w-0"}`} />
      </button>
    );
  };

  const JobCard = ({ job, is24 }) => {
    const createdAt = job.created_at ? new Date(job.created_at) : null;
    const timeText = createdAt ? timeAgo(createdAt) : "";
    const isSaved = savedJobIds.includes(job.id);
    const skills = job.skills || [];

    return (
      <div
        onClick={() => navigateToDetail(job, is24)}
        className="bg-white border rounded-xl p-4 mb-4 shadow-sm hover:shadow-md cursor-pointer"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 mr-4">
            <h3 className="text-lg font-medium truncate">{job.title}</h3>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{job.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold">₹ {job.budget_from}/per day</div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          {skills.slice(0, 2).map((s) => (
            <span key={s} className={`px-2 py-1 rounded-full text-sm ${randomSkillColor(s)}`}>
              {s}
            </span>
          ))}
          {skills.length > 2 && <span className="px-2 py-1 rounded-full text-sm bg-gray-200">+{skills.length - 2}</span>}
        </div>

        <div className="mt-3 flex items-center text-sm text-gray-600">
          <div className="flex items-center mr-4">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A2 2 0 0122 9.618V18a2 2 0 01-2 2H4a2 2 0 01-2-2V9.618a2 2 0 012.447-1.894L11 10" />
            </svg>
            <span>{job.views} Impression</span>
          </div>
          <div className="flex items-center mr-4">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
              <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 4a8 8 0 100 16 8 8 0 000-16z" />
            </svg>
            <span>{timeText}</span>
          </div>
          <div className="ml-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => toggleFavorite(job.id, isSaved)} className="focus:outline-none">
              {isSaved ? (
                <svg className="w-6 h-6 text-indigo-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 2a2 2 0 00-2 2v17l8-4 8 4V4a2 2 0 00-2-2H6z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M19 21l-7-3-7 3V5a2 2 0 012-2h10a2 2 0 012 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ---------------- render ----------------
  return (
    <div className="max-w-3xl mx-auto p-4">
      <header className="flex items-center gap-4">
        <button onClick={() => window.history.back()} className="p-1 rounded">
          ←
        </button>
        <h1 className="text-2xl font-semibold">{skill || "Jobs & Skills"}</h1>
      </header>

      <div className="mt-4 flex justify-around border-b pb-3">
        <Tab label="Works Jobs" />
        <Tab label="24 Hour Jobs" />
        <Tab label="Saved Jobs" />
      </div>

      <main className="mt-4 min-h-[60vh]">
        {loading && <div className="flex justify-center py-8">Loading...</div>}
        {error && <div className="text-red-500">Error: {String(error)}</div>}

        {selectedTab === "Saved Jobs" ? (
          <SavedJobsView fetchSavedJobs={fetchSavedJobs} onOpen={navigateToDetail} />
        ) : (
          <div>
            {displayedJobs.length === 0 ? (
              <div className="text-center text-gray-600 py-8">No {selectedTab === "24 Hour Jobs" ? "24 hour " : ""}jobs found{skill ? ` for ${skill}` : ""}</div>
            ) : (
              displayedJobs.map((j) => <JobCard key={j.id} job={j} is24={selectedTab === "24 Hour Jobs"} />)
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// ---------------- SavedJobsView (separate small component) ----------------
function SavedJobsView({ fetchSavedJobs, onOpen }) {
  const [saved, setSaved] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const s = await fetchSavedJobs();
        setSaved(s);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div className="flex justify-center py-8">Loading saved jobs...</div>;
  if (error) return <div className="text-red-500">Error: {String(error)}</div>;
  if (!saved || saved.length === 0) return <div className="text-center text-gray-600 py-8">No saved jobs yet</div>;

  return (
    <div>
      {saved.map((d) => {
        const data = d.data();
        const job = {
          id: d.id,
          title: data.title || "Untitled",
          description: data.description || "",
          skills: Array.isArray(data.skills) ? data.skills : [],
          budget_from: data.budget_from ?? data.budget ?? 0,
          created_at: data.created_at ? (data.created_at.toDate ? data.created_at.toDate() : new Date(data.created_at)) : new Date(),
          views: data.views ?? 0,
        };
        const isFrom24 = d.ref.parent.id === "jobs_24h";
        return (
          <div key={d.id} onClick={() => onOpen(job, isFrom24)} className="cursor-pointer">
            <div className="bg-white border rounded-xl p-4 mb-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1 mr-4">
                  <h3 className="text-lg font-medium truncate">{job.title}</h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{job.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">₹ {job.budget_from}/per day</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}