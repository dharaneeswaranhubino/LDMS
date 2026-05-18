import type { AgentProfile, AssignedShipment, ShipmentStatus } from "../DashobardTypes/agentTypes";

export const MOCK_PROFILE: AgentProfile = {
    id: 1,
    name: "Rajesh Kumar",
    agentCode: "AGT-001",
    onTimePercent: 95,
    rating: 4.8,
    totalDelivered: 245,
    todayAssigned: 4,
    todayCompleted: 1,
    todayActive: 1,
};


export const MOCK_SHIPMENTS: AssignedShipment[] = [
    {
        id: 45, trackingId: "TRK-045-ABC", customerName: "Deepa M",
        customerPhone: "+91 98765 43210",
        pickupAddress: "Whitefield", pickupCity: "Whitefield",
        deliveryAddress: "Koramangala", deliveryCity: "Koramangala",
        packageWeight: 1.5, isFragile: false,
        shipmentStatus: "DELIVERED",
        assignedSlotStart: "09:00 AM", assignedSlotEnd: "10:00 AM",
        assignedDate: "2026-05-18",
    },
    {
        id: 1, trackingId: "TRK-001-XYZ", customerName: "John Doe",
        customerPhone: "+91 87654 32109",
        pickupAddress: "No.12, MG Road", pickupCity: "MG Road",
        deliveryAddress: "No.45, Indiranagar", deliveryCity: "Indiranagar",
        packageWeight: 2.5, isFragile: true,
        shipmentStatus: "IN_TRANSIT",
        assignedSlotStart: "10:00 AM", assignedSlotEnd: "11:00 AM",
        assignedDate: "2026-05-18",
        lastMessage: "Please call when you reach. Gate code is 1234",
        lastMessageTime: "5 min ago", unread: true,
    },
    {
        id: 2, trackingId: "TRK-002-PQR", customerName: "Meera S",
        customerPhone: "+91 76543 21098",
        pickupAddress: "Koramangala", pickupCity: "Koramangala",
        deliveryAddress: "HSR Layout", deliveryCity: "HSR Layout",
        packageWeight: 1.2, isFragile: false,
        shipmentStatus: "CONFIRMED",
        assignedSlotStart: "11:00 AM", assignedSlotEnd: "12:00 PM",
        assignedDate: "2026-05-18",
        lastMessage: "Will someone be home between 11-12?",
        lastMessageTime: "18 min ago", unread: true,
    },
    {
        id: 3, trackingId: "TRK-003-MNO", customerName: "Ravi P",
        customerPhone: "+91 65432 10987",
        pickupAddress: "BTM Layout", pickupCity: "BTM Layout",
        deliveryAddress: "Electronic City", deliveryCity: "Electronic City",
        packageWeight: 3.0, isFragile: false,
        shipmentStatus: "CANCELLED",
        assignedSlotStart: "12:00 PM", assignedSlotEnd: "01:00 PM",
        assignedDate: "2026-05-18",
        lastMessage: "Please leave at door if no one answers",
        lastMessageTime: "Yesterday", unread: false,
    },
    {
        id: 4, trackingId: "TRK-004-STU", customerName: "Anita K",
        customerPhone: "+91 54321 09876",
        pickupAddress: "Jayanagar", pickupCity: "Jayanagar",
        deliveryAddress: "Marathahalli", deliveryCity: "Marathahalli",
        packageWeight: 0.8, isFragile: true,
        shipmentStatus: "CONFIRMED",
        assignedSlotStart: "02:00 PM", assignedSlotEnd: "03:00 PM",
        assignedDate: "2026-05-18",
    },
];

export const ALL_SLOTS = [
    { start: "09:00 AM", end: "10:00 AM" },
    { start: "10:00 AM", end: "11:00 AM" },
    { start: "11:00 AM", end: "12:00 PM" },
    { start: "12:00 PM", end: "01:00 PM" },
    { start: "02:00 PM", end: "03:00 PM" },
    { start: "03:00 PM", end: "04:00 PM" },
    { start: "04:00 PM", end: "05:00 PM" },
    { start: "05:00 PM", end: "06:00 PM" },
    { start: "06:00 PM", end: "07:00 PM" },
    { start: "08:00 PM", end: "09:00 PM" },
];

export const STATUS_CONFIG: Record<ShipmentStatus, { label: string; style: string; icon: string }> = {
    CONFIRMED: { label: "Upcoming", style: "bg-purple-100 text-purple-700 border-purple-200", icon: "fa-clock" },
    PICKED_UP: { label: "Active", style: "bg-blue-100 text-blue-700 border-blue-200", icon: "fa-truck" },
    IN_TRANSIT: { label: "Active", style: "bg-blue-100 text-blue-700 border-blue-200", icon: "fa-truck" },
    OUT_FOR_DELIVERY: { label: "Active", style: "bg-indigo-100 text-indigo-700 border-indigo-200", icon: "fa-location-dot" },
    DELAYED: { label: "Delayed", style: "bg-orange-100 text-orange-700 border-orange-200", icon: "fa-triangle-exclamation" },
    DELIVERED: { label: "Done", style: "bg-green-100 text-green-700 border-green-200", icon: "fa-circle-check" },
    COMPLETED: { label: "Done", style: "bg-green-100 text-green-700 border-green-200", icon: "fa-circle-check" },
    CANCELLED: { label: "Cancelled", style: "bg-red-100 text-red-700 border-red-200", icon: "fa-xmark" },
};

export const isActive = (s: ShipmentStatus) =>
  ["PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELAYED"].includes(s);

export const isDone = (s: ShipmentStatus) =>
  ["DELIVERED", "COMPLETED"].includes(s);

export const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

export const today = new Date().toLocaleDateString("en-IN", {
  weekday: "long", day: "numeric", month: "long", year: "numeric",
});