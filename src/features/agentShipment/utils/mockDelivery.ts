import type { ShipmentStatus } from "../agentTypes";

export const formatDate = (iso: string) => {
  if (!iso) return "—";

  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const DELIVERY_STATUS = {
  ASSIGNED: "ASSIGNED",
  OUT_FOR_PICKUP: "OUT_FOR_PICKUP",
  PICKED_UP: "PICKED_UP",
  IN_TRANSIT: "IN_TRANSIT",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
};

export const deliveryMock: {
  shipmentId: number;
  trackingId: string;
  timeline: { key: ShipmentStatus; label: string; description: string }[];
} = {
  shipmentId: 1,
  trackingId: "TRK-001-XYZ",
  timeline: [
    {
      key: "ASSIGNED",
      label: "Assigned",
      description: "Delivery assigned to agent",
    },
    {
      key: "OUT_FOR_PICKUP",
      label: "Out for Pickup",
      description: "Agent is heading to pickup location",
    },
    {
      key: "PICKED_UP",
      label: "Picked Up",
      description: "Package collected from sender",
    },
    {
      key: "IN_TRANSIT",
      label: "In Transit",
      description: "Package is on the way",
    },
    {
      key: "OUT_FOR_DELIVERY",
      label: "Out for Delivery",
      description: "Last mile delivery started",
    },
    {
      key: "DELIVERED",
      label: "Delivered",
      description: "Package delivered successfully",
    },
  ],
};
