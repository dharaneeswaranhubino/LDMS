import type {
  CustomerComplaintsProps,
  DashboardComplaint,
} from "../../../adminShipment/adminTypes";
import { STATUS_COLORS, timeAgo } from "../../utils/AdminDashboardHelper";
import { FaBoxTissue } from "react-icons/fa";

const COMPLAINT_STATUS_STYLES: Record<
  string,
  { className: string; label: string }
> = {
  OPEN: {
    className: "bg-red-100 text-red-700",
    label: "Open",
  },
  IN_REVIEW: {
    className: "bg-yellow-100 text-yellow-700",
    label: "In Review",
  },
  RESOLVED: {
    className: "bg-green-100 text-green-700",
    label: "Resolved",
  },
};

const CustomerComplaints = ({ complaints }: CustomerComplaintsProps) => {
  const openCount = complaints.filter((c) => c.status === "OPEN").length;

  return (
    <div className="rounded-[14px] border border-sky-200/60 bg-white px-6 py-5 shadow-[0_2px_12px_rgba(6,182,212,0.08)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-sky-900">
            <FaBoxTissue />
          </span>

          <span className="text-[15px] font-bold text-sky-900">
            Customer Complaint Monitoring
          </span>
        </div>

        {openCount > 0 && (
          <span className="rounded-md bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
            {openCount} open
          </span>
        )}
      </div>

      {complaints.length === 0 && (
        <p className="py-6 text-center text-sm text-slate-400">
          No complaints found for this period.
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {complaints.map((c: DashboardComplaint) => {
          const cs =
            COMPLAINT_STATUS_STYLES[c.status] ?? {
              className: "bg-slate-100 text-slate-500",
              label: c.status,
            };
          const ss = STATUS_COLORS[c.shipmentStatus];

          return (
            <div
              key={c.complaintId}
              className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-[14px] transition-shadow duration-150 hover:shadow-[0_4px_16px_rgba(6,182,212,0.12)]"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-cyan-600">
                  {c.trackingId}
                </span>

                <span
                  className={`rounded px-2 py-0.5 text-[11px] font-bold ${cs.className}`}
                >
                  {cs.label}
                </span>
              </div>

              <p className="mb-2.5 text-[13px] italic leading-relaxed text-slate-600">
                "{c.message}"
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {c.customerName} · {timeAgo(c.createdAt)}
                </span>

                <span
                  className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                    ss?.className ?? "bg-slate-100 text-slate-500"
                  }`}
                >
                  {ss?.label ?? c.shipmentStatus}
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