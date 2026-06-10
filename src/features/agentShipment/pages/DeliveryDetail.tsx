import { useEffect, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../shared/hooks/reduxHooks";
import { getMyDeliveries } from "../agentSlice";

import DeliveryCheckpoints from "../components/deliveryDetails/DeliveryCheckpoints";
import DeliveryDetailHeader from "../components/deliveryDetails/DeliveryDetailHeader";
import ProofOfDelivery from "../components/deliveryDetails/ProofOfDelivery";
import ReceiverDetails from "../components/deliveryDetails/ReceiverDetails";
import ShipmentDetails from "../components/deliveryDetails/ShipmentDetails";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";

const DeliveryDetail = () => {
  const dispatch = useAppDispatch();
  const { deliveries, loading } = useAppSelector((state) => state.agent);
  const [otpVerified, setOtpVerified] = useState(false);
  const [switchingShipment, setSwitchingShipment] = useState(false);

  useEffect(() => {
    dispatch(getMyDeliveries());
  }, [dispatch]);

  const activeStatuses = [
    "OUT_FOR_PICKUP",
    "PICKED_UP",
    "IN_TRANSIT",
    "OUT_FOR_DELIVERY",
  ];

  const activeDelivery = deliveries.find((item) =>
    activeStatuses.includes(item.shipmentStatus),
  );

  const assignedDeliveries = deliveries
    .filter((item) => item.shipmentStatus === "ASSIGNED")
    .sort(
      (a, b) =>
        new Date(a.assignedDate).getTime() - new Date(b.assignedDate).getTime(),
    );
  const currentDate = new Date().toISOString().split("T")[0];
  const today = assignedDeliveries[0]?.assignedDate === currentDate
  // console.log("assignedDeliveries :", assignedDeliveries[0]?.assignedDate === currentDate);

  const data = (activeDelivery && today) || (assignedDeliveries[0] && today);

  const handleDelivered = () => {
    setSwitchingShipment(true);
    dispatch(getMyDeliveries());
    setTimeout(() => {
      setSwitchingShipment(false);
      setOtpVerified(false);
    }, 2000);
  };

  if (switchingShipment) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 bg-white rounded-2xl px-10 py-8 shadow-2xl">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
              <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fa-solid fa-truck text-indigo-400 text-lg" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-700">
                Loading next delivery
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Fetching your next assignment...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading && deliveries.length === 0) {
    return (
      <div className="h-[calc(100vh-72px)] overflow-y-auto rounded-lg bg-gradient-to-br from-sky-50 via-cyan-100 to-indigo-50 scrollbar-none">
        <LoadingSpinner />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-10 shadow-lg text-center">
          <h2 className="text-xl font-semibold text-slate-700">
            No Active Deliveries
          </h2>
          <p className="mt-2 text-slate-500">
            There are no deliveries available to start right now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br rounded-lg from-cyan-50 via-indigo-200 to-sky-50 text-white p-4 lg:p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <DeliveryDetailHeader data={data} />
        <div className="grid lg:grid-cols-2 gap-4">
          <ShipmentDetails data={data} />
          <ReceiverDetails data={data} />
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <DeliveryCheckpoints
            data={data}
            otpVerified={otpVerified}
            onDelivered={handleDelivered}
          />
          <ProofOfDelivery
            currentStatus={data.shipmentStatus}
            otpVerified={otpVerified}
            setOtpVerified={setOtpVerified}
          />
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetail;
