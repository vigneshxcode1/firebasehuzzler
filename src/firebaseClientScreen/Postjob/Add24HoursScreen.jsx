// Add24HoursScreen.jsx
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useLocation, useNavigate } from "react-router-dom";
import {
  doc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firbase/Firebase";


// =========================================================
// MAIN COMPONENT
// =========================================================
export default function Add24HoursScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();
  const user = auth.currentUser;

  const jobId = location?.state?.jobId || null;
  const jobData = location?.state?.jobData || null;

  // =========================================================
  // STATES
  // =========================================================
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");

  const [category, setCategory] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const [saving, setSaving] = useState(false);
  const [selectedTab, setSelectedTab] = useState("24 Hours");

  // =========================================================
  // CATEGORY OPTIONS
  // =========================================================
  const categoryOptions = [
    "Graphics & Design",
    "Programming & Tech",
    "Digital Marketing",
    "Writing & Translation",
    "Video & Animation",
    "Music & Audio",
    "AI Services",
    "Data",
    "Business",
    "Finance",
    "Photography",
    "Lifestyle",
    "Consulting",
    "Personal Growth & Hobbies",
  ].map((e) => ({ label: e, value: e }));

  // =========================================================
  // SKILL OPTIONS
  // =========================================================
  const skillOptions = [
    "Logo Design",
    "Brand Style Guides",
    "Business Cards & Stationery",
    "Illustration",
    "Pattern Design",
    "Website Design",
    "App Design",
    "UX Design",
    "Game Art",
    "NFTs & Collectibles",
    "Industrial & Product Design",
    "Architecture & Interior Design",
    "Landscape Design",
    "Fashion Design",
    "Jewelry Design",
    "Presentation Design",
    "Infographic Design",
    "Vector Tracing",
    "Car Wraps",
    "Image Editing",
    "Photoshop Editing",
    "T-Shirts & Merchandise",
    "Packaging Design",
    "Book Design",
    "Album Cover Design",
    "Podcast Cover Art",
    "Menu Design",
    "Invitation Design",
    "Brochure Design",
    "Poster Design",
    "Signage Design",
    "Flyer Design",
    "Social Media Design",
    "Print Design",
    "Website Development",
    "Website Builders & CMS",
    "Web Programming",
    "E-Commerce Development",
    "Game Development",
    "Mobile Apps (iOS & Android)",
    "Desktop Applications",
    "Chatbots",
    "QA & Review",
    "User Testing",
    "Support & IT",
    "Data Analysis & Reports",
    "Convert Files",
    "Databases",
    "Cybersecurity & Data Protection",
    "Cloud Computing",
    "DevOps",
    "AI Development",
    "Machine Learning Models",
    "Blockchain & NFTs",
    "Scripts & Automation",
    "Software Customization",
    "Social Media Marketing",
    "SEO",
    "Content Marketing",
    "Video Marketing",
    "Email Marketing",
    "SEM",
    "Influencer Marketing",
    "Local SEO",
    "Affiliate Marketing",
    "Mobile Marketing",
    "Display Advertising",
    "E-Commerce Marketing",
    "Text Message Marketing",
    "Crowdfunding",
    "Web Analytics",
    "Domain Research",
    "Music Promotion",
    "Book & eBook Marketing",
    "Podcast Marketing",
    "Community Management",
    "Marketing Consulting",
    "Articles & Blog Posts",
    "Proofreading & Editing",
    "Translation",
    "Website Content",
    "Technical Writing",
    "Copywriting",
    "Brand Voice & Tone",
    "Resume Writing",
    "LinkedIn Profiles",
    "Press Releases",
    "Product Descriptions",
    "Case Studies",
    "White Papers",
    "Video Editing",
    "2D/3D Animation",
    "Logo Animation",
    "Voice Over",
  ].map((e) => ({ label: e, value: e }));

  // =========================================================
  // TOOL OPTIONS
  // =========================================================
  const toolOptions = [
    "Adobe Illustrator",
    "Photoshop",
    "Figma",
    "Canva",
    "Inkscape",
    "CorelDraw",
    "VS Code",
    "React",
    "Node.js",
    "Tailwind CSS",
    "Unity",
    "Blender",
    "Miro",
    "Notion",
    "Adobe XD",
    "Sketch",
    "Webflow",
    "Shopify",
    "MongoDB",
    "MySQL",
    "Git",
    "Flutter",
    "React Native",
    "Java",
    "Kotlin",
    "Swift",
  ].map((e) => ({ label: e, value: e }));

  // =========================================================
  // PREFILL WHEN EDITING
  // =========================================================
  useEffect(() => {
    if (jobData) {
      setTitle(jobData.title || "");
      setDesc(jobData.description || "");
      setBudget(jobData.budget || "");
      setNotes(jobData.notes || "");

      if (jobData.category) {
        setCategory({ label: jobData.category, value: jobData.category });
      }

      if (jobData.skills) {
        setSelectedSkills(jobData.skills.map((e) => ({ label: e, value: e })));
      }

      if (jobData.tools) {
        setSelectedTools(jobData.tools.map((e) => ({ label: e, value: e })));
      }

      if (jobData.startDateTime) {
        const dt = jobData.startDateTime.toDate();
        setStartDate(dt.toISOString().split("T")[0]);
        setStartTime(dt.toTimeString().slice(0, 5)); // HH:mm
      }
    }
  }, [jobData]);

  // =========================================================
  // SAVE JOB
  // =========================================================
  async function saveJob() {
    if (!user) return alert("User not logged in");

    if (title.trim().split(" ").length < 2)
      return alert("Title must be at least 2 words");

    if (desc.trim().split(" ").length < 40)
      return alert("Description must be 40+ words");

    if (!category) return alert("Select category");
    if (selectedSkills.length < 3)
      return alert("At least 3 skills required");
    if (selectedTools.length < 3)
      return alert("At least 3 tools required");
    if (!startDate || !startTime)
      return alert("Select date and time");
    if (!budget.trim()) return alert("Budget required");

    setSaving(true);

    try {
      const [h, m] = startTime.split(":");
      const finalDate = new Date(startDate);
      finalDate.setHours(h);
      finalDate.setMinutes(m);

      const payload = {
        userId: user.uid,
        title: title.trim(),
        description: desc.trim(),
        category: category.value,
        skills: selectedSkills.map((s) => s.value),
        tools: selectedTools.map((t) => t.value),
        budget: budget.trim(),
        notes: notes.trim(),
        startDateTime: Timestamp.fromDate(finalDate),
      };

      if (jobId) {
        await updateDoc(doc(db, "jobs_24h", jobId), payload);
        alert("24H job updated!");
        navigate(-1);
      } else {
        await addDoc(collection(db, "jobs_24h"), {
          ...payload,
          created_at: Timestamp.now(),
          views: 0,
        });
        alert("24H job added!");
        navigate(-1);
      }
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }

    setSaving(false);
  }

  // =========================================================
  // RETURN UI
  // =========================================================
  return (
    <div className="a24-root">
      {/* ================= HEADER ================ */}
      <div className="a24-header">
        <h2>Job Section</h2>
      </div>

      {/* ================ TABS ================= */}
      <div className="a24-tabs">
        <div
          className={`a24-tab ${selectedTab === "24 Hours" ? "active" : ""}`}
          onClick={() => setSelectedTab("24 Hours")}
        >
          24 Hours
        </div>
      </div>
      <hr className="a24-divider" />

      {/* ================= FORM CARD ================= */}
      <div className="a24-card">
        {/* TITLE */}
        <label className="a24-label">Service Title</label>
        <input
          className="a24-input"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* DESCRIPTION */}
        <label className="a24-label">Description</label>
        <textarea
          className="a24-textarea"
          placeholder="Describe your project goals..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        {/* CATEGORY */}
        <label className="a24-label">Category</label>
        <Select
          options={categoryOptions}
          value={category}
          onChange={setCategory}
          placeholder="Select Category"
        />

        {/* SKILLS */}
        <div className="a24-row">
          <label className="a24-label">Skills</label>
          <span className="a24-count">{selectedSkills.length}/3</span>
        </div>

        <div className="a24-chip-container">
          {selectedSkills.map((item, idx) => (
            <div className="a24-chip" key={idx}>
              {item.label}
              <span
                className="a24-chip-remove"
                onClick={() =>
                  setSelectedSkills(selectedSkills.filter((x) => x !== item))
                }
              >
                ✕
              </span>
            </div>
          ))}
        </div>

        <Select
          options={skillOptions}
          placeholder="Select skill"
          onChange={(item) => {
            if (
              item &&
              selectedSkills.length < 3 &&
              !selectedSkills.find((s) => s.value === item.value)
            ) {
              setSelectedSkills([...selectedSkills, item]);
            }
          }}
        />

        {/* TOOLS */}
        <div className="a24-row">
          <label className="a24-label">Tools</label>
          <span className="a24-count">{selectedTools.length}/5</span>
        </div>

        <div className="a24-chip-container">
          {selectedTools.map((item, idx) => (
            <div className="a24-chip" key={idx}>
              {item.label}
              <span
                className="a24-chip-remove"
                onClick={() =>
                  setSelectedTools(selectedTools.filter((x) => x !== item))
                }
              >
                ✕
              </span>
            </div>
          ))}
        </div>

        <Select
          options={toolOptions}
          placeholder="Select Tool"
          onChange={(item) => {
            if (
              item &&
              selectedTools.length < 5 &&
              !selectedTools.find((s) => s.value === item.value)
            ) {
              setSelectedTools([...selectedTools, item]);
            }
          }}
        />

        {/* DATE + TIME */}
        <div className="a24-date-row">
          <div>
            <label className="a24-label">Start Date</label>
            <input
              type="date"
              className="a24-input"
              value={startDate || ""}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="a24-label">Start Time</label>
            <input
              type="time"
              className="a24-input"
              value={startTime || ""}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
        </div>

        {/* BUDGET */}
        <label className="a24-label">Budget</label>
        <input
          className="a24-input"
          placeholder="₹ Range"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        {/* NOTES */}
        <label className="a24-label">Additional Notes (optional)</label>
        <textarea
          className="a24-textarea"
          placeholder="Write extra details..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* BUTTONS */}
        <div className="a24-btn-row">
          <button className="a24-btn-cancel" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button className="a24-btn-save" onClick={saveJob} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}