import { useEffect, useRef, useState, useCallback } from "react";
import {
  CalendarDays,
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
import { Chart, registerables } from "chart.js";

import {
  fetchCustomerDashboard,
  setDateRange,
} from "../../shipment/shipmentSlice"; // adjust path
import type {
  DashboardRecentShipment,
  DashboardPaymentRecord,
  DashboardSupportChat,
  MonthlyStatEntry,
} from "../../shipment/shipmentTypes";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../shared/hooks/reduxHooks"; // adjust path

Chart.register(...registerables);

const fmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});
const fmtDate = (d: string) => fmt.format(new Date(d));
const fmtAmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const todayStr = () => new Date().toISOString().split("T")[0];

const fmtMonthLabel = (month: string) =>
  new Date(month + "-01").toLocaleDateString("en-GB", {
    month: "short",
    year: "2-digit",
  });

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const SHIPMENT_STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  PENDING: {
    label: "Pending",
    cls: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  CONFIRMED: {
    label: "Confirmed",
    cls: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  ASSIGNED: {
    label: "Assigned",
    cls: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  OUT_FOR_PICKUP: {
    label: "Out for pickup",
    cls: "bg-cyan-50 text-cyan-700 border border-cyan-200",
  },
  PICKED_UP: {
    label: "Picked up",
    cls: "bg-cyan-50 text-cyan-700 border border-cyan-200",
  },
  IN_TRANSIT: {
    label: "In transit",
    cls: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for delivery",
    cls: "bg-violet-50 text-violet-700 border border-violet-200",
  },
  DELIVERED: {
    label: "Delivered",
    cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  CANCELLED: {
    label: "Cancelled",
    cls: "bg-red-50 text-red-600 border border-red-200",
  },
};

const PAYMENT_STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  PAID: {
    label: "Paid",
    cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  PENDING: {
    label: "Pending",
    cls: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  FAILED: {
    label: "Failed",
    cls: "bg-red-50 text-red-600 border border-red-200",
  },
};

const SUPPORT_STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  OPEN: {
    label: "Open",
    cls: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  RESOLVED: {
    label: "Resolved",
    cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  CLOSED: {
    label: "Closed",
    cls: "bg-gray-100 text-gray-500 border border-gray-200",
  },
};

function Badge({
  status,
  config,
}: {
  status: string;
  config: Record<string, { label: string; cls: string }>;
}) {
  const c = config[status] ?? {
    label: status,
    cls: "bg-gray-100 text-gray-500 border border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${c.cls}`}
    >
      {c.label}
    </span>
  );
}

interface DateRangePickerProps {
  fromDate: string;
  toDate: string;
  onApply: (from: string, to: string) => void;
}

function DateRangePicker({ fromDate, toDate, onApply }: DateRangePickerProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [localFrom, setLocalFrom] = useState(fromDate);
  const [localTo, setLocalTo] = useState(toDate);

  useEffect(() => {
    setLocalFrom(fromDate);
  }, [fromDate]);
  useEffect(() => {
    setLocalTo(toDate);
  }, [toDate]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 whitespace-nowrap rounded-xl bg-gradient-to-br from-cyan-700 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition-opacity hover:opacity-90"
      >
        <CalendarDays size={17} />
        <span>
          {fmtDate(fromDate)} → {fmtDate(toDate)}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-[100] w-60 rounded-2xl bg-gradient-to-br from-cyan-700 to-cyan-500 p-4 shadow-2xl shadow-cyan-500/25">
          <div className="flex flex-col gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-cyan-100">
                From
              </label>
              <input
                type="date"
                value={localFrom}
                max={localTo}
                onChange={(e) => setLocalFrom(e.target.value)}
                className="box-border w-full rounded-lg border-0 bg-white/20 px-3 py-2 text-sm text-white outline-none [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-cyan-100">
                To
              </label>
              <input
                type="date"
                value={localTo}
                min={localFrom}
                max={todayStr()}
                onChange={(e) => setLocalTo(e.target.value)}
                className="box-border w-full rounded-lg border-0 bg-white/20 px-3 py-2 text-sm text-white outline-none [color-scheme:dark]"
              />
            </div>
            <button
              onClick={() => {
                onApply(localFrom, localTo);
                setOpen(false);
              }}
              className="mt-1 rounded-lg bg-white py-2 text-sm font-bold text-cyan-700 transition-opacity hover:opacity-85"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  sub: string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
      <div className="mb-3 flex items-center gap-2 text-xs text-gray-400">
        <Icon size={13} />
        <span>{label}</span>
      </div>
      <p
        className={`text-3xl font-semibold leading-none tracking-tight ${accent ?? "text-gray-800"}`}
      >
        {value}
      </p>
      <p className="mt-1.5 text-[11px] text-gray-400">{sub}</p>
    </div>
  );
}

function RecentShipmentsTable({
  shipments,
}: {
  shipments: DashboardRecentShipment[];
}) {
  if (!shipments.length) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">
        No shipments in this period.
      </p>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="pb-2.5 text-left text-[11px] font-medium text-gray-400">
              Item
            </th>
            <th className="pb-2.5 text-left text-[11px] font-medium text-gray-400">
              Tracking
            </th>
            <th className="pb-2.5 text-left text-[11px] font-medium text-gray-400">
              Status
            </th>
            <th className="pb-2.5 text-left text-[11px] font-medium text-gray-400">
              Payment
            </th>
            <th className="pb-2.5 text-left text-[11px] font-medium text-gray-400">
              ETA
            </th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((s) => (
            <tr
              key={s.shipmentId}
              className="border-b border-gray-50 last:border-0"
            >
              <td className="py-3 pr-4">
                <p className="font-medium text-gray-800">{s.itemName}</p>
                <p className="text-[11px] text-gray-400">
                  {s.deliveryAddress}, {s.deliveryCity}
                </p>
              </td>
              <td className="py-3 pr-4">
                <span className="font-mono text-[11px] text-gray-500">
                  {s.trackingId}
                </span>
              </td>
              <td className="py-3 pr-4">
                <Badge
                  status={s.shipmentStatus}
                  config={SHIPMENT_STATUS_CONFIG}
                />
              </td>
              <td className="py-3 pr-4">
                <Badge
                  status={s.paymentStatus}
                  config={PAYMENT_STATUS_CONFIG}
                />
              </td>
              <td className="py-3 text-[11px] text-gray-400">
                {s.estimatedDelivery ? fmtDate(s.estimatedDelivery) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PaymentHistoryList({
  payments,
}: {
  payments: DashboardPaymentRecord[];
}) {
  if (!payments.length) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">
        No payments in this period.
      </p>
    );
  }
  return (
    <div className="flex flex-col divide-y divide-gray-50">
      {payments.map((p) => (
        <div
          key={p.paymentId}
          className="flex items-center justify-between py-3"
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                p.paymentStatus === "PENDING"
                  ? "bg-amber-50"
                  : p.paymentStatus === "FAILED"
                    ? "bg-red-50"
                    : "bg-blue-50"
              }`}
            >
              <Package
                size={14}
                className={
                  p.paymentStatus === "PENDING"
                    ? "text-amber-600"
                    : p.paymentStatus === "FAILED"
                      ? "text-red-500"
                      : "text-blue-600"
                }
              />
            </div>
            <div>
              <p className="text-[13px] font-medium text-gray-800">
                Shipment #{p.shipmentId}
              </p>
              <p className="text-[11px] text-gray-400">
                {p.paidAt ? fmtDate(p.paidAt) : "Awaiting payment"}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-sm font-semibold text-gray-800">
              {fmtAmt(p.amount)}
            </span>
            <Badge status={p.paymentStatus} config={PAYMENT_STATUS_CONFIG} />
          </div>
        </div>
      ))}
    </div>
  );
}

function SupportChatList({ chats }: { chats: DashboardSupportChat[] }) {
  if (!chats.length) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">
        No support chats yet.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-2.5">
      {chats.map((chat) => {
        const initials = chat.agentName ? getInitials(chat.agentName) : "AI";
        const isBot = chat.lastMessageBy === "BOT" || !chat.agentName;
        return (
          <div
            key={chat.chatId}
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-100 bg-white p-3.5 transition-colors hover:border-gray-200 hover:bg-gray-50"
          >
            <div
              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-semibold ${
                isBot
                  ? "bg-violet-100 text-violet-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="truncate text-[13px] font-medium text-gray-800">
                  {chat.subject}
                </p>
                <span className="flex-shrink-0 text-[11px] text-gray-400">
                  {fmtDate(chat.updatedAt)}
                </span>
              </div>
              <p className="mt-0.5 truncate text-[12px] text-gray-500">
                {chat.lastMessage}
              </p>
              <div className="mt-2 flex items-center gap-2">
                {chat.unreadCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[9px] font-bold text-white">
                    {chat.unreadCount}
                  </span>
                )}
                <Badge status={chat.status} config={SUPPORT_STATUS_CONFIG} />
                <span className="text-[11px] text-gray-400">
                  {chat.agentName ? `Agent: ${chat.agentName}` : "Automated"}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DonutChart({
  data,
}: {
  data: { active: number; delivered: number; pending: number };
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current?.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels: ["In transit", "Delivered", "Pending"],
        datasets: [
          {
            data: [data.active, data.delivered, data.pending],
            backgroundColor: ["#6366f1", "#10b981", "#f59e0b"],
            borderWidth: 0,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: { legend: { display: false } },
      },
    });
    return () => {
      chartRef.current?.destroy();
    };
  }, [data.active, data.delivered, data.pending]);

  return (
    <div className="flex items-center gap-6">
      <div className="relative h-36 w-36 flex-shrink-0">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Shipment status donut chart"
        />
      </div>
      <div className="flex flex-col gap-2.5">
        {[
          { label: "In transit", color: "bg-indigo-500", value: data.active },
          {
            label: "Delivered",
            color: "bg-emerald-500",
            value: data.delivered,
          },
          { label: "Pending", color: "bg-amber-400", value: data.pending },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 flex-shrink-0 rounded-sm ${item.color}`}
            />
            <span className="text-[13px] text-gray-600">{item.label}</span>
            <span className="ml-auto pl-4 font-semibold text-gray-800">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LineChart({ stats }: { stats: MonthlyStatEntry[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !stats.length) return;
    chartRef.current?.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: stats.map((s) => fmtMonthLabel(s.month)), // "2026-01" → "Jan 26"
        datasets: [
          {
            label: "Shipments",
            data: stats.map((s) => s.count),
            borderColor: "#0891b2",
            backgroundColor: "rgba(8,145,178,0.07)",
            borderWidth: 2,
            pointBackgroundColor: "#0891b2",
            pointRadius: 4,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 11 }, color: "#9ca3af" },
          },
          y: {
            min: 0,
            ticks: { stepSize: 1, font: { size: 11 }, color: "#9ca3af" },
            grid: { color: "rgba(156,163,175,0.12)" },
          },
        },
        plugins: { legend: { display: false } },
      },
    });
    return () => {
      chartRef.current?.destroy();
    };
  }, [stats]);

  return (
    <div className="relative h-44 w-full">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Monthly shipments line chart"
      />
    </div>
  );
}

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
              data={{
                active: dashboardData.activeShipments,
                delivered: dashboardData.deliveredShipments,
                pending: dashboardData.pendingShipments,
              }}
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
            <LineChart stats={dashboardData.monthlyStats} />
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
