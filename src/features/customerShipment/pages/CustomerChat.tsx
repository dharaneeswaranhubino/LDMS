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
  console.log("activeShipment :",activeShipment);
  

  return (
    <div className="flex h-[calc(100vh-72px)] rounded-2xl bg-gradient-to-br from-sky-50 via-cyan-100 to-indigo-50 p-5">
      <div className="rounded-l-2xl w-72 border-r border-gray-200 bg-slate-50 flex flex-col">
        <div className="rounded-tl-2xl px-4 py-3 border-b border-gray-200 bg-blue-600">
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

      <div className="rounded-r-2xl flex-1 bg-gray-50 flex flex-col min-h-0">
        {activeShipmentId && currentUserId ? (
          <>
            <div className="px-6 py-4 border-b border-gray-200 bg-white rounded-tr-2xl">
              <p className="text-sm font-semibold text-gray-800">
                Tracking ID: {activeShipment?.trackingId}
              </p>
              <p className="text-xs text-gray-400">
                <span className="text-[12px] font-medium text-blue-600">{activeShipment?.assignedAgent?.agentName} - </span>
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
