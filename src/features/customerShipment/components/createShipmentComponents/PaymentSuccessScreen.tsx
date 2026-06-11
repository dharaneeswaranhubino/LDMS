import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { useAppSelector } from "../../../../shared/hooks/reduxHooks";
import ReceiptPDF from "./ReceiptPDF";
import ReceiptPreviewModal from "./ReceiptPreviewModal";

//Main Screen
const PaymentSuccessScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const { razorpayPaymentId, trackingId } = location.state ?? {};
  const { currentShipment } = useAppSelector((state) => state.shipment);
  const prices = currentShipment?.priceBreakdown;
  const priority = currentShipment?.shipmentPriority;
  const packageWeight = currentShipment?.packageWeight;

  useEffect(() => {
    if (!razorpayPaymentId) {
      navigate("/sendShipment", { replace: true });
    }
  }, [razorpayPaymentId, navigate]);

  if (!razorpayPaymentId || !prices) return null;

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const fileName = `ShipFast-Receipt-${razorpayPaymentId}.pdf`;

  return (
    <>
      {/* Preview Modal */}
      {showPreview && (
        <ReceiptPreviewModal
          onClose={() => setShowPreview(false)}
          razorpayPaymentId={razorpayPaymentId}
          trackingId={trackingId}
          prices={prices}
          priority={priority}
          packageWeight={packageWeight}
          today={today}
          fileName={fileName}
        />
      )}

      <div className="rounded-2xl min-h-screen bg-gradient-to-br from-slate-50 via-sky-200 to-purple-50 p-4">
        {/* Success card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-4 flex flex-col items-center gap-3 shadow-sm">
          <div className="text-green-500 text-5xl">
            <i className="fa-solid fa-circle-check"></i>
          </div>
          <p className="text-xl font-bold text-green-600">
            Payment Successful!
          </p>
          <p className="text-slate-500 text-sm">
            Payment ID: {razorpayPaymentId}
          </p>
          <p className="text-slate-600 text-center text-[14px]">
            Your shipment has been created. Admin will assign a delivery slot
            shortly.
          </p>

          {/* Preview/Download button row */}
          <div className="flex items-center gap-2 mt-2 w-full max-w-xs">
            {/* Preview button */}
            <button
              onClick={() => setShowPreview(true)}
              className="flex-1 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-eye" />
              Preview Receipt
            </button>

            {/* Direct download icon button */}
            <PDFDownloadLink
              document={
                <ReceiptPDF
                  razorpayPaymentId={razorpayPaymentId}
                  trackingId={trackingId}
                  prices={prices}
                  priority={priority}
                  packageWeight={packageWeight}
                  today={today}
                />
              }
              fileName={fileName}
              className="h-10 w-10 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all flex items-center justify-center flex-shrink-0"
              title="Download PDF directly"
            >
              {({ loading }) =>
                loading ? (
                  <i className="fa-solid fa-spinner animate-spin text-sm" />
                ) : (
                  <i className="fa-solid fa-download text-sm" />
                )
              }
            </PDFDownloadLink>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/sendShipment")}
            className="w-full h-11 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-medium transition-all"
          >
            <i className="fa-solid fa-plus mr-2"></i>
            Create New Shipment
          </button>
          <button
            onClick={() => navigate("/myShipments")}
            className="w-full h-11 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-medium transition-all"
          >
            <i className="fa-solid fa-box mr-2"></i>
            View My Shipments
          </button>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccessScreen;
