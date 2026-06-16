import type {
  RevenueChartProps,
  RevenueDataPoint,
  RevenueTab,
} from "../../../adminShipment/adminTypes";
import LineChart from "../../../../shared/components/LineChart";
import { formatCurrency } from "../../utils/AdminDashboardHelper";
import { BsGraphUpArrow } from "react-icons/bs";

function formatPeriodLabel(period: string, tab: RevenueTab): string {
  // Monthly: "2026-06" → "Jun 26"
  if (tab === "Monthly" && /^\d{4}-\d{2}$/.test(period)) {
    const [year, month] = period.split("-");
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
  }

  // Weekly ISO: "2026-W23" → "W23"
  if (tab === "Weekly" && /^\d{4}-W\d{2}$/.test(period)) {
    return period.split("-")[1]; // "W23"
  }

  // Daily or weekly as date: "2026-06-11" → "11 Jun"
  if (/^\d{4}-\d{2}-\d{2}$/.test(period)) {
    const date = new Date(period);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  }

  return period;
}

function buildChartData(
  revenueStats: RevenueDataPoint[],
  tab: RevenueTab,
): { label: string; value: number }[] {
  return revenueStats.map((d) => ({
    label: formatPeriodLabel(d.period, tab),
    value: d.revenue,
  }));
}


const RevenueChart = ({
  totalRevenue,
  revenueChangePercent,
  revenueStats,
  activeTab,
  onTabChange,
}: RevenueChartProps) => {
  const chartData = buildChartData(revenueStats, activeTab);

  return (
    <div className="rounded-[14px] border border-sky-200/60 bg-white px-6 py-5 shadow-[0_2px_12px_rgba(6,182,212,0.08)]">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-sky-900">
            <BsGraphUpArrow />
          </span>
          <span className="text-[15px] font-bold text-sky-900">
            Revenue Overview
          </span>
        </div>

        <div className="flex gap-1.5">
          {(["Daily", "Weekly", "Monthly"] as RevenueTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`rounded-lg border px-3.5 py-1.5 text-xs transition-all duration-150 ${
                activeTab === tab
                  ? "border-cyan-600 bg-cyan-600 font-semibold text-white"
                  : "border-slate-300 bg-transparent font-normal text-slate-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 flex items-baseline gap-3">
        <span className="text-[28px] font-extrabold text-sky-900">
          {formatCurrency(totalRevenue)}
        </span>

        {revenueChangePercent !== null && (
          <span
            className={`rounded-full px-2.5 py-1 text-[13px] font-semibold ${
              revenueChangePercent >= 0
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {revenueChangePercent >= 0 ? "+" : ""}
            {revenueChangePercent}%
          </span>
        )}
      </div>

      <LineChart
        key={activeTab}
        data={chartData}
        datasetLabel="Revenue"
        tooltipFormatter={(value) => `₹${value?.toLocaleString("en-IN")}`}
        yAxisFormatter={(value) =>
          value != null ? `₹${(value / 1000).toFixed(0)}k` : ""
        }
      />

      <div className="mt-3 flex items-center gap-1.5">
        <span className="inline-block h-[10px] w-[10px] rounded-[2px] bg-cyan-600" />
        <span className="text-xs text-slate-500">Revenue (₹)</span>
      </div>
    </div>
  );
};

export default RevenueChart;