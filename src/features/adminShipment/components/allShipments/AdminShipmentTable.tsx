import { memo } from "react";
import Pagination from "../../../../shared/components/Pagination";
import type { AllShipments } from "../../adminTypes";
import AdminShipmentTableRow from "./AdminShipmentTableRow";

interface Props {
  shipments: AllShipments[];
  shipmentsLoading: boolean;
  searchQuery: string;
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onView: (shipment: AllShipments) => void;
  onComplete: (shipment: AllShipments) => void;
}

const TABLE_HEADERS = [
  "Shipment",
  "Customer",
  "Route",
  "Priority",
  "Status",
  "Agent / Slot",
  "Amount",
  "Date",
  "Action",
];

const AdminShipmentTable = ({
  shipments,
  shipmentsLoading,
  searchQuery,
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
  onView,
  onComplete,
}: Props) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto overflow-y-auto max-h-[420px] scrollbar-none touch-pan-x">
        <table className="w-full text-[12px]" style={{ minWidth: "900px" }}>
          <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
            <tr>
              {TABLE_HEADERS.map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {shipmentsLoading ? (
              <tr>
                <td colSpan={9} className="text-center py-16 text-slate-400">
                  <i className="fa-solid fa-spinner fa-spin text-3xl mb-3 block text-indigo-400" />
                  <p className="text-[13px]">Loading shipments…</p>
                </td>
              </tr>
            ) : shipments.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-16 text-slate-400">
                  <i className="fa-solid fa-box-open text-4xl mb-3 block text-slate-300" />
                  <p className="text-[13px]">
                    {searchQuery
                      ? `No shipments match "${searchQuery}"`
                      : "No shipments found"}
                  </p>
                </td>
              </tr>
            ) : (
              shipments.map((s) => (
                <AdminShipmentTableRow
                  key={s.shipmentId}
                  shipment={s}
                  onView={onView}
                  onComplete={onComplete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {!shipmentsLoading && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      )}
    </div>
  );
};

export default memo(AdminShipmentTable);