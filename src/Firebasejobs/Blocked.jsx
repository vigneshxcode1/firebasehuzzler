// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";

// // Firebase (assume already initialized elsewhere)
// import { getAuth, signOut } from "firebase/auth";
// import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
// import {
//   getStorage,
//   ref as storageRef,
//   uploadBytes,
//   getDownloadURL,
// } from "firebase/storage";

// // Icons
// import { FiChevronRight, FiEdit } from "react-icons/fi";

// // ================================
// // MAIN COMPONENT
// // ================================
// export default function ProfileMenuScreen({ uid }) {
//   const auth = getAuth();
//   const db = getFirestore();
//   const storage = getStorage();
//   const navigate = useNavigate();

//   const fileInputRef = useRef(null);

//   const [userData, setUserData] = useState(null);
//   const [profileImageUrl, setProfileImageUrl] = useState("");
//   const [isUploading, setIsUploading] = useState(false);
//   const [showLogoutDialog, setShowLogoutDialog] = useState(false);

//   // ================================
//   // FETCH USER DATA
//   // ================================
//   useEffect(() => {
//     if (!uid) return;

//     async function fetchUser() {
//       const snap = await getDoc(doc(db, "users", uid));
//       if (snap.exists()) {
//         const data = snap.data();
//         setUserData(data);
//         setProfileImageUrl(
//           data.profileImage || data.profile_image || ""
//         );
//       }
//     }

//     fetchUser();
//   }, [uid, db]);

//   // ================================
//   // PICK & UPLOAD IMAGE
//   // ================================
//   const handlePickImage = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     try {
//       setIsUploading(true);

//       const imgRef = storageRef(storage, `users/${uid}/profile.jpg`);
//       await uploadBytes(imgRef, file);
//       const url = await getDownloadURL(imgRef);

//       await updateDoc(doc(db, "users", uid), {
//         profile_image: url,
//       });

//       setProfileImageUrl(url);
//       alert("✅ Profile updated successfully");
//     } catch (err) {
//       alert("⚠️ Error uploading image");
//       console.error(err);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   // ================================
//   // LOGOUT
//   // ================================
//   const handleLogout = async () => {
//     await signOut(auth);
//     navigate("/login", { replace: true });
//   };

//   if (!userData) {
//     return (
//       <div style={styles.loader}>
//         <span>Loading...</span>
//       </div>
//     );
//   }

//   const fullName =
//     `${userData.first_name || userData.firstName || ""} ${
//       userData.last_name || userData.lastName || ""
//     }`.trim() || "User";

//   // ================================
//   // RENDER
//   // ================================
//   return (
//     <div style={styles.container}>
//       {/* HEADER */}
//       <div style={styles.header}>
//         <div style={styles.avatarWrapper}>
//           <img
//             src={
//               profileImageUrl ||
//               "/assets/profile.png"
//             }
//             alt="profile"
//             style={styles.avatar}
//           />

//           <button
//             style={styles.editBtn}
//             disabled={isUploading}
//             onClick={() => fileInputRef.current.click()}
//           >
//             <FiEdit size={14} />
//           </button>

//           {isUploading && <div style={styles.overlay}>Uploading...</div>}

//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="image/*"
//             hidden
//             onChange={handlePickImage}
//           />
//         </div>

//         <div style={styles.name}>{fullName}</div>
//       </div>

//       {/* MY ACCOUNT */}
//       <Section title="My Account" />
//       <MenuItem title="Profile Summary" onClick={() => navigate("/edit-profile")} />
//       <MenuItem title="Saved" onClick={() => navigate("/saved")} />
//       <MenuItem title="My Services" onClick={() => navigate("/my-services")} />
//       <MenuItem title="My Works" onClick={() => navigate("/my-works")} />
//       <MenuItem
//         title="Invite Friends"
//         onClick={() =>
//           navigator.share
//             ? navigator.share({ text: "Check out this awesome app!" })
//             : alert("Sharing not supported")
//         }
//       />

//       {/* SETTINGS */}
//       <Section title="Settings" />
//       <MenuItem
//         title="Notifications"
//         onClick={() => window.open("about:preferences", "_blank")}
//       />
//       <MenuItem
//         title="Account Settings"
//         onClick={() => navigate("/account-settings")}
//       />
//       <MenuItem
//         title="Blocked Users"
//         onClick={() => navigate("/blocked-users")}
//       />
//       <MenuItem
//         title="Help Center"
//         onClick={() =>
//           window.open(
//             "https://huzzlerhelpcenter.onrender.com/",
//             "_blank"
//           )
//         }
//       />

//       {/* LOGOUT */}
//       <div style={styles.logout} onClick={() => setShowLogoutDialog(true)}>
//         Log Out
//       </div>

//       {/* LOGOUT CONFIRM DIALOG */}
//       {showLogoutDialog && (
//         <div style={styles.dialogBackdrop}>
//           <div style={styles.dialog}>
//             <p style={{ textAlign: "center" }}>
//               Are you sure you want to log out of your account?
//             </p>

//             <button style={styles.logoutBtn} onClick={handleLogout}>
//               Logout
//             </button>

//             <button
//               style={styles.cancelBtn}
//               onClick={() => setShowLogoutDialog(false)}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ================================
// // SUB COMPONENTS
// // ================================
// function Section({ title }) {
//   return <div style={styles.section}>{title}</div>;
// }

// function MenuItem({ title, onClick }) {
//   return (
//     <div style={styles.menuItem} onClick={onClick}>
//       <span>{title}</span>
//       <FiChevronRight size={16} color="#999" />
//     </div>
//   );
// }

// // ================================
// // STYLES
// // ================================
// const styles = {
//   container: {
//     maxWidth: 420,
//     margin: "0 auto",
//     background: "#fff",
//     minHeight: "100vh",
//     fontFamily: "Inter, sans-serif",
//   },
//   loader: {
//     height: "100vh",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   header: {
//     display: "flex",
//     alignItems: "center",
//     padding: 16,
//     gap: 12,
//   },
//   avatarWrapper: {
//     position: "relative",
//     width: 72,
//     height: 72,
//   },
//   avatar: {
//     width: 72,
//     height: 72,
//     borderRadius: "50%",
//     objectFit: "cover",
//     background: "#eee",
//   },
//   editBtn: {
//     position: "absolute",
//     bottom: 0,
//     right: 0,
//     borderRadius: "50%",
//     border: "none",
//     padding: 6,
//     cursor: "pointer",
//     background: "#fff",
//   },
//   overlay: {
//     position: "absolute",
//     inset: 0,
//     background: "rgba(0,0,0,0.4)",
//     color: "#fff",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: "50%",
//     fontSize: 12,
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: 500,
//   },
//   section: {
//     padding: "20px 16px 10px",
//     fontWeight: 500,
//     fontSize: 18,
//   },
//   menuItem: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "14px 16px",
//     borderBottom: "1px solid #eee",
//     cursor: "pointer",
//     fontSize: 15,
//   },
//   logout: {
//     padding: 16,
//     color: "red",
//     fontWeight: 500,
//     cursor: "pointer",
//   },
//   dialogBackdrop: {
//     position: "fixed",
//     inset: 0,
//     background: "rgba(0,0,0,0.4)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   dialog: {
//     background: "#fff",
//     padding: 24,
//     borderRadius: 20,
//     width: 300,
//   },
//   logoutBtn: {
//     width: "100%",
//     padding: 12,
//     background: "#FDFD96",
//     border: "none",
//     borderRadius: 24,
//     marginTop: 16,
//     cursor: "pointer",
//   },
//   cancelBtn: {
//     width: "100%",
//     padding: 12,
//     marginTop: 10,
//     borderRadius: 24,
//     border: "1.5px solid #000",
//     background: "#fff",
//     cursor: "pointer",
//   },
// };







// import React, { useEffect, useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";

// // ===== Firebase (assume initialized) =====
// import { getAuth } from "firebase/auth";
// import {
//   getFirestore,
//   doc,
//   getDoc,
//   onSnapshot,
//   collection,
//   query,
//   where,
//   getDocs,
//   addDoc,
//   deleteDoc,
//   updateDoc,
//   serverTimestamp,
// } from "firebase/firestore";

// // ===== Icons =====
// import {
//   FiArrowLeft,
//   FiShare2,
//   FiFlag,
//   FiMoreHorizontal,
// } from "react-icons/fi";

// /* ======================================================
//    MAIN COMPONENT
// ====================================================== */
// export default function ClientFullDetailScreen({ userId, jobId }) {
//   const auth = getAuth();
//   const db = getFirestore();
//   const navigate = useNavigate();

//   const currentUid = auth.currentUser?.uid;

//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isRequested, setIsRequested] = useState(false);
//   const [isAccepted, setIsAccepted] = useState(false);
//   const [activeTab, setActiveTab] = useState("work");

//   /* ================= FETCH PROFILE ================= */
//   useEffect(() => {
//     if (!userId) return;

//     const unsub = onSnapshot(doc(db, "users", userId), (snap) => {
//       if (snap.exists()) {
//         setProfile(snap.data());
//       }
//       setLoading(false);
//     });

//     return () => unsub();
//   }, [db, userId]);

//   /* ================= CHECK REQUEST ================= */
//   useEffect(() => {
//     if (!currentUid || !userId) return;

//     async function checkRequest() {
//       const q = query(
//         collection(db, "collaboration_requests"),
//         where("clientId", "==", currentUid),
//         where("freelancerId", "==", userId),
//         where("status", "==", "sent")
//       );

//       const snap = await getDocs(q);
//       if (!snap.empty) setIsRequested(true);
//     }

//     checkRequest();
//   }, [db, currentUid, userId]);

//   /* ================= CHECK ACCEPTED ================= */
//   useEffect(() => {
//     if (!currentUid || !userId || !jobId) return;

//     async function checkAccepted() {
//       const q = query(
//         collection(db, "accepted_jobs"),
//         where("clientId", "==", currentUid),
//         where("freelancerId", "==", userId),
//         where("jobId", "==", jobId)
//       );

//       const snap = await getDocs(q);
//       if (!snap.empty) setIsAccepted(true);
//     }

//     checkAccepted();
//   }, [db, currentUid, userId, jobId]);

//   /* ================= ACTIONS ================= */
//   const shareProfile = async () => {
//     const name = `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`;
//     const link = profile?.linkedin || "";

//     if (navigator.share) {
//       await navigator.share({
//         title: name,
//         text: `Check out ${name}'s profile`,
//         url: link || window.location.href,
//       });
//     } else {
//       alert("Sharing not supported");
//     }
//   };

//   const sendRequest = async () => {
//     if (!currentUid) return alert("Login required");

//     await addDoc(collection(db, "collaboration_requests"), {
//       clientId: currentUid,
//       freelancerId: userId,
//       jobId: jobId || null,
//       status: "sent",
//       timestamp: serverTimestamp(),
//     });

//     setIsRequested(true);
//     alert("Request sent successfully");
//   };

//   const blockUser = async () => {
//     if (!currentUid) return;

//     await addDoc(collection(db, "blocked_users"), {
//       blockedBy: currentUid,
//       blockedUserId: userId,
//       blockedAt: serverTimestamp(),
//     });

//     alert("User blocked");
//     navigate("/");
//   };

//   if (loading) {
//     return <div style={styles.center}>Loading...</div>;
//   }

//   if (!profile) {
//     return <div style={styles.center}>Profile not found</div>;
//   }

//   const fullName =
//     `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "User";

//   /* ================= UI ================= */
//   return (
//     <div style={styles.page}>
//       {/* HEADER */}
//       <div style={styles.header}>
//         <button onClick={() => navigate(-1)} style={styles.iconBtn}>
//           <FiArrowLeft />
//         </button>

//         <div>
//           <button onClick={blockUser} style={styles.iconBtn}>
//             <FiFlag />
//           </button>
//           <button onClick={shareProfile} style={styles.iconBtn}>
//             <FiShare2 />
//           </button>
//         </div>
//       </div>

//       {/* PROFILE CARD */}
//       <div style={styles.card}>
//         <img
//           src={profile.profileImage || "/assets/profile.png"}
//           alt="profile"
//           style={styles.avatar}
//         />

//         <h3>{fullName}</h3>
//         <p style={styles.subtitle}>
//           {profile.sector || "No Title"} · {profile.location || "India"}
//         </p>

//         {/* ACTION BUTTON */}
//         {isAccepted ? (
//           <button style={styles.primary}>Message</button>
//         ) : isRequested ? (
//           <button style={styles.disabled}>Requested</button>
//         ) : (
//           <button style={styles.primary} onClick={sendRequest}>
//             Connect
//           </button>
//         )}
//       </div>

//       {/* ABOUT */}
//       <Section title="About">
//         <p>{profile.about || "No description available"}</p>
//       </Section>

//       <Section title="Industry">{profile.sector}</Section>
//       <Section title="Category">{profile.category}</Section>
//       <Section title="Company Size">{profile.team_size}</Section>
//       <Section title="Email">{profile.email}</Section>

//       {/* SERVICES */}
//       <div style={styles.tabs}>
//         <button
//           onClick={() => setActiveTab("work")}
//           style={activeTab === "work" ? styles.tabActive : styles.tab}
//         >
//           Work
//         </button>
//         <button
//           onClick={() => setActiveTab("24h")}
//           style={activeTab === "24h" ? styles.tabActive : styles.tab}
//         >
//           24 Hour
//         </button>
//       </div>

//       {activeTab === "work" ? (
//         <ServicesList uid={userId} collectionName="jobs" />
//       ) : (
//         <ServicesList uid={userId} collectionName="jobs_24h" />
//       )}
//     </div>
//   );
// }

// /* ======================================================
//    SERVICES LIST
// ====================================================== */
// function ServicesList({ uid, collectionName }) {
//   const db = getFirestore();
//   const [items, setItems] = useState([]);

//   useEffect(() => {
//     const q = query(
//       collection(db, collectionName),
//       where("userId", "==", uid)
//     );

//     const unsub = onSnapshot(q, (snap) => {
//       setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//     });

//     return () => unsub();
//   }, [db, uid, collectionName]);

//   if (items.length === 0) {
//     return <div style={styles.center}>No services available</div>;
//   }

//   return (
//     <div>
//       {items.map((job) => (
//         <div key={job.id} style={styles.jobCard}>
//           <div style={styles.jobHeader}>
//             <h4>{job.title}</h4>
//             <FiMoreHorizontal />
//           </div>

//           <p style={styles.price}>
//             ₹ {job.budget_from || job.budget || 0}
//           </p>

//           <p style={styles.desc}>{job.description}</p>

//           <div style={styles.chips}>
//             {[...(job.skills || []), ...(job.tools || [])]
//               .slice(0, 3)
//               .map((s, i) => (
//                 <span key={i} style={styles.chip}>
//                   {s}
//                 </span>
//               ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// /* ======================================================
//    HELPERS
// ====================================================== */
// function Section({ title, children }) {
//   return (
//     <div style={styles.section}>
//       <h4>{title}</h4>
//       {children}
//     </div>
//   );
// }

// /* ======================================================
//    STYLES
// ====================================================== */
// const styles = {
//   page: {
//     maxWidth: 420,
//     margin: "0 auto",
//     fontFamily: "Inter, sans-serif",
//     background: "#f6f6f6",
//     minHeight: "100vh",
//   },
//   center: {
//     padding: 40,
//     textAlign: "center",
//   },
//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     padding: 16,
//   },
//   iconBtn: {
//     background: "rgba(0,0,0,0.3)",
//     border: "none",
//     borderRadius: "50%",
//     padding: 8,
//     color: "#fff",
//     marginLeft: 6,
//     cursor: "pointer",
//   },
//   card: {
//     background: "#fff",
//     margin: 16,
//     padding: 16,
//     borderRadius: 16,
//     textAlign: "center",
//   },
//   avatar: {
//     width: 80,
//     height: 80,
//     borderRadius: 12,
//     objectFit: "cover",
//   },
//   subtitle: {
//     color: "#666",
//     fontSize: 13,
//   },
//   primary: {
//     background: "#FDFD96",
//     border: "none",
//     padding: "10px 24px",
//     borderRadius: 24,
//     fontWeight: 600,
//     cursor: "pointer",
//   },
//   disabled: {
//     background: "#ddd",
//     border: "none",
//     padding: "10px 24px",
//     borderRadius: 24,
//   },
//   section: {
//     background: "#fff",
//     margin: "12px 16px",
//     padding: 16,
//     borderRadius: 16,
//   },
//   tabs: {
//     display: "flex",
//     justifyContent: "center",
//     marginTop: 16,
//   },
//   tab: {
//     padding: "10px 20px",
//     border: "none",
//     background: "transparent",
//     cursor: "pointer",
//   },
//   tabActive: {
//     padding: "10px 20px",
//     borderBottom: "3px solid black",
//     fontWeight: 600,
//     background: "transparent",
//     cursor: "pointer",
//   },
//   jobCard: {
//     background: "#fff",
//     margin: "12px 16px",
//     padding: 16,
//     borderRadius: 16,
//   },
//   jobHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//   },
//   price: {
//     fontWeight: 600,
//     marginTop: 6,
//   },
//   desc: {
//     fontSize: 13,
//     marginTop: 6,
//   },
//   chips: {
//     display: "flex",
//     gap: 6,
//     marginTop: 10,
//   },
//   chip: {
//     background: "#FFF7C2",
//     padding: "4px 10px",
//     borderRadius: 14,
//     fontSize: 12,
//   },
// };











// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// // Firebase
// import { getAuth } from "firebase/auth";
// import {
//   getFirestore,
//   collection,
//   query,
//   where,
//   onSnapshot,
//   doc,
//   getDoc,
//   deleteDoc,
// } from "firebase/firestore";

// // Icons
// import { FiArrowLeft, FiTrash2 } from "react-icons/fi";

// export default function BlockedList() {
//   const auth = getAuth();
//   const db = getFirestore();
//   const navigate = useNavigate();

//   const currentUid = auth.currentUser?.uid;

//   const [blockedUsers, setBlockedUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   /* ================= FETCH BLOCKED USERS ================= */
//   useEffect(() => {
//     // 🔥 VERY IMPORTANT
//     if (!currentUid) {
//       setLoading(false);
//       return;
//     }

//     const q = query(
//       collection(db, "blocked_users"),
//       where("blockedBy", "==", currentUid) // ✅ CORRECT
//     );

//     const unsub = onSnapshot(
//       q,
//       async (snap) => {
//         if (snap.empty) {
//           setBlockedUsers([]);
//           setLoading(false);
//           return;
//         }

//         // 🔥 Fetch user profiles
//         const users = await Promise.all(
//           snap.docs.map(async (d) => {
//             const data = d.data();
//             const userDoc = await getDoc(
//               doc(db, "users", data.blockedUserId)
//             );

//             return {
//               id: d.id,
//               blockedUserId: data.blockedUserId,
//               ...(userDoc.exists() ? userDoc.data() : {}),
//             };
//           })
//         );

//         setBlockedUsers(users);
//         setLoading(false);
//       },
//       (err) => {
//         console.error("Blocked list error:", err);
//         setLoading(false);
//       }
//     );

//     return () => unsub();
//   }, [db, currentUid]);

//   /* ================= UNBLOCK ================= */
//   const unblockUser = async (docId) => {
//     if (!window.confirm("Unblock this user?")) return;

//     await deleteDoc(doc(db, "blocked_users", docId));
//   };

//   /* ================= UI ================= */
//   if (loading) {
//     return <div style={styles.center}>Loading blocked users…</div>;
//   }

//   return (
//     <div style={styles.page}>
//       {/* HEADER */}
//       <div style={styles.header}>
//         <button onClick={() => navigate(-1)} style={styles.iconBtn}>
//           <FiArrowLeft />
//         </button>
//         <h3>Blocked Users</h3>
//       </div>

//       {/* EMPTY */}
//       {blockedUsers.length === 0 && (
//         <div style={styles.center}>No blocked users</div>
//       )}

//       {/* LIST */}
//       {blockedUsers.map((u) => (
//         <div key={u.id} style={styles.card}>
//           <img
//             src={u.profileImage || "/assets/profile.png"}
//             alt="profile"
//             style={styles.avatar}
//           />

//           <div style={{ flex: 1 }}>
//             <h4>
//               {`${u.first_name || ""} ${u.last_name || ""}`.trim() || "User"}
//             </h4>
//             <p style={styles.sub}>{u.sector || "No title"}</p>
//           </div>

//           <button
//             onClick={() => unblockUser(u.id)}
//             style={styles.unblockBtn}
//           >
//             <FiTrash2 />
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }

// /* ================= STYLES ================= */
// const styles = {
//   page: {
//     maxWidth: 420,
//     margin: "0 auto",
//     minHeight: "100vh",
//     background: "#f6f6f6",
//   },
//   center: {
//     padding: 40,
//     textAlign: "center",
//     color: "#666",
//   },
//   header: {
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//     padding: 16,
//   },
//   iconBtn: {
//     background: "rgba(0,0,0,0.3)",
//     border: "none",
//     borderRadius: "50%",
//     padding: 8,
//     color: "#fff",
//     cursor: "pointer",
//   },
//   card: {
//     background: "#fff",
//     margin: "10px 16px",
//     padding: 12,
//     borderRadius: 14,
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//   },
//   avatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 10,
//     objectFit: "cover",
//   },
//   sub: {
//     fontSize: 12,
//     color: "#666",
//   },
//   unblockBtn: {
//     background: "#FFE5E5",
//     border: "none",
//     padding: 8,
//     borderRadius: 10,
//     cursor: "pointer",
//   },
// };


// import React, { useEffect, useState } from "react";
// import {
//   collection,
//   query,
//   where,
//   onSnapshot,
//   deleteDoc,
//   doc,
// } from "firebase/firestore";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { db } from "../firbase/Firebase";
// import { ArrowLeft, User, X } from "lucide-react";

// /* ======================================================
//    CLIENT BLOCKED USERS SCREEN – FINAL STABLE VERSION
// ====================================================== */

// export default function ClientBlockedUsersScreen() {
//   const auth = getAuth();

//   const [currentUser, setCurrentUser] = useState(null);
//   const [blockedUsers, setBlockedUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [showDialog, setShowDialog] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);

//   /* ================= AUTH ================= */
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (user) => {
//       if (!user) {
//         window.location.href = "/firelogin";
//         return;
//       }
//       setCurrentUser(user);
//     });

//     return () => unsub();
//   }, [auth]);

//   /* ================= FETCH BLOCKED USERS ================= */
//   useEffect(() => {
//     if (!currentUser) return;

//     const q = query(
//       collection(db, "blocked_users"),
//       where("blockedBy", "==", currentUser.uid)
//     );

//     const unsub = onSnapshot(
//       q,
//       (snap) => {
//         const list = snap.docs.map((d) => ({
//           id: d.id,
//           ...d.data(),
//         }));
//         setBlockedUsers(list);
//         setLoading(false);
//       },
//       (err) => {
//         console.error(err);
//         setError("Failed to load blocked users");
//         setLoading(false);
//       }
//     );

//     return () => unsub();
//   }, [currentUser]);

//   /* ================= UNBLOCK ================= */
//   const unblockUser = async () => {
//     if (!selectedUser) return;

//     try {
//       await deleteDoc(doc(db, "blocked_users", selectedUser.id));
//       showToast("User unblocked", "success");
//       setShowDialog(false);
//       setSelectedUser(null);
//     } catch (err) {
//       console.error(err);
//       showToast("Failed to unblock user", "error");
//     }
//   };

//   /* ================= TOAST ================= */
//   const showToast = (msg, type = "info") => {
//     const toast = document.createElement("div");
//     toast.innerText = msg;

//     toast.style.position = "fixed";
//     toast.style.bottom = "20px";
//     toast.style.right = "20px";
//     toast.style.padding = "12px 20px";
//     toast.style.color = "#fff";
//     toast.style.borderRadius = "10px";
//     toast.style.zIndex = 9999;
//     toast.style.fontWeight = 600;

//     toast.style.background =
//       type === "success"
//         ? "#16a34a"
//         : type === "error"
//         ? "#dc2626"
//         : "#6b7280";

//     document.body.appendChild(toast);
//     setTimeout(() => toast.remove(), 3000);
//   };

//   /* ================= UI STATES ================= */
//   if (loading) {
//     return (
//       <div style={styles.center}>
//         <div style={styles.spinner}></div>
//         <p>Loading blocked users…</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={styles.center}>
//         <p style={{ color: "red" }}>{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.container}>
//       {/* HEADER */}
//       <div style={styles.header}>
//         <button onClick={() => window.history.back()} style={styles.backBtn}>
//           <ArrowLeft />
//         </button>
//         <h2>Blocked Accounts</h2>
//         <div style={{ width: 40 }} />
//       </div>

//       {/* LIST */}
//       {blockedUsers.length === 0 ? (
//         <div style={styles.empty}>
//           <User size={50} color="#9ca3af" />
//           <p>No blocked users</p>
//         </div>
//       ) : (
//         blockedUsers.map((u) => (
//           <div key={u.id} style={styles.row}>
//             {u.blockedUserImage ? (
//               <img src={u.blockedUserImage} alt="" style={styles.avatar} />
//             ) : (
//               <div style={styles.avatarFallback}>
//                 <User color="#fff" />
//               </div>
//             )}

//             <div style={{ flex: 1, fontWeight: 600 }}>
//               {u.blockedUserName || "Unknown User"}
//             </div>

//             <button
//               style={styles.unblockBtn}
//               onClick={() => {
//                 setSelectedUser(u);
//                 setShowDialog(true);
//               }}
//             >
//               Unblock
//             </button>
//           </div>
//         ))
//       )}

//       {/* DIALOG */}
//       {showDialog && (
//         <div style={styles.overlay} onClick={() => setShowDialog(false)}>
//           <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
//             <button
//               style={styles.close}
//               onClick={() => setShowDialog(false)}
//             >
//               <X />
//             </button>

//             <h3>Unblock {selectedUser?.blockedUserName}?</h3>
//             <p>This user will be able to contact you again.</p>

//             <div style={{ display: "flex", gap: 12 }}>
//               <button
//                 style={styles.cancelBtn}
//                 onClick={() => setShowDialog(false)}
//               >
//                 Cancel
//               </button>
//               <button style={styles.confirmBtn} onClick={unblockUser}>
//                 Unblock
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ================= STYLES ================= */
// const styles = {
//   container: { minHeight: "100vh", background: "#fff" },

//   header: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: 16,
//     borderBottom: "1px solid #eee",
//   },

//   backBtn: {
//     border: "none",
//     background: "none",
//     cursor: "pointer",
//   },

//   row: {
//     display: "flex",
//     alignItems: "center",
//     padding: 14,
//     borderBottom: "1px solid #f1f1f1",
//   },

//   avatar: {
//     width: 44,
//     height: 44,
//     borderRadius: "50%",
//     marginRight: 12,
//     objectFit: "cover",
//   },

//   avatarFallback: {
//     width: 44,
//     height: 44,
//     borderRadius: "50%",
//     background: "#9ca3af",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },

//   unblockBtn: {
//     background: "#7C3CFF",
//     color: "#fff",
//     border: "none",
//     borderRadius: 20,
//     padding: "8px 18px",
//     cursor: "pointer",
//     fontWeight: 600,
//   },

//   empty: {
//     textAlign: "center",
//     marginTop: 80,
//     color: "#6b7280",
//   },

//   center: {
//     minHeight: "100vh",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   spinner: {
//     width: 40,
//     height: 40,
//     border: "4px solid #eee",
//     borderTop: "4px solid #7C3CFF",
//     borderRadius: "50%",
//     animation: "spin 1s linear infinite",
//   },

//   overlay: {
//     position: "fixed",
//     inset: 0,
//     background: "rgba(0,0,0,0.5)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 999,
//   },

//   dialog: {
//     background: "#fff",
//     padding: 24,
//     borderRadius: 20,
//     width: "90%",
//     maxWidth: 400,
//     position: "relative",
//   },

//   close: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     border: "none",
//     background: "none",
//     cursor: "pointer",
//   },

//   cancelBtn: {
//     flex: 1,
//     padding: 12,
//     borderRadius: 30,
//     border: "2px solid #999",
//     background: "#fff",
//     fontWeight: 700,
//     cursor: "pointer",
//   },

//   confirmBtn: {
//     flex: 1,
//     padding: 12,
//     borderRadius: 30,
//     border: "none",
//     background: "#7C3CFF",
//     color: "#fff",
//     fontWeight: 700,
//     cursor: "pointer",
//   },
// };




import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Button,
  IconButton,
  CircularProgress,
  Dialog,
  DialogContent,
  AppBar,
  Toolbar,
  List,
  ListItem,
  Snackbar,
  Alert
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firbase/Firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const BlockedUsersScreen = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unblockDialog, setUnblockDialog] = useState({
    open: false,
    docId: null,
    name: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch blocked users with real-time updates
  useEffect(() => {
    if (!currentUser) return;

    setIsLoading(true);
    const q = query(
      collection(db, 'blocked_users'),
      where('blockedBy', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const users = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBlockedUsers(users);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching blocked users:', err);
        setError(err.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const handleUnblock = async () => {
    if (!unblockDialog.docId) return;

    try {
      await deleteDoc(doc(db, 'blocked_users', unblockDialog.docId));
      
      setSnackbar({
        open: true,
        message: 'User unblocked',
        severity: 'success'
      });
      
      setUnblockDialog({ open: false, docId: null, name: '' });
    } catch (error) {
      console.error('Error unblocking user:', error);
      setSnackbar({
        open: true,
        message: 'Failed to unblock user',
        severity: 'error'
      });
    }
  };

  const openUnblockDialog = (docId, name) => {
    setUnblockDialog({ open: true, docId, name });
  };

  const closeUnblockDialog = () => {
    setUnblockDialog({ open: false, docId: null, name: '' });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">Error: {error}</Alert>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>Go Back</Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: 'white',
          color: 'black'
        }}
      >
        <Toolbar>
          <IconButton 
            edge="start" 
            onClick={() => navigate(-1)}
            sx={{ color: 'black' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            sx={{ 
              flexGrow: 1, 
              textAlign: 'center',
              fontWeight: 500,
              fontSize: 22
            }}
          >
            Blocked Accounts
          </Typography>
          <Box sx={{ width: 40 }} /> {/* Spacer for centering */}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ py: 2 }}>
        {blockedUsers.length === 0 ? (
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            minHeight="60vh"
          >
            <Typography variant="h6" color="text.secondary">
              No blocked accounts
            </Typography>
          </Box>
        ) : (
          <List sx={{ px: 0 }}>
            {blockedUsers.map((user) => (
              <BlockedUserRow
                key={user.id}
                docId={user.id}
                name={user.blockedUserName || 'Unknown'}
                image={user.blockedUserImage || ''}
                onUnblock={openUnblockDialog}
              />
            ))}
          </List>
        )}
      </Container>

      {/* Unblock Confirmation Dialog */}
      <Dialog 
        open={unblockDialog.open} 
        onClose={closeUnblockDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 5,
            p: 1
          }
        }}
      >
        <DialogContent sx={{ px: 3, py: 4 }}>
          <Typography 
            variant="h6" 
            align="center" 
            gutterBottom
            sx={{ fontWeight: 600, mb: 2 }}
          >
            Unblock {unblockDialog.name}?
          </Typography>

          <Typography 
            variant="body2" 
            align="center" 
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Unblocking will allow this profile to reach out to you again.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={closeUnblockDialog}
              sx={{
                py: 1.5,
                borderWidth: 2,
                borderColor: 'rgba(0,0,0,0.4)',
                color: 'black',
                fontWeight: 700,
                borderRadius: 8,
                '&:hover': {
                  borderWidth: 2,
                  borderColor: 'rgba(0,0,0,0.6)'
                }
              }}
            >
              Cancel
            </Button>

            <Button
              fullWidth
              variant="contained"
              onClick={handleUnblock}
              sx={{
                py: 1.5,
                bgcolor: '#7C3CFF',
                fontWeight: 700,
                borderRadius: 8,
                '&:hover': {
                  bgcolor: '#6A2EE6'
                }
              }}
            >
              Unblock
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Blocked User Row Component
const BlockedUserRow = ({ docId, name, image, onUnblock }) => {
  return (
    <ListItem
      sx={{
        px: 2,
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}
    >
      {/* Profile Image */}
      <Avatar
        src={image || undefined}
        sx={{
          width: 44,
          height: 44,
          bgcolor: 'grey.300'
        }}
      >
        {!image && <PersonIcon />}
      </Avatar>

      {/* Name */}
      <Typography 
        variant="body1" 
        sx={{ 
          flexGrow: 1,
          fontWeight: 600,
          fontSize: 18
        }}
      >
        {name}
      </Typography>

      {/* Unblock Button */}
      <Button
        onClick={() => onUnblock(docId, name)}
        sx={{
          bgcolor: '#7C3CFF',
          color: 'white',
          px: 3,
          py: 1,
          borderRadius: 5,
          fontWeight: 500,
          fontSize: 15,
          textTransform: 'none',
          '&:hover': {
            bgcolor: '#6A2EE6'
          }
        }}
      >
        Unblock
      </Button>
    </ListItem>
  );
};

export default BlockedUsersScreen;