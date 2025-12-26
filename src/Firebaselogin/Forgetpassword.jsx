// import React, { useState } from "react";
// import { db } from "../firbase/Firebase";
// import { collection, query, where, getDocs } from "firebase/firestore";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   async function handleForgotPassword() {
//     const normalized = email.trim().toLowerCase();

//     if (!normalized) {
//       alert("Please enter your email.");
//       return;
//     }

//     try {
//       setLoading(true);

//       // check user exists
//       const q = query(collection(db, "users"), where("email", "==", normalized));
//       const snap = await getDocs(q);

//       if (snap.empty) {
//         alert("No account found with this email.");
//         setLoading(false);
//         return;
//       }

//       const data = snap.docs[0].data();
//       const storedPassword = data.password || "";
//       const firstName = data.firstName || "";
//       const lastName = data.lastName || "";
//       const role = data.role || "freelancer";

//       // send OTP
//       const res = await axios.post(
//         "https://huzzler.onrender.com/api/auth/send-otp",
//         { email: normalized }
//       );

//       if (res.status === 200) {
//         alert("OTP sent to " + normalized);

//         if (role === "client") {
//           navigate("/clientloginotp", {
//             state: { email: normalized, firstName, lastName, password: storedPassword, role },
//           });
//         } else {
//           navigate("/freelancer-loginotp", {
//             state: { email: normalized, firstName, lastName, password: storedPassword, role },
//           });
//         }
//       } else {
//         alert(res.data.message || "Failed to send OTP.");
//       }
//     } catch (err) {
//       alert("Error: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // ========================= UI =========================
//   return (
//     <div style={styles.page}>
      
//       {/* BACK BUTTON */}
//       <div style={styles.topRow}>
//         <span style={styles.backArrow} onClick={() => navigate(-1)}>←</span>
//         <span style={styles.backText}>Back</span>
//       </div>

//       {/* CARD */}
//       <div style={styles.card}>

//         <h2 style={styles.title}>Forgot Password</h2>
//         <p style={styles.subtitle}>Enter your email to receive a verification code</p>

//         <input
//           type="email"
//           placeholder="Enter Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           style={styles.input}
//         />

//         <button
//           onClick={handleForgotPassword}
//           disabled={loading}
//           style={styles.button}
//         >
//           {loading ? "Sending..." : "Send OTP"}
//         </button>

//         <button
//           style={styles.loginLink}
//           onClick={() => navigate("/firelogin")}
//         >
//           Back to Login
//         </button>

//       </div>
//     </div>
//   );
// }

// const styles = {
//   page: {
//     width: "100vw",
//     height: "100vh",
//     background:
//       "linear-gradient(135deg, #fffbe8 20%, #f3e9ff 80%)",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     paddingTop: 60,
//     fontFamily: "Inter, sans-serif",
//   },

//   topRow: {
//     width: 450,
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     marginBottom: 25,
//   },

//   backArrow: {
//     fontSize: 20,
//     cursor: "pointer",
//     fontWeight: 600,
//     marginLeft:"-40px",
//   },

//   backText: {
//     fontSize: 14,
//     fontWeight: 600,
//   },

//   card: {
//     width: 450,
//     background: "#fff",
//     padding: "40px 50px",
//     borderRadius: 26,
//     boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
//     textAlign: "center",
//   },

//   title: {
//     fontSize: 20,
//     fontWeight: 700,
//     marginBottom: 10,
//   },

//   subtitle: {
//     fontSize: 14,
//     color: "#444",
//     marginBottom: 30,
//   },

//   input: {
//     width: "100%",
//     padding: "15px",
//     borderRadius: 14,
//     border: "1px solid #ddd",
//     outline: "none",
//     fontSize: 15,
//     marginBottom: 22,
//   },

//   button: {
//     width: "100%",
//     padding: "15px",
//     borderRadius: 16,
//     background: "#7C3CFF",
//     color: "#fff",
//     fontSize: 15,
//     fontWeight: 600,
//     border: "none",
//     cursor: "pointer",
//     marginTop: 10,
//   },

//   loginLink: {
//     marginTop: 25,
//     fontSize: 14,
//     color: "#6a1bff",
//     cursor: "pointer",
//     background: "none",
//     border: "none",
//     textDecoration: "underline",
//   },
// };





import React, { useState } from "react";
import { db } from "../firbase/Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleForgotPassword() {
    const normalized = email.trim().toLowerCase();

    if (!normalized) {
      alert("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      const q = query(collection(db, "users"), where("email", "==", normalized));
      const snap = await getDocs(q);

      if (snap.empty) {
        alert("No account found with this email.");
        return;
      }

      const data = snap.docs[0].data();
      const { password = "", firstName = "", lastName = "", role = "freelancer" } = data;

      const res = await axios.post(
        "https://huzzler.onrender.com/api/auth/send-otp",
        { email: normalized }
      );

      if (res.status === 200) {
        alert("OTP sent to " + normalized);

        navigate(
          role === "client" ? "/clientloginotp" : "/freelancer-loginotp",
          {
            state: { email: normalized, firstName, lastName, password, role },
          }
        );
      } else {
        alert(res.data.message || "Failed to send OTP.");
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      {/* BACK BUTTON */}
      <div style={styles.topRow}>
        <span style={styles.backArrow} onClick={() => navigate(-1)}>←</span>
        <span style={styles.backText}>Back</span>
      </div>

      {/* CARD */}
      <div style={styles.card}>
        <h2 style={styles.title}>Forgot Password</h2>
        <p style={styles.subtitle}>
          Enter your email to receive a verification code
        </p>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <button
          onClick={handleForgotPassword}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>

        <button
          style={styles.loginLink}
          onClick={() => navigate("/firelogin")}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(135deg, #fffbe8 20%, #f3e9ff 80%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 16px",
    fontFamily: "Inter, sans-serif",
    boxSizing: "border-box",
  },

  topRow: {
    width: "100%",
    maxWidth: 420,
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },

  backArrow: {
    fontSize: 20,
    cursor: "pointer",
    fontWeight: 600,
  },

  backText: {
    fontSize: 14,
    fontWeight: 600,
  },

  card: {
    width: "100%",
    maxWidth: 420,
    background: "#fff",
    padding: "32px 24px",
    borderRadius: 24,
    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
    textAlign: "center",
    boxSizing: "border-box",
  },

  title: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: "#444",
    marginBottom: 26,
  },

  input: {
    width: "100%",
    padding: "14px",
    borderRadius: 14,
    border: "1px solid #ddd",
    outline: "none",
    fontSize: 15,
    marginBottom: 20,
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    padding: "14px",
    borderRadius: 16,
    background: "#7C3CFF",
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
  },

  loginLink: {
    marginTop: 22,
    fontSize: 14,
    color: "#6a1bff",
    cursor: "pointer",
    background: "none",
    border: "none",
    textDecoration: "underline",
  },
};
