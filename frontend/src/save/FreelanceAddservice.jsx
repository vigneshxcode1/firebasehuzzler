// AddServiceForm.jsx
// NOTE: Firebase config and initializeApp separate file la irukkanum.
// Example: src/firebase.js la app initialize panni db export pannu.
// Ithu la config paste pannadha.

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

// 🔹 IMPORT YOUR FIREBASE INSTANCE HERE (update path according to your project)
import { db } from "../firbase/Firebase"; // <-- unga project path ku match pannunga

// -------------------- CONSTANT DATA (same as Flutter) -------------------- //

const deliveryOptions = [
  "1-7 days",
  "7-15 days",
  "15-30 days",
  "1-2 months",
  "2-3 months",
  "3-6 months",
  "6+ months",
];

const expertiseOptions = {
  "Graphics & Design": [],
  "Programming & Tech": [],
  "Digital Marketing": [],
  "Writing & Translation": [],
  "Video & Animation": [],
  "Music & Audio": [],
  "AI Services": [],
  Data: [],
  Business: [],
  Finance: [],
  Photography: [],
  Lifestyle: [],
  Consulting: [],
  "Personal Growth & Hobbies": [],
};

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
  "Data Entry",
  "Data Mining & Scraping",
  "Database Design",
  "Data Visualization",
  "Dashboards",
  "Excel / Google Sheets",
  "Statistical Analysis",
  "Data Engineering",
  "Data Cleaning",
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
];

const toolOptions = [
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
  "Dialogflow",
  "Microsoft Bot Framework",
  "Rasa",
  "IBM Watson Assistant",
  "Botpress",
  "ChatGPT API",
  "ManyChat",
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
  "Pandoc",
  "FFmpeg",
  "ImageMagick",
  "CloudConvert",
  "Adobe Acrobat",
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "SQLite",
  "Firebase Firestore",
  "Redis",
  "Microsoft SQL Server",
  "phpMyAdmin",
  "Wireshark",
  "Metasploit",
  "Burp Suite",
  "Nessus",
  "Kali Linux",
  "OWASP ZAP",
  "Nmap",
  "Bitdefender",
  "Kaspersky",
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
  "Solidity",
  "Remix IDE",
  "Hardhat",
  "Truffle",
  "Web3.js",
  "Ethers.js",
  "Metamask",
  "Alchemy",
  "Python Automation Scripts",
  "PowerShell",
  "Bash",
  "AutoHotkey",
  "Puppeteer",
  "Playwright",
  "Zapier",
  "Make",
  "Visual Studio",
  "Eclipse",
  "API Integration Tools",
  "Low-code platforms",
  "Electron.js",
  "MadCap Flare",
  "Adobe FrameMaker",
  "Typora",
  "Obsidian",
  "DITA XML tools",
  "Confluence",
  "GitBook",
  "Frase.io",
  "Wordtune",
  "Headlime",
  "Novorésumé",
  "Resume.io",
  "Zety",
  "Enhancv",
  "ChatGPT",
  "Jasper",
  "SurferSEO",
  "NeuronWriter",
  "Grammarly",
  "Hemingway Editor",
  "ProWritingAid",
  "Ginger Software",
  "LanguageTool",
  "QuillBot",
  "DeepL Translator",
  "Microsoft Translator",
  "Smartcat",
  "memoQ",
  "SDL Trados Studio",
  "Crowdin",
  "Vyond",
  "Animaker",
  "Doodly",
  "VideoScribe",
  "Renderforest",
  "Powtoon",
  "Adobe After Effects",
  "Adobe Premiere Pro",
  "Final Cut Pro",
  "DaVinci Resolve",
  "CapCut",
  "Filmora",
  "Vegas Pro",
  "Shotcut",
  "OpenShot",
  "InVideo",
  "Adobe Premiere Rush",
  "VN Video Editor",
  "Blender",
  "Cinema 4D",
  "Panzoid",
  "Adobe Character Animator",
  "Toon Boom Harmony",
  "Moho",
  "Reallusion iClone",
  "CrazyTalk Animator",
  "Synfig Studio",
  "OpenToonz",
  "Autodesk Maya",
  "ScreenFlow",
  "Loom",
  "Adobe Lightroom",
  "VEED.io",
  "Kapwing",
  "Rev.com",
  "Subtitle Edit",
  "Camtasia",
  "Synthesia",
  "Pictory.ai",
  "Lumen5",
  "OBS Studio",
  "Alitu",
  "Hindenburg Journalist",
  "Animoto",
  "FlexClip",
  "Audacity",
  "Adobe Audition",
  "GarageBand",
  "Logic Pro X",
  "Pro Tools",
  "Reaper",
  "iZotope RX",
  "FL Studio",
  "Ableton Live",
  "Cubase",
  "Studio One",
  "iZotope Ozone",
  "Waves Plugins",
  "Reason Studios",
  "Bitwig Studio",
  "Native Instruments Komplete",
  "Melodyne",
  "Antares Auto-Tune",
  "Soundtrap",
  "MasterWriter",
  "Hookpad",
  "Sibelius",
  "Finale",
  "MuseScore",
  "Noteflight",
  "Dorico",
  "Transcribe!",
  "Spotify for Artists",
  "SoundCloud",
  "DistroKid",
  "TuneCore",
  "ReverbNation",
  "SubmitHub",
  "Linktree",
  "DALL·E",
  "MidJourney",
  "Stable Diffusion",
  "Adobe Firefly",
  "Leonardo AI",
  "Runway ML",
  "Lobe AI",
  "Pictory",
  "Kaiber",
  "DeepBrain AI",
  "Soundraw",
  "AIVA",
  "Amper Music",
  "Jukedeck",
  "Boomy",
  "Endel",
  "Tidio",
  "Wix ADI",
  "Bookmark",
  "Zyro AI",
  "Jimdo Dolphin",
  "Durable",
  "GPT-4",
  "GPT-3",
  "LLaMA",
  "MPT Models",
  "Claude",
  "Labelbox",
  "Supervisely",
  "Scale AI",
  "CVAT",
  "Dataloop",
  "Roboflow",
  "ElevenLabs",
  "Descript Overdub",
  "Murf AI",
  "Resemble AI",
  "Replica Studios",
  "LOVO AI",
  "ChatGPT Playground",
  "FlowGPT",
  "Promptable",
  "SuperPrompt",
  "PromptLayer",
  "Airtable",
  "Zoho Creator",
  "Smartsheet",
  "RoboTask",
  "Octoparse",
  "ParseHub",
  "WebHarvy",
  "Import.io",
  "Apify",
  "Looker",
  "Qlik Sense",
  "D3.js",
  "Klipfolio",
  "Zoho Analytics",
  "Databox",
  "OpenRefine",
  "SPSS",
  "SAS",
  "Stata",
  "Minitab",
  "Apache Spark",
  "Apache Airflow",
  "Talend",
  "Hadoop",
  "dbt",
  "H2O.ai",
  "RapidMiner",
  "Weka",
  "Google Cloud AI Platform",
  "Trifacta",
  "LivePlan",
  "Bizplan",
  "Enloop",
  "StratPad",
  "PlanGuru",
  "Statista",
  "Nielsen",
  "SurveyMonkey",
  "Typeform",
  "Google Trends",
  "SEMrush",
  "Looka",
  "Brandfolder",
  "Clio",
  "MyCase",
  "LegalZoom",
  "Lawcus",
  "Rocket Lawyer",
  "DocuSign",
  "Tally",
  "Xero",
  "Wave Accounting",
  "Microsoft Office",
  "Google Workspace",
  "Slack",
  "Teams",
  "Zoom",
  "Trello",
  "Asana",
  "Monday.com",
  "ClickUp",
  "Wrike",
  "SAP SCM",
  "Oracle SCM Cloud",
  "Odoo",
  "NetSuite",
  "Microsoft Dynamics 365",
  "Fishbowl Inventory",
  "BambooHR",
  "Zoho People",
  "Workday",
  "Gusto",
  "SAP SuccessFactors",
  "ADP Workforce Now",
  "Coursera",
  "Udemy",
  "Indeed Career Guides",
  "Glassdoor",
  "Mettl Assessments",
  "Skillshare",
  "MyFitnessPal",
  "Nike Training Club",
  "Fitbod",
  "Peloton App",
  "Cronometer",
  "Yazio",
  "Eat This Much",
  "Lifesum",
  "BetterHelp",
  "Talkspace",
  "ReGain",
  "Couple Counseling Apps",
  "Lasting",
  "Polyvore",
  "Pinterest",
  "Tasty App",
  "MasterClass",
  "Mindvalley App",
  "CoachAccountable",
  "TripAdvisor",
  "Google Maps",
  "Lonely Planet Guides",
  "Airbnb",
  "Booking.com",
  "Rome2Rio",
  "Headspace",
  "Calm",
  "Insight Timer",
  "Waking Up App",
  "Aura",
  "Duolingo",
  "Babbel",
  "Rosetta Stone",
  "LingQ",
  "iTalki",
  "Toastmasters Resources",
  "TED Talks",
];

// -------------------- Styles -------------------- //

const styles = {
  page: {
    backgroundColor: "#FFFFFF",
    minHeight: "100vh",
    fontFamily:
      "'Rubik', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  scroll: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "0 16px 32px",
  },
  headerContainer: {
    height: 140,
    position: "relative",
    marginBottom: 16,
  },
  headerBackground: {
    width: "100%",
    height: 130,
    backgroundColor: "#FDFD96",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: "24px 16px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 500,
  },
  headerIconButton: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: 4,
  },
  headerIconPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FDFD96",
  },
  backIcon: {
    fontSize: 20,
  },
  tabsRow: {
    display: "flex",
    alignItems: "flex-end",
    paddingLeft: 16,
    marginBottom: 4,
    gap: 30,
  },
  tabLabel: (active) => ({
    fontSize: 16,
    fontWeight: "bold",
    color: active ? "#000000" : "#9E9E9E",
  }),
  tabUnderline: (active) => ({
    height: 2,
    width: 40,
    backgroundColor: active ? "#FBC02D" : "transparent",
  }),
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    margin: "5px 16px 16px",
  },
  card: {
    borderRadius: 20,
    border: "1px solid #BDBDBD",
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  label: {
    fontSize: 16,
    color: "#000000",
    marginBottom: 6,
  },
  textFieldContainer: {
    border: "1px solid #E0E0E0",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    padding: "0 14px",
  },
  textField: {
    width: "100%",
    border: "none",
    outline: "none",
    fontSize: 14,
    padding: "10px 0",
    resize: "vertical",
    fontFamily: "inherit",
  },
  row: {
    display: "flex",
    gap: 12,
  },
  flex1: { flex: 1 },
  helperText: {
    fontSize: 14,
    color: "#5D5454",
  },
  chipsWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 20,
    padding: "6px 12px",
    border: "1px solid #BDBDBD",
    fontSize: 14,
    backgroundColor: "#FFFFFF",
  },
  chipText: {
    marginRight: 6,
  },
  chipClose: {
    cursor: "pointer",
    fontSize: 14,
  },
  dropdownWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  dropdownDisplay: {
    borderRadius: 10,
    border: "1px solid #D0D0D0",
    padding: "10px 12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    backgroundColor: "#FFFFFF",
    fontSize: 14,
  },
  dropdownPlaceholder: {
    color: "#9E9E9E",
  },
  dropdownList: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    zIndex: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
    maxHeight: 260,
    overflow: "hidden",
    marginTop: 4,
  },
  dropdownSearch: {
    padding: 8,
    borderBottom: "1px solid #EEEEEE",
  },
  dropdownSearchInput: {
    width: "100%",
    borderRadius: 10,
    border: "1px solid #E0E0E0",
    padding: "6px 10px",
    outline: "none",
    fontSize: 14,
  },
  dropdownOptions: {
    maxHeight: 220,
    overflowY: "auto",
  },
  dropdownOption: {
    padding: "8px 12px",
    fontSize: 14,
    cursor: "pointer",
  },
  dropdownOptionHover: {
    backgroundColor: "#F5F5F5",
  },
  sectionTitleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  smallCounterText: {
    fontSize: 14,
    color: "#757575",
  },
  buttonsRow: {
    display: "flex",
    gap: 16,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    padding: "14px 0",
    borderRadius: 30,
    border: "1px solid #BDBDBD",
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    cursor: "pointer",
  },
  saveBtn: {
    flex: 1,
    padding: "14px 0",
    borderRadius: 30,
    backgroundColor: "#FFF59D",
    border: "none",
    fontSize: 16,
    cursor: "pointer",
  },
  disabledBtn: {
    opacity: 0.6,
    cursor: "default",
  },
};

// -------------------- Helper: word count -------------------- //

const countWords = (text) =>
  text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

// -------------------- Dropdown Component -------------------- //

function SearchableDropdown({
  hint,
  value,
  options,
  onChange,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelect = (val) => {
    onChange(val);
    setOpen(false);
    setSearchValue("");
  };

  return (
    <div style={styles.dropdownWrapper}>
      <div
        style={{
          ...styles.dropdownDisplay,
          ...(disabled ? { opacity: 0.5, cursor: "default" } : {}),
        }}
        onClick={() => {
          if (!disabled) setOpen((prev) => !prev);
        }}
      >
        <span
          style={!value ? styles.dropdownPlaceholder : undefined}
        >
          {value || hint}
        </span>
        <span>▾</span>
      </div>
      {open && !disabled && (
        <div style={styles.dropdownList}>
          <div style={styles.dropdownSearch}>
            <input
              style={styles.dropdownSearchInput}
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <div style={styles.dropdownOptions}>
            {filtered.length === 0 && (
              <div style={styles.dropdownOption}>No results</div>
            )}
            {filtered.map((opt) => (
              <div
                key={opt}
                style={styles.dropdownOption}
                onClick={() => handleSelect(opt)}
              >
                {opt}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------- Chip Box -------------------- //

function ChipBox({ items, type, onRemove }) {
  return (
    <div style={styles.chipsWrap}>
      {items.map((text) => (
        <div key={text} style={styles.chip}>
          <span style={styles.chipText}>{text}</span>
          <span
            style={styles.chipClose}
            onClick={() => onRemove(text, type)}
          >
            ✕
          </span>
        </div>
      ))}
    </div>
  );
}

// -------------------- Main Component -------------------- //

export default function AddServiceForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();

  // jobData & jobId from route (ServiceScreenOne la navigate panniruppom)
  const fromState = location.state || {};
  const initialJobData = fromState.jobData || null;
  const initialJobId = fromState.jobId || null;

  const [selectedTab, setSelectedTab] = useState("Works");

  // form states
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [sampleUrl, setSampleUrl] = useState("");
  const [clientReq, setClientReq] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedTool, setSelectedTool] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);

  const [saving, setSaving] = useState(false);

  const jobId = initialJobId;

  // -------------------- Prefill for edit -------------------- //

  useEffect(() => {
    if (!initialJobData) return;
    const data = initialJobData;

    setTitle(data.title || "");
    setDesc(data.description || "");
    setPrice(
      data.price !== undefined && data.price !== null
        ? String(data.price)
        : ""
    );
    setSampleUrl(data.sampleProjectUrl || "");
    setClientReq(data.clientRequirements || "");
    setSelectedCategory(data.category || "");
    setSelectedDuration(data.deliveryDuration || "");
    setSelectedSkills(Array.isArray(data.skills) ? data.skills : []);
    setSelectedTools(Array.isArray(data.tools) ? data.tools : []);
  }, [initialJobData]);

  // -------------------- Validation & Save -------------------- //

  const validateForm = () => {
    // title, desc, price, sampleUrl required
    if (!title.trim()) {
      alert("Service Title is required");
      return false;
    }
    if (countWords(title) < 2) {
      alert("Title must be at least 2 words");
      return false;
    }

    if (!desc.trim()) {
      alert("Description is required");
      return false;
    }
    if (countWords(desc) < 40) {
      alert("Description must be at least 40 words");
      return false;
    }

    if (!selectedCategory) {
      alert("Please select a category");
      return false;
    }

    if (!price.trim()) {
      alert("Price is required");
      return false;
    }
    if (isNaN(Number(price.trim()))) {
      alert("Enter a valid price");
      return false;
    }

    if (!selectedDuration) {
      alert("Please select delivery duration");
      return false;
    }

    if (selectedSkills.length < 3) {
      alert("Please select at least 3 skills");
      return false;
    }

    if (selectedTools.length < 3) {
      alert("Please select at least 3 tools");
      return false;
    }

    if (!sampleUrl.trim()) {
      alert("Enter project URL");
      return false;
    }
    if (!sampleUrl.trim().startsWith("https://")) {
      alert("Please enter a valid https:// project URL");
      return false;
    }

    return true;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in");

      const serviceData = {
        title: title.trim(),
        description: desc.trim(),
        price: Number(price.trim()) || 0,
        deliveryDuration: selectedDuration,
        category: selectedCategory,
        skills: selectedSkills,
        tools: selectedTools,
        sampleProjectUrl: sampleUrl.trim(),
        clientRequirements: clientReq.trim(),
        updatedAt: serverTimestamp(),
        userId: user.uid,
      };

      if (jobId) {
        // UPDATE existing
        const mainDocRef = doc(db, "services", jobId);
        const userDocRef = doc(db, "users", user.uid, "services", jobId);

        await Promise.all([
          updateDoc(mainDocRef, serviceData),
          updateDoc(userDocRef, serviceData),
        ]);

        alert("Service updated successfully");
      } else {
        // ADD new
        const mainDocRef = doc(collection(db, "services"));
        const id = mainDocRef.id;
        const dataWithCreated = {
          ...serviceData,
          createdAt: serverTimestamp(),
        };

        await setDoc(mainDocRef, dataWithCreated);
        const userDocRef = doc(db, "users", user.uid, "services", id);
        await setDoc(userDocRef, dataWithCreated);

        alert("Service added successfully");
      }

      setTimeout(() => {
        navigate(-1);
      }, 500);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed: " + (err.message || String(err)));
    } finally {
      setSaving(false);
    }
  };

  // -------------------- Chip callbacks -------------------- //

  const handleRemoveChip = (value, type) => {
    if (type === "skills") {
      setSelectedSkills((prev) => prev.filter((x) => x !== value));
    } else {
      setSelectedTools((prev) => prev.filter((x) => x !== value));
    }
  };

  const handleAddSkill = (value) => {
    if (
      value &&
      !selectedSkills.includes(value) &&
      selectedSkills.length < 3
    ) {
      setSelectedSkill(value);
      setSelectedSkills((prev) => [...prev, value]);
    }
  };

  const handleAddTool = (value) => {
    if (
      value &&
      !selectedTools.includes(value) &&
      selectedTools.length < 5
    ) {
      setSelectedTool(value);
      setSelectedTools((prev) => [...prev, value]);
    }
  };

  // -------------------- Render -------------------- //

  return (
    <div style={styles.page}>
      <div style={styles.scroll}>
        {/* HEADER */}
        <div style={styles.headerContainer}>
          <div style={styles.headerBackground}>
            <button
              type="button"
              style={styles.headerIconButton}
              onClick={() => navigate(-1)}
            >
              <span style={styles.backIcon}>‹</span>
            </button>

            <div style={styles.headerTitle}>Your Service</div>

            {/* Placeholder notification icon */}
            <div style={styles.headerIconPlaceholder} />
          </div>
        </div>

        {/* TABS (Works + 24 Hours) – same look, but only Works active in this form */}
        <div style={styles.tabsRow}>
          <div
            onClick={() => setSelectedTab("Works")}
            style={{ cursor: "pointer" }}
          >
            <div style={styles.tabLabel(selectedTab === "Works")}>
              Works
            </div>
            <div style={styles.tabUnderline(selectedTab === "Works")} />
          </div>

          <div
            onClick={() => setSelectedTab("24h")}
            style={{ cursor: "pointer" }}
          >
            <div style={styles.tabLabel(selectedTab === "24h")}>
              24 Hours
            </div>
            <div style={styles.tabUnderline(selectedTab === "24h")} />
          </div>
        </div>

        <div style={styles.divider} />

        {/* FORM CARD */}
        <form onSubmit={handleSave}>
          <div style={styles.card}>
            {/* Title */}
            <div style={{ marginBottom: 20 }}>
              <div style={styles.label}>Service Title</div>
              <div style={styles.textFieldContainer}>
                <textarea
                  style={styles.textField}
                  rows={1}
                  placeholder="e.g. Logo Design That Pops and Defines Your Brand"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 20 }}>
              <div style={styles.label}>Description</div>
              <div style={styles.textFieldContainer}>
                <textarea
                  style={styles.textField}
                  rows={4}
                  placeholder="Describe your service..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>
            </div>

            {/* Category */}
            <div style={{ marginBottom: 24 }}>
              <div style={styles.label}>Category</div>
              <SearchableDropdown
                hint="Select a Category"
                value={selectedCategory}
                options={Object.keys(expertiseOptions)}
                onChange={(val) => setSelectedCategory(val)}
              />
            </div>

            {/* Price + Delivery Duration */}
            <div style={{ ...styles.row, marginBottom: 20 }}>
              <div style={styles.flex1}>
                <div style={styles.label}>Price</div>
                <div style={styles.textFieldContainer}>
                  <textarea
                    style={styles.textField}
                    rows={1}
                    placeholder="₹"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              <div style={styles.flex1}>
                <div style={styles.label}>Delivery Duration</div>
                <SearchableDropdown
                  hint="Select Duration"
                  value={selectedDuration}
                  options={deliveryOptions}
                  onChange={(val) => setSelectedDuration(val)}
                />
              </div>
            </div>

            {/* Skills */}
            <div style={{ marginBottom: 20 }}>
              <div style={styles.sectionTitleRow}>
                <div style={styles.label}>Skills</div>
                <div style={styles.smallCounterText}>
                  {selectedSkills.length}/3
                </div>
              </div>
              <ChipBox
                items={selectedSkills}
                type="skills"
                onRemove={handleRemoveChip}
              />
              <div style={{ height: 12 }} />
              <SearchableDropdown
                hint="Select skill"
                value={selectedSkill}
                options={skillOptions}
                onChange={handleAddSkill}
              />
            </div>

            {/* Tools */}
            <div style={{ marginBottom: 20 }}>
              <div style={styles.sectionTitleRow}>
                <div style={styles.label}>Tools</div>
                <div style={styles.smallCounterText}>
                  {selectedTools.length}/5
                </div>
              </div>
              <ChipBox
                items={selectedTools}
                type="tools"
                onRemove={handleRemoveChip}
              />
              <div style={{ height: 12 }} />
              <SearchableDropdown
                hint="Select tool"
                value={selectedTool}
                options={toolOptions}
                onChange={handleAddTool}
              />
            </div>

            {/* Sample Project URL */}
            <div style={{ marginBottom: 20 }}>
              <div style={styles.label}>Sample Project</div>
              <div style={styles.textFieldContainer}>
                <textarea
                  style={styles.textField}
                  rows={1}
                  placeholder="Project URL"
                  value={sampleUrl}
                  onChange={(e) => setSampleUrl(e.target.value)}
                />
              </div>
            </div>

            {/* Client Requirements */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={styles.label}>Client Requirements</span>
                <span style={styles.helperText}>(Optional)</span>
              </div>
              <div style={styles.textFieldContainer}>
                <textarea
                  style={styles.textField}
                  rows={4}
                  placeholder="Describe what you need and specific details"
                  value={clientReq}
                  onChange={(e) => setClientReq(e.target.value)}
                />
              </div>
            </div>

            {/* Buttons */}
            <div style={styles.buttonsRow}>
              <button
                type="button"
                style={styles.cancelBtn}
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  ...styles.saveBtn,
                  ...(saving ? styles.disabledBtn : {}),
                }}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}