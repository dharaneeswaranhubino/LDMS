import { useAppDispatch } from "../../../../shared/hooks/reduxHooks";
import { setSelectedComplaint } from "../../adminSlice";
import { type ComplaintTableProps } from "../../adminTypes";
import { ComplaintTable_HEADS } from "../../utils/adminShipmentHelper";
import ComplaintTableRow from "./ComplaintTableRow";

const ComplaintTable = ({
  complaints,
  complaintsLoading,
}: ComplaintTableProps) => {
  const dispatch = useAppDispatch();

  if (complaintsLoading) {
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
    // <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
    //   <div className="overflow-x-auto">
    //     <table className="w-full text-sm">
    //         <thead>
    //           <tr className="bg-slate-50 border-b border-slate-100">
    //             {ComplaintTable_HEADS.map((h) => (
    //               <th
    //                 key={h.label}
    //                 className={`${h.width} px-4 py-3 text-left text-xs font-semibold text-slate-500 tracking-wide`}
    //               >
    //                 {h.label}
    //               </th>
    //             ))}
    //           </tr>
    //         </thead>
    //         <tbody className="divide-y divide-slate-50">
    //           {complaints.map((complaint) => (
    //             <ComplaintTableRow
    //               key={complaint.complaintId}
    //               complaint={complaint}
    //               onView={() => dispatch(setSelectedComplaint(complaint))}
    //             />
    //           ))}
    //         </tbody>
    //     </table>
    //   </div>
    // </div>
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            {ComplaintTable_HEADS.map((h) => (
              <th
                key={h.label}
                className={`${h.width} px-4 py-3 text-left text-xs font-semibold text-slate-500 tracking-wide`}
              >
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
      </table>

      <div className="overflow-x-auto overflow-y-auto max-h-[300px] scrollbar-none touch-pan-x">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-slate-50">
            {complaints.map((complaint) => (
              <ComplaintTableRow
                key={complaint.complaintId}
                complaint={complaint}
                onView={() => dispatch(setSelectedComplaint(complaint))}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplaintTable;
