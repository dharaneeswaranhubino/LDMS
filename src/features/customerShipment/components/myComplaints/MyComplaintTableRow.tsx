import type { MyComplaint } from "../../shipmentTypes";
import { formatDate } from "../../utils/shipmentHelpers";

const SUBJECT_LABELS: Record<string, string> = {
  PACKAGE_NOT_DELIVERED: "Package not delivered",
  DAMAGED_PACKAGE: "Damaged package",
  WRONG_ITEM_DELIVERED: "Wrong item delivered",
  DELIVERY_DELAYED: "Delivery delayed",
  AGENT_BEHAVIOUR: "Agent behaviour",
  PARTIAL_DELIVERY: "Partial delivery",
  LOST_PACKAGE: "Lost package",
  PAYMENT_ISSUE: "Payment issue",
  OTHER: "Other",
};

const STATUS_STYLES: Record<string, string> = {
  OPEN: "bg-red-50 text-red-600 border border-red-200",
  IN_REVIEW: "bg-amber-50 text-amber-600 border border-amber-200",
  RESOLVED: "bg-green-50 text-green-600 border border-green-200",
};

const STATUS_LABELS: Record<string, string> = {
  OPEN: "Open",
  IN_REVIEW: "In Review",
  RESOLVED: "Resolved",
};

interface Props {
  complaint: MyComplaint;
}

const MyComplaintTableRow = ({ complaint }: Props) => {
  const { complaintId, trackingId, subject, description, status, createdAt } =
    complaint;

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-4 py-4 text-slate-400 text-xs font-medium">
        #{complaintId}
      </td>
      <td className="px-4 py-4">
        <span className="text-xs text-slate-500 font-mono">
          {trackingId.length > 24
            ? `${trackingId.slice(0, 24)}...`
            : trackingId}
        </span>
      </td>
      <td className="px-4 py-4">
        <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
          {SUBJECT_LABELS[subject] ?? subject}
        </span>
      </td>
      <td className="px-4 py-4 max-w-[200px]">
        <p className="text-xs text-slate-500 truncate">{description}</p>
      </td>
      <td className="px-4 py-4">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[status]}`}>
          {STATUS_LABELS[status]}
        </span>
      </td>
      <td className="px-4 py-4 text-slate-400 text-xs whitespace-nowrap">
        {formatDate(createdAt)}
      </td>
    </tr>
  );
};

export default MyComplaintTableRow;