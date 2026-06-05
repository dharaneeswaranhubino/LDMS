import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../../app/store";
import { fetchShipmentTimeline } from "../../shipmentSlice";
import type { ShipmentResponse } from "../../shipmentTypes";
import type { TimelineStatus, TimelineEntry } from "../../shipmentTypes";

// ─── Status config ────────────────────────────────────────────────────────

const ORDERED_STATUSES: TimelineStatus[] = [
  "PENDING",
  "CONFIRMED",
  "ASSIGNED",
  "OUT_FOR_PICKUP",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "COMPLETED",
];

const STATUS_META: Record<
  TimelineStatus,
  { label: string; bgColor: string; textColor: string; iconBg: string; iconColor: string }
> = {
  PENDING:          { label: "Pending",          bgColor: "bg-amber-50",   textColor: "text-amber-800",  iconBg: "bg-amber-50",   iconColor: "text-amber-700" },
  CONFIRMED:        { label: "Confirmed",        bgColor: "bg-teal-50",    textColor: "text-teal-800",   iconBg: "bg-teal-50",    iconColor: "text-teal-700"  },
  ASSIGNED:         { label: "Assigned",         bgColor: "bg-purple-50",  textColor: "text-purple-800", iconBg: "bg-purple-50",  iconColor: "text-purple-700"},
  OUT_FOR_PICKUP:   { label: "Out for pickup",   bgColor: "bg-purple-50",  textColor: "text-purple-800", iconBg: "bg-purple-50",  iconColor: "text-purple-700"},
  PICKED_UP:        { label: "Picked up",        bgColor: "bg-teal-50",    textColor: "text-teal-800",   iconBg: "bg-teal-50",    iconColor: "text-teal-700"  },
  IN_TRANSIT:       { label: "In transit",       bgColor: "bg-blue-50",    textColor: "text-blue-800",   iconBg: "bg-blue-50",    iconColor: "text-blue-700"  },
  OUT_FOR_DELIVERY: { label: "Out for delivery", bgColor: "bg-blue-50",    textColor: "text-blue-800",   iconBg: "bg-blue-50",    iconColor: "text-blue-700"  },
  DELIVERED:        { label: "Delivered",        bgColor: "bg-green-50",   textColor: "text-green-800",  iconBg: "bg-green-50",   iconColor: "text-green-700" },
  COMPLETED:        { label: "Completed",        bgColor: "bg-green-50",   textColor: "text-green-800",  iconBg: "bg-green-50",   iconColor: "text-green-700" },
  CANCELLED:        { label: "Cancelled",        bgColor: "bg-red-50",     textColor: "text-red-800",    iconBg: "bg-red-50",     iconColor: "text-red-700"   },
  DELAYED:          { label: "Delayed",          bgColor: "bg-amber-50",   textColor: "text-amber-800",  iconBg: "bg-amber-50",   iconColor: "text-amber-700" },
};

const ROLE_BADGE: Record<string, string> = {
  admin:    "bg-purple-50 text-purple-700",
  customer: "bg-teal-50 text-teal-700",
  agent:    "bg-blue-50 text-blue-700",
};

const STATUS_ICONS: Record<string, string> = {
  PENDING:          "🕐",
  CONFIRMED:        "✓",
  ASSIGNED:         "👤",
  OUT_FOR_PICKUP:   "📍",
  PICKED_UP:        "📦",
  IN_TRANSIT:       "🚚",
  OUT_FOR_DELIVERY: "🛵",
  DELIVERED:        "🏠",
  COMPLETED:        "✅",
  CANCELLED:        "✕",
  DELAYED:          "⚠",
};

// ─── Helpers ─────────────────────────────────────────────────────────────

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getProgressPercent(status: TimelineStatus): number {
  const idx = ORDERED_STATUSES.indexOf(status);
  if (idx < 0) return 0;
  return Math.round((idx / (ORDERED_STATUSES.length - 1)) * 100);
}

// ─── Sub-components ──────────────────────────────────────────────────────

function StatusBadge({ status }: { status: TimelineStatus }) {
  const meta = STATUS_META[status];
  const isLive = status === "IN_TRANSIT" || status === "OUT_FOR_DELIVERY";
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

function MiniStepTracker({ currentStatus }: { currentStatus: TimelineStatus }) {
  const curIdx = ORDERED_STATUSES.indexOf(currentStatus);
  const isCancelled = currentStatus === "CANCELLED";

  return (
    <div className="flex items-center overflow-hidden">
      {ORDERED_STATUSES.map((s, i) => {
        const done = i < curIdx;
        const current = s === currentStatus && !isCancelled;
        return (
          <div key={s} className="flex items-center flex-1 min-w-0">
            {i > 0 && (
              <div
                className={`flex-1 h-0.5 ${done || (current && i <= curIdx) ? "bg-blue-400" : "bg-gray-200"}`}
              />
            )}
            <div
              className={`w-3 h-3 rounded-full flex-shrink-0 flex items-center justify-center border
                ${done ? "bg-blue-500 border-blue-500" : current ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"}`}
            >
              {done && <span className="text-white" style={{ fontSize: "7px" }}>✓</span>}
              {current && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 block" />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TimelineCard({ entry, isLast }: { entry: TimelineEntry; isLast: boolean }) {
  const meta = STATUS_META[entry.toStatus] ?? STATUS_META["PENDING"];
  const av = ROLE_BADGE[entry.updatedBy.role] ?? ROLE_BADGE["admin"];

  return (
    <div className="flex gap-0">
      {/* Left — icon + line */}
      <div className="flex flex-col items-center w-8 flex-shrink-0">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm ${meta.iconBg} ${meta.iconColor} z-10`}>
          {STATUS_ICONS[entry.toStatus] ?? "●"}
        </div>
        {!isLast && <div className="w-px flex-1 bg-gray-200 my-1" />}
      </div>

      {/* Right — card */}
      <div className="flex-1 pb-4 pl-3">
        <div className="bg-white border border-gray-100 rounded-lg p-3 hover:border-gray-200 transition-colors">
          {/* Header row */}
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

          {/* Updated by */}
          <div className="flex items-center gap-1.5">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${av}`}>
              {getInitials(entry.updatedBy.name)}
            </div>
            <span className="text-xs text-gray-500">{entry.updatedBy.name}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${av}`}>
              {entry.updatedBy.role}
            </span>
          </div>

          {/* Remarks */}
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

// ─── Skeleton loader ─────────────────────────────────────────────────────

function TimelineSkeleton() {
  return (
    <div className="p-4 space-y-4 animate-pulse">
      <div className="h-5 w-48 bg-gray-100 rounded" />
      <div className="h-3 w-32 bg-gray-100 rounded" />
      <div className="h-2 bg-gray-100 rounded-full mt-3" />
      <div className="h-3 bg-gray-100 rounded-full mt-2" />
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

// ─── Main component ──────────────────────────────────────────────────────

interface ShipmentTimelinePanelProps {
  shipment: ShipmentResponse;
}

export default function ShipmentTimelinePanel({ shipment }: ShipmentTimelinePanelProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { timelineData, timelineLoading, timelineError } = useSelector(
    (state: RootState) => state.shipment
  );

  useEffect(() => {
    dispatch(fetchShipmentTimeline(shipment.shipmentId));
  }, [dispatch, shipment.shipmentId]);

  const currentStatus = (timelineData?.currentStatus ?? shipment.shipmentStatus) as TimelineStatus;
  const pct = getProgressPercent(currentStatus);
  const reversedTimeline = timelineData ? [...timelineData.timeline].reverse() : [];

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Header ── */}
      <div className="px-4 py-3.5 border-b border-gray-100 bg-white flex-shrink-0">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div>
            <p className="text-sm font-medium text-gray-800">{shipment.trackingId}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Shipment #{shipment.shipmentId} &nbsp;·&nbsp;
              {shipment.pickupCity} → {shipment.deliveryCity}
              {shipment.assignedAgent && ` · ${shipment.assignedAgent.agentName}`}
            </p>
          </div>
          <StatusBadge status={currentStatus} />
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
          <span>Progress</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden mb-2.5">
          <div
            className="h-full bg-blue-400 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Step tracker */}
        <MiniStepTracker currentStatus={currentStatus} />
      </div>

      {/* ── Body ── */}
      {timelineLoading ? (
        <TimelineSkeleton />
      ) : timelineError ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 p-6 text-center">
          <span className="text-2xl">⚠️</span>
          <p className="text-sm font-medium text-gray-600">Failed to load timeline</p>
          <p className="text-xs text-gray-400">{timelineError}</p>
          <button
            onClick={() => dispatch(fetchShipmentTimeline(shipment.shipmentId))}
            className="mt-2 text-xs text-blue-600 underline"
          >
            Try again
          </button>
        </div>
      ) : !timelineData || reversedTimeline.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 p-6 text-center">
          <span className="text-2xl">📭</span>
          <p className="text-sm font-medium text-gray-600">No timeline entries yet</p>
          <p className="text-xs text-gray-400">Status updates will appear here</p>
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
                isLast={idx === reversedTimeline.length - 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}