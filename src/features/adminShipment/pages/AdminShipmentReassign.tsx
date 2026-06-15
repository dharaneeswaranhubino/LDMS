import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../shared/hooks/reduxHooks";
import {
  clearReassignState,
  fetchAllShipments,
  getAllAgents,
  reassignShipmentAgent,
} from "../adminSlice";
import type { AllShipments } from "../adminTypes";
import {
  avatarColor,
  formatSlot,
  getInitials,
  PRIORITY_LABEL,
  PRIORITY_STYLE,
  STATUS_LABEL,
  STATUS_STYLE,
} from "../utils/adminShipmentHelper";

const AdminShipmentReassign = () => {
  const { shipmentId } = useParams<{ shipmentId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    agents,
    allShipments,
    shipmentsLoading,
    reassignLoading,
    reassignSuccess,
    reassignResult,
    reassignError,
  } = useAppSelector((state) => state.admin);

  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);

  const stateShipment = (location.state as { shipment?: AllShipments } | null)
    ?.shipment;

  const shipment = useMemo(() => {
    if (stateShipment) return stateShipment;
    return (
      allShipments.find((s) => s.shipmentId === Number(shipmentId)) ?? null
    );
  }, [stateShipment, allShipments, shipmentId]);

  useEffect(() => {
    dispatch(getAllAgents());
    if (!stateShipment && allShipments.length === 0) {
      dispatch(fetchAllShipments({ page: 1, limit: 500 }));
    }
  }, [dispatch, stateShipment, allShipments.length]);

  useEffect(() => {
    return () => {
      dispatch(clearReassignState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (reassignSuccess) {
      const timer = setTimeout(() => {
        navigate("/allShipment");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [reassignSuccess, navigate]);

  const availableAgents = useMemo(() => {
    return agents.filter(
      (a) =>
        a.availabilityStatus === "AVAILABLE" &&
        a.isActive &&
        a.agentId !== shipment?.assignedAgent?.agentId,
    );
  }, [agents, shipment]);

  const handleReassign = () => {
    if (!selectedAgentId || !shipment) return;
    dispatch(
      reassignShipmentAgent({
        shipmentId: shipment.shipmentId,
        newAgentId: selectedAgentId,
      }),
    );
  };

  if (!shipment && shipmentsLoading) {
    return (
      <div className="rounded-2xl h-[calc(100vh-72px)] flex items-center justify-center bg-gradient-to-br from-sky-50 via-cyan-100 to-indigo-50">
        <div className="text-center text-slate-400">
          <i className="fa-solid fa-spinner fa-spin text-3xl mb-3 block text-indigo-400" />
          <p className="text-[13px]">Loading shipment…</p>
        </div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="rounded-2xl h-[calc(100vh-72px)] flex items-center justify-center bg-gradient-to-br from-sky-50 via-cyan-100 to-indigo-50">
        <div className="text-center text-slate-400">
          <i className="fa-solid fa-box-open text-4xl mb-3 block text-slate-300" />
          <p className="text-[13px] mb-4">Shipment not found</p>
          <button
            onClick={() => navigate("/allShipment")}
            className="px-4 py-2 rounded-xl border border-slate-200 text-[12px] text-slate-600 hover:bg-slate-50 transition-all"
          >
            Back to all shipments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl h-[calc(100vh-72px)] overflow-y-auto scrollbar-none bg-gradient-to-br from-sky-50 via-cyan-100 to-indigo-50 p-3 sm:p-4 lg:p-5">
      <button
        onClick={() => navigate("/allShipment")}
        className="flex items-center gap-2 text-[12px] text-slate-500 hover:text-indigo-600 transition-all mb-4"
      >
        <i className="fa-solid fa-arrow-left text-[11px]" />
        Back to all shipments
      </button>

      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">
          Reassign shipment
        </h1>
        <p className="font-mono text-[12px] text-slate-500 mt-1">
          {shipment.trackingId}
        </p>
      </div>

      {/* Shipment summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm mb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0 ${avatarColor(shipment.customer.name)}`}
            >
              {getInitials(shipment.customer.name)}
            </div>
            <div>
              <p className="text-[13px] font-medium text-slate-800">
                {shipment.customer.name}
              </p>
              <p className="text-[11px] text-slate-500">
                {shipment.customer.email}
              </p>
            </div>
          </div>
          <span
            className={`px-2 py-1 rounded-lg text-[10px] font-semibold border whitespace-nowrap ${PRIORITY_STYLE[shipment.shipmentPriority]}`}
          >
            {PRIORITY_LABEL[shipment.shipmentPriority]}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[13px] text-slate-700 mb-1">
          <span className="font-medium">{shipment.pickupCity}</span>
          <i className="fa-solid fa-arrow-right text-slate-300 text-[10px]" />
          <span className="font-medium">{shipment.deliveryCity}</span>
        </div>
        <p className="text-[11px] text-slate-400 mb-3">
          {shipment.packageWeight} kg · {shipment.itemName}
        </p>

        <div className="flex items-center gap-3 border-t border-slate-100 pt-3 text-[12px]">
          <span
            className={`px-2 py-1 rounded-lg text-[10px] font-semibold border flex items-center gap-1 ${STATUS_STYLE[shipment.shipmentStatus]}`}
          >
            {shipment.shipmentStatus === "DELAYED" && (
              <i className="fa-solid fa-triangle-exclamation text-[9px]" />
            )}
            {STATUS_LABEL[shipment.shipmentStatus]}
          </span>
          <span className="font-semibold text-slate-800">
            ₹{shipment.amount}
          </span>
          <span
            className={`text-[11px] ${
              shipment.paymentStatus === "PAID"
                ? "text-green-600"
                : shipment.paymentStatus === "FAILED"
                  ? "text-red-500"
                  : "text-sky-600"
            }`}
          >
            {shipment.paymentStatus}
          </span>
        </div>
      </div>

      {/* Current agent */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm mb-4">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Currently assigned
        </p>
        {shipment.assignedAgent ? (
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0 ${avatarColor(shipment.assignedAgent.name)}`}
            >
              {getInitials(shipment.assignedAgent.name)}
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-medium text-slate-800">
                {shipment.assignedAgent.name}
              </p>
              <p className="text-[11px] text-slate-500">
                {shipment.assignedAgent.email}
              </p>
              {shipment.assignedSlotStart && (
                <p className="text-[11px] text-slate-400 mt-0.5">
                  <i className="fa-regular fa-clock mr-1" />
                  {formatSlot(
                    shipment.assignedSlotStart,
                    shipment.assignedSlotEnd,
                    shipment.assignedDate,
                  )}
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-[12px] text-slate-400 italic">Not assigned yet</p>
        )}
      </div>

      {/* Reassign to */}
      <p className="text-[14px] font-semibold text-slate-800 mb-3">
        Reassign to
      </p>

      {availableAgents.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-[12px] text-slate-400 mb-4">
          No available agents right now
        </div>
      ) : (
        <div className="flex flex-col gap-2 mb-4">
          {availableAgents.map((agent) => {
            const isSelected = selectedAgentId === agent.id;
            return (
              <div
                key={agent.agentId}
                onClick={() => !reassignSuccess && setSelectedAgentId(agent.id)}
                className={`flex items-center gap-3 bg-white rounded-2xl p-3 sm:p-4 cursor-pointer transition-all border
                  ${
                    isSelected
                      ? "border-indigo-400 ring-2 ring-indigo-100"
                      : "border-slate-200 hover:border-indigo-300"
                  }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0 ${avatarColor(agent.agentName)}`}
                >
                  {getInitials(agent.agentName)}
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-slate-800">
                    {agent.agentName}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {agent.vehicleType} · {agent.serviceZone}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {agent.deliveredCount} delivered · {agent.delayedCount}{" "}
                    delayed
                  </p>
                </div>
                <span className="px-2 py-1 rounded-lg text-[10px] font-semibold border bg-green-50 text-green-700 border-green-200 whitespace-nowrap">
                  Available
                </span>
                {isSelected && (
                  <i className="fa-solid fa-circle-check text-indigo-500 text-[16px]" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Error */}
      {reassignError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-4 text-[12px] text-red-600 flex items-center gap-2">
          <i className="fa-solid fa-circle-exclamation text-[12px]" />
          {reassignError}
        </div>
      )}

      {/* Success */}
      {reassignSuccess && reassignResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <div className="w-full max-w-sm mx-4 bg-white border border-green-200 rounded-2xl p-5 shadow-xl">
            <p className="flex items-center gap-2 text-[14px] font-semibold text-green-700 mb-2">
              <i className="fa-solid fa-circle-check text-[16px]" />
              Shipment reassigned successfully
            </p>

            <p className="text-[12px] text-green-600 mb-3">
              New slot:{" "}
              {formatSlot(
                reassignResult.newSlot.startTime,
                reassignResult.newSlot.endTime,
                reassignResult.newSlot.date,
              )}
            </p>

            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <i className="fa-solid fa-spinner fa-spin" />
              Redirecting to all shipments...
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {!reassignSuccess && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button
            onClick={() => navigate("/allShipment")}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleReassign}
            disabled={!selectedAgentId || reassignLoading}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-[13px] font-medium hover:from-indigo-600 hover:to-blue-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {reassignLoading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin text-[12px]" />
                Reassigning…
              </>
            ) : (
              <>
                <i className="fa-solid fa-rotate-right text-[12px]" />
                Reassign now
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminShipmentReassign;
