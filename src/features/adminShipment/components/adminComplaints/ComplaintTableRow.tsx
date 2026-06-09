import type { AdminComplaint } from "../../adminTypes";
import { Eye } from "lucide-react";
import {
  formatDate,
  STATUS_LABELS,
  STATUS_STYLES,
  SUBJECT_LABELS,
} from "../../utils/adminShipmentHelper";

interface Props {
  complaint: AdminComplaint;
  onView: () => void;
}

const ComplaintTableRow = ({ complaint, onView }: Props) => {
  const {
    complaintId,
    trackingId,
    subject,
    customer,
    assignedAgent,
    status,
    createdAt,
  } = complaint;

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

      <td className="px-2 py-4">
        <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 whitespace-nowrap rounded-full font-medium">
          {SUBJECT_LABELS[subject] ?? subject}
        </span>
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold flex items-center justify-center flex-shrink-0">
            {customer.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-slate-700 text-sm">{customer.name}</span>
        </div>
      </td>

      <td className="px-4 py-4">
        {assignedAgent ? (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 text-xs font-semibold flex items-center justify-content-center flex items-center justify-center flex-shrink-0">
              {assignedAgent.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-slate-700 text-sm">{assignedAgent.name}</span>
          </div>
        ) : (
          <span className="text-slate-400 text-xs italic">Unassigned</span>
        )}
      </td>

      <td className="px-4 py-4">
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[status]}`}
        >
          {STATUS_LABELS[status]}
        </span>
      </td>

      <td className="px-4 py-4 text-slate-400 text-xs">
        {formatDate(createdAt)}
      </td>

      <td className="px-4 py-4">
        <button
          onClick={onView}
          className="flex gap-1 text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all font-medium"
        >
          <Eye size={16} />
          View
        </button>
      </td>
    </tr>
  );
};

export default ComplaintTableRow;
