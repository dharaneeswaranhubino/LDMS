const DeliveryCheckpoints = () => {
  const checkpoints = [
    {
      title: "Started delivery",
      time: "10:05 AM",
      completed: true,
    },
    {
      title: "Reached pickup location",
      time: "10:18 AM",
      completed: true,
    },
    {
      title: "Package picked up",
      time: "10:25 AM",
      completed: true,
    },
    {
      title: "En route to delivery",
      time: "10:28 AM",
      completed: true,
    },
    {
      title: "Near delivery location",
      time: "Pending",
      completed: false,
      active: true,
    },
    {
      title: "Mark as delivered",
      time: "Waiting previous step",
      completed: false,
    },
  ];
  return (
    <>
      <div className="rounded-3xl border border-zinc-800 bg-[#151515] p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Delivery checkpoints</h2>

          <div className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1 text-sm text-blue-300">
            4 of 6 done
          </div>
        </div>

        <div className="relative mt-8 space-y-8 before:absolute before:left-[14px] before:top-0 before:h-full before:w-px before:bg-zinc-700">
          {checkpoints.map((checkpoint, index) => (
            <div key={index} className="relative flex gap-4">
              <div
                className={`relative z-10 mt-1 h-7 w-7 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                  checkpoint.completed
                    ? "border-green-500 bg-green-500/20 text-green-400"
                    : checkpoint.active
                      ? "border-blue-500 bg-blue-500/20 text-blue-400"
                      : "border-zinc-600 bg-zinc-900 text-zinc-500"
                }`}
              >
                {checkpoint.completed ? "✓" : ""}
              </div>

              <div className="flex-1">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3
                      className={`font-semibold ${
                        checkpoint.active ? "text-blue-400" : "text-white"
                      }`}
                    >
                      {checkpoint.title}
                    </h3>
                    <p className="text-sm text-zinc-500">{checkpoint.time}</p>
                  </div>

                  <button
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      checkpoint.completed
                        ? "border border-green-500/20 bg-green-500/10 text-green-300"
                        : checkpoint.active
                          ? "border border-blue-500/20 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
                          : "cursor-not-allowed border border-zinc-700 bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {checkpoint.completed
                      ? "Updated"
                      : checkpoint.active
                        ? "Update status"
                        : "Pending"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="mt-8 w-full rounded-2xl border border-red-500/20 bg-red-500/10 py-4 font-medium text-red-300 transition-all hover:bg-red-500/20">
          Report delivery failure
        </button>
      </div>
    </>
  );
};

export default DeliveryCheckpoints;
