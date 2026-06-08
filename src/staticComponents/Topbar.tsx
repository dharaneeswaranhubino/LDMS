import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import { useAppDispatch, useAppSelector } from "../shared/hooks/reduxHooks";
import {
  fetchNotifications,
  markSingleNotificationRead,
} from "../features/customerShipment/shipmentSlice";
import {
  typeConfig,
  formatNotificationTime,
} from "../features/customerShipment/utils/shipmentHelpers";

const Topbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { unreadCount, notifications, markSingleLoading } = useAppSelector(
    (state) => state.shipment,
  );

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isCustomer = user?.role === "customer";

  const roleDashboardMap: Record<string, string> = {
    admin: "/adminDashboard",
    customer: "/customerDashboard",
    deliveryAgent: "/agentDashboard",
  };
  const dashboardRoute = roleDashboardMap[user?.role as string] || "/";

  // fetch on mount — customer only
  useEffect(() => {
    if (isCustomer) {
      dispatch(fetchNotifications({ page: 1, limit: 5 }));
    }
  }, [dispatch, isCustomer]);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMarkRead = (notificationId: number, isRead: boolean) => {
    if (!isRead) dispatch(markSingleNotificationRead(notificationId));
  };

  const handleSeeAll = () => {
    setIsOpen(false);
    navigate("/customerNotifications");
  };

  const top5 = notifications.slice(0, 5);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-18 px-6 flex items-center justify-between border-b border-white/20 bg-gradient-to-r from-slate-50 via-blue-50 to-cyan-50 backdrop-blur-xl shadow-lg">
      {/* ── Logo ── */}
      <div className="flex items-center gap-10">
        <Link to={dashboardRoute} className="flex items-center gap-4 group">
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-200 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
            <i className="fa-solid fa-truck-fast text-white text-[18px] relative z-10" />
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
        {isCustomer && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="text-2xl flex cursor-pointer"
            >
              <i
                className={`fa-${unreadCount > 0 ? "solid" : "regular"} fa-bell text-red-900`}
              />
              {unreadCount > 0 && (
                <span className="absolute ml-4 flex items-center justify-center h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400"></span>
                  <span
                    className={`min-w-3.5 h-3.5 rounded-full text-[10px] flex items-center justify-center font-semibold bg-red-500 text-white`}
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                </span>
              )}
            </button>

            {/* Dropdown */}
            {isOpen && (
              <div className="absolute right-[-3rem] lg:right-0 top-12 w-88 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">
                      Notifications
                    </span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <i className="fa-solid fa-xmark text-xs text-slate-400" />
                  </button>
                </div>

                {/* List */}
                <div className="max-h-[350px] overflow-y-auto scrollbar-none">
                  {unreadCount > 0 ? (
                    top5.map((n) => {
                      const config = typeConfig[n.type] ?? {
                        icon: "fa-bell",
                        bgColor: "bg-slate-100",
                        textColor: "text-slate-500",
                      };
                      const isMarkingThis =
                        markSingleLoading === n.notificationId;

                      return (
                        <div
                          key={n.notificationId}
                          onClick={() =>
                            handleMarkRead(n.notificationId, n.isRead)
                          }
                          className={`flex gap-3 px-4 py-3 border-b border-slate-50 transition-all duration-150
                            ${
                              n.isRead
                                ? "bg-white cursor-default"
                                : isMarkingThis
                                  ? "bg-blue-50/40 cursor-wait opacity-60"
                                  : "bg-blue-50/50 hover:bg-blue-50 cursor-pointer"
                            }`}
                        >
                          {/* unread dot */}
                          <div className="flex-shrink-0 pt-1.5">
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${n.isRead ? "bg-transparent" : "bg-blue-500"}`}
                            />
                          </div>

                          {/* icon */}
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bgColor}`}
                          >
                            {isMarkingThis ? (
                              <i className="fa-solid fa-spinner fa-spin text-blue-400 text-xs" />
                            ) : (
                              <i
                                className={`fa-solid ${config.icon} ${config.textColor} text-xs`}
                              />
                            )}
                          </div>

                          {/* content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1 mb-0.5">
                              <span
                                className={`text-xs font-semibold ${n.isRead ? "text-slate-500" : "text-slate-800"}`}
                              >
                                {n.title}
                              </span>
                              <span className="text-[10px] text-green-600 flex-shrink-0 bg-green-100 px-1 rounded-sm">
                                {n.isRead && "readed"}
                              </span>
                              <span className="text-[10px] text-slate-400 flex-shrink-0">
                                {formatNotificationTime(n.createdAt)}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                              {n.message}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-10">
                      <i className="fa-regular fa-bell-slash text-2xl text-slate-300 mb-2 block" />
                      <p className="text-sm text-slate-400">
                        No notifications yet
                      </p>
                    </div>
                  )}
                </div>

                {/* See all */}
                <button
                  onClick={handleSeeAll}
                  className="w-full py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors border-t border-slate-100 flex items-center justify-center gap-2"
                >
                  See all notifications
                  <i className="fa-solid fa-arrow-right text-xs" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Profile */}
        <div className="ring-2 ring-blue-100 rounded-full">
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
