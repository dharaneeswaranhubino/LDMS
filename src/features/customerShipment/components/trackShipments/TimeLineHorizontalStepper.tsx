import type { TimelineStatus } from "../../shipmentTypes";
import { getProgressPercent, ORDERED_STATUSES, STATUS_META } from "../../utils/shipmentHelpers";
import { FaExclamation } from "react-icons/fa6";

const TimeLineHorizontalStepper = ({currentStatus}: {currentStatus: TimelineStatus;}) => {
  const isCancelled = currentStatus === "CANCELLED";
  const isDelayed = currentStatus === "DELAYED";
  const curIdx = ORDERED_STATUSES.indexOf(currentStatus);
  const pct = getProgressPercent(currentStatus);

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
    <>
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
                          <i className="fa-solid fa-check text-[9px]" />
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
                          {/* <i className="fa-solid fa-x text-[9px]"></i> */}
                          <i className="fa-solid fa-x text-[9px]"></i>
                        </span>
                      )}
                      {dotStyle === "delayed" && (
                        <span
                          className="text-white font-bold"
                          style={{ fontSize: "8px" }}
                        >
                          <FaExclamation size={12} />
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
    </>
  );
};

export default TimeLineHorizontalStepper;
