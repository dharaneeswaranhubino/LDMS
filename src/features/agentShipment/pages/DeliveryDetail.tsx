import DeliveryCheckpoints from "../components/deliveryDetails/DeliveryCheckpoints";
import DeliveryDetailHeader from "../components/deliveryDetails/DeliveryDetailHeader";
import ProofOfDelivery from "../components/deliveryDetails/ProofOfDelivery";
import ReceiverDetails from "../components/deliveryDetails/ReceiverDetails";
import ShipmentDetails from "../components/deliveryDetails/ShipmentDetails";

const DeliveryDetail = () => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-indigo-200 to-sky-50 text-white p-4 lg:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <DeliveryDetailHeader />

          {/* Shipment Details Full Width */}
          {/* <ShipmentDetails /> */}

          {/* Main Content */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            {/* Left Side */}
            {/* <DeliveryCheckpoints /> */}

            {/* Right Side */}
            {/* <div className="space-y-6">
              <ReceiverDetails />
              <ProofOfDelivery />
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default DeliveryDetail;
