// // AccountDetails.jsx
// // NOTE: Firebase config / initializeApp in separate file (e.g. src/firebase/Firebase.js)
// // Ithu la config paste pannadha. Just import { db, auth } from that file.

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

// // 🔹 UPDATE THIS PATH ACCORDING TO YOUR PROJECT STRUCTURE
// // Example: "../../firebase/Firebase" or "../firebase/Firebase"
// import { db } from "../firbase/Firebase"; // <-- CHANGE PATH IF NEEDED

// // ----------------------- Styles (Flutter UI style) ----------------------- //

// const styles = {
//   page: {
//     backgroundColor: "#FFFFFF",
//     minHeight: "100vh",
//     fontFamily:
//       "'Rubik', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
//   },
//   scroll: {
//     maxWidth: 600,
//     margin: "0 auto",
//     paddingBottom: 48,
//   },
//   headerContainer: {
//     width: "100%",
//     backgroundColor: "#FDFD96",
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//     boxSizing: "border-box",
//   },
//   headerInner: {
//     padding: 16,
//     paddingTop: 16,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     position: "relative",
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: 500,
//   },
//   headerNotifBtn: {
//     position: "absolute",
//     right: 16,
//     top: "50%",
//     transform: "translateY(-50%)",
//     border: "none",
//     background: "transparent",
//     padding: 4,
//     cursor: "pointer",
//   },
//   notificationIconWrapper: {
//     position: "relative",
//     padding: 4,
//     borderRadius: 12,
//   },
//   notificationDot: {
//     position: "absolute",
//     right: -2,
//     top: -2,
//     minWidth: 16,
//     minHeight: 16,
//     borderRadius: 8,
//     backgroundColor: "#E53935",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: 10,
//     color: "#FFFFFF",
//     fontWeight: 600,
//     padding: 2,
//   },
//   sectionContainerOuter: {
//     padding: "0 16px",
//     marginTop: 24,
//   },
//   sectionContainerInner: {
//     padding: 16,
//     backgroundColor: "#F9F9F9",
//     borderRadius: 20,
//     border: "1px solid #C5C5C5",
//     boxShadow: "0 2px 4px rgba(0,0,0,0.12)",
//   },
//   sectionTitle: {
//     fontWeight: 600,
//     fontSize: 16,
//     marginBottom: 12,
//   },
//   label: {
//     fontWeight: 600,
//     fontSize: 14,
//   },
//   input: {
//     width: "100%",
//     borderRadius: 10,
//     border: "1px solid #BDBDBD",
//     padding: "10px 12px",
//     fontSize: 14,
//     marginTop: 8,
//     outline: "none",
//     boxSizing: "border-box",
//     fontFamily: "inherit",
//   },
//   inputDisabled: {
//     backgroundColor: "#F5F5F5",
//     color: "#424242",
//     cursor: "not-allowed",
//   },
//   row: {
//     display: "flex",
//     gap: 10,
//     marginTop: 10,
//   },
//   flex1: { flex: 1 },
//   saveBtnWrapper: {
//     marginTop: 8,
//     display: "flex",
//     justifyContent: "flex-start",
//   },
//   saveBtn: {
//     backgroundColor: "#FFFF99", // light yellow
//     color: "#000000",
//     borderRadius: 50,
//     border: "1px solid #D0D0D0",
//     padding: "10px 28px",
//     fontWeight: 700,
//     fontSize: 16,
//     cursor: "pointer",
//     outline: "none",
//   },
//   saveBtnDisabled: {
//     opacity: 0.6,
//     cursor: "default",
//   },
//   passwordInputWrapper: {
//     position: "relative",
//     marginTop: 8,
//   },
//   passwordInput: {
//     width: "100%",
//     borderRadius: 10,
//     border: "1px solid #BDBDBD",
//     padding: "10px 40px 10px 12px",
//     fontSize: 14,
//     outline: "none",
//     boxSizing: "border-box",
//     fontFamily: "inherit",
//   },
//   passwordToggle: {
//     position: "absolute",
//     right: 8,
//     top: "50%",
//     transform: "translateY(-50%)",
//     border: "none",
//     background: "transparent",
//     cursor: "pointer",
//     fontSize: 14,
//     color: "#616161",
//   },
//   deleteBtnWrapper: {
//     padding: "0 16px",
//     marginTop: 20,
//   },
//   deleteBtn: {
//     width: "100%",
//     backgroundColor: "#FFFFFF",
//     color: "#DB2626",
//     border: "1px solid #DB2626",
//     padding: "14px 24px",
//     borderRadius: 8,
//     fontWeight: 500,
//     cursor: "pointer",
//     outline: "none",
//     fontSize: 15,
//   },
//   deleteBtnDisabled: {
//     opacity: 0.6,
//     cursor: "default",
//   },
//   fullScreenLoader: {
//     minHeight: "100vh",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 16,
//     fontSize: 16,
//   },
//   spinner: {
//     width: 40,
//     height: 40,
//     borderRadius: "50%",
//     border: "4px solid #E0E0E0",
//     borderTopColor: "#000000",
//     animation: "spin 1s linear infinite",
//   },
//   toast: {
//     position: "fixed",
//     bottom: 24,
//     left: "50%",
//     transform: "translateX(-50%)",
//     backgroundColor: "#323232",
//     color: "#FFFFFF",
//     padding: "10px 16px",
//     borderRadius: 8,
//     fontSize: 14,
//     zIndex: 2000,
//     maxWidth: "80%",
//     textAlign: "center",
//   },
//   // Notification Modal
//   modalOverlay: {
//     position: "fixed",
//     inset: 0,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     zIndex: 1500,
//     display: "flex",
//     alignItems: "flex-start",
//     justifyContent: "center",
//     paddingTop: "10vh",
//   },
//   modal: {
//     width: "92%",
//     maxWidth: 420,
//     maxHeight: "70vh",
//     borderRadius: 24,
//     overflow: "hidden",
//     backgroundColor: "#FFFFFF",
//     boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
//     display: "flex",
//     flexDirection: "column",
//   },
//   modalHeader: {
//     padding: "12px 16px",
//     background: "#FDFD96",
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//   },
//   modalHeaderIcon: {
//     padding: 8,
//     borderRadius: 12,
//     backgroundColor: "rgba(255,255,255,0.2)",
//     fontSize: 18,
//   },
//   modalHeaderTextWrap: {
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//   },
//   modalHeaderTitle: {
//     fontSize: 16,
//     fontWeight: 700,
//   },
//   modalHeaderSubtitle: {
//     fontSize: 13,
//     color: "#555",
//     marginTop: 2,
//   },
//   modalHeaderActions: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//   },
//   clearAllBtn: {
//     borderRadius: 12,
//     border: "none",
//     backgroundColor: "rgba(255,255,255,0.2)",
//     padding: "6px 10px",
//     fontSize: 12,
//     cursor: "pointer",
//   },
//   closeModalBtn: {
//     borderRadius: 12,
//     border: "none",
//     backgroundColor: "rgba(255,255,255,0.2)",
//     padding: 6,
//     fontSize: 16,
//     cursor: "pointer",
//   },
//   modalBody: {
//     flex: 1,
//     overflowY: "auto",
//     padding: "8px 0 12px",
//   },
//   emptyStateWrap: {
//     padding: 16,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     textAlign: "center",
//     gap: 12,
//   },
//   emptyStateIconWrap: {
//     padding: 20,
//     borderRadius: 50,
//     backgroundColor: "#F5F5F5",
//   },
//   emptyStateIcon: {
//     fontSize: 28,
//     color: "#BDBDBD",
//   },
//   emptyStateTitle: {
//     fontSize: 16,
//     fontWeight: 600,
//     color: "#616161",
//   },
//   emptyStateSubtitle: {
//     fontSize: 13,
//     color: "#9E9E9E",
//     lineHeight: 1.4,
//     whiteSpace: "pre-line",
//   },
//   notifList: {
//     listStyle: "none",
//     margin: 0,
//     padding: 0,
//   },
//   notifItemOuter: {
//     padding: "6px 16px",
//   },
//   notifItemCard: {
//     borderRadius: 16,
//     backgroundColor: "#FAFAFA",
//     border: "1px solid #EEEEEE",
//     padding: 12,
//     display: "flex",
//     gap: 10,
//   },
//   notifIconWrap: {
//     padding: 8,
//     borderRadius: 12,
//     backgroundColor: "#FDFD96",
//     fontSize: 16,
//   },
//   notifTextWrap: {
//     flex: 1,
//   },
//   notifTitle: {
//     fontSize: 14,
//     fontWeight: 600,
//     color: "#212121",
//   },
//   notifBody: {
//     fontSize: 13,
//     color: "#616161",
//     marginTop: 4,
//   },
//   notifFooter: {
//     marginTop: 8,
//     display: "flex",
//     alignItems: "center",
//     fontSize: 12,
//     color: "#9E9E9E",
//   },
//   notifRemoveBtn: {
//     marginLeft: "auto",
//     border: "none",
//     background: "transparent",
//     cursor: "pointer",
//     fontSize: 14,
//     color: "#BDBDBD",
//   },
// };

// // small CSS animation (inject once)
// const injectSpinKeyframes = () => {
//   if (document.getElementById("account-details-spin-style")) return;
//   const style = document.createElement("style");
//   style.id = "account-details-spin-style";
//   style.innerHTML = `
//     @keyframes spin {
//       from { transform: rotate(0deg); }
//       to { transform: rotate(360deg); }
//     }
//   `;
//   document.head.appendChild(style);
// };



// AccountDetails.jsx
// Single-file React component — UI matches the screenshot.
// Backend (firebase) usage is kept the same as your code (no backend changes).
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

// Keep your firebase import path (don't change backend).
import { db } from "../firbase/Firebase";

export default function AccountDetails() {
  const navigate = useNavigate();
  const auth = getAuth();

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
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate("/firelogin");
          return;
        }
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const d = snap.data() || {};
          const fullName =
            (d.firstName || d.first_name || "") +
            (d.lastName || d.last_name ? " " + (d.lastName || d.last_name) : "");
          setName(fullName.trim() || (d.name || ""));
          setEmail(d.email || user.email || "");
          setPassword(d.password || "");
          setAddr1(d.addressLine1 || "");
          setAddr2(d.addressLine2 || "");
          setCity(d.city || "");
          setZip(d.zip || "");
          setStateReg(d.state || "");
          setPhone(d.phone || "");
          if (d.countryCode) setCountryCode(d.countryCode);
        }
      } catch (err) {
        console.error("load error", err);
        showToast("Error loading data");
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const saveAll = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        showToast("User not logged in");
        return;
      }
      setLoading(true);

      // Keep to Firestore only (don't change auth email/password here if not desired)
      await updateDoc(doc(db, "users", user.uid), {
        name: name.trim(),
        phone: phone.trim(),
        countryCode: countryCode,
        addressLine1: addr1.trim(),
        addressLine2: addr2.trim(),
        city: city.trim(),
        zip: zip.trim(),
        state: stateReg.trim(),
        updatedAt: serverTimestamp(),
      });

      showToast("Saved successfully");
    } catch (err) {
      console.error("save error", err);
      showToast("Error saving changes");
    } finally {
      setLoading(false);
    }
  };

  const deleteAcc = async () => {
    if (!window.confirm("Are you sure? This will permanently delete your account.")) return;
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        showToast("User not logged in");
        setLoading(false);
        return;
      }

      // re-auth if using password provider
      if (user.providerData.some((p) => p.providerId === "password")) {
        const pwd = window.prompt("Enter your password to confirm deletion:");
        if (!pwd) {
          showToast("Deletion cancelled");
          setLoading(false);
          return;
        }
        const cred = EmailAuthProvider.credential(user.email || "", pwd);
        await reauthenticateWithCredential(user, cred);
      }

      await deleteDoc(doc(db, "users", user.uid));
      await user.delete();

      showToast("Account deleted");
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("delete error", err);
      showToast("Unable to delete account");
    } finally {
      setLoading(false);
    }
  };

  // Simple styles matching screenshot
  const styles = {
    root: {
      minHeight: "100vh",
      fontFamily: "'Rubik', Inter, system-ui, -apple-system, sans-serif",
      // background:
      //   "radial-gradient(1200px 500px at 10% 5%, #FFF9C8 0%, rgba(255,255,255,0.8) 18%, rgba(255,255,255,0.98) 60%), linear-gradient(180deg,#fff,#fff)",
      padding: "28px 24px 60px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      color: "#111",
    },
    headerWrap: {
      width: "100%",
      maxWidth: 1200,
      marginBottom: 18,
      paddingLeft: 22,
      
    },
    topRow: {
      display: "flex",
      alignItems: "center",
      gap: 14,
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
      fontSize: 18,
      marginTop:"-50px",
    },
    title: {
      fontSize: 28,
      fontWeight: 700,
    },
    subtitle: {
      marginTop: 28
      ,
      color: "#606060",
      fontSize: 13,
      marginLeft: -16,
    },
    card: {
      width: "90%",
      maxWidth: 1100,
      background: "#fff",
      borderRadius: 18,
      padding: "30px 36px",
      boxShadow: "0 38px 70px rgba(6,10,20,0.08)",
      position: "relative",
    },
    labelRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    label: {
      fontSize: 14,
      fontWeight: 600,
      marginBottom: 8,
    },
    input: {
      width: "100%",
      padding: "12px 14px",
      borderRadius: 10,
      border: "1px solid #E6E0E5",
      fontSize: 14,
      outline: "none",
      boxSizing: "border-box",
      background: "#fff",
    },
    twoColRow: {
      display: "flex",
      gap: 14,
    },
    halfInput: {
      flex: 1,
    },
    passwordWrap: {
      position: "relative",
    },
    toggleBtn: {
      position: "absolute",
      right: 12,
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      color: "#6b6b6b",
      fontSize: 13,
      background: "transparent",
      border: "none",
    },
    buttonRow: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 12,
      marginTop: 22,
      alignItems: "center",
    },
    cancelBtn: {
      padding: "10px 48px",
      borderRadius: 28,
      border: "1px solid #D9C8FF",
      background: "#fff",
      color: "#7c3aed",
      cursor: "pointer",
      fontWeight: 600,
    },
    saveBtn: {
      padding: "10px 50px",
      borderRadius: 28,
      border: "none",
      background: "#7c3aed",
      color: "#fff",
      cursor: "pointer",
      fontWeight: 700,
      boxShadow: "0 6px 18px rgba(124,58,237,0.18)",
    },
    deleteBtn: {
      marginTop: 18,
      display: "inline-block",
      padding: "10px 38px",
      borderRadius: 28,
      border: "1px solid #FF0004",
      background: "#fff",
      color: "#FF0004",
      cursor: "pointer",
      fontWeight: 600,
    },
    phoneRow: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      marginTop: 6,
    },
    codeBox: {
      width: 80,
      padding: "10px 8px",
      borderRadius: 8,
      border: "1px solid #E6E0E5",
      textAlign: "center",
      background: "#fff",
    },
    smallNote: {
      fontSize: 12,
      color: "#9b9b9b",
      marginTop: 6,
    },
    bottomLeftDeleteWrap: {
      width: "90%",
      maxWidth: 1100,
      marginTop: 18,
      display: "flex",
      justifyContent: "flex-start",
      paddingLeft: 12,
    },
  };

  return (
    <div style={styles.root}>
      <div style={styles.headerWrap}>
        <div style={styles.topRow}>
          <div
            style={styles.backCircle}
            onClick={() => {
              navigate(-1);
            }}
            title="Back"
          >
            ←
          </div>
          <div>
            <div style={styles.title}>Account Details</div>
            <div style={styles.subtitle}>Complete Your Profile to Get Noticed.</div>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        {/* Name */}
        <div>
          <div style={styles.labelRow}>
            <div style={styles.label}>Name <span style={{ color: "red" }}>*</span></div>
          </div>
          <input
            style={{ ...styles.input, marginBottom: 16 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
          />

          {/* Email */}
          <div style={styles.label}>Email Address<span style={{ color: "red" }}>*</span></div>
          <input
            style={{ ...styles.input, marginBottom: 16 }}
            value={email}
            readOnly
          />

          {/* Password */}
          <div style={styles.label}>Password<span style={{ color: "red" }}>*</span></div>
          <div style={{ ...styles.passwordWrap, marginBottom: 18 }}>
            <input
              type={showPassword ? "text" : "password"}
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button
              style={styles.toggleBtn}
              onClick={() => setShowPassword((s) => !s)}
              type="button"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Address */}
          <div style={styles.label}>Address</div>
          <input
            style={{ ...styles.input, marginTop: 8 }}
            placeholder="Address line 1"
            value={addr1}
            onChange={(e) => setAddr1(e.target.value)}
          />
          <input
            style={{ ...styles.input, marginTop: 10 }}
            placeholder="Address line 2"
            value={addr2}
            onChange={(e) => setAddr2(e.target.value)}
          />

          {/* City */}
          <input
            style={{ ...styles.input, marginTop: 10 }}
            placeholder="City / Town"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          {/* Zip + State */}
          <div style={{ ...styles.twoColRow, marginTop: 12 }}>
            <input
              style={{ ...styles.input, ...styles.halfInput }}
              placeholder="Zip / Postal code"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
            />
            <input
              style={{ ...styles.input, ...styles.halfInput }}
              placeholder="State / Region"
              value={stateReg}
              onChange={(e) => setStateReg(e.target.value)}
            />
          </div>

          {/* Phone */}
          <div style={{ marginTop: 14 }}>
            <div style={styles.label}>Phone Number<span style={{ color: "red" }}>*</span></div>
            <div style={styles.phoneRow}>
              <input
                style={styles.codeBox}
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
              />
              <input
                style={{ ...styles.input, flex: 1 }}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Buttons */}
          <div style={styles.buttonRow}>
            <button
              type="button"
              style={styles.cancelBtn}
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="button"
              style={styles.saveBtn}
              onClick={saveAll}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* Delete (outside card, bottom-left like screenshot) */}
      <div style={styles.bottomLeftDeleteWrap}>
        <button
          type="button"
          style={styles.deleteBtn}
          onClick={deleteAcc}
          disabled={loading}
        >
          Delete Account
        </button>
      </div>

      {/* small toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 28,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.8)",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: 10,
            fontSize: 13,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
