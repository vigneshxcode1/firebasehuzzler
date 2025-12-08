// import { Home, Search, Briefcase, User, Settings, LogOut } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import hire from "../../../assets/hire.png"
// import save2 from "../../../assets/save2.png"
// import { useEffect, useState } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth, db } from "../../../firbase/Firebase";
// import { doc, getDoc } from "firebase/firestore";
// import logo from "../../../assets/logo.png"

// export default function Sidebar() {
//   const navigate = useNavigate();

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


//   return (
//     <>
//       <aside className="sidebar">

//         {/* ===== Top Section ===== */}
//         <div className="sidebar-top">

//           {/* Logo */}
//           <div className="logo-box">
//             <div>
//               <table style={{marginTop:"-20px",marginLeft:"-12px"}}>
//                 <tr>
//                   <td><img src={logo} alt="logo" style={{width:"58px",height:"58px", margin:"10px"}} /></td>
//                   <td style={{fontWeight:"400px",fontSize:"24px",color:"#FFFFFF"}}>HUZZLER</td>
//                 </tr>
                
//               </table>

//             </div>

//           </div>
//           {/* <img src={logo} alt="logo" style={{width:"30px",height:"30px", margin:"10px"}} /> HUZZLE */}
//           {/* Navigation Buttons */}
//           <nav className="nav">

//             {/* HOME */}
//             <button className="nav-btn" onClick={() => navigate("/client-dashbroad2/clientserachbar")}>
//               <Home size={18} /> Home
//             </button>

//             {/* BROWSE PROJECTS */}
//             <button className="nav-btn" onClick={() => navigate("/client-dashbroad2/clientcategories")}>
//               <Search size={18} /> Browse Projects,,
//             </button>

//             {/* MY JOBS */}

//             <button className="nav-btn" onClick={() => navigate("/client-dashbroad2/AddJobScreen")}>
//               <Briefcase size={18} /> Job Posted
//             </button>

//             <button className="nav-btn" onClick={() => navigate("/client-dashbroad2/my-hires")}>
//               <img src={hire} width={"18px"} height={"18px"} alt="hire" className="nav-icon" />Hire
//             </button>
//             <br /><br /><br /><br />

//             {/* PROFILE */}
//             <button className="nav-btn" onClick={() => navigate("/client-dashbroad2/ClientProfile")}>
//               <User size={18} /> Profile
//             </button>

//             <button className="nav-btn" onClick={() => navigate("/client-dashbroad2/Clientsaved")}>
//               <img src={save2} width={"18px"} height={"18px"} alt="hire" className="nav-icon" />saved
//             </button>
//             {/* SETTINGS */}
//             <button className="nav-btn" onClick={() => navigate("/client-dashbroad2/companyprofileview")}>
//               <Settings size={18} /> Settings
//             </button>

//             {/* LOGOUT */}
//             <button className="nav-btn logout" onClick={() => navigate("/logout")}>
//               <LogOut size={18} /> Logout
//             </button>

//           </nav>
//         </div>

//         {/* ===== User Info ===== */}
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

//       {/* ===== CSS SECTION ===== */}
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
//           font-size: 1.5rem;
//           font-weight: 700;
//           color: #fff;
//         }

//         .logo-subtitle {
//           color: #ddd6fe;
//           font-size: 0.85rem;
//           margin-top: 0.25rem;
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
//           margin-top: 0.5rem;
//           color: block;
//         }

//         .logout:hover {
//           background-color: block;
//           color: white;
//         }

//          .user-info {
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


// import {
//   Home,
//   Search,
//   Briefcase,
//   User,
//   Settings,
//   LogOut,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import hire from "../../../assets/hire.png";
// import save2 from "../../../assets/save2.png";
// import { useEffect, useState } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth, db } from "../../../firbase/Firebase";
// import { doc, getDoc } from "firebase/firestore";
// import logo from "../../../assets/logo.png";

// export default function Sidebar() {
//   const navigate = useNavigate();

//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   const [userInfo, setUserInfo] = useState({
//     firstName: "",
//     lastName: "",
//     role: "",
//   });

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) return;

//       const snap = await getDoc(doc(db, "users", currentUser.uid));
//       if (snap.exists()) {
//         const data = snap.data();
//         setUserInfo({
//           firstName: data.firstName || "",
//           lastName: data.lastName || "",
//           role: data.role || "",
//         });
//       }
//     });

//     return () => unsub();
//   }, []);

//   // 🔥 Toggle collapse
//   function toggleSidebar() {
//     const next = !collapsed;
//     setCollapsed(next);
//     localStorage.setItem("sidebar-collapsed", next);

//     // Send event to Home page
//     window.dispatchEvent(new CustomEvent("sidebar-toggle", { detail: next }));
//   }

//   return (
//     <>
//       <aside
//         className={`sidebar ${collapsed ? "collapsed" : "expanded"}`}
//       >
//         {/* TOGGLE BUTTON */}
//         <button className="toggle-btn" onClick={toggleSidebar}>
//           {collapsed ? ">" : "<"}
//         </button>

//         {/* ===== TOP SECTION ===== */}
//         <div className="sidebar-top">

//           {/* Logo */}
//           <div className="logo-box">
//             <img src={logo} alt="logo" className="logo-img" />
//             {!collapsed && <div className="logo-text">HUZZLER</div>}
//           </div>

//           {/* Navigation */}
//           <nav className="nav">

//             <button className="nav-btn" onClick={() => navigate("/client-dashbroad2/clientserachbar")}>
//               <Home size={18} />
//               {!collapsed && "Home"}
//             </button>

//             <button className="nav-btn" onClick={() => navigate("/client-dashbroad2/clientcategories")}>
//               <Search size={18} />
//               {!collapsed && "Browse Projects"}
//             </button>

//             <button className="nav-btn" onClick={() => navigate("/client-dashbroad2/AddJobScreen")}>
//               <Briefcase size={18} />
//               {!collapsed && "Job Posted"}
//             </button>

//             <button className="nav-btn" onClick={() => navigate("/client-dashbroad2/my-hires")}>
//               <img src={hire} width="18" height="18" alt="hire" />
//               {!collapsed && "Hire"}
//             </button>

//             <br /><br /><br />

//             <button className="nav-btn" onClick={() => navigate("/client-dashbroad2/ClientProfile")}>
//               <User size={18} />
//               {!collapsed && "Profile"}
//             </button>

//             <button className="nav-btn" onClick={() => navigate("/client-dashbroad2/Clientsaved")}>
//               <img src={save2} width="18" height="18" alt="saved" />
//               {!collapsed && "Saved"}
//             </button>

//             <button className="nav-btn" onClick={() => navigate("/client-dashbroad2/companyprofileview")}>
//               <Settings size={18} />
//               {!collapsed && "Settings"}
//             </button>

//             <button className="nav-btn logout" onClick={() => navigate("/logout")}>
//               <LogOut size={18} />
//               {!collapsed && "Logout"}
//             </button>
//           </nav>
//         </div>

//         {/* ===== USER INFO ===== */}
//         <div className="user-info">
//           <div className="user-avatar">
//             {(userInfo.firstName || "?")[0].toUpperCase()}
//           </div>

//           {!collapsed && (
//             <div>
//               <p className="user-name">
//                 {userInfo.firstName} {userInfo.lastName}
//               </p>
//               <p className="user-status">{userInfo.role}</p>
//             </div>
//           )}
//         </div>
//       </aside>

//       {/* ===== CSS ===== */}
//       <style>{`
//         .sidebar {
//           height: 100vh;
//           background: #f5f5f5;
//           position: fixed;
//           left: 0;
//           top: 0;
//           padding: 1rem;
//           display: flex;
//           flex-direction: column;
//           justify-content: space-between;
//           border-right: 1px solid #ddd;
//           transition: width 0.25s ease;
//         }

//         .expanded { width: 250px; }
//         .collapsed { width: 78px; }

//         .toggle-btn {
//           position: absolute;
//           right: -15px;
//           top: 80px;
//           width: 28px;
//           height: 28px;
//           border-radius: 50%;
//           background: #7c3aed;
//           color: white;
//           border: none;
//           cursor: pointer;
//           font-weight: bold;
//         }

//         .logo-box {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           background: #7c3aed;
//           padding: 12px;
//           border-radius: 10px;
//           color: white;
//           margin-bottom: 1.5rem;
//         }

//         .logo-img {
//           width: 40px;
//           height: 40px;
//         }

//         .logo-text {
//           font-size: 20px;
//           font-weight: bold;
//         }

//         .nav {
//           display: flex;
//           flex-direction: column;
//           gap: 6px;
//         }

//         .nav-btn {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           padding: 10px;
//           border-radius: 8px;
//           cursor: pointer;
//           background: none;
//           border: none;
//           font-size: 16px;
//           transition: 0.2s;
//         }

//         .nav-btn:hover {
//           background: #7c3aed;
//           color: white;
//         }

//         .user-info {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           padding: 10px 0;
//           border-top: 1px solid #ddd;
//         }

//         .user-avatar {
//           width: 40px;
//           height: 40px;
//           background: #7c3aed;
//           color: white;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           border-radius: 50%;
//           font-size: 18px;
//           font-weight: bold;
//         }

//       `}</style>
//     </>
//   );
// }


// import {
//   Home,
//   Search,
//   Briefcase,
//   User,
//   Settings,
//   LogOut,
// } from "lucide-react";

// import { useNavigate } from "react-router-dom";
// import hire from "../../../assets/hire.png";
// import save2 from "../../../assets/save2.png";
// import { useEffect, useState } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth, db } from "../../../firbase/Firebase";
// import { doc, getDoc } from "firebase/firestore";
// import logo from "../../../assets/logo.png";

// export default function Sidebar() {
//   const navigate = useNavigate();

//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   const [userInfo, setUserInfo] = useState({
//     firstName: "",
//     lastName: "",
//     role: "",
//   });

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) return;

//       const snap = await getDoc(doc(db, "users", currentUser.uid));
//       if (snap.exists()) {
//         const data = snap.data();
//         setUserInfo({
//           firstName: data.firstName || "",
//           lastName: data.lastName || "",
//           role: data.role || "",
//         });
//       }
//     });

//     return () => unsub();
//   }, []);

//   function toggleSidebar() {
//     const next = !collapsed;
//     setCollapsed(next);
//     localStorage.setItem("sidebar-collapsed", next);
//     window.dispatchEvent(new CustomEvent("sidebar-toggle", { detail: next }));
//   }

//   return (
//     <>
//       <aside className={`hz-sidebar ${collapsed ? "collapsed" : ""}`}>
        
//         {/* === TOGGLE BUTTON === */}
//         <button className="hz-collapse-btn" onClick={toggleSidebar}>
//           {collapsed ? ">" : "<"}
//         </button>

//         {/* === LOGO BLOCK === */}
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

//         {/* === MENU ===== */}
//         <nav className="hz-menu">

//           <button
//             className="hz-menu-btn"
//             onClick={() =>
//               navigate("/client-dashbroad2/clientserachbar")
//             }
//           >
//             <Home size={18} />
//             {!collapsed && "Home"}
//           </button>

//           <button
//             className="hz-menu-btn"
//             onClick={() =>
//               navigate("/client-dashbroad2/clientcategories")
//             }
//           >
//             <Search size={18} />
//             {!collapsed && "Browse Projects"}
//           </button>

//           <button
//             className="hz-menu-btn"
//             onClick={() =>
//               navigate("/client-dashbroad2/AddJobScreen")
//             }
//           >
//             <Briefcase size={18} />
//             {!collapsed && "Job Posted"}
//           </button>

//           <button
//             className="hz-menu-btn"
//             onClick={() =>
//               navigate("/client-dashbroad2/my-hires")
//             }
//           >
//             <img src={hire} width={18} />
//             {!collapsed && "Hire"}
//           </button>

//           {/* BOTTOM SECTION */}
//           <div className="hz-bottom-menu">
//             <button
//               className="hz-menu-btn"
//               onClick={() =>
//                 navigate("/client-dashbroad2/ClientProfile")
//               }
//             >
//               <User size={18} />
//               {!collapsed && "Profile"}
//             </button>

//             <button
//               className="hz-menu-btn"
//               onClick={() =>
//                 navigate("/client-dashbroad2/Clientsaved")
//               }
//             >
//               <img src={save2} width={18} />
//               {!collapsed && "Saved"}
//             </button>

//             <button
//               className="hz-menu-btn"
//               onClick={() =>
//                 navigate("/client-dashbroad2/companyprofileview")
//               }
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

//         {/* === USER FOOTER === */}
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

//       {/* === CSS EXACTLY SAME AS UI.JSX === */}
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
//           right: -12px;
//           top: 90px;
//           width: 28px;
//           height: 34px;
//           background: #A855F7;
//           border: none;
//           border-radius: 8px;
//           cursor: pointer;
//           color: #fff;
//           font-weight: bold;
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
//           padding: 5px;
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

//         .hz-menu-btn:hover {
//           background: #A855F7;
//           color: #fff;
//         }

//         .hz-bottom-menu {
//           margin-top: 30px;
//           padding-top: 10px;
//           border-top: 1px solid #ddd;
//           display: flex;
//           flex-direction: column;
//           gap: 6px;
//         }

//         .hz-user-footer {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           padding: 12px;
//           background: #ffffff;
//           border-radius: 12px;
//           margin-bottom: 10px;
//         }

//         .hz-user-avatar {
//           width: 40px;
//           height: 40px;
//           background: #A855F7;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           color: #fff;
//           font-weight: 700;
//           border-radius: 50%;
//         }

//         .hz-user-name {
//           font-size: 14px;
//           font-weight: 700;
//         }

//         .hz-user-role {
//           font-size: 12px;
//           color: #7a7a7a;
//         }
//       `}</style>
//     </>
//   );
// }




// import {
//   Home,
//   Search,
//   Briefcase,
//   User,
//   Settings,
//   LogOut,
// } from "lucide-react";

// import { useNavigate } from "react-router-dom";
// import hire from "../../../assets/hire.png";
// import save2 from "../../../assets/save2.png";
// import { useEffect, useState } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth, db } from "../../../firbase/Firebase";
// import { doc, getDoc } from "firebase/firestore";
// import logo from "../../../assets/logo.png";

// export default function Sidebar() {
//   const navigate = useNavigate();

//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   const [activeTab, setActiveTab] = useState("home");

//   const [userInfo, setUserInfo] = useState({
//     firstName: "",
//     lastName: "",
//   });

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) return;

//       const snap = await getDoc(doc(db, "users", currentUser.uid));
//       if (snap.exists()) {
//         const data = snap.data();
//         setUserInfo({
//           firstName: data.firstName || "",
//           lastName: data.lastName || "",
//         });
//       }
//     });

//     return () => unsub();
//   }, []);

//   function toggleSidebar() {
//     const next = !collapsed;
//     setCollapsed(next);
//     localStorage.setItem("sidebar-collapsed", next);
//     window.dispatchEvent(new CustomEvent("sidebar-toggle", { detail: next }));
//   }

//   function goTo(path, name) {
//     setActiveTab(name);
//     navigate(path);
//   }

//   return (
//     <>
//       <aside className={`hz-sidebar ${collapsed ? "collapsed" : ""}`}>
       
//         {/* TOGGLE BUTTON */}
//         <button className="hz-collapse-btn" onClick={toggleSidebar}>
//           {collapsed ? ">" : "<"}
//         </button>

//         {/* TOP LOGO CARD */}
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
//             className={`hz-menu-btn ${activeTab === "home" ? "active-btn" : ""}`}
//             onClick={() => goTo("/client-dashbroad2/clientserachbar", "home")}
//           >
//             <Home size={18} className="icon" />
//             {!collapsed && "Home"}
//           </button>

//           <button
//             className={`hz-menu-btn ${activeTab === "browse" ? "active-btn" : ""}`}
//             onClick={() => goTo("/client-dashbroad2/clientcategories", "browse")}
//           >
//             <Search size={18} className="icon" />
//             {!collapsed && "Browse Projects"}
//           </button>

//           <button
//             className={`hz-menu-btn ${activeTab === "jobs" ? "active-btn" : ""}`}
//             onClick={() => goTo("/client-dashbroad2/AddJobScreen", "jobs")}
//           >
//             <Briefcase size={18} className="icon" />
//             {!collapsed && "My jobs"}
//           </button>

//           <button
//             className={`hz-menu-btn ${activeTab === "service" ? "active-btn" : ""}`}
//             onClick={() => goTo("/client-dashbroad2/my-hires", "service")}
//           >
//             <img src={hire} width={18} className="icon" />
//             {!collapsed && "My Service"}
//           </button>

//           <button
//             className={`hz-menu-btn ${activeTab === "saved" ? "active-btn" : ""}`}
//             onClick={() => goTo("/client-dashbroad2/Clientsaved", "saved")}
//           >
//             <img src={save2} width={18} className="icon" />
//             {!collapsed && "Saved"}
//           </button>

//           <div className="hz-bottom-menu">
//             <button
//               className={`hz-menu-btn ${activeTab === "profile" ? "active-btn" : ""}`}
//               onClick={() => goTo("/client-dashbroad2/ClientProfile", "profile")}
//             >
//               <User size={18} className="icon" />
//               {!collapsed && "Profile"}
//             </button>

//             <button
//               className={`hz-menu-btn ${activeTab === "settings" ? "active-btn" : ""}`}
//               onClick={() => goTo("/client-dashbroad2/companyprofileview", "settings")}
//             >
//               <Settings size={18} className="icon" />
//               {!collapsed && "Settings"}
//             </button>

//             <button
//               className={`hz-menu-btn`}
//               onClick={() => navigate("/logout")}
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
//               <p className="hz-user-role">Premium Member</p>
//             </div>
//           )}
//         </div>
//       </aside>

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

//         /* Toggle button */
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

//         /* Logo card size FIXED */
//         .hz-logo-card {
//           width: 80%;
//           height: 75px;    /* FIXED height */
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

//         /* Collapsed logo */
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

//         /* Menu list */
//         .hz-menu {
//           margin-top: 18px;
//           display: flex;
//           flex-direction: column;
//           gap: 12px;
//         }

//         /* EACH MENU BUTTON */
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

//         /* HOVER  */
//         .hz-menu-btn:hover {
//           background: #c084fc;   /* lighter violet */
//           color: white;
//         }

//         .hz-menu-btn:hover .icon,
//         .hz-menu-btn:hover img {
//           filter: brightness(0) invert(1);
//         }

//         /* ACTIVE BUTTON (clicked) */
//         .active-btn {
//           background: #a855f7 !important;
//           color: white !important;
//         }

//         .active-btn .icon,
//         .active-btn img {
//           filter: brightness(0) invert(1);
//         }

//         /* Collapsed hover fix */
//         .hz-sidebar.collapsed .hz-menu-btn {
//           justify-content: center;
//           padding: 0;
//         }

//         /* Footer */
//         .hz-user-footer {
//           height: 70px;
//           background: white;
//           border-radius: 16px;
//           display: flex;
//           align-items: center;
//           padding: 10px;
//           gap: 12px;
//           box-shadow: 0 6px 20px rgba(0,0,0,0.1);
//           margin-bottom:25px;
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




import {
  Home,
  Search,
  Briefcase,
  User,
  Settings,
  LogOut,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import hire from "../../../assets/hire.png";
import save2 from "../../../assets/save2.png";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../firbase/Firebase";
import { doc, getDoc } from "firebase/firestore";
import logo from "../../../assets/logo.png";

export default function Sidebar() {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  const [activeTab, setActiveTab] = useState("home");

  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) return;

      const snap = await getDoc(doc(db, "users", currentUser.uid));
      if (snap.exists()) {
        const data = snap.data();
        setUserInfo({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
        });
      }
    });

    return () => unsub();
  }, []);

  function toggleSidebar() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar-collapsed", next);
    window.dispatchEvent(new CustomEvent("sidebar-toggle", { detail: next }));
  }

  function goTo(path, name) {
    setActiveTab(name);
    navigate(path);
  }

  return (
    <>
      <aside className={`hz-sidebar ${collapsed ? "collapsed" : ""}`}>
        
        {/* TOGGLE BUTTON */}
        <button className="hz-collapse-btn" onClick={toggleSidebar}>
          {collapsed ? ">" : "<"}
        </button>

        {/* TOP LOGO CARD */}
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
            className={`hz-menu-btn ${activeTab === "home" ? "active-btn" : ""}`}
            onClick={() => goTo("/client-dashbroad2/clientserachbar", "home")}
          >
            <Home size={18} className="icon" />
            {!collapsed && "Home"}
          </button>

          <button
            className={`hz-menu-btn ${activeTab === "browse" ? "active-btn" : ""}`}
            onClick={() => goTo("/client-dashbroad2/clientcategories", "browse")}
          >
            <Search size={18} className="icon" />
            {!collapsed && "Browse Projects"}
          </button>

          <button
            className={`hz-menu-btn ${activeTab === "jobs" ? "active-btn" : ""}`}
            onClick={() => goTo("/client-dashbroad2/AddJobScreen", "jobs")}
          >
            <Briefcase size={18} className="icon" />
            {!collapsed && "My jobs"}
          </button>

          <button
            className={`hz-menu-btn ${activeTab === "service" ? "active-btn" : ""}`}
            onClick={() => goTo("/client-dashbroad2/my-hires", "service")}
          >
            <img src={hire} width={18} className="icon" />
            {!collapsed && "My Service"}
          </button>

          <button
            className={`hz-menu-btn ${activeTab === "saved" ? "active-btn" : ""}`}
            onClick={() => goTo("/client-dashbroad2/Clientsaved", "saved")}
          >
            <img src={save2} width={18} className="icon" />
            {!collapsed && "Saved"}
          </button>

          <div className="hz-bottom-menu">
            <button
              className={`hz-menu-btn ${activeTab === "profile" ? "active-btn" : ""}`}
              onClick={() => goTo("/client-dashbroad2/ClientProfile", "profile")}
            >
              <User size={18} className="icon" />
              {!collapsed && "Profile"}
            </button>

            <button
              className={`hz-menu-btn ${activeTab === "settings" ? "active-btn" : ""}`}
              onClick={() => goTo("/client-dashbroad2/companyprofileview", "settings")}
            >
              <Settings size={18} className="icon" />
              {!collapsed && "Settings"}
            </button>

            <button
              className={`hz-menu-btn`}
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
              <p className="hz-user-role">Premium Member</p>
            </div>
          )}
        </div>
      </aside>

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