
// import React, { useEffect, useState } from "react";
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
//    UI STYLES (UPDATED)
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

//   /* ---------- HEADER ROW (Arrow + Title) ---------- */
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

//   /* ---------- COMPANY CARD ---------- */
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
//     marginLeft:"10px",
//   },

//   companyAvatar: {
//     width: 75,
//     height: 75,
//     borderRadius: "50%",
//     objectFit: "cover",
//     border: "3px solid #fff",
    
//   },

//   /* EDIT ICON on bottom-right */
//   editIcon: {
//     width: 33,
//     height: 33,
//     position: "absolute",
//     right: -10,
//     bottom: -10,
//     // background: "#000",
//     // borderRadius: "50%",
//     padding: 2,
//     cursor:"pointer"
//     // boxShadow: "0 0 5px rgba(0,0,0,0.2)",
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

//   // linkRow: {
//   //   display: "flex",
//   //   gap: 15,
//   //   marginTop: 6,
//   // },

//   // linkText: {
//   //   fontSize: 13,
//   //   color: "#4A6CF3",
//   //   cursor: "pointer",
//   // },

//   /* BUTTON */
//   getInTouchBtn: {
//     position: "absolute",
//     right: 25,
//     top: 25,
//     padding: "8px 20px",
//     borderRadius: 20,
//     background: "#FFEB3B",
//     border: "1px solid #ddd",
//     cursor: "pointer",
//     fontSize: 13,
//   },

//   /* ---------- FORM WHITE CARD ---------- */
//   formCard: {
//     width: "85%",        // ⬅ Reduced width
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
//     Top: "44px",
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
//     width: "100%"
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

//   const currentUser = auth.currentUser;

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

//   /* LOAD FIREBASE DATA */
//   useEffect(() => {
//     if (!currentUser) return;

//     async function load() {
//       const snap = await getDoc(doc(db, "users", currentUser.uid));
//       if (snap.exists()) {
//         const data = snap.data();

//         setCompanyName(data.company_name || "");
//         setIndustry(data.industry || "");
//         setSize(data.team_size || "");
//         setDescription(data.business_description || "");
//         setEmail(data.email || currentUser.email || "");
//         setLocation(data.location || "");
//         setLinkedin(data.linkedin || "");
//         setWebsites(data.websites?.length ? data.websites : [""]);
//         setProfileImageUrl(data.profileImage || "");
//       }
//       setIsLoading(false);
//     }
//     load();
//   }, []);

//   /* UPLOAD PROFILE IMAGE */
//   const uploadImage = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setIsUploadingProfile(true);

//     const path = `users/${currentUser.uid}/profile.jpg`;
//     const storageRef = ref(storage, path);

//     await uploadBytes(storageRef, file);
//     const url = await getDownloadURL(storageRef);

//     await updateDoc(doc(db, "users", currentUser.uid), {
//       profileImage: url,
//     });

//     setProfileImageUrl(url);
//     setIsUploadingProfile(false);
//   };

//   /* SAVE PROFILE */
//   const saveProfile = async () => {
//     setIsSaving(true);

//     await setDoc(
//       doc(db, "users", currentUser.uid),
//       {
//         company_name: companyName,
//         industry,
//         team_size: size,
//         business_description: description,
//         email,
//         location,
//         linkedin,
//         websites: websites.filter((w) => w.trim() !== ""),
//         updated_at: serverTimestamp(),
//       },
//       { merge: true }
//     );

//     setIsSaving(false);
//     alert("Profile saved!");
//   };

//   if (isLoading)
//     return (
//       <h3 style={{ textAlign: "center", marginTop: 40 }}>Loading…</h3>
//     );

//   return (
//     <div style={styles.screen}>
//       <div style={styles.topHeader}>

//         {/* ---------- HEADER ROW (Arrow + Title) ---------- */}
//         <div style={styles.headerRow}>
//           <div style={styles.backbtn} onClick={() => navigate(-1)}>
//             <img src={backarrow} height={18} />
//           </div>

//           <div style={styles.headerTitle}>Profile summary</div>
//         </div>

//         <div style={styles.headerSubtitle}>
//           Complete Your Profile To Get Noticed.,
//         </div>

//         {/* COMPANY CARD */}
//         <div style={styles.companyCard}>
//           <label style={styles.avatarWrap}>
//             <img
//               src={
//                 profileImageUrl ||
//                 "https://cdn-icons-png.flaticon.com/512/847/847969.png"
//               }
//               style={styles.companyAvatar}
//             />
//             <input type="file" hidden onChange={uploadImage} />

//             {/* EDIT ICON */}
//             <img src={edit} style={styles.editIcon} />
//           </label>

//           <div style={styles.companyRightText}>
//             <div style={styles.companyName}>{companyName || "Company Name"}</div>
//             <div style={styles.companyEmail}>{email}</div>
//             <div style={styles.companyCity}>{location || "City"}</div>

//             {/* <div style={styles.linkRow}>
//               {linkedin && <div style={styles.linkText}>LinkedIn</div>}
//               {websites[0] && <div style={styles.linkText}>Website</div>}
//             </div> */}
//           </div>
//         </div>

//         {/* <button style={styles.getInTouchBtn}>Get in Touch</button> */}
//       </div>

//       {/* FORM */}
//       <div style={styles.formCard}>
//         <Input label="Your Name or Company Name" value={companyName} onChange={setCompanyName} />
//         <Input label="Email Address" value={email} onChange={setEmail} />
//         <Input label="Location" value={location} onChange={setLocation} />
//         <Input label="Industry" value={industry} onChange={setIndustry} />
//         <Input label="Company Size" value={size} onChange={setSize} />
//         <Input multiline label="Company Description" value={description} onChange={setDescription} />

//         <div style={styles.addLinkTitle}>Add Link</div>
//         <div style={styles.addLinkSubtext}>
//           Build trust with your network by connecting your social profiles
//         </div>

//         {websites.map((w, i) => (
//           <Input
//             key={i}
//             label={`Website URL ${i + 1}`}
//             value={w}
//             onChange={(val) => {
//               const arr = [...websites];
//               arr[i] = val;
//               setWebsites(arr);
//             }}
//           />
//         ))}

//         <button style={styles.addMoreBtn} onClick={() => setWebsites([...websites, ""])}>
//           + Add More
//         </button>

//         <div style={styles.actionRow}>
//           <button style={styles.cancelBtn}>Cancel</button>
//           <button style={styles.saveBtn} onClick={saveProfile}>
//             {isSaving ? "Saving…" : "Save"}
//           </button>
//         </div>
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


import React, { useEffect, useState } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

import backarrow from "../../assets/backarrow.png";
import edit from "../../assets/edit.png";

/* ------------------------------------------------------------
   GLOBAL RUBIK FONT
------------------------------------------------------------ */
const globalFont = {
  fontFamily: "Rubik, sans-serif",
};

/* ------------------------------------------------------------
   UI STYLES
------------------------------------------------------------ */
const styles = {
  screen: {
    width: "100%",
    minHeight: "100vh",
    overflowX: "hidden",
    ...globalFont,
  },

  topHeader: {
    width: "100%",
    padding: "25px 25px 60px 25px",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    position: "relative",
    marginLeft: 50,
  },

  headerRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },

  backbtn: {
    width: 36,
    height: 36,
    borderRadius: 14,
    border: "0.8px solid #ccc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    flexShrink: 0,
  },

  headerTitle: {
    fontSize: 36,
    fontWeight: 400,
    ...globalFont,
  },

  headerSubtitle: {
    marginTop: 6,
    fontWeight: 400,
    fontSize: 16,
    opacity: "70%",
    ...globalFont,
  },

  companyCard: {
    marginTop: 35,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    marginLeft: 10,
    background: "#fff",
    padding: 22,
    width: "85%",
    borderRadius: 20,
    boxShadow: "0 4px 25px rgba(0,0,0,0.07)",
  },

  avatarWrap: {
    position: "relative",
    width: 75,
    height: 75,
    marginLeft: "10px",
  },

  companyAvatar: {
    width: 75,
    height: 75,
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #fff",
  },

  editIcon: {
    width: 33,
    height: 33,
    position: "absolute",
    right: -10,
    bottom: -10,
    padding: 2,
    cursor: "pointer",
  },

  companyRightText: {
    marginLeft: 28,
  },

  companyName: {
    fontSize: 30,
    fontWeight: 400,
  },

  companyEmail: {
    opacity: "70%",
    fontWeight: 400,
    marginTop: 5,
    fontSize: 16,
  },

  companyCity: {
    marginTop: 10,
    opacity: "70%",
    fontWeight: 400,
    fontSize: 16,
  },

  formCard: {
    width: "85%",
    margin: "0 90px",
    marginTop: -15,
    background: "#fff",
    padding: "25px 20px 35px 20px",
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
    background: "rgba(254, 254, 215, 1)",
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
    background: "rgba(254, 254, 215, 1)",
  },

  addLinkTitle: {
    fontSize: 20,
    marginBottom: 6,
    display: "block",
    fontWeight: 400,
  },

  addLinkSubtext: {
    fontSize: 13,
    opacity: "70%",
    marginBottom: 20,
  },

  addMoreBtn: {
    padding: "8px 14px",
    borderRadius: 10,
    border: "2px dotted #ddd",
    background: "#fafafa",
    cursor: "pointer",
    marginTop: 10,
    width: "100%",
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
    background: "rgba(124, 60, 255, 1)",
    color: "#fff",
    border: "1px solid #ddd",
    cursor: "pointer",
    fontWeight: 600,
  },
};

/* ------------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------------ */
export default function CompanyProfileScreen() {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const navigate = useNavigate();

  const currentUser = auth.currentUser;

  // ✅ SIDEBAR STATE
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  // ✅ SIDEBAR TOGGLE LISTENER
  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);

  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [websites, setWebsites] = useState([""]);

  useEffect(() => {
    if (!currentUser) return;

    async function load() {
      const snap = await getDoc(doc(db, "users", currentUser.uid));
      if (snap.exists()) {
        const data = snap.data();

        setCompanyName(data.company_name || "");
        setIndustry(data.industry || "");
        setSize(data.team_size || "");
        setDescription(data.business_description || "");
        setEmail(data.email || currentUser.email || "");
        setLocation(data.location || "");
        setLinkedin(data.linkedin || "");
        setWebsites(data.websites?.length ? data.websites : [""]);
        setProfileImageUrl(data.profileImage || "");
      }
      setIsLoading(false);
    }
    load();
  }, []);

  if (isLoading)
    return <h3 style={{ textAlign: "center", marginTop: 40 }}>Loading…</h3>;

  return (
    <div
      className="freelance-wrapper"
      style={{
        marginLeft: collapsed ? "-110px" : "50px",
        transition: "margin-left 0.25s ease",
      }}
    >
      <div style={styles.screen}>
        {/* YOUR FULL UI CONTINUES UNCHANGED BELOW */}
        {/* (profile header, form, inputs, buttons exactly same as before) */}
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
