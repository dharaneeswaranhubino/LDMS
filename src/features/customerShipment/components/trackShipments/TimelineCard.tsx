import type { TimelineEntry } from "../../shipmentTypes";
import { formatDateTime, getInitials, ROLE_BADGE, STATUS_ICONS, STATUS_META } from "../../utils/shipmentHelpers";
import TimeLineStatusBadge from "./TimeLineStatusBadge";

const TimelineCard = ({
  entry,
  isLast,
  isFirst,
}: {
  entry: TimelineEntry;
  isLast: boolean;
  isFirst: boolean;
}) => {
  const meta = STATUS_META[entry.toStatus] ?? STATUS_META["PENDING"];
  const av = ROLE_BADGE[entry.updatedBy.role] ?? ROLE_BADGE["admin"];
  return (
    <>
      <div className="flex gap-0">
        <div className="flex flex-col items-center w-8 flex-shrink-0">
          <div className="relative flex items-center justify-center w-8 h-8 flex-shrink-0">
            {isFirst && (
              <>
                <span
                  className="absolute rounded-full"
                  style={{
                    width: "32px",
                    height: "32px",
                    border: "2px solid rgba(99,179,237,0.55)",
                    animation: "sonar 1.8s ease-out infinite",
                  }}
                />
                <span
                  className="absolute rounded-full"
                  style={{
                    width: "32px",
                    height: "32px",
                    border: "2px solid rgba(99,179,237,0.3)",
                    animation: "sonar 1.8s ease-out infinite 0.7s",
                  }}
                />
              </>
            )}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm z-10 ${meta.iconBg} ${meta.iconColor}`}
            >
              {(() => {
                const Icon = STATUS_ICONS[entry.toStatus];
                return Icon ? <Icon size={14} /> : <span>●</span>;
              })()}
            </div>
          </div>

          {!isLast && (
            <div
              className="w-[2px] flex-1 my-1 rounded-full"
              style={{
                background:
                  "linear-gradient(180deg, rgba(56,189,248,0.7) 0%, rgba(129,140,248,0.4) 60%, rgba(209,213,219,0.3) 100%)",
                boxShadow: "0 0 4px rgba(56,189,248,0.25)",
                minHeight: "20px",
              }}
            />
          )}
        </div>

        <div className="flex-1 pb-4 pl-3">
          <div className="bg-white border border-gray-100 rounded-lg p-3 hover:border-gray-200 transition-colors">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                {entry.fromStatus && (
                  <>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                      {STATUS_META[entry.fromStatus]?.label ?? entry.fromStatus}
                    </span>
                    <span className="text-gray-300 text-xs">→</span>
                  </>
                )}
                <TimeLineStatusBadge status={entry.toStatus} />
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                {formatDateTime(entry.updatedAt)}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${av}`}
              >
                {getInitials(entry.updatedBy.name)}
              </div>
              <span className="text-xs text-gray-500">
                {entry.updatedBy.name}
              </span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${av}`}>
                {entry.updatedBy.role}
              </span>
            </div>

            {entry.remarks && (
              <div className="mt-2 px-2.5 py-1.5 bg-gray-50 border-l-2 border-gray-300 text-xs text-gray-500 leading-relaxed">
                {entry.remarks}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TimelineCard;
