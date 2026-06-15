import { useState } from "react";
import type { AgentDetailsModalProps } from "../../adminTypes";
import { useAppDispatch } from "../../../../shared/hooks/reduxHooks";
import { toggleAgentActiveStatus } from "../../adminSlice";

const AgentDetailsModal = ({
  setSelectedAgent,
  selectedAgent,
}: AgentDetailsModalProps) => {
  const dispatch = useAppDispatch();

  const [showConfirmToggle, setShowConfirmToggle] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);

  const handleToggleStatus = async () => {
    setTogglingStatus(true);
    try {
      const result = await dispatch(
        toggleAgentActiveStatus(selectedAgent.id)
      ).unwrap();

      setSelectedAgent({ ...selectedAgent, isActive: result.isActive });
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingStatus(false);
      setShowConfirmToggle(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-black/10 p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-none">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-5 flex items-center justify-between">
          <div className="">
            <h2 className="text-2xl font-semibold text-white">Agent Details</h2>
            <p className="text-sm text-sky-100 mt-1">
              Complete delivery agent information
            </p>
          </div>

          <button
            onClick={() => setSelectedAgent(null)}
            className="h-10 w-10 rounded-full bg-white/20 text-white transition hover:bg-sky-500"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Top Profile */}
          <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
            <div className="flex h-18 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-cyan-100 text-2xl font-bold text-sky-700">
              {selectedAgent.agentName
                ?.split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)}
            </div>

            <div className="flex items-center justify-between w-full ">
              <div>
                <h2 className="text-2xl font-semibold text-slate-800">
                  {selectedAgent.agentName}
                </h2>
                <p className="text-slate-500">#AGT-{selectedAgent.agentId}</p>
              </div>

              <div>
                <div
                  className={`mt-2 inline-flex rounded-full px-4 py-1 text-sm font-semibold ${
                    selectedAgent.availabilityStatus === "AVAILABLE"
                      ? "bg-lime-100 text-lime-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {selectedAgent.availabilityStatus}
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm text-slate-400">Agent ID</p>
              <h3 className="mt-1 font-semibold text-slate-800">
                {selectedAgent.id}
              </h3>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm text-slate-400">Email Address</p>
              <h3 className="mt-1 font-semibold text-slate-800 break-all">
                {selectedAgent.agentEmail}
              </h3>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm text-slate-400">Phone Number</p>
              <h3 className="mt-1 font-semibold text-slate-800">
                {selectedAgent.phoneNumber}
              </h3>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm text-slate-400">Vehicle Type</p>
              <h3 className="mt-1 font-semibold text-slate-800">
                {selectedAgent.vehicleType || "N/A"}
              </h3>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm text-slate-400">Service Zone</p>
              <h3 className="mt-1 font-semibold text-slate-800">
                {selectedAgent.serviceZone || "N/A"}
              </h3>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active Status</p>
                <h3
                  className={`mt-1 font-semibold ${
                    selectedAgent.isActive ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {selectedAgent.isActive ? "Active" : "Inactive"}
                </h3>
              </div>

              <button
                onClick={() => setShowConfirmToggle(true)}
                disabled={togglingStatus}
                title={selectedAgent.isActive ? "Mark as Inactive" : "Mark as Active"}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  selectedAgent.isActive ? "bg-green-500" : "bg-slate-300"
                } ${togglingStatus ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    selectedAgent.isActive ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm text-slate-400">Shipment Count</p>
              <h3 className="mt-1 font-semibold text-slate-800">
                {selectedAgent.shipmentCount ?? "N/A"}
              </h3>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm text-slate-400">Total Deliveries</p>
              <h3 className="mt-1 font-semibold text-slate-800">
                {selectedAgent.deliveredCount ?? "N/A"}
              </h3>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm text-slate-400">Total Delayed</p>
              <h3 className="mt-1 font-semibold text-slate-800">
                {selectedAgent.delayedCount ?? "N/A"}
              </h3>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 md:col-span-2">
              <p className="text-sm text-slate-400">Joined Date</p>
              <h3 className="mt-1 font-semibold text-slate-800">
                {new Date(selectedAgent.createdAt).toLocaleString()}
              </h3>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setSelectedAgent(null)}
              className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {showConfirmToggle && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-800">
              Mark {selectedAgent.agentName} as{" "}
              {selectedAgent.isActive ? "Inactive" : "Active"}?
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {selectedAgent.isActive
                ? "This agent won't be eligible for new shipment assignments until reactivated."
                : "This agent will become eligible for new shipment assignments again."}
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmToggle(false)}
                disabled={togglingStatus}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                onClick={handleToggleStatus}
                disabled={togglingStatus}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
              >
                {togglingStatus ? "Updating..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentDetailsModal;