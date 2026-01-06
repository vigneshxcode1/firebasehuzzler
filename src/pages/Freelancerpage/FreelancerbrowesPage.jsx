// Categories.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  getDocs,
  updateDoc,
  query,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import categoryImg from "../../assets/categories.png";
import search from "../../assets/search .png";
import eye from "../../assets/eye.png";
import clock from "../../assets/clock.png";
import saved from "../../assets/save.png";
import save from "../../assets/save2.png";
import backarrow from "../../assets/backarrow.png";

const jobCategories1 = {
  "Graphics & Design": [
    "Logo Design",
    "Brand Style Guides",
    "Business Cards & Stationery",
    "Illustration",
    "Pattern Design",
    "Website Design",
    "App Design",
    "UX Design",
    "Game Art",
    "NFTs & Collectibles",
    "Industrial & Product Design",
    "Architecture & Interior Design",
    "Landscape Design",
    "Fashion Design",
    "Jewelry Design",
    "Presentation Design",
    "Infographic Design",
    "Vector Tracing",
    "Car Wraps",
    "Image Editing",
    "Photoshop Editing",
    "T-Shirts & Merchandise",
    "Packaging Design",
    "Book Design",
    "Album Cover Design",
    "Podcast Cover Art",
    "Menu Design",
    "Invitation Design",
    "Brochure Design",
    "Poster Design",
    "Signage Design",
    "Flyer Design",
    "Social Media Design",
    "Print Design",
  ],

  "Programming & Tech": [
    "Website Development",
    "Website Builders & CMS",
    "Web Programming",
    "E-Commerce Development",
    "Game Development",
    "Mobile Apps (iOS & Android)",
    "Desktop Applications",
    "Chatbots",
    "QA & Review",
    "User Testing",
    "Support & IT",
    "Data Analysis & Reports",
    "Convert Files",
    "Databases",
    "Cybersecurity",
    "Data Protection",
    "Cloud Computing",
    "DevOps",
    "AI Development",
    "Machine Learning",
    "Blockchain & NFTs",
    "Scripts & Automation",
    "Software Customization",
  ],

  "Digital Marketing": [
    "Social Media Marketing",
    "SEO",
    "Content Marketing",
    "Video Marketing",
    "Email Marketing",
    "SEM (Search Engine Marketing)",
    "Influencer Marketing",
    "Local SEO",
    "Affiliate Marketing",
    "Mobile Marketing & Advertising",
    "Display Advertising",
    "E-Commerce Marketing",
    "Text Message Marketing",
    "Crowdfunding",
    "Marketing Strategy",
    "Web Analytics",
    "Domain Research",
    "Music Promotion",
    "Book & eBook Marketing",
    "Podcast Marketing",
    "Community Management",
    "Marketing Consulting",
  ],

  "Writing & Translation": [
    "Articles & Blog Posts",
    "Proofreading & Editing",
    "Translation",
    "Website Content",
    "Technical Writing",
    "Copywriting",
    "Brand Voice & Tone",
    "Resume Writing",
    "Cover Letters",
    "LinkedIn Profiles",
    "Press Releases",
    "Product Descriptions",
    "Case Studies",
    "White Papers",
    "Scriptwriting",
    "Speechwriting",
    "Creative Writing",
    "Book Editing",
    "Beta Reading",
    "Grant Writing",
    "UX Writing",
    "Email Copy",
    "Business Names & Slogans",
    "Transcription",
    "Legal Writing",
  ],

  "Video & Animation": [
    "Whiteboard & Animated Explainers",
    "Video Editing",
    "Short Video Ads",
    "Logo Animation",
    "Character Animation",
    "2D/3D Animation",
    "Intros & Outros",
    "Lyric & Music Videos",
    "Visual Effects",
    "Spokesperson Videos",
    "App & Website Previews",
    "Product Photography & Demos",
    "Subtitles & Captions",
    "Live Action Explainers",
    "Unboxing Videos",
    "Slideshow Videos",
    "Animation for Kids",
    "Trailers & Teasers",
  ],

  "Music & Audio": [
    "Voice Over",
    "Mixing & Mastering",
    "Producers & Composers",
    "Singers & Vocalists",
    "Session Musicians",
    "Songwriters",
    "Audiobook Production",
    "Sound Design",
    "Audio Editing",
    "Jingles & Intros",
    "Podcast Editing",
    "Music Transcription",
    "Dialogue Editing",
    "DJ Drops & Tags",
    "Music Promotion",
  ],

  "AI Services": [
    "AI Artists",
    "AI Applications",
    "AI Video Generators",
    "AI Music Generation",
    "AI Chatbot Development",
    "AI Website Builders",
    "Custom GPT & LLMs",
    "AI Training Data Preparation",
    "Text-to-Speech / Voice Cloning",
    "Prompt Engineering",
  ],

  Data: [
    "Data Entry",
    "Data Mining & Scraping",
    "Data Analytics & Reports",
    "Database Design",
    "Data Visualization",
    "Dashboards",
    "Excel / Google Sheets",
    "Statistical Analysis",
    "Data Engineering",
    "Machine Learning Models",
    "Data Cleaning",
  ],

  Business: [
    "Business Plans",
    "Market Research",
    "Branding Services",
    "Legal Consulting",
    "Financial Consulting",
    "Career Counseling",
    "Project Management",
    "Supply Chain Management",
    "HR Consulting",
    "E-Commerce Management",
    "Business Consulting",
    "Presentations",
    "Virtual Assistant",
  ],

  Finance: [
    "Accounting & Bookkeeping",
    "Financial Forecasting",
    "Financial Modeling",
    "Tax Consulting",
    "Crypto & NFT Consulting",
    "Business Valuation",
    "Pitch Decks",
  ],

  Photography: [
    "Product Photography",
    "Real Estate Photography",
    "Portraits",
    "Image Retouching",
    "Food Photography",
    "Drone Photography",
    "Lifestyle Photography",
    "AI Image Enhancement",
  ],

  Lifestyle: [
    "Gaming",
    "Astrology & Psychics",
    "Online Tutoring",
    "Arts & Crafts",
    "Fitness Lessons",
    "Nutrition",
    "Relationship Advice",
    "Personal Styling",
    "Cooking Lessons",
    "Life Coaching",
    "Travel Advice",
    "Wellness & Meditation",
    "Language Lessons",
  ],

  Consulting: [
    "Management Consulting",
    "Business Strategy",
    "HR & Leadership",
    "Financial Advisory",
    "Legal Consulting",
    "Technology Consulting",
    "Cybersecurity Consulting",
    "Marketing Strategy",
  ],

  "Personal Growth & Hobbies": [
    "Life Coaching",
    "Productivity Coaching",
    "Study Skills",
    "Language Learning",
    "Public Speaking",
    "Career Mentoring",
    "Mindfulness & Meditation",
    "Confidence Coaching",
  ],
};

/* ---------------------------
   Simple inline styles
   --------------------------- */
const styles = {
  page: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    background: "#fff",
    minHeight: "100vh",
    color: "#111",
  },
  // appBar: {
  //   display: "flex",
  //   alignItems: "center",
  //   height: 64,
  //   padding: "0 12px",
  //   borderBottom: "1px solid #eee",
  //   background: "#fff",
  //   position: "sticky",
  //   top: 0,
  //   zIndex: 20,
  // },
  backBtn: {
    border: "none",
    background: "transparent",
    fontSize: 18,
    cursor: "pointer",
    padding: "8px",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: 600,
    marginTop: "70px",
  },

  container: {
    maxWidth: 1000,
    margin: "10px auto",
    padding: 16,
    
  },
  searchBar: {
    height: 48,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "0 12px",
    borderRadius: 12,
    border: "1px solid block",
    boxShadow: "0 10px 50px rgba(0,0,0,0.08)",
    background: "#fff",
  },
  input: {
    border: "none",
    outline: "none",
    flex: 1,
    fontSize: 14,
    marginTop: "5px",
    padding: "9px 0px 0px 10px",
    

  },
  list: {
    marginTop: 12,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 8px",
    cursor: "pointer",
    borderBottom: "1px solid #f0f0f0",
  },
  smallMuted: {
    fontSize: 13,
    color: "#666",
  },
  emptyBox: {
    marginTop: 60,
    textAlign: "center",
    color: "#666",
  },
  breadcrumbRow: {
    marginTop: 12,
    display: "flex",
    gap: 6,
    alignItems: "center",
  },
  chip: {
    fontSize: 13,
    color: "#222",
    fontWeight: 600,
  },
  clearBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: 18,
    padding: 6,
  },
  grid: {
    marginTop: 20,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: 16,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
    cursor: "pointer",
    background: "#fff",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },
  cardImg: {
    height: 110,
    background: "linear-gradient(135deg,#6a00ff,#9c27ff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 36,
    color: "#fff",
  },
  cardLabel: {
    padding: 12,
    fontWeight: 600,
    textAlign: "center",
  },

  /* 🔥 FORCE 4 COLUMNS */
  cardGrid: {
    marginTop: 20,
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 16,
  },

  categoryCard: {
    borderRadius: 16,
    background: "#fff",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    cursor: "pointer",
    overflow: "hidden",
    transition: "transform 0.15s ease",
  },
  categoryCardTop: {
    height: 130,
    overflow: "hidden",
  },

  categoryImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover", // 🔥 fills top area only
  },

  categoryCardBottom: {
    padding: "12px 10px",
    textAlign: "center",
    fontWeight: 600,
    fontSize: 14,
    background: "#fff",
  },



};

/* ---------------------------
   Small Icon components (no external libs)
   --------------------------- */
const IconSearch = () => (
  <span>
    <img src={search} alt="search" style={{ marginTop: "5px" }} />
  </span>
);
const IconClear = () => <span style={{ fontSize: 18 }}>✕</span>;
const IconArrowRight = () => <span style={{ fontSize: 14 }}>›</span>;
const IconBack = () => <span style={{ fontSize: 16 }}></span>;
// const [selectedSkill, setSelectedSkill] = useState(null);

/* ---------------------------
   Helpers for Firestore + Auth
   --------------------------- */
const db = getFirestore();
const auth = getAuth();

/* ---------------------------
   Utility functions
   --------------------------- */
function parseCreatedAt(createdAt) {
  if (!createdAt) return null;
  if (createdAt instanceof Date) return createdAt;
  if (createdAt instanceof Timestamp) return createdAt.toDate();
  if (typeof createdAt === "string") {
    const d = new Date(createdAt);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}
function timeAgo(createdAt) {
  const date = parseCreatedAt(createdAt) ?? new Date();
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return `${diff} sec ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? "s" : ""} ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? "s" : ""} ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} month${Math.floor(diff / 2592000) > 1 ? "s" : ""} ago`;
  return `${Math.floor(diff / 31536000)} year${Math.floor(diff / 31536000) > 1 ? "s" : ""} ago`;
}
function safeNum(v) {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
}

/* ---------------------------
   Normalize job snapshot
   --------------------------- */
function normalizeJob(docSnap) {
  const id = docSnap.id;
  const data = docSnap.data ? docSnap.data() : docSnap;
  return {
    id,
    title: (data.title ?? "Untitled").toString(),
    description: (data.description ?? "").toString(),
    skills: Array.isArray(data.skills) ? data.skills.map((s) => String(s)) : [],
    tools: Array.isArray(data.tools) ? data.tools.map((s) => String(s)) : [],
    budget_from: data.budget_from ?? data.budget ?? 0,
    budget_to: data.budget_to ?? null,
    budget: data.budget ?? data.budget_from ?? 0,
    timeline: data.timeline ?? "",
    views: safeNum(data.views),
    applicants_count: safeNum(data.applicants_count),
    created_at: parseCreatedAt(data.created_at) ?? new Date(0),
    raw: data,
  };
}

/* ---------------------------
   SkillUsersScreen (Jobs screen) - embedded here
   --------------------------- */
function SkillUsersScreenInline({ skill, onBack }) {
  // navigation (for View button)
  const navigate = useNavigate?.() || (() => { });
  const [selectedTab, setSelectedTab] = useState("Works Jobs");
  const [jobs, setJobs] = useState([]);
  const [userDoc, setUserDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedJobsList, setSavedJobsList] = useState([]);

  const currentUserId = auth?.currentUser?.uid ?? null;

  // Filter jobs by skill (defensive)
  function filterBySkill(list) {
    if (!skill || !skill.trim()) return list;
    const normalized = skill.trim().toLowerCase();
    return list.filter((job) => {
      const skills = (job.skills || []).map((s) => s.toLowerCase());
      const tools = (job.tools || []).map((t) => t.toLowerCase());
      return (
        skills.includes(normalized) ||
        tools.includes(normalized) ||
        skills.some((s) => s.includes(normalized)) ||
        tools.some((t) => t.includes(normalized))
      );
    });
  }




  function renderJobs() {
    if (loading)
      return <div style={{ padding: 24 }}>Loading jobs...</div>;

    if (error)
      return <div style={{ padding: 24, color: "red" }}>{error}</div>;

    if (!jobs.length)
      return <div style={{ padding: 24 }}>No jobs found</div>;

    return (
      <div style={{ padding: 12 }}>
        {jobs.map((job) => (
          <div key={job.id} onClick={() => navigateToDetail(job, selectedTab === "24 Hour Jobs")}>
            <JobCard
              job={job}
              is24h={selectedTab === "24 Hour Jobs"}
              savedList={userDoc?.favoriteJobs || []}
            />
          </div>
        ))}
      </div>
    );
  }



  useEffect(() => {
    if (selectedTab !== "Saved Jobs") return;

    if (!userDoc?.favoriteJobs?.length) {
      setSavedJobsList([]);
      return;
    }

    let mounted = true;

    (async () => {
      setLoading(true);
      const docs = await fetchSavedJobsDocs(userDoc.favoriteJobs);
      if (mounted) {
        setSavedJobsList(docs);
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [selectedTab, JSON.stringify(userDoc?.favoriteJobs)]);

  useEffect(() => {
    if (selectedTab === "Saved Jobs") return;

    setLoading(true);
    setError(null);

    const collectionName =
      selectedTab === "24 Hour Jobs" ? "jobs_24h" : "jobs";

    const colRef = collection(db, collectionName);
    const q = query(colRef, orderBy("created_at", "desc"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const arr = snap.docs
          .map(normalizeJob)
          .filter((j) => j.title && j.description);

        const filtered = filterBySkill(arr);
        filtered.sort((a, b) => b.created_at - a.created_at);

        setJobs(filtered);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [selectedTab, skill]);

  // Subscribe to user doc (for saved favorites)
  useEffect(() => {
    if (!auth?.currentUser?.uid) {
      setUserDoc(null);
      return;
    }
    const userRef = doc(db, "users", auth.currentUser.uid);
    const unsub = onSnapshot(userRef, (snap) => {
      if (!snap.exists()) {
        setUserDoc(null);
        return;
      }
      setUserDoc(snap.data());
    });
    return () => unsub();
  }, [auth?.currentUser?.uid]);

  async function fetchSavedJobsDocs(savedIds) {
    if (!savedIds || savedIds.length === 0) return [];
    try {
      const [jobsSnap, jobs24Snap] = await Promise.all([getDocs(collection(db, "jobs")), getDocs(collection(db, "jobs_24h"))]);
      const allDocs = [...jobsSnap.docs, ...jobs24Snap.docs];
      return allDocs.filter((d) => savedIds.includes(d.id)).map(normalizeJob);
    } catch (err) {
      console.error("fetchSavedJobsDocs error", err);
      return [];
    }
  }

  async function toggleFavorite(jobId, isSaved) {
    const uid = auth?.currentUser?.uid;
    if (!uid) {
      alert("Please login to save jobs");
      return;
    }

    const userRef = doc(db, "users", uid);
    const currentFav = userDoc?.favoriteJobs || [];

    // 🔥 optimistic update
    const updatedFav = isSaved
      ? currentFav.filter((id) => id !== jobId)
      : [...new Set([...currentFav, jobId])];

    setUserDoc((prev) => ({
      ...prev,
      favoriteJobs: updatedFav,
    }));

    try {
      await updateDoc(userRef, {
        favoriteJobs: updatedFav,
      });
    } catch (err) {
      console.error("toggleFavorite error", err);
    }
  }


  function navigateToDetail(job, isFrom24h) {
    // navigate to job detail route, passing state
    try {
      navigate(`/freelance-dashboard/job-full/${job.id}`, { state: { job, isFrom24h } });
    } catch (err) {
      // If no router, just console
      console.log("navigate:", job.id, isFrom24h);
    }
  }

  // UI pieces
  function SkillChip({ label }) {
    const colors = ["#E3F2FD", "#FFF9C4", "#E1F5FE", "#F3E5F5", "#FFEBEE", "#E8F5E9"];
    const color = colors[Math.abs(hashCode(label)) % colors.length];
    return (
      <div style={{ marginRight: 6, padding: "6px 10px", borderRadius: 12, background: color, whiteSpace: "nowrap" }}>
        {label}
      </div>
    );
  }

  function hashCode(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i) | 0;
    return h;
  }

  function JobCard({ job, is24h = false, savedList = [] }) {
    const createdAt = job.created_at;
    const timeText = timeAgo(createdAt);
    const isSaved = (savedList || []).includes(job.id);

    return (
      <div
        style={{
          margin: "12px 0",
          borderRadius: 16,
          border: "1px solid #eee",
          padding: 20,
          background: "#fff",
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        }}
      >
        {/* TOP ROW */}
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 24, fontWeight: 400 }}>
              {job.company}
            </div>
            <div style={{ marginTop: 4, fontSize: 18, fontWeight: 400, color: "#000000" }}>
              {job.title}
            </div>
          </div>

          <div style={{ fontSize: 20, color: "#0A0A0A", fontWeight: 400 }}>
            ₹ {job.budget}/per day
          </div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(job.id, isSaved);
            }}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <img
              src={isSaved ? saved : save}
              alt="save"
              style={{ padding: "-10px", width: 16, marginLeft: "875px", marginTop: "15px" }}
            />
          </button>
        </div>

        {/* SKILLS */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 400, marginBottom: 8, color: "#0A0A0A" }}>
            Skills Required
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {job.skills.slice(0, 3).map((s) => (
              <div
                key={s}
                style={{
                  padding: "6px 12px",
                  borderRadius: 12,
                  fontSize: 12,
                  background: "#FFF3A0",
                  fontWeight: 500,
                }}
              >
                {s}
              </div>
            ))}

            {job.skills.length > 3 && (
              <div
                style={{
                  padding: "6px 12px",
                  borderRadius: 12,
                  fontSize: 12,
                  background: "#FFF3A0",
                  fontWeight: 500,
                }}
              >
                +{job.skills.length - 3}
              </div>
            )}
          </div>
        </div>

        {/* DESCRIPTION */}
        <div style={{ marginTop: 14, fontSize: 14, color: "#444" }}>
          {job.description}
        </div>

        {/* FOOTER */}
        <div
          style={{
            marginTop: 16,
            display: "flex",
            alignItems: "center",
            fontSize: 12,
            color: "#666",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", marginRight: 16 }}>
            <img src={eye} alt="eye" style={{ width: 14, marginRight: 6 }} />
            {job.views} Impression
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={clock} alt="clock" style={{ width: 14, marginRight: 6 }} />
            {timeText}
          </div>

          {/* SAVE ICON */}

        </div>
      </div>
    );

  }

  function renderSavedJobs() {
    if (!currentUserId)
      return <div style={{ padding: 24 }}>Please login to view saved jobs</div>;

    if (!userDoc)
      return <div style={{ padding: 24 }}>Loading user...</div>;

    if (!savedJobsList.length)
      return <div style={{ padding: 24 }}>No saved jobs yet</div>;

    return (
      <div style={{ padding: 12 }}>
        {savedJobsList.map((job) => (
          <div key={job.id} onClick={() => navigateToDetail(job, false)}>
            <JobCard
              job={job}
              is24h={false}
              savedList={userDoc.favoriteJobs || []}
            />
          </div>
        ))}
      </div>
    );
  }


  return (
    <div>
      <div style={styles.appBar}>
        <button style={styles.backBtn} onClick={onBack} aria-label="back">
          <IconBack />
        </button>
        <div style={styles.title}>{skill || "Jobs & Skills"}</div>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ padding: 12, borderBottom: "1px solid #eee", background: "#fff" }}>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", }}>
          {renderTabButtonInline("Works Jobs")}
          {renderTabButtonInline("24 Hour Jobs")}
          {renderTabButtonInline("Saved Jobs")}
        </div>
      </div>

      <div style={{ paddingBottom: 120 }}>
        {selectedTab === "Saved Jobs" ? renderSavedJobs() : renderJobs()}
      </div>
    </div>
  );

  function renderTabButtonInline(label) {
    const isSelected = selectedTab === label;
    return (
      <button
        onClick={() => setSelectedTab(label)}
        style={{
          padding: "8px 12px",
          borderRadius: 8,
          background: isSelected ? "rgba(124, 60, 255, 1)" : "transparent",
          color: isSelected ? "#fff" : "#000",
          border: "none",
          cursor: "pointer",
          minWidth: 120,
        }}
      >
        {label}
      </button>
    );
  }
}

/* ---------------------------
   Categories main component (export default)
   - It handles navigation stack: categories -> subcategories -> skill/jobs
   --------------------------- */
const categoryGridResponsiveCSS = `
@media (max-width: 1024px) {
  .category-grid {
    grid-template-columns: repeat(3, 1fr) !important;
  }
}

@media (max-width: 768px) {
  .category-grid {
    grid-template-columns: repeat(2, 1fr) !important; /* 📱 mobile */
  }
}
`;

export default function Categories() {

  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);
  // simple internal stack navigation
  const [stack, setStack] = useState([{ name: "categories", params: {} }]);
  const push = (name, params = {}) => setStack((s) => [...s, { name, params }]);
  const pop = () => setStack((s) => (s.length > 1 ? s.slice(0, s.length - 1) : s));
  const current = stack[stack.length - 1];
  const [selectedSkill, setSelectedSkill] = useState(null);



  // Categories state
  const [catQuery, setCatQuery] = useState("");

  // Subcategory query stored on stack top
  const subParams = current.name === "subcategories" ? current.params : null;
  const [subQuery, setSubQuery] = useState(subParams?.initialQuery || "");

  // useEffect(() => {
  //   if (current.name === "subcategories") {
  //     setSubQuery(current.params.initialQuery || "");
  //   }
  // }, [current]);

  // 🔥 DEFAULT SUBCATEGORY AUTO SELECT
  useEffect(() => {
    if (current.name !== "subcategories") return;

    const list = jobCategories1[current.params.category] || [];

    if (!list.length) return;

    // if nothing selected OR selected skill not in filtered list
    if (!selectedSkill || !list.includes(selectedSkill)) {
      setSelectedSkill(list[0]); // 🔥 FIRST OPTION DEFAULT
    }
  }, [current.name, current.params?.category]);


  const categoryKeys = useMemo(() => Object.keys(jobCategories1), []);
  const filteredCategories = useMemo(() => {
    if (!catQuery) return categoryKeys;
    return categoryKeys.filter((c) => c.toLowerCase().includes(catQuery.toLowerCase()));
  }, [catQuery, categoryKeys]);

  const filteredSubCategories = useMemo(() => {
    if (current.name !== "subcategories") return [];
    const list = jobCategories1[current.params.category] || [];
    if (!subQuery) return list;
    return list.filter((s) => s.toLowerCase().includes(subQuery.toLowerCase()));
  }, [current, subQuery]);


  function renderCategories() {
    return (
      <div>
        {/* HEADER */}
        <style>{categoryGridResponsiveCSS}</style>

        <div style={styles.appBar}>
          <div style={{ width: 36 }} />
          <div style={styles.title}>Categories</div>
          <div style={{ width: 36 }} />
        </div>

        <div style={styles.container}>
          {/* SEARCH BAR */}
          <div style={styles.searchBar}>
            <IconSearch />
            <input
              placeholder="Search"
              style={styles.input}
              value={catQuery}
              onChange={(e) => setCatQuery(e.target.value)}
            />
            {catQuery && (
              <button style={styles.clearBtn} onClick={() => setCatQuery("")}>
                <IconClear />
              </button>
            )}
          </div>

          {/* 🔥 CATEGORY CARDS GRID */}
          <div className="category-grid" style={styles.cardGrid}>

            {filteredCategories.map(( category) => (
              <div
                key={category}
                style={styles.categoryCard}
                onClick={() =>
                  push("subcategories", {
                    category,
                    initialQuery: "",
                  })
                }
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 28px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(0,0,0,0.08)";
                }}
              >
                <div style={styles.categoryCardTop}>
                  <img
                    src={categoryImg}
                    alt="Category"
                    style={styles.categoryImage}
                  />
                </div>

                <div style={styles.categoryCardBottom}>
                  {category}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderSubcategories() {
    const category = current.params.category;

    return (
      <div>
        {/* HEADER */}
        <div style={styles.appBar}>
          <button style={styles.backBtn} onClick={pop}>
            <IconBack />
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 36,
              fontWeight: 400,
              marginTop: 5,
              marginLeft: 70,
              gap: 16,
            }}
          >
            {/* BACK ARROW CIRCLE */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "14px",
                backgroundColor: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
                cursor: "pointer",
              }}
            >
              <img
                src={backarrow}
                alt="backarrow"
                style={{ width: 20, height: 20 }}
              />
            </div>

            <span>Browse Projects</span>
          </div>


          <div style={{ width: 36 }} />
        </div>

        <div style={styles.container}>
          {/* SEARCH */}
          <div style={styles.searchBar}>
            <IconSearch />
            <input
              placeholder="Search"
              style={styles.input}
              value={subQuery}
              onChange={(e) => setSubQuery(e.target.value)}
            />
            {subQuery && (
              <button style={styles.clearBtn} onClick={() => setSubQuery("")}>
                <IconClear />
              </button>
            )}
          </div>

          {/* 🔥 SKILL CHIPS (IMAGE MATCH) */}
          <div
            style={{
              display: "flex",
              gap: 10,
              overflowX: "auto",      // 🔥 scroll stays
              flexWrap: "nowrap",
              padding: "14px 0",

              scrollbarWidth: "none",     // 🔥 Firefox
              msOverflowStyle: "none",    // 🔥 IE / Edge
            }}
            className="hide-scrollbar"
          >
            {filteredSubCategories.map((sub) => {
              const isActive = selectedSkill === sub;

              return (
                <div
                  key={sub}
                  onClick={() => setSelectedSkill(sub)}
                  style={{
                    padding: "13px 14px",
                    borderRadius: 10,
                    fontSize: 12,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    whiteSpace: "nowrap",
                    width: "fit-content",
                    backgroundColor: isActive ? "#7C3CFF" : "#FFFFFF99",
                    color: isActive ? "#fff" : "#444",
                    border: "1px solid #E0E0E0",
                    transition: "all 0.2s ease",
                  }}
                >
                  {sub}
                </div>
              );
            })}
          </div>



          {/* 🔥 JOB LIST (SAME AS SCREENSHOT) */}
          {selectedSkill && (
            <SkillUsersScreenInline
              skill={selectedSkill}
              onBack={pop}
            />
          )}
        </div>
      </div>
    );
  }


  filteredSubCategories.map((sub) => {
    const isActive = selectedSkill === sub;

    return (
      <div
        key={sub}
        role="button"
        tabIndex={0}
        aria-pressed={isActive}
        onClick={() => setSelectedSkill(sub)}
        onKeyDown={(e) => {
          if (e.key === "Enter") setSelectedSkill(sub);
        }}
        style={{
          padding: "8px 16px",
          borderRadius: 999,              // 🔥 pill shape
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
          userSelect: "none",
          whiteSpace: "normal",
          textAlign: "center",
          lineHeight: "16px",

          transition: "all 0.2s ease",

          // 🔥 COLORS (IMPORTANT)
          backgroundColor: isActive
            ? "rgba(124, 60, 255, 1)"     // PURPLE when selected
            : "#F2F2F2",                  // GRAY when not selected

          color: isActive
            ? "#FFFFFF"
            : "#555555",

          border: isActive
            ? "1px solid rgba(124, 60, 255, 1)"
            : "1px solid #E0E0E0",

          boxShadow: isActive
            ? "0 4px 10px rgba(124,60,255,0.25)"
            : "none",
        }}
      >
        {sub}
      </div>
    );
  })


  function renderSkill() {
    const skill = current.params.skill;
    return <SkillUsersScreenInline skill={skill} onBack={pop} />;
  }

  /* ---------- main render ---------- */
  return (
    <div
      className="freelance-wrapper"
      style={{
        marginLeft: collapsed ? "-110px" : "50px",
        transition: "margin-left 0.25s ease",
      }}
    >
      <div style={styles.page}>

        {current.name === "categories" && renderCategories()}
        {current.name === "subcategories" && renderSubcategories()}
        {current.name === "skill" && renderSkill()}
      </div>
    </div>
  );
}








// Categories.jsx
// import React, { useEffect, useMemo, useState, useRef } from "react";
// import { getAuth } from "firebase/auth";
// import {
//   getFirestore,
//   collection,
//   doc,
//   onSnapshot,
//   getDocs,
//   updateDoc,
//   query,
//   orderBy,
//   where,
//   Timestamp,
// } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

// import categoryImg from "../../assets/categories.png";
// import search from "../../assets/search .png";
// import eye from "../../assets/eye.png";
// import clock from "../../assets/clock.png";
// import saved from "../../assets/save.png";
// import save from "../../assets/save2.png";
// import backarrow from "../../assets/backarrow.png";
// import "./frelancerbrowserproject.css"



// const jobCategories1 = {
//   "Graphics & Design": [
//     "Logo Design",
//     "Brand Style Guides",
//     "Business Cards & Stationery",
//     "Illustration",
//     "Pattern Design",
//     "Website Design",
//     "App Design",
//     "UX Design",
//     "Game Art",
//     "NFTs & Collectibles",
//     "Industrial & Product Design",
//     "Architecture & Interior Design",
//     "Landscape Design",
//     "Fashion Design",
//     "Jewelry Design",
//     "Presentation Design",
//     "Infographic Design",
//     "Vector Tracing",
//     "Car Wraps",
//     "Image Editing",
//     "Photoshop Editing",
//     "T-Shirts & Merchandise",
//     "Packaging Design",
//     "Book Design",
//     "Album Cover Design",
//     "Podcast Cover Art",
//     "Menu Design",
//     "Invitation Design",
//     "Brochure Design",
//     "Poster Design",
//     "Signage Design",
//     "Flyer Design",
//     "Social Media Design",
//     "Print Design",
//   ],

//   "Programming & Tech": [
//     "Website Development",
//     "Website Builders & CMS",
//     "Web Programming",
//     "E-Commerce Development",
//     "Game Development",
//     "Mobile Apps (iOS & Android)",
//     "Desktop Applications",
//     "Chatbots",
//     "QA & Review",
//     "User Testing",
//     "Support & IT",
//     "Data Analysis & Reports",
//     "Convert Files",
//     "Databases",
//     "Cybersecurity",
//     "Data Protection",
//     "Cloud Computing",
//     "DevOps",
//     "AI Development",
//     "Machine Learning",
//     "Blockchain & NFTs",
//     "Scripts & Automation",
//     "Software Customization",
//   ],

//   "Digital Marketing": [
//     "Social Media Marketing",
//     "SEO",
//     "Content Marketing",
//     "Video Marketing",
//     "Email Marketing",
//     "SEM (Search Engine Marketing)",
//     "Influencer Marketing",
//     "Local SEO",
//     "Affiliate Marketing",
//     "Mobile Marketing & Advertising",
//     "Display Advertising",
//     "E-Commerce Marketing",
//     "Text Message Marketing",
//     "Crowdfunding",
//     "Marketing Strategy",
//     "Web Analytics",
//     "Domain Research",
//     "Music Promotion",
//     "Book & eBook Marketing",
//     "Podcast Marketing",
//     "Community Management",
//     "Marketing Consulting",
//   ],

//   "Writing & Translation": [
//     "Articles & Blog Posts",
//     "Proofreading & Editing",
//     "Translation",
//     "Website Content",
//     "Technical Writing",
//     "Copywriting",
//     "Brand Voice & Tone",
//     "Resume Writing",
//     "Cover Letters",
//     "LinkedIn Profiles",
//     "Press Releases",
//     "Product Descriptions",
//     "Case Studies",
//     "White Papers",
//     "Scriptwriting",
//     "Speechwriting",
//     "Creative Writing",
//     "Book Editing",
//     "Beta Reading",
//     "Grant Writing",
//     "UX Writing",
//     "Email Copy",
//     "Business Names & Slogans",
//     "Transcription",
//     "Legal Writing",
//   ],

//   "Video & Animation": [
//     "Whiteboard & Animated Explainers",
//     "Video Editing",
//     "Short Video Ads",
//     "Logo Animation",
//     "Character Animation",
//     "2D/3D Animation",
//     "Intros & Outros",
//     "Lyric & Music Videos",
//     "Visual Effects",
//     "Spokesperson Videos",
//     "App & Website Previews",
//     "Product Photography & Demos",
//     "Subtitles & Captions",
//     "Live Action Explainers",
//     "Unboxing Videos",
//     "Slideshow Videos",
//     "Animation for Kids",
//     "Trailers & Teasers",
//   ],

//   "Music & Audio": [
//     "Voice Over",
//     "Mixing & Mastering",
//     "Producers & Composers",
//     "Singers & Vocalists",
//     "Session Musicians",
//     "Songwriters",
//     "Audiobook Production",
//     "Sound Design",
//     "Audio Editing",
//     "Jingles & Intros",
//     "Podcast Editing",
//     "Music Transcription",
//     "Dialogue Editing",
//     "DJ Drops & Tags",
//     "Music Promotion",
//   ],

//   "AI Services": [
//     "AI Artists",
//     "AI Applications",
//     "AI Video Generators",
//     "AI Music Generation",
//     "AI Chatbot Development",
//     "AI Website Builders",
//     "Custom GPT & LLMs",
//     "AI Training Data Preparation",
//     "Text-to-Speech / Voice Cloning",
//     "Prompt Engineering",
//   ],

//   Data: [
//     "Data Entry",
//     "Data Mining & Scraping",
//     "Data Analytics & Reports",
//     "Database Design",
//     "Data Visualization",
//     "Dashboards",
//     "Excel / Google Sheets",
//     "Statistical Analysis",
//     "Data Engineering",
//     "Machine Learning Models",
//     "Data Cleaning",
//   ],

//   Business: [
//     "Business Plans",
//     "Market Research",
//     "Branding Services",
//     "Legal Consulting",
//     "Financial Consulting",
//     "Career Counseling",
//     "Project Management",
//     "Supply Chain Management",
//     "HR Consulting",
//     "E-Commerce Management",
//     "Business Consulting",
//     "Presentations",
//     "Virtual Assistant",
//   ],

//   Finance: [
//     "Accounting & Bookkeeping",
//     "Financial Forecasting",
//     "Financial Modeling",
//     "Tax Consulting",
//     "Crypto & NFT Consulting",
//     "Business Valuation",
//     "Pitch Decks",
//   ],

//   Photography: [
//     "Product Photography",
//     "Real Estate Photography",
//     "Portraits",
//     "Image Retouching",
//     "Food Photography",
//     "Drone Photography",
//     "Lifestyle Photography",
//     "AI Image Enhancement",
//   ],

//   Lifestyle: [
//     "Gaming",
//     "Astrology & Psychics",
//     "Online Tutoring",
//     "Arts & Crafts",
//     "Fitness Lessons",
//     "Nutrition",
//     "Relationship Advice",
//     "Personal Styling",
//     "Cooking Lessons",
//     "Life Coaching",
//     "Travel Advice",
//     "Wellness & Meditation",
//     "Language Lessons",
//   ],

//   Consulting: [
//     "Management Consulting",
//     "Business Strategy",
//     "HR & Leadership",
//     "Financial Advisory",
//     "Legal Consulting",
//     "Technology Consulting",
//     "Cybersecurity Consulting",
//     "Marketing Strategy",
//   ],

//   "Personal Growth & Hobbies": [
//     "Life Coaching",
//     "Productivity Coaching",
//     "Study Skills",
//     "Language Learning",
//     "Public Speaking",
//     "Career Mentoring",
//     "Mindfulness & Meditation",
//     "Confidence Coaching",
//   ],
// };

// const styles = {
//   page: {
//     fontFamily:
//       '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
//     background: "#fff",
//     minHeight: "100vh",
//     color: "#111",
//   },
//   // appBar: {
//   //   display: "flex",
//   //   alignItems: "center",
//   //   height: 64,
//   //   padding: "0 12px",
//   //   borderBottom: "1px solid #eee",
//   //   background: "#fff",
//   //   position: "sticky",
//   //   top: 0,
//   //   zIndex: 20,
//   // },
//   backBtn: {
//     border: "none",
//     background: "transparent",
//     fontSize: 18,
//     cursor: "pointer",
//     padding: "8px",
//   },
//   title: {
//     flex: 1,
//     textAlign: "center",
//     fontSize: 20,
//     fontWeight: 600,
//     marginTop: "5px",
//   },

//   container: {
//     maxWidth: 1000,
//     margin: "10px auto",
//     padding: 16,

//   },
//   searchBar: {
//     height: 48,
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     padding: "0 12px",
//     borderRadius: 12,
//     border: "1px solid block",
//     boxShadow: "0 10px 50px rgba(0,0,0,0.08)",
//     background: "#fff",
//   },
//   input: {
//     border: "none",
//     outline: "none",
//     flex: 1,
//     fontSize: 14,
//     marginTop: "5px",
//     padding: "9px 0px 0px 10px",


//   },
//   list: {
//     marginTop: 12,
//   },
//   listItem: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "14px 8px",
//     cursor: "pointer",
//     borderBottom: "1px solid #f0f0f0",
//   },
//   smallMuted: {
//     fontSize: 13,
//     color: "#666",
//   },
//   emptyBox: {
//     marginTop: 60,
//     textAlign: "center",
//     color: "#666",
//   },
//   breadcrumbRow: {
//     marginTop: 12,
//     display: "flex",
//     gap: 6,
//     alignItems: "center",
//   },
//   chip: {
//     fontSize: 13,
//     color: "#222",
//     fontWeight: 600,
//   },
//   clearBtn: {
//     background: "transparent",
//     border: "none",
//     cursor: "pointer",
//     fontSize: 18,
//     padding: 6,
//   },
//   grid: {
//     marginTop: 20,
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
//     gap: 16,
//   },
//   card: {
//     borderRadius: 16,
//     overflow: "hidden",
//     cursor: "pointer",
//     background: "#fff",
//     boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
//   },
//   cardImg: {
//     height: 110,
//     background: "linear-gradient(135deg,#6a00ff,#9c27ff)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: 36,
//     color: "#fff",
//   },
//   cardLabel: {
//     padding: 12,
//     fontWeight: 600,
//     textAlign: "center",
//   },

//   /* 🔥 FORCE 4 COLUMNS */
//   cardGrid: {
//     marginTop: 20,
//     display: "grid",
//     gridTemplateColumns: "repeat(4, 1fr)",
//     gap: 16,
//   },

//   categoryCard: {
//     borderRadius: 16,
//     background: "#fff",
//     boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
//     cursor: "pointer",
//     overflow: "hidden",
//     transition: "transform 0.15s ease",
//   },
//   categoryCardTop: {
//     height: 130,
//     overflow: "hidden",
//   },

//   categoryImage: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover", // 🔥 fills top area only
//   },

//   categoryCardBottom: {
//     padding: "12px 10px",
//     textAlign: "center",
//     fontWeight: 600,
//     fontSize: 14,
//     background: "#fff",
//   },



// };

// const IconSearch = () => (
//   <span>
//     <img src={search} alt="search" style={{ marginTop: "5px" }} />
//   </span>
// );
// const IconClear = () => <span style={{ fontSize: 18 }}>✕</span>;
// const IconArrowRight = () => <span style={{ fontSize: 14 }}>›</span>;
// const IconBack = () => <span style={{ fontSize: 16 }}></span>;

// const db = getFirestore();
// const auth = getAuth();

// function parseCreatedAt(createdAt) {
//   if (!createdAt) return null;
//   if (createdAt instanceof Date) return createdAt;
//   if (createdAt instanceof Timestamp) return createdAt.toDate();
//   if (typeof createdAt === "string") {
//     const d = new Date(createdAt);
//     return isNaN(d.getTime()) ? null : d;
//   }
//   return null;
// }
// function timeAgo(createdAt) {
//   const date = parseCreatedAt(createdAt) ?? new Date();
//   const now = new Date();
//   const diff = Math.floor((now - date) / 1000);
//   if (diff < 60) return `${diff} sec ago`;
//   if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
//   if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? "s" : ""} ago`;
//   if (diff < 2592000) return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? "s" : ""} ago`;
//   if (diff < 31536000) return `${Math.floor(diff / 2592000)} month${Math.floor(diff / 2592000) > 1 ? "s" : ""} ago`;
//   return `${Math.floor(diff / 31536000)} year${Math.floor(diff / 31536000) > 1 ? "s" : ""} ago`;
// }
// function safeNum(v) {
//   if (v == null) return 0;
//   if (typeof v === "number") return v;
//   const n = Number(v);
//   return Number.isNaN(n) ? 0 : n;
// }

// /* ---------------------------
//    Normalize job snapshot
//    --------------------------- */
// function normalizeJob(docSnap) {
//   const id = docSnap.id;
//   const data = docSnap.data ? docSnap.data() : docSnap;
//   return {
//     id,
//     title: (data.title ?? "Untitled").toString(),
//     description: (data.description ?? "").toString(),
//     skills: Array.isArray(data.skills) ? data.skills.map((s) => String(s)) : [],
//     tools: Array.isArray(data.tools) ? data.tools.map((s) => String(s)) : [],
//     budget_from: data.budget_from ?? data.budget ?? 0,
//     budget_to: data.budget_to ?? null,
//     budget: data.budget ?? data.budget_from ?? 0,
//     timeline: data.timeline ?? "",
//     views: safeNum(data.views),
//     applicants_count: safeNum(data.applicants_count),
//     created_at: parseCreatedAt(data.created_at) ?? new Date(0),
//     raw: data,
//   };
// }

// /* ---------------------------
//    SkillUsersScreen (Jobs screen) - embedded here
//    --------------------------- */
// function SkillUsersScreenInline({ skill, onBack }) {
//   // navigation (for View button)
//   const navigate = useNavigate?.() || (() => { });
//   const [selectedTab, setSelectedTab] = useState("Works");
//   const [jobs, setJobs] = useState([]);
//   const [userDoc, setUserDoc] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [savedJobsList, setSavedJobsList] = useState([]);

//   const currentUserId = auth?.currentUser?.uid ?? null;

//   // Filter jobs by skill (defensive)
//   function filterBySkill(list) {
//     if (!skill || !skill.trim()) return list;
//     const normalized = skill.trim().toLowerCase();
//     return list.filter((job) => {
//       const skills = (job.skills || []).map((s) => s.toLowerCase());
//       const tools = (job.tools || []).map((t) => t.toLowerCase());
//       return (
//         skills.includes(normalized) ||
//         tools.includes(normalized) ||
//         skills.some((s) => s.includes(normalized)) ||
//         tools.some((t) => t.includes(normalized))
//       );
//     });
//   }




//   function renderJobs() {
//     if (loading)
//       return <div style={{ padding: 24 }}>Loading jobs...</div>;

//     if (error)
//       return <div style={{ padding: 24, color: "red" }}>{error}</div>;

//     if (!jobs.length)
//       return <div style={{ padding: 24 }}>No jobs found</div>;

//     return (
//       <div style={{ padding: 12 }}>
//         {jobs.map((job) => (
//           <div key={job.id} onClick={() => navigateToDetail(job, selectedTab === "24-Hour")}>
//             <JobCard
//               job={job}
//               is24h={selectedTab === "24-Hour"}
//               savedList={userDoc?.favoriteJobs || []}
//             />
//           </div>
//         ))}
//       </div>
//     );
//   }



//   useEffect(() => {
//     if (selectedTab !== "Saved Jobs") return;

//     if (!userDoc?.favoriteJobs?.length) {
//       setSavedJobsList([]);
//       return;
//     }

//     let mounted = true;

//     (async () => {
//       setLoading(true);
//       const docs = await fetchSavedJobsDocs(userDoc.favoriteJobs);
//       if (mounted) {
//         setSavedJobsList(docs);
//         setLoading(false);
//       }
//     })();

//     return () => {
//       mounted = false;
//     };
//   }, [selectedTab, JSON.stringify(userDoc?.favoriteJobs)]);

//   useEffect(() => {
//     if (selectedTab === "Saved Jobs") return;

//     setLoading(true);
//     setError(null);

//     const collectionName =
//       selectedTab === "24-Hour" ? "jobs_24h" : "jobs";

//     const colRef = collection(db, collectionName);
//     const q = query(colRef, orderBy("created_at", "desc"));

//     const unsub = onSnapshot(
//       q,
//       (snap) => {
//         const arr = snap.docs
//           .map(normalizeJob)
//           .filter((j) => j.title && j.description);

//         const filtered = filterBySkill(arr);
//         filtered.sort((a, b) => b.created_at - a.created_at);

//         setJobs(filtered);
//         setLoading(false);
//       },
//       (err) => {
//         setError(err.message);
//         setLoading(false);
//       }
//     );

//     return () => unsub();
//   }, [selectedTab, skill]);

//   // Subscribe to user doc (for saved favorites)
//   useEffect(() => {
//     if (!auth?.currentUser?.uid) {
//       setUserDoc(null);
//       return;
//     }
//     const userRef = doc(db, "users", auth.currentUser.uid);
//     const unsub = onSnapshot(userRef, (snap) => {
//       if (!snap.exists()) {
//         setUserDoc(null);
//         return;
//       }
//       setUserDoc(snap.data());
//     });
//     return () => unsub();
//   }, [auth?.currentUser?.uid]);

//   async function fetchSavedJobsDocs(savedIds) {
//     if (!savedIds || savedIds.length === 0) return [];
//     try {
//       const [jobsSnap, jobs24Snap] = await Promise.all([getDocs(collection(db, "jobs")), getDocs(collection(db, "jobs_24h"))]);
//       const allDocs = [...jobsSnap.docs, ...jobs24Snap.docs];
//       return allDocs.filter((d) => savedIds.includes(d.id)).map(normalizeJob);
//     } catch (err) {
//       console.error("fetchSavedJobsDocs error", err);
//       return [];
//     }
//   }

//   async function toggleFavorite(jobId, isSaved) {
//     const uid = auth?.currentUser?.uid;
//     if (!uid) {
//       alert("Please login to save jobs");
//       return;
//     }

//     const userRef = doc(db, "users", uid);
//     const currentFav = userDoc?.favoriteJobs || [];

//     // 🔥 optimistic update
//     const updatedFav = isSaved
//       ? currentFav.filter((id) => id !== jobId)
//       : [...new Set([...currentFav, jobId])];

//     setUserDoc((prev) => ({
//       ...prev,
//       favoriteJobs: updatedFav,
//     }));

//     try {
//       await updateDoc(userRef, {
//         favoriteJobs: updatedFav,
//       });
//     } catch (err) {
//       console.error("toggleFavorite error", err);
//     }
//   }


//   function navigateToDetail(job, isFrom24h) {
//     // navigate to job detail route, passing state
//     try {
//       navigate(`/freelance-dashboard/job-full/${job.id}`, { state: { job, isFrom24h } });
//     } catch (err) {
//       // If no router, just console
//       console.log("navigate:", job.id, isFrom24h);
//     }
//   }

//   // UI pieces
//   function SkillChip({ label }) {
//     const colors = ["#E3F2FD", "#FFF9C4", "#E1F5FE", "#F3E5F5", "#FFEBEE", "#E8F5E9"];
//     const color = colors[Math.abs(hashCode(label)) % colors.length];
//     return (
//       <div style={{ marginRight: 6, padding: "6px 10px", borderRadius: 12, background: color, whiteSpace: "nowrap" }}>
//         {label}
//       </div>
//     );
//   }

//   function hashCode(str) {
//     let h = 0;
//     for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i) | 0;
//     return h;
//   }

//   function JobCard({ job, is24h = false, savedList = [] }) {
//     const createdAt = job.created_at;
//     const timeText = timeAgo(createdAt);
//     const isSaved = (savedList || []).includes(job.id);

//     return (
//       <div
//         style={{
//           margin: "12px 0",
//           borderRadius: 16,
//           border: "1px solid #eee",
//           padding: 20,
//           background: "#fff",
//           boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
//         }}
//       >
//         {/* TOP ROW */}
//         <div style={{ display: "flex", alignItems: "flex-start" }}>
//           <div style={{ flex: 1 }}>
//             <div style={{ fontSize: 24, fontWeight: 400 }}>
//               {job.company}
//             </div>
//             <div style={{ marginTop: 4, fontSize: 18, fontWeight: 400, color: "#000000" }}>
//               {job.title}
//             </div>
//           </div>

//           <div style={{ fontSize: 20, color: "#0A0A0A", fontWeight: 400 }}>
//             ₹ {job.budget}/per day
//           </div>
//         </div>
//         <div style={{ marginLeft: "auto" }}>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               toggleFavorite(job.id, isSaved);
//             }}
//             style={{
//               background: "transparent",
//               border: "none",
//               cursor: "pointer",
//               padding: 0,
//             }}
//           >
//             <img
//               src={isSaved ? saved : save}
//               alt="save"
//               style={{ padding: "-10px", width: 16, marginLeft: "875px", marginTop: "15px" }}
//             />
//           </button>
//         </div>

//         {/* SKILLS */}
//         <div style={{ marginTop: 16 }}>
//           <div style={{ fontSize: 14, fontWeight: 400, marginBottom: 8, color: "#0A0A0A" }}>
//             Skills Required
//           </div>

//           <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//             {job.skills.slice(0, 3).map((s) => (
//               <div
//                 key={s}
//                 style={{
//                   padding: "6px 12px",
//                   borderRadius: 12,
//                   fontSize: 12,
//                   background: "#FFF3A0",
//                   fontWeight: 500,
//                 }}
//               >
//                 {s}
//               </div>
//             ))}

//             {job.skills.length > 3 && (
//               <div
//                 style={{
//                   padding: "6px 12px",
//                   borderRadius: 12,
//                   fontSize: 12,
//                   background: "#FFF3A0",
//                   fontWeight: 500,
//                 }}
//               >
//                 +{job.skills.length - 3}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* DESCRIPTION */}
//         <div style={{ marginTop: 14, fontSize: 14, color: "#444" }}>
//           {job.description}
//         </div>

//         {/* FOOTER */}
//         <div
//           style={{
//             marginTop: 16,
//             display: "flex",
//             alignItems: "center",
//             fontSize: 12,
//             color: "#666",
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", marginRight: 16 }}>
//             <img src={eye} alt="eye" style={{ width: 14, marginRight: 6 }} />
//             {job.views} Impression
//           </div>

//           <div style={{ display: "flex", alignItems: "center" }}>
//             <img src={clock} alt="clock" style={{ width: 14, marginRight: 6 }} />
//             {timeText}
//           </div>

//           {/* SAVE ICON */}

//         </div>
//       </div>
//     );

//   }

//   function renderSavedJobs() {
//     if (!currentUserId)
//       return <div style={{ padding: 24 }}>Please login to view saved jobs</div>;

//     if (!userDoc)
//       return <div style={{ padding: 24 }}>Loading user...</div>;

//     if (!savedJobsList.length)
//       return <div style={{ padding: 24 }}>No saved jobs yet</div>;

//     return (
//       <div style={{ padding: 12 }}>
//         {savedJobsList.map((job) => (
//           <div key={job.id} onClick={() => navigateToDetail(job, false)}>
//             <JobCard
//               job={job}
//               is24h={false}
//               savedList={userDoc.favoriteJobs || []}
//             />
//           </div>
//         ))}
//       </div>
//     );
//   }


//   return (
//     <div>
//       <div style={styles.appBar}>
//         <button style={styles.backBtn} onClick={onBack} aria-label="back">
//           <IconBack />
//         </button>
//         <div style={styles.title}>{skill || "Jobs & Skills"}</div>
//         <div style={{ width: 36 }} />
//       </div>

//       <div style={{ padding: 12, borderBottom: "1px solid #eee", background: "#fff" }}>
//         <div style={{ display: "flex", gap: 8, justifyContent: "center", }}>
//           {renderTabButtonInline("Works")}
//           {renderTabButtonInline("24-Hour")}
//           {renderTabButtonInline("Saved Jobs")}
//         </div>
//       </div>

//       <div style={{ paddingBottom: 120 }}>
//         {selectedTab === "Saved Jobs" ? renderSavedJobs() : renderJobs()}
//       </div>
//     </div>
//   );

//   function renderTabButtonInline(label) {
//     const isSelected = selectedTab === label;
//     return (
//       <button
//         onClick={() => setSelectedTab(label)}
//         className={`tab-button ${isSelected ? "active" : ""}`}
//       >
//         {label}
//       </button>

//     );
//   }
// }


// const categoryGridResponsiveCSS = `
// @media (max-width: 1024px) {
//   .category-grid {
//     grid-template-columns: repeat(3, 1fr) !important;
//   }
// }

// @media (max-width: 768px) {
//   .category-grid {
//     grid-template-columns: repeat(2, 1fr) !important; /* 📱 mobile */
//   }
// }
// `;

// export default function Categories() {

//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);
//   // simple internal stack navigation
//   const [stack, setStack] = useState([{ name: "categories", params: {} }]);
//   const push = (name, params = {}) => setStack((s) => [...s, { name, params }]);
//   const pop = () => setStack((s) => (s.length > 1 ? s.slice(0, s.length - 1) : s));
//   const current = stack[stack.length - 1];
//   const [selectedSkill, setSelectedSkill] = useState(null);



//   // Categories state
//   const [catQuery, setCatQuery] = useState("");

//   // Subcategory query stored on stack top
//   const subParams = current.name === "subcategories" ? current.params : null;
//   const [subQuery, setSubQuery] = useState(subParams?.initialQuery || "");

//   // useEffect(() => {
//   //   if (current.name === "subcategories") {
//   //     setSubQuery(current.params.initialQuery || "");
//   //   }
//   // }, [current]);

//   // 🔥 DEFAULT SUBCATEGORY AUTO SELECT
//   useEffect(() => {
//     if (current.name !== "subcategories") return;

//     const list = jobCategories1[current.params.category] || [];

//     if (!list.length) return;

//     // if nothing selected OR selected skill not in filtered list
//     if (!selectedSkill || !list.includes(selectedSkill)) {
//       setSelectedSkill(list[0]); // 🔥 FIRST OPTION DEFAULT
//     }
//   }, [current.name, current.params?.category]);


//   const categoryKeys = useMemo(() => Object.keys(jobCategories1), []);
//   const filteredCategories = useMemo(() => {
//     if (!catQuery) return categoryKeys;
//     return categoryKeys.filter((c) => c.toLowerCase().includes(catQuery.toLowerCase()));
//   }, [catQuery, categoryKeys]);

//   const filteredSubCategories = useMemo(() => {
//     if (current.name !== "subcategories") return [];
//     const list = jobCategories1[current.params.category] || [];
//     if (!subQuery) return list;
//     return list.filter((s) => s.toLowerCase().includes(subQuery.toLowerCase()));
//   }, [current, subQuery]);


//   function renderCategories() {
//     return (
//       <div>
//         {/* HEADER */}
//         <style>{categoryGridResponsiveCSS}</style>

//         <div style={styles.appBar}>
//           <div style={{ width: 36 }} />
//           <div style={styles.title}>Categories</div>
//           <div style={{ width: 36 }} />
//         </div>

//         <div style={styles.container}>
//           {/* SEARCH BAR */}
//           <div style={styles.searchBar}>
//             <IconSearch />
//             <input
//               placeholder="Search"
//               style={styles.input}
//               value={catQuery}
//               onChange={(e) => setCatQuery(e.target.value)}
//             />
//             {catQuery && (
//               <button style={styles.clearBtn} onClick={() => setCatQuery("")}>
//                 <IconClear />
//               </button>
//             )}
//           </div>

//           {/* 🔥 CATEGORY CARDS GRID */}
//           <div className="category-grid" style={styles.cardGrid}>

//             {filteredCategories.map((category) => (
//               <div
//                 key={category}
//                 style={styles.categoryCard}
//                 onClick={() =>
//                   push("subcategories", {
//                     category,
//                     initialQuery: "",
//                   })
//                 }
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.transform = "translateY(-2px)";
//                   e.currentTarget.style.boxShadow =
//                     "0 12px 28px rgba(0,0,0,0.12)";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.transform = "translateY(0)";
//                   e.currentTarget.style.boxShadow =
//                     "0 8px 20px rgba(0,0,0,0.08)";
//                 }}
//               >
//                 <div style={styles.categoryCardTop}>
//                   <img
//                     src={categoryImg}
//                     alt="Category"
//                     style={styles.categoryImage}
//                   />
//                 </div>

//                 <div style={styles.categoryCardBottom}>
//                   {category}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   function renderSubcategories() {
//     const category = current.params.category;

//     return (
//       <div>
//         {/* HEADER */}
//         <div style={styles.appBar}>
//           <button style={styles.backBtn} onClick={pop}>
//             <IconBack />
//           </button>

//           <div
//             className="frelancerbrowserproject"
//             style={{
//               display: "flex",
//               alignItems: "center",
//               fontSize: 36,
//               fontWeight: 400,
//               marginTop: "40px",
//               marginLeft: "20px",
//               gap: 16,
//             }}
//           >

//             <div
//               style={{
//                 width: 44,
//                 height: 44,
//                 borderRadius: "14px",
//                 backgroundColor: "#c1c1c1ff",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
//                 cursor: "pointer",
//               }}
//             >

//               <img
//                 src={backarrow}
//                 alt="backarrow"
//                 style={{ width: 20, height: 20 }}
//               />

//             </div>

//             <span>Browse Projects</span>
//           </div>


//           <div style={{ width: 36 }} />
//         </div>

//         <div style={styles.container}>
//           {/* SEARCH */}
//           <div style={styles.searchBar}>
//             <IconSearch />
//             <input
//               placeholder="Search"
//               style={styles.input}
//               value={subQuery}
//               onChange={(e) => setSubQuery(e.target.value)}
//             />
//             {subQuery && (
//               <button style={styles.clearBtn} onClick={() => setSubQuery("")}>
//                 <IconClear />
//               </button>
//             )}
//           </div>

//           {/* 🔥 SKILL CHIPS (IMAGE MATCH) */}
//           <div
//             style={{
//               display: "flex",
//               gap: 10,
//               overflowX: "auto",      // 🔥 scroll stays
//               flexWrap: "nowrap",
//               padding: "24px 0",

//               scrollbarWidth: "none",     // 🔥 Firefox
//               msOverflowStyle: "none",    // 🔥 IE / Edge
//             }}
//             className="hide-scrollbar"
//           >
//             {filteredSubCategories.map((sub) => {
//               const isActive = selectedSkill === sub;

//               return (
//                 <div
//                   key={sub}
//                   onClick={() => setSelectedSkill(sub)}
//                   className={`skill-chip ${isActive ? "active" : ""}`}
//                 >
//                   {sub}
//                 </div>

//               );
//             })}
//           </div>



//           {/* 🔥 JOB LIST (SAME AS SCREENSHOT) */}
//           {selectedSkill && (
//             <SkillUsersScreenInline
//               skill={selectedSkill}
//               onBack={pop}
//             />
//           )}
//         </div>
//       </div>
//     );
//   }


//   filteredSubCategories.map((sub) => {
//     const isActive = selectedSkill === sub;

//     return (
//       <div
//         key={sub}
//         role="button"
//         tabIndex={0}
//         aria-pressed={isActive}
//         onClick={() => setSelectedSkill(sub)}
//         onKeyDown={(e) => {
//           if (e.key === "Enter") setSelectedSkill(sub);
//         }}
//       >
//         {sub}
//       </div>
//     );
//   })


//   function renderSkill() {
//     const skill = current.params.skill;
//     return <SkillUsersScreenInline skill={skill} onBack={pop} />;
//   }

//   /* ---------- main render ---------- */
//   return (
//     <div
//       className="freelance-wrapper"
//       style={{
//         marginLeft: collapsed ? "-110px" : "50px",
//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       <div style={styles.page}>

//         {current.name === "categories" && renderCategories()}
//         {current.name === "subcategories" && renderSubcategories()}
//         {current.name === "skill" && renderSkill()}
//       </div>
//     </div>
//   );
// }
































// import React, { useEffect, useState } from "react";

// /* =====================================================
//    JOB FILTER SCREEN – REACT (SINGLE FILE)
// ===================================================== */

// export default function JobFilterScreen({
//   initialFilter = {},
//   onApply,
//   onClose
// }) {
//   /* ---------------- STATE ---------------- */
//   const [filter, setFilter] = useState({
//     categories: [],
//     services: [],
//     skills: [],
//     minPrice: null,
//     maxPrice: null,
//     deliveryTime: "",
//     minDays: null,
//     maxDays: null
//   });

//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [minDays, setMinDays] = useState("");
//   const [maxDays, setMaxDays] = useState("");

//   /* ---------------- DATA ---------------- */
//   const categories = [
//     "Graphics & Design",
//     "Programming & Tech",
//     "Digital Marketing",
//     "Writing & Translation",
//     "Video & Animation",
//     "Music & Audio",
//     "AI Services",
//     "Data",
//     "Business",
//     "Finance",
//     "Photography",
//     "Lifestyle",
//     "Consulting",
//     "Personal Growth & Hobbies"
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
//     "Voice Over"
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
//     "MongoDB"
//   ];

//   /* ---------------- INIT ---------------- */
//   useEffect(() => {
//     setFilter({
//       categories: [...(initialFilter.categories || [])],
//       services: [...(initialFilter.services || [])],
//       skills: [...(initialFilter.skills || [])],
//       minPrice: initialFilter.minPrice ?? null,
//       maxPrice: initialFilter.maxPrice ?? null,
//       deliveryTime: initialFilter.deliveryTime ?? "",
//       minDays: initialFilter.minDays ?? null,
//       maxDays: initialFilter.maxDays ?? null
//     });

//     setMinPrice(initialFilter.minPrice ?? "");
//     setMaxPrice(initialFilter.maxPrice ?? "");
//     setMinDays(initialFilter.minDays ?? "");
//     setMaxDays(initialFilter.maxDays ?? "");
//   }, []);

//   /* ---------------- HELPERS ---------------- */
//   const toggleItem = (key, value) => {
//     setFilter(f => {
//       const exists = f[key].includes(value);
//       return {
//         ...f,
//         [key]: exists
//           ? f[key].filter(v => v !== value)
//           : [...f[key], value]
//       };
//     });
//   };

//   const clearAll = () => {
//     setFilter({
//       categories: [],
//       services: [],
//       skills: [],
//       minPrice: null,
//       maxPrice: null,
//       deliveryTime: "",
//       minDays: null,
//       maxDays: null
//     });
//     setMinPrice("");
//     setMaxPrice("");
//     setMinDays("");
//     setMaxDays("");
//     onClose?.();
//   };

//   const applyFilters = () => {
//     const minP = parseInt(minPrice);
//     const maxP = parseInt(maxPrice);

//     if (!isNaN(minP) && !isNaN(maxP) && minP > maxP) {
//       alert("Min price cannot be greater than max price");
//       return;
//     }

//     const minD = parseInt(minDays);
//     const maxD = parseInt(maxDays);

//     if (!isNaN(minD) && !isNaN(maxD) && minD > maxD) {
//       alert("Min days cannot be greater than max days");
//       return;
//     }

//     const finalFilter = {
//       ...filter,
//       minPrice: isNaN(minP) ? null : minP,
//       maxPrice: isNaN(maxP) ? null : maxP,
//       minDays: isNaN(minD) ? null : minD,
//       maxDays: isNaN(maxD) ? null : maxD,
//       postingTime: mapDeliveryToPostingTime(filter.deliveryTime)
//     };

//     onApply?.(finalFilter);
//   };

//   /* ---------------- UI ---------------- */
//   return (
//     <div style={styles.page}>
//       {/* HEADER */}
//       <div style={styles.header}>
//         <button style={styles.back} onClick={onClose}>←</button>
//         <h2 style={styles.title}>Filters</h2>
//       </div>

//       {/* CONTENT */}
//       <div style={styles.body}>
//         {/* Categories */}
//         <Section title="Categories">
//           {categories.map(c => (
//             <Chip
//               key={c}
//               label={c}
//               active={filter.categories.includes(c)}
//               onClick={() => toggleItem("categories", c)}
//             />
//           ))}
//         </Section>

//         {/* Services */}
//         <Section title="Service">
//           {services.map(s => (
//             <Chip
//               key={s}
//               label={s}
//               active={filter.services.includes(s)}
//               onClick={() => toggleItem("services", s)}
//             />
//           ))}
//         </Section>

//         {/* Skills */}
//         <Section title="Skills & Tools">
//           {skills.map(s => (
//             <Chip
//               key={s}
//               label={s}
//               active={filter.skills.includes(s)}
//               onClick={() => toggleItem("skills", s)}
//               removable
//             />
//           ))}
//         </Section>

//         {/* Price */}
//         <Section title="Price">
//           <div style={styles.row}>
//             <input
//               style={styles.input}
//               placeholder="Min"
//               value={minPrice}
//               onChange={e => setMinPrice(e.target.value)}
//             />
//             <input
//               style={styles.input}
//               placeholder="Max"
//               value={maxPrice}
//               onChange={e => setMaxPrice(e.target.value)}
//             />
//           </div>
//         </Section>

//         {/* Delivery */}
//         <Section title="Delivery Time">
//           <Radio
//             label="Up to 24 Hours"
//             value="24h"
//             checked={filter.deliveryTime === "24h"}
//             onChange={() => setFilter(f => ({ ...f, deliveryTime: "24h" }))}
//           />
//           <Radio
//             label="Up to 7 days"
//             value="7d"
//             checked={filter.deliveryTime === "7d"}
//             onChange={() => setFilter(f => ({ ...f, deliveryTime: "7d" }))}
//           />
//           <Radio
//             label="Custom Range"
//             value="custom"
//             checked={filter.deliveryTime === "custom"}
//             onChange={() => setFilter(f => ({ ...f, deliveryTime: "custom" }))}
//           />

//           {filter.deliveryTime === "custom" && (
//             <div style={styles.row}>
//               <input
//                 style={styles.input}
//                 placeholder="Min Days"
//                 value={minDays}
//                 onChange={e => setMinDays(e.target.value)}
//               />
//               <input
//                 style={styles.input}
//                 placeholder="Max Days"
//                 value={maxDays}
//                 onChange={e => setMaxDays(e.target.value)}
//               />
//             </div>
//           )}
//         </Section>
//       </div>

//       {/* FOOTER */}
//       <div style={styles.footer}>
//         <button style={styles.clearBtn} onClick={clearAll}>
//           Clear All
//         </button>
//         <button style={styles.applyBtn} onClick={applyFilters}>
//           Apply Filters
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ================= COMPONENTS ================= */

// const Section = ({ title, children }) => (
//   <div style={{ marginBottom: 20 }}>
//     <h3 style={styles.section}>{title}</h3>
//     <div style={styles.wrap}>{children}</div>
//   </div>
// );

// const Chip = ({ label, active, onClick }) => (
//   <div
//     onClick={onClick}
//     style={{
//       ...styles.chip,
//       background: active ? "#FDFD96" : "#FFFFDC"
//     }}
//   >
//     {label}
//   </div>
// );

// const Radio = ({ label, checked, onChange }) => (
//   <div style={styles.radio} onClick={onChange}>
//     <span>{label}</span>
//     <input type="radio" checked={checked} readOnly />
//   </div>
// );

// /* ================= UTILS ================= */

// function mapDeliveryToPostingTime(delivery) {
//   if (delivery === "24h") return "Posted Today";
//   if (delivery === "7d") return "Last 7 Days";
//   return "";
// }

// /* ================= STYLES ================= */

// const styles = {
//   page: {
//     minHeight: "100vh",
//     background: "#fff",
//     fontFamily: "Rubik, sans-serif",
//     display: "flex",
//     flexDirection: "column"
//   },
//   header: {
//     display: "flex",
//     alignItems: "center",
//     padding: 16
//   },
//   back: {
//     fontSize: 20,
//     background: "none",
//     border: "none",
//     cursor: "pointer"
//   },
//   title: {
//     flex: 1,
//     textAlign: "center",
//     margin: 0
//   },
//   body: {
//     padding: 16,
//     flex: 1,
//     overflowY: "auto"
//   },
//   section: {
//     fontSize: 18,
//     marginBottom: 10
//   },
//   wrap: {
//     display: "flex",
//     flexWrap: "wrap",
//     gap: 8
//   },
//   chip: {
//     padding: "10px 14px",
//     borderRadius: 8,
//     cursor: "pointer",
//     fontSize: 14
//   },
//   row: {
//     display: "flex",
//     gap: 12
//   },
//   input: {
//     flex: 1,
//     padding: 12,
//     borderRadius: 4,
//     border: "none",
//     background: "#FFFDBD"
//   },
//   radio: {
//     display: "flex",
//     justifyContent: "space-between",
//     padding: "10px 0",
//     cursor: "pointer"
//   },
//   footer: {
//     display: "flex",
//     gap: 12,
//     padding: 16
//   },
//   clearBtn: {
//     flex: 1,
//     background: "#D9C6FF",
//     border: "none",
//     padding: 14,
//     borderRadius: 6,
//     fontSize: 16
//   },
//   applyBtn: {
//     flex: 1,
//     background: "#7C3CFF",
//     color: "#fff",
//     border: "none",
//     padding: 14,
//     borderRadius: 6,
//     fontSize: 16
//   }
// };
