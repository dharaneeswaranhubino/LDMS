import { useEffect, useMemo, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../shared/hooks/reduxHooks";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";
import Pagination from "../../../shared/components/Pagination";
import {
  fetchMyPayments,
  fetchPaymentDetails,
  fetchShipmentById,
} from "../shipmentSlice";
import { formatDateTime, getStatusStyle } from "../utils/shipmentHelpers";
import ReceiptPreviewModal from "../components/createShipmentComponents/ReceiptPreviewModal";

const PaymentDetails = () => {
  const dispatch = useAppDispatch();
  const { payments, loading, paymentDetails, currentShipment } = useAppSelector(
    (state) => state.shipment,
  );

  console.log("paymentDetails.paidAt :", paymentDetails);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showPreview, setShowPreview] = useState(false);

  const trackingId = currentShipment?.trackingId;
  const prices = currentShipment?.priceBreakdown;
  console.log("prices :", prices);

  const priority = currentShipment?.shipmentPriority;
  const packageWeight = currentShipment?.packageWeight;
  const fileName = `ShipFast-Receipt-${paymentDetails?.razorpayPaymentId}.pdf`;

  useEffect(() => {
    dispatch(fetchMyPayments());
  }, [dispatch]);

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.trackingId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || p.paymentStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [payments, searchQuery, statusFilter]);

  const totalFiltered = filteredPayments.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / limit));
  const currentPage = Math.min(page, totalPages);

  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return filteredPayments.slice(start, start + limit);
  }, [filteredPayments, currentPage, limit]);
  const filterKey = `${searchQuery}|${statusFilter}|${limit}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const downloadCLick = async (shipmentId: number) => {
    await Promise.all([
      dispatch(fetchShipmentById(shipmentId)),
      dispatch(fetchPaymentDetails(shipmentId)),
    ]);

    // setShowPreview(true);
  };

  if (loading && payments.length === 0) {
    return (
      <div className="h-[calc(100vh-72px)] overflow-y-auto rounded-lg bg-gradient-to-br from-sky-50 via-cyan-100 to-indigo-50 scrollbar-none">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="rounded-2xl h-[calc(100vh-72px)] overflow-y-auto bg-gradient-to-br from-sky-50 via-cyan-100 to-indigo-50 p-5 scrollbar-none">
      <div>
        <h1 className="text-2xl font-semibold text-slate-700">
          Payment History
        </h1>
        <p className="mt-1 text-[14px] text-slate-500">
          Track all your shipment payments and download receipts
        </p>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row gap-2">
        <div className="flex items-center gap-2 border bg-white rounded-xl h-10 px-3 shadow-sm flex-1 w-full">
          <i className="fa-solid fa-magnifying-glass text-slate-400 text-[14px]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by tracking ID"
            className="bg-transparent outline-none text-[13px] h-10 text-slate-700 placeholder-slate-400 w-full"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-200 bg-white rounded-xl h-10 px-3 text-[13px] text-slate-600 outline-none shadow-sm w-full sm:w-44"
        >
          <option value="">All Status</option>
          <option value="PAID">Paid</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      <div className="mt-5 rounded-3xl border border-cyan-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[450px] overflow-y-auto scrollbar-none">
          <table className="w-full border-collapse min-w-[800px]">
            <thead className="bg-sky-50 sticky top-0 z-10">
              <tr className="text-[10px] uppercase tracking-wide text-slate-500">
                <th className="px-3 md:px-6 py-2 text-left font-semibold">
                  Tracking ID
                </th>
                <th className="px-3 md:px-6 py-2 text-left font-semibold">
                  Amount
                </th>
                <th className="px-3 md:px-6 py-2 text-left font-semibold">
                  Status
                </th>
                <th className="px-3 md:px-6 py-2 text-left font-semibold">
                  Transaction ID
                </th>
                <th className="px-3 md:px-6 py-2 text-left font-semibold">
                  Paid On
                </th>
                <th className="px-3 md:px-6 py-2 text-left font-semibold">
                  Receipt
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-t border-sky-100 hover:bg-sky-50/70"
                >
                  <td className="px-3 md:px-6 py-2 font-mono text-xs text-slate-700">
                    {payment.trackingId}
                  </td>
                  <td className="px-3 md:px-6 py-2 font-semibold text-slate-800">
                    ₹{payment.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="px-3 md:px-6 py-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        payment.paymentStatus,
                      )}`}
                    >
                      {payment.paymentStatus}
                    </span>
                  </td>
                  <td
                    className="px-3 md:px-6 py-2 font-mono text-xs text-slate-500 truncate max-w-[160px]"
                    title={payment.transactionId ?? undefined}
                  >
                    {payment.transactionId ?? "—"}
                  </td>
                  <td className="px-3 md:px-6 py-2 text-xs text-slate-500">
                    {formatDateTime(payment.paidAt ?? "N/A")}
                  </td>
                  <td className="px-3 md:px-6 py-2">
                    <button
                      onClick={() => downloadCLick(payment.shipmentId)}
                      disabled={payment.paymentStatus !== "PAID"}
                      title={
                        payment.paymentStatus === "PAID"
                          ? "Download receipt"
                          : "Receipt unavailable"
                      }
                      className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                        payment.paymentStatus === "PAID"
                          ? "border-sky-200 bg-white text-sky-600 hover:bg-sky-50"
                          : "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                      }`}
                    >
                      <i className="fa-solid fa-download text-sm"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && filteredPayments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <h2 className="text-lg font-semibold text-slate-700">
                No Payments Found
              </h2>
            </div>
          )}
        </div>

        {totalFiltered > 0 && (
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            total={totalFiltered}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        )}
      </div>
      {showPreview && (
        <ReceiptPreviewModal
          onClose={() => setShowPreview(false)}
          razorpayPaymentId={paymentDetails?.razorpayPaymentId}
          trackingId={trackingId}
          prices={prices}
          priority={priority}
          packageWeight={packageWeight}
          today={paymentDetails?.paidAt}
          fileName={fileName}
        />
      )}
    </div>
  );
};

export default PaymentDetails;
