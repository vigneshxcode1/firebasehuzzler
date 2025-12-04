// components/RequestChatScreen.jsx
import React, { useEffect, useState, useRef } from "react";
import { getDatabase, ref as dbRef, onValue, push, set, update } from "firebase/database";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

/**
 * This screen shows request-type chats (notifications) for freelancer,
 * and allows opening a chat route (and seeds initial message if needed).
 *
 * It assumes 'notifications' Firestore collection exists.
 */

export default function RequestChatScreen() {
  const firestore = getFirestore();
  const db = getDatabase();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Example: get current user UID from your auth (simplified)
  // Replace with your auth.currentUser
  const currentUid = (typeof window !== "undefined" && window.__CURRENT_UID) || null;

  useEffect(() => {
    // Listener for user's notifications (for freelancer)
    // For demo: we read all notifications collection where receiver is currentUid
    if (!currentUid) {
      setLoading(false);
      return;
    }

    // Here we use Firestore snapshot in your app; since we use getFirestore above,
    // you should implement a Firestore listener. For brevity we skip realtime code.
    (async () => {
      try {
        // naive fetch: all notifications where freelancerId == currentUid
        // Replace with real query + onSnapshot in production
        // Example assumes you know how to query; using getDoc not shown here
        setLoading(false);
        setRequests([]); // fill with fetched requests
      } catch (e) {
        setLoading(false);
      }
    })();
  }, [currentUid, firestore]);

  async function openOrCreateChat(clientUid, initialMessage) {
    if (!currentUid) return;
    if (!clientUid) return;
    const chatId = [currentUid, clientUid].sort().join("_");

    // Ensure last message meta and initial message exist
    // Write initial message if chat/messages empty
    const messagesRef = dbRef(db, `chats/${chatId}/messages`);
    const newMsgRef = push(messagesRef);
    const now = Date.now();
    const payload = {
      id: newMsgRef.key,
      text: initialMessage || "Hi, I accepted your request",
      senderId: clientUid, // who initiated: client
      receiverId: currentUid,
      timestamp: now,
      type: "text",
    };
    await set(newMsgRef, payload);

    // update userChats meta for both
    const metaA = { with: currentUid, lastMessage: payload.text, lastMessageTime: now };
    const metaB = { with: clientUid, lastMessage: payload.text, lastMessageTime: now };
    await update(dbRef(db, `userChats/${clientUid}/${chatId}`), metaA);
    await update(dbRef(db, `userChats/${currentUid}/${chatId}`), metaB);

    // navigate to chat
    navigate("/chat", { state: { chatId, currentUid, otherUid: clientUid, otherName: "Client" } });
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Request Chats</h2>
      <div>
        {loading ? <div>Loading...</div> : requests.length === 0 ? <div>No requests</div> : requests.map((r) => (
          <div key={r.id} style={{ padding: 12, border: "1px solid #eee", marginBottom: 8 }}>
            <div style={{ fontWeight: 600 }}>{r.title}</div>
            <div style={{ color: "#666", marginTop: 6 }}>{r.description}</div>
            <div style={{ marginTop: 8 }}>
              <button onClick={() => openOrCreateChat(r.clientUid, r.initialMessage)} style={{ padding: "8px 12px", background: "#0b93f6", color: "#fff", borderRadius: 8 }}>
                Open Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
