import React, { useState, useEffect } from "react";
import axios from "axios";
import { signInWithCustomToken } from "firebase/auth";
import { auth, db } from "../firbase/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import "../ClientRegister/OtpVerify.css";

const OtpVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Read from state OR local storage
  const localData = JSON.parse(localStorage.getItem("otpUser") || "{}");
  const stateData = location.state || {};

  const email = stateData.email || localData.email;

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  // Validate email
  useEffect(() => {
    if (!email) {
      alert("Signup data missing. Please start again.");
      navigate("/signup-client");
    }
  }, []);

  // OTP Timer Logic
  useEffect(() => {
    if (timer === 0) {
      setIsResendDisabled(false);
      return;
    }
    const countdown = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(countdown);
  }, [timer]);

  // ========== VERIFY OTP ==========
  const verifyOtp = async () => {
    if (otp.length !== 6) return alert("Enter a valid 6-digit OTP");

    try {
      const res = await axios.post(
        "https://huzzler.onrender.com/api/auth/verify-otp",
        { email: email.toLowerCase(), otp }
      );

      if (!res.data?.token) return alert("Invalid OTP");

      const userCred = await signInWithCustomToken(auth, res.data.token);
      const uid = userCred.user.uid;

      // Fetch User role from Firestore
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        alert("User data not found in database.");
        return;
      }

      const userData = userSnap.data();
      const firestoreRole = userData.role;

      // Clear temp store
      localStorage.removeItem("otpUser");

      // Redirect based on role
      if (firestoreRole === "client") {
        navigate("/client-dashbroad2/clientserachbar", { state: { uid } });
        return;
      }

      if (firestoreRole === "freelancer") {
        navigate("/freelance-dashboard", { state: { uid } });
        return;
      }

      alert("Unknown role: " + firestoreRole);

    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "OTP verification failed");
    }
  };

  // ========== RESEND OTP ==========
  const resendOtp = async () => {
    try {
      setIsResendDisabled(true);
      setTimer(30);

      await axios.post("https://huzzler.onrender.com/api/auth/resend-otp", {
        email: email.toLowerCase(),
        action: "resend",
      });

      alert("A new OTP has been sent!");
    } catch (err) {
      console.error(err);
      alert("Failed to resend OTP");
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-box">
        <h2>Verify OTP</h2>
        <p className="otp-email">{email}</p>

        <input
          maxLength="6"
          className="otp-input"
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button onClick={verifyOtp} className="verify-btn">
          Verify OTP
        </button>

        <div className="resend-area">
          {isResendDisabled ? (
            <span className="timer">Resend OTP in {timer}s</span>
          ) : (
            <button onClick={resendOtp} className="resend-btn">
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;
