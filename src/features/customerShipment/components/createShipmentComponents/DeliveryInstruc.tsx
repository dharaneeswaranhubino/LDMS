import type { Dispatch, SetStateAction } from "react";

interface props {
  setIsInstruc: Dispatch<SetStateAction<boolean>>;
}

const DeliveryInstruc = ({ setIsInstruc }:props) => {
  const onClose = () => {
    setIsInstruc(false);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-none rounded-3xl bg-white shadow-2xl border border-slate-200">
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-5 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Shipment Delivery Instructions
            </h2>
          </div>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all text-slate-600"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5 text-slate-700">
          <div>
            <h3 className="font-semibold text-slate-800 mb-2">
              Before Booking Your Shipment
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Ensure sender and receiver names are entered correctly.</li>
              <li>
                Provide active mobile numbers for both pickup and delivery
                contacts.
              </li>
              <li>
                Enter complete addresses including landmarks, street names, and
                area details.
              </li>
              <li>Verify the city and 6-digit PIN code before proceeding.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-800 mb-2">
              Package Information
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide an accurate item name and package description.</li>
              <li>Enter the correct quantity and package weight.</li>
              <li>
                Mark the package as <strong>Fragile</strong> if it contains
                glass, electronics, ceramics, or other breakable items.
              </li>
              <li>
                Improper weight or package details may result in delivery delays
                or additional charges.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-800 mb-2">
              Pickup Guidelines
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Keep the package packed and ready before the pickup agent
                arrives.
              </li>
              <li>
                Ensure someone is available at the pickup location during the
                selected time slot.
              </li>
              <li>
                The pickup agent may contact the sender for location
                confirmation.
              </li>
              <li>
                If the pickup attempt fails due to customer unavailability, a
                rescheduling process may be required.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-800 mb-2">
              Delivery Guidelines
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Ensure the receiver is available at the delivery address.</li>
              <li>
                Delivery partners may contact the receiver before or during
                delivery.
              </li>
              <li>
                Incorrect address details may lead to delivery delays or failed
                delivery attempts.
              </li>
              <li>
                Same Day and Express deliveries are subject to service
                availability and operational conditions.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-800 mb-2">
              Restricted & Prohibited Items
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Do not ship illegal, hazardous, flammable, or explosive
                materials.
              </li>
              <li>
                Weapons, narcotics, and prohibited substances are strictly
                forbidden.
              </li>
              <li>
                Packages containing restricted items may be rejected, returned,
                or reported to authorities.
              </li>
            </ul>
          </div>

          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
            <p className="text-sm text-blue-900">
              <strong>Important:</strong> By creating a shipment, you confirm
              that all package and address details provided are accurate and
              that the shipment complies with applicable transportation and
              safety regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInstruc;
