import type { Dispatch, SetStateAction } from "react";
import type { AllShipments } from "../adminShipment/adminTypes";
import type { DeliveryItem } from "../agentShipment/agentTypes";

export interface Address {
  name: string;
  email: string;
  phone: string;
  fullAddress: string;
  city: string;
  pinCode: string;
}

export interface PackageDetailsFormData {
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

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
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
  | "CANCELLED"
  | "DELAYED"
  | "COMPLETED";
  amount: number;
  paymentStatus: PaymentStatus;
  assignedSlotStart: string | null;
  assignedSlotEnd: string | null;
  assignedDate: string | null;
  assignedAgent: AssignedAgent | null;
  createdAt: string;
  updatedAt: string;
  priceBreakdown: PriceBreakdown | null;
}

export interface PriceBreakdown {
  platformFee: number;
  weightCharge: number;
  priorityCharge: number;
  fragileCharge: number;
  subtotal: number;
  gst: number;
  total: number;
}

export interface CreatedShipmentMeta {
  shipmentId: number;
  trackingId: string;
  priceBreakdown: PriceBreakdown;
  packageWeight: number;
  priority: "STANDARD" | "EXPRESS" | "SAME_DAY";
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
  paymentDetails: PaymentDetailsResponse | null;
  pagination: Pagination | null;
  dashboardData: CustomerDashboardData | null;
  dateRange: { from: string; to: string };
  loading: boolean;
  error: string | null;
  // notification state
  notifications: Notification[];
  unreadCount: number;
  notificationPagination: NotificationPagination | null;
  notificationLoading: boolean;
  markAllLoading: boolean;
  markSingleLoading: number | null;
  notificationError: string | null;

  timelineData: ShipmentTimelineResponse | null;
  timelineLoading: boolean;
  timelineError: string | null;

  //for complaints
  raising: boolean;
  raiseError: string | null;
  lastRaisedComplaint: ComplaintResponse | null;

  // My Complaints
  myComplaints: MyComplaint[];
  myComplaintPagination: MyComplaintPagination | null;
  myComplaintsLoading: boolean;
  myComplaintError: string | null;
  activeMyComplaintTab: "ALL" | ComplaintStatus;

  // pricing details
  rates: PricingRates | null;

  //Payment history
  payments: Payment[];

  //Chat
  activeShipmentId: number | null;
  messages: ChatMessage[];
  chatPagination: ChatData['pagination'] | null;
  loadingHistory: boolean;
  sendingMessage: boolean;

  cancelling: boolean;
  cancelError: string | null;
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
  | "CANCELLED"
  | "DELAYED"
  | "COMPLETED";

export type PriorityType = "STANDARD" | "EXPRESS" | "SAME_DAY";
export type FilterTab = "ALL" | ShipmentStatus;
export type SortKey = "newest" | "oldest" | "amount_high" | "amount_low";

// Payment interface and types
export interface InitiatePaymentResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  shipmentId: number;
  paymentId: number;
}

export interface VerifyPaymentPayload {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface VerifyPaymentResponse {
  id: number;
  shipmentId: number;
  customerId: number;
  amount: number;
  paymentStatus: PaymentStatus;
  transactionId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  paidAt: string;
}

export interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface PaymentDetailsResponse {
  id: number;
  shipmentId: number;
  customerId: number;
  transactionId: string;
  amount: number;
  paymentStatus: PaymentStatus;
  paidAt: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  priceBreakdown: PriceBreakdown;
  createdAt: string;
  updatedAt: string;
}

// Components prop interfaces
//shipmentAddress.tsx
export interface ShipmentAddressProps {
  nextStep: () => void;
  pickUpAddress: Address;
  setPickUpAddress: Dispatch<SetStateAction<Address>>;
  deliveryAddress: Address;
  setDeliveryAddress: Dispatch<SetStateAction<Address>>;
}

//PackageDetails.tsx
export interface PackageDetailsProps {
  onNext: () => Promise<void>;
  prevStep: () => void;
  isCreating: boolean;
  isEditing: boolean;
  packageDetails: PackageDetailsFormData;
  setPackageDetails: Dispatch<SetStateAction<PackageDetailsFormData>>;
}

//PriceBreakdownProps
export interface PriceBreakdownProps {
  prevStep: () => void;
  shipmentId: number;
  trackingId: string;
  priceBreakdown: PriceBreakdown;
  packageWeight: number;
  priority: PriorityType;
  onReset: () => void;
}

// Dashboard types
export type SupportChatStatus = "OPEN" | "RESOLVED" | "CLOSED";
export type LastMessageBy = "AGENT" | "BOT" | "CUSTOMER";

export interface ShipmentStatusBreakdown {
  IN_TRANSIT: number;
  DELIVERED: number;
  PENDING: number;
  CANCELLED: number;
}

export interface DashboardRecentShipment {
  shipmentId: number;
  trackingId: string;
  itemName: string;
  shipmentStatus: ShipmentStatus;
  paymentStatus: PaymentStatus;
  deliveryAddress: string;
  deliveryCity: string;
  estimatedDelivery: string | null;
  createdAt: string;
}

export interface DashboardPaymentRecord {
  paymentId: number;
  shipmentId: number;
  amount: number;
  paymentStatus: PaymentStatus;
  paidAt: string | null;
}

export interface DashboardSupportChat {
  chatId: number;
  subject: string;
  lastMessage: string;
  lastMessageBy: LastMessageBy;
  agentName: string | null;
  status: SupportChatStatus;
  unreadCount: number;
  updatedAt: string;
}

export interface MonthlyStatEntry {
  month: string;
  count: number;
}

export interface CustomerDashboardData {
  activeShipments: number;
  totalShipments: number;
  deliveredShipments: number;
  pendingShipments: number;
  pendingPayments: number;
  unreadNotifications: number;
  recentShipments: DashboardRecentShipment[];
  paymentHistory: DashboardPaymentRecord[];
  recentSupportChats: DashboardSupportChat[];
  shipmentStatusBreakdown: ShipmentStatusBreakdown;
  monthlyStats: MonthlyStatEntry[];
}


//Notification Types
export type NotificationType =
  | "SHIPMENT_CREATED"
  | "AGENT_ASSIGNED"
  | "SHIPMENT_IN_TRANSIT"
  | "SHIPMENT_DELAYED"
  | "SHIPMENT_DELIVERED"
  | "SHIPMENT_COMPLETED"
  | "SHIPMENT_CANCELLED"   // new
  | "PAYMENT_UPDATE"
  | "PAYMENT_REFUNDED"     // new
  | "GENERAL"              // new
  | "DELIVERY_OTP"         // new
  | "AGENT_REASSIGNED";     // new

export interface Notification {
  notificationId: number;
  shipmentId: number;
  trackingId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FetchNotificationsResponse {
  unreadCount: number;
  notifications: Notification[];
  pagination: NotificationPagination;
}

export type FilterType = "ALL" | "UNREAD" | NotificationType;

export interface NotificationCardProps {
  notification: Notification;
  onMarkRead: (id: number) => void;
  isMarkingRead: boolean;
}

// Timeline types
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

export interface ShipmentCardProps {
  shipment: ShipmentResponse | AllShipments | DeliveryItem;
  isSelected: boolean;
  onClick: () => void;
}

export interface ShipmentTimelinePanelProps {
  shipment: ShipmentResponse | AllShipments | DeliveryItem;
}


// ComplaintTypes Types
export type ComplaintSubject =
  | "PACKAGE_NOT_DELIVERED"
  | "DAMAGED_PACKAGE"
  | "WRONG_ITEM_DELIVERED"
  | "DELIVERY_DELAYED"
  | "AGENT_BEHAVIOUR"
  | "PARTIAL_DELIVERY"
  | "LOST_PACKAGE"
  | "PAYMENT_ISSUE"
  | "OTHER";

export type ComplaintStatus = "OPEN" | "IN_REVIEW" | "RESOLVED";

export interface RaiseComplaintPayload {
  subject: ComplaintSubject;
  description: string;
}
export interface ComplaintResponse {
  complaintId: number;
  shipmentId: number;
  customerId: number;
  trackingId: string;
  subject: ComplaintSubject;
  description: string;
  status: ComplaintStatus;
  createdAt: string;
}

export interface ComplaintState {
  raising: boolean;
  raiseError: string | null;
  lastRaisedComplaint: ComplaintResponse | null;
}

export interface RaiseComplaintModalProps {
  open: boolean;
  onClose: () => void;
  shipmentId: number;
  trackingId: string;
}

// Subject chip metadata for UI
export interface SubjectMeta {
  value: ComplaintSubject;
  label: string;
  icon: string;
}

export interface MyComplaint {
  complaintId: number;
  shipmentId: number;
  trackingId: string;
  subject: string;
  description: string;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MyComplaintPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FetchMyComplaintsParams {
  page?: number;
  limit?: number;
  status?: ComplaintStatus;
}

export interface WeightSlab {
  upTo: number | null;
  ratePerKg: number;
}

export interface PriorityMultipliers {
  STANDARD: number;
  EXPRESS: number;
  SAME_DAY: number;
}

export interface PricingRates {
  platformFee: number;
  weightSlabs: WeightSlab[];
  priorityMultipliers: PriorityMultipliers;
  fragileSurcharge: number;
  gstPercent: number;
}

export interface Payment {
  id: number;
  shipmentId: number;
  trackingId: string;
  amount: number;
  paymentStatus: PaymentStatus;
  transactionId: string | null;
  paidAt: string | null;
}

export interface PaymentPagination {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}

export interface MyPaymentsResponse {
  payments: Payment[];
  pagination: PaymentPagination;
}

//Chat types
export interface ChatMessage {
  id: number;
  shipmentId: number;
  senderId: number;
  senderName: string;
  senderRole: 'CUSTOMER' | 'DELIVERY_AGENT' | 'ADMIN';
  message: string;
  createdAt: string;
}

export interface ChatPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ChatData {
  shipmentId: number;
  messages: ChatMessage[];
  pagination: ChatPagination;
}

export interface SendMessagePayload {
  shipmentId: number;
  message: string;
}

//customer Dashboard
// export type LastMessageBy = "DELIVERY_AGENT" | "CUSTOMER" | "ADMIN";

export interface DashboardRecentShipment {
  shipmentId: number;
  trackingId: string;
  itemName: string;
  shipmentStatus: ShipmentStatus;
  paymentStatus: PaymentStatus;
  deliveryAddress: string;
  deliveryCity: string;
  createdAt: string;
}

export interface DashboardPaymentRecord {
  paymentId: number;
  shipmentId: number;
  amount: number;
  paymentStatus: PaymentStatus;
  paidAt: string | null;
}

export interface DashboardSupportChat {
  shipmentId: number;
  trackingId: string;
  lastMessage: string;
  lastMessageBy: LastMessageBy;
  updatedAt: string;
}

export interface CustomerDashboardData {
  activeShipments: number;
  totalShipments: number;
  deliveredShipments: number;
  pendingShipments: number;
  pendingPayments: number;
  unreadNotifications: number;
  recentShipments: DashboardRecentShipment[];
  paymentHistory: DashboardPaymentRecord[];
  recentSupportChats: DashboardSupportChat[];
}

//Cancel Shipment Response
export interface CancelShipmentResponse {
  shipmentId: number;
  trackingId: string;
  shipmentStatus: "CANCELLED";
  paymentStatus: "PENDING" | "REFUNDED";
}