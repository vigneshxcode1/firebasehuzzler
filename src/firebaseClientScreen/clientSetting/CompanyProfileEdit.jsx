
// import React, { useEffect, useState } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import {
//   getFirestore,
//   doc,
//   getDoc,
//   updateDoc,
//   setDoc,
//   serverTimestamp,
// } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { useNavigate } from "react-router-dom";

// import backarrow from "../../assets/backarrow.png";
// import edit from "../../assets/edit.png";

// /* ------------------------------------------------------------
//    GLOBAL RUBIK FONT
// ------------------------------------------------------------ */
// const globalFont = {
//   fontFamily: "Rubik, sans-serif",
// };

// /* ------------------------------------------------------------
//    UI STYLES
// ------------------------------------------------------------ */
// const styles = {
//   screen: {
//     width: "100%",
//     minHeight: "100vh",
//     overflowX: "hidden",
//     ...globalFont,
//   },

//   topHeader: {
//     width: "100%",
//     padding: "25px 25px 60px 25px",
//     borderBottomLeftRadius: 40,
//     borderBottomRightRadius: 40,
//     position: "relative",
//     marginLeft: 50,
//   },

//   headerRow: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 15,
//   },

//   backbtn: {
//     width: 36,
//     height: 36,
//     borderRadius: 14,
//     border: "0.8px solid #ccc",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     cursor: "pointer",
//     flexShrink: 0,
//   },

//   headerTitle: {
//     fontSize: 36,
//     fontWeight: 400,
//     ...globalFont,
//   },

//   headerSubtitle: {
//     marginTop: 6,
//     fontWeight: 400,
//     fontSize: 16,
//     opacity: "70%",
//     ...globalFont,
//   },

//   companyCard: {
//     marginTop: 35,
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     position: "relative",
//     marginLeft: 10,
//     background: "#fff",
//     padding: 22,
//     width: "85%",
//     borderRadius: 20,
//     boxShadow: "0 4px 25px rgba(0,0,0,0.07)",
//   },

//   avatarWrap: {
//     position: "relative",
//     width: 75,
//     height: 75,
//     marginLeft: "10px",
//   },

//   companyAvatar: {
//     width: 75,
//     height: 75,
//     borderRadius: "50%",
//     objectFit: "cover",
//     border: "3px solid #fff",
//   },

//   editIcon: {
//     width: 33,
//     height: 33,
//     position: "absolute",
//     right: -10,
//     bottom: -10,
//     padding: 2,
//     cursor: "pointer",
//   },

//   companyRightText: {
//     marginLeft: 28,
//   },

//   companyName: {
//     fontSize: 30,
//     fontWeight: 400,
//   },

//   companyEmail: {
//     opacity: "70%",
//     fontWeight: 400,
//     marginTop: 5,
//     fontSize: 16,
//   },

//   companyCity: {
//     marginTop: 10,
//     opacity: "70%",
//     fontWeight: 400,
//     fontSize: 16,
//   },

//   formCard: {
//     width: "85%",
//     margin: "0 90px",
//     marginTop: -15,
//     background: "#fff",
//     padding: "25px 20px 35px 20px",
//     borderRadius: 20,
//     boxShadow: "0 4px 25px rgba(0,0,0,0.07)",
//   },

//   inputBlock: {
//     marginBottom: 18,
//   },

//   label: {
//     fontSize: 20,
//     marginBottom: 6,
//     display: "block",
//     fontWeight: 400,
//   },

//   input: {
//     width: "98%",
//     padding: "10px 12px",
//     borderRadius: 8,
//     background: "rgba(254, 254, 215, 1)",
//     border: "1px solid #ddd",
//     fontSize: 14,
//   },

//   textarea: {
//     width: "98%",
//     padding: "10px 12px",
//     borderRadius: 10,
//     border: "1px solid #ddd",
//     height: 90,
//     fontSize: 14,
//     background: "rgba(254, 254, 215, 1)",
//   },

//   addLinkTitle: {
//     fontSize: 20,
//     marginBottom: 6,
//     display: "block",
//     fontWeight: 400,
//   },

//   addLinkSubtext: {
//     fontSize: 13,
//     opacity: "70%",
//     marginBottom: 20,
//   },

//   addMoreBtn: {
//     padding: "8px 14px",
//     borderRadius: 10,
//     border: "2px dotted #ddd",
//     background: "#fafafa",
//     cursor: "pointer",
//     marginTop: 10,
//     width: "100%",
//   },

//   actionRow: {
//     display: "flex",
//     justifyContent: "flex-end",
//     marginTop: 25,
//     gap: 10,
//   },

//   cancelBtn: {
//     padding: "10px 20px",
//     borderRadius: 10,
//     background: "#f2f2f2",
//     border: "1px solid #ddd",
//     cursor: "pointer",
//   },

//   saveBtn: {
//     padding: "10px 20px",
//     borderRadius: 10,
//     background: "rgba(124, 60, 255, 1)",
//     color: "#fff",
//     border: "1px solid #ddd",
//     cursor: "pointer",
//     fontWeight: 600,
//   },
// };

// /* ------------------------------------------------------------
//    MAIN COMPONENT
// ------------------------------------------------------------ */
// export default function CompanyProfileScreen() {
//   const auth = getAuth();
//   const db = getFirestore();
//   const storage = getStorage();
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);


//   // ✅ SIDEBAR STATE
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   // ✅ SIDEBAR TOGGLE LISTENER
//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   const [isLoading, setIsLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isUploadingProfile, setIsUploadingProfile] = useState(false);

//   const [profileImageUrl, setProfileImageUrl] = useState("");
//   const [companyName, setCompanyName] = useState("");
//   const [industry, setIndustry] = useState("");
//   const [size, setSize] = useState("");
//   const [description, setDescription] = useState("");
//   const [email, setEmail] = useState("");
//   const [location, setLocation] = useState("");
//   const [linkedin, setLinkedin] = useState("");
//   const [websites, setWebsites] = useState([""]);


// useEffect(() => {
//   const unsub = onAuthStateChanged(auth, async (u) => {
//     if (!u) {
//       setIsLoading(false);
//       return;
//     }

//     setUser(u); // 🔥 IMPORTANT

//     try {
//       const snap = await getDoc(doc(db, "users", u.uid));
//       if (snap.exists()) {
//         const data = snap.data();

//         setCompanyName(data.company_name || "");
//         setIndustry(data.industry || "");
//         setSize(data.team_size || "");
//         setDescription(data.business_description || "");
//         setEmail(data.email || u.email || "");
//         setLocation(data.location || "");
//         setLinkedin(data.linkedin || "");
//         setWebsites(data.websites?.length ? data.websites : [""]);
//         setProfileImageUrl(data.profileImage || "");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   });

//   return () => unsub();
// }, []);


// useEffect(() => {
//   const unsub = onAuthStateChanged(auth, async (u) => {
//     if (!u) {
//       setIsLoading(false);
//       return;
//     }

//     setUser(u);

//     try {
//       const snap = await getDoc(doc(db, "users", u.uid));
//       if (snap.exists()) {
//         const data = snap.data();

//         setCompanyName(data.company_name || "");
//         setIndustry(data.industry || "");
//         setSize(data.team_size || "");
//         setDescription(data.business_description || "");
//         setEmail(data.email || u.email || "");
//         setLocation(data.location || "");
//         setLinkedin(data.linkedin || "");
//         setWebsites(data.websites?.length ? data.websites : [""]);
//         setProfileImageUrl(data.profileImage || "");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   });

//   return () => unsub();
// }, []);


//   if (isLoading)
//     return <h3 style={{ textAlign: "center", marginTop: 40 }}>Loading…</h3>;

//   return (
//     <div
//       className="freelance-wrapper"
//       style={{
//         marginLeft: collapsed ? "-110px" : "50px",
//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       <div style={styles.screen}>
//         {/* YOUR FULL UI CONTINUES UNCHANGED BELOW */}
//         {/* (profile header, form, inputs, buttons exactly same as before) */}
//       </div>
//     </div>
//   );
// }

// /* ------------------------------------------------------------
//     INPUT COMPONENT
// ------------------------------------------------------------ */
// function Input({ label, value, onChange, multiline }) {
//   return (
//     <div style={styles.inputBlock}>
//       <label style={styles.label}>{label}</label>

//       {multiline ? (
//         <textarea
//           style={styles.textarea}
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//         />
//       ) : (
//         <input
//           style={styles.input}
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//         />
//       )}
//     </div>
//   );
// }



// import React, { useEffect, useState } from "react";
// import { onAuthStateChanged, getAuth } from "firebase/auth";
// import {
//   getFirestore,
//   doc,
//   getDoc,
//   updateDoc,
//   serverTimestamp,
// } from "firebase/firestore";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { useNavigate } from "react-router-dom";

// import backarrow from "../../assets/backarrow.png";
// import edit from "../../assets/edit.png";

// /* ------------------------------------------------------------
//    GLOBAL RUBIK FONT
// ------------------------------------------------------------ */
// const globalFont = {
//   fontFamily: "Rubik, sans-serif",
// };

// /* ------------------------------------------------------------
//    UI STYLES (UNCHANGED)
// ------------------------------------------------------------ */
// const styles = {
//   screen: {
//     width: "100%",
//     minHeight: "100vh",
//     overflowX: "hidden",
//     overflowY: "auto",   // 👈🔥 THIS LINE ONLY
//     ...globalFont,
//   },

//   topHeader: {
//     width: "100%",
//     padding: "25px 25px 60px 25px",
//     borderBottomLeftRadius: 40,
//     borderBottomRightRadius: 40,
//     position: "relative",
//     marginLeft: 50,
//   },
//   headerRow: {
//     display: "flex",
//     alignItems: "center",
//     gap: 15,
//   },
//   backbtn: {
//     width: 36,
//     height: 36,
//     borderRadius: 14,
//     border: "0.8px solid #ccc",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     cursor: "pointer",
//   },
//   headerTitle: {
//     fontSize: 36,
//     fontWeight: 400,
//   },
//   headerSubtitle: {
//     marginTop: 6,
//     fontWeight: 400,
//     fontSize: 16,
//     opacity: "70%",
//   },
//   companyCard: {
//     marginTop: 35,
//     display: "flex",
//     alignItems: "center",
//     position: "relative",
//     marginLeft: 10,
//     background: "#fff",
//     padding: 22,
//     width: "85%",
//     borderRadius: 20,
//     boxShadow: "0 4px 25px rgba(0,0,0,0.07)",
//   },
//   avatarWrap: {
//     position: "relative",
//     width: 75,
//     height: 75,
//   },
//   companyAvatar: {
//     width: 75,
//     height: 75,
//     borderRadius: "50%",
//     objectFit: "cover",
//   },
//   editIcon: {
//     width: 33,
//     height: 33,
//     position: "absolute",
//     right: -10,
//     bottom: -10,
//     cursor: "pointer",
//   },
//   companyRightText: {
//     marginLeft: 28,
//   },
//   companyName: {
//     fontSize: 30,
//     fontWeight: 400,
//   },
//   companyEmail: {
//     opacity: "70%",
//     marginTop: 5,
//   },
//   formCard: {
//     width: "85%",
//     margin: "0 90px",
//     marginTop: -15,
//     background: "#fff",
//     padding: "25px 20px 35px",
//     borderRadius: 20,
//     boxShadow: "0 4px 25px rgba(0,0,0,0.07)",
//   },
//   inputBlock: {
//     marginBottom: 18,
//   },
//   label: {
//     fontSize: 20,
//     marginBottom: 6,
//     display: "block",
//   },
//   input: {
//     width: "98%",
//     padding: "10px 12px",
//     borderRadius: 8,
//     background: "rgba(254,254,215,1)",
//     border: "1px solid #ddd",
//   },
//   textarea: {
//     width: "98%",
//     padding: "10px 12px",
//     borderRadius: 10,
//     border: "1px solid #ddd",
//     height: 90,
//     background: "rgba(254,254,215,1)",
//   },
//   actionRow: {
//     display: "flex",
//     justifyContent: "flex-end",
//     marginTop: 25,
//     gap: 10,
//   },
//   cancelBtn: {
//     padding: "10px 20px",
//     borderRadius: 10,
//     background: "#f2f2f2",
//     border: "1px solid #ddd",
//     cursor: "pointer",
//   },
//   saveBtn: {
//     padding: "10px 20px",
//     borderRadius: 10,
//     background: "rgba(124,60,255,1)",
//     color: "#fff",
//     border: "none",
//     cursor: "pointer",
//     fontWeight: 600,
//   },
// };

// /* ------------------------------------------------------------
//    MAIN COMPONENT
// ------------------------------------------------------------ */
// export default function CompanyProfileEdit() {
//   const auth = getAuth();
//   const db = getFirestore();
//   const storage = getStorage();
//   const navigate = useNavigate();

//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);

//   const [profileImageUrl, setProfileImageUrl] = useState("");
//   const [companyName, setCompanyName] = useState("");
//   const [industry, setIndustry] = useState("");
//   const [size, setSize] = useState("");
//   const [description, setDescription] = useState("");
//   const [email, setEmail] = useState("");
//   const [location, setLocation] = useState("");

//   /* -------- SIDEBAR TOGGLE -------- */
//   useEffect(() => {
//     const fn = (e) => setCollapsed(e.detail);
//     window.addEventListener("sidebar-toggle", fn);
//     return () => window.removeEventListener("sidebar-toggle", fn);
//   }, []);

//   /* -------- LOAD PROFILE DATA -------- */
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (u) => {
//       if (!u) {
//         setIsLoading(false);
//         return;
//       }

//       setUser(u);

//       const snap = await getDoc(doc(db, "users", u.uid));
//       if (snap.exists()) {
//         const d = snap.data();
//         setCompanyName(d.company_name || "");
//         setIndustry(d.industry || "");
//         setSize(d.team_size || "");
//         setDescription(d.business_description || "");
//         setEmail(d.email || u.email);
//         setLocation(d.location || "");
//         setProfileImageUrl(d.profileImage || "");
//       }
//       setIsLoading(false);
//     });

//     return () => unsub();
//   }, []);

//   /* -------- SAVE -------- */
//   const handleSave = async () => {
//     if (!user) return;
//     setIsSaving(true);

//     await updateDoc(doc(db, "users", user.uid), {
//       company_name: companyName,
//       industry,
//       team_size: size,
//       business_description: description,
//       email,
//       location,
//       profileImage: profileImageUrl,
//       updatedAt: serverTimestamp(),
//     });

//     setIsSaving(false);
//     navigate(-1); // 🔥 back to view page
//   };

//   if (isLoading) return <h3 style={{ textAlign: "center" }}>Loading…</h3>;

//   return (
//     <div
//       className="freelance-wrapper"
//       style={{
//         marginLeft: collapsed ? "-110px" : "50px",
//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       <div style={styles.screen}>
//         <div style={styles.formCard}>
//           <Input label="Company Name" value={companyName} onChange={setCompanyName} />
//           <Input label="Industry" value={industry} onChange={setIndustry} />
//           <Input label="Company Size" value={size} onChange={setSize} />
//           <Input label="Location" value={location} onChange={setLocation} />
//           <Input label="Email" value={email} onChange={setEmail} />
//           <Input
//             label="About Company"
//             value={description}
//             onChange={setDescription}
//             multiline
//           />

//           <div style={styles.actionRow}>
//             <button style={styles.cancelBtn} onClick={() => navigate(-1)}>
//               Cancel
//             </button>
//             <button style={styles.saveBtn} onClick={handleSave} disabled={isSaving}>
//               {isSaving ? "Saving..." : "Save"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ------------------------------------------------------------
//    INPUT COMPONENT
// ------------------------------------------------------------ */
// function Input({ label, value, onChange, multiline }) {
//   return (
//     <div style={styles.inputBlock}>
//       <label style={styles.label}>{label}</label>
//       {multiline ? (
//         <textarea
//           style={styles.textarea}
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//         />
//       ) : (
//         <input
//           style={styles.input}
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//         />
//       )}
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { useNavigate } from "react-router-dom";

import backarrow from "../../assets/backarrow.png";
import edit from "../../assets/edit.png";

/* ------------------------------------------------------------
   GLOBAL FONT
------------------------------------------------------------ */
const globalFont = {
  fontFamily: "Rubik, sans-serif",
};

/* ------------------------------------------------------------
   STYLES (UI UNCHANGED)
------------------------------------------------------------ */
const styles = {
  screen: {
    width: "100%",
    minHeight: "100vh",
    overflowX: "hidden",
    overflowY: "auto",
    ...globalFont,
  },
  formCard: {
    width: "85%",
    margin: "40px auto",
    background: "#fff",
    padding: "25px 20px 35px",
    borderRadius: 20,
    boxShadow: "0 4px 25px rgba(0,0,0,0.07)",
  },
  inputBlock: {
    marginBottom: 18,
  },
  label: {
    fontSize: 20,
    marginBottom: 6,
    display: "block",
    fontWeight: 400,
  },
  input: {
    width: "98%",
    padding: "10px 12px",
    borderRadius: 8,
    background: "rgba(254,254,215,1)",
    border: "1px solid #ddd",
    fontSize: 14,
  },
  textarea: {
    width: "98%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #ddd",
    height: 90,
    fontSize: 14,
    background: "rgba(254,254,215,1)",
  },
  actionRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 25,
    gap: 10,
  },
  cancelBtn: {
    padding: "10px 20px",
    borderRadius: 10,
    background: "#f2f2f2",
    border: "1px solid #ddd",
    cursor: "pointer",
  },
  saveBtn: {
    padding: "10px 20px",
    borderRadius: 10,
    background: "rgba(124,60,255,1)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  },
};

/* ------------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------------ */
export default function CompanyProfileEdit() {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const navigate = useNavigate();

  /* SIDEBAR STATE */
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  /* AUTH + LOADING */
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  /* FORM STATES */
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");

  /* SIDEBAR LISTENER */
  useEffect(() => {
    const fn = (e) => setCollapsed(e.detail);
    window.addEventListener("sidebar-toggle", fn);
    return () => window.removeEventListener("sidebar-toggle", fn);
  }, []);

  /* LOAD EXISTING DATA FIRST */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setIsLoading(false);
        return;
      }

      setUser(u);

      try {
        const snap = await getDoc(doc(db, "users", u.uid));
        if (snap.exists()) {
          const d = snap.data();

          setCompanyName(d.company_name || "");
          setIndustry(d.industry || "");
          setSize(d.team_size || "");
          setDescription(d.business_description || "");
          setEmail(d.email || u.email || "");
          setLocation(d.location || "");
          setProfileImageUrl(d.profileImage || "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsub();
  }, []);

  /* SAVE */
  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);

    try {
      await updateDoc(doc(db, "users", user.uid), {
        company_name: companyName,
        industry,
        team_size: size,
        business_description: description,
        email,
        location,
        profileImage: profileImageUrl,
        updatedAt: serverTimestamp(),
      });

      navigate(-1); // back to view page
    } catch (e) {
      console.error("Save failed", e);
    } finally {
      setIsSaving(false);
    }
  };

  /* LOADING SCREEN */
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        Loading profile…
      </div>
    );
  }

  /* UI */
  return (
    <div
      className="freelance-wrapper"
      style={{
        marginLeft: collapsed ? "-110px" : "50px",
        transition: "margin-left 0.25s ease",
      }}
    >
      <div style={styles.screen}>
        <div style={styles.formCard}>
          <Input label="Company Name" value={companyName} onChange={setCompanyName} />
          <Input label="Industry" value={industry} onChange={setIndustry} />
          <Input label="Company Size" value={size} onChange={setSize} />
          <Input label="Location" value={location} onChange={setLocation} />
          <Input label="Email" value={email} onChange={setEmail} />
          <Input label="About Company" value={description} onChange={setDescription} multiline />


          <div style={styles.actionRow}>
            <button style={styles.cancelBtn} onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button
              style={styles.saveBtn}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   INPUT COMPONENT
------------------------------------------------------------ */
function Input({ label, value, onChange, multiline }) {
  return (
    <div style={styles.inputBlock}>
      <label style={styles.label}>{label}</label>
      {multiline ? (
        <textarea
          style={styles.textarea}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          style={styles.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
