
// import {
//   Home,
//   Search,
//   Briefcase,
//   User,
//   Settings,
//   LogOut,
//   Menu,
//   X,
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

//   const [mobileOpen, setMobileOpen] = useState(false);

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

//   function handleNav(path, name) {
//     setActiveTab(name);
//     navigate(path);
//     setMobileOpen(false); // ✅ close sidebar on mobile click
//   }

//   return (
//     <>
//       {/* ========== MOBILE TOPBAR (NEW) ========== */}
//       <div className="mobile-topbar">
//         <img src={logo} className="mobile-logo" />
//         <button
//           className="mobile-menu-btn"
//           onClick={() => setMobileOpen(!mobileOpen)}
//         >
//           {mobileOpen ? <X size={26} /> : <Menu size={26} />}
//         </button>
//       </div>

//       {/* ========== SIDEBAR ========== */}
//       <aside
//         className={`hz-sidebar ${collapsed ? "collapsed" : ""} ${
//           mobileOpen ? "mobile-show" : ""
//         }`}
//       >
//         {/* TOGGLE BUTTON (DESKTOP SAME) */}
//         <button className="hz-collapse-btn" onClick={toggleSidebar}>
//           {collapsed ? ">" : "<"}
//         </button>

//         {/* LOGO */}
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
//             onClick={() =>
//               handleNav("/client-dashbroad2/clientserachbar", "home")
//             }
//           >
//             <Home size={18} className="icon" />
//             {!collapsed && "Home"}
//           </button>

//           <button
//             className={`hz-menu-btn ${activeTab === "browse" ? "active-btn" : ""}`}
//             onClick={() =>
//               handleNav("/client-dashbroad2/ClientSideCategories", "browse")
//             }
//           >
//             <Search size={18} className="icon" />
//             {!collapsed && "Browse Projects"}
//           </button>

//           <button
//             className={`hz-menu-btn ${activeTab === "jobs" ? "active-btn" : ""}`}
//             onClick={() =>
//               handleNav("/client-dashbroad2/AddJobScreen", "jobs")
//             }
//           >
//             <Briefcase size={18} className="icon" />
//             {!collapsed && "Job Posted"}
//           </button>

//           <button
//             className={`hz-menu-btn ${
//               activeTab === "service" ? "active-btn" : ""
//             }`}
//             onClick={() =>
//               handleNav("/client-dashbroad2/my-hires", "service")
//             }
//           >
//             <img src={hire} width={18} className="icon" />
//             {!collapsed && "Hire"}
//           </button>

//           <button
//             className={`hz-menu-btn ${activeTab === "saved" ? "active-btn" : ""}`}
//             onClick={() =>
//               handleNav("/client-dashbroad2/Clientsaved", "saved")
//             }
//           >
//             <img src={save2} width={18} className="icon" />
//             {!collapsed && "Saved"}
//           </button>

//           <div className="hz-bottom-menu">
//             <button
//               className={`hz-menu-btn ${
//                 activeTab === "profile" ? "active-btn" : ""
//               }`}
//               onClick={() =>
//                 handleNav("/client-dashbroad2/ClientProfile", "profile")
//               }
//             >
//               <User size={18} className="icon" />
//               {!collapsed && "Profile"}
//             </button>

//             <button
//               className={`hz-menu-btn ${
//                 activeTab === "settings" ? "active-btn" : ""
//               }`}
//               onClick={() =>
//                 handleNav(
//                   "/client-dashbroad2/companyprofileview",
//                   "settings"
//                 )
//               }
//             >
//               <Settings size={18} className="icon" />
//               {!collapsed && "Settings"}
//             </button>

//             <button className="hz-menu-btn" onClick={() => navigate("/logout")}>
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
//               <p className="hz-user-role">Client</p>
//             </div>
//           )}
//         </div>
//       </aside>

//       {/* ========== STYLES ========== */}
//       <style>{`
//         /* --------- DESKTOP STYLES (UNCHANGED) --------- */

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
//           z-index: 999;
//         }

//         .hz-sidebar.collapsed {
//           width: 80px;
//         }

//         .hz-collapse-btn {
//           position: absolute;
//           top: 50px;
//           left: 320px;
//           width: 32px;
//           height: 32px;
//           border-radius: 10px;
//           background: #a855f7;
//           border: none;
//           color: white;
//           cursor: pointer;
//           transition: left 0.3s ease;
//         }

//         .hz-sidebar.collapsed .hz-collapse-btn {
//           left: 100px;
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
//           margin-top: -10px;
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
//           margin-top: 5px;
//           display: flex;
//           flex-direction: column;
//           gap: 12px;
//         }

//         .hz-menu-btn {
//           height: 40px;
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

//         .active-btn {
//           background: #a855f7 !important;
//           color: white !important;
//         }

//         .hz-sidebar.collapsed .hz-menu-btn {
//           justify-content: center;
//           padding: 0;
//         }

//         .hz-user-footer {
//           height: 70px;
//           background: white;
//           box-shadow: 0 6px 20px rgba(0,0,0,0.1);
//           width: calc(100% + 6px);
//           margin-left: -18px;
//           display: flex;
//           align-items: center;
//           padding: 10px 15px;
//           gap: 12px;
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
//           margin-top: 100px;
//           display: flex;
//           flex-direction: column;
//           gap: 14px;
//         }

//         /* --------- MOBILE ONLY (NEW) --------- */

//         .mobile-topbar {
//           display: none;
//         }

//         @media (max-width: 768px) {
//           .hz-sidebar {
//             left: -320px;
//           }

//           .hz-sidebar.mobile-show {
//             left: 0;
//             width: 100%;
//           }

//           .hz-collapse-btn {
//             display: none;
//           }

//           .mobile-topbar {
//             display: flex;
//             width: 100%;
//             height: 60px;
//             background: white;
//             align-items: center;
//             justify-content: space-between;
//             padding: 0 16px;
//             position: fixed;
//             top: 0;
//             z-index: 1000;
//             border-bottom: 1px solid #ddd;
//           }

//           .mobile-logo {
//             width: 45px;
//           }

//           .mobile-menu-btn {
//             background: none;
//             border: none;
//             cursor: pointer;
//           }
//         }
//       `}</style>
//     </>
//   );
// }




import React, { useEffect, useState } from "react";
import logo from "../../../assets/logo.png";
import hire from "../../../assets/hire.png";

import myservices from "../../../assets/MyServices.png";
import myjobs from "../../../assets/myjobs.png";
import search from "../../../assets/search.png";
import profile from "../../../assets/profile.png";
import settings from "../../../assets/settings.png";
import save2 from "../../../assets/save2.png";
import home from "../../../assets/Home.png";
import signout from "../../../assets/signout.png";

import {
  Home,
  Search,
  Briefcase,
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../../../firbase/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function ClientSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
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
  }, []);

  const isActive = (path) => location.pathname === path;

  function toggleSidebar() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar-collapsed", next);
    window.dispatchEvent(new CustomEvent("sidebar-toggle", { detail: next }));
  }

  function handleNav(path) {
    navigate(path);
    setMobileOpen(false);
  }

  return (
    <>
      {/* MOBILE TOPBAR */}
      <div className="mobile-topbar">
        <img src={logo} className="mobile-logo" />
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside
        className={`hz-sidebar ${collapsed ? "collapsed" : ""} ${
          mobileOpen ? "mobile-show" : ""
        }`}
      >
        {/* COLLAPSE */}
        <button className="hz-collapse-btn" onClick={toggleSidebar}>
          {collapsed ? ">" : "<"}
        </button>

        {/* LOGO */}
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
            className={`hz-menu-btn ${
              isActive("/client-dashbroad2/clientserachbar") ? "active-btn" : ""
            }`}
            onClick={() =>
              handleNav("/client-dashbroad2/clientserachbar")
            }
          >
            <img src={home} width={18} />
            {!collapsed && "Home"}
          </button>

          <button
            className={`hz-menu-btn ${
              isActive("/client-dashbroad2/clientcategories") ? "active-btn" : ""
            }`}
            onClick={() =>
              handleNav("/client-dashbroad2/clientcategories")
            }
          >
            <img src={search} width={18} />
            {!collapsed && "Browse Projects"}
          </button>

          <button
            className={`hz-menu-btn ${
              isActive("/client-dashbroad2/AddJobScreen") ? "active-btn" : ""
            }`}
            onClick={() =>
              handleNav("/client-dashbroad2/AddJobScreen")
            }
          >
            <img src={myjobs} width={18} />
            {!collapsed && "Job Posted"}
          </button>

          <button
            className={`hz-menu-btn ${
              isActive("/client-dashbroad2/my-hires") ? "active-btn" : ""
            }`}
            onClick={() =>
              handleNav("/client-dashbroad2/my-hires")
            }
          >
            <img src={hire} width={18} />
            {!collapsed && "Hire"}
          </button>

          <button
            className={`hz-menu-btn ${
              isActive("/client-dashbroad2/Clientsaved") ? "active-btn" : ""
            }`}
            onClick={() =>
              handleNav("/client-dashbroad2/Clientsaved")
            }
          >
            <img src={save2} width={18} />
            {!collapsed && "Saved"}
          </button>

          <div className="hz-bottom-menu">
            <button
              className={`hz-menu-btn ${
                isActive("/client-dashbroad2/ClientProfile") ? "active-btn" : ""
              }`}
              onClick={() =>
                handleNav("/client-dashbroad2/ClientProfile")
              }
            >
            <img src={profile} width={18} />
              {!collapsed && "Profile"}
            </button>

            <button
              className={`hz-menu-btn ${
                isActive("/client-dashbroad2/companyprofileview") ? "active-btn" : ""
              }`}
              onClick={() =>
                handleNav("/client-dashbroad2/companyprofileview")
              }
            >
             <img src={settings} width={18} />
              {!collapsed && "Settings"}
            </button>

            <button className="hz-menu-btn" onClick={() => navigate("/logout")}>
              <img src={signout} width={18} />
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
              <p className="hz-user-role">Client</p>
            </div>
          )}
        </div>
      </aside>

      {/* 🔥 SAME CSS AS FREELANCER */}
     
      {/* CSS */}
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
  transition: 0.3s ease;
  font-family: "Rubik", sans-serif;
  z-index: 999;
}

.hz-sidebar.collapsed {
  width: 80px;
}

/* COLLAPSE BUTTON */
.hz-collapse-btn {
  position: absolute;
  top: 60px;
  left: 290px;
  width: 32px;
  height: 42px;
  border-radius: 10px;
  background: #a855f7;
  border: none;
  color: white;
  cursor: pointer;
  transition: left 0.3s ease;
}

.hz-sidebar.collapsed .hz-collapse-btn {
  left: 70px;
   top: 100px;
}

/* LOGO */
.hz-logo-card {
  width: 240px;
  height: 90px;
  background: #a855f7;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 10px 18px;
  gap: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  margin-top: 30px;
  margin-bottom: 40px;
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

.hz-logo-small-wrap {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 40px;
}

.hz-logo-img-small {
  width: 55px;
  height: 55px;

  border-radius: 14px;
  border: 2px solid #a855f7;
  padding: 4px;
}

/* MENU */
.hz-menu {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1; /* IMPORTANT */
}

.hz-menu-btn {
  height: 40px;
  width: 90%;
  border: none;
  border-radius: 14px;
  background: none;
  display: flex;
  align-items: center;
  padding: 25px 16px;
  gap: 12px;
  cursor: pointer;
  transition: 0.25s ease;
  font-size: 15px;
  color: #222;
}

.hz-menu-btn img {
  width: 18px;
  min-width: 18px;
}

/* HOVER */
.hz-menu-btn:hover {
  background: #c084fc;
  color: white;
}

.hz-menu-btn:hover img {
  filter: brightness(0) invert(1);
}

/* ACTIVE */
.active-btn {
  background: #a855f7 !important;
  color: white !important;
}

.active-btn img {
  filter: brightness(0) invert(1);
}

/* COLLAPSED MENU (NO SPACING CHANGE) */
.hz-sidebar.collapsed .hz-menu-btn {
  justify-content: center;
  padding: 25px 16px;
}

/* BOTTOM MENU */
.hz-bottom-menu {
  margin-top: auto; /* KEY FIX */
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* USER FOOTER */
.hz-user-footer {
  height: 70px;
  background: white;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  width: calc(100% + 35px);
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
margin-top:10px;
}

.hz-user-role {
  font-size: 12px;
  color: #666;
 
  margin-top:-20px;
 
}

/* MOBILE TOPBAR */
.mobile-topbar {
  display: none;
}

@media (max-width: 768px) {
*{
overflow:hidden;
}
  .hz-sidebar {
  top:30px;
    left: -320px;
  }

  .hz-sidebar.mobile-show {
 height:100%;
    left: 0;
    width: 100%;
  }

  .hz-collapse-btn {
    display: none;
  }

  .mobile-topbar {
    display: flex;
    width: 100%;
    height: 60px;
    background: white;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    border-bottom: 1px solid #ddd;
    position: fixed;
    top: 0;
    z-index: 1000;
  }

  .mobile-logo {
    width: 45px;
  
  }

  .mobile-menu-btn {
    background: none;
    border: none;
    cursor: pointer;
  }
 /* LOGO */
.hz-logo-card {
  width: 360px;
  height: 90px;
  background: #a855f7;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 10px 18px;
  gap: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  margin-top: 30px;
  margin-bottom: 40px;
 
}

}

      `}</style>
    </>
  );
}
