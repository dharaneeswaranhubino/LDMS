import type { ShipmentStatus } from "../agentTypes";

export const statusOrder: ShipmentStatus[] = [
  "ASSIGNED",
  "OUT_FOR_PICKUP",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

export const getStatusState = (
  currentStatus: ShipmentStatus,
  itemStatus: ShipmentStatus,
) => {
  const currentIndex = statusOrder.indexOf(currentStatus);
  const itemIndex = statusOrder.indexOf(itemStatus);

  return {
    done: itemIndex < currentIndex,
    active: itemIndex === currentIndex,
    pending: itemIndex > currentIndex,
    nextPending: itemIndex === currentIndex + 1,
  };
};


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

export const formatSlot = (time: string): string => {
  if (!time) return "";
  const [h, m] = time.split(":");
  const d = new Date();
  d.setHours(Number(h), Number(m));
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const STATUS_BADGE: Record<
  ShipmentStatus,
  { label: string; bg: string; color: string; dot: string }
> = {
  ASSIGNED: { label: "Assigned", bg: "#EEF2FF", color: "#4338ca", dot: "#818cf8" },
  OUT_FOR_PICKUP: { label: "Out for pickup", bg: "#FEF3C7", color: "#92400E", dot: "#fbbf24" },
  PICKED_UP: { label: "Picked up", bg: "#E0F2FE", color: "#0C4A6E", dot: "#38bdf8" },
  IN_TRANSIT: { label: "In transit", bg: "#F0FDF4", color: "#14532D", dot: "#4ade80" },
  OUT_FOR_DELIVERY: { label: "Out for delivery", bg: "#FDF4FF", color: "#6B21A8", dot: "#c084fc" },
  DELIVERED: { label: "Delivered", bg: "#F0FDF4", color: "#166534", dot: "#4ade80" },
  PENDING: { label: "Pending", bg: "#F8FAFC", color: "#64748b", dot: "#94a3b8" },
  CONFIRMED: { label: "Confirmed", bg: "#F0FDF4", color: "#14532D", dot: "#4ade80" },
  CANCELLED: { label: "Cancelled", bg: "#FEF2F2", color: "#991B1B", dot: "#f87171" },
  DELAYED: { label: "Delayed", bg: "#FFF7ED", color: "#9A3412", dot: "#fb923c" },
};


const getCurrentHourIST = (): number => {
  const time = new Date().toLocaleTimeString("en-GB", {
    timeZone: "Asia/Kolkata",
    hour12: false,
  });
  return Number(time.split(":")[0]);
};

export const isWithinDeliverySlot = (slotStart: string, slotEnd: string): boolean => {
  const currentHour = getCurrentHourIST();
  const startHour = Number(slotStart.slice(0, 2));
  const endHour = Number(slotEnd.slice(0, 2));
  return currentHour >= startHour && currentHour < endHour;
};


export interface DeliveryDetailHeaderProps {
  data: {
    trackingId: string;
    receiverName: string;
    deliveryAddress: string;
    deliveryCity: string;
    assignedSlotStart: string;
    assignedSlotEnd: string;
  };
  currentStatus: ShipmentStatus;
}

export const STATUS_CONFIG: Record<
  ShipmentStatus,
  {
    title: string;
    subtitle: string;
    badgeLabel: string;
    badgeBg: string;
    badgeColor: string;
    icon: string;
  }
> = {
  ASSIGNED: {
    title: "Awaiting pickup",
    subtitle: "Package has been assigned to you",
    badgeLabel: "Assigned",
    badgeBg: "#EEF2FF",
    badgeColor: "#4338ca",
    icon: "fa-solid fa-box",
  },
  OUT_FOR_PICKUP: {
    title: "Heading to pickup location",
    subtitle: "En route to sender address",
    badgeLabel: "Out for pickup",
    badgeBg: "#FEF3C7",
    badgeColor: "#92400E",
    icon: "fa-solid fa-truck",
  },
  PICKED_UP: {
    title: "Package collected",
    subtitle: "Package picked up from sender",
    badgeLabel: "Picked up",
    badgeBg: "#E0F2FE",
    badgeColor: "#0C4A6E",
    icon: "fa-solid fa-box-archive",
  },
  IN_TRANSIT: {
    title: "Package in transit",
    subtitle: "On the way to delivery location",
    badgeLabel: "In transit",
    badgeBg: "#F0FDF4",
    badgeColor: "#14532D",
    icon: "fa-solid fa-truck-fast",
  },
  OUT_FOR_DELIVERY: {
    title: "En route to delivery location",
    subtitle: "Package picked up — heading to customer address",
    badgeLabel: "Out for delivery",
    badgeBg: "#FDF4FF",
    badgeColor: "#6B21A8",
    icon: "fa-solid fa-motorcycle",
  },
  DELIVERED: {
    title: "Package delivered",
    subtitle: "Successfully handed to receiver",
    badgeLabel: "Delivered",
    badgeBg: "#F0FDF4",
    badgeColor: "#166534",
    icon: "fa-solid fa-circle-check",
  },
  PENDING: {
    title: "Pending confirmation",
    subtitle: "Waiting for order confirmation",
    badgeLabel: "Pending",
    badgeBg: "#F8FAFC",
    badgeColor: "#64748b",
    icon: "fa-solid fa-clock",
  },
  CONFIRMED: {
    title: "Order confirmed",
    subtitle: "Shipment has been confirmed",
    badgeLabel: "Confirmed",
    badgeBg: "#F0FDF4",
    badgeColor: "#14532D",
    icon: "fa-solid fa-circle-check",
  },
  CANCELLED: {
    title: "Shipment cancelled",
    subtitle: "This shipment has been cancelled",
    badgeLabel: "Cancelled",
    badgeBg: "#FEF2F2",
    badgeColor: "#991B1B",
    icon: "fa-solid fa-circle-xmark",
  },
  DELAYED: {
    title: "Shipment delayed",
    subtitle: "Delivery is running behind schedule",
    badgeLabel: "Delayed",
    badgeBg: "#FFF7ED",
    badgeColor: "#9A3412",
    icon: "fa-solid fa-triangle-exclamation",
  },
};

// const formatSlot = (time: string): string => {
//   if (!time) return "";
//   const [h, m] = time.split(":");
//   const d = new Date();
//   d.setHours(Number(h), Number(m));
//   return d.toLocaleTimeString("en-IN", {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   });
// };
