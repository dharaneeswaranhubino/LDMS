import type { MyComplaint } from "../../shipmentTypes";
import MyComplaintTableRow from "./MyComplaintTableRow";

const HEADS = [
  { label: "ID", width: "w-[70px]" },
  { label: "Tracking ID", width: "w-[170px]" },
  { label: "Subject", width: "w-[150px]" },
  { label: "Description", width: "w-[200px]" },
  { label: "Status", width: "w-[110px]" },
  { label: "Raised on", width: "w-[110px]" },
];

interface Props {
  complaints: MyComplaint[];
  loading: boolean;
}

const MyComplaintTable = ({ complaints, loading }: Props) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 bg-white rounded-2xl border border-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading complaints...</p>
        </div>
      </div>
    );
  }

  if (complaints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-100 gap-3">
        <p className="text-slate-400 text-sm">No complaints found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-x-auto">
      <table className="w-full text-sm table-fixed">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            {HEADS.map((h) => (
              <th
                key={h.label}
                className={`${h.width} px-4 py-3 text-left text-xs font-semibold text-slate-500 tracking-wide`}
              >
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {complaints.map((c) => (
            <MyComplaintTableRow key={c.complaintId} complaint={c} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyComplaintTable;