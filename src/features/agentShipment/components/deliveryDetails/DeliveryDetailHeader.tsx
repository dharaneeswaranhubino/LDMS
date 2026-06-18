import { formatSlot, STATUS_CONFIG, type DeliveryDetailHeaderProps } from "../../utils/statusHelpers";


const DeliveryDetailHeader = ({
  data,
  currentStatus,
}: DeliveryDetailHeaderProps) => {
  const config = STATUS_CONFIG[currentStatus] ?? STATUS_CONFIG.PENDING;

  return (
    <div className="flex flex-col gap-3">

      <div className="rounded-2xl border border-indigo-100 bg-white px-5 py-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-[15px] font-semibold text-slate-700">
                {data?.trackingId}
              </h1>

              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1 rounded-full"
                style={{ background: config.badgeBg, color: config.badgeColor }}
              >
                <i className={`${config.icon} text-[10px]`} />
                {config.badgeLabel}
              </span>
            </div>

            <p className="mt-1.5 flex items-center gap-2 text-[13px] text-slate-500">
              <span className="font-medium text-slate-600">{data?.receiverName}</span>
              <i className="fa-solid fa-arrow-right text-[10px] text-slate-400" />
              <span className="truncate max-w-[300px]">
                {data?.deliveryAddress}, {data?.deliveryCity}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500">
              <i className="fa-regular fa-clock text-slate-400" />
              {formatSlot(data?.assignedSlotStart)} – {formatSlot(data?.assignedSlotEnd)}
            </div>

            {/* <button className="flex h-[38px] items-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-600 px-4 text-[12px] font-medium text-white shadow-md transition-all hover:from-sky-500 hover:to-indigo-600">
              <i className="fa-brands fa-rocketchat" />
              Chat with customer
            </button> */}
          </div>
        </div>
      </div>

    </div>
  );
};

export default DeliveryDetailHeader;