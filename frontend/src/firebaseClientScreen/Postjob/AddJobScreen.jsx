// src/pages/AddJobScreen.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firbase/Firebase";

export default function AddJobScreen() {
  const navigate = useNavigate();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [selectedTab, setSelectedTab] = useState("Works");

  const [worksJobs, setWorksJobs] = useState([]);
  const [jobs24h, setJobs24h] = useState([]);
  const [loadingWorks, setLoadingWorks] = useState(true);
  const [loading24h, setLoading24h] = useState(true);

  const [snackMsg, setSnackMsg] = useState(null);
  const snackTimerRef = useRef(null);

  useEffect(() => {
    showSnack("Welcome!");

    return () => {
      if (snackTimerRef.current) clearTimeout(snackTimerRef.current);
    };
  }, []);

  function showSnack(message, ms = 2500) {
    setSnackMsg(message);

    if (snackTimerRef.current) clearTimeout(snackTimerRef.current);
    snackTimerRef.current = setTimeout(() => setSnackMsg(null), ms);
  }

  // Fetch jobs under "jobs" collection
  useEffect(() => {
    if (!currentUser) {
      setWorksJobs([]);
      setLoadingWorks(false);
      return;
    }

    setLoadingWorks(true);

    const q = query(
      collection(db, "jobs"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        setWorksJobs(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoadingWorks(false);
      },
      (err) => {
        console.error("jobs error:", err);
        setLoadingWorks(false);
      }
    );

    return () => unsub();
  }, [currentUser]);

  // Fetch jobs under "jobs_24h"
  useEffect(() => {
    if (!currentUser) {
      setJobs24h([]);
      setLoading24h(false);
      return;
    }

    setLoading24h(true);

    const q24 = query(
      collection(db, "jobs_24h"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsub24 = onSnapshot(q24,(snapshot) => {
        setJobs24h(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading24h(false);
      },
      (err) => {
        console.error("jobs_24h error:", err);
        setLoading24h(false);
      }
    );

    return () => unsub24();
  }, [currentUser]);

  async function moveJobToPaused(job) {
    try {
      await setDoc(doc(db, "pausedJobs", job.id), job);
      await deleteDoc(doc(db, "jobs", job.id));
      showSnack("Job moved to Paused");
    } catch (error) {
      console.error("moveJobToPaused error:", error);
      showSnack("Failed to pause job");
    }
  }

  async function deleteJob(jobId) {
    try {
      await deleteDoc(doc(db, "jobs", jobId));
      showSnack("Job deleted");
    } catch (error) {
      console.error("deleteJob error:", error);
      showSnack("Failed to delete job");
    }
  }

  function onSearchClick() {
    navigate("/client-dashbroad2/client-job-search");
  }

  function EmptyState({ title, subtitle, buttonText, onButton }) {
    return (
      <div className="ajs-empty">
        <img
          src="/assets/freelancer_hs_illustration.png"
          alt="empty"
          className="ajs-empty-illustration"
        />
        <h3 className="ajs-empty-title">{title}</h3>
        <p className="ajs-empty-sub">{subtitle}</p>
        <button className="ajs-primary-btn" onClick={onButton}>
          {buttonText}
        </button>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="ajs-avatar-placeholder">
        <div className="ajs-circle-avatar">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zM3 21c0-3.866 3.134-7 7-7h4c3.866 0 7 3.134 7 7v1H3v-1z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="ajs-root">
      <div className="ajs-header">
        <div className="ajs-header-inner">
          <div className="ajs-title">Job Section</div>
        </div>

        <div className="ajs-search-wrap">
          <div className="ajs-search" onClick={onSearchClick}>
            <span className="ajs-search-icon">🔍</span>
            <input
              readOnly
              placeholder="Search"
              className="ajs-search-input"
              onFocus={onSearchClick}
            />
          </div>
        </div>
      </div>

      <div style={{ height: 24 }} />

      <div className="ajs-tabs">
        <div
          className={`ajs-tab ${selectedTab === "Works" ? "active" : ""}`}
          onClick={() => setSelectedTab("Works")}
        >
          Freelancer
        </div>

        <div
          className={`ajs-tab ${selectedTab === "24 hour" ? "active" : ""}`}
          onClick={() => setSelectedTab("24 hour")}
        >
          24 hour
        </div>
      </div>

      <hr className="ajs-divider" />

      <div className="ajs-content">
        {selectedTab === "Works" ? (
          loadingWorks ? (
            <div className="ajs-loading">Loading...</div>
          ) : worksJobs.length === 0 ? (
            <EmptyState
              title="All set – just add your first job!"
              subtitle="Post a job with clear details to attract freelancers."
              buttonText="Post a Job"
              onButton={() => navigate("/client-dashbroad2/PostJob")}
            />
          ) : (
            <div className="ajs-list">
              <div className="ajs-post-card" onClick={() => navigate("/client-dashbroad2/PostJob")}>
                <div className="ajs-post-left">
                  <div className="ajs-add-circle">+</div>
                </div>
                <div className="ajs-post-right">
                  <h4>Post a Job</h4>
                  <p>Kickstart your project with a clear job post.</p>
                </div>
              </div>

              {worksJobs.map((job) => (
                <div key={job.id} className="ajs-job-placeholder">
                  <strong>{job.title}</strong>
                  <div className="ajs-job-actions">
                    <button
                      onClick={() =>
                        navigate("/PostJob", {
                          state: { jobData: job, jobId: job.id },
                        })
                      }
                    >
                      Edit
                    </button>

                    <button onClick={() => moveJobToPaused(job)}>Pause</button>

                    <button onClick={() => deleteJob(job.id)}>Delete</button>

                    <button
                      onClick={() =>
                        navigate("/job-detail", { state: { job } })
                      }
                    >
                      View more
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : loading24h ? (
          <div className="ajs-loading">Loading...</div>
        ) : jobs24h.length === 0 ? (
          <EmptyState
            title="Add your first 24h job!"
            subtitle="Post a job that freelancers can respond to quickly."
            buttonText="Post a Job"
            onButton={() => navigate("/client-dashbroad2/add-24hours")}
          />
        ) : (
          <div className="ajs-list">
            <div className="ajs-post-card" onClick={() => navigate("/client-dashbroad2/add-24hours")}>
              <div className="ajs-post-left">
                <div className="ajs-add-circle">+</div>
              </div>
              <div className="ajs-post-right">
                <h4>Post a Job</h4>
                <p>Kickstart your project with a clear 24h job post.</p>
              </div>
            </div>

            {jobs24h.map((job) => (
              <div key={job.id} className="ajs-job-placeholder">
                <strong>{job.title}</strong>

                <div className="ajs-job-actions">
                  <button
                    onClick={() =>
                      navigate("/add-24hours", {
                        state: { jobData: job, jobId: job.id },
                      })
                    }
                  >
                    Edit
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        await setDoc(doc(db, "pausedJobs", job.id), {
                          ...job,
                          id: job.id,
                          is24: true,
                        });
                        await deleteDoc(doc(db, "jobs_24h", job.id));
                        showSnack("Job moved to Paused");
                      } catch (e) {
                        console.error(e);
                        showSnack("Failed to pause job");
                      }
                    }}
                  >
                    Pause
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        await deleteDoc(doc(db, "jobs_24h", job.id));
                        showSnack("Job deleted");
                      } catch (e) {
                        console.error(e);
                        showSnack("Failed to delete job");
                      }
                    }}
                  >
                    Delete
                  </button>

                  <button
                    onClick={() =>
                      navigate("/job-detail-24h", { state: { job } })
                    }
                  >
                    View more
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {snackMsg && <div className="ajs-snack">{snackMsg}</div>}
    </div>
  );
}
