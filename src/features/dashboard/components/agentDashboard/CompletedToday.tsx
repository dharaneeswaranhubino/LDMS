import { useNavigate } from "react-router-dom";

const CompletedToday = ({ completedToday, profile }: Props) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-circle-check text-green-500 text-[15px]" />
          <span className="text-[13px] font-semibold text-slate-800">
            Completed today
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700 border border-green-200">
          {completedToday.length} done
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {completedToday.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <i className="fa-regular fa-circle-check text-slate-200 text-3xl mb-3" />
            <p className="text-[12px] text-slate-500 font-medium">
              No completions yet today
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Delivered shipments will appear here
            </p>
          </div>
        ) : (
          completedToday.map((s) => (
            <div
              key={s.id}
              onClick={() => navigate(`/agent/delivery/${s.id}`)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-all cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-check text-green-600 text-[12px]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-mono font-semibold text-slate-700 truncate">
                  {s.trackingId.substring(0, 16)}…
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {s.customerName}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                  <span>{s.pickupCity}</span>
                  <i className="fa-solid fa-arrow-right text-[8px]" />
                  <span>{s.deliveryCity}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] text-slate-400">
                  {s.assignedSlotStart}
                </p>
                <span className="mt-1 inline-block px-2 py-0.5 rounded text-[9px] bg-green-100 text-green-700 border border-green-200 font-semibold">
                  On time
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {completedToday.length > 0 && (
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Completion rate today</span>
            <span className="font-semibold text-slate-700">
              {completedToday.length} / {profile.todayAssigned} shipments
            </span>
          </div>
          <div className="h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-green-400 transition-all"
              style={{
                width: `${(completedToday.length / Math.max(profile.todayAssigned, 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedToday;
