import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FilterTab, ShipmentResponse, SortKey } from "../shipmentTypes";
import { FILTER_TABS, matchesSearch } from "../utils/shipmentHelpers";
import ShipmentError from "../components/myShipmentComponents/ShipmentError";
import ShipmentDetailsModal from "../components/myShipmentComponents/ShipmentDetailsModal";
import ShipmentCard from "../components/myShipmentComponents/ShipmentCard";
import ShipmentEmpty from "../components/myShipmentComponents/ShipmentEmpty";
import ShipmentTabs from "../components/myShipmentComponents/ShipmentTabs";
import ShipmentToolbar from "../components/myShipmentComponents/ShipmentToolbar";
import PaymentDetailsModal from "../components/myShipmentComponents/PaymentDetailsModal";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";
import Pagination from "../../../shared/components/Pagination";
// import { api } from "@/lib/axios";
import { useAppDispatch } from "@/shared/hooks/reduxHooks";
import { fetchMyShipments } from "../shipmentSlice";

const MyShipments = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShipment, setSelectedShipment] =
    useState<ShipmentResponse | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [selectedPaymentShipmentId, setSelectedPaymentShipmentId] = useState<
    number | null
  >(null);
  const [limit, setLimit] = useState(6);
  const [clientPage, setClientPage] = useState(1);
  const [allShipments, setAllShipments] = useState<ShipmentResponse[]>([]);
  const [tabCounts, setTabCounts] = useState<Record<string, number>>({});
  const [initialLoading, setInitialLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const searchRef = useRef<HTMLInputElement | null>(null);

  // const fetchAllShipments = useCallback(async () => {
  //   setInitialLoading(true);
  //   setFetchError(null);
  //   try {
  //     const res = await api.get("/shipments/myShipments", {
  //       params: { page: 1, limit: 500 },
  //     });
  //     const all: ShipmentResponse[] = res.data.data.shipments;
  //     setAllShipments(all);

  //     const counts: Record<string, number> = { ALL: all.length };
  //     FILTER_TABS.slice(1).forEach(({ key }) => {
  //       counts[key] = all.filter((s) => s.shipmentStatus === key).length;
  //     });
  //     setTabCounts(counts);
  //   } catch {
  //     setFetchError("Failed to load shipments");
  //   } finally {
  //     setInitialLoading(false);
  //   }
  // }, []);
  const fetchAllShipments = useCallback(async () => {
    setInitialLoading(true);
    setFetchError(null);
    try {
      const result = await dispatch(
        fetchMyShipments({ page: 1, limit: 500 }),
      ).unwrap();

      const all = result.shipments;
      setAllShipments(all);

      const counts: Record<string, number> = { ALL: all.length };
      FILTER_TABS.slice(1).forEach(({ key }) => {
        counts[key] = all.filter((s) => s.shipmentStatus === key).length;
      });
      setTabCounts(counts);
    } catch {
      setFetchError("Failed to load shipments");
    } finally {
      setInitialLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAllShipments();
  }, [fetchAllShipments]);

  const handleTabChange = useCallback((tab: FilterTab) => {
    setActiveTab(tab);
    setClientPage(1);
  }, []);

  const handlePaymentView = (shipmentId: number) => {
    setSelectedPaymentShipmentId(shipmentId);
    setOpenPaymentModal(true);
  };

  const handleView = (shipment: ShipmentResponse) => {
    setSelectedShipment(shipment);
    setOpenModal(true);
  };

  const displayed = useMemo(() => {
    let list = [...allShipments];
    if (activeTab !== "ALL") {
      list = list.filter((s) => s.shipmentStatus === activeTab);
    }
    if (searchQuery.trim()) {
      list = list.filter((s) => matchesSearch(s, searchQuery));
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
  }, [allShipments, activeTab, searchQuery, sortKey]);

  const totalFiltered = displayed.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / limit));
  const safePage = Math.min(clientPage, totalPages);

  const paginatedDisplay = useMemo(() => {
    const start = (safePage - 1) * limit;
    return displayed.slice(start, start + limit);
  }, [displayed, safePage, limit]);

  if (initialLoading) {
    return (
      <div className="h-[calc(100vh-72px)] overflow-y-auto rounded-lg bg-gradient-to-br from-sky-50 via-cyan-100 to-indigo-50 scrollbar-none">
        <LoadingSpinner />
      </div>
    );
  }

  if (fetchError) {
    return <ShipmentError error={fetchError} onRetry={fetchAllShipments} />;
  }

  return (
    <>
      <div className="rounded-2xl bg-gradient-to-br from-slate-50 via-sky-200 to-purple-50 p-5">
        <div className="sm:flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">
              My shipments
            </h1>
            <p className="text-[14px] text-slate-500 mt-1">
              Track and manage all your shipments in one place
            </p>
          </div>
          <button
            onClick={() => navigate("/sendShipment")}
            className="h-[42px] w-full mt-3 sm:mt-0 sm:w-48 px-5 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 transition-all text-white text-[13px] font-medium flex items-center gap-2 shadow-md"
          >
            <i className="fa-solid fa-plus text-[11px]" />
            Send new shipment
          </button>
        </div>

        <ShipmentToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchFocused={searchFocused}
          setSearchFocused={setSearchFocused}
          searchRef={searchRef}
          sortKey={sortKey}
          setSortKey={setSortKey}
        />

        <ShipmentTabs
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          tabCounts={tabCounts}
        />

        <p className="text-[12px] text-slate-400 mb-3">
          {searchQuery
            ? `${totalFiltered} result${totalFiltered !== 1 ? "s" : ""} for "${searchQuery}"`
            : `Showing ${totalFiltered} shipment${totalFiltered !== 1 ? "s" : ""}`}
        </p>

        {paginatedDisplay.length === 0 ? (
          <ShipmentEmpty
            searchQuery={searchQuery}
            onCreate={() => navigate("/sendShipment")}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 space-y-3 max-h-[600px] overflow-y-scroll scrollbar-none rounded-2xl">
            {paginatedDisplay.map((item) => (
              <ShipmentCard
                key={item.shipmentId ?? item.trackingId}
                item={item}
                onView={handleView}
                onPaymentView={handlePaymentView}
              />
            ))}
          </div>
        )}

        {allShipments.length > 0 && (
          <Pagination
            page={safePage}
            totalPages={totalPages}
            total={totalFiltered}
            limit={limit}
            onPageChange={setClientPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setClientPage(1);
            }}
          />
        )}
      </div>

      <ShipmentDetailsModal
        shipment={selectedShipment}
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCancelSuccess={fetchAllShipments}
      />

      <PaymentDetailsModal
        shipmentId={selectedPaymentShipmentId}
        open={openPaymentModal}
        onClose={() => setOpenPaymentModal(false)}
      />
    </>
  );
};

export default MyShipments;
