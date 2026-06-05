import { useState, useMemo, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../app/store";
import { fetchAllShipments } from "../adminSlice";
import type { BackendShipment, FilterTab, SortKey } from "../adminTypes";
import { TABS } from "../utils/adminShipmentHelper";

import AllShipmentHeader from "../components/allShipments/AllShipmentHeader";
import AdminShipmentSearchSort from "../components/allShipments/AdminShipmentSearchSort";
import AdminShipmentTabs from "../components/allShipments/AdminShipmentTabs";
import AdminShipmentTable from "../components/allShipments/AdminShipmentTable";
import AdminShipmentDetailModal from "../components/allShipments/AdminShipmentDetailModal";
import AdminShipmentCompleteModal from "../components/allShipments/AdminShipmentCompleteModal";

const AdminAllShipments = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    allShipments: shipments,
    shipmentPagination,
    shipmentsLoading,
  } = useSelector((state: RootState) => state.admin);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(5);

  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [searchFocused, setSearchFocused] = useState(false);

  const [viewModal, setViewModal] = useState<BackendShipment | null>(null);
  const [completeModal, setCompleteModal] = useState<BackendShipment | null>(
    null,
  );
  const [completeLoading, setCompleteLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAllShipments({ page, limit }));
  }, [dispatch, page, limit]);

  const handleTabChange = useCallback((tab: FilterTab) => {
    setActiveTab(tab);
    setPage(1);
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  const tabCounts = useMemo(() => {
    const c: Record<string, number> = { ALL: shipments.length };
    TABS.slice(1).forEach(({ key }) => {
      c[key] = shipments.filter((s) => s.shipmentStatus === key).length;
    });
    return c;
  }, [shipments]);

  const displayed = useMemo(() => {
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

  const handleComplete = async () => {
    if (!completeModal) return;
    setCompleteLoading(true);
    try {
      // TODO: dispatch(completeShipment(completeModal.shipmentId))
      await new Promise((r) => setTimeout(r, 800));
      setCompleteModal(null);
    } finally {
      setCompleteLoading(false);
    }
  };

  const totalPages = shipmentPagination?.totalPages ?? 1;
  const total = shipmentPagination?.total ?? 0;

  return (
    <div className="rounded-lg h-[calc(100vh-72px)] overflow-y-auto scrollbar-none bg-gradient-to-br from-sky-50 via-cyan-100 to-indigo-50 p-5">
      <AllShipmentHeader />

      <AdminShipmentSearchSort
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
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

      <p className="text-[12px] text-slate-400 mb-3">
        {searchQuery
          ? `${displayed.length} result${displayed.length !== 1 ? "s" : ""} for "${searchQuery}" on this page`
          : `Showing ${displayed.length} of ${total} shipments (page ${page} of ${totalPages})`}
      </p>

      <AdminShipmentTable
        shipments={displayed}
        shipmentsLoading={shipmentsLoading}
        searchQuery={searchQuery}
        page={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={handleLimitChange}
        onView={setViewModal}
        onComplete={setCompleteModal}
      />

      <AdminShipmentDetailModal
        shipment={viewModal}
        onClose={() => setViewModal(null)}
      />

      <AdminShipmentCompleteModal
        shipment={completeModal}
        loading={completeLoading}
        onConfirm={handleComplete}
        onClose={() => setCompleteModal(null)}
      />
    </div>
  );
};

export default AdminAllShipments;
