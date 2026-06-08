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