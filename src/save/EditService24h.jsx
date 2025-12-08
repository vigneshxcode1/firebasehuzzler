// // EditService24h.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { doc, updateDoc } from "firebase/firestore";
// import { db } from "../firbase/Firebase";
// import Select from "react-select";

// export default function EditService24h() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const jobId = location?.state?.jobId || null;
//   const jobData = location?.state?.jobData || null;

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [skills, setSkills] = useState([]);
//   const [tools, setTools] = useState([]);
//   const [notes, setNotes] = useState("");
//   const [budget, setBudget] = useState("");
//   const [category, setCategory] = useState(null);

//   const [saving, setSaving] = useState(false);

//   // Options
//   const categoryOptions = [
//     "Graphics & Design",
//     "Programming & Tech",
//     "Digital Marketing",
//     "Writing & Translation",
//     "Video & Animation",
//     "Music & Audio",
//     "AI Services",
//     "Data",
//     "Business",
//     "Finance",
//     "Photography",
//     "Lifestyle",
//     "Consulting",
//   ].map(e => ({ label: e, value: e }));

//   const skillOptions = jobData?.skills?.map(s => ({ label: s, value: s })) || [];
//   const toolOptions = jobData?.tools?.map(t => ({ label: t, value: t })) || [];

//   // Prefill
//   useEffect(() => {
//     if (jobData) {
//       setTitle(jobData.title || "");
//       setDescription(jobData.description || "");
//       setSkills((jobData.skills || []).map(s => ({ label: s, value: s })));
//       setTools((jobData.tools || []).map(t => ({ label: t, value: t })));
//       setNotes(jobData.notes || "");
//       setBudget(jobData.budget || "");
//       setCategory(
//         jobData.category ? { label: jobData.category, value: jobData.category } : null
//       );
//     }
//   }, [jobData]);

//   // Save
//   const handleSave = async () => {
//     if (!jobId) return alert("Invalid job ID");

//     if (!title.trim()) return alert("Title required");
//     if (!description.trim()) return alert("Description required");
//     if (!category) return alert("Category required");

//     setSaving(true);

//     try {
//       await updateDoc(doc(db, "service_24h", jobId), {
//         title: title.trim(),
//         description: description.trim(),
//         category: category.value,
//         skills: skills.map(s => s.value),
//         tools: tools.map(t => t.value),
//         notes,
//         budget,
//         updatedAt: new Date(),
//       });

//       alert("24 Hour Service updated!");
//       navigate(-1);
//     } catch (error) {
//       console.error("Error updating 24h service:", error);
//       alert("Update failed: " + error.message);
//     }

//     setSaving(false);
//   };

//   return (
//     <div style={styles.wrapper}>
//       <h2>Edit 24-Hour Service</h2>

//       <label style={styles.label}>Title</label>
//       <input
//         style={styles.input}
//         value={title}
//         onChange={e => setTitle(e.target.value)}
//       />

//       <label style={styles.label}>Description</label>
//       <textarea
//         style={styles.textarea}
//         value={description}
//         onChange={e => setDescription(e.target.value)}
//       />

//       <label style={styles.label}>Category</label>
//       <Select
//         value={category}
//         onChange={setCategory}
//         options={categoryOptions}
//       />

//       <label style={styles.label}>Skills</label>
//       <Select
//         isMulti
//         options={skillOptions}
//         value={skills}
//         onChange={setSkills}
//       />

//       <label style={styles.label}>Tools</label>
//       <Select
//         isMulti
//         options={toolOptions}
//         value={tools}
//         onChange={setTools}
//       />

//       <label style={styles.label}>Budget</label>
//       <input
//         style={styles.input}
//         value={budget}
//         onChange={e => setBudget(e.target.value)}
//       />

//       <label style={styles.label}>Notes</label>
//       <textarea
//         style={styles.textarea}
//         value={notes}
//         onChange={e => setNotes(e.target.value)}
//       />

//       <div style={styles.btnRow}>
//         <button style={styles.cancelBtn} onClick={() => navigate(-1)}>
//           Cancel
//         </button>

//         <button style={styles.saveBtn} onClick={handleSave} disabled={saving}>
//           {saving ? "Saving..." : "Save Changes"}
//         </button>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   wrapper: {
//     maxWidth: "700px",
//     margin: "0 auto",
//     padding: "20px",
//   },
//   label: {
//     fontWeight: "bold",
//     marginTop: "15px",
//   },
//   input: {
//     width: "100%",
//     padding: "8px",
//     marginTop: "5px",
//     borderRadius: "5px",
//     border: "1px solid #ccc",
//   },
//   textarea: {
//     width: "100%",
//     minHeight: "140px",
//     padding: "8px",
//     marginTop: "5px",
//     borderRadius: "5px",
//     border: "1px solid #ccc",
//   },
//   btnRow: {
//     marginTop: "20px",
//     display: "flex",
//     justifyContent: "space-between",
//   },
//   cancelBtn: {
//     padding: "10px 18px",
//     background: "gray",
//     color: "white",
//     borderRadius: "5px",
//     border: "none",
//     cursor: "pointer",
//   },
//   saveBtn: {
//     padding: "10px 18px",
//     background: "#007bff",
//     color: "white",
//     borderRadius: "5px",
//     border: "none",
//     cursor: "pointer",
//   },
// };


// EditService24h.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firbase/Firebase";
import Select from "react-select";

export default function EditService24h() {
  const navigate = useNavigate();
  const location = useLocation();

  const jobId = location?.state?.jobId || null;
  const jobData = location?.state?.jobData || null;

  // ⭐ 1️⃣ SIDEBAR COLLAPSED STATE
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  // ⭐ 2️⃣ LISTEN FOR SIDEBAR TOGGLE EVENT
  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState([]);
  const [tools, setTools] = useState([]);
  const [notes, setNotes] = useState("");
  const [budget, setBudget] = useState("");
  const [category, setCategory] = useState(null);

  const [saving, setSaving] = useState(false);

  // Options
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
  ].map((e) => ({ label: e, value: e }));

  const skillOptions =
    jobData?.skills?.map((s) => ({ label: s, value: s })) || [];
  const toolOptions =
    jobData?.tools?.map((t) => ({ label: t, value: t })) || [];

  useEffect(() => {
    if (jobData) {
      setTitle(jobData.title || "");
      setDescription(jobData.description || "");
      setSkills((jobData.skills || []).map((s) => ({ label: s, value: s })));
      setTools((jobData.tools || []).map((t) => ({ label: t, value: t })));
      setNotes(jobData.notes || "");
      setBudget(jobData.budget || "");
      setCategory(
        jobData.category
          ? { label: jobData.category, value: jobData.category }
          : null
      );
    }
  }, [jobData]);

  const handleSave = async () => {
    if (!jobId) return alert("Invalid job ID");

    if (!title.trim()) return alert("Title required");
    if (!description.trim()) return alert("Description required");
    if (!category) return alert("Category required");

    setSaving(true);

    try {
      await updateDoc(doc(db, "service_24h", jobId), {
        title: title.trim(),
        description: description.trim(),
        category: category.value,
        skills: skills.map((s) => s.value),
        tools: tools.map((t) => t.value),
        notes,
        budget,
        updatedAt: new Date(),
      });

      alert("24 Hour Service updated!");
      navigate(-1);
    } catch (error) {
      console.error("Error updating 24h service:", error);
      alert("Update failed: " + error.message);
    }

    setSaving(false);
  };

  // ⭐ 3️⃣ WRAP WHOLE UI IN MARGIN-LEFT SIDEBAR ANIMATION
  return (
    <div
      className="freelance-wrapper"
      style={{
        marginLeft: collapsed ? "-110px" : "50px",
        transition: "margin-left 0.25s ease",
      }}
    >
      <div style={styles.wrapper}>
        <h2>Edit 24-Hour Service</h2>

        <label style={styles.label}>Title</label>
        <input
          style={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label style={styles.label}>Description</label>
        <textarea
          style={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label style={styles.label}>Category</label>
        <Select value={category} onChange={setCategory} options={categoryOptions} />

        <label style={styles.label}>Skills</label>
        <Select isMulti options={skillOptions} value={skills} onChange={setSkills} />

        <label style={styles.label}>Tools</label>
        <Select isMulti options={toolOptions} value={tools} onChange={setTools} />

        <label style={styles.label}>Budget</label>
        <input
          style={styles.input}
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        <label style={styles.label}>Notes</label>
        <textarea
          style={styles.textarea}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div style={styles.btnRow}>
          <button style={styles.cancelBtn} onClick={() => navigate(-1)}>
            Cancel
          </button>

          <button style={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------
// STYLES — unchanged
// -------------------------------------

const styles = {
  wrapper: {
    maxWidth: "700px",
    margin: "0 auto",
    padding: "20px",
  },
  label: {
    fontWeight: "bold",
    marginTop: "15px",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginTop: "5px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    minHeight: "140px",
    padding: "8px",
    marginTop: "5px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  btnRow: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
  },
  cancelBtn: {
    padding: "10px 18px",
    background: "gray",
    color: "white",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
  saveBtn: {
    padding: "10px 18px",
    background: "#007bff",
    color: "white",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
};
