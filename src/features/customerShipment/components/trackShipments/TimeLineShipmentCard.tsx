import type { ShipmentCardProps } from "../../shipmentTypes";
import { STATUS_STYLE } from "../../utils/shipmentHelpers";

const TimeLineShipmentCard = ({
  shipment,
  isSelected,
  onClick,
}: ShipmentCardProps) => {
  const style =
    STATUS_STYLE[shipment.shipmentStatus] ?? STATUS_STYLE["PENDING"];
  return (
    <>
      <div
        onClick={onClick}
        className={`border rounded-lg p-3 cursor-pointer mb -2 transition-all
                ${
                  isSelected
                    ? "border-blue-400 bg-blue-50 border-[1.5px]"
                    : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                }`}
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <p
            className={`text-xs font-medium truncate max-w-[160px] ${isSelected ? "text-blue-800" : "text-gray-700"}`}
          >
            {shipment.trackingId}
          </p>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${style.bg} ${style.text}`}
          >
            {style.label}
          </span>
        </div>

        <div
          className={`flex items-center gap-1 text-xs mb-1.5 ${isSelected ? "text-blue-600" : "text-gray-500"}`}
        >
          <svg
            className="w-3 h-3 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="truncate">{shipment.pickupCity}</span>
          <span className="text-gray-300">→</span>
          <span className="truncate">{shipment.deliveryCity}</span>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-gray-400">
          <span className="flex items-center gap-1">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            {shipment.assignedAgent?.agentName ?? "Awaiting agent"}
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>{shipment.itemName}</span>
        </div>
      </div>
    </>
  );
};

export default TimeLineShipmentCard;
