


// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   query,
//   where,
//   updateDoc,
//   serverTimestamp,
// } from "firebase/firestore";
// import { db } from "../firbase/Firebase";

// import backarrow from "../assets/backarrow.png";
// import arrow from "../assets/arrow.png";
// import serviceEmpty from "../assets/service.png";
// import search from "../assets/search.png";

// /* ---------------- SIDEBAR ---------------- */
// const useSidebar = () => {
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   useEffect(() => {
//     const handler = (e) => setCollapsed(e.detail);
//     window.addEventListener("sidebar-toggle", handler);
//     return () => window.removeEventListener("sidebar-toggle", handler);
//   }, []);

//   return collapsed;
// };

// /* ---------------- MAIN ---------------- */
// export default function ServiceScreenOne() {
//   const navigate = useNavigate();
//   const auth = getAuth();
//   const collapsed = useSidebar();

//   const [selectedTab, setSelectedTab] = useState("Works");
//   const [searchText, setSearchText] = useState("");
//   const [services, setServices] = useState([]);
//   const [jobs24, setJobs24] = useState([]);
//   const [servicesLoading, setServicesLoading] = useState(true);
//   const [jobs24Loading, setJobs24Loading] = useState(true);
//   const [user, setUser] = useState(null);

//   const [sortMenuOpen, setSortMenuOpen] = useState(false);
//   const [sortOption, setSortOption] = useState("newest");

//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   /* ---------------- RESPONSIVE ---------------- */
//   useEffect(() => {
//     const resize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", resize);
//     return () => window.removeEventListener("resize", resize);
//   }, []);

//   /* ---------------- AUTH ---------------- */
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => setUser(u));
//     return () => unsub();
//   }, []);

//   /* ---------------- SERVICES ---------------- */
//   useEffect(() => {
//     if (!user) return;
//     setServicesLoading(true);

//     const q = query(collection(db, "services"), where("userId", "==", user.uid));
//     return onSnapshot(q, (snap) => {
//       const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       arr.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
//       setServices(arr);
//       setServicesLoading(false);
//     });
//   }, [user]);

//   /* ---------------- 24H ---------------- */
//   useEffect(() => {
//     if (!user) return;
//     setJobs24Loading(true);

//     const q = query(collection(db, "service_24h"), where("userId", "==", user.uid));
//     return onSnapshot(q, (snap) => {
//       const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       arr.sort(
//         (a, b) =>
//           (b.created_at?.seconds || b.createdAt?.seconds || 0) -
//           (a.created_at?.seconds || a.createdAt?.seconds || 0)
//       );
//       setJobs24(arr);
//       setJobs24Loading(false);
//     });
//   }, [user]);

//   /* ---------------- PAUSE ---------------- */
//   const togglePause = async (job, col, e) => {
//     e.stopPropagation();
//     await updateDoc(doc(db, col, job.id), {
//       paused: !job.paused,
//       pausedAt: !job.paused ? serverTimestamp() : null,
//     });
//   };

//   /* ---------------- HELPERS ---------------- */
//   const filterSearch = (arr) =>
//     !searchText
//       ? arr
//       : arr.filter((i) =>
//         (i.title || "").toLowerCase().includes(searchText.toLowerCase())
//       );

//   const sortArr = (arr) => {
//     if (sortOption === "paused") return arr.filter((i) => i.paused);
//     if (sortOption === "oldest")
//       return [...arr].sort(
//         (a, b) =>
//           (a.createdAt?.seconds || a.created_at?.seconds || 0) -
//           (b.createdAt?.seconds || b.created_at?.seconds || 0)
//       );
//     return arr;
//   };

//   const getInitials = (title) => {
//     if (!title) return "";
//     const w = title.split(" ");
//     return (w[0][0] + (w[1]?.[0] || "")).toUpperCase();
//   };

//   const finalServices = sortArr(filterSearch(services));
//   const final24 = sortArr(filterSearch(jobs24));
// const renderEmptyState = (btnText, onClick) => (
//   <div
//     style={{
//       width: "100%",
//       minHeight: "60vh", // 👈 vertical centering
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//       justifyContent: "center",
//       textAlign: "center",
//       gap: 16,
//     }}
//   >
//     <img
//       src={serviceEmpty}
//       alt="Empty"
//       style={{
//         width: isMobile ? 180 : 240,
//       }}
//     />

//     <div style={{ fontSize: 20, fontWeight: 600 }}>
//       Start your first service today
//     </div>

//     <div
//       style={{
//         fontSize: 14,
//         color: "#555",
//         maxWidth: 520,
//         lineHeight: "20px",
//       }}
//     >
//       Showcase your skills with a service offering that attracts the right
//       clients. Start now and turn your expertise into opportunities!
//     </div>

//     <button
//       onClick={onClick}
//       style={{
//         marginTop: 12,
//         height: 44,
//         padding: "0 28px",
//         borderRadius: 30,
//         background: "#FFF27A",
//         border: "none",
//         fontWeight: 700,
//         cursor: "pointer",
//       }}
//     >
//       {btnText}
//     </button>
//   </div>
// );


//   /* ---------------- CARD ---------------- */
//   const WorkCard = (job) => (
//     <div
//       key={job.id}
//       onClick={() =>
//         navigate(
//           selectedTab === "Works"
//             ? `/freelance-dashboard/servicesdetails/${job.id}`
//             : `/freelance-dashboard/services24details/${job.id}`
//         )
//       }
//       style={{
//         width: "100%", // 👈 fills column
//         height: isMobile ? "auto" : 259,
//         borderRadius: 24,
//         backgroundColor: "#FFFFFF",
//         padding: 16,
//         boxShadow:
//           "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
//         cursor: "pointer",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "space-between",
//         position: "relative",
//       }}

//     >
//       <img
//         src={arrow}
//         alt=""
//         style={{ position: "absolute", top: 16, right: 16, width: 14 }}
//       />

//       <div style={{ display: "flex", gap: 16 }}>
//         <div
//           style={{
//             width: 56,
//             height: 56,
//             borderRadius: 14,
//             background: "linear-gradient(135deg,#7B3CFF,#9B42FF)",
//             color: "#FFF",
//             fontWeight: 700,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             fontSize: 18,
//           }}
//         >
//           {getInitials(job.title)}
//         </div>

//         <div style={{ flex: 1 }}>
//           <div style={{ fontWeight: 600, fontSize: 16, textTransform: "uppercase" }}>{job.title}</div>
//           <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
//             {job.skills?.slice(0, 3).map((s, i) => (
//               <div
//                 key={i}
//                 style={{
//                   background: "#FFF7B0",
//                   marginTop: isMobile ? "10px" : 0,
//                   marginBottom: isMobile ? "20px" : 0,
//                   padding: "4px 12px",
//                   borderRadius: 20,
//                   fontSize: 12,
//                 }}
//               >
//                 {s}
//               </div>
//             ))}
//             {job.skills?.length > 3 && (
//               <div style={{ fontSize: 12 }}>
//                 +{job.skills.length - 3}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: isMobile ? "20px" : 0, }}>
//         <div>
//           <div style={{ fontSize: 15 }}>Budget</div>
//           <div style={{ marginTop: 4, fontSize: 13, fontWeight: 500, color: "rgba(124,60,255,1)" }}>
//             ₹{job.budget_from} -   ₹{job.budget_to}
//           </div>
//         </div>
//         <div>
//           <div style={{ fontSize: 13 }}>Timeline</div>
//           <div style={{ fontSize: 14, fontWeight: 600 }}>
//             {job.deliveryDuration || "2 - 3 weeks"}
//           </div>
//         </div>
//         <div>
//           <div style={{ fontSize: 13 }}>Location</div>
//           <div style={{ fontSize: 14, fontWeight: 600 }}>
//             {job.location || "Remote"}
//           </div>
//         </div>
//       </div>

//       <div style={{ display: "flex", gap: 12 }}>
//         <button
//           onClick={(e) => togglePause(job, "services", e)}
//           style={{
//             flex: 1,
//             height: 40,
//             borderRadius: 30,
//             border: "1px solid #BDBDBD",
//             background: "#FFF",
//             fontWeight: 600,
//           }}
//         >
//           {job.paused ? "Resume Service" : "Pause Service"}
//         </button>

//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             navigate(
//               `/freelance-dashboard/freelanceredit-service/${job.id}`,
//               { state: { job } }
//             );
//           }}
//           style={{
//             flex: 1,
//             height: 40,
//             borderRadius: 30,
//             background: "#FFF27A",
//             border: "none",
//             fontWeight: 700,
//           }}
//         >
//           Edit Service
//         </button>
//       </div>
//     </div>
//   );

//   /* ---------------- UI ---------------- */
//   return (
//     <div style={{ maxWidth: 1100, margin: "0 auto" }}>
//       <div
//         style={{
//           minHeight: "100vh",
//           padding: 24,
//           background: "#FFF",
//           marginLeft: isMobile ? 0 : collapsed ? "-150px" : "40px",
//           transition: "margin-left 0.3s ease-in-out",
//           marginTop: isMobile ? 50 : collapsed ? 0 : 0,

//         }}
//       >
//         {/* HEADER */}
//         <div style={{ display: "flex", alignItems: "center", gap: 12, }}>
//           <div
//             onClick={() => navigate(-1)}
//             style={{
//               width: 36,
//               height: 36,
//               borderRadius: 14,
//               border: "0.8px solid #E0E0E0",
//               backgroundColor: "#FFFFFF",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               cursor: "pointer",
//               boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
//               flexShrink: 0,
//               marginLeft: isMobile ? 0 : "40px ",
//             }}
//           >
//             <img
//               src={backarrow}
//               alt="Back"
//               style={{
//                 width: 16,
//                 height: 18,
//                 objectFit: "contain",

//               }}
//             />
//           </div>

//           <div>
//             <div style={{ fontSize: 32, fontWeight: 400 }}>Your Service</div>
//             <div style={{ fontSize: 14 }}>List Your Service, Reach More People.</div>
//           </div>
//         </div>

//         {/* TABS + GRID CONTAINER */}
//         <div
//           style={{
//             width: "100%",
//             maxWidth: 928,
//             margin: "24px auto",
//           }}
//         >
//           {/* TABS */}
//           {/* TABS */}
//           <div
//             style={{
//               maxWidth: 928,
//               margin: "24px auto 0",
//               height: 49.6,
//               borderRadius: 16,
//               padding: 10,
//               display: "flex",
//               gap: 12,
//               justifyContent: "flex-start", // 👈 LEFT aligned
//               background: "#FFF8E1",
//               boxShadow:
//                 "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
//             }}
//           >
//             {["Works", "24 Hours"].map((tab) => (
//               <div
//                 key={tab}
//                 onClick={() => setSelectedTab(tab)}
//                 style={{
//                   minWidth: 120, // 👈 consistent size
//                   height: 29,
//                   padding: "10px 24px",
//                   borderRadius: 14,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontSize: 14,
//                   fontWeight: 600,
//                   cursor: "pointer",
//                   background: selectedTab === tab ? "#FFF" : "transparent",
//                 }}
//               >
//                 {tab}
//               </div>
//             ))}
//           </div>


//           {/* GRID */}
//           <div
//             style={{
//               marginTop: 24,
//               display: "grid",
//               gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
//               gap: 32,
//               justifyItems: "stretch", // 👈 cards stretch evenly
//             }}
//           >
//             {selectedTab === "Works" ? (
//               servicesLoading ? (
//                 <div>Loading...</div>
//               ) : finalServices.length === 0 ? (
//                   <div style={{ gridColumn: "1 / -1" }}>
//               {  renderEmptyState("Create Service", () =>
//                   navigate("/freelance-dashboard/add-service-form")
//                 )}</div>
//               ) : (
//                 finalServices.map(WorkCard)
//               )
//             ) : jobs24Loading ? (
//               <div>Loading...</div>
//             ) : final24.length === 0 ? (
//                <div style={{ gridColumn: "1 / -1" }}>{
//               renderEmptyState("Create 24h Service", () =>
//                 navigate("/freelance-dashboard/add-service-form")
//               )}</div>
//             ) : (
//               final24.map(WorkCard)
//             )}
//           </div>
//         </div>

//         {/* FAB */}
//         <button
//           onClick={() => navigate("/freelance-dashboard/add-service-form")}
//           style={{
//             position: "fixed",
//             right: 32,
//             bottom: 32,
//             width: 64,
//             height: 64,
//             borderRadius: "50%",
//             background: "#7B3CFF",
//             color: "#FFF",
//             fontSize: 32,
//             border: "none",
//           }}
//         >
//           +
//         </button>
//       </div>
//     </div>
//   );

// }






import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
 collection,
 doc,
 onSnapshot,
 query,
 where,
 updateDoc,
 serverTimestamp,
} from "firebase/firestore";
import { db } from "../firbase/Firebase";

import backarrow from "../assets/backarrow.png";
import arrow from "../assets/arrow.png";
import serviceEmpty from "../assets/service.png";
import search from "../assets/search.png";

/* ---------------- SIDEBAR ---------------- */
const useSidebar = () => {
 const [collapsed, setCollapsed] = useState(
 localStorage.getItem("sidebar-collapsed") === "true"
 );

 useEffect(() => {
 const handler = (e) => setCollapsed(e.detail);
 window.addEventListener("sidebar-toggle", handler);
 return () => window.removeEventListener("sidebar-toggle", handler);
 }, []);

 return collapsed;
};

/* ---------------- MAIN ---------------- */
export default function ServiceScreenOne() {
 const navigate = useNavigate();
 const auth = getAuth();
 const collapsed = useSidebar();

 const [selectedTab, setSelectedTab] = useState("Works");
 const [searchText, setSearchText] = useState("");
 const [services, setServices] = useState([]);
 const [jobs24, setJobs24] = useState([]);
 const [servicesLoading, setServicesLoading] = useState(true);
 const [jobs24Loading, setJobs24Loading] = useState(true);
 const [user, setUser] = useState(null);

 const [sortMenuOpen, setSortMenuOpen] = useState(false);
 const [sortOption, setSortOption] = useState("newest");

 const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

 /* ---------------- RESPONSIVE ---------------- */
 useEffect(() => {
 const resize = () => setIsMobile(window.innerWidth <= 768);
 window.addEventListener("resize", resize);
 return () => window.removeEventListener("resize", resize);
 }, []);

 /* ---------------- AUTH ---------------- */
 useEffect(() => {
 const unsub = onAuthStateChanged(auth, (u) => setUser(u));
 return () => unsub();
 }, []);

 /* ---------------- SERVICES ---------------- */
 useEffect(() => {
 if (!user) return;
 setServicesLoading(true);

 const q = query(collection(db, "services"), where("userId", "==", user.uid));
 return onSnapshot(q, (snap) => {
 const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
 arr.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
 setServices(arr);
 setServicesLoading(false);
 });
 }, [user]);

 /* ---------------- 24H ---------------- */
 useEffect(() => {
 if (!user) return;
 setJobs24Loading(true);

 const q = query(collection(db, "service_24h"), where("userId", "==", user.uid));
 return onSnapshot(q, (snap) => {
 const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
 arr.sort(
 (a, b) =>
 (b.created_at?.seconds || b.createdAt?.seconds || 0) -
 (a.created_at?.seconds || a.createdAt?.seconds || 0)
 );
 setJobs24(arr);
 setJobs24Loading(false);
 });
 }, [user]);

 /* ---------------- PAUSE ---------------- */
 const togglePause = async (job, col, e) => {
 e.stopPropagation();
 await updateDoc(doc(db, col, job.id), {
 paused: !job.paused,
 pausedAt: !job.paused ? serverTimestamp() : null,
 });
 };

 /* ---------------- HELPERS ---------------- */
 const filterSearch = (arr) =>
 !searchText
 ? arr
 : arr.filter((i) =>
 (i.title || "").toLowerCase().includes(searchText.toLowerCase())
 );

 const sortArr = (arr) => {
 if (sortOption === "paused") return arr.filter((i) => i.paused);
 if (sortOption === "oldest")
 return [...arr].sort(
 (a, b) =>
 (a.createdAt?.seconds || a.created_at?.seconds || 0) -
 (b.createdAt?.seconds || b.created_at?.seconds || 0)
 );
 return arr;
 };

 const getInitials = (title) => {
 if (!title) return "";
 const w = title.split(" ");
 return (w[0][0] + (w[1]?.[0] || "")).toUpperCase();
 };

 const finalServices = sortArr(filterSearch(services));
 const final24 = sortArr(filterSearch(jobs24));
const renderEmptyState = (btnText, onClick) => (
 <div
 style={{
 width: "100%",
 minHeight: "60vh", // 👈 vertical centering
 display: "flex",
 flexDirection: "column",
 alignItems: "center",
 justifyContent: "center",
 textAlign: "center",
 gap: 16,
 }}
 >
 <img
 src={serviceEmpty}
 alt="Empty"
 style={{
 width: isMobile ? 180 : 240,
 }}
 />

 <div style={{ fontSize: 20, fontWeight: 600 }}>
 Start your first service today
 </div>

 <div
 style={{
 fontSize: 14,
 color: "#555",
 maxWidth: 520,
 lineHeight: "20px",
 }}
 >
 Showcase your skills with a service offering that attracts the right
 clients. Start now and turn your expertise into opportunities!
 </div>

 <button
 onClick={onClick}
 style={{
 marginTop: 12,
 height: 44,
 padding: "0 28px",
 borderRadius: 30,
 background: "#FFF27A",
 border: "none",
 fontWeight: 700,
 cursor: "pointer",
 }}
 >
 {btnText}
 </button>
 </div>
);


 /* ---------------- CARD ---------------- */
 const WorkCard = (job) => (
 <div
 key={job.id}
 onClick={() =>
 navigate(
 selectedTab === "Works"
 ? `/freelance-dashboard/servicesdetails/${job.id}`
 : `/freelance-dashboard/services24details/${job.id}`
 )
 }

 
 style={{
 width: "100%", // 👈 fills column
 height: isMobile ? "auto" : 259,
 borderRadius: 24,
 backgroundColor: "#FFFFFF",
 padding: 16,
 boxShadow:
 "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
 cursor: "pointer",
 display: "flex",
 flexDirection: "column",
 justifyContent: "space-between",
 position: "relative",
 }}

 >
 <img
 src={arrow}
 alt=""
 style={{ position: "absolute", top: 16, right: 16, width: 14 }}
 />

 <div style={{ display: "flex", gap: 16 }}>
 <div
 style={{
 width: 56,
 height: 56,
 borderRadius: 14,
 background: "linear-gradient(135deg,#7B3CFF,#9B42FF)",
 color: "#FFF",
 fontWeight: 700,
 display: "flex",
 alignItems: "center",
 justifyContent: "center",
 fontSize: 18,
 }}
 >
 {getInitials(job.title)}
 </div>

 <div style={{ flex: 1 }}>
 <div style={{ fontWeight: 600, fontSize: 16, textTransform: "uppercase" }}>{job.title}</div>
 <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
 {job.skills?.slice(0, 3).map((s, i) => (
 <div
 key={i}
 style={{
 background: "#FFF7B0",
 marginTop: isMobile ? "10px" : 0,
 marginBottom: isMobile ? "20px" : 0,
 padding: "4px 12px",
 borderRadius: 20,
 fontSize: 12,
 }}
 >
 {s}
 </div>
 ))}
 {job.skills?.length > 3 && (
 <div style={{ fontSize: 12 }}>
 +{job.skills.length - 3}
 </div>
 )}
 </div>
 </div>
 </div>

 <div style={{ display: "flex", justifyContent: "space-between", marginBottom: isMobile ? "20px" : 0, }}>
 <div>
 <div style={{ fontSize: 15 }}>Budget</div>
 <div style={{ marginTop: 4, fontSize: 13, fontWeight: 500, color: "rgba(124,60,255,1)" }}>
 ₹{job.budget_from} - ₹{job.budget_to}
 </div>
 </div>
 <div>
 <div style={{ fontSize: 13 }}>Timeline</div>
 <div style={{ fontSize: 14, fontWeight: 600 }}>
 {job.deliveryDuration || "2 - 3 weeks"}
 </div>
 </div>
 <div>
 <div style={{ fontSize: 13 }}>Location</div>
 <div style={{ fontSize: 14, fontWeight: 600 }}>
 {job.location || "Remote"}
 </div>
 </div>
 </div>

 <div style={{ display: "flex", gap: 12 }}>
 <button
 onClick={(e) => togglePause(job, "services", e)}
 style={{
 flex: 1,
 height: 40,
 borderRadius: 30,
 border: "1px solid #BDBDBD",
 background: "#FFF",
 fontWeight: 600,
 }}
 >
 {job.paused ? "Resume Service" : "Pause Service"}
 </button>

 <button
 onClick={(e) => {
 e.stopPropagation();
 navigate(
 selectedTab === "Works"
 ? `/freelance-dashboard/freelanceredit-service/${job.id}`
 : `/freelance-dashboard/freelanceredit-service24h/${job.id}`
 )
 }}
 style={{
 flex: 1,
 height: 40,
 borderRadius: 30,
 background: "#FFF27A",
 border: "none",
 fontWeight: 700,
 }}
 >
 Edit Service
 </button>
 </div>
 </div>
 );

 /* ---------------- UI ---------------- */
 return (
 <div style={{ maxWidth: 1100, margin: "0 auto" }}>
 <div
 style={{
 minHeight: "100vh",
 padding: 24,
 background: "#FFF",
 marginLeft: isMobile ? 0 : collapsed ? "-150px" : "40px",
 transition: "margin-left 0.3s ease-in-out",
 marginTop: isMobile ? 50 : collapsed ? 0 : 0,

 }}
 >
 {/* HEADER */}
 <div style={{ display: "flex", alignItems: "center", gap: 12, }}>
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
 boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
 flexShrink: 0,
 marginLeft: isMobile ? 0 : "40px ",
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
 <div style={{ fontSize: 32, fontWeight: 400 }}>Your Service</div>
 <div style={{ fontSize: 14 }}>List Your Service, Reach More People.</div>
 </div>
 </div>

 {/* TABS + GRID CONTAINER */}
 <div
 style={{
 width: "100%",
 maxWidth: 928,
 margin: "24px auto",
 }}
 >
 {/* TABS */}
 {/* TABS */}
 <div
 style={{
 maxWidth: 928,
 margin: "24px auto 0",
 height: 49.6,
 borderRadius: 16,
 padding: 10,
 display: "flex",
 gap: 12,
 justifyContent: "flex-start", // 👈 LEFT aligned
 background: "#FFF8E1",
 boxShadow:
 "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
 }}
 >
 {["Works", "24 Hours"].map((tab) => (
 <div
 key={tab}
 onClick={() => setSelectedTab(tab)}
 style={{
 minWidth: 120, // 👈 consistent size
 height: 29,
 padding: "10px 24px",
 borderRadius: 14,
 display: "flex",
 alignItems: "center",
 justifyContent: "center",
 fontSize: 14,
 fontWeight: 600,
 cursor: "pointer",
 background: selectedTab === tab ? "#FFF" : "transparent",
 }}
 >
 {tab}
 </div>
 ))}
 </div>


 {/* GRID */}
 <div
 style={{
 marginTop: 24,
 display: "grid",
 gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
 gap: 32,
 justifyItems: "stretch", // 👈 cards stretch evenly
 }}
 >
 {selectedTab === "Works" ? (
 servicesLoading ? (
 <div>Loading...</div>
 ) : finalServices.length === 0 ? (
 <div style={{ gridColumn: "1 / -1" }}>
 { renderEmptyState("Create Service", () =>
 navigate("/freelance-dashboard/add-service-form")
 )}</div>
 ) : (
 finalServices.map(WorkCard)
 )
 ) : jobs24Loading ? (
 <div>Loading...</div>
 ) : final24.length === 0 ? (
 <div style={{ gridColumn: "1 / -1" }}>{
 renderEmptyState("Create 24h Service", () =>
 navigate("/freelance-dashboard/add-service-form")
 )}</div>
 ) : (
 final24.map(WorkCard)
 )}
 </div>
 </div>

 {/* FAB */}
 <button
 onClick={() => navigate("/freelance-dashboard/add-service-form")}
 style={{
 position: "fixed",
 right: 32,
 bottom: 32,
 width: 64,
 height: 64,
 borderRadius: "50%",
 background: "#7B3CFF",
 color: "#FFF",
 fontSize: 32,
 border: "none",
 }}
 >
 +
 </button>
 </div>
 </div>
 );

}