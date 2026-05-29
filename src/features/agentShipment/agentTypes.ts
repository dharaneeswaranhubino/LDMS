export interface StatusUpdate {
  status: string;
  remarks?: string;
}

export interface UpdateTrackStatus {
  id: string;
  data: StatusUpdate;
}

export interface AgentState {
  deliveries: DeliveryItem[];
  statusState: Partial<DeliveryItem> | null;
  loading: boolean;
  error: string | null;
  search: string;
  priorityFilter: string;
  activeTab: string;
  currentPage: number;
  itemsPerPage: number;
}

export type ShipmentPriority =
  | "SAME_DAY"
  | "EXPRESS"
  | "STANDARD";

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

export interface DeliveryItem {
  shipmentId: number;
  trackingId: string;
  customerId: number;
  itemName: string;
  quantity: number;
  packageWeight: number;
  isFragile: boolean;
  senderName: string;
  senderPhone: string;
  description: string;
  pickupAddress: string;
  pickupCity: string;
  pickupPincode: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPincode: string;
  receiverName: string;
  receiverPhone: string;
  shipmentPriority: ShipmentPriority;
  shipmentStatus: ShipmentStatus;
  amount: number;
  paymentStatus: string;
  assignedSlotStart: string;
  assignedSlotEnd: string;
  assignedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveriesResponse {
  success: boolean;
  message: string;
  data: DeliveryItem[];
}
