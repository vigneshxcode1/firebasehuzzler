import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export default function FreelancerviewJobDetailScreen() {
  const { id } = useParams(); // get job id from URL
  const db = getFirestore();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div>Loading...</div>;
  if (!job) return <div>Job not found</div>;

  const screenHeight = window.innerHeight;
  const screenWidth = window.innerWidth;

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <div style={{ height: screenHeight * 0.18, position: "relative" }}>
        <div
          style={{
            width: "100%",
            height: screenHeight * 0.16,
            background: "#FDFD96",
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: `${screenHeight * 0.06}px ${screenWidth * 0.04}px`,
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 500 }}>Job Section</span>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{job.title}</div>

        <img
          src="/assets/full photo.png"
          alt="preview"
          style={{ width: "100%", height: 180, borderRadius: 12, objectFit: "cover", marginTop: 10 }}
        />

        <div style={{ marginTop: 12, fontSize: 15, fontWeight: 500 }}>Description</div>
        <div style={{ marginTop: 6, lineHeight: 1.5 }}>{job.description}</div>

        <div
          style={{
            padding: 16,
            borderRadius: 30,
            border: "1px solid #e0e0e0",
            background: "#fff",
            margin: "24px 12px",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700 }}>Service Details</div>
          <hr style={{ margin: "12px 0", borderColor: "#ddd" }} />

          <Row label="Price" value={`₹${job.price || job.budget_from || 0}`} />
          <div style={{ height: 12 }} />

          <Row label="Delivery Days" value={job.deliveryDuration || "N/A"} />
          <div style={{ height: 12 }} />

          <div style={{ fontSize: 16, fontWeight: 500 }}>Category</div>
          <Chip text={job.category} />

          <div style={{ marginTop: 16 }} />

          <div style={{ fontSize: 16, fontWeight: 500 }}>Skills & Tools</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            {(job.skills || []).map((s, i) => <Chip key={i} text={s} />)}
            {(job.tools || []).map((t, i) => <Chip key={i} text={t} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ fontSize: 16, fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 18, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function Chip({ text }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 30,
        padding: "4px 10px",
        background: "#fff",
        fontSize: 14,
      }}
    >
      {text}
    </div>
  );
}
