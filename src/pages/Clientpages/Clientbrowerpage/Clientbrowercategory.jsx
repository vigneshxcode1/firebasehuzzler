// // Client.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   getFirestore,
//   collection,
//   doc,
//   onSnapshot,
//   updateDoc,
//   arrayUnion,
//   arrayRemove,
// } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { useLocation } from "react-router-dom";


// /* ======================================================
//    FIREBASE
// ====================================================== */
// const db = getFirestore();
// const auth = getAuth();

// /* ======================================================
//    CATEGORY DATA
// ====================================================== */

// const jobCategories1 = {
//   'Graphics & Design': [
//     'Logo Design',
//     'Brand Style Guides',
//     'Business Cards & Stationery',
//     'Illustration',
//     'Pattern Design',
//     'Website Design',
//     'App Design',
//     'UX Design',
//     'Game Art',
//     'NFTs & Collectibles',
//     'Industrial & Product Design',
//     'Architecture & Interior Design',
//     'Landscape Design',
//     'Fashion Design',
//     'Jewelry Design',
//     'Presentation Design',
//     'Infographic Design',
//     'Vector Tracing',
//     'Car Wraps',
//     'Image Editing',
//     'Photoshop Editing',
//     'T-Shirts & Merchandise',
//     'Packaging Design',
//     'Book Design',
//     'Album Cover Design',
//     'Podcast Cover Art',
//     'Menu Design',
//     'Invitation Design',
//     'Brochure Design',
//     'Poster Design',
//     'Signage Design',
//     'Flyer Design',
//     'Social Media Design',
//     'Print Design',
//   ],

//   'Programming & Tech': [
//     'Website Development',
//     'Website Builders & CMS',
//     'Web Programming',
//     'E-Commerce Development',
//     'Game Development',
//     'Mobile Apps (iOS & Android)',
//     'Desktop Applications',
//     'Chatbots',
//     'QA & Review',
//     'User Testing',
//     'Support & IT',
//     'Data Analysis & Reports',
//     'Convert Files',
//     'Databases',
//     'Cybersecurity ',
//     ' Data Protection',
//     'Cloud Computing',
//     'DevOps',
//     'AI Development',
//     'Machine Learning',
//     'Blockchain & NFTs',
//     'Scripts & Automation',
//     'Software Customization',
//   ],

//   'Digital Marketing': [
//     'Social Media Marketing',
//     'SEO',
//     'Content Marketing',
//     'Video Marketing',
//     'Email Marketing',
//     'SEM (Search Engine Marketing)',
//     'Influencer Marketing',
//     'Local SEO',
//     'Affiliate Marketing',
//     'Mobile Marketing & Advertising',
//     'Display Advertising',
//     'E-Commerce Marketing',
//     'Text Message Marketing',
//     'Crowdfunding',
//     'Marketing Strategy',
//     'Web Analytics',
//     'Domain Research',
//     'Music Promotion',
//     'Book & eBook Marketing',
//     'Podcast Marketing',
//     'Community Management',
//     'Marketing Consulting',
//   ],

//   'Writing & Translation': [
//     'Articles & Blog Posts',
//     'Proofreading & Editing',
//     'Translation',
//     'Website Content',
//     'Technical Writing',
//     'Copywriting',
//     'Brand Voice & Tone',
//     'Resume Writing',
//     'Cover Letters',
//     'LinkedIn Profiles',
//     'Press Releases',
//     'Product Descriptions',
//     'Case Studies',
//     'White Papers',
//     'Scriptwriting',
//     'Speechwriting',
//     'Creative Writing',
//     'Book Editing',
//     'Beta Reading',
//     'Grant Writing',
//     'UX Writing',
//     'Email Copy',
//     'Business Names & Slogans',
//     'Transcription',
//     'Legal Writing',
//   ],

//   'Video & Animation': [
//     'Whiteboard & Animated Explainers',
//     'Video Editing',
//     'Short Video Ads',
//     'Logo Animation',
//     'Character Animation',
//     '2D/3D Animation',
//     'Intros & Outros',
//     'Lyric & Music Videos',
//     'Visual Effects',
//     'Spokesperson Videos',
//     'App & Website Previews',
//     'Product Photography & Demos',
//     'Subtitles & Captions',
//     'Live Action Explainers',
//     'Unboxing Videos',
//     'Slideshow Videos',
//     'Animation for Kids',
//     'Trailers & Teasers',
//   ],

//   'Music & Audio': [
//     'Voice Over',
//     'Mixing & Mastering',
//     'Producers & Composers',
//     'Singers & Vocalists',
//     'Session Musicians',
//     'Songwriters',
//     'Audiobook Production',
//     'Sound Design',
//     'Audio Editing',
//     'Jingles & Intros',
//     'Podcast Editing',
//     'Music Transcription',
//     'Dialogue Editing',
//     'DJ Drops & Tags',
//     'Music Promotion',
//   ],

//   'AI Services': [
//     'AI Artists',
//     'AI Applications',
//     'AI Video Generators',
//     'AI Music Generation',
//     'AI Chatbot Development',
//     'AI Website Builders',
//     'Custom GPT & LLMs',
//     'AI Training Data Preparation',
//     'Text-to-Speech / Voice Cloning',
//     'Prompt Engineering',
//   ],

//   'Data': [
//     'Data Entry',
//     'Data Mining & Scraping',
//     'Data Analytics & Reports',
//     'Database Design',
//     'Data Visualization',
//     'Dashboards',
//     'Excel / Google Sheets',
//     'Statistical Analysis',
//     'Data Engineering',
//     'Machine Learning Models',
//     'Data Cleaning',
//   ],

//   'Business': [
//     'Business Plans',
//     'Market Research',
//     'Branding Services',
//     'Legal Consulting',
//     'Financial Consulting',
//     'Career Counseling',
//     'Project Management',
//     'Supply Chain Management',
//     'HR Consulting',
//     'E-Commerce Management',
//     'Business Consulting',
//     'Presentations',
//     'Virtual Assistant',
//   ],

//   'Finance': [
//     'Accounting & Bookkeeping',
//     'Financial Forecasting',
//     'Financial Modeling',
//     'Tax Consulting',
//     'Crypto & NFT Consulting',
//     'Business Valuation',
//     'Pitch Decks',
//   ],

//   'Photography': [
//     'Product Photography',
//     'Real Estate Photography',
//     'Portraits',
//     'Image Retouching',
//     'Food Photography',
//     'Drone Photography',
//     'Lifestyle Photography',
//     'AI Image Enhancement',
//   ],

//   'Lifestyle': [
//     'Gaming',
//     'Astrology & Psychics',
//     'Online Tutoring',
//     'Arts & Crafts',
//     'Fitness Lessons',
//     'Nutrition',
//     'Relationship Advice',
//     'Personal Styling',
//     'Cooking Lessons',
//     'Life Coaching',
//     'Travel Advice',
//     'Wellness & Meditation',
//     'Language Lessons',
//   ],

//   'Consulting': [
//     'Management Consulting',
//     'Business Strategy',
//     'HR & Leadership',
//     'Financial Advisory',
//     'Legal Consulting',
//     'Technology Consulting',
//     'Cybersecurity Consulting',
//     'Marketing Strategy',
//   ],

//   'Personal Growth & Hobbies': [
//     'Life Coaching',
//     'Productivity Coaching',
//     'Study Skills',
//     'Language Learning',
//     'Public Speaking',
//     'Career Mentoring',
//     'Mindfulness & Meditation',
//     'Confidence Coaching',
//   ],
// };

// /* ======================================================
//    HELPERS
// ====================================================== */
// const timeAgo = (date) => {
//   const diff = Date.now() - date.getTime();
//   const sec = Math.floor(diff / 1000);
//   if (sec < 60) return `${sec}s ago`;
//   const min = Math.floor(sec / 60);
//   if (min < 60) return `${min} min ago`;
//   const hr = Math.floor(min / 60);
//   if (hr < 24) return `${hr}h ago`;
//   const day = Math.floor(hr / 24);
//   return `${day}d ago`;
// };

// const skillColor = (text) => {
//   const colors = ["#E3F2FD", "#FFF9C4", "#E1F5FE", "#F3E5F5"];
//   return colors[text.length % colors.length];
// };

// /* ======================================================
//    MAIN CLIENT COMPONENT
// ====================================================== */
// export default function Client() {
//   const location = useLocation();
//   const [screen, setScreen] = useState("CATEGORIES"); // CATEGORIES | SUB
//   const [category, setCategory] = useState(null);
//   const [skill, setSkill] = useState(null);

//   const [catSearch, setCatSearch] = useState("");
//   const [subSearch, setSubSearch] = useState("");

//   /* ---------- DEFAULT AUTO SELECT ---------- */
//   useEffect(() => {
//     if (screen === "SUB" && category) {
//       const list = jobCategories1[category] || [];
//       if (list.length && !skill) setSkill(list[0]);
//     }
//   }, [screen, category]);

//   /* ---------- FILTERS ---------- */
//   const categories = useMemo(() => {
//     if (!catSearch) return Object.keys(jobCategories1);
//     return Object.keys(jobCategories1).filter((c) =>
//       c.toLowerCase().includes(catSearch.toLowerCase())
//     );
//   }, [catSearch]);

//   const subCategories = useMemo(() => {
//     if (!category) return [];
//     const list = jobCategories1[category];
//     if (!subSearch) return list;
//     return list.filter((s) =>
//       s.toLowerCase().includes(subSearch.toLowerCase())
//     );
//   }, [subSearch, category]);

//   useEffect(() => {
//   if (location.state?.category) {
//     setCategory(location.state.category);
//     setScreen("SUB");
//   }
// }, [location.state]);

//   /* ======================================================
//      UI
//   ====================================================== */
//   return (
//     <div style={styles.page}>
//       {/* HEADER */}
//       <div style={styles.appBar}>
//         {screen === "SUB" && (
//           <button style={styles.backBtn} onClick={() => setScreen("CATEGORIES")}>
//             ←
//           </button>
//         )}
//         <h3>{screen === "CATEGORIES" ? "Categories" : category}</h3>
//       </div>

//       {/* SEARCH */}
//       <div style={styles.search}>
//         <input
//           placeholder="Search"
//           value={screen === "CATEGORIES" ? catSearch : subSearch}
//           onChange={(e) =>
//             screen === "CATEGORIES"
//               ? setCatSearch(e.target.value)
//               : setSubSearch(e.target.value)
//           }
//         />
//       </div>

//       {/* CONTENT */}
//       {screen === "CATEGORIES" && (
//         <div style={styles.list}>
//           {categories.map((c) => (
//             <Row
//               key={c}
//               text={c}
//               onClick={() => {
//                 setCategory(c);
//                 setSkill(null);
//                 setScreen("SUB");
//               }}
//             />
//           ))}
//         </div>
//       )}

//       {screen === "SUB" && (
//         <>
//           {/* SUB SKILLS */}
//           <div style={styles.skillsRow}>
//             {subCategories.map((s) => (
//               <div
//                 key={s}
//                 onClick={() => setSkill(s)}
//                 style={{
//                   ...styles.skillChip,
//                   background: skill === s ? "#000" : "#eee",
//                   color: skill === s ? "#fff" : "#000",
//                 }}
//               >
//                 {s}
//               </div>
//             ))}
//           </div>

//           {/* JOBS */}
//           {skill && <JobsScreen skill={skill} />}
//         </>
//       )}
//     </div>
//   );
// }

// /* ======================================================
//    JOBS SCREEN
// ====================================================== */
// function JobsScreen({ skill }) {
//   const [tab, setTab] = useState("WORKS");
//   const [jobs, setJobs] = useState([]);
//   const [jobs24, setJobs24] = useState([]);
//   const [saved, setSaved] = useState([]);

//   const uid = auth.currentUser?.uid;

//   useEffect(() => {
//     const u1 = onSnapshot(collection(db, "services"), (snap) =>
//       setJobs(processJobs(snap.docs))
//     );
//     const u2 = onSnapshot(collection(db, "service_24h"), (snap) =>
//       setJobs24(processJobs(snap.docs))
//     );

//     if (!uid) return;
//     const u3 = onSnapshot(doc(db, "users", uid), (snap) =>
//       setSaved(snap.data()?.favoriteJobs || [])
//     );

//     return () => {
//       u1();
//       u2();
//       u3 && u3();
//     };
//   }, [uid]);

//   const filter = (list) =>
//     list.filter((j) =>
//       [...j.skills, ...j.tools].some((x) =>
//         x.toLowerCase().includes(skill.toLowerCase())
//       )
//     );

//   const renderList =
//     tab === "WORKS"
//       ? filter(jobs)
//       : tab === "24H"
//       ? filter(jobs24)
//       : [...jobs, ...jobs24].filter((j) => saved.includes(j.id));

//   return (
//     <>
//       {/* TABS */}
//       <div style={styles.tabs}>
//         {[
//           ["WORKS", "Works Jobs"],
//           ["24H", "24 Hour Jobs"],
//           ["SAVED", "Saved Jobs"],
//         ].map(([k, t]) => (
//           <div
//             key={k}
//             onClick={() => setTab(k)}
//             style={{
//               ...styles.tab,
//               borderBottom: tab === k ? "3px solid #000" : "none",
//             }}
//           >
//             {t}
//           </div>
//         ))}
//       </div>

//       {/* LIST */}
//       <div>
//         {renderList.length === 0 ? (
//           <Empty />
//         ) : (
//           renderList.map((job) => (
//             <JobCard
//               key={job.id}
//               job={job}
//               saved={saved.includes(job.id)}
//             />
//           ))
//         )}
//       </div>
//     </>
//   );
// }

// /* ======================================================
//    JOB CARD
// ====================================================== */
// function JobCard({ job, saved }) {
//   const uid = auth.currentUser?.uid;

//   const toggleSave = async () => {
//     if (!uid) return;
//     await updateDoc(doc(db, "users", uid), {
//       favoriteJobs: saved
//         ? arrayRemove(job.id)
//         : arrayUnion(job.id),
//     });
//   };

//   return (
//     <div style={styles.card}>
//       <h4>{job.title}</h4>
//       <p>{job.description}</p>

//       <div style={styles.skills}>
//         {job.skills.slice(0, 2).map((s) => (
//           <span
//             key={s}
//             style={{ ...styles.skill, background: skillColor(s) }}
//           >
//             {s}
//           </span>
//         ))}
//       </div>

//       <div style={styles.footer}>
//         <span>👁 {job.views}</span>
//         <span>⏱ {timeAgo(job.created_at)}</span>
//         <span onClick={toggleSave} style={styles.bookmark}>
//           {saved ? "🔖" : "📑"}
//         </span>
//       </div>
//     </div>
//   );
// }

// /* ======================================================
//    DATA NORMALIZER
// ====================================================== */
// function processJobs(docs) {
//   return docs
//     .map((d) => {
//       const data = d.data();
//       if (!data.title || !data.description) return null;
//       return {
//         id: d.id,
//         title: data.title,
//         description: data.description,
//         skills: data.skills || [],
//         tools: data.tools || [],
//         views: data.views || 0,
//         created_at: data.created_at?.toDate?.() || new Date(),
//       };
//     })
//     .filter(Boolean);
// }

// /* ======================================================
//    SMALL UI
// ====================================================== */
// const Row = ({ text, onClick }) => (
//   <div style={styles.row} onClick={onClick}>
//     <span>{text}</span>
//     <span>›</span>
//   </div>
// );

// const Empty = () => (
//   <div style={styles.empty}>
//     <div style={{ fontSize: 48 }}>🔍</div>
//     <p>No jobs found</p>
//   </div>
// );

// /* ======================================================
//    STYLES
// ====================================================== */
// const styles = {
//   page: { fontFamily: "system-ui", background: "#fff", minHeight: "100vh" },
//   appBar: {
//     height: 56,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     borderBottom: "1px solid #eee",
//     position: "relative",
//   },
//   backBtn: {
//     position: "absolute",
//     left: 12,
//     background: "none",
//     border: "none",
//     fontSize: 18,
//   },
//   search: { padding: 12 },
//   list: {},
//   row: {
//     padding: 14,
//     display: "flex",
//     justifyContent: "space-between",
//     borderBottom: "1px solid #eee",
//     cursor: "pointer",
//   },
//   skillsRow: {
//     display: "flex",
//     gap: 10,
//     overflowX: "auto",
//     padding: 10,
//   },
//   skillChip: {
//     padding: "8px 16px",
//     borderRadius: 20,
//     cursor: "pointer",
//     whiteSpace: "nowrap",
//   },
//   tabs: {
//     display: "flex",
//     justifyContent: "space-around",
//     borderBottom: "1px solid #eee",
//   },
//   tab: { padding: 12, cursor: "pointer" },
//   card: {
//     margin: 12,
//     padding: 16,
//     border: "1px solid #ddd",
//     borderRadius: 14,
//   },
//   skills: { display: "flex", gap: 6 },
//   skill: { padding: "4px 10px", borderRadius: 12, fontSize: 12 },
//   footer: { display: "flex", gap: 12, marginTop: 10 },
//   bookmark: { marginLeft: "auto", cursor: "pointer", fontSize: 20 },
//   empty: {
//     padding: 60,
//     textAlign: "center",
//     color: "#777",
//   },
// };




// // Client.jsx
// import React, { useEffect, useMemo, useState } from "react";

// import {
//   getFirestore,
//   collection,
//   doc,
//   onSnapshot,
//   updateDoc,
//   arrayUnion,
//   arrayRemove,
// } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { useLocation, useNavigate } from "react-router-dom";
// import { FiEye } from "react-icons/fi";
// import { Bookmark, Clock, SaveIcon, Search, TimerIcon } from "lucide-react";
// import "./clientbrower.css"
// import backarrow from "../../../assets/backarrow.png";
// import { MdSavedSearch } from "react-icons/md";
// import { BsBookmarkFill } from "react-icons/bs";
// import Searchjob from "../../../assets/Searchjob.png"
// /* ======================================================
//    FIREBASE
// ====================================================== */
// const db = getFirestore();
// const auth = getAuth();

// /* ======================================================
//    CATEGORY DATA
// ====================================================== */

// const jobCategories1 = {
//   'Graphics & Design': [
//     'Logo Design',
//     'Brand Style Guides',
//     'Business Cards & Stationery',
//     'Illustration',
//     'Pattern Design',
//     'Website Design',
//     'App Design',
//     'UX Design',
//     'Game Art',
//     'NFTs & Collectibles',
//     'Industrial & Product Design',
//     'Architecture & Interior Design',
//     'Landscape Design',
//     'Fashion Design',
//     'Jewelry Design',
//     'Presentation Design',
//     'Infographic Design',
//     'Vector Tracing',
//     'Car Wraps',
//     'Image Editing',
//     'Photoshop Editing',
//     'T-Shirts & Merchandise',
//     'Packaging Design',
//     'Book Design',
//     'Album Cover Design',
//     'Podcast Cover Art',
//     'Menu Design',
//     'Invitation Design',
//     'Brochure Design',
//     'Poster Design',
//     'Signage Design',
//     'Flyer Design',
//     'Social Media Design',
//     'Print Design',
//   ],

//   'Programming & Tech': [
//     'Website Development',
//     'Website Builders & CMS',
//     'Web Programming',
//     'E-Commerce Development',
//     'Game Development',
//     'Mobile Apps (iOS & Android)',
//     'Desktop Applications',
//     'Chatbots',
//     'QA & Review',
//     'User Testing',
//     'Support & IT',
//     'Data Analysis & Reports',
//     'Convert Files',
//     'Databases',
//     'Cybersecurity ',
//     ' Data Protection',
//     'Cloud Computing',
//     'DevOps',
//     'AI Development',
//     'Machine Learning',
//     'Blockchain & NFTs',
//     'Scripts & Automation',
//     'Software Customization',
//   ],

//   'Digital Marketing': [
//     'Social Media Marketing',
//     'SEO',
//     'Content Marketing',
//     'Video Marketing',
//     'Email Marketing',
//     'SEM (Search Engine Marketing)',
//     'Influencer Marketing',
//     'Local SEO',
//     'Affiliate Marketing',
//     'Mobile Marketing & Advertising',
//     'Display Advertising',
//     'E-Commerce Marketing',
//     'Text Message Marketing',
//     'Crowdfunding',
//     'Marketing Strategy',
//     'Web Analytics',
//     'Domain Research',
//     'Music Promotion',
//     'Book & eBook Marketing',
//     'Podcast Marketing',
//     'Community Management',
//     'Marketing Consulting',
//   ],

//   'Writing & Translation': [
//     'Articles & Blog Posts',
//     'Proofreading & Editing',
//     'Translation',
//     'Website Content',
//     'Technical Writing',
//     'Copywriting',
//     'Brand Voice & Tone',
//     'Resume Writing',
//     'Cover Letters',
//     'LinkedIn Profiles',
//     'Press Releases',
//     'Product Descriptions',
//     'Case Studies',
//     'White Papers',
//     'Scriptwriting',
//     'Speechwriting',
//     'Creative Writing',
//     'Book Editing',
//     'Beta Reading',
//     'Grant Writing',
//     'UX Writing',
//     'Email Copy',
//     'Business Names & Slogans',
//     'Transcription',
//     'Legal Writing',
//   ],

//   'Video & Animation': [
//     'Whiteboard & Animated Explainers',
//     'Video Editing',
//     'Short Video Ads',
//     'Logo Animation',
//     'Character Animation',
//     '2D/3D Animation',
//     'Intros & Outros',
//     'Lyric & Music Videos',
//     'Visual Effects',
//     'Spokesperson Videos',
//     'App & Website Previews',
//     'Product Photography & Demos',
//     'Subtitles & Captions',
//     'Live Action Explainers',
//     'Unboxing Videos',
//     'Slideshow Videos',
//     'Animation for Kids',
//     'Trailers & Teasers',
//   ],

//   'Music & Audio': [
//     'Voice Over',
//     'Mixing & Mastering',
//     'Producers & Composers',
//     'Singers & Vocalists',
//     'Session Musicians',
//     'Songwriters',
//     'Audiobook Production',
//     'Sound Design',
//     'Audio Editing',
//     'Jingles & Intros',
//     'Podcast Editing',
//     'Music Transcription',
//     'Dialogue Editing',
//     'DJ Drops & Tags',
//     'Music Promotion',
//   ],

//   'AI Services': [
//     'AI Artists',
//     'AI Applications',
//     'AI Video Generators',
//     'AI Music Generation',
//     'AI Chatbot Development',
//     'AI Website Builders',
//     'Custom GPT & LLMs',
//     'AI Training Data Preparation',
//     'Text-to-Speech / Voice Cloning',
//     'Prompt Engineering',
//   ],

//   'Data': [
//     'Data Entry',
//     'Data Mining & Scraping',
//     'Data Analytics & Reports',
//     'Database Design',
//     'Data Visualization',
//     'Dashboards',
//     'Excel / Google Sheets',
//     'Statistical Analysis',
//     'Data Engineering',
//     'Machine Learning Models',
//     'Data Cleaning',
//   ],

//   'Business': [
//     'Business Plans',
//     'Market Research',
//     'Branding Services',
//     'Legal Consulting',
//     'Financial Consulting',
//     'Career Counseling',
//     'Project Management',
//     'Supply Chain Management',
//     'HR Consulting',
//     'E-Commerce Management',
//     'Business Consulting',
//     'Presentations',
//     'Virtual Assistant',
//   ],

//   'Finance': [
//     'Accounting & Bookkeeping',
//     'Financial Forecasting',
//     'Financial Modeling',
//     'Tax Consulting',
//     'Crypto & NFT Consulting',
//     'Business Valuation',
//     'Pitch Decks',
//   ],

//   'Photography': [
//     'Product Photography',
//     'Real Estate Photography',
//     'Portraits',
//     'Image Retouching',
//     'Food Photography',
//     'Drone Photography',
//     'Lifestyle Photography',
//     'AI Image Enhancement',
//   ],

//   'Lifestyle': [
//     'Gaming',
//     'Astrology & Psychics',
//     'Online Tutoring',
//     'Arts & Crafts',
//     'Fitness Lessons',
//     'Nutrition',
//     'Relationship Advice',
//     'Personal Styling',
//     'Cooking Lessons',
//     'Life Coaching',
//     'Travel Advice',
//     'Wellness & Meditation',
//     'Language Lessons',
//   ],

//   'Consulting': [
//     'Management Consulting',
//     'Business Strategy',
//     'HR & Leadership',
//     'Financial Advisory',
//     'Legal Consulting',
//     'Technology Consulting',
//     'Cybersecurity Consulting',
//     'Marketing Strategy',
//   ],

//   'Personal Growth & Hobbies': [
//     'Life Coaching',
//     'Productivity Coaching',
//     'Study Skills',
//     'Language Learning',
//     'Public Speaking',
//     'Career Mentoring',
//     'Mindfulness & Meditation',
//     'Confidence Coaching',
//   ],
// };

// /* ======================================================
//    HELPERS
// ====================================================== */
// const timeAgo = (date) => {
//   const diff = Date.now() - date.getTime();
//   const sec = Math.floor(diff / 1000);
//   if (sec < 60) return `${sec}s ago`;
//   const min = Math.floor(sec / 60);
//   if (min < 60) return `${min} min ago`;
//   const hr = Math.floor(min / 60);
//   if (hr < 24) return `${hr}h ago`;
//   const day = Math.floor(hr / 24);
//   return `${day}d ago`;
// };

// const skillColor = (text) => {
//   const colors = ["#E3F2FD", "#FFF9C4", "#E1F5FE", "#F3E5F5"];
//   return colors[text.length % colors.length];
// };

// /* ======================================================
//    MAIN CLIENT COMPONENT
// ====================================================== */
// export default function Client() {
//   const location = useLocation();
//   const [screen, setScreen] = useState("CATEGORIES"); // CATEGORIES | SUB
//   const [category, setCategory] = useState(null);
//   const [skill, setSkill] = useState(null);
//   const navigate = useNavigate();
//   const [catSearch, setCatSearch] = useState("");
//   const [subSearch, setSubSearch] = useState("");

//   /* ---------- DEFAULT AUTO SELECT ---------- */
//   useEffect(() => {
//     if (screen === "SUB" && category) {
//       const list = jobCategories1[category] || [];
//       if (list.length && !skill) setSkill(list[0]);
//     }
//   }, [screen, category]);

//   /* ---------- FILTERS ---------- */
//   const categories = useMemo(() => {
//     if (!catSearch) return Object.keys(jobCategories1);
//     return Object.keys(jobCategories1).filter((c) =>
//       c.toLowerCase().includes(catSearch.toLowerCase())
//     );
//   }, [catSearch]);

//   const subCategories = useMemo(() => {
//     if (!category) return [];
//     const list = jobCategories1[category];
//     if (!subSearch) return list;
//     return list.filter((s) =>
//       s.toLowerCase().includes(subSearch.toLowerCase())
//     );
//   }, [subSearch, category]);

//   useEffect(() => {
//   if (location.state?.category) {
//     setCategory(location.state.category);
//     setScreen("SUB");
//   }
// }, [location.state]);

//  useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "auto" });
//   }, [location.pathname]);

//   /* ======================================================
//      UI
//   ====================================================== */
//   return (
//     <div style={styles.page}>
//       {/* HEADER */}
//       <div style={styles.appBar}>
//         {screen === "SUB" && (
//           <div style={styles.backbtn} onClick={() => navigate(-1)} aria-label="Back">
//                       <img src={backarrow} alt="back arrow" height={20} />
//                     </div>
//         )}
//         <h3  style={styles.title}>{screen === "CATEGORIES" ? "Categories" : category}</h3>
//       </div>

//       {/* SEARCH */}
//      <div style={styles.searchWrap}>
//   <div style={styles.searchBar}>
//     <span style={styles.searchIcon}><Search size={16}/></span>
//     <input
//       placeholder="Search"
//       value={screen === "CATEGORIES" ? catSearch : subSearch}
//       onChange={(e) =>
//         screen === "CATEGORIES"
//           ? setCatSearch(e.target.value)
//           : setSubSearch(e.target.value)
//       }
//       style={styles.searchInput}
//     />
   
//   </div>
// </div>


//       {/* CONTENT */}
//       {screen === "CATEGORIES" && (
//         <div style={styles.list}>
//           {categories.map((c) => (
//             <Row
//               key={c}
//               text={c}
//               onClick={() => {
//                 setCategory(c);
//                 setSkill(null);
//                 setScreen("SUB");
//               }}
//             />
//           ))}
//         </div>
//       )}

//       {screen === "SUB" && (
//         <>
//           {/* SUB SKILLS */}
//        <div style={{ ...styles.skillsRow }} className="skillsRow">

//             {subCategories.map((s) => (
//               <div
//                 key={s}
//                 onClick={() => setSkill(s)}
//                 style={{
//                   ...styles.skillChip,
//                   background: skill === s ? "rgba(124, 60, 255, 1)" : "#eee",
//                   color: skill === s ? "#fff" : "#000",
//                 }}
//               >
//                 {s}
//               </div>
//             ))}
//           </div>

//           {/* JOBS */}
//           {skill && <JobsScreen skill={skill} />}
//         </>
//       )}
//     </div>
//   );
// }

// /* ======================================================
//    JOBS SCREEN
// ====================================================== */
// function JobsScreen({ skill }) {
//   const [tab, setTab] = useState("WORKS");
//   const [jobs, setJobs] = useState([]);
//   const [jobs24, setJobs24] = useState([]);
//   const [saved, setSaved] = useState([]);

//   const uid = auth.currentUser?.uid;

//   useEffect(() => {
//     const u1 = onSnapshot(collection(db, "services"), (snap) =>
//       setJobs(processJobs(snap.docs))
//     );
//     const u2 = onSnapshot(collection(db, "service_24h"), (snap) =>
//       setJobs24(processJobs(snap.docs))
//     );

//     if (!uid) return;
//     const u3 = onSnapshot(doc(db, "users", uid), (snap) =>
//       setSaved(snap.data()?.favoriteJobs || [])
//     );

//     return () => {
//       u1();
//       u2();
//       u3 && u3();
//     };
//   }, [uid]);

//   const filter = (list) =>
//     list.filter((j) =>
//       [...j.skills, ...j.tools].some((x) =>
//         x.toLowerCase().includes(skill.toLowerCase())
//       )
//     );

//   const renderList =
//     tab === "WORKS"
//       ? filter(jobs)
//       : tab === "24H"
//       ? filter(jobs24)
//       : [...jobs, ...jobs24].filter((j) => saved.includes(j.id));

//   return (
//     <>
//       {/* TABS */}
//       <div style={styles.tabWrap}>
//   {["Work", "24 Hours", "Saved"].map((t) => (
//     <div
//       key={t}
//       onClick={() => setTab(t === "Work" ? "WORKS" : t === "24 Hours" ? "24H" : "SAVED")}
//       style={{
//         ...styles.tabPill,
//         background: tab === (t === "Work" ? "WORKS" : t === "24 Hours" ? "24H" : "SAVED")
//           ? "#fff"
//           : "transparent",
//       }}
//     >
//       {t}
//     </div>
//   ))}
// </div>


//       {/* LIST */}
//       <div>
//         {renderList.length === 0 ? (
//           <Empty />
//         ) : (
//           renderList.map((job) => (
//             <JobCard
//               key={job.id}
//               job={job}
//               saved={saved.includes(job.id)}
//             />
//           ))
//         )}
//       </div>
//     </>
//   );
// }

// /* ======================================================
//    JOB CARD
// ====================================================== */
// function JobCard({ job, saved }) {
//   const uid = auth.currentUser?.uid;


//   const toggleSave = async () => {
//     if (!uid) return;
//     await updateDoc(doc(db, "users", uid), {
//       favoriteJobs: saved
//         ? arrayRemove(job.id)
//         : arrayUnion(job.id),
//     });
//   };


//   return (
//     <div style={styles.jobCard}>
//  <div style={styles.cardTop}>
//   {/* LEFT */}
//   <div>
//     <h4 style={styles.company}>Zuntra digital PVT</h4>
//     <p style={styles.role}>UIUX Designer</p>
//   </div>

//   {/* RIGHT */}
//   <div style={styles.priceWrap}>
//     <div style={styles.price}>₹ 1000 / per day</div>
//     <span onClick={toggleSave} style={styles.bookmark}>
//       {saved ? <BsBookmarkFill size={16} /> : <Bookmark size={18}/>}
//     </span>
//   </div>
// </div>


//   <div style={styles.tagRow}>
//     {job.skills.slice(0, 4).map((s) => (
//       <span key={s} style={styles.tag}>{s}</span>
//     ))}
//   </div>

//   <p style={styles.desc}>{job.description}</p>

//   <div style={styles.cardFooter}>
//   <FiEye  size={15}  />  <span style={{paddingTop:"1px",}}> {job.views} Impression</span>
//    <Clock size={15} /> <span style={{paddingTop:"1px",marginLeft:"1px"}}> {timeAgo(job.created_at)}</span>
   
//   </div>
// </div>

//   );
// }

// /* ======================================================
//    DATA NORMALIZER
// ====================================================== */
// function processJobs(docs) {
//   return docs
//     .map((d) => {
//       const data = d.data();
//       if (!data.title || !data.description) return null;
//       return {
//         id: d.id,
//         title: data.title,
//         description: data.description,
//         skills: data.skills || [],
//         tools: data.tools || [],
//         views: data.views || 0,
//         created_at: data.created_at?.toDate?.() || new Date(),
//       };
//     })
//     .filter(Boolean);
// }

// /* ======================================================
//    SMALL UI
// ====================================================== */
// const Row = ({ text, onClick }) => (
//   <div style={styles.row} onClick={onClick}>
//     <span>{text}</span>
//     <span>›</span>
//   </div>
// );

// const Empty = () => (
//   <div style={styles.empty}>
//     <div style={{ fontSize: 48 }}><img src={Searchjob} height={"200px"}/></div>
//     <p>No jobs found</p>
//   </div>
// );

// /* ======================================================
//    STYLES
// ====================================================== */
// const styles = {
//   page: { fontFamily: "system-ui", background: "#fff", minHeight: "100dvh" ,  overflowY: "auto", },
//  appBar: {
//   height: 56,
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   // borderBottom: "1px solid #eee",
//   position: "relative",
// },

// backbtn: {
//   position: "absolute",
//   left: 12,
//   width: 36,
//   height: 36,
//   borderRadius: 12,
//   border: "0.8px solid #ccc",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   cursor: "pointer",
// },
// title: {
//   fontSize: 16,
//   fontWeight: 600,
//   textAlign: "center",
//   maxWidth: "70%",
//   overflow: "hidden",
//   textOverflow: "ellipsis",
//   whiteSpace: "nowrap",
// },


// searchWrap: {
//   padding: "12px 16px",
// },

// searchBar: {
//   display: "flex",
//   alignItems: "center",
//   background: "#fff",
//   borderRadius: 14,
//   padding: "1px 1px",
//   boxShadow: "1px 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
//   height:"40px",
// },

// searchIcon: {
//   fontSize: 16,
//   marginRight: 8,
//   opacity: 0.6,
//   padding: "5px 0px 5px 6px",
// },

// searchInput: {
//   flex: 1,
//   border: "none",
//   outline: "none",
//   fontSize: 14,
//   padding: "18px 1px 6px",
// },


// tabWrap: {
//   display: "flex",
//   background: "#f8f4f4ff",
//   borderRadius: 14,
//   margin: "12px 16px",
//   padding: 7,
//   boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
// },

// tabPill: {
//   flex: 1,
//   textAlign: "center",
//   padding: "10px 0",
//   borderRadius: 10,
//   fontSize: 14,
//   cursor: "pointer",
// },


//   list: {  paddingBottom: 80,},
//   row: {
//     padding: 14,
//     display: "flex",
//     justifyContent: "space-between",
//     borderBottom: "1px solid #eee",
//     cursor: "pointer",
//   },
//  skillsRow: {
//   display: "flex",
//   gap: 10,
//   padding: "10px 12px",
//   overflowX: "auto",
//   overflowY: "hidden",     
//   whiteSpace: "nowrap",
//   minHeight: 56,         
//   alignItems: "center",
//   boxSizing: "border-box",
// },

// skillChip: {
//   padding: "8px 14px",
//   borderRadius: 20,
//   cursor: "pointer",
//   whiteSpace: "nowrap",
//   flexShrink: 0,          
//   fontSize: 13,

// },

// tabs: {
//   display: "flex",
//   justifyContent: "space-around",
//   borderBottom: "1px solid #eee",
//   marginTop: 6,           
// },

//   tab: { padding: 12, cursor: "pointer" },
//   card: {
//     margin: 12,
//     padding: 16,
//     border: "1px solid #ddd",
//     borderRadius: 14,
    
//   },
//   skills: { display: "flex", gap: 6 },
//   skill: { padding: "4px 10px", borderRadius: 12, fontSize: 12 },
//   footer: { display: "flex", gap: 12, marginTop: 10 },
//   bookmark: { marginLeft: "auto", cursor: "pointer", fontSize: 20 },
//   empty: {
//     padding: 60,
//     textAlign: "center",
//     color: "#777",
//   },
//   jobCard: {
//   background: "#fff",
//   borderRadius: 18,
//   padding: 18,
//   margin: "16px",
//  boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
// },

// cardTop: {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "flex-start",
// },

// company: {
//   margin: 0,
//   fontSize: 18,
//   fontWeight: 600,
// },

// role: {
//   margin: "4px 0 0",
//   color: "#555",
// },

// price: {
//   fontWeight: 600,
// },

// tagRow: {
//   display: "flex",
//   gap: 8,
//   margin: "12px 0",
//   flexWrap: "wrap",
// },

// tag: {
//   background: "#FFF4B8",
//   padding: "4px 10px",
//   borderRadius: 12,
//   fontSize: 12,
// },

// desc: {
//   fontSize: 14,
//   color: "#444",
//   lineHeight: 1.5,
// },

// cardFooter: {
//   display: "flex",
//   gap: 12,
//   alignItems: "center",
//   marginTop: 14,
//   fontSize: 12,
//   color: "#666",
// },
// rightTop: {
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "flex-end",
//   gap: 8,
// },


// priceWrap: {
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "flex-end",
//   gap: 6,
// },

// bookmark: {
//   fontSize: 20,
//   cursor: "pointer",
//   marginRight:"50px",
// },


// };


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
import { useLocation, useNavigate } from "react-router-dom";
import { FiBell, FiEye, FiMessageCircle, FiSettings } from "react-icons/fi";
import { Bookmark, Clock, SaveIcon, Search, TimerIcon, User } from "lucide-react";
import "./clientbrower.css"
import backarrow from "../../../assets/backarrow.png";
import { MdSavedSearch } from "react-icons/md";
import { BsBookmarkFill } from "react-icons/bs";
import Searchjob from "../../../assets/Searchjob.png"
import { color } from "framer-motion";
import categoryImg from "../../../assets/categories.png";
/* ======================================================
   FIREBASE
====================================================== */
const db = getFirestore();
const auth = getAuth();
const PAGE_PADDING = "16px";

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
  const navigate = useNavigate();
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  /* ======================================================
     UI
  ====================================================== */
  return (
    <div id="fh-page" className="fh-page rubik-font">
      <div id="fh-containers" className="fh-container" >
        <div style={styles.page}>
          {/* HEADER */}
         {/* HEADER */}
<div style={styles.appBar}>
  {screen === "SUB" && (
    <div style={styles.backbtn} onClick={() => navigate(-1)} aria-label="Back">
      <img src={backarrow} alt="back arrow" height={20} />
    </div>
  )}

  <h3 style={styles.title}>
    {screen === "CATEGORIES" ? "Categories" : category}
  </h3>

  {/* TOP RIGHT ICONS */}
  <div style={styles.headerIcons}>
     <FiMessageCircle size={24} style={styles.icon} />
    <FiBell size={24} style={styles.icon} />
   
    <User size={24} style={styles.icon} />
  </div>
</div>


         {/* SEARCH */}
<div style={styles.searchWrap}>
  <div style={styles.searchBar}>
    <Search size={16} style={styles.searchIcon} />

    <input
      placeholder="Search"
      value={screen === "CATEGORIES" ? catSearch : subSearch}
      onChange={(e) =>
        screen === "CATEGORIES"
          ? setCatSearch(e.target.value)
          : setSubSearch(e.target.value)
      }
      style={styles.searchInput}
    />
  </div>
</div>



          {/* CONTENT */}
        {screen === "CATEGORIES" && (
              <div className="category-grid" style={styles.cardGrid}>
                {categories
                  .filter((c) =>
                    c.toLowerCase().includes(catSearch.toLowerCase())
                  )
                  .map((category) => (
                    <div
                      key={category}
                      style={styles.categoryCard}
                      onClick={() => {
                        setCategory(category);
                        setSkill(null);
                        setScreen("SUB");
                      }}
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
                          alt={category}
                          style={styles.categoryImage}
                        />
                      </div>

                      <div style={styles.categoryCardBottom}>
                        {category}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          {screen === "SUB" && (
            <>
              {/* SUB SKILLS */}
              <div style={{ ...styles.skillsRow }} className="skillsRow">

                {subCategories.map((s) => (
                  <div
                    key={s}
                    onClick={() => setSkill(s)}
                    style={{
                      ...styles.skillChip,
                      background: skill === s ? "rgba(124, 60, 255, 1)" : "#eee",
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
      </div>
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

      <div style={styles.tabWrap}>
        {["Work", "24 Hours", "Saved"].map((t) => (
          <div
          className="pill"
            key={t}
            onClick={() => setTab(t === "Work" ? "WORKS" : t === "24 Hours" ? "24H" : "SAVED")}
            style={{
              ...styles.tabPill,
              background: tab === (t === "Work" ? "WORKS" : t === "24 Hours" ? "24H" : "SAVED")
                ? "#efeaeaff"
                : "transparent",
            }}
          >
            {t}
          </div>
        ))}
      </div>




      {/* TABS */}

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
    <div style={styles.jobCard}>
      <div style={styles.cardTop}>
        {/* LEFT */}
        <div>
          {/* <h4 style={styles.company}>Zuntra digital PVT</h4> */}
          <p style={styles.role}>UIUX Designer</p>
        </div>

        {/* RIGHT */}
        <div style={styles.priceWrap}>
          <div style={styles.price}>₹ 1000 / per day</div>
          <span onClick={toggleSave} style={styles.bookmark}>
            {saved ? <BsBookmarkFill size={16} /> : <Bookmark size={18} />}
          </span>
        </div>
      </div>

 <p style={{opacity:"70%",fontSize:"14px",fontWeight:"400",}}>Skills Required</p>
      <div style={styles.tagRow}>
       
        {job.skills.slice(0, 4).map((s) => (
          <span key={s} style={styles.tag}>{s}</span>
        ))}
      </div>

      <p style={styles.desc}>{job.description}</p>

      <div style={styles.cardFooter}>
        <FiEye size={15} />  <span style={{ paddingTop: "1px", }}> {job.views} Impression</span>
        <Clock size={15} /> <span style={{ paddingTop: "1px", marginLeft: "1px" }}> {timeAgo(job.created_at)}</span>

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
    <div style={{ fontSize: 48 }}><img src={Searchjob} height={"200px"} /></div>
    <p>No jobs found</p>
  </div>
);

/* ======================================================
   STYLES
====================================================== */
const styles = {
  page: { fontFamily: "system-ui", background: "#fff", minHeight: "100dvh", overflowY: "auto",   padding: `0 ${PAGE_PADDING}`,  transform: "translateX(-156px)",},
  appBar: {
  height: 56,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",  
  position: "relative",
  padding: "0 16px",                 // responsive padding
},

title: {
  fontSize: "clamp(18px, 4vw, 36px)", // responsive font
  fontWeight: 500,
  flex: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  textAlign: "left",
  marginLeft: screen === "SUB" ? "50px" : "50px",

},

headerIcons: {
  display: "flex",
  alignItems: "center",
  gap: 16,           // space between icons
},

icon: {
  cursor: "pointer",
  color: "#444",
},

  backbtn: {
    position: "absolute",
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 12,
    border: "0.8px solid #ccc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  

 searchWrap: {
  padding: "12px 0",
},

searchBar: {
  position: "relative",          // 🔑 needed
  display: "flex",
  alignItems: "center",
  background: "#fff",
  borderRadius: 14,
  height: 40,
  boxShadow: "1px 4px 8px rgba(0,0,0,0.2)",
},

searchIcon: {
  position: "absolute",          // 🔑 icon inside input
  left: 14,
  top: "50%",
  transform: "translateY(-50%)",
  color: "#888",
  pointerEvents: "none",         // so clicks go to input
},

searchInput: {
  width: "100%",
  height: "100%",
  border: "none",
  outline: "none",
  fontSize: 14,
  padding: "12px 14px 0 40px",      // 🔑 space for icon
  borderRadius: 14,
  background: "transparent",
},


tabWrap: {
  display: "flex",
  justifyContent: "flex-start",
  background: "transparent",
  borderRadius: 14,
  margin: "12px 0",
  padding: 7,
  gap: 56,
  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
},


  tabPill: {
   
    textAlign: "center",
    padding: "10px 30px",
    borderRadius: "14px",
    fontSize: 14,
    cursor: "pointer",
    
  },



  list: { paddingBottom: 80, },
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
   padding: "10px 0",
    overflowX: "auto",
    overflowY: "hidden",
    whiteSpace: "nowrap",
    minHeight: 56,
    alignItems: "center",
    boxSizing: "border-box",
  },

  skillChip: {
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    flexShrink: 0,
    fontSize: 13,

  },

  tabs: {
    display: "flex",
    justifyContent: "space-around",
    borderBottom: "1px solid #eee",
    marginTop: 6,
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
  jobCard: {
    background: "#fff",
    borderRadius: 18,
    padding: 18,
   margin: "16px 0",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  company: {
    margin: 0,
    fontSize: 18,
    fontWeight: 600,
  },

  role: {
    margin: "4px 0 0",
    color: "#555",
  },

  price: {
    fontWeight: 400,
    fontSize:"20px"
  },

  tagRow: {
    display: "flex",
    gap: 8,
    margin: "12px 0",
    flexWrap: "wrap",
  },

  tag: {
    background: "#FFF4B8",
    padding: "4px 10px",
    borderRadius: 12,
    fontSize: 12,
  },

  desc: {
    fontSize: 14,
    color: "#444",
    lineHeight: 1.5,
  },

  cardFooter: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    marginTop: 14,
    fontSize: 12,
    color: "#666",
  },
  rightTop: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 8,
  },


  priceWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 6,
  },

  bookmark: {
    fontSize: 20,
    cursor: "pointer",
    marginRight: "50px",
  },








































  cardGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
  gap: 24,                                                     
  padding: "16px 8px",
},

categoryCard: {
  background: "#fff",
  borderRadius: 18,                                           
  cursor: "pointer",
  transition: "all 0.25s ease",
  boxShadow: "0 10px 26px rgba(0,0,0,0.10)",                  
  overflow: "hidden",
},

categoryCardTop: {
  height: 150,                                                 
  width: "100%",
  background: "#f3f4f6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
},

categoryImage: {
  width: "100%",                                               
  height: "100%",                                            
  objectFit: "cover",                                          
},

categoryCardBottom: {
  padding: "16px 12px",                                   
  fontWeight: 600,
  textAlign: "center",
  fontSize: 15,    
   fontWeight:400,                                            
  fontFamily: "Rubik, sans-serif",
},
};