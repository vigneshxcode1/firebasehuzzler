

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../firbase/Firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function ClientDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const passed = location.state || {};

  const [companyName, setCompanyName] = useState("");
  const [businessInfo, setBusinessInfo] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [isIndividual, setIsIndividual] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!passed.email) {
      alert("Signup data missing. Please start again.");
      navigate("/client-signup");
    }
  }, []);

  const handleContinue = async () => {
    if (!companyName.trim()) return alert("Enter company name");
    if (!businessInfo.trim()) return alert("Tell about your business");
    if (!teamSize.trim()) return alert("Enter your team size");

    try {
      setLoading(true);
      const user = auth.currentUser;

      const encodedPass = passed.password ? btoa(passed.password) : "";

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          firstName: passed.firstName,
          lastName: passed.lastName,
          email: passed.email,
          password: encodedPass,
          companyName,
          businessInfo,
          teamSize,
          isIndividual,
          role: "client",
          profileCompleted: true,
          updated_at: serverTimestamp(),
        },
        { merge: true }
      );

      navigate("/client-dashbroad2/clienthome", { replace: true });
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.bg}>
      
      {/* TOP ROW */}
      <div style={styles.topRow}>
        <span style={styles.backArrow} onClick={() => navigate(-1)}>←</span>
        <span style={styles.topText}>sign up as Client</span>
      </div>

      {/* CARD */}
      <div style={styles.card}>
        <h3 style={styles.heading}>
          We’d like to get to know you better – this will
          <br /> only take a moment.
        </h3>

        {/* INPUTS */}
        <input
          placeholder="Company name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Tell about your business?"
          value={businessInfo}
          onChange={(e) => setBusinessInfo(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="What is your team size"
          value={teamSize}
          onChange={(e) => setTeamSize(e.target.value)}
          style={styles.input}
        />

        {/* INDIVIDUAL CHECKBOX */}
        <label style={styles.checkRow}>
          <input
            type="checkbox"
            checked={isIndividual}
            onChange={() => setIsIndividual(!isIndividual)}
            style={styles.checkbox}
          />
          <span>Individual</span>
        </label>

        {/* BUTTON */}
        <button style={styles.button} onClick={handleContinue} disabled={loading}>
          {loading ? "Saving..." : "CONTINUE"}
        </button>
      </div>
    </div>
  );
}

/* --------------------------------------------------
   EXACT FIGMA UI (Pixel-perfect styling)
-------------------------------------------------- */
const styles = {
  bg: {
    width: "100vw",
    height: "100vh",
    background:
      "radial-gradient(circle at 10% 90%, #ffffdd 0%, #ffffff 30%, #f3eaff 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 40,
    fontFamily: "Inter, sans-serif",
    overflow: "hidden",
  },

  topRow: {
    width: 650,
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },

  backArrow: {
    fontSize: 20,
    cursor: "pointer",
    marginLeft: -40,
    fontWeight: 600,
  },

  topText: {
    fontWeight: 700,
    fontSize: 16,
  },

  card: {
    width: 650,
    background: "#fff",
    padding: "45px 55px",
    borderRadius: 26,
    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
    textAlign: "center",
  },

  heading: {
    fontSize: 16,
    fontWeight: 400,
    marginBottom: 35,
    color: "#000000",
    lineHeight: "24px",
  },

  input: {
    width: "100%",
    padding: "16px",
    fontSize: 15,
    borderRadius: 14,
    border: "1px solid #e5e5e5",
    outline: "none",
    marginBottom: 18,
  },

  checkRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 5,
    marginBottom: 30,
    fontSize: 14,
  },

  checkbox: {
    width: 18,
    height: 18,
    marginTop:"12px",
  },

  button: {
    width: "100%",
    padding: "16px",
    borderRadius: 16,
    background: "#7C3CFF",
    color: "#FFFFFF",
    border: "none",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  },
};
