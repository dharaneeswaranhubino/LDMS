import { useEffect, useState } from "react";
import { deliveryMock } from "../../utils/mockDelivery";
import { formatSlot, getStatusState, isWithinDeliverySlot, statusOrder } from "../../utils/statusHelpers";
import UpdateStatusModal from "./UpdateStatusModal";
import OtpVerificationModal from "./OtpVerificationModal";
import { useAppDispatch } from "../../../../shared/hooks/reduxHooks";
import { updateTrackStatus } from "../../agentSlice";
import { showToast } from "../../../../shared/components/Toast";
import type {
  DeliveryCheckpointsProps,
  ShipmentStatus,
} from "../../agentTypes";

interface UpdatedDeliveryCheckpointsProps extends DeliveryCheckpointsProps {
  onOtpVerified: (value: boolean) => void;
}

const DeliveryCheckpoints = ({
  data,
  otpVerified,
  onDelivered,
  onOtpVerified,
}: UpdatedDeliveryCheckpointsProps) => {
  const dispatch = useAppDispatch();

  const [currentStatus, setCurrentStatus] = useState<ShipmentStatus>(
    data.shipmentStatus,
  );
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
  const [truckProgress, setTruckProgress] = useState(0);

  useEffect(() => {
    setCurrentStatus(data.shipmentStatus);
  }, [data.shipmentId, data.shipmentStatus]);

  const displayStatus =
    animatingIndex !== null ? currentStatus : data.shipmentStatus;

  const currentIndex = statusOrder.indexOf(displayStatus);

  const canMarkDelivered = isWithinDeliverySlot(
    data.assignedSlotStart,
    data.assignedSlotEnd,
  );

  const handleUpdateClick = () => {
    // const nextStatus = statusOrder[currentIndex + 1] as ShipmentStatus;

    if (displayStatus === "OUT_FOR_DELIVERY") {
      if (!otpVerified) {
        setOpenOtpModal(true);
        return;
      }
      if (!canMarkDelivered) {
        showToast({
          type: "warning",
          message: `Delivery can only be marked between ${formatSlot(data.assignedSlotStart)} – ${formatSlot(data.assignedSlotEnd)}`,
        });
        return;
      }
      setOpenUpdateModal(true);
      return;
    }

    setOpenUpdateModal(true);
  };

  const handleUpdate = async (nextStatus: ShipmentStatus) => {
    let animationRef: ReturnType<typeof setInterval> | undefined;
    try {
      if (displayStatus === nextStatus) return;

      const idx = statusOrder.indexOf(displayStatus);
      setAnimatingIndex(idx);
      setTruckProgress(0);

      const animationDuration = 3000;
      const intervalTime = 30;
      const totalSteps = animationDuration / intervalTime;
      const progressStep = 1 / totalSteps;

      const animationPromise = new Promise<void>((resolve) => {
        animationRef = setInterval(() => {
          setTruckProgress((prev) => {
            const next = prev + progressStep;
            if (next >= 1) {
              clearInterval(animationRef);
              resolve();
              return 1;
            }
            return next;
          });
        }, intervalTime);
      });

      const apiPromise = dispatch(
        updateTrackStatus({
          id: String(data.shipmentId),
          data: { status: nextStatus },
        }),
      ).unwrap();

      await Promise.all([animationPromise, apiPromise]);

      setCurrentStatus(nextStatus);
      setAnimatingIndex(null);
      setTruckProgress(0);

      if (nextStatus === "DELIVERED") {
        onDelivered();
      }
    } catch (error) {
      console.error(error);
      clearInterval(animationRef!);
      setAnimatingIndex(null);
      setTruckProgress(0);
      showToast({ type: "error", message: "Failed to update status" });
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-indigo-200 bg-white p-5 shadow-lg h-full">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[13px] font-semibold text-slate-700">
            Delivery checkpoints
          </h2>
          <span className="rounded-full bg-sky-50 border border-sky-100 px-3 py-1 text-[11px] text-indigo-400">
            {currentIndex + 1} of {statusOrder.length} done
          </span>
        </div>

        <div className="flex flex-col">
          {deliveryMock.timeline.map((item, i, arr) => {
            const state = getStatusState(displayStatus, item.key);
            const isAnimatingFromHere = animatingIndex === i;
            const isAnimatingToHere = animatingIndex === i - 1;
            const isLast = i === arr.length - 1;

            const destinationGreen = isAnimatingToHere
              ? Math.min(Math.max((truckProgress - 0.7) / 0.3, 0), 1)
              : 0;

            const dotBase =
              "w-[30px] h-[30px] rounded-full flex items-center justify-center text-[13px] flex-shrink-0 transition-colors duration-700";

            let dotStyle = "";
            let dotIcon = "fa-solid fa-circle text-[10px]";

            if (isAnimatingFromHere) {
              dotStyle = "bg-green-100 border border-green-300 text-green-700";
              dotIcon = "fa-solid fa-check";
            } else if (isAnimatingToHere) {
              dotStyle = "";
            } else if (state.done) {
              dotStyle = "bg-green-100 border border-green-300 text-green-700";
              dotIcon = "fa-solid fa-check";
            } else if (state.active) {
              dotStyle = "bg-blue-100 border border-blue-300 text-blue-700";
              dotIcon = "fa-solid fa-truck";
            } else {
              dotStyle = "bg-slate-100 border border-slate-200 text-slate-400";
            }

            const lineColor =
              state.done && !isAnimatingFromHere ? "#86efac" : "#e2e8f0";

            const showUpdateBtn =
              state.active &&
              item.key !== "DELIVERED" &&
              animatingIndex === null;

            const showDeliveredBtn =
              item.key === "DELIVERED" &&
              displayStatus === "OUT_FOR_DELIVERY" &&
              otpVerified &&
              animatingIndex === null;

            return (
              <div key={item.key} className="flex gap-3 items-stretch">
                <div
                  className="flex flex-col items-center"
                  style={{ width: 30 }}
                >
                  {isAnimatingToHere ? (
                    <div
                      className={dotBase}
                      style={{
                        backgroundColor: `color-mix(in srgb, #dcfce7 ${destinationGreen * 100}%, #f1f5f9)`,
                        borderColor: `color-mix(in srgb, #86efac ${destinationGreen * 100}%, #e2e8f0)`,
                        color: `color-mix(in srgb, #15803d ${destinationGreen * 100}%, #94a3b8)`,
                        border: "1px solid",
                      }}
                    >
                      <span className="relative w-4 h-4">
                        <i
                          className="fa-solid fa-circle absolute inset-0 flex items-center justify-center text-[10px]"
                          style={{ opacity: 1 - destinationGreen }}
                        />
                        <i
                          className="fa-solid fa-check absolute inset-0 flex items-center justify-center text-[10px]"
                          style={{ opacity: destinationGreen }}
                        />
                      </span>
                    </div>
                  ) : (
                    <div className={`${dotBase} ${dotStyle}`}>
                      <i className={dotIcon} />
                    </div>
                  )}

                  {!isLast && (
                    <div
                      className="relative flex-1 min-h-[50px]"
                      style={{ width: 2 }}
                    >
                      <div
                        className="absolute inset-0 transition-colors duration-700"
                        style={{ background: lineColor }}
                      />
                      {isAnimatingFromHere && (
                        <>
                          <div
                            className="absolute top-0 left-0 w-full bg-green-300"
                            style={{ height: `${truckProgress * 100}%` }}
                          />
                          <div
                            className="absolute left-1/2 z-10"
                            style={{
                              top: `${truckProgress * 100}%`,
                              transform: "translate(-50%, -50%)",
                            }}
                          >
                            <div className="w-7 h-7 rounded-full bg-blue-500 border-2 border-white shadow-lg shadow-blue-300 flex items-center justify-center">
                              <i className="fa-solid fa-truck text-white text-[10px]" />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex-1 pb-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3
                        className="text-[12px] font-medium transition-colors duration-700"
                        style={
                          isAnimatingToHere
                            ? {
                                color: `color-mix(in srgb, #334155 ${destinationGreen * 100}%, #94a3b8)`,
                              }
                            : {}
                        }
                      >
                        <span
                          className={
                            state.active || isAnimatingFromHere
                              ? "text-blue-700"
                              : state.done
                                ? "text-slate-700"
                                : "text-slate-400"
                          }
                        >
                          {item.label}
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {item.description}
                      </p>

                      {state.done && !isAnimatingFromHere && (
                        <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full">
                          <i className="fa-solid fa-circle-check text-[9px]" />
                          Completed
                        </span>
                      )}
                      {(state.active || isAnimatingFromHere) && (
                        <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full">
                          <i className="fa-solid fa-spinner animate-spin text-[9px]" />
                          In progress
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      {(state.done || state.active) && !isAnimatingFromHere && (
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {state.active
                            ? `${formatSlot(data.assignedSlotStart)}`
                            : "—"}
                        </span>
                      )}

                      {showUpdateBtn && (
                        <button
                          onClick={handleUpdateClick}
                          className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          Update
                        </button>
                      )}

                      {showDeliveredBtn && (
                        <button
                          onClick={() => {
                            if (!canMarkDelivered) {
                              showToast({
                                type: "warning",
                                message: `Delivery can only be marked between ${formatSlot(data.assignedSlotStart)} – ${formatSlot(data.assignedSlotEnd)}`,
                              });
                              return;
                            }
                            setOpenUpdateModal(true);
                          }}
                          className="rounded-lg border border-green-200 bg-green-50 px-3 py-1 text-[11px] font-medium text-green-700 hover:bg-green-100 transition-colors"
                        >
                          Mark Delivered
                        </button>
                      )}

                      {item.key === "DELIVERED" &&
                        !state.done &&
                        !state.active &&
                        displayStatus !== "OUT_FOR_DELIVERY" && (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                            <i className="fa-solid fa-lock text-[9px]" />
                            {formatSlot(data.assignedSlotStart)} –{" "}
                            {formatSlot(data.assignedSlotEnd)}
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {openUpdateModal && (
        <UpdateStatusModal
          onClose={() => setOpenUpdateModal(false)}
          currentStatus={displayStatus}
          onUpdate={handleUpdate}
          shipmentId={data.shipmentId}
          assignedSlotStart={data.assignedSlotStart}
          assignedSlotEnd={data.assignedSlotEnd}
        />
      )}

      {openOtpModal && (
        <OtpVerificationModal
          onClose={() => setOpenOtpModal(false)}
          onVerified={() => {
            onOtpVerified(true);
            setOpenOtpModal(false);
            if (!canMarkDelivered) {
              showToast({
                type: "warning",
                message: `OTP verified! Delivery can be marked between ${formatSlot(data.assignedSlotStart)} – ${formatSlot(data.assignedSlotEnd)}`,
              });
              return;
            }
            setOpenUpdateModal(true);
          }}
        />
      )}
    </>
  );
};

export default DeliveryCheckpoints;
