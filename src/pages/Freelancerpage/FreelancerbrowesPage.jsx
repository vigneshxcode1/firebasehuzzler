

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
  appBar: {
    display: "flex",
    alignItems: "center",
    height: 64,
    padding: "0 12px",
    borderBottom: "1px solid #eee",
    background: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 20,
  },
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
  },

  container: {
    maxWidth: 1000,
    margin: "0 auto",
    padding: 16,
  },
  searchBar: {
    height: 48,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "0 12px",
    borderRadius: 12,
    border: "1px solid #D9D9D9",
    background: "#fff",
  },
  input: {
    border: "none",
    outline: "none",
    flex: 1,
    fontSize: 14,
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
  cardGrid: {
    marginTop: 20,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: 16,
  },

  categoryCard: {
    borderRadius: 18,
    overflow: "hidden",
    cursor: "pointer",
    background: "#fff",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
  },

  categoryCardTop: {
    height: 110,
    background: "linear-gradient(135deg,#6a00ff,#9c27ff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  categoryIcon: {
    fontSize: 36,
    color: "#fff",
    opacity: 0.9,
  },

  categoryCardBottom: {
    padding: 12,
    fontWeight: 600,
    textAlign: "center",
    fontSize: 14,
  },


};

/* ---------------------------
   Small Icon components (no external libs)
   --------------------------- */
const IconSearch = () => <span style={{ fontSize: 18 }}>🔍</span>;
const IconClear = () => <span style={{ fontSize: 18 }}>✕</span>;
const IconArrowRight = () => <span style={{ fontSize: 14 }}>›</span>;
const IconBack = () => <span style={{ fontSize: 16 }}>‹</span>;
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
      <div style={{ margin: "12px 0", borderRadius: 12, border: "1px solid #ddd", padding: 16, background: "#fffef2" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ flex: 1, marginRight: 12 }}>
            <div style={{ fontSize: 20, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.title}</div>
            <div style={{ marginTop: 8, color: "#555" }}>{job.description}</div>
          </div>
          <div style={{ textAlign: "right" }}>₹ {job.budget}/per day</div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, marginBottom: 8 }}>Skills Required</div>
          <div style={{ display: "flex", alignItems: "center", overflowX: "auto" }}>
            {job.skills.slice(0, 2).map((s) => (
              <SkillChip key={s} label={s} />
            ))}
            {job.skills.length > 2 && <div style={{ padding: "6px 10px", borderRadius: 12, background: "#eee" }}>+{job.skills.length - 2}</div>}
          </div>
        </div>

        <div style={{ marginTop: 12, display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: 14, marginRight: 8 }}>👁</span>
            <span style={{ fontSize: 12 }}>{job.views} Impression</span>
          </div>

          <div style={{ marginLeft: 16, display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: 14, marginRight: 8 }}>⏱</span>
            <span style={{ fontSize: 12 }}>{timeText}</span>
          </div>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(job.id, isSaved);
              }}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: 22,
              }}
            >
              {isSaved ? "🔖" : "📑"}
            </button>


            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateToDetail(job, is24h);
              }}
              style={{ marginLeft: 8, padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", background: "#fff" }}
            >
              View
            </button>
          </div>
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
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
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
          background: isSelected ? "#000" : "transparent",
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
          <div style={styles.cardGrid}>
            {filteredCategories.map((category) => (
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
                  <div style={styles.categoryIcon}>✨</div>
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
          <button style={styles.backBtn} onClick={pop} aria-label="back">
            <IconBack />
          </button>
          <div style={styles.title}>Explore Job</div>
          <div style={{ width: 36 }} />
        </div>

        <div style={styles.container}>
          {/* SEARCH */}
          <div style={styles.searchBar}>
            <IconSearch />
            <input
              aria-label="Search subcategories"
              placeholder="Search"
              style={styles.input}
              value={subQuery}
              onChange={(e) => {
                const value = e.target.value;
                setSubQuery(value);

                // persist search in stack
                setStack((s) => {
                  const copy = [...s];
                  copy[copy.length - 1] = {
                    ...copy[copy.length - 1],
                    params: {
                      ...copy[copy.length - 1].params,
                      initialQuery: value,
                    },
                  };
                  return copy;
                });
              }}
            />

            {subQuery && (
              <button
                onClick={() => {
                  setSubQuery("");
                  setStack((s) => {
                    const copy = [...s];
                    copy[copy.length - 1] = {
                      ...copy[copy.length - 1],
                      params: {
                        ...copy[copy.length - 1].params,
                        initialQuery: "",
                      },
                    };
                    return copy;
                  });
                }}
                style={styles.clearBtn}
                aria-label="clear"
              >
                <IconClear />
              </button>
            )}
          </div>

          {/* BREADCRUMB */}
          <div style={styles.breadcrumbRow}>
            <div style={styles.smallMuted}>Categories /</div>
            <div style={styles.chip}>{category}</div>
          </div>

          {/* HORIZONTAL SUBCATEGORIES */}
          <div
            style={{
              display: "flex",
              gap: 12,
              overflowX: "auto",
              padding: "10px 4px",
              whiteSpace: "nowrap",
            }}
          >
            {filteredSubCategories.length === 0 ? (
              <div style={{ width: "100%", padding: 40, textAlign: "center" }}>
                <div style={{ fontSize: 56 }}>🔎</div>
                <div style={{ marginTop: 12, fontWeight: 600 }}>
                  No subcategories found
                </div>
                <div style={{ marginTop: 8, color: "#777" }}>
                  Try searching with different keywords
                </div>
              </div>
            ) : (
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
                      padding: "10px 18px",
                      borderRadius: 20,
                      fontWeight: 600,
                      cursor: "pointer",
                      userSelect: "none",
                      whiteSpace: "nowrap",
                      transition: "all 0.2s ease",
                      background: isActive ? "#000" : "#f5f7fb",
                      color: isActive ? "#fff" : "#000",
                    }}
                  >
                    {sub}
                  </div>
                );
              })
            )}
          </div>

          {/* 🔥 JOBS SECTION – SAME PAGE */}
          {selectedSkill && (
            <div style={{ marginTop: 24 }}>
              <SkillUsersScreenInline
                skill={selectedSkill}
                onClick={() => {
                  setSubQuery("");
                  setSelectedSkill(null); // 🔥 IMPORTANT
                  setStack((s) => {
                    const copy = [...s];
                    copy[copy.length - 1] = {
                      ...copy[copy.length - 1],
                      params: {
                        ...copy[copy.length - 1].params,
                        initialQuery: "",
                      },
                    };
                    return copy;
                  });
                }}

              />
            </div>
          )}
        </div>
      </div>
    );
  }


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


