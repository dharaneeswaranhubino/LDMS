import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../shared/hooks/reduxHooks";
import useRole from "../shared/hooks/useRole";
import { logoutUser } from "../features/auth/authSlice";
import { TbListDetails, TbTruckDelivery } from "react-icons/tb";
import { BiSolidDashboard } from "react-icons/bi";
import { FaCubesStacked } from "react-icons/fa6";
import { fetchMyShipments } from "../features/shipment/shipmentSlice";

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
    "bg-gradient-to-br from-cyan-50 via-indigo-200 to-sky-50 text-indigo-600",
  customer: "bg-blue-500 text-white",
};

const getMenu = (shipmentCount: number): MenuItem[] => [
  // admin
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
  // delivery agent
  {
    name: "Agent Dashboard",
    path: "/agentDashboard",
    section: "MAIN",
    allowedRole: "deliveryAgent",
    icon: <BiSolidDashboard size={18} />,
  },
  {
    name: "Delivery Details",
    path: "/deliveryDetail",
    section: "MAIN",
    allowedRole: "deliveryAgent",
    icon: <TbTruckDelivery size={18} />,
  },
  {
    name: "Delivery History",
    path: "/deliveryHistory",
    section: "MAIN",
    allowedRole: "deliveryAgent",
    icon: <TbListDetails size={18} />,
  },
  {
    name: "Chat to Customer",
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
  // customer
  {
    name: "Customer Dashboard",
    path: "/customerDashboard",
    section: "MAIN",
    allowedRole: "customer",
    icon: <BiSolidDashboard size={18} />,
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
    icon: <FaCubesStacked size={18} />,
    badge: shipmentCount,
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
  const { user } = useAppSelector((state) => state.auth);

  const shipmentCount = useAppSelector(
    (state) => state.shipment.shipments.length,
  );

  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  const menu = getMenu(shipmentCount);
  const filteredMenu = menu.filter((item) => hasRole(item.allowedRole));

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();

  useEffect(() => {
    close();
  }, [location.pathname]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (user?.role === "customer") {
      dispatch(fetchMyShipments({ page: 1, limit: 100 }));
    }
  }, [dispatch, user?.role]);

  const getFirstLetterCapital = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <>
      <div
        onClick={close}
        className={`fixed inset-0 bg-black/30 z-30 lg:hidden transition-opacity duration-500 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      <button
        onClick={toggle}
        className={`
        lg:hidden fixed z-50
        top-1/2 -translate-y-1/2
        transition-all duration-500 ease-in-out will-change-transform
        ${isOpen ? "left-[256px]" : "left-0"}
        w-6 h-14
        bg-white border border-slate-200
        rounded-r-xl shadow-md
        flex items-center justify-center
        text-slate-500 hover:text-blue-600
        hover:bg-blue-50
      `}
        aria-label="Toggle sidebar"
      >
        <i
          className={`fa-solid fa-angle-right text-[13px] transition-transform duration-500 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      <aside
        style={{
          left: isOpen ? "0px" : "-256px",
          transition: "left 380ms ease-in-out",
        }}
        className={`
        fixed top-[72px] w-64
        h-[calc(100vh-72px)]
        bg-white border-r border-slate-200
        flex flex-col justify-between
        overflow-y-auto scrollbar-none z-40
        lg:!left-0
      `}
      >
        <div className="px-3 py-4">
          <div className="text-xl font-bold flex justify-center items-center my-4 whitespace-nowrap">
            {`${getFirstLetterCapital(user?.role)} Panel`}
          </div>

          {sections.map((section) => {
            const sectionItems = filteredMenu.filter(
              (item) => item.section === section,
            );
            if (sectionItems.length === 0) return null;

            return (
              <div key={section} className="mb-5">
                <p className="text-[11px] text-slate-400 font-semibold uppercase mb-2 px-2">
                  {section}
                </p>
                <nav className="space-y-1">
                  {sectionItems.map((item) => {
                    const isActive =
                      item.path === "/payments"
                        ? location.pathname.startsWith("/payments")
                        : location.pathname === item.path;

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
    </>
  );
};

export default Sidebar;
