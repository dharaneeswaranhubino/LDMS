import type { ReceiverDetailCard } from "../../agentTypes";
import DetailRow from "./DetailRow";

const ReceiverDetails = ({ data }: ReceiverDetailCard) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  return (
    <>
      <div className="rounded-3xl border border-indigo-200 bg-white p-4 shadow-lg">
        <h2 className="text-slate-500 font-semibold">Receiver details</h2>

        <div className="mt-2 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/20 font-bold text-blue-400">
            {data?.receiverName ? getInitials(data.receiverName) : "U"}
          </div>

          <div>
            <h3 className="text-slate-500 font-semibold">
              {data?.receiverName}
            </h3>
            <p className="text-sm text-slate-400">Receiver • Customer</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <DetailRow label="Phone" value={data?.receiverPhone} />
          <DetailRow
            label="Deliver to"
            value={`${data?.deliveryAddress},${data?.deliveryCity}`}
          />
          {/* <DetailRow label="Gate code" value="1234" /> */}
          <DetailRow label="Pincode" value={data?.deliveryPincode} />
        </div>
      </div>
    </>
  );
};

export default ReceiverDetails;
