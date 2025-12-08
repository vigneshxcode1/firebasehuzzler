// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { signInWithCustomToken } from "firebase/auth";
// import { auth, db } from "../firbase/Firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { useNavigate, useLocation } from "react-router-dom";
// import "../ClientRegister/OtpVerify.css";

// const OtpVerify = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Read from state OR local storage
//   const localData = JSON.parse(localStorage.getItem("otpUser") || "{}");
//   const stateData = location.state || {};

//   const email = stateData.email || localData.email;

//   const [otp, setOtp] = useState("");
//   const [timer, setTimer] = useState(30);
//   const [isResendDisabled, setIsResendDisabled] = useState(true);

//   // Validate email
//   useEffect(() => {
//     if (!email) {
//       alert("Signup data missing. Please start again.");
//       navigate("/signup-client");
//     }
//   }, []);

//   // OTP Timer Logic
//   useEffect(() => {
//     if (timer === 0) {
//       setIsResendDisabled(false);
//       return;
//     }
//     const countdown = setTimeout(() => setTimer(timer - 1), 1000);
//     return () => clearTimeout(countdown);
//   }, [timer]);

//   // ========== VERIFY OTP ==========
//   const verifyOtp = async () => {
//     if (otp.length !== 6) return alert("Enter a valid 6-digit OTP");

//     try {
//       const res = await axios.post(
//         "https://huzzler.onrender.com/api/auth/verify-otp",
//         { email: email.toLowerCase(), otp }
//       );

//       if (!res.data?.token) return alert("Invalid OTP");

//       const userCred = await signInWithCustomToken(auth, res.data.token);
//       const uid = userCred.user.uid;

//       // Fetch User role from Firestore
//       const userRef = doc(db, "users", uid);
//       const userSnap = await getDoc(userRef);

//       if (!userSnap.exists()) {
//         alert("User data not found in database.");
//         return;
//       }

//       const userData = userSnap.data();
//       const firestoreRole = userData.role;

//       // Clear temp store
//       localStorage.removeItem("otpUser");

//       // Redirect based on role
//       if (firestoreRole === "client") {
//         navigate("/client-dashbroad2/clientserachbar", { state: { uid } });
//         return;
//       }

//       if (firestoreRole === "freelancer") {
//         navigate("/freelance-dashboard", { state: { uid } });
//         return;
//       }

//       alert("Unknown role: " + firestoreRole);

//     } catch (err) {
//       console.error(err);
//       alert(err?.response?.data?.message || "OTP verification failed");
//     }
//   };

//   // ========== RESEND OTP ==========
//   const resendOtp = async () => {
//     try {
//       setIsResendDisabled(true);
//       setTimer(30);

//       await axios.post("https://huzzler.onrender.com/api/auth/resend-otp", {
//         email: email.toLowerCase(),
//         action: "resend",
//       });

//       alert("A new OTP has been sent!");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to resend OTP");
//     }
//   };

//   return (
//     <div className="otp-container">
//       <div className="otp-box">
//         <h2>Verify OTP</h2>
//         <p className="otp-email">{email}</p>

//         <input
//           maxLength="6"
//           className="otp-input"
//           type="text"
//           placeholder="Enter 6-digit OTP"
//           value={otp}
//           onChange={(e) => setOtp(e.target.value)}
//         />

//         <button onClick={verifyOtp} className="verify-btn">
//           Verify OTP
//         </button>

//         <div className="resend-area">
//           {isResendDisabled ? (
//             <span className="timer">Resend OTP in {timer}s</span>
//           ) : (
//             <button onClick={resendOtp} className="resend-btn">
//               Resend OTP
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OtpVerify;





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

//   // Validate email
//   useEffect(() => {
//     if (!email) {
//       alert("Signup data missing. Please start again.");
//       navigate("/signup-client");
//     }
//   }, []);

//   // Timer Logic
//   useEffect(() => {
//     if (timer === 0) return setIsResendDisabled(false);
//     const t = setTimeout(() => setTimer(timer - 1), 1000);
//     return () => clearTimeout(t);
//   }, [timer]);

//   const handleOtpChange = (value, index) => {
//     if (isNaN(value)) return;

//     let temp = [...otp];
//     temp[index] = value;
//     setOtp(temp);

//     // Move to next box
//     if (value && index < 5) {
//       document.getElementById(`otp-${index + 1}`).focus();
//     }
//   };

//   // Verify OTP
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

//       const userRef = doc(db, "users", uid);
//       const snap = await getDoc(userRef);

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

//   // Resend OTP
//   const resendOtp = async () => {
//     try {
//       setIsResendDisabled(true);
//       setTimer(30);

//       await axios.post("https://huzzler.onrender.com/api/auth/resend-otp", {
//         email: email.toLowerCase(),
//         action: "resend",
//       });

//       alert("OTP resent!");
//     } catch (err) {
//       alert("Failed to resend OTP");
//     }
//   };

//   return (
    
//     <div
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
//               {/* BACK */}
//         <div
//           style={{
//             textAlign: "left",
//             marginBottom: 80,
//             cursor: "pointer",
//             color: "#444",
//             display: "flex",
//             alignItems: "center",
//             gap: 6,
//             fontWeight: 600,
            
//           }}
//           onClick={() => navigate(-1)}
//         >
//           ← BACK
//         </div> 
//       <div
//         style={{
//           width: "460px",
//           padding: "40px 40px",
//           borderRadius: 20,
//           background: "#ffffff",
//           boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
//           textAlign: "center",
//         }}
//       >

//         {/* Heading */}
//         <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8, marginTop:"-5px" }}>
//           You're almost there! We just need to verify your email.
//         </h2>

//         <p style={{ marginTop: 10, fontSize: 16, color: "#777" }}>
//           Great! Almost done!
//         </p>

//         <h3 style={{ fontWeight: 600, fontSize: 20, marginTop: 10 }}>
//           Please verify your email
//         </h3>

//         <p style={{ marginTop: 20, fontSize: 15, color: "#777" }}>
//           Enter the verification code sent to:
//         </p>

//         <p
//           style={{
//             fontSize: 17,
//             fontWeight: 600,
//             marginBottom: 20,
//             color: "#333",
//           }}
//         >
//           {email}
//         </p>

//         {/* OTP INPUT BOXES */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             gap: "14px",
//             marginBottom: 25,
//           }}
//         >
//           {otp.map((val, i) => (
//             <input
//               key={i}
//               id={`otp-${i}`}
//               maxLength="1"
//               value={val}
//               onChange={(e) => handleOtpChange(e.target.value, i)}
//               style={{
//                 width: 30,
//                 height: 45,
//                 textAlign: "center",
//                 borderRadius: 10,
//                 border: "2px solid #e5e6eb",
//                 fontSize: 20,
//                 outline: "none",
//                 fontWeight: 600,
//               }}
//             />
//           ))}
//         </div>

//         {/* Resend */}
//         <p style={{ fontSize: 14, color: "#666" }}>
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

//         {/* VERIFY BUTTON */}
//         <button
//           onClick={verifyOtp}
//           style={{
//             marginTop: 25,
//             width: "100%",
//             padding: "14px 0",
//             background: "#7A4DFF",
//             color: "#fff",
//             border: "none",
//             borderRadius: 12,
//             fontSize: 17,
//             cursor: "pointer",
//             fontWeight: 600,
//             transition: "0.2s",
//           }}
//         >
//           Get Started
//         </button>
//       </div>
//     </div>
//   );
// }





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

//   // Validate email
//   useEffect(() => {
//     if (!email) {
//       alert("Signup data missing. Please start again.");
//       navigate("/signup-client");
//     }
//   }, []);

//   // Timer Logic
//   useEffect(() => {
//     if (timer === 0) return setIsResendDisabled(false);
//     const t = setTimeout(() => setTimer(timer - 1), 1000);
//     return () => clearTimeout(t);
//   }, [timer]);

//   const handleOtpChange = (value, index) => {
//     if (isNaN(value)) return;

//     let temp = [...otp];
//     temp[index] = value;
//     setOtp(temp);

//     // Move to next box
//     if (value && index < 5) {
//       document.getElementById(`otp-${index + 1}`).focus();
//     }
//   };

//   // Verify OTP
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

//       const userRef = doc(db, "users", uid);
//       const snap = await getDoc(userRef);

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

//   // Resend OTP
//   const resendOtp = async () => {
//     try {
//       setIsResendDisabled(true);
//       setTimer(30);

//       await axios.post("https://huzzler.onrender.com/api/auth/resend-otp", {
//         email: email.toLowerCase(),
//         action: "resend",
//       });

//       alert("OTP resent!");
//     } catch (err) {
//       alert("Failed to resend OTP");
//     }
//   };

//   return (
    
//     <div>

      
//     <div
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
            

//       <div
//         style={{
//           width: "460px",
//           padding: "40px 40px",
//           borderRadius: 20,
//           background: "#ffffff",
//           boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
//           textAlign: "center",
//         }}
//       >

//         {/* Heading */}
//         <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8, marginTop:"-5px" }}>
//           You're almost there! We just need to verify your email.
//         </h2>

//         <p style={{ marginTop: 10, fontSize: 16, color: "#777" }}>
//           Great! Almost done!
//         </p>

//         <h3 style={{ fontWeight: 600, fontSize: 20, marginTop: 10 }}>
//           Please verify your email
//         </h3>

//         <p style={{ marginTop: 20, fontSize: 15, color: "#777" }}>
//           Enter the verification code sent to:
//         </p>

//         <p
//           style={{
//             fontSize: 17,
//             fontWeight: 600,
//             marginBottom: 20,
//             color: "#333",
//           }}
//         >
//           {email}
//         </p>

//         {/* OTP INPUT BOXES */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             gap: "14px",
//             marginBottom: 25,
//           }}
//         >
//           {otp.map((val, i) => (
//             <input
//               key={i}
//               id={`otp-${i}`}
//               maxLength="1"
//               value={val}
//               onChange={(e) => handleOtpChange(e.target.value, i)}
//               style={{
//                 width: 30,
//                 height: 45,
//                 textAlign: "center",
//                 borderRadius: 10,
//                 border: "2px solid #e5e6eb",
//                 fontSize: 20,
//                 outline: "none",
//                 fontWeight: 600,
//               }}
//             />
//           ))}
//         </div>

//         {/* Resend */}
//         <p style={{ fontSize: 14, color: "#666" }}>
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

//         {/* VERIFY BUTTON */}
//         <button
//           onClick={verifyOtp}
//           style={{
//             marginTop: 25,
//             width: "100%",
//             padding: "14px 0",
//             background: "#7A4DFF",
//             color: "#fff",
//             border: "none",
//             borderRadius: 12,
//             fontSize: 17,
//             cursor: "pointer",
//             fontWeight: 600,
//             transition: "0.2s",
//           }}
//         >
//           Get Started
//         </button>
//       </div>
//     </div>
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

  // Validate email
  useEffect(() => {
    if (!email) {
      alert("Signup data missing. Please start again.");
      navigate("/signup-client");
    }
  }, [email, navigate]);

  // Timer Logic
  useEffect(() => {
    if (timer === 0) return setIsResendDisabled(false);
    const t = setTimeout(() => setTimer((prev) => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;

    let temp = [...otp];
    temp[index] = value;
    setOtp(temp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  // Verify OTP
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

      const userRef = doc(db, "users", uid);
      const snap = await getDoc(userRef);

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

  // Resend OTP
  const resendOtp = async () => {
    try {
      setIsResendDisabled(true);
      setTimer(30);

      await axios.post("https://huzzler.onrender.com/api/auth/resend-otp", {
        email: email.toLowerCase(),
        action: "resend",
      });

      alert("OTP resent!");
    } catch (err) {
      alert("Failed to resend OTP");
    }
  };

  return (
    <div
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
        style={{
          position: "absolute",
          top: 100,
          left: 490,
          cursor: "pointer",
          color: "#444",
          fontWeight: 600,
          // marginLeft:"470px",
          // marginTop:"70px"
        }}
        onClick={() => navigate(-1)}
      >
        ← BACK
      </div>

      <div
        style={{
          width: "460px",
          padding: "40px 40px",
          borderRadius: 20,
          background: "#ffffff",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
          You're almost there! We just need to verify your email.
        </h2>

        <p style={{ marginTop: 10, fontSize: 16, color: "#777" }}>
          Great! Almost done!
        </p>

        <h3 style={{ fontWeight: 600, fontSize: 20, marginTop: 10 }}>
          Please verify your email
        </h3>

        <p style={{ marginTop: 20, fontSize: 15, color: "#777" }}>
          Enter the verification code sent to:
        </p>

        <p
          style={{
            fontSize: 17,
            fontWeight: 600,
            marginBottom: 20,
            color: "#333",
          }}
        >
          {email}
        </p>

        {/* OTP INPUTS */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "14px",
            marginBottom: 25,
          }}
        >
          {otp.map((val, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              maxLength="1"
              value={val}
              onChange={(e) => handleOtpChange(e.target.value, i)}
              style={{
                width: 30,
                height: 45,
                textAlign: "center",
                borderRadius: 10,
                border: "2px solid #e5e6eb",
                fontSize: 20,
                outline: "none",
                fontWeight: 600,
              }}
            />
          ))}
        </div>

        <p style={{ fontSize: 14, color: "#666" }}>
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

        {/* Verify */}
        <button
          onClick={verifyOtp}
          style={{
            marginTop: 25,
            width: "100%",
            padding: "14px 0",
            background: "#7A4DFF",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            fontSize: 17,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
