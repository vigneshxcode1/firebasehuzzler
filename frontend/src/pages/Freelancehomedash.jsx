import { Outlet } from "react-router-dom";
import Sidebar from "./Freelancerpage/components/Sidebar";

export default function FreelancerDashboard() {
  return (
    <div className="flex">
      <Sidebar />

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: "16rem" }}>
        <Outlet />
      </div>
    </div>
  );
}

