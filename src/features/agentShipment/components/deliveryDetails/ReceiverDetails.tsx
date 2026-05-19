import DetailRow from "./DetailRow";

const ReceiverDetails = () => {
  return (
    <>
      <div className="rounded-3xl border border-indigo-200 bg-white p-4 shadow-lg">
        <h2 className="text-slate-500 font-semibold">Receiver details</h2>

        <div className="mt-2 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/20 font-bold text-blue-400">
            JD
          </div>

          <div>
            <h3 className="text-slate-500 font-semibold">John Doe</h3>
            <p className="text-sm text-slate-400">Receiver • Customer</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <DetailRow label="Phone" value="+91 98765 43210" />
          <DetailRow label="Deliver to" value="No.45, Indiranagar" />
          <DetailRow label="Gate code" value="1234" />
          <DetailRow label="Pincode" value="560038" />
        </div>
      </div>
    </>
  );
};

export default ReceiverDetails;
