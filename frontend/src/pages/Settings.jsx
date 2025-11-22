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
          navigate("/firelogin");
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

          setAddressLine1(String(data.addressLine1 ?? ""));
          setAddressLine2(String(data.addressLine2 ?? ""));
          setCity(String(data.city ?? ""));
          setZip(String(data.zip ?? ""));
          setStateRegion(String(data.state ?? ""));

          // Example notifications initial
          setNotifications((prev) =>
            prev.length === 0
              ? [
                  {
                    id: "welcome",
                    title: "Welcome to Huzzler",
                    body: "Your account details are loaded successfully.",
                  },
                ]
              : prev
          );
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        showToast("Error fetching user data");
      }
    };

    loadUserData();
  }, [auth, navigate]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast("");
    }, 4000);
  };

  // ----------------------- Update helpers ----------------------- //

  const updateField = async (field, value) => {
    if (!value.trim()) {
      showToast("Field cannot be empty");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        showToast("User not logged in");
        return;
      }

      setIsLoading(true);
      await updateDoc(doc(db, "users", user.uid), {
        [field]: value.trim(),
      });
      showToast(`${field} updated successfully`);
    } catch (err) {
      console.error("updateField error:", err);
      showToast(`Error updating ${field}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmailOnlyFirestore = async () => {
    const newEmail = email.trim();

    if (!newEmail) {
      showToast("Email cannot be empty");
      return;
    }

    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(newEmail)) {
      showToast("Please enter a valid email address");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        showToast("User not logged in");
        return;
      }

      setIsLoading(true);
      await updateDoc(doc(db, "users", user.uid), {
        email: newEmail,
        emailUpdated: serverTimestamp(),
      });

      showToast("Email updated successfully");
    } catch (err) {
      console.error("updateEmail error:", err);
      showToast("Error updating email");
    } finally {
      setIsLoading(false);
    }
  };

  const updateAddress = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        showToast("User not logged in");
        return;
      }

      setIsLoading(true);
      await updateDoc(doc(db, "users", user.uid), {
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim(),
        city: city.trim(),
        zip: zip.trim(),
        state: stateRegion.trim(),
        addressUpdated: serverTimestamp(),
      });
      showToast("Address updated successfully");
    } catch (err) {
      console.error("updateAddress error:", err);
      showToast("Error updating address");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePhone = async () => {
    const phoneVal = phone.trim();
    if (!phoneVal) {
      showToast("Phone number cannot be empty");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        showToast("User not logged in");
        return;
      }

      setIsLoading(true);
      await updateDoc(doc(db, "users", user.uid), {
        phone: phoneVal,
        phoneUpdated: serverTimestamp(),
      });
      showToast("Phone number updated successfully");
    } catch (err) {
      console.error("updatePhone error:", err);
      showToast("Error updating phone");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async () => {
    const user = auth.currentUser;
    const pwd = newPassword.trim();

    if (!user) {
      showToast("User not logged in");
      return;
    }

    if (!pwd) {
      showToast("Please enter a password");
      return;
    }

    if (pwd.length < 6) {
      showToast("Password must be at least 6 characters");
      return;
    }

    try {
      setIsUpdatingPassword(true);
      await user.updatePassword(pwd);

      await updateDoc(doc(db, "users", user.uid), {
        password: pwd,
        passwordUpdated: serverTimestamp(),
      });

      showToast("Password updated successfully ✅");
    } catch (err) {
      console.error("updatePassword error:", err);
      if (err.code === "auth/weak-password") {
        showToast("The password is too weak");
      } else if (err.code === "auth/requires-recent-login") {
        showToast("Please log out and log in again to update password");
      } else {
        showToast("Error updating password");
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // ----------------------- Delete Account Flow ----------------------- //

  const deleteAccount = async () => {
    if (isLoading) {
      showToast("Please wait for current operation to complete");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      showToast("User not logged in");
      return;
    }

    const confirmMsg =
      "Are you sure you want to permanently delete your account?";
    const confirmed = window.confirm(confirmMsg);
    if (!confirmed) return;

    try {
      setIsLoading(true);

      // If email/password provider, re-auth
      if (user.providerData.some((p) => p.providerId === "password")) {
        const pwd = window.prompt("Please enter your current password:");
        if (!pwd) {
          showToast("Account deletion cancelled");
          setIsLoading(false);
          return;
        }

        const credential = EmailAuthProvider.credential(
          user.email || "",
          pwd.trim()
        );
        await reauthenticateWithCredential(user, credential);
      }

      await deleteDoc(doc(db, "users", user.uid));
      await user.delete();

      showToast("Account deleted permanently");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 800);
    } catch (err) {
      console.error("deleteAccount error:", err);

      if (err.code === "auth/wrong-password") {
        showToast("Incorrect password. Account deletion failed.");
      } else if (err.code === "auth/requires-recent-login") {
        showToast("Please log out and log in again to delete your account.");
      } else if (err.code === "auth/user-not-found") {
        showToast("User not found. Please log in again.");
      } else {
        showToast("Error deleting account");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------- Notification UI ----------------------- //

  const notifCount = notifications.length;
  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleRemoveNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // ----------------------- Render helpers ----------------------- //

  const renderSaveButton = (onClick, loading) => (
    <div style={styles.saveBtnWrapper}>
      <button
        type="button"
        style={{
          ...styles.saveBtn,
          ...(loading ? styles.saveBtnDisabled : {}),
        }}
        onClick={loading ? undefined : onClick}
        disabled={loading}
      >
        {loading ? (
          <span style={{ fontSize: 14 }}>Saving...</span>
        ) : (
          "Save"
        )}
      </button>
    </div>
  );

  const renderLoadingScreen = () => (
    <div style={styles.fullScreenLoader}>
      <div style={styles.spinner}></div>
      <div>Processing...</div>
    </div>
  );

  // ----------------------- JSX ----------------------- //

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.headerContainer}>
        <div style={styles.headerInner}>
          <div style={styles.headerTitle}>Account Details</div>

          {/* Notification Icon */}
          <button
            type="button"
            style={styles.headerNotifBtn}
            onClick={() => setShowNotifModal(true)}
          >
            <div style={styles.notificationIconWrapper}>
              {/* Simple bell icon using emoji */}
              <span role="img" aria-label="bell">
                🔔
              </span>
              {notifCount > 0 && (
                <div style={styles.notificationDot}>
                  {notifCount > 9 ? "9+" : notifCount}
                </div>
              )}
            </div>
          </button>
        </div>
      </div>

      <div style={styles.scroll}>
        {isLoading ? (
          renderLoadingScreen()
        ) : (
          <>
            {/* PERSONAL DETAILS SECTION */}
            <div style={styles.sectionContainerOuter}>
              <div style={styles.sectionContainerInner}>
                {/* First Name */}
                <div>
                  <div style={styles.label}>First Name</div>
                  <input
                    style={styles.input}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter First Name"
                    disabled={isLoading}
                  />
                  {renderSaveButton(
                    () => updateField("firstName", firstName),
                    isLoading
                  )}
                </div>

                {/* Spacer */}
                <div style={{ height: 20 }} />

                {/* Last Name */}
                <div>
                  <div style={styles.label}>Last Name</div>
                  <input
                    style={styles.input}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter Last Name"
                    disabled={isLoading}
                  />
                  {renderSaveButton(
                    () => updateField("lastName", lastName),
                    isLoading
                  )}
                </div>

                {/* Spacer */}
                <div style={{ height: 20 }} />

                {/* Email */}
                <div>
                  <div style={styles.label}>Email Address</div>
                  <input
                    style={{
                      ...styles.input,
                      ...styles.inputDisabled,
                    }}
                    value={email}
                    readOnly
                    placeholder="Enter email"
                  />
                  {/* NOTE: Flutter version updates email only in Firestore.
                      If you want to allow changing, enable below save button. */}
                  {/* {renderSaveButton(updateEmailOnlyFirestore, isLoading)} */}
                </div>

                {/* Spacer */}
                <div style={{ height: 20 }} />

                {/* Password */}
                <div>
                  <div style={styles.label}>Password</div>
                  <div style={styles.passwordInputWrapper}>
                    <input
                      type={obscureNewPassword ? "password" : "text"}
                      style={styles.passwordInput}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      style={styles.passwordToggle}
                      onClick={() =>
                        setObscureNewPassword((prev) => !prev)
                      }
                    >
                      {obscureNewPassword ? "Show" : "Hide"}
                    </button>
                  </div>
                  {renderSaveButton(updatePassword, isUpdatingPassword)}
                </div>
              </div>
            </div>

            {/* ADDRESS + PHONE SECTION */}
            <div style={styles.sectionContainerOuter}>
              <div style={styles.sectionContainerInner}>
                {/* Address title */}
                <div style={styles.sectionTitle}>Address</div>

                {/* Address line 1 */}
                <input
                  style={styles.input}
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="Address Line 1"
                  disabled={isLoading}
                />
                {/* Address line 2 */}
                <input
                  style={styles.input}
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Address Line 2 (Optional)"
                  disabled={isLoading}
                />
                {/* City */}
                <input
                  style={styles.input}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City / Town"
                  disabled={isLoading}
                />

                {/* ZIP + State row */}
                <div style={styles.row}>
                  <div style={styles.flex1}>
                    <input
                      style={styles.input}
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="ZIP/Postal code"
                      disabled={isLoading}
                    />
                  </div>
                  <div style={styles.flex1}>
                    <input
                      style={styles.input}
                      value={stateRegion}
                      onChange={(e) => setStateRegion(e.target.value)}
                      placeholder="State / Region"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {renderSaveButton(updateAddress, isLoading)}

                {/* Spacer */}
                <div style={{ height: 20 }} />

                {/* Phone number */}
                <div>
                  <div style={styles.label}>Phone Number</div>
                  <input
                    style={styles.input}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    disabled={isLoading}
                  />
                  {renderSaveButton(updatePhone, isLoading)}
                </div>
              </div>
            </div>

            {/* DELETE ACCOUNT */}
            <div style={styles.deleteBtnWrapper}>
              <button
                type="button"
                style={{
                  ...styles.deleteBtn,
                  ...(isLoading ? styles.deleteBtnDisabled : {}),
                }}
                onClick={isLoading ? undefined : deleteAccount}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Delete Account"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Notification Modal */}
      {showNotifModal && (
        <div
          style={styles.modalOverlay}
          onClick={() => setShowNotifModal(false)}
        >
          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={styles.modalHeader}>
              <div style={styles.modalHeaderIcon}>
                <span role="img" aria-label="bell">
                  🔔
                </span>
              </div>
              <div style={styles.modalHeaderTextWrap}>
                <div style={styles.modalHeaderTitle}>
                  Notifications
                </div>
                <div style={styles.modalHeaderSubtitle}>
                  {notifCount}{" "}
                  {notifCount === 1
                    ? "notification"
                    : "notifications"}
                </div>
              </div>
              <div style={styles.modalHeaderActions}>
                {notifCount > 0 && (
                  <button
                    type="button"
                    style={styles.clearAllBtn}
                    onClick={handleClearAllNotifications}
                  >
                    Clear All
                  </button>
                )}
                <button
                  type="button"
                  style={styles.closeModalBtn}
                  onClick={() => setShowNotifModal(false)}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Body */}
            <div style={styles.modalBody}>
              {notifCount === 0 ? (
                <div style={styles.emptyStateWrap}>
                  <div style={styles.emptyStateIconWrap}>
                    <span style={styles.emptyStateIcon}>🔕</span>
                  </div>
                  <div style={styles.emptyStateTitle}>
                    No notifications yet
                  </div>
                  <div style={styles.emptyStateSubtitle}>
                    {"You're all caught up! New notifications\nwill appear here when available."}
                  </div>
                </div>
              ) : (
                <ul style={styles.notifList}>
                  {notifications.map((n) => (
                    <li key={n.id} style={styles.notifItemOuter}>
                      <div style={styles.notifItemCard}>
                        <div style={styles.notifIconWrap}>🔔</div>
                        <div style={styles.notifTextWrap}>
                          {n.title && (
                            <div style={styles.notifTitle}>
                              {n.title}
                            </div>
                          )}
                          {n.body && (
                            <div style={styles.notifBody}>{n.body}</div>
                          )}
                          <div style={styles.notifFooter}>
                            <span>Just now</span>
                            <button
                              type="button"
                              style={styles.notifRemoveBtn}
                              onClick={() =>
                                handleRemoveNotification(n.id)
                              }
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div style={styles.toast}>{toast}</div>}
    </div>
  );
}