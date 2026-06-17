import type { ReactNode } from "react";

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

export type ShipmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ASSIGNED"
  | "OUT_FOR_PICKUP"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELAYED"
  | "DELIVERED"
  | "CANCELLED"
  | "DELAYED";

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

export interface DeliveryAgent {
  id: number;
  phoneNumber: string;
  vehicleType: string;
  shipmentCount?: number;
  totalDeliveries?: number;
  availabilityStatus: "AVAILABLE" | "UNAVAILABLE";
  isActive: boolean;
  serviceZone: string;
  createdAt: string;
  deliveredCount: number;
  delayedCount: number;
  agentId: number;
  agentName: string;
  agentEmail: string;
}

//Agent Details Modal props
export interface AgentDetailsModalProps {
  setSelectedAgent: (agent: DeliveryAgent | null) => void;
  selectedAgent: DeliveryAgent;
}

//Dashboard Types
export interface PaymentSummary {
  paid: number;
  pending: number;
  failed: number;
}

export interface AgentPerformance {
  agentId: number;
  agentName: string;
  totalDeliveries: number;
  activeShipments: number;
  completedShipments: number;
}

export interface RecentShipment {
  shipmentId: number;
  trackingId: string;
  customerName: string;
  shipmentStatus: ShipmentStatus;
  isDelayed: boolean;
  paymentStatus: "PAID" | "PENDING" | "FAILED";
  createdAt: string;
}

// export type ComplaintStatus = "OPEN" | "RESOLVED" | "IN_REVIEW";

export interface DashboardComplaint {
  complaintId: number;
  trackingId: string;
  customerName: string;
  message: string;
  status: ComplaintStatus;
  shipmentStatus: ShipmentStatus;
  isDelayed: boolean;
  resolvedAt: string | null;
  createdAt: string;
}

export type RevenueTab = "Daily" | "Weekly" | "Monthly";
export type GroupBy = "daily" | "weekly" | "monthly";

export interface RevenueDataPoint {
  period: string;
  revenue: number;
}

export interface AdminDashboardData {
  totalShipments: number;
  deliveredShipments: number;
  activeDeliveries: number;
  pendingShipments: number;
  delayedShipments: number;
  totalRevenue: number;
  revenueChangePercent: number | null;
  paymentSummary: PaymentSummary;
  agentPerformance: AgentPerformance[];
  recentShipments: RecentShipment[];
  complaints: DashboardComplaint[];
  revenueStats: RevenueDataPoint[];
}

export interface DashboardDateParams {
  fromDate: string;
  toDate: string;
  groupBy: GroupBy;
}

export interface AdminState {
  shipments: AgentFormData[];
  agents: DeliveryAgent[];
  dashboard: AdminDashboardData | null;
  dashboardLoading: boolean;
  activeRevenueTab: RevenueTab;

  allShipments: AllShipments[];
  shipmentPagination: ShipmentPagination | null;
  shipmentsLoading: boolean;

  loading: boolean;
  error: string | null;

  timelineData: ShipmentTimelineResponse | null;
  timelineLoading: boolean;
  timelineError: string | null;

  complaints: AdminComplaint[];
  complaintPagination: ComplaintPagination | null;
  complaintsLoading: boolean;
  complaintUpdateLoading: boolean;
  activeComplaintTab: "ALL" | ComplaintStatus;
  selectedComplaint: AdminComplaint | null;
  complaintError: string | null;

  reassignLoading: boolean;
  reassignSuccess: boolean;
  reassignResult: ReassignResponse | null;
  reassignError: string | null;

  // Admin chat history
  chatHistory: ChatMessage[];
  chatHistoryShipmentInfo: ChatHistoryShipmentInfo | null;
  chatHistoryPagination: ChatPagination | null;
  chatHistoryLoading: boolean;
  chatHistoryError: string | null;
}

export interface StatCardProps {
  icon: ReactNode | string;
  value: number;
  label: string;
  iconBg: string;
  accent: string;
}

export interface DashboardHeaderProps {
  fromDate: string;
  toDate: string;
  onApply: (from: string, to: string) => void;
}

export interface StatsProps {
  totalShipments: number;
  deliveredShipments: number;
  activeDeliveries: number;
  delayedShipments: number;
  pendingShipments: number;
}

export interface RevenueChartProps {
  totalRevenue: number;
  revenueChangePercent: number | null;
  revenueStats: RevenueDataPoint[];
  activeTab: RevenueTab;
  onTabChange: (tab: RevenueTab) => void;
}

export interface PaymentChartProps {
  paid: number;
  pending: number;
  failed: number;
}

export interface AgentPerformanceTableProps {
  agentPerformance: AgentPerformance[];
}

export interface RecentShipmentsTableProps {
  recentShipments: RecentShipment[];
}

export interface CustomerComplaintsProps {
  complaints: DashboardComplaint[];
}


// All Shipments
export interface AllShipmentCustomer {
  customerId: number;
  name: string;
  email: string;
  phoneNumber: string | null;
}

export interface AllShipmentAgent {
  agentId: number;
  name: string;
  email: string;
  phoneNumber: string | null;
  vehicleType: string;
  vehicleNumber: string;
  serviceZone: string;
}

export interface AllShipments {
  shipmentId: number;
  trackingId: string;
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
  shipmentPriority: Priority;
  shipmentStatus: ShipmentStatus;
  amount: number;
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  customer: AllShipmentCustomer;
  assignedAgent: AllShipmentAgent | null;
  assignedSlotStart: string | null;
  assignedSlotEnd: string | null;
  assignedDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AllShipmentsResponse {
  shipments: AllShipments[];
  pagination: ShipmentPagination;
}

export interface AdminShipmentTabsProps {
  activeTab: FilterTab;
  tabCounts: Record<string, number>;
  onTabChange: (tab: FilterTab) => void;
}

export interface AdminShipmentTableRowProps {
  shipment: AllShipments;
  onView: (shipment: AllShipments) => void;
  onComplete: (shipment: AllShipments) => void;
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

//Complaint Types
export interface ComplaintCustomer {
  customerId: number;
  name: string;
  email: string;
}

export interface ComplaintAgent {
  agentId: number;
  name: string;
  email: string;
  phoneNumber: string;
  vehicleType: string;
  serviceZone: string;
}

export type ComplaintStatus = "OPEN" | "IN_REVIEW" | "RESOLVED";

export type ComplaintSubject =
  | "PACKAGE_NOT_DELIVERED"
  | "DAMAGED_PACKAGE"
  | "DELAYED_DELIVERY"
  | "WRONG_ITEM"
  | "OTHER";

export interface AdminComplaint {
  complaintId: number;
  shipmentId: number;
  trackingId: string;
  subject: ComplaintSubject;
  description: string;
  status: ComplaintStatus;
  customer: ComplaintCustomer;
  assignedAgent: ComplaintAgent | null;
  createdAt: string;
  updatedAt: string;
}

export interface ComplaintPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FetchComplaintsParams {
  page?: number;
  limit?: number;
  status?: ComplaintStatus;
}

export interface UpdateComplaintStatusResponse {
  complaintId: number;
  shipmentId: number;
  trackingId: string;
  subject: string;
  previousStatus: ComplaintStatus;
  currentStatus: ComplaintStatus;
  updatedAt: string;
}

export interface ComplaintFiltersProps {
  activeTab: "ALL" | ComplaintStatus;
  pagination: ComplaintPagination;
  onTabChange: (tab: "ALL" | ComplaintStatus) => void;
}

export interface ComplaintTableProps {
  complaints: AdminComplaint[];
  complaintsLoading: boolean;
}

//Admin slot reassign
export interface ReassignSlot {
  date: string;
  startTime: string;
  endTime: string;
}

export interface ReassignResponse {
  shipmentId: number;
  previousAgentId: number | null;
  newAgentId: number;
  newSlotId: number;
  newSlot: ReassignSlot;
  shipmentStatus: ShipmentStatus;
  message: string;
}

// Chat History Types
export interface ChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  senderRole: "CUSTOMER" | "DELIVERY_AGENT" | "ADMIN";
  message: string;
  createdAt: string;
}

export interface ChatHistoryShipmentInfo {
  shipmentId: number;
  shipmentStatus: string;
  customer: { id: number; name: string };
  assignedAgent: { id: number; name: string };
}

export interface ChatPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}