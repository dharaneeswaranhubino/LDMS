import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../shared/hooks/reduxHooks";
import { getMyDeliveries } from "../agentSlice";
import DeliveryCheckpoints from "../components/deliveryDetails/DeliveryCheckpoints";
import DeliveryDetailHeader from "../components/deliveryDetails/DeliveryDetailHeader";
import ReceiverDetails from "../components/deliveryDetails/ReceiverDetails";
import ShipmentDetails from "../components/deliveryDetails/ShipmentDetails";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";
import type { DeliveryItem } from "../agentTypes";
import MobileShipmentCard from "../components/deliveryDetails/MobileShipmentCard";
import { STATUS_BADGE } from "../utils/statusHelpers";

const getTodayIST = (): string =>
  new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

const formatSlot = (time: string) => {
  if (!time) return "";
  const [h, m] = time.split(":");
  const d = new Date();
  d.setHours(Number(h), Number(m));
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

interface ShipmentCardProps {
  item: DeliveryItem;
  isSelected: boolean;
  onClick: () => void;
}

const ShipmentCard = ({ item, isSelected, onClick }: ShipmentCardProps) => {
  const badge = STATUS_BADGE[item.shipmentStatus] ?? STATUS_BADGE.PENDING;
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl p-3 border transition-all duration-200 ${
        isSelected
          ? "bg-blue-50 border-blue-300 shadow-sm"
          : "bg-white border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/40"
      }`}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p
          className={`text-[11px] font-semibold font-mono truncate max-w-[110px] ${
            isSelected ? "text-blue-600" : "text-slate-700"
          }`}
        >
          {item.trackingId}
        </p>
        <span
          className="text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
          style={{ background: badge.bg, color: badge.color }}
        >
          {badge.label}
        </span>
      </div>
      <p
        className={`text-xs font-medium mt-1.5 truncate ${
          isSelected ? "text-blue-700" : "text-slate-600"
        }`}
      >
        {item.receiverName}
      </p>
      <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
        <i className="fa-regular fa-clock text-[10px]" />
        {formatSlot(item.assignedSlotStart)} –{" "}
        {formatSlot(item.assignedSlotEnd)}
      </p>
    </button>
  );
};

const NoDeliveries = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="rounded-2xl border border-slate-200 bg-white px-8 py-10 shadow-lg text-center max-w-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
        <i className="fa-solid fa-box-open text-3xl text-slate-400" />
      </div>
      <h2 className="text-lg font-semibold text-slate-700">
        No Deliveries Today
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        You have no shipments assigned for today.
      </p>
    </div>
  </div>
);

const DeliveryDetail = () => {
  const dispatch = useAppDispatch();
  // const navigate = useNavigate();
  const location = useLocation();
  const { deliveries, loading } = useAppSelector((state) => state.agent);

  const preSelectedId =
    (location.state as { shipmentId?: number } | null)?.shipmentId ?? null;

  const todaysDeliveries = useMemo(() => {
    const today = getTodayIST();
    return deliveries.filter((d) => d.assignedDate === today);
  }, [deliveries]);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [lastSyncKey, setLastSyncKey] = useState<string | null>(null);
  const syncKey = `${preSelectedId ?? "none"}|${todaysDeliveries
    .map((d) => d.shipmentId)
    .join(",")}`;

  if (todaysDeliveries.length > 0 && syncKey !== lastSyncKey) {
    setLastSyncKey(syncKey);

    const validPreSelected =
      preSelectedId &&
      todaysDeliveries.some((d) => d.shipmentId === preSelectedId);

    setSelectedId(
      validPreSelected ? preSelectedId : todaysDeliveries[0].shipmentId,
    );
  }

  const [otpVerifiedMap, setOtpVerifiedMap] = useState<Record<number, boolean>>(
    {},
  );

  const setOtpVerified = (shipmentId: number, value: boolean) => {
    setOtpVerifiedMap((prev) => ({ ...prev, [shipmentId]: value }));
  };

  useEffect(() => {
    dispatch(getMyDeliveries());
  }, [dispatch]);

  const [switchingShipment, setSwitchingShipment] = useState(false);

  const handleDelivered = () => {
    setSwitchingShipment(true);
    dispatch(getMyDeliveries());
    setTimeout(() => {
      setSwitchingShipment(false);
    }, 1800);
  };

  const selectedDelivery = useMemo(
    () => todaysDeliveries.find((d) => d.shipmentId === selectedId) ?? null,
    [todaysDeliveries, selectedId],
  );

  if (loading && deliveries.length === 0) {
    return (
      <div className="h-[calc(100vh-72px)] overflow-y-auto rounded-lg bg-gradient-to-br from-sky-50 via-cyan-100 to-indigo-50 scrollbar-none">
        <LoadingSpinner />
      </div>
    );
  }

  if (switchingShipment) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4 bg-white rounded-2xl px-10 py-8 shadow-2xl">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
            <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <i className="fa-solid fa-truck text-indigo-400 text-lg" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-700">
              Loading next delivery
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Fetching your next assignment...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (todaysDeliveries.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br rounded-lg from-cyan-50 via-indigo-200 to-sky-50 p-4 lg:p-6">
        <NoDeliveries />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br rounded-lg from-cyan-50 via-indigo-200 to-sky-50 p-4 lg:p-6">
      <div className="lg:hidden flex flex-col gap-3">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest px-1">
          Today's shipments
        </p>
        <div className="flex flex-col gap-3">
          {todaysDeliveries.map((item) => (
            <MobileShipmentCard key={item.shipmentId} item={item} />
          ))}
        </div>
      </div>

      <div className="hidden lg:flex gap-4 items-start">
        <div className="w-[200px] flex-shrink-0 flex flex-col gap-3">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest px-1">
            Today's shipments
          </p>

          <div className="flex flex-col gap-2 overflow-y-auto max-h-122 scrollbar-none">
            {todaysDeliveries.map((item) => (
              <ShipmentCard
                key={item.shipmentId}
                item={item}
                isSelected={item.shipmentId === selectedId}
                onClick={() => setSelectedId(item.shipmentId)}
              />
            ))}
          </div>

          <div className="flex flex-col gap-1.5 px-1 pt-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
              <span className="text-[11px] text-slate-400">
                Selected / active
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-300 flex-shrink-0" />
              <span className="text-[11px] text-slate-400">
                Assigned, not started
              </span>
            </div>
          </div>
        </div>

        {selectedDelivery ? (
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            <DeliveryDetailHeader
              data={selectedDelivery}
              currentStatus={selectedDelivery.shipmentStatus}
            />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
              <div className="flex flex-col gap-4">
                <ShipmentDetails data={selectedDelivery} />
                <ReceiverDetails data={selectedDelivery} />
              </div>

              <DeliveryCheckpoints
                key={selectedDelivery.shipmentId}
                data={selectedDelivery}
                otpVerified={
                  otpVerifiedMap[selectedDelivery.shipmentId] ?? false
                }
                onDelivered={handleDelivered}
                onOtpVerified={(val) =>
                  setOtpVerified(selectedDelivery.shipmentId, val)
                }
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-slate-400 text-sm">
              Select a shipment to view details
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryDetail;
