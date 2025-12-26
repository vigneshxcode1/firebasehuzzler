// // frontend/src/pages/SavedJobsScreen.jsx
// // NOTE: Firebase config must be in another file (e.g. firbase/Firebase.js)
// // This file only imports { db } from there.

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   getDoc,
//   getDocs,
//   updateDoc,
//   arrayUnion,
//   arrayRemove,
//   increment,
// } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { db } from "../firbase/Firebase"; // 🔁 keep your existing path

// // -------------------- UTIL FUNCTIONS -------------------- //

// function timeAgo(date) {
//   const diff = Date.now() - date.getTime();
//   const minutes = Math.floor(diff / (1000 * 60));
//   if (minutes < 1) return "just now";
//   if (minutes < 60) return `${minutes} min ago`;
//   const hours = Math.floor(minutes / 60);
//   if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
//   const days = Math.floor(hours / 24);
//   return `${days} day${days > 1 ? "s" : ""} ago`;
// }

// function formatAmount(amount) {
//   const num = Number(amount) || 0;
//   if (num < 1000) return num.toFixed(0);
//   if (num < 1_000_000) {
//     const v = num / 1000;
//     return `${v.toFixed(v === Math.trunc(v) ? 0 : 1)}K`;
//   }
//   const v = num / 1_000_000;
//   return `${v.toFixed(v === Math.trunc(v) ? 0 : 1)}M`;
// }

// // -------------------- MAIN COMPONENT -------------------- //

// export default function SavedJobsScreen() {
//   const navigate = useNavigate();
//   const auth = getAuth();

//   const [savedJobIds, setSavedJobIds] = useState([]);
//   const [savedJobs, setSavedJobs] = useState([]);
//   const [loadingSaved, setLoadingSaved] = useState(true);

//   // Notification dialog (optional, same style as your other screen)
//   const [notifications, setNotifications] = useState([]);
//   const [showNotificationDialog, setShowNotificationDialog] = useState(false);

//   const user = auth.currentUser;

//   // -------------------- LISTEN TO USER SAVED JOBS -------------------- //

//   useEffect(() => {
//     if (!user) {
//       setLoadingSaved(false);
//       return;
//     }

//     const userRef = doc(db, "users", user.uid);
//     const unsub = onSnapshot(
//       userRef,
//       (snap) => {
//         const data = snap.data() || {};
//         const ids = data.savedJobs || [];
//         setSavedJobIds(ids);
//       },
//       (err) => {
//         console.error("user snapshot error", err);
//       }
//     );

//     return unsub;
//   }, [db, user]);

//   // -------------------- LOAD SAVED JOB DOCUMENTS -------------------- //

//   useEffect(() => {
//     if (!user) return;

//     async function loadSaved() {
//       try {
//         setLoadingSaved(true);

//         if (!savedJobIds.length) {
//           setSavedJobs([]);
//           return;
//         }

//         const [servicesSnap, service24Snap] = await Promise.all([
//           getDocs(collection(db, "services")),
//           getDocs(collection(db, "service_24h")),
//         ]);

//         const all = [];

//         servicesSnap.forEach((docSnap) => {
//           if (savedJobIds.includes(docSnap.id)) {
//             all.push({
//               id: docSnap.id,
//               type: "services",
//               ...docSnap.data(),
//             });
//           }
//         });

//         service24Snap.forEach((docSnap) => {
//           if (savedJobIds.includes(docSnap.id)) {
//             all.push({
//               id: docSnap.id,
//               type: "service_24h",
//               ...docSnap.data(),
//             });
//           }
//         });

//         // 🔥 Sort by createdAt (recent first)
//         all.sort((a, b) => {
//           const getDate = (job) => {
//             const ts = job.createdAt;
//             if (ts && typeof ts.toDate === "function") {
//               return ts.toDate();
//             }
//             if (ts instanceof Date) return ts;
//             return new Date(0); // fallback old
//           };
//           return getDate(b) - getDate(a);
//         });

//         setSavedJobs(all);
//       } catch (err) {
//         console.error("loadSavedJobs error", err);
//       } finally {
//         setLoadingSaved(false);
//       }
//     }

//     loadSaved();
//   }, [db, user, savedJobIds]);

//   // -------------------- HANDLERS -------------------- //

//   const toggleSavedJob = async (jobId) => {
//     const currentUser = auth.currentUser;
//     if (!currentUser) return;

//     const userRef = doc(db, "users", currentUser.uid);
//     const isSaved = savedJobIds.includes(jobId);

//     try {
//       if (isSaved) {
//         await updateDoc(userRef, {
//           savedJobs: arrayRemove(jobId),
//         });
//       } else {
//         await updateDoc(userRef, {
//           savedJobs: arrayUnion(jobId),
//         });
//       }
//     } catch (err) {
//       console.error("toggleSavedJob error", err);
//     }
//   };

//   const incrementImpressionsAndNavigate = async (job) => {
//     try {
//       const currentUser = auth.currentUser;
//       if (!currentUser) return;

//       const collectionName = job.type === "service_24h" ? "service_24h" : "services";
//       const ref = doc(db, collectionName, job.id);
//       const snap = await getDoc(ref);

//       if (snap.exists()) {
//         const data = snap.data();
//         const viewedBy = data.viewedBy || [];

//         if (!viewedBy.includes(currentUser.uid)) {
//           await updateDoc(ref, {
//             viewedBy: arrayUnion(currentUser.uid),
//             [collectionName === "service_24h" ? "views" : "impressions"]:
//               increment(1),
//           });
//         }
//       }

//       if (collectionName === "service_24h") {
//         navigate(`/client-dashbroad2/service-24h/${job.id}`);
//       } else {
//         navigate(`/client-dashbroad2/service/${job.id}`);
//       }
//     } catch (err) {
//       console.error("incrementImpressionsAndNavigate error", err);
//     }
//   };

//   // -------------------- RENDER -------------------- //

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-700">
//         Please login to view saved jobs.
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
//       {/* HEADER */}
//       <div className="relative">
//         <div className="w-full bg-[#FDFD96] rounded-b-[30px] h-32 flex items-center justify-center px-4">
//           <div className="flex items-center justify-between w-full max-w-3xl">
//             <button
//               onClick={() => navigate(-1)}
//               className="text-gray-800 p-2 rounded-full hover:bg-yellow-200"
//             >
//               ←
//             </button>

//             <h1 className="text-xl sm:text-2xl font-medium text-black">
//               Saved jobs
//             </h1>

//             {/* Notification icon */}
//             <NotificationIcon
//               count={notifications.length}
//               onClick={() => setShowNotificationDialog(true)}
//             />
//           </div>
//         </div>
//       </div>

//       {/* LIST CONTENT */}
//       <div className="flex-1 overflow-y-auto">
//         <SavedTab
//           jobs={savedJobs}
//           loading={loadingSaved}
//           savedJobIds={savedJobIds}
//           onToggleSaved={toggleSavedJob}
//           onOpenJob={(job) => incrementImpressionsAndNavigate(job)}
//         />
//       </div>

//       {/* NOTIFICATION DIALOG */}
//       {showNotificationDialog && (
//         <NotificationDialog
//           notifications={notifications}
//           onClose={() => setShowNotificationDialog(false)}
//           onClearAll={() => setNotifications([])}
//         />
//       )}
//     </div>
//   );
// }

// // -------------------- SAVED TAB -------------------- //

// function SavedTab({ jobs, loading, savedJobIds, onToggleSaved, onOpenJob }) {
//   if (loading) {
//     return (
//       <div className="h-full flex items-center justify-center">
//         <div className="h-6 w-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   if (!jobs.length) {
//     return (
//       <div className="h-full flex items-center justify-center text-gray-500">
//         No saved jobs yet
//       </div>
//     );
//   }

//   return (
//     <div className="px-4 py-3 space-y-3">
//       {jobs.map((job) =>
//         job.type === "services" ? (
//           <JobCardWorks
//             key={job.id}
//             job={job}
//             isSaved={savedJobIds.includes(job.id)}
//             onToggleSaved={() => onToggleSaved(job.id)}
//             onOpen={() => onOpenJob(job)}
//           />
//         ) : (
//           <JobCard24h
//             key={job.id}
//             job={job}
//             isSaved={savedJobIds.includes(job.id)}
//             onToggleSaved={() => onToggleSaved(job.id)}
//             onOpen={() => onOpenJob(job)}
//           />
//         )
//       )}
//     </div>
//   );
// }

// // -------------------- WORKS CARD -------------------- //

// function JobCardWorks({ job, isSaved, onToggleSaved, onOpen }) {
//   const {
//     title = "",
//     description = "",
//     deliveryDuration = "",
//     price,
//     budget_from,
//     budget_to,
//     impressions = 0,
//     createdAt,
//     skills = [],
//     tools = [],
//   } = job;

//   const priceText =
//     price != null
//       ? `₹${price}`
//       : budget_from != null && budget_to != null
//       ? `₹${budget_from} - ₹${budget_to}`
//       : "₹0";

//   const createdDate =
//     createdAt && typeof createdAt.toDate === "function"
//       ? createdAt.toDate()
//       : null;
//   const timeText = createdDate ? timeAgo(createdDate) : "";

//   const merged = [...skills, ...tools];
//   const shown = merged.slice(0, 2);
//   const remaining = merged.length - shown.length;

//   return (
//     <div
//       onClick={onOpen}
//       className="bg-white rounded-2xl border border-gray-300 shadow-sm p-4 cursor-pointer hover:shadow-md transition"
//     >
//       {/* Header Row */}
//       <div className="flex items-start gap-3">
//         <div className="flex-1">
//           <h3 className="text-sm sm:text-base font-semibold text-black truncate">
//             {title}
//           </h3>
//           <div className="mt-3 flex items-center gap-3 text-xs text-gray-700">
//             <span className="flex items-center gap-1">
//               <span className="material-icons text-[16px]">
//                 remove_red_eye
//               </span>
//               {impressions} views
//             </span>
//             {timeText && <span>{timeText}</span>}
//           </div>
//         </div>

//         {/* Price + duration badge */}
//         <div className="flex flex-col items-end gap-2">
//           <div className="relative">
//             <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-white px-3 py-1 text-xs font-bold rounded-md shadow-sm">
//               {priceText}
//             </div>
//             <div className="mt-6 bg-yellow-400 rounded-b-md px-4 py-1 text-xs font-bold text-black text-center min-w-[90px]">
//               {deliveryDuration || "N/A"}
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={(e) => {
//               e.stopPropagation();
//               onToggleSaved();
//             }}
//           >
//             <span
//               className={`material-icons text-[24px] ${
//                 isSaved ? "text-indigo-400" : "text-gray-400"
//               }`}
//             >
//               {isSaved ? "bookmark_add" : "bookmark_add_outlined"}
//             </span>
//           </button>
//         </div>
//       </div>

//       {/* Description */}
//       <p className="mt-3 text-xs sm:text-sm text-gray-800 line-clamp-4">
//         {description}
//       </p>

//       {/* Skills/Tools chips */}
//       <div className="mt-3 flex flex-wrap gap-2">
//         {shown.map((item) => (
//           <span
//             key={item}
//             className="px-3 py-1 rounded-full bg-gray-200 text-xs font-medium text-gray-800"
//           >
//             {item}
//           </span>
//         ))}
//         {remaining > 0 && (
//           <span className="px-3 py-1 rounded-full bg-gray-400 text-xs font-semibold text-white">
//             +{remaining}
//           </span>
//         )}
//       </div>
//     </div>
//   );
// }

// // -------------------- 24H CARD -------------------- //

// function JobCard24h({ job, isSaved, onToggleSaved, onOpen }) {
//   const {
//     title = "Untitled",
//     description = "",
//     timeline = "24 Hours",
//     budget,
//     createdAt,
//     views = 0,
//     skills = [],
//     tools = [],
//   } = job;

//   const budgetText = `₹${formatAmount(budget ?? 0)}`;
//   const createdDate =
//     createdAt && typeof createdAt.toDate === "function"
//       ? createdAt.toDate()
//       : null;
//   const timeText = createdDate ? timeAgo(createdDate) : "Just now";

//   const merged = [...skills, ...tools];
//   const shown = merged.slice(0, 2);
//   const remaining = merged.length - shown.length;

//   return (
//     <div
//       onClick={onOpen}
//       className="bg-white rounded-2xl border border-gray-300 shadow-sm p-4 cursor-pointer hover:shadow-md transition"
//     >
//       {/* Header Row */}
//       <div className="flex items-start gap-3">
//         <div className="flex-1">
//           <h3 className="text-sm sm:text-base font-semibold text-black truncate">
//             {title}
//           </h3>
//           <div className="mt-3 flex items-center gap-3 text-xs text-gray-700">
//             <span className="flex items-center gap-1">
//               <span className="material-icons text-[16px]">
//                 remove_red_eye
//               </span>
//               {views} views
//             </span>
//             {timeText && <span>{timeText}</span>}
//           </div>
//         </div>

//         {/* Budget + 24h badge + save */}
//         <div className="flex flex-col items-end gap-2">
//           <div className="relative">
//             <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-white px-3 py-1 text-xs font-bold rounded-md shadow-sm">
//               {budgetText}
//             </div>
//             <div className="mt-6 bg-orange-400 rounded-b-md px-4 py-1 text-xs font-bold text-black text-center min-w-[90px]">
//               {timeline || "24 Hours"}
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={(e) => {
//               e.stopPropagation();
//               onToggleSaved();
//             }}
//           >
//             <span
//               className={`material-icons text-[24px] ${
//                 isSaved ? "text-indigo-400" : "text-gray-400"
//               }`}
//             >
//               {isSaved ? "bookmark_add" : "bookmark_add_outlined"}
//             </span>
//           </button>
//         </div>
//       </div>

//       {/* Description */}
//       <p className="mt-3 text-xs sm:text-sm text-gray-800 line-clamp-4">
//         {description}
//       </p>

//       {/* Skills/Tools chips */}
//       <div className="mt-3 flex flex-wrap gap-2">
//         {shown.map((item) => (
//           <span
//             key={item}
//             className="px-3 py-1 rounded-full bg-gray-200 text-xs font-medium text-gray-800"
//           >
//             {item}
//           </span>
//         ))}
//         {remaining > 0 && (
//           <span className="px-3 py-1 rounded-full bg-gray-400 text-xs font-semibold text-white">
//             +{remaining}
//           </span>
//         )}
//       </div>
//     </div>
//   );
// }

// // -------------------- NOTIFICATIONS -------------------- //

// function NotificationIcon({ count, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className="relative p-2 rounded-xl hover:bg-yellow-200 transition"
//     >
//       <span className="material-icons text-gray-800 text-[24px]">
//         notifications_none
//       </span>
//       {count > 0 && (
//         <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full px-1.5 py-0.5">
//           {count > 9 ? "9+" : count}
//         </span>
//       )}
//     </button>
//   );
// }

// function NotificationDialog({ notifications, onClose, onClearAll }) {
//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50">
//       <div className="mt-16 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
//         {/* Header */}
//         <div className="bg-[#FDFD96] px-4 py-3 flex items-center gap-3">
//           <div className="p-2 bg-white/30 rounded-xl">
//             <span className="material-icons text-gray-900 text-[20px]">
//               notifications_active
//             </span>
//           </div>
//           <div className="flex-1">
//             <p className="text-sm font-semibold text-gray-900">
//               Notifications
//             </p>
//             <p className="text-xs text-gray-700">
//               {notifications.length}{" "}
//               {notifications.length === 1 ? "notification" : "notifications"}
//             </p>
//           </div>
//           {notifications.length > 0 && (
//             <button
//               className="text-xs font-semibold bg.white/40 px-2 py-1 rounded-lg mr-1"
//               onClick={onClearAll}
//             >
//               Clear All
//             </button>
//           )}
//           <button
//             className="p-2 bg-white/40 rounded-xl"
//             onClick={onClose}
//           >
//             <span className="material-icons text-gray-900 text-[18px]">
//               close
//             </span>
//           </button>
//         </div>

//         {/* Body */}
//         <div className="max-h-80 overflow-y-auto py-3">
//           {notifications.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500 text-sm">
//               <div className="p-4 rounded-full bg-gray-100 mb-3">
//                 <span className="material-icons text-[32px] text-gray-400">
//                   notifications_off
//                 </span>
//               </div>
//               <p className="font-semibold text-gray-700 mb-1">
//                 No notifications yet
//               </p>
//               <p className="text-xs leading-relaxed text-gray-500">
//                 You're all caught up! New notifications will appear here when
//                 available.
//               </p>
//             </div>
//           ) : (
//             notifications.map((n, idx) => (
//               <div
//                 key={idx}
//                 className="mx-4 mb-2 p-3 rounded-xl border border-gray-200 bg-gray-50 flex items-start gap-3"
//               >
//                 <div className="p-2 rounded-xl bg-[#FDFD96]">
//                   <span className="material-icons text-gray-900 text-[20px]">
//                     notifications
//                   </span>
//                 </div>
//                 <div className="flex-1">
//                   {n.title && (
//                     <p className="text-sm font-semibold text-gray-900">
//                       {n.title}
//                     </p>
//                   )}
//                   {n.body && (
//                     <p className="mt-1 text-xs text-gray-700">{n.body}</p>
//                   )}
//                   <p className="mt-1 text-[10px] text-gray-500">Just now</p>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }













































































// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   getDoc,
//   getDocs,
//   updateDoc,
//   arrayUnion,
//   arrayRemove,
//   increment,
// } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { db } from "../firbase/Firebase"; // 🔁 keep your existing path

// // 🔹 UI imports from UIFreelanceSaved.jsx
// import backarrow from "../assets/backarrow.png";
// import message from "../assets/message.png";
// import notification from "../assets/notification.png";
// import profile from "../assets/profile.png";
// import save from "../assets/save.png";
// import saved from "../assets/saved.png";
// import search from "../assets/search.png";
// import { MdAccessTime } from "react-icons/md";
// import { FaEye } from "react-icons/fa";
// import { FiPlus } from "react-icons/fi";

// // -------------------- UTIL FUNCTIONS -------------------- //

// function timeAgo(date) {
//   if (!date) return "";
//   const diff = Date.now() - date.getTime();
//   const minutes = Math.floor(diff / (1000 * 60));
//   if (minutes < 1) return "just now";
//   if (minutes < 60) return `${minutes} min ago`;
//   const hours = Math.floor(minutes / 60);
//   if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
//   const days = Math.floor(hours / 24);
//   return `${days} day${days > 1 ? "s" : ""} ago`;
// }

// function formatAmount(amount) {
//   const num = Number(amount) || 0;
//   if (num < 1000) return num.toFixed(0);
//   if (num < 1_000_000) {
//     const v = num / 1000;
//     return `${v.toFixed(v === Math.trunc(v) ? 0 : 1)}K`;
//   }
//   const v = num / 1_000_000;
//   return `${v.toFixed(v === Math.trunc(v) ? 0 : 1)}M`;
// }

// // -------------------- INLINE STYLES (from UIFreelanceSaved) -------------------- //

// const styles = {
//   root: {
//     backgroundColor: "#FFFFFF",
//     minHeight: "100vh",
//     fontFamily: "'Rubik', sans-serif",
//     padding: "16px",
//     paddingBottom: "96px", // space for FAB
//   },
//   topRow: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 12,
//     width: "100%",
//   },
//   leftRow: {
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//   },
//   backbtn: {
//     width: 38,
//     height: 38,
//     borderRadius: 12,
//     border: "1px solid #ccc",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     cursor: "pointer",
//     backgroundColor: "#fff",
//   },
//   backbtnimg: {
//     height: 18,
//     width: 18,
//   },
//   heading: {
//     fontSize: 34,
//     fontWeight: 500,
//   },
//   rightIcons: {
//     display: "flex",
//     alignItems: "center",
//     gap: 14,
//   },
//   iconImg: {
//     width: 26,
//     height: 26,
//     cursor: "pointer",
//   },
//   searchBar: {
//     width: "95%",
//     height: 48,
//     borderRadius: 25,
//     backgroundColor: "#F3F3F3",
//     display: "flex",
//     alignItems: "center",
//     padding: "0 16px",
//     marginBottom: 20,
//     marginTop: 30,
//     gap: 12,
//   },
//   searchIcon: {
//     width: 20,
//     height: 20,
//     opacity: 0.65,
//   },
//   searchInput: {
//     border: "none",
//     outline: "none",
//     background: "transparent",
//     width: "100%",
//     fontSize: 15,
//     fontFamily: "'Rubik', sans-serif",
//   },
//   jobCard: {
//     width: "95%",
//     margin: "0 auto",
//     borderRadius: 18,
//     backgroundColor: "#fff",
//     border: "1px solid #ececec",
//     padding: 16,
//     marginBottom: 16,
//     boxShadow: "0 3px 6px rgba(0,0,0,0.07)",
//     cursor: "pointer",
//   },
//   cardTop: {
//     display: "flex",
//     alignItems: "flex-start",
//     justifyContent: "space-between",
//     width: "100%",
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 400,
//     marginBottom: 6,
//     lineHeight: "20px",
//   },
//   meta: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     color: "#777",
//     fontSize: 12,
//     marginTop: 10,
//   },
//   time: {
//     marginLeft: 20,
//   },
//   budgetTop: {
//     fontWeight: 600,
//     fontSize: 15,
//   },
//   saveIcon: {
//     cursor: "pointer",
//     width: 20,
//     height: 20,
//     marginTop: 6,
//   },
//   skillsrequired: {
//     fontWeight: 400,
//     fontSize: 14,
//     opacity: "70%",
//     marginTop: 10,
//   },
//   desc: {
//     marginTop: 10,
//     fontSize: 13,
//     color: "#555",
//     lineHeight: "18px",
//   },
//   chipsRow: {
//     marginTop: 10,
//     display: "flex",
//     flexWrap: "wrap",
//     gap: 6,
//   },
//   chip: {
//     backgroundColor: "rgba(255, 240, 133, 0.7)",
//     padding: "4px 10px",
//     borderRadius: 12,
//     fontSize: 12,
//   },
//   emptyText: {
//     textAlign: "center",
//     marginTop: 40,
//     color: "#777",
//   },
//   loader: {
//     marginTop: 60,
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loaderCircle: {
//     height: 24,
//     width: 24,
//     borderRadius: "999px",
//     border: "2px solid #aaa",
//     borderTopColor: "transparent",
//     animation: "spin 0.8s linear infinite",
//   },
//   fab: {
//     position: "fixed",
//     right: 36,
//     bottom: 36,
//     width: 56,
//     height: 56,
//     borderRadius: 999,
//     background: "linear-gradient(180deg, #7c3aed, #6d28d9)",
//     color: "white",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     border: 0,
//     boxShadow: "0 10px 30px rgba(124,58,237,0.18)",
//     cursor: "pointer",
//     fontSize: 20,
//   },
// };

// // -------------------- MAIN COMPONENT -------------------- //

// export default function SavedJobsScreen() {
//   const navigate = useNavigate();
//   const auth = getAuth();

//   const [savedJobIds, setSavedJobIds] = useState([]);
//   const [savedJobs, setSavedJobs] = useState([]);
//   const [loadingSaved, setLoadingSaved] = useState(true);

//   // Notification dialog state (backend logic same)
//   const [notifications, setNotifications] = useState([]);
//   const [showNotificationDialog, setShowNotificationDialog] = useState(false);

//   const [searchQuery, setSearchQuery] = useState("");

//   const user = auth.currentUser;

//   // -------------------- LISTEN TO USER SAVED JOBS -------------------- //

//   useEffect(() => {
//     if (!user) {
//       setLoadingSaved(false);
//       return;
//     }

//     const userRef = doc(db, "users", user.uid);
//     const unsub = onSnapshot(
//       userRef,
//       (snap) => {
//         const data = snap.data() || {};
//         const ids = data.savedJobs || [];
//         setSavedJobIds(ids);
//       },
//       (err) => {
//         console.error("user snapshot error", err);
//       }
//     );

//     return unsub;
//   }, [user]);

//   // -------------------- LOAD SAVED JOB DOCUMENTS -------------------- //

//   useEffect(() => {
//     if (!user) return;

//     async function loadSaved() {
//       try {
//         setLoadingSaved(true);

//         if (!savedJobIds.length) {
//           setSavedJobs([]);
//           return;
//         }

//         const [servicesSnap, service24Snap] = await Promise.all([
//           getDocs(collection(db, "services")),
//           getDocs(collection(db, "service_24h")),
//         ]);

//         const all = [];

//         servicesSnap.forEach((docSnap) => {
//           if (savedJobIds.includes(docSnap.id)) {
//             all.push({
//               id: docSnap.id,
//               type: "services",
//               ...docSnap.data(),
//             });
//           }
//         });

//         service24Snap.forEach((docSnap) => {
//           if (savedJobIds.includes(docSnap.id)) {
//             all.push({
//               id: docSnap.id,
//               type: "service_24h",
//               ...docSnap.data(),
//             });
//           }
//         });

//         // 🔥 Sort by createdAt (recent first) – same as original
//         all.sort((a, b) => {
//           const getDate = (job) => {
//             const ts = job.createdAt;
//             if (ts && typeof ts.toDate === "function") {
//               return ts.toDate();
//             }
//             if (ts instanceof Date) return ts;
//             return new Date(0); // fallback old
//           };
//           return getDate(b) - getDate(a);
//         });

//         setSavedJobs(all);
//       } catch (err) {
//         console.error("loadSavedJobs error", err);
//       } finally {
//         setLoadingSaved(false);
//       }
//     }

//     loadSaved();
//   }, [user, savedJobIds]);

//   // -------------------- HANDLERS -------------------- //

//   const toggleSavedJob = async (jobId) => {
//     const currentUser = auth.currentUser;
//     if (!currentUser) return;

//     const userRef = doc(db, "users", currentUser.uid);
//     const isSaved = savedJobIds.includes(jobId);

//     try {
//       if (isSaved) {
//         await updateDoc(userRef, {
//           savedJobs: arrayRemove(jobId),
//         });
//       } else {
//         await updateDoc(userRef, {
//           savedJobs: arrayUnion(jobId),
//         });
//       }
//     } catch (err) {
//       console.error("toggleSavedJob error", err);
//     }
//   };

//   const incrementImpressionsAndNavigate = async (job) => {
//     try
//     {
//       const currentUser = auth.currentUser;
//       if (!currentUser) return;

//       const collectionName = job.type === "service_24h" ? "service_24h" : "services";
//       const ref = doc(db, collectionName, job.id);
//       const snap = await getDoc(ref);

//       if (snap.exists()) {
//         const data = snap.data();
//         const viewedBy = data.viewedBy || [];

//         if (!viewedBy.includes(currentUser.uid)) {
//           await updateDoc(ref, {
//             viewedBy: arrayUnion(currentUser.uid),
//             [collectionName === "service_24h" ? "views" : "impressions"]:
//               increment(1),
//           });
//         }
//       }

//       if (collectionName === "service_24h") {
//         navigate(`/client-dashbroad2/service-24h/${job.id}`);
//       } else {
//         navigate(`/client-dashbroad2/service/${job.id}`);
//       }
//     } catch (err) {
//       console.error("incrementImpressionsAndNavigate error", err);
//     }
//   };

//   // -------------------- FILTER (search) -------------------- //

//   const filteredJobs = savedJobs.filter((job) => {
//     if (!searchQuery.trim()) return true;
//     const q = searchQuery.toLowerCase();
//     const title = (job.title || "").toLowerCase();
//     const desc = (job.description || "").toLowerCase();
//     const skills = (job.skills || []).join(" ").toLowerCase();
//     const tools = (job.tools || []).join(" ").toLowerCase();
//     return (
//       title.includes(q) ||
//       desc.includes(q) ||
//       skills.includes(q) ||
//       tools.includes(q)
//     );
//   });

//   // -------------------- RENDER -------------------- //

//   if (!user) {
//     // simple "not logged in" state; backend logic same
//     return (
//       <div
//         style={{
//           ...styles.root,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <div style={{ color: "#555", fontSize: 15 }}>
//           Please login to view saved jobs.
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.root}>
//       {/* TOP ROW (UIFreelanceSaved style) */}
//       <div style={styles.topRow}>
//         <div style={styles.leftRow}>
//           <div style={styles.backbtn} onClick={() => navigate(-1)}>
//             <img style={styles.backbtnimg} src={backarrow} alt="back" />
//           </div>

//           <div style={styles.heading}>Saved Jobs</div>
//         </div>

//         <div style={styles.rightIcons}>
//           <img onClick={() => navigate("/messages")} src={message} alt="msg" style={styles.iconImg} />
//           <img
//             src={notification}
//             alt="notif"
//             style={styles.iconImg}
//             onClick={() => setShowNotificationDialog(true)}
//           />
//           <img src={profile} alt="profile" style={styles.iconImg} />
//         </div>
//       </div>

//       {/* SEARCH BAR */}
//       <div style={styles.searchBar}>
//         <img src={search} style={styles.searchIcon} alt="search" />
//         <input
//           style={styles.searchInput}
//           placeholder="Search"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>

//       {/* LIST / STATES */}
//       {loadingSaved ? (
//         <div style={styles.loader}>
//           <div style={styles.loaderCircle} />
//         </div>
//       ) : filteredJobs.length === 0 ? (
//         <div style={styles.emptyText}>No saved jobs found</div>
//       ) : (
//         <div>
//           {filteredJobs.map((job) =>
//             job.type === "services" ? (
//               <JobCardWorks
//                 key={job.id}
//                 job={job}
//                 isSaved={savedJobIds.includes(job.id)}
//                 onToggleSaved={() => toggleSavedJob(job.id)}
//                 onOpen={() => incrementImpressionsAndNavigate(job)}
//               />
//             ) : (
//               <JobCard24h
//                 key={job.id}
//                 job={job}
//                 isSaved={savedJobIds.includes(job.id)}
//                 onToggleSaved={() => toggleSavedJob(job.id)}
//                 onOpen={() => incrementImpressionsAndNavigate(job)}
//               />
//             )
//           )}
//         </div>
//       )}

//       {/* Floating + Button (same as UIFreelanceSaved) */}
//       <button
//         style={styles.fab}
//         onClick={() => navigate("/client-dashbroad2/PostJob")}
//         aria-label="Add"
//       >
//         <FiPlus />
//       </button>

//       {/* NOTIFICATION DIALOG (backend logic same, UI tailwind-based) */}
//       {showNotificationDialog && (
//         <NotificationDialog
//           notifications={notifications}
//           onClose={() => setShowNotificationDialog(false)}
//           onClearAll={() => setNotifications([])}
//         />
//       )}
//     </div>
//   );
// }

// // -------------------- WORKS CARD (services) — UIFreelanceSaved style -------------------- //

// function JobCardWorks({ job, isSaved, onToggleSaved, onOpen }) {
//   const {
//     title = "",
//     description = "",
//     deliveryDuration = "",
//     price,
//     budget_from,
//     budget_to,
//     impressions = 0,
//     createdAt,
//     skills = [],
//     tools = [],
//   } = job;

//   const priceText =
//     price != null
//       ? `₹${price}`
//       : budget_from != null && budget_to != null
//       ? `₹${budget_from} - ₹${budget_to}`
//       : "₹0";

//   const createdDate =
//     createdAt && typeof createdAt.toDate === "function"
//       ? createdAt.toDate()
//       : createdAt instanceof Date
//       ? createdAt
//       : null;
//   const timeText = createdDate ? timeAgo(createdDate) : "";

//   const chips = [...skills, ...tools];

//   return (
//     <div style={styles.jobCard} onClick={onOpen}>
//       <div style={styles.cardTop}>
//         <div style={{ flex: 1 }}>
//           <div style={styles.title}>{title}</div>
//         </div>

//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "flex-end",
//           }}
//         >
//           <div style={styles.budgetTop}>{priceText}</div>

//           <img
//             src={isSaved ? saved : save}
//             alt="save"
//             style={styles.saveIcon}
//             onClick={(e) => {
//               e.stopPropagation();
//               onToggleSaved();
//             }}
//           />
//         </div>
//       </div>

//       <div style={styles.skillsrequired}>Skills Required</div>
//       <div style={styles.chipsRow}>
//         {chips.slice(0, 3).map((c) => (
//           <span key={c} style={styles.chip}>
//             {c}
//           </span>
//         ))}
//         {chips.length > 3 && (
//           <span style={styles.chip}>+{chips.length - 3}</span>
//         )}
//       </div>

//       <div style={styles.desc}>{description}</div>

//       <div style={styles.meta}>
//         <FaEye size={14} /> {impressions ?? 0}
//         <MdAccessTime size={14} style={styles.time} /> {timeText}
//       </div>
//     </div>
//   );
// }

// // -------------------- 24H CARD (service_24h) — UIFreelanceSaved style -------------------- //

// function JobCard24h({ job, isSaved, onToggleSaved, onOpen }) {
//   const {
//     title = "Untitled",
//     description = "",
//     timeline = "24 Hours",
//     budget,
//     createdAt,
//     views = 0,
//     skills = [],
//     tools = [],
//   } = job;

//   const budgetText = `₹${formatAmount(budget ?? 0)}`;
//   const createdDate =
//     createdAt && typeof createdAt.toDate === "function"
//       ? createdAt.toDate()
//       : createdAt instanceof Date
//       ? createdAt
//       : null;
//   const timeText = createdDate ? timeAgo(createdDate) : "Just now";

//   const chips = [...skills, ...tools];

//   return (
//     <div style={styles.jobCard} onClick={onOpen}>
//       <div style={styles.cardTop}>
//         <div style={{ flex: 1 }}>
//           <div style={styles.title}>{title}</div>
//         </div>

//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "flex-end",
//           }}
//         >
//           <div style={styles.budgetTop}>{budgetText}</div>

//           <img
//             src={isSaved ? saved : save}
//             alt="save"
//             style={styles.saveIcon}
//             onClick={(e) => {
//               e.stopPropagation();
//               onToggleSaved();
//             }}
//           />
//         </div>
//       </div>

//       <div style={styles.skillsrequired}>Skills Required</div>
//       <div style={styles.chipsRow}>
//         {chips.slice(0, 3).map((c) => (
//           <span key={c} style={styles.chip}>
//             {c}
//           </span>
//         ))}
//         {chips.length > 3 && (
//           <span style={styles.chip}>+{chips.length - 3}</span>
//         )}
//       </div>

//       <div style={styles.desc}>{description}</div>

//       <div style={styles.meta}>
//         <FaEye size={14} /> {views ?? 0}
//         <MdAccessTime size={14} style={styles.time} /> {timeText}
//       </div>
//     </div>
//   );
// }

// // -------------------- NOTIFICATION DIALOG (same backend logic, Tailwind UI) -------------------- //

// function NotificationDialog({ notifications, onClose, onClearAll }) {
//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50">
//       <div className="mt-16 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
//         {/* Header */}
//         <div className="bg-[#FDFD96] px-4 py-3 flex items-center gap-3">
//           <div className="p-2 bg-white/30 rounded-xl">
//             <span className="material-icons text-gray-900 text-[20px]">
//               notifications_active
//             </span>
//           </div>
//           <div className="flex-1">
//             <p className="text-sm font-semibold text-gray-900">
//               Notifications
//             </p>
//             <p className="text-xs text-gray-700">
//               {notifications.length}{" "}
//               {notifications.length === 1 ? "notification" : "notifications"}
//             </p>
//           </div>
//           {notifications.length > 0 && (
//             <button
//               className="text-xs font-semibold bg.white/40 px-2 py-1 rounded-lg mr-1"
//               onClick={onClearAll}
//             >
//               Clear All
//             </button>
//           )}
//           <button className="p-2 bg-white/40 rounded-xl" onClick={onClose}>
//             <span className="material-icons text-gray-900 text-[18px]">
//               close
//             </span>
//           </button>
//         </div>

//         {/* Body */}
//         <div className="max-h-80 overflow-y-auto py-3">
//           {notifications.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500 text-sm">
//               <div className="p-4 rounded-full bg-gray-100 mb-3">
//                 <span className="material-icons text-[32px] text-gray-400">
//                   notifications_off
//                 </span>
//               </div>
//               <p className="font-semibold text-gray-700 mb-1">
//                 No notifications yet
//               </p>
//               <p className="text-xs leading-relaxed text-gray-500">
//                 You're all caught up! New notifications will appear here when
//                 available.
//               </p>
//             </div>
//           ) : (
//             notifications.map((n, idx) => (
//               <div
//                 key={idx}
//                 className="mx-4 mb-2 p-3 rounded-xl border border-gray-200 bg-gray-50 flex items-start gap-3"
//               >
//                 <div className="p-2 rounded-xl bg-[#FDFD96]">
//                   <span className="material-icons text-gray-900 text-[20px]">
//                     notifications
//                   </span>
//                 </div>
//                 <div className="flex-1">
//                   {n.title && (
//                     <p className="text-sm font-semibold text-gray-900">
//                       {n.title}
//                     </p>
//                   )}
//                   {n.body && (
//                     <p className="mt-1 text-xs text-gray-700">{n.body}</p>
//                   )}
//                   <p className="mt-1 text-[10px] text-gray-500">Just now</p>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }











// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   getDoc,
//   getDocs,
//   updateDoc,
//   arrayUnion,
//   arrayRemove,
//   increment,
// } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { db } from "../firbase/Firebase"; // 🔁 keep your existing path

// // 🔹 UI imports from UIFreelanceSaved.jsx
// import backarrow from "../assets/backarrow.png";
// import message from "../assets/message.png";
// import notification from "../assets/notification.png";
// import profile from "../assets/profile.png";
// import save from "../assets/save.png";
// import saved from "../assets/saved.png";
// import search from "../assets/search.png";
// import { MdAccessTime } from "react-icons/md";
// import { FaEye } from "react-icons/fa";
// import { FiPlus } from "react-icons/fi";

// // -------------------- UTIL FUNCTIONS -------------------- //

// function timeAgo(date) {
//   if (!date) return "";
//   const diff = Date.now() - date.getTime();
//   const minutes = Math.floor(diff / (1000 * 60));
//   if (minutes < 1) return "just now";
//   if (minutes < 60) return `${minutes} min ago`;
//   const hours = Math.floor(minutes / 60);
//   if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
//   const days = Math.floor(hours / 24);
//   return `${days} day${days > 1 ? "s" : ""} ago`;
// }

// function formatAmount(amount) {
//   const num = Number(amount) || 0;
//   if (num < 1000) return num.toFixed(0);
//   if (num < 1_000_000) {
//     const v = num / 1000;
//     return `${v.toFixed(v === Math.trunc(v) ? 0 : 1)}K`;
//   }
//   const v = num / 1_000_000;
//   return `${v.toFixed(v === Math.trunc(v) ? 0 : 1)}M`;
// }

// // -------------------- INLINE STYLES (from UIFreelanceSaved) -------------------- //

// const styles = {
//   root: {
//     backgroundColor: "#FFFFFF",
//     minHeight: "100vh",
//     fontFamily: "'Rubik', sans-serif",
//     padding: "16px",
//     paddingBottom: "96px", // space for FAB
//   },
//   topRow: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 12,
//     width: "100%",
//   },
//   leftRow: {
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//   },
//   backbtn: {
//     width: 38,
//     height: 38,
//     borderRadius: 12,
//     border: "1px solid #ccc",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     cursor: "pointer",
//     backgroundColor: "#fff",
//   },
//   backbtnimg: {
//     height: 18,
//     width: 18,
//   },
//   heading: {
//     fontSize: 34,
//     fontWeight: 500,
//   },
//   rightIcons: {
//     display: "flex",
//     alignItems: "center",
//     gap: 14,
//   },
//   iconImg: {
//     width: 26,
//     height: 26,
//     cursor: "pointer",
//   },
//   searchBar: {
//     width: "95%",
//     height: 48,
//     borderRadius: 25,
//     backgroundColor: "#F3F3F3",
//     display: "flex",
//     alignItems: "center",
//     padding: "0 16px",
//     marginBottom: 20,
//     marginTop: 30,
//     gap: 12,
//   },
//   searchIcon: {
//     width: 20,
//     height: 20,
//     opacity: 0.65,
//   },
//   searchInput: {
//     border: "none",
//     outline: "none",
//     background: "transparent",
//     width: "100%",
//     fontSize: 15,
//     fontFamily: "'Rubik', sans-serif",
//     marginTop:"14px",
//     marginLeft:"-20px"
//   },
//   jobCard: {
//     width: "95%",
//     margin: "0 auto",
//     borderRadius: 18,
//     backgroundColor: "#fff",
//     border: "1px solid #ececec",
//     padding: 16,
//     marginBottom: 16,
//     boxShadow: "0 3px 6px rgba(0,0,0,0.07)",
//     cursor: "pointer",
//   },
//   cardTop: {
//     display: "flex",
//     alignItems: "flex-start",
//     justifyContent: "space-between",
//     width: "100%",
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 400,
//     marginBottom: 6,
//     lineHeight: "20px",
//   },
//   meta: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     color: "#777",
//     fontSize: 12,
//     marginTop: 10,
//   },
//   time: {
//     marginLeft: 20,
//   },
//   budgetTop: {
//     fontWeight: 600,
//     fontSize: 15,
//   },
//   saveIcon: {
//     cursor: "pointer",
//     width: 20,
//     height: 20,
//     marginTop: 6,
//   },
//   skillsrequired: {
//     fontWeight: 400,
//     fontSize: 14,
//     opacity: "70%",
//     marginTop: 10,
//   },
//   desc: {
//     marginTop: 10,
//     fontSize: 13,
//     color: "#555",
//     lineHeight: "18px",
//   },
//   chipsRow: {
//     marginTop: 10,
//     display: "flex",
//     flexWrap: "wrap",
//     gap: 6,
//   },
//   chip: {
//     backgroundColor: "rgba(255, 240, 133, 0.7)",
//     padding: "4px 10px",
//     borderRadius: 12,
//     fontSize: 12,
//   },
//   emptyText: {
//     textAlign: "center",
//     marginTop: 40,
//     color: "#777",
//   },
//   loader: {
//     marginTop: 60,
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loaderCircle: {
//     height: 24,
//     width: 24,
//     borderRadius: "999px",
//     border: "2px solid #aaa",
//     borderTopColor: "transparent",
//     animation: "spin 0.8s linear infinite",
//   },
//   fab: {
//     position: "fixed",
//     right: 36,
//     bottom: 36,
//     width: 56,
//     height: 56,
//     borderRadius: 999,
//     background: "linear-gradient(180deg, #7c3aed, #6d28d9)",
//     color: "white",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     border: 0,
//     boxShadow: "0 10px 30px rgba(124,58,237,0.18)",
//     cursor: "pointer",
//     fontSize: 20,
//   },
// };

// // -------------------- MAIN COMPONENT -------------------- //

// export default function SavedJobsScreen() {
//   const navigate = useNavigate();
//   const auth = getAuth();

//   // 1️⃣ Sidebar collapsed state
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   // 2️⃣ Listen for sidebar toggle event
//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   const [savedJobIds, setSavedJobIds] = useState([]);
//   const [savedJobs, setSavedJobs] = useState([]);
//   const [loadingSaved, setLoadingSaved] = useState(true);

//   // Notification dialog state (backend logic same)
//   const [notifications, setNotifications] = useState([]);
//   const [showNotificationDialog, setShowNotificationDialog] = useState(false);

//   const [searchQuery, setSearchQuery] = useState("");

//   const user = auth.currentUser;

//   // -------------------- LISTEN TO USER SAVED JOBS -------------------- //

//   useEffect(() => {
//     if (!user) {
//       setLoadingSaved(false);
//       return;
//     }

//     const userRef = doc(db, "users", user.uid);
//     const unsub = onSnapshot(
//       userRef,
//       (snap) => {
//         const data = snap.data() || {};
//         const ids = data.savedJobs || [];
//         setSavedJobIds(ids);
//       },
//       (err) => {
//         console.error("user snapshot error", err);
//       }
//     );

//     return unsub;
//   }, [user]);

//   // -------------------- LOAD SAVED JOB DOCUMENTS -------------------- //

//   useEffect(() => {
//     if (!user) return;

//     async function loadSaved() {
//       try {
//         setLoadingSaved(true);

//         if (!savedJobIds.length) {
//           setSavedJobs([]);
//           return;
//         }

//         const [servicesSnap, service24Snap] = await Promise.all([
//           getDocs(collection(db, "services")),
//           getDocs(collection(db, "service_24h")),
//         ]);

//         const all = [];

//         servicesSnap.forEach((docSnap) => {
//           if (savedJobIds.includes(docSnap.id)) {
//             all.push({
//               id: docSnap.id,
//               type: "services",
//               ...docSnap.data(),
//             });
//           }
//         });

//         service24Snap.forEach((docSnap) => {
//           if (savedJobIds.includes(docSnap.id)) {
//             all.push({
//               id: docSnap.id,
//               type: "service_24h",
//               ...docSnap.data(),
//             });
//           }
//         });

//         // 🔥 Sort by createdAt (recent first) – same as original
//         all.sort((a, b) => {
//           const getDate = (job) => {
//             const ts = job.createdAt;
//             if (ts && typeof ts.toDate === "function") {
//               return ts.toDate();
//             }
//             if (ts instanceof Date) return ts;
//             return new Date(0); // fallback old
//           };
//           return getDate(b) - getDate(a);
//         });

//         setSavedJobs(all);
//       } catch (err) {
//         console.error("loadSavedJobs error", err);
//       } finally {
//         setLoadingSaved(false);
//       }
//     }

//     loadSaved();
//   }, [user, savedJobIds]);

//   // -------------------- HANDLERS -------------------- //

//   const toggleSavedJob = async (jobId) => {
//     const currentUser = auth.currentUser;
//     if (!currentUser) return;

//     const userRef = doc(db, "users", currentUser.uid);
//     const isSaved = savedJobIds.includes(jobId);

//     try {
//       if (isSaved) {
//         await updateDoc(userRef, {
//           savedJobs: arrayRemove(jobId),
//         });
//       } else {
//         await updateDoc(userRef, {
//           savedJobs: arrayUnion(jobId),
//         });
//       }
//     } catch (err) {
//       console.error("toggleSavedJob error", err);
//     }
//   };

//   const incrementImpressionsAndNavigate = async (job) => {
//     try {
//       const currentUser = auth.currentUser;
//       if (!currentUser) return;

//       const collectionName =
//         job.type === "service_24h" ? "service_24h" : "services";
//       const ref = doc(db, collectionName, job.id);
//       const snap = await getDoc(ref);

//       if (snap.exists()) {
//         const data = snap.data();
//         const viewedBy = data.viewedBy || [];

//         if (!viewedBy.includes(currentUser.uid)) {
//           await updateDoc(ref, {
//             viewedBy: arrayUnion(currentUser.uid),
//             [collectionName === "service_24h" ? "views" : "impressions"]:
//               increment(1),
//           });
//         }
//       }

//       if (collectionName === "service_24h") {
//         navigate(`/client-dashbroad2/service-24h/${job.id}`);
//       } else {
//         navigate(`/client-dashbroad2/service/${job.id}`);
//       }
//     } catch (err) {
//       console.error("incrementImpressionsAndNavigate error", err);
//     }
//   };

//   // -------------------- FILTER (search) -------------------- //

//   const filteredJobs = savedJobs.filter((job) => {
//     if (!searchQuery.trim()) return true;
//     const q = searchQuery.toLowerCase();
//     const title = (job.title || "").toLowerCase();
//     const desc = (job.description || "").toLowerCase();
//     const skills = (job.skills || []).join(" ").toLowerCase();
//     const tools = (job.tools || []).join(" ").toLowerCase();
//     return (
//       title.includes(q) ||
//       desc.includes(q) ||
//       skills.includes(q) ||
//       tools.includes(q)
//     );
//   });

//   // -------------------- RENDER -------------------- //

//   if (!user) {
//     // simple "not logged in" state; backend logic same
//     return (
//       <div
//         className="freelance-wrapper"
//         style={{
//           marginLeft: collapsed ? "-140px" : "510px",
//           transition: "margin-left 0.25s ease",
//         }}
//       >
//         <div
//           style={{
//             ...styles.root,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <div style={{ color: "#555", fontSize: 15 }}>
//             Please login to view saved jobs.
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // 3️⃣ Wrap whole UI inside margin-left wrapper
//   return (
//     <div
//       className="freelance-wrapper"
//       style={{
//         marginLeft: collapsed ? "-110px" : "110px",
//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       <div style={styles.root}>
//         {/* TOP ROW (UIFreelanceSaved style) */}
//         <div style={styles.topRow}>
//           <div style={styles.leftRow}>
//             <div style={styles.backbtn} onClick={() => navigate(-1)}>
//               <img style={styles.backbtnimg} src={backarrow} alt="back" />
//             </div>

//             <div style={styles.heading}>Saved Jobs</div>
//           </div>

//           <div style={styles.rightIcons}>
//             <img
//               onClick={() => navigate("/messages")}
//               src={message}
//               alt="msg"
//               style={styles.iconImg}
//             />
//             <img
//               src={notification}
//               alt="notif"
//               style={styles.iconImg}
//               onClick={() => setShowNotificationDialog(true)}
//             />
//             <img src={profile} alt="profile" style={styles.iconImg} />
//           </div>
//         </div>

//         {/* SEARCH BAR */}
//         <div style={styles.searchBar}>
//           <img src={search} style={styles.searchIcon} alt="search" />
//           <input
//             style={styles.searchInput}
//             placeholder="Search"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>

//         {/* LIST / STATES */}
//         {loadingSaved ? (
//           <div style={styles.loader}>
//             <div style={styles.loaderCircle} />
//           </div>
//         ) : filteredJobs.length === 0 ? (
//           <div style={styles.emptyText}>No saved jobs found</div>
//         ) : (
//           <div>
//             {filteredJobs.map((job) =>
//               job.type === "services" ? (
//                 <JobCardWorks
//                   key={job.id}
//                   job={job}
//                   isSaved={savedJobIds.includes(job.id)}
//                   onToggleSaved={() => toggleSavedJob(job.id)}
//                   onOpen={() => incrementImpressionsAndNavigate(job)}
//                 />
//               ) : (
//                 <JobCard24h
//                   key={job.id}
//                   job={job}
//                   isSaved={savedJobIds.includes(job.id)}
//                   onToggleSaved={() => toggleSavedJob(job.id)}
//                   onOpen={() => incrementImpressionsAndNavigate(job)}
//                 />
//               )
//             )}
//           </div>
//         )}

//         {/* Floating + Button (same as UIFreelanceSaved) */}
//         <button
//           style={styles.fab}
//           onClick={() => navigate("/client-dashbroad2/PostJob")}
//           aria-label="Add"
//         >
//           <FiPlus />
//         </button>

//         {/* NOTIFICATION DIALOG (backend logic same, UI tailwind-based) */}
//         {showNotificationDialog && (
//           <NotificationDialog
//             notifications={notifications}
//             onClose={() => setShowNotificationDialog(false)}
//             onClearAll={() => setNotifications([])}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// // -------------------- WORKS CARD (services) — UIFreelanceSaved style -------------------- //

// function JobCardWorks({ job, isSaved, onToggleSaved, onOpen }) {
//   const {
//     title = "",
//     description = "",
//     deliveryDuration = "",
//     price,
//     budget_from,
//     budget_to,
//     impressions = 0,
//     createdAt,
//     skills = [],
//     tools = [],
//   } = job;

//   const priceText =
//     price != null
//       ? `₹${price}`
//       : budget_from != null && budget_to != null
//       ? `₹${budget_from} - ₹${budget_to}`
//       : "₹0";

//   const createdDate =
//     createdAt && typeof createdAt.toDate === "function"
//       ? createdAt.toDate()
//       : createdAt instanceof Date
//       ? createdAt
//       : null;
//   const timeText = createdDate ? timeAgo(createdDate) : "";

//   const chips = [...skills, ...tools];

//   return (
//     <div style={styles.jobCard} onClick={onOpen}>
//       <div style={styles.cardTop}>
//         <div style={{ flex: 1 }}>
//           <div style={styles.title}>{title}</div>
//         </div>

//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "flex-end",
//           }}
//         >
//           <div style={styles.budgetTop}>{priceText}</div>

//           <img
//             src={isSaved ? saved : save}
//             alt="save"
//             style={styles.saveIcon}
//             onClick={(e) => {
//               e.stopPropagation();
//               onToggleSaved();
//             }}
//           />
//         </div>
//       </div>

//       <div style={styles.skillsrequired}>Skills Required</div>
//       <div style={styles.chipsRow}>
//         {chips.slice(0, 3).map((c) => (
//           <span key={c} style={styles.chip}>
//             {c}
//           </span>
//         ))}
//         {chips.length > 3 && (
//           <span style={styles.chip}>+{chips.length - 3}</span>
//         )}
//       </div>

//       <div style={styles.desc}>{description}</div>

//       <div style={styles.meta}>
//         <FaEye size={14} /> {impressions ?? 0}
//         <MdAccessTime size={14} style={styles.time} /> {timeText}
//       </div>
//     </div>
//   );
// }

// // -------------------- 24H CARD (service_24h) — UIFreelanceSaved style -------------------- //

// function JobCard24h({ job, isSaved, onToggleSaved, onOpen }) {
//   const {
//     title = "Untitled",
//     description = "",
//     timeline = "24 Hours",
//     budget,
//     createdAt,
//     views = 0,
//     skills = [],
//     tools = [],
//   } = job;

//   const budgetText = `₹${formatAmount(budget ?? 0)}`;
//   const createdDate =
//     createdAt && typeof createdAt.toDate === "function"
//       ? createdAt.toDate()
//       : createdAt instanceof Date
//       ? createdAt
//       : null;
//   const timeText = createdDate ? timeAgo(createdDate) : "Just now";

//   const chips = [...skills, ...tools];

//   return (
//     <div style={styles.jobCard} onClick={onOpen}>
//       <div style={styles.cardTop}>
//         <div style={{ flex: 1 }}>
//           <div style={styles.title}>{title}</div>
//         </div>

//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "flex-end",
//           }}
//         >
//           <div style={styles.budgetTop}>{budgetText}</div>

//           <img
//             src={isSaved ? saved : save}
//             alt="save"
//             style={styles.saveIcon}
//             onClick={(e) => {
//               e.stopPropagation();
//               onToggleSaved();
//             }}
//           />
//         </div>
//       </div>

//       <div style={styles.skillsrequired}>Skills Required</div>
//       <div style={styles.chipsRow}>
//         {chips.slice(0, 3).map((c) => (
//           <span key={c} style={styles.chip}>
//             {c}
//           </span>
//         ))}
//         {chips.length > 3 && (
//           <span style={styles.chip}>+{chips.length - 3}</span>
//         )}
//       </div>

//       <div style={styles.desc}>{description}</div>

//       <div style={styles.meta}>
//         <FaEye size={14} /> {views ?? 0}
//         <MdAccessTime size={14} style={styles.time} /> {timeText}
//       </div>
//     </div>
//   );
// }

// // -------------------- NOTIFICATION DIALOG (same backend logic, Tailwind UI) -------------------- //

// function NotificationDialog({ notifications, onClose, onClearAll }) {
//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50">
//       <div className="mt-16 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
//         {/* Header */}
//         <div className="bg-[#FDFD96] px-4 py-3 flex items-center gap-3">
//           <div className="p-2 bg-white/30 rounded-xl">
//             <span className="material-icons text-gray-900 text-[20px]">
//               notifications_active
//             </span>
//           </div>
//           <div className="flex-1">
//             <p className="text-sm font-semibold text-gray-900">
//               Notifications
//             </p>
//             <p className="text-xs text-gray-700">
//               {notifications.length}{" "}
//               {notifications.length === 1 ? "notification" : "notifications"}
//             </p>
//           </div>
//           {notifications.length > 0 && (
//             <button
//               className="text-xs font-semibold bg.white/40 px-2 py-1 rounded-lg mr-1"
//               onClick={onClearAll}
//             >
//               Clear All
//             </button>
//           )}
//           <button className="p-2 bg-white/40 rounded-xl" onClick={onClose}>
//             <span className="material-icons text-gray-900 text-[18px]">
//               close
//             </span>
//           </button>
//         </div>

//         {/* Body */}
//         <div className="max-h-80 overflow-y-auto py-3">
//           {notifications.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500 text-sm">
//               <div className="p-4 rounded-full bg-gray-100 mb-3">
//                 <span className="material-icons text-[32px] text-gray-400">
//                   notifications_off
//                 </span>
//               </div>
//               <p className="font-semibold text-gray-700 mb-1">
//                 No notifications yet
//               </p>
//               <p className="text-xs leading-relaxed text-gray-500">
//                 You're all caught up! New notifications will appear here when
//                 available.
//               </p>
//             </div>
//           ) : (
//             notifications.map((n, idx) => (
//               <div
//                 key={idx}
//                 className="mx-4 mb-2 p-3 rounded-xl border border-gray-200 bg-gray-50 flex items-start gap-3"
//               >
//                 <div className="p-2 rounded-xl bg-[#FDFD96]">
//                   <span className="material-icons text-gray-900 text-[20px]">
//                     notifications
//                   </span>
//                 </div>
//                 <div className="flex-1">
//                   {n.title && (
//                     <p className="text-sm font-semibold text-gray-900">
//                       {n.title}
//                     </p>
//                   )}
//                   {n.body && (
//                     <p className="mt-1 text-xs text-gray-700">{n.body}</p>
//                   )}
//                   <p className="mt-1 text-[10px] text-gray-500">Just now</p>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firbase/Firebase";

import {
  FiBell,
  FiMessageSquare,
  FiUser,
  FiArrowLeft,
  FiBookmark,
  FiPlus,
  FiEye,
  FiClock,
} from "react-icons/fi";

export default function SavedServicesOnly() {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  // -------------------------
  // Sidebar collapsed state
  // -------------------------
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  useEffect(() => {
    try {
      localStorage.setItem("sidebar-collapsed", collapsed ? "true" : "false");
    } catch (e) {
      // ignore storage errors
    }
  }, [collapsed]);

  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  // -------------------------
  // existing state
  // -------------------------
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentUserCategory, setCurrentUserCategory] = useState("");
  const [userProfile, setUserProfile] = useState(null);

  /* =====================================================
        FETCH USER PROFILE
  ===================================================== */
  const fetchUserProfile = async (uid) => {
    try {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        setUserProfile(snap.data());
      }
    } catch (e) {
      console.error("Profile fetch error:", e);
    }
  };

  useEffect(() => {
    const userCurrent = auth.currentUser;
    if (!userCurrent) return;
    fetchUserProfile(userCurrent.uid);
  }, []);

  /* =====================================================
        NOTIFICATION STATE + BACKEND FETCH
  ===================================================== */
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(collection(db, "notifications"), (snap) => {
      const userNots = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((n) => n.clientUid === user.uid);

      setNotifications(userNots);
    });

    return unsub;
  }, [user]);

  const pending = notifications.filter((n) => !n.read).length;

  async function acceptNotif(item) {
    await updateDoc(doc(db, "notifications", item.id), { read: true });
  }

  async function declineNotif(item) {
    await deleteDoc(doc(db, "notifications", item.id));
  }

  /* =====================================================
        LOAD USER CATEGORY
  ===================================================== */
  useEffect(() => {
    if (!user) return;
    return onSnapshot(doc(db, "users", user.uid), (snap) => {
      setCurrentUserCategory(snap.data()?.category || "");
    });
  }, [user]);

  /* =====================================================
        LOAD USER LIST CATEGORIES
  ===================================================== */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      const allCats = snap.docs
        .map((d) => d.data().category)
        .filter((cat) => cat && cat.trim() !== "");

      const uniqueCats = [...new Set(allCats)];

      const finalCats = uniqueCats.map((name, index) => ({
        id: index + 1,
        name,
      }));

      setCategories(finalCats);
    });

    return unsub;
  }, []);

  /* =====================================================
        LOAD ALL JOBS (services + service_24h)
  ===================================================== */
  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, "services"), (snap) => {
      const normalJobs = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
        jobtype: "services",
      }));

      setJobs((prev) => {
        const only24h = prev.filter((j) => j.jobtype === "service_24h");
        return [...only24h, ...normalJobs];
      });
    });

    const unsub2 = onSnapshot(collection(db, "service_24h"), (snap) => {
      const fastJobs = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
        jobtype: "service_24h",
      }));

      setJobs((prev) => {
        const onlyNormal = prev.filter((j) => j.jobtype === "services");
        return [...onlyNormal, ...fastJobs];
      });
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  /* =====================================================
        LOAD SAVED JOBS
  ===================================================== */
  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      setSavedJobs(snap.data()?.favoriteJobs || []);
    });

    return unsub;
  }, [user]);

  /* =====================================================
        SAVE / UNSAVE JOB
  ===================================================== */
  async function toggleSave(jobId) {
    if (!user) return;

    const ref = doc(db, "users", user.uid);
    const updated = savedJobs.includes(jobId)
      ? savedJobs.filter((id) => id !== jobId)
      : [...savedJobs, jobId];

    setSavedJobs(updated);
    await updateDoc(ref, { favoriteJobs: updated });
  }

  /* =====================================================
        SEARCH AUTOSUGGEST
  ===================================================== */
  function updateSuggestions(text) {
    const q = text.toLowerCase();
    const s = new Set();

    jobs.forEach((job) => {
      if (job.title?.toLowerCase().includes(q)) s.add(job.title);
      if (job.skills) {
        job.skills.forEach((sk) => {
          if (sk.toLowerCase().includes(q)) s.add(sk);
        });
      }
    });

    setSuggestions([...s].slice(0, 6));
  }

  useEffect(() => {
    if (!searchText.trim()) {
      setSuggestions([]);
      return;
    }
    updateSuggestions(searchText);
  }, [searchText]);

  /* =====================================================
        FILTER JOBS (SAVED ONLY)
  ===================================================== */
  const filteredJobs = jobs.filter((job) => {
    const matchSaved = savedJobs.includes(job.id);

    const matchSearch =
      job.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchText.toLowerCase());

    const matchCategory =
      selectedCategory === "" ||
      selectedCategory === "No Category Assigned"
        ? true
        : job.category === selectedCategory;

    return matchSaved && matchSearch && matchCategory;
  });

  /* =====================================================
        OPEN JOB DETAILS
  ===================================================== */
  function onViewJob(job) {
    if (job.jobtype === "service_24h") {
      navigate(`/client-dashbroad2/service-24h/${job.id}`);
    } else {
      navigate(`/client-dashbroad2/service/${job.id}`);
    }
  }

  /* =====================================================
        PAGE UI (SAVED ONLY)
  ===================================================== */
  return (
    <div
      className="freelance-wrapper"
      style={{
        marginLeft: collapsed ? "-110px" : "110px",
        transition: "margin-left 0.25s ease",
        padding: "20px 22px",
      }}
    >
      {/* HEADER */}
      <div className="topbar">
        <div className="top-left">
          <div className="back-btn" onClick={() => navigate(-1)}>
            <FiArrowLeft size={20} />
          </div>
          <h2 className="page-title">Saved Services</h2>
        </div>

        <div className="top-right">
          <FiMessageSquare
            className="top-icon"
            onClick={() => {
              navigate("/client-dashbroad2/messages");
            }}
          />

          {/* NOTIFICATION BUTTON */}
          <div
            style={{ position: "relative" }}
            onClick={() => setNotifOpen(true)}
          >
            <FiBell className="top-icon" />

            {pending > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  background: "red",
                  color: "#fff",
                  fontSize: "10px",
                  borderRadius: "50%",
                  padding: "2px 6px",
                }}
              >
                {pending}
              </span>
            )}
          </div>

          <div className="fh-avatar">
            <Link to={"/client-dashbroad2/ClientProfile"}>
              <img
                src={
                  userProfile?.profileImage ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="Profile"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: "relative" }}>
        <input
          type="text"
          className="search-input"
          placeholder="Search services..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        {suggestions.length > 0 && (
          <div className="suggestion-box">
            {suggestions.map((s, i) => (
              <p
                key={i}
                onClick={() => {
                  setSearchText(s);
                  setSuggestions([]);
                }}
                className="suggestion-item"
              >
                {s}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Categories */}
      {categories.length > 0 ? (
        <div className="category-row">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={
                selectedCategory === cat.name
                  ? "category-active"
                  : "category-btn"
              }
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === cat.name ? "" : cat.name
                )
              }
            >
              {cat.name}
            </button>
          ))}
        </div>
      ) : (
        <div style={{ padding: "10px 0", opacity: 0.5 }}>
          No categories found in database.
        </div>
      )}

      {/* Tabs UI (same look – Saved active only) */}
      <div className="jobtabs-wrapper">

        <button className="jobtab active-tab">Saved</button>
      </div>

      {/* Job List (SAVED ONLY) */}
      <div className="job-list">
        {filteredJobs.length === 0 && (
          <div style={{ padding: "20px 0", opacity: 0.6 }}>
            No saved services found.
          </div>
        )}

        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="job-card"
            onClick={() => onViewJob(job)}
          >
            <div className="job-top">
              <h3 className="job-title">{job.title}</h3>
              <FiBookmark
                className={`bookmark-icon ${
                  savedJobs.includes(job.id) ? "bookmarked" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSave(job.id);
                }}
              />
            </div>

            <p className="job-desc">{job.description}</p>

            <div className="job-info-row">
              <span className="job-amount">
                ₹{job.budget_from} - ₹{job.budget_to}
              </span>

              <div className="job-icon-group">
                <span className="tag-icon">
                  <FiEye /> {job.views || "4+"}
                </span>
                <span className="tag-icon">
                  <FiClock /> {job.time || "1h ago"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Add Button */}
      <button
        className="floating-plus"
        onClick={() => navigate("/client-dashbroad2/PostJob")}
      >
        <FiPlus size={22} />
      </button>

      {/* ================================================================= */}
      {/* ======================= NOTIFICATION POPUP ======================= */}
      {/* ================================================================= */}
      {notifOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(2px)",
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
                  src={
                    item.freelancerImage ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  }
                  width={48}
                  height={48}
                  style={{ borderRadius: "50%", marginRight: 10 }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>
                    {item.freelancerName}
                  </div>
                  <div>applied for {item.jobTitle}</div>
                </div>

                {!item.read ? (
                  <>
                    <button
                      onClick={() => acceptNotif(item)}
                      style={{ marginRight: 8 }}
                    >
                      ✅
                    </button>
                    <button onClick={() => declineNotif(item)}>❌</button>
                  </>
                ) : (
                  <button onClick={() => acceptNotif(item)}>💬</button>
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

      {/* ================================================================= */}
      {/* =============================== CSS =============================== */}
      {/* ================================================================= */}
      <style>{`
        * { font-family: 'Poppins', sans-serif; }
        .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .top-left { display: flex; align-items: center; gap: 12px; }
        .back-btn { width: 44px; height: 44px; background: #efe9ff; border-radius: 14px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .page-title { font-size: 21px; font-weight: 700; }
        .top-right { display: flex; gap: 16px; }
        .top-icon { font-size: 20px; cursor: pointer; }

        .fh-avatar img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .search-input {
          width: 100%; padding: 12px 14px;
          border-radius: 12px; background: #fff;
          border: 1px solid #e6e7ee; font-size: 15px;
        }
        .suggestion-box {
          background: #fff; border: 1px solid #ddd; position: absolute;
          top: 50px; width: 100%; border-radius: 12px;
          box-shadow: 0 4px 18px rgba(0,0,0,.1); z-index: 10; padding: 8px;
        }
        .suggestion-item { padding: 8px; cursor: pointer; }

        .category-row { display: flex; gap: 10px; margin: 14px 0; overflow-x: auto; }
        .category-btn, .category-active {
          padding: 8px 14px; white-space: nowrap;
          border-radius: 999px; cursor: pointer; font-weight: 600;
        }
        .category-btn { background: white; border: 1px solid #e2e8f0; color: #444; }
        .category-active { background: #7c3aed; color: #fff; }

        .jobtabs-wrapper {
          background: #fff; display: flex; gap: 10px;
          padding: 10px; border-radius: 14px; border: 1px solid #ececec;
          margin-top: 4px;
        }
        .jobtab {
          padding: 10px 14px; border-radius: 10px;
          font-weight: 700; cursor: default; opacity: .6; width: 100px; border: none;
        }
        .active-tab { background: #7c3aed; color: white; opacity: 1; }

        .job-list { display: flex; flex-direction: column; gap: 18px; margin-top: 20px; }
        .job-card {
          background: #fff; border-radius: 18px; padding: 18px;
          border: 1px solid #ececec; cursor: pointer;
          transition: .2s;
        }
        .job-card:hover { transform: translateY(-3px); box-shadow: 0 6px 18px rgba(0,0,0,.08); }

        .job-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .job-title { font-size: 17px; font-weight: 700; margin: 0; }
        .job-desc { font-size: 14px; opacity: .85; margin: 0; margin-top: 4px; }

        .bookmark-icon { font-size: 20px; cursor: pointer; color: #777; }
        .bookmarked { color: #7c3aed !important; }

        .job-info-row {
          display: flex; justify-content: space-between; align-items: center; margin-top: 10px;
        }
        .job-amount { font-size: 17px; font-weight: 700; }
        .job-icon-group { display: flex; gap: 12px; }
        .tag-icon { display: flex; align-items: center; gap: 4px; font-size: 12px; }

        .floating-plus {
          position: fixed; right: 22px; bottom: 22px;
          width: 56px; height: 56px; border-radius: 50%;
          background: #7c3aed; color: white;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 18px rgba(99,102,241,.2); border: none;
        }
      `}</style>
    </div>
  );
}
