import type {
  ComplaintStatus,
  CustomerComplaint,
  CustomerComplaintsProps,
} from "../../../adminShipment/adminTypes";
import { timeAgo } from "../../utils/AdminDashboardHelper";
import { COMPLAINT_COLORS, STATUS_COLORS } from "./StatusBadge";
import { FaBoxTissue } from "react-icons/fa";

const CustomerComplaints = ({ complaints }: CustomerComplaintsProps) => {
  const openComplaints = complaints.filter((c) => c.status === "OPEN").length;

  return (
    <div className="rounded-[14px] border border-sky-200/60 bg-white px-6 py-5 shadow-[0_2px_12px_rgba(6,182,212,0.08)]">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-sky-900">
            <FaBoxTissue />
          </span>

          <span className="text-[15px] font-bold text-sky-900">
            Customer Complaint Monitoring
          </span>
        </div>

        {openComplaints > 0 && (
          <span className="rounded-md bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
            {openComplaints} open
          </span>
        )}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {complaints.map((c: CustomerComplaint) => {
          const cc = COMPLAINT_COLORS[c.status as ComplaintStatus];
          const sc = STATUS_COLORS[c.shipmentStatus];

          return (
            <div
              key={c.id}
              className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-[14px] transition-shadow duration-150 hover:shadow-[0_4px_16px_rgba(6,182,212,0.12)]"
            >
              {/* Top Row */}
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-cyan-600">
                  {c.trackingId}
                </span>

                <span
                  className={`rounded px-2 py-0.5 text-[11px] font-bold ${cc.className}`}
                >
                  {c.status.charAt(0) + c.status.slice(1).toLowerCase()}
                </span>
              </div>

              {/* Message */}
              <p className="mb-2.5 text-[13px] italic leading-relaxed text-slate-600">
                "{c.message}"
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {c.customerName} · {timeAgo(c.createdAt)}
                </span>

                <span
                  className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                    sc?.className ?? "bg-slate-100 text-slate-500"
                  }`}
                >
                  {sc?.label ?? c.shipmentStatus}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerComplaints;
