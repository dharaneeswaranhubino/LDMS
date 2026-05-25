import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../shared/hooks/reduxHooks";
import { fetchMyShipments } from "../shipmentSlice";
import type { FilterTab, ShipmentResponse, SortKey } from "../shipmentTypes";
import { FILTER_TABS, matchesSearch } from "../utils/shipmentHelpers";
import ShipmentLoading from "../components/myShipmentComponents/ShipmentLoading";
import ShipmentError from "../components/myShipmentComponents/ShipmentError";
import ShipmentDetailsModal from "../components/myShipmentComponents/ShipmentDetailsModal";
import ShipmentCard from "../components/myShipmentComponents/ShipmentCard";
import ShipmentEmpty from "../components/myShipmentComponents/ShipmentEmpty";
import ShipmentTabs from "../components/myShipmentComponents/ShipmentTabs";
import ShipmentToolbar from "../components/myShipmentComponents/ShipmentToolbar";

const MyShipments = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { shipments, loading, error } = useAppSelector(
    (state) => state.shipment,
  );

  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedShipment, setSelectedShipment] =
    useState<ShipmentResponse | null>(null);

  const [openModal, setOpenModal] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    dispatch(fetchMyShipments());
  }, [dispatch]);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: shipments.length,
    };
    FILTER_TABS.slice(1).forEach(({ key }) => {
      counts[key] = shipments.filter(
        (s: ShipmentResponse) => s.shipmentStatus === key,
      ).length;
    });
    return counts;
  }, [shipments]);

  const displayed = useMemo(() => {
    let list = [...shipments];
    if (activeTab !== "ALL") {
      list = list.filter(
        (s: ShipmentResponse) => s.shipmentStatus === activeTab,
      );
    }
    if (searchQuery.trim()) {
      list = list.filter((s: ShipmentResponse) =>
        matchesSearch(s, searchQuery),
      );
    }
    list.sort((a: ShipmentResponse, b: ShipmentResponse) => {
      switch (sortKey) {
        case "newest":
          return (
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt ?? 0).getTime() -
            new Date(b.createdAt ?? 0).getTime()
          );
        case "amount_high":
          return (b.amount ?? 0) - (a.amount ?? 0);
        case "amount_low":
          return (a.amount ?? 0) - (b.amount ?? 0);
        default:
          return 0;
      }
    });
    return list;
  }, [shipments, activeTab, searchQuery, sortKey]);
  const handleView = (shipment: ShipmentResponse) => {
    setSelectedShipment(shipment);
    setOpenModal(true);
  };
  if (loading && shipments.length === 0) {
    return <ShipmentLoading />;
  }
  if (error) {
    return (
      <ShipmentError
        error={error}
        onRetry={() => dispatch(fetchMyShipments())}
      />
    );
  }

  return (
    <>
      <div className="rounded-2xl bg-gradient-to-br from-slate-50 via-sky-200 to-purple-50 p-5">
        <div className="flex items-start justify-between mb-4">
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
            className="h-[42px] px-5 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 transition-all text-white text-[13px] font-medium flex items-center gap-2 shadow-md"
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
          setActiveTab={setActiveTab}
          tabCounts={tabCounts}
        />

        <p className="text-[12px] text-slate-400 mb-3">
          {searchQuery
            ? `${displayed.length} result${
                displayed.length !== 1 ? "s" : ""
              } for "${searchQuery}"`
            : `Showing ${displayed.length} shipment${
                displayed.length !== 1 ? "s" : ""
              }`}
        </p>

        {displayed.length === 0 ? (
          <ShipmentEmpty
            searchQuery={searchQuery}
            onCreate={() => navigate("/sendShipment")}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 space-y-3 max-h-[600px] overflow-y-hidden overflow-y-scroll scrollbar-none rounded-2xl">
            {displayed.map((item: ShipmentResponse) => {
              return (
                <ShipmentCard
                  key={item.id ?? item.trackingId}
                  item={item}
                  onView={handleView}
                />
              );
            })}
          </div>
        )}

        {loading && shipments.length > 0 && (
          <div className="flex justify-center py-6">
            <i className="fa-solid fa-spinner fa-spin text-violet-400 text-xl" />
          </div>
        )}
      </div>

      <ShipmentDetailsModal
        shipment={selectedShipment}
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
};

export default MyShipments;
