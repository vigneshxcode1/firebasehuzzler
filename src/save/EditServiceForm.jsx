
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { db } from "../firbase/Firebase";
// import { doc, getDoc, updateDoc } from "firebase/firestore";

// export default function EditServiceForm() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);

//   // ⭐ 1️⃣ SIDEBAR COLLAPSED STATE
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   // ⭐ 2️⃣ LISTEN FOR SIDEBAR TOGGLE
//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     budget_from: "",
//     budget_to: "",
//     timeline: "",
//     category: "",
//     skills: "",
//     tools: "",
//     sample_project_url: "",
//     freelancer_requirements: "",
//   });

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const ref = doc(db, "services", id);
//         const snap = await getDoc(ref);

//         if (!snap.exists()) {
//           alert("Service not found");
//           return navigate(-1);
//         }

//         const data = snap.data();

//         setForm({
//           title: data.title || "",
//           description: data.description || "",
//           budget_from: data.budget_from || "",
//           budget_to: data.budget_to || "",
//           timeline: data.timeline || "",
//           category: data.category || "",
//           skills: (data.skills || []).join(", "),
//           tools: (data.tools || []).join(", "),
//           sample_project_url: data.sample_project_url || "",
//           freelancer_requirements: data.freelancer_requirements || "",
//         });

//         setLoading(false);
//       } catch (err) {
//         console.error(err);
//         alert("Failed to load service");
//       }
//     }

//     fetchData();
//   }, [id, navigate]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleUpdate = async () => {
//     try {
//       const ref = doc(db, "services", id);

//       const payload = {
//         title: form.title,
//         description: form.description,
//         budget_from: form.budget_from,
//         budget_to: form.budget_to,
//         timeline: form.timeline,
//         category: form.category,
//         sample_project_url: form.sample_project_url,
//         freelancer_requirements: form.freelancer_requirements,
//         skills: form.skills.split(",").map((s) => s.trim()),
//         tools: form.tools.split(",").map((t) => t.trim()),
//         updated_at: new Date(),
//       };

//       await updateDoc(ref, payload);
//       alert("Service updated successfully!");
//       navigate(-1);
//     } catch (error) {
//       console.error(error);
//       alert("Failed to update service.");
//     }
//   };

//   if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

//   // ⭐ 3️⃣ WRAP ENTIRE UI WITH SIDEBAR MARGIN TRANSITION
//   return (
//     <div
//       className="freelance-wrapper"
//       style={{
//         marginLeft: collapsed ? "-110px" : "50px",
//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       <div style={styles.wrapper}>
//         <h2 style={styles.heading}>Edit Service</h2>

//         {/* SERVICE TITLE */}
//         <div style={styles.section}>
//           <label style={styles.label}>Service Title</label>
//           <input
//             name="title"
//             value={form.title}
//             onChange={handleChange}
//             placeholder="Service Title"
//             style={styles.input}
//           />
//         </div>

//         {/* SERVICE DESCRIPTION */}
//         <div style={styles.section}>
//           <label style={styles.label}>Project Description</label>
//           <textarea
//             name="description"
//             value={form.description}
//             onChange={handleChange}
//             placeholder="Describe your service..."
//             style={styles.textarea}
//           />
//         </div>

//         {/* BUDGET */}
//         <div style={styles.row}>
//           <div style={{ flex: 1, marginRight: 10 }}>
//             <label style={styles.label}>Budget From</label>
//             <input
//               name="budget_from"
//               value={form.budget_from}
//               onChange={handleChange}
//               placeholder="₹0"
//               style={styles.input}
//             />
//           </div>
//           <div style={{ flex: 1, marginLeft: 10 }}>
//             <label style={styles.label}>Budget To</label>
//             <input
//               name="budget_to"
//               value={form.budget_to}
//               onChange={handleChange}
//               placeholder="₹0"
//               style={styles.input}
//             />
//           </div>
//         </div>

//         {/* TIMELINE */}
//         <div style={styles.section}>
//           <label style={styles.label}>Timeline</label>
//           <input
//             name="timeline"
//             value={form.timeline}
//             onChange={handleChange}
//             placeholder="Timeline"
//             style={styles.input}
//           />
//         </div>

//         {/* CATEGORY */}
//         <div style={styles.section}>
//           <label style={styles.label}>Category</label>
//           <input
//             name="category"
//             value={form.category}
//             onChange={handleChange}
//             placeholder="Category"
//             style={styles.input}
//           />
//         </div>

//         {/* SKILLS */}
//         <div style={styles.section}>
//           <label style={styles.label}>Skills (comma separated)</label>
//           <input
//             name="skills"
//             value={form.skills}
//             onChange={handleChange}
//             placeholder="e.g., UI, UX, Figma"
//             style={styles.input}
//           />
//         </div>

//         {/* TOOLS */}
//         <div style={styles.section}>
//           <label style={styles.label}>Tools (comma separated)</label>
//           <input
//             name="tools"
//             value={form.tools}
//             onChange={handleChange}
//             placeholder="e.g., Figma, Adobe XD"
//             style={styles.input}
//           />
//         </div>

//         {/* SAMPLE URL */}
//         <div style={styles.section}>
//           <label style={styles.label}>Sample Project URL</label>
//           <input
//             name="sample_project_url"
//             value={form.sample_project_url}
//             onChange={handleChange}
//             placeholder="https://example.com"
//             style={styles.input}
//           />
//         </div>

//         {/* REQUIREMENTS */}
//         <div style={styles.section}>
//           <label style={styles.label}>Freelancer Requirements</label>
//           <textarea
//             name="freelancer_requirements"
//             value={form.freelancer_requirements}
//             onChange={handleChange}
//             placeholder="Specify requirements"
//             style={styles.textarea}
//           />
//         </div>

//         {/* UPDATE BUTTON */}
//         <button onClick={handleUpdate} style={styles.updateBtn}>
//           Update Service
//         </button>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   wrapper: {
//     maxWidth: "700px",
//     margin: "40px auto",
//     padding: "30px",
//     background: "#fff",
//     borderRadius: "16px",
//     boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
//     fontFamily: "Rubik, sans-serif",
//   },
//   heading: {
//     textAlign: "center",
//     fontSize: "26px",
//     fontWeight: 700,
//     marginBottom: "30px",
//   },
//   section: {
//     marginBottom: "20px",
//   },
//   row: {
//     display: "flex",
//     gap: "10px",
//     marginBottom: "20px",
//   },
//   label: {
//     display: "block",
//     fontWeight: 600,
//     color: "#555",
//     marginBottom: "6px",
//     fontSize: "15px",
//   },
//   input: {
//     width: "100%",
//     padding: "12px 14px",
//     borderRadius: "12px",
//     border: "1px solid #ccc",
//     background: "rgba(254, 254, 215, 1)",
//     fontSize: "15px",
//     outline: "none",
//   },
//   textarea: {
//     width: "100%",
//     padding: "12px 14px",
//     borderRadius: "12px",
//     border: "1px solid #ccc",
//     background: "rgba(254, 254, 215, 1)",
//     minHeight: "120px",
//     resize: "vertical",
//     outline: "none",
//   },
//   updateBtn: {
//     width: "100%",
//     padding: "16px",
//     fontSize: "17px",
//     fontWeight: 700,
//     borderRadius: "14px",
//     backgroundColor: "#A259FF",
//     color: "#fff",
//     border: "none",
//     cursor: "pointer",
//     marginTop: "10px",
//   },
// };




import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firbase/Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function EditServiceForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  // ⭐ SIDEBAR STATE
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  // ⭐ RESPONSIVE FLAG
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ⭐ LISTEN FOR SIDEBAR TOGGLE
  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  const [form, setForm] = useState({
    title: "",
    description: "",
    budget_from: "",
    budget_to: "",
    timeline: "",
    category: "",
    skills: "",
    tools: "",
    sample_project_url: "",
    freelancer_requirements: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const ref = doc(db, "services", id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          alert("Service not found");
          return navigate(-1);
        }

        const data = snap.data();

        setForm({
          title: data.title || "",
          description: data.description || "",
          budget_from: data.budget_from || "",
          budget_to: data.budget_to || "",
          timeline: data.timeline || "",
          category: data.category || "",
          skills: (data.skills || []).join(", "),
          tools: (data.tools || []).join(", "),
          sample_project_url: data.sample_project_url || "",
          freelancer_requirements: data.freelancer_requirements || "",
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to load service");
      }
    }

    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const ref = doc(db, "services", id);

      const payload = {
        title: form.title,
        description: form.description,
        budget_from: form.budget_from,
        budget_to: form.budget_to,
        timeline: form.timeline,
        category: form.category,
        sample_project_url: form.sample_project_url,
        freelancer_requirements: form.freelancer_requirements,
        skills: form.skills.split(",").map((s) => s.trim()),
        tools: form.tools.split(",").map((t) => t.trim()),
        updated_at: new Date(),
      };

      await updateDoc(ref, payload);
      alert("Service updated successfully!");
      navigate(-1);
    } catch (error) {
      console.error(error);
      alert("Failed to update service.");
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div
      className="freelance-wrapper"
      style={{
        marginLeft: isMobile ? "0px" : collapsed ? "-110px" : "50px",
        transition: "margin-left 0.25s ease",
      }}
    >
      <div
        style={{
          ...styles.wrapper,
          margin: isMobile ? "20px 12px" : "40px auto",
          padding: isMobile ? "20px" : "30px",
        }}
      >
        <h2
          style={{
            ...styles.heading,
            fontSize: isMobile ? "22px" : "26px",
          }}
        >
          Edit Service
        </h2>

        {/* SERVICE TITLE */}
        <div style={styles.section}>
          <label style={styles.label}>Service Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Service Title"
            style={styles.input}
          />
        </div>

        {/* DESCRIPTION */}
        <div style={styles.section}>
          <label style={styles.label}>Project Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe your service..."
            style={styles.textarea}
          />
        </div>

        {/* BUDGET */}
        <div
          style={{
            ...styles.row,
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Budget From</label>
            <input
              name="budget_from"
              value={form.budget_from}
              onChange={handleChange}
              placeholder="₹0"
              style={styles.input}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Budget To</label>
            <input
              name="budget_to"
              value={form.budget_to}
              onChange={handleChange}
              placeholder="₹0"
              style={styles.input}
            />
          </div>
        </div>

        {/* TIMELINE */}
        <div style={styles.section}>
          <label style={styles.label}>Timeline</label>
          <input
            name="timeline"
            value={form.timeline}
            onChange={handleChange}
            placeholder="Timeline"
            style={styles.input}
          />
        </div>

        {/* CATEGORY */}
        <div style={styles.section}>
          <label style={styles.label}>Category</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            style={styles.input}
          />
        </div>

        {/* SKILLS */}
        <div style={styles.section}>
          <label style={styles.label}>Skills (comma separated)</label>
          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="e.g., UI, UX, Figma"
            style={styles.input}
          />
        </div>

        {/* TOOLS */}
        <div style={styles.section}>
          <label style={styles.label}>Tools (comma separated)</label>
          <input
            name="tools"
            value={form.tools}
            onChange={handleChange}
            placeholder="e.g., Figma, Adobe XD"
            style={styles.input}
          />
        </div>

        {/* SAMPLE URL */}
        <div style={styles.section}>
          <label style={styles.label}>Sample Project URL</label>
          <input
            name="sample_project_url"
            value={form.sample_project_url}
            onChange={handleChange}
            placeholder="https://example.com"
            style={styles.input}
          />
        </div>

        {/* REQUIREMENTS */}
        <div style={styles.section}>
          <label style={styles.label}>Freelancer Requirements</label>
          <textarea
            name="freelancer_requirements"
            value={form.freelancer_requirements}
            onChange={handleChange}
            placeholder="Specify requirements"
            style={styles.textarea}
          />
        </div>

        <button onClick={handleUpdate} style={styles.updateBtn}>
          Update Service
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    maxWidth: "700px",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
    fontFamily: "Rubik, sans-serif",
  },
  heading: {
    textAlign: "center",
    fontWeight: 700,
    marginBottom: "30px",
  },
  section: {
    marginBottom: "20px",
  },
  row: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontWeight: 600,
    color: "#555",
    marginBottom: "6px",
    fontSize: "15px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #ccc",
    background: "rgba(254, 254, 215, 1)",
    fontSize: "15px",
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #ccc",
    background: "rgba(254, 254, 215, 1)",
    minHeight: "120px",
    resize: "vertical",
    outline: "none",
  },
  updateBtn: {
    width: "100%",
    padding: "16px",
    fontSize: "17px",
    fontWeight: 700,
    borderRadius: "14px",
    backgroundColor: "#A259FF",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    marginTop: "10px",
  },
};

