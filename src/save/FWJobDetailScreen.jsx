
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

// import {
//   IoCalendarOutline,
//   IoLocationOutline,
//   IoPeopleOutline,
//   IoTimeOutline,
//   IoCloseOutline,
// } from "react-icons/io5";

// import save from "../assets/save2.png";
// import saved from "../assets/save.png";
// import share from "../assets/share.png";

// export default function FreelancerviewJobDetailScreen() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const db = getFirestore();
//   const auth = getAuth();

//   const user = auth.currentUser;
//   const uid = user?.uid;

//   const [job, setJob] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isSaved, setIsSaved] = useState(false);

//   const removeJobCard = (jobId) => {
//     setJob((prev) => prev.filter((job) => job.id !== jobId));
//   };

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

//   const deletefunction = async (jobId) => {
//     try {
//       if (!uid) {
//         alert("User not logged in");
//         return;
//       }

//       const ref = doc(db, "jobs", jobId);

//       const updatedApplicants = job.applicants.filter(
//         (a) => a.freelancerId !== uid
//       );

//       await updateDoc(ref, {
//         applicants: updatedApplicants,
//         applicants_count: updatedApplicants.length,
//       });

//       alert("Your applied request has been removed.");

//       if (removeJobCard) {
//         removeJobCard(jobId);
//       }

//       navigate("/freelance-dashboard/freelancermyworks");
//     } catch (error) {
//       console.error(error);
//       alert("Failed to remove applied request.");
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (!job) return <div>Job not found</div>;

//   return (
//     <div
//       style={{
//         width: "100%",
//         minHeight: "120vh",
//         background: "#ffffff88",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "start",
//         paddingTop: "80px",
//         backdropFilter: "blur(10px)",
//       }}
//     >
//       {/* CARD */}
//       <div
//         style={{
//           width: "100%",
//           maxWidth: "1100px",
//           background: "#fff",
//           borderRadius: 18,
//           boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
//           padding: "38px 32px",
//           position: "relative",
//         }}
//       >
//         {/* APPLIED BADGE */}
//         <div
//           style={{
//             position: "absolute",
//             top: 80,
//             right: 20,
//             padding: "6px 16px",
//             background: "#E1FFC2",
//             color: "#67CC44",
//             borderRadius: 14,
//             fontSize: 14,
//             fontWeight: 600,
//             width:"123px",
//             textAlign:"center",
//           }}
//         >
//           Applied
//         </div>

//         {/* TOP ICONS */}
//         <div
//           style={{
//             display: "flex",
//             gap: 18,
//             alignItems: "center",
//             position: "absolute",
//             right: 30,
//             top: 30,
//           }}
//         >
//           {!isSaved ? (
//             <img
//               src={save}
//               alt="save"
//               style={{ width: 24, height: 24, cursor: "pointer" }}
//               onClick={() => setIsSaved(true)}
//             />
//           ) : (
//             <img
//               src={saved}
//               alt="saved"
//               style={{ width: 24, height: 24, cursor: "pointer" }}
//               onClick={() => setIsSaved(false)}
//             />
//           )}

//           <img
//             src={share}
//             alt="share"
//             style={{ width: 24, height: 24, cursor: "pointer" }}
//           />

//           <IoCloseOutline
//             onClick={() => navigate("/freelance-dashboard/freelancermyworks")}
//             size={26}
//             color="#444"
//             style={{ cursor: "pointer" }}
//           />
//         </div>

//         {/* TITLE */}
//         <h1 style={{ fontSize: 32, fontWeight: 500, color: "#111" }}>
//           {job.title}
//         </h1>

//         <p style={{ marginTop: -6, fontSize: 20, fontWeight: 400, color: "#777" }}>
//           {job.category}
//         </p>

//         {/* BUDGET + TIMELINE + LOCATION */}
//         <div
//           style={{
//             display: "flex",
//             marginTop: 20,
//             gap: 80,
//             alignItems: "center",
//             flexWrap: "wrap",
//           }}
//         >
//           {/* Budget */}
//           <div>
//             <p style={{ color: "#666", fontSize: 14 }}>Budget</p>
//             <p style={{ fontSize: 15, fontWeight: 600 }}>
//               ₹{job.budget_from} - ₹{job.budget_to}
//             </p>
//           </div>

//           {/* TIMELINE */}
//           <div style={{ display: "flex", alignItems: "center", gap: 8 ,}}>
//             <IoCalendarOutline size={19} color="#555" style={{marginTop:"30px"}} />
//             <div>
//               <p style={{ fontSize: 14, color: "#666" }}>Timeline</p>
//               <p style={{ fontSize: 15, fontWeight: 600 }}>
//                 {job.deliveryDuration || job.timeline || "N/A"}
//               </p>
//             </div>
//           </div>

//           {/* LOCATION */}
//           <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//             <IoLocationOutline size={19} color="#555" style={{marginTop:"30px"}} />
//             <div>
//               <p style={{ fontSize: 14, color: "#666" }}>Location</p>
//               <p style={{ fontSize: 15, fontWeight: 600 }}>Remote</p>
//             </div>
//           </div>
//         </div>

//         {/* APPLICANTS + TIME */}
//         <div
//           style={{
//             marginTop: 15,
//             display: "flex",
//             gap: 25,
//             color: "#555",
//             fontSize: 14,
//             flexWrap: "wrap",
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//             <IoPeopleOutline />
//             <span>{job.applicantsCount || 0} Applicants</span>
//           </div>

//           <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//             <IoTimeOutline />
//             <span>{job.postedAgo || "Recently"}</span>
//           </div>
//         </div>

//         {/* SKILLS */}
//         <h3 style={{ marginTop: 25, marginBottom: 10, fontSize: 20 }}>
//           Skills Required
//         </h3>

//         <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//           {(job.skills || []).map((s, i) => (
//             <div
//               key={i}
//               style={{
//                 background: "#FFF7A6",
//                 padding: "6px 14px",
//                 borderRadius: 10,
//                 fontSize: 16,
//               }}
//             >
//               {s}
//             </div>
//           ))}
//         </div>

//         {/* DESCRIPTION */}
//         <h3 style={{ marginTop: 25, marginBottom: 10, fontSize: 20 }}>
//           Project Description
//         </h3>

//         <p style={{ fontSize: 15, lineHeight: "22px", color: "#444" }}>
//           {job.description}
//         </p>

//         {/* DELETE BUTTON */}
//         <div style={{ marginTop: 35 }}>
//           <button
//             onClick={() => deletefunction(job.id)}
//             style={{
//               width: "100%",
//               padding: "14px 0",
//               background: "#9810FAE5",
//               borderRadius: 18,
//               border: "none",
//               color: "#fff",
//               fontSize: 18,
//               cursor: "pointer",
//             }}
//           >
//             Delete Request
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import {
  IoCalendarOutline,
  IoLocationOutline,
  IoPeopleOutline,
  IoTimeOutline,
  IoCloseOutline,
} from "react-icons/io5";

import save from "../assets/save2.png";
import saved from "../assets/save.png";
import share from "../assets/share.png";

export default function FreelancerviewJobDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const db = getFirestore();
  const auth = getAuth();

  const user = auth.currentUser;
  const uid = user?.uid;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const removeJobCard = (jobId) => {
    setJob((prev) => prev.filter((job) => job.id !== jobId));
  };

  useEffect(() => {
    async function fetchJob() {
      const ref = doc(db, "jobs", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setJob({ id: snap.id, ...snap.data() });
      }
      setLoading(false);
    }

    fetchJob();
  }, [id]);

  const deletefunction = async (jobId) => {
    try {
      if (!uid) {
        alert("User not logged in");
        return;
      }

      const ref = doc(db, "jobs", jobId);

      const updatedApplicants = job.applicants.filter(
        (a) => a.freelancerId !== uid
      );

      await updateDoc(ref, {
        applicants: updatedApplicants,
        applicants_count: updatedApplicants.length,
      });

      alert("Your applied request has been removed.");

      if (removeJobCard) {
        removeJobCard(jobId);
      }

      navigate("/freelance-dashboard/freelancermyworks");
    } catch (error) {
      console.error(error);
      alert("Failed to remove applied request.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!job) return <div>Job not found</div>;

  return (
    <div
      style={{
        width: "100%",
        minHeight: "120vh",
        background: "#ffffff88",
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
        paddingTop: "80px",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* CARD */}
      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          padding: "38px 32px",
          position: "relative",
        }}
      >
        {/* APPLIED BADGE */}
        <div
          style={{
            position: "absolute",
            top: 80,
            right: 20,
            padding: "6px 16px",
            background: "#E1FFC2",
            color: "#67CC44",
            borderRadius: 14,
            fontSize: 14,
            fontWeight: 600,
            width:"123px",
            textAlign:"center",
          }}
        >
          Applied
        </div>

        {/* TOP ICONS */}
        <div
          style={{
            display: "flex",
            gap: 18,
            alignItems: "center",
            position: "absolute",
            right: 30,
            top: 30,
          }}
        >
          {!isSaved ? (
            <img
              src={save}
              alt="save"
              style={{ width: 24, height: 24, cursor: "pointer" }}
              onClick={() => setIsSaved(true)}
            />
          ) : (
            <img
              src={saved}
              alt="saved"
              style={{ width: 24, height: 24, cursor: "pointer" }}
              onClick={() => setIsSaved(false)}
            />
          )}

          <img
            src={share}
            alt="share"
            style={{ width: 24, height: 24, cursor: "pointer" }}
          />

          <IoCloseOutline
            onClick={() => navigate("/freelance-dashboard/freelancermyworks")}
            size={26}
            color="#444"
            style={{ cursor: "pointer" }}
          />
        </div>

        {/* TITLE */}
        <h1 style={{ fontSize: 32, fontWeight: 500, color: "#111" }}>
          {job.title}
        </h1>

        <p style={{ marginTop: -6, fontSize: 20, fontWeight: 400, color: "#777" }}>
          {job.category}
        </p>

        {/* BUDGET + TIMELINE + LOCATION */}
        <div
          style={{
            display: "flex",
            marginTop: 20,
            gap: 80,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Budget */}
          <div>
            <p style={{ color: "#666", fontSize: 14 }}>Budget</p>
            <p style={{ fontSize: 15, fontWeight: 600 }}>
              ₹{job.budget_from} - ₹{job.budget_to}
            </p>
          </div>

          {/* TIMELINE */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 ,}}>
            <IoCalendarOutline size={19} color="#555" style={{marginTop:"30px"}} />
            <div>
              <p style={{ fontSize: 14, color: "#666" }}>Timeline</p>
              <p style={{ fontSize: 15, fontWeight: 600 }}>
                {job.deliveryDuration || job.timeline || "N/A"}
              </p>
            </div>
          </div>

          {/* LOCATION */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <IoLocationOutline size={19} color="#555" style={{marginTop:"30px"}} />
            <div>
              <p style={{ fontSize: 14, color: "#666" }}>Location</p>
              <p style={{ fontSize: 15, fontWeight: 600 }}>Remote</p>
            </div>
          </div>
        </div>

        {/* APPLICANTS + TIME */}
        <div
          style={{
            marginTop: 15,
            display: "flex",
            gap: 25,
            color: "#555",
            fontSize: 14,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <IoPeopleOutline />
            <span>{job.applicantsCount || 0} Applicants</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <IoTimeOutline />
            <span>{job.postedAgo || "Recently"}</span>
          </div>
        </div>

        {/* SKILLS */}
        <h3 style={{ marginTop: 25, marginBottom: 10, fontSize: 20 }}>
          Skills Required
        </h3>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {(job.skills || []).map((s, i) => (
            <div
              key={i}
              style={{
                background: "#FFF7A6",
                padding: "6px 14px",
                borderRadius: 10,
                fontSize: 16,
              }}
            >
              {s}
            </div>
          ))}
        </div>

        {/* DESCRIPTION */}
        <h3 style={{ marginTop: 25, marginBottom: 10, fontSize: 20 }}>
          Project Description
        </h3>

        <p style={{ fontSize: 15, lineHeight: "22px", color: "#444" }}>
          {job.description}
        </p>

        {/* DELETE BUTTON */}
        <div style={{ marginTop: 35 }}>
          <button
            onClick={() => deletefunction(job.id)}
            style={{
              width: "100%",
              padding: "14px 0",
              background: "#9810FAE5",
              borderRadius: 18,
              border: "none",
              color: "#fff",
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            Delete Request
          </button>
        </div>
      </div>
    </div>
  );
}