import type {
  AgentScheduleSlot,
  ShipmentStatus,
} from "../../../agentShipment/agentTypes";

interface Props {
  schedule: AgentScheduleSlot[];
  ALL_SLOTS: { start: string; end: string }[];
  STATUS_CONFIG: Record<string, { style: string; label: string; icon: string }>;
  isDone: (s: ShipmentStatus) => boolean;
  isActive: (s: ShipmentStatus) => boolean;
}

const TodaySchedule = ({ schedule, STATUS_CONFIG, isActive }: Props) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-white rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
            <i className="fa-solid fa-calendar-day text-indigo-500 text-[12px]" />
          </div>
          <span className="text-[13px] font-bold text-slate-700">
            Today's schedule
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
          {schedule.length} slots
        </span>
      </div>

      {schedule.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-3">
            <i className="fa-regular fa-calendar text-slate-300 text-2xl" />
          </div>
          <p className="text-[12px] text-slate-500 font-semibold">
            No schedule for today
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Assigned slots will appear here
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100/70 max-h-[420px] overflow-y-auto scrollbar-none">
          {schedule.map((slot, idx) => {
            const cfg = slot.shipmentStatus
              ? STATUS_CONFIG[slot.shipmentStatus]
              : null;
            const active = slot.shipmentStatus
              ? isActive(slot.shipmentStatus)
              : false;

            return (
              <div
                key={idx}
                className={`flex items-stretch gap-0 transition-all hover:bg-indigo-50/30 ${
                  active ? "bg-blue-50" : ""
                }`}
              >
                <div
                  className={`w-[60px] flex-shrink-0 px-2 py-3.5 border-r border-slate-100/80 flex flex-col items-center justify-center gap-1`}
                >
                  <span
                    className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md ${
                      active
                        ? "bg-blue-100 text-blue-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {idx + 1}
                  </span>
                </div>

                <div className="flex-1 px-3 py-3.5 min-w-0">
                  <p className="text-[11px] font-mono font-bold text-slate-700 truncate">
                    {slot.trackingId}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                    {slot.receiverName}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] text-slate-400 font-medium">
                      {slot.deliveryAddress}
                    </span>

                    <div className="flex ">
                      <p
                        className={`text-[9px] font-mono mr-1 font-semibold leading-none ${active ? "text-blue-500" : "text-slate-400"}`}
                      >
                        {slot.slotStart} -
                      </p>

                      <p
                        className={`text-[9px] font-mono font-semibold leading-none ${active ? "text-blue-500" : "text-slate-400"}`}
                      >
                        {slot.slotEnd}
                      </p>
                    </div>
                  </div>
                </div>

                {cfg && (
                  <div
                    className={`px-3 py-3.5 flex-shrink-0 flex items-center`}
                  >
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-bold border ${active && "animate-pulse"} ${cfg.style}`}
                    >
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
