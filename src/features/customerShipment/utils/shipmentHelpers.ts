import {
  FiClock,
  FiCheckCircle,
  FiUser,
  FiMapPin,
  FiPackage,
  FiTruck,
  FiNavigation,
  FiHome,
  FiCheckSquare,
  FiXCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import type { IconType } from "react-icons/lib";
import type {
  ShipmentResponse,
  ShipmentStatus,
  PriorityType,
  FilterTab,
  SortKey,
  NotificationType,
  FilterType,
  TimelineStatus,
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
let razorpayFrame: HTMLIFrameElement | null = null;

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Already loaded
    if (window.Razorpay) {
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

export const unloadRazorpayScript = (): void => {
  const script = document.getElementById("razorpay-script");
  if (script) script.remove();

  document.querySelectorAll('[id^="razorpay"]').forEach((el) => el.remove());
  document
    .querySelectorAll('iframe[src*="razorpay"]')
    .forEach((el) => el.remove());
  document
    .querySelectorAll('iframe[src*="checkout"]')
    .forEach((el) => el.remove());

  delete (window as Window & { Razorpay?: unknown }).Razorpay;
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

//Notifications helper functions and datas

export const typeConfig: Record<
  NotificationType,
  { icon: string; bgColor: string; textColor: string; label: string }
> = {
  SHIPMENT_CREATED: {
    icon: "fa-box",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
    label: "Created",
  },
  AGENT_ASSIGNED: {
    icon: "fa-user-check",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    label: "Agent Assigned",
  },
  SHIPMENT_IN_TRANSIT: {
    icon: "fa-truck-fast",
    bgColor: "bg-cyan-100",
    textColor: "text-cyan-700",
    label: "In Transit",
  },
  SHIPMENT_DELAYED: {
    icon: "fa-triangle-exclamation",
    bgColor: "bg-amber-100",
    textColor: "text-amber-700",
    label: "Delayed",
  },
  SHIPMENT_DELIVERED: {
    icon: "fa-circle-check",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    label: "Delivered",
  },
  SHIPMENT_COMPLETED: {
    icon: "fa-flag-checkered",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    label: "Completed",
  },
  PAYMENT_UPDATE: {
    icon: "fa-credit-card",
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-700",
    label: "Payment",
  },
};

export const formatNotificationTime = (dateStr: string): string => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const filterOptions: { label: string; value: FilterType }[] = [
  { label: "All", value: "ALL" },
  { label: "Unread", value: "UNREAD" },
  { label: "Created", value: "SHIPMENT_CREATED" },
  { label: "Agent Assigned", value: "AGENT_ASSIGNED" },
  { label: "In Transit", value: "SHIPMENT_IN_TRANSIT" },
  { label: "Delayed", value: "SHIPMENT_DELAYED" },
  { label: "Delivered", value: "SHIPMENT_DELIVERED" },
  { label: "Payment", value: "PAYMENT_UPDATE" },
];

//Timeline Tracking helpers
export const STATUS_STYLE: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  PENDING: { bg: "bg-amber-50", text: "text-amber-800", label: "Pending" },
  CONFIRMED: { bg: "bg-teal-50", text: "text-teal-800", label: "Confirmed" },
  ASSIGNED: { bg: "bg-purple-50", text: "text-purple-800", label: "Assigned" },
  OUT_FOR_PICKUP: {
    bg: "bg-purple-50",
    text: "text-purple-800",
    label: "Out for pickup",
  },
  PICKED_UP: { bg: "bg-teal-50", text: "text-teal-800", label: "Picked up" },
  IN_TRANSIT: { bg: "bg-blue-50", text: "text-blue-800", label: "In transit" },
  OUT_FOR_DELIVERY: {
    bg: "bg-blue-50",
    text: "text-blue-800",
    label: "Out for delivery",
  },
  DELIVERED: { bg: "bg-green-50", text: "text-green-800", label: "Delivered" },
  COMPLETED: { bg: "bg-green-50", text: "text-green-800", label: "Completed" },
  CANCELLED: { bg: "bg-red-50", text: "text-red-800", label: "Cancelled" },
};

export const ACTIVE_STATUSES: string[] = [
  "CONFIRMED",
  "ASSIGNED",
  "OUT_FOR_PICKUP",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
];

export const ORDERED_STATUSES: TimelineStatus[] = [
  "PENDING",
  "CONFIRMED",
  "ASSIGNED",
  "OUT_FOR_PICKUP",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "COMPLETED",
];

export const STATUS_META: Record<
  TimelineStatus,
  {
    label: string;
    bgColor: string;
    textColor: string;
    iconBg: string;
    iconColor: string;
  }
> = {
  PENDING: {
    label: "Pending",
    bgColor: "bg-amber-50",
    textColor: "text-amber-800",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-700",
  },
  CONFIRMED: {
    label: "Confirmed",
    bgColor: "bg-teal-50",
    textColor: "text-teal-800",
    iconBg: "bg-teal-50",
    iconColor: "text-teal-700",
  },
  ASSIGNED: {
    label: "Assigned",
    bgColor: "bg-purple-50",
    textColor: "text-purple-800",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-700",
  },
  OUT_FOR_PICKUP: {
    label: "Out for pickup",
    bgColor: "bg-purple-50",
    textColor: "text-purple-800",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-700",
  },
  PICKED_UP: {
    label: "Picked up",
    bgColor: "bg-teal-50",
    textColor: "text-teal-800",
    iconBg: "bg-teal-50",
    iconColor: "text-teal-700",
  },
  IN_TRANSIT: {
    label: "In transit",
    bgColor: "bg-blue-50",
    textColor: "text-blue-800",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-700",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for delivery",
    bgColor: "bg-blue-50",
    textColor: "text-blue-800",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-700",
  },
  DELIVERED: {
    label: "Delivered",
    bgColor: "bg-green-50",
    textColor: "text-green-800",
    iconBg: "bg-green-50",
    iconColor: "text-green-700",
  },
  COMPLETED: {
    label: "Completed",
    bgColor: "bg-green-50",
    textColor: "text-green-800",
    iconBg: "bg-green-50",
    iconColor: "text-green-700",
  },
  CANCELLED: {
    label: "Cancelled",
    bgColor: "bg-red-50",
    textColor: "text-red-800",
    iconBg: "bg-red-50",
    iconColor: "text-red-700",
  },
  DELAYED: {
    label: "Delayed",
    bgColor: "bg-amber-50",
    textColor: "text-amber-800",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-700",
  },
};

export const ROLE_BADGE: Record<string, string> = {
  admin: "bg-purple-50 text-purple-700",
  customer: "bg-teal-50 text-teal-700",
  agent: "bg-blue-50 text-blue-700",
};

export const STATUS_ICONS: Record<string, IconType> = {
  PENDING: FiClock,
  CONFIRMED: FiCheckCircle,
  ASSIGNED: FiUser,
  OUT_FOR_PICKUP: FiMapPin,
  PICKED_UP: FiPackage,
  IN_TRANSIT: FiTruck,
  OUT_FOR_DELIVERY: FiNavigation,
  DELIVERED: FiHome,
  COMPLETED: FiCheckSquare,
  CANCELLED: FiXCircle,
  DELAYED: FiAlertTriangle,
};

// TimeLine functions
export const isActive = (status: string): boolean => {
  return ACTIVE_STATUSES.includes(status);
};

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getProgressPercent(status: TimelineStatus): number {
  const idx = ORDERED_STATUSES.indexOf(status);
  if (idx < 0) return 0;
  return Math.round((idx / (ORDERED_STATUSES.length - 1)) * 100);
}


export const getRelativeTime = (dateStr: string): string => {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs} hr${diffHrs > 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}