import { FaClock, FaMapMarkerAlt, FaWeightHanging } from "react-icons/fa";
import {
  MdOutlineInventory2,
  MdOutlineProductionQuantityLimits,
} from "react-icons/md";
import type { DeliveryItem } from "../../agentTypes";

interface Props {
  item: DeliveryItem;
}
const DeliveryCard = ({ item }: Props) => {
  const getPriorityColor = () => {
    switch (item.shipmentPriority) {
      case "SAME_DAY":
        return "bg-red-50 text-red-600 border border-red-200";
      case "EXPRESS":
        return "bg-yellow-50 text-yellow-700 border border-yellow-200";
      default:
        return "bg-slate-100 text-slate-600 border border-slate-200";
    }
  };

  const getStatusColor = () => {
    switch (item.shipmentStatus) {
      case "DELIVERED":
        return "bg-green-50 text-green-700 border border-green-200";
      case "CANCELLED":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    }
  };
  const getStatusDotColor = () => {
    switch (item.shipmentStatus) {
      case "DELIVERED":
        return "bg-green-600 border border-green-200";
      case "CANCELLED":
        return "bg-red-600 border border-red-200";
      default:
        return "bg-yellow-600 border border-yellow-200";
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <span className="font-mono">{item.trackingId}</span>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span
              className={`flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold flex items-center border ${getPriorityColor()}`}
            >
              {item.shipmentPriority.replace("_", " ")}
            </span>

            {item.isFragile && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                <i className="fa-solid fa-triangle-exclamation mr-1 text-[10px]" />
                Fragile
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-5 mt-2 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <MdOutlineInventory2 className="text-slate-400" />
              {item.itemName}
            </span>

            <span className="flex items-center gap-2">
              <MdOutlineProductionQuantityLimits className="text-slate-400" />
              Qty: {item.quantity}
            </span>

            <span className="flex items-center gap-2">
              <FaWeightHanging className="text-slate-400" />
              {item.packageWeight} kg
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
            <span className="font-medium text-slate-700">
              {item.pickupAddress || item.pickupCity}
            </span>
            <i className="fa-solid fa-arrow-right text-slate-300 text-xs" />
            <span className="font-medium text-slate-700">
              {item.deliveryAddress || item.deliveryCity}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-5 mt-2 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-slate-400" />
              <span>{item.customerName}</span>
            </div>

            <div className="flex items-center gap-2">
              <FaClock className="text-slate-400" />
              <span>
                {item.assignedSlotStart} - {item.assignedSlotEnd}
              </span>
            </div>
          </div>
        </div>

        <div>
          <span
            className={`flex-shrink-0 px-3 h-[26px] rounded-full text-[11px] font-semibold flex items-center border ${getStatusColor()}`}
          >
          <span className={`w-2 h-2 rounded-full ${getStatusDotColor()} animate-pulse mr-2`} />
            {item.shipmentStatus.replace("_", " ")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DeliveryCard;
