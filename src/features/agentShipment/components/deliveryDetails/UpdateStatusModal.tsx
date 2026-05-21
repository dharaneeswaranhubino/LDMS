import { motion, AnimatePresence } from "framer-motion";
import { statusOrder } from "../../utils/statusHelpers";
import { toast } from "react-toastify";
import notificationSound from "../../../../assets/universfield-new-notification-051-494246.mp3";
import { deliveryMock } from "../../utils/mockDelivery";
import { useAppDispatch, useAppSelector } from "../../../../shared/hooks/reduxHooks";

const UpdateStatusModal = ({ onClose, currentStatus, onUpdate }) => {
    const dispatch = useAppDispatch();
    const {updateTrackStatus} = useAppSelector((state)=>state.agent)
  const currentIndex = statusOrder.indexOf(currentStatus);
  const nextStatus = statusOrder[currentIndex + 1];
  const prevStatus = deliveryMock.timeline.find(
    (item) => item.key === currentStatus,
  );
  const newStatus = deliveryMock.timeline.find(
    (item) => item.key === nextStatus,
  );
  const handleUpdate = () => {
    // dispatch(updateTrackStatus())
    onUpdate(nextStatus);
    const audio = new Audio(notificationSound);
    audio.play();
    toast.success(`Status updated to ${newStatus?.label}`);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0,
          backdropFilter: "blur(0px)",
        }}
        animate={{
          opacity: 1,
          backdropFilter: "blur(6px)",
        }}
        exit={{
          opacity: 0,
          backdropFilter: "blur(0px)",
        }}
        transition={{
          duration: 0.2,
        }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      >
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.3,
            y: 120,
            rotateY: 25,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            rotateY: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.5,
            y: 80,
          }}
          transition={{
            type: "spring",
            stiffness: 180,
            damping: 12,
            mass: 0.7,
          }}
          className="w-full max-w-md rounded-3xl bg-white/90 backdrop-blur-xl p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-700">
              Update Delivery Status
            </h2>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-slate-400 transition hover:text-red-500"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </motion.button>
          </div>

          <div className="mt-6 rounded-2xl bg-indigo-50 p-4">
            <p className="text-sm text-slate-500">Current status</p>
            <h3 className="mt-1 font-semibold text-indigo-600">
              {prevStatus?.label}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              {prevStatus?.description}
            </p>
          </div>

          {nextStatus ? (
            <>
              <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4">
                <p className="text-sm text-slate-500">Next status</p>
                <h3 className="mt-1 font-semibold text-green-600">
                  {newStatus?.label}
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  {newStatus?.description}
                </p>
              </div>

              <motion.button
                whileHover={{
                  scale: 1.01,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={handleUpdate}
                className="mt-6 w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 py-3 font-semibold text-white shadow-lg "
              >
                Confirm Update
              </motion.button>
            </>
          ) : (
            <div className="mt-6 rounded-2xl bg-green-100 p-4 text-center text-green-700">
              Delivery already completed
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpdateStatusModal;
