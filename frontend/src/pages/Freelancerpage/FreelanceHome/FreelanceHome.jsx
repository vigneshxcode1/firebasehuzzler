import React, { useEffect, useState } from "react";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../../../firbase/Firebase";
import ClientSearchBar from "../components/ClientSearchBar";

export default function FreelanceHome() {

  // ------------------ SEARCH BAR STATES ------------------
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
const [userMap, setUserMap] = useState({});


  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  // ------------------ SUGGESTION UPDATE ------------------
  function updateSuggestions(text) {
    const q = text.toLowerCase();
    const setData = new Set();

    jobs.forEach(job => {
      if (job.title?.toLowerCase().includes(q)) setData.add(job.title);

      if (job.skills) {
        job.skills.forEach(skill => {
          if (skill.toLowerCase().includes(q)) setData.add(skill);
        });
      }
    });

    setSuggestions(Array.from(setData).slice(0, 6));
  }

  useEffect(() => {
    if (!searchText.trim()) return setSuggestions([]);
    updateSuggestions(searchText);
  }, [searchText]);

  // ------------------ LOAD JOBS ------------------
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "jobs"), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setJobs(list);
    });
    return unsub;
  }, []);

  // ------------------ LOAD SAVED JOBS ------------------
  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      setSavedJobs(snap.data()?.favoriteJobs || []);
    });

    return unsub;
  }, [user]);



// ------------------ LOAD USERS FOR COMPANY NAMES ------------------
// ------------------ LOAD USERS FOR COMPANY NAMES ------------------
useEffect(() => {
  const unsub = onSnapshot(collection(db, "users"), (snap) => {
    const map = {};
    snap.docs.forEach(u => {
      map[u.id] = u.data();
    });
    setUserMap(map); // FIXED
  });
  return unsub;
}, []);


  // ------------------ TOGGLE SAVE ------------------
  async function toggleSave(jobId) {
    if (!user) return;

    const ref = doc(db, "users", user.uid);
    const newList = savedJobs.includes(jobId)
      ? savedJobs.filter(x => x !== jobId)
      : [...savedJobs, jobId];

    setSavedJobs(newList);
    await updateDoc(ref, { favoriteJobs: newList });
  }

  // ------------------ VIEW JOB ------------------
  function onViewJob(job) {
    if (job.jobtype === "jobs_24h") {
      navigate(`/freelance-dashboard/job-24/${job.id}`);
    } else {
      navigate(`/freelance-dashboard/job-full/${job.id}`);
    }
  }

  // ------------------ FILTER SEARCH RESULTS ------------------
  const filteredJobs = searchText.trim()
    ? jobs.filter(job =>
      job.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      job.skills?.some(skill =>
        skill.toLowerCase().includes(searchText.toLowerCase())
      )
    )
    : jobs;

  return (
    <div style={{ background: "#fff", minHeight: "100vh", padding: 20 }}>

      {/* --- SAME SEARCH BAR AS CLIENT --- */}
      <ClientSearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        suggestions={suggestions}
        setSuggestions={setSuggestions}
        onOpenFilter={() => alert("Filters Coming Soon")}
      />

      <h1 style={{ marginTop: 20 }}>Recommended Projects for you</h1>
      <Link to={"/freelance-dashboard/add-service-form"}>plus</Link>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {filteredJobs.map(job => (
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
           {/* <h3>Company: {userMap[job.clientId]?.company_name || "Unknown"}</h3> */}

            <p>{job.description}</p>


            <div className="skill-row">
              {job.skills?.map((skill, i) => (
                <div className="skill-chip" key={i}>
                  ⭐ {skill}
                </div>
              ))}
            </div>


            <p>₹{job.budget_from} - ₹{job.budget_to}</p>
            <p>eye:{job.views}</p>
            <p>{job.created_at ? job.created_at.toDate().toLocaleDateString() : "n/a"}</p>

            <button
              onClick={(e) => { e.stopPropagation(); toggleSave(job.id); }}
            >
              {savedJobs.includes(job.id) ? "Saved" : "Save"}
            </button>

            
          </div>
        ))}
      </div>
    </div>
  );
}
