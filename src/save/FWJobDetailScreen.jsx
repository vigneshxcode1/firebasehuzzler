// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getFirestore, doc, getDoc } from "firebase/firestore";

// export default function FreelancerviewJobDetailScreen() {
//   const { id } = useParams(); // get job id from URL
//   const db = getFirestore();
//   const [job, setJob] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchJob() {
//       const ref = doc(db, "jobs", id);
//       const snap = await getDoc(ref);

//       if (snap.exists()) {
//         setJob({ id: snap.id, ...snap.data() });
//       }

//       setLoading(false);
//     }

//     fetchJob();
//   }, [id]);

//   if (loading) return <div>Loading...</div>;
//   if (!job) return <div>Job not found</div>;

//   const screenHeight = window.innerHeight;
//   const screenWidth = window.innerWidth;

//   return (
//     <div style={{ background: "#fff", minHeight: "100vh" }}>
//       <div style={{ height: screenHeight * 0.18, position: "relative" }}>
//         <div
//           style={{
//             width: "100%",
//             height: screenHeight * 0.16,
//             background: "#FDFD96",
//             borderBottomLeftRadius: 30,
//             borderBottomRightRadius: 30,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: `${screenHeight * 0.06}px ${screenWidth * 0.04}px`,
//           }}
//         >
//           <span style={{ fontSize: 22, fontWeight: 500 }}>Job Section</span>
//         </div>
//       </div>

//       <div style={{ padding: 16 }}>
//         <div style={{ fontSize: 18, fontWeight: 700 }}>{job.title}</div>

//         <img
//           src="/assets/full photo.png"
//           alt="preview"
//           style={{ width: "100%", height: 180, borderRadius: 12, objectFit: "cover", marginTop: 10 }}
//         />

//         <div style={{ marginTop: 12, fontSize: 15, fontWeight: 500 }}>Description</div>
//         <div style={{ marginTop: 6, lineHeight: 1.5 }}>{job.description}</div>

//         <div
//           style={{
//             padding: 16,
//             borderRadius: 30,
//             border: "1px solid #e0e0e0",
//             background: "#fff",
//             margin: "24px 12px",
//           }}
//         >
//           <div style={{ fontSize: 18, fontWeight: 700 }}>Service Details</div>
//           <hr style={{ margin: "12px 0", borderColor: "#ddd" }} />

//           <Row label="Price" value={`₹${job.price || job.budget_from || 0}`} />
//           <div style={{ height: 12 }} />

//           <Row label="Delivery Days" value={job.deliveryDuration || "N/A"} />
//           <div style={{ height: 12 }} />

//           <div style={{ fontSize: 16, fontWeight: 500 }}>Category</div>
//           <Chip text={job.category} />

//           <div style={{ marginTop: 16 }} />

//           <div style={{ fontSize: 16, fontWeight: 500 }}>Skills & Tools</div>
//           <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
//             {(job.skills || []).map((s, i) => <Chip key={i} text={s} />)}
//             {(job.tools || []).map((t, i) => <Chip key={i} text={t} />)}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function Row({ label, value }) {
//   return (
//     <div style={{ display: "flex", justifyContent: "space-between" }}>
//       <span style={{ fontSize: 16, fontWeight: 500 }}>{label}</span>
//       <span style={{ fontSize: 18, fontWeight: 600 }}>{value}</span>
//     </div>
//   );
// }

// function Chip({ text }) {
//   return (
//     <div
//       style={{
//         border: "1px solid #ddd",
//         borderRadius: 30,
//         padding: "4px 10px",
//         background: "#fff",
//         fontSize: 14,
//       }}
//     >
//       {text}
//     </div>
//   );
// }











// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getFirestore, doc, getDoc } from "firebase/firestore";

// export default function FreelancerviewJobDetailScreen() {
//   const { id } = useParams();
//   const db = getFirestore();

//   const [job, setJob] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchJob() {
//       const ref = doc(db, "jobs", id);
//       const snap = await getDoc(ref);

//       if (snap.exists()) setJob({ id: snap.id, ...snap.data() });
//       setLoading(false);
//     }

//     fetchJob();
//   }, [id]);

//   if (loading) return <div>Loading...</div>;
//   if (!job) return <div>Job not found</div>;

//   return (
//     <div style={{ background: "#FBFBFB", minHeight: "100vh", fontFamily: "Inter" }}>

//       {/* ---------- HEADER ---------- */}
//       <div
//         style={{
//           background: "#FFFFFF",
//           padding: "18px 18px",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           fontSize: 20,
//           fontWeight: 600,
//           borderBottom: "1px solid #f1f1f1",
//         }}
//       >
//         <span>Project Details</span>

//         <div style={{ display: "flex", gap: 18, fontSize: 22 }}>
//           <span style={{ cursor: "pointer" }}>🔗</span>
//           <span style={{ cursor: "pointer" }}>🔔</span>
//           <span style={{ cursor: "pointer" }}>✖</span>
//         </div>
//       </div>

//       {/* ---------- TITLE + APPLIED ---------- */}
//       <div style={{ padding: "20px 20px 0px 20px" }}>
//         <div style={{ fontSize: 30, fontWeight: 700 }}>
//           {job.company || "ZUNTRA DIGITAL PVT"}
//         </div>

//         <div
//           style={{
//             marginTop: 10,
//             display: "inline-block",
//             background: "#D7FFD7",
//             color: "#1DA71B",
//             padding: "6px 16px",
//             borderRadius: 20,
//             fontWeight: 600,
//             fontSize: 14,
//           }}
//         >
//           Applied
//         </div>

//         <div style={{ marginTop: 12, fontSize: 18, color: "#444", fontWeight: 500 }}>
//           {job.role || "UIUX Designer"}
//         </div>
//       </div>

//       {/* ---------- GRID TOP INFO ---------- */}
//       <div
//         style={{
//           marginTop: 25,
//           padding: "0px 20px",
//           display: "grid",
//           gridTemplateColumns: "1fr 1fr",
//           rowGap: 20,
//           fontSize: 15,
//         }}
//       >
//         <InfoRow label="Budget" value={`₹${job.budgetMin || 0} - ₹${job.budgetMax || 0}`} />
//         <InfoRow label="Timeline" value={job.timeline || "2 - 3 weeks"} />
//         <InfoRow label="Location" value={job.location || "Remote"} />
//         <InfoRow label="Applicants" value={`${job.applicants || 0} Applicants`} />
//       </div>
//            {/* Impressions and date */}
//       <div style={{ marginTop: 10, fontSize: 12, display: "flex", justifyContent: "space-between", color: "#555" }}>
//         <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
//           <img src={impression} alt="impression" style={{ width: 14, height: 14, objectFit: "contain" }} />
//           {job.views || 0} Impression
//         </span>
//         <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
//           <img src={clock} alt="clock" style={{ width: 14, height: 14, objectFit: "contain" }} />
//           {job.created_at?.toDate ? job.created_at.toDate().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "No Date"}
//         </span>
//       </div>



//       {/* ---------- SKILLS REQUIRED ---------- */}
//       <div style={{ padding: "0px 20px", marginTop: 10 }}>
//         <div style={{ fontSize: 18, fontWeight: 600 }}>Skills Required</div>

//         <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 15 }}>
//           {(job.skills || ["UI Design", "Web Design", "UX", "Figma", "Visual Design", "Interactive Design", "Adobe XD"])
//             .map((skill, i) => (
//               <div
//                 key={i}
//                 style={{
//                   background: "#FFF8BB",
//                   padding: "8px 14px",
//                   borderRadius: 10,
//                   fontSize: 14,
//                   fontWeight: 500,
//                 }}
//               >
//                 {skill}
//               </div>
//             ))}
//         </div>
//       </div>

//       {/* ---------- DESCRIPTION ---------- */}
//       <div style={{ padding: "20px 20px" }}>
//         <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Project Description</div>

//         <div style={{ fontSize: 15, lineHeight: 1.6 }}>
//           {job.description}
//         </div>

//         <div style={{ fontSize: 17, fontWeight: 700, marginTop: 20 }}>
//           Project Requirements:
//         </div>

//         <ul style={{ marginTop: 10, fontSize: 15, lineHeight: 1.6 }}>
//           <li>Modern and clean design aesthetic</li>
//           <li>Mobile-first approach (iOS and Android)</li>
//           <li>Interactive prototypes</li>
//           <li>Design system/component library</li>
//           <li>User flow diagrams</li>
//           <li>Responsive layouts</li>
//         </ul>
//       </div>

//       {/* ---------- DELETE REQUEST FOOTER ---------- */}
//       <div
//         style={{
//           position: "fixed",
//           bottom: 0,
//           width: "100%",
//           background: "#fff",
//           padding: 20,
//           boxShadow: "0 -2px 10px rgba(0,0,0,0.07)",
//         }}
//       >
//         <button
//           style={{
//             width: "100%",
//             background: "linear-gradient(90deg, #B44CFC, #6C48FE)",
//             color: "#fff",
//             padding: "14px 0",
//             fontSize: 17,
//             borderRadius: 50,
//             border: "none",
//             fontWeight: 600,
//             cursor:"pointer"
//           }}
//         >
//           Delete Request
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ---------- SMALL GRID COMPONENT ---------- */
// function InfoRow({ label, value }) {
//   return (
//     <div>
//       <div style={{ color: "#666", fontSize: 14 }}>{label}</div>
//       <div style={{ fontWeight: 600, marginTop: 2 }}>{value}</div>
//     </div>
//   );
// }



// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getFirestore, doc, getDoc } from "firebase/firestore";

// // ADD THIS 🔥
// import impression from "../assets/impression.png";
// import clock from "../assets/clock.png";

// export default function FreelancerviewJobDetailScreen() {
//   const { id } = useParams();
//   const db = getFirestore();

//   const [job, setJob] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchJob() {
//       const ref = doc(db, "jobs", id);
//       const snap = await getDoc(ref);

//       if (snap.exists()) setJob({ id: snap.id, ...snap.data() });
//       setLoading(false);
//     }

//     fetchJob();
//   }, [id]);

//   if (loading) return <div>Loading...</div>;
//   if (!job) return <div>Job not found</div>;

//   return (
//     <div style={{ background: "#FBFBFB", minHeight: "100vh", fontFamily: "Inter" }}>

//       {/* ---------- HEADER ---------- */}
//       <div
//         style={{
//           background: "#FFFFFF",
//           padding: "18px 18px",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           fontSize: 20,
//           fontWeight: 600,
//           borderBottom: "1px solid #f1f1f1",
//         }}
//       >
//         <span>Project Details</span>

//         <div style={{ display: "flex", gap: 18, fontSize: 22 }}>
//           <span style={{ cursor: "pointer" }}>🔗</span>
//           <span style={{ cursor: "pointer" }}>🔔</span>
//           <span style={{ cursor: "pointer" }}>✖</span>
//         </div>
//       </div>

//       {/* ---------- TITLE + APPLIED ---------- */}
//       <div style={{ padding: "20px 20px 0px 20px" }}>
//         <div style={{ fontSize: 30, fontWeight: 700 }}>
//           {job.company || "ZUNTRA DIGITAL PVT"}
//         </div>

//         <div
//           style={{
//             marginTop: 10,
//             display: "inline-block",
//             background: "#D7FFD7",
//             color: "#1DA71B",
//             padding: "6px 16px",
//             borderRadius: 20,
//             fontWeight: 600,
//             fontSize: 14,
//           }}
//         >
//           Applied
//         </div>

//       {/* Job title */}
//       <div style={{ color: "#0A0A0A", fontWeight: 400, fontSize: 16 }}>{job.title}</div>
//       <div style={{ fontSize: 24, fontWeight: 400, marginTop: 10 }}>₹ {job.budget || "1000"}/per day</div>
//       </div>

//       {/* ---------- GRID TOP INFO ---------- */}
//       <div
//         style={{
//           marginTop: 25,
//           padding: "0px 20px",
//           display: "grid",
//           gridTemplateColumns: "1fr 1fr",
//           rowGap: 20,
//           fontSize: 15,
//         }}
//       >
//         <InfoRow label="Budget" value={`₹${job.budgetMin || 0} - ₹${job.budgetMax || 0}`} />
//         <InfoRow label="Timeline" value={job.timeline || "2 - 3 weeks"} />
//         <InfoRow label="Location" value={job.location || "Remote"} />
//         <InfoRow label="Applicants" value={`${job.applicants || 0} Applicants`} />
//       </div>

//       {/* ---------- Impressions and Date ---------- */}
//       <div
//         style={{
//           marginTop: 10,
//           fontSize: 12,
//           display: "flex",
//           justifyContent: "space-between",
//           color: "#555",
//           padding: "0px 20px",
//         }}
//       >
//         <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
//           <img src={impression} alt="impression" style={{ width: 14, height: 14 }} />
//           {job.views || 0} Impression
//         </span>

//         <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
//           <img src={clock} alt="clock" style={{ width: 14, height: 14 }} />
//           {job.created_at?.toDate
//             ? job.created_at.toDate().toLocaleDateString("en-IN", {
//                 day: "2-digit",
//                 month: "short",
//                 year: "numeric",
//               })
//             : "No Date"}
//         </span>
//       </div>

//       {/* ---------- SKILLS ---------- */}
//       <div style={{ padding: "0px 20px", marginTop: 10 }}>
//         <div style={{ fontSize: 18, fontWeight: 600 }}>Skills Required</div>

//         <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 15 }}>
//           {(job.skills ||
//             ["UI Design", "Web Design", "UX", "Figma", "Visual Design", "Interactive Design", "Adobe XD"]
//           ).map((skill, i) => (
//             <div
//               key={i}
//               style={{
//                 background: "#FFF8BB",
//                 padding: "8px 14px",
//                 borderRadius: 10,
//                 fontSize: 14,
//                 fontWeight: 500,
//               }}
//             >
//               {skill}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ---------- DESCRIPTION ---------- */}
//       <div style={{ padding: "20px 20px" }}>
//         <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>
//           Project Description
//         </div>

//         <div style={{ fontSize: 15, lineHeight: 1.6 }}>
//           {job.description}
//         </div>

//         <div style={{ fontSize: 17, fontWeight: 700, marginTop: 20 }}>
//           Project Requirements:
//         </div>

//         <ul style={{ marginTop: 10, fontSize: 15, lineHeight: 1.6 }}>
//           <li>Modern and clean design aesthetic</li>
//           <li>Mobile-first approach (iOS and Android)</li>
//           <li>Interactive prototypes</li>
//           <li>Design system/component library</li>
//           <li>User flow diagrams</li>
//           <li>Responsive layouts</li>
//         </ul>
//       </div>

//       {/* ---------- FOOTER ---------- */}
//       <div
//         style={{
//           position: "fixed",
//           bottom: 0,
//           width: "100%",
//           background: "#fff",
//           padding: 20,
//           boxShadow: "0 -2px 10px rgba(0,0,0,0.07)",
//         }}
//       >
//         <button
//           style={{
//             width: "100%",
//             background: "linear-gradient(90deg, #B44CFC, #6C48FE)",
//             color: "#fff",
//             padding: "14px 0",
//             fontSize: 17,
//             borderRadius: 50,
//             border: "none",
//             fontWeight: 600,
//             cursor: "pointer",
//           }}
//         >
//           Delete Request
//         </button>
//       </div>
//     </div>
//   );
// }

// function InfoRow({ label, value }) {
//   return (
//     <div>
//       <div style={{ color: "#666", fontSize: 14 }}>{label}</div>
//       <div style={{ fontWeight: 600, marginTop: 2 }}>{value}</div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// ADD THIS 🔥
import impression from "../assets/impression.png";
import clock from "../assets/clock.png";

export default function FreelancerviewJobDetailScreen() {
  const { id } = useParams();
  const db = getFirestore();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⭐ 1️⃣ SIDEBAR COLLAPSED STATE
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  // ⭐ 2️⃣ LISTEN FOR SIDEBAR TOGGLE
  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  useEffect(() => {
    async function fetchJob() {
      const ref = doc(db, "jobs", id);
      const snap = await getDoc(ref);

      if (snap.exists()) setJob({ id: snap.id, ...snap.data() });
      setLoading(false);
    }

    fetchJob();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!job) return <div>Job not found</div>;

  // ⭐ 3️⃣ WRAP ENTIRE SCREEN WITH MARGIN-LEFT (SIDEBAR)
  return (
    <div
      style={{
        marginLeft: collapsed ? "-110px" : "50px",
        transition: "margin-left 0.25s ease",
        background: "#FBFBFB",
        minHeight: "100vh",
        fontFamily: "Inter",
      }}
    >
      {/* ---------- HEADER ---------- */}
      <div
        style={{
          background: "#FFFFFF",
          padding: "18px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 20,
          fontWeight: 600,
          borderBottom: "1px solid #f1f1f1",
        }}
      >
        <span>Project Details</span>

        <div style={{ display: "flex", gap: 18, fontSize: 22 }}>
          <span style={{ cursor: "pointer" }}>🔗</span>
          <span style={{ cursor: "pointer" }}>🔔</span>
          <span style={{ cursor: "pointer" }}>✖</span>
        </div>
      </div>

      {/* ---------- TITLE + APPLIED ---------- */}
      <div style={{ padding: "20px 20px 0px 20px" }}>
        <div style={{ fontSize: 30, fontWeight: 700 }}>
          {job.company || "ZUNTRA DIGITAL PVT"}
        </div>

        <div
          style={{
            marginTop: 10,
            display: "inline-block",
            background: "#D7FFD7",
            color: "#1DA71B",
            padding: "6px 16px",
            borderRadius: 20,
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Applied
        </div>

        <div
          style={{
            color: "#0A0A0A",
            fontWeight: 400,
            fontSize: 16,
            marginTop: 10,
          }}
        >
          {job.title}
        </div>

        <div style={{ fontSize: 24, fontWeight: 400, marginTop: 10 }}>
          ₹ {job.budget || "1000"}/per day
        </div>
      </div>

      {/* ---------- GRID TOP INFO ---------- */}
      <div
        style={{
          marginTop: 25,
          padding: "0px 20px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          rowGap: 20,
          fontSize: 15,
        }}
      >
        <InfoRow
          label="Budget"
          value={`₹${job.budgetMin || 0} - ₹${job.budgetMax || 0}`}
        />
        <InfoRow label="Timeline" value={job.timeline || "2 - 3 weeks"} />
        <InfoRow label="Location" value={job.location || "Remote"} />
        <InfoRow
          label="Applicants"
          value={`${job.applicants || 0} Applicants`}
        />
      </div>

      {/* ---------- Impressions and Date ---------- */}
      <div
        style={{
          marginTop: 10,
          fontSize: 12,
          display: "flex",
          justifyContent: "space-between",
          color: "#555",
          padding: "0px 20px",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <img
            src={impression}
            alt="impression"
            style={{ width: 14, height: 14 }}
          />
          {job.views || 0} Impression
        </span>

        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <img src={clock} style={{ width: 14, height: 14 }} />
          {job.created_at?.toDate
            ? job.created_at.toDate().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "No Date"}
        </span>
      </div>

      {/* ---------- SKILLS ---------- */}
      <div style={{ padding: "0px 20px", marginTop: 10 }}>
        <div style={{ fontSize: 18, fontWeight: 600 }}>Skills Required</div>

        <div
          style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 15 }}
        >
          {(job.skills ||
            [
              "UI Design",
              "Web Design",
              "UX",
              "Figma",
              "Visual Design",
              "Interactive Design",
              "Adobe XD",
            ]
          ).map((skill, i) => (
            <div
              key={i}
              style={{
                background: "#FFF8BB",
                padding: "8px 14px",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {skill}
            </div>
          ))}
        </div>
      </div>

      {/* ---------- DESCRIPTION ---------- */}
      <div style={{ padding: "20px 20px" }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>
          Project Description
        </div>

        <div style={{ fontSize: 15, lineHeight: 1.6 }}>{job.description}</div>

        <div style={{ fontSize: 17, fontWeight: 700, marginTop: 20 }}>
          Project Requirements:
        </div>

        <ul style={{ marginTop: 10, fontSize: 15, lineHeight: 1.6 }}>
          <li>Modern and clean design aesthetic</li>
          <li>Mobile-first approach (iOS and Android)</li>
          <li>Interactive prototypes</li>
          <li>Design system/component library</li>
          <li>User flow diagrams</li>
          <li>Responsive layouts</li>
        </ul>
      </div>

      {/* ---------- FOOTER ---------- */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          background: "#fff",
          padding: 20,
          boxShadow: "0 -2px 10px rgba(0,0,0,0.07)",
        }}
      >
        <button
          style={{
            width: "100%",
            background: "linear-gradient(90deg, #B44CFC, #6C48FE)",
            color: "#fff",
            padding: "14px 0",
            fontSize: 17,
            borderRadius: 50,
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Delete Request
        </button>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <div style={{ color: "#666", fontSize: 14 }}>{label}</div>
      <div style={{ fontWeight: 600, marginTop: 2 }}>{value}</div>
    </div>
  );
}
