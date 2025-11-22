// ChatListScreen.jsx
// Single-file React component converted from your Flutter ChatListScreen.
// IMPORTANT: This file DOES NOT include Firebase configuration/initialization.
// Initialize Firebase (firebase/app) in your app root before using this component.

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { format, differenceInDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

// Firebase modular SDK (expects app initialized elsewhere)
import { getDatabase, ref as dbRef, onValue, get as rtdbGet, query as rtdbQuery, orderByChild, limitToLast, remove as rtdbRemove, update as rtdbUpdate } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, doc, getDoc, getDocs, query as fsQuery, where, limit, setDoc } from 'firebase/firestore';

// UI note: uses simple inline styles / Tailwind classnames — adapt to your project

export default function ChatListScreen({ currentUid, sharedJob, onOpenChat }) {
  const db = getDatabase();
  const firestore = getFirestore();
  const auth = getAuth();

  const [chats, setChats] = useState([]); // raw userChats entries
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userCache, setUserCache] = useState({});
  const [jobStatusCache, setJobStatusCache] = useState({});
  const [userRole, setUserRole] = useState('');

  // generate chat id helper (matches Flutter ordering)
  const genChatId = useCallback((a, b) => {
    if (!a || !b) return '';
    return a <= b ? `${a}_${b}` : `${b}_${a}`;
  }, []);

  // Listen to /userChats/{currentUid}
  useEffect(() => {
    if (!currentUid) return;
    setLoading(true);
    const userChatsRef = dbRef(db, `userChats/${currentUid}`);
    const unsub = onValue(userChatsRef, async (snapshot) => {
      const val = snapshot.val();
      if (!val || typeof val !== 'object') {
        setChats([]);
        setLoading(false);
        return;
      }

      // Build list and then fetch last message details
      const entries = Object.entries(val).map(([chatId, data]) => ({ chatId, ...data }));

      // For each entry, fetch last message (limitToLast(1)) from RTDB
      const withLast = await Promise.all(entries.map(async (entry) => {
        try {
          const messagesRef = dbRef(db, `chats/${entry.chatId}/messages`);
          const q = rtdbQuery(messagesRef, orderByChild('timestamp'), limitToLast(1));
          const snap = await rtdbGet(q);
          let lastMessage = entry.lastMessage || '';
          let lastMessageTime = entry.lastMessageTime || 0;

          if (snap.exists() && snap.val() && typeof snap.val() === 'object') {
            const msgs = Object.values(snap.val());
            if (msgs.length) {
              const m = msgs[0];
              lastMessageTime = m.timestamp || lastMessageTime || Date.now();
              if (m.type === 'job') {
                lastMessage = `[Job] ${m.jobData?.title ?? m.jobData?.sub_category ?? 'Job Shared'}`;
              } else {
                lastMessage = m.text ?? (m.fileName ? `[Attachment] ${m.fileName}` : '[Attachment]');
              }
            }
          }

          return {
            chatId: entry.chatId,
            withUid: entry.with || entry.withUid || '',
            lastMessage,
            lastMessageTime,
          };
        } catch (e) {
          console.error('error fetching last message', e);
          return {
            chatId: entry.chatId,
            withUid: entry.with || entry.withUid || '',
            lastMessage: entry.lastMessage || '',
            lastMessageTime: entry.lastMessageTime || 0,
          };
        }
      }));

      // sort by lastMessageTime desc
      withLast.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));
      setChats(withLast);
      setLoading(false);
    });

    return () => unsub();
  }, [currentUid, db]);

  // load user role
  useEffect(() => {
    if (!currentUid) return;
    (async () => {
      try {
        const userDoc = await getDoc(doc(firestore, 'users', currentUid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserRole((data?.role || '').toString().toLowerCase());
        }
      } catch (e) {
        console.error('load role error', e);
      }
    })();
  }, [currentUid, firestore]);

  // helper: fetch user data with local cache
  async function fetchUserData(uid) {
    if (!uid) return null;
    if (userCache[uid]) return userCache[uid];
    try {
      const udoc = await getDoc(doc(firestore, 'users', uid));
      if (udoc.exists()) {
        const d = udoc.data();
        setUserCache((c) => ({ ...c, [uid]: d }));
        return d;
      }
    } catch (e) {
      console.error('fetchUserData error', e);
    }
    return null;
  }

  function formatTime(ts) {
    if (!ts) return '';
    const date = new Date(ts);
    const diff = differenceInDays(new Date(), date);
    if (diff === 0) return format(date, 'h:mm a');
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return format(date, 'EEEE');
    return format(date, 'MMM d');
  }

  // send job message (creates myWorks doc and writes job message into RTDB)
  async function sendJobMessage({ chatId, receiverId, job }) {
    try {
      const me = auth.currentUser;
      if (!me) return alert('User not authenticated');
      const now = Date.now();
      const msgId = uuidv4();
      const cleanedJob = { ...job };
      if (!cleanedJob.createdAt) cleanedJob.createdAt = now;

      // write myWorks doc
      const myWorksId = uuidv4();
      await setDoc(doc(firestore, 'myWorks', myWorksId), {
        jobId: cleanedJob.id,
        jobData: cleanedJob,
        status: 'sent',
        senderId: me.uid,
        receiverId,
        chatId,
        messageId: msgId,
        sentAt: now,
      });

      // write message to RTDB
      await rtdbUpdate(dbRef(db, `/chats/${chatId}/messages/${msgId}`), {
        id: msgId,
        type: 'job',
        jobData: cleanedJob,
        senderId: me.uid,
        receiverId,
        timestamp: now,
        status: 'sent',
        reactions: {},
      });

      // update userChats meta
      const lastMessageText = `[Job] ${cleanedJob.title || cleanedJob.sub_category || 'Job Shared'}`;
      const updates = {};
      updates[`/userChats/${me.uid}/${chatId}`] = { lastMessage: lastMessageText, lastMessageTime: now, with: receiverId };
      updates[`/userChats/${receiverId}/${chatId}`] = { lastMessage: lastMessageText, lastMessageTime: now, with: me.uid };
      await rtdbUpdate(dbRef(db, '/'), updates);

      alert('Job sent');
    } catch (e) {
      console.error('sendJobMessage error', e);
      alert('Failed to send job');
    }
  }

  // helper to check job validity / permissions similar to _isChatValid
  async function isChatValid(chat) {
    try {
      if (!chat.lastMessage || !chat.lastMessage.startsWith('[Job]')) return true;
      // parse JSON after prefix
      const maybe = chat.lastMessage.replace(/^[^\[]*/,'').replace(/^\[Job\]\s*/,'');
      // the Flutter version encoded JSON into lastMessage; we try to parse if present
      let jobId = null;
      let messageId = null;
      try {
        const parsed = JSON.parse(maybe);
        jobId = parsed.jobId || parsed.job_id || null;
        messageId = parsed.messageId || parsed.message_id || null;
      } catch (_) {
        // not JSON — fallback to showing the chat
        return true;
      }

      if (!jobId || !messageId) return true;
      const cacheKey = `${jobId}_${messageId}`;
      if (jobStatusCache[cacheKey] !== undefined) {
        return jobStatusCache[cacheKey] === 'accepted';
      }

      const q = fsQuery(collection(firestore, 'myWorks'), where('jobId', '==', jobId), where('messageId', '==', messageId), limit(1));
      const snaps = await getDocs(q);
      if (!snaps.empty) {
        const d = snaps.docs[0].data();
        const status = d.status;
        const senderId = d.senderId;
        const receiverId = d.receiverId;
        setJobStatusCache((s) => ({ ...s, [cacheKey]: status }));
        if (status === 'accepted') return true;
        if (status === 'pending' && receiverId === currentUid) return true;
        if (senderId === currentUid) return true;
        return false;
      }
      setJobStatusCache((s) => ({ ...s, [cacheKey]: null }));
      return true;
    } catch (e) {
      console.error('isChatValid error', e);
      return true;
    }
  }

  // delete chat both from userChats and chats nodes
  async function deleteChat(chat) {
    if (!chat) return;
    if (!window.confirm('Delete this chat? This action cannot be undone.')) return;
    try {
      await rtdbRemove(dbRef(db, `userChats/${currentUid}/${chat.chatId}`));
      await rtdbRemove(dbRef(db, `chats/${chat.chatId}`));
      alert('Chat deleted');
    } catch (e) {
      console.error('deleteChat error', e);
      alert('Failed to delete chat');
    }
  }

  // Render list with async user data + validity checks
  const renderedList = useMemo(() => chats, [chats]);

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-b-2xl">
        <div className="text-2xl font-semibold">Messages</div>
        <div className="mt-4">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
            placeholder="Search"
            className="w-full p-3 rounded bg-white shadow"
          />
        </div>
        <div className="mt-3 flex justify-between items-center">
          <div className="text-lg font-medium">Messages</div>
          {userRole === 'freelancer' && (
            <button className="px-3 py-1 rounded-full bg-yellow-300" onClick={() => alert('Open requests (implement)')}>Request</button>
          )}
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="text-center p-8">Loading...</div>
        ) : renderedList.length === 0 ? (
          <div className="text-center p-8 text-gray-400">No messages yet</div>
        ) : (
          <div className="space-y-3">
            {renderedList.map((chat) => (
              <ChatListRow
                key={chat.chatId}
                chat={chat}
                fetchUserData={fetchUserData}
                searchQuery={searchQuery}
                isChatValid={isChatValid}
                onOpenChat={onOpenChat}
                deleteChat={deleteChat}
                formatTime={formatTime}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

ChatListScreen.propTypes = {
  currentUid: PropTypes.string.isRequired,
  sharedJob: PropTypes.object,
  onOpenChat: PropTypes.func, // optional callback (chatId, withUid, name, image)
};

function ChatListRow({ chat, fetchUserData, searchQuery, isChatValid, onOpenChat, deleteChat, formatTime }) {
  const [userData, setUserData] = useState(null);
  const [valid, setValid] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const u = await fetchUserData(chat.withUid);
      if (mounted) setUserData(u);
      const ok = await isChatValid(chat);
      if (mounted) setValid(ok);
    })();
    return () => { mounted = false; };
  }, [chat, fetchUserData, isChatValid]);

  if (!valid) return null;
  const fullName = userData ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim() : chat.withUid;
  if (searchQuery && !fullName.toLowerCase().includes(searchQuery)) return null;

  return (
    <div className="flex items-center p-3 bg-white rounded shadow-sm" style={{ cursor: 'pointer' }}>
      <img src={userData?.imageUrl || 'https://via.placeholder.com/56'} alt="avatar" className="w-14 h-14 rounded-full object-cover" />
      <div className="flex-1 ml-4" onClick={() => onOpenChat ? onOpenChat(chat.chatId, chat.withUid, fullName, userData?.imageUrl) : null}>
        <div className="flex justify-between items-center">
          <div className="font-semibold text-black">{fullName}</div>
          <div className="text-sm text-gray-500">{formatTime(chat.lastMessageTime)}</div>
        </div>
        <div className="text-gray-600 mt-1 text-sm">{chat.lastMessage}</div>
      </div>
      <div className="ml-3 flex flex-col gap-2">
        <button onClick={() => { if (onOpenChat) onOpenChat(chat.chatId, chat.withUid, fullName, userData?.imageUrl); }}>Open</button>
        <button onClick={() => deleteChat(chat)} className="text-red-500">Delete</button>
      </div>
    </div>
  );
}

ChatListRow.propTypes = {
  chat: PropTypes.object.isRequired,
  fetchUserData: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
  isChatValid: PropTypes.func.isRequired,
  onOpenChat: PropTypes.func,
  deleteChat: PropTypes.func.isRequired,
  formatTime: PropTypes.func.isRequired,
};

/*
USAGE NOTES:
- This file expects Firebase to be initialized elsewhere (do NOT include firebase config here).
- Add `onOpenChat` prop to navigate to your ChatScreen component, e.g.
    <ChatListScreen currentUid={uid} onOpenChat={(chatId, withUid, name, image) => navigate('/chat', { state: { chatId, withUid, name, image }})} />
- Install dependencies: firebase, date-fns, uuid, prop-types
- Some Flutter-specific behaviors (CachedNetworkImage, Riverpod providers) are simplified to idiomatic React hooks.
*/