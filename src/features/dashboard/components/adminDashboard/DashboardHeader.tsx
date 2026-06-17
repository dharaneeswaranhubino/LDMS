import type {
  DashboardHeaderProps,
  StatsProps,
} from "../../../adminShipment/adminTypes";
import StatCard from "./StatCardInfo";
import { CgCheckO } from "react-icons/cg";
import { GoAlert } from "react-icons/go";
import { TbTruckDelivery } from "react-icons/tb";
import { MdCurrencyRupee } from "react-icons/md";
import DateRangePicker from "../../../../shared/components/DateRangePicker";
import { displayDate } from "../../../../shared/utils";
import { formatCurrency } from "../../utils/AdminDashboardHelper";

const DashboardHeader = ({
  fromDate,
  toDate,
  onApply,
  totalShipments,
  deliveredShipments,
  activeDeliveries,
  delayedShipments,
  totalRevenue,
}: DashboardHeaderProps & StatsProps) => {
  return (
    <>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="m-0 text-3xl font-extrabold tracking-tight text-cyan-800">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm font-normal text-slate-500">
            Operations overview —{" "}
            <span className="font-medium text-cyan-600">
              {displayDate(fromDate)}
              {fromDate !== toDate ? ` → ${displayDate(toDate)}` : ""}
            </span>
          </p>
        </div>
        <DateRangePicker
          fromDate={fromDate}
          toDate={toDate}
          onApply={onApply}
        />
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        <StatCard
          icon={<i className="fa-solid fa-boxes-stacked"></i>}
          value={totalShipments}
          label="Total Shipments"
          iconBg="#e0f2fe"
          accent="#0369a1"
        />
        <StatCard
          icon={<CgCheckO />}
          value={deliveredShipments}
          label="Delivered"
          iconBg="#dcfce7"
          accent="#15803d"
        />
        <StatCard
          icon={<TbTruckDelivery />}
          value={activeDeliveries}
          label="Active Deliveries"
          iconBg="#fef9c3"
          accent="#a16207"
        />
        <StatCard
          icon={<GoAlert />}
          value={delayedShipments}
          label="Delayed"
          iconBg="#fee2e2"
          accent="#b91c1c"
        />
        <StatCard
          icon={<MdCurrencyRupee />}
          value={totalRevenue}
          label="Total Revenue"
          iconBg="#f0fdf4"
          accent="#15803d"
          formatValue={formatCurrency}
        />
      </div>

      {delayedShipments > 0 && (
        <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">
          <span className="text-base">
            <GoAlert />
          </span>
          <span>
            <strong>{delayedShipments} shipments delayed</strong> — exceeded
            assigned delivery slots. Review and reassign immediately.
          </span>
        </div>
      )}
    </>
  );
};

export default DashboardHeader;
