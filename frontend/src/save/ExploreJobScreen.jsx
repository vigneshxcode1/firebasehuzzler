// ExploreJobScreen.jsx
// Pure React JSX (no CSS framework), single file, no firebase config inside

import React, { useEffect, useState, useMemo } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firbase/Firebase"; // ✅ your existing firebase config file (no config code here)

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const formatAmount = (amount) => {
  if (amount == null || isNaN(amount)) return "0";
  const num = Number(amount);
  if (num < 1000) return num.toFixed(0);
  if (num < 1_000_000) {
    const value = num / 1000;
    return (Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1)) + "K";
  }
  const value = num / 1_000_000;
  return (Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1)) + "M";
};

const timeAgo = (date) => {
  if (!date) return "";
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

const parseCreatedAt = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (value && typeof value.toDate === "function") return value.toDate(); // Firestore Timestamp
  if (typeof value === "number") return new Date(value);
  return null;
};

// Simple inline styles (no external CSS file)
const styles = {
  root: {
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
    fontFamily: '"Rubik", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: "#111827",
  },
  headerWrapper: {
    position: "relative",
  },
  headerContainer: {
    width: "100%",
    backgroundColor: "#FDFD96",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: "56px 16px 16px",
    boxSizing: "border-box",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 500,
  },
  tabsBarWrapper: {
    backgroundColor: "#FDFD96",
    padding: "0 16px 10px",
  },
  tabsRow: {
    display: "flex",
    gap: 24,
  },
  tabLabel: (selected) => ({
    fontSize: 16,
    fontWeight: 600,
    color: "#000",
    cursor: "pointer",
  }),
  tabUnderline: (selected) => ({
    marginTop: 4,
    height: 2,
    width: "40px",
    borderRadius: 999,
    backgroundColor: selected ? "#facc15" : "transparent",
  }),
  listContainer: {
    padding: 16,
  },
  jobCard: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#ffffff",
    border: "1px solid #d1d5db",
    boxShadow: "0 3px 6px rgba(0,0,0,0.08)",
    padding: 16,
    boxSizing: "border-box",
    marginBottom: 12,
    cursor: "pointer",
  },
  jobHeaderRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 6,
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
  },
  iconSmall: {
    fontSize: 14,
    marginRight: 4,
  },
  badgeColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 8,
  },
  budgetBox: {
    position: "relative",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },
  budgetTop: {
    padding: "4px 12px",
    fontSize: 12,
    fontWeight: 700,
  },
  badgeBottom: (color) => ({
    marginTop: 4,
    padding: "5px 16px",
    fontSize: 12,
    fontWeight: 700,
    textAlign: "center",
    borderRadius: "0 0 6px 6px",
    backgroundColor: color,
    color: "#000",
  }),
  bookmarkIcon: (active) => ({
    fontSize: 26,
    color: active ? "rgb(129,140,248)" : "#9ca3af",
    cursor: "pointer",
  }),
  description: {
    marginTop: 8,
    fontSize: 12,
    color: "#4b5563",
    lineHeight: 1.5,
  },
  tagsRow: {
    marginTop: 10,
    display: "flex",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  tagChip: {
    padding: "4px 8px",
    borderRadius: 12,
    backgroundColor: "#d1d5db",
    fontSize: 12,
    fontWeight: 500,
  },
  tagMoreChip: {
    padding: "4px 8px",
    borderRadius: 12,
    backgroundColor: "#9ca3af",
    fontSize: 12,
    fontWeight: 600,
    color: "#111827",
  },
  centerMessage: {
    padding: 32,
    textAlign: "center",
    fontSize: 14,
    color: "#6b7280",
  },
  notificationIconWrapper: {
    position: "relative",
    cursor: "pointer",
  },
  notificationDot: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#ef4444",
    color: "#ffffff",
    borderRadius: 999,
    fontSize: 11,
    padding: "2px 5px",
    minWidth: 16,
    textAlign: "center",
  },
  notificationDialogBackdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 40,
  },
  notificationDialog: {
    width: "92%",
    maxWidth: 480,
    maxHeight: "80vh",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  notificationHeader: {
    padding: "14px 18px",
    background: "linear-gradient(to bottom right, #FDFD96, #FDFD96)",
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  notificationHeaderTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#111827",
  },
  notificationHeaderSub: {
    fontSize: 13,
    fontWeight: 500,
    color: "#6b7280",
  },
  notificationHeaderActions: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  notificationList: {
    flex: 1,
    overflowY: "auto",
    padding: "10px 0 14px",
  },
  notificationCard: {
    margin: "5px 16px",
    borderRadius: 16,
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    padding: 14,
    display: "flex",
    gap: 10,
  },
  notificationIconBox: {
    borderRadius: 12,
    padding: 8,
    backgroundColor: "#FDFD96",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationBodyTitle: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 2,
  },
  notificationBodyText: {
    fontSize: 13,
    color: "#6b7280",
  },
  notificationFooterRow: {
    marginTop: 8,
    display: "flex",
    alignItems: "center",
    fontSize: 12,
    color: "#9ca3af",
  },
};

// -----------------------------------------------------------------------------
// Main component
// -----------------------------------------------------------------------------

const ExploreJobScreen = ({ initialTab = "Works" }) => {
  const [selectedTab, setSelectedTab] = useState(initialTab); // "Works" | "24 hour" | "Saved"
  const [currentUser, setCurrentUser] = useState(() => auth.currentUser);
  const [worksJobs, setWorksJobs] = useState([]);    // from "jobs"
  const [jobs24h, setJobs24h] = useState([]);        // from "jobs_24h"
  const [savedJobIds, setSavedJobIds] = useState([]); // ["jobId1", "jobId2", ...]
  const [notifications, setNotifications] = useState([]); // [{title, body}]
  const [showNotifications, setShowNotifications] = useState(false);

  // ---- Auth listener ----
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  // ---- Realtime jobs (works) ----
  useEffect(() => {
    const colRef = collection(db, "jobs");
    const unsub = onSnapshot(colRef, (snap) => {
      const list = snap.docs.map((docSnap) => {
        const data = docSnap.data() || {};
        return {
          id: docSnap.id,
          title: data.title || "",
          description: data.description || "",
          budget_from: data.budget_from ?? "",
          budget_to: data.budget_to ?? "",
          timeline: data.timeline || "",
          skills: Array.isArray(data.skills) ? data.skills : [],
          tools: Array.isArray(data.tools) ? data.tools : [],
          views: typeof data.views === "number" ? data.views : 0,
          applicants_count:
            typeof data.applicants_count === "number"
              ? data.applicants_count
              : 0,
          created_at: parseCreatedAt(data.created_at) || new Date(),
          raw: data,
        };
      });
      // sort latest first
      list.sort(
        (a, b) => b.created_at.getTime() - a.created_at.getTime()
      );
      setWorksJobs(list);
    });

    return () => unsub();
  }, []);

  // ---- Realtime jobs_24h ----
  useEffect(() => {
    const colRef = collection(db, "jobs_24h");
    const unsub = onSnapshot(colRef, (snap) => {
      const list = snap.docs.map((docSnap) => {
        const data = docSnap.data() || {};
        return {
          id: docSnap.id,
          title: data.title || "",
          description: data.description || "",
          skills: Array.isArray(data.skills) ? data.skills : [],
          tools: Array.isArray(data.tools) ? data.tools : [],
          budget: data.budget ?? "0",
          views: typeof data.views === "number" ? data.views : 0,
          created_at: parseCreatedAt(data.created_at) || new Date(),
          raw: data,
        };
      });
      list.sort(
        (a, b) => b.created_at.getTime() - a.created_at.getTime()
      );
      setJobs24h(list);
    });

    return () => unsub();
  }, []);

  // ---- Realtime saved jobs for current user ----
  useEffect(() => {
    if (!currentUser) {
      setSavedJobIds([]);
      return;
    }

    const userRef = doc(db, "users", currentUser.uid);
    const unsub = onSnapshot(userRef, (snap) => {
      const data = snap.data() || {};
      const favorites = Array.isArray(data.favoriteJobs)
        ? data.favoriteJobs
        : [];
      setSavedJobIds(favorites);
    });

    return () => unsub();
  }, [currentUser]);

  // ---------------------------------------------------------------------------
  // Notifications (local only – you can replace with your own logic)
  // ---------------------------------------------------------------------------

  // You can hydrate notifications from Firestore here if you want
  // useEffect(() => {
  //   const colRef = collection(db, "notifications");
  //   const unsub = onSnapshot(colRef, (snap) => {
  //     const list = snap.docs.map((d) => d.data());
  //     setNotifications(list);
  //   });
  //   return () => unsub();
  // }, []);

  const unreadCount = notifications.length;

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleRemoveNotification = (index) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------------------------------------------------------------------------
  // Job click handlers (increase views once per user + navigate)
  // ---------------------------------------------------------------------------

  const incrementViewsOnce = async (collectionName, jobId) => {
    if (!currentUser) return;
    try {
      const jobRef = doc(db, collectionName, jobId);
      const snap = await getDoc(jobRef);
      if (!snap.exists()) return;
      const data = snap.data() || {};
      const viewedBy = Array.isArray(data.viewedBy) ? data.viewedBy : [];
      if (!viewedBy.includes(currentUser.uid)) {
        await updateDoc(jobRef, {
          viewedBy: arrayUnion(currentUser.uid),
          views: increment(1),
        });
      }
    } catch (err) {
      console.error("Error updating views:", err);
    }
  };

  const handleOpenWorksJob = async (jobId) => {
    await incrementViewsOnce("jobs", jobId);
    // TODO: integrate with your router
    console.log("Open client job full detail for job:", jobId);
    // e.g. navigate("/client/job/" + jobId);
  };

  const handleOpen24hJob = async (jobId) => {
    await incrementViewsOnce("jobs_24h", jobId);
    console.log("Open 24h job full detail for job:", jobId);
    // e.g. navigate("/client/job24/" + jobId);
  };

  // ---------------------------------------------------------------------------
  // Bookmark toggle
  // ---------------------------------------------------------------------------

  const toggleBookmark = async (jobId) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const currentlySaved = savedJobIds.includes(jobId);
      await updateDoc(userRef, {
        favoriteJobs: currentlySaved
          ? arrayRemove(jobId)
          : arrayUnion(jobId),
      });
    } catch (err) {
      console.error("Error updating favoriteJobs:", err);
    }
  };

  // ---------------------------------------------------------------------------
  // Saved jobs list (from works + 24h)
  // ---------------------------------------------------------------------------

  const savedWorks = useMemo(
    () => worksJobs.filter((job) => savedJobIds.includes(job.id)),
    [worksJobs, savedJobIds]
  );
  const saved24 = useMemo(
    () => jobs24h.filter((job) => savedJobIds.includes(job.id)),
    [jobs24h, savedJobIds]
  );

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------

  const renderTab = (label) => {
    const isSelected = selectedTab === label;
    return (
      <div
        key={label}
        onClick={() => setSelectedTab(label)}
        style={{ cursor: "pointer" }}
      >
        <div style={styles.tabLabel(isSelected)}>{label}</div>
        <div style={styles.tabUnderline(isSelected)} />
      </div>
    );
  };

  const renderWorksCard = (job) => {
    const budgetFrom = Number(job.budget_from || 0);
    const budgetTo = Number(job.budget_to || 0);
    const chips = [...(job.skills || []), ...(job.tools || [])];
    const chipsToShow = chips.slice(0, 2);
    const remaining = chips.length - chipsToShow.length;
    const isSaved = savedJobIds.includes(job.id);

    return (
      <div
        key={job.id}
        style={styles.jobCard}
        onClick={() => handleOpenWorksJob(job.id)}
      >
        <div style={styles.jobHeaderRow}>
          <div style={{ flex: 1 }}>
            <div style={styles.jobTitle}>{job.title || "Untitled"}</div>
            <div style={styles.metaRow}>
              <span style={{ display: "flex", alignItems: "center" }}>
                <span style={styles.iconSmall}>👁</span>
                {job.views || 0} views
              </span>
              <span>•</span>
              <span>{timeAgo(job.created_at)}</span>
            </div>
          </div>

          <div style={styles.badgeColumn}>
            <div style={styles.budgetBox}>
              <div style={styles.budgetTop}>
                ₹{formatAmount(budgetFrom)} - ₹{formatAmount(budgetTo)}
              </div>
              <div style={styles.badgeBottom("#FDFD96")}>
                {job.timeline || ""}
              </div>
            </div>
          </div>

          <div
            style={styles.bookmarkIcon(isSaved)}
            onClick={(e) => {
              e.stopPropagation(); // don't trigger card click
              toggleBookmark(job.id);
            }}
          >
            {isSaved ? "🔖" : "📑"}
          </div>
        </div>

        <div style={styles.description}>
          {job.description || "No description provided."}
        </div>

        <div style={styles.tagsRow}>
          {chipsToShow.map((c) => (
            <span key={c} style={styles.tagChip}>
              {c}
            </span>
          ))}
          {remaining > 0 && (
            <span style={styles.tagMoreChip}>+{remaining}</span>
          )}
        </div>
      </div>
    );
  };

  const render24hCard = (job) => {
    const budget = Number(job.budget || 0);
    const chips = [...(job.skills || []), ...(job.tools || [])];
    const chipsToShow = chips.slice(0, 2);
    const remaining = chips.length - chipsToShow.length;
    const isSaved = savedJobIds.includes(job.id);

    return (
      <div
        key={job.id}
        style={styles.jobCard}
        onClick={() => handleOpen24hJob(job.id)}
      >
        <div style={styles.jobHeaderRow}>
          <div style={{ flex: 1 }}>
            <div style={styles.jobTitle}>{job.title || "Untitled"}</div>
            <div style={styles.metaRow}>
              <span style={{ display: "flex", alignItems: "center" }}>
                <span style={styles.iconSmall}>👁</span>
                {job.views || 0} views
              </span>
              <span>•</span>
              <span>{timeAgo(job.created_at)}</span>
            </div>
          </div>

          <div style={styles.badgeColumn}>
            <div style={styles.budgetBox}>
              <div style={styles.budgetTop}>₹{formatAmount(budget)}</div>
              <div style={styles.badgeBottom("#fb923c")}>24 Hours</div>
            </div>
          </div>

          <div
            style={styles.bookmarkIcon(isSaved)}
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(job.id);
            }}
          >
            {isSaved ? "🔖" : "📑"}
          </div>
        </div>

        <div style={styles.description}>
          {job.description || "No description provided."}
        </div>

        <div style={styles.tagsRow}>
          {chipsToShow.map((c) => (
            <span key={c} style={styles.tagChip}>
              {c}
            </span>
          ))}
          {remaining > 0 && (
            <span style={styles.tagMoreChip}>+{remaining}</span>
          )}
        </div>
      </div>
    );
  };

  const renderWorksList = () => {
    if (!worksJobs.length) {
      return (
        <div style={styles.centerMessage}>No jobs available</div>
      );
    }
    return (
      <div style={styles.listContainer}>
        {worksJobs.map((job) => renderWorksCard(job))}
      </div>
    );
  };

  const render24hList = () => {
    if (!jobs24h.length) {
      return (
        <div style={styles.centerMessage}>No 24 hour jobs found</div>
      );
    }
    return (
      <div style={styles.listContainer}>
        {jobs24h.map((job) => render24hCard(job))}
      </div>
    );
  };

  const renderSavedList = () => {
    if (!currentUser) {
      return (
        <div style={styles.centerMessage}>
          You must be logged in to view saved jobs.
        </div>
      );
    }

    const combined = [
      ...savedWorks.map((j) => ({ type: "works", job: j })),
      ...saved24.map((j) => ({ type: "24h", job: j })),
    ];

    if (!combined.length) {
      return (
        <div style={styles.centerMessage}>No saved jobs yet</div>
      );
    }

    return (
      <div style={styles.listContainer}>
        {combined.map((item) =>
          item.type === "works"
            ? renderWorksCard(item.job)
            : render24hCard(item.job)
        )}
      </div>
    );
  };

  // ---------------------------------------------------------------------------
  // Render notifications dialog
  // ---------------------------------------------------------------------------

  const NotificationDialog = () => {
    if (!showNotifications) return null;

    const count = notifications.length;

    return (
      <div
        style={styles.notificationDialogBackdrop}
        onClick={() => setShowNotifications(false)}
      >
        <div
          style={styles.notificationDialog}
          onClick={(e) => e.stopPropagation()}
        >
          {/* header */}
          <div style={styles.notificationHeader}>
            <div style={styles.notificationIconBox}>
              <span role="img" aria-label="bell">
                🔔
              </span>
            </div>
            <div>
              <div style={styles.notificationHeaderTitle}>
                Notifications
              </div>
              <div style={styles.notificationHeaderSub}>
                {count} {count === 1 ? "notification" : "notifications"}
              </div>
            </div>
            <div style={styles.notificationHeaderActions}>
              {count > 0 && (
                <button
                  onClick={handleClearNotifications}
                  style={{
                    borderRadius: 12,
                    padding: "4px 8px",
                    border: "none",
                    backgroundColor: "rgba(255,255,255,0.5)",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setShowNotifications(false)}
                style={{
                  borderRadius: 12,
                  padding: 6,
                  border: "none",
                  backgroundColor: "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* list */}
          <div style={styles.notificationList}>
            {count === 0 ? (
              <div style={{ ...styles.centerMessage, marginTop: 40 }}>
                You're all caught up! New notifications will appear
                here.
              </div>
            ) : (
              notifications.map((item, index) => (
                <div key={index} style={styles.notificationCard}>
                  <div style={styles.notificationIconBox}>
                    <span role="img" aria-label="notify">
                      📣
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    {item.title && (
                      <div style={styles.notificationBodyTitle}>
                        {item.title}
                      </div>
                    )}
                    {item.body && (
                      <div style={styles.notificationBodyText}>
                        {item.body}
                      </div>
                    )}
                    <div style={styles.notificationFooterRow}>
                      <span>Just now</span>
                      <span style={{ marginLeft: "auto" }}>
                        <button
                          onClick={() => handleRemoveNotification(index)}
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            color: "#9ca3af",
                          }}
                        >
                          ✕
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  // ---------------------------------------------------------------------------
  // Main render
  // ---------------------------------------------------------------------------

  return (
    <div style={styles.root}>
      <div style={styles.headerWrapper}>
        <div style={styles.headerContainer}>
          <div style={styles.headerRow}>
            <div style={{ flex: 1 }} />
            <div style={{ flex: 1, textAlign: "center" }}>
              <span style={styles.headerTitle}>Saved jobs</span>
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
              <div
                style={styles.notificationIconWrapper}
                onClick={() => setShowNotifications(true)}
              >
                {/* you can replace this with an image if you want */}
                <span role="img" aria-label="bell" style={{ fontSize: 22 }}>
                  🔔
                </span>
                {unreadCount > 0 && (
                  <div style={styles.notificationDot}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabsBarWrapper}>
          <div style={styles.tabsRow}>
            {renderTab("Works")}
            {renderTab("24 hour")}
            {renderTab("Saved")}
          </div>
        </div>
      </div>

      {/* Lists */}
      {selectedTab === "Works"
        ? renderWorksList()
        : selectedTab === "24 hour"
        ? render24hList()
        : renderSavedList()}

      {/* Notifications modal */}
      <NotificationDialog />
    </div>
  );
};

export default ExploreJobScreen;