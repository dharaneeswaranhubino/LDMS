import type { AgentDashboardData } from "../../../agentShipment/agentTypes";

interface Props {
  data: AgentDashboardData;
}
const DashboardStats = ({ data }: Props) => {
  const { assignedDeliveries, activeShipments, completedDeliveries, pendingAssignments } = data;

  const stats = [
    {
      value: assignedDeliveries,
      label: "Assigned",
      icon: "fa-truck",
      accent: "from-indigo-500 to-indigo-600",
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      border: "border-t-indigo-400",
    },
    {
      value: activeShipments,
      label: "Active",
      icon: "fa-solid fa-rotate fa-spin",
      accent: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      border: "border-t-blue-400",
    },
    {
      value: completedDeliveries,
      label: "Completed",
      icon: "fa-circle-check",
      accent: "from-emerald-500 to-green-500",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      border: "border-t-emerald-400",
    },
    {
      value: pendingAssignments,
      label: "Pending",
      icon: "fa-hourglass-half",
      accent: "from-amber-400 to-orange-500",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
      border: "border-t-amber-400",
    },
  ];

  const pct = Math.round((completedDeliveries / Math.max(assignedDeliveries, 1)) * 100);

  return (
    <div className="mb-5 space-y-3">
      {/* Stat tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`bg-white/80 backdrop-blur-sm border border-white rounded-2xl p-4 shadow-sm border-t-2 ${s.border} hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${s.iconBg} flex items-center justify-center`}>
                <i className={`fa-solid ${s.icon} ${s.iconColor} text-[14px]`} />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                {s.label}
              </span>
            </div>
            <p className="text-[28px] font-bold text-slate-800 leading-none">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Progress banner */}
      <div className="bg-white/70 backdrop-blur-sm border border-white rounded-2xl px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-chart-line text-indigo-500 text-[12px]" />
            <span className="text-[11px] font-semibold text-slate-600">Today's progress</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-indigo-600">{pct}%</span>
            <span className="text-[10px] text-slate-400">{completedDeliveries} / {assignedDeliveries} completed</span>
          </div>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-all duration-700 relative"
            style={{ width: `${pct}%` }}
          >
            <span className="absolute right-0 top-0 h-full w-3 bg-white/40 rounded-full blur-sm" />
          </div>
        </div>
        <div className="flex gap-4 mt-2">
          <span className="text-[10px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block mr-1" />
            {activeShipments} active
          </span>
          <span className="text-[10px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block mr-1" />
            {pendingAssignments} pending pickup
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;