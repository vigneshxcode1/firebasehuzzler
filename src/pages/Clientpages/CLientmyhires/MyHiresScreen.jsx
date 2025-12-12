// src/screens/MyHiresScreen.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../firbase/Firebase"; // ✅ UNMA existing config file (config object illa)
import { deleteDoc } from "firebase/firestore";

// --------------------------
// Rubik font inject (single time)
// --------------------------
if (typeof document !== "undefined" && !document.getElementById("myhires-style")) {
  const style = document.createElement("style");
  style.id = "myhires-style";
  style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap');

    :root {
      --mh-yellow: #FDFD96;
      --mh-purple: #7C3CFF;
      --mh-text: #111827;
    }

    body {
      font-family: 'Rubik', system-ui, -apple-system, BlinkMacSystemFont,
        'Segoe UI', sans-serif !important;
      background-color: #ffffff;
    }
  `;
  document.head.appendChild(style);
}


const styles = {

  deleteBtn: {
  padding: "10px 14px",
  borderRadius: 10,
  backgroundColor: "#EF4444",
  cursor: "pointer",
},
deleteBtnText: {
  fontSize: 12,
  fontWeight: 400,
  color: "#FFFFFF",
  whiteSpace: "nowrap",
},

  page: {
    minHeight: "100vh",
    backgroundColor: "#FFFFFF",
    fontFamily:
      "'Rubik', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  container: {
    maxWidth: 600,
    margin: "0 auto",
    padding: "12px 16px 24px 16px",
    display: "flex",
    flexDirection: "column",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: 14,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    cursor: "pointer",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    fontWeight: 500,
    color: "#111827",
  },
  topTabsRow: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    marginTop: 4,
  },
  topTab: (active) => ({
    padding: "8px 64px",
    borderRadius: "40px 40px 0 0",
    backgroundColor: active ? "#7C3CFF" : "transparent",
    transition: "background-color 0.2s ease",
    cursor: "pointer",
  }),
  topTabText: (active) => ({
    fontSize: 16,
    fontWeight: 500,
    color: active ? "#FFFFFF" : "#111827",
    whiteSpace: "nowrap",
  }),
  innerTabsRow: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    marginTop: 16,
    marginBottom: 12,
  },
  innerTabWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
  },
  innerTabLabel: {
    fontSize: 16,
    fontWeight: 500,
    color: "#111827",
  },
  innerTabBar: (active) => ({
    marginTop: 4,
    height: 5,
    width: 120,
    borderRadius: 999,
    backgroundColor: active ? "#FDFD96" : "transparent",
    transition: "background-color 0.2s ease",
  }),
  listWrapper: {
    marginTop: 4,
    flex: 1,
    overflowY: "auto",
    paddingBottom: 16,
  },
  emptyText: {
    marginTop: 40,
    textAlign: "center",
    fontSize: 16,
    color: "#6B7280",
  },
  card: {
    marginBottom: 14,
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#FDFD96",
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    objectFit: "cover",
    flexShrink: 0,
  },
  cardTextCol: {
    marginLeft: 14,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  cardName: {
    fontSize: 20,
    fontWeight: 500,
    color: "#111827",
  },
  cardRole: {
    fontSize: 14,
    fontWeight: 400,
    color: "#6B7280",
  },
  cardSpacer: {
    flex: 1,
  },
  chatBtn: {
    padding: "10px 14px",
    borderRadius: 10,
    backgroundColor: "#7C3CFF",
    cursor: "pointer",
  },
  chatBtnText: {
    fontSize: 12,
    fontWeight: 400,
    color: "#FFFFFF",
    whiteSpace: "nowrap",
  },
};


const handleDeleteRequest = async (id) => {
  try {
    await deleteDoc(doc(db, "myWorks", id));
    alert("Request deleted successfully!");
  } catch (err) {
    console.error("Delete error:", err);
    alert("Failed to delete request");
  }
};


export default function MyHiresScreen() {
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState("Hired"); // default as Flutter
  const [selectedInnerTabIndex, setSelectedInnerTabIndex] = useState(0); // 0=Work, 1=24 Hours

  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const [items, setItems] = useState([]);
  const [listLoading, setListLoading] = useState(true);



  //getting freelancre project
 const fetchFreelancerDetails = async (freelancerId) => {
  try {
    const docRef = doc(db, "users", freelancerId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      console.log("Freelancer Details:", snap.data());
      return snap.data();
    } else {
      console.log("No freelancer found");
      return null;
    }
  } catch (err) {
    console.error("Error fetching freelancer:", err);
    return null;
  }
};

  // ------------------ AUTH ------------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setCurrentUser(u || null);
      setUserLoading(false);
    });
    return () => unsub();
  }, []);

  // ------------------ FIRESTORE LIST ------------------
useEffect(() => {
  if (!currentUser) return;

  setListLoading(true);

  let q;

 if (selectedTab === "Requested") {
  q = query(
    collection(db, "collaboration_requests"),
    where("clientId", "==", currentUser.uid),            // ⬅️ sender
    where("status", "==", "sent"),
    where("jobType", "==", selectedInnerTabIndex === 1 ? "24h" : "services")
  );

  } else {
    // -------------------------
    //  HIRED → myWorks (accepted only)
    // -------------------------
    q = query(
      collection(db, "myWorks"),
      where("senderId", "==", currentUser.uid),
      where("status", "==", "accepted"),
      where("jobData.is24h", "==", selectedInnerTabIndex === 1)
    );
  }

  const unsub = onSnapshot(
    q,
    async (snap) => {
      const promises = snap.docs.map(async (docSnap) => {
        const data = docSnap.data();
        const receiverId = data.receiverId;

        let userProfile = null;
        try {
          const uRef = doc(db, "users", receiverId);
          const uSnap = await getDoc(uRef);
          if (uSnap.exists()) userProfile = uSnap.data();
        } catch (err) {
          console.error("Error fetching user profile", err);
        }

        return {
          id: docSnap.id,
          ...data,
          receiverId,
          userProfile,
        };
      });

      const list = await Promise.all(promises);
      setItems(list);
      setListLoading(false);
    },
    (err) => {
      console.error("snapshot error:", err);
      setListLoading(false);
    }
  );

  return () => unsub();
}, [currentUser, selectedTab, selectedInnerTabIndex]);

  // ------------------ RENDER ------------------
  if (userLoading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <p style={styles.emptyText}>Please login</p>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate(-1);
  };

  const handleOpenChat = (receiverId, name, image) => {
    navigate("/chat", {
      state: {
        currentUid: currentUser.uid,
        otherUid: receiverId,
        otherName: name,
        otherImage: image,
      },
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.headerRow}>
          <div style={styles.backBtn} onClick={handleBack}>
            {/* simple back icon */}
            <span>&lt;</span>
          </div>
          <div style={styles.headerTitle}>Hire Freelancer</div>
          <div style={{ width: 32 }} /> {/* right spacer */}
        </div>

        {/* TOP TABS (Requested / Hired) */}
        <div style={styles.topTabsRow}>
          {["Requested", "Hired"].map((label) => {
            const active = selectedTab === label;
            return (
              <div
                key={label}
                style={styles.topTab(active)}
                onClick={() => setSelectedTab(label)}
              >
                <span style={styles.topTabText(active)}>{label}</span>
              </div>
            );
          })}
        </div>

        {/* INNER TABS (Work / 24 Hours) */}
        <div style={styles.innerTabsRow}>
          {["Work", "24 Hours"].map((label, index) => {
            const active = selectedInnerTabIndex === index;
            return (
              <div
                key={label}
                style={styles.innerTabWrapper}
                onClick={() => setSelectedInnerTabIndex(index)}
              >
                <span style={styles.innerTabLabel}>{label}</span>
                <div style={styles.innerTabBar(active)} />
              </div>
            );
          })}
        </div>

        {/* LIST */}
      <div style={styles.listWrapper}>
  {listLoading ? (
    <p style={styles.emptyText}>Loading...</p>
  ) : items.length === 0 ? (
    <p style={styles.emptyText}>
      No {selectedTab.toLowerCase()} freelancers found
    </p>
  ) : (


   items.map((item) => {
  const u = item.userProfile || {};

  const name = `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Freelancer";
  const role = (item.jobData && item.jobData.title) || "Freelancer";

  const image =
    u?.profileImage &&
    typeof u.profileImage === "string" &&
    u.profileImage.trim() !== ""
      ? u.profileImage
      : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

      return (
        <div
          key={item.id}
          style={styles.card}
          onClick={async () => {
            const freelancerData = await fetchFreelancerDetails(item.receiverId);

            if (freelancerData) {
              console.log("Open Details Page With:", freelancerData);
              navigate("/freelancer-details", { state: freelancerData });
            }
          }}
        >
          <img src={image} alt={name} style={styles.avatar} />

          <div style={styles.cardTextCol}>
            <div style={styles.cardName}>{name}</div>
            <div style={styles.cardRole}>{role}</div>
          </div>

          <div style={styles.cardSpacer} />

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {selectedTab === "Requested" && (
              <div
                style={styles.deleteBtn}
                onClick={(e) => {
                  e.stopPropagation(); // prevent card click
                  handleDeleteRequest(item.id);
                }}
              >
                <span style={styles.deleteBtnText}>Delete</span>
              </div>
            )}

           
          </div>
        </div>
      );
    })
  )}
</div>

      </div>
    </div>
  );
}


// import React, { useState } from "react";

// import profile from "../../../assets/profile.png";

// // React Icons
// import {
//   IoArrowBack,
//   IoSearch,
//   IoNotificationsOutline,
//   IoChatbubbleEllipsesOutline,
//   IoPersonCircleOutline
// } from "react-icons/io5";

// export default function HireFreelancer() {
//   const [activeTab, setActiveTab] = useState("requested");
//   const [activeSub, setActiveSub] = useState("work");

//   const requestedList = [
//     {
//       name: "Helen Angel",
//       role: "Video Editor",
//       location: "Chennai, Tamilnadu",
//       skills: ["UI Design", "Web Design", "UX", "+2"],
//       date: "10 days ago",
//       image: profile,
//     },
//     {
//       name: "Helen Angel",
//       role: "Video Editor",
//       location: "Chennai, Tamilnadu",
//       skills: ["UI Design", "Web Design", "UX", "+2"],
//       date: "10 days ago",
//       image: profile,
//     },
//   ];

//   const hiredList = requestedList;
//   const listToShow = activeTab === "requested" ? requestedList : hiredList;

//   return (
//     <>
//       {/* Rubik Font */}
//       <link
//         href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap"
//         rel="stylesheet"
//       />

//       <style>{`
//         :root {
//           --purple: #7b2ff7;
//           --purple-light: rgba(123,47,247,0.15);
//           --white: #fff;
//           --card-shadow: 0 8px 28px rgba(0,0,0,0.08);
//         }

//         * {
//           font-family: "Rubik", sans-serif !important;
//         }

//         .hire-root {
//           display: flex;
//           min-height: 100vh;
//           // background: linear-gradient(180deg, #faf7cd, #f0eaff);
//           margin-left:-200px;
         
//                   }

//         .hire-content {
//           flex: 1;
//           padding: 30px 40px;
//           margin-left: 200px;
//         }

//         /* HEADER */
//         .hire-header {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//         }

//         .hire-left {
//           display: flex;
//           align-items: center;
//           gap: 20px;
//         }

//         .hire-back {
//           width: 42px;
//           height: 42px;
//           border-radius: 12px;
//           background: rgba(255,255,255,0.7);
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           font-size: 22px;
//           cursor: pointer;
//           box-shadow: var(--card-shadow);
//         }

//         .hire-title {
//           font-size: 22px;
//           font-weight: 700;
//         }

//         .hire-icons {
//           display: flex;
//           align-items: center;
//           gap: 15px;
//         }

//         .hire-icon-btn {
//           width: 42px;
//           height: 42px;
//           border-radius: 12px;
//           background: rgba(255,255,255,0.9);
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           font-size: 22px;
//           cursor: pointer;
//           color: #333;
//           box-shadow: var(--card-shadow);
//         }

//         .hire-profile {
//           width: 42px;
//           height: 42px;
//           border-radius: 50%;
//           object-fit: cover;
//           border: 2px solid var(--purple);
//         }

//         /* SEARCH BAR */
//         .hire-search {
//           margin-top: 18px;
//           width: 100%;
//           background: white;
//           padding: 14px 22px;
//           border-radius: 16px;
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           box-shadow: var(--card-shadow);
//         }

//         .hire-search input {
//           border: none;
//           outline: none;
//           width: 100%;
//           font-size: 15px;
//         }

//         /* TABS */
//         .hire-tabs {
//           width: 350px;
//           margin: 25px auto;
       
//           padding: 8px;
//           border-radius: 40px;
//           display: flex;
//         }

//         .hire-tab {
//           flex: 1;
//           text-align: center;
//           padding: 10px 0;
//           font-weight: 600;
//           border-radius: 30px;
//           cursor: pointer;
//           font-size: 14px;
        
//         }

//         .hire-tab.active {
//           background: var(--purple);
//           color: white;
//         }

//         /* SUBTOGGLE BAR */
//         .hire-sub-wrapper {
//           width: 100%;
//           background: rgba(255,255,255,0.7);
//           padding: 10px;
//           border-radius: 20px;
//           display: flex;
//           align-items: center;
//           margin-bottom: 25px;
//           box-shadow: var(--card-shadow);
//         }

//         .hire-sub-container {
//           display: flex;
//           gap: 20px;
//         }

//         .hire-sub {
//           padding: 6px 14px;
//           border-radius: 12px;
//           cursor: pointer;
//           font-weight: 500;
//         }

//         .hire-sub.active {
//           background: var(--purple);
//           color: white;
//         }

//         .hire-request-btn {
//           margin-left: auto;
//           background: var(--purple);
//           color: white;
//           padding: 7px 18px;
//           border-radius: 20px;
//           cursor: pointer;
//           font-size: 14px;
//           font-weight: 600;
//         }

//         /* CARD GRID */
//         .hire-grid {
//           display: grid;
//           grid-template-columns: repeat(2, 1fr);
//           gap: 22px;
//         }

//         .hire-card {
//           background: white;
//           border-radius: 16px;
//           overflow: hidden;
//           box-shadow: var(--card-shadow);
//         }

//         .hire-card-top {
//           height: 110px;
//           background: linear-gradient(90deg, #7b2ff7, #a066ff);
//           position: relative;
//         }

//         .hire-card-img {
//           width: 75px;
//           height: 75px;
//           border-radius: 50%;
//           object-fit: cover;
//           position: absolute;
//           bottom: -38px;
//           left: 50%;
//           transform: translateX(-50%);
//           border: 4px solid white;
//         }

//         .hire-date {
//           position: absolute;
//           top: 10px;
//           right: 10px;
//           padding: 6px 12px;
//           background: white;
//           border-radius: 10px;
//           font-size: 12px;
//           font-weight: 600;
//         }

//         .hire-card-body {
//           padding: 50px 20px 20px;
//           text-align: center;
//         }

//         .hire-name {
//           font-size: 17px;
//           font-weight: 700;
//         }

//         .hire-role,
//         .hire-location {
//           font-size: 13px;
//           color: #777;
//         }

//         .hire-skills {
//           margin: 14px 0;
//           display: flex;
//           justify-content: center;
//           gap: 6px;
//           flex-wrap: wrap;
//         }

//         .hire-skill {
//           background: var(--purple-light);
//           color: #4a2bb3;
//           padding: 4px 10px;
//           border-radius: 8px;
//           font-size: 12px;
//         }

//         .hire-btn {
//           width: 100%;
//           background: var(--purple);
//           padding: 10px 0;
//           border: none;
//           border-radius: 12px;
//           color: white;
//           font-weight: 600;
//           margin-top: 10px;
//           cursor: pointer;
//         }
//       `}</style>

//       <div className="hire-root">
     

//         <div className="hire-content">

//           {/* HEADER ROW */}
//           <div className="hire-header">

//             <div className="hire-left">
//               <div className="hire-back">
//                 <IoArrowBack />
//               </div>

//               <div className="hire-title">Hire Freelancer</div>
//             </div>

//             <div className="hire-icons">
//               <div className="hire-icon-btn">
//                 <IoNotificationsOutline />
//               </div>

//               <div className="hire-icon-btn">
//                 <IoChatbubbleEllipsesOutline />
//               </div>

//               <img src={profile} className="hire-profile" />
//             </div>
//           </div>

//           {/* SEARCH BAR */}
//           <div className="hire-search">
//             <IoSearch size={20} />
//             <input placeholder="Search freelancer..." />
//           </div>

//           {/* MAIN TABS */}
//           <div className="hire-tabs">
//             <div
//               className={`hire-tab ${activeTab === "requested" ? "active" : ""}`}
//               onClick={() => setActiveTab("requested")}
//             >
//               Requested
//             </div>

//             <div
//               className={`hire-tab ${activeTab === "hired" ? "active" : ""}`}
//               onClick={() => setActiveTab("hired")}
//             >
//               Hired
//             </div>
//           </div>

//           {/* SUBTOGGLE BAR */}
//           <div className="hire-sub-wrapper">
//             <div className="hire-sub-container">
//               <div
//                 className={`hire-sub ${activeSub === "work" ? "active" : ""}`}
//                 onClick={() => setActiveSub("work")}
//               >
//                 Work
//               </div>

//               <div
//                 className={`hire-sub ${activeSub === "hours" ? "active" : ""}`}
//                 onClick={() => setActiveSub("hours")}
//               >
//                 24 Hours
//               </div>
//             </div>

//             <div className="hire-request-btn">Request</div>
//           </div>

//           {/* CARD GRID */}
//           <div className="hire-grid">
//             {listToShow.map((item, i) => (
//               <div className="hire-card" key={i}>
//                 <div className="hire-card-top">
//                   {activeTab === "requested" && (
//                     <div className="hire-date">{item.date}</div>
//                   )}
//                   <img src={item.image} className="hire-card-img" />
//                 </div>

//                 <div className="hire-card-body">
//                   <div className="hire-name">{item.name}</div>
//                   <div className="hire-role">{item.role}</div>
//                   <div className="hire-location">{item.location}</div>

//                   <div className="hire-skills">
//                     {item.skills.map((s, idx) => (
//                       <div className="hire-skill" key={idx}>{s}</div>
//                     ))}
//                   </div>

//                   <button className="hire-btn">
//                     {activeTab === "requested" ? "Delete Request" : "View Chat"}
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//         </div>
//       </div>
//     </>
//   );
// }

