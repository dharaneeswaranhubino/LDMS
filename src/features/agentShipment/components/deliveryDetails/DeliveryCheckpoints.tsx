import { useState } from "react";
import { deliveryMock } from "../../utils/mockDelivery";
import { getStatusState, statusOrder } from "../../utils/statusHelpers";
import UpdateStatusModal from "./UpdateStatusModal";

const DeliveryCheckpoints = () => {
  const [currentStatus, setCurrentStatus] = useState(
    deliveryMock.currentStatus,
  );
  const [openModal, setOpenModal] = useState(false);
  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <>
      <div className="rounded-2xl border border-indigo-300 bg-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-slate-700 font-semibold">Delivery checkpoints</h2>

          <div className="rounded-full bg-sky-100 px-4 py-1 text-sm text-indigo-400">
            {currentIndex + 1} of {statusOrder.length} done
          </div>
        </div>

        <div className="space-y-0 mt-4">
          {deliveryMock.timeline.map((item, i, arr) => {
            const state = getStatusState(currentStatus, item.key);
            

            return (
              <div key={item.key} className="flex gap-3 items-stretch">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border
                    ${
                      state.done
                        ? "bg-green-100 border-green-300 text-green-700"
                        : state.active
                          ? "bg-blue-100 border-blue-300 text-blue-700"
                          : "bg-slate-100 border-slate-200 text-slate-400"
                    }`}
                  >
                    <i
                      className={`fa-solid ${
                        state.done
                          ? "fa-check"
                          : state.active
                            ? "fa-truck"
                            : "fa-circle"
                      }`}
                    />
                  </div>

                  {i < arr.length - 1 && (
                    <div
                      className={`w-px flex-1 min-h-[50px]
                      ${state.done ? "bg-green-300" : "bg-slate-200"}`}
                    />
                  )}
                </div>

                <div className="flex-1 pb-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3
                        className={`font-medium
                        ${
                          state.active
                            ? "text-blue-700"
                            : state.done
                              ? "text-slate-700"
                              : "text-slate-400"
                        }`}
                      >
                        {item.label}
                      </h3>

                      <p className="text-xs text-slate-400 mt-1">
                        {item.description}
                      </p>
                    </div>

                    {state.active && currentStatus !== "DELIVERED" && (
                      <button
                        onClick={() => setOpenModal(true)}
                        className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-blue-700 hover:bg-blue-100"
                      >
                        Update
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {openModal && (
        <UpdateStatusModal
          onClose={() => setOpenModal(false)}
          currentStatus={currentStatus}
          onUpdate={setCurrentStatus}
        />
      )}
    </>
  );
};

export default DeliveryCheckpoints;
