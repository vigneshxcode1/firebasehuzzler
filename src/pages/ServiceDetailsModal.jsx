
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
// import { db, auth } from "../firbase/Firebase";

// // FIXED: imports
// import { FiBookmark, FiX } from "react-icons/fi";
// import share from "../assets/share.png"; // <-- PUT your share icon path

// const css = `
// *{font-family:'Inter', sans-serif;}

// .page-wrap{
//   width:100%;
//   max-width:1100px;
//   margin:0 auto;
//   padding:0;
//   margin-top:30px;
//   margin-bottom:30px;
//   background:#fff;
//   border-radius:18px;
//   overflow:hidden;
//   box-shadow:0 8px 26px rgba(0,0,0,0.08);
// }

// /* HEADER TOP BAR */
// .top-header{
//   padding:20px 24px;
//   display:flex;
//   justify-content:space-between;
//   align-items:center;
// }
// .top-left-title{
//   font-size:22px;
//   font-weight:700;
// }
// .top-icons{
//   display:flex;
//   gap:16px;
//   font-size:20px;
//   opacity:0.7;
// }

// /* PROFILE SECTION */
// .profile-box{
//   padding:20px 24px;
//   display:flex;
//   align-items:center;
//   gap:18px;
// }
// .profile-circle{
//   width:58px;
//   height:58px;
//   border-radius:16px;
//   background:linear-gradient(180deg,#9A70FF,#7A4DFF);
//   display:flex;
//   align-items:center;
//   justify-content:center;
//   font-size:20px;
//   color:white;
//   font-weight:400;
// }
// .profile-info .name{
//   font-size:36px;
//   font-weight:400;
//   color:#0A0A0A;
// }
// .profile-info .role{
//   margin-top:4px;
//   font-size:20px;
//   color:#7C3CFF;
//   font-weight:400;
// }

// /* META ROW */
// .meta-row{
//   padding:10px 24px;
//   display:flex;
//   gap:26px;
//   align-items:center;
//   font-size:14px;
//   color:#555;
// }
// .icon-meta{
//   display:flex;
//   align-items:center;
//   gap:6px;
// }

// /* MONEY & BUTTON */
// .money-box{
//   padding:20px 24px;
//   display:flex;
//   justify-content:space-between;
//   align-items:center;
// }
// .range{
//   font-size:22px;
//   font-weight:700;
// }
// .sub-text{
//   font-size:14px;
//   color:#555;
// }
// .view-btn{
//   background:#7A4DFF;
//   padding:12px 28px;
//   border-radius:12px;
//   color:white;
//   border:none;
//   cursor:pointer;
//   font-weight:600;
// }

// /* SKILLS */
// .skill-title{
//   padding:10px 24px;
//   font-size:20px;
//   font-weight:700;
// }
// .skills-box{
//   padding:8px 24px 20px;
//   display:flex;
//   flex-wrap:wrap;
//   gap:10px;
// }
// .skill-chip{
//   padding:8px 14px;
//   background:#FFEB99;
//   border-radius:10px;
//   font-size:14px;
//   font-weight:600;
// }

// /* DESCRIPTION */
// .desc-title{
//   padding:10px 24px;
//   font-size:20px;
//   font-weight:700;
// }
// .desc-text{
//   padding:10px 24px 20px;
//   line-height:1.6;
//   font-size:15px;
//   color:#444;
//   white-space:pre-line;
// }

// /* FOOTER BUTTONS */
// .footer-actions{
//   display:flex;
//   justify-content:space-between;
//   padding:18px 24px;
//   border-top:1px solid #eee;
// }
// .cancel-btn{
//   width:48%;
//   padding:14px;
//   border-radius:12px;
//   font-size:16px;
//   font-weight:700;
//   border:2px solid #A58BFF;
//   background:white;
//   color:#7A4DFF;
// }
// .connect-btn{
//   width:48%;
//   padding:14px;
//   border-radius:12px;
//   font-size:16px;
//   border:none;
//   background:#A258FF;
//   color:white;
//   font-weight:700;
// }
// `;

// export default function ServicePage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [job, setJob] = useState(null);

//   const [isFavorite, setIsFavorite] = useState(false);

//   useEffect(() => {
//     const styleEl = document.createElement("style");
//     styleEl.innerHTML = css;
//     document.head.appendChild(styleEl);
//     return () => styleEl.remove();
//   }, []);

//   useEffect(() => {
//     if (!id) return;

//     const load = async () => {
//       const ref = doc(db, "services", id);
//       const snap = await getDoc(ref);
//       if (snap.exists()) setJob({ ...snap.data(), _id: snap.id });
//     };

//     load();
//   }, [id]);

//   if (!job) return <div className="p-8 text-center">Loading…</div>;

//   const handleConnect = () => {
//     navigate(`/connect/${job.freelancerId || job.userId}`);
//   };

//   const handleSave = async () => {
//     const user = auth.currentUser;
//     if (!user) {
//       alert("Please login");
//       navigate("/firelogin");
//       return;
//     }
//     await updateDoc(doc(db, "users", user.uid), {
//       savedJobs: arrayUnion(id),
//     });
//     alert("Saved!");
//   };

//   // FIXED: share handler
//   const handleShare = () => {
//     navigator.share
//       ? navigator.share({
//         title: job.title,
//         text: "Check this project",
//         url: window.location.href,
//       })
//       : alert("Share not supported");
//   };

//   console.log(job)
//   return (
//     <div className="page-wrap">

//       {/* TOP BAR */}
//       <div className="top-header">
//         <div className="top-left-title">Project Details</div>
//         <div onClick={handleSave} style={{ cursor: "pointer" }}>
//           {isFavorite ? (
//             <FiBookmark style={{ color: "#7B2BFF", fill: "#7B2BFF" }} />
//           ) : (
//             <FiBookmark />
//           )}
//         </div>
//         <div className="top-icons">
//           <img
//             src={share}
//             alt="share"
//             width={18}
//             style={{ cursor: "pointer" }}
//             onClick={handleShare}
//           />

//           <FiX
//             onClick={() => navigate(-1)}
//             style={{ cursor: "pointer" }}
//           />
//         </div>
//       </div>

//       {/* PROFILE */}
//       <div className="profile-box">
//         <div className="profile-circle">
//           {job.title?.substring(0, 2).toUpperCase()}
//         </div>

//         <div className="profile-info">
//           <div className="name">{job.title || "no username"}</div>
//           <div className="role">{job.category || "no username"}</div>
//         </div>
//       </div>

//       {/* META */}
//       <div className="meta-row">
//         {/* <div className="icon-meta">👥 10 Applicants</div> */}
//         <div className="icon-meta">🕒 {job.createdAt ? job.createdAt.toDate().toLocaleString() : "–"}</div>
//       </div>

//       {/* MONEY */}
//       <div className="money-box">
//         <div>
//           <div className="range">₹{job.budget_from || "no budject"} - {job.budget_to}</div>
//           <div className="sub-text">Timeline: {job.deliveryDuration || "no timeline"}</div>
//           <div className="sub-text">Location: Remote</div>
//         </div>
//         <button className="view-btn" onClick={handleConnect}>View Profile</button>
//       </div>

//       {/* SKILLS */}
//       <div className="skill-title">Skills Required</div>
//       <div className="skills-box">
//         {(job.skills ||
//           ["UI Design", "Web Design", "UX", "Figma", "Visual Design", "Interactive Design", "Adobe XD"]
//         ).map((s, i) => (
//           <div key={i} className="skill-chip">
//             {s}
//           </div>
//         ))}
//       </div>

//       {/* DESCRIPTION */}
//       <div className="desc-title">Project Description</div>
//       <div className="desc-text">{job.description || "No description provided."}</div>

//       {/* BUTTONS */}
//       <div className="footer-actions">
//         <button className="cancel-btn" onClick={() => navigate(-1)}style={{ cursor: "pointer" }}>
//           Cancel
//         </button>
//         <button className="connect-btn" style={{cursor: "pointer",}} onClick={handleConnect}>
//           CONNECT
//         </button>

//         {/* ...rest of your existing code */}

//         {/* <div className="footer-actions">
//           <button
//             className="cancel-btn"
//             onClick={() => {
//               // Navigate to an edit page with service ID
//               navigate(`/freelance-dashboard/freelanceredit-service/${job._id}`, { state: { service: job } });
//             }}
//           >
//             Edit Service
//           </button>

//           <button
//             className="connect-btn"
//             onClick={async () => {
//               if (!window.confirm("Are you sure you want to delete this service?")) return;

//               try {
//                 await deleteDoc(doc(db, "services", job._id));
//                 alert("Service deleted successfully!");
//                 navigate(-1); // go back after deletion
//               } catch (err) {
//                 console.error("Delete error:", err);
//                 alert("Failed to delete service");
//               }
//             }}
//           >
//             Delete Service
//           </button>
//         </div> */}

//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from "../firbase/Firebase";

// FIXED: imports
import { FiBookmark, FiX } from "react-icons/fi";
import share from "../assets/share.png"; // <-- PUT your share icon path

const css = `
*{font-family:'Inter', sans-serif;}

.page-wrap{
  width:100%;
  max-width:1100px;
  margin:0 auto;
  padding:0;
  margin-top:30px;
  margin-bottom:30px;
  background:#fff;
  border-radius:18px;
  overflow:hidden;
  box-shadow:0 8px 26px rgba(0,0,0,0.08);
}

/* HEADER TOP BAR */
.top-header{
  padding:20px 24px;
  display:flex;
  justify-content:space-between;
  align-items:center;
}
.top-left-title{
  font-size:22px;
  font-weight:700;
}
.top-icons{
  display:flex;
  gap:16px;
  font-size:20px;
  opacity:0.7;
}

/* PROFILE SECTION */
.profile-box{
  padding:20px 24px;
  display:flex;
  align-items:center;
  gap:18px;
}
.profile-circle{
  width:58px;
  height:58px;
  border-radius:16px;
  background:linear-gradient(180deg,#9A70FF,#7A4DFF);
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:20px;
  color:white;
  font-weight:400;
}
.profile-info .name{
  font-size:36px;
  font-weight:400;
  color:#0A0A0A;
}
.profile-info .role{
  margin-top:4px;
  font-size:20px;
  color:#7C3CFF;
  font-weight:400;
}

/* META ROW */
.meta-row{
  padding:10px 24px;
  display:flex;
  gap:26px;
  align-items:center;
  font-size:14px;
  color:#555;
}
.icon-meta{
  display:flex;
  align-items:center;
  gap:6px;
}

/* MONEY & BUTTON */
.money-box{
  padding:20px 24px;
  display:flex;
  justify-content:space-between;
  align-items:center;
}
.range{
  font-size:22px;
  font-weight:700;
}
.sub-text{
  font-size:14px;
  color:#555;
}
.view-btn{
  background:#7A4DFF;
  padding:12px 28px;
  border-radius:12px;
  color:white;
  border:none;
  cursor:pointer;
  font-weight:600;
}

/* SKILLS */
.skill-title{
  padding:10px 24px;
  font-size:20px;
  font-weight:700;
}
.skills-box{
  padding:8px 24px 20px;
  display:flex;
  flex-wrap:wrap;
  gap:10px;
}
.skill-chip{
  padding:8px 14px;
  background:#FFEB99;
  border-radius:10px;
  font-size:14px;
  font-weight:600;
}

/* DESCRIPTION */
.desc-title{
  padding:10px 24px;
  font-size:20px;
  font-weight:700;
}
.desc-text{
  padding:10px 24px 20px;
  line-height:1.6;
  font-size:15px;
  color:#444;
  white-space:pre-line;
}

/* FOOTER BUTTONS */
.footer-actions{
  display:flex;
  justify-content:space-between;
  padding:18px 24px;
  border-top:1px solid #eee;
}
.cancel-btn{
  width:48%;
  padding:14px;
  border-radius:12px;
  font-size:16px;
  font-weight:700;
  border:2px solid #A58BFF;
  background:white;
  color:#7A4DFF;
}
.connect-btn{
  width:48%;
  padding:14px;
  border-radius:12px;
  font-size:16px;
  border:none;
  background:#A258FF;
  color:white;
  font-weight:700;
}
`;

export default function ServicePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = css;
    document.head.appendChild(styleEl);
    return () => styleEl.remove();
  }, []);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const ref = doc(db, "services", id);
      const snap = await getDoc(ref);
      if (snap.exists()) setJob({ ...snap.data(), _id: snap.id });
    };

    load();
  }, [id]);

  if (!job) return <div className="p-8 text-center">Loading…</div>;

  const handleConnect = () => {
    navigate(`/connect/${job.freelancerId || job.userId}`);
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please login");
      navigate("/firelogin");
      return;
    }
    await updateDoc(doc(db, "users", user.uid), {
      savedJobs: arrayUnion(id),
    });
    alert("Saved!");
  };

  // FIXED: share handler
  const handleShare = () => {
    navigator.share
      ? navigator.share({
        title: job.title,
        text: "Check this project",
        url: window.location.href,
      })
      : alert("Share not supported");
  };

  console.log(job)
  return (
    <div className="page-wrap">

      {/* TOP BAR */}
      <div className="top-header">
        <div className="top-left-title">Project Details</div>
       
        <div className="top-icons">
          <div onClick={handleSave} style={{ cursor: "pointer" }}>
                     {isFavorite ? (
                       <FiBookmark style={{ color: "#7B2BFF", fill: "#7B2BFF" }} />
                     ) : (
                       <FiBookmark />
                     )}
                   </div>
          <img
            src={share}
            alt="share"
            width={18}
            height={18}
            style={{ cursor: "pointer" }}
            onClick={handleShare}
          />

          <FiX
            onClick={() => navigate(-1)}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>

      {/* PROFILE */}
      <div className="profile-box">
        <div className="profile-circle">
          {job.title?.substring(0, 2).toUpperCase()}
        </div>

        <div className="profile-info">
          <div className="name">{job.title || "no username"}</div>
          <div className="role">{job.category || "no username"}</div>
        </div>
      </div>

      {/* META */}
      <div className="meta-row">
        {/* <div className="icon-meta">👥 10 Applicants</div> */}
        <div className="icon-meta">🕒 {job.createdAt ? job.createdAt.toDate().toLocaleString() : "–"}</div>
      </div>

      {/* MONEY */}
      <div className="money-box">
        <div>
          <div className="range">₹{job.budget_from || "no budject"} - {job.budget_to}</div>
          <div className="sub-text">Timeline: {job.deliveryDuration || "no timeline"}</div>
          <div className="sub-text">Location: Remote</div>
        </div>
        <button className="view-btn" onClick={handleConnect}>View Profile</button>
      </div>

      {/* SKILLS */}
      <div className="skill-title">Skills Required</div>
      <div className="skills-box">
        {(job.skills ||
          ["UI Design", "Web Design", "UX", "Figma", "Visual Design", "Interactive Design", "Adobe XD"]
        ).map((s, i) => (
          <div key={i} className="skill-chip">
            {s}
          </div>
        ))}
      </div>

      {/* DESCRIPTION */}
      <div className="desc-title">Project Description</div>
      <div className="desc-text">{job.description || "No description provided."}</div>

      {/* BUTTONS */}
      <div className="footer-actions">
        <button className="cancel-btn" onClick={() => navigate(-1)}style={{ cursor: "pointer" }}>
          Cancel
        </button>
        <button className="connect-btn" style={{cursor: "pointer",}} onClick={handleConnect}>
          CONNECT
        </button>

        {/* ...rest of your existing code */}

        {/* <div className="footer-actions">
          <button
            className="cancel-btn"
            onClick={() => {
              // Navigate to an edit page with service ID
              navigate(/freelance-dashboard/freelanceredit-service/${job._id}, { state: { service: job } });
            }}
          >
            Edit Service
          </button>

          <button
            className="connect-btn"
            onClick={async () => {
              if (!window.confirm("Are you sure you want to delete this service?")) return;

              try {
                await deleteDoc(doc(db, "services", job._id));
                alert("Service deleted successfully!");
                navigate(-1); // go back after deletion
              } catch (err) {
                console.error("Delete error:", err);
                alert("Failed to delete service");
              }
            }}
          >
            Delete Service
          </button>
        </div> */}

      </div>
    </div>
  );
}
