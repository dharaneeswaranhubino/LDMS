import type { TimelineStatus } from "../../shipmentTypes";
import { STATUS_META } from "../../utils/shipmentHelpers";

const TimeLineStatusBadge = ({ status }: { status: TimelineStatus }) => {
  const meta = STATUS_META[status];
  const isLive =
    status === "IN_TRANSIT" ||
    status === "OUT_FOR_DELIVERY" ||
    status === "OUT_FOR_PICKUP";
  return (
    <>
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${meta.bgColor} ${meta.textColor}`}
      >
        {isLive && (
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        )}
        {meta.label}
      </span>
    </>
  );
};

export default TimeLineStatusBadge;
