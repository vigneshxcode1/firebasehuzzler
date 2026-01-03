

// import React, { useEffect, useState, useCallback } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// // ===== Firebase (assume initialized) =====
// import { getAuth } from "firebase/auth";
// import {
//   getFirestore,
//   doc,
//   onSnapshot,
//   collection,
//   query,
//   where,
//   getDocs,
//   addDoc,
//   serverTimestamp,
// } from "firebase/firestore";

// // ===== Icons =====
// import {
//   FiArrowLeft,
//   FiShare2,
//   FiFlag,
//   FiMoreHorizontal,
// } from "react-icons/fi";

// /* ======================================================
//    MAIN COMPONENT
// ====================================================== */
// export default function ClientFullDetailScreen() {
//   const { userId, jobId } = useParams();
//   const navigate = useNavigate();

//   const auth = getAuth();
//   const db = getFirestore();
//   const currentUid = auth.currentUser?.uid;

//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isRequested, setIsRequested] = useState(false);
//   const [isAccepted, setIsAccepted] = useState(false);
//   const [activeTab, setActiveTab] = useState("work");

//   /* ================= FETCH PROFILE ================= */
//   useEffect(() => {
//     if (!userId) return;

//     const unsub = onSnapshot(doc(db, "users", userId), snap => {
//       if (snap.exists()) setProfile(snap.data());
//       setLoading(false);
//     });

//     return () => unsub();
//   }, [db, userId]);

//   /* ================= CHECK REQUEST ================= */
//   useEffect(() => {
//     if (!currentUid || !userId) return;

//     async function checkRequest() {
//       const q = query(
//         collection(db, "collaboration_requests"),
//         where("clientId", "==", currentUid),
//         where("freelancerId", "==", userId),
//         where("status", "==", "sent"),
//         ...(jobId ? [where("jobId", "==", jobId)] : [])
//       );

//       const snap = await getDocs(q);
//       setIsRequested(!snap.empty);
//     }

//     checkRequest();
//   }, [db, currentUid, userId, jobId]);

//   /* ================= CHECK ACCEPTED ================= */
//   useEffect(() => {
//     if (!currentUid || !userId || !jobId) return;

//     async function checkAccepted() {
//       const q = query(
//         collection(db, "accepted_jobs"),
//         where("clientId", "==", currentUid),
//         where("freelancerId", "==", userId),
//         where("jobId", "==", jobId)
//       );

//       const snap = await getDocs(q);
//       setIsAccepted(!snap.empty);
//     }

//     checkAccepted();
//   }, [db, currentUid, userId, jobId]);

//   /* ================= ACTIONS ================= */
//   const shareProfile = async () => {
//     const name = `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`;
//     const link = profile?.linkedin || window.location.href;

//     if (navigator.share) {
//       await navigator.share({
//         title: name,
//         text: `Check out ${name}'s profile`,
//         url: link,
//       });
//     } else {
//       alert("Sharing not supported");
//     }
//   };

//   const sendRequest = async () => {
//     if (!currentUid) return alert("Login required");

//     await addDoc(collection(db, "collaboration_requests"), {
//       clientId: currentUid,
//       freelancerId: userId,
//       jobId: jobId || null,
//       status: "sent",
//       timestamp: serverTimestamp(),
//     });

//     setIsRequested(true);
//     alert("Request sent");
//   };

//   const blockUser = async () => {
//     if (!currentUid) return;

//     await addDoc(collection(db, "blocked_users"), {
//       blockedBy: currentUid,
//       blockedUserId: userId,
//       blockedAt: serverTimestamp(),
//     });

//     alert("User blocked");
//     navigate(-1);
//   };

//   /* ================= STATES ================= */
//   if (loading) return <div style={styles.center}>Loading…</div>;
//   if (!profile) return <div style={styles.center}>Profile not found</div>;

//   const fullName =
//     `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "User";

//   /* ================= UI ================= */
//   return (
//     <div style={styles.page}>
//       {/* HEADER */}
//       <div style={styles.header}>
//         <button onClick={() => navigate(-1)} style={styles.iconBtn}>
//           <FiArrowLeft />
//         </button>

//         <div>
//           <button onClick={blockUser} style={styles.iconBtn}>
//             Report / Block
//           </button>
//           <button onClick={shareProfile} style={styles.iconBtn}>
//             <FiShare2 />
//           </button>
//         </div>
//       </div>

//       {/* PROFILE CARD */}
//       <div style={styles.card}>
//         <img
//           src={profile.profileImage || "/assets/profile.png"}
//           alt="profile"
//           style={styles.avatar}
//         />

//         <h3>{fullName}</h3>
//         <p style={styles.subtitle}>
//           {profile.sector || "No Title"} · {profile.location || "India"}
//         </p>

//         {isAccepted ? (
//           <button style={styles.primary}>Message</button>
//         ) : isRequested ? (
//           <button style={styles.disabled}>Requested</button>
//         ) : (
//           <button style={styles.primary} onClick={sendRequest}>
//             Connect
//           </button>
//         )}
//       </div>

//       {/* ABOUT */}
//       <Section title="About">
//         <p>{profile.about || "No description available"}</p>
//       </Section>

//       <Section title="Industry">{profile.sector}</Section>
//       <Section title="Category">{profile.category}</Section>
//       <Section title="Company Size">{profile.team_size}</Section>
//       <Section title="Email">{profile.email}</Section>

//       {/* SERVICES */}
//       <div style={styles.tabs}>
//         <button
//           onClick={() => setActiveTab("work")}
//           style={activeTab === "work" ? styles.tabActive : styles.tab}
//         >
//           Work
//         </button>
//         <button
//           onClick={() => setActiveTab("24h")}
//           style={activeTab === "24h" ? styles.tabActive : styles.tab}
//         >
//           24 Hour
//         </button>
//       </div>

//       {activeTab === "work" ? (
//         <ServicesList uid={userId} collectionName="jobs" />
//       ) : (
//         <ServicesList uid={userId} collectionName="jobs_24h" />
//       )}
//     </div>
//   );
// }

// /* ======================================================
//    SERVICES LIST
// ====================================================== */
// function ServicesList({ uid, collectionName }) {
//   const db = getFirestore();
//   const [items, setItems] = useState([]);

//   useEffect(() => {
//     const q = query(collection(db, collectionName), where("userId", "==", uid));
//     const unsub = onSnapshot(q, snap => {
//       setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
//     });
//     return () => unsub();
//   }, [db, uid, collectionName]);

//   if (!items.length) {
//     return <div style={styles.center}>No services available</div>;
//   }

//   return (
//     <div>
//       {items.map(job => (
//         <div key={job.id} style={styles.jobCard}>
//           <div style={styles.jobHeader}>
//             <h4>{job.title}</h4>
//             <FiMoreHorizontal />
//           </div>

//           <p style={styles.price}>
//             ₹ {job.budget_from || job.budget || 0}
//           </p>

//           <p style={styles.desc}>{job.description}</p>

//           <div style={styles.chips}>
//             {[...(job.skills || []), ...(job.tools || [])]
//               .slice(0, 3)
//               .map((s, i) => (
//                 <span key={i} style={styles.chip}>
//                   {s}
//                 </span>
//               ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// /* ======================================================
//    HELPERS
// ====================================================== */
// function Section({ title, children }) {
//   return (
//     <div style={styles.section}>
//       <h4>{title}</h4>
//       {children}
//     </div>
//   );
// }

// /* ======================================================
//    STYLES
// ====================================================== */
// const styles = {
//   page: {
//     maxWidth: 420,
//     margin: "0 auto",
//     background: "#f6f6f6",
//     minHeight: "100vh",
//     fontFamily: "Inter, sans-serif",
//   },
//   center: {
//     padding: 40,
//     textAlign: "center",
//   },
//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     padding: 16,
//   },
//   iconBtn: {
//     background: "rgba(0,0,0,0.3)",
//     border: "none",
//     borderRadius: "50%",
//     padding: 8,
//     color: "#fff",
//     marginLeft: 6,
//     cursor: "pointer",
//   },
//   card: {
//     background: "#fff",
//     margin: 16,
//     padding: 16,
//     borderRadius: 16,
//     textAlign: "center",
//   },
//   avatar: {
//     width: 80,
//     height: 80,
//     borderRadius: 12,
//     objectFit: "cover",
//   },
//   subtitle: {
//     color: "#666",
//     fontSize: 13,
//   },
//   primary: {
//     background: "#FDFD96",
//     border: "none",
//     padding: "10px 24px",
//     borderRadius: 24,
//     fontWeight: 600,
//     cursor: "pointer",
//   },
//   disabled: {
//     background: "#ddd",
//     border: "none",
//     padding: "10px 24px",
//     borderRadius: 24,
//   },
//   section: {
//     background: "#fff",
//     margin: "12px 16px",
//     padding: 16,
//     borderRadius: 16,
//   },
//   tabs: {
//     display: "flex",
//     justifyContent: "center",
//     marginTop: 16,
//   },
//   tab: {
//     padding: "10px 20px",
//     border: "none",
//     background: "transparent",
//     cursor: "pointer",
//   },
//   tabActive: {
//     padding: "10px 20px",
//     borderBottom: "3px solid black",
//     fontWeight: 600,
//     background: "transparent",
//   },
//   jobCard: {
//     background: "#fff",
//     margin: "12px 16px",
//     padding: 16,
//     borderRadius: 16,
//   },
//   jobHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//   },
//   price: {
//     fontWeight: 600,
//     marginTop: 6,
//   },
//   desc: {
//     fontSize: 13,
//     marginTop: 6,
//   },
//   chips: {
//     display: "flex",
//     gap: 6,
//     marginTop: 10,
//   },
//   chip: {
//     background: "#FFF7C2",
//     padding: "4px 10px",
//     borderRadius: 14,
//     fontSize: 12,
//   },
// };












// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   collection,
//   doc,
//   getDoc,
//   getDocs,
//   onSnapshot,
//   query,
//   where,
//   orderBy,
//   deleteDoc,
//   addDoc,
//   serverTimestamp,
// } from "firebase/firestore";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { db } from "../firbase/Firebase";
// import ReportBlockPopup from "./BlockPopup.jsx";
// import { FiMoreVertical, FiTrash2 } from "react-icons/fi";

// /* ======================================================
//    FREELANCER FULL DETAIL – SINGLE PAGE (FIXED)
// ====================================================== */

// export default function FreelancerFullDetailScreen() {
//   const { userId, jobid } = useParams();
//   const navigate = useNavigate();
//   const auth = getAuth();
//   const currentUid = auth.currentUser?.uid;

//   /* ================= STATE ================= */
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [currentUser, setCurrentUser] = useState(null);

//   const [isRequested, setIsRequested] = useState(false);
//   const [isAccepted, setIsAccepted] = useState(false);
//   const [showBlockPopup, setShowBlockPopup] = useState(false);

//   const [activeTab, setActiveTab] = useState("work");
//   const [myServices, setMyServices] = useState([]);
//   const [my24hServices, setMy24hServices] = useState([]);
//   const user = auth.currentUser;
//   const [portfolio, setPortfolio] = useState([]);
//   const [skills, setSkills] = useState([]);
//   const [tools, setTools] = useState([]);
//   const [tempSkills, setTempSkills] = useState("");
//   const [tempTools, setTempTools] = useState("");
//   /* ================= AUTH ================= */
//     useEffect(() => {
//     if (!user) return;

//     const q = query(
//       collection(db, "users", user.uid, "portfolio"),
//       orderBy("createdAt", "desc")
//     );

//     const unsub = onSnapshot(q, (snap) => {
//       setPortfolio(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//     });

//     return () => unsub();
//   }, [user]);

//   const deletePortfolio = async (id) => {
//     const ok = window.confirm("Delete this portfolio?");
//     if (!ok) return;

//     await deleteDoc(doc(db, "users", user.uid, "portfolio", id));
//   };

//     useEffect(() => {
//     if (!user) return;

//     const fetchData = async () => {
//       const snap = await getDoc(doc(db, "users", user.uid));
//       if (snap.exists()) {
//         setSkills(snap.data().skills || []);
//         setTools(snap.data().tools || []);
//       }
//     };

//     fetchData();
//   }, [user]);

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (u) => {
//       if (!u) return navigate("/firelogin");
//       setCurrentUser(u);
//     });
//     return () => unsub();
//   }, [auth, navigate]);

//   /* ================= PROFILE ================= */
//   useEffect(() => {
//     if (!userId) return;

//     const unsub = onSnapshot(doc(db, "users", userId), (snap) => {
//       if (snap.exists()) {
//         setProfile({ id: snap.id, ...snap.data() });
//         setLoading(false);
//       } else {
//         setProfile(null);
//         setLoading(false);
//       }
//     });

//     checkRequested();
//     checkAccepted();

//     return () => unsub();
//   }, [userId]);

//   /* ================= REQUEST STATUS ================= */
//   const checkRequested = async () => {
//     if (!currentUid || !userId) return;

//     const q = query(
//       collection(db, "collaboration_requests"),
//       where("clientId", "==", currentUid),
//       where("freelancerId", "==", userId),
//       where("status", "==", "sent")
//     );

//     const snap = await getDocs(q);
//     setIsRequested(!snap.empty);
//   };

//   const checkAccepted = async () => {
//     if (!currentUid || !userId || !jobid) return;

//     const q = query(
//       collection(db, "accepted_jobs"),
//       where("clientId", "==", currentUid),
//       where("freelancerId", "==", userId),
//       where("jobId", "==", jobid)
//     );

//     const snap = await getDocs(q);
//     setIsAccepted(!snap.empty);
//   };

//   /* ================= SERVICES ================= */
//   useEffect(() => {
//     if (!userId) return;

//     const q1 = query(
//       collection(db, "users", userId, "services"),
//       orderBy("createdAt", "desc")
//     );

//     const q2 = query(
//       collection(db, "users", userId, "services_24h"),
//       orderBy("createdAt", "desc")
//     );

//     const u1 = onSnapshot(q1, (s) =>
//       setMyServices(s.docs.map((d) => ({ id: d.id, ...d.data() })))
//     );

//     const u2 = onSnapshot(q2, (s) =>
//       setMy24hServices(s.docs.map((d) => ({ id: d.id, ...d.data() })))
//     );

//     return () => {
//       u1();
//       u2();
//     };
//   }, [userId]);

//   /* ================= ACTIONS ================= */
//   const sendRequest = async (title, description, job) => {
//     if (!currentUid) return;

//     await addDoc(collection(db, "collaboration_requests"), {
//       clientId: currentUid,
//       freelancerId: userId,
//       title,
//       description,
//       jobId: job?.id || null,
//       jobType: job?.type || null,
//       status: "sent",
//       timestamp: serverTimestamp(),
//     });

//     setIsRequested(true);
//     alert("Request sent successfully ✅");
//   };

//   const shareProfile = async () => {
//     const name = `${profile?.first_name || ""} ${profile?.last_name || ""}`;
//     const link = window.location.href;

//     if (navigator.share) {
//       await navigator.share({
//         title: name,
//         text: `Check out ${name}'s profile`,
//         url: link,
//       });
//     } else {
//       alert("Sharing not supported");
//     }
//   };

//   /* ================= UI ================= */
//   if (loading) {
//     return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;
//   }

//   if (!profile) {
//     return <div style={{ padding: 40, textAlign: "center" }}>User not found</div>;
//   }

//   const skills = profile.skills || [];
//   const tools = profile.tools || [];

//   return (
//     <div style={{ background: "#F6F6F6", minHeight: "100vh" }}>
//       {/* HEADER */}
//       <div style={{ background: "#fff", paddingBottom: 40 }}>
//         <div
//           style={{
//             height: 220,
//             background: `url(${profile.coverImage || ""}) center/cover`,
//           }}
//         />

//         <img
//           src={profile.profileImage || "/assets/profile.png"}
//           alt="profile"
//           style={{
//             width: 120,
//             height: 120,
//             borderRadius: "50%",
//             marginTop: -60,
//             marginLeft: 20,
//             border: "4px solid #fff",
//           }}
//         />

//         <button onClick={shareProfile} style={{ marginLeft: 20 }}>
//           Share
//         </button>

//         {currentUid && currentUid !== userId && (
//           <button
//             onClick={() => setShowBlockPopup(true)}
//             style={{
//               marginLeft: 12,
//               padding: "8px 16px",
//               background: "#ff4444",
//               color: "#fff",
//               border: "none",
//               borderRadius: 10,
//               cursor: "pointer",
//             }}
//           >
//             Block / Report
//           </button>
//         )}
//       </div>

//       <div style={{ padding: 20 }}>
//         <h2>
//           {profile.first_name} {profile.last_name}
//         </h2>

//         <div style={{ color: "#6b7280" }}>{profile.email}</div>

//         <p>
//           {profile.sector || ""} · {profile.location || "India"}
//         </p>

//         <p style={{ opacity: 0.7 }}>
//           {profile.professional_title || "Freelancer"}
//         </p>
//       </div>

//       {/* BLOCK POPUP */}
//       {showBlockPopup && (
//         <ReportBlockPopup
//           freelancerId={userId}
//           freelancerName={`${profile.first_name} ${profile.last_name}`}
//           onClose={() => setShowBlockPopup(false)}
//         />
//       )}

//       {/* ABOUT */}
//       <Section title="About">
//         <p>{profile.about || "No description available."}</p>

//         {(skills.length > 0 || tools.length > 0) && (
//           <>
//             <h4 style={{ marginTop: 16 }}>Skills & Tools</h4>
//             <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//               {[...skills, ...tools].map((s) => (
//                 <span key={s} style={chip}>{s}</span>
//               ))}
//             </div>
//           </>
//         )}
//       </Section>
//           <div style={styles.card}>
//       {/* HEADER */}
//       <div style={styles.headerRow}>
//         <h3>Skills</h3>
//         {!editing && (
//           <button style={styles.editBtn} onClick={startEdit}>
//             Edit
//           </button>
//         )}
//       </div>

//       {/* SKILLS */}
//       <div style={styles.chipWrap}>
//         {skills.length === 0 && <span style={styles.empty}>No skills added</span>}
//         {skills.map((s) => (
//           <span key={s} style={styles.chip}>
//             {s}
//           </span>
//         ))}
//       </div>

//       <h3 style={{ marginTop: 24 }}>Tools</h3>

//       {/* TOOLS */}
//       <div style={styles.chipWrap}>
//         {tools.length === 0 && <span style={styles.empty}>No tools added</span>}
//         {tools.map((t) => (
//           <span key={t} style={styles.chip}>
//             {t}
//           </span>
//         ))}
//       </div>

//       {/* EDIT MODE */}
//       {editing && (
//         <div style={{ marginTop: 20 }}>
//           <label style={styles.label}>Edit Skills (comma separated)</label>
//           <input
//             value={tempSkills}
//             onChange={(e) => setTempSkills(e.target.value)}
//             placeholder="Video Editing, Colour Grading"
//             style={styles.input}
//           />

//           <label style={styles.label}>Edit Tools (comma separated)</label>
//           <input
//             value={tempTools}
//             onChange={(e) => setTempTools(e.target.value)}
//             placeholder="Adobe Premiere Pro, After Effects"
//             style={styles.input}
//           />

//           <div style={styles.actionRow}>
//             <button style={styles.saveBtn} onClick={saveData}>
//               Save
//             </button>
//             <button
//               style={styles.cancelBtn}
//               onClick={() => setEditing(false)}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
//       <div style={styles.wrapper}>
//       {/* HEADER */}
//       <div style={styles.header}>
//         <h3>Portfolio</h3>
//         <span style={styles.viewAll}>View All</span>
//       </div>

//       {/* CARDS */}
//       <div style={styles.scrollRow}>
//         {portfolio.map((p) => (
//           <div
//             key={p.id}
//             style={styles.card}
//             onClick={() => p.projectUrl && window.open(p.projectUrl, "_blank")}
//           >
//             {/* IMAGE */}
//             <div style={styles.imageWrap}>
//               <img
//                 src={p.imageUrl || "/placeholder-portfolio.jpg"}
//                 alt={p.title}
//                 style={styles.image}
//               />
//             </div>

//             {/* CONTENT */}
//             <div style={styles.body}>
//               <div style={styles.titleRow}>
//                 <h4>{p.title}</h4>

//                 <div style={styles.menu}>
//                   <FiTrash2
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       deletePortfolio(p.id);
//                     }}
//                     style={{ cursor: "pointer" }}
//                   />
//                 </div>
//               </div>

//               <p style={styles.desc}>{p.description}</p>

//               <div style={styles.tags}>
//                 {(p.skills || []).slice(0, 2).map((s) => (
//                   <span key={s} style={styles.tagYellow}>
//                     {s}
//                   </span>
//                 ))}

//                 {(p.tools || []).slice(0, 1).map((t) => (
//                   <span key={t} style={styles.tagGray}>
//                     {t}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         ))}

//         {portfolio.length === 0 && (
//           <div style={{ opacity: 0.6 }}>No portfolio added</div>
//         )}
//       </div>
//     </div>
//   );


//       {/* SERVICES */}
//       <Section title="Services">
//         <div style={{ display: "flex", gap: 12 }}>
//           <button
//             onClick={() => setActiveTab("work")}
//             style={activeTab === "work" ? tabActive : tab}
//           >
//             Work
//           </button>
//           <button
//             onClick={() => setActiveTab("24h")}
//             style={activeTab === "24h" ? tabActive : tab}
//           >
//             24 Hour
//           </button>
//         </div>

//         {activeTab === "work" &&
//           (myServices.length === 0
//             ? <Empty text="No work services" />
//             : myServices.map((s) => <ServiceCard key={s.id} job={s} />))}

//         {activeTab === "24h" &&
//           (my24hServices.length === 0
//             ? <Empty text="No 24h services" />
//             : my24hServices.map((s) => <ServiceCard key={s.id} job={s} />))}
//       </Section>
//     </div>
//   );
// }

// /* ======================================================
//    SMALL COMPONENTS
// ====================================================== */

// const Section = ({ title, children }) => (
//   <div style={{ background: "#fff", marginTop: 12, padding: 20 }}>
//     <h3>{title}</h3>
//     {children}
//   </div>
// );

// const ServiceCard = ({ job }) => {
//   const skills = [...(job.skills || []), ...(job.tools || [])].slice(0, 3);

//   return (
    
//     <div style={{ background: "#FFFDE7", borderRadius: 16, padding: 16, marginTop: 12 }}>


//       <div style={{ display: "flex", justifyContent: "space-between" }}>
//         <h4>{job.title}</h4>
//         <strong>₹ {job.budget_from || job.budget || 0}</strong>
//       </div>

//       <p style={{ fontSize: 13 }}>{job.description}</p>

//       <div style={{ display: "flex", gap: 8 }}>
//         {skills.map((s) => (
//           <span key={s} style={chipSmall}>{s}</span>
//         ))}
//       </div>
//     </div>
//   );
// };

// const Empty = ({ text }) => (
//   <div style={{ textAlign: "center", padding: 30, opacity: 0.6 }}>{text}</div>
// );

// /* ================= STYLES ================= */

// const chip = {
//   padding: "6px 14px",
//   background: "#EEE",
//   borderRadius: 20,
//   fontSize: 13,
// };

// const chipSmall = {
//   padding: "4px 10px",
//   background: "#FFF7C2",
//   borderRadius: 14,
//   fontSize: 12,
// };

// const tab = {
//   padding: "8px 20px",
//   borderRadius: 20,
//   border: "1px solid #ccc",
//   background: "#fff",
// };

// const tabActive = {
//   ...tab,
//   background: "#FDFD96",
//   border: "none",
// };



// const styles = {
//   wrapper: {
//     background: "#fff",
//     borderRadius: 20,
//     padding: 20,
//     boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
//   },

//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     marginBottom: 14,
//   },

//   viewAll: {
//     color: "#6b7280",
//     fontSize: 14,
//     cursor: "pointer",
//   },

//   scrollRow: {
//     display: "flex",
//     gap: 16,
//     overflowX: "auto",
//     paddingBottom: 10,
//   },

//   card: {
//     minWidth: 260,
//     maxWidth: 260,
//     borderRadius: 16,
//     overflow: "hidden",
//     background: "#fff",
//     border: "1px solid #eee",
//     cursor: "pointer",
//     flexShrink: 0,
//   },

//   imageWrap: {
//     height: 140,
//     background: "#00c2e8",
//   },

//   image: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover",
//   },

//   body: {
//     padding: 14,
//   },

//   titleRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },

//   desc: {
//     fontSize: 13,
//     opacity: 0.75,
//     marginTop: 6,
//   },

//   tags: {
//     display: "flex",
//     gap: 6,
//     flexWrap: "wrap",
//     marginTop: 10,
//   },

//   tagYellow: {
//     background: "#FFF8C2",
//     padding: "4px 8px",
//     borderRadius: 12,
//     fontSize: 11,
//     fontWeight: 600,
//   },

//   tagGray: {
//     background: "#F1F1F1",
//     padding: "4px 8px",
//     borderRadius: 12,
//     fontSize: 11,
//     fontWeight: 600,
//   },
//     card: {
//     background: "#FFFEEF",
//     borderRadius: 28,
//     padding: 28,
//     width: 320,
//     boxShadow: "0 14px 30px rgba(0,0,0,0.12)",
//   },

//   headerRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },

//   editBtn: {
//     border: "none",
//     background: "#000",
//     color: "#fff",
//     padding: "6px 14px",
//     borderRadius: 14,
//     cursor: "pointer",
//     fontSize: 12,
//   },

//   chipWrap: {
//     display: "flex",
//     gap: 10,
//     flexWrap: "wrap",
//     marginTop: 14,
//   },

//   chip: {
//     background: "#FFF9A8",
//     padding: "8px 14px",
//     borderRadius: 18,
//     fontSize: 13,
//     fontWeight: 600,
//   },

//   empty: {
//     fontSize: 13,
//     opacity: 0.6,
//   },

//   label: {
//     display: "block",
//     marginTop: 12,
//     fontSize: 13,
//     fontWeight: 600,
//   },

//   input: {
//     width: "100%",
//     marginTop: 6,
//     padding: "10px 12px",
//     borderRadius: 12,
//     border: "1px solid #ddd",
//     outline: "none",
//   },

//   actionRow: {
//     display: "flex",
//     gap: 10,
//     marginTop: 14,
//   },

//   saveBtn: {
//     flex: 1,
//     background: "#000",
//     color: "#fff",
//     border: "none",
//     padding: "10px",
//     borderRadius: 16,
//     cursor: "pointer",
//   },

//   cancelBtn: {
//     flex: 1,
//     background: "#eee",
//     border: "none",
//     padding: "10px",
//     borderRadius: 16,
//     cursor: "pointer",
//   },
// };\







// import React, { useEffect, useMemo, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   query,
//   where,
//   orderBy,
//   updateDoc,
//   deleteDoc,
//   serverTimestamp,
// } from "firebase/firestore";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { db } from "../firbase/Firebase";

// import share from "../assets/share.png";
// import block_report from "../assets/block_report.png";
// import ReportBlockPopup from "./BlockPopup.jsx";
// import { FiTrash2 } from "react-icons/fi";

// /* ======================================================
//    FREELANCER FULL DETAIL – FINAL (BACKEND FIXED)
// ====================================================== */

// export default function FreelancerFullDetailScreen() {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const auth = getAuth();

//   const [currentUser, setCurrentUser] = useState(null);
//   const [profile, setProfile] = useState(null);
//   const [loadingProfile, setLoadingProfile] = useState(true);

//   const [services, setServices] = useState([]);
//   const [services24, setServices24] = useState([]);
//   const [loadingServices, setLoadingServices] = useState(true);

//   const [portfolio, setPortfolio] = useState([]);

//   const [activeTab, setActiveTab] = useState("works"); // works | 24h
//   const [search, setSearch] = useState("");
//   const [sort, setSort] = useState("newest");
//   const [showBlockPopup, setShowBlockPopup] = useState(false);

//   /* ================= AUTH ================= */
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => {
//       if (!u) navigate("/firelogin");
//       setCurrentUser(u);
//     });
//     return () => unsub();
//   }, [auth, navigate]);

//   /* ================= PROFILE ================= */
//   useEffect(() => {
//     if (!userId) return;

//     const unsub = onSnapshot(doc(db, "users", userId), (snap) => {
//       setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null);
//       setLoadingProfile(false);
//     });

//     return () => unsub();
//   }, [userId]);

//   /* ================= SERVICES ================= */
//   useEffect(() => {
//     if (!userId) return;

//     const q1 = query(
//       collection(db, "users", userId, "services"),
//       orderBy("createdAt", "desc")
//     );

//     const q2 = query(
//       collection(db, "users", userId, "services_24h"),
//       orderBy("createdAt", "desc")
//     );

//     const u1 = onSnapshot(q1, (s) => {
//       setServices(s.docs.map((d) => ({ id: d.id, ...d.data() })));
//       setLoadingServices(false);
//     });

//     const u2 = onSnapshot(q2, (s) => {
//       setServices24(s.docs.map((d) => ({ id: d.id, ...d.data() })));
//       setLoadingServices(false);
//     });

//     return () => {
//       u1();
//       u2();
//     };
//   }, [userId]);

//   /* ================= PORTFOLIO ================= */
//   useEffect(() => {
//     if (!currentUser) return;

//     const q = query(
//       collection(db, "users", currentUser.uid, "portfolio"),
//       orderBy("createdAt", "desc")
//     );

//     const unsub = onSnapshot(q, (snap) => {
//       setPortfolio(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//     });

//     return () => unsub();
//   }, [currentUser]);

//   const deletePortfolio = async (id) => {
//     if (!currentUser) return;
//     if (!window.confirm("Delete this portfolio?")) return;

//     await deleteDoc(doc(db, "users", currentUser.uid, "portfolio", id));
//   };

//   /* ================= HELPERS ================= */
//   const togglePause = async (job) => {
//     const col =
//       activeTab === "works" ? "services" : "services_24h";

//     await updateDoc(
//       doc(db, "users", userId, col, job.id),
//       {
//         paused: !job.paused,
//         pausedAt: !job.paused ? serverTimestamp() : null,
//       }
//     );
//   };

//   const formatBudget = (v) => {
//     if (!v) return "0";
//     if (v >= 100000) return (v / 100000).toFixed(1) + "L";
//     if (v >= 1000) return (v / 1000).toFixed(1) + "k";
//     return v;
//   };

//   const filteredData = useMemo(() => {
//     let data = activeTab === "works" ? services : services24;

//     if (search) {
//       data = data.filter((i) =>
//         (i.title || "").toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     if (sort === "paused") {
//       data = data.filter((i) => i.paused);
//     } else if (sort === "oldest") {
//       data = [...data].sort(
//         (a, b) =>
//           (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0)
//       );
//     } else {
//       data = [...data].sort(
//         (a, b) =>
//           (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
//       );
//     }

//     return data;
//   }, [services, services24, activeTab, search, sort]);

//   /* ================= UI ================= */
//   if (loadingProfile) {
//     return <div style={{ padding: 40 }}>Loading...</div>;
//   }

//   if (!profile) {
//     return <div style={{ padding: 40 }}>User not found</div>;
//   }

//   return (
//     <div style={{ background: "#F6F6F6", minHeight: "100vh" }}>
//       {/* HEADER */}
//       <h1>Freelancer Profile</h1>
//       <div style={{ background: "#fff", paddingBottom: 40 }}>
//         <div
//           style={{
//             height: 220,
//             background: `url(${profile.coverImage || ""}) center/cover`,
//           }}
//         />

//         <img
//           src={profile.profileImage || "/assets/profile.png"}
//           alt="profile"
//           style={{
//             width: 120,
//             height: 120,
//             borderRadius: "50%",
//             marginTop: -60,
//             marginLeft: 20,
//             border: "4px solid #fff",
//           }}
//         />

//         <button onClick={shareProfile} style={{ marginLeft: 20 }}>
//             <img src={share} alt="share" />
//           Share this profile
//         </button>

//         {currentUser?.uid !== userId && (
//           <button
//             onClick={() => setShowBlockPopup(true)}
//             style={btnDanger}
//           >
//             <img src={block_report} alt="block_report" />
            
//             Block / Report
//           </button>
//         )}
//       </div>

//       {/* BASIC INFO */}
//       <div style={{ padding: 20 }}>
//         <h2>{profile.first_name} {profile.last_name}</h2>
//         <div style={{ color: "#6b7280" }}>{profile.email}</div>
//         <p>{profile.sector || ""} · {profile.location || "India"}</p>
//         <p style={{ opacity: 0.7 }}>
//           {profile.professional_title || "Freelancer"}
//         </p>
//       </div>

//       {/* BLOCK POPUP */}
//       {showBlockPopup && (
//         <ReportBlockPopup
//           freelancerId={userId}
//           freelancerName={`${profile.first_name} ${profile.last_name}`}
//           onClose={() => setShowBlockPopup(false)}
//         />
//       )}

//       {/* ABOUT */}
//       <Section title="About">
//         <p>{profile.about || "No description available."}</p>
//       </Section>

//       {/* SKILLS & TOOLS CARD */}
//       <div style={skillsCard}>
//         <h3>Skills</h3>
//         <div style={chipWrap}>
//           {skills.length
//             ? skills.map((s) => <span key={s} style={chipYellow}>{s}</span>)
//             : <span style={muted}>No skills</span>}
//         </div>

//         <h3 style={{ marginTop: 24 }}>Tools</h3>
//         <div style={chipWrap}>
//           {tools.length
//             ? tools.map((t) => <span key={t} style={chipYellow}>{t}</span>)
//             : <span style={muted}>No tools</span>}
//         </div>
//       </div>

//       {/* PORTFOLIO */}
//       <div style={portfolioWrapper}>
//         <h3>Portfolio</h3>
//         <div style={portfolioRow}>
//           {portfolio.map((p) => (
//             <div key={p.id} style={portfolioCard}>
//               <div style={portfolioImgWrap}>
//                 <img src={p.imageUrl} alt="" style={portfolioImg} />
//               </div>

//               <div style={{ padding: 14 }}>
//                 <div style={portfolioTitleRow}>
//                   <h4>{p.title}</h4>
//                   <FiTrash2
//                     style={{ cursor: "pointer" }}
//                     onClick={() => deletePortfolio(p.id)}
//                   />
//                 </div>
//                 <p style={portfolioDesc}>{p.description}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div style={styles.wrapper}>
//       {/* HEADER */}
//       <div style={styles.header}>
//         <h3>Posted Jobs</h3>

//         <div style={styles.toggleWrap}>
//           <button
//             onClick={() => setActiveTab("works")}
//             style={activeTab === "works" ? styles.toggleActive : styles.toggle}
//           >
//             Works
//           </button>
//           <button
//             onClick={() => setActiveTab("24h")}
//             style={activeTab === "24h" ? styles.toggleActive : styles.toggle}
//           >
//             24 Hours
//           </button>
//         </div>
//       </div>

//       {/* SEARCH + SORT */}
//       <div style={styles.searchRow}>
//         <input
//           placeholder="Search services"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           style={styles.search}
//         />

//         <select
//           value={sort}
//           onChange={(e) => setSort(e.target.value)}
//           style={styles.select}
//         >
//           <option value="newest">Newest</option>
//           <option value="oldest">Oldest</option>
//           <option value="paused">Paused</option>
//         </select>
//       </div>

//       {/* CARDS */}
//       {loading ? (
//         <p style={{ padding: 30 }}>Loading...</p>
//       ) : data.length === 0 ? (
//         <p style={{ padding: 30, opacity: 0.6 }}>No services found</p>
//       ) : (
//         data.map((job) => (
//           <div key={job.id} style={styles.card}>
//             <div style={styles.topRow}>
//               <div style={styles.avatar}>2H</div>

//               <div style={{ flex: 1 }}>
//                 <h4>{job.title}</h4>

//                 <div style={styles.chips}>
//                   {job.skills?.slice(0, 2).map((s) => (
//                     <span key={s} style={styles.chip}>{s}</span>
//                   ))}
//                   {job.skills?.length > 2 && (
//                     <span style={styles.more}>+{job.skills.length - 2}</span>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div style={styles.meta}>
//               <div>
//                 <div style={styles.label}>Budget</div>
//                 <div style={styles.value}>
//                   ₹{formatBudget(job.budget_from || job.budget)}
//                 </div>
//               </div>

//               <div>
//                 <div style={styles.label}>Timeline</div>
//                 <div style={styles.value}>
//                   {job.deliveryDuration || "N/A"}
//                 </div>
//               </div>

//               <div>
//                 <div style={styles.label}>Location</div>
//                 <div style={styles.value}>
//                   {job.location || "Remote"}
//                 </div>
//               </div>
//             </div>

//             <div style={styles.actions}>
//               <button
//                 style={styles.pauseBtn}
//                 onClick={() =>
//                   togglePause(job, activeTab === "works" ? "services" : "service_24h")
//                 }
//               >
//                 {job.paused ? "Unpause Service" : "Pause Service"}
//               </button>

//               <button
//                 style={styles.editBtn}
//                 onClick={() =>
//                   navigate(
//                     activeTab === "works"
//                       ? `/freelance-dashboard/freelanceredit-service/${job.id}`
//                       : `/service-24h-edit/${job.id}`,
//                     { state: { job } }
//                   )
//                 }
//               >
//                 Edit Service
//               </button>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
// </div>
  


//   );
// }


// const styles = {
//   wrapper: {
//     background: "#fff",
//     borderRadius: 20,
//     padding: 20,
//     boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
//   },

//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },

//   toggleWrap: {
//     background: "#FFF8E1",
//     padding: 6,
//     borderRadius: 16,
//     display: "flex",
//     gap: 6,
//   },

//   toggle: {
//     padding: "8px 22px",
//     borderRadius: 12,
//     border: "none",
//     background: "transparent",
//     cursor: "pointer",
//     fontWeight: 600,
//   },

//   toggleActive: {
//     padding: "8px 22px",
//     borderRadius: 12,
//     border: "none",
//     background: "#fff",
//     cursor: "pointer",
//     fontWeight: 700,
//   },

//   searchRow: {
//     display: "flex",
//     gap: 12,
//     marginTop: 16,
//   },

//   search: {
//     flex: 1,
//     height: 42,
//     borderRadius: 14,
//     border: "1px solid #ddd",
//     paddingLeft: 14,
//   },

//   select: {
//     height: 42,
//     borderRadius: 14,
//     border: "1px solid #ddd",
//     padding: "0 12px",
//   },

//   card: {
//     border: "1px solid #E0E0E0",
//     borderRadius: 20,
//     padding: 20,
//     marginTop: 20,
//   },

//   topRow: {
//     display: "flex",
//     gap: 16,
//   },

//   avatar: {
//     width: 56,
//     height: 56,
//     borderRadius: 16,
//     background: "linear-gradient(135deg, #6A5CFF, #9B42FF)",
//     color: "#fff",
//     fontWeight: 800,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   chips: {
//     display: "flex",
//     gap: 8,
//     marginTop: 6,
//     flexWrap: "wrap",
//   },

//   chip: {
//     background: "#FFF7A8",
//     padding: "4px 12px",
//     borderRadius: 16,
//     fontSize: 13,
//     fontWeight: 600,
//   },

//   more: {
//     background: "#FFF7A8",
//     padding: "4px 12px",
//     borderRadius: 16,
//     fontSize: 13,
//   },

//   meta: {
//     display: "flex",
//     justifyContent: "space-between",
//     marginTop: 16,
//   },

//   label: {
//     fontSize: 13,
//     opacity: 0.6,
//   },

//   value: {
//     fontSize: 14,
//     fontWeight: 700,
//     marginTop: 2,
//   },

//   actions: {
//     display: "flex",
//     gap: 12,
//     marginTop: 18,
//   },

//   pauseBtn: {
//     flex: 1,
//     height: 40,
//     borderRadius: 30,
//     border: "1px solid #bbb",
//     background: "#fff",
//     fontWeight: 600,
//   },

//   editBtn: {
//     flex: 1,
//     height: 40,
//     borderRadius: 30,
//     border: "none",
//     background: "#FFF97A",
//     fontWeight: 700,
//   },
// };

// /* ================= STYLES ================= */

// const btnDanger = {
//   marginLeft: 12,
//   padding: "8px 16px",
//   border: "none",
//   borderRadius: 10,
//   cursor: "pointer",
// };

// const skillsCard = {
//   background: "#FFFEEF",
//   borderRadius: 28,
//   padding: 28,
//   width: 320,
//   margin: 20,
//   boxShadow: "0 14px 30px rgba(0,0,0,0.12)",
// };

// const chipWrap = { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 };
// const chipYellow = { background: "#FFF9A8", padding: "8px 14px", borderRadius: 18, fontWeight: 600 };
// const muted = { opacity: 0.6 };

// const portfolioWrapper = { background: "#fff", margin: 20, padding: 20, borderRadius: 20 };
// const portfolioRow = { display: "flex", gap: 16, overflowX: "auto" };
// const portfolioCard = { width: 260, border: "1px solid #eee", borderRadius: 16, overflow: "hidden" };
// const portfolioImgWrap = { height: 140, background: "#00c2e8" };
// const portfolioImg = { width: "100%", height: "100%", objectFit: "cover" };
// const portfolioTitleRow = { display: "flex", justifyContent: "space-between", alignItems: "center" };
// const portfolioDesc = { fontSize: 13, opacity: 0.7 };

// const tab = { padding: "8px 20px", borderRadius: 20, border: "1px solid #ccc" };
// const tabActive = { ...tab, background: "#FDFD96", border: "none" };

// const serviceCard = { background: "#FFFDE7", padding: 16, borderRadius: 16, marginTop: 12 };





import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firbase/Firebase";
import { FiTrash2 } from "react-icons/fi";
import { Share2, ArrowLeft, Flag } from 'lucide-react';

import share from "../assets/share.png";
import block_report from "../assets/block_report.png";
import ReportBlockPopup from "./BlockPopup.jsx";

/* ======================================================
   FREELANCER FULL DETAIL SCREEN - ERROR FREE VERSION
====================================================== */

export default function FreelancerFullDetailScreen() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();

  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [services, setServices] = useState([]);
  const [services24, setServices24] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const [portfolio, setPortfolio] = useState([]);

  const [activeTab, setActiveTab] = useState("works"); // works | 24h
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [showBlockPopup, setShowBlockPopup] = useState(false);

  /* ================= AUTH ================= */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) navigate("/firelogin");
      setCurrentUser(u);
    });
    return () => unsub();
  }, [auth, navigate]);

  /* ================= PROFILE ================= */
  useEffect(() => {
    if (!userId) return;

    const unsub = onSnapshot(doc(db, "users", userId), (snap) => {
      setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      setLoadingProfile(false);
    });

    return () => unsub();
  }, [userId]);

  /* ================= SERVICES ================= */
  useEffect(() => {
    if (!userId) return;

    const q1 = query(
      collection(db, "users", userId, "services"),
      orderBy("createdAt", "desc")
    );

    const q2 = query(
      collection(db, "users", userId, "services_24h"),
      orderBy("createdAt", "desc")
    );

    const u1 = onSnapshot(q1, (s) => {
      setServices(s.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoadingServices(false);
    });

    const u2 = onSnapshot(q2, (s) => {
      setServices24(s.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoadingServices(false);
    });

    return () => {
      u1();
      u2();
    };
  }, [userId]);

  /* ================= PORTFOLIO ================= */
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "users", currentUser.uid, "portfolio"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setPortfolio(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [currentUser]);

  /* ================= DELETE PORTFOLIO ================= */
  const deletePortfolio = async (id) => {
    if (!currentUser) return;
    if (!window.confirm("Delete this portfolio?")) return;

    try {
      await deleteDoc(doc(db, "users", currentUser.uid, "portfolio", id));
      alert("Portfolio deleted successfully");
    } catch (error) {
      console.error("Error deleting portfolio:", error);
      alert("Failed to delete portfolio");
    }
  };

  /* ================= TOGGLE PAUSE ================= */
  const togglePause = async (job) => {
    const col = activeTab === "works" ? "services" : "services_24h";

    try {
      await updateDoc(doc(db, "users", userId, col, job.id), {
        paused: !job.paused,
        pausedAt: !job.paused ? serverTimestamp() : null,
      });
    } catch (error) {
      console.error("Error toggling pause:", error);
    }
  };

  /* ================= FORMAT BUDGET ================= */
  const formatBudget = (v) => {
    if (!v) return "0";
    if (v >= 100000) return (v / 100000).toFixed(1) + "L";
    if (v >= 1000) return (v / 1000).toFixed(1) + "k";
    return v;
  };

  /* ================= SHARE PROFILE ================= */
  const shareProfile = () => {
    const shareText = `Check out ${profile?.first_name} ${profile?.last_name}'s professional profile`;
    if (navigator.share) {
      navigator.share({
        title: "Professional Profile",
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  /* ================= EXTRACT SKILLS & TOOLS ================= */
  const skills = useMemo(() => {
    return Array.isArray(profile?.skills) ? profile.skills : [];
  }, [profile]);

  const tools = useMemo(() => {
    return Array.isArray(profile?.tools) ? profile.tools : [];
  }, [profile]);

  /* ================= FILTERED DATA ================= */
  const filteredData = useMemo(() => {
    let data = activeTab === "works" ? services : services24;

    if (search) {
      data = data.filter((i) =>
        (i.title || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === "paused") {
      data = data.filter((i) => i.paused);
    } else if (sort === "oldest") {
      data = [...data].sort(
        (a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0)
      );
    } else {
      data = [...data].sort(
        (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
      );
    }

    return data;
  }, [services, services24, activeTab, search, sort]);

  /* ================= LOADING STATE ================= */
  if (loadingProfile) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 18 }}>Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 18, color: "#666" }}>User not found</div>
        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: 20,
            padding: "10px 20px",
            borderRadius: 10,
            border: "none",
            background: "#6366f1",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <div style={{ background: "#F6F6F6", minHeight: "100vh", paddingBottom: 60 }}>
      {/* HEADER */}
      <div style={{ background: "#fff", paddingBottom: 40 }}>
        {/* Cover Image */}
        <div
          style={{
            height: 220,
            background: profile.coverImage
              ? `url(${profile.coverImage}) center/cover`
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            position: "relative",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "none",
              background: "rgba(0,0,0,0.3)",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        {/* Profile Image */}
        <img
          src={profile.profileImage || "/assets/profile.png"}
          alt="profile"
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            marginTop: -60,
            marginLeft: 20,
            border: "4px solid #fff",
            objectFit: "cover",
          }}
        />

        {/* Action Buttons */}
        <div style={{ padding: "20px", display: "flex", gap: 12 }}>
          <button onClick={shareProfile} style={styles.shareBtn}>
            <Share2 size={16} style={{ marginRight: 6 }} />
            Share Profile
          </button>

          {currentUser?.uid !== userId && (
            <button
              onClick={() => setShowBlockPopup(true)}
              style={styles.blockBtn}
            >
              <Flag size={16} style={{ marginRight: 6 }} />
              Block / Report
            </button>
          )}
        </div>
      </div>

      {/* BASIC INFO */}
      <div style={{ padding: 20, background: "#fff", marginTop: 10 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>
          {profile.first_name} {profile.last_name}
        </h2>
        <div style={{ color: "#6b7280", marginTop: 4 }}>{profile.email}</div>
        <p style={{ margin: "8px 0 0", color: "#374151" }}>
          {profile.sector || "Freelancer"} · {profile.location || "India"}
        </p>
        <p style={{ opacity: 0.7, margin: "4px 0 0" }}>
          {profile.professional_title || "Professional"}
        </p>
      </div>

      {/* BLOCK POPUP */}
      {showBlockPopup && (
        <ReportBlockPopup
          freelancerId={userId}
          freelancerName={`${profile.first_name} ${profile.last_name}`}
          onClose={() => setShowBlockPopup(false)}
        />
      )}

      {/* ABOUT */}
      <Section title="About">
        <p style={{ lineHeight: 1.6, color: "#374151" }}>
          {profile.about || "No description available."}
        </p>
      </Section>

      {/* SKILLS & TOOLS CARD */}
      <div style={styles.skillsCard}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Skills</h3>
        <div style={styles.chipWrap}>
          {skills.length ? (
            skills.map((s) => (
              <span key={s} style={styles.chipYellow}>
                {s}
              </span>
            ))
          ) : (
            <span style={styles.muted}>No skills listed</span>
          )}
        </div>

        <h3 style={{ margin: "24px 0 0", fontSize: 18, fontWeight: 700 }}>
          Tools
        </h3>
        <div style={styles.chipWrap}>
          {tools.length ? (
            tools.map((t) => (
              <span key={t} style={styles.chipYellow}>
                {t}
              </span>
            ))
          ) : (
            <span style={styles.muted}>No tools listed</span>
          )}
        </div>
      </div>

      {/* PORTFOLIO */}
      <div style={styles.portfolioWrapper}>
        <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Portfolio</h3>
        {portfolio.length === 0 ? (
          <p style={{ marginTop: 16, opacity: 0.6 }}>No portfolio items yet</p>
        ) : (
          <div style={styles.portfolioRow}>
            {portfolio.map((p) => (
              <div key={p.id} style={styles.portfolioCard}>
                <div style={styles.portfolioImgWrap}>
                  <img
                    src={p.imageUrl || "/assets/gallery.png"}
                    alt={p.title}
                    style={styles.portfolioImg}
                  />
                </div>

                <div style={{ padding: 14 }}>
                  <div style={styles.portfolioTitleRow}>
                    <h4 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>
                      {p.title}
                    </h4>
                    {currentUser?.uid === userId && (
                      <FiTrash2
                        style={{ cursor: "pointer", color: "#ef4444" }}
                        onClick={() => deletePortfolio(p.id)}
                      />
                    )}
                  </div>
                  <p style={styles.portfolioDesc}>{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* POSTED JOBS */}
      <div style={styles.wrapper}>
        {/* HEADER */}
        <div style={styles.header}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
            Posted Jobs
          </h3>

          <div style={styles.toggleWrap}>
            <button
              onClick={() => setActiveTab("works")}
              style={
                activeTab === "works" ? styles.toggleActive : styles.toggle
              }
            >
              Works
            </button>
            <button
              onClick={() => setActiveTab("24h")}
              style={activeTab === "24h" ? styles.toggleActive : styles.toggle}
            >
              24 Hours
            </button>
          </div>
        </div>



        {/* CARDS */}
        {loadingServices ? (
          <p style={{ padding: 30, textAlign: "center" }}>Loading services...</p>
        ) : filteredData.length === 0 ? (
          <p style={{ padding: 30, opacity: 0.6, textAlign: "center" }}>
            No services found
          </p>
        ) : (
          filteredData.map((job) => (
            <div key={job.id} style={styles.card}>
              <div style={styles.topRow}>
                <div style={styles.avatar}>
                  {(job.title || "JOB").substring(0, 2).toUpperCase()}
                </div>

                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
                    {job.title}
                  </h4>

                  <div style={styles.chips}>
                    {job.skills?.slice(0, 2).map((s) => (
                      <span key={s} style={styles.chip}>
                        {s}
                      </span>
                    ))}
                    {job.skills?.length > 2 && (
                      <span style={styles.more}>+{job.skills.length - 2}</span>
                    )}
                  </div>
                </div>
              </div>

              <div style={styles.meta}>
                <div>
                  <div style={styles.label}>Budget</div>
                  <div style={styles.value}>
                    ₹{formatBudget(job.budget_from || job.budget)}
                  </div>
                </div>

                <div>
                  <div style={styles.label}>Timeline</div>
                  <div style={styles.value}>
                    {job.deliveryDuration || "N/A"}
                  </div>
                </div>

                <div>
                  <div style={styles.label}>Location</div>
                  <div style={styles.value}>{job.location || "Remote"}</div>
                </div>
              </div>

              {currentUser?.uid === userId && (
                <div style={styles.actions}>
                  <button
                    style={styles.pauseBtn}
                    onClick={() => togglePause(job)}
                  >
                    {job.paused ? "Unpause Service" : "Pause Service"}
                  </button>

                  <button
                    style={styles.editBtn}
                    onClick={() =>
                      navigate(
                        activeTab === "works"
                          ? `/freelance-dashboard/freelanceredit-service/${job.id}`
                          : `/service-24h-edit/${job.id}`,
                        { state: { job } }
                      )
                    }
                  >
                    Edit Service
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ================= SECTION COMPONENT ================= */
function Section({ title, children }) {
  return (
    <div
      style={{
        background: "#fff",
        margin: "10px 0",
        padding: 20,
        borderRadius: 12,
      }}
    >
      <h3 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 700 }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  shareBtn: {
    padding: "10px 18px",
    border: "1px solid #ddd",
    borderRadius: 10,
    cursor: "pointer",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    fontWeight: 600,
    fontSize: 14,
  },

  blockBtn: {
    padding: "10px 18px",
    border: "1px solid #ef4444",
    borderRadius: 10,
    cursor: "pointer",
    background: "#fff",
    color: "#ef4444",
    display: "flex",
    alignItems: "center",
    fontWeight: 600,
    fontSize: 14,
  },

  skillsCard: {
    background: "#FFFEEF",
    borderRadius: 28,
    padding: 28,
    margin: "10px 20px",
    boxShadow: "0 14px 30px rgba(0,0,0,0.12)",
  },

  chipWrap: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 12,
  },

  chipYellow: {
    background: "#FFF9A8",
    padding: "8px 14px",
    borderRadius: 18,
    fontWeight: 600,
    fontSize: 13,
  },

  muted: {
    opacity: 0.6,
    fontSize: 14,
  },

  portfolioWrapper: {
    background: "#fff",
    margin: "10px 20px",
    padding: 20,
    borderRadius: 20,
  },

  portfolioRow: {
    display: "flex",
    gap: 16,
    overflowX: "auto",
    marginTop: 16,
    paddingBottom: 10,
  },

  portfolioCard: {
    minWidth: 260,
    border: "1px solid #eee",
    borderRadius: 16,
    overflow: "hidden",
    background: "#fff",
  },

  portfolioImgWrap: {
    height: 140,
    background: "#e5e7eb",
  },

  portfolioImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  portfolioTitleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  portfolioDesc: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: 6,
    lineHeight: 1.4,
  },

  wrapper: {
    background: "#fff",
    borderRadius: 20,
    padding: 20,
    margin: "10px 20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
  },

  toggleWrap: {
    background: "#FFF8E1",
    padding: 6,
    borderRadius: 16,
    display: "flex",
    gap: 6,
  },

  toggle: {
    padding: "8px 22px",
    borderRadius: 12,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
  },

  toggleActive: {
    padding: "8px 22px",
    borderRadius: 12,
    border: "none",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
  },

  searchRow: {
    display: "flex",
    gap: 12,
    marginTop: 16,
  },

  search: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    border: "1px solid #ddd",
    paddingLeft: 14,
    fontSize: 14,
  },

  select: {
    height: 42,
    borderRadius: 14,
    border: "1px solid #ddd",
    padding: "0 12px",
    fontSize: 14,
    cursor: "pointer",
  },

  card: {
    border: "1px solid #E0E0E0",
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
  },

  topRow: {
    display: "flex",
    gap: 16,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    background: "linear-gradient(135deg, #6A5CFF, #9B42FF)",
    color: "#fff",
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
  },

  chips: {
    display: "flex",
    gap: 8,
    marginTop: 6,
    flexWrap: "wrap",
  },

  chip: {
    background: "#FFF7A8",
    padding: "4px 12px",
    borderRadius: 16,
    fontSize: 13,
    fontWeight: 600,
  },

  more: {
    background: "#FFF7A8",
    padding: "4px 12px",
    borderRadius: 16,
    fontSize: 13,
  },

  meta: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 12,
  },

  label: {
    fontSize: 13,
    opacity: 0.6,
  },

  value: {
    fontSize: 14,
    fontWeight: 700,
    marginTop: 2,
  },

  actions: {
    display: "flex",
    gap: 12,
    marginTop: 18,
  },

  pauseBtn: {
    flex: 1,
    height: 40,
    borderRadius: 30,
    border: "1px solid #bbb",
    background: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 14,
  },

  editBtn: {
    flex: 1,
    height: 40,
    borderRadius: 30,
    border: "none",
    background: "#FFF97A",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 14,
  },
};