// import { Outlet } from "react-router-dom";
// import Sidebar from "./Freelancerpage/components/Sidebar";

// export default function FreelancerDashboard() {
//   return (
//     <div className="flex">
//       <Sidebar />

//       {/* Main Content */}
//       <div style={{ flex: 1, marginLeft: "16rem" }}>
//         <Outlet />
//       </div>
//     </div>
//   );
// }




import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Freelancerpage/components/Sidebar";

export default function FreelancerDashboard() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="flex w-full">
      {/* Sidebar (your existing functionality stays) */}
      <Sidebar />

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          width: "100%",
          marginLeft: isMobile ? 0 : "16rem", // 🔥 ONLY FIX
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}