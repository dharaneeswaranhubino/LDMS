import { useEffect, useState } from "react";
import { fetchAdminDashboard } from "../../adminShipment/adminSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../shared/hooks/reduxHooks";

import DashboardHeader from "../components/adminDashboard/DashboardHeader";
import RevenueChart from "../components/adminDashboard/RevenueChart";
import PaymentChart from "../components/adminDashboard/PaymentChart";
import AgentPerformanceTable from "../components/adminDashboard/AgentPerformanceTable";
import RecentShipmentsTable from "../components/adminDashboard/RecentShipmentsTable";
import CustomerComplaints from "../components/adminDashboard/CustomerComplaints";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";

const formatDate = (date: Date) => date.toISOString().split("T")[0];
const today = formatDate(new Date());

const AdminDashboard = () => {
  const dispatch = useAppDispatch();

  const { dashboard, dashboardLoading } = useAppSelector(
    (state) => state.admin,
  );

  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);

  useEffect(() => {
    dispatch(fetchAdminDashboard({ fromDate, toDate }));
  }, []);

  const handleDateApply = (from: string, to: string) => {
    setFromDate(from);
    setToDate(to);
    dispatch(fetchAdminDashboard({ fromDate: from, toDate: to }));
  };

  if (dashboardLoading || !dashboard) {
    return (
      <div className="h-[calc(100vh-72px)] overflow-y-auto rounded-lg bg-gradient-to-br from-sky-50 via-cyan-100 to-indigo-50 scrollbar-none">
        <LoadingSpinner />
      </div>
    );
  }

  const {
    totalShipments,
    deliveredShipments,
    activeDeliveries,
    delayedShipments,
    pendingShipments,
    totalRevenue,
    paymentSummary,
    agentPerformance,
    recentShipments,
    complaints,
    revenueByTab,
  } = dashboard;

  return (
    <div className="box-border h-[calc(100vh-72px)] overflow-y-auto rounded-lg bg-gradient-to-br from-sky-50 via-cyan-100 to-indigo-50 p-5 font-sans scrollbar-none">
      <DashboardHeader
        fromDate={fromDate}
        toDate={toDate}
        onApply={handleDateApply}
        totalShipments={totalShipments}
        deliveredShipments={deliveredShipments}
        activeDeliveries={activeDeliveries}
        delayedShipments={delayedShipments}
        pendingShipments={pendingShipments}
      />

      <div className="mb-4 grid md:grid-cols-2 gap-4">
        <RevenueChart
          totalRevenue={totalRevenue}
          revenueByTab={revenueByTab}
          fromDate={fromDate}
          toDate={toDate}
        />

        <PaymentChart
          paid={paymentSummary.paid}
          pending={paymentSummary.pending}
          failed={paymentSummary.failed}
        />
      </div>

      <div className="mb-4 grid md:grid-cols-2 gap-4">
        <AgentPerformanceTable agentPerformance={agentPerformance} />
        <RecentShipmentsTable recentShipments={recentShipments} />
      </div>

      <CustomerComplaints complaints={complaints} />
    </div>
  );
};

export default AdminDashboard;
