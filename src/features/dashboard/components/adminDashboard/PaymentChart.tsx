import DonutChart from "../../../../shared/components/DonutChart";
import type { PaymentChartProps } from "../../../adminShipment/adminTypes";
import { MdOutlinePayment } from "react-icons/md";

const PaymentChart = ({ paid, pending, failed }: PaymentChartProps) => {
  const total = paid + pending + failed;

  const items = [
    {
      label: "Paid",
      value: paid,
      dotClass: "bg-cyan-600",
      badgeClass: "bg-sky-100 text-cyan-600",
    },
    {
      label: "Pending",
      value: pending,
      dotClass: "bg-amber-500",
      badgeClass: "bg-yellow-100 text-amber-600",
    },
    {
      label: "Failed",
      value: failed,
      dotClass: "bg-red-500",
      badgeClass: "bg-red-100 text-red-500",
    },
  ];

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

      <DonutChart paid={paid} pending={pending} failed={failed} />

      <div className="mt-[18px] flex flex-col gap-2.5">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`inline-block h-[10px] w-[10px] rounded-[3px] ${item.dotClass}`}
              />
              <span className="text-[13px] text-slate-600">{item.label}</span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`rounded-md px-2.5 py-0.5 text-xs font-bold ${item.badgeClass}`}
              >
                {item.value}
              </span>
              <span className="text-xs text-slate-400">
                {Math.round((item.value / total) * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentChart;
