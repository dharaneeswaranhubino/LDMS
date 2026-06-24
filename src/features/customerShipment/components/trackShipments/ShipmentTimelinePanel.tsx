import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../../app/store";
import { fetchShipmentTimeline } from "../../shipmentSlice";
import type {
  ShipmentResponse,
  ShipmentTimelinePanelProps,
  TimelineStatus,
} from "../../shipmentTypes";
import { GiMailbox } from "react-icons/gi";
import TimeLineStatusBadge from "./TimeLineStatusBadge";
import TimeLineHorizontalStepper from "./TimeLineHorizontalStepper";
import TimelineCard from "./TimelineCard";
import TimeLineVerticalStepper from "./TimeLineVerticalStepper";
import { useAppSelector } from "../../../../shared/hooks/reduxHooks";

const ShipmentTimelinePanel = ({ shipment }: ShipmentTimelinePanelProps) => {
  const { user } = useAppSelector((state) => state.auth);

  const dispatch = useDispatch<AppDispatch>();
  const { timelineData, timelineLoading, timelineError } = useSelector(
    (state: RootState) => state.shipment,
  );

  useEffect(() => {
    dispatch(fetchShipmentTimeline(shipment.shipmentId));
  }, [dispatch, shipment.shipmentId]);

  const currentStatus = (timelineData?.currentStatus ??
    shipment.shipmentStatus) as TimelineStatus;

  // const getDisplayStatus = (): TimelineStatus => {
  //   if (currentStatus !== "DELAYED") return currentStatus;

  //   const delayedEntry = timelineData?.timeline
  //     .slice()
  //     .reverse()
  //     .find((e) => e.toStatus === "DELAYED");

  //   if (delayedEntry?.fromStatus) {
  //     return delayedEntry.fromStatus as TimelineStatus;
  //   }
  //   return "IN_TRANSIT";
  // };

  // const displayStatus = getDisplayStatus();

  const isCancelledWithRefund =
    currentStatus === "CANCELLED" &&
    "paymentStatus" in shipment &&
    (shipment as ShipmentResponse).paymentStatus === "REFUNDED";

  const reversedTimeline = timelineData
    ? [...timelineData.timeline].reverse()
    : [];

  // const agentName = shipment.assignedAgent
  //   ? "agentName" in shipment.assignedAgent
  //     ? shipment.assignedAgent.agentName
  //     : shipment.assignedAgent.name
  //   : "Awaiting agent";

  const hasAssignedAgent = "assignedAgent" in shipment;

  const agentName = hasAssignedAgent
    ? shipment.assignedAgent
      ? "agentName" in shipment.assignedAgent
        ? shipment.assignedAgent.agentName
        : shipment.assignedAgent.name
      : "Awaiting agent"
    : null;
  return (
    <>
      <style>{`
        @keyframes sonar {
          0%   { transform: scale(0.8); opacity: 0.8; }
          70%  { transform: scale(1.6); opacity: 0;   }
          100% { transform: scale(1.6); opacity: 0;   }
        }
      `}</style>

      <div className="flex flex-col h-full overflow-hidden">
        <div className="px-4 py-3.5 border-b border-gray-100 bg-white flex-shrink-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <p className="text-sm font-medium text-gray-800">
                {shipment.trackingId}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Shipment #{shipment.shipmentId} &nbsp;·&nbsp;
                {shipment.pickupCity} → {shipment.deliveryCity}
                {/* {shipment.assignedAgent &&
                  ` · ${shipment.assignedAgent.agentName}`} */}
                {user?.role !== "deliveryAgent" && ` · ${agentName}`}
              </p>
            </div>
            <TimeLineStatusBadge status={currentStatus} />
          </div>
        </div>

        <TimeLineHorizontalStepper
          currentStatus={currentStatus}
          timeline={timelineData?.timeline}
        />

        <div className="md:hidden flex-1 overflow-y-auto">
          {timelineLoading ? (
            <div className="p-4 space-y-5 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className="w-[18px] h-[18px] rounded-full bg-gray-100 flex-shrink-0" />
                  <div className="flex-1 h-3 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          ) : timelineError ? (
            <div className="flex flex-col items-center justify-center gap-2 p-6 text-center h-full">
              <i className="fa-solid fa-triangle-exclamation"></i>
              <p className="text-sm font-medium text-gray-600">
                Failed to load timeline
              </p>
              <button
                onClick={() =>
                  dispatch(fetchShipmentTimeline(shipment.shipmentId))
                }
                className="mt-2 text-xs text-blue-600 underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <TimeLineVerticalStepper
              currentStatus={currentStatus}
              timeline={timelineData?.timeline ?? []}
            />
          )}
        </div>

        {timelineLoading ? (
          <div className="hidden md:block p-4 space-y-4 animate-pulse">
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
        ) : timelineError ? (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
            <i className="fa-solid fa-triangle-exclamation"></i>
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
          <div className="hidden md:flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
            <span className="text-gray-400">
              <GiMailbox size={46} />
            </span>
            <p className="text-sm font-medium text-gray-600">
              No timeline entries yet
            </p>
            <p className="text-xs text-gray-400">
              Status updates will appear here
            </p>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 overflow-y-auto p-4 flex-col">
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
        {isCancelledWithRefund && (
          <div className="mx-4 mb-3 flex items-center gap-2 px-3 py-2 bg-teal-50 border border-teal-200 rounded-lg text-xs text-teal-700">
            <i className="fa-solid fa-rotate-left text-teal-500" />
            Refund initiated — amount will be credited in 5–7 business days
          </div>
        )}
      </div>
    </>
  );
};

export default ShipmentTimelinePanel;
