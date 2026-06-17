import { useState, useMemo, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../app/store";
import { fetchAllShipments } from "../adminSlice";
import type { AllShipments, FilterTab, SortKey } from "../adminTypes";
import { TABS } from "../utils/adminShipmentHelper";

import AllShipmentHeader from "../components/allShipments/AllShipmentHeader";
import AdminShipmentSearchSort from "../components/allShipments/AdminShipmentSearchSort";
import AdminShipmentTabs from "../components/allShipments/AdminShipmentTabs";
import AdminShipmentTable from "../components/allShipments/AdminShipmentTable";
import AdminShipmentDetailModal from "../components/allShipments/AdminShipmentDetailModal";
import AdminShipmentCompleteModal from "../components/allShipments/AdminShipmentCompleteModal";

const AdminAllShipments = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { allShipments: shipments, shipmentsLoading } = useSelector(
    (state: RootState) => state.admin,
  );

  const [clientPage, setClientPage] = useState(1);
  const [limit, setLimit] = useState<number>(6);
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [searchFocused, setSearchFocused] = useState(false);
  const [viewModal, setViewModal] = useState<AllShipments | null>(null);
  const [completeModal, setCompleteModal] = useState<AllShipments | null>(null);

  useEffect(() => {
    dispatch(fetchAllShipments({ page: 1, limit: 500 }));
  }, [dispatch]);

  const handleTabChange = useCallback((tab: FilterTab) => {
    setActiveTab(tab);
    setClientPage(1);
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setClientPage(1);
  }, []);

  const handleSearchChange = useCallback((val: string) => {
    setSearchQuery(val);
    setClientPage(1);
  }, []);

  // Called by modal on success — refetch to sync latest status from server
  const handleCompleteSuccess = useCallback(() => {
    dispatch(fetchAllShipments({ page: 1, limit: 500 }));
  }, [dispatch]);

  const tabCounts = useMemo(() => {
    const c: Record<string, number> = { ALL: shipments.length };
    TABS.slice(1).forEach(({ key }) => {
      c[key] = shipments.filter((s) => s.shipmentStatus === key).length;
    });
    return c;
  }, [shipments]);

  const filteredAndSorted = useMemo(() => {
    let list = [...shipments];

    if (activeTab !== "ALL")
      list = list.filter((s) => s.shipmentStatus === activeTab);

    if (searchQuery.trim()) {
      const l = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.trackingId.toLowerCase().includes(l) ||
          s.customer.name.toLowerCase().includes(l) ||
          s.itemName.toLowerCase().includes(l) ||
          s.pickupCity.toLowerCase().includes(l) ||
          s.deliveryCity.toLowerCase().includes(l) ||
          (s.assignedAgent?.name.toLowerCase().includes(l) ?? false),
      );
    }

    list.sort((a, b) => {
      switch (sortKey) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "amount_high":
          return b.amount - a.amount;
        case "amount_low":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return list;
  }, [shipments, activeTab, searchQuery, sortKey]);

  const totalFiltered = filteredAndSorted.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / limit));
  const safePage = Math.min(clientPage, totalPages);

  const displayed = useMemo(() => {
    const start = (safePage - 1) * limit;
    return filteredAndSorted.slice(start, start + limit);
  }, [filteredAndSorted, safePage, limit]);

  return (
    <div className="rounded-2xl h-[calc(100vh-72px)] overflow-y-auto scrollbar-none bg-gradient-to-br from-sky-50 via-cyan-100 to-indigo-50 p-3 sm:p-4 lg:p-5">
      <AllShipmentHeader />

      <AdminShipmentSearchSort
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
        searchFocused={searchFocused}
        setSearchFocused={setSearchFocused}
        sortKey={sortKey}
        setSortKey={setSortKey}
      />

      <AdminShipmentTabs
        activeTab={activeTab}
        tabCounts={tabCounts}
        onTabChange={handleTabChange}
      />

      {!shipmentsLoading && (
        <p className="text-[11px] sm:text-[12px] text-slate-400 mb-3">
          {searchQuery
            ? `${totalFiltered} result${totalFiltered !== 1 ? "s" : ""} for "${searchQuery}"`
            : `Showing ${displayed.length} of ${totalFiltered} shipments (page ${safePage} of ${totalPages})`}
        </p>
      )}

      <AdminShipmentTable
        shipments={displayed}
        shipmentsLoading={shipmentsLoading}
        searchQuery={searchQuery}
        page={safePage}
        totalPages={totalPages}
        total={totalFiltered}
        limit={limit}
        onPageChange={setClientPage}
        onLimitChange={handleLimitChange}
        onView={setViewModal}
        onComplete={setCompleteModal}
      />

      <AdminShipmentDetailModal
        shipment={viewModal}
        onClose={() => setViewModal(null)}
      />

      {/* Complete modal — self-contained, dispatches its own thunk */}
      <AdminShipmentCompleteModal
        shipment={completeModal}
        onClose={() => setCompleteModal(null)}
        onSuccess={handleCompleteSuccess}
      />
    </div>
  );
};

export default AdminAllShipments;