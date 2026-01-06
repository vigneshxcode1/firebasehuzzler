// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAuth } from "firebase/auth";
// import { getFirestore, doc, getDoc } from "firebase/firestore";
// import editicon from "../../assets/editicon.png";

// export default function CompanyProfileView() {
//   const navigate = useNavigate();

//   // ✅ SIDEBAR COLLAPSE STATE
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

//   // ✅ MOBILE DETECTION
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//   useEffect(() => {
//     const resize = () => setIsMobile(window.innerWidth < 768);
//     window.addEventListener("resize", resize);
//     return () => window.removeEventListener("resize", resize);
//   }, []);

//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       const auth = getAuth();
//       const user = auth.currentUser;
//       if (!user) return;

//       const db = getFirestore();
//       const snap = await getDoc(doc(db, "users", user.uid));

//       if (snap.exists()) setData(snap.data());
//       setLoading(false);
//     };
//     fetchData();
//   }, []);

//   if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
//   if (!data) return <div style={{ padding: 20 }}>No profile found.</div>;

//   return (
//     <div
//       className="freelance-wrapper"
//       style={{
//         marginLeft: isMobile ? 0 : collapsed ? "-110px" : "50px",
//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       <div
//         style={{
//           minHeight: "100vh",
//           fontFamily: "Rubik",
//           background: "#fafafa",
//           display: "flex",
//           justifyContent: "center",
//         }}
//       >
//         <div style={{ width: "100%", maxWidth: 920 }}>
//           {/* HEADER */}
//           <div
//             style={{
//               background:
//                 "linear-gradient(180deg, #FFFECB 0%, #FFFDE4 40%, #FFFFFF 100%)",
//               padding: isMobile ? "30px 20px 60px" : "40px 30px 80px",
//               borderBottomLeftRadius: 30,
//               borderBottomRightRadius: 30,
//               position: "relative",
//             }}
//           >
//             {/* EDIT BUTTON */}
//             <button
//               onClick={() =>
//                 navigate("/client-dashbroad2/companyprofileedit")
//               }
//               style={{
//                 position: "absolute",
//                 right: 10,
//                 top: 10,
//                 border: "none",
//                 background: "transparent",
//                 cursor: "pointer",
//               }}
//             >
//               <img
//                 style={{ width: isMobile ? "42px" : "60px" }}
//                 src={editicon}
//                 alt="edit"
//               />
//             </button>

//             {/* PROFILE */}
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: isMobile ? "column" : "row",
//                 alignItems: isMobile ? "flex-start" : "center",
//                 gap: 18,
//               }}
//             >
//               <div
//                 style={{
//                   width: 72,
//                   height: 72,
//                   borderRadius: "50%",
//                   background: "#D8D8D8",
//                   overflow: "hidden",
//                 }}
//               >
//                 <img
//                   src={data.profileImage || ""}
//                   alt=""
//                   style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                 />
//               </div>

//               <div>
//                 <div
//                   style={{
//                     fontSize: isMobile ? 22 : 30,
//                     fontWeight: 400,
//                   }}
//                 >
//                   {data.company_name || "Company Name"}
//                 </div>

//                 <div
//                   style={{
//                     color: "#707070",
//                     marginTop: 2,
//                     fontSize: isMobile ? 14 : 16,
//                   }}
//                 >
//                   {data.email}
//                 </div>

//                 <div
//                   style={{
//                     marginTop: 10,
//                     color: "#3f3f3f",
//                     fontSize: isMobile ? 16 : 20,
//                   }}
//                 >
//                   {data.industry || "Software development"} •{" "}
//                   {data.location || "Chennai, Tamil Nadu"}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* CONTENT */}
//           <div style={{ padding: isMobile ? "20px 14px" : "30px 20px" }}>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr",
//                 gap: 20,
//               }}
//             >
//               {/* LEFT */}
//               <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//                 <Card title="About">
//                   <p style={{ lineHeight: 1.6, color: "#444" }}>
//                     {data.business_description ||
//                       "Company description goes here"}
//                   </p>
//                 </Card>

//                 <Card title="Company Size">
//                   {data.team_size || "15–20 employees"}
//                 </Card>

//                 <Card title="Account Handler">
//                   {data.team_size || "15–20 employees"}
//                 </Card>

//                 <Card title="Email Address">{data.email}</Card>
//               </div>

//               {/* RIGHT */}
//               <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>


//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ---------- SMALL REUSABLE UI PARTS ---------- */

// function Card({ title, children }) {
//   return (
//     <div
//       style={{
//         background: "#fff",
//         padding: 22,
//         borderRadius: 20,
//         boxShadow: "0 4px 25px rgba(0,0,0,0.07)",
//       }}
//     >
//       <h3 style={{ marginBottom: 12, fontWeight: 400, fontSize: 22 }}>
//         {title}
//       </h3>
//       <div style={{ color: "#626262" }}>{children}</div>
//     </div>
//   );
// }

// function TagCard({ title, items = [] }) {
//   return (
//     <Card title={title}>
//       <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
//         {(items.length ? items : ["Sample"]).map((i, idx) => (
//           <span
//             key={idx}
//             style={{
//               background: "#FFFECF",
//               padding: "6px 14px",
//               borderRadius: 12,
//               fontSize: 13,
//               fontWeight: 500,
//             }}
//           >
//             {i}
//           </span>
//         ))}
//       </div>
//     </Card>
//   );
// }













// import React, { useEffect, useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   collection,
//   query,
//   where,
//   onSnapshot,
//   doc,
//   setDoc,
//   deleteDoc,
// } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import backarrow from "../../assets/backarrow.png";
// import { db } from "../../firbase/Firebase";
// import emptyWorks from "../../assets/job.png";
// import empty24 from "../../assets/job24.png";

// /* ======================= STYLES ======================= */
// const styles = {
//   page: {
//     backgroundColor: "#FFFFFF",
//     minHeight: "100vh",
//     fontFamily: "'Rubik', sans-serif",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     paddingTop: 32,
//     paddingBottom: 80,
//   },

//   headerRowWrap: {
//     width: 928,
//     display: "flex",
//     alignItems: "center",
//     gap: 10,
//     marginLeft: 32,
//   },

//   backbtn: {
//     width: 36,
//     height: 36,
//     borderRadius: 14,
//     border: "1px solid #ccc",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     cursor: "pointer",
//   },

//   headerTitle: { fontSize: 28, fontWeight: 700 },
//   headerSubtitle: { fontSize: 13, color: "#6B7280" },

//   toggleBarWrapper: {
//     width: 928,
//     height: 52,
//     borderRadius: 16,
//     padding: 6,
//     display: "flex",
//     marginTop: 18,
//     marginLeft: 32,
//     backgroundColor: "#FFF8E1",
//   },

//   toggleGroup: {
//     display: "flex",
//     gap: 6,
//   },

//   toggleButton: (active) => ({
//     width: 166,
//     height: 36,
//     borderRadius: 12,
//     backgroundColor: active ? "#FFFFFF" : "transparent",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontWeight: 600,
//     cursor: "pointer",
//   }),

//   searchRow: {
//     width: 928,
//     marginTop: 16,
//     marginLeft: 32,
//   },

//   searchContainer: {
//     height: 44,
//     borderRadius: 14,
//     border: "1px solid #DADADA",
//     padding: "0 14px",
//     display: "flex",
//     alignItems: "center",
//   },

//   searchInput: {
//     border: "none",
//     outline: "none",
//     flex: 1,
//     fontSize: 14,
//     marginLeft: 10,
//   },

//   cardsWrap: {
//     width: 928,
//     marginTop: 24,
//     marginLeft: 32,
//     display: "grid",
//     gridTemplateColumns: "repeat(2, 446px)",
//     gap: 24,
//   },

//   card: {
//     width: 446,
//     borderRadius: 24,
//     border: "1px solid #DADADA",
//     padding: 20,
//     boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "space-between",
//     cursor: "pointer",
//     position: "relative",
//   },

//   avatarBox: {
//     width: 56,
//     height: 56,
//     borderRadius: 14,
//     background:
//       "linear-gradient(135deg,#51A2FF 0%,#9B42FF 60%,#AD46FF 100%)",
//     color: "#fff",
//     fontWeight: 700,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   jobTitle: { fontSize: 16, fontWeight: 800 },

//   skillChip: {
//     padding: "4px 12px",
//     borderRadius: 20,
//     backgroundColor: "rgba(255,255,190,1)",
//     fontSize: 13,
//     marginRight: 8,
//   },

//   infoRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     marginTop: 14,
//   },

//   label: { fontSize: 13, color: "#6B7280" },
//   value: { fontSize: 14, fontWeight: 700 },

//   buttonRow: {
//     display: "flex",
//     gap: 12,
//     marginTop: 16,
//   },

//   secondaryBtn: {
//     flex: 1,
//     height: 40,
//     borderRadius: 30,
//     border: "1px solid #BDBDBD",
//     background: "#fff",
//     fontWeight: 600,
//     cursor: "pointer",
//   },

//   primaryBtn: {
//     flex: 1,
//     height: 40,
//     borderRadius: 30,
//     background: "rgba(253,253,150,1)",
//     border: "none",
//     fontWeight: 700,
//     cursor: "pointer",
//   },
// };

// /* ======================= MAIN ======================= */
// export default function AddJobScreen() {
//   const navigate = useNavigate();
//   const auth = getAuth();
//   const user = auth.currentUser;

//   const [tab, setTab] = useState("Works");
//   const [search, setSearch] = useState("");

//   const [worksJobs, setWorksJobs] = useState([]);
//   const [jobs24, setJobs24] = useState([]);

//   useEffect(() => {
//     if (!user) return;

//     const q1 = query(collection(db, "jobs"), where("userId", "==", user.uid));
//     const q2 = query(collection(db, "jobs_24h"), where("userId", "==", user.uid));

//     const u1 = onSnapshot(q1, (s) =>
//       setWorksJobs(s.docs.map((d) => ({ id: d.id, ...d.data() })))
//     );
//     const u2 = onSnapshot(q2, (s) =>
//       setJobs24(s.docs.map((d) => ({ id: d.id, ...d.data() })))
//     );

//     return () => {
//       u1();
//       u2();
//     };
//   }, [user]);

//   const filterJobs = (jobs) =>
//     jobs.filter((j) =>
//       (j.title || "").toLowerCase().includes(search.toLowerCase())
//     );

//   const list = tab === "Works" ? filterJobs(worksJobs) : filterJobs(jobs24);

//   const renderCard = (job) => (
//     <div
//       key={job.id}
//       style={styles.card}
//       onClick={() =>
//         navigate(
//           tab === "Works"
//             ? `/client-dashbroad2/job-full/${job.id}`
//             : `/client-dashbroad2/job-full24/${job.id}`
//         )
//       }
//     >
//       <div style={{ display: "flex", gap: 12 }}>
//         <div style={styles.avatarBox}>
//           {(job.title || "J").substring(0, 2).toUpperCase()}
//         </div>
//         <div>
//           <div style={styles.jobTitle}>{job.title}</div>
//           <div style={{ display: "flex", marginTop: 6 }}>
//             {job.skills?.slice(0, 2).map((s, i) => (
//               <div key={i} style={styles.skillChip}>
//                 {s}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div style={styles.infoRow}>
//         <div>
//           <div style={styles.label}>Budget</div>
//           <div style={{ ...styles.value, color: "#7C3CFF" }}>
//             ₹{job.budget_from || job.budget || 0}
//           </div>
//         </div>
//         <div>
//           <div style={styles.label}>Timeline</div>
//           <div style={styles.value}>
//             {tab === "Works" ? job.timeline : "24 hours"}
//           </div>
//         </div>
//         <div>
//           <div style={styles.label}>Location</div>
//           <div style={styles.value}>Remote</div>
//         </div>
//       </div>

//       <div style={styles.buttonRow}>
//         <button style={styles.secondaryBtn}>Pause Service</button>
//         <button style={styles.primaryBtn}>Edit Service</button>
//       </div>
//     </div>
//   );

//   return (
//     <div style={styles.page}>
//       {/* Header */}
//       <div style={styles.headerRowWrap}>

//         <div>
//           <div style={styles.headerTitle}>jobs</div>

//         </div>
//       </div>

//       {/* Toggle */}
//       <div style={styles.toggleBarWrapper}>
//         <div style={styles.toggleGroup}>
//           <div
//             style={styles.toggleButton(tab === "Works")}
//             onClick={() => setTab("Works")}
//           >
//             Works
//           </div>
//           <div
//             style={styles.toggleButton(tab === "24")}
//             onClick={() => setTab("24")}
//           >
//             24 Hours
//           </div>
//         </div>
//       </div>



//       {/* Cards */}
//       <div style={styles.cardsWrap}>
//         {list.length ? list.map(renderCard) : null}
//       </div>
//     </div>
//   );
// }













// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAuth } from "firebase/auth";
// import {
//   doc,
//   getDoc,
//   collection,
//   query,
//   where,
//   onSnapshot,
// } from "firebase/firestore";

// import editicon from "../../assets/editicon.png";
// import { db } from "../../firbase/Firebase";

// /* ======================================================
//    COMPANY PROFILE SUMMARY
// ====================================================== */

// export default function ProfileSummary() {
//   const navigate = useNavigate();

//   /* ---------------- SIDEBAR ---------------- */
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   useEffect(() => {
//     const handleToggle = (e) => setCollapsed(e.detail);
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   /* ---------------- MOBILE ---------------- */
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   useEffect(() => {
//     const resize = () => setIsMobile(window.innerWidth < 768);
//     window.addEventListener("resize", resize);
//     return () => window.removeEventListener("resize", resize);
//   }, []);

//   /* ---------------- PROFILE DATA ---------------- */
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const auth = getAuth();
//       const user = auth.currentUser;
//       if (!user) {
//         setLoading(false);
//         return;
//       }

//       const snap = await getDoc(doc(db, "users", user.uid));
//       if (snap.exists()) setData(snap.data());
//       setLoading(false);
//     };
//     fetchProfile();
//   }, []);

//   /* ---------------- JOBS DATA ---------------- */
//   const auth = getAuth();
//   const user = auth.currentUser;

//   const [tab, setTab] = useState("Works");
//   const [worksJobs, setWorksJobs] = useState([]);
//   const [jobs24, setJobs24] = useState([]);

//   useEffect(() => {
//     if (!user) return;

//     const q1 = query(
//       collection(db, "jobs"),
//       where("userId", "==", user.uid)
//     );
//     const q2 = query(
//       collection(db, "jobs_24h"),
//       where("userId", "==", user.uid)
//     );

//     const unsub1 = onSnapshot(q1, (snap) =>
//       setWorksJobs(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
//     );

//     const unsub2 = onSnapshot(q2, (snap) =>
//       setJobs24(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
//     );

//     return () => {
//       unsub1();
//       unsub2();
//     };
//   }, [user]);

//   if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
//   if (!data) return <div style={{ padding: 20 }}>No profile found.</div>;

//   const jobsList = tab === "Works" ? worksJobs : jobs24;

//   const renderCard = (job) => (
//     <JobCard
//       key={job.id}
//       job={job}
//       onClick={() => console.log(job.id)}
//     />
//   );

//   return (
//     <div
//       style={{
//         marginLeft: isMobile ? 0 : collapsed ? "-110px" : "50px",
//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       <div
//         style={{
//           minHeight: "100vh",
//           fontFamily: "Rubik",
//           background: "#fafafa",
//           display: "flex",
//           justifyContent: "center",
//         }}
//       >
//         <div style={{ width: "100%", maxWidth: 920 }}>
//           {/* ================= HEADER ================= */}
//           <div
//             style={{
//               background:
//                 "linear-gradient(180deg, #FFFECB 0%, #FFFDE4 40%, #FFFFFF 100%)",
//               padding: isMobile ? "30px 20px 60px" : "40px 30px 80px",
//               borderBottomLeftRadius: 30,
//               borderBottomRightRadius: 30,
//               position: "relative",
//             }}
//           >
//             <button
//               onClick={() =>
//                 navigate("/client-dashboard2/companyprofileedit")
//               }
//               style={{
//                 position: "absolute",
//                 right: 10,
//                 top: 10,
//                 border: "none",
//                 background: "transparent",
//                 cursor: "pointer",
//               }}
//             >
//               <img
//                 src={editicon}
//                 alt="edit"
//                 style={{ width: isMobile ? 42 : 60 }}
//               />
//             </button>

//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: isMobile ? "column" : "row",
//                 gap: 18,
//                 alignItems: isMobile ? "flex-start" : "center",
//               }}
//             >
//               <div
//                 style={{
//                   width: 72,
//                   height: 72,
//                   borderRadius: "50%",
//                   background: "#D8D8D8",
//                   overflow: "hidden",
//                 }}
//               >
//                 <img
//                   src={data?.profileImage || ""}
//                   alt=""
//                   style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                 />
//               </div>

//               <div>
//                 <div style={{ fontSize: isMobile ? 22 : 30 }}>
//                   {data?.company_name}
//                 </div>
//                 <div style={{ color: "#707070", fontSize: 14 }}>
//                   {data?.email}
//                 </div>
//                 <div style={{ marginTop: 10 }}>
//                   {data?.industry} • {data?.location}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ================= CONTENT ================= */}
//           <div style={{ padding: isMobile ? 16 : 24 }}>
//             <Card title="About">{data?.business_description}</Card>
//             <Card title="Company Size">{data?.team_size}</Card>
//             <Card title="Email Address">{data?.email}</Card>

//             {/* ================= JOBS SECTION ================= */}
//             <div style={{ marginTop: 40 }}>
//               <h2>Jobs</h2>

//               <div style={styles.page}>
//                 <div style={styles.headerRowWrap}>

//                 </div>

//                 {/* Toggle */}
//                 <div style={styles.toggleBarWrapper}>
//                   <div style={styles.toggleGroup}>
//                     <div
//                       style={{
//                         ...styles.toggleButton,
//                         background:
//                           tab === "Works" ? "#fff" : "transparent",
//                       }}
//                       onClick={() => setTab("Works")}
//                     >
//                       Works
//                     </div>

//                     <div
//                       style={{
//                         ...styles.toggleButton,
//                         background:
//                           tab === "24" ? "#fff" : "transparent",
//                       }}
//                       onClick={() => setTab("24")}
//                     >
//                       24 Hours
//                     </div>
//                   </div>
//                 </div>

//                 {/* Cards */}
//                 <div style={styles.cardsWrap}>
//                   {jobsList.length
//                     ? jobsList.map(renderCard)
//                     : "No jobs found"}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ================= REUSABLE UI ================= */

// function Card({ title, children }) {
//   return (
//     <div
//       style={{
//         background: "#fff",
//         padding: 22,
//         borderRadius: 20,
//         boxShadow: "0 4px 25px rgba(0,0,0,0.07)",
//         marginBottom: 20,
//       }}
//     >
//       <h3 style={{ marginBottom: 10 }}>{title}</h3>
//       <div style={{ color: "#555" }}>{children}</div>
//     </div>
//   );
// }
// function JobCard({ job, onClick }) {
//   return (
//     <div
//       onClick={onClick}
//       style={{
//         border: "1px solid #ddd",
//         borderRadius: 24,
//         padding: 20,
//         cursor: "pointer",
//         marginBottom: 14,
//       }}
//     >
//       {/* TOP ROW */}
//       <div style={{ display: "flex", gap: 12 }}>
//         <div style={styles.avatarBox}>
//           {(job?.title || "J").substring(0, 2).toUpperCase()}
//         </div>

//         <div>
//           <div style={styles.jobTitle}>{job?.title}</div>

//           <div style={{ display: "flex", marginTop: 6 }}>
//             {job?.skills?.slice(0, 2).map((s, i) => (
//               <div key={i} style={styles.skillChip}>
//                 {s}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* DETAILS */}
//       <div style={{ marginTop: 12, color: "#7C3CFF", fontWeight: 600 }}>
//         ₹{job?.budget_from || job?.budget}
//       </div>

//       <div style={{ marginTop: 6, fontSize: 13 }}>
//         {job?.timeline || "24 hours"} • Remote
//       </div>
//       <div style={styles.buttonRow}>
//          <button style={styles.secondaryBtn}>Pause Service</button>
//          <button style={styles.primaryBtn}>Edit Service</button>
//        </div>
//     </div>
//   );
// }

// /* ================= STYLES ================= */

// const styles = {
//   avatarBox: {
//     width: 42,
//     height: 42,
//     borderRadius: "50%",
//     background: "#EEE",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontWeight: 700,
//   },

//   jobTitle: {
//     fontWeight: 700,
//     fontSize: 15,
//   },

//   skillChip: {
//     background: "#F1EDFF",
//     color: "#5A3BFF",
//     padding: "4px 8px",
//     borderRadius: 8,
//     fontSize: 12,
//     marginRight: 6,
//   },

//   page: { marginTop: 20 },
//   headerRowWrap: { marginBottom: 10 },
//   headerTitle: { fontSize: 18, fontWeight: 700 },
//   toggleBarWrapper: { margin: "20px 0" },
//   toggleGroup: {
//     display: "flex",
//     gap: 10,
//     background: "#f0f0f0",
//     padding: 6,
//     borderRadius: 14,
//     width: "fit-content",
//   },
//   toggleButton: {
//     padding: "8px 16px",
//     borderRadius: 10,
//     cursor: "pointer",
//     fontWeight: 600,
//   },
//   cardsWrap: {
//     marginTop: 20,
//     display: "flex",
//     flexDirection: "column",
//     gap: 14,
//   },
// };












import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

import editicon from "../../assets/editicon.png";
import { db } from "../../firbase/Firebase";

/* ======================================================
   COMPANY PROFILE SUMMARY
====================================================== */

export default function ProfileSummary() {
  const navigate = useNavigate();

  /* ---------------- SIDEBAR ---------------- */
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  useEffect(() => {
    const handleToggle = (e) => setCollapsed(e.detail);
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  /* ---------------- MOBILE ---------------- */
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ---------------- PROFILE DATA ---------------- */
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) setData(snap.data());
      setLoading(false);
    };
    fetchProfile();
  }, []);

  /* ---------------- JOBS DATA ---------------- */
  const auth = getAuth();
  const user = auth.currentUser;

  const [tab, setTab] = useState("Works");
  const [worksJobs, setWorksJobs] = useState([]);
  const [jobs24, setJobs24] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q1 = query(
      collection(db, "jobs"),
      where("userId", "==", user.uid)
    );
    const q2 = query(
      collection(db, "jobs_24h"),
      where("userId", "==", user.uid)
    );

    const unsub1 = onSnapshot(q1, (snap) =>
      setWorksJobs(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );

    const unsub2 = onSnapshot(q2, (snap) =>
      setJobs24(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );

    return () => {
      unsub1();
      unsub2();
    };
  }, [user]);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!data) return <div style={{ padding: 20 }}>No profile found.</div>;

  const jobsList = tab === "Works" ? worksJobs : jobs24;

  return (
    <div
      style={{
        marginLeft: isMobile ? 0 : collapsed ? "-110px" : "50px",
        transition: "margin-left 0.25s ease",
      }}
    >
      <div
        style={{
          minHeight: "100vh",
          fontFamily: "Rubik",
          background: "#fafafa",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: 920 }}>
          {/* ================= HEADER ================= */}
          <div
            style={{
              background:
                "linear-gradient(180deg, #FFFECB 0%, #FFFDE4 40%, #FFFFFF 100%)",
              padding: isMobile ? "30px 20px 60px" : "40px 30px 80px",
              borderBottomLeftRadius: 30,
              borderBottomRightRadius: 30,
              position: "relative",
            }}
          >
            <button
              onClick={() => navigate("/client-dashbroad2/companyprofileedit")}
              style={{
                position: "absolute",
                right: 10,
                top: 10,
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              <img
                src={editicon}
                alt="edit"
                style={{ width: isMobile ? 42 : 60 }}
              />
            </button>

            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: 18,
                alignItems: isMobile ? "flex-start" : "center",
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "#D8D8D8",
                  overflow: "hidden",
                }}
              >
                <img
                  src={data?.profileImage || ""}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <div>
                <div style={{ fontSize: isMobile ? 22 : 30 }}>
                  {data?.company_name}
                </div>
                <div style={{ color: "#707070", fontSize: 14 }}>
                  {data?.email}
                </div>
                <div style={{ marginTop: 10 }}>
                  {data?.industry} • {data?.location}
                </div>
              </div>
            </div>
          </div>

          {/* ================= CONTENT ================= */}
          <div style={{ padding: isMobile ? 16 : 24 }}>
            <Card title="About">{data?.business_description}</Card>
            <Card title="Company Size">{data?.team_size}</Card>
            <Card title="Email Address">{data?.email}</Card>

            {/* ================= JOBS ================= */}
            <div style={{ marginTop: 40 }}>
              <h2>Jobs</h2>

              <div style={styles.toggleGroup}>
                <div
                  style={{
                    ...styles.toggleButton,
                    background: tab === "Works" ? "#fff" : "transparent",
                  }}
                  onClick={() => setTab("Works")}
                >
                  Works
                </div>
                <div
                  style={{
                    ...styles.toggleButton,
                    background: tab === "24" ? "#fff" : "transparent",
                  }}
                  onClick={() => setTab("24")}
                >
                  24 Hours
                </div>
              </div>

              <div style={styles.cardsWrap}>
                {jobsList.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    type={tab}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= REUSABLE ================= */

function Card({ title, children }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: 22,
        borderRadius: 20,
        boxShadow: "0 4px 25px rgba(0,0,0,0.07)",
        marginBottom: 20,
      }}
    >
      <h3 style={{ marginBottom: 10 }}>{title}</h3>
      <div style={{ color: "#555" }}>{children}</div>
    </div>
  );
}

function JobCard({ job, type }) {
  const navigate = useNavigate();

  /* ---------- PAUSE / RESUME ---------- */
  const handlePause = async (e) => {
    e.stopPropagation();

    const collectionName = type === "Works" ? "jobs" : "jobs_24h";
    const ref = doc(db, collectionName, job.id);

    await updateDoc(ref, {
      status: job.status === "paused" ? "active" : "paused",
    });
  };

  /* ---------- EDIT ---------- */
  const handleEdit = (e) => {
    e.stopPropagation();

    navigate("/client-dashbroad2/clientedit24jobs", {
      state: { jobId: job.id, jobData: job },
    });
  };

  return (
    <div
      onClick={() =>
        navigate(
          type === "Works"
            ? `/client-dashbroad2/clienteditjob/${job.id}`
            : `/client-dashbroad2/clientedit24jobs/${job.id}`
        )
      }
      style={{
        border: "1px solid #ddd",
        borderRadius: 24,
        padding: 20,
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", gap: 12 }}>
        <div style={styles.avatarBox}>
          {(job?.title || "J").substring(0, 2).toUpperCase()}
        </div>
        <div>
          <div style={styles.jobTitle}>{job?.title}</div>
          <div style={{ display: "flex", marginTop: 6 }}>
            {job?.skills?.slice(0, 2).map((s, i) => (
              <div key={i} style={styles.skillChip}>
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12, color: "#7C3CFF", fontWeight: 600 }}>
        ₹{job?.budget_from || job?.budget}
      </div>

      <div style={{ marginTop: 6, fontSize: 13 }}>
        {job?.timeline || "24 hours"} • Remote
      </div>

      <div style={styles.buttonRow}>
        <button style={styles.secondaryBtn} onClick={handlePause}>
          {job.status === "paused" ? "Resume Service" : "Pause Service"}
        </button>

        <button style={styles.primaryBtn} onClick={handleEdit}>
          Edit Service
        </button>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  avatarBox: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    background: "#EEE",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
  },
  jobTitle: { fontWeight: 700, fontSize: 15 },
  skillChip: {
    background: "#F1EDFF",
    color: "#5A3BFF",
    padding: "4px 8px",
    borderRadius: 8,
    fontSize: 12,
    marginRight: 6,
  },
  toggleGroup: {
    display: "flex",
    gap: 10,
    background: "#f0f0f0",
    padding: 6,
    borderRadius: 14,
    width: "fit-content",
    margin: "20px 0",
  },
  toggleButton: {
    padding: "8px 16px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
  },
  cardsWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  buttonRow: {
    display: "flex",
    gap: 12,
    marginTop: 14,
  },
  secondaryBtn: {
    flex: 1,
    height: 38,
    borderRadius: 30,
    border: "1px solid #BDBDBD",
    background: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
  primaryBtn: {
    flex: 1,
    height: 38,
    borderRadius: 30,
    background: "rgba(253,253,150,1)",
    border: "none",
    fontWeight: 700,
    cursor: "pointer",
  },
};








