import InfoBlock from "./InfoBlock";
import LocationCard from "./LocationCard";

const ShipmentDetails = () => {
  return (
    <>
      <div className="rounded-3xl border border-zinc-800 bg-[#151515] p-6 shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">Shipment details</h2>

              <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-300">
                Fragile
              </span>

              <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
                Same day
              </span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-zinc-500">Tracking ID</p>
            <p className="font-semibold text-green-400">TRK-001-XYZ</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <LocationCard
            title="Pickup from"
            address="No.12, MG Road"
            city="Bangalore - 560001"
          />

          <LocationCard
            title="Deliver to"
            address="No.45, Indiranagar"
            city="Bangalore - 560038"
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-4">
          <InfoBlock label="Item" value="Laptop" />
          <InfoBlock label="Weight" value="2.5 kg" />
          <InfoBlock label="Payment" value="Paid — ₹620" success />
          <InfoBlock label="Type" value="Electronic" />
        </div>

        <div className="mt-6 rounded-2xl border border-zinc-700 bg-zinc-900/50 p-4 text-sm text-zinc-300">
          <span className="font-medium text-white">Special instruction:</span>{" "}
          Call before arriving. Handle with care.
        </div>
      </div>
    </>
  );
};

export default ShipmentDetails;
