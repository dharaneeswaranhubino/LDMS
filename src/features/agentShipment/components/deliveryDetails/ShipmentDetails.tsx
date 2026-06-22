  import type { ShipmentDetailsProps } from "../../agentTypes";

  const ShipmentDetails = ({ data }: ShipmentDetailsProps) => {
    return (
      <div className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">

        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              Shipment Details
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {data?.isFragile && (
                <span className="rounded-full border border-yellow-300 bg-yellow-50 px-2.5 py-0.5 text-[11px] font-semibold text-yellow-600">
                  Fragile
                </span>
              )}
              <span className="rounded-full border border-purple-300 bg-purple-50 px-2.5 py-0.5 text-[11px] font-semibold text-purple-600">
                {data?.shipmentPriority}
              </span>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-1">
              Tracking ID
            </p>
            <p className="text-[12px] font-bold text-indigo-600 font-mono leading-snug">
              {data?.trackingId}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 mb-4">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
                Pickup
              </p>
              <p className="text-[12px] text-slate-600 leading-relaxed">
                {data?.pickupAddress},
                <br />
                {data?.pickupCity}, {data?.pickupPincode}
              </p>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
                <i className="fa-solid fa-arrow-right text-indigo-400 text-[10px]" />
              </div>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
                Delivery
              </p>
              <p className="text-[12px] text-slate-600 leading-relaxed">
                {data?.deliveryAddress},
                <br />
                {data?.deliveryCity}, {data?.deliveryPincode}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            { label: "Item", value: data?.itemName },
            { label: "Weight", value: `${data?.packageWeight} kg` },
            {
              label: "Amount",
              value: `₹${data?.amount}`,
              highlight: true,
            },
            {
              label: "Payment",
              value: data?.paymentStatus?.toLowerCase(),
              pill: true,
            },
          ].map(({ label, value, highlight, pill }) => (
            <div
              key={label}
              className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2.5"
            >
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
                {label}
              </p>
              {pill ? (
                <span className="inline-block rounded-full bg-green-50 border border-green-200 px-2 py-0.5 text-[11px] font-semibold text-green-600 capitalize">
                  {value}
                </span>
              ) : (
                <p
                  className={`text-[13px] font-semibold truncate ${
                    highlight ? "text-green-600" : "text-slate-700"
                  }`}
                >
                  {value}
                </p>
              )}
            </div>
          ))}
        </div>

        {data?.description && (
          <div className="rounded-xl bg-indigo-50 border border-indigo-100 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-400 mb-0.5">
              Description
            </p>
            <p className="text-[12px] text-indigo-500 leading-relaxed">
              {data.description}
            </p>
          </div>
        )}
      </div>
    );
  };

  export default ShipmentDetails;