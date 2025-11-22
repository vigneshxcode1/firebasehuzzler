import React, { useState, useEffect } from "react";
import axios from "axios";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../firbase/Firebase";
import { useNavigate, useLocation } from "react-router-dom";
import "./OtpVerify.css";

const OtpVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Read from state OR localStorage
  const localData = JSON.parse(localStorage.getItem("otpUser") || "{}");
  const stateData = location.state || {};

  const email = stateData.email || localData.email;
  const role  = stateData.role  || localData.role;
  const uid   = stateData.uid   || localData.uid;

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  // If still no email, block page
  useEffect(() => {
    if (!email) {
      alert("Signup data missing. Please start again.");
      navigate("/signup");
    }
  }, []);

  useEffect(() => {
    if (timer === 0) {
      setIsResendDisabled(false);
      return;
    }
    const countdown = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(countdown);
  }, [timer]);

  const verifyOtp = async () => {
    if (otp.length !== 6) return alert("Enter a valid 6-digit OTP");

    try {
      const res = await axios.post(
        "https://huzzler.onrender.com/api/auth/verify-otp",
        { email: email.toLowerCase(), otp }
      );

      if (!res.data?.token) return alert("Invalid OTP");

      await signInWithCustomToken(auth, res.data.token);

      const finalUid = uid || res.data.uid;

      // After OTP success, remove saved data
      localStorage.removeItem("otpUser");

      if (role === "client") {
       navigate("/client-details", {
        state: {
          uid: finalUid,
          email: email.toLowerCase(),
          firstName: localData.firstName || stateData.firstName,
          lastName: localData.lastName || stateData.lastName,
          password: localData.password || stateData.password,
        },
      });
      } else {
        navigate("/freelancer-details", { state: { uid: finalUid } });
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "OTP verification failed");
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
