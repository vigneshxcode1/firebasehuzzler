// // ChatPage.jsx
// import React, { useEffect, useState, useRef } from "react";
// import {
//   getDatabase,
//   ref,
//   onValue,
//   push,
//   set,
//   update,
// } from "firebase/database";

// import { IoSend } from "react-icons/io5";
// import Picker from "emoji-picker-react";
// import { useLocation } from "react-router-dom";

// // Firebase Storage
// import {
//   getStorage,
//   ref as storageRef,
//   uploadBytes,
//   getDownloadURL,
// } from "firebase/storage";

// export default function ChatPage() {
//   const { state } = useLocation();

//   const currentUid = state?.currentUid;
//   const otherUid = state?.otherUid;
//   const otherName = state?.otherName || "User";
//   const otherImage = state?.otherImage || "";
//   const initialMessage = state?.initialMessage || "";

//   const db = getDatabase();
//   const storage = getStorage();

//   const [messages, setMessages] = useState([]);
//   const [inputText, setInputText] = useState(initialMessage || "");
//   const [showEmoji, setShowEmoji] = useState(false);

//   const scrollRef = useRef(null);

//   // VALIDATION
//   if (!currentUid || !otherUid) {
//     return (
//       <div
//         style={{ textAlign: "center", padding: 30, fontSize: 18, color: "red" }}
//       >
//         ⚠ Chat cannot open. Missing UID values.
//       </div>
//     );
//   }

//   // STABLE CHAT ID
//   const chatId =
//     currentUid < otherUid
//       ? `${currentUid}_${otherUid}`
//       : `${otherUid}_${currentUid}`;

//   // FETCH MESSAGES
//   useEffect(() => {
//     const msgRef = ref(db, `chats/${chatId}/messages`);

//     return onValue(msgRef, (snapshot) => {
//       const data = snapshot.val() || {};
//       const list = Object.values(data).sort(
//         (a, b) => a.timestamp - b.timestamp
//       );
//       setMessages(list);

//       scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//     });
//   }, [chatId]);

//   // SEND TEXT MESSAGE
//   const sendMessage = async () => {
//     if (!inputText.trim()) return;

//     const msgRef = ref(db, `chats/${chatId}/messages`);
//     const newMsgRef = push(msgRef);

//     const payload = {
//       id: newMsgRef.key,
//       text: inputText,
//       senderId: currentUid,
//       receiverId: otherUid,
//       type: "text",
//       timestamp: Date.now(),
//       status: "sent",
//       reactions: {},
//     };

//     await set(newMsgRef, payload);

//     const now = Date.now();

//     // Update metadata
//     await update(ref(db, `userChats/${currentUid}/${chatId}`), {
//       withUid: otherUid,
//       otherName,
//       otherImage,
//       lastMessage: inputText,
//       lastMessageTime: now,
//     });

//     await update(ref(db, `userChats/${otherUid}/${chatId}`), {
//       withUid: currentUid,
//       otherName: "You",
//       lastMessage: inputText,
//       lastMessageTime: now,
//     });

//     setInputText("");
//   };

//   // FILE / IMAGE UPLOAD
//   const handleFileUpload = async (file) => {
//     if (!file) return;

//     try {
//       const safeName = file.name.replace(/\s+/g, "_");
//       const filePath = `chatFiles/${chatId}/${Date.now()}_${safeName}`;
//       const fileRef = storageRef(storage, filePath);

//       // Upload to Storage
//       await uploadBytes(fileRef, file);
//       const downloadURL = await getDownloadURL(fileRef);

//       // Save message in realtime DB
//       const msgRef = ref(db, `chats/${chatId}/messages`);
//       const newMsgRef = push(msgRef);

//       const payload = {
//         id: newMsgRef.key,
//         senderId: currentUid,
//         receiverId: otherUid,
//         type: file.type.startsWith("image/") ? "image" : "file",
//         url: downloadURL,
//         fileName: safeName,
//         timestamp: Date.now(),
//         status: "sent",
//         reactions: {},
//       };

//       await set(newMsgRef, payload);

//       const now = Date.now();

//       await update(ref(db, `userChats/${currentUid}/${chatId}`), {
//         withUid: otherUid,
//         otherName,
//         otherImage,
//         lastMessage: safeName,
//         lastMessageTime: now,
//       });

//       await update(ref(db, `userChats/${otherUid}/${chatId}`), {
//         withUid: currentUid,
//         otherName: "You",
//         lastMessage: safeName,
//         lastMessageTime: now,
//       });
//     } catch (err) {
//       console.error("FILE UPLOAD ERROR:", err);
//     }
//   };

//   // EMOJI PICKER
//   const onEmojiClick = (emojiObj) => {
//     setInputText((prev) => prev + emojiObj.emoji);
//   };

//   // UI
//   return (
//     <div
//       style={{
//         height: "100vh",
//         display: "flex",
//         flexDirection: "column",
//         background: "#f5f5f5",
//       }}
//     >
//       {/* HEADER */}
//       <div
//         style={{
//           padding: 15,
//           display: "flex",
//           alignItems: "center",
//           gap: 15,
//           background: "white",
//           boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
//         }}
//       >
//         <img
//           src={otherImage || "https://i.ibb.co/sqsJwP0/user.png"}
//           style={{
//             width: 50,
//             height: 50,
//             borderRadius: "50%",
//             objectFit: "cover",
//           }}
//         />
//         <div>
//           <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
//             {otherName}
//           </h3>
//           <p style={{ margin: 0, fontSize: 12, color: "gray" }}>Online</p>
//         </div>
//       </div>

//       {/* MESSAGES */}
//       <div style={{ flex: 1, overflowY: "auto", padding: 15 }}>
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             style={{
//               display: "flex",
//               justifyContent:
//                 msg.senderId === currentUid ? "flex-end" : "flex-start",
//               marginBottom: 8,
//             }}
//           >
//             <div
//               style={{
//                 padding: "10px 14px",
//                 maxWidth: "65%",
//                 borderRadius: 16,
//                 background:
//                   msg.senderId === currentUid ? "#1877f2" : "#e0e0e0",
//                 color: msg.senderId === currentUid ? "white" : "black",
//                 fontSize: 14,
//                 wordBreak: "break-word",
//               }}
//             >
//               {/* IMAGE */}
//               {msg.type === "image" && (
//                 <img
//                   src={msg.url}
//                   alt="img"
//                   style={{ maxWidth: "200px", borderRadius: 10, marginTop: 5 }}
//                 />
//               )}

//               {/* FILE */}
//               {msg.type === "file" && (
//                 <a
//                   href={msg.url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   style={{
//                     color: msg.senderId === currentUid ? "white" : "blue",
//                     textDecoration: "underline",
//                   }}
//                 >
//                   📄 {msg.fileName}
//                 </a>
//               )}

//               {/* TEXT */}
//               {msg.type === "text" && msg.text}
//             </div>
//           </div>
//         ))}
//         <div ref={scrollRef}></div>
//       </div>

//       {/* EMOJI PICKER */}
//       {showEmoji && (
//         <div
//           style={{
//             position: "absolute",
//             bottom: 70,
//             left: 10,
//             zIndex: 100,
//           }}
//         >
//           <Picker onEmojiClick={onEmojiClick} />
//         </div>
//       )}

//       {/* INPUT BAR */}
//       <div
//         style={{
//           padding: 10,
//           background: "white",
//           display: "flex",
//           alignItems: "center",
//           gap: 10,
//           borderTop: "1px solid #ddd",
//           position: "relative",
//         }}
//       >
//         {/* Emoji */}
//         <button
//           onClick={() => setShowEmoji(!showEmoji)}
//           style={{
//             background: "none",
//             border: "none",
//             fontSize: 24,
//             cursor: "pointer",
//           }}
//         >
//           😊
//         </button>

//         {/* File Input */}
//         <input
//           type="file"
//           id="fileInput"
//           accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
//           style={{ display: "none" }}
//           onChange={(e) => handleFileUpload(e.target.files[0])}
//         />

//         {/* Attachment Button */}
//         <button
//           onClick={() => document.getElementById("fileInput").click()}
//           style={{
//             background: "none",
//             border: "none",
//             fontSize: 22,
//             cursor: "pointer",
//           }}
//         >
//           📎
//         </button>

//         {/* Text Input */}
//         <input
//           type="text"
//           value={inputText}
//           onChange={(e) => setInputText(e.target.value)}
//           placeholder="Type a message…"
//           style={{
//             flex: 1,
//             padding: 12,
//             borderRadius: 20,
//             border: "1px solid #ccc",
//             fontSize: 14,
//           }}
//         />

//         {/* Send Button */}
//         <button
//           onClick={sendMessage}
//           style={{
//             background: "#1877f2",
//             border: "none",
//             color: "white",
//             padding: "12px 15px",
//             borderRadius: 20,
//             cursor: "pointer",
//           }}
//         >
//           <IoSend size={22} />
//         </button>
//       </div>
//     </div>
//   );
// }













// import React, { useEffect, useState, useRef } from "react";
// import {
//   getDatabase,
//   ref,
//   onValue,
//   push,
//   set,
//   update,
// } from "firebase/database";

// import { IoSend } from "react-icons/io5";
// import Picker from "emoji-picker-react";
// import { useLocation } from "react-router-dom";

// // Firebase Storage
// import {
//   getStorage,
//   ref as storageRef,
//   uploadBytes,
//   getDownloadURL,
// } from "firebase/storage";

// // Firestore imports (needed for request system)
// import {
//   getFirestore,
//   collection,
//   query,
//   where,
//   onSnapshot,
//   updateDoc,
//   doc,
// } from "firebase/firestore";

// export default function ChatPage() {
//   const { state } = useLocation();

//   const currentUid = state?.currentUid;
//   const otherUid = state?.otherUid;
//   const otherName = state?.otherName || "User";
//   const otherImage = state?.otherImage || "";
//   const initialMessage = state?.initialMessage || "";

//   const db = getDatabase();       // RTDB
//   const fs = getFirestore();      // Firestore
//   const storage = getStorage();   // Storage

//   const [messages, setMessages] = useState([]);
//   const [inputText, setInputText] = useState(initialMessage || "");
//   const [showEmoji, setShowEmoji] = useState(false);
//   const [pendingRequest, setPendingRequest] = useState(null);

//   const scrollRef = useRef(null);

//   // VALIDATION
//   if (!currentUid || !otherUid) {
//     return (
//       <div style={{ textAlign: "center", padding: 30, fontSize: 18, color: "red" }}>
//         ⚠ Chat cannot open. Missing UID values.
//       </div>
//     );
//   }

//   // STABLE CHAT ID
//   const chatId =
//     currentUid < otherUid
//       ? `${currentUid}_${otherUid}`
//       : `${otherUid}_${currentUid}`;

//   // FETCH MESSAGES (RTDB)
//   useEffect(() => {
//     const msgRef = ref(db, `chats/${chatId}/messages`);

//     return onValue(msgRef, (snapshot) => {
//       const data = snapshot.val() || {};
//       const list = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
//       setMessages(list);

//       scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//     });
//   }, [chatId, db]);

//   // FIRESTORE — pending request (freelancer side)
//   useEffect(() => {
//     if (!currentUid || !otherUid) return;

//     const q = query(
//       collection(fs, "collaboration_requests"),
//       where("clientId", "==", otherUid),
//       where("freelancerId", "==", currentUid)
//     );

//     const unsub = onSnapshot(q, (snap) => {
//       if (snap.empty) {
//         setPendingRequest(null);
//         return;
//       }
//       setPendingRequest({ id: snap.docs[0].id, ...snap.docs[0].data() });
//     });

//     return () => unsub();
//   }, [currentUid, otherUid, fs]);

//   // ACCEPT request
//   const acceptRequest = async () => {
//     if (!pendingRequest?.id) return;
//     await updateDoc(doc(fs, "collaboration_requests", pendingRequest.id), {
//       status: "accepted",
//     });
//   };

//   // REJECT request
//   const rejectRequest = async () => {
//     if (!pendingRequest?.id) return;
//     await updateDoc(doc(fs, "collaboration_requests", pendingRequest.id), {
//       status: "rejected",
//     });
//   };

//   // SEND TEXT MESSAGE (RTDB)
//   const sendMessage = async () => {
//     if (!inputText.trim() || pendingRequest?.status !== "accepted") return;

//     const msgRef = ref(db, `chats/${chatId}/messages`);
//     const newMsgRef = push(msgRef);

//     const payload = {
//       id: newMsgRef.key,
//       text: inputText,
//       senderId: currentUid,
//       receiverId: otherUid,
//       type: "text",
//       timestamp: Date.now(),
//       status: "sent",
//       reactions: {},
//     };

//     await set(newMsgRef, payload);

//     const now = Date.now();

//     // Chat metadata
//     await update(ref(db, `userChats/${currentUid}/${chatId}`), {
//       withUid: otherUid,
//       otherName,
//       otherImage,
//       lastMessage: inputText,
//       lastMessageTime: now,
//     });

//     await update(ref(db, `userChats/${otherUid}/${chatId}`), {
//       withUid: currentUid,
//       otherName: "You",
//       lastMessage: inputText,
//       lastMessageTime: now,
//     });

//     setInputText("");
//   };

//   // FILE / IMAGE UPLOAD
//   const handleFileUpload = async (file) => {
//     if (!file || pendingRequest?.status !== "accepted") return;

//     try {
//       const safeName = file.name.replace(/\s+/g, "_");
//       const filePath = `chatFiles/${chatId}/${Date.now()}_${safeName}`;
//       const fileRef = storageRef(storage, filePath);

//       await uploadBytes(fileRef, file);
//       const downloadURL = await getDownloadURL(fileRef);

//       const msgRef = ref(db, `chats/${chatId}/messages`);
//       const newMsgRef = push(msgRef);

//       const payload = {
//         id: newMsgRef.key,
//         senderId: currentUid,
//         receiverId: otherUid,
//         type: file.type.startsWith("image/") ? "image" : "file",
//         url: downloadURL,
//         fileName: safeName,
//         timestamp: Date.now(),
//         status: "sent",
//         reactions: {},
//       };

//       await set(newMsgRef, payload);

//       const now = Date.now();

//       await update(ref(db, `userChats/${currentUid}/${chatId}`), {
//         withUid: otherUid,
//         otherName,
//         otherImage,
//         lastMessage: safeName,
//         lastMessageTime: now,
//       });

//       await update(ref(db, `userChats/${otherUid}/${chatId}`), {
//         withUid: currentUid,
//         otherName: "You",
//         lastMessage: safeName,
//         lastMessageTime: now,
//       });
//     } catch (err) {
//       console.error("FILE UPLOAD ERROR:", err);
//     }
//   };

//   // EMOJI CLICK
//   const onEmojiClick = (emojiObj) => {
//     if (pendingRequest?.status !== "accepted") return;
//     setInputText((prev) => prev + emojiObj.emoji);
//   };

//   const canChat = pendingRequest?.status === "accepted";

//   return (
//     <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#f5f5f5" }}>

//       {/* ===== ACCEPT / REJECT REQUEST CARD ===== */}
//       {pendingRequest && pendingRequest.status === "sent" && (
//         <div style={{ background: "#FFF7C2", padding: 15, margin: 10, borderRadius: 14, textAlign: "center" }}>
//           <h4 style={{ margin: 0 }}>{pendingRequest.title || "Collaboration Request"}</h4>
//           <p style={{ marginTop: 4 }}>{pendingRequest.description}</p>

//           <button onClick={acceptRequest} style={{ marginRight: 10 }}>✅ Accept</button>
//           <button onClick={rejectRequest}>❌ Reject</button>
//         </div>
//       )}

//       {/* HEADER */}
//       <div
//         style={{
//           padding: 15,
//           display: "flex",
//           alignItems: "center",
//           gap: 15,
//           background: "white",
//           boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
//         }}
//       >
//         <img
//           src={otherImage || "https://i.ibb.co/sqsJwP0/user.png"}
//           style={{
//             width: 50,
//             height: 50,
//             borderRadius: "50%",
//             objectFit: "cover",
//           }}
//         />
//         <div>
//           <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{otherName}</h3>
//           <p style={{ margin: 0, fontSize: 12, color: "gray" }}>Online</p>
//         </div>
//       </div>

//       {/* MESSAGES */}
//       <div style={{ flex: 1, overflowY: "auto", padding: 15 }}>
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             style={{
//               display: "flex",
//               justifyContent: msg.senderId === currentUid ? "flex-end" : "flex-start",
//               marginBottom: 8,
//             }}
//           >
//             <div
//               style={{
//                 padding: "10px 14px",
//                 maxWidth: "65%",
//                 borderRadius: 16,
//                 background: msg.senderId === currentUid ? "#1877f2" : "#e0e0e0",
//                 color: msg.senderId === currentUid ? "white" : "black",
//                 fontSize: 14,
//                 wordBreak: "break-word",
//               }}
//             >
//               {msg.type === "image" && (
//                 <img
//                   src={msg.url}
//                   alt="img"
//                   style={{ maxWidth: "200px", borderRadius: 10, marginTop: 5 }}
//                 />
//               )}

//               {msg.type === "file" && (
//                 <a
//                   href={msg.url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   style={{
//                     color: msg.senderId === currentUid ? "white" : "blue",
//                     textDecoration: "underline",
//                   }}
//                 >
//                   📄 {msg.fileName}
//                 </a>
//               )}

//               {msg.type === "text" && msg.text}
//             </div>
//           </div>
//         ))}

//         <div ref={scrollRef}></div>
//       </div>

//       {/* EMOJI PICKER */}
//       {showEmoji && canChat && (
//         <div style={{ position: "absolute", bottom: 70, left: 10, zIndex: 100 }}>
//           <Picker onEmojiClick={onEmojiClick} />
//         </div>
//       )}

//       {/* INPUT BAR */}
//       <div
//         style={{
//           padding: 10,
//           background: "white",
//           display: "flex",
//           alignItems: "center",
//           gap: 10,
//           borderTop: "1px solid #ddd",
//           position: "relative",
//         }}
//       >
//         {!canChat ? (
//           <div
//             style={{
//               flex: 1,
//               textAlign: "center",
//               color: "red",
//               fontSize: 14,
//               fontWeight: 500,
//             }}
//           >
//             ⏳ Waiting for freelancer to accept the request
//           </div>
//         ) : (
//           <>
//             <button
//               onClick={() => setShowEmoji(!showEmoji)}
//               style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer" }}
//             >
//               😊
//             </button>

//             <input
//               type="file"
//               id="fileInput"
//               accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
//               style={{ display: "none" }}
//               onChange={(e) => handleFileUpload(e.target.files[0])}
//             />

//             <button
//               onClick={() => document.getElementById("fileInput").click()}
//               style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}
//             >
//               📎
//             </button>

//             <input
//               type="text"
//               value={inputText}
//               onChange={(e) => setInputText(e.target.value)}
//               placeholder="Type a message…"
//               style={{
//                 flex: 1,
//                 padding: 12,
//                 borderRadius: 20,
//                 border: "1px solid #ccc",
//                 fontSize: 14,
//               }}
//             />

//             <button
//               onClick={sendMessage}
//               style={{
//                 background: "#1877f2",
//                 border: "none",
//                 color: "white",
//                 padding: "12px 15px",
//                 borderRadius: 20,
//                 cursor: "pointer",
//               }}
//             >
//               <IoSend size={22} />
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }







import React, { useEffect, useState, useRef } from "react";
import {
  getDatabase,
  ref,
  onValue,
  push,
  set,
  update,
} from "firebase/database";

import { IoSend } from "react-icons/io5";
import Picker from "emoji-picker-react";
import { useLocation } from "react-router-dom";

// Firebase Storage
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export default function ChatPage() {
  const { state } = useLocation();

  const currentUid = state?.currentUid;
  const otherUid = state?.otherUid;
  const otherName = state?.otherName || "User";
  const otherImage = state?.otherImage || "";
  const initialMessage = state?.initialMessage || "";

  const db = getDatabase();       // RTDB
  const storage = getStorage();   // Storage

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState(initialMessage || "");
  const [showEmoji, setShowEmoji] = useState(false);

  const scrollRef = useRef(null);

  // VALIDATION
  if (!currentUid || !otherUid) {
    return (
      <div style={{ textAlign: "center", padding: 30, fontSize: 18, color: "red" }}>
        ⚠ Chat cannot open. Missing UID values.
      </div>
    );
  }

  // STABLE CHAT ID
  const chatId =
    currentUid < otherUid
      ? `${currentUid}_${otherUid}`
      : `${otherUid}_${currentUid}`;

  // FETCH MESSAGES
  useEffect(() => {
    const msgRef = ref(db, `chats/${chatId}/messages`);

    return onValue(msgRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
      setMessages(list);

      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, [chatId, db]);

  // SEND TEXT MESSAGE
  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const msgRef = ref(db, `chats/${chatId}/messages`);
    const newMsgRef = push(msgRef);

    const payload = {
      id: newMsgRef.key,
      text: inputText,
      senderId: currentUid,
      receiverId: otherUid,
      type: "text",
      timestamp: Date.now(),
      status: "sent",
      reactions: {},
    };

    await set(newMsgRef, payload);

    const now = Date.now();

    // Chat metadata
    await update(ref(db, `userChats/${currentUid}/${chatId}`), {
      withUid: otherUid,
      otherName,
      otherImage,
      lastMessage: inputText,
      lastMessageTime: now,
    });

    await update(ref(db, `userChats/${otherUid}/${chatId}`), {
      withUid: currentUid,
      otherName: "You",
      lastMessage: inputText,
      lastMessageTime: now,
    });

    setInputText("");
  };

  // FILE UPLOAD
  const handleFileUpload = async (file) => {
    if (!file) return;

    try {
      const safeName = file.name.replace(/\s+/g, "_");
      const filePath = `chatFiles/${chatId}/${Date.now()}_${safeName}`;
      const fileRef = storageRef(storage, filePath);

      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);

      const msgRef = ref(db, `chats/${chatId}/messages`);
      const newMsgRef = push(msgRef);

      const payload = {
        id: newMsgRef.key,
        senderId: currentUid,
        receiverId: otherUid,
        type: file.type.startsWith("image/") ? "image" : "file",
        url: downloadURL,
        fileName: safeName,
        timestamp: Date.now(),
        status: "sent",
        reactions: {},
      };

      await set(newMsgRef, payload);

      const now = Date.now();

      await update(ref(db, `userChats/${currentUid}/${chatId}`), {
        withUid: otherUid,
        otherName,
        otherImage,
        lastMessage: safeName,
        lastMessageTime: now,
      });

      await update(ref(db, `userChats/${otherUid}/${chatId}`), {
        withUid: currentUid,
        otherName: "You",
        lastMessage: safeName,
        lastMessageTime: now,
      });
    } catch (err) {
      console.error("FILE UPLOAD ERROR:", err);
    }
  };

  // EMOJI
  const onEmojiClick = (emojiObj) => {
    setInputText((prev) => prev + emojiObj.emoji);
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#f5f5f5" }}>

      {/* HEADER */}
      <div
        style={{
          padding: 15,
          display: "flex",
          alignItems: "center",
          gap: 15,
          background: "white",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        }}
      >
        <img
          src={otherImage || "https://i.ibb.co/sqsJwP0/user.png"}
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{otherName}</h3>
          <p style={{ margin: 0, fontSize: 12, color: "gray" }}>Online</p>
        </div>
      </div>

      {/* MESSAGES */}
      <div style={{ flex: 1, overflowY: "auto", padding: 15 }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.senderId === currentUid ? "flex-end" : "flex-start",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                padding: "10px 14px",
                maxWidth: "65%",
                borderRadius: 16,
                background: msg.senderId === currentUid ? "#1877f2" : "#e0e0e0",
                color: msg.senderId === currentUid ? "white" : "black",
                fontSize: 14,
                wordBreak: "break-word",
              }}
            >
              {msg.type === "image" && (
                <img
                  src={msg.url}
                  alt="img"
                  style={{ maxWidth: "200px", borderRadius: 10, marginTop: 5 }}
                />
              )}

              {msg.type === "file" && (
                <a
                  href={msg.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: msg.senderId === currentUid ? "white" : "blue",
                    textDecoration: "underline",
                  }}
                >
                  📄 {msg.fileName}
                </a>
              )}

              {msg.type === "text" && msg.text}
            </div>
          </div>
        ))}

        <div ref={scrollRef}></div>
      </div>

      {/* EMOJI PICKER */}
      {showEmoji && (
        <div style={{ position: "absolute", bottom: 70, left: 10, zIndex: 100 }}>
          <Picker onEmojiClick={onEmojiClick} />
        </div>
      )}

      {/* INPUT BAR */}
      <div
        style={{
          padding: 10,
          background: "white",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderTop: "1px solid #ddd",
          position: "relative",
        }}
      >
        <button
          onClick={() => setShowEmoji(!showEmoji)}
          style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer" }}
        >
          😊
        </button>

        <input
          type="file"
          id="fileInput"
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
          style={{ display: "none" }}
          onChange={(e) => handleFileUpload(e.target.files[0])}
        />

        <button
          onClick={() => document.getElementById("fileInput").click()}
          style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}
        >
          📎
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message…"
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 20,
            border: "1px solid #ccc",
            fontSize: 14,
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            background: "red",
            border: "none",
            color: "white",
            padding: "12px 15px",
            borderRadius: 20,
            cursor: "pointer",
          }}
        >
          <IoSend size={22} />
        </button>
      </div>
    </div>
  );
}