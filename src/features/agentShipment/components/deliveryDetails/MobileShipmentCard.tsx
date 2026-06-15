import { useNavigate } from "react-router-dom";
import type { DeliveryItem } from "../../agentTypes";
import { STATUS_BADGE, formatSlot } from "../../utils/statusHelpers";

interface MobileShipmentCardProps {
  item: DeliveryItem;
}

const MobileShipmentCard = ({ item }: MobileShipmentCardProps) => {
  const navigate = useNavigate();
  const badge = STATUS_BADGE[item.shipmentStatus] ?? STATUS_BADGE.PENDING;

  return (
    <button
      onClick={() => navigate(`/deliveryDetail/${item.shipmentId}`)}
      className="w-full text-left rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm active:scale-[0.99] transition-transform"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[12px] font-semibold font-mono text-slate-700 truncate max-w-[60%]">
          {item.trackingId}
        </p>
        <span
          className="text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
          style={{ background: badge.bg, color: badge.color }}
        >
          {badge.label}
        </span>
      </div>

      <p className="text-sm font-medium text-slate-700 mt-2">
        {item.receiverName}
      </p>
      <p className="text-[12px] text-slate-400 mt-1 truncate">
        {item.deliveryAddress}, {item.deliveryCity}
      </p>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <i className="fa-regular fa-clock text-[10px]" />
          {formatSlot(item.assignedSlotStart)} – {formatSlot(item.assignedSlotEnd)}
        </span>
        <i className="fa-solid fa-chevron-right text-slate-300 text-xs" />
      </div>
    </button>
  );
};

export default MobileShipmentCard;