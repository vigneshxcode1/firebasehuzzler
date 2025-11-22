
import React from "react";
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

export default function FreelanceSideBar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to check active route
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <aside className="sidebar">
        {/* ===== Top Section ===== */}
        <div className="sidebar-top">
          {/* Logo */}
          <div className="logo-box">
            <div className="logo-title">HUZZLER</div>
            <p className="logo-subtitle">Find Your Next Project</p>
          </div>

          {/* Navigation Buttons */}
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
              className={`nav-btn ${
                isActive("/freelance-dashboard/freelancebrowesproject") ? "active" : ""
              }`}
              onClick={() => navigate("/freelance-dashboard/freelancebrowesproject")}
            >
              <Search size={18} /> Browse Projects
            </button>

            {/* MY JOBS */}
            <button
              className={`nav-btn ${isActive("/myjobs") ? "active" : ""}`}
              onClick={() => navigate("/freelance-dashboard/myjobs")}
            >
              <Briefcase size={18} /> My Job 
            </button>

            {/* MY SERVICE */}
            <button
              className={`nav-btn ${isActive("/freelance-dashboard/sidebarsaved") ? "active" : ""}`}
              onClick={() => navigate("/freelance-dashboard/sidebarsaved")}
            >
              <Briefcase size={18} /> My Service
            </button>

            {/* PROFILE */}
            <button
              className={`nav-btn ${
                isActive("/freelance-dashboard/accountfreelancer")
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                navigate("/freelance-dashboard/accountfreelancer")
              }
            >
              <User size={18} /> Profile
            </button>

            {/* SAVED JOBS */}
            <button
              className={`nav-btn ${
                isActive("/freelance-dashboard/saved") ? "active" : ""
              }`}
              onClick={() =>
                // query param ?saved=1 → ExploreJobScreen will open "Saved" tab
                navigate("/freelance-dashboard/saved")
              }
            >
              <Bookmark size={18} /> Saved
            </button>

            {/* SETTINGS */}
            <button
              className={`nav-btn ${
                isActive("/freelance-dashboard/settings") ? "active" : ""
              }`}
              onClick={() => navigate("/freelance-dashboard/settings")}
            >
              <Settings size={18} /> Settings
            </button>

            {/* LOGOUT */}
            <button
              className="nav-btn logout"
              onClick={() => navigate("/logout")}
            >
              <LogOut size={18} /> Logout
            </button>
          </nav>
        </div>

        {/* ===== User Info ===== */}
        <div className="user-info">
          <div className="user-avatar">JA</div>
          <div>
            <p
              className="user-name"
              onClick={() =>
                navigate("/freelance-dashboard/account-details")
              }
            >
              James Andrew
            </p>
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
          box-sizing: border-box;
          z-index: 20;
        }

        .sidebar-top {
          display: flex;
          flex-direction: column;
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
          letter-spacing: 0.03em;
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

        .nav-btn svg {
          flex-shrink: 0;
        }

        .nav-btn:hover {
          background-color: #7c3aed;
          color: #fff;
          transform: translateX(4px);
          box-shadow: 0 2px 10px rgba(124, 58, 237, 0.3);
        }

        /* Active state for current route */
        .nav-btn.active {
          background-color: #7c3aed;
          color: #fff;
          box-shadow: 0 2px 10px rgba(124, 58, 237, 0.3);
        }

        .nav-btn.active svg {
          color: #fff;
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
          cursor: pointer;
        }

        .user-name:hover {
          text-decoration: underline;
        }

        .user-status {
          font-size: 0.75rem;
          color: #6b7280;
        }

        @media (max-height: 700px) {
          .sidebar {
            padding: 1rem;
          }
          .logo-box {
            margin-bottom: 1rem;
          }
          .nav-btn {
            padding: 0.6rem;
          }
        }
      `}</style>
    </>
  );
}