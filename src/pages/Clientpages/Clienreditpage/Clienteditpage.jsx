// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   doc,
//   setDoc,
//   addDoc,
//   collection,
//   serverTimestamp,
// } from "firebase/firestore";
// import { db } from "../../../firbase/Firebase";

// // import backarrow from "../../../assets/backArrow.png"

// export default function ClientEditJob() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const jobData = location.state?.jobData || {};

//   // ---------------- STATE ----------------
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState("");
//   const [budgetFrom, setBudgetFrom] = useState("");
//   const [budgetTo, setBudgetTo] = useState("");
//   const [timeline, setTimeline] = useState("");
//   const [skills, setSkills] = useState([]);
//   const [tools, setTools] = useState([]);
//   const [isSaving, setIsSaving] = useState(false);

//   // ---------------- PREFILL ----------------
//   useEffect(() => {
//     if (jobData) {
//       setTitle(jobData.title || "");
//       setDescription(jobData.description || "");
//       setCategory(jobData.category || "");
//       setBudgetFrom(jobData.budget_from || "");
//       setBudgetTo(jobData.budget_to || "");
//       setTimeline(jobData.timeline || "");
//       setSkills(jobData.skills || []);
//       setTools(jobData.tools || []);
//     }
//   }, [jobData]);

//   // ---------------- SAVE ----------------
//   const handleSave = async () => {
//     if (!title || !category) {
//       alert("Title and Category are required");
//       return;
//     }

//     setIsSaving(true);

//     const jobPayload = {
//       title,
//       description,
//       category,
//       budget_from: budgetFrom,
//       budget_to: budgetTo,
//       timeline,
//       skills,
//       tools,
//       updated_at: serverTimestamp(),
//     };

//     try {
//       if (jobData.id) {
//         await setDoc(doc(db, "jobs", jobData.id), {
//           ...jobData,
//           ...jobPayload,
//         });
//       } else {
//         await addDoc(collection(db, "jobs"), {
//           ...jobPayload,
//           created_at: serverTimestamp(),
//         });
//       }
// alert("Job saved successfully!");
//       navigate(-1);
//     } catch (err) {
//       console.error(err);
//       alert("Error saving job.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <>
//       {/* ------------ PAGE ------------ */}
//       <div className="editJobWrapper">
//         <div className="editJobCard">

//           {/* HEADER */}
//           <div className="editJobHeader">
//              <div className="backbtn" onClick={() => navigate(-1)} >
//                        <img src={backarrow} alt="back arrow" height={20} className="backarrow"/>
//                      </div>
//             <div className="editJobTitle">
//               {jobData.id ? "Edit Job Proposal" : "Job Proposal"}
//             </div>
//           </div>

//           {/* FORM */}
//           <label>Job Title*</label>
//           <input
//             className="formInput"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="Enter Job Title"
//           />

//           <label>Description*</label>
//           <textarea
//             className="formInput"
//             style={{ height: 100 }}
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Describe your project"
//           />

//           <label>Category*</label>
//           <input
//             className="formInput"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             placeholder="Select Category"
//           />

//           <label>Budget From*</label>
//           <input
//             type="number"
//             className="formInput"
//             value={budgetFrom}
//             onChange={(e) => setBudgetFrom(e.target.value)}
//             placeholder="₹ From"
//           />

//           <label>Budget To*</label>
//           <input
//             type="number"
//             className="formInput"
//             value={budgetTo}
//             onChange={(e) => setBudgetTo(e.target.value)}
//             placeholder="₹ To"
//           />

//           <label>Timeline*</label>
//           <input
//             className="formInput"
//             value={timeline}
//             onChange={(e) => setTimeline(e.target.value)}
//             placeholder="e.g. 3 days"
//           />

//           <label>Skills*</label>
//           <input
//             className="formInput"
//             value={skills.join(", ")}
//             onChange={(e) =>
//               setSkills(e.target.value.split(",").map((x) => x.trim()))
//             }
//             placeholder="React, Figma, Firebase"
//           />

//           <label>Tools*</label>
//           <input
//             className="formInput"
//             value={tools.join(", ")}
//             onChange={(e) =>
//               setTools(e.target.value.split(",").map((x) => x.trim()))
//             }
//             placeholder="Photoshop, Illustrator"
//           />

//           {/* BUTTONS */}
//           <div className="btnRow">
//             <button
//               className="saveBtn"
//               onClick={handleSave}
//               disabled={isSaving}
//             >
//               {isSaving ? "Saving..." : "Save"}
//             </button>

//             <button className="cancelBtn" onClick={() => navigate(-1)}>
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ------------ INLINE CSS ------------ */}
//       <style>{`
//       .editJobWrapper {
//   min-height: 100vh;
//   padding: 30px 0;

//   /* Proper Rubik font family */
//   font-family: 'Rubik', system-ui, -apple-system, BlinkMacSystemFont,
//     'Segoe UI', Inter, sans-serif;

//   display: flex;
//   justify-content: center;

//   /* Prevent horizontal scrolling */
//   width: 100%;
//   overflow-x: hidden;
// }


//         .editJobCard {
//           width: 90%;
//           max-width: 760px;
//           background: #ffffff;
//           padding: 30px;
//           border-radius: 20px;
//           box-shadow: 0 12px 40px rgba(0,0,0,0.08);
//         }

//         .editJobHeader {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           margin-bottom: 25px;
//         }

//         .backarrow {
//       margin-top:8px;
//       margin-left:5px;
//         }


//         // .backArrow:hover {
//         //   background: #e4dba9;
//         // }



// .backbtn{
//           width: 36px;
//     height: 36px;
//     border-radius: 14px;
//     border: 0.8px solid #ccc;
//     display: flex;
//     justifyContent: center;
//     alignItems: center;
//     cursor: pointer;
//     fontSize: 20px;
//     opacity: 1;
//     flexShrink: 0;
  
//       }

//         .editJobTitle {
//           font-size: 24px;
//           font-weight: 700;
//           color: #333;
//         }

//         label {
//           display: block;
//           font-weight: 600;
//           margin-bottom: 6px;
//           font-size: 15px;
//           color: #444;
//         }

//         .formInput {
//           width: 100%;
//           padding: 14px;
//           background: #fffce8;
//           border-radius: 12px;
//           border: none;
//           margin-bottom: 18px;
//           font-size: 14px;
//           outline: none;
//         }

//         .formInput:focus {
//           box-shadow: 0 0 0 2px #7c3cff40;
//         }

//         .btnRow {
//           display: flex;
//           justify-content: center;
//           margin-top: 20px;
//           gap: 15px;
//           margin-left:500px;
//         }

//         .saveBtn {
//           width: 150px;
//           padding: 13px;
//           border-radius: 25px;
//           border: none;
//           background: #7C3CFF;
//           color: white;
//           font-size: 16px;
//           font-weight: 600;
//           cursor: pointer;
//         }

//         .saveBtn:disabled {
//           background: #b7a2ff;
//         }

//         .cancelBtn {
//           width: 130px;
//           padding: 13px;
//           border-radius: 25px;
//           border: 2px solid #7C3CFF;
//           background: transparent;
//           color: #7C3CFF;
//           font-size: 16px;
//           font-weight: 600;
//           cursor: pointer;
//         }
//       `}
//       </style>
//     </>
//   );
// }



import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  doc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../firbase/Firebase";
import backarrow from "../../../assets/backArrow.png"
export default function ClientEditJob() {
  const location = useLocation();
  const navigate = useNavigate();
  const jobData = location.state?.jobData || {};

  // ---------------- STATE ----------------
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [budgetFrom, setBudgetFrom] = useState("");
  const [budgetTo, setBudgetTo] = useState("");
  const [timeline, setTimeline] = useState("");
  const [skills, setSkills] = useState([]);
  const [tools, setTools] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // ---------------- PREFILL ----------------
  useEffect(() => {
    if (jobData) {
      setTitle(jobData.title || "");
      setDescription(jobData.description || "");
      setCategory(jobData.category || "");
      setBudgetFrom(jobData.budget_from || "");
      setBudgetTo(jobData.budget_to || "");
      setTimeline(jobData.timeline || "");
      setSkills(jobData.skills || []);
      setTools(jobData.tools || []);
    }
  }, [jobData]);

  // ---------------- SAVE ----------------
  const handleSave = async () => {
    if (!title || !category) {
      alert("Title and Category are required");
      return;
    }

    setIsSaving(true);

    const jobPayload = {
      title,
      description,
      category,
      budget_from: budgetFrom,
      budget_to: budgetTo,
      timeline,
      skills,
      tools,
      updated_at: serverTimestamp(),
    };

    try {
      if (jobData.id) {
        await setDoc(doc(db, "jobs", jobData.id), {
          ...jobData,
          ...jobPayload,
        });
      } else {
        await addDoc(collection(db, "jobs"), {
          ...jobPayload,
          created_at: serverTimestamp(),
        });
      }
alert("Job saved successfully!");
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Error saving job.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* ------------ PAGE ------------ */}
      <div className="editJobWrapper">
        <div className="editJobCard">

          {/* HEADER */}
          <div className="editJobHeader">
             <div className="backbtn" onClick={() => navigate(-1)} >
                       <img src={backarrow} alt="back arrow" height={20} className="backarrow"/>
                     </div>
            <div className="editJobTitle">
              {jobData.id ? "Edit Job Proposal" : "Job Proposal"}
            </div>
          </div>

          {/* FORM */}
          <label>Job Title*</label>
          <input
            className="formInput"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Job Title"
          />

          <label>Description*</label>
          <textarea
            className="formInput"
            style={{ height: 100 }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your project"
          />

          <label>Category*</label>
          <input
            className="formInput"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Select Category"
          />

          <label>Budget From*</label>
          <input
            type="number"
            className="formInput"
            value={budgetFrom}
            onChange={(e) => setBudgetFrom(e.target.value)}
            placeholder="₹ From"
          />

          <label>Budget To*</label>
          <input
            type="number"
            className="formInput"
            value={budgetTo}
            onChange={(e) => setBudgetTo(e.target.value)}
            placeholder="₹ To"
          />

          <label>Timeline*</label>
          <input
            className="formInput"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            placeholder="e.g. 3 days"
          />

          <label>Skills*</label>
          <input
            className="formInput"
            value={skills.join(", ")}
            onChange={(e) =>
              setSkills(e.target.value.split(",").map((x) => x.trim()))
            }
            placeholder="React, Figma, Firebase"
          />

          <label>Tools*</label>
          <input
            className="formInput"
            value={tools.join(", ")}
            onChange={(e) =>
              setTools(e.target.value.split(",").map((x) => x.trim()))
            }
            placeholder="Photoshop, Illustrator"
          />

          {/* BUTTONS */}
          <div className="btnRow">
            <button
              className="saveBtn"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>

            <button className="cancelBtn" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* ------------ INLINE CSS ------------ */}
      <style>{`
      .editJobWrapper {
  min-height: 100vh;
  padding: 30px 0;

  /* Proper Rubik font family */
  font-family: 'Rubik', system-ui, -apple-system, BlinkMacSystemFont,
    'Segoe UI', Inter, sans-serif;

  display: flex;
  justify-content: center;

  /* Prevent horizontal scrolling */
  width: 100%;
  overflow-x: hidden;
}


        .editJobCard {
          width: 90%;
          max-width: 760px;
          background: #ffffff;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
        }

        .editJobHeader {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 25px;
        }

        .backarrow {
      margin-top:8px;
      margin-left:5px;
        }


        // .backArrow:hover {
        //   background: #e4dba9;
        // }



.backbtn{
          width: 36px;
    height: 36px;
    border-radius: 14px;
    border: 0.8px solid #ccc;
    display: flex;
    justifyContent: center;
    alignItems: center;
    cursor: pointer;
    fontSize: 20px;
    opacity: 1;
    flexShrink: 0;
  
      }

        .editJobTitle {
          font-size: 24px;
          font-weight: 700;
          color: #333;
        }

        label {
          display: block;
          font-weight: 600;
          margin-bottom: 6px;
          font-size: 15px;
          color: #444;
        }

        .formInput {
          width: 100%;
          padding: 14px;
          background: #fffce8;
          border-radius: 12px;
          border: none;
          margin-bottom: 18px;
          font-size: 14px;
          outline: none;
        }

        .formInput:focus {
          box-shadow: 0 0 0 2px #7c3cff40;
        }

        .btnRow {
          display: flex;
          justify-content: center;
          margin-top: 20px;
          gap: 15px;
          margin-left:500px;
        }

        .saveBtn {
          width: 150px;
          padding: 13px;
          border-radius: 25px;
          border: none;
          background: #7C3CFF;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }

        .saveBtn:disabled {
          background: #b7a2ff;
        }

        .cancelBtn {
          width: 130px;
          padding: 13px;
          border-radius: 25px;
          border: 2px solid #7C3CFF;
          background: transparent;
          color: #7C3CFF;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }
      `}
      </style>
    </>
  );
}