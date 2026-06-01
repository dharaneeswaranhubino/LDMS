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