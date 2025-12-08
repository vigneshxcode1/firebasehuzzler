// ---------------------------------------------------------------
// REAL WORKING CHAT SCREEN
// ---------------------------------------------------------------

import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  getDatabase,
  ref as dbRef,
  onValue,
  push,
  set,
  serverTimestamp,
} from "firebase/database";

export default function RequestChatScreen() {
  const { chatId } = useParams();
  const location = useLocation();

  const currentUid = location.state?.currentUid;
  const otherUid = location.state?.otherUid;
  const otherName = location.state?.otherName;
  const otherImage = location.state?.otherImage;
  const initialMessage = location.state?.initialMessage;

  const db = getDatabase();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  // -------------------------------------------------------------
  // LOAD CHAT MESSAGES
  // -------------------------------------------------------------
  useEffect(() => {
    const msgRef = dbRef(db, `chats/${chatId}`);
    return onValue(msgRef, (snap) => {
      if (!snap.exists()) return;
      const data = snap.val();
      const list = Object.values(data).sort(
        (a, b) => a.timestamp - b.timestamp
      );
      setMessages(list);
    });
  }, [chatId, db]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // -------------------------------------------------------------
  // SEND MESSAGE
  // -------------------------------------------------------------
  async function sendMessage() {
    if (!input.trim()) return;

    const newMsgRef = push(dbRef(db, `chats/${chatId}`));

    await set(newMsgRef, {
      sender: currentUid,
      message: input,
      timestamp: Date.now(),
    });

    // update last message for both users
    await set(dbRef(db, `userChats/${currentUid}/${chatId}`), {
      with: otherUid,
      lastMessage: input,
      lastMessageTime: Date.now(),
    });

    await set(dbRef(db, `userChats/${otherUid}/${chatId}`), {
      with: currentUid,
      lastMessage: input,
      lastMessageTime: Date.now(),
    });

    setInput("");
  }

  // -------------------------------------------------------------
  // FIRST MESSAGE (JOB SHARE)
  // -------------------------------------------------------------
  useEffect(() => {
    if (!initialMessage) return;

    const msgRef = push(dbRef(db, `chats/${chatId}`));
    set(msgRef, {
      sender: currentUid,
      message: initialMessage,
      timestamp: Date.now(),
      system: true,
    });

  }, [initialMessage, chatId, currentUid]);

  // -------------------------------------------------------------
  // UI
  // -------------------------------------------------------------
  return (
    <div className="flex flex-col h-screen bg-gray-100">

      {/* HEADER */}
      <div className="p-4 bg-yellow-300 flex items-center shadow">
        <img
          src={otherImage || "https://via.placeholder.com/40"}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div className="text-lg font-semibold">{otherName}</div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {messages.map((m, index) => (
          <div
            key={index}
            className={`p-3 max-w-xs rounded-lg ${
              m.sender === currentUid
                ? "ml-auto bg-blue-600 text-white"
                : "mr-auto bg-white shadow"
            }`}
          >
            {m.message}
          </div>
        ))}

        <div ref={bottomRef}></div>
      </div>

      {/* INPUT BOX */}
      <div className="p-4 bg-white flex gap-3 shadow">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
          className="flex-1 p-3 border rounded-lg"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
