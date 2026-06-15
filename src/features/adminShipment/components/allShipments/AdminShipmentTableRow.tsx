import { useNavigate } from "react-router-dom";
import type { AdminShipmentTableRowProps } from "../../adminTypes";
import {
  avatarColor,
  formatDate,
  getInitials,
  PRIORITY_LABEL,
  PRIORITY_STYLE,
  STATUS_LABEL,
  STATUS_STYLE,
} from "../../utils/adminShipmentHelper";

const formatSlot = (
  start: string | null,
  end: string | null,
  date: string | null,
): string => {
  if (!start || !end) return "";
  const fmt = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
  };
  const dateStr = date
    ? new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      })
    : "";
  return `${fmt(start)} – ${fmt(end)}${dateStr ? ` · ${dateStr}` : ""}`;
};

const AdminShipmentTableRow = ({
  shipment: s,
  onView,
  onComplete,
}: AdminShipmentTableRowProps) => {
  const navigate = useNavigate();
  const renderAction = () => {
    if (s.shipmentStatus === "CONFIRMED" || s.shipmentStatus === "DELAYED") {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/allShipment/reassign/${s.shipmentId}`, {
              state: { shipment: s },
            });
          }}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium
            border whitespace-nowrap transition-all
            ${
              s.shipmentStatus === "DELAYED"
                ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                : "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100"
            }`}
        >
          <i className="fa-solid fa-rotate-right text-[10px]" />
          Reassign
        </button>
      );
    }

    if (s.shipmentStatus === "DELIVERED") {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onComplete(s);
          }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-all whitespace-nowrap"
        >
          <i className="fa-solid fa-circle-check text-[10px]" />
          Complete
        </button>
      );
    }

    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onView(s);
        }}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-all whitespace-nowrap"
      >
        <i className="fa-solid fa-eye text-[10px]" />
        View
      </button>
    );
  };

  return (
    <tr
      onClick={() => onView(s)}
      className={`hover:bg-sky-50 transition-all cursor-pointer
        ${s.shipmentStatus === "DELAYED" ? "bg-orange-50/40" : ""}`}
    >
      {/* Shipment */}
      <td className="px-4 py-3">
        <p className="font-mono font-semibold text-slate-800 text-[11px]">
          {s.trackingId.length > 18
            ? s.trackingId.substring(0, 18) + "…"
            : s.trackingId}
        </p>
        {s.isFragile && (
          <span className="text-[10px] text-yellow-600">
            <i className="fa-solid fa-wine-glass-crack mr-1" />
            Fragile
          </span>
        )}
      </td>

      {/* Customer */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0 ${avatarColor(s.customer.name)}`}
          >
            {getInitials(s.customer.name)}
          </div>
          <div>
            <p className="font-medium text-slate-800">{s.customer.name}</p>
            <p className="text-[10px] text-slate-400">{s.customer.email}</p>
          </div>
        </div>
      </td>

      {/* Route */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="font-medium text-slate-700">{s.pickupCity}</span>
          <i className="fa-solid fa-arrow-right text-slate-300 text-[9px]" />
          <span className="font-medium text-slate-700">{s.deliveryCity}</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-0.5">
          {s.packageWeight} kg · {s.itemName}
        </p>
      </td>

      {/* Priority */}
      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 whitespace-nowrap rounded-lg text-[10px] font-semibold border ${PRIORITY_STYLE[s.shipmentPriority]}`}
        >
          {PRIORITY_LABEL[s.shipmentPriority]}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 rounded-lg text-[10px] font-semibold border flex items-center gap-1 w-fit ${STATUS_STYLE[s.shipmentStatus]}`}
        >
          {s.shipmentStatus === "DELAYED" && (
            <i className="fa-solid fa-triangle-exclamation text-[9px]" />
          )}
          {STATUS_LABEL[s.shipmentStatus]}
        </span>
      </td>

      {/* Agent / Slot */}
      <td className="px-4 py-3">
        {s.assignedAgent ? (
          <>
            <p className="font-medium text-slate-700">{s.assignedAgent.name}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              <i className="fa-regular fa-clock mr-1" />
              {formatSlot(
                s.assignedSlotStart,
                s.assignedSlotEnd,
                s.assignedDate,
              )}
            </p>
          </>
        ) : (
          <span className="text-[11px] text-slate-400 italic">
            Not assigned
          </span>
        )}
      </td>

      {/* Amount */}
      <td className="px-4 py-3">
        <p className="font-semibold text-slate-800">₹{s.amount}</p>
        <p
          className={`text-[10px] mt-0.5 ${
            s.paymentStatus === "PAID"
              ? "text-green-600"
              : s.paymentStatus === "FAILED"
                ? "text-red-500"
                : "text-sky-600"
          }`}
        >
          {s.paymentStatus}
        </p>
      </td>

      {/* Date */}
      <td className="px-4 py-3 text-[11px] text-slate-500 font-mono">
        {formatDate(s.createdAt)}
      </td>

      {/* Action */}
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        {renderAction()}
      </td>
    </tr>
  );
};

export default AdminShipmentTableRow;
