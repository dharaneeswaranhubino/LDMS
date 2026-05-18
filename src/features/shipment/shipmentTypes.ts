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
export interface ShipmentResponse {
  id?: number;
  itemName: string;
  quantity: number;
  packageWeight: number;
  description: string;
  isFragile: boolean;
  senderName: string;
  senderPhone: string;
  pickupAddress: string;
  pickupCity: string;
  pickupPincode: string;
  receiverName: string;
  receiverPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPincode: string;
  preferredDeliveryFrom: string | null;
  preferredDeliveryTo: string | null;
  shipmentPriority: "STANDARD" | "EXPRESS" | "SAME_DAY";
  customerId: number;
  trackingId?: string;
  amount?: number;
  paymentStatus?: string;
  shipmentStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShipmentState {
  shipments: ShipmentResponse[];
  currentShipment: ShipmentResponse | null;
  loading: boolean;
  error: string | null;
}

export type ShipmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type PriorityType = "STANDARD" | "EXPRESS" | "SAME_DAY";

export type FilterTab = "ALL" | ShipmentStatus;

export type SortKey = "newest" | "oldest" | "amount_high" | "amount_low";