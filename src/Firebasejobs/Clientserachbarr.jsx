import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Categories from "../assets/categories.jpeg";

import {
    collection,
    query,
    orderBy,
    onSnapshot,
    Timestamp,
    where,
    updateDoc,
    deleteDoc,
    doc,
    setDoc,
    getDoc,
} from "firebase/firestore";
import { db, auth } from "../firbase/Firebase";

// ====== ASSETS ======
import browseImg1 from "../assets/Container.png";
import browseImg2 from "../assets/wave.png";
import worksImg1 from "../assets/file.png";
import worksImg2 from "../assets/yellowwave.png";
import arrow from "../assets/arrow.png";
import profile from "../assets/profile.png";

// ====== ICONS ======
import {
    FiSearch,
    FiMessageCircle,
    FiBell,
    FiPlus,
    FiBookmark,
    FiEye,
} from "react-icons/fi";
import { onAuthStateChanged } from "firebase/auth";

// ====== CATEGORY DATA ======
const categories = [
    "Graphics & Design",
    "Programming & Tech",
    "Digital Marketing",
    "Writing & Translation",
    "Video & Animation",
    "Music & Audio",
    "AI Services",
    "Data",
    "Business",
    "Finance",
    "Photography",
    "Lifestyle",
    "Consulting",
    "Personal Growth & Hobbies",
];

// ======================================================
// HELPERS
// ======================================================
function parseIntSafe(v) {
    if (v === undefined || v === null) return null;
    if (typeof v === "number") return Math.floor(v);
    const s = String(v).replace(/[^0-9]/g, "");
    const n = parseInt(s, 10);
    return Number.isNaN(n) ? null : n;
}

function timeAgo(input) {
    if (!input) return "N/A";
    let d = input instanceof Timestamp ? input.toDate() : new Date(input);
    const diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 60) return `${Math.floor(diff)} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    return `${Math.floor(diff / 86400)} days ago`;
}

function formatCurrency(amount) {
    if (!amount && amount !== 0) return "₹0";
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
}

// ======================================================
// MAIN
// ======================================================
export default function ClientHomeUI() {
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [savedJobs, setSavedJobs] = useState(new Set());
    const [userProfile, setUserProfile] = useState(null);

    const searchRef = useRef(null);

    // ================= NOTIFICATIONS ==================
    const [notifications, setNotifications] = useState([]);
    const [notifOpen, setNotifOpen] = useState(false);

    const [userInfo, setUserInfo] = useState({
        firstName: "",
        lastName: "",
        role: "",
        profileImage: "",
    });

    const fetchUserProfile = async (uid) => {
        try {
            const snap = await getDoc(doc(db, "users", uid));
            if (snap.exists()) {
                setUserProfile(snap.data());
            } else {
                console.log("User profile not found");
            }
        } catch (e) {
            console.error("Profile fetch error:", e);
        }
    };

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;
        fetchUserProfile(user.uid);
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) return;
            try {
                const userRef = doc(db, "users", currentUser.uid);
                const snap = await getDoc(userRef);
                if (snap.exists()) {
                    const data = snap.data();
                    setUserInfo({
                        firstName: data.firstName || "",
                        lastName: data.lastName || "",
                        role: data.role || "",
                        profileImage: data.profileImage || "",
                    });
                }
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
            collection(db, "notifications"),
            where("clientUid", "==", user.uid)
        );

        return onSnapshot(q, (snap) => {
            setNotifications(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        });
    }, []);

    const pending = notifications.filter((n) => !n.read).length;

    async function acceptNotif(item) {
        await updateDoc(doc(db, "notifications", item.id), { read: true });

        navigate("/chat", {
            state: {
                currentUid: auth.currentUser.uid,
                otherUid: item.freelancerId,
                otherName: item.freelancerName,
                otherImage: item.freelancerImage,
                initialMessage: `Your application for ${item.jobTitle} accepted!`,
            },
        });
    }

    async function declineNotif(item) {
        await deleteDoc(doc(db, "notifications", item.id));
    }

    // ================= JOB FETCH ==================
    useEffect(() => {
        const col1 = collection(db, "services");
        const col2 = collection(db, "service_24h");

        const unsub1 = onSnapshot(
            query(col1, orderBy("createdAt", "desc")),
            (snap) => {
                const data = snap.docs.map((d) => ({
                    _id: d.id,
                    ...d.data(),
                    _source: "services",
                }));
                setJobs((prev) => mergeJobs(prev, data));
            }
        );

        const unsub2 = onSnapshot(
            query(col2, orderBy("createdAt", "desc")),
            (snap) => {
                const data = snap.docs.map((d) => ({
                    _id: d.id,
                    ...d.data(),
                    _source: "service_24h",
                }));
                setJobs((prev) => mergeJobs(prev, data));
            }
        );

        return () => {
            unsub1();
            unsub2();
        };
    }, []);

    function mergeJobs(prev, incoming) {
        const map = new Map();
        for (const p of prev) map.set(p._id + "::" + (p._source || ""), p);
        for (const n of incoming) map.set(n._id + "::" + (n._source || ""), n);
        return Array.from(map.values());
    }

    // ================= AUTOCOMPLETE ==================
    useEffect(() => {
        const q = searchText.trim().toLowerCase();
        if (!q) return setSuggestions([]);

        const setS = new Set();
        for (const job of jobs) {
            if (job.title?.toLowerCase().includes(q)) setS.add(job.title);
            if (Array.isArray(job.skills)) {
                for (const s of job.skills) {
                    if (String(s).toLowerCase().includes(q)) setS.add(s);
                }
            }
        }
        setSuggestions(Array.from(setS).slice(0, 6));
    }, [searchText, jobs]);

    // ================= FILTER ==================
    const filteredJobs = useMemo(() => {
        const q = searchText.trim().toLowerCase();

        return jobs
            .filter((j) => {
                const t = (j.title || "").toLowerCase();
                const d = (j.description || "").toLowerCase();
                const skills = Array.isArray(j.skills)
                    ? j.skills.map((s) => String(s).toLowerCase())
                    : [];
                return (
                    !q ||
                    t.includes(q) ||
                    d.includes(q) ||
                    skills.some((s) => s.includes(q))
                );
            })
            .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
    }, [jobs, searchText]);

    // ================= OPEN JOB ==================
    async function openJob(job) {
        if (!job?._id) return;

        const collectionName =
            job._source === "service_24h" || "services";

        try {
            await setDoc(
                doc(db, collectionName, job._id),
                {
                    views: increment(1),
                },
                { merge: true }
            );
        } catch (err) {
            console.error("Error updating views:", err);
        }
        if (job._source === "service_24h")
            navigate(`/client-dashbroad2/service-24h/${job._id}`);
        else navigate(`/client-dashbroad2/service/${job._id}`);
    }

    function toggleSaveJob(id) {
        setSavedJobs((prev) => {
            const ns = new Set(prev);
            if (ns.has(id)) ns.delete(id);
            else ns.add(id);
            return ns;
        });
    }

    // ======================================================
    // UI
    // ======================================================
   return (
    <div className="fh-page rubik-font">
        <div className="fh-container">
            {/* HEADER */}
            <header className="fh-header">
                <div className="fh-header-left">
                    <h1 className="fh-title">
                        Welcome,
                        <div>{userInfo.firstName || "Huzzlers"}</div>
                    </h1>
                    <div></div> 
                </div>

                <div className="fh-header-right">
                    <button className="icon-btn" onClick={() => navigate("/client-dashbroad2/messages")}>
                        <FiMessageCircle />
                    </button>

                    <button className="icon-btn" onClick={() => setNotifOpen(true)}>
                        <FiBell />
                        {pending > 0 && (
                            <span
                                style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    background: "red",
                                    position: "absolute",
                                    top: 2,
                                    right: 2,
                                }}
                            ></span>
                        )}
                    </button>

                    <div className="fh-avatar">
                        <Link to={"/client-dashbroad2/CompanyProfileScreen"}>
                            <img
                                src={
                                    userProfile?.profileImage || profile
                                }
                                alt="Profile"
                            />
                        </Link>
                    </div>

                </div>

                {/* SEARCH */}
                <div className="fh-search-row" ref={searchRef}>
                    <div className="fh-search fh-search-small">
                        <FiSearch className="search-icon" />
                        <input
                            className="search-input"
                            placeholder="Search"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        {searchText && (
                            <button className="clear-btn" onClick={() => setSearchText("")}>
                                ✕
                            </button>
                        )}
                    </div>

                    {suggestions.length > 0 && (
                        <div className="autocomplete-list">
                            {suggestions.map((s, i) => (
                                <div
                                    key={i}
                                    className="autocomplete-item"
                                    onClick={() => {
                                        setSearchText(s);
                                        setSuggestions([]);
                                    }}
                                >
                                    {s}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </header>

            {/* ================= CATEGORY SCROLL ================= */}
            <section className="category-scroll-wrapper">
                {categories.map((cat, i) => (
                    <div
                        key={i}
                        className="category-card"
                        onClick={() =>
                            navigate("/client-dashbroad2/clientcategories", {
                                state: { category: cat },
                            })
                        }
                    >
                        {cat}
                    </div>
                ))}
            </section>

            {/* ================= MAIN ================= */}
            <main className="fh-main">
                {/* HERO */}
                <section className="fh-hero">
                    <div
                        className="fh-hero-card primary"
                        onClick={() => navigate("/client-dashbroad2/clientcategories")}
                    >
                        <img src={browseImg1} className="hero-img img-1" />
                        <img src={browseImg2} className="hero-img img-2" />
                        <div>
                            <h3>Browse All Projects</h3>
                            <p>Explore verified professionals</p>
                        </div>
                        <div className="hero-right">
                            <img src={arrow} className="arrow" width={25} />
                        </div>
                    </div>

                    <div
                        className="fh-hero-card secondary"
                        onClick={() => navigate("/client-dashbroad2/AddJobScreen")}
                    >
                        <img src={worksImg1} className="hero-img img-3" />
                        <img src={worksImg2} className="hero-img img-4" />
                        <div>
                            <h4>Job proposal</h4>
                            <p>Find the right freelancers</p>
                        </div>
                        <div className="hero-right">
                            <img src={arrow} className="arrow" width={25} />
                        </div>
                    </div>
                </section>

                {/* ================= JOB LIST ================= */}
                <section className="fh-section">
                    <div className="section-header">
                        <h2>Top Services for You</h2>
                    </div>

                    <div className="jobs-list">
                        {filteredJobs.map((job) => (
                            <article key={job._id} className="job-card" onClick={() => openJob(job)}>
                                <div className="job-card-top">
                                    <div>
                                        <h3 className="job-title">{job.title}</h3>
                                        <div className="job-sub">{job.category || "Service"}</div>
                                    </div>

                                    <div className="job-budget-wrapper">
                                        <div className="job-budget">{formatCurrency(parseIntSafe(job.price))}</div>
                                        <button
                                            className={`save-btn ${savedJobs.has(job._id) ? "saved" : ""}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleSaveJob(job._id);
                                            }}
                                        >
                                            <FiBookmark />
                                        </button>
                                    </div>
                                </div>

                                <div className="job-skills">
                                    {(job.skills || []).slice(0, 3).map((skill, i) => (
                                        <span key={i} className="skill-chip">{skill}</span>
                                    ))}
                                </div>

                                <p className="job-desc">
                                    {job.description?.slice(0, 180)}
                                    {job.description?.length > 180 ? "..." : ""}
                                </p>

                                <div className="job-meta">
                                    <span className="views-count">
                                        <FiEye />
                                        {job.views || 0} views
                                    </span>
                                    <div>{timeAgo(job.createdAt)}</div>
                                    {job._source === "service_24h" && <div>⏱ 24 Hours</div>}
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </main>

            {/* FAB */}
            <button className="fh-fab" onClick={() => navigate("/client-dashbroad2/PostJob")}>
                <FiPlus />
            </button>
        </div>

        {/* ================= NOTIFICATION POPUP ================= */}
        {notifOpen && (
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.3)",
                    backdropFilter: "blur(3px)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 9999,
                }}
                onClick={(e) => {
                    if (e.target === e.currentTarget) setNotifOpen(false);
                }}
            >
                <div
                    style={{
                        width: "90%",
                        maxWidth: 420,
                        background: "#fff",
                        padding: 20,
                        borderRadius: 16,
                        maxHeight: "80vh",
                        overflowY: "auto",
                    }}
                >
                    <h3 style={{ marginBottom: 15 }}>Notifications</h3>

                    {notifications.length === 0 && (
                        <div style={{ padding: 20, textAlign: "center" }}>
                            No notifications
                        </div>
                    )}

                    {notifications.map((item, i) => (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: 15,
                                background: "#f7f7f7",
                                padding: 10,
                                borderRadius: 10,
                            }}
                        >
                            <img
                                src={item.freelancerImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                                width={48}
                                height={48}
                                style={{ borderRadius: "50%", marginRight: 10 }}
                            />

                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600 }}>{item.freelancerName}</div>
                                <div>applied for {item.jobTitle}</div>
                            </div>

                            {!item.read ? (
                                <>
                                    <button
                                        onClick={() => acceptNotif(item)}
                                        style={{ marginRight: 8 }}
                                    >
                                        Accept
                                    </button>
                                    <button onClick={() => declineNotif(item)}>Decline</button>
                                </>
                            ) : (
                                <button onClick={() => acceptNotif(item)}>Chat</button>
                            )}
                        </div>
                    ))}

                    <button
                        style={{
                            marginTop: 10,
                            width: "100%",
                            padding: 10,
                            borderRadius: 10,
                            background: "#000",
                            color: "#fff",
                        }}
                        onClick={() => setNotifOpen(false)}
                    >
                        Close
                    </button>
                </div>
            </div>
        )}

        {/* ================= CATEGORY CSS ================= */}
        <style>{`
        .category-scroll-wrapper {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding: 12px 4px;
          white-space: nowrap;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .category-scroll-wrapper::-webkit-scrollbar {
          display: none;
        }
        .category-card {
          flex: 0 0 auto;
          background: linear-gradient(135deg, #6a11cb, #2575fc);
          color: white;
          padding: 36px 20px;
          border-radius: 15px;
          font-size: 14px;
          font-weight: 600;
          min-width: 160px;
          text-align: center;
          user-select: none;
          cursor: pointer;
        }
        @media (max-width: 768px) {
          .category-card {
            min-width: 140px;
            font-size: 13px;
          }
        }
          /* ================= HEADER RIGHT ICONS ================= */

.fh-header-right {
  display: flex;
  align-items: center;
  gap: 16px; /* spacing between 3 icons */
  position: relative;
}

/* ICON BUTTONS */
.icon-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  background: #f3f3f3;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  font-size: 20px;
}

.icon-btn:hover {
  background: #e5e5e5;
}

/* NOTIFICATION DOT */
.notif-btn {
  position: relative;
}

.notif-dot {
  width: 8px;
  height: 8px;
  background: red;
  border-radius: 50%;
  position: absolute;
  top: 8px;
  right: 8px;
}

/* PROFILE AVATAR */
.fh-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
 
}

.fh-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

        `}</style>

    </div>
);

}

