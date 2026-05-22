import { useNavigate } from "react-router-dom";

const CustomerMessages = ({ messages, unreadCount }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-message text-slate-500 text-[15px]" />
          <span className="text-[13px] font-semibold text-slate-800">
            Customer messages
          </span>
        </div>
        {unreadCount > 0 && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-700 border border-red-200">
            {unreadCount} new
          </span>
        )}
      </div>

      <div className="divide-y divide-slate-100">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <i className="fa-regular fa-comment text-slate-200 text-3xl mb-2" />
            <p className="text-[12px] text-slate-400">No messages yet</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => navigate(`/agent/chat/${msg.id}`)}
              className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-all cursor-pointer"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-semibold mt-0.5
                  ${msg.unread ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}
              >
                {msg.customerName
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <div className="flex items-center gap-2">
                    {msg.unread && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    )}
                    <span className="text-[11px] font-mono font-semibold text-slate-700 truncate">
                      {msg.trackingId.substring(0, 14)}…
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">
                    {msg.lastMessageTime}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  <span className="font-medium text-slate-700">
                    {msg.customerName}:
                  </span>{" "}
                  {msg.lastMessage}
                </p>
                <div className="flex items-center gap-1 mt-1.5">
                  <button className="text-[10px] font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    <i className="fa-solid fa-reply text-[9px]" />
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {messages.length > 0 && (
        <div className="px-4 py-2 border-t border-slate-100">
          <button
            onClick={() => navigate("/agent/chat")}
            className="text-[11px] text-blue-600 hover:text-blue-700 font-medium"
          >
            View all conversations →
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerMessages;
