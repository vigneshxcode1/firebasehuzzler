

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAuth } from "firebase/auth";
// import { getFirestore, doc, getDoc } from "firebase/firestore";

// export default function CompanyProfileView() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       const auth = getAuth();
//       const user = auth.currentUser;
//       if (!user) return;

//       const db = getFirestore();
//       const snap = await getDoc(doc(db, "users", user.uid));

//       if (snap.exists()) {
//         setData(snap.data());
//       }
//       setLoading(false);
//     };
//     fetchData();
//   }, []);

//   if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
//   if (!data) return <div style={{ padding: 20 }}>No profile found.</div>;

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         fontFamily: "Rubik",
//         background: "#fafafa",
//         display: "flex",
//         justifyContent: "center",
//       }}
//     >
//       <div style={{ width: "100%", maxWidth: 920 }}>
//         {/* HEADER WITH YELLOW GRADIENT */}
//         <div
//           style={{
//             background: "linear-gradient(180deg, #FFFECB 0%, #FFFDE4 40%, #FFFFFF 100%)",
//     padding: "40px 30px 80px",
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//     position: "relative",
//           }}
//         >
//           {/* EDIT BUTTON */}
//           <button
//             onClick={() => navigate("/client-dashbroad2/clientsetting")}
//             style={{
//               position: "absolute",
//               top: 100,
//               right: 20,
//               padding: "10px 24px",
//               backgroundColor: "rgba(253, 253, 150, 1)",
//               color: "#000",
//               border: "none",
//               borderRadius: 12,
//               fontSize: 14,
//               fontWeight: 600,
//               cursor: "pointer",
//               boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
//             }}
//           >
//             Edit
//           </button>

//           {/* PROFILE ROW */}
//           <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
//             {/* AVATAR */}
//             <div
//               style={{
//                 width: 72,
//                 height: 72,
//                 borderRadius: "50%",
//                 background: "#D8D8D8",
//                 overflow: "hidden",
//               }}
//             >
//               <img
//                 src={data.profileImage || ""}
//                 alt=""
//                 style={{ width: "100%", height: "100%", objectFit: "cover" }}
//               />
//             </div>

//             {/* TEXT */}
//             <div>
//               <div style={{ fontSize: 30, fontWeight: 400 }}>
//                 {data.company_name || "Company Name"}
//               </div>

//               <div style={{ color: "#707070", marginTop: 2 ,fontSize: 16, fontWeight: 400 }}>
//                 {data.email}
//               </div>

//               <div style={{ marginTop: 10, color: "#3f3f3f", fontSize:20,fontWeight:400 }}>
//                 {data.industry || "Software development"}{" "}
//                 <span style={{ margin: "0 6px" }}>•</span>
//                 {data.location || "Chennai, Tamil Nadu"}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* CONTENT GRID */}
//         <div style={{ padding: "30px 20px" }}>
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1.4fr 1fr",
//               gap: 20,
//             }}
//           >
//             {/* LEFT SIDE */}
//             <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//               {/* ABOUT CARD */}
//               <div
//                 style={{
//                   background: "#fff",
//                   padding: 22,
//                   borderRadius: 20,
//                   boxShadow: "0 4px 25px rgba(0,0,0,0.07)",
//                 }}
//               >
//                 <h3 style={{ marginBottom: 12, fontWeight: 400,fontSize:"24px" }}>About</h3>
//                 <p style={{ lineHeight: 1.6, color: "#444" }}>
//                   {data.business_description ||
//                     "Skilled Video Editor with 5+ years of experience in Adobe Premiere Pro, After Effects, and DaVinci Resolve. Specialize in storytelling through visuals."}
//                 </p>
//               </div>

//               {/* COMPANY DETAILS CARD */}
//               <div
//                 style={{
//                   background: "#fff",
//                   padding: 22,
//                   borderRadius: 20,
//                   boxShadow: "0 4px 25px rgba(0,0,0,0.07)",
//                 }}
//               >
//                 {/* <h3 style={{ marginBottom: 12, fontWeight: 700 }}>
//                   Company Details
//                 </h3> */}

//                 <p style={{ marginBottom: 8, }}>
//                   <strong style={{fontSize:"24px",fontWeight:400 }}>Company Size</strong> 
//                   <div style={{marginTop:10,color:"rgba(98, 98, 98, 1)"}}>{data.team_size || "15–20 employees"}</div>
//                 </p>

//                 <p style={{ marginBottom: 8 }}>
//                   <strong style={{fontSize:"24px",fontWeight:400 }}>Account Handler</strong>
//                   {/* {data.account_handler || "15–20 employees"} */}
//                    <div style={{marginTop:10,marginTop:10,color:"rgba(98, 98, 98, 1)"}}>{data.team_size || "15–20 employees"}</div>
//                 </p>

//                 <p>
//                   <strong style={{fontSize:"24px",fontWeight:400 }}>Email Address</strong> 
//                    <div style={{marginTop:10,marginTop:10,color:"rgba(98, 98, 98, 1)"}}>{data.email}</div>
//                 </p>
//               </div>
//             </div>

//             {/* RIGHT SIDE */}
//             <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//               {/* SKILLS CARD */}
//               <div
//                 style={{
//                   background: "#fff",
//                   padding: 22,
//                   borderRadius: 20,
//                   boxShadow: "0 4px 25px rgba(0,0,0,0.07)",
//                 }}
//               >
//                 <h3 style={{ marginBottom: 12, fontWeight: 400,fontSize:"24px" }}>Skills</h3>

//                 <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
//                   {(data.skills || [
//                     "Video Editing",
//                     "Colour Grading",
//                     "Adobe Premiere Pro",
//                     "After Effects",
//                   ]).map((s, i) => (
//                     <span
//                       key={i}
//                       style={{
//                         background: "#FFFECF",
//                         padding: "6px 14px",
//                         borderRadius: 12,
//                         fontSize: 13,
//                         fontWeight: 500,
//                       }}
//                     >
//                       {s}
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               {/* TOOLS CARD */}
//               <div
//                 style={{
//                   background: "#fff",
//                   padding: 22,
//                   borderRadius: 20,
//                   boxShadow: "0 4px 25px rgba(0,0,0,0.07)",
//                 }}
//               >
//                 <h3 style={{ marginBottom: 10, fontWeight: 400,fontSize:"24px"}}>Tools</h3>

//                 <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
//                   {(data.tools || [
//                     "Adobe Premiere Pro",
//                     "Colour Grading",
//                     "After Effects",
//                   ]).map((t, i) => (
//                     <span
//                       key={i}
//                       style={{
//                         background: "#FFFECF",
//                         padding: "6px 14px",
//                         borderRadius: 12,
//                         fontSize: 13,
//                         fontWeight: 500,
//                       }}
//                     >
//                       {t}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export default function CompanyProfileView() {
  const navigate = useNavigate();

  // ✅✅✅ 1️⃣ SIDEBAR COLLAPSED STATE
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  // ✅✅✅ 2️⃣ SIDEBAR TOGGLE LISTENER
  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const db = getFirestore();
      const snap = await getDoc(doc(db, "users", user.uid));

      if (snap.exists()) {
        setData(snap.data());
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!data) return <div style={{ padding: 20 }}>No profile found.</div>;

  return (
    // ✅✅✅ 3️⃣ WRAPPED WHOLE UI INSIDE freelance-wrapper WITH MARGIN LEFT
    <div
      className="freelance-wrapper"
      style={{
        marginLeft: collapsed ? "-110px" : "50px",
        transition: "margin-left 0.25s ease",
      }}
    >
      <div
        style={{
          minHeight: "100vh",
          fontFamily: "Rubik",
          background: "#fafafa",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: 920 }}>
          {/* HEADER WITH YELLOW GRADIENT */}
          <div
            style={{
              background:
                "linear-gradient(180deg, #FFFECB 0%, #FFFDE4 40%, #FFFFFF 100%)",
              padding: "40px 30px 80px",
              borderBottomLeftRadius: 30,
              borderBottomRightRadius: 30,
              position: "relative",
            }}
          >
            {/* EDIT BUTTON */}
            <button
              onClick={() => navigate("/client-dashbroad2/clientsetting")}
              style={{
                position: "absolute",
                top: 100,
                right: 20,
                padding: "10px 24px",
                backgroundColor: "rgba(253, 253, 150, 1)",
                color: "#000",
                border: "none",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
              }}
            >
              Edit
            </button>

            {/* PROFILE ROW */}
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              {/* AVATAR */}
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "#D8D8D8",
                  overflow: "hidden",
                }}
              >
                <img
                  src={data.profileImage || ""}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* TEXT */}
              <div>
                <div style={{ fontSize: 30, fontWeight: 400 }}>
                  {data.company_name || "Company Name"}
                </div>

                <div
                  style={{
                    color: "#707070",
                    marginTop: 2,
                    fontSize: 16,
                    fontWeight: 400,
                  }}
                >
                  {data.email}
                </div>

                <div
                  style={{
                    marginTop: 10,
                    color: "#3f3f3f",
                    fontSize: 20,
                    fontWeight: 400,
                  }}
                >
                  {data.industry || "Software development"}{" "}
                  <span style={{ margin: "0 6px" }}>•</span>
                  {data.location || "Chennai, Tamil Nadu"}
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT GRID */}
          <div style={{ padding: "30px 20px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 1fr",
                gap: 20,
              }}
            >
              {/* LEFT SIDE */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* ABOUT CARD */}
                <div
                  style={{
                    background: "#fff",
                    padding: 22,
                    borderRadius: 20,
                    boxShadow: "0 4px 25px rgba(0,0,0,0.07)",
                  }}
                >
                  <h3
                    style={{
                      marginBottom: 12,
                      fontWeight: 400,
                      fontSize: "24px",
                    }}
                  >
                    About
                  </h3>
                  <p style={{ lineHeight: 1.6, color: "#444" }}>
                    {data.business_description ||
                      "Skilled Video Editor with 5+ years of experience in Adobe Premiere Pro, After Effects, and DaVinci Resolve. Specialize in storytelling through visuals."}
                  </p>
                </div>

                {/* COMPANY DETAILS CARD */}
                <div
                  style={{
                    background: "#fff",
                    padding: 22,
                    borderRadius: 20,
                    boxShadow: "0 4px 25px rgba(0,0,0,0.07)",
                  }}
                >
                  <p style={{ marginBottom: 8 }}>
                    <strong style={{ fontSize: "24px", fontWeight: 400 }}>
                      Company Size
                    </strong>
                    <div
                      style={{
                        marginTop: 10,
                        color: "rgba(98, 98, 98, 1)",
                      }}
                    >
                      {data.team_size || "15–20 employees"}
                    </div>
                  </p>

                  <p style={{ marginBottom: 8 }}>
                    <strong style={{ fontSize: "24px", fontWeight: 400 }}>
                      Account Handler
                    </strong>
                    <div
                      style={{
                        marginTop: 10,
                        color: "rgba(98, 98, 98, 1)",
                      }}
                    >
                      {data.team_size || "15–20 employees"}
                    </div>
                  </p>

                  <p>
                    <strong style={{ fontSize: "24px", fontWeight: 400 }}>
                      Email Address
                    </strong>
                    <div
                      style={{
                        marginTop: 10,
                        color: "rgba(98, 98, 98, 1)",
                      }}
                    >
                      {data.email}
                    </div>
                  </p>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* SKILLS CARD */}
                <div
                  style={{
                    background: "#fff",
                    padding: 22,
                    borderRadius: 20,
                    boxShadow: "0 4px 25px rgba(0,0,0,0.07)",
                  }}
                >
                  <h3
                    style={{
                      marginBottom: 12,
                      fontWeight: 400,
                      fontSize: "24px",
                    }}
                  >
                    Skills
                  </h3>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {(data.skills || [
                      "Video Editing",
                      "Colour Grading",
                      "Adobe Premiere Pro",
                      "After Effects",
                    ]).map((s, i) => (
                      <span
                        key={i}
                        style={{
                          background: "#FFFECF",
                          padding: "6px 14px",
                          borderRadius: 12,
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* TOOLS CARD */}
                <div
                  style={{
                    background: "#fff",
                    padding: 22,
                    borderRadius: 20,
                    boxShadow: "0 4px 25px rgba(0,0,0,0.07)",
                  }}
                >
                  <h3
                    style={{
                      marginBottom: 10,
                      fontWeight: 400,
                      fontSize: "24px",
                    }}
                  >
                    Tools
                  </h3>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {(data.tools || [
                      "Adobe Premiere Pro",
                      "Colour Grading",
                      "After Effects",
                    ]).map((t, i) => (
                      <span
                        key={i}
                        style={{
                          background: "#FFFECF",
                          padding: "6px 14px",
                          borderRadius: 12,
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {/* RIGHT SIDE END */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
