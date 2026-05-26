import {
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import { validateShipmentAddress } from "./shipmentValidation";

interface Address {
  name: string;
  phone: string;
  fullAddress: string;
  city: string;
  pinCode: string;
}

interface ShipmentAddressProps {
  nextStep: () => void;
  pickUpAddress: Address;
  setPickUpAddress: Dispatch<SetStateAction<Address>>;
  deliveryAddress: Address;
  setDeliveryAddress: Dispatch<SetStateAction<Address>>;
}

const ShipmentAddress = ({
  nextStep,
  pickUpAddress,
  setPickUpAddress,
  deliveryAddress,
  setDeliveryAddress,
}: ShipmentAddressProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePickUpAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPickUpAddress({
      ...pickUpAddress,
      [name]: value,
    });

    const errorKeyMap: Record<string, string> = {
      name: "pickUpName",
      phone: "pickUpPhone",
      fullAddress: "pickUpFullAddress",
      city: "pickUpCity",
      pinCode: "pickUpPinCode",
    };
    setErrors((prev) => ({
      ...prev,
      [errorKeyMap[name]]: "",
    }));
  };

  const handleDeliveryAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setDeliveryAddress({
      ...deliveryAddress,
      [name]: value,
    });

    const errorKeyMap: Record<string, string> = {
      name: "deliveryName",
      phone: "deliveryPhone",
      fullAddress: "deliveryFullAddress",
      city: "deliveryCity",
      pinCode: "deliveryPinCode",
    };
    setErrors((prev) => ({
      ...prev,
      [errorKeyMap[name]]: "",
    }));
  };

  const swapHandleClick = () => {
    setPickUpAddress(deliveryAddress);
    setDeliveryAddress(pickUpAddress);
  };

  const handleNext = () => {
    const validationErrors = validateShipmentAddress(
      pickUpAddress,
      deliveryAddress,
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    nextStep();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 mt-4 shadow-sm">
      <form>
        <p className="text-[18px] font-semibold text-slate-800 flex items-center gap-2">
          <i className="fa-solid fa-location-dot text-blue-500"></i>
          Pickup address
        </p>

        <div className="grid lg:grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-slate-700">
              Sender Name
              <i className="fa-solid fa-asterisk ml-1 text-red-700 text-[10px] font-semibold"></i>
            </label>

            <input
              type="text"
              placeholder="Your Name"
              value={pickUpAddress.name}
              name="name"
              onChange={handlePickUpAddressChange}
              className="border border-slate-300 rounded-lg h-10 px-3 text-[14px] outline-none focus:border-blue-500"
            />
            {errors.pickUpName && (
              <p className="text-red-500 text-xs">{errors.pickUpName}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-slate-700">
              Sender Phone
              <i className="fa-solid fa-asterisk ml-1 text-red-700 text-[10px] font-semibold"></i>
            </label>

            <input
              type="text"
              placeholder="Your Phone No"
              value={pickUpAddress.phone}
              name="phone"
              maxLength={10}
              onChange={handlePickUpAddressChange}
              className="border border-slate-300 rounded-lg h-10 px-3 text-[14px] outline-none focus:border-blue-500"
            />
            {errors.pickUpPhone && (
              <p className="text-red-500 text-xs">{errors.pickUpPhone}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-5">
          <label className="text-[13px] font-medium text-slate-700">
            Full address
            <i className="fa-solid fa-asterisk ml-1 text-red-700 text-[10px] font-semibold"></i>
          </label>

          <input
            type="text"
            placeholder="No.12, xyz road, City - xxxxpin"
            value={pickUpAddress.fullAddress}
            name="fullAddress"
            onChange={handlePickUpAddressChange}
            className="border border-slate-300 rounded-lg h-10 px-3 text-[14px] outline-none focus:border-blue-500"
          />
          {errors.pickUpFullAddress && (
            <p className="text-red-500 text-xs">{errors.pickUpFullAddress}</p>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-slate-700">
              City
              <i className="fa-solid fa-asterisk ml-1 text-red-700 text-[10px] font-semibold"></i>
            </label>

            <input
              type="text"
              placeholder="City"
              value={pickUpAddress.city}
              name="city"
              onChange={handlePickUpAddressChange}
              className="border border-slate-300 rounded-lg h-10 px-3 text-[14px] outline-none focus:border-blue-500"
            />
            {errors.pickUpCity && (
              <p className="text-red-500 text-xs">{errors.pickUpCity}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-slate-700">
              Pin code
              <i className="fa-solid fa-asterisk ml-1 text-red-700 text-[10px] font-semibold"></i>
            </label>

            <input
              type="text"
              placeholder="Pin code"
              value={pickUpAddress.pinCode}
              name="pinCode"
              maxLength={6}
              onChange={handlePickUpAddressChange}
              className="border border-slate-300 rounded-lg h-10 px-3 text-[14px] outline-none focus:border-blue-500"
            />
            {errors.pickUpPinCode && (
              <p className="text-red-500 text-xs">{errors.pickUpPinCode}</p>
            )}
          </div>
        </div>

        <div className="w-full flex justify-center mt-6">
          <button
            type="button"
            onClick={swapHandleClick}
            className="bg-blue-500 hover:bg-blue-600 text-white text-[13px] font-medium py-2 px-4 rounded-lg transition-all"
          >
            Swap pickup and delivery
          </button>
        </div>

        <p className="text-[18px] font-semibold text-slate-800 flex items-center gap-2 mt-8">
          <i className="fa-regular fa-map text-blue-500"></i>
          Delivery address
        </p>

        <div className="grid lg:grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-slate-700">
              Receiver Name
              <i className="fa-solid fa-asterisk ml-1 text-red-700 text-[10px] font-semibold"></i>
            </label>

            <input
              type="text"
              placeholder="Receiver Name"
              value={deliveryAddress.name}
              name="name"
              onChange={handleDeliveryAddressChange}
              className="border border-slate-300 rounded-lg h-10 px-3 text-[14px] outline-none focus:border-blue-500"
            />
            {errors.deliveryName && (
              <p className="text-red-500 text-xs">{errors.deliveryName}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-slate-700">
              Receiver Phone
              <i className="fa-solid fa-asterisk ml-1 text-red-700 text-[10px] font-semibold"></i>
            </label>

            <input
              type="text"
              placeholder="Receiver Phone No"
              value={deliveryAddress.phone}
              name="phone"
              maxLength={10}
              onChange={handleDeliveryAddressChange}
              className="border border-slate-300 rounded-lg h-10 px-3 text-[14px] outline-none focus:border-blue-500"
            />
            {errors.deliveryPhone && (
              <p className="text-red-500 text-xs">{errors.deliveryPhone}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-5">
          <label className="text-[13px] font-medium text-slate-700">
            Full address
            <i className="fa-solid fa-asterisk ml-1 text-red-700 text-[10px] font-semibold"></i>
          </label>

          <input
            type="text"
            placeholder="No.12, xyz road, City - xxxxpin"
            value={deliveryAddress.fullAddress}
            name="fullAddress"
            onChange={handleDeliveryAddressChange}
            className="border border-slate-300 rounded-lg h-10 px-3 text-[14px] outline-none focus:border-blue-500"
          />
          {errors.deliveryFullAddress && (
            <p className="text-red-500 text-xs">{errors.deliveryFullAddress}</p>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-slate-700">
              City
              <i className="fa-solid fa-asterisk ml-1 text-red-700 text-[10px] font-semibold"></i>
            </label>

            <input
              type="text"
              placeholder="City"
              value={deliveryAddress.city}
              name="city"
              onChange={handleDeliveryAddressChange}
              className="border border-slate-300 rounded-lg h-10 px-3 text-[14px] outline-none focus:border-blue-500"
            />
            {errors.deliveryCity && (
              <p className="text-red-500 text-xs">{errors.deliveryCity}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-slate-700">
              Pin code
              <i className="fa-solid fa-asterisk ml-1 text-red-700 text-[10px] font-semibold"></i>
            </label>

            <input
              type="text"
              placeholder="Pin code"
              value={deliveryAddress.pinCode}
              name="pinCode"
              maxLength={6}
              onChange={handleDeliveryAddressChange}
              className="border border-slate-300 rounded-lg h-10 px-3 text-[14px] outline-none focus:border-blue-500"
            />
            {errors.deliveryPinCode && (
              <p className="text-red-500 text-xs">{errors.deliveryPinCode}</p>
            )}
          </div>
        </div>

        <div className="w-full flex justify-end mt-8">
          <button
            type="button"
            onClick={handleNext}
            className="bg-blue-500 hover:bg-blue-600 text-white text-[13px] py-2 px-4 rounded-lg transition-all"
          >
            Next
            <i className="fa-solid fa-angle-right ml-2"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShipmentAddress;
