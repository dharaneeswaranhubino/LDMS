import type { Agent, ComplaintStatus, FilterTab, Priority, Shipment, ShipmentStatus } from "../adminTypes";

export const MOCK_AGENTS: Agent[] = [
  { id: 1, name: "Rajesh Kumar", todayCount: 5, status: "busy" },
  { id: 2, name: "Meera Singh", todayCount: 2, status: "available" },
  { id: 3, name: "Suresh P", todayCount: 1, status: "available" },
  { id: 4, name: "Arjun K", todayCount: 7, status: "busy" },
  { id: 5, name: "Priya D", todayCount: 0, status: "available" },
];


export const MOCK_SHIPMENTS: Shipment[] = [
  {
    id: 1, trackingId: "TRK-001-A1B2C3",
    customerName: "John Doe", customerPhone: "+91 98765 43210",
    itemName: "Laptop", packageWeight: 2.5,
    pickupCity: "MG Road", deliveryCity: "Indiranagar",
    shipmentPriority: "SAME_DAY", shipmentStatus: "IN_TRANSIT",
    paymentStatus: "PAID", amount: 620, isFragile: true,
    assignedAgentName: "Rajesh Kumar", assignedSlot: "10:00–11:00 AM",
    createdAt: "2026-05-16T09:00:00.000Z",
  },
  {
    id: 2, trackingId: "TRK-002-D3E4F5",
    customerName: "Maya S", customerPhone: "+91 87654 32109",
    itemName: "Clothes", packageWeight: 1.2,
    pickupCity: "Koramangala", deliveryCity: "Whitefield",
    shipmentPriority: "EXPRESS", shipmentStatus: "DELAYED",
    paymentStatus: "PAID", amount: 380, isFragile: false,
    assignedAgentName: "Meera Singh", assignedSlot: "09:00–10:00 AM",
    createdAt: "2026-05-15T08:00:00.000Z",
  },
  {
    id: 3, trackingId: "TRK-003-G6H7I8",
    customerName: "Ravi P", customerPhone: "+91 76543 21098",
    itemName: "Books", packageWeight: 3.0,
    pickupCity: "BTM Layout", deliveryCity: "HSR Layout",
    shipmentPriority: "STANDARD", shipmentStatus: "PENDING",
    paymentStatus: "PENDING", amount: 210, isFragile: false,
    assignedAgentName: null, assignedSlot: null,
    createdAt: "2026-05-16T11:00:00.000Z",
  },
  {
    id: 4, trackingId: "TRK-004-J9K0L1",
    customerName: "Anita K", customerPhone: "+91 65432 10987",
    itemName: "Mobile Phone", packageWeight: 0.5,
    pickupCity: "Jayanagar", deliveryCity: "Marathahalli",
    shipmentPriority: "SAME_DAY", shipmentStatus: "CONFIRMED",
    paymentStatus: "PAID", amount: 890, isFragile: true,
    assignedAgentName: "Suresh P", assignedSlot: "02:00–03:00 PM",
    createdAt: "2026-05-16T08:30:00.000Z",
  },
  {
    id: 5, trackingId: "TRK-005-M2N3O4",
    customerName: "Suresh K", customerPhone: "+91 54321 09876",
    itemName: "Documents", packageWeight: 0.3,
    pickupCity: "MG Road", deliveryCity: "Electronic City",
    shipmentPriority: "EXPRESS", shipmentStatus: "DELIVERED",
    paymentStatus: "PAID", amount: 560, isFragile: false,
    assignedAgentName: "Arjun K", assignedSlot: "11:00–12:00 PM",
    createdAt: "2026-05-14T10:00:00.000Z",
  },
  {
    id: 6, trackingId: "TRK-006-P5Q6R7",
    customerName: "Priya G", customerPhone: "+91 43210 98765",
    itemName: "Saree", packageWeight: 0.8,
    pickupCity: "Yelahanka", deliveryCity: "Hebbal",
    shipmentPriority: "STANDARD", shipmentStatus: "CANCELLED",
    paymentStatus: "FAILED", amount: 290, isFragile: false,
    assignedAgentName: null, assignedSlot: null,
    createdAt: "2026-05-13T14:00:00.000Z",
  },
  {
    id: 7, trackingId: "TRK-007-S8T9U0",
    customerName: "Vijay N", customerPhone: "+91 32109 87654",
    itemName: "Glass Items", packageWeight: 4.0,
    pickupCity: "Indiranagar", deliveryCity: "Sarjapur",
    shipmentPriority: "EXPRESS", shipmentStatus: "DELAYED",
    paymentStatus: "PAID", amount: 740, isFragile: true,
    assignedAgentName: "Priya D", assignedSlot: "01:00–02:00 PM",
    createdAt: "2026-05-15T13:00:00.000Z",
  },
  {
    id: 8, trackingId: "TRK-008-V1W2X3",
    customerName: "Deepa M", customerPhone: "+91 21098 76543",
    itemName: "Shoes", packageWeight: 1.5,
    pickupCity: "Whitefield", deliveryCity: "Koramangala",
    shipmentPriority: "STANDARD", shipmentStatus: "OUT_FOR_DELIVERY",
    paymentStatus: "PAID", amount: 330, isFragile: false,
    assignedAgentName: "Rajesh Kumar", assignedSlot: "03:00–04:00 PM",
    createdAt: "2026-05-16T07:00:00.000Z",
  },
];

export const STATUS_STYLE: Record<ShipmentStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-100 text-blue-700 border-blue-200",
  ASSIGNED: "bg-blue-100 text-blue-700 border-blue-200",
  OUT_FOR_PICKUP: "bg-blue-100 text-blue-700 border-blue-200",
  PICKED_UP: "bg-sky-100 text-sky-700 border-sky-200",
  IN_TRANSIT: "bg-indigo-100 text-indigo-700 border-indigo-200",
  OUT_FOR_DELIVERY: "bg-violet-100 text-violet-700 border-violet-200",
  DELAYED: "bg-orange-100 text-orange-700 border-orange-200",
  DELIVERED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

export const STATUS_LABEL: Record<ShipmentStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  ASSIGNED: "Assigned",
  OUT_FOR_PICKUP: "Out for Pickup",
  PICKED_UP: "Picked up",
  IN_TRANSIT: "In transit",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELAYED: "Delayed",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const PRIORITY_STYLE: Record<Priority, string> = {
  STANDARD: "bg-slate-100 text-slate-600 border-slate-200",
  EXPRESS: "bg-orange-100 text-orange-600 border-orange-200",
  SAME_DAY: "bg-rose-100 text-rose-600 border-rose-200",
};


export const PRIORITY_LABEL: Record<Priority, string> = {
  STANDARD: "Standard",
  EXPRESS: "Express",
  SAME_DAY: "Same day",
};


export const TABS: { key: FilterTab; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "ASSIGNED", label: "Assigned" },
  { key: "PICKED_UP", label: "Picked up" },
  { key: "IN_TRANSIT", label: "In transit" },
  { key: "OUT_FOR_DELIVERY", label: "Out for delivery" },
  { key: "DELAYED", label: "Delayed" },
  { key: "DELIVERED", label: "Delivered" },
  { key: "CANCELLED", label: "Cancelled" },
];

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

export const getInitials = (name: string) =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

export const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-amber-100 text-amber-700",
  "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
];

export const avatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

export const matchSearch = (s: Shipment, q: string) => {
  if (!q.trim()) return true;
  const l = q.toLowerCase();
  return (
    s.trackingId.toLowerCase().includes(l) ||
    s.customerName.toLowerCase().includes(l) ||
    s.itemName.toLowerCase().includes(l) ||
    s.pickupCity.toLowerCase().includes(l) ||
    s.deliveryCity.toLowerCase().includes(l) ||
    (s.assignedAgentName?.toLowerCase().includes(l) ?? false)
  );
};

export const ComplaintFiltersTABS: { label: string; value: "ALL" | ComplaintStatus }[] = [
  { label: "All", value: "ALL" },
  { label: "Open", value: "OPEN" },
  { label: "In Review", value: "IN_REVIEW" },
  { label: "Resolved", value: "RESOLVED" },
];


export const ComplaintTable_HEADS = [
  { label: "Complaint Id", width: "w-12" },
  { label: "Tracking ID", width: "w-48" },
  { label: "Subject", width: "w-44" },
  { label: "Customer", width: "w-32" },
  { label: "Agent", width: "w-32" },
  { label: "Status", width: "w-28" },
  { label: "Raised on", width: "w-28" },
  { label: "Action", width: "w-20" },
];


export const SUBJECT_LABELS: Record<string, string> = {
  PACKAGE_NOT_DELIVERED: "Package not delivered",
  DAMAGED_PACKAGE: "Damaged package",
  WRONG_ITEM_DELIVERED:"Wrong Item Delivered",
  DELIVERY_DELAYED: "Delivery Delayed",
  AGENT_BEHAVIOUR:"Agent Behaviour",
  PARTIAL_DELIVERY:"Partial Delivery",
  LOST_PACKAGE:"Lost Package",
  PAYMENT_ISSUE:"Payment Issue",
  OTHER: "Other",
};

export const STATUS_STYLES: Record<ComplaintStatus, string> = {
  OPEN: "bg-red-50 text-red-600 border border-red-200",
  IN_REVIEW: "bg-amber-50 text-amber-600 border border-amber-200",
  RESOLVED: "bg-green-50 text-green-600 border border-green-200",
};

export const STATUS_LABELS: Record<ComplaintStatus, string> = {
  OPEN: "Open",
  IN_REVIEW: "In Review",
  RESOLVED: "Resolved",
};

// Complaint Modal
export const COMPLAINT_STATUS_OPTIONS: { label: string; value: ComplaintStatus }[] = [
  { label: "Open", value: "OPEN" },
  { label: "In Review", value: "IN_REVIEW" },
  { label: "Resolved", value: "RESOLVED" },
];

export const COMPLAINT_STATUS_STYLES: Record<ComplaintStatus, string> = {
  OPEN: "bg-red-50 text-red-600 border border-red-200",
  IN_REVIEW: "bg-amber-50 text-amber-600 border border-amber-200",
  RESOLVED: "bg-green-50 text-green-600 border border-green-200",
};

export const COMPLAINT_SUBJECT_LABELS: Record<string, string> = {
  PACKAGE_NOT_DELIVERED: "Package not delivered",
  DAMAGED_PACKAGE: "Damaged package",
  WRONG_ITEM_DELIVERED: "Wrong Item Delivered",
  DELIVERY_DELAYED: "Delivery Delayed",
  AGENT_BEHAVIOUR: "Agent Behaviour",
  PARTIAL_DELIVERY: "Partial Delivery",
  LOST_PACKAGE: "Lost Package",
  PAYMENT_ISSUE: "Payment Issue",
  OTHER: "Other",
};

//Admin slot reassign
export const formatSlot = (
  start: string | null,
  end: string | null,
  date: string | null,
): string => {
  if (!start || !end) return "";
  const fmt = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
  };
  const dateStr = date
    ? new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      })
    : "";
  return `${fmt(start)} – ${fmt(end)}${dateStr ? ` · ${dateStr}` : ""}`;
};