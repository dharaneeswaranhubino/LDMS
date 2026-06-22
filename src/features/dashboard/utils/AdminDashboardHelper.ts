import type { ComplaintStatus } from "../../adminShipment/adminTypes";

export const formatCurrency = (n: number) => {
  return "₹" + n.toLocaleString("en-IN");
};

export const AVATAR_COLORS = ["#0891b2", "#0d9488", "#7c3aed", "#d97706"];

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// export function timeAgo(iso: string) {
//   const diff = Date.now() - new Date(iso).getTime();
//   const h = Math.floor(diff / 3600000);
//   if (h < 1) return "Just now";
//   if (h < 24) return `${h} hrs ago`;
//   return "Yesterday";
// }
export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);

  if (h < 1) return "Just now";
  if (h < 24) return `${h} hrs ago`;
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d} days ago`;
  if (d < 30) return `${Math.floor(d / 7)} weeks ago`;
  return `${Math.floor(d / 30)} months ago`;
}


export const STATUS_COLORS: Record<
  string,
  { className: string; label: string }
> = {
  IN_TRANSIT: {
    className: "bg-blue-100 text-blue-700",
    label: "In Transit",
  },
  CONFIRMED: {
    className: "bg-teal-100 text-teal-700",
    label: "Confirmed",
  },
  ASSIGNED: {
    className: "bg-indigo-100 text-indigo-700",
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
    label: "Picked Up",
  },
  OUT_FOR_PICKUP: {
    className: "bg-orange-100 text-orange-700",
    label: "Out for Pickup",
  },
  OUT_FOR_DELIVERY: {
    className: "bg-violet-100 text-violet-700",
    label: "Out for Delivery",
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

export const COMPLAINT_COLORS: Record<
  ComplaintStatus,
  { className: string; label: string }
> = {
  OPEN: {
    className: "bg-red-100 text-red-700",
    label: "Open",
  },
  IN_REVIEW: {
    className: "bg-yellow-100 text-yellow-700",
    label: "In Review",
  },
  RESOLVED: {
    className: "bg-green-100 text-green-700",
    label: "Resolved",
  },
};