// AddServiceForm.jsx
// NOTE: Firebase config should be in a separate file like src/firebase.js
// Example:
//   import { db, auth } from "../firebase";
// Here we just import db & auth and use them.

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firbase/Firebase"; // 👉 adjust path to your firebase file

export default function AddServiceForm({ jobData = null, jobId = null }) {
  const navigate = useNavigate();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  // -------------------- BASIC STATE -------------------- //
  const [selectedTab, setSelectedTab] = useState("Work"); // "Work" | "24 hours"
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [budgetFrom, setBudgetFrom] = useState("");
  const [budgetTo, setBudgetTo] = useState("");
  const [sampleUrl, setSampleUrl] = useState("");
  const [clientReq, setClientReq] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");

  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedTool, setSelectedTool] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Search text for dropdown filter
  const [skillSearch, setSkillSearch] = useState("");
  const [toolSearch, setToolSearch] = useState("");

  // -------------------- CONSTANTS -------------------- //

  const deliveryOptions = [
    "1-7 days",
    "7-15 days",
    "15-30 days",
    "1-2 months",
    "2-3 months",
    "3-6 months",
    "6+ months",
  ];

  const expertiseOptions = [
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
  ];

  // BIG SKILL LIST (sample – you can add all remaining items same as Flutter list)
  const skillOptions = [
    // Graphics & Design
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

    // Programming & Tech
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

    // Digital Marketing
    "Social Media Marketing",
    "SEO",
    "Content Marketing",
    "Video Marketing",
    "Email Marketing",
    "SEM (Search Engine Marketing)",
    "Influencer Marketing",
    "Local SEO",
    "Affiliate Marketing",
    "Mobile Marketing & Advertising",
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

    // Writing & Translation
    "Articles & Blog Posts",
    "Proofreading & Editing",
    "Translation",
    "Website Content",
    "Technical Writing",
    "Copywriting",
    "Brand Voice & Tone",
    "Resume Writing",
    "Cover Letters",
    "LinkedIn Profiles",
    "Press Releases",
    "Product Descriptions",
    "Case Studies",
    "White Papers",
    "Scriptwriting",
    "Speechwriting",
    "Creative Writing",
    "Book Editing",
    "Beta Reading",
    "Grant Writing",
    "UX Writing",
    "Email Copy",
    "Business Names & Slogans",
    "Transcription",
    "Legal Writing",

    // Video & Animation
    "Whiteboard & Animated Explainers",
    "Video Editing",
    "Short Video Ads",
    "Logo Animation",
    "Character Animation",
    "2D/3D Animation",
    "Intros & Outros",
    "Lyric & Music Videos",
    "Visual Effects",
    "Spokesperson Videos",
    "App & Website Previews",
    "Product Photography & Demos",
    "Subtitles & Captions",
    "Live Action Explainers",
    "Unboxing Videos",
    "Slideshow Videos",
    "Animation for Kids",
    "Trailers & Teasers",

    // Music & Audio
    "Voice Over",
    "Mixing & Mastering",
    "Producers & Composers",
    "Singers & Vocalists",
    "Session Musicians",
    "Songwriters",
    "Audiobook Production",
    "Sound Design",
    "Audio Editing",
    "Jingles & Intros",
    "Podcast Editing",
    "Music Transcription",
    "Dialogue Editing",
    "DJ Drops & Tags",

    // AI Services (sample)
    "AI Artists",
    "AI Applications",
    "AI Video Generators",
    "AI Music Generation",
    "AI Chatbot Development",
    "AI Website Builders",
    "Custom GPT & LLMs",
    "AI Training Data Preparation",
    "Text-to-Speech / Voice Cloning",
    "Prompt Engineering",

    // Data (sample)
    "Data Entry",
    "Data Mining & Scraping",
    "Database Design",
    "Data Visualization",
    "Dashboards",
    "Excel / Google Sheets",
    "Statistical Analysis",
    "Data Engineering",
    "Data Cleaning",

    // Business / Finance / Consulting / Lifestyle (sample)
    "Business Plans",
    "Market Research",
    "Branding Services",
    "Financial Consulting",
    "Career Counseling",
    "Project Management",
    "Supply Chain Management",
    "HR Consulting",
    "E-Commerce Management",
    "Business Consulting",
    "Presentations",
    "Virtual Assistant",
    "Accounting & Bookkeeping",
    "Financial Forecasting",
    "Financial Modeling",
    "Tax Consulting",
    "Crypto & NFT Consulting",
    "Business Valuation",
    "Pitch Decks",
    "Product Photography",
    "Real Estate Photography",
    "Portraits",
    "Image Retouching",
    "Food Photography",
    "Drone Photography",
    "Lifestyle Photography",
    "AI Image Enhancement",
    "Gaming",
    "Astrology & Psychics",
    "Online Tutoring",
    "Arts & Crafts",
    "Fitness Lessons",
    "Nutrition",
    "Relationship Advice",
    "Personal Styling",
    "Cooking Lessons",
    "Life Coaching",
    "Travel Advice",
    "Wellness & Meditation",
    "Language Lessons",
    "Management Consulting",
    "Business Strategy",
    "HR & Leadership",
    "Financial Advisory",
    "Technology Consulting",
    "Cybersecurity Consulting",
    "Productivity Coaching",
    "Study Skills",
    "Language Learning",
    "Public Speaking",
    "Career Mentoring",
    "Mindfulness & Meditation",
    "Confidence Coaching",
    // 👉 You can continue to add the rest of the Flutter list here...
  ];

  const toolOptions = [
    // Design tools
    "Adobe Illustrator",
    "CorelDRAW",
    "Affinity Designer",
    "Canva",
    "Figma",
    "Gravit Designer",
    "Inkscape",
    "Adobe InDesign",
    "Notion",
    "Milanote",
    "Frontify",
    "VistaCreate",
    "Procreate",
    "Clip Studio Paint",
    "Corel Painter",
    "Krita",
    "Repper",
    "Patterninja",
    "Adobe XD",
    "Sketch",
    "Webflow",
    "Framer",
    "InVision Studio",
    "ProtoPie",
    "Marvel",
    "Miro",
    "Balsamiq",
    "Axure RP",
    "Lucidchart",
    "Adobe Photoshop",
    "Blender",
    "ZBrush",
    "Substance Painter",
    "Unity",
    "Unreal Engine",
    "NFT Art Generator",
    "SolidWorks",
    "Autodesk Fusion 360",
    "Rhino 3D",
    "KeyShot",
    "AutoCAD",
    "SketchUp",
    "Revit",
    "Lumion",
    "3ds Max",
    "CLO 3D",
    "Marvelous Designer",
    "TUKAcad",
    "RhinoGold",
    "MatrixGold",
    "PowerPoint",
    "Google Slides",
    "Prezi",
    "Keynote",
    "Piktochart",
    "Visme",
    "Venngage",
    "Vector Magic",
    "FlexiSIGN",
    "SAi Sign Design Software",
    "Easysign Studio",
    "Adobe Express",
    "Crello",
    "Buffer Pablo",
    "QuarkXPress",

    // Dev tools
    "Visual Studio Code",
    "Sublime Text",
    "Atom",
    "Git",
    "GitHub",
    "GitLab",
    "Node.js",
    "React",
    "Angular",
    "Vue.js",
    "HTML",
    "CSS",
    "JavaScript",
    "Bootstrap",
    "Tailwind CSS",
    "WordPress",
    "Elementor",
    "Divi",
    "Wix",
    "Squarespace",
    "Shopify",
    "Joomla",
    "Drupal",
    "IntelliJ IDEA",
    "PyCharm",
    "PHPStorm",
    "Django",
    "Flask",
    "Laravel",
    "ASP.NET Core",
    "Express.js",
    "WooCommerce",
    "Magento",
    "BigCommerce",
    "OpenCart",
    "PrestaShop",
    "Stripe",
    "PayPal",
    "Godot",
    "C#",
    "C++",
    "Android Studio",
    "Xcode",
    "Flutter",
    "React Native",
    "Kotlin",
    "Java",
    "Swift",
    "SwiftUI",
    "Firebase",
    "Expo",
    "Electron.js",
    "PyQt",
    "Tkinter",
    ".NET",
    "WPF",
    "JavaFX",
    "C++ with Qt",

    // Testing / QA
    "Selenium",
    "Postman",
    "JMeter",
    "Cypress",
    "TestRail",
    "Bugzilla",
    "Jira",
    "Appium",
    "Hotjar",
    "Maze",
    "UserTesting.com",
    "Lookback",
    "Zendesk",
    "Freshdesk",
    "Jira Service Management",
    "ServiceNow",
    "TeamViewer",
    "AnyDesk",
    "Microsoft Intune",

    // Data / ML
    "Python",
    "Pandas",
    "NumPy",
    "Matplotlib",
    "R Studio",
    "Power BI",
    "Tableau",
    "Excel",
    "Google Sheets",
    "SQL",
    "Jupyter Notebook",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "SQLite",
    "Firebase Firestore",
    "Redis",
    "Microsoft SQL Server",
    "TensorFlow",
    "PyTorch",
    "OpenAI API",
    "Hugging Face Transformers",
    "LangChain",
    "Google Vertex AI",
    "Azure AI Studio",
    "Scikit-learn",
    "XGBoost",
    "LightGBM",

    // Cloud / DevOps
    "AWS",
    "Microsoft Azure",
    "Google Cloud Platform",
    "DigitalOcean",
    "Heroku",
    "IBM Cloud",
    "Docker",
    "Kubernetes",
    "Jenkins",
    "GitHub Actions",
    "GitLab CI/CD",
    "Terraform",
    "Ansible",
    "Prometheus",
    "Grafana",

    // Automation / Scraping
    "Python Automation Scripts",
    "PowerShell",
    "Bash",
    "AutoHotkey",
    "Puppeteer",
    "Playwright",
    "Zapier",
    "Make",

    // AI / Content / Tools (sample)
    "ChatGPT",
    "Jasper",
    "SurferSEO",
    "Grammarly",
    "Hemingway Editor",
    "ProWritingAid",
    "LanguageTool",
    "QuillBot",
    "DeepL Translator",
    "Vyond",
    "Animaker",
    "Adobe After Effects",
    "Adobe Premiere Pro",
    "Final Cut Pro",
    "DaVinci Resolve",
    "CapCut",
    "Filmora",
    "Vegas Pro",
    "Audacity",
    "Adobe Audition",
    "GarageBand",
    "FL Studio",
    "Ableton Live",
    "Cubase",
    "Studio One",
    "Spotify for Artists",
    "SoundCloud",
    "DALL·E",
    "MidJourney",
    "Stable Diffusion",
    "Adobe Firefly",
    "Leonardo AI",
    "Runway ML",
    "Descript",
    "ElevenLabs",
    "Trello",
    "Asana",
    "ClickUp",
    "Slack",
    "Zoom",
    "Teams",
    "Xero",
    "Tally",
    "Notion",
    // 👉 You can continue to add the remaining tools from your Flutter list...
  ];

  // -------------------- PREFILL (EDIT MODE) -------------------- //
  useEffect(() => {
    if (jobData) {
      setTitle(jobData.title || "");
      setDesc(jobData.description || "");
      setBudgetFrom(
        jobData.budget_from != null ? String(jobData.budget_from) : ""
      );
      setBudgetTo(
        jobData.budget_to != null ? String(jobData.budget_to) : ""
      );
      setSampleUrl(jobData.sampleProjectUrl || "");
      setClientReq(jobData.clientRequirements || "");
      setSelectedCategory(jobData.category || "");
      setSelectedDuration(jobData.deliveryDuration || "");
      setSelectedSkills(Array.isArray(jobData.skills) ? jobData.skills : []);
      setSelectedTools(Array.isArray(jobData.tools) ? jobData.tools : []);
      // Optional: set tab based on is24Hour flag
      if (jobData.is24Hour) {
        setSelectedTab("24 hours");
      }
    }
  }, [jobData]);

  // -------------------- HELPERS -------------------- //

  const addSkill = (skill) => {
    if (!skill) return;
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills((prev) => [...prev, skill]);
    }
    setSelectedSkill("");
    setSkillSearch("");
  };

  const addTool = (tool) => {
    if (!tool) return;
    if (!selectedTools.includes(tool)) {
      setSelectedTools((prev) => [...prev, tool]);
    }
    setSelectedTool("");
    setToolSearch("");
  };

  const removeSkill = (skill) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== skill));
  };

  const removeTool = (tool) => {
    setSelectedTools((prev) => prev.filter((t) => t !== tool));
  };

  const filteredSkills = skillOptions.filter((s) =>
    s.toLowerCase().includes(skillSearch.toLowerCase())
  );

  const filteredTools = toolOptions.filter((t) =>
    t.toLowerCase().includes(toolSearch.toLowerCase())
  );

  // -------------------- VALIDATION + SAVE -------------------- //

  const handleSave = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!title.trim()) {
      setErrorMsg("Please enter a service title");
      return;
    }
    if (!desc.trim()) {
      setErrorMsg("Please enter a description");
      return;
    }
    if (!budgetFrom.trim() || isNaN(Number(budgetFrom))) {
      setErrorMsg("Please enter a valid 'from' price");
      return;
    }
    if (!budgetTo.trim() || isNaN(Number(budgetTo))) {
      setErrorMsg("Please enter a valid 'to' price");
      return;
    }

    if (selectedTab === "Work") {
      if (!selectedCategory) {
        setErrorMsg("Please select a category");
        return;
      }
      if (!selectedDuration) {
        setErrorMsg("Please select delivery duration");
        return;
      }
    }

    if (selectedSkills.length < 3) {
      setErrorMsg("Please select at least 3 skills");
      return;
    }
    if (selectedTools.length < 3) {
      setErrorMsg("Please select at least 3 tools");
      return;
    }

    if (!sampleUrl.trim().startsWith("https://")) {
      setErrorMsg("Please enter a valid https:// project URL");
      return;
    }

    const user = currentUser || auth.currentUser;
    if (!user) {
      setErrorMsg("User not logged in");
      return;
    }

    setSaving(true);
    try {
      const data = {
        title: title.trim(),
        description: desc.trim(),
        budget_from: Number(budgetFrom.trim()),
        budget_to: Number(budgetTo.trim()),
        category: selectedCategory || null,
        skills: selectedSkills,
        tools: selectedTools,
        sampleProjectUrl: sampleUrl.trim(),
        clientRequirements: clientReq.trim(),
        updatedAt: serverTimestamp(),
        userId: user.uid,
      };

      let collectionName = "services";

      if (selectedTab === "24 hours") {
        data.is24Hour = true;
        data.timeline = "24 Hours";
        collectionName = "service_24h";
      } else {
        data.deliveryDuration = selectedDuration || null;
      }

      if (jobId) {
        // EDIT MODE
        const mainRef = doc(collection(db, collectionName), jobId);
        const userRef = doc(
          collection(db, "users", user.uid, collectionName),
          jobId
        );

        await updateDoc(mainRef, data);
        await updateDoc(userRef, data);
        setSuccessMsg("Service updated successfully");
      } else {
        // ADD MODE
        data.createdAt = serverTimestamp();
        const mainRef = doc(collection(db, collectionName));
        await setDoc(mainRef, data);

        const userRef = doc(
          collection(db, "users", user.uid, collectionName),
          mainRef.id
        );
        await setDoc(userRef, data);
        setSuccessMsg("Service added successfully");
      }

      // Small delay + go back
      setTimeout(() => {
        navigate(-1);
      }, 800);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to save service: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // -------------------- RENDER -------------------- //

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-3 border-b border-gray-200">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <span className="material-icons text-xl">arrow_back_ios_new</span>
        </button>

        <h1 className="text-lg sm:text-xl font-semibold text-black">
          Create Service
        </h1>

        {/* spacer to balance back icon */}
        <div className="w-8" />
      </div>

      {/* Tabs */}
      <div className="px-5 pt-3 border-b border-gray-200">
        <div className="flex gap-10">
          <button
            onClick={() => setSelectedTab("Work")}
            className="flex flex-col items-center"
          >
            <span
              className={`text-base sm:text-lg font-medium ${
                selectedTab === "Work" ? "text-black" : "text-gray-500"
              }`}
            >
              Work
            </span>
            <span
              className={`mt-1 h-1 rounded-full ${
                selectedTab === "Work" ? "w-12 bg-black" : "w-12 bg-transparent"
              }`}
            />
          </button>

          <button
            onClick={() => setSelectedTab("24 hours")}
            className="flex flex-col items-center"
          >
            <span
              className={`text-base sm:text-lg font-medium ${
                selectedTab === "24 hours" ? "text-black" : "text-gray-500"
              }`}
            >
              24 hours
            </span>
            <span
              className={`mt-1 h-1 rounded-full ${
                selectedTab === "24 hours"
                  ? "w-16 bg-black"
                  : "w-16 bg-transparent"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Error / Success messages */}
      {(errorMsg || successMsg) && (
        <div className="px-5 pt-3">
          {errorMsg && (
            <div className="mb-2 rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-2 rounded-lg bg-green-50 text-green-700 text-sm px-3 py-2">
              {successMsg}
            </div>
          )}
        </div>
      )}

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto">
          {/* Service Title */}
          <SectionLabel label="Service Title" />
          <YellowBox>
            <input
              type="text"
              className="w-full bg-transparent outline-none text-sm sm:text-base text-black placeholder:text-gray-500"
              placeholder="e.g. Logo Design That Pops and Defines Your Brand"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </YellowBox>

          {/* Description */}
          <SectionLabel label="Description" className="mt-4" />
          <YellowBox>
            <textarea
              className="w-full bg-transparent outline-none text-sm sm:text-base text-black placeholder:text-gray-500 resize-none"
              placeholder="Describe your service and showcase your uniqueness"
              rows={4}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </YellowBox>

          {/* Category */}
          <SectionLabel label="Category" className="mt-4" />
          <YellowBox>
            <select
              className="w-full bg-transparent outline-none text-sm sm:text-base text-black"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {expertiseOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </YellowBox>

          {/* Price Range */}
          <SectionLabel label="Price Range" className="mt-4" />
          <div className="flex items-center gap-2">
            <YellowBox className="flex-1">
              <input
                type="number"
                className="w-full bg-transparent outline-none text-sm sm:text-base text-black"
                value={budgetFrom}
                onChange={(e) => setBudgetFrom(e.target.value)}
              />
            </YellowBox>
            <span className="text-sm sm:text-base font-medium text-black">
              To
            </span>
            <YellowBox className="flex-1">
              <input
                type="number"
                className="w-full bg-transparent outline-none text-sm sm:text-base text-black"
                value={budgetTo}
                onChange={(e) => setBudgetTo(e.target.value)}
              />
            </YellowBox>
          </div>

          {/* Delivery Days (for Work tab only) */}
          {selectedTab === "Work" && (
            <>
              <SectionLabel label="Delivery Days" className="mt-4" />
              <YellowBox>
                <select
                  className="w-full bg-transparent outline-none text-sm sm:text-base text-black"
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                >
                  <option value="">In days</option>
                  {deliveryOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </YellowBox>
            </>
          )}

          {/* Skills */}
          <SectionLabel label="Skills" className="mt-4" />
          <div className="space-y-2">
            <YellowBox>
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <input
                  type="text"
                  className="flex-1 bg-transparent outline-none text-sm sm:text-base text-black placeholder:text-gray-500"
                  placeholder="Search or select a skill"
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                />
                <select
                  className="w-full sm:w-56 bg-white/60 rounded-md border border-gray-300 px-2 py-1 text-sm outline-none"
                  value={selectedSkill}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedSkill(val);
                    if (val) addSkill(val);
                  }}
                >
                  <option value="">Add Skill</option>
                  {filteredSkills.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </YellowBox>
            <p className="text-right text-xs text-gray-600">
              Add at least 3 skills
            </p>
            <ChipWrap
              items={selectedSkills}
              onRemove={removeSkill}
            />
          </div>

          {/* Tools */}
          <SectionLabel label="Tools" className="mt-4" />
          <div className="space-y-2">
            <YellowBox>
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <input
                  type="text"
                  className="flex-1 bg-transparent outline-none text-sm sm:text-base text-black placeholder:text-gray-500"
                  placeholder="Search or select a tool"
                  value={toolSearch}
                  onChange={(e) => setToolSearch(e.target.value)}
                />
                <select
                  className="w-full sm:w-56 bg-white/60 rounded-md border border-gray-300 px-2 py-1 text-sm outline-none"
                  value={selectedTool}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedTool(val);
                    if (val) addTool(val);
                  }}
                >
                  <option value="">Add Tool</option>
                  {filteredTools.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </YellowBox>
            <p className="text-right text-xs text-gray-600">
              Add at least 3 tools
            </p>
            <ChipWrap
              items={selectedTools}
              onRemove={removeTool}
            />
          </div>

          {/* Sample Project */}
          <SectionLabel label="Sample Project" className="mt-4" />
          <YellowBox>
            <input
              type="url"
              className="w-full bg-transparent outline-none text-sm sm:text-base text-black placeholder:text-gray-500"
              placeholder="https://your-project-url.com"
              value={sampleUrl}
              onChange={(e) => setSampleUrl(e.target.value)}
            />
          </YellowBox>

          {/* Client Requirements */}
          <div className="mt-4 flex items-center gap-1">
            <SectionLabel label="Client Requirements" />
            <span className="text-xs text-gray-500">(Optional)</span>
          </div>
          <YellowBox>
            <textarea
              className="w-full bg-transparent outline-none text-sm sm:text-base text-black placeholder:text-gray-500 resize-none"
              placeholder="Describe what you need and specific details"
              rows={4}
              value={clientReq}
              onChange={(e) => setClientReq(e.target.value)}
            />
          </YellowBox>

          {/* Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 border border-gray-300 rounded-full py-2.5 text-sm sm:text-base font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className={`flex-1 rounded-full py-2.5 text-sm sm:text-base font-semibold border border-yellow-200 bg-yellow-100 text-black flex items-center justify-center gap-2 ${
                saving ? "opacity-70 cursor-not-allowed" : "hover:bg-yellow-200"
              } transition`}
            >
              {saving && (
                <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              )}
              <span>{saving ? "Saving..." : "Save"}</span>
            </button>
          </div>

          <div className="h-6" />
        </div>
      </div>
    </div>
  );
}

/* -------------------- SMALL UI SUBCOMPONENTS -------------------- */

function SectionLabel({ label, className = "" }) {
  return (
    <p
      className={`text-sm sm:text-base font-medium text-black ${className}`}
    >
      {label}
    </p>
  );
}

function YellowBox({ children, className = "" }) {
  return (
    <div
      className={`mt-1 rounded-xl bg-[#FFFCCF] px-4 py-2.5 ${className}`}
    >
      {children}
    </div>
  );
}

function ChipWrap({ items, onRemove }) {
  if (!items?.length) return null;
  return (
    <div className="mt-1 flex flex-wrap gap-2">
      {items.map((item) => (
        <div
          key={item}
          className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-300 px-3 py-1 text-xs sm:text-sm"
        >
          <span>{item}</span>
          <button
            type="button"
            onClick={() => onRemove(item)}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}