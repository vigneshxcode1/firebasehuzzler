
import React, { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import EmojiPicker from 'emoji-picker-react';
import { format } from 'date-fns';

// Firebase (modular SDK) - requires that firebase app is initialized elsewhere
import { getAuth } from 'firebase/auth';
import { getDatabase, ref as dbRef, onValue, push, set, update, get } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, query, where, getDocs, doc, setDoc, updateDoc, serverTimestamp, limit } from 'firebase/firestore';

// Styles: this example uses Tailwind utility classes; adapt to your project CSS if needed.

export default function ChatScreen({ currentUid, otherUid, otherName, otherImage, initialMessage }) {
  // refs and state
  const auth = getAuth();
  const db = getDatabase();
  const storage = getStorage();
  const firestore = getFirestore();

  const [chatId, setChatId] = useState('');
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [imageDims, setImageDims] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showHirePromptForChat, setShowHirePromptForChat] = useState(false);

  const listRef = useRef(null);
  const inputRef = useRef(null);

  // helpers
  const genChatId = useCallback((a, b) => {
    if (!a || !b) return '';
    return a <= b ? `${a}_${b}` : `${b}_${a}`;
  }, []);

  useEffect(() => {
    const id = genChatId(currentUid, otherUid);
    setChatId(id);
  }, [currentUid, otherUid, genChatId]);

  // Listen to realtime messages
  useEffect(() => {
    if (!chatId) return;
    const messagesPath = `chats/${chatId}/messages`;
    const r = dbRef(db, messagesPath);

    // onValue returns snapshot each time
    const unsub = onValue(r, (snapshot) => {
      const val = snapshot.val();
      if (!val) {
        setMessages([]);
        return;
      }
      // val is an object map -> convert to array and sort by timestamp
      const arr = Object.values(val).map((m) => ({ ...m }));
      arr.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      setMessages(arr);
    });

    return () => unsub();
  }, [chatId, db]);

  // Send initial message once
  useEffect(() => {
    if (!initialMessage || !chatId) return;
    // simple guard: send it once per mount if provided
    _sendInitialJobMessage(initialMessage).catch((e) => console.error(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessage, chatId]);

  // helpers to update chat meta in RTDB
  async function _updateChatMeta(lastMessage, timestamp) {
    if (!chatId) return;
    const updates = {};
    updates[`/userChats/${currentUid}/${chatId}/lastMessage`] = lastMessage;
    updates[`/userChats/${currentUid}/${chatId}/lastMessageTime`] = timestamp;
    updates[`/userChats/${currentUid}/${chatId}/with`] = otherUid;
    updates[`/userChats/${otherUid}/${chatId}/lastMessage`] = lastMessage;
    updates[`/userChats/${otherUid}/${chatId}/lastMessageTime`] = timestamp;
    updates[`/userChats/${otherUid}/${chatId}/with`] = currentUid;

    await update(dbRef(db, '/'), updates).catch((e) => console.error('meta update error', e));
  }

  // store request chat like flutter code
  async function _storeRequestChat(messageText, now) {
    if (!chatId) return;
    const jobTitle = messageText.includes('[Job]') ? messageText.replace('[Job]', '').trim() : '';

    const updates = {};
    updates[`/requestChats/${currentUid}/${chatId}`] = { requestStatus: 'pending', requestedAt: now, ...(jobTitle ? { jobTitle, requestedTo: otherUid } : { requestedTo: otherUid }) };
    updates[`/requestChats/${otherUid}/${chatId}`] = { requestStatus: 'pending', requestedAt: now, ...(jobTitle ? { jobTitle, requestedBy: currentUid } : { requestedBy: currentUid }) };

    await update(dbRef(db, '/'), updates).catch((e) => console.error('request chat store error', e));
  }

  // parse simple job data (best effort)
  function _parseJobDataSimple(jobString) {
    // This is a simplified parser — adapt if your message format differs
    try {
      let cleaned = jobString.trim();
      if (cleaned.startsWith('{')) cleaned = cleaned.substring(1);
      if (cleaned.endsWith('}')) cleaned = cleaned.slice(0, -1);
      const parts = cleaned.split(',').map((p) => p.split(':').map((s) => s.trim()));
      const out = {};
      parts.forEach((kv) => {
        if (kv.length >= 2) {
          out[kv[0]] = kv.slice(1).join(':').replace(/^"|"$/g, '');
        }
      });
      return out;
    } catch (e) {
      console.error(e);
      return {};
    }
  }

  // Initial job message sender
  async function _sendInitialJobMessage(message) {
    if (!otherUid || !chatId) return;
    const user = auth.currentUser;
    if (!user) return;
    const msgId = uuidv4();
    const now = Date.now();

    let jobData = null;
    if (message.startsWith('📢 Job shared:')) {
      const jobDataString = message.substring('📢 Job shared:'.length).trim();
      jobData = _parseJobDataSimple(jobDataString);
    }

    if (jobData && Object.keys(jobData).length > 0 && jobData.id) {
      const msg = {
        id: msgId,
        senderId: currentUid,
        receiverId: otherUid,
        type: 'job',
        jobData,
        timestamp: now,
        status: 'sent',
        reactions: {},
        actionTaken: false,
        accepted: false,
      };
      await set(dbRef(db, `chats/${chatId}/messages/${msgId}`), msg);

      // create myWorks doc in Firestore with unique id
      const myWorksId = uuidv4();
      await setDoc(doc(firestore, 'myWorks', myWorksId), {
        jobId: jobData.id,
        jobData,
        status: 'sent',
        senderId: user.uid,
        receiverId: otherUid,
        chatId,
        messageId: msgId,
        sentAt: now,
      });

      const lastMessage = `[Job] ${JSON.stringify({ jobId: jobData.id, messageId: msgId, title: jobData.title || jobData.sub_category || 'Job Shared' })}`;
      await _updateChatMeta(lastMessage, now);
      await _storeRequestChat(lastMessage, now);
      scrollToBottom();
      return;
    }

    // fallback: send as text
    await _sendTextMessageInternal(message);
  }

  async function _sendTextMessageInternal(messageText) {
    if (!otherUid || !chatId) return;
    const user = auth.currentUser;
    if (!user) {
      console.error('user not authenticated');
      return;
    }
    const msgId = uuidv4();
    const now = Date.now();
    const msg = {
      id: msgId,
      senderId: currentUid,
      receiverId: otherUid,
      type: 'text',
      text: messageText,
      timestamp: now,
      status: 'sent',
      reactions: {},
    };
    await set(dbRef(db, `chats/${chatId}/messages/${msgId}`), msg);
    await _updateChatMeta(messageText, now);
    await _storeRequestChat(messageText, now);
    scrollToBottom();
  }

  async function _sendTextMessage() {
    if (!text.trim()) return;
    setIsSending(true);
    const t = text;
    setText('');
    try {
      await _sendTextMessageInternal(t);
    } catch (e) {
      console.error(e);
      alert('Failed to send message');
    } finally {
      setIsSending(false);
    }
  }

  function scrollToBottom() {
    setTimeout(() => {
      if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    }, 120);
  }

  // Image resizing in browser using canvas (simple compression)
  function resizeImageFile(file, maxWidth = 1920, quality = 0.85) {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          const ratio = maxWidth / width;
          width = maxWidth;
          height = height * ratio;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(url);
          if (!blob) resolve(file);
          const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), { type: 'image/jpeg' });
          resolve(newFile);
        }, 'image/jpeg', quality);
      };
      img.onerror = () => resolve(file);
      img.src = url;
    });
  }

  async function _sendImage(file) {
    if (!file || !otherUid || !chatId) return;
    const user = auth.currentUser;
    if (!user) return;

    const msgId = uuidv4();
    const now = Date.now();

    // cache dims
    const imgEl = document.createElement('img');
    imgEl.src = URL.createObjectURL(file);
    imgEl.onload = () => {
      setImageDims((d) => ({ ...d, [msgId]: { width: imgEl.width, height: imgEl.height } }));
      URL.revokeObjectURL(imgEl.src);
    };

    setUploadProgress((p) => ({ ...p, [msgId]: 0 }));

    try {
      const compressed = await resizeImageFile(file, 1920, 0.85);
      const name = `${msgId}.jpg`;
      const sRef = storageRef(storage, `chat_media/${chatId}/${name}`);
      const uploadTask = uploadBytesResumable(sRef, compressed);

      uploadTask.on('state_changed', (snapshot) => {
        const prog = snapshot.totalBytes ? snapshot.bytesTransferred / snapshot.totalBytes : 0;
        setUploadProgress((p) => ({ ...p, [msgId]: prog }));
      });

      await new Promise((res, rej) => {
        uploadTask.then(async (snap) => {
          const url = await getDownloadURL(snap.ref);
          const msg = {
            id: msgId,
            senderId: currentUid,
            receiverId: otherUid,
            type: 'image',
            fileUrl: url,
            thumbUrl: '',
            width: imageDims[msgId]?.width || null,
            height: imageDims[msgId]?.height || null,
            fileName: name,
            fileSize: compressed.size || 0,
            timestamp: now,
            status: 'sent',
            reactions: {},
          };
          await set(dbRef(db, `chats/${chatId}/messages/${msgId}`), msg);
          await _updateChatMeta('[Image]', now);
          scrollToBottom();
          res(true);
        }).catch((err) => rej(err));
      });
    } catch (e) {
      console.error(e);
      alert('Upload failed: ' + e.message);
    } finally {
      setUploadProgress((p) => ({ ...p, [msgId]: undefined }));
    }
  }

  async function _sendFile(file) {
    if (!file || !otherUid || !chatId) return;
    const user = auth.currentUser;
    if (!user) return;
    const msgId = uuidv4();
    const now = Date.now();
    const name = `${msgId}_${file.name}`;
    setUploadProgress((p) => ({ ...p, [msgId]: 0 }));

    try {
      const sRef = storageRef(storage, `chat_media/${chatId}/${name}`);
      const uploadTask = uploadBytesResumable(sRef, file);

      uploadTask.on('state_changed', (snapshot) => {
        const prog = snapshot.totalBytes ? snapshot.bytesTransferred / snapshot.totalBytes : 0;
        setUploadProgress((p) => ({ ...p, [msgId]: prog }));
      });

      const snap = await uploadTask;
      const url = await getDownloadURL(snap.ref);
      const msg = {
        id: msgId,
        senderId: currentUid,
        receiverId: otherUid,
        type: 'file',
        fileUrl: url,
        fileName: file.name,
        fileSize: file.size,
        timestamp: now,
        status: 'sent',
        reactions: {},
      };
      await set(dbRef(db, `chats/${chatId}/messages/${msgId}`), msg);
      await _updateChatMeta(`[File] ${file.name}`, now);
      scrollToBottom();
    } catch (e) {
      console.error(e);
      alert('File upload failed');
    } finally {
      setUploadProgress((p) => ({ ...p, [msgId]: undefined }));
    }
  }

  // Reaction
  async function _addReaction(msgId, emoji) {
    const r = push(dbRef(db, `chats/${chatId}/messages/${msgId}/reactions`));
    await set(r, { emoji, userId: currentUid, timestamp: Date.now() });
  }

  // Delete message
  async function _deleteMessage(msgId) {
    await set(dbRef(db, `chats/${chatId}/messages/${msgId}`), null).catch((e) => console.error(e));
  }

  // Accept/Decline job
  async function _handleJobAccept(message) {
    try {
      const user = auth.currentUser;
      if (!user) return alert('User not authenticated');

      // query myWorks where messageId == message.id and receiverId == user.uid
      const q = query(collection(firestore, 'myWorks'), where('messageId', '==', message.id), where('receiverId', '==', user.uid), limit(1));
      const snaps = await getDocs(q);
      if (snaps.empty) return alert('No matching job request');
      const docRef = snaps.docs[0].ref;
      await updateDoc(docRef, { status: 'accepted', freelancerId: user.uid, acceptedAt: serverTimestamp() });
      // reflect in message (local) - messages come from RTDB listener so will update automatically
      alert('Job accepted');
    } catch (e) {
      console.error(e);
      alert('Failed to accept job');
    }
  }

  async function _handleJobDecline(message) {
    try {
      const user = auth.currentUser;
      if (!user) return alert('User not authenticated');

      const q = query(collection(firestore, 'myWorks'), where('messageId', '==', message.id), where('receiverId', '==', user.uid), limit(1));
      const snaps = await getDocs(q);
      if (snaps.empty) return alert('No matching job request');
      const docRef = snaps.docs[0].ref;
      await updateDoc(docRef, { status: 'rejected', freelancerId: user.uid, declinedAt: serverTimestamp() });
      alert('Job declined');
    } catch (e) {
      console.error(e);
      alert('Failed to decline job');
    }
  }

  // Utility to fetch full job details from Firestore
  async function _fetchFullJob(jobId) {
    try {
      if (!jobId) return null;
      const snap1 = await getDocs(query(collection(firestore, 'jobs'), where('__name__', '==', jobId), limit(1)));
      if (!snap1.empty) return snap1.docs[0].data();
      const snap2 = await getDocs(query(collection(firestore, 'jobs_24h'), where('__name__', '==', jobId), limit(1)));
      if (!snap2.empty) return { ...(snap2.docs[0].data()), is24h: true };
      return null;
    } catch (e) {
      console.error('fetch job error', e);
      return null;
    }
  }

  // Simple UI components inside same file
  function MessageBubble({ msg }) {
    const isMe = msg.senderId === currentUid;
    const time = format(new Date(msg.timestamp || Date.now()), 'h:mm a');

    if (msg.type === 'job') {
      const jd = msg.jobData || {};
      const title = jd.title || jd.sub_category || 'Untitled Job';
      const skills = jd.skills ? (Array.isArray(jd.skills) ? jd.skills : jd.skills.split(',')) : [];
      return (
        <div className={`max-w-[85%] p-3 rounded-2xl shadow ${isMe ? 'ml-auto bg-white' : 'mr-auto bg-white'}`}>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-gray-100"><svg width="20" height="20" viewBox="0 0 24 24"><path fill="#333" d="M4 4h16v2H4zM4 10h16v2H4zM4 16h10v2H4z"/></svg></div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{title}</div>
                <button onClick={async () => {
                  const full = await _fetchFullJob(jd.id);
                  if (full) alert('Navigate to job detail (implement)');
                  else alert('Job details not available');
                }} className="px-3 py-1 rounded-full border-yellow-400 border">View more</button>
              </div>
              <div className="mt-2 text-sm text-gray-600">{jd.category || jd.sub_category || ''}</div>
              <div className="mt-2 flex flex-wrap gap-2">{skills.slice(0,5).map((s,i)=>(<span key={i} className="text-xs px-2 py-1 bg-yellow-50 rounded border">{s}</span>))}</div>
              <div className="mt-3 bg-gray-100 rounded-b-xl p-2 text-center">
                {/* show action buttons based on myWorks status — simplified: show accept/decline if receiver is current user */}
                {msg.actionTaken ? <div className="text-sm">{msg.accepted ? 'Accepted' : 'Declined'}</div> : (currentUid !== msg.senderId ? (
                  <div className="flex justify-center gap-2">
                    <button onClick={() => _handleJobAccept(msg)} className="px-3 py-1 rounded bg-yellow-200">Accept</button>
                    <button onClick={() => _handleJobDecline(msg)} className="px-3 py-1 rounded border">Decline</button>
                  </div>
                ) : <div className="text-sm">Job sent</div>)}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1 text-right">{time}</div>
        </div>
      );
    }

    if (msg.type === 'image') {
      return (
        <div className={`max-w-[60%] rounded-lg overflow-hidden ${isMe ? 'ml-auto' : 'mr-auto'}`}>
          <img src={msg.fileUrl} alt="image" className="object-cover" style={{ width: '100%', height: 'auto' }} onClick={() => openImageModal(msg.fileUrl)} />
          <div className="text-xs text-gray-500 text-right">{time}</div>
        </div>
      );
    }

    if (msg.type === 'file') {
      return (
        <div className={`max-w-[65%] p-3 rounded ${isMe ? 'ml-auto bg-white' : 'mr-auto bg-white'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded"><svg width="28" height="28" viewBox="0 0 24 24"><path fill="#2563EB" d="M6 2h8l4 4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/></svg></div>
            <div className="flex-1">
              <div className="font-medium">{msg.fileName}</div>
              <div className="text-sm text-gray-600">{msg.fileSize ? formatFileSize(msg.fileSize) : ''}</div>
            </div>
            <a href={msg.fileUrl} target="_blank" rel="noreferrer" className="text-sm px-3 py-1 border rounded">Open</a>
          </div>
          <div className="text-xs text-gray-500 mt-1 text-right">{time}</div>
        </div>
      );
    }

    // default text
    return (
      <div className={`max-w-[80%] p-3 rounded-lg ${isMe ? 'ml-auto bg-yellow-50' : 'mr-auto bg-gray-100'}`}>
        <div>{msg.text}</div>
        <div className="text-xs text-gray-500 text-right mt-1">{time}</div>
      </div>
    );
  }

  function formatFileSize(bytes) {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  // Image modal
  const [imageModalUrl, setImageModalUrl] = useState(null);
  function openImageModal(url) { setImageModalUrl(url); }
  function closeImageModal() { setImageModalUrl(null); }

  // file input handlers
  async function handleFileInput(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type.startsWith('image/')) {
      await _sendImage(f);
    } else {
      await _sendFile(f);
    }
    e.target.value = null;
  }

  // emoji select
  function onEmojiClick(event, emojiObject) {
    setText((t) => t + emojiObject.emoji);
    setShowEmoji(false);
    inputRef.current?.focus();
  }

  // check for hire prompt similar logic executed after messages update
  useEffect(() => {
    async function checkPrompt() {
      // simplified: if current user is client, every 5th message they sent and if accepted myWorks exist, show prompt once
      // you may want to wire proper user role logic from firestore
      if (!chatId) return;
      const myRole = await getUserRole(currentUid);
      if (myRole !== 'client') return;

      const sentByMe = messages.filter((m) => m.senderId === currentUid);
      if (sentByMe.length === 0) return;
      // find index of latest messages array where sender is me and (index+1) % 5 === 0
      for (let i = 0; i < messages.length; i++) {
        if (messages[i].senderId !== currentUid) continue;
        if ((i + 1) % 5 === 0) {
          // check myWorks accepted exists
          const q = query(collection(firestore, 'myWorks'), where('chatId', '==', chatId), where('receiverId', '==', otherUid), where('status', '==', 'accepted'), limit(1));
          const snaps = await getDocs(q);
          if (!snaps.empty && !showHirePromptForChat) {
            // show simple browser confirm for demonstration
            const docId = snaps.docs[0].id;
            const jobId = snaps.docs[0].data().jobId;
            const ok = window.confirm('Would you like to hire this person for the job?');
            if (ok) {
              // set pending_hire
              await updateDoc(doc(firestore, 'myWorks', docId), { status: 'pending_hire', clientConfirmedAt: serverTimestamp() });
              alert('Hire request sent');
            }
            setShowHirePromptForChat(true);
            break;
          }
        }
      }
    }
    checkPrompt().catch((e) => console.error(e));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, chatId]);

  // user role helper
  async function getUserRole(uid) {
    try {
      const docs = await getDocs(query(collection(firestore, 'users'), where('__name__', '==', uid), limit(1)));
      if (!docs.empty) return (docs.docs[0].data().role || '').toLowerCase();
      return '';
    } catch (e) {
      console.error(e);
      return '';
    }
  }

  // render
  return (
    <div className="flex flex-col h-full bg-white">
      {/* App bar */}
      <div className="flex items-center gap-3 p-3 border-b">
        <button onClick={() => window.history.back()} className="px-2">←</button>
        <img src={otherImage} alt="avatar" className="w-10 h-10 rounded-full object-cover" onError={(e)=>{e.target.src='https://via.placeholder.com/44'}} />
        <div className="flex-1">
          <div className="font-semibold">{otherName}</div>
          <div className="text-xs text-gray-500">Online</div>
        </div>
        <button onClick={() => alert('Hire flow (open)')} className="px-2">💼</button>
        <button onClick={() => setSearchQuery((s)=> s ? '' : '')} className="px-2">🔍</button>
      </div>

      {/* Messages area */}
      <div ref={listRef} className="flex-1 overflow-auto p-4" style={{ background: '#fff' }}>
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">No messages yet — start the conversation!</div>
        ) : (
          messages
            .filter((m) => {
              if (!searchQuery) return true;
              const q = searchQuery.toLowerCase();
              return (m.text || '').toLowerCase().includes(q) || (m.fileName || '').toLowerCase().includes(q);
            })
            .map((m) => <div key={m.id} className="mb-3"><MessageBubble msg={m} /></div>)
        )}
      </div>

      {/* Composer */}
      <div className="p-3 border-t bg-white">
        <div className="flex items-center gap-2">
          <button onClick={() => setShowEmoji((s) => !s)} className="p-2">😊</button>
          <div className="flex-1 bg-white rounded-full px-3 py-2 shadow-inner">
            <input ref={inputRef} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." className="w-full outline-none" />
          </div>
          <label className="p-2 cursor-pointer">
            📎
            <input type="file" onChange={handleFileInput} style={{ display: 'none' }} />
          </label>
          <button onClick={_sendTextMessage} className="bg-black text-white px-4 py-2 rounded-full">Send</button>
        </div>
        {showEmoji && <div className="mt-2"><EmojiPicker onEmojiClick={onEmojiClick} /></div>}
      </div>

      {/* Image modal */}
      {imageModalUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={closeImageModal}>
          <img src={imageModalUrl} alt="full" className="max-h-[90%] max-w-[90%]" />
        </div>
      )}
    </div>
  );
}

ChatScreen.propTypes = {
  currentUid: PropTypes.string.isRequired,
  otherUid: PropTypes.string.isRequired,
  otherName: PropTypes.string.isRequired,
  otherImage: PropTypes.string.isRequired,
  initialMessage: PropTypes.string,
};


// USAGE NOTE:
// - This file expects firebase app to be initialized outside (do NOT add firebase config here).
// - Install dependencies: firebase, emoji-picker-react, uuid, date-fns, prop-types
// - Tailwind is used in classNames but you can replace with your CSS.
// - Some complex Flutter features were simplified to web-friendly equivalents.