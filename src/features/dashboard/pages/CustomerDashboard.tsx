import { useEffect, useCallback } from "react";
import {
  Package,
  Bell,
  Receipt,
  MessageCircle,
  Plus,
  AlertCircle,
} from "lucide-react";
// import { Chart, registerables } from "chart.js";
import {
  fetchCustomerDashboard,
  setDateRange,
} from "../../customerShipment/shipmentSlice";
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
import LoadingSpinner from "../../../shared/components/LoadingSpinner";
import { TbTruckDelivery, TbChevronsUpRight } from "react-icons/tb";
import { CgCheckO } from "react-icons/cg";
import { GoAlert } from "react-icons/go";
import { BsGraphUpArrow } from "react-icons/bs";

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
      <div className="h-[calc(100vh-72px)] overflow-y-auto rounded-lg bg-gradient-to-br from-sky-50 via-cyan-100 to-indigo-50 scrollbar-none">
        <LoadingSpinner />
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
    <div className="flex flex-col gap-4 rounded-2xl min-h-screen bg-gradient-to-br from-slate-50 via-sky-200 to-purple-50 p-6 overflow-hidden">
      {/* Header */}
      <div className="mb-6 flex flex-wrap gap-3 items-start justify-between">
        <div>
          <h1 className="m-0 text-3xl font-extrabold tracking-tight text-sky-800">
            My dashboard
          </h1>
          <p className="mt-1 text-sm font-normal text-slate-500">
            Welcome back — here's your shipment summary
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
            <Bell size={18} />
            {dashboardData.unreadNotifications > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
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
      <div className="mb-5 flex flex-wrap gap-3">
        <StatCard
          icon={<TbTruckDelivery />}
          label="Active shipments"
          value={dashboardData.activeShipments}
          sub="Currently in transit"
          iconBg="bg-amber-100"
          accent={
            dashboardData.activeShipments > 0 ? "text-amber-600" : undefined
          }
        />
        <StatCard
          icon={<i className="fa-solid fa-boxes-stacked"></i>}
          label="Total shipments"
          value={dashboardData.totalShipments}
          sub="All time"
          iconBg="bg-blue-100"
          accent={
            dashboardData.totalShipments > 0 ? "text-blue-500" : undefined
          }
        />
        <StatCard
          icon={<CgCheckO />}
          label="Delivered"
          value={dashboardData.deliveredShipments}
          sub="Completed orders"
          iconBg="bg-green-100"
          accent={
            dashboardData.deliveredShipments > 0 ? "text-green-600" : undefined
          }
        />
        <StatCard
          icon={<GoAlert />}
          label="Pending payments"
          value={dashboardData.pendingPayments}
          sub="Action required"
          iconBg="bg-gray-100"
          accent={
            dashboardData.pendingPayments > 0 ? "text-gray-600" : undefined
          }
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <h2 className="flex items-center gap-2 text-[15px] font-bold text-sky-900">
            <Package size={18}/> Shipment breakdown
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
          <h2 className="flex items-center gap-2 text-[15px] font-bold text-sky-900 mb-1">
            <BsGraphUpArrow size={16}/> Monthly shipments
          </h2>
          <p className="mb-3 text-[11px] text-sky-700 mb-3">
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
            yAxisFormatter={(value) => value ? value.toString():""}
          />
        </div>
      </div>

      {/* Recent shipments + Payment history */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="rounded-xl border border-gray-100 bg-white p-5 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[15px] font-bold text-sky-900">
              <TbTruckDelivery size={18}/> Recent shipments
            </h2>
            <button className="flex items-center gap-1 text-[12px] bg-sky-100 text-sky-600 p-2 rounded-md hover:text-sky-800">
              View all <TbChevronsUpRight size={18}/>
            </button>
          </div>
          <RecentShipmentsTable shipments={dashboardData.recentShipments} />
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[15px] font-bold text-sky-900">
              <Receipt size={15}/> Payment history
            </h2>
            <button className="flex items-center gap-1 text-[12px] bg-sky-100 text-sky-600 p-2 rounded-md hover:text-sky-800">
              View all <TbChevronsUpRight size={18}/>
            </button>
          </div>
          <PaymentHistoryList payments={dashboardData.paymentHistory} />
        </div>
      </div>

      {/* Support chat history */}
      <div className="rounded-xl border border-gray-100 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-[15px] font-bold text-sky-900">
            <MessageCircle size={18}/> Support chat
            history
          </h2>
          <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-[12px] font-medium text-sky-800 hover:bg-gray-50">
            <Plus size={13} /> New chat
          </button>
        </div>
        <SupportChatList chats={dashboardData.recentSupportChats} />
      </div>
    </div>
  );
}
