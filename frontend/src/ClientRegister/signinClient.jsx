// src/pages/SignUpClient.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { db } from "../firbase/Firebase"; // <-- fix folder name if needed
import { collection, query, where, getDocs } from "firebase/firestore";
import "./signup-client.css";

const SEND_OTP = "https://huzzler.onrender.com/api/auth/send-otp"; // your backend

export default function SignUpClient() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  const show = (msg) => alert(msg);

  const handleSendOtp = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      return show("All fields are required");
    }

    const normalizedEmail = email.trim().toLowerCase();

    // basic email regex (simple)
    if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
      return show("Please enter a valid email");
    }

    if (password.length < 6) {
      return show("Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      // Firestore duplicate check (client-side convenience check)
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", normalizedEmail));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const role = snap.docs[0].data().role ?? "";
        setLoading(false);
        if (role === "freelancer") {
          return show("This email is already registered as a Freelancer. Please use another email.");
        }
        return show("Email already registered. Please log in.");
      }

      // Request OTP from backend. Send only email (backend will generate OTP + store token)
      const res = await axios.post(SEND_OTP, { email: normalizedEmail });

      if (res.status === 200 && res.data.success) {
    localStorage.setItem("otpUser", JSON.stringify({
      email: normalizedEmail,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      password,
      role: "client",
    }));
    navigate("/otp", {
    state: {
      email: normalizedEmail,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      password,
      role: "client",
    },
  });
      } else {
        show(res.data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      show(err?.response?.data?.message || err.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="logo"><img src="/assets/huzzler.png" alt="Huzzler" /></div>
        <h2>Sign up as Client</h2>
        <p className="subtitle">“Ready to Make Things Happen”</p>

        <input type="text" placeholder="First name" value={firstName}
          onChange={(e) => setFirstName(e.target.value)} className="signup-input" />

        <input type="text" placeholder="Last name" value={lastName}
          onChange={(e) => setLastName(e.target.value)} className="signup-input" />

        <input type="email" placeholder="Email address" value={email}
          onChange={(e) => setEmail(e.target.value)} className="signup-input" />

        <div className="password-wrapper">
          <input type={showPassword ? "text" : "password"} placeholder="Enter your password"
            value={password} onChange={(e) => setPassword(e.target.value)} className="signup-input" />
          <button type="button" onClick={togglePassword} className="toggle-btn">
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button className="otp-btn" onClick={handleSendOtp} disabled={loading}>
          {loading ? "Sending..." : "Get OTP"}
        </button>

        <p className="login-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/firelogin")}>Log in</span>
        </p>
      </div>
    </div>
  );
}
