import { PDFDownloadLink } from "@react-pdf/renderer";
import { GiCheckMark } from "react-icons/gi";
import ReceiptPDF from "./ReceiptPDF";

const ReceiptPreviewModal = ({
  onClose,
  razorpayPaymentId,
  paymentStatus,
  trackingId,
  prices,
  priority,
  packageWeight,
  today,
  fileName,
}: {
  onClose: () => void;
  razorpayPaymentId: string | undefined;
  paymentStatus:string | undefined;
  trackingId?: string;
  prices?: {
    platformFee: number;
    weightCharge: number;
    priorityCharge: number;
    fragileCharge: number | undefined;
    subtotal: number;
    gst: number;
    total: number;
  };
  priority: string | undefined;
  packageWeight: number | undefined;
  today?: string;
  fileName: string;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <p className="font-semibold text-slate-700 text-sm">
            Receipt Preview
          </p>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-500 transition"
          >
            <i className="fa-solid fa-xmark text-lg" />
          </button>
        </div>

        {/* Receipt content */}
        <div className="overflow-y-auto flex-1 px-5 py-4 [scrollbar-width:none]">
          {/* Brand */}
          <div className="flex justify-between items-start pb-4 border-b border-slate-200 mb-4">
            <div>
              <p className="text-lg font-semibold text-slate-800">ShipFast</p>
              <p className="text-xs text-slate-500">Logistics & Delivery</p>
            </div>
            <div className="text-right">
              <span className={`flex gap-1 items-center ${paymentStatus === "REFUNDED" ? "bg-gray-100 text-gray-700":"bg-green-100 text-green-700"} text-xs px-3 py-1 rounded-full font-medium`}>
                <GiCheckMark /> {paymentStatus === "REFUNDED" ? paymentStatus:"Paid"}
              </span>
              <p className="text-xs text-slate-500 mt-2">{today}</p>
            </div>
          </div>

          {/* Payment details */}
          <p className="text-[10px] font-semibold text-slate-400 tracking-widest mb-3">
            PAYMENT DETAILS
          </p>
          <div className="space-y-2 mb-5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Payment ID</span>
              <span className="font-medium text-slate-700 text-xs">
                {razorpayPaymentId}
              </span>
            </div>
            {trackingId && (
              <div className="flex justify-between border-t border-slate-100 pt-2">
                <span className="text-slate-500">Tracking ID</span>
                <span className="font-medium text-slate-700 text-xs">
                  {trackingId}
                </span>
              </div>
            )}
          </div>

          {/* Price breakdown */}
          <p className="text-[10px] font-semibold text-slate-400 tracking-widest mb-3">
            PRICE BREAKDOWN
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Base rate</span>
              <span className="text-slate-700">₹{prices?.platformFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">
                Weight ({packageWeight}kg)
              </span>
              <span className="text-slate-700">₹{prices?.weightCharge}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Priority ({priority})</span>
              <span className="text-slate-700">₹{prices?.priorityCharge}</span>
            </div>
            {(prices?.fragileCharge ?? 0) > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-500">Fragile handling</span>
                <span className="text-slate-700">₹{prices?.fragileCharge}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-slate-200 pt-2">
              <span className="text-slate-500">Subtotal</span>
              <span className="text-slate-700">₹{prices?.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">GST (18%)</span>
              <span className="text-slate-700">₹{prices?.gst}</span>
            </div>
            <div className="flex justify-between border-t border-slate-300 pt-3">
              <span className="font-semibold text-slate-800 text-base">
                Total
              </span>
              <span className="font-semibold text-green-600 text-base">
                ₹{prices?.total}
              </span>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 text-center mt-6">
            System-generated receipt. No signature required.
          </p>
        </div>

        {/* Modal footer — download button */}
        <div className="px-5 py-4 border-t border-slate-100">
          <PDFDownloadLink
            document={
              <ReceiptPDF
                razorpayPaymentId={razorpayPaymentId}
                paymentStatus={paymentStatus}
                trackingId={trackingId}
                prices={prices}
                priority={priority}
                packageWeight={packageWeight}
                today={today}
              />
            }
            fileName={fileName}
            className="w-full h-11 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm"
          >
            {({ loading }) =>
              loading ? (
                "Generating PDF..."
              ) : (
                <>
                  <i className="fa-solid fa-download" />
                  Download Receipt (PDF)
                </>
              )
            }
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
}

export default ReceiptPreviewModal;