// // ---------------------------------------------------------------
// // REAL WORKING CHAT SCREEN
// // ---------------------------------------------------------------

// import React, { useEffect, useState, useRef } from "react";
// import { useParams, useLocation } from "react-router-dom";
// import {
//   getDatabase,
//   ref as dbRef,
//   onValue,
//   push,
//   set,
//   serverTimestamp,
// } from "firebase/database";

// export default function RequestChatScreen() {
//   const { chatId } = useParams();
//   const location = useLocation();

//   const currentUid = location.state?.currentUid;
//   const otherUid = location.state?.otherUid;
//   const otherName = location.state?.otherName;
//   const otherImage = location.state?.otherImage;
//   const initialMessage = location.state?.initialMessage;

//   const db = getDatabase();

//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const bottomRef = useRef(null);

//   // -------------------------------------------------------------
//   // LOAD CHAT MESSAGES
//   // -------------------------------------------------------------
//   useEffect(() => {
//     const msgRef = dbRef(db, `chats/${chatId}`);
//     return onValue(msgRef, (snap) => {
//       if (!snap.exists()) return;
//       const data = snap.val();
//       const list = Object.values(data).sort(
//         (a, b) => a.timestamp - b.timestamp
//       );
//       setMessages(list);
//     });
//   }, [chatId, db]);

//   // Auto scroll
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // -------------------------------------------------------------
//   // SEND MESSAGE
//   // -------------------------------------------------------------
//   async function sendMessage() {
//     if (!input.trim()) return;

//     const newMsgRef = push(dbRef(db, `chats/${chatId}`));

//     await set(newMsgRef, {
//       sender: currentUid,
//       message: input,
//       timestamp: Date.now(),
//     });

//     // update last message for both users
//     await set(dbRef(db, `userChats/${currentUid}/${chatId}`), {
//       with: otherUid,
//       lastMessage: input,
//       lastMessageTime: Date.now(),
//     });

//     await set(dbRef(db, `userChats/${otherUid}/${chatId}`), {
//       with: currentUid,
//       lastMessage: input,
//       lastMessageTime: Date.now(),
//     });

//     setInput("");
//   }

//   // -------------------------------------------------------------
//   // FIRST MESSAGE (JOB SHARE)
//   // -------------------------------------------------------------
//   useEffect(() => {
//     if (!initialMessage) return;

//     const msgRef = push(dbRef(db, `chats/${chatId}`));
//     set(msgRef, {
//       sender: currentUid,
//       message: initialMessage,
//       timestamp: Date.now(),
//       system: true,
//     });

//   }, [initialMessage, chatId, currentUid]);

//   // -------------------------------------------------------------
//   // UI
//   // -------------------------------------------------------------
//   return (
//     <div className="flex flex-col h-screen bg-gray-100">

//       {/* HEADER */}
//       <div className="p-4 bg-yellow-300 flex items-center shadow">
//         <img
//           src={otherImage || "https://via.placeholder.com/40"}
//           className="w-10 h-10 rounded-full mr-3"
//         />
//         <div className="text-lg font-semibold">{otherName}</div>
//       </div>

//       {/* MESSAGES */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-3">

//         {messages.map((m, index) => (
//           <div
//             key={index}
//             className={`p-3 max-w-xs rounded-lg ${
//               m.sender === currentUid
//                 ? "ml-auto bg-blue-600 text-white"
//                 : "mr-auto bg-white shadow"
//             }`}
//           >
//             {m.message}
//           </div>
//         ))}

//         <div ref={bottomRef}></div>
//       </div>

//       {/* INPUT BOX */}
//       <div className="p-4 bg-white flex gap-3 shadow">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type message..."
//           className="flex-1 p-3 border rounded-lg"
//         />
//         <button
//           onClick={sendMessage}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }












// import React, { useEffect, useState } from "react";
// import { auth, db, rtdb } from "../../firbase/Firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import {
//   collection,
//   query,
//   where,
//   onSnapshot,
//   doc,
//   updateDoc,
// } from "firebase/firestore";
// import { ref, set, onValue } from "firebase/database";
// import { useNavigate } from "react-router-dom";

// export default function FreelancerRequestsAndChats() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [requests, setRequests] = useState([]);
//   const [acceptedChats, setAcceptedChats] = useState([]);

//   // Listen for auth state
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       if (currentUser) setUser(currentUser);
//       setLoading(false);
//     });
//     return unsubscribe;
//   }, []);

//   // Load pending requests
//   useEffect(() => {
//     if (!user) return;

//     const qPending = query(
//       collection(db, "notifications"),
//       where("freelancerId", "==", user.uid),
//       where("read", "==", false) // pending
//     );

//     const unsubPending = onSnapshot(qPending, (snap) => {
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       console.log("Pending requests:", list);
//       setRequests(list);
//     });

//     return unsubPending;
//   }, [user]);

//   // Load accepted chats
//   useEffect(() => {
//     if (!user) return;

//     const qAccepted = query(
//       collection(db, "notifications"),
//       where("freelancerId", "==", user.uid),
//       where("read", "==", true)
//     );

//     const unsubAccepted = onSnapshot(qAccepted, (snap) => {
//       const acceptedClients = snap.docs.map((d) => d.data().clientUid);

//       const userChatsRef = ref(rtdb, `userChats/${user.uid}`);
//       onValue(userChatsRef, async (chatsSnap) => {
//         const val = chatsSnap.val() || {};

//         const filtered = await Promise.all(
//           Object.entries(val)
//             .filter(([_, chatData]) =>
//               acceptedClients.includes(chatData.withUid)
//             )
//             .map(async ([chatId, chatData]) => {
//               const clientRef = doc(db, "users", chatData.withUid);
//               const clientSnap = await clientRef.get?.(); // optional chaining for get()
//               const clientData = clientSnap?.exists() ? clientSnap.data() : {};

//               const clientName =
//                 clientData?.firstName && clientData?.lastName
//                   ? `${clientData.firstName} ${clientData.lastName}`
//                   : "Client";

//               return {
//                 chatId,
//                 ...chatData,
//                 clientName,
//                 clientImg: clientData?.profileImage || null,
//               };
//             })
//         );

//         filtered.sort(
//           (a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0)
//         );

//         setAcceptedChats(filtered);
//       });
//     });

//     return unsubAccepted;
//   }, [user]);

//   // Accept request
//   const acceptRequest = async (req) => {
//     try {
//       // Update Firestore notification
//       const notifRef = doc(db, "notifications", req.id);
//       await updateDoc(notifRef, { read: true });

//       // Create chat in Realtime Database
//       const chatId = `${req.freelancerId}_${req.clientUid}`;
//       await set(ref(rtdb, `userChats/${req.freelancerId}/${chatId}`), {
//         withUid: req.clientUid,
//         lastMessage: "",
//         lastMessageTime: Date.now(),
//       });

//       alert("✅ Request accepted and chat created!");
//     } catch (err) {
//       console.error(err);
//       alert("❌ Failed to accept request");
//     }
//   };

//   // Reject request
//   const rejectRequest = async (req) => {
//     try {
//       const notifRef = doc(db, "notifications", req.id);
//       await updateDoc(notifRef, { rejected: true, read: false });
//       alert("❌ Request rejected");
//     } catch (err) {
//       console.error(err);
//       alert("❌ Failed to reject request");
//     }
//   };

//   if (loading)
//     return (
//       <div style={{ padding: 20 }}>
//         <h2>Loading requests and chats...</h2>
//       </div>
//     );

//   if (!user)
//     return (
//       <div style={{ padding: 20 }}>
//         <h2>Please login to see your requests and chats.</h2>
//       </div>
//     );

//   return (
//     <div style={{ padding: 20, minHeight: "100vh", background: "#f5f5f5" }}>
//       {/* Pending Requests */}
//       <h1 style={{ marginBottom: 12 }}>Pending Requests</h1>
//       {requests.length === 0 && (
//         <p style={{ color: "#777" }}>No pending requests.</p>
//       )}
//       {requests.map((req) => (
//         <div
//           key={req.id}
//           style={{
//             background: "#fff",
//             padding: 14,
//             borderRadius: 12,
//             marginBottom: 12,
//             boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
//           }}
//         >
//           <h4 style={{ margin: 0 }}>{req.title || req.jobTitle}</h4>
//           <p style={{ color: "#444" }}>{req.body}</p>
//           <small style={{ color: "#777" }}>
//             {req.timestamp
//               ? new Date(req.timestamp.seconds * 1000).toLocaleString()
//               : ""}
//           </small>
//           <div style={{ marginTop: 8, display: "flex", gap: 12 }}>
//             <button
//               onClick={() => acceptRequest(req)}
//               style={{
//                 padding: "8px 16px",
//                 background: "#4CAF50",
//                 color: "white",
//                 border: "none",
//                 borderRadius: 8,
//                 cursor: "pointer",
//               }}
//             >
//               Accept
//             </button>
//             <button
//               onClick={() => rejectRequest(req)}
//               style={{
//                 padding: "8px 16px",
//                 background: "#F44336",
//                 color: "white",
//                 border: "none",
//                 borderRadius: 8,
//                 cursor: "pointer",
//               }}
//             >
//               Reject
//             </button>
//           </div>
//         </div>
//       ))}




















{/* Accepted Chats */ }
{/* <h1 style={{ marginTop: 24, marginBottom: 12 }}>Accepted Chats</h1>
      {acceptedChats.length === 0 && (
        <p style={{ color: "#777" }}>No accepted chats yet.</p>
      )}
      {acceptedChats.map((chat) => (
        <div
          key={chat.chatId}
          onClick={() =>
            navigate("/chat", {
              state: { currentUid: user.uid, otherUid: chat.withUid },
            })
          }
          style={{
            background: "#fff",
            padding: 14,
            borderRadius: 12,
            marginBottom: 12,
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src={chat.clientImg || "/placeholder.png"}
              alt="profile"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <h4 style={{ margin: 0 }}>{chat.clientName}</h4>
          </div>
          <p style={{ color: "#444", marginTop: 8 }}>
            {chat.lastMessage || "No messages yet"}
          </p>
          <small style={{ color: "#777" }}>
            {chat.lastMessageTime
              ? new Date(chat.lastMessageTime).toLocaleString()
              : ""}
          </small>
        </div>
      ))} */}

//     </div>
//   );
// }



















// import React, { useEffect, useState } from "react";
// import { auth, db, rtdb } from "../../firbase/Firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import {
//   collection,
//   query,
//   where,
//   onSnapshot,
//   doc,
//   updateDoc,
//   getDoc,
// } from "firebase/firestore";
// import { ref, set, onValue } from "firebase/database";
// import { useNavigate } from "react-router-dom";

// export default function FreelancerRequestsAndChats() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [requests, setRequests] = useState([]);
//   const [acceptedChats, setAcceptedChats] = useState([]);

//   // Listen for auth state
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       if (currentUser) setUser(currentUser);
//       setLoading(false);
//     });
//     return unsubscribe;
//   }, []);

//   // Load pending requests
//   useEffect(() => {
//     if (!user) return;

//     const qPending = query(
//       collection(db, "notifications"),
//       where("freelancerId", "==", user.uid),
//       where("read", "==", false) // pending
//     );

//     const unsubPending = onSnapshot(qPending, (snap) => {
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       console.log("Pending requests:", list);
//       setRequests(list);
//     });

//     return unsubPending;
//   }, [user]);

//   // Load accepted chats
//   useEffect(() => {
//     if (!user) return;

//     const qAccepted = query(
//       collection(db, "notifications"),
//       where("freelancerId", "==", user.uid),
//       where("read", "==", true)
//     );

//     const unsubAccepted = onSnapshot(qAccepted, (snap) => {
//       const acceptedClients = snap.docs.map((d) => d.data().clientUid);

//       const userChatsRef = ref(rtdb, `userChats/${user.uid}`);
//       onValue(userChatsRef, async (chatsSnap) => {
//         const val = chatsSnap.val() || {};

//         const filtered = await Promise.all(
//           Object.entries(val)
//             .filter(([_, chatData]) =>
//               acceptedClients.includes(chatData.withUid)
//             )
//             .map(async ([chatId, chatData]) => {
//               const clientRef = doc(db, "users", chatData.withUid);
//               const clientSnap = await clientRef.get?.(); // optional chaining for get()
//               const clientData = clientSnap?.exists() ? clientSnap.data() : {};

//               const clientName =
//                 clientData?.firstName && clientData?.lastName
//                   ? `${clientData.firstName} ${clientData.lastName}`
//                   : "Client";

//               return {
//                 chatId,
//                 ...chatData,
//                 clientName,
//                 clientImg: clientData?.profileImage || null,
//               };
//             })
//         );

//         filtered.sort(
//           (a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0)
//         );

//         setAcceptedChats(filtered);
//       });
//     });

//     return unsubAccepted;
//   }, [user]);




//   const acceptRequest = async (req) => {
//     try {
//       const notifRef = doc(db, "notifications", req.id);
//       await updateDoc(notifRef, { read: true });

//       const chatId = `${req.freelancerId}_${req.clientUid}`;

//       await set(ref(rtdb, `userChats/${req.freelancerId}/${chatId}`), {
//         withUid: req.clientUid,
//         lastMessage: "",
//         lastMessageTime: Date.now(),
//       });

//       // 🔹 fetch client profile
//       const clientSnap = await getDoc(doc(db, "users", req.clientUid));
//       const clientData = clientSnap.exists() ? clientSnap.data() : {};

//       navigate(`/chat/${chatId}`, {
//         state: {
//           currentUid: req.freelancerId,
//           otherUid: req.clientUid,
//           otherName:
//             clientData.firstName && clientData.lastName
//               ? `${clientData.firstName} ${clientData.lastName}`
//               : "Client",
//           otherImage: clientData.profileImage || "",
//           initialMessage: "",
//         },
//       });
//     } catch (err) {
//       console.error(err);
//       alert("❌ Failed to accept request");
//     }
//   };



// const rejectRequest = async (req) => {
//   try {
//     // Delete notification
//     await deleteDoc(doc(db, "notifications", req.id));

//     // Remove from UI immediately
//     setRequests((prev) => prev.filter((r) => r.id !== req.id));

//     // Reset regular service if serviceId exists
//     if (req.serviceId) {
//       // Try regular services first
//       const serviceRef = doc(db, "services", req.serviceId);
//       await updateDoc(serviceRef, {
//         read: false,
//         freelancerId: null,
//       }).catch((err) => console.log("Not regular service, maybe 24h service", err));

//       // Also try 24h services
//       const service24Ref = doc(db, "service_24h", req.serviceId);
//       await updateDoc(service24Ref, {
//         read: false,
//         freelancerId: null,
//       }).catch((err) => console.log("Not 24h service, maybe regular service", err));
//     }

//     alert("❌ Request rejected!");
//   } catch (err) {
//     console.error(err);
//     alert("❌ Failed to reject request");
//   }
// };

//   if (loading)
//     return (
//       <div style={{ padding: 20 }}>
//         <h2>Loading requests and chats...</h2>
//       </div>
//     );

//   if (!user)
//     return (
//       <div style={{ padding: 20 }}>
//         <h2>Please login to see your requests and chats.</h2>
//       </div>
//     );

//   return (
//     <div style={{ padding: 20, minHeight: "100vh", background: "#f5f5f5" }}>
//       {/* Pending Requests */}
//       <h1 style={{ marginBottom: 12 }}>Pending Requests</h1>
//       {requests.length === 0 && (
//         <p style={{ color: "#777" }}>No pending requests.</p>
//       )}
//       {requests.map((req) => (
//         <div
//           key={req.id}
//           style={{
//             background: "#fff",
//             padding: 14,
//             borderRadius: 12,
//             marginBottom: 12,
//             boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
//           }}
//         >
//           <h4 style={{ margin: 0 }}>{req.title || req.jobTitle}</h4>
//           <p style={{ color: "#444" }}>{req.body}</p>
//           <small style={{ color: "#777" }}>
//             {req.timestamp
//               ? new Date(req.timestamp.seconds * 1000).toLocaleString()
//               : ""}
//           </small>
//           <div style={{ marginTop: 8, display: "flex", gap: 12 }}>
//             <button
//               onClick={() => acceptRequest(req)}
//               style={{
//                 padding: "8px 16px",
//                 background: "#4CAF50",
//                 color: "white",
//                 border: "none",
//                 borderRadius: 8,
//                 cursor: "pointer",
//               }}
//             >
//               Accept
//             </button>
//             <button
//               onClick={() => rejectRequest(req)}
//               style={{
//                 padding: "8px 16px",
//                 background: "#F44336",
//                 color: "white",
//                 border: "none",
//                 borderRadius: 8,
//                 cursor: "pointer",
//               }}
//             >
//               Reject
//             </button>
//           </div>
//         </div>
//       ))}



//     </div>
//   );
// }



// import React, { useEffect, useState } from "react";
// import { auth, db, rtdb } from "../../firbase/Firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import {
//   collection,
//   query,
//   where,
//   onSnapshot,
//   doc,
//   updateDoc,
//   getDoc,
//   deleteDoc, // ✅ FIX 1
// } from "firebase/firestore";
// import { ref, set, onValue } from "firebase/database";
// import { useNavigate } from "react-router-dom";

// export default function FreelancerRequestsAndChats() {
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [requests, setRequests] = useState([]);
//   const [acceptedChats, setAcceptedChats] = useState([]);

//   /* ================= AUTH ================= */
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser || null);
//       setLoading(false);
//     });
//     return unsub;
//   }, []);

//   /* ================= PENDING REQUESTS ================= */
//   useEffect(() => {
//     if (!user) return;

//     const qPending = query(
//       collection(db, "notifications"),
//       where("freelancerId", "==", user.uid),
//       where("read", "==", false)
//     );

//     const unsub = onSnapshot(qPending, (snap) => {
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setRequests(list);
//     });

//     return unsub;
//   }, [user]);

//   /* ================= ACCEPT ================= */
//   const acceptRequest = async (req) => {
//     try {
//       await updateDoc(doc(db, "notifications", req.id), { read: true });

//       const chatId = `${req.freelancerId}_${req.clientUid}`;

//       await set(ref(rtdb, `userChats/${req.freelancerId}/${chatId}`), {
//         withUid: req.clientUid,
//         lastMessage: "",
//         lastMessageTime: Date.now(),
//       });

//       const clientSnap = await getDoc(doc(db, "users", req.clientUid));
//       const clientData = clientSnap.exists() ? clientSnap.data() : {};

//       navigate(`/chat/${chatId}`, {
//         state: {
//           currentUid: req.freelancerId,
//           otherUid: req.clientUid,
//           otherName:
//             clientData.firstName && clientData.lastName
//               ? `${clientData.firstName} ${clientData.lastName}`
//               : "Client",
//           otherImage: clientData.profileImage || "",
//           initialMessage: "",
//         },
//       });
//     } catch (err) {
//       console.error("Accept error:", err);
//       alert("❌ Failed to accept request");
//     }
//   };

//   /* ================= REJECT (🔥 FULLY FIXED) ================= */
//   const rejectRequest = async (req) => {
//     try {
//       // 1️⃣ delete notification
//       await deleteDoc(doc(db, "notifications", req.id));

//       // 2️⃣ reset service (SAFE)
//       if (req.serviceId) {
//         const serviceRef = doc(db, "services", req.serviceId);
//         const serviceSnap = await getDoc(serviceRef);

//         if (serviceSnap.exists()) {
//           await updateDoc(serviceRef, {
//             read: false,
//             freelancerId: null,
//           });
//         }

//         const service24Ref = doc(db, "service_24h", req.serviceId);
//         const service24Snap = await getDoc(service24Ref);

//         if (service24Snap.exists()) {
//           await updateDoc(service24Ref, {
//             read: false,
//             freelancerId: null,
//           });
//         }
//       }

//       // 3️⃣ update UI
//       setRequests((prev) => prev.filter((r) => r.id !== req.id));

//       alert("❌ Request rejected successfully");
//     } catch (err) {
//       console.error("Reject error:", err);
//       alert("❌ Failed to reject request");
//     }
//   };

//   /* ================= UI ================= */
//   if (loading) {
//     return (
//       <div style={{ padding: 20 }}>
//         <h2>Loading requests...</h2>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div style={{ padding: 20 }}>
//         <h2>Please login to see requests.</h2>
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: 20, minHeight: "100vh", background: "#f5f5f5" }}>
//       <h1>Pending Requests</h1>

//       {requests.length === 0 && (
//         <p style={{ color: "#777" }}>No pending requests.</p>
//       )}

//       {requests.map((req) => (
//         <div
//           key={req.id}
//           style={{
//             background: "#fff",
//             padding: 14,
//             borderRadius: 12,
//             marginBottom: 12,
//             boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
//           }}
//         >
//           <h4>{req.title || req.jobTitle}</h4>
//           <p>{req.body}</p>

//           <div style={{ display: "flex", gap: 12 }}>
//             <button
//               onClick={() => acceptRequest(req)}
//               style={{
//                 padding: "8px 16px",
//                 background: "#4CAF50",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: 8,
//               }}
//             >
//               Accept
//             </button>

//             <button
//               onClick={() => rejectRequest(req)}
//               style={{
//                 padding: "8px 16px",
//                 background: "#F44336",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: 8,
//               }}
//             >
//               Reject
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }




// import React, { useEffect, useState } from "react";
// import { auth, db, rtdb } from "../../firbase/Firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import {
//   collection,
//   query,
//   where,
//   onSnapshot,
//   doc,
//   updateDoc,
//   getDoc,
//   deleteDoc,
// } from "firebase/firestore";
// import { ref, set, onValue } from "firebase/database";
// import { useNavigate } from "react-router-dom";

// export default function FreelancerRequestsAndChats() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [requests, setRequests] = useState([]);
//   const [acceptedChats, setAcceptedChats] = useState([]);

//   // ===== Auth State =====
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser || null);
//       setLoading(false);
//     });
//     return unsub;
//   }, []);

//   // ===== Pending Requests =====
//   useEffect(() => {
//     if (!user) return;
//     const qPending = query(
//       collection(db, "notifications"),
//       where("freelancerId", "==", user.uid),
//       where("read", "==", false)
//     );

//     const unsub = onSnapshot(qPending, (snap) => {
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setRequests(list);
//     });

//     return unsub;
//   }, [user]);

//   // ===== Accepted Chats =====
//   useEffect(() => {
//     if (!user) return;

//     const qAccepted = query(
//       collection(db, "notifications"),
//       where("freelancerId", "==", user.uid),
//       where("read", "==", true)
//     );

//     const unsub = onSnapshot(qAccepted, (snap) => {
//       const acceptedClients = snap.docs.map((d) => d.data().clientUid);
//       const userChatsRef = ref(rtdb, `userChats/${user.uid}`);

//       onValue(userChatsRef, async (chatsSnap) => {
//         const val = chatsSnap.val() || {};
//         const filtered = await Promise.all(
//           Object.entries(val)
//             .filter(([_, chatData]) => acceptedClients.includes(chatData.withUid))
//             .map(async ([chatId, chatData]) => {
//               const clientRef = doc(db, "users", chatData.withUid);
//               const clientSnap = await getDoc(clientRef);
//               const clientData = clientSnap.exists() ? clientSnap.data() : {};
//               return {
//                 chatId,
//                 ...chatData,
//                 clientName: clientData?.firstName
//                   ? `${clientData.firstName} ${clientData.lastName || ""}`
//                   : "Client",
//                 clientImg: clientData?.profileImage || null,
//               };
//             })
//         );

//         filtered.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));
//         setAcceptedChats(filtered);
//       });
//     });

//     return unsub;
//   }, [user]);

//   // ===== Accept Request =====
//   const acceptRequest = async (req) => {
//     try {
//       await updateDoc(doc(db, "notifications", req.id), { read: true });

//       const chatId = `${req.freelancerId}_${req.clientUid}`;
//       await set(ref(rtdb, `userChats/${req.freelancerId}/${chatId}`), {
//         withUid: req.clientUid,
//         lastMessage: "",
//         lastMessageTime: Date.now(),
//       });

//       const clientSnap = await getDoc(doc(db, "users", req.clientUid));
//       const clientData = clientSnap.exists() ? clientSnap.data() : {};

//       navigate(`/chat/${chatId}`, {
//         state: {
//           currentUid: req.freelancerId,
//           otherUid: req.clientUid,
//           otherName: clientData?.firstName
//             ? `${clientData.firstName} ${clientData.lastName || ""}`
//             : "Client",
//           otherImage: clientData?.profileImage || "",
//           initialMessage: "",
//         },
//       });
//     } catch (err) {
//       console.error("Accept error:", err);
//       alert("❌ Failed to accept request");
//     }
//   };

//   // ===== Reject Request (both services & service_24h) =====
//   const rejectRequest = async (req) => {
//     try {
//       await deleteDoc(doc(db, "notifications", req.id));

//       if (req.serviceId) {
//         const serviceRefs = [
//           doc(db, "services", req.serviceId),
//           doc(db, "service_24h", req.serviceId),
//         ];

//         for (const serviceRef of serviceRefs) {
//           const snap = await getDoc(serviceRef);
//           if (snap.exists()) {
//             await updateDoc(serviceRef, { read: false, freelancerId: null });
//           }
//         }
//       }

//       setRequests((prev) => prev.filter((r) => r.id !== req.id));
//       alert("❌ Request rejected successfully");
//     } catch (err) {
//       console.error("Reject error:", err);
//       alert("❌ Failed to reject request");
//     }
//   };

//   // ===== Loading & Auth UI =====
//   if (loading)
//     return <div style={{ padding: 20 }}><h2>Loading requests...</h2></div>;
//   if (!user)
//     return <div style={{ padding: 20 }}><h2>Please login to see requests.</h2></div>;

//   // ===== Render =====
//   return (
//     <div style={{ padding: 20, minHeight: "100vh", background: "#f5f5f5" }}>
//       {/* Pending Requests */}
//       <h1>Pending Requests</h1>
//       {requests.length === 0 && <p style={{ color: "#777" }}>No pending requests.</p>}
//       {requests.map((req) => (
//         <div
//           key={req.id}
//           style={{
//             background: "#fff",
//             padding: 14,
//             borderRadius: 12,
//             marginBottom: 12,
//             boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
//           }}
//         >
//           <h4>{req.title || req.jobTitle}</h4>
//           <p>{req.body}</p>
//           <div style={{ display: "flex", gap: 12 }}>
//             <button
//               onClick={() => acceptRequest(req)}
//               style={{
//                 padding: "8px 16px",
//                 background: "#4CAF50",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: 8,
//               }}
//             >
//               Accept
//             </button>
//             <button
//               onClick={() => rejectRequest(req)}
//               style={{
//                 padding: "8px 16px",
//                 background: "#F44336",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: 8,
//               }}
//             >
//               Reject
//             </button>
//           </div>
//         </div>
//       ))}

//       {/* Accepted Chats */}
//       <h1 style={{ marginTop: 24 }}>Accepted Chats</h1>
//       {acceptedChats.length === 0 && <p style={{ color: "#777" }}>No accepted chats yet.</p>}
//       {acceptedChats.map((chat) => (
//         <div
//           key={chat.chatId}
//           onClick={() =>
//             navigate("/chat", {
//               state: { currentUid: user.uid, otherUid: chat.withUid },
//             })
//           }
//           style={{
//             background: "#fff",
//             padding: 14,
//             borderRadius: 12,
//             marginBottom: 12,
//             boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
//             cursor: "pointer",
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//             <img
//               src={chat.clientImg || "/placeholder.png"}
//               alt="profile"
//               style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }}
//             />
//             <h4 style={{ margin: 0 }}>{chat.clientName}</h4>
//           </div>
//           <p style={{ color: "#444", marginTop: 8 }}>
//             {chat.lastMessage || "No messages yet"}
//           </p>
//           <small style={{ color: "#777" }}>
//             {chat.lastMessageTime
//               ? new Date(chat.lastMessageTime).toLocaleString()
//               : ""}
//           </small>
//         </div>
//       ))}
//     </div>
//   );
// }




// import React, { useEffect, useState } from "react";
// import { auth, db, rtdb } from "../../firbase/Firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import {
//   collection,
//   query,
//   where,
//   onSnapshot,
//   doc,
//   updateDoc,
//   getDoc,
//   deleteDoc,
// } from "firebase/firestore";
// import { ref, set, onValue } from "firebase/database";
// import { useNavigate } from "react-router-dom";

// export default function FreelancerRequestsAndChats() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [requests, setRequests] = useState([]);
//   const [acceptedChats, setAcceptedChats] = useState([]);

//   // ===== Auth State =====
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser || null);
//       setLoading(false);
//     });
//     return unsub;
//   }, []);

//   // ===== Pending Requests =====
//   useEffect(() => {
//     if (!user) return;
//     const qPending = query(
//       collection(db, "notifications"),
//       where("freelancerId", "==", user.uid),
//       where("read", "==", false)
//     );

//     const unsub = onSnapshot(qPending, (snap) => {
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setRequests(list);
//     });

//     return unsub;
//   }, [user]);

//   // ===== Accepted Chats =====
//   useEffect(() => {
//     if (!user) return;

//     const qAccepted = query(
//       collection(db, "notifications"),
//       where("freelancerId", "==", user.uid),
//       where("read", "==", true)
//     );

//     const unsub = onSnapshot(qAccepted, (snap) => {
//       const acceptedClients = snap.docs.map((d) => d.data().clientUid);
//       const userChatsRef = ref(rtdb, `userChats/${user.uid}`);

//       onValue(userChatsRef, async (chatsSnap) => {
//         const val = chatsSnap.val() || {};
//         const filtered = await Promise.all(
//           Object.entries(val)
//             .filter(([_, chatData]) => acceptedClients.includes(chatData.withUid))
//             .map(async ([chatId, chatData]) => {
//               const clientRef = doc(db, "users", chatData.withUid);
//               const clientSnap = await getDoc(clientRef);
//               const clientData = clientSnap.exists() ? clientSnap.data() : {};
//               return {
//                 chatId,
//                 ...chatData,
//                 clientName: clientData?.firstName
//                   ? `${clientData.firstName} ${clientData.lastName || ""}`
//                   : "Client",
//                 clientImg: clientData?.profileImage || null,
//               };
//             })
//         );

//         filtered.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));
//         setAcceptedChats(filtered);
//       });
//     });

//     return unsub;
//   }, [user]);

//   // ===== Accept Request =====
//   const acceptRequest = async (req) => {
//     try {
//       await updateDoc(doc(db, "notifications", req.id), { read: true });

//       const chatId = `${req.freelancerId}_${req.clientUid}`;
//       await set(ref(rtdb, `userChats/${req.freelancerId}/${chatId}`), {
//         withUid: req.clientUid,
//         lastMessage: "",
//         lastMessageTime: Date.now(),
//       });

//       const clientSnap = await getDoc(doc(db, "users", req.clientUid));
//       const clientData = clientSnap.exists() ? clientSnap.data() : {};

//       navigate(`/chat/${chatId}`, {
//         state: {
//           currentUid: req.freelancerId,
//           otherUid: req.clientUid,
//           otherName: clientData?.firstName
//             ? `${clientData.firstName} ${clientData.lastName || ""}`
//             : "Client",
//           otherImage: clientData?.profileImage || "",
//           initialMessage: "",
//         },
//       });
//     } catch (err) {
//       console.error("Accept error:", err);
//       alert("❌ Failed to accept request");
//     }
//   };

//   // ===== Reject Request (both services & service_24h) =====
//   const rejectRequest = async (req) => {
//     try {
//       await deleteDoc(doc(db, "notifications", req.id));

//       if (req.serviceId) {
//         const serviceRefs = [
//           doc(db, "services", req.serviceId),
//           doc(db, "service_24h", req.serviceId),
//         ];

//         for (const serviceRef of serviceRefs) {
//           const snap = await getDoc(serviceRef);
//           if (snap.exists()) {
//             await updateDoc(serviceRef, { read: false, freelancerId: null });
//           }
//         }
//       }

//       setRequests((prev) => prev.filter((r) => r.id !== req.id));
//       alert(" Request rejected successfully");
//     } catch (err) {
//       console.error("Reject error:", err);
//       alert("❌ Failed to reject request");
//     }
//   };

//   // ===== Loading & Auth UI =====
//   if (loading)
//     return <div style={{ padding: 20 }}><h2>Loading requests...</h2></div>;
//   if (!user)
//     return <div style={{ padding: 20 }}><h2>Please login to see requests.</h2></div>;

//   // ===== Render =====
//   return (
//     <div style={{ padding: 20, minHeight: "100vh", background: "#f5f5f5" }}>
//       {/* Pending Requests */}
//       <h1>Pending Requests</h1>
//       {requests.length === 0 && <p style={{ color: "#777" }}>No pending requests.</p>}
//       {requests.map((req) => (
//         <div
//           key={req.id}
//           style={{
//             background: "#fff",
//             padding: 14,
//             borderRadius: 12,
//             marginBottom: 12,
//             boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
//           }}
//         >
//           <h4>{req.title || req.jobTitle}</h4>
//           <p>{req.body}</p>
//           <div style={{ display: "flex", gap: 12 }}>
//             <button
//               onClick={() => acceptRequest(req)}
//               style={{
//                 padding: "8px 16px",
//                 background: "#4CAF50",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: 8,
//               }}
//             >
//               Accept
//             </button>
//             <button
//               onClick={() => rejectRequest(req)}
//               style={{
//                 padding: "8px 16px",
//                 background: "#F44336",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: 8,
//               }}
//             >
//               Reject
//             </button>
//           </div>
//         </div>
//       ))}

//       {/* Accepted Chats */}
//       <h1 style={{ marginTop: 24 }}>Accepted Chats</h1>
//       {acceptedChats.length === 0 && <p style={{ color: "#777" }}>No accepted chats yet.</p>}
//       {acceptedChats.map((chat) => (
//         <div
//           key={chat.chatId}
//           onClick={() =>
//             navigate("/chat", {
//               state: { currentUid: user.uid, otherUid: chat.withUid },
//             })
//           }
//           style={{
//             background: "#fff",
//             padding: 14,
//             borderRadius: 12,
//             marginBottom: 12,
//             boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
//             cursor: "pointer",
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//             <img
//               src={chat.clientImg || "/placeholder.png"}
//               alt="profile"
//               style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }}
//             />
//             <h4 style={{ margin: 0 }}>{chat.clientName}</h4>
//           </div>
//           <p style={{ color: "#444", marginTop: 8 }}>
//             {chat.lastMessage || "No messages yet"}
//           </p>
//           <small style={{ color: "#777" }}>
//             {chat.lastMessageTime
//               ? new Date(chat.lastMessageTime).toLocaleString()
//               : ""}
//           </small>
//         </div>
//       ))}
//     </div>
//   );
// }



// import React, { useEffect, useState } from "react";
// import { auth, db, rtdb } from "../../firbase/Firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import {
//   collection,
//   query,
//   where,
//   onSnapshot,
//   doc,
//   updateDoc,
//   getDoc,
//   deleteDoc,
// } from "firebase/firestore";
// import { ref, set, onValue } from "firebase/database";
// import { useNavigate } from "react-router-dom";

// export default function FreelancerRequestsAndChats() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [requests, setRequests] = useState([]);
//   const [acceptedChats, setAcceptedChats] = useState([]);

//   // ===== Auth State =====
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser || null);
//       setLoading(false);
//     });
//     return unsub;
//   }, []);

//   // ===== Pending Requests =====
//   useEffect(() => {
//     if (!user) return;
//     const qPending = query(
//       collection(db, "notifications"),
//       where("freelancerId", "==", user.uid),
//       where("read", "==", false)
//     );

//     const unsub = onSnapshot(qPending, (snap) => {
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setRequests(list);
//     });

//     return unsub;
//   }, [user]);

//   // ===== Accepted Chats =====
//   useEffect(() => {
//     if (!user) return;

//     const qAccepted = query(
//       collection(db, "notifications"),
//       where("freelancerId", "==", user.uid),
//       where("read", "==", true)
//     );

//     const unsub = onSnapshot(qAccepted, (snap) => {
//       const acceptedClients = snap.docs.map((d) => d.data().clientUid);
//       const userChatsRef = ref(rtdb, `userChats/${user.uid}`);

//       onValue(userChatsRef, async (chatsSnap) => {
//         const val = chatsSnap.val() || {};
//         const filtered = await Promise.all(
//           Object.entries(val)
//             .filter(([_, chatData]) => acceptedClients.includes(chatData.withUid))
//             .map(async ([chatId, chatData]) => {
//               const clientRef = doc(db, "users", chatData.withUid);
//               const clientSnap = await getDoc(clientRef);
//               const clientData = clientSnap.exists() ? clientSnap.data() : {};
//               return {
//                 chatId,
//                 ...chatData,
//                 clientName: clientData?.firstName
//                   ? `${clientData.firstName} ${clientData.lastName || ""}`
//                   : "Client",
//                 clientImg: clientData?.profileImage || null,
//               };
//             })
//         );

//         filtered.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));
//         setAcceptedChats(filtered);
//       });
//     });

//     return unsub;
//   }, [user]);

//   // ===== Accept Request =====
//   const acceptRequest = async (req) => {
//     try {
//       await updateDoc(doc(db, "notifications", req.id), { read: true });

//       const chatId = `${req.freelancerId}_${req.clientUid}`;
//       await set(ref(rtdb, `userChats/${req.freelancerId}/${chatId}`), {
//         withUid: req.clientUid,
//         lastMessage: "",
//         lastMessageTime: Date.now(),
//       });

//       const clientSnap = await getDoc(doc(db, "users", req.clientUid));
//       const clientData = clientSnap.exists() ? clientSnap.data() : {};

//       navigate(`/chat/${chatId}`, {
//         state: {
//           currentUid: req.freelancerId,
//           otherUid: req.clientUid,
//           otherName: clientData?.firstName
//             ? `${clientData.firstName} ${clientData.lastName || ""}`
//             : "Client",
//           otherImage: clientData?.profileImage || "",
//           initialMessage: "vicky",
//         },
//       });
//     } catch (err) {
//       console.error("Accept error:", err);
//       alert("❌ Failed to accept request");
//     }
//   };

//   // ===== Reject Request (both services & service_24h) =====
//   const rejectRequest = async (req) => {
//     try {
//       await deleteDoc(doc(db, "notifications", req.id));

//       if (req.serviceId) {
//         const serviceRefs = [
//           doc(db, "services", req.serviceId),
//           doc(db, "service_24h", req.serviceId),
//         ];

//         for (const serviceRef of serviceRefs) {
//           const snap = await getDoc(serviceRef);
//           if (snap.exists()) {
//             await updateDoc(serviceRef, { read: false, freelancerId: null });
//           }
//         }
//       }

//       setRequests((prev) => prev.filter((r) => r.id !== req.id));
//       alert(" Request rejected successfully");
//     } catch (err) {
//       console.error("Reject error:", err);
//       alert("❌ Failed to reject request");
//     }
//   };

//   // ===== Loading & Auth UI =====
//   if (loading)
//     return <div style={{ padding: 20 }}><h2>Loading requests...</h2></div>;
//   if (!user)
//     return <div style={{ padding: 20 }}><h2>Please login to see requests.</h2></div>;

//   // ===== Render =====
//   return (
//     <div id="fh-page" className="fh-page rubik-font">
//       <div id="fh-containers" className="fh-container" >

//         <div style={{ padding: 20, minHeight: "100vh",  }}>
//           {/* Pending Requests */}
//           <h1>Pending Requests</h1>
//           {requests.length === 0 && <p style={{ color: "#777" }}>No pending requests.</p>}
//           {requests.map((req) => (
//             <div
//               key={req.id}
//               style={{
//                 background: "#fff",
//                 padding: 14,
//                 borderRadius: 12,
//                 marginBottom: 12,
//                 boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
//               }}
//             >
//               <h4>{req.title || req.jobTitle}</h4>
//               <p>{req.body}</p>
//               <div style={{ display: "flex", gap: 12 }}>
//                 <button
//                   onClick={() => acceptRequest(req)}
//                   style={{
//                     padding: "8px 16px",
//                     background: "#4CAF50",
//                     color: "#fff",
//                     border: "none",
//                     borderRadius: 8,
//                   }}
//                 >
//                   Accept
//                 </button>
//                 <button
//                   onClick={() => rejectRequest(req)}
//                   style={{
//                     padding: "8px 16px",
//                     background: "#F44336",
//                     color: "#fff",
//                     border: "none",
//                     borderRadius: 8,
//                   }}
//                 >
//                   Reject
//                 </button>
//               </div>
//             </div>
//           ))}

//           {/* Accepted Chats
//       <h1 style={{ marginTop: 24 }}>Accepted Chats</h1>
//       {acceptedChats.length === 0 && <p style={{ color: "#777" }}>No accepted chats yet.</p>}
//       {acceptedChats.map((chat) => (
//         <div
//           key={chat.chatId}
//           onClick={() =>
//             navigate("/chat", {
//               state: { currentUid: user.uid, otherUid: chat.withUid },
//             })
//           }
//           style={{
//             background: "#fff",
//             padding: 14,
//             borderRadius: 12,
//             marginBottom: 12,
//             boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
//             cursor: "pointer",
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//             <img
//               src={chat.clientImg || "/placeholder.png"}
//               alt="profile"
//               style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }}
//             />
            
//             <h4 style={{ margin: 0 }}>{chat.clientName}</h4>
//           </div>
//           <p style={{ color: "#444", marginTop: 8 }}>
//             {chat.lastMessage || "No messages yet"}
//           </p>
//           <small style={{ color: "#777" }}>
//             {chat.lastMessageTime
//               ? new Date(chat.lastMessageTime).toLocaleString()
//               : ""}
//           </small>
//         </div>
//       ))} */}
//         </div>

//       </div>
//     </div>

//   );
// }




import React, { useEffect, useState } from "react";
import { auth, db, rtdb } from "../../firbase/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { ref, set, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";

export default function FreelancerRequestsAndChats() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [acceptedChats, setAcceptedChats] = useState([]);

  /* =======================
     ⭐ SIDEBAR COLLAPSED STATE
  ======================= */
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  /* =======================
     ⭐ LISTEN SIDEBAR TOGGLE
  ======================= */
  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  // ===== Auth State =====
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
      setLoading(false);
    });
    return unsub;
  }, []);

  // ===== Pending Requests =====
  useEffect(() => {
    if (!user) return;
    const qPending = query(
      collection(db, "notifications"),
      where("freelancerId", "==", user.uid),
      where("read", "==", false)
    );

    const unsub = onSnapshot(qPending, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setRequests(list);
    });

    return unsub;
  }, [user]);

  // ===== Accepted Chats =====
  useEffect(() => {
    if (!user) return;

    const qAccepted = query(
      collection(db, "notifications"),
      where("freelancerId", "==", user.uid),
      where("read", "==", true)
    );

    const unsub = onSnapshot(qAccepted, (snap) => {
      const acceptedClients = snap.docs.map((d) => d.data().clientUid);
      const userChatsRef = ref(rtdb, `userChats/${user.uid}`);

      onValue(userChatsRef, async (chatsSnap) => {
        const val = chatsSnap.val() || {};
        const filtered = await Promise.all(
          Object.entries(val)
            .filter(([_, chatData]) =>
              acceptedClients.includes(chatData.withUid)
            )
            .map(async ([chatId, chatData]) => {
              const clientRef = doc(db, "users", chatData.withUid);
              const clientSnap = await getDoc(clientRef);
              const clientData = clientSnap.exists()
                ? clientSnap.data()
                : {};
              return {
                chatId,
                ...chatData,
                clientName: clientData?.firstName
                  ? `${clientData.firstName} ${clientData.lastName || ""}`
                  : "Client",
                clientImg: clientData?.profileImage || null,
              };
            })
        );

        filtered.sort(
          (a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0)
        );
        setAcceptedChats(filtered);
      });
    });

    return unsub;
  }, [user]);

  // ===== Accept Request =====
  const acceptRequest = async (req) => {
    try {
      await updateDoc(doc(db, "notifications", req.id), { read: true });

      const chatId = `${req.freelancerId}_${req.clientUid}`;
      await set(ref(rtdb, `userChats/${req.freelancerId}/${chatId}`), {
        withUid: req.clientUid,
        lastMessage: "",
        lastMessageTime: Date.now(),
      });

      const clientSnap = await getDoc(doc(db, "users", req.clientUid));
      const clientData = clientSnap.exists() ? clientSnap.data() : {};

      navigate(`/chat/${chatId}`, {
        state: {
          currentUid: req.freelancerId,
          otherUid: req.clientUid,
          otherName: clientData?.firstName
            ? `${clientData.firstName} ${clientData.lastName || ""}`
            : "Client",
          otherImage: clientData?.profileImage || "",
          initialMessage: "vicky",
        },
      });
    } catch (err) {
      console.error("Accept error:", err);
      alert("❌ Failed to accept request");
    }
  };

  // ===== Reject Request =====
  const rejectRequest = async (req) => {
    try {
      await deleteDoc(doc(db, "notifications", req.id));

      if (req.serviceId) {
        const serviceRefs = [
          doc(db, "services", req.serviceId),
          doc(db, "service_24h", req.serviceId),
        ];

        for (const serviceRef of serviceRefs) {
          const snap = await getDoc(serviceRef);
          if (snap.exists()) {
            await updateDoc(serviceRef, {
              read: false,
              freelancerId: null,
            });
          }
        }
      }

      setRequests((prev) => prev.filter((r) => r.id !== req.id));
      alert(" Request rejected successfully");
    } catch (err) {
      console.error("Reject error:", err);
      alert("❌ Failed to reject request");
    }
  };

  if (loading)
    return (
      <div style={{ padding: 20 }}>
        <h2>Loading requests...</h2>
      </div>
    );
  if (!user)
    return (
      <div style={{ padding: 20 }}>
        <h2>Please login to see requests.</h2>
      </div>
    );

  /* =======================
     ⭐ WRAPPED WITH SIDEBAR MARGIN
  ======================= */
  return (
    <div
      className="freelance-wrapper"
      style={{
        marginLeft: collapsed ? "-410px" : "-270px",
        transition: "margin-left 0.25s ease",
      }}
    >
      <div id="fh-page" className="fh-page rubik-font">
        <div id="fh-containers" className="fh-container">
          <div style={{ padding: 20, minHeight: "100vh" }}>
            <h1>Pending Requests</h1>

            {requests.length === 0 && (
              <p style={{ color: "#777" }}>No pending requests.</p>
            )}

            {requests.map((req) => (
              <div
                key={req.id}
                style={{
                  background: "#fff",
                  padding: 14,
                  borderRadius: 12,
                  marginBottom: 12,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                }}
              >
                <h4>{req.title || req.jobTitle}</h4>
                <p>{req.body}</p>
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={() => acceptRequest(req)}
                    style={{
                      padding: "8px 16px",
                      background: "#4CAF50",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                    }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => rejectRequest(req)}
                    style={{
                      padding: "8px 16px",
                      background: "#F44336",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
