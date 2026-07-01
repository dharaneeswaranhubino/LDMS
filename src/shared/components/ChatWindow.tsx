import { useEffect, useRef, useState } from "react";
import { Send, Loader2, Lock } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import {
  appendMessage,
  sendMessage,
  fetchChatMessages,
} from "../../features/customerShipment/shipmentSlice";

interface Props {
  shipmentId: number;
  currentUserId: number;
  isCompleted?: boolean;
}

const ChatWindow = ({ shipmentId, currentUserId, isCompleted }: Props) => {
  const dispatch = useAppDispatch();
  const { messages, loadingHistory, sendingMessage } = useAppSelector(
    (s) => s.shipment,
  );
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchChatMessages({ shipmentId }));
  }, [shipmentId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || sendingMessage || isCompleted) return;
    setInput("");
    const result = await dispatch(
      sendMessage({ shipmentId, message: trimmed }),
    );
    if (sendMessage.fulfilled.match(result)) {
      dispatch(appendMessage(result.payload));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loadingHistory) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <Loader2 className="animate-spin mr-2" size={20} />
        Loading messages...
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-8">
            No messages yet. Say hi!
          </p>
        )}
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${
                  isMe
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
                }`}
              >
                {!isMe && (
                  <p className="text-xs font-semibold text-blue-500 mb-1">
                    {msg.senderName}
                  </p>
                )}
                <p className="text-sm leading-relaxed">{msg.message}</p>
                <p
                  className={`text-xs mt-1 ${
                    isMe ? "text-blue-200" : "text-gray-400"
                  } text-right`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 md:p-4 border-t border-gray-200 bg-white rounded-br-2xl">
        {isCompleted && (
          <div className="flex items-center justify-center gap-1.5 mb-2 text-gray-400">
            <Lock size={12} />
            <p className="text-xs">Read only after Delivered</p>
          </div>
        )}
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
          <input
            type="text"
            className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400 disabled:cursor-not-allowed disabled:text-gray-400"
            placeholder={isCompleted ? "Chat is closed" : "Type a message..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isCompleted}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sendingMessage || isCompleted}
            className="text-blue-600 hover:text-blue-700 disabled:text-gray-300 transition-colors"
          >
            {sendingMessage ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
