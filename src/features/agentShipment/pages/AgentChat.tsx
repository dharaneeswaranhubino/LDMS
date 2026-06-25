import { useEffect } from "react";
import { Package, MessageCircle, ArrowLeft } from "lucide-react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../shared/hooks/reduxHooks";
import {
  appendMessage,
  setActiveShipment,
} from "../../customerShipment/shipmentSlice";
import ChatWindow from "../../../shared/components/ChatWindow";
import {
  emitWhenConnected,
  getSocket,
} from "../../customerShipment/utils/socketService";
import type { ChatMessage } from "../../customerShipment/shipmentTypes";
import { getMyDeliveries } from "../agentSlice";

const AgentChat = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.accessToken);
  const activeShipmentId = useAppSelector((s) => s.shipment.activeShipmentId);
  const currentUserId = useAppSelector((s) => s.auth.user?.id);
  const deliveries = useAppSelector((s) => s.agent.deliveries);

  const activeDeliveries = deliveries.filter(
    (d) => d.shipmentStatus !== "CANCELLED",
    // (d) => d.shipmentStatus !== "DELIVERED" && d.shipmentStatus !== "CANCELLED",
  );

  useEffect(() => {
    dispatch(getMyDeliveries());
  }, []);

  useEffect(() => {
    if (!token || activeDeliveries.length === 0) return;

    const socket = getSocket(token);

    activeDeliveries.forEach((delivery) => {
      emitWhenConnected(socket, "join_chat", delivery.shipmentId);
    });

    socket.off("new_message");
    socket.on("new_message", (msg: ChatMessage) => {
      dispatch(appendMessage(msg));
    });

    return () => {
      activeDeliveries.forEach((delivery) => {
        socket.emit("leave_chat", delivery.shipmentId);
      });
      socket.off("new_message");
    };
  }, [token, activeDeliveries.length]);

  const handleBack = () => {
    dispatch(setActiveShipment(null));
  };

  const activeDelivery = activeDeliveries.find(
    (d) => d.shipmentId === activeShipmentId,
  );
  const isCompleted = activeDelivery?.shipmentStatus === "COMPLETED";

  return (
    <div className="flex h-[calc(100vh-72px)] rounded-2xl md:rounded-2xl bg-gradient-to-br from-sky-50 via-cyan-100 to-indigo-50 md:p-5 overflow-hidden">
      <div
        className={`w-full md:w-72 md:border-r border-gray-200 bg-slate-50 flex-col md:rounded-l-2xl ${
          activeShipmentId ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="px-4 py-3 border-b border-gray-200 bg-blue-600 md:rounded-tl-2xl">
          <h2 className="font-semibold text-white">Customer Chats</h2>
          <p className="text-xs text-blue-200 mt-1">
            {activeDeliveries.length} active deliveries
          </p>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-none">
          {activeDeliveries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4 text-center">
              <Package size={40} className="mb-2 opacity-50" />
              <p className="text-sm">No active deliveries</p>
            </div>
          ) : (
            activeDeliveries.map((delivery) => (
              <button
                key={delivery.shipmentId}
                onClick={() => dispatch(setActiveShipment(delivery.shipmentId))}
                className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-slate-100 transition-all duration-200 hover:shadow-md flex items-center gap-3 ${
                  activeShipmentId === delivery.shipmentId
                    ? "bg-indigo-50 border-l-4 border-l-indigo-600 shadow-sm"
                    : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                  {delivery.receiverName?.[0]?.toUpperCase() ?? "C"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {delivery.receiverName}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {delivery.trackingId}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    delivery.shipmentStatus === "IN_TRANSIT"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {delivery.shipmentStatus}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      <div
        className={`flex-1 bg-gray-50 flex-col md:rounded-r-2xl ${
          activeShipmentId ? "flex" : "hidden md:flex"
        }`}
      >
        {activeShipmentId && currentUserId ? (
          <>
            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 bg-white md:rounded-tr-2xl flex items-center gap-3">
              <button
                onClick={handleBack}
                className="md:hidden text-gray-500 hover:text-gray-700 -ml-1 p-1"
                aria-label="Back to deliveries"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                {activeDelivery?.receiverName?.[0]?.toUpperCase() ?? "C"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {activeDelivery?.senderName}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {activeDelivery?.trackingId}
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
            <p className="text-sm">Select a delivery to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentChat;