

import { Home, Search, Briefcase, User, Settings, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import hire from "../../../assets/hire.png"
import save2 from "../../../assets/save2.png"
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../firbase/Firebase";
import { doc, getDoc } from "firebase/firestore";


export default function Sidebar() {
  const navigate = useNavigate();

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
  

  return (
    <>
      <aside className="sidebar">

        {/* ===== Top Section ===== */}
        <div className="sidebar-top">

          {/* Logo */}
          <div className="logo-box">
            <div className="logo-title">HUZZLE</div>
            <p className="logo-subtitle">Find Your Next Project</p>
          </div>

          {/* Navigation Buttons */}
          <nav className="nav">

            {/* HOME */}
            <button className="nav-btn" onClick={() => navigate("/client-dashbroad2/clientserachbar")}>
              <Home size={18} /> Home
            </button>

            {/* BROWSE PROJECTS */}
            <button className="nav-btn" onClick={() => navigate("/client-dashbroad2/clientcategories")}>
              <Search size={18} /> Browse Projects,,
            </button>

            {/* MY JOBS */}

            <button className="nav-btn" onClick={() => navigate("/client-dashbroad2/AddJobScreen")}>
              <Briefcase size={18} /> Job Posted
            </button>

            <button className="nav-btn" onClick={() => navigate("/client-dashbroad2/my-hires")}>
            <img src={hire} width={"18px"} height={"18px"} alt="hire" className="nav-icon" />Hire
            </button>
            <br /><br /><br /><br />

            {/* PROFILE */}
            <button className="nav-btn" onClick={() => navigate("/client-dashbroad2/ClientProfile")}>
              <User size={18} /> Profile
            </button>

            <button className="nav-btn" onClick={() => navigate("/client-dashbroad2/Clientsaved")}>
              <img src={save2} width={"18px"} height={"18px"} alt="hire" className="nav-icon" />saved
            </button>
            {/* SETTINGS */}
            <button className="nav-btn" onClick={() => navigate("/client-dashbroad2/companyprofileview")}>
              <Settings size={18} /> Settings
            </button>

            {/* LOGOUT */}
            <button className="nav-btn logout" onClick={() => navigate("/logout")}>
              <LogOut size={18} /> Logout
            </button>

          </nav>
        </div>

        {/* ===== User Info ===== */}
      <div className="user-info">
          <div className="user-avatar">
            {(userInfo.firstName || "?")[0].toUpperCase()}
          </div>

          <div>
            <p className="user-name">
             <Link to={"/client-dashbroad2/ClientProfile"}> {userInfo.firstName} {userInfo.lastName}</Link>
            </p>
            <p className="user-status">{userInfo.role}</p>
          </div>
        </div>
      </aside>

      {/* ===== CSS SECTION ===== */}
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
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
        }

        .logo-subtitle {
          color: #ddd6fe;
          font-size: 0.85rem;
          margin-top: 0.25rem;
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
          margin-top: 0.5rem;
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
