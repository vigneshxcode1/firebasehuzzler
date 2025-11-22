import React, { useState, useEffect } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firbase/Firebase";
import { useLocation, useNavigate } from "react-router-dom";
import "./ProfessionalStatus.css";

export default function ProfesionalStatusScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const data = location.state || {};

  const {
    uid,
    firstName,
    lastName,
    email,
    expertise,
    referral,
    linkedin,
    location: userLocation,
    password,
  } = data;

  useEffect(() => {
    if (!data.uid) {
      alert("Signup details missing");
      navigate("/freelancer-signup");
    }
  }, [data, navigate]);

  const [title, setTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [currentStatus, setCurrentStatus] = useState("Professional");
  const [loading, setLoading] = useState(false);

  const encodePassword = (p) => (p ? btoa(p) : "");

  const saveData = async () => {
    if (!title.trim()) return alert("Enter Professional Title");
    if (!experience) return alert("Select Experience Level");

    setLoading(true);

    try {
      await setDoc(
        doc(db, "users", uid),
        {
          uid,
          firstName,
          lastName,
          email,
          expertise,
          referral,
          linkedin,
          location: userLocation,
          professional_title: title,
          experience_level: experience,
          current_status: currentStatus,
          role: "freelancer",
          profileCompleted: true,
          password: encodePassword(password),
          updated_at: serverTimestamp(),
        },
        { merge: true }
      );

      navigate("/freelance-dashboard", { state: { uid } });

    } catch (err) {
      alert("Error saving profile: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="pro-container">
      <h3>Complete Final Step</h3>

      <input
        type="text"
        placeholder="Professional Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <select
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
      >
        <option value="">Experience Level</option>
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Expert</option>
      </select>

      <div className="pro-status-row">
        <div
          className={currentStatus === "Professional" ? "selected" : ""}
          onClick={() => setCurrentStatus("Professional")}
        >
          Professional
        </div>

        <div
          className={currentStatus === "Student" ? "selected" : ""}
          onClick={() => setCurrentStatus("Student")}
        >
          Student
        </div>
      </div>

      <button onClick={saveData} disabled={loading}>
        {loading ? "Saving..." : "CONTINUE"}
      </button>
    </div>
  );
}
