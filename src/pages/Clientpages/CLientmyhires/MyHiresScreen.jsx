

// // src/screens/MyHiresScreen.jsx

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//     collection,
//     query,
//     where,
//     onSnapshot,
//     doc,
//     getDoc,
// } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth, db } from "../../../firbase/Firebase"; // ✅ UNMA existing config file (config object illa)
// import { deleteDoc } from "firebase/firestore";

// // --------------------------
// // Rubik font inject (single time)
// // --------------------------
// if (typeof document !== "undefined" && !document.getElementById("myhires-style")) {
//     const style = document.createElement("style");
//     style.id = "myhires-style";
//     style.innerHTML = `
//  @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap');

//  :root {
//  --mh-yellow: #FDFD96;
//  --mh-purple: #7C3CFF;
//  --mh-text: #111827;
//  }

//  body {
//  font-family: 'Rubik', system-ui, -apple-system, BlinkMacSystemFont,
//  'Segoe UI', sans-serif !important;
//  background-color: #ffffff;
//  }
//  `;
//     document.head.appendChild(style);
// }


// const styles = {

//     deleteBtn: {
//         padding: "10px 14px",
//         borderRadius: 10,
//         backgroundColor: "#EF4444",
//         cursor: "pointer",
//     },
//     deleteBtnText: {
//         fontSize: 12,
//         fontWeight: 400,
//         color: "#FFFFFF",
//         whiteSpace: "nowrap",
//     },

//     page: {
//         minHeight: "100vh",
//         backgroundColor: "#FFFFFF",
//         fontFamily:
//             "'Rubik', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
//     },
//     container: {
//         maxWidth: 600,
//         margin: "0 auto",
//         padding: "12px 16px 24px 16px",
//         display: "flex",
//         flexDirection: "column",
//     },
//     headerRow: {
//         display: "flex",
//         alignItems: "center",
//         marginBottom: 14,
//     },
//     backBtn: {
//         width: 32,
//         height: 32,
//         borderRadius: 999,
//         border: "1px solid rgba(0,0,0,0.08)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         fontSize: 16,
//         cursor: "pointer",
//     },
//     headerTitle: {
//         flex: 1,
//         textAlign: "center",
//         fontSize: 22,
//         fontWeight: 500,
//         color: "#111827",
//     },
//     topTabsRow: {
//         display: "flex",
//         justifyContent: "center",
//         gap: 10,
//         marginTop: 4,
//     },
//     topTab: (active) => ({
//         padding: "8px 64px",
//         borderRadius: "40px 40px 0 0",
//         backgroundColor: active ? "#7C3CFF" : "transparent",
//         transition: "background-color 0.2s ease",
//         cursor: "pointer",
//     }),
//     topTabText: (active) => ({
//         fontSize: 16,
//         fontWeight: 500,
//         color: active ? "#FFFFFF" : "#111827",
//         whiteSpace: "nowrap",
//     }),
//     innerTabsRow: {
//         display: "flex",
//         justifyContent: "space-evenly",
//         alignItems: "flex-start",
//         marginTop: 16,
//         marginBottom: 12,
//     },
//     innerTabWrapper: {
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         cursor: "pointer",
//     },
//     innerTabLabel: {
//         fontSize: 16,
//         fontWeight: 500,
//         color: "#111827",
//     },
//     innerTabBar: (active) => ({
//         marginTop: 4,
//         height: 5,
//         width: 120,
//         borderRadius: 999,
//         backgroundColor: active ? "#FDFD96" : "transparent",
//         transition: "background-color 0.2s ease",
//     }),
//     listWrapper: {
//         marginTop: 4,
//         flex: 1,
//         overflowY: "auto",
//         paddingBottom: 16,
//     },
//     emptyText: {
//         marginTop: 40,
//         textAlign: "center",
//         fontSize: 16,
//         color: "#6B7280",
//     },
//     card: {
//         marginBottom: 14,
//         padding: 16,
//         borderRadius: 10,
//         backgroundColor: "#FDFD96",
//         display: "flex",
//         alignItems: "center",
//     },
//     avatar: {
//         width: 64,
//         height: 64,
//         borderRadius: "50%",
//         objectFit: "cover",
//         flexShrink: 0,
//     },
//     cardTextCol: {
//         marginLeft: 14,
//         display: "flex",
//         flexDirection: "column",
//         gap: 4,
//     },
//     cardName: {
//         fontSize: 20,
//         fontWeight: 500,
//         color: "#111827",
//     },
//     cardRole: {
//         fontSize: 14,
//         fontWeight: 400,
//         color: "#6B7280",
//     },
//     cardSpacer: {
//         flex: 1,
//     },
//     chatBtn: {
//         padding: "10px 14px",
//         borderRadius: 10,
//         backgroundColor: "#7C3CFF",
//         cursor: "pointer",
//     },
//     chatBtnText: {
//         fontSize: 12,
//         fontWeight: 400,
//         color: "#FFFFFF",
//         whiteSpace: "nowrap",
//     },
// };


// const handleDeleteRequest = async (id) => {
//     try {
//         await deleteDoc(doc(db, "myWorks", id));
//         alert("Request deleted successfully!");
//     } catch (err) {
//         console.error("Delete error:", err);
//         alert("Failed to delete request");
//     }
// };


// export default function MyHiresScreen() {
//     const navigate = useNavigate();

//     const [selectedTab, setSelectedTab] = useState("Hired"); // default as Flutter
//     const [selectedInnerTabIndex, setSelectedInnerTabIndex] = useState(0); // 0=Work, 1=24 Hours

//     const [currentUser, setCurrentUser] = useState(null);
//     const [userLoading, setUserLoading] = useState(true);

//     const [items, setItems] = useState([]);
//     const [listLoading, setListLoading] = useState(true);

//     // ------------------ AUTH ------------------
//     useEffect(() => {
//         const unsub = onAuthStateChanged(auth, (u) => {
//             setCurrentUser(u || null);
//             setUserLoading(false);
//         });
//         return () => unsub();
//     }, []);

//     // ------------------ FIRESTORE LIST ------------------
//     useEffect(() => {
//         if (!currentUser) return;

//         setListLoading(true);

//         const q = query(
//             collection(db, "myWorks"),
//             where("senderId", "==", currentUser.uid),
//             where("status", "==", selectedTab === "Requested" ? "sent" : "accepted"),
//             where("jobData.is24h", "==", selectedInnerTabIndex === 1)
//         );

//         const unsub = onSnapshot(
//             q,
//             async (snap) => {
//                 const promises = snap.docs.map(async (docSnap) => {
//                     const data = docSnap.data();
//                     const receiverId = data.receiverId;
//                     let userProfile = null;

//                     try {
//                         const uRef = doc(db, "users", receiverId);
//                         const uSnap = await getDoc(uRef);
//                         if (uSnap.exists()) {
//                             userProfile = uSnap.data();
//                         }
//                     } catch (err) {
//                         console.error("Error fetching user profile", err);
//                     }

//                     return {
//                         id: docSnap.id,
//                         ...data,
//                         receiverId,
//                         userProfile,
//                     };
//                 });

//                 const list = await Promise.all(promises);
//                 setItems(list);
//                 setListLoading(false);
//             },
//             (err) => {
//                 console.error("myWorks snapshot error:", err);
//                 setListLoading(false);
//             }
//         );

//         return () => unsub();
//     }, [currentUser, selectedTab, selectedInnerTabIndex]);

//     // ------------------ RENDER ------------------
//     if (userLoading) {
//         return (
//             <div style={styles.page}>
//                 <div style={styles.container}>
//                     <p>Loading...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (!currentUser) {
//         return (
//             <div style={styles.page}>
//                 <div style={styles.container}>
//                     <p style={styles.emptyText}>Please login</p>
//                 </div>
//             </div>
//         );
//     }

//     const handleBack = () => {
//         navigate(-1);
//     };

//     const handleOpenChat = (receiverId, name, image) => {
//         navigate("/chat", {
//             state: {
//                 currentUid: currentUser.uid,
//                 otherUid: receiverId,
//                 otherName: name,
//                 otherImage: image,
//             },
//         });
//     };

//     return (
//         <div style={styles.page}>
//             <div style={styles.container}>
//                 {/* HEADER */}
//                 <div style={styles.headerRow}>
//                     <div style={styles.backBtn} onClick={handleBack}>
//                         {/* simple back icon */}
//                         <span>&lt;</span>
//                     </div>
//                     <div style={styles.headerTitle}>Hire Freelancer</div>
//                     <div style={{ width: 32 }} /> {/* right spacer */}
//                 </div>

//                 {/* TOP TABS (Requested / Hired) */}
//                 <div style={styles.topTabsRow}>
//                     {["Requested", "Hired"].map((label) => {
//                         const active = selectedTab === label;
//                         return (
//                             <div
//                                 key={label}
//                                 style={styles.topTab(active)}
//                                 onClick={() => setSelectedTab(label)}
//                             >
//                                 <span style={styles.topTabText(active)}>{label}</span>
//                             </div>
//                         );
//                     })}
//                 </div>

//                 {/* INNER TABS (Work / 24 Hours) */}
//                 <div style={styles.innerTabsRow}>
//                     {["Work", "24 Hours"].map((label, index) => {
//                         const active = selectedInnerTabIndex === index;
//                         return (
//                             <div
//                                 key={label}
//                                 style={styles.innerTabWrapper}
//                                 onClick={() => setSelectedInnerTabIndex(index)}
//                             >
//                                 <span style={styles.innerTabLabel}>{label}</span>
//                                 <div style={styles.innerTabBar(active)} />
//                             </div>
//                         );
//                     })}
//                 </div>

//                 {/* LIST */}
//                 <div style={styles.listWrapper}>
//                     {listLoading ? (
//                         <p style={styles.emptyText}>Loading...</p>
//                     ) : items.length === 0 ? (
//                         <p style={styles.emptyText}>
//                             No {selectedTab.toLowerCase()} freelancers found
//                         </p>
//                     ) : (
//                         items.map((item) => {
//                             const u = item.userProfile || {};
//                             const name = `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Freelancer";
//                             const role =
//                                 (item.jobData && item.jobData.title) || "Freelancer";
//                             const image =
//                                 u.profileImage ||
//                                 "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

//                             return (
//                                 <div key={item.id} style={styles.card}>
//                                     <img src={image} alt={name} style={styles.avatar} />

//                                     <div style={styles.cardTextCol}>
//                                         <div style={styles.cardName}>{name}</div>
//                                         <div style={styles.cardRole}>{role}</div>
//                                     </div>

//                                     <div style={styles.cardSpacer} />
//                                     <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

//                                         {selectedTab === "Requested" && (
//                                             <div
//                                                 style={styles.deleteBtn}
//                                                 onClick={() => handleDeleteRequest(item.id)}
//                                             >
//                                                 <span style={styles.deleteBtnText}>Delete</span>
//                                             </div>
//                                         )}

//                                         <div
//                                             style={styles.chatBtn}
//                                             onClick={() =>
//                                                 handleOpenChat(item.receiverId, name, image)
//                                             }
//                                         >
//                                             <span style={styles.chatBtnText}>View chat</span>
//                                         </div>

//                                     </div>




//                                 </div>
//                             );
//                         })
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }











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








// import React, { useEffect, useState } from "react";
// import profile from "../../../assets/profile.png";
// import {
//   IoArrowBack,
//   IoSearch,
//   IoNotificationsOutline,
//   IoChatbubbleEllipsesOutline,
// } from "react-icons/io5";

// import { useNavigate } from "react-router-dom";
// import { getAuth } from "firebase/auth";


// import {
//   collection,
//   onSnapshot,
//   query,
//   where,
//   orderBy,
//   doc,
//   deleteDoc,
// } from "firebase/firestore";

// import { updateDoc } from "firebase/firestore";

// import { db } from "../../../firbase/Firebase";



// export default function HireFreelancer() {
//   const [activeTab, setActiveTab] = useState("requested");
//   const [activeSub, setActiveSub] = useState("work");
//   const [requests, setRequests] = useState([]);
//   const auth = getAuth();

//   const navigate = useNavigate();

//   const getStartMessage = (title) =>
//     `Hi 👋 I’ve reviewed your application for "${title}". Let’s discuss the next steps.`;


//   const markAsRead = async (id) => {
//     await updateDoc(doc(db, "notifications", id), {
//       read: true,
//     });
//   };
//   useEffect(() => {
//     if (!auth.currentUser?.uid) return;

//     const q = query(
//       collection(db, "notifications"),
//       where("clientUid", "==", auth.currentUser.uid),
//       where("type", "==", "application"),
//       orderBy("timestamp", "desc")
//     );

//     const unsub = onSnapshot(q, (snap) => {
//       const list = snap.docs.map((d) => ({
//         id: d.id,
//         ...d.data(),
//       }));
//       setRequests(list);
//     });

//     return () => unsub();
//   }, [auth.currentUser?.uid]);


//   const requestedList = requests.filter((r) => r.read === false);
//   const hiredList = requests.filter((r) => r.read === true);

//   const listToShow =
//     activeTab === "requested" ? requestedList : hiredList;


//   const deleteRequest = async (id) => {
//     if (!window.confirm("Delete this request?")) return;
//     await deleteDoc(doc(db, "notifications", id));
//   };

// console.log(listToShow)
//   return (
//     <>
//       <style>{`
//         * { font-family: "Rubik", sans-serif; }
//         .hire-root { min-height: 100vh; background: #f7f8fc; padding: 30px; }
//         .hire-header { display: flex; justify-content: space-between; align-items: center; }
//         .hire-title { font-size: 22px; font-weight: 700; }
//         .hire-search { margin: 20px 0; background: #fff; padding: 14px 20px; border-radius: 14px; display: flex; gap: 10px; }
//         .hire-search input { border: none; outline: none; width: 100%; }

//         .hire-tabs { display: flex; width: 320px; margin: 0 auto 20px; background: #eee; padding: 6px; border-radius: 30px; }
//         .hire-tab { flex: 1; text-align: center; padding: 10px; cursor: pointer; font-weight: 600; border-radius: 20px; }
//         .hire-tab.active { background: #7b2ff7; color: #fff; }

//         .hire-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(280px,1fr)); gap: 20px; }
//         .hire-card { background: #fff; border-radius: 18px; box-shadow: 0 10px 25px rgba(0,0,0,0.07); overflow: hidden; }
//         .hire-card-top { background: linear-gradient(90deg,#7b2ff7,#a066ff); padding: 30px 0; text-align: center; }
//         .hire-img { width: 70px; height: 70px; border-radius: 50%; border: 4px solid #fff; }
//         .hire-body { padding: 20px; text-align: center; }
//         .hire-name { font-weight: 700; }
//         .hire-role { font-size: 13px; color: #777; margin-bottom: 10px; }
//         .hire-btn { width: 100%; background: #7b2ff7; border: none; color: #fff; padding: 10px; border-radius: 12px; cursor: pointer; margin-top: 10px; }
//       `}</style>

//       <div className="hire-root">
//         <div className="hire-header">
//           <div className="hire-title">Hire Freelancer</div>
//           <div style={{ display: "flex", gap: 14 }}>
//             <IoNotificationsOutline size={22} />
//             <IoChatbubbleEllipsesOutline size={22} />
//           </div>
//         </div>

//         <div className="hire-search">
//           <IoSearch />
//           <input placeholder="Search freelancer..." />
//         </div>

//         {/* TABS */}
//         <div className="hire-tabs">
//           <div
//             className={`hire-tab ${activeTab === "requested" ? "active" : ""}`}
//             onClick={() => setActiveTab("requested")}
//           >
//             Requested ({requestedList.length})
//           </div>
//           <div
//             className={`hire-tab ${activeTab === "hired" ? "active" : ""}`}
//             onClick={() => setActiveTab("hired")}
//           >
//             Hired ({hiredList.length})
//           </div>
//         </div>

//         {/* CARDS */}
//         <div className="hire-grid">
//           {listToShow.map((item) => (
//             <div className="hire-card" key={item.id}>
//               <div className="hire-card-top">
//                 <img src={profile} className="hire-img" />
//               </div>

//               <div className="hire-body">
//                 <div className="hire-name">{item.freelancerName}</div>

//                 <div className="hire-role">{item.title}</div>
//                 <div className="hiretime">{item.timestamp}</div>
//                 <button
//                   className="hire-btn"
//                   onClick={async () => {
//                     if (activeTab === "requested") {
//                       deleteRequest(item.id);
//                     } else {
//                       await markAsRead(item.id);

//                       navigate("/chat", {
//                         state: {
//                           currentUid: auth.currentUser.uid,
//                           otherUid: item.freelancerId,
//                           otherName: item.freelancerName,
//                           otherImage: item.profileImage || "",
//                           initialMessage: getStartMessage(item.title),
//                         },
//                       });
//                     }
//                   }}
//                   style={{
//                     background: activeTab === "requested" ? "#f44336" : "#7b2ff7",
//                   }}
//                 >
//                   {activeTab === "requested" ? "Delete Request" : "View Chat"}
//                 </button>


//               </div>
//             </div>
//           ))}

//           {listToShow.length === 0 && (
//             <p style={{ textAlign: "center", width: "100%" }}>
//               No data found
//             </p>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }







// import React, { useEffect, useState } from "react";
// import profile from "../../../assets/profile.png";
// import {
//     IoArrowBack,
//     IoSearch,
//     IoNotificationsOutline,
//     IoChatbubbleEllipsesOutline,
// } from "react-icons/io5";

// import { useNavigate } from "react-router-dom";
// import { getAuth } from "firebase/auth";


// import {
//     collection,
//     onSnapshot,
//     query,
//     where,
//     orderBy,
//     doc,
//     deleteDoc,
// } from "firebase/firestore";

// import { updateDoc } from "firebase/firestore";

// import { db } from "../../../firbase/Firebase";



// export default function HireFreelancer() {
//     const [activeTab, setActiveTab] = useState("requested");
//     const [activeSub, setActiveSub] = useState("work");
//     const [requests, setRequests] = useState([]);
//     const auth = getAuth();

//     const navigate = useNavigate();

//     const getStartMessage = (title) =>
//         `Hi 👋 I’ve reviewed your application for "${title}". Let’s discuss the next steps.`;


//     const markAsRead = async (id) => {
//         await updateDoc(doc(db, "notifications", id), {
//             read: true,
//         });
//     };

//     function timeAgo(input) {
//         if (!input) return "N/A";
//         let d = input instanceof Timestamp ? input.toDate() : new Date(input);
//         const diff = (Date.now() - d.getTime()) / 1000;
//         if (diff < 60) return `${Math.floor(diff)} sec ago`;
//         if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
//         if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
//         return `${Math.floor(diff / 86400)} days ago`;
//     }

//     useEffect(() => {
//         if (!auth.currentUser?.uid) return;

//         const q = query(
//             collection(db, "notifications"),
//             where("clientUid", "==", auth.currentUser.uid),
//             where("type", "==", "application"),
//             orderBy("timestamp", "desc")
//         );

//         const unsub = onSnapshot(q, (snap) => {
//             const list = snap.docs.map((d) => ({
//                 id: d.id,
//                 ...d.data(),
//             }));
//             setRequests(list);
//         });

//         return () => unsub();
//     }, [auth.currentUser?.uid]);


//     const requestedList = requests.filter((r) => r.read === false);
//     const hiredList = requests.filter((r) => r.read === true);

//     const listToShow =
//         activeTab === "requested" ? requestedList : hiredList;


//     const deleteRequest = async (id) => {
//         if (!window.confirm("Delete this request?")) return;
//         await deleteDoc(doc(db, "notifications", id));
//     };



//     return (
//         <>
//             <style>{`
//         * { font-family: "Rubik", sans-serif; }
//         .hire-root { min-height: 100vh; background: #f7f8fc; padding: 30px; }
//         .hire-header { display: flex; justify-content: space-between; align-items: center; }
//         .hire-title { font-size: 22px; font-weight: 700; }
//         .hire-search { margin: 20px 0; background: #fff; padding: 14px 20px; border-radius: 14px; display: flex; gap: 10px; }
//         .hire-search input { border: none; outline: none; width: 100%; }

//         .hire-tabs { display: flex; width: 320px; margin: 0 auto 20px; background: #eee; padding: 6px; border-radius: 30px; }
//         .hire-tab { flex: 1; text-align: center; padding: 10px; cursor: pointer; font-weight: 600; border-radius: 20px; }
//         .hire-tab.active { background: #7b2ff7; color: #fff; }

//         .hire-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(280px,1fr)); gap: 20px; }
//         .hire-card { background: #fff; border-radius: 18px; box-shadow: 0 10px 25px rgba(0,0,0,0.07); overflow: hidden; }
//         .hire-card-top { background: linear-gradient(90deg,#7b2ff7,#a066ff); padding: 30px 0; text-align: center; }
//         .hire-img { width: 70px; height: 70px; border-radius: 50%; border: 4px solid #fff; }
//         .hire-body { padding: 20px; text-align: center; }
//         .hire-name { font-weight: 700; }
//         .hire-role { font-size: 13px; color: #777; margin-bottom: 10px; }
//         .hire-btn { width: 100%; background: #7b2ff7; border: none; color: #fff; padding: 10px; border-radius: 12px; cursor: pointer; margin-top: 10px; }
//       `}</style>

//             <div className="hire-root">
//                 <div className="hire-header">
//                     <div className="hire-title">Hire Freelancer</div>
//                     <div style={{ display: "flex", gap: 14 }}>
//                         <IoNotificationsOutline size={22} />
//                         <IoChatbubbleEllipsesOutline size={22} />
//                     </div>
//                 </div>

//                 <div className="hire-search">
//                     <IoSearch />
//                     <input placeholder="Search freelancer..." />
//                 </div>

//                 {/* TABS */}
//                 <div className="hire-tabs">
//                     <div
//                         className={`hire-tab ${activeTab === "requested" ? "active" : ""}`}
//                         onClick={() => setActiveTab("requested")}
//                     >
//                         Requested ({requestedList.length})
//                     </div>
//                     <div
//                         className={`hire-tab ${activeTab === "hired" ? "active" : ""}`}
//                         onClick={() => setActiveTab("hired")}
//                     >
//                         Hired ({hiredList.length})
//                     </div>
//                 </div>

//                 {/* CARDS */}
//                 <div className="hire-grid">
//                     {listToShow.map((item) => (
//                         <div className="hire-card" key={item.id}>
//                             <div className="hire-card-top">
//                                 <img src={profile} className="hire-img" />
//                             </div>

//                             <div className="hire-body">
//                                 <div className="hire-name">{item.freelancerName}</div>
//                                 <div className="hire-role">{item.title}</div>

//                                 <button
//                                     className="hire-btn"
//                                     onClick={async () => {
//                                         if (activeTab === "requested") {
//                                             deleteRequest(item.id);
//                                         } else {
//                                             await markAsRead(item.id);

//                                             navigate("/chat", {
//                                                 state: {
//                                                     currentUid: auth.currentUser.uid,
//                                                     otherUid: item.freelancerId,
//                                                     otherName: item.freelancerName,
//                                                     otherImage: item.profileImage || "",
//                                                     initialMessage: getStartMessage(item.title),
//                                                 },
//                                             });
//                                         }
//                                     }}
//                                     style={{
//                                         background: activeTab === "requested" ? "#f44336" : "#7b2ff7",
//                                     }}
//                                 >
//                                     {activeTab === "requested" ? "Delete Request" : "View Chat"}
//                                 </button>


//                                 <div className="created"><Clock size={16} />{timeAgo(job.createdAt)}</div>
//                             </div>
//                         </div>
//                     ))}

//                     {listToShow.length === 0 && (
//                         <p style={{ textAlign: "center", width: "100%" }}>
//                             No data found
//                         </p>
//                     )}
//                 </div>
//             </div>
//         </>
//     );
// }







// import React, { useEffect, useState } from "react";
// import profile from "../../../assets/profile.png";
// import {
//     IoSearch,
//     IoNotificationsOutline,
//     IoChatbubbleEllipsesOutline,
// } from "react-icons/io5";
// import { FiClock } from "react-icons/fi";

// import { useNavigate } from "react-router-dom";
// import { getAuth } from "firebase/auth";

// import {
//     collection,
//     onSnapshot,
//     query,
//     where,
//     orderBy,
//     doc,
//     deleteDoc,
//     updateDoc,
//     Timestamp
// } from "firebase/firestore";

// import { db } from "../../../firbase/Firebase";

// export default function HireFreelancer() {

//     const [activeTab, setActiveTab] = useState("requested");
//     const [requests, setRequests] = useState([]);

//     const auth = getAuth();
//     const navigate = useNavigate();

//     const getStartMessage = (title) =>
//         `Hi 👋 I’ve reviewed your application for "${title}". Let’s discuss the next steps.`;

//     /* ================= HELPERS ================= */

//     const markAsRead = async (id) => {
//         await updateDoc(doc(db, "notifications", id), { read: true });
//     };

//     const deleteRequest = async (id) => {
//         if (!window.confirm("Delete this request?")) return;
//         await deleteDoc(doc(db, "notifications", id));
//     };

//     function timeAgo(input) {
//         if (!input) return "N/A";
//         let d = input instanceof Timestamp ? input.toDate() : new Date(input);
//         const diff = (Date.now() - d.getTime()) / 1000;
//         if (diff < 60) return `${Math.floor(diff)} sec ago`;
//         if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
//         if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
//         return `${Math.floor(diff / 86400)} days ago`;
//     }

//     /* ================= FIRESTORE ================= */

//     useEffect(() => {
//         if (!auth.currentUser?.uid) return;

//         const q = query(
//             collection(db, "notifications"),
//             where("clientUid", "==", auth.currentUser.uid),
//             where("type", "==", "application"),
//             orderBy("timestamp", "desc")
//         );

//         const unsub = onSnapshot(q, (snap) => {
//             const list = snap.docs.map((d) => ({
//                 id: d.id,
//                 ...d.data(),
//             }));
//             setRequests(list);
//         });

//         return () => unsub();
//     }, [auth.currentUser?.uid]);

//     /* ================= FILTER ================= */

//     const requestedList = requests.filter((r) => r.read === false);
//     const hiredList = requests.filter((r) => r.read === true);

//     const listToShow = activeTab === "requested" ? requestedList : hiredList;

//     /* ================= UI ================= */

//     return (
//         <>
//             <style>{`
//         * { font-family: "Rubik", sans-serif; }
//         .hire-root { min-height: 100vh; background: #f7f8fc; padding: 30px; }
//         .hire-header { display: flex; justify-content: space-between; align-items: center; }
//         .hire-title { font-size: 22px; font-weight: 700; }
//         .hire-search { margin: 20px 0; background: #fff; padding: 14px 20px; border-radius: 14px; display: flex; gap: 10px; }
//         .hire-search input { border: none; outline: none; width: 100%; }
//         .hire-tabs { display: flex; width: 320px; margin: 0 auto 20px; background: #eee; padding: 6px; border-radius: 30px; }
//         .hire-tab { flex: 1; text-align: center; padding: 10px; cursor: pointer; font-weight: 600; border-radius: 20px; }
//         .hire-tab.active { background: #7b2ff7; color: #fff; }
//         .hire-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(280px,1fr)); gap: 20px; }
//         .hire-card { background: #fff; border-radius: 18px; box-shadow: 0 10px 25px rgba(0,0,0,0.07); overflow: hidden; }
//         .hire-card-top { background: linear-gradient(90deg,#7b2ff7,#a066ff); padding: 30px 0; text-align: center; }
//         .hire-img { width: 70px; height: 70px; border-radius: 50%; border: 4px solid #fff; }
//         .hire-body { padding: 20px; text-align: center; }
//         .hire-name { font-weight: 700; }
//         .hire-role { font-size: 13px; color: #777; margin-bottom: 10px; }
//         .hire-btn { width: 100%; border: none; color: #fff; padding: 10px; border-radius: 12px; cursor: pointer; margin-top: 10px; }
//         .created { font-size: 12px; opacity: 0.6; margin-top: 6px; display:flex; gap:6px; align-items:center; justify-content:center; }
//       `}</style>

//             <div className="hire-root">

//                 <div className="hire-header">
//                     <div className="hire-title">Hire Freelancer</div>
//                     <div style={{ display: "flex", gap: 14 }}>
//                         <IoNotificationsOutline size={22} />
//                         <IoChatbubbleEllipsesOutline size={22} />
//                     </div>
//                 </div>

//                 <div className="hire-search">
//                     <IoSearch />
//                     <input placeholder="Search freelancer..." />
//                 </div>

//                 {/* TABS */}
//                 <div className="hire-tabs">
//                     <div
//                         className={`hire-tab ${activeTab === "requested" ? "active" : ""}`}
//                         onClick={() => setActiveTab("requested")}
//                     >
//                         Requested ({requestedList.length})
//                     </div>
//                     <div
//                         className={`hire-tab ${activeTab === "hired" ? "active" : ""}`}
//                         onClick={() => setActiveTab("hired")}
//                     >
//                         Hired ({hiredList.length})
//                     </div>
//                 </div>

//                 {/* CARDS */}
//                 <div className="hire-grid">
//                     {listToShow.map((item) => (
//                         <div className="hire-card" key={item.id}>

//                             <div className="hire-card-top">
//                                 <img src={profile} className="hire-img" />
//                             </div>

//                             <div className="hire-body">
//                                 <div className="hire-name">{item.freelancerName}</div>
//                                 <div className="hire-role">{item.title}</div>

//                                 <button
//                                     className="hire-btn"
//                                     style={{ background: activeTab === "requested" ? "#f44336" : "#7b2ff7" }}
//                                     onClick={async () => {
//                                         if (activeTab === "requested") {
//                                             deleteRequest(item.id);
//                                         } else {
//                                             await markAsRead(item.id);
//                                             navigate("/chat", {
//                                                 state: {
//                                                     currentUid: auth.currentUser.uid,
//                                                     otherUid: item.freelancerId,
//                                                     otherName: item.freelancerName,
//                                                     otherImage: item.profileImage || "",
//                                                     initialMessage: getStartMessage(item.title),
//                                                 },
//                                             });
//                                         }
//                                     }}
//                                 >
//                                     {activeTab === "requested" ? "Delete Request" : "View Chat"}
//                                 </button>

//                                 <div className="created">
//                                     <FiClock size={14} />
//                                     {timeAgo(item.timestamp)}
//                                 </div>
//                                 <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>
//                                     {profile.first_name} {profile.last_name}
//                                 </h2>
//                             </div>
//                         </div>
//                     ))}

//                     {listToShow.length === 0 && (
//                         <p style={{ textAlign: "center", width: "100%" }}>No data found</p>
//                     )}
//                 </div>
//                 <div style={{ color: "#6b7280", marginTop: 4 }}>{profile.email}</div>
//                 <p style={{ margin: "8px 0 0", color: "#374151" }}>
//                     {profile.sector || "Freelancer"} · {profile.location || "India"}
//                 </p>
//                 <p style={{ opacity: 0.7, margin: "4px 0 0" }}>
//                     {profile.professional_title || "Professional"}
//                 </p>
//             </div>
//         </>
//     );
// }




// import React, { useEffect, useState } from "react";
// import profileImg from "../../../assets/profile.png";
// import {
//     IoSearch,
//     IoNotificationsOutline,
//     IoChatbubbleEllipsesOutline,
// } from "react-icons/io5";
// import { FiClock } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import { getAuth } from "firebase/auth";
// import {
//     collection,
//     onSnapshot,
//     query,
//     where,
//     orderBy,
//     doc,
//     deleteDoc,
//     updateDoc,
//     Timestamp,
// } from "firebase/firestore";
// import { db } from "../../../firbase/Firebase";

// /* ======================================================
//    HIRE FREELANCER – FIXED VERSION
// ====================================================== */

// export default function HireFreelancer() {
//     const auth = getAuth();
//     const navigate = useNavigate();

//     const [activeTab, setActiveTab] = useState("requested");
//     const [requests, setRequests] = useState([]);
//     const [search, setSearch] = useState("");

//     /* ================= HELPERS ================= */

//     const getStartMessage = (title) =>
//         `Hi 👋 I’ve reviewed your application for "${title}". Let’s discuss the next steps.`;

//     const markAsRead = async (id) => {
//         try {
//             await updateDoc(doc(db, "notifications", id), { read: true });
//         } catch (e) {
//             console.error("Mark as read failed", e);
//         }
//     };

//     const deleteRequest = async (id) => {
//         if (!window.confirm("Delete this request?")) return;
//         try {
//             await deleteDoc(doc(db, "notifications", id));
//         } catch (e) {
//             console.error("Delete failed", e);
//         }
//     };

//     const timeAgo = (input) => {
//         if (!input) return "N/A";
//         const d = input instanceof Timestamp ? input.toDate() : new Date(input);
//         const diff = (Date.now() - d.getTime()) / 1000;
//         if (diff < 60) return `${Math.floor(diff)} sec ago`;
//         if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
//         if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
//         return `${Math.floor(diff / 86400)} days ago`;
//     };

//     /* ================= FIRESTORE ================= */

//     useEffect(() => {
//         if (!auth.currentUser?.uid) return;

//         const q = query(
//             collection(db, "notifications"),
//             where("clientUid", "==", auth.currentUser.uid),
//             where("type", "==", "application"),
//             orderBy("timestamp", "desc")
//         );

//         const unsub = onSnapshot(q, (snap) => {
//             setRequests(
//                 snap.docs.map((d) => ({
//                     id: d.id,
//                     ...d.data(),
//                 }))
//             );
//         });

//         return () => unsub();
//     }, [auth.currentUser?.uid]);

//     /* ================= FILTER ================= */

//     const requestedList = requests.filter((r) => r.read === false);
//     const hiredList = requests.filter((r) => r.read === true);

//     const listToShow =
//         activeTab === "requested" ? requestedList : hiredList;

//     const finalList = listToShow.filter((i) =>
//         i.freelancerName?.toLowerCase().includes(search.toLowerCase())
//     );

//     /* ================= UI ================= */

//     return (
//         <>
//             <style>{`
//         * { font-family: "Rubik", sans-serif; }
//         .hire-root { min-height:100vh; background:#fbf9e9; padding:30px; }
//         .hire-header { display:flex; justify-content:space-between; align-items:center; }
//         .hire-title { font-size:22px; font-weight:700; }
//         .hire-search { margin:20px 0; background:#fff; padding:14px 20px; border-radius:14px; display:flex; gap:10px; box-shadow:0 10px 30px rgba(0,0,0,.08); }
//         .hire-search input { border:none; outline:none; width:100%; }
//         .hire-tabs { display:flex; width:320px; margin:0 auto 20px; background:#fff; padding:6px; border-radius:30px; }
//         .hire-tab { flex:1; text-align:center; padding:10px; cursor:pointer; font-weight:600; border-radius:24px; }
//         .hire-tab.active { background:#8b5cf6; color:#fff; }
//         .hire-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:20px; }
//         .hire-card { background:#fff; border-radius:18px; box-shadow:0 10px 25px rgba(0,0,0,.1); overflow:hidden; }
//         .hire-card-top { background:linear-gradient(135deg,#8b5cf6,#a855f7); padding:24px 0; text-align:center; position:relative; }
//         .badge { position:absolute; top:12px; right:12px; background:#fff; padding:4px 10px; border-radius:20px; font-size:12px; }
//         .hire-img { width:70px; height:70px; border-radius:50%; border:4px solid #fff; object-fit:cover; }
//         .hire-body { padding:20px; text-align:center; }
//         .hire-name { font-weight:700; }
//         .hire-role { font-size:13px; color:#6b7280; margin-bottom:10px; }
//         .hire-btn { width:100%; border:none; padding:10px; border-radius:12px; font-weight:600; cursor:pointer; margin-top:12px; }
//         .delete { background:#ef4444; color:#fff; }
//         .chat { background:#7c3aed; color:#fff; }
//         .created { display:flex; justify-content:center; gap:6px; font-size:12px; opacity:.6; margin-top:8px; }
//       `}</style>

//             <div className="hire-root">
//                 {/* HEADER */}
//                 <div className="hire-header">
//                     <div className="hire-title">Hire Freelancer</div>
//                     <div style={{ display: "flex", gap: 14 }}>
//                         <IoNotificationsOutline size={22} />
//                         <IoChatbubbleEllipsesOutline size={22} />
//                     </div>
//                 </div>

//                 {/* SEARCH */}
//                 <div className="hire-search">
//                     <IoSearch />
//                     <input
//                         placeholder="Search freelancer..."
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                     />
//                 </div>

//                 {/* TABS */}
//                 <div className="hire-tabs">
//                     <div
//                         className={`hire-tab ${activeTab === "requested" ? "active" : ""}`}
//                         onClick={() => setActiveTab("requested")}
//                     >
//                         Requested ({requestedList.length})
//                     </div>
//                     <div
//                         className={`hire-tab ${activeTab === "hired" ? "active" : ""}`}
//                         onClick={() => setActiveTab("hired")}
//                     >
//                         Hired ({hiredList.length})
//                     </div>
//                 </div>

//                 {/* CARDS */}
//                 <div className="hire-grid">
//                     {finalList.map((item) => (
//                         <div className="hire-card" key={item.id}>
//                             <div className="hire-card-top">
//                                 <div className="badge">{timeAgo(item.timestamp)}</div>
//                                 <img
//                                     src={item.profileImage || profileImg}
//                                     className="hire-img"
//                                 />
//                             </div>

//                             <div className="hire-body">
//                                 <div className="hire-name">{item.freelancerName}</div>
//                                 <div className="hire-role">{item.title}</div>
//                                 <div className="job-skills">
//                                     {(item.skills || []).slice(0, 3).map((skill, i) => (
//                                         <span
//                                             key={i}
//                                             style={{
//                                                 background: "#ede9fe",
//                                                 color: "#5b21b6",
//                                                 padding: "4px 10px",
//                                                 borderRadius: "14px",
//                                                 fontSize: 12,
//                                                 margin: "0 4px",
//                                                 display: "inline-block"
//                                             }}
//                                         >
//                                             {skill}
//                                         </span>
//                                     ))}
//                                 </div>


//                                 {activeTab === "requested" ? (
//                                     <button
//                                         className="hire-btn delete"
//                                         onClick={() => deleteRequest(item.id)}
//                                     >
//                                         Delete Request
//                                     </button>
//                                 ) : (
//                                     <button
//                                         className="hire-btn chat"
//                                         onClick={async () => {
//                                             await markAsRead(item.id);
//                                             navigate("/chat", {
//                                                 state: {
//                                                     currentUid: auth.currentUser.uid,
//                                                     otherUid: item.freelancerId,
//                                                     otherName: item.freelancerName,
//                                                     otherImage: item.profileImage || "",
//                                                     initialMessage: getStartMessage(item.title),
//                                                 },
//                                             });
//                                         }}
//                                     >
//                                         View Chat
//                                     </button>
//                                 )}

//                             </div>
//                         </div>
//                     ))}

//                     {finalList.length === 0 && (
//                         <p style={{ textAlign: "center", width: "100%" }}>
//                             No data found
//                         </p>
//                     )}
//                 </div>
//             </div>
//         </>
//     );
// }


// import React, { useEffect, useState } from "react";
// import profileImg from "../../../assets/profile.png";
// import {
//   IoSearch,
//   IoNotificationsOutline,
//   IoChatbubbleEllipsesOutline,
// } from "react-icons/io5";
// import { useNavigate } from "react-router-dom";
// import { getAuth } from "firebase/auth";
// import {
//   collection,
//   onSnapshot,
//   query,
//   where,
//   orderBy,
//   doc,
//   deleteDoc,
//   updateDoc,
//   Timestamp,
// } from "firebase/firestore";
// import { db } from "../../../firbase/Firebase";

// export default function HireFreelancer() {
//   const auth = getAuth();
//   const navigate = useNavigate();

//   const [activeTab, setActiveTab] = useState("requested");
//   const [requests, setRequests] = useState([]);
//   const [search, setSearch] = useState("");

//   /* ================= HELPERS ================= */

//   const getStartMessage = (title) =>
//     `Hi 👋 I’ve reviewed your application for "${title}". Let’s discuss the next steps.`;

//   const markAsRead = async (id) => {
//     try {
//       await updateDoc(doc(db, "notifications", id), { read: true });
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const deleteRequest = async (id) => {
//     if (!window.confirm("Delete this request?")) return;
//     try {
//       await deleteDoc(doc(db, "notifications", id));
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const timeAgo = (input) => {
//     if (!input) return "N/A";
//     const d = input instanceof Timestamp ? input.toDate() : new Date(input);
//     const diff = (Date.now() - d.getTime()) / 1000;
//     if (diff < 60) return `${Math.floor(diff)} sec ago`;
//     if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
//     if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
//     return `${Math.floor(diff / 86400)} days ago`;
//   };

//   /* ================= FIRESTORE ================= */

//   useEffect(() => {
//     if (!auth.currentUser?.uid) return;

//     const q = query(
//       collection(db, "notifications"),
//       where("clientUid", "==", auth.currentUser.uid),
//       where("type", "==", "application"),
//       orderBy("timestamp", "desc")
//     );

//     const unsub = onSnapshot(q, (snap) => {
//       setRequests(
//         snap.docs.map((d) => ({
//           id: d.id,
//           ...d.data(),
//         }))
//       );
//     });

//     return () => unsub();
//   }, [auth.currentUser?.uid]);

//   /* ================= FILTER ================= */

//   const requestedList = requests.filter((r) => r.read === false);
//   const hiredList = requests.filter((r) => r.read === true);

//   const listToShow =
//     activeTab === "requested" ? requestedList : hiredList;

//   const finalList = listToShow.filter((i) =>
//     i.freelancerName?.toLowerCase().includes(search.toLowerCase())
//   );

//   /* ================= UI ================= */

//   return (
//     <>
//       <style>{`
//         * { font-family: "Rubik", sans-serif; }
//         .hire-root { min-height:100vh; background:#fbf9e9; padding:30px; }
//         .hire-header { display:flex; justify-content:space-between; align-items:center; }
//         .hire-title { font-size:22px; font-weight:700; }
//         .hire-search { margin:20px 0; background:#fff; padding:14px 20px; border-radius:14px; display:flex; gap:10px; box-shadow:0 10px 30px rgba(0,0,0,.08); }
//         .hire-search input { border:none; outline:none; width:100%; }
//         .hire-tabs { display:flex; width:320px; margin:0 auto 20px; background:#fff; padding:6px; border-radius:30px; }
//         .hire-tab { flex:1; text-align:center; padding:10px; cursor:pointer; font-weight:600; border-radius:24px; }
//         .hire-tab.active { background:#8b5cf6; color:#fff; }
//         .hire-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:20px; }
//         .hire-card { background:#fff; border-radius:18px; box-shadow:0 10px 25px rgba(0,0,0,.1); overflow:hidden; }
//         .hire-card-top { background:linear-gradient(135deg,#8b5cf6,#a855f7); padding:24px 0; text-align:center; position:relative; }
//         .badge { position:absolute; top:12px; right:12px; background:#fff; padding:4px 10px; border-radius:20px; font-size:12px; }
//         .hire-img { width:70px; height:70px; border-radius:50%; border:4px solid #fff; object-fit:cover; }
//         .hire-body { padding:20px; text-align:center; }
//         .hire-name { font-weight:700; }
//         .hire-role { font-size:13px; color:#6b7280; margin-bottom:10px; }
//         .hire-btn { width:100%; border:none; padding:10px; border-radius:12px; font-weight:600; cursor:pointer; margin-top:12px; }
//         .delete { background:#ef4444; color:#fff; }
//         .chat { background:#7c3aed; color:#fff; }
//       `}</style>

//       <div className="hire-root">
//         {/* HEADER */}
//         <div className="hire-header">
//           <div className="hire-title">Hire Freelancer</div>
//           <div style={{ display: "flex", gap: 14 }}>
//             <IoNotificationsOutline size={22} />
//             <IoChatbubbleEllipsesOutline size={22} />
//           </div>
//         </div>

//         {/* SEARCH */}
//         <div className="hire-search">
//           <IoSearch />
//           <input
//             placeholder="Search freelancer..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         {/* TABS */}
//         <div className="hire-tabs">
//           <div
//             className={`hire-tab ${activeTab === "requested" ? "active" : ""}`}
//             onClick={() => setActiveTab("requested")}
//           >
//             Requested ({requestedList.length})
//           </div>
//           <div
//             className={`hire-tab ${activeTab === "hired" ? "active" : ""}`}
//             onClick={() => setActiveTab("hired")}
//           >
//             Hired ({hiredList.length})
//           </div>
//         </div>

//         {/* CARDS */}
//         <div className="hire-grid">
//           {finalList.map((item) => {
//             /* 🔥 SKILLS FIX */
//             const skillsArray = Array.isArray(item.skills)
//               ? item.skills
//               : typeof item.skills === "string"
//               ? item.skills.split(",").map((s) => s.trim())
//               : [];

//             return (
//               <div className="hire-card" key={item.id}>
//                 <div className="hire-card-top">
//                   <div className="badge">{timeAgo(item.timestamp)}</div>
//                   <img
//                     src={item.profileImage || profileImg}
//                     className="hire-img"
//                   />
//                 </div>

//                 <div className="hire-body">
//                   <div className="hire-name">{item.freelancerName}</div>
//                   <div className="hire-role">{item.title}</div>

//                   {/* SKILLS */}
//                   <div style={{ marginTop: 8 }}>
//                     {skillsArray.slice(0, 3).map((skill, i) => (
//                       <span
//                         key={i}
//                         style={{
//                           background: "#ede9fe",
//                           color: "#5b21b6",
//                           padding: "4px 10px",
//                           borderRadius: 14,
//                           fontSize: 12,
//                           margin: "0 4px",
//                           display: "inline-block",
//                         }}
//                       >
//                         {skill}
//                       </span>
//                     ))}
//                   </div>

//                   {activeTab === "requested" ? (
//                     <button
//                       className="hire-btn delete"
//                       onClick={() => deleteRequest(item.id)}
//                     >
//                       Delete Request
//                     </button>
//                   ) : (
//                     <button
//                       className="hire-btn chat"
//                       onClick={async () => {
//                         await markAsRead(item.id);
//                         navigate("/chat", {
//                           state: {
//                             currentUid: auth.currentUser.uid,
//                             otherUid: item.freelancerId,
//                             otherName: item.freelancerName,
//                             otherImage: item.profileImage || "",
//                             initialMessage: getStartMessage(item.title),
//                           },
//                         });
//                       }}
//                     >
//                       View Chat
//                     </button>
//                   )}
//                 </div>
//               </div>
//             );
//           })}

//           {finalList.length === 0 && (
//             <p style={{ textAlign: "center", width: "100%" }}>
//               No data found
//             </p>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }















import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { IoChatbubbleEllipsesOutline, IoNotificationsOutline, IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import profileImg from "../../../assets/profile.png"
import { collection, onSnapshot, orderBy, query, Timestamp, where } from "firebase/firestore";
import { db } from "../../../firbase/Firebase";

export default function HireFreelancer() {
  const auth = getAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("requested");
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");

  /* ================= HELPERS ================= */

  const getStartMessage = (title) =>
    `Hi 👋 I’ve reviewed your application for "${title}". Let’s discuss the next steps.`;

  const markAsRead = async (id) => {
    await updateDoc(doc(db, "notifications", id), { read: true });
  };

  const deleteRequest = async (id) => {
    if (!window.confirm("Delete this request?")) return;
    await deleteDoc(doc(db, "notifications", id));
  };

  const timeAgo = (input) => {
    if (!input) return "N/A";
    const d = input instanceof Timestamp ? input.toDate() : new Date(input);
    const diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 86400) return "10 days ago"; // 👈 matches UI
    return `${Math.floor(diff / 86400)} days ago`;
  };

  /* ================= FIRESTORE ================= */

  useEffect(() => {
    if (!auth.currentUser?.uid) return;

    const q = query(
      collection(db, "notifications"),
      where("clientUid", "==", auth.currentUser.uid),
      where("type", "==", "application"),
      orderBy("timestamp", "desc")
    );

    return onSnapshot(q, (snap) => {
      setRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, [auth.currentUser?.uid]);

  const requestedList = requests.filter((r) => r.read === false);
  const hiredList = requests.filter((r) => r.read === true);

  const listToShow =
    activeTab === "requested" ? requestedList : hiredList;

  const finalList = listToShow.filter((i) =>
    i.freelancerName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        * { font-family: "Rubik", sans-serif; }

        .hire-root {
          min-height:100vh;
          background:linear-gradient(#fdfcb3,#fff);
          padding:26px;
        }

        /* HEADER */
        .hire-header {
          display:flex;
          align-items:center;
          justify-content:space-between;
        }
        .hire-title {
          font-size:22px;
          font-weight:700;
        }

        /* SEARCH */
        .hire-search {
          margin:22px 0;
          height:50px;
          background:#fff;
          padding:16px 20px;
          border-radius:18px;
          display:flex;
          gap:10px;
          box-shadow:0 12px 30px rgba(0,0,0,.12);
        }
        .hire-search input {
          border:none;
          outline:none;
          width:100%;
          font-size:14px;
        }

        /* TABS */
        .hire-tabs {
          display:flex;
          width:360px;
          margin:0 auto 18px;
          background:#fff;
          padding:6px;
          border-radius:40px;
          box-shadow:0 6px 20px rgba(0,0,0,.12);
        }
        .hire-tab {
          flex:1;
          text-align:center;
          padding:12px 0;
          font-weight:600;
          border-radius:30px;
          cursor:pointer;
        }
        .hire-tab.active {
          background:#8b5cf6;
          color:#fff;
        }

        /* FILTER BAR */
        .filter-bar {
          display:flex;
          justify-content:space-between;
          align-items:center;
          background:#fff;
          padding:10px 16px;
          border-radius:14px;
          margin-bottom:20px;
          box-shadow:0 6px 20px rgba(0,0,0,.08);
        }
        .filter-left span {
          margin-right:18px;
          font-size:13px;
        }
        .filter-right {
          color:#7c3aed;
          font-weight:600;
        }

        /* GRID */
        .hire-grid {
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(300px,1fr));
          gap:22px;
        }

        /* CARD */
        .hire-card {
          background:#fff;
          border-radius:22px;
          box-shadow:0 14px 30px rgba(0,0,0,.15);
          overflow:hidden;
        }

        .card-top {
          height:110px;
          background:linear-gradient(135deg,#8b5cf6,#a855f7);
          position:relative;
        }

        .time-badge {
          position:absolute;
          top:12px;
          right:12px;
          background:#fff;
          padding:6px 12px;
          border-radius:18px;
          font-size:12px;
        }

        .profile-img {
          width:80px;
          height:80px;
          border-radius:50%;
          border:4px solid #fff;
          object-fit:cover;
          position:absolute;
          bottom:-40px;
          left:50%;
          transform:translateX(-50%);
        }

        .card-body {
          padding:56px 20px 22px;
          text-align:center;
        }

        .name { font-weight:700; }
        .role { color:#7c3aed; font-size:14px; }
        .location { font-size:12px; color:#6b7280; margin-bottom:10px; }

        .project {
          font-size:13px;
          margin:10px 0;
        }

        .skills span {
          background:#ede9fe;
          color:#5b21b6;
          padding:5px 12px;
          border-radius:14px;
          font-size:12px;
          margin:4px;
          display:inline-block;
        }

        .action-btn {
          width:100%;
          padding:12px;
          border:none;
          border-radius:14px;
          font-weight:600;
          margin-top:16px;
          cursor:pointer;
        }
        .delete { background:#7c3aed; color:#fff; }
      `}</style>

      <div className="hire-root">

        {/* HEADER */}
        <div className="hire-header">
          <div className="hire-title">Hire Freelancer</div>
          <div style={{ display:"flex", gap:16 }}>
            <IoChatbubbleEllipsesOutline size={22}/>
            <IoNotificationsOutline size={22}/>
            <img src={profileImg} width="32" />
          </div>
        </div>

        {/* SEARCH */}
        <div className="hire-search">
          <IoSearch />
          <input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABS */}
        <div className="hire-tabs">
          <div
            className={`hire-tab ${activeTab==="requested"?"active":""}`}
            onClick={()=>setActiveTab("requested")}
          >Requested</div>
          <div
            className={`hire-tab ${activeTab==="hired"?"active":""}`}
            onClick={()=>setActiveTab("hired")}
          >Hired</div>
        </div>

        {/* FILTER */}
        <div className="filter-bar">
          <div className="filter-left">
            <span>Work</span>
            <span>24 Hours</span>
          </div>
          <div className="filter-right">Request</div>
        </div>

        {/* CARDS */}
        <div className="hire-grid">
          {finalList.map(item => {
            const skills = Array.isArray(item.skills)
              ? item.skills
              : item.skills?.split(",") || [];

            return (
              <div className="hire-card" key={item.id}>
                <div className="card-top">
                  <div className="time-badge">{timeAgo(item.timestamp)}</div>
                  <img
                    src={item.profileImage || profileImg}
                    className="profile-img"
                  />
                </div>

                <div className="card-body">
                  <div className="name">{item.freelancerName}</div>
                  <div className="role">Video Editor</div>
                  <div className="location">Chennai, Tamilnadu</div>

                  <div className="project">UI UX pet app</div>

                  <div className="skills">
                    {skills.slice(0,3).map((s,i)=><span key={i}>{s}</span>)}
                    {skills.length>3 && <span>+2</span>}
                  </div>

                  <button
                    className="action-btn delete"
                    onClick={() =>
                      activeTab==="requested"
                        ? deleteRequest(item.id)
                        : navigate("/chat", {
                            state:{
                              currentUid:auth.currentUser.uid,
                              otherUid:item.freelancerId,
                              otherName:item.freelancerName,
                              otherImage:item.profileImage,
                              initialMessage:getStartMessage(item.title)
                            }
                          })
                    }
                  >
                    {activeTab==="requested"?"Delete Request":"Start Message"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}