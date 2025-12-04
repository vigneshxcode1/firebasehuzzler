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



// FreelancerAcceptedChats.jsx
// EXACT UI same as screenshot — BACKEND UNTOUCHED ✔

import React, { useEffect, useState } from "react";
import { rtdb } from "../../firbase/Firebase";
import { ref, onValue } from "firebase/database";

import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";

import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function FreelancerAcceptedChats() {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const db = getFirestore();

  const [chatList, setChatList] = useState([]);

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

              const clientData = clientSnap.exists() ? clientSnap.data() : {};

              const clientName =
                clientData.firstName && clientData.lastName
                  ? `${clientData.firstName} ${clientData.lastName}`
                  : "Agents";

              return {
                chatId,
                ...chatData,
                clientName,
                clientImg: clientData.profileImage || null,
              };
            })
        );

        setChatList(filtered);
      });
    });

    return unsub;
  }, [user]);

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <span style={styles.backBtn} onClick={() => navigate(-1)}>
          ←
        </span>
        <span style={styles.headerTitle}>Message</span>
      </div>

      {/* SEARCH BAR */}
      <div style={styles.searchWrap}>
        <input
          placeholder="Search"
          style={styles.searchInput}
        />
      </div>

      {/* REQUEST TEXT */}
      <div style={styles.requestText}>Request ({chatList.length})</div>

      {/* WHITE CARD LIST */}
      <div style={styles.listCard}>
        {chatList.length === 0 && (
          <p style={{ color: "#666", padding: 20 }}>No accepted chats yet.</p>
        )}

        {chatList.map((chat, i) => (
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
            style={styles.chatRow}
          >
            <img
              src={chat.clientImg || "/placeholder.png"}
              style={styles.avatar}
              alt="profile"
            />

            <div style={styles.chatTextWrap}>
              <div style={styles.chatName}>{chat.clientName}</div>
              <div style={styles.chatMsg}>
                {chat.lastMessage || "Thank you very much. I'm glad ..."}
              </div>
            </div>

            <div style={styles.rightSideWrap}>
              <div style={styles.roleText}>Agents</div>
              <div style={styles.tick}>✔✔</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// EXACT FIGMA STYLES
// ------------------------------------------------------------
const styles = {
  page: {
    width: "100%",
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 10% 10%, #fff7b8 0%, #ffffff 40%, #ffffff 80%)",
    padding: "20px 0 40px 0",
    fontFamily: "Inter, sans-serif",
  },

  // HEADER
  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "0 22px",
    marginBottom: 18,
  },

  backBtn: {
    width: 38,
    height: 38,
    borderRadius: "12px",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    cursor: "pointer",
    fontSize: 20,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: 700,
  },

  // SEARCH BAR
  searchWrap: {
    padding: "0 22px",
    marginBottom: 12,
  },

  searchInput: {
    width: "100%",
    background: "#ffffff",
    border: "none",
    outline: "none",
    padding: "16px 18px",
    borderRadius: 14,
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    fontSize: 15,
  },

  requestText: {
    fontSize: 15,
    fontWeight: 600,
    color: "#7c3aed",
    textAlign: "right",
    paddingRight: 28,
    marginBottom: 10,
  },

  listCard: {
    width: "90%",
    margin: "auto",
    background: "#fff",
    borderRadius: 20,
    padding: "10px 0",
    boxShadow: "0 14px 25px rgba(0,0,0,0.12)",
  },

  chatRow: {
    display: "flex",
    alignItems: "center",
    padding: "16px 18px",
    cursor: "pointer",
    borderBottom: "1px solid #efefef",
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    objectFit: "cover",
    marginRight: 14,
  },

  chatTextWrap: {
    flex: 1,
  },

  chatName: {
    fontSize: 16,
    fontWeight: 600,
  },

  chatMsg: {
    fontSize: 13,
    color: "#666",
    marginTop: 3,
  },

  rightSideWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 4,
  },

  roleText: {
    fontSize: 13,
    color: "#999",
  },

  tick: {
    fontSize: 16,
    color: "#7c3aed",
    fontWeight: 700,
  },
};
