import { useNavigate } from "react-router-dom";

const TodaySchedule = ({
  slotMap,
  ALL_SLOTS,
  STATUS_CONFIG,
  isDone,
  isActive,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-calendar-day text-slate-500 text-[15px]" />
          <span className="text-[13px] font-semibold text-slate-800">
            Today's schedule
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          8 slots · 9AM–6PM
        </span>
      </div>

      <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto scrollbar-none">
        {ALL_SLOTS.map((slot) => {
          const shipment = slotMap[slot.start];
          if (!shipment)
            return (
              <div key={slot.start} className="flex items-center gap-0">
                <div className="w-[72px] flex-shrink-0 px-3 py-3 border-r border-slate-100">
                  <p className="text-[10px] font-mono font-medium text-slate-400">
                    {slot.start}
                  </p>
                  <p className="text-[9px] font-mono text-slate-300 mt-0.5">
                    {slot.end}
                  </p>
                </div>
                <div className="flex-1 px-3 py-3">
                  <p className="text-[11px] text-slate-300 italic">Free slot</p>
                </div>
                <div className="px-3">
                  <span className="px-2 py-0.5 rounded text-[9px] bg-slate-50 text-slate-300 border border-slate-100">
                    Free
                  </span>
                </div>
              </div>
            );

          const cfg = STATUS_CONFIG[shipment.shipmentStatus];
          const cancelled = shipment.shipmentStatus === "CANCELLED";
          const done = isDone(shipment.shipmentStatus);
          const active = isActive(shipment.shipmentStatus);

          return (
            <div
              key={slot.start}
              onClick={() =>
                !cancelled && navigate(`/agent/delivery/${shipment.id}`)
              }
              className={`flex items-start gap-0 transition-all
                    ${cancelled ? "opacity-50" : "cursor-pointer hover:bg-slate-50"}
                    ${active ? "bg-blue-50/40" : ""}
                  `}
            >
              <div className="w-[72px] flex-shrink-0 px-3 py-3 border-r border-slate-100">
                <p
                  className={`text-[10px] font-mono font-medium ${active ? "text-blue-700" : "text-slate-500"}`}
                >
                  {slot.start}
                </p>
                <p className="text-[9px] font-mono text-slate-300 mt-0.5">
                  {slot.end}
                </p>
              </div>
              <div className="flex-1 px-3 py-3 min-w-0">
                <p
                  className={`text-[11px] font-mono font-semibold truncate ${cancelled ? "line-through text-slate-400" : "text-slate-700"}`}
                >
                  {shipment.trackingId.substring(0, 14)}…
                </p>
                <p
                  className={`text-[11px] font-medium mt-0.5 ${cancelled ? "text-slate-300 line-through" : "text-slate-700"}`}
                >
                  {shipment.customerName}
                </p>
                <div
                  className={`flex items-center gap-1 text-[10px] mt-0.5 ${cancelled ? "text-slate-300" : "text-slate-400"}`}
                >
                  <span>{shipment.pickupCity}</span>
                  <i className="fa-solid fa-arrow-right text-[8px]" />
                  <span>{shipment.deliveryCity}</span>
                </div>
                {cancelled && (
                  <p className="text-[10px] text-red-400 mt-1 italic">
                    Cancelled — slot now free
                  </p>
                )}
              </div>
              <div className="px-3 py-3 flex-shrink-0">
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-semibold border ${cfg.style}`}
                >
                  {cfg.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TodaySchedule;
