export interface AgentFormData {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword?: string | undefined;
  vehicleType: string;
  vehicleNumber: string;
  licenseNumber: string;
  serviceZone: string;
}

export interface AgentDetailsState {
  shipments: AgentFormData[];
  loading: boolean;
  error: string | null;
}

export type ShipmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELAYED"
  | "DELIVERED"
  | "CANCELLED";

export type Priority = "STANDARD" | "EXPRESS" | "SAME_DAY";

export interface Shipment {
  id: number;
  trackingId: string;
  customerName: string;
  customerPhone: string;
  itemName: string;
  packageWeight: number;
  pickupCity: string;
  deliveryCity: string;
  shipmentPriority: Priority;
  shipmentStatus: ShipmentStatus;
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  amount: number;
  isFragile: boolean;
  assignedAgentName: string | null;
  assignedSlot: string | null;
  createdAt: string;
}

export interface Agent {
  id: number;
  name: string;
  todayCount: number;
  status: "available" | "busy";
}

export type FilterTab = "ALL" | ShipmentStatus;

export type SortKey = "newest" | "oldest" | "amount_high" | "amount_low";