

// // // ChatListScreen.jsx
// // import React, { useEffect, useState, useRef } from "react";
// // import { useNavigate } from "react-router-dom";

// // import { db, auth, rtdb } from "../../firbase/Firebase";

// // import {
// //   collection,
// //   doc,
// //   getDoc,
// //   onSnapshot,
// // } from "firebase/firestore";

// // import {
// //   ref as rRef,
// //   onValue,
// //   get,
// //   query as rQuery,
// //   orderByChild,
// //   limitToLast,
// //   update as rUpdate,
// //   set as rSet,
// //   remove as rRemove,
// // } from "firebase/database";

// // import { v4 as uuidv4 } from "uuid";
// // import "./message.css"


// // // ---------------- CSS INJECTION ----------------
// // const css = `/* (your css stays same) */`;

// // if (typeof document !== "undefined" && !document.getElementById("chatlist-screen-styles")) {
// //   const style = document.createElement("style");
// //   style.id = "chatlist-screen-styles";
// //   style.innerHTML = css;
// //   document.head.appendChild(style);
// // }

// // // ---------------- HELPERS ----------------
// // function convertTimestampsJS(value) {
// //   if (value === null || value === undefined) return value;

// //   if (typeof value === "object" && "seconds" in value && "nanoseconds" in value) {
// //     return typeof value.toMillis === "function"
// //       ? value.toMillis()
// //       : value.seconds * 1000;
// //   }

// //   if (value instanceof Date) return value.getTime();

// //   if (Array.isArray(value)) return value.map(convertTimestampsJS);

// //   if (typeof value === "object") {
// //     const o = {};
// //     Object.entries(value).forEach(([k, v]) => {
// //       o[k] = convertTimestampsJS(v);
// //     });
// //     return o;
// //   }

// //   return value;
// // }

// // function formatTimeLabel(ts) {
// //   if (!ts) return "";
// //   const date = new Date(ts);
// //   const now = new Date();
// //   const diff = now - date;
// //   const days = diff / 86400000;

// //   if (days < 1)
// //     return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
// //   if (days < 2) return "Yesterday";
// //   if (days < 7) return date.toLocaleDateString([], { weekday: "long" });
// //   return date.toLocaleDateString([], { month: "short", day: "numeric" });
// // }

// // // ------------------------------------------------------------
// // //                     MAIN COMPONENT
// // // ------------------------------------------------------------

// // export default function ChatListScreen({ currentUid: propUid, sharedJob = null }) {
// //   const navigate = useNavigate();
// //   const currentUid = propUid || auth.currentUser?.uid || null;

// //   const [userRole, setUserRole] = useState("");
// //   const [search, setSearch] = useState("");
// //   const [requestCount, setRequestCount] = useState(0);

// //   const [chats, setChats] = useState([]);
// //   const [chatItems, setChatItems] = useState([]);
// //   const [loadingChats, setLoadingChats] = useState(true);
// //   const [chatError, setChatError] = useState("");

// //   const [deleteState, setDeleteState] = useState({ open: false, chat: null, name: "" });

// //   const userCacheRef = useRef({}); // FULL USER PROFILE CACHE

// //   // ------------------------------------------------------------
// //   //                 LOAD USER ROLE
// //   // ------------------------------------------------------------
// //   useEffect(() => {
// //     if (!currentUid) return;

// //     const load = async () => {
// //       try {
// //         const snap = await getDoc(doc(db, "users", currentUid));
// //         if (snap.exists()) {
// //           const role = (snap.data().role || "").toLowerCase();
// //           setUserRole(role);
// //         }
// //       } catch (e) {
// //         console.log("role error", e);
// //       }
// //     };

// //     load();
// //   }, [currentUid]);

// //   // ------------------------------------------------------------
// //   //             REQUEST COUNT LISTENER
// //   // ------------------------------------------------------------
// //   useEffect(() => {
// //     if (!currentUid) return;

// //     const colRef = collection(db, "requests", currentUid, "users");
// //     const unsub = onSnapshot(colRef, (s) => setRequestCount(s.size));

// //     return () => unsub();
// //   }, [currentUid]);

// //   // ------------------------------------------------------------
// //   //             LISTEN TO ALL CHATS (Realtime DB)
// //   // ------------------------------------------------------------
// //   useEffect(() => {
// //     if (!currentUid || !rtdb) return;

// //     setLoadingChats(true);

// //     const refUserChats = rRef(rtdb, `userChats/${currentUid}`);
// //     let cancelled = false;

// //     const unsub = onValue(
// //       refUserChats,
// //       async (snapshot) => {
// //         if (cancelled) return;

// //         const val = snapshot.val();
// //         if (!val) {
// //           setChats([]);
// //           setLoadingChats(false);
// //           return;
// //         }

// //         const entries = Object.entries(val);

// //         const list = await Promise.all(
// //           entries.map(async ([chatId, raw]) => {
// //             const withUid = raw.withUid || raw.with || "";
// //             let lastMessage = raw.lastMessage || "";
// //             let lastMessageTime = raw.lastMessageTime || 0;

// //             try {
// //               const msgQuery = rQuery(
// //                 rRef(rtdb, `chats/${chatId}/messages`),
// //                 orderByChild("timestamp"),
// //                 limitToLast(1)
// //               );

// //               const msgSnap = await get(msgQuery);

// //               if (msgSnap.exists()) {
// //                 const first = Object.values(msgSnap.val())[0];

// //                 if (first.type === "job") {
// //                   const jobTitle =
// //                     first.jobData?.title ||
// //                     first.jobData?.sub_category ||
// //                     "Job Shared";
// //                   lastMessage = `[Job] ${jobTitle}`;
// //                 } else {
// //                   lastMessage = first.text || "[Attachment]";
// //                 }

// //                 lastMessageTime = first.timestamp || lastMessageTime;
// //               }
// //             } catch (e) {
// //               console.log("msg error", e);
// //             }

// //             return { chatId, withUid, lastMessage, lastMessageTime };
// //           })
// //         );

// //         const sorted = list.sort(
// //           (a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0)
// //         );

// //         setChats(sorted);
// //         setLoadingChats(false);
// //       },
// //       (err) => {
// //         console.log("listen error", err);
// //         if (!cancelled) {
// //           setChats([]);
// //           setLoadingChats(false);
// //           setChatError("Error loading chats");
// //         }
// //       }
// //     );

// //     return () => {
// //       cancelled = true;
// //       unsub();
// //     };
// //   }, [currentUid]);

// //   // ------------------------------------------------------------
// //   //                FETCH USER DATA FOR EACH CHAT (FULL PROFILE)
// //   // ------------------------------------------------------------
// //   useEffect(() => {
// //     const load = async () => {
// //       if (!chats.length) return setChatItems([]);

// //       const res = await Promise.all(
// //         chats.map(async (chat) => {
// //           if (!chat.withUid) return null;

// //           // FETCH FULL FIRESTORE PROFILE
// //           if (!userCacheRef.current[chat.withUid]) {
// //             const snap = await getDoc(doc(db, "users", chat.withUid));
// //             userCacheRef.current[chat.withUid] = snap.exists()
// //               ? snap.data()
// //               : {};
// //           }

// //           return { chat, userData: userCacheRef.current[chat.withUid] };
// //         })
// //       );

// //       setChatItems(res.filter(Boolean));
// //     };

// //     load();
// //   }, [chats]);

// //   // ------------------------------------------------------------
// //   //                       SEARCH FILTER
// //   // ------------------------------------------------------------
// //   function filteredChatItems() {
// //     let list = chatItems;

// //     list = list.filter(
// //       (i) => !String(i.chat.lastMessage || "").startsWith("[Job]")
// //     );

// //     if (!search.trim()) return list;

// //     const q = search.trim().toLowerCase();

// //     return list.filter((i) => {
// //       const full = `${i.userData.firstName || ""} ${i.userData.lastName || ""}`.trim().toLowerCase();
// //       return full.includes(q);
// //     });
// //   }

// //   // ------------------------------------------------------------
// //   //          SHARE JOB MESSAGE (IF SHAREDJOB EXISTS)
// //   // ------------------------------------------------------------
// //   async function sendJobMessageToChat(chatId, receiverId, job) {
// //     try {
// //       const now = Date.now();
// //       const msgId = uuidv4();

// //       const msgRef = rRef(rtdb, `chats/${chatId}/messages/${msgId}`);

// //       await rSet(msgRef, {
// //         id: msgId,
// //         type: "job",
// //         jobData: convertTimestampsJS(job),
// //         senderId: currentUid,
// //         receiverId,
// //         timestamp: now,
// //         status: "sent",
// //       });

// //       const title = job.title || job.sub_category || "Job";
// //       const text = `[Job] ${title}`;

// //       const updates = {};
// //       updates[`userChats/${currentUid}/${chatId}`] = {
// //         withUid: receiverId,
// //         lastMessage: text,
// //         lastMessageTime: now,
// //       };
// //       updates[`userChats/${receiverId}/${chatId}`] = {
// //         withUid: currentUid,
// //         lastMessage: text,
// //         lastMessageTime: now,
// //       };

// //       await rUpdate(rRef(rtdb), updates);
// //     } catch (e) {
// //       console.log("job share error", e);
// //     }
// //   }

// //   // ------------------------------------------------------------
// //   //                       DELETE CHAT
// //   // ------------------------------------------------------------
// //   async function deleteChat(chat) {
// //     await rRemove(rRef(rtdb, `userChats/${currentUid}/${chat.chatId}`));
// //     await rRemove(rRef(rtdb, `chats/${chat.chatId}`));
// //     setDeleteState({ open: false, chat: null, name: "" });
// //   }

// //   // ------------------------------------------------------------
// //   //                       RENDER
// //   // ------------------------------------------------------------

// //   if (!currentUid) {
// //     return (
// //       <div className="chatlist-page">
// //         <div className="chatlist-card">
// //           <div className="chatlist-loading-wrapper">
// //             Login to see messages
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const list = filteredChatItems();

// //   return (
// //     <>
// //       {/* Delete Modal */}
// //       {deleteState.open && (
// //         <div className="chatlist-modal-backdrop">
// //           <div className="chatlist-modal">
// //             <div className="chatlist-modal-title-row">
// //               <div className="chatlist-modal-title-icon">🗑</div>
// //               <div className="chatlist-modal-title-text">Delete Chat</div>
// //             </div>
// //             <div className="chatlist-modal-body">
// //               Delete chat with <b>{deleteState.name}</b>?
// //             </div>
// //             <div className="chatlist-modal-actions">
// //               <button
// //                 className="chatlist-btn chatlist-btn-ghost"
// //                 onClick={() => setDeleteState({ open: false, chat: null, name: "" })}
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 className="chatlist-btn chatlist-btn-danger"
// //                 onClick={() => deleteChat(deleteState.chat)}
// //               >
// //                 Delete
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Main Layout */}
// //       <div className="chatlist-page">
// //         <div className="chatlist-card">

// //           {/* Header */}
// //           <div className="chatlist-header">
// //             <button className="chatlist-back-btn" onClick={() => navigate(-1)}>
// //               <span className="chatlist-back-icon" />
// //             </button>

// //             <div className="chatlist-title-wrapper">
// //               <div className="chatlist-title">Message</div>
// //             </div>
// //           </div>

// //           {/* Search */}
// //           <div className="chatlist-search-wrapper">
// //             <div className="chatlist-search-wrapper-inner">
// //               <span className="chatlist-search-icon">🔍</span>
// //               <input
// //                 className="chatlist-search-input"
// //                 placeholder="Search"
// //                 value={search}
// //                 onChange={(e) => setSearch(e.target.value)}
// //               />
// //               {search.trim() && (
// //                 <span
// //                   className="chatlist-search-clear"
// //                   onClick={() => setSearch("")}
// //                 >
// //                   ✕
// //                 </span>
// //               )}
// //             </div>
// //           </div>

// //           {/* Requests */}
// //           {userRole === "freelancer" && (
// //             <div className="chatlist-request-row">
// //               <div
// //                 className="chatlist-request-pill"
// //                 onClick={() =>
// //                   navigate("/request-chats", { state: { currentUid } })
// //                 }
// //               >
// //                 <span className="chatlist-request-text">Request</span>
// //                 {requestCount > 0 && (
// //                   <span className="chatlist-request-badge">{requestCount}</span>
// //                 )}
// //               </div>
// //             </div>
// //           )}

// //           {/* Chat List */}
// //           <div className="chatlist-list">
// //             {loadingChats ? (
// //               <div className="chatlist-loading-wrapper">
// //                 <div className="chatlist-spinner" />
// //               </div>
// //             ) : chatError ? (
// //               <div>Error</div>
// //             ) : !list.length ? (
// //               <div className="chatlist-empty-inner">No messages</div>
// //             ) : (
// //               list.map(({ chat, userData }) => {
// //                 const name = `${userData.firstName || ""} ${userData.lastName || ""}`.trim();
// //                 const imageUrl = userData.profileImage|| "";
// //                 const time = formatTimeLabel(chat.lastMessageTime);

// //                 const onRowClick = async () => {
// //                   // If user shares a job
// //                   if (sharedJob) {
// //                     await sendJobMessageToChat(chat.chatId, chat.withUid, sharedJob);
// //                     alert("Job shared");
// //                     navigate(-1);
// //                     return;
// //                   }

// //                   // NORMAL CHAT — Send FULL PROFILE
// //                   navigate("/chat", {
// //                     state: {
// //                       currentUid,
// //                       otherUid: chat.withUid,

// //                       // 🔥 FULL PROFILE SENT HERE
// //                       otherProfile: userData,

// //                       // old fields for backward compatibility
// //                       otherName: name,
// //                       otherImage: imageUrl,
// //                     },
// //                   });
// //                 };

// //                 return (
// //                   <div
// //                     key={chat.chatId}
// //                     className="chatlist-item"
// //                     onClick={onRowClick}
// //                   >
// //                     <div className="chatlist-avatar-wrapper">
// //                       <img
// //                         src={imageUrl || "https://i.ibb.co/sqsJwP0/user.png" }
// //                         className="chatlist-avatar"
// //                       />
// //                     </div>

// //                     <div className="chatlist-item-content">
// //                       <div className="chatlist-name-row">
// //                         <div className="chatlist-name">{name}</div>
// //                         <div className="chatlist-time">{time}</div>
// //                       </div>
// //                       <div className="chatlist-lastmsg">
// //                         {chat.lastMessage || "No messages yet"}
// //                       </div>
// //                     </div>

// //                     <div className="chatlist-right-col">
// //                       <div className="chatlist-tick-icon">✓</div>
// //                     </div>
// //                   </div>
// //                 );
// //               })
// //             )}
// //           </div>

// //         </div>
// //       </div>
// //     </>
// //   );
// // }

// // ChatListScreen.jsx
// // 🔥 Backend logic unchanged – only UI & CSS updated to match screenshot

// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";

// import { db, auth, rtdb } from "../../firbase/Firebase";

// import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";

// import {
//   ref as rRef,
//   onValue,
//   get,
//   query as rQuery,
//   orderByChild,
//   limitToLast,
//   update as rUpdate,
//   set as rSet,
//   remove as rRemove,
// } from "firebase/database";

// import { v4 as uuidv4 } from "uuid";

// // ---------------- CSS INJECTION (NEW UI) ----------------
// const css = `
// .chatlist-page {
//   min-height: 100vh;
//   width: 100vw;
//   display: flex;
//   justify-content: center;
//   align-items: flex-start;
//   padding: 32px 16px;
//   background: radial-gradient(circle at 0% 0%, #fff9c7 0%, #ffffff 40%, #f7f0ff 100%);
//   font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
//   box-sizing: border-box;
// }

// /* Main white card like screenshot */
// .chatlist-card {
//   width: 420px;
//   max-width: 100%;
//   background: #ffffff;
//   border-radius: 28px;
//   padding: 24px 18px 18px;
//   box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
//   box-sizing: border-box;
// }

// /* Header row */
// .chatlist-header {
//   display: flex;
//   align-items: center;
//   gap: 12px;
//   margin-bottom: 20px;
// }

// .chatlist-back-btn {
//   width: 32px;
//   height: 32px;
//   border-radius: 999px;
//   border: none;
//   background: #ffffff;
//   box-shadow: 0 5px 14px rgba(0,0,0,0.15);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   cursor: pointer;
// }

// .chatlist-back-icon {
//   width: 0;
//   height: 0;
//   border-top: 5px solid transparent;
//   border-bottom: 5px solid transparent;
//   border-right: 6px solid #111827;
//   transform: translateX(-1px);
// }

// .chatlist-title-wrapper {
//   display: flex;
//   flex-direction: column;
// }

// .chatlist-title {
//   font-size: 26px;
//   font-weight: 700;
//   color: #111827;
// }

// /* Search bar */
// .chatlist-search-wrapper {
//   margin-bottom: 16px;
// }

// .chatlist-search-wrapper-inner {
//   display: flex;
//   align-items: center;
//   gap: 10px;
//   background: #ffffff;
//   border-radius: 20px;
//   padding: 10px 14px;
//   box-shadow: 0 10px 24px rgba(0,0,0,0.10);
// }

// .chatlist-search-icon {
//   font-size: 16px;
//   opacity: 0.6;
// }

// .chatlist-search-input {
//   flex: 1;
//   border: none;
//   outline: none;
//   font-size: 14px;
//   color: #111827;
// }

// .chatlist-search-input::placeholder {
//   color: #9ca3af;
// }

// .chatlist-search-clear {
//   font-size: 14px;
//   cursor: pointer;
//   opacity: 0.5;
// }

// /* Request text on right top of list */
// .chatlist-request-row {
//   display: flex;
//   justify-content: flex-end;
//   align-items: center;
//   margin-bottom: 8px;
// }

// .chatlist-request-pill {
//   font-size: 13px;
//   font-weight: 600;
//   color: #7c3aed;
//   cursor: pointer;
// }

// .chatlist-request-text::after {
//   content: "";
// }

// /* (1) style */
// .chatlist-request-badge {
//   margin-left: 2px;
// }

// /* List area */
// .chatlist-list {
//   max-height: 520px;
//   overflow-y: auto;
//   padding: 4px 4px 4px 2px;
// }

// /* Single row */
// .chatlist-item {
//   display: flex;
//   align-items: center;
//   padding: 12px 4px;
//   border-bottom: 1px solid #eef0f4;
//   cursor: pointer;
// }

// .chatlist-avatar-wrapper {
//   margin-right: 10px;
// }

// .chatlist-avatar {
//   width: 40px;
//   height: 40px;
//   border-radius: 999px;
//   object-fit: cover;
//   box-shadow: 0 4px 10px rgba(0,0,0,0.12);
// }

// .chatlist-item-content {
//   flex: 1;
//   display: flex;
//   flex-direction: column;
//   gap: 3px;
// }

// .chatlist-name-row {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
// }

// .chatlist-name {
//   font-size: 14px;
//   font-weight: 600;
//   color: #111827;
// }

// .chatlist-time {
//   font-size: 11px;
//   color: #9ca3af;
// }

// .chatlist-lastmsg {
//   font-size: 12px;
//   color: #6b7280;
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
// }

// /* Right column – role + ticks */
// .chatlist-right-col {
//   display: flex;
//   flex-direction: column;
//   align-items: flex-end;
//   gap: 6px;
//   margin-left: 8px;
// }

// .chatlist-role {
//   font-size: 11px;
//   color: #9ca3af;
// }

// .chatlist-tick-icon {
//   font-size: 14px;
//   color: #6366f1;
// }

// /* Loading / empty states */
// .chatlist-loading-wrapper {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   padding: 40px 0;
// }

// .chatlist-spinner {
//   width: 26px;
//   height: 26px;
//   border-radius: 999px;
//   border: 3px solid #e5e7eb;
//   border-top-color: #7c3aed;
//   animation: chatlist-spin 0.8s linear infinite;
// }

// .chatlist-empty-inner {
//   padding: 28px 0;
//   text-align: center;
//   font-size: 13px;
//   color: #9ca3af;
// }

// /* Delete modal (same as before, slightly styled) */
// .chatlist-modal-backdrop {
//   position: fixed;
//   inset: 0;
//   background: rgba(15,23,42,0.45);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   z-index: 40;
// }

// .chatlist-modal {
//   width: 320px;
//   background: #ffffff;
//   border-radius: 18px;
//   box-shadow: 0 18px 40px rgba(0,0,0,0.40);
//   padding: 18px 18px 14px;
//   box-sizing: border-box;
// }

// .chatlist-modal-title-row {
//   display: flex;
//   align-items: center;
//   gap: 10px;
//   margin-bottom: 8px;
// }

// .chatlist-modal-title-icon {
//   width: 28px;
//   height: 28px;
//   border-radius: 999px;
//   background: #fef2f2;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// }

// .chatlist-modal-title-text {
//   font-size: 16px;
//   font-weight: 600;
// }

// .chatlist-modal-body {
//   font-size: 14px;
//   color: #4b5563;
//   margin-bottom: 14px;
// }

// .chatlist-modal-actions {
//   display: flex;
//   justify-content: flex-end;
//   gap: 10px;
// }

// .chatlist-btn {
//   padding: 8px 14px;
//   border-radius: 999px;
//   border: none;
//   font-size: 13px;
//   cursor: pointer;
// }

// .chatlist-btn-ghost {
//   background: #f3f4f6;
//   color: #111827;
// }

// .chatlist-btn-danger {
//   background: #ef4444;
//   color: #ffffff;
// }

// /* spinner keyframes */
// @keyframes chatlist-spin {
//   from { transform: rotate(0deg); }
//   to { transform: rotate(360deg); }
// }

// /* Scrollbar subtle */
// .chatlist-list::-webkit-scrollbar {
//   width: 4px;
// }
// .chatlist-list::-webkit-scrollbar-track {
//   background: transparent;
// }
// .chatlist-list::-webkit-scrollbar-thumb {
//   background: #e5e7eb;
//   border-radius: 999px;
// }
// `;

// if (
//   typeof document !== "undefined" &&
//   !document.getElementById("chatlist-screen-styles")
// ) {
//   const style = document.createElement("style");
//   style.id = "chatlist-screen-styles";
//   style.innerHTML = css;
//   document.head.appendChild(style);
// }

// // ---------------- HELPERS ----------------
// function convertTimestampsJS(value) {
//   if (value === null || value === undefined) return value;

//   if (typeof value === "object" && "seconds" in value && "nanoseconds" in value) {
//     return typeof value.toMillis === "function"
//       ? value.toMillis()
//       : value.seconds * 1000;
//   }

//   if (value instanceof Date) return value.getTime();
//   if (Array.isArray(value)) return value.map(convertTimestampsJS);

//   if (typeof value === "object") {
//     const o = {};
//     Object.entries(value).forEach(([k, v]) => {
//       o[k] = convertTimestampsJS(v);
//     });
//     return o;
//   }

//   return value;
// }

// function formatTimeLabel(ts) {
//   if (!ts) return "";
//   const date = new Date(ts);
//   const now = new Date();
//   const diff = now - date;
//   const days = diff / 86400000;

//   if (days < 1)
//     return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
//   if (days < 2) return "Yesterday";
//   if (days < 7) return date.toLocaleDateString([], { weekday: "long" });
//   return date.toLocaleDateString([], { month: "short", day: "numeric" });
// }

// // ------------------------------------------------------------
// //                     MAIN COMPONENT
// // ------------------------------------------------------------

// export default function ChatListScreen({ currentUid: propUid, sharedJob = null }) {
//   const navigate = useNavigate();
//   const currentUid = propUid || auth.currentUser?.uid || null;

//   const [userRole, setUserRole] = useState("");
//   const [search, setSearch] = useState("");
//   const [requestCount, setRequestCount] = useState(0);

//   const [chats, setChats] = useState([]);
//   const [chatItems, setChatItems] = useState([]);
//   const [loadingChats, setLoadingChats] = useState(true);
//   const [chatError, setChatError] = useState("");

//   const [deleteState, setDeleteState] = useState({
//     open: false,
//     chat: null,
//     name: "",
//   });

//   const userCacheRef = useRef({}); // FULL USER PROFILE CACHE

//   // ------------------------------------------------------------
//   //                 LOAD USER ROLE
//   // ------------------------------------------------------------
//   useEffect(() => {
//     if (!currentUid) return;

//     const load = async () => {
//       try {
//         const snap = await getDoc(doc(db, "users", currentUid));
//         if (snap.exists()) {
//           const role = (snap.data().role || "").toLowerCase();
//           setUserRole(role);
//         }
//       } catch (e) {
//         console.log("role error", e);
//       }
//     };

//     load();
//   }, [currentUid]);

//   // ------------------------------------------------------------
//   //             REQUEST COUNT LISTENER
//   // ------------------------------------------------------------
//   useEffect(() => {
//     if (!currentUid) return;

//     const colRef = collection(db, "requests", currentUid, "users");
//     const unsub = onSnapshot(colRef, (s) => setRequestCount(s.size));

//     return () => unsub();
//   }, [currentUid]);

//   // ------------------------------------------------------------
//   //             LISTEN TO ALL CHATS (Realtime DB)
//   // ------------------------------------------------------------
//   useEffect(() => {
//     if (!currentUid || !rtdb) return;

//     setLoadingChats(true);

//     const refUserChats = rRef(rtdb, `userChats/${currentUid}`);
//     let cancelled = false;

//     const unsub = onValue(
//       refUserChats,
//       async (snapshot) => {
//         if (cancelled) return;

//         const val = snapshot.val();
//         if (!val) {
//           setChats([]);
//           setLoadingChats(false);
//           return;
//         }

//         const entries = Object.entries(val);

//         const list = await Promise.all(
//           entries.map(async ([chatId, raw]) => {
//             const withUid = raw.withUid || raw.with || "";
//             let lastMessage = raw.lastMessage || "";
//             let lastMessageTime = raw.lastMessageTime || 0;

//             try {
//               const msgQuery = rQuery(
//                 rRef(rtdb, `chats/${chatId}/messages`),
//                 orderByChild("timestamp"),
//                 limitToLast(1)
//               );

//               const msgSnap = await get(msgQuery);

//               if (msgSnap.exists()) {
//                 const first = Object.values(msgSnap.val())[0];

//                 if (first.type === "job") {
//                   const jobTitle =
//                     first.jobData?.title ||
//                     first.jobData?.sub_category ||
//                     "Job Shared";
//                   lastMessage = `[Job] ${jobTitle}`;
//                 } else {
//                   lastMessage = first.text || "[Attachment]";
//                 }

//                 lastMessageTime = first.timestamp || lastMessageTime;
//               }
//             } catch (e) {
//               console.log("msg error", e);
//             }

//             return { chatId, withUid, lastMessage, lastMessageTime };
//           })
//         );

//         const sorted = list.sort(
//           (a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0)
//         );

//         setChats(sorted);
//         setLoadingChats(false);
//       },
//       (err) => {
//         console.log("listen error", err);
//         if (!cancelled) {
//           setChats([]);
//           setLoadingChats(false);
//           setChatError("Error loading chats");
//         }
//       }
//     );

//     return () => {
//       cancelled = true;
//       unsub();
//     };
//   }, [currentUid]);

//   // ------------------------------------------------------------
//   //                FETCH USER DATA FOR EACH CHAT
//   // ------------------------------------------------------------
//   useEffect(() => {
//     const load = async () => {
//       if (!chats.length) return setChatItems([]);

//       const res = await Promise.all(
//         chats.map(async (chat) => {
//           if (!chat.withUid) return null;

//           if (!userCacheRef.current[chat.withUid]) {
//             const snap = await getDoc(doc(db, "users", chat.withUid));
//             userCacheRef.current[chat.withUid] = snap.exists()
//               ? snap.data()
//               : {};
//           }

//           return { chat, userData: userCacheRef.current[chat.withUid] };
//         })
//       );

//       setChatItems(res.filter(Boolean));
//     };

//     load();
//   }, [chats]);

//   // ------------------------------------------------------------
//   //                       SEARCH FILTER
//   // ------------------------------------------------------------
//   function filteredChatItems() {
//     let list = chatItems;

//     list = list.filter(
//       (i) => !String(i.chat.lastMessage || "").startsWith("[Job]")
//     );

//     if (!search.trim()) return list;

//     const q = search.trim().toLowerCase();

//     return list.filter((i) => {
//       const full = `${i.userData.firstName || ""} ${
//         i.userData.lastName || ""
//       }`
//         .trim()
//         .toLowerCase();
//       return full.includes(q);
//     });
//   }

//   // ------------------------------------------------------------
//   //          SHARE JOB MESSAGE (IF SHAREDJOB EXISTS)
//   // ------------------------------------------------------------
//   async function sendJobMessageToChat(chatId, receiverId, job) {
//     try {
//       const now = Date.now();
//       const msgId = uuidv4();

//       const msgRef = rRef(rtdb, `chats/${chatId}/messages/${msgId}`);

//       await rSet(msgRef, {
//         id: msgId,
//         type: "job",
//         jobData: convertTimestampsJS(job),
//         senderId: currentUid,
//         receiverId,
//         timestamp: now,
//         status: "sent",
//       });

//       const title = job.title || job.sub_category || "Job";
//       const text = `[Job] ${title}`;

//       const updates = {};
//       updates[`userChats/${currentUid}/${chatId}`] = {
//         withUid: receiverId,
//         lastMessage: text,
//         lastMessageTime: now,
//       };
//       updates[`userChats/${receiverId}/${chatId}`] = {
//         withUid: currentUid,
//         lastMessage: text,
//         lastMessageTime: now,
//       };

//       await rUpdate(rRef(rtdb), updates);
//     } catch (e) {
//       console.log("job share error", e);
//     }
//   }

//   // ------------------------------------------------------------
//   //                       DELETE CHAT
//   // ------------------------------------------------------------
//   async function deleteChat(chat) {
//     await rRemove(rRef(rtdb, `userChats/${currentUid}/${chat.chatId}`));
//     await rRemove(rRef(rtdb, `chats/${chat.chatId}`));
//     setDeleteState({ open: false, chat: null, name: "" });
//   }

//   // ------------------------------------------------------------
//   //                       RENDER
//   // ------------------------------------------------------------

//   if (!currentUid) {
//     return (
//       <div className="chatlist-page">
//         <div className="chatlist-card">
//           <div className="chatlist-loading-wrapper">
//             Login to see messages
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const list = filteredChatItems();

//   return (
//     <>
//       {/* Delete Modal */}
//       {deleteState.open && (
//         <div className="chatlist-modal-backdrop">
//           <div className="chatlist-modal">
//             <div className="chatlist-modal-title-row">
//               <div className="chatlist-modal-title-icon">🗑</div>
//               <div className="chatlist-modal-title-text">Delete Chat</div>
//             </div>
//             <div className="chatlist-modal-body">
//               Delete chat with <b>{deleteState.name}</b>?
//             </div>
//             <div className="chatlist-modal-actions">
//               <button
//                 className="chatlist-btn chatlist-btn-ghost"
//                 onClick={() =>
//                   setDeleteState({ open: false, chat: null, name: "" })
//                 }
//               >
//                 Cancel
//               </button>
//               <button
//                 className="chatlist-btn chatlist-btn-danger"
//                 onClick={() => deleteChat(deleteState.chat)}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Layout */}
//       <div className="chatlist-page">
//         <div className="chatlist-card">
//           {/* Header */}
//           <div className="chatlist-header">
//             <button
//               className="chatlist-back-btn"
//               onClick={() => navigate(-1)}
//             >
//               <span className="chatlist-back-icon" />
//             </button>

//             <div className="chatlist-title-wrapper">
//               <div className="chatlist-title">Message</div>
//             </div>
//           </div>

//           {/* Search */}
//           <div className="chatlist-search-wrapper">
//             <div className="chatlist-search-wrapper-inner">
//               <span className="chatlist-search-icon">🔍</span>
//               <input
//                 className="chatlist-search-input"
//                 placeholder="Search"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//               {search.trim() && (
//                 <span
//                   className="chatlist-search-clear"
//                   onClick={() => setSearch("")}
//                 >
//                   ✕
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Requests */}
//           {userRole === "freelancer" && (
//             <div className="chatlist-request-row">
//               <div
//                 className="chatlist-request-pill"
//                 onClick={() =>
//                   navigate("/request-chats", { state: { currentUid } })
//                 }
//               >
//                 <span className="chatlist-request-text">Request</span>
//                 {requestCount > 0 && (
//                   <span className="chatlist-request-badge">
//                     ({requestCount})
//                   </span>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Chat List */}
//           <div className="chatlist-list">
//             {loadingChats ? (
//               <div className="chatlist-loading-wrapper">
//                 <div className="chatlist-spinner" />
//               </div>
//             ) : chatError ? (
//               <div className="chatlist-empty-inner">Error loading chats</div>
//             ) : !list.length ? (
//               <div className="chatlist-empty-inner">No messages</div>
//             ) : (
//               list.map(({ chat, userData }) => {
//                 const name = `${userData.firstName || ""} ${
//                   userData.lastName || ""
//                 }`.trim();
//                 const imageUrl = userData.profileImage || "";
//                 const time = formatTimeLabel(chat.lastMessageTime);

//                 const onRowClick = async () => {
//                   if (sharedJob) {
//                     await sendJobMessageToChat(
//                       chat.chatId,
//                       chat.withUid,
//                       sharedJob
//                     );
//                     alert("Job shared");
//                     navigate(-1);
//                     return;
//                   }

//                   navigate("/client-dashbroad2/chat", {
//                     state: {
//                       currentUid,
//                       otherUid: chat.withUid,
//                       otherProfile: userData,
//                       otherName: name,
//                       otherImage: imageUrl,
//                     },
//                   });
//                 };

//                 return (
//                   <div
//                     key={chat.chatId}
//                     className="chatlist-item"
//                     onClick={onRowClick}
//                   >
//                     <div className="chatlist-avatar-wrapper">
//                       <img
//                         src={
//                           imageUrl || "https://i.ibb.co/sqsJwP0/user.png"
//                         }
//                         className="chatlist-avatar"
//                         alt="profile"
//                       />
//                     </div>

//                     <div className="chatlist-item-content">
//                       <div className="chatlist-name-row">
//                         <div className="chatlist-name">
//                           {name || "User"}
//                         </div>
//                         <div className="chatlist-time">{time}</div>
//                       </div>
//                       <div className="chatlist-lastmsg">
//                         {chat.lastMessage || "No messages yet"}
//                       </div>
//                     </div>

//                     <div className="chatlist-right-col">
//                       <div className="chatlist-role">Agents</div>
//                       <div className="chatlist-tick-icon">✓✓</div>
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";

// import { db, auth, rtdb } from "../../firbase/Firebase";

// import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";

// import {
//   ref as rRef,
//   onValue,
//   get,
//   query as rQuery,
//   orderByChild,
//   limitToLast,
//   update as rUpdate,
//   set as rSet,
//   remove as rRemove,
// } from "firebase/database";

// import { v4 as uuidv4 } from "uuid";
// import search1 from "../../assets/search.png"

// // ---------------- CSS INJECTION (NEW UI) ----------------
// const css = `
// .chatlist-page {
//   min-height: 100vh;
//   width: 100vw;
//   display: flex;
//   justify-content: center;
//   align-items: flex-start;
//   padding: 32px 16px;
//   background: radial-gradient(circle at 0% 0%, #fff9c7 0%, #ffffff 40%, #f7f0ff 100%);
//   font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
//   box-sizing: border-box;
// }

// /* Wrapper that holds header + search + white card */
// .chatlist-shell {
//   width: 420px;
//   max-width: 100%;
// }

// /* Main white card (ONLY list area like in screenshot) */
// .chatlist-card {
//   width: 100%;
//   background: #ffffff;
//   border-radius: 28px;
//   padding: 18px 18px 16px;
//   margin-top: 18px;
//   box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
//   box-sizing: border-box;
// }

// /* Header row (on yellow bg, outside card) */
// .chatlist-header {
//   display: flex;
//   align-items: center;
//   gap: 12px;
//   margin-bottom: 20px;
// }

// .chatlist-back-btn {
//   width: 36px;
//   height: 36px;
//   border-radius: 999px;
//   border: none;
//   background: #ffffff;
//   box-shadow: 0 5px 18px rgba(0,0,0,0.18);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   cursor: pointer;
// }

// .chatlist-back-icon {
//   width: 0;
//   height: 0;
//   border-top: 5px solid transparent;
//   border-bottom: 5px solid transparent;
//   border-right: 7px solid #111827;
//   transform: translateX(-1px);
// }

// .chatlist-title-wrapper {
//   display: flex;
//   flex-direction: column;
// }

// .chatlist-title {
//   font-size: 28px;
//   font-weight: 700;
//   color: #111827;
// }

// /* Search bar (separate floating bar like screenshot) */
// .chatlist-search-wrapper {
//   margin-bottom: 8px;
// }

// .chatlist-search-wrapper-inner {
//   display: flex;
//   align-items: center;
//   gap: 10px;
//   background: #fffef2;
//   border-radius: 20px;
//   padding: 11px 16px;
//   box-shadow: 0 10px 26px rgba(0,0,0,0.14);
// }

// .chatlist-search-icon {
//   font-size: 16px;
//   opacity: 0.6;
// }

// .chatlist-search-input {
//   flex: 1;
//   border: none;
//   outline: none;
//   font-size: 14px;
//   color: #111827;
//   background: transparent;
// }

// .chatlist-search-input::placeholder {
//   color: #9ca3af;
// }

// .chatlist-search-clear {
//   font-size: 14px;
//   cursor: pointer;
//   opacity: 0.5;
// }

// /* Request text on right top of list (inside white card) */
// .chatlist-request-row {
//   display: flex;
//   justify-content: flex-end;
//   align-items: center;
//   margin-bottom: 8px;
// }

// .chatlist-request-pill {
//   font-size: 13px;
//   font-weight: 600;
//   color: #7c3aed;
//   cursor: pointer;
// }

// .chatlist-request-text::after {
//   content: "";
// }

// /* (1) style */
// .chatlist-request-badge {
//   margin-left: 2px;
// }

// /* List area */
// .chatlist-list {
//   max-height: 520px;
//   overflow-y: auto;
//   padding: 4px 4px 4px 2px;
// }

// /* Single row */
// .chatlist-item {
//   display: flex;
//   align-items: center;
//   padding: 12px 4px;
//   border-bottom: 1px solid #eef0f4;
//   cursor: pointer;
// }

// .chatlist-avatar-wrapper {
//   margin-right: 10px;
// }

// .chatlist-avatar {
//   width: 40px;
//   height: 40px;
//   border-radius: 999px;
//   object-fit: cover;
//   box-shadow: 0 4px 10px rgba(0,0,0,0.12);
// }

// .chatlist-item-content {
//   flex: 1;
//   display: flex;
//   flex-direction: column;
//   gap: 3px;
// }

// .chatlist-name-row {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
// }

// .chatlist-name {
//   font-size: 14px;
//   font-weight: 600;
//   color: #111827;
// }

// .chatlist-time {
//   font-size: 11px;
//   color: #9ca3af;
// }

// .chatlist-lastmsg {
//   font-size: 12px;
//   color: #6b7280;
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
// }

// /* Right column – role + ticks */
// .chatlist-right-col {
//   display: flex;
//   flex-direction: column;
//   align-items: flex-end;
//   gap: 6px;
//   margin-left: 8px;
// }

// .chatlist-role {
//   font-size: 11px;
//   color: #9ca3af;
// }

// .chatlist-tick-icon {
//   font-size: 14px;
//   color: #6366f1;
// }

// /* Loading / empty states */
// .chatlist-loading-wrapper {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   padding: 40px 0;
// }

// .chatlist-spinner {
//   width: 26px;
//   height: 26px;
//   border-radius: 999px;
//   border: 3px solid #e5e7eb;
//   border-top-color: #7c3aed;
//   animation: chatlist-spin 0.8s linear infinite;
// }

// .chatlist-empty-inner {
//   padding: 28px 0;
//   text-align: center;
//   font-size: 13px;
//   color: #9ca3af;
// }

// /* Delete modal */
// .chatlist-modal-backdrop {
//   position: fixed;
//   inset: 0;
//   background: rgba(15,23,42,0.45);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   z-index: 40;
// }

// .chatlist-modal {
//   width: 320px;
//   background: #ffffff;
//   border-radius: 18px;
//   box-shadow: 0 18px 40px rgba(0,0,0,0.40);
//   padding: 18px 18px 14px;
//   box-sizing: border-box;
// }

// .chatlist-modal-title-row {
//   display: flex;
//   align-items: center;
//   gap: 10px;
//   margin-bottom: 8px;
// }

// .chatlist-modal-title-icon {
//   width: 28px;
//   height: 28px;
//   border-radius: 999px;
//   background: #fef2f2;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// }

// .chatlist-modal-title-text {
//   font-size: 16px;
//   font-weight: 600;
// }

// .chatlist-modal-body {
//   font-size: 14px;
//   color: #4b5563;
//   margin-bottom: 14px;
// }

// .chatlist-modal-actions {
//   display: flex;
//   justify-content: flex-end;
//   gap: 10px;
// }

// .chatlist-btn {
//   padding: 8px 14px;
//   border-radius: 999px;
//   border: none;
//   font-size: 13px;
//   cursor: pointer;
// }

// .chatlist-btn-ghost {
//   background: #f3f4f6;
//   color: #111827;
// }

// .chatlist-btn-danger {
//   background: #ef4444;
//   color: #ffffff;
// }

// /* spinner keyframes */
// @keyframes chatlist-spin {
//   from { transform: rotate(0deg); }
//   to { transform: rotate(360deg); }
// }

// /* Scrollbar subtle */
// .chatlist-list::-webkit-scrollbar {
//   width: 4px;
// }
// .chatlist-list::-webkit-scrollbar-track {
//   background: transparent;
// }
// .chatlist-list::-webkit-scrollbar-thumb {
//   background: #e5e7eb;
//   border-radius: 999px;
// }
// `;

// if (
//   typeof document !== "undefined" &&
//   !document.getElementById("chatlist-screen-styles")
// ) {
//   const style = document.createElement("style");
//   style.id = "chatlist-screen-styles";
//   style.innerHTML = css;
//   document.head.appendChild(style);
// }

// // ---------------- HELPERS ----------------
// function convertTimestampsJS(value) {
//   if (value === null || value === undefined) return value;

//   if (typeof value === "object" && "seconds" in value && "nanoseconds" in value) {
//     return typeof value.toMillis === "function"
//       ? value.toMillis()
//       : value.seconds * 1000;
//   }

//   if (value instanceof Date) return value.getTime();
//   if (Array.isArray(value)) return value.map(convertTimestampsJS);

//   if (typeof value === "object") {
//     const o = {};
//     Object.entries(value).forEach(([k, v]) => {
//       o[k] = convertTimestampsJS(v);
//     });
//     return o;
//   }

//   return value;
// }

// function formatTimeLabel(ts) {
//   if (!ts) return "";
//   const date = new Date(ts);
//   const now = new Date();
//   const diff = now - date;
//   const days = diff / 86400000;

//   if (days < 1)
//     return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
//   if (days < 2) return "Yesterday";
//   if (days < 7) return date.toLocaleDateString([], { weekday: "long" });
//   return date.toLocaleDateString([], { month: "short", day: "numeric" });
// }

// // ------------------------------------------------------------
// //                     MAIN COMPONENT
// // ------------------------------------------------------------

// export default function ChatListScreen({ currentUid: propUid, sharedJob = null }) {
//   const navigate = useNavigate();
//   const currentUid = propUid || auth.currentUser?.uid || null;

//   const [userRole, setUserRole] = useState("");
//   const [search, setSearch] = useState("");
//   const [requestCount, setRequestCount] = useState(0);

//   const [chats, setChats] = useState([]);
//   const [chatItems, setChatItems] = useState([]);
//   const [loadingChats, setLoadingChats] = useState(true);
//   const [chatError, setChatError] = useState("");

//   const [deleteState, setDeleteState] = useState({
//     open: false,
//     chat: null,
//     name: "",
//   });

//   const userCacheRef = useRef({}); // FULL USER PROFILE CACHE

//   // ------------------------------------------------------------
//   //                 LOAD USER ROLE
//   // ------------------------------------------------------------
//   useEffect(() => {
//     if (!currentUid) return;

//     const load = async () => {
//       try {
//         const snap = await getDoc(doc(db, "users", currentUid));
//         if (snap.exists()) {
//           const role = (snap.data().role || "").toLowerCase();
//           setUserRole(role);
//         }
//       } catch (e) {
//         console.log("role error", e);
//       }
//     };

//     load();
//   }, [currentUid]);

//   // ------------------------------------------------------------
//   //             REQUEST COUNT LISTENER
//   // ------------------------------------------------------------
//   useEffect(() => {
//     if (!currentUid) return;

//     const colRef = collection(db, "requests", currentUid, "users");
//     const unsub = onSnapshot(colRef, (s) => setRequestCount(s.size));

//     return () => unsub();
//   }, [currentUid]);

//   // ------------------------------------------------------------
//   //             LISTEN TO ALL CHATS (Realtime DB)
//   // ------------------------------------------------------------
//   useEffect(() => {
//     if (!currentUid || !rtdb) return;

//     setLoadingChats(true);

//     const refUserChats = rRef(rtdb, `userChats/${currentUid}`);
//     let cancelled = false;

//     const unsub = onValue(
//       refUserChats,
//       async (snapshot) => {
//         if (cancelled) return;

//         const val = snapshot.val();
//         if (!val) {
//           setChats([]);
//           setLoadingChats(false);
//           return;
//         }

//         const entries = Object.entries(val);

//         const list = await Promise.all(
//           entries.map(async ([chatId, raw]) => {
//             const withUid = raw.withUid || raw.with || "";
//             let lastMessage = raw.lastMessage || "";
//             let lastMessageTime = raw.lastMessageTime || 0;

//             try {
//               const msgQuery = rQuery(
//                 rRef(rtdb, `chats/${chatId}/messages`),
//                 orderByChild("timestamp"),
//                 limitToLast(1)
//               );

//               const msgSnap = await get(msgQuery);

//               if (msgSnap.exists()) {
//                 const first = Object.values(msgSnap.val())[0];

//                 if (first.type === "job") {
//                   const jobTitle =
//                     first.jobData?.title ||
//                     first.jobData?.sub_category ||
//                     "Job Shared";
//                   lastMessage = `[Job] ${jobTitle}`;
//                 } else {
//                   lastMessage = first.text || "[Attachment]";
//                 }

//                 lastMessageTime = first.timestamp || lastMessageTime;
//               }
//             } catch (e) {
//               console.log("msg error", e);
//             }

//             return { chatId, withUid, lastMessage, lastMessageTime };
//           })
//         );

//         const sorted = list.sort(
//           (a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0)
//         );

//         setChats(sorted);
//         setLoadingChats(false);
//       },
//       (err) => {
//         console.log("listen error", err);
//         if (!cancelled) {
//           setChats([]);
//           setLoadingChats(false);
//           setChatError("Error loading chats");
//         }
//       }
//     );

//     return () => {
//       cancelled = true;
//       unsub();
//     };
//   }, [currentUid]);

//   // ------------------------------------------------------------
//   //                FETCH USER DATA FOR EACH CHAT
//   // ------------------------------------------------------------
//   useEffect(() => {
//     const load = async () => {
//       if (!chats.length) return setChatItems([]);

//       const res = await Promise.all(
//         chats.map(async (chat) => {
//           if (!chat.withUid) return null;

//           if (!userCacheRef.current[chat.withUid]) {
//             const snap = await getDoc(doc(db, "users", chat.withUid));
//             userCacheRef.current[chat.withUid] = snap.exists()
//               ? snap.data()
//               : {};
//           }

//           return { chat, userData: userCacheRef.current[chat.withUid] };
//         })
//       );

//       setChatItems(res.filter(Boolean));
//     };

//     load();
//   }, [chats]);

//   // ------------------------------------------------------------
//   //                       SEARCH FILTER
//   // ------------------------------------------------------------
//   function filteredChatItems() {
//     let list = chatItems;

//     list = list.filter(
//       (i) => !String(i.chat.lastMessage || "").startsWith("[Job]")
//     );

//     if (!search.trim()) return list;

//     const q = search.trim().toLowerCase();

//     return list.filter((i) => {
//       const full = `${i.userData.firstName || ""} ${
//         i.userData.lastName || ""
//       }`
//         .trim()
//         .toLowerCase();
//       return full.includes(q);
//     });
//   }

//   // ------------------------------------------------------------
//   //          SHARE JOB MESSAGE (IF SHAREDJOB EXISTS)
//   // ------------------------------------------------------------
//   async function sendJobMessageToChat(chatId, receiverId, job) {
//     try {
//       const now = Date.now();
//       const msgId = uuidv4();

//       const msgRef = rRef(rtdb, `chats/${chatId}/messages/${msgId}`);

//       await rSet(msgRef, {
//         id: msgId,
//         type: "job",
//         jobData: convertTimestampsJS(job),
//         senderId: currentUid,
//         receiverId,
//         timestamp: now,
//         status: "sent",
//       });

//       const title = job.title || job.sub_category || "Job";
//       const text = `[Job] ${title}`;

//       const updates = {};
//       updates[`userChats/${currentUid}/${chatId}`] = {
//         withUid: receiverId,
//         lastMessage: text,
//         lastMessageTime: now,
//       };
//       updates[`userChats/${receiverId}/${chatId}`] = {
//         withUid: currentUid,
//         lastMessage: text,
//         lastMessageTime: now,
//       };

//       await rUpdate(rRef(rtdb), updates);
//     } catch (e) {
//       console.log("job share error", e);
//     }
//   }

//   // ------------------------------------------------------------
//   //                       DELETE CHAT
//   // ------------------------------------------------------------
//   async function deleteChat(chat) {
//     await rRemove(rRef(rtdb, `userChats/${currentUid}/${chat.chatId}`));
//     await rRemove(rRef(rtdb, `chats/${chat.chatId}`));
//     setDeleteState({ open: false, chat: null, name: "" });
//   }

//   // ------------------------------------------------------------
//   //                       RENDER
//   // ------------------------------------------------------------

//   const list = filteredChatItems();

//   if (!currentUid) {
//     return (
//       <div className="chatlist-page">
//         <div className="chatlist-shell">
//           <div className="chatlist-header">
//             <button
//               className="chatlist-back-btn"
//               onClick={() => navigate(-1)}
//             >
//               <span className="chatlist-back-icon" />
//             </button>
//             <div className="chatlist-title-wrapper">
//               <div className="chatlist-title">Message</div>
//             </div>
//           </div>

//           <div className="chatlist-search-wrapper">
//             <div className="chatlist-search-wrapper-inner">
//               <span className="chatlist-search-icon">🔍</span>
//               <input
//                 className="chatlist-search-input"
//                 placeholder="Search"
//                 disabled
//               />
//             </div>
//           </div>

//           <div className="chatlist-card">
//             <div className="chatlist-loading-wrapper">
//               Login to see messages
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Delete Modal */}
//       {deleteState.open && (
//         <div className="chatlist-modal-backdrop">
//           <div className="chatlist-modal">
//             <div className="chatlist-modal-title-row">
//               <div className="chatlist-modal-title-icon">🗑</div>
//               <div className="chatlist-modal-title-text">Delete Chat</div>
//             </div>
//             <div className="chatlist-modal-body">
//               Delete chat with <b>{deleteState.name}</b>?
//             </div>
//             <div className="chatlist-modal-actions">
//               <button
//                 className="chatlist-btn chatlist-btn-ghost"
//                 onClick={() =>
//                   setDeleteState({ open: false, chat: null, name: "" })
//                 }
//               >
//                 Cancel
//               </button>
//               <button
//                 className="chatlist-btn chatlist-btn-danger"
//                 onClick={() => deleteChat(deleteState.chat)}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Layout */}
//       <div className="chatlist-page">
//         <div className="chatlist-shell">
//           {/* Header on gradient */}
//           <div className="chatlist-header">
//             <button
//               className="chatlist-back-btn"
//               onClick={() => navigate(-1)}
//             >
//               <span className="chatlist-back-icon" />
//             </button>

//             <div className="chatlist-title-wrapper">
//               <div className="chatlist-title">Message</div>
//             </div>
//           </div>

//           {/* Search on gradient */}
//           <div className="chatlist-search-wrapper">
//             <div className="chatlist-search-wrapper-inner">
//               <span className="chatlist-search-icon"><img src={search1} style={{width:"18px"}} alt="searh1" /></span>
//               <input
//                 className="chatlist-search-input"
//                 placeholder="Search"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//               {search.trim() && (
//                 <span
//                   className="chatlist-search-clear"
//                   onClick={() => setSearch("")}
//                 >
//                   ✕
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* White Card with Request + List */}
//           <div className="chatlist-card">
//             {userRole === "freelancer" && (
//               <div className="chatlist-request-row">
//                 <div
//                   className="chatlist-request-pill"
//                   onClick={() =>
//                     navigate("/request-chats", { state: { currentUid } })
//                   }
//                 >
//                   <span className="chatlist-request-text">Request</span>
//                   {requestCount > 0 && (
//                     <span className="chatlist-request-badge">
//                       ({requestCount})
//                     </span>
//                   )}
//                 </div>
//               </div>
//             )}

//             <div className="chatlist-list">
//               {loadingChats ? (
//                 <div className="chatlist-loading-wrapper">
//                   <div className="chatlist-spinner" />
//                 </div>
//               ) : chatError ? (
//                 <div className="chatlist-empty-inner">Error loading chats</div>
//               ) : !list.length ? (
//                 <div className="chatlist-empty-inner">No messages</div>
//               ) : (
//                 list.map(({ chat, userData }) => {
//                   const name = `${userData.firstName || ""} ${
//                     userData.lastName || ""
//                   }`.trim();
//                   const imageUrl = userData.profileImage || "";
//                   const time = formatTimeLabel(chat.lastMessageTime);

//                   const onRowClick = async () => {
//                     if (sharedJob) {
//                       await sendJobMessageToChat(
//                         chat.chatId,
//                         chat.withUid,
//                         sharedJob
//                       );
//                       alert("Job shared");
//                       navigate(-1);
//                       return;
//                     }

//                     navigate("/chat", {
//                       state: {
//                         currentUid,
//                         otherUid: chat.withUid,
//                         otherProfile: userData,
//                         otherName: name,
//                         otherImage: imageUrl,
//                       },
//                     });
//                   };

//                   return (
//                     <div
//                       key={chat.chatId}
//                       className="chatlist-item"
//                       onClick={onRowClick}
//                     >
//                       <div className="chatlist-avatar-wrapper">
//                         <img
//                           src={
//                             imageUrl || "https://i.ibb.co/sqsJwP0/user.png"
//                           }
//                           className="chatlist-avatar"
//                           alt="profile"
//                         />
//                       </div>

//                       <div className="chatlist-item-content">
//                         <div className="chatlist-name-row">
//                           <div className="chatlist-name">
//                             {name || "User"}
//                           </div>
//                           <div className="chatlist-time">{time}</div>
//                         </div>
//                         <div className="chatlist-lastmsg">
//                           {chat.lastMessage || "No messages yet"}
//                         </div>
//                       </div>

//                       <div className="chatlist-right-col">
//                         <div className="chatlist-role">Agents</div>
//                         <div className="chatlist-tick-icon">✓✓</div>
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }



// frontend/src/Chat/ChatListScreen.jsx
// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";

// import { db, auth, rtdb } from "../../firbase/Firebase";

// import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";

// import {
//   ref as rRef,
//   onValue,
//   get,
//   query as rQuery,
//   orderByChild,
//   limitToLast,
//   update as rUpdate,
//   set as rSet,
//   remove as rRemove,
// } from "firebase/database";

// import { v4 as uuidv4 } from "uuid";
// import search1 from "../../assets/search.png";

// // ---------------- CSS INJECTION (NEW UI) ----------------
// const css = `
// .chatlist-page {
//   min-height: 100vh;
//   width: 100vw;
//   display: flex;
//   justify-content: center;
//   align-items: flex-start;
//   padding: 32px 16px;
//   box-sizing: border-box;
//   background: linear-gradient(180deg, #fff4b8 0%, #ffffff 45%, #f7f0ff 100%);
//   font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
// }

// /* Wrapper that holds header + search + white card */
// .chatlist-shell {
//   width: 420px;
//   max-width: 100%;
// }

// /* Main white card (ONLY list area like in screenshot) */
// .chatlist-card {
//   width: 100%;
//   background: #ffffff;
//   border-radius: 28px;
//   padding: 18px 18px 16px;
//   margin-top: 22px;
//   box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
//   box-sizing: border-box;
// }

// /* Header row (on yellow bg, outside card) */
// .chatlist-header {
//   display: flex;
//   align-items: center;
//   gap: 12px;
//   margin-bottom: 20px;
// }

// .chatlist-back-btn {
//   width: 36px;
//   height: 36px;
//   border-radius: 999px;
//   border: none;
//   background: #ffffff;
//   box-shadow: 0 5px 18px rgba(0,0,0,0.18);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   cursor: pointer;
// }

// .chatlist-back-icon {
//   width: 0;
//   height: 0;
//   border-top: 5px solid transparent;
//   border-bottom: 5px solid transparent;
//   border-right: 7px solid #111827;
//   transform: translateX(-1px);
// }

// .chatlist-title-wrapper {
//   display: flex;
//   flex-direction: column;
// }

// .chatlist-title {
//   font-size: 28px;
//   font-weight: 700;
//   color: #111827;
// }

// /* Search bar (floating card like screenshot) */
// .chatlist-search-wrapper {
//   margin-bottom: 10px;
// }

// .chatlist-search-wrapper-inner {
//   display: flex;
//   align-items: center;
//   gap: 10px;
//   background: #fffef2;
//   border-radius: 20px;
//   padding: 11px 16px;
//   box-shadow: 0 10px 26px rgba(0,0,0,0.14);
// }

// .chatlist-search-icon img {
//   display: block;
// }

// .chatlist-search-input {
//   flex: 1;
//   border: none;
//   outline: none;
//   font-size: 14px;
//   color: #111827;
//   background: transparent;
// }

// .chatlist-search-input::placeholder {
//   color: #9ca3af;
// }

// .chatlist-search-clear {
//   font-size: 14px;
//   cursor: pointer;
//   opacity: 0.5;
// }

// /* Request text on right top of list (inside white card) */
// .chatlist-request-row {
//   display: flex;
//   justify-content: flex-end;
//   align-items: center;
//   margin-bottom: 8px;
// }

// .chatlist-request-pill {
//   font-size: 13px;
//   font-weight: 600;
//   color: #7c3aed;
//   cursor: pointer;
// }

// /* List area */
// .chatlist-list {
//   max-height: 520px;
//   overflow-y: auto;
//   padding: 4px 4px 4px 2px;
// }

// /* Single row */
// .chatlist-item {
//   display: flex;
//   align-items: center;
//   padding: 12px 4px;
//   border-bottom: 1px solid #eef0f4;
//   cursor: pointer;
// }

// .chatlist-avatar-wrapper {
//   margin-right: 10px;
// }

// .chatlist-avatar {
//   width: 40px;
//   height: 40px;
//   border-radius: 999px;
//   object-fit: cover;
//   box-shadow: 0 4px 10px rgba(0,0,0,0.12);
// }

// .chatlist-item-content {
//   flex: 1;
//   display: flex;
//   flex-direction: column;
//   gap: 3px;
// }

// .chatlist-name-row {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
// }

// .chatlist-name {
//   font-size: 14px;
//   font-weight: 600;
//   color: #111827;
// }

// .chatlist-time {
//   font-size: 11px;
//   color: #9ca3af;
// }

// .chatlist-lastmsg {
//   font-size: 12px;
//   color: #6b7280;
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
// }

// /* Right column – role + ticks */
// .chatlist-right-col {
//   display: flex;
//   flex-direction: column;
//   align-items: flex-end;
//   gap: 6px;
//   margin-left: 8px;
// }

// .chatlist-role {
//   font-size: 11px;
//   color: #9ca3af;
// }

// .chatlist-tick-icon {
//   font-size: 14px;
// }

// /* Loading / empty states */
// .chatlist-loading-wrapper {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   padding: 40px 0;
// }

// .chatlist-spinner {
//   width: 26px;
//   height: 26px;
//   border-radius: 999px;
//   border: 3px solid #e5e7eb;
//   border-top-color: #7c3aed;
//   animation: chatlist-spin 0.8s linear infinite;
// }

// .chatlist-empty-inner {
//   padding: 28px 0;
//   text-align: center;
//   font-size: 13px;
//   color: #9ca3af;
// }

// /* Delete modal */
// .chatlist-modal-backdrop {
//   position: fixed;
//   inset: 0;
//   background: rgba(15,23,42,0.45);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   z-index: 40;
// }

// .chatlist-modal {
//   width: 320px;
//   background: #ffffff;
//   border-radius: 18px;
//   box-shadow: 0 18px 40px rgba(0,0,0,0.40);
//   padding: 18px 18px 14px;
//   box-sizing: border-box;
// }

// .chatlist-modal-title-row {
//   display: flex;
//   align-items: center;
//   gap: 10px;
//   margin-bottom: 8px;
// }

// .chatlist-modal-title-icon {
//   width: 28px;
//   height: 28px;
//   border-radius: 999px;
//   background: #fef2f2;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// }

// .chatlist-modal-title-text {
//   font-size: 16px;
//   font-weight: 600;
// }

// .chatlist-modal-body {
//   font-size: 14px;
//   color: #4b5563;
//   margin-bottom: 14px;
// }

// .chatlist-modal-actions {
//   display: flex;
//   justify-content: flex-end;
//   gap: 10px;
// }

// .chatlist-btn {
//   padding: 8px 14px;
//   border-radius: 999px;
//   border: none;
//   font-size: 13px;
//   cursor: pointer;
// }

// .chatlist-btn-ghost {
//   background: #f3f4f6;
//   color: #111827;
// }

// .chatlist-btn-danger {
//   background: #ef4444;
//   color: #ffffff;
// }

// /* spinner keyframes */
// @keyframes chatlist-spin {
//   from { transform: rotate(0deg); }
//   to { transform: rotate(360deg); }
// }

// /* Scrollbar subtle */
// .chatlist-list::-webkit-scrollbar {
//   width: 4px;
// }
// .chatlist-list::-webkit-scrollbar-track {
//   background: transparent;
// }
// .chatlist-list::-webkit-scrollbar-thumb {
//   background: #e5e7eb;
//   border-radius: 999px;
// }
// `;

// if (
//   typeof document !== "undefined" &&
//   !document.getElementById("chatlist-screen-styles")
// ) {
//   const style = document.createElement("style");
//   style.id = "chatlist-screen-styles";
//   style.innerHTML = css;
//   document.head.appendChild(style);
// }

// // ---------------- HELPERS ----------------
// function convertTimestampsJS(value) {
//   if (value === null || value === undefined) return value;

//   if (typeof value === "object" && "seconds" in value && "nanoseconds" in value) {
//     return typeof value.toMillis === "function"
//       ? value.toMillis()
//       : value.seconds * 1000;
//   }

//   if (value instanceof Date) return value.getTime();
//   if (Array.isArray(value)) return value.map(convertTimestampsJS);

//   if (typeof value === "object") {
//     const o = {};
//     Object.entries(value).forEach(([k, v]) => {
//       o[k] = convertTimestampsJS(v);
//     });
//     return o;
//   }

//   return value;
// }

// function formatTimeLabel(ts) {
//   if (!ts) return "";
//   const date = new Date(ts);
//   const now = new Date();
//   const diff = now - date;
//   const days = diff / 86400000;

//   if (days < 1)
//     return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
//   if (days < 2) return "Yesterday";
//   if (days < 7) return date.toLocaleDateString([], { weekday: "long" });
//   return date.toLocaleDateString([], { month: "short", day: "numeric" });
// }

// // ------------------------------------------------------------
// //                     MAIN COMPONENT
// // ------------------------------------------------------------

// export default function ChatListScreen({ currentUid: propUid, sharedJob = null }) {
//   const navigate = useNavigate();
//   const currentUid = propUid || auth.currentUser?.uid || null;

//   const [userRole, setUserRole] = useState("");
//   const [search, setSearch] = useState("");
//   const [requestCount, setRequestCount] = useState(0);

//   const [chats, setChats] = useState([]);
//   const [chatItems, setChatItems] = useState([]);
//   const [loadingChats, setLoadingChats] = useState(true);
//   const [chatError, setChatError] = useState("");

//   const [deleteState, setDeleteState] = useState({
//     open: false,
//     chat: null,
//     name: "",
//   });

//   const userCacheRef = useRef({}); // FULL USER PROFILE CACHE

//   // ------------------------------------------------------------
//   //                 LOAD USER ROLE
//   // ------------------------------------------------------------
//   useEffect(() => {
//     if (!currentUid) return;

//     const load = async () => {
//       try {
//         const snap = await getDoc(doc(db, "users", currentUid));
//         if (snap.exists()) {
//           const role = (snap.data().role || "").toLowerCase();
//           setUserRole(role);
//         }
//       } catch (e) {
//         console.log("role error", e);
//       }
//     };

//     load();
//   }, [currentUid]);

//   // ------------------------------------------------------------
//   //             REQUEST COUNT LISTENER
//   // ------------------------------------------------------------
//   useEffect(() => {
//     if (!currentUid) return;

//     const colRef = collection(db, "requests", currentUid, "users");
//     const unsub = onSnapshot(colRef, (s) => setRequestCount(s.size));

//     return () => unsub();
//   }, [currentUid]);

//   // ------------------------------------------------------------
//   //             LISTEN TO ALL CHATS (Realtime DB)
//   // ------------------------------------------------------------
//   useEffect(() => {
//     if (!currentUid || !rtdb) return;

//     setLoadingChats(true);

//     const refUserChats = rRef(rtdb, `userChats/${currentUid}`);
//     let cancelled = false;

//     const unsub = onValue(
//       refUserChats,
//       async (snapshot) => {
//         if (cancelled) return;

//         const val = snapshot.val();
//         if (!val) {
//           setChats([]);
//           setLoadingChats(false);
//           return;
//         }

//         const entries = Object.entries(val);

//         const list = await Promise.all(
//           entries.map(async ([chatId, raw]) => {
//             const withUid = raw.withUid || raw.with || "";
//             let lastMessage = raw.lastMessage || "";
//             let lastMessageTime = raw.lastMessageTime || 0;

//             try {
//               const msgQuery = rQuery(
//                 rRef(rtdb, `chats/${chatId}/messages`),
//                 orderByChild("timestamp"),
//                 limitToLast(1)
//               );

//               const msgSnap = await get(msgQuery);

//               if (msgSnap.exists()) {
//                 const first = Object.values(msgSnap.val())[0];

//                 if (first.type === "job") {
//                   const jobTitle =
//                     first.jobData?.title ||
//                     first.jobData?.sub_category ||
//                     "Job Shared";
//                   lastMessage = `[Job] ${jobTitle}`;
//                 } else {
//                   lastMessage = first.text || "[Attachment]";
//                 }

//                 lastMessageTime = first.timestamp || lastMessageTime;
//               }
//             } catch (e) {
//               console.log("msg error", e);
//             }

//             return { chatId, withUid, lastMessage, lastMessageTime };
//           })
//         );

//         const sorted = list.sort(
//           (a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0)
//         );

//         setChats(sorted);
//         setLoadingChats(false);
//       },
//       (err) => {
//         console.log("listen error", err);
//         if (!cancelled) {
//           setChats([]);
//           setLoadingChats(false);
//           setChatError("Error loading chats");
//         }
//       }
//     );

//     return () => {
//       cancelled = true;
//       unsub();
//     };
//   }, [currentUid]);

//   // ------------------------------------------------------------
//   //                FETCH USER DATA FOR EACH CHAT
//   // ------------------------------------------------------------
//   useEffect(() => {
//     const load = async () => {
//       if (!chats.length) return setChatItems([]);

//       const res = await Promise.all(
//         chats.map(async (chat) => {
//           if (!chat.withUid) return null;

//           if (!userCacheRef.current[chat.withUid]) {
//             const snap = await getDoc(doc(db, "users", chat.withUid));
//             userCacheRef.current[chat.withUid] = snap.exists()
//               ? snap.data()
//               : {};
//           }

//           return { chat, userData: userCacheRef.current[chat.withUid] };
//         })
//       );

//       setChatItems(res.filter(Boolean));
//     };

//     load();
//   }, [chats]);

//   // ------------------------------------------------------------
//   //                       SEARCH FILTER
//   // ------------------------------------------------------------
//   function filteredChatItems() {
//     let list = chatItems;

//     // remove job-only rows for this screen (UI matches screenshot – only people)
//     list = list.filter(
//       (i) => !String(i.chat.lastMessage || "").startsWith("[Job]")
//     );

//     if (!search.trim()) return list;

//     const q = search.trim().toLowerCase();

//     return list.filter((i) => {
//       const full = `${i.userData.firstName || ""} ${
//         i.userData.lastName || ""
//       }`
//         .trim()
//         .toLowerCase();
//       return full.includes(q);
//     });
//   }

//   // ------------------------------------------------------------
//   //          SHARE JOB MESSAGE (IF SHAREDJOB EXISTS)
//   // ------------------------------------------------------------
//   async function sendJobMessageToChat(chatId, receiverId, job) {
//     try {
//       const now = Date.now();
//       const msgId = uuidv4();

//       const msgRef = rRef(rtdb, `chats/${chatId}/messages/${msgId}`);

//       await rSet(msgRef, {
//         id: msgId,
//         type: "job",
//         jobData: convertTimestampsJS(job),
//         senderId: currentUid,
//         receiverId,
//         timestamp: now,
//         status: "sent",
//       });

//       const title = job.title || job.sub_category || "Job";
//       const text = `[Job] ${title}`;

//       const updates = {};
//       updates[`userChats/${currentUid}/${chatId}`] = {
//         withUid: receiverId,
//         lastMessage: text,
//         lastMessageTime: now,
//       };
//       updates[`userChats/${receiverId}/${chatId}`] = {
//         withUid: currentUid,
//         lastMessage: text,
//         lastMessageTime: now,
//       };

//       await rUpdate(rRef(rtdb), updates);
//     } catch (e) {
//       console.log("job share error", e);
//     }
//   }

//   // ------------------------------------------------------------
//   //                       DELETE CHAT
//   // ------------------------------------------------------------
//   async function deleteChat(chat) {
//     await rRemove(rRef(rtdb, `userChats/${currentUid}/${chat.chatId}`));
//     await rRemove(rRef(rtdb, `chats/${chat.chatId}`));
//     setDeleteState({ open: false, chat: null, name: "" });
//   }

//   // ------------------------------------------------------------
//   //                       RENDER
//   // ------------------------------------------------------------

//   const list = filteredChatItems();

//   if (!currentUid) {
//     return (
//       <div className="chatlist-page">
//         <div className="chatlist-shell">
//           <div className="chatlist-header">
//             <button
//               className="chatlist-back-btn"
//               onClick={() => navigate(-1)}
//             >
//               <span className="chatlist-back-icon" />
//             </button>
//             <div className="chatlist-title-wrapper">
//               <div className="chatlist-title">Message</div>
//             </div>
//           </div>

//           <div className="chatlist-search-wrapper">
//             <div className="chatlist-search-wrapper-inner">
//               <span className="chatlist-search-icon">
//                 <img src={search1} style={{ width: "18px" }} alt="search" />
//               </span>
//               <input
//                 className="chatlist-search-input"
//                 placeholder="Search"
//                 disabled
//               />
//             </div>
//           </div>

//           <div className="chatlist-card">
//             <div className="chatlist-loading-wrapper">
//               Login to see messages
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Delete Modal */}
//       {deleteState.open && (
//         <div className="chatlist-modal-backdrop">
//           <div className="chatlist-modal">
//             <div className="chatlist-modal-title-row">
//               <div className="chatlist-modal-title-icon">🗑</div>
//               <div className="chatlist-modal-title-text">Delete Chat</div>
//             </div>
//             <div className="chatlist-modal-body">
//               Delete chat with <b>{deleteState.name}</b>?
//             </div>
//             <div className="chatlist-modal-actions">
//               <button
//                 className="chatlist-btn chatlist-btn-ghost"
//                 onClick={() =>
//                   setDeleteState({ open: false, chat: null, name: "" })
//                 }
//               >
//                 Cancel
//               </button>
//               <button
//                 className="chatlist-btn chatlist-btn-danger"
//                 onClick={() => deleteChat(deleteState.chat)}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Layout */}
//       <div className="chatlist-page">
//         <div className="chatlist-shell">
//           {/* Header on gradient */}
//           <div className="chatlist-header">
//             <button
//               className="chatlist-back-btn"
//               onClick={() => navigate(-1)}
//             >
//               <span className="chatlist-back-icon" />
//             </button>

//             <div className="chatlist-title-wrapper">
//               <div className="chatlist-title">Message</div>
//             </div>
//           </div>

//           {/* Search on gradient */}
//           <div className="chatlist-search-wrapper">
//             <div className="chatlist-search-wrapper-inner">
//               <span className="chatlist-search-icon">
//                 <img src={search1} style={{ width: "18px" }} alt="search" />
//               </span>
//               <input
//                 className="chatlist-search-input"
//                 placeholder="Search"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//               {search.trim() && (
//                 <span
//                   className="chatlist-search-clear"
//                   onClick={() => setSearch("")}
//                 >
//                   ✕
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* White Card with Request + List */}
//           <div className="chatlist-card">
//             {userRole === "freelancer" && (
//               <div className="chatlist-request-row">
//                 <div
//                   className="chatlist-request-pill"
//                   onClick={() =>
//                     navigate("/request-chats", { state: { currentUid } })
//                   }
//                 >
//                   Request
//                   {requestCount > 0 && (
//                     <span className="chatlist-request-badge">
//                       ({requestCount})
//                     </span>
//                   )}
//                 </div>
//               </div>
//             )}

//             <div className="chatlist-list">
//               {loadingChats ? (
//                 <div className="chatlist-loading-wrapper">
//                   <div className="chatlist-spinner" />
//                 </div>
//               ) : chatError ? (
//                 <div className="chatlist-empty-inner">Error loading chats</div>
//               ) : !list.length ? (
//                 <div className="chatlist-empty-inner">No messages</div>
//               ) : (
//                 list.map(({ chat, userData }) => {
//                   const name = `${userData.firstName || ""} ${
//                     userData.lastName || ""
//                   }`.trim();
//                   const imageUrl = userData.profileImage || "";
//                   const time = formatTimeLabel(chat.lastMessageTime);

//                   const onRowClick = async () => {
//                     if (sharedJob) {
//                       await sendJobMessageToChat(
//                         chat.chatId,
//                         chat.withUid,
//                         sharedJob
//                       );
//                       alert("Job shared");
//                       navigate(-1);
//                       return;
//                     }

//                     navigate("/chat", {
//                       state: {
//                         currentUid,
//                         otherUid: chat.withUid,
//                         otherProfile: userData,
//                         otherName: name,
//                         otherImage: imageUrl,
//                       },
//                     });
//                   };

//                   return (
//                     <div
//                       key={chat.chatId}
//                       className="chatlist-item"
//                       onClick={onRowClick}
//                     >
//                       <div className="chatlist-avatar-wrapper">
//                         <img
//                           src={
//                             imageUrl || "https://i.ibb.co/sqsJwP0/user.png"
//                           }
//                           className="chatlist-avatar"
//                           alt="profile"
//                         />
//                       </div>

//                       <div className="chatlist-item-content">
//                         <div className="chatlist-name-row">
//                           <div className="chatlist-name">
//                             {name || "User"}
//                           </div>
//                           <div className="chatlist-time">{time}</div>
//                         </div>
//                         <div className="chatlist-lastmsg">
//                           {chat.lastMessage || "No messages yet"}
//                         </div>
//                       </div>

//                       <div className="chatlist-right-col">
//                         <div className="chatlist-role">Agents</div>
//                         <div className="chatlist-tick-icon">✓✓</div>
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }



// frontend/src/Chat/ChatListScreen.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { db, auth, rtdb } from "../../firbase/Firebase";

import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";

import {
  ref as rRef,
  onValue,
  get,
  query as rQuery,
  orderByChild,
  limitToLast,
  update as rUpdate,
  set as rSet,
  remove as rRemove,
} from "firebase/database";

import { v4 as uuidv4 } from "uuid";
import search1 from "../../assets/search.png";

// ---------------- CSS INJECTION (NEW UI) ----------------
const css = `
.chatlist-page {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 32px 16px;
  box-sizing: border-box;
  background: linear-gradient(180deg, #fff4b8 0%, #ffffff 45%, #f7f0ff 100%);
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

/* Wrapper that holds header + search + white card */
.chatlist-shell {
  width: 420px;
  max-width: 100%;
}

/* Main white card (ONLY list area like in screenshot) */
.chatlist-card {
  width: 100%;
  background: #ffffff;
  border-radius: 28px;
  padding: 18px 18px 16px;
  margin-top: 22px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
  box-sizing: border-box;
}

/* Header row (on yellow bg, outside card) */
.chatlist-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.chatlist-back-btn {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: none;
  background: #ffffff;
  box-shadow: 0 5px 18px rgba(0,0,0,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.chatlist-back-icon {
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 7px solid #111827;
  transform: translateX(-1px);
}

.chatlist-title-wrapper {
  display: flex;
  flex-direction: column;
}

.chatlist-title {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
}

/* Search bar (floating card like screenshot) */
.chatlist-search-wrapper {
  margin-bottom: 10px;
}

.chatlist-search-wrapper-inner {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fffef2;
  border-radius: 20px;
  padding: 11px 16px;
  box-shadow: 0 10px 26px rgba(0,0,0,0.14);
}

.chatlist-search-icon img {
  display: block;
}

.chatlist-search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: #111827;
  background: transparent;
}

.chatlist-search-input::placeholder {
  color: #9ca3af;
}

.chatlist-search-clear {
  font-size: 14px;
  cursor: pointer;
  opacity: 0.5;
}

/* Request text on right top of list (inside white card) */
.chatlist-request-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 8px;
}

.chatlist-request-pill {
  font-size: 13px;
  font-weight: 600;
  color: #7c3aed;
  cursor: pointer;
}

/* List area */
.chatlist-list {
  max-height: 520px;
  overflow-y: auto;
  padding: 4px 4px 4px 2px;
}

/* Single row */
.chatlist-item {
  display: flex;
  align-items: center;
  padding: 12px 4px;
  border-bottom: 1px solid #eef0f4;
  cursor: pointer;
}

.chatlist-avatar-wrapper {
  margin-right: 10px;
}

.chatlist-avatar {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  object-fit: cover;
  box-shadow: 0 4px 10px rgba(0,0,0,0.12);
}

.chatlist-item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.chatlist-name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chatlist-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.chatlist-time {
  font-size: 11px;
  color: #9ca3af;
}

.chatlist-lastmsg {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Right column – role + ticks */
.chatlist-right-col {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  margin-left: 8px;
}

.chatlist-role {
  font-size: 11px;
  color: #9ca3af;
}

.chatlist-tick-icon {
  font-size: 14px;
}

/* Loading / empty states */
.chatlist-loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}

.chatlist-spinner {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  border: 3px solid #e5e7eb;
  border-top-color: #7c3aed;
  animation: chatlist-spin 0.8s linear infinite;
}

.chatlist-empty-inner {
  padding: 28px 0;
  text-align: center;
  font-size: 13px;
  color: #9ca3af;
}

/* Delete modal */
.chatlist-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
}

.chatlist-modal {
  width: 320px;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 18px 40px rgba(0,0,0,0.40);
  padding: 18px 18px 14px;
  box-sizing: border-box;
}

.chatlist-modal-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.chatlist-modal-title-icon {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: #fef2f2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chatlist-modal-title-text {
  font-size: 16px;
  font-weight: 600;
}

.chatlist-modal-body {
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 14px;
}

.chatlist-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.chatlist-btn {
  padding: 8px 14px;
  border-radius: 999px;
  border: none;
  font-size: 13px;
  cursor: pointer;
}

.chatlist-btn-ghost {
  background: #f3f4f6;
  color: #111827;
}

.chatlist-btn-danger {
  background: #ef4444;
  color: #ffffff;
}

/* spinner keyframes */
@keyframes chatlist-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Scrollbar subtle */
.chatlist-list::-webkit-scrollbar {
  width: 4px;
}
.chatlist-list::-webkit-scrollbar-track {
  background: transparent;
}
.chatlist-list::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 999px;
}
`;

if (
  typeof document !== "undefined" &&
  !document.getElementById("chatlist-screen-styles")
) {
  const style = document.createElement("style");
  style.id = "chatlist-screen-styles";
  style.innerHTML = css;
  document.head.appendChild(style);
}

// ---------------- HELPERS ----------------
function convertTimestampsJS(value) {
  if (value === null || value === undefined) return value;

  if (typeof value === "object" && "seconds" in value && "nanoseconds" in value) {
    return typeof value.toMillis === "function"
      ? value.toMillis()
      : value.seconds * 1000;
  }

  if (value instanceof Date) return value.getTime();
  if (Array.isArray(value)) return value.map(convertTimestampsJS);

  if (typeof value === "object") {
    const o = {};
    Object.entries(value).forEach(([k, v]) => {
      o[k] = convertTimestampsJS(v);
    });
    return o;
  }

  return value;
}

function formatTimeLabel(ts) {
  if (!ts) return "";
  const date = new Date(ts);
  const now = new Date();
  const diff = now - date;
  const days = diff / 86400000;

  if (days < 1)
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (days < 2) return "Yesterday";
  if (days < 7) return date.toLocaleDateString([], { weekday: "long" });
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

// ------------------------------------------------------------
//                     MAIN COMPONENT
// ------------------------------------------------------------

export default function ChatListScreen({ currentUid: propUid, sharedJob = null }) {
  const navigate = useNavigate();
  const currentUid = propUid || auth.currentUser?.uid || null;

  // ⭐ 1️⃣ SIDEBAR COLLAPSED STATE (NEW)
  const [collapsed, setCollapsed] = useState(
    typeof window !== "undefined" &&
      localStorage.getItem("sidebar-collapsed") === "true"
  );

  const [userRole, setUserRole] = useState("");
  const [search, setSearch] = useState("");
  const [requestCount, setRequestCount] = useState(0);

  const [chats, setChats] = useState([]);
  const [chatItems, setChatItems] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [chatError, setChatError] = useState("");

  const [deleteState, setDeleteState] = useState({
    open: false,
    chat: null,
    name: "",
  });

  const userCacheRef = useRef({}); // FULL USER PROFILE CACHE

  // ⭐ 2️⃣ LISTEN FOR SIDEBAR TOGGLE EVENT (NEW)
  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  // ------------------------------------------------------------
  //                 LOAD USER ROLE
  // ------------------------------------------------------------
  useEffect(() => {
    if (!currentUid) return;

    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "users", currentUid));
        if (snap.exists()) {
          const role = (snap.data().role || "").toLowerCase();
          setUserRole(role);
        }
      } catch (e) {
        console.log("role error", e);
      }
    };

    load();
  }, [currentUid]);

  // ------------------------------------------------------------
  //             REQUEST COUNT LISTENER
  // ------------------------------------------------------------
  useEffect(() => {
    if (!currentUid) return;

    const colRef = collection(db, "requests", currentUid, "users");
    const unsub = onSnapshot(colRef, (s) => setRequestCount(s.size));

    return () => unsub();
  }, [currentUid]);

  // ------------------------------------------------------------
  //             LISTEN TO ALL CHATS (Realtime DB)
  // ------------------------------------------------------------
  useEffect(() => {
    if (!currentUid || !rtdb) return;

    setLoadingChats(true);

    const refUserChats = rRef(rtdb, `userChats/${currentUid}`);
    let cancelled = false;

    const unsub = onValue(
      refUserChats,
      async (snapshot) => {
        if (cancelled) return;

        const val = snapshot.val();
        if (!val) {
          setChats([]);
          setLoadingChats(false);
          return;
        }

        const entries = Object.entries(val);

        const list = await Promise.all(
          entries.map(async ([chatId, raw]) => {
            const withUid = raw.withUid || raw.with || "";
            let lastMessage = raw.lastMessage || "";
            let lastMessageTime = raw.lastMessageTime || 0;

            try {
              const msgQuery = rQuery(
                rRef(rtdb, `chats/${chatId}/messages`),
                orderByChild("timestamp"),
                limitToLast(1)
              );

              const msgSnap = await get(msgQuery);

              if (msgSnap.exists()) {
                const first = Object.values(msgSnap.val())[0];

                if (first.type === "job") {
                  const jobTitle =
                    first.jobData?.title ||
                    first.jobData?.sub_category ||
                    "Job Shared";
                  lastMessage = `[Job] ${jobTitle}`;
                } else {
                  lastMessage = first.text || "[Attachment]";
                }

                lastMessageTime = first.timestamp || lastMessageTime;
              }
            } catch (e) {
              console.log("msg error", e);
            }

            return { chatId, withUid, lastMessage, lastMessageTime };
          })
        );

        const sorted = list.sort(
          (a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0)
        );

        setChats(sorted);
        setLoadingChats(false);
      },
      (err) => {
        console.log("listen error", err);
        if (!cancelled) {
          setChats([]);
          setLoadingChats(false);
          setChatError("Error loading chats");
        }
      }
    );

    return () => {
      cancelled = true;
      unsub();
    };
  }, [currentUid]);

  // ------------------------------------------------------------
  //                FETCH USER DATA FOR EACH CHAT
  // ------------------------------------------------------------
  useEffect(() => {
    const load = async () => {
      if (!chats.length) return setChatItems([]);

      const res = await Promise.all(
        chats.map(async (chat) => {
          if (!chat.withUid) return null;

          if (!userCacheRef.current[chat.withUid]) {
            const snap = await getDoc(doc(db, "users", chat.withUid));
            userCacheRef.current[chat.withUid] = snap.exists()
              ? snap.data()
              : {};
          }

          return { chat, userData: userCacheRef.current[chat.withUid] };
        })
      );

      setChatItems(res.filter(Boolean));
    };

    load();
  }, [chats]);

  // ------------------------------------------------------------
  //                       SEARCH FILTER
  // ------------------------------------------------------------
  function filteredChatItems() {
    let list = chatItems;

    // remove job-only rows for this screen (UI matches screenshot – only people)
    list = list.filter(
      (i) => !String(i.chat.lastMessage || "").startsWith("[Job]")
    );

    if (!search.trim()) return list;

    const q = search.trim().toLowerCase();

    return list.filter((i) => {
      const full = `${i.userData.firstName || ""} ${
        i.userData.lastName || ""
      }`
        .trim()
        .toLowerCase();
      return full.includes(q);
    });
  }

  // ------------------------------------------------------------
  //          SHARE JOB MESSAGE (IF SHAREDJOB EXISTS)
  // ------------------------------------------------------------
  async function sendJobMessageToChat(chatId, receiverId, job) {
    try {
      const now = Date.now();
      const msgId = uuidv4();

      const msgRef = rRef(rtdb, `chats/${chatId}/messages/${msgId}`);

      await rSet(msgRef, {
        id: msgId,
        type: "job",
        jobData: convertTimestampsJS(job),
        senderId: currentUid,
        receiverId,
        timestamp: now,
        status: "sent",
      });

      const title = job.title || job.sub_category || "Job";
      const text = `[Job] ${title}`;

      const updates = {};
      updates[`userChats/${currentUid}/${chatId}`] = {
        withUid: receiverId,
        lastMessage: text,
        lastMessageTime: now,
      };
      updates[`userChats/${receiverId}/${chatId}`] = {
        withUid: currentUid,
        lastMessage: text,
        lastMessageTime: now,
      };

      await rUpdate(rRef(rtdb), updates);
    } catch (e) {
      console.log("job share error", e);
    }
  }

  // ------------------------------------------------------------
  //                       DELETE CHAT
  // ------------------------------------------------------------
  async function deleteChat(chat) {
    await rRemove(rRef(rtdb, `userChats/${currentUid}/${chat.chatId}`));
    await rRemove(rRef(rtdb, `chats/${chat.chatId}`));
    setDeleteState({ open: false, chat: null, name: "" });
  }

  // ------------------------------------------------------------
  //                       RENDER
  // ------------------------------------------------------------

  const list = filteredChatItems();

  if (!currentUid) {
    return (
      <div
        style={{
          marginLeft: collapsed ? "-110px" : "50px",
          transition: "margin-left 0.25s ease",
        }}
      >
        <div className="chatlist-page">
          <div className="chatlist-shell">
            <div className="chatlist-header">
              <button
                className="chatlist-back-btn"
                onClick={() => navigate(-1)}
              >
                <span className="chatlist-back-icon" />
              </button>
              <div className="chatlist-title-wrapper">
                <div className="chatlist-title">Message</div>
              </div>
            </div>

            <div className="chatlist-search-wrapper">
              <div className="chatlist-search-wrapper-inner">
                <span className="chatlist-search-icon">
                  <img src={search1} style={{ width: "18px" }} alt="search" />
                </span>
                <input
                  className="chatlist-search-input"
                  placeholder="Search"
                  disabled
                />
              </div>
            </div>

            <div className="chatlist-card">
              <div className="chatlist-loading-wrapper">
                Login to see messages
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        marginLeft: collapsed ? "-110px" : "50px",
        transition: "margin-left 0.25s ease",
      }}
    >
      {/* Delete Modal */}
      {deleteState.open && (
        <div className="chatlist-modal-backdrop">
          <div className="chatlist-modal">
            <div className="chatlist-modal-title-row">
              <div className="chatlist-modal-title-icon">🗑</div>
              <div className="chatlist-modal-title-text">Delete Chat</div>
            </div>
            <div className="chatlist-modal-body">
              Delete chat with <b>{deleteState.name}</b>?
            </div>
            <div className="chatlist-modal-actions">
              <button
                className="chatlist-btn chatlist-btn-ghost"
                onClick={() =>
                  setDeleteState({ open: false, chat: null, name: "" })
                }
              >
                Cancel
              </button>
              <button
                className="chatlist-btn chatlist-btn-danger"
                onClick={() => deleteChat(deleteState.chat)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="chatlist-page">
        <div className="chatlist-shell">
          {/* Header on gradient */}
          <div className="chatlist-header">
            <button
              className="chatlist-back-btn"
              onClick={() => navigate(-1)}
            >
              <span className="chatlist-back-icon" />
            </button>

            <div className="chatlist-title-wrapper">
              <div className="chatlist-title">Message</div>
            </div>
          </div>

          {/* Search on gradient */}
          <div className="chatlist-search-wrapper">
            <div className="chatlist-search-wrapper-inner">
              <span className="chatlist-search-icon">
                <img src={search1} style={{ width: "18px" }} alt="search" />
              </span>
              <input
                className="chatlist-search-input"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search.trim() && (
                <span
                  className="chatlist-search-clear"
                  onClick={() => setSearch("")}
                >
                  ✕
                </span>
              )}
            </div>
          </div>

          {/* White Card with Request + List */}
          <div className="chatlist-card">
            {userRole === "freelancer" && (
              <div className="chatlist-request-row">
                <div
                  className="chatlist-request-pill"
                  onClick={() =>
                    navigate("/request-chats", { state: { currentUid } })
                  }
                >
                  Request
                  {requestCount > 0 && (
                    <span className="chatlist-request-badge">
                      ({requestCount})
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="chatlist-list">
              {loadingChats ? (
                <div className="chatlist-loading-wrapper">
                  <div className="chatlist-spinner" />
                </div>
              ) : chatError ? (
                <div className="chatlist-empty-inner">Error loading chats</div>
              ) : !list.length ? (
                <div className="chatlist-empty-inner">No messages</div>
              ) : (
                list.map(({ chat, userData }) => {
                  const name = `${userData.firstName || ""} ${
                    userData.lastName || ""
                  }`.trim();
                  const imageUrl = userData.profileImage || "";
                  const time = formatTimeLabel(chat.lastMessageTime);

                  const onRowClick = async () => {
                    if (sharedJob) {
                      await sendJobMessageToChat(
                        chat.chatId,
                        chat.withUid,
                        sharedJob
                      );
                      alert("Job shared");
                      navigate(-1);
                      return;
                    }

                    navigate("/chat", {
                      state: {
                        currentUid,
                        otherUid: chat.withUid,
                        otherProfile: userData,
                        otherName: name,
                        otherImage: imageUrl,
                      },
                    });
                  };

                  return (
                    <div
                      key={chat.chatId}
                      className="chatlist-item"
                      onClick={onRowClick}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setDeleteState({
                          open: true,
                          chat,
                          name: name || "User",
                        });
                      }}
                    >
                      <div className="chatlist-avatar-wrapper">
                        <img
                          src={
                            imageUrl || "https://i.ibb.co/sqsJwP0/user.png"
                          }
                          className="chatlist-avatar"
                          alt="profile"
                        />
                      </div>

                      <div className="chatlist-item-content">
                        <div className="chatlist-name-row">
                          <div className="chatlist-name">
                            {name || "User"}
                          </div>
                          <div className="chatlist-time">{time}</div>
                        </div>
                        <div className="chatlist-lastmsg">
                          {chat.lastMessage || "No messages yet"}
                        </div>
                      </div>

                      <div className="chatlist-right-col">
                        <div className="chatlist-role">Agents</div>
                        <div className="chatlist-tick-icon">✓✓</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
