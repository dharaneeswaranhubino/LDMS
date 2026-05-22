import { useNavigate } from "react-router-dom";

const ActiveShipments = ({
  activeDelivery,
  STATUS_CONFIG,
  deliveryMock,
  getStatusState,
}) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white border border-blue-200 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-truck text-blue-600 text-[15px]" />
          <span className="text-[13px] font-semibold text-slate-800">
            Active Shipments
          </span>
        </div>
        {activeDelivery ? (
          <span
            className={`px-2 py-1 rounded-lg text-[10px] font-semibold border ${STATUS_CONFIG[activeDelivery.shipmentStatus].style}`}
          >
            <i
              className={`fa-solid ${STATUS_CONFIG[activeDelivery.shipmentStatus].icon} mr-1 text-[9px]`}
            />
            {STATUS_CONFIG[activeDelivery.shipmentStatus].label}
          </span>
        ) : null}
      </div>

      {activeDelivery ? (
        <>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-3">
            <p className="text-[11px] font-mono font-semibold text-blue-800">
              {activeDelivery.trackingId}
            </p>
            <p className="text-[12px] font-semibold text-slate-800 mt-1">
              {activeDelivery.customerName}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
              <span>{activeDelivery.pickupCity}</span>
              <i className="fa-solid fa-arrow-right text-slate-300 text-[9px]" />
              <span>{activeDelivery.deliveryCity}</span>
            </div>
            <div className="flex gap-3 mt-1">
              <span className="text-[10px] text-slate-400">
                <i className="fa-solid fa-weight-hanging mr-1" />
                {activeDelivery.packageWeight} kg
              </span>
              {activeDelivery.isFragile && (
                <span className="text-[10px] text-amber-600">
                  <i className="fa-solid fa-triangle-exclamation mr-1" />
                  Fragile
                </span>
              )}
              <span className="text-[10px] text-slate-400">
                <i className="fa-regular fa-clock mr-1" />
                {activeDelivery.assignedSlotStart} –{" "}
                {activeDelivery.assignedSlotEnd}
              </span>
            </div>
          </div>

          <div className="space-y-0">
            {deliveryMock.timeline.map((cp, i, arr) => {
              const state = getStatusState(deliveryMock.currentStatus, cp.key);
              return (
                <div key={i} className="flex gap-2 items-stretch">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border text-[10px]
                              ${
                                state.done
                                  ? "bg-green-100 border-green-300 text-green-700"
                                  : state.active
                                    ? "bg-blue-100 border-blue-300 text-blue-700"
                                    : "bg-slate-100 border-slate-200 text-slate-400"
                              }`}
                    >
                      <i
                        className={`fa-solid ${state.done ? "fa-check" : state.active ? "fa-truck" : "fa-circle"} text-[8px]`}
                      />
                    </div>
                    {i < arr.length - 1 && (
                      <div
                        className={`w-px flex-1 min-h-[12px] my-[2px] ${state.done ? "bg-green-300" : "bg-slate-200"}`}
                      />
                    )}
                  </div>
                  <div
                    className={`pb-2 flex-1 flex items-start justify-between ${i === arr.length - 1 ? "pb-0" : ""}`}
                  >
                    <span
                      className={`text-[11px] font-medium mt-0.5
                              ${
                                state.done
                                  ? "text-slate-600"
                                  : state.active
                                    ? "text-blue-700"
                                    : "text-slate-400"
                              }`}
                    >
                      {cp.label}
                    </span>
                    {state.active ? (
                      <span className="text-[10px] px-2 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition-all flex items-center gap-1 flex-shrink-0">
                        <i className="fa-solid fa-truck text-[9px]" />
                        Active
                      </span>
                    ) : state.done ? (
                      <span className="text-[10px] px-2 py-1 bg-green-100 border-green-300 text-green-700 rounded-lg hover:bg-blue-100 transition-all flex items-center gap-1 flex-shrink-0">
                        <i className="fa-solid fa-check text-[9px]" />
                        Done
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-1 bg-slate-100 border-slate-200 text-slate-400 rounded-lg hover:bg-blue-100 transition-all flex items-center gap-1 flex-shrink-0">
                        <i className="fa-solid fa-circle text-[9px]" />
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => navigate(`/deliveryDetail`)}
            className="w-full mt-3 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[12px] font-medium hover:from-blue-600 hover:to-indigo-600 transition-all flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-arrow-right text-[11px]" />
            Open delivery detail
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <i className="fa-solid fa-truck text-slate-200 text-3xl mb-3" />
          <p className="text-[12px] text-slate-500 font-medium">
            No active delivery right now
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Your next delivery will appear here when started
          </p>
        </div>
      )}
    </div>
  );
};

export default ActiveShipments;
