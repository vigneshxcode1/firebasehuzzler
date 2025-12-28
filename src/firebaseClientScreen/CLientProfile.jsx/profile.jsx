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

// import profile from "../../assets/profile.png";
// import saved from "../../assets/saved.png";
// import jobposted from "../../assets/jobposted.png";
// import hiring from "../../assets/hiring.png";
// import paused2 from "../../assets/paused2.png";
// import invitefriends from "../../assets/invitefriends.png";
// import bell from "../../assets/kk.png";
// import settings from "../../assets/settings.png";
// import helpcenter from "../../assets/helpcenter.png";


// export default function ClientProfileMenuScreen() {
//   const auth = getAuth();
//   const db = getFirestore();
//   const storage = getStorage();
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [profileImage, setProfileImage] = useState("");
//   const [isUploading, setUploading] = useState(false);

//   // ---------------- Get User Data ----------------
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
//         navigate("/login");
//       }
//     });

//     return () => unsub();
//   }, []);

//   // ---------------- Upload Profile Image ----------------
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

//   // ---------------- Delete Account ----------------
//   const handleDeleteAccount = async () => {
//     const user = auth.currentUser;
//     if (!user) return alert("No user logged in");

//     const c1 = window.confirm("Are you sure you want to permanently delete your account?");
//     if (!c1) return;

//     const c2 = window.confirm("This action cannot be undone. Delete account?");
//     if (!c2) return;

//     try {
//       await updateDoc(doc(db, "users", user.uid), { deleted: true });
//       await user.delete();

//       alert("Your account has been deleted permanently.");
//       navigate("/login");

//     } catch (error) {
//       if (error.code === "auth/requires-recent-login") {
//         alert("Please log in again before deleting your account.");
//         navigate("/firelogin");
//       } else {
//         alert("Failed to delete account. Try again.");
//       }
//     }
//   };

//   // ---------------- Logout ----------------
//   const handleLogout = async () => {
//     if (window.confirm("Are you sure you want to log out?")) {
//       await signOut(auth);
//       navigate("/firelogin");
//     }
//   };

//   if (!user) {
//     return (
//       <div className="loader-screen">
//         <div className="loader"></div>
//       </div>
//     );
//   }

//   const fullName = `${user.firstName || ""} ${user.lastName || ""}`;

//   return (
//     <div className="main-page">

//       {/* ---------------- Header ---------------- */}
//       <div className="header-container">
//         <div className="head">
//           <h1 className="profile1">Profile</h1>
//           <h1 className="profile2">Manage your account and preferences</h1>
//         </div>

//         <div className="profile-row">

//           {/* Profile Image */}
//           <div className="profile-img-wrapper">

//             <img
//               src={profileImage || profile}
//               className="profile-img"
//               alt="profile"
//             />

//             <label className="edit-icon-btn">
//               <img src="/assets/icons/edit.svg" className="w-4 h-4" />
//               <input
//                 type="file"
//                 accept="image/*"
//                 className="profile-upload-input"
//                 onChange={handleImageUpload}
//               />
//             </label>

//             {isUploading && (
//               <div className="upload-overlay">
//                 <div className="loader-small"></div>
//               </div>
//             )}
//           </div>

//           <div className="section-profile">
//             <h2 className="profile-name">{fullName || "User"}</h2>
//             <p className="profile-email">{user.email}</p>
//           </div>

//         </div>
//       </div>

//       {/* ---------------- Content Sections ---------------- */}
//       <div className="content-wrapper">

//         {/* My Account */}
//         <div className="section-card">
//           <h3 className="section-title">My Account</h3>

//           {/* FIXED: THIS WORKS NOW */}
//           <MenuItem
//             img={profile}
//             title="Profile Summary"
//             onClick={() => navigate("/client-dashbroad2/CompanyProfileScreen")}
//           />

//           <MenuItem
//             img={saved}
//             title="Saved"
//             onClick={() => navigate("/client-dashbroad2/saved")}
//           />

//           <MenuItem
//             img={jobposted}
//             title="Job Posted"
//             onClick={() => navigate("/client-dashbroad2/PostJob")}
//           />

//           <MenuItem
//             img={hiring}
//             title="Hires"
//             onClick={() => navigate("/my-hires")}
//           />

//           <MenuItem
//             img={paused2}
//             title="Paused Project"
//             onClick={() => navigate("/client-dashbroad2/clientpausedjobs")}
//           />

//           <MenuItem
//             img={invitefriends}
//             title="Invite friends"
//           />
//         </div>

//         {/* Settings */}
//         <div className="section-card2">
//           <h3 className="section-title">Settings</h3>

//           <MenuItem
//             img={bell}
//             title="Notifications"
//             onClick={() => alert("Open browser settings for notification")}
//           />

//           <MenuItem
//             img={settings}
//             title="Account Settings"
//             onClick={() => navigate("/client-dashbroad2/clientsetting")}
//           />

//           <MenuItem
//             img={helpcenter}
//             title="Help Center"
//           />
//         </div>

//         <div className="section-card1">
//           <div className="logout-btn" onClick={handleLogout}>
//             <img
//               src="/assets/profile_icon/Log_Out.svg"
//               className="logout-icon"
//               alt=""
//             />
//             Log Out
//           </div>

//           <div className="logout-btn" onClick={handleDeleteAccount}>
//             <img
//               src="/assets/profile_icon/Log_Out.svg"
//               className="logout-icon-delete"
//               alt=""
//             />
//             delete account
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ---------------- Menu Item Component ----------------
// function MenuItem({ img, icon, title, onClick }) {
//   return (
//     <div className="menu-item" onClick={onClick}>
//       <div className="menu-item-left">

//         {/* FIXED: supports both img + icon */}
//         <img src={img || icon} alt={title} className="menu-icon" />

//         <span>{title}</span>
//       </div>

//       <img
//         src="/assets/icons/arrow-right.svg"
//         className="menu-arrow"
//         alt=""
//       />
//     </div>
//   );
// }


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

// // ----- ICONS -----
// import profile from "../../assets/profile.png";
// import saved from "../../assets/saved.png";
// import jobposted from "../../assets/jobposted.png";
// import hiring from "../../assets/hiring.png";
// import paused2 from "../../assets/paused2.png";
// import invitefriends from "../../assets/invitefriends.png";
// import bell from "../../assets/kk.png";
// import settings from "../../assets/settings.png";
// import helpcenter from "../../assets/helpcenter.png";
// import arrow from "../../assets/arrow.png";   // ADD ARROW IMAGE

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
//         navigate("/login");
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
//       const url = await getDownloadURL(imageRef);

//       await updateDoc(doc(db, "users", auth.currentUser.uid), {
//         profileImage: url,
//       });

//       setProfileImage(url);
//     } catch (err) {
//       alert("Upload failed!");
//     }
//     setUploading(false);
//   };

//   const handleLogout = async () => {
//     if (window.confirm("Log out?")) {
//       await signOut(auth);
//       navigate("/firelogin");
//     }
//   };

//   const handleDeleteAccount = async () => {
//     alert("Your backend logic stays SAME.");
//   };

//   if (!user) return <div>Loading...</div>;

//   const fullName = `${user.firstName || ""} ${user.lastName || ""}`;

//   return (
//     <div className="profile-main">

//       {/* HEADER SECTION */}
//       <div className="profile-header-card">
//         <div className="profile-header-text">
//           <h2>Profile</h2>
//           <p>Manage your account and preferences</p>
//         </div>

//         {/* PROFILE */}
//         <div className="profile-flex">
//           <div className="profile-pic-wrap">
//             <img src={profileImage || profile} className="profile-pic" />

//             <label className="edit-btn">
//               <input
//                 type="file"
//                 accept="image/*"
//                 className="hidden-input"
//                 onChange={handleImageUpload}
//               />
//             </label>

//             {isUploading && <div className="upload-overlay">Uploading…</div>}
//           </div>

//           <div>
//             <h3 className="prof-name">{fullName}</h3>
//             <p className="prof-email">{user.email}</p>
//           </div>
//         </div>
//       </div>

//       {/* CONTENT SECTION */}
//       <div className="profile-section">

//         {/* MY ACCOUNT CARD */}
//         <div className="profile-card">
//           <h3 className="section-title">My Account</h3>

//           <MenuItem img={profile} title="Profile Summary"
//             onClick={() => navigate("/client-dashbroad2/companyprofileview")}
//           />

//           <MenuItem img={saved} title="Saved"
//             onClick={() => navigate("/client-dashbroad2/saved")}
//           />

//           <MenuItem img={jobposted} title="Job posted"
//             onClick={() => navigate("/client-dashbroad2/PostJob")}
//           />

//           <MenuItem img={hiring} title="Hiring"
//             onClick={() => navigate("/my-hires")}
//           />

//           <MenuItem img={paused2} title="Paused Service"
//             onClick={() => navigate("/client-dashbroad2/clientpausedjobs")}
//           />

//           <MenuItem img={invitefriends} title="Invite friends" />
//         </div>

//         {/* SETTINGS CARD */}
//         <div className="profile-card">
//           <h3 className="section-title">Settings</h3>

//           <MenuItem img={bell} title="Notifications" />
//           <MenuItem img={settings} title="Account Settings"
//             onClick={() => navigate("/client-dashbroad2/clientsetting")}
//           />
//           <MenuItem img={helpcenter} title="Help Center" />
//         </div>

//         {/* LOGOUT + DELETE */}
//         <div className="profile-card">
//           <div className="logout-row red" onClick={handleLogout}>
//             <span>Sign out</span>
//             <img src={arrow} className="arrow" />
//           </div>

//           <div className="delete-row" onClick={handleDeleteAccount}>
//             Delete Account
//           </div>
//         </div>
//       </div>

//       {/* Inject CSS */}
//       <style>{cssCode}</style>
//     </div>
//   );
// }

// function MenuItem({ img, title, onClick }) {
//   return (
//     <div className="menu-item" onClick={onClick}>
//       <div className="menu-left">
//         <img src={img} className="menu-icon" />
//         <span>{title}</span>
//       </div>
//       <img src={arrow} className="arrow" />
//     </div>
//   );
// }

// const cssCode = `
// .profile-main {
//   padding: 20px;
//   background: #fff;
// }

// .profile-header-card {
//   background: #ffffff;
//   border-radius: 18px;
//   padding: 22px;
//   box-shadow: 0 6px 28px rgba(0,0,0,0.08);
//   margin-bottom: 20px;
// }

// .profile-header-text h2 {
//   font-size: 22px;
//   margin: 0;
// }

// .profile-header-text p {
//   margin: 4px 0 20px;
//   font-size: 13px;
//   color: #555;
// }

// .profile-flex {
//   display: flex;
//   gap: 16px;
//   align-items: center;
// }

// .profile-pic-wrap {
//   position: relative;
// }

// .profile-pic {
//   width: 68px;
//   height: 68px;
//   border-radius: 50%;
//   object-fit: cover;
// }

// .edit-btn {
//   position: absolute;
//   bottom: 0;
//   right: 0;
//   background: #000000aa;
//   width: 26px;
//   height: 26px;
//   border-radius: 50%;
//   cursor: pointer;
// }

// .hidden-input {
//   width: 100%;
//   height: 100%;
//   opacity: 0;
// }

// .prof-name {
//   font-size: 18px;
//   font-weight: 600;
// }

// .prof-email {
//   font-size: 13px;
//   color: #555;
// }

// .profile-section {
//   margin-top: 10px;
// }

// .profile-card {
//   background: #ffffff;
//   border-radius: 18px;
//   box-shadow: 0 6px 28px rgba(0,0,0,0.06);
//   padding: 14px 18px;
//   margin-bottom: 20px;
// }

// .section-title {
//   font-size: 15px;
//   color: #222;
//   margin-bottom: 12px;
// }

// .menu-item {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 12px 0;
//   cursor: pointer;
// }

// .menu-left {
//   display: flex;
//   align-items: center;
//   gap: 12px;
// }

// .menu-icon {
//   width: 22px;
//   height: 22px;
// }

// .arrow {
//   width: 20px;
//   height: 20px;
//   opacity: 1.6;
// }

// .logout-row {
//   padding: 12px 0;
//   display: flex;
//   justify-content: space-between;
//   cursor: pointer;
// }

// .red {
//   color: red;
//   font-weight: 600;
// }

// .delete-row {
//   margin-top: 6px;
//   padding: 12px 0;
//   color: red;
//   cursor: pointer;
//   font-weight: 600;
// }
// `;



// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
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
// // ----- ICONS -----
// import profile from "../../assets/profile.png";
// import saved from "../../assets/save2.png";
// import jobposted from "../../assets/jobposted.png";
// import hiring from "../../assets/hiring.png";
// import paused2 from "../../assets/paused2.png";
// import invitefriends from "../../assets/invitefriends.png";
// import bell from "../../assets/kk.png";
// import settings from "../../assets/settings.png";
// import helpcenter from "../../assets/helpcenter.png";
// import arrow from "../../assets/arrow.png";   // ADD ARROW IMAGE
// import edit from "../../assets/edit.png";   // ADD ARROW IMAGE
// import blocked from "../../assets/blocked.png";   // ADD ARROW IMAGE

// export default function ClientProfileMenuScreen() {
//   const auth = getAuth();
//   const db = getFirestore();
//   const storage = getStorage();
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [profileImage, setProfileImage] = useState("");
//   const [isUploading, setUploading] = useState(false);

//   // ✅ 1️⃣ SIDEBAR COLLAPSED STATE
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   // ✅ 2️⃣ LISTEN FOR SIDEBAR TOGGLE
//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

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
//         navigate("/login");
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
//       const url = await getDownloadURL(imageRef);

//       await updateDoc(doc(db, "users", auth.currentUser.uid), {
//         profileImage: url,
//       });

//       setProfileImage(url);
//     } catch (err) {
//       alert("Upload failed!");
//     }
//     setUploading(false);
//   };

//   const handleLogout = async () => {
//     if (window.confirm("Log out?")) {
//       await signOut(auth);
//       navigate("/firelogin");
//     }
//   };

//   const handleDeleteAccount = async () => {
//     alert("Your backend logic stays SAME.");
//   };

//   if (!user) return <div>Loading...</div>;

//   const fullName = `${user.firstName || ""} ${user.lastName || ""}`;

//   // ✅ 3️⃣ WRAP WHOLE UI INSIDE MARGIN LEFT
//   return (
//     <div
//       className="profile-main"
//       style={{
//         marginLeft: collapsed ? "-110px" : "100px",
//         transition: "margin-left 0.25s ease",
//       }}
//     >

//       {/* HEADER SECTION */}
//       <div className="profile-header-card">
//         <div className="profile-header-text">
//           <h2>Profile</h2>
//           <p>Manage your account and preferences</p>
//         </div>

//         {/* PROFILE */}
//         <div className="profile-flex">
//           <div className="profile-pic-wrap">
//             <img src={profileImage || profile} className="profile-pic" />

//             <label className="edit-btn">
//               <img src={edit} alt="edit" style={{ width: "40px", margin: "8px" }} />
//               <input
//                 type="file"
//                 className="hidden-input"
//                 onChange={handleImageUpload}
//               />
//             </label>


//             {isUploading && <div className="upload-overlay">Uploading…</div>}
//           </div>

//           <div>
//             <h3 className="prof-name">{fullName}</h3>
//             <p className="prof-email">{user.email}</p>
//           </div>
//         </div>
//       </div>

//       {/* CONTENT SECTION */}
//       <div className="profile-section">

//         {/* MY ACCOUNT CARD */}
//         <div className="profile-card">
//           <h3 className="section-title">My Account</h3>

//           <MenuItem img={profile} title="Profile Summary"
//             onClick={() => navigate("/client-dashbroad2/companyprofileview")}
//           />
//           <MenuItem
//             style={{ width: "50%" }}
//             img={saved}
//             title="Saved"
//             onClick={() => navigate("/client-dashbroad2/saved")}
//           />


//           <MenuItem img={jobposted} title="Job posted"
//             onClick={() => navigate("/client-dashbroad2/PostJob")}
//           />

//           <MenuItem img={hiring} title="Hiring"
//             onClick={() => navigate("/my-hires")}
//           />

//           <MenuItem img={paused2} title="Paused Service"
//             onClick={() => navigate("/client-dashbroad2/clientpausedjobs")}
//           />

//           <MenuItem img={invitefriends} title="Invite friends" />

//           <MenuItem img={blocked} title="Blocked" onClick={() => navigate("/client-dashbroad2/profilemenuscreen")} />

//         </div>

//         {/* SETTINGS CARD */}
//         <div className="profile-card">
//           <h3 className="section-title">Support</h3>

//           <MenuItem img={bell} title="Notifications" onClick={() => navigate("/client-dashbroad2/helpcenter1")} />
//           <MenuItem img={settings} title="Account Settings"
//             onClick={() => navigate("/client-dashbroad2/companyprofileview")}
//           />
//           <MenuItem img={helpcenter} title="Help Centerr" onClick={() => navigate("/client-dashbroad2/helpcenter")} />
//           <MenuItem img={helpcenter} title="Terms Of Service" onClick={() => navigate("/termsofservice")} />
//           <MenuItem img={helpcenter} title="Privacy Policy" onClick={() => navigate("/privacypolicy")} />
//         </div>

//         {/* LOGOUT + DELETE */}
//         <div className="profile-card">
//           <div className="logout-row red" onClick={handleLogout}>
//             <span>Sign out</span>
//             <img src={arrow} className="arrow" />
//           </div>

//           <div className="delete-row" onClick={handleDeleteAccount}>
//             Delete Account
//           </div>
//         </div>
//       </div>

//       {/* Inject CSS */}
//       <style>{cssCode}</style>
//     </div>
//   );
// }

// function MenuItem({ img, title, onClick }) {
//   return (
//     <div className="menu-item" onClick={onClick}>
//       <div className="menu-left">
//         <img src={img} className="menu-icon" />
//         <span>{title}</span>
//       </div>
//       <img src={arrow} className="arrow" />
//     </div>
//   );
// }

// const cssCode = `
// .profile-main {
//   padding: 20px;
//   background: #fff;
// }

// .profile-header-card {
//   background: #ffffff;
//   border-radius: 18px;
//   padding: 22px;
//   box-shadow: 0 6px 28px rgba(0,0,0,0.08);
//   margin-bottom: 20px;
// }

// .profile-header-text h2 {
//   font-size: 22px;
//   margin: 0;
// }

// .profile-header-text p {
//   margin: 4px 0 20px;
//   font-size: 13px;
//   color: #555;
// }

// .profile-flex {
//   display: flex;
//   gap: 16px;
//   align-items: center;
// }

// .profile-pic-wrap {
//   position: relative;
// }

// .profile-pic {
//   width: 68px;
//   height: 68px;
//   border-radius: 50%;
//   object-fit: cover;
// }

// .edit-btn {
//   position: absolute;
//   bottom: 0;
//   right: 0;
//   width: 30px;
//   height: 26px;
//   border-radius: 50%;
//   cursor: pointer;
// }

// .hidden-input {
//   width: 100%;
//   height: 100%;
//   opacity: 0;
// }

// .prof-name {
//   font-size: 18px;
//   font-weight: 600;
// }

// .prof-email {
//   font-size: 13px;
//   color: #555;
// }

// .profile-section {
//   margin-top: 10px;
// }

// .profile-card {
//   background: #ffffff;
//   border-radius: 18px;
//   box-shadow: 0 6px 28px rgba(0,0,0,0.06);
//   padding: 14px 18px;
//   margin-bottom: 20px;
// }

// .section-title {
//   font-size: 15px;
//   color: #222;
//   margin-bottom: 12px;
// }

// .menu-item {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 12px 0;
//   cursor: pointer;
// }

// .menu-left {
//   display: flex;
//   align-items: center;
//   gap: 12px;
// }

// .menu-icon {
//   width: 22px;
//   height: 22px;
// }

// .arrow {
//   width: 20px;
//   height: 20px;
//   opacity: 1.6;
// }

// .logout-row {
//   padding: 12px 0;
//   display: flex;
//   justify-content: space-between;
//   cursor: pointer;
// }

// .red {
//   color: red;
//   font-weight: 600;
// }

// .delete-row {
//   margin-top: 6px;
//   padding: 12px 0;
//   color: red;
//   cursor: pointer;
//   font-weight: 600;
// }
// `;





import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  getFirestore,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
// ----- ICONS -----
import profile from "../../assets/profile.png";
import saved from "../../assets/save2.png";
import jobposted from "../../assets/jobposted.png";
import hiring from "../../assets/hiring.png";
import paused2 from "../../assets/paused2.png";
import invitefriends from "../../assets/invitefriends.png";
import bell from "../../assets/kk.png";
import settings from "../../assets/settings.png";
import helpcenter from "../../assets/helpcenter.png";
import arrow from "../../assets/arrow.png";   // ADD ARROW IMAGE
import edit from "../../assets/edit.png";   // ADD ARROW IMAGE

export default function ClientProfileMenuScreen() {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [isUploading, setUploading] = useState(false);

  // ✅ 1️⃣ SIDEBAR COLLAPSED STATE
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  // ✅ 2️⃣ LISTEN FOR SIDEBAR TOGGLE
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
        const docRef = doc(db, "users", currentUser.uid);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          const data = snapshot.data();
          setUser(data);
          setProfileImage(data.profileImage || "");
        }
      } else {
        navigate("/login");
      }
    });
    return () => unsub();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageRef = ref(storage, `users/${auth.currentUser.uid}/profile.jpg`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);

      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        profileImage: url,
      });

      setProfileImage(url);
    } catch (err) {
      alert("Upload failed!");
    }
    setUploading(false);
  };

  const handleLogout = async () => {
    if (window.confirm("Log out?")) {
      await signOut(auth);
      navigate("/firelogin");
    }
  };

  const handleDeleteAccount = async () => {
    alert("Your backend logic stays SAME.");
  };

  if (!user) return <div>Loading...</div>;

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`;

  // ✅ 3️⃣ WRAP WHOLE UI INSIDE MARGIN LEFT
  return (
    <div
      className="profile-main"
      style={{
        marginLeft: collapsed ? "10px" : "100px",
        transition: "margin-left 0.25s ease",
      }}
    >

      {/* HEADER SECTION */}
      <div className="profile-header-card">
        <div className="profile-header-text">
          <h2>Profile</h2>
          <p>Manage your account and preferences</p>
        </div>

        {/* PROFILE */}
        <div className="profile-flex">
          <div className="profile-pic-wrap">
            <img src={profileImage || profile} className="profile-pic" />

<label className="edit-btn">
  <img src={edit} alt="edit" style={{ width: "40px", margin: "8px" }} />
  <input
    type="file"
    className="hidden-input"
    onChange={handleImageUpload}
  />
</label>


            {isUploading && <div className="upload-overlay">Uploading…</div>}
          </div>

          <div>
            <h3 className="prof-name">{fullName}</h3>
            <p className="prof-email">{user.email}</p>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="profile-section">

        {/* MY ACCOUNT CARD */}
        <div className="profile-card">
          <h3 className="section-title">My Account</h3>

          <MenuItem img={profile} title="Profile Summary"
            onClick={() => navigate("/client-dashbroad2/companyprofileview")}
          />
          <MenuItem
            style={{ width: "50%" }}
            img={saved}
            title="Saved"
            onClick={() => navigate("/client-dashbroad2/saved")}
          />


          <MenuItem img={jobposted} title="Job posted"
            onClick={() => navigate("/client-dashbroad2/PostJob")}
          />

          <MenuItem img={hiring} title="Hiring"
            onClick={() => navigate("/my-hires")}
          />

          <MenuItem img={paused2} title="Paused Service"
            onClick={() => navigate("/client-dashbroad2/clientpausedjobs")}
          />

          <MenuItem img={invitefriends} title="Invite friends" />
        </div>

        {/* SETTINGS CARD */}
        <div className="profile-card">
          <h3 className="section-title">Support</h3>

          <MenuItem img={bell} title="Notifications" onClick={() => navigate("/client-dashbroad2/helpcenter1")}/>
          <MenuItem img={settings} title="Account Settings"
            onClick={() => navigate("/client-dashbroad2/companyprofileview")}
          />
          <MenuItem img={helpcenter} title="Help Centerr" onClick={() => navigate("/client-dashbroad2/helpcenter")} />
          <MenuItem img={helpcenter} title="Terms Of Service" onClick={() => navigate("/termsofservice")} />
          <MenuItem img={helpcenter} title="Privacy Policy" onClick={() => navigate("/privacypolicy")} />
        </div>

        {/* LOGOUT + DELETE */}
        <div className="profile-card">
          <div className="logout-row red" onClick={handleLogout}>
            <span>Sign out</span>
            <img src={arrow} className="arrow" />
          </div>

          <div className="delete-row" onClick={handleDeleteAccount}>
            Delete Account
          </div>
        </div>
      </div>

      {/* Inject CSS */}
      <style>{cssCode}</style>
    </div>
  );
}

function MenuItem({ img, title, onClick }) {
  return (
    <div className="menu-item" onClick={onClick}>
      <div className="menu-left">
        <img src={img} className="menu-icon" />
        <span>{title}</span>
      </div>
      <img src={arrow} className="arrow" />
    </div>
  );
}

const cssCode = `
.profile-main {
  padding: 20px;
  background: #fff;
  max-width: 100%;
}

/* ---------- HEADER ---------- */
.profile-header-card {
  background: #ffffff;
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 6px 28px rgba(0,0,0,0.08);
  margin-bottom: 20px;
}

.profile-header-text h2 {
  font-size: 22px;
  margin: 0;
}

.profile-header-text p {
  margin: 4px 0 20px;
  font-size: 13px;
  color: #555;
}

.profile-flex {
  display: flex;
  gap: 16px;
  align-items: center;
}

/* ---------- PROFILE IMAGE ---------- */
.profile-pic-wrap {
  position: relative;
}

.profile-pic {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  object-fit: cover;
}

.edit-btn {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 30px;
  height: 26px;
  border-radius: 50%;
  cursor: pointer;
}

.hidden-input {
  width: 100%;
  height: 100%;
  opacity: 0;
}

.prof-name {
  font-size: 18px;
  font-weight: 600;
}

.prof-email {
  font-size: 13px;
  color: #555;
}

/* ---------- CONTENT ---------- */
.profile-section {
  margin-top: 10px;
}

.profile-card {
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 6px 28px rgba(0,0,0,0.06);
  padding: 14px 18px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 15px;
  color: #222;
  margin-bottom: 12px;
}

/* ---------- MENU ITEMS ---------- */
.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  cursor: pointer;
}

.menu-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-icon {
  width: 22px;
  height: 22px;
}

.arrow {
  width: 20px;
  height: 20px;
}

/* ---------- LOGOUT ---------- */
.logout-row {
  padding: 14px 0;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}

.red {
  color: red;
  font-weight: 600;
}

.delete-row {
  margin-top: 6px;
  padding: 12px 0;
  color: red;
  cursor: pointer;
  font-weight: 600;
}

/* ================= MOBILE ================= */
@media (max-width: 768px) {

  .profile-main {
    padding: 12px;
    margin-left: 0 !important;
  }

  .profile-header-card {
    padding: 16px;
  }

  .profile-flex {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .prof-name {
    font-size: 16px;
  }

  .prof-email {
    font-size: 12px;
  }

  .profile-card {
    padding: 14px;
  }

  .menu-item {
    padding: 16px 0;
  }

  .menu-icon {
    width: 20px;
    height: 20px;
  }

  .section-title {
    font-size: 14px;
  }
}
`