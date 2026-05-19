import InfoBlock from "./InfoBlock";

const ShipmentDetails = () => {
  return (
    <>
      <div className="rounded-2xl border border-indigo-200 bg-white p-4 shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div>
              <h2 className="font-semibold text-slate-500">Shipment details</h2>

              <div className="flex gap-2 mt-2">
                <span className="rounded-full border border-yellow-300 bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-500">
                  Fragile
                </span>

                <span className="rounded-full border border-purple-300 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-500">
                  Same day
                </span>
              </div>
            </div>
          </div>

          <div className="text-right gap-2 items-center">
            <p className="text-sm text-slate-700">Tracking ID :</p>
            <p className="font-semibold text-slate-500">TRK-001-XYZ</p>
          </div>
        </div>

        <div className="flex justify-between items-center my-3 py-1 px-4 rounded-lg border border-indigo-300 shadow-sm">
          <div className="text-slate-500">
            <p>Pickup</p>
            <p>No. 12, MG Road Bangalore – 560001</p>
          </div>
          <i className="fa-solid fa-arrow-right text-slate-500"></i>
          <div className="text-right text-slate-500">
            <p>Delivery</p>
            <p>No. 45, Indiranagar Bangalore – 560038</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <InfoBlock label="Item" value="Laptop" />
          <InfoBlock label="Weight" value="2.5 kg" />
          <InfoBlock label="Payment" value="Paid — ₹620" success />
          <InfoBlock label="Type" value="Electronic" />
        </div>

        <div className="mt-2 rounded-xl bg-indigo-100 py-2 px-4 text-sm text-indigo-400">
          <span className="font-medium text-indigo-500">
            Special instruction:
          </span>{" "}
          Call before arriving. Handle with care.
        </div>
      </div>
    </>
  );
};

export default ShipmentDetails;
