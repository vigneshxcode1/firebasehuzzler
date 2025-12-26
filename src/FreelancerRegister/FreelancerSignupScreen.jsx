

// import React, { useState } from "react";
// import { auth, db } from "../firbase/Firebase";
// import {
//  createUserWithEmailAndPassword,
//  GoogleAuthProvider,
//  signInWithPopup,
//  GithubAuthProvider,
//  fetchSignInMethodsForEmail, 
//  linkWithCredential 
// } from "firebase/auth";
// import {
//  doc,
//  setDoc,
//  collection,
//  query,
//  where,
//  getDocs,
//  getDoc,
// } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import google from "../assets/Google.png";
// import facebook from "../assets/facebook.png";

// const Signup = () => {
//  const navigate = useNavigate();

//  const [firstName, setFirstName] = useState("");
//  const [lastName, setLastName] = useState("");
//  const [email, setEmail] = useState("");
//  const [password, setPassword] = useState("");
//  const [role] = useState("freelancer");
//  const [loading, setLoading] = useState(false);

//  const showMsg = (msg) => alert(msg);

//  // --------------------- EMAIL SIGNUP ---------------------
//  const handleSignup = async () => {
//  if (!firstName.trim() || !email.trim() || !password.trim()) {
//  return showMsg("Please fill all fields");
//  }

//  try {
//  setLoading(true);

//  const encodedPassword = btoa(password);

//  // 1️⃣ Create Firebase User
//  const result = await createUserWithEmailAndPassword(
//  auth,
//  email,
//  password
//  );
//  const user = result.user;

//  // 2️⃣ Save basic user data in Firestore
//  await setDoc(
//  doc(db, "users", user.uid),
//  {
//  uid: user.uid,
//  email,
//  firstName,
//  lastName,
//  password: encodedPassword,
//  role: "freelancer",
//  profileCompleted: false,
//  },
//  { merge: false }
//  );

//  // 3️⃣ SEND OTP TO EMAIL 🔥🔥🔥
//  await axios.post("https://huzzler.onrender.com/api/auth/send-otp", {
//  email: email.toLowerCase(),
//  });

//  // 4️⃣ Store temp data for OTP screen
//  localStorage.setItem(
//  "freelancerOtpUser",
//  JSON.stringify({
//  uid: user.uid,
//  email,
//  firstName,
//  lastName,
//  password: encodedPassword,
//  role: "freelancer",
//  })
//  );

//  // 5️⃣ Navigate to OTP screen
//  navigate("/freelancer-otp", {
//  state: {
//  uid: user.uid,
//  email,
//  firstName,
//  lastName,
//  password: encodedPassword,
//  role: "freelancer",
//  },
//  });
//  } catch (err) {
//  showMsg(err.message);
//  } finally {
//  setLoading(false);
//  }
//  };

 
//  // --------------------- GOOGLE LOGIN ---------------------
// const handleGoogleRegister = async () => {
//  try {
//  setLoading(true);

//  const provider = new GoogleAuthProvider();
//  const result = await signInWithPopup(auth, provider);
//  const user = result.user;

//  // STORE EMAIL IN STATE 🔥
//  setEmail(user.email);

//  // Firestore reference
//  const userRef = doc(db, "users", user.uid);
//  const userSnap = await getDoc(userRef);

//  if (userSnap.exists()) {
//  showMsg("Account already exists. Please login instead.");
//  return navigate("/firelogin");
//  }

//  // Extract name correctly
//  const fullName = user.displayName || "";
//  const [firstName = "", lastName = ""] = fullName.split(" ");

//  // Save Google user
//  await setDoc(userRef, {
//  uid: user.uid,
//  email: user.email || "",
//  firstName: firstName,
//  lastName: lastName,
//  provider: "google",
//  role: "freelancer",
//  profileCompleted: false,
//  createdAt: Date.now(),
//  });

//  // SEND UID + EMAIL TO NEXT SCREEN
//  navigate("/freelancer-details", {
//  state: {
//  uid: user.uid,
//  email: user.email,
//  firstName,
//  lastName,
//  },
//  });

//  } catch (err) {
//  showMsg(err.message);
//  } finally {
//  setLoading(false);
//  }
// };





// const handleGithubAuth = async () => {
//  try {
//  setLoading(true);

//  const provider = new GithubAuthProvider();
//  const result = await signInWithPopup(auth, provider);
//  const user = result.user;

//  // Check if user exists in Firestore
//  const q = query(collection(db, "users"), where("email", "==", user.email));
//  const snap = await getDocs(q);

//  if (snap.empty) {
//  // New user → create Firestore record
//  const fullName = user.displayName || "";
//  const [firstName = "", lastName = ""] = fullName.split(" ");

//  const userRef = doc(db, "users", user.uid);
//  await setDoc(userRef, {
//  uid: user.uid,
//  email: user.email,
//  firstName,
//  lastName,
//  role: "freelancer",
//  provider: "github",
//  profileCompleted: false,
//  createdAt: Date.now(),
//  });

//  // Navigate to profile completion
//  return navigate("/freelancer-details", {
//  state: { uid: user.uid, email: user.email, firstName, lastName },
//  });
//  }

//  // Existing user
//  const userData = snap.docs[0].data();
//  const role = (userData.role || "").toLowerCase();

//  if (role === "client") {
//  navigate("/client-dashbroad2", { state: { uid: user.uid } });
//  } else {
//  navigate("/freelance-dashboard", { state: { uid: user.uid } });
//  }

//  } catch (err) {
//  if (err.code === "auth/account-exists-with-different-credential") {
//  const pendingCred = GithubAuthProvider.credentialFromError(err);
//  const email = err.customData.email;

//  // Find existing sign-in methods for this email
//  const methods = await fetchSignInMethodsForEmail(auth, email);

//  if (methods.includes("google.com")) {
//  showMsg("You already signed up with Google. Sign in with Google first to link GitHub.");
//  // Optional: ask user to sign in with Google and then link
//  } else if (methods.includes("password")) {
//  showMsg("You already signed up with email/password. Sign in first to link GitHub.");
//  // Optional: ask user to log in with email/password then link
//  }

//  // Store pending GitHub credential for later linking
//  localStorage.setItem("pendingGithubCred", JSON.stringify(pendingCred));
//  } else {
//  console.error("GitHub auth error:", err);
//  showMsg("GitHub login/signup failed: " + err.message);
//  }
//  } finally {
//  setLoading(false);
//  }
// };
//  // --------------------- UI ---------------------
//  const styles = {
//  page: {
//  minHeight: "100vh",
//  width: "100%",
//  display: "flex",
//  alignItems: "center",
//  justifyContent: "center",
//  background:
//  "radial-gradient(circle at 0% 70%, #fff7c7 0, #fffdef 35%, #f5edff 65%, #f1eaff 100%)",
//  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI'",
//  },
//  cardWrapper: {
//  maxWidth: 440,
//  width: "100%",
//  padding: "13px",
//  },
//  card: {
//  width: "100%",
//  borderRadius: 32,
//  padding: "32px 40px 28px",
//  background: "rgba(255,255,255,0.96)",
//  boxShadow: "0 22px 55px rgba(15,23,42,0.18)",
//  backdropFilter: "blur(18px)",
//  paddingLeft:22,
//  paddingRight:60,
//  },
//  headerRow: {
//  display: "flex",
//  alignItems: "center",
//  gap: 10,
//  marginBottom: 24,
//  },
//  backIcon: {
//  width: 38,
//  height: 32,
//  borderRadius: "999px",
//  border: "1px solid #e5e7eb",
//  display: "flex",
//  alignItems: "center",
//  justifyContent: "center",
//  cursor: "pointer",
//  fontSize: 16,
//  },
//  headerTitle: {
//  fontSize: 14,
//  fontWeight: 600,
//  color: "#364153",
//  textTransform: "lowercase",
//  },
//  subtitle: {
//  fontSize: 15,
//  color: "#000000",
//  marginBottom: 22,
//  },
//  formGroup: {
//  display: "flex",
//  flexDirection: "column",
//  gap: 14,
//  marginBottom: 18,
//  },
//  input: {
//  width: "100%",
//  borderRadius: 999,
//  padding: "12px 18px",
//  border: "1px solid #e5e7eb",
//  fontSize: 14,
//  outline: "none",
//  background: "#FFFFFFCC",
//  },
//  checkboxRow: {
//  display: "flex",
//  alignItems: "flex-start",
//  gap: 10,
//  fontSize: 12,
//  color: "#6b7280",
//  margin: "4px 0 18px",
//  },
//  checkbox: {
//  width: 18,
//  height: 18,
//  borderRadius: 6,
//  border: "2px solid #7C3CFF",
//  cursor: "pointer",
//  },
//  link: {
//  color: "#7C3CFF",
//  fontWeight: 500,
//  textDecoration: "none",
//  cursor: "pointer",
//  },
//  primaryButton: {
//  width: "100%",
//  borderRadius: 999,
//  border: "none",
//  padding: "12px 18px",
//  fontSize: 14,
//  fontWeight: 600,
//  background:
//  "linear-gradient(90deg, #7C3CFF 0%, #7C3CFF 45%, #7C3CFF 100%)",
//  color: "#ffffff",
//  cursor: "pointer",
//  marginTop: 4,
//  },
//  primaryButtonDisabled: {
//  opacity: 0.8,
//  cursor: "not-allowed",
//  boxShadow: "none",
//  },
//  dividerRow: {
//  display: "flex",
//  alignItems: "center",
//  gap: 12,
//  margin: "18px 0 14px",
//  fontSize: 12,
//  color: "#9ca3af",
//  },
//  hr: {
//  flex: 1,
//  height: 1,
//  background: "#e5e7eb",
//  },
//  socialRow: {
//  display: "flex",
//  alignItems: "center",
//  justifyContent: "center",
//  gap: 18,
//  marginTop: 8,
//  marginBottom: 8,
//  },
//  socialBtn: {
//  width: 52,
//  height: 52,
//  borderRadius: "999px",
//  border: "none",
//  background: "#ffffff",
//  display: "flex",
//  alignItems: "center",
//  justifyContent: "center",
//  boxShadow: "0 12px 28px rgba(15,23,42,0.15)",
//  cursor: "pointer",
//  },
//  socialImg: {
//  width: 24,
//  height: 24,
//  },
//  bottomTextWrapper: {
//  textAlign: "center",
//  marginTop: 20,
//  fontSize: 13,
//  color: "#4b5563",
//  },
//  loginHighlight: {
//  display: "inline-flex",
//  alignItems: "center",
//  justifyContent: "center",
//  color:"#000000",
//  padding: "11px 22px",
//  marginLeft: 14,
//  borderRadius: 999,
//  background: "#FDFD96",
//  fontWeight: 670,
//  cursor: "pointer",
//  },
//  };

//  return (
//  <div style={styles.page}>
//  <div style={styles.cardWrapper}>
//  <div style={styles.headerRow}>
//  <div
//  style={styles.backIcon}
//  onClick={() => navigate(-1)}
//  aria-label="Go back"
//  >
//  ←
//  </div>
//  <span style={styles.headerTitle}>sign up as freelancer</span>
//  </div>
//  <div style={styles.card}>
//  {/* top header */}
//  <p style={styles.subtitle}>
//  Let&apos;s get to know you. We promise it&apos;ll be quick.
//  </p>

//  {/* form */}
//  <div style={styles.formGroup}>
//  <input
//  style={styles.input}
//  type="text"
//  placeholder="First name"
//  value={firstName}
//  onChange={(e) => setFirstName(e.target.value)}
//  />
//  <input
//  style={styles.input}
//  type="text"
//  placeholder="Last name"
//  value={lastName}
//  onChange={(e) => setLastName(e.target.value)}
//  />
//  <input
//  style={styles.input}
//  type="email"
//  placeholder="Email Address"
//  value={email}
//  onChange={(e) => setEmail(e.target.value)}
//  />
//  <input
//  style={styles.input}
//  type="password"
//  placeholder="Enter Your Password"
//  value={password}
//  onChange={(e) => setPassword(e.target.value)}
//  />
//  </div>

//  {/* terms */}
//  <div style={styles.checkboxRow}>
//  <input
//  type="checkbox"
//  style={styles.checkbox}
//  // only UI – validation is handled already in backend logic
//  />
//  <span>
//  By signing up, you agree to our{" "}
//  <span style={styles.link}>Terms of service</span> &amp;
//  acknowledge our <span style={styles.link}>Privacy Policy</span>
//  </span>
//  </div>

//  {/* primary button */}
//  <button
//  style={{
//  ...styles.primaryButton,
//  ...(loading ? styles.primaryButtonDisabled : {}),
//  }}
//  onClick={handleSignup}
//  disabled={loading}
//  >
//  {loading ? "Creating..." : "CONTINUE"}
//  </button>

//  {/* divider */}
//  <div style={styles.dividerRow}>
//  <div style={styles.hr} />
//  <span>or Sign up with</span>
//  <div style={styles.hr} />
//  </div>

//  {/* social buttons */}
//  <div style={styles.socialRow}>
//  <button
//  style={styles.socialBtn}
//  onClick={handleGoogleRegister}
//  disabled={loading}
//  >
//  <img src={google} alt="Google" style={styles.socialImg} />
//  </button>

//  <button
//  style={styles.socialBtn} 
//  onClick={handleGithubAuth}
//  disabled={loading}>
//  <img src={facebook} alt="github" style={styles.socialImg} />
//  </button>
//  </div>
//  </div>

//  {/* bottom login text */}
//  <div style={styles.bottomTextWrapper}>
//  Have an Account?
//  <span
//  style={styles.loginHighlight}
//  onClick={() => navigate("/firelogin")}
//  >
//  log in :
//  </span>
//  </div>
//  </div>
//  </div>
//  );
// };

// export default Signup;



// export default Signup;
import React, { useState } from "react";
import { auth, db } from "../firbase/Firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { doc, setDoc, collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import google from "../assets/Google.png";
import facebook from "../assets/facebook.png";

const Signup = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("freelancer");
  const [loading, setLoading] = useState(false);

  const showMsg = (msg) => alert(msg);

  // EMAIL SIGNUP
  const handleSignup = async () => {
    if (!firstName.trim() || !email.trim() || !password.trim()) {
      return showMsg("Please fill all fields");
    }

    try {
      setLoading(true);

      const encodedPassword = btoa(password);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email,
          firstName,
          lastName,
          password: encodedPassword,
          role: "freelancer",
          profileCompleted: false,
        },
        { merge: false }
      );

      await axios.post("https://huzzler.onrender.com/api/auth/send-otp", {
        email: email.toLowerCase(),
      });

      localStorage.setItem(
        "freelancerOtpUser",
        JSON.stringify({
          uid: user.uid,
          email,
          firstName,
          lastName,
          password: encodedPassword,
          role: "freelancer",
        })
      );

      navigate("/freelancer-otp", {
        state: { uid: user.uid, email, firstName, lastName, password: encodedPassword, role: "freelancer" },
      });
    } catch (err) {
      showMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // GOOGLE SIGNUP
  const handleGoogleRegister = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      setEmail(user.email);
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        showMsg("Account already exists. Please login instead.");
        return navigate("/firelogin");
      }

      const fullName = user.displayName || "";
      const [firstName = "", lastName = ""] = fullName.split(" ");

      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || "",
        firstName,
        lastName,
        provider: "google",
        role: "freelancer",
        profileCompleted: false,
        createdAt: Date.now(),
      });

      navigate("/freelancer-details", { state: { uid: user.uid, email: user.email, firstName, lastName } });
    } catch (err) {
      showMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // GITHUB SIGNUP
  const handleGithubAuth = async () => {
    try {
      setLoading(true);
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const q = query(collection(db, "users"), where("email", "==", user.email));
      const snap = await getDocs(q);

      if (snap.empty) {
        const fullName = user.displayName || "";
        const [firstName = "", lastName = ""] = fullName.split(" ");
        const userRef = doc(db, "users", user.uid);

        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          firstName,
          lastName,
          role: "freelancer",
          provider: "github",
          profileCompleted: false,
          createdAt: Date.now(),
        });

        return navigate("/freelancer-details", { state: { uid: user.uid, email: user.email, firstName, lastName } });
      }

      const userData = snap.docs[0].data();
      const role = (userData.role || "").toLowerCase();
      if (role === "client") {
        navigate("/client-dashbroad2", { state: { uid: user.uid } });
      } else {
        navigate("/freelance-dashboard", { state: { uid: user.uid } });
      }
    } catch (err) {
      if (err.code === "auth/account-exists-with-different-credential") {
        const pendingCred = GithubAuthProvider.credentialFromError(err);
        const email = err.customData.email;
        const methods = await fetchSignInMethodsForEmail(auth, email);

        if (methods.includes("google.com")) {
          showMsg("You already signed up with Google. Sign in with Google first to link GitHub.");
        } else if (methods.includes("password")) {
          showMsg("You already signed up with email/password. Sign in first to link GitHub.");
        }

        localStorage.setItem("pendingGithubCred", JSON.stringify(pendingCred));
      } else {
        console.error("GitHub auth error:", err);
        showMsg("GitHub login/signup failed: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // RESPONSIVE STYLES
  const styles = {
    page: {
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "radial-gradient(circle at 0% 70%, #fff7c7 0, #fffdef 35%, #f5edff 65%, #f1eaff 100%)",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI'",
      padding: "10px",
      boxSizing: "border-box",
    },
    cardWrapper: {
      maxWidth: 440,
      width: "100%",
      padding: "13px",
    },
    card: {
      width: "100%",
      borderRadius: 32,
      padding: "32px 40px 28px",
      background: "rgba(255,255,255,0.96)",
      boxShadow: "0 22px 55px rgba(15,23,42,0.18)",
      backdropFilter: "blur(18px)",
      paddingLeft: 22,
      paddingRight: 22,
      boxSizing: "border-box",
    },
    headerRow: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 24,
      flexWrap: "wrap",
    },
    backIcon: {
      width: 38,
      height: 32,
      borderRadius: "999px",
      border: "1px solid #e5e7eb",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontSize: 16,
    },
    headerTitle: {
      fontSize: 14,
      fontWeight: 600,
      color: "#364153",
      textTransform: "lowercase",
    },
    subtitle: {
      fontSize: 15,
      color: "#000000",
      marginBottom: 22,
      wordBreak: "break-word",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: 14,
      marginBottom: 18,
    },
    input: {
      width: "100%",
      borderRadius: 999,
      padding: "12px 18px",
      border: "1px solid #e5e7eb",
      fontSize: 14,
      outline: "none",
      background: "#FFFFFFCC",
      boxSizing: "border-box",
    },
    checkboxRow: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontSize: 12,
      color: "#6b7280",
      margin: "4px 0 18px",
      flexWrap: "nowrap",
    },
    checkbox: {
      width: 18,
      height: 18,
      borderRadius: 6,
      border: "2px solid #7C3CFF",
      cursor: "pointer",
      flexShrink: 0,
    },
    link: {
      color: "#7C3CFF",
      fontWeight: 500,
      textDecoration: "none",
      cursor: "pointer",
    },
    primaryButton: {
      width: "100%",
      borderRadius: 999,
      border: "none",
      padding: "12px 18px",
      fontSize: 14,
      fontWeight: 600,
      background: "linear-gradient(90deg, #7C3CFF 0%, #7C3CFF 45%, #7C3CFF 100%)",
      color: "#ffffff",
      cursor: "pointer",
      marginTop: 4,
    },
    primaryButtonDisabled: {
      opacity: 0.8,
      cursor: "not-allowed",
      boxShadow: "none",
    },
    dividerRow: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      margin: "18px 0 14px",
      fontSize: 12,
      color: "#9ca3af",
      flexWrap: "wrap",
    },
    hr: {
      flex: 1,
      height: 1,
      background: "#e5e7eb",
    },
    socialRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 18,
      marginTop: 8,
      marginBottom: 8,
      flexWrap: "wrap",
    },
    socialBtn: {
      width: 52,
      height: 52,
      borderRadius: "999px",
      border: "none",
      background: "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 12px 28px rgba(15,23,42,0.15)",
      cursor: "pointer",
    },
    socialImg: {
      width: 24,
      height: 24,
    },
    bottomTextWrapper: {
      textAlign: "center",
      marginTop: 20,
      fontSize: 13,
      color: "#4b5563",
      flexWrap: "wrap",
    },
    loginHighlight: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#000000",
      padding: "11px 22px",
      marginLeft: 14,
      borderRadius: 999,
      background: "#FDFD96",
      fontWeight: 670,
      cursor: "pointer",
      marginTop: "10px",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.cardWrapper}>
        <div style={styles.headerRow}>
          <div style={styles.backIcon} onClick={() => navigate(-1)} aria-label="Go back">
            ←
          </div>
          <span style={styles.headerTitle}>sign up as freelancer</span>
        </div>
        <div style={styles.card}>
          <p style={styles.subtitle}>Let's get to know you. We promise it'll be quick.</p>

          <div style={styles.formGroup}>
            <input style={styles.input} type="text" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <input style={styles.input} type="text" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <input style={styles.input} type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input style={styles.input} type="password" placeholder="Enter Your Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div style={styles.checkboxRow}>
            <input type="checkbox" style={styles.checkbox} />
            <span>
              By signing up, you agree to our <span style={styles.link}>Terms of service</span> &amp; acknowledge our <span style={styles.link}>Privacy Policy</span>
            </span>
          </div>

          <button style={{ ...styles.primaryButton, ...(loading ? styles.primaryButtonDisabled : {}) }} onClick={handleSignup} disabled={loading}>
            {loading ? "Creating..." : "CONTINUE"}
          </button>

          <div style={styles.dividerRow}>
            <div style={styles.hr} />
            <span>or Sign up with</span>
            <div style={styles.hr} />
          </div>

          <div style={styles.socialRow}>
            <button style={styles.socialBtn} onClick={handleGoogleRegister} disabled={loading}>
              <img src={google} alt="Google" style={styles.socialImg} />
            </button>

            <button style={styles.socialBtn} onClick={handleGithubAuth} disabled={loading}>
              <img src={facebook} alt="github" style={styles.socialImg} />
            </button>
          </div>
        </div>

        <div style={styles.bottomTextWrapper}>
          Have an Account?
          <span style={styles.loginHighlight} onClick={() => navigate("/firelogin")}>
            log in :
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
