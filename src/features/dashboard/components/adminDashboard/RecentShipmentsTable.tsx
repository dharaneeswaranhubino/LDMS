import type {
  RecentShipment,
  RecentShipmentsTableProps,
} from "../../../adminShipment/adminTypes";
import { PayBadge, StatusBadge } from "./StatusBadge";
import { FaClipboardList } from "react-icons/fa";

const RecentShipmentsTable = ({
  recentShipments,
}: RecentShipmentsTableProps) => {
  return (
    <div className="rounded-[14px] border border-sky-200/60 bg-white px-6 py-5 shadow-[0_2px_12px_rgba(6,182,212,0.08)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-sky-900">
            <FaClipboardList />
          </span>

          <span className="text-[15px] font-bold text-sky-900">
            Recent Shipments
          </span>
        </div>

        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
          Latest 5
        </span>
      </div>

      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            {["TRACKING ID", "CUSTOMER", "STATUS", "PAYMENT"].map((h) => (
              <th
                key={h}
                className="pb-2.5 text-left text-[11px] font-semibold tracking-[0.06em] text-slate-400"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {recentShipments.map((s: RecentShipment) => (
            <tr key={s.shipmentId} className="border-t border-slate-100">
              <td className="py-2.5 font-mono text-xs font-semibold text-cyan-600">
                {s.trackingId}
              </td>

              <td className="font-medium text-slate-700">{s.customerName}</td>

              <td>
                <StatusBadge status={s.shipmentStatus} />
              </td>

              <td>
                <PayBadge status={s.paymentStatus} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentShipmentsTable;
