// screens/ServiceFullDetailScreen.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
    doc,
    onSnapshot,
    deleteDoc,
    getFirestore,
} from "firebase/firestore";

export default function ServiceFullDetailScreen() {
    const { id } = useParams();
    const auth = getAuth();
    const db = getFirestore();
    const navigate = useNavigate();

    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);




    useEffect(() => {
        if (!id) return;

        const ref = doc(db, "services", id);
        const unsub = onSnapshot(ref, (snap) => {
            if (!snap.exists()) {
                setService(null);
                setLoading(false);
                return;
            }

            const data = snap.data();
            setService({
                id: snap.id,
                title: data.title || "",
                description: data.description || "",
                budgetFrom: data.budget_from ?? 0,
                budgetTo: data.budget_to ?? 0,
                category: data.category || "",
                subCategory: data.subCategory || "",
                skills: data.skills || [],
                createdAt: data.createdAt?.toDate?.() || new Date(),
                userId: data.userId,
            });

            setLoading(false);
        });

        return () => unsub();
    }, [id, db]);



    const handleDelete = async () => {
        if (!window.confirm("Delete this service?")) return;
        await deleteDoc(doc(db, "services", id));
        alert("Service deleted");
        navigate(-1);
    };

    if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
    if (!service) return <div style={{ padding: 40 }}>Service not found ❌</div>;

    const isOwner = auth.currentUser?.uid === service.userId;

    return (
        <div style={page}>
            <div style={card}>
                {/* HEADER */}
                <div style={header}>
                    <div>
                        <h1 style={title}>{service.title}</h1>
                        <div style={budget}>
                            ₹{service.budgetFrom} – ₹{service.budgetTo}
                        </div>
                        <p style={category}>
                            {service.category}
                            {service.subCategory && ` • ${service.subCategory}`}
                        </p>
                    </div>


                </div>

                <p style={date}>
                    Posted on {service.createdAt.toLocaleDateString()}
                </p>

                {/* DESCRIPTION */}
                <section style={section}>
                    <h3 style={sectionTitle}>Description</h3>
                    <p style={desc}>{service.description}</p>
                </section>

                {/* SKILLS */}
                {service.skills.length > 0 && (
                    <section style={section}>
                        <h3 style={sectionTitle}>Skills</h3>
                        <div style={skills}>
                            {service.skills.map((s, i) => (
                                <span key={i} style={skillChip}>{s}</span>
                            ))}
                        </div>
                    </section>
                )}

                {/* OWNER ACTIONS */}
                {isOwner && (
                    <div style={actions}>
                        <button
                            style={editBtn}
                            onClick={() =>
                                navigate(
                                    `/freelance-dashboard/freelanceredit-service/${service.id}`,
                                    { state: { service } }
                                )
                            }
                        >
                            Edit Service
                        </button>

                        <button style={deleteBtn} onClick={handleDelete}>
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

}


const page = {
    minHeight: "100vh",
    background: "#f9fafb",
    padding: "40px 16px",
};

const card = {
    maxWidth: 900,
    margin: "0 auto",
    background: "#ffffff",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
};

const header = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 20,
    flexWrap: "wrap",
};

const title = {
    fontSize: 26,
    fontWeight: 700,
    marginBottom: 6,
};

const category = {
    fontSize: 14,
    color: "#6b7280",
};

const budget = {
    background: "#eef2ff",
    color: "#4f46e5",
    padding: "10px 16px",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 16,
    whiteSpace: "nowrap",
};

const date = {
    marginTop: 12,
    fontSize: 13,
    color: "#9ca3af",
};

const section = {
    marginTop: 28,
};

const sectionTitle = {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 10,
};

const desc = {
    fontSize: 15,
    lineHeight: 1.7,
    color: "#374151",
    whiteSpace: "pre-line",
};

const skills = {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
};

const skillChip = {
    background: "#f1f5f9",
    padding: "6px 14px",
    borderRadius: 999,
    fontSize: 14,
    fontWeight: 500,
};

const actions = {
    marginTop: 32,
    display: "flex",
    gap: 14,
    flexWrap: "wrap",
};

const editBtn = {
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    padding: "12px 22px",
    borderRadius: 10,
    fontWeight: 600,
    cursor: "pointer",
};

const deleteBtn = {
    background: "#fee2e2",
    color: "#b91c1c",
    border: "none",
    padding: "12px 22px",
    borderRadius: 10,
    fontWeight: 600,
    cursor: "pointer",
};