import { useMemo } from "react";
import type { AssignedShipment } from "../DashobardTypes/agentTypes";
import {
  ALL_SLOTS,
  getGreeting,
  isActive,
  isDone,
  MOCK_PROFILE,
  MOCK_SHIPMENTS,
  STATUS_CONFIG,
  today,
} from "../utils/AgentDashboardHelper";
import { deliveryMock } from "../../agentShipment/utils/mockDelivery";
import { getStatusState } from "../../agentShipment/utils/statusHelpers";
import DashboardStats from "../components/agentDashboard/DashboardStats";
import ActiveShipments from "../components/agentDashboard/ActiveShipments";
import CustomerMessages from "../components/agentDashboard/CustomerMessages";
import TodaySchedule from "../components/agentDashboard/TodaySchedule";
import CompletedToday from "../components/agentDashboard/CompletedToday";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../shared/hooks/reduxHooks";
import { toggleAvailability } from "../../agentShipment/agentSlice";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";
// import { fetchAgentSchedule } from "../../features/agent/agentSlice";

const AgentDashboard = () => {
  const dispatch = useAppDispatch();
  const { availability, availabilityLoading, loading } = useAppSelector(
    (state) => state.agent,
  );

  // const { schedule, profile, loading } = useAppSelector(s => s.agent);
  const profile = MOCK_PROFILE;
  const shipments = MOCK_SHIPMENTS;

  // useEffect(() => {
  //  dispatch(fetchAgentSchedule());
  // }, [dispatch]);

  const activeDelivery = useMemo(
    () => shipments.find((s) => isActive(s.shipmentStatus)) ?? null,
    [shipments],
  );

  const messages = useMemo(
    () =>
      shipments.filter(
        (s) =>
          s.lastMessage &&
          s.shipmentStatus !== "DELIVERED" &&
          s.shipmentStatus !== "COMPLETED",
      ),
    [shipments],
  );
  const unreadCount = messages.filter((m) => m.unread).length;

  const completedToday = useMemo(
    () => shipments.filter((s) => isDone(s.shipmentStatus)),
    [shipments],
  );

  const slotMap = useMemo(() => {
    const map: Record<string, AssignedShipment | null> = {};
    ALL_SLOTS.forEach((slot) => {
      map[slot.start] = null;
    });
    shipments.forEach((s) => {
      map[s.assignedSlotStart] = s;
    });
    return map;
  }, [shipments]);

  if (loading) {
    return (
      <div className="h-[calc(100vh-72px)] overflow-y-auto rounded-lg bg-gradient-to-br from-sky-50 via-cyan-100 to-indigo-50 scrollbar-none">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className=" rounded-2xl bg-gradient-to-br from-cyan-50 via-indigo-200 to-sky-50 px-2 py-4 lg:p-5">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-2xl font-semibold text-slate-600">
            {getGreeting()}, {profile.name.split(" ")[0]}!
          </h1>
          <p className="text-[13px] text-slate-500 mt-1">{today}</p>
        </div>
        {/* <span className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-[12px] font-medium">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Available
        </span> */}
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
      <DashboardStats profile={profile} />

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <ActiveShipments
          activeDelivery={activeDelivery}
          STATUS_CONFIG={STATUS_CONFIG}
          deliveryMock={deliveryMock}
          getStatusState={getStatusState}
        />

        <CustomerMessages messages={messages} unreadCount={unreadCount} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <TodaySchedule
          slotMap={slotMap}
          ALL_SLOTS={ALL_SLOTS}
          STATUS_CONFIG={STATUS_CONFIG}
          isDone={isDone}
          isActive={isActive}
        />

        <CompletedToday completedToday={completedToday} profile={profile} />
      </div>
    </div>
  );
};

export default AgentDashboard;
