import { Package } from "lucide-react";
import type { DashboardPaymentRecord } from "../../../customerShipment/shipmentTypes";
import { fmtAmt, fmtDate } from "../../utils/CustomerDashboardHelper";

const PaymentHistoryList = ({
  payments,
}: {
  payments: DashboardPaymentRecord[];
}) => {
  if (!payments.length) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">
        No payments in this period.
      </p>
    );
  }
  return (
    <div className="flex flex-col divide-y divide-gray-50">
      {payments.map((p) => (
        <div
          key={p.paymentId}
          className="flex items-center justify-between py-3"
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                p.paymentStatus === "PENDING"
                  ? "bg-amber-50"
                  : p.paymentStatus === "FAILED"
                    ? "bg-red-50"
                    : "bg-blue-50"
              }`}
            >
              <Package
                size={14}
                className={
                  p.paymentStatus === "PENDING"
                    ? "text-amber-600"
                    : p.paymentStatus === "FAILED"
                      ? "text-red-500"
                      : "text-blue-600"
                }
              />
            </div>
            <div>
              <p className="text-[13px] font-medium text-gray-800">
                Shipment #{p.shipmentId}
              </p>
              <p className="text-[11px] text-gray-400">
                {p.paidAt ? fmtDate(p.paidAt) : "Awaiting payment"}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-sm font-semibold text-gray-800">
              {fmtAmt(p.amount)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PaymentHistoryList;