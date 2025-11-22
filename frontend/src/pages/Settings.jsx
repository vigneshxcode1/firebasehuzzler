// AccountDetails.jsx
// NOTE: Firebase config / initializeApp in separate file (e.g. src/firebase/Firebase.js)
// Ithu la config paste pannadha. Just import { db, auth } from that file.

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

// 🔹 UPDATE THIS PATH ACCORDING TO YOUR PROJECT STRUCTURE
// Example: "../../firebase/Firebase" or "../firebase/Firebase"
import { db } from "../firbase/Firebase"; // <-- CHANGE PATH IF NEEDED

// ----------------------- Styles (Flutter UI style) ----------------------- //

const styles = {
  page: {
    backgroundColor: "#FFFFFF",
    minHeight: "100vh",
    fontFamily:
      "'Rubik', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  scroll: {
    maxWidth: 600,
    margin: "0 auto",
    paddingBottom: 48,
  },
  headerContainer: {
    width: "100%",
    backgroundColor: "#FDFD96",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    boxSizing: "border-box",
  },
  headerInner: {
    padding: 16,
    paddingTop: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 500,
  },
  headerNotifBtn: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    padding: 4,
    cursor: "pointer",
  },
  notificationIconWrapper: {
    position: "relative",
    padding: 4,
    borderRadius: 12,
  },
  notificationDot: {
    position: "absolute",
    right: -2,
    top: -2,
    minWidth: 16,
    minHeight: 16,
    borderRadius: 8,
    backgroundColor: "#E53935",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: 600,
    padding: 2,
  },
  sectionContainerOuter: {
    padding: "0 16px",
    marginTop: 24,
  },
  sectionContainerInner: {
    padding: 16,
    backgroundColor: "#F9F9F9",
    borderRadius: 20,
    border: "1px solid #C5C5C5",
    boxShadow: "0 2px 4px rgba(0,0,0,0.12)",
  },
  sectionTitle: {
    fontWeight: 600,
    fontSize: 16,
    marginBottom: 12,
  },
  label: {
    fontWeight: 600,
    fontSize: 14,
  },
  input: {
    width: "100%",
    borderRadius: 10,
    border: "1px solid #BDBDBD",
    padding: "10px 12px",
    fontSize: 14,
    marginTop: 8,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  inputDisabled: {
    backgroundColor: "#F5F5F5",
    color: "#424242",
    cursor: "not-allowed",
  },
  row: {
    display: "flex",
    gap: 10,
    marginTop: 10,
  },
  flex1: { flex: 1 },
  saveBtnWrapper: {
    marginTop: 8,
    display: "flex",
    justifyContent: "flex-start",
  },
  saveBtn: {
    backgroundColor: "#FFFF99", // light yellow
    color: "#000000",
    borderRadius: 50,
    border: "1px solid #D0D0D0",
    padding: "10px 28px",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    outline: "none",
  },
  saveBtnDisabled: {
    opacity: 0.6,
    cursor: "default",
  },
  passwordInputWrapper: {
    position: "relative",
    marginTop: 8,
  },
  passwordInput: {
    width: "100%",
    borderRadius: 10,
    border: "1px solid #BDBDBD",
    padding: "10px 40px 10px 12px",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  passwordToggle: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: 14,
    color: "#616161",
  },
  deleteBtnWrapper: {
    padding: "0 16px",
    marginTop: 20,
  },
  deleteBtn: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    color: "#DB2626",
    border: "1px solid #DB2626",
    padding: "14px 24px",
    borderRadius: 8,
    fontWeight: 500,
    cursor: "pointer",
    outline: "none",
    fontSize: 15,
  },
  deleteBtnDisabled: {
    opacity: 0.6,
    cursor: "default",
  },
  fullScreenLoader: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    fontSize: 16,
  },
  spinner: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    border: "4px solid #E0E0E0",
    borderTopColor: "#000000",
    animation: "spin 1s linear infinite",
  },
  toast: {
    position: "fixed",
    bottom: 24,
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#323232",
    color: "#FFFFFF",
    padding: "10px 16px",
    borderRadius: 8,
    fontSize: 14,
    zIndex: 2000,
    maxWidth: "80%",
    textAlign: "center",
  },
  // Notification Modal
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1500,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingTop: "10vh",
  },
  modal: {
    width: "92%",
    maxWidth: 420,
    maxHeight: "70vh",
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    display: "flex",
    flexDirection: "column",
  },
  modalHeader: {
    padding: "12px 16px",
    background: "#FDFD96",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  modalHeaderIcon: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    fontSize: 18,
  },
  modalHeaderTextWrap: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: 700,
  },
  modalHeaderSubtitle: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },
  modalHeaderActions: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  clearAllBtn: {
    borderRadius: 12,
    border: "none",
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: "6px 10px",
    fontSize: 12,
    cursor: "pointer",
  },
  closeModalBtn: {
    borderRadius: 12,
    border: "none",
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 6,
    fontSize: 16,
    cursor: "pointer",
  },
  modalBody: {
    flex: 1,
    overflowY: "auto",
    padding: "8px 0 12px",
  },
  emptyStateWrap: {
    padding: 16,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: 12,
  },
  emptyStateIconWrap: {
    padding: 20,
    borderRadius: 50,
    backgroundColor: "#F5F5F5",
  },
  emptyStateIcon: {
    fontSize: 28,
    color: "#BDBDBD",
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#616161",
  },
  emptyStateSubtitle: {
    fontSize: 13,
    color: "#9E9E9E",
    lineHeight: 1.4,
    whiteSpace: "pre-line",
  },
  notifList: {
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  notifItemOuter: {
    padding: "6px 16px",
  },
  notifItemCard: {
    borderRadius: 16,
    backgroundColor: "#FAFAFA",
    border: "1px solid #EEEEEE",
    padding: 12,
    display: "flex",
    gap: 10,
  },
  notifIconWrap: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#FDFD96",
    fontSize: 16,
  },
  notifTextWrap: {
    flex: 1,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "#212121",
  },
  notifBody: {
    fontSize: 13,
    color: "#616161",
    marginTop: 4,
  },
  notifFooter: {
    marginTop: 8,
    display: "flex",
    alignItems: "center",
    fontSize: 12,
    color: "#9E9E9E",
  },
  notifRemoveBtn: {
    marginLeft: "auto",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: 14,
    color: "#BDBDBD",
  },
};

// small CSS animation (inject once)
const injectSpinKeyframes = () => {
  if (document.getElementById("account-details-spin-style")) return;
  const style = document.createElement("style");
  style.id = "account-details-spin-style";
  style.innerHTML = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
};

// ----------------------- Main Component ----------------------- //

export default function AccountDetails() {
  const navigate = useNavigate();
  const auth = getAuth();

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [stateRegion, setStateRegion] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [obscureNewPassword, setObscureNewPassword] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // notification UI state
  const [notifications, setNotifications] = useState([]);
  const [showNotifModal, setShowNotifModal] = useState(false);

  // toast
  const [toast, setToast] = useState("");

  useEffect(() => {
    injectSpinKeyframes();
  }, []);

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          // if not logged in, go login
          navigate("/login");
          return;
        }

        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const data = snap.data() || {};

          const fName =
            data.first_name ?? data.firstName ?? "";
          const lName =
            data.last_name ?? data.lastName ?? "";
          const userEmail = data.email ?? user.email ?? "";
          const userPhone = data.phone ?? "";

          setFirstName(String(fName));
          setLastName(String(lName));
          setEmail(String(userEmail));
          setPhone(String(userPhone));

          setAddressLine1(String