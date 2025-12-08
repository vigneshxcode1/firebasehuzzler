// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { doc, getDoc } from "firebase/firestore";
// import { auth, db } from "../../firbase/Firebase";

// import categoryImg from "../../assets/categories.jpeg";
// import notification from "../../assets/notification.png";
// import message from "../../assets/message.png";
// import backarrow from "../../assets/backarrow.png";   // ✅ FIXED duplicate import

// // Lucide Icons
// import { Plus } from "lucide-react";
// import { onAuthStateChanged } from "firebase/auth";

// export default function FreelanceCategoryPage() {
//   const [searchText, setSearchText] = useState("");

//   const [user, setUser] = useState({
//     firstName: "",
//     lastName: "",
//     profileImage: "",
//   });

//   const navigate = useNavigate();

//   // 🔥 Fetch user details
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) return;

//       try {
//         const userRef = doc(db, "users", currentUser.uid);
//         const snap = await getDoc(userRef);

//         if (snap.exists()) {
//           const data = snap.data();
//           setUser({
//             firstName: data.firstName || "",
//             lastName: data.lastName || "",
//             profileImage: data.profileImage || "",
//           });
//         }
//       } catch (error) {
//         console.error("Firestore error:", error);
//       }
//     });

//     return () => unsubscribe();
//   }, []);
  

//   const categories = [
//     "Graphic Designer",
//     "Web Developer",
//     "Mobile Developer",
//     "UI/UX Designer",
//     "Content Writer",
//     "Digital Marketing",
//     "Video Editor",
//     "3D Artist",
//   ];

//   const filteredCategories = searchText.trim()
//     ? categories.filter((cat) =>
//         cat.toLowerCase().includes(searchText.toLowerCase())
//       )
//     : categories;

//   return (
//     <div className="page">
//       <style>{`
//         .page {
//           min-height: 100vh;
//           font-family: 'Poppins', sans-serif;
//           padding-bottom: 70px;
//         }

//         /* HEADER */
//         .header {
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-start;
//           padding: 5px 30px 0;
//         }

//         .header-title h1 {
//           font-size: 36px;
//           font-weight: 700;
//           color: #000;
//         }

//         .header-title p {
//           margin-top: 6px;
//           color: #666;
//           font-size: 16px;
//         }

//         .header-icons {
//           display: flex;
//           gap: 22px;
//           margin-top: 22px;
//         }

//         /* SEARCH */
//         .search-box {
//           margin: 20px 20px 0;
          
//           padding-top:11px;
//           padding-left:20px;
//           background: rgba(255, 249, 184, 0.8);
//           border-radius: 14px;
          
//           display: flex;
//           align-items: center;
//           gap: 11px;
//           box-shadow: 0 2px 6px rgba(0,0,0,0.08);
//         }

//         .search-input {
//           height:1px;
//           width:30px;
//           flex: 1;
//           border: none;
//           background: transparent;
//           outline: none;
//           font-size: 15px;
//           padding: 10px 0;
//         }

//         /* TITLES */
//         .main-title {
//           margin: 30px 50px 5px;
//           font-size: 26px;
//           font-weight: 600;
//           margin-left:-799px;
//         }

//         .sub-title {
//           margin: 13px 34px 2px;
//           color: #666;

//         }

//         /* GRID */
//         .grid {
//           margin: 20px 30px 40px;
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
//           gap: 25px;
//         }

//         /* CATEGORY CARD */
//         .card {
//           background: white;
//           border-radius: 20px;
//           overflow: hidden;
//           box-shadow: 0 3px 12px rgba(0,0,0,0.08);
//           transition: 0.2s;
//           cursor: pointer;
//         }

//         .card:hover {
//           transform: translateY(-4px);
//           box-shadow: 0 6px 18px rgba(0,0,0,0.12);
//         }

//         .card-top {
//           height: 120px;
//           background: #9850F8;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           position: relative;
//         }

//         .card-top img {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//           opacity: 0.45;
//         }

//         .card-name {
//           text-align: center;
//           padding: 12px 0 16px;
//           font-weight: 600;
//           color: #333;
//           font-size: 15px;
//         }

//         /* ADD BUTTON */
//         .add-btn {
//           position: fixed;
//           bottom: 30px;
//           right: 30px;
//           width: 60px;
//           height: 60px;
//           border-radius: 50%;
//           background: linear-gradient(90deg, rgba(124,58,237,1), rgba(99,102,241,1));
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           box-shadow: 0 6px 18px rgba(0,0,0,0.18);
//           cursor: pointer;
//           z-index: 2000;
//           transition: 0.2s;
//         }

//         .add-btn:hover {
//           transform: scale(1.05);
//         }
//       `}</style>

//   <div style={{ marginLeft: collapsed ? "-111px" : "50px",transition: "margin-left 0.25s ease",}}>
//         {/* HEADER */}
//       <div className="header">
//         <div className="header-title">
//           <h1>
//             Welcome,<br />
//             {user.firstName} {user.lastName}
//           </h1>
//           <p>Discover projects that match your skills</p>
//         </div>

//         <div className="header-icons">
//           <img
//             src={message}
//            style={{width:"31px", height:"29px" ,cursor: "pointer"}}
//             onClick={() => navigate("/freelancermessages")}
//           />
//           <img
//             src={notification}
//             style={{ width: 28, height: 28, cursor: "pointer" }}
//             onClick={() => navigate("/notifications")}
//           />
//           <img
//             src={user.profileImage || "https://i.pravatar.cc/60"}
//             style={{
//               width: 42,
//               height: 42,
//               borderRadius: "50%",
//               objectFit: "cover",
//             }}
//           />
//         </div>
//       </div>

//       {/* SEARCH */}
//       <div className="search-box">
//         <svg width="20" height="32"  fill="#666">
//           <circle cx="9" cy="9" r="7" stroke="#666" strokeWidth="2" fill="none"></circle>
//           <line x1="14" y1="14" x2="19" y2="19" stroke="#666" strokeWidth="2"></line>
//         </svg>
//         <input
//           className="search-input"
//           placeholder="Search"
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//         />
//       </div>

//       {/* BACK BUTTON */}
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: 12,
//           margin: "25px 40px 0",
//           cursor: "pointer",
//           width: "fit-content",
//         }}
//         onClick={() => navigate(-1)}
//       >
//         <div
//           style={{
//             width: 36,
//             height: 36,
//             borderRadius: 12,
//             background: "#fff",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
//           }}
//         >
//           <img src={backarrow} style={{ width: 20 }} alt="back" />
//         </div>

//         <span
//           style={{
//             fontSize: 24,
//             // width:"249.65px",
//             // height:"40px",
//             fontWeight: 700,
//             fontFamily: "Inter, sans-serif",
//             color: "#000",
//           }}
//         >
//           Browse Projects
//         </span>
//       </div>

//       {/* TITLES */}
//       <h2 className="main-title">What Are You Looking For?</h2>
//       <p className="sub-title">Choose Your Category</p>

//       {/* CATEGORY GRID */}
//       <div className="grid">
//         {filteredCategories.map((cat, index) => (
//           <div
//             key={index}
//             className="card"
//             onClick={() =>
//               navigate("/freelance-dashboard/categories", {
//                 state: { category: cat },
//               })
//             }
//           >
//             <div className="card-top">
//               <img src={categoryImg}  />
//             </div>
//             <p className="card-name">{cat}</p>
//           </div>
//         ))}
//       </div>

//       {/* ADD BUTTON */}
//       <div
//         className="add-btn"
//         onClick={() => navigate("/freelance-dashboard/add-service-form")}
//       >
//         <Plus size={28} color="white" />
//       </div>
//     </div>
// </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firbase/Firebase";

import categoryImg from "../../assets/categories.jpeg";
import notification from "../../assets/notification.png";
import message from "../../assets/message.png";
import backarrow from "../../assets/backarrow.png";
import search from "../../assets/search.png";

import { Plus } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";

export default function FreelanceCategoryPage() {
  const [searchText, setSearchText] = useState("");

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    profileImage: "",
  });

  const navigate = useNavigate();

  // 🔥 GET USER DETAILS
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) return;

      try {
        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const data = snap.data();
          setUser({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            profileImage: data.profileImage || "",
          });
        }
      } catch (error) {
        console.error("Firestore error:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  // ⭐ ADD THIS — SIDEBAR COLLAPSE STATE
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  // ===========================================
  // CATEGORY LIST
  // ===========================================
  const categories = [
    "Graphic Designer",
    "Web Developer",
    "Mobile Developer",
    "UI/UX Designer",
    "Content Writer",
    "Digital Marketing",
    "Video Editor",
    "3D Artist",
  ];

  const filteredCategories = searchText.trim()
    ? categories.filter((cat) =>
        cat.toLowerCase().includes(searchText.toLowerCase())
      )
    : categories;

  return (
    <div className="page">
      <style>{`
        .page {
          min-height: 100vh;
          font-family: 'Poppins', sans-serif;
          padding-bottom: 70px;
          margin-left:40px;
        }

        /* HEADER */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 5px 30px 0;
        }

        .header-title h1 {
          font-size: 36px;
          font-weight: 700;
          color: #000;
        }

        .header-title p {
          margin-top: 6px;
          color: #666;
          font-size: 16px;
        }

        .header-icons {
          display: flex;
          gap: 22px;
          margin-top: 22px;
        }

        /* SEARCH */
        .search-box {
          margin: 20px 20px 0;
          padding-top: 11px;
          padding-left: 30px;
          background: rgba(255, 249, 184, 0.8);
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 25px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
        }

        .search-input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 14px;
          font-weight: 400;
          padding: 0px 0;
          margi-left:-10pxx;
        }

        /* TITLES */
        .main-title {
          margin: 30px 50px 5px;
          font-size: 26px;
          font-weight: 600;
        }

        .sub-title {
          margin: 13px 34px 2px;
          color: #666;
        }

        /* GRID */
        .grid {
          margin: 20px 30px 40px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
          gap: 25px;
        }

        /* CATEGORY CARD */
        .card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 3px 12px rgba(0,0,0,0.08);
          transition: 0.2s;
          cursor: pointer;
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 18px rgba(0,0,0,0.12);
        }

        .card-top {
          height: 120px;
          background: #9850F8;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-top img {
          width: 100%;
          height: 100%;
          opacity: 0.45;
          object-fit: cover;
        }

        .card-name {
          text-align: center;
          padding: 12px 0 16px;
          font-weight: 600;
          color: #333;
        }

        /* ADD BUTTON */
        .add-btn {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(90deg, rgba(124,58,237,1), rgba(99,102,241,1));
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 18px rgba(0,0,0,0.18);
          cursor: pointer;
          z-index: 2000;
          transition: 0.2s;
        }

        .add-btn:hover {
          transform: scale(1.05);
        }
      `}</style>

      {/* ⭐ WRAPPER THAT MOVES WITH SIDEBAR */}
      <div
        style={{
          marginLeft: collapsed ? "-161px" : "60px",
          transition: "margin-left 0.25s ease",
        }}
      >
        {/* HEADER */}
        <div className="header">
          <div className="header-title">
            <h1>
              Welcome,<br />
              {user.firstName} {user.lastName}
            </h1>
            <p>Discover projects that match your skils</p>
          </div>

          <div className="header-icons">
            <img
              src={message}
              style={{ width: 31, height: 29, cursor: "pointer" }}
              onClick={() => navigate("/freelancermessages")}
            />
            <img
              src={notification}
              style={{ width: 28, height: 28, cursor: "pointer" }}
              onClick={() => navigate("/notifications")}
            />
            <img
              src={user.profileImage || "https://i.pravatar.cc/60"}
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="search-box">
         
         <img style={{width:"20px", marginTop:"-5px",marginLeft:'-10px'}} src={search} alt="search" />
          <input
            className="search-input"
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* BACK BUTTON */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "25px 40px 0",
            cursor: "pointer",
            width: "fit-content",
          }}
          onClick={() => navigate(-1)}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
            }}
          >
            <img src={backarrow} style={{ width: 20 }} alt="back" />
          </div>

          <span
            style={{
              fontSize: 24,
              fontWeight: 700,
              fontFamily: "Inter, sans-serif",
              color: "#000",
            }}
          >
            Browse Projects
          </span>
        </div>

        {/* TITLES */}
        <h2
          className="main-title"
          style={{
            marginLeft: collapsed ? "-870px" : "-799px",
            transition: "margin-left 0.25s ease",
          }}
        >
          What Are You Looking For?
        </h2>

        <p className="sub-title">Choose Your Category</p>

        {/* CATEGORY GRID */}
        <div className="grid">
          {filteredCategories.map((cat, index) => (
            <div
              key={index}
              className="card"
              onClick={() =>
                navigate("/freelance-dashboard/categories", {
                  state: { category: cat },
                })
              }
            >
              <div className="card-top">
                <img src={categoryImg} />
              </div>
              <p className="card-name">{cat}</p>
            </div>
          ))}
        </div>

        {/* ADD SERVICE BUTTON */}
        <div
          className="add-btn"
          onClick={() => navigate("/freelance-dashboard/add-service-form")}
        >
          <Plus size={28} color="white" />
        </div>
      </div>
    </div>
  );
}
