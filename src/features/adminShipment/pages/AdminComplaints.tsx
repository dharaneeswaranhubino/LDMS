import { useEffect } from "react";
import {
  fetchComplaints,
  setActiveComplaintTab,
//   setSelectedComplaint,
} from "../adminSlice";
import { type ComplaintStatus } from "../adminTypes";
import Pagination from "../../../shared/components/Pagination";
import { useAppDispatch, useAppSelector } from "../../../shared/hooks/reduxHooks";
import ComplaintFilters from "../components/adminComplaints/ComplaintFilters";
import ComplaintTable from "../components/adminComplaints/ComplaintTable";
import ComplaintDetailModal from "../components/adminComplaints/ComplaintDetailModal";

const AdminComplaints = () => {
  const dispatch = useAppDispatch();
  const {
    complaints,
    complaintPagination,
    complaintsLoading,
    activeComplaintTab,
    selectedComplaint,
  } = useAppSelector((s) => s.admin);

  const pagination = complaintPagination ?? {
    total: 0,
    page: 1,
    limit: 6,
    totalPages: 1,
  };

  const loadComplaints = (page: number, limit: number) => {
    dispatch(
      fetchComplaints({
        page,
        limit,
        ...(activeComplaintTab !== "ALL"
          ? { status: activeComplaintTab as ComplaintStatus }
          : {}),
      })
    );
  };

  useEffect(() => {
    loadComplaints(pagination.page, pagination.limit);
  }, [activeComplaintTab]);

  const handleTabChange = (tab: "ALL" | ComplaintStatus) => {
    dispatch(setActiveComplaintTab(tab));
  };

  const handlePageChange = (page: number) => {
    loadComplaints(page, pagination.limit);
  };

  const handleLimitChange = (limit: number) => {
    loadComplaints(1, limit);
  };

  return (
    <div className="rounded-2xl h-[calc(100vh-72px)] overflow-y-auto scrollbar-none bg-gradient-to-br from-sky-50 via-cyan-100 to-indigo-50 p-3 sm:p-4 lg:p-5">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          Customer Complaints
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor and resolve customer complaints across all shipments
        </p>
      </div>

      <ComplaintFilters
        activeTab={activeComplaintTab}
        pagination={pagination}
        onTabChange={handleTabChange}
      />

      {!complaintsLoading && (
        <p className="text-xs text-slate-500 mb-3">
          Showing <span className="font-semibold">{complaints.length}</span> of{" "}
          <span className="font-semibold">{pagination.total}</span> complaints
          (page <span className="font-semibold">{pagination.page}</span> of{" "}
          <span className="font-semibold">{pagination.totalPages}</span>)
        </p>
      )}

      <ComplaintTable
        complaints={complaints}
        complaintsLoading={complaintsLoading}
      />

      {pagination.totalPages > 0 && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      )}

      {selectedComplaint && <ComplaintDetailModal />}
    </div>
  );
};

export default AdminComplaints;