import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../shared/hooks/reduxHooks";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markSingleNotificationRead,
} from "../shipmentSlice";
import type { FilterType} from "../shipmentTypes";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";
import { filterOptions } from "../utils/shipmentHelpers";
import NotificationCard from "../components/notificationComponents/NotificationCard";
import { showToast } from "../../../shared/components/Toast";

const CustomerNotifications = () => {
  const dispatch = useAppDispatch();
  const {
    notifications,
    unreadCount,
    notificationPagination,
    notificationLoading,
    markAllLoading,
    markSingleLoading,
  } = useAppSelector((state) => state.shipment);

  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    dispatch(fetchNotifications({ page: currentPage, limit }));
  }, [dispatch, currentPage]);

  const handleMarkSingleRead = (id: number) => {    
    dispatch(markSingleNotificationRead(id));
    // showToast({
    //   type:"success",
    //   message:"Updated as readed"
    // })
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsRead());
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "UNREAD") return !n.isRead;
    return n.type === activeFilter;
  });

  const totalPages = notificationPagination?.totalPages ?? 1;
  const total = notificationPagination?.total ?? 0;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-50 via-sky-200 to-purple-50 p-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {total} total
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                  <span className="text-blue-600 font-medium">{unreadCount} unread</span>
                </span>
              )}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={markAllLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {markAllLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin text-xs" />
                  Marking...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check-double text-xs text-blue-500" />
                  Mark all as read
                </>
              )}
            </button>
          )}
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setActiveFilter(opt.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200
                ${activeFilter === opt.value
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700"
                }`}
            >
              {opt.label}
              {opt.value === "UNREAD" && unreadCount > 0 && (
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold
                  ${activeFilter === "UNREAD" ? "bg-white text-blue-600" : "bg-blue-100 text-blue-600"}`}>
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {notificationLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <i className="fa-regular fa-bell-slash text-2xl text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">No notifications found</p>
            <p className="text-slate-400 text-sm mt-1">
              {activeFilter !== "ALL" ? "Try switching to 'All' filter" : "You're all caught up!"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.notificationId}
                notification={notification}
                onMarkRead={handleMarkSingleRead}
                isMarkingRead={markSingleLoading === notification.notificationId}
              />
            ))}
          </div>
        )}

        {!notificationLoading && totalPages > 1 && activeFilter === "ALL" && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <i className="fa-solid fa-chevron-left text-xs" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-9 h-9 rounded-xl border text-sm font-semibold transition-all duration-200
                  ${currentPage === page
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <i className="fa-solid fa-chevron-right text-xs" />
            </button>
          </div>
        )}

        {!notificationLoading && totalPages > 1 && activeFilter === "ALL" && (
          <p className="text-center text-xs text-slate-400 mt-3">
            Page {currentPage} of {totalPages} · {total} total notifications
          </p>
        )}
      {/* <div className="max-w-3xl mx-auto">


      </div> */}
    </div>
  );
};

export default CustomerNotifications;