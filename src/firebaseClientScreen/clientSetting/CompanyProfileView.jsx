// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAuth } from "firebase/auth";
// import { getFirestore, doc, getDoc } from "firebase/firestore";
// import editicon from "../../assets/editicon.png"

// export default function CompanyProfileView() {
//   const navigate = useNavigate();

//   // ✅✅✅ 1️⃣ SIDEBAR COLLAPSED STATE
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   // ✅✅✅ 2️⃣ SIDEBAR TOGGLE LISTENER
//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

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
//     // ✅✅✅ 3️⃣ WRAPPED WHOLE UI INSIDE freelance-wrapper WITH MARGIN LEFT
//     <div
//       className="freelance-wrapper"
//       style={{
//         marginLeft: collapsed ? "-110px" : "50px",
//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       <div
//         style={{
//           minHeight: "100vh",
//           fontFamily: "Rubik",
//           background: "#fafafa",
//           display: "flex",
//           justifyContent: "center",
//         }}
//       >
//         <div style={{ width: "100%", maxWidth: 920 }}>
//           {/* HEADER WITH YELLOW GRADIENT */}
//           <div
//             style={{
//               background:
//                 "linear-gradient(180deg, #FFFECB 0%, #FFFDE4 40%, #FFFFFF 100%)",
//               padding: "40px 30px 80px",
//               borderBottomLeftRadius: 30,
//               borderBottomRightRadius: 30,
//               position: "relative",
//             }}
//           >
//             <div style={{ position: "relative" }}>
//               {/* EDIT BUTTON */}
//               <button
//                 onClick={() => navigate("/client-dashbroad2/companyprofileedit")}
//                 style={{
//                   position: "absolute",
//                   right: 10,
//                   marginTop: "-20px",
//                   border: "none",
//                   background: "transparent",
//                   cursor: "pointer",
//                 }}
//               >
//                 <img style={{width:"60px"}} src={editicon} alt="edit" />
//               </button>
//             </div>


//             {/* PROFILE ROW */}
//             <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
//               {/* AVATAR */}
//               <div
//                 style={{
//                   width: 72,
//                   height: 72,
//                   borderRadius: "50%",
//                   background: "#D8D8D8",
//                   overflow: "hidden",
//                 }}
//               >
//                 <img
//                   src={data.profileImage || ""}
//                   alt=""
//                   style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                 />
//               </div>

//               {/* TEXT */}
//               <div>
//                 <div style={{ fontSize: 30, fontWeight: 400 }}>
//                   {data.company_name || "Company Name"}
//                 </div>

//                 <div
//                   style={{
//                     color: "#707070",
//                     marginTop: 2,
//                     fontSize: 16,
//                     fontWeight: 400,
//                   }}
//                 >
//                   {data.email}
//                 </div>

//                 <div
//                   style={{
//                     marginTop: 10,
//                     color: "#3f3f3f",
//                     fontSize: 20,
//                     fontWeight: 400,
//                   }}
//                 >
//                   {data.industry || "Software development"}{" "}
//                   <span style={{ margin: "0 6px" }}>•</span>
//                   {data.location || "Chennai, Tamil Nadu"}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* CONTENT GRID */}
//           <div style={{ padding: "30px 20px" }}>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1.4fr 1fr",
//                 gap: 20,
//               }}
//             >
//               {/* LEFT SIDE */}
//               <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//                 {/* ABOUT CARD */}
//                 <div
//                   style={{
//                     background: "#fff",
//                     padding: 22,
//                     borderRadius: 20,
//                     boxShadow: "0 4px 25px rgba(0,0,0,0.07)",
//                   }}
//                 >
//                   <h3
//                     style={{
//                       marginBottom: 12,
//                       fontWeight: 400,
//                       fontSize: "24px",
//                     }}
//                   >
//                     About
//                   </h3>
//                   <p style={{ lineHeight: 1.6, color: "#444" }}>
//                     {data.business_description ||
//                       "Skilled Video Editor with 5+ years of experience in Adobe Premiere Pro, After Effects, and DaVinci Resolve. Specialize in storytelling through visuals."}
//                   </p>
//                 </div>

//                 {/* COMPANY DETAILS CARD */}
//                 <div
//                   style={{
//                     background: "#fff",
//                     padding: 22,
//                     borderRadius: 20,
//                     boxShadow: "0 4px 25px rgba(0,0,0,0.07)",
//                   }}
//                 >
//                   <p style={{ marginBottom: 8 }}>
//                     <strong style={{ fontSize: "24px", fontWeight: 400 }}>
//                       Company Size
//                     </strong>
//                     <div
//                       style={{
//                         marginTop: 10,
//                         color: "rgba(98, 98, 98, 1)",
//                       }}
//                     >
//                       {data.team_size || "15–20 employees"}
//                     </div>
//                   </p>

//                   <p style={{ marginBottom: 8 }}>
//                     <strong style={{ fontSize: "24px", fontWeight: 400 }}>
//                       Account Handler
//                     </strong>
//                     <div
//                       style={{
//                         marginTop: 10,
//                         color: "rgba(98, 98, 98, 1)",
//                       }}
//                     >
//                       {data.team_size || "15–20 employees"}
//                     </div>
//                   </p>

//                   <p>
//                     <strong style={{ fontSize: "24px", fontWeight: 400 }}>
//                       Email Address
//                     </strong>
//                     <div
//                       style={{
//                         marginTop: 10,
//                         color: "rgba(98, 98, 98, 1)",
//                       }}
//                     >
//                       {data.email}
//                     </div>
//                   </p>
//                 </div>
//               </div>

//               {/* RIGHT SIDE */}
//               <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//                 {/* SKILLS CARD */}
//                 <div
//                   style={{
//                     background: "#fff",
//                     padding: 22,
//                     borderRadius: 20,
//                     boxShadow: "0 4px 25px rgba(0,0,0,0.07)",
//                   }}
//                 >
//                   <h3
//                     style={{
//                       marginBottom: 12,
//                       fontWeight: 400,
//                       fontSize: "24px",
//                     }}
//                   >
//                     Skills
//                   </h3>

//                   <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
//                     {(data.skills || [
//                       "Video Editing",
//                       "Colour Grading",
//                       "Adobe Premiere Pro",
//                       "After Effects",
//                     ]).map((s, i) => (
//                       <span
//                         key={i}
//                         style={{
//                           background: "#FFFECF",
//                           padding: "6px 14px",
//                           borderRadius: 12,
//                           fontSize: 13,
//                           fontWeight: 500,
//                         }}
//                       >
//                         {s}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 {/* TOOLS CARD */}
//                 <div
//                   style={{
//                     background: "#fff",
//                     padding: 22,
//                     borderRadius: 20,
//                     boxShadow: "0 4px 25px rgba(0,0,0,0.07)",
//                   }}
//                 >
//                   <h3
//                     style={{
//                       marginBottom: 10,
//                       fontWeight: 400,
//                       fontSize: "24px",
//                     }}
//                   >
//                     Tools
//                   </h3>

//                   <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
//                     {(data.tools || [
//                       "Adobe Premiere Pro",
//                       "Colour Grading",
//                       "After Effects",
//                     ]).map((t, i) => (
//                       <span
//                         key={i}
//                         style={{
//                           background: "#FFFECF",
//                           padding: "6px 14px",
//                           borderRadius: 12,
//                           fontSize: 13,
//                           fontWeight: 500,
//                         }}
//                       >
//                         {t}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//               {/* RIGHT SIDE END */}
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
import editicon from "../../assets/editicon.png";

export default function CompanyProfileView() {
  const navigate = useNavigate();

  // ✅ SIDEBAR COLLAPSE STATE
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

  // ✅ MOBILE DETECTION
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
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

      if (snap.exists()) setData(snap.data());
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!data) return <div style={{ padding: 20 }}>No profile found.</div>;

  return (
    <div
      className="freelance-wrapper"
      style={{
        marginLeft: isMobile ? 0 : collapsed ? "-110px" : "50px",
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
          {/* HEADER */}
          <div
            style={{
              background:
                "linear-gradient(180deg, #FFFECB 0%, #FFFDE4 40%, #FFFFFF 100%)",
              padding: isMobile ? "30px 20px 60px" : "40px 30px 80px",
              borderBottomLeftRadius: 30,
              borderBottomRightRadius: 30,
              position: "relative",
            }}
          >
            {/* EDIT BUTTON */}
            <button
              onClick={() =>
                navigate("/client-dashbroad2/companyprofileedit")
              }
              style={{
                position: "absolute",
                right: 10,
                top: 10,
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              <img
                style={{ width: isMobile ? "42px" : "60px" }}
                src={editicon}
                alt="edit"
              />
            </button>

            {/* PROFILE */}
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "flex-start" : "center",
                gap: 18,
              }}
            >
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

              <div>
                <div
                  style={{
                    fontSize: isMobile ? 22 : 30,
                    fontWeight: 400,
                  }}
                >
                  {data.company_name || "Company Name"}
                </div>

                <div
                  style={{
                    color: "#707070",
                    marginTop: 2,
                    fontSize: isMobile ? 14 : 16,
                  }}
                >
                  {data.email}
                </div>

                <div
                  style={{
                    marginTop: 10,
                    color: "#3f3f3f",
                    fontSize: isMobile ? 16 : 20,
                  }}
                >
                  {data.industry || "Software development"} •{" "}
                  {data.location || "Chennai, Tamil Nadu"}
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div style={{ padding: isMobile ? "20px 14px" : "30px 20px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr",
                gap: 20,
              }}
            >
              {/* LEFT */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <Card title="About">
                  <p style={{ lineHeight: 1.6, color: "#444" }}>
                    {data.business_description ||
                      "Company description goes here"}
                  </p>
                </Card>

                <Card title="Company Size">
                  {data.team_size || "15–20 employees"}
                </Card>

                <Card title="Account Handler">
                  {data.team_size || "15–20 employees"}
                </Card>

                <Card title="Email Address">{data.email}</Card>
              </div>

              {/* RIGHT */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <TagCard title="Skills" items={data.skills} />
                <TagCard title="Tools" items={data.tools} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- SMALL REUSABLE UI PARTS ---------- */

function Card({ title, children }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: 22,
        borderRadius: 20,
        boxShadow: "0 4px 25px rgba(0,0,0,0.07)",
      }}
    >
      <h3 style={{ marginBottom: 12, fontWeight: 400, fontSize: 22 }}>
        {title}
      </h3>
      <div style={{ color: "#626262" }}>{children}</div>
    </div>
  );
}

function TagCard({ title, items = [] }) {
  return (
    <Card title={title}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {(items.length ? items : ["Sample"]).map((i, idx) => (
          <span
            key={idx}
            style={{
              background: "#FFFECF",
              padding: "6px 14px",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {i}
          </span>
        ))}
      </div>
    </Card>
  );
}
