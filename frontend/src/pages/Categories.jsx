import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { db } from "../firbase/Firebase";

export default function FreelanceHome() {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");

  // JOB TABS → 24h, full, saved
  const [jobTab, setJobTab] = useState("24h");

  const categories = [
    "Web Development",
    "Mobile Apps",
    "UI/UX Design",
    "Logo Design",
    "Video Editing",
    "Animation",
    "SEO",
    "Digital Marketing",
    "Writing",
    "Data Entry"
  ];

  // LOAD ALL JOBS
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "jobs"), (snap) => {
      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setJobs(
        list.sort(
          (a, b) =>
            (b.created_at?.toDate?.() || 0) -
            (a.created_at?.toDate?.() || 0)
        )
      );
    });
    return unsub;
  }, []);

  // LOAD SAVED JOBS
  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      setSavedJobs(snap.data()?.favoriteJobs || []);
    });

    return unsub;
  }, [user]);

  // SAVE / UNSAVE JOB + NAVIGATE TO SAVED PAGE
  async function toggleSave(jobId) {
    if (!user) return;

    const ref = doc(db, "users", user.uid);
    const updated = savedJobs.includes(jobId)
      ? savedJobs.filter((id) => id !== jobId)
      : [...savedJobs, jobId];

    setSavedJobs(updated);
    await updateDoc(ref, { favoriteJobs: updated });

    navigate("/freelance-dashboard/saved");
  }

  // SEARCH SUGGESTIONS
  function updateSuggestions(text) {
    const q = text.toLowerCase();
    const s = new Set();

    jobs.forEach((job) => {
      if (job.title?.toLowerCase().includes(q)) s.add(job.title);

      if (job.skills) {
        job.skills.forEach((sk) => {
          if (sk.toLowerCase().includes(q)) s.add(sk);
        });
      }
    });

    setSuggestions([...s].slice(0, 6));
  }

  useEffect(() => {
    if (!searchText.trim()) {
      setSuggestions([]);
      return;
    }
    updateSuggestions(searchText);
  }, [searchText]);

  // FINAL FILTER
  const filteredJobs = jobs.filter((job) => {
    // TAB FILTER
    const matchTab =
      jobTab === "24h"
        ? job.jobtype === "jobs_24h"
        : jobTab === "full"
        ? job.jobtype !== "jobs_24h"
        : jobTab === "saved"
        ? savedJobs.includes(job.id)
        : true;

    const matchSearch =
      job.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchText.toLowerCase());

    const matchCategory = selectedCategory
      ? job.category === selectedCategory
      : true;

    return matchTab && matchSearch && matchCategory;
  });

  // OPEN JOB PAGE
  function onViewJob(job) {
    if (job.jobtype === "jobs_24h") {
      navigate(`/freelance-dashboard/job-24/${job.id}`);
    } else {
      navigate(`/freelance-dashboard/job-full/${job.id}`);
    }
  }

  return (
    <div style={{ padding: 20, background: "#fff", minHeight: "100vh" }}>

      {/* ===================== SEARCH BAR ===================== */}
      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Search jobs…"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        />

        {/* SUGGESTIONS */}
        {suggestions.length > 0 && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 8,
              position: "absolute",
              top: 48,
              left: 0,
              right: 0,
              zIndex: 20,
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
            }}
          >
            {suggestions.map((s, i) => (
              <p
                key={i}
                onClick={() => {
                  setSearchText(s);
                  setSuggestions([]);
                }}
                style={{ padding: 6, cursor: "pointer" }}
              >
                {s}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* ===================== JOB TABS ===================== */}
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button
          onClick={() => setJobTab("full")}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 10,
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
            background: jobTab === "full" ? "#7c3aed" : "#f3f4f6",
            color: jobTab === "full" ? "#fff" : "#000",
          }}
        >
          FULL JOBS
        </button>

        <button
          onClick={() => setJobTab("24h")}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 10,
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
            background: jobTab === "24h" ? "#7c3aed" : "#f3f4f6",
            color: jobTab === "24h" ? "#fff" : "#000",
          }}
        >
          24H JOBS
        </button>

        <button
          onClick={() => {
            setJobTab("saved");
            navigate("/freelance-dashboard/saved");
          }}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 10,
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
            background: jobTab === "saved" ? "#7c3aed" : "#f3f4f6",
            color: jobTab === "saved" ? "#fff" : "#000",
          }}
        >
          SAVED JOBS
        </button>
      </div>

      {/* ===================== CATEGORY FILTER ===================== */}
      <h3 style={{ marginTop: 20 }}>Categories</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
          marginTop: 10,
        }}
      >
        {categories.map((cat, i) => (
          <div
            key={i}
            onClick={() =>
              setSelectedCategory(selectedCategory === cat ? "" : cat)
            }
            style={{
              padding: 10,
              borderRadius: 10,
              textAlign: "center",
              cursor: "pointer",
              fontWeight: 500,
              border:
                selectedCategory === cat
                  ? "2px solid #7c3aed"
                  : "1px solid #ccc",
              background:
                selectedCategory === cat ? "#ede9fe" : "#fafafa",
            }}
          >
            {cat}
          </div>
        ))}
      </div>

      {/* ===================== JOB LIST ===================== */}
      <h2 style={{ marginTop: 20 }}>
        {jobTab === "24h"
          ? "🔥 24-Hour Jobs"
          : jobTab === "full"
          ? "🟣 Full Jobs"
          : "⭐ Saved Jobs"}
      </h2>

      {filteredJobs.map((job) => (
        <div
          key={job.id}
          onClick={() => onViewJob(job)}
          style={{
            padding: 16,
            marginTop: 12,
            border: "1px solid #ddd",
            borderRadius: 12,
            cursor: "pointer",
            background: "#fff",
          }}
        >
          <h3>{job.title}</h3>
          <p>{job.description}</p>
          <p>
            ₹{job.budget_from} - ₹{job.budget_to}
          </p>

          {/* SAVE BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSave(job.id);
            }}
            style={{
              marginTop: 10,
              padding: "6px 14px",
              borderRadius: 8,
              border: "1px solid #7c3aed",
              background: savedJobs.includes(job.id)
                ? "#7c3aed"
                : "#fff",
              color: savedJobs.includes(job.id)
                ? "#fff"
                : "#7c3aed",
              cursor: "pointer",
            }}
          >
            {savedJobs.includes(job.id) ? "Saved" : "Save"}
          </button>
        </div>
      ))}
    </div>
  );
}
