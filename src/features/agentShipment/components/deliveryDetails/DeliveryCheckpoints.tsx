import { useNavigate } from "react-router-dom";

const trackDetails = [
  { label: "Started delivery", done: true, active: false },
  {
    label: "Reached pickup location",
    done: true,
    active: false,
  },
  { label: "Package picked up", done: true, active: false },
  { label: "En route to delivery", done: true, active: false },
  {
    label: "Near delivery location",
    done: false,
    active: true,
  },
  { label: "Mark as delivered", done: false, active: false },
];

const DeliveryCheckpoints = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="rounded-2xl border border-indigo-300 bg-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-slate-700 font-semibold">Delivery checkpoints</h2>

          <div className="rounded-full bg-sky-100 px-4 py-1 text-sm text-indigo-400">
            4 of 6 done
          </div>
        </div>

        <div className="space-y-0 mt-2">
          {trackDetails.map((cp, i, arr) => (
            <div key={i} className="flex gap-2 items-stretch">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border text-[10px]
                        ${
                          cp.done
                            ? "bg-green-100 border-green-300 text-green-700"
                            : cp.active
                              ? "bg-blue-100 border-blue-300 text-blue-700"
                              : "bg-slate-100 border-slate-200 text-slate-400"
                        }`}
                >
                  <i
                    className={`fa-solid ${cp.done ? "fa-check" : cp.active ? "fa-truck" : "fa-circle"} text-[12px]`}
                  />
                </div>
                {i < arr.length - 1 && (
                  <div
                    className={`w-px flex-1 min-h-[22px] my-[2px] ${cp.done ? "bg-green-300" : "bg-slate-200"}`}
                  />
                )}
              </div>
              <div
                className={`pb-2 flex-1 flex items-start justify-between ${i === arr.length - 1 ? "pb-0" : ""}`}
              >
                <span
                  className={`text-[11px] font-medium mt-0.5
                        ${
                          cp.done
                            ? "text-slate-600"
                            : cp.active
                              ? "text-blue-700"
                              : "text-slate-400"
                        }`}
                >
                  {cp.label}
                </span>
                {cp.active && (
                  <button
                    onClick={() => navigate(`/agent/delivery/1`)}
                    className="text-[10px] px-2 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition-all flex items-center gap-1 flex-shrink-0"
                  >
                    <i className="fa-solid fa-location-dot text-[9px]" />
                    Update
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button className="mt-5 w-full rounded-lg border border-red-500 bg-red-100 py-2 text-red-500 transition-all hover:bg-red-200 hover:text-red-600">
          Report delivery failure
        </button>
      </div>
    </>
  );
};

export default DeliveryCheckpoints;
