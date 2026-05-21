export const DELIVERY_STATUS = {
    OUT_FOR_PICKUP: "OUT_FOR_PICKUP",
    PICKED_UP: "PICKED_UP",
    IN_TRANSIT: "IN_TRANSIT",
    OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
    DELIVERED: "DELIVERED",
};

export const deliveryMock = {
    id: 1,
    tracking_Id: "TRK-001-XYZ",
    currentStatus: DELIVERY_STATUS.PICKED_UP,
    timeline: [
        {
            key: DELIVERY_STATUS.OUT_FOR_PICKUP,
            label: "Out for Pickup",
            description: "Agent left warehouse"
        },
        {
            key: DELIVERY_STATUS.PICKED_UP,
            label: "Picked Up",
            description: "Package collected from sender"
        },
        {
            key: DELIVERY_STATUS.IN_TRANSIT,
            label: "In transit",
            description: "Heading to customer address",
        },
        {
            key: DELIVERY_STATUS.OUT_FOR_DELIVERY,
            label: "Out for delivery",
            description: "Last mile delivery started",
        },
        {
            key: DELIVERY_STATUS.DELIVERED,
            label: "Delivered",
            description: "Package delivered Successfully"
        }
    ]
}