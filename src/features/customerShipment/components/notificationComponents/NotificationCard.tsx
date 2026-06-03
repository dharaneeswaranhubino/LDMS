import type { NotificationCardProps } from "../../shipmentTypes";
import {
  formatNotificationTime,
  typeConfig,
} from "../../utils/shipmentHelpers";

const NotificationCard = ({
  notification,
  onMarkRead,
  isMarkingRead,
}: NotificationCardProps) => {
  const config = typeConfig[notification.type] ?? {
    icon: "fa-bell",
    bgColor: "bg-slate-100",
    textColor: "text-slate-600",
    label: notification.type,
  };

  return (
    <div
      onClick={() =>
        !notification.isRead &&
        !isMarkingRead &&
        onMarkRead(notification.notificationId)
      }
      className={`flex gap-4 p-4 rounded-2xl border transition-all duration-200 group
        ${
          notification.isRead
            ? "bg-white border-slate-100 hover:border-slate-200 cursor-default"
            : isMarkingRead
              ? "bg-blue-50/40 border-blue-100 cursor-wait opacity-70"
              : "bg-blue-50/60 border-blue-100 hover:border-blue-200 hover:bg-blue-50 cursor-pointer"
        }`}
    >
      {/* unread dot */}
      <div className="flex items-start pt-1">
        <div
          className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 transition-all duration-300
          ${notification.isRead ? "bg-transparent" : "bg-blue-500"}`}
        />
      </div>

      {/* icon */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bgColor}`}
      >
        {isMarkingRead ? (
          <i className="fa-solid fa-spinner fa-spin text-blue-400 text-sm" />
        ) : (
          <i
            className={`fa-solid ${config.icon} ${config.textColor} text-sm`}
          />
        )}
      </div>

      {/* content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-slate-800">
              {notification.title}
            </span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${config.bgColor} ${config.textColor}`}
            >
              {config.label}
            </span>
          </div>
          <div>
            {notification.isRead && (
              <span className="text-xs text-green-600 flex-shrink-0 bg-green-200 px-2 py-1 rounded-lg mr-3">
                readed
              </span>
            )}
            <span className="text-xs text-slate-400 flex-shrink-0">
              {formatNotificationTime(notification.createdAt)}
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-500 leading-relaxed mb-2">
          {notification.message}
        </p>

        <span className="inline-block text-xs font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
          {notification.trackingId}
        </span>
      </div>

      {/* mark read hint — only show on unread, not while loading */}
      {!notification.isRead && !isMarkingRead && (
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-[10px] text-blue-400 font-medium whitespace-nowrap">
            Mark read
          </span>
        </div>
      )}
    </div>
  );
};

export default NotificationCard;
