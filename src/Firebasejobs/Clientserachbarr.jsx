// import React, { useEffect, useRef, useState, useMemo } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Categories from "../assets/categories.png";
// import {
//     collection,
//     query,
//     orderBy,
//     onSnapshot,
//     Timestamp,
//     where,
//     updateDoc,
//     deleteDoc,
//     doc,
//     setDoc,
//     getDoc,
// } from "firebase/firestore";
// import { db, auth } from "../firbase/Firebase";



// // ====== ASSETS ======
// import browseImg1 from "../assets/Container.png";
// import browseImg2 from "../assets/wave.png";
// import worksImg1 from "../assets/file.png";
// import worksImg2 from "../assets/yellowwave.png";
// import arrow from "../assets/arrow.png";
// import profile from "../assets/profile.png";

// // ====== ICONS ======
// import {
//     FiSearch,
//     FiMessageCircle,
//     FiBell,
//     FiPlus,
//     FiBookmark,
//     FiEye,
// } from "react-icons/fi";
// import { onAuthStateChanged } from "firebase/auth";
// // import FreelanceHome from "../Firebasejobs/ClientHome.css";

// // ====== CATEGORY DATA ======
// const categories = [
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
//     "Personal Growth & Hobbies",
// ];

// // ======================================================
// // HELPERS
// // ======================================================
// function parseIntSafe(v) {
//     if (v === undefined || v === null) return null;
//     if (typeof v === "number") return Math.floor(v);
//     const s = String(v).replace(/[^0-9]/g, "");
//     const n = parseInt(s, 10);
//     return Number.isNaN(n) ? null : n;
// }

// function timeAgo(input) {
//     if (!input) return "N/A";
//     let d = input instanceof Timestamp ? input.toDate() : new Date(input);
//     const diff = (Date.now() - d.getTime()) / 1000;
//     if (diff < 60) return `${Math.floor(diff)} sec ago`;
//     if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
//     if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
//     return `${Math.floor(diff / 86400)} days ago`;
// }

// function formatCurrency(amount) {
//     if (!amount && amount !== 0) return "₹0";
//     if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
//     if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
//     return `₹${amount}`;
// }

// // ======================================================
// // MAIN
// // ======================================================
// export default function ClientHomeUI() {
//     const navigate = useNavigate();

//     const [jobs, setJobs] = useState([]);
//     const [searchText, setSearchText] = useState("");
//     const [suggestions, setSuggestions] = useState([]);
//     const [savedJobs, setSavedJobs] = useState(new Set());
//     const [userProfile, setUserProfile] = useState(null);

//     const searchRef = useRef(null);

//     // ================= NOTIFICATIONS ==================
//     const [notifications, setNotifications] = useState([]);
//     const [notifOpen, setNotifOpen] = useState(false);

//     const [userInfo, setUserInfo] = useState({
//         firstName: "",
//         lastName: "",
//         role: "",
//         profileImage: "",
//     });

//     const fetchUserProfile = async (uid) => {
//         try {
//             const snap = await getDoc(doc(db, "users", uid));
//             if (snap.exists()) {
//                 setUserProfile(snap.data());
//             } else {
//                 console.log("User profile not found");
//             }
//         } catch (e) {
//             console.error("Profile fetch error:", e);
//         }
//     };

//     useEffect(() => {
//         const user = auth.currentUser;
//         if (!user) return;
//         fetchUserProfile(user.uid);
//     }, []);

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//             if (!currentUser) return;
//             try {
//                 const userRef = doc(db, "users", currentUser.uid);
//                 const snap = await getDoc(userRef);
//                 if (snap.exists()) {
//                     const data = snap.data();
//                     setUserInfo({
//                         firstName: data.firstName || "",
//                         lastName: data.lastName || "",
//                         role: data.role || "",
//                         profileImage: data.profileImage || "",
//                     });
//                 }
//             } catch (err) {
//                 console.error("Error fetching user:", err);
//             }
//         });
//         return unsubscribe;
//     }, []);

//     useEffect(() => {
//         const user = auth.currentUser;
//         if (!user) return;

//         const q = query(
//             collection(db, "notifications"),
//             where("clientUid", "==", user.uid)
//         );

//         return onSnapshot(q, (snap) => {
//             setNotifications(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//         });
//     }, []);

//     const pending = notifications.filter((n) => !n.read).length;

//     async function acceptNotif(item) {
//         await updateDoc(doc(db, "notifications", item.id), { read: true });

//         navigate("/chat", {
//             state: {
//                 currentUid: auth.currentUser.uid,
//                 otherUid: item.freelancerId,
//                 otherName: item.freelancerName,
//                 otherImage: item.freelancerImage,
//                 initialMessage: `Your application for ${item.jobTitle} accepted!`,
//             },
//         });
//     }

//     async function declineNotif(item) {
//         await deleteDoc(doc(db, "notifications", item.id));
//     }

//     // ================= JOB FETCH ==================
//     useEffect(() => {
//         const col1 = collection(db, "services");
//         const col2 = collection(db, "service_24h");

//         const unsub1 = onSnapshot(
//             query(col1, orderBy("createdAt", "desc")),
//             (snap) => {
//                 const data = snap.docs.map((d) => ({
//                     _id: d.id,
//                     ...d.data(),
//                     _source: "services",
//                 }));
//                 setJobs((prev) => mergeJobs(prev, data));
//             }
//         );

//         const unsub2 = onSnapshot(
//             query(col2, orderBy("createdAt", "desc")),
//             (snap) => {
//                 const data = snap.docs.map((d) => ({
//                     _id: d.id,
//                     ...d.data(),
//                     _source: "service_24h",
//                 }));
//                 setJobs((prev) => mergeJobs(prev, data));
//             }
//         );

//         return () => {
//             unsub1();
//             unsub2();
//         };
//     }, []);

//     function mergeJobs(prev, incoming) {
//         const map = new Map();
//         for (const p of prev) map.set(p._id + "::" + (p._source || ""), p);
//         for (const n of incoming) map.set(n._id + "::" + (n._source || ""), n);
//         return Array.from(map.values());
//     }

//     // ================= AUTOCOMPLETE ==================
//     useEffect(() => {
//         const q = searchText.trim().toLowerCase();
//         if (!q) return setSuggestions([]);

//         const setS = new Set();
//         for (const job of jobs) {
//             if (job.title?.toLowerCase().includes(q)) setS.add(job.title);
//             if (Array.isArray(job.skills)) {
//                 for (const s of job.skills) {
//                     if (String(s).toLowerCase().includes(q)) setS.add(s);
//                 }
//             }
//         }
//         setSuggestions(Array.from(setS).slice(0, 6));
//     }, [searchText, jobs]);

//     // ================= FILTER ==================
//     const filteredJobs = useMemo(() => {
//         const q = searchText.trim().toLowerCase();

//         return jobs
//             .filter((j) => {
//                 const t = (j.title || "").toLowerCase();
//                 const d = (j.description || "").toLowerCase();
//                 const skills = Array.isArray(j.skills)
//                     ? j.skills.map((s) => String(s).toLowerCase())
//                     : [];
//                 return (
//                     !q ||
//                     t.includes(q) ||
//                     d.includes(q) ||
//                     skills.some((s) => s.includes(q))
//                 );
//             })
//             .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
//     }, [jobs, searchText]);

//     // ================= OPEN JOB ==================
//     async function openJob(job) {
//         if (!job?._id) return;

//         const collectionName =
//             job._source === "service_24h" || "services";

//         try {
//             await setDoc(
//                 doc(db, collectionName, job._id),
//                 {
//                     views: increment(1),
//                 },
//                 { merge: true }
//             );
//         } catch (err) {
//             console.error("Error updating views:", err);
//         }
//         if (job._source === "service_24h")
//             navigate(`/client-dashbroad2/service-24h/${job._id}`);
//         else navigate(`/client-dashbroad2/service/${job._id}`);
//     }

//     function toggleSaveJob(id) {
//         setSavedJobs((prev) => {
//             const ns = new Set(prev);
//             if (ns.has(id)) ns.delete(id);
//             else ns.add(id);
//             return ns;
//         });
//     }

//     // ======================================================
//     // UI
//     // ======================================================
//     return (
//         <div className="fh-page rubik-font">
//             <div className="fh-container">
//                 {/* HEADER */}
//                 <header className="fh-header">
//                     <div className="fh-header-left">
//                         <h1 className="fh-title">
//                             Welcome,
//                             <div>{userInfo.firstName || "Huzzlers"}</div>
//                         </h1>
//                         <div></div>
//                     </div>

//                     <div className="fh-header-right">
//                         <button className="icon-btn" onClick={() => navigate("/client-dashbroad2/messages")}>
//                             <FiMessageCircle />
//                         </button>

//                         <button className="icon-btn" onClick={() => setNotifOpen(true)}>
//                             <FiBell />
//                             {pending > 0 && (
//                                 <span
//                                     style={{
//                                         width: 8,
//                                         height: 8,
//                                         borderRadius: "50%",
//                                         background: "red",
//                                         position: "absolute",
//                                         top: 2,
//                                         right: 2,
//                                     }}
//                                 ></span>
//                             )}
//                         </button>

//                         <div className="fh-avatar">
//                             <Link to={"/client-dashbroad2/CompanyProfileScreen"}>
//                                 <img
//                                     src={
//                                         userProfile?.profileImage || profile
//                                     }
//                                     alt="Profile"
//                                 />
//                             </Link>
//                         </div>

//                     </div>

//                     {/* SEARCH */}
//                     <div className="fh-search-row" ref={searchRef}>
//                         <div className="fh-search fh-search-small">
//                             <FiSearch className="search-icon" />
//                             <input
//                                 className="search-input"
//                                 placeholder="Search"
//                                 value={searchText}
//                                 onChange={(e) => setSearchText(e.target.value)}
//                                 style={{marginTop:"-0px"}}
//                             />
//                             {searchText && (
//                                 <button className="clear-btn" onClick={() => setSearchText("")}>
//                                     ✕
//                                 </button>
//                             )}
//                         </div>

//                         {suggestions.length > 0 && (
//                             <div className="autocomplete-list">
//                                 {suggestions.map((s, i) => (
//                                     <div
//                                         key={i}
//                                         className="autocomplete-item"
//                                         onClick={() => {
//                                             setSearchText(s);
//                                             setSuggestions([]);
//                                         }}
//                                     >
//                                         {s}
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </header>



//                 {/* ================= MAIN ================= */}
//                 <main className="fh-main">
//                     {/* HERO */}
//                     <section className="fh-hero">
//                         <div
//                             className="fh-hero-card primary"
//                             onClick={() => navigate("/client-dashbroad2/clientcategories")}
//                         >
//                             <img src={browseImg1} className="hero-img img-1" />
//                             <img src={browseImg2} className="hero-img img-2" />
//                             <div>
//                                 <h3>Browse All Projects</h3>
//                                 <p>Explore verified professionals</p>
//                             </div>
//                             <div className="hero-right">
//                                 <img src={arrow} className="arrow" width={25} />
//                             </div>
//                         </div>

//                         <div
//                             className="fh-hero-card secondary"
//                             onClick={() => navigate("/client-dashbroad2/AddJobScreen")}
//                         >
//                             <img src={worksImg1} className="hero-img img-3" />
//                             <img src={worksImg2} className="hero-img img-4" />
//                             <div>
//                                 <h4>Job proposal</h4>
//                                 <p>Find the right freelancers</p>
//                             </div>
//                             <div className="hero-right">
//                                 <img src={arrow} className="arrow" width={25} />
//                             </div>
//                         </div>
//                     </section>

//                     {/* ================= CATEGORY SCROLL ================= */}
//                     <section className="category-scroll-wrapper">
//                         {categories.map((cat, i) => (
//                             <div
//                                 key={i}
//                                 className="category-card-img"
//                                 onClick={() =>
//                                     navigate("/client-dashbroad2/clientcategories", {
//                                         state: { category: cat },
//                                     })
//                                 }
//                             >
//                                 {/* background image */}
//                                 <img src={Categories} alt={cat} className="category-bg-img" />

//                                 {/* overlay */}
//                                 <div className="category-overlay">
//                                     <span className="category-title">{cat}</span>
//                                 </div>
//                             </div>
//                         ))}
//                     </section>



//                     {/* ================= JOB LIST ================= */}
//                     <section className="fh-section">
//                         <div className="section-header">
//                             <h2>Top Services for You</h2>
//                         </div>

//                         <div className="jobs-list">
//                             {filteredJobs.map((job) => (
//                                 <article key={job._id} className="job-card" onClick={() => openJob(job)}>
//                                     <div className="job-card-top">
//                                         <div>
//                                             <h3 className="job-title">{job.title}</h3>
//                                             <div className="job-sub">{job.category || "Service"}</div>
//                                         </div>

//                                         <div className="job-budget-wrapper">
//                                             <div className="job-budget">{formatCurrency(parseIntSafe(job.price))}</div>
//                                             <button
//                                                 className={`save-btn ${savedJobs.has(job._id) ? "saved" : ""}`}
//                                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                                     toggleSaveJob(job._id);
//                                                 }}
//                                             >
//                                                 <FiBookmark />
//                                             </button>
//                                         </div>
//                                     </div>

//                                     <div className="job-skills">
//                                         {(job.skills || []).slice(0, 3).map((skill, i) => (
//                                             <span key={i} className="skill-chip">{skill}</span>
//                                         ))}
//                                     </div>

//                                     <p className="job-desc">
//                                         {job.description?.slice(0, 180)}
//                                         {job.description?.length > 180 ? "..." : ""}
//                                     </p>

//                                     <div className="job-meta">
//                                         <span className="views-count">
//                                             <FiEye />
//                                             {job.views || 0} views
//                                         </span>
//                                         <div>{timeAgo(job.createdAt)}</div>
//                                         {job._source === "service_24h" && <div>⏱ 24 Hours</div>}
//                                     </div>
//                                 </article>
//                             ))}
//                         </div>
//                     </section>
//                 </main>

//                 {/* FAB */}
//                 <button className="fh-fab" onClick={() => navigate("/client-dashbroad2/PostJob")}>
//                     <FiPlus />
//                 </button>
//             </div>

//             {/* ================= NOTIFICATION POPUP ================= */}
//             {notifOpen && (
//                 <div
//                     style={{
//                         position: "fixed",
//                         inset: 0,
//                         background: "rgba(0,0,0,0.3)",
//                         backdropFilter: "blur(3px)",
//                         display: "flex",
//                         justifyContent: "center",
//                         alignItems: "center",
//                         zIndex: 9999,
//                     }}
//                     onClick={(e) => {
//                         if (e.target === e.currentTarget) setNotifOpen(false);
//                     }}
//                 >
//                     <div
//                         style={{
//                             width: "90%",
//                             maxWidth: 420,
//                             background: "#fff",
//                             padding: 20,
//                             borderRadius: 16,
//                             maxHeight: "80vh",
//                             overflowY: "auto",
//                         }}
//                     >
//                         <h3 style={{ marginBottom: 15 }}>Notifications</h3>

//                         {notifications.length === 0 && (
//                             <div style={{ padding: 20, textAlign: "center" }}>
//                                 No notifications
//                             </div>
//                         )}

//                         {notifications.map((item, i) => (
//                             <div
//                                 key={i}
//                                 style={{
//                                     display: "flex",
//                                     alignItems: "center",
//                                     marginBottom: 15,
//                                     background: "#f7f7f7",
//                                     padding: 10,
//                                     borderRadius: 10,
//                                 }}
//                             >
//                                 <img
//                                     src={item.freelancerImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
//                                     width={48}
//                                     height={48}
//                                     style={{ borderRadius: "50%", marginRight: 10 }}
//                                 />

//                                 <div style={{ flex: 1 }}>
//                                     <div style={{ fontWeight: 600 }}>{item.freelancerName}</div>
//                                     <div>applied for {item.jobTitle}</div>
//                                 </div>

//                                 {!item.read ? (
//                                     <>
//                                         <button
//                                             onClick={() => acceptNotif(item)}
//                                             style={{ marginRight: 8 }}
//                                         >
//                                             Accept
//                                         </button>
//                                         <button onClick={() => declineNotif(item)}>Decline</button>
//                                     </>
//                                 ) : (
//                                     <button onClick={() => acceptNotif(item)}>Chat</button>
//                                 )}
//                             </div>
//                         ))}

//                         <button
//                             style={{
//                                 marginTop: 10,
//                                 width: "100%",
//                                 padding: 10,
//                                 borderRadius: 10,
//                                 background: "#000",
//                                 color: "#fff",
//                             }}
//                             onClick={() => setNotifOpen(false)}
//                         >
//                             Close
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* ================= CATEGORY CSS ================= */}
//             <style>{`
// /* ================= CATEGORY SCROLL ================= */

// .category-scroll-wrapper {
//   display: flex;
//   gap: 14px;
//   overflow-x: auto;
//   padding: 14px 6px;
//   scrollbar-width: none;
// }

// .category-scroll-wrapper::-webkit-scrollbar {
//   display: none;
// }

// /* CARD */
// .category-card-img {
//   position: relative;
//   flex: 0 0 auto;
//   min-width: 280px;
//   height: 95px;
//   border-radius: 16px;
//   overflow: hidden;
//   cursor: pointer;
// }

// /* IMAGE */
// .category-bg-img {
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
// }

// /* DARK PURPLE OVERLAY */
// .category-card-img::after {
//   content: "";
//   position: absolute;
//   inset: 0;
//   background: linear-gradient(
//     135deg,

//   );
// }

// /* TEXT OVERLAY */
// .category-overlay {
//   position: absolute;
//   inset: 0;
//   z-index: 2;
//   padding: 14px;

//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   gap: 6px;

//   color: #fff;
// }

// /* STAR ICON */
// .category-star {
//   font-size: 16px;
//   opacity: 0.9;
// }

// /* TITLE */
// .category-title {
//   font-size: 14px;
//   font-weight: 600;
//   line-height: 1.2;
// }

// /* MOBILE */
// @media (max-width: 768px) {
//   .category-card-img {
//     min-width: 160px;
//     height: 85px;
//   }

//   .category-title {
//     font-size: 13px;
//   }
// }


//           /* ================= HEADER RIGHT ICONS ================= */

// .fh-header-right {
//   display: flex;
//   align-items: center;
//   gap: 16px; /* spacing between 3 icons */
//   position: relative;
// }

// /* ICON BUTTONS */
// .icon-btn {
//   width: 42px;
//   height: 42px;
//   border-radius: 50%;
//   border: none;
//   background: #f3f3f3;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   cursor: pointer;
//   position: relative;
//   font-size: 20px;
// }

// .icon-btn:hover {
//   background: #e5e5e5;
// }

// /* NOTIFICATION DOT */
// .notif-btn {
//   position: relative;
// }

// .notif-dot {
//   width: 8px;
//   height: 8px;
//   background: red;
//   border-radius: 50%;
//   position: absolute;
//   top: 8px;
//   right: 8px;
// }

// /* PROFILE AVATAR */
// .fh-avatar {
//   width: 42px;
//   height: 42px;
//   border-radius: 50%;
//   overflow: hidden;
//   cursor: pointer;

// }

// .fh-avatar img {
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
// }

//         `}</style>

//         </div>
//     );

// }




// import React, { useEffect, useRef, useState, useMemo } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Categories from "../assets/categories1.png";
// import {
//     collection,
//     query,
//     orderBy,
//     onSnapshot,
//     Timestamp,
//     where,
//     updateDoc,
//     deleteDoc,
//     doc,
//     setDoc,
//     getDoc,
// } from "firebase/firestore";
// import { db, auth } from "../firbase/Firebase";
// import { BsBookmarkFill } from "react-icons/bs";


// // ====== ASSETS ======
// import browseImg1 from "../assets/Container.png";
// import browseImg2 from "../assets/wave.png";
// import worksImg1 from "../assets/file.png";
// import worksImg2 from "../assets/yellowwave.png";
// import arrow from "../assets/arrow.png";
// import profile from "../assets/profile.png";

// // ====== ICONS ======
// import {
//     FiSearch,
//     FiMessageCircle,
//     FiBell,
//     FiPlus,
//     FiBookmark,
//     FiEye,
// } from "react-icons/fi";
// import { onAuthStateChanged } from "firebase/auth";
// import { TimerIcon } from "lucide-react";
// // import FreelanceHome from "../Firebasejobs/ClientHome.css";

// // ====== CATEGORY DATA ======
// const categories = [
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
//     "Personal Growth & Hobbies",
// ];

// // ======================================================
// // HELPERS
// // ======================================================
// function parseIntSafe(v) {
//     if (v === undefined || v === null) return null;
//     if (typeof v === "number") return Math.floor(v);
//     const s = String(v).replace(/[^0-9]/g, "");
//     const n = parseInt(s, 10);
//     return Number.isNaN(n) ? null : n;
// }

// function timeAgo(input) {
//     if (!input) return "N/A";
//     let d = input instanceof Timestamp ? input.toDate() : new Date(input);
//     const diff = (Date.now() - d.getTime()) / 1000;
//     if (diff < 60) return `${Math.floor(diff)} sec ago`;
//     if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
//     if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
//     return `${Math.floor(diff / 86400)} days ago`;
// }

// function formatCurrency(amount) {
//     if (!amount && amount !== 0) return "₹0";
//     if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
//     if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
//     return `₹${amount}`;
// }

// // ======================================================
// // MAIN
// // ======================================================
// export default function ClientHomeUI() {
//     const navigate = useNavigate();

//     const [jobs, setJobs] = useState([]);
//     const [searchText, setSearchText] = useState("");
//     const [suggestions, setSuggestions] = useState([]);
//     const [savedJobs, setSavedJobs] = useState(new Set());
//     const [userProfile, setUserProfile] = useState(null);

//     const searchRef = useRef(null);

//     // ================= NOTIFICATIONS ==================
//     const [notifications, setNotifications] = useState([]);
//     const [notifOpen, setNotifOpen] = useState(false);

//     const [userInfo, setUserInfo] = useState({
//         firstName: "",
//         lastName: "",
//         role: "",
//         profileImage: "",
//     });

//     const fetchUserProfile = async (uid) => {
//         try {
//             const snap = await getDoc(doc(db, "users", uid));
//             if (snap.exists()) {
//                 setUserProfile(snap.data());
//             } else {
//                 console.log("User profile not found");
//             }
//         } catch (e) {
//             console.error("Profile fetch error:", e);
//         }
//     };

//     useEffect(() => {
//         const user = auth.currentUser;
//         if (!user) return;
//         fetchUserProfile(user.uid);
//     }, []);

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//             if (!currentUser) return;
//             try {
//                 const userRef = doc(db, "users", currentUser.uid);
//                 const snap = await getDoc(userRef);
//                 if (snap.exists()) {
//                     const data = snap.data();
//                     setUserInfo({
//                         firstName: data.firstName || "",
//                         lastName: data.lastName || "",
//                         role: data.role || "",
//                         profileImage: data.profileImage || "",
//                     });
//                 }
//             } catch (err) {
//                 console.error("Error fetching user:", err);
//             }
//         });
//         return unsubscribe;
//     }, []);

//     useEffect(() => {
//         const user = auth.currentUser;
//         if (!user) return;

//         const q = query(
//             collection(db, "notifications"),
//             where("clientUid", "==", user.uid)
//         );

//         return onSnapshot(q, (snap) => {
//             setNotifications(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//         });
//     }, []);

//     const pending = notifications.filter((n) => !n.read).length;

//     async function acceptNotif(item) {
//         await updateDoc(doc(db, "notifications", item.id), { read: true });

//         navigate("/chat", {
//             state: {
//                 currentUid: auth.currentUser.uid,
//                 otherUid: item.freelancerId,
//                 otherName: item.freelancerName,
//                 otherImage: item.freelancerImage,
//                 initialMessage: `Your application for ${item.jobTitle} accepted!`,
//             },
//         });
//     }

//     async function declineNotif(item) {
//         await deleteDoc(doc(db, "notifications", item.id));
//     }

//     // ================= JOB FETCH ==================
//     useEffect(() => {
//         const col1 = collection(db, "services");
//         const col2 = collection(db, "service_24h");

//         const unsub1 = onSnapshot(
//             query(col1, orderBy("createdAt", "desc")),
//             (snap) => {
//                 const data = snap.docs.map((d) => ({
//                     _id: d.id,
//                     ...d.data(),
//                     _source: "services",
//                 }));
//                 setJobs((prev) => mergeJobs(prev, data));
//             }
//         );

//         const unsub2 = onSnapshot(
//             query(col2, orderBy("createdAt", "desc")),
//             (snap) => {
//                 const data = snap.docs.map((d) => ({
//                     _id: d.id,
//                     ...d.data(),
//                     _source: "service_24h",
//                 }));
//                 setJobs((prev) => mergeJobs(prev, data));
//             }
//         );

//         return () => {
//             unsub1();
//             unsub2();
//         };
//     }, []);

//     function mergeJobs(prev, incoming) {
//         const map = new Map();
//         for (const p of prev) map.set(p._id + "::" + (p._source || ""), p);
//         for (const n of incoming) map.set(n._id + "::" + (n._source || ""), n);
//         return Array.from(map.values());
//     }

//     // ================= AUTOCOMPLETE ==================
//     useEffect(() => {
//         const q = searchText.trim().toLowerCase();
//         if (!q) return setSuggestions([]);

//         const setS = new Set();
//         for (const job of jobs) {
//             if (job.title?.toLowerCase().includes(q)) setS.add(job.title);
//             if (Array.isArray(job.skills)) {
//                 for (const s of job.skills) {
//                     if (String(s).toLowerCase().includes(q)) setS.add(s);
//                 }
//             }
//         }
//         setSuggestions(Array.from(setS).slice(0, 6));
//     }, [searchText, jobs]);

//     // ================= FILTER ==================
//     const filteredJobs = useMemo(() => {
//         const q = searchText.trim().toLowerCase();

//         return jobs
//             .filter((j) => {
//                 const t = (j.title || "").toLowerCase();
//                 const d = (j.description || "").toLowerCase();
//                 const skills = Array.isArray(j.skills)
//                     ? j.skills.map((s) => String(s).toLowerCase())
//                     : [];
//                 return (
//                     !q ||
//                     t.includes(q) ||
//                     d.includes(q) ||
//                     skills.some((s) => s.includes(q))
//                 );
//             })
//             .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
//     }, [jobs, searchText]);

//     // ================= OPEN JOB ==================
//     async function openJob(job) {
//         if (!job?._id) return;

//         const collectionName =
//             job._source === "service_24h" || "services";

//         try {
//             await setDoc(
//                 doc(db, collectionName, job._id),
//                 {
//                     views: increment(1),
//                 },
//                 { merge: true }
//             );
//         } catch (err) {
//             console.error("Error updating views:", err);
//         }
//         if (job._source === "service_24h")
//             navigate(`/client-dashbroad2/service-24h/${job._id}`);
//         else navigate(`/client-dashbroad2/service/${job._id}`);
//     }

//     function toggleSaveJob(id) {
//         setSavedJobs((prev) => {
//             const ns = new Set(prev);
//             if (ns.has(id)) ns.delete(id);
//             else ns.add(id);
//             return ns;
//         });
//     }

//     // ======================================================
//     // UI
//     // ======================================================
//     return (
//         <div className="fh-page rubik-font">
//             <div className="fh-container">
//                 {/* HEADER */}
//                 <header className="fh-header">
//                     <div className="fh-header-left">
//                         <h1 className="fh-title">
//                             Welcome,
//                             <div>{userInfo.firstName || "Huzzlers"}</div>
//                         </h1>
//                         <div></div>
//                     </div>

//                     <div className="fh-header-right">
//                         <button className="icon-btn" onClick={() => navigate("/client-dashbroad2/messages")}>
//                             <FiMessageCircle />
//                         </button>

//                         <button className="icon-btn" onClick={() => setNotifOpen(true)}>
//                             <FiBell />
//                             {pending > 0 && (
//                                 <span
//                                     style={{
//                                         width: 8,
//                                         height: 8,
//                                         borderRadius: "50%",
//                                         background: "red",
//                                         position: "absolute",
//                                         top: 6,
//                                         right: 5,
//                                     }}
//                                 ></span>
//                             )}
//                         </button>

//                         <div className="fh-avatar">
//                             <Link to={"/client-dashbroad2/CompanyProfileScreen"}>
//                                 <img
//                                     src={
//                                         userProfile?.profileImage || profile
//                                     }
//                                     alt="Profile"
//                                 />
//                             </Link>
//                         </div>

//                     </div>

//                     {/* SEARCH */}
//                     <div className="fh-search-row" ref={searchRef}>
//                         <div className="fh-search fh-search-small">
//                             <FiSearch className="search-icon" />
//                             <input
//                                 className="search-input"
//                                 placeholder="Search"
//                                 value={searchText}
//                                 onChange={(e) => setSearchText(e.target.value)}

//                             />
//                             {searchText && (
//                                 <button className="clear-btn" onClick={() => setSearchText("")}
//                                 >
//                                     ✕
//                                 </button>
//                             )}
//                         </div>

//                         {suggestions.length > 0 && (
//                             <div className="autocomplete-list">
//                                 {suggestions.map((s, i) => (
//                                     <div
//                                         key={i}
//                                         className="autocomplete-item"
//                                         onClick={() => {
//                                             setSearchText(s);
//                                             setSuggestions([]);
//                                         }}
//                                     >
//                                         {s}
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </header>



//                 {/* ================= MAIN ================= */}
//                 <main className="fh-main">
//                     {/* HERO */}
//                     <section className="fh-hero">
//                         <div
//                             className="fh-hero-card primary"
//                             onClick={() => navigate("/client-dashbroad2/clientcategories")}
//                         >
//                             <img src={browseImg1} className="hero-img img-1" />
//                             <img src={browseImg2} className="hero-img img-2" />
//                             <div>
//                                 <h3>Browse All Projects</h3>
//                                 <p>Explore verified professionals</p>
//                             </div>
//                             <div className="hero-right">
//                                 <img src={arrow} className="arrow" width={25} />
//                             </div>
//                         </div>

//                         <div
//                             className="fh-hero-card secondary"
//                             onClick={() => navigate("/client-dashbroad2/AddJobScreen")}
//                         >
//                             <img src={worksImg1} className="hero-img img-3" />
//                             <img src={worksImg2} className="hero-img img-4" />
//                             <div>
//                                 <h4>Job proposal</h4>
//                                 <p>Find the right freelancers</p>
//                             </div>
//                             <div className="hero-right">
//                                 <img src={arrow} className="arrow" width={25} />
//                             </div>
//                         </div>
//                     </section>

//                     {/* ================= CATEGORY SCROLL ================= */}
//                     <section className="category-scroll-wrapper">
//                         {categories.map((cat, i) => (
//                             <div
//                                 key={i}
//                                 className="category-card-img"
//                                 onClick={() =>
//                                     navigate("/client-dashbroad2/clientcategories", {
//                                         state: { category: cat },
//                                     })
//                                 }
//                             >
//                                 {/* background image */}
//                                 <img src={Categories} alt={cat} className="category-bg-img" />

//                                 {/* overlay */}
//                                 <div className="category-overlay">
//                                     <span className="category-title">{cat}</span>
//                                 </div>
//                             </div>
//                         ))}
//                     </section>



//                     {/* ================= JOB LIST ================= */}
//                     <section className="fh-section">
//                         <div className="section-header">
//                             <h2 style={{ color: "#000" }}>Based On Your Industry, Here are profile to explore </h2>
//                         </div>

//                         <div className="jobs-list">
//                             {filteredJobs.map((job) => (
//                      <article key={job._id} className="job-card" onClick={() => openJob(job)}>
//   <div className="job-card-top">
//     <div>
//       <h3 className="job-title">{job.title}</h3>
//       <div className="job-sub">{job.category || "Service"}</div>
//     </div>
//     <div className="job-budget-wrapper">
//       <div className="job-budget">₹{job.budget_from || job.budget} - {job.budget_to || job.budget}</div>
//       <button
//         className={`save-btn ${savedJobs.has(job._id) ? "saved" : ""}`}
//         onClick={(e) => {
//           e.stopPropagation();
//           toggleSaveJob(job._id);
//         }}
//       >
//         {savedJobs.has(job._id) ? <BsBookmarkFill size={18}/> : <FiBookmark />}
//       </button>
//     </div>
//   </div>

//   <div className="job-skills">
//     {(job.skills || []).slice(0, 3).map((skill, i) => (
//       <span key={i} className="skill-chip">{skill}</span>
//     ))}
//   </div>

//   <p className="job-desc">
//     {job.description?.slice(0, 180)}
//     {job.description?.length > 180 ? "..." : ""}
//   </p>

//   <div className="job-meta">
//     <div className="job-stats">
//       <div className="views">
//         <FiEye /> <span>{job.views || 0} views</span>
//       </div>
//       <div className="created"><TimerIcon size={16}/>{timeAgo(job.createdAt)}</div>
//       {job._source === "service_24h" && <div className="created"> 24 Hours</div>}
//     </div>
//   </div>
// </article>

//                             ))}
//                         </div>
//                     </section>
//                 </main>

//                 {/* FAB */}
//                 <button className="fh-fab" onClick={() => navigate("/client-dashbroad2/PostJob")}>
//                     <FiPlus />
//                 </button>
//             </div>

//             {/* ================= NOTIFICATION POPUP ================= */}
//             {notifOpen && (
//                 <div
//                     style={{
//                         position: "fixed",
//                         inset: 0,
//                         background: "rgba(0,0,0,0.3)",
//                         backdropFilter: "blur(3px)",
//                         display: "flex",
//                         justifyContent: "center",
//                         alignItems: "center",
//                         zIndex: 9999,
//                     }}
//                     onClick={(e) => {
//                         if (e.target === e.currentTarget) setNotifOpen(false);
//                     }}
//                 >
//                     <div
//                         style={{
//                             width: "90%",
//                             maxWidth: 420,
//                             background: "#fff",
//                             padding: 20,
//                             borderRadius: 16,
//                             maxHeight: "80vh",
//                             overflowY: "auto",
//                         }}
//                     >
//                         <h3 style={{ marginBottom: 15 }}>Notifications</h3>

//                         {notifications.length === 0 && (
//                             <div style={{ padding: 20, textAlign: "center" }}>
//                                 No notifications
//                             </div>
//                         )}

//                         {notifications.map((item, i) => (
//                             <div
//                                 key={i}
//                                 style={{
//                                     display: "flex",
//                                     alignItems: "center",
//                                     marginBottom: 15,
//                                     background: "#f7f7f7",
//                                     padding: 10,
//                                     borderRadius: 10,
//                                 }}
//                             >
//                                 <img
//                                     src={item.freelancerImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
//                                     width={48}
//                                     height={48}
//                                     style={{ borderRadius: "50%", marginRight: 10 }}
//                                 />

//                                 <div style={{ flex: 1 }}>
//                                     <div style={{ fontWeight: 600 }}>{item.freelancerName}</div>
//                                     <div>applied for {item.jobTitle}</div>
//                                 </div>

//                                 {!item.read ? (
//                                     <>
//                                         <button
//                                             onClick={() => acceptNotif(item)}
//                                             style={{ marginRight: 8 }}
//                                         >
//                                             Accept
//                                         </button>
//                                         <button onClick={() => declineNotif(item)}>Decline</button>
//                                     </>
//                                 ) : (
//                                     <button onClick={() => acceptNotif(item)}>Chat</button>
//                                 )}
//                             </div>
//                         ))}

//                         <button
//                             style={{
//                                 marginTop: 10,
//                                 width: "100%",
//                                 padding: 10,
//                                 borderRadius: 10,
//                                 background: "#000",
//                                 color: "#fff",
//                             }}
//                             onClick={() => setNotifOpen(false)}
//                         >
//                             Close
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* ================= CATEGORY CSS ================= */}
//             <style>{`
// /* ================= CATEGORY SCROLL ================= */
// :root {
//   --search-height: 42px;
// }

// .category-scroll-wrapper {
//   display: flex;
//   gap: 14px;
//   overflow-x: auto;
//   padding: 14px 6px;
//   scrollbar-width: none;
// }

// .category-scroll-wrapper::-webkit-scrollbar {
//   display: none;
// }

// /* CARD */
// .category-card-img {
//   position: relative;
//   flex: 0 0 auto;
//   min-width: 212px;
//   height: 136px;
//   border-radius: 16px;
//   overflow: hidden;
//   cursor: pointer;
// }

// /* IMAGE */
// .category-bg-img {
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
// }

// /* DARK PURPLE OVERLAY */
// .category-card-img::after {
//   content: "";
//   position: absolute;
//   inset: 0;
//   background: linear-gradient(
//     135deg,

//   );
// }

// /* TEXT OVERLAY */
// .category-overlay {
//   position: absolute;
//   inset: 0;
//   z-index: 2;
//   padding: 14px;

//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   gap: 6px;

//   color: #fff;
// }

// /* STAR ICON */
// .category-star {
//   font-size: 16px;
//   opacity: 0.9;
// }

// /* TITLE */
// .category-title {
//   font-size: 14px;
//   font-weight: 600;
//   line-height: 1.2;
// }

// /* MOBILE */
// @media (max-width: 768px) {
//   .category-card-img {
//     min-width: 160px;
//     height: 85px;
//   }

//   .category-title {
//     font-size: 13px;
//   }
// }


//           /* ================= HEADER RIGHT ICONS ================= */

// .fh-header-right {
//   display: flex;
//   align-items: center;
//   gap: 16px; /* spacing between 3 icons */
//   position: relative;
// }

// /* ICON BUTTONS */
// .icon-btn {
//   width: 42px;
//   height: 42px;
//   border-radius: 50%;
//   border: none;
//   background: #f3f3f3;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   cursor: pointer;
//   position: relative;
//   font-size: 20px;
// }

// .icon-btn:hover {
//   background: #e5e5e5;
// }

// /* NOTIFICATION DOT */
// .notif-btn {
//   position: relative;
// }

// .notif-dot {
//   width: 8px;
//   height: 8px;
//   background: red;
//   border-radius: 50%;
//   position: absolute;
//   top: 8px;
//   right: 8px;
// }

// /* PROFILE AVATAR */
// .fh-avatar {
//   width: 42px;
//   height: 42px;
//   border-radius: 50%;
//   overflow: hidden;
//   cursor: pointer;

// }

// .fh-avatar img {
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
// }/* ================= SEARCH BAR ================= */

// .fh-search-row {
//   width: 100%;
//   display: flex;
//   justify-content: center;
//   margin-top: 0px;
// }

// .fh-search {
//   width: 420px; /* Desktop width */
//   height: var(--search-height);
//   display: flex;
//   align-items: center;
//   gap: 10px;
//   background: #f3f3f3;
//   padding: 0 14px;
//   border-radius: 999px;
// }

// .search-icon {
//   font-size: 18px;
//   color: #555;
//   flex-shrink: 0;
//    margin-top:-4px;
// }

// .search-input {
//   flex: 1;
//   height: 100%;          /* 🔥 fills parent height */
//   border: none;
//   outline: none;
//   background: transparent;
//   font-size: 15px;
//   line-height: normal;   /* ❗ remove line-height hacks */
// padding:0px 0px 0px 0px;
// width:100%;
// }

// .clear-btn {
//   background: none;
//   border: none;
//   cursor: pointer;
//   font-size: 14px;
// }

// @media (max-width: 768px) {
//   .fh-search {
//     width: 100%;
//     height: var(--search-height); /* ✅ SAME height */
//   }

//   .search-icon {
//     font-size: 16px;
//     margin-top:-4px;

//   }

//   .search-input {
//     font-size: 14px;
//     height:15px;


//   }

//   .clear-btn {
//     font-size: 12px;
//   }
// }



// .save-btn {
//   background: none;
//   border: none;
//   cursor: pointer;
//   font-size: 20px;
//   color: #666;
//   transition: color 0.3s ease, transform 0.2s ease;
// }

// .save-btn.saved {
//   color: #000;

// }

// .job-card {
//   background: var(--card-bg);
//   border-radius: 14px;
//   padding: 18px;
//   border: 1px solid rgba(0,0,0,0.03);
//   transition: transform 0.18s ease, box-shadow 0.18s ease;
//   cursor: pointer;
//   max-width: 100%;
//   width: 100%;
//   box-shadow: 0 4px 12px rgba(0,0,0,0.08), 
//               0 2px 6px rgba(0,0,0,0.04);
// }
// .job-card:hover {
//   transform: translateY(-6px);
//   box-shadow: 0 18px 40px rgba(2,6,23,0.08);
// }
// .job-card-top {
//   display: flex;
//   justify-content: space-between;
//   gap: 12px;
//   align-items: flex-start;
// }
// .job-title {
//   margin: 0;
//   font-size: 18px;
//   font-weight: 400;
// }
// .job-sub {
//   font-size: 13px;
//   color: var(--muted);
//   margin-top: 4px;
// }
// .job-skills {
//   display: flex;
//   gap: 8px;
//   flex-wrap: wrap;
//   margin-top:10px;
// }
// .skill-chip {
//   background: rgba(255, 240, 133, 0.7);
//   padding: 6px 10px;
//   border-radius: 999px;
//   font-size: 12px;
//   color: #000;
//   font-weight: 400;
//   border: 1px solid rgba(124,58,237,0.07);
// }
// .job-meta {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   gap: 12px;
//   margin-top: 6px;
// }
//   .job-title{

//   margin-bottom:10px;
//   }


//         `}</style>

//         </div>
//     );

// }





import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Categories from "../assets/categories1.png";
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
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../firbase/Firebase";
import { BsBookmarkFill } from "react-icons/bs";


// ====== ASSETS ======
import browseImg1 from "../assets/Container.png";
import browseImg2 from "../assets/wave.png";
import worksImg1 from "../assets/file.png";
import worksImg2 from "../assets/yellowwave.png";
import arrow from "../assets/arrow.png";
import profile from "../assets/profile.png";

// ====== ICONS ======
import {
  FiSearch,
  FiMessageCircle,
  FiBell,
  FiPlus,
  FiBookmark,
  FiEye,
} from "react-icons/fi";
import { onAuthStateChanged } from "firebase/auth";
import { Clock, TimerIcon } from "lucide-react";

import "./clienthomecss.css"
// import FreelanceHome from "../Firebasejobs/ClientHome.css";

// ====== CATEGORY DATA ======
const categories = [
  "Graphics & Design",
  "Programming & Tech",
  "Digital Marketing",
  "Writing & Translation",
  "Video & Animation",
  "Music & Audio",
  "AI Services",
  "Data",
  "Business",
  "Finance",
  "Photography",
  "Lifestyle",
  "Consulting",
  "Personal Growth & Hobbies",
];


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
  const [userProfile, setUserProfile] = useState(null);

  const searchRef = useRef(null);

  // ================= NOTIFICATIONS ==================
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);

  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    role: "",
    profileImage: "",
  });

  const fetchUserProfile = async (uid) => {
    try {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        setUserProfile(snap.data());
      } else {
        console.log("User profile not found");
      }
    } catch (e) {
      console.error("Profile fetch error:", e);
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    fetchUserProfile(user.uid);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) return;
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          setUserInfo({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            role: data.role || "",
            profileImage: data.profileImage || "",
          });
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    });
    return unsubscribe;
  }, []);

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
  async function openJob(job) {
    if (!job?._id) return;

    const collectionName =
      job._source === "service_24h" || "services";

    try {
      await setDoc(
        doc(db, collectionName, job._id),
        {
          views: increment(1),
        },
        { merge: true }
      );
    } catch (err) {
      console.error("Error updating views:", err);
    }
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
    <>

      <div id="fh-page" style={{ marginLeft: "-20px" }} className="fh-page rubik-font">
        <div id="fh-containers" className="fh-container" >
          {/* HEADER */}
          <header className="fh-header">
            <div id="fh-header-left" className="fh-header-left">
              <div id="fh-welcome" className="fh-welcome">
                <h1 id="fh-title" className="fh-title">
                  Welcome,<div>{userInfo.firstName || "Huzzlers"}</div>
                </h1>
                <div id="fh-title" className="fh-subtitle">
                  Find the right talent for your Project
                </div>
              </div>
              <div></div>
            </div>

            <div id="fh-header-right" className="fh-header-right">

              <button className="icon-btn" onClick={() => navigate("/client-dashbroad2/messages")}>
                <FiMessageCircle />
              </button>

              <button className="icon-btn" onClick={() => setNotifOpen(true)}>
                <FiBell />
                {pending > 0 && (
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "red",
                      position: "absolute",
                      top: 6,
                      right: 5,
                    }}
                  ></span>
                )}
              </button>

              <div className="fh-avatar">
                <Link to={"/client-dashbroad2/CompanyProfileScreen"}>
                  <img
                    src={
                      userProfile?.profileImage || profile
                    }
                    alt="Profile"
                  />
                </Link>
              </div>

            </div>

            {/* SEARCH */}
            <div className="fh-search-row" ref={searchRef}>
              <div id="fh-search" className="fh-search fh-search-small">
                <FiSearch className="search-icon" />
                <input
                  id="search-input"
                  className="search-input"
                  placeholder="Search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}

                />
                {searchText && (
                  <button className="clear-btn" onClick={() => setSearchText("")}
                  >
                    ✕
                  </button>
                )}
              </div>

              {suggestions.length > 0 && (
                <div className="autocomplete-list">
                  {suggestions.map((s, i) => (
                    <div
                      className="autocomplete-item"
                      onMouseDown={(e) => {
                        e.preventDefault();
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




          <main className="fh-main">

            <section className="fh-hero">

              <div
                id="fh-hero-card"
                className="fh-hero-card primary"
                onClick={() => navigate("/client-dashbroad2/clientcategories")}
              >
                <img src={browseImg1} id="hero-img-brower" className="hero-img img-1" style={{
                  width: "50px", paddingTop: "20px"
                }} />
                <img src={browseImg2} className="hero-img img-2" style={{ width: "300px", height: "200px", marginRight: "150px" }} />
                <div id="browertitle">
                  <h3> <span>Browse Freelancer</span></h3>
                  <p><span>Explore verified professionals</span></p>
                </div>
                <div className="hero-right">
                  <img src={arrow} className="arrow" width={25} />
                </div>
              </div>

              <div
                id="fh-hero-card"
                className="fh-hero-card secondary"
                onClick={() => navigate("/client-dashbroad2/AddJobScreen")}
              >
                <img src={worksImg1} id="hero-img" className="hero-img img-3" style={{ width: "50px", paddingTop: "20px" }} />
                <img src={worksImg2} className="hero-img img-4" style={{ width: "300px", height: "200px", marginRight: "150px" }} />
                <div id="browertitle" className="jobtitle">
                  <h3>Job Proposal</h3>
                  <p>Find the right freelancers for your project</p>
                </div>
                <div className="hero-right">
                  <img src={arrow} className="arrow" width={25} />
                </div>
              </div>


            </section>

            <section id="category-scroll-wrapper" className="category-scroll-wrapper">
              {categories.map((cat, i) => (
                <div
                  key={i}

                  className="category-card-img"
                  onClick={() =>
                    navigate("/client-dashbroad2/clientcategories", {
                      state: { category: cat },
                    })
                  }
                >
                  {/* background image */}
                  <img src={Categories} alt={cat} className="category-bg-img" />

                  {/* overlay */}
                  <div className="category-overlay">
                    <span id="category-title" className="category-title">{cat}</span>
                  </div>
                </div>
              ))}
            </section>




            <section className="fh-section">
              <div className="section-header">
                <h2 style={{ color: "#000000c7", marginLeft: "10px", fontSize: 20, fontWeight: 400 }}>Based On Your Industry, Here are profile to explore </h2>
              </div>

              <div id="jobs-list" className="jobs-list">
                {filteredJobs.map((job) => (
                  <article key={job._id} className="job-card" onClick={() => openJob(job)}>

                    {job._source === "service_24h" && (
                      <div className="badge-24">24 Hours</div>
                    )}

                    <div className="job-card-top">
                      <div>
                        <h3 className="job-title">{job.title}</h3>
                        <div className="job-sub">{job.category || "Service"}</div>
                      </div>
                      <div className="job-budget-wrapper">

                        <button
                          className={`save-btn ${savedJobs.has(job._id) ? "saved" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveJob(job._id);
                          }}
                        >
                          {savedJobs.has(job._id) ? <BsBookmarkFill size={18} /> : <FiBookmark />}
                        </button>
                      </div>
                    </div>

                    <p className="skill-required">Skills</p>
                    <div className="job-skills">

                      {(job.skills || []).slice(0, 3).map((skill, i) => (
                        <span key={i} className="skill-chip">{skill}</span>
                      ))}
                    </div>

                    {/* <p className="job-desc">
                    {job.description?.slice(0, 180)}
                    {job.description?.length > 180 ? "..." : ""}
                  </p> */}

                    <div id="job-meta" className="job-meta">
                      <div className="job-stats">
                        <div className="views">
                          <FiEye /> <span>{job.views || 0} views</span>
                        </div>
                        <div className="created"><Clock size={16} />{timeAgo(job.createdAt)}</div>

                      </div>

                      <div id="job-budget" className="job-budget">₹{job.budget_from || job.budget} - {job.budget_to || job.budget}</div>

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
              background: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(3px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
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
                <div style={{ padding: 20, textAlign: "center" }}>
                  No notifications
                </div>
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
                    src={item.freelancerImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
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
                      <button
                        onClick={() => acceptNotif(item)}
                        style={{ marginRight: 8 }}
                      >
                        Accept
                      </button>
                      <button onClick={() => declineNotif(item)}>Decline</button>
                    </>
                  ) : (
                    <button onClick={() => acceptNotif(item)}>Chat</button>
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


        <style>{`
/* ================= CATEGORY SCROLL ================= */
:root {
  --search-height: 42px;
}
 
.category-scroll-wrapper {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  padding: 14px 6px;

  /* hide scrollbar */
  scrollbar-width: none; /* Firefox */
}

.category-scroll-wrapper::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}
@media (min-width: 1024px) {
  .category-scroll-wrapper {
    scrollbar-width: auto; /* Firefox */
  }

  .category-scroll-wrapper::-webkit-scrollbar {
    display: block;
    height: 8px;
  }

  .category-scroll-wrapper::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 10px;
  }

  .category-scroll-wrapper::-webkit-scrollbar-track {
    background: transparent;
  }
}

/* CARD */
.category-card-img {
  position: relative;
  flex: 0 0 auto;
  min-width: 212px;
  height: 136px;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
}

/* IMAGE */
.category-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* DARK PURPLE OVERLAY */
.category-card-img::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
 
  );
}

/* TEXT OVERLAY */
.category-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  padding: 14px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;

  color: #fff;
}

/* STAR ICON */
.category-star {
  font-size: 16px;
  opacity: 0.9;
}

/* TITLE */
.category-title {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
}

/* MOBILE */
@media (max-width: 768px) {
  .category-card-img {
    min-width: 160px;
    height: 85px;
  }

  .category-title {
    font-size: 13px;
  }
}

.job-card {
  position: relative; /* REQUIRED for badge positioning */
}

.badge-24 {
  position: absolute;
  top: 1px;
  right: 110px;

  background: #FFDADA;
  color: #E7000B;
 

  padding: 4px 10px;
  border-radius: 8px;

  box-shadow: 0 4px 10px rgba(229,57,53,0.4);
  z-index: 5;







  font-family: Rubik;
font-weight: 400;
font-style: Regular;
font-size: 15px;
leading-trim: NONE;
line-height: 140%;
letter-spacing: 0%;

}

          /* ================= HEADER RIGHT ICONS ================= */

.fh-header-right {
  display: flex;
  align-items: center;
  gap: 16px; /* spacing between 3 icons */
  position: relative;
}

/* ICON BUTTONS */
.icon-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  background: #f3f3f3;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  font-size: 20px;

}

.icon-btn:hover {
  background: #e5e5e5;
}

/* NOTIFICATION DOT */
.notif-btn {
  position: relative;
}

.notif-dot {
  width: 8px;
  height: 8px;
  background: red;
  border-radius: 50%;
  position: absolute;
  top: 8px;
  right: 8px;
}

/* PROFILE AVATAR */
.fh-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
 
}

.fh-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}/* ================= SEARCH BAR ================= */

.fh-search-row {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 0px;
}

.fh-search {
  width: 420px; /* Desktop width */
  height: var(--search-height);
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f3f3f3;
  padding: 0 14px;
  border-radius: 999px;
}

.search-icon {
  font-size: 18px;
  color: #555;
  flex-shrink: 0;
   margin-top:-4px;
}

.search-input {
  flex: 1;
  height: 100%;          /* 🔥 fills parent height */
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  line-height: normal;   /* ❗ remove line-height hacks */
padding:0px 0px 0px 0px;
width:100%;
}

.clear-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

@media (max-width: 768px) {
  .fh-search {
    width: 100%;
    height: var(--search-height); /* ✅ SAME height */
  }

  .search-icon {
    font-size: 16px;
    margin-top:-4px;

  }

  .search-input {
    font-size: 14px;
    height:15px;
   

  }

  .clear-btn {
    font-size: 12px;
  }
}

@media (min-width: 1024px) {
.fh-container{
  margin-top:20px;
  margin-left:20px;
            }}



.save-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #666;
  transition: color 0.3s ease, transform 0.2s ease;
}

.save-btn.saved {
  color: #000;
 
}

.job-card {
  background: var(--card-bg);
  border-radius: 14px;
  padding: 18px;
  border: 1px solid rgba(0,0,0,0.03);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  cursor: pointer;
  max-width: 100%;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08),
              0 2px 6px rgba(0,0,0,0.04);
}
.job-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 40px rgba(2,6,23,0.08);
}
.job-card-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}
.job-title {
  margin: 0;
  font-size: 18px;
  font-weight: 400;
}
.job-sub {
  font-size: 13px;
  color: var(--muted);
  margin-top: 4px;
}
.job-skills {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top:10px;
}
.skill-chip {
  background: rgba(255, 240, 133, 0.7);
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  color: #000;
  font-weight: 400;
  border: 1px solid rgba(124,58,237,0.07);
}
.job-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 6px;
}
  .job-title{
 
  margin-bottom:10px;
  }
  .fh-search-row {
  position: relative; /* 🔥 REQUIRED */
}

/* AUTOCOMPLETE DROPDOWN */
.autocomplete-list {
  position: absolute;
  top: calc(var(--search-height) + 8px); /* directly below search bar */
  left: 50%;
  transform: translateX(-50%);

  width: 420px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.12);

  z-index: 999;
  overflow: hidden;
}

/* EACH SUGGESTION */
.autocomplete-item {
  padding: 12px 16px;
  font-size: 14px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.autocomplete-item:last-child {
  border-bottom: none;
}

.autocomplete-item:hover {
  background: #f5f5f5;
}

/* MOBILE */
@media (max-width: 768px) {
  .autocomplete-list {
    width: 100%;
    left: 0;
    transform: none;
  }
}

 

        `}</style>

      </div>


    </>
  );

}