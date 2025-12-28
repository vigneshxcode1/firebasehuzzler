// // MyWorksScreen.jsx
// import React, { useEffect, useState } from "react";
// import {
//   getFirestore,
//   collection,
//   query,
//   where,
//   onSnapshot,
//   doc,
//   getDoc,
// } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { useNavigate } from "react-router-dom";

// import message from "../assets/message.png";
// import notification from "../assets/notification.png";
// import backarrow from "../assets/backarrow.png";
// import searchIcon from "../assets/search.png";
// import clock from "../assets/clock.png";
// import impression from "../assets/Impression.png";
// import arrow from "../assets/arrow.png";
// import { FiPlus } from "react-icons/fi";

// // Import the empty-state image
// import Searchjob from "../assets/Searchjob.png";

// // --------------------------
// // TIME FORMATTER
// // --------------------------
// function formatTime(timestamp) {
//   if (!timestamp?.toDate) return "Unknown";

//   const date = timestamp.toDate();
//   const seconds = (Date.now() - date.getTime()) / 1000;

//   if (seconds < 60) return "Just now";
//   if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
//   if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
//   if (seconds < 172800) return "Yesterday";
//   if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
//   if (seconds < 2592000) return `${Math.floor(seconds / 604800)} weeks ago`;

//   return `${Math.floor(seconds / 2592000)} months ago`;
// }

// export default function MyWorksScreen() {
//   const db = getFirestore();
//   const auth = getAuth();
//   const user = auth.currentUser;
//   const navigate = useNavigate();

//   const [selectedTab, setSelectedTab] = useState("Applied");
//   const [activeTab, setActiveTab] = useState(0);
//   const [search, setSearch] = useState("");
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [profile, setProfile] = useState(null);

//   // Sidebar collapse state
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

//   // Fetch user profile
//   const fetchUserProfile = async (uid) => {
//     try {
//       const snap = await getDoc(doc(db, "users", uid));
//       if (snap.exists()) setProfile(snap.data());
//     } catch (e) {
//       console.log("Profile fetch error:", e);
//     }
//   };

//   // Fetch client details
//   const fetchClientDetails = async (clientId) => {
//     try {
//       const snap = await getDoc(doc(db, "users", clientId));
//       return snap.exists() ? snap.data() : null;
//     } catch {
//       return null;
//     }
//   };

//   // Main Firestore Listener
//   useEffect(() => {
//     if (!user) return;

//     fetchUserProfile(user.uid);
//     setLoading(true);

//     const showAccepted = selectedTab === "Accepted";

//     const notifRef = collection(db, "notifications");
//     const qNotif = query(
//       notifRef,
//       where("freelancerId", "==", user.uid),
//       where("read", "==", showAccepted)
//     );

//     const unsubNotif = onSnapshot(qNotif, async (notifSnap) => {
//       const jobIds = [...new Set(notifSnap.docs.map((d) => d.data().jobId))];

//       if (jobIds.length === 0) {
//         setJobs([]);
//         setLoading(false);
//         return;
//       }

//       const jobCollection = activeTab === 0 ? "jobs" : "jobs_24h";

//       const unsubJobs = onSnapshot(
//         collection(db, jobCollection),
//         async (jobsSnap) => {
//           const clientCache = {};
//           const list = [];

//           for (const d of jobsSnap.docs) {
//             if (!jobIds.includes(d.id)) continue;

//             const job = { id: d.id, ...d.data() };
//             const notif = notifSnap.docs.find(
//               (n) => n.data().jobId === d.id
//             )?.data();

//             if (notif) {
//               job.clientId = notif.clientUid;

//               // Cache client details
//               if (!clientCache[notif.clientUid]) {
//                 clientCache[notif.clientUid] = await fetchClientDetails(
//                   notif.clientUid
//                 );
//               }

//               const client = clientCache[notif.clientUid];

//               job.clientName =
//                 client?.company_name ||
//                 client?.firstName ||
//                 "Client";

//               job.clientImage =
//                 client?.profileImage ||
//                 "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
//             }

//             list.push(job);
//           }

//           setJobs(list);
//           setLoading(false);
//         }
//       );

//       return () => unsubJobs();
//     });

//     return () => unsubNotif();
//   }, [selectedTab, activeTab, user]);

//   const filteredJobs = jobs.filter((j) =>
//     (j.title || "").toLowerCase().includes(search)
//   );

//   if (!user) return <div style={{ padding: 20 }}>Please log in</div>;

//   const containerStyle = {
//     marginLeft: collapsed ? "-210px" : "110px",
//     transition: "margin-left 0.25s ease",
//     minHeight: "100vh",
//     paddingBottom: 120,
//     background: "#fff",
//     overflowX: "hidden",
//   };

//   return (
//     <div style={containerStyle}>
//       {/* HEADER */}
//       <div
//         style={{
//           padding: "24px 20px",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//           <div
//             style={{
//               width: 36,
//               height: 36,
//               borderRadius: 12,
//               background: "#fff",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
//               cursor: "pointer",
//             }}
//             onClick={() => navigate(-1)}
//           >
//             <img src={backarrow} style={{ width: 18 }} alt="back" />
//           </div>

//           <span style={{ fontSize: 28, fontWeight: 700 }}>My Job</span>
//         </div>

//         <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
//           <img
//             src={message}
//             style={{ width: 22, cursor: "pointer" }}
//             onClick={() => navigate("/freelancermessages")}
//           />
//           <img
//             src={notification}
//             style={{ width: 22, cursor: "pointer" }}
//             onClick={() => navigate("/notifications")}
//           />
//           <img
//             src={
//               profile?.profileImage ||
//               "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
//             }
//             style={{
//               width: 36,
//               height: 36,
//               borderRadius: "50%",
//               cursor: "pointer",
//               objectFit: "cover",
//             }}
//             onClick={() =>
//               navigate("/freelance-dashboard/accountfreelancer")
//             }
//           />
//         </div>
//       </div>

//       {/* MAIN CONTENT */}
//       <div style={{ padding: "0 20px 30px" }}>
//         <div style={{ maxWidth: 1300, margin: "0 auto" }}>
//           {/* SEARCH */}
//           <div
//             style={{
//               borderRadius: 14,
//               height: 56,
//               display: "flex",
//               alignItems: "center",
//               padding: "0 18px",
//               boxShadow: "0 12px 38px rgba(0,0,0,0.12)",
//               marginLeft: "-90px",
//             }}
//           >
//             <img src={searchIcon} style={{ width: 18, marginRight: 12 }} />
//             <input
//               value={search}
//               onChange={(e) => setSearch(e.target.value.toLowerCase())}
//               placeholder="Search"
//               style={{
//                 flex: 1,
//                 border: "none",
//                 outline: "none",
//                 fontSize: 15,
//                 marginTop: "15px",
//               }}
//             />
//           </div>

//           {/* Tabs */}
//           <div
//             style={{
//               marginTop: 22,
//               display: "flex",
//               gap: 18,
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 width: "100%",
//                 height: 52,
//                 borderRadius: 999,
//                 background: "rgba(0,0,0,0.04)",
//                 padding: 6,
//               }}
//             >
//               {["Applied", "Accepted"].map((label) => {
//                 const active = selectedTab === label;
//                 return (
//                   <div
//                     key={label}
//                     onClick={() => setSelectedTab(label)}
//                     style={{
//                       flex: 1,
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       borderRadius: 999,
//                       cursor: "pointer",
//                       background: active ? "#A259FF" : "transparent",
//                       color: active ? "#fff" : "#111",
//                       fontWeight: 600,
//                     }}
//                   >
//                     {label}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Work / 24 Hours */}
//           <div style={{ marginTop: 18 }}>
//             <div
//               style={{
//                 width: "106%",
//                 height: 48,
//                 borderRadius: 12,
//                 background: "#fff",
//                 boxShadow: "0 12px 38px rgba(0,0,0,0.12)",
//                 display: "flex",
//                 alignItems: "center",
//                 padding: 6,
//                 marginLeft: "-90px",
//               }}
//             >
//               {["Work", "24 Hours"].map((label, i) => {
//                 const active = activeTab === i;
//                 return (
//                   <div
//                     key={label}
//                     onClick={() => setActiveTab(i)}
//                     style={{
//                       width: 140,
//                       height: 36,
//                       borderRadius: 10,
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       marginLeft: i === 0 ? 8 : 12,
//                       cursor: "pointer",
//                       background: active ? "#fff" : "transparent",
//                       boxShadow: active
//                         ? "0 6px 18px rgba(0,0,0,0.06)"
//                         : "none",
//                       fontWeight: 600,
//                     }}
//                   >
//                     {label}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* JOB GRID */}
//           <div
//             style={{
//               marginTop: 28,
//               display: "grid",
//               gridTemplateColumns: "repeat(2, 1fr)",
//               gap: 22,
//             }}
//           >
//             {loading ? (
//               <div style={{ padding: 20 }}>Loading...</div>
//             ) : filteredJobs.length === 0 ? (
//               // EMPTY STATE
//               <div
//                 style={{
//                   gridColumn: "1 / -1",
//                   textAlign: "center",
//                   padding: "40px 0",
//                 }}
//               >
//                 <img
//                   src={Searchjob}
//                   alt="No jobs"
//                   style={{ width: 220, opacity: 0.9 }}
//                 />

//                 <h2 style={{ marginTop: 20, fontSize: 22, fontWeight: 700 }}>
//                   No Job Applications Yet!
//                 </h2>

//                 <p style={{ marginTop: 10, color: "#777", fontSize: 15 }}>
//                   Looks like you haven’t {selectedTab}  for any jobs. Start exploring projects and submit your first application now.
//                   {activeTab === 0 ? "Work" : "24 Hours"}.
//                 </p>
//                 <button 
//                 style={{ marginTop: 20, fontSize: 15, fontWeight: 500 ,width:"150px",background:"#FDFD96",borderRadius:"50px",border:"1px solid #FDFD96",padding:"10px",cursor:"pointer"}}
//                  onClick={() =>
//           navigate("/freelance-dashboard/add-service-form")}
//                 >
//                   Browse Jobs</button>
//               </div>
//             ) : (
//               filteredJobs.map((job) => (
//                 <JobCard
//                   key={job.id}
//                   job={job}
//                   selectedTab={selectedTab}
//                   onViewDetails={() =>
//                     navigate(
//                       `/freelance-dashboard/jobdetailsscreen/${job.id}`
//                     )
//                   }
//                   onStartChat={() =>
//                     navigate("/chat", {
//                       state: {
//                         currentUid: user.uid,
//                         otherUid: job.clientId,
//                         otherName: job.clientName || "Client",
//                         otherImage: job.clientImage || "",
//                         initialMessage:
//                           "Hello! I have accepted your project. Let's begin!",
//                       },
//                     })
//                   }
//                 />
//               ))
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Floating Add Button */}
//       <button
//         style={{
//           position: "fixed",
//           right: 28,
//           bottom: 28,
//           width: 54,
//           height: 54,
//           borderRadius: "50%",
//           background: "linear-gradient(180deg,#A259FF,#6B00FF)",
//           color: "#fff",
//           fontSize: 24,
//           border: 0,
//           cursor: "pointer",
//         }}
//         onClick={() =>
//           navigate("/freelance-dashboard/add-service-form")
//         }
//       >
//         <FiPlus />
//       </button>
//     </div>
//   );
// }

// // ---------------------------
// // JOB CARD COMPONENT
// // ---------------------------
// function JobCard({
//   job,
//   selectedTab,
//   onViewDetails,
//   onStartChat,
//   arrowIcon = arrow,
//   impressionIcon = impression,
//   clockIcon = clock,
// }) {
//   const isAccepted = selectedTab === "Accepted";

//   const acceptedCardStyle = {
//     borderRadius: 20,
//     padding: "22px 22px 26px",
//     boxShadow: "0 12px 38px rgba(0,0,0,0.12)",
//     cursor: "pointer",
//     position: "relative",
//     minHeight: 230,
//     display: "flex",
//     flexDirection: "column",
//   };

//   const appliedCardStyle = {
//     background: "#fff",
//     borderRadius: 12,
//     padding: 20,
//     boxShadow: "0 12px 38px rgba(0,0,0,0.12)",
//     cursor: "pointer",
//     position: "relative",
//     minHeight: 180,
//     display: "flex",
//     flexDirection: "column",
//   };

//   return (
//     <div
//       onClick={onViewDetails}
//       style={isAccepted ? acceptedCardStyle : appliedCardStyle}
//     >
//       <img
//         src={arrowIcon}
//         alt="arrow"
//         style={{
//           width: isAccepted ? 18 : 16,
//           position: "absolute",
//           right: isAccepted ? 20 : 16,
//           top: isAccepted ? 20 : 16,
//           opacity: 0.8,
//         }}
//       />

//       <div>
//         <div style={{ fontSize: isAccepted ? 17 : 15, fontWeight: 700 }}>
//           {job.title || job.clientName || "Company Name"}
//         </div>

//         <div style={{ marginTop: 6, color: "#777", fontSize: 13 }}>
//           {job.job_role || "UI/UX Designer"}
//         </div>

//         <div style={{ marginTop: 12, fontSize: 20, fontWeight: 700 }}>
//           ₹ {job.budget || 1000}/per day
//         </div>

//         <div style={{ marginTop: 12, fontSize: 13, fontWeight: 600 }}>
//           Skills Required
//         </div>

//         <div style={{ marginTop: 8, display: "flex", gap: 10, flexWrap: "wrap" }}>
//           {(job.skills || ["UI", "UX", "Web"]).map((s, idx) => (
//             <div
//               key={idx}
//               style={{
//                 background: "#FFF5A1",
//                 padding: "6px 12px",
//                 borderRadius: 999,
//                 fontSize: 12,
//                 fontWeight: 600,
//               }}
//             >
//               {s}
//             </div>
//           ))}
//         </div>
//       </div>

//       <div style={{ marginTop: 18 }}>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 18,
//             fontSize: 13,
//             color: "#777",
//             marginBottom: 16,
//           }}
//         >
//           <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
//             <img src={impressionIcon} style={{ width: 16 }} />
//             <span>{job.views || 29}</span>
//             <span>Impression</span>
//           </span>

//           <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
//             <img src={clockIcon} style={{ width: 16 }} />
//             <span>{formatTime(job.created_at)}</span>
//           </span>
//         </div>

//         {isAccepted && (
//           <div style={{ display: "flex", gap: 12 }}>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onViewDetails();
//               }}
//               style={{
//                 flex: 1,
//                 padding: "10px 0",
//                 borderRadius: 14,
//                 border: "1.5px solid #A259FF",
//                 background: "#fff",
//                 color: "#A259FF",
//                 fontWeight: 700,
//               }}
//             >
//               View Details
//             </button>

//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onStartChat();
//               }}
//               style={{
//                 flex: 1,
//                 padding: "10px 0",
//                 borderRadius: 14,
//                 background: "linear-gradient(180deg,#A259FF,#6B00FF)",
//                 color: "#fff",
//                 fontWeight: 700,
//                 border: "none",
//               }}
//             >
//               Start message
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import message from "../assets/message.png";
import notification from "../assets/notification.png";
import backarrow from "../assets/backarrow.png";
import searchIcon from "../assets/search.png";
import clock from "../assets/clock.png";
import impression from "../assets/Impression.png";
import arrow from "../assets/arrow.png";
import { FiPlus } from "react-icons/fi";
import Searchjob from "../assets/Searchjob.png";

export default function MyWorksScreen() {
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState("Applied");
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // ⭐ SIDEBAR COLLAPSED STATE
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  // ⭐ MOBILE DETECTION
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ⭐ LISTEN FOR SIDEBAR TOGGLE EVENT
  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  // =================== BACKEND ===================

  const viewDetails = (job) => {
    navigate(`/freelance-dashboard/jobdetailsscreen/${job.id}`);
  };

  const startChat = (job) => {
    navigate("/chat", {
      state: {
        currentUid: user.uid,
        otherUid: job.clientId,
        otherName: job.clientName || "Client",
        otherImage: job.clientImage || "",
        initialMessage: "Hello! I have accepted your project. Let's begin!",
      },
    });
  };

  const fetchUserProfile = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) setProfile(snap.data());
    } catch (e) {
      console.log("Profile fetch error:", e);
    }
  };

  const fetchClientDetails = async (clientId) => {
    try {
      const snap = await getDoc(doc(db, "users", clientId));
      return snap.exists() ? snap.data() : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchUserProfile(user.uid);
    setLoading(true);

    const showAccepted = selectedTab === "Accepted";
    const notifRef = collection(db, "notifications");

    const qNotif = query(
      notifRef,
      where("freelancerId", "==", user.uid),
      where("read", "==", showAccepted)
    );

    const unsubNotif = onSnapshot(qNotif, async (notifSnap) => {
      const jobIds = [...new Set(notifSnap.docs.map((d) => d.data().jobId))];
      if (jobIds.length === 0) {
        setJobs([]);
        setLoading(false);
        return;
      }

      const jobCollection = activeTab === 0 ? "jobs" : "jobs_24h";

      const unsubJobs = onSnapshot(collection(db, jobCollection), async (jobsSnap) => {
        const clientCache = {};
        const list = [];

        for (const d of jobsSnap.docs) {
          if (!jobIds.includes(d.id)) continue;

          const job = { id: d.id, ...d.data() };
          const notif = notifSnap.docs.find((n) => n.data().jobId === d.id)?.data();

          if (notif) {
            job.clientId = notif.clientUid;

            if (!clientCache[notif.clientUid]) {
              clientCache[notif.clientUid] = await fetchClientDetails(notif.clientUid);
            }

            const client = clientCache[notif.clientUid];
            job.clientName = client?.company_name || client?.firstName || "Client";
            job.clientImage =
              client?.profileImage ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
          }

          list.push(job);
        }

        setJobs(list);
        setLoading(false);
      });

      return () => unsubJobs();
    });

    return () => unsubNotif();
  }, [selectedTab, activeTab, user, db]);

  const filteredJobs = jobs.filter((j) =>
    (j.title || "").toLowerCase().includes(search)
  );

  if (!user) return <div style={{ padding: 20 }}>Please log in</div>;

  const containerStyle = {
    marginLeft: isMobile ? "0px" : collapsed ? "-100px" : "140px",
    transition: "margin-left 0.25s ease",
    minHeight: "100vh",
    paddingBottom: 120,
    background: "#fff",
    
  };

  return (
    <div style={containerStyle}>
      {/* HEADER */}
      <div
        style={{
          padding: "64px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          rowGap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
              cursor: "pointer",
            }}
            onClick={() => navigate(-1)}
          >
            <img src={backarrow} style={{ width: 18 }} alt="back" />
          </div>

          <span style={{ fontSize: 28, fontWeight: 700 }}>My Job</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <img
            src={message}
            style={{ width: 22, cursor: "pointer" }}
            onClick={() => navigate("/freelancermessages")}
          />
          <img
            src={notification}
            style={{ width: 22, cursor: "pointer" }}
            onClick={() => navigate("/notifications")}
          />
          <img
            src={
              profile?.profileImage ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              cursor: "pointer",
              objectFit: "cover",
            }}
            onClick={() =>
              navigate("/freelance-dashboard/accountfreelancer")
            }
          />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ padding: "0 20px 30px" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto" }}>
          {/* SEARCH */}
          <div
            style={{
              borderRadius: 14,
              height: 56,
              display: "flex",
              alignItems: "center",
              padding: "0 18px",
              boxShadow: "0 12px 38px rgba(0,0,0,0.12)",
              marginLeft: isMobile ? "0px" : "-90px",
            }}
          >
            <img src={searchIcon} style={{ width: 18, marginRight: 12 }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value.toLowerCase())}
              placeholder="Search"
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: 15,
                marginTop: "15px",
              }}
            />
          </div>

          {/* Tabs */}
          <div style={{ marginTop: 22, display: "flex", gap: 18 }}>
            <div
              style={{
                display: "flex",
                width: "100%",
                height: 52,
                borderRadius: 999,
                background: "rgba(0,0,0,0.04)",
                padding: 6,
              }}
            >
              {["Applied", "Accepted"].map((label) => {
                const active = selectedTab === label;
                return (
                  <div
                    key={label}
                    onClick={() => setSelectedTab(label)}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 999,
                      cursor: "pointer",
                      background: active ? "#A259FF" : "transparent",
                      color: active ? "#fff" : "#111",
                      fontWeight: 600,
                    }}
                  >
                    {label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Work / 24 Hours */}
          <div style={{ marginTop: 18 }}>
            <div
              style={{
                width: isMobile ? "100%" : "106%",
                height: 48,
                borderRadius: 12,
                background: "#fff",
                boxShadow: "0 12px 38px rgba(0,0,0,0.12)",
                display: "flex",
                alignItems: "center",
                padding: 6,
                marginLeft: isMobile ? "0px" : "-90px",
              }}
            >
              {["Work", "24 Hours"].map((label, i) => {
                const active = activeTab === i;
                return (
                  <div
                    key={label}
                    onClick={() => setActiveTab(i)}
                    style={{
                      width: 140,
                      height: 36,
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: i === 0 ? 8 : 12,
                      cursor: "pointer",
                      background: active ? "#fff" : "transparent",
                      boxShadow: active
                        ? "0 6px 18px rgba(0,0,0,0.06)"
                        : "none",
                      fontWeight: 600,
                    }}
                  >
                    {label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* JOB GRID */}
          <div
            style={{
              marginTop: 28,
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
              gap: 22,
            }}
          >
            {loading ? (
              <div style={{ padding: 20 }}>Loading...</div>
            ) : filteredJobs.length === 0 ? (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "40px 0",
                }}
              >
                <img
                  src={Searchjob}
                  alt="No jobs"
                  style={{ width: 220, opacity: 0.9 }}
                />
                <h2 style={{ marginTop: 20, fontSize: 22, fontWeight: 700 }}>
                  No Job Applications Yet!
                </h2>
                <p style={{ marginTop: 10, color: "#777", fontSize: 15 }}>
                  Looks like you haven’t {selectedTab}  for any jobs. Start exploring projects and submit your first application now.
                  {activeTab === 0 ? "Work" : "24 Hours"}.
                </p>
                <button
                  style={{
                    marginTop: 20,
                    fontSize: 15,
                    fontWeight: 500,
                    width: "150px",
                    background: "#FDFD96",
                    borderRadius: "50px",
                    border: "1px solid #FDFD96",
                    padding: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    navigate("/freelance-dashboard/add-service-form")
                  }
                >
                  Browse Jobs
                </button>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  selectedTab={selectedTab}
                  onViewDetails={() =>
                    navigate(
                      `/freelance-dashboard/jobdetailsscreen/${job.id}`
                    )
                  }
                  onStartChat={() =>
                    navigate("/chat", {
                      state: {
                        currentUid: user.uid,
                        otherUid: job.clientId,
                        otherName: job.clientName || "Client",
                        otherImage: job.clientImage || "",
                        initialMessage:
                          "Hello! I have accepted your project. Let's begin!",
                      },
                    })
                  }
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Floating Add Button */}
      <button
        style={{
          position: "fixed",
          right: 28,
          bottom: 28,
          width: 54,
          height: 54,
          borderRadius: "50%",
          background: "linear-gradient(180deg,#A259FF,#6B00FF)",
          color: "#fff",
          fontSize: 24,
          border: 0,
          cursor: "pointer",
        }}
        onClick={() =>
          navigate("/freelance-dashboard/add-service-form")
        }
      >
        <FiPlus />
      </button>
    </div>
  );
}

// ---------------------------
// JOB CARD COMPONENT
// ---------------------------
function JobCard({ job, selectedTab, onViewDetails, onStartChat }) {
  const isAccepted = selectedTab === "Accepted";

  const acceptedCardStyle = {
    borderRadius: 20,
    padding: window.innerWidth <= 768 ? 20 : "22px 22px 26px",
    boxShadow: "0 12px 38px rgba(0,0,0,0.12)",
    cursor: "pointer",
    position: "relative",
    minHeight: 230,
    display: "flex",
    flexDirection: "column",
  };

  const appliedCardStyle = {
    background: "#fff",
    borderRadius: 12,
    padding: window.innerWidth <= 768 ? 16 : 20,
    boxShadow: "0 12px 38px rgba(0,0,0,0.12)",
    cursor: "pointer",
    position: "relative",
    minHeight: 180,
    display: "flex",
    flexDirection: "column",
  };

  return (
    <div
      onClick={onViewDetails}
      style={isAccepted ? acceptedCardStyle : appliedCardStyle}
    >
      <img
        src={arrow}
        alt="arrow"
        style={{
          width: isAccepted ? 18 : 16,
          position: "absolute",
          right: isAccepted ? 20 : 16,
          top: isAccepted ? 20 : 16,
          opacity: 0.8,
        }}
      />

      <div>
        <div style={{ fontSize: isAccepted ? 17 : 15, fontWeight: 700 }}>
          {job.title || job.clientName || "Company Name"}
        </div>

        <div style={{ marginTop: 6, color: "#777", fontSize: 13 }}>
          {job.job_role || "UI/UX Designer"}
        </div>

        <div style={{ marginTop: 12, fontSize: 20, fontWeight: 700 }}>
          ₹ {job.budget || 1000}/per day
        </div>

        <div style={{ marginTop: 12, fontSize: 13, fontWeight: 600 }}>
          Skills Required
        </div>

        <div style={{ marginTop: 8, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {(job.skills || ["UI", "UX", "Web"]).map((s, idx) => (
            <div
              key={idx}
              style={{
                background: "#FFF5A1",
                padding: "6px 12px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 13,
            color: "#777",
            marginBottom: 16,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src={impression} style={{ width: 16 }} />
            <span>{job.views || 29}</span>
            <span>Impression</span>
          </span>

          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src={clock} style={{ width: 16 }} />
            <span>
              {job.created_at?.toDate
                ? job.created_at.toDate().toLocaleDateString()
                : "No Date"}
            </span>
          </span>
        </div>

        {isAccepted && (
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: 14,
                border: "1.5px solid #A259FF",
                background: "#fff",
                color: "#A259FF",
                fontWeight: 700,
              }}
            >
              View Details
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onStartChat();
              }}
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: 14,
                border: "none",
                background: "#A259FF",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              Start Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}