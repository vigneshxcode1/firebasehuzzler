// screens/Service24hFullDetailScreen.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  doc,
  onSnapshot,
  deleteDoc,
  getFirestore,
} from "firebase/firestore";

export default function Service24hFullDetailScreen() {
  const { id } = useParams();
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = doc(db, "services_24h", id);
    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) {
        setService(null);
        setLoading(false);
        return;
      }

      const data = snap.data();
      setService({
        id: snap.id,
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        skills: data.skills || [],
        createdAt: data.created_at?.toDate?.() || new Date(),
        userId: data.userId,
      });
      setLoading(false);
    });

    return () => unsub();
  }, [id, db]);

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
  if (!service) return <div style={{ padding: 40 }}>Service not found ❌</div>;

  const isOwner = auth.currentUser?.uid === service.userId;

  return (
    <div style={container}>
      <h1>
        ⚡ {service.title}
        <span style={badge}>24h Service</span>
      </h1>

      <div style={priceBox}>💰 ₹{service.price}</div>

      <p style={dateText}>
        Must be completed within 24 hours
      </p>

      <h3>Description</h3>
      <p style={desc}>{service.description}</p>

      {service.skills.length > 0 && (
        <div style={chipWrap}>
          {service.skills.map((s, i) => (
            <span key={i} style={chip}>{s}</span>
          ))}
        </div>
      )}

      {isOwner && (
        <button style={deleteBtn} onClick={async () => {
          if (!window.confirm("Delete this 24h service?")) return;
          await deleteDoc(doc(db, "services_24h", id));
          navigate(-1);
        }}>
          Delete
        </button>
      )}
    </div>
  );
}

const badge = {
  marginLeft: 10,
  background: "#ff5722",
  color: "#fff",
  padding: "4px 8px",
  borderRadius: 6,
  fontSize: 12,
};
