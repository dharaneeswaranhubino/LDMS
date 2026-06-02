import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PackageDetails from "../components/createShipmentComponents/PackageDetails";
import type { PackageDetailsFormData } from "../shipmentTypes";
import PriceBreakdown from "../components/createShipmentComponents/PriceBreakdown";
import ShipmentAddress from "../components/createShipmentComponents/ShipmentAddress";
import { PiReadCvLogoLight } from "react-icons/pi";
import DeliveryInstruc from "../components/createShipmentComponents/DeliveryInstruc";

const CreateShipment = () => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isInstruc, setIsInstruc] = useState(false);

  const [pickUpAddress, setPickUpAddress] = useState({
    name: "",
    phone: "",
    fullAddress: "",
    city: "",
    pinCode: "",
  });

  const [deliveryAddress, setDeliveryAddress] = useState({
    name: "",
    phone: "",
    fullAddress: "",
    city: "",
    pinCode: "",
  });

  const [packageDetails, setPackageDetails] = useState<PackageDetailsFormData>({
    itemName: "",
    quantity: "",
    weight: "",
    description: "",
    fragile: false,
    priority: "STANDARD",
    deliveryFrom: "",
    deliveryTo: "",
  });

  const pageVariants = {
    initial: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),

    animate: {
      x: 0,
      opacity: 1,
    },

    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  const nextStep = () => {
    setDirection(1);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => prev - 1);
  };

  const onReset = () => {
    setStep(1);
    setDirection(1);
    setPickUpAddress({
      name: "",
      phone: "",
      fullAddress: "",
      city: "",
      pinCode: "",
    });

    setDeliveryAddress({
      name: "",
      phone: "",
      fullAddress: "",
      city: "",
      pinCode: "",
    });

    setPackageDetails({
      itemName: "",
      quantity: "",
      weight: "",
      description: "",
      fragile: false,
      priority: "STANDARD" as const,
      deliveryFrom: "",
      deliveryTo: "",
    });
  };

  return (
    <>
      <div className="rounded-2xl min-h-screen bg-gradient-to-br from-slate-50 via-sky-200 to-purple-50 p-3 overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">
              Send new shipment
            </h1>

            <p className="text-[14px] text-slate-500 mt-1">
              Fill in details below to create your shipment
            </p>
          </div>
          <div
            onClick={() => setIsInstruc(true)}
            className=" flex text-sky-900 items-center gap-1 p-2 bg-gradient-to-br from-slate-100 to-sky-100 rounded-lg border border-sky-200 hover:from-sky-100 hover:to-slate-100"
          >
            <PiReadCvLogoLight size={18} />
            Instructions
          </div>
        </div>
        <AnimatePresence mode="wait" custom={direction}>
          {step === 1 && (
            <motion.div
              key="shipment"
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <ShipmentAddress
                nextStep={nextStep}
                pickUpAddress={pickUpAddress}
                setPickUpAddress={setPickUpAddress}
                deliveryAddress={deliveryAddress}
                setDeliveryAddress={setDeliveryAddress}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="package"
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <PackageDetails
                nextStep={nextStep}
                prevStep={prevStep}
                packageDetails={packageDetails}
                setPackageDetails={setPackageDetails}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="price"
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <PriceBreakdown
                prevStep={prevStep}
                packageDetails={packageDetails}
                pickUpAddress={pickUpAddress}
                deliveryAddress={deliveryAddress}
                onReset={onReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isInstruc && <DeliveryInstruc setIsInstruc={setIsInstruc} />}
    </>
  );
};

export default CreateShipment;
