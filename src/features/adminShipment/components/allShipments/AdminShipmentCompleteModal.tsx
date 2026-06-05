import type { BackendShipment } from "../../adminTypes";

interface Props {
  shipment: BackendShipment | null;
  loading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}
const AdminShipmentCompleteModal = ({
  shipment,
  loading,
  onConfirm,
  onClose,
}: Props) => {
  if (!shipment) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <i className="fa-solid fa-circle-check text-green-600 text-2xl" />
        </div>

        <h2 className="text-[15px] font-semibold text-slate-800 text-center mb-1">
          Mark as completed?
        </h2>
        <p className="text-[12px] text-slate-500 text-center mb-1">
          {shipment.trackingId}
        </p>
        <p className="text-[12px] text-slate-400 text-center mb-5">
          This will close the shipment permanently. Chat becomes read-only. This
          action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[13px] font-medium hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin text-[12px]" />
                Processing…
              </>
            ) : (
              <>
                <i className="fa-solid fa-circle-check text-[12px]" />
                Yes, complete it
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminShipmentCompleteModal;
