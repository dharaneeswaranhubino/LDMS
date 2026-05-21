import { Link } from "react-router-dom";
import { useAppSelector } from "../../../shared/hooks/reduxHooks";
import ProfileDropdown from "./ProfileDropdown";

const Topbar = () => {
  const { user } = useAppSelector((state) => state.auth);

  const roleDashboardMap: Record<string, string> = {
    admin: "/adminDashboard",
    customer: "/customerDashboard",
    deliveryAgent: "/agentDashboard",
  };

  const dashboardRoute = roleDashboardMap[user?.role as string] || "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-18 px-6 flex items-center justify-between border-b border-white/20 bg-gradient-to-r from-slate-50 via-blue-50 to-cyan-50 backdrop-blur-xl shadow-lg">
      <div className="flex items-center gap-10">
        <Link to={dashboardRoute} className="flex items-center gap-4 group">
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-200 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
            <i className="fa-solid fa-truck-fast text-white text-[18px] relative z-10"></i>
          </div>

          <div>
            <h1 className="text-[21px] font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent leading-none">
              LDMS
            </h1>

            <p className="text-[11px] font-medium tracking-wide text-slate-500 mt-[4px] uppercase">
              Logistics & Delivery
            </p>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {/* {user?.role == "admin" && (
        )} */}
        <button className="text-2xl flex">
          <i className="fa-regular fa-bell"></i>
          <span className="absolute ml-4 flex items-center justify-center h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </button>
        <div className="ring-2 ring-blue-100 rounded-full">
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
