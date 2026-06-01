import { Badge } from "lucide-react";
import type { DashboardSupportChat } from "../../../shipment/shipmentTypes";
import {
  fmtDate,
  getInitials,
  SUPPORT_STATUS_CONFIG,
} from "../../utils/CustomerDashboardHelper";

const SupportChatList = ({ chats }: { chats: DashboardSupportChat[] }) => {
  if (!chats.length) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">
        No support chats yet.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-2.5">
      {chats.map((chat) => {
        const initials = chat.agentName ? getInitials(chat.agentName) : "AI";
        const isBot = chat.lastMessageBy === "BOT" || !chat.agentName;
        return (
          <div
            key={chat.chatId}
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-100 bg-white p-3.5 transition-colors hover:border-gray-200 hover:bg-gray-50"
          >
            <div
              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-semibold ${
                isBot
                  ? "bg-violet-100 text-violet-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="truncate text-[13px] font-medium text-gray-800">
                  {chat.subject}
                </p>
                <span className="flex-shrink-0 text-[11px] text-gray-400">
                  {fmtDate(chat.updatedAt)}
                </span>
              </div>
              <p className="mt-0.5 truncate text-[12px] text-gray-500">
                {chat.lastMessage}
              </p>
              <div className="mt-2 flex items-center gap-2">
                {chat.unreadCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[9px] font-bold text-white">
                    {chat.unreadCount}
                  </span>
                )}
                <Badge status={chat.status} config={SUPPORT_STATUS_CONFIG} />
                <span className="text-[11px] text-gray-400">
                  {chat.agentName ? `Agent: ${chat.agentName}` : "Automated"}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SupportChatList;
