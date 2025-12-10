// screens/JobFullDetailJobScreen.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
    getFirestore,
    doc,
    getDoc,
    onSnapshot,
    updateDoc,
    arrayUnion,
    arrayRemove,
    increment,
    collection,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../firbase/Firebase";
import { useNavigate } from "react-router-dom";
import { deleteDoc } from "firebase/firestore";


// Optional notification service
const NotificationService = { notifications: [] };

// Helper: time ago
function timeAgo(createdAt) {
    const diff = Date.now() - createdAt.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default function Job_24DetailJobScreen() {
    const { id: jobId } = useParams();
    const auth = getAuth();
    const dbFirestore = getFirestore();

    const [job, setJob] = useState(null);
    const [isApplied, setIsApplied] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [jobLoading, setJobLoading] = useState(true);
    const [jobError, setJobError] = useState(null);


    const navigate = useNavigate();

    const handleEditJob = () => {
        // Navigate to your job edit page with job ID
        navigate("/client-dashbroad2/clienteditjob", { state: { jobData: job } });
    };

    const handleDeleteJob = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this job?");
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(dbFirestore, "jobs_24h", jobId));
            alert("Job deleted successfully!");
            navigate(-1); // go back after deletion
        } catch (err) {
            console.error("Delete job error:", err);
            alert("Failed to delete job.");
        }
    };


    // Load job realtime
    useEffect(() => {
        if (!jobId) return;
        const ref = doc(dbFirestore, "jobs_24h", jobId);
        const unsub = onSnapshot(
            ref,
            (snap) => {
                if (!snap.exists()) {
                    setJob(null);
                    setJobLoading(false);
                    return;
                }
                const data = snap.data();
                const createdAt = data.created_at?.toDate?.() || new Date();
                const applicants = Array.isArray(data.applicants) ? data.applicants : [];
                const userId = auth.currentUser?.uid || "";
                setIsApplied(applicants.some((a) => a.freelancerId === userId));

                setJob({
                    id: snap.id,
                    title: data.title || "",
                    description: data.description || "",
                    budgetFrom: data.budget_from ?? "",
                    budgetTo: data.budget_to ?? "",
                    timeline: data.timeline || "",
                    category: data.category || "",
                    subCategory: data.sub_category || "",
                    applicantsCount: data.applicants_count ?? 0,
                    views: data.views ?? 0,
                    skills: Array.isArray(data.skills) ? data.skills : [],
                    tools: Array.isArray(data.tools) ? data.tools : [],
                    createdAt,
                    userId: data.userId || "",
                });

                setJobLoading(false);
            },
            (err) => {
                console.error(err);
                setJobError(err);
                setJobLoading(false);
            }
        );
        return () => unsub();
    }, [jobId, auth, dbFirestore]);

    // Load favorite status
    useEffect(() => {
        const user = auth.currentUser;
        if (!user || !jobId) return;
        const uRef = doc(dbFirestore, "users", user.uid);
        const unsub = onSnapshot(
            uRef,
            (snap) => {
                if (!snap.exists()) return;
                const favList = Array.isArray(snap.data()?.favoriteJobs) ? snap.data().favoriteJobs : [];
                setIsFavorite(favList.includes(jobId));
            },
            (err) => console.error(err)
        );
        return () => unsub();
    }, [jobId, auth, dbFirestore]);

    // Apply to job
    async function handleApply() {
        console.log("Apply clicked");
        if (isApplied) return;
        const user = auth.currentUser;
        if (!user || !job) return alert("Please login first.");

        try {
            const userId = user.uid;
            const freelancerSnap = await getDoc(doc(dbFirestore, "users", userId));
            const freelancer = freelancerSnap.data() || {};
            const freelancerName = `${freelancer.firstName || ""} ${freelancer.lastName || ""}`.trim();
            const freelancerImage = freelancer.profileImage || "";

            const jobRef = doc(dbFirestore, "jobs_24h", jobId);
            const jobSnap = await getDoc(jobRef);
            const jobDoc = jobSnap.data() || {};
            const jobTitle = jobDoc.title || "";
            const clientUid = jobDoc.userId || "";

            const applicants = Array.isArray(jobDoc.applicants) ? jobDoc.applicants : [];
            if (applicants.some((a) => a.freelancerId === userId)) {
                setIsApplied(true);
                return alert("You have already applied!");
            }

            await updateDoc(jobRef, {
                applicants: arrayUnion({ freelancerId: userId, name: freelancerName, profileImage: freelancerImage, appliedAt: new Date() }),
                applicants_count: increment(1),
            });

            await addDoc(collection(dbFirestore, "notifications"), {
                title: jobTitle,
                body: `${freelancerName} applied for ${jobTitle}`,
                type: "application",
                freelancerName,
                freelancerImage,
                freelancerId: userId,
                jobTitle,
                jobId,
                clientUid,
                timestamp: serverTimestamp(),
                read: false,
            });

            setIsApplied(true);
            alert("Applied successfully!");
        } catch (e) {
            console.error(e);
            alert("Something went wrong!");
        }
    }

    // Toggle favorite
    async function toggleBookmark() {
        const user = auth.currentUser;
        if (!user) return alert("Please login to save jobs.");
        const userRef = doc(dbFirestore, "users", user.uid);
        try {
            if (isFavorite) await updateDoc(userRef, { favoriteJobs: arrayRemove(jobId) });
            else await updateDoc(userRef, { favoriteJobs: arrayUnion(jobId) });
            setIsFavorite(!isFavorite);
        } catch (e) {
            console.error(e);
        }
    }

    if (jobLoading) return <div style={{ padding: 40 }}>Loading...</div>;
    if (jobError) return <div style={{ padding: 40 }}>Error: {jobError.message}</div>;
    if (!job) return <div style={{ padding: 40 }}>Job not found ❌</div>;

    const { title, description, budgetFrom, budgetTo, timeline, skills, tools, views, createdAt } = job;

    return (
        <div style={{ padding: 20, maxWidth: 900, margin: "0 auto", background: "#fff", borderRadius: 12, fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 10 }}>{title}</h1>
            <p style={{ color: "#777", marginBottom: 8 }}><strong>Category:</strong> {job.category || "Not specified"}</p>
            <div style={{ marginBottom: 20, background: "#f7f7f7", padding: 12, borderRadius: 8 }}>
                💰 <strong>Budget:</strong> ₹{budgetFrom} - ₹{budgetTo}
            </div>
            <p style={{ color: "#777", marginBottom: 20 }}>⏱ Posted: {createdAt?.toLocaleDateString()}</p>

            <h3>Description</h3>
            <p style={{ lineHeight: 1.6, color: "#555", whiteSpace: "pre-line" }}>{description}</p>

            {skills?.length > 0 && (
                <div style={{ margin: "20px 0" }}>
                    <h3>Skills</h3>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        {skills.map((s, i) => <div key={i} style={{ background: "#e8f0ff", padding: "6px 12px", borderRadius: 8 }}>{s}</div>)}
                    </div>
                </div>
            )}

            <div style={{ display: "flex", gap: 12 }}>
                {/* <button
                    onClick={isApplied ? undefined : handleApply}
                    disabled={isApplied}
                >
                    {isApplied ? "Applied" : "Apply"}
                </button>
                <button onClick={toggleBookmark} style={{ padding: "10px 18px", borderRadius: 8, border: "none", background: isFavorite ? "#ff4747" : "#ff9800", color: "#fff" }}>
                    {isFavorite ? "Favorited" : "Save Job"}
                </button> */}

                <div style={{ display: "flex", gap: 12 }}>
                    <button
                        onClick={handleEditJob}
                        style={{
                            padding: "10px 18px",
                            borderRadius: 8,
                            border: "none",
                            background: "#4caf50",
                            color: "#fff",
                            cursor: "pointer"
                        }}
                    >
                        Edit Job
                    </button>

                    <button
                        onClick={handleDeleteJob}
                        style={{
                            padding: "10px 18px",
                            borderRadius: 8,
                            border: "none",
                            background: "#f44336",
                            color: "#fff",
                            cursor: "pointer"
                        }}
                    >
                        Delete Job...
                    </button>
                </div>

            </div>
        </div>
    );
}