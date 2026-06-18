import { useNavigate } from "react-router-dom";

interface Props {
  activeShipments: number;
}

const ActiveShipments = ({ activeShipments }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-blue-200 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-truck text-blue-600 text-[15px]" />
          <span className="text-[13px] font-semibold text-slate-800">Active Shipments</span>
        </div>
        {activeShipments > 0 && (
          <span className="px-2 py-1 rounded-lg text-[10px] font-semibold border bg-blue-50 text-blue-700 border-blue-200">
            {activeShipments} in progress
          </span>
        )}
      </div>

      {activeShipments > 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-3">
            <i className="fa-solid fa-truck-fast text-blue-500 text-2xl" />
          </div>
          <p className="text-[22px] font-bold text-slate-800">{activeShipments}</p>
          <p className="text-[12px] text-slate-500 mt-1">
            {activeShipments === 1 ? "shipment" : "shipments"} currently active
          </p>

          <button
            onClick={() => navigate("/agent/deliveries")}
            className="mt-4 w-full py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[12px] font-medium hover:from-blue-600 hover:to-indigo-600 transition-all flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-arrow-right text-[11px]" />
            View active deliveries
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <i className="fa-solid fa-truck text-slate-200 text-3xl mb-3" />
          <p className="text-[12px] text-slate-500 font-medium">No active delivery right now</p>
          <p className="text-[11px] text-slate-400 mt-1">
            Your next delivery will appear here when started
          </p>
        </div>
      )}
    </div>
  );
};

export default ActiveShipments;