import type { RazorpayOptions } from "../features/shipment/shipmentTypes";
declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

export { };