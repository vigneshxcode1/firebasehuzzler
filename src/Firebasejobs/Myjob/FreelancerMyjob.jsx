// ServicePage.jsx
// Single file, React + Firestore, no firebase config code inside

import React, { useEffect, useState, useCallback } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firbase/Firebase"; // ✅ your existing firebase config file

// -----------------------------------------------------------------------------
// Helper components & functions
// -----------------------------------------------------------------------------

const buildChips = (items) => {
  if (!items || !items.length) return null;
  return (
    <div
      style={{
        height: 30,
        display: "flex",
        overflowX: "auto",
        gap: 6,
        marginTop: 4,
      }}
    >
      {items.map((text, idx) => (
        <span
          key={idx}
          style={{
            padding: "4px 10px",
            borderRadius: 20,
            border: "1px solid #e5e7eb",
            backgroundColor: "#ffffff",
            fontSize: 11,
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </span>
      ))}
    </div>
  );
};

const EmptyState = ({ title, subtitle, buttonText, onClick, imageSrc }) => {
  return (
    <div
      style={{
        padding: "24px 16px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt="empty-state"
          style={{
            width: 160,
            height: 160,
            objectFit: "contain",
            marginBottom: 8,
          }}
        />
      )}

      <div
        style={{
          fontSize: 15,
          fontWeight: 500,
          marginBottom: 4,
        }}
      >
        {title}
      </div>

      <p
        style={{
          fontSize: 14,
          color: "#5A5A5A",
          maxWidth: 320,
          lineHeight: 1.5,
        }}
      >
        {subtitle}
      </p>

      {onClick && (
        <button
          onClick={onClick}
          style={{
            marginTop: 4,
            padding: "10px 22px",
            borderRadius: 25,
            border: "none",
            backgroundColor: "#fde047",
            color: "#111827",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------

const styles = {
  root: {
    backgroundColor: "#ffffff",
    minHeight: "100vh",
    fontFamily:
      '"Rubik", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 500,
  },
  searchWrapper: {
    position: "absolute",
    left: "8%",
    right: "8%",
    bottom: -25,
  },
  searchBox: {
    height: 50,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    border: "1px solid #d1d5db",
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },
  searchInput: {
    border: "none",
    outline: "none",
    width: "100%",
    fontSize: 14,
  },
  tabsRow: {
    marginTop: 40,
    padding: "0 16px 0",
    display: "flex",
    gap: 30,
  },
  tabLabel: (active) => ({
    fontSize: 16,
    fontWeight: 700,
    color: active ? "#000000" : "#9ca3af",
    cursor: "pointer",
  }),
  tabUnderline: (active, width) => ({
    marginTop: 4,
    height: 2,
    width,
    backgroundColor: active ? "#facc15" : "transparent",
    borderRadius: 999,
  }),
  divider: {
    marginTop: 5,
    marginBottom: 5,
    height: 1,
    backgroundColor: "#e5e7eb",
    marginLeft: 16,
    marginRight: 16,
  },
  listContainer: {
    paddingTop: 6,
    paddingBottom: 16,
  },
  addCardContainer: {
    margin: "6px 16px",
    backgroundColor: "#f3f4f6",
    borderRadius: 15,
    padding: 16,
  },
  addCardTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 10,
    color: "#111827",
  },
  addCardRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
  },
  addCardIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 999,
    border: "1.2px solid #000000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  addCardText: {
    fontSize: 12,
    color: "#111827",
    lineHeight: 1.4,
  },
  serviceCardOuter: {
    margin: "8px 16px",
    borderRadius: 16,
    backgroundColor: "#FFFFD8",
    display: "flex",
    overflow: "hidden",
  },
  serviceLeft: {
    backgroundColor: "#FDFD96",
    width: "30%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 12,
  },
  serviceRight: {
    flex: 1,
    padding: 12,
    display: "flex",
    flexDirection: "column",
  },
  serviceImage: {
    borderRadius: 12,
    width: "100%",
    height: "90px",
    objectFit: "cover",
  },
  priceText: {
    fontWeight: 600,
    fontSize: 14,
  },
  durationText: {
    fontSize: 12,
    fontWeight: 500,
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "#000000",
    marginRight: 8,
  },
  descriptionText: {
    fontSize: 13,
    color: "#111827",
    fontWeight: 500,
    marginTop: 6,
    lineHeight: 1.5,
  },
  moreBtn: {
    alignSelf: "flex-end",
    marginTop: "auto",
    padding: "6px 16px",
    borderRadius: 20,
    border: "none",
    backgroundColor: "#FDFD96",
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
  },
  popupBtn: {
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: 18,
  },
  popupMenu: {
    position: "absolute",
    right: 0,
    top: 22,
    backgroundColor: "#FDFD96",
    borderRadius: 12,
    padding: "4px 0",
    minWidth: 100,
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    zIndex: 20,
  },
  popupMenuItem: {
    padding: "6px 10px",
    textAlign: "center",
    fontSize: 13,
    cursor: "pointer",
  },
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

const ServicePage = () => {
  const [selectedTab, setSelectedTab] = useState("Works");
  const [currentUser, setCurrentUser] = useState(() => auth.currentUser);
  const [services, setServices] = useState([]); // "services" collection
  const [jobs24h, setJobs24h] = useState([]); // "users/{uid}/service_24h"
  const [openMenuId, setOpenMenuId] = useState(null);

  const navigate = useNavigate();

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  // Load services (Works tab)
  useEffect(() => {
    if (!currentUser) return;

    const colRef = collection(db, "services");
    const q = query(colRef, where("userId", "==", currentUser.uid));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() || {}),
        }));
        setServices(list);
      },
      (err) => {
        console.error("Error listening services:", err);
      }
    );

    return () => unsub();
  }, [currentUser]);

  // Load 24h services
  useEffect(() => {
    if (!currentUser) return;
    const colRef = collection(db, "users", currentUser.uid, "service_24h");
    const unsub = onSnapshot(
      colRef,
      (snap) => {
        const list = snap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() || {}),
        }));
        setJobs24h(list);
      },
      (err) => {
        console.error("Error listening 24h services:", err);
      }
    );

    return () => unsub();
  }, [currentUser]);

  // Share (simple implementation)
  const handleShareService = useCallback(
    async (job) => {
      if (!currentUser) return;
      try {
        const chatId = "someChatId"; // TODO: replace with real chat id
        await addDoc(collection(db, "chats", chatId, "messages"), {
          senderId: currentUser.uid,
          type: "job",
          jobId: job.id,
          title: job.title || "",
          description: job.description || "",
          timestamp: new Date(),
        });
        console.log("Job shared!");
      } catch (err) {
        console.error("Share error:", err);
      }
    },
    [currentUser]
  );

  // Delete service (Works)
  const handleDeleteService = useCallback(
    async (job) => {
      if (!currentUser || !job?.id) return;
      try {
        await deleteDoc(doc(db, "services", job.id));
        // Optional: also delete from user subcollection "services"
        // await deleteDoc(doc(db, "users", currentUser.uid, "services", job.id));
        console.log("Service deleted");
      } catch (err) {
        console.error("Delete failed:", err);
      }
    },
    [currentUser]
  );

  // Delete 24h service
  const handleDelete24h = useCallback(
    async (job) => {
      if (!currentUser || !job?.id) return;
      try {
        // In Flutter they delete from "service_24h" + user subcollection
        // We'll do just user subcollection here. You can add global if needed.
        await deleteDoc(
          doc(db, "users", currentUser.uid, "service_24h", job.id)
        );
        console.log("24h job deleted");
      } catch (err) {
        console.error("Delete 24h failed:", err);
      }
    },
    [currentUser]
  );

  // Cards ---------------------------------------------------------------------

  const ServiceCard = ({ job }) => {
    const allChips = [
      ...((job.skills || []).map(String) || []),
      ...((job.tools || []).map(String) || []),
    ];

    return (
      <div style={styles.serviceCardOuter}>
        {/* LEFT */}
        <div style={styles.serviceLeft}>
          <div style={{ width: "100%", padding: "0 12px" }}>
            <img
              src={
                job.image && String(job.image).startsWith("http")
                  ? job.image
                  : job.image || "/assets/gallery.png"
              }
              alt="service"
              style={styles.serviceImage}
            />
          </div>
          <div style={{ textAlign: "center", marginTop: 6 }}>
            <div style={styles.priceText}>₹{job.price || "0"}</div>
            <div style={{ height: 6 }} />
            <div style={styles.durationText}>
              {job.deliveryDuration || ""}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={styles.serviceRight}>
          {/* Title + Menu */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  ...styles.jobTitle,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {job.title || ""}
              </div>
            </div>

            <div style={{ position: "relative" }}>
              <button
                style={styles.popupBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId((prev) => (prev === job.id ? null : job.id));
                }}
              >
                ⋯
              </button>
              {openMenuId === job.id && (
                <div style={styles.popupMenu}>
                  <div
                    style={styles.popupMenuItem}
                    onClick={() => {
                      setOpenMenuId(null);
                      // Edit route – send job with state
                      navigate("/freelance-dashboard/edit-service", {
                        state: { job, jobId: job.id },
                      });
                    }}
                  >
                    Edit
                  </div>
                  <div
                    style={{
                      height: 1,
                      backgroundColor: "rgba(0,0,0,0.1)",
                    }}
                  />
                  <div
                    style={styles.popupMenuItem}
                    onClick={() => {
                      setOpenMenuId(null);
                      handleShareService(job);
                    }}
                  >
                    Share
                  </div>
                  <div
                    style={{
                      height: 1,
                      backgroundColor: "rgba(0,0,0,0.1)",
                    }}
                  />
                  <div
                    style={{
                      ...styles.popupMenuItem,
                      color: "red",
                      fontWeight: 500,
                    }}
                    onClick={() => {
                      setOpenMenuId(null);
                      handleDeleteService(job);
                    }}
                  >
                    Delete
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div style={styles.descriptionText}>
            {job.description || ""}
          </div>

          {/* Chips */}
          {buildChips(allChips)}

          {/* View More */}
          <button
            style={styles.moreBtn}
            onClick={() =>
              navigate("/freelance-dashboard/service-detail", {
                state: { job },
              })
            }
          >
            View more
          </button>
        </div>
      </div>
    );
  };

  const Job24hCard = ({ job }) => {
    const allChips = [
      ...((job.skills || []).map(String) || []),
      ...((job.tools || []).map(String) || []),
    ];

    return (
      <div style={styles.serviceCardOuter}>
        {/* LEFT */}
        <div style={styles.serviceLeft}>
          <div style={{ width: "100%", padding: "0 12px" }}>
            <img
              src={
                job.image && String(job.image).startsWith("http")
                  ? job.image
                  : job.image || "/assets/gallery.png"
              }
              alt="24h-service"
              style={styles.serviceImage}
            />
          </div>
          <div style={{ textAlign: "center", marginTop: 6 }}>
            <div style={styles.priceText}>₹{job.budget || "N/A"}</div>
            <div style={{ height: 6 }} />
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                padding: "0 8px",
              }}
            >
              {job.category || ""}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={styles.serviceRight}>
          {/* Title + Menu */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  ...styles.jobTitle,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {job.title || ""}
              </div>
            </div>

            <div style={{ position: "relative" }}>
              <button
                style={styles.popupBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId((prev) => (prev === job.id ? null : job.id));
                }}
              >
                ⋯
              </button>
              {openMenuId === job.id && (
                <div style={styles.popupMenu}>
                  <div
                    style={styles.popupMenuItem}
                    onClick={() => {
                      setOpenMenuId(null);
                      navigate("/freelance-dashboard/edit-24h-service", {
                        state: { job, jobId: job.id },
                      });
                    }}
                  >
                    Edit
                  </div>
                  <div
                    style={{
                      height: 1,
                      backgroundColor: "rgba(0,0,0,0.1)",
                    }}
                  />
                  <div
                    style={styles.popupMenuItem}
                    onClick={() => {
                      setOpenMenuId(null);
                      handleShareService(job);
                    }}
                  >
                    Share
                  </div>
                  <div
                    style={{
                      height: 1,
                      backgroundColor: "rgba(0,0,0,0.1)",
                    }}
                  />
                  <div
                    style={{
                      ...styles.popupMenuItem,
                      color: "red",
                      fontWeight: 500,
                    }}
                    onClick={() => {
                      setOpenMenuId(null);
                      handleDelete24h(job);
                    }}
                  >
                    Delete
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div style={styles.descriptionText}>
            {job.description || "No description provided"}
          </div>

          {/* Chips */}
          {buildChips(allChips)}

          {/* View More */}
          <button
            style={styles.moreBtn}
            onClick={() =>
              navigate("/freelance-dashboard/24h-service-detail", {
                state: { job },
              })
            }
          >
            View more
          </button>
        </div>
      </div>
    );
  };

  // Render lists --------------------------------------------------------------

  const renderWorksList = () => {
    if (!currentUser) {
      return (
        <EmptyState
          title="Please login to see your services"
          subtitle="You must be logged in to view and manage your services."
          buttonText="Go to Login"
          onClick={() => navigate("/firelogin")}
          imageSrc="/assets/Scaling the Business 1.png"
        />
      );
    }

    if (!services.length) {
      return (
        <>
          <EmptyState
            title="Start your first service today!"
            subtitle="Showcase your skills with a service offering that attracts the right clients. Start now and turn your expertise into opportunities!"
            buttonText="Add Service"
            onClick={() =>
              navigate("/freelance-dashboard/add-service-form")
            }
            imageSrc="/assets/Scaling the Business 1.png"
          />
        </>
      );
    }

    return (
      <div style={styles.listContainer}>
        {/* Add Service card on top */}
        <div
          style={styles.addCardContainer}
          onClick={() =>
            navigate("/freelance-dashboard/add-service-form")
          }
        >
          <div style={styles.addCardTitle}>Add Service</div>
          <div style={styles.addCardRow}>
            <div style={styles.addCardIconWrapper}>
              <span style={{ fontSize: 20, fontWeight: 600 }}>+</span>
            </div>
            <div style={styles.addCardText}>
              Showcase your expertise by creating a new service and attract
              clients instantly.
            </div>
          </div>
        </div>

        {services.map((job) => (
          <ServiceCard key={job.id} job={job} />
        ))}
      </div>
    );
  };

  const render24hList = () => {
    if (!currentUser) {
      return (
        <EmptyState
          title="Please login to see your 24h jobs"
          subtitle="You must be logged in to view and post 24 hour jobs."
          buttonText="Go to Login"
          onClick={() => navigate("/login")}
          imageSrc="/assets/Scaling the Business 1.png"
        />
      );
    }

    if (!jobs24h.length) {
      return (
        <EmptyState
          title="All set – just add your first 24h job!"
          subtitle="Post a 24h job with clear details so freelancers can respond quickly."
          buttonText="Post a Jobs"
          onClick={() =>
            navigate("/freelance-dashboard/add-service-form")
          }
          imageSrc="/assets/Scaling the Business 1.png"
        />
      );
    }

    return (
      <div style={styles.listContainer}>
        {/* Add Service card on top for 24h */}
        <div
          style={styles.addCardContainer}
          onClick={() =>
            navigate("/freelance-dashboard/add-24h-service")
          }
        >
          <div style={styles.addCardTitle}>Add Service</div>
          <div style={styles.addCardRow}>
            <div style={styles.addCardIconWrapper}>
              <span style={{ fontSize: 20, fontWeight: 600 }}>+</span>
            </div>
            <div style={styles.addCardText}>
              Kickstart your project with a clear job post to attract top
              freelancers and bring your vision to life.
            </div>
          </div>
        </div>

        {jobs24h.map((job) => (
          <Job24hCard key={job.id} job={job} />
        ))}
      </div>
    );
  };

  // Main render ---------------------------------------------------------------

  return (
    <div style={styles.root}>
      {/* Header + Search */}
      <div style={styles.headerWrapper}>
        <div style={styles.headerContainer}>
          <div style={styles.headerRow}>
            <span style={styles.headerTitle}>Your Service</span>
          </div>
        </div>

        <div style={styles.searchWrapper}>
          <div
            style={styles.searchBox}
            onClick={() => navigate("/freelance-dashboard/job-search")}
          >
            <span style={{ fontSize: 18, marginRight: 8 }}>🔍</span>
            <input
              style={styles.searchInput}
              placeholder="Search"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabsRow}>
        <div
          onClick={() => setSelectedTab("Works")}
          style={{ cursor: "pointer" }}
        >
          <div style={styles.tabLabel(selectedTab === "Works")}>Works</div>
          <div style={styles.tabUnderline(selectedTab === "Works", 40)} />
        </div>

        <div
          onClick={() => setSelectedTab("24 hour")}
          style={{ cursor: "pointer" }}
        >
          <div style={styles.tabLabel(selectedTab === "24 hour")}>
            24 hour
          </div>
          <div style={styles.tabUnderline(selectedTab === "24 hour", 60)} />
        </div>
      </div>

      <div style={styles.divider} />

      {/* List Area */}
      {selectedTab === "Works" ? renderWorksList() : render24hList()}
    </div>
  );
};

export default ServicePage;