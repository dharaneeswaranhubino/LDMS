// import { useEffect, useState } from "react";
// import { fetchAdminDashboard } from "../../adminShipment/adminSlice";
// import {
//   useAppDispatch,
//   useAppSelector,
// } from "../../../shared/hooks/reduxHooks";

// import DashboardHeader from "../components/adminDashboard/DashboardHeader";
// import PaymentChart from "../components/adminDashboard/PaymentChart";
// import AgentPerformanceTable from "../components/adminDashboard/AgentPerformanceTable";
// import CustomerComplaints from "../components/adminDashboard/CustomerComplaints";
// import LoadingSpinner from "../../../shared/components/LoadingSpinner";

// const formatDate = (date: Date) => date.toISOString().split("T")[0];
// const today = formatDate(new Date());

// const AdminDashboard = () => {
//   const dispatch = useAppDispatch();
//   const { dashboard, dashboardLoading } = useAppSelector(
//     (state) => state.admin,
//   );

//   const getDefaultFromDate = () => {
//     const d = new Date();
//     d.setDate(d.getDate() - 7);
//     return formatDate(d);
//   };

//   const [fromDate, setFromDate] = useState(getDefaultFromDate);
//   const [toDate, setToDate] = useState(today);

//   useEffect(() => {
//     dispatch(fetchAdminDashboard({ fromDate, toDate }));
//   }, []);

//   const handleDateApply = (from: string, to: string) => {
//     setFromDate(from);
//     setToDate(to);
//     dispatch(fetchAdminDashboard({ fromDate: from, toDate: to }));
//   };

//   if (dashboardLoading || !dashboard) {
//     return (
//       <div className="h-[calc(100vh-72px)] overflow-y-auto rounded-lg bg-gradient-to-br from-sky-50 via-cyan-100 to-indigo-50 scrollbar-none">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   const {
//     totalShipments,
//     deliveredShipments,
//     activeDeliveries,
//     delayedShipments,
//     totalRevenue,
//     paymentSummary,
//     agentPerformance,
//     complaints,
//   } = dashboard;

//   return (
//     <div className="box-border h-[calc(100vh-72px)] overflow-y-auto rounded-lg bg-gradient-to-br from-sky-50 via-cyan-100 to-indigo-50 p-5 font-sans scrollbar-none">
//       <DashboardHeader
//         fromDate={fromDate}
//         toDate={toDate}
//         onApply={handleDateApply}
//         totalShipments={totalShipments}
//         deliveredShipments={deliveredShipments}
//         activeDeliveries={activeDeliveries}
//         delayedShipments={delayedShipments}
//         totalRevenue={totalRevenue}
//       />

//       <div className="mb-4">
//         <PaymentChart
//           paid={paymentSummary.paid}
//           pending={paymentSummary.pending}
//           failed={paymentSummary.failed}
//         />
//       </div>

//       <div className="mb-4">
//         <AgentPerformanceTable agentPerformance={agentPerformance} />
//       </div>

//       <CustomerComplaints complaints={complaints} />
//     </div>
//   );
// };

// export default AdminDashboard;
import { useEffect, useState } from "react";
import { fetchAdminDashboard } from "../../adminShipment/adminSlice";
import { useAppDispatch, useAppSelector } from "../../../shared/hooks/reduxHooks";

import DashboardHeader from "../components/adminDashboard/DashboardHeader";
import RevenueChart from "../components/adminDashboard/RevenueChart";   // ← new
import PaymentChart from "../components/adminDashboard/PaymentChart";
import AgentPerformanceTable from "../components/adminDashboard/AgentPerformanceTable";
import CustomerComplaints from "../components/adminDashboard/CustomerComplaints";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";

const formatDate = (date: Date) => date.toISOString().split("T")[0];
// const today = formatDate(new Date());

const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const { dashboard, dashboardLoading } = useAppSelector((state) => state.admin);

  const getDefaultFromDate = () => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return formatDate(d);
  };

  const getToday = () => new Date().toISOString().split("T")[0];

  const [fromDate, setFromDate] = useState(getDefaultFromDate);
  const [toDate, setToDate] = useState(getToday);

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
    totalRevenue,
    granularity,       // ← new
    revenueStats,      // ← new
    paymentSummary,
    agentPerformance,
    complaints,
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
        totalRevenue={totalRevenue}
      />

      {/* Revenue chart — above payment chart */}
      <div className="mb-4">
        <RevenueChart
          totalRevenue={totalRevenue}
          revenueStats={revenueStats}
          granularity={granularity}
        />
      </div>

      <div className="mb-4">
        <PaymentChart
          paid={paymentSummary.paid}
          pending={paymentSummary.pending}
          failed={paymentSummary.failed}
        />
      </div>

      <div className="mb-4">
        <AgentPerformanceTable agentPerformance={agentPerformance} />
      </div>

      <CustomerComplaints complaints={complaints} />
    </div>
  );
};

export default AdminDashboard;