import { useNavigate } from "react-router-dom";
import type { CustomerMessage } from "../../../agentShipment/agentTypes";

interface Props {
  messages: CustomerMessage[];
}

const formatTime = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  }
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};
const CustomerMessages = ({ messages }: Props) => {
  const navigate = useNavigate();

  const latestPerShipment = Object.values(
    messages.reduce<Record<number, CustomerMessage>>((acc, msg) => {
      if (!acc[msg.shipmentId] || new Date(msg.sentAt) > new Date(acc[msg.shipmentId].sentAt)) {
        acc[msg.shipmentId] = msg;
      }
      return acc;
    }, {})
  );
  console.log(latestPerShipment);
  

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-white rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-50 flex items-center justify-center">
            <i className="fa-solid fa-message text-cyan-500 text-[12px]" />
          </div>
          <span className="text-[13px] font-bold text-slate-700">Customer messages</span>
        </div>
        {messages.length > 0 && (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600 border border-red-100 animate-pulse">
            {messages.length} new
          </span>
        )}
      </div>

      <div className="divide-y divide-slate-100/70 max-h-[320px] overflow-y-auto scrollbar-none">
        {latestPerShipment.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-3">
              <i className="fa-regular fa-comment text-slate-300 text-2xl" />
            </div>
            <p className="text-[12px] text-slate-500 font-semibold">No messages yet</p>
          </div>
        ) : (
          latestPerShipment.map((msg) => (
            <div
              key={msg.shipmentId}
              onClick={() => navigate(`/agentChat`)}
              className="flex items-start gap-3 px-4 py-3.5 hover:bg-cyan-50/30 transition-all cursor-pointer group"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-cyan-500 text-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold shadow-sm mt-0.5">
                {msg.customerName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                    <span className="text-[10px] font-mono font-bold text-slate-600 truncate">
                      {msg.trackingId}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 flex-shrink-0 font-mono">
                    {formatTime(msg.sentAt)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate leading-relaxed">
                  <span className="font-bold text-slate-700">{msg.customerName}:</span>{" "}
                  {msg.message}
                </p>
                <div className="flex items-center gap-1 mt-1.5">
                  <span className="text-[10px] font-semibold text-cyan-600 group-hover:text-cyan-700 flex items-center gap-1 transition-colors">
                    <i className="fa-solid fa-reply text-[9px]" />
                    Reply
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {latestPerShipment.length > 0 && (
        <div className="px-4 py-2.5 border-t border-slate-100/80 bg-gradient-to-r from-cyan-50/50 to-indigo-50/50">
          <button
            onClick={() => navigate("/agentChat")}
            className="text-[11px] text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 transition-colors"
          >
            View all conversations
            <i className="fa-solid fa-arrow-right text-[9px]" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerMessages;