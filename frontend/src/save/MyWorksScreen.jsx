// MyWorksScreen.jsx
import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  arrayUnion,
  increment,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function MyWorksScreen() {
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  const [selectedTab, setSelectedTab] = useState("Applied");
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ✅ FIXED — now available inside component
  const viewDetails = (job) => {
    navigate(`/freelance-dashboard/jobdetailsscreen/${job.id}`);
  };

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const showAccepted = selectedTab === "Accepted";

    const notifRef = collection(db, "notifications");
    const qNotif = query(
      notifRef,
      where("freelancerId", "==", user.uid),
      where("read", "==", showAccepted)
    );

    const unsubNotif = onSnapshot(qNotif, (notifSnap) => {
      const jobIds = [...new Set(notifSnap.docs.map((d) => d.data().jobId))];

      if (jobIds.length === 0) {
        setJobs([]);
        setLoading(false);
        return;
      }

      const collectionName = activeTab === 0 ? "jobs" : "jobs_24h";
      const jobsRef = collection(db, collectionName);

      const unsubJobs = onSnapshot(jobsRef, (jobsSnap) => {
        const list = jobsSnap.docs
          .filter((d) => jobIds.includes(d.id))
          .map((d) => ({ id: d.id, ...d.data() }));
        setJobs(list);
        setLoading(false);
      });

      return () => unsubJobs();
    });

    return () => unsubNotif();
  }, [selectedTab, activeTab, user, db]);

  const filteredJobs = jobs.filter((j) => {
    const t = (j.title || "").toLowerCase();
    const d = (j.description || "").toLowerCase();
    return t.includes(search) || d.includes(search);
  });

  if (!user) {
    return (
      <div style={{ padding: 32, textAlign: "center" }}>
        Please log in to view your works
      </div>
    );
  }

  return (
    <div style={{ background: "#F5F5F5", minHeight: "100vh" }}>
      <Header />
      <SearchToggle
        search={search}
        setSearch={setSearch}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <InnerTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div style={{ padding: 16 }}>
        {loading ? (
          <div>Loading...</div>
        ) : filteredJobs.length === 0 ? (
          <EmptyState />
        ) : (
          filteredJobs.map((job) => (
            <JobFullCard
              key={job.id}
              job={job}
              userId={user.uid}
              onApply={() => console.log("apply function missing")}
              onViewDetails={() => viewDetails(job)} // ✅ FIXED
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function Header() {
  return (
    <div
      style={{
        background: "#FFFCA8",
        padding: "54px 16px 12px",
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: 20, fontWeight: 600 }}>My Works</span>
    </div>
  );
}

function SearchToggle({ search, setSearch, selectedTab, setSelectedTab }) {
  return (
    <div style={{ background: "#FFFCA8", padding: "0 16px 16px" }}>
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          padding: "6px 12px",
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
          placeholder="Search"
          style={{ flex: 1, border: "none", outline: "none" }}
        />
      </div>

      <div style={{ height: 16 }} />

      <div style={{ display: "flex", gap: 12 }}>
        {["Applied", "Accepted"].map((label) => (
          <div
            key={label}
            onClick={() => setSelectedTab(label)}
            style={{
              flex: 1,
              background: selectedTab === label ? "#000" : "#fff",
              color: selectedTab === label ? "#fff" : "#000",
              textAlign: "center",
              padding: "10px 0",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function InnerTabs({ activeTab, setActiveTab }) {
  return (
    <div style={{ background: "#fff", paddingTop: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {["Work", "24 hour"].map((label, i) => (
          <div
            key={label}
            onClick={() => setActiveTab(i)}
            style={{
              paddingBottom: 8,
              borderBottom: activeTab === i ? "2px solid #000" : "none",
              cursor: "pointer",
              fontWeight: activeTab === i ? 600 : 500,
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function JobFullCard({ job, onApply, userId, onViewDetails }) {
  const isApplied = (job.applicants || []).some(
    (a) => a.freelancerId === userId
  );

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      }}
    >
      <h2 style={{ margin: "0 0 8px 0" }}>{job.title}</h2>
      <p style={{ color: "#777" }}>Category: {job.category}</p>
      <p style={{ color: "#777" }}>Experience: {job.experience}</p>

      <div
        style={{
          background: "#f7f7f7",
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        💰 Budget: ₹{job.budget_from} - ₹{job.budget_to}
      </div>

      <div>
        created at:{" "}
        {job.created_at?.toDate?.().toLocaleString() || "N/A"}
      </div>
      <div>views: {job.views}</div>

      {job.skills?.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <strong>Skills: </strong>
          {job.skills.map((s) => (
            <span
              key={s}
              style={{
                background: "#e8f0ff",
                padding: "4px 8px",
                borderRadius: 8,
                marginRight: 4,
                fontSize: 12,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={onApply}
        disabled={isApplied}
        style={{
          marginTop: 16,
          padding: "10px 18px",
          backgroundColor: isApplied ? "#888" : "#007bff",
          borderRadius: 8,
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        {isApplied ? "Already Applied" : "Apply Now"}
      </button>

      <button
        onClick={onViewDetails}
        style={{
          marginTop: 12,
          padding: "10px 18px",
          backgroundColor: "#222",
          borderRadius: 8,
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        View Details
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ textAlign: "center", padding: 50, color: "#777" }}>
      <h3>No works yet</h3>
      <p>You haven't accepted any work projects yet.</p>
    </div>
  );
}
