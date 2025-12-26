// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { signInWithCustomToken } from "firebase/auth";
// import { auth } from "../firbase/Firebase";
// import { useNavigate, useLocation } from "react-router-dom";

// export default function OtpVerify() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const localData = JSON.parse(localStorage.getItem("otpUser") || "{}");
//   const stateData = location.state || {};

//   const email = stateData.email || localData.email;
//   const role = stateData.role || localData.role;
//   const uid = stateData.uid || localData.uid;

//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [timer, setTimer] = useState(30);
//   const [isResendDisabled, setIsResendDisabled] = useState(true);

//   // If no email → block page
//   useEffect(() => {
//     if (!email) {
//       alert("Signup data missing. Please start again.");
//       navigate("/signup");
//     }
//   }, []);

//   // Timer
//   useEffect(() => {
//     if (timer === 0) {
//       setIsResendDisabled(false);
//       return;
//     }
//     const countdown = setTimeout(() => setTimer((t) => t - 1), 1000);
//     return () => clearTimeout(countdown);
//   }, [timer]);

//   // OTP input handler
//   const handleOtpChange = (value, index) => {
//     if (!/^[0-9]?$/.test(value)) return; // only digits

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     // auto move to next
//     if (value && index < 5) {
//       document.getElementById(`otp-${index + 1}`).focus();
//     }
//   };

//   // Final OTP string
//   const joinOtp = otp.join("");

//   // ---------------- VERIFY OTP ----------------
//   const verifyOtp = async () => {
//     if (joinOtp.length !== 6) return alert("Enter a valid 6-digit OTP");

//     try {
//       const res = await axios.post(
//         "https://huzzler.onrender.com/api/auth/verify-otp",
//         { email: email.toLowerCase(), otp: joinOtp }
//       );

//       if (!res.data?.token) return alert("Invalid OTP");

//       await signInWithCustomToken(auth, res.data.token);

//       const finalUid = uid || res.data.uid;

//       localStorage.removeItem("otpUser");

//       // CLIENT FLOW
//       if (role === "client") {
//         return navigate("/client-details", {
//           state: {
//             uid: finalUid,
//             email,
//             firstName: stateData.firstName || localData.firstName,
//             lastName: stateData.lastName || localData.lastName,
//             password: stateData.password || localData.password,
//             role: "client",
//           },
//         });
//       }

//       // FREELANCER FLOW
//       navigate("/freelancer-details", {
//         state: {
//           uid: finalUid,
//           email,
//           firstName: stateData.firstName || localData.firstName,
//           lastName: stateData.lastName || localData.lastName,
//           password: stateData.password || localData.password,
//           role: "freelancer",
//         },
//       });
//     } catch (err) {
//       alert(err?.response?.data?.message || "OTP verification failed");
//     }
//   };

//   // ---------------- RESEND OTP ----------------
//   const resendOtp = async () => {
//     try {
//       setIsResendDisabled(true);
//       setTimer(30);

//       await axios.post("https://huzzler.onrender.com/api/auth/resend-otp", {
//         email: email.toLowerCase(),
//         action: "resend",
//       });

//       alert("A new OTP has been sent!");
//     } catch {
//       alert("Failed to resend OTP");
//     }
//   };

//   return (
//     <div style={styles.pageBg}>
      
//       {/* TOP BACK ROW */}
//       <div style={styles.topRow}>
//         <span style={styles.backArrow} onClick={() => navigate(-1)}>←</span>
//         <span style={styles.backText}>BACK</span>
//       </div>

//       {/* CARD */}
//       <div style={styles.card}>
//         <h2 style={styles.bigTitle}>
//           You're almost there! We just need to verify your email.
//         </h2>

//         <p style={styles.subTitle}>Great! Almost done!</p>
//         <p style={styles.subTitle2}>Please verify your email</p>

//         <p style={styles.sentText}>Enter the verification code sent to:</p>
//         <p style={styles.emailText}>{email}</p>

//         {/* OTP BOXES */}
//         <div style={styles.otpRow}>
//           {otp.map((digit, i) => (
//             <input
//               key={i}
//               id={`otp-${i}`}
//               value={digit}
//               maxLength="1"
//               onChange={(e) => handleOtpChange(e.target.value, i)}
//               style={styles.otpBox}
//             />
//           ))}
//         </div>

//         {/* RESEND */}
//         <p style={styles.resendWrap}>
//           Didn’t receive OTP?{" "}
//           {isResendDisabled ? (
//             <span style={styles.timerText}></span>
//           ) : (
//             <span style={styles.resendLink} onClick={resendOtp}>Resend OTP</span>
//           )}
//         </p>

//         {/* BUTTON */}
//         <button style={styles.verifyBtn} onClick={verifyOtp}>
//           Get Started
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ===========================
//       PERFECT FIGMA STYLES
// =========================== */
// const styles = {
//   pageBg: {
//     minHeight: "100vh",
//     background:
//       "linear-gradient(140deg,#ffffff 0%,#f4edff 50%,#fffbd9 100%)",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     paddingTop: 40,
//     fontFamily: "Inter, sans-serif",
//   },

//   topRow: {
//     width: 650,
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     marginBottom: 10,
//   },

//   backArrow: {
//     fontSize: 22,
//     cursor: "pointer",
//     marginLeft: -40,
//   },

//   backText: {
//     fontWeight: 700,
//     fontSize: 15,
//   },

//   card: {
//     width: 650,
//     background: "#fff",
//     padding: "45px 55px 60px",
//     textAlign: "center",
//     borderRadius: 30,
//     boxShadow: "0 12px 40px rgba(0,0,0,0.10)",
//   },

//   bigTitle: {
//     fontSize: 24,
//     fontWeight: 494,
//     marginBottom: 20,
//   },

//   subTitle: {
//     fontSize: 16,
//     fontWeight: 400,
//     marginBottom: 3,
//   },

//   subTitle2: {
//     fontSize: 20,
//     fontWeight: 400,
//     marginBottom: 25,
//   },

//   sentText: {
//     color: "#6A7282",
//     fontWeight: 400,
//     fontSize: 16,
//   },

//   emailText: {
//     fontSize: 16,
//     fontWeight: 400,
//     marginBottom: 25,
//   },

//   otpRow: {
//     display: "flex",
//     justifyContent: "center",
//     gap: 12,
//     marginBottom: 25,
//   },

//   otpBox: {
//     width: 50,
//     height: 55,
//     borderRadius: 12,
//     border: "2px solid #e6e6e6",
//     fontSize: 22,
//     textAlign: "center",
//     outline: "none",
//   },

//   resendWrap: {
//     marginBottom: 25,
//     color: "#777",
//   },

//   timerText: {
//     fontWeight: 600,
//   },

//   resendLink: {
//     color: "#7C3CFF",
//     fontWeight: 600,
//     cursor: "pointer",
//   },

//   verifyBtn: {
//     width: "100%",
//     padding: "16px",
//     background: "#7C3CFF",
//     borderRadius: 16,
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: 600,
//     border: "none",
//     cursor: "pointer",
//   },
// };

import React, { useState, useEffect } from "react";
import axios from "axios";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../firbase/Firebase";
import { useNavigate, useLocation } from "react-router-dom";

export default function OtpVerify() {
  const navigate = useNavigate();
  const location = useLocation();

  const localData = JSON.parse(localStorage.getItem("otpUser") || "{}");
  const stateData = location.state || {};

  const email = stateData.email || localData.email;
  const role = stateData.role || localData.role;
  const uid = stateData.uid || localData.uid;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  // If no email → block page
  useEffect(() => {
    if (!email) {
      alert("Signup data missing. Please start again.");
      navigate("/signup");
    }
  }, []);

  // Timer
  useEffect(() => {
    if (timer === 0) {
      setIsResendDisabled(false);
      return;
    }
    const countdown = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(countdown);
  }, [timer]);

  // OTP input handler
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return; // only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // auto move to next
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  // Final OTP string
  const joinOtp = otp.join("");

  // ---------------- VERIFY OTP ----------------
  const verifyOtp = async () => {
    if (joinOtp.length !== 6) return alert("Enter a valid 6-digit OTP");

    try {
      const res = await axios.post(
        "https://huzzler.onrender.com/api/auth/verify-otp",
        { email: email.toLowerCase(), otp: joinOtp }
      );

      if (!res.data?.token) return alert("Invalid OTP");

      await signInWithCustomToken(auth, res.data.token);

      const finalUid = uid || res.data.uid;

      localStorage.removeItem("otpUser");

      // CLIENT FLOW
      if (role === "client") {
        return navigate("/client-details", {
          state: {
            uid: finalUid,
            email,
            firstName: stateData.firstName || localData.firstName,
            lastName: stateData.lastName || localData.lastName,
            password: stateData.password || localData.password,
            role: "client",
          },
        });
      }

      // FREELANCER FLOW
      navigate("/freelancer-details", {
        state: {
          uid: finalUid,
          email,
          firstName: stateData.firstName || localData.firstName,
          lastName: stateData.lastName || localData.lastName,
          password: stateData.password || localData.password,
          role: "freelancer",
        },
      });
    } catch (err) {
      alert(err?.response?.data?.message || "OTP verification failed");
    }
  };

  // ---------------- RESEND OTP ----------------
  const resendOtp = async () => {
    try {
      setIsResendDisabled(true);
      setTimer(30);

      await axios.post("https://huzzler.onrender.com/api/auth/resend-otp", {
        email: email.toLowerCase(),
        action: "resend",
      });

      alert("A new OTP has been sent!");
    } catch {
      alert("Failed to resend OTP");
    }
  };

  return (
    <div style={styles.pageBg}>
      
      {/* TOP BACK ROW */}
      <div style={styles.topRow}>
        <span style={styles.backArrow} onClick={() => navigate(-1)}>←</span>
        <span style={styles.backText}>BACK</span>
      </div>

      {/* CARD */}
      <div style={styles.card}>
        <h2 style={styles.bigTitle}>
          You're almost there! We just need to verify your email.
        </h2>

        <p style={styles.subTitle}>Great! Almost done!</p>
        <p style={styles.subTitle2}>Please verify your email</p>

        <p style={styles.sentText}>Enter the verification code sent to:</p>
        <p style={styles.emailText}>{email}</p>

        {/* OTP BOXES */}
        <div style={styles.otpRow}>
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              value={digit}
              maxLength="1"
              onChange={(e) => handleOtpChange(e.target.value, i)}
              style={styles.otpBox}
            />
          ))}
        </div>

        {/* RESEND */}
        <p style={styles.resendWrap}>
          Didn’t receive OTP?{" "}
          {isResendDisabled ? (
            <span style={styles.timerText}></span>
          ) : (
            <span style={styles.resendLink} onClick={resendOtp}>Resend OTP</span>
          )}
        </p>

        {/* BUTTON */}
        <button style={styles.verifyBtn} onClick={verifyOtp}>
          Get Started
        </button>
      </div>
    </div>
  );
}

/* ===========================
      PERFECT FIGMA STYLES
=========================== */
const styles = {
  pageBg: {
    minHeight: "100vh",
    background:
      "linear-gradient(140deg,#ffffff 0%,#f4edff 50%,#fffbd9 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 40,
    fontFamily: "Inter, sans-serif",
  },

  topRow: {
    width: 650,
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },

  backArrow: {
    fontSize: 22,
    cursor: "pointer",
    marginLeft: -40,
  },

  backText: {
    fontWeight: 700,
    fontSize: 15,
  },

  card: {
    width: 650,
    background: "#fff",
    padding: "45px 55px 60px",
    textAlign: "center",
    borderRadius: 30,
    boxShadow: "0 12px 40px rgba(0,0,0,0.10)",
  },

  bigTitle: {
    fontSize: 24,
    fontWeight: 494,
    marginBottom: 20,
  },

  subTitle: {
    fontSize: 16,
    fontWeight: 400,
    marginBottom: 3,
  },

  subTitle2: {
    fontSize: 20,
    fontWeight: 400,
    marginBottom: 25,
  },

  sentText: {
    color: "#6A7282",
    fontWeight: 400,
    fontSize: 16,
  },

  emailText: {
    fontSize: 16,
    fontWeight: 400,
    marginBottom: 25,
  },

  otpRow: {
    display: "flex",
    justifyContent: "center",
    gap: 12,
    marginBottom: 25,
  },

  otpBox: {
    width: 50,
    height: 55,
    borderRadius: 12,
    border: "2px solid #e6e6e6",
    fontSize: 22,
    textAlign: "center",
    outline: "none",
  },

  resendWrap: {
    marginBottom: 25,
    color: "#777",
  },

  timerText: {
    fontWeight: 600,
  },

  resendLink: {
    color: "#7C3CFF",
    fontWeight: 600,
    cursor: "pointer",
  },

  verifyBtn: {
    width: "100%",
    padding: "16px",
    background: "#7C3CFF",
    borderRadius: 16,
    color: "#fff",
    fontSize: 16,
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
  },
};

