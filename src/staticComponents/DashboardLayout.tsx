import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
// import Topbar from "./Topbar";
// import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  return (
    <div className="bg-slate-100 min-h-screen">
      <Topbar />
      <Sidebar />
      <main className="ml-64 pt-[72px] h-screen overflow-hidden bg-slate-100">
        <div className="h-[calc(100vh-72px)] overflow-y-auto scrollbar-none p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;