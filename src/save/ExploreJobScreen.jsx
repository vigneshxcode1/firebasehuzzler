// import React, { useEffect, useState, useMemo } from "react";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   updateDoc,
//   arrayUnion,
//   arrayRemove,
//   getDoc,
// } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth, db } from "../firbase/Firebase";
// import { Link, useNavigate } from "react-router-dom";

// import backarrow from "../assets/icons/backarrow.png";
// import message from "../assets/icons/message.png";
// import notification from "../assets/notification.png";
// import profile from "../assets/icons/profile.png";
// import save from "../assets/icons/save.png";
// import saved from "../assets/icons/saved.png";
// import search from "../assets/icons/search.png";
// import { MdAccessTime } from "react-icons/md";
// import { FaEye } from "react-icons/fa";

// /* ---------------- HELPERS ---------------- */

// const formatAmount = (amount) => {
//   if (!amount) return "0";
//   const n = Number(amount);
//   if (n < 1000) return n;
//   if (n < 1000000) return (n / 1000).toFixed(1) + "K";
//   return (n / 1000000).toFixed(1) + "M";
// };

// const timeAgo = (date) => {
//   if (!date) return "";
//   const diff = Date.now() - date.getTime();
//   const mins = diff / 60000;
//   if (mins < 1) return "just now";
//   if (mins < 60) return `${Math.floor(mins)} min ago`;
//   const hrs = mins / 60;
//   if (hrs < 24) return `${Math.floor(hrs)} hr ago`;
//   const days = hrs / 24;
//   return `${Math.floor(days)} day${days > 1 ? "s" : ""} ago`;
// };

// const parseCreatedAt = (v) => {
//   if (!v) return new Date();
//   if (v instanceof Date) return v;
//   if (typeof v?.toDate === "function") return v.toDate();
//   return new Date(v);
// };

// /* ---------------- COMPONENT ---------------- */

// export default function SavedJobsScreen() {
//   const [currentUser, setCurrentUser] = useState(auth.currentUser);
//   const [worksJobs, setWorksJobs] = useState([]);
//   const [jobs24h, setJobs24h] = useState([]);
//   const [savedIds, setSavedIds] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [userProfile, setUserProfile] = useState(null);

//   const navigate = useNavigate();

//   /* ⭐ SIDEBAR STATE */
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   /* ⭐ RESPONSIVE FLAG */
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   useEffect(() => {
//     const resize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", resize);
//     return () => window.removeEventListener("resize", resize);
//   }, []);

//   /* ⭐ SIDEBAR TOGGLE LISTENER */
//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   /* PROFILE */
//   useEffect(() => {
//     const u = auth.currentUser;
//     if (!u) return;
//     getDoc(doc(db, "users", u.uid)).then((snap) => {
//       if (snap.exists()) setUserProfile(snap.data());
//     });
//   }, []);

//   useEffect(() => onAuthStateChanged(auth, (u) => setCurrentUser(u)), []);

//   /* JOBS */
//   useEffect(
//     () =>
//       onSnapshot(collection(db, "jobs"), (snap) =>
//         setWorksJobs(
//           snap.docs.map((d) => {
//             const x = d.data();
//             return {
//               id: d.id,
//               title: x.title,
//               description: x.description,
//               budget_from: x.budget_from,
//               budget_to: x.budget_to,
//               views: x.views,
//               skills: x.skills || [],
//               tools: x.tools || [],
//               created_at: parseCreatedAt(x.created_at),
//             };
//           })
//         )
//       ),
//     []
//   );

//   useEffect(
//     () =>
//       onSnapshot(collection(db, "jobs_24h"), (snap) =>
//         setJobs24h(
//           snap.docs.map((d) => {
//             const x = d.data();
//             return {
//               id: d.id,
//               title: x.title,
//               description: x.description,
//               budget: x.budget,
//               views: x.views,
//               skills: x.skills || [],
//               tools: x.tools || [],
//               created_at: parseCreatedAt(x.created_at),
//             };
//           })
//         )
//       ),
//     []
//   );

//   useEffect(() => {
//     if (!currentUser) return;
//     return onSnapshot(doc(db, "users", currentUser.uid), (snap) => {
//       setSavedIds(snap.data()?.favoriteJobs || []);
//     });
//   }, [currentUser]);

//   const savedCombined = useMemo(() => {
//     const a = worksJobs.filter((j) => savedIds.includes(j.id));
//     const b = jobs24h.filter((j) => savedIds.includes(j.id));
//     return [...a, ...b];
//   }, [worksJobs, jobs24h, savedIds]);

//   const filteredJobs = useMemo(() => {
//     if (!searchQuery.trim()) return savedCombined;
//     const q = searchQuery.toLowerCase();
//     return savedCombined.filter(
//       (j) =>
//         j.title?.toLowerCase().includes(q) ||
//         j.description?.toLowerCase().includes(q) ||
//         j.skills.join(" ").toLowerCase().includes(q) ||
//         j.tools.join(" ").toLowerCase().includes(q)
//     );
//   }, [savedCombined, searchQuery]);

//   const toggleSave = async (jobId) => {
//     if (!currentUser) return;
//     const ref = doc(db, "users", currentUser.uid);
//     await updateDoc(ref, {
//       favoriteJobs: savedIds.includes(jobId)
//         ? arrayRemove(jobId)
//         : arrayUnion(jobId),
//     });
//   };

//   const renderCard = (job) => {
//     const chips = [...job.skills, ...job.tools];

//     return (
//       <div
//         key={job.id}
//         style={{
//           ...styles.jobCard,
//           width: isMobile ? "100%" : "95%",
          
//         }}
//         onClick={() => navigate(`/freelance-dashboard/job-full/${job.id}`)}
//       >
//         <div style={styles.cardTop}>
//           <div style={{ flex: 1 }}>
//             <div style={styles.title}>{job.title}</div>
//           </div>

//           <div style={{ textAlign: "right" }}>
//             <div style={styles.budgetTop}>
//               {job.budget_from
//                 ? `₹${formatAmount(job.budget_from)} - ₹${formatAmount(
//                     job.budget_to
//                   )}`
//                 : `₹${formatAmount(job.budget)}`}
//             </div>

//             <img
//               src={savedIds.includes(job.id) ? save : saved}
//               style={styles.saveIcon}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 toggleSave(job.id);
//               }}
//             />
//           </div>
//         </div>

//         <div style={styles.skillsrequired}>Skills Required</div>

//         <div style={styles.chipsRow}>
//           {chips.slice(0, 3).map((c) => (
//             <span key={c} style={styles.chip}>{c}</span>
//           ))}
//           {chips.length > 3 && <span style={styles.chip}>+{chips.length - 3}</span>}
//         </div>

//         <div style={styles.desc}>{job.description}</div>

//         <div style={styles.meta}>
//           <FaEye size={14} /> {job.views} Impressions
//           <MdAccessTime size={14} style={styles.time} />{" "}
//           {timeAgo(job.created_at)}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div
//       className="freelance-wrapper"
//       style={{
//         marginTop:isMobile?"30px":"0px",
//         marginLeft: isMobile ? "0px" : collapsed ? "-100px" : "50px",
//         transition: "margin-left 0.25s ease",
//       width:"100%",
//       }}
//     >
//       <div
//         style={{
//           ...styles.root,
//           marginTop: isMobile ? "30px" : "0px",
//         }}
//       >
//         {/* HEADER */}
//         <div
//           style={{
//             ...styles.topRow,
//             flexWrap: isMobile ? "wrap" : "nowrap",
//           }}
//         >
          
//           <div style={styles.leftRow}>
//             <div style={styles.backbtn} onClick={() => navigate(-1)}>
//               <img src={backarrow} style={styles.backbtnimg} />
//             </div>
//             <h1>Saved</h1>
//           </div>

//           <div style={styles.rightIcons}>
//             <img src={message} style={styles.iconImg} />
//             <img src={notification} style={styles.iconImg} />
//             <Link to={"/client-dashbroad2/ClientProfile"}>
//               <img
//                 src={userProfile?.profileImage || profile}
//                 style={{ width: 34, height: 34, borderRadius: "50%" ,marginRight:isMobile?0:"90px"}}
//               />
//             </Link>
//           </div>
//         </div>

//         {/* SEARCH */}
//         <div
//           style={{
//             ...styles.searchBar,
//             width: isMobile ? "100%" : "95%",
//           }}
//         >
//           <img src={search} style={styles.searchIcon} />
//           <input
//             style={styles.searchInput}
//             placeholder="Search"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>

//         {filteredJobs.map((job) => renderCard(job))}

//         {/* FLOATING BTN */}
//         <div
//           style={{
//             ...styles.plusBtn,
//             right: isMobile ? 16 : 26,
//             bottom: isMobile ? 16 : 26,
//           }}
//         >
//           +
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ---------------- STYLES ---------------- */

// const styles = {
//   root: {
//     backgroundColor: "#FFFFFF",
//     minHeight: "100vh",
//     fontFamily: "'Rubik', sans-serif",
//     padding: "16px",
//       maxWidth: "1100px",   // control page width
//     margin: "0 auto", 
//   },
//   topRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//     width: "100%",
     
//   },
//   leftRow: { display: "flex", alignItems: "center", gap: 12 },
//   backbtn: {
//     width: 38,
//     height: 38,
//     borderRadius: 12,
//     border: "1px solid #ccc",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     background: "#fff",
//     cursor: "pointer",
//   },
//   backbtnimg: { width: 18 },
//   rightIcons: {
//     display: "flex",
//     gap: 14,
//     marginLeft: "auto",
//     alignItems: "center",
//   },
//   iconImg: { width: 30, cursor: "pointer", },
//   searchBar: {
//     height: 48,
//     borderRadius: 25,
//     backgroundColor: "#F3F3F3",
//     display: "flex",
//     alignItems: "center",
//     padding: "0 16px",
//     margin: "20px auto",
//     gap: 12,
//   },
//   searchIcon: { width: 20, opacity: 0.6 },
//   searchInput: {
//     border: "none",
//     outline: "none",
//     background: "transparent",
//     width: "100%",
//     fontSize: 15,
//     padding: "65px 0px 50px 0px",
//   },
//   jobCard: {
//     margin: "0 auto 16px",
//     borderRadius: 18,
//     background: "#fff",
//     border: "1px solid #ececec",
//     padding: 16,
//     boxShadow: "0 3px 6px rgba(0,0,0,0.07)",
//     cursor: "pointer",
//   },
//   title: { fontSize: 18, marginBottom: 6 },
//   budgetTop: { fontWeight: 600, fontSize: 15 },
//   saveIcon: { width: 20, cursor: "pointer", marginTop: 6 },
//   skillsrequired: { fontSize: 14, opacity: 0.7, marginTop: 10 },
//   chipsRow: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 },
//   chip: {
//     background: "rgba(255,240,133,.7)",
//     padding: "4px 10px",
//     borderRadius: 12,
//     fontSize: 12,
//   },
//   desc: { fontSize: 13, color: "#555", marginTop: 10 },
//   meta: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     fontSize: 12,
//     color: "#777",
//     marginTop: 10,
//   },
//   time: { marginLeft: 20 },
//   plusBtn: {
//     position: "fixed",
//     width: 58,
//     height: 58,
//     borderRadius: "50%",
//     background: "#8b5cf6",
//     color: "#fff",
//     fontSize: 34,
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//     cursor: "pointer",
//   },
// };





import React, { useEffect, useMemo, useState } from "react";
import JobFiltersFullScreen from "../pages/Freelancerpage/FreelancerFilter";
// import JobFiltersFullScreen from "./FreelancerFilter";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  arrayUnion,
  arrayRemove,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firbase/Firebase";

import search from "../assets/search.png";
import eye from "../assets/eye.png";
import clock from "../assets/clock.png";
import saved from "../assets/save.png";
import save from "../assets/save2.png";
import backarrow from "../assets/backarrow.png";
import message from "../assets/message.png"; // ✅ ADD THIS
import notification from "../assets/notification.png"; // ✅ ADD THIS
import profile from "../assets/profile.png"; // ✅ ADD THIS
import Filter from "../assets/Filter.png"; // ✅ ADD THIS
import sort from "../assets/sort.png"; // ✅ ADD THIS
import { useNavigate } from "react-router-dom";
// import "./ExploreFreelancer.responsive.css";


const JobSortOption = {
  BEST_MATCH: "bestMatch",
  NEWEST: "newest",
  AVAILABILITY: "availability",
};

const defaultFilters = {
  searchQuery: "",
  categories: [],
  skills: [],
  postingTime: "",
  budgetRange: { start: 0, end: 100000 },
  sortOption: JobSortOption.BEST_MATCH,
};

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
  const user = auth.currentUser; // ✅ FIXED

  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [userInfo, setUserInfo] = useState({}); // ✅ FIXED

  const [filters, setFilters] = useState(defaultFilters);
  const [selectedTab, setSelectedTab] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const [showSort, setShowSort] = useState(false);
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [notifications, setNotifications] = useState([]);
  const [notifCount, setNotifCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false); // ✅ FIXED

  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  console.log(jobs);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  // ✅ JOBS LISTENER
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
        createdAt: d.data().created_at?.toDate?.() || null,
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
        createdAt: d.data().created_at?.toDate?.() || null,
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

  // ✅ USER DATA LISTENER
  useEffect(() => {
    if (!uid) return;
    return onSnapshot(doc(db, "users", uid), (snap) => {
      const data = snap.data() || {};
      setSavedJobs(data.favoriteJobs || []);
      setUserSkills(data.skills || []);
      setUserInfo(data); // ✅ FIXED
    });
  }, [uid]);

  // ✅ UNREAD MESSAGES LISTENER
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "chats"),
      where("members", "array-contains", user.uid)
    );

    return onSnapshot(q, (snap) => {
      let count = 0;
      snap.forEach((d) => {
        const data = d.data();
        count += data.unread?.[user.uid] || 0;
      });
      setUnreadMsgCount(count);
    });
  }, [user]);

  // ✅ NOTIFICATIONS LISTENER
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      where("freelancerId", "==", user.uid)
    );

    return onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setNotifications(items);
      setNotifCount(items.filter((n) => !n.read).length);
    });
  }, [user]);

  // ✅ NOTIFICATION CLICK HANDLER
  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      await updateDoc(doc(db, "notifications", notif.id), { read: true });
    }

    setNotifOpen(false);

    if (notif.type === "job") {
      navigate(`/freelance-dashboard/job-full/${notif.jobId}`);
    }

    if (notif.type === "message") {
      navigate("/freelance-dashboard/freelancermessages", {
        state: { otherUid: notif.clientUid },
      });
    }
  };

  // ✅ FILTERED JOBS
  const filteredJobs = useMemo(() => {
    let result = jobs.filter((job) => {
      // Search query
      if (
        filters.searchQuery &&
        !job.title?.toLowerCase().includes(filters.searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Budget overlap logic
      const jobMin = Number(job.budget_from) || 0;
      const jobMax = Number(job.budget_to) || 0;
      const filterMin = filters.budgetRange.start;
      const filterMax = filters.budgetRange.end;

      if (jobMax < filterMin || jobMin > filterMax) return false;

      // Category filter
      if (
        filters.categories.length &&
        !filters.categories.includes(job.category)
      ) {
        return false;
      }

      // Skills filter
      if (
        filters.skills.length &&
        !filters.skills.some((s) => job.skills?.includes(s))
      ) {
        return false;
      }

      // Posting time filter
      if (filters.postingTime) {
        const postedAt = job.createdAt?.getTime?.() || 0;
        const now = Date.now();

        const daysMap = {
          "Posted Today": 1,
          "Last 3 Days": 3,
          "Last 7 Days": 7,
          "Last 30 Days": 30,
        };

        const limitDays = daysMap[filters.postingTime];
        if (limitDays) {
          const diffDays = (now - postedAt) / (1000 * 60 * 60 * 24);
          if (diffDays > limitDays) return false;
        }
      }

      // Tab filter
      if (selectedTab === 1 && !job.is24h) return false; // 24 Hours
      if (selectedTab === 2 && !savedJobs.includes(job.id)) return false; // Saved

      return true;
    });

    // Sort
    if (filters.sortOption === JobSortOption.BEST_MATCH) {
      result.sort((a, b) => matchScore(b, userSkills) - matchScore(a, userSkills));
    } else if (filters.sortOption === JobSortOption.NEWEST) {
      result.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    } else if (filters.sortOption === JobSortOption.AVAILABILITY) {
      result.sort((a, b) => (a.views || 0) - (b.views || 0));
    }

    return result;
  }, [jobs, filters, selectedTab, savedJobs, userSkills]);

  const toggleSave = async (e, jobId) => {
    e.stopPropagation(); // ✅ Prevent navigation
    if (!uid) return;
    await updateDoc(doc(db, "users", uid), {
      favoriteJobs: savedJobs.includes(jobId)
        ? arrayRemove(jobId)
        : arrayUnion(jobId),
    });
  };

  return (
    <div
      className="freelance-wrapper"
      style={{
        marginLeft: collapsed ? "140px" : "210px",
        transition: "margin-left 0.25s ease",
        overflowX: "hidden",
        maxWidth: "100vw",
        boxSizing: "border-box",
        marginTop: "60px",
        width: "80%",
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
        {/* ================= HEADER ================= */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              onClick={() => navigate(-1)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 14,
                border: "0.8px solid #E0E0E0",
                backgroundColor: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                // boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
                flexShrink: 0,
              }}
            >
              <img
                src={backarrow}
                alt="Back"
                style={{
                  width: 16,
                  height: 18,
                  objectFit: "contain",
                }}
              />
            </div>

            <div>
              <div style={{ fontSize: 32, fontWeight: 400 }}>
                Explore Freelancer
              </div>
            </div>
          </div>

          <div
            className="top-icons"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginRight: "20px",
              paddingRight: "20px",
            }}
          >
            <div
              className="top-icon"
              onClick={() =>
                navigate("/freelance-dashboard/freelancermessages")
              }
              style={{ position: "relative", cursor: "pointer" }}
            >
              <img src={message} alt="Messages" />
              {unreadMsgCount > 0 && (
                <span
                  className="dot"
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 8,
                    height: 8,
                    background: "red",
                    borderRadius: "50%",
                  }}
                />
              )}
            </div>

            <div
              className="top-icon"
              style={{ position: "relative", cursor: "pointer" }}
            >
              <img
                src={notification}
                onClick={() => setNotifOpen((p) => !p)}
                alt="Notifications"
              />
              {notifCount > 0 && (
                <span
                  className="dot"
                  style={{

                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 8,
                    height: 8,
                    background: "red",
                    borderRadius: "50%",
                  }}
                />
              )}
            </div>
{/* 
            <div
              className="top-icon"
              onClick={() => navigate("/freelance-dashboard/Profilebuilder")}
              style={{ cursor: "pointer", border: "none" }}
            >
              <img
                src={userInfo.profileImage || profile}
                alt="Profile"
              />
            </div> */}
          </div>
        </div>

        {/* ================= NOTIFICATION DROPDOWN ================= */}
        {notifOpen && (
          <div
            className="notif-dropdown"
            style={{
              position: "absolute",
              right: 60,
              top: 80,
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              padding: 12,
              width: 300,
              maxHeight: 400,
              overflowY: "auto",
              zIndex: 999,
            }}
          >
            {notifications.length === 0 && <p>No notifications</p>}

            {notifications.map((n) => (
              <div
                key={n.id}
                className={`notif-item ${!n.read ? "unread" : ""}`}
                onClick={() => handleNotificationClick(n)}
                style={{
                  padding: 12,
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                  background: !n.read ? "#f0f0f0" : "transparent",
                }}
              >
                <div className="notif-title" style={{ fontWeight: 600 }}>
                  {n.title}
                </div>
                <div className="notif-body" style={{ fontSize: 13, marginTop: 4 }}>
                  {n.body}
                </div>
                <div
                  className="notif-time"
                  style={{ fontSize: 11, color: "#999", marginTop: 4 }}
                >
                  {timeAgo(n.timestamp?.toDate?.())}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= SEARCH + FILTER ================= */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "96%",
            marginLeft: isMobile ? "10px" : "0px",
            marginTop: "20px",
          }}
        >
          {/* SEARCH BOX */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flex: 1,
              padding: "clamp(9px, 3vw, 10px) 14px",
              borderRadius: 12,
              border: "1px solid #ddd",
              background: "#fff",
              height: "50px"
            }}
          >
            <img
              src={search}
              alt="search"
              style={{
                width: 18,
                height: 18,
                opacity: 0.6,
                flexShrink: 0,

              }}
            />

            <input

              placeholder="Search job"
              value={filters.searchQuery}
              onChange={(e) =>
                setFilters({ ...filters, searchQuery: e.target.value })
              }
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "clamp(13px, 3.5vw, 14px)",
                background: "transparent",
                marginTop: "14px",
                marginLeft: "-15px"
              }}
            />
          </div>


        </div>


        {/* ================= TABS ================= */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            padding: "clamp(6px, 2.5vw, 8px)",
            margin: "12px auto",
            borderRadius: 16,
            // boxShadow: " 0 4px 8px 0 rgba(0, 0, 0, 0.2)",
            border:"1px solid #0e02020e",
            width: "96%",
            maxWidth: 1540,
            marginLeft: "10px",
            overflowX: "auto",
            marginLeft: '1px',
            marginTop: "40px"
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
                  padding: "clamp(8px, 3vw, 10px) clamp(18px, 6vw, 42px)",
                  borderRadius: 999,
                  fontSize: "clamp(12px, 3.5vw, 14px)",
                  fontWeight: 500,
                  whiteSpace: "nowrap",

                  // 🔥 THIS IS THE FIX
                  color: isActive ? "#FFFFFF" : "#333",

                  background: isActive ? "#7C3CFF" : "transparent",
                  // boxShadow: isActive
                  //   ? "0 6px 20px rgba(0,0,0,0.19)"
                  //   : "none",
                  transition: "all 0.25s ease",
                  flexShrink: 0,
                }}
              >
                {t}
              </button>
            );
          })}

        </div>
        <div
          className="filter-sort-row"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            width: "100%",
            padding: "12px 26px",
          }}
        >

          {/* ================= FILTER ================= */}
          <div
            className="filter-btn"
            onClick={() => setShowFilter(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
              marginTop: "7px",
              marginRight: "5px",
            }}
          >

            <img
              src={Filter}
              alt="filter"
              style={{
                width: 18,
                height: 18,
                opacity: 0.7,
              }}
            />
            <span>Filter</span>
          </div>

          {/* ================= SORT ================= */}
          <div
            className="sort-btnn"
            onClick={() => setShowSort(!showSort)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
              marginTop: "7px",
              marginRight: "40px",
              justifyContent: "flex-end",

            }}
          >

            <img
              src={sort}
              alt="sort"
              style={{
                width: 18,
                height: 18,
                opacity: 0.7,

              }}
            />
            <span>Sort</span>
          </div>
        </div>


        {showSort && (
<div
  style={{
    marginTop: 0,
    marginLeft:"510px",
    display: "flex",
    gap: "10px",
    background: "#fff",
    padding: "10px",
    borderRadius: "20px",
    // boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    border:"1px solid #0e02020e",
    width: "fit-content",
  }}
>
  {Object.values(JobSortOption).map((opt) => {
    const active = filters.sortOption === opt;

    return (
      <button
        key={opt}
        onClick={() => {
          setFilters({ ...filters, sortOption: opt });
          setShowSort(false);
        }}
        style={{
          padding: "10px 22px",
          borderRadius: "14px",
          border: "none",
          background: active ? "#7C3AED" : "#F3F4F6",
          color: active ? "#fff" : "#000",
          fontWeight: 600,
          fontSize: "14px",
          cursor: "pointer",
          // boxShadow: active
          //   ? "0 6px 14px rgba(124,58,237,0.5)"
          //   : "none",
          transition: "all 0.25s ease",
        }}
      >
        {opt}
      </button>
    );
  })}
</div>

        )}

        {/* ================= JOB LIST ================= */}
        <div
          className="jobs"
          style={{
            width: "99%",
            maxWidth: "100%",
            overflowX: "hidden",
            marginLeft: isMobile ? "30px" : "0px",
          }}
        >
          {filteredJobs.length === 0 && (
            <p style={{ opacity: 0.6 }}>No jobs found</p>
          )}

          {filteredJobs.map((job) => (
            <div
              className="job-card"
              key={job.id}
              onClick={() =>
                navigate(`/freelance-dashboard/job-full/${job.id}`, {
                  state: job,
                })
              }
              style={{
                marginTop: 20,
                background: "#fff",
                marginLeft: "10px",
                borderRadius: 20,
                padding: 22,
                marginBottom: 18,
                // boxShadow: "0 0 6px rgba(0,0,0,0.15)",
                width: "97%",
                boxSizing: "border-box",
                cursor: "pointer",
                marginLeft: "2px",
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
                      fontSize: 18,
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
                  <div id="job-budget" className="job-budget">₹{job.budget_from || job.budget} - ₹{job.budget_to || job.budget}</div>


                </div>

              </div>
              <button
                className="job-save-btn"
                onClick={(e) => toggleSave(e, job.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "8px",
                  marginLeft: "95%"
                }}
              >

                <img
                  className=""
                  src={savedJobs.includes(job.id) ? saved : save}
                  alt="save"
                  width={20}
                />
              </button>
              {/* ===== SKILLS ===== */}
              <div style={{ marginTop: -4 }}>
                <div style={{ fontSize: 14, fontWeight: "400", color: "gray" }}>
                  Skills Required
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    marginTop: 16,

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
                      {job.skills.length - 3}+
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
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                  }}
                >
                  <img
                    src={eye}
                    width={14}
                    alt="views"
                    style={{ display: "block" }}
                  />
                  <span>
                    {job.views} Impression
                  </span>
                </span>

                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                  }}
                >
                  <img
                    src={clock}
                    width={14}
                    alt="time"
                    style={{ display: "block" }}
                  />
                  <span>{timeAgo(job.createdAt)}</span>
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