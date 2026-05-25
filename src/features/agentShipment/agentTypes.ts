export interface StatusUpdate {
  status: string;
  remarks?: string;
}
export interface UpdateTrackStatus {
  id: string;
  data: StatusUpdate;
}
export interface AgentState {
//   shipments: AgentResponse[];
  loading: boolean;
  error: string | null;
}

export type ShipmentPriority = "SAME_DAY" | "EXPRESS" | "STANDARD";

export type ShipmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED";

export interface DeliveryItem {
  id: number;
  trackingId: string;
  customerId: number;
  customerName: string;
  customerPhone: string;
  itemName: string;
  quantity:number;
  packageWeight: number;
  isFragile: boolean;
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

export interface AgentState {
  deliveries: DeliveryItem[];
  loading: boolean;
  error: string | null;

  search: string;
  priorityFilter: string;
  activeTab: string;

  currentPage: number;
  itemsPerPage: number;
}