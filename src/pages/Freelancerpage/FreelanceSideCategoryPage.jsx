// ExploreFreelancer.jsx
import React, { useEffect, useMemo, useState } from "react";
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
import { db } from "../../firbase/Firebase"; // ✅ assume initialized

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
  budgetRange: [0, 100000],
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
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const matchScore = (job, userSkills) => {
  let score = 0;
  job.skills?.forEach((s) => userSkills.includes(s) && (score += 3));
  userSkills.includes(job.category) && (score += 2);
  if ((Date.now() - job.createdAt.getTime()) / 86400000 <= 3) score += 1;
  return score;
};

/* =========================
   MAIN COMPONENT
========================= */
export default function JobSearchScreen() {
  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  const [selectedTab, setSelectedTab] = useState(0); // 0 Work | 1 24h | 2 Saved
  const [filters, setFilters] = useState(defaultFilters);

  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [userSkills, setUserSkills] = useState([]);

  /* =========================
     JOB STREAMS
  ========================= */
  useEffect(() => {
    const qJobs = query(collection(db, "jobs"), orderBy("created_at", "desc"));
    const qFast = query(
      collection(db, "jobs_24h"),
      orderBy("created_at", "desc")
    );

    const unsubJobs = onSnapshot(qJobs, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        source: "jobs",
        is24h: false,
        views: d.data().views || 0,
        ...d.data(),
        createdAt: d.data().created_at?.toDate?.() || new Date(),
      }));

      setJobs((prev) => [
        ...prev.filter((j) => j.source !== "jobs"),
        ...data,
      ]);
    });

    const unsubFast = onSnapshot(qFast, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        source: "jobs_24h",
        is24h: true,
        views: d.data().views || 0,
        ...d.data(),
        createdAt: d.data().created_at?.toDate?.() || new Date(),
      }));

      setJobs((prev) => [
        ...prev.filter((j) => j.source !== "jobs_24h"),
        ...data,
      ]);
    });

    return () => {
      unsubJobs();
      unsubFast();
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
     FILTER + SORT
  ========================= */
  const filteredJobs = useMemo(() => {
    let list = jobs.filter((job) => {
      if (selectedTab === 0 && job.source !== "jobs") return false;
      if (selectedTab === 1 && job.source !== "jobs_24h") return false;
      if (selectedTab === 2 && !savedJobs.includes(job.id)) return false;

      if (
        filters.searchQuery &&
        !(
          job.title?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          job.description
            ?.toLowerCase()
            .includes(filters.searchQuery.toLowerCase())
        )
      ) {
        return false;
      }

      return true;
    });

    const sorted = [...list];

    if (filters.sortOption === JobSortOption.NEWEST) {
      sorted.sort((a, b) => b.createdAt - a.createdAt);
    }

    if (filters.sortOption === JobSortOption.AVAILABILITY) {
      sorted.sort((a, b) => a.views - b.views);
    }

    if (filters.sortOption === JobSortOption.BEST_MATCH) {
      sorted.sort(
        (a, b) => matchScore(b, userSkills) - matchScore(a, userSkills)
      );
    }

    return sorted;
  }, [jobs, filters, selectedTab, savedJobs, userSkills]);

  /* =========================
     ACTIONS
  ========================= */
  const toggleSave = async (jobId) => {
    if (!uid) return;
    const ref = doc(db, "users", uid);

    await updateDoc(ref, {
      favoriteJobs: savedJobs.includes(jobId)
        ? arrayRemove(jobId)
        : arrayUnion(jobId),
    });
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="job-search">
      <h2>Browse Projects</h2>

      {/* SEARCH */}
      <input
        placeholder="Search jobs..."
        value={filters.searchQuery}
        onChange={(e) =>
          setFilters({ ...filters, searchQuery: e.target.value })
        }
      />
      <p>filter</p>

      {/* SORT */}
      <div className="sort">
        {Object.values(JobSortOption).map((opt) => (
          <button
            key={opt}
            className={filters.sortOption === opt ? "active" : ""}
            onClick={() => setFilters({ ...filters, sortOption: opt })}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* TABS */}
      <div className="tabs">
        {["Work", "24 Hour", "Saved"].map((t, i) => (
          <button
            key={i}
            className={selectedTab === i ? "active" : ""}
            onClick={() => setSelectedTab(i)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* JOB LIST */}
      <div className="jobs">
        {filteredJobs.length === 0 && (
          <p style={{ opacity: 0.6 }}>No jobs found</p>
        )}

        {filteredJobs.map((job) => (
          <div key={job.id} className="job-card">
            <div className="row">
              <h3>{job.title}</h3>
              <span>
                ₹
                {job.budget_from && job.budget_to
                  ? `${formatCurrency(job.budget_from)} - ${formatCurrency(
                      job.budget_to
                    )}`
                  : formatCurrency(job.budget)}
              </span>
            </div>

            <p>{job.description}</p>

            <div className="skills">
              {job.skills?.slice(0, 3).map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>

            <div className="footer">
              <span>👁 {job.views}</span>
              <span>⏱ {timeAgo(job.createdAt)}</span>

              <button onClick={() => toggleSave(job.id)}>
                {savedJobs.includes(job.id) ? "🔖" : "📑"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}











// // Filter.jsx
// import React, { useEffect, useState } from "react";

// /* =========================
//    MODEL
// ========================= */
// const emptyFilter = {
//   categories: [],
//   services: [],
//   skills: [],
//   minPrice: null,
//   maxPrice: null,
//   deliveryTime: "",
//   minDays: null,
//   maxDays: null,
// };

// /* =========================
//    COMPONENT
// ========================= */
// export default function FilterScreen({
//   initialFilter = emptyFilter,
//   onApply,
//   onClose,
// }) {
//   /* ---------------- STATE ---------------- */
//   const [filter, setFilter] = useState({ ...initialFilter });

//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [minDays, setMinDays] = useState("");
//   const [maxDays, setMaxDays] = useState("");

//   /* ---------------- DATA ---------------- */
//   const categories = [
//     'Graphics & Design',
//     'Programming & Tech',
//     'Digital Marketing',
//     'Writing & Translation',
//     'Video & Animation',
//     'Music & Audio',
//     'AI Services',
//     'Data',
//     'Business',
//     'Finance',
//     'Photography',
//     'Lifestyle',
//     'Consulting',
//     'Personal Growth & Hobbies',
//   ];

//   const services = [
//     "Graphic Design",
//     "UI UX",
//     "Web Development",
//     "App Development",
//     "Game Development",
//     "SEO",
//     "Social Media Marketing",
//     "Content Writing",
//     "Video Editing",
//     "Voice Over",
//   ];

//   const skills = [
//     "Figma",
//     "React",
//     "Python",
//     "SQL",
//     "Photoshop",
//     "Illustrator",
//     "JavaScript",
//     "Flutter",
//     "Node.js",
//     "MongoDB",
//   ];

//   /* ---------------- INIT ---------------- */
//   useEffect(() => {
//     setMinPrice(filter.minPrice ?? "");
//     setMaxPrice(filter.maxPrice ?? "");
//     setMinDays(filter.minDays ?? "");
//     setMaxDays(filter.maxDays ?? "");
//   }, []);

//   /* ---------------- HELPERS ---------------- */
//   const toggleValue = (key, value) => {
//     setFilter((prev) => ({
//       ...prev,
//       [key]: prev[key].includes(value)
//         ? prev[key].filter((v) => v !== value)
//         : [...prev[key], value],
//     }));
//   };

//   const yellowInput = {
//     padding: "12px",
//     background: "#FFFDBD",
//     borderRadius: 4,
//     border: "none",
//     width: "100%",
//     fontSize: 14,
//   };

//   /* ---------------- APPLY ---------------- */
//   const applyFilters = () => {
//     const minP = minPrice ? parseInt(minPrice) : null;
//     const maxP = maxPrice ? parseInt(maxPrice) : null;

//     if (minP !== null && maxP !== null && minP > maxP) {
//       alert("Min price cannot be greater than max price");
//       return;
//     }

//     const minD = minDays ? parseInt(minDays) : null;
//     const maxD = maxDays ? parseInt(maxDays) : null;

//     if (minD !== null && maxD !== null && minD > maxD) {
//       alert("Min days cannot be greater than max days");
//       return;
//     }

//     onApply({
//       ...filter,
//       minPrice: minP,
//       maxPrice: maxP,
//       minDays: minD,
//       maxDays: maxD,
//     });
//   };

//   /* =========================
//      RENDER
//   ========================= */
//   return (
//     <div style={{ padding: 16, background: "#fff" }}>
//       {/* HEADER */}
//       <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
//         <button onClick={onClose} style={{ fontSize: 18 }}>←</button>
//         <h2 style={{ margin: "0 auto", fontWeight: 400 }}>Filters</h2>
//       </div>

//       {/* CATEGORIES */}
//       <Header title="Categories" />
//       <Wrap>
//         {categories.map((c) => (
//           <Chip
//             key={c}
//             label={c}
//             selected={filter.categories.includes(c)}
//             onClick={() => toggleValue("categories", c)}
//           />
//         ))}
//       </Wrap>

//       {/* SERVICES */}
//       <Header title="Service" />
//       <Wrap>
//         {services.map((s) => (
//           <Chip
//             key={s}
//             label={s}
//             selected={filter.services.includes(s)}
//             onClick={() => toggleValue("services", s)}
//           />
//         ))}
//       </Wrap>

//       {/* SKILLS */}
//       <Header title="Skills & Tools" />
//       <Wrap>
//         {skills.map((s) => (
//           <Chip
//             key={s}
//             label={s}
//             selected={filter.skills.includes(s)}
//             onClick={() => toggleValue("skills", s)}
//             removable
//           />
//         ))}
//       </Wrap>

//       {/* PRICE */}
//       <Header title="Price" />
//       <div style={{ display: "flex", gap: 12 }}>
//         <input
//           placeholder="Min"
//           value={minPrice}
//           onChange={(e) => setMinPrice(e.target.value)}
//           style={yellowInput}
//         />
//         <input
//           placeholder="Max"
//           value={maxPrice}
//           onChange={(e) => setMaxPrice(e.target.value)}
//           style={yellowInput}
//         />
//       </div>

//       {/* DELIVERY */}
//       <Header title="Delivery Time" />
//       {[
//         ["Up to 24 Hours", "24h"],
//         ["Up to 7 days", "7d"],
//         ["Custom Range", "custom"],
//       ].map(([label, value]) => (
//         <label key={value} style={{ display: "flex", margin: "10px 0" }}>
//           <input
//             type="radio"
//             checked={filter.deliveryTime === value}
//             onChange={() =>
//               setFilter((p) => ({ ...p, deliveryTime: value }))
//             }
//           />
//           <span style={{ marginLeft: 8 }}>{label}</span>
//         </label>
//       ))}

//       {filter.deliveryTime === "custom" && (
//         <div style={{ display: "flex", gap: 12 }}>
//           <input
//             placeholder="Min Days"
//             value={minDays}
//             onChange={(e) => setMinDays(e.target.value)}
//             style={yellowInput}
//           />
//           <input
//             placeholder="Max Days"
//             value={maxDays}
//             onChange={(e) => setMaxDays(e.target.value)}
//             style={yellowInput}
//           />
//         </div>
//       )}

//       {/* BUTTONS */}
//       <div style={{ display: "flex", gap: 14, marginTop: 30 }}>
//         <button
//           style={{
//             flex: 1,
//             background: "#D9C6FF",
//             height: 48,
//             borderRadius: 6,
//             border: "none",
//           }}
//           onClick={() => onApply(emptyFilter)}
//         >
//           Clear All
//         </button>

//         <button
//           style={{
//             flex: 1,
//             background: "#7C3CFF",
//             color: "#fff",
//             height: 48,
//             borderRadius: 6,
//             border: "none",
//           }}
//           onClick={applyFilters}
//         >
//           Apply Filters
//         </button>
//       </div>
//     </div>
//   );
// }

// /* =========================
//    SMALL COMPONENTS
// ========================= */
// function Header({ title }) {
//   return (
//     <div style={{ margin: "20px 0 10px", fontSize: 20, fontWeight: 400 }}>
//       {title}
//     </div>
//   );
// }

// function Wrap({ children }) {
//   return (
//     <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{children}</div>
//   );
// }

// function Chip({ label, selected, onClick, removable }) {
//   return (
//     <div
//       onClick={onClick}
//       style={{
//         padding: "10px 14px",
//         borderRadius: 8,
//         background: selected ? "#FDFD96" : "#FFFFDC",
//         cursor: "pointer",
//         display: "flex",
//         alignItems: "center",
//         gap: 6,
//       }}
//     >
//       {label}
//       {removable && selected && <span style={{ fontSize: 12 }}>✕</span>}
//     </div>
//   );
// }
