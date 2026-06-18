import LineChart from "../../../../shared/components/LineChart";
import { formatCurrency } from "../../utils/AdminDashboardHelper";
import { BsGraphUpArrow } from "react-icons/bs";

interface RevenueDataPoint {
  period: string;
  revenue: number;
}

interface RevenueChartProps {
  totalRevenue: number;
  revenueStats: RevenueDataPoint[];
  granularity: string;
}

function formatPeriodLabel(period: string): string {
  // Monthly: "2026-06" → "Jun 26"
  if (/^\d{4}-\d{2}$/.test(period)) {
    const [year, month] = period.split("-");
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
  }
  // Weekly ISO: "2026-W23" → "W23"
  if (/^\d{4}-W\d{2}$/.test(period)) {
    return period.split("-")[1];
  }
  // Daily: "2026-06-11" → "11 Jun"
  if (/^\d{4}-\d{2}-\d{2}$/.test(period)) {
    const date = new Date(period);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  }
  return period;
}

const RevenueChart = ({ totalRevenue, revenueStats, granularity }: RevenueChartProps) => {
  const chartData = revenueStats.map((d) => ({
    label: formatPeriodLabel(d.period),
    value: d.revenue,
  }));

  return (
    <div className="rounded-[14px] border border-sky-200/60 bg-white px-6 py-5 shadow-[0_2px_12px_rgba(6,182,212,0.08)]">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-sky-900">
            <BsGraphUpArrow />
          </span>
          <span className="text-[15px] font-bold text-sky-900">Revenue Overview</span>
        </div>
        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-500">
          {granularity.toLowerCase()}
        </span>
      </div>

      {/* Total */}
      <div className="mb-4">
        <span className="text-[28px] font-extrabold text-sky-900">
          {formatCurrency(totalRevenue)}
        </span>
      </div>

      <LineChart
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