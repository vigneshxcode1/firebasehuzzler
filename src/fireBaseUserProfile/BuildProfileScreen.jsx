
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
} from "firebase/firestore";
import {
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  IconButton,
  Autocomplete,
} from "@mui/material";
import { FiEdit2 } from "react-icons/fi";
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

  // --- Handlers for inline editing (Option B) ---
  const startEditAbout = () => {
    setTempAbout(profileData.about || "");
    setEditingAbout(true);
    // ensure skills/tools panel not open
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

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#F5F6FA",
        pb: 10,
        overflowX: "hidden", // prevent full-page horizontal scroll
      }}
    >
      {/* TOP SUMMARY (yellow gradient) */}
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

      {/* MAIN ROW: ABOUT (left) and SKILLS/TOOLS (right column) */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap", // <-- prevents overflow on small screens
          gap: 3,
          alignItems: "flex-start",
          mb: 4,
          px: 1,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* ABOUT CARD - larger */}
        <Box
          sx={{
            background: "#fff",
            borderRadius: "14px",
            p: 3,
            flex: "2 1 600px", // grow, shrink, base width
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

          {/* Inline editing panel (Option B style) */}
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

        {/* RIGHT COLUMN: merged Skills + Tools card */}
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

            {/* Inline skills/tools editor (Option B) */}
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

        {/* Horizontal scroller row - only this part scrolls */}
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
                width: 300, // fixed width to avoid pushing viewport
                flexShrink: 0,
                bgcolor: "#00c2e8",
                borderRadius: 2,
                p: 0,
                boxShadow: "0 8px 20px rgba(12,20,31,0.06)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                overflow: "hidden",
                cursor: "pointer",
              }}
              onClick={() => LaunchURL(p.projectUrl)}
            >
              {/* top thumbnail */}
              <Box sx={{ height: 140, bgcolor: "#00b7db" }}>
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>

              {/* content area (white card inside) */}
              <Box sx={{ bgcolor: "#fff", p: 2, height: "100%" }}>
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

      <AddPortfolioPopup open={isPortfolioPopupOpen} onClose={() => setIsPortfolioPopupOpen(false)} />
    </Box>
  );
}