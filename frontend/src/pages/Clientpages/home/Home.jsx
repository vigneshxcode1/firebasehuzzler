import React, { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import { db, storage } from "../../../firbase/Firebase";
import { collection, getDocs } from "firebase/firestore";
import { ref as storageRef, listAll, getDownloadURL } from "firebase/storage";
import "./Home.css"

const ClientHome = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const snapshot = await getDocs(collection(db, "myWorks"));

        const works = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const data = doc.data();

            let sample_projects = [];
            if (data.sample_projects_folder) {
              const folderRef = storageRef(storage, data.sample_projects_folder);
              const list = await listAll(folderRef);
              sample_projects = await Promise.all(
                list.items.map((item) => getDownloadURL(item))
              );
            }

            
            const job = data.jobData || {};

            return {
              _id: doc.id,

              ServiceTitle: job.title || "Untitled",
              Category: job.category || "No category",
              Des: job.description || "No description",
              Skills: job.skills || [],
              minprice: job.budget_from || 0,
              maxprice: job.budget_to || 0,

              sample_projects,
            };
          })
        );

        setProjects(works);
      } catch (error) {
        console.error("🔥 Firestore Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <main className="dashboard">
      <div className="page-wrapper">
        <h2 className="title">Available Services</h2>

        <div className="work-grid">
          {projects.map((work) => (
            <div className="work-card" key={work._id}>
              <h3>{work.ServiceTitle}</h3>
              <p>{work.Category}</p>
              <p>{work.Des}</p>

              <div className="skills-box">
                {work.Skills.map((s, i) => (
                  <span key={i} className="skill-chip">
                    {s}
                  </span>
                ))}
              </div>

              <p className="price">
                ₹{work.minprice} - ₹{work.maxprice}
              </p>

              <div className="samples">
                {work.sample_projects.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                    View Sample {i + 1}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="add-btn">
        <PlusCircle size={24} />
      </button>
    </main>
  );
};

export default ClientHome;
