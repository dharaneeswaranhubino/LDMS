import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useAppSelector } from "../../../../shared/hooks/reduxHooks";
import ReceiptPDF from "./ReceiptPDF";
import ReceiptPreviewModal from "./ReceiptPreviewModal";
import { BUBBLES, fireConfetti } from "../../utils/shipmentHelpers";

const PaymentSuccessScreen = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const firedRef  = useRef(false);
  const [showPreview, setShowPreview] = useState(false);
  const [checkVisible, setCheckVisible] = useState(false);

  const { razorpayPaymentId, trackingId } = location.state ?? {};
  const { currentShipment } = useAppSelector((state) => state.shipment);
  const prices        = currentShipment?.priceBreakdown;
  const priority      = currentShipment?.shipmentPriority;
  const packageWeight = currentShipment?.packageWeight;

  useEffect(() => {
    if (!razorpayPaymentId) {
      navigate("/sendShipment", { replace: true });
    }
  }, [razorpayPaymentId, navigate]);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    fireConfetti();
    setCheckVisible(true);

  }, []);

  if (!razorpayPaymentId || !prices) return null;

  const today = new Date().toLocaleDateString("en-IN", {
    day:   "2-digit",
    month: "short",
    year:  "numeric",
  });

  const fileName = `ShipFast-Receipt-${razorpayPaymentId}.pdf`;

  return (
    <>
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0)   scale(1);    opacity: var(--op); }
          50%  { transform: translateY(-55px) scale(1.08); opacity: calc(var(--op) * 0.7); }
          100% { transform: translateY(-110px) scale(0.9); opacity: 0; }
        }
        @keyframes popIn {
          0%   { transform: scale(0.3); opacity: 0; }
          60%  { transform: scale(1.18); opacity: 1; }
          80%  { transform: scale(0.92); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slideUp {
          0%   { transform: translateY(24px); opacity: 0; }
          100% { transform: translateY(0);    opacity: 1; }
        }
        .bubble {
          position: absolute;
          bottom: -40px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), transparent);
          border: 1px solid rgba(255,255,255,0.4);
          animation: floatUp var(--dur) var(--delay) ease-in-out infinite;
        }
        .pop-in    { animation: popIn   0.6s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .slide-up  { animation: slideUp 0.5s ease forwards; }
      `}</style>

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

      <div className="relative rounded-2xl min-h-screen bg-gradient-to-br from-slate-50 via-sky-200 to-purple-50 p-4 overflow-hidden">

        {BUBBLES.map((b, i) => (
          <span
            key={i}
            className="bubble"
            style={{
              width:     b.size,
              height:    b.size,
              left:      b.left,
              "--op":    b.opacity,
              "--dur":   b.duration,
              "--delay": b.delay,
            } as React.CSSProperties}
          />
        ))}

        <div className="relative bg-white border border-slate-200 rounded-2xl p-8 mb-4 flex flex-col items-center gap-3 shadow-sm overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/60 via-transparent to-sky-50/40 pointer-events-none rounded-2xl" />
          <div
            className={`text-green-500 text-5xl ${checkVisible ? "pop-in" : "opacity-0"}`}
          >
            <i className="fa-solid fa-circle-check" />
          </div>
          <p
            className="text-xl font-bold text-green-600 slide-up"
            style={{ animationDelay: "0.15s", opacity: 0 }}
          >
            Payment Successful!
          </p>

          <p
            className="text-slate-500 text-sm slide-up"
            style={{ animationDelay: "0.25s", opacity: 0 }}
          >
            Payment ID:{" "}
            <span className="font-mono font-medium text-slate-600">
              {razorpayPaymentId}
            </span>
          </p>

          {trackingId && (
            <p
              className="text-slate-500 text-sm slide-up"
              style={{ animationDelay: "0.32s", opacity: 0 }}
            >
              Tracking ID:{" "}
              <span className="font-mono font-medium text-indigo-500">
                {trackingId}
              </span>
            </p>
          )}

          <p
            className="text-slate-600 text-center text-[14px] slide-up"
            style={{ animationDelay: "0.38s", opacity: 0 }}
          >
            Your shipment has been created. Admin will assign a delivery slot
            shortly.
          </p>

          <div
            className="flex items-center gap-2 mt-2 w-full max-w-xs slide-up"
            style={{ animationDelay: "0.45s", opacity: 0 }}
          >
            <button
              onClick={() => setShowPreview(true)}
              className="flex-1 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-eye" />
              Preview Receipt
            </button>

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

        <div
          className="flex flex-col gap-3 slide-up"
          style={{ animationDelay: "0.52s", opacity: 0 }}
        >
          <button
            onClick={() => navigate("/sendShipment")}
            className="w-full h-11 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-medium transition-all"
          >
            <i className="fa-solid fa-plus mr-2" />
            Create New Shipment
          </button>
          <button
            onClick={() => navigate("/myShipments")}
            className="w-full h-11 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-medium transition-all"
          >
            <i className="fa-solid fa-box mr-2" />
            View My Shipments
          </button>
        </div>

      </div>
    </>
  );
};

export default PaymentSuccessScreen;