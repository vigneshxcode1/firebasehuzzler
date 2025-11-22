// screens/HomeScreen.jsx
import React, { useEffect, useState } from "react";
import { getFirestore, collection, doc, onSnapshot, updateDoc, increment } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firbase/Firebase";

import ClientSearchBar from "../components/ClientSearchBar";


export default function HomeScreen() {

 const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  function updateSuggestions(text) {
    const q = text.toLowerCase();
    const s = new Set();
    jobs.forEach((job) => {
      if (job.title?.toLowerCase().includes(q)) s.add(job.title);
      if (job.skills)
        job.skills.forEach((sk) => sk.toLowerCase().includes(q) && s.add(sk));
    });
    setSuggestions(Array.from(s).slice(0, 6));
  }

  useEffect(() => {
    if (!searchText.trim()) return setSuggestions([]);
    updateSuggestions(searchText);
  }, [searchText]);


  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const db = getFirestore();

  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  // Load jobs live
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "jobs"), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setJobs(list.sort((a,b) => (b.created_at?.toDate?.() || 0) - (a.created_at?.toDate?.() || 0)));
    });
    return unsub;
  }, []);

  // Load saved jobs
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      setSavedJobs(snap.data()?.favoriteJobs || []);
    });
    return unsub;
  }, [user]);

  // Toggle save
  async function toggleSave(jobId) {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    const newSaved = savedJobs.includes(jobId) ? savedJobs.filter(x => x !== jobId) : [...savedJobs, jobId];
    setSavedJobs(newSaved);
    await updateDoc(ref, { favoriteJobs: newSaved });
  }
async function onViewJob(job) {
  if (job.jobtype === "jobs_24h") {
    navigate(`/freelance-dashboard/job-24/${job.id}`);
  } else {
    navigate(`/freelance-dashboard/job-full/${job.id}`);
  }
}



  return (
    <div style={{ background: "#fff", minHeight: "100vh", padding: 20 }}>
       <ClientSearchBar
      searchText={searchText}
      setSearchText={setSearchText}
      suggestions={suggestions}
      setSuggestions={setSuggestions}
      onOpenFilter={() => alert("Filters Coming Soon")}
    />
      <h1>Top Jobs for You</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {jobs.map(job => (
          <div
            key={job.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 16,
              cursor: "pointer",
            }}
            onClick={() => onViewJob(job)}
          >
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <p>₹{job.budget_from} - ₹{job.budget_to}</p>
            <p>{job.views || 0} views</p>
            <button
              onClick={e => { e.stopPropagation(); toggleSave(job.id); }}
            >
              {savedJobs.includes(job.id) ? "Saved" : "Save"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
