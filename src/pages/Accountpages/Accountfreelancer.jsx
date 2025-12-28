
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






import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// assets
import arrow from "../../assets/icons/arrow.png";
import backarrow from "../../assets/icons/backarrow.png";
import profilePlaceholder from "../../assets/icons/profile.png";
import notification from "../../assets/kk.png";
import MyServices from "../../assets/icons/MyServices.png";
import pause from "../../assets/icons/paused.png";
import invite from "../../assets/icons/invite.png";
import settings from "../../assets/icons/settings.png";
import helpcenter from "../../assets/icons/helpcenter.png";
import editIcon from "../../assets/edit.png";
import logoutIcon from "../../assets/icons/logout.png";
import MyJobs from "../../assets/icons/myjobs.png";
import Logout from "../../assets/icons/logout.png";
import blocked from "../../assets/blocked.png";


export default function ClientProfileMenuScreen() {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [isUploading, setUploading] = useState(false);

  // ===============================
  // RESPONSIVE FLAG (UNCHANGED)
  // ===============================
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ===============================
  // ⭐ SIDEBAR COLLAPSE (STANDARD)
  // ===============================
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  // ===============================
  // AUTH + PROFILE LOAD (UNCHANGED)
  // ===============================
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

  if (!user) return null;

  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Helen Angel";

  return (
    // ===============================
    // 🔥 SIDEBAR WRAPPER (ADDED)
    // ===============================
    <div
      className="freelance-wrapper"
      style={{
        marginLeft: isMobile ? "0px" : collapsed ? "-160px" : "100px",
         marginTop: isMobile ? "30px" : collapsed ? "0px" : "0px",
        transition: "margin-left 0.25s ease",
      }}
    >
      <div style={pageStyles.page}>
        {/* HEADER */}
        <div style={{ ...pageStyles.titleWrap, flexWrap: "wrap" }}>
          <div
            style={{
              ...pageStyles.backBtn,
              marginLeft: isMobile ? "0px" : "-60px",
            }}
            onClick={() => navigate(-1)}
          >
            <img src={backarrow} alt="back" width={20} />
          </div>

          <div style={{ marginLeft: 12 }}>
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
            marginLeft: isMobile ? "0px" : "30px",
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
              <img src={editIcon} width={40} />
              <input type="file" hidden onChange={handleImageUpload} />
            </label>
            {isUploading && <div style={pageStyles.uploadOverlay} />}
          </div>

          <div style={{ marginTop: isMobile ? 12 : 0 }}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>{fullName}</div>
            <div style={{ color: "#6b7280", marginTop: 4 }}>{user.email}</div>
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
              ["Invite friends", invite, ""],
              ["Notifications", notification],
              ["Account Settings", settings, "/freelance-dashboard/settings"],
              ["Blocked", blocked, "/freelance-dashboard/blocked"],
            ],
          },
          {
            title: "Support",
            items: [
              ["Help Center", helpcenter, "/freelance-dashboard/helpcenter"],
              ["Terms of Service", helpcenter,"/termsofservice"],
              ["Privacy Policy", helpcenter, "/privacypolicy"],
              ["Sign out", Logout, "/firelogin"],
            ],
          },
        ].map((sec, i) => (
          <div
            key={i}
            style={{
              ...pageStyles.section,
              marginLeft: isMobile ? "0px" : "30px",
            }}
          >
            <h3 style={pageStyles.sectionTitle}>{sec.title}</h3>

            {sec.items.map(([t, ic, path], idx) => (
              <MenuItem
                key={idx}
                title={t}
                icon={ic}
                onClick={() => path && navigate(path)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* MENU ITEM */
function MenuItem({ title, icon, onClick }) {
  return (
    <div style={pageStyles.menuItem} onClick={onClick}>
      <div style={pageStyles.menuLeft}>
        <img src={icon} width={18} />
        <span>{title}</span>
      </div>
      <img src={arrow} width={16} style={{ opacity: 0.2 }} />
    </div>
  );
}

/* STYLES */
const pageStyles = {
  page: {
    minHeight: "100vh",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "'Rubik', Inter, system-ui",
  },
  titleWrap: {
    width: "100%",
    maxWidth: 1160,
    display: "flex",
    alignItems: "center",
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
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    cursor: "pointer",
  },
  title: { fontSize: 28, margin: 0, fontWeight: 700 },
  subtitle: { marginTop: 6, fontSize: 13, color: "#6b7280" },

  profileCard: {
    width: "100%",
    maxWidth: 1160,
    background: "#fff",
    borderRadius: 18,
    padding: 18,
    display: "flex",
    alignItems: "center",
    gap: 18,
    boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
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
    right: -5,
    bottom: -10,
    cursor: "pointer",
  },

  uploadOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    borderRadius: "50%",
  },

  section: {
    width: "100%",
    maxWidth: 1160,
    background: "#fff",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    marginBottom: 20,
  },

  sectionTitle: { fontSize: 14, color: "#6b7280" },

  menuItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 6px",
    cursor: "pointer",
    borderTop: "1px solid rgba(15,15,15,0.05)",
  },

  menuLeft: { display: "flex", alignItems: "center", gap: 12 },
};