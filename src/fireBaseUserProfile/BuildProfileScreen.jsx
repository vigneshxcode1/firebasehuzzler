






// // BuildProfileScreenWithEdit.jsx
// import React, { useState, useEffect } from "react";
// import { getAuth } from "firebase/auth";
// import {
//   getFirestore,
//   doc,
//   getDoc,
//   setDoc,
//   collection,
//   query,
//   orderBy,
//   onSnapshot,
//   updateDoc,
//   deleteDoc,
// } from "firebase/firestore";
// import {
//   Button,
//   TextField,
//   Box,
//   Typography,
//   IconButton,
//   Autocomplete,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";
// import { FiEdit2, FiTrash2 } from "react-icons/fi";
// import AddPortfolioPopup from "../Firebaseaddporfoilo/AddPortfolioPopup.jsx";

// export default function BuildProfileScreen() {
//   const auth = getAuth();
//   const db = getFirestore();
//   const user = auth.currentUser;

//   // ⭐ 1) SIDEBAR COLLAPSED STATE
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   // ⭐ 2) LISTEN FOR SIDEBAR TOGGLE EVENT
//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   // USER DATA
//   const [profileData, setProfileData] = useState({
//     firstName: "",
//     lastName: "",
//     title: "",
//     about: "",
//     skills: [],
//     tools: [],
//     profileImage: "",
//     location: "",
//   });

//   const [portfolio, setPortfolio] = useState([]);
//   const [isPortfolioPopupOpen, setIsPortfolioPopupOpen] = useState(false);

//   const [editingAbout, setEditingAbout] = useState(false);
//   const [editingSkillsTools, setEditingSkillsTools] = useState(false);

//   const [tempAbout, setTempAbout] = useState("");
//   const [tempSkills, setTempSkills] = useState([]);
//   const [tempTools, setTempTools] = useState([]);

//   const [editingPortfolio, setEditingPortfolio] = useState(null);
//   const [isEditOpen, setIsEditOpen] = useState(false);

//   const skillOptions = ["React", "Node", "Flutter", "Figma", "UI/UX"];
//   const toolOptions = ["VSCode", "Figma", "Git", "Photoshop", "Canva"];

//   // FETCH USER DATA + PORTFOLIO
//   useEffect(() => {
//     if (!user) return;

//     const userRef = doc(db, "users", user.uid);

//     getDoc(userRef).then((snap) => {
//       if (snap.exists()) setProfileData((prev) => ({ ...prev, ...snap.data() }));
//     });

//     const q = query(
//       collection(db, "users", user.uid, "portfolio"),
//       orderBy("createdAt", "desc")
//     );

//     const unsub = onSnapshot(q, (snap) => {
//       setPortfolio(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//     });

//     return () => unsub();
//   }, [user]);

//   const updateField = async (field, value) => {
//     if (!user) return;
//     const userRef = doc(db, "users", user.uid);
//     await setDoc(userRef, { [field]: value }, { merge: true });
//     setProfileData((prev) => ({ ...prev, [field]: value }));
//   };

//   const LaunchURL = (url) => url && window.open(url, "_blank");

//   // ABOUT EDIT HANDLERS
//   const startEditAbout = () => {
//     setTempAbout(profileData.about || "");
//     setEditingAbout(true);
//     setEditingSkillsTools(false);
//   };
//   const cancelEditAbout = () => setEditingAbout(false);
//   const saveEditAbout = async () => {
//     await updateField("about", tempAbout);
//     setEditingAbout(false);
//   };

//   // SKILLS/TOOLS EDIT HANDLERS
//   const startEditSkillsTools = () => {
//     setTempSkills([...profileData.skills]);
//     setTempTools([...profileData.tools]);
//     setEditingSkillsTools(true);
//     setEditingAbout(false);
//   };
//   const cancelEditSkillsTools = () => setEditingSkillsTools(false);
//   const saveEditSkillsTools = async () => {
//     await updateField("skills", tempSkills);
//     await updateField("tools", tempTools);
//     setEditingSkillsTools(false);
//   };

//   // PORTFOLIO EDIT
//   const handleOpenEdit = (p, e) => {
//     e.stopPropagation();
//     setEditingPortfolio(p);
//     setIsEditOpen(true);
//   };

//   const handleDelete = async (p, e) => {
//     e.stopPropagation();
//     await deleteDoc(doc(db, "users", user.uid, "portfolio", p.id));
//   };

//   const handleSaveEdit = async (updated) => {
//     const ref = doc(db, "users", user.uid, "portfolio", updated.id);
//     const toUpdate = { ...updated };
//     delete toUpdate.id;
//     await updateDoc(ref, toUpdate);
//     setIsEditOpen(false);
//     setEditingPortfolio(null);
//   };

//   // ⭐ 3) ENTIRE UI WRAPPED INSIDE SIDEBAR MARGIN CONTAINER
//   return (
//     <div
//       className="freelance-wrapper"
//       style={{
//         marginLeft: collapsed ? "-90px" : "130px",
//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       <Box
//         sx={{
//           width: "100%",
//           minHeight: "100vh",
//           bgcolor: "#F5F6FA",
//           pb: 10,
//           overflowX: "hidden",
//         }}
//       >
//         {/* -------------------------------------------------- */}
//         {/* 🔥 TOP SUMMARY */}
//         {/* -------------------------------------------------- */}
//         <Box
//           sx={{
//             background: "linear-gradient(90deg, #f8ffb0, #e3ffd9)",
//             borderRadius: 3,
//             p: 4,
//             mb: 6,
//             display: "flex",
//             alignItems: "center",
//             gap: 3,
//             position: "relative",
//           }}
//         >
//           <img
//             src={profileData.profileImage || "/user-placeholder.jpg"}
//             alt="profile"
//             style={{
//               width: 95,
//               height: 95,
//               borderRadius: "50%",
//               border: "4px solid white",
//               objectFit: "cover",
//             }}
//           />

//           <Box>
//             <Typography sx={{ fontSize: 24, fontWeight: 700 }}>
//               {profileData.firstName} {profileData.lastName}
//             </Typography>

//             <Typography sx={{ color: "gray", fontSize: 15 }}>
//               {profileData.location}
//             </Typography>

//             <Typography
//               sx={{
//                 mt: 1,
//                 display: "inline-block",
//                 bgcolor: "#b6fab2",
//                 px: 2,
//                 py: 0.5,
//                 borderRadius: 1,
//                 fontWeight: 600,
//                 fontSize: 14,
//               }}
//             >
//               {profileData.title}
//             </Typography>
//           </Box>

//           <Button
//             variant="contained"
//             sx={{
//               position: "absolute",
//               right: 20,
//               top: 20,
//               borderRadius: 4,
//               textTransform: "none",
//             }}
//           >
//             Edit Profile
//           </Button>
//         </Box>

//         {/* -------------------------------------------------- */}
//         {/* 🔥 ABOUT + SKILLS COLUMN */}
//         {/* -------------------------------------------------- */}
//         <Box
//           sx={{
//             display: "flex",
//             flexWrap: "wrap",
//             gap: 3,
//             px: 1,
//             mb: 4,
//           }}
//         >
//           {/* ABOUT CARD */}
//           <Box
//             sx={{
//               background: "#fff",
//               borderRadius: "14px",
//               p: 3,
//               flex: "2 1 600px",
//               minWidth: 300,
//               position: "relative",
//               boxShadow: "0 8px 20px rgba(12,20,31,0.06)",
//             }}
//           >
//             <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 1 }}>
//               About
//             </Typography>

//             <IconButton
//               sx={{ position: "absolute", right: 12, top: 12 }}
//               onClick={startEditAbout}
//             >
//               <FiEdit2 />
//             </IconButton>

//             <Typography sx={{ color: "#444", lineHeight: 1.6 }}>
//               {profileData.about || "Add a short description about yourself."}
//             </Typography>

//             {editingAbout && (
//               <Box sx={{ mt: 2 }}>
//                 <TextField
//                   fullWidth
//                   multiline
//                   rows={4}
//                   value={tempAbout}
//                   onChange={(e) => setTempAbout(e.target.value)}
//                 />

//                 <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
//                   <Button variant="contained" onClick={saveEditAbout}>
//                     Save
//                   </Button>
//                   <Button variant="outlined" onClick={cancelEditAbout}>
//                     Cancel
//                   </Button>
//                 </Box>
//               </Box>
//             )}
//           </Box>

//           {/* SKILLS + TOOLS CARD */}
//           <Box
//             sx={{
//               background: "#fff",
//               borderRadius: "14px",
//               p: 3,
//               flex: "1 1 300px",
//               minWidth: 300,
//               boxShadow: "0 8px 20px rgba(12,20,31,0.06)",
//               position: "relative",
//             }}
//           >
//             <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
//               Skills & Tools
//             </Typography>

//             <IconButton
//               sx={{ position: "absolute", right: 12, top: 12 }}
//               onClick={startEditSkillsTools}
//             >
//               <FiEdit2 />
//             </IconButton>

//             {/* SKILLS LIST */}
//             <Typography sx={{ fontWeight: 700, mt: 2 }}>Skills</Typography>
//             <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
//               {profileData.skills.map((s, i) => (
//                 <Box
//                   key={i}
//                   sx={{
//                     px: 1.5,
//                     py: 0.6,
//                     borderRadius: "10px",
//                     bgcolor: "#FFF8D9",
//                     fontSize: 13,
//                     fontWeight: 600,
//                   }}
//                 >
//                   {s}
//                 </Box>
//               ))}
//             </Box>

//             {/* TOOLS LIST */}
//             <Typography sx={{ fontWeight: 700, mt: 2 }}>Tools</Typography>
//             <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
//               {profileData.tools.map((t, i) => (
//                 <Box
//                   key={i}
//                   sx={{
//                     px: 1.5,
//                     py: 0.6,
//                     borderRadius: "10px",
//                     bgcolor: "#E8F8FF",
//                     fontSize: 13,
//                     fontWeight: 600,
//                   }}
//                 >
//                   {t}
//                 </Box>
//               ))}
//             </Box>

//             {editingSkillsTools && (
//               <Box sx={{ mt: 2 }}>
//                 <Autocomplete
//                   multiple
//                   freeSolo
//                   options={skillOptions}
//                   value={tempSkills}
//                   onChange={(e, v) => setTempSkills(v)}
//                   renderInput={(params) => (
//                     <TextField {...params} label="Edit skills" />
//                   )}
//                 />

//                 <Autocomplete
//                   multiple
//                   freeSolo
//                   options={toolOptions}
//                   value={tempTools}
//                   onChange={(e, v) => setTempTools(v)}
//                   renderInput={(params) => (
//                     <TextField {...params} label="Edit tools" />
//                   )}
//                 />

//                 <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
//                   <Button variant="contained" onClick={saveEditSkillsTools}>
//                     Save
//                   </Button>
//                   <Button variant="outlined" onClick={cancelEditSkillsTools}>
//                     Cancel
//                   </Button>
//                 </Box>
//               </Box>
//             )}
//           </Box>
//         </Box>

//         {/* -------------------------------------------------- */}
//         {/* 🔥 PORTFOLIO SECTION */}
//         {/* -------------------------------------------------- */}
//         <Box sx={{ bgcolor: "#fff", borderRadius: 3, p: 3 }}>
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               mb: 2,
//             }}
//           >
//             <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
//               Portfolio
//             </Typography>

//             <Button
//               variant="contained"
//               size="small"
//               sx={{ borderRadius: 4 }}
//               onClick={() => setIsPortfolioPopupOpen(true)}
//             >
//               Add Portfolio
//             </Button>
//           </Box>

//           <Box
//             sx={{
//               display: "flex",
//               gap: 2,
//               overflowX: "auto",
//               pb: 2,
//             }}
//           >
//             {portfolio.map((p) => (
//               <Box
//                 key={p.id}
//                 sx={{
//                   width: 300,
//                   flexShrink: 0,
//                   background: "#00c2e8",
//                   borderRadius: 2,
//                   overflow: "hidden",
//                   position: "relative",
//                 }}
//                 onClick={() => LaunchURL(p.projectUrl)}
//               >
//                 <img
//                   src={p.imageUrl || "/placeholder.jpg"}
//                   alt=""
//                   style={{ width: "100%", height: 150, objectFit: "cover" }}
//                 />

//                 <Box
//                   sx={{
//                     background: "#fff",
//                     p: 2,
//                     position: "relative",
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       position: "absolute",
//                       right: 8,
//                       top: 8,
//                       display: "flex",
//                       gap: 1,
//                     }}
//                   >
//                     <IconButton
//                       size="small"
//                       onClick={(e) => handleOpenEdit(p, e)}
//                     >
//                       <FiEdit2 />
//                     </IconButton>

//                     <IconButton
//                       size="small"
//                       onClick={(e) => handleDelete(p, e)}
//                     >
//                       <FiTrash2 color="red" />
//                     </IconButton>
//                   </Box>

//                   <Typography sx={{ fontWeight: 700 }}>{p.title}</Typography>

//                   <Typography sx={{ fontSize: 13, mt: 1 }}>
//                     {p.description}
//                   </Typography>

//                   <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
//                     {(p.skills || []).map((s) => (
//                       <Box
//                         key={s}
//                         sx={{
//                           px: 1,
//                           py: 0.5,
//                           bgcolor: "#FFF8D9",
//                           borderRadius: 10,
//                           fontSize: 12,
//                         }}
//                       >
//                         {s}
//                       </Box>
//                     ))}
//                     {(p.tools || []).map((t) => (
//                       <Box
//                         key={t}
//                         sx={{
//                           px: 1,
//                           py: 0.5,
//                           bgcolor: "#E8F8FF",
//                           borderRadius: 10,
//                           fontSize: 12,
//                         }}
//                       >
//                         {t}
//                       </Box>
//                     ))}
//                   </Box>
//                 </Box>
//               </Box>
//             ))}
//           </Box>
//         </Box>

//         {/* ADD POPUP */}
//         <AddPortfolioPopup
//           open={isPortfolioPopupOpen}
//           onClose={() => setIsPortfolioPopupOpen(false)}
//           portfolio={null}
//         />

//         {/* EDIT POPUP */}
//         {isEditOpen && editingPortfolio && (
//           <EditPortfolioPopup
//             open={isEditOpen}
//             onClose={() => {
//               setIsEditOpen(false);
//               setEditingPortfolio(null);
//             }}
//             portfolio={editingPortfolio}
//             onSave={handleSaveEdit}
//           />
//         )}
//       </Box>
//     </div>
//   );
// }

// /* --------------------------------------------------
//     EDIT PORTFOLIO POPUP
// -------------------------------------------------- */
// function EditPortfolioPopup({ open, onClose, portfolio, onSave }) {
//   const [title, setTitle] = useState(portfolio.title || "");
//   const [description, setDescription] = useState(portfolio.description || "");
//   const [projectUrl, setProjectUrl] = useState(portfolio.projectUrl || "");
//   const [imageUrl, setImageUrl] = useState(portfolio.imageUrl || "");
//   const [skillsText, setSkillsText] = useState(
//     (portfolio.skills || []).join(", ")
//   );
//   const [toolsText, setToolsText] = useState(
//     (portfolio.tools || []).join(", ")
//   );

//   const handleSave = () => {
//     const skills = skillsText.split(",").map((s) => s.trim()).filter(Boolean);
//     const tools = toolsText.split(",").map((t) => t.trim()).filter(Boolean);

//     const updated = {
//       id: portfolio.id,
//       title,
//       description,
//       projectUrl,
//       imageUrl,
//       skills,
//       tools,
//     };

//     onSave(updated);
//   };

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//       <DialogTitle>Edit Portfolio</DialogTitle>

//       <DialogContent>
//         <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
//           <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />

//           <TextField
//             label="Description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             fullWidth multiline rows={4}
//           />

//           <TextField
//             label="Project URL"
//             value={projectUrl}
//             onChange={(e) => setProjectUrl(e.target.value)}
//             fullWidth
//           />

//           <TextField
//             label="Image URL"
//             value={imageUrl}
//             onChange={(e) => setImageUrl(e.target.value)}
//             fullWidth
//           />

//           <TextField
//             label="Skills (comma separated)"
//             value={skillsText}
//             onChange={(e) => setSkillsText(e.target.value)}
//             fullWidth
//           />

//           <TextField
//             label="Tools (comma separated)"
//             value={toolsText}
//             onChange={(e) => setToolsText(e.target.value)}
//             fullWidth
//           />
//         </Box>
//       </DialogContent>

//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>

//         <Button variant="contained" onClick={handleSave}>
//           Save
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }




















// // BuildProfileScreenWithEdit.jsx
// import React, { useState, useEffect } from "react";
// import { getAuth } from "firebase/auth";
// import {
//   getFirestore,
//   doc,
//   getDoc,
//   setDoc,
//   collection,
//   query,
//   orderBy,
//   onSnapshot,
//   updateDoc,
//   deleteDoc,
// } from "firebase/firestore";
// import {
//   Button,
//   TextField,
//   Box,
//   Typography,
//   IconButton,
//   Autocomplete,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";
// import { FiEdit2, FiTrash2 } from "react-icons/fi";
// import AddPortfolioPopup from "../Firebaseaddporfoilo/AddPortfolioPopup.jsx";

// export default function BuildProfileScreen() {
//   const auth = getAuth();
//   const db = getFirestore();
//   const user = auth.currentUser;

//   const [profileData, setProfileData] = useState({
//     firstName: "",
//     lastName: "",
//     title: "",
//     about: "",
//     skills: [],
//     tools: [],
//     profileImage: "",
//     location: "",
//   });

//   const [portfolio, setPortfolio] = useState([]);
//   const [isPortfolioPopupOpen, setIsPortfolioPopupOpen] = useState(false);

//   // Inline edit states (Option B)
//   const [editingAbout, setEditingAbout] = useState(false);
//   const [editingSkillsTools, setEditingSkillsTools] = useState(false);

//   const [tempAbout, setTempAbout] = useState("");
//   const [tempSkills, setTempSkills] = useState([]);
//   const [tempTools, setTempTools] = useState([]);

//   // Edit portfolio popup state
//   const [editingPortfolio, setEditingPortfolio] = useState(null);
//   const [isEditOpen, setIsEditOpen] = useState(false);

//   const skillOptions = ["React", "Node", "Flutter", "Figma", "UI/UX"];
//   const toolOptions = ["VSCode", "Figma", "Git", "Photoshop", "Canva"];

//   useEffect(() => {
//     if (!user) return;
//     const userRef = doc(db, "users", user.uid);
//     getDoc(userRef).then((snap) => {
//       if (snap.exists()) setProfileData((prev) => ({ ...prev, ...snap.data() }));
//     });

//     const q = query(
//       collection(db, "users", user.uid, "portfolio"),
//       orderBy("createdAt", "desc")
//     );
//     const unsub = onSnapshot(q, (snap) => {
//       setPortfolio(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//     });

//     return () => unsub();
//   }, [user]);

//   const updateField = async (field, value) => {
//     if (!user) return;
//     const userRef = doc(db, "users", user.uid);
//     await setDoc(userRef, { [field]: value }, { merge: true });
//     setProfileData((prev) => ({ ...prev, [field]: value }));
//   };

//   const LaunchURL = (url) => url && window.open(url, "_blank");

//   // Inline about handlers
//   const startEditAbout = () => {
//     setTempAbout(profileData.about || "");
//     setEditingAbout(true);
//     setEditingSkillsTools(false);
//   };
//   const cancelEditAbout = () => {
//     setTempAbout("");
//     setEditingAbout(false);
//   };
//   const saveEditAbout = async () => {
//     await updateField("about", tempAbout);
//     setTempAbout("");
//     setEditingAbout(false);
//   };

//   // Inline skills/tools handlers
//   const startEditSkillsTools = () => {
//     setTempSkills(Array.isArray(profileData.skills) ? profileData.skills : []);
//     setTempTools(Array.isArray(profileData.tools) ? profileData.tools : []);
//     setEditingSkillsTools(true);
//     setEditingAbout(false);
//   };
//   const cancelEditSkillsTools = () => {
//     setTempSkills([]);
//     setTempTools([]);
//     setEditingSkillsTools(false);
//   };
//   const saveEditSkillsTools = async () => {
//     await updateField("skills", tempSkills || []);
//     await updateField("tools", tempTools || []);
//     setTempSkills([]);
//     setTempTools([]);
//     setEditingSkillsTools(false);
//   };

//   // Open edit popup for a portfolio item
//   const handleOpenEdit = (p, e) => {
//     // prevent parent card click
//     if (e && e.stopPropagation) e.stopPropagation();
//     setEditingPortfolio(p);
//     setIsEditOpen(true);
//   };

//   // Delete portfolio item
//   const handleDelete = async (p, e) => {
//     if (e && e.stopPropagation) e.stopPropagation();
//     try {
//       const ok = window.confirm("Delete this portfolio item? This cannot be undone.");
//       if (!ok) return;
//       await deleteDoc(doc(db, "users", user.uid, "portfolio", p.id));
//       // onSnapshot will remove it automatically
//       alert("Deleted");
//     } catch (err) {
//       console.error("Delete failed:", err);
//       alert("Delete failed");
//     }
//   };

//   // Save from edit popup
//   const handleSaveEdit = async (updated) => {
//     try {
//       const ref = doc(db, "users", user.uid, "portfolio", updated.id);
//       // ensure we don't remove createdAt etc. Only update fields from updated object
//       const toUpdate = { ...updated };
//       delete toUpdate.id;
//       await updateDoc(ref, toUpdate);
//       setIsEditOpen(false);
//       setEditingPortfolio(null);
//       alert("Portfolio updated");
//     } catch (err) {
//       console.error("Update failed:", err);
//       alert("Update failed");
//     }
//   };

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         minHeight: "100vh",
//         bgcolor: "#F5F6FA",
//         pb: 10,
//         overflowX: "hidden",
//       }}
//     >
//       {/* TOP SUMMARY */}
//       <Box
//         sx={{
//           background: "linear-gradient(90deg, #f8ffb0, #e3ffd9)",
//           borderRadius: 3,
//           p: 4,
//           mb: 6,
//           display: "flex",
//           alignItems: "center",
//           gap: 3,
//           position: "relative",
//         }}
//       >
//         <img
//           src={profileData.profileImage || "/user-placeholder.jpg"}
//           alt="profile"
//           style={{
//             width: 95,
//             height: 95,
//             borderRadius: "50%",
//             border: "4px solid white",
//             objectFit: "cover",
//           }}
//         />

//         <Box>
//           <Typography sx={{ fontSize: 24, fontWeight: 700 }}>
//             {profileData.firstName} {profileData.lastName}
//           </Typography>
//           <Typography sx={{ color: "gray", fontSize: 15 }}>{profileData.location}</Typography>
//           <Typography
//             sx={{
//               mt: 1,
//               display: "inline-block",
//               bgcolor: "#b6fab2",
//               px: 2,
//               py: 0.5,
//               borderRadius: 1,
//               fontWeight: 600,
//               fontSize: 14,
//             }}
//           >
//             {profileData.title}
//           </Typography>
//         </Box>

//         <Button
//           variant="contained"
//           sx={{ position: "absolute", right: 20, top: 20, borderRadius: 4, textTransform: "none" }}
//         >
//           Edit Profile
//         </Button>
//       </Box>

//       {/* MAIN ROW */}
//       <Box
//         sx={{
//           display: "flex",
//           flexWrap: "wrap",
//           gap: 3,
//           alignItems: "flex-start",
//           mb: 4,
//           px: 1,
//           width: "100%",
//           boxSizing: "border-box",
//         }}
//       >
//         {/* ABOUT CARD */}
//         <Box
//           sx={{
  

//             borderRadius: "14px",
//             p: 3,
//             flex: "2 1 600px",
//             minWidth: 300,
//             boxShadow: "0 8px 20px rgba(12,20,31,0.06)",
//             position: "relative",
//             boxSizing: "border-box",
//           }}
//         >
//           <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 1 }}>About</Typography>
//           <IconButton
//             sx={{ position: "absolute", right: 12, top: 12 }}
//             onClick={startEditAbout}
//             aria-label="edit about"
//           >
//             <FiEdit2 />
//           </IconButton>

//           <Typography sx={{ color: "#444", lineHeight: 1.6 }}>
//             {profileData.about || "Add a short description about yourself to let people know what you do."}
//           </Typography>

//           {editingAbout && (
//             <Box sx={{ mt: 2, borderTop: "1px solid #eee", pt: 2 }}>
//               <TextField
//                 fullWidth
//                 multiline
//                 rows={5}
//                 value={tempAbout}
//                 onChange={(e) => setTempAbout(e.target.value)}
//                 placeholder="Write about yourself..."
//               />
//               <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
//                 <Button variant="contained" onClick={saveEditAbout}>
//                   Save
//                 </Button>
//                 <Button variant="outlined" onClick={cancelEditAbout}>
//                   Cancel
//                 </Button>
//               </Box>
//             </Box>
//           )}
//         </Box>

//         {/* SKILLS & TOOLS */}
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             gap: 3,
//             flex: "1 1 320px",
//             minWidth: 300,
//             boxSizing: "border-box",
//           }}
//         >
//           <Box
//             sx={{
//               background: "#fff",
//               borderRadius: "14px",
//               p: 2.5,
//               boxShadow: "0 8px 20px rgba(12,20,31,0.06)",
//               position: "relative",
//               boxSizing: "border-box",
//             }}
//           >
//             <Typography sx={{ fontSize: 16, fontWeight: 700 }}>Skills & Tools</Typography>

//             <IconButton
//               sx={{ position: "absolute", right: 12, top: 12 }}
//               onClick={startEditSkillsTools}
//               aria-label="edit skills and tools"
//             >
//               <FiEdit2 />
//             </IconButton>

//             <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
//               <Box>
//                 <Typography sx={{ fontWeight: 700, fontSize: 13 }}>Skills</Typography>
//                 <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
//                   {Array.isArray(profileData.skills) && profileData.skills.length ? (
//                     profileData.skills.map((s) => (
//                       <Box
//                         key={s}
//                         sx={{
//                           px: 1.5,
//                           py: 0.6,
//                           borderRadius: "12px",
//                           background: "#FFF8D9",
//                           fontWeight: 700,
//                           fontSize: 13,
//                           border: "1px solid rgba(0,0,0,0.06)",
//                         }}
//                       >
//                         {s}
//                       </Box>
//                     ))
//                   ) : (
//                     <Typography color="gray">No skills added</Typography>
//                   )}
//                 </Box>
//               </Box>

//               <Box>
//                 <Typography sx={{ fontWeight: 700, fontSize: 13 }}>Tools</Typography>
//                 <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
//                   {Array.isArray(profileData.tools) && profileData.tools.length ? (
//                     profileData.tools.map((t) => (
//                       <Box
//                         key={t}
//                         sx={{
//                           px: 1.5,
//                           py: 0.6,
//                           borderRadius: "12px",
//                           background: "#E8F8FF",
//                           fontWeight: 700,
//                           fontSize: 13,
//                           border: "1px solid rgba(0,0,0,0.06)",
//                         }}
//                       >
//                         {t}
//                       </Box>
//                     ))
//                   ) : (
//                     <Typography color="gray">No tools added</Typography>
//                   )}
//                 </Box>
//               </Box>
//             </Box>

//             {editingSkillsTools && (
//               <Box sx={{ mt: 2, borderTop: "1px solid #eee", pt: 2 }}>
//                 <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>Edit Skills</Typography>
//                 <Autocomplete
//                   multiple
//                   freeSolo
//                   options={skillOptions}
//                   value={tempSkills}
//                   onChange={(e, v) => setTempSkills(v)}
//                   renderInput={(params) => <TextField {...params} placeholder="Add skills (press Enter)" />}
//                 />

//                 <Typography sx={{ fontSize: 13, fontWeight: 600, mt: 2, mb: 1 }}>Edit Tools</Typography>
//                 <Autocomplete
//                   multiple
//                   freeSolo
//                   options={toolOptions}
//                   value={tempTools}
//                   onChange={(e, v) => setTempTools(v)}
//                   renderInput={(params) => <TextField {...params} placeholder="Add tools (press Enter)" />}
//                 />

//                 <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
//                   <Button variant="contained" onClick={saveEditSkillsTools}>
//                     Save
//                   </Button>
//                   <Button variant="outlined" onClick={cancelEditSkillsTools}>
//                     Cancel
//                   </Button>
//                 </Box>
//               </Box>
//             )}
//           </Box>
//         </Box>
//       </Box>

//       {/* PORTFOLIO SECTION */}
//       <Box sx={{ bgcolor: "#fff", borderRadius: 3, p: 3 }}>
//         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//           <Typography sx={{ fontSize: 20, fontWeight: 700 }}>Portfolio</Typography>
//           <Button
//             variant="contained"
//             size="small"
//             sx={{ borderRadius: 4, textTransform: "none" }}
//             onClick={() => setIsPortfolioPopupOpen(true)}
//           >
//             Add Portfolio
//           </Button>
//         </Box>

//         <Box
//           sx={{
//             display: "flex",
//             gap: 2,
//             overflowX: "auto",
//             overflowY: "hidden",
//             pb: 2,
//             pl: 0,
//             width: "100%",
//             maxWidth: "100%",
//             '&::-webkit-scrollbar': { height: 8 },
//             '&::-webkit-scrollbar-thumb': { background: "#ddd", borderRadius: 10 },
//           }}
//         >
//           {portfolio.map((p) => (
//             <Box
//               key={p.id}
//               sx={{
//                 width: 300,
//                 flexShrink: 0,
//                 bgcolor: "#00c2e8",
//                 borderRadius: 2,
//                 p: 0,
//                 boxShadow: "0 8px 20px rgba(12,20,31,0.06)",
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "space-between",
//                 overflow: "hidden",
//                 position: "relative",
//               }}
//               onClick={() => LaunchURL(p.projectUrl)}
//             >
//               {/* thumbnail */}
//               <Box sx={{ height: 140, bgcolor: "#00b7db" }}>
//                 <img
//                   src={p.imageUrl || "/placeholder-portfolio.jpg"}
//                   alt={p.title}
//                   style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                 />
//               </Box>

//               {/* content area */}
//               <Box sx={{ bgcolor: "#fff", p: 2, height: "100%", position: "relative" }}>
//                 {/* Edit + Delete buttons (stop propagation) */}
//                 <Box sx={{ position: "absolute", right: 8, top: 8, display: "flex", gap: 1 }}>
//                   <IconButton
//                     size="small"
//                     onClick={(e) => handleOpenEdit(p, e)}
//                     aria-label="edit portfolio"
//                   >
//                     <FiEdit2 />
//                   </IconButton>

//                   <IconButton
//                     size="small"
//                     onClick={(e) => handleDelete(p, e)}
//                     aria-label="delete portfolio"
//                   >
//                     <FiTrash2 color="#e53935" />
//                   </IconButton>
//                 </Box>

//                 <Typography sx={{ fontWeight: 700 }}>{p.title}</Typography>
//                 <Typography sx={{ fontSize: 13, color: "#555", mt: 1 }}>{p.description}</Typography>

//                 <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
//                   {(p.skills || []).map((s) => (
//                     <Box
//                       key={s}
//                       sx={{
//                         px: 1,
//                         py: 0.5,
//                         bgcolor: "#FFF8D9",
//                         borderRadius: 10,
//                         fontSize: 12,
//                         fontWeight: 700,
//                       }}
//                     >
//                       {s}
//                     </Box>
//                   ))}

//                   {(p.tools || []).map((t) => (
//                     <Box
//                       key={t}
//                       sx={{
//                         px: 1,
//                         py: 0.5,
//                         bgcolor: "#E8F8FF",
//                         borderRadius: 10,
//                         fontSize: 12,
//                         fontWeight: 700,
//                       }}
//                     >
//                       {t}
//                     </Box>
//                   ))}
//                 </Box>
//               </Box>
//             </Box>
//           ))}
//         </Box>
//       </Box>

//       {/* existing AddPortfolioPopup (unchanged) */}
//       <AddPortfolioPopup
//         open={isPortfolioPopupOpen}
//         onClose={() => setIsPortfolioPopupOpen(false)}
//         portfolio={null}   // 🟢 always empty
//       />

//       {/* EditPopup */}
//       {isEditOpen && editingPortfolio && (
//         <EditPortfolioPopup
//           open={isEditOpen}
//           onClose={() => {
//             setIsEditOpen(false);
//             setEditingPortfolio(null);
//           }}
//           portfolio={editingPortfolio}
//           onSave={handleSaveEdit}
//         />
//       )}
//     </Box>
//   );
// }

// /* ---------------------------
//    EditPortfolioPopup component
//    - matches the fields in your image (title, description, project url, image url, skills)
//    - onSave -> calls onSave(updatedObject) provided by parent
//    --------------------------- */
// function EditPortfolioPopup({ open, onClose, portfolio, onSave }) {
//   const [title, setTitle] = useState(portfolio.title || "");
//   const [description, setDescription] = useState(portfolio.description || "");
//   const [projectUrl, setProjectUrl] = useState(portfolio.projectUrl || portfolio.projectUrl || "");
//   const [imageUrl, setImageUrl] = useState(portfolio.imageUrl || "");
//   const [skillsText, setSkillsText] = useState((portfolio.skills || []).join(", "));
//   const [toolsText, setToolsText] = useState((portfolio.tools || []).join(", "));

//   // Keep inputs synced if portfolio changes
//   useEffect(() => {
//     if (open && portfolio == null) {
//       setTitle("");
//       setDescription("");
//       setProjectUrl("");
//       setImageUrl("");
//       setSkills([]);
//       setTools([]);
//     }
//   }, [open, portfolio]);


//   const handleSave = () => {
//     // build arrays from comma-separated inputs
//     const skills = skillsText
//       .split(",")
//       .map((s) => s.trim())
//       .filter(Boolean);
//     const tools = toolsText
//       .split(",")
//       .map((t) => t.trim())
//       .filter(Boolean);

//     const updated = {
//       id: portfolio.id,
//       title: title.trim(),
//       description: description.trim(),
//       projectUrl: projectUrl.trim(),
//       imageUrl: imageUrl.trim(),
//       skills,
//       tools,
//       // don't touch createdAt or other fields — parent update will only overwrite these keys
//     };

//     onSave(updated);
//   };

//   return (
//     <Dialog open={open} 
//     onClose={onClose} 
//     fullWidth
//      maxWidth="sm"
//        PaperProps={{
//         sx: {
//           bgcolor: "#ffffff",                 
//           borderRadius: "20px",               
//           p: 1,
//           boxShadow: "0px 10px 40px rgba(0,0,0,0.12)", 
//         },
//       }}
//      >
//       <DialogTitle sx={{ textAlign: "center", fontWeight: 700 }}>Edit Portfolio</DialogTitle>
//       <DialogContent>
//         <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 ,    }}>
//           <TextField
//             label="Project Title"
//             fullWidth
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//              sx={{
//     "& .MuiOutlinedInput-root": {
//       borderRadius: "12px",
//     },
//   }}
//           />

//           <TextField
//             label="Project description"
//             fullWidth
//             multiline
//             rows={4}
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Describe your project briefly"
//                       sx={{
//     "& .MuiOutlinedInput-root": {
//       borderRadius: "12px",
//     },
//   }}
//           />

//           <TextField
//             label="Project url"
//             fullWidth
//             value={projectUrl}
//             onChange={(e) => setProjectUrl(e.target.value)}
//             placeholder="https://"
//                       sx={{
//     "& .MuiOutlinedInput-root": {
//       borderRadius: "12px",
//     },
//   }}
//           />

//           <TextField
//             label="Image url"
//             fullWidth
//             value={imageUrl}
//             onChange={(e) => setImageUrl(e.target.value)}
//             placeholder="https:// (optional)"
//                       sx={{
//     "& .MuiOutlinedInput-root": {
//       borderRadius: "12px",
//     },
//   }}
//           />

//           <TextField
//             label="Skills (comma separated)"
//             fullWidth
//             value={skillsText}
//             onChange={(e) => setSkillsText(e.target.value)}
//             placeholder="React, Node, Figma"
//                       sx={{
//     "& .MuiOutlinedInput-root": {
//       borderRadius: "12px",
//     },
//   }}
//           />

//           <TextField
//             label="Tools (comma separated)"
//             fullWidth
//             value={toolsText}
//             onChange={(e) => setToolsText(e.target.value)}
//             placeholder="VSCode, Git"
//                       sx={{
//     "& .MuiOutlinedInput-root": {
//       borderRadius: "12px",
//     },
//   }}
//           />
//         </Box>
//       </DialogContent>

//       <DialogActions sx={{ px: 3, pb: 2 }}>
//         <Button variant="outlined" onClick={onClose} sx={{
//           borderColor: "rgba(124, 60, 255, 1)", borderRadius: "10px",
//           color: "rgba(124, 60, 255, 1)",
//             border: "2px solid #7C3CFF",          
                               
//             textTransform: "none",
//             width: "120px",
//         }}>
//           Cancel
//         </Button>
//         <Button
//           variant="contained"
//           onClick={handleSave}
//           sx={{ bgcolor: "rgba(124, 60, 255, 1)", borderRadius: "10px", color: "white",
//             textTransform: "none",
//             width: "120px",
//              }}
//         >
//           Save
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }






// // BuildProfileScreenWithEdit.jsx
// import React, { useState, useEffect, useRef } from "react";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import {
//   getFirestore,
//   doc,
//   getDoc,
//   setDoc,
//   collection,
//   query,
//   orderBy,
//   onSnapshot,
//   updateDoc,
//   deleteDoc,
//   where,
//   serverTimestamp,
// } from "firebase/firestore";

// import {
//   Button,
//   TextField,
//   Box,
//   Typography,
//   IconButton,
//   Autocomplete,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";

// import { FiEdit2, FiTrash2 } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";

// import AddPortfolioPopup from "../Firebaseaddporfoilo/AddPortfolioPopup.jsx";

// // -----------------------------------------------------------------------------
// // Single file contains:
// // - BuildProfileScreen (main)
// // - EditPortfolioPopup (modal)
// // - Sidebar helper + Posted Jobs cards (Works & 24 Hours) — built-in
// // -----------------------------------------------------------------------------

// // ----------------- SIDEBAR SUPPORT (copied from your Card.jsx) -----------------
// const useSidebar = () => {
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }

//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   return collapsed;
// };

// // ---------------------------- STYLES (in-file) ----------------------------
// const pageStyles = {
//   pageWrapper: {
//     width: "100%",
//     minHeight: "100vh",
//     background: "#F5F6FA",
//     paddingBottom: 80,
//     boxSizing: "border-box",
//     overflowX: "hidden",
//   },
//   content: {
//     maxWidth: 1120,
//     margin: "0 auto",
//     padding: "24px 16px",
//     boxSizing: "border-box",
//   },

//   // Posted Jobs styles (adapted from Card.jsx)
//   jobsContainer: {
//     marginTop: 28,
//     background: "#fff",
//     borderRadius: 16,
//     padding: 18,
//     boxShadow: "0 8px 20px rgba(12,20,31,0.06)",
//   },

//   toggleBarWrapper: {
//     width: "100%",
//     height: 52,
//     borderRadius: 16,
//     padding: 6,
//     display: "flex",
//     alignItems: "center",
//     backgroundColor: "#FFF8E1",
//     boxShadow: "0 2px 8px rgba(16,24,40,0.04)",
//   },
//   toggleGroup: {
//     width: 380,
//     height: 36,
//     display: "flex",
//     gap: 6,
//     borderRadius: 14,
//     alignItems: "center",
//     padding: 4,
//   },
//   toggleButton: (active) => ({
//     width: 180,
//     height: 36,
//     borderRadius: 12,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: active ? "#FFFFFF" : "#FFF8E1",
//     fontSize: 14,
//     fontWeight: 600,
//     cursor: "pointer",
//     boxShadow: active ? "0 4px 10px rgba(124,60,255,0.06)" : "none",
//   }),

//   searchSortRow: {
//     display: "flex",
//     gap: 12,
//     alignItems: "center",
//     marginTop: 16,
//   },

//   searchContainer: {
//     flex: 1,
//     height: 44,
//     borderRadius: 14,
//     border: "1px solid #DADADA",
//     paddingLeft: 14,
//     paddingRight: 14,
//     display: "flex",
//     alignItems: "center",
//     backgroundColor: "#FFF",
//   },

//   cardsWrap: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
//     gap: 24,
//     marginTop: 20,
//   },

//   card: {
//     width: "100%",
//     minHeight: 220,
//     borderRadius: 24,
//     border: "0.8px solid #DADADA",
//     backgroundColor: "#FFFFFF",
//     padding: 20,
//     boxShadow: "0 8px 20px rgba(16,24,40,0.04)",
//     cursor: "pointer",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "space-between",
//     position: "relative",
//   },

//   avatarBox: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: 14,
//     background:
//       "linear-gradient(135deg, #51A2FF, #9B42FF 60%, #AD46FF)",
//     color: "#FFF",
//     fontWeight: 700,
//   },

//   skillChip: {
//     padding: "4px 12px",
//     marginRight: 8,
//     borderRadius: 20,
//     border: "1px solid rgba(255,255,190,1)",
//     backgroundColor: "rgba(255,255,190,1)",
//     fontSize: 14,
//     whiteSpace: "nowrap",
//   },

//   moreChip: {
//     padding: "4px 12px",
//     borderRadius: 20,
//     backgroundColor: "rgba(255,255,190,1)",
//     fontSize: 11,
//   },

//   // small helpers
//   label: { fontSize: 15 },
//   value: { marginTop: 4, fontSize: 13, fontWeight: 500 },
//   valueHighlight: { color: "rgba(124,60,255,1)" },

//   emptyWrap: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     marginTop: 40,
//     gridColumn: "1 / -1",
//   },

//   fab: {
//     position: "fixed",
//     right: 32,
//     bottom: 32,
//     width: 64,
//     height: 64,
//     borderRadius: "50%",
//     backgroundColor: "rgba(124,60,255,1)",
//     color: "#FFF",
//     fontSize: 32,
//     border: "none",
//     cursor: "pointer",
//     boxShadow: "0 8px 16px rgba(124,60,255,0.4)",
//   },
// };

// // ---------------------------- helpers ----------------------------
// function formatBudget(val) {
//   if (!val) return 0;
//   const num = Number(val);
//   if (num >= 100000) return (num / 100000).toFixed(1) + "L";
//   if (num >= 1000) return (num / 1000).toFixed(1) + "k";
//   return num;
// }

// function getInitials(title) {
//   if (!title) return "";
//   const w = title.trim().split(" ");
//   if (w.length > 1) return (w[0][0] + w[1][0]).toUpperCase();
//   return w[0][0].toUpperCase();
// }

// // ---------------------------- MAIN COMPONENT ----------------------------
// export default function BuildProfileScreenWithEdit() {
//   const auth = getAuth();
//   const db = getFirestore();
//   const navigate = useNavigate();

//   const collapsed = useSidebar();

//   // Profile state
//   const [user, setUser] = useState(null);
//   const [profileData, setProfileData] = useState({
//     firstName: "",
//     lastName: "",
//     title: "",
//     about: "",
//     skills: [],
//     tools: [],
//     profileImage: "",
//     location: "",
//   });

//   // Portfolio
//   const [portfolio, setPortfolio] = useState([]);
//   const [isPortfolioPopupOpen, setIsPortfolioPopupOpen] = useState(false);

//   // Inline edit states
//   const [editingAbout, setEditingAbout] = useState(false);
//   const [editingSkillsTools, setEditingSkillsTools] = useState(false);
//   const [tempAbout, setTempAbout] = useState("");
//   const [tempSkills, setTempSkills] = useState([]);
//   const [tempTools, setTempTools] = useState([]);
//   const skillOptions = ["React", "Node", "Flutter", "Figma", "UI/UX"];
//   const toolOptions = ["VSCode", "Figma", "Git", "Photoshop", "Canva"];

//   // Portfolio edit popup
//   const [editingPortfolio, setEditingPortfolio] = useState(null);
//   const [isEditOpen, setIsEditOpen] = useState(false);

//   // Posted Jobs (Works + 24 Hours)
//   const [selectedJobsTab, setSelectedJobsTab] = useState("Works");
//   const [searchText, setSearchText] = useState("");
//   const [sortOption, setSortOption] = useState("newest");
//   const [services, setServices] = useState([]);
//   const [jobs24, setJobs24] = useState([]);
//   const [servicesLoading, setServicesLoading] = useState(true);
//   const [jobs24Loading, setJobs24Loading] = useState(true);

//   // ------------------ auth + profile + portfolio listeners ------------------
//   useEffect(() => {
//     const unsubAuth = onAuthStateChanged(auth, (u) => {
//       setUser(u);
//     });

//     return () => unsubAuth();
//   }, []);

//   useEffect(() => {
//     if (!user) return;
//     const userRef = doc(db, "users", user.uid);

//     // fetch user profile once
//     getDoc(userRef).then((snap) => {
//       if (snap.exists()) {
//         setProfileData((prev) => ({ ...prev, ...snap.data() }));
//       }
//     });

//     // portfolio realtime
//     const q = query(
//       collection(db, "users", user.uid, "portfolio"),
//       orderBy("createdAt", "desc")
//     );
//     const unsub = onSnapshot(q, (snap) => {
//       setPortfolio(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//     });

//     return () => unsub();
//   }, [user, db]);

//   // ------------------ services (Works) listener ------------------
//   useEffect(() => {
//     if (!user) return;
//     setServicesLoading(true);

//     const q = query(collection(db, "services"), where("userId", "==", user.uid));
//     const unsub = onSnapshot(q, (snap) => {
//       const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       arr.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
//       setServices(arr);
//       setServicesLoading(false);
//     });

//     return () => unsub();
//   }, [user, db]);

//   // ------------------ service_24h listener ------------------
//   useEffect(() => {
//     if (!user) return;
//     setJobs24Loading(true);

//     const q = query(collection(db, "service_24h"), where("userId", "==", user.uid));
//     const unsub = onSnapshot(q, (snap) => {
//       const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       arr.sort(
//         (a, b) =>
//           (b.created_at?.seconds || b.createdAt?.seconds || 0) -
//           (a.created_at?.seconds || a.createdAt?.seconds || 0)
//       );
//       setJobs24(arr);
//       setJobs24Loading(false);
//     });

//     return () => unsub();
//   }, [user, db]);

//   // ------------------ updateField util ------------------
//   const updateField = async (field, value) => {
//     if (!user) return;
//     const userRef = doc(db, "users", user.uid);
//     await setDoc(userRef, { [field]: value }, { merge: true });
//     setProfileData((prev) => ({ ...prev, [field]: value }));
//   };

//   // ------------------ LaunchURL ------------------
//   const LaunchURL = (url) => url && window.open(url, "_blank");

//   // ------------------ About handlers ------------------
//   const startEditAbout = () => {
//     setTempAbout(profileData.about || "");
//     setEditingAbout(true);
//     setEditingSkillsTools(false);
//   };
//   const cancelEditAbout = () => {
//     setTempAbout("");
//     setEditingAbout(false);
//   };
//   const saveEditAbout = async () => {
//     await updateField("about", tempAbout);
//     setTempAbout("");
//     setEditingAbout(false);
//   };

//   // ------------------ Skills/Tools handlers ------------------
//   const startEditSkillsTools = () => {
//     setTempSkills(Array.isArray(profileData.skills) ? profileData.skills : []);
//     setTempTools(Array.isArray(profileData.tools) ? profileData.tools : []);
//     setEditingSkillsTools(true);
//     setEditingAbout(false);
//   };
//   const cancelEditSkillsTools = () => {
//     setTempSkills([]);
//     setTempTools([]);
//     setEditingSkillsTools(false);
//   };
//   const saveEditSkillsTools = async () => {
//     await updateField("skills", tempSkills || []);
//     await updateField("tools", tempTools || []);
//     setTempSkills([]);
//     setTempTools([]);
//     setEditingSkillsTools(false);
//   };

//   // ------------------ Portfolio edit / delete ------------------
//   const handleOpenEdit = (p, e) => {
//     if (e && e.stopPropagation) e.stopPropagation();
//     setEditingPortfolio(p);
//     setIsEditOpen(true);
//   };

//   const handleDelete = async (p, e) => {
//     if (e && e.stopPropagation) e.stopPropagation();
//     try {
//       const ok = window.confirm("Delete this portfolio item? This cannot be undone.");
//       if (!ok) return;
//       await deleteDoc(doc(db, "users", user.uid, "portfolio", p.id));
//       alert("Deleted");
//     } catch (err) {
//       console.error("Delete failed:", err);
//       alert("Delete failed");
//     }
//   };

//   const handleSaveEdit = async (updated) => {
//     try {
//       const ref = doc(db, "users", user.uid, "portfolio", updated.id);
//       const toUpdate = { ...updated };
//       delete toUpdate.id;
//       await updateDoc(ref, toUpdate);
//       setIsEditOpen(false);
//       setEditingPortfolio(null);
//       alert("Portfolio updated");
//     } catch (err) {
//       console.error("Update failed:", err);
//       alert("Update failed");
//     }
//   };

//   // ------------------ Posted Jobs helpers ------------------
//   async function togglePause(job, collectionName, e) {
//     if (e && e.stopPropagation) e.stopPropagation();
//     try {
//       await updateDoc(doc(db, collectionName, job.id), {
//         paused: !job.paused,
//         pausedAt: !job.paused ? serverTimestamp() : null,
//       });
//     } catch (err) {
//       console.error("togglePause failed", err);
//     }
//   }

//   const filterSearch = (arr) => {
//     if (!searchText) return arr;
//     const t = searchText.toLowerCase();
//     return arr.filter((i) => (i.title || "").toLowerCase().includes(t));
//   };

//   const sortArr = (arr) => {
//     if (sortOption === "paused") return arr.filter((i) => i.paused);

//     if (sortOption === "oldest")
//       return [...arr].sort(
//         (a, b) =>
//           (a.createdAt?.seconds || a.created_at?.seconds || 0) -
//           (b.createdAt?.seconds || b.created_at?.seconds || 0)
//       );

//     return [...arr].sort(
//       (a, b) =>
//         (b.createdAt?.seconds || b.created_at?.seconds || 0) -
//         (a.createdAt?.seconds || a.created_at?.seconds || 0)
//     );
//   };

//   const finalServices = sortArr(filterSearch(services));
//   const final24 = sortArr(filterSearch(jobs24));

//   const renderEmptyState = (btnText, onClick) => (
//     <div style={pageStyles.emptyWrap}>
//       <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{btnText === "Create Service" ? "No services yet" : "No 24h services yet"}</div>
//       <div style={{ color: "#666", marginBottom: 12, textAlign: "center", maxWidth: 600 }}>
//         Add your service to show in Posted Jobs. Clients can view and hire you.
//       </div>
//       <button
//         onClick={onClick}
//         style={{
//           height: 44,
//           padding: "0 22px",
//           borderRadius: 30,
//           backgroundColor: "rgba(253,253,150,1)",
//           border: "none",
//           color: "#000",
//           cursor: "pointer",
//           fontWeight: 600,
//         }}
//       >
//         {btnText}
//       </button>
//     </div>
//   );

//   // ------------------ WorkCard & Card24 components (inline) ------------------
//   const WorkCard = (job) => {
//     const initials = getInitials(job.title);

//     return (
//       <div
//         key={job.id}
//         style={pageStyles.card}
//         onClick={() =>
//           navigate(`/serviceDetailsModel/${job.id}`, { state: { job } })
//         }
//       >
//         {/* right arrow icon placeholder (you had an image in Card.jsx) */}
//         <div style={{ position: "absolute", top: 18, right: 18, width: 16, height: 16 }} />

//         <div style={{ display: "flex" }}>
//           <div
//             style={{
//               ...pageStyles.avatarBox,
//               width: 56,
//               height: 66,
//               fontSize: 20,
//               marginLeft: "1px",
//               paddingLeft: "14px",
//               textAlign: "center",
//             }}
//           >
//             {initials}
//           </div>

//           <div style={{ flex: 1, marginLeft: 27 }}>
//             <div style={{ fontWeight: 500, marginBottom: 4, fontSize: 16, textTransform: "uppercase" }}>
//               {job.title}
//             </div>

//             <div style={{ marginTop: 4, height: 32, overflowX: "auto", display: "flex", alignItems: "center" }}>
//               {job.skills?.slice(0, 2).map((s, i) => (
//                 <div key={i} style={pageStyles.skillChip}>
//                   {s}
//                 </div>
//               ))}
//               {job.skills?.length > 2 && (
//                 <div style={pageStyles.moreChip}>+{job.skills.length - 2}</div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
//           <div>
//             <div style={pageStyles.label}>Budget</div>
//             <div style={{ ...pageStyles.value, ...pageStyles.valueHighlight }}>
//               ₹{formatBudget(job.budget_from || job.budget)}
//             </div>
//           </div>

//           <div>
//             <div style={pageStyles.label}>Timeline</div>
//             <div style={pageStyles.value}>{job.deliveryDuration || "N/A"}</div>
//           </div>

//           <div>
//             <div style={pageStyles.label}>Location</div>
//             <div style={pageStyles.value}>{job.location || "Remote"}</div>
//           </div>
//         </div>

//         <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
//           <button
//             style={{
//               flex: 1,
//               height: 40,
//               borderRadius: 30,
//               border: "1px solid #BDBDBD",
//               backgroundColor: "#FFFFFF",
//               fontSize: 13,
//               fontWeight: 600,
//             }}
//             onClick={(e) => togglePause(job, "services", e)}
//           >
//             {job.paused ? "Unpause" : "Pause Service"}
//           </button>

//           <button
//             style={{
//               flex: 1,
//               height: 40,
//               borderRadius: 30,
//               border: "none",
//               backgroundColor: "rgba(253,253,150,1)",
//               fontWeight: 700,
//             }}
//             onClick={(e) => {
//               e.stopPropagation();
//               navigate(`/freelance-dashboard/freelanceredit-service/${job.id}`, {
//                 state: { jobId: job.id, jobData: job },
//               });
//             }}
//           >
//             Edit Service
//           </button>
//         </div>
//       </div>
//     );
//   };

//   const Card24 = (job) => {
//     const initials = getInitials(job.title);

//     return (
//       <div
//         key={job.id}
//         style={pageStyles.card}
//         onClick={() => navigate(`/service-24h/${job.id}`, { state: { job } })}
//       >
//         <div style={{ position: "absolute", top: 18, right: 18, width: 16, height: 16 }} />

//         <div style={{ display: "flex" }}>
//           <div
//             style={{
//               ...pageStyles.avatarBox,
//               width: 60,
//               height: 60,
//               fontSize: 22,
//             }}
//           >
//             {initials}
//           </div>

//           <div style={{ flex: 1, marginLeft: 12 }}>
//             <div style={{ fontWeight: 500, marginBottom: 4, fontSize: 16 }}>{job.title}</div>

//             <div style={{ marginTop: 4, height: 32, overflowX: "auto", display: "flex", alignItems: "center" }}>
//               {job.skills?.slice(0, 2).map((s, i) => (
//                 <div key={i} style={pageStyles.skillChip}>
//                   {s}
//                 </div>
//               ))}
//               {job.skills?.length > 2 && (
//                 <div style={pageStyles.moreChip}>+{job.skills.length - 2}</div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
//           <div>
//             <div style={pageStyles.label}>Budget</div>
//             <div style={{ ...pageStyles.value, ...pageStyles.valueHighlight }}>
//               ₹{formatBudget(job.budget_from || job.budget)}
//             </div>
//           </div>

//           <div>
//             <div style={pageStyles.label}>Timeline</div>
//             <div style={pageStyles.value}>{job.deliveryDuration || "N/A"}</div>
//           </div>

//           <div>
//             <div style={pageStyles.label}>Location</div>
//             <div style={pageStyles.value}>{job.location || "Remote"}</div>
//           </div>
//         </div>

//         <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
//           <button
//             style={{
//               flex: 1,
//               height: 40,
//               borderRadius: 30,
//               border: "1px solid #BDBDBD",
//               backgroundColor: "#FFFFFF",
//               fontSize: 13,
//               fontWeight: 600,
//             }}
//             onClick={(e) => togglePause(job, "service_24h", e)}
//           >
//             {job.paused ? "Unpause" : "Pause Service"}
//           </button>

//           <button
//             style={{
//               flex: 1,
//               height: 40,
//               borderRadius: 30,
//               border: "none",
//               backgroundColor: "rgba(253,253,150,1)",
//               fontWeight: 700,
//             }}
//             onClick={(e) => {
//               e.stopPropagation();
//               navigate(`/service-24h-edit/${job.id}`, { state: { job } });
//             }}
//           >
//             Edit Service
//           </button>
//         </div>
//       </div>
//     );
//   };

//   // ------------------ render posted jobs panel ------------------
//   const renderPostedJobsPanel = () => {
//     return (
//       <Box sx={{ mt: 4 }}>
//         <Box style={pageStyles.jobsContainer}>
//           <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             <Typography sx={{ fontSize: 20, fontWeight: 700 }}>Posted Jobs</Typography>

//             <Box style={{ display: "flex", alignItems: "center", gap: 12 }}>
//               <div style={pageStyles.toggleBarWrapper}>
//                 <div style={pageStyles.toggleGroup}>
//                   <div
//                     tabIndex={0}
//                     onClick={() => setSelectedJobsTab("Works")}
//                     style={pageStyles.toggleButton(selectedJobsTab === "Works")}
//                   >
//                     Works
//                   </div>

//                   <div
//                     tabIndex={0}
//                     onClick={() => setSelectedJobsTab("24 Hours")}
//                     style={pageStyles.toggleButton(selectedJobsTab === "24 Hours")}
//                   >
//                     24 Hours
//                   </div>
//                 </div>
//               </div>
//             </Box>
//           </Box>

//           <Box style={pageStyles.searchSortRow}>
//             <div style={{ ...pageStyles.searchContainer, marginTop: 8 }}>
//               <input
//                 style={{ border: "none", outline: "none", flex: 1, fontSize: 14 }}
//                 placeholder="Search services"
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//               />
//             </div>

//             <div style={{ minWidth: 120 }}>
//               <select
//                 value={sortOption}
//                 onChange={(e) => setSortOption(e.target.value)}
//                 style={{
//                   width: "100%",
//                   height: 40,
//                   borderRadius: 12,
//                   border: "1px solid #E0E0E0",
//                   paddingLeft: 10,
//                 }}
//               >
//                 <option value="newest">Newest</option>
//                 <option value="oldest">Oldest</option>
//                 <option value="paused">Paused</option>
//               </select>
//             </div>
//           </Box>

//           <div style={pageStyles.cardsWrap}>
//             {selectedJobsTab === "Works" ? (
//               servicesLoading ? (
//                 <div style={{ marginTop: 40 }}>Loading...</div>
//               ) : finalServices.length === 0 ? (
//                 renderEmptyState("Create Service", () => navigate("/freelance-dashboard/add-service-form"))
//               ) : (
//                 finalServices.map((s) => WorkCard(s))
//               )
//             ) : jobs24Loading ? (
//               <div style={{ marginTop: 40 }}>Loading...</div>
//             ) : final24.length === 0 ? (
//               renderEmptyState("Create 24h Service", () => navigate("/freelance-dashboard/add-service-form"))
//             ) : (
//               final24.map((j) => Card24(j))
//             )}
//           </div>
//         </Box>
//       </Box>
//     );
//   };

//   // ------------------ JSX return ------------------
//   return (
//     <Box sx={{ ...pageStyles.pageWrapper, marginLeft: collapsed ? "-280px" : "-70px", transition: "margin-left 0.25s ease" }}>
//       <Box sx={pageStyles.content}>
//         {/* TOP SUMMARY */}
//         <Box
//           sx={{
//             background: "linear-gradient(90deg, #f8ffb0, #e3ffd9)",
//             borderRadius: 3,
//             p: 4,
//             mb: 6,
//             display: "flex",
//             alignItems: "center",
//             gap: 3,
//             position: "relative",
//           }}
//         >
//           <img
//             src={profileData.profileImage || "/user-placeholder.jpg"}
//             alt="profile"
//             style={{
//               width: 95,
//               height: 95,
//               borderRadius: "50%",
//               border: "4px solid white",
//               objectFit: "cover",
//             }}
//           />

//           <Box>
//             <Typography sx={{ fontSize: 24, fontWeight: 700 }}>
//               {profileData.firstName} {profileData.lastName}
//             </Typography>
//             <Typography sx={{ color: "gray", fontSize: 15 }}>{profileData.location}</Typography>
//             <Typography
//               sx={{
//                 mt: 1,
//                 display: "inline-block",
//                 bgcolor: "#b6fab2",
//                 px: 2,
//                 py: 0.5,
//                 borderRadius: 1,
//                 fontWeight: 600,
//                 fontSize: 14,
//               }}
//             >
//               {profileData.title}
//             </Typography>
//           </Box>

//           <Button
//             variant="contained"
//             sx={{ position: "absolute", right: 20, top: 20, borderRadius: 4, textTransform: "none" }}
//           >
//             Edit Profile
//           </Button>
//         </Box>

//         {/* MAIN ROW */}
//         <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, alignItems: "flex-start", mb: 4 }}>
//           {/* ABOUT CARD */}
//           <Box
//             sx={{
//               background: "#fff",
//               borderRadius: "14px",
//               p: 3,
//               flex: "2 1 600px",
//               minWidth: 300,
//               boxShadow: "0 8px 20px rgba(12,20,31,0.06)",
//               position: "relative",
//             }}
//           >
//             <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 1 }}>About</Typography>
//             <IconButton
//               sx={{ position: "absolute", right: 12, top: 12 }}
//               onClick={startEditAbout}
//               aria-label="edit about"
//             >
//               <FiEdit2 />
//             </IconButton>

//             <Typography sx={{ color: "#444", lineHeight: 1.6 }}>
//               {profileData.about || "Add a short description about yourself to let people know what you do."}
//             </Typography>

//             {editingAbout && (
//               <Box sx={{ mt: 2, borderTop: "1px solid #eee", pt: 2 }}>
//                 <TextField
//                   fullWidth
//                   multiline
//                   rows={5}
//                   value={tempAbout}
//                   onChange={(e) => setTempAbout(e.target.value)}
//                   placeholder="Write about yourself..."
//                 />
//                 <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
//                   <Button variant="contained" onClick={saveEditAbout}>
//                     Save
//                   </Button>
//                   <Button variant="outlined" onClick={cancelEditAbout}>
//                     Cancel
//                   </Button>
//                 </Box>
//               </Box>
//             )}
//           </Box>

//           {/* SKILLS & TOOLS */}
//           <Box sx={{ display: "flex", flexDirection: "column", gap: 3, flex: "1 1 320px", minWidth: 300 }}>
//             <Box sx={{ background: "#fff", borderRadius: "14px", p: 2.5, boxShadow: "0 8px 20px rgba(12,20,31,0.06)", position: "relative" }}>
//               <Typography sx={{ fontSize: 16, fontWeight: 700 }}>Skills & Tools</Typography>

//               <IconButton
//                 sx={{ position: "absolute", right: 12, top: 12 }}
//                 onClick={startEditSkillsTools}
//                 aria-label="edit skills and tools"
//               >
//                 <FiEdit2 />
//               </IconButton>

//               <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
//                 <Box>
//                   <Typography sx={{ fontWeight: 700, fontSize: 13 }}>Skills</Typography>
//                   <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
//                     {Array.isArray(profileData.skills) && profileData.skills.length ? (
//                       profileData.skills.map((s) => (
//                         <Box key={s} sx={{ px: 1.5, py: 0.6, borderRadius: "12px", background: "#FFF8D9", fontWeight: 700, fontSize: 13, border: "1px solid rgba(0,0,0,0.06)" }}>
//                           {s}
//                         </Box>
//                       ))
//                     ) : (
//                       <Typography color="gray">No skills added</Typography>
//                     )}
//                   </Box>
//                 </Box>

//                 <Box>
//                   <Typography sx={{ fontWeight: 700, fontSize: 13 }}>Tools</Typography>
//                   <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
//                     {Array.isArray(profileData.tools) && profileData.tools.length ? (
//                       profileData.tools.map((t) => (
//                         <Box key={t} sx={{ px: 1.5, py: 0.6, borderRadius: "12px", background: "#E8F8FF", fontWeight: 700, fontSize: 13, border: "1px solid rgba(0,0,0,0.06)" }}>
//                           {t}
//                         </Box>
//                       ))
//                     ) : (
//                       <Typography color="gray">No tools added</Typography>
//                     )}
//                   </Box>
//                 </Box>
//               </Box>

//               {editingSkillsTools && (
//                 <Box sx={{ mt: 2, borderTop: "1px solid #eee", pt: 2 }}>
//                   <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>Edit Skills</Typography>
//                   <Autocomplete
//                     multiple
//                     freeSolo
//                     options={skillOptions}
//                     value={tempSkills}
//                     onChange={(e, v) => setTempSkills(v)}
//                     renderInput={(params) => <TextField {...params} placeholder="Add skills (press Enter)" />}
//                   />

//                   <Typography sx={{ fontSize: 13, fontWeight: 600, mt: 2, mb: 1 }}>Edit Tools</Typography>
//                   <Autocomplete
//                     multiple
//                     freeSolo
//                     options={toolOptions}
//                     value={tempTools}
//                     onChange={(e, v) => setTempTools(v)}
//                     renderInput={(params) => <TextField {...params} placeholder="Add tools (press Enter)" />}
//                   />

//                   <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
//                     <Button variant="contained" onClick={saveEditSkillsTools}>Save</Button>
//                     <Button variant="outlined" onClick={cancelEditSkillsTools}>Cancel</Button>
//                   </Box>
//                 </Box>
//               )}
//             </Box>
//           </Box>
//         </Box>

//         {/* PORTFOLIO SECTION */}
//         <Box sx={{ bgcolor: "#fff", borderRadius: 3, p: 3, boxShadow: "0 8px 20px rgba(12,20,31,0.04)" }}>
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//             <Typography sx={{ fontSize: 20, fontWeight: 700 }}>Portfolio</Typography>
//             <Button variant="contained" size="small" sx={{ borderRadius: 4, textTransform: "none" }} onClick={() => setIsPortfolioPopupOpen(true)}>
//               Add Portfolio
//             </Button>
//           </Box>

//           <Box sx={{ display: "flex", gap: 2, overflowX: "auto", overflowY: "hidden", pb: 2, pl: 0, width: "100%", maxWidth: "100%", '&::-webkit-scrollbar': { height: 8 }, '&::-webkit-scrollbar-thumb': { background: "#ddd", borderRadius: 10 } }}>
//             {portfolio.map((p) => (
//               <Box
//                 key={p.id}
//                 sx={{
//                   width: 300,
//                   flexShrink: 0,
//                   bgcolor: "#00c2e8",
//                   borderRadius: 2,
//                   p: 0,
//                   boxShadow: "0 8px 20px rgba(12,20,31,0.06)",
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "space-between",
//                   overflow: "hidden",
//                   position: "relative",
//                   mr: 1.5,
//                 }}
//                 onClick={() => LaunchURL(p.projectUrl)}
//               >
//                 <Box sx={{ height: 140, bgcolor: "#00b7db" }}>
//                   <img src={p.imageUrl || "/placeholder-portfolio.jpg"} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                 </Box>

//                 <Box sx={{ bgcolor: "#fff", p: 2, height: "100%", position: "relative" }}>
//                   <Box sx={{ position: "absolute", right: 8, top: 8, display: "flex", gap: 1 }}>
//                     <IconButton size="small" onClick={(e) => handleOpenEdit(p, e)} aria-label="edit portfolio"><FiEdit2 /></IconButton>
//                     <IconButton size="small" onClick={(e) => handleDelete(p, e)} aria-label="delete portfolio"><FiTrash2 color="#e53935" /></IconButton>
//                   </Box>

//                   <Typography sx={{ fontWeight: 700 }}>{p.title}</Typography>
//                   <Typography sx={{ fontSize: 13, color: "#555", mt: 1 }}>{p.description}</Typography>

//                   <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
//                     {(p.skills || []).map((s) => (
//                       <Box key={s} sx={{ px: 1, py: 0.5, bgcolor: "#FFF8D9", borderRadius: 10, fontSize: 12, fontWeight: 700 }}>{s}</Box>
//                     ))}
//                     {(p.tools || []).map((t) => (
//                       <Box key={t} sx={{ px: 1, py: 0.5, bgcolor: "#E8F8FF", borderRadius: 10, fontSize: 12, fontWeight: 700 }}>{t}</Box>
//                     ))}
//                   </Box>
//                 </Box>
//               </Box>
//             ))}
//           </Box>
//         </Box>

//         {/* AddPortfolioPopup (external component you already have) */}
//         <AddPortfolioPopup open={isPortfolioPopupOpen} onClose={() => setIsPortfolioPopupOpen(false)} portfolio={null} />

//         {/* EditPortfolioPopup */}
//         {isEditOpen && editingPortfolio && (
//           <EditPortfolioPopup
//             open={isEditOpen}
//             onClose={() => {
//               setIsEditOpen(false);
//               setEditingPortfolio(null);
//             }}
//             portfolio={editingPortfolio}
//             onSave={handleSaveEdit}
//           />
//         )}

//         {/* POSTED JOBS (Works | 24 Hours) */}
//         {renderPostedJobsPanel()}

//         {/* FAB (create service) */}
//         <button style={pageStyles.fab} onClick={() => navigate("/freelance-dashboard/add-service-form")}>+</button>
//       </Box>
//     </Box>
//   );
// }

// // --------------------------- EditPortfolioPopup (same as your file) ---------------------------
// function EditPortfolioPopup({ open, onClose, portfolio, onSave }) {
//   const [title, setTitle] = useState(portfolio?.title || "");
//   const [description, setDescription] = useState(portfolio?.description || "");
//   const [projectUrl, setProjectUrl] = useState(portfolio?.projectUrl || "");
//   const [imageUrl, setImageUrl] = useState(portfolio?.imageUrl || "");
//   const [skillsText, setSkillsText] = useState((portfolio?.skills || []).join(", "));
//   const [toolsText, setToolsText] = useState((portfolio?.tools || []).join(", "));

//   useEffect(() => {
//     // keep in sync when portfolio changes (e.g., open new item)
//     setTitle(portfolio?.title || "");
//     setDescription(portfolio?.description || "");
//     setProjectUrl(portfolio?.projectUrl || "");
//     setImageUrl(portfolio?.imageUrl || "");
//     setSkillsText((portfolio?.skills || []).join(", "));
//     setToolsText((portfolio?.tools || []).join(", "));
//   }, [portfolio]);

//   const handleSave = () => {
//     const skills = skillsText
//       .split(",")
//       .map((s) => s.trim())
//       .filter(Boolean);
//     const tools = toolsText
//       .split(",")
//       .map((t) => t.trim())
//       .filter(Boolean);

//     const updated = {
//       id: portfolio.id,
//       title: title.trim(),
//       description: description.trim(),
//       projectUrl: projectUrl.trim(),
//       imageUrl: imageUrl.trim(),
//       skills,
//       tools,
//     };

//     onSave(updated);
//   };

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { bgcolor: "#ffffff", borderRadius: "20px", p: 1, boxShadow: "0px 10px 40px rgba(0,0,0,0.12)" } }}>
//       <DialogTitle sx={{ textAlign: "center", fontWeight: 700 }}>Edit Portfolio</DialogTitle>
//       <DialogContent>
//         <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
//           <TextField label="Project Title" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
//           <TextField label="Project description" fullWidth multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your project briefly" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
//           <TextField label="Project url" fullWidth value={projectUrl} onChange={(e) => setProjectUrl(e.target.value)} placeholder="https://" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
//           <TextField label="Image url" fullWidth value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https:// (optional)" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
//           <TextField label="Skills (comma separated)" fullWidth value={skillsText} onChange={(e) => setSkillsText(e.target.value)} placeholder="React, Node, Figma" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
//           <TextField label="Tools (comma separated)" fullWidth value={toolsText} onChange={(e) => setToolsText(e.target.value)} placeholder="VSCode, Git" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
//         </Box>
//       </DialogContent>

//       <DialogActions sx={{ px: 3, pb: 2 }}>
//         <Button variant="outlined" onClick={onClose} sx={{ borderColor: "rgba(124, 60, 255, 1)", borderRadius: "10px", color: "rgba(124, 60, 255, 1)", border: "2px solid #7C3CFF", textTransform: "none", width: "120px" }}>
//           Cancel
//         </Button>
//         <Button variant="contained" onClick={handleSave} sx={{ bgcolor: "rgba(124, 60, 255, 1)", borderRadius: "10px", color: "white", textTransform: "none", width: "120px" }}>
//           Save
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }





// BuildProfileScreenWithEdit.jsx
import React, { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc,
  where,
  serverTimestamp,
} from "firebase/firestore";

import {
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import AddPortfolioPopup from "../Firebaseaddporfoilo/AddPortfolioPopup.jsx";

// -----------------------------------------------------------------------------
// Single file contains:
// - BuildProfileScreen (main)
// - EditPortfolioPopup (modal)
// - Sidebar helper + Posted Jobs cards (Works & 24 Hours) — built-in
// -----------------------------------------------------------------------------

// ----------------- SIDEBAR SUPPORT (copied from your Card.jsx) -----------------
const useSidebar = () => {
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }

    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  return collapsed;
};

// ---------------------------- STYLES (in-file) ----------------------------
const pageStyles = {
  pageWrapper: {
    width: "100%",
    minHeight: "100vh",
    background: "#F5F6FA",
    marginTop:'60px',
    paddingBottom: 80,
    boxSizing: "border-box",
   
  },
  content: {
    
    maxWidth: 1120,
    margin: "0 auto",
    padding: "24px 16px",
    boxSizing: "border-box",
  },

  // Posted Jobs styles (adapted from Card.jsx)
  jobsContainer: {
    marginTop: 28,
    background: "#fff",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 8px 20px rgba(12,20,31,0.06)",
  },

  toggleBarWrapper: {
    width: "100%",
    height: 52,
    borderRadius: 16,
    padding: 6,
    display: "flex",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    boxShadow: "0 2px 8px rgba(16,24,40,0.04)",
  },
  toggleGroup: {
    width: 380,
    height: 36,
    display: "flex",
    gap: 6,
    borderRadius: 14,
    alignItems: "center",
    padding: 4,
  },
  toggleButton: (active) => ({
    width: 180,
    height: 36,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: active ? "#FFFFFF" : "#FFF8E1",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: active ? "0 4px 10px rgba(124,60,255,0.06)" : "none",
  }),

  searchSortRow: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    marginTop: 16,
  },

  searchContainer: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    border: "1px solid #DADADA",
    paddingLeft: 14,
    paddingRight: 14,
    display: "flex",
    alignItems: "center",
    backgroundColor: "#FFF",
  },

  cardsWrap: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
    gap: 24,
    marginTop: 20,
  },

  card: {
    width: "100%",
    minHeight: 220,
    borderRadius: 24,
    border: "0.8px solid #DADADA",
    backgroundColor: "#FFFFFF",
    padding: 20,
    boxShadow: "0 8px 20px rgba(16,24,40,0.04)",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
  },

  avatarBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    background:
      "linear-gradient(135deg, #51A2FF, #9B42FF 60%, #AD46FF)",
    color: "#FFF",
    fontWeight: 700,
  },

  skillChip: {
    padding: "4px 12px",
    marginRight: 8,
    borderRadius: 20,
    border: "1px solid rgba(255,255,190,1)",
    backgroundColor: "rgba(255,255,190,1)",
    fontSize: 14,
    whiteSpace: "nowrap",
  },

  moreChip: {
    padding: "4px 12px",
    borderRadius: 20,
    backgroundColor: "rgba(255,255,190,1)",
    fontSize: 11,
  },

  // small helpers
  label: { fontSize: 15 },
  value: { marginTop: 4, fontSize: 13, fontWeight: 500 },
  valueHighlight: { color: "rgba(124,60,255,1)" },

  emptyWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 40,
    gridColumn: "1 / -1",
  },

  fab: {
    position: "fixed",
    right: 32,
    bottom: 32,
    width: 64,
    height: 64,
    borderRadius: "50%",
    backgroundColor: "rgba(124,60,255,1)",
    color: "#FFF",
    fontSize: 32,
    border: "none",
    cursor: "pointer",
    boxShadow: "0 8px 16px rgba(124,60,255,0.4)",
  },
};

// ---------------------------- helpers ----------------------------
function formatBudget(val) {
  if (!val) return 0;
  const num = Number(val);
  if (num >= 100000) return (num / 100000).toFixed(1) + "L";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num;
}

function getInitials(title) {
  if (!title) return "";
  const w = title.trim().split(" ");
  if (w.length > 1) return (w[0][0] + w[1][0]).toUpperCase();
  return w[0][0].toUpperCase();
}

// ---------------------------- MAIN COMPONENT ----------------------------
export default function BuildProfileScreenWithEdit() {
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  const collapsed = useSidebar();

  // Profile state
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    title: "",
    about: "",
    skills: [],
    tools: [],
    profileImage: "",
    location: "",
  });

  // Portfolio
  const [portfolio, setPortfolio] = useState([]);
  const [isPortfolioPopupOpen, setIsPortfolioPopupOpen] = useState(false);

  // Inline edit states
  const [editingAbout, setEditingAbout] = useState(false);
  const [editingSkillsTools, setEditingSkillsTools] = useState(false);
  const [tempAbout, setTempAbout] = useState("");
  const [tempSkills, setTempSkills] = useState([]);
  const [tempTools, setTempTools] = useState([]);
  const skillOptions = ["React", "Node", "Flutter", "Figma", "UI/UX"];
  const toolOptions = ["VSCode", "Figma", "Git", "Photoshop", "Canva"];

  // Portfolio edit popup
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Posted Jobs (Works + 24 Hours)
  const [selectedJobsTab, setSelectedJobsTab] = useState("Works");
  const [searchText, setSearchText] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [services, setServices] = useState([]);
  const [jobs24, setJobs24] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [jobs24Loading, setJobs24Loading] = useState(true);
  const [showAll, setShowAll] = useState(false);



  // ------------------ auth + profile + portfolio listeners ------------------
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);

    // fetch user profile once
    getDoc(userRef).then((snap) => {
      if (snap.exists()) {
        setProfileData((prev) => ({ ...prev, ...snap.data() }));
      }
    });

    // portfolio realtime
    const q = query(
      collection(db, "users", user.uid, "portfolio"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setPortfolio(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [user, db]);

  // ------------------ services (Works) listener ------------------
  useEffect(() => {
    if (!user) return;
    setServicesLoading(true);

    const q = query(collection(db, "services"), where("userId", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      arr.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setServices(arr);
      setServicesLoading(false);
    });

    return () => unsub();
  }, [user, db]);

  // ------------------ service_24h listener ------------------
  useEffect(() => {
    if (!user) return;
    setJobs24Loading(true);

    const q = query(collection(db, "service_24h"), where("userId", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      arr.sort(
        (a, b) =>
          (b.created_at?.seconds || b.createdAt?.seconds || 0) -
          (a.created_at?.seconds || a.createdAt?.seconds || 0)
      );
      setJobs24(arr);
      setJobs24Loading(false);
    });

    return () => unsub();
  }, [user, db]);

  // ------------------ updateField util ------------------
  const updateField = async (field, value) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { [field]: value }, { merge: true });
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  // ------------------ LaunchURL ------------------
  const LaunchURL = (url) => url && window.open(url, "_blank");

  // ------------------ About handlers ------------------
  const startEditAbout = () => {
    setTempAbout(profileData.about || "");
    setEditingAbout(true);
    setEditingSkillsTools(false);
  };
  const cancelEditAbout = () => {
    setTempAbout("");
    setEditingAbout(false);
  };
  const saveEditAbout = async () => {
    await updateField("about", tempAbout);
    setTempAbout("");
    setEditingAbout(false);
  };

  // ------------------ Skills/Tools handlers ------------------
  const startEditSkillsTools = () => {
    setTempSkills(Array.isArray(profileData.skills) ? profileData.skills : []);
    setTempTools(Array.isArray(profileData.tools) ? profileData.tools : []);
    setEditingSkillsTools(true);
    setEditingAbout(false);
  };
  const cancelEditSkillsTools = () => {
    setTempSkills([]);
    setTempTools([]);
    setEditingSkillsTools(false);
  };
  const saveEditSkillsTools = async () => {
    await updateField("skills", tempSkills || []);
    await updateField("tools", tempTools || []);
    setTempSkills([]);
    setTempTools([]);
    setEditingSkillsTools(false);
  };

  // ------------------ Portfolio edit / delete ------------------
  const handleOpenEdit = (p, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setEditingPortfolio(p);
    setIsEditOpen(true);
  };

  const handleDelete = async (p, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    try {
      const ok = window.confirm("Delete this portfolio item? This cannot be undone.");
      if (!ok) return;
      await deleteDoc(doc(db, "users", user.uid, "portfolio", p.id));
      alert("Deleted");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed");
    }
  };

  const handleSaveEdit = async (updated) => {
    try {
      const ref = doc(db, "users", user.uid, "portfoli0", updated.id);
      const toUpdate = { ...updated };
      delete toUpdate.id;
      await updateDoc(ref, toUpdate);
      setIsEditOpen(false);
      setEditingPortfolio(null);
      alert("Portfolio updated");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed");
    }
  };

  // ------------------ Posted Jobs helpers ------------------
  async function togglePause(job, collectionName, e) {
    if (e && e.stopPropagation) e.stopPropagation();
    try {
      await updateDoc(doc(db, collectionName, job.id), {
        paused: !job.paused,
        pausedAt: !job.paused ? serverTimestamp() : null,
      });
    } catch (err) {
      console.error("togglePause failed", err);
    }
  }

  const filterSearch = (arr) => {
    if (!searchText) return arr;
    const t = searchText.toLowerCase();
    return arr.filter((i) => (i.title || "").toLowerCase().includes(t));
  };

  const sortArr = (arr) => {
    if (sortOption === "paused") return arr.filter((i) => i.paused);

    if (sortOption === "oldest")
      return [...arr].sort(
        (a, b) =>
          (a.createdAt?.seconds || a.created_at?.seconds || 0) -
          (b.createdAt?.seconds || b.created_at?.seconds || 0)
      );

    return [...arr].sort(
      (a, b) =>
        (b.createdAt?.seconds || b.created_at?.seconds || 0) -
        (a.createdAt?.seconds || a.created_at?.seconds || 0)
    );
  };

  const finalServices = sortArr(filterSearch(services));
  const final24 = sortArr(filterSearch(jobs24));

  const renderEmptyState = (btnText, onClick) => (
    <div style={pageStyles.emptyWrap}>
      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{btnText === "Create Service" ? "No services yet" : "No 24h services yet"}</div>
      <div style={{ color: "#666", marginBottom: 12, textAlign: "center", maxWidth: 600 }}>
        Add your service to show in Posted Jobs. Clients can view and hire you.
      </div>
      <button
        onClick={onClick}
        style={{
          height: 44,
          padding: "0 22px",
          borderRadius: 30,
          backgroundColor: "rgba(253,253,150,1)",
          border: "none",
          color: "#000",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        {btnText}
      </button>
    </div>
  );

  // ------------------ WorkCard & Card24 components (inline) ------------------
  const WorkCard = (job) => {
    const initials = getInitials(job.title);

    return (
      <div
        key={job.id}
        style={pageStyles.card}
        onClick={() =>
          navigate(`/serviceDetailsModel/${job.id}`, { state: { job } })
        }
      >
        {/* right arrow icon placeholder (you had an image in Card.jsx) */}
        <div style={{ position: "absolute", top: 18, right: 18, width: 16, height: 16 }} />

        <div style={{ display: "flex" }}>
          <div
            style={{
              ...pageStyles.avatarBox,
              width: 56,
              height: 66,
              fontSize: 20,
              marginLeft: "1px",
              paddingLeft: "14px",
              textAlign: "center",
            }}
          >
            {initials}
          </div>

          <div style={{ flex: 1, marginLeft: 27 }}>
            <div style={{ fontWeight: 500, marginBottom: 4, fontSize: 16, textTransform: "uppercase" }}>
              {job.title}
            </div>

            <div style={{ marginTop: 4, height: 32, overflowX: "auto", display: "flex", alignItems: "center" }}>
              {job.skills?.slice(0, 2).map((s, i) => (
                <div key={i} style={pageStyles.skillChip}>
                  {s}
                </div>
              ))}
              {job.skills?.length > 2 && (
                <div style={pageStyles.moreChip}>+{job.skills.length - 2}</div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
          <div>
            <div style={pageStyles.label}>Budget</div>
            <div style={{ ...pageStyles.value, ...pageStyles.valueHighlight }}>
              ₹{formatBudget(job.budget_from || job.budget)}
            </div>
          </div>

          <div>
            <div style={pageStyles.label}>Timeline</div>
            <div style={pageStyles.value}>{job.deliveryDuration || "N/A"}</div>
          </div>

          <div>
            <div style={pageStyles.label}>Location</div>
            <div style={pageStyles.value}>{job.location || "Remote"}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
          <button
            style={{
              flex: 1,
              height: 40,
              borderRadius: 30,
              border: "1px solid #BDBDBD",
              backgroundColor: "#FFFFFF",
              fontSize: 13,
              fontWeight: 600,
            }}
            onClick={(e) => togglePause(job, "services", e)}
          >
            {job.paused ? "Unpause" : "Pause Service"}
          </button>

          <button
            style={{
              flex: 1,
              height: 40,
              borderRadius: 30,
              border: "none",
              backgroundColor: "rgba(253,253,150,1)",
              fontWeight: 700,
            }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/freelance-dashboard/freelanceredit-service/${job.id}`, {
                state: { jobId: job.id, jobData: job },
              });
            }}
          >
            Edit Service
          </button>
        </div>
      </div>
    );
  };

  const Card24 = (job) => {
    const initials = getInitials(job.title);

    return (
      <div
        key={job.id}
        style={pageStyles.card}
        onClick={() => navigate(`/service-24h/${job.id}`, { state: { job } })}
      >
        <div style={{ position: "absolute", top: 18, right: 18, width: 16, height: 16 }} />

        <div style={{ display: "flex" }}>
          <div
            style={{
              ...pageStyles.avatarBox,
              width: 60,
              height: 60,
              fontSize: 22,
            }}
          >
            {initials}
          </div>

          <div style={{ flex: 1, marginLeft: 12 }}>
            <div style={{ fontWeight: 500, marginBottom: 4, fontSize: 16 }}>{job.title}</div>

            <div style={{ marginTop: 4, height: 32, overflowX: "auto", display: "flex", alignItems: "center" }}>
              {job.skills?.slice(0, 2).map((s, i) => (
                <div key={i} style={pageStyles.skillChip}>
                  {s}
                </div>
              ))}
              {job.skills?.length > 2 && (
                <div style={pageStyles.moreChip}>+{job.skills.length - 2}</div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
          <div>
            <div style={pageStyles.label}>Budget</div>
            <div style={{ ...pageStyles.value, ...pageStyles.valueHighlight }}>
              ₹{formatBudget(job.budget_from || job.budget)}
            </div>
          </div>

          <div>
            <div style={pageStyles.label}>Timeline</div>
            <div style={pageStyles.value}>{job.deliveryDuration || "N/A"}</div>
          </div>

          <div>
            <div style={pageStyles.label}>Location</div>
            <div style={pageStyles.value}>{job.location || "Remote"}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
          <button
            style={{
              flex: 1,
              height: 40,
              borderRadius: 30,
              border: "1px solid #BDBDBD",
              backgroundColor: "#FFFFFF",
              fontSize: 13,
              fontWeight: 600,
            }}
            onClick={(e) => togglePause(job, "service_24h", e)}
          >
            {job.paused ? "Unpause" : "Pause Service"}
          </button>

          <button
            style={{
              flex: 1,
              height: 40,
              borderRadius: 30,
              border: "none",
              backgroundColor: "rgba(253,253,150,1)",
              fontWeight: 700,
            }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/service-24h-edit/${job.id}`, { state: { job } });
            }}
          >
            Edit Service
          </button>
        </div>
      </div>
    );
  };

  // ------------------ render posted jobs panel ------------------
  // const renderPostedJobsPanel = () => {
  //   return (
  //     <Box sx={{ mt: 4 }}>
  //       <Box style={pageStyles.jobsContainer}>
  //         <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  //           <Typography sx={{ fontSize: 20, fontWeight: 700 }}>Posted Jobs</Typography>

  //           <Box style={{ display: "flex", alignItems: "center", gap: 12 }}>
  //             <div style={pageStyles.toggleBarWrapper}>
  //               <div style={pageStyles.toggleGroup}>
  //                 <div
  //                   tabIndex={0}
  //                   onClick={() => setSelectedJobsTab("Works")}
  //                   style={pageStyles.toggleButton(selectedJobsTab === "Works")}
  //                 >
  //                   Works
  //                 </div>

  //                 <div
  //                   tabIndex={0}
  //                   onClick={() => setSelectedJobsTab("24 Hours")}
  //                   style={pageStyles.toggleButton(selectedJobsTab === "24 Hours")}
  //                 >
  //                   24 Hours
  //                 </div>
  //               </div>
  //             </div>
  //           </Box>
  //         </Box>

  //         <Box style={pageStyles.searchSortRow}>
  //           <div style={{ ...pageStyles.searchContainer, marginTop: 8 }}>
  //             <input
  //               style={{ border: "none", outline: "none", flex: 1, fontSize: 14 }}
  //               placeholder="Search services"
  //               value={searchText}
  //               onChange={(e) => setSearchText(e.target.value)}
  //             />
  //           </div>

  //           <div style={{ minWidth: 120 }}>
  //             <select
  //               value={sortOption}
  //               onChange={(e) => setSortOption(e.target.value)}
  //               style={{
  //                 width: "100%",
  //                 height: 40,
  //                 borderRadius: 12,
  //                 border: "1px solid #E0E0E0",
  //                 paddingLeft: 10,
  //               }}
  //             >
  //               <option value="newest">Newest</option>
  //               <option value="oldest">Oldest</option>
  //               <option value="paused">Paused</option>
  //             </select>
  //           </div>
  //         </Box>
  //         {/* two post and view more */}

  //         <div style={pageStyles.cardsWrap}>
  //           {selectedJobsTab === "Works" ? (
  //             servicesLoading ? (
  //               <div style={{ marginTop: 40 }}>Loading...</div>
  //             ) : finalServices.length === 0 ? (
  //               renderEmptyState("Create Service", () => navigate("/freelance-dashboard/add-service-form"))
  //             ) : (
  //               <>
  //                 {/* SHOW ONLY 2 CARDS UNLESS VIEW MORE CLICKED */}
  //                 {(showAll ? finalServices : finalServices.slice(0, 2)).map((s) => WorkCard(s))}

                  
                 
  //               </>
  //             )
  //           ) : jobs24Loading ? (
  //             <div style={{ marginTop: 40 }}>Loading...</div>
  //           ) : final24.length === 0 ? (
  //             renderEmptyState("Create 24h Service", () => navigate("/freelance-dashboard/add-service-form"))
  //           ) : (
  //             <>
  //               {/* SHOW ONLY 2 CARDS UNLESS VIEW MORE CLICKED */}
  //               {(showAll ? final24 : final24.slice(0, 2)).map((j) => Card24(j))}

              
  //             </>
  //           )}
  //         </div>

  //       </Box>
  //     </Box>
  //   );
  // };


  const renderPostedJobsPanel = () => {
  const isMobile = window.innerWidth <= 768;

  return (
    <Box sx={{ mt: 4 }}>
      <Box style={pageStyles.jobsContainer}>
        {/* HEADER ROW */}
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 12 : 0,
          }}
        >
          <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
            Posted Jobs
          </Typography>

          <Box style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={pageStyles.toggleBarWrapper}>
              <div style={pageStyles.toggleGroup}>
                <div
                  tabIndex={0}
                  onClick={() => setSelectedJobsTab("Works")}
                  style={pageStyles.toggleButton(
                    selectedJobsTab === "Works"
                  )}
                >
                  Works
                </div>

                <div
                  tabIndex={0}
                  onClick={() => setSelectedJobsTab("24 Hours")}
                  style={pageStyles.toggleButton(
                    selectedJobsTab === "24 Hours"
                  )}
                >
                  24 Hours
                </div>
              </div>
            </div>
          </Box>
        </Box>

        {/* SEARCH + SORT */}
        <Box
          style={{
            ...pageStyles.searchSortRow,
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 12 : 16,
            alignItems: isMobile ? "stretch" : "center",
          }}
        >
          <div
            style={{
              ...pageStyles.searchContainer,
              marginTop: 8,
              width: "100%",
            }}
          >
            <input
              style={{
                border: "none",
                outline: "none",
                flex: 1,
                fontSize: 14,
              }}
              placeholder="Search services"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div style={{ minWidth: isMobile ? "100%" : 120 }}>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={{
                width: "100%",
                height: 40,
                borderRadius: 12,
                border: "1px solid #E0E0E0",
                paddingLeft: 10,
              }}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </Box>

{/* CARDS */}
<div
  style={{
    ...pageStyles.cardsWrap,

    /* ❌ center panna vendam */
    justifyContent: "flex-start",

    /* ✅ mobile la single column but card width same */
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",

    gap: 20,
    width: "100%",
  }}
>
  {selectedJobsTab === "Works" ? (
    servicesLoading ? (
      <div style={{ marginTop: 40 }}>Loading...</div>
    ) : finalServices.length === 0 ? (
      renderEmptyState("Create Service", () =>
        navigate("/freelance-dashboard/add-service-form")
      )
    ) : (
      <>
        {(showAll ? finalServices : finalServices.slice(0, 2)).map((s) =>
          WorkCard(s)
        )}
      </>
    )
  ) : jobs24Loading ? (
    <div style={{ marginTop: 40 }}>Loading...</div>
  ) : final24.length === 0 ? (
    renderEmptyState("Create 24h Service", () =>
      navigate("/freelance-dashboard/add-service-form")
    )
  ) : (
    <>
      {(showAll ? final24 : final24.slice(0, 2)).map((j) =>
        Card24(j)
      )}
    </>
  )}
</div>

      </Box>
    </Box>
  );
};


  // ------------------ JSX return ------------------
  return (
    <Box sx={{ ...pageStyles.pageWrapper, marginLeft: collapsed ? "-190px" : "0px", transition: "margin-left 0.25s ease" }}>
      <Box sx={pageStyles.content}>
        
        <Box
          sx={{
            background: "linear-gradient(90deg, #f8ffb0, #e3ffd9)",
            borderRadius: 3,
            p: 4,
            mb: 6,
            display: "flex",
            alignItems: "center",
            gap: 3,
            position: "relative",
          }}
        >
          <img
            src={profileData.profileImage || "/user-placeholder.jpg"}
            alt="profile"
            style={{
              width: 95,
              height: 95,
              borderRadius: "50%",
              border: "4px solid white",
              objectFit: "cover",
            }}
          />

          <Box>
            <Typography sx={{ fontSize: 24, fontWeight: 700 }}>
              {profileData.firstName} {profileData.lastName}
            </Typography>
            <Typography sx={{ color: "gray", fontSize: 15 }}>{profileData.location}</Typography>
            <Typography
              sx={{
                mt: 1,
                display: "inline-block",
                bgcolor: "#b6fab2",
                px: 2,
                py: 0.5,
                borderRadius: 1,
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {profileData.title}
            </Typography>
          </Box>

          {/* <Button
            variant="contained"
            sx={{ position: "absolute", right: 20, top: 20, borderRadius: 4, textTransform: "none" }}
          >
            Edit Profile
          </Button> */}
        </Box>

        {/* MAIN ROW */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, alignItems: "flex-start", mb: 4 }}>
          {/* ABOUT CARD */}
          <Box
            sx={{
              background: "#fff",
              borderRadius: "14px",
              p: 3,
              flex: "2 1 600px",
              minWidth: 300,
              boxShadow: "0 8px 20px rgba(12,20,31,0.06)",
              position: "relative",
            }}
          >
            <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 1 }}>About</Typography>
            <IconButton
              sx={{ position: "absolute", right: 12, top: 12 }}
              onClick={startEditAbout}
              aria-label="edit about"
            >
              <FiEdit2 />
            </IconButton>

            <Typography sx={{ color: "#444", lineHeight: 1.6 }}>
              {profileData.about || "Add a short description about yourself to let people know what you do."}
            </Typography>

            {editingAbout && (
              <Box sx={{ mt: 2, borderTop: "1px solid #eee", pt: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  value={tempAbout}
                  onChange={(e) => setTempAbout(e.target.value)}
                  placeholder="Write about yourself..."
                />
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  <Button variant="contained" onClick={saveEditAbout}>
                    Save
                  </Button>
                  <Button variant="outlined" onClick={cancelEditAbout}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}
          </Box>

          {/* SKILLS & TOOLS */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, flex: "1 1 320px", minWidth: 300 }}>
            <Box sx={{ background: "#fff", borderRadius: "14px", p: 2.5, boxShadow: "0 8px 20px rgba(12,20,31,0.06)", position: "relative" }}>
              <Typography sx={{ fontSize: 16, fontWeight: 700 }}>Skills & Tools</Typography>

              <IconButton
                sx={{ position: "absolute", right: 12, top: 12 }}
                onClick={startEditSkillsTools}
                aria-label="edit skills and tools"
              >
                <FiEdit2 />
              </IconButton>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 13 }}>Skills</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                    {Array.isArray(profileData.skills) && profileData.skills.length ? (
                      profileData.skills.map((s) => (
                        <Box key={s} sx={{ px: 1.5, py: 0.6, borderRadius: "12px", background: "#FFF8D9", fontWeight: 700, fontSize: 13, border: "1px solid rgba(0,0,0,0.06)" }}>
                          {s}
                        </Box>
                      ))
                    ) : (
                      <Typography color="gray">No skills added</Typography>
                    )}
                  </Box>
                </Box>

                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 13 }}>Tools</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                    {Array.isArray(profileData.tools) && profileData.tools.length ? (
                      profileData.tools.map((t) => (
                        <Box key={t} sx={{ px: 1.5, py: 0.6, borderRadius: "12px", background: "#E8F8FF", fontWeight: 700, fontSize: 13, border: "1px solid rgba(0,0,0,0.06)" }}>
                          {t}
                        </Box>
                      ))
                    ) : (
                      <Typography color="gray">No tools added</Typography>
                    )}
                  </Box>
                </Box>
              </Box>

              {editingSkillsTools && (
                <Box sx={{ mt: 2, borderTop: "1px solid #eee", pt: 2 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>Edit Skills</Typography>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={skillOptions}
                    value={tempSkills}
                    onChange={(e, v) => setTempSkills(v)}
                    renderInput={(params) => <TextField {...params} placeholder="Add skills (press Enter)" />}
                  />

                  <Typography sx={{ fontSize: 13, fontWeight: 600, mt: 2, mb: 1 }}>Edit Tools</Typography>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={toolOptions}
                    value={tempTools}
                    onChange={(e, v) => setTempTools(v)}
                    renderInput={(params) => <TextField {...params} placeholder="Add tools (press Enter)" />}
                  />

                  <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                    <Button variant="contained" onClick={saveEditSkillsTools}>Save</Button>
                    <Button variant="outlined" onClick={cancelEditSkillsTools}>Cancel</Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* PORTFOLIO SECTION */}
        <Box sx={{ bgcolor: "#fff", borderRadius: 3, p: 3, boxShadow: "0 8px 20px rgba(12,20,31,0.04)" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography sx={{ fontSize: 20, fontWeight: 700 }}>Portfolio</Typography>
            <Button variant="contained" size="small" sx={{ borderRadius: 4, textTransform: "none" }} onClick={() => setIsPortfolioPopupOpen(true)}>
              Add Portfolio
            </Button>
          </Box>

          <Box sx={{ display: "flex", gap: 2, overflowX: "auto", overflowY: "hidden", pb: 2, pl: 0, width: "100%", maxWidth: "100%", '&::-webkit-scrollbar': { height: 8 }, '&::-webkit-scrollbar-thumb': { background: "#ddd", borderRadius: 10 } }}>
            {portfolio.map((p) => (
              <Box
                key={p.id}
                sx={{
                  width: 300,
                  flexShrink: 0,
                  bgcolor: "#00c2e8",
                  borderRadius: 2,
                  p: 0,
                  boxShadow: "0 8px 20px rgba(12,20,31,0.06)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  overflow: "hidden",
                  position: "relative",
                  mr: 1.5,
                }}
                onClick={() => LaunchURL(p.projectUrl)}
              >
                <Box sx={{ height: 140, bgcolor: "#00b7db" }}>
                  <img src={p.imageUrl || "/placeholder-portfolio.jpg"} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </Box>

                <Box sx={{ bgcolor: "#fff", p: 2, height: "100%", position: "relative" }}>
                  <Box sx={{ position: "absolute", right: 8, top: 8, display: "flex", gap: 1 }}>
                    <IconButton size="small" onClick={(e) => handleOpenEdit(p, e)} aria-label="edit portfolio"><FiEdit2 /></IconButton>
                    <IconButton size="small" onClick={(e) => handleDelete(p, e)} aria-label="delete portfolio"><FiTrash2 color="#e53935" /></IconButton>
                  </Box>

                  <Typography sx={{ fontWeight: 700 }}>{p.title}</Typography>
                  <Typography sx={{ fontSize: 13, color: "#555", mt: 1 }}>{p.description}</Typography>

                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
                    {(p.skills || []).map((s) => (
                      <Box key={s} sx={{ px: 1, py: 0.5, bgcolor: "#FFF8D9", borderRadius: 10, fontSize: 12, fontWeight: 700 }}>{s}</Box>
                    ))}
                    {(p.tools || []).map((t) => (
                      <Box key={t} sx={{ px: 1, py: 0.5, bgcolor: "#E8F8FF", borderRadius: 10, fontSize: 12, fontWeight: 700 }}>{t}</Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* AddPortfolioPopup (external component you already have) */}
        <AddPortfolioPopup open={isPortfolioPopupOpen} onClose={() => setIsPortfolioPopupOpen(false)} portfolio={null} />

        {/* EditPortfolioPopup */}
        {isEditOpen && editingPortfolio && (
          <EditPortfolioPopup
            open={isEditOpen}
            onClose={() => {
              setIsEditOpen(false);
              setEditingPortfolio(null);
            }}
            portfolio={editingPortfolio}
            onSave={handleSaveEdit}
          />
        )}

        {/* POSTED JOBS (Works | 24 Hours) */}
        {renderPostedJobsPanel()}

        {/* FAB (create service) */}
        <button style={pageStyles.fab} onClick={() => navigate("/freelance-dashboard/add-service-form")}>+</button>
      </Box>
    </Box>
  );
}

// --------------------------- EditPortfolioPopup (same as your file) ---------------------------
function EditPortfolioPopup({ open, onClose, portfolio, onSave }) {
  const [title, setTitle] = useState(portfolio?.title || "");
  const [description, setDescription] = useState(portfolio?.description || "");
  const [projectUrl, setProjectUrl] = useState(portfolio?.projectUrl || "");
  const [imageUrl, setImageUrl] = useState(portfolio?.imageUrl || "");
  const [skillsText, setSkillsText] = useState((portfolio?.skills || []).join(", "));
  const [toolsText, setToolsText] = useState((portfolio?.tools || []).join(", "));

  useEffect(() => {
    // keep in sync when portfolio changes (e.g., open new item)
    setTitle(portfolio?.title || "");
    setDescription(portfolio?.description || "");
    setProjectUrl(portfolio?.projectUrl || "");
    setImageUrl(portfolio?.imageUrl || "");
    setSkillsText((portfolio?.skills || []).join(", "));
    setToolsText((portfolio?.tools || []).join(", "));
  }, [portfolio]);

  const handleSave = () => {
    const skills = skillsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const tools = toolsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const updated = {
      id: portfolio.id,
      title: title.trim(),
      description: description.trim(),
      projectUrl: projectUrl.trim(),
      imageUrl: imageUrl.trim(),
      skills,
      tools,
    };

    onSave(updated);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { bgcolor: "#ffffff", borderRadius: "20px", p: 1, boxShadow: "0px 10px 40px rgba(0,0,0,0.12)" } }}>
      <DialogTitle sx={{ textAlign: "center", fontWeight: 700 }}>Edit Portfolio</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="Project Title" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
          <TextField label="Project description" fullWidth multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your project briefly" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
          <TextField label="Project url" fullWidth value={projectUrl} onChange={(e) => setProjectUrl(e.target.value)} placeholder="https://" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
          <TextField label="Image url" fullWidth value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https:// (optional)" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
          <TextField label="Skills (comma separated)" fullWidth value={skillsText} onChange={(e) => setSkillsText(e.target.value)} placeholder="React, Node, Figma" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
          <TextField label="Tools (comma separated)" fullWidth value={toolsText} onChange={(e) => setToolsText(e.target.value)} placeholder="VSCode, Git" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="outlined" onClick={onClose} sx={{ borderColor: "rgba(124, 60, 255, 1)", borderRadius: "10px", color: "rgba(124, 60, 255, 1)", border: "2px solid #7C3CFF", textTransform: "none", width: "120px" }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} sx={{ bgcolor: "rgba(124, 60, 255, 1)", borderRadius: "10px", color: "white", textTransform: "none", width: "120px" }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}