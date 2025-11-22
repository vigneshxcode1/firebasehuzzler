// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   ArrowLeft,
//   Bell,
//   MessageCircle,
//   Search,
//   Filter,
//   Grid,
//   Bookmark,
//   Plus,
//   X,
// } from "lucide-react";
// import Sidebar from "../pages/components/Sidebar";

// export default function MyJobs() {
//   const [jobs, setJobs] = useState([]);
//   const [activeMainTab, setActiveMainTab] = useState("Applied");
//   const [activeSubTab, setActiveSubTab] = useState("Work");
//   const [showSort, setShowSort] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedJob, setSelectedJob] = useState(null);

//   // ========= FETCH JOBS FROM API ==========
//   // useEffect(() => {
//   //   const fetchJobs = async () => {
//   //     try {
//   //       const res = await axios.get(
//   //         "http://localhost:5000/api/jobProposal/getAllJobProposal"
//   //       );

//   //       console.log("API RAW DATA:", res.data);

//   //       // Backend array → map UI fields
//   //       const formatted = res.data.map((job) => ({
//   //         _id: job._id,
//   //         title: job.JobTitle || "Untitled Job",
//   //         role: job.Category || "No Role",
//   //         description: job.Des || "",
//   //         skills: job.Skills || [],
//   //         salary: `₹${job.minprice} - ₹${job.maxprice}`,
//   //         impressions: job.toot?.length || 0,
//   //         status: "Applied", // 🔥 backend doesn't send → UI needs this
//   //       }));

//   //       setJobs(formatted);

//   //     } catch (error) {
//   //       console.error("Error loading jobs:", error);
//   //     }
//   //   };

//   //   fetchJobs();
//   // }, []);
// useEffect(() => {
//   const fetchJobs = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:5000/api/jobProposal/getAllJobProposal"
//       );

//       console.log("API RAW DATA:", res.data);

//       // backend → { JobProposal: [...] }
//       const jobArray = res.data.JobProposal || [];

//       const formatted = jobArray.map((job) => ({
//         _id: job._id,
//         title: job.JobTitle || "Untitled Job",
//         role: job.Category || "No Role",
//         description: job.Des || "",
//         skills: job.Skills || [],
//         salary: `₹${job.minprice} - ₹${job.maxprice}`,
//         impressions: job.toot?.length || 0,
//         status: "Applied", // backend doesn't send → UI needs this
//       }));

//       setJobs(formatted);

//     } catch (error) {
//       console.error("Error loading jobs:", error);
//     }
//   };

//   fetchJobs();
// }, []);


//   const visibleJobs = jobs.filter((j) => j.status === activeMainTab);

//   const openModal = (job) => {
//     setSelectedJob(job);
//     setShowModal(true);
//     document.body.style.overflow = "hidden";
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedJob(null);
//     document.body.style.overflow = "auto";
//   };

//   console.log(visibleJobs)
//   return (
//     <>
//       <div className="page-root">
//         <Sidebar />

//         <main className="content">
//           {/* HEADER */}
//           <div className="header">
//             <div className="left">
//               <button className="back-btn">
//                 <ArrowLeft size={20} />
//               </button>
//               <h1 className="page-title">My Jobs</h1>
//             </div>

//             <div className="right">
//               <div className="header-icons">
//                 <MessageCircle size={20} />
//                 <Bell size={20} />
//                 <div className="avatar">A</div>
//               </div>
//             </div>
//           </div>

//           {/* MAIN TABS */}
//           <div className="status-tabs">
//             <button
//               className={`status-pill ${activeMainTab === "Applied" ? "active" : ""}`}
//               onClick={() => setActiveMainTab("Applied")}
//             >
//               Applied
//             </button>

//             <button
//               className={`status-pill ${activeMainTab === "Accepted" ? "active" : ""}`}
//               onClick={() => setActiveMainTab("Accepted")}
//             >
//               Accepted
//             </button>
//           </div>

//           {/* SEARCH + TABS */}
//           <div className="top-controls">
//             <div className="search-wrap">
//               <div className="search-box">
//                 <Search size={18} />
//                 <input placeholder="Search" />
//               </div>
//             </div>

//             <div className="category-row">
//               {["Work", "24 Hours", "Saved"].map((t) => (
//                 <button
//                   key={t}
//                   className={`subtab ${activeSubTab === t ? "active" : ""}`}
//                   onClick={() => setActiveSubTab(t)}
//                 >
//                   {t}
//                 </button>
//               ))}

//               <div className="right-actions">
//                 <div className="action">
//                   <Filter size={18} />
//                   <span>Filter</span>
//                 </div>

//                 <div className="action" onClick={() => setShowSort(!showSort)}>
//                   <Grid size={18} />
//                   <span>Sort</span>
//                 </div>
//               </div>
//             </div>

//             {showSort && (
//               <div className="sort-popup">
//                 {["Best Match", "Popularity", "Hourly Rate", "Newest"].map(
//                   (x) => (
//                     <div className="sort-item" key={x}>
//                       {x}
//                     </div>
//                   )
//                 )}
//               </div>
//             )}
//           </div>

//           {/* RESULTS */}
//           <div className="result-count">{visibleJobs.length} Results</div>

//           {/* JOB CARDS */}
//           <div className="cards-grid">
//             {visibleJobs.length === 0 && (
//               <p>No Jobs Found.</p>
//             )}

//             {visibleJobs.map((job) => (
//               <article key={job._id} className="job-card" onClick={() => openModal(job)}>
//                 <div className="card-top">
//                   <div className="logo">Z</div>

//                   <div className="meta">
//                     <h3 className="job-title">{job.title}</h3>
//                     <div className="job-role">{job.role}</div>
//                   </div>

//                   <div className="price">{job.salary}</div>
//                 </div>

//                 <div className="skills">
//                   {job.skills.map((s, i) => (
//                     <span key={i} className="chip">{s}</span>
//                   ))}
//                 </div>

//                 <p className="desc">{job.description}</p>

//                 <div className="card-bottom">
//                   <div className="card-left">
//                     <span className="meta-small">👁 {job.impressions} Impressions</span>
//                   </div>

//                   <button className="bookmark" onClick={(e) => e.stopPropagation()}>
//                     <Bookmark size={18} />
//                   </button>
//                 </div>
//               </article>
//             ))}
//           </div>

//           {/* FLOAT ADD */}
//           <button className="float">
//             <Plus size={22} />
//           </button>
//         </main>
//       </div>

//       {/* MODAL */}
//       {showModal && selectedJob && (
//         <div className="modal-overlay" onClick={closeModal}>
//           <div className="modal" onClick={(e) => e.stopPropagation()}>
//             <button className="modal-x" onClick={closeModal}>
//               <X size={20} />
//             </button>

//             <p className="modal-sub">Project Details</p>
//             <h2 className="modal-title">{selectedJob.title}</h2>
//             <div className="modal-role">{selectedJob.role}</div>

//             <h4 className="section">Skills Required</h4>
//             <div className="skill-row">
//               {selectedJob.skills.map((s, i) => (
//                 <span className="yellow" key={i}>{s}</span>
//               ))}
//             </div>

//             <h4 className="section">Project Description</h4>
//             <p className="modal-desc">{selectedJob.description}</p>

//             <button className="apply">Apply Now</button>
//           </div>
//         </div>
//       )}

//       {/* ⬇ FULL CSS SAME FILE */}
//       <style>{`
//         .page-root { display:flex; min-height:100vh; background:linear-gradient(to bottom,#FFF7C9,#fff);}
//         .content { margin-left:17rem; flex:1; padding:2.2rem; padding-top:3.2rem; }

//         .header { display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.6); padding:0.7rem 0; position:sticky; top:0; backdrop-filter:blur(20px); }
//         .avatar { width:36px; height:36px; background:#7C3AED; color:#fff; border-radius:50%; display:flex; justify-content:center; align-items:center; }

//         .status-tabs { display:flex; gap:1rem; margin:1rem 0; }
//         .status-pill { padding:0.55rem 1.2rem; border-radius:999px; background:#fff; box-shadow:0 3px 10px rgba(0,0,0,0.1); border:none; }
//         .status-pill.active { background:linear-gradient(90deg,#A855F7,#7C3AED); color:#fff; }

//         .search-box { background:#fff; padding:0.85rem; border-radius:14px; display:flex; gap:0.6rem; box-shadow:0 5px 18px rgba(0,0,0,0.08); }

//         .cards-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.6rem; }
//         .job-card { background:#fff; padding:1.4rem; border-radius:16px; box-shadow:0 9px 28px rgba(0,0,0,0.08); cursor:pointer; }

//         .skills { margin-top:0.8rem; display:flex; flex-wrap:wrap; gap:0.5rem; }
//         .chip { background:#F4EEFF; color:#7C3AED; padding:0.3rem 0.6rem; border-radius:10px; }

//         .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.55); display:flex; justify-content:center; padding-top:60px; }
//         .modal { width:640px; background:#fff; padding:2.2rem; border-radius:18px; }
//         .apply { width:100%; padding:1rem; background:linear-gradient(90deg,#A855F7,#7C3AED); border:none; color:white; border-radius:12px; margin-top:1.2rem; }

//       `}</style>
//     </>
//   );
// }


import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Bell,
  MessageCircle,
  Search,
  Filter,
  Grid,
  Bookmark,
  Plus,
  X,
} from "lucide-react";
import Sidebar from "./Freelancerpage/components/Sidebar";

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [activeMainTab, setActiveMainTab] = useState("Applied");
  const [activeSubTab, setActiveSubTab] = useState("Work");
  const [showSort, setShowSort] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // ================= API FETCH =================
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/jobProposal/getAllJobProposal"
        );

        console.log("API RAW DATA:", res.data);

        // Backend returns: { JobProposal: [...] }
        const jobArray = res.data.JobProposal || [];

        const formatted = jobArray.map((job) => ({
          _id: job._id,
          title: job.JobTitle || "Untitled Job",
          role: job.Category || "No Role",
          description: job.Des || "",
          skills: job.Skills || [],
          salary: `₹${job.minprice} - ₹${job.maxprice}`,
          impressions: job.toot?.length || 0,
          status: "Applied", // UI default
        }));

        setJobs(formatted);

      } catch (error) {
        console.error("Error loading jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  // ================= FILTER =================
  const visibleJobs = jobs.filter((j) => j.status === activeMainTab);

  // ================= MODAL =================
  const openModal = (job) => {
    setSelectedJob(job);
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedJob(null);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <div className="page-root">
        <Sidebar />

        <main className="content">

          {/* HEADER */}
          <div className="header">
            <div className="left">
              <button className="back-btn">
                <ArrowLeft size={20} />
              </button>
              <h1 className="page-title">My Jobs</h1>
            </div>

            <div className="right">
              <div className="header-icons">
                <MessageCircle size={20} />
                <Bell size={20} />
                <div className="avatar">A</div>
              </div>
            </div>
          </div>

          {/* tabs */}
          <div className="status-tabs">
            <button
              className={`status-pill ${activeMainTab === "Applied" ? "active" : ""}`}
              onClick={() => setActiveMainTab("Applied")}
            >
              Applied
            </button>

            <button
              className={`status-pill ${activeMainTab === "Accepted" ? "active" : ""}`}
              onClick={() => setActiveMainTab("Accepted")}
            >
              Accepted
            </button>
          </div>

          {/* search & category */}
          <div className="top-controls">

            <div className="search-wrap">
              <div className="search-box">
                <Search size={18} />
                <input placeholder="Search" />
              </div>
            </div>

            <div className="category-row">

              {["Work", "24 Hours", "Saved"].map((t) => (
                <button
                  key={t}
                  className={`subtab ${activeSubTab === t ? "active" : ""}`}
                  onClick={() => setActiveSubTab(t)}
                >
                  {t}
                </button>
              ))}

              <div className="right-actions">
                <div className="action">
                  <Filter size={18} />
                  <span>Filter</span>
                </div>

                <div className="action" onClick={() => setShowSort(!showSort)}>
                  <Grid size={18} />
                  <span>Sort</span>
                </div>
              </div>
            </div>

            {showSort && (
              <div className="sort-popup">
                {["Best Match", "Popularity", "Hourly Rate", "Newest"].map((x) => (
                  <div className="sort-item" key={x}>{x}</div>
                ))}
              </div>
            )}
          </div>

          {/* results */}
          <div className="result-count">{visibleJobs.length} Results</div>

          {/* CARDS */}
          <div className="cards-grid">
            {visibleJobs.length === 0 && <p>No Jobs Found.</p>}

            {visibleJobs.map((job) => (
              <article
                key={job._id}
                className="job-card"
                onClick={() => openModal(job)}
              >
                <div className="card-top">
                  <div className="logo">Z</div>

                  <div className="meta">
                    <h3 className="job-title">{job.title}</h3>
                    <div className="job-role">{job.role}</div>
                  </div>

                  <div className="price">{job.salary}</div>
                </div>

                <div className="skills">
                  {job.skills.map((s, i) => (
                    <span key={i} className="chip">{s}</span>
                  ))}
                </div>

                <p className="desc">{job.description}</p>

                <div className="card-bottom">
                  <div className="card-left">
                    <span className="meta-small">👁 {job.impressions} Impressions</span>
                  </div>

                  <button
                    className="bookmark"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Bookmark size={18} />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* floating button */}
          <button className="float">
            <Plus size={22} />
          </button>

        </main>
      </div>

      {/* modal */}
      {showModal && selectedJob && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-x" onClick={closeModal}>
              <X size={20} />
            </button>

            <p className="modal-sub">Project Details</p>
            <h2 className="modal-title">{selectedJob.title}</h2>
            <div className="modal-role">{selectedJob.role}</div>

            <h4 className="section">Skills Required</h4>
            <div className="skill-row">
              {selectedJob.skills.map((s, i) => (
                <span key={i} className="yellow">{s}</span>
              ))}
            </div>

            <h4 className="section">Project Description</h4>
            <p className="modal-desc">{selectedJob.description}</p>

            <button className="apply">Apply Now</button>
          </div>
        </div>
      )}

      {/* =========================================
          ===== ORIGINAL CSS (UNTOUCHED) ==========
          ========================================= */}
      <style>{`

/* PAGE ROOT: sidebar + content */
.page-root {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(to bottom, #FFF7C9 0%, #ffffff 30%);
}

/* Sidebar fixed width (17rem) */
.content {
  margin-left: 17rem;
  flex: 1;
  padding: 2.2rem;
  padding-top: 3.2rem;
  box-sizing: border-box;
  position: relative;
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial;
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  position: sticky;
  top: 0;
  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(20px);
  padding: 0.7rem 0;
  z-index: 30;
}
.header .left { display:flex; align-items:center; gap:1rem; }
.back-btn {
  background: #fff;
  border: none;
  padding: 0.55rem;
  border-radius: 12px;
  box-shadow: 0 3px 12px rgba(0,0,0,0.10);
  cursor:pointer;
}
.page-title {
  font-size: 1.6rem;
  font-weight: 700;
  color:#111827;
  margin:0;
}
.header-icons { display:flex; align-items:center; gap:1rem; }
.avatar {
  width:36px; height:36px;
  background:#7C3AED;
  color:#fff;
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:700;
}

/* STATUS TABS */
.status-tabs { display:flex; gap:1rem; margin:1rem 0; }
.status-pill {
  padding:0.55rem 1.2rem;
  border-radius:999px;
  border:none;
  background:#fff;
  box-shadow:0 3px 10px rgba(0,0,0,0.08);
  cursor:pointer;
  font-weight:600;
  color:#6B7280;
}
.status-pill.active {
  background:linear-gradient(90deg,#A855F7,#7C3AED);
  color:#fff;
  box-shadow:0 8px 22px rgba(124,58,237,0.18);
}

/* SEARCH + SUBTABS */
.top-controls { margin-bottom:0.6rem; position:relative; }
.search-wrap { margin-bottom:0.8rem; }
.search-box {
  background:#fff;
  padding:0.85rem 1rem;
  border-radius:14px;
  display:flex;
  align-items:center;
  gap:0.6rem;
  box-shadow:0 5px 18px rgba(0,0,0,0.08);
}
.search-box input { border:none; outline:none; width:100%; }

/* SUBTABS */
.category-row { display:flex; align-items:center; gap:1rem; }
.subtab {
  background:#fff;
  border:none;
  border-radius:12px;
  padding:0.5rem 1.1rem;
  box-shadow:0 3px 10px rgba(0,0,0,0.08);
  color:#6B7280;
}
.subtab.active { background:#7C3AED; color:#fff; }

/* SORT / FILTER BUTTONS */
.right-actions { margin-left:auto; display:flex; gap:0.8rem; }
.action {
  background:#fff;
  padding:0.55rem 0.9rem;
  border-radius:12px;
  box-shadow:0 6px 18px rgba(0,0,0,0.08);
  display:flex;
  align-items:center;
  gap:0.6rem;
  cursor:pointer;
  font-weight:500;
}

/* SORT POPUP */
.sort-popup {
  position:absolute;
  right:2rem;
  top:145px;
  width:200px;
  background:white;
  border-radius:12px;
  box-shadow:0 10px 30px rgba(0,0,0,0.15);
  padding:8px 0;
  z-index:80;
}
.sort-item { padding:10px 14px; cursor:pointer; }
.sort-item:hover { background:#F5F2FF; color:#7C3AED; }

/* RESULTS */
.result-count { margin:1rem 0; font-size:0.95rem; color:#6B7280; }

/* GRID */
.cards-grid {
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:1.6rem;
}

/* JOB CARD */
.job-card {
  background:#fff;
  padding:1.4rem;
  border-radius:16px;
  box-shadow:0 9px 28px rgba(0,0,0,0.08);
  cursor:pointer;
  position:relative;
}
.job-card::after {
  content:""; position:absolute;
  left:0; right:0; bottom:0;
  height:44px;
  background:linear-gradient(90deg,#FFEBA4,#FFFFFF);
  opacity:0.75;
  border-radius:0 0 16px 16px;
}

.card-top { display:flex; justify-content:space-between; gap:1rem; }
.logo {
  width:44px; height:44px;
  background:#0FB981;
  color:white;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:700;
  border-radius:50%;
}
.meta { flex:1; margin-right:1rem; }
.job-title { margin:0; font-size:1.02rem; font-weight:700; }
.job-role { color:#6B7280; font-size:0.88rem; }

.price { font-weight:700; }

/* SKILLS */
.skills { margin-top:0.8rem; display:flex; flex-wrap:wrap; gap:0.5rem; }
.chip {
  background:#F4EEFF;
  color:#7C3AED;
  padding:0.28rem 0.6rem;
  border-radius:10px;
  font-size:0.78rem;
}

.desc { margin:0.8rem 0; color:#4B5563; }

.card-bottom { display:flex; align-items:center; }
.meta-small { font-size:0.82rem; color:#6B7280; }
.bookmark { background:none; border:none; margin-left:auto; }

/* FLOAT BUTTON */
.float {
  position:fixed;
  right:2.6rem;
  bottom:2.6rem;
  width:56px; height:56px;
  background:#7C3AED;
  border-radius:50%;
  color:white;
  border:none;
  display:flex;
  justify-content:center;
  align-items:center;
  box-shadow:0 12px 30px rgba(124,58,237,0.28);
  cursor:pointer;
}

/* MODAL */
.modal-overlay {
  position:fixed;
  inset:0;
  background:rgba(0,0,0,0.55);
  display:flex;
  justify-content:center;
  padding-top:60px;
}
.modal {
  width:640px;
  background:white;
  padding:2.2rem;
  border-radius:18px;
  max-height:85vh;
  overflow-y:auto;
  position:relative;
}
.modal-x { position:absolute; right:18px; top:18px; background:none; border:none; }
.modal-title { font-size:1.55rem; font-weight:700; }
.yellow {
  background:#FFF4C4;
  color:#6B4F00;
  padding:0.45rem 0.8rem;
  border-radius:8px;
  font-weight:600;
}
.apply {
  width:100%;
  padding:0.9rem;
  margin-top:1.2rem;
  background:linear-gradient(90deg,#A855F7,#7C3AED);
  border:none;
  color:white;
  font-weight:700;
  border-radius:12px;
}

/* RESPONSIVE */
@media (max-width: 980px) {
  .cards-grid { grid-template-columns:1fr; }
  .content { margin-left:0; padding:1.2rem; }
  .page-root { flex-direction:column; }
}

      `}</style>
    </>
  );
}
