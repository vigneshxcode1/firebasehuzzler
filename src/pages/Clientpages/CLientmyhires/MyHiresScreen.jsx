// import { getAuth } from "firebase/auth";
// import { useEffect, useState } from "react";
// import {
//   IoChatbubbleEllipsesOutline,
//   IoNotificationsOutline,
//   IoSearch,
//   IoLocationOutline,
//   IoTimeOutline,
//   IoCashOutline,
//   IoConstructOutline,
//   IoBriefcaseOutline
// } from "react-icons/io5";
// import { useNavigate } from "react-router-dom";
// import profileImg from "../../../assets/profile.png";
// import backarrow from "../../../assets/backarrow.png";
// import {
//   collection,
//   onSnapshot,
//   orderBy,
//   query,
//   Timestamp,
//   where,
//   doc,
//   updateDoc,
//   deleteDoc,
//   getDoc
// } from "firebase/firestore";
// import { db } from "../../../firbase/Firebase";

// export default function HireFreelancer() {
//   const auth = getAuth();
//   const navigate = useNavigate();

//   const [activeTab, setActiveTab] = useState("requested");
//   const [requests, setRequests] = useState([]);
//   const [search, setSearch] = useState("");
//   const [selectedRequest, setSelectedRequest] = useState(null); // For detail modal
//   const [freelancerProfiles, setFreelancerProfiles] = useState({}); // Cache profiles

//   /* ================= HELPERS ================= */

//   const getStartMessage = (title) =>
//     `Hi 👋 I've reviewed your application for "${title}". Let's discuss the next steps.`;

//   const markAsRead = async (id) => {
//     await updateDoc(doc(db, "notifications", id), { read: true });
//   };

//   const deleteRequest = async (id) => {
//     if (!window.confirm("Delete this request?")) return;
//     await deleteDoc(doc(db, "notifications", id));
//   };

//   const hireFreelancer = async (item) => {
//     if (!window.confirm(`Hire ${item.freelancerName}?`)) return;
//     await updateDoc(doc(db, "notifications", item.id), { read: true });
//   };

//   const timeAgo = (input) => {
//     if (!input) return "N/A";
//     const d = input instanceof Timestamp ? input.toDate() : new Date(input);
//     const diff = (Date.now() - d.getTime()) / 1000;

//     if (diff < 60) return "Just now";
//     if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
//     if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
//     if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
//     return `${Math.floor(diff / 604800)} weeks ago`;
//   };

//   const formatBudget = (from, to) => {
//     if (!from && !to) return "Not specified";
//     if (from && to) return `₹${from.toLocaleString()} - ₹${to.toLocaleString()}`;
//     return `₹${(from || to).toLocaleString()}`;
//   };

//   /* ================= FETCH FREELANCER PROFILE ================= */

//   const fetchFreelancerProfile = async (freelancerId) => {
//     if (!freelancerId || freelancerProfiles[freelancerId]) return;

//     try {
//       // Try 'users' collection first
//       let profileDoc = await getDoc(doc(db, "users", freelancerId));

//       if (!profileDoc.exists()) {
//         // Try 'freelancers' collection
//         profileDoc = await getDoc(doc(db, "freelancers", freelancerId));
//       }

//       if (profileDoc.exists()) {
//         setFreelancerProfiles(prev => ({
//           ...prev,
//           [freelancerId]: profileDoc.data()
//         }));
//       }
//     } catch (err) {
//       console.error("Error fetching freelancer profile:", err);
//     }
//   };

//   /* ================= FIRESTORE ================= */

//   useEffect(() => {
//     if (!auth.currentUser?.uid) return;

//     const q = query(
//       collection(db, "notifications"),
//       where("clientUid", "==", auth.currentUser.uid),
//       where("type", "==", "application"),
//       orderBy("timestamp", "desc")
//     );

//     return onSnapshot(q, (snap) => {
//       const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setRequests(data);

//       // Fetch profiles for all freelancers
//       data.forEach(item => {
//         if (item.freelancerId) {
//           fetchFreelancerProfile(item.freelancerId);
//         }
//       });
//     });
//   }, [auth.currentUser?.uid]);

//   const requestedList = requests.filter((r) => r.read === false);
//   const hiredList = requests.filter((r) => r.read === true);

//   const listToShow = activeTab === "requested" ? requestedList : hiredList;

//   const finalList = listToShow.filter((i) =>
//     i.freelancerName?.toLowerCase().includes(search.toLowerCase()) ||
//     i.service?.title?.toLowerCase().includes(search.toLowerCase()) ||
//     i.service?.category?.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <>
//       <style>{`
//         * { font-family: "Rubik", sans-serif; box-sizing: border-box; }

//         .hire-root {
//   background: linear-gradient(180deg, #ffffffff 0%, #fff 100%);
//   padding: 24px;
//   padding-top: 24px;

//   max-width: 1000px;   /* 🔥 WIDTH CONTROL */
//   margin: 0 auto;     /* 🔥 CENTER ALIGN */
// }


//         /* HEADER */
//         .hire-header {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//         }
//         .hire-title {
//           font-size: 22px;
//           font-weight: 255;
//           color: #1f2937;

//         }
//         .header-icons {
//           display: flex;
//           align-items: center;
//           gap: 16px;
//         }
//         .header-icons svg {
//           cursor: pointer;
//           color: #6b7280;
//           transition: color 0.2s;
//         }
//         .header-icons svg:hover {
//           color: #7c3aed;
//         }
//         .header-profile {
//           width: 36px;
//           height: 36px;
//           border-radius: 50%;
//           object-fit: cover;
//           border: 2px solid #e5e7eb;
//         }

//         /* SEARCH */
//         .hire-search {
//           margin: 22px 0;
//           height: 50px;
//           background: #fff;
//           padding: 0 20px;
//           border-radius: 18px;
//           display: flex;
//           align-items: center;
//           gap: 12px;

//           box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
//         }
//         .hire-search svg {
//           color: #9ca3af;
//           font-size: 20px;
//         }
//         .hire-search input {
//           border: none;
//           outline: none;
//           width: 100%;
//           font-size: 14px;
//           background: transparent;
//           margin-top:15px;
//           margin-left:-15px;
//         }

//         /* TABS */
//         .hire-tabs {
//           display: flex;
//           width: 100%;
//           max-width: 400px;
//           margin: 0 auto 18px;
//           background: #fff;
//           padding: 6px;
//           border-radius: 40px;
//           box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
//         }
//         .hire-tab {
//           flex: 1;
//           text-align: center;
//           padding: 12px 0;
//           font-weight: 600;
//           border-radius: 30px;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           color: #6b7280;
//         }
//         .hire-tab:hover {
//           background: #f3f4f6;
//         }
//         .hire-tab.active {
//           background: linear-gradient(135deg, #8b5cf6, #7c3aed);
//           color: #fff;
//         }
//         .hire-tab .count {
//           background: #ef4444;
//           color: #fff;
//           font-size: 11px;
//           padding: 2px 6px;
//           border-radius: 10px;
//           margin-left: 6px;
//         }
//         .hire-tab.active .count {
//           background: #fff;
//           color: #7c3aed;
//         }

//         /* FILTER BAR */
//         .filter-bar {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           background: #fff;
//           padding: 12px 16px;
//           border-radius: 14px;
//           margin-bottom: 20px;
//           box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
//         }
//         .filter-left {
//           display: flex;
//           gap: 8px;
//         }
//         .filter-chip {
//           background: #f3f4f6;
//           padding: 6px 14px;
//           border-radius: 20px;
//           font-size: 13px;
//           cursor: pointer;
//           transition: all 0.2s;
//         }
//         .filter-chip:hover, .filter-chip.active {
//           background: #ede9fe;
//           color: #7c3aed;
//         }
//         .filter-right {
//           color: #7c3aed;
//           font-weight: 600;
//           font-size: 14px;
//         }

//         /* GRID */
//         .hire-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
//           gap: 24px;
//         }

//         /* CARD */
//         .hire-card {
//           background: #fff;
//           border-radius: 22px;
//           box-shadow: 0 14px 30px rgba(0, 0, 0, 0.1);
//           overflow: hidden;
//           transition: transform 0.3s, box-shadow 0.3s;
//         }
//         .hire-card:hover {
//           transform: translateY(-4px);
//           box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
//         }

//         .card-top {
//           height: 100px;
//           background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%);
//           position: relative;
//         }

//         .time-badge {
//           position: absolute;
//           top: 12px;
//           right: 12px;
//           background: rgba(255,255,255,0.95);
//           padding: 6px 12px;
//           border-radius: 18px;
//           font-size: 11px;
//           font-weight: 500;
//           color: #6b7280;
//           display: flex;
//           align-items: center;
//           gap: 4px;
//         }

//         .source-badge {
//           position: absolute;
//           top: 12px;
//           left: 12px;
//           background: rgba(255,255,255,0.2);
//           backdrop-filter: blur(10px);
//           padding: 4px 10px;
//           border-radius: 12px;
//           font-size: 10px;
//           font-weight: 600;
//           color: #fff;
//           text-transform: uppercase;
//         }

//         .profile-img {
//           width: 80px;
//           height: 80px;
//           border-radius: 50%;
//           border: 4px solid #fff;
//           object-fit: cover;
//           position: absolute;
//           bottom: -40px;
//           left: 50%;
//           transform: translateX(-50%);
//           box-shadow: 0 8px 20px rgba(0,0,0,0.15);
//         }

//         .card-body {
//           padding: 50px 20px 20px;
//         }

//         .card-header {
//           text-align: center;
//           margin-bottom: 16px;
//         }

//         .name {
//           font-weight: 700;
//           font-size: 18px;
//           color: #1f2937;
//         }

//         .role {
//           color: #7c3aed;
//           font-size: 14px;
//           font-weight: 500;
//           margin-top: 2px;
//         }

//         .location {
//           font-size: 12px;
//           color: #6b7280;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 4px;
//           margin-top: 4px;
//         }

//         /* SERVICE INFO */
//         .service-section {
//           background: #f9fafb;
//           border-radius: 14px;
//           padding: 14px;
//           margin: 12px 0;
//         }

//         .service-title {
//           font-weight: 600;
//           font-size: 15px;
//           color: #374151;
//           margin-bottom: 8px;
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }

//         .service-desc {
//           font-size: 12px;
//           color: #6b7280;
//           line-height: 1.5;
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }

//         .service-meta {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 8px;
//           margin-top: 10px;
//         }

//         .meta-item {
//           display: flex;
//           align-items: center;
//           gap: 4px;
//           font-size: 11px;
//           color: #6b7280;
//           background: #fff;
//           padding: 4px 10px;
//           border-radius: 8px;
//         }

//         .meta-item svg {
//           color: #7c3aed;
//           font-size: 14px;
//         }

//         .budget-highlight {
//           background: #dcfce7;
//           color: #166534;
//           font-weight: 600;
//         }

//         .category-badge {
//           background: #ede9fe;
//           color: #7c3aed;
//           padding: 4px 12px;
//           border-radius: 20px;
//           font-size: 11px;
//           font-weight: 600;
//           display: inline-block;
//           margin-bottom: 10px;
//         }

//         /* SKILLS */
//         .skills-section {
//           margin: 12px 0;
//         }

//         .skills-label {
//           font-size: 12px;
//           font-weight: 600;
//           color: #374151;
//           margin-bottom: 8px;
//         }

//         .skills {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 6px;
//         }

//         .skills span {
//           background: #ede9fe;
//           color: #5b21b6;
//           padding: 5px 12px;
//           border-radius: 14px;
//           font-size: 11px;
//           font-weight: 500;
//         }

//         .skills .more {
//           background: #7c3aed;
//           color: #fff;
//         }

//         /* TOOLS */
//         .tools-section {
//           margin: 12px 0;
//         }

//         .tools {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 6px;
//         }

//         .tools span {
//           background: #fef3c7;
//           color: #92400e;
//           padding: 4px 10px;
//           border-radius: 12px;
//           font-size: 10px;
//           font-weight: 500;
//         }

//         /* ACTION BUTTONS */
//         .card-actions {
//           display: flex;
//           gap: 10px;
//           margin-top: 16px;
//         }

//         .action-btn {
//           flex: 1;
//           padding: 12px;
//           border: none;
//           border-radius: 14px;
//           font-weight: 600;
//           font-size: 13px;
//           cursor: pointer;
//           transition: all 0.2s;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 6px;
//         }

//         .btn-primary {
//           background: linear-gradient(135deg, #7c3aed, #6d28d9);
//           color: #fff;
//         }

//         .btn-primary:hover {
//           background: linear-gradient(135deg, #6d28d9, #5b21b6);
//           transform: scale(1.02);
//         }

//         .btn-secondary {
//           background: #f3f4f6;
//           color: #374151;
//         }

//         .btn-secondary:hover {
//           background: #e5e7eb;
//         }

//         .btn-danger {
//           background: #fef2f2;
//           color: #dc2626;
//         }

//         .btn-danger:hover {
//           background: #fee2e2;
//         }

//         .btn-success {
//           background: linear-gradient(135deg, #059669, #10b981);
//           color: #fff;
//         }

//         /* VIEW MORE BUTTON */
//         .view-more-btn {
//           background: none;
//           border: none;
//           color: #7c3aed;
//           font-size: 12px;
//           font-weight: 600;
//           cursor: pointer;
//           padding: 6px 0;
//           text-decoration: underline;
//         }

//         /* EMPTY STATE */
//         .empty-state {
//           text-align: center;
//           padding: 60px 20px;
//           color: #9ca3af;
//         }

//         .empty-state svg {
//           font-size: 60px;
//           margin-bottom: 16px;
//           opacity: 0.5;
//         }

//         /* MODAL */
//         .detail-modal-backdrop {
//           position: fixed;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           background: rgba(0,0,0,0.6);
//           backdrop-filter: blur(4px);
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           z-index: 9999;
//           padding: 20px;
//         }

//         .detail-modal {
//           background: #fff;
//           border-radius: 24px;
//           max-width: 600px;
//           width: 100%;
//           max-height: 90vh;
//           overflow-y: auto;
//           animation: slideUp 0.3s ease;
//         }

//         @keyframes slideUp {
//           from { transform: translateY(30px); opacity: 0; }
//           to { transform: translateY(0); opacity: 1; }
//         }

//         .modal-header {
//           background: linear-gradient(135deg, #8b5cf6, #a855f7);
//           padding: 24px;
//           color: #fff;
//           position: relative;
//         }

//         .modal-close {
//           position: absolute;
//           top: 16px;
//           right: 16px;
//           background: rgba(255,255,255,0.2);
//           border: none;
//           color: #fff;
//           width: 32px;
//           height: 32px;
//           border-radius: 50%;
//           cursor: pointer;
//           font-size: 18px;
//         }

//         .modal-body {
//           padding: 24px;
//         }

//         .modal-section {
//           margin-bottom: 20px;
//         }

//         .modal-section-title {
//           font-size: 14px;
//           font-weight: 700;
//           color: #374151;
//           margin-bottom: 10px;
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }

//         .modal-desc {
//           font-size: 14px;
//           color: #6b7280;
//           line-height: 1.7;
//           white-space: pre-wrap;
//         }

//         /* RESPONSIVE */
//         @media (max-width: 768px) {
//           .hire-grid {
//             grid-template-columns: 1fr;
//           }

//           .hire-tabs {
//             max-width: 100%;
//           }

//           .filter-bar {
//             flex-direction: column;
//             gap: 12px;
//           }
//         }
//       `}</style>

//       <div className="hire-root">
//         {/* HEADER */}
//         <div className="hire-header">

//           <div style={{height: "40",fontWeight:"400"}} className="hire-title">Hire Freelancer</div>
//            <div
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
//           <div className="header-icons">
//             <IoChatbubbleEllipsesOutline size={22} />
//             <IoNotificationsOutline size={22} />
//             <img src={profileImg} className="header-profile" alt="Profile" />
//           </div>
//         </div>

//         {/* SEARCH */}
//         <div className="hire-search">
//           <IoSearch />
//           <input
//             placeholder="Search"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         {/* TABS */}
//         <div className="hire-tabs">
//           <div
//             className={`hire-tab ${activeTab === "requested" ? "active" : ""}`}
//             onClick={() => setActiveTab("requested")}
//           >
//             Requested
//             {requestedList.length > 0 && (
//               <span className="count">{requestedList.length}</span>
//             )}
//           </div>
//           <div
//             className={`hire-tab ${activeTab === "hired" ? "active" : ""}`}
//             onClick={() => setActiveTab("hired")}
//           >
//             Hired
//             {hiredList.length > 0 && (
//               <span className="count">{hiredList.length}</span>
//             )}
//           </div>
//         </div>

//         {/* FILTER */}
//         <div className="filter-bar">
//           <div className="filter-left">
//             <span className="filter-chip active">All</span>
//             <span className="filter-chip">Work</span>
//             <span className="filter-chip">24 Hours</span>
//           </div>
//           <div className="filter-right">
//             {finalList.length} {activeTab === "requested" ? "Requests" : "Hired"}
//           </div>
//         </div>

//         {/* CARDS */}
//         {finalList.length === 0 ? (
//           <div className="empty-state">
//             <IoBriefcaseOutline />
//             <p>No {activeTab === "requested" ? "requests" : "hired freelancers"} found</p>
//           </div>
//         ) : (
//           <div className="hire-grid">
//             {finalList.map((item) => {
//               const service = item.service || {};
//               const profile = freelancerProfiles[item.freelancerId] || {};

//               const skills = Array.isArray(service.skills)
//                 ? service.skills
//                 : [];

//               const tools = Array.isArray(service.tools)
//                 ? service.tools
//                 : [];

//               return (
//                 <div
//                   key={item.id}
//                   style={{
//                     background: "#fff",
//                     borderRadius: 24,
//                     boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
//                     overflow: "hidden",
//                     display: "flex",
//                     flexDirection: "column",
//                   }}
//                 >
//                   {/* TOP GRADIENT */}
//                   <div
//                     style={{
//                       height: 120,
//                       background: "linear-gradient(135deg,#a855f7,#6366f1)",
//                       position: "relative",
//                     }}
//                   >
//                     {/* TIME */}
//                     <div
//                       style={{
//                         position: "absolute",
//                         top: 12,
//                         right: 12,
//                         background: "rgba(255,255,255,0.25)",
//                         padding: "6px 14px",
//                         borderRadius: 20,
//                         fontSize: 12,
//                         color: "#fff",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 6,
//                       }}
//                     >

//                       {timeAgo(item.timestamp)}
//                     </div>

//                     {/* PROFILE IMAGE */}
//                     <img
//                       src={
//                         profile.profileImage ||
//                         profile.photoURL ||
//                         item.profileImage ||
//                         profileImg
//                       }
//                       alt={item.freelancerName}
//                       style={{
//                         width: 92,
//                         height: 92,
//                         borderRadius: "50%",
//                         border: "4px solid #fff",
//                         objectFit: "cover",
//                         position: "absolute",
//                         left: "50%",
//                         bottom: -46,
//                         transform: "translateX(-50%)",
//                         background: "#fff",
//                       }}
//                     />
//                   </div>

//                   {/* BODY */}
//                   <div style={{ padding: "60px 22px 22px", textAlign: "center" }}>
//                     <div style={{ fontSize: 18, fontWeight: 700 }}>
//                       {item.freelancerName}
//                     </div>

//                     <div
//                       style={{
//                         marginTop: 4,
//                         color: "#7c3aed",
//                         fontWeight: 600,
//                       }}
//                     >
//                       {profile.role || profile.title || service.category || "Freelancer"}
//                     </div>

//                     <div
//                       style={{
//                         marginTop: 4,
//                         fontSize: 13,
//                         color: "#6b7280",
//                       }}
//                     >
//                       {profile.location || profile.city || "Location not specified"}
//                     </div>

//                     {/* PROJECT TITLE */}
//                     <div
//                       style={{
//                         textAlign: "left",
//                         marginTop: 20,
//                         fontSize: 13,
//                         color: "#6b7280",
//                       }}
//                     >
//                       Project title
//                     </div>
//                     <div
//                       style={{
//                         textAlign: "left",
//                         fontWeight: 600,
//                         color: "#7c3aed",
//                         marginBottom: 16,
//                       }}
//                     >
//                       {service.title || item.title || "Service Request"}
//                     </div>

//                     {/* SKILLS */}
//                     {skills.length > 0 && (
//                       <>
//                         <div
//                           style={{
//                             textAlign: "left",
//                             fontSize: 13,
//                             color: "#6b7280",
//                             marginBottom: 8,
//                           }}
//                         >
//                           Skills
//                         </div>

//                         <div
//                           style={{
//                             display: "flex",
//                             flexWrap: "wrap",
//                             gap: 8,
//                           }}
//                         >
//                           {skills.slice(0, 3).map((s, i) => (
//                             <span
//                               key={i}
//                               style={{
//                                 padding: "6px 14px",
//                                 borderRadius: 20,
//                                 fontSize: 12,
//                                 background: "#f3e8ff",
//                                 color: "#7c3aed",
//                                 fontWeight: 500,
//                               }}
//                             >
//                               {s}
//                             </span>
//                           ))}
//                           {skills.length > 3 && (
//                             <span
//                               style={{
//                                 padding: "6px 14px",
//                                 borderRadius: 20,
//                                 fontSize: 12,
//                                 border: "1px solid #ddd",
//                                 color: "#555",
//                               }}
//                             >
//                               +{skills.length - 3}
//                             </span>
//                           )}
//                         </div>
//                       </>
//                     )}
//                   </div>

//                   {/* ACTION BUTTON */}
//                   <button
//                     onClick={() => {
//                       if (activeTab === "requested") {
//                         deleteRequest(item.id);
//                       } else {
//                         navigate("/chat", {
//                           state: {
//                             currentUid: auth.currentUser.uid,
//                             otherUid: item.freelancerId,
//                             otherName: item.freelancerName,
//                             otherImage:
//                               profile.profileImage || item.profileImage,
//                             initialMessage: getStartMessage(
//                               service.title || item.title
//                             ),
//                           },
//                         });
//                       }
//                     }}
//                     style={{
//                       margin: 22,
//                       marginTop: 0,
//                       padding: "16px",
//                       borderRadius: 16,
//                       border: "none",
//                       cursor: "pointer",
//                       fontSize: 15,
//                       fontWeight: 600,
//                       color: "#fff",
//                       background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
//                       boxShadow: "0 10px 20px rgba(124,58,237,0.35)",
//                     }}
//                   >
//                     {activeTab === "requested" ? "Delete Request" : "Start Message"}
//                   </button>
//                 </div>
//               );

//             })}
//           </div>
//         )}

//         {/* DETAIL MODAL */}
//         {selectedRequest && (
//           <div
//             style={{
//               position: "fixed",
//               inset: 0,
//               background: "rgba(0,0,0,0.5)",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               zIndex: 1000,
//               padding: 16,
//             }}
//             onClick={() => setSelectedRequest(null)}
//           >
//             <div
//               onClick={(e) => e.stopPropagation()}
//               style={{
//                 width: "100%",
//                 maxWidth: 520,
//                 background: "green",
//                 borderRadius: 24,
//                 overflow: "hidden",
//                 boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
//                 maxHeight: "90vh",
//                 overflowY: "auto",
//               }}
//             >
//               {/* HEADER */}
//               <div
//                 style={{
//                   background: "linear-gradient(135deg,#a855f7,#6366f1)",
//                   padding: "28px 20px 60px",
//                   position: "relative",
//                   textAlign: "center",
//                   color: "#fff",
//                 }}
//               >
//                 <button
//                   onClick={() => setSelectedRequest(null)}
//                   style={{
//                     position: "absolute",
//                     top: 14,
//                     right: 14,
//                     background: "rgba(255,255,255,0.25)",
//                     border: "none",
//                     color: "#fff",
//                     borderRadius: "50%",
//                     width: 32,
//                     height: 32,
//                     cursor: "pointer",
//                     fontSize: 16,
//                   }}
//                 >
//                   ✕
//                 </button>

//                 <div
//                   style={{
//                     position: "absolute",
//                     top: 14,
//                     left: 14,
//                     background: "rgba(255,255,255,0.25)",
//                     padding: "6px 14px",
//                     borderRadius: 20,
//                     fontSize: 12,
//                   }}
//                 >
//                   {timeAgo(selectedRequest.timestamp)}
//                 </div>

//                 <img
//                   src={selectedRequest.profileImage || profileImg}
//                   alt=""
//                   style={{
//                     width: 96,
//                     height: 96,
//                     borderRadius: "50%",
//                     border: "4px solid #fff",
//                     objectFit: "cover",
//                     position: "absolute",
//                     left: "50%",
//                     bottom: -48,
//                     transform: "translateX(-50%)",
//                     background: "#fff",
//                   }}
//                 />
//               </div>

//               {/* BODY */}
//               <div style={{ padding: "70px 22px 22px" }}>
//                 <h2 style={{ margin: 0, textAlign: "center", fontSize: 20 }}>
//                   {selectedRequest.freelancerName}
//                 </h2>

//                 <p
//                   style={{
//                     margin: "4px 0",
//                     textAlign: "center",
//                     color: "#7c3aed",
//                     fontWeight: 600,
//                   }}
//                 >
//                   {selectedRequest.service?.category || "Freelancer"}
//                 </p>

//                 <p
//                   style={{
//                     textAlign: "center",
//                     fontSize: 13,
//                     color: "#6b7280",
//                     marginBottom: 24,
//                   }}
//                 >
//                   Chennai, Tamilnadu
//                 </p>

//                 {/* SECTION */}
//                 <div style={{ marginBottom: 18 }}>
//                   <div style={{ fontSize: 13, color: "#6b7280" }}>Project title</div>
//                   <div style={{ fontWeight: 600, color: "#7c3aed" }}>
//                     {selectedRequest.service?.title || selectedRequest.title}
//                   </div>
//                 </div>

//                 {selectedRequest.service?.description && (
//                   <div style={{ marginBottom: 18 }}>
//                     <div style={{ fontSize: 13, color: "#6b7280" }}>Description</div>
//                     <p style={{ fontSize: 14, marginTop: 6 }}>
//                       {selectedRequest.service.description}
//                     </p>
//                   </div>
//                 )}

//                 {/* BUDGET */}
//                 <div style={{ marginBottom: 18 }}>
//                   <div style={{ fontSize: 13, color: "#6b7280" }}>Budget</div>
//                   <div style={{ fontWeight: 700, color: "#059669", fontSize: 18 }}>
//                     {formatBudget(
//                       selectedRequest.service?.budget_from,
//                       selectedRequest.service?.budget_to
//                     )}
//                   </div>
//                 </div>

//                 {/* SKILLS */}
//                 {selectedRequest.service?.skills?.length > 0 && (
//                   <div style={{ marginBottom: 24 }}>
//                     <div style={{ fontSize: 13, color: "#6b7280" }}>Skills</div>
//                     <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
//                       {selectedRequest.service.skills.map((s, i) => (
//                         <span
//                           key={i}
//                           style={{
//                             padding: "6px 14px",
//                             borderRadius: 20,
//                             fontSize: 12,
//                             background: "#f3e8ff",
//                             color: "#7c3aed",
//                             fontWeight: 500,
//                           }}
//                         >
//                           {s}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* ACTIONS */}
//                 <div style={{ display: "flex", gap: 12 }}>
//                   {activeTab === "requested" ? (
//                     <>
//                       <button
//                         onClick={() => {
//                           deleteRequest(selectedRequest.id);
//                           setSelectedRequest(null);
//                         }}
//                         style={{
//                           flex: 1,
//                           padding: 14,
//                           borderRadius: 14,
//                           border: "none",
//                           background: "#fee2e2",
//                           color: "#b91c1c",
//                           fontWeight: 600,
//                           cursor: "pointer",
//                         }}
//                       >
//                         Delete Request
//                       </button>

//                       <button
//                         onClick={() => {
//                           hireFreelancer(selectedRequest);
//                           setSelectedRequest(null);
//                         }}
//                         style={{
//                           flex: 1,
//                           padding: 14,
//                           borderRadius: 14,
//                           border: "none",
//                           background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
//                           color: "#fff",
//                           fontWeight: 600,
//                           cursor: "pointer",
//                         }}
//                       >
//                         Hire Freelancer
//                       </button>
//                     </>
//                   ) : (
//                     <button
//                       style={{
//                         width: "100%",
//                         padding: 16,
//                         borderRadius: 16,
//                         border: "none",
//                         background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
//                         color: "#fff",
//                         fontWeight: 600,
//                         fontSize: 15,
//                         cursor: "pointer",
//                       }}
//                       onClick={() => {
//                         setSelectedRequest(null);
//                         navigate("/chat", {
//                           state: {
//                             currentUid: auth.currentUser.uid,
//                             otherUid: selectedRequest.freelancerId,
//                             otherName: selectedRequest.freelancerName,
//                             initialMessage: getStartMessage(
//                               selectedRequest.service?.title || selectedRequest.title
//                             ),
//                           },
//                         });
//                       }}
//                     >
//                       Start Message
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//         )}
//       </div>
//     </>
//   );
// }



// import { getAuth } from "firebase/auth";
// import { useEffect, useState } from "react";
// import {
//   IoChatbubbleEllipsesOutline,
//   IoNotificationsOutline,
//   IoSearch,
//   IoLocationOutline,
//   IoTimeOutline,
//   IoCashOutline,
//   IoConstructOutline,
//   IoBriefcaseOutline,
// } from "react-icons/io5";
// import { useNavigate } from "react-router-dom";
// import profileImg from "../../../assets/profile.png";
// import backarrow from "../../../assets/backarrow.png";
// import {
//   collection,
//   onSnapshot,
//   orderBy,
//   query,
//   Timestamp,
//   where,
//   doc,
//   updateDoc,
//   deleteDoc,
//   getDoc,
// } from "firebase/firestore";
// import { db } from "../../../firbase/Firebase";

// export default function HireFreelancer() {
//   const auth = getAuth();
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("requested");
//   const [requests, setRequests] = useState([]);
//   const [search, setSearch] = useState("");
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [freelancerProfiles, setFreelancerProfiles] = useState({});
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   /* ================= HELPERS ================= */
//   const getStartMessage = (title) =>
//     `Hi 👋 I've reviewed your application for "${title}". Let's discuss the next steps.`;

//   const markAsRead = async (id) => {
//     await updateDoc(doc(db, "notifications", id), { read: true });
//   };

//   const deleteRequest = async (id) => {
//     if (!window.confirm("Delete this request?")) return;
//     await deleteDoc(doc(db, "notifications", id));
//   };

//   const hireFreelancer = async (item) => {
//     if (!window.confirm(`Hire ${item.freelancerName}?`)) return;
//     await updateDoc(doc(db, "notifications", item.id), { read: true });
//   };

//   const timeAgo = (input) => {
//     if (!input) return "N/A";
//     const d = input instanceof Timestamp ? input.toDate() : new Date(input);
//     const diff = (Date.now() - d.getTime()) / 1000;
//     if (diff < 60) return "Just now";
//     if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
//     if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
//     if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
//     return `${Math.floor(diff / 604800)} weeks ago`;
//   };

//   const formatBudget = (from, to) => {
//     if (!from && !to) return "Not specified";
//     if (from && to)
//       return `₹${from.toLocaleString()} - ₹${to.toLocaleString()}`;
//     return `₹${(from || to).toLocaleString()}`;
//   };

//   /* ================= FETCH FREELANCER PROFILE ================= */
//   const fetchFreelancerProfile = async (freelancerId) => {
//     if (!freelancerId || freelancerProfiles[freelancerId]) return;
//     try {
//       let profileDoc = await getDoc(doc(db, "users", freelancerId));
//       if (!profileDoc.exists()) {
//         profileDoc = await getDoc(doc(db, "freelancers", freelancerId));
//       }
//       if (profileDoc.exists()) {
//         setFreelancerProfiles((prev) => ({
//           ...prev,
//           [freelancerId]: profileDoc.data(),
//         }));
//       }
//     } catch (err) {
//       console.error("Error fetching freelancer profile:", err);
//     }
//   };

//   /* ================= FIRESTORE ================= */
//   useEffect(() => {
//     if (!auth.currentUser?.uid) return;
//     const q = query(
//       collection(db, "notifications"),
//       where("clientUid", "==", auth.currentUser.uid),
//       where("type", "==", "application"),
//       orderBy("timestamp", "desc")
//     );
//     return onSnapshot(q, (snap) => {
//       const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setRequests(data);
//       data.forEach((item) => {
//         if (item.freelancerId) {
//           fetchFreelancerProfile(item.freelancerId);
//         }
//       });
//     });
//   }, [auth.currentUser?.uid]);

//   const requestedList = requests.filter((r) => r.read === false);
//   const hiredList = requests.filter((r) => r.read === true);
//   const listToShow = activeTab === "requested" ? requestedList : hiredList;
//   const finalList = listToShow.filter(
//     (i) =>
//       i.freelancerName?.toLowerCase().includes(search.toLowerCase()) ||
//       i.service?.title?.toLowerCase().includes(search.toLowerCase()) ||
//       i.service?.category?.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <>
//       {/* HEADER */}
//       <div
//         style={{
//           position: "sticky",
//           top: 0,
//           zIndex: 50,
//           background: "#fff",
//           borderBottom: "1px solid #E0E0E0",
//           padding: "16px 20px",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             maxWidth: 1200,
//             margin: "0 auto",
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//             <div
//               onClick={() => navigate(-1)}
//               style={{
//                 width: 36,
//                 height: 36,
//                 borderRadius: 14,
//                 border: "0.8px solid #E0E0E0",
//                 backgroundColor: "#FFFFFF",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 cursor: "pointer",
//                 boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
//                 flexShrink: 0,
//                 marginLeft: isMobile ? 0 : "40px",
//               }}
//             >
//               <img
//                 src={backarrow}
//                 alt="back"
//                 style={{ width: 16, height: 16 }}
//               />
//             </div>
//             <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
//               Hire Freelancer
//             </h1>
//           </div>
//           <div style={{ display: "flex", gap: 16 }}>
//             <IoChatbubbleEllipsesOutline size={24} style={{ cursor: "pointer" }} />
//             <IoNotificationsOutline size={24} style={{ cursor: "pointer" }} />
//             <IoNotificationsOutline size={24} style={{ cursor: "pointer" }} />

//           </div>
//         </div>
//       </div>

//       {/* SEARCH */}
//       <div style={{ padding: "20px", maxWidth: 1200, margin: "0 auto" }}>
//         <div
//           style={{
//             position: "relative",
//             marginBottom: 24,
//           }}
//         >
//           <IoSearch
//             size={20}
//             style={{
//               position: "absolute",
//               left: 16,
//               top: "50%",
//               transform: "translateY(-50%)",
//               color: "#9CA3AF",
//               marginTop: '-1px'
//             }}
//           />
//           <input
//             type="text"
//             placeholder="Search"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             style={{
//               width: "100%",
//               padding: "14px 16px 14px 48px",
//               borderRadius: 16,
//               border: "1px solid #E5E7EB",
//               fontSize: 15,
//               outline: "none",
//               boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
//               marginTop: "10px"
//             }}
//           />
//         </div>

//         {/* TABS */}
//         <div
//           style={{
//             display: "flex",

//             width: "100%",
//             borderRadius: 999,
//             marginBottom: 24,
//             height: "60px",

//           }}
//         >
//           {/* REQUESTED */}
//           <button
//             onClick={() => setActiveTab("requested")}
//             style={{
//               width: "320px",
//               height: "50px",
//               border: "none",
//               borderRadius: 11,
//               paddingLeft: "100px",
//               cursor: "pointer",
//               fontSize: 15,
//               fontWeight: 600,
//               marginLeft: "240px",
//               display: "flex",
//               alignItems: "center",
//               boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
//               gap: 8,
//               background:
//                 activeTab === "requested"
//                   ? "linear-gradient(135deg,#8b5cf6,#6366f1)"
//                   : "transparent",
//               color: activeTab === "requested" ? "#fff" : "#111827",
//               boxShadow:
//                 activeTab === "requested"
//                   ? "0 8px 20px rgba(139,92,246,0.35)"
//                   : "none",
//               transition: "all 0.25s ease",
//             }}
//           >
//             Requested
//             {requestedList.length > 0 && (
//               <p
//                 style={{
//                   background:
//                     activeTab === "requested" ? "" : "",
//                   color: activeTab === "requested" ? "" : "",
//                   borderRadius: 999,
//                   padding: "2px 10px",
//                   fontSize: 12,
//                   fontWeight: 700,

//                 }}
//               >
//                 {/* {requestedList.length} */}
//               </p>
//             )}
//           </button>

//           {/* HIRED */}
//           <button
//             onClick={() => setActiveTab("hired")}
//             style={{
//               width: "320px",
//               height: "50px",
//               border: "none",
//               borderRadius: 11,
//               paddingLeft: "110px",
//               cursor: "pointer",
//               marginLeft: "30px",
//               fontSize: 15,
//               fontWeight: 600,
//               display: "flex",
//               alignItems: "center",
//               // boxShadow: "0 2px 8px rgba(0,0,0,0.04)",

//               gap: 8,
//               background:
//                 activeTab === "hired"
//                   ? "linear-gradient(135deg,#8b5cf6,#6366f1)"
//                   : "transparent",
//               color: activeTab === "hired" ? "#fff" : "#111827",
//               boxShadow:
//                 activeTab === "hired"
//                   ? "0 2px 8px rgba(0,0,0,0.04)"
//                   : "none",
//               transition: "all 0.25s ease",
//             }}
//           >
//             Hired
//             {hiredList.length > 0 && (
//               <span
//                 style={{
//                   background:
//                     activeTab === "hired" ? "" : "",
//                   color: activeTab === "hired" ? "" : "",
//                   borderRadius: 999,
//                   padding: "2px 10px",
//                   fontSize: 12,
//                   fontWeight: 700,
//                 }}
//               >
//                 {/* {hiredList.length} */}
//               </span>
//             )}
//           </button>
//         </div>


//         {/* FILTER */}
//         <div
//           style={{
//             background: "white",
//             height: "55px",

//             borderRadius: 24,
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: 24,
//             boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
//           }}
//         >
//           {/* LEFT FILTER BUTTONS */}
//           <div
//             style={{
//               display: "flex",
//               gap: 16,
//               alignItems: "center",
//             }}
//           >
//             <button
//               style={{
//                 marginLeft: "20px",
//                 padding: "7px 38px",
//                 borderRadius: 999,
//                 border: "none",
//                 background: "#7c3aed",
//                 fontSize: 14,
//                 fontWeight: 500,
//                 cursor: "pointer",
//                 boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
//               }}
//             >
//               Work
//             </button>

//             <button
//               style={{
//                 padding: "10px 36px",
//                 borderRadius: 999,
//                 border: "none",
//                 background: "#fff",
//                 fontSize: 14,
//                 fontWeight: 500,
//                 cursor: "pointer",
//                 boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
//               }}
//             >
//               24 hours
//             </button>
//           </div>

//           {/* RIGHT COUNT */}

//         </div>


//         {/* CARDS */}
//         {finalList.length === 0 ? (
//           <div
//             style={{
//               textAlign: "center",
//               padding: 60,
//               color: "#9CA3AF",
//               fontSize: 16,
//             }}
//           >
//             No {activeTab === "requested" ? "requests" : "hired freelancers"}{" "}
//             found
//           </div>
//         ) : (
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
//               gap: 20,
//             }}
//           >
//             {finalList.map((item) => {
//               const service = item.service || {};
//               const profile = freelancerProfiles[item.freelancerId] || {};
//               const skills = Array.isArray(service.skills) ? service.skills : [];
//               const tools = Array.isArray(service.tools) ? service.tools : [];

//               return (
//                 <div
//                   key={item.id}
//                   onClick={() => setSelectedRequest(item)}
//                   style={{
//                     background: "#fff",
//                     borderRadius: 20,
//                     overflow: "hidden",
//                     boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
//                     cursor: "pointer",
//                     transition: "all 0.3s ease",
//                     position: "relative",
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.transform = "translateY(-4px)";
//                     e.currentTarget.style.boxShadow =
//                       "0 12px 24px rgba(124,58,237,0.2)";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform = "translateY(0)";
//                     e.currentTarget.style.boxShadow =
//                       "0 4px 16px rgba(0,0,0,0.08)";
//                   }}
//                 >
//                   {/* TOP GRADIENT */}
//                   <div
//                     style={{
//                       height: 80,
//                       background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
//                       position: "relative",
//                     }}
//                   >
//                     {/* TIME */}
//                     <div
//                       style={{
//                         position: "absolute",
//                         top: 12,
//                         right: 12,
//                         background: "rgba(255,255,255,0.25)",
//                         backdropFilter: "blur(10px)",
//                         padding: "6px 12px",
//                         borderRadius: 20,
//                         fontSize: 12,
//                         color: "#fff",
//                         fontWeight: 600,
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 4,
//                       }}
//                     >
//                       <IoTimeOutline size={14} />
//                       {timeAgo(item.timestamp)}
//                     </div>

//                     {/* PROFILE IMAGE */}
//                     <div
//                       style={{
//                         position: "absolute",
//                         bottom: -30,
//                         left: 20,
//                         width: 70,
//                         height: 70,
//                         borderRadius: "50%",
//                         border: "4px solid #fff",
//                         overflow: "hidden",
//                         background: "#E5E7EB",
//                       }}
//                     >
//                       <img
//                         src={profile.profileImage || item.profileImage || profileImg}
//                         alt=""
//                         style={{
//                           width: "100%",
//                           height: "100%",
//                           objectFit: "cover",
//                         }}
//                       />
//                     </div>
//                   </div>

//                   {/* BODY */}
//                   <div style={{ padding: "40px 20px 20px" }}>
//                     <h3
//                       style={{
//                         fontSize: 18,
//                         fontWeight: 700,
//                         margin: "0 0 4px 0",
//                         color: "#111827",
//                       }}
//                     >
//                       {item.freelancerName}
//                     </h3>
//                     <p
//                       style={{
//                         fontSize: 14,
//                         color: "#6B7280",
//                         margin: "0 0 8px 0",
//                       }}
//                     >
//                       {profile.role || profile.title || service.category || "Freelancer"}
//                     </p>
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 4,
//                         color: "#9CA3AF",
//                         fontSize: 13,
//                         marginBottom: 16,
//                       }}
//                     >
//                       <IoLocationOutline size={16} />
//                       {profile.location || profile.city || "Location not specified"}
//                     </div>

//                     {/* PROJECT TITLE */}
//                     <div
//                       style={{
//                         background: "#F9FAFB",
//                         padding: 12,
//                         borderRadius: 12,
//                         marginBottom: 12,
//                       }}
//                     >
//                       <p
//                         style={{
//                           fontSize: 12,
//                           color: "#6B7280",
//                           margin: "0 0 4px 0",
//                           textTransform: "uppercase",
//                           fontWeight: 600,
//                         }}
//                       >
//                         Project title
//                       </p>
//                       <p
//                         style={{
//                           fontSize: 14,
//                           fontWeight: 600,
//                           color: "#111827",
//                           margin: 0,
//                         }}
//                       >
//                         {service.title || item.title || "Service Request"}
//                       </p>
//                     </div>

//                     {/* SKILLS */}
//                     {skills.length > 0 && (
//                       <>
//                         <p
//                           style={{
//                             fontSize: 12,
//                             color: "#6B7280",
//                             margin: "0 0 8px 0",
//                             textTransform: "uppercase",
//                             fontWeight: 600,
//                           }}
//                         >
//                           Skills
//                         </p>
//                         <div
//                           style={{
//                             display: "flex",
//                             flexWrap: "wrap",
//                             gap: 6,
//                             marginBottom: 16,
//                           }}
//                         >
//                           {skills.slice(0, 3).map((s, i) => (
//                             <span
//                               key={i}
//                               style={{
//                                 background: "#EDE9FE",
//                                 color: "#7c3aed",
//                                 padding: "4px 10px",
//                                 borderRadius: 12,
//                                 fontSize: 12,
//                                 fontWeight: 600,
//                               }}
//                             >
//                               {s}
//                             </span>
//                           ))}
//                           {skills.length > 3 && (
//                             <span
//                               style={{
//                                 background: "#F3F4F6",
//                                 color: "#6B7280",
//                                 padding: "4px 10px",
//                                 borderRadius: 12,
//                                 fontSize: 12,
//                                 fontWeight: 600,
//                               }}
//                             >
//                               +{skills.length - 3}
//                             </span>
//                           )}
//                         </div>
//                       </>
//                     )}

//                     {/* ACTION BUTTON */}
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         if (activeTab === "requested") {
//                           deleteRequest(item.id);
//                         } else {
//                           navigate("/chat", {
//                             state: {
//                               currentUid: auth.currentUser.uid,
//                               otherUid: item.freelancerId,
//                               otherName: item.freelancerName,
//                               otherImage:
//                                 profile.profileImage || item.profileImage,
//                               initialMessage: getStartMessage(
//                                 service.title || item.title
//                               ),
//                             },
//                           });
//                         }
//                       }}
//                       style={{
//                         margin: 0,
//                         marginTop: 0,
//                         padding: "16px",
//                         borderRadius: 16,
//                         border: "none",
//                         cursor: "pointer",
//                         fontSize: 15,
//                         fontWeight: 600,
//                         color: "#fff",
//                         background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
//                         boxShadow: "0 10px 20px rgba(124,58,237,0.35)",
//                         width: "100%",
//                       }}
//                     >
//                       {activeTab === "requested"
//                         ? "Delete Request"
//                         : "Start Message"}
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* DETAIL MODAL */}
//       {selectedRequest && (
//         <div
//           onClick={() => setSelectedRequest(null)}
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,0.5)",
//             backdropFilter: "blur(4px)",
//             zIndex: 999,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: 20,
//           }}
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             style={{
//               width: "100%",
//               maxWidth: 520,
//               background: "#fff",
//               borderRadius: 24,
//               overflow: "hidden",
//               boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
//               maxHeight: "90vh",
//               overflowY: "auto",
//               position: "relative",
//             }}
//           >
//             {/* HEADER */}
//             <div
//               style={{
//                 height: 120,
//                 background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
//                 position: "relative",
//               }}
//             >
//               <button
//                 onClick={() => setSelectedRequest(null)}
//                 style={{
//                   position: "absolute",
//                   top: 14,
//                   right: 14,
//                   background: "rgba(255,255,255,0.25)",
//                   border: "none",
//                   color: "#fff",
//                   borderRadius: "50%",
//                   width: 32,
//                   height: 32,
//                   cursor: "pointer",
//                   fontSize: 16,
//                 }}
//               >
//                 ✕
//               </button>
//               <div
//                 style={{
//                   position: "absolute",
//                   bottom: 12,
//                   right: 20,
//                   background: "rgba(255,255,255,0.25)",
//                   backdropFilter: "blur(10px)",
//                   padding: "6px 12px",
//                   borderRadius: 20,
//                   fontSize: 12,
//                   color: "#fff",
//                   fontWeight: 600,
//                 }}
//               >
//                 {timeAgo(selectedRequest.timestamp)}
//               </div>
//             </div>

//             {/* BODY */}
//             <div style={{ padding: 24 }}>
//               <h2
//                 style={{
//                   fontSize: 22,
//                   fontWeight: 700,
//                   margin: "0 0 4px 0",
//                 }}
//               >
//                 {selectedRequest.freelancerName}
//               </h2>
//               <p style={{ color: "#6B7280", margin: "0 0 8px 0" }}>
//                 {selectedRequest.service?.category || "Freelancer"}
//               </p>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 4,
//                   color: "#9CA3AF",
//                   fontSize: 14,
//                   marginBottom: 24,
//                 }}
//               >
//                 <IoLocationOutline size={16} />
//                 Chennai, Tamilnadu
//               </div>

//               {/* SECTION */}
//               <div style={{ marginBottom: 20 }}>
//                 <p
//                   style={{
//                     fontSize: 12,
//                     color: "#6B7280",
//                     margin: "0 0 8px 0",
//                     textTransform: "uppercase",
//                     fontWeight: 600,
//                   }}
//                 >
//                   Project title
//                 </p>
//                 <p
//                   style={{
//                     fontSize: 16,
//                     fontWeight: 600,
//                     margin: 0,
//                   }}
//                 >
//                   {selectedRequest.service?.title || selectedRequest.title}
//                 </p>
//               </div>

//               {selectedRequest.service?.description && (
//                 <div style={{ marginBottom: 20 }}>
//                   <p
//                     style={{
//                       fontSize: 12,
//                       color: "#6B7280",
//                       margin: "0 0 8px 0",
//                       textTransform: "uppercase",
//                       fontWeight: 600,
//                     }}
//                   >
//                     Description
//                   </p>
//                   <p
//                     style={{
//                       fontSize: 14,
//                       color: "#374151",
//                       lineHeight: 1.6,
//                       margin: 0,
//                     }}
//                   >
//                     {selectedRequest.service.description}
//                   </p>
//                 </div>
//               )}

//               {/* BUDGET */}
//               <div style={{ marginBottom: 20 }}>
//                 <p
//                   style={{
//                     fontSize: 12,
//                     color: "#6B7280",
//                     margin: "0 0 8px 0",
//                     textTransform: "uppercase",
//                     fontWeight: 600,
//                   }}
//                 >
//                   Budget
//                 </p>
//                 <p
//                   style={{
//                     fontSize: 16,
//                     fontWeight: 600,
//                     color: "#10B981",
//                     margin: 0,
//                   }}
//                 >
//                   {formatBudget(
//                     selectedRequest.service?.budget_from,
//                     selectedRequest.service?.budget_to
//                   )}
//                 </p>
//               </div>

//               {/* SKILLS */}
//               {selectedRequest.service?.skills?.length > 0 && (
//                 <div style={{ marginBottom: 24 }}>
//                   <p
//                     style={{
//                       fontSize: 12,
//                       color: "#6B7280",
//                       margin: "0 0 8px 0",
//                       textTransform: "uppercase",
//                       fontWeight: 600,
//                     }}
//                   >
//                     Skills
//                   </p>
//                   <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//                     {selectedRequest.service.skills.map((s, i) => (
//                       <span
//                         key={i}
//                         style={{
//                           background: "#EDE9FE",
//                           color: "#7c3aed",
//                           padding: "6px 12px",
//                           borderRadius: 12,
//                           fontSize: 13,
//                           fontWeight: 600,
//                         }}
//                       >
//                         {s}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* ACTIONS */}
//               {activeTab === "requested" ? (
//                 <div style={{ display: "flex", gap: 12 }}>
//                   <button
//                     onClick={() => {
//                       deleteRequest(selectedRequest.id);
//                       setSelectedRequest(null);
//                     }}
//                     style={{
//                       flex: 1,
//                       padding: 14,
//                       borderRadius: 14,
//                       border: "none",
//                       background: "#fee2e2",
//                       color: "#b91c1c",
//                       fontWeight: 600,
//                       cursor: "pointer",
//                     }}
//                   >
//                     Delete Request
//                   </button>
//                   <button
//                     onClick={() => {
//                       hireFreelancer(selectedRequest);
//                       setSelectedRequest(null);
//                     }}
//                     style={{
//                       flex: 1,
//                       padding: 14,
//                       borderRadius: 14,
//                       border: "none",
//                       background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
//                       color: "#fff",
//                       fontWeight: 600,
//                       cursor: "pointer",
//                     }}
//                   >
//                     Hire Freelancer
//                   </button>
//                 </div>
//               ) : (
//                 <button
//                   onClick={() => {
//                     setSelectedRequest(null);
//                     navigate("/chat", {
//                       state: {
//                         currentUid: auth.currentUser.uid,
//                         otherUid: selectedRequest.freelancerId,
//                         otherName: selectedRequest.freelancerName,
//                         initialMessage: getStartMessage(
//                           selectedRequest.service?.title ||
//                           selectedRequest.title
//                         ),
//                       },
//                     });
//                   }}
//                   style={{
//                     width: "100%",
//                     padding: 14,
//                     borderRadius: 14,
//                     border: "none",
//                     background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
//                     color: "#fff",
//                     fontWeight: 600,
//                     cursor: "pointer",
//                   }}
//                 >
//                   Start Message
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }



import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  IoChatbubbleEllipsesOutline,
  IoNotificationsOutline,
  IoSearch,
  IoLocationOutline,
  IoTimeOutline,
  IoCashOutline,
  IoConstructOutline,
  IoBriefcaseOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import profileImg from "../../../assets/profile.png";
import backarrow from "../../../assets/backarrow.png";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../../firbase/Firebase";
import message from "../../../assets/message.png"
import notification from "../../../assets/notification.png"

export default function HireFreelancer() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("requested");
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [freelancerProfiles, setFreelancerProfiles] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ================= HELPERS ================= */
  const getStartMessage = (title) =>
    `Hi 👋 I've reviewed your application for "${title}". Let's discuss the next steps.`;

  const markAsRead = async (id) => {
    await updateDoc(doc(db, "notifications", id), { read: true });
  };

  const deleteRequest = async (id) => {
    if (!window.confirm("Delete this request?")) return;
    await deleteDoc(doc(db, "notifications", id));
  };

  const hireFreelancer = async (item) => {
    if (!window.confirm(`Hire ${item.freelancerName}?`)) return;
    await updateDoc(doc(db, "notifications", item.id), { read: true });
  };

  const timeAgo = (input) => {
    if (!input) return "N/A";
    const d = input instanceof Timestamp ? input.toDate() : new Date(input);
    const diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return `${Math.floor(diff / 604800)} weeks ago`;
  };

  const formatBudget = (from, to) => {
    if (!from && !to) return "Not specified";
    if (from && to)
      return `₹${from.toLocaleString()} - ₹${to.toLocaleString()}`;
    return `₹${(from || to).toLocaleString()}`;
  };

  /* ================= FETCH FREELANCER PROFILE ================= */
  const fetchFreelancerProfile = async (freelancerId) => {
    if (!freelancerId || freelancerProfiles[freelancerId]) return;
    try {
      let profileDoc = await getDoc(doc(db, "users", freelancerId));
      if (!profileDoc.exists()) {
        profileDoc = await getDoc(doc(db, "freelancers", freelancerId));
      }
      if (profileDoc.exists()) {
        setFreelancerProfiles((prev) => ({
          ...prev,
          [freelancerId]: profileDoc.data(),
        }));
      }
    } catch (err) {
      console.error("Error fetching freelancer profile:", err);
    }
  };

  /* ================= FIRESTORE ================= */
  useEffect(() => {
    if (!auth.currentUser?.uid) return;
    const q = query(
      collection(db, "notifications"),
      where("clientUid", "==", auth.currentUser.uid),
      where("type", "==", "application"),
      orderBy("timestamp", "desc")
    );
    return onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setRequests(data);
      data.forEach((item) => {
        if (item.freelancerId) {
          fetchFreelancerProfile(item.freelancerId);
        }
      });
    });
  }, [auth.currentUser?.uid]);

  const requestedList = requests.filter((r) => r.read === false);
  const hiredList = requests.filter((r) => r.read === true);
  const listToShow = activeTab === "requested" ? requestedList : hiredList;
  const finalList = listToShow.filter(
    (i) =>
      i.freelancerName?.toLowerCase().includes(search.toLowerCase()) ||
      i.service?.title?.toLowerCase().includes(search.toLowerCase()) ||
      i.service?.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* HEADER */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "#fff",
          borderBottom: "1px solid #E0E0E0",
          padding: "16px 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: 1200,
            margin: "0 auto",
           
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              onClick={() => navigate(-1)}
              style={{
                width: 36,
                height: 36,
                 backgroundColor:"red",
                borderRadius: 14,
                border: "0.8px solid #E0E0E0",
                backgroundColor: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
                flexShrink: 0,
              }}
            >
              <img
                src={backarrow}
                alt="back"
                style={{ width: 16, height: 16 }}
              />
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
              Hire Freelancer
            </h1>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
              <img onClick={() => navigate("/client-dashbroad2/messages")} style={{ width: "26px",cursor: "pointer" }} src={message} alt="message" />
              <img onClick={() => navigate("")} style={{ width: "26px",cursor: "pointer" }} src={notification} alt="notification" />
            
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div style={{ padding: "20px", maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            position: "relative",
            marginBottom: 24,
          }}
        >
          <IoSearch
            size={20}
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9CA3AF",
            }}
          />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px 14px 48px",
              borderRadius: 16,
              border: "1px solid #E5E7EB",
              fontSize: 15,
              outline: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          />
        </div>

        {/* TABS */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {/* REQUESTED */}
          <button
            onClick={() => setActiveTab("requested")}
            style={{
              width: 240,
              height: 50,
              border: "none",
              borderRadius: 11,
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background:
                activeTab === "requested"
                  ? "linear-gradient(135deg,#8b5cf6,#6366f1)"
                  : "transparent",
              color: activeTab === "requested" ? "#fff" : "#111827",
              boxShadow:
                activeTab === "requested"
                  ? ""
                  : "0 2px 8px rgba(0,0,0,0.04)",
              transition: "all 0.25s ease",
            }}
          >
            Requested

          </button>

          {/* HIRED */}
          <button
            onClick={() => setActiveTab("hired")}
            style={{
              width: 240,
              height: 50,
              border: "none",
              borderRadius: 11,
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background:
                activeTab === "hired"
                  ? "linear-gradient(135deg,#8b5cf6,#6366f1)"
                  : "transparent",
              color: activeTab === "hired" ? "#fff" : "#111827",
              boxShadow:
                activeTab === "hired"
                  ? "0 8px 20px rgba(139,92,246,0.35)"
                  : "0 2px 8px rgba(0,0,0,0.04)",
              transition: "all 0.25s ease",
            }}
          >
            Hired

          </button>
        </div>

        {/* FILTER */}
        <div
          style={{
            background: "white",
            border: "1px solid #E5E7EB",
            height: 55,
            padding: "0 20px",
            borderRadius: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
            boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
          }}
        >
          {/* LEFT FILTER BUTTONS */}
          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "center",
            }}
          >
            <button
              style={{
                padding: "7px 38px",
                borderRadius: 999,
                border: "none",
                background: "#7c3aed",
                color: "#fff",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Work
            </button>

            <button
              style={{
                padding: "7px 36px",
                borderRadius: 999,
                border: "1px solid #E5E7EB",
                background: "#fff",
                color: "#374151",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              24 hours
            </button>
          </div>
        </div>

        {/* CARDS */}
{finalList.length === 0 ? (
  <div
    style={{
      textAlign: "center",
      padding: isMobile ? 40 : 60,
      color: "#9CA3AF",
      fontSize: 16,
    }}
  >
    <IoBriefcaseOutline
      size={isMobile ? 44 : 60}
      style={{ marginBottom: 16, opacity: 0.5 }}
    />
    <p>
      No {activeTab === "requested" ? "requests" : "hired freelancers"} found
    </p>
  </div>
) : (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
      gap: isMobile ? 20 : 40,
      maxWidth: 1200,
      margin: "0 auto",
      padding: isMobile ? "0 12px 0  10px" : "0",
  
     
    }}
  >
    {finalList.map((item) => {
      const service = item.service || {};
      const profile = freelancerProfiles[item.freelancerId] || {};
      const skills = Array.isArray(service.skills) ? service.skills : [];

      return (
        <div
          key={item.id}
          onClick={() => setSelectedRequest(item)}
          style={{
            background: "#fff",
            borderRadius: isMobile ? 18 : 24,
            overflow: "hidden",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            cursor: "pointer",
            transition: "all 0.25s ease",
            width: "100%",
            marginBottom:"30px"
          }}
          onMouseEnter={(e) => {
            if (!isMobile) {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0 18px 35px rgba(124,58,237,0.2)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 10px 25px rgba(0,0,0,0.08)";
          }}
        >
          {/* TOP GRADIENT */}
          <div
            style={{
              height: isMobile ? 70 : 96,
              background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
              position: "relative",
              height:'130px'
            }}
          >
            {/* TIME */}
            <div
              style={{
                position: "absolute",
                top: 10,
                right: 12,
                background: "rgba(255,255,255,0.25)",
                backdropFilter: "blur(10px)",
                padding: "5px 12px",
                borderRadius: 20,
                fontSize: 11,
                color: "#fff",
                fontWeight: 600,
              }}
            >
              {timeAgo(item.timestamp)}
            </div>

            {/* PROFILE IMAGE */}
            <div
              style={{
                position: "absolute",
                bottom: isMobile ? -28 : -38,
                left: "50%",
                transform: "translateX(-50%)",
                width: isMobile ? 58 : 76,
                height: isMobile ? 58 : 76,
                borderRadius: "50%",
                border: isMobile ? "3px solid #fff" : "4px solid #fff",
                overflow: "hidden",
                background: "#E5E7EB",
              }}
            >
              <img
                src={
                  profile.profileImage || item.profileImage || profileImg
                }
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>

          {/* BODY */}
          <div
            style={{
              padding: isMobile
                ? "36px 16px 16px"
                : "56px 22px 22px",
              textAlign: "center",
              marginBottom:"10px"
            }}
          >
            <h3
              style={{
                fontSize: isMobile ? 18 : 23,
                margin: "0 0 4px",
                color: "#101828",
                fontWeight: 400,
              }}
            >
              {item.freelancerName}
            </h3>

            <div
              style={{
                color: "#7c3aed",
                fontWeight: 600,
                fontSize: isMobile ? 12 : 14,
              }}
            >
              {profile.role || service.category || "Freelancer"}
            </div>

            <div
              style={{
                fontSize: 12,
                color: "#6B7280",
                marginTop: 4,
                marginBottom: 12,
              }}
            >
              {profile.location || profile.city || "Location not specified"}
            </div>

            {/* PROJECT */}
            <div style={{ textAlign: "left", marginBottom: 12 }}>
              <div style={{ fontSize: 14, color: "#6B7280" }}>
                Project title
              </div>
              <div
                style={{
                  color: "#7c3aed",
                  marginTop: 6,
                  fontSize: isMobile ? 16 : 22,
                  fontWeight: 400,
                  textAlign:"center"
                }}
              >
                {service.title || item.title || "Service Request"}
              </div>
            </div>

            {/* SKILLS */}
            {skills.length > 0 && (
              <div style={{ textAlign: "left", marginBottom: 16 }}>
                <div style={{ fontSize: 14, color: "#6B7280" }}>
                  Skills
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    marginTop: 8,
                  }}
                >
                  {skills
                    .slice(0, isMobile ? 2 : 3)
                    .map((s, i) => (
                      <span
                        key={i}
                        style={{
                          background: "#FAF5FF",
                          color: "#7c3aed",
                          padding: isMobile
                            ? "6px 14px"
                            : "8px 20px",
                          borderRadius: 999,
                          fontSize: 12,
                          border: "1.5px solid #E9D5FF",
                          marginTop:'11px'
                        }}
                      >
                        {s}
                      </span>
                    ))}

                  {skills.length > (isMobile ? 2 : 3) && (
                    <span
                      style={{
                        background: "#FAF5FF",
                        color: "#7c3aed",
                        borderRadius: 21,
                        paddingLeft:"7px",
                        paddingTop:"9px",
                        marginTop:"10px",
                        width:'33px',
                        height:"34px",
                        fontSize: 12,
                        border: "1.5px solid #E9D5FF",
                      }}
                    >
                      +{skills.length - (isMobile ? 2 : 3)}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* ACTION BUTTON */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (activeTab === "requested") {
                  deleteRequest(item.id);
                } else {
                  navigate("/chat", {
                    state: {
                      currentUid: auth.currentUser.uid,
                      otherUid: item.freelancerId,
                      otherName: item.freelancerName,
                      otherImage:
                        profile.profileImage || item.profileImage,
                      initialMessage: getStartMessage(
                        service.title || item.title
                      ),
                    },
                  });
                }
              }}
              style={{
                width: "100%",
                padding: isMobile ? 12 : 16,
                borderRadius: isMobile ? 14 : 18,
                border: "none",
                fontSize: isMobile ? 14 : 15,
                fontWeight: 600,
                color: "#fff",
                cursor: "pointer",
                marginTop:"10px",
                background:
                  "linear-gradient(135deg,#7c3aed,#4f46e5)",
              }}
            >
              {activeTab === "requested"
                ? "Delete Request"
                : "Start Message"}
            </button>
          </div>
        </div>
      );
    })}
  </div>
)}

      </div>

      {/* DETAIL MODAL */}
      {selectedRequest && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: 20,
          }}
          onClick={() => setSelectedRequest(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 24,
              maxWidth: 600,
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            {/* MODAL HEADER */}
            <div
              style={{
                background: "linear-gradient(135deg,#8b5cf6,#a855f7)",
                padding: 24,
                color: "#fff",
                position: "relative",
              }}
            >
              <button
                onClick={() => setSelectedRequest(null)}
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  color: "#fff",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: 18,
                }}
              >
                ✕
              </button>

              <div style={{ textAlign: "center" }}>
                <img
                  src={
                    freelancerProfiles[selectedRequest.freelancerId]?.profileImage ||
                    selectedRequest.profileImage ||
                    profileImg
                  }
                  alt=""
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: "50%",
                    border: "4px solid #fff",
                    objectFit: "cover",
                    marginBottom: 16,
                  }}
                />
                <h2 style={{ margin: 0, fontSize: 24 }}>
                  {selectedRequest.freelancerName}
                </h2>
                <p style={{ margin: "8px 0 0", fontSize: 14, opacity: 0.9 }}>
                  {selectedRequest.service?.category || "Freelancer"}
                </p>
              </div>
            </div>

            {/* MODAL BODY */}
            <div style={{ padding: 24 }}>
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    fontSize: 12,
                    color: "#6B7280",
                    fontWeight: 600,
                    marginBottom: 4,
                  }}
                >
                  Project Title
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#7c3aed" }}>
                  {selectedRequest.service?.title || selectedRequest.title || "Service Request"}
                </div>
              </div>

              {selectedRequest.service?.description && (
                <div style={{ marginBottom: 20 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#6B7280",
                      fontWeight: 600,
                      marginBottom: 4,
                    }}
                  >
                    Description
                  </div>
                  <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>
                    {selectedRequest.service.description}
                  </p>
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    fontSize: 12,
                    color: "#6B7280",
                    fontWeight: 600,
                    marginBottom: 4,
                  }}
                >
                  Budget
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#059669" }}>
                  {formatBudget(
                    selectedRequest.service?.budget_from,
                    selectedRequest.service?.budget_to
                  )}
                </div>
              </div>

              {selectedRequest.service?.skills?.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#6B7280",
                      fontWeight: 600,
                      marginBottom: 8,
                    }}
                  >
                    Skills
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {selectedRequest.service.skills.map((s, i) => (
                      <span
                        key={i}
                        style={{
                          background: "#EDE9FE",
                          color: "#7c3aed",
                          padding: "6px 14px",
                          borderRadius: 14,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTIONS */}
              <div style={{ display: "flex", gap: 12 }}>
                {activeTab === "requested" ? (
                  <>
                    <button
                      onClick={() => {
                        deleteRequest(selectedRequest.id);
                        setSelectedRequest(null);
                      }}
                      style={{
                        flex: 1,
                        padding: 14,
                        borderRadius: 14,
                        border: "none",
                        background: "#FEE2E2",
                        color: "#DC2626",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: 14,
                      }}
                    >
                      Delete Request
                    </button>
                    <button
                      onClick={() => {
                        hireFreelancer(selectedRequest);
                        setSelectedRequest(null);
                      }}
                      style={{
                        flex: 1,
                        padding: 14,
                        borderRadius: 14,
                        border: "none",
                        background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                        color: "#fff",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: 14,
                      }}
                    >
                      Hire Freelancer
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedRequest(null);
                      navigate("/chat", {
                        state: {
                          currentUid: auth.currentUser.uid,
                          otherUid: selectedRequest.freelancerId,
                          otherName: selectedRequest.freelancerName,
                          otherImage:
                            freelancerProfiles[selectedRequest.freelancerId]
                              ?.profileImage || selectedRequest.profileImage,
                          initialMessage: getStartMessage(
                            selectedRequest.service?.title || selectedRequest.title
                          ),
                        },
                      });
                    }}
                    style={{
                      width: "100%",
                      padding: 16,
                      borderRadius: 14,
                      border: "none",
                      background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                      color: "#fff",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: 15,
                    }}
                  >
                    Start Message
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}