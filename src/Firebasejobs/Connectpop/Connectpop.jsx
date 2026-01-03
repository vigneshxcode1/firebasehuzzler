// import React, { useEffect, useState, useCallback } from "react";
// import { auth, db } from "../../firbase/Firebase";
// import { useNavigate } from "react-router-dom";
// import { collection, getDocs, query, where } from "firebase/firestore";

// export default function ConnectPopup({
//   open,
//   onClose,
//   freelancerId,
//   freelancerName,
//   services = [],
// }) {
//   const [selectedService, setSelectedService] = useState(null);
//   const [projectTitle, setProjectTitle] = useState("");
//   const [projectLink, setProjectLink] = useState("");
//   const [projectDesc, setProjectDesc] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [clientJobs, setClientJobs] = useState([]);

//   const navigate = useNavigate();

//   // Fetch client's jobs
//   const fetchClientJobs = useCallback(async () => {
//     const uid = auth.currentUser?.uid;
//     if (!uid) return;

//     const jobsList = [];

//     const jobsSnap = await getDocs(query(collection(db, "jobs"), where("userId", "==", uid)));
//     jobsSnap.forEach((doc) => jobsList.push({ id: doc.id, ...doc.data() }));

//     const jobs24Snap = await getDocs(query(collection(db, "jobs_24h"), where("userId", "==", uid)));
//     jobs24Snap.forEach((doc) => jobsList.push({ id: doc.id, ...doc.data() }));

//     setClientJobs(jobsList);
//   }, []);


  
//   // Inject CSS for popup
//   useEffect(() => {
//     const style = document.createElement("style");
//     style.innerHTML = `
//       .ffds-modal-backdrop {
//         position: fixed;
//         top: 0;
//         left: 0;
//         width: 100%;
//         height: 100%;
//         background: rgba(0,0,0,0.5);
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         z-index: 9999;
//       }

//       .ffds-modal {
//         background: #fff;
//         border-radius: 16px;
//         max-width: 500px;
//         width: 90%;
//         padding: 24px;
//         box-shadow: 0 10px 30px rgba(0,0,0,0.2);
//         position: relative;
//         animation: slideIn 0.3s ease-out;
//       }

//       @keyframes slideIn {
//         from { transform: translateY(-50px); opacity: 0; }
//         to { transform: translateY(0); opacity: 1; }
//       }

//       .ffds-card-title {
//         font-size: 20px;
//         font-weight: 700;
//         margin-bottom: 16px;
//       }

//       .ffds-select, .ffds-input, .ffds-textarea {
//         width: 100%;
//         padding: 10px 12px;
//         margin-bottom: 12px;
//         border: 1px solid #ccc;
//         border-radius: 10px;
//         font-size: 14px;
//         outline: none;
//         box-sizing: border-box;
//       }

//       .ffds-textarea {
//         resize: vertical;
//         min-height: 80px;
//       }

//       .ffds-modal-footer {
//         display: flex;
//         justify-content: flex-end;
//         gap: 12px;
//         margin-top: 16px;
//       }

//       .ffds-btn {
//         padding: 10px 20px;
//         font-size: 14px;
//         font-weight: 600;
//         border-radius: 12px;
//         cursor: pointer;
//         border: none;
//       }

//       .ffds-btn-outline {
//         background: white;
//         border: 2px solid #7A4DFF;
//         color: #7A4DFF;
//       }

//       .ffds-btn-primary {
//         background: #7A4DFF;
//         color: white;
//       }
//     `;
//     document.head.appendChild(style);
//     return () => {
//       document.head.removeChild(style);
//     };
//   }, []);


//   useEffect(() => {
//     if (open) fetchClientJobs();
//     else {
//       setSelectedService(null);
//       setProjectTitle("");
//       setProjectLink("");
//       setProjectDesc("");
//     }
//   }, [open, fetchClientJobs]);

//   if (!open) return null;

//   const sendMessage = async () => {
//     const currentUid = auth.currentUser?.uid;
//     if (!currentUid) {
//       alert("Please login");
//       return;
//     }

//     if (!projectTitle.trim()) {
//       alert("Project title is required");
//       return;
//     }

//     setLoading(true);

//     try {
//       let initialMessage = `Message from client:\nTitle: ${projectTitle.trim()}`;
//       if (projectLink.trim()) initialMessage += `\nLink: ${projectLink.trim()}`;
//       if (projectDesc.trim()) initialMessage += `\nDescription: ${projectDesc.trim()}`;
//       if (selectedService) initialMessage += `\nService: ${selectedService.title}`;

//       navigate("/chat", {
//         state: {
//           currentUid,
//           otherUid: freelancerId,
//           otherName: freelancerName,
//           otherImage: "",
//           initialMessage,
//         },
//       });

//       onClose();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to start chat");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="ffds-modal-backdrop" onClick={onClose}>
//       <div className="ffds-modal" onClick={(e) => e.stopPropagation()}>
//         <div className="ffds-card-title">Connect with {freelancerName}</div>
//         <p>Bring ideas to Life!</p>

//         {/* Client jobs dropdown */}
//         {clientJobs.length > 0 && (
//           <select
//             className="ffds-select"
//             value={projectTitle}
//             onChange={(e) => setProjectTitle(e.target.value)}
//           >
//             <option value="">Select your existing Job / Project</option>
//             {clientJobs.map((job) => (
//               <option key={job.id} value={job.title}>
//                 {job.title || "Untitled"}
//               </option>
//             ))}
//           </select>
//         )}

//         {/* Optional manual override */}
//         <input
//           className="ffds-input"
//           placeholder="Project link (or type new)"
//           value={projectTitle}
//           onChange={(e) => setProjectTitle(e.target.value)}
//         />

      

//         <textarea
//           className="ffds-textarea"
//           placeholder="Project description (optional)"
//           value={projectDesc}
//           onChange={(e) => setProjectDesc(e.target.value)}
//         />

//         <div className="ffds-modal-footer">
//           <button className="ffds-btn ffds-btn-outline" onClick={onClose}>
//             Cancel
//           </button>
//           <button
//             className="ffds-btn ffds-btn-primary"
//             onClick={sendMessage}
//             disabled={loading}
//           >
//             {loading ? "Opening chat..." : "Send Message"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }





// import React, { useEffect, useState, useCallback } from "react";
// import { auth, db } from "../../firbase/Firebase";
// import { useNavigate } from "react-router-dom";
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { addDoc, serverTimestamp } from "firebase/firestore";
// import { ref, set } from "firebase/database";
// import { rtdb } from "../../firbase/Firebase";



// export default function ConnectPopup({
//   open,
//   onClose,
//   freelancerId,
//   freelancerName,
//   services = [],
// }) {
//   const [selectedService, setSelectedService] = useState(null);
//   const [projectTitle, setProjectTitle] = useState("");
//   const [projectLink, setProjectLink] = useState("");
//   const [projectDesc, setProjectDesc] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [clientJobs, setClientJobs] = useState([]);

//   const navigate = useNavigate();

//   // Fetch client's jobs
//   const fetchClientJobs = useCallback(async () => {
//     const uid = auth.currentUser?.uid;
//     if (!uid) return;

//     const jobsList = [];

//     const jobsSnap = await getDocs(query(collection(db, "jobs"), where("userId", "==", uid)));
//     jobsSnap.forEach((doc) => jobsList.push({ id: doc.id, ...doc.data() }));

//     const jobs24Snap = await getDocs(query(collection(db, "jobs_24h"), where("userId", "==", uid)));
//     jobs24Snap.forEach((doc) => jobsList.push({ id: doc.id, ...doc.data() }));

//     setClientJobs(jobsList);
//   }, []);



//   // Inject CSS for popup
//   useEffect(() => {
//     const style = document.createElement("style");
//     style.innerHTML = `
//       .ffds-modal-backdrop {
//         position: fixed;
//         top: 0;
//         left: 0;
//         width: 100%;
//         height: 100%;
//         background: rgba(0,0,0,0.5);
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         z-index: 9999;
//       }

//       .ffds-modal {
//         background: #fff;
//         border-radius: 16px;
//         max-width: 500px;
//         width: 90%;
//         padding: 24px;
//         box-shadow: 0 10px 30px rgba(0,0,0,0.2);
//         position: relative;
//         animation: slideIn 0.3s ease-out;
//       }

//       @keyframes slideIn {
//         from { transform: translateY(-50px); opacity: 0; }
//         to { transform: translateY(0); opacity: 1; }
//       }

//       .ffds-card-title {
//         font-size: 20px;
//         font-weight: 700;
//         margin-bottom: 16px;
//       }

//       .ffds-select, .ffds-input, .ffds-textarea {
//         width: 100%;
//         padding: 10px 12px;
//         margin-bottom: 12px;
//         border: 1px solid #ccc;
//         border-radius: 10px;
//         font-size: 14px;
//         outline: none;
//         box-sizing: border-box;
//       }

//       .ffds-textarea {
//         resize: vertical;
//         min-height: 80px;
//       }

//       .ffds-modal-footer {
//         display: flex;
//         justify-content: flex-end;
//         gap: 12px;
//         margin-top: 16px;
//       }

//       .ffds-btn {
//         padding: 10px 20px;
//         font-size: 14px;
//         font-weight: 600;
//         border-radius: 12px;
//         cursor: pointer;
//         border: none;
//       }

//       .ffds-btn-outline {
//         background: white;
//         border: 2px solid #7A4DFF;
//         color: #7A4DFF;
//       }

//       .ffds-btn-primary {
//         background: #7A4DFF;
//         color: white;
//       }
//     `;
//     document.head.appendChild(style);
//     return () => {
//       document.head.removeChild(style);
//     };
//   }, []);


//   useEffect(() => {
//     if (open) fetchClientJobs();
//     else {
//       setSelectedService(null);
//       setProjectTitle("");
//       setProjectLink("");
//       setProjectDesc("");
//     }
//   }, [open, fetchClientJobs]);

//   if (!open) return null;

// const sendRequest = async () => {
//   const currentUid = auth.currentUser?.uid;
//   if (!currentUid) {
//     alert("Please login");
//     return;
//   }

//   if (!projectTitle.trim()) {
//     alert("Project title is required");
//     return;
//   }

//   setLoading(true);

//   try {
//     // 1️⃣ Save to Realtime Database (requestChats)
//     const chatId = `${freelancerId}_${currentUid}`;
//     await set(ref(rtdb, `requestChats/${freelancerId}/${chatId}`), {
//       jobTitle: JSON.stringify({
//         jobId: crypto.randomUUID(), // generate a unique ID for the job
//         messageId: crypto.randomUUID(),
//         title: projectTitle.trim(),
//       }),
//       requestStatus: "pending",
//       requestedAt: Date.now(),
//       requestedBy: currentUid,
//     });

//     // 2️⃣ Add a notification for the freelancer
//     await addDoc(collection(db, "notifications"), {
//       title: projectTitle.trim(),
//       body: `${auth.currentUser.displayName || "Someone"} applied for ${projectTitle.trim()}`,
//       clientUid: currentUid,
//       freelancerId,
//       freelancerName,
//       jobId: crypto.randomUUID(), // match the job ID used above
//       read: false,
//       timestamp: serverTimestamp(),
//     });

//     alert("✅ Request sent and notification created");
//     onClose();
//   } catch (err) {
//     console.error(err);
//     alert("❌ Failed to send request");
//   } finally {
//     setLoading(false);
//   }
// };



//   return (
//     <div className="ffds-modal-backdrop" onClick={onClose}>
//       <div className="ffds-modal" onClick={(e) => e.stopPropagation()}>
//         <div className="ffds-card-title">Connect with {freelancerName}</div>
//         <p>Bring ideas to Life!</p>

//         {/* Client jobs dropdown */}
//         {clientJobs.length > 0 && (
//           <select
//             className="ffds-select"
//             value={projectTitle}
//             onChange={(e) => setProjectTitle(e.target.value)}
//           >
//             <option value="">Select your existing Job / Project</option>
//             {clientJobs.map((job) => (
//               <option key={job.id} value={job.title}>
//                 {job.title || "Untitled"}
//               </option>
//             ))}
//           </select>
//         )}

//         {/* Optional manual override */}
//         <input
//           className="ffds-input"
//           placeholder="Project link (or type new)"
//           value={projectTitle}
//           onChange={(e) => setProjectTitle(e.target.value)}
//         />



//         <textarea
//           className="ffds-textarea"
//           placeholder="Project description (optional)"
//           value={projectDesc}
//           onChange={(e) => setProjectDesc(e.target.value)}
//         />

//         <div className="ffds-modal-footer">
//           <button className="ffds-btn ffds-btn-outline" onClick={onClose}>
//             Cancel
//           </button>
//           <button
//             className="ffds-btn ffds-btn-primary"
//             onClick={sendRequest}
//             disabled={loading}
//           >
//             {loading ? "Sending Request..." : "Send Request"}
//           </button>

//         </div>
//       </div>
//     </div>
//   );
// }


// import React, { useEffect, useState, useCallback } from "react";
// import { auth, db } from "../../firbase/Firebase";
// import { useNavigate } from "react-router-dom";
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { addDoc, serverTimestamp } from "firebase/firestore";
// import { ref, set } from "firebase/database";
// import { rtdb } from "../../firbase/Firebase";



// export default function ConnectPopup({
//   open,
//   onClose,
//   freelancerId,
//   freelancerName,
//   services = [],
// }) {
//   const [selectedService, setSelectedService] = useState(null);
//   const [projectTitle, setProjectTitle] = useState("");
//   const [projectLink, setProjectLink] = useState("");
//   const [projectDesc, setProjectDesc] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [clientJobs, setClientJobs] = useState([]);

//   const navigate = useNavigate();

//   // Fetch client's jobs
//   const fetchClientJobs = useCallback(async () => {
//     const uid = auth.currentUser?.uid;
//     if (!uid) return;

//     const jobsList = [];

//     const jobsSnap = await getDocs(query(collection(db, "jobs"), where("userId", "==", uid)));
//     jobsSnap.forEach((doc) => jobsList.push({ id: doc.id, ...doc.data() }));

//     const jobs24Snap = await getDocs(query(collection(db, "jobs_24h"), where("userId", "==", uid)));
//     jobs24Snap.forEach((doc) => jobsList.push({ id: doc.id, ...doc.data() }));

//     setClientJobs(jobsList);
//   }, []);

  


//   // Inject CSS for popup
//   useEffect(() => {
//     const style = document.createElement("style");
//     style.innerHTML = `
//       .ffds-modal-backdrop {
//         position: fixed;
//         top: 0;
//         left: 0;
//         width: 100%;
//         height: 100%;
//         background: rgba(0,0,0,0.5);
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         z-index: 9999;
//       }

//       .ffds-modal {
//         background: #fff;
//         border-radius: 16px;
//         max-width: 500px;
//         width: 90%;
//         padding: 24px;
//         box-shadow: 0 10px 30px rgba(0,0,0,0.2);
//         position: relative;
//         animation: slideIn 0.3s ease-out;
//       }

//       @keyframes slideIn {
//         from { transform: translateY(-50px); opacity: 0; }
//         to { transform: translateY(0); opacity: 1; }
//       }

//       .ffds-card-title {
//         font-size: 20px;
//         font-weight: 700;
//         margin-bottom: 16px;
//       }

//       .ffds-select, .ffds-input, .ffds-textarea {
//         width: 100%;
//         padding: 10px 12px;
//         margin-bottom: 12px;
//         border: 1px solid #ccc;
//         border-radius: 10px;
//         font-size: 14px;
//         outline: none;
//         box-sizing: border-box;
//       }

//       .ffds-textarea {
//         resize: vertical;
//         min-height: 80px;
//       }

//       .ffds-modal-footer {
//         display: flex;
//         justify-content: flex-end;
//         gap: 12px;
//         margin-top: 16px;
//       }

//       .ffds-btn {
//         padding: 10px 20px;
//         font-size: 14px;
//         font-weight: 600;
//         border-radius: 12px;
//         cursor: pointer;
//         border: none;
//       }

//       .ffds-btn-outline {
//         background: white;
//         border: 2px solid #7A4DFF;
//         color: #7A4DFF;
//       }

//       .ffds-btn-primary {
//         background: #7A4DFF;
//         color: white;
//       }
//     `;
//     document.head.appendChild(style);
//     return () => {
//       document.head.removeChild(style);
//     };
//   }, []);


//   useEffect(() => {
//     if (open) fetchClientJobs();
//     else {
//       setSelectedService(null);
//       setProjectTitle("");
//       setProjectLink("");
//       setProjectDesc("");
//     }
//   }, [open, fetchClientJobs]);

//   if (!open) return null;

// const sendRequest = async () => {
//   const currentUid = auth.currentUser?.uid;
//   if (!currentUid) {
//     alert("Please login");
//     return;
//   }

//   if (!projectTitle.trim()) {
//     alert("Project title is required");
//     return;
//   }

//   setLoading(true);

//   try {
//     // 1️⃣ Save to Realtime Database (requestChats)
//     const chatId = `${freelancerId}_${currentUid}`;
//     await set(ref(rtdb, `requestChats/${freelancerId}/${chatId}`), {
//       jobTitle: JSON.stringify({
//         jobId: crypto.randomUUID(), // generate a unique ID for the job
//         messageId: crypto.randomUUID(),
//         title: projectTitle.trim(),
//       }),
//       requestStatus: "pending",
//       requestedAt: Date.now(),
//       requestedBy: currentUid,
//     });

//     // 2️⃣ Add a notification for the freelancer
//     await addDoc(collection(db, "notifications"), {
//       title: projectTitle.trim(),
//       body: `${auth.currentUser.displayName || "Someone"} applied for ${projectTitle.trim()}`,
//       clientUid: currentUid,
//       freelancerId,
//       freelancerName,
//       jobId: crypto.randomUUID(), // match the job ID used above
//       read: false,
//       timestamp: serverTimestamp(),
//     });

//     alert("✅ Request sent and notification created");
//     onClose();
//   } catch (err) {
//     console.error(err);
//     alert("❌ Failed to send request");
//   } finally {
//     setLoading(false);
//   }
// };



//   return (
//     <div className="ffds-modal-backdrop" onClick={onClose}>
//       <div className="ffds-modal" onClick={(e) => e.stopPropagation()}>
//         <div className="ffds-card-title">Connect with {freelancerName}</div>
//         <p>Bring ideas to Life!</p>

//         {/* Client jobs dropdown */}
//         {clientJobs.length > 0 && (
//           <select
//             className="ffds-select"
//             value={projectTitle}
//             onChange={(e) => setProjectTitle(e.target.value)}
//           >
//             <option value="">Select your existing Job / Project</option>
//             {clientJobs.map((job) => (
//               <option key={job.id} value={job.title}>
//                 {job.title || "Untitled"}
//               </option>
//             ))}
//           </select>
//         )}

//         {/* Optional manual override */}
//         <input
//           className="ffds-input"
//           placeholder="Project link (or type new)"
//           value={projectTitle}
//           onChange={(e) => setProjectTitle(e.target.value)}
//         />



//         <textarea
//           className="ffds-textarea"
//           placeholder="Project description (optional)"
//           value={projectDesc}
//           onChange={(e) => setProjectDesc(e.target.value)}
//         />

//         <div className="ffds-modal-footer">
//           <button className="ffds-btn ffds-btn-outline" onClick={onClose}>
//             Cancel
//           </button>
//           <button
//             className="ffds-btn ffds-btn-primary"
//             onClick={sendRequest}
//             disabled={loading}
//           >
//             {loading ? "Sending Request..." : "Send Request"}
//           </button>

//         </div>
//       </div>
//     </div>
//   );
// }



// import React, { useEffect, useState, useCallback } from "react";
// import { auth, db } from "../../firbase/Firebase";
// import { useNavigate } from "react-router-dom";
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { addDoc, serverTimestamp } from "firebase/firestore";
// import { ref, set } from "firebase/database";
// import { rtdb } from "../../firbase/Firebase";
// import "./Connect.css"
// import requestsentimg from "../../assets/requestsentimg.jpeg"



// export default function ConnectPopup({
//   open,
//   onClose,
//   freelancerId,
//   freelancerName,
//   services = [],
// }) {
//   const [selectedService, setSelectedService] = useState(null);
//   const [projectTitle, setProjectTitle] = useState("");
//   const [projectLink, setProjectLink] = useState("");
//   const [projectDesc, setProjectDesc] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [clientJobs, setClientJobs] = useState([]);
//   const [showSuccessCard, setShowSuccessCard] = useState(false);




//   const navigate = useNavigate();

//   // Fetch client's jobs
//   const fetchClientJobs = useCallback(async () => {
//     const uid = auth.currentUser?.uid;
//     if (!uid) return;

//     const jobsList = [];

//     const jobsSnap = await getDocs(query(collection(db, "jobs"), where("userId", "==", uid)));
//     jobsSnap.forEach((doc) => jobsList.push({ id: doc.id, ...doc.data() }));

//     const jobs24Snap = await getDocs(query(collection(db, "jobs_24h"), where("userId", "==", uid)));
//     jobs24Snap.forEach((doc) => jobsList.push({ id: doc.id, ...doc.data() }));

//     setClientJobs(jobsList);
//   }, []);




//   // Inject CSS for popup
//   useEffect(() => {
//     const style = document.createElement("style");
//     style.innerHTML = `
//       .ffds-modal-backdrop {
//         position: fixed;
//         top: 0;
//         left: 0;
//         width: 100%;
//         height: 100%;
//         background: rgba(0,0,0,0.5);
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         z-index: 9999;
//       }

//       .ffds-modal {
//         background: #fff;
//         border-radius: 16px;
//         max-width: 500px;
//         width: 90%;
//         padding: 24px;
//         box-shadow: 0 10px 30px rgba(0,0,0,0.2);
//         position: relative;
//         animation: slideIn 0.3s ease-out;
//       }

//       @keyframes slideIn {
//         from { transform: translateY(-50px); opacity: 0; }
//         to { transform: translateY(0); opacity: 1; }
//       }

//       .ffds-card-title {
//         font-size: 20px;
//         font-weight: 700;
//         margin-bottom: 16px;
//       }

//       .ffds-select, .ffds-input, .ffds-textarea {
//         width: 100%;
//         padding: 10px 12px;
//         margin-bottom: 12px;
//         border: 1px solid #ccc;
//         border-radius: 10px;
//         font-size: 14px;
//         outline: none;
//         box-sizing: border-box;
//       }

//       .ffds-textarea {
//         resize: vertical;
//         min-height: 80px;
//       }

//       .ffds-modal-footer {
//         display: flex;
//         justify-content: flex-end;
//         gap: 12px;
//         margin-top: 16px;
//       }

//       .ffds-btn {
//         padding: 10px 20px;
//         font-size: 14px;
//         font-weight: 600;
//         border-radius: 12px;
//         cursor: pointer;
//         border: none;
//       }

//       .ffds-btn-outline {
//         background: white;
//         border: 2px solid #7A4DFF;
//         color: #7A4DFF;
//       }

//       .ffds-btn-primary {
//         background: #7A4DFF;
//         color: white;
//       }
//     `;
//     document.head.appendChild(style);
//     return () => {
//       document.head.removeChild(style);
//     };
//   }, []);


//   useEffect(() => {
//     if (open) fetchClientJobs();
//     else {
//       setSelectedService(null);
//       setProjectTitle("");
//       setProjectLink("");
//       setProjectDesc("");
//     }
//   }, [open, fetchClientJobs]);

//   if (!open) return null;



//   // const sendRequest = async () => {
//   //   const currentUid = auth.currentUser?.uid;
//   //   if (!currentUid) {
//   //     alert("Please login");
//   //     return;
//   //   }

//   //   if (!projectTitle.trim()) {
//   //     alert("Project title is required");
//   //     return;
//   //   }

//   //   setLoading(true);

//   //   try {

//   //     const selectedJobId = selectedService?.id || crypto.randomUUID();


//   //     const chatId = `${freelancerId}_${currentUid}`;
//   //     await set(ref(rtdb, `requestChats/${freelancerId}/${chatId}`), {
//   //       jobTitle: projectTitle.trim(),
//   //       requestStatus: "pending",
//   //       requestedAt: Date.now(),
//   //       requestedBy: currentUid,
//   //       jobId: selectedJobId,
//   //     });

//   //     // 2️⃣ Add a notification for the freelancer
//   //     await addDoc(collection(db, "notifications"), {
//   //       title: projectTitle.trim(),
//   //       body: `${auth.currentUser.displayName || "Someone"} applied for ${projectTitle.trim()}`,
//   //       clientUid: currentUid,
//   //       freelancerId,
//   //       freelancerName,
//   //       jobId: selectedJobId, // match the job ID used above
//   //       read: false,          // freelancer hasn't accepted yet
//   //       timestamp: serverTimestamp(),
//   //       type: "application",
//   //     });

//   //     alert("✅ Request sent and notification created");
//   //     onClose();
//   //   } catch (err) {
//   //     console.error(err);
//   //     alert("❌ Failed to send request");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };


//   const sendRequest = async () => {
//     const currentUser = auth.currentUser;
//     if (!currentUser) {
//       alert("Please login");
//       return;
//     }

//     if (!projectTitle.trim()) {
//       alert("Project title is required");
//       return;
//     }

//     setLoading(true);

//     try {
//       const clientUid = currentUser.uid;
//       const clientName = currentUser.displayName || "Client";
//       const selectedJobId = selectedService?.id || crypto.randomUUID();
//       const chatId = `${freelancerId}_${clientUid}`;

//       const requestData = {
//         jobTitle: projectTitle.trim(),
//         requestStatus: "pending",
//         requestedAt: Date.now(),
//         requestedBy: clientUid,
//         clientName,
//         freelancerId,
//         freelancerName,
//         jobId: selectedJobId,
//       };

//       await set(ref(rtdb, `requestChats/${freelancerId}/${chatId}`), requestData);
//       await set(ref(rtdb, `clientSentRequests/${clientUid}/${chatId}`), requestData);

//       await addDoc(collection(db, "notifications"), {
//         title: projectTitle.trim(),
//         body: `${clientName} applied for ${projectTitle.trim()}`,
//         clientUid,
//         freelancerId,
//         freelancerName,
//         jobId: selectedJobId,
//         read: false,
//         timestamp: serverTimestamp(),
//         type: "application",
//       });

//       setShowSuccessCard(true);

//       setTimeout(() => {
//         setShowSuccessCard(false);
//         onClose();
//       }, 2500);

//     } catch (err) {
//       console.error(err);
//       alert("❌ Failed to send request");
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <div className="ffds-modal-backdrop" onClick={onClose}>
//       <div className="ffds-modal" onClick={(e) => e.stopPropagation()}>
//         <div className="ffds-card-title">Connect with {freelancerName}</div>
//         <p>Bring ideas to Life!</p>

//         {/* Client jobs dropdown */}
//         {clientJobs.length > 0 && (
//           <select
//             className="ffds-select"
//             value={projectTitle}
//             onChange={(e) => setProjectTitle(e.target.value)}
//           >
//             <option value="">Select your existing Job / Project</option>
//             {clientJobs.map((job) => (
//               <option key={job.id} value={job.title}>
//                 {job.title || "Untitled"}
//               </option>
//             ))}
//           </select>
//         )}

//         {/* Optional manual override */}
//         <input
//           className="ffds-input"
//           placeholder="Project link (or type new)"
//           value={projectTitle}
//           onChange={(e) => setProjectTitle(e.target.value)}
//         />



//         <textarea
//           className="ffds-textarea"
//           placeholder="Project description (optional)"
//           value={projectDesc}
//           onChange={(e) => setProjectDesc(e.target.value)}
//         />

//         <div className="ffds-modal-footer">
//           <button className="ffds-btn ffds-btn-outline" onClick={onClose}>
//             Cancel
//           </button>
//           <button
//             className="ffds-btn ffds-btn-primary"
//             onClick={sendRequest}
//             disabled={loading}
//           >
//             {loading ? "Sending Request..." : "Send Request"}
//           </button>

//         </div>
//       </div>

//       {showSuccessCard && (
//         <div className="ffds-pop-overlay">
//           <div className="ffds-pop-card-large">
//             <div className="ffds-pop-icon-large">
//               <img src={requestsentimg} alt="" srcset="" />
//             </div>

//             <div className="ffds-pop-title-large">
//               Request Sent Successfully
//             </div>

//             <div className="ffds-pop-text-large">
//               Your request has been sent to <strong>{freelancerName}</strong>
//             </div>
//           </div>
//         </div>
//       )}


//     </div>
//   );
// }



import React, { useEffect, useState, useCallback } from "react";
import { auth, db } from "../../firbase/Firebase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { ref, set } from "firebase/database";
import { rtdb } from "../../firbase/Firebase";
import "./Connect.css"
import requestsentimg from "../../assets/requestsentimg.jpeg"



export default function ConnectPopup({
  open,
  onClose,
  freelancerId,
  freelancerName,
  services = [],
}) {
  const [selectedService, setSelectedService] = useState(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [clientJobs, setClientJobs] = useState([]);
  const [showSuccessCard, setShowSuccessCard] = useState(false);




  const navigate = useNavigate();

  // Fetch client's jobs
  const fetchClientJobs = useCallback(async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const jobsList = [];

    const jobsSnap = await getDocs(query(collection(db, "jobs"), where("userId", "==", uid)));
    jobsSnap.forEach((doc) => jobsList.push({ id: doc.id, ...doc.data() }));

    const jobs24Snap = await getDocs(query(collection(db, "jobs_24h"), where("userId", "==", uid)));
    jobs24Snap.forEach((doc) => jobsList.push({ id: doc.id, ...doc.data() }));

    setClientJobs(jobsList);
  }, []);




  // Inject CSS for popup
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .ffds-modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
      }

      .ffds-modal {
        background: #fff;
        border-radius: 16px;
        max-width: 500px;
        width: 90%;
        padding: 24px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        position: relative;
        animation: slideIn 0.3s ease-out;
      }

      @keyframes slideIn {
        from { transform: translateY(-50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }

      .ffds-card-title {
        font-size: 20px;
        font-weight: 700;
        margin-bottom: 16px;
      }

      .ffds-select, .ffds-input, .ffds-textarea {
        width: 100%;
        padding: 10px 12px;
        margin-bottom: 12px;
        border: 1px solid #ccc;
        border-radius: 10px;
        font-size: 14px;
        outline: none;
        box-sizing: border-box;
      }

      .ffds-textarea {
        resize: vertical;
        min-height: 80px;
      }

      .ffds-modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 16px;
      }

      .ffds-btn {
        padding: 10px 20px;
        font-size: 14px;
        font-weight: 600;
        border-radius: 12px;
        cursor: pointer;
        border: none;
      }

      .ffds-btn-outline {
        background: white;
        border: 2px solid #7A4DFF;
        color: #7A4DFF;
      }

      .ffds-btn-primary {
        background: #7A4DFF;
        color: white;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);


  useEffect(() => {
    if (open) fetchClientJobs();
    else {
      setSelectedService(null);
      setProjectTitle("");
      setProjectLink("");
      setProjectDesc("");
    }
  }, [open, fetchClientJobs]);

  if (!open) return null;



  // const sendRequest = async () => {
  //   const currentUid = auth.currentUser?.uid;
  //   if (!currentUid) {
  //     alert("Please login");
  //     return;
  //   }

  //   if (!projectTitle.trim()) {
  //     alert("Project title is required");
  //     return;
  //   }

  //   setLoading(true);

  //   try {

  //     const selectedJobId = selectedService?.id || crypto.randomUUID();


  //     const chatId = `${freelancerId}_${currentUid}`;
  //     await set(ref(rtdb, `requestChats/${freelancerId}/${chatId}`), {
  //       jobTitle: projectTitle.trim(),
  //       requestStatus: "pending",
  //       requestedAt: Date.now(),
  //       requestedBy: currentUid,
  //       jobId: selectedJobId,
  //     });

  //     // 2️⃣ Add a notification for the freelancer
  //     await addDoc(collection(db, "notifications"), {
  //       title: projectTitle.trim(),
  //       body: `${auth.currentUser.displayName || "Someone"} applied for ${projectTitle.trim()}`,
  //       clientUid: currentUid,
  //       freelancerId,
  //       freelancerName,
  //       jobId: selectedJobId, // match the job ID used above
  //       read: false,          // freelancer hasn't accepted yet
  //       timestamp: serverTimestamp(),
  //       type: "application",
  //     });

  //     alert("✅ Request sent and notification created");
  //     onClose();
  //   } catch (err) {
  //     console.error(err);
  //     alert("❌ Failed to send request");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const sendRequest = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("Please login");
      return;
    }

    if (!projectTitle.trim()) {
      alert("Project title is required");
      return;
    }

    setLoading(true);

    try {
      const clientUid = currentUser.uid;
      const clientName = currentUser.displayName || "Client";
      const selectedJobId = selectedService?.id || crypto.randomUUID();
      const chatId = `${freelancerId}_${clientUid}`;

      const requestData = {
        jobTitle: projectTitle.trim(),
        requestStatus: "pending",
        requestedAt: Date.now(),
        requestedBy: clientUid,
        clientName,
        freelancerId,
        freelancerName,
        jobId: selectedJobId,
      };

      await set(ref(rtdb, `requestChats/${freelancerId}/${chatId}`), requestData);
      await set(ref(rtdb, `clientSentRequests/${clientUid}/${chatId}`), requestData);

      await addDoc(collection(db, "notifications"), {
        title: projectTitle.trim(),
        body: `${clientName} applied for ${projectTitle.trim()}`,
        clientUid,
        freelancerId,
        freelancerName,
        jobId: selectedJobId,
        read: false,
        timestamp: serverTimestamp(),
        type: "application",
      });

      setShowSuccessCard(true);
     

      setTimeout(() => {
        setShowSuccessCard(false);
        onClose();
         navigate("/client-dashbroad2")
      }, 2500);

    } catch (err) {
      console.error(err);
      alert("❌ Failed to send request");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="ffds-modal-backdrop" onClick={onClose}>
      <div className="ffds-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ffds-card-title">Connect with {freelancerName}</div>
        <p>Bring ideas to Life!</p>

        {/* Client jobs dropdown */}
        {clientJobs.length > 0 && (
          <select
            className="ffds-select"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
          >
            <option value="">Select your existing Job / Project</option>
            {clientJobs.map((job) => (
              <option key={job.id} value={job.title}>
                {job.title || "Untitled"}
              </option>
            ))}
          </select>
        )}

        {/* Optional manual override */}
        <input
          className="ffds-input"
          placeholder="Project link (or type new)"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
        />



        <textarea
          className="ffds-textarea"
          placeholder="Project description (optional)"
          value={projectDesc}
          onChange={(e) => setProjectDesc(e.target.value)}
        />

        <div className="ffds-modal-footer">
          <button className="ffds-btn ffds-btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            className="ffds-btn ffds-btn-primary"
            onClick={sendRequest}
            disabled={loading}
          >
            {loading ? "Sending Request..." : "Send Request"}
          </button>

        </div>
      </div>

      {showSuccessCard && (
        <div className="ffds-pop-overlay">
          <div className="ffds-pop-card-large">
            <div className="ffds-pop-icon-large">
              <img src={requestsentimg} alt="" srcset="" />
            </div>

            <div className="ffds-pop-title-large">
              Request Sent Successfully
            </div>

            <div className="ffds-pop-text-large">
              Your request has been sent to <strong>{freelancerName}</strong>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}