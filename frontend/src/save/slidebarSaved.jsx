// ServiceScreenOne.jsx
// NOTE: Firebase config file separate la irukkanum macha.
// Example: src/firebase.js la db, auth export pannu.
// Ithu la config paste pannadha.

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
  addDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firbase/Firebase"; // 👉 path unga project ku match pannunga

// Simple Notification Service (placeholder)
const NotificationService = {
  notifications: [],
  addNotification(item) {
    this.notifications.push(item);
  },
  clearAll() {
    this.notifications = [];
  },
};

const styles = {
  page: { backgroundColor: "#FFFFFF", minHeight: "100vh", fontFamily: `'Rubik', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`, display: "flex", flexDirection: "column", },
  body: { display: "flex", flexDirection: "column", height: "100vh", },
  headerWrapper: { paddingTop: "48px", paddingLeft: "5vw", paddingRight: "5vw", },
  headerRow: { display: "flex", alignItems: "center", justifyContent: "space-between", },
  backIconWrapper: { cursor: "pointer", display: "flex", alignItems: "center", },
  headerTitleWrapper: { flex: 1, display: "flex", justifyContent: "center", },
  headerTitle: { fontWeight: 600, fontSize: "20px", },
  tabsRow: { marginTop: "16px", display: "flex", justifyContent: "center", gap: "48px", },
  tabColumn: { display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", },
  tabText: (active) => ({ fontSize: "16px", fontWeight: 500, color: active ? "#000000" : "#757575", }),
  tabIndicator: (active, width) => ({ marginTop: "6px", height: "3px", width, borderRadius: "5px", backgroundColor: active ? "#FFD54F" : "transparent", }),
  searchSortRow: { marginTop: "16px", display: "flex", alignItems: "center", paddingLeft: "5vw", paddingRight: "5vw", gap: "12px", },
  searchContainer: { flex: 1, height: "44px", borderRadius: "14px", border: "1px solid #E0E0E0", paddingLeft: "14px", paddingRight: "14px", display: "flex", alignItems: "center", },
  searchIcon: { fontSize: "18px", color: "#757575", },
  searchInput: { border: "none", outline: "none", flex: 1, marginLeft: "10px", fontSize: "14px", },
  sortButtonWrapper: { display: "flex", alignItems: "center", cursor: "pointer", gap: "4px", position: "relative", },
  sortIcon: { fontSize: "22px", color: "#9C27B0", },
  sortText: { fontSize: "14px", fontWeight: 500, },
  divider: { marginTop: "10px", marginLeft: "5vw", marginRight: "5vw", borderTop: "1px solid #E0E0E0", },
  listContainer: { flex: 1, overflowY: "auto", paddingBottom: "80px", },
  emptyStateWrapper: { marginTop: "40px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingLeft: "32px", paddingRight: "32px", },
  emptyImagePlaceholder: { width: "140px", height: "180px", borderRadius: "16px", backgroundColor: "#FFF9C4", marginBottom: "16px", },
  emptyTitle: { fontWeight: 500, fontSize: "15px", marginBottom: "6px", },
  emptySubtitle: { color: "#5A5A5A", fontSize: "14px", lineHeight: 1.5, },
  emptyButton: { marginTop: "20px", padding: "10px 24px", borderRadius: "25px", backgroundColor: "#FFD54F", border: "none", cursor: "pointer", fontWeight: 500, fontSize: "14px", },
  fab: { position: "fixed", right: "20px", bottom: "20px", width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "#7C3CFF", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontSize: "28px", border: "none", cursor: "pointer", boxShadow: "0 8px 16px rgba(124, 60, 255, 0.4)", zIndex: 20, },
  jobCard: { margin: "10px 16px", padding: "16px", borderRadius: "18px", backgroundColor: "#FFFFFF", border: "1px solid #BDBDBD", boxShadow: "0 6px 15px rgba(0, 0, 0, 0.08)", cursor: "pointer", },
  jobCardRowTop: { display: "flex", alignItems: "flex-start", },
  avatarBox: { display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "14px", backgroundColor: "#00B8D4", color: "#FFFFFF", fontWeight: 700, },
  jobTitle: { fontWeight: 700, marginBottom: "4px", },
  skillsRowWrapper: { marginTop: "4px", height: "32px", overflowX: "auto", display: "flex", alignItems: "center", },
  skillChip: { display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "4px 12px", marginRight: "8px", borderRadius: "20px", border: "1px solid #90CAF9", backgroundColor: "#E3F2FD", fontSize: "11px", fontWeight: 500, whiteSpace: "nowrap", color: "#1976D2", },
  moreChip: { padding: "4px 12px", borderRadius: "20px", backgroundColor: "#EEEEEE", fontSize: "11px", fontWeight: 600, },
  chevronIcon: { fontSize: "24px", marginLeft: "8px", },
  jobInfoRow: { marginTop: "16px", display: "flex", justifyContent: "space-between", },
  label: { fontSize: "12px", color: "#757575", },
  value: { marginTop: "4px", fontSize: "13px", fontWeight: 500, },
  valueHighlight: { color: "#1976D2", },
  buttonRow: { marginTop: "16px", display: "flex", gap: "12px", },
  secondaryBtn: { flex: 1, height: "40px", borderRadius: "30px", border: "1px solid #BDBDBD", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 600, backgroundColor: "#FFFFFF", cursor: "pointer", },
  primaryBtn: { flex: 1, height: "40px", borderRadius: "30px", border: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, backgroundColor: "#FFD54F", cursor: "pointer", },
  sortMenu: { position: "absolute", top: "26px", right: 0, backgroundColor: "#FFFFFF", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.12)", padding: "8px 0", minWidth: "160px", zIndex: 30, },
  sortMenuItem: { padding: "8px 14px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", },
  sortDot: { width: "12px", height: "12px", borderRadius: "50%", border: "2px solid #000000", },
  sortDotFilled: { width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#000000", },
  overlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: "10vh", },
  notificationDialog: { width: "92vw", maxWidth: "480px", maxHeight: "70vh", backgroundColor: "#FFFFFF", borderRadius: "24px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 10px 30px rgba(0,0,0,0.25)", },
  notifHeader: { padding: "14px 16px", background: "linear-gradient(135deg, #FDFD96, #FDFD96)", display: "flex", alignItems: "center", gap: "10px", },
  notifHeaderIconBox: { padding: "8px", borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.3)", },
  notifHeaderTitle: { fontSize: "16px", fontWeight: 700, },
  notifHeaderSubtitle: { fontSize: "13px", color: "#555555", },
  notifHeaderRightRow: { marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px", },
  clearAllBtn: { borderRadius: "12px", border: "none", padding: "6px 10px", backgroundColor: "rgba(255,255,255,0.3)", fontSize: "12px", fontWeight: 600, cursor: "pointer", },
  closeBtn: { borderRadius: "12px", border: "none", padding: "6px", backgroundColor: "rgba(255,255,255,0.3)", cursor: "pointer", },
  notifListContainer: { flex: 1, overflowY: "auto", padding: "10px 0", },
  notifEmptyWrapper: { height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px", textAlign: "center", },
  notifListItem: { margin: "6px 16px", borderRadius: "16px", backgroundColor: "#FAFAFA", border: "1px solid #E0E0E0", padding: "12px", display: "flex", gap: "10px", },
  notifIconBox: { padding: "8px", borderRadius: "12px", backgroundColor: "#FDFD96", display: "flex", alignItems: "center", justifyContent: "center", },
  notifTitle: { fontSize: "14px", fontWeight: 600, marginBottom: "4px", },
  notifBody: { fontSize: "13px", color: "#616161", },
  notifTimeRow: { marginTop: "8px", fontSize: "12px", color: "#9E9E9E", },
};

function formatBudget(value) {
  if (value == null) return "0";
  const num = Number(value) || 0;
  if (num >= 100000) {
    return (num / 100000).toFixed(1) + "L";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return String(num);
}

function getInitialsFromTitle(title) {
  if (!title) return "";
  const words = title.trim().split(" ");
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  return words[0][0].toUpperCase();
}

export default function ServiceScreenOne() {
  const navigate = useNavigate();
  const auth = getAuth();

  const [selectedTab, setSelectedTab] = useState("Works"); // "Works" | "24 hour"
  const [searchText, setSearchText] = useState("");
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);

  const [jobs24, setJobs24] = useState([]);
  const [jobs24Loading, setJobs24Loading] = useState(true);

  const [user, setUser] = useState(null);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [notifOpen, setNotifOpen] = useState(false);
  const sortRef = useRef(null);

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsub();
  }, [auth]);

  // Services stream
  useEffect(() => {
    if (!user || !db) return;

    setServicesLoading(true);
    const q = query(collection(db, "services"), where("userId", "==", user.uid));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const arr = [];
        snap.forEach((docSnap) => {
          arr.push({ id: docSnap.id, ...docSnap.data() });
        });

        arr.sort((a, b) => {
          const ta = a.createdAt?.seconds || 0;
          const tb = b.createdAt?.seconds || 0;
          return tb - ta;
        });

        setServices(arr);
        setServicesLoading(false);
      },
      (err) => {
        console.error("services snapshot error", err);
        setServicesLoading(false);
      }
    );
    return () => unsub();
  }, [user]);

  // 24H jobs stream (user subcollection)
  useEffect(() => {
    if (!user || !db) return;

    setJobs24Loading(true);
    const colRef = collection(db, "users", user.uid, "service_24h");
    const unsub = onSnapshot(
      colRef,
      (snap) => {
        const arr = [];
        snap.forEach((docSnap) => {
          arr.push({ id: docSnap.id, ...docSnap.data() });
        });
        setJobs24(arr);
        setJobs24Loading(false);
      },
      (err) => {
        console.error("24h services snapshot error", err);
        setJobs24Loading(false);
      }
    );
    return () => unsub();
  }, [user]);

  // Toggle pause/unpause helper
  // source: "services" | "service_24h"
  async function togglePauseService(job, source = "services", e) {
    if (e) e.stopPropagation();
    if (!user) {
      alert("You must be logged in to pause services.");
      return;
    }

    const isPaused = !!job.paused;
    const newPaused = !isPaused;

    // optimistic update local state
    if (source === "services") {
      setServices(prev => prev.map(s => s.id === job.id ? { ...s, paused: newPaused } : s));
    } else if (source === "service_24h") {
      setJobs24(prev => prev.map(s => s.id === job.id ? { ...s, paused: newPaused } : s));
    }

    try {
      if (source === "services") {
        const ref = doc(db, "services", job.id);
        await updateDoc(ref, {
          paused: newPaused,
          pausedAt: newPaused ? serverTimestamp() : null,
        });
        console.log(`Service ${job.id} paused=${newPaused}`);
      } else {
        // doc under users/{uid}/service_24h/{job.id}
        const ref = doc(db, "users", user.uid, "service_24h", job.id);
        await updateDoc(ref, {
          paused: newPaused,
          pausedAt: newPaused ? serverTimestamp() : null,
        });
        console.log(`24h service ${job.id} paused=${newPaused}`);
      }
    } catch (err) {
      console.error("Failed to toggle pause:", err);
      alert("Failed to update service status. Check console.");
      // rollback optimistic update on error
      if (source === "services") {
        setServices(prev => prev.map(s => s.id === job.id ? { ...s, paused: isPaused } : s));
      } else {
        setJobs24(prev => prev.map(s => s.id === job.id ? { ...s, paused: isPaused } : s));
      }
    }
  }

  // Search filtered lists
  const filteredServices = useMemo(() => {
    if (!searchText.trim()) return services;
    const lower = searchText.toLowerCase();
    return services.filter((s) => (s.title || "").toLowerCase().includes(lower));
  }, [services, searchText]);

  const filteredJobs24 = useMemo(() => {
    if (!searchText.trim()) return jobs24;
    const lower = searchText.toLowerCase();
    return jobs24.filter((s) => (s.title || "").toLowerCase().includes(lower));
  }, [jobs24, searchText]);

  // share & sort helpers (kept as-is)
  const shareJob = async (job) => {
    try {
      if (!user || !db) return;
      const chatId = "someChatId";
      await addDoc(collection(db, "chats", chatId, "messages"), {
        senderId: user.uid,
        type: "job",
        jobId: job.id,
        title: job.title || "",
        description: job.description || "",
        timestamp: serverTimestamp(),
      });
    } catch (e) {
      console.error("shareJob error:", e);
      alert("Failed to share job.");
    }
  };

  const handleSortClick = () => setSortMenuOpen((s) => !s);
  const handleSortSelect = (value) => { setSortOption(value); setSortMenuOpen(false); if (value === "newest") alert("Sorted by Newest"); else if (value === "paused") alert("Paused Services Selected"); };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortMenuOpen(false);
    };
    if (sortMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sortMenuOpen]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/firelogin");
    } catch (e) {
      console.error("logout error:", e);
    }
  };

  const [profileData, setProfileData] = useState(null);
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !db) return;
      try {
        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) setProfileData({ id: snap.id, ...snap.data() });
      } catch (e) { console.error("profile fetch error:", e); }
    };
    fetchProfile();
  }, [user]);

  const [profilePopupOpen, setProfilePopupOpen] = useState(false);
  const openProfilePopup = () => { if (!profileData) return; setProfilePopupOpen(true); };
  const closeProfilePopup = () => setProfilePopupOpen(false);

  const openNotifications = () => setNotifOpen(true);
  const closeNotifications = () => setNotifOpen(false);
  const handleClearNotifications = () => { NotificationService.clearAll(); setNotifOpen((p) => !p); setNotifOpen((p) => !p); };

  if (!user) {
    return (
      <div style={styles.page}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontSize: "14px", color: "#757575" }}>Loading...</p>
        </div>
      </div>
    );
  }

  const renderEmptyState = (title, subtitle, buttonText, onClick) => (
    <div style={styles.emptyStateWrapper}>
      <div style={styles.emptyImagePlaceholder} />
      <div style={styles.emptyTitle}>{title}</div>
      <div style={styles.emptySubtitle}>{subtitle}</div>
      <button style={styles.emptyButton} onClick={onClick}>{buttonText}</button>
    </div>
  );

  const renderWorkJobCard = (job) => {
    const initials = getInitialsFromTitle(job.title);
    const skills = Array.isArray(job.skills) ? job.skills : [];
    const visibleSkills = skills.slice(0, 2);
    const remainingSkills = skills.length > 2 ? skills.length - 2 : 0;
    const budgetFrom = job.budget_from ?? 0;
    const budgetTo = job.budget_to ?? 0;
    const paused = !!job.paused;

    return (
      <div key={job.id} style={styles.jobCard} onClick={() => navigate(`/freelance-dashboard/job-full/${job.id}`, { state: { job } })}>
        <div style={styles.jobCardRowTop}>
          <div style={{ ...styles.avatarBox, width: "56px", height: "56px", fontSize: "20px" }}>{initials || "JO"}</div>
          <div style={{ flex: 1, marginLeft: "12px" }}>
            <div style={{ ...styles.jobTitle, fontSize: "16px" }}>{job.title || "Unknown"}</div>
            <div style={styles.skillsRowWrapper}>
              {visibleSkills.map((s, idx) => (<div key={idx} style={styles.skillChip}>{String(s)}</div>))}
              {remainingSkills > 0 && (<div style={styles.moreChip}>{`+${remainingSkills}`}</div>)}
            </div>
          </div>
          <div style={styles.chevronIcon}>›</div>
        </div>

        <div style={styles.jobInfoRow}>
          <div>
            <div style={styles.label}>Budget</div>
            <div style={{ ...styles.value, ...styles.valueHighlight }}>₹{formatBudget(budgetFrom)} - ₹{formatBudget(budgetTo)}</div>
          </div>
          <div>
            <div style={styles.label}>Timeline</div>
            <div style={styles.value}>{job.deliveryDuration || "N/A"}</div>
          </div>
          <div>
            <div style={styles.label}>Location</div>
            <div style={styles.value}>{job.location || "Remote"}</div>
          </div>
        </div>

        <div style={styles.buttonRow}>
          <button
            type="button"
            style={styles.secondaryBtn}
            onClick={(e) => togglePauseService(job, "services", e)}
          >
            {paused ? "Unpause" : "Pause Service"}
          </button>

          <button
            type="button"
            style={styles.primaryBtn}
            onClick={(e) => {
              e.stopPropagation();
              navigate("/freelance-dashboard/add-service-form", { state: { jobData: job, jobId: job.id } });
            }}
          >
            Edit Service
          </button>
        </div>
      </div>
    );
  };

  const render24hJobCard = (job) => {
    const initials = getInitialsFromTitle(job.title);
    const skills = Array.isArray(job.skills) ? job.skills : [];
    const visibleSkills = skills.slice(0, 2);
    const remainingSkills = skills.length > 2 ? skills.length - 2 : 0;
    const budgetFrom = job.budget_from ?? 0;
    const budgetTo = job.budget_to ?? 0;
    const paused = !!job.paused;

    return (
      <div key={job.id} style={styles.jobCard} onClick={() => navigate("/fh-job-detail", { state: { job } })}>
        <div style={styles.jobCardRowTop}>
          <div style={{ ...styles.avatarBox, width: "60px", height: "60px", fontSize: "22px" }}>{initials || "24"}</div>
          <div style={{ flex: 1, marginLeft: "12px" }}>
            <div style={{ ...styles.jobTitle, fontSize: "17px" }}>{job.title || "Unknown"}</div>
            <div style={styles.skillsRowWrapper}>
              {visibleSkills.map((s, idx) => (<div key={idx} style={styles.skillChip}>{String(s)}</div>))}
              {remainingSkills > 0 && (<div style={styles.moreChip}>{`+${remainingSkills}`}</div>)}
            </div>
          </div>
          <div style={styles.chevronIcon}>›</div>
        </div>

        <div style={styles.jobInfoRow}>
          <div>
            <div style={styles.label}>Budget</div>
            <div style={{ ...styles.value, ...styles.valueHighlight }}>₹{formatBudget(budgetFrom)} - ₹{formatBudget(budgetTo)}</div>
          </div>
          <div>
            <div style={styles.label}>Timeline</div>
            <div style={styles.value}>{job.timeline || "N/A"}</div>
          </div>
          <div>
            <div style={styles.label}>Location</div>
            <div style={styles.value}>{job.location || "Remote"}</div>
          </div>
        </div>

        <div style={styles.buttonRow}>
          <button
            type="button"
            style={styles.secondaryBtn}
            onClick={(e) => togglePauseService(job, "service_24h", e)}
          >
            {paused ? "Unpause" : "Pause Service"}
          </button>

          <button
            type="button"
            style={styles.primaryBtn}
            onClick={(e) => {
              e.stopPropagation();
              navigate("/freelance-dashboard/add-service-form", { state: { jobData: job, jobId: job.id } });
            }}
          >
            Edit Service
          </button>
        </div>
      </div>
    );
  };

  const notifCount = NotificationService.notifications.length;

  return (
    <div style={styles.page}>
      <div style={styles.body}>
        <div style={styles.headerWrapper}>
          <div style={styles.headerRow}>
            <div style={styles.backIconWrapper} onClick={() => navigate(-1)}><span style={{ fontSize: "18px" }}>‹</span></div>
            <div style={styles.headerTitleWrapper}><div style={styles.headerTitle}>Your Service</div></div>
            <div style={{ width: "24px" }} />
          </div>
        </div>

        <div style={styles.tabsRow}>
          <div style={styles.tabColumn} onClick={() => setSelectedTab("Works")}>
            <div style={styles.tabText(selectedTab === "Works")}>Work</div>
            <div style={styles.tabIndicator(selectedTab === "Works", "15vw")} />
          </div>
          <div style={styles.tabColumn} onClick={() => setSelectedTab("24 hour")}>
            <div style={styles.tabText(selectedTab === "24 hour")}>24 Hours</div>
            <div style={styles.tabIndicator(selectedTab === "24 hour", "20vw")} />
          </div>
        </div>

        <div style={styles.searchSortRow}>
          <div style={styles.searchContainer}>
            <span style={styles.searchIcon}>🔍</span>
            <input style={styles.searchInput} type="text" placeholder="Search" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
          </div>

          <div style={styles.sortButtonWrapper} ref={sortRef}>
            <div onClick={handleSortClick} style={{ display: "flex", alignItems: "center" }}>
              <span style={styles.sortIcon}>⇅</span>
              <span style={styles.sortText}>Sort</span>
            </div>
            {sortMenuOpen && (
              <div style={styles.sortMenu}>
                <div style={styles.sortMenuItem} onClick={() => handleSortSelect("newest")}>
                  <div style={sortOption === "newest" ? styles.sortDotFilled : styles.sortDot} />
                  <span>Newest</span>
                </div>
                <div style={styles.sortMenuItem} onClick={() => handleSortSelect("paused")}>
                  <div style={sortOption === "paused" ? styles.sortDotFilled : styles.sortDot} />
                  <span>Paused</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={styles.divider} />

        <div style={styles.listContainer}>
          {selectedTab === "Works" ? (
            servicesLoading ? (
              <div style={styles.emptyStateWrapper}><div style={styles.emptyTitle}>Loading your services...</div></div>
            ) : filteredServices.length === 0 ? (
              renderEmptyState("Start your first service today!", "Showcase your skills with a service offering that attracts the right clients. Start now and turn your expertise into opportunities!", "Add Service", () => navigate("/freelance-dashboard/add-service-form"))
            ) : (
              <>
                <div style={{ height: "2px" }} />
                {filteredServices.map((job) => renderWorkJobCard(job))}
              </>
            )
          ) : jobs24Loading ? (
            <div style={styles.emptyStateWrapper}><div style={styles.emptyTitle}>Loading your 24h jobs...</div></div>
          ) : filteredJobs24.length === 0 ? (
            renderEmptyState("All set – just add your first 24h job!", "Post a 24h job with clear details so freelancers can respond quickly.", "Post a Job", () => navigate("/freelancer-add-24h"))
          ) : (
            <>
              <div style={{ height: "2px" }} />
              {filteredJobs24.map((job) => render24hJobCard(job))}
            </>
          )}
        </div>

        <button type="button" style={styles.fab} onClick={() => navigate("/freelance-dashboard/add-service-form")}>+</button>

        <button type="button" style={{ position: "fixed", right: "20px", top: "20px", border: "none", background: "transparent", cursor: "pointer" }} onClick={openNotifications}>
          <span style={{ fontSize: "24px" }}>🔔</span>
          {notifCount > 0 && (
            <span style={{ position: "absolute", top: "-4px", right: "-4px", minWidth: "18px", height: "18px", borderRadius: "9px", backgroundColor: "#F44336", color: "#FFFFFF", fontSize: "10px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {notifCount > 9 ? "9+" : notifCount}
            </span>
          )}
        </button>
      </div>

      {notifOpen && (
        <div style={styles.overlay}>
          <div style={styles.notificationDialog}>
            <div style={styles.notifHeader}>
              <div style={styles.notifHeaderIconBox}><span role="img" aria-label="bell">🔔</span></div>
              <div>
                <div style={styles.notifHeaderTitle}>Notifications</div>
                <div style={styles.notifHeaderSubtitle}>{notifCount} {notifCount === 1 ? "notification" : "notifications"}</div>
              </div>
              <div style={styles.notifHeaderRightRow}>
                {notifCount > 0 && <button type="button" style={styles.clearAllBtn} onClick={handleClearNotifications}>Clear All</button>}
                <button type="button" style={styles.closeBtn} onClick={closeNotifications}>✕</button>
              </div>
            </div>

            <div style={styles.notifListContainer}>
              {notifCount === 0 ? (
                <div style={styles.notifEmptyWrapper}>
                  <div style={{ padding: "16px", borderRadius: "50px", backgroundColor: "#F5F5F5", marginBottom: "16px" }}><span style={{ fontSize: "40px", color: "#BDBDBD" }}>🔕</span></div>
                  <div style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>No notifications yet</div>
                  <div style={{ fontSize: "13px", color: "#757575", lineHeight: 1.4 }}>You're all caught up! New notifications will appear here when available.</div>
                </div>
              ) : (
                NotificationService.notifications.map((item, index) => (
                  <div key={index} style={styles.notifListItem}>
                    <div style={styles.notifIconBox}>🔔</div>
                    <div style={{ flex: 1 }}>
                      {item.title && (<div style={styles.notifTitle}>{item.title}</div>)}
                      {item.body && (<div style={styles.notifBody}>{item.body}</div>)}
                      <div style={styles.notifTimeRow}>Just now</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {profilePopupOpen && profileData && (
        <div style={styles.overlay} onClick={closeProfilePopup}>
          <div style={{ backgroundColor: "transparent", borderRadius: "16px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "16px", backgroundColor: "#FFFFFF", borderRadius: "16px", border: "14px solid #FDFD96", minWidth: "280px", maxWidth: "360px" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                <div style={{ width: "52px", height: "52px", borderRadius: "50%", overflow: "hidden", backgroundColor: "#BDBDBD", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "10px" }}>
                  {profileData.profileImage ? (<img src={profileData.profileImage} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />) : (<span style={{ fontSize: "24px", color: "#FFFFFF" }}>👤</span>)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "2px" }}>{`${profileData.firstName || ""} ${profileData.lastName || ""}`.trim() || "User"}</div>
                  <div style={{ fontSize: "13px", color: "#757575" }}>{profileData.location || "Unknown"}</div>
                </div>
                <button type="button" style={{ border: "none", background: "transparent", fontSize: "20px", cursor: "pointer", color: "#9A9A9A" }}>⤴</button>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #EEEEEE", margin: "8px 0" }} />

              <ProfileMenuItem icon="⚙" title="Setting" onClick={() => { navigate("/account-details"); closeProfilePopup(); }} />
              <ProfileMenuItem icon="👥" title="Community" onClick={() => { navigate("/community"); closeProfilePopup(); }} />
              <ProfileMenuItem icon="📁" title="Completed Project" onClick={() => { navigate("/my-works"); closeProfilePopup(); }} />
              <ProfileMenuItem icon="❓" title="Help Center" onClick={() => { navigate("/help-center"); closeProfilePopup(); }} />
              <ProfileMenuItem icon="📊" title="My performance" onClick={() => { navigate("/my-performance"); closeProfilePopup(); }} />
              <ProfileMenuItem icon="🚪" title="Log out" onClick={() => { closeProfilePopup(); handleLogout(); }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileMenuItem({ icon, title, onClick }) {
  return (
    <div onClick={onClick} style={{ padding: "8px 0", cursor: "pointer" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "18px", width: "24px", textAlign: "center" }}>{icon}</span>
        <span style={{ fontSize: "14px", fontWeight: 700, color: "#4A4A4A" }}>{title}</span>
      </div>
    </div>
  );
}
