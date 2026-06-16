import type {
  DashboardHeaderProps,
  StatsProps,
} from "../../../adminShipment/adminTypes";
// import DateRangePicker, { displayDate } from "./DateRangePicker";
import StatCard from "./StatCardInfo";
import { CgCheckO } from "react-icons/cg";
import { GoAlert } from "react-icons/go";
import { TbTruckDelivery } from "react-icons/tb";
import { LuAlarmClockCheck } from "react-icons/lu";
import DateRangePicker from "../../../../shared/components/DateRangePicker";
import { displayDate } from "../../../../shared/utils";

const DashboardHeader = ({
  fromDate,
  toDate,
  onApply,
  totalShipments,
  deliveredShipments,
  activeDeliveries,
  delayedShipments,
  pendingShipments,
}: DashboardHeaderProps & StatsProps) => {
  return (
    <>
      <div className="mb-6 flex flex-wrap gap-3 items-start justify-between">
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
          icon={<LuAlarmClockCheck />}
          value={pendingShipments}
          label="Pending"
          iconBg="#f1f5f9"
          accent="#475569"
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
