import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type {
  ComplaintSubject,
  RaiseComplaintModalProps,
} from "../../shipmentTypes";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../shared/hooks/reduxHooks";
import {
  clearComplaintError,
  clearLastComplaint,
  raiseComplaint,
} from "../../shipmentSlice";
import { SUBJECT_META } from "../../utils/shipmentHelpers";
import { showToast } from "../../../../shared/components/Toast";

const MIN_DESC_LENGTH = 20;

const RaiseComplaintModal = ({
  open,
  onClose,
  shipmentId,
  trackingId,
}: RaiseComplaintModalProps) => {
  const dispatch = useAppDispatch();
  const { raising, raiseError, lastRaisedComplaint } = useAppSelector(
    (state) => state.shipment,
  );

  const [selectedSubject, setSelectedSubject] =
    useState<ComplaintSubject | null>(null);
  const [description, setDescription] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClose = () => {
    dispatch(clearLastComplaint());
    dispatch(clearComplaintError());
    onClose();
  };

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setSelectedSubject(null);
        setDescription("");
        setShowSuccess(false);
        dispatch(clearComplaintError());
        dispatch(clearLastComplaint());
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (lastRaisedComplaint && open) {
      const timer = setTimeout(() => {
        setShowSuccess(true);
      }, 0);
      const closeTimer = setTimeout(() => {
        handleClose();
      }, 1800);
      return () => {
        clearTimeout(timer);
        clearTimeout(closeTimer);
      };
    }
  }, [lastRaisedComplaint, open, onClose]);

  const isValid =
    selectedSubject !== null && description.trim().length >= MIN_DESC_LENGTH;

  const handleSubmit = () => {
    if (!isValid || !selectedSubject) return;
    dispatch(
      raiseComplaint({
        shipmentId,
        payload: {
          subject: selectedSubject,
          description: description.trim(),
        },
      }),
    );
    showToast({
      type: "success",
      message: "Complaint raised Successfully",
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="complaint-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            key="complaint-modal"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-[520px] max-h-[85vh] scrollbar-none overflow-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 px-6 py-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-triangle-exclamation text-red-600 text-[15px]" />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-slate-800 leading-snug">
                    Raise a complaint
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                    {trackingId}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-slate-400 hover:text-slate-600 transition-colors mt-0.5"
              >
                <i className="fa-solid fa-xmark text-[16px]" />
              </button>
            </div>

            {/* Body */}
            {showSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-10 px-6 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-4">
                  <i className="fa-solid fa-circle-check text-green-600 text-[26px]" />
                </div>
                <p className="text-[15px] font-semibold text-slate-800 mb-1">
                  Complaint raised!
                </p>
                <p className="text-[13px] text-slate-500 max-w-[300px] leading-relaxed">
                  We'll review and respond within 24 hours.
                </p>
              </motion.div>
            ) : (
              <div className="px-5 py-3 flex flex-col gap-3">
                {/* Subject chips */}
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Issue type <span className="text-red-400">*</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {SUBJECT_META.map((s) => {
                      const isSelected = selectedSubject === s.value;
                      return (
                        <button
                          key={s.value}
                          onClick={() => setSelectedSubject(s.value)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[12px] font-medium transition-all text-left ${
                            isSelected
                              ? "border-red-300 bg-red-50 text-red-700"
                              : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white"
                          }`}
                        >
                          <i
                            className={`fa-solid ${s.icon} text-[12px] flex-shrink-0 ${
                              isSelected ? "text-red-500" : "text-slate-400"
                            }`}
                          />
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Description <span className="text-red-400">*</span>
                  </p>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your issue clearly — include dates, times, or what you expected to happen..."
                    className="w-full text-[13px] px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 placeholder-slate-300 resize-none outline-none focus:border-red-300 focus:bg-white focus:ring-2 focus:ring-red-100 transition-all leading-relaxed"
                  />
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-[11px] text-slate-400">
                      Minimum {MIN_DESC_LENGTH} characters
                    </p>
                    <p
                      className={`text-[11px] ${
                        description.trim().length >= MIN_DESC_LENGTH
                          ? "text-green-500"
                          : "text-slate-400"
                      }`}
                    >
                      {description.trim().length} chars
                    </p>
                  </div>
                </div>

                {/* API error */}
                {raiseError && (
                  <p className="text-[12px] text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                    <i className="fa-solid fa-circle-exclamation mr-1.5" />
                    {raiseError}
                  </p>
                )}
              </div>
            )}

            {/* Footer */}
            {!showSuccess && (
              <div className="flex items-center justify-between gap-3 px-6 py-3 border-t border-slate-100">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Our team reviews complaints within 24 hours.
                </p>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-[12px] rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!isValid || raising}
                    className={`px-4 py-2 text-[12px] rounded-xl font-medium flex items-center gap-2 transition-all ${
                      isValid && !raising
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-red-100 text-red-300 cursor-not-allowed"
                    }`}
                  >
                    {raising ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin text-[11px]" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-paper-plane text-[11px]" />
                        Submit
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RaiseComplaintModal;
