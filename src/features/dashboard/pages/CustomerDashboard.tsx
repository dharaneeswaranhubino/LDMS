import { useEffect, useCallback } from "react";
import {
  Package,
  Boxes,
  CheckCircle,
  CreditCard,
  Bell,
  Truck,
  Receipt,
  MessageCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Loader2,
} from "lucide-react";
// import { Chart, registerables } from "chart.js";
import {
  fetchCustomerDashboard,
  setDateRange,
} from "../../shipment/shipmentSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../shared/hooks/reduxHooks";
import { fmtMonthLabel } from "../utils/CustomerDashboardHelper";
import DateRangePicker from "../../../shared/components/DateRangePicker";
import StatCard from "../components/customerDashboard/StatCard";
import RecentShipmentsTable from "../components/customerDashboard/RecentShipmentsTable";
import PaymentHistoryList from "../components/customerDashboard/PaymentHistoryList";
import SupportChatList from "../components/customerDashboard/SupportChatList";
import LineChart from "../../../shared/components/LineChart";
import DonutChart from "../../../shared/components/DonutChart";

// Chart.register(...registerables);

//  Main Dashboard
export default function CustomerDashboard() {
  const dispatch = useAppDispatch();
  const { dashboardData, loading, error, dateRange } = useAppSelector(
    (state) => state.shipment,
  );
  useEffect(() => {
    dispatch(
      fetchCustomerDashboard({ from: dateRange.from, to: dateRange.to }),
    );
  }, [dispatch, dateRange.from, dateRange.to]);

  const handleDateApply = useCallback(
    (from: string, to: string) => {
      dispatch(setDateRange({ from, to }));
      // setDateRange triggers dateRange change → useEffect above re-fires → new fetch
    },
    [dispatch],
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2 size={28} className="animate-spin" />
          <p className="text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-red-400">
          <AlertCircle size={28} />
          <p className="text-sm">{error}</p>
          <button
            onClick={() =>
              dispatch(
                fetchCustomerDashboard({
                  from: dateRange.from,
                  to: dateRange.to,
                }),
              )
            }
            className="mt-2 rounded-lg border border-red-200 px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-50"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 font-sans">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-gray-800">
              My dashboard
            </h1>
            <p className="mt-0.5 text-sm text-gray-400">
              Welcome back — here's your shipment summary
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
              <Bell size={17} />
              {dashboardData.unreadNotifications > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                  {dashboardData.unreadNotifications}
                </span>
              )}
            </button>
            <DateRangePicker
              fromDate={dateRange.from}
              toDate={dateRange.to}
              onApply={handleDateApply}
            />
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            icon={Truck}
            label="Active shipments"
            value={dashboardData.activeShipments}
            sub="Currently in transit"
          />
          <StatCard
            icon={Boxes}
            label="Total shipments"
            value={dashboardData.totalShipments}
            sub="All time"
          />
          <StatCard
            icon={CheckCircle}
            label="Delivered"
            value={dashboardData.deliveredShipments}
            sub="Completed orders"
          />
          <StatCard
            icon={CreditCard}
            label="Pending payments"
            value={dashboardData.pendingPayments}
            sub="Action required"
            accent={
              dashboardData.pendingPayments > 0 ? "text-amber-600" : undefined
            }
          />
        </div>

        {/* Recent shipments + Payment history */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="rounded-xl border border-gray-100 bg-white p-5 lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-[14px] font-medium text-gray-700">
                <Truck size={15} className="text-gray-400" /> Recent shipments
              </h2>
              <button className="flex items-center gap-1 text-[12px] text-cyan-600 hover:underline">
                View all <ArrowRight size={12} />
              </button>
            </div>
            <RecentShipmentsTable shipments={dashboardData.recentShipments} />
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-[14px] font-medium text-gray-700">
                <Receipt size={15} className="text-gray-400" /> Payment history
              </h2>
              <button className="flex items-center gap-1 text-[12px] text-cyan-600 hover:underline">
                View all <ArrowRight size={12} />
              </button>
            </div>
            <PaymentHistoryList payments={dashboardData.paymentHistory} />
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <h2 className="mb-4 flex items-center gap-2 text-[14px] font-medium text-gray-700">
              <Package size={15} className="text-gray-400" /> Shipment breakdown
            </h2>
            <DonutChart
              labels={["In Transit", "Delivered", "Pending"]}
              values={[
                dashboardData.activeShipments,
                dashboardData.deliveredShipments,
                dashboardData.pendingShipments,
              ]}
              colors={["#6366f1", "#10b981", "#f59e0b"]}
              legendColors={["bg-indigo-500", "bg-emerald-500", "bg-amber-500"]}
              bgColors={[
                "bg-indigo-100 text-indigo-600",
                "bg-emerald-100 text-emerald-600",
                "bg-amber-100 text-amber-500",
              ]}
            />
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <h2 className="mb-1 flex items-center gap-2 text-[14px] font-medium text-gray-700">
              <TrendingUp size={15} className="text-gray-400" /> Monthly
              shipments
            </h2>
            <p className="mb-3 text-[11px] text-gray-400">
              Based on selected date range
            </p>
            {/* <LineChart stats={dashboardData.monthlyStats} /> */}
            <LineChart
              data={dashboardData.monthlyStats.map((item) => ({
                label: fmtMonthLabel(item.month),
                value: item.count,
              }))}
              datasetLabel="Shipments"
              tooltipFormatter={(value) => `${value} Shipments`}
              yAxisFormatter={(value) => value.toString()}
            />
          </div>
        </div>

        {/* Support chat history */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[14px] font-medium text-gray-700">
              <MessageCircle size={15} className="text-gray-400" /> Support chat
              history
            </h2>
            <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-[12px] font-medium text-gray-600 hover:bg-gray-50">
              <Plus size={13} /> New chat
            </button>
          </div>
          <SupportChatList chats={dashboardData.recentSupportChats} />
        </div>
      </div>
    </div>
  );
}
