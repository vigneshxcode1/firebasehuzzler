// import React, { useEffect, useState } from "react";
// import { getFirestore, collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
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
// import { Users } from "lucide-react";

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
//   const [profile, setProfile] = useState(null); // <-- Store freelancer profile

//   // ----------------- BACKEND -----------------
//   const viewDetails = (job) => {
//     navigate(`/freelance-dashboard/jobdetailsscreen/${job.id}`);
//   };

//   const startChat = (job) => {
//     navigate("/chat", {
//       state: {
//         currentUid: user.uid,
//         otherUid: job.clientId,
//         otherName: job.clientName || "Client",
//         otherImage: job.clientImage || "",
//         initialMessage: "Hello! I have accepted your project. Let's begin!",
//       },
//     });
//   };

//    const fetchUserProfile = async (uid) => {
//     try {
//       const userRef = doc(db, "users", uid);
//       const snap = await getDoc(userRef);
//       if (snap.exists()) {
//         setProfile(snap.data());
//       }
//     } catch (e) {
//       console.log("Profile fetch error:", e);
//     }
//   };


//   // Fetch client details from 'users' collection
//   const fetchClientDetails = async (clientId) => {
//     try {
//       const userRef = doc(db, "users", clientId);
//       const snap = await getDoc(userRef);
//       if (snap.exists()) {
//         return snap.data();
//       }
//     } catch (e) {
//       console.log("Client fetch error:", e);
//     }
//     return null;
//   };

//   useEffect(() => {
//     if (!user) return;

//      fetchUserProfile(user.uid); // <-- fetch freelancer profile


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

//       const collectionName = activeTab === 0 ? "jobs" : "jobs_24h";
//       const jobsRef = collection(db, collectionName);

//       const unsubJobs = onSnapshot(jobsRef, async (jobsSnap) => {
//         const clientCache = {}; // cache to prevent multiple fetches
//         const list = [];

//         for (const d of jobsSnap.docs) {
//           if (!jobIds.includes(d.id)) continue;
//           const job = { id: d.id, ...d.data() };

//           // find corresponding notification
//           const notif = notifSnap.docs.find((n) => n.data().jobId === d.id)?.data();
//           if (notif) {
//             job.clientId = notif.clientUid;

//             // fetch client data with caching
//             if (!clientCache[notif.clientUid]) {
//               clientCache[notif.clientUid] = await fetchClientDetails(notif.clientUid);
//             }
//             const client = clientCache[notif.clientUid];

//             job.clientName = client?.company_name || client?.firstName || "Client";
//             job.clientImage = client?.profileImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
//           }

//           list.push(job);
//         }

//         setJobs(list);
//         setLoading(false);
//       });

//       return () => unsubJobs();
//     });

//     return () => unsubNotif();
//   }, [selectedTab, activeTab, user, db]);

//   const filteredJobs = jobs.filter((j) =>
//     (j.title || "").toLowerCase().includes(search)
//   );

//   if (!user) return <div style={{ padding: 40 }}>Please log in</div>;

//   return (
//     <div style={{ minHeight: "100vh", paddingBottom: 120, width: "100%" }}>
//       {/* ---------------- HEADER ---------------- */}
//       <div style={{ padding: "25px 16px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//           <div style={{ width: 36, height: 36, borderRadius: 12, background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(0,0,0,0.18)", cursor: "pointer" }} onClick={() => navigate(-1)}>
//             <img src={backarrow} style={{ width: 20 }} alt="back" />
//           </div>
//           <span style={{ fontSize: 26, fontWeight: 700, fontFamily: "Inter, sans-serif" }}>My Job</span>
//         </div>

//         <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
//           <img src={message} style={{width:"31px", height:"29px" ,cursor: "pointer"}} onClick={() => navigate("/freelancermessages")} />
//           <img src={notification} style={{width:"31px", height:"29px" ,cursor: "pointer"}} onClick={() => navigate("/notifications")} />
//           <img
//              src={profile?.profileImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
//             style={{ width: 34, height: 34, borderRadius: "50%", cursor: "pointer" }}
//             onClick={() => navigate("/freelance-dashboard/accountfreelancer")}
//           />

//         </div>
//       </div>

//       {/* ---------------- SEARCH ---------------- */}
//       <div style={{ padding: "0 16px" }}>
//         <div style={{borderRadius: 12, height: 48, display: "flex", alignItems: "center", padding: "0 16px", boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}>
//           <img src={searchIcon} alt="search" style={{ width: 20, height: 20, marginRight: 10, objectFit: "contain" }} />
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value.toLowerCase())}
//             placeholder="Search"
//             style={{ flex: 1, border: "none", marginTop: "14px", marginLeft: '-13px', outline: "none", background: "transparent", fontSize: 15 }}
//           />
//         </div>

//         <div style={{ height: 28 }} />

//         {/* Applied / Accepted Tabs */}
//         <div style={{ background: "#FFFFFF66", backdropFilter: "blur(12px)", borderRadius: 50, display: "flex", height: 48, padding: 14 }}>
//           {["Applied", "Accepted"].map((label) => {
//             const isActive = selectedTab === label;
//             return (
//               <div key={label} onClick={() => setSelectedTab(label)} style={{ flex: 1, borderRadius: 40, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 16, cursor: "pointer", background: isActive ? "#A259FF" : "#FEFED7", color: isActive ? "#fff" : "#000", transition: "0.25s ease", boxShadow: isActive ? "0 6px 20px rgba(162,89,255,0.35)" : "none" }}>
//                 {label}
//               </div>
//             );
//           })}
//         </div>

//         {/* Work / 24 Hours */}
//         <div style={{ marginTop: 22, padding: 6, paddingLeft: 10, background: "#FEFED7", borderRadius: 30, display: "flex", gap: 5, boxShadow: "0 4px 15px rgba(0,0,0,0.10)" }}>
//           {["Work", "24 Hours"].map((label, i) => {
//             const isActive = activeTab === i;
//             return (
//               <div key={label} onClick={() => setActiveTab(i)} style={{ width: 200, height: 20, textAlign: "center", padding: "6px 0", borderRadius: 40, cursor: "pointer", fontWeight: 600, background: isActive ? "#fff" : "transparent", boxShadow: isActive ? "0 4px 10px rgba(0,0,0,0.10)" : "none" }}>
//                 {label}
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* ---------------- JOB GRID ---------------- */}
//       <div style={{ padding: "0 16px", marginTop: 35, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
//         {loading ? (
//           <div>Loading...</div>
//         ) : filteredJobs.length === 0 ? (
//           <div>No Jobs</div>
//         ) : (
//           filteredJobs.map((job) => (
//             <JobCard key={job.id} job={job} selectedTab={selectedTab} onViewDetails={() => viewDetails(job)} onStartChat={() => startChat(job)} />
//           ))
//         )}
//       </div>

//       {/* Floating Add Button */}
//       <button style={fabStyle} onClick={() => navigate("/freelance-dashboard/add-service-form")}>
//         <FiPlus />
//       </button>
//     </div>
//   );
// }

// /* Floating Button Style */
// const fabStyle = {
//   position: "fixed",
//   right: 25,
//   bottom: 28,
//   width: 56,
//   height: 56,
//   borderRadius: "50%",
//   background: "linear-gradient(#8B2CFF,#6B00FF)",
//   color: "white",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   fontSize: 26,
//   border: 0,
//   boxShadow: "0 10px 30px rgba(124,58,237,0.20)",
//   cursor: "pointer",
// };

// /* ------------------------------------------- */
// /*                  JOB CARD                   */
// /* ------------------------------------------- */
// function JobCard({ job, selectedTab, onViewDetails, onStartChat }) {
//   return (
//     <div onClick={onViewDetails} style={{ background: "#FFFFFF80", fontWeight: 448, borderRadius: 24, padding: 76, boxShadow: "0 8px 20px rgba(0,0,0,0.10)", position: "relative", cursor: "pointer" }}>
//       {/* Arrow */}
//       <div style={{ position: "absolute", right: 12, top: 12, fontSize: 20, fontWeight: 700, color: "#777" }}>
//         <img src={arrow} alt="arrow" style={{ width: 20, height: 20, objectFit: "contain" }} />
//       </div>

//       {/* Client image + name */}
//       <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
//         <img
//           src={job.clientImage}
//           alt="client"
//           style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
//         />
//         <div style={{ fontWeight: 600, fontSize: 16, color: "#0A0A0A" }}>
//           {job.clientName}
//         </div>
//       </div>

//       {/* Job title */}
//       <div style={{ color: "#0A0A0A", fontWeight: 400, fontSize: 16 }}>{job.title}</div>
//       <div style={{ fontSize: 24, fontWeight: 400, marginTop: 10 }}>₹ {job.budget || "1000"}/per day</div>

//       {/* Skills */}
//       <div style={{ marginTop: 10, fontSize: 14, fontWeight: 400, color: "#0A0A0A" }}>Skills Required</div>
//       <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
//         {(job.skills || ["UI Design", "Web Design", "UX", "4+"]).map((s) => (
//           <span key={s} style={{ background: "#FFF7AA", padding: "4px 10px", fontSize: 12, borderRadius: 10, fontWeight: 600 }}>{s}</span>
//         ))}
//       </div>

//       {/* Impressions and date */}
//       <div style={{ marginTop: 10, fontSize: 12, display: "flex", justifyContent: "space-between", color: "#555" }}>
//         <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
//           <img src={impression} alt="impression" style={{ width: 14, height: 14, objectFit: "contain" }} />
//           {job.views || 0} Impression
//         </span>
//         <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
//           <img src={clock} alt="clock" style={{ width: 14, height: 14, objectFit: "contain" }} />
//           {job.created_at?.toDate ? job.created_at.toDate().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "No Date"}
//         </span>
//       </div>

//       {/* Buttons for Accepted */}
//       {selectedTab === "Accepted" && (
//         <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
//           <button onClick={(e) => { e.stopPropagation(); onViewDetails(); }} style={{ flex: 1, border: "2px solid #B45CFF", borderRadius: 10, background: "#fff", padding: "10px 0", fontWeight: 600, color: "#B45CFF", cursor: "pointer" }}>View Details</button>
//           <button onClick={(e) => { e.stopPropagation(); onStartChat(); }} style={{ flex: 1, borderRadius: 10, padding: "10px 0", background: "linear-gradient(#B45CFF,#8A00FF)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Start message</button>
//         </div>
//       )}
//     </div>
//   );
// }



// ⭐ MyWorksScreen WITH SIDEBAR SUPPORT ⭐

import React, { useEffect, useState } from "react";
import { getFirestore, collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
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

  if (!user) return <div>Please log in</div>;

  return (
    <div
      style={{
        marginLeft: collapsed ? "-100px" : "110px",
        transition: "margin-left 0.25s ease",
        minHeight: "100vh",
        paddingBottom: 120,

      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "25px 16px 10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
              cursor: "pointer",
            }}
            onClick={() => navigate(-1)}
          >
            <img src={backarrow} style={{ width: 20 }} />
          </div>

          <span style={{ fontSize: 26, fontWeight: 700 }}>My Job</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img
            src={message}
            style={{ width: "31px", height: "29px", cursor: "pointer" }}
            onClick={() => navigate("/freelancermessages")}
          />

          <img
            src={notification}
            style={{ width: "31px", height: "29px", cursor: "pointer" }}
            onClick={() => navigate("/notifications")}
          />

          <img
            src={
              profile?.profileImage ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              cursor: "pointer",
            }}
            onClick={() => navigate("/freelance-dashboard/accountfreelancer")}
          />
        </div>
      </div>

      {/* SEARCH */}
      <div style={{ padding: "0 16px" }}>
        <div
          style={{
            borderRadius: 12,
            height: 48,
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          }}
        >
          <img src={searchIcon} style={{ width: 20, marginRight: 10 }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
            placeholder="Search"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 15,
            }}
          />
        </div>

        {/* Applied / Accepted Tabs */}
        <div
          style={{
            background: "#FFFFFF66",
            backdropFilter: "blur(12px)",
            borderRadius: 50,
            display: "flex",
            height: 48,
            padding: 14,
            marginTop: 30,
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
                  borderRadius: 40,
                  textAlign: "center",
                  fontWeight: 600,
                  padding: "8px 0",
                  cursor: "pointer",
                  background: active ? "#A259FF" : "#FEFED7",
                  color: active ? "#fff" : "#000",
                  boxShadow: active
                    ? "0 6px 20px rgba(162,89,255,0.35)"
                    : "none",
                }}
              >
                {label}
              </div>
            );
          })}
        </div>

        {/* Work / 24 Hours */}
        <div
          style={{
            marginTop: 22,
            padding: 6,
            paddingLeft: 10,
            background: "#FEFED7",
            borderRadius: 30,
            display: "flex",
            gap: 5,
            boxShadow: "0 4px 15px rgba(0,0,0,0.10)",
          }}
        >
          {["Work", "24 Hours"].map((label, i) => {
            const active = activeTab === i;
            return (
              <div
                key={label}
                onClick={() => setActiveTab(i)}
                style={{
                  width: 200,
                  textAlign: "center",
                  padding: "6px 0",
                  borderRadius: 40,
                  cursor: "pointer",
                  fontWeight: 600,
                  background: active ? "#fff" : "transparent",
                  boxShadow: active ? "0 4px 10px rgba(0,0,0,0.10)" : "none",
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
          padding: "0 16px",
          marginTop: 35,
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 16,
        }}
      >
        {loading ? (
          <div>Loading...</div>
        ) : filteredJobs.length === 0 ? (
          <div>No Jobs</div>
        ) : (
          filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              selectedTab={selectedTab}
              onViewDetails={() => viewDetails(job)}
              onStartChat={() => startChat(job)}
            />
          ))
        )}
      </div>

      {/* FLOATING ADD BUTTON */}
      <button style={fabStyle} onClick={() => navigate("/freelance-dashboard/add-service-form")}>
        <FiPlus />
      </button>
    </div>
  );
}

// FLOAT BUTTON STYLE
const fabStyle = {
  position: "fixed",
  right: 25,
  bottom: 28,
  width: 56,
  height: 56,
  borderRadius: "50%",
  background: "linear-gradient(#8B2CFF,#6B00FF)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 26,
  border: 0,
  boxShadow: "0 10px 30px rgba(124,58,237,0.20)",
  cursor: "pointer",
};

// CARD COMPONENT
function JobCard({ job, selectedTab, onViewDetails, onStartChat }) {
  return (
    <div
      onClick={onViewDetails}
      style={{
        background: "#FFFFFF80",
        borderRadius: 24,
        padding: 76,
        boxShadow: "0 8px 20px rgba(0,0,0,0.10)",
        cursor: "pointer",
        position: "relative",
      }}
    >
      {/* Arrow */}
      <div
        style={{
          position: "absolute",
          right: 12,
          top: 12,
        }}
      >
        <img src={arrow} style={{ width: 20 }} />
      </div>

      {/* Client */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img
          src={job.clientImage}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <div style={{ fontWeight: 600 }}>{job.clientName}</div>
      </div>

      {/* Title */}
      <div style={{ marginTop: 10, fontSize: 16 }}>{job.title}</div>
      <div style={{ fontSize: 24, marginTop: 10 }}>₹ {job.budget}/day</div>

      {/* Skills */}
      <div style={{ marginTop: 10, fontSize: 14 }}>Skills Required</div>
      <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 6 }}>
        {(job.skills || []).map((s) => (
          <span
            key={s}
            style={{
              background: "#FFF7AA",
              padding: "4px 10px",
              fontSize: 12,
              borderRadius: 10,
            }}
          >
            {s}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div
        style={{
          marginTop: 10,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
        }}
      >
        <span>
          <img src={impression} style={{ width: 14 }} /> {job.views || 0}
        </span>

        <span>
          <img src={clock} style={{ width: 14 }} />{" "}
          {job.created_at?.toDate
            ? job.created_at.toDate().toLocaleDateString()
            : "No Date"}
        </span>
      </div>

      {/* BUTTONS FOR ACCEPTED */}
      {selectedTab === "Accepted" && (
        <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            style={{
              flex: 1,
              border: "2px solid #B45CFF",
              borderRadius: 10,
              padding: "10px 0",
              background: "#fff",
              fontWeight: 600,
              color: "#B45CFF",
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
              borderRadius: 10,
              padding: "10px 0",
              background: "linear-gradient(#B45CFF,#8A00FF)",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            Start message
          </button>
        </div>
      )}
    </div>
  );
}
