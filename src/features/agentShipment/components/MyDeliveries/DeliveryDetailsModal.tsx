import type { DeliveryDetailsModalProps } from "../../agentTypes";
import { formatDate } from "../../utils/mockDelivery";

const DeliveryDetailsModal = ({
  setIsView,
  item,
  getPriorityColor,
  getStatusColor,
}:DeliveryDetailsModalProps) => {
  const onClose = () => {
    setIsView(false);
  };
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm p-4">
        <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-none rounded-3xl bg-white shadow-2xl border border-slate-200">
          <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-5 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Shipment Details
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {item.trackingId ?? `#SHP-${item.shipmentId}`}
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
                className={`flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold flex items-center border ${getStatusColor()}`}
              >
                {item.shipmentStatus.replaceAll("_", " ")}
              </span>

              <span
                className={`flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold flex items-center border ${getPriorityColor()}`}
              >
                {item.shipmentPriority.replaceAll("_", " ")}
              </span>

              {item.isFragile && (
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
                  <p className="font-medium text-slate-700">{item.itemName}</p>
                </div>

                <div>
                  <p className="text-slate-400">Quantity</p>
                  <p className="font-medium text-slate-700">{item.quantity}</p>
                </div>

                <div>
                  <p className="text-slate-400">Weight</p>
                  <p className="font-medium text-slate-700">
                    {item.packageWeight} kg
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">Amount</p>
                  <p className="font-medium text-green-600">
                    ₹{item.amount ?? 0}
                  </p>
                </div>

                <div className="col-span-2">
                  <p className="text-slate-400">Description</p>
                  <p className="font-medium text-slate-700">
                    {item.description || "No description"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-700 mb-4">
                  Pickup Details
                </h3>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-slate-400">Sender Name</p>
                    <p className="font-medium text-slate-700">
                      {item.senderName}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">Phone</p>
                    <p className="font-medium text-slate-700">
                      {item.senderPhone}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">Address</p>
                    <p className="font-medium text-slate-700">
                      {item.pickupAddress}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">City</p>
                    <p className="font-medium text-slate-700">
                      {item.pickupCity}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">Pincode</p>
                    <p className="font-medium text-slate-700">
                      {item.pickupPincode}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-violet-50 rounded-2xl p-5 border border-violet-100">
                <h3 className="text-lg font-semibold text-violet-700 mb-4">
                  Delivery Details
                </h3>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-slate-400">Receiver Name</p>
                    <p className="font-medium text-slate-700">
                      {item.receiverName}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">Phone</p>
                    <p className="font-medium text-slate-700">
                      {item.receiverPhone}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">Address</p>
                    <p className="font-medium text-slate-700">
                      {item.deliveryAddress}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">City</p>
                    <p className="font-medium text-slate-700">
                      {item.deliveryCity}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">Pincode</p>
                    <p className="font-medium text-slate-700">
                      {item.deliveryPincode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {(item.assignedSlotStart || item.assignedSlotEnd) && (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                <h3 className="text-lg font-semibold text-amber-700 mb-3">
                  Preferred Delivery Time
                </h3>

                <p className="text-sm text-slate-700 font-medium">
                  {item.assignedSlotStart} - {item.assignedSlotEnd}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-slate-400">
                Created on {formatDate(item.createdAt ?? "")}
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
    </>
  );
};

export default DeliveryDetailsModal;
