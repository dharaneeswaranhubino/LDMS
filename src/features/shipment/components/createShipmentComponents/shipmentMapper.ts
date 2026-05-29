import type { Address, PackageDetailsFormData } from "../../shipmentTypes";

export interface CreateShipmentPayload {
    pickUpAddress: Address;
    deliveryAddress: Address;
    packageDetails: PackageDetailsFormData & { quantity: string };
    // paymentId: string;
    amount: number;
}

export const mapToBackendPayload = (data: CreateShipmentPayload) => ({
    // Package
    itemName: data.packageDetails.itemName,
    quantity: Number(data.packageDetails.quantity),
    packageWeight: Number(data.packageDetails.weight),
    description: data.packageDetails.description,
    isFragile: data.packageDetails.fragile,

    // Sender
    senderName: data.pickUpAddress.name,
    senderPhone: data.pickUpAddress.phone,
    pickupAddress: data.pickUpAddress.fullAddress,
    pickupCity: data.pickUpAddress.city,
    pickupPincode: data.pickUpAddress.pinCode,

    // Receiver
    receiverName: data.deliveryAddress.name,
    receiverPhone: data.deliveryAddress.phone,
    deliveryAddress: data.deliveryAddress.fullAddress,
    deliveryCity: data.deliveryAddress.city,
    deliveryPincode: data.deliveryAddress.pinCode,

    // Delivery
    preferredDeliveryFrom: data.packageDetails.deliveryFrom?data.packageDetails.deliveryFrom:null,
    preferredDeliveryTo:data.packageDetails.deliveryTo?data.packageDetails.deliveryTo:null,
    shipmentPriority: data.packageDetails.priority,

    // Payment
    amount: data.amount,
    // paymentId: data.paymentId,
});