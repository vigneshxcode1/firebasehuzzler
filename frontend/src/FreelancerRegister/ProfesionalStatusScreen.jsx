// ProfesionalStatusScreen.jsx
// NOTE:
// - Firebase app initialize panradhu vera file la irukkanum (e.g. src/firebase.js)
// - Inga initializeApp or config paste panna KUDADHU.
// - Just make sure somewhere in app you already called initializeApp().

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

// 🔹 Optional: logo import (update path as per your project)
// import logo from "../assets/huzzler.png";

export default function ProfesionalStatusScreen(props) {
  const navigate = useNavigate();
  const location = useLocation();

  // 👇 Data from previous step (either props or location.state)
  const navState = location.state || {};

  const {
    uid = navState.uid || "",
    firstName = navState.firstName || "",
    lastName = navState.lastName || "",
    email = navState.email || "",
    expertise = navState.expertise || "",
    referral = navState.referral || "",
    linkedin = navState.linkedin || "",
    location: userLocation = navState.location || "",
  } = props;

  const [title, setTitle] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [currentStatus, setCurrentStatus] = useState("Professional");
  const [isLoading, setIsLoading] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackType, setSnackType] = useState("error"); // "error" | "success"

  const experienceOptions = ["Beginner", "Intermediate", "Expert"];

  const auth = getAuth();
  const db = getFirestore();

  const showSnackBar = (message, type = "error") => {
    setSnackMessage(message);
    setSnackType(type);
    setTimeout(() => {
      setSnackMessage("");
    }, 3000);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      showSnackBar("Please enter your Professional Title.");
      return;
    }
    if (!selectedExperience) {
      showSnackBar("Please select your Level of Experience.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      showSnackBar("User not logged in.");
      return;
    }

    setIsLoading(true);
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          firstName,
          lastName,
          email,
          expertise,
          location: userLocation,
          referral,
          linkedin,
          professional_title: title.trim(),
          experience_level: selectedExperience,
          current_status: currentStatus,
          role: "freelancer",
          profileCompleted: true,
          updated_at: serverTimestamp(),
        },
        { merge: true }
      );

      showSnackBar("Profile updated successfully!", "success");

      // 🔹 After success, go to your main navigation screen route
      // Update route as per your app (e.g. "/home" or "/freelance-dashboard")
      navigate("/freelance-dashboard", {
        replace: true,
        state: { uid: user.uid },
      });
    } catch (err) {
      console.error("Failed to save data:", err);
      showSnackBar(`Failed to save data: ${err.message || err}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- Styles (Flutter-like) ----------
  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "#FFFFFF",
    display: "flex",
    justifyContent: "center",
  };

  const scrollWrapper = {
    width: "100%",
    maxWidth: 480,
    padding: "16px 24px 24px",
  };

  const logoBox = {
    height: 40,
    width: 40,
    borderRadius: 12,
    backgroundColor: "#FDFD96",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  };

  const headerRow = {
    display: "flex",
    alignItems: "center",
    marginTop: 6,
  };

  const backButton = {
    border: "none",
    background: "transparent",
    padding: 4,
    marginRight: 8,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  };

  const headerText = {
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "'Rubik', system-ui, sans-serif",
  };

  const instructionText = {
    textAlign: "center",
    marginTop: "6vh",
    fontSize: 15,
    fontWeight: 600,
    fontFamily: "'Rubik', system-ui, sans-serif",
  };

  const spacedBlock = {
    marginTop: "5vh",
  };

  const fieldContainer = {
    padding: "0 12px",
    marginBottom: 20,
  };

  const textFieldWrapper = {
    borderRadius: 20,
    border: "1px solid #E0E0E0",
    backgroundColor: "#FFFFFF",
    padding: "4px 16px",
  };

  const textInput = {
    width: "100%",
    border: "none",
    outline: "none",
    padding: "8px 0",
    fontSize: 14,
    fontFamily: "'Rubik', system-ui, sans-serif",
    color: "#212121",
  };

  const dropdownWrapper = {
    borderRadius: 20,
    border: "1px solid #E0E0E0",
    padding: "0 16px",
    backgroundColor: "#FFFFFF",
    height: 48,
    display: "flex",
    alignItems: "center",
  };

  const selectStyle = {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 14,
    fontFamily: "'Rubik', system-ui, sans-serif",
    color: selectedExperience ? "#212121" : "#757575",
    appearance: "none",
  };

  const selectArrow = {
    marginLeft: "auto",
    fontSize: 18,
    color: "#555",
  };

  const statusLabelBox = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 20,
    border: "1px solid #E0E0E0",
    backgroundColor: "#FFFFFF",
    textAlign: "center",
  };

  const statusLabelText = {
    fontSize: 14,
    fontFamily: "'Rubik', system-ui, sans-serif",
    color: "#212121",
  };

  const statusRow = {
    display: "flex",
    alignItems: "center",
    marginTop: "3vh",
    padding: "0 16px",
    gap: 16,
  };

  const statusChipBase = (active) => ({
    flex: 1,
    borderRadius: 20,
    border: "1px solid #000000",
    padding: "14px 0",
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: active ? "#000000" : "#FFFFFF",
  });

  const statusChipText = (active) => ({
    fontSize: 13,
    fontWeight: 500,
    fontFamily: "'Rubik', system-ui, sans-serif",
    color: active ? "#FFFFFF" : "#000000",
  });

  const buttonWrapper = {
    marginTop: "20vh",
    display: "flex",
    justifyContent: "center",
  };

  const buttonStyle = {
    width: "66%",
    height: 48,
    borderRadius: 20,
    border: "1px solid #000000",
    backgroundColor: "#FFF176", // similar to Colors.yellow[300]
    fontFamily: "'Rubik', system-ui, sans-serif",
    fontWeight: 600,
    fontSize: 15,
    cursor: isLoading ? "default" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#000000",
  };

  const snackBarStyle = {
    position: "fixed",
    left: "50%",
    bottom: 24,
    transform: "translateX(-50%)",
    maxWidth: "90%",
    padding: "10px 16px",
    borderRadius: 8,
    backgroundColor: snackType === "error" ? "#E53935" : "#43A047",
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "'Rubik', system-ui, sans-serif",
    boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
    zIndex: 9999,
  };

  return (
    <div style={pageStyle}>
      <div style={scrollWrapper}>
        {/* Logo */}
        <div style={logoBox}>
          {/* If you imported logo above, use: <img src={logo} alt="Huzzler" style={{ width: "70%", height: "70%", objectFit: "contain" }} /> */}
          <span
            style={{
              fontSize: 16,
              fontWeight: "bold",
              fontFamily: "'Rubik', system-ui, sans-serif",
            }}
          >
            H
          </span>
        </div>

        {/* Header */}
        <div style={headerRow}>
          <button
            type="button"
            style={backButton}
            onClick={() => navigate(-1)}
          >
            <span style={{ fontSize: 18 }}>‹</span>
          </button>
          <span style={headerText}>Sign up as freelancer</span>
        </div>

        {/* Instruction */}
        <div style={instructionText}>
          Please complete the following step.
        </div>

        {/* Professional Title */}
        <div style={spacedBlock}>
          <div style={fieldContainer}>
            <div style={textFieldWrapper}>
              <input
                type="text"
                style={textInput}
                placeholder="Professional Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          {/* Level of Experience Dropdown */}
          <div style={fieldContainer}>
            <div style={dropdownWrapper}>
              <select
                style={selectStyle}
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
              >
                <option value="" disabled>
                  Level of Experience?
                </option>
                {experienceOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <span style={selectArrow}>⌄</span>
            </div>
          </div>

          {/* Current Status Label */}
          <div style={{ padding: "0 12px", marginTop: 20 }}>
            <div style={statusLabelBox}>
              <span style={statusLabelText}>What's Your Current Status?</span>
            </div>
          </div>

          {/* Status Chips */}
          <div style={statusRow}>
            <div
              style={statusChipBase(currentStatus === "Professional")}
              onClick={() => setCurrentStatus("Professional")}
            >
              <span style={statusChipText(currentStatus === "Professional")}>
                Professional
              </span>
            </div>
            <div
              style={statusChipBase(currentStatus === "Student")}
              onClick={() => setCurrentStatus("Student")}
            >
              <span style={statusChipText(currentStatus === "Student")}>
                Student
              </span>
            </div>
          </div>
        </div>

        {/* CONTINUE Button */}
        <div style={buttonWrapper}>
          <button
            type="button"
            style={buttonStyle}
            onClick={isLoading ? undefined : handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "CONTINUE"}
          </button>
        </div>
      </div>

      {/* Snackbar */}
      {snackMessage && (
        <div style={snackBarStyle}>
          {snackMessage}
        </div>
      )}
    </div>
  );
}