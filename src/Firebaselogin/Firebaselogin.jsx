// // src/pages/fireLogin.jsx
// import React, { useState, useEffect } from "react";
// import google from "../assets/Google.png";
// import facebook from "../assets/facebook.png";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { signInWithRedirect, getRedirectResult,GithubAuthProvider} from "firebase/auth";

// import { collection, query, where, getDocs } from "firebase/firestore";
// import { auth, db } from "../firbase/Firebase";

// export default function LoginPage() {
//  const navigate = useNavigate();

//  const [email, setEmail] = useState("");
//  const [password, setPassword] = useState("");
//  const [loading, setLoading] = useState(false);
//  const [msg, setMsg] = useState(null);

//  const BACKEND_SEND_OTP = "https://huzzler.onrender.com/api/auth/send-otp";

//  useEffect(() => {
//  const original = document.body.style.overflow;
//  document.body.style.overflow = "hidden";
//  return () => (document.body.style.overflow = original);
//  }, []);

//  const showMsg = (text, isError = true) => {
//  setMsg({ text, isError });
//  setTimeout(() => setMsg(null), 4000);
//  };


//  // const provider = new GoogleAuthProvider();
//  // signInWithRedirect(auth, provider);

//  // // After redirect back to your app:
//  // useEffect(() => {
//  // getRedirectResult(auth)
//  // .then((result) => {
//  // if (result) {
//  // const user = result.user;
//  // console.log("Google login successful:", user);
//  // }
//  // })
//  // .catch((err) => console.log(err));
//  // }, []);

// const handleGoogleLogin = async () => {
//  const provider = new GoogleAuthProvider();
//  try {
//  const result = await signInWithPopup(auth, provider);
//  const user = result.user;

//  // Check if user exists
//  const q = query(collection(db, "users"), where("email", "==", user.email));
//  const snap = await getDocs(q);

//  if (snap.empty) {
//  navigate("/fireregister", { state: { email: user.email, uid: user.uid } });
//  return;
//  }

//  const userData = snap.docs[0].data();

//  // Normalize role
//  const role = (userData.role || "").toString().trim().toLowerCase();
//  console.log("Role fetched from Firestore:", role); // debug

//  if (role === "client") {
//  navigate("/client-dashbroad2", { state: { uid: user.uid } });
//  } else if (role === "freelancer") {
//  navigate("/freelance-dashboard", { state: { uid: user.uid } });
//  } else {
//  console.warn("Unknown role, defaulting to freelancer");
//  navigate("/freelance-dashboard", { state: { uid: user.uid } });
//  }

//  } catch (err) {
//  console.error("Google login error:", err);
//  showMsg("Google login failed: " + err.message);
//  }
// };



// const handleGithubLogin = async () => {
//  const provider = new GithubAuthProvider();

//  try {
//  setLoading(true);

//  const result = await signInWithPopup(auth, provider);
//  const user = result.user;

//  // GitHub may not always provide email
//  const userEmail = user.email || "";

//  // Check if user exists in Firestore
//  const q = query(collection(db, "users"), where("email", "==", userEmail));
//  const snap = await getDocs(q);

//  if (snap.empty) {
//  // New user → navigate to registration screen
//  navigate("/fireregister", {
//  state: { email: userEmail, uid: user.uid },
//  });
//  return;
//  }

//  const userData = snap.docs[0].data();

//  // Normalize role
//  const role = (userData.role || "").toString().trim().toLowerCase();
//  console.log("Role fetched from Firestore (GitHub):", role); // debug

//  if (role === "client") {
//  navigate("/client-dashbroad2", { state: { uid: user.uid } });
//  } else if (role === "freelancer") {
//  navigate("/freelance-dashboard", { state: { uid: user.uid } });
//  } else {
//  console.warn("Unknown role, defaulting to freelancer");
//  navigate("/freelance-dashboard", { state: { uid: user.uid } });
//  }

//  } catch (err) {
//  console.error("GitHub login error:", err);
//  showMsg("GitHub login failed: " + err.message);
//  } finally {
//  setLoading(false);
//  }
// };



//  const handleEmailLogin = async (e) => {
//  e.preventDefault();
//  setLoading(true);
//  setMsg(null);

//  try {
//  const normalizedEmail = email.trim().toLowerCase();
//  const encodedPassword = btoa(password.trim());

//  const q = query(
//  collection(db, "users"),
//  where("email", "==", normalizedEmail)
//  );
//  const snap = await getDocs(q);

//  if (snap.empty) {
//  showMsg(
//  <>
//  No account found with this email.{" "}
//  <button onClick={() => navigate("/fireregister")} style={styles.linkBtn}>
//  Sign up
//  </button>
//  </>,
//  true
//  );
//  return;
//  }

//  const userData = snap.docs[0].data();
//  const uid = snap.docs[0].id;

//  if (userData.password !== encodedPassword) {
//  showMsg("Incorrect password.");
//  return;
//  }

//  const res = await axios.post(BACKEND_SEND_OTP, { email: normalizedEmail });

//  if (!res.data?.success) {
//  showMsg(res.data?.message || "Failed to send OTP.");
//  return;
//  }

//  showMsg(`OTP sent to ${normalizedEmail}`, false);

//  const role = (userData.role || "").trim().toLowerCase();
//  if (role === "client") {
//  navigate("/clientloginotp", { state: { email: normalizedEmail, uid } });
//  } else {
//  navigate("/freelancer-loginotp", { state: { email: normalizedEmail, uid } });
//  }
//  } catch (err) {
//  showMsg(err?.response?.data?.message || err.message);
//  } finally {
//  setLoading(false);
//  }
//  };

//  return (
//  <div style={styles.pageBg}>
//  <div style={styles.card}>

//  {/* TITLE */}
//  <h1 style={styles.title}>Huzzler</h1>
//  <p style={styles.subtitle}>Create. Connect. Grow. It all starts here.</p>

//  {/* MESSAGE */}
//  {msg && (
//  <div style={msg.isError ? styles.errorMsg : styles.successMsg}>
//  {msg.text}
//  </div>
//  )}

//  {/* FORM */}
//  <form onSubmit={handleEmailLogin} style={{ width: "100%", marginTop: 10 }}>
//  <input
//  type="email"
//  placeholder="Email or Username"
//  style={styles.input}
//  value={email}
//  onChange={(e) => setEmail(e.target.value)}
//  />

//  <input
//  type="password"
//  placeholder="Password"
//  style={styles.input}
//  value={password}
//  onChange={(e) => setPassword(e.target.value)}
//  />

//  <button
//  type="button"
//  style={styles.forgot}
//  onClick={() => navigate("/forgot-password")}
//  >
//  Forgot Password?
//  </button>

//  <button type="submit" style={styles.loginBtn} disabled={loading}>
//  {loading ? "Processing..." : "Log in"}
//  </button>
//  </form>

//  {/* SEPARATOR */}
//  <div style={styles.sepWrap}>
//  <div style={styles.sepLine} />
//  <span style={styles.sepText}>or continue with</span>
//  <div style={styles.sepLine} />
//  </div>

//  {/* SOCIAL BUTTONS */}
//  <div style={styles.socialRow}>
//  <button style={styles.socialBtn} onClick={handleGoogleLogin}>
//  <img src={google} style={styles.socialIcon} />
//  </button>

//  <button style={styles.socialBtn} onClick={handleGithubLogin}>
//  <img src={facebook} style={styles.socialIcon} />
//  </button>
//  </div>

//  {/* SIGN UP */}
//  <p style={styles.signupText}>
//  Don’t have an account?{" "}
//  <span
//  onClick={() => navigate("/fireregister")}
//  style={{ color: "#6b31ff", cursor: "pointer", fontWeight: 600 }}
//  >
//  Sign up
//  </span>
//  </p>

//  {/* TERMS */}
//  <p style={styles.terms}>
//  By signing up, you agree to our{" "}
//  <span style={styles.link}>Terms of service</span> & acknowledge our{" "}
//  <span style={styles.link}>Privacy Policy</span>
//  </p>
//  </div>
//  </div>
//  );
// }

// /* --------------------------------------
//  EXACT FIGMA STYLE (PERFECT MATCH)
// --------------------------------------- */
// const styles = {
//  pageBg: {
//  minHeight: "100vh",
//  display: "flex",
//  justifyContent: "center",
//  alignItems: "center",
//  background:
//  "linear-gradient(140deg, #ffffff 20%, #f4edff 60%, #fffbd9 100%)",
//  fontFamily: "Inter, sans-serif",
//  },

//  card: {
//  width: 400,
//  background: "#fff",
//  padding: "40px 45px",
//  borderRadius: "24px",
//  boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
//  textAlign: "center",
//  },

//  title: {
//  fontSize: 28,
//  fontWeight: 700,
//  color: "#6b31ff",
//  },

//  subtitle: {
//  fontSize: 14,
//  marginTop: 4,
//  marginBottom: 25,
//  color: "#6f6f6f",
//  },

//  input: {
//  width: "100%",
//  padding: "15px",
//  borderRadius: "12px",
//  border: "1px solid #e5e5e5",
//  fontSize: 14,
//  outline: "none",
//  marginBottom: 12,
//  },

//  forgot: {
//  display: "block",
//  marginLeft: "auto",
//  background: "none",
//  border: "none",
//  color: "#6A7282",
//  cursor: "pointer",
//  fontSize: 14,
//  marginBottom: 18,
//  },

//  loginBtn: {
//  width: "100%",
//  padding: "14px",
//  background: "#7c3aed",
//  color: "#fff",
//  borderRadius: "12px",
//  border: "none",
//  fontSize: 16,
//  fontWeight: 600,
//  cursor: "pointer",
//  marginBottom: 18,
//  },

//  sepWrap: {
//  display: "flex",
//  justifyContent: "center",
//  alignItems: "center",
//  marginBottom: 20,
//  gap: 12,
//  },

//  sepLine: {
//  height: 1,
//  flex: 1,
//  background: "#e0e0e0",
//  },

//  sepText: {
//  fontSize: 13,
//  color: "#888",
//  },

//  socialRow: {
//  display: "flex",
//  justifyContent: "center",
//  gap: 18,
//  marginBottom: 20,
//  },

//  socialBtn: {
//  width: 52,
//  height: 52,
//  borderRadius: "50%",
//  background: "#fff",
//  border: "1px solid #e5e5e5",
//  display: "flex",
//  justifyContent: "center",
//  alignItems: "center",
//  cursor: "pointer",
//  },

//  socialIcon: { width: 22 },

//  signupText: {
//  fontSize: 14,
//  marginTop: 5,
//  },

//  terms: {
//  fontSize: 12,
//  marginTop: 18,
//  color: "#666",
//  },

//  link: {
//  color: "#6b31ff",
//  cursor: "pointer",
//  textDecoration: "underline",
//  },

//  successMsg: {
//  background: "#eaffea",
//  padding: 10,
//  borderRadius: 10,
//  color: "#1b7c2c",
//  marginBottom: 10,
//  },

//  errorMsg: {
//  background: "#ffeaea",
//  padding: 10,
//  borderRadius: 10,
//  color: "#b81414",
//  marginBottom: 10,
//  },

//  linkBtn: {
//  color: "#6b31ff",
//  cursor: "pointer",
//  },
// };





// src/pages/fireLogin.jsx
import React, { useState, useEffect } from "react";
import google from "../assets/Google.png";
import facebook from "../assets/facebook.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firbase/Firebase";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const BACKEND_SEND_OTP =
    "https://huzzler.onrender.com/api/auth/send-otp";

  /* 🔒 LOCK SCROLL */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, []);

  const showMsg = (text, isError = true) => {
    setMsg({ text, isError });
    setTimeout(() => setMsg(null), 4000);
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const q = query(
        collection(db, "users"),
        where("email", "==", user.email)
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        navigate("/fireregister", {
          state: { email: user.email, uid: user.uid },
        });
        return;
      }

      const role = (snap.docs[0].data().role || "")
        .trim()
        .toLowerCase();

      role === "client"
        ? navigate("/client-dashbroad2")
        : navigate("/freelance-dashboard");
    } catch {
      showMsg("Google login failed");
    }
  };

  const handleGithubLogin = async () => {
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const q = query(
        collection(db, "users"),
        where("email", "==", user.email || "")
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        navigate("/fireregister", {
          state: { email: user.email || "", uid: user.uid },
        });
        return;
      }

      const role = (snap.docs[0].data().role || "")
        .trim()
        .toLowerCase();

      role === "client"
        ? navigate("/client-dashbroad2")
        : navigate("/freelance-dashboard");
    } catch {
      showMsg("GitHub login failed");
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const encodedPassword = btoa(password.trim());

      const q = query(
        collection(db, "users"),
        where("email", "==", normalizedEmail)
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        showMsg("No account found");
        return;
      }

      const user = snap.docs[0].data();
      if (user.password !== encodedPassword) {
        showMsg("Incorrect password");
        return;
      }

      await axios.post(BACKEND_SEND_OTP, {
        email: normalizedEmail,
      });

      const role = (user.role || "").trim().toLowerCase();
      role === "client"
        ? navigate("/clientloginotp", {
            state: { email: normalizedEmail },
          })
        : navigate("/freelancer-loginotp", {
            state: { email: normalizedEmail },
          });
    } catch {
      showMsg("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageBg}>
      <div style={styles.centerWrap}>
        {/* TITLE */}
        <div style={styles.header}>
          <h1 style={styles.title}>Huzzler</h1>
          <p style={styles.subtitle}>
            Create. Connect. Grow. It all starts here.
          </p>
        </div>

        {/* CARD */}
        <div style={styles.card}>
          {msg && (
            <div
              style={msg.isError ? styles.errorMsg : styles.successMsg}
            >
              {msg.text}
            </div>
          )}

          <form onSubmit={handleEmailLogin}>
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
              style={styles.forgot}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </button>

            <button
              type="submit"
              style={styles.loginBtn}
              disabled={loading}
            >
              {loading ? "Processing..." : "Log in"}
            </button>
          </form>

          <div style={styles.sepWrap}>
            <div style={styles.sepLine} />
            <span style={styles.sepText}>or continue with</span>
            <div style={styles.sepLine} />
          </div>

          <div style={styles.socialRow}>
            <button style={styles.socialBtn} onClick={handleGoogleLogin}>
              <img src={google} style={styles.socialIcon} />
            </button>
            <button style={styles.socialBtn} onClick={handleGithubLogin}>
              <img src={facebook} style={styles.socialIcon} />
            </button>
          </div>

          <p style={styles.signupText}>
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/fireregister")}
              style={styles.signupLink}
            >
              Sign up
            </span>
          </p>

          <p style={styles.terms}>
            By signing up, you agree to our{" "}
            <span style={styles.link}>Terms of Service</span> & acknowledge our{" "}
            <span style={styles.link}>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  pageBg: {
    height: "100vh",
    width: "100vw",
    display: "grid",
    placeItems: "center",
    overflow: "hidden",
    background:
      "linear-gradient(140deg,#fff 20%,#f4edff 60%,#fffbd9 100%)",
    fontFamily: "Inter, sans-serif",
  },

  /* 📱 22px padding ONLY on mobile */
  centerWrap: {
    width: "100%",
    maxWidth: 480,
    padding: "clamp(22px, 6vw, 0px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
  },

  header: { textAlign: "center" },

  title: { fontSize: 32, fontWeight: 700, color: "#6b31ff" },

  subtitle: {
    fontSize: 14,
    color: "#6f6f6f",
    marginTop: 6,
  },

  card: {
    width: "100%",
    maxWidth: 448,
    background: "#fff",
    borderRadius: 24,
    padding: 32,
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
  },

  input: {
    width: "100%",
    height: 52,
    borderRadius: 16,
    border: "0.8px solid #e5e5e5",
    padding: "12px 20px",
    marginBottom: 12,
  },

  forgot: {
    background: "none",
    border: "none",
    color: "#6A7282",
    marginLeft: "auto",
    marginBottom: 18,
    cursor: "pointer",
  },

  loginBtn: {
    width: "100%",
    height: 52,
    borderRadius: 16,
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
  },

  sepWrap: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    margin: "20px 0",
  },

  sepLine: { flex: 1, height: 1, background: "#e0e0e0" },

  sepText: { fontSize: 13, color: "#888" },

  socialRow: { display: "flex", justifyContent: "center", gap: 16 },

  socialBtn: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    border: "0.8px solid #e5e5e5",
    background: "#fff",
    cursor: "pointer",
  },

  socialIcon: { width: 22 },

  signupText: { fontSize: 16, textAlign: "center", marginTop: 18 ,fontWeight: 400,},

  signupLink: { color: "#6b31ff", fontWeight: 600, cursor: "pointer" },

  terms: { fontSize: 16, textAlign: "center", marginTop: 14 ,fontWeight: 400,

    
  },

  link: {
    color: "#6b31ff",
    textDecoration: "underline",
    cursor: "pointer",
  },

  successMsg: {
    background: "#eaffea",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },

  errorMsg: {
    background: "#ffeaea",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
};