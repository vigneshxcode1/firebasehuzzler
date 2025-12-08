

import { Outlet } from "react-router-dom";
import Sidebar from "../pages/Clientpages/slidebar/ClientSidebar";
import Home from "../pages/Clientpages/home/Home"
export default function ClientDashboard() {
  return (
    <div className="flex">
     
      <Sidebar />
     
      <div style={{ flex: 1, paddingLeft: "16rem" }}>
         
        <Outlet />
      </div>
    </div>
  );
}
