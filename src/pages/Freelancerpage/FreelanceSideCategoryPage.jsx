







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
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firbase/Firebase";

import search from "../../assets/search.png";   // 🔥 FIXED
import eye from "../../assets/eye.png";
import clock from "../../assets/clock.png";
import saved from "../../assets/save.png";
import save from "../../assets/save2.png";

/* =========================
   ENUMS
========================= */
const JobSortOption = {
  BEST_MATCH: "bestMatch",
  NEWEST: "newest",
  AVAILABILITY: "availability",
};

/* =========================
   DEFAULT FILTERS
========================= */
const defaultFilters = {
  searchQuery: "",
  categories: [],
  skills: [],
  postingTime: "",
  budgetRange: { start: 0, end: 100000 },
  sortOption: JobSortOption.BEST_MATCH,
};

/* =========================
   HELPERS
========================= */
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

  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [userSkills, setUserSkills] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);
  const [selectedTab, setSelectedTab] = useState(0);
  const [showFilter, setShowFilter] = useState(false);

  // 🔥 MISSING STATE ADDED
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  /* =========================
     JOB STREAMS
  ========================= */
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
        createdAt: d.data().created_at?.toDate?.() || null,   // 🔥 SAFETY FIX
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
        createdAt: d.data().created_at?.toDate?.() || null,   // 🔥 SAFETY FIX
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

  /* =========================
     USER DATA
  ========================= */
  useEffect(() => {
    if (!uid) return;
    return onSnapshot(doc(db, "users", uid), (snap) => {
      const data = snap.data() || {};
      setSavedJobs(data.favoriteJobs || []);
      setUserSkills(data.skills || []);
    });
  }, [uid]);

  /* =========================
     FILTER + SORT LOGIC ✅
  ========================= */
  const filteredJobs = useMemo(() => {
    let list = jobs.filter((job) => {
      // Tabs
      if (selectedTab === 0 && job.source !== "jobs") return false;
      if (selectedTab === 1 && job.source !== "jobs_24h") return false;
      if (selectedTab === 2 && !savedJobs.includes(job.id)) return false;

      // Search
      if (
        filters.searchQuery &&
        !job.title?.toLowerCase().includes(filters.searchQuery.toLowerCase())
      )
        return false;

      // Categories
      if (
        filters.categories.length &&
        !filters.categories.includes(job.category)
      )
        return false;

      // Skills
      if (
        filters.skills.length &&
        !filters.skills.some((s) => job.skills?.includes(s))
      )
        return false;

      // Budget
      const budget = job.budget || 0;
      if (
        budget < filters.budgetRange.start ||
        budget > filters.budgetRange.end
      )
        return false;

      return true;
    });

    // Sort
    if (filters.sortOption === JobSortOption.NEWEST)
      list.sort((a, b) => b.createdAt - a.createdAt);

    if (filters.sortOption === JobSortOption.AVAILABILITY)
      list.sort((a, b) => a.views - b.views);

    if (filters.sortOption === JobSortOption.BEST_MATCH)
      list.sort(
        (a, b) => matchScore(b, userSkills) - matchScore(a, userSkills)
      );

    return list;
  }, [jobs, filters, selectedTab, savedJobs, userSkills]);

  /* =========================
     ACTIONS
  ========================= */
  const toggleSave = async (jobId) => {
    if (!uid) return;
    await updateDoc(doc(db, "users", uid), {
      favoriteJobs: savedJobs.includes(jobId)
        ? arrayRemove(jobId)
        : arrayUnion(jobId),
    });
  };
  /* =========================
     UI
  ========================= */
  return (
    <div
      className="freelance-wrapper"
      style={{
        marginLeft: collapsed ? "-110px" : "90px",
        transition: "margin-left 0.25s ease",
        overflowX: "hidden",
        maxWidth: "100vw",
        boxSizing: "border-box",
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
        <h2>Browse Projects</h2>

        {/* ================= SEARCH + FILTER ================= */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <input
            placeholder="Search job"
            value={filters.searchQuery}
            onChange={(e) =>
              setFilters({ ...filters, searchQuery: e.target.value })
            }
            style={{
              width: "70%",
              maxWidth: "90%",
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #ddd",
              outline: "none",
            }}
          />

          <button
            onClick={() => setShowFilter(true)}
            style={{
              padding: "10px 18px",
              borderRadius: 10,
              border: "none",
              background: "#6D28D9",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Filter
          </button>
        </div>

        {/* ================= SORT ================= */}
        <div className="sort" style={{ marginTop: 14 }}>
          {Object.values(JobSortOption).map((opt) => (
            <button
              key={opt}
              onClick={() => setFilters({ ...filters, sortOption: opt })}
              className={filters.sortOption === opt ? "active" : ""}
              style={{
                marginRight: 10,
                padding: "8px 14px",
                borderRadius: 999,
                border: "1px solid #ddd",
                background:
                  filters.sortOption === opt ? "#000" : "transparent",
                color: filters.sortOption === opt ? "#fff" : "#000",
                cursor: "pointer",
              }}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* ================= TABS ================= */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            padding: 10,
            margin: "16px 10px",
            borderRadius: 20,
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
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
                  padding: "9px 42px",
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 500,
                  background: isActive ? "#fff" : "transparent",
                  boxShadow: isActive
                    ? "0 6px 20px rgba(0,0,0,0.19)"
                    : "none",
                  transition: "all 0.25s ease",
                }}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* ================= JOB LIST ================= */}
        <div
          className="jobs"
          style={{
            width: "92%",
            maxWidth: "100%",
            overflowX: "hidden",
          }}
        >
          {filteredJobs.length === 0 && (
            <p style={{ opacity: 0.6 }}>No jobs found</p>
          )}

          {filteredJobs.map((job) => (
            <div
              key={job.id}
              style={{
                marginTop: 20,
                background: "#fff",
                borderRadius: 20,
                padding: 22,
                marginBottom: 18,
                boxShadow: "0 0 6px rgba(0,0,0,0.15)",
                width: "82%",
                boxSizing: "border-box",
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
                      fontSize: 15,
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
                  <div style={{ fontWeight: 500 }}>
                    ₹ {formatCurrency(job.budget)} / day
                  </div>

                  <button
                    onClick={() => toggleSave(job.id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={savedJobs.includes(job.id) ? saved : save}
                      alt="save"
                      width={20}
                    />
                  </button>
                </div>
              </div>

              {/* ===== SKILLS ===== */}
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 13, color: "#555" }}>
                  Skills Required
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    marginTop: 6,
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
                      4+
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
                <span>
                  <img src={eye} width={14} /> {job.views} Impression
                </span>
                <span>
                  <img src={clock} width={14} /> {timeAgo(job.createdAt)}
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



































