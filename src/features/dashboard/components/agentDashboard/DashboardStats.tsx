import type { AgentDashboardData } from "../../../agentShipment/agentTypes";

interface Props {
  data: AgentDashboardData;
}

const DashboardStats = ({ data }: Props) => {
  const { assignedDeliveries, activeShipments, completedDeliveries, pendingAssignments } = data;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4 shadow-sm">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <i className="fa-solid fa-truck text-indigo-600 text-[16px]" />
          </div>
          <div>
            <p className="text-[20px] font-semibold text-slate-800">{assignedDeliveries}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide">Assigned</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <i className="fa-solid fa-circle-notch text-blue-600 text-[16px]" />
          </div>
          <div>
            <p className="text-[20px] font-semibold text-slate-800">{activeShipments}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide">Active</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <i className="fa-solid fa-circle-check text-green-600 text-[16px]" />
          </div>
          <div>
            <p className="text-[20px] font-semibold text-slate-800">{completedDeliveries}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide">Completed</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <i className="fa-solid fa-hourglass-half text-amber-500 text-[16px]" />
          </div>
          <div>
            <p className="text-[20px] font-semibold text-slate-800">{pendingAssignments}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide">Pending</p>
          </div>
        </div>

      </div>

      {/* Progress bar */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="flex justify-between text-[10px] text-slate-500 mb-1.5">
          <span>Today's progress</span>
          <span className="font-medium">{completedDeliveries} / {assignedDeliveries} completed</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all"
            style={{ width: `${(completedDeliveries / Math.max(assignedDeliveries, 1)) * 100}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-400 mt-1">
          {activeShipments} active · {pendingAssignments} pending pickup
        </p>
      </div>
    </div>
  );
};

export default DashboardStats;