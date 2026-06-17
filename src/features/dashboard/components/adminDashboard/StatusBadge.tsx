import type { ShipmentStatus } from "../../../adminShipment/adminTypes";
import { PAY_COLORS, STATUS_COLORS } from "../../utils/AdminDashboardHelper";

export function StatusBadge({ status }: { status: ShipmentStatus }) {
  const c = STATUS_COLORS[status] ?? {
    className: "bg-slate-100 text-slate-500",
    label: status,
  };

  return (
    <span
      className={`whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-semibold ${c.className}`}
    >
      {c.label}
    </span>
  );
}

export function PayBadge({
  status,
}: {
  status: "PAID" | "PENDING" | "FAILED";
}) {
  const c = PAY_COLORS[status] ?? { className: "bg-slate-100 text-slate-500" };

  return (
    <span
      className={`rounded-md px-2.5 py-1 text-xs font-semibold ${c.className}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}