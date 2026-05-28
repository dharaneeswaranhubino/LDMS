import type { ShipmentResponse } from "../../shipmentTypes";
import {
  formatDate,
  formatTime,
  PRIORITY_LABEL,
  PRIORITY_STYLES,
  STATUS_LABEL,
  STATUS_STYLES,
} from "../../utils/shipmentHelpers";

interface Props {
  shipment: ShipmentResponse | null;
  open: boolean;
  onClose: () => void;
}

const ShipmentDetailsModal = ({ shipment, open, onClose }: Props) => {
  if (!open || !shipment) return null;
  const priority = shipment.shipmentPriority;
  const status = shipment.shipmentStatus;
  const deliveryFrom = formatTime(shipment.assignedSlotStart ?? null);
  const deliveryTo = formatTime(shipment.assignedSlotEnd ?? null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-none rounded-3xl bg-white shadow-2xl border border-slate-200">
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-5 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Shipment Details
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {shipment.trackingId ?? `#SHP-${shipment.shipmentId}`}
            </p>
          </div>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all text-slate-600"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex flex-wrap gap-3">
            <span
              className={`px-4 py-2 rounded-full text-xs font-semibold border ${
                STATUS_STYLES[status as keyof typeof STATUS_STYLES]
              }`}
            >
              {STATUS_LABEL[status as keyof typeof STATUS_LABEL]}
            </span>

            <span
              className={`px-4 py-2 rounded-full text-xs font-semibold border ${
                PRIORITY_STYLES[priority]
              }`}
            >
              {PRIORITY_LABEL[priority]}
            </span>

            {shipment.isFragile && (
              <span className="px-4 py-2 rounded-full text-xs font-semibold border border-yellow-200 bg-yellow-50 text-yellow-700">
                Fragile
              </span>
            )}
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Package Details
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Item Name</p>
                <p className="font-medium text-slate-700">
                  {shipment.itemName}
                </p>
              </div>

              <div>
                <p className="text-slate-400">Quantity</p>
                <p className="font-medium text-slate-700">
                  {shipment.quantity}
                </p>
              </div>

              <div>
                <p className="text-slate-400">Weight</p>
                <p className="font-medium text-slate-700">
                  {shipment.packageWeight} kg
                </p>
              </div>

              <div>
                <p className="text-slate-400">Amount</p>
                <p className="font-medium text-green-600">
                  ₹{shipment.amount ?? 0}
                </p>
              </div>

              <div className="col-span-2">
                <p className="text-slate-400">Description</p>
                <p className="font-medium text-slate-700">
                  {shipment.description || "No description"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="bg-violet-50 rounded-2xl p-5 border border-violet-100">
              <h3 className="text-lg font-semibold text-violet-700 mb-4">
                Delivery Details
              </h3>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-400">Receiver Name</p>
                  <p className="font-medium text-slate-700">
                    {shipment.receiverName}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">Phone</p>
                  <p className="font-medium text-slate-700">
                    {shipment.receiverPhone}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">Address</p>
                  <p className="font-medium text-slate-700">
                    {shipment.deliveryAddress}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">City</p>
                  <p className="font-medium text-slate-700">
                    {shipment.deliveryCity}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">Pincode</p>
                  <p className="font-medium text-slate-700">
                    {shipment.deliveryPincode}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-700 mb-4">
                Delivery Agent Details
              </h3>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-400">Agent Name</p>
                  <p className="font-medium text-slate-700">
                    {shipment?.assignedAgent?.agentName ?? "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">Phone</p>
                  <p className="font-medium text-slate-700">
                    {shipment.assignedAgent?.agentPhone ?? "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">ServiceZone</p>
                  <p className="font-medium text-slate-700">
                    {shipment.assignedAgent?.serviceZone ?? "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">VehicleType</p>
                  <p className="font-medium text-slate-700">
                    {shipment.assignedAgent?.vehicleType ?? "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">VehicleNumber</p>
                  <p className="font-medium text-slate-700">
                    {shipment.assignedAgent?.vehicleNumber ?? "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {(deliveryFrom || deliveryTo) && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-amber-700 mb-3">
                Assigned Delivery Slot
              </h3>

              <p className="text-sm text-slate-700 font-medium">
                {deliveryFrom} - {deliveryTo}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-slate-500">
              Created on {formatDate(shipment.createdAt ?? "")}
            </p>

            <button
              onClick={onClose}
              className="h-11 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white text-sm font-medium transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetailsModal;
