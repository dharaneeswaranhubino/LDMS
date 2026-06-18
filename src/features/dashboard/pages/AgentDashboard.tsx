import { useEffect } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../shared/hooks/reduxHooks";
import { toggleAvailability, fetchAgentDashboard } from "../../agentShipment/agentSlice";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";
import DashboardStats from "../components/agentDashboard/DashboardStats";
import CustomerMessages from "../components/agentDashboard/CustomerMessages";
import TodaySchedule from "../components/agentDashboard/TodaySchedule";
// import CompletedToday from "../components/agentDashboard/CompletedToday";
// import ActiveShipments from "../components/agentDashboard/ActiveShipments";
import { getGreeting, today, ALL_SLOTS, STATUS_CONFIG, isActive, isDone } from "../utils/AgentDashboardHelper";

const AgentDashboard = () => {
  const dispatch = useAppDispatch();
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
        <p className="text-sm text-red-500">{dashboardError || "Failed to load dashboard"}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-cyan-50 via-indigo-200 to-sky-50 px-2 py-4 lg:p-5">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-2xl font-semibold text-slate-600">
            {getGreeting()}!
          </h1>
          <p className="text-[13px] text-slate-500 mt-1">{today}</p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`text-sm font-medium ${
              availability === "AVAILABLE" ? "text-green-700" : "text-red-600"
            }`}
          >
            {availability}
          </span>
          <button
            onClick={() => dispatch(toggleAvailability())}
            disabled={availabilityLoading}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
              availability === "AVAILABLE" ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-all duration-300 ${
                availability === "AVAILABLE" ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      <DashboardStats data={dashboardData} />

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        {/* Active shipments — no detail from dashboard API, show count */}
        {/* <ActiveShipments activeShipments={dashboardData.activeShipments} /> */}

        {/* Customer Messages — real data */}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <TodaySchedule
          schedule={dashboardData.todaysSchedule}
          ALL_SLOTS={ALL_SLOTS}
          STATUS_CONFIG={STATUS_CONFIG}
          isDone={isDone}
          isActive={isActive}
        />
        <CustomerMessages messages={dashboardData.customerMessages} />

        {/* Completed Today — completedDeliveries count from API */}
        {/* <CompletedToday
          completedDeliveries={dashboardData.completedDeliveries}
          assignedDeliveries={dashboardData.assignedDeliveries}
        /> */}
      </div>
    </div>
  );
};

export default AgentDashboard;