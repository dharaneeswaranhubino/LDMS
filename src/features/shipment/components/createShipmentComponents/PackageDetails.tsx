import { useState, type Dispatch, type SetStateAction } from "react";
import { validatePackageDetails } from "./shipmentValidation";
import type { PackageDetails } from "../../shipmentTypes";

interface PackageDetailsProps {
  nextStep: () => void;
  prevStep: () => void;
  packageDetails: PackageDetails;
  setPackageDetails: Dispatch<SetStateAction<PackageDetails>>;
}

const deliveryPriority = [
  {
    label: "Standard",
    multiplier: "1 × rate",
    days:"Take's 3 to 5 days",
    value: "STANDARD" as const,
  },
  {
    label: "Express",
    multiplier: "1.3 × rate",
    days:"Take's maximum within 3 days",
    value: "EXPRESS" as const,
  },
  {
    label: "Same Day",
    multiplier: "1.8 × rate",
    days:"Take's 1 day",
    value: "SAME_DAY" as const,
  },
];

const PackageDetails = ({
  nextStep,
  prevStep,
  packageDetails,
  setPackageDetails,
}: PackageDetailsProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPackageDetails({
      ...packageDetails,
      [name]: value,
    });

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleNext = () => {
    const validationErrors = validatePackageDetails(packageDetails);

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
        {/* TITLE */}
        <p className="text-[18px] font-semibold text-slate-800 flex items-center gap-2">
          <i className="fa-solid fa-cube text-blue-500"></i>
          Package details
        </p>

        <div className="flex flex-col gap-2 mt-5">
          <label className="text-[13px] font-medium text-slate-700">
            Item Name
            <i className="fa-solid fa-asterisk ml-1 text-red-700 text-[10px] font-semibold"></i>
          </label>

          <input
            type="text"
            placeholder="Item Name"
            value={packageDetails.itemName}
            name="itemName"
            onChange={handleChange}
            className="border border-slate-300 rounded-lg h-10 px-3 text-[14px] outline-none focus:border-blue-500"
          />
          {errors.itemName && (
            <p className="text-red-500 text-xs">{errors.itemName}</p>
          )}
        </div>
        {/* QUANTITY */}
        <div className="flex flex-col gap-2 mt-5">
          <label className="text-[13px] font-medium text-slate-700">
            Total Quantity
            <i className="fa-solid fa-asterisk ml-1 text-red-700 text-[10px] font-semibold"></i>
          </label>

          <input
            type="text"
            placeholder="Quantity"
            value={packageDetails.quantity}
            name="quantity"
            onChange={handleChange}
            className="border border-slate-300 rounded-lg h-10 px-3 text-[14px] outline-none focus:border-blue-500"
          />
          {errors.quantity && (
            <p className="text-red-500 text-xs">{errors.quantity}</p>
          )}
        </div>

        {/* WEIGHT */}
        <div className="flex flex-col gap-2 mt-4">
          <label className="text-[13px] font-medium text-slate-700">
            Total Weight (KG)
            <i className="fa-solid fa-asterisk ml-1 text-red-700 text-[10px] font-semibold"></i>
          </label>

          <input
            type="text"
            placeholder="Weight in kilograms"
            value={packageDetails.weight}
            name="weight"
            onChange={handleChange}
            className="border border-slate-300 rounded-lg h-10 px-3 text-[14px] outline-none focus:border-blue-500"
          />
          {errors.weight && (
            <p className="text-red-500 text-xs">{errors.weight}</p>
          )}
        </div>

        {/* DESCRIPTION */}
        <div className="flex flex-col gap-2 mt-4">
          <label className="text-[13px] font-medium text-slate-700">
            Description
            <span className="ml-2 px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-semibold">
              Optional
            </span>
          </label>

          <input
            type="text"
            placeholder="Electronics, clothes"
            value={packageDetails.description}
            name="description"
            onChange={handleChange}
            className="border border-slate-300 rounded-lg h-10 px-3 text-[14px] outline-none focus:border-blue-500"
          />
        </div>

        <hr className="mt-6 border-slate-200" />

        {/* PRIORITY */}
        <div className="flex flex-col gap-3 mt-6">
          <p className="text-[15px] font-semibold text-slate-800 flex items-center gap-2">
            <i className="fa-regular fa-flag text-blue-500"></i>
            Shipment Priority
            <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-semibold">
              Optional
            </span>
          </p>

          <div className="grid grid-cols-3 gap-3 mt-2">
            {deliveryPriority.map(({ label, multiplier, days, value }) => (
              <div
                key={value}
                onClick={() =>
                  setPackageDetails({
                    ...packageDetails,
                    priority: value,
                  })
                }
                className={`border rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all
                  ${
                    packageDetails.priority === value
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                  }`}
              >
                <p className="text-[14px] font-semibold text-slate-800">
                  {label}
                </p>

                <p className="text-[12px] text-slate-500 mt-1">{multiplier}</p>
                <p className="text-[12px] text-slate-500 mt-1">{days}</p>
              </div>
            ))}
          </div>
        </div>

        <hr className="mt-6 border-slate-200" />

        {/* FRAGILE */}
        <div className="flex flex-col gap-3 mt-6">
          <p className="text-[15px] font-semibold text-slate-800 flex items-center gap-2">
            <i className="fa-solid fa-triangle-exclamation text-amber-500"></i>
            Fragile package
            <i className="fa-solid fa-asterisk ml-1 text-red-700 text-[10px] font-semibold"></i>
          </p>

          <div className="flex justify-between items-center bg-slate-100 p-3 rounded-lg">
            <p className="text-[14px] text-slate-700">+₹50 handling charge</p>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={packageDetails.fragile}
                onChange={() =>
                  setPackageDetails({
                    ...packageDetails,
                    fragile: !packageDetails.fragile,
                  })
                }
              />
              <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-blue-500 transition-colors duration-300"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
            </label>
          </div>
          {/* {errors.fragile && (
            <p className="text-red-500 text-xs">{errors.fragile}</p>
          )} */}
        </div>

        <hr className="mt-6 border-slate-200" />

        {/* DELIVERY TIME */}
        <div className="flex flex-col gap-3 mt-6">
          <p className="text-[15px] font-semibold text-slate-800 flex items-center gap-2">
            <i className="fa-regular fa-clock text-blue-500"></i>
            Preferred delivery time
            <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-semibold">
              Optional
            </span>
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-slate-700">
                FROM
              </label>

              <input
                type="datetime-local"
                value={packageDetails.deliveryFrom}
                onChange={(e) =>
                  setPackageDetails({
                    ...packageDetails,
                    deliveryFrom: e.target.value,
                  })
                }
                className="border border-slate-300 rounded-lg h-10 px-3 text-[14px] outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-slate-700">
                TO
              </label>

              <input
                type="datetime-local"
                value={packageDetails.deliveryTo}
                onChange={(e) =>
                  setPackageDetails({
                    ...packageDetails,
                    deliveryTo: e.target.value,
                  })
                }
                className="border border-slate-300 rounded-lg h-10 px-3 text-[14px] outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <p className="text-[12px] text-slate-500">
            Admin will try to match this preference when assigning a slot
          </p>
        </div>

        {/* BUTTONS */}
        <div className="w-full flex justify-between mt-8">
          <button
            type="button"
            onClick={prevStep}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 px-4 rounded-lg transition-all"
          >
            <i className="fa-solid fa-angle-left mr-2"></i>
            Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all"
          >
            Next
            <i className="fa-solid fa-angle-right ml-2"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PackageDetails;
