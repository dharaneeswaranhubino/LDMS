import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSound from "use-sound";
import notificationSound from "../../../../assets/universfield-new-notification-051-494246.mp3"
interface PriceBreakdownProps {
  prevStep: () => void;
  onPaymentSuccess: (amount: number) => void;
  packageDetails: {
    weight: string;
    fragile: boolean;
    priority: string;
  };
  onReset: () => void;
}

// const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

const PRIORITY_MULTIPLIERS: Record<string, number> = {
  STANDARD: 1,
  EXPRESS: 1.3,
  SAME_DAY: 1.8,
};

const BASE_RATE = 50;
const RATE_PER_KG = 20;
const FRAGILE_CHARGE = 50;
const GST_RATE = 0.18;

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");

    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PriceBreakdown = ({
  prevStep,
  onPaymentSuccess,
  packageDetails,
  onReset,
}: PriceBreakdownProps) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "success" | "failed"
  >("idle");

  const [paymentId, setPaymentId] = useState("");
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

  useEffect(() => {
    loadRazorpayScript().then((loaded) => setScriptLoaded(loaded));
  }, []);

  const handlePayment = () => {
    
    // if (!scriptLoaded) {
    //   alert("Payment gateway is loading. Please wait and try again.");
    //   return;
    // }

    // if (retryCount >= 3) {
    //   alert("Maximum retries reached.");
    //   return;
    // }
    onPaymentSuccess(totalAmount);
    setPaymentStatus("success");

    // const options: RazorpayOptions = {
    //   key: RAZORPAY_KEY_ID,
    //   amount: totalAmount * 100,
    //   currency: "INR",
    //   name: "ShipFast",
    //   description: "Shipment Payment",

    //   handler: function (response: RazorpayResponse) {
    //     setPaymentId(response.razorpay_payment_id);
    //     setPaymentStatus("success");
    //     onPaymentSuccess(
    //       response.razorpay_payment_id,
    //       totalAmount
    //     );
    //   },

    //   prefill: {
    //     name: "Test User",
    //     email: "test@example.com",
    //     contact: "9999999999",
    //   },

    //   theme: {
    //     color: "#3b82f6",
    //   },

    //   modal: {
    //     ondismiss: () => {
    //       setRetryCount((prev) => prev + 1);
    //       setPaymentStatus("failed");
    //     },
    //   },
    // };

    // const rzp = new window.Razorpay(options);
    // rzp.open();
    const audio = new Audio(notificationSound);
    // audio.volume = 0.7;
    audio.play();
    toast.success("Shipment Created Successfully!");
  };

  // SUCCESS SCREEN
  if (paymentStatus === "success") {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 mt-4 flex flex-col items-center gap-4 shadow-sm">
        <div className="text-green-500 text-5xl">
          <i className="fa-solid fa-circle-check"></i>
        </div>

        <p className="text-xl font-bold text-green-600">Payment Successful!</p>

        <p className="text-slate-500 text-sm">Payment ID: {paymentId}</p>

        <p className="text-slate-600 text-center text-[14px]">
          Your shipment has been created successfully. Admin will assign a
          delivery slot shortly.
        </p>

        <button
          type="button"
          onClick={onReset}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-all"
        >
          <i className="fa-solid fa-plus mr-2"></i>
          Create New Shipment
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 mt-4 shadow-sm">
      <form>
        {/* TITLE */}
        <p className="text-[18px] font-semibold text-slate-800 flex items-center gap-2">
          <i className="fa-solid fa-receipt text-blue-500"></i>
          Price breakdown
        </p>

        {/* PRICE DETAILS */}
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

        {/* GST */}
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

        {/* TOTAL */}
        <div className="flex justify-between gap-2 mt-6 text-blue-700 bg-blue-50 p-3 rounded-lg font-semibold">
          <p>Total</p>

          <p>₹{totalAmount}</p>
        </div>

        {/* FAILED */}
        {paymentStatus === "failed" && retryCount < 3 && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm">
            <i className="fa-solid fa-triangle-exclamation mr-2"></i>
            Payment not completed. You have {3 - retryCount} attempt(s) left.
          </div>
        )}

        {/* PAYMENT BUTTON */}
        <div className="mt-5">
          <button
            type="button"
            onClick={handlePayment}
            disabled={retryCount >= 3}
            className="w-full h-11 bg-green-500 hover:bg-green-600 text-white rounded-lg text-[14px] font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <i className="fa-regular fa-credit-card mr-2"></i>

            {retryCount >= 3 ? "Payment limit reached" : "Proceed to payment"}
          </button>
        </div>

        <p className="text-[12px] text-slate-500 mt-3">
          Payment required before admin assignment. You can retry up to 3 times
          if payment fails.
        </p>

        {/* BACK BUTTON */}
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
