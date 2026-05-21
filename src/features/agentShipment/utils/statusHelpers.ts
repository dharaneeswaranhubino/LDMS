export const statusOrder = [
    "OUT_FOR_PICKUP",
    "PICKED_UP",
    "IN_TRANSIT",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
];

export const getStatusState = (
    currentStatus: string,
    itemStatus: string,
) => {
    const currentIndex = statusOrder.indexOf(currentStatus);
    const itemIndex = statusOrder.indexOf(itemStatus);

    return {
        done: itemIndex < currentIndex,
        active: itemIndex === currentIndex,
        pending: itemIndex > currentIndex,
    }
}