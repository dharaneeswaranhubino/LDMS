import type { ShipmentDetailsProps } from "../../agentTypes";
import InfoBlock from "./InfoBlock";

const ShipmentDetails = ({ data }: ShipmentDetailsProps) => {
  return (
    <>
      <div className="rounded-2xl border border-indigo-200 bg-white p-4 shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div>
              <h2 className="font-semibold text-slate-500">Shipment details</h2>

              <div className="flex gap-2 mt-2">
                {data?.isFragile && (
                  <span className="rounded-full border border-yellow-300 bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-500">
                    Fragile
                  </span>
                )}

                <span className="rounded-full border border-purple-300 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-500">
                  {data?.shipmentPriority}
                </span>
              </div>
            </div>
          </div>

          <div className="flex lg:flex-col lg:text-right gap-2 items-center">
            <p className="text-sm text-slate-700">Tracking ID :</p>
            <p className="font-semibold text-slate-500">{data?.trackingId}</p>
          </div>
        </div>

        <div className="flex justify-between items-center my-3 py-1 px-4 rounded-lg border border-indigo-300 shadow-sm">
          <div className="text-slate-500">
            <p>Pickup</p>
            <p>{`${data?.pickupAddress}, ${data?.pickupCity}, ${data?.pickupPincode}`}</p>
          </div>
          <i className="fa-solid fa-arrow-right text-slate-500"></i>
          <div className="text-right text-slate-500">
            <p>Delivery</p>
            <p>{`${data?.deliveryAddress}, ${data?.deliveryCity}, ${data?.deliveryPincode}`}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-2">
          <InfoBlock label="Item" value={`${data?.itemName}`} />
          <InfoBlock label="Weight" value={`${data?.packageWeight} kg`} />
          <InfoBlock label="Payment" value={data?.amount} success />
          <InfoBlock label="PayStatus" value={data?.paymentStatus.toLocaleLowerCase()} />
        </div>

        <div className="mt-2 rounded-xl bg-indigo-100 py-2 px-4 text-sm text-indigo-400">
          <span className="font-medium text-indigo-500">description:</span>{" "}
          {data?.description}
        </div>
      </div>
    </>
  );
};

export default ShipmentDetails;
