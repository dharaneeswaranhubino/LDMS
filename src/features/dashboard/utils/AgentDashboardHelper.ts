import type { ShipmentStatus } from "../../agentShipment/agentTypes";

export const ALL_SLOTS = [
  { start: "09:00 AM", end: "10:00 AM" },
  { start: "10:00 AM", end: "11:00 AM" },
  { start: "11:00 AM", end: "12:00 PM" },
  { start: "12:00 PM", end: "01:00 PM" },
  { start: "02:00 PM", end: "03:00 PM" },
  { start: "03:00 PM", end: "04:00 PM" },
  { start: "04:00 PM", end: "05:00 PM" },
  { start: "05:00 PM", end: "06:00 PM" },
];

export const STATUS_CONFIG: Record<
  ShipmentStatus,
  {
    label: string;
    style: string;
    icon: string;
  }
> = {
  PENDING: {
    label: "Pending",
    style: "bg-gray-100 text-gray-700 border-gray-200",
    icon: "fa-clock",
  },

  CONFIRMED: {
    label: "Confirmed",
    style: "bg-purple-100 text-purple-700 border-purple-200",
    icon: "fa-circle-check",
  },

  ASSIGNED: {
    label: "Assigned",
    style: "bg-cyan-100 text-cyan-700 border-cyan-200",
    icon: "fa-user",
  },

  OUT_FOR_PICKUP: {
    label: "Pickup",
    style: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: "fa-box",
  },

  PICKED_UP: {
    label: "Picked Up",
    style: "bg-blue-100 text-blue-700 border-blue-200",
    icon: "fa-truck",
  },

  IN_TRANSIT: {
    label: "In Transit",
    style: "bg-blue-100 text-blue-700 border-blue-200",
    icon: "fa-truck",
  },

  OUT_FOR_DELIVERY: {
    label: "Delivery",
    style: "bg-indigo-100 text-indigo-700 border-indigo-200",
    icon: "fa-location-dot",
  },

  DELIVERED: {
    label: "Delivered",
    style: "bg-green-100 text-green-700 border-green-200",
    icon: "fa-circle-check",
  },

  CANCELLED: {
    label: "Cancelled",
    style: "bg-red-100 text-red-700 border-red-200",
    icon: "fa-xmark",
  },

  DELAYED: {
    label: "Delayed",
    style: "bg-orange-100 text-orange-700 border-orange-200",
    icon: "fa-triangle-exclamation",
  },
};

export const isActive = (status: ShipmentStatus): boolean =>
  [
    "OUT_FOR_PICKUP",
    "PICKED_UP",
    "IN_TRANSIT",
    "OUT_FOR_DELIVERY",
    "DELAYED",
  ].includes(status);

export const isDone = (status: ShipmentStatus): boolean =>
  status === "DELIVERED";

export const getGreeting = (): string => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";

  return "Good evening";
};

export const today = new Date().toLocaleDateString("en-IN", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});