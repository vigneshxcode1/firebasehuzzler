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

    // 🔍 Check if user exists
    const q = query(
      collection(db, "users"),
      where("email", "==", normalized)
    );

    const querySnap = await getDocs(q);

    if (querySnap.empty) {
      alert("No account found with this email.");
      setLoading(false);
      return;
    }

    const userData = querySnap.docs[0].data();

    const storedPassword = userData.password || "";
    const firstName = userData.firstName || "";
    const lastName = userData.lastName || "";
    const role = userData.role || "freelancer"; // ⭐ ADD ROLE HERE

    // 🔥 Send OTP
    const res = await axios.post(
      "https://huzzler.onrender.com/api/auth/send-otp",
      { email: normalized }
    );

    if (res.status === 200) {
      alert("OTP sent to " + normalized);

      
      navigate("/otp", {
        state: {
          email: normalized,
          firstName,
          lastName,
          password: storedPassword,
          role, 
        },
      });
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
    <div className="forgot-root">
      <div className="forgot-box">
        <h2>Forgot Password</h2>
        <p>Enter your registered email to reset your password</p>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="forgot-input"
        />

        <button
          className="forgot-btn"
          onClick={handleForgotPassword}
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        <button
          className="back-btn"
          onClick={() => navigate("/firelogin")}
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
}