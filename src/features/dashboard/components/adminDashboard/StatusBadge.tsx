import type {
  ComplaintStatus,
  ShipmentStatus,
} from "../../../adminShipment/adminTypes";

export const STATUS_COLORS: Record<
  string,
  { className: string; label: string }
> = {
  IN_TRANSIT: {
    className: "bg-blue-100 text-blue-700",
    label: "In transit",
  },
  CONFIRMED: {
    className: "bg-green-100 text-green-700",
    label: "Assigned",
  },
  PENDING: {
    className: "bg-yellow-100 text-yellow-700",
    label: "Pending",
  },
  DELAYED: {
    className: "bg-red-100 text-red-700",
    label: "Delayed",
  },
  DELIVERED: {
    className: "bg-green-100 text-green-700",
    label: "Delivered",
  },
  PICKED_UP: {
    className: "bg-blue-100 text-blue-700",
    label: "Picked up",
  },
  OUT_FOR_DELIVERY: {
    className: "bg-violet-100 text-violet-700",
    label: "Out for del.",
  },
  CANCELLED: {
    className: "bg-red-100 text-red-700",
    label: "Cancelled",
  },
};

export const PAY_COLORS: Record<string, { className: string }> = {
  PAID: {
    className: "bg-green-100 text-green-700",
  },
  PENDING: {
    className: "bg-yellow-100 text-yellow-700",
  },
  FAILED: {
    className: "bg-red-100 text-red-700",
  },
};

export const COMPLAINT_COLORS: Record<ComplaintStatus, { className: string }> =
  {
    OPEN: {
      className: "bg-red-100 text-red-700",
    },
    RESOLVED: {
      className: "bg-green-100 text-green-700",
    },
    IN_PROGRESS: {
      className: "bg-yellow-100 text-yellow-700",
    },
  };

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
  const c = PAY_COLORS[status];

  return (
    <span
      className={`rounded-md px-2.5 py-1 text-xs font-semibold ${c.className}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
