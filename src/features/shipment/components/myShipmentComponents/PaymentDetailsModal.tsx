import { useEffect } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../shared/hooks/reduxHooks";
import { fetchPaymentDetails } from "../../shipmentSlice";

interface Props {
  shipmentId: number | null;
  open: boolean;
  onClose: () => void;
}

const PaymentDetailsModal = ({ shipmentId, open, onClose }: Props) => {
  const dispatch = useAppDispatch();

  const { paymentDetails, loading } = useAppSelector((state) => state.shipment);

  useEffect(() => {
    if (open && shipmentId) {
      dispatch(fetchPaymentDetails(shipmentId));
    }
  }, [dispatch, shipmentId, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Payment Details</h2>

            {paymentDetails && (
              <p className="text-sm text-emerald-100 mt-1">
                Shipment #{paymentDetails.shipmentId}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* LEFT SIDE */}
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-slate-400">Payment Status</p>

                  <div className="mt-1 inline-flex px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                    {paymentDetails.paymentStatus}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Amount</p>

                  <h2 className="text-2xl font-bold text-slate-800 mt-1">
                    ₹{paymentDetails.amount}
                  </h2>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Paid Date</p>

                  <p className="font-medium text-slate-700 mt-1">
                    {new Date(paymentDetails.paidAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Paid Time</p>

                  <p className="font-medium text-slate-700 mt-1">
                    {new Date(paymentDetails.paidAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-slate-400">Transaction ID</p>

                  <p className="font-medium text-slate-700 mt-1 break-all">
                    {paymentDetails.transactionId}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Razorpay Order ID</p>

                  <p className="font-medium text-slate-700 mt-1 break-all">
                    {paymentDetails.razorpayOrderId}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Razorpay Payment ID</p>

                  <p className="font-medium text-slate-700 mt-1 break-all">
                    {paymentDetails.razorpayPaymentId}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsModal;
