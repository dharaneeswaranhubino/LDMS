import { useEffect } from "react";
import { Package, MessageCircle } from "lucide-react";
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

  // Only show shipments with assigned agent that are active
  const chattableShipments = shipments.filter(
    (s) =>
      s.assignedAgent !== null &&
      s.shipmentStatus !== "DELIVERED" &&
      s.shipmentStatus !== "CANCELLED",
  );

  useEffect(() => {
    if (!token || chattableShipments.length === 0) return;

    const socket = getSocket(token);

    //Join rooms only after connected
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

  const activeShipment = chattableShipments.find(
    (s) => s.shipmentId === activeShipmentId,
  );

  return (
    <div className="flex h-[calc(100vh-72px)]">
      <div className="w-72 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">Your Shipments</h2>
          <p className="text-xs text-gray-400 mt-1">
            Select a shipment to chat with your agent
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
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
                className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  activeShipmentId === shipment.shipmentId
                    ? "bg-blue-50 border-l-4 border-l-blue-500"
                    : ""
                }`}
              >
                <p className="text-sm font-medium text-gray-800">
                  {shipment.trackingId}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {shipment.pickupAddress} → {shipment.deliveryAddress}
                </p>
                <span
                  className={`text-xs font-medium mt-1 inline-block px-2 py-0.5 rounded-full ${
                    shipment.shipmentStatus === "IN_TRANSIT"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {shipment.shipmentStatus}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 bg-gray-50 flex flex-col">
        {activeShipmentId && currentUserId ? (
          <>
            <div className="px-6 py-4 border-b border-gray-200 bg-white">
              <p className="text-sm font-semibold text-gray-800">
                Tracking ID: {activeShipment?.trackingId}
              </p>
              <p className="text-xs text-gray-400">
                Chat with your delivery agent
              </p>
            </div>
            <ChatWindow
              shipmentId={activeShipmentId}
              currentUserId={currentUserId}
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
