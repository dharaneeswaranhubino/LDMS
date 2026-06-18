import { useEffect } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../shared/hooks/reduxHooks";
import {
  toggleAvailability,
  fetchAgentDashboard,
} from "../../agentShipment/agentSlice";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";
import DashboardStats from "../components/agentDashboard/DashboardStats";
import CustomerMessages from "../components/agentDashboard/CustomerMessages";
import TodaySchedule from "../components/agentDashboard/TodaySchedule";
import {
  getGreeting,
  today,
  ALL_SLOTS,
  STATUS_CONFIG,
  isActive,
  isDone,
} from "../utils/AgentDashboardHelper";

const AgentDashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const {
    availability,
    availabilityLoading,
    dashboardData,
    dashboardLoading,
    dashboardError,
  } = useAppSelector((state) => state.agent);

  useEffect(() => {
    dispatch(fetchAgentDashboard());
  }, [dispatch]);

  if (dashboardLoading) {
    return (
      <div className="h-[calc(100vh-72px)] overflow-y-auto rounded-lg bg-gradient-to-br from-sky-50 via-cyan-100 to-indigo-50 scrollbar-none">
        <LoadingSpinner />
      </div>
    );
  }

  if (dashboardError || !dashboardData) {
    return (
      <div className="h-[calc(100vh-72px)] flex items-center justify-center">
        <p className="text-sm text-red-500">
          {dashboardError || "Failed to load dashboard"}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-cyan-50 via-indigo-200 to-sky-50 px-2 py-4 lg:p-5">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            {getGreeting()} <span className="text-indigo-400">{user?.name}</span>
          </h1>
          <p className="text-[13px] text-slate-500 mt-0.5 font-medium">
            {today}
          </p>
        </div>

        <div className="flex items-center gap-2.5 bg-white/70 backdrop-blur-sm border border-white/80 rounded-2xl px-3 py-2 shadow-sm">
          <span
            className={`text-[11px] font-bold tracking-wide ${
              availability === "AVAILABLE" ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {availability}
          </span>
          {availability === "AVAILABLE" && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          )}
          <button
            onClick={() => dispatch(toggleAvailability())}
            disabled={availabilityLoading}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 shadow-inner ${
              availability === "AVAILABLE"
                ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                availability === "AVAILABLE" ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      <DashboardStats data={dashboardData} />

      <div className="grid lg:grid-cols-2 gap-4">
        <TodaySchedule
          schedule={dashboardData.todaysSchedule}
          ALL_SLOTS={ALL_SLOTS}
          STATUS_CONFIG={STATUS_CONFIG}
          isDone={isDone}
          isActive={isActive}
        />
        <CustomerMessages messages={dashboardData.customerMessages} />
      </div>
    </div>
  );
};

export default AgentDashboard;
