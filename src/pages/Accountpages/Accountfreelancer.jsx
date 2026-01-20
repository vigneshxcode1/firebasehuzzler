
// // ClientProfileMenuScreen.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc, updateDoc, getFirestore } from "firebase/firestore";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// // assets
// import arrow from "../../assets/icons/arrow.png";
// import backarrow from "../../assets/icons/backarrow.png";
// import profilePlaceholder from "../../assets/icons/profile.png";
// import notification from "../../assets/kk.png";
// import MyServices from "../../assets/icons/MyServices.png";
// import pause from "../../assets/icons/paused.png";
// import invite from "../../assets/icons/invite.png";
// import settings from "../../assets/icons/settings.png";
// import helpcenter from "../../assets/icons/helpcenter.png";
// import editIcon from "../../assets/edit.png";
// import logoutIcon from "../../assets/icons/logout.png";
// import MyJobs from "../../assets/icons/myjobs.png";
// import Logout from "../../assets/icons/logout.png";

// export default function ClientProfileMenuScreen() {
//   const auth = getAuth();
//   const db = getFirestore();
//   const storage = getStorage();
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [profileImage, setProfileImage] = useState("");
//   const [isUploading, setUploading] = useState(false);

//   // 🔹 RESPONSIVE FLAG
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   useEffect(() => {
//     const resize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", resize);
//     return () => window.removeEventListener("resize", resize);
//   }, []);

//   // ⭐ SIDEBAR COLLAPSE
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) return navigate("/firelogin");

//       const snap = await getDoc(doc(db, "users", currentUser.uid));
//       if (snap.exists()) {
//         setUser(snap.data());
//         setProfileImage(snap.data().profileImage || "");
//       }
//     });
//     return () => unsub();
//   }, []);

//   const handleImageUpload = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setUploading(true);

//     try {
//       const uid = auth.currentUser.uid;
//       const imageRef = ref(storage, `users/${uid}/profile.jpg`);
//       await uploadBytes(imageRef, file);
//       const url = await getDownloadURL(imageRef);
//       await updateDoc(doc(db, "users", uid), { profileImage: url });
//       setProfileImage(url);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleLogout = async () => {
//     if (!window.confirm("Logout?")) return;
//     await signOut(auth);
//     navigate("/firelogin");
//   };

//   if (!user) return null;

//   const fullName =
//     `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Helen Angel";

//   return (
//     <div
//       style={{
//         marginLeft: isMobile ? "0px" : collapsed ? "-160px" : "100px",
//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       <div style={pageStyles.page}>
//         {/* HEADER */}
//         <div
//           style={{
//             ...pageStyles.titleWrap,
//             flexWrap: "wrap",
//           }}
//         >
//           <div
//             style={{
//               ...pageStyles.backBtn,
//               marginLeft: isMobile ? "0px" : "-60px",
//             }}
//             onClick={() => navigate(-1)}
//           >
//             <img src={backarrow} alt="back" width={20} />
//           </div>

//           <div style={{ marginLeft: 12 }}>
//             <h1 style={pageStyles.title}>Profile</h1>
//             <p style={pageStyles.subtitle}>
//               Manage your account and preferences.
//             </p>
//           </div>
//         </div>

//         {/* PROFILE CARD */}
//         <div
//           style={{
//             ...pageStyles.profileCard,
//             marginLeft: isMobile ? "0px" : "30px",
//             flexDirection: isMobile ? "column" : "row",
//             textAlign: isMobile ? "center" : "left",
//           }}
//         >
//           <div style={{ position: "relative" }}>
//             <img
//               src={profileImage || profilePlaceholder}
//               style={pageStyles.avatar}
//               alt=""
//             />
//             <label style={pageStyles.editBtn}>
//               <img src={editIcon} width={40} />
//               <input type="file" hidden onChange={handleImageUpload} />
//             </label>
//             {isUploading && <div style={pageStyles.uploadOverlay} />}
//           </div>

//           <div style={{ marginTop: isMobile ? 12 : 0 }}>
//             <div style={{ fontSize: 18, fontWeight: 600 }}>{fullName}</div>
//             <div style={{ color: "#6b7280", marginTop: 4 }}>{user.email}</div>
//           </div>
//         </div>

//         {/* SECTIONS */}
//         {[{
//           title: "My Account",
//           items: [
//             ["Profile Summary", profilePlaceholder, "/freelance-dashboard/Profilebuilder"],
//             ["My Services", MyServices, "/freelance-dashboard/sidebarsaved"],
//             ["My Jobs", MyJobs, "/freelance-dashboard/freelancermyworks"],
//             ["Invite friends ",invite, ""],
//             ["Notifications", notification],
//             ["Account Settings", settings, "/freelance-dashboard/settings"],
//           ]
//         },
//         {
//           title: "Support",
//           items: [
//             ["Help Center", helpcenter, "/freelance-dashboard/helpcenter"],
//             ["terms of Service", helpcenter],
//             ["Privacy Policy", helpcenter, "/freelance-dashboard/settings"],
//             ["Sign out", Logout, "/firelogin"],
//           ]
//         }].map((sec, i) => (
//           <div
//             key={i}
//             style={{
//               ...pageStyles.section,
//               marginLeft: isMobile ? "0px" : "30px",
//             }}
//           >
//             <h3 style={pageStyles.sectionTitle}>{sec.title}</h3>
//             {sec.items.map(([t, ic, path], idx) => (
//               <MenuItem key={idx} title={t} icon={ic} onClick={() => path && navigate(path)} />
//             ))}
//             {sec.title === "Settings" && (
//               <div style={pageStyles.logoutRow} onClick={handleLogout}>
//                 <img src={logoutIcon} width={18} />

//                 <img src={arrow} width={16} style={{ marginLeft: "auto", opacity: 0.3 }} />
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// /* MENU ITEM */
// function MenuItem({ title, icon, onClick }) {
//   return (
//     <div style={pageStyles.menuItem} onClick={onClick}>
//       <div style={pageStyles.menuLeft}>
//         <img src={icon} width={18} />
//         <span>{title}</span>
//       </div>
//       <img src={arrow} width={16} style={{ opacity: 0.2 }} />
//     </div>
//   );
// }

// /* STYLES */
// const pageStyles = {
//   page: {
//     minHeight: "100vh",
//     padding: 20,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     fontFamily: "'Rubik', Inter, system-ui",
//   },
//   titleWrap: {
//     width: "100%",
//     maxWidth: 1160,
//     display: "flex",
//     alignItems: "center",
//     marginBottom: 18,
//   },
//   backBtn: {
//     width: 40,
//     height: 40,
//     background: "#fff",
//     borderRadius: 12,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
//     cursor: "pointer",
//   },
//   title: { fontSize: 28, margin: 0, fontWeight: 700 },
//   subtitle: { marginTop: 6, fontSize: 13, color: "#6b7280" },

//   profileCard: {
//     width: "100%",
//     maxWidth: 1160,
//     background: "#fff",
//     borderRadius: 18,
//     padding: 18,
//     display: "flex",
//     alignItems: "center",
//     gap: 18,
//     boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
//     marginBottom: 20,
//   },

//   avatar: {
//     width: 75,
//     height: 75,
//     borderRadius: "50%",
//     objectFit: "cover",
//   },

//   editBtn: {
//     position: "absolute",
//     right: -5,
//     bottom: -10,
//     cursor: "pointer",
//   },

//   uploadOverlay: {
//     position: "absolute",
//     inset: 0,
//     background: "rgba(0,0,0,0.35)",
//     borderRadius: "50%",
//   },

//   section: {
//     width: "100%",
//     maxWidth: 1160,
//     background: "#fff",
//     borderRadius: 18,
//     padding: 18,
//     boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
//     marginBottom: 20,
//   },

//   sectionTitle: { fontSize: 14, color: "#6b7280" },

//   menuItem: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "12px 6px",
//     cursor: "pointer",
//     borderTop: "1px solid rgba(15,15,15,0.05)",
//   },

//   menuLeft: { display: "flex", alignItems: "center", gap: 12 },

//   logoutRow: {
//     display: "flex",
//     alignItems: "center",
//     padding: "12px 6px",
//     cursor: "pointer",
//   },
// };


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc, updateDoc, getFirestore } from "firebase/firestore";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// // assets
// import arrow from "../../assets/icons/arrow.png";
// import backarrow from "../../assets/icons/backarrow.png";
// import profilePlaceholder from "../../assets/icons/profile.png";
// import notification from "../../assets/kk.png";
// import MyServices from "../../assets/icons/MyServices.png";
// import pause from "../../assets/icons/paused.png";
// import invite from "../../assets/icons/invite.png";
// import settings from "../../assets/icons/settings.png";
// import helpcenter from "../../assets/icons/helpcenter.png";
// import editIcon from "../../assets/edit.png";
// import logoutIcon from "../../assets/icons/logout.png";
// import MyJobs from "../../assets/icons/myjobs.png";
// import Logout from "../../assets/icons/logout.png";
// import blocked from "../../assets/blocked.png";

// export default function ClientProfileMenuScreen() {
//   const auth = getAuth();
//   const db = getFirestore();
//   const storage = getStorage();
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [profileImage, setProfileImage] = useState("");
//   const [isUploading, setUploading] = useState(false);

//   // ===============================
//   // RESPONSIVE FLAG (UNCHANGED)
//   // ===============================
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   useEffect(() => {
//     const resize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", resize);
//     return () => window.removeEventListener("resize", resize);
//   }, []);

//   // ===============================
//   // ⭐ SIDEBAR COLLAPSE (STANDARD)
//   // ===============================
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   // ===============================
//   // AUTH + PROFILE LOAD (UNCHANGED)
//   // ===============================
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) return navigate("/firelogin");

//       const snap = await getDoc(doc(db, "users", currentUser.uid));
//       if (snap.exists()) {
//         setUser(snap.data());
//         setProfileImage(snap.data().profileImage || "");
//       }
//     });
//     return () => unsub();
//   }, []);

//   const handleImageUpload = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setUploading(true);

//     try {
//       const uid = auth.currentUser.uid;
//       const imageRef = ref(storage, `users/${uid}/profile.jpg`);
//       await uploadBytes(imageRef, file);
//       const url = await getDownloadURL(imageRef);
//       await updateDoc(doc(db, "users", uid), { profileImage: url });
//       setProfileImage(url);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleLogout = async () => {
//     if (!window.confirm("Logout?")) return;
//     await signOut(auth);
//     navigate("/firelogin");
//   };

//   if (!user) return null;

//   const fullName =
//     `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Helen Angel";

//   return (
//     // ===============================
//     // 🔥 SIDEBAR WRAPPER (ADDED)
//     // ===============================
//     <div
//       className="freelance-wrapper"
//       style={{
//         marginLeft: isMobile ? "0px" : collapsed ? "-160px" : "100px",
//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       <div style={pageStyles.page}>
//         {/* HEADER */}
//         <div style={{ ...pageStyles.titleWrap, flexWrap: "wrap" }}>
//           <div
//             style={{
//               ...pageStyles.backBtn,
//               marginLeft: isMobile ? "0px" : "-60px",
//             }}
//             onClick={() => navigate(-1)}
//           >
//             <img src={backarrow} alt="back" width={20} />
//           </div>

//           <div style={{ marginLeft: 12 }}>
//             <h1 style={pageStyles.title}>Profile</h1>
//             <p style={pageStyles.subtitle}>
//               Manage your account and preferences.
//             </p>
//           </div>
//         </div>

//         {/* PROFILE CARD */}
//         <div
//           style={{
//             ...pageStyles.profileCard,
//             marginLeft: isMobile ? "0px" : "30px",
//             flexDirection: isMobile ? "column" : "row",
//             textAlign: isMobile ? "center" : "left",
//           }}
//         >
//           <div style={{ position: "relative" }}>
//             <img
//               src={profileImage || profilePlaceholder}
//               style={pageStyles.avatar}
//               alt=""
//             />
//             <label style={pageStyles.editBtn}>
//               <img src={editIcon} width={40} />
//               <input type="file" hidden onChange={handleImageUpload} />
//             </label>
//             {isUploading && <div style={pageStyles.uploadOverlay} />}
//           </div>

//           <div style={{ marginTop: isMobile ? 12 : 0 }}>
//             <div style={{ fontSize: 18, fontWeight: 600 }}>{fullName}</div>
//             <div style={{ color: "#6b7280", marginTop: 4 }}>{user.email}</div>
//           </div>
//         </div>

//         {/* SECTIONS */}
//         {[
//           {
//             title: "My Account",
//             items: [
//               ["Profile Summary", profilePlaceholder, "/freelance-dashboard/Profilebuilder"],
//               ["My Services", MyServices, "/freelance-dashboard/sidebarsaved"],
//               ["My Jobs", MyJobs, "/freelance-dashboard/freelancermyworks"],
//               ["Invite friends", invite, ""],
//               ["Notifications", notification],
//               ["Account Settings", settings, "/freelance-dashboard/settings"],
//               ["Blocked", blocked, "/freelance-dashboard/blocked"],
//             ],
//           },
//           {
//             title: "Support",
//             items: [
//               ["Help Center", helpcenter, "/freelance-dashboard/helpcenter"],
//               ["Terms of Service", helpcenter,"/termsofservice"],
//               ["Privacy Policy", helpcenter, "/privacypolicy"],
//               ["Sign out", Logout, "/firelogin"],
//             ],
//           },
//         ].map((sec, i) => (
//           <div
//             key={i}
//             style={{
//               ...pageStyles.section,
//               marginLeft: isMobile ? "0px" : "30px",
//             }}
//           >
//             <h3 style={pageStyles.sectionTitle}>{sec.title}</h3>

//             {sec.items.map(([t, ic, path], idx) => (
//               <MenuItem
//                 key={idx}
//                 title={t}
//                 icon={ic}
//                 onClick={() => path && navigate(path)}
//               />
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// /* MENU ITEM */
// function MenuItem({ title, icon, onClick }) {
//   return (
//     <div style={pageStyles.menuItem} onClick={onClick}>
//       <div style={pageStyles.menuLeft}>
//         <img src={icon} width={18} />
//         <span>{title}</span>
//       </div>
//       <img src={arrow} width={16} style={{ opacity: 0.2 }} />
//     </div>
//   );
// }

// /* STYLES */
// const pageStyles = {
//   page: {
//     minHeight: "100vh",
//     padding: 20,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     fontFamily: "'Rubik', Inter, system-ui",
//   },
//   titleWrap: {
//     width: "100%",
//     maxWidth: 1160,
//     display: "flex",
//     alignItems: "center",
//     marginBottom: 18,
//   },
//   backBtn: {
//     width: 40,
//     height: 40,
//     background: "#fff",
//     borderRadius: 12,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
//     cursor: "pointer",
//   },
//   title: { fontSize: 28, margin: 0, fontWeight: 700 },
//   subtitle: { marginTop: 6, fontSize: 13, color: "#6b7280" },

//   profileCard: {
//     width: "100%",
//     maxWidth: 1160,
//     background: "#fff",
//     borderRadius: 18,
//     padding: 18,
//     display: "flex",
//     alignItems: "center",
//     gap: 18,
//     boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
//     marginBottom: 20,
//   },

//   avatar: {
//     width: 75,
//     height: 75,
//     borderRadius: "50%",
//     objectFit: "cover",
//   },

//   editBtn: {
//     position: "absolute",
//     right: -5,
//     bottom: -10,
//     cursor: "pointer",
//   },

//   uploadOverlay: {
//     position: "absolute",
//     inset: 0,
//     background: "rgba(0,0,0,0.35)",
//     borderRadius: "50%",
//   },

//   section: {
//     width: "100%",
//     maxWidth: 1160,
//     background: "#fff",
//     borderRadius: 18,
//     padding: 18,
//     boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
//     marginBottom: 20,
//   },

//   sectionTitle: { fontSize: 14, color: "#6b7280" },

//   menuItem: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "12px 6px",
//     cursor: "pointer",
//     borderTop: "1px solid rgba(15,15,15,0.05)",
//   },

//   menuLeft: { display: "flex", alignItems: "center", gap: 12 },
// };






// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc, updateDoc, getFirestore } from "firebase/firestore";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// // assets
// import arrow from "../../assets/icons/arrow.png";
// import backarrow from "../../assets/icons/backarrow.png";
// import profilePlaceholder from "../../assets/icons/profile.png";
// import notification from "../../assets/kk.png";
// import MyServices from "../../assets/icons/MyServices.png";
// import pause from "../../assets/icons/paused.png";
// import invite from "../../assets/icons/invite.png";
// import settings from "../../assets/icons/settings.png";
// import helpcenter from "../../assets/icons/helpcenter.png";
// import editIcon from "../../assets/edit.png";
// import logoutIcon from "../../assets/icons/logout.png";
// import MyJobs from "../../assets/icons/myjobs.png";
// import Logout from "../../assets/icons/logout.png";
// import blocked from "../../assets/blocked.png";


// export default function ClientProfileMenuScreen() {
//   const auth = getAuth();
//   const db = getFirestore();
//   const storage = getStorage();
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [profileImage, setProfileImage] = useState("");
//   const [isUploading, setUploading] = useState(false);

//   // ===============================
//   // RESPONSIVE FLAG (UNCHANGED)
//   // ===============================
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   useEffect(() => {
//     const resize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", resize);
//     return () => window.removeEventListener("resize", resize);
//   }, []);

//   // ===============================
//   // ⭐ SIDEBAR COLLAPSE (STANDARD)
//   // ===============================
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   // ===============================
//   // AUTH + PROFILE LOAD (UNCHANGED)
//   // ===============================
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) return navigate("/firelogin");

//       const snap = await getDoc(doc(db, "users", currentUser.uid));
//       if (snap.exists()) {
//         setUser(snap.data());
//         setProfileImage(snap.data().profileImage || "");
//       }
//     });
//     return () => unsub();
//   }, []);

//   const handleImageUpload = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setUploading(true);

//     try {
//       const uid = auth.currentUser.uid;
//       const imageRef = ref(storage, `users/${uid}/profile.jpg`);
//       await uploadBytes(imageRef, file);
//       const url = await getDownloadURL(imageRef);
//       await updateDoc(doc(db, "users", uid), { profileImage: url });
//       setProfileImage(url);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleLogout = async () => {
//     if (!window.confirm("Logout?")) return;
//     await signOut(auth);
//     navigate("/firelogin");
//   };

//   if (!user) return null;

//   const fullName =
//     `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Helen Angel";

//   return (
//     // ===============================
//     // 🔥 SIDEBAR WRAPPER (ADDED)
//     // ===============================
//     <div
//       className="freelance-wrapper"
//       style={{
//         marginLeft: isMobile ? "0px" : collapsed ? "-160px" : "100px",
//          marginTop: isMobile ? "30px" : collapsed ? "0px" : "0px",
//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       <div style={pageStyles.page}>
//         {/* HEADER */}
//         <div style={{ ...pageStyles.titleWrap, flexWrap: "wrap" }}>
//           <div
//             style={{
//               ...pageStyles.backBtn,
//               marginLeft: isMobile ? "0px" : "-60px",
//             }}
//             onClick={() => navigate(-1)}
//           >
//             <img src={backarrow} alt="back" width={20} />
//           </div>

//           <div style={{ marginLeft: 12 }}>
//             <h1 style={pageStyles.title}>Profile</h1>
//             <p style={pageStyles.subtitle}>
//               Manage your account and preferences.
//             </p>
//           </div>
//         </div>

//         {/* PROFILE CARD */}
//         <div
//           style={{
//             ...pageStyles.profileCard,
//             marginLeft: isMobile ? "0px" : "30px",
//             flexDirection: isMobile ? "column" : "row",
//             textAlign: isMobile ? "center" : "left",
//           }}
//         >
//           <div style={{ position: "relative" }}>
//             <img
//               src={profileImage || profilePlaceholder}
//               style={pageStyles.avatar}
//               alt=""
//             />
//             <label style={pageStyles.editBtn}>
//               <img src={editIcon} width={40} />
//               <input type="file" hidden onChange={handleImageUpload} />
//             </label>
//             {isUploading && <div style={pageStyles.uploadOverlay} />}
//           </div>

//           <div style={{ marginTop: isMobile ? 12 : 0 }}>
//             <div style={{ fontSize: 18, fontWeight: 600 }}>{fullName}</div>
//             <div style={{ color: "#6b7280", marginTop: 4 }}>{user.email}</div>
//           </div>
//         </div>

//         {/* SECTIONS */}
//         {[
//           {
//             title: "My Account",
//             items: [
//               ["Profile Summary", profilePlaceholder, "/freelance-dashboard/Profilebuilder"],
//               ["My Services", MyServices, "/freelance-dashboard/sidebarsaved"],
//               ["My Jobs", MyJobs, "/freelance-dashboard/freelancermyworks"],
//               ["Invite friends", invite, ""],
//               ["Notifications", notification],
//               ["Account Settings", settings, "/freelance-dashboard/settings"],
//               ["Blocked", blocked, "/freelance-dashboard/blocked"],
//             ],
//           },
//           {
//             title: "Support",
//             items: [
//               ["Help Center", helpcenter, "/freelance-dashboard/helpcenter"],
//               ["Terms of Service", helpcenter,"/termsofservice"],
//               ["Privacy Policy", helpcenter, "/privacypolicy"],
//               ["Sign out", Logout, "/firelogin"],
//             ],
//           },
//         ].map((sec, i) => (
//           <div
//             key={i}
//             style={{
//               ...pageStyles.section,
//               marginLeft: isMobile ? "0px" : "30px",
//             }}
//           >
//             <h3 style={pageStyles.sectionTitle}>{sec.title}</h3>

//             {sec.items.map(([t, ic, path], idx) => (
//               <MenuItem
//                 key={idx}
//                 title={t}
//                 icon={ic}
//                 onClick={() => path && navigate(path)}
//               />
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// /* MENU ITEM */
// function MenuItem({ title, icon, onClick }) {
//   return (
//     <div style={pageStyles.menuItem} onClick={onClick}>
//       <div style={pageStyles.menuLeft}>
//         <img src={icon} width={18} />
//         <span>{title}</span>
//       </div>
//       <img src={arrow} width={16} style={{ opacity: 0.2 }} />
//     </div>
//   );
// }

// /* STYLES */
// const pageStyles = {
//   page: {
//     minHeight: "100vh",
//     padding: 20,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     fontFamily: "'Rubik', Inter, system-ui",
//   },
//   titleWrap: {
//     width: "100%",
//     maxWidth: 1160,
//     display: "flex",
//     alignItems: "center",
//     marginBottom: 18,
//   },
//   backBtn: {
//     width: 40,
//     height: 40,
//     background: "#fff",
//     borderRadius: 12,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
//     cursor: "pointer",
//   },
//   title: { fontSize: 28, margin: 0, fontWeight: 700 },
//   subtitle: { marginTop: 6, fontSize: 13, color: "#6b7280" },

//   profileCard: {
//     width: "100%",
//     maxWidth: 1160,
//     background: "#fff",
//     borderRadius: 18,
//     padding: 18,
//     display: "flex",
//     alignItems: "center",
//     gap: 18,
//     boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
//     marginBottom: 20,
//   },

//   avatar: {
//     width: 75,
//     height: 75,
//     borderRadius: "50%",
//     objectFit: "cover",
//   },

//   editBtn: {
//     position: "absolute",
//     right: -5,
//     bottom: -10,
//     cursor: "pointer",
//   },

//   uploadOverlay: {
//     position: "absolute",
//     inset: 0,
//     background: "rgba(0,0,0,0.35)",
//     borderRadius: "50%",
//   },

//   section: {
//     width: "100%",
//     maxWidth: 1160,
//     background: "#fff",
//     borderRadius: 18,
//     padding: 18,
//     boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
//     marginBottom: 20,
//   },

//   sectionTitle: { fontSize: 14, color: "#6b7280" },

//   menuItem: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "12px 6px",
//     cursor: "pointer",
//     borderTop: "1px solid rgba(15,15,15,0.05)",
//   },

//   menuLeft: { display: "flex", alignItems: "center", gap: 12 },
// };


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc, updateDoc, getFirestore, deleteDoc } from "firebase/firestore";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// // assets
// import arrow from "../../assets/icons/arrow.png";
// import backarrow from "../../assets/icons/backarrow.png";
// import profilePlaceholder from "../../assets/icons/profile.png";
// import notification from "../../assets/kk.png";
// import MyServices from "../../assets/icons/MyServices.png";
// import pause from "../../assets/icons/paused.png";
// import invite from "../../assets/icons/invite.png";
// import settings from "../../assets/icons/settings.png";
// import helpcenter from "../../assets/icons/helpcenter.png";
// import editIcon from "../../assets/edit.png";
// import logoutIcon from "../../assets/icons/logout.png";
// import MyJobs from "../../assets/icons/myjobs.png";
// import Logout from "../../assets/icons/logout.png";
// import blocked from "../../assets/blocked.png";

// import { deleteUser } from "firebase/auth";

// import { deleteObject } from "firebase/storage";




// export default function ClientProfileMenuScreen() {
//   const auth = getAuth();
//   const db = getFirestore();
//   const storage = getStorage();
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [profileImage, setProfileImage] = useState("");
//   const [isUploading, setUploading] = useState(false);

//   // ===============================
//   // RESPONSIVE FLAG (UNCHANGED)
//   // ===============================
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   useEffect(() => {
//     const resize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", resize);
//     return () => window.removeEventListener("resize", resize);
//   }, []);

//   // ===============================
//   // ⭐ SIDEBAR COLLAPSE (STANDARD)
//   // ===============================
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   // ===============================
//   // AUTH + PROFILE LOAD (UNCHANGED)
//   // ===============================
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) return navigate("/firelogin");

//       const snap = await getDoc(doc(db, "users", currentUser.uid));
//       if (snap.exists()) {
//         setUser(snap.data());
//         setProfileImage(snap.data().profileImage || "");
//       }
//     });
//     return () => unsub();
//   }, []);

//   const handleImageUpload = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setUploading(true);

//     try {
//       const uid = auth.currentUser.uid;
//       const imageRef = ref(storage, `users/${uid}/profile.jpg`);
//       await uploadBytes(imageRef, file);
//       const url = await getDownloadURL(imageRef);
//       await updateDoc(doc(db, "users", uid), { profileImage: url });
//       setProfileImage(url);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleLogout = async () => {
//     if (!window.confirm("Logout?")) return;
//     await signOut(auth);
//     navigate("/firelogin");
//   };

//  const handleDeleteAccount = async () => {
//   const confirmDelete = window.confirm(
//     "Are you sure you want to permanently delete your account?"
//   );

//   if (!confirmDelete) return;

//   try {
//     const currentUser = auth.currentUser;
//     if (!currentUser) return;

//     const uid = currentUser.uid;

//     // 🗑 Delete profile image (optional)
//     try {
//       const imageRef = ref(storage, `users/${uid}/profile.jpg`);
//       await deleteObject(imageRef);
//     } catch (e) {
//       // ignore if image does not exist
//     }

//     // 🗑 Delete Firestore user document
//     await deleteDoc(doc(db, "users", uid));

//     // 🗑 Delete Firebase Authentication user
//     await deleteUser(currentUser);

//     alert("Your account has been deleted successfully.");
//     navigate("/firelogin");
//   } catch (error) {
//     if (error.code === "auth/requires-recent-login") {
//       alert("Please log in again to delete your account.");
//       navigate("/firelogin");
//     } else {
//       console.error(error);
//       alert("Unable to delete account.");
//     }
//   }
// };



//   if (!user) return null;

//   const fullName =
//     `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Helen Angel";

//   return (
//     // ===============================
//     // 🔥 SIDEBAR WRAPPER (ADDED)
//     // ===============================
//     <div
//       className="freelance-wrapper"
//       style={{
//         marginLeft: isMobile ? "0px" : collapsed ? "-200px" : "-120px",
//         marginTop: isMobile ? "50px" : collapsed ? "0px" : "0px",
//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       <div style={pageStyles.page}>
//         {/* HEADER */}
//         <div style={{ ...pageStyles.titleWrap, flexWrap: "wrap" }}>
//           <div
//             style={{
//               ...pageStyles.backBtn,
//               // marginLeft: isMobile ? "0px" : "10px",
//               marginLeft: isMobile ? "0px" : collapsed ? "-100px" : "10px",

//             }}
//             onClick={() => navigate(-1)}
//           >
//             <img src={backarrow} alt="back" width={20} />
//           </div>

//           <div style={{ marginLeft: 12 }}>
//             <h1 style={pageStyles.title}>Profile</h1>
//             <p style={pageStyles.subtitle}>
//               Manage your account and preferences.
//             </p>
//           </div>
//         </div>

//         {/* PROFILE CARD */}
//         <div
//           style={{
//             ...pageStyles.profileCard,
//             marginLeft: isMobile ? "0px" : "30px",
//             flexDirection: isMobile ? "column" : "row",
//             textAlign: isMobile ? "center" : "left",
//           }}
//         >
//           <div style={{ position: "relative" }}>
//             <img
//               src={profileImage || profilePlaceholder}
//               style={pageStyles.avatar}
//               alt=""
//             />
//             <label style={pageStyles.editBtn}>
//               <img src={editIcon} width={40} />
//               <input type="file" hidden onChange={handleImageUpload} />
//             </label>
//             {isUploading && <div style={pageStyles.uploadOverlay} />}
//           </div>

//           <div style={{ marginTop: isMobile ? 12 : 0 }}>
//             <div style={{ fontSize: 18, fontWeight: 600 }}>{fullName}</div>
//             <div style={{ color: "#6b7280", marginTop: 4 }}>{user.email}</div>
//           </div>
//         </div>

//         {/* SECTIONS */}
//         {[
//           {
//             title: "My Account",
//             items: [
//               ["Profile Summary", profilePlaceholder, "/freelance-dashboard/Profilebuilder"],
//               ["My Services", MyServices, "/freelance-dashboard/sidebarsaved"],
//               ["My Jobs", MyJobs, "/freelance-dashboard/freelancermyworks"],
//               ["Invite friends", invite, ""],
//               ["Notifications", notification],
//               ["Account Settings", settings, "/freelance-dashboard/settings"],
//               ["Blocked", blocked, "/freelance-dashboard/blocked"],
//             ],
//           },
//           {
//             title: "Support",
//             items: [
//               ["Help Center", helpcenter, "/freelance-dashboard/helpcenter"],
//               ["Terms of Service", helpcenter, "/termsofservice"],
//               ["Privacy Policy", helpcenter, "/privacypolicy"],
//               ["Sign out", Logout, handleLogout],
//               ["delete account", Logout, handleDeleteAccount]


//             ],
//           },
//         ].map((sec, i) => (
//           <div
//             key={i}
//             style={{
//               ...pageStyles.section,
//               marginLeft: isMobile ? "0px" : "30px",
//             }}
//           >
//             <h3 style={pageStyles.sectionTitle}>{sec.title}</h3>

//             {sec.items.map(([t, ic, path], idx) => (
//               <MenuItem
//                 key={idx}
//                 title={t}
//                 icon={ic}
//                 onClick={() => {
//                   if (typeof path === "function") {
//                     path();
//                   } else if (path) {
//                     navigate(path);
//                   }
//                 }}

//               />
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// /* MENU ITEM */
// function MenuItem({ title, icon, onClick }) {
//   return (
//     <div style={pageStyles.menuItem} onClick={onClick}>
//       <div style={pageStyles.menuLeft}>
//         <img src={icon} width={18} alt="" />
//         <span>{title}</span>
//       </div>

//       {/* RIGHT ARROW */}
//       <img
//         src={arrow}
//         width={16}
//         alt=""
//         style={pageStyles.menuArrow}
//       />
//     </div>
//   );
// }


// /* STYLES */
// const pageStyles = {
//   page: {
//     minHeight: "100vh",
//     padding: 20,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     fontFamily: "'Rubik', Inter, system-ui",
//   },
//   titleWrap: {
//     width: "100%",
//     maxWidth: 1160,
//     display: "flex",
//     alignItems: "center",
//     marginBottom: 18,
//   },
//   backBtn: {
//     width: 40,
//     height: 40,
//     background: "#fff",
//     borderRadius: 12,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
//     cursor: "pointer",
//   },
//   title: { fontSize: 28, margin: 0, fontWeight: 700 },
//   subtitle: { marginTop: 6, fontSize: 13, color: "#6b7280", },

//   profileCard: {
//     width: "100%",
//     maxWidth: 1160,
//     background: "#fff",
//     borderRadius: 18,
//     padding: 18,
//     display: "flex",
//     alignItems: "center",
//     gap: 18,
//     boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
//     marginBottom: 20,
//   },

//   avatar: {
//     width: 75,
//     height: 75,
//     borderRadius: "50%",
//     objectFit: "cover",
//   },

//   editBtn: {
//     position: "absolute",
//     right: -5,
//     bottom: -10,
//     cursor: "pointer",
//   },

//   uploadOverlay: {
//     position: "absolute",
//     inset: 0,
//     background: "rgba(0,0,0,0.35)",
//     borderRadius: "50%",
//   },

//   section: {
//     width: "100%",
//     maxWidth: 1160,
//     background: "#fff",
//     borderRadius: 18,
//     padding: 18,
//     boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
//     marginBottom: 20,
//   },

//   sectionTitle: { fontSize: 14, color: "#000" },

//   menuItem: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "22px 6px",
//     cursor: "pointer",
//     // borderTop: "1px solid rgba(15,15,15,0.05)",
//   },

//   menuLeft: { display: "flex", alignItems: "center", gap: 12 },
// };



// // ClientProfileMenuScreen.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import { getAuth, signOut, onAuthStateChanged, deleteUser } from "firebase/auth";
// import {
//   doc,
//   getDoc,
//   updateDoc,
//   getFirestore,
//   deleteDoc,
// } from "firebase/firestore";
// import {
//   getStorage,
//   ref,
//   uploadBytes,
//   getDownloadURL,
//   deleteObject,
// } from "firebase/storage";

// // assets
// import arrow from "../../assets/icons/arrow.png";
// import backarrow from "../../assets/icons/backarrow.png";
// import profilePlaceholder from "../../assets/icons/profile.png";
// import notification from "../../assets/kk.png";
// import MyServices from "../../assets/icons/MyServices.png";
// import invite from "../../assets/icons/invite.png";
// import settings from "../../assets/icons/settings.png";
// import helpcenter from "../../assets/icons/helpcenter.png";
// import editIcon from "../../assets/edit.png";
// import MyJobs from "../../assets/icons/myjobs.png";
// import Logout from "../../assets/icons/logout.png";
// import blocked from "../../assets/blocked.png";

// export default function ClientProfileMenuScreen() {
//   const auth = getAuth();
//   const db = getFirestore();
//   const storage = getStorage();
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [profileImage, setProfileImage] = useState("");
//   const [isUploading, setUploading] = useState(false);

//   /* RESPONSIVE FLAG */
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   useEffect(() => {
//     const resize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", resize);
//     return () => window.removeEventListener("resize", resize);
//   }, []);

//   /* SIDEBAR COLLAPSE */
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   useEffect(() => {
//     const handleToggle = (e) => setCollapsed(e.detail);
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   /* AUTH */
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) return navigate("/firelogin");
//       const snap = await getDoc(doc(db, "users", currentUser.uid));
//       if (snap.exists()) {
//         setUser(snap.data());
//         setProfileImage(snap.data().profileImage || "");
//       }
//     });
//     return () => unsub();
//   }, []);

//   const handleImageUpload = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setUploading(true);
//     try {
//       const uid = auth.currentUser.uid;
//       const imageRef = ref(storage, `users/${uid}/profile.jpg`);
//       await uploadBytes(imageRef, file);
//       const url = await getDownloadURL(imageRef);
//       await updateDoc(doc(db, "users", uid), { profileImage: url });
//       setProfileImage(url);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleLogout = async () => {
//     if (!window.confirm("Logout?")) return;
//     await signOut(auth);
//     navigate("/firelogin");
//   };

//   const handleDeleteAccount = async () => {
//     if (!window.confirm("Delete your account permanently?")) return;
//     const currentUser = auth.currentUser;
//     const uid = currentUser.uid;

//     try {
//       try {
//         await deleteObject(ref(storage, `users/${uid}/profile.jpg`));
//       } catch {}
//       await deleteDoc(doc(db, "users", uid));
//       await deleteUser(currentUser);
//       navigate("/firelogin");
//     } catch (e) {
//       alert("Please login again to delete account");
//       navigate("/firelogin");
//     }
//   };

//   if (!user) return null;

//   const fullName =
//     `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Helen Angel";

//   return (
//     /* SIDEBAR WRAPPER */
//     <div
//       className="freelance-wrapper"
//       style={{
//         marginLeft: isMobile ? 0 : collapsed ? -150 : -100,
//         marginTop: isMobile ? 60 : collapsed ? 10 : 10,

//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       {/* 🔥 CENTER PAGE CONTAINER */}
//       <div style={pageStyles.page}>
//         <div style={pageStyles.centerWrap}>
//           {/* HEADER */}
//           <div style={pageStyles.titleWrap}>
//             <div style={pageStyles.backBtn} onClick={() => navigate(-1)}>
//               <img src={backarrow} alt="back" width={20} />
//             </div>
//             <div>
//               <h1 style={pageStyles.title}>Profile</h1>
//               <p style={pageStyles.subtitle}>
//                 Manage your account and preferences.
//               </p>
//             </div>
//           </div>

//           {/* PROFILE CARD */}
//           <div
//             style={{
//               ...pageStyles.profileCard,
//               flexDirection: isMobile ? "column" : "row",
//               textAlign: isMobile ? "center" : "left",
//             }}
//           >
//             <div style={{ position: "relative" }}>
//               <img
//                 src={profileImage || profilePlaceholder}
//                 style={pageStyles.avatar}
//                 alt=""
//               />
//               <label style={pageStyles.editBtn}>
//                 <img src={editIcon} width={36} />
//                 <input type="file" hidden onChange={handleImageUpload} />
//               </label>
//               {isUploading && <div style={pageStyles.uploadOverlay} />}
//             </div>

//             <div>
//               <div style={{ fontSize: 30, fontWeight: 400,paddingBottom:"10px" }}>{fullName}</div>
//               <div style={{fontSize: 16, fontWeight: 400, color: "#6b7280" }}>{user.email}</div>
//             </div>
//           </div>

//           {/* SECTIONS */}
//           {[
//             {
//               title: "My Account",
//               items: [
//                 ["Profile Summary", profilePlaceholder, "/freelance-dashboard/Profilebuilder"],
//                 ["My Services", MyServices, "/freelance-dashboard/sidebarsaved"],
//                 ["My Jobs", MyJobs, "/freelance-dashboard/freelancermyworks"],
//                 ["Invite friends", invite],
//                 // ["Notifications", notification],
//                 ["Account Settings", settings, "/freelance-dashboard/settings"],
//                 ["Blocked", blocked, "/freelance-dashboard/blocked"],
//               ],
//             },
//             {
//               title: "Support",
//               items: [
//                 ["Help Center", helpcenter, "/freelance-dashboard/helpcenter"],
//                 ["Terms of Service", helpcenter, "/termsofservice"],
//                 ["Privacy Policy", helpcenter, "/privacypolicy"],
//                 // <MenuItem title="Terms of Service" icon={helpcenter} onClick={() => navigate("/termsofservice")} />
//                 // <MenuItem title="Privacy Policy" icon={helpcenter} onClick={() => navigate("/privacypolicy")} />
//                 ["Sign out", Logout, handleLogout],
//                 ["Delete account", Logout, handleDeleteAccount],
//               ],
//             },
//           ].map((sec, i) => (
//             <div key={i} style={pageStyles.section}>
//               <h3 style={pageStyles.sectionTitle}>{sec.title}</h3>
//               {sec.items.map(([t, ic, path], idx) => (
//                 <MenuItem
//                   key={idx}
//                   title={t}
//                   icon={ic}
//                   onClick={() =>
//                     typeof path === "function"
//                       ? path()
//                       : path && navigate(path)
//                   }
//                 />
//               ))}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* MENU ITEM */
// function MenuItem({ title, icon, onClick }) {
//   return (
//     <div style={pageStyles.menuItem} onClick={onClick}>
//       <div style={pageStyles.menuLeft}>
//         <img src={icon} width={18} alt="" />
//         <span>{title}</span>
//       </div>
//       <img src={arrow} width={16} alt="" />
//     </div>
//   );
// }

// /* STYLES */
// const pageStyles = {
//   page: {
//     minHeight: "100vh",
//     padding: 20,
//     display: "flex",
//     justifyContent: "center",
//     fontFamily: "'Rubik', system-ui",
//   },
//   centerWrap: {
//     width: "100%",
//     maxWidth: 800,
//   },
//   titleWrap: {
//     display: "flex",
//     alignItems: "center",
//     gap: 14,
//     marginBottom: 18,
//   },
//   backBtn: {
//     width: 40,
//     height: 40,
//     background: "#fff",
//     borderRadius: 12,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     border: "1px solid #BDBDBD",
//     cursor: "pointer",
//   },
//   title: { fontSize: 36, margin: 0, fontWeight: 400 },
//   subtitle: { fontSize: 13, color: "#6b7280" },

//   profileCard: {
//     background: "#fff",
//     borderRadius: 18,
//     padding: 18,
//     display: "flex",
//     alignItems: "center",
//     gap: 18,
//     // boxShadow:" 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
//     border: "1px solid #BDBDBD",
//     marginBottom: 20,
//   },
//   avatar: {
//     width: 75,
//     height: 75,
//     borderRadius: "50%",
//     objectFit: "cover",
//   },
//   editBtn: {
//     position: "absolute",
//     right: -6,
//     bottom:-18,
//     cursor: "pointer",
//   },
//   uploadOverlay: {
//     position: "absolute",
//     inset: 0,
//     background: "rgba(0,0,0,0.35)",
//     borderRadius: "50%",
//   },

//   section: {
//     background: "#fff",
//     borderRadius: 18,
//     padding: 18,
//     // boxShadow:" 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
//     marginBottom: 20,
//     border: "1px solid #BDBDBD",
//   },
//   sectionTitle: { fontSize: 20, fontWeight: 400 },

//   menuItem: {
//     display: "flex",
//     justifyContent: "space-between",
//     padding: "20px 6px",
//     cursor: "pointer",
//   fontSize: 16,
//    fontWeight: 400 ,

//   },
//   menuLeft: {
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//   },
// };




// ClientProfileMenuScreen.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getAuth, signOut, onAuthStateChanged, deleteUser } from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  getFirestore,
  deleteDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {

  reauthenticateWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

// assets
import arrow from "../../assets/icons/arrow.png";
import backarrow from "../../assets/icons/backarrow.png";
import profilePlaceholder from "../../assets/icons/profile.png";
import notification from "../../assets/kk.png";
import MyServices from "../../assets/icons/MyServices.png";
import invite from "../../assets/icons/invite.png";
import settings from "../../assets/icons/settings.png";
import helpcenter from "../../assets/icons/helpcenter.png";
import editIcon from "../../assets/edit.png";
import MyJobs from "../../assets/icons/myjobs.png";
import Logout from "../../assets/icons/logout.png";
import blocked from "../../assets/blocked.png";
import delete_Account from "../../assets/delete_Account.png";

export default function ClientProfileMenuScreen() {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [isUploading, setUploading] = useState(false);


  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteDesc, setDeleteDesc] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);



  /* RESPONSIVE FLAG */
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* SIDEBAR COLLAPSE */
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  useEffect(() => {
    const handleToggle = (e) => setCollapsed(e.detail);
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  /* AUTH */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) return navigate("/firelogin");
      const snap = await getDoc(doc(db, "users", currentUser.uid));
      if (snap.exists()) {
        setUser(snap.data());
        setProfileImage(snap.data().profileImage || "");
      }
    });
    return () => unsub();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uid = auth.currentUser.uid;
      const imageRef = ref(storage, `users/${uid}/profile.jpg`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      await updateDoc(doc(db, "users", uid), { profileImage: url });
      setProfileImage(url);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    if (!window.confirm("Logout?")) return;
    await signOut(auth);
    navigate("/firelogin");
  };

  const handleDeleteAccount = async () => {
    if (!deleteReason) {
      alert("Please select a reason");
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) return;

    setIsDeleting(true);

    try {
      const uid = currentUser.uid;

      // 1️⃣ Save deletion reason
      await addDoc(collection(db, "account_deletions"), {
        uid,
        email: currentUser.email,
        reason: deleteReason,
        description: deleteDesc || "",
        createdAt: serverTimestamp(),
      });

      // 2️⃣ Delete profile image
      try {
        await deleteObject(ref(storage, `users/${uid}/profile.jpg`));
      } catch { }

      // 3️⃣ Delete Firestore user document
      await deleteDoc(doc(db, "users", uid));

      // 4️⃣ DELETE AUTH USER (SAFE)
      try {
        await deleteUser(currentUser);
      } catch (err) {
        // 🔁 Re-auth required
        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(currentUser, provider);
        await deleteUser(currentUser);
      }

      navigate("/firelogin");
    } catch (err) {
      console.error(err);
      alert("Account deletion failed. Please login again.");
      navigate("/firelogin");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };


  if (!user) return null;

  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Helen Angel";

  return (
    /* SIDEBAR WRAPPER */
    <div
      className="freelance-wrapper"
      style={{
        marginLeft: isMobile ? 0 : collapsed ? -150 : -100,
        marginTop: isMobile ? 60 : collapsed ? 10 : 10,

        transition: "margin-left 0.25s ease",
      }}
    >
      {/* 🔥 CENTER PAGE CONTAINER */}
      <div style={pageStyles.page}>
        <div style={pageStyles.centerWrap}>
          {/* HEADER */}
          <div style={pageStyles.titleWrap}>
            <div style={pageStyles.backBtn} onClick={() => navigate(-1)}>
              <img src={backarrow} alt="back" width={20} />
            </div>
            <div>
              <h1 style={pageStyles.title}>Profile</h1>
              <p style={pageStyles.subtitle}>
                Manage your account and preferences.
              </p>
            </div>
          </div>

          {/* PROFILE CARD */}
          <div
            style={{
              ...pageStyles.profileCard,
              flexDirection: isMobile ? "column" : "row",
              textAlign: isMobile ? "center" : "left",
            }}
          >
            <div style={{ position: "relative" }}>
              <img
                src={profileImage || profilePlaceholder}
                style={pageStyles.avatar}
                alt=""
              />
              <label style={pageStyles.editBtn}>
                <img src={editIcon} width={36} />
                <input type="file" hidden onChange={handleImageUpload} />
              </label>
              {isUploading && <div style={pageStyles.uploadOverlay} />}
            </div>

            <div>
              <div style={{ fontSize: 30, fontWeight: 400, paddingBottom: "10px" }}>{fullName}</div>
              <div style={{ fontSize: 16, fontWeight: 400, color: "#6b7280" }}>{user.email}</div>
            </div>
          </div>

          {/* SECTIONS */}
          {[
            {
              title: "My Account",
              items: [
                ["Profile Summary", profilePlaceholder, "/freelance-dashboard/Profilebuilder"],
                ["My Services", MyServices, "/freelance-dashboard/sidebarsaved"],
                ["My Jobs", MyJobs, "/freelance-dashboard/freelancermyworks"],
                ["Invite friends", invite],
                // ["Notifications", notification],
                ["Account Settings", settings, "/freelance-dashboard/settings"],
                ["Blocked", blocked, "/freelance-dashboard/blocked"],
              ],
            },
            {
              title: "Support",
              items: [
                ["Help Center", helpcenter, "/freelance-dashboard/helpcenter"],
                ["Terms of Service", helpcenter, "/termsofservice"],
                ["Privacy Policy", helpcenter, "/privacypolicy"],
                // <MenuItem title="Terms of Service" icon={helpcenter} onClick={() => navigate("/termsofservice")} />
                // <MenuItem title="Privacy Policy" icon={helpcenter} onClick={() => navigate("/privacypolicy")} />
                ["Sign out", Logout, handleLogout],
                ["Delete account", Logout, () => setShowDeleteModal(true)],


              ],
            },
          ].map((sec, i) => (
            <div key={i} style={pageStyles.section}>
              <h3 style={pageStyles.sectionTitle}>{sec.title}</h3>
              {sec.items.map(([t, ic, path], idx) => (
                <MenuItem
                  key={idx}
                  title={t}
                  icon={ic}
                  onClick={() =>
                    typeof path === "function"
                      ? path()
                      : path && navigate(path)
                  }
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* {showDeleteModal && (
        <div style={deleteStyles.overlay}>
          <div style={deleteStyles.modal}>
            <div style={deleteStyles.icon}>⚠️</div>
            <h2 style={deleteStyles.title}>Delete account</h2>

            <p style={deleteStyles.desc}>
              Are you sure you want to delete this account? This action{" "}
              <span style={{ color: "#ef4444", fontWeight: 500 }}>
                cannot be undone
              </span>
          . Please tell us why you’d like to delete your huzzler account. this information will help us improve
            </p>

            <div style={deleteStyles.box}>
              <p style={deleteStyles.boxTitle}>REASON FOR DELETION</p>

              {[
                "Couldn’t find suitable freelancers",
                "Work outcomes didn’t meet expectations",
                "Communication and collaboration issues",
                "Platform experience was not effective",
                "Othe  (please specify)",
              ].map((r) => (
                <label key={r} style={deleteStyles.radioRow}>
                  <input
                    type="radio"
                    name="deleteReason"
                    value={r}
                    checked={deleteReason === r}
                    onChange={() => setDeleteReason(r)}
                  />
                  {r}
                </label>
              ))}

              {deleteReason === "Other" && (
                <textarea
                  style={deleteStyles.textarea}
                  placeholder="Tell us a bit more..."
                  value={deleteDesc}
                  onChange={(e) => setDeleteDesc(e.target.value)}
                />
              )}
            </div>

            <div style={deleteStyles.actions}>
              <button
                style={deleteStyles.cancel}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                style={deleteStyles.confirm}
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Confirm Deletion"}
              </button>
            </div>
          </div>
        </div>
      )} */}
{showDeleteModal && (
  <div style={deleteStyles.overlay}>
    <div style={deleteStyles.modal}>

      {/* WARNING ICON */}
      <div>
      <img src={delete_Account} style={{width:'30px'}} alt="delete_Account" />
      </div>

      <h2 style={deleteStyles.title}>Delete account</h2>

      <p style={deleteStyles.desc}>
        Are you sure you want to delete this account? This action{" "}
        <span style={{ color: "#ef4444", fontWeight: 500 }}>
          cannot be undone
        </span>
        . Please tell us why you’d like to delete your huzzler account. this
        information will help us improve
      </p>

      {/* REASON BOX */}
      <div style={deleteStyles.box}>
        <p style={deleteStyles.boxTitle}>REASON FOR DELETION</p>

        {[
          "Couldn’t find suitable freelancers",
          "Project outcomes didn’t meet expectations",
          "Communication and collaboration issues",
          "Platform experience was not effective",
          "Other (please specify)",
        ].map((r) => (
          <label key={r} style={deleteStyles.radioRow}>
            <input
              type="radio"
              name="deleteReason"
              value={r}
              checked={deleteReason === r}
              onChange={() => setDeleteReason(r)}
            />
            <span>{r}</span>
          </label>
        ))}

        {deleteReason === "Other (please specify)" && (
          <textarea
            style={deleteStyles.textarea}
            placeholder="Tell us a bit more..."
            value={deleteDesc}
            onChange={(e) => setDeleteDesc(e.target.value)}
          />
        )}
      </div>

      {/* ACTIONS */}
      <div style={deleteStyles.actions}>
        <button
          style={deleteStyles.cancel}
          onClick={() => setShowDeleteModal(false)}
        >
          Cancel
        </button>

        <button
          style={deleteStyles.confirm}
          onClick={handleDeleteAccount}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Confirm Deletion"}
        </button>
      </div>
    </div>
  </div>
)}


    </div>


  );
}

/* MENU ITEM */
function MenuItem({ title, icon, onClick }) {
  return (
    <div style={pageStyles.menuItem} onClick={onClick}>
      <div style={pageStyles.menuLeft}>
        <img src={icon} width={18} alt="" />
        <span>{title}</span>
      </div>
      <img src={arrow} width={16} alt="" />
    </div>
  );
}

/* STYLES */
const pageStyles = {
  page: {
    minHeight: "100vh",
    padding: 20,
    display: "flex",
    justifyContent: "center",
    fontFamily: "'Rubik', system-ui",
  },
  centerWrap: {
    width: "100%",
    maxWidth: 800,
  },
  titleWrap: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 18,
  },
  backBtn: {
    width: 40,
    height: 40,
    background: "#fff",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #BDBDBD",
    cursor: "pointer",
  },
  title: { fontSize: 36, margin: 0, fontWeight: 400 },
  subtitle: { fontSize: 13, color: "#6b7280" },

  profileCard: {
    background: "#fff",
    borderRadius: 18,
    padding: 18,
    display: "flex",
    alignItems: "center",
    gap: 18,
    // boxShadow:" 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    border: "1px solid #BDBDBD",
    marginBottom: 20,
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: "50%",
    objectFit: "cover",
  },
  editBtn: {
    position: "absolute",
    right: -6,
    bottom: -18,
    cursor: "pointer",
  },
  uploadOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    borderRadius: "50%",
  },

  section: {
    background: "#fff",
    borderRadius: 18,
    padding: 18,
    // boxShadow:" 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    marginBottom: 20,
    border: "1px solid #BDBDBD",
  },
  sectionTitle: { fontSize: 20, fontWeight: 400 },

  menuItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px 6px",
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 400,

  },
  menuLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
};


const deleteStyles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    padding: 16,
  },

  modal: {
    background: "#fff",
    borderRadius: 22,
    padding: "32px 26px",
    width: "100%",
    maxWidth: 560,
    textAlign: "center",
    boxShadow: "0 20px 45px rgba(0,0,0,0.15)",
  },

  warnIcon: {
    width: 48,
    height: 48,
    margin: "0 auto 12px",
  },

  title: {
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 8,
    color: "#d10000",
  },

  desc: {
    fontSize: 14,
    color: "#444",
    lineHeight: 1.6,
    marginBottom: 26,
  },

  box: {
    border: "1px solid #facc15",
    borderRadius: 14,
    padding: 18,
    textAlign: "left",
    background: "#fffbeb",
  },

  boxTitle: {
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 14,
    color: "#6b7280",
    letterSpacing: 0.6,
  },

  radioRow: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    fontSize: 14,
    marginBottom: 14,
    cursor: "pointer",
  },

  textarea: {
    width: "100%",
    height: 110,
    marginTop: 12,
    padding: 14,
    borderRadius: 10,
    border: "none",
    resize: "none",
    fontSize: 14,
    outline: "none",
    background: "#f3f4f6",
  },

  actions: {
    display: "flex",
    justifyContent: "center",
    gap: 18,
    marginTop: 28,
  },

  cancel: {
    padding: "11px 30px",
    borderRadius: 999,
    border: "1px solid #d1d5db",
    background: "#fff",
    cursor: "pointer",
    fontSize: 14,
  },

  confirm: {
    padding: "11px 34px",
    borderRadius: 999,
    border: "none",
    background: "#6d28d9",
    color: "#fff",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  },
};

