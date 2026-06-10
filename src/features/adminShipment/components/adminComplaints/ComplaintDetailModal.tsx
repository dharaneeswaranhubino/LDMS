import { useState, useEffect } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../shared/hooks/reduxHooks";
import {
  setSelectedComplaint,
  updateComplaintStatus,
  clearComplaintError,
} from "../../adminSlice";
import { type ComplaintStatus } from "../../adminTypes";
import {
  COMPLAINT_STATUS_OPTIONS,
  COMPLAINT_STATUS_STYLES,
  COMPLAINT_SUBJECT_LABELS,
  formatDate,
} from "../../utils/adminShipmentHelper";
import { GiCheckMark } from "react-icons/gi";
import { showToast } from "../../../../shared/components/Toast";

const ComplaintDetailModal = () => {
  const dispatch = useAppDispatch();
  const { selectedComplaint, complaintUpdateLoading, complaintError } =
    useAppSelector((s) => s.admin);

  const [pickedStatus, setPickedStatus] = useState<ComplaintStatus>(
    selectedComplaint!.status,
  );
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setPickedStatus(selectedComplaint!.status);
    setShowSuccess(false);
    dispatch(clearComplaintError());
  }, [selectedComplaint?.complaintId, selectedComplaint?.status]);

  const handleClose = () => {
    dispatch(setSelectedComplaint(null));
    dispatch(clearComplaintError());
  };

  const handleSave = async () => {
    if (!selectedComplaint) return;
    if (pickedStatus === selectedComplaint.status) return;

    const result = await dispatch(
      updateComplaintStatus({
        complaintId: selectedComplaint.complaintId,
        status: pickedStatus,
      }),
    );

    if (updateComplaintStatus.fulfilled.match(result)) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
      showToast({
        type: "success",
        message: "Complaint Status Updated successfully!",
      });
    }
  };

  if (!selectedComplaint) return null;

  const {
    complaintId,
    trackingId,
    subject,
    description,
    customer,
    assignedAgent,
    createdAt,
    shipmentId,
  } = selectedComplaint;

  const liveStatus = selectedComplaint.status;
  const isResolved = liveStatus === "RESOLVED";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl border scrollbar-none border-slate-100 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start sm:items-center justify-between px-4 sm:px-6 py-4 gap-3 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div>
            <p className="text-base font-semibold text-slate-800">
              Complaint #{complaintId}
            </p>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {trackingId}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-gray-200 rounded-xl p-1 transition-colors mt-0.5"
          >
            <i className="fa-solid fa-x"></i>
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-5">
          {/* Complaint info */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Complaint info
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-50 rounded-xl px-3 py-2.5">
                <p className="text-[11px] text-slate-400 mb-1">Subject</p>
                <p className="text-sm font-medium text-slate-700">
                  {COMPLAINT_SUBJECT_LABELS[subject] ?? subject}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl px-3 py-2.5">
                <p className="text-[11px] text-slate-400 mb-1">
                  Current status
                </p>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${COMPLAINT_STATUS_STYLES[liveStatus]}`}
                >
                  {liveStatus === "IN_REVIEW"
                    ? "In Review"
                    : liveStatus.charAt(0) + liveStatus.slice(1).toLowerCase()}
                </span>
              </div>
              <div className="bg-slate-50 rounded-xl px-3 py-2.5">
                <p className="text-[11px] text-slate-400 mb-1">Shipment ID</p>
                <p className="text-sm font-medium text-slate-700">
                  #{shipmentId}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl px-3 py-2.5">
                <p className="text-[11px] text-slate-400 mb-1">Raised on</p>
                <p className="text-sm font-medium text-slate-700">
                  {formatDate(createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Description
            </p>
            <div className="bg-slate-50 rounded-xl px-3 py-2.5 border-l-4 border-indigo-300">
              <p className="text-sm text-slate-600 leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          {/* Customer */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Customer
            </p>
            <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2.5">
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 text-sm font-semibold flex items-center justify-center flex-shrink-0">
                {customer.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {customer.name}
                </p>
                <p className="text-xs text-slate-400">{customer.email}</p>
              </div>
            </div>
          </div>

          {/* Agent */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Assigned agent
            </p>
            {assignedAgent ? (
              <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 text-sm font-semibold flex items-center justify-center flex-shrink-0">
                  {assignedAgent.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    {assignedAgent.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {assignedAgent.email} · {assignedAgent.vehicleType} ·{" "}
                    {assignedAgent.serviceZone}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-xl px-3 py-2.5">
                <p className="text-sm text-slate-400 italic">
                  No agent assigned to this shipment
                </p>
              </div>
            )}
          </div>

          {/* Status update */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Update status
            </p>
            <div className="flex items-center gap-2">
              <select
                value={pickedStatus}
                onChange={(e) =>
                  setPickedStatus(e.target.value as ComplaintStatus)
                }
                disabled={isResolved}
                className={`flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none
                  ${
                    isResolved
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-white text-slate-700 focus:border-indigo-400"
                  }`}
              >
                {COMPLAINT_STATUS_OPTIONS.map((opt) => {
                  const disableOption =
                    liveStatus === "IN_REVIEW" && opt.value === "OPEN";

                  return (
                    <option
                      key={opt.value}
                      value={opt.value}
                      disabled={disableOption}
                    >
                      {opt.label}
                    </option>
                  );
                })}
              </select>

              <button
                onClick={handleSave}
                disabled={
                  isResolved ||
                  complaintUpdateLoading ||
                  pickedStatus === selectedComplaint.status
                }
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl
                  hover:bg-indigo-700 transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {complaintUpdateLoading ? "Updating..." : "Update"}
              </button>
            </div>

            {showSuccess && (
              <p className="flex items-center gap-1 text-xs text-green-600 mt-2 font-medium">
                <GiCheckMark /> Status updated successfully
              </p>
            )}

            {complaintError && (
              <p className="text-xs text-red-500 mt-2">{complaintError}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleClose}
            className="text-sm px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailModal;
