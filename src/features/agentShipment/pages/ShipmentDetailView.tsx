import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../shared/hooks/reduxHooks";
import { getMyDeliveries } from "../agentSlice";
import ShipmentDetails from "../components/deliveryDetails/ShipmentDetails";
import ReceiverDetails from "../components/deliveryDetails/ReceiverDetails";
import DeliveryCheckpoints from "../components/deliveryDetails/DeliveryCheckpoints";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";
import { STATUS_BADGE, formatSlot } from "../utils/statusHelpers";

type TabKey = "details" | "checkpoints" | "receiver";

const TABS: { key: TabKey; label: string }[] = [
  { key: "details", label: "Details" },
  { key: "checkpoints", label: "Checkpoints" },
  { key: "receiver", label: "Receiver" },
];

const ShipmentDetailView = () => {
  const { shipmentId } = useParams<{ shipmentId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { deliveries, loading } = useAppSelector((state) => state.agent);

  const [activeTab, setActiveTab] = useState<TabKey>("details");
  const [otpVerified, setOtpVerified] = useState(false);

  useEffect(() => {
    if (deliveries.length === 0) {
      dispatch(getMyDeliveries());
    }
  }, [dispatch, deliveries.length]);

  const delivery = useMemo(
    () => deliveries.find((d) => d.shipmentId === Number(shipmentId)) ?? null,
    [deliveries, shipmentId],
  );

  const handleDelivered = () => {
    dispatch(getMyDeliveries());
    navigate("/deliveryDetail");
  };

  if (loading && deliveries.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-4">
        <p className="text-slate-400 text-sm">Shipment not found</p>
        <button
          onClick={() => navigate("/deliveryDetail")}
          className="text-indigo-500 text-sm font-medium"
        >
          Back to shipments
        </button>
      </div>
    );
  }

  const badge = STATUS_BADGE[delivery.shipmentStatus] ?? STATUS_BADGE.PENDING;

  return (
    <div className="rounded-2xl min-h-screen bg-gradient-to-br from-cyan-50 via-indigo-200 to-sky-50 p-4">

      <button
        onClick={() => navigate("/deliveryDetail")}
        className="flex items-center gap-2 text-sm text-slate-500 mb-3"
      >
        <i className="fa-solid fa-arrow-left text-xs" />
        Back to shipments  
      </button>

      <div className="rounded-2xl border border-indigo-100 bg-white px-4 py-3 shadow-sm mb-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h1 className="text-[13px] font-semibold font-mono text-slate-700 truncate">
            {delivery.trackingId}
          </h1>
          <span
            className="text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
            style={{ background: badge.bg, color: badge.color }}
          >
            {badge.label}
          </span>
        </div>

        <p className="mt-1.5 text-[13px] text-slate-500 flex items-center gap-1.5 flex-wrap">
          <span className="font-medium text-slate-600">{delivery.receiverName}</span>
          <i className="fa-solid fa-arrow-right text-[10px] text-slate-400" />
          <span className="truncate">{delivery.deliveryAddress}, {delivery.deliveryCity}</span>
        </p>

        <div className="flex items-center justify-between mt-2.5">
          <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <i className="fa-regular fa-clock" />
            {formatSlot(delivery.assignedSlotStart)} – {formatSlot(delivery.assignedSlotEnd)}
          </span>

          <button className="flex h-8 items-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-600 px-3 text-[11px] font-medium text-white shadow-sm">
            <i className="fa-brands fa-rocketchat" />
            Chat with customer
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 text-[12px] font-medium py-2 rounded-xl border transition-colors ${
              activeTab === tab.key
                ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                : "bg-white border-slate-200 text-slate-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "details" && <ShipmentDetails data={delivery} />}

      {activeTab === "checkpoints" && (
        <DeliveryCheckpoints
          key={delivery.shipmentId}
          data={delivery}
          otpVerified={otpVerified}
          onDelivered={handleDelivered}
          onOtpVerified={setOtpVerified}
        />
      )}

      {activeTab === "receiver" && <ReceiverDetails data={delivery} />}
    </div>
  );
};

export default ShipmentDetailView;