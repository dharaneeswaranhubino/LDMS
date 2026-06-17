import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../shared/hooks/reduxHooks";
import type { ChatMessage } from "../../adminTypes";
import { avatarColor, formatChatTime, getInitials, ROLE_BADGE, ROLE_LABEL, ROLE_STYLE } from "../../utils/adminShipmentHelper";
import { clearChatHistory, fetchChatHistory } from "../../adminSlice";

const ChatBubble = ({ msg }: { msg: ChatMessage }) => (
  <div
    className={`rounded-xl p-3 border ${ROLE_STYLE[msg.senderRole] ?? "bg-slate-50 border-slate-100"}`}
  >
    <div className="flex items-center justify-between gap-2 mb-1.5">
      <div className="flex items-center gap-2">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${avatarColor(msg.senderName)}`}
        >
          {getInitials(msg.senderName)}
        </div>
        <span className="text-[11px] font-semibold text-slate-700">
          {msg.senderName}
        </span>
        <span
          className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md ${ROLE_BADGE[msg.senderRole] ?? "bg-slate-100 text-slate-500"}`}
        >
          {ROLE_LABEL[msg.senderRole] ?? msg.senderRole}
        </span>
      </div>
      <span className="text-[9px] text-slate-400 flex-shrink-0">
        {formatChatTime(msg.createdAt)}
      </span>
    </div>
    <p className="text-[12px] text-slate-700 leading-relaxed pl-8">
      {msg.message}
    </p>
  </div>
);

const ChatHistoryPanel = ({
  shipmentId,
  onBack,
}: {
  shipmentId: number;
  onBack: () => void;
}) => {
  const dispatch = useAppDispatch();
  const { chatHistory, chatHistoryLoading, chatHistoryError, chatHistoryShipmentInfo } =
    useAppSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchChatHistory({ shipmentId, page: 1, limit: 50 }));
    return () => {
      dispatch(clearChatHistory());
    };
  }, [dispatch, shipmentId]);

  return (
    <div className="flex flex-col h-[90vh]">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all flex-shrink-0"
            aria-label="Back to shipment details"
          >
            <i className="fa-solid fa-arrow-left text-slate-500 text-[12px]" />
          </button>
          <div>
            <h2 className="text-[15px] font-semibold text-slate-800">
              Chat History
            </h2>
            {chatHistoryShipmentInfo && (
              <p className="text-[11px] text-slate-400 mt-0.5">
                {chatHistoryShipmentInfo.customer.name} ↔{" "}
                {chatHistoryShipmentInfo.assignedAgent.name}
              </p>
            )}
          </div>
        </div>
        {chatHistoryShipmentInfo && (
          <span className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-slate-100 text-slate-500 border border-slate-200">
            {chatHistoryShipmentInfo.shipmentStatus}
          </span>
        )}
      </div>

      {/* Panel Body */}
      <div className="flex-1 overflow-y-auto scrollbar-none p-4 sm:p-6">
        {chatHistoryLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <i className="fa-solid fa-spinner fa-spin text-slate-400 text-xl" />
            <p className="text-[12px] text-slate-400">Loading messages...</p>
          </div>
        ) : chatHistoryError ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <i className="fa-solid fa-triangle-exclamation text-red-400 text-xl" />
            <p className="text-[12px] text-red-400">{chatHistoryError}</p>
            <button
              onClick={() =>
                dispatch(fetchChatHistory({ shipmentId, page: 1, limit: 50 }))
              }
              className="text-[11px] text-sky-500 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <i className="fa-regular fa-comment-dots text-slate-300 text-3xl" />
            <p className="text-[12px] text-slate-400">No messages yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-[10px] text-slate-400 text-center mb-4">
              {chatHistory.length} message{chatHistory.length !== 1 ? "s" : ""}
            </p>
            {[...chatHistory].reverse().map((msg) => (
              <ChatBubble key={msg.id} msg={msg} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistoryPanel