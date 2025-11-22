import React, { useState, useEffect } from "react";
import {
  getAuth,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  Button,
  TextField,
  CircularProgress,
  Chip,
  Box,
  Typography,
  Autocomplete,
} from "@mui/material";

import AddPortfolioPopup from "../Firebaseaddporfoilo/AddPortfolioPopup.jsx";


export default function ProfilePage() {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const user = auth.currentUser;

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    title: "",
    about: "",
    skills: [],
    tools: [],
    profileImage: "",
    coverImage: "",
    location: "",
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [portfolio, setPortfolio] = useState([]);
  const [isPortfolioPopupOpen, setIsPortfolioPopupOpen] = useState(false);

  const skillOptions = ["React", "Node", "Flutter", "Figma", "UI/UX"];
  const toolOptions = ["VSCode", "Figma", "Git", "Photoshop", "Canva"];

  // Load user data
  useEffect(() => {
    if (!user) return;
    const userDoc = doc(db, "users", user.uid);
    getDoc(userDoc).then((docSnap) => {
      if (docSnap.exists()) setProfileData((prev) => ({ ...prev, ...docSnap.data() }));
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

  const uploadImage = async (file, folder) => {
    const fileRef = ref(storage, `${folder}/${user.uid}/${Date.now()}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const updatedData = { ...profileData };

      if (profileImageFile) {
        updatedData.profileImage = await uploadImage(profileImageFile, "profile_images");
      }
      if (coverImageFile) {
        updatedData.coverImage = await uploadImage(coverImageFile, "cover_images");
      }

      await setDoc(doc(db, "users", user.uid), updatedData, { merge: true });
      alert("Profile saved successfully ✅");
    } catch (e) {
      console.error("Error saving profile:", e);
      alert("Error saving profile");
    }
    setLoading(false);
  };

  const handleAddSkill = (skill) => {
    if (!skill || profileData.skills.includes(skill) || profileData.skills.length >= 3) return;
    const updatedSkills = [...profileData.skills, skill];
    setProfileData({ ...profileData, skills: updatedSkills });
    setDoc(doc(db, "users", user.uid), { skills: updatedSkills }, { merge: true });
  };

  const handleAddTool = (tool) => {
    if (!tool || profileData.tools.includes(tool) || profileData.tools.length >= 5) return;
    const updatedTools = [...profileData.tools, tool];
    setProfileData({ ...profileData, tools: updatedTools });
    setDoc(doc(db, "users", user.uid), { tools: updatedTools }, { merge: true });
  };

  const handleDeletePortfolio = async (id) => {
    if (!window.confirm("Delete this portfolio?")) return;
    await deleteDoc(doc(db, "users", user.uid, "portfolio", id));
  };

  const LaunchURL = (url) => url && window.open(url, "_blank");

  return (
    <Box sx={{ width: "100vw", minHeight: "100vh", p: 3, bgcolor: "#f7f7f7" }}>
      {/* Cover + Profile Image */}
      <Box sx={{ position: "relative", mb: 8 }}>
        <img
          src={profileData.coverImage || "/cover-placeholder.jpg"}
          alt="Cover"
          style={{ width: "100%", height: 250, borderRadius: 16, objectFit: "cover" }}
        />
        <img
          src={profileData.profileImage || "/user-placeholder.jpg"}
          alt="Profile"
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            position: "absolute",
            bottom: -60,
            left: 20,
            border: "4px solid white",
          }}
        />
      </Box>

      {/* Name, Title & Location */}
      <Typography variant="h4">
        {profileData.firstName} {profileData.lastName}
      </Typography>
      <Typography variant="subtitle1" color="textSecondary">{profileData.location}</Typography>
      <Box sx={{ display: "inline-block", mt: 1, bgcolor: "#E3FFD9", px: 2, py: 0.5, borderRadius: 1 }}>
        {profileData.title}
      </Box>

      {/* About */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">About</Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={profileData.about}
          onChange={(e) => setProfileData({ ...profileData, about: e.target.value })}
        />
        <Button
          sx={{ mt: 1 }}
          variant="outlined"
          onClick={async () => {
            setGenerating(true);
            const aboutText = await fakeAIService(profileData.title);
            setProfileData({ ...profileData, about: aboutText });
            setGenerating(false);
          }}
          disabled={generating}
        >
          {generating ? <CircularProgress size={20} /> : "Generate About"}
        </Button>
      </Box>

      {/* Skills & Tools */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Skills ({profileData.skills.length}/3)</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
          {profileData.skills.map((s) => (
            <Chip
              key={s}
              label={s}
              onDelete={() => {
                const newSkills = profileData.skills.filter((x) => x !== s);
                setProfileData({ ...profileData, skills: newSkills });
                setDoc(doc(db, "users", user.uid), { skills: newSkills }, { merge: true });
              }}
            />
          ))}
        </Box>
        <Autocomplete
          options={skillOptions}
          onChange={(e, value) => handleAddSkill(value)}
          renderInput={(params) => <TextField {...params} label="Select Skill" />}
        />

        <Typography variant="h6" sx={{ mt: 3 }}>
          Tools ({profileData.tools.length}/5)
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
          {profileData.tools.map((t) => (
            <Chip
              key={t}
              label={t}
              onDelete={() => {
                const newTools = profileData.tools.filter((x) => x !== t);
                setProfileData({ ...profileData, tools: newTools });
                setDoc(doc(db, "users", user.uid), { tools: newTools }, { merge: true });
              }}
            />
          ))}
        </Box>
        <Autocomplete
          options={toolOptions}
          onChange={(e, value) => handleAddTool(value)}
          renderInput={(params) => <TextField {...params} label="Select Tool" />}
        />
      </Box>

      {/* Save Profile */}
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" color="primary" onClick={handleSaveProfile} disabled={loading}>
          {loading ? <CircularProgress size={20} /> : "Save Profile"}
        </Button>
      </Box>

      {/* Portfolio */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5">Portfolio</Typography>
        <Button sx={{ mt: 1 }} variant="contained" onClick={() => setIsPortfolioPopupOpen(true)}>
          Add Portfolio
        </Button>

        <AddPortfolioPopup
          open={isPortfolioPopupOpen}
          onClose={() => setIsPortfolioPopupOpen(false)}
        />

        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {portfolio.map((p) => (
            <Box
              key={p.id}
              sx={{ display: "flex", gap: 2, p: 2, bgcolor: "white", borderRadius: 2 }}
            >
              <img
                src={p.imageUrl || "/portfolio-placeholder.png"}
                alt={p.title}
                style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8, cursor: "pointer" }}
                onClick={() => LaunchURL(p.projectUrl)}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6">{p.title}</Typography>
                <Typography variant="body2">{p.description}</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  {(p.skills || []).map((s, i) => <Chip key={i} label={s} size="small" />)}
                  {(p.tools || []).map((t, i) => <Chip key={i} label={t} size="small" />)}
                </Box>
                <Button color="secondary" sx={{ mt: 1 }} onClick={() => handleDeletePortfolio(p.id)}>
                  Delete
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

// Dummy AI service
async function fakeAIService(title) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`This is an auto-generated about for ${title}`), 1000);
  });
}
