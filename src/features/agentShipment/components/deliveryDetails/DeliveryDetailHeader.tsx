const DeliveryDetailHeader = () => {
  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-slate-600">
                Delivery detail - TRK-001-XYZ
              </h1>
              <p className="text-[13px] text-slate-500 mt-1">
                John Doe • MG Road → Indiranagar
              </p>
            </div>
          </div>
        </div>
        <button
          // onClick={sendShipment}
          className="flex h-[44px] items-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-600 px-5 text-[13px] font-medium text-white shadow-md transition-all hover:from-sky-500 hover:to-indigo-600"
        >
          <i className="fa-brands fa-rocketchat"></i>
          Chat with customer
        </button>
      </div>

      <div className="mt-5 rounded-2xl border border-indigo-200 bg-white py-2 px-5 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-500">
              En route to delivery location
            </h3>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Package picked up — heading to customer address
            </p>
          </div>

          <div className="text-sm text-slate-700">10:00 AM - 11:00 AM</div>
        </div>
      </div>
    </>
  );
};

export default DeliveryDetailHeader;
