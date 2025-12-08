// BrowseProjects.jsx
import React, { useEffect, useState, useRef } from "react";
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

export default function BrowseProjects() {
  const [projects, setProjects] = useState([]);
  const [showSort, setShowSort] = useState(false); // SORT POPUP
  const [showModal, setShowModal] = useState(false); // DETAILS POPUP
  const [selectedJob, setSelectedJob] = useState(null);
  const sortRef = useRef(null);

  useEffect(() => {
    setProjects([
      {
        id: 1,
        title: "Zuntra Digital PVT",
        role: "UI/UX Designer",
        skills: [
          "UI Design",
          "Web Design",
          "UX",
          "Figma",
          "Visual Design",
          "Adobe XD",
        ],
        salary: "₹1000 – ₹6000",
        timeRange: "2 – 3 weeks",
        location: "Remote",
        description:
          "We are seeking an experienced UI/UX designer to design modern, intuitive app screens.",
        time: "5 days ago",
        impressions: 29,
      },
      {
        id: 2,
        title: "Zuntra Digital PVT",
        role: "UI/UX Designer",
        skills: ["UI Design", "Web Design", "UX", "Wireframe"],
        salary: "₹800 – ₹5000",
        timeRange: "1 – 2 weeks",
        location: "Hybrid",
        description:
          "Candidate must be skilled in wireframing, prototyping & clean UI.",
        time: "3 min ago",
        impressions: 40,
      },
    ]);
  }, []);

  // open modal
  const openModal = (job) => {
    setSelectedJob(job);
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  // close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedJob(null);
    document.body.style.overflow = "auto";
  };

  // close sort if clicked outside
  useEffect(() => {
    function handleDocClick(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setShowSort(false);
      }
    }
    if (showSort) document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, [showSort]);

  // close modal on Esc
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        if (showModal) closeModal();
        if (showSort) setShowSort(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showModal, showSort]);

  return (
    <>
      <div className="browse-wrapper">
        {/* HEADER */}
        <div className="header-bar">
          <button className="back-btn" title="Back">
            <ArrowLeft size={22} />
          </button>
          <h2 className="title">Browse Projects.</h2>
          <div className="header-icons" aria-hidden>
            <MessageCircle size={20} />
            <Bell size={20} />
            <div className="avatar">A</div>
          </div>
        </div>

        {/* SEARCH CARD */}
        <div className="search-card">
          <div className="search-box" role="search">
            <Search size={18} />
            <input type="text" placeholder="Search" aria-label="Search projects" />
          </div>
        </div>

        {/* CATEGORY TAGS */}
        <div className="category-strip" aria-hidden>
          {[
            "Logo Design",
            "Brand Guide",
            "Stationery",
            "Typography",
            "Art",
            "Illustration",
            "AI Artist",
          ].map((t, i) => (
            <span key={i} className="tag">
              {t}
            </span>
          ))}
        </div>

        {/* TABS + SORT */}
        <div className="middle-row">
          <div className="left-tabs" role="tablist">
            <button className="tab active" role="tab">
              Work
            </button>
            <button className="tab" role="tab">
              24 Hours
            </button>
            <button className="tab" role="tab">
              Saved
            </button>
          </div>

          <div className="right-actions" ref={sortRef}>
            <div className="action-btn" title="Filter">
              <Filter size={18} /> Filter
            </div>

            <div
              className="action-btn"
              title="Sort"
              onClick={() => setShowSort((s) => !s)}
            >
              <Grid size={18} /> Sort
            </div>

            {/* Sort popup - positioned near actions */}
            {showSort && (
              <div className="sort-popup" role="menu">
                {[
                  "Best Match",
                  "Popularity",
                  "Rating",
                  "Hourly Rate",
                  "Newest",
                  "Availability",
                ].map((x, i) => (
                  <div
                    key={i}
                    className="sort-item"
                    role="menuitem"
                    onClick={() => {
                      // can hook sorting logic here
                      setShowSort(false);
                    }}
                  >
                    {x}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="result-text">1200 result</p>

        {/* PROJECT LIST */}
        {projects.map((job) => (
          <article
            key={job.id}
            className="job-card"
            onClick={() => openModal(job)}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && openModal(job)}
            aria-labelledby={`job-${job.id}-title`}
            role="button"
          >
            <div className="job-header">
              <div className="circle">Z</div>
              <div className="job-info">
                <h3 id={`job-${job.id}-title`}>{job.title}</h3>
                <p className="role">{job.role}</p>
              </div>
              <p className="price">{job.salary}</p>
            </div>

            <div className="skill-row">
              {job.skills.map((s, i) => (
                <span key={i} className="skill-chip">
                  {s}
                </span>
              ))}
            </div>

            <p className="description">{job.description}</p>

            <div className="job-footer">
              <span className="meta">{job.impressions} Impressions</span>
              <span className="meta">{job.time}</span>
              <button
                className="save-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  // save/bookmark logic placeholder
                  alert("Saved (demo)");
                }}
                aria-label="Save job"
              >
                <Bookmark size={18} />
              </button>
            </div>
          </article>
        ))}

        {/* FLOAT BUTTON */}
        <button
          className="float-btn"
          title="Add"
          onClick={() => alert("Add new project (demo)")}
        >
          <Plus size={24} />
        </button>
      </div>

      {/* -------------------------- MODAL -------------------------- */}
      {showModal && selectedJob && (
        <div
          className="modal-overlay"
          onMouseDown={(e) => {
            // clicking on overlay closes modal
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            className="modal-box"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedJob.title} details`}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={closeModal}
              aria-label="Close details"
            >
              <X size={20} />
            </button>

            <p className="modal-small-title">Project Details</p>
            <h2 className="modal-main-title">{selectedJob.title}</h2>
            <p className="modal-role">{selectedJob.role}</p>

            <div className="modal-info-grid">
              <div>
                <p className="label">Budget</p>
                <p className="value">{selectedJob.salary}</p>
              </div>
              <div>
                <p className="label">Timeline</p>
                <p className="value">{selectedJob.timeRange}</p>
              </div>
              <div>
                <p className="label">Location</p>
                <p className="value">{selectedJob.location}</p>
              </div>
            </div>

            <div className="modal-meta">
              <p>🔵 10 Applicants</p>
              <p>⏱ {selectedJob.time}</p>
            </div>

            <h4 className="section-title">Skills Required</h4>
            <div className="skill-chip-row">
              {selectedJob.skills.map((s, i) => (
                <span key={i} className="yellow-skill-chip">
                  {s}
                </span>
              ))}
            </div>

            <h4 className="section-title">Project Description</h4>
            <p className="modal-description">
              {selectedJob.description}
            </p>

            <ul className="bullet-list">
              <li>Modern and clean design aesthetic</li>
              <li>Mobile-first approach</li>
              <li>Interactive prototypes</li>
              <li>Component library</li>
              <li>User flow diagrams</li>
            </ul>

            <button
              className="apply-btn"
              onClick={() => alert("Apply (demo)")}
            >
              Apply for this Project
            </button>
          </div>
        </div>
      )}

      {/* -------------------------- CSS (same file) -------------------------- */}
      <style>{`
        * { box-sizing: border-box; font-family: Inter, sans-serif; }

        /* PAGE WRAPPER (room for left sidebar) */
        .browse-wrapper {
          margin-left: 17rem; /* leave sidebar area */
          padding: 2rem 2.5rem;
          background: linear-gradient(#FFF7C9, white 35%);
          min-height: 100vh;
        }

        /* HEADER */
        .header-bar {
          position: sticky;
          top: 0;
          z-index: 40;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(20px);
          padding: 1rem 0;
          border-bottom: 1px solid rgba(0,0,0,0.03);
        }
        .title { font-size: 1.6rem; font-weight: 700; margin: 0 1rem; }
        .back-btn {
          background: white; padding: .55rem; border-radius: 12px;
          border: none; box-shadow: 0 3px 12px rgba(0,0,0,0.10);
          cursor: pointer;
        }
        .header-icons { display: flex; gap: 1rem; align-items:center; margin-left:auto; }
        .avatar { width: 36px; height: 36px; background:#7C3AED; border-radius:50%; color:white;
          display:flex; align-items:center; justify-content:center; font-weight:700; }

        /* SEARCH CARD */
        .search-card {
          background:white; padding:1rem; border-radius:18px; margin-top:1rem;
          box-shadow:0 5px 18px rgba(0,0,0,0.08);
        }
        .search-box {
          display:flex; gap:.7rem; align-items:center; padding:.85rem 1rem; border-radius:14px;
          box-shadow:0 3px 10px rgba(0,0,0,0.06); background:white;
        }
        .search-box input { border: none; outline: none; width: 100%; font-size: 0.95rem; }

        /* categories */
        .category-strip { margin-top:1.2rem; display:flex; gap:.7rem; overflow-x:auto; padding-bottom:.5rem; }
        .tag {
          padding:.45rem 1rem; background:#FFFDF0; border:1px solid #F4E7A8; border-radius:10px; white-space:nowrap;
          font-size: 0.85rem;
        }

        /* tabs / filter */
        .middle-row { margin-top:1.2rem; display:flex; justify-content:space-between; align-items:center; }
        .left-tabs { display:flex; gap:1rem; }
        .tab {
          padding:.55rem 1.2rem; border:none; background:white; border-radius:12px;
          box-shadow:0 3px 10px rgba(0,0,0,0.1); color:#6B7280; cursor:pointer; font-weight:500;
        }
        .tab.active { background:#7C3AED; color:white; }

        .right-actions { display:flex; gap:1rem; position:relative; align-items:center; }
        .action-btn {
          background:white; padding:.55rem 1rem; border-radius:12px; display:flex; gap:.4rem; align-items:center;
          box-shadow:0 3px 10px rgba(0,0,0,0.1); cursor:pointer;
        }

        /* sort popup - appears near the action buttons */
        .sort-popup {
          position: absolute;
          top: 48px; /* below action buttons */
          right: 0;
          width: 200px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.14);
          padding: 8px 0;
          z-index: 120;
        }
        .sort-item {
          padding: 10px 14px;
          font-size: 0.95rem;
          cursor: pointer;
        }
        .sort-item:hover { background: #F5F2FF; color: #7C3AED; }

        .result-text { margin-top: 1rem; color: #555; font-size: 0.95rem; }

        /* JOB CARD */
        .job-card {
          background:white; margin-top:1.4rem; padding:1.6rem; border-radius:18px;
          box-shadow:0 6px 20px rgba(0,0,0,0.10); cursor:pointer; position:relative;
        }
        .job-card::after {
          content:""; position:absolute; left:0; right:0; bottom:0; height:40px;
          background:linear-gradient(to right,#FFEBA4,white); border-radius:0 0 18px 18px; opacity:.7;
        }
        .job-header { display:flex; justify-content:space-between; align-items:center; gap:1rem; }
        .circle { width:42px; height:42px; border-radius:50%; background:#0FB981; color:white;
          display:flex; align-items:center; justify-content:center; font-weight:700; }

        .job-info h3 { font-size:1rem; margin:0 0 6px 0; font-weight:700; }
        .role { font-size:.85rem; color:#6B7280; margin:0; }
        .price { font-weight:700; margin-left:auto; }

        .skill-row { display:flex; gap:.5rem; margin:.8rem 0; flex-wrap:wrap; }
        .skill-chip {
          background:#F4EEFF; color:#7C3AED; padding:.33rem .75rem; border-radius:10px; font-size:.75rem;
        }

        .description { color:#4B5563; margin-bottom:1rem; }
        .job-footer { display:flex; gap:1.2rem; align-items:center; }

        .meta { color:#6B7280; font-size:.85rem; }
        .save-btn { margin-left:auto; border:none; background:none; cursor:pointer; }

        /* FLOAT BUTTON */
        .float-btn {
          position:fixed; right:3rem; bottom:3rem; width:55px; height:55px; border-radius:50%;
          background:#7C3AED; color:white; border:none; display:flex; align-items:center; justify-content:center;
          box-shadow:0 8px 25px rgba(124,58,237,0.4); cursor:pointer;
        }

        /* ==================== MODAL (centered, figma-like) ==================== */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center; /* center vertically & horizontally */
          z-index: 999;
          padding: 20px;
        }

        .modal-box {
          width: 640px;
          max-height: 85vh;
          overflow-y: auto;
          background: #ffffff;
          border-radius: 18px;
          padding: 2.3rem;
          box-shadow: 0 14px 45px rgba(0,0,0,0.25);
          position: relative;
          animation: zoomIn 0.25s ease-out;
        }
        .modal-box::-webkit-scrollbar { width: 6px; }
        .modal-box::-webkit-scrollbar-thumb { background: #d6d6d6; border-radius: 10px; }

        .modal-close {
          position: absolute;
          top: 18px;
          right: 18px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }

        .modal-small-title { font-size: 0.95rem; color: #666; margin: 0 0 6px 0; }
        .modal-main-title { font-size: 1.55rem; font-weight: 700; margin: 0 0 6px 0; }
        .modal-role { color: #7A7A7A; margin: 0 0 12px 0; }

        .modal-info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px 14px; margin-bottom: 12px; }
        .label { font-size: 0.82rem; color: #666; margin: 0; }
        .value { font-size: 0.95rem; font-weight: 600; margin: 2px 0 0 0; }

        .modal-meta { display:flex; gap:1.8rem; margin-bottom: 14px; color:#555; font-size:0.9rem; }

        .section-title { margin-top: 12px; margin-bottom: 8px; font-size: 1.05rem; font-weight: 600; }
        .skill-chip-row { display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom: 12px; }
        .yellow-skill-chip { background:#FFF4C4; color:#6B4F00; padding:0.45rem 0.85rem; border-radius:8px; font-size:0.85rem; }

        .modal-description { color:#444; line-height:1.5; margin-bottom: 10px; }
        .bullet-list { margin-left: 1rem; margin-bottom: 12px; color:#444; }
        .bullet-list li { margin-bottom: 6px; }

        .apply-btn {
          width:100%;
          margin-top: 12px;
          padding: 0.9rem;
          border-radius: 12px;
          background: linear-gradient(90deg, #A855F7, #7C3AED);
          color: white;
          font-weight: 600;
          border: none;
          cursor: pointer;
        }

        @keyframes zoomIn {
          from { transform: scale(0.96); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        /* responsive tweaks */
        @media (max-width: 900px) {
          .browse-wrapper { margin-left: 0; padding: 1rem; }
          .modal-box { width: 92%; padding: 1.4rem; }
          .title { font-size: 1.25rem; }
        }
      `}</style>
    </>
  );
}
