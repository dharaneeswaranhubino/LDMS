import { useState } from "react";
import type {
  RevenueChartProps,
  RevenueTab,
} from "../../../adminShipment/adminTypes";
import LineChart from "../../../../shared/components/LineChart";
import { formatCurrency } from "../../utils/AdminDashboardHelper";
import { BsGraphUpArrow } from "react-icons/bs";

const RevenueChart = ({
  totalRevenue,
  revenueByTab,
  fromDate,
  toDate,
}: RevenueChartProps) => {
  const [activeTab, setActiveTab] = useState<RevenueTab>("Daily");

  return (
    <div className="rounded-[14px] border border-sky-200/60 bg-white px-6 py-5 shadow-[0_2px_12px_rgba(6,182,212,0.08)]">
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
              onClick={() => setActiveTab(tab)}
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

      <div className="mb-4">
        <span className="text-[28px] font-extrabold text-sky-900">
          {formatCurrency(totalRevenue)}
        </span>

        <span className="ml-3 rounded-full bg-green-100 px-2.5 py-1 text-[13px] font-semibold text-green-600">
          +18% vs last period
        </span>
      </div>

      <LineChart
        key={`${activeTab}-${fromDate}-${toDate}`}
        data={revenueByTab[activeTab]}
      />

      <div className="mt-3 flex items-center gap-1.5">
        <span className="inline-block h-[10px] w-[10px] rounded-[2px] bg-cyan-600" />
        <span className="text-xs text-slate-500">Revenue (₹)</span>
      </div>
    </div>
  );
};

export default RevenueChart;
