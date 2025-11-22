// FreelancerFullDetail.jsx
import React, { useEffect, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
  addDoc,
  updateDoc,
  serverTimestamp,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { ref as rtdbRef, set as rtdbSet, update as rtdbUpdate } from "firebase/database";
import { auth, db, rtdb } from "../firbase/Firebase";

/**
 * Cleaned, single-file Freelancer profile page with:
 * - Connect button + modal
 * - Submit collaboration request (Firestore)
 * - Create/seed a chat in RTDB and navigate to chat screen with initial message
 * - Accept/Decline helper functions
 *
 * Requirements: Firebase must be initialized and exported from ../firbase/Firebase as { auth, db, rtdb }
 */

function ChatPlaceholder({ otherName, initialMessage }) {
  // lightweight placeholder used if route navigates back to this component's local chat view
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Chat with {otherName}</h2>
      <pre className="mt-3 bg-gray-100 p-3 rounded break-words whitespace-pre-wrap">{initialMessage}</pre>
      <div className="mt-6 text-gray-500">This is a placeholder. Your chat screen component should render at /chat/:chatId</div>
    </div>
  );
}

function JobDetail({ job }) {
  if (!job) return null;
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">{job.title || "Job Detail"}</h2>
      <p className="mt-2 text-gray-700 whitespace-pre-wrap">{job.description}</p>
    </div>
  );
}

export default function FreelancerFullDetail({ linkedinUrl: propLinkedinUrl, userId: propUserId, jobid: propJobId }) {
  const freelancerUid = propUserId || null;
  const navigate = useNavigate();

  // app state
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequested, setIsRequested] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [workServices, setWorkServices] = useState([]);
  const [hours24Services, set24hServices] = useState([]);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [jobsList, setJobsList] = useState([]);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [routeLocal, setRouteLocal] = useState({ name: "profile", params: {} });
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("work");

  // auth listener
  useEffect(() => {
    const unsub = auth.onAuthStateChanged ? auth.onAuthStateChanged((u) => setCurrentUser(u)) : () => {};
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, []);

  // load freelancer profile + lists
  useEffect(() => {
    if (!freelancerUid) {
      setError("No user id provided");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    const userDocRef = doc(db, "users", freelancerUid);
    const unsubProfile = onSnapshot(
      userDocRef,
      (snap) => {
        const payload = snap && snap.exists ? snap.data() : (snap && snap.data ? snap.data() : null);
        setProfile(payload);
        setIsLoading(false);
      },
      (err) => {
        console.error("profile snapshot error", err);
        setError(String(err));
        setIsLoading(false);
      }
    );

    // portfolio
    const portfolioCol = collection(db, "users", freelancerUid, "portfolio");
    const unsubPortfolio = onSnapshot(portfolioCol, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPortfolioItems(arr);
    });

    // services
    const servicesQuery = query(collection(db, "users", freelancerUid, "services"), orderBy("createdAt", "desc"));
    const unsubServices = onSnapshot(servicesQuery, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setWorkServices(arr);
    });

    const services24Query = query(collection(db, "users", freelancerUid, "services_24h"), orderBy("createdAt", "desc"));
    const unsub24 = onSnapshot(services24Query, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      set24hServices(arr);
    });

    checkIfRequestedAndAccepted().catch((e) => console.warn(e));

    return () => {
      try {
        unsubProfile();
        unsubPortfolio();
        unsubServices();
        unsub24();
      } catch (e) {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freelancerUid]);

  // check if current user has requested/accepted this freelancer
  async function checkIfRequestedAndAccepted() {
    try {
      const me = auth.currentUser;
      if (!me || !freelancerUid) return;
      const qReq = query(
        collection(db, "collaboration_requests"),
        where("clientId", "==", me.uid),
        where("freelancerId", "==", freelancerUid),
        where("status", "==", "sent")
      );
      const reqSnap = await getDocs(qReq);
      setIsRequested(!reqSnap.empty);

      const qAcc = query(collection(db, "accepted_jobs"), where("clientId", "==", me.uid), where("freelancerId", "==", freelancerUid));
      const accSnap = await getDocs(qAcc);
      setIsAccepted(!accSnap.empty);
    } catch (err) {
      console.error("checkIfRequestedAndAccepted", err);
    }
  }

  // fetch current user's jobs (for connect modal)
  const fetchMyJobs = useCallback(async () => {
    try {
      const me = auth.currentUser;
      if (!me) {
        alert("Please login");
        return [];
      }
      const arr = [];
      const q1 = query(collection(db, "jobs"), where("userId", "==", me.uid));
      const q2 = query(collection(db, "jobs_24h"), where("userId", "==", me.uid));
      const s1 = await getDocs(q1);
      const s2 = await getDocs(q2);
      s1.forEach((d) => arr.push({ id: d.id, type: "services", ...d.data() }));
      s2.forEach((d) => arr.push({ id: d.id, type: "services_24h", ...d.data() }));
      setJobsList(arr);
      return arr;
    } catch (err) {
      console.error("fetchMyJobs", err);
      return [];
    }
  }, []);

  // open linkedin
  function openLinkedIn(url) {
    if (!url) {
      toast("No LinkedIn profile available");
      return;
    }
    const fixed = url.startsWith("http") ? url : `https://${url}`;
    window.open(fixed, "_blank", "noopener,noreferrer");
  }

  function toast(msg) {
    // replace with your toast library if available
    // eslint-disable-next-line no-alert
    alert(msg);
  }

  async function openConnectModal() {
    await fetchMyJobs();
    setSelectedJob(null);
    setProjectTitle("");
    setProjectDesc("");
    setShowConnectModal(true);
  }

  // we will create a realtime-chat seed and navigate to /chat/:chatId
  function getChatId(uid1, uid2) {
    if (!uid1 || !uid2) return null;
    return [uid1, uid2].sort().join("_");
  }

  // helper: write initial message into RTDB - used after creating collaboration_request
  async function writeInitialMessageToChat({ chatId, senderId, receiverId, initialMessage }) {
    try {
      const now = Date.now();
      const msgId = uuidv4();
      const payload = {
        id: msgId,
        senderId,
        receiverId,
        text: initialMessage,
        type: "text",
        timestamp: now,
        status: "sent",
        reactions: {},
      };
      await rtdbSet(rtdbRef(rtdb, `chats/${chatId}/messages/${msgId}`), payload);

      // update userChats meta for both participants
      const lastMessageText = initialMessage?.slice(0, 200) || "[Message]";
      const updates = {};
      updates[`/userChats/${senderId}/${chatId}`] = {
        lastMessage: lastMessageText,
        lastMessageTime: now,
        with: receiverId,
      };
      updates[`/userChats/${receiverId}/${chatId}`] = {
        lastMessage: lastMessageText,
        lastMessageTime: now,
        with: senderId,
      };
      await rtdbUpdate(rtdbRef(rtdb, "/"), updates);
      return { ok: true, chatMessageId: msgId };
    } catch (err) {
      console.error("writeInitialMessageToChat error", err);
      return { ok: false, error: err };
    }
  }

  // submit collaboration request (Firestore) AND seed chat + navigate to chat page
  async function submitCollaborationRequest() {
    try {
      const me = auth.currentUser;
      if (!me) {
        toast("Please login");
        return;
      }
      if (!projectTitle.trim()) {
        toast("Please enter project title");
        return;
      }

      // create collaboration request
      const payload = {
        clientId: me.uid,
        freelancerId: freelancerUid,
        title: projectTitle,
        description: projectDesc || "",
        status: "sent",
        timestamp: serverTimestamp(),
      };
      if (selectedJob) {
        payload.jobId = selectedJob.id;
        payload.jobType = selectedJob.type || "services";
      }
      const reqRef = await addDoc(collection(db, "collaboration_requests"), payload);

      // Prepare initial message text
      let initialMessageText = "";
      if (selectedJob && selectedJob.id) {
        // attempt to fetch job doc details to craft message
        let jobDoc = null;
        try {
          const snapA = await getDoc(doc(db, "jobs", selectedJob.id));
          if (snapA.exists()) jobDoc = snapA.data();
        } catch (e) {}
        try {
          const snapB = await getDoc(doc(db, "jobs_24h", selectedJob.id));
          if (snapB.exists()) jobDoc = snapB.data();
        } catch (e) {}
        if (jobDoc) {
          initialMessageText = `📢 Job shared: ${JSON.stringify({ id: selectedJob.id, title: jobDoc.title || "Untitled", description: jobDoc.description || "" })}`;
          toast("Service prepared for chat");
        } else {
          initialMessageText = `Collaboration request regarding "${projectTitle}".`;
        }
      } else {
        initialMessageText = `Collaboration request: ${projectTitle}\nDescription: ${projectDesc}`;
      }

      setIsRequested(true);
      setShowConnectModal(false);

      // create / ensure userChats meta and write initial message
      const chatId = getChatId(me.uid, freelancerUid);
      if (!chatId) {
        toast("Could not create chat id");
        return;
      }

      // ensure userChats nodes exist (set simple meta)
      const now = Date.now();
      const metaA = { lastMessage: initialMessageText?.slice(0, 200) || "", lastMessageTime: now, with: freelancerUid };
      const metaB = { lastMessage: initialMessageText?.slice(0, 200) || "", lastMessageTime: now, with: me.uid };
      const updates = {};
      updates[`/userChats/${me.uid}/${chatId}`] = metaA;
      updates[`/userChats/${freelancerUid}/${chatId}`] = metaB;
      await rtdbUpdate(rtdbRef(rtdb, "/"), updates);

      // write initial message
      await writeInitialMessageToChat({ chatId, senderId: me.uid, receiverId: freelancerUid, initialMessage: initialMessageText });

      // navigate to chat route, include state
      navigate(`/chat/${chatId}`, {
        state: {
          chatId,
          currentUid: me.uid,
          otherUid: freelancerUid,
          otherName: `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim(),
          otherImage: profile?.profileImage || "",
        },
      });
    } catch (err) {
      console.error("submitCollaborationRequest", err);
      toast("Error sending request");
    }
  }

  // sendJobMessage helper (share service directly to an existing chat)
  async function sendJobMessage({ chatId, receiverId, job }) {
    try {
      const me = auth.currentUser;
      if (!me) {
        toast("Not logged in");
        return;
      }
      const now = Date.now();
      const msgId = uuidv4();
      const cleanedJob = { ...job };
      Object.keys(cleanedJob).forEach((k) => {
        if (cleanedJob[k] === null || cleanedJob[k] === undefined) delete cleanedJob[k];
      });
      if (!cleanedJob.createdAt) cleanedJob.createdAt = now;

      const messageData = {
        id: msgId,
        type: "job",
        jobData: cleanedJob,
        senderId: me.uid,
        receiverId,
        timestamp: now,
        status: "sent",
        reactions: {},
        actionTaken: false,
        accepted: false,
      };
      await rtdbSet(rtdbRef(rtdb, `chats/${chatId}/messages/${msgId}`), messageData);

      const lastMessageText = `Service shared: ${cleanedJob.title || cleanedJob.id || "[Service]"}`;
      const updates = {};
      updates[`/userChats/${me.uid}/${chatId}`] = {
        lastMessage: lastMessageText,
        lastMessageTime: now,
        with: receiverId,
      };
      updates[`/userChats/${receiverId}/${chatId}`] = {
        lastMessage: lastMessageText,
        lastMessageTime: now,
        with: me.uid,
      };
      await rtdbUpdate(rtdbRef(rtdb, "/"), updates);
      toast("Service shared to chat");
    } catch (err) {
      console.error("sendJobMessage", err);
      toast("Error sending service");
    }
  }

  // Accept freelancer for a job (used by client)
  async function handleAccept() {
    try {
      const me = auth.currentUser;
      if (!me) {
        toast("Not logged in");
        return;
      }
      const jobId = propJobId;
      const freelancerId = freelancerUid;
      if (!jobId || !freelancerId) {
        toast("Missing job or freelancer info");
        return;
      }
      // mark notifications as read (if any)
      const notifQ = query(collection(db, "notifications"), where("jobId", "==", jobId), where("freelancerId", "==", freelancerId));
      const notifSnap = await getDocs(notifQ);
      if (!notifSnap.empty) {
        const docId = notifSnap.docs[0].id;
        await updateDoc(doc(db, "notifications", docId), { read: true });
      }

      const fSnap = await getDoc(doc(db, "users", freelancerId));
      const freelancerData = fSnap.exists() ? fSnap.data() : {};
      const freelancerName = `${freelancerData?.firstName || ""} ${freelancerData?.lastName || ""}`.trim();
      const freelancerImage = freelancerData?.profileImage || "";

      await addDoc(collection(db, "accepted_jobs"), {
        jobId,
        freelancerId,
        freelancerName,
        freelancerImage,
        acceptedAt: serverTimestamp(),
        status: "accepted",
        clientId: me.uid,
      });

      setIsAccepted(true);
      toast("Freelancer accepted successfully");
    } catch (err) {
      console.error("handleAccept", err);
      toast("Error accepting freelancer");
    }
  }

  // Decline freelancer (remove notifications)
  async function handleDecline() {
    try {
      const jobId = propJobId;
      const freelancerId = freelancerUid;
      if (!jobId || !freelancerId) {
        toast("Missing job or freelancer info");
        return;
      }
      const notifQ = query(collection(db, "notifications"), where("jobId", "==", jobId), where("freelancerId", "==", freelancerId));
      const notifSnap = await getDocs(notifQ);
      const deletes = notifSnap.docs.map((d) => deleteDoc(doc(db, "notifications", d.id)));
      await Promise.all(deletes);
      toast("Freelancer declined");
    } catch (err) {
      console.error("handleDecline", err);
      toast("Error declining freelancer");
    }
  }

  // Helpers for share, delete, open portfolio
  function shareProfile(linkedinUrl, fullName) {
    try {
      const fixed = linkedinUrl ? (linkedinUrl.startsWith("http") ? linkedinUrl : `https://${linkedinUrl}`) : "";
      const text = fixed ? `Check out ${fullName}'s professional profile: ${fixed}` : `Check out ${fullName}'s professional profile`;
      if (navigator.share) {
        navigator.share({ title: `Profile - ${fullName}`, text, url: fixed }).catch((e) => console.warn(e));
      } else {
        navigator.clipboard?.writeText(text).then(() => toast("Profile copied to clipboard"));
      }
    } catch (err) {
      console.error("shareProfile", err);
      toast("Error sharing profile");
    }
  }

  function shareService(job) {
    const title = job?.title || "Service";
    const price = job?.price || job?.budget || "0";
    const text = `Check out this service: ${title}\nPrice: ₹${price}`;
    if (navigator.share) {
      navigator.share({ title: `Service - ${title}`, text }).catch((e) => console.warn(e));
    } else {
      navigator.clipboard?.writeText(text).then(() => toast("Service details copied"));
    }
  }

  function openPortfolioUrl(url) {
    if (!url) {
      toast("No project link available");
      return;
    }
    const fixed = url.startsWith("http") ? url : `https://${url}`;
    window.open(fixed, "_blank", "noopener,noreferrer");
  }

  async function deletePortfolioItem(docId, uid, title) {
    const ok = window.confirm(`Delete '${title}'? This cannot be undone.`);
    if (!ok) return;
    try {
      await deleteDoc(doc(db, "users", uid, "portfolio", docId));
      toast("Portfolio item deleted");
    } catch (err) {
      console.error("deletePortfolioItem", err);
      toast("Error deleting portfolio");
    }
  }

  // deletion helpers for services
  async function confirmDeleteService(job, docId, uid) {
    const ok = window.confirm(`Delete service '${job.title || ""}'?`);
    if (!ok) return;
    try {
      try {
        await deleteDoc(doc(db, "services", docId));
      } catch (e) {}
      try {
        await deleteDoc(doc(db, "users", uid, "services", docId));
      } catch (e) {}
      toast("Service deleted");
    } catch (err) {
      console.error("confirmDeleteService", err);
      toast("Error deleting service");
    }
  }

  async function confirmDelete24hJob(job, docId, uid) {
    const ok = window.confirm(`Delete 24h job '${job.title || ""}'?`);
    if (!ok) return;
    try {
      await deleteDoc(doc(db, "users", uid, "services_24h", docId));
      toast("24h job deleted");
    } catch (err) {
      console.error("confirmDelete24hJob", err);
      toast("Error deleting 24h job");
    }
  }

  // UI: Connect modal markup moved to JSX below

  // Local routing view (simple placeholder chat view if user clicks Message)
  if (routeLocal.name === "chat") {
    const { currentUid, otherUid, otherName, initialMessage } = routeLocal.params;
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-4">
          <button className="px-3 py-1 bg-white rounded shadow" onClick={() => setRouteLocal({ name: "profile", params: {} })}>
            ← Back
          </button>
        </div>
        <ChatPlaceholder otherName={otherName} initialMessage={initialMessage} />
      </div>
    );
  }

  // Job detail view local
  if (routeLocal.name === "jobDetail") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-4">
          <button className="px-3 py-1 bg-white rounded shadow" onClick={() => setRouteLocal({ name: "profile", params: {} })}>
            ← Back
          </button>
        </div>
        <JobDetail job={routeLocal.params.job} />
      </div>
    );
  }

  // Main profile render
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="p-4 flex items-center">
          <button className="mr-2 p-2 rounded bg-white shadow" onClick={() => window.history.back()}>
            ←
          </button>
          <h1 className="text-lg font-semibold">Freelancer Profile</h1>
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-24">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-yellow-300 border-t-transparent rounded-full mx-auto" />
                <p className="mt-3 text-gray-600">Loading profile...</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-8 bg-white rounded shadow text-center">
              <p className="text-red-500">{error}</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          ) : !profile ? (
            <div className="p-8 bg-white rounded shadow text-center">
              <p className="text-gray-500">User profile not found</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="relative">
                <div
                  className="h-56 w-full rounded-b-2xl overflow-hidden"
                  style={{
                    background: profile.coverImage ? `url(${profile.coverImage}) center/cover` : "linear-gradient(90deg,#fff8d6,#fff8d6)",
                  }}
                />
                <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-10">
                  <div className="bg-white rounded-xl shadow p-6 w-[92vw] sm:w-[720px]">
                    <div className="flex flex-col items-center -mt-12">
                      <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-lg">
                        {profile.profileImage ? (
                          <img src={profile.profileImage} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-600">👤</div>
                        )}
                      </div>
                      <h2 className="mt-3 text-xl font-semibold">{`${profile.firstName || ""} ${profile.lastName || ""}`.trim() || "User"}</h2>
                      <p className="text-sm text-gray-600 mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z" stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                        {profile.location || "Location not set"}
                      </p>

                      <div className="mt-4 flex items-center gap-3">
                        {isAccepted ? (
                          <button
                            onClick={() => {
                              const me = auth.currentUser;
                              if (!me) {
                                toast("Please login");
                                return;
                              }
                              // navigate to chat route for messaging; create chatId and navigate
                              const chatId = getChatId(me.uid, freelancerUid);
                              navigate(`/chat/${chatId}`, {
                                state: {
                                  chatId,
                                  currentUid: me.uid,
                                  otherUid: freelancerUid,
                                  otherName: `${profile.firstName || ""} ${profile.lastName || ""}`.trim(),
                                  otherImage: profile.profileImage || "",
                                },
                              });
                            }}
                            className="px-4 py-2 rounded bg-yellow-200 text-black font-semibold"
                          >
                            Message
                          </button>
                        ) : isRequested ? (
                          <button className="px-4 py-2 rounded bg-gray-300 text-white cursor-not-allowed">Requested</button>
                        ) : (
                          <button onClick={openConnectModal} className="px-4 py-2 rounded bg-yellow-200 text-black font-semibold">
                            Connect
                          </button>
                        )}

                        <button
                          onClick={() => shareProfile(profile.linkedin || propLinkedinUrl || "", `${profile.firstName || ""} ${profile.lastName || ""}`.trim())}
                          className="px-3 py-2 rounded bg-white border"
                        >
                          Share
                        </button>
                        <button onClick={() => openLinkedIn(profile.linkedin || propLinkedinUrl || "")} className="px-3 py-2 rounded bg-white border">
                          <img src="/assets/linkedin.png" alt="linkedin" className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="mt-16 space-y-6">
                {/* About */}
                <div className="bg-white rounded-xl p-6 border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">Professional Title</h3>
                      <div className="mt-2 inline-block bg-green-50 px-3 py-1 rounded text-green-700 font-medium">{profile.professional_title || "No Title"}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="w-10 h-10 rounded bg-white shadow flex items-center justify-center">📎</button>
                      <button className="w-10 h-10 rounded bg-white shadow flex items-center justify-center">⋯</button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-md font-semibold">About</h4>
                    <p className="mt-2 text-gray-700 leading-relaxed">{profile.about || "No About Info"}</p>
                  </div>
                  {(Array.isArray(profile.skills) && profile.skills.length > 0) || (Array.isArray(profile.tools) && profile.tools.length > 0) ? (
                    <div className="mt-4">
                      <h4 className="text-md font-semibold">Skills & Tools</h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(profile.skills || []).map((s, i) => (
                          <span key={`sk${i}`} className="bg-white border px-3 py-1 rounded">
                            {s}
                          </span>
                        ))}
                        {(profile.tools || []).map((s, i) => (
                          <span key={`to${i}`} className="bg-white border px-3 py-1 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Portfolio */}
                <div>
                  <h3 className="text-xl font-semibold">Portfolio</h3>
                  <div className="mt-4 space-y-4">
                    {portfolioItems.length === 0 ? (
                      <div className="bg-white p-6 rounded text-center text-gray-500">No portfolio items yet.</div>
                    ) : (
                      portfolioItems.map((p) => (
                        <div key={p.id} className="bg-white rounded-xl shadow p-4 flex gap-4">
                          <div className="w-28 h-36 rounded overflow-hidden bg-gray-100">
                            {p.imageUrl ? <img src={p.imageUrl} alt={p.title || "proj"} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{p.title || "Untitled"}</h4>
                            <p className="text-sm text-gray-600 mt-2 line-clamp-3">{p.description || "No description"}</p>
                            <div className="mt-3 flex gap-2">
                              <button onClick={() => openPortfolioUrl(p.projectUrl)} className="px-3 py-1 bg-yellow-100 rounded">Open</button>
                              <button onClick={() => deletePortfolioItem(p.id, freelancerUid, p.title || "")} className="px-3 py-1 bg-red-100 rounded text-red-600">Delete</button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Services */}
                <div className="bg-white p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Services</h3>
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedTab("work")} className={`px-3 py-1 rounded ${selectedTab === "work" ? "bg-yellow-200" : "bg-white border"}`}>Work</button>
                      <button onClick={() => setSelectedTab("24h")} className={`px-3 py-1 rounded ${selectedTab === "24h" ? "bg-yellow-200" : "bg-white border"}`}>24 hour</button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {selectedTab === "work" ? (
                      workServices.length === 0 ? (
                        <div className="text-center p-6 text-gray-500">No work services yet</div>
                      ) : (
                        workServices.map((job) => (
                          <div key={job.id} className="flex bg-yellow-50 rounded-lg overflow-hidden">
                            <div className="w-36 bg-yellow-100 p-3 flex flex-col items-center">
                              <div className="w-full h-20 rounded overflow-hidden mb-2 bg-gray-200">
                                {job.image ? <img src={job.image} alt="job" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">No Img</div>}
                              </div>
                              <div className="text-center">
                                <div className="font-semibold">₹{job.price || "0"}</div>
                                <div className="text-xs">{job.deliveryDuration || ""}</div>
                              </div>
                            </div>
                            <div className="flex-1 p-3">
                              <div className="flex">
                                <div className="flex-1">
                                  <h4 className="font-semibold">{job.title}</h4>
                                  <p className="text-sm text-gray-700 line-clamp-2">{job.description}</p>
                                </div>
                                <div className="pl-2">
                                  <div className="flex flex-col gap-2">
                                    <button onClick={() => setRouteLocal({ name: "jobDetail", params: { job } })} className="px-3 py-1 bg-yellow-200 rounded text-xs">View more</button>
                                    <div className="relative">
                                      <button className="px-2 py-1 bg-white rounded" onClick={() => shareService(job)}>Share</button>
                                    </div>
                                    <button onClick={() => confirmDeleteService(job, job.id, freelancerUid)} className="px-2 py-1 text-red-600">Delete</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )
                    ) : (
                      hours24Services.length === 0 ? (
                        <div className="text-center p-6 text-gray-500">No 24h services yet</div>
                      ) : (
                        hours24Services.map((job) => (
                          <div key={job.id} className="flex bg-yellow-50 rounded-lg overflow-hidden">
                            <div className="w-36 bg-yellow-100 p-3 flex flex-col items-center">
                              <div className="w-full h-20 rounded overflow-hidden mb-2 bg-gray-200">
                                {job.image ? <img src={job.image} alt="job" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">No Img</div>}
                              </div>
                              <div className="text-center">
                                <div className="font-semibold">₹{job.budget || "N/A"}</div>
                                <div className="text-xs">{job.category || ""}</div>
                              </div>
                            </div>
                            <div className="flex-1 p-3">
                              <div className="flex">
                                <div className="flex-1">
                                  <h4 className="font-semibold">{job.title}</h4>
                                  <p className="text-sm text-gray-700 line-clamp-2">{job.description || "No description provided"}</p>
                                </div>
                                <div className="pl-2">
                                  <div className="flex flex-col gap-2">
                                    <button onClick={() => setRouteLocal({ name: "jobDetail", params: { job } })} className="px-3 py-1 bg-yellow-200 rounded text-xs">View more</button>
                                    <button onClick={() => confirmDelete24hJob(job, job.id, freelancerUid)} className="px-2 py-1 text-red-600">Delete</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Connect modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => setShowConnectModal(false)} />
          <div className="relative bg-gradient-to-b from-yellow-50 to-yellow-100 rounded-xl shadow-xl p-6 w-[90vw] max-w-2xl">
            <h3 className="text-lg font-semibold">Collaborate and Turn Ideas into Reality!</h3>
            <div className="mt-3">
              <label className="block text-sm font-medium">Select a Service</label>
              <select
                value={selectedJob?.id || ""}
                onChange={(e) => {
                  const job = jobsList.find((j) => j.id === e.target.value) || null;
                  setSelectedJob(job);
                  setProjectTitle(job?.title || "");
                }}
                className="mt-1 block w-full rounded border p-2 bg-white"
              >
                <option value="">-- Select a Service --</option>
                {jobsList.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title || "Untitled Service"}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium">Project Title</label>
              <input type="text" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} className="mt-1 block w-full p-2 rounded border bg-white" />
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium">Project Description</label>
              <textarea value={projectDesc} onChange={(e) => setProjectDesc(e.target.value)} className="mt-1 block w-full p-2 rounded border bg-white h-28" />
            </div>
            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={() => {
                  if (!projectTitle.trim()) {
                    toast("Title required");
                    return;
                  }
                  submitCollaborationRequest();
                }}
                className="px-4 py-2 rounded bg-white font-semibold"
              >
                Submit
              </button>
              <button onClick={() => setShowConnectModal(false)} className="px-4 py-2 rounded bg-white border">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
