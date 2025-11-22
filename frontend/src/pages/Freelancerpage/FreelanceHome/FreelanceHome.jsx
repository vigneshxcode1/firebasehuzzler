
import React, { useEffect, useState } from "react";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../../../firbase/Firebase";

// Icons
import {
  FiBookmark,
  FiPlus,
  FiSearch,
  FiMessageCircle,
  FiBell,
  FiArrowRight,
  FiEye,
} from "react-icons/fi";

// Dummy waves (replace later)
import wave1 from "../../../assets/profile.png";
import wave2 from "../../../assets/profile.png";

export default function FreelanceHome() {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [userMap, setUserMap] = useState({});

  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  // ------------------ UPDATE SUGGESTIONS ------------------
  function updateSuggestions(text) {
    const q = text.toLowerCase();
    const setData = new Set();

    jobs.forEach((job) => {
      if (job.title?.toLowerCase().includes(q)) setData.add(job.title);
      if (job.skills) {
        job.skills.forEach((skill) => {
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
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
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

  // ------------------ LOAD USERS ------------------
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      const map = {};
      snap.docs.forEach((u) => (map[u.id] = u.data()));
      setUserMap(map);
    });
    return unsub;
  }, []);

  // ------------------ SAVE JOB ------------------
  async function toggleSave(jobId) {
    if (!user) return;

    const ref = doc(db, "users", user.uid);
    const newList = savedJobs.includes(jobId)
      ? savedJobs.filter((x) => x !== jobId)
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

  // ------------------ FILTER ------------------
  const filteredJobs = searchText.trim()
    ? jobs.filter(
        (job) =>
          job.title?.toLowerCase().includes(searchText.toLowerCase()) ||
          job.skills?.some((skill) =>
            skill.toLowerCase().includes(searchText.toLowerCase())
          )
      )
    : jobs;

  // ------------------ TIME AGO ------------------
  function timeAgo(date) {
    if (!date) return "N/A";
    const diff = (Date.now() - date.toDate()) / 1000;
    if (diff < 60) return `${Math.floor(diff)} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  }

  return (
   <div style={{ minHeight: "100vh", margin: 0, padding: 0 }}>

      {/* ------------------ HEADER ------------------ */}
      <div
        style={{
      background: "linear-gradient(180deg, rgba(253,253,150,1), rgba(255,255,255,1))",
    padding: "30px",
    paddingBottom: 40,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    boxShadow: "none",
    position: "relative",
    margin: 0,
        }}
      >
        {/* HEADER CONTENT ------------------ */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* LEFT SIDE TEXT */}
          <div>
            <h2 style={{ margin: 0, fontSize: 32, fontWeight: 700 ,marginLeft:-80,}}>
              Welcome,
              <br />
              Freelancer!
            </h2>
            <p style={{ marginTop: 5, opacity: 0.7 }}>
              Discover projects that match your skills
            </p>
          </div>

          {/* RIGHT SIDE ICONS */}
          <div
            style={{
              display: "flex",
              gap: 20,
              alignItems: "center",
              fontSize: 22,
            }}
          >
            <FiMessageCircle cursor="pointer" />
            <FiBell cursor="pointer" />

            <div
              style={{
                width: 38,
                height: 38,
                background: "#ddd",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            ></div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div
          style={{
            marginTop: 30,
            background: "#fff",
            height: 55,
            display: "flex",
            alignItems: "center",
            paddingLeft: 20,
            borderRadius: 40,
            boxShadow: "0 5px 20px rgba(0,0,0,0.12)",
          }}
        >
          <FiSearch size={20} color="#666" />
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              paddingLeft: 10,
              fontSize: 16,
             marginTop:20,
              background: "transparent",
            }}
          />
        </div>

        {/* SUGGESTION DROPDOWN (Option B) */}
    {suggestions.length > 0 && (
      <div
        style={{
          background: "#fff",
          marginTop: 8,
          borderRadius: 12,
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        {suggestions.map((s, i) => (
          <div
            key={i}
            onClick={() => {
              setSearchText(s);
              setSuggestions([]);
            }}
            style={{
              padding: "12px 18px",
              cursor: "pointer",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            {s}
          </div>
        ))}
      </div>
    )}

      </div>

      {/* ------------------ CARDS ------------------ */}
      <div
        style={{
          display: "flex",
          gap: 20,
          padding: "25px",
          flexWrap: "wrap",
        }}
      >
        {/* BROWSE PROJECTS CARD */}
        <div
          style={{
            flex: 1,
            minWidth: 250,
            background: "#7C4DFF",
            color: "#fff",
            padding: 20,
            borderRadius: 18,
            position: "relative",
            cursor: "pointer",
            overflow: "hidden",
          }}
          onClick={() => navigate("/freelance-dashboard/freelancebrowesproject")}
        >
          <img
            src={wave1}
            alt="wave"
            style={{
              position: "absolute",
              right: 0,
                left:200,
              bottom: 0,
            width: 150,
              height:120,
              opacity: 1,
            }}
          />
          <h3 style={{ marginBottom: 4 }}>Browse All Projects</h3>
          <p style={{ opacity: 0.8, fontSize: 13 }}>Explore all opportunities</p>
          <FiArrowRight
            size={22}
            style={{ position: "absolute", right: 20, bottom: 20 }}
          />
        </div>

        {/* MY WORKS CARD */}
        <div
          style={{
            flex: 1,
            minWidth: 250,
            background: "rgba(255, 255, 255, 0.5)",
            padding: 20,
            borderRadius: 18,
            position: "relative",
            cursor: "pointer",
            overflow: "hidden",
          }}
          onClick={() => navigate("/freelance-dashboard/freelancermyworks")}
        >
          <img
            src={wave2}
            alt="wave"
            style={{
              position: "absolute",
              right: 0,
            left:200,
              bottom: 0,
              width: 150,
              height:120,
              opacity: 0.4,
            }}
          />
          <h3 style={{ marginBottom: 4 }}>My Works</h3>
          <p style={{ opacity: 0.7, fontSize: 13 }}>Track your work</p>
          <FiArrowRight
            size={22}
            style={{ position: "absolute", right: 20, bottom: 20 }}
          />
        </div>
      </div>

      {/* ------------------ JOB LIST ------------------ */}
      <div style={{ padding: "0 25px 40px" }}>
        <h2 style={{ marginBottom: 15 ,marginLeft:-850,}}>Top Recommendations for You</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 16,
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                cursor: "pointer",
              }}
              onClick={() => onViewJob(job)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <h3 style={{ margin: 0 }}>{job.title}</h3>

                <strong style={{ color: "#111" }}>
                  ₹{job.budget_from}/day
                </strong>
              </div>

              <p style={{ marginTop: 5, opacity: 0.7 }}>
                {job.description?.slice(0, 120)}...
              </p>

              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                {job.skills?.map((skill, i) => (
                  <span
                    key={i}
                    style={{
                      background: "#FFF7CC",
                      padding: "5px 10px",
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* VIEWS + TIME + SAVE */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 15,
                }}
              >
                <div style={{ display: "flex", gap: 15, opacity: 0.6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <FiEye /> {job.views}
                  </div>

                  <div>{timeAgo(job.created_at)}</div>
                </div>

                <FiBookmark
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSave(job.id);
                  }}
                  size={20}
                  color={savedJobs.includes(job.id) ? "rgba(124, 60, 255, 1)" : "#777"}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------ FLOATING + BUTTON ------------------ */}
      <div
        onClick={() => navigate("/freelance-dashboard/add-service-form")}
        style={{
          position: "fixed",
          right: 30,
          bottom: 30,
          width: 55,
          height: 55,
          background: "#7C4DFF",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
          cursor: "pointer",
        }}
      >
        <FiPlus size={28} color="#fff" />
      </div>
    </div>
  );
}