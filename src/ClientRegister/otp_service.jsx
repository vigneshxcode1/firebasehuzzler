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

//   /* ================= MOBILE DETECTOR ================= */
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   useEffect(() => {
//     const onResize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", onResize);
//     return () => window.removeEventListener("resize", onResize);
//   }, []);

//   /* ================= GUARD ================= */
//   useEffect(() => {
//     if (!email) {
//       alert("Signup data missing. Please start again.");
//       navigate("/signup");
//     }
//   }, []);

//   /* ================= TIMER ================= */
//   useEffect(() => {
//     if (timer === 0) {
//       setIsResendDisabled(false);
//       return;
//     }
//     const countdown = setTimeout(() => setTimer((t) => t - 1), 1000);
//     return () => clearTimeout(countdown);
//   }, [timer]);

//   /* ================= OTP INPUT ================= */
//   const handleOtpChange = (value, index) => {
//     if (!/^[0-9]?$/.test(value)) return;
//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     if (value && index < 5) {
//       document.getElementById(`otp-${index + 1}`)?.focus();
//     }
//   };

//   useEffect(() => {
//   setTimeout(() => {
//     document.getElementById("otp-0")?.focus();
//   }, 300);
// }, []);


//   const joinOtp = otp.join("");

//   /* ================= VERIFY OTP ================= */
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

//   /* ================= RESEND OTP ================= */
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
//       <div style={{ ...styles.topRow, width: isMobile ? "100%" : 650 }}>
//         <span
//           style={{
//             ...styles.backArrow,
//             marginLeft: isMobile ? 0 : -40,
//           }}
//           onClick={() => navigate(-1)}
//         >
//           ←
//         </span>
//         <span style={styles.backText}>BACK</span>
//       </div>

//       {/* CARD */}
//       <div
//         style={{
//           ...styles.card,
//           width: isMobile ? "92%" : 650,
//           padding: isMobile ? "32px 22px 40px" : styles.card.padding,
//         }}
//       >
//         <h2
//           style={{
//             ...styles.bigTitle,
//             fontSize: isMobile ? 20 : 24,
//           }}
//         >
//           You're almost there! We just need to verify your email.
//         </h2>

//         <p style={styles.subTitle}>Great! Almost done!</p>
//         <p style={styles.subTitle2}>Please verify your email</p>

//         <p style={styles.sentText}>Enter the verification code sent to:</p>
//         <p style={styles.emailText}>{email}</p>

//         {/* OTP BOXES */}
//         <div
//           style={{
//             ...styles.otpRow,
//             gap: isMobile ? 8 : 12,
//           }}
//         >
//           {otp.map((digit, i) => (
//             <input
//               key={i}
//               id={`otp-${i}`}
//               value={digit}
//               type="tel"
//               inputMode="numeric"
//               pattern="[0-9]*"
//               autoComplete="one-time-code"
//               maxLength={1}
//               onInput={(e) => handleOtpChange(e.target.value, i)}   // ⭐ CHANGE
//               onKeyDown={(e) => {
//                 if (e.key === "Backspace" && !otp[i] && i > 0) {
//                   document.getElementById(`otp-${i - 1}`)?.focus();
//                 }
//               }}
//               style={{
//                 ...styles.otpBox,
//                 width: isMobile ? 42 : 50,
//                 height: isMobile ? 48 : 55,
//                 fontSize: isMobile ? 20 : 22,
//               }}
//             />

//           ))}
//         </div>

//         {/* RESEND */}
//         <p style={styles.resendWrap}>
//           Didn’t receive OTP?{" "}
//           {isResendDisabled ? (
//             <span style={styles.timerText}>{timer}s</span>
//           ) : (
//             <span style={styles.resendLink} onClick={resendOtp}>
//               Resend OTP
//             </span>
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
//         ORIGINAL STYLES
//    (UI UNTOUCHED – reused)
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
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     marginBottom: 10,
//   },

//   backArrow: {
//     fontSize: 22,
//     cursor: "pointer",
//   },

//   backText: {
//     fontWeight: 700,
//     fontSize: 15,
//   },

//   card: {
//     background: "#fff",
//     padding: "45px 55px 60px",
//     textAlign: "center",
//     borderRadius: 30,
//     boxShadow: "0 12px 40px rgba(0,0,0,0.10)",
//   },

//   bigTitle: {
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
//     marginBottom: 25,
//   },

//   otpBox: {
//     borderRadius: 12,
//     border: "2px solid #e6e6e6",
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



import React, { useState, useEffect, useRef } from "react";
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

  const inputsRef = useRef([]);

  /* ================= MOBILE DETECTOR ================= */
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ================= GUARD ================= */
  useEffect(() => {
    if (!email) {
      alert("Signup data missing. Please start again.");
      navigate("/signup");
    }
  }, [email, navigate]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (timer === 0) {
      setIsResendDisabled(false);
      return;
    }
    const t = setTimeout(() => setTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);


  /* ================= OTP CHANGE (MOBILE SAFE) ================= */
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");

    // 🔥 Auto-fill / Paste full OTP
    if (value.length === 6) {
      const split = value.split("").slice(0, 6);
      setOtp(split);
      inputsRef.current[5]?.focus();
      return;
    }

    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  /* ================= BACKSPACE ================= */
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const joinOtp = otp.join("");

  /* ================= VERIFY OTP ================= */
  const verifyOtp = async () => {
    if (joinOtp.length !== 6) {
      alert("Enter a valid 6-digit OTP");
      return;
    }

    try {
      const res = await axios.post(
        "https://huzzler.onrender.com/api/auth/verify-otp",
        { email: email.toLowerCase(), otp: joinOtp }
      );

      if (!res.data?.token) {
        alert("Invalid OTP");
        return;
      }

      await signInWithCustomToken(auth, res.data.token);

      const finalUid = uid || res.data.uid;
      localStorage.removeItem("otpUser");

      navigate(
        role === "client" ? "/client-details" : "/freelancer-details",
        {
          state: {
            uid: finalUid,
            email,
            firstName: stateData.firstName || localData.firstName,
            lastName: stateData.lastName || localData.lastName,
            password: stateData.password || localData.password,
            role,
          },
        }
      );
    } catch (err) {
      alert(err?.response?.data?.message || "OTP verification failed");
    }
  };

  /* ================= RESEND OTP ================= */
  const resendOtp = async () => {
    try {
      setIsResendDisabled(true);
      setTimer(30);
      await axios.post(
        "https://huzzler.onrender.com/api/auth/resend-otp",
        { email: email.toLowerCase(), action: "resend" }
      );
      alert("New OTP sent!");
    } catch {
      alert("Failed to resend OTP");
    }
  };

  return (
    <div style={styles.pageBg}>
      <div style={{ ...styles.topRow, width: isMobile ? "100%" : 650 }}>
        <span
          style={{ ...styles.backArrow, marginLeft: isMobile ? 0 : -40 }}
          onClick={() => navigate(-1)}
        >
          ←
        </span>
        <span style={styles.backText}>BACK</span>
      </div>

      <div
        style={{
          ...styles.card,
          width: isMobile ? "92%" : 650,
          padding: isMobile ? "32px 22px 40px" : styles.card.padding,
        }}
      >
        <h2 style={{ ...styles.bigTitle, fontSize: isMobile ? 20 : 24 }}>
          You're almost there! We just need to verify your email.
        </h2>

        <p style={styles.subTitle}>Great! Almost done!</p>
        <p style={styles.subTitle2}>Please verify your email</p>

        <p style={styles.sentText}>Enter the verification code sent to:</p>
        <p style={styles.emailText}>{email}</p>

        {/* OTP INPUTS */}
        <div
          style={{
            ...styles.otpRow,
            gap: isMobile ? 8 : 12,
          }}
        >
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={digit}
              type="tel"
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              maxLength={1}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              style={styles.otpBox}
            />
          ))}
        </div>


        <p style={styles.resendWrap}>
          Didn’t receive OTP?{" "}
          {isResendDisabled ? (
            <span style={styles.timerText}>{timer}s</span>
          ) : (
            <span style={styles.resendLink} onClick={resendOtp}>
              Resend OTP
            </span>
          )}
        </p>

        <button style={styles.verifyBtn} onClick={verifyOtp}>
          Get Started
        </button>
      </div>
    </div>
  );
}

/* ================= STYLES (UNCHANGED) ================= */
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
  topRow: { display: "flex", alignItems: "center", gap: 6, marginBottom: 10 },
  backArrow: { fontSize: 22, cursor: "pointer" },
  backText: { fontWeight: 700, fontSize: 15 },
  card: {
    background: "#fff",
    padding: "45px 55px 60px",
    textAlign: "center",
    borderRadius: 30,
    boxShadow: "0 12px 40px rgba(0,0,0,0.10)",
  },
  bigTitle: { fontWeight: 494, marginBottom: 20 },
  subTitle: { fontSize: 16, marginBottom: 3 },
  subTitle2: { fontSize: 20, marginBottom: 25 },
  sentText: { color: "#6A7282", fontSize: 16 },
  emailText: { fontSize: 16, marginBottom: 25 },
otpRow: {
  display: "flex",
  justifyContent: "center",
},

otpBox: {
  width: "48px",
  height: "48px",

  fontSize: "22px",
  lineHeight: "48px",        // 🔥 MOST IMPORTANT
  padding: 0,                // 🔥 remove default mobile padding

  border: "2px solid #e6e6e6",
  textAlign: "center",
  outline: "none",
  borderRadius: "8px",

  boxSizing: "border-box",   // 🔥 prevent crop
  appearance: "none",
  WebkitAppearance: "none",  // 🔥 Android fix
},

  resendWrap: { marginBottom: 25, color: "#777" },
  timerText: { fontWeight: 600 },
  resendLink: { color: "#7C3CFF", fontWeight: 600, cursor: "pointer" },
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
