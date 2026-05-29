import type {
  ShipmentResponse,
  ShipmentStatus,
  PriorityType,
  FilterTab,
  SortKey,
} from "../shipmentTypes";

export const STATUS_STYLES: Record<ShipmentStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-100 text-blue-700 border-blue-200",
  ASSIGNED: "bg-cyan-100 text-cyan-700 border-cyan-200",
  OUT_FOR_PICKUP: "bg-cyan-100 text-cyan-700 border-cyan-200",
  PICKED_UP: "bg-sky-100 text-sky-700 border-sky-200",
  IN_TRANSIT: "bg-indigo-100 text-indigo-700 border-indigo-200",
  OUT_FOR_DELIVERY: "bg-violet-100 text-violet-700 border-violet-200",
  DELIVERED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

export const STATUS_LABEL: Record<ShipmentStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  ASSIGNED: "Assigned",
  OUT_FOR_PICKUP: "Out for pickup",
  PICKED_UP: "Picked up",
  IN_TRANSIT: "In transit",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const PRIORITY_STYLES: Record<PriorityType, string> = {
  STANDARD: "border-slate-200 bg-slate-50 text-slate-600",
  EXPRESS: "border-orange-200 bg-orange-50 text-orange-600",
  SAME_DAY: "border-rose-200 bg-rose-50 text-rose-600",
};

export const PRIORITY_LABEL: Record<PriorityType, string> = {
  STANDARD: "Standard",
  EXPRESS: "Express",
  SAME_DAY: "Same day",
};

export const FILTER_TABS: {
  key: FilterTab;
  label: string;
}[] = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "ASSIGNED", label: "Assigned" },
  { key: "OUT_FOR_PICKUP", label: "Out for Pickup" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "PICKED_UP", label: "Picked up" },
  { key: "IN_TRANSIT", label: "In transit" },
  { key: "OUT_FOR_DELIVERY", label: "Out for delivery" },
  { key: "DELIVERED", label: "Delivered" },
  { key: "CANCELLED", label: "Cancelled" },
];

export const SORT_OPTIONS: {
  value: SortKey;
  label: string;
}[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "amount_high", label: "Amount: high → low" },
  { value: "amount_low", label: "Amount: low → high" },
];

export const formatDate = (iso: string) => {
  if (!iso) return "—";

  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatTime = (time: string | null) => {
  if (!time) return null;

  const [hour, minute] = time.split(":");

  const date = new Date();

  date.setHours(Number(hour));
  date.setMinutes(Number(minute));

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const getAgentLabel = (shipment: ShipmentResponse): string => {
  if (shipment.assignedAgent?.agentName) {
    return shipment.assignedAgent.agentName;
  }

  return "Awaiting assignment";
};

export const matchesSearch = (
  shipment: ShipmentResponse,
  q: string,
): boolean => {
  if (!q.trim()) return true;

  const lower = q.toLowerCase();

  return (
    shipment.trackingId?.toLowerCase().includes(lower) ||
    shipment.itemName.toLowerCase().includes(lower) ||
    shipment.pickupCity.toLowerCase().includes(lower) ||
    shipment.deliveryCity.toLowerCase().includes(lower) ||
    shipment.pickupAddress.toLowerCase().includes(lower) ||
    shipment.deliveryAddress.toLowerCase().includes(lower)
  );
};

export const deliveryPriority = [
  {
    label: "Standard",
    multiplier: "1 × rate",
    days: "Take's 3 to 5 days",
    value: "STANDARD" as const,
  },
  {
    label: "Express",
    multiplier: "1.3 × rate",
    days: "Take's maximum within 3 days",
    value: "EXPRESS" as const,
  },
  {
    label: "Same Day",
    multiplier: "1.8 × rate",
    days: "Take's 1 day",
    value: "SAME_DAY" as const,
  },
];


//razorpay function and variables
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");

    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const PRIORITY_MULTIPLIERS: Record<string, number> = {
  STANDARD: 1,
  EXPRESS: 1.3,
  SAME_DAY: 1.8,
};

export const BASE_RATE = 50;
export const RATE_PER_KG = 20;
export const FRAGILE_CHARGE = 50;
export const GST_RATE = 0.18;