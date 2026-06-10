import { useEffect } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../shared/hooks/reduxHooks";
import Pagination from "../../../shared/components/Pagination";
import MyComplaintFilters from "../components/myComplaints/MyComplaintFilters";
import { fetchMyComplaints, setActiveMyComplaintTab } from "../shipmentSlice";
import MyComplaintTable from "../components/myComplaints/MyComplaintTable";
import type { ComplaintStatus } from "../shipmentTypes";

const MyComplaints = () => {
  const dispatch = useAppDispatch();
  const {
    myComplaints,
    myComplaintPagination,
    myComplaintsLoading,
    activeMyComplaintTab,
  } = useAppSelector((s) => s.shipment);

  const pagination = myComplaintPagination ?? {
    total: 0,
    page: 1,
    limit: 6,
    totalPages: 1,
  };

  const load = (page: number, limit: number) => {
    dispatch(
      fetchMyComplaints({
        page,
        limit,
        ...(activeMyComplaintTab !== "ALL"
          ? { status: activeMyComplaintTab as ComplaintStatus }
          : {}),
      }),
    );
  };

  useEffect(() => {
    load(1, pagination.limit);
  }, [activeMyComplaintTab]);

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-50 via-sky-200 to-purple-50 p-5">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">My Complaints</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track the status of all complaints you've raised
        </p>
      </div>

      <MyComplaintFilters
        activeTab={activeMyComplaintTab}
        onTabChange={(tab) => dispatch(setActiveMyComplaintTab(tab))}
      />

      {!myComplaintsLoading && (
        <p className="text-xs text-slate-500 mb-3">
          Showing <span className="font-semibold">{myComplaints.length}</span>{" "}
          of <span className="font-semibold">{pagination.total}</span>{" "}
          complaints (page{" "}
          <span className="font-semibold">{pagination.page}</span> of{" "}
          <span className="font-semibold">{pagination.totalPages}</span>)
        </p>
      )}

      <MyComplaintTable
        complaints={myComplaints}
        loading={myComplaintsLoading}
      />

      {pagination.totalPages > 0 && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={(p) => load(p, pagination.limit)}
          onLimitChange={(l) => load(1, l)}
        />
      )}
    </div>
  );
};

export default MyComplaints;
