import DeliveryCheckpoints from "../components/deliveryDetails/DeliveryCheckpoints";
import DeliveryDetailHeader from "../components/deliveryDetails/DeliveryDetailHeader";
import ProofOfDelivery from "../components/deliveryDetails/ProofOfDelivery";
import ReceiverDetails from "../components/deliveryDetails/ReceiverDetails";
import ShipmentDetails from "../components/deliveryDetails/ShipmentDetails";

const DeliveryDetail = () => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br rounded-lg from-cyan-50 via-indigo-200 to-sky-50 text-white p-4 lg:p-6">
        <div className="mx-auto max-w-7xl space-y-4">
          <DeliveryDetailHeader />
          <div className="grid lg:grid-cols-2 gap-4">
            <ShipmentDetails />
            <ReceiverDetails />
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <DeliveryCheckpoints />
            <ProofOfDelivery />
          </div>
        </div>
      </div>
    </>
  );
};

export default DeliveryDetail;
