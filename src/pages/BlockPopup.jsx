import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firbase/Firebase";

export default function ReportBlockPopup({
  freelancerId,
  freelancerName,
  onClose,
}) {
  const auth = getAuth();
  const currentUid = auth.currentUser?.uid;

  const [step, setStep] = useState("main");
  const [selectedReason, setSelectedReason] = useState("");
  const [selectedReasons, setSelectedReasons] = useState([]);

  const reasons = [
    "Fraud or scam",
    "Misinformation",
    "Harassment",
    "Threats or violence",
    "Hateful speech",
    "Illegal goods and service",
  ];

  const profileReasons = [
    "This person is impersonating someone",
    "This account has been hacked",
    "This account is not a real person",
  ];

  /* ================= BLOCK ================= */
  const handleBlock = async () => {
    if (!currentUid) return;

    await addDoc(collection(db, "blocked_users"), {
      blockedBy: currentUid,
      blockedUser: freelancerId,
      createdAt: serverTimestamp(),
    });

    alert("User blocked successfully 🚫");
    onClose();
  };

  /* ================= REPORT ================= */
  const submitReport = async (reason) => {
    if (!currentUid) return;

    await addDoc(collection(db, "reports"), {
      reportedBy: currentUid,
      reportedUser: freelancerId,
      reason,
      type: "profile",
      createdAt: serverTimestamp(),
    });

    alert("Report submitted ✅");
    onClose();
  };

  return (
    <div style={overlay}>
      <div style={sheet}>
        {/* ================= MAIN ================= */}
        {step === "main" && (
          <>
            <h3>Report or block</h3>
            <p>Select an action</p>

            <Option onClick={() => setStep("block")}>
              Block {freelancerName}
            </Option>

            <Option onClick={() => setStep("profile")}>
              Report {freelancerName}
            </Option>

            <Option onClick={() => setStep("reasons")}>
              Report profile element
            </Option>

            <Cancel onClick={onClose} />
          </>
        )}

        {/* ================= BLOCK ================= */}
        {step === "block" && (
          <>
            <h3>Block {freelancerName}?</h3>
            <p>You will no longer be connected.</p>

            <Action onClick={handleBlock}>Block</Action>
            <Cancel onClick={() => setStep("main")} />
          </>
        )}

        {/* ================= PROFILE REPORT ================= */}
        {step === "profile" && (
          <>
            <h3>Report {freelancerName}</h3>

            {profileReasons.map((r) => (
              <Option
                key={r}
                active={selectedReason === r}
                onClick={() => setSelectedReason(r)}
              >
                {r}
              </Option>
            ))}

            <Action
              disabled={!selectedReason}
              onClick={() => submitReport(selectedReason)}
            >
              Submit Report
            </Action>

            <Cancel onClick={() => setStep("main")} />
          </>
        )}

        {/* ================= MULTI REASONS ================= */}
        {step === "reasons" && (
          <>
            <h3>Report this profile</h3>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {reasons.map((r) => (
                <Tag
                  key={r}
                  active={selectedReasons.includes(r)}
                  onClick={() =>
                    setSelectedReasons((prev) =>
                      prev.includes(r)
                        ? prev.filter((x) => x !== r)
                        : [...prev, r]
                    )
                  }
                >
                  {r}
                </Tag>
              ))}
            </div>

            <Action
              disabled={!selectedReasons.length}
              onClick={() => submitReport(selectedReasons[0])}
            >
              Submit Report
            </Action>

            <Cancel onClick={() => setStep("main")} />
          </>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-end",
  zIndex: 999,
};

const sheet = {
  width: "100%",
  maxWidth: 420,
  background: "#FFFDE7",
  borderRadius: "20px 20px 0 0",
  padding: 20,
};

const Option = ({ children, onClick, active }) => (
  <div
    onClick={onClick}
    style={{
      padding: 14,
      borderRadius: 12,
      border: "1px solid black",
      marginBottom: 10,
      background: active ? "#7C3CFF" : "transparent",
      color: active ? "white" : "black",
      cursor: "pointer",
    }}
  >
    {children}
  </div>
);

const Tag = ({ children, active, onClick }) => (
  <div
    onClick={onClick}
    style={{
      padding: "8px 14px",
      borderRadius: 20,
      background: active ? "#7C3CFF" : "#E6DCFF",
      color: active ? "#fff" : "#000",
      cursor: "pointer",
    }}
  >
    {children}
  </div>
);

const Action = ({ children, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      width: "100%",
      padding: 12,
      marginTop: 14,
      borderRadius: 20,
      background: disabled ? "#ccc" : "#7C3CFF",
      color: "white",
      border: "none",
    }}
  >
    {children}
  </button>
);

const Cancel = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: "100%",
      padding: 12,
      marginTop: 10,
      borderRadius: 20,
      background: "transparent",
      border: "1px solid black",
    }}
  >
    Cancel
  </button>
);
