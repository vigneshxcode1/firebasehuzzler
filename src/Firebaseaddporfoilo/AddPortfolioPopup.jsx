// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Chip,
//   Box,
//   Typography,
//   MenuItem,
//   CircularProgress,
// } from "@mui/material";
// import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// import { db, auth } from "../firbase/Firebase";
// import { useAuthState } from "react-firebase-hooks/auth";

// const skillOptions = [
//   "Logo Design",
//   "Website Design",
//   "App Design",
//   "UX Design",
//   "Game Art",
//   // ... add more skills
// ];

// const toolOptions = [
//   "Adobe Illustrator",
//   "Figma",
//   "Canva",
//   "Photoshop",
//   "Flutter",
//   // ... add more tools
// ];

// const AddPortfolioPopup = ({ open, onClose }) => {
//   const [user] = useAuthState(auth);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [url, setUrl] = useState("");
//   const [selectedSkills, setSelectedSkills] = useState([]);
//   const [selectedTools, setSelectedTools] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleAddSkill = (skill) => {
//     if (!selectedSkills.includes(skill) && selectedSkills.length < 3) {
//       setSelectedSkills([...selectedSkills, skill]);
//     }
//   };

//   const handleAddTool = (tool) => {
//     if (!selectedTools.includes(tool) && selectedTools.length < 5) {
//       setSelectedTools([...selectedTools, tool]);
//     }
//   };

//   const handleDeleteSkill = (skill) => {
//     setSelectedSkills(selectedSkills.filter((s) => s !== skill));
//   };

//   const handleDeleteTool = (tool) => {
//     setSelectedTools(selectedTools.filter((t) => t !== tool));
//   };

//   const validateUrl = (url) => {
//     const urlPattern = /^(http|https):\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/;
//     return urlPattern.test(url);
//   };

//   const handleSave = async () => {
//     if (!user) return alert("You must be logged in");
//     if (!title.trim()) return alert("Project title is required");
//     if (description.trim().length < 120) return alert("Project description must be at least 120 characters");
//     if (selectedSkills.length < 3) return alert("Please select at least 3 skills");
//     if (selectedTools.length < 3) return alert("Please select at least 3 tools");
//     if (!url.trim() || !validateUrl(url)) return alert("Please enter a valid project link (http/https)");

//     setLoading(true);
//     try {
//       const portfolioRef = collection(db, "users", user.uid, "portfolio");
//       await addDoc(portfolioRef, {
//         title: title.trim(),
//         description: description.trim(),
//         skills: selectedSkills,
//         tools: selectedTools,
//         projectUrl: url.trim(),
//         createdAt: serverTimestamp(),
//       });
//       alert("Portfolio saved successfully");
//       onClose();
//     } catch (err) {
//       console.error(err);
//       alert("Error saving portfolio: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       fullScreen
//       PaperProps={{
//         sx: {
//           backgroundColor: "transparent",
//           boxShadow: "none",
//         },
//       }}
//     >
//       {/* Blur background */}
//       <Box
//         sx={{
//           position: "fixed",
//           inset: 0,
//           backdropFilter: "blur(8px)",
//           backgroundColor: "rgba(255,255,255,0.3)",
//         }}
//         onClick={onClose}
//       />

//       {/* Centered card */}
//       <Box
//         sx={{
//           position: "relative",
//           margin: "auto",
//           maxWidth: 600,
//           width: "95%",
//           maxHeight: "90vh",
//           overflowY: "auto",
//           bgcolor: "white",
//           borderRadius: 3,
//           p: 3,
//           zIndex: 10,
//         }}
//       >
//         <Typography variant="h5" fontWeight={500} mb={2}>
//           Add Portfolio
//         </Typography>

//         <TextField
//           label="Project Title"
//           fullWidth
//           margin="normal"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />

//         <TextField
//           label="Project Description"
//           fullWidth
//           margin="normal"
//           multiline
//           minRows={3}
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />

//         <Typography variant="subtitle1" mt={2}>
//           Skills ({selectedSkills.length}/3)
//         </Typography>
//         <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
//           {selectedSkills.map((skill) => (
//             <Chip key={skill} label={skill} onDelete={() => handleDeleteSkill(skill)} />
//           ))}
//         </Box>
//         <TextField
//           select
//           fullWidth
//           label="Select Skill"
//           value=""
//           onChange={(e) => handleAddSkill(e.target.value)}
//         >
//           {skillOptions.map((skill) => (
//             <MenuItem key={skill} value={skill}>
//               {skill}
//             </MenuItem>
//           ))}
//         </TextField>

//         <Typography variant="subtitle1" mt={2}>
//           Tools ({selectedTools.length}/5)
//         </Typography>
//         <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
//           {selectedTools.map((tool) => (
//             <Chip key={tool} label={tool} onDelete={() => handleDeleteTool(tool)} />
//           ))}
//         </Box>
//         <TextField
//           select
//           fullWidth
//           label="Select Tool"
//           value=""
//           onChange={(e) => handleAddTool(e.target.value)}
//         >
//           {toolOptions.map((tool) => (
//             <MenuItem key={tool} value={tool}>
//               {tool}
//             </MenuItem>
//           ))}
//         </TextField>

//         <TextField
//           label="Project URL"
//           fullWidth
//           margin="normal"
//           value={url}
//           onChange={(e) => setUrl(e.target.value)}
//         />

//         <DialogActions sx={{ px: 0, mt: 3 }}>
//           <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSave}
//             variant="contained"
//             color="primary"
//             disabled={loading}
//             startIcon={loading && <CircularProgress size={20} />}
//             sx={{ borderRadius: 2, bgcolor: "#FFEB3B", color: "#000", "&:hover": { bgcolor: "#FDD835" } }}
//           >
//             Save
//           </Button>
//         </DialogActions>
//       </Box>
//     </Dialog>
//   );
// };

// export default AddPortfolioPopup;


import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Chip,
  Box,
  Typography,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firbase/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const skillOptions = [
  "Logo Design",
  "Website Design",
  "App Design",
  "UX Design",
  "Game Art",
];

const toolOptions = [
  "Adobe Illustrator",
  "Figma",
  "Canva",
  "Photoshop",
  "Flutter",
];

const AddPortfolioPopup = ({ open, onClose }) => {
  const [user] = useAuthState(auth);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddSkill = (skill) => {
    if (!selectedSkills.includes(skill) && selectedSkills.length < 3) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddTool = (tool) => {
    if (!selectedTools.includes(tool) && selectedTools.length < 5) {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  const handleDeleteSkill = (skill) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  const handleDeleteTool = (tool) => {
    setSelectedTools(selectedTools.filter((t) => t !== tool));
  };

  const validateUrl = (url) => {
    const urlPattern = /^(http|https):\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/;
    return urlPattern.test(url);
  };

  const handleSave = async () => {
    if (!user) return alert("You must be logged in");
    if (!title.trim()) return alert("Project title is required");
    if (description.trim().length < 120)
      return alert("Project description must be at least 120 characters");
    if (selectedSkills.length < 3) return alert("Please select at least 3 skills");
    if (selectedTools.length < 3) return alert("Please select at least 3 tools");
    if (!url.trim() || !validateUrl(url))
      return alert("Please enter a valid project link (http/https)");

    setLoading(true);
    try {
      const portfolioRef = collection(db, "users", user.uid, "portfolio");
      await addDoc(portfolioRef, {
        title: title.trim(),
        description: description.trim(),
        skills: selectedSkills,
        tools: selectedTools,
        projectUrl: url.trim(),
        createdAt: serverTimestamp(),
      });
      alert("Portfolio saved successfully");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error saving portfolio: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{
        sx: {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
    >
      {/* Blur background */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(255,255,255,0.3)",
        }}
        onClick={onClose}
      />

      {/* Centered card */}
      <Box
        sx={{
          position: "relative",
          margin: "auto",
          maxWidth: 600,
          width: "95%",
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "rgba(255,255,255,0.85)",   // 🔥 opacity added
          backdropFilter: "blur(6px)",         // 🔥 glass effect
          borderRadius: 3,
          p: 3,
          zIndex: 10,
        }}
      >
        <Typography variant="h5" fontWeight={500} mb={2}>
          Add Portfolio
        </Typography>

        {/* All TextFields updated with borderRadius */}
        <TextField
          label="Project Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
          }}
        />

        <TextField
          label="Project Description"
          fullWidth
          margin="normal"
          multiline
          minRows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
          }}
        />

        <Typography variant="subtitle1" mt={2}>
          Skills ({selectedSkills.length}/3)
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
          {selectedSkills.map((skill) => (
            <Chip key={skill} label={skill} onDelete={() => handleDeleteSkill(skill)} />
          ))}
        </Box>

        <TextField
          select
          fullWidth
          label="Select Skill"
          value=""
          onChange={(e) => handleAddSkill(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
          }}
        >
          {skillOptions.map((skill) => (
            <MenuItem key={skill} value={skill}>
              {skill}
            </MenuItem>
          ))}
        </TextField>

        <Typography variant="subtitle1" mt={2}>
          Tools ({selectedTools.length}/5)
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
          {selectedTools.map((tool) => (
            <Chip key={tool} label={tool} onDelete={() => handleDeleteTool(tool)} />
          ))}
        </Box>

        <TextField
          select
          fullWidth
          label="Select Tool"
          value=""
          onChange={(e) => handleAddTool(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
          }}
        >
          {toolOptions.map((tool) => (
            <MenuItem key={tool} value={tool}>
              {tool}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Project URL"
          fullWidth
          margin="normal"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
          }}
        />

        <DialogActions sx={{ px: 0, mt: 3 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              width: "120px",  
              borderColor: "rgba(124, 60, 255, 1)",
              borderRadius: "8px",
              color: "rgba(124, 60, 255, 1)",
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
            sx={{
              width: "120px",  
              borderRadius: "8px",
              bgcolor: "rgba(124, 60, 255, 1)",
              color: "#fff",
         
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AddPortfolioPopup;