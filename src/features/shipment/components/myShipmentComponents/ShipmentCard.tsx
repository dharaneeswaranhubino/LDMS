import { useNavigate } from "react-router-dom";
import type {
  ShipmentResponse,
  ShipmentStatus,
  PriorityType,
} from "../../shipmentTypes";

import {
  formatDate,
  formatTime,
  getAgentLabel,
  PRIORITY_LABEL,
  PRIORITY_STYLES,
  STATUS_LABEL,
  STATUS_STYLES,
} from "../../utils/shipmentHelpers";

interface Props {
  item: ShipmentResponse;
  onView: (shipment: ShipmentResponse) => void;
}

const ShipmentCard = ({ item, onView }: Props) => {
  const navigate = useNavigate();

  const status = (item.shipmentStatus ?? "PENDING") as ShipmentStatus;
  const priority = (item.shipmentPriority ?? "STANDARD") as PriorityType;

  const agentLabel = getAgentLabel(item);

  const deliveryFrom = formatTime(item.preferredDeliveryFrom ?? null);
  const deliveryTo = formatTime(item.preferredDeliveryTo ?? null);

  const slotLabel =
    deliveryFrom && deliveryTo
      ? `Preferred: ${deliveryFrom} – ${deliveryTo}`
      : null;

  const isPendingPayment = item.paymentStatus === "PENDING";

  return (
    <div className="bg-white/90 border border-slate-200 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 pr-4">
          <p className="flex flex-wrap gap-2 items-center text-[13px] font-semibold text-slate-800 mb-1">
            <span className="font-mono">
              {item.trackingId ?? `#SHP-${item.id}`}
            </span>
            <span
              className={`px-3 h-[22px] rounded-full text-[11px] font-semibold flex items-center border ${PRIORITY_STYLES[priority]}`}
            >
              {PRIORITY_LABEL[priority]}
            </span>
            {item.isFragile && (
              <span className="px-2 h-[22px] rounded-full text-[11px] font-semibold flex items-center bg-yellow-50 text-yellow-600 border border-yellow-200">
                <i className="fa-solid fa-triangle-exclamation mr-1 text-[10px]" />
                Fragile
              </span>
            )}
          </p>

          <p className="text-[12px] text-slate-500 mb-1">
            <i className="fa-solid fa-box mr-1 text-slate-300" />
            {item.itemName}
            {item.quantity > 1 && ` × ${item.quantity}`}
            {item.packageWeight && ` · ${item.packageWeight} kg`}
          </p>

          <div className="flex flex-wrap gap-2 items-center text-[12px] text-slate-600 my-1">
            <span className="font-medium text-slate-700">
              {item.pickupCity || item.pickupAddress}
            </span>
            <i className="fa-solid fa-arrow-right text-slate-300 text-[10px]" />
            <span className="font-medium text-slate-700">
              {item.deliveryCity || item.deliveryAddress}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 mt-1">
            <p className="text-[11px] text-slate-400">
              <i className="fa-regular fa-user mr-1" />
              {agentLabel}
            </p>
            {slotLabel && (
              <p className="text-[11px] text-slate-400">
                <i className="fa-regular fa-clock mr-1" />
                {slotLabel}
              </p>
            )}

            <p className="text-[11px] text-slate-400">
              <i className="fa-regular fa-calendar-check mr-1" />
              {formatDate(item.createdAt ?? "")}
            </p>
          </div>
        </div>

        <span
          className={`flex-shrink-0 px-3 h-[26px] rounded-full text-[11px] font-semibold flex items-center border ${STATUS_STYLES[status]}`}
        >
          {STATUS_LABEL[status]}
        </span>
      </div>

      <hr className="mt-6 border-slate-200" />

      <div className="flex flex-wrap gap-3 mt-3">
        <button
          onClick={() => onView(item)}
          className="py-[7px] px-4 border border-violet-200 bg-violet-50 text-violet-700 rounded-lg hover:bg-violet-100 transition-all text-[12px]"
        >
          <i className="fa-regular fa-eye mr-1" />
          View
        </button>

        {/* {isPendingPayment && (
            <button
              onClick={() => navigate(`/payment/${item.id}`)}
              className="py-[7px] px-4 border border-amber-300 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-all text-[12px] font-medium"
            >
              <i className="fa-solid fa-credit-card mr-1" />
              Pay now · ₹{item.amount}
            </button>
          )} */}

        {!["CANCELLED", "PENDING"].includes(status) && (
          <button
            onClick={() => navigate(`/trackShipments/${item.id}`)}
            className="py-[7px] px-4 border border-blue-200 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all text-[12px]"
          >
            <i className="fa-solid fa-location-dot mr-1" />
            Track
          </button>
        )}

        {!["CANCELLED", "PENDING", "CONFIRMED"].includes(status) && (
          <button
            onClick={() => navigate(`/chat/${item.id}`)}
            className="py-[7px] px-4 border border-pink-200 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 transition-all text-[12px]"
          >
            <i className="fa-brands fa-rocketchat mr-1" />
            Chat
          </button>
        )}

        {item.amount && !isPendingPayment && (
          <span className="ml-auto py-[7px] px-3 rounded-lg text-[12px] font-medium text-green-700 bg-green-50 border border-green-200">
            ₹{item.amount}
            <span className="ml-1 text-[10px] text-green-500">paid</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default ShipmentCard;
