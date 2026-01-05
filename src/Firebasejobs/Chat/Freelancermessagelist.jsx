// import React, { useEffect, useState } from "react";
// import { rtdb } from "../../firbase/Firebase";
// import { ref, onValue } from "firebase/database";

// import {
//   getFirestore,
//   collection,
//   query,
//   where,
//   onSnapshot,
//   getDoc,
//   doc
// } from "firebase/firestore";

// import { getAuth } from "firebase/auth";
// import { useNavigate } from "react-router-dom";

// export default function FreelancerAcceptedChats() {
//   const auth = getAuth();
//   const user = auth.currentUser;
//   const navigate = useNavigate();
//   const db = getFirestore();

//   const [chatList, setChatList] = useState([]);

//   useEffect(() => {
//     if (!user) return;

//     // STEP 1 → Get accepted notifications for this freelancer
//     const notifRef = collection(db, "notifications");
//     const qNotif = query(
//       notifRef,
//       where("freelancerId", "==", user.uid),
//       where("read", "==", true)
//     );

//     const unsub = onSnapshot(qNotif, (snap) => {
//       const acceptedClients = snap.docs.map((d) => d.data().clientUid);

//       // STEP 2 → Load all chats of this freelancer
//       const userChatsRef = ref(rtdb, `userChats/${user.uid}`);

//       onValue(userChatsRef, async (chatsSnap) => {
//         const val = chatsSnap.val() || {};

//         // STEP 3 → Filter chats ONLY with accepted clients + fetch their profile
//         const filtered = await Promise.all(
//           Object.entries(val)
//             .filter(([chatId, chatData]) =>
//               acceptedClients.includes(chatData.withUid)
//             )
//             .map(async ([chatId, chatData]) => {

//               // Fetch client profile from Firestore
//               const clientRef = doc(db, "users", chatData.withUid);
//               const clientSnap = await getDoc(clientRef);

//               const clientData = clientSnap.exists() ? clientSnap.data() : {};

//               const clientName = clientData.firstName && clientData.lastName
//                 ? `${clientData.firstName} ${clientData.lastName}`
//                 : "Clients";

//               return {
//                 chatId,
//                 ...chatData,
//                 clientName,
//                 clientImg: clientData.profileImage || null,
//               };
//             })
//         );

//         setChatList(filtered);
//       });
//     });

//     return unsub;
//   }, [user]);



//   return (
//     <div style={{ padding: 16 }}>
//       <h1 style={{
//             background: "#fff",
//             padding: 14,
//             borderRadius: 12,
//             marginBottom: 12,
//             boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
//             cursor: "pointer",
//           }}>Requested</h1>
//       <h2 style={{ marginBottom: 20 }}>Accepted Chats</h2>

//       {chatList.length === 0 && (
//         <p style={{ color: "#777" }}>No accepted chats yet.</p>
//       )}

//       {chatList.map((chat) => (
//         <div
//           key={chat.chatId}
//           onClick={() =>
//             navigate("/chat", {
//               state: {
//                 currentUid: user.uid,
//                 otherUid: chat.withUid,
//               },
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
//               style={{
//                 width: 48,
//                 height: 48,
//                 borderRadius: "50%",
//                 objectFit: "cover",
//               }}
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
// import {
//   doc,
//   collection,
//   query,
//   where,
//   onSnapshot,
//   getDocs,
//   addDoc,
//   setDoc,
//   deleteDoc,
//   serverTimestamp,
// } from "firebase/firestore";
// import { useNavigate, useParams } from "react-router-dom";
// import { getAuth } from "firebase/auth";

// /* ======================================================
//    FREELANCER FULL DETAIL SCREEN – REACT (SINGLE FILE)
// ====================================================== */

// export default function FreelancerFullDetailScreen() {
//   const { userId, jobid } = useParams();
//   const navigate = useNavigate();
//   const auth = getAuth();
//   const currentUid = auth.currentUser?.uid;

//   /* ================= STATE ================= */
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [isRequested, setIsRequested] = useState(false);
//   const [isAccepted, setIsAccepted] = useState(false);

//   const [activeTab, setActiveTab] = useState("work"); // work | 24h
//   const [services, setServices] = useState([]);
//   const [services24h, setServices24h] = useState([]);

//   const [showRequest, setShowRequest] = useState(false);
//   const [projectTitle, setProjectTitle] = useState("");
//   const [projectDesc, setProjectDesc] = useState("");

//   /* ================= LOAD PROFILE ================= */
//   useEffect(() => {
//     if (!userId) return;

//     const unsub = onSnapshot(doc(db, "users", userId), (snap) => {
//       setProfile(snap.exists() ? snap.data() : null);
//       setLoading(false);
//     });

//     return () => unsub();
//   }, [userId]);

//   /* ================= CHECK REQUESTED ================= */
//   useEffect(() => {
//     if (!currentUid || !userId) return;

//     const q = query(
//       collection(db, "collaboration_requests"),
//       where("clientId", "==", currentUid),
//       where("freelancerId", "==", userId),
//       where("status", "==", "sent")
//     );

//     getDocs(q).then((snap) => {
//       if (!snap.empty) setIsRequested(true);
//     });
//   }, [currentUid, userId]);

//   /* ================= CHECK ACCEPTED ================= */
//   useEffect(() => {
//     if (!currentUid || !userId || !jobid) return;

//     const q = query(
//       collection(db, "accepted_jobs"),
//       where("clientId", "==", currentUid),
//       where("freelancerId", "==", userId),
//       where("jobId", "==", jobid)
//     );

//     getDocs(q).then((snap) => {
//       if (!snap.empty) setIsAccepted(true);
//     });
//   }, [currentUid, userId, jobid]);

//   /* ================= LOAD SERVICES ================= */
//   useEffect(() => {
//     if (!userId) return;

//     const unsub1 = onSnapshot(
//       collection(db, "users", userId, "services"),
//       (snap) =>
//         setServices(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
//     );

//     const unsub2 = onSnapshot(
//       collection(db, "users", userId, "services_24h"),
//       (snap) =>
//         setServices24h(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
//     );

//     return () => {
//       unsub1();
//       unsub2();
//     };
//   }, [userId]);

//   /* ================= SEND REQUEST ================= */
//   async function sendRequest() {
//     if (!currentUid || !userId) return;

//     await addDoc(collection(db, "collaboration_requests"), {
//       clientId: currentUid,
//       freelancerId: userId,
//       title: projectTitle,
//       description: projectDesc,
//       status: "sent",
//       timestamp: serverTimestamp(),
//     });

//     setIsRequested(true);
//     setShowRequest(false);

//     navigate("/chat", {
//       state: {
//         currentUid,
//         otherUid: userId,
//         initialMessage: projectTitle,
//       },
//     });
//   }

//   /* ================= BLOCK USER ================= */
//   async function blockUser() {
//     if (!currentUid || !userId) return;

//     await setDoc(doc(db, "blocked_users", `${currentUid}_${userId}`), {
//       blockedBy: currentUid,
//       blockedUserId: userId,
//       blockedAt: serverTimestamp(),
//     });

//     navigate(-1);
//   }

//   /* ================= RENDER ================= */
//   if (loading) return <Center>Loading…</Center>;
//   if (!profile) return <Center>User not found</Center>;

//   return (
//     <div style={styles.page}>
//       {/* HEADER */}
//       <div style={styles.header}>
//         <button onClick={() => navigate(-1)}>←</button>
//         <div>
//           <button onClick={blockUser}>🚩</button>
//           <button
//             onClick={() =>
//               navigator.share?.({
//                 title: profile.firstName,
//                 url: profile.linkedin,
//               })
//             }
//           >
//             🔗
//           </button>
//         </div>
//       </div>

//       {/* PROFILE */}
//       <div style={styles.profile}>
//         <img
//           src={profile.profileImage || "/placeholder.png"}
//           alt=""
//           style={styles.avatar}
//         />
//         <h2>
//           {profile.firstName} {profile.lastName}
//         </h2>
//         <p>{profile.professional_title}</p>

//         {/* ACTION */}
//         {isAccepted ? (
//           <button onClick={() => navigate("/chat")}>Message</button>
//         ) : isRequested ? (
//           <button disabled>Requested</button>
//         ) : (
//           <button onClick={() => setShowRequest(true)}>Connect</button>
//         )}
//       </div>

//       {/* ABOUT */}
//       <Section title="About">
//         <p>{profile.about}</p>
//       </Section>

//       {/* SKILLS */}
//       <Section title="Skills & Tools">
//         <Wrap items={[...(profile.skills || []), ...(profile.tools || [])]} />
//       </Section>

//       {/* SERVICES */}
//       <Section title="Services">
//         <div style={styles.tabs}>
//           <button
//             onClick={() => setActiveTab("work")}
//             className={activeTab === "work" ? "active" : ""}
//           >
//             Work
//           </button>
//           <button
//             onClick={() => setActiveTab("24h")}
//             className={activeTab === "24h" ? "active" : ""}
//           >
//             24 Hours
//           </button>
//         </div>

//         {(activeTab === "work" ? services : services24h).map((s) => (
//           <div key={s.id} style={styles.card}>
//             <h4>{s.title}</h4>
//             <p>{s.description}</p>
//             <p>₹ {s.budget_from || s.price}</p>
//           </div>
//         ))}
//       </Section>

//       {/* REQUEST POPUP */}
//       {showRequest && (
//         <div style={styles.modal}>
//           <div style={styles.modalBox}>
//             <h3>Send Request</h3>
//             <input
//               placeholder="Project title"
//               value={projectTitle}
//               onChange={(e) => setProjectTitle(e.target.value)}
//             />
//             <textarea
//               placeholder="Description"
//               value={projectDesc}
//               onChange={(e) => setProjectDesc(e.target.value)}
//             />
//             <button onClick={sendRequest}>Submit</button>
//             <button onClick={() => setShowRequest(false)}>Cancel</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ================= UI HELPERS ================= */

// const Center = ({ children }) => (
//   <div style={{ padding: 40, textAlign: "center" }}>{children}</div>
// );

// const Section = ({ title, children }) => (
//   <div style={styles.section}>
//     <h3>{title}</h3>
//     {children}
//   </div>
// );

// const Wrap = ({ items }) => (
//   <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//     {items.map((i, idx) => (
//       <span key={idx} style={styles.chip}>
//         {i}
//       </span>
//     ))}
//   </div>
// );

// /* ================= STYLES ================= */

// const styles = {
//   page: { background: "#fafafa", minHeight: "100vh" },
//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     padding: 16,
//   },
//   profile: {
//     background: "#fff",
//     margin: 16,
//     padding: 20,
//     borderRadius: 16,
//     textAlign: "center",
//   },
//   avatar: {
//     width: 90,
//     height: 90,
//     borderRadius: "50%",
//     objectFit: "cover",
//   },
//   section: {
//     background: "#fff",
//     margin: 16,
//     padding: 16,
//     borderRadius: 16,
//   },
//   tabs: { display: "flex", gap: 10 },
//   card: {
//     padding: 12,
//     border: "1px solid #ddd",
//     borderRadius: 12,
//     marginTop: 10,
//   },
//   chip: {
//     padding: "6px 12px",
//     background: "#FFF7C2",
//     borderRadius: 20,
//   },
//   modal: {
//     position: "fixed",
//     inset: 0,
//     background: "rgba(0,0,0,.4)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   modalBox: {
//     background: "#fff",
//     padding: 20,
//     borderRadius: 16,
//     width: 300,
//   },
// };












// import React, { useEffect, useState } from "react";
// import {
//   getFirestore,
//   doc,
//   collection,
//   query,
//   where,
//   onSnapshot,
//   getDocs,
//   addDoc,
//   setDoc,
//   serverTimestamp,
// } from "firebase/firestore";
// import { useNavigate, useParams } from "react-router-dom";
// import { getAuth, onAuthStateChanged } from "firebase/auth";

// /* ======================================================
//    FREELANCER FULL DETAIL SCREEN – FIXED
// ====================================================== */

// export default function FreelancerFullDetailScreen() {
//   const { userId, jobid } = useParams();
//   const navigate = useNavigate();

//   const auth = getAuth();
//   const db = getFirestore();

//   /* ================= STATE ================= */
//   const [currentUid, setCurrentUid] = useState(null);
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [isRequested, setIsRequested] = useState(false);
//   const [isAccepted, setIsAccepted] = useState(false);

//   const [activeTab, setActiveTab] = useState("work");
//   const [services, setServices] = useState([]);
//   const [services24h, setServices24h] = useState([]);

//   const [showRequest, setShowRequest] = useState(false);
//   const [projectTitle, setProjectTitle] = useState("");
//   const [projectDesc, setProjectDesc] = useState("");

//   /* ================= AUTH ================= */
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => {
//       setCurrentUid(u ? u.uid : null);
//     });
//     return () => unsub();
//   }, []);

//   /* ================= LOAD PROFILE ================= */
//   useEffect(() => {
//     if (!userId) {
//       setLoading(false);
//       return;
//     }

//     const unsub = onSnapshot(
//       doc(db, "users", userId),
//       (snap) => {
//         setProfile(snap.exists() ? snap.data() : null);
//         setLoading(false);
//       },
//       (err) => {
//         console.error("Profile load error:", err);
//         setLoading(false);
//       }
//     );

//     return () => unsub();
//   }, [userId]);

//   /* ================= CHECK REQUESTED ================= */
//   useEffect(() => {
//     if (!currentUid || !userId) return;

//     const q = query(
//       collection(db, "collaboration_requests"),
//       where("clientId", "==", currentUid),
//       where("freelancerId", "==", userId),
//       where("status", "==", "sent")
//     );

//     getDocs(q).then((snap) => {
//       if (!snap.empty) setIsRequested(true);
//     });
//   }, [currentUid, userId]);

//   /* ================= CHECK ACCEPTED ================= */
//   useEffect(() => {
//     if (!currentUid || !userId || !jobid) return;

//     const q = query(
//       collection(db, "accepted_jobs"),
//       where("clientId", "==", currentUid),
//       where("freelancerId", "==", userId),
//       where("jobId", "==", jobid)
//     );

//     getDocs(q).then((snap) => {
//       if (!snap.empty) setIsAccepted(true);
//     });
//   }, [currentUid, userId, jobid]);

//   /* ================= LOAD SERVICES ================= */
//   useEffect(() => {
//     if (!userId) return;

//     const unsub1 = onSnapshot(
//       collection(db, "users", userId, "services"),
//       (snap) =>
//         setServices(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
//     );

//     const unsub2 = onSnapshot(
//       collection(db, "users", userId, "services_24h"),
//       (snap) =>
//         setServices24h(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
//     );

//     return () => {
//       unsub1();
//       unsub2();
//     };
//   }, [userId]);

//   /* ================= SEND REQUEST ================= */
//   async function sendRequest() {
//     if (!currentUid || !userId) return;

//     await addDoc(collection(db, "collaboration_requests"), {
//       clientId: currentUid,
//       freelancerId: userId,
//       title: projectTitle,
//       description: projectDesc,
//       status: "sent",
//       timestamp: serverTimestamp(),
//     });

//     setIsRequested(true);
//     setShowRequest(false);

//     navigate("/chat", {
//       state: {
//         currentUid,
//         otherUid: userId,
//         initialMessage: projectTitle,
//       },
//     });
//   }

//   /* ================= BLOCK USER ================= */
//   async function blockUser() {
//     if (!currentUid || !userId) return;

//     await setDoc(doc(db, "blocked_users", `${currentUid}_${userId}`), {
//       blockedBy: currentUid,
//       blockedUserId: userId,
//       blockedAt: serverTimestamp(),
//     });

//     navigate(-1);
//   }

//   /* ================= RENDER ================= */
//   if (loading) return <Center>Loading…</Center>;
//   if (!profile) return <Center>User not found</Center>;

//   return (
//     <div style={styles.page}>
//       <div style={styles.header}>
//         <button onClick={() => navigate(-1)}>←</button>
//         <button onClick={blockUser}>🚩</button>
//       </div>

//       <div style={styles.profile}>
//         <img
//           src={profile.profileImage || "/placeholder.png"}
//           alt=""
//           style={styles.avatar}
//         />
//         <h2>
//           {profile.firstName} {profile.lastName}
//         </h2>
//         <p>{profile.professional_title}</p>

//         {isAccepted ? (
//           <button onClick={() => navigate("/chat")}>Message</button>
//         ) : isRequested ? (
//           <button disabled>Requested</button>
//         ) : (
//           <button onClick={() => setShowRequest(true)}>Connect</button>
//         )}
//       </div>

//       <Section title="About">
//         <p>{profile.about}</p>
//       </Section>

//       <Section title="Skills & Tools">
//         <Wrap items={[...(profile.skills || []), ...(profile.tools || [])]} />
//       </Section>

//       <Section title="Services">
//         <div style={styles.tabs}>
//           <button onClick={() => setActiveTab("work")}>Work</button>
//           <button onClick={() => setActiveTab("24h")}>24 Hours</button>
//         </div>

//         {(activeTab === "work" ? services : services24h).map((s) => (
//           <div key={s.id} style={styles.card}>
//             <h4>{s.title}</h4>
//             <p>{s.description}</p>
//             <p>₹ {s.budget_from || s.price}</p>
//           </div>
//         ))}
//       </Section>

//       {showRequest && (
//         <div style={styles.modal}>
//           <div style={styles.modalBox}>
//             <h3>Send Request</h3>
//             <input
//               placeholder="Project title"
//               value={projectTitle}
//               onChange={(e) => setProjectTitle(e.target.value)}
//             />
//             <textarea
//               placeholder="Description"
//               value={projectDesc}
//               onChange={(e) => setProjectDesc(e.target.value)}
//             />
//             <button onClick={sendRequest}>Submit</button>
//             <button onClick={() => setShowRequest(false)}>Cancel</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ================= UI HELPERS ================= */

// const Center = ({ children }) => (
//   <div style={{ padding: 40, textAlign: "center" }}>{children}</div>
// );

// const Section = ({ title, children }) => (
//   <div style={styles.section}>
//     <h3>{title}</h3>
//     {children}
//   </div>
// );

// const Wrap = ({ items }) => (
//   <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//     {items.map((i, idx) => (
//       <span key={idx} style={styles.chip}>
//         {i}
//       </span>
//     ))}
//   </div>
// );

// /* ================= STYLES ================= */

// const styles = {
//   page: { background: "#fafafa", minHeight: "100vh" },
//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     padding: 16,
//   },
//   profile: {
//     background: "#fff",
//     margin: 16,
//     padding: 20,
//     borderRadius: 16,
//     textAlign: "center",
//   },
//   avatar: {
//     width: 90,
//     height: 90,
//     borderRadius: "50%",
//     objectFit: "cover",
//   },
//   section: {
//     background: "#fff",
//     margin: 16,
//     padding: 16,
//     borderRadius: 16,
//   },
//   tabs: { display: "flex", gap: 10 },
//   card: {
//     padding: 12,
//     border: "1px solid #ddd",
//     borderRadius: 12,
//     marginTop: 10,
//   },
//   chip: {
//     padding: "6px 12px",
//     background: "#FFF7C2",
//     borderRadius: 20,
//   },
//   modal: {
//     position: "fixed",
//     inset: 0,
//     background: "rgba(0,0,0,.4)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   modalBox: {
//     background: "#fff",
//     padding: 20,
//     borderRadius: 16,
//     width: 300,
//   },
// };
































// import React, { useEffect, useState } from "react";
// import { rtdb } from "../../firbase/Firebase";
// import { ref, onValue } from "firebase/database";

// import {
//   getFirestore,
//   collection,
//   query,
//   where,
//   onSnapshot,
//   getDoc,
//   doc
// } from "firebase/firestore";

// import { getAuth } from "firebase/auth";
// import { Link, useNavigate } from "react-router-dom";

// export default function FreelancerAcceptedChats() {
//   const auth = getAuth();
//   const user = auth.currentUser;
//   const navigate = useNavigate();
//   const db = getFirestore();

//   const [chatList, setChatList] = useState([]);

//   useEffect(() => {
//     if (!user) return;

//     // STEP 1 → Get accepted notifications for this freelancer
//     const notifRef = collection(db, "notifications");
//     const qNotif = query(
//       notifRef,
//       where("freelancerId", "==", user.uid),
//       where("read", "==", true)
//     );

//     const unsub = onSnapshot(qNotif, (snap) => {
//       const acceptedClients = snap.docs.map((d) => d.data().clientUid);

//       // STEP 2 → Load all chats of this freelancer
//       const userChatsRef = ref(rtdb, `userChats/${user.uid}`);

//       onValue(userChatsRef, async (chatsSnap) => {
//         const val = chatsSnap.val() || {};

//         // STEP 3 → Filter chats ONLY with accepted clients + fetch their profile
//         const filtered = await Promise.all(
//           Object.entries(val)
//             .filter(([chatId, chatData]) =>
//               acceptedClients.includes(chatData.withUid)
//             )
//             .map(async ([chatId, chatData]) => {

//               // Fetch client profile from Firestore
//               const clientRef = doc(db, "users", chatData.withUid);
//               const clientSnap = await getDoc(clientRef);

//               const clientData = clientSnap.exists() ? clientSnap.data() : {};

//               const clientName = clientData.firstName && clientData.lastName
//                 ? `${clientData.firstName} ${clientData.lastName}`
//                 : "Clients";

//               return {
//                 chatId,
//                 ...chatData,
//                 clientName,
//                 clientImg: clientData.profileImage || null,
//               };
//             })
//         );

//         setChatList(filtered);
//       });
//     });

//     return unsub;
//   }, [user]);



//   return (
//     <div style={{ padding: 16 }}>
//      <Link to="/Requestmessagefreelancer">
//       <h1 style={{
//             background: "#fff",
//             padding: 14,
//             borderRadius: 12,
//             marginBottom: 12,
//             boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
//             cursor: "pointer",
//           }}>Requested</h1>

//      </Link>
//       <h2 style={{ marginBottom: 20 }}>Accepted Chats</h2>

//       {chatList.length === 0 && (
//         <p style={{ color: "#777" }}>No accepted chats yet.</p>
//       )}

//       {chatList.map((chat) => (
//         <div
//           key={chat.chatId}
//           onClick={() =>
//             navigate("/chat", {
//               state: {
//                 currentUid: user.uid,
//                 otherUid: chat.withUid,
//               },
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
//               style={{
//                 width: 48,
//                 height: 48,
//                 borderRadius: "50%",
//                 objectFit: "cover",
//               }}
//             />
//             <h4 style={{ margin: 0 }}>{chat.clientName}</h4>
//           </div>

//           <p style={{ color: "#444", marginTop: 8 }}>
//             {/* {chat.lastMessage || "No messages yet"} */}
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


import React, { useEffect, useState } from "react";
import { rtdb } from "../../firbase/Firebase";
import { ref, onValue } from "firebase/database";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  getDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import backarrow from "../../assets/backarrow.png";

export default function FreelancerAcceptedChats() {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const db = getFirestore();

  const [chatList, setChatList] = useState([]);

  /* ================= SIDEBAR COLLAPSE (ADDED) ================= */
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);
  /* ============================================================ */

  useEffect(() => {
    if (!user) return;

    const notifRef = collection(db, "notifications");
    const qNotif = query(
      notifRef,
      where("freelancerId", "==", user.uid),
      where("read", "==", true)
    );

    const unsub = onSnapshot(qNotif, (snap) => {
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
                clientName:
                  clientData.firstName && clientData.lastName
                    ? `${clientData.firstName} ${clientData.lastName}`
                    : "Eten Hunt",
                clientImg: clientData.profileImage || null,
              };
            })
        );

        setChatList(filtered);
      });
    });

    return unsub;
  }, [user]);

  /* ================= UI ================= */
  return (
    <div
      className="freelance-wrapper"
      style={{
        marginLeft: collapsed ? "-177px" : "44px",
        transition: "margin-left 0.25s ease",
      }}
    >
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(180deg,#FFFDB7,#fff)",
          padding: 16,
          
        }}
      >
        {/* HEADER */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
            }}
          >
            <img
              src={backarrow}
              alt="Back"
              style={{ width: 16, height: 18, objectFit: "contain" }}
            />
          </div>
          <h2 style={{ margin: 0, fontWeight: 600 }}>Message</h2>
        </div>

        {/* SEARCH */}
        <div
          style={{
            marginTop: 16,
            background: "#fff",
            borderRadius: 14,
            padding: "-1px 6px",
            boxShadow: "0 6px 18px rgba(0,0,0,.08)",
            maxWidth: "70%",
            marginLeft:"150px"
          }}
        >
          <input
            placeholder="Search"
            style={{
              width: "70%",
              // padding:"1px",
              border: "none",
              outline: "none",
              fontSize: 14,
            }}
          />
        </div>

        {/* REQUEST LINK */}
        <div
          style={{
            marginTop: 18,
            textAlign: "right",
            fontSize: 14,
            fontWeight: 500,
            color: "#6B4EFF",
            maxWidth: "78%",
          }}
        >
          <Link
            to="/Requestmessagefreelancer"
            style={{ textDecoration: "none",marginLeft:"150px", }}
          >
            Request (2)
          </Link>
        </div>

        {/* CHAT LIST CARD */}
        <div
          style={{
            marginTop: 12,
            background: "#fff",
            borderRadius: 20,
            padding: 8,
            boxShadow: "0 12px 30px rgba(0,0,0,.15)",
            maxWidth: "70%",
            marginLeft:"150px"
          }}
        >
          {chatList.length === 0 && (
            <p style={{ textAlign: "center", padding: 20, color: "#777" }}>
              No messages
            </p>
          )}

          {chatList.map((chat) => (
            <div
              key={chat.chatId}
              onClick={() =>
                navigate("/chat", {
                  state: {
                    currentUid: user.uid,
                    otherUid: chat.withUid,
                  },
                })
              }
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 10px",
                borderBottom: "1px solid #eee",
                cursor: "pointer",
              }}
            >
              <img
                src={chat.clientImg || "/placeholder.png"}
                alt=""
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />

              <div style={{ flex: 1, marginLeft: 12 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    marginBottom: 4,
                  }}
                >
                  {chat.clientName}
                </div>
                <div style={{ fontSize: 12, color: "#777" }}>
                  Thank you very much. I'm glad ...
                </div>
              </div>

              <div style={{ color: "#4C6FFF", fontSize: 14 }}>✔✔</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
