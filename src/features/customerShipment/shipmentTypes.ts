import type { Dispatch, SetStateAction } from "react";

export interface Address {
  name: string;
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
  paymentStatus: "PAID" | "FAILED" | "PENDING";
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
  paymentStatus: "PAID" | "FAILED" | "PENDING";
  paidAt: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
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
  nextStep: () => void;
  prevStep: () => void;
  packageDetails: PackageDetailsFormData;
  setPackageDetails: Dispatch<SetStateAction<PackageDetailsFormData>>;
}

//PriceBreakdownProps
export interface PriceBreakdownProps {
  prevStep: () => void;
  packageDetails: PackageDetailsFormData;
  pickUpAddress: Address;
  deliveryAddress: Address;
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
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  deliveryAddress: string;
  deliveryCity: string;
  estimatedDelivery: string | null;
  createdAt: string;
}

export interface DashboardPaymentRecord {
  paymentId: number;
  shipmentId: number;
  amount: number;
  paymentStatus: "PENDING" | "PAID" | "FAILED";
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
  | "PAYMENT_UPDATE";

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