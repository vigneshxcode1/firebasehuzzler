import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../firbase/Firebase";
import { signInWithCustomToken } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import "./freelancerOtp.css";

export default function FreelancerOtpScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const { email, firstName, lastName, password, uid } = location.state || {};

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // ⏳ Timer State
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval;

    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 100);
    } else {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [timer]);

 const verifyOtp = async () => {
  if (!email) {
    alert("Email not found. Restart signup.");
    return;
  }

  if (otp.length !== 6) return alert("Enter valid 6 digit OTP");

  setLoading(true);

  try {
    const res = await axios.post(
      "https://huzzler.onrender.com/api/auth/verify-otp",
      { email, otp }
    );

    console.log("Verify OTP Response:", res.data);

    if (!res.data.token) {
      alert("Invalid or expired OTP");
      return;
    }

    // Firebase custom token login
    const result = await signInWithCustomToken(auth, res.data.token);
    const user = result.user;

    navigate("/freelance-dashboard");

  } catch (err) {
    alert(err?.response?.data?.message || "OTP verification failed");
  } finally {
    setLoading(false);
  }
};

  
  const resendOtp = async () => {
    if (!canResend) return;

    try {
      await axios.post("https://huzzler.onrender.com/api/auth/send-otp", { email });
      alert("OTP Resent Successfully");

      // Reset Timer
      setTimer(5);
      setCanResend(false);
    } catch (err) {
      alert("Failed to resend OTP");
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        <h2>You're Almost There!</h2>
        <p>OTP sent to: <b>{email}</b></p>

        <input
          type="text"
          maxLength="6"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
          className="otp-input"
          placeholder="------"
        />

        <p
          className={`resend-text ${canResend ? "active" : "disabled"}`}
          onClick={resendOtp}
        >
          {canResend ? "Resend OTP" : `Resend in 0:${timer < 10 ? "0" + timer : timer}`}
        </p>

        <button className="submit-btn" onClick={verifyOtp} disabled={loading}>
          {loading ? "Verifying..." : "Get Started"}
        </button>
      </div>
    </div>
  );
}
