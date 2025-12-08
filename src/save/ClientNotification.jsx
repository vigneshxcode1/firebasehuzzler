// FreelancerFullDetail.jsx
// React single-file version of your Flutter FullDetailScreen
// NOTE: Firebase config (initializeApp) should be in a separate file like ../firbase/Firebase.js
// This file ONLY imports db/auth from there.

import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { db } from "../firbase/Firebase"; // 🔁 adjust path to your project

const YELLOW = "#FDFD96";

const pageStyle = {
  minHeight: "100vh",
  backgroundColor: "#f5f5f5",
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const containerStyle = {
  maxWidth: 900,
  margin: "0 auto",
  paddingBottom: 32,
};

const loadingWrapper = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

// Small helper
const safeList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((v) => String(v));
  return [];
};

export default function FreelancerFullDetail({
  linkedinUrl: initialLinkedinUrl,
  userId,
  jobid, // keep flutter style prop name if you want
  jobId: jobIdProp, // optional
}) {
  const navigate = useNavigate();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  const [profile, setProfile] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [workServices, setWorkServices] = useState([]);
  const [jobs24h, setJobs24h] = useState([]);

  const [activeTab, setActiveTab] = useState("work"); // "work" | "24h"

  const viewedUid = useMemo(
    () => userId || currentUser?.uid || null,
    [userId, currentUser]
  );

  const jobId = jobIdProp || jobid || null;

  // ---------------- CHECK ACCEPTED STATE ---------------- //
  useEffect(() => {
    if (!jobId || !viewedUid) return;

    const checkAccepted = async () => {
      try {
        const qRef = query(
          collection(db, "notifications"),
          where("jobId", "==", jobId),
          where("freelancerId", "==", viewedUid),
          where("read", "==", true)
        );
        const snap = await getDocs(qRef);
        if (!snap.empty) {
          setIsAccepted(true);
        }
      } catch (err) {
        console.error("Error checking accepted:", err);
      }
    };

    checkAccepted();
  }, [jobId, viewedUid]);

  // ---------------- PROFILE STREAM ---------------- //
  useEffect(() => {
    if (!viewedUid) {
      setIsLoading(false);
      return;
    }

    const unsub = onSnapshot(
      doc(db, "users", viewedUid),
      (snap) => {
        if (snap.exists()) {
          setProfile({ id: snap.id, ...snap.data() });
        } else {
          setProfile(null);
        }
        setIsLoading(false);
      },
      (err) => {
        console.error("Error getting profile:", err);
        setIsLoading(false);
      }
    );

    return () => unsub();
  }, [viewedUid]);

  // ---------------- PORTFOLIO STREAM ---------------- //
  useEffect(() => {
    if (!viewedUid) return;

    const colRef = collection(db, "users", viewedUid, "portfolio");

    const unsub = onSnapshot(
      colRef,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setPortfolio(list);
      },
      (err) => {
        console.error("Error getting portfolio:", err);
      }
    );

    return () => unsub();
  }, [viewedUid]);

  // ---------------- WORK SERVICES STREAM ---------------- //
  useEffect(() => {
    if (!viewedUid) return;

    const qRef = query(
      collection(db, "users", viewedUid, "services"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      qRef,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setWorkServices(list);
      },
      (err) => {
        console.error("Error getting work services:", err);
      }
    );

    return () => unsub();
  }, [viewedUid]);

  // ---------------- 24H SERVICES STREAM ---------------- //
  useEffect(() => {
    if (!viewedUid) return;

    const qRef = query(
      collection(db, "users", viewedUid, "service_24h"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      qRef,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setJobs24h(list);
      },
      (err) => {
        console.error("Error getting 24h services:", err);
      }
    );

    return () => unsub();
  }, [viewedUid]);

  // ---------------- REFRESH (just a small spinner) ---------------- //
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // ---------------- UI HELPERS ---------------- //

  const showAlert = (msg) => {
    window.alert(msg);
  };

  const openLinkedIn = async (urlFromProfile) => {
    try {
      const url = (urlFromProfile || initialLinkedinUrl || "").trim();
      if (!url) {
        showAlert("No LinkedIn profile available");
        return;
      }
      const fixed = url.startsWith("http") ? url : `https://${url}`;
      window.open(fixed, "_blank", "noopener,noreferrer");
    } catch (e) {
      showAlert("Error opening LinkedIn");
    }
  };

  const openPortfolioUrl = (url) => {
    try {
      if (!url) {
        showAlert("No project link available");
        return;
      }
      const fixed = url.startsWith("http") ? url : `https://${url}`;
      window.open(fixed, "_blank", "noopener,noreferrer");
    } catch {
      showAlert("Error opening project link");
    }
  };

  const shareProfile = (linkedin, fullName) => {
    const name = fullName || "this freelancer";
    const url = linkedin ? (linkedin.startsWith("http") ? linkedin : `https://${linkedin}`) : "";
    const text = url
      ? `Check out ${name}'s professional profile: ${url}`
      : `Check out ${name}'s professional profile`;

    if (navigator.share) {
      navigator
        .share({ title: `Professional Profile - ${name}`, text })
        .catch(() => {});
    } else {
      showAlert(text);
    }
  };

  const shareService = (job) => {
    const title = job?.title || "Service";
    const price = job?.price || "0";
    const text = `Check out this service: ${title}\nPrice: ₹${price}`;

    if (navigator.share) {
      navigator
        .share({ title: `Service: ${title}`, text })
        .catch(() => {});
    } else {
      showAlert(text);
    }
  };

  const share24hJob = (job) => {
    const title = job?.title || "Job";
    const budget = job?.budget || "0";
    const text = `Check out this 24h job: ${title}\nBudget: ₹${budget}`;

    if (navigator.share) {
      navigator
        .share({ title: `24h Job: ${title}`, text })
        .catch(() => {});
    } else {
      showAlert(text);
    }
  };

  const handleMessagePressed = async () => {
    try {
      if (!viewedUid || !currentUser?.uid) return;

      const snap = await getDoc(doc(db, "users", viewedUid));
      if (!snap.exists()) {
        showAlert("User not found");
        return;
      }
      const data = snap.data() || {};
      const receiverName = `${data.firstName || ""} ${data.lastName || ""}`.trim() || "User";
      const receiverImage = data.imageUrl || data.profileImage || "";

      // Navigate to your chat route
      navigate("/chat", {
        state: {
          currentUid: currentUser.uid,
          otherUid: viewedUid,
          otherName: receiverName,
          otherImage: receiverImage,
        },
      });
    } catch (e) {
      console.error("Error opening chat:", e);
      showAlert("Error opening chat");
    }
  };

  // ---------------- ACCEPT / DECLINE ---------------- //

  const handleAccept = async () => {
    try {
      if (!jobId || !viewedUid) {
        showAlert("Missing job or freelancer ID");
        return;
      }

      const notifQ = query(
        collection(db, "notifications"),
        where("jobId", "==", jobId),
        where("freelancerId", "==", viewedUid)
      );

      const snap = await getDocs(notifQ);
      if (snap.empty) {
        showAlert("No matching notification found.");
        return;
      }

      const notifDoc = snap.docs[0];
      const notifId = notifDoc.id;

      // mark notification as read
      await updateDoc(doc(db, "notifications", notifId), { read: true });

      // get freelancer details
      const freelancerSnap = await getDoc(doc(db, "users", viewedUid));
      const freelancerData = freelancerSnap.data() || {};
      const freelancerName = `${freelancerData.firstName || ""} ${
        freelancerData.lastName || ""
      }`.trim();
      const freelancerImage = freelancerData.profileImage || "";

      // store in accepted_jobs
      await addDoc(collection(db, "accepted_jobs"), {
        jobId,
        freelancerId: viewedUid,
        freelancerName,
        freelancerImage,
        acceptedAt: serverTimestamp(),
        status: "accepted",
      });

      // NOTE: FCM push notification should be done from a secure backend.
      // We do NOT put server key in frontend.

      setIsAccepted(true);
      showAlert("Freelancer accepted successfully.");
    } catch (e) {
      console.error("Error accepting:", e);
      showAlert(`Error: ${e.message || e}`);
    }
  };

  const handleDecline = async () => {
    try {
      if (!jobId || !viewedUid) return;

      const notifQ = query(
        collection(db, "notifications"),
        where("jobId", "==", jobId),
        where("freelancerId", "==", viewedUid)
      );

      const snap = await getDocs(notifQ);
      const batchDeletes = snap.docs.map((d) => deleteDoc(d.ref));
      await Promise.all(batchDeletes);

      showAlert("Freelancer declined.");
    } catch (e) {
      console.error("Error declining:", e);
      showAlert("Error declining freelancer");
    }
  };

  // ---------------- DELETE HELPERS ---------------- //

  const confirmDelete = async (titleText) => {
    // simple confirm
    const ok = window.confirm(titleText);
    return ok;
  };

  const deleteService = async (job) => {
    if (!viewedUid) return;
    const docId = job.id;
    const title = job.title || "this service";
    const ok = await confirmDelete(`Delete service "${title}" ?`);
    if (!ok) return;

    try {
      // main collection
      await deleteDoc(doc(db, "services", docId));
      // subcollection
      await deleteDoc(doc(db, "users", viewedUid, "services", docId));
      showAlert("Service deleted successfully");
    } catch (e) {
      console.error("Error deleting service:", e);
      showAlert("Error deleting service");
    }
  };

  const delete24hJob = async (job) => {
    if (!viewedUid) return;
    const docId = job.id;
    const title = job.title || "this job";
    const ok = await confirmDelete(`Delete 24h job "${title}" ?`);
    if (!ok) return;

    try {
      await deleteDoc(doc(db, "users", viewedUid, "service_24h", docId));
      showAlert("24h job deleted successfully");
    } catch (e) {
      console.error("Error deleting 24h job:", e);
      showAlert("Error deleting 24h job");
    }
  };

  const deletePortfolioItem = async (item) => {
    if (!viewedUid) return;
    const docId = item.id;
    const title = item.title || "this portfolio item";

    const ok = await confirmDelete(
      `Are you sure you want to delete "${title}"? This cannot be undone.`
    );
    if (!ok) return;

    try {
      await deleteDoc(doc(db, "users", viewedUid, "portfolio", docId));
      showAlert("Portfolio item deleted successfully");
    } catch (e) {
      console.error("Error deleting portfolio:", e);
      showAlert("Error deleting portfolio");
    }
  };

  // ---------------- RENDER PARTS ---------------- //

  if (!viewedUid) {
    return (
      <div style={loadingWrapper}>
        <div>No user logged in</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={loadingWrapper}>
        <div>
          <div
            style={{
              marginBottom: 12,
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "3px solid #000",
              borderTopColor: "transparent",
              animation: "spin 1s linear infinite",
              marginInline: "auto",
            }}
          />
          <div style={{ textAlign: "center" }}>Loading profile...</div>
          <style>
            {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
          </style>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={loadingWrapper}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, color: "#ccc", marginBottom: 8 }}>⚠️</div>
          <div style={{ marginBottom: 12 }}>User profile not found</div>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              border: "none",
              backgroundColor: "#1976d2",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const profileImage = profile.profileImage || "";
  const coverImage = profile.coverImage || "";
  const title = profile.professional_title || "No Title";
  const about = profile.about || "No About Info";
  const skills = safeList(profile.skills);
  const tools = safeList(profile.tools);
  const firstName = profile.firstName || "";
  const lastName = profile.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || "User";
  const locationText = profile.location || "Location not set";
  const linkedin = profile.linkedin || initialLinkedinUrl || "";

  // Header actions
  const renderHeaderButtons = () => {
    if (isAccepted) {
      // Message button
      return (
        <button
          onClick={handleMessagePressed}
          style={{
            padding: "8px 16px",
            borderRadius: 10,
            border: "none",
            backgroundColor: "#FFF9C4",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          💬 Message
        </button>
      );
    }

    // default Accept / Decline
    return (
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={handleAccept}
          style={{
            padding: "8px 18px",
            borderRadius: 10,
            border: "none",
            backgroundColor: "#FFF9C4",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Accepted
        </button>
        <button
          onClick={handleDecline}
          style={{
            padding: "8px 18px",
            borderRadius: 10,
            border: "1px solid #FDD835",
            backgroundColor: "#fff",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Decline
        </button>
      </div>
    );
  };

  const renderSkillChip = (label) => (
    <div
      key={label}
      style={{
        padding: "6px 12px",
        borderRadius: 20,
        border: "1px solid #ccc",
        backgroundColor: "#fff",
        fontSize: 13,
        fontWeight: 500,
        margin: "0 6px 6px 0",
      }}
    >
      {label}
    </div>
  );

  const renderWorkCard = (job) => {
    const tags = [
      ...safeList(job.skills),
      ...safeList(job.tools),
    ];

    const isHttpImage =
      job.image && typeof job.image === "string" && job.image.startsWith("http");

    return (
      <div
        key={job.id}
        style={{
          display: "flex",
          borderRadius: 16,
          margin: "8px 0",
          backgroundColor: "#FFFFD8",
          overflow: "hidden",
          minHeight: 160,
        }}
      >
        {/* LEFT */}
        <div
          style={{
            width: "30%",
            backgroundColor: YELLOW,
            padding: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "100%" }}>
            <div
              style={{
                borderRadius: 12,
                overflow: "hidden",
                marginBottom: 12,
              }}
            >
              {isHttpImage ? (
                <img
                  src={job.image}
                  alt={job.title || "Service"}
                  style={{ width: "100%", height: 90, objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: 90,
                    backgroundColor: "#eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                  }}
                >
                  📷
                </div>
              )}
            </div>
          </div>
          <div style={{ textAlign: "center", marginBottom: 4 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>
              ₹{job.price || "0"}
            </div>
            <div style={{ marginTop: 8, fontSize: 13, fontWeight: 500 }}>
              {job.deliveryDuration || ""}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ flex: 1, padding: 12, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <div
              style={{
                flex: 1,
                fontSize: 16,
                fontWeight: 600,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {job.title || ""}
            </div>
            {/* menu */}
            <div>
              <button
                onClick={(e) => {
                  const menu = window.prompt(
                    "Type: edit / share / delete",
                    "edit"
                  );
                  if (menu === "edit") {
                    navigate("/add-service", {
                      state: { mode: "edit", job },
                    });
                  } else if (menu === "share") {
                    shareService(job);
                  } else if (menu === "delete") {
                    deleteService(job);
                  }
                }}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 18,
                }}
              >
                ⋯
              </button>
            </div>
          </div>

          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#000",
              marginBottom: 8,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {job.description || ""}
          </div>

          <div
            style={{
              marginBottom: 8,
              overflowX: "auto",
              paddingBottom: 4,
            }}
          >
            <div style={{ display: "inline-flex" }}>
              {tags.map((t) => (
                <div
                  key={t}
                  style={{
                    marginRight: 6,
                    padding: "4px 10px",
                    borderRadius: 20,
                    border: "1px solid #ddd",
                    backgroundColor: "#fff",
                    fontSize: 11,
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "auto", textAlign: "right" }}>
            <button
              onClick={() =>
                navigate("/work-job-detail", { state: { job } })
              }
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: "none",
                backgroundColor: YELLOW,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              View more
            </button>
          </div>
        </div>
      </div>
    );
  };

  const render24hCard = (job) => {
    const tags = [
      ...safeList(job.skills),
      ...safeList(job.tools),
    ];

    const isHttpImage =
      job.image && typeof job.image === "string" && job.image.startsWith("http");

    return (
      <div
        key={job.id}
        style={{
          display: "flex",
          borderRadius: 16,
          margin: "8px 0",
          backgroundColor: "#FFFFD8",
          overflow: "hidden",
          minHeight: 160,
        }}
      >
        {/* LEFT */}
        <div
          style={{
            width: "30%",
            backgroundColor: YELLOW,
            padding: 12,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                borderRadius: 12,
                overflow: "hidden",
                marginBottom: 12,
              }}
            >
              {isHttpImage ? (
                <img
                  src={job.image}
                  alt={job.title || "Job"}
                  style={{ width: "100%", height: 90, objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: 90,
                    backgroundColor: "#eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                  }}
                >
                  📷
                </div>
              )}
            </div>

            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>
                ₹{job.budget || "N/A"}
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  paddingInline: 6,
                }}
              >
                {job.category || ""}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ flex: 1, padding: 12, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <div
              style={{
                flex: 1,
                fontSize: 16,
                fontWeight: 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {job.title || ""}
            </div>
            <button
              onClick={() => {
                const menu = window.prompt(
                  "Type: edit / share / delete",
                  "edit"
                );
                if (menu === "edit") {
                  navigate("/freelancer-24h-edit", {
                    state: { job },
                  });
                } else if (menu === "share") {
                  share24hJob(job);
                } else if (menu === "delete") {
                  delete24hJob(job);
                }
              }}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 20,
              }}
            >
              ⋯
            </button>
          </div>

          <div
            style={{
              fontSize: 15,
              fontWeight: 500,
              color: "#1B1B1B",
              marginBottom: 8,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {job.description || "No description provided"}
          </div>

          <div
            style={{
              marginBottom: 8,
              overflowX: "auto",
              paddingBottom: 4,
            }}
          >
            <div style={{ display: "inline-flex" }}>
              {tags.map((t) => (
                <div
                  key={t}
                  style={{
                    marginRight: 6,
                    padding: "4px 10px",
                    borderRadius: 20,
                    border: "1px solid #ddd",
                    backgroundColor: "#fff",
                    fontSize: 11,
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "auto", textAlign: "right" }}>
            <button
              onClick={() =>
                navigate("/fh-job-detail", { state: { job } })
              }
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: "none",
                backgroundColor: YELLOW,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              View more
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderPortfolioCard = (item) => {
    const skills = safeList(item.skills);
    const tools = safeList(item.tools);

    const allTags = [...skills, ...tools];

    return (
      <div
        key={item.id}
        style={{
          borderRadius: 16,
          backgroundColor: "#fff",
          border: "1px solid #ddd",
          padding: 14,
          marginBottom: 16,
          display: "flex",
          gap: 16,
        }}
        onClick={() => openPortfolioUrl(item.projectUrl)}
        onContextMenu={(e) => {
          e.preventDefault();
          const action = window.prompt("Type: delete", "delete");
          if (action === "delete") deletePortfolioItem(item);
        }}
      >
        <div>
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title || "Portfolio"}
              style={{ width: 120, height: 160, borderRadius: 8, objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: 120,
                height: 160,
                borderRadius: 8,
                backgroundColor: "#eee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
              }}
            >
              🎨
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            {item.title || "Untitled"}
          </div>
          <div
            style={{
              fontSize: 14,
              color: "#555",
              marginBottom: 10,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item.description || "No description"}
          </div>
          <div>
            {allTags.slice(0, 6).map((tag) => (
              <span
                key={tag}
                style={{
                  display: "inline-block",
                  marginRight: 6,
                  marginBottom: 6,
                  padding: "4px 10px",
                  borderRadius: 4,
                  backgroundColor: "#e0e0e0",
                  fontSize: 11,
                  fontWeight: 500,
                }}
              >
                {tag}
              </span>
            ))}
            {allTags.length > 6 && (
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 10px",
                  borderRadius: 4,
                  backgroundColor: "#ddd",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                +{allTags.length - 6}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* Top bar */}
        <div
          style={{
            padding: "12px 8px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "1px solid #ddd",
              backgroundColor: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ←
          </button>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Profile Detail</div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button
              onClick={() =>
                navigate("/edit-profile", { state: { uid: viewedUid } })
              }
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 22,
              }}
              title="Edit"
            >
              ✏️
            </button>
            <button
              onClick={() => shareProfile(linkedin, fullName)}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 22,
              }}
              title="Share"
            >
              📤
            </button>
          </div>
        </div>

        {/* HEADER */}
        <div style={{ position: "relative", marginBottom: 60 }}>
          {/* Cover */}
          <div
            style={{
              height: 220,
              borderBottomLeftRadius: 30,
              borderBottomRightRadius: 30,
              overflow: "hidden",
              background: coverImage
                ? "transparent"
                : `linear-gradient(135deg, ${YELLOW}, ${YELLOW})`,
            }}
          >
            {coverImage && (
              <img
                src={coverImage}
                alt="Cover"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
          </div>

          {/* Floating Card */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              bottom: -40,
              width: "80%",
              maxWidth: 500,
              backgroundColor: "#fff",
              borderRadius: 20,
              boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
              padding: "70px 20px 22px 20px",
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontSize: 20,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              {fullName}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 12,
                color: "#666",
                marginBottom: 18,
                gap: 4,
              }}
            >
              <span>📍</span>
              <span
                style={{
                  maxWidth: 220,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {locationText}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {renderHeaderButtons()}
            </div>
          </div>

          {/* Avatar */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 120,
              transform: "translateX(-50%)",
            }}
          >
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                border: "4px solid #fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
                overflow: "hidden",
                backgroundColor: "#e0e0e0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 40,
                color: "#888",
              }}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                "👤"
              )}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ padding: "0 20px", marginTop: 10 }}>
          {/* About + Skills */}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              border: "1px solid #ddd",
              padding: "18px 20px",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    marginBottom: 8,
                  }}
                >
                  Professional Title
                </div>
                <div
                  style={{
                    display: "inline-block",
                    padding: "6px 12px",
                    borderRadius: 6,
                    backgroundColor: "rgba(76, 175, 80, 0.12)",
                    color: "#1b5e20",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {title}
                </div>
              </div>
              <button
                onClick={() => openLinkedIn(linkedin)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  border: "none",
                  backgroundImage:
                    "url('https://cdn-icons-png.flaticon.com/512/174/174857.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  cursor: "pointer",
                }}
                title="Open LinkedIn"
              ></button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div
                style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}
              >
                About
              </div>
              <div
                style={{
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: "#222",
                }}
              >
                {about}
              </div>
            </div>

            {(skills.length > 0 || tools.length > 0) && (
              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    marginBottom: 6,
                  }}
                >
                  Skills & Tools
                </div>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {skills.map(renderSkillChip)}
                  {tools.map(renderSkillChip)}
                </div>
              </div>
            )}
          </div>

          {/* Portfolio */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              Portfolio
            </div>
            {portfolio.length === 0 ? (
              <div style={{ color: "#777", fontSize: 14 }}>
                No portfolio items yet.
              </div>
            ) : (
              portfolio.map(renderPortfolioCard)
            )}
          </div>

          {/* Services Tabs */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                display: "inline-flex",
                borderRadius: 999,
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setActiveTab("work")}
                style={{
                  padding: "8px 24px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor:
                    activeTab === "work" ? "#FFF59D" : "transparent",
                  fontWeight: activeTab === "work" ? 700 : 400,
                  fontSize: 14,
                }}
              >
                Work
              </button>
              <button
                onClick={() => setActiveTab("24h")}
                style={{
                  padding: "8px 24px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor:
                    activeTab === "24h" ? "#FFF59D" : "transparent",
                  fontWeight: activeTab === "24h" ? 700 : 400,
                  fontSize: 14,
                }}
              >
                24 hour
              </button>
            </div>

            <div style={{ marginTop: 12 }}>
              {activeTab === "work" ? (
                workServices.length === 0 ? (
                  <div
                    style={{
                      padding: 40,
                      textAlign: "center",
                      color: "#777",
                    }}
                  >
                    <div style={{ fontSize: 40, marginBottom: 8 }}>🧑‍💻</div>
                    No work services yet
                  </div>
                ) : (
                  workServices.map(renderWorkCard)
                )
              ) : jobs24h.length === 0 ? (
                <div
                  style={{
                    padding: 40,
                    textAlign: "center",
                    color: "#777",
                  }}
                >
                  <div style={{ fontSize: 40, marginBottom: 8 }}>⏱</div>
                  No 24h jobs yet
                </div>
              ) : (
                jobs24h.map(render24hCard)
              )}
            </div>
          </div>

          {/* Refresh button (simulated pull-to-refresh) */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              style={{
                padding: "8px 18px",
                borderRadius: 20,
                border: "1px solid #999",
                backgroundColor: "#fff",
                cursor: isRefreshing ? "default" : "pointer",
                fontSize: 13,
              }}
            >
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}