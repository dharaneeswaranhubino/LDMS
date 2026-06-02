export interface StatusUpdate {
  status: string;
  remarks?: string;
}

export interface UpdateTrackStatus {
  id: string;
  data: StatusUpdate;
}

export type ShipmentPriority = "SAME_DAY" | "EXPRESS" | "STANDARD";

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
  availability: AgentAvailability;
  availabilityLoading: boolean;
  statusUpdateLoading: boolean;
}

export interface DeliveriesResponse {
  success: boolean;
  message: string;
  data: DeliveryItem[];
}

export type AgentAvailability = "AVAILABLE" | "UNAVAILABLE" | null;

export interface ToggleAvailabilityResponse {
  agentId: number;
  previousStatus: AgentAvailability;
  currentStatus: AgentAvailability;
  message: string;
}

//shipment details screen props interface
interface ShipmentDetails {
  isFragile: boolean;
  shipmentPriority: string;
  trackingId: string;
  pickupAddress: string;
  pickupCity: string;
  pickupPincode: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPincode: string;
  itemName: string;
  packageWeight: number;
  amount: number;
  paymentStatus: string;
  description: string;
}

export interface ShipmentDetailsProps {
  data?: ShipmentDetails;
}

//Delivery Checkpoints screen props interface
export interface DeliveryCheckpointsProps {
  data: DeliveryItem;
  otpVerified: boolean;
}

// agentTypes.ts
export interface UpdateStatusModalProps {
  onClose: () => void;
  currentStatus: ShipmentStatus;
  onUpdate: (nextStatus: ShipmentStatus) => void;  // string → ShipmentStatus
  shipmentId: number;
}

//Delivery Details Modal props interface
export interface DeliveryDetailsModalProps {
  setIsView: (value: boolean) => void;
  item: DeliveryItem;
  getStatusColor: () => string;
  getPriorityColor: () => string;
}