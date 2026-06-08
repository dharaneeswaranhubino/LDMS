import { useEffect, useState } from "react";
import type { ShipmentResponse } from "../shipmentTypes";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../shared/hooks/reduxHooks";
import { clearTimeline, fetchMyShipments } from "../shipmentSlice";
import ShipmentTimelinePanel from "../components/trackShipments/ShipmentTimelinePanel";
import { isActive } from "../utils/shipmentHelpers";
import { FaMapMarkedAlt } from "react-icons/fa";
import { GiMailbox } from "react-icons/gi";
import TimeLineShipmentCard from "../components/trackShipments/TimeLineShipmentCard";
import { useNavigate, useParams } from "react-router-dom";

const TrackShipmentPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { shipments, loading } = useAppSelector((state) => state.shipment);
  const { shipmentId } = useParams<{ shipmentId: string }>();

  const selectedShipment = shipmentId
    ? (shipments.find((s) => s.shipmentId === Number(shipmentId)) ?? null)
    : null;
  const [searchInput, setSearchInput] = useState("");
  const [searchNotFound, setSearchNotFound] = useState(false);

  useEffect(() => {
    dispatch(fetchMyShipments({ page: 1, limit: 50 }));
    
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearTimeline());
    };
  }, [dispatch]);

  const activeShipments = shipments.filter((s) => isActive(s.shipmentStatus));

  function handleSearch() {
    setSearchNotFound(false);
    const val = searchInput.trim().toUpperCase();
    if (!val) return;
    const found = shipments.find(
      (s) =>
        s.trackingId.toUpperCase() === val ||
        s.trackingId.toUpperCase().includes(val),
    );
    if (found) {
      navigate(`/trackShipments/${found.shipmentId}`);
    } else {
      setSearchNotFound(true);
      navigate(`/trackShipments`);
    }
  }

  function handleCardClick(shipment: ShipmentResponse) {
    setSearchInput("");
    navigate(`/trackShipments/${shipment.shipmentId}`);
    setSearchNotFound(false);
  }

  return (
    <>
      <div className="rounded-2xl flex flex-col h-full bg-gradient-to-br from-slate-50 via-sky-200 to-purple-50 p-3">
        <div
          className={`border-b border-gray-100 py-4 flex-shrink-0 ${shipmentId ? "hidden md:block" : "block"}`}
        >
          <div className="lg:flex items-center gap-2 mb-3">
            <h1 className="text-lg font-medium text-gray-800 mb-0.5">
              Track your shipment
            </h1>
            <p className="text-sm text-gray-400">
              (Search by tracking ID or select from your active shipments)
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white focus-within:border-blue-300 transition-colors">
              <svg
                className="w-4 h-4 text-gray-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter tracking ID (e.g. TRK-ABC123)"
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:scale-95 transition-all"
            >
              Search
            </button>
          </div>
        </div>

        <div className="rounded-2xl flex flex-1 min-h-0">
          <div
            className={`rounded-l-2xl flex flex-col bg-white
              w-full md:w-[38%] lg:w-[40%]
              ${shipmentId ? "hidden md:flex" : "flex"}
            `}
          >
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Active shipments
              </span>
              <span className="text-xs text-gray-400">
                {activeShipments.length} shipments
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {loading ? (
                <>
                  <div className="animate-pulse space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="border border-gray-100 rounded-lg p-3"
                      >
                        <div className="flex justify-between mb-2">
                          <div className="h-3 w-32 bg-gray-100 rounded" />
                          <div className="h-3 w-16 bg-gray-100 rounded-full" />
                        </div>
                        <div className="h-2.5 w-40 bg-gray-100 rounded mb-1.5" />
                        <div className="h-2.5 w-28 bg-gray-100 rounded" />
                      </div>
                    ))}
                  </div>
                </>
              ) : activeShipments.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                  <GiMailbox size={46} />
                  <p className="text-sm text-gray-500">No active shipments</p>
                </div>
              ) : (
                activeShipments.map((s) => (
                  <TimeLineShipmentCard
                    key={s.shipmentId}
                    shipment={s}
                    isSelected={selectedShipment?.shipmentId === s.shipmentId}
                    onClick={() => handleCardClick(s)}
                  />
                ))
              )}
            </div>
          </div>

          <div
            className={`flex flex-col bg-white min-h-0
              md:rounded-r-2xl flex-1
              ${shipmentId ? "flex w-full rounded-2xl md:w-auto md:rounded-l-none" : "hidden md:flex"}
            `}
          >
            {shipmentId && (
              <div className="flex items-center px-4 py-2.5 border-b border-gray-100 md:hidden">
                <button
                  onClick={() => navigate("/trackShipments")}
                  className="flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-600 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back to shipments
                </button>
              </div>
            )}

            {searchNotFound ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center text-red-300">
                  <FaMapMarkedAlt size={36} />
                </div>
                <p className="text-sm font-medium text-gray-500">
                  No matching shipment
                </p>
                <p className="text-xs text-gray-400 max-w-[180px] leading-relaxed">
                  No shipment found for{" "}
                  <span className="font-semibold text-gray-500">
                    "{searchInput}"
                  </span>
                  . Try a different tracking ID.
                </p>
              </div>
            ) : selectedShipment ? (
              <ShipmentTimelinePanel shipment={selectedShipment} />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-300">
                  <FaMapMarkedAlt size={36} />
                </div>
                <p className="text-sm font-medium text-gray-500">
                  No shipment selected
                </p>
                <p className="text-xs text-gray-400 max-w-[180px] leading-relaxed">
                  Pick a shipment from the left to view its full tracking
                  timeline
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TrackShipmentPage;
