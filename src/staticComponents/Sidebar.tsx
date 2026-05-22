import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../shared/hooks/reduxHooks";
import useRole from "../shared/hooks/useRole";
import { logoutUser } from "../features/auth/authSlice";

interface MenuItem {
  name: string;
  path: string;
  section: string;
  icon: React.ReactNode;
  allowedRole: string;
  badge?: number;
}

const roleColors = {
  admin:
    "bg-gradient-to-br from-sky-50 via-cyan-100 to-indigo-50 text-cyan-800",
  deliveryAgent:
    "bg-gradient-to-br from-cyan-50 via-indigo-200 to-sky-50 text-indigo-600 ",
  customer: "bg-blue-500 text-white",
};

const menu: MenuItem[] = [
  //admin role
  {
    name: "Admin Dashboard",
    path: "/adminDashboard",
    section: "MAIN",
    allowedRole: "admin",
    icon: <i className="fa-solid fa-table-cells-large text-[13px]"></i>,
  },
  {
    name: "All shipment",
    path: "/allShipment",
    section: "MAIN",
    allowedRole: "admin",
    icon: <i className="fa-brands fa-buffer"></i>,
    badge: 3,
  },
  {
    name: "Agent Management",
    path: "/agentManagement",
    section: "MAIN",
    allowedRole: "admin",
    icon: <i className="fa-solid fa-user-gear"></i>,
  },
  {
    name: "Agent Registeration",
    path: "/agentRegisteration",
    section: "MAIN",
    allowedRole: "admin",
    icon: <i className="fa-solid fa-users"></i>,
  },
  {
    name: "Live Tracking",
    path: "/liveTracking",
    section: "MAIN",
    allowedRole: "admin",
    icon: <i className="fa-regular fa-map text-[13px]"></i>,
  },

  //delivery agent role
  {
    name: "Agent Dashboard",
    path: "/agentDashboard",
    section: "MAIN",
    allowedRole: "deliveryAgent",
    icon: <i className="fa-solid fa-table-cells-large text-[13px]"></i>,
  },
  {
    name: "Delivery Details",
    path: "/deliveryDetail",
    section: "MAIN",
    allowedRole: "deliveryAgent",
    icon: <i className="fa-solid fa-road-circle-check text-[13px]"></i>,
  },
  {
    name: "Customer Chat",
    path: "/customerChat",
    section: "SUPPORT",
    allowedRole: "deliveryAgent",
    icon: <i className="fa-regular fa-comment text-[13px]"></i>,
    badge: 2,
  },
  {
    name: "My profile",
    path: "/profile",
    section: "ACCOUNT",
    allowedRole: "deliveryAgent",
    icon: <i className="fa-regular fa-user text-[13px]"></i>,
  },

  //customer role
  {
    name: "Customer Dashboard",
    path: "/customerDashboard",
    section: "MAIN",
    allowedRole: "customer",
    icon: <i className="fa-solid fa-table-cells-large text-[13px]"></i>,
  },
  {
    name: "Send shipment",
    path: "/sendShipment",
    section: "MAIN",
    allowedRole: "customer",
    icon: <i className="fa-solid fa-plus text-[13px]"></i>,
  },
  {
    name: "My shipments",
    path: "/myShipments",
    section: "MAIN",
    allowedRole: "customer",
    icon: <i className="fa-solid fa-cube text-[13px]"></i>,
    badge: 3,
  },
  {
    name: "Track shipment",
    path: "/trackShipments",
    section: "MAIN",
    allowedRole: "customer",
    icon: <i className="fa-solid fa-location-dot text-[13px]"></i>,
  },
  {
    name: "Payments",
    path: "/payments",
    section: "FINANCE",
    allowedRole: "customer",
    icon: <i className="fa-solid fa-credit-card text-[13px]"></i>,
  },
  {
    name: "Invoices",
    path: "/invoices",
    section: "FINANCE",
    allowedRole: "customer",
    icon: <i className="fa-regular fa-file-lines text-[13px]"></i>,
  },
  {
    name: "Agent Chat",
    path: "/agentChat",
    section: "SUPPORT",
    allowedRole: "customer",
    icon: <i className="fa-regular fa-comment text-[13px]"></i>,
    badge: 2,
  },
  {
    name: "Notifications",
    path: "/notifications",
    section: "SUPPORT",
    allowedRole: "customer",
    icon: <i className="fa-regular fa-bell text-[13px]"></i>,
    badge: 5,
  },
  {
    name: "My profile",
    path: "/profile",
    section: "ACCOUNT",
    allowedRole: "customer",
    icon: <i className="fa-regular fa-user text-[13px]"></i>,
  },
];

const sections = ["MAIN", "FINANCE", "SUPPORT", "ACCOUNT"];

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { hasRole } = useRole();
  const { isInitialized, user } = useAppSelector((state) => state.auth);

  const filteredMenu = menu.filter((item) => hasRole(item.allowedRole));

  const [showScrollbar, setShowScrollbar] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();

  const handleScroll = () => {
    setShowScrollbar(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShowScrollbar(false);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const getFirstLetterCapital = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };
  return (
    <aside
      onScroll={handleScroll}
      className={`fixed top-[72px] left-0 w-64 h-[calc(100vh-72px)] bg-white border-r border-slate-200 flex flex-col justify-between overflow-y-auto z-40 ${
        showScrollbar ? "scrollbar-none" : "scrollbar-none"
      }`}
    >
      <div className="px-3 py-4">
        <div className="text-xl font-bold flex justify-center item-center my-4 whitespace-nowrap">{`${getFirstLetterCapital(user?.role)} Panel`}</div>
        {sections.map((section) => {
          const sectionItems = filteredMenu.filter(
            (item) => item.section === section,
          );
          return (
            <div key={section} className="mb-5">
              <p className="text-[11px] text-slate-400 font-semibold uppercase mb-2 px-2">
                {section}
              </p>
              <nav className="space-y-1">
                {sectionItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={`w-full h-[42px] rounded-lg flex items-center justify-between px-3 text-[13px] font-medium transition-all ${
                        isActive
                          ? roleColors[user?.role as keyof typeof roleColors]
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-md flex items-center justify-center ${
                            isActive
                              ? "bg-white/20"
                              : "bg-slate-100 text-blue-600"
                          }`}
                        >
                          {item.icon}
                        </div>
                        <span>{item.name}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`min-w-[18px] h-[18px] rounded-full text-[10px] flex items-center justify-center font-semibold ${
                            isActive
                              ? "bg-white text-blue-600"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          );
        })}
      </div>

      <div className="border-t border-slate-200 p-3">
        <button
          onClick={handleLogout}
          className="w-full h-10 rounded-lg flex items-center px-3 text-slate-700 font-medium hover:bg-slate-200 transition-all"
        >
          <i className="fa-solid fa-arrow-right-from-bracket text-[14px]"></i>

          <span className="ml-3 text-[13px]">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
