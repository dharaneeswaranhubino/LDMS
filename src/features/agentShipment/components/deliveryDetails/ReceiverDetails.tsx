import type { ReceiverDetailCard } from "../../agentTypes";

const ReceiverDetails = ({ data }: ReceiverDetailCard) => {
  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">

      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-4">
        Receiver Details
      </p>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[13px] font-bold text-indigo-500">
          {data?.receiverName ? getInitials(data.receiverName) : "?"}
        </div>
        <div>
          <p className="text-[13px] font-semibold text-slate-700">
            {data?.receiverName}
          </p>
          <p className="text-[11px] text-slate-400">Receiver • Customer</p>
        </div>
      </div>

      <div className="h-px bg-slate-100 mb-4" />

      <div className="flex flex-col gap-3">
        {[
          {
            icon: "fa-solid fa-phone",
            label: "Phone",
            value: data?.receiverPhone,
          },
          {
            icon: "fa-solid fa-location-dot",
            label: "Deliver to",
            value: `${data?.deliveryAddress}, ${data?.deliveryCity}`,
          },
          {
            icon: "fa-solid fa-map-pin",
            label: "Pincode",
            value: data?.deliveryPincode,
          },
        ].map(({ icon, label, value }) => (
          <div key={label} className="flex items-start gap-3">
            <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-50">
              <i className={`${icon} text-[11px] text-indigo-400`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
                {label}
              </p>
              <p className="text-[12px] font-medium text-slate-600 leading-snug break-words">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReceiverDetails;