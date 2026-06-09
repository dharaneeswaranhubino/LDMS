import type { CustomerDashboardData } from "../../customerShipment/shipmentTypes";

const ALL_RECENT_SHIPMENTS: CustomerDashboardData["recentShipments"] = [
    {
        shipmentId: 1,
        trackingId: "TRK-AAA001",
        itemName: "Laptop",
        shipmentStatus: "IN_TRANSIT",
        paymentStatus: "PAID",
        deliveryAddress: "45 Anna Nagar",
        deliveryCity: "Chennai",
        estimatedDelivery: "2026-06-03T00:00:00.000Z",
        createdAt: "2026-06-01T10:00:00.000Z",
    },
    {
        shipmentId: 2,
        trackingId: "TRK-BBB002",
        itemName: "Monitor",
        shipmentStatus: "OUT_FOR_DELIVERY",
        paymentStatus: "PENDING",
        deliveryAddress: "12 T Nagar",
        deliveryCity: "Chennai",
        estimatedDelivery: "2026-05-30T00:00:00.000Z",
        createdAt: "2026-05-28T11:00:00.000Z",
    },
    {
        shipmentId: 3,
        trackingId: "TRK-CCC003",
        itemName: "Keyboard",
        shipmentStatus: "DELIVERED",
        paymentStatus: "PAID",
        deliveryAddress: "8 Velachery",
        deliveryCity: "Chennai",
        estimatedDelivery: null,
        createdAt: "2026-05-20T09:00:00.000Z",
    },
    {
        shipmentId: 4,
        trackingId: "TRK-DDD004",
        itemName: "Headphones",
        shipmentStatus: "DELIVERED",
        paymentStatus: "PAID",
        deliveryAddress: "3 Adyar",
        deliveryCity: "Chennai",
        estimatedDelivery: null,
        createdAt: "2026-05-10T14:30:00.000Z",
    },
    {
        shipmentId: 5,
        trackingId: "TRK-EEE005",
        itemName: "Tablet",
        shipmentStatus: "PENDING",
        paymentStatus: "PENDING",
        deliveryAddress: "22 Nungambakkam",
        deliveryCity: "Chennai",
        estimatedDelivery: "2026-04-20T00:00:00.000Z",
        createdAt: "2026-04-15T08:00:00.000Z",
    },
    {
        shipmentId: 6,
        trackingId: "TRK-FFF006",
        itemName: "Speakers",
        shipmentStatus: "DELIVERED",
        paymentStatus: "PAID",
        deliveryAddress: "5 Mylapore",
        deliveryCity: "Chennai",
        estimatedDelivery: null,
        createdAt: "2026-04-05T10:00:00.000Z",
    },
    {
        shipmentId: 7,
        trackingId: "TRK-GGG007",
        itemName: "Webcam",
        shipmentStatus: "CANCELLED",
        paymentStatus: "FAILED",
        deliveryAddress: "9 Porur",
        deliveryCity: "Chennai",
        estimatedDelivery: null,
        createdAt: "2026-03-18T13:00:00.000Z",
    },
    {
        shipmentId: 8,
        trackingId: "TRK-HHH008",
        itemName: "Router",
        shipmentStatus: "DELIVERED",
        paymentStatus: "PAID",
        deliveryAddress: "14 Ambattur",
        deliveryCity: "Chennai",
        estimatedDelivery: null,
        createdAt: "2026-02-22T09:30:00.000Z",
    },
    {
        shipmentId: 9,
        trackingId: "TRK-III009",
        itemName: "Hard Disk",
        shipmentStatus: "DELIVERED",
        paymentStatus: "PAID",
        deliveryAddress: "7 Guindy",
        deliveryCity: "Chennai",
        estimatedDelivery: null,
        createdAt: "2026-01-14T11:00:00.000Z",
    },
];

const ALL_PAYMENT_HISTORY: CustomerDashboardData["paymentHistory"] = [
    { paymentId: 1, shipmentId: 1, amount: 250, paymentStatus: "PAID", paidAt: "2026-06-01T10:05:00.000Z" },
    { paymentId: 2, shipmentId: 2, amount: 180, paymentStatus: "PENDING", paidAt: null },
    { paymentId: 3, shipmentId: 3, amount: 320, paymentStatus: "PAID", paidAt: "2026-05-20T12:00:00.000Z" },
    { paymentId: 4, shipmentId: 4, amount: 150, paymentStatus: "PAID", paidAt: "2026-05-10T15:00:00.000Z" },
    { paymentId: 5, shipmentId: 5, amount: 400, paymentStatus: "PENDING", paidAt: null },
    { paymentId: 6, shipmentId: 6, amount: 275, paymentStatus: "PAID", paidAt: "2026-04-05T11:00:00.000Z" },
    { paymentId: 7, shipmentId: 7, amount: 210, paymentStatus: "FAILED", paidAt: null },
    { paymentId: 8, shipmentId: 8, amount: 190, paymentStatus: "PAID", paidAt: "2026-02-22T10:00:00.000Z" },
    { paymentId: 9, shipmentId: 9, amount: 130, paymentStatus: "PAID", paidAt: "2026-01-14T12:00:00.000Z" },
];

const ALL_SUPPORT_CHATS: CustomerDashboardData["recentSupportChats"] = [
    {
        chatId: 1,
        subject: "Shipment TRK-BBB002 delayed?",
        lastMessage: "Your shipment is at Chennai hub and will be delivered by tomorrow.",
        lastMessageBy: "AGENT",
        agentName: "Arjun G",
        status: "OPEN",
        unreadCount: 2,
        updatedAt: "2026-05-31T09:42:00.000Z",
    },
    {
        chatId: 2,
        subject: "Payment confirmation for #1",
        lastMessage: "Your payment of ₹250 has been confirmed. Receipt sent to your email.",
        lastMessageBy: "BOT",
        agentName: null,
        status: "RESOLVED",
        unreadCount: 0,
        updatedAt: "2026-05-24T10:05:00.000Z",
    },
    {
        chatId: 3,
        subject: "Wrong delivery address on order #3",
        lastMessage: "The address has been updated successfully. Your shipment will be redirected.",
        lastMessageBy: "AGENT",
        agentName: "Sridevi R",
        status: "CLOSED",
        unreadCount: 0,
        updatedAt: "2026-05-17T15:18:00.000Z",
    },
];

//Helper generate monthlyStats between from/to
function generateMonthlyStats(
    shipments: CustomerDashboardData["recentShipments"],
    from: Date,
    to: Date
): CustomerDashboardData["monthlyStats"] {
    const stats: CustomerDashboardData["monthlyStats"] = [];

    // Walk month by month from `from` to `to`
    const cursor = new Date(from.getFullYear(), from.getMonth(), 1);
    const end = new Date(to.getFullYear(), to.getMonth(), 1);

    while (cursor <= end) {
        const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;

        const count = shipments.filter((s) => {
            const d = new Date(s.createdAt);
            return d.getFullYear() === cursor.getFullYear() && d.getMonth() === cursor.getMonth();
        }).length;

        stats.push({ month: key, count });
        cursor.setMonth(cursor.getMonth() + 1);
    }

    return stats;
}

//Main export call this with from/to strings
//Returns filtered mock data, simulating real API behavior
export function getMockCustomerDashboard(from: string, to: string): CustomerDashboardData {
    const fromDate = new Date(from + "T00:00:00.000Z");
    const toDate = new Date(to + "T23:59:59.999Z");

    //Filter shipments within date range
    const filteredShipments = ALL_RECENT_SHIPMENTS.filter((s) => {
        const d = new Date(s.createdAt);
        return d >= fromDate && d <= toDate;
    });

    //Filter payments within date range (by paidAt if paid, else by shipment createdAt)
    const filteredPayments = ALL_PAYMENT_HISTORY.filter((p) => {
        const refDate = p.paidAt ? new Date(p.paidAt) : null;
        if (!refDate) {
            // Pending payments — check if their shipment falls in range
            const ship = ALL_RECENT_SHIPMENTS.find((s) => s.shipmentId === p.shipmentId);
            if (!ship) return false;
            const d = new Date(ship.createdAt);
            return d >= fromDate && d <= toDate;
        }
        return refDate >= fromDate && refDate <= toDate;
    });

    //Derive stats from filtered shipments
    const activeShipments = filteredShipments.filter((s) => s.shipmentStatus === "IN_TRANSIT" || s.shipmentStatus === "OUT_FOR_DELIVERY" || s.shipmentStatus === "PICKED_UP" || s.shipmentStatus === "OUT_FOR_PICKUP" || s.shipmentStatus === "ASSIGNED").length;
    const deliveredShipments = filteredShipments.filter((s) => s.shipmentStatus === "DELIVERED").length;
    const pendingShipments = filteredShipments.filter((s) => s.shipmentStatus === "PENDING" || s.shipmentStatus === "CONFIRMED").length;
    const pendingPayments = filteredPayments.filter((p) => p.paymentStatus === "PENDING").length;

    return {
        activeShipments,
        totalShipments: filteredShipments.length,
        deliveredShipments,
        pendingShipments,
        pendingPayments,
        unreadNotifications: 3, // static — comes from notifications system, not date-filtered

        recentShipments: filteredShipments.slice(0, 5), // latest 5
        paymentHistory: filteredPayments.slice(0, 5),  // latest 5
        recentSupportChats: ALL_SUPPORT_CHATS,           // not date-filtered

        shipmentStatusBreakdown: {
            IN_TRANSIT: filteredShipments.filter((s) => s.shipmentStatus === "IN_TRANSIT").length,
            DELIVERED: deliveredShipments,
            PENDING: pendingShipments,
            CANCELLED: filteredShipments.filter((s) => s.shipmentStatus === "CANCELLED").length,
        },

        monthlyStats: generateMonthlyStats(filteredShipments, fromDate, toDate),
    };
}

// ---------------------------------------------------------------------

export const fmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});
export const fmtDate = (d: string) => fmt.format(new Date(d));
export const fmtAmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;
export const todayStr = () => new Date().toISOString().split("T")[0];

export const fmtMonthLabel = (month: string) =>
  new Date(month + "-01").toLocaleDateString("en-GB", {
    month: "short",
    year: "2-digit",
  });

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const SHIPMENT_STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  PENDING: {
    label: "Pending",
    cls: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  CONFIRMED: {
    label: "Confirmed",
    cls: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  ASSIGNED: {
    label: "Assigned",
    cls: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  OUT_FOR_PICKUP: {
    label: "Out for pickup",
    cls: "bg-cyan-50 text-cyan-700 border border-cyan-200",
  },
  PICKED_UP: {
    label: "Picked up",
    cls: "bg-cyan-50 text-cyan-700 border border-cyan-200",
  },
  IN_TRANSIT: {
    label: "In transit",
    cls: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for delivery",
    cls: "bg-violet-50 text-violet-700 border border-violet-200",
  },
  DELIVERED: {
    label: "Delivered",
    cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  CANCELLED: {
    label: "Cancelled",
    cls: "bg-red-50 text-red-600 border border-red-200",
  },
};

export const PAYMENT_STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  PAID: {
    label: "Paid",
    cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  PENDING: {
    label: "Pending",
    cls: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  FAILED: {
    label: "Failed",
    cls: "bg-red-50 text-red-600 border border-red-200",
  },
};

export const SUPPORT_STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  OPEN: {
    label: "Open",
    cls: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  RESOLVED: {
    label: "Resolved",
    cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  CLOSED: {
    label: "Closed",
    cls: "bg-gray-100 text-gray-500 border border-gray-200",
  },
};

