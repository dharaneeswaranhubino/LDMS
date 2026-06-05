// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import type { ShipmentResponse } from "../shipmentTypes";
// import { useAppDispatch, useAppSelector } from "../../../shared/hooks/reduxHooks";
// import { clearTimeline, fetchMyShipments } from "../shipmentSlice";
// import ShipmentTimelinePanel from "../components/trackShipments/ShipmentTimelinePanel";
// // import type { TimelineStatus } from "../../shipmentTypes";
// // import ShipmentTimelinePanel from "./ShipmentTimelinePanel";

// // ─── Status badge config ─────────────────────────────────────────────────

// const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
//   PENDING:          { bg: "bg-amber-50",  text: "text-amber-800",  label: "Pending"          },
//   CONFIRMED:        { bg: "bg-teal-50",   text: "text-teal-800",   label: "Confirmed"         },
//   ASSIGNED:         { bg: "bg-purple-50", text: "text-purple-800", label: "Assigned"          },
//   OUT_FOR_PICKUP:   { bg: "bg-purple-50", text: "text-purple-800", label: "Out for pickup"    },
//   PICKED_UP:        { bg: "bg-teal-50",   text: "text-teal-800",   label: "Picked up"         },
//   IN_TRANSIT:       { bg: "bg-blue-50",   text: "text-blue-800",   label: "In transit"        },
//   OUT_FOR_DELIVERY: { bg: "bg-blue-50",   text: "text-blue-800",   label: "Out for delivery"  },
//   DELIVERED:        { bg: "bg-green-50",  text: "text-green-800",  label: "Delivered"         },
//   COMPLETED:        { bg: "bg-green-50",  text: "text-green-800",  label: "Completed"         },
//   CANCELLED:        { bg: "bg-red-50",    text: "text-red-800",    label: "Cancelled"         },
// };

// const ACTIVE_STATUSES: string[] = [
//   "CONFIRMED",
//   "ASSIGNED",
//   "OUT_FOR_PICKUP",
//   "PICKED_UP",
//   "IN_TRANSIT",
//   "OUT_FOR_DELIVERY",
// ];

// // ─── Helpers ─────────────────────────────────────────────────────────────

// function isActive(status: string): boolean {
//   return ACTIVE_STATUSES.includes(status);
// }

// // ─── Left panel card ─────────────────────────────────────────────────────

// interface ShipmentCardProps {
//   shipment: ShipmentResponse;
//   isSelected: boolean;
//   onClick: () => void;
// }

// function ShipmentCard({ shipment, isSelected, onClick }: ShipmentCardProps) {
//   const style = STATUS_STYLE[shipment.shipmentStatus] ?? STATUS_STYLE["PENDING"];

//   return (
//     <div
//       onClick={onClick}
//       className={`border rounded-lg p-3 cursor-pointer mb-2 transition-all
//         ${isSelected
//           ? "border-blue-400 bg-blue-50 border-[1.5px]"
//           : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
//         }`}
//     >
//       {/* Top row */}
//       <div className="flex items-center justify-between gap-2 mb-1.5">
//         <p className={`text-xs font-medium truncate max-w-[160px] ${isSelected ? "text-blue-800" : "text-gray-700"}`}>
//           {shipment.trackingId}
//         </p>
//         <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${style.bg} ${style.text}`}>
//           {style.label}
//         </span>
//       </div>

//       {/* Route */}
//       <div className={`flex items-center gap-1 text-xs mb-1.5 ${isSelected ? "text-blue-600" : "text-gray-500"}`}>
//         <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//         </svg>
//         <span className="truncate">{shipment.pickupCity}</span>
//         <span className="text-gray-300">→</span>
//         <span className="truncate">{shipment.deliveryCity}</span>
//       </div>

//       {/* Meta */}
//       <div className="flex items-center gap-2 text-[10px] text-gray-400">
//         <span className="flex items-center gap-1">
//           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//           </svg>
//           {shipment.assignedAgent?.agentName ?? "Awaiting agent"}
//         </span>
//         <span className="w-1 h-1 rounded-full bg-gray-300" />
//         <span>{shipment.itemName}</span>
//       </div>
//     </div>
//   );
// }

// // ─── Empty right panel ────────────────────────────────────────────────────

// function EmptyPanel() {
//   return (
//     <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
//       <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl">
//         🗺️
//       </div>
//       <p className="text-sm font-medium text-gray-500">No shipment selected</p>
//       <p className="text-xs text-gray-400 max-w-[180px] leading-relaxed">
//         Pick a shipment from the left to view its full tracking timeline
//       </p>
//     </div>
//   );
// }

// // ─── Left panel skeleton ─────────────────────────────────────────────────

// function CardSkeleton() {
//   return (
//     <div className="animate-pulse space-y-2">
//       {[1, 2, 3].map((i) => (
//         <div key={i} className="border border-gray-100 rounded-lg p-3">
//           <div className="flex justify-between mb-2">
//             <div className="h-3 w-32 bg-gray-100 rounded" />
//             <div className="h-3 w-16 bg-gray-100 rounded-full" />
//           </div>
//           <div className="h-2.5 w-40 bg-gray-100 rounded mb-1.5" />
//           <div className="h-2.5 w-28 bg-gray-100 rounded" />
//         </div>
//       ))}
//     </div>
//   );
// }

// export default function TrackShipmentPage() {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
//   const { id } = useParams<{ id?: string }>();

//   const { shipments, loading } = useAppSelector((state) => state.shipment);

//   const [selectedShipment, setSelectedShipment] = useState<ShipmentResponse | null>(null);
//   const [searchInput, setSearchInput] = useState("");

//   // ── Fetch active shipments on mount ──
//   useEffect(() => {
//     dispatch(fetchMyShipments({ page: 1, limit: 50 }));
//   }, [dispatch]);

//   // ── If :id present (from "Track" button in My Shipments), auto-select ──
//   useEffect(() => {
//     if (id && shipments.length > 0) {
//       const found = shipments.find((s) => s.shipmentId === Number(id));
//       if (found) setSelectedShipment(found);
//     }
//   }, [id, shipments]);

//   // ── Clear timeline on unmount ──
//   useEffect(() => {
//     return () => { dispatch(clearTimeline()); };
//   }, [dispatch]);

//   // ── Filter only active shipments for left panel ──
//   const activeShipments = shipments.filter((s) => isActive(s.shipmentStatus));

//   // ── Search handler ──
//   function handleSearch() {
//     const val = searchInput.trim().toUpperCase();
//     if (!val) return;
//     const found = shipments.find(
//       (s) =>
//         s.trackingId.toUpperCase() === val ||
//         s.trackingId.toUpperCase().includes(val)
//     );
//     if (found) {
//       setSelectedShipment(found);
//       navigate(`/trackShipments/${found.shipmentId}`, { replace: true });
//     }
//   }

//   function handleCardClick(shipment: ShipmentResponse) {
//     setSelectedShipment(shipment);
//     navigate(`/trackShipments/${shipment.shipmentId}`, { replace: true });
//   }

//   return (
//     <div className="flex flex-col h-full bg-gray-50">

//       {/* ── Top bar ── */}
//       <div className="bg-white border-b border-gray-100 px-5 py-4 flex-shrink-0">
//         <h1 className="text-lg font-medium text-gray-800 mb-0.5">Track your shipment</h1>
//         <p className="text-sm text-gray-400 mb-3">Search by tracking ID or select from your active shipments</p>

//         <div className="flex gap-2">
//           <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white focus-within:border-blue-300 transition-colors">
//             <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//             </svg>
//             <input
//               type="text"
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//               placeholder="Enter tracking ID (e.g. TRK-ABC123)"
//               className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
//             />
//           </div>
//           <button
//             onClick={handleSearch}
//             className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:scale-95 transition-all"
//           >
//             Search
//           </button>
//         </div>
//       </div>

//       {/* ── Split view ── */}
//       <div className="flex flex-1 min-h-0">

//         {/* Left panel */}
//         <div className="w-[42%] flex flex-col border-r border-gray-100 bg-white">
//           <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
//             <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Active shipments</span>
//             <span className="text-xs text-gray-400">{activeShipments.length} shipments</span>
//           </div>
//           <div className="flex-1 overflow-y-auto p-3">
//             {loading ? (
//               <CardSkeleton />
//             ) : activeShipments.length === 0 ? (
//               <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
//                 <span className="text-2xl">📭</span>
//                 <p className="text-sm text-gray-500">No active shipments</p>
//               </div>
//             ) : (
//               activeShipments.map((s) => (
//                 <ShipmentCard
//                   key={s.shipmentId}
//                   shipment={s}
//                   isSelected={selectedShipment?.shipmentId === s.shipmentId}
//                   onClick={() => handleCardClick(s)}
//                 />
//               ))
//             )}
//           </div>
//         </div>

//         {/* Right panel */}
//         <div className="flex-1 flex flex-col bg-white min-h-0">
//           {selectedShipment ? (
//             <ShipmentTimelinePanel shipment={selectedShipment} />
//           ) : (
//             <EmptyPanel />
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }


import React from 'react'

const TrackShipment = () => {
  return (
    <div>TrackShipment</div>
  )
}

export default TrackShipment