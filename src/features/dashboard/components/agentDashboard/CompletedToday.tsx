interface Props {
  completedDeliveries: number;
  assignedDeliveries: number;
}

const CompletedToday = ({ completedDeliveries, assignedDeliveries }: Props) => {
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
          {completedDeliveries} done
        </span>
      </div>

      <div className="flex flex-col items-center justify-center py-12 px-6">
        {completedDeliveries === 0 ? (
          <>
            <i className="fa-regular fa-circle-check text-slate-200 text-4xl mb-3" />
            <p className="text-[12px] text-slate-500 font-medium">No completions yet today</p>
            <p className="text-[11px] text-slate-400 mt-1">Delivered shipments will appear here</p>
          </>
        ) : (
          <>
            {/* Big count */}
            <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mb-3">
              <span className="text-3xl font-bold text-green-600">{completedDeliveries}</span>
            </div>
            <p className="text-[12px] text-slate-600 font-medium">
              {completedDeliveries === 1 ? "delivery" : "deliveries"} completed
            </p>
          </>
        )}
      </div>

      {/* Progress bar */}
      <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
        <div className="flex items-center justify-between text-[11px] mb-2">
          <span className="text-slate-500">Completion rate today</span>
          <span className="font-semibold text-slate-700">
            {completedDeliveries} / {assignedDeliveries} shipments
          </span>
        </div>
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-green-400 transition-all duration-500"
            style={{
              width: `${(completedDeliveries / Math.max(assignedDeliveries, 1)) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CompletedToday;