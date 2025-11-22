import React, { useState } from "react";
import { auth, db } from "../firbase/Firebase"; // <- your firebase config
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import "./signin.css"; // optional for styling

export default function Signin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const saveUserRole = async (role, nextPage) => {
    setLoading(true);

    const user = auth.currentUser;

    if (user) {
      await setDoc(
        doc(db, "users", user.uid),
        {
          email: user.email,
          role: role,
          created_at: serverTimestamp(),
        },
        { merge: true }
      );
    }

    setLoading(false);
    navigate(nextPage); // Navigate always even without login
  };

  return (
    <div className="signin-container">

      <h1 className="title">Huzzler</h1>

      <p className="subtitle">
        Your journey to new opportunities starts here
      </p>

      <p className="get-started">Get started as</p>

      {/* Buttons */}
      <div className="btn-row">
        <button
          disabled={loading}
          className="role-btn"
          onClick={() => saveUserRole("freelancer", "/freelancer-signup")}
        >
          {loading ? "Loading..." : "FREELANCER"}
        </button>

        <button
          disabled={loading}
          className="role-btn"
          onClick={() => saveUserRole("client", "/client-signup")}
        >
          {loading ? "Loading..." : "CLIENT"}
        </button>
      </div>

      <div className="login-row">
        <span>Already here? </span>
        <span
          className="login-btn"
          onClick={() => navigate("/firelogin")}
        >
          log in
        </span>
        <span> jump back to action</span>
      </div>

      <div className="logo-box">
        <img src="/assets/huzzler.png" alt="logo" className="logo" />
      </div>
    </div>
  );
}
