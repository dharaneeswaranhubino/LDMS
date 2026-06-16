import DonutChart from "../../../../shared/components/DonutChart";
import type { PaymentChartProps } from "../../../adminShipment/adminTypes";
import { MdOutlinePayment } from "react-icons/md";

const PaymentChart = ({ paid, pending, failed }: PaymentChartProps) => {
  return (
    <div className="rounded-[14px] border border-sky-200/60 bg-white px-6 py-5 shadow-[0_2px_12px_rgba(6,182,212,0.08)]">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-base font-bold text-sky-900">
          <MdOutlinePayment />
        </span>
        <span className="text-[15px] font-bold text-sky-900">
          Payment Status
        </span>
      </div>

      <DonutChart
        labels={["Paid", "Pending", "Failed"]}
        values={[paid, pending, failed]}
        colors={["#0891b2", "#f59e0b", "#ef4444"]}
        legendColors={["bg-cyan-500", "bg-amber-500", "bg-red-500"]}
        bgColors={[
          "bg-cyan-100 text-cyan-600",
          "bg-amber-100 text-amber-600",
          "bg-red-100 text-red-500",
        ]}
      />
    </div>
  );
};

export default PaymentChart;
