import { useState } from "react";
import { toast } from "react-toastify";
import notificationSound from "../../../../assets/universfield-new-notification-051-494246.mp3";
import { useAppDispatch } from "../../../../shared/hooks/reduxHooks";
import { initiatePayment, verifyPayment } from "../../shipmentSlice";
import type {
  PriceBreakdownProps,
  RazorpayOptions,
  RazorpayResponse,
} from "../../shipmentTypes";
import {
  loadRazorpayScript,
  unloadRazorpayScript,
} from "../../utils/shipmentHelpers";
import { useNavigate } from "react-router-dom";

const PriceBreakdown = ({
  prevStep,
  shipmentId,
  trackingId,
  priceBreakdown,
  packageWeight,
  priority,
}: PriceBreakdownProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "verifying" | "success" | "failed"
  >("idle");

  const {
    platformFee,
    weightCharge,
    priorityCharge,
    fragileCharge,
    subtotal,
    gst,
    total,
  } = priceBreakdown;

  const handlePayment = async () => {
    try {
      if (retryCount >= 3) {
        toast.error("Maximum retries reached");
        return;
      }

      setIsProcessing(true);

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Payment gateway failed to load. Try again.");
        setIsProcessing(false);
        return;
      }

      const payment = await dispatch(initiatePayment(shipmentId)).unwrap();

      const options: RazorpayOptions = {
        key: payment.keyId,
        amount: payment.amount,
        currency: payment.currency,
        name: "ShipFast",
        description: "Shipment Payment",
        order_id: payment.orderId,
        handler: async (response: RazorpayResponse) => {
          try {
            setPaymentStatus("verifying");
            await dispatch(
              verifyPayment({
                shipmentId,
                payload: {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                },
              }),
            ).unwrap();

            unloadRazorpayScript();
            setPaymentStatus("success");
            new Audio(notificationSound).play();
            toast.success("Payment successful! Shipment created.");

            navigate("/paymentSuccess", {
              state: {
                razorpayPaymentId: response.razorpay_payment_id,
                trackingId,
                breakdown: {
                  base: platformFee,
                  weightKg: packageWeight,
                  weight: weightCharge,
                  priorityType: priority,
                  priority: priorityCharge,
                  fragile: fragileCharge,
                  subtotal,
                  gst,
                  total,
                },
              },
              replace: true,
            });
          } catch {
            setRetryCount((p) => p + 1);
            setPaymentStatus("failed");
            toast.error("Payment verification failed");
          }
        },
        theme: { color: "#3b82f6" },
        modal: {
          ondismiss: () => {
            setRetryCount((p) => p + 1);
            setPaymentStatus("failed");
            toast.error("Payment cancelled");
          },
        },
      };

      if (!window.Razorpay) {
        toast.error("Payment gateway not available. Please try again.");
        setIsProcessing(false);
        return;
      }
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch {
      setRetryCount((p) => p + 1);
      setPaymentStatus("failed");
      toast.error("Payment initiation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentStatus === "verifying") {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 mt-4 flex flex-col items-center gap-4 shadow-sm">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-xl font-semibold text-slate-700">
          Verifying payment...
        </p>
        <p className="text-slate-500 text-sm text-center">
          Please wait while we confirm your payment securely.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 mt-4 shadow-sm">
      <p className="text-[18px] font-semibold text-slate-800 flex items-center gap-2">
        <i className="fa-solid fa-receipt text-blue-500" />
        Price breakdown
      </p>

      <div className="px-1 mt-5 space-y-4">
        <div className="flex justify-between border-b border-slate-200 pb-3">
          <p className="text-slate-600">Platform fee</p>
          <p className="font-medium text-slate-800">₹{platformFee}</p>
        </div>

        <div className="flex justify-between border-b border-slate-200 pb-3">
          <p className="text-slate-600">Weight ({packageWeight}kg × rate)</p>
          <p className="font-medium text-slate-800">₹{weightCharge}</p>
        </div>

        <div className="flex justify-between border-b border-slate-200 pb-3">
          <p className="text-slate-600">Priority ({priority})</p>
          <p className="font-medium text-slate-800">₹{priorityCharge}</p>
        </div>

        {fragileCharge > 0 && (
          <div className="flex justify-between border-b border-slate-200 pb-3">
            <p className="text-slate-600">Fragile handling</p>
            <p className="font-medium text-slate-800">₹{fragileCharge}</p>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex justify-between border-b border-slate-200 pb-3">
          <p className="text-slate-600">Subtotal</p>
          <p className="font-medium text-slate-800">₹{subtotal}</p>
        </div>

        <div className="flex justify-between border-b border-slate-200 pb-3">
          <p className="text-slate-600">GST (18%)</p>
          <p className="font-medium text-slate-800">₹{gst}</p>
        </div>
      </div>

      <div className="flex justify-between gap-2 mt-6 text-blue-700 bg-blue-50 p-3 rounded-lg font-semibold">
        <p>Total</p>
        <p>₹{total}</p>
      </div>

      {paymentStatus === "failed" && retryCount < 3 && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm">
          <i className="fa-solid fa-triangle-exclamation mr-2" />
          Payment not completed. You have {3 - retryCount} attempt(s) left.
        </div>
      )}

      <div className="mt-5">
        <button
          type="button"
          onClick={handlePayment}
          disabled={retryCount >= 3 || isProcessing}
          className="w-full h-11 bg-green-500 hover:bg-green-600 text-white rounded-lg text-[14px] font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <i className="fa-regular fa-credit-card mr-2" />
          {isProcessing
            ? "Processing..."
            : retryCount >= 3
              ? "Payment limit reached"
              : "Proceed to payment"}
        </button>
      </div>

      <p className="text-[12px] text-slate-500 mt-3">
        Payment required before admin assignment. You can retry up to 3 times if
        payment fails.
      </p>

      <div className="w-full flex justify-start mt-8">
        <button
          type="button"
          onClick={prevStep}
          className="bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 px-4 rounded-lg transition-all"
        >
          <i className="fa-solid fa-angle-left mr-2" />
          Back
        </button>
      </div>
    </div>
  );
};

export default PriceBreakdown;
