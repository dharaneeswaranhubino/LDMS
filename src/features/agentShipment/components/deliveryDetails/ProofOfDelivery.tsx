const ProofOfDelivery = () => {
  const otp = ["4", "8", "2", "", "", ""];
  return (
    <>
      <div className="rounded-3xl border border-zinc-800 bg-[#151515] p-6 shadow-lg">
        <h2 className="text-lg font-semibold">Proof of delivery</h2>

        <p className="mt-2 text-sm text-zinc-400">
          Send OTP to customer's phone, then enter it below to confirm delivery.
        </p>

        <button className="mt-6 w-full rounded-2xl border border-blue-500/30 bg-blue-500/10 py-4 font-medium text-blue-300 transition-all hover:bg-blue-500/20">
          Send OTP to customer
        </button>

        <div className="mt-6 flex flex-wrap gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              value={digit}
              readOnly
              className="h-14 w-14 rounded-2xl border border-zinc-700 bg-zinc-900 text-center text-xl font-bold outline-none focus:border-blue-500"
            />
          ))}
        </div>

        <div className="mt-6 flex min-h-[180px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 p-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800 text-2xl">
            📷
          </div>

          <h3 className="mt-4 font-medium">Upload delivery photo</h3>

          <p className="mt-1 text-sm text-zinc-500">Optional — tap to attach</p>
        </div>

        <button className="mt-6 w-full cursor-not-allowed rounded-2xl border border-zinc-700 bg-zinc-800 py-4 font-medium text-zinc-500">
          Confirm delivery
        </button>

        <p className="mt-3 text-center text-xs text-zinc-500">
          Enter full OTP to activate confirm button
        </p>
      </div>
    </>
  );
};

export default ProofOfDelivery;
