// src/pages/ClientDetails.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../firbase/Firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import "./client-pages.css";

const teamSizeOptions = [
  "1 (Individual)",
  "2–5 Members",
  "6–10 Members",
  "11–20 Members",
  "21–50 Members",
  "51+ Members",
];

const sectors = [
  "Information Technology",
  "Banking & Finance",
  "Healthcare",
  "Education",
  "Marketing & Advertising",
  "Others",
];

export default function ClientDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  // Taking data safely from previous screen
  const passed = location.state || {};

  const [companyName, setCompanyName] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedTeamSize, setSelectedTeamSize] = useState("");
  const [loading, setLoading] = useState(false);

  // Base64 encode (simple, safe)
  const encodePassword = (pwd) => btoa(pwd);

  // If this page loads directly -> prevent crash
  useEffect(() => {
    if (!passed.email) {
      alert("Signup data missing. Please start again.");
      navigate("/client-signup");
    }
  }, []);

  const handleContinue = async (e) => {
    e.preventDefault();

    if (!companyName.trim() || !selectedSector || !selectedTeamSize) {
      return alert("Please fill all fields.");
    }

    setLoading(true);

    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setLoading(false);
        return alert("User not logged in.");
      }

      const encodedPassword = passed.password
        ? encodePassword(passed.password)
        : "";

      const payload = {
        uid: currentUser.uid,
        firstName: passed.firstName || "",
        lastName: passed.lastName || "",
        email: passed.email || currentUser.email || "",
        password: encodedPassword,
        company_name: companyName.trim(),
        sector: selectedSector,
        team_size: selectedTeamSize,
        is_individual: selectedTeamSize === "1 (Individual)",
        role: "client",
        profileCompleted: true,
        updated_at: serverTimestamp(),
      };

      await setDoc(doc(db, "users", currentUser.uid), payload, { merge: true });

      navigate("/client-dashbroad2/clienthome", {
        state: { uid: currentUser.uid },
      });
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="client-page">
      <div className="card">
        <div className="header">
          <img src="/assets/huzzler.png" className="logo-img" alt="logo" />
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>

        <h2 className="title">Sign up as Client</h2>
        <p className="subtitle">We’d like to know you better.</p>

        <form className="form" onSubmit={handleContinue}>
          <label className="label">Company Name</label>
          <input
            className="input"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Company name"
            required
          />

          <label className="label">Sector</label>
          <select
            className="select"
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
          >
            <option value="">Select sector</option>
            {sectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <label className="label">Team Size</label>
          <select
            className="select"
            value={selectedTeamSize}
            onChange={(e) => setSelectedTeamSize(e.target.value)}
          >
            <option value="">Select team size</option>
            {teamSizeOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <div className="actions">
            <button type="submit" className="primary" disabled={loading}>
              {loading ? "Saving…" : "CONTINUE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
