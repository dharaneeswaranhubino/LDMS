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

const DeliveryDetail = () => {
  const dispatch = useAppDispatch();
  const { deliveries } = useAppSelector((state) => state.agent);
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
  const data = activeDelivery || assignedDeliveries[0];

  useEffect(() => {
    if (data?.shipmentStatus === "DELIVERED") {
      setSwitchingShipment(true);

      const timer = setTimeout(() => {
        setSwitchingShipment(false);
        setOtpVerified(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [data?.shipmentStatus]);

  if (switchingShipment) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-indigo-300 border-t-indigo-600"></div>

          <p className="text-lg font-semibold text-slate-600">
            Loading next assigned delivery...
          </p>
        </div>
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
    <>
      <div className="min-h-screen bg-gradient-to-br rounded-lg from-cyan-50 via-indigo-200 to-sky-50 text-white p-4 lg:p-6">
        <div className="mx-auto max-w-7xl space-y-4">
          <DeliveryDetailHeader data={data} />
          <div className="grid lg:grid-cols-2 gap-4">
            <ShipmentDetails data={data} />
            <ReceiverDetails data={data} />
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <DeliveryCheckpoints data={data} otpVerified={otpVerified} />

            <ProofOfDelivery
              currentStatus={data.shipmentStatus}
              otpVerified={otpVerified}
              setOtpVerified={setOtpVerified}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DeliveryDetail;
