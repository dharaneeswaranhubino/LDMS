import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { statusOrder } from "../../utils/statusHelpers";
import { deliveryMock } from "../../utils/mockDelivery";
import { showToast } from "../../../../shared/components/Toast";
// import { useAppSelector } from "../../../../shared/hooks/reduxHooks";
import type { ShipmentStatus, UpdateStatusModalProps } from "../../agentTypes";

interface UpdatedUpdateStatusModalProps extends UpdateStatusModalProps {
  assignedSlotStart: string;
  assignedSlotEnd: string;
}

const getCurrentHourIST = (): number => {
  const time = new Date().toLocaleTimeString("en-GB", {
    timeZone: "Asia/Kolkata",
    hour12: false,
  });
  return Number(time.split(":")[0]);
};

const formatSlot = (time: string): string => {
  if (!time) return "";
  const [h, m] = time.split(":");
  const d = new Date();
  d.setHours(Number(h), Number(m));
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const isWithinDeliverySlot = (start: string, end: string): boolean => {
  const now = getCurrentHourIST();
  return now >= Number(start.slice(0, 2)) && now < Number(end.slice(0, 2));
};

const UpdateStatusModal = ({
  onClose,
  currentStatus,
  onUpdate,
  assignedSlotStart,
  assignedSlotEnd,
}: UpdatedUpdateStatusModalProps) => {
  // const { availability } = useAppSelector((state) => state.agent);
  const [remarks, setRemarks] = useState("");

  const currentIndex = statusOrder.indexOf(currentStatus);
  const nextStatus = statusOrder[currentIndex + 1] as ShipmentStatus | undefined;

  const prevStatusMeta = deliveryMock.timeline.find(
    (item) => item.key === currentStatus,
  );
  const nextStatusMeta = deliveryMock.timeline.find(
    (item) => item.key === nextStatus,
  );

  const isMarkingDelivered = nextStatus === "DELIVERED";

  const deliveryAllowed = isMarkingDelivered
    ? isWithinDeliverySlot(assignedSlotStart, assignedSlotEnd)
    : true;

  // const isConfirmDisabled =
  //   availability !== "AVAILABLE" || (isMarkingDelivered && !deliveryAllowed);

  const handleConfirm = async () => {
    if (!nextStatus) return;

    // if (availability !== "AVAILABLE") {
    //   showToast({
    //     type: "error",
    //     message: "Turn on your availability before updating shipment status",
    //   });
    //   return;
    // }

    if (isMarkingDelivered && !deliveryAllowed) {
      showToast({
        type: "error",
        message: `Delivery can only be marked between ${formatSlot(assignedSlotStart)} – ${formatSlot(assignedSlotEnd)}`,
      });
      return;
    }

    onClose();

    showToast({
      type: "success",
      message:
        nextStatus === "DELIVERED"
          ? "Shipment delivered successfully"
          : `Status updated to ${nextStatusMeta?.label}`,
    });

    await new Promise((resolve) => setTimeout(resolve, 500));
    await onUpdate(nextStatus);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(6px)" }}
        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.3, y: 120, rotateY: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 80 }}
          transition={{
            type: "spring",
            stiffness: 180,
            damping: 12,
            mass: 0.7,
          }}
          className="w-full max-w-md rounded-3xl bg-white/90 backdrop-blur-xl p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-slate-700">
              Update Delivery Status
            </h2>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-slate-400 transition hover:text-red-500"
            >
              <i className="fa-solid fa-xmark text-lg" />
            </motion.button>
          </div>

          <div className="mt-5 rounded-2xl bg-indigo-50 p-4">
            <p className="text-[12px] text-slate-500">Current status</p>
            <h3 className="mt-1 font-semibold text-indigo-600">
              {prevStatusMeta?.label}
            </h3>
            <p className="mt-1 text-[11px] text-slate-400">
              {prevStatusMeta?.description}
            </p>
          </div>

          {nextStatus ? (
            <>
              <div
                className={`mt-4 rounded-2xl border p-4 ${
                  isMarkingDelivered
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-green-200 bg-green-50"
                }`}
              >
                <p className="text-[12px] text-slate-500">Next status</p>
                <h3
                  className={`mt-1 font-semibold ${
                    isMarkingDelivered ? "text-emerald-600" : "text-green-600"
                  }`}
                >
                  {nextStatusMeta?.label}
                </h3>
                <p className="mt-1 text-[11px] text-slate-400">
                  {nextStatusMeta?.description}
                </p>
              </div>

              {isMarkingDelivered && (
                <div
                  className={`mt-4 rounded-2xl border p-3 flex items-start gap-3 ${
                    deliveryAllowed
                      ? "border-green-200 bg-green-50"
                      : "border-amber-200 bg-amber-50"
                  }`}
                >
                  <i
                    className={`mt-0.5 text-sm flex-shrink-0 ${
                      deliveryAllowed
                        ? "fa-solid fa-circle-check text-green-500"
                        : "fa-solid fa-clock text-amber-500"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-[12px] font-medium ${
                        deliveryAllowed ? "text-green-700" : "text-amber-700"
                      }`}
                    >
                      {deliveryAllowed
                        ? "Within delivery window"
                        : "Outside delivery window"}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Allowed slot:{" "}
                      <span className="font-medium text-slate-600">
                        {formatSlot(assignedSlotStart)} –{" "}
                        {formatSlot(assignedSlotEnd)}
                      </span>
                    </p>
                    {!deliveryAllowed && (
                      <p className="text-[11px] text-amber-600 mt-1">
                        Please wait until the assigned delivery window to mark
                        this shipment as delivered.
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-5">
                <label className="text-[13px] font-medium text-slate-600">
                  Remarks{" "}
                  <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add a note about this status update..."
                  rows={3}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 resize-none transition"
                />
              </div>

              {/* {availability !== "AVAILABLE" && (
                <div className="mt-3 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 flex items-center gap-2">
                  <i className="fa-solid fa-circle-exclamation text-red-400 text-sm flex-shrink-0" />
                  <p className="text-[11px] text-red-600">
                    You are currently unavailable. Turn on availability to
                    update shipment status.
                  </p>
                </div>
              )} */}

              <motion.button
                // whileHover={!isConfirmDisabled ? { scale: 1.01 } : {}}
                // whileTap={!isConfirmDisabled ? { scale: 0.98 } : {}}
                onClick={handleConfirm}
                // disabled={isConfirmDisabled}
                className={`mt-5 w-full rounded-2xl py-3 font-semibold text-white shadow-lg transition-all ${
                  isMarkingDelivered
                      ? "bg-gradient-to-r from-emerald-500 to-green-500"
                      : "bg-gradient-to-r from-indigo-500 to-blue-500"
                }`}
              >
                {isMarkingDelivered && !deliveryAllowed
                    ? `Available at ${formatSlot(assignedSlotStart)}`
                    : isMarkingDelivered
                      ? "Confirm Delivery ✓"
                      : "Confirm Update"}
              </motion.button>
            </>
          ) : (
            <div className="mt-6 rounded-2xl bg-slate-100 p-4 text-center text-slate-600 text-[13px]">
              No further updates available
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpdateStatusModal;