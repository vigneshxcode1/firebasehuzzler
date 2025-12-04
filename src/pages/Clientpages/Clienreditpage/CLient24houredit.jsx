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

export default function ClientEdit24Hours() {
  const location = useLocation();
  const navigate = useNavigate();

  const jobData = location.state?.jobData || {};
  const jobId = location.state?.jobId || null;

  // ---------------- FULL JOB STATE (ALL FIELDS) ----------------
  const [fullJob, setFullJob] = useState({});

  // ----------- Editable Fields ----------
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [skills, setSkills] = useState([]);
  const [tools, setTools] = useState([]);

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  // ---------- LOAD FULL JOB ---------
  useEffect(() => {
    if (jobData) {
      setFullJob(jobData);

      // Prefill editable fields
      setTitle(jobData.title || "");
      setBudget(jobData.budget || "");
      setSkills(jobData.skills || []);
      setTools(jobData.tools || []);
      setDescription(jobData.description || "");
      setCategory(jobData.category || "");
      setSubCategory(jobData.subCategory || "");
    }
  }, [jobData]);

  // ---------- SAVE JOB (Keeps all fields) -------
  const handleSave = async () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    setIsSaving(true);

    const updatedFields = {
      ...fullJob, // <-- KEEP ALL FIELDS (applicants, views, timestamps, etc.)
      title,
      budget,
      skills,
      tools,
      description,
      category,
      subCategory,
      is24: true, // always true for this page
      updated_at: serverTimestamp(),
    };

    try {
      if (jobId) {
        await setDoc(doc(db, "jobs_24h", jobId), updatedFields);
      } else {
        await addDoc(collection(db, "jobs_24h"), {
          ...updatedFields,
          created_at: serverTimestamp(),
        });
      }

      alert("24h Job saved successfully!");
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Error saving 24h job.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="editWrapper">
        <div className="editCard">

          <div className="editHeader">
            <div className="backArrow" onClick={() => navigate(-1)}>
              ←
            </div>
            <div className="editTitle">
              {jobId ? "Edit 24 Hours Job" : "Post 24 Hours Job"}
            </div>
          </div>

          {/* FIELDS */}
          <label>Job Title*</label>
          <input
            className="formInput"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Description*</label>
          <textarea
            className="formInput"
            style={{ height: "100px" }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label>Category*</label>
          <input
            className="formInput"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <label>Sub Category</label>
          <input
            className="formInput"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
          />

          <label>Budget*</label>
          <input
            className="formInput"
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />

          <label>Skills</label>
          <input
            className="formInput"
            value={skills.join(", ")}
            onChange={(e) =>
              setSkills(e.target.value.split(",").map((s) => s.trim()))
            }
          />

          <label>Tools</label>
          <input
            className="formInput"
            value={tools.join(", ")}
            onChange={(e) =>
              setTools(e.target.value.split(",").map((s) => s.trim()))
            }
          />

          {/* BUTTONS */}
          <div className="btnRow">
            <button className="saveBtn" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </button>

            <button className="cancelBtn" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>

        </div>
      </div>

      {/* INLINE CSS */}
      <style>{`
        .editWrapper {
          min-height: 100vh;
          padding: 30px 0;
          display: flex;
          justify-content: center;
        }

        .editCard {
          width: 90%;
          max-width: 760px;
          background: #fff;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
        }

        .editHeader {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
        }

        .backArrow {
          width: 40px;
          height: 40px;
          background: #f3eec5;
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          font-size: 20px;
        }

        label {
          margin-top: 15px;
          font-weight: 600;
        }

        .formInput {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          margin-top: 6px;
          background: #fffef5;
          border: 1px solid #ddd;
        }

        .btnRow {
          display: flex;
          justify-content: flex-end;
          margin-top: 25px;
          gap: 15px;
        }

        .saveBtn {
          padding: 13px 25px;
          background: #7C3CFF;
          border: none;
          color: white;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 600;
        }

        .cancelBtn {
          padding: 13px 25px;
          border: 2px solid #7C3CFF;
          color: #7C3CFF;
          background: none;
          border-radius: 25px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}
