
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

// ===== Firebase (assume initialized) =====
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

// ===== Icons =====
import {
  FiArrowLeft,
  FiShare2,
  FiFlag,
  FiMoreHorizontal,
} from "react-icons/fi";

/* ======================================================
   MAIN COMPONENT
====================================================== */
export default function ClientFullDetailScreen() {
  const { userId, jobId } = useParams();
  const navigate = useNavigate();

  const auth = getAuth();
  const db = getFirestore();
  const currentUid = auth.currentUser?.uid;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRequested, setIsRequested] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [activeTab, setActiveTab] = useState("work");

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    if (!userId) return;

    const unsub = onSnapshot(doc(db, "users", userId), snap => {
      if (snap.exists()) setProfile(snap.data());
      setLoading(false);
    });

    return () => unsub();
  }, [db, userId]);

  /* ================= CHECK REQUEST ================= */
  useEffect(() => {
    if (!currentUid || !userId) return;

    async function checkRequest() {
      const q = query(
        collection(db, "collaboration_requests"),
        where("clientId", "==", currentUid),
        where("freelancerId", "==", userId),
        where("status", "==", "sent"),
        ...(jobId ? [where("jobId", "==", jobId)] : [])
      );

      const snap = await getDocs(q);
      setIsRequested(!snap.empty);
    }

    checkRequest();
  }, [db, currentUid, userId, jobId]);

  /* ================= CHECK ACCEPTED ================= */
  useEffect(() => {
    if (!currentUid || !userId || !jobId) return;

    async function checkAccepted() {
      const q = query(
        collection(db, "accepted_jobs"),
        where("clientId", "==", currentUid),
        where("freelancerId", "==", userId),
        where("jobId", "==", jobId)
      );

      const snap = await getDocs(q);
      setIsAccepted(!snap.empty);
    }

    checkAccepted();
  }, [db, currentUid, userId, jobId]);

  /* ================= ACTIONS ================= */
  const shareProfile = async () => {
    const name = `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`;
    const link = profile?.linkedin || window.location.href;

    if (navigator.share) {
      await navigator.share({
        title: name,
        text: `Check out ${name}'s profile`,
        url: link,
      });
    } else {
      alert("Sharing not supported");
    }
  };

  const sendRequest = async () => {
    if (!currentUid) return alert("Login required");

    await addDoc(collection(db, "collaboration_requests"), {
      clientId: currentUid,
      freelancerId: userId,
      jobId: jobId || null,
      status: "sent",
      timestamp: serverTimestamp(),
    });

    setIsRequested(true);
    alert("Request sent");
  };

  const blockUser = async () => {
    if (!currentUid) return;

    await addDoc(collection(db, "blocked_users"), {
      blockedBy: currentUid,
      blockedUserId: userId,
      blockedAt: serverTimestamp(),
    });

    alert("User blocked");
    navigate(-1);
  };

  /* ================= STATES ================= */
  if (loading) return <div style={styles.center}>Loading…</div>;
  if (!profile) return <div style={styles.center}>Profile not found</div>;

  const fullName =
    `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "User";

  /* ================= UI ================= */
  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.iconBtn}>
          <FiArrowLeft />
        </button>

        <div>
          <button onClick={blockUser} style={styles.iconBtn}>
            Report / Block
          </button>
          <button onClick={shareProfile} style={styles.iconBtn}>
            <FiShare2 />
          </button>
        </div>
      </div>

      {/* PROFILE CARD */}
      <div style={styles.card}>
        <img
          src={profile.profileImage || "/assets/profile.png"}
          alt="profile"
          style={styles.avatar}
        />

        <h3>{fullName}</h3>
        <p style={styles.subtitle}>
          {profile.sector || "No Title"} · {profile.location || "India"}
        </p>

        {isAccepted ? (
          <button style={styles.primary}>Message</button>
        ) : isRequested ? (
          <button style={styles.disabled}>Requested</button>
        ) : (
          <button style={styles.primary} onClick={sendRequest}>
            Connect
          </button>
        )}
      </div>

      {/* ABOUT */}
      <Section title="About">
        <p>{profile.about || "No description available"}</p>
      </Section>

      <Section title="Industry">{profile.sector}</Section>
      <Section title="Category">{profile.category}</Section>
      <Section title="Company Size">{profile.team_size}</Section>
      <Section title="Email">{profile.email}</Section>

      {/* SERVICES */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab("work")}
          style={activeTab === "work" ? styles.tabActive : styles.tab}
        >
          Work
        </button>
        <button
          onClick={() => setActiveTab("24h")}
          style={activeTab === "24h" ? styles.tabActive : styles.tab}
        >
          24 Hour
        </button>
      </div>

      {activeTab === "work" ? (
        <ServicesList uid={userId} collectionName="jobs" />
      ) : (
        <ServicesList uid={userId} collectionName="jobs_24h" />
      )}
    </div>
  );
}

/* ======================================================
   SERVICES LIST
====================================================== */
function ServicesList({ uid, collectionName }) {
  const db = getFirestore();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const q = query(collection(db, collectionName), where("userId", "==", uid));
    const unsub = onSnapshot(q, snap => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [db, uid, collectionName]);

  if (!items.length) {
    return <div style={styles.center}>No services available</div>;
  }

  return (
    <div>
      {items.map(job => (
        <div key={job.id} style={styles.jobCard}>
          <div style={styles.jobHeader}>
            <h4>{job.title}</h4>
            <FiMoreHorizontal />
          </div>

          <p style={styles.price}>
            ₹ {job.budget_from || job.budget || 0}
          </p>

          <p style={styles.desc}>{job.description}</p>

          <div style={styles.chips}>
            {[...(job.skills || []), ...(job.tools || [])]
              .slice(0, 3)
              .map((s, i) => (
                <span key={i} style={styles.chip}>
                  {s}
                </span>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ======================================================
   HELPERS
====================================================== */
function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h4>{title}</h4>
      {children}
    </div>
  );
}

/* ======================================================
   STYLES
====================================================== */
const styles = {
  page: {
    maxWidth: 420,
    margin: "0 auto",
    background: "#f6f6f6",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
  },
  center: {
    padding: 40,
    textAlign: "center",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: 16,
  },
  iconBtn: {
    background: "rgba(0,0,0,0.3)",
    border: "none",
    borderRadius: "50%",
    padding: 8,
    color: "#fff",
    marginLeft: 6,
    cursor: "pointer",
  },
  card: {
    background: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 16,
    textAlign: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 12,
    objectFit: "cover",
  },
  subtitle: {
    color: "#666",
    fontSize: 13,
  },
  primary: {
    background: "#FDFD96",
    border: "none",
    padding: "10px 24px",
    borderRadius: 24,
    fontWeight: 600,
    cursor: "pointer",
  },
  disabled: {
    background: "#ddd",
    border: "none",
    padding: "10px 24px",
    borderRadius: 24,
  },
  section: {
    background: "#fff",
    margin: "12px 16px",
    padding: 16,
    borderRadius: 16,
  },
  tabs: {
    display: "flex",
    justifyContent: "center",
    marginTop: 16,
  },
  tab: {
    padding: "10px 20px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },
  tabActive: {
    padding: "10px 20px",
    borderBottom: "3px solid black",
    fontWeight: 600,
    background: "transparent",
  },
  jobCard: {
    background: "#fff",
    margin: "12px 16px",
    padding: 16,
    borderRadius: 16,
  },
  jobHeader: {
    display: "flex",
    justifyContent: "space-between",
  },
  price: {
    fontWeight: 600,
    marginTop: 6,
  },
  desc: {
    fontSize: 13,
    marginTop: 6,
  },
  chips: {
    display: "flex",
    gap: 6,
    marginTop: 10,
  },
  chip: {
    background: "#FFF7C2",
    padding: "4px 10px",
    borderRadius: 14,
    fontSize: 12,
  },
};
