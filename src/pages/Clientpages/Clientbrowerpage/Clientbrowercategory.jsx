// Client.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useLocation } from "react-router-dom";


/* ======================================================
   FIREBASE
====================================================== */
const db = getFirestore();
const auth = getAuth();

/* ======================================================
   CATEGORY DATA
====================================================== */

const jobCategories1 = {
  'Graphics & Design': [
    'Logo Design',
    'Brand Style Guides',
    'Business Cards & Stationery',
    'Illustration',
    'Pattern Design',
    'Website Design',
    'App Design',
    'UX Design',
    'Game Art',
    'NFTs & Collectibles',
    'Industrial & Product Design',
    'Architecture & Interior Design',
    'Landscape Design',
    'Fashion Design',
    'Jewelry Design',
    'Presentation Design',
    'Infographic Design',
    'Vector Tracing',
    'Car Wraps',
    'Image Editing',
    'Photoshop Editing',
    'T-Shirts & Merchandise',
    'Packaging Design',
    'Book Design',
    'Album Cover Design',
    'Podcast Cover Art',
    'Menu Design',
    'Invitation Design',
    'Brochure Design',
    'Poster Design',
    'Signage Design',
    'Flyer Design',
    'Social Media Design',
    'Print Design',
  ],

  'Programming & Tech': [
    'Website Development',
    'Website Builders & CMS',
    'Web Programming',
    'E-Commerce Development',
    'Game Development',
    'Mobile Apps (iOS & Android)',
    'Desktop Applications',
    'Chatbots',
    'QA & Review',
    'User Testing',
    'Support & IT',
    'Data Analysis & Reports',
    'Convert Files',
    'Databases',
    'Cybersecurity ',
    ' Data Protection',
    'Cloud Computing',
    'DevOps',
    'AI Development',
    'Machine Learning',
    'Blockchain & NFTs',
    'Scripts & Automation',
    'Software Customization',
  ],

  'Digital Marketing': [
    'Social Media Marketing',
    'SEO',
    'Content Marketing',
    'Video Marketing',
    'Email Marketing',
    'SEM (Search Engine Marketing)',
    'Influencer Marketing',
    'Local SEO',
    'Affiliate Marketing',
    'Mobile Marketing & Advertising',
    'Display Advertising',
    'E-Commerce Marketing',
    'Text Message Marketing',
    'Crowdfunding',
    'Marketing Strategy',
    'Web Analytics',
    'Domain Research',
    'Music Promotion',
    'Book & eBook Marketing',
    'Podcast Marketing',
    'Community Management',
    'Marketing Consulting',
  ],

  'Writing & Translation': [
    'Articles & Blog Posts',
    'Proofreading & Editing',
    'Translation',
    'Website Content',
    'Technical Writing',
    'Copywriting',
    'Brand Voice & Tone',
    'Resume Writing',
    'Cover Letters',
    'LinkedIn Profiles',
    'Press Releases',
    'Product Descriptions',
    'Case Studies',
    'White Papers',
    'Scriptwriting',
    'Speechwriting',
    'Creative Writing',
    'Book Editing',
    'Beta Reading',
    'Grant Writing',
    'UX Writing',
    'Email Copy',
    'Business Names & Slogans',
    'Transcription',
    'Legal Writing',
  ],

  'Video & Animation': [
    'Whiteboard & Animated Explainers',
    'Video Editing',
    'Short Video Ads',
    'Logo Animation',
    'Character Animation',
    '2D/3D Animation',
    'Intros & Outros',
    'Lyric & Music Videos',
    'Visual Effects',
    'Spokesperson Videos',
    'App & Website Previews',
    'Product Photography & Demos',
    'Subtitles & Captions',
    'Live Action Explainers',
    'Unboxing Videos',
    'Slideshow Videos',
    'Animation for Kids',
    'Trailers & Teasers',
  ],

  'Music & Audio': [
    'Voice Over',
    'Mixing & Mastering',
    'Producers & Composers',
    'Singers & Vocalists',
    'Session Musicians',
    'Songwriters',
    'Audiobook Production',
    'Sound Design',
    'Audio Editing',
    'Jingles & Intros',
    'Podcast Editing',
    'Music Transcription',
    'Dialogue Editing',
    'DJ Drops & Tags',
    'Music Promotion',
  ],

  'AI Services': [
    'AI Artists',
    'AI Applications',
    'AI Video Generators',
    'AI Music Generation',
    'AI Chatbot Development',
    'AI Website Builders',
    'Custom GPT & LLMs',
    'AI Training Data Preparation',
    'Text-to-Speech / Voice Cloning',
    'Prompt Engineering',
  ],

  'Data': [
    'Data Entry',
    'Data Mining & Scraping',
    'Data Analytics & Reports',
    'Database Design',
    'Data Visualization',
    'Dashboards',
    'Excel / Google Sheets',
    'Statistical Analysis',
    'Data Engineering',
    'Machine Learning Models',
    'Data Cleaning',
  ],

  'Business': [
    'Business Plans',
    'Market Research',
    'Branding Services',
    'Legal Consulting',
    'Financial Consulting',
    'Career Counseling',
    'Project Management',
    'Supply Chain Management',
    'HR Consulting',
    'E-Commerce Management',
    'Business Consulting',
    'Presentations',
    'Virtual Assistant',
  ],

  'Finance': [
    'Accounting & Bookkeeping',
    'Financial Forecasting',
    'Financial Modeling',
    'Tax Consulting',
    'Crypto & NFT Consulting',
    'Business Valuation',
    'Pitch Decks',
  ],

  'Photography': [
    'Product Photography',
    'Real Estate Photography',
    'Portraits',
    'Image Retouching',
    'Food Photography',
    'Drone Photography',
    'Lifestyle Photography',
    'AI Image Enhancement',
  ],

  'Lifestyle': [
    'Gaming',
    'Astrology & Psychics',
    'Online Tutoring',
    'Arts & Crafts',
    'Fitness Lessons',
    'Nutrition',
    'Relationship Advice',
    'Personal Styling',
    'Cooking Lessons',
    'Life Coaching',
    'Travel Advice',
    'Wellness & Meditation',
    'Language Lessons',
  ],

  'Consulting': [
    'Management Consulting',
    'Business Strategy',
    'HR & Leadership',
    'Financial Advisory',
    'Legal Consulting',
    'Technology Consulting',
    'Cybersecurity Consulting',
    'Marketing Strategy',
  ],

  'Personal Growth & Hobbies': [
    'Life Coaching',
    'Productivity Coaching',
    'Study Skills',
    'Language Learning',
    'Public Speaking',
    'Career Mentoring',
    'Mindfulness & Meditation',
    'Confidence Coaching',
  ],
};

/* ======================================================
   HELPERS
====================================================== */
const timeAgo = (date) => {
  const diff = Date.now() - date.getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
};

const skillColor = (text) => {
  const colors = ["#E3F2FD", "#FFF9C4", "#E1F5FE", "#F3E5F5"];
  return colors[text.length % colors.length];
};

/* ======================================================
   MAIN CLIENT COMPONENT
====================================================== */
export default function Client() {
  const location = useLocation();
  const [screen, setScreen] = useState("CATEGORIES"); // CATEGORIES | SUB
  const [category, setCategory] = useState(null);
  const [skill, setSkill] = useState(null);

  const [catSearch, setCatSearch] = useState("");
  const [subSearch, setSubSearch] = useState("");

  /* ---------- DEFAULT AUTO SELECT ---------- */
  useEffect(() => {
    if (screen === "SUB" && category) {
      const list = jobCategories1[category] || [];
      if (list.length && !skill) setSkill(list[0]);
    }
  }, [screen, category]);

  /* ---------- FILTERS ---------- */
  const categories = useMemo(() => {
    if (!catSearch) return Object.keys(jobCategories1);
    return Object.keys(jobCategories1).filter((c) =>
      c.toLowerCase().includes(catSearch.toLowerCase())
    );
  }, [catSearch]);

  const subCategories = useMemo(() => {
    if (!category) return [];
    const list = jobCategories1[category];
    if (!subSearch) return list;
    return list.filter((s) =>
      s.toLowerCase().includes(subSearch.toLowerCase())
    );
  }, [subSearch, category]);

  useEffect(() => {
  if (location.state?.category) {
    setCategory(location.state.category);
    setScreen("SUB");
  }
}, [location.state]);

  /* ======================================================
     UI
  ====================================================== */
  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.appBar}>
        {screen === "SUB" && (
          <button style={styles.backBtn} onClick={() => setScreen("CATEGORIES")}>
            ←
          </button>
        )}
        <h3>{screen === "CATEGORIES" ? "Categories" : category}</h3>
      </div>

      {/* SEARCH */}
      <div style={styles.search}>
        <input
          placeholder="Search"
          value={screen === "CATEGORIES" ? catSearch : subSearch}
          onChange={(e) =>
            screen === "CATEGORIES"
              ? setCatSearch(e.target.value)
              : setSubSearch(e.target.value)
          }
        />
      </div>

      {/* CONTENT */}
      {screen === "CATEGORIES" && (
        <div style={styles.list}>
          {categories.map((c) => (
            <Row
              key={c}
              text={c}
              onClick={() => {
                setCategory(c);
                setSkill(null);
                setScreen("SUB");
              }}
            />
          ))}
        </div>
      )}

      {screen === "SUB" && (
        <>
          {/* SUB SKILLS */}
          <div style={styles.skillsRow}>
            {subCategories.map((s) => (
              <div
                key={s}
                onClick={() => setSkill(s)}
                style={{
                  ...styles.skillChip,
                  background: skill === s ? "#000" : "#eee",
                  color: skill === s ? "#fff" : "#000",
                }}
              >
                {s}
              </div>
            ))}
          </div>

          {/* JOBS */}
          {skill && <JobsScreen skill={skill} />}
        </>
      )}
    </div>
  );
}

/* ======================================================
   JOBS SCREEN
====================================================== */
function JobsScreen({ skill }) {
  const [tab, setTab] = useState("WORKS");
  const [jobs, setJobs] = useState([]);
  const [jobs24, setJobs24] = useState([]);
  const [saved, setSaved] = useState([]);

  const uid = auth.currentUser?.uid;

  useEffect(() => {
    const u1 = onSnapshot(collection(db, "services"), (snap) =>
      setJobs(processJobs(snap.docs))
    );
    const u2 = onSnapshot(collection(db, "service_24h"), (snap) =>
      setJobs24(processJobs(snap.docs))
    );

    if (!uid) return;
    const u3 = onSnapshot(doc(db, "users", uid), (snap) =>
      setSaved(snap.data()?.favoriteJobs || [])
    );

    return () => {
      u1();
      u2();
      u3 && u3();
    };
  }, [uid]);

  const filter = (list) =>
    list.filter((j) =>
      [...j.skills, ...j.tools].some((x) =>
        x.toLowerCase().includes(skill.toLowerCase())
      )
    );

  const renderList =
    tab === "WORKS"
      ? filter(jobs)
      : tab === "24H"
      ? filter(jobs24)
      : [...jobs, ...jobs24].filter((j) => saved.includes(j.id));

  return (
    <>
      {/* TABS */}
      <div style={styles.tabs}>
        {[
          ["WORKS", "Works Jobs"],
          ["24H", "24 Hour Jobs"],
          ["SAVED", "Saved Jobs"],
        ].map(([k, t]) => (
          <div
            key={k}
            onClick={() => setTab(k)}
            style={{
              ...styles.tab,
              borderBottom: tab === k ? "3px solid #000" : "none",
            }}
          >
            {t}
          </div>
        ))}
      </div>

      {/* LIST */}
      <div>
        {renderList.length === 0 ? (
          <Empty />
        ) : (
          renderList.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              saved={saved.includes(job.id)}
            />
          ))
        )}
      </div>
    </>
  );
}

/* ======================================================
   JOB CARD
====================================================== */
function JobCard({ job, saved }) {
  const uid = auth.currentUser?.uid;

  const toggleSave = async () => {
    if (!uid) return;
    await updateDoc(doc(db, "users", uid), {
      favoriteJobs: saved
        ? arrayRemove(job.id)
        : arrayUnion(job.id),
    });
  };

  return (
    <div style={styles.card}>
      <h4>{job.title}</h4>
      <p>{job.description}</p>

      <div style={styles.skills}>
        {job.skills.slice(0, 2).map((s) => (
          <span
            key={s}
            style={{ ...styles.skill, background: skillColor(s) }}
          >
            {s}
          </span>
        ))}
      </div>

      <div style={styles.footer}>
        <span>👁 {job.views}</span>
        <span>⏱ {timeAgo(job.created_at)}</span>
        <span onClick={toggleSave} style={styles.bookmark}>
          {saved ? "🔖" : "📑"}
        </span>
      </div>
    </div>
  );
}

/* ======================================================
   DATA NORMALIZER
====================================================== */
function processJobs(docs) {
  return docs
    .map((d) => {
      const data = d.data();
      if (!data.title || !data.description) return null;
      return {
        id: d.id,
        title: data.title,
        description: data.description,
        skills: data.skills || [],
        tools: data.tools || [],
        views: data.views || 0,
        created_at: data.created_at?.toDate?.() || new Date(),
      };
    })
    .filter(Boolean);
}

/* ======================================================
   SMALL UI
====================================================== */
const Row = ({ text, onClick }) => (
  <div style={styles.row} onClick={onClick}>
    <span>{text}</span>
    <span>›</span>
  </div>
);

const Empty = () => (
  <div style={styles.empty}>
    <div style={{ fontSize: 48 }}>🔍</div>
    <p>No jobs found</p>
  </div>
);

/* ======================================================
   STYLES
====================================================== */
const styles = {
  page: { fontFamily: "system-ui", background: "#fff", minHeight: "100vh" },
  appBar: {
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottom: "1px solid #eee",
    position: "relative",
  },
  backBtn: {
    position: "absolute",
    left: 12,
    background: "none",
    border: "none",
    fontSize: 18,
  },
  search: { padding: 12 },
  list: {},
  row: {
    padding: 14,
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #eee",
    cursor: "pointer",
  },
  skillsRow: {
    display: "flex",
    gap: 10,
    overflowX: "auto",
    padding: 10,
  },
  skillChip: {
    padding: "8px 16px",
    borderRadius: 20,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  tabs: {
    display: "flex",
    justifyContent: "space-around",
    borderBottom: "1px solid #eee",
  },
  tab: { padding: 12, cursor: "pointer" },
  card: {
    margin: 12,
    padding: 16,
    border: "1px solid #ddd",
    borderRadius: 14,
  },
  skills: { display: "flex", gap: 6 },
  skill: { padding: "4px 10px", borderRadius: 12, fontSize: 12 },
  footer: { display: "flex", gap: 12, marginTop: 10 },
  bookmark: { marginLeft: "auto", cursor: "pointer", fontSize: 20 },
  empty: {
    padding: 60,
    textAlign: "center",
    color: "#777",
  },
};
