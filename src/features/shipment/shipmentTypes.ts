export interface Address {
  name: string;
  phone: string;
  fullAddress: string;
  city: string;
  pinCode: string;
}

export interface PackageDetails {
  itemName: string;
  quantity: string;
  weight: string;
  description: string;
  fragile: boolean;
  priority: "STANDARD" | "EXPRESS" | "SAME_DAY";
  deliveryFrom: string;
  deliveryTo: string;
}

// Matches the actual backend response
export interface AssignedAgent {
  agentId: number;
  agentName: string;
  agentPhone: string;
  agentEmail: string;
  vehicleType: string;
  vehicleNumber: string;
  serviceZone: string;
}

export interface ShipmentResponse {
  shipmentId: number;
  trackingId: string;
  customerId: number;
  itemName: string;
  quantity: number;
  packageWeight: number;
  isFragile: boolean;
  description: string;
  senderName: string;
  senderPhone: string;
  pickupAddress: string;
  pickupCity: string;
  pickupPincode: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPincode: string;
  receiverName: string;
  receiverPhone: string;
  shipmentPriority: "STANDARD" | "EXPRESS" | "SAME_DAY";
  shipmentStatus:
  | "PENDING"
  | "CONFIRMED"
  | "ASSIGNED"
  | "OUT_FOR_PICKUP"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";
  amount: number;
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  assignedSlotStart: string | null;
  assignedSlotEnd: string | null;
  assignedDate: string | null;
  assignedAgent: AssignedAgent | null;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ShipmentState {
  shipments: ShipmentResponse[];
  currentShipment: ShipmentResponse | null;
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
}

export type ShipmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ASSIGNED"
  | "OUT_FOR_PICKUP"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type PriorityType =
  | "STANDARD"
  | "EXPRESS"
  | "SAME_DAY";

export type FilterTab = "ALL" | ShipmentStatus;

export type SortKey =
  | "newest"
  | "oldest"
  | "amount_high"
  | "amount_low";
