import type { DashboardSupportChat } from "../../../customerShipment/shipmentTypes";
import { formatNotificationTime } from "../../../customerShipment/utils/shipmentHelpers";

const SENDER_LABEL: Record<string, string> = {
  DELIVERY_AGENT: "Delivery agent",
  CUSTOMER: "You",
  ADMIN: "Support team",
};

const AVATAR_STYLE: Record<string, string> = {
  DELIVERY_AGENT: "bg-blue-100 text-blue-700",
  CUSTOMER: "bg-teal-100 text-teal-700",
  ADMIN: "bg-violet-100 text-violet-700",
};

const AVATAR_TEXT: Record<string, string> = {
  DELIVERY_AGENT: "DA",
  CUSTOMER: "ME",
  ADMIN: "ST",
};

const SupportChatList = ({ chats }: { chats: DashboardSupportChat[] }) => {
  if (!chats.length) {
    return <p className="py-8 text-center text-sm text-gray-400">No support chats yet.</p>;
  }

  return (
    <div className="flex flex-col gap-2.5">
      {chats.map((chat) => (
        <div
          key={chat.shipmentId}
          className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-3.5 transition-colors hover:border-gray-200 hover:bg-gray-50"
        >
          <div
            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-semibold ${AVATAR_STYLE[chat.lastMessageBy] ?? "bg-gray-100 text-gray-600"}`}
          >
            {AVATAR_TEXT[chat.lastMessageBy] ?? "?"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="truncate text-[13px] font-medium text-gray-800">
                {chat.trackingId}
              </p>
              <span className="flex-shrink-0 text-[11px] text-gray-400">
                {formatNotificationTime(chat.updatedAt)}
              </span>
            </div>
            <p className="mt-0.5 truncate text-[12px] text-gray-500">
              {chat.lastMessage}
            </p>
            <p className="mt-1.5 text-[11px] text-gray-400">
              {SENDER_LABEL[chat.lastMessageBy] ?? chat.lastMessageBy}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SupportChatList;