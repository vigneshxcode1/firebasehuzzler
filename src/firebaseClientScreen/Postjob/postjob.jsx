
// // frontend/src/firebaseClientScreen/Postjob/PostJobScreen.jsx
// // ❤️ UI upgraded — Backend untouched

// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { getAuth } from "firebase/auth";
// import {
//   collection,
//   doc,
//   addDoc,
//   updateDoc,
//   serverTimestamp,
//   Timestamp,
// } from "firebase/firestore";
// import backarrow from "../../assets/backarrow.png"
// // 🔹 UPDATE THIS PATH TO MATCH YOUR PROJECT
// import { db } from "../../firbase/Firebase";

// export default function PostJobScreen(props) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const auth = getAuth();
//   const currentUser = auth.currentUser;

//   const routeState = location.state || {};
//   const jobIdProp = props.jobId || routeState.jobId || routeState.job_id || null;
//   const jobDataProp = props.jobData || routeState.jobData || null;

//   // -------------------- STATE -------------------- //
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [budgetFrom, setBudgetFrom] = useState("");
//   const [budgetTo, setBudgetTo] = useState("");
//   const [sampleProjectUrl, setSampleProjectUrl] = useState("");
//   const [freelancerRequirements, setFreelancerRequirements] = useState("");

//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedTimeline, setSelectedTimeline] = useState("");
//   const [selectedTime, setSelectedTime] = useState("");

//   const [selectedTab, setSelectedTab] = useState("Works");

//   const [isSaving, setIsSaving] = useState(false);

//   const [selectedSkill, setSelectedSkill] = useState("");
//   const [selectedTool, setSelectedTool] = useState("");
//   const [selectedSkills, setSelectedSkills] = useState([]);
//   const [selectedTools, setSelectedTools] = useState([]);

//   // -------------------- CONSTANTS (UNMODIFIED) -------------------- //
//   const expertiseOptions = {
//     "Graphics & Design": [],
//     "Programming & Tech": [],
//     "Digital Marketing": [],
//     "Writing & Translation": [],
//     "Video & Animation": [],
//     "Music & Audio": [],
//     "AI Services": [],
//     Data: [],
//     Business: [],
//     Finance: [],
//     Photography: [],
//     Lifestyle: [],
//     Consulting: [],
//     "Personal Growth & Hobbies": [],
//   };

//   const skillOptions = [
//     "Logo Design",
//     "Brand Style Guides",
//     "Business Cards & Stationery",
//     "Illustration",
//     "Pattern Design",
//     "Website Design",
//     "App Design",
//     "UX Design",
//     "Game Art",
//     "NFTs & Collectibles",
//     "Industrial & Product Design",
//     "Architecture & Interior Design",
//     "Landscape Design",
//     "Fashion Design",
//     "Jewelry Design",
//     "Presentation Design",
//     "Infographic Design",
//     "Vector Tracing",
//     "Car Wraps",
//     "Image Editing",
//     "Photoshop Editing",
//     "T-Shirts & Merchandise",
//     "Packaging Design",
//     "Book Design",
//     "Album Cover Design",
//     "Podcast Cover Art",
//     "Menu Design",
//     "Invitation Design",
//     "Brochure Design",
//     "Poster Design",
//     "Signage Design",
//     "Flyer Design",
//     "Social Media Design",
//     "Print Design",
//     "Website Development",
//     "Website Builders & CMS",
//     "Web Programming",
//     "E-Commerce Development",
//     "Game Development",
//     "Mobile Apps (iOS & Android)",
//     "Desktop Applications",
//     "Chatbots",
//     "QA & Review",
//     "User Testing",
//     "Support & IT",
//     "Data Analysis & Reports",
//     "Convert Files",
//     "Databases",
//     "Cybersecurity & Data Protection",
//     "Cloud Computing",
//     "DevOps",
//     "AI Development",
//     "Machine Learning Models",
//     "Blockchain & NFTs",
//     "Scripts & Automation",
//     "Software Customization",
//     "Social Media Marketing",
//     "SEO",
//     "Content Marketing",
//     "Video Marketing",
//     "Email Marketing",
//     "SEM (Search Engine Marketing)",
//     "Influencer Marketing",
//     "Local SEO",
//     "Affiliate Marketing",
//     "Mobile Marketing & Advertising",
//     "Display Advertising",
//     "E-Commerce Marketing",
//     "Text Message Marketing",
//     "Crowdfunding",
//     "Web Analytics",
//     "Domain Research",
//     "Music Promotion",
//     "Book & eBook Marketing",
//     "Podcast Marketing",
//     "Community Management",
//     "Marketing Consulting",
//     "Articles & Blog Posts",
//     "Proofreading & Editing",
//     "Translation",
//     "Website Content",
//     "Technical Writing",
//     "Copywriting",
//     "Brand Voice & Tone",
//     "Resume Writing",
//     "Cover Letters",
//     "LinkedIn Profiles",
//     "Press Releases",
//     "Product Descriptions",
//     "Case Studies",
//     "White Papers",
//     "Scriptwriting",
//     "Speechwriting",
//     "Creative Writing",
//     "Book Editing",
//     "Beta Reading",
//     "Grant Writing",
//     "UX Writing",
//     "Email Copy",
//     "Business Names & Slogans",
//     "Transcription",
//     "Legal Writing",
//     "Whiteboard & Animated Explainers",
//     "Video Editing",
//     "Short Video Ads",
//     "Logo Animation",
//     "Character Animation",
//     "2D/3D Animation",
//     "Intros & Outros",
//     "Lyric & Music Videos",
//     "Visual Effects",
//     "Spokesperson Videos",
//     "App & Website Previews",
//     "Product Photography & Demos",
//     "Subtitles & Captions",
//     "Live Action Explainers",
//     "Unboxing Videos",
//     "Slideshow Videos",
//     "Animation for Kids",
//     "Trailers & Teasers",
//     "Voice Over",
//     "Mixing & Mastering",
//     "Producers & Composers",
//     "Singers & Vocalists",
//     "Session Musicians",
//     "Songwriters",
//     "Audiobook Production",
//     "Sound Design",
//     "Audio Editing",
//     "Jingles & Intros",
//     "Podcast Editing",
//     "Music Transcription",
//     "Dialogue Editing",
//     "DJ Drops & Tags",
//     "AI Artists",
//     "AI Applications",
//     "AI Video Generators",
//     "AI Music Generation",
//     "AI Chatbot Development",
//     "AI Website Builders",
//     "Custom GPT & LLMs",
//     "AI Training Data Preparation",
//     "Text-to-Speech / Voice Cloning",
//     "Prompt Engineering",
//     "Data Entry",
//     "Data Mining & Scraping",
//     "Database Design",
//     "Data Visualization",
//     "Dashboards",
//     "Excel / Google Sheets",
//     "Statistical Analysis",
//     "Data Engineering",
//     "Data Cleaning",
//     "Business Plans",
//     "Market Research",
//     "Branding Services",
//     "Financial Consulting",
//     "Career Counseling",
//     "Project Management",
//     "Supply Chain Management",
//     "HR Consulting",
//     "E-Commerce Management",
//     "Business Consulting",
//     "Presentations",
//     "Virtual Assistant",
//     "Accounting & Bookkeeping",
//     "Financial Forecasting",
//     "Financial Modeling",
//     "Tax Consulting",
//     "Crypto & NFT Consulting",
//     "Business Valuation",
//     "Pitch Decks",
//     "Product Photography",
//     "Real Estate Photography",
//     "Portraits",
//     "Image Retouching",
//     "Food Photography",
//     "Drone Photography",
//     "Lifestyle Photography",
//     "AI Image Enhancement",
//     "Gaming",
//     "Astrology & Psychics",
//     "Online Tutoring",
//     "Arts & Crafts",
//     "Fitness Lessons",
//     "Nutrition",
//     "Relationship Advice",
//     "Personal Styling",
//     "Cooking Lessons",
//     "Life Coaching",
//     "Travel Advice",
//     "Wellness & Meditation",
//     "Language Lessons",
//     "Management Consulting",
//     "Business Strategy",
//     "HR & Leadership",
//     "Financial Advisory",
//     "Technology Consulting",
//     "Cybersecurity Consulting",
//     "Productivity Coaching",
//     "Study Skills",
//     "Language Learning",
//     "Public Speaking",
//     "Career Mentoring",
//     "Mindfulness & Meditation",
//     "Confidence Coaching",
//   ];
//   const toolOptions = [
//     "Adobe Illustrator",
//     "CorelDRAW",
//     "Affinity Designer",
//     "Canva",
//     "Figma",
//     "Gravit Designer",
//     "Inkscape",
//     "Adobe InDesign",
//     "Notion",
//     "Milanote",
//     "Frontify",
//     "VistaCreate",
//     "Procreate",
//     "Clip Studio Paint",
//     "Corel Painter",
//     "Krita",
//     "Repper",
//     "Patterninja",
//     "Adobe XD",
//     "Sketch",
//     "Webflow",
//     "Framer",
//     "InVision Studio",
//     "ProtoPie",
//     "Marvel",
//     "Miro",
//     "Balsamiq",
//     "Axure RP",
//     "Lucidchart",
//     "Adobe Photoshop",
//     "Blender",
//     "ZBrush",
//     "Substance Painter",
//     "Unity",
//     "Unreal Engine",
//     "NFT Art Generator",
//     "SolidWorks",
//     "Autodesk Fusion 360",
//     "Rhino 3D",
//     "KeyShot",
//     "AutoCAD",
//     "SketchUp",
//     "Revit",
//     "Lumion",
//     "3ds Max",
//     "CLO 3D",
//     "Marvelous Designer",
//     "TUKAcad",
//     "RhinoGold",
//     "MatrixGold",
//     "PowerPoint",
//     "Google Slides",
//     "Prezi",
//     "Piktochart",
//     "Visme",
//     "Venngage",
//     "Vector Magic",
//     "FlexiSIGN",
//     "SAi Sign Design Software",
//     "Easysign Studio",
//     "Adobe Express",
//     "Crello",
//     "Buffer Pablo",
//     "QuarkXPress",
//     "Visual Studio Code",
//     "Sublime Text",
//     "Atom",
//     "Git",
//     "GitHub",
//     "GitLab",
//     "Node.js",
//     "React",
//     "Angular",
//     "Vue.js",
//     "HTML",
//     "CSS",
//     "JavaScript",
//     "Bootstrap",
//     "Tailwind CSS",
//     "WordPress",
//     "Elementor",
//     "Divi",
//     "Wix",
//     "Squarespace",
//     "Shopify",
//     "Joomla",
//     "Drupal",
//     "IntelliJ IDEA",
//     "PyCharm",
//     "PHPStorm",
//     "Django",
//     "Flask",
//     "Laravel",
//     "ASP.NET Core",
//     "Express.js",
//     "WooCommerce",
//     "Magento",
//     "BigCommerce",
//     "OpenCart",
//     "PrestaShop",
//     "Stripe",
//     "PayPal",
//     "Godot",
//     "C#",
//     "C++",
//     "Android Studio",
//     "Xcode",
//     "Flutter",
//     "React Native",
//     "Kotlin",
//     "Java",
//     "Swift",
//     "SwiftUI",
//     "Firebase",
//     "Expo",
//     "Electron.js",
//     "PyQt",
//     "Tkinter",
//     ".NET",
//     "WPF",
//     "JavaFX",
//     "C++ with Qt",
//     "Dialogflow",
//     "Microsoft Bot Framework",
//     "Rasa",
//     "IBM Watson Assistant",
//     "Botpress",
//     "ChatGPT API",
//     "ManyChat",
//     "Selenium",
//     "Postman",
//     "JMeter",
//     "Cypress",
//     "TestRail",
//     "Bugzilla",
//     "Jira",
//     "Appium",
//     "Hotjar",
//     "Maze",
//     "UserTesting.com",
//     "Lookback",
//     "Zendesk",
//     "Freshdesk",
//     "Jira Service Management",
//     "ServiceNow",
//     "TeamViewer",
//     "AnyDesk",
//     "Microsoft Intune",
//     "Python",
//     "Pandas",
//     "NumPy",
//     "Matplotlib",
//     "R Studio",
//     "Power BI",
//     "Tableau",
//     "Excel",
//     "Google Sheets",
//     "SQL",
//     "Jupyter Notebook",
//     "Pandoc",
//     "FFmpeg",
//     "ImageMagick",
//     "CloudConvert",
//     "Adobe Acrobat",
//     "MySQL",
//     "PostgreSQL",
//     "MongoDB",
//     "SQLite",
//     "Firebase Firestore",
//     "Redis",
//     "Microsoft SQL Server",
//     "phpMyAdmin",
//     "Wireshark",
//     "Metasploit",
//     "Burp Suite",
//     "Nessus",
//     "Kali Linux",
//     "OWASP ZAP",
//     "Nmap",
//     "Bitdefender",
//     "Kaspersky",
//     "AWS",
//     "Microsoft Azure",
//     "Google Cloud Platform",
//     "DigitalOcean",
//     "Heroku",
//     "IBM Cloud",
//     "Docker",
//     "Kubernetes",
//     "Jenkins",
//     "GitHub Actions",
//     "GitLab CI/CD",
//     "Terraform",
//     "Ansible",
//     "Prometheus",
//     "Grafana",
//     "TensorFlow",
//     "PyTorch",
//     "OpenAI API",
//     "Hugging Face Transformers",
//     "LangChain",
//     "Google Vertex AI",
//     "Azure AI Studio",
//     "Scikit-learn",
//     "XGBoost",
//     "LightGBM",
//     "Solidity",
//     "Remix IDE",
//     "Hardhat",
//     "Truffle",
//     "Web3.js",
//     "Ethers.js",
//     "Metamask",
//     "Alchemy",
//     "Python Automation Scripts",
//     "PowerShell",
//     "Bash",
//     "AutoHotkey",
//     "Puppeteer",
//     "Playwright",
//     "Zapier",
//     "Make",
//     "Visual Studio",
//     "Eclipse",
//     "API Integration Tools",
//     "Low-code platforms",
//     "MadCap Flare",
//     "Adobe FrameMaker",
//     "Typora",
//     "Obsidian",
//     "DITA XML tools",
//     "Confluence",
//     "GitBook",
//     "Frase.io",
//     "Wordtune",
//     "Headlime",
//     "Novorésumé",
//     "Resume.io",
//     "Zety",
//     "Enhancv",
//     "ChatGPT",
//     "Jasper",
//     "SurferSEO",
//     "NeuronWriter",
//     "Grammarly",
//     "Hemingway Editor",
//     "ProWritingAid",
//     "Ginger Software",
//     "LanguageTool",
//     "QuillBot",
//     "DeepL Translator",
//     "Microsoft Translator",
//     "Smartcat",
//     "memoQ",
//     "SDL Trados Studio",
//     "Crowdin",
//     "Vyond",
//     "Animaker",
//     "Doodly",
//     "VideoScribe",
//     "Renderforest",
//     "Powtoon",
//     "Adobe After Effects",
//     "Adobe Premiere Pro",
//     "Final Cut Pro",
//     "DaVinci Resolve",
//     "CapCut",
//     "Filmora",
//     "Vegas Pro",
//     "Shotcut",
//     "OpenShot",
//     "InVideo",
//     "Adobe Premiere Rush",
//     "VN Video Editor",
//     "Blender",
//     "Cinema 4D",
//     "Panzoid",
//     "Adobe Character Animator",
//     "Toon Boom Harmony",
//     "Moho",
//     "Reallusion iClone",
//     "CrazyTalk Animator",
//     "Synfig Studio",
//     "OpenToonz",
//     "Autodesk Maya",
//     "ScreenFlow",
//     "Loom",
//     "Adobe Lightroom",
//     "VEED.io",
//     "Kapwing",
//     "Rev.com",
//     "Subtitle Edit",
//     "Camtasia",
//     "Synthesia",
//     "Pictory.ai",
//     "Lumen5",
//     "OBS Studio",
//     "Alitu",
//     "Hindenburg Journalist",
//     "Animoto",
//     "FlexClip",
//     "Audacity",
//     "Adobe Audition",
//     "GarageBand",
//     "Logic Pro X",
//     "Pro Tools",
//     "Reaper",
//     "iZotope RX",
//     "FL Studio",
//     "Ableton Live",
//     "Cubase",
//     "Studio One",
//     "iZotope Ozone",
//     "Waves Plugins",
//     "Reason Studios",
//     "Bitwig Studio",
//     "Native Instruments Komplete",
//     "Melodyne",
//     "Antares Auto-Tune",
//     "Soundtrap",
//     "MasterWriter",
//     "Hookpad",
//     "Sibelius",
//     "Finale",
//     "MuseScore",
//     "Noteflight",
//     "Dorico",
//     "Transcribe!",
//     "Spotify for Artists",
//     "SoundCloud",
//     "DistroKid",
//     "TuneCore",
//     "ReverbNation",
//     "SubmitHub",
//     "Linktree",
//     "DALL·E",
//     "MidJourney",
//     "Stable Diffusion",
//     "Adobe Firefly",
//     "Leonardo AI",
//     "Runway ML",
//     "Lobe AI",
//     "Pictory",
//     "Kaiber",
//     "DeepBrain AI",
//     "Soundraw",
//     "AIVA",
//     "Amper Music",
//     "Jukedeck",
//     "Boomy",
//     "Endel",
//     "Tidio",
//     "Wix ADI",
//     "Bookmark",
//     "Zyro AI",
//     "Jimdo Dolphin",
//     "Durable",
//     "GPT-4",
//     "GPT-3",
//     "LLaMA",
//     "MPT Models",
//     "Claude",
//     "Labelbox",
//     "Supervisely",
//     "Scale AI",
//     "CVAT",
//     "Dataloop",
//     "Roboflow",
//     "ElevenLabs",
//     "Descript Overdub",
//     "Murf AI",
//     "Resemble AI",
//     "Replica Studios",
//     "LOVO AI",
//     "ChatGPT Playground",
//     "FlowGPT",
//     "Promptable",
//     "SuperPrompt",
//     "PromptLayer",
//     "Airtable",
//     "Zoho Creator",
//     "Smartsheet",
//     "RoboTask",
//     "Octoparse",
//     "ParseHub",
//     "WebHarvy",
//     "Import.io",
//     "Apify",
//     "Looker",
//     "Qlik Sense",
//     "D3.js",
//     "Klipfolio",
//     "Zoho Analytics",
//     "Databox",
//     "OpenRefine",
//     "SPSS",
//     "SAS",
//     "Stata",
//     "Minitab",
//     "Apache Spark",
//     "Apache Airflow",
//     "Talend",
//     "Hadoop",
//     "dbt",
//     "H2O.ai",
//     "RapidMiner",
//     "Weka",
//     "Google Cloud AI Platform",
//     "Trifacta",
//     "LivePlan",
//     "Bizplan",
//     "Enloop",
//     "StratPad",
//     "PlanGuru",
//     "Statista",
//     "Nielsen",
//     "SurveyMonkey",
//     "Typeform",
//     "Google Trends",
//     "SEMrush",
//     "Looka",
//     "Brandfolder",
//     "Clio",
//     "MyCase",
//     "LegalZoom",
//     "Lawcus",
//     "Rocket Lawyer",
//     "DocuSign",
//     "Tally",
//     "Xero",
//     "Wave Accounting",
//     "Microsoft Office",
//     "Google Workspace",
//     "Slack",
//     "Teams",
//     "Zoom",
//     "Trello",
//     "Asana",
//     "Monday.com",
//     "ClickUp",
//     "Wrike",
//     "SAP SCM",
//     "Oracle SCM Cloud",
//     "Odoo",
//     "NetSuite",
//     "Microsoft Dynamics 365",
//     "Fishbowl Inventory",
//     "BambooHR",
//     "Zoho People",
//     "Workday",
//     "Gusto",
//     "SAP SuccessFactors",
//     "ADP Workforce Now",
//     "Coursera",
//     "Udemy",
//     "Indeed Career Guides",
//     "Glassdoor",
//     "Mettl Assessments",
//     "Skillshare",
//     "MyFitnessPal",
//     "Nike Training Club",
//     "Fitbod",
//     "Peloton App",
//     "Cronometer",
//     "Yazio",
//     "Eat This Much",
//     "Lifesum",
//     "BetterHelp",
//     "Talkspace",
//     "ReGain",
//     "Couple Counseling Apps",
//     "Lasting",
//     "Polyvore",
//     "Pinterest",
//     "Tasty App",
//     "MasterClass",
//     "Mindvalley App",
//     "CoachAccountable",
//     "TripAdvisor",
//     "Google Maps",
//     "Lonely Planet Guides",
//     "Airbnb",
//     "Booking.com",
//     "Rome2Rio",
//     "Headspace",
//     "Calm",
//     "Insight Timer",
//     "Waking Up App",
//     "Aura",
//     "Duolingo",
//     "Babbel",
//     "Rosetta Stone",
//     "LingQ",
//     "iTalki",
//     "Toastmasters Resources",
//     "TED Talks",
//   ];
//   const timelines = ["1-30 days", "1-3 months", "3-6 months", "6+ months"];

//   // -------------------- PREFILL WHEN EDITING -------------------- //
//   useEffect(() => {
//     if (!jobDataProp) return;

//     setTitle(jobDataProp.title || "");
//     setDescription(jobDataProp.description || "");
//     setBudgetFrom(jobDataProp.budget_from || "");
//     setBudgetTo(jobDataProp.budget_to || "");
//     setSampleProjectUrl(jobDataProp.sample_project_url || "");
//     setFreelancerRequirements(jobDataProp.freelancer_requirements || "");

//     setSelectedCategory(jobDataProp.category || "");
//     setSelectedTimeline(jobDataProp.timeline || "");

//     setSelectedSkills(Array.isArray(jobDataProp.skills) ? jobDataProp.skills : []);
//     setSelectedTools(Array.isArray(jobDataProp.tools) ? jobDataProp.tools : []);

//     if (jobDataProp.startDateTime && jobDataProp.startDateTime.toDate) {
//       const d = jobDataProp.startDateTime.toDate();
//       const yyyy = d.getFullYear();
//       const mm = String(d.getMonth() + 1).padStart(2, "0");
//       const dd = String(d.getDate()).padStart(2, "0");
//       const hh = String(d.getHours()).padStart(2, "0");
//       const min = String(d.getMinutes()).padStart(2, "0");

//       setSelectedTimeline(`${yyyy}-${mm}-${dd}`);
//       setSelectedTime(`${hh}:${min}`);
//       setSelectedTab("24 hours");
//     }
//   }, [jobDataProp]);

//   // -------------------- HELPERS -------------------- //
//   const showError = (msg) => {
//     setIsSaving(false);
//     alert(msg);
//   };

//   const handleSave = async () => {
//     if (!currentUser) return showError("User not logged in");

//     setIsSaving(true);

//     const trimmedTitle = title.trim();
//     const trimmedDesc = description.trim();

//     if (trimmedTitle.split(" ").length < 2) return showError("Title must have at least 2 words");
//     if (trimmedDesc.split(" ").length < 40) return showError("Description must have at least 40 words");
//     if (!selectedCategory) return showError("Please select a category");
//     if (selectedSkills.length < 3) return showError("Please select at least 3 skills");
//     if (selectedTools.length < 3) return showError("Please select at least 3 tools");
//     if (!budgetFrom || !budgetTo) return showError("Please enter budget range");

//     try {
//       const collectionName = selectedTab === "24 hours" ? "jobs_24h" : "jobs";
//       const jobsRef = collection(db, collectionName);

//       let jobPayload = {
//         userId: currentUser.uid,
//         title: trimmedTitle,
//         description: trimmedDesc,
//         category: selectedCategory || null,
//         skills: selectedSkills,
//         tools: selectedTools,
//         budget_from: budgetFrom,
//         budget_to: budgetTo,
//         sample_project_url: sampleProjectUrl.trim(),
//         freelancer_requirements: freelancerRequirements.trim(),
//         updated_at: serverTimestamp(),
//       };

//       if (selectedTab === "Works") {
//         if (!selectedTimeline) return showError("Please select a timeline");
//         jobPayload.timeline = selectedTimeline;
//       }

//       if (selectedTab === "24 hours") {
//         if (!selectedTimeline || !selectedTime) return showError("Select date & time correctly");

//         const [yyyy, mm, dd] = selectedTimeline.split("-");
//         const [hh, min] = selectedTime.split(":");
//         jobPayload.startDateTime = Timestamp.fromDate(
//           new Date(yyyy, mm - 1, dd, hh, min, 0)
//         );
//       }

//       if (jobIdProp && jobDataProp) {
//         await updateDoc(doc(db, collectionName, jobIdProp), jobPayload);
//         alert("Job updated successfully");
//       } else {
//         const docRef = await addDoc(jobsRef, {
//           ...jobPayload,
//           views: 0,
//           created_at: serverTimestamp(),
//           viewedBy: [],
//         });
//         await updateDoc(docRef, { id: docRef.id });
//         alert("Job posted successfully");
//       }

//       navigate(-1);
//     } catch (err) {
//       console.error(err);
//       showError(`Error saving job: ${err}`);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // ---------------------- UI HELPERS ---------------------- //

//   const renderLabel = (txt) => <div style={styles.label}>{txt}</div>;

//   const renderYellowInput = ({ value, onChange, placeholder, multiline, type = "text" }) => (
//     <div style={styles.yellowField}>
//       {multiline ? (
//         <textarea
//           style={styles.input}
//           rows={4}
//           placeholder={placeholder}
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//         />
//       ) : (
//         <input
//           style={styles.input}
//           type={type}
//           placeholder={placeholder}
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//         />
//       )}
//     </div>
//   );

//   const renderDropdown = ({ value, onChange, placeholder, options }) => (
//     <div style={styles.yellowField}>
//       <select
//         style={styles.select}
//         value={value || ""}
//         onChange={(e) => onChange(e.target.value)}
//       >
//         <option value="" disabled>
//           {placeholder}
//         </option>

//         {options.map((o) => (
//           <option key={o} value={o}>
//             {o}
//           </option>
//         ))}
//       </select>
//     </div>
//   );

//   const renderChips = (items, type) => (
//     <div style={styles.chipWrap}>
//       {items.map((item) => (
//         <div key={item} style={styles.chip}>
//           {item}
//           <button
//             style={styles.chipClose}
//             onClick={() => {
//               if (type === "skills") setSelectedSkills(selectedSkills.filter((s) => s !== item));
//               else setSelectedTools(selectedTools.filter((t) => t !== item));
//             }}
//           >
//             ×
//           </button>
//         </div>
//       ))}
//     </div>
//   );

//   // ---------------------- RENDER UI ---------------------- //

//   return (
//     <div style={styles.page}>
//       <div style={styles.card}>

//         {/* BACK ARROW + HEADING */}
//         <div style={styles.headerRow}>
//           <div style={styles.backbtn} onClick={() => navigate(-1)} aria-label="Back">
//             <img src={backarrow} alt="back arrow" height={20} />
//           </div>

//           <div>
//             <div style={styles.heading}>Job Proposal</div>
//             <div style={styles.subheading}>
//               Turn your ideas into action — post your job today...
//             </div>
//           </div>
//         </div>

//         {/* TOGGLE BUTTONS */}
//         <div style={styles.toggleBar}>
//           <div style={styles.toggleRow}>
//             <button
//               style={{
//                 ...styles.toggleButton,
//                 backgroundColor: selectedTab === "Works" ? "#fff" : "transparent",
//                 color: selectedTab === "Works" ? "#000" : "#000",
//               }}
//               onClick={() => setSelectedTab("Works")}
//             >
//               Work
//             </button>

//             <button
//               style={{
//                 ...styles.toggleButton,
//                 backgroundColor: selectedTab === "24 hours" ? "#fff" : "transparent",
//                 color: selectedTab === "24 hours" ? "#000" : "#000",
//               }}
//               onClick={() => setSelectedTab("24 hours")}
//             >
//               24 hours
//             </button>
//           </div>
//         </div>

//         {/* DIVIDER */}
//         <div style={styles.divider} />

//         {/* FORM */}
//         <div>

//           {renderLabel("Job Title")}
//           {renderYellowInput({
//             value: title,
//             onChange: setTitle,
//             placeholder: "e.g. Logo Design That Pops and Defines Your Brand",
//           })}

//           <div style={styles.sp20} />

//           {renderLabel("Description")}
//           {renderYellowInput({
//             value: description,
//             onChange: setDescription,
//             multiline: true,
//             placeholder: "Describe your service and showcase your uniqueness",
//           })}

//           <div style={styles.sp20} />

//           {renderLabel("Category")}
//           {renderDropdown({
//             value: selectedCategory,
//             onChange: setSelectedCategory,
//             placeholder: "Select Category",
//             options: Object.keys(expertiseOptions),
//           })}

//           <div style={styles.sp20} />

//           {renderLabel("Skills")}
//           {renderChips(selectedSkills, "skills")}
//           <div style={styles.sp10} />

//           {renderDropdown({
//             value: selectedSkill,
//             onChange: (v) => {
//               setSelectedSkill(v);
//               if (!selectedSkills.includes(v) && selectedSkills.length < 3)
//                 setSelectedSkills([...selectedSkills, v]);
//             },
//             placeholder: "Add Skills",
//             options: skillOptions,
//           })}

//           <div style={styles.sp20} />

//           {renderLabel("Tools")}
//           {renderChips(selectedTools, "tools")}
//           <div style={styles.sp10} />

//           {renderDropdown({
//             value: selectedTool,
//             onChange: (v) => {
//               setSelectedTool(v);
//               if (!selectedTools.includes(v) && selectedTools.length < 5)
//                 setSelectedTools([...selectedTools, v]);
//             },
//             placeholder: "Add Tools",
//             options: toolOptions,
//           })}

//           <div style={styles.sp20} />

//           {renderLabel("Budget Range")}
//           <div style={styles.budgetRow}>
//             {renderYellowInput({
//               value: budgetFrom,
//               onChange: setBudgetFrom,
//               type: "number",
//               placeholder: "₹ Min",
//             })}
//             <div style={{ width: 12 }} />
//             {renderYellowInput({
//               value: budgetTo,
//               onChange: setBudgetTo,
//               type: "number",
//               placeholder: "₹ Max",
//             })}
//           </div>

//           <div style={styles.sp20} />

//           {selectedTab === "Works" ? (
//             <>
//               {renderLabel("Timeline")}
//               {renderDropdown({
//                 value: selectedTimeline,
//                 onChange: setSelectedTimeline,
//                 placeholder: "Select Timeline",
//                 options: timelines,
//               })}
//             </>
//           ) : (
//             <div style={styles.dateRow}>
//               <div style={{ width: "50%" }}>
//                 {renderLabel("Start Date")}
//                 <div style={styles.yellowField}>
//                   <input
//                     type="date"
//                     style={styles.input}
//                     value={selectedTimeline}
//                     onChange={(e) => setSelectedTimeline(e.target.value)}
//                   />
//                 </div>
//               </div>

//               <div style={{ width: "50%" }}>
//                 {renderLabel("Time")}
//                 <div style={styles.yellowField}>
//                   <input
//                     type="time"
//                     style={styles.input}
//                     value={selectedTime}
//                     onChange={(e) => setSelectedTime(e.target.value)}
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           <div style={styles.sp25} />

//           {renderLabel("Sample Projects")}
//           {renderYellowInput({
//             value: sampleProjectUrl,
//             onChange: setSampleProjectUrl,
//             placeholder: "URL",
//           })}

//           <div style={styles.sp20} />

//           {renderLabel("Freelancers Requirements (Optional)")}
//           {renderYellowInput({
//             value: freelancerRequirements,
//             onChange: setFreelancerRequirements,
//             placeholder: "Describe what you need and specific details",
//             multiline: true,
//           })}

//           <div style={styles.sp30} />

//           {/* BUTTONS */}
//           <div style={styles.btnRow}>
//             <button style={styles.cancelBtn} onClick={() => navigate(-1)}>
//               Cancel
//             </button>

//             <button
//               style={{
//                 ...styles.submitBtn,
//                 opacity: isSaving ? 0.7 : 1,
//               }}
//               onClick={handleSave}
//             >
//               {isSaving ? "Saving..." : "Submit"}
//             </button>
//           </div>

//           <div style={{ height: 40 }} />
//         </div>
//       </div>
//     </div>
//   );
// }

// // ---------------------- INLINE CSS ---------------------- //

// const styles = {
//   page: {
//     width: "100%",
//     minHeight: "100vh",

//     display: "flex",
//     justifyContent: "center",
//     padding: "40px 0",

//     backgroundColor: "#FFFFFF",
//     minHeight: "100vh",
//     fontFamily:
//       "'Rubik', Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",



//   },

//   card: {
//     width: "100%",
//     maxWidth: 640,
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 28,
//     boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
//   },

//   headerRow: {
//     display: "flex",
//     alignItems: "flex-start",
//     marginBottom: 20,
//     gap: 12,
//   },

//    backbtn: {
//     width: "36px",
//     height: "36px",
//     borderRadius: "14px",
//     border: "0.8px solid #ccc",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     cursor: "pointer",
//     fontSize: "20px",
//     opacity: 1,
//     flexShrink: 0,
//     marginBottom: "18px",
//   },

//   heading: {
//     fontSize: 26,
//     fontWeight: 700,
//     marginBottom: 4,
//   },

//   subheading: {
//     color: "#666",
//     fontSize: 14,
//   },
//   toggleBar: {
//     display: "flex",
//     justifyContent: "left",
//     alignItems: "center",
//     backgroundColor: "#FFFCD1",
//     borderRadius: 30,
//     padding: 8,
//     gap: 20,
//     marginTop: 10,
//   },

//   toggleRow: {
//     display: "flex",
//     gap: 8,
//     marginTop: 2,
//   },

//   toggleButton: {
//     width: 100,        // 🔹 decreased width
//     padding: "6px 0px ",
//     borderRadius: 20,
//     border: "none",
//     backgroundColor: "transparent",
//     color: "#000",
//     fontSize: 14,
//     fontWeight: 600,
//     cursor: "pointer",
//     transition: "0.2s",
//   },
//   //   toggleActive: {
//   //   backgroundColor: "fff",
//   //   color: "000",
//   //   borderRadius: 20,
//   // },

//   divider: {
//     height: 1,
//     backgroundColor: "#E8E8E8",
//     margin: "25px 0",
//   },

//   label: {
//     fontSize: 15,
//     fontWeight: 600,
//     marginBottom: 6,
//     color: "#333",
//   },

//   yellowField: {
//     backgroundColor: "#FFFCD1",
//     borderRadius: 12,
//     border: "1px solid #E6E4A9",
//     padding: "10px 10px",
//   },

//   input: {
//     width: "100%",
//     background: "transparent",
//     border: "none",
//     outline: "none",
//     fontSize: 15,
//     fontFamily: "inherit",
//     marginLeft:"-10px",
//   },

//   select: {
//     width: "100%",
//     background: "transparent",
//     border: "none",
//     outline: "none",
//     fontSize: 15,
//   },

//   chipWrap: {
//     display: "flex",
//     flexWrap: "wrap",
//     gap: 8,
//   },

//   chip: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     padding: "6px 12px",
//     borderRadius: 20,
//     border: "1px solid #D5D5D5",
//     backgroundColor: "#fff",
//     fontSize: 13,
//   },

//   chipClose: {
//     background: "none",
//     border: "none",
//     cursor: "pointer",
//     fontSize: 16,
//     marginLeft: 2,
//   },

//   budgetRow: {
//     display: "flex",

//   },

//   dateRow: {
//     display: "flex",
//     gap: 12,
//   },

//   btnRow: {
//     display: "flex",
//     gap: 16,
//     marginLeft: "400px",
//   },

//   cancelBtn: {
//     flex: 1,
//     border: "2px solid #7C3CFF",
//     background: "#fff",
//     color: "#7C3CFF",
//     borderRadius: 25,
//     padding: "12px 0",
//     fontSize: 15,
//     fontWeight: 600,
//     cursor: "pointer",

//   },

//   submitBtn: {
//     flex: 1,
//     border: "none",
//     background: "#7C3CFF",
//     color: "#fff",
//     borderRadius: 25,
//     padding: "12px 0",
//     fontSize: 15,
//     fontWeight: 600,
//     cursor: "pointer",
//   },

//   sp10: { height: 10 },
//   sp20: { height: 10 },
//   sp25: { height: 25 },
//   sp30: { height: 30 },
// };



// frontend/src/firebaseClientScreen/Postjob/PostJobScreen.jsx
// ❤️ UI upgraded — Backend untouched

// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { getAuth } from "firebase/auth";
// import {
//   collection,
//   doc,
//   addDoc,
//   updateDoc,
//   serverTimestamp,
//   Timestamp,
// } from "firebase/firestore";
// import backarrow from "../../assets/backarrow.png"
// // 🔹 UPDATE THIS PATH TO MATCH YOUR PROJECT
// import { db } from "../../firbase/Firebase";

// export default function PostJobScreen(props) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const auth = getAuth();
//   const currentUser = auth.currentUser;

//   const routeState = location.state || {};
//   const jobIdProp = props.jobId || routeState.jobId || routeState.job_id || null;
//   const jobDataProp = props.jobData || routeState.jobData || null;

//   // -------------------- STATE -------------------- //
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [budgetFrom, setBudgetFrom] = useState("");
//   const [budgetTo, setBudgetTo] = useState("");
//   const [sampleProjectUrl, setSampleProjectUrl] = useState("");
//   const [freelancerRequirements, setFreelancerRequirements] = useState("");

//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedTimeline, setSelectedTimeline] = useState("");
//   const [selectedTime, setSelectedTime] = useState("");

//   const [selectedTab, setSelectedTab] = useState("Works");

//   const [isSaving, setIsSaving] = useState(false);

//   const [selectedSkill, setSelectedSkill] = useState("");
//   const [selectedTool, setSelectedTool] = useState("");
//   const [selectedSkills, setSelectedSkills] = useState([]);
//   const [selectedTools, setSelectedTools] = useState([]);

//   // -------------------- CONSTANTS (UNMODIFIED) -------------------- //
//   const expertiseOptions = {
//     "Graphics & Design": [],
//     "Programming & Tech": [],
//     "Digital Marketing": [],
//     "Writing & Translation": [],
//     "Video & Animation": [],
//     "Music & Audio": [],
//     "AI Services": [],
//     Data: [],
//     Business: [],
//     Finance: [],
//     Photography: [],
//     Lifestyle: [],
//     Consulting: [],
//     "Personal Growth & Hobbies": [],
//   };

//   const skillOptions = [
//     "Logo Design",
//     "Brand Style Guides",
//     "Business Cards & Stationery",
//     "Illustration",
//     "Pattern Design",
//     "Website Design",
//     "App Design",
//     "UX Design",
//     "Game Art",
//     "NFTs & Collectibles",
//     "Industrial & Product Design",
//     "Architecture & Interior Design",
//     "Landscape Design",
//     "Fashion Design",
//     "Jewelry Design",
//     "Presentation Design",
//     "Infographic Design",
//     "Vector Tracing",
//     "Car Wraps",
//     "Image Editing",
//     "Photoshop Editing",
//     "T-Shirts & Merchandise",
//     "Packaging Design",
//     "Book Design",
//     "Album Cover Design",
//     "Podcast Cover Art",
//     "Menu Design",
//     "Invitation Design",
//     "Brochure Design",
//     "Poster Design",
//     "Signage Design",
//     "Flyer Design",
//     "Social Media Design",
//     "Print Design",
//     "Website Development",
//     "Website Builders & CMS",
//     "Web Programming",
//     "E-Commerce Development",
//     "Game Development",
//     "Mobile Apps (iOS & Android)",
//     "Desktop Applications",
//     "Chatbots",
//     "QA & Review",
//     "User Testing",
//     "Support & IT",
//     "Data Analysis & Reports",
//     "Convert Files",
//     "Databases",
//     "Cybersecurity & Data Protection",
//     "Cloud Computing",
//     "DevOps",
//     "AI Development",
//     "Machine Learning Models",
//     "Blockchain & NFTs",
//     "Scripts & Automation",
//     "Software Customization",
//     "Social Media Marketing",
//     "SEO",
//     "Content Marketing",
//     "Video Marketing",
//     "Email Marketing",
//     "SEM (Search Engine Marketing)",
//     "Influencer Marketing",
//     "Local SEO",
//     "Affiliate Marketing",
//     "Mobile Marketing & Advertising",
//     "Display Advertising",
//     "E-Commerce Marketing",
//     "Text Message Marketing",
//     "Crowdfunding",
//     "Web Analytics",
//     "Domain Research",
//     "Music Promotion",
//     "Book & eBook Marketing",
//     "Podcast Marketing",
//     "Community Management",
//     "Marketing Consulting",
//     "Articles & Blog Posts",
//     "Proofreading & Editing",
//     "Translation",
//     "Website Content",
//     "Technical Writing",
//     "Copywriting",
//     "Brand Voice & Tone",
//     "Resume Writing",
//     "Cover Letters",
//     "LinkedIn Profiles",
//     "Press Releases",
//     "Product Descriptions",
//     "Case Studies",
//     "White Papers",
//     "Scriptwriting",
//     "Speechwriting",
//     "Creative Writing",
//     "Book Editing",
//     "Beta Reading",
//     "Grant Writing",
//     "UX Writing",
//     "Email Copy",
//     "Business Names & Slogans",
//     "Transcription",
//     "Legal Writing",
//     "Whiteboard & Animated Explainers",
//     "Video Editing",
//     "Short Video Ads",
//     "Logo Animation",
//     "Character Animation",
//     "2D/3D Animation",
//     "Intros & Outros",
//     "Lyric & Music Videos",
//     "Visual Effects",
//     "Spokesperson Videos",
//     "App & Website Previews",
//     "Product Photography & Demos",
//     "Subtitles & Captions",
//     "Live Action Explainers",
//     "Unboxing Videos",
//     "Slideshow Videos",
//     "Animation for Kids",
//     "Trailers & Teasers",
//     "Voice Over",
//     "Mixing & Mastering",
//     "Producers & Composers",
//     "Singers & Vocalists",
//     "Session Musicians",
//     "Songwriters",
//     "Audiobook Production",
//     "Sound Design",
//     "Audio Editing",
//     "Jingles & Intros",
//     "Podcast Editing",
//     "Music Transcription",
//     "Dialogue Editing",
//     "DJ Drops & Tags",
//     "AI Artists",
//     "AI Applications",
//     "AI Video Generators",
//     "AI Music Generation",
//     "AI Chatbot Development",
//     "AI Website Builders",
//     "Custom GPT & LLMs",
//     "AI Training Data Preparation",
//     "Text-to-Speech / Voice Cloning",
//     "Prompt Engineering",
//     "Data Entry",
//     "Data Mining & Scraping",
//     "Database Design",
//     "Data Visualization",
//     "Dashboards",
//     "Excel / Google Sheets",
//     "Statistical Analysis",
//     "Data Engineering",
//     "Data Cleaning",
//     "Business Plans",
//     "Market Research",
//     "Branding Services",
//     "Financial Consulting",
//     "Career Counseling",
//     "Project Management",
//     "Supply Chain Management",
//     "HR Consulting",
//     "E-Commerce Management",
//     "Business Consulting",
//     "Presentations",
//     "Virtual Assistant",
//     "Accounting & Bookkeeping",
//     "Financial Forecasting",
//     "Financial Modeling",
//     "Tax Consulting",
//     "Crypto & NFT Consulting",
//     "Business Valuation",
//     "Pitch Decks",
//     "Product Photography",
//     "Real Estate Photography",
//     "Portraits",
//     "Image Retouching",
//     "Food Photography",
//     "Drone Photography",
//     "Lifestyle Photography",
//     "AI Image Enhancement",
//     "Gaming",
//     "Astrology & Psychics",
//     "Online Tutoring",
//     "Arts & Crafts",
//     "Fitness Lessons",
//     "Nutrition",
//     "Relationship Advice",
//     "Personal Styling",
//     "Cooking Lessons",
//     "Life Coaching",
//     "Travel Advice",
//     "Wellness & Meditation",
//     "Language Lessons",
//     "Management Consulting",
//     "Business Strategy",
//     "HR & Leadership",
//     "Financial Advisory",
//     "Technology Consulting",
//     "Cybersecurity Consulting",
//     "Productivity Coaching",
//     "Study Skills",
//     "Language Learning",
//     "Public Speaking",
//     "Career Mentoring",
//     "Mindfulness & Meditation",
//     "Confidence Coaching",
//   ];
//   const toolOptions = [
//     "Adobe Illustrator",
//     "CorelDRAW",
//     "Affinity Designer",
//     "Canva",
//     "Figma",
//     "Gravit Designer",
//     "Inkscape",
//     "Adobe InDesign",
//     "Notion",
//     "Milanote",
//     "Frontify",
//     "VistaCreate",
//     "Procreate",
//     "Clip Studio Paint",
//     "Corel Painter",
//     "Krita",
//     "Repper",
//     "Patterninja",
//     "Adobe XD",
//     "Sketch",
//     "Webflow",
//     "Framer",
//     "InVision Studio",
//     "ProtoPie",
//     "Marvel",
//     "Miro",
//     "Balsamiq",
//     "Axure RP",
//     "Lucidchart",
//     "Adobe Photoshop",
//     "Blender",
//     "ZBrush",
//     "Substance Painter",
//     "Unity",
//     "Unreal Engine",
//     "NFT Art Generator",
//     "SolidWorks",
//     "Autodesk Fusion 360",
//     "Rhino 3D",
//     "KeyShot",
//     "AutoCAD",
//     "SketchUp",
//     "Revit",
//     "Lumion",
//     "3ds Max",
//     "CLO 3D",
//     "Marvelous Designer",
//     "TUKAcad",
//     "RhinoGold",
//     "MatrixGold",
//     "PowerPoint",
//     "Google Slides",
//     "Prezi",
//     "Piktochart",
//     "Visme",
//     "Venngage",
//     "Vector Magic",
//     "FlexiSIGN",
//     "SAi Sign Design Software",
//     "Easysign Studio",
//     "Adobe Express",
//     "Crello",
//     "Buffer Pablo",
//     "QuarkXPress",
//     "Visual Studio Code",
//     "Sublime Text",
//     "Atom",
//     "Git",
//     "GitHub",
//     "GitLab",
//     "Node.js",
//     "React",
//     "Angular",
//     "Vue.js",
//     "HTML",
//     "CSS",
//     "JavaScript",
//     "Bootstrap",
//     "Tailwind CSS",
//     "WordPress",
//     "Elementor",
//     "Divi",
//     "Wix",
//     "Squarespace",
//     "Shopify",
//     "Joomla",
//     "Drupal",
//     "IntelliJ IDEA",
//     "PyCharm",
//     "PHPStorm",
//     "Django",
//     "Flask",
//     "Laravel",
//     "ASP.NET Core",
//     "Express.js",
//     "WooCommerce",
//     "Magento",
//     "BigCommerce",
//     "OpenCart",
//     "PrestaShop",
//     "Stripe",
//     "PayPal",
//     "Godot",
//     "C#",
//     "C++",
//     "Android Studio",
//     "Xcode",
//     "Flutter",
//     "React Native",
//     "Kotlin",
//     "Java",
//     "Swift",
//     "SwiftUI",
//     "Firebase",
//     "Expo",
//     "Electron.js",
//     "PyQt",
//     "Tkinter",
//     ".NET",
//     "WPF",
//     "JavaFX",
//     "C++ with Qt",
//     "Dialogflow",
//     "Microsoft Bot Framework",
//     "Rasa",
//     "IBM Watson Assistant",
//     "Botpress",
//     "ChatGPT API",
//     "ManyChat",
//     "Selenium",
//     "Postman",
//     "JMeter",
//     "Cypress",
//     "TestRail",
//     "Bugzilla",
//     "Jira",
//     "Appium",
//     "Hotjar",
//     "Maze",
//     "UserTesting.com",
//     "Lookback",
//     "Zendesk",
//     "Freshdesk",
//     "Jira Service Management",
//     "ServiceNow",
//     "TeamViewer",
//     "AnyDesk",
//     "Microsoft Intune",
//     "Python",
//     "Pandas",
//     "NumPy",
//     "Matplotlib",
//     "R Studio",
//     "Power BI",
//     "Tableau",
//     "Excel",
//     "Google Sheets",
//     "SQL",
//     "Jupyter Notebook",
//     "Pandoc",
//     "FFmpeg",
//     "ImageMagick",
//     "CloudConvert",
//     "Adobe Acrobat",
//     "MySQL",
//     "PostgreSQL",
//     "MongoDB",
//     "SQLite",
//     "Firebase Firestore",
//     "Redis",
//     "Microsoft SQL Server",
//     "phpMyAdmin",
//     "Wireshark",
//     "Metasploit",
//     "Burp Suite",
//     "Nessus",
//     "Kali Linux",
//     "OWASP ZAP",
//     "Nmap",
//     "Bitdefender",
//     "Kaspersky",
//     "AWS",
//     "Microsoft Azure",
//     "Google Cloud Platform",
//     "DigitalOcean",
//     "Heroku",
//     "IBM Cloud",
//     "Docker",
//     "Kubernetes",
//     "Jenkins",
//     "GitHub Actions",
//     "GitLab CI/CD",
//     "Terraform",
//     "Ansible",
//     "Prometheus",
//     "Grafana",
//     "TensorFlow",
//     "PyTorch",
//     "OpenAI API",
//     "Hugging Face Transformers",
//     "LangChain",
//     "Google Vertex AI",
//     "Azure AI Studio",
//     "Scikit-learn",
//     "XGBoost",
//     "LightGBM",
//     "Solidity",
//     "Remix IDE",
//     "Hardhat",
//     "Truffle",
//     "Web3.js",
//     "Ethers.js",
//     "Metamask",
//     "Alchemy",
//     "Python Automation Scripts",
//     "PowerShell",
//     "Bash",
//     "AutoHotkey",
//     "Puppeteer",
//     "Playwright",
//     "Zapier",
//     "Make",
//     "Visual Studio",
//     "Eclipse",
//     "API Integration Tools",
//     "Low-code platforms",
//     "MadCap Flare",
//     "Adobe FrameMaker",
//     "Typora",
//     "Obsidian",
//     "DITA XML tools",
//     "Confluence",
//     "GitBook",
//     "Frase.io",
//     "Wordtune",
//     "Headlime",
//     "Novorésumé",
//     "Resume.io",
//     "Zety",
//     "Enhancv",
//     "ChatGPT",
//     "Jasper",
//     "SurferSEO",
//     "NeuronWriter",
//     "Grammarly",
//     "Hemingway Editor",
//     "ProWritingAid",
//     "Ginger Software",
//     "LanguageTool",
//     "QuillBot",
//     "DeepL Translator",
//     "Microsoft Translator",
//     "Smartcat",
//     "memoQ",
//     "SDL Trados Studio",
//     "Crowdin",
//     "Vyond",
//     "Animaker",
//     "Doodly",
//     "VideoScribe",
//     "Renderforest",
//     "Powtoon",
//     "Adobe After Effects",
//     "Adobe Premiere Pro",
//     "Final Cut Pro",
//     "DaVinci Resolve",
//     "CapCut",
//     "Filmora",
//     "Vegas Pro",
//     "Shotcut",
//     "OpenShot",
//     "InVideo",
//     "Adobe Premiere Rush",
//     "VN Video Editor",
//     "Blender",
//     "Cinema 4D",
//     "Panzoid",
//     "Adobe Character Animator",
//     "Toon Boom Harmony",
//     "Moho",
//     "Reallusion iClone",
//     "CrazyTalk Animator",
//     "Synfig Studio",
//     "OpenToonz",
//     "Autodesk Maya",
//     "ScreenFlow",
//     "Loom",
//     "Adobe Lightroom",
//     "VEED.io",
//     "Kapwing",
//     "Rev.com",
//     "Subtitle Edit",
//     "Camtasia",
//     "Synthesia",
//     "Pictory.ai",
//     "Lumen5",
//     "OBS Studio",
//     "Alitu",
//     "Hindenburg Journalist",
//     "Animoto",
//     "FlexClip",
//     "Audacity",
//     "Adobe Audition",
//     "GarageBand",
//     "Logic Pro X",
//     "Pro Tools",
//     "Reaper",
//     "iZotope RX",
//     "FL Studio",
//     "Ableton Live",
//     "Cubase",
//     "Studio One",
//     "iZotope Ozone",
//     "Waves Plugins",
//     "Reason Studios",
//     "Bitwig Studio",
//     "Native Instruments Komplete",
//     "Melodyne",
//     "Antares Auto-Tune",
//     "Soundtrap",
//     "MasterWriter",
//     "Hookpad",
//     "Sibelius",
//     "Finale",
//     "MuseScore",
//     "Noteflight",
//     "Dorico",
//     "Transcribe!",
//     "Spotify for Artists",
//     "SoundCloud",
//     "DistroKid",
//     "TuneCore",
//     "ReverbNation",
//     "SubmitHub",
//     "Linktree",
//     "DALL·E",
//     "MidJourney",
//     "Stable Diffusion",
//     "Adobe Firefly",
//     "Leonardo AI",
//     "Runway ML",
//     "Lobe AI",
//     "Pictory",
//     "Kaiber",
//     "DeepBrain AI",
//     "Soundraw",
//     "AIVA",
//     "Amper Music",
//     "Jukedeck",
//     "Boomy",
//     "Endel",
//     "Tidio",
//     "Wix ADI",
//     "Bookmark",
//     "Zyro AI",
//     "Jimdo Dolphin",
//     "Durable",
//     "GPT-4",
//     "GPT-3",
//     "LLaMA",
//     "MPT Models",
//     "Claude",
//     "Labelbox",
//     "Supervisely",
//     "Scale AI",
//     "CVAT",
//     "Dataloop",
//     "Roboflow",
//     "ElevenLabs",
//     "Descript Overdub",
//     "Murf AI",
//     "Resemble AI",
//     "Replica Studios",
//     "LOVO AI",
//     "ChatGPT Playground",
//     "FlowGPT",
//     "Promptable",
//     "SuperPrompt",
//     "PromptLayer",
//     "Airtable",
//     "Zoho Creator",
//     "Smartsheet",
//     "RoboTask",
//     "Octoparse",
//     "ParseHub",
//     "WebHarvy",
//     "Import.io",
//     "Apify",
//     "Looker",
//     "Qlik Sense",
//     "D3.js",
//     "Klipfolio",
//     "Zoho Analytics",
//     "Databox",
//     "OpenRefine",
//     "SPSS",
//     "SAS",
//     "Stata",
//     "Minitab",
//     "Apache Spark",
//     "Apache Airflow",
//     "Talend",
//     "Hadoop",
//     "dbt",
//     "H2O.ai",
//     "RapidMiner",
//     "Weka",
//     "Google Cloud AI Platform",
//     "Trifacta",
//     "LivePlan",
//     "Bizplan",
//     "Enloop",
//     "StratPad",
//     "PlanGuru",
//     "Statista",
//     "Nielsen",
//     "SurveyMonkey",
//     "Typeform",
//     "Google Trends",
//     "SEMrush",
//     "Looka",
//     "Brandfolder",
//     "Clio",
//     "MyCase",
//     "LegalZoom",
//     "Lawcus",
//     "Rocket Lawyer",
//     "DocuSign",
//     "Tally",
//     "Xero",
//     "Wave Accounting",
//     "Microsoft Office",
//     "Google Workspace",
//     "Slack",
//     "Teams",
//     "Zoom",
//     "Trello",
//     "Asana",
//     "Monday.com",
//     "ClickUp",
//     "Wrike",
//     "SAP SCM",
//     "Oracle SCM Cloud",
//     "Odoo",
//     "NetSuite",
//     "Microsoft Dynamics 365",
//     "Fishbowl Inventory",
//     "BambooHR",
//     "Zoho People",
//     "Workday",
//     "Gusto",
//     "SAP SuccessFactors",
//     "ADP Workforce Now",
//     "Coursera",
//     "Udemy",
//     "Indeed Career Guides",
//     "Glassdoor",
//     "Mettl Assessments",
//     "Skillshare",
//     "MyFitnessPal",
//     "Nike Training Club",
//     "Fitbod",
//     "Peloton App",
//     "Cronometer",
//     "Yazio",
//     "Eat This Much",
//     "Lifesum",
//     "BetterHelp",
//     "Talkspace",
//     "ReGain",
//     "Couple Counseling Apps",
//     "Lasting",
//     "Polyvore",
//     "Pinterest",
//     "Tasty App",
//     "MasterClass",
//     "Mindvalley App",
//     "CoachAccountable",
//     "TripAdvisor",
//     "Google Maps",
//     "Lonely Planet Guides",
//     "Airbnb",
//     "Booking.com",
//     "Rome2Rio",
//     "Headspace",
//     "Calm",
//     "Insight Timer",
//     "Waking Up App",
//     "Aura",
//     "Duolingo",
//     "Babbel",
//     "Rosetta Stone",
//     "LingQ",
//     "iTalki",
//     "Toastmasters Resources",
//     "TED Talks",
//   ];
//   const timelines = ["1-30 days", "1-3 months", "3-6 months", "6+ months"];

//   // -------------------- PREFILL WHEN EDITING -------------------- //
//   useEffect(() => {
//     if (!jobDataProp) return;

//     setTitle(jobDataProp.title || "");
//     setDescription(jobDataProp.description || "");
//     setBudgetFrom(jobDataProp.budget_from || "");
//     setBudgetTo(jobDataProp.budget_to || "");
//     setSampleProjectUrl(jobDataProp.sample_project_url || "");
//     setFreelancerRequirements(jobDataProp.freelancer_requirements || "");

//     setSelectedCategory(jobDataProp.category || "");
//     setSelectedTimeline(jobDataProp.timeline || "");

//     setSelectedSkills(Array.isArray(jobDataProp.skills) ? jobDataProp.skills : []);
//     setSelectedTools(Array.isArray(jobDataProp.tools) ? jobDataProp.tools : []);

//     if (jobDataProp.startDateTime && jobDataProp.startDateTime.toDate) {
//       const d = jobDataProp.startDateTime.toDate();
//       const yyyy = d.getFullYear();
//       const mm = String(d.getMonth() + 1).padStart(2, "0");
//       const dd = String(d.getDate()).padStart(2, "0");
//       const hh = String(d.getHours()).padStart(2, "0");
//       const min = String(d.getMinutes()).padStart(2, "0");

//       setSelectedTimeline(`${yyyy}-${mm}-${dd}`);
//       setSelectedTime(`${hh}:${min}`);
//       setSelectedTab("24 hours");
//     }
//   }, [jobDataProp]);

//   // -------------------- HELPERS -------------------- //
//   const showError = (msg) => {
//     setIsSaving(false);
//     alert(msg);
//   };

//   const handleSave = async () => {
//     if (!currentUser) return showError("User not logged in");

//     setIsSaving(true);

//     const trimmedTitle = title.trim();
//     const trimmedDesc = description.trim();

//     if (trimmedTitle.split(" ").length < 2) return showError("Title must have at least 2 words");
//     if (trimmedDesc.split(" ").length < 40) return showError("Description must have at least 40 words");
//     if (!selectedCategory) return showError("Please select a category");
//     if (selectedSkills.length < 3) return showError("Please select at least 3 skills");
//     if (selectedTools.length < 3) return showError("Please select at least 3 tools");
//     if (!budgetFrom || !budgetTo) return showError("Please enter budget range");

//     try {
//       const collectionName = selectedTab === "24 hours" ? "jobs_24h" : "jobs";
//       const jobsRef = collection(db, collectionName);

//       let jobPayload = {
//         userId: currentUser.uid,
//         title: trimmedTitle,
//         description: trimmedDesc,
//         category: selectedCategory || null,
//         skills: selectedSkills,
//         tools: selectedTools,
//         budget_from: budgetFrom,
//         budget_to: budgetTo,
//         sample_project_url: sampleProjectUrl.trim(),
//         freelancer_requirements: freelancerRequirements.trim(),
//         updated_at: serverTimestamp(),
//       };

//       if (selectedTab === "Works") {
//         if (!selectedTimeline) return showError("Please select a timeline");
//         jobPayload.timeline = selectedTimeline;
//       }

//       if (selectedTab === "24 hours") {
//         if (!selectedTimeline || !selectedTime) return showError("Select date & time correctly");

//         const [yyyy, mm, dd] = selectedTimeline.split("-");
//         const [hh, min] = selectedTime.split(":");
//         jobPayload.startDateTime = Timestamp.fromDate(
//           new Date(yyyy, mm - 1, dd, hh, min, 0)
//         );
//       }

//       if (jobIdProp && jobDataProp) {
//         await updateDoc(doc(db, collectionName, jobIdProp), jobPayload);
//         alert("Job updated successfully");
//       } else {
//         const docRef = await addDoc(jobsRef, {
//           ...jobPayload,
//           views: 0,
//           created_at: serverTimestamp(),
//           viewedBy: [],
//         });
//         await updateDoc(docRef, { id: docRef.id });
//         alert("Job posted successfully");
//       }

//       navigate(-1);
//     } catch (err) {
//       console.error(err);
//       showError(`Error saving job: ${err}`);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // ---------------------- UI HELPERS ---------------------- //

//   const renderLabel = (txt) => <div style={styles.label}>{txt}</div>;

//   const renderYellowInput = ({ value, onChange, placeholder, multiline, type = "text" }) => (
//     <div style={styles.yellowField}>
//       {multiline ? (
//         <textarea
//           style={styles.input}
//           rows={4}
//           placeholder={placeholder}
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//         />
//       ) : (
//         <input
//           style={styles.input}
//           type={type}
//           placeholder={placeholder}
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//         />
//       )}
//     </div>
//   );

//   const renderDropdown = ({ value, onChange, placeholder, options }) => (
//     <div style={styles.yellowField}>
//       <select
//         style={styles.select}
//         value={value || ""}
//         onChange={(e) => onChange(e.target.value)}
//       >
//         <option value="" disabled>
//           {placeholder}
//         </option>

//         {options.map((o) => (
//           <option key={o} value={o}>
//             {o}
//           </option>
//         ))}
//       </select>
//     </div>
//   );

//   const renderChips = (items, type) => (
//     <div style={styles.chipWrap}>
//       {items.map((item) => (
//         <div key={item} style={styles.chip}>
//           {item}
//           <button
//             style={styles.chipClose}
//             onClick={() => {
//               if (type === "skills") setSelectedSkills(selectedSkills.filter((s) => s !== item));
//               else setSelectedTools(selectedTools.filter((t) => t !== item));
//             }}
//           >
//             ×
//           </button>
//         </div>
//       ))}
//     </div>
//   );

//   // ---------------------- RENDER UI ---------------------- //

//   return (
//     <div style={styles.page}>
//       <div style={styles.card}>

//         {/* BACK ARROW + HEADING */}
//         <div style={styles.headerRow}>
//           <div style={styles.backbtn} onClick={() => navigate(-1)} aria-label="Back">
//             <img src={backarrow} alt="back arrow" height={20} />
//           </div>

//           <div>
//             <div style={styles.heading}>Job Proposal</div>
//             <div style={styles.subheading}>
//               Turn your ideas into action — post your job today.
//             </div>
//           </div>
//         </div>

//         {/* TOGGLE BUTTONS */}
//         <div style={styles.toggleBar}>
//           <div style={styles.toggleRow}>
//             <button
//               style={{
//                 ...styles.toggleButton,
//                 backgroundColor: selectedTab === "Works" ? "#fff" : "transparent",
//                 color: selectedTab === "Works" ? "#000" : "#000",
//               }}
//               onClick={() => setSelectedTab("Works")}
//             >
//               Work
//             </button>

//             <button
//               style={{
//                 ...styles.toggleButton,
//                 backgroundColor: selectedTab === "24 hours" ? "#fff" : "transparent",
//                 color: selectedTab === "24 hours" ? "#000" : "#000",
//               }}
//               onClick={() => setSelectedTab("24 hours")}
//             >
//               24 hours
//             </button>
//           </div>
//         </div>

//         {/* DIVIDER */}
//         <div style={styles.divider} />

//         {/* FORM */}
//         <div>

//           {renderLabel("Job Title")}
//           {renderYellowInput({
//             value: title,
//             onChange: setTitle,
//             placeholder: "e.g. Logo Design That Pops and Defines Your Brand",
//           })}

//           <div style={styles.sp20} />

//           {renderLabel("Description")}
//           {renderYellowInput({
//             value: description,
//             onChange: setDescription,
//             multiline: true,
//             placeholder: "Describe your service and showcase your uniqueness",
//           })}

//           <div style={styles.sp20} />

//           {renderLabel("Category")}
//           {renderDropdown({
//             value: selectedCategory,
//             onChange: setSelectedCategory,
//             placeholder: "Select Category",
//             options: Object.keys(expertiseOptions),
//           })}

//           <div style={styles.sp20} />

//           {renderLabel("Skills")}
//           {renderChips(selectedSkills, "skills")}
//           <div style={styles.sp10} />

//           {renderDropdown({
//             value: selectedSkill,
//             onChange: (v) => {
//               setSelectedSkill(v);
//               if (!selectedSkills.includes(v) && selectedSkills.length < 3)
//                 setSelectedSkills([...selectedSkills, v]);
//             },
//             placeholder: "Add Skills",
//             options: skillOptions,
//           })}

//           <div style={styles.sp20} />

//           {renderLabel("Tools")}
//           {renderChips(selectedTools, "tools")}
//           <div style={styles.sp10} />

//           {renderDropdown({
//             value: selectedTool,
//             onChange: (v) => {
//               setSelectedTool(v);
//               if (!selectedTools.includes(v) && selectedTools.length < 5)
//                 setSelectedTools([...selectedTools, v]);
//             },
//             placeholder: "Add Tools",
//             options: toolOptions,
//           })}

//           <div style={styles.sp20} />

//           {renderLabel("Budget Range")}
//           <div style={styles.budgetRow}>
//             {renderYellowInput({
//               value: budgetFrom,
//               onChange: setBudgetFrom,
//               type: "number",
//               placeholder: "₹ Min",
//             })}
//             <div style={{ width: 12 }} />
//             {renderYellowInput({
//               value: budgetTo,
//               onChange: setBudgetTo,
//               type: "number",
//               placeholder: "₹ Max",
//             })}
//           </div>

//           <div style={styles.sp20} />

//           {selectedTab === "Works" ? (
//             <>
//               {renderLabel("Timeline")}
//               {renderDropdown({
//                 value: selectedTimeline,
//                 onChange: setSelectedTimeline,
//                 placeholder: "Select Timeline",
//                 options: timelines,
//               })}
//             </>
//           ) : (
//             <div style={styles.dateRow}>
//               <div style={{ width: "50%" }}>
//                 {renderLabel("Start Date")}
//                 <div style={styles.yellowField}>
//                   <input
//                     type="date"
//                     style={styles.input}
//                     value={selectedTimeline}
//                     onChange={(e) => setSelectedTimeline(e.target.value)}
//                   />
//                 </div>
//               </div>

//               <div style={{ width: "50%" }}>
//                 {renderLabel("Time")}
//                 <div style={styles.yellowField}>
//                   <input
//                     type="time"
//                     style={styles.input}
//                     value={selectedTime}
//                     onChange={(e) => setSelectedTime(e.target.value)}
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           <div style={styles.sp25} />

//           {renderLabel("Sample Projects")}
//           {renderYellowInput({
//             value: sampleProjectUrl,
//             onChange: setSampleProjectUrl,
//             placeholder: "URL",
//           })}

//           <div style={styles.sp20} />

//           {renderLabel("Freelancers Requirements (Optional)")}
//           {renderYellowInput({
//             value: freelancerRequirements,
//             onChange: setFreelancerRequirements,
//             placeholder: "Describe what you need and specific details",
//             multiline: true,
//           })}

//           <div style={styles.sp30} />

//           {/* BUTTONS */}
//           <div style={styles.btnRow}>
//             <button style={styles.cancelBtn} onClick={() => navigate(-1)}>
//               Cancel
//             </button>

//             <button
//               style={{
//                 ...styles.submitBtn,
//                 opacity: isSaving ? 0.7 : 1,
//               }}
//               onClick={handleSave}
//             >
//               {isSaving ? "Saving..." : "Submit"}
//             </button>
//           </div>

//           <div style={{ height: 40 }} />
//         </div>
//       </div>
//     </div>
//   );
// }

// // ---------------------- INLINE CSS ---------------------- //

// const styles = {
//   page: {
//     width: "100%",
//     minHeight: "100vh",

//     display: "flex",
//     justifyContent: "center",
//     padding: "40px 0",

//     backgroundColor: "#FFFFFF",
//     minHeight: "100vh",
//     fontFamily:
//       "'Rubik', Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",



//   },

//   card: {
//     width: "100%",
//     maxWidth: 640,
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 28,
//     boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
//   },

//   headerRow: {
//     display: "flex",
//     alignItems: "flex-start",
//     marginBottom: 20,
//     gap: 12,
//   },

//    backbtn: {
//     width: "36px",
//     height: "36px",
//     borderRadius: "14px",
//     border: "0.8px solid #ccc",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     cursor: "pointer",
//     fontSize: "20px",
//     opacity: 1,
//     flexShrink: 0,
//     marginBottom: "18px",
//   },

//   heading: {
//     fontSize: 26,
//     fontWeight: 700,
//     marginBottom: 4,
//   },

//   subheading: {
//     color: "#666",
//     fontSize: 14,
//   },
//   toggleBar: {
//     display: "flex",
//     justifyContent: "left",
//     alignItems: "center",
//     backgroundColor: "#FFFCD1",
//     borderRadius: 30,
//     padding: 8,
//     gap: 20,
//     marginTop: 10,
//   },

//   toggleRow: {
//     display: "flex",
//     gap: 8,
//     marginTop: 2,
//   },

//   toggleButton: {
//     width: 100,        // 🔹 decreased width
//     padding: "6px 0px ",
//     borderRadius: 20,
//     border: "none",
//     backgroundColor: "transparent",
//     color: "#000",
//     fontSize: 14,
//     fontWeight: 600,
//     cursor: "pointer",
//     transition: "0.2s",
//   },
//   //   toggleActive: {
//   //   backgroundColor: "fff",
//   //   color: "000",
//   //   borderRadius: 20,
//   // },

//   divider: {
//     height: 1,
//     backgroundColor: "#E8E8E8",
//     margin: "25px 0",
//   },

//   label: {
//     fontSize: 15,
//     fontWeight: 600,
//     marginBottom: 6,
//     color: "#333",
//   },

//   yellowField: {
//     backgroundColor: "#FFFCD1",
//     borderRadius: 12,
//     border: "1px solid #E6E4A9",
//     padding: "10px 10px",
//   },

//   input: {
//     width: "100%",
//     background: "transparent",
//     border: "none",
//     outline: "none",
//     fontSize: 15,
//     fontFamily: "inherit",
//     marginLeft:"-10px",
//   },

//   select: {
//     width: "100%",
//     background: "transparent",
//     border: "none",
//     outline: "none",
//     fontSize: 15,
//   },

//   chipWrap: {
//     display: "flex",
//     flexWrap: "wrap",
//     gap: 8,
//   },

//   chip: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     padding: "6px 12px",
//     borderRadius: 20,
//     border: "1px solid #D5D5D5",
//     backgroundColor: "#fff",
//     fontSize: 13,
//   },

//   chipClose: {
//     background: "none",
//     border: "none",
//     cursor: "pointer",
//     fontSize: 16,
//     marginLeft: 2,
//   },

//   budgetRow: {
//     display: "flex",

//   },

//   dateRow: {
//     display: "flex",
//     gap: 12,
//   },

//   btnRow: {
//     display: "flex",
//     gap: 16,
//     marginLeft: "400px",
//   },

//   cancelBtn: {
//     flex: 1,
//     border: "2px solid #7C3CFF",
//     background: "#fff",
//     color: "#7C3CFF",
//     borderRadius: 25,
//     padding: "12px 0",
//     fontSize: 15,
//     fontWeight: 600,
//     cursor: "pointer",
//     marginLeft:"-340px",

//   },

//   submitBtn: {
//     flex: 1,
//     border: "none",
//     background: "#7C3CFF",
//     color: "#fff",
//     borderRadius: 25,
//     padding: "12px 0",
//     fontSize: 15,
//     fontWeight: 600,
//     cursor: "pointer",
//   },

//   sp10: { height: 10 },
//   sp20: { height: 10 },
//   sp25: { height: 25 },
//   sp30: { height: 30 },
// };






// frontend/src/firebaseClientScreen/Postjob/PostJobScreen.jsx
// ❤️ UI upgraded — Backend untouched

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import backarrow from "../../assets/backarrow.png"
// 🔹 UPDATE THIS PATH TO MATCH YOUR PROJECT
import { db } from "../../firbase/Firebase";

export default function PostJobScreen(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const routeState = location.state || {};
  const jobIdProp = props.jobId || routeState.jobId || routeState.job_id || null;
  const jobDataProp = props.jobData || routeState.jobData || null;

  // -------------------- STATE -------------------- //
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budgetFrom, setBudgetFrom] = useState("");
  const [budgetTo, setBudgetTo] = useState("");
  const [sampleProjectUrl, setSampleProjectUrl] = useState("");
  const [freelancerRequirements, setFreelancerRequirements] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTimeline, setSelectedTimeline] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [selectedTab, setSelectedTab] = useState("Works");

  const [isSaving, setIsSaving] = useState(false);

  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedTool, setSelectedTool] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);

  // -------------------- CONSTANTS (UNMODIFIED) -------------------- //
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
  const timelines = ["1-30 days", "1-3 months", "3-6 months", "6+ months"];

  // -------------------- PREFILL WHEN EDITING -------------------- //
  useEffect(() => {
    if (!jobDataProp) return;

    setTitle(jobDataProp.title || "");
    setDescription(jobDataProp.description || "");
    setBudgetFrom(jobDataProp.budget_from || "");
    setBudgetTo(jobDataProp.budget_to || "");
    setSampleProjectUrl(jobDataProp.sample_project_url || "");
    setFreelancerRequirements(jobDataProp.freelancer_requirements || "");

    setSelectedCategory(jobDataProp.category || "");
    setSelectedTimeline(jobDataProp.timeline || "");

    setSelectedSkills(Array.isArray(jobDataProp.skills) ? jobDataProp.skills : []);
    setSelectedTools(Array.isArray(jobDataProp.tools) ? jobDataProp.tools : []);

    if (jobDataProp.startDateTime && jobDataProp.startDateTime.toDate) {
      const d = jobDataProp.startDateTime.toDate();
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const hh = String(d.getHours()).padStart(2, "0");
      const min = String(d.getMinutes()).padStart(2, "0");

      setSelectedTimeline(`${yyyy}-${mm}-${dd}`);
      setSelectedTime(`${hh}:${min}`);
      setSelectedTab("24 hours");
    }
  }, [jobDataProp]);

  // -------------------- HELPERS -------------------- //
  const showError = (msg) => {
    setIsSaving(false);
    alert(msg);
  };

  const handleSave = async () => {
    if (!currentUser) return showError("User not logged in");

    setIsSaving(true);

    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();

    if (trimmedTitle.split(" ").length < 2) return showError("Title must have at least 2 words");
    if (trimmedDesc.split(" ").length < 40) return showError("Description must have at least 40 words");
    if (!selectedCategory) return showError("Please select a category");
    if (selectedSkills.length < 3) return showError("Please select at least 3 skills");
    if (selectedTools.length < 3) return showError("Please select at least 3 tools");
    if (!budgetFrom || !budgetTo) return showError("Please enter budget range");

    try {
      const collectionName = selectedTab === "24 hours" ? "jobs_24h" : "jobs";
      const jobsRef = collection(db, collectionName);

      let jobPayload = {
        userId: currentUser.uid,
        title: trimmedTitle,
        description: trimmedDesc,
        category: selectedCategory || null,
        skills: selectedSkills,
        tools: selectedTools,
        budget_from: budgetFrom,
        budget_to: budgetTo,
        sample_project_url: sampleProjectUrl.trim(),
        freelancer_requirements: freelancerRequirements.trim(),
        updated_at: serverTimestamp(),
      };

      if (selectedTab === "Works") {
        if (!selectedTimeline) return showError("Please select a timeline");
        jobPayload.timeline = selectedTimeline;
      }

      if (selectedTab === "24 hours") {
        if (!selectedTimeline || !selectedTime) return showError("Select date & time correctly");

        const [yyyy, mm, dd] = selectedTimeline.split("-");
        const [hh, min] = selectedTime.split(":");
        jobPayload.startDateTime = Timestamp.fromDate(
          new Date(yyyy, mm - 1, dd, hh, min, 0)
        );
      }

      if (jobIdProp && jobDataProp) {
        await updateDoc(doc(db, collectionName, jobIdProp), jobPayload);
        alert("Job updated successfully");
      } else {
        const docRef = await addDoc(jobsRef, {
          ...jobPayload,
          views: 0,
          created_at: serverTimestamp(),
          viewedBy: [],
        });
        await updateDoc(docRef, { id: docRef.id });
        alert("Job posted successfully");
      }

      navigate(-1);
    } catch (err) {
      console.error(err);
      showError(`Error saving job: ${err}`);
    } finally {
      setIsSaving(false);
    }
  };

  // ---------------------- UI HELPERS ---------------------- //

  const renderLabel = (txt) => <div style={styles.label}>{txt}</div>;

  const renderYellowInput = ({ value, onChange, placeholder, multiline, type = "text" }) => (
    <div style={styles.yellowField}>
      {multiline ? (
        <textarea
          style={styles.input}
          rows={4}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          style={styles.input}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );

  const renderDropdown = ({ value, onChange, placeholder, options }) => (
    <div style={styles.yellowField}>
      <select
        style={styles.select}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );

  const renderChips = (items, type) => (
    <div style={styles.chipWrap}>
      {items.map((item) => (
        <div key={item} style={styles.chip}>
          {item}
          <button
            style={styles.chipClose}
            onClick={() => {
              if (type === "skills") setSelectedSkills(selectedSkills.filter((s) => s !== item));
              else setSelectedTools(selectedTools.filter((t) => t !== item));
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );

  // ---------------------- RENDER UI ---------------------- //

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* BACK ARROW + HEADING */}
        <div style={styles.headerRow}>
          <div style={styles.backbtn} onClick={() => navigate(-1)} aria-label="Back">
            <img src={backarrow} alt="back arrow" height={20} />
          </div>

          <div>
            <div style={styles.heading}>Job Proposal</div>
            <div style={styles.subheading}>
              Turn your ideas into action — post your job today.
            </div>
          </div>
        </div>

        {/* TOGGLE BUTTONS */}
        <div style={styles.toggleBar}>
          <div style={styles.toggleRow}>
            <button
              style={{
                ...styles.toggleButton,
                backgroundColor: selectedTab === "Works" ? "#fff" : "transparent",
                color: selectedTab === "Works" ? "#000" : "#000",
              }}
              onClick={() => setSelectedTab("Works")}
            >
              Work
            </button>

            <button
              style={{
                ...styles.toggleButton,
                backgroundColor: selectedTab === "24 hours" ? "#fff" : "transparent",
                color: selectedTab === "24 hours" ? "#000" : "#000",
              }}
              onClick={() => setSelectedTab("24 hours")}
            >
              24 hours
            </button>
          </div>
        </div>

        {/* DIVIDER */}
        <div style={styles.divider} />

        {/* FORM */}
        <div>

          {renderLabel("Job Title")}
          {renderYellowInput({
            value: title,
            onChange: setTitle,
            placeholder: "e.g. Logo Design That Pops and Defines Your Brand",
          })}

          <div style={styles.sp20} />

          {renderLabel("Description")}
          {renderYellowInput({
            value: description,
            onChange: setDescription,
            multiline: true,
            placeholder: "Describe your service and showcase your uniqueness",
          })}

          <div style={styles.sp20} />

          {renderLabel("Category")}
          {renderDropdown({
            value: selectedCategory,
            onChange: setSelectedCategory,
            placeholder: "Select Category",
            options: Object.keys(expertiseOptions),
          })}

          <div style={styles.sp20} />

          {renderLabel("Skills")}
          {renderChips(selectedSkills, "skills")}
          <div style={styles.sp10} />

          {renderDropdown({
            value: selectedSkill,
            onChange: (v) => {
              setSelectedSkill(v);
              if (!selectedSkills.includes(v) && selectedSkills.length < 3)
                setSelectedSkills([...selectedSkills, v]);
            },
            placeholder: "Add Skills",
            options: skillOptions,
          })}

          <div style={styles.sp20} />

          {renderLabel("Tools")}
          {renderChips(selectedTools, "tools")}
          <div style={styles.sp10} />

          {renderDropdown({
            value: selectedTool,
            onChange: (v) => {
              setSelectedTool(v);
              if (!selectedTools.includes(v) && selectedTools.length < 5)
                setSelectedTools([...selectedTools, v]);
            },
            placeholder: "Add Tools",
            options: toolOptions,
          })}

          <div style={styles.sp20} />

          {renderLabel("Budget Range")}
          <div style={styles.budgetRow}>
            {renderYellowInput({
              value: budgetFrom,
              onChange: setBudgetFrom,
              type: "number",
              placeholder: "₹ Min",
            })}
            <div style={{ width: 12 }} />
            {renderYellowInput({
              value: budgetTo,
              onChange: setBudgetTo,
              type: "number",
              placeholder: "₹ Max",
            })}
          </div>

          <div style={styles.sp20} />

          {selectedTab === "Works" ? (
            <>
              {renderLabel("Timeline")}
              {renderDropdown({
                value: selectedTimeline,
                onChange: setSelectedTimeline,
                placeholder: "Select Timeline",
                options: timelines,
              })}
            </>
          ) : (
            <div style={styles.dateRow}>
              <div style={{ width: "50%" }}>
                {renderLabel("Start Date")}
                <div style={styles.yellowField}>
                  <input
                    type="date"
                    style={styles.input}
                    value={selectedTimeline}
                    onChange={(e) => setSelectedTimeline(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ width: "50%" }}>
                {renderLabel("Time")}
                <div style={styles.yellowField}>
                  <input
                    type="time"
                    style={styles.input}
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <div style={styles.sp25} />

          {renderLabel("Sample Projects")}
          {renderYellowInput({
            value: sampleProjectUrl,
            onChange: setSampleProjectUrl,
            placeholder: "URL",
          })}

          <div style={styles.sp20} />

          {renderLabel("Freelancers Requirements (Optional)")}
          {renderYellowInput({
            value: freelancerRequirements,
            onChange: setFreelancerRequirements,
            placeholder: "Describe what you need and specific details",
            multiline: true,
          })}

          <div style={styles.sp30} />

          {/* BUTTONS */}
          <div style={styles.btnRow}>
  <button style={styles.cancelBtn} onClick={() => navigate(-1)}>
    Cancel
  </button>

  <button
    style={{
      ...styles.submitBtn,
      opacity: isSaving ? 0.7 : 1,
    }}
    onClick={handleSave}
  >
    {isSaving ? "Saving..." : "Submit"}
  </button>
</div>


          <div style={{ height: 40 }} />
        </div>
      </div>
    </div>
  );
}

// ---------------------- INLINE CSS ---------------------- //

const styles = {
  page: {
    width: "100%",
    minHeight: "100vh",

    display: "flex",
    justifyContent: "center",
    padding: "40px 0",

    backgroundColor: "#FFFFFF",
    minHeight: "100vh",
    fontFamily:
      "'Rubik', Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",



  },

  card: {
    width: "100%",
    maxWidth: 640,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 28,
    boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
  },

  headerRow: {
    display: "flex",
    alignItems: "flex-start",
    marginBottom: 20,
    gap: 12,
  },

   backbtn: {
    width: "36px",
    height: "36px",
    borderRadius: "14px",
    border: "0.8px solid #ccc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "20px",
    opacity: 1,
    flexShrink: 0,
    marginBottom: "18px",
  },

  heading: {
    fontSize: 26,
    fontWeight: 700,
    marginBottom: 4,
  },

  subheading: {
    color: "#666",
    fontSize: 14,
  },
  toggleBar: {
    display: "flex",
    justifyContent: "left",
    alignItems: "center",
    backgroundColor: "#FFFCD1",
    borderRadius: 30,
    padding: 8,
    gap: 20,
    marginTop: 10,
  },

  toggleRow: {
    display: "flex",
    gap: 8,
    marginTop: 2,
  },

  toggleButton: {
    width: 100,        // 🔹 decreased width
    padding: "6px 0px ",
    borderRadius: 20,
    border: "none",
    backgroundColor: "transparent",
    color: "#000",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "0.2s",
  },
  //   toggleActive: {
  //   backgroundColor: "fff",
  //   color: "000",
  //   borderRadius: 20,
  // },

  divider: {
    height: 1,
    backgroundColor: "#E8E8E8",
    margin: "25px 0",
  },

  label: {
    fontSize: 15,
    fontWeight: 600,
    marginBottom: 6,
    color: "#333",
  },

  yellowField: {
    backgroundColor: "#FFFCD1",
    borderRadius: 12,
    border: "1px solid #E6E4A9",
    padding: "10px 10px",
  },

  input: {
    width: "100%",
    background: "transparent",
    border: "none",
    outline: "none",
    fontSize: 15,
    fontFamily: "inherit",
    marginLeft:"-10px",
  },

  select: {
    width: "100%",
    background: "transparent",
    border: "none",
    outline: "none",
    fontSize: 15,
  },

  chipWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },

  chip: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    borderRadius: 20,
    border: "1px solid #D5D5D5",
    backgroundColor: "#fff",
    fontSize: 13,
  },

  chipClose: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    marginLeft: 2,
  },

  budgetRow: {
    display: "flex",

  },

  dateRow: {
    display: "flex",
    gap: 12,
  },
btnRow: {
  display: "flex",
  gap: 16,
  justifyContent: "flex-end",
  alignItems: "center",
  flexWrap: "wrap",
},

cancelBtn: {
  minWidth: 140,
  border: "2px solid #7C3CFF",
  background: "#fff",
  color: "#7C3CFF",
  borderRadius: 25,
  padding: "12px 24px",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
},

submitBtn: {
  minWidth: 160,
  border: "none",
  background: "#7C3CFF",
  color: "#fff",
  borderRadius: 25,
  padding: "12px 24px",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
},

  sp10: { height: 10 },
  sp20: { height: 10 },
  sp25: { height: 25 },
  sp30: { height: 30 },
};