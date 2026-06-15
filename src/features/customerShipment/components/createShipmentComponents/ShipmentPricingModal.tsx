import { useEffect } from "react";
import type { WeightSlab } from "../../shipmentTypes";
import { useAppDispatch, useAppSelector } from "../../../../shared/hooks/reduxHooks";
import { fetchPricingRates } from "../../shipmentSlice";

interface ShipmentPricingModalProps {
  onClose: () => void;
}

const getWeightRangeLabel = (slabs: WeightSlab[], index: number) => {
  const prev = index === 0 ? 0 : slabs[index - 1].upTo;
  const current = slabs[index].upTo;
  return current === null ? `Above ${prev} kg` : `${prev} - ${current} kg`;
};

const ShipmentPricingModal = ({ onClose }: ShipmentPricingModalProps) => {
  const dispatch = useAppDispatch();
  const { rates, loading, error } = useAppSelector((state) => state.shipment);

  useEffect(() => {
    if (!rates) dispatch(fetchPricingRates());
  }, [dispatch, rates]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-black/10 p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-none">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-blue-500 to-sky-500 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Shipment Pricing
            </h2>
            <p className="text-sm text-sky-100 mt-1">
              How your shipment cost is calculated
            </p>
          </div>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-white/20 text-white transition hover:bg-blue-500"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {loading && (
            <p className="text-center text-sm text-slate-400 py-10">
              Loading pricing details...
            </p>
          )}

          {error && (
            <p className="text-center text-sm text-red-500 py-10">{error}</p>
          )}

          {rates && (
            <div className="space-y-6">
              {/* Platform fee */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 flex items-center justify-between">
                <p className="font-semibold text-slate-700">Platform Fee</p>
                <p className="font-bold text-slate-800">
                  ₹{rates.platformFee}
                </p>
              </div>

              {/* Weight slabs */}
              <div>
                <p className="font-semibold text-slate-700 mb-2">
                  Weight-based Charges
                </p>
                <div className="rounded-2xl border border-slate-100 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold">
                          Weight Range
                        </th>
                        <th className="px-4 py-2 text-right font-semibold">
                          Rate / kg
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rates.weightSlabs.map((slab, i) => (
                        <tr key={i} className="border-t border-slate-100">
                          <td className="px-4 py-2 text-slate-600">
                            {getWeightRangeLabel(rates.weightSlabs, i)}
                          </td>
                          <td className="px-4 py-2 text-right font-semibold text-slate-800">
                            ₹{slab.ratePerKg}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Priority multipliers */}
              <div>
                <p className="font-semibold text-slate-700 mb-2">
                  Delivery Priority
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(rates.priorityMultipliers).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center"
                      >
                        <p className="text-xs text-slate-400 uppercase tracking-wide">
                          {key.replace("_", " ")}
                        </p>
                        <p className="mt-1 font-bold text-slate-800">
                          {value}x
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Fragile + GST */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-sm text-slate-400">Fragile Surcharge</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    ₹{rates.fragileSurcharge}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-sm text-slate-400">GST</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {rates.gstPercent}%
                  </p>
                </div>
              </div>

              {/* How it's calculated */}
              {/* <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-700">
                <p className="font-semibold mb-1">How it's calculated</p>
                <p>
                  Base cost = Platform Fee + (Weight × Rate/kg) + Fragile
                  Surcharge (if applicable), then multiplied by the priority
                  multiplier, and GST added on top.
                </p>
              </div> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShipmentPricingModal;