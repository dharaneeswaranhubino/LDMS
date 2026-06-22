import { useEffect } from "react";
import { Package, MessageCircle, ArrowLeft } from "lucide-react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../shared/hooks/reduxHooks";
import { appendMessage, setActiveShipment } from "../shipmentSlice";
import ChatWindow from "../../../shared/components/ChatWindow";
import { emitWhenConnected, getSocket } from "../utils/socketService";
import type { ChatMessage } from "../shipmentTypes";

const CustomerChat = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.accessToken);
  const activeShipmentId = useAppSelector((s) => s.shipment.activeShipmentId);
  const currentUserId = useAppSelector((s) => s.auth.user?.id);

  const shipments = useAppSelector((s) => s.shipment.shipments);

  const chattableShipments = shipments.filter(
    (s) =>
      s.assignedAgent !== null &&
      s.shipmentStatus !== "DELIVERED" &&
      s.shipmentStatus !== "CANCELLED",
  );

  useEffect(() => {
    if (!token || chattableShipments.length === 0) return;

    const socket = getSocket(token);

    chattableShipments.forEach((shipment) => {
      emitWhenConnected(socket, "join_chat", shipment.shipmentId);
    });

    socket.off("new_message");
    socket.on("new_message", (msg: ChatMessage) => {
      dispatch(appendMessage(msg));
    });

    return () => {
      chattableShipments.forEach((shipment) => {
        socket.emit("leave_chat", shipment.shipmentId);
      });
      socket.off("new_message");
    };
  }, [token, chattableShipments.length]);

  const handleSelectShipment = (shipmentId: number) => {
    dispatch(setActiveShipment(shipmentId));
  };

  const handleBack = () => {
    dispatch(setActiveShipment(null));
  };

  const activeShipment = chattableShipments.find(
    (s) => s.shipmentId === activeShipmentId,
  );

  const isCompleted = activeShipment?.shipmentStatus === "COMPLETED";
  return (
    <div className="flex h-[calc(100vh-72px)] rounded-2xl md:rounded-2xl bg-gradient-to-br from-sky-50 via-cyan-100 to-indigo-50 md:p-5 overflow-hidden">
      <div
        className={`w-full md:w-72 md:border-r border-gray-200 bg-slate-50 flex-col md:rounded-l-2xl ${
          activeShipmentId ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="px-4 py-3 border-b border-gray-200 bg-blue-600 md:rounded-tl-2xl">
          <h2 className="font-semibold text-white">Your Shipments</h2>
          <p className="text-xs text-blue-200 mt-1">
            Select a shipment to chat with your agent
          </p>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-none">
          {chattableShipments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4 text-center">
              <Package size={40} className="mb-2 opacity-50" />
              <p className="text-sm">
                No active shipments with assigned agents
              </p>
            </div>
          ) : (
            chattableShipments.map((shipment) => (
              <button
                key={shipment.shipmentId}
                onClick={() => handleSelectShipment(shipment.shipmentId)}
                className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-slate-100 transition-all duration-200 hover:shadow-md ${
                  activeShipmentId === shipment.shipmentId
                    ? "bg-indigo-50 border-l-4 border-l-indigo-600 shadow-sm"
                    : ""
                }`}
              >
                <p className="text-sm font-medium text-slate-800">
                  {shipment.trackingId}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  {shipment.pickupAddress} → {shipment.deliveryAddress}
                </p>
                <span
                  className={`text-xs font-medium mt-1 inline-block px-2 py-0.5 rounded-full ${
                    shipment.shipmentStatus === "IN_TRANSIT"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {shipment.shipmentStatus}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat panel — full width on mobile, only shown when a shipment is selected */}
      <div
        className={`flex-1 bg-gray-50 flex-col min-h-0 md:rounded-r-2xl ${
          activeShipmentId ? "flex" : "hidden md:flex"
        }`}
      >
        {activeShipmentId && currentUserId ? (
          <>
            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 bg-white md:rounded-tr-2xl flex items-center gap-3">
              <button
                onClick={handleBack}
                className="md:hidden text-gray-500 hover:text-gray-700 -ml-1 p-1"
                aria-label="Back to shipments"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  Tracking ID: {activeShipment?.trackingId}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  <span className="text-[12px] font-medium text-blue-600">
                    {activeShipment?.assignedAgent?.agentName} -{" "}
                  </span>
                  Chat with your delivery agent
                </p>
              </div>
            </div>
            <ChatWindow
              shipmentId={activeShipmentId}
              currentUserId={currentUserId}
              isCompleted={isCompleted}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MessageCircle size={48} className="mb-3 opacity-40" />
            <p className="text-sm">Select a shipment to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerChat;