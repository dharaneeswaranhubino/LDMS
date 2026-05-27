import { useState } from "react";
import { deliveryMock } from "../../utils/mockDelivery";
import { getStatusState, statusOrder } from "../../utils/statusHelpers";
import UpdateStatusModal from "./UpdateStatusModal";
import { useAppDispatch, useAppSelector } from "../../../../shared/hooks/reduxHooks";

const DeliveryCheckpoints = ({data}) => {
  const dispatch = useAppDispatch();
  const [currentStatus, setCurrentStatus] = useState(
    deliveryMock.currentStatus,
  );
  const [openModal, setOpenModal] = useState(false);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
  const [truckProgress, setTruckProgress] = useState(0); // 0 → 1 over 3s

  const currentIndex = statusOrder.indexOf(currentStatus);

  const {updateTrackStatus} = useAppSelector((state)=>state.agent);

  const handleUpdate = (nextStatus: string) => {
    dispatch(updateTrackStatus())
    // setAnimatingIndex(currentIndex);
    // setTruckProgress(0);

    // const start = performance.now();
    // const duration = 3000;

    // const tick = (now: number) => {
    //   const progress = Math.min((now - start) / duration, 1);
    //   setTruckProgress(progress);

    //   if (progress < 1) {
    //     requestAnimationFrame(tick);
    //   } else {
    //     setCurrentStatus(nextStatus);
    //     setAnimatingIndex(null);
    //     setTruckProgress(0);
    //   }
    // };

    // requestAnimationFrame(tick);

  };

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
            const isAnimatingFromHere = animatingIndex === i;
            const isAnimatingToHere = animatingIndex === i - 1;
            const destinationGreen = isAnimatingToHere
              ? Math.min(Math.max((truckProgress - 0.7) / 0.3, 0), 1)
              : 0;

            return (
              <div key={item.key} className="flex gap-3 items-stretch">
                <div className="flex flex-col items-center">
                  <div className="relative w-8 h-8">
                    {!isAnimatingFromHere && (
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors duration-700
                          ${
                            state.done
                              ? "bg-green-100 border-green-300 text-green-700"
                              : state.active
                                ? "bg-blue-100 border-blue-300 text-blue-700"
                                : "bg-slate-100 border-slate-200 text-slate-400"
                          }`}
                        style={
                          isAnimatingToHere
                            ? {
                                backgroundColor: `color-mix(in srgb, #dcfce7 ${destinationGreen * 100}%, #f1f5f9)`,
                                borderColor: `color-mix(in srgb, #86efac ${destinationGreen * 100}%, #e2e8f0)`,
                                color: `color-mix(in srgb, #15803d ${destinationGreen * 100}%, #94a3b8)`,
                              }
                            : {}
                        }
                      >
                        {isAnimatingToHere ? (
                          <span className="relative w-4 h-4">
                            <i
                              className="fa-solid fa-circle absolute inset-0 flex items-center justify-center text-xs"
                              style={{ opacity: 1 - destinationGreen }}
                            />
                            <i
                              className="fa-solid fa-check absolute inset-0 flex items-center justify-center text-xs"
                              style={{ opacity: destinationGreen }}
                            />
                          </span>
                        ) : (
                          <i
                            className={`fa-solid text-sm ${
                              state.done
                                ? "fa-check"
                                : state.active
                                  ? "fa-truck"
                                  : "fa-circle"
                            }`}
                          />
                        )}
                      </div>
                    )}

                    {isAnimatingFromHere && (
                      <div className="w-8 h-8 rounded-full bg-green-100 border border-green-300 flex items-center justify-center">
                        <i className="fa-solid fa-check text-green-700 text-sm" />
                      </div>
                    )}
                  </div>

                  {i < arr.length - 1 && (
                    <div className="relative w-px flex-1 min-h-[50px]">
                      <div className="absolute inset-0 bg-slate-200" />
                      {isAnimatingFromHere && (
                        <div
                          className="absolute top-0 left-0 w-full bg-green-300"
                          style={{ height: `${truckProgress * 100}%` }}
                        />
                      )}
                      {state.done && !isAnimatingFromHere && (
                        <div className="absolute inset-0 bg-green-300" />
                      )}
                      {isAnimatingFromHere && (
                        <div
                          className="absolute left-1/2 z-10"
                          style={{
                            top: `${truckProgress * 100}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white shadow-lg shadow-blue-300 flex items-center justify-center">
                            <i className="fa-solid fa-truck text-white text-xs" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex-1 pb-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3
                        className={`font-medium transition-colors duration-700
                          ${
                            state.active || isAnimatingFromHere
                              ? "text-blue-700"
                              : state.done
                                ? "text-slate-700"
                                : "text-slate-400"
                          }`}
                        style={
                          isAnimatingToHere
                            ? {
                                color: `color-mix(in srgb, #334155 ${destinationGreen * 100}%, #94a3b8)`,
                              }
                            : {}
                        }
                      >
                        {item.label}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {item.description}
                      </p>
                    </div>

                    {state.active &&
                      currentStatus !== "DELIVERED" &&
                      animatingIndex === null && (
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
          onUpdate={handleUpdate}
          shipmentId={deliveryMock.id}
        />
      )}
    </>
  );
};

export default DeliveryCheckpoints;
