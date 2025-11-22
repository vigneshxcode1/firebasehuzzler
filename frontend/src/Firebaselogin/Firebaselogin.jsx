// src/pages/fireLogin.jsx
import React, { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
// import Google from "../assets/Google.png";
// import facebook from "../assets/facebook.png";
import axios from "axios";
// import "@fontsource/poppins";

import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firbase/Firebase";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const BACKEND_SEND_OTP = "https://huzzler.onrender.com/api/auth/send-otp";

  // -------------------- DISABLE SCROLL --------------------
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden"; // disable scroll
    return () => {
      document.body.style.overflow = originalStyle; // restore scroll on unmount
    };
  }, []);

  const showMsg = (text, isError = true) => {
    setMsg({ text, isError });
    setTimeout(() => setMsg(null), 4000);
  };

  
const handleEmailLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMsg(null);

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const encodedPassword = btoa(password.trim());

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", normalizedEmail));
    const snap = await getDocs(q);

    if (snap.empty) {
      showMsg(
        <>
          No account found with this email.{" "}
          <button
            onClick={() => navigate("/fireregister")}
            style={styles.linkBtn}
          >
            Sign up
          </button>
        </>,
        true
      );
      return;
    }

    const userData = snap.docs[0].data();
    const uid = snap.docs[0].id;

    // --------- PASSWORD CHECK ---------
    if (userData.password !== encodedPassword) {
      showMsg("Incorrect password.");
      return;
    }

    // --------- SEND OTP ---------
    const res = await axios.post(BACKEND_SEND_OTP, { email: normalizedEmail });

    if (!res.data?.success) {
      showMsg(res.data?.message || "Failed to send OTP.");
      return;
    }

    showMsg(`OTP sent to ${normalizedEmail}`, false);

    // -------------------------------------------------------
    // 🔥 ROLE-BASED OTP PAGE REDIRECT
    // -------------------------------------------------------
    const role = userData.role?.toLowerCase();

    if (role === "client") {
      navigate("/clientloginotp", {
        state: { email: normalizedEmail, uid },
      });
    } 
    else if (role === "freelancer") {
      navigate("/freelancer-loginotp", {
        state: { email: normalizedEmail, uid },
      });
    } 
    else {
      showMsg("User role undefined. Contact support.");
    }

  } catch (err) {
    showMsg(err?.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
};

  
  // ---------------- GOOGLE LOGIN

  // ---------------- GITHUB LOGIN

  return (
    <div style={styles.loginBg}>
      <form style={styles.card} onSubmit={handleEmailLogin}>
        <h1 style={styles.title}>Huzzler</h1>
        <p style={styles.subtitle}>Create. Connect. Grow. It all starts here.</p>

        {msg && (
          <div style={msg.isError ? styles.errorMsg : styles.successMsg}>
            {msg.text}
          </div>
        )}

        <input
          type="email"
          placeholder="Email or Username"
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="button"
          style={styles.forgotBtn}
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </button>

        <button type="submit" style={styles.loginBtn} disabled={loading}>
          {loading ? "Processing..." : "Log in"}
        </button>

        <div style={styles.separatorWrapper}>
          <div style={styles.separatorLine}></div>
          <span style={styles.separatorText}>or continue with</span>
          <div style={styles.separatorLine}></div>
        </div>
{/* 
        <div style={styles.socialRow}>
          <button type="button" style={styles.socialBtn} onClick={handleGoogleLogin}>
            <img src={Google} style={styles.socialIcon} />
          </button>

          <button type="button" style={styles.socialBtn} onClick={handleGithubLogin}>
            <img src={facebook} style={styles.socialIcon} />
          </button>
        </div> */}

        <p style={styles.signupText}>
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/fireregister")}
            style={{ color: "#6b31ff", cursor: "pointer" }}
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}

/* --------------------------------------
   INLINE CSS (FIGMA EXACT DESIGN)
--------------------------------------- */
const styles = {
  loginBg: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    margin: 0,
    padding: 0,
    alignItems: "center",
    background:
      "radial-gradient(circle at top right, #e2d4ff 0%, #ffffff 60%, #fff9d6 100%)",
    fontFamily: "Poppins, sans-serif",
  },

  card: {
    width: "420px",
    background: "#fff",
    padding: "40px",
    borderRadius: "18px",
    boxShadow: "0px 12px 32px rgba(0,0,0,0.10)",
    textAlign: "center",
  },

  title: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#6b31ff",
  },

  subtitle: {
    marginTop: "6px",
    marginBottom: "25px",
    fontSize: "14px",
    color: "#666",
  },

  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #e5e5e5",
    marginBottom: "14px",
    fontSize: "14px",
  },

  forgotBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "block",
    marginLeft: "auto",
    marginBottom: "18px",
    fontSize: "15px",
  },

  loginBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(90deg, #7c3aed, #9747ff)",
    border: "none",
    borderRadius: "10px",
    color: "white",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
  },

  separatorWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    margin: "18px 0",
  },

  separatorLine: {
    flex: 1,
    height: "1px",
    background: "#ddd",
  },

  separatorText: {
    fontSize: "13px",
    color: "#777",
    whiteSpace: "nowrap",
  },

  socialRow: {
    display: "flex",
    justifyContent: "center",
    gap: "18px",
    marginBottom: "22px",
  },

  socialBtn: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    border: "1px solid #ddd",
    background: "white",
    cursor: "pointer",
  },

  socialIcon: { width: "22px" },

  signupText: {
    fontSize: "14px",
  },

  successMsg: {
    background: "#e8ffe8",
    color: "#2e7d32",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "8px",
  },

  errorMsg: {
    background: "#ffe4e4",
    color: "#c62828",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "8px",
  },

  linkBtn: {
    background: "none",
    border: "none",
    color: "#6b31ff",
    cursor: "pointer",
  },
};