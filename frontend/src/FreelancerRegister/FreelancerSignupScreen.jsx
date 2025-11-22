import React, { useState } from "react";
import { auth, db } from "../firbase/Firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("freelancer");
  const [loading, setLoading] = useState(false);

  const showMsg = (msg) => alert(msg);

  // --------------------- EMAIL SIGNUP ---------------------
  const handleSignup = async () => {
    if (!firstName.trim() || !email.trim() || !password.trim()) {
      return showMsg("Please fill all fields");
    }

    try {
      setLoading(true);

      // Encode password BEFORE saving
      const encodedPassword = btoa(password);

      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email,
        firstName,
        lastName,
        password: encodedPassword,   // <-- encoded password stored
        role: "freelancer",
        profileCompleted: false,
      });

      navigate("/freelancer-otp", {
        state: {
          uid: user.uid,
          email,
          firstName,
          lastName,
          password: encodedPassword,  // send encoded version
          role: "freelancer",
        },
      });

    } catch (err) {
      showMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --------------------- GOOGLE LOGIN ---------------------
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const snap = await getDocs(q);

      if (snap.empty) {
        showMsg("No account found for this Google user.");
        return;
      }

      navigate("/freelance-dashboard/freelanceHome");

    } catch (err) {
      showMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 30, maxWidth: 400, margin: "auto" }}>
      <h2>Create Freelancer Account</h2>

      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      /><br />

      <input
        type="text"
        placeholder="Last Name (optional)"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      /><br />

      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />

      <input
        type="password"
        placeholder="Password (min 6 chars)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />

      <button onClick={handleSignup} disabled={loading}>
        {loading ? "Creating..." : "Sign Up"}
      </button>
      <br /><br />

      <button onClick={handleGoogleLogin} disabled={loading}>
        {loading ? "Loading..." : "Continue with Google"}
      </button>
    </div>
  );
};

export default Signup;
