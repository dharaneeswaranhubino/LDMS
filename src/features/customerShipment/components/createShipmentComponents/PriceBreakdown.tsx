import { useState } from "react";
import { toast } from "react-toastify";
import notificationSound from "../../../../assets/universfield-new-notification-051-494246.mp3";
import { useAppDispatch } from "../../../../shared/hooks/reduxHooks";
import {
  createShipment,
  initiatePayment,
  verifyPayment,
} from "../../shipmentSlice";
import type {
  PriceBreakdownProps,
  RazorpayOptions,
  RazorpayResponse,
} from "../../shipmentTypes";
import {
  BASE_RATE,
  FRAGILE_CHARGE,
  GST_RATE,
  loadRazorpayScript,
  unloadRazorpayScript,
  PRIORITY_MULTIPLIERS,
  RATE_PER_KG,
} from "../../utils/shipmentHelpers";
import { useNavigate } from "react-router-dom";

const PriceBreakdown = ({
  prevStep,
  packageDetails,
  pickUpAddress,
  deliveryAddress,
  // onReset,
}: PriceBreakdownProps) => {
  const dispatch = useAppDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shipmentId, setShipmentId] = useState<number | null>(null);
  const [_razorpayPaymentId, setRazorpayPaymentId] = useState("");

  const [retryCount, setRetryCount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "verifying" | "success" | "failed"
  >("idle");

  const navigate = useNavigate();

  const weight = parseFloat(packageDetails.weight) || 0;
  const weightCharge = weight * RATE_PER_KG;
  const multiplier = PRIORITY_MULTIPLIERS[packageDetails.priority] ?? 1;
  const priorityCharge = Math.round(
    (BASE_RATE + weightCharge) * (multiplier - 1),
  );

  const fragileCharge = packageDetails.fragile ? FRAGILE_CHARGE : 0;
  const subtotal = BASE_RATE + weightCharge + priorityCharge + fragileCharge;
  const gst = Math.round(subtotal * GST_RATE);
  const totalAmount = subtotal + gst;

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

      let currentShipmentId = shipmentId;
      let trackingId: string | null = null;

      if (!currentShipmentId) {
        const shipment = await dispatch(
          createShipment({
            pickUpAddress,
            deliveryAddress,
            packageDetails,
            amount: totalAmount,
          }),
        ).unwrap();
        currentShipmentId = shipment.shipmentId;
        trackingId = shipment.trackingId ?? null;
        setShipmentId(currentShipmentId);
      }

      const payment = await dispatch(
        initiatePayment(currentShipmentId),
      ).unwrap();

      const options: RazorpayOptions = {
        key: payment.keyId,
        amount: payment.amount,
        currency: payment.currency,
        name: "ShipFast",
        description: "Shipment Payment",
        order_id: payment.orderId,
        handler: async function (response: RazorpayResponse) {
          try {
            setPaymentStatus("verifying");
            await dispatch(
              verifyPayment({
                shipmentId: currentShipmentId!,
                payload: {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                },
              }),
            ).unwrap();

            unloadRazorpayScript();

            setRazorpayPaymentId(response.razorpay_payment_id);
            setPaymentStatus("success");
            const audio = new Audio(notificationSound);
            audio.play();
            toast.success("Payment successful! Shipment created.");
            navigate("/paymentSuccess", {
              state: {
                razorpayPaymentId: response.razorpay_payment_id,
                trackingId: trackingId,
                breakdown: {
                  base: BASE_RATE,
                  weightKg: weight,
                  weight: weightCharge,
                  priorityType: packageDetails.priority,
                  priority: priorityCharge,
                  fragile: fragileCharge,
                  subtotal,
                  gst,
                  total: totalAmount,
                },
              },
              replace: true,
            });
          } catch (error) {
            console.error(error);
            setRetryCount((prev) => prev + 1);
            setPaymentStatus("failed");
            toast.error("Payment verification failed");
          }
        },
        theme: { color: "#3b82f6" },
        modal: {
          ondismiss: () => {
            setRetryCount((prev) => prev + 1);
            setPaymentStatus("failed");
            toast.error("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      setRetryCount((prev) => prev + 1);
      setPaymentStatus("failed");
      toast.error("Payment initiation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentStatus === "verifying") {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 mt-4 flex flex-col items-center gap-4 shadow-sm">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>

        <p className="text-xl font-semibold text-slate-700">
          Verifying payment...
        </p>

        <p className="text-slate-500 text-sm text-center">
          Please wait while we confirm your payment securely.
        </p>
      </div>
    );
  }

  // if (paymentStatus === "success") {
  //   return (
  //     <div className="bg-white border border-slate-200 rounded-2xl p-8 mt-4 flex flex-col items-center gap-4 shadow-sm">
  //       <div className="text-green-500 text-5xl">
  //         <i className="fa-solid fa-circle-check"></i>
  //       </div>

  //       <p className="text-xl font-bold text-green-600">Payment Successful!</p>

  //       <p className="text-slate-500 text-sm">
  //         Payment ID: {razorpayPaymentId}
  //       </p>

  //       <p className="text-slate-600 text-center text-[14px]">
  //         Your shipment has been created successfully. Admin will assign a
  //         delivery slot shortly.
  //       </p>

  //       <button
  //         type="button"
  //         onClick={onReset}
  //         className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-all"
  //       >
  //         <i className="fa-solid fa-plus mr-2"></i>
  //         Create New Shipment
  //       </button>
  //     </div>
  //   );
  // }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 mt-4 shadow-sm">
      <form>
        <p className="text-[18px] font-semibold text-slate-800 flex items-center gap-2">
          <i className="fa-solid fa-receipt text-blue-500"></i>
          Price breakdown
        </p>

        <div className="px-1 mt-5 space-y-4">
          <div className="flex justify-between border-b border-slate-200 pb-3">
            <p className="text-slate-600">Base rate</p>
            <p className="font-medium text-slate-800">₹{BASE_RATE}</p>
          </div>

          <div className="flex justify-between border-b border-slate-200 pb-3">
            <p className="text-slate-600">
              Weight ({weight}kg × ₹{RATE_PER_KG})
            </p>
            <p className="font-medium text-slate-800">₹{weightCharge}</p>
          </div>

          <div className="flex justify-between border-b border-slate-200 pb-3">
            <p className="text-slate-600">
              Priority ({packageDetails.priority})
            </p>

            <p className="font-medium text-slate-800">₹{priorityCharge}</p>
          </div>

          {packageDetails.fragile && (
            <div className="flex justify-between border-b border-slate-200 pb-3">
              <p className="text-slate-600">Fragile handling</p>

              <p className="font-medium text-slate-800">₹{FRAGILE_CHARGE}</p>
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
          <p>₹{totalAmount}</p>
        </div>

        {paymentStatus === "failed" && retryCount < 3 && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm">
            <i className="fa-solid fa-triangle-exclamation mr-2"></i>
            Payment not completed. You have {3 - retryCount} attempt(s) left.
          </div>
        )}

        <div className="mt-5">
          <button
            type="button"
            onClick={handlePayment}
            disabled={retryCount >= 3}
            className="w-full h-11 bg-green-500 hover:bg-green-600 text-white rounded-lg text-[14px] font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <i className="fa-regular fa-credit-card mr-2"></i>

            {isProcessing
              ? "Processing..."
              : retryCount >= 3
                ? "Payment limit reached"
                : "Proceed to payment"}
          </button>
        </div>

        <p className="text-[12px] text-slate-500 mt-3">
          Payment required before admin assignment. You can retry up to 3 times
          if payment fails.
        </p>

        <div className="w-full flex justify-start mt-8">
          <button
            type="button"
            onClick={prevStep}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 px-4 rounded-lg transition-all"
          >
            <i className="fa-solid fa-angle-left mr-2"></i>
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default PriceBreakdown;
