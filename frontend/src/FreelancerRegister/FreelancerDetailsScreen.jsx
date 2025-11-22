import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./FreelancerDetails.css";

export default function FreelancerDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const baseData = location.state || {};

  const expertiseOptions = [
    "Graphics & Design",
    "Programming & Tech",
    "Digital Marketing",
    "Writing & Translation",
    "Video & Animation",
    "Music & Audio",
    "AI Services",
    "Data",
    "Business",
    "Finance",
    "Photography",
    "Lifestyle",
    "Consulting",
    "Personal Growth & Hobbies",
  ];

  const referralOptions = ["LinkedIn", "Facebook", "X", "Instagram", "Other"];

  const [expertise, setExpertise] = useState("");
  const [locationText, setLocationText] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [referral, setReferral] = useState("");

  const handleNext = () => {
    if (!expertise) return alert("Select expertise");
    if (!locationText.trim()) return alert("Enter location");
    if (!linkedin.trim()) return alert("Enter LinkedIn URL");
    if (!referral) return alert("Select referral source");

    navigate("/professional-status", {
      state: {
        ...baseData,
        expertise,
        location: locationText.trim(),
        referral,
        linkedin: linkedin.trim(),
      },
    });
  };

  return (
    <div className="freelancer-container">
      <div className="freelancer-card">
        <h2>Freelancer – Basic Details</h2>

        <label>Expertise</label>
        <select value={expertise} onChange={(e) => setExpertise(e.target.value)}>
          <option value="">Select...</option>
          {expertiseOptions.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>

        <label>Location</label>
        <input
          type="text"
          value={locationText}
          onChange={(e) => setLocationText(e.target.value)}
        />

        <label>LinkedIn Profile</label>
        <input
          type="text"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
        />

        <label>How did you hear about us?</label>
        <select value={referral} onChange={(e) => setReferral(e.target.value)}>
          <option value="">Select...</option>
          {referralOptions.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>

        <button className="yellow-btn" onClick={handleNext}>Continue</button>
      </div>
    </div>
  );
}
