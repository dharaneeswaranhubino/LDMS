import { useState, useEffect, memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { AllShipments } from "../../adminTypes";
import { STATUS_LABEL, STATUS_STYLE } from "../../utils/adminShipmentHelper";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../shared/hooks/reduxHooks";
import {
  updateShipmentStatus,
  clearCompleteShipmentError,
} from "../../adminSlice";

interface Props {
  shipment: AllShipments | null;
  onClose: () => void;
  onSuccess: () => void;
}

const AdminShipmentCompleteModal = ({
  shipment,
  onClose,
  onSuccess,
}: Props) => {
  const dispatch = useAppDispatch();
  const { completeShipmentLoading, completeShipmentError } = useAppSelector(
    (state) => state.admin,
  );
  const [remarks, setRemarks] = useState("");

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!shipment) {
      setTimeout(() => {
        setRemarks("");
      }, 0);
      dispatch(clearCompleteShipmentError());
    }
  }, [shipment, dispatch]);

  if (!shipment) return null;

  const handleConfirm = async () => {
    const result = await dispatch(
      updateShipmentStatus({
        shipmentId: shipment.shipmentId,
        status: "COMPLETED",
        remarks: remarks.trim() || undefined,
      }),
    );
    if (updateShipmentStatus.fulfilled.match(result)) {
      onSuccess();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {shipment && (
        <motion.div
          key="complete-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 backdrop-blur bg-black/20 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            key="complete-modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-circle-check text-green-500 text-[16px]" />
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold text-slate-800">
                    Mark as Completed
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                    {shipment.trackingId}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={completeShipmentLoading}
                className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all disabled:opacity-50"
              >
                <i className="fa-solid fa-xmark text-slate-500 text-[13px]" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4 space-y-4">
              {/* Shipment summary */}
              <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[12px] font-medium text-slate-700">
                    {shipment.itemName}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {shipment.customer.name} · {shipment.deliveryCity}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold border flex-shrink-0 ${STATUS_STYLE[shipment.shipmentStatus]}`}
                >
                  {STATUS_LABEL[shipment.shipmentStatus]}
                </span>
              </div>

              {/* Status arrow */}
              <div className="flex items-center justify-center gap-3">
                <span className="px-3 py-1.5 rounded-lg bg-green-50 text-green-600 border border-green-100 text-[11px] font-semibold">
                  Delivered
                </span>
                <i className="fa-solid fa-arrow-right text-slate-300 text-[12px]" />
                <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold flex items-center gap-1.5">
                  <i className="fa-solid fa-circle-check text-[10px]" />
                  Completed
                </span>
              </div>

              {/* Remarks */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
                  Remarks{" "}
                  <span className="text-slate-400 font-normal normal-case">
                    (optional)
                  </span>
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  maxLength={500}
                  rows={3}
                  placeholder="Add any completion notes…"
                  disabled={completeShipmentLoading}
                  className="w-full px-3 py-2.5 text-[12px] bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-300 transition-all disabled:opacity-60"
                />
                <p className="text-[10px] text-slate-400 text-right mt-1">
                  {remarks.length}/500
                </p>
              </div>

              {/* Error */}
              {completeShipmentError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                  <i className="fa-solid fa-triangle-exclamation text-red-400 text-[12px] flex-shrink-0" />
                  <p className="text-[11px] text-red-600">
                    {completeShipmentError}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 pb-5 flex items-center gap-2.5">
              <button
                onClick={onClose}
                disabled={completeShipmentLoading}
                className="flex-1 px-4 py-2.5 rounded-xl text-[12px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={completeShipmentLoading}
                className="flex-1 px-4 py-2.5 rounded-xl text-[12px] font-semibold text-white bg-green-500 hover:bg-green-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {completeShipmentLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin text-[11px]" />
                    Completing…
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-circle-check text-[11px]" />
                    Confirm Complete
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(AdminShipmentCompleteModal);
