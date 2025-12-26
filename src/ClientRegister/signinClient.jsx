// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { db } from "../firbase/Firebase";
// import { collection, query, where, getDocs } from "firebase/firestore";

// const SEND_OTP = "https://huzzler.onrender.com/api/auth/send-otp";

// export default function SignUpClient() {
//   const navigate = useNavigate();

//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const show = (msg) => alert(msg);

//   const handleSendOtp = async () => {
//     if (!firstName.trim()) return show("Enter First Name");
//     if (!lastName.trim()) return show("Enter Last Name");
//     if (!email.trim()) return show("Enter Email");
//     if (!/\S+@\S+\.\S+/.test(email.trim()))
//       return show("Enter a valid email address");
//     if (!password || password.length < 6)
//       return show("Password must be at least 6 characters");

//     const normalizedEmail = email.trim().toLowerCase();
//     setLoading(true);

//     try {
//       const usersRef = collection(db, "users");
//       const q = query(usersRef, where("email", "==", normalizedEmail));
//       const snap = await getDocs(q);

//       if (!snap.empty) {
//         const existingRole = snap.docs[0].data().role;
//         setLoading(false);

//         if (existingRole === "freelancer") {
//           return show("This email is registered as a Freelancer.");
//         }
//         return show("Email already registered, please login.");
//       }

//       const res = await axios.post(SEND_OTP, { email: normalizedEmail });

//       if (res.data.success) {
//         localStorage.setItem(
//           "otpUser",
//           JSON.stringify({
//             firstName: firstName.trim(),
//             lastName: lastName.trim(),
//             email: normalizedEmail,
//             password,
//             role: "client",
//           })
//         );

//         navigate("/otp", {
//           state: {
//             firstName,
//             lastName,
//             email: normalizedEmail,
//             password,
//             role: "client",
//           },
//         });
//       }
//     } catch (err) {
//       show(err.response?.data?.message || "OTP sending failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.pageBg}>
//       {/* ==== TOP NAV ==== */}
//       <div style={styles.topRow}>
//         <span style={styles.backArrow} onClick={() => navigate(-1)}>←</span>
//         <span style={styles.topTitle}>sign up as Client</span>
//       </div>

//       {/* ==== CARD ==== */}
//       <div style={styles.card}>
//         <p style={styles.titleText}>“Ready to Make Things Happen”</p>

//         <input
//           type="text"
//           placeholder="First name"
//           value={firstName}
//           onChange={(e) => setFirstName(e.target.value)}
//           style={styles.input}
//         />

//         <input
//           type="text"
//           placeholder="Last name"
//           value={lastName}
//           onChange={(e) => setLastName(e.target.value)}
//           style={styles.input}
//         />

//         <input
//           type="email"
//           placeholder="Email Address"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           style={styles.input}
//         />

//         <input
//           type="password"
//           placeholder="Enter Your Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           style={styles.input}
//         />

//         {/* TERMS */}
//         <div style={styles.termsRow}>
//           <input type="checkbox" style={styles.checkbox} />
//           <p style={styles.termsText}>
//             By signing up, you agree to our{" "}
//             <span style={styles.link}>Terms of service</span> & <br />
//              acknowledge our{" "}
//             <span style={styles.link}>Privacy Policy</span>
//           </p>
//         </div>

//         {/* CONTINUE BTN */}
//         <button
//           style={styles.continueBtn}
//           onClick={handleSendOtp}
//           disabled={loading}
//         >
//           {loading ? "Processing..." : "CONTINUE"}
//         </button>
//       </div>

//       {/* FOOTER */}
//       <p style={styles.footer}>
//         Have an Account?{" "}
//         <span style={styles.loginLabel} onClick={() => navigate("/firelogin")}>
//           log in :
//         </span>
//       </p>
//     </div>
//   );
// }

// /* =======================
//     EXACT UI STYLES
// ======================= */
// const styles = {
//   pageBg: {
//     minHeight: "100vh",
//     background:
//       "linear-gradient(140deg, #ffffff 10%, #f4edff 60%, #fffbd9 100%)",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     paddingTop: 40,
//     fontFamily: "Inter, sans-serif",
//   },

//   topRow: {
//     width: 610,
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     marginBottom: 10,
//   },

//   backArrow: {
//     cursor: "pointer",
//     fontSize: 20,
//     fontWeight: 600,
//     marginLeft: -50,
//   },

//   topTitle: {
//     fontSize: 16,
//     fontWeight: 600,
//   },

//   card: {
//     width: 610,
//     background: "#fff",
//     borderRadius: 28,
//     padding: "45px 55px 55px",
//     boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
//     textAlign: "center",
//   },

//   titleText: {
//     fontSize: 15,
//     fontWeight: 400,
//     marginBottom: 30,
//     color: "#000000",
//   },

//   input: {
//     width: "100%",
//     padding: "15px",
//     borderRadius: 14,
//     border: "1px solid #e5e5e5",
//     fontSize: 15,
//     marginBottom: 18,
//     outline: "none",
//     background: "#fff",
//     boxSizing: "border-box",
//   },

//   termsRow: {
//     display: "flex",
//     alignItems: "flex-start",
//     gap: 10,
//     marginBottom: 25,
//     marginTop: 5,
//   },

//   checkbox: {marginTop:20,color:"red", width: 18, height: 18 },

//   termsText: { fontSize: 13, color: "#444", textAlign: "left" },

//   link: { color: "#7c3aed", textDecoration: "underline" },

//   continueBtn: {
//     width: "100%",
//     padding: "16px",
//     borderRadius: 16,
//     background: "#7c3aed",
//     color: "white",
//     fontSize: 15,
//     fontWeight: 600,
//     border: "none",
//     cursor: "pointer",
//     boxShadow: "0 6px 18px rgba(124,58,237,0.4)",
//   },

//   footer: {
//     marginTop: 25,
//     fontSize: 15,
//   },

//   loginLabel: {
//     background: "#fff59d",
//     padding: "8px 10px",
//     borderRadius: 6,
//     marginLeft: 5,
//     cursor: "pointer",
//     fontWeight: 700,
//   },
// };






// src/pages/SignUpClient.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { db } from "../firbase/Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const SEND_OTP = "https://huzzler.onrender.com/api/auth/send-otp";

export default function SignUpClient() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const show = (msg) => alert(msg);

  const handleSendOtp = async () => {
    if (!firstName.trim()) return show("Enter First Name");
    if (!lastName.trim()) return show("Enter Last Name");
    if (!email.trim()) return show("Enter Email");
    if (!/\S+@\S+\.\S+/.test(email.trim()))
      return show("Enter a valid email address");
    if (!password || password.length < 6)
      return show("Password must be at least 6 characters");

    const normalizedEmail = email.trim().toLowerCase();
    setLoading(true);

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", normalizedEmail));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const existingRole = snap.docs[0].data().role;
        setLoading(false);

        if (existingRole === "freelancer") {
          return show("This email is registered as a Freelancer.");
        }
        return show("Email already registered, please login.");
      }

      const res = await axios.post(SEND_OTP, { email: normalizedEmail });

      if (res.data.success) {
        localStorage.setItem(
          "otpUser",
          JSON.stringify({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: normalizedEmail,
            password,
            role: "client",
          })
        );

        navigate("/otp", {
          state: {
            firstName,
            lastName,
            email: normalizedEmail,
            password,
            role: "client",
          },
        });
      }
    } catch (err) {
      show(err.response?.data?.message || "OTP sending failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageBg}>
      {/* ==== TOP NAV ==== */}
      <div style={styles.topRow}>
        <span style={styles.backArrow} onClick={() => navigate(-1)}>←</span>
        <span style={styles.topTitle}>sign up as Client</span>
      </div>

      {/* ==== CARD ==== */}
      <div style={styles.card}>
        <p style={styles.titleText}>“Ready to Make Things Happen”</p>

        <input
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          style={styles.input}
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Enter Your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        {/* TERMS */}
        <div style={styles.termsRow}>
          <input type="checkbox" style={styles.checkbox} />
          <p style={styles.termsText}>
            By signing up, you agree to our{" "}
            <span style={styles.link}>Terms of service</span> & 
             acknowledge our{" "}
            <span style={styles.link}>Privacy Policy</span>
          </p>
        </div>

        {/* CONTINUE BTN */}
        <button
          style={styles.continueBtn}
          onClick={handleSendOtp}
          disabled={loading}
        >
          {loading ? "Processing..." : "CONTINUE"}
        </button>
      </div>

      {/* FOOTER */}
      <p style={styles.footer}>
        Have an Account?{" "}
        <span style={styles.loginLabel} onClick={() => navigate("/firelogin")}>
          log in :
        </span>
      </p>
    </div>
  );
}

/* =======================
    EXACT UI STYLES
======================= */
const styles = {
  pageBg: {
    minHeight: "100vh",
    background:
      "linear-gradient(140deg, #ffffff 10%, #f4edff 60%, #fffbd9 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 40,
    fontFamily: "Inter, sans-serif",
    paddingLeft: 20,
    paddingRight: 20,
  },

  topRow: {
    width: "100%",
    maxWidth: 610,
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },

  backArrow: {
    cursor: "pointer",
    fontSize: 20,
    fontWeight: 600,
  },

  topTitle: {
    fontSize: 16,
    fontWeight: 600,
  },

  card: {
    width: "100%",
    maxWidth: 610,
    background: "#fff",
    borderRadius: 28,
    padding: "45px 25px 55px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
    textAlign: "center",
    boxSizing: "border-box",
  },

  titleText: {
    fontSize: 15,
    fontWeight: 400,
    marginBottom: 30,
    color: "#000000",
  },

  input: {
    width: "100%",
    padding: "15px",
    borderRadius: 14,
    border: "1px solid #e5e5e5",
    fontSize: 15,
    marginBottom: 18,
    outline: "none",
    background: "#fff",
    boxSizing: "border-box",
  },

  termsRow: {
    display: "flex",
    alignItems: "center", // align checkbox & text vertically
    gap: 10,
    marginBottom: 25,
    flexWrap: "nowrap",
    justifyContent: "flex-start",
  },

  checkbox: {
    width: 18,
    height: 18,
    marginTop: 2,
    flexShrink: 0,
  },

  termsText: {
    fontSize: 13,
    color: "#444",
    textAlign: "left",
  },

  link: {
    color: "#7c3aed",
    textDecoration: "underline",
  },

  continueBtn: {
    width: "100%",
    padding: "16px",
    borderRadius: 16,
    background: "#7c3aed",
    color: "white",
    fontSize: 15,
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
    boxShadow: "0 6px 18px rgba(124,58,237,0.4)",
  },

  footer: {
    marginTop: 25,
    fontSize: 15,
    textAlign: "center",
  },

  loginLabel: {
    background: "#fff59d",
    padding: "8px 10px",
    borderRadius: 6,
    marginLeft: 5,
    cursor: "pointer",
    fontWeight: 700,
  },

  // MEDIA QUERIES
  '@media (max-width: 640px)': {
    card: {
      padding: "30px 20px 40px",
      borderRadius: 20,
    },
    titleText: { fontSize: 14 },
    input: { fontSize: 14, padding: "12px" },
    continueBtn: { fontSize: 14, padding: "14px" },
    topTitle: { fontSize: 14 },
  },
};