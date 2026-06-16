import { Package, MessageCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/reduxHooks';
import { setActiveShipment } from '../../customerShipment/shipmentSlice';
import ChatWindow from '../../../shared/components/ChatWindow';

const AgentChat = () => {
  const dispatch = useAppDispatch();
  const activeShipmentId = useAppSelector((s) => s.shipment.activeShipmentId);
  const currentUserId = useAppSelector((s) => s.auth.user?.id);

  // Get agent's assigned deliveries from your existing delivery slice
  const deliveries = useAppSelector((s) => s.agent.deliveries);

  const activeDeliveries = deliveries.filter(
    (d) => d.shipmentStatus !== 'DELIVERED' && d.shipmentStatus !== 'CANCELLED'
  );

  const activeDelivery = activeDeliveries.find((d) => d.shipmentId === activeShipmentId);

  return (
    <div className="flex h-[calc(100vh-72px)]">
      {/* Left sidebar - WhatsApp style */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-blue-600">
          <h2 className="font-semibold text-white">Customer Chats</h2>
          <p className="text-xs text-blue-200 mt-1">{activeDeliveries.length} active deliveries</p>
        </div>

        <div className="flex-1 overflow-y-auto">
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
                className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                  activeShipmentId === delivery.shipmentId ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                }`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                  {delivery.receiverName?.[0]?.toUpperCase() ?? 'C'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{delivery.receiverName}</p>
                  <p className="text-xs text-gray-400 truncate">{delivery.trackingId}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                  delivery.shipmentStatus === 'IN_TRANSIT'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {delivery.shipmentStatus}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right: Chat window */}
      <div className="flex-1 bg-gray-50 flex flex-col">
        {activeShipmentId && currentUserId ? (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                {activeDelivery?.receiverName?.[0]?.toUpperCase() ?? 'C'}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{activeDelivery?.receiverName}</p>
                <p className="text-xs text-gray-400">{activeDelivery?.trackingId}</p>
              </div>
            </div>
            <ChatWindow shipmentId={activeShipmentId} currentUserId={currentUserId} />
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