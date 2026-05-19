const DeliveryDetailHeader = () => {
  return (
    <>
      <div className="rounded-3xl border border-zinc-800 bg-[#121212] p-5 shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 transition-colors">
                ←
              </button>

              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  Delivery detail — TRK-001-XYZ
                </h1>
                <p className="text-sm text-zinc-400">
                  John Doe • MG Road → Indiranagar
                </p>
              </div>
            </div>
          </div>

          <button className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-3 text-sm font-medium text-blue-400 transition-all hover:bg-blue-500/20">
            Chat with customer
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="font-semibold text-blue-300">
                En route to delivery location
              </h3>
              <p className="text-sm text-blue-200/70">
                Package picked up — heading to customer address
              </p>
            </div>

            <div className="text-sm text-blue-300">10:00 AM - 11:00 AM</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeliveryDetailHeader;
