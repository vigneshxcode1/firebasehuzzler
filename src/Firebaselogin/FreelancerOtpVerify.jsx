import React, { useState, useEffect } from "react";
import axios from "axios";
import { signInWithCustomToken } from "firebase/auth";
import { auth, db } from "../firbase/Firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";

export default function FreelancerOtpVerify() {
  const navigate = useNavigate();
  const location = useLocation();

  const localData = JSON.parse(localStorage.getItem("freelancerOtpUser") || "{}");
  const stateData = location.state || {};
  const email = stateData.email || localData.email;

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    if (!email) {
      alert("Signup session expired. Please start again.");
      navigate("/freelancer-signup");
    }
  }, []);

  useEffect(() => {
    if (timer === 0) {
      setIsResendDisabled(false);
      return;
    }
    const countdown = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(countdown);
  }, [timer]);

  const verifyOtp = async () => {
    if (otp.length !== 6) return alert("Enter a valid 6-digit OTP");
    setIsLoading(true);

    try {
      const res = await axios.post("https://huzzler.onrender.com/api/auth/verify-otp", {
        email: email.toLowerCase(),
        otp,
      });

      if (!res.data?.token) throw new Error("Invalid OTP");

      const userCred = await signInWithCustomToken(auth, res.data.token);
      const uid = userCred.user.uid;

      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) throw new Error("User missing in database");
      const userData = userSnap.data();

      if (userData.role !== "freelancer") {
        if (userData.role !== "freelancer") {
        await setDoc(doc(db, "users", uid), { role: "freelancer" }, { merge: true });
}

        throw new Error("This OTP belongs to another account type");
      }

      localStorage.removeItem("freelancerOtpUser");

      // 🔥 IMPORTANT: Passing user details to next page
     navigate("/freelancer-details", {
  replace: true,
  state: {
    uid,
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    email: userData.email || "",
  },
});


    } catch (err) {
      alert(err?.response?.data?.message || err.message);
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    setIsResendDisabled(true);
    setTimer(30);

    try {
      await axios.post("https://huzzler.onrender.com/api/auth/resend-otp", {
        email: email.toLowerCase(),
        action: "resend",
      });
      alert("New OTP sent!");
    } catch {
      alert("Failed to resend OTP");
    }
  };

  return (
    <div style={{
      width: "100%", height: "100vh", background: "#f7f8fa",
      display: "flex", justifyContent: "center", alignItems: "center"
    }}>
      <div style={{
        width: "350px", padding: "25px", background: "#fff",
        borderRadius: "12px", textAlign: "center",
        boxShadow: "0 0 20px rgba(0,0,0,0.08)"
      }}>
        <h2>Verify OTP</h2>
        <p style={{ color: "#777" }}>{email}</p>

        <input
          type="text"
          maxLength="6"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit OTP"
          style={{
            width: "100%", padding: "12px", margin: "20px 0",
            textAlign: "center", borderRadius: "8px", fontSize: "18px"
          }}
        />

        <button
          onClick={verifyOtp}
          disabled={isLoading}
          style={{
            width: "100%", padding: "12px",
            borderRadius: "8px",
            background: isLoading ? "#999" : "#007bff",
            color: "#fff", fontSize: "16px"
          }}
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>

        <div style={{ marginTop: "15px" }}>
          {isResendDisabled ? (
            <span style={{ color: "#666" }}>Resend OTP in {timer}s</span>
          ) : (
            <button
              onClick={resendOtp}
              style={{
                background: "none", border: "none",
                color: "#007bff", cursor: "pointer"
              }}
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { signInWithCustomToken } from "firebase/auth";
// import { auth, db } from "../firbase/Firebase";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { useNavigate, useLocation } from "react-router-dom";

// export default function FreelancerOtpVerify() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const localData = JSON.parse(localStorage.getItem("freelancerOtpUser") || "{}");
//   const stateData = location.state || {};
//   const email = stateData.email || localData.email;

//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const inputRefs = useRef([]);

//   const [isLoading, setIsLoading] = useState(false);
//   const [timer, setTimer] = useState(30);
//   const [isResendDisabled, setIsResendDisabled] = useState(true);

//   // check session
//   useEffect(() => {
//     if (!email) {
//       alert("Signup session expired. Please start again.");
//       navigate("/freelancer-signup");
//     }
//   }, []);

//   // resend timer
//   useEffect(() => {
//     if (timer === 0) {
//       setIsResendDisabled(false);
//       return;
//     }
//     const t = setTimeout(() => setTimer((v) => v - 1), 1000);
//     return () => clearTimeout(t);
//   }, [timer]);

//   // handle OTP input (6 boxes)
//   const handleOtpChange = (value, index) => {
//     if (/^[0-9]?$/.test(value)) {
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);

//       if (value && index < 5) {
//         inputRefs.current[index + 1].focus();
//       }
//     }
//   };

//   const handleBackspace = (e, index) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputRefs.current[index - 1].focus();
//     }
//   };

//   const verifyOtp = async () => {
//     const finalOtp = otp.join("");
//     if (finalOtp.length !== 6) return alert("Enter a valid 6-digit OTP");

//     setIsLoading(true);

//     try {
//       const res = await axios.post("https://huzzler.onrender.com/api/auth/verify-otp", {
//         email: email.toLowerCase(),
//         otp: finalOtp,
//       });

//       if (!res.data?.token) throw new Error("Invalid OTP");

//       const userCred = await signInWithCustomToken(auth, res.data.token);
//       const uid = userCred.user.uid;

//       const userRef = doc(db, "users", uid);
//       const userSnap = await getDoc(userRef);

//       if (!userSnap.exists()) throw new Error("User missing");
//       const userData = userSnap.data();

//       if (userData.role !== "freelancer") {
//         await setDoc(doc(db, "users", uid), { role: "freelancer" }, { merge: true });
//       }

//       localStorage.removeItem("freelancerOtpUser");

//       navigate("/freelancer-details", {
//         replace: true,
//         state: {
//           uid,
//           firstName: userData.firstName || "",
//           lastName: userData.lastName || "",
//           email: userData.email || "",
//         },
//       });

//     } catch (err) {
//       alert(err?.response?.data?.message || err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const resendOtp = async () => {
//     setIsResendDisabled(true);
//     setTimer(30);
//     try {
//       await axios.post("https://huzzler.onrender.com/api/auth/resend-otp", {
//         email: email.toLowerCase(),
//         action: "resend",
//       });
//       alert("New OTP sent!");
//     } catch {
//       alert("Failed to resend OTP");
//     }
//   };

//   return (
//     <div style={styles.pageBg}>
      
//       <div style={styles.cardContainer}>
//                   {/* Back */}
//         <div style={styles.backRow}>
//             <span style={styles.backArrow} onClick={() => navigate(-1)}>←</span>
//             <span style={styles.backText}>BACK</span><br /><br /><br />
//         </div>
//         <div style={styles.card}>


//           {/* Title */}
//           <h2 style={styles.title}>You're almost there! We just need to verify your email.</h2>

//           <p style={styles.sub1}>Great! Almost done!</p>
//           <p style={styles.sub2}>Please verify your email</p>
//           <p style={styles.sub3}>Enter the verification code sent to:</p>
//           <p style={styles.email}>{email}</p>

//           {/* OTP BOXES */}
//           <div style={styles.otpContainer}>
//             {otp.map((digit, index) => (
//               <input
//                 key={index}
//                 ref={(el) => (inputRefs.current[index] = el)}
//                 maxLength={1}
//                 value={digit}
//                 onChange={(e) => handleOtpChange(e.target.value, index)}
//                 onKeyDown={(e) => handleBackspace(e, index)}
//                 style={styles.otpBox}
//               />
//             ))}
//           </div>

//           {/* RESEND */}
//           <p style={styles.resendText}>
//             Didn't receive OTP?{" "}
//             {isResendDisabled ? (
//               <span style={{ color: "#777" }}></span>
//             ) : (
//               <span onClick={resendOtp} style={styles.resendLink}>Resend OTP</span>
//             )}
//           </p>

//           {/* BUTTON */}
//           <button style={styles.button} onClick={verifyOtp} disabled={isLoading}>
//             {isLoading ? "Verifying..." : "Get Started"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ======================================================
//    EXACT FIGMA STYLE — SIX OTP BOXES, CENTER CARD, NO SCROLL
// ====================================================== */

// const styles = {
//   pageBg: {
//     height: "100vh",
//     width: "100%",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     background:
//       "linear-gradient(140deg, #ffffff 10%, #f4edff 60%, #fffbd9 100%)",
//     fontFamily: "Inter, sans-serif",
//   },

//   cardContainer: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//   },

//   card: {
//     width:540,
//     background: "white",
//     borderRadius: 30,
//     padding: "50px 60px 60px",
//     textAlign: "center",
//     boxShadow: "0px 14px 40px rgba(0,0,0,0.1)",
//   },

//   backRow: {
//     display: "flex",
//     alignItems: "center",
//     gap: 5,
//     marginBottom: 25,
//     marginLeft:-570,
//   },

//   backArrow: {
//     fontSize: 24,
//     cursor: "pointer",
//     fontWeight: 600,
//   },

//   backText: {
//     fontSize: 19,
//     fontWeight: 600,
//     color: "#444",
//   },

//   title: { fontSize: 20, fontWeight: 400,marginLeft:-33, marginBottom: 20, color: "#000000" },

//   sub1: { fontSize: 16,fontWeight: 400, color: "#333", marginTop: 15 },
//   sub2: { fontSize: 16, fontWeight: 400, color: "#333", marginTop: 2 },
//   sub3: { fontSize: 16, fontWeight: 400, color: "#666", marginTop: 26 },
//   email: { fontSize: 16,  fontWeight: 600, color: "#000000", marginTop: 5 },

//   otpContainer: {
//     marginTop: 25,
//     display: "flex",
//     justifyContent: "center",
//     gap:17,
//   },

//   otpBox: {
//     width: 35,
//     height: 44,
//     fontSize: 22,
//     textAlign: "center",
//     borderRadius: 12,
//     border: "1px solid #ddd",
//     outline: "none",
//   },

//   resendText: {
//     marginTop: 20,
//     fontSize: 14,
//     color: "#666",
//   },

//   resendLink: {
//     color: "#7C3CFF",
//     cursor: "pointer",
//     fontWeight: 600,
//   },

//   button: {
//     width: "100%",
//     padding: "16px",
//     borderRadius: 14,
//     background: "#7C3CFF",
//     border: "none",
//     color: "white",
//     fontSize: 16,
//     fontWeight: 600,
//     cursor: "pointer",
//     marginTop: 30,
//   },
// };
