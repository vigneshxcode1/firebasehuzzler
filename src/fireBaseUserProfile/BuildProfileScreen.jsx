

// BuildProfileScreenWithEdit.jsx
import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
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
import AddPortfolioPopup from "../Firebaseaddporfoilo/AddPortfolioPopup.jsx";

export default function BuildProfileScreen() {
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

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

  const [portfolio, setPortfolio] = useState([]);
  const [isPortfolioPopupOpen, setIsPortfolioPopupOpen] = useState(false);

  // Inline edit states (Option B)
  const [editingAbout, setEditingAbout] = useState(false);
  const [editingSkillsTools, setEditingSkillsTools] = useState(false);

  const [tempAbout, setTempAbout] = useState("");
  const [tempSkills, setTempSkills] = useState([]);
  const [tempTools, setTempTools] = useState([]);

  // Edit portfolio popup state
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const skillOptions = ["React", "Node", "Flutter", "Figma", "UI/UX"];
  const toolOptions = ["VSCode", "Figma", "Git", "Photoshop", "Canva"];

  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    getDoc(userRef).then((snap) => {
      if (snap.exists()) setProfileData((prev) => ({ ...prev, ...snap.data() }));
    });

    const q = query(
      collection(db, "users", user.uid, "portfolio"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setPortfolio(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [user]);

  const updateField = async (field, value) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { [field]: value }, { merge: true });
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const LaunchURL = (url) => url && window.open(url, "_blank");

  // Inline about handlers
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

  // Inline skills/tools handlers
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

  // Open edit popup for a portfolio item
  const handleOpenEdit = (p, e) => {
    // prevent parent card click
    if (e && e.stopPropagation) e.stopPropagation();
    setEditingPortfolio(p);
    setIsEditOpen(true);
  };

  // Delete portfolio item
  const handleDelete = async (p, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    try {
      const ok = window.confirm("Delete this portfolio item? This cannot be undone.");
      if (!ok) return;
      await deleteDoc(doc(db, "users", user.uid, "portfolio", p.id));
      // onSnapshot will remove it automatically
      alert("Deleted");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed");
    }
  };

  // Save from edit popup
  const handleSaveEdit = async (updated) => {
    try {
      const ref = doc(db, "users", user.uid, "portfolio", updated.id);
      // ensure we don't remove createdAt etc. Only update fields from updated object
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

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#F5F6FA",
        pb: 10,
        overflowX: "hidden",
      }}
    >
      {/* TOP SUMMARY */}
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

        <Button
          variant="contained"
          sx={{ position: "absolute", right: 20, top: 20, borderRadius: 4, textTransform: "none" }}
        >
          Edit Profile
        </Button>
      </Box>

      {/* MAIN ROW */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          alignItems: "flex-start",
          mb: 4,
          px: 1,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* ABOUT CARD */}
        <Box
          sx={{
  

            borderRadius: "14px",
            p: 3,
            flex: "2 1 600px",
            minWidth: 300,
            boxShadow: "0 8px 20px rgba(12,20,31,0.06)",
            position: "relative",
            boxSizing: "border-box",
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            flex: "1 1 320px",
            minWidth: 300,
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              background: "#fff",
              borderRadius: "14px",
              p: 2.5,
              boxShadow: "0 8px 20px rgba(12,20,31,0.06)",
              position: "relative",
              boxSizing: "border-box",
            }}
          >
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
                      <Box
                        key={s}
                        sx={{
                          px: 1.5,
                          py: 0.6,
                          borderRadius: "12px",
                          background: "#FFF8D9",
                          fontWeight: 700,
                          fontSize: 13,
                          border: "1px solid rgba(0,0,0,0.06)",
                        }}
                      >
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
                      <Box
                        key={t}
                        sx={{
                          px: 1.5,
                          py: 0.6,
                          borderRadius: "12px",
                          background: "#E8F8FF",
                          fontWeight: 700,
                          fontSize: 13,
                          border: "1px solid rgba(0,0,0,0.06)",
                        }}
                      >
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
                  <Button variant="contained" onClick={saveEditSkillsTools}>
                    Save
                  </Button>
                  <Button variant="outlined" onClick={cancelEditSkillsTools}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* PORTFOLIO SECTION */}
      <Box sx={{ bgcolor: "#fff", borderRadius: 3, p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography sx={{ fontSize: 20, fontWeight: 700 }}>Portfolio</Typography>
          <Button
            variant="contained"
            size="small"
            sx={{ borderRadius: 4, textTransform: "none" }}
            onClick={() => setIsPortfolioPopupOpen(true)}
          >
            Add Portfolio
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            overflowY: "hidden",
            pb: 2,
            pl: 0,
            width: "100%",
            maxWidth: "100%",
            '&::-webkit-scrollbar': { height: 8 },
            '&::-webkit-scrollbar-thumb': { background: "#ddd", borderRadius: 10 },
          }}
        >
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
              }}
              onClick={() => LaunchURL(p.projectUrl)}
            >
              {/* thumbnail */}
              <Box sx={{ height: 140, bgcolor: "#00b7db" }}>
                <img
                  src={p.imageUrl || "/placeholder-portfolio.jpg"}
                  alt={p.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>

              {/* content area */}
              <Box sx={{ bgcolor: "#fff", p: 2, height: "100%", position: "relative" }}>
                {/* Edit + Delete buttons (stop propagation) */}
                <Box sx={{ position: "absolute", right: 8, top: 8, display: "flex", gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={(e) => handleOpenEdit(p, e)}
                    aria-label="edit portfolio"
                  >
                    <FiEdit2 />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={(e) => handleDelete(p, e)}
                    aria-label="delete portfolio"
                  >
                    <FiTrash2 color="#e53935" />
                  </IconButton>
                </Box>

                <Typography sx={{ fontWeight: 700 }}>{p.title}</Typography>
                <Typography sx={{ fontSize: 13, color: "#555", mt: 1 }}>{p.description}</Typography>

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
                  {(p.skills || []).map((s) => (
                    <Box
                      key={s}
                      sx={{
                        px: 1,
                        py: 0.5,
                        bgcolor: "#FFF8D9",
                        borderRadius: 10,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {s}
                    </Box>
                  ))}

                  {(p.tools || []).map((t) => (
                    <Box
                      key={t}
                      sx={{
                        px: 1,
                        py: 0.5,
                        bgcolor: "#E8F8FF",
                        borderRadius: 10,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {t}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* existing AddPortfolioPopup (unchanged) */}
      <AddPortfolioPopup
        open={isPortfolioPopupOpen}
        onClose={() => setIsPortfolioPopupOpen(false)}
        portfolio={null}   // 🟢 always empty
      />

      {/* EditPopup */}
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
    </Box>
  );
}

/* ---------------------------
   EditPortfolioPopup component
   - matches the fields in your image (title, description, project url, image url, skills)
   - onSave -> calls onSave(updatedObject) provided by parent
   --------------------------- */
function EditPortfolioPopup({ open, onClose, portfolio, onSave }) {
  const [title, setTitle] = useState(portfolio.title || "");
  const [description, setDescription] = useState(portfolio.description || "");
  const [projectUrl, setProjectUrl] = useState(portfolio.projectUrl || portfolio.projectUrl || "");
  const [imageUrl, setImageUrl] = useState(portfolio.imageUrl || "");
  const [skillsText, setSkillsText] = useState((portfolio.skills || []).join(", "));
  const [toolsText, setToolsText] = useState((portfolio.tools || []).join(", "));

  // Keep inputs synced if portfolio changes
  useEffect(() => {
    if (open && portfolio == null) {
      setTitle("");
      setDescription("");
      setProjectUrl("");
      setImageUrl("");
      setSkills([]);
      setTools([]);
    }
  }, [open, portfolio]);


  const handleSave = () => {
    // build arrays from comma-separated inputs
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
      // don't touch createdAt or other fields — parent update will only overwrite these keys
    };

    onSave(updated);
  };

  return (
    <Dialog open={open} 
    onClose={onClose} 
    fullWidth
     maxWidth="sm"
       PaperProps={{
        sx: {
          bgcolor: "#ffffff",                 
          borderRadius: "20px",               
          p: 1,
          boxShadow: "0px 10px 40px rgba(0,0,0,0.12)", 
        },
      }}
     >
      <DialogTitle sx={{ textAlign: "center", fontWeight: 700 }}>Edit Portfolio</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 ,    }}>
          <TextField
            label="Project Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
             sx={{
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
    },
  }}
          />

          <TextField
            label="Project description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your project briefly"
                      sx={{
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
    },
  }}
          />

          <TextField
            label="Project url"
            fullWidth
            value={projectUrl}
            onChange={(e) => setProjectUrl(e.target.value)}
            placeholder="https://"
                      sx={{
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
    },
  }}
          />

          <TextField
            label="Image url"
            fullWidth
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https:// (optional)"
                      sx={{
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
    },
  }}
          />

          <TextField
            label="Skills (comma separated)"
            fullWidth
            value={skillsText}
            onChange={(e) => setSkillsText(e.target.value)}
            placeholder="React, Node, Figma"
                      sx={{
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
    },
  }}
          />

          <TextField
            label="Tools (comma separated)"
            fullWidth
            value={toolsText}
            onChange={(e) => setToolsText(e.target.value)}
            placeholder="VSCode, Git"
                      sx={{
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
    },
  }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="outlined" onClick={onClose} sx={{
          borderColor: "rgba(124, 60, 255, 1)", borderRadius: "10px",
          color: "rgba(124, 60, 255, 1)",
            border: "2px solid #7C3CFF",          
                               
            textTransform: "none",
            width: "120px",
        }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{ bgcolor: "rgba(124, 60, 255, 1)", borderRadius: "10px", color: "white",
            textTransform: "none",
            width: "120px",
             }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}







// BuildProfileScreenWithEdit.jsx
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

