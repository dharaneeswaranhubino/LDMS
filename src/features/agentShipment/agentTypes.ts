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
  | "CANCELLED"
  | "DELAYED"
  | "COMPLETED";

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

  timelineData: ShipmentTimelineResponse | null;
  timelineLoading: boolean;
  timelineError: string | null;

  dashboardData: AgentDashboardData | null;
  dashboardLoading: boolean;
  dashboardError: string | null;
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
  onDelivered: () => void;

  onOtpVerified: (value: boolean) => void;
}

//UpdateStatus Modal Props
export interface UpdateStatusModalProps {
  onClose: () => void;
  currentStatus: ShipmentStatus;
  onUpdate: (nextStatus: ShipmentStatus) => void;
  shipmentId: number;

  assignedSlotStart: string;
  assignedSlotEnd: string;
}

//Delivery Details Modal props interface
export interface DeliveryDetailsModalProps {
  setIsView: (value: boolean) => void;
  item: DeliveryItem;
  getStatusColor: () => string;
  getPriorityColor: () => string;
}

interface Delivery {
  trackingId: string;
  receiverName: string;
  deliveryAddress: string;
  deliveryCity: string;
  assignedSlotStart: string;
  assignedSlotEnd: string;
}
export interface DeliveryDetailHeaderProps {
  data?: Delivery;
}

export interface DetailRowProps {
  label: string;
  value: string;
}

export interface InfoBlockProps {
  label: string;
  value: string | number | undefined;
  success?: boolean;
}

export interface ProofOfDeliveryProps {
  currentStatus: string;
  otpVerified: boolean;
  setOtpVerified: (value: boolean) => void;
}

interface receiverDetails {
  receiverName: string;
  receiverPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPincode: string;
}
export interface ReceiverDetailCard {
  data: receiverDetails;
}

//Time Line
export type TimelineStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ASSIGNED"
  | "OUT_FOR_PICKUP"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "COMPLETED"
  | "DELAYED";

export interface TimelineUpdatedBy {
  id: number;
  name: string;
  role: "admin" | "customer" | "agent";
}

export interface TimelineEntry {
  id: number;
  fromStatus: TimelineStatus | null;
  toStatus: TimelineStatus;
  remarks: string | null;
  updatedAt: string;
  updatedBy: TimelineUpdatedBy;
}

export interface ShipmentTimelineResponse {
  shipmentId: number;
  trackingId: string;
  currentStatus: TimelineStatus;
  timeline: TimelineEntry[];
}

// Agent Dashboard
export interface CustomerMessage {
  shipmentId: number;
  trackingId: string;
  customerName: string;
  message: string;
  sentAt: string;
}

export interface AgentDashboardData {
  isActive: boolean;
  assignedDeliveries: number;
  activeShipments: number;
  completedDeliveries: number;
  pendingAssignments: number;
  todaysSchedule: AgentScheduleSlot[];
  customerMessages: CustomerMessage[];
}

export interface AgentScheduleSlot {
  shipmentId?: number;
  trackingId?: string;
  receiverName?: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  slotStart?: string;
  slotEnd?: string;
  slotDate?: string;
  shipmentStatus?: ShipmentStatus;
}

