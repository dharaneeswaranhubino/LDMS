import type { AgentScheduleSlot, ShipmentStatus } from "../../../agentShipment/agentTypes";

interface Props {
  schedule: AgentScheduleSlot[];
  ALL_SLOTS: { start: string; end: string }[];
  STATUS_CONFIG: Record<string, { style: string; label: string; icon: string }>;
  isDone: (s: ShipmentStatus) => boolean;
  isActive: (s: ShipmentStatus) => boolean;
}

// const TodaySchedule = ({ schedule, ALL_SLOTS, STATUS_CONFIG, isDone, isActive }: Props) => {
const TodaySchedule = ({ schedule, STATUS_CONFIG, isActive }: Props) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-calendar-day text-slate-500 text-[15px]" />
          <span className="text-[13px] font-semibold text-slate-800">Today's schedule</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          {schedule.length} slots assigned
        </span>
      </div>

      {schedule.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <i className="fa-regular fa-calendar text-slate-200 text-3xl mb-3" />
          <p className="text-[12px] text-slate-500 font-medium">No schedule for today</p>
          <p className="text-[11px] text-slate-400 mt-1">
            Assigned slots will appear here
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto scrollbar-none">
          {schedule.map((slot, idx) => {
            const cfg = slot.shipmentStatus ? STATUS_CONFIG[slot.shipmentStatus] : null;
            // const done = slot.shipmentStatus ? isDone(slot.shipmentStatus) : false;
            const active = slot.shipmentStatus ? isActive(slot.shipmentStatus) : false;

            return (
              <div
                key={idx}
                className={`flex items-start gap-0 transition-all ${active ? "bg-blue-50/40" : ""}`}
              >
                <div className="w-[72px] flex-shrink-0 px-3 py-3 border-r border-slate-100">
                  <p className={`text-[10px] font-mono font-medium ${active ? "text-blue-700" : "text-slate-500"}`}>
                    {slot.assignedSlotStart}
                  </p>
                  <p className="text-[9px] font-mono text-slate-300 mt-0.5">
                    {slot.assignedSlotEnd}
                  </p>
                </div>
                <div className="flex-1 px-3 py-3 min-w-0">
                  <p className="text-[11px] font-mono font-semibold text-slate-700 truncate">
                    {slot.trackingId?.substring(0, 14)}…
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{slot.customerName}</p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                    <span>{slot.pickupCity}</span>
                    <i className="fa-solid fa-arrow-right text-[8px]" />
                    <span>{slot.deliveryCity}</span>
                  </div>
                </div>
                {cfg && (
                  <div className="px-3 py-3 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-semibold border ${cfg.style}`}>
                      {cfg.label}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TodaySchedule;