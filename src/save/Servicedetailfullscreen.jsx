// // screens/ServiceFullDetailScreen.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getAuth } from "firebase/auth";
// import {
//     doc,
//     onSnapshot,
//     deleteDoc,
//     getFirestore,
// } from "firebase/firestore";

// export default function ServiceFullDetailScreen() {
//     const { id } = useParams();
//     const auth = getAuth();
//     const db = getFirestore();
//     const navigate = useNavigate();

//     const [service, setService] = useState(null);
//     const [loading, setLoading] = useState(true);




//     useEffect(() => {
//         if (!id) return;

//         const ref = doc(db, "services", id);
//         const unsub = onSnapshot(ref, (snap) => {
//             if (!snap.exists()) {
//                 setService(null);
//                 setLoading(false);
//                 return;
//             }

//             const data = snap.data();
//             setService({
//                 id: snap.id,
//                 title: data.title || "",
//                 description: data.description || "",
//                 budgetFrom: data.budget_from ?? 0,
//                 budgetTo: data.budget_to ?? 0,
//                 category: data.category || "",
//                 subCategory: data.subCategory || "",
//                 skills: data.skills || [],
//                 createdAt: data.createdAt?.toDate?.() || new Date(),
//                 userId: data.userId,
//             });

//             setLoading(false);
//         });

//         return () => unsub();
//     }, [id, db]);



//     const handleDelete = async () => {
//         if (!window.confirm("Delete this service?")) return;
//         await deleteDoc(doc(db, "services", id));
//         alert("Service deleted");
//         navigate(-1);
//     };

//     if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
//     if (!service) return <div style={{ padding: 40 }}>Service not found ❌</div>;

//     const isOwner = auth.currentUser?.uid === service.userId;

//     return (
//         <div style={page}>
//             <div style={card}>
//                 {/* HEADER */}
//                 <div style={header}>
//                     <div>
//                         <h1 style={title}>{service.title}</h1>
//                         <div style={budget}>
//                             ₹{service.budgetFrom} – ₹{service.budgetTo}
//                         </div>
//                         <p style={category}>
//                             {service.category}
//                             {service.subCategory && ` • ${service.subCategory}`}
//                         </p>
//                     </div>


//                 </div>

//                 <p style={date}>
//                     Posted on {service.createdAt.toLocaleDateString()}
//                 </p>

//                 {/* DESCRIPTION */}
//                 <section style={section}>
//                     <h3 style={sectionTitle}>Description</h3>
//                     <p style={desc}>{service.description}</p>
//                 </section>

//                 {/* SKILLS */}
//                 {service.skills.length > 0 && (
//                     <section style={section}>
//                         <h3 style={sectionTitle}>Skills</h3>
//                         <div style={skills}>
//                             {service.skills.map((s, i) => (
//                                 <span key={i} style={skillChip}>{s}</span>
//                             ))}
//                         </div>
//                     </section>
//                 )}

//                 {/* OWNER ACTIONS */}
//                 {isOwner && (
//                     <div style={actions}>
//                         <button
//                             style={editBtn}
//                             onClick={() =>
//                                 navigate(
//                                     `/freelance-dashboard/freelanceredit-service/${service.id}`,
//                                     { state: { service } }
//                                 )
//                             }
//                         >
//                             Edit Service
//                         </button>

//                         <button style={deleteBtn} onClick={handleDelete}>
//                             Delete
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );

// }


// const page = {
//     minHeight: "100vh",
//     background: "#f9fafb",
//     padding: "40px 16px",
// };

// const card = {
//     maxWidth: 900,
//     margin: "0 auto",
//     background: "#ffffff",
//     borderRadius: 16,
//     padding: 24,
//     boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
// };

// const header = {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     gap: 20,
//     flexWrap: "wrap",
// };

// const title = {
//     fontSize: 26,
//     fontWeight: 700,
//     marginBottom: 6,
// };

// const category = {
//     fontSize: 14,
//     color: "#6b7280",
// };

// const budget = {
//     background: "#eef2ff",
//     color: "#4f46e5",
//     padding: "10px 16px",
//     borderRadius: 12,
//     fontWeight: 700,
//     fontSize: 16,
//     whiteSpace: "nowrap",
// };

// const date = {
//     marginTop: 12,
//     fontSize: 13,
//     color: "#9ca3af",
// };

// const section = {
//     marginTop: 28,
// };

// const sectionTitle = {
//     fontSize: 18,
//     fontWeight: 600,
//     marginBottom: 10,
// };

// const desc = {
//     fontSize: 15,
//     lineHeight: 1.7,
//     color: "#374151",
//     whiteSpace: "pre-line",
// };

// const skills = {
//     display: "flex",
//     flexWrap: "wrap",
//     gap: 10,
// };

// const skillChip = {
//     background: "#f1f5f9",
//     padding: "6px 14px",
//     borderRadius: 999,
//     fontSize: 14,
//     fontWeight: 500,
// };

// const actions = {
//     marginTop: 32,
//     display: "flex",
//     gap: 14,
//     flexWrap: "wrap",
// };

// const editBtn = {
//     background: "#4f46e5",
//     color: "#fff",
//     border: "none",
//     padding: "12px 22px",
//     borderRadius: 10,
//     fontWeight: 600,
//     cursor: "pointer",
// };

// const deleteBtn = {
//     background: "#fee2e2",
//     color: "#b91c1c",
//     border: "none",
//     padding: "12px 22px",
//     borderRadius: 10,
//     fontWeight: 600,
//     cursor: "pointer",
// };


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
import { Bookmark, Clock, Share2Icon } from "lucide-react";
import { FiEye } from "react-icons/fi";

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
  const daysAgo = Math.floor(
    (Date.now() - service.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div style={overlay}>
      <div style={card}>
        {/* HEADER */}
        <div style={topBar}>
          <h2 style={heading}>Project Details</h2>

          <div style={iconRow}>
            <button style={iconBtn} onClick={() => alert("Saved")}><Bookmark/></button>
            <button style={iconBtn} onClick={() => alert("Shared")}><Share2Icon/></button>
            <button style={iconBtn} onClick={() => navigate(-1)}>✕</button>
          </div>
        </div>

        {/* TITLE */}
        <h1 style={title}>{service.title}</h1>

        {/* META ROW */}
        <div style={metaRow}>
          <div>
            <strong>Budget</strong>
            <div>₹{service.budgetFrom} – ₹{service.budgetTo}</div>
          </div>
          <div>
            <strong>Timeline</strong>
            <div>2 – 3 weeks</div>
          </div>
          <div>
            <strong>Location</strong>
            <div>Remote</div>
          </div>
        </div>

        {/* IMPRESSIONS */}
        <div style={impression}>
          <span><FiEye/>29 Impression</span>
          <span><Clock size={13}/> {daysAgo} days ago</span>
        </div>

        {/* SKILLS */}
        {service.skills.length > 0 && (
          <>
            <h3 style={sectionTitle}>Skills Required</h3>
            <div style={skills}>
              {service.skills.map((s, i) => (
                <span key={i} style={skillChip}>{s}</span>
              ))}
            </div>
          </>
        )}

        {/* DESCRIPTION */}
        <h3 style={sectionTitle}>Project Description</h3>
        <p style={desc}>{service.description}</p>

        {/* ACTIONS */}
        {isOwner && (
          <div style={actions}>
            <button
              style={deleteBtn}
              onClick={handleDelete}
            >
              Delete this service
            </button>

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
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const overlay = {
  minHeight: "100vh",
  background: "rgba(0,0,0,0.35)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 16,
};

const card = {
  width: "100%",
  maxWidth: 520,
  background: "#fff",
  borderRadius: 16,
  padding: 24,
  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
};

const topBar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
};

const heading = {
  fontSize: 16,
  fontWeight: 600,
  color: "#6b7280",
};

const iconRow = {
  display: "flex",
  gap: 10,
};

const iconBtn = {
  width: 32,
  height: 32,
  borderRadius: "50%",
  border: "1px solid #e5e7eb",
  background: "#fff",
  cursor: "pointer",
};

const title = {
  fontSize: 22,
  fontWeight: 700,
  marginBottom: 16,
};

const metaRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  background: "#f9fafb",
  padding: 14,
  borderRadius: 12,
  fontSize: 14,
};

const impression = {
  marginTop: 10,
  fontSize: 13,
  color: "#6b7280",
  display: "flex",
  gap: 8,
};

const sectionTitle = {
  marginTop: 22,
  marginBottom: 10,
  fontSize: 16,
  fontWeight: 600,
};

const skills = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
};

const skillChip = {
  background: "#FEF08A",
  color: "#000",
  padding: "6px 12px",
  borderRadius: 999,
  fontSize: 13,
  fontWeight: 500,
};

const desc = {
  fontSize: 14,
  lineHeight: 1.7,
  color: "#374151",
  whiteSpace: "pre-line",
};

const actions = {
  marginTop: 28,
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
};

const editBtn = {
  flex: 1,
  background: "#7c3aed",
  color: "#fff",
  border: "none",
  padding: "12px",
  borderRadius: 10,
  fontWeight: 600,
  cursor: "pointer",
};

const deleteBtn = {
  flex: 1,
  background: "#fff",
  color: "#7c3aed",
  border: "1px solid #c4b5fd",
  padding: "12px",
  borderRadius: 10,
  fontWeight: 600,
  cursor: "pointer",
};