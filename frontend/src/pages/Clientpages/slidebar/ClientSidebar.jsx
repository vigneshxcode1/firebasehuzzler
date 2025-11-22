

import { Home, Search, Briefcase, User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <>
      <aside className="sidebar">

        {/* ===== Top Section ===== */}
        <div className="sidebar-top">

          {/* Logo */}
          <div className="logo-box">
            <div className="logo-title">HUZZLE vicky</div>
            <p className="logo-subtitle">Find Your Next Project</p>
          </div>

          {/* Navigation Buttons */}
          <nav className="nav">

            {/* HOME */}
            <button className="nav-btn" onClick={() => navigate("/client-dashbroad2/clientserachbar")}>
              <Home size={18} /> Home
            </button>

            {/* BROWSE PROJECTS */}
            <button className="nav-btn" onClick={() => navigate("/client-dashbroad2/categories")}>
              <Search size={18} /> Browse Projects
            </button>

            {/* MY JOBS */}
    
             <button className="nav-btn" onClick={() => navigate("/client-dashbroad2/AddJobScreen")}>
              <Briefcase size={18} /> Job Posted
            </button>

            {/* PROFILE */}
            <button className="nav-btn" onClick={() => navigate("/client-dashbroad2/ClientProfile")}>
              <User size={18} /> Profile
            </button>

            <button className="nav-btn" onClick={() => navigate("/client-dashbroad2/Clientsaved")}>
              <User size={18} /> saved
            </button>
            {/* SETTINGS */}
            <button className="nav-btn" onClick={() => navigate()}>
              <Settings size={18} /> Settings
            </button>

               <button className="nav-btn" onClick={() => navigate("/messages")}>
              <Settings size={18} />message
            </button>

              <button className="nav-btn" onClick={() => navigate("/request-messages")}>
              <Settings size={18} />request
            </button>

            {/* LOGOUT */}
            <button className="nav-btn logout" onClick={() => navigate("/logout")}>
              <LogOut size={18} /> Logout
            </button>

          </nav>
        </div>

        {/* ===== User Info ===== */}
        <div className="user-info">
          <div className="user-avatar">JA</div>
          <div>
            <p className="user-name"   onClick={() => navigate("/client-dashbroad2/account-details")}>James Andrew</p>
            <p className="user-status">Premium Member</p>
          </div>
        </div>
      </aside>

      {/* ===== CSS SECTION ===== */}
      <style>{`
        .sidebar {
          width: 16rem;
          height: 100vh;
          background: linear-gradient(to bottom, #fef08a, #fefce8, #ffffff);
          color: #000;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1.5rem;
          position: fixed;
          top: 0;
          left: 0;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          border-right: 1px solid #f3f3f3;
        }

        .logo-box {
          background-color: #7c3aed;
          border-radius: 0.75rem;
          padding: 1rem;
          text-align: center;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
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
          gap: 0.6rem;
        }

        .nav-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border: none;
          background: none;
          border-radius: 0.75rem;
          font-size: 0.95rem;
          font-weight: 500;
          color: #1f2937;
          cursor: pointer;
          transition: all 0.25s ease;
          text-align: left;
        }

        .nav-btn:hover {
          background-color: #7c3aed;
          color: #fff;
          transform: translateX(4px);
          box-shadow: 0 2px 10px rgba(124, 58, 237, 0.3);
        }

        .logout {
          margin-top: 0.5rem;
          color: #ef4444;
        }

        .logout:hover {
          background-color: #ef4444;
          color: white;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .user-avatar {
          background-color: #7c3aed;
          color: white;
          font-weight: 700;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: #111827;
        }

        .user-status {
          font-size: 0.75rem;
          color: #6b7280;
        }

      `}</style>
    </>
  );
}
