import { FaClock, FaMapMarkerAlt, FaWeightHanging } from "react-icons/fa";
import {
  MdOutlineInventory2,
  MdOutlineProductionQuantityLimits,
} from "react-icons/md";
import type { DeliveryItem } from "../../agentTypes";
import { PiUsersFill } from "react-icons/pi";
import { useState } from "react";
import DeliveryDetailsModal from "./DeliveryDetailsModal";
import { TbMinusVertical } from "react-icons/tb";

interface Props {
  item: DeliveryItem;
}
const DeliveryCard = ({ item }: Props) => {
  const [isView, setIsView] = useState<boolean>(false);

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

      case "OUT_FOR_DELIVERY":
        return "bg-indigo-50 text-indigo-700 border border-indigo-200";

      case "IN_TRANSIT":
        return "bg-blue-50 text-cyan-700 border border-cyan-200";

      case "PICKED_UP":
        return "bg-orange-50 text-orange-700 border border-orange-200";

      case "ASSIGNED":
        return "bg-violet-50 text-violet-700 border border-violet-200";

      default:
        return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    }
  };
  const getStatusDotColor = () => {
    switch (item.shipmentStatus) {
      case "DELIVERED":
        return "bg-green-600";

      case "CANCELLED":
        return "bg-red-600";

      case "OUT_FOR_DELIVERY":
        return "bg-indigo-600";

      case "IN_TRANSIT":
        return "bg-cyan-600";

      case "PICKED_UP":
        return "bg-orange-600";

      case "ASSIGNED":
        return "bg-violet-600";

      default:
        return "bg-yellow-600";
    }
  };

  const onView = () => {
    setIsView(true);
  };

  const Separator = () => <span className="w-px h-4 bg-slate-300 shrink-0" />;

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm transition-all duration-300 hover:shadow">
        <div>
          <div className="flex justify-between items-center">
            <span className="font-mono text-[13px]">{item.trackingId}</span>

            <span
              className={`flex-shrink-0 px-3 h-[26px] rounded-full text-[11px] font-semibold flex items-center border ${getStatusColor()}`}
            >
              <span
                className={`w-2 h-2 rounded-full ${getStatusDotColor()} animate-pulse mr-2`}
              />
              {item.shipmentStatus.replaceAll("_", " ")}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span
                className={`flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold flex items-center border ${getPriorityColor()}`}
              >
                {item.shipmentPriority.replaceAll("_", " ")}
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
              <FaMapMarkerAlt className="text-slate-400" />
              <span className="font-medium text-slate-700">
                {item.pickupAddress || item.pickupCity}
              </span>
              <i className="fa-solid fa-arrow-right text-slate-300 text-xs" />
              <span className="font-medium text-slate-700">
                {item.deliveryAddress || item.deliveryCity}
              </span>
            </div>

            <div className="flex flex-col gap-1 mt-2 text-sm text-slate-500">
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <PiUsersFill size={18} style={{ opacity: "0.7" }} />
                  <span className="text-slate-600">Pickup:</span>
                  <span className="font-medium text-slate-700">
                    {item.senderName}
                  </span>

                  <i className="fa-solid fa-arrow-right"></i>

                  <span className="text-slate-600">Receiver:</span>
                  <span className="font-medium text-slate-700">
                    {item.receiverName}
                  </span>

                  <TbMinusVertical size={20} />

                  <div className="flex items-center gap-2">
                    <FaClock className="text-slate-400" />
                    <span>
                      {formatTime(item.assignedSlotStart)} -{" "}
                      {formatTime(item.assignedSlotEnd)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="mt-6 border-slate-200" />

          <div className="flex flex-wrap gap-3 mt-3">
            <button
              onClick={onView}
              className="py-[7px] px-4 border border-blue-200 bg-blue-50 text-blue-700 rounded-lg hover:bg-violet-100 transition-all text-[12px]"
            >
              <i className="fa-regular fa-eye mr-1" />
              View
            </button>
          </div>
        </div>
      </div>

      {isView && (
        <DeliveryDetailsModal
          setIsView={setIsView}
          item={item}
          getStatusColor={getStatusColor}
          getPriorityColor={getPriorityColor}
        />
      )}
    </>
  );
};

export default DeliveryCard;
