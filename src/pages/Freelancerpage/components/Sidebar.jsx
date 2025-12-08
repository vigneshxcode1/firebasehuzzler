// // FreelanceSideBar.jsx
// import React, { useEffect, useState } from "react";
// import logo from '../../../assets/logo.png'
// import myservices from '../../../assets/MyServices.png'

// import {
//   Home,
//   Search,
//   Briefcase,
//   User,
//   Settings,
//   LogOut,
//   Bookmark,
// } from "lucide-react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { auth, db } from "../../../firbase/Firebase";
// import { doc, getDoc, onSnapshot } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";

// export default function FreelanceSideBar() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [userInfo, setUserInfo] = useState({
//     firstName: "",
//     lastName: "",
//     role: "",
//   });

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) {
//         console.log("No logged-in user");
//         return;
//       }

//       const uid = currentUser.uid;
//       console.log("Fetched UID:", uid);

//       try {
//         const userRef = doc(db, "users", uid);
//         const snap = await getDoc(userRef); // FIXED

//         if (snap.exists()) {
//           const data = snap.data();

//           setUserInfo({   // FIXED
//             firstName: data.firstName || "",
//             lastName: data.lastName || "",
//             role: data.role || "",
//           });

//           console.log("User data:", data);
//         } else {
//           console.log("User not found in Firestore");
//         }
//       } catch (error) {
//         console.error("Error fetching Firestore user:", error);
//       }
//     });

//     return () => unsubscribe();
//   }, []);




//   // ------------- ACTIVE ROUTE CHECK ----------------
//   const isActive = (path) => location.pathname === path;

//   return (
//     <>
//       <aside className="sidebar">
//         {/* ===== Top Section ===== */}
//         <div className="sidebar-top">

//           {/* Logo */}
//           <div className="logo-box">
//             <div>
//               <table style={{ marginTop: "-20px", marginLeft: "-12px" }}>
//                 <tr>
//                   <td><img src={logo} alt="logo" style={{ width: "58px", height: "58px", margin: "10px" }} /></td>
//                   <td style={{ fontWeight: "400px", fontSize: "24px", color: "#FFFFFF" }}>HUZZLER</td>
//                 </tr>

//               </table>

//             </div>

//           </div>

//           {/* ============ NAVIGATION ============ */}
//           <nav className="nav">
//             {/* HOME */}
//             <button
//               className={`nav-btn ${isActive("/freelance-dashboard") ? "active" : ""}`}
//               onClick={() => navigate("/freelance-dashboard")}
//             >
//               <Home size={18} /> Home
//             </button>

//             {/* BROWSE PROJECTS */}
//             <button
//               className={`nav-btn ${isActive("/freelance-dashboard/freelancebrowesproject") ? "active" : ""
//                 }`}
//               onClick={() =>
//                 navigate("/freelance-dashboard/freelancebrowesproject")
//               }
//             >
//               <Search size={18} /> Browse Projects
//             </button>

//             {/* MY JOBS */}
//             <button
//               className={`nav-btn ${isActive("/freelance-dashboard/myjobs") ? "active" : ""
//                 }`}
//               onClick={() => navigate("/freelance-dashboard/freelancermyworks")}
//             >
//               <Briefcase size={18} /> My Job
//             </button>

//             {/* MY SERVICE */}
//             <button
//               className={`nav-btn ${isActive("/freelance-dashboard/sidebarsaved") ? "active" : ""
//                 }`}
//               onClick={() => navigate("/freelance-dashboard/sidebarsaved")}
//             >
//               <img style={{width:"18px", height:"17px"}} src={myservices} alt="myservices" /> My Service
//             </button>
//             <button
//               className={`nav-btn ${isActive("/freelance-dashboard/saved") ? "active" : ""
//                 }`}
//               onClick={() => navigate("/freelance-dashboard/saved")}
//             >
//               <Bookmark size={18} /> Saved
//             </button><br /><br /><br /><br /><br />

//             {/* PROFILE */}
//             <button
//               className={`nav-btn ${isActive("/freelance-dashboard/accountfreelancer") ? "active" : ""
//                 }`}
//               onClick={() =>
//                 navigate("/freelance-dashboard/accountfreelancer")
//               }
//             >
//               <User size={18} /> Profile
//             </button>




//             {/* SETTINGS */}
//             <button
//               className={`nav-btn ${isActive("/freelance-dashboard/settings") ? "active" : ""
//                 }`}
//               onClick={() => navigate("/freelance-dashboard/settings")}
//             >
//               <Settings size={18} /> Settings
//             </button>

//             {/* LOGOUT */}
//             <button className="nav-btn logout" onClick={() => navigate("/logout")}>
//               <LogOut size={18} /> Logout
//             </button>
//           </nav>
//         </div>

//         {/* ============ USER INFO ============ */}

//         <div className="user-info">
//           <div className="user-avatar">
//             {(userInfo.firstName || "?")[0].toUpperCase()}
//           </div>

//           <div>
//             <p className="user-name">
//               {userInfo.firstName} {userInfo.lastName}
//             </p>
//             <p className="user-status">{userInfo.role}</p>
//           </div>
//         </div>


//       </aside>

//       {/* ============ CSS ============ */}
//       <style>{`
//         .sidebar {
//           width: 13rem;
//           height: 100vh;
//           background: linear-gradient(to bottom, #fef08a, #fefce8, #ffffff);
//           display: flex;
//           flex-direction: column;
//           justify-content: space-between;
//           padding: 1.5rem;
//           position: fixed;
//           left: 0;
//           top: 0;
//           box-shadow: 0 2px 10px rgba(0,0,0,0.08);
//           border-right: 1px solid #eee;
//           z-index: 20;
//         }

//         .logo-box {
//           height:46px;
//           width:180px;
//           background: rgba(124, 60, 255,1);
//           padding: 1rem;
//           border-radius: 0.75rem;
//           text-align: center;
//           box-shadow: 0 4px 12px rgba(124,58,237,0.3);
//           margin-bottom: 1.5rem;
//         }

//         .logo-title {
//           color: white;
//           font-size: 1.5rem;
//           font-weight: bold;
//           margin-top:-10px;
//         }


//         .logo-subtitle {
//           color: #ddd6fe;
//           font-size: 0.85rem;
//         }

//         .nav {
//           display: flex;
//           flex-direction: column;
//           gap: 0.3rem;
//         }

//         .nav-btn {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//           background: none;
//           border: none;
//           padding: 0.75rem;
//           font-size: 0.95rem;
//           font-weight: 500;
//           color: #1f2937;
//           border-radius: 0.75rem;
//           cursor: pointer;
//           transition: 0.2s;
//         }

//         .nav-btn:hover {
//           background: #7c3aed;
//           color: white;
//           transform: translateX(4px);
//           box-shadow: 0 2px 10px rgba(124,58,237,0.3);
//         }

//         .nav-btn.active {
//           background: #7c3aed;
//           color: white;
//           box-shadow: 0 2px 10px rgba(124,58,237,0.3);
//         }

//         .logout {
//           color: block;
//         }

//         .logout:hover {
//           background-color: block;
//           color: white;
//         }

//         .user-info {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//           padding-top: 1rem;
//           border-top: 1px solid #ccc;
//           margin-bottom:100px;
//         }

//         .user-avatar {
//           background: #7c3aed;
//           color: white;
//           width: 2.5rem;
//           height: 2.5rem;
//           border-radius: 9999px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: 700;
//         }

//         .user-name {
//           font-size: 0.9rem;
//           font-weight: 600;
//           cursor: pointer;
//           padding-bottom:;
//         }

//         .user-name:hover {
//           text-decoration: underline;
//         }

//         .user-status {
//           font-size: 0.75rem;
//           color: #6b7280;
//         }
//       `}</style>
//     </>
//   );
// }

// // //FreelanceSideBar.jsx
// import React, { useEffect, useState } from "react";
// import logo from "../../../assets/logo.png";
// import myservices from "../../../assets/MyServices.png";

// import {
//   Home,
//   Search,
//   Briefcase,
//   User,
//   Settings,
//   LogOut,
//   Bookmark,
// } from "lucide-react";

// import { useNavigate, useLocation } from "react-router-dom";
// import { auth, db } from "../../../firbase/Firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";

// export default function FreelanceSideBar() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Sidebar Collapse State
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   // User Info
//   const [userInfo, setUserInfo] = useState({
//     firstName: "",
//     lastName: "",
//     role: "",
//   });

//   useEffect(() => {
//     onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) return;

//       const userRef = doc(db, "users", currentUser.uid);
//       const snap = await getDoc(userRef);

//       if (snap.exists()) {
//         const data = snap.data();
//         setUserInfo({
//           firstName: data.firstName || "",
//           lastName: data.lastName || "",
//           role: data.role || "",
//         });
//       }
//     });
//   }, []);

//   const isActive = (path) => location.pathname === path;

//   // Collapse toggle
//   function toggleSidebar() {
//     const next = !collapsed;
//     setCollapsed(next);
//     localStorage.setItem("sidebar-collapsed", next);

//     // 🚀 SEND EVENT TO ALL PAGES (Home.jsx will listen)
//     window.dispatchEvent(new CustomEvent("sidebar-toggle", { detail: next }));
//   }

//   return (
//     <>
//       <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
//         {/* Collapse Toggle Button */}
//         <button className="collapse-btn" onClick={toggleSidebar}>
//           {collapsed ? ">" : "<"}
//         </button>

//         {/* ===== TOP LOGO ===== */}
//         <div className="logo-box">
//           {!collapsed ? (
//             <div style={{ display: "flex", alignItems: "center", gap: "12px",width:"249.1999969482422px", height:"90px",paddingLeft:"20px",borderRadius:"16px",marginTop:"30px",marginBottom:'0px',backgroundColor:"#7C3CFF" }}>
//               <img src={logo} style={{ width: "50px" }} />
//               <span className="logo-text">HUZZLER</span>
//             </div>
//           ) : (
//             <img src={logo} style={{ width: "45px" }} />
//           )}
//         </div>

//         {/* ===== NAVIGATION ===== */}
//         <nav className="nav">
//           <button
//             className={`nav-btn ${isActive("/freelance-dashboard") ? "active" : ""}`}
//             onClick={() => navigate("/freelance-dashboard")}
//           >
//             <Home size={18} />
//             {!collapsed && "Home"}
//           </button>

//           <button
//             className={`nav-btn ${
//               isActive("/freelance-dashboard/freelancebrowesproject") ? "active" : ""
//             }`}
//             onClick={() => navigate("/freelance-dashboard/freelancebrowesproject")}
//           >
//             <Search size={18} />
//             {!collapsed && "Browse Projects"}
//           </button>

//           <button
//             className={`nav-btn ${
//               isActive("/freelance-dashboard/myjobs") ? "active" : ""
//             }`}
//             onClick={() => navigate("/freelance-dashboard/freelancermyworks")}
//           >
//             <Briefcase size={18} />
//             {!collapsed && "My Jobs"}
//           </button>

//           <button
//             className={`nav-btn ${
//               isActive("/freelance-dashboard/sidebarsaved") ? "active" : ""
//             }`}
//             onClick={() => navigate("/freelance-dashboard/sidebarsaved")}
//           >
//             <img src={myservices} style={{ width: "18px" }} />
//             {!collapsed && "My Service"}
//           </button>

//           <button
//             className={`nav-btn ${
//               isActive("/freelance-dashboard/saved") ? "active" : ""
//             }`}
//             onClick={() => navigate("/freelance-dashboard/saved")}
//           >
//             <Bookmark size={18} />
//             {!collapsed && "Saved"}
//           </button>

//           {/* Bottom Section */}
//           <div className="bottom-section">
//             <button
//               className={`nav-btn ${
//                 isActive("/freelance-dashboard/accountfreelancer") ? "active" : ""
//               }`}
//               onClick={() => navigate("/freelance-dashboard/accountfreelancer")}
//             >
//               <User size={18} />
//               {!collapsed && "Profile"}
//             </button>

//             <button
//               className={`nav-btn ${
//                 isActive("/freelance-dashboard/settings") ? "active" : ""
//               }`}
//               onClick={() => navigate("/freelance-dashboard/settings")}
//             >
//               <Settings size={18} />
//               {!collapsed && "Settings"}
//             </button>

//             <button className="nav-btn logout" onClick={() => navigate("/logout")}>
//               <LogOut size={18} />
//               {!collapsed && "Logout"}
//             </button>
//           </div>
//         </nav>

//         {/* USER FOOTER */}
//         <div className="user-info"  style={{marginTop:"-10px",marginBottom:"50px"}}>
//           <div className="user-avatar">
//             {(userInfo.firstName || "?")[0].toUpperCase()}
//           </div>

//           {!collapsed && (
//             <div>
//               <p  className="user-name">{userInfo.firstName} {userInfo.lastName}</p>
//               <p  className="user-status">{userInfo.role}</p>
//             </div>
//           )}
//         </div>
//       </aside>

//       {/* ===== CSS ===== */}
//       <style>{`
//         .sidebar {
//           width: 288px;
//           height: 100vh;
//           background: linear-gradient(to bottom, #fef08a, #fefce8, #ffffff);
//           padding: 20px;
//           position: fixed;
//           left: 0;
//           top: 0;
//           transition: 0.25s ease;
//           display: flex;
//           flex-direction: column;
//           justify-content: space-between;
//           z-index: 50;
//         }

//         .sidebar.collapsed {
//           width: 80px;
//         }

//         .collapse-btn {
//           position: absolute;
//           right: -12px;
//           top: 80px;
//           width: 21px;
//           height: 30px;
//           border-radius: 6px;
//           background: #7C3CFF;
//           color: white;
//           border: none;
//           cursor: pointer;
//           box-shadow: 0 3px 8px rgba(0,0,0,0.2);
//         }

//         .logo-box {
//           margin-bottom: -125px;

//           border-radius: 16px;
//         }

//         .logo-text {
//           margin-top:10px;
//           font-size: 24px;
//           color: #FFFFFF;
//           font-weight: 400;
//           margin-left:70px;


//         }

//         .nav-btn {
//           font-size: 14px;
//           font-weigth: 400px;
//           width: 270px;
//           height: 50px;
//           display: flex;
//           align-items: center;
//           margin-top:3px;
//           gap: 12px;
//           padding: 12px;
//           background: none;
//           border: none;
//           cursor: pointer;
//           border-radius: 10px;
//           transition: .25s;
//           color:#1E2939;
//         }

//         .nav-btn.active,
//         .nav-btn:hover {
//           background: #7C3CFF;
//           color: white;
//         }


//         .user-info {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           padding-top: 10px;
//           border-top: 1px solid #ddd;
//         }

//         .user-avatar {

//           width: 38px;
//           height: 38px;
//           background: #7C3CFF;
//           color: white;
//           font-weight: bold;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           border-radius: 50%;
//         }

//         .user-name {
//           font-size: 14px;
//           font-weight: 600;
//         }

//         .user-status {
//           font-size: 12px;
//           color: #777;
//         }
//       `}</style>
//     </>
//   );
// }


// import React, { useEffect, useState } from "react";
// import logo from "../../../assets/logo.png";
// import myservices from "../../../assets/MyServices.png";

// import {
//   Home,
//   Search,
//   Briefcase,
//   User,
//   Settings,
//   LogOut,
//   Bookmark,
// } from "lucide-react";

// import { useNavigate, useLocation } from "react-router-dom";
// import { auth, db } from "../../../firbase/Firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";

// export default function FreelanceSideBar() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   const [userInfo, setUserInfo] = useState({
//     firstName: "",
//     lastName: "",
//     role: "",
//   });

//   useEffect(() => {
//     onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) return;

//       const userRef = doc(db, "users", currentUser.uid);
//       const snap = await getDoc(userRef);

//       if (snap.exists()) {
//         const data = snap.data();
//         setUserInfo({
//           firstName: data.firstName || "",
//           lastName: data.lastName || "",
//           role: data.role || "",
//         });
//       }
//     });
//   }, []);

//   const isActive = (path) => location.pathname === path;

//   function toggleSidebar() {
//     const next = !collapsed;
//     setCollapsed(next);
//     localStorage.setItem("sidebar-collapsed", next);
//     window.dispatchEvent(new CustomEvent("sidebar-toggle", { detail: next }));
//   }

//   return (
//     <>
//       <aside className={`hz-sidebar ${collapsed ? "collapsed" : ""}`}>

//         {/* Toggle Button */}
//         <button className="hz-collapse-btn" onClick={toggleSidebar}>
//           {collapsed ? ">" : "<"}
//         </button>

//         {/* ======= LOGO ======= */}
//         <div className="hz-logo-block">
//           {!collapsed ? (
//             <div className="hz-logo-card">
//               <img src={logo} className="hz-logo-img" />
//               <span className="hz-logo-text">HUZZLER</span>
//             </div>
//           ) : (
//             <img src={logo} className="hz-logo-img-small" />
//           )}
//         </div>

//         {/* ======= MENU ======= */}
//         <nav className="hz-menu">

//           <button
//             className={`hz-menu-btn ${isActive("/freelance-dashboard") ? "active" : ""}`}
//             onClick={() => navigate("/freelance-dashboard")}
//           >
//             <Home size={18} />
//             {!collapsed && "Home"}
//           </button>

//           <button
//             className={`hz-menu-btn ${
//               isActive("/freelance-dashboard/freelancebrowesproject") ? "active" : ""
//             }`}
//             onClick={() => navigate("/freelance-dashboard/freelancebrowesproject")}
//           >
//             <Search size={18} />
//             {!collapsed && "Browse Projects"}
//           </button>

//           <button
//             className={`hz-menu-btn ${
//               isActive("/freelance-dashboard/freelancermyworks") ? "active" : ""
//             }`}
//             onClick={() => navigate("/freelance-dashboard/freelancermyworks")}
//           >
//             <Briefcase size={18} />
//             {!collapsed && "My Jobs"}
//           </button>

//           <button
//             className={`hz-menu-btn ${
//               isActive("/freelance-dashboard/sidebarsaved") ? "active" : ""
//             }`}
//             onClick={() => navigate("/freelance-dashboard/sidebarsaved")}
//           >
//             <img src={myservices} style={{ width: 18 }} />
//             {!collapsed && "My Service"}
//           </button>

//           <button
//             className={`hz-menu-btn ${
//               isActive("/freelance-dashboard/saved") ? "active" : ""
//             }`}
//             onClick={() => navigate("/freelance-dashboard/saved")}
//           >
//             <Bookmark size={18} />
//             {!collapsed && "Saved"}
//           </button>

//           {/* BOTTOM MENU */}
//           <div className="hz-bottom-menu">

//             <button
//               className={`hz-menu-btn ${
//                 isActive("/freelance-dashboard/accountfreelancer") ? "active" : ""
//               }`}
//               onClick={() => navigate("/freelance-dashboard/accountfreelancer")}
//             >
//               <User size={18} />
//               {!collapsed && "Profile"}
//             </button>

//             <button
//               className={`hz-menu-btn ${
//                 isActive("") ? "active" : ""
//               }`}
//               onClick={() => navigate("/freelance-dashboard/settings")}
//             >
//               <Settings size={18} />
//               {!collapsed && "Settings"}
//             </button>

//             <button
//               className="hz-menu-btn logout"
//               onClick={() => navigate("/logout")}
//             >
//               <LogOut size={18} />
//               {!collapsed && "Logout"}
//             </button>
//           </div>
//         </nav>

//         {/* ======= USER FOOTER ======= */}
// <div className="hz-user-footer">
//   <div className="hz-user-avatar">
//     {(userInfo.firstName || "?")[0].toUpperCase()}
//   </div>

//   {!collapsed && (
//     <div>
//       <p className="hz-user-name">
//         {userInfo.firstName} {userInfo.lastName}
//       </p>
//       <p className="hz-user-role">{userInfo.role}</p>
//     </div>
//   )}
// </div>

//       </aside>

//       {/* =====================  CSS  ===================== */}
//       <style>{`
//         .hz-sidebar {
//           width: 290px;
//           height: 100vh;
//           background: #F5F5F5;
//           border-right: 1px solid #e3e3e3;
//           padding: 20px 16px;
//           position: fixed;
//           left: 0;
//           top: 0;
//           display: flex;
//           flex-direction: column;
//           justify-content: space-between;
//           transition: 0.25s ease-in-out;
//         }

//         .hz-sidebar.collapsed {
//           width: 78px;
//         }

//         .hz-collapse-btn {
//           position: absolute;
//           right: -10px;
//           top: 90px;
//           width: 26px;
//           height: 32px;
//           background: #A855F7;
//           color: #fff;
//           border: none;
//           border-radius: 6px;
//           font-weight: bold;
//           cursor: pointer;
//           box-shadow: 0 4px 10px rgba(0,0,0,0.2);
//         }

//         .hz-logo-block {
//           margin-top: 20px;
//           margin-bottom: 30px;
//         }

//         .hz-logo-card {
//           background: #A855F7;
//           padding: 14px 18px;
//           height: 82px;
//           border-radius: 16px;
//           display: flex;
//           align-items: center;
//           gap: 14px;
//           box-shadow: 0 6px 18px rgba(156, 39, 176, 0.25);
//         }

//         .hz-logo-img {
//           width: 48px;
//         }
//         .hz-logo-img-small {
//           width: 60px;
//           height: 60px;
//           background: #e6e6e8;
//           border-radius: 18px;
//           border: 1.6px solid #8b4dff;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           padding:5px;
//         }

//         .hz-logo-text {
//           font-size: 22px;
//           font-weight: 600;
//           color: #fff;
//         }

//         .hz-menu {
//           display: flex;
//           flex-direction: column;
//           gap: 6px;
//         }

//         .hz-menu-btn {
//           height: 48px;
//           width: 100%;
//           padding: 12px;
//           display: flex;
//           align-items: center;
//           gap: 14px;
//           background: none;
//           border: none;
//           border-radius: 12px;
//           font-size: 14px;
//           cursor: pointer;
//           color: #1e293b;
//           transition: .25s;
//         }

//         .hz-menu-btn.active {
//           background: #A855F7;

//           color: #fff;
//         }

//         .hz-menu-btn:hover {
//           background: #A855F7;
//           color: #fff;
//         }

//         .hz-bottom-menu {
//           margin-top: 25px;
//           padding-top: 10px;
//           border-top: 1px solid #ddd;
//           display: flex;
//           flex-direction: column;
//           gap: 6px;
//         }

// /* === USER FOOTER NEW UI (exact like screenshot) === */
// .hz-user-footer {
//   display: flex;
//   align-items: center;
//   gap: 14px;
//   background: #ffffff;
//   padding: 14px 16px;
//   border-radius: 14px;
//   margin-bottom: 12px;
//   box-shadow: 0 4px 14px rgba(0,0,0,0.15); /* soft card shadow */
// }

// /* Purple gradient circular avatar */
// .hz-user-avatar {
//   width: 46px;
//   height: 46px;
//   border-radius: 50%;
//   background: linear-gradient(145deg, #b053ff, #8b2bff); /* gradient like pic */
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   color: #fff;
//   font-size: 17px;
//   font-weight: bold;
//   box-shadow: 0 4px 10px rgba(147, 0, 255, 0.32); /* glow like picture */
// }

// .hz-user-name {
//   font-size: 15px;
//   font-weight: 700;
//   color: #1e1e1e;
// }

// .hz-user-role {
//   font-size: 13px;
//   color: #7a7a7a;
//   margin-top: -2px;
// }

//       `}</style>
//     </>
//   );
// }


// import React, { useEffect, useState } from "react";
// import logo from "../../../assets/logo.png";
// import myservices from "../../../assets/MyServices.png";

// import {
//   Home,
//   Search,
//   Briefcase,
//   User,
//   Settings,
//   LogOut,
//   Bookmark,
// } from "lucide-react";

// import { useNavigate, useLocation } from "react-router-dom";
// import { auth, db } from "../../../firbase/Firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";

// export default function FreelanceSideBar() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   const [userInfo, setUserInfo] = useState({
//     firstName: "",
//     lastName: "",
//     role: "",
//   });

//   useEffect(() => {
//     onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) return;

//       const userRef = doc(db, "users", currentUser.uid);
//       const snap = await getDoc(userRef);

//       if (snap.exists()) {
//         const data = snap.data();
//         setUserInfo({
//           firstName: data.firstName || "",
//           lastName: data.lastName || "",
//           role: data.role || "",
//         });
//       }
//     });
//   }, []);

//   const isActive = (path) => location.pathname === path;

//   function toggleSidebar() {
//     const next = !collapsed;
//     setCollapsed(next);
//     localStorage.setItem("sidebar-collapsed", next);
//     window.dispatchEvent(new CustomEvent("sidebar-toggle", { detail: next }));
//   }

//   return (
//     <>
//       <aside className={`hz-sidebar ${collapsed ? "collapsed" : ""}`}>

//         {/* Toggle Button */}
//         <button className="hz-collapse-btn" onClick={toggleSidebar}>
//           {collapsed ? ">" : "<"}
//         </button>

//         {/* LOGO CARD */}
//         {!collapsed ? (
//           <div className="hz-logo-card">
//             <img src={logo} className="hz-logo-img" />
//             <span className="hz-logo-text">HUZZLER</span>
//           </div>
//         ) : (
//           <div className="hz-logo-small-wrap">
//             <img src={logo} className="hz-logo-img-small" />
//           </div>
//         )}

//         {/* MENU */}
//         <nav className="hz-menu">

//           <button
//             className={`hz-menu-btn ${isActive("/freelance-dashboard") ? "active-btn" : ""}`}
//             onClick={() => navigate("/freelance-dashboard")}
//           >
//             <Home size={18} className="icon" />
//             {!collapsed && "Home"}
//           </button>

//           <button
//             className={`hz-menu-btn ${isActive("/freelance-dashboard/freelancebrowesproject") ? "active-btn" : ""}`}
//             onClick={() => navigate("/freelance-dashboard/freelancebrowesproject")}
//           >
//             <Search size={18} className="icon" />
//             {!collapsed && "Browse Projects"}
//           </button>

//           <button
//             className={`hz-menu-btn ${isActive("/freelance-dashboard/freelancermyworks") ? "active-btn" : ""}`}
//             onClick={() => navigate("/freelance-dashboard/freelancermyworks")}
//           >
//             <Briefcase size={18} className="icon" />
//             {!collapsed && "My Jobs"}
//           </button>

//           <button
//             className={`hz-menu-btn ${isActive("/freelance-dashboard/sidebarsaved") ? "active-btn" : ""}`}
//             onClick={() => navigate("/freelance-dashboard/sidebarsaved")}
//           >
//             <img src={myservices} width={18} className="icon" />
//             {!collapsed && "My Service"}
//           </button>

//           <button
//             className={`hz-menu-btn ${isActive("/freelance-dashboard/saved") ? "active-btn" : ""}`}
//             onClick={() => navigate("/freelance-dashboard/saved")}
//           >
//             <Bookmark size={18} className="icon" />
//             {!collapsed && "Saved"}
//           </button>

//           <div className="hz-bottom-menu">

//             <button
//               className={`hz-menu-btn ${isActive("/freelance-dashboard/accountfreelancer") ? "active-btn" : ""}`}
//               onClick={() => navigate("/freelance-dashboard/accountfreelancer")}
//             >
//               <User size={18} className="icon" />
//               {!collapsed && "Profile"}
//             </button>

//             <button
//               className={`hz-menu-btn ${isActive("/freelance-dashboard/settings") ? "active-btn" : ""}`}
//               onClick={() => navigate("/freelance-dashboard/settings")}
//             >
//               <Settings size={18} className="icon" />
//               {!collapsed && "Settings"}
//             </button>

//             <button
//               className="hz-menu-btn"
//               onClick={() => navigate("/fireLogin")}
//             >
//               <LogOut size={18} className="icon" />
//               {!collapsed && "Logout"}
//             </button>
//           </div>
//         </nav>

//         {/* FOOTER */}
//         <div className="hz-user-footer">
//           <div className="hz-user-avatar">
//             {(userInfo.firstName || "?")[0].toUpperCase()}
//           </div>

//           {!collapsed && (
//             <div>
//               <p className="hz-user-name">
//                 {userInfo.firstName} {userInfo.lastName}
//               </p>
//               <p className="hz-user-role">{userInfo.role}</p>
//             </div>
//           )}
//         </div>
//       </aside>

//       {/* CSS EXACTLY MATCHING Sidebar.jsx */}
//       <style>{`
//         .hz-sidebar {
//           width: 300px;
//           height: 100vh;
//           background: #e8e8e8;
//           position: fixed;
//           left: 0;
//           top: 0;
//           padding: 18px;
//           display: flex;
//           flex-direction: column;
//           justify-content: space-between;
//           transition: 0.3s ease;
//           font-family: 'Rubik', sans-serif;
//         }

//         .hz-sidebar.collapsed {
//           width: 80px;
//         }

//         .hz-collapse-btn {
//           position: absolute;
//           left: 96%;
//           top: 50px;
//           width: 32px;
//           height: 32px;
//           border-radius: 10px;
//           background: #a855f7;
//           border: none;
//           color: white;
//           cursor: pointer;
//         }

//         .hz-logo-card {
//           width: 80%;
//           height: 75px;
//           background: #a855f7;
//           border-radius: 20px;
//           display: flex;
//           align-items: center;
//           padding: 10px 18px;
//           gap: 16px;
//           box-shadow: 0 8px 20px rgba(0,0,0,0.1);
//         }

//         .hz-logo-img {
//           width: 46px;
//           height: 46px;
//         }

//         .hz-logo-text {
//           font-size: 22px;
//           font-weight: 600;
//           color: white;
//         }

//         .hz-logo-img-small {
//           width: 55px;
//           height: 55px;
//           background: white;
//           border-radius: 14px;
//           border: 2px solid #a855f7;
//           padding: 4px;
//         }

//         .hz-logo-small-wrap {
//           display: flex;
//           justify-content: center;
//           margin-bottom: 10px;
//         }

//         .hz-menu {
//           margin-top: 18px;
//           display: flex;
//           flex-direction: column;
//           gap: 12px;
//         }

//         .hz-menu-btn {
//           height: 48px;
//           width: 90%;
//           border: none;
//           border-radius: 14px;
//           background: none;
//           display: flex;
//           align-items: center;
//           padding: 0 16px;
//           gap: 12px;
//           cursor: pointer;
//           transition: 0.25s ease;
//           font-size: 15px;
//           color: #222;
//         }

//         .hz-menu-btn:hover {
//           background: #c084fc;
//           color: white;
//         }

//         .hz-menu-btn:hover .icon,
//         .hz-menu-btn:hover img {
//           filter: brightness(0) invert(1);
//         }

//         .active-btn {
//           background: #a855f7 !important;
//           color: white !important;
//         }

//         .active-btn .icon,
//         .active-btn img {
//           filter: brightness(0) invert(1);
//         }

//         .hz-sidebar.collapsed .hz-menu-btn {
//           justify-content: center;
//           padding: 0;
//         }

//         .hz-user-footer {
//           height: 70px;
//           background: white;
//           border-radius: 16px;
//           display: flex;
//           align-items: center;
//           padding: 10px;
//           gap: 12px;
//           box-shadow: 0 6px 20px rgba(0,0,0,0.1);
//           margin-bottom: 25px;
//         }

//         .hz-user-avatar {
//           width: 44px;
//           height: 44px;
//           background: #a855f7;
//           border-radius: 50%;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           color: white;
//           font-weight: 600;
//         }

//         .hz-user-name {
//           font-size: 15px;
//           font-weight: 600;
//         }

//         .hz-user-role {
//           font-size: 12px;
//           color: #666;
//         }

//         .hz-bottom-menu {
//           margin-top: 22px;
//           padding-top: 10px;
//           border-top: 1px solid #d0d0d0;
//           display: flex;
//           flex-direction: column;
//           gap: 14px;
//         }
//       `}</style>
//     </>
//   );
// }


import React, { useEffect, useState } from "react";
import logo from "../../../assets/logo.png";
import myservices from "../../../assets/MyServices.png";

import {
  Home,
  Search,
  Briefcase,
  User,
  Settings,
  LogOut,
  Bookmark,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../../../firbase/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function FreelanceSideBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    role: "",
  });

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) return;

      const userRef = doc(db, "users", currentUser.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data();
        setUserInfo({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          role: data.role || "",
        });
      }
    });
  }, []);

  const isActive = (path) => location.pathname === path;

  function toggleSidebar() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar-collapsed", next);
    window.dispatchEvent(new CustomEvent("sidebar-toggle", { detail: next }));
  }

  return (
    <>
      <aside className={`hz-sidebar ${collapsed ? "collapsed" : ""}`}>

        {/* Toggle Button */}
        <button className="hz-collapse-btn" onClick={toggleSidebar}>
          {collapsed ? ">" : "<"}
        </button>

        {/* LOGO CARD */}
        {!collapsed ? (
          <div className="hz-logo-card">
            <img src={logo} className="hz-logo-img" />
            <span className="hz-logo-text">HUZZLER</span>
          </div>
        ) : (
          <div className="hz-logo-small-wrap">
            <img src={logo} className="hz-logo-img-small" />
          </div>
        )}

        {/* MENU */}
        <nav className="hz-menu">

          <button
            className={`hz-menu-btn ${isActive("/freelance-dashboard") ? "active-btn" : ""}`}
            onClick={() => navigate("/freelance-dashboard")}
          >
            <Home size={18} className="icon" />
            {!collapsed && "Home"}
          </button>

          <button
            className={`hz-menu-btn ${isActive("/freelance-dashboard/freelancebrowesproject") ? "active-btn" : ""}`}
            onClick={() => navigate("/freelance-dashboard/freelancebrowesproject")}
          >
            <Search size={18} className="icon" />
            {!collapsed && "Browse Projects"}
          </button>

          <button
            className={`hz-menu-btn ${isActive("/freelance-dashboard/freelancermyworks") ? "active-btn" : ""}`}
            onClick={() => navigate("/freelance-dashboard/freelancermyworks")}
          >
            <Briefcase size={18} className="icon" />
            {!collapsed && "My Jobs"}
          </button>

          <button
            className={`hz-menu-btn ${isActive("/freelance-dashboard/sidebarsaved") ? "active-btn" : ""}`}
            onClick={() => navigate("/freelance-dashboard/sidebarsaved")}
          >
            <img src={myservices} width={18} className="icon" />
            {!collapsed && "My Service"}
          </button>

          <button
            className={`hz-menu-btn ${isActive("/freelance-dashboard/saved") ? "active-btn" : ""}`}
            onClick={() => navigate("/freelance-dashboard/saved")}
          >
            <Bookmark size={18} className="icon" />
            {!collapsed && "Saved"}
          </button>

          <div className="hz-bottom-menu">

            <button
              className={`hz-menu-btn ${isActive("/freelance-dashboard/accountfreelancer") ? "active-btn" : ""}`}
              onClick={() => navigate("/freelance-dashboard/accountfreelancer")}
            >
              <User size={18} className="icon" />
              {!collapsed && "Profile"}
            </button>

            <button
              className={`hz-menu-btn ${isActive("/freelance-dashboard/settings") ? "active-btn" : ""}`}
              onClick={() => navigate("/freelance-dashboard/settings")}
            >
              <Settings size={18} className="icon" />
              {!collapsed && "Settings"}
            </button>

            <button
              className="hz-menu-btn"
              onClick={() => navigate("/logout")}
            >
              <LogOut size={18} className="icon" />
              {!collapsed && "Logout"}
            </button>
          </div>
        </nav>

        {/* FOOTER */}
        <div className="hz-user-footer">
          <div className="hz-user-avatar">
            {(userInfo.firstName || "?")[0].toUpperCase()}
          </div>

          {!collapsed && (
            <div>
              <p className="hz-user-name">
                {userInfo.firstName} {userInfo.lastName}
              </p>
              <p className="hz-user-role">{userInfo.role}</p>
            </div>
          )}
        </div>
      </aside>

      {/* CSS EXACTLY MATCHING Sidebar.jsx */}
      <style>{`
         .hz-sidebar {
          width: 300px;
          height: 100vh;
          background: #e8e8e8;
          position: fixed;
          left: 0;
          top: 0;
          padding: 18px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: 0.3s ease;
          font-family: 'Rubik', sans-serif;
        }

        .hz-sidebar.collapsed {
          width: 80px;
           
        }

        /* Toggle button */
        .hz-collapse-btn {
  position: absolute;
  top: 50px;
  left: 320px;          
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: #a855f7;
  border: none;
  color: white;
  cursor: pointer;
  transition: left 0.3s ease;
}

/* When collapsed (80px width) */
.hz-sidebar.collapsed .hz-collapse-btn {
  left: 100px;
}

        

        /* Logo card size FIXED */
        .hz-logo-card {
          width: 80%;
          height: 75px;    /* FIXED height */
          background: #a855f7;
          border-radius: 20px;
          display: flex;
          align-items: center;
          padding: 10px 18px;
          gap: 16px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          margin-top:-10px;
        }

        .hz-logo-img {
          width: 46px;
          height: 46px;
        }

        .hz-logo-text {
          font-size: 22px;
          font-weight: 600;
          color: white;
        }

        /* Collapsed logo */
        .hz-logo-img-small {
          width: 55px;
          height: 55px;
          background: white;
          border-radius: 14px;
          border: 2px solid #a855f7;
          padding: 4px;
        }

        .hz-logo-small-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 10px;
        }

        /* Menu list */
        .hz-menu {
          margin-top: 5px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* EACH MENU BUTTON */
        .hz-menu-btn {
          height: 40px;
          width: 90%;
          border: none;
          border-radius: 14px;
          background: none;
          display: flex;
          align-items: center;
          padding: 0 16px;
          gap: 12px;
          cursor: pointer;
          transition: 0.25s ease;
          font-size: 15px;
          color: #222;
        }

        /* HOVER  */
        .hz-menu-btn:hover {
          background: #c084fc;   /* lighter violet */
          color: white;
        }

        .hz-menu-btn:hover .icon,
        .hz-menu-btn:hover img {
          filter: brightness(0) invert(1);
        }

        /* ACTIVE BUTTON (clicked) */
        .active-btn {
          background: #a855f7 !important;
          color: white !important;
        }

        .active-btn .icon,
        .active-btn img {
          filter: brightness(0) invert(1);
        }

        /* Collapsed hover fix */
        .hz-sidebar.collapsed .hz-menu-btn {
          justify-content: center;
          padding: 0;
        }
.hz-user-footer {
  height: 70px;
  background: white;      
  border-radius: 0;     
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);

  width: calc(100% + 6px);   /* stretches across full sidebar INCLUDING padding */
  margin-left: -18px;          

  display: flex;
  align-items: center;
  padding: 10px 15px;      
  gap: 12px;
  margin-bottom: 25px;
}

        .hz-user-avatar {
          width: 44px;
          height: 44px;
          background: #a855f7;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-weight: 600;
        }

        .hz-user-name {
          font-size: 15px;
          font-weight: 600;
        }

        .hz-user-role {
          font-size: 12px;
          color: #666;
        }

        .hz-bottom-menu {
          margin-top: 100px;
          padding-top: 10px;
          // border-top: 1px solid #d0d0d0;
          display: flex;
          flex-direction: column;
          gap: 14px;
          
        }
      `}</style>
    </>
  );
}