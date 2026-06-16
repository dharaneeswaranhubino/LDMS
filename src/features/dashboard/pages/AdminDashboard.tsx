import { useEffect } from "react";
import {
  fetchAdminDashboard,
  setActiveRevenueTab,
} from "../../adminShipment/adminSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../shared/hooks/reduxHooks";
import type { GroupBy, RevenueTab } from "../../adminShipment/adminTypes";

import DashboardHeader from "../components/adminDashboard/DashboardHeader";
import RevenueChart from "../components/adminDashboard/RevenueChart";
import PaymentChart from "../components/adminDashboard/PaymentChart";
import AgentPerformanceTable from "../components/adminDashboard/AgentPerformanceTable";
import RecentShipmentsTable from "../components/adminDashboard/RecentShipmentsTable";
import CustomerComplaints from "../components/adminDashboard/CustomerComplaints";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";
import { useState } from "react";

const formatDate = (date: Date) => date.toISOString().split("T")[0];
const today = formatDate(new Date());

const TAB_TO_GROUPBY: Record<RevenueTab, GroupBy> = {
  Daily: "daily",
  Weekly: "weekly",
  Monthly: "monthly",
};

const AdminDashboard = () => {
  const dispatch = useAppDispatch();

  const { dashboard, dashboardLoading, activeRevenueTab } = useAppSelector(
    (state) => state.admin,
  );

  const getDefaultFromDate = () => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return formatDate(d);
  };
  const [fromDate, setFromDate] = useState(getDefaultFromDate);
  const [toDate, setToDate] = useState(today);

  // Initial load always weekly
  useEffect(() => {
    dispatch(fetchAdminDashboard({ fromDate, toDate, groupBy: "weekly" }));
  }, []);

  const handleDateApply = (from: string, to: string) => {
    setFromDate(from);
    setToDate(to);
    dispatch(
      fetchAdminDashboard({
        fromDate: from,
        toDate: to,
        groupBy: TAB_TO_GROUPBY[activeRevenueTab],
      }),
    );
  };

  const handleRevenueTabChange = (tab: RevenueTab) => {
    dispatch(setActiveRevenueTab(tab));
    dispatch(
      fetchAdminDashboard({
        fromDate,
        toDate,
        groupBy: TAB_TO_GROUPBY[tab],
      }),
    );
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
    revenueChangePercent,
    paymentSummary,
    agentPerformance,
    recentShipments,
    complaints,
    revenueStats,
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

      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <RevenueChart
          totalRevenue={totalRevenue}
          revenueChangePercent={revenueChangePercent}
          revenueStats={revenueStats}
          activeTab={activeRevenueTab}
          onTabChange={handleRevenueTabChange}
        />

        <PaymentChart
          paid={paymentSummary.paid}
          pending={paymentSummary.pending}
          failed={paymentSummary.failed}
        />
      </div>

      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <AgentPerformanceTable agentPerformance={agentPerformance} />
        <RecentShipmentsTable recentShipments={recentShipments} />
      </div>

      <CustomerComplaints complaints={complaints} />
    </div>
  );
};

export default AdminDashboard;
