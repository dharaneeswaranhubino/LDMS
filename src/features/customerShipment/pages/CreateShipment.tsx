import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { PiReadCvLogoLight } from "react-icons/pi";
import PackageDetails from "../components/createShipmentComponents/PackageDetails";
import PriceBreakdown from "../components/createShipmentComponents/PriceBreakdown";
import ShipmentAddress from "../components/createShipmentComponents/ShipmentAddress";
import DeliveryInstruc from "../components/createShipmentComponents/DeliveryInstruc";
import { useAppDispatch } from "../../../shared/hooks/reduxHooks";
import { createShipment, updateShipment } from "../shipmentSlice";
import type {
  Address,
  CreatedShipmentMeta,
  PackageDetailsFormData,
} from "../shipmentTypes";

const CreateShipment = () => {
  const dispatch = useAppDispatch();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isInstruc, setIsInstruc] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Holds the result after createShipment succeeds
  const [createdMeta, setCreatedMeta] = useState<CreatedShipmentMeta | null>(
    null,
  );

  const [pickUpAddress, setPickUpAddress] = useState<Address>({
    name: "",
    phone: "",
    fullAddress: "",
    city: "",
    pinCode: "",
  });

  const [deliveryAddress, setDeliveryAddress] = useState<Address>({
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
    animate: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  const goNext = () => {
    setDirection(1);
    setStep((p) => p + 1);
  };
  const goPrev = () => {
    setDirection(-1);
    setStep((p) => p - 1);
  };

  // const handlePackageNext = async () => {
  //   try {
  //     setIsCreating(true);
  //     const result = await dispatch(
  //       createShipment({
  //         pickUpAddress,
  //         deliveryAddress,
  //         packageDetails,
  //         // amount: 0,
  //       })
  //     ).unwrap();

  //     setCreatedMeta({
  //       shipmentId: result.shipmentId,
  //       trackingId: result.trackingId,
  //       priceBreakdown: result.priceBreakdown!,
  //       packageWeight: result.packageWeight,
  //       priority: result.shipmentPriority,
  //     });

  //     goNext();
  //   } catch (err) {
  //     toast.error(typeof err === "string" ? err : "Failed to create shipment");
  //   } finally {
  //     setIsCreating(false);
  //   }
  // };

  const handlePackageNext = async () => {
    try {
      setIsCreating(true);

      const payload = { pickUpAddress, deliveryAddress, packageDetails };

      let result;

      if (createdMeta) {
        // Shipment already exists — PATCH with updated data
        result = await dispatch(
          updateShipment({
            shipmentId: createdMeta.shipmentId,
            data: payload,
          }),
        ).unwrap();
      } else {
        // Fresh — POST
        result = await dispatch(createShipment(payload)).unwrap();
      }

      setCreatedMeta({
        shipmentId: result.shipmentId,
        trackingId: result.trackingId,
        priceBreakdown: result.priceBreakdown!,
        packageWeight: result.packageWeight,
        priority: result.shipmentPriority,
      });

      goNext();
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to save shipment");
    } finally {
      setIsCreating(false);
    }
  };

  const onReset = () => {
    setStep(1);
    setDirection(1);
    setCreatedMeta(null);
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
      priority: "STANDARD",
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
            className="cursor-pointer flex text-sky-900 items-center gap-1 p-2 bg-gradient-to-br from-slate-100 to-sky-100 rounded-lg border border-sky-200 hover:from-sky-100 hover:to-slate-100"
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
                nextStep={goNext}
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
                onNext={handlePackageNext}
                prevStep={goPrev}
                isCreating={isCreating}
                isEditing={!!createdMeta}
                packageDetails={packageDetails}
                setPackageDetails={setPackageDetails}
              />
            </motion.div>
          )}

          {step === 3 && createdMeta && (
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
                prevStep={goPrev}
                shipmentId={createdMeta.shipmentId}
                trackingId={createdMeta.trackingId}
                priceBreakdown={createdMeta.priceBreakdown}
                packageWeight={createdMeta.packageWeight}
                priority={createdMeta.priority}
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
