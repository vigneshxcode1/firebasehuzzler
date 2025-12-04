// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { auth } from "../firbase/Firebase";
// import { signInWithCustomToken } from "firebase/auth";
// import { useLocation, useNavigate } from "react-router-dom";
// import "./freelancerOtp.css";

// export default function FreelancerOtpScreen() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { email, firstName, lastName, password, uid } = location.state || {};

//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);

//   // ⏳ Timer State
//   const [timer, setTimer] = useState(30);
//   const [canResend, setCanResend] = useState(false);

//   useEffect(() => {
//     let interval;

//     if (timer > 0) {
//       interval = setInterval(() => setTimer((prev) => prev - 1), 100);
//     } else {
//       setCanResend(true);
//     }

//     return () => clearInterval(interval);
//   }, [timer]);

//  const verifyOtp = async () => {
//   if (!email) {
//     alert("Email not found. Restart signup.");
//     return;
//   }

//   if (otp.length !== 6) return alert("Enter valid 6 digit OTP");

//   setLoading(true);

//   try {
//     const res = await axios.post(
//       "https://huzzler.onrender.com/api/auth/verify-otp",
//       { email, otp }
//     );

//     console.log("Verify OTP Response:", res.data);

//     if (!res.data.token) {
//       alert("Invalid or expired OTP");
//       return;
//     }

//     // Firebase custom token login
//     const result = await signInWithCustomToken(auth, res.data.token);
//     const user = result.user;

 

//      navigate("/freelance-dashboard/freelanceHome", {
//         state: { uid },
//       });

//   } catch (err) {
//     alert(err?.response?.data?.message || "OTP verification failed");
//   } finally {
//     setLoading(false);
//   }
// };

  
//   const resendOtp = async () => {
//     if (!canResend) return;

//     try {
//       await axios.post("https://huzzler.onrender.com/api/auth/send-otp", { email });
//       alert("OTP Resent Successfully");

//       // Reset Timer
//       setTimer(5);
//       setCanResend(false);
//     } catch (err) {
//       alert("Failed to resend OTP");
//     }
//   };

//   return (
//     <div className="otp-container">
//       <div className="otp-card">
//         <h2>You're Almost There!</h2>
//         <p>OTP sent to: <b>{email}</b></p>

//         <input
//           type="text"
//           maxLength="6"
//           value={otp}
//           onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
//           className="otp-input"
//           placeholder="------"
//         />

//         <p
//           className={`resend-text ${canResend ? "active" : "disabled"}`}
//           onClick={resendOtp}
//         >
//           {canResend ? "Resend OTP" : `Resend in 0:${timer < 10 ? "0" + timer : timer}`}
//         </p>

//         <button className="submit-btn" onClick={verifyOtp} disabled={loading}>
//           {loading ? "Verifying..." : "Get Started"}
//         </button>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { auth } from "../firbase/Firebase";
import { signInWithCustomToken } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";

export default function FreelancerOtpScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const { email, uid } = location.state || {};

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  // TIMER
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    let interval;

    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [timer]);

  // HANDLE OTP INPUT
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    // Move to next box
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    // Move back on delete
    if (!value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // VERIFY OTP
  const verifyOtp = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) return alert("Enter valid 6 digit OTP");

    try {
      setLoading(true);
      const res = await axios.post(
        "https://huzzler.onrender.com/api/auth/verify-otp",
        { email, otp: finalOtp }
      );

      if (!res.data.token) return alert("Invalid OTP");

      await signInWithCustomToken(auth, res.data.token);

      navigate("/freelance-dashboard/freelanceHome", {
        state: { uid },
      });

    } catch (err) {
      alert(err?.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // RESEND OTP
  const resendOtp = async () => {
    if (!canResend) return;

    try {
      await axios.post("https://huzzler.onrender.com/api/auth/send-otp", { email });
      alert("OTP Resent!");

      setTimer(30);
      setCanResend(false);
    } catch {
      alert("Failed to resend OTP");
    }
  };

  return (
    <div style={styles.page}>
      
      {/* BACK BUTTON */}
      <div style={styles.topRow}>
        <span style={styles.backArrow} onClick={() => navigate(-1)}>←</span>
        <span style={styles.backText}>BACK</span>
      </div>

      {/* CARD */}
      <div style={styles.card}>
        <h2 style={styles.title}>You're almost there! We just need to verify your email.</h2>

        <p style={styles.subtitle}>Great Almost done!</p>
        <p style={styles.subtitle2}>Please verify your email</p>

        <p style={styles.emailLabel}>
          Enter the verification code sent to:<br />
          <span style={styles.email}>{email}</span>
        </p>

        {/* OTP BOXES */}
        <div style={styles.otpRow}>
          {otp.map((digit, index) => (
            <input
              key={index}
              maxLength={1}
              value={digit}
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleOtpChange(e.target.value, index)}
              style={styles.otpBox}
            />
          ))}
        </div>

        {/* RESEND OTP */}
        <p style={styles.resendRow}>
          Didn't receive OTP?
          <span
            style={canResend ? styles.resendActive : styles.resendDisabled}
            onClick={resendOtp}
          >
            {canResend ? " Resend OTP" : ``}
          </span>
        </p>

        {/* BUTTON */}
        <button
          onClick={verifyOtp}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "Verifying..." : "Get Started"}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------ UI STYLES ------------------------------ */

const styles = {
  page: {
    width: "100vw",
    height: "100vh",
    background:
      "linear-gradient(135deg, #fffce5 20%, #f3eaff 80%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 40,
    fontFamily: "Inter, sans-serif",
  },

  topRow: {
    width: 600,
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },

  backArrow: {
    fontSize: 22,
    cursor: "pointer",
    fontWeight: 600,
  },

  backText: {
    fontSize: 14,
    fontWeight: 600,
  },

  card: {
    width: 600,
    background: "#fff",
    padding: "50px 50px",
    borderRadius: 26,
    textAlign: "center",
    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
  },

  title: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    color: "#555",
    marginTop: 10,
  },

  subtitle2: {
    fontSize: 16,
    fontWeight: 600,
    marginTop: 5,
  },

  emailLabel: {
    fontSize: 14,
    marginTop: 20,
    color: "#555",
  },

  email: {
    fontWeight: 700,
    fontSize: 15,
  },

  otpRow: {
    display: "flex",
    justifyContent: "center",
    gap: 15,
    marginTop: 25,
    marginBottom: 15,
  },

  otpBox: {
    width: 55,
    height: 55,
    textAlign: "center",
    borderRadius: 14,
    border: "1px solid #dcdcdc",
    fontSize: 22,
    fontWeight: 600,
    outline: "none",
  },

  resendRow: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },

  resendActive: {
    color: "#7C3CFF",
    marginLeft: 5,
    cursor: "pointer",
    fontWeight: 600,
  },

  resendDisabled: {
    color: "#aaa",
    marginLeft: 5,
  },

  button: {
    marginTop: 25,
    width: "100%",
    padding: "18px",
    background: "#7C3CFF",
    borderRadius: 16,
    border: "none",
    fontSize: 17,
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
};
