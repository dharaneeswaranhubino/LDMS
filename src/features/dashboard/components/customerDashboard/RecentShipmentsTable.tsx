import type { DashboardRecentShipment } from "../../../customerShipment/shipmentTypes";
import { fmtDate, PAYMENT_STATUS_CONFIG, SHIPMENT_STATUS_CONFIG } from "../../utils/CustomerDashboardHelper";
import Badge from "./Badge";

const RecentShipmentsTable = ({
  shipments,
}: {
  shipments: DashboardRecentShipment[];
}) => {
  if (!shipments.length) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">
        No shipments in this period.
      </p>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="pb-2.5 text-left text-[11px] font-medium text-gray-400">
              Item
            </th>
            <th className="pb-2.5 text-left text-[11px] font-medium text-gray-400">
              Tracking
            </th>
            <th className="pb-2.5 text-left text-[11px] font-medium text-gray-400">
              Status
            </th>
            <th className="pb-2.5 text-left text-[11px] font-medium text-gray-400">
              Payment
            </th>
            <th className="pb-2.5 text-left text-[11px] font-medium text-gray-400">
              ETA
            </th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((s) => (
            <tr
              key={s.shipmentId}
              className="border-b border-gray-50 last:border-0"
            >
              <td className="py-3 pr-4">
                <p className="font-medium text-gray-800">{s.itemName}</p>
                <p className="text-[11px] text-gray-400">
                  {s.deliveryAddress}, {s.deliveryCity}
                </p>
              </td>
              <td className="py-3 pr-4">
                <span className="font-mono text-[11px] text-gray-500">
                  {s.trackingId}
                </span>
              </td>
              <td className="py-3 pr-4">
                <Badge
                  status={s.shipmentStatus}
                  config={SHIPMENT_STATUS_CONFIG}
                />
              </td>
              <td className="py-3 pr-4">
                <Badge
                  status={s.paymentStatus}
                  config={PAYMENT_STATUS_CONFIG}
                />
              </td>
              <td className="py-3 text-[11px] text-gray-400">
                {s.estimatedDelivery ? fmtDate(s.estimatedDelivery) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RecentShipmentsTable;