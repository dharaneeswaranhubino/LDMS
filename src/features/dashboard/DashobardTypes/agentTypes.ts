// export type ShipmentStatus =
//     | "CONFIRMED"
//     | "PICKED_UP"
//     | "IN_TRANSIT"
//     | "OUT_FOR_DELIVERY"
//     | "DELAYED"
//     | "DELIVERED"
//     | "COMPLETED"
//     | "CANCELLED";

// export interface AssignedShipment {
//     id: number;
//     trackingId: string;
//     customerName: string;
//     customerPhone: string;
//     pickupAddress: string;
//     pickupCity: string;
//     deliveryAddress: string;
//     deliveryCity: string;
//     packageWeight: number;
//     isFragile: boolean;
//     shipmentStatus: ShipmentStatus;
//     assignedSlotStart: string;
//     assignedSlotEnd: string;
//     assignedDate: string;
//     lastMessage?: string;
//     lastMessageTime?: string;
//     unread?: boolean;
// }

// export interface AgentProfile {
//   id: number;
//   name: string;
//   agentCode: string;
//   onTimePercent: number;
//   rating: number;
//   totalDelivered: number;
//   todayAssigned: number;
//   todayCompleted: number;
//   todayActive: number;
// }