// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import {
//   getAuth,
//   EmailAuthProvider,
//   reauthenticateWithCredential,
// } from "firebase/auth";

// import {
//   doc,
//   getDoc,
//   updateDoc,
//   deleteDoc,
//   serverTimestamp,
// } from "firebase/firestore";

// import { db } from "../firbase/Firebase";

// export default function AccountDetails() {
//   const navigate = useNavigate();
//   const auth = getAuth();

//   // ⭐ 1️⃣ Add sidebar collapsed state
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   // ⭐ 2️⃣ Listen for sidebar toggle event
//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   // form state
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [addr1, setAddr1] = useState("");
//   const [addr2, setAddr2] = useState("");
//   const [city, setCity] = useState("");
//   const [zip, setZip] = useState("");
//   const [stateReg, setStateReg] = useState("");
//   const [phone, setPhone] = useState("");
//   const [countryCode, setCountryCode] = useState("+91");

//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [toast, setToast] = useState("");

//   // Load user details
//   useEffect(() => {
//     const load = async () => {
//       try {
//         const user = auth.currentUser;
//         if (!user) {
//           navigate("/firelogin");
//           return;
//         }
//         const snap = await getDoc(doc(db, "users", user.uid));
//         if (snap.exists()) {
//           const d = snap.data() || {};
//           const fullName =
//             (d.firstName || d.first_name || "") +
//             (d.lastName || d.last_name ? " " + (d.lastName || d.last_name) : "");
//           setName(fullName.trim() || d.name || "");
//           setEmail(d.email || user.email || "");
//           setPassword(d.password || "");
//           setAddr1(d.addressLine1 || "");
//           setAddr2(d.addressLine2 || "");
//           setCity(d.city || "");
//           setZip(d.zip || "");
//           setStateReg(d.state || "");
//           setPhone(d.phone || "");
//           if (d.countryCode) setCountryCode(d.countryCode);
//         }
//       } catch (err) {
//         console.error("load error", err);
//         showToast("Error loading data");
//       }
//     };
//     load();
//   }, []);

//   const showToast = (msg) => {
//     setToast(msg);
//     setTimeout(() => setToast(""), 3500);
//   };

//   const saveAll = async () => {
//     try {
//       const user = auth.currentUser;
//       if (!user) return showToast("User not logged in");

//       setLoading(true);

//       await updateDoc(doc(db, "users", user.uid), {
//         name: name.trim(),
//         phone: phone.trim(),
//         countryCode,
//         addressLine1: addr1.trim(),
//         addressLine2: addr2.trim(),
//         city: city.trim(),
//         zip: zip.trim(),
//         state: stateReg.trim(),
//         updatedAt: serverTimestamp(),
//       });

//       showToast("Saved successfully");
//     } catch (err) {
//       console.error("save error", err);
//       showToast("Error saving changes");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteAcc = async () => {
//     if (!window.confirm("Are you sure? This will permanently delete your account.")) return;
//     try {
//       setLoading(true);
//       const user = auth.currentUser;
//       if (!user) {
//         showToast("User not logged in");
//         setLoading(false);
//         return;
//       }

//       if (user.providerData.some((p) => p.providerId === "password")) {
//         const pwd = window.prompt("Enter your password to confirm deletion:");
//         if (!pwd) {
//           showToast("Deletion cancelled");
//           setLoading(false);
//           return;
//         }
//         const cred = EmailAuthProvider.credential(user.email || "", pwd);
//         await reauthenticateWithCredential(user, cred);
//       }

//       await deleteDoc(doc(db, "users", user.uid));
//       await user.delete();
//       showToast("Account deleted");

//       navigate("/login", { replace: true });
//     } catch (err) {
//       console.error("delete error", err);
//       showToast("Unable to delete account");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // UI styles
//   const styles = {
//     root: {
//       minHeight: "100vh",
//       fontFamily: "'Rubik', Inter, system-ui",
//       padding: "28px 24px 60px",
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//       color: "#111",
//     },
//     headerWrap: {
//       width: "100%",
//       maxWidth: 1200,
//       marginBottom: 18,
//       paddingLeft: 22,
//     },
//     topRow: {
//       display: "flex",
//       alignItems: "center",
//       gap: 14,
//     },
//     backCircle: {
//       width: 36,
//       height: 36,
//       borderRadius: 10,
//       background: "#fff",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
//       cursor: "pointer",
//       fontSize: 18,
//       marginTop: "-50px",
//     },
//     title: { fontSize: 28, fontWeight: 700 },
//     subtitle: {
//       marginTop: 28,
//       color: "#606060",
//       fontSize: 13,
//       marginLeft: -16,
//     },
//     card: {
//       width: "90%",
//       maxWidth: 1100,
//       background: "#fff",
//       borderRadius: 18,
//       padding: "30px 36px",
//       boxShadow: "0 38px 70px rgba(6,10,20,0.08)",
//     },
//     label: {
//       fontSize: 14,
//       fontWeight: 600,
//       marginBottom: 8,
//     },
//     input: {
//       width: "100%",
//       padding: "12px 14px",
//       borderRadius: 10,
//       border: "1px solid #E6E0E5",
//       fontSize: 14,
//       outline: "none",
//       background: "#fff",
//     },
//     twoColRow: {
//       display: "flex",
//       gap: 14,
//     },
//     halfInput: { flex: 1 },

//     passwordWrap: { position: "relative" },
//     toggleBtn: {
//       position: "absolute",
//       right: 12,
//       top: "50%",
//       transform: "translateY(-50%)",
//       cursor: "pointer",
//       border: "none",
//       background: "transparent",
//       color: "#777",
//       marginTop:"-7px",
//     },

//     buttonRow: {
//       display: "flex",
//       justifyContent: "flex-end",
//       gap: 12,
//       marginTop: 22,
//     },
//     cancelBtn: {
//       padding: "10px 48px",
//       borderRadius: 28,
//       border: "1px solid #D9C8FF",
//       background: "#fff",
//       color: "#7c3aed",
//       fontWeight: 600,
//       cursor: "pointer",
//     },
//     saveBtn: {
//       padding: "10px 50px",
//       borderRadius: 28,
//       border: "none",
//       background: "#7c3aed",
//       color: "#fff",
//       fontWeight: 700,
//       cursor: "pointer",
//     },

//     deleteBtn: {
//       marginTop: 18,
//       padding: "10px 38px",
//       borderRadius: 28,
//       border: "1px solid #FF0004",
//       color: "#FF0004",
//       background: "#fff",
//       cursor: "pointer",
//       fontWeight: 600,
//     },

//     bottomLeftDeleteWrap: {
//       width: "90%",
//       maxWidth: 1100,
//       marginTop: 18,
//       display: "flex",
//       justifyContent: "flex-start",
//       paddingLeft: 12,
//     },
//   };

//   // ⭐ 3️⃣ WRAP ENTIRE UI INSIDE MARGIN-LEFT FOR SIDEBAR
//   return (
//     <div
//       className="freelance-wrapper"
//       style={{
//         marginLeft: collapsed ? "-260px" : "80px",
//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       <div style={styles.root}>
//         <div style={styles.headerWrap}>
//           <div style={styles.topRow}>
//             <div
//               style={styles.backCircle}
//               onClick={() => navigate(-1)}
//             >
//               ←
//             </div>
//             <div>
//               <div style={styles.title}>Account Details</div>
//               <div style={styles.subtitle}>
//                 Complete Your Profile to Get Noticed.
//               </div>
//             </div>
//           </div>
//         </div>

//         <div style={styles.card}>
//           {/* Name */}
//           <div style={styles.label}>
//             Name <span style={{ color: "red" }}>*</span>
//           </div>
//           <input
//             style={{ ...styles.input, marginBottom: 16 }}
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />

//           {/* Email */}
//           <div style={styles.label}>
//             Email Address <span style={{ color: "red" }}>*</span>
//           </div>
//           <input style={{ ...styles.input, marginBottom: 16 }} value={email} readOnly />

//           {/* Password */}
//           <div style={styles.label}>
//             Password <span style={{ color: "red" }}>*</span>
//           </div>
//           <div style={{ ...styles.passwordWrap, marginBottom: 18 }}>
//             <input
//               type={showPassword ? "text" : "password"}
//               style={styles.input}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <button
              
//               type="button"
//               style={styles.toggleBtn}
//               onClick={() => setShowPassword((s) => !s)}
//             >
//               {showPassword ? "Hide" : "Show"}
//             </button>
//           </div>

//           {/* Address */}
//           <div style={styles.label}>Address</div>
//           <input
//             style={{ ...styles.input, marginBottom: 10 }}
//             placeholder="Address line 1"
//             value={addr1}
//             onChange={(e) => setAddr1(e.target.value)}
//           />
//           <input
//             style={{ ...styles.input, marginBottom: 10 }}
//             placeholder="Address line 2"
//             value={addr2}
//             onChange={(e) => setAddr2(e.target.value)}
//           />

//           {/* City */}
//           <input
//             style={{ ...styles.input, marginBottom: 12 }}
//             placeholder="City"
//             value={city}
//             onChange={(e) => setCity(e.target.value)}
//           />

//           {/* Zip + State */}
//           <div style={styles.twoColRow}>
//             <input
//               style={{ ...styles.input, ...styles.halfInput }}
//               placeholder="Zip"
//               value={zip}
//               onChange={(e) => setZip(e.target.value)}
//             />
//             <input
//               style={{ ...styles.input, ...styles.halfInput }}
//               placeholder="State"
//               value={stateReg}
//               onChange={(e) => setStateReg(e.target.value)}
//             />
//           </div>

//           {/* Phone */}
//           <div style={{ marginTop: 16 }}>
//             <div style={styles.label}>
//               Phone Number <span style={{ color: "red" }}>*</span>
//             </div>
//             <div style={{ display: "flex", gap: 12 }}>
//               <input
//                 style={{ ...styles.input, width: 80 }}
//                 value={countryCode}
//                 onChange={(e) => setCountryCode(e.target.value)}
//               />
//               <input
//                 style={{ ...styles.input, flex: 1 }}
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 placeholder="Enter phone number"
//               />
//             </div>
//           </div>

//           {/* Buttons */}
//           <div style={styles.buttonRow}>
//             <button
//               style={styles.cancelBtn}
//               onClick={() => navigate(-1)}
//               disabled={loading}
//             >
//               Cancel
//             </button>
//             <button
//               style={styles.saveBtn}
//               onClick={saveAll}
//               disabled={loading}
//             >
//               {loading ? "Saving..." : "Save"}
//             </button>
//           </div>
//         </div>

//         {/* Delete Button */}
//         <div style={styles.bottomLeftDeleteWrap}>
//           <button
//             style={styles.deleteBtn}
//             onClick={deleteAcc}
//             disabled={loading}
//           >
//             Delete Account
//           </button>
//         </div>

//         {/* Toast */}
//         {toast && (
//           <div
//             style={{
//               position: "fixed",
//               bottom: 28,
//               left: "50%",
//               transform: "translateX(-50%)",
//               background: "rgba(0,0,0,0.8)",
//               color: "#fff",
//               padding: "10px 16px",
//               borderRadius: 10,
//               fontSize: 13,
//             }}
//           >
//             {toast}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




// AccountDetails.jsx
// Responsive version — backend & logic untouched

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import {
//   getAuth,
//   EmailAuthProvider,
//   reauthenticateWithCredential,
// } from "firebase/auth";

// import {
//   doc,
//   getDoc,
//   updateDoc,
//   deleteDoc,
//   serverTimestamp,
// } from "firebase/firestore";

// import { db } from "../firbase/Firebase";

// export default function AccountDetails() {
//   const navigate = useNavigate();
//   const auth = getAuth();

//   // ⭐ Responsive flag
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   useEffect(() => {
//     const r = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", r);
//     return () => window.removeEventListener("resize", r);
//   }, []);

//   // ⭐ Sidebar state
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   useEffect(() => {
//     const handleToggle = (e) => setCollapsed(e.detail);
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   // form state
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [addr1, setAddr1] = useState("");
//   const [addr2, setAddr2] = useState("");
//   const [city, setCity] = useState("");
//   const [zip, setZip] = useState("");
//   const [stateReg, setStateReg] = useState("");
//   const [phone, setPhone] = useState("");
//   const [countryCode, setCountryCode] = useState("+91");

//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [toast, setToast] = useState("");

//   useEffect(() => {
//     const load = async () => {
//       const user = auth.currentUser;
//       if (!user) return navigate("/firelogin");

//       const snap = await getDoc(doc(db, "users", user.uid));
//       if (snap.exists()) {
//         const d = snap.data();
//         const full =
//           (d.firstName || "") +
//           (d.lastName ? " " + d.lastName : "");
//         setName(full.trim() || d.name || "");
//         setEmail(d.email || user.email || "");
//         setPassword(d.password || "");
//         setAddr1(d.addressLine1 || "");
//         setAddr2(d.addressLine2 || "");
//         setCity(d.city || "");
//         setZip(d.zip || "");
//         setStateReg(d.state || "");
//         setPhone(d.phone || "");
//         setCountryCode(d.countryCode || "+91");
//       }
//     };
//     load();
//   }, []);

//   const showToast = (m) => {
//     setToast(m);
//     setTimeout(() => setToast(""), 3500);
//   };

//   const saveAll = async () => {
//     try {
//       const user = auth.currentUser;
//       if (!user) return showToast("User not logged in");
//       setLoading(true);

//       await updateDoc(doc(db, "users", user.uid), {
//         name,
//         phone,
//         countryCode,
//         addressLine1: addr1,
//         addressLine2: addr2,
//         city,
//         zip,
//         state: stateReg,
//         updatedAt: serverTimestamp(),
//       });

//       showToast("Saved successfully");
//     } catch {
//       showToast("Error saving changes");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteAcc = async () => {
//     if (!window.confirm("Delete your account permanently?")) return;
//     try {
//       setLoading(true);
//       const user = auth.currentUser;
//       if (!user) return;

//       if (user.providerData.some((p) => p.providerId === "password")) {
//         const pwd = window.prompt("Enter password to confirm:");
//         if (!pwd) return;
//         const cred = EmailAuthProvider.credential(user.email, pwd);
//         await reauthenticateWithCredential(user, cred);
//       }

//       await deleteDoc(doc(db, "users", user.uid));
//       await user.delete();
//       navigate("/login", { replace: true });
//     } catch {
//       showToast("Unable to delete account");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // styles
//   const styles = {
//     root: {
//       minHeight: "100vh",
//       padding: isMobile ? "16px" : "28px 24px 60px",
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//       fontFamily: "'Rubik', Inter, system-ui",
//     },
//     headerWrap: {
//       width: "100%",
//       maxWidth: 1200,
//       marginBottom: 18,
//       paddingLeft: isMobile ? 0 : 22,
//     },
//     topRow: {
//       display: "flex",
//       gap: 14,
//       alignItems: "center",
//       flexWrap: "wrap",
//     },
//     backCircle: {
//       width: 36,
//       height: 36,
//       borderRadius: 10,
//       background: "#fff",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
//       cursor: "pointer",
//       marginTop: isMobile ? 0 : "-50px",
//     },
//     title: { fontSize: 28, fontWeight: 700 },
//     subtitle: {
//       marginTop: 6,
//       fontSize: 13,
//       color: "#606060",
//     },
//     card: {
//       width: "100%",
//       maxWidth: 1100,
//       background: "#fff",
//       borderRadius: 18,
//       padding: isMobile ? 18 : "30px 36px",
//       boxShadow: "0 38px 70px rgba(6,10,20,0.08)",
//     },
//     label: { fontSize: 14, fontWeight: 600, marginBottom: 8 },
//     input: {
//       width: "100%",
//       padding: "12px 14px",
//       borderRadius: 10,
//       border: "1px solid #E6E0E5",
//     },
//     twoColRow: {
//       display: "flex",
//       gap: 14,
//       flexDirection: isMobile ? "column" : "row",
//     },
//     passwordWrap: { position: "relative" },
//     toggleBtn: {
//       position: "absolute",
//       right: 12,
//       top: "50%",
//       transform: "translateY(-50%)",
//       border: "none",
//       background: "transparent",
//       cursor: "pointer",
//     },
//     buttonRow: {
//       display: "flex",
//       gap: 12,
//       marginTop: 22,
//       flexDirection: isMobile ? "column" : "row",
//       justifyContent: "flex-end",
//     },
//     cancelBtn: {
//       padding: "10px 48px",
//       borderRadius: 28,
//       border: "1px solid #D9C8FF",
//       background: "#fff",
//       color: "#7c3aed",
//       fontWeight: 600,
//     },
//     saveBtn: {
//       padding: "10px 50px",
//       borderRadius: 28,
//       border: "none",
//       background: "#7c3aed",
//       color: "#fff",
//       fontWeight: 700,
//     },
//     bottomLeftDeleteWrap: {
//       width: "100%",
//       maxWidth: 1100,
//       marginTop: 18,
//     },
//     deleteBtn: {
//       padding: "10px 38px",
//       borderRadius: 28,
//       border: "1px solid #FF0004",
//       color: "#FF0004",
//       background: "#fff",
//       fontWeight: 600,
//     },
//   };

//   return (
//     <div
//       style={{
//         marginLeft: isMobile ? "0px" : collapsed ? "-260px" : "80px",
//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       <div style={styles.root}>
//         <div style={styles.headerWrap}>
//           <div style={styles.topRow}>
//             <div style={styles.backCircle} onClick={() => navigate(-1)}>
//               ←
//             </div>
//             <div>
//               <div style={styles.title}>Account Details</div>
//               <div style={styles.subtitle}>
//                 Complete Your Profile to Get Noticed.
//               </div>
//             </div>
//           </div>
//         </div>

//         <div style={styles.card}>
//           <div style={styles.label}>Name *</div>
//           <input style={styles.input} value={name} onChange={(e) => setName(e.target.value)} />

//           <div style={{ ...styles.label, marginTop: 16 }}>Email *</div>
//           <input style={styles.input} value={email} readOnly />

//           <div style={{ ...styles.label, marginTop: 16 }}>Password *</div>
//           <div style={styles.passwordWrap}>
//             <input
//               type={showPassword ? "text" : "password"}
//               style={styles.input}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <button style={styles.toggleBtn} onClick={() => setShowPassword(!showPassword)}>
//               {showPassword ? "Hide" : "Show"}
//             </button>
//           </div>

//           <div style={{ ...styles.label, marginTop: 16 }}>Address</div>
//           <input style={styles.input} value={addr1} onChange={(e) => setAddr1(e.target.value)} />
//           <input style={{ ...styles.input, marginTop: 8 }} value={addr2} onChange={(e) => setAddr2(e.target.value)} />

//           <input style={{ ...styles.input, marginTop: 12 }} value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />

//           <div style={{ marginTop: 12, ...styles.twoColRow }}>
//             <input style={styles.input} value={zip} onChange={(e) => setZip(e.target.value)} placeholder="Zip" />
//             <input style={styles.input} value={stateReg} onChange={(e) => setStateReg(e.target.value)} placeholder="State" />
//           </div>

//           <div style={{ marginTop: 16 }}>
//             <div style={styles.label}>Phone *</div>
//             <div style={{ display: "flex", gap: 12 }}>
//               <input style={{ ...styles.input, width: 80 }} value={countryCode} onChange={(e) => setCountryCode(e.target.value)} />
//               <input style={{ ...styles.input, flex: 1 }} value={phone} onChange={(e) => setPhone(e.target.value)} />
//             </div>
//           </div>

//           <div style={styles.buttonRow}>
//             <button style={styles.cancelBtn} onClick={() => navigate(-1)}>Cancel</button>
//             <button style={styles.saveBtn} onClick={saveAll}>{loading ? "Saving..." : "Save"}</button>
//           </div>
//         </div>

//         <div style={styles.bottomLeftDeleteWrap}>
//           <button style={styles.deleteBtn} onClick={deleteAcc}>Delete Account</button>
//         </div>

//         {toast && (
//           <div style={{
//             position: "fixed",
//             bottom: 24,
//             left: "50%",
//             transform: "translateX(-50%)",
//             background: "#000",
//             color: "#fff",
//             padding: "10px 16px",
//             borderRadius: 10,
//             fontSize: 13,
//           }}>
//             {toast}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// AccountDetails.jsx
// Responsive version — backend & logic untouched

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firbase/Firebase";

export default function AccountDetails() {
  const navigate = useNavigate();
  const auth = getAuth();

  // ⭐ Responsive flag
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const r = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, []);

  // ⭐ Sidebar state
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  useEffect(() => {
    const handleToggle = (e) => setCollapsed(e.detail);
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [addr1, setAddr1] = useState("");
  const [addr2, setAddr2] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [stateReg, setStateReg] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) return navigate("/firelogin");

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const d = snap.data();
        const full =
          (d.firstName || "") +
          (d.lastName ? " " + d.lastName : "");
        setName(full.trim() || d.name || "");
        setEmail(d.email || user.email || "");
        setPassword(d.password || "");
        setAddr1(d.addressLine1 || "");
        setAddr2(d.addressLine2 || "");
        setCity(d.city || "");
        setZip(d.zip || "");
        setStateReg(d.state || "");
        setPhone(d.phone || "");
        setCountryCode(d.countryCode || "+91");
      }
    };
    load();
  }, []);

  const showToast = (m) => {
    setToast(m);
    setTimeout(() => setToast(""), 3500);
  };

  const saveAll = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return showToast("User not logged in");
      setLoading(true);

      await updateDoc(doc(db, "users", user.uid), {
        name,
        phone,
        countryCode,
        addressLine1: addr1,
        addressLine2: addr2,
        city,
        zip,
        state: stateReg,
        updatedAt: serverTimestamp(),
      });

      showToast("Saved successfully");
    } catch {
      showToast("Error saving changes");
    } finally {
      setLoading(false);
    }
  };

  const deleteAcc = async () => {
    if (!window.confirm("Delete your account permanently?")) return;
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) return;

      if (user.providerData.some((p) => p.providerId === "password")) {
        const pwd = window.prompt("Enter password to confirm:");
        if (!pwd) return;
        const cred = EmailAuthProvider.credential(user.email, pwd);
        await reauthenticateWithCredential(user, cred);
      }

      await deleteDoc(doc(db, "users", user.uid));
      await user.delete();
      navigate("/login", { replace: true });
    } catch {
      showToast("Unable to delete account");
    } finally {
      setLoading(false);
    }
  };

  // styles
  const styles = {
    root: {
      minHeight: "100vh",
      padding: isMobile ? "16px" : "28px 24px 60px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "'Rubik', Inter, system-ui",
    },
    headerWrap: {
      width: "100%",
      maxWidth: 1200,
      marginBottom: 18,
      paddingLeft: isMobile ? 0 : 22,
    },
    topRow: {
      display: "flex",
      gap: 14,
      alignItems: "center",
      flexWrap: "wrap",
    },
    backCircle: {
      width: 36,
      height: 36,
      borderRadius: 10,
      background: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
      cursor: "pointer",
      marginTop: isMobile ? 0 : "-50px",
    },
    title: { fontSize: 28, fontWeight: 700 },
    subtitle: {
      marginTop: 6,
      fontSize: 13,
      color: "#606060",
    },
    card: {
      width: "100%",
      maxWidth: 1100,
      background: "#fff",
      borderRadius: 18,
      padding: isMobile ? 18 : "30px 36px",
      boxShadow: "0 38px 70px rgba(6,10,20,0.08)",
    },
    label: { fontSize: 14, fontWeight: 600, marginBottom: 8 },
    input: {
      width: "100%",
      padding: "12px 14px",
      borderRadius: 10,
      border: "1px solid #E6E0E5",
    },
    twoColRow: {
      display: "flex",
      gap: 14,
      flexDirection: isMobile ? "column" : "row",
    },
    passwordWrap: { position: "relative" },
    toggleBtn: {
      position: "absolute",
      right: 12,
      top: "50%",
      transform: "translateY(-50%)",
      border: "none",
      background: "transparent",
      cursor: "pointer",
    },
    buttonRow: {
      display: "flex",
      gap: 12,
      marginTop: 22,
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "flex-end",
    },
    cancelBtn: {
      padding: "10px 48px",
      borderRadius: 28,
      border: "1px solid #D9C8FF",
      background: "#fff",
      color: "#7c3aed",
      fontWeight: 600,
    },
    saveBtn: {
      padding: "10px 50px",
      borderRadius: 28,
      border: "none",
      background: "#7c3aed",
      color: "#fff",
      fontWeight: 700,
    },
    bottomLeftDeleteWrap: {
      width: "100%",
      maxWidth: 1100,
      marginTop: 18,
    },
    deleteBtn: {
      padding: "10px 38px",
      borderRadius: 28,
      border: "1px solid #FF0004",
      color: "#FF0004",
      background: "#fff",
      fontWeight: 600,
    },
  };

  return (
    <div
      style={{
        marginLeft: isMobile ? "0px" : collapsed ? "-260px" : "80px",
         marginTop: isMobile ? "60px" : collapsed ? "10px" : "10px",
        transition: "margin-left 0.25s ease",
      }}
    >
      <div style={styles.root}>
        <div style={styles.headerWrap}>
          <div style={styles.topRow}>
            <div style={styles.backCircle} onClick={() => navigate(-1)}>
              ←
            </div>
            <div>
              <div style={styles.title}>Account Details</div>
              <div style={styles.subtitle}>
                Complete Your Profile to Get Noticed.
              </div>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.label}>Name *</div>
          <input style={styles.input} value={name} onChange={(e) => setName(e.target.value)} />

          <div style={{ ...styles.label, marginTop: 16 }}>Email *</div>
          <input style={styles.input} value={email} readOnly />

          <div style={{ ...styles.label, marginTop: 16 }}>Password *</div>
          <div style={styles.passwordWrap}>
            <input
              type={showPassword ? "text" : "password"}
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button style={styles.toggleBtn} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div style={{ ...styles.label, marginTop: 16 }}>Address</div>
          <input style={styles.input} value={addr1} onChange={(e) => setAddr1(e.target.value)} />
          <input style={{ ...styles.input, marginTop: 8 }} value={addr2} onChange={(e) => setAddr2(e.target.value)} />

          <input style={{ ...styles.input, marginTop: 12 }} value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />

          <div style={{ marginTop: 12, ...styles.twoColRow }}>
            <input style={styles.input} value={zip} onChange={(e) => setZip(e.target.value)} placeholder="Zip" />
            <input style={styles.input} value={stateReg} onChange={(e) => setStateReg(e.target.value)} placeholder="State" />
          </div>

          <div style={{ marginTop: 16 }}>
            <div style={styles.label}>Phone *</div>
            <div style={{ display: "flex", gap: 12 }}>
              <input style={{ ...styles.input, width: 80 }} value={countryCode} onChange={(e) => setCountryCode(e.target.value)} />
              <input style={{ ...styles.input, flex: 1 }} value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>

          <div style={styles.buttonRow}>
            <button style={styles.cancelBtn} onClick={() => navigate(-1)}>Cancel</button>
            <button style={styles.saveBtn} onClick={saveAll}>{loading ? "Saving..." : "Save"}</button>
          </div>
        </div>

        <div style={styles.bottomLeftDeleteWrap}>
          <button style={styles.deleteBtn} onClick={deleteAcc}>Delete Account</button>
        </div>

        {toast && (
          <div style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#000",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: 10,
            fontSize: 13,
          }}>
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}