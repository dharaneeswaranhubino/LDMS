import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { AllShipments } from "../../adminTypes";
import {
  avatarColor,
  formatSlot,
  getInitials,
  PRIORITY_LABEL,
  PRIORITY_STYLE,
  STATUS_LABEL,
  STATUS_STYLE,
} from "../../utils/adminShipmentHelper";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../shared/hooks/reduxHooks";
import { fetchPaymentDetails } from "../../../customerShipment/shipmentSlice";
import ChatHistoryPanel from "./ChatHistoryPanelModal";

interface Props {
  shipment: AllShipments | null;
  onClose: () => void;
}

const AdminShipmentDetailModal = ({ shipment, onClose }: Props) => {
  const dispatch = useAppDispatch();
  const { paymentDetails, loading } = useAppSelector((state) => state.shipment);
  const [showChat, setShowChat] = useState(false);

  const shipmentId = shipment?.shipmentId;

  useEffect(() => {
    if (shipmentId) {
      dispatch(fetchPaymentDetails(shipmentId));
    }
    // setShowChat(false);
  }, [dispatch, shipmentId]);

  if (!shipment) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur bg-black/10 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            {!showChat ? (
              <motion.div
                key="details"
                initial={{ x: 0 }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                className="w-full max-h-[90vh] overflow-y-auto scrollbar-none"
              >
                <div className="flex items-start sm:items-center justify-between px-4 sm:px-6 py-4 gap-3 border-b border-slate-100 sticky top-0 bg-white z-10">
                  <div>
                    <h2 className="text-[15px] font-semibold text-slate-800">
                      Shipment details
                    </h2>
                    <p className="font-mono text-[11px] text-slate-500 mt-0.5">
                      {shipment.trackingId}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowChat(true)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-sky-600 bg-sky-50 border border-sky-100 hover:bg-sky-100 hover:border-sky-200 transition-all"
                      aria-label="View chat history"
                    >
                      <i className="fa-regular fa-comment-dots text-[11px]" />
                      Chat History
                      <i className="fa-solid fa-arrow-right text-[10px]" />
                    </button>

                    <span
                      className={`px-2 py-1 rounded-lg text-[10px] font-semibold border ${STATUS_STYLE[shipment.shipmentStatus]}`}
                    >
                      {STATUS_LABEL[shipment.shipmentStatus]}
                    </span>
                    <button
                      onClick={onClose}
                      className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
                      aria-label="Close modal"
                    >
                      <i className="fa-solid fa-xmark text-slate-500 text-[13px]" />
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-6 space-y-5">
                  <section>
                    <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      Package
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: "Item", val: shipment.itemName },
                        { label: "Quantity", val: shipment.quantity },
                        { label: "Weight", val: `${shipment.packageWeight} kg` },
                        { label: "Fragile", val: shipment.isFragile ? "Yes" : "No" },
                        {
                          label: "Priority",
                          val: (
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${PRIORITY_STYLE[shipment.shipmentPriority]}`}
                            >
                              {PRIORITY_LABEL[shipment.shipmentPriority]}
                            </span>
                          ),
                        },
                        ...(shipment.description
                          ? [{ label: "Description", val: shipment.description }]
                          : []),
                      ].map(({ label, val }) => (
                        <div key={label} className="bg-slate-50 rounded-xl p-3">
                          <p className="text-[10px] text-slate-400 mb-1">{label}</p>
                          <p className="text-[12px] font-medium text-slate-700">
                            {val as string}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      Route
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                        <p className="text-[10px] text-blue-500 font-semibold mb-2 flex items-center gap-1">
                          <i className="fa-solid fa-circle-dot text-[9px]" /> Pickup
                        </p>
                        <p className="text-[12px] font-semibold text-slate-800">
                          {shipment.senderName}
                        </p>
                        <p className="text-[11px] text-slate-500">{shipment.senderPhone}</p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          {shipment.pickupAddress}
                        </p>
                        <p className="text-[11px] text-slate-600 font-medium">
                          {shipment.pickupCity} – {shipment.pickupPincode}
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                        <p className="text-[10px] text-green-600 font-semibold mb-2 flex items-center gap-1">
                          <i className="fa-solid fa-location-dot text-[9px]" /> Delivery
                        </p>
                        <p className="text-[12px] font-semibold text-slate-800">
                          {shipment.receiverName}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {shipment.receiverPhone}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          {shipment.deliveryAddress}
                        </p>
                        <p className="text-[11px] text-slate-600 font-medium">
                          {shipment.deliveryCity} – {shipment.deliveryPincode}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      Customer
                    </h3>
                    <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0 ${avatarColor(shipment.customer.name)}`}
                      >
                        {getInitials(shipment.customer.name)}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-slate-800">
                          {shipment.customer.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {shipment.customer.email}
                        </p>
                        {shipment.customer.phoneNumber && (
                          <p className="text-[11px] text-slate-500">
                            {shipment.customer.phoneNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      Delivery agent
                    </h3>
                    {shipment.assignedAgent ? (
                      <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0 ${avatarColor(shipment.assignedAgent.name)}`}
                        >
                          {getInitials(shipment.assignedAgent.name)}
                        </div>
                        <div className="flex-1">
                          <p className="text-[13px] font-medium text-slate-800">
                            {shipment.assignedAgent.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {shipment.assignedAgent.email}
                          </p>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-1.5">
                            {shipment.assignedAgent.vehicleType && (
                              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                <i className="fa-solid fa-truck text-[9px]" />{" "}
                                {shipment.assignedAgent.vehicleType}
                              </span>
                            )}
                            {shipment.assignedSlotStart && (
                              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                <i className="fa-regular fa-clock text-[9px]" />
                                {formatSlot(
                                  shipment.assignedSlotStart,
                                  shipment.assignedSlotEnd,
                                  shipment.assignedDate,
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 rounded-xl p-3 text-center text-[12px] text-slate-400 italic">
                        No agent assigned yet
                      </div>
                    )}
                  </section>

                  {loading ? (
                    <div className="py-10 text-center text-slate-500">
                      <i className="fa-solid fa-spinner fa-spin mr-2" />
                      Loading payment details...
                    </div>
                  ) : !paymentDetails ? (
                    <div className="py-10 text-center text-slate-500">
                      Payment details not found
                    </div>
                  ) : (
                    <section>
                      <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
                        Payment Details
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-slate-50 rounded-xl p-3">
                          <p className="text-[10px] text-slate-400 mb-1">Amount</p>
                          <p className="text-[14px] font-semibold text-slate-800">
                            ₹{paymentDetails?.amount}
                          </p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3">
                          <p className="text-[10px] text-slate-400 mb-1">Payment</p>
                          <p
                            className={`text-[12px] font-semibold ${
                              paymentDetails?.paymentStatus === "PAID"
                                ? "text-green-600"
                                : paymentDetails?.paymentStatus === "FAILED"
                                  ? "text-red-500"
                                  : "text-sky-600"
                            }`}
                          >
                            {paymentDetails?.paymentStatus}
                          </p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3">
                          <p className="text-[10px] text-slate-400 mb-1">Paid Date</p>
                          <p className="text-[11px] font-medium text-slate-600">
                            {new Date(paymentDetails?.paidAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                        <div className="bg-slate-50 rounded-xl p-3">
                          <p className="text-[10px] text-slate-400 mb-1">Paid Time</p>
                          <p className="text-[11px] font-medium text-slate-600">
                            {new Date(paymentDetails?.paidAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3">
                          <p className="text-[10px] text-slate-400 mb-1">
                            Transaction ID
                          </p>
                          <p className="text-[12px] font-medium text-slate-600">
                            {paymentDetails?.transactionId}
                          </p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3">
                          <p className="text-[10px] text-slate-400 mb-1">
                            Transaction ID
                          </p>
                          <p className="text-[12px] font-medium text-slate-600">
                            {paymentDetails?.razorpayOrderId}
                          </p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3">
                          <p className="text-[10px] text-slate-400 mb-1">
                            Razorpay Order ID
                          </p>
                          <p className="text-[12px] font-medium text-slate-600">
                            {paymentDetails?.razorpayPaymentId}
                          </p>
                        </div>
                      </div>
                    </section>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                className="w-full h-[90vh] flex flex-col"
              >
                <ChatHistoryPanel
                  shipmentId={shipment.shipmentId}
                  onBack={() => setShowChat(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminShipmentDetailModal;