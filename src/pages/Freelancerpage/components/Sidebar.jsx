// FreelanceSideBar.jsx
import React, { useEffect, useState } from "react";
import logo from '../../../assets/logo.png'

import {
  Home,
  Search,
  Briefcase,
  User,
  Settings,
  LogOut,
  Bookmark,
} from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { auth, db } from "../../../firbase/Firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";



export default function FreelanceSideBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    role: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        console.log("No logged-in user");
        return;
      }

      const uid = currentUser.uid;
      console.log("Fetched UID:", uid);

      try {
        const userRef = doc(db, "users", uid);
        const snap = await getDoc(userRef); // FIXED

        if (snap.exists()) {
          const data = snap.data();

          setUserInfo({   // FIXED
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            role: data.role || "",
          });

          console.log("User data:", data);
        } else {
          console.log("User not found in Firestore");
        }
      } catch (error) {
        console.error("Error fetching Firestore user:", error);
      }
    });

    return () => unsubscribe();
  }, []);




  // ------------- ACTIVE ROUTE CHECK ----------------
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <aside className="sidebar">
        {/* ============ TOP SECTION ============ */}
        <div className="sidebar-top">
          <div className="logo-box">
            {/* <div className="logo-title">  HUZZLER</div> */}
            <div className="logo-title">
              <span>  <img src={logo} style={{ width: "53px", height: "53px" }} alt="back" /></span>
              <span className="logo-title" style={{ marginTop: "10px" }}>HUZZLER</span>
            </div>

          </div>

          {/* ============ NAVIGATION ============ */}
          <nav className="nav">
            {/* HOME */}
            <button
              className={`nav-btn ${isActive("/freelance-dashboard") ? "active" : ""}`}
              onClick={() => navigate("/freelance-dashboard")}
            >
              <Home size={18} /> Home
            </button>

            {/* BROWSE PROJECTS */}
            <button
              className={`nav-btn ${isActive("/freelance-dashboard/freelancebrowesproject") ? "active" : ""
                }`}
              onClick={() =>
                navigate("/freelance-dashboard/freelancebrowesproject")
              }
            >
              <Search size={18} /> Browse Projects
            </button>

            {/* MY JOBS */}
            <button
              className={`nav-btn ${isActive("/freelance-dashboard/myjobs") ? "active" : ""
                }`}
              onClick={() => navigate("/freelance-dashboard/freelancermyworks")}
            >
              <Briefcase size={18} /> My Job
            </button>

            {/* MY SERVICE */}
            <button
              className={`nav-btn ${isActive("/freelance-dashboard/sidebarsaved") ? "active" : ""
                }`}
              onClick={() => navigate("/freelance-dashboard/sidebarsaved")}
            >
              <Briefcase size={18} /> My Service
            </button>
            <button
              className={`nav-btn ${isActive("/freelance-dashboard/saved") ? "active" : ""
                }`}
              onClick={() => navigate("/freelance-dashboard/saved")}
            >
              <Bookmark size={18} /> Saved
            </button><br /><br /><br /><br /><br />

            {/* PROFILE */}
            <button
              className={`nav-btn ${isActive("/freelance-dashboard/accountfreelancer") ? "active" : ""
                }`}
              onClick={() =>
                navigate("/freelance-dashboard/accountfreelancer")
              }
            >
              <User size={18} /> Profile
            </button>




            {/* SETTINGS */}
            <button
              className={`nav-btn ${isActive("/freelance-dashboard/settings") ? "active" : ""
                }`}
              onClick={() => navigate("/freelance-dashboard/settings")}
            >
              <Settings size={18} /> Settings
            </button>

            {/* LOGOUT */}
            <button className="nav-btn logout" onClick={() => navigate("/logout")}>
              <LogOut size={18} /> Logout
            </button>
          </nav>
        </div>

        {/* ============ USER INFO ============ */}

        <div className="user-info">
          <div className="user-avatar">
            {(userInfo.firstName || "?")[0].toUpperCase()}
          </div>

          <div>
            <Link to={"/freelance-dashboard/Profilebuilder"}>
              <p className="user-name">
              {userInfo.firstName} {userInfo.lastName}
            </p></Link>

            <p className="user-status">{userInfo.role}</p>
          </div>
        </div>


      </aside>

      {/* ============ CSS ============ */}
      <style>{`
        .sidebar {
          width: 13rem;
          height: 100vh;
          background: linear-gradient(to bottom, #fef08a, #fefce8, #ffffff);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1.5rem;
          position: fixed;
          left: 0;
          top: 0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          border-right: 1px solid #eee;
          z-index: 20;
        }

        .logo-box {
          height:46px;
          width:180px;
          background: rgba(124, 60, 255,1);
          padding: 1rem;
          border-radius: 0.75rem;
          text-align: center;
          box-shadow: 0 4px 12px rgba(124,58,237,0.3);
          margin-bottom: 1.5rem;
        }

        .logo-title {
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
          margin-top:-10px;
        }
          

        .logo-subtitle {
          color: #ddd6fe;
          font-size: 0.85rem;
        }

        .nav {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .nav-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: none;
          border: none;
          padding: 0.75rem;
          font-size: 0.95rem;
          font-weight: 500;
          color: #1f2937;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: 0.2s;
        }

        .nav-btn:hover {
          background: #7c3aed;
          color: white;
          transform: translateX(4px);
          box-shadow: 0 2px 10px rgba(124,58,237,0.3);
        }

        .nav-btn.active {
          background: #7c3aed;
          color: white;
          box-shadow: 0 2px 10px rgba(124,58,237,0.3);
        }

        .logout {
          color: block;
        }

        .logout:hover {
          background-color: block;
          color: white;
        }
          
        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding-top: 1rem;
          border-top: 1px solid #ccc;
          margin-bottom:100px;
        }

        .user-avatar {
          background: #7c3aed;
          color: white;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .user-name {
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          padding-bottom:;
        }

        .user-name:hover {
          text-decoration: underline;
        }

        .user-status {
          font-size: 0.75rem;
          color: #6b7280;
        }
      `}</style>
    </>
  );
}