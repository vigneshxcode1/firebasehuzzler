// // ClientProfileMenuScreen.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import {
//   getAuth,
//   signOut,
//   onAuthStateChanged,
// } from "firebase/auth";

// import {
//   doc,
//   getDoc,
//   updateDoc,
//   getFirestore,
// } from "firebase/firestore";

// import {
//   getStorage,
//   ref,
//   uploadBytes,
//   getDownloadURL,
// } from "firebase/storage";

// // ⭐ FIXED — REQUIRED IMAGES
// // import backarrow from "../assets/backarrow.png";
// import arrow from "../../assets/icons/arrow.png"; // ⭐ you asked for this
// import backarrow from "../../assets/icons/backarrow.png"
// import profile from "../../assets/icons/profile.png"
// import notification from "../../assets/icons/kk.png" 
// import MyServices from "../../assets/icons/MyServices.png" 
// import  pause from "../../assets/icons/paused.png" 
// import invite from "../../assets/icons/invite.png" 
// import settings from "../../assets/icons/settings.png" 
// import helpcenter from "../../assets/icons/helpcenter.png" 
// import edit from "../../assets/icons/edit.png" 
// import logout from "../../assets/icons/logout.png" 
// import MyJobs from "../../assets/icons/MyJobs.png";

// export default function ClientProfileMenuScreen() {
//   const auth = getAuth();
//   const db = getFirestore();
//   const storage = getStorage();
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [profileImage, setProfileImage] = useState("");
//   const [isUploading, setUploading] = useState(false);

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         const docRef = doc(db, "users", currentUser.uid);
//         const snapshot = await getDoc(docRef);

//         if (snapshot.exists()) {
//           const data = snapshot.data();
//           setUser(data);
//           setProfileImage(data.profileImage || "");
//         }
//       } else {
//         navigate("/firelogin");
//       }
//     });

//     return () => unsub();
//   }, []);

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setUploading(true);

//     try {
//       const imageRef = ref(storage, `users/${auth.currentUser.uid}/profile.jpg`);
//       await uploadBytes(imageRef, file);
//       const downloadURL = await getDownloadURL(imageRef);

//       await updateDoc(doc(db, "users", auth.currentUser.uid), {
//         profileImage: downloadURL,
//       });

//       setProfileImage(downloadURL);
//       alert("Profile image updated!");
//     } catch (err) {
//       alert("Image upload failed!");
//     }

//     setUploading(false);
//   };

//   const handleLogout = async () => {
//     if (window.confirm("Are you sure you want to log out?")) {
//       await signOut(auth);
//       navigate("/firelogin");
//     }
//   };

//   if (!user) {
//     return <div className="loader"></div>;
//   }

//   const fullName = `${user.firstName || ""} ${user.lastName || ""}`;

//   return (
//     <>
//       {/* ---------- CSS ---------- */}
//       <style>{`
//         .page { 
//           background:#f9fafb; 
//           min-height:100vh; 
//           padding:16px; 
//           display:flex;
//           flex-direction:column;
//           align-items:center;
//         }

//         .title { width:90%; max-width:650px; display:flex; gap:12px; margin-bottom:20px; }

//         .back-btn {
//           width:36px; height:36px;
//           background:white;
//           margin-top:14px;
//           border-radius:12px;
//           display:flex; justify-content:center; align-items:center;
//           box-shadow:0 4px 14px rgba(0,0,0,0.18);
//           cursor:pointer;
//         }

//         .profile-card { 
//           width:90%; max-width:650px;
//           background:white; 
//           border-radius:24px; 
//           padding:20px; 
//           display:flex; 
//           gap:18px;
//           align-items:center; 
//           margin-bottom:20px; 
//           box-shadow:0 10px 30px rgba(0,0,0,0.07);
//         }

//         .avatar { 
//           width:75px; height:75px; border-radius:50%; object-fit:cover;
//           border:3px solid #fff; 
//           box-shadow:0 4px 10px rgba(0,0,0,0.18);
//         }

//         .edit-btn { 
//           position:absolute; bottom:5px; right:5px; 
//           background:#7c3aed; padding:7px; border-radius:50%; cursor:pointer;
//           box-shadow:0 4px 12px rgba(0,0,0,0.22);
//         }

//         .section { 
//           width:90%; max-width:650px;
//           background:white; padding:18px 20px; border-radius:22px;
//           box-shadow:0 10px 30px rgba(0,0,0,0.06); 
//           margin-bottom:20px;
//         }

//         .menu-item { 
//           display:flex; justify-content:space-between; align-items:center;
//           padding:14px 0; cursor:pointer; 
//         }

//         .menu-left { display:flex; align-items:center; gap:14px; }
//         .arrow-img { width:18px; opacity:0.4; }

//         .logout { 
//           display:flex; align-items:center; gap:10px; 
//           margin-top:10px; color:#ef4444;
//           font-weight:600; font-size:15px; cursor:pointer;
//         }
//       `}</style>

//       {/* ---------- PAGE ---------- */}
//       <div className="page">

//         {/* HEADER */}
//         <div className="title">
//           <div className="back-btn" onClick={() => navigate(-1)}>
//             <img src={backarrow} style={{ width: 20 }} alt="back" />
//           </div>
//           <div>
//             <h1 style={{ fontSize: 22, fontWeight: 700 }}>Profile</h1>
//             <p style={{ fontSize: 13, color: "#6b7280" }}>Manage your account and preferences</p>
//           </div>
//         </div>

//         {/* PROFILE CARD */}
//         <div className="profile-card">
//           <div style={{ position: "relative" }}>
//             <img src={profileImage} className="avatar" />

//             <label className="edit-btn">
//               <span style={{ color: "white", fontSize: 12 }}><img img={edit}/></span>
//               <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
//             </label>

//             {isUploading && (
//               <div style={{
//                 position: "absolute", inset: 0,
//                 background: "rgba(0,0,0,0.4)",
//                 borderRadius: "50%",
//                 display: "flex", justifyContent: "center", alignItems: "center"
//               }}>
//                 <div className="loader" style={{ width: 25, height: 25 }}></div>
//               </div>
//             )}
//           </div>

//           <div>
//             <p style={{ fontSize: 18, fontWeight: 600 }}>{fullName}</p>
//             <p style={{ fontSize: 13, color: "#6b7280" }}>{user.email}</p>
//           </div>
//         </div>

//         {/* ACCOUNT SECTION */}
//         <div className="section">
//           <h2 style={{ fontSize: 14, color: "#6b7280" }}>My Account</h2>

//           <MenuItem
//             title="Profile Summary"
//             icon={profile}        // <-- correct
//             onClick={() => navigate("/freelance-dashboard/Profilebuilder")}
//           />


//           <MenuItem title="My Services" icon={MyServices} 
//             onClick={() => navigate("/freelance-dashboard/sidebarsaved")}
//           />

//           <MenuItem title="My Jobs" icon={MyJobs} 
//             onClick={() => navigate("/freelance-dashboard/freelancermyworks")}
//           />

//           <MenuItem title="Paused Service" icon={pause} 
//             onClick={() => navigate("/freelance-dashboard/paused-services")}
//           />

//           <MenuItem title="Invite Friends" icon={invite}  />
//         </div>

//         {/* SETTINGS */}
//         <div className="section">
//           <h2 style={{ fontSize: 14, color: "#6b7280" }}>Settings</h2>

//           <MenuItem title="Notifications" icon={notification}  />

//           <MenuItem
//             title="Account Settings"
//             icon={settings} 
//             onClick={() => navigate("/freelance-dashboard/settings")}
//           />

//           <MenuItem title="Help Center" icon={helpcenter}  />

//           <div className="logout" onClick={handleLogout}>
//             <img icon={logout}  width={20} />
//             Sign Out
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// /* Menu Item Component */
// function MenuItem({ title, icon, onClick }) {
//   return (
//     <div className="menu-item" onClick={onClick}>
//       <div className="menu-left">
//         <img src={icon} />
//         <span>{title}</span>
//       </div>

//       {/* ⭐ USING YOUR ARROW IMAGE */}
//       <img src={arrow} className="arrow-img" />
//     </div>
//   );
// }

// ClientProfileMenuScreen.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc, updateDoc, getFirestore } from "firebase/firestore";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// // assets (keep paths as in your project)
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

// export default function ClientProfileMenuScreen() {
//   const auth = getAuth();
//   const db = getFirestore();
//   const storage = getStorage();
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [profileImage, setProfileImage] = useState("");
//   const [isUploading, setUploading] = useState(false);

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         try {
//           const docRef = doc(db, "users", currentUser.uid);
//           const snapshot = await getDoc(docRef);
//           if (snapshot.exists()) {
//             const data = snapshot.data();
//             setUser(data);
//             setProfileImage(data.profileImage || "");
//           } else {
//             setUser({ email: currentUser.email });
//           }
//         } catch (err) {
//           console.error("load user error", err);
//         }
//       } else {
//         navigate("/firelogin");
//       }
//     });

//     return () => unsub();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const handleImageUpload = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setUploading(true);
//     try {
//       const uid = auth.currentUser?.uid;
//       if (!uid) throw new Error("Not logged in");

//       const imageRef = ref(storage, `users/${uid}/profile.jpg`);
//       await uploadBytes(imageRef, file);
//       const downloadURL = await getDownloadURL(imageRef);

//       await updateDoc(doc(db, "users", uid), { profileImage: downloadURL });
//       setProfileImage(downloadURL);
//       alert("Profile image updated!");
//     } catch (err) {
//       console.error("upload error", err);
//       alert("Image upload failed!");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleLogout = async () => {
//     if (!window.confirm("Are you sure you want to log out?")) return;
//     try {
//       await signOut(auth);
//       navigate("/firelogin");
//     } catch (err) {
//       console.error("logout error", err);
//       alert("Logout failed");
//     }
//   };

//   if (!user) {
//     return (
//       <div style={pageStyles.centerLoader}>
//         <div style={pageStyles.loader} />
//       </div>
//     );
//   }

//   const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.name || "Helen Angel";

//   return (
//     <div style={pageStyles.page}>
//       {/* Header */}
//       <div style={pageStyles.titleWrap}>
//         <div style={pageStyles.backBtn} onClick={() => navigate(-1)} title="Back">
//           <img src={backarrow} alt="back" style={{ width: 20, height: 20 }} />
//         </div>
//         <div style={{ marginLeft: 12 }}>
//           <h1 style={pageStyles.title}>Profile</h1>
//           <p style={pageStyles.subtitle}>Manage your account and preferences</p>
//         </div>
//       </div>

//       {/* Profile Card */}
//       <div style={pageStyles.profileCard}>
//         <div style={{ position: "relative", width: 80 }}>
//           <img
//             src={profileImage || profilePlaceholder}
//             alt="avatar"
//             style={pageStyles.avatar}
//             onError={(e) => {
//               e.currentTarget.src = profilePlaceholder;
//             }}
//           />

//           <label style={pageStyles.editBtn} title="Edit profile">
//             <img src={editIcon} alt="edit" style={{ width: 70, height: 40 }} />
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageUpload}
//               style={{ display: "none" }}
//             />
//           </label>

//           {isUploading && (
//             <div style={pageStyles.uploadOverlay}>
//               <div style={pageStyles.smallLoader} />
//             </div>
//           )}
//         </div>

//         <div style={{ marginLeft: 16 }}>
//           <div style={{ fontSize: 18, fontWeight: 600, color: "#0A0A0A" }}>{fullName}</div>
//           <div style={{ marginTop: 6, color: "#6b7280" }}>{user.email}</div>
//         </div>
//       </div>

//       {/* My Account Section */}
//       <div style={pageStyles.section}>
//         <h3 style={pageStyles.sectionTitle}>My Account</h3>

//         <MenuItem
//           title="Profile Summary"
//           icon={profilePlaceholder}
//           onClick={() => navigate("/freelance-dashboard/Profilebuilder")}
//         />

//         <MenuItem
//           title="My Services"
//           icon={MyServices}
//           onClick={() => navigate("/freelance-dashboard/sidebarsaved")}
//         />

//         <MenuItem
//           title="My Jobs"
//           icon={MyJobs}
//           onClick={() => navigate("/freelance-dashboard/freelancermyworks")}
//         />

//         <MenuItem
//           title="Paused Service"
//           icon={pause}
//           onClick={() => navigate("/freelance-dashboard/paused-services")}
//         />

//         <MenuItem title="Invite friends" icon={invite} onClick={() => {}} />
//       </div>

//       {/* Settings Section */}
//       <div style={pageStyles.section}>
//         <h3 style={pageStyles.sectionTitle}>Settings</h3>

//         <MenuItem title="Notifications" icon={notification} onClick={() => {}} />
//         <MenuItem
//           title="Account Settings"
//           icon={settings}
//           onClick={() => navigate("/freelance-dashboard/settings")}
//         />
//         <MenuItem title="Help Center" icon={helpcenter} onClick={() => {}} />
//         <MenuItem title="LEGAL" icon={helpcenter} onClick={() => {}} />

//         <div style={{ marginTop: 12 }}>
//           <div style={pageStyles.logoutRow} onClick={handleLogout}>
//             <img src={logoutIcon} alt="logout" style={{ width: 18, height: 18, opacity: 0.9 }} />
//             <span style={{ marginLeft: 10, color: "#ef4444", fontWeight: 600 }}>Sign out</span>
//             <img src={arrow} alt="arrow" style={{ width: 16, marginLeft: "auto", opacity: 0.25 }} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* Menu Item Component */
// function MenuItem({ title, icon, onClick }) {
//   return (
//     <div style={pageStyles.menuItem} onClick={onClick}>
//       <div style={pageStyles.menuLeft}>
//         <img
//           src={icon}
//           alt={title}
//           style={{ width: 18, height: 18, objectFit: "contain", opacity: 0.9 }}
//         />
//         <span style={{ color: "#111827" }}>{title}</span>
//       </div>
//       <img src={arrow} alt="arrow" style={{ width: 16, opacity: 0.18 }} />
//     </div>
//   );
// }

// /* Styles */
// const pageStyles = {
//   page: {
//     minHeight: "100vh",
//     background: "linear-gradient(180deg,#fff,#fff)",
//     padding: 20,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     fontFamily: "'Rubik', Inter, system-ui, -apple-system, sans-serif",
//   },
//   titleWrap: {
//     width: "90%",
//     maxWidth: 1160,
//     display: "flex",
//     alignItems: "center",
//     marginBottom: 18,
//   },
//   backBtn: {
//     width: 40,
//     height: 40,
//     background: "#fff",
//     marginLeft:"-60px",
//     borderRadius: 12,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
//     cursor: "pointer",
//   },
//   title: { fontSize: 28, margin: 0, fontWeight: 700, color: "#0A0A0A" },
//   subtitle: { margin: 0, marginTop: 6, fontSize: 13, color: "#6b7280" },

//   profileCard: {
//     width: "90%",
//     maxWidth: 1160,
//     marginLeft:"30px",
//     background: "#fff",
//     borderRadius: 18,
//     padding: 18,
//     display: "flex",
//     alignItems: "center",
//     gap: 18,
//     boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
//     marginBottom: 20,
//     position: "relative",
//   },
//   avatar: {
//     width: 75,
//     height: 75,
//     borderRadius: "50%",
//     objectFit: "cover",
//     border: "3px solid #fff",
//     boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
//   },
//   editBtn: {
//     position: "absolute",
//     right: -5,
//     bottom: -16,
//     // background: "#7c3aed",
//     width: 34,
//     height: 34,
//     // borderRadius: "50%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     cursor: "pointer",
//     // boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
//   },

//   uploadOverlay: {
//     position: "absolute",
//     inset: 0,
//     background: "rgba(0,0,0,0.35)",
//     borderRadius: "50%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   smallLoader: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     border: "3px solid rgba(255,255,255,0.35)",
//     borderTopColor: "#fff",
//     animation: "spin 1s linear infinite",
//   },

//   section: {
//     width: "90%",
//     maxWidth: 1160,
//     background: "#fff",
//     borderRadius: 18,
//     marginLeft:"30px",
//     padding: 18,
//     boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
//     marginBottom: 20,
//   },
//   sectionTitle: { fontSize: 14, color: "#6b7280", margin: "6px 0 12px 0" },

//   menuItem: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "12px 6px",
//     cursor: "pointer",
//     borderTop: "1px solid rgba(15,15,15,0.03)",
//   },
//   menuLeft: { display: "flex", alignItems: "center", gap: 12, color: "#111827" },

//   logoutRow: {
//     display: "flex",
//     alignItems: "center",
//     padding: "10px 6px",
//     cursor: "pointer",
//     borderTop: "1px solid rgba(15,15,15,0.03)",
//   },

//   // loader if user null
//   centerLoader: {
//     minHeight: "40vh",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   loader: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     border: "5px solid rgba(0,0,0,0.08)",
//     borderTopColor: "#7c3aed",
//     animation: "spin 1s linear infinite",
//   },
// };

// /* tiny keyframes injection for spinner - inject once */
// (function injectKeyframes() {
//   if (typeof document === "undefined") return;
//   if (document.getElementById("cpms-keyframes")) return;
//   const s = document.createElement("style");
//   s.id = "cpms-keyframes";
//   s.innerHTML = `
//     @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
//   `;
//   document.head.appendChild(s);
// })();


// ClientProfileMenuScreen.jsx
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

export default function ClientProfileMenuScreen() {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [isUploading, setUploading] = useState(false);

  // ⭐ 1️⃣ SIDEBAR COLLAPSED STATE
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  // ⭐ 2️⃣ LISTEN FOR SIDEBAR TOGGLE EVENT
  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle);

    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const snapshot = await getDoc(docRef);
          if (snapshot.exists()) {
            const data = snapshot.data();
            setUser(data);
            setProfileImage(data.profileImage || "");
          } else {
            setUser({ email: currentUser.email });
          }
        } catch (err) {
          console.error("load user error", err);
        }
      } else {
        navigate("/firelogin");
      }
    });

    return () => unsub();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("Not logged in");

      const imageRef = ref(storage, `users/${uid}/profile.jpg`);
      await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(imageRef);

      await updateDoc(doc(db, "users", uid), { profileImage: downloadURL });
      setProfileImage(downloadURL);
      alert("Profile image updated!");
    } catch (err) {
      console.error("upload error", err);
      alert("Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    try {
      await signOut(auth);
      navigate("/firelogin");
    } catch (err) {
      console.error("logout error", err);
      alert("Logout failed");
    }
  };

  if (!user) {
    return (
      <div style={pageStyles.centerLoader}>
        <div style={pageStyles.loader} />
      </div>
    );
  }

  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    user.name ||
    "Helen Angel";

  // ⭐ 3️⃣ WRAP WHOLE UI INSIDE ANIMATED SIDEBAR MARGIN
  return (
    <div
      className="freelance-wrapper"
      style={{
        marginLeft: collapsed ? "-160px" : "100px",
        transition: "margin-left 0.25s ease",
      }}
    >
      <div style={pageStyles.page}>
        {/* Header */}
        <div style={pageStyles.titleWrap}>
          <div
            style={pageStyles.backBtn}
            onClick={() => navigate(-1)}
            title="Back"
          >
            <img src={backarrow} alt="back" style={{ width: 20, height: 20 }} />
          </div>
          <div style={{ marginLeft: 12 }}>
            <h1 style={pageStyles.title}>Profile</h1>
            <p style={pageStyles.subtitle}>
              Manage your account and preferences
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div style={pageStyles.profileCard}>
          <div style={{ position: "relative", width: 80 }}>
            <img
              src={profileImage || profilePlaceholder}
              alt="avatar"
              style={pageStyles.avatar}
              onError={(e) => {
                e.currentTarget.src = profilePlaceholder;
              }}
            />

            <label style={pageStyles.editBtn} title="Edit profile">
              <img
                src={editIcon}
                alt="edit"
                style={{ width: 70, height: 40 }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </label>

            {isUploading && (
              <div style={pageStyles.uploadOverlay}>
                <div style={pageStyles.smallLoader} />
              </div>
            )}
          </div>

          <div style={{ marginLeft: 16 }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#0A0A0A",
              }}
            >
              {fullName}
            </div>
            <div style={{ marginTop: 6, color: "#6b7280" }}>
              {user.email}
            </div>
          </div>
        </div>

        {/* My Account Section */}
        <div style={pageStyles.section}>
          <h3 style={pageStyles.sectionTitle}>My Account</h3>

          <MenuItem
            title="Profile Summary"
            icon={profilePlaceholder}
            onClick={() => navigate("/freelance-dashboard/Profilebuilder")}
          />

          <MenuItem
            title="My Services"
            icon={MyServices}
            onClick={() => navigate("/freelance-dashboard/sidebarsaved")}
          />

          <MenuItem
            title="My Jobs"
            icon={MyJobs}
            onClick={() => navigate("/freelance-dashboard/freelancermyworks")}
          />

          <MenuItem
            title="Paused Service"
            icon={pause}
            onClick={() => navigate("/freelance-dashboard/paused-services")}
          />

          <MenuItem
            title="Invite friends"
            icon={invite}
            onClick={() => {
              const url = window.location.href;

              if (navigator.share) {
                navigator.share({
                  title: "Invite to my app",
                  text: "Join using this link:",
                  url: url,
                });
              } else {
                navigator.clipboard.writeText(url);
                alert("Invite link copied to clipboard!");
              }
            }}
          />

        </div>

        {/* Settings Section */}
        <div style={pageStyles.section}>
          <h3 style={pageStyles.sectionTitle}>Settings</h3>

          <MenuItem title="Notifications" icon={notification} onClick={() => { }} />

          <MenuItem
            title="Account Settings"
            icon={settings}
            onClick={() => navigate("/freelance-dashboard/settings")}
          />

          <MenuItem title="Help Center" icon={helpcenter} onClick={() => {navigate("/freelance-dashboard/helpcenter") }}/>
          <MenuItem title="LEGAL" icon={helpcenter} onClick={() => {navigate("/freelance-dashboard/helpcenter") }} />

          <div style={{ marginTop: 12 }}>
            <div style={pageStyles.logoutRow} onClick={handleLogout}>
              <img
                src={logoutIcon}
                alt="logout"
                style={{ width: 18, height: 18, opacity: 0.9 }}
              />
              <span style={{ marginLeft: 10, color: "#ef4444", fontWeight: 600 }}>
                Sign out
              </span>
              <img
                src={arrow}
                alt="arrow"
                style={{ width: 16, marginLeft: "auto", opacity: 0.25 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Menu Item Component */
function MenuItem({ title, icon, onClick }) {
  return (
    <div style={pageStyles.menuItem} onClick={onClick}>
      <div style={pageStyles.menuLeft}>
        <img
          src={icon}
          alt={title}
          style={{ width: 18, height: 18, objectFit: "contain", opacity: 0.9 }}
        />
        <span style={{ color: "#111827" }}>{title}</span>
      </div>
      <img src={arrow} alt="arrow" style={{ width: 16, opacity: 0.18 }} />
    </div>
  );
}

/* Styles */
const pageStyles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg,#fff,#fff)",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "'Rubik', Inter, system-ui",
  },
  titleWrap: {
    width: "90%",
    maxWidth: 1160,
    display: "flex",
    alignItems: "center",
    marginBottom: 18,
  },
  backBtn: {
    width: 40,
    height: 40,
    background: "#fff",
    marginLeft: "-60px",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    cursor: "pointer",
  },
  title: { fontSize: 28, margin: 0, fontWeight: 700, color: "#0A0A0A" },
  subtitle: { margin: 0, marginTop: 6, fontSize: 13, color: "#6b7280" },

  profileCard: {
    width: "90%",
    maxWidth: 1160,
    marginLeft: "30px",
    background: "#fff",
    borderRadius: 18,
    padding: 18,
    display: "flex",
    alignItems: "center",
    gap: 18,
    boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
    marginBottom: 20,
    position: "relative",
  },

  avatar: {
    width: 75,
    height: 75,
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #fff",
    boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
  },

  editBtn: {
    position: "absolute",
    right: -5,
    bottom: -16,
    width: 34,
    height: 34,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  uploadOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  smallLoader: {
    width: 20,
    height: 20,
    borderRadius: 10,
    border: "3px solid rgba(255,255,255,0.35)",
    borderTopColor: "#fff",
    animation: "spin 1s linear infinite",
  },

  section: {
    width: "90%",
    maxWidth: 1160,
    background: "#fff",
    borderRadius: 18,
    marginLeft: "30px",
    padding: 18,
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    marginBottom: 20,
  },

  sectionTitle: { fontSize: 14, color: "#6b7280", margin: "6px 0 12px 0" },

  menuItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 6px",
    cursor: "pointer",
    borderTop: "1px solid rgba(15,15,15,0.03)",
  },

  menuLeft: { display: "flex", alignItems: "center", gap: 12 },

  logoutRow: {
    display: "flex",
    alignItems: "center",
    padding: "10px 6px",
    cursor: "pointer",
    borderTop: "1px solid rgba(15,15,15,0.03)",
  },

  centerLoader: {
    minHeight: "40vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loader: {
    width: 44,
    height: 44,
    borderRadius: 22,
    border: "5px solid rgba(0,0,0,0.08)",
    borderTopColor: "#7c3aed",
    animation: "spin 1s linear infinite",
  },
};

/* Keyframes for loader */
(function injectKeyframes() {
  if (typeof document === "undefined") return;
  if (document.getElementById("cpms-keyframes")) return;
  const s = document.createElement("style");
  s.id = "cpms-keyframes";
  s.innerHTML = `
    @keyframes spin { 
      from { transform: rotate(0deg); } 
      to { transform: rotate(360deg); } 
    }
  `;
  document.head.appendChild(s);
})();
