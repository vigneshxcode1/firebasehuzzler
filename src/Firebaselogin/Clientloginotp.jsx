// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { signInWithCustomToken } from "firebase/auth";
// import { auth, db } from "../firbase/Firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { useNavigate, useLocation } from "react-router-dom";

// export default function OtpVerify() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const localData = JSON.parse(localStorage.getItem("otpUser") || "{}");
//   const stateData = location.state || {};
//   const email = stateData.email || localData.email;

//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [timer, setTimer] = useState(30);
//   const [isResendDisabled, setIsResendDisabled] = useState(true);

//   useEffect(() => {
//     if (!email) {
//       alert("Signup data missing. Please start again.");
//       navigate("/signup-client");
//     }
//   }, [email, navigate]);

//   useEffect(() => {
//     if (timer === 0) return setIsResendDisabled(false);
//     const t = setTimeout(() => setTimer((prev) => prev - 1), 1000);
//     return () => clearTimeout(t);
//   }, [timer]);

//   const handleOtpChange = (value, index) => {
//     if (isNaN(value)) return;
//     const temp = [...otp];
//     temp[index] = value;
//     setOtp(temp);
//     if (value && index < 5) {
//       document.getElementById(`otp-${index + 1}`).focus();
//     }
//   };

//   const verifyOtp = async () => {
//     const code = otp.join("");
//     if (code.length !== 6) return alert("Enter valid 6-digit OTP");

//     try {
//       const res = await axios.post(
//         "https://huzzler.onrender.com/api/auth/verify-otp",
//         { email: email.toLowerCase(), otp: code }
//       );

//       if (!res.data?.token) return alert("Invalid OTP");

//       const userCred = await signInWithCustomToken(auth, res.data.token);
//       const uid = userCred.user.uid;

//       const snap = await getDoc(doc(db, "users", uid));
//       if (!snap.exists()) return alert("User data not found!");

//       const role = snap.data().role;
//       localStorage.removeItem("otpUser");

//       if (role === "client") navigate("/client-dashbroad2/clientserachbar");
//       else if (role === "freelancer") navigate("/freelance-dashboard");
//       else alert("Unknown role");
//     } catch (err) {
//       alert("OTP verification failed");
//       console.error(err);
//     }
//   };

//   const resendOtp = async () => {
//     try {
//       setIsResendDisabled(true);
//       setTimer(30);
//       await axios.post("https://huzzler.onrender.com/api/auth/resend-otp", {
//         email: email.toLowerCase(),
//         action: "resend",
//       });
//       alert("OTP resent!");
//     } catch {
//       alert("Failed to resend OTP");
//     }
//   };

//   return (
//     <div
//       className="otp-wrapper"
//       style={{
//         minHeight: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         background:
//           "linear-gradient(to bottom left, #f7f4ff, #fff, #fffde9, #fffce6)",
//         padding: 20,
//       }}
//     >
//       {/* BACK */}
//       <div
//         className="otp-back"
//         style={{
//           position: "absolute",
//           top: 100,
//           left: 490,
//           cursor: "pointer",
//           color: "#444",
//           fontWeight: 600,
//         }}
//         onClick={() => navigate(-1)}
//       >
//         ← BACK
//       </div>

//       {/* CARD */}
//       <div
//         className="otp-card"
//         style={{
//           width: "460px",
//           padding: "40px",
//           borderRadius: 20,
//           background: "#ffffff",
//           boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
//           textAlign: "center",
//         }}
//       >
//         <h2 style={{ fontSize: 22, fontWeight: 600 }}>
//           You're almost there! We just need to verify your email.
//         </h2>

//         <p style={{ fontSize: 16, color: "#777", marginTop: 10 }}>
//           Great! Almost done!
//         </p>

//         <h3 style={{ fontWeight: 600, fontSize: 20, marginTop: 10 }}>
//           Please verify your email
//         </h3>

//         <p style={{ fontSize: 15, color: "#777", marginTop: 20 }}>
//           Enter the verification code sent to:
//         </p>

//         <p style={{ fontSize: 17, fontWeight: 600, marginBottom: 20 }}>
//           {email}
//         </p>

//         <div className="otp-inputs">
//           {otp.map((val, i) => (
//             <input
//               key={i}
//               id={`otp-${i}`}
//               maxLength="1"
//               value={val}
//               onChange={(e) => handleOtpChange(e.target.value, i)}
//               style={{
//                 width: "100%",          // 🔥 important
//                 height: 48,
//                 textAlign: "center",
//                 borderRadius: 10,
//                 border: "2px solid #e5e6eb",
//                 fontSize: 18,
//                 fontWeight: 600,
//                 flex: 1,                // 🔥 important
//                 minWidth: 0,            // 🔥 important
//               }}
//             />
//           ))}
//         </div>


//         <p style={{ fontSize: 14, color: "#666", marginTop: 20 }}>
//           Didn't receive OTP?{" "}
//           {isResendDisabled ? (
//             <span style={{ color: "#999" }}>Resend in {timer}s</span>
//           ) : (
//             <span
//               onClick={resendOtp}
//               style={{ color: "#7A4DFF", cursor: "pointer", fontWeight: 600 }}
//             >
//               Resend OTP
//             </span>
//           )}
//         </p>

//         <button
//           onClick={verifyOtp}
//           style={{
//             marginTop: 25,
//             width: "100%",
//             padding: "14px",
//             background: "#7A4DFF",
//             color: "#fff",
//             border: "none",
//             borderRadius: 12,
//             fontSize: 17,
//             fontWeight: 600,
//             cursor: "pointer",
//           }}
//         >
//           Get Started
//         </button>
//       </div>

//       {/* RESPONSIVE CSS */}
//       <style>
//         {`
// /* ===== BASE (ALL SCREENS) ===== */
// .otp-inputs {
//   display: flex;
//   justify-content: center;
//   gap: 12px;
//   margin-top: 10px;
// }

// /* ================= DESKTOP ================= */
// @media (min-width: 769px) {
//   .otp-card {
//     width: 460px;
//   }
// }

// /* ================= TABLET ================= */
// @media (max-width: 1024px) {
//   .otp-back {
//     left: 24px !important;
//     top: 24px !important;
//   }

//   .otp-card {
//     width: 440px !important;
//   }
// }

// /* ================= MOBILE ================= */
// @media (max-width: 768px) {
//   .otp-wrapper {
//     align-items: flex-start !important;
//     padding-top: 70px !important;
//     margin-top:80px !important;
//   }

//   /* BACK button fixed and visible */
//   .otp-back {
//     position: fixed !important;
//     top: 20px !important;
//     left: 16px !important;
//     z-index: 1000;
//     font-size: 15px;
//     background: transparent;
    
//   }

//   /* Card should be big & centered */
//   .otp-card {
//     width: 100% !important;
//     max-width: 420px !important;
//     padding: 32px 24px !important;
//     border-radius: 18px;
//   }

//   /* OTP inputs stay inside card */
//  .otp-inputs {
//     display: flex;
//     width: 100%;
//     gap: 8px;
//     padding: 0 2px;
//     box-sizing: border-box;
//   }

//   .otp-inputs input {
//     max-width: 52px;
//   }
// }

// /* ================= SMALL MOBILE ================= */
// @media (max-width: 480px) {
//   .otp-card {
//     max-width: 100% !important;
//     padding: 28px 18px !important;
//   }

//  .otp-inputs input {
//   padding: 0 !important;              /* ✅ remove default padding */
//   line-height: 1 !important;          /* ✅ reset line height */
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   text-align: center;
// }

// }
// `}
//       </style>

//     </div>
//   );
// }




import React, { useState, useEffect } from "react";
import axios from "axios";
import { signInWithCustomToken } from "firebase/auth";
import { auth, db } from "../firbase/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";

export default function OtpVerify() {
  const navigate = useNavigate();
  const location = useLocation();

  const localData = JSON.parse(localStorage.getItem("otpUser") || "{}");
  const stateData = location.state || {};
  const email = stateData.email || localData.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    if (!email) {
      alert("Signup data missing. Please start again.");
      navigate("/signup-client");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (timer === 0) return setIsResendDisabled(false);
    const t = setTimeout(() => setTimer((prev) => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;
    const temp = [...otp];
    temp[index] = value;
    setOtp(temp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const verifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6) return alert("Enter valid 6-digit OTP");

    try {
      const res = await axios.post(
        "https://huzzler.onrender.com/api/auth/verify-otp",
        { email: email.toLowerCase(), otp: code }
      );

      if (!res.data?.token) return alert("Invalid OTP");

      const userCred = await signInWithCustomToken(auth, res.data.token);
      const uid = userCred.user.uid;

      const snap = await getDoc(doc(db, "users", uid));
      if (!snap.exists()) return alert("User data not found!");

      const role = snap.data().role;
      localStorage.removeItem("otpUser");

      if (role === "client") navigate("/client-dashbroad2/clientserachbar");
      else if (role === "freelancer") navigate("/freelance-dashboard");
      else alert("Unknown role");
    } catch (err) {
      alert("OTP verification failed");
      console.error(err);
    }
  };

  const resendOtp = async () => {
    try {
      setIsResendDisabled(true);
      setTimer(30);
      await axios.post("https://huzzler.onrender.com/api/auth/resend-otp", {
        email: email.toLowerCase(),
        action: "resend",
      });
      alert("OTP resent!");
    } catch {
      alert("Failed to resend OTP");
    }
  };

  return (
    <div
      className="otp-wrapper"
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(to bottom left, #f7f4ff, #fff, #fffde9, #fffce6)",
        padding: 20,
      }}
    >
      {/* BACK */}
      <div
        className="otp-back"
        style={{
          position: "absolute",
          top: 100,
          left: 490,
          cursor: "pointer",
          color: "#444",
          fontWeight: 600,
        }}
        onClick={() => navigate(-1)}
      >
        ← BACK
      </div>

      {/* CARD */}
      <div
        className="otp-card"
        style={{
          width: "460px",
          padding: "40px",
          borderRadius: 20,
          background: "#ffffff",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 600 }}>
          You're almost there! We just need to verify your email.
        </h2>

        <p style={{ fontSize: 16, color: "#777", marginTop: 10 }}>
          Great! Almost done!
        </p>

        <h3 style={{ fontWeight: 600, fontSize: 20, marginTop: 10 }}>
          Please verify your email
        </h3>

        <p style={{ fontSize: 15, color: "#777", marginTop: 20 }}>
          Enter the verification code sent to:
        </p>

        <p style={{ fontSize: 17, fontWeight: 600, marginBottom: 20 }}>
          {email}
        </p>

       <div className="otp-inputs">
  {otp.map((val, i) => (
    <input
      key={i}
      id={`otp-${i}`}
      maxLength="1"
      value={val}
      onChange={(e) => handleOtpChange(e.target.value, i)}
      style={{
        width: "100%",          // 🔥 important
        height: 48,
        textAlign: "center",
        borderRadius: 10,
        border: "2px solid #e5e6eb",
        fontSize: 18,
        fontWeight: 600,
        flex: 1,                // 🔥 important
        minWidth: 0,            // 🔥 important
      }}
    />
  ))}
</div>


        <p style={{ fontSize: 14, color: "#666", marginTop: 20 }}>
          Didn't receive OTP?{" "}
          {isResendDisabled ? (
            <span style={{ color: "#999" }}>Resend in {timer}s</span>
          ) : (
            <span
              onClick={resendOtp}
              style={{ color: "#7A4DFF", cursor: "pointer", fontWeight: 600 }}
            >
              Resend OTP
            </span>
          )}
        </p>

        <button
          onClick={verifyOtp}
          style={{
            marginTop: 25,
            width: "100%",
            padding: "14px",
            background: "#7A4DFF",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            fontSize: 17,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Get Started
        </button>
      </div>

      {/* RESPONSIVE CSS */}
    <style>
{`
/* ===== BASE (ALL SCREENS) ===== */
.otp-inputs {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 10px;
}

/* ================= DESKTOP ================= */
@media (min-width: 769px) {
  .otp-card {
    width: 460px;
  }
}

/* ================= TABLET ================= */
@media (max-width: 1024px) {
  .otp-back {
    left: 24px !important;
    top: 24px !important;
  }

  .otp-card {
    width: 440px !important;
  }
}

/* ================= MOBILE ================= */
@media (max-width: 768px) {
  .otp-wrapper {
    align-items: flex-start !important;
    padding-top: 70px !important;
    margin-top:80px !important;
  }

  /* BACK button fixed and visible */
  .otp-back {
    position: fixed !important;
    top: 20px !important;
    left: 16px !important;
    z-index: 1000;
    font-size: 15px;
    background: transparent;
    
  }

  /* Card should be big & centered */
  .otp-card {
    width: 100% !important;
    max-width: 420px !important;
    padding: 32px 24px !important;
    border-radius: 18px;
  }

  /* OTP inputs stay inside card */
 .otp-inputs {
    display: flex;
    width: 100%;
    gap: 8px;
    padding: 0 2px;
    box-sizing: border-box;
  }

  .otp-inputs input {
    max-width: 52px;
  }
}

/* ================= SMALL MOBILE ================= */
@media (max-width: 480px) {
  .otp-card {
    max-width: 100% !important;
    padding: 28px 18px !important;
  }

 .otp-inputs input {
  padding: 0 !important;              /* ✅ remove default padding */
  line-height: 1 !important;          /* ✅ reset line height */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

}
`}
</style>

    </div>
  );
}