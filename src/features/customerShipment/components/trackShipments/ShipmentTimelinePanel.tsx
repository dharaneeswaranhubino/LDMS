import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../../app/store";
import { fetchShipmentTimeline } from "../../shipmentSlice";
import type { ShipmentResponse } from "../../shipmentTypes";
import { GiMailbox } from "react-icons/gi";
import type { TimelineStatus, TimelineEntry } from "../../shipmentTypes";
import {
  formatDateTime,
  getInitials,
  getProgressPercent,
  ORDERED_STATUSES,
  ROLE_BADGE,
  STATUS_ICONS,
  STATUS_META,
} from "../../utils/shipmentHelpers";

function StatusBadge({ status }: { status: TimelineStatus }) {
  const meta = STATUS_META[status];
  const isLive =
    status === "IN_TRANSIT" ||
    status === "OUT_FOR_DELIVERY" ||
    status === "OUT_FOR_PICKUP";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${meta.bgColor} ${meta.textColor}`}
    >
      {isLive && (
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
      )}
      {meta.label}
    </span>
  );
}

function HorizontalStepper({
  currentStatus,
}: {
  currentStatus: TimelineStatus;
}) {
  const isCancelled = currentStatus === "CANCELLED";
  const isDelayed = currentStatus === "DELAYED";
  const curIdx = ORDERED_STATUSES.indexOf(currentStatus);
  const pct = getProgressPercent(currentStatus);

  // dot color logic
  function getDotStyle(status: TimelineStatus, idx: number) {
    const isDone = idx < curIdx;
    const isCurrent = idx === curIdx;

    if (isCancelled && isCurrent) return "cancelled";
    if (isDelayed && isCurrent) return "delayed";
    if (isDone) return "done";
    if (isCurrent) return "current";
    return "pending";
  }

  return (
    <div className="px-4 pt-3 pb-4 border-b border-gray-100 flex-shrink-0">
      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
        <span className="font-medium text-gray-500">Shipment Progress</span>
        <span className="font-semibold text-blue-500">{pct}%</span>
      </div>

      <div className="hidden md:block relative">
        <div className="absolute top-[10px] left-[10px] right-[10px] h-[2px] bg-gray-200 rounded-full" />

        <div
          className="absolute top-[10px] left-[10px] h-[2px] rounded-full transition-all duration-700"
          style={{
            width: `calc(${pct}% - ${pct === 100 ? 10 : 0}px)`,
            background:
              "linear-gradient(90deg, #38bdf8 0%, #818cf8 50%, #34d399 100%)",
            boxShadow: "0 0 6px 1px rgba(56,189,248,0.5)",
          }}
        />

        <div className="relative flex items-start justify-between">
          {ORDERED_STATUSES.map((status, idx) => {
            const dotStyle = getDotStyle(status, idx);
            const isCurrent = idx === curIdx;

            return (
              <div
                key={status}
                className="flex flex-col items-center"
                style={{ width: `${100 / ORDERED_STATUSES.length}%` }}
              >
                <div className="relative flex items-center justify-center w-5 h-5 mb-1.5">
                  {isCurrent &&
                    dotStyle !== "cancelled" &&
                    dotStyle !== "delayed" && (
                      <>
                        <span
                          className="absolute rounded-full"
                          style={{
                            width: "28px",
                            height: "28px",
                            border: "2px solid rgba(99,179,237,0.6)",
                            animation: "sonar 1.8s ease-out infinite",
                          }}
                        />
                        <span
                          className="absolute rounded-full"
                          style={{
                            width: "28px",
                            height: "28px",
                            border: "2px solid rgba(99,179,237,0.4)",
                            animation: "sonar 1.8s ease-out infinite 0.6s",
                          }}
                        />
                      </>
                    )}

                  {isCurrent && dotStyle === "cancelled" && (
                    <>
                      <span
                        className="absolute rounded-full"
                        style={{
                          width: "28px",
                          height: "28px",
                          border: "2px solid rgba(252,165,165,0.7)",
                          animation: "sonar 1.8s ease-out infinite",
                        }}
                      />
                    </>
                  )}

                  {isCurrent && dotStyle === "delayed" && (
                    <>
                      <span
                        className="absolute rounded-full"
                        style={{
                          width: "28px",
                          height: "28px",
                          border: "2px solid rgba(251,191,36,0.7)",
                          animation: "sonar 1.8s ease-out infinite",
                        }}
                      />
                    </>
                  )}

                  <div
                    className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center z-10 transition-all duration-300
                      ${
                        dotStyle === "done"
                          ? "bg-blue-500 border-blue-500"
                          : dotStyle === "current"
                            ? "bg-white border-blue-400"
                            : dotStyle === "cancelled"
                              ? "bg-red-400 border-red-400"
                              : dotStyle === "delayed"
                                ? "bg-amber-400 border-amber-400"
                                : "bg-white border-gray-200"
                      }`}
                    style={
                      dotStyle === "done" || dotStyle === "current"
                        ? { boxShadow: "0 0 0 2px rgba(56,189,248,0.15)" }
                        : dotStyle === "cancelled"
                          ? { boxShadow: "0 0 0 2px rgba(252,165,165,0.2)" }
                          : {}
                    }
                  >
                    {dotStyle === "done" && (
                      <span
                        className="text-white font-bold"
                        style={{ fontSize: "8px" }}
                      >
                        ✓
                      </span>
                    )}
                    {dotStyle === "current" && (
                      <span
                        className="rounded-full bg-blue-500 block"
                        style={{ width: "7px", height: "7px" }}
                      />
                    )}
                    {dotStyle === "cancelled" && (
                      <span
                        className="text-white font-bold"
                        style={{ fontSize: "8px" }}
                      >
                        ✕
                      </span>
                    )}
                    {dotStyle === "delayed" && (
                      <span
                        className="text-white font-bold"
                        style={{ fontSize: "8px" }}
                      >
                        !
                      </span>
                    )}
                  </div>
                </div>

                <span
                  className={`text-center leading-tight transition-colors duration-300
                    ${
                      dotStyle === "done"
                        ? "text-blue-500 font-medium"
                        : dotStyle === "current"
                          ? "text-blue-600 font-semibold"
                          : dotStyle === "cancelled"
                            ? "text-red-500 font-semibold"
                            : dotStyle === "delayed"
                              ? "text-amber-600 font-semibold"
                              : "text-gray-300"
                    }`}
                  style={{
                    fontSize: "8px",
                    maxWidth: "52px",
                    wordBreak: "break-word",
                  }}
                >
                  {STATUS_META[status]?.label ?? status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="md:hidden">
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg, #38bdf8, #818cf8)",
              boxShadow: "0 0 6px rgba(56,189,248,0.5)",
            }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          Current:{" "}
          <span className="text-blue-500 font-medium">
            {STATUS_META[currentStatus]?.label ?? currentStatus}
          </span>
        </p>
      </div>
    </div>
  );
}

function TimelineCard({
  entry,
  isLast,
  isFirst,
}: {
  entry: TimelineEntry;
  isLast: boolean;
  isFirst: boolean;
}) {
  const meta = STATUS_META[entry.toStatus] ?? STATUS_META["PENDING"];
  const av = ROLE_BADGE[entry.updatedBy.role] ?? ROLE_BADGE["admin"];

  return (
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
            {/* {STATUS_ICONS[entry.toStatus] ?? "●"} */}
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
              <StatusBadge status={entry.toStatus} />
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
  );
}

function TimelineSkeleton() {
  return (
    <div className="p-4 space-y-4 animate-pulse">
      <div className="h-5 w-48 bg-gray-100 rounded" />
      <div className="h-3 w-32 bg-gray-100 rounded" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3 pt-2">
          <div className="w-7 h-7 rounded-full bg-gray-100 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-16 bg-gray-100 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface ShipmentTimelinePanelProps {
  shipment: ShipmentResponse;
}

export default function ShipmentTimelinePanel({
  shipment,
}: ShipmentTimelinePanelProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { timelineData, timelineLoading, timelineError } = useSelector(
    (state: RootState) => state.shipment,
  );

  useEffect(() => {
    dispatch(fetchShipmentTimeline(shipment.shipmentId));
  }, [dispatch, shipment.shipmentId]);

  const currentStatus = (timelineData?.currentStatus ??
    shipment.shipmentStatus) as TimelineStatus;
  const reversedTimeline = timelineData
    ? [...timelineData.timeline].reverse()
    : [];

  return (
    <>
      <style>{`
        @keyframes sonar {
          0%   { transform: scale(0.8); opacity: 0.8; }
          70%  { transform: scale(1.6); opacity: 0;   }
          100% { transform: scale(1.6); opacity: 0;   }
        }
      `}</style>

      <div className="rounded-r-2xl flex flex-col h-full overflow-hidden">
        <div className="px-4 py-3.5 border-b border-gray-100 bg-white flex-shrink-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <p className="text-sm font-medium text-gray-800">
                {shipment.trackingId}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Shipment #{shipment.shipmentId} &nbsp;·&nbsp;
                {shipment.pickupCity} → {shipment.deliveryCity}
                {shipment.assignedAgent &&
                  ` · ${shipment.assignedAgent.agentName}`}
              </p>
            </div>
            <StatusBadge status={currentStatus} />
          </div>
        </div>

        <HorizontalStepper currentStatus={currentStatus} />

        {timelineLoading ? (
          <TimelineSkeleton />
        ) : timelineError ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 p-6 text-center">
            <span className="text-2xl">⚠️</span>
            <p className="text-sm font-medium text-gray-600">
              Failed to load timeline
            </p>
            <p className="text-xs text-gray-400">{timelineError}</p>
            <button
              onClick={() =>
                dispatch(fetchShipmentTimeline(shipment.shipmentId))
              }
              className="mt-2 text-xs text-blue-600 underline"
            >
              Try again
            </button>
          </div>
        ) : !timelineData || reversedTimeline.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 p-6 text-center">
            <span className="text-gray-400"><GiMailbox size={46}/></span>
            <p className="text-sm font-medium text-gray-600">
              No timeline entries yet
            </p>
            <p className="text-xs text-gray-400">
              Status updates will appear here
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
              Status history · {reversedTimeline.length} events
            </p>
            <div>
              {reversedTimeline.map((entry, idx) => (
                <TimelineCard
                  key={entry.id}
                  entry={entry}
                  isFirst={idx === 0}
                  isLast={idx === reversedTimeline.length - 1}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
