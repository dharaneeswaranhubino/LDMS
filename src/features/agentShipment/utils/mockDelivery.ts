import type { DeliveryItem } from "../agentTypes";

export const DELIVERY_STATUS = {
  ASSIGNED: "ASSIGNED",
  PICKED_UP: "PICKED_UP",
  IN_TRANSIT: "IN_TRANSIT",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
};

export const deliveryMock = {
  shipmentId: 1,
  trackingId: "TRK-001-XYZ",
  currentStatus: DELIVERY_STATUS.IN_TRANSIT,
  timeline: [
    {
      key: DELIVERY_STATUS.ASSIGNED,
      label: "Assigned",
      description: "Delivery assigned to agent",
    },
    {
      key: DELIVERY_STATUS.PICKED_UP,
      label: "Picked Up",
      description: "Package collected from sender",
    },
    {
      key: DELIVERY_STATUS.IN_TRANSIT,
      label: "In Transit",
      description: "Heading to delivery location",
    },
    {
      key: DELIVERY_STATUS.OUT_FOR_DELIVERY,
      label: "Out for Delivery",
      description: "Last mile delivery started",
    },
    {
      key: DELIVERY_STATUS.DELIVERED,
      label: "Delivered",
      description: "Package delivered successfully",
    },
  ],
};


export const formatDate = (iso: string) => {
  if (!iso) return "—";

  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};