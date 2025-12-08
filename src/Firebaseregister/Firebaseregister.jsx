import React, { useState } from "react";
import { auth, db } from "../firbase/Firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { height } from "@mui/system";

export default function Signin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const saveUserRole = async (role, next) => {
    setLoading(true);

    const user = auth.currentUser;
    if (user) {
      await setDoc(
        doc(db, "users", user.uid),
        {
          email: user.email,
          role,
          created_at: serverTimestamp(),
        },
        { merge: true }
      );
    }

    setLoading(false);
    navigate(next);
  };

  return (
    <div style={styles.pageBg}>
      <div style={styles.card}>

        {/* Title */}
        <h1 style={styles.title}>Huzzler</h1>
        <p style={styles.welcome}>Welcome to Huzzler</p>
        <p style={styles.subtitle}>Where talent meets opportunity</p>

        {/* Buttons */}
        <div style={styles.btnRow}>
          <button
            style={{ ...styles.whiteBtn }}
            disabled={loading}
            onClick={() => saveUserRole("freelancer", "/freelancer-signup")}
          >
            {loading ? "Loading..." : "FREELANCER"}
          </button>

          <button
            style={styles.purpleBtn}
            disabled={loading}
            onClick={() => saveUserRole("client", "/client-signup")}
          >
            {loading ? "Loading..." : "CLIENT"}
          </button>
        </div>

      </div>

      <div style={styles.bottomLogin}>
        Already have an account?{" "}
        <span
          style={styles.loginBtn}
          onClick={() => navigate("/firelogin")}
        >
          Log in
        </span>
      </div>
    </div>
  );
}

/* ======================================================
   EXACT FIGMA UI STYLES — PERFECT MATCH
====================================================== */

const styles = {
  pageBg: {
    minHeight: "100vh",
    background:
      "linear-gradient(140deg, #ffffff 10%, #f4edff 60%, #fffbd9 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Inter, sans-serif",
    padding: 20,
  },

  card: {
    width: "500px",
    background: "white",
    borderRadius: "42px",
    padding: "70px 60px 180px",
    textAlign: "center",
    boxShadow: "0 12px 45px rgba(0,0,0,0.08)",
  },

  title: {
    fontSize: 32,
    fontWeight: 700,
    color: "#7C3CFF",
    marginBottom: 5,
  },

  welcome: {
    fontSize: 16,
    fontWeight: 237,
    color: "#7C3CFF",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 16,
    color: "#4A5565",
    marginBottom: 50,
    fontWeight: 237,
  },

  btnRow: {
    display: "flex",
    justifyContent: "center",
    gap: 40,
    marginTop: 20,
  },

  whiteBtn: {
    width: 180,
    padding: "38px 0",
    background: "white",
    color: "#7C3CFF",
    border: "none",
    fontWeight:700,
    fontSize: 15,
    borderRadius: "20px",
    boxShadow: "0 8px 18px rgba(0,0,0,0.10)",
    cursor: "pointer",
  },

  purpleBtn: {
    width: 180,
    padding: "18px 0",
    background: "#7C3CFF",
    color: "white",
    border: "none",
    fontWeight: 700,
    fontSize: 15,
    borderRadius: "20px",
    boxShadow: "0 8px 26px rgba(124,58,237,0.4)",
    cursor: "pointer",
  },

  bottomLogin: {
    marginTop: 35,
    fontSize: 16,
    fontWeight: 500,
    color: "#4A5565",
  },

  loginBtn: {
    marginLeft: 6,
    marginRight: 6,
    color: "white",
    background: "#7C3CFF",
    padding: "15px 29px",
    borderRadius: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 15,
    boxShadow: "0px 4px 14px rgba(124,58,237,0.4)",
  },
};
