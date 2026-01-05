// import React, { useState } from "react";
// import { getAuth } from "firebase/auth";
// import {
//   addDoc,
//   collection,
//   serverTimestamp,
// } from "firebase/firestore";
// import { db } from "../firbase/Firebase";

// export default function ReportBlockPopup({
//   freelancerId,
//   freelancerName,
//   onClose,
// }) {
//   const auth = getAuth();
//   const currentUid = auth.currentUser?.uid;

//   const [step, setStep] = useState("main");
//   const [selectedReason, setSelectedReason] = useState("");
//   const [selectedReasons, setSelectedReasons] = useState([]);

//   const reasons = [
//                 "Fraud or scam",
//                 "Misinformation",
//                 "Harassment",
//                 "Dangerous or extremist organizations",
//                 "Threats or violence",
//                 "Self-harm",
//                 "Hateful speech",
//                 "Graphic content",
//                 "Sexual content",
//                 "Child exploitation",
//                 "Illegal goods and service",
//                 "Infringement",
//               ];

//   const profileReasons = [
//     "This person is impersonating someone",
//     "This account has been hacked",
//     "This account is not a real person",
//   ];

//   /* ================= BLOCK ================= */
//   const handleBlock = async () => {
//     if (!currentUid) return;

//     await addDoc(collection(db, "blocked_users"), {
//       blockedBy: currentUid,
//       blockedUser: freelancerId,
//       createdAt: serverTimestamp(),
//     });

//     alert("User blocked successfully 🚫");
//     onClose();
//   };

//   /* ================= REPORT ================= */
//   const submitReport = async (reason) => {
//     if (!currentUid) return;

//     await addDoc(collection(db, "reports"), {
//       reportedBy: currentUid,
//       reportedUser: freelancerId,
//       reason,
//       type: "profile",
//       createdAt: serverTimestamp(),
//     });

//     alert("Report submitted ✅");
//     onClose();
//   };

//   return (
//     <div style={overlay}>
//       <div style={sheet}>
//         {/* ================= MAIN ================= */}
//         {step === "main" && (
//           <>
//             <h3>Report or block</h3>
//             <p>Select an action</p>

//             <Option onClick={() => setStep("block")}>
//               Block {freelancerName}
//             </Option>

//             <Option onClick={() => setStep("profile")}>
//               Report {freelancerName}
//             </Option>

//             <Option onClick={() => setStep("reasons")}>
//               Report profile element
//             </Option>

//             <Cancel onClick={onClose} />
//           </>
//         )}

//         {/* ================= BLOCK ================= */}
//         {step === "block" && (
//           <>
//             <h3>Block {freelancerName}?</h3>
//             <p>You will no longer be connected.</p>

//             <Action onClick={handleBlock}>Block</Action>
//             <Cancel onClick={() => setStep("main")} />
//           </>
//         )}

//         {/* ================= PROFILE REPORT ================= */}
//         {step === "profile" && (
//           <>
//             <h3>Report {freelancerName}</h3>

//             {profileReasons.map((r) => (
//               <Option
//                 key={r}
//                 active={selectedReason === r}
//                 onClick={() => setSelectedReason(r)}
//               >
//                 {r}
//               </Option>
//             ))}

//             <Action
//               disabled={!selectedReason}
//               onClick={() => submitReport(selectedReason)}
//             >
//               Submit Report
//             </Action>

//             <Cancel onClick={() => setStep("main")} />
//           </>
//         )}

//         {/* ================= MULTI REASONS ================= */}
//         {step === "reasons" && (
//           <>
//             <h3>Report this profile</h3>

//             <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//               {reasons.map((r) => (
//                 <Tag
//                   key={r}
//                   active={selectedReasons.includes(r)}
//                   onClick={() =>
//                     setSelectedReasons((prev) =>
//                       prev.includes(r)
//                         ? prev.filter((x) => x !== r)
//                         : [...prev, r]
//                     )
//                   }
//                 >
//                   {r}
//                 </Tag>
//               ))}
//             </div>

//             <Action
//               disabled={!selectedReasons.length}
//               onClick={() => submitReport(selectedReasons[0])}
//             >
//               Submit Report
//             </Action>

//             <Cancel onClick={() => setStep("main")} />
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ================= STYLES ================= */

// const overlay = {
//   position: "fixed",
//   inset: 0,
//   background: "rgba(0,0,0,0.4)",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "flex-end",
//   zIndex: 999,
// };

// const sheet = {
//   width: "100%",
//   maxWidth: 420,
//   background: "#FFFDE7",
//   borderRadius: "20px 20px 0 0",
//   padding: 20,
// };

// const Option = ({ children, onClick, active }) => (
//   <div
//     onClick={onClick}
//     style={{
//       padding: 14,
//       borderRadius: 12,
//       border: "1px solid black",
//       marginBottom: 10,
//       background: active ? "#7C3CFF" : "transparent",
//       color: active ? "white" : "black",
//       cursor: "pointer",
//     }}
//   >
//     {children}
//   </div>
// );

// const Tag = ({ children, active, onClick }) => (
//   <div
//     onClick={onClick}
//     style={{
//       padding: "8px 14px",
//       borderRadius: 20,
//       background: active ? "#7C3CFF" : "#E6DCFF",
//       color: active ? "#fff" : "#000",
//       cursor: "pointer",
//     }}
//   >
//     {children}
//   </div>
// );

// const Action = ({ children, onClick, disabled }) => (
//   <button
//     onClick={onClick}
//     disabled={disabled}
//     style={{
//       width: "100%",
//       padding: 12,
//       marginTop: 14,
//       borderRadius: 20,
//       background: disabled ? "#ccc" : "#7C3CFF",
//       color: "white",
//       border: "none",
//     }}
//   >
//     {children}
//   </button>
// );

// const Cancel = ({ onClick }) => (
//   <button
//     onClick={onClick}
//     style={{
//       width: "100%",
//       padding: 12,
//       marginTop: 10,
//       borderRadius: 20,
//       background: "transparent",
//       border: "1px solid black",
//     }}
//   >
//     Cancel
//   </button>
// );




import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
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

  const policyReasons = [
    "Fraud or scam",
    "Misinformation",
    "Harassment",
    "Dangerous or extremist organizations",
    "Threats or violence",
    "Self-harm",
    "Hateful speech",
    "Graphic content",
    "Sexual content",
    "Child exploitation",
    "Illegal goods and service",
    "Infringement",
  ];

  const profileReasons = [
    "This person is impersonating someone",
    "This account has been hacked",
    "This account is not a real person",
  ];

  /* ================= BACKEND ================= */

  const handleBlock = async () => {
    if (!currentUid) return;

    await addDoc(collection(db, "blocked_users"), {
      blockedBy: currentUid,
      blockedUser: freelancerId,
      createdAt: serverTimestamp(),
    });

    onClose();
  };

  const submitReport = async () => {
    if (!currentUid || !selectedReason) return;

    await addDoc(collection(db, "reports"), {
      reportedBy: currentUid,
      reportedUser: freelancerId,
      reason: selectedReason,
      type: "profile",
      createdAt: serverTimestamp(),
    });

    onClose();
  };

  /* ================= UI ================= */

  return (
    <div style={overlay}>
      <div style={modal}>
        {/* HEADER */}
        <div style={header}>
          <h3 style={{ margin: 0 }}>
            {step === "block" ? "Block" : "Report this profile"}
          </h3>
          <span style={close} onClick={onClose}>✕</span>
        </div>
        <hr />

        {/* MAIN */}
        {step === "main" && (
          <>
            <p style={sub}>Select an action</p>

            <Row onClick={() => setStep("block")}>
              Block {freelancerName}
            </Row>
            <Row onClick={() => setStep("profile")}>
              Report {freelancerName}
            </Row>
            <Row onClick={() => setStep("policy")}>
              Report profile element
            </Row>

            <Note>
              To report posts, comments, or messages, select the overflow menu next
              to that content and select Report.
            </Note>
          </>
        )}

        {/* BLOCK */}
        {step === "block" && (
          <>
            <p style={text}>
              You're about to block <b>{freelancerName}</b>. You'll no longer be
              connected, and will lose any endorsements or recommendations from
              this person.
            </p>

            <Footer>
              <Outline onClick={() => setStep("main")}>Back</Outline>
              <Primary onClick={handleBlock}>Block</Primary>
            </Footer>
          </>
        )}

        {/* PROFILE RADIO */}
        {step === "profile" && (
          <>
            <p style={sub}>Select an option that applies</p>

            {profileReasons.map((r) => (
              <RadioRow
                key={r}
                active={selectedReason === r}
                onClick={() => setSelectedReason(r)}
              >
                {r}
              </RadioRow>
            ))}

            <Note>
              If you believe this person is no longer with us, you can let us
              know this person is deceased
            </Note>

            <Footer>
              <Outline onClick={() => setStep("main")}>Back</Outline>
              <Primary disabled={!selectedReason} onClick={submitReport}>
                Submit report
              </Primary>
            </Footer>
          </>
        )}

        {/* POLICY TAGS */}
        {step === "policy" && (
          <>
            <p style={sub}>Select our policy that applies</p>

            <div style={tagWrap}>
              {policyReasons.map((r) => (
                <Tag
                  key={r}
                  active={selectedReason === r}
                  onClick={() => setSelectedReason(r)}
                >
                  {r}
                </Tag>
              ))}
            </div>

            <Footer>
              <Outline onClick={() => setStep("main")}>Back</Outline>
              <Primary
                disabled={!selectedReason}
                onClick={() => setStep("confirm")}   // 🔥 KEY CHANGE
              >
                Submit report
              </Primary>
            </Footer>
          </>
        )}
        {/* CONFIRM */}
{step === "confirm" && (
  <>
    <div style={{ flex: 1 }}>
      <p style={{ marginBottom: 12 }}>
        You have selected the following reason
      </p>

      <div style={note}>
        <strong>{selectedReason}</strong>
        <div style={{ fontSize: 13, marginTop: 4 }}>
          Illegal activities, malware, or promotion of illegal products or
          services
        </div>
      </div>
    </div>

    <Footer>
      <Outline onClick={() => setStep("policy")}>
        Back
      </Outline>
      <Primary onClick={submitReport}>
        Submit report
      </Primary>
    </Footer>
  </>
)}


      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 99999, // VERY IMPORTANT
};

const modal = {
  width: "100%",
  maxWidth: 520,
  background: "#fff",
  borderRadius: 12,
  padding: 20,
  display: "flex",
  flexDirection: "column",
  minHeight: 260,      // 🔥 ensures visibility
  maxHeight: "90vh",
};


const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const close = { cursor: "pointer", fontSize: 18 };

const sub = { color: "#555", margin: "12px 0" };

const text = { marginTop: 14, lineHeight: 1.6 };

const Row = ({ children, onClick }) => (
  <div onClick={onClick} style={row}>
    {children}
    <span>›</span>
  </div>
);

const RadioRow = ({ children, active, onClick }) => (
  <div
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",     // 🔥 vertical alignment
      gap: 12,
      padding: "10px 0",
      cursor: "pointer",
    }}
  >
    <input
      type="radio"
      checked={active}
      readOnly
      style={{
        margin: 0,              // 🔥 removes default offset
        width: 16,
        height: 16,
        cursor: "pointer",
      }}
    />
    <span
      style={{
        lineHeight: "20px",     // 🔥 text alignment
        fontSize: 14,
        color: "#222",
      }}
    >
      {children}
    </span>
  </div>
);


const Tag = ({ children, active, onClick }) => (
  <div onClick={onClick} style={{
    padding: "6px 12px",
    borderRadius: 20,
    border: "1px solid #ccc",
    background: active ? "#f0f7ff" : "#fff",
    cursor: "pointer",
    fontSize: 13
  }}>
    {children}
  </div>
);

const Footer = ({ children }) => (
  <div style={footer}>{children}</div>
);

const Outline = ({ children, onClick }) => (
  <button onClick={onClick} style={outlineBtn}>{children}</button>
);

const Primary = ({ children, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{
    ...primaryBtn,
    opacity: disabled ? 0.5 : 1
  }}>
    {children}
  </button>
);

const Note = ({ children }) => (
  <div style={note}>{children}</div>
);

const LinkRow = ({ children }) => (
  <div style={linkRow}>
    {children}
    <span>›</span>
  </div>
);

/* helpers */
const row = {
  padding: "14px 10px",
  borderBottom: "1px solid #eee",
  display: "flex",
  justifyContent: "space-between",
  cursor: "pointer",
};

const radioRow = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  padding: "10px 0",
  cursor: "pointer",
};

const tagWrap = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
};

const footer = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  marginTop: "auto", // 🔥 pins footer
};


const outlineBtn = {
  padding: "8px 16px",
  borderRadius: 8,
  border: "1px solid #ccc",
  background: "#fff",
};

const primaryBtn = {
  padding: "8px 16px",
  borderRadius: 8,
  background: "#FFF27A",
  border: "1px solid #e5d700",
};

const note = {
  background: "#FFF9DB",
  padding: 12,
  borderRadius: 8,
  fontSize: 13,
  marginTop: 16,
};

const linkSection = { marginTop: 16 };

const linkRow = {
  padding: "10px 0",
  display: "flex",
  justifyContent: "space-between",
  cursor: "pointer",
};
