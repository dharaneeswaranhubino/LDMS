import { FaExclamation } from "react-icons/fa";
import type { TimelineStatus } from "../../shipmentTypes";
import {
  ORDERED_STATUSES,
  STATUS_META,
  formatDateTime,
  getRelativeTime,
} from "../../utils/shipmentHelpers";
import type { TimelineEntry } from "../../shipmentTypes";

interface TimeLineVerticalStepperProps {
  currentStatus: TimelineStatus;
  timeline: TimelineEntry[];
}

const TimeLineVerticalStepper = ({
  currentStatus,
  timeline,
}: TimeLineVerticalStepperProps) => {
  const isCancelled = currentStatus === "CANCELLED";
  const isDelayed = currentStatus === "DELAYED";

  const getDelayedFromStatus = (): TimelineStatus => {
    if (!timeline) return "IN_TRANSIT";

    const delayedEntry = [...timeline]
      .reverse()
      .find((e) => e.toStatus === "DELAYED" && e.fromStatus !== "DELAYED");

    return (delayedEntry?.fromStatus as TimelineStatus) ?? "IN_TRANSIT";
  };

  const delayedEntry = isDelayed
    ? [...timeline]
        .reverse()
        .find((e) => e.toStatus === "DELAYED" && e.fromStatus !== "DELAYED")
    : undefined;

  const displayStatus: TimelineStatus = isDelayed
    ? getDelayedFromStatus()
    : isCancelled
      ? "PENDING"
      : currentStatus;

  const curIdx = ORDERED_STATUSES.indexOf(displayStatus);

  const entryMap = new Map<TimelineStatus, TimelineEntry>();
  timeline.forEach((entry) => {
    entryMap.set(entry.toStatus as TimelineStatus, entry);
  });

  function getDotStyle(idx: number) {
    if (isCancelled && idx === curIdx) return "cancelled";
    if (isDelayed && idx === curIdx) return "delayed";
    if (idx < curIdx) return "done";
    if (idx === curIdx) return "current";
    return "pending";
  }

  return (
    <div className="px-4 py-4 overflow-y-auto h-[100%]">
      {ORDERED_STATUSES.map((status, idx) => {
        const dotStyle = getDotStyle(idx);
        const isLast = idx === ORDERED_STATUSES.length - 1;
        // const entry = entryMap.get(status);
        const entry =
          isDelayed && idx === curIdx ? delayedEntry : entryMap.get(status);
        const isCurrent = idx === curIdx;
        const label = STATUS_META[status]?.label ?? status;

        return (
          <div key={status} className="flex gap-3">
            <div className="flex flex-col items-center w-5 flex-shrink-0">
              <div
                className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 transition-all duration-300
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
              >
                {dotStyle === "done" && (
                  <svg width="8" height="8" viewBox="0 0 10 10">
                    <polyline
                      points="1,5 4,8 9,2"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
                {dotStyle === "current" && (
                  <span className="w-[7px] h-[7px] rounded-full bg-blue-500 block" />
                )}
                {dotStyle === "cancelled" && (
                  <i
                    className="fa-solid fa-x text-white"
                    style={{ fontSize: "8px" }}
                  />
                )}
                {dotStyle === "delayed" && (
                  <>
                    <FaExclamation size={9} className="text-white" />
                  </>
                )}
              </div>

              {!isLast && (
                <div
                  className={`w-[2px] flex-1 my-0.5 min-h-[22px] rounded-full
                    ${dotStyle === "done" ? "bg-blue-400" : "bg-gray-200"}`}
                />
              )}
            </div>

            <div className={`flex-1 min-w-0 ${!isLast ? "pb-4" : "pb-1"}`}>
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-xs font-medium transition-colors duration-300
                    ${
                      dotStyle === "done"
                        ? "text-blue-600"
                        : dotStyle === "current"
                          ? "text-blue-700 font-semibold"
                          : dotStyle === "cancelled"
                            ? "text-red-500 font-semibold"
                            : dotStyle === "delayed"
                              ? "text-amber-600 font-semibold"
                              : "text-gray-300"
                    }`}
                >
                  {label}
                </span>

                {entry?.updatedAt && (
                  <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
                    {formatDateTime(entry.updatedAt)}
                  </span>
                )}
              </div>

              {isCurrent && entry?.updatedAt && (
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Updated {getRelativeTime(entry.updatedAt)}
                </p>
              )}

              {entry?.remarks && (
                <div className="mt-1.5 px-2.5 py-1 bg-gray-50 border-l-2 border-blue-200 text-[10px] text-gray-500 leading-relaxed rounded-r">
                  {entry.remarks}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TimeLineVerticalStepper;
