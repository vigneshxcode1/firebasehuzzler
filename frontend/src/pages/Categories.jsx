import React from "react";
import { FiSearch, FiArrowLeft } from "react-icons/fi";
import categoriesImg from "../assets/categories.jpeg";
import Sidebar from "./Freelancerpage/components/Sidebar";
import profile from "../assets/profile.png";

const Categories = () => {
  const categories = [
    { name: "Graphic Designer" },
    { name: "Web Developer" },
    { name: "Mobile Developer" },
    { name: "UI/UX Designer" },
    { name: "Content Writer" },
    { name: "Digital Marketing" },
    { name: "Video Editor" },
    { name: "3D Artist" },
  ];

  return (
    <>
      <style>{`
        .categories-container {
          margin-left: 260px;
          min-height: 100vh;
          background: #f9fafb;
          padding: 32px;
          font-family: "Inter", sans-serif;
        }

        /* Header */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .header-left h1 {
          font-size: 30px;
          font-weight: 600;
          color: #1f2937;
        }

        .header-left p {
          color: #6b7280;
          margin-top: 4px;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-right i {
          font-size: 20px;
          color: #6b7280;
          cursor: pointer;
        }

        .header-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        /* Search Bar */
        .search-bar {
          background: #fef3c7;
          padding: 12px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
        }

        .search-input {
          background: transparent;
          border: none;
          outline: none;
          width: 100%;
          font-size: 15px;
          color: #374151;
        }

        /* Browse title */
        .browse-section {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .browse-section h2 {
          font-size: 20px;
          font-weight: 600;
          color: #374151;
        }

        /* Categories Section */
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 4px;
        }

        .section-sub {
          color: #6b7280;
          margin-bottom: 24px;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
        }

        .category-card {
          background: white;
          border-radius: 18px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: 0.3s;
          overflow: hidden;
          cursor: pointer;
        }

        .category-card:hover {
          box-shadow: 0 6px 18px rgba(0,0,0,0.15);
          transform: translateY(-3px);
        }

        .category-img-box {
          height: 130px;
          background: #7c3aed;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .category-img {
          width: 60%;
          border-radius: 10px;
        }

        .category-name {
          padding: 12px;
          text-align: center;
          font-weight: 500;
          color: #374151;
        }

        /* Floating Add Button */
        .add-btn {
          position: fixed;
          bottom: 32px;
          right: 32px;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #7c3aed;
          color: white;
          border: none;
          box-shadow: 0 4px 14px rgba(0,0,0,0.2);
          font-size: 26px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: 0.3s;
        }

        .add-btn:hover {
          background: #6b21a8;
          transform: scale(1.08);
        }
      `}</style>

      <div className="categories-container">
        {/* Header */}
        <div className="header">
          <div className="header-left">
            <h1>
              Welcome, <strong>James Andrew!</strong>
            </h1>
            <p>Discover projects that match your skills</p>
          </div>

          <div className="header-right">
            <i className="fa-regular fa-comment" />
            <i className="fa-regular fa-bell" />
            <img src={profile} className="header-avatar" alt="User Avatar" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <FiSearch size={20} color="#374151" />
          <input
            type="text"
            placeholder="Search projects..."
            className="search-input"
          />
        </div>

        {/* Browse */}
        <div className="browse-section">
          <FiArrowLeft size={20} color="#374151" />
          <h2>Browse Projects</h2>
        </div>

        {/* Categories */}
        <h3 className="section-title">What Are You Looking For?</h3>
        <p className="section-sub">Choose your category</p>

        <div className="categories-grid">
          {categories.map((cat, index) => (
            <div key={index} className="category-card">
              <div className="category-img-box">
                <img src={categoriesImg} className="category-img" alt="" />
              </div>
              <div className="category-name">{cat.name}</div>
            </div>
          ))}
        </div>

        {/* + Button */}
        <button className="add-btn">+</button>
      </div>
    </>
  );
};

export default Categories;