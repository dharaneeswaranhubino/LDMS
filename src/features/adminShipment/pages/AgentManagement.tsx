import { Eye } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../shared/hooks/reduxHooks";
import { getAllAgents } from "../adminSlice";
import type { DeliveryAgent } from "../adminTypes";
import AgentDetailsModal from "../components/agentManagement/AgentDetailsModal";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";

const getStatusStyle = (status: string) => {
  switch (status) {
    case "AVAILABLE":
      return "bg-lime-100 text-lime-700 border border-lime-200";
    case "UNAVAILABLE":
      return "bg-red-100 text-red-700 border border-red-200";
    default:
      return "bg-slate-100 text-slate-600 border border-slate-200";
  }
};

const getProgressColor = (value: number) => {
  if (value >= 6) return "bg-red-400";
  if (value >= 4) return "bg-sky-400";
  return "bg-lime-400";
};

const AgentManagement = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { agents, loading } = useAppSelector((state) => state.admin);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<DeliveryAgent | null>(
    null,
  );

  useEffect(() => {
    dispatch(getAllAgents());
  }, [dispatch]);

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchesStatus =
        !statusFilter || agent.availabilityStatus === statusFilter;

      const matchesSearch =
        !searchQuery ||
        agent.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(agent.agentId).includes(searchQuery);
      return matchesStatus && matchesSearch;
    });
  }, [agents, statusFilter, searchQuery]);

  const sendShipment = () => {
    navigate("/agentRegisteration");
  };

  const totalAgents = agents.length;
  const availableAgents = agents.filter(
    (a) => a.availabilityStatus === "AVAILABLE",
  ).length;

  const unavailableAgents = agents.filter(
    (a) => a.availabilityStatus === "UNAVAILABLE",
  ).length;

  if (loading) {
    return (
      <div className="h-[calc(100vh-72px)] overflow-y-auto rounded-lg bg-gradient-to-br from-sky-50 via-cyan-100 to-indigo-50 scrollbar-none">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="rounded-lg h-[calc(100vh-72px)] overflow-y-auto bg-gradient-to-br from-sky-50 via-cyan-100 to-indigo-50 p-5 scrollbar-none">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800">
            Agent Management
          </h1>

          <p className="mt-1 text-[14px] text-slate-500">
            Manage all delivery agents
          </p>
        </div>

        <button
          onClick={sendShipment}
          className="flex h-[44px] w-full md:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-600 px-5 text-[13px] font-medium text-white shadow-md"
        >
          <i className="fa-solid fa-plus text-[11px]"></i>
          Add New Agent
        </button>
      </div>

      <div className="mt-6 gap-4 flex flex-wrap">
        <div className="bg-white w-50 border-l-6 border-slate-300 rounded-2xl py-3 px-4 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">
              {totalAgents}
            </h2>

            <p className="text-[11px] text-slate-400 uppercase tracking-wide mt-1">
              Total Agents
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100">
            <i className="fa-solid fa-users text-lg text-sky-600"></i>
          </div>
        </div>

        <div className="bg-white w-50 border-l-6 border-slate-300 rounded-2xl py-3 px-4 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">
              {availableAgents}
            </h2>

            <p className="text-[11px] text-slate-400 uppercase tracking-wide mt-1">
              Available
            </p>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-100">
            <i className="fa-solid fa-user-check text-lg text-lime-600"></i>
          </div>
        </div>

        <div className="bg-white w-50 border-l-6 border-slate-300 rounded-2xl py-3 px-4 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">
              {unavailableAgents}
            </h2>

            <p className="text-[11px] text-slate-400 uppercase tracking-wide mt-1">
              Unavailable
            </p>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">
            <i className="fa-solid fa-user-slash text-lg text-red-500"></i>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row gap-2">
        <div className="flex items-center gap-2 border bg-white rounded-xl h-10 px-3 shadow-sm flex-1 w-full">
          <i className="fa-solid fa-magnifying-glass text-slate-400 text-[14px]" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by agent name"
            className="bg-transparent outline-none text-[13px] h-10 text-slate-700 placeholder-slate-400 w-full"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-200 bg-white rounded-xl h-10 px-3 text-[13px] text-slate-600 outline-none shadow-sm w-full sm:w-44"
        >
          <option value="">All Status</option>
          <option value="AVAILABLE">Available</option>
          <option value="UNAVAILABLE">Unavailable</option>
        </select>
      </div>

      <div className="mt-5 rounded-3xl border border-cyan-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[420px] overflow-y-auto scrollbar-none">
          <table className="w-full border-collapse min-w-[1000px]">
            <thead className="bg-sky-50 sticky top-0 z-10">
              <tr className="text-[13px] uppercase tracking-wide text-slate-500">
                <th className="px-3 md:px-6 py-4 md:py-5 text-left font-semibold">Agent</th>
                <th className="px-3 md:px-6 py-4 md:py-5 text-left font-semibold">Phone</th>
                <th className="px-3 md:px-6 py-4 md:py-5 text-left font-semibold">Status</th>
                <th className="px-3 md:px-6 py-4 md:py-5 text-left font-semibold">
                  Today's Workload
                </th>

                <th className="px-3 md:px-6 py-4 md:py-5 text-left font-semibold">
                  Total Deliveries
                </th>

                <th className="px-3 md:px-6 py-4 md:py-5 text-left font-semibold">Joined</th>

                <th className="px-3 md:px-6 py-4 md:py-5 text-left font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAgents.map((agent) => (
                <tr
                  key={agent.id}
                  className="border-t border-sky-100 hover:bg-sky-50/70"
                >
                  <td className="px-3 md:px-6 py-4 md:py-5">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-cyan-100 text-sm font-bold text-sky-700">
                        {agent.agentName
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>

                      <div>
                        <h3 className="font-semibold text-sm md:text-base text-slate-800">
                          {agent.agentName}
                        </h3>

                        <p className="text-xs md:text-sm text-slate-400">
                          #AGT-{agent.agentId}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 font-medium text-slate-700">
                    {agent.phoneNumber}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-4 py-1 text-sm font-semibold ${getStatusStyle(
                        agent.availabilityStatus,
                      )}`}
                    >
                      {agent.availabilityStatus}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={`h-full rounded-full ${getProgressColor(
                            agent.shipmentCount ?? 0,
                          )}`}
                          style={{
                            width: `${((agent.shipmentCount ?? 0) / 8) * 100}%`,
                          }}
                        />
                      </div>

                      <span className="text-sm font-medium text-slate-600">
                        {agent.shipmentCount ?? "N/A"}/8
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-5 font-semibold text-slate-800">
                    {agent.totalDeliveries ?? "N/A"}
                  </td>

                  <td className="px-6 py-5 text-slate-500">
                    {new Date(agent.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-5">
                    <button
                      onClick={() => setSelectedAgent(agent)}
                      className="flex items-center gap-2 rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-sky-50"
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && filteredAgents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <h2 className="text-lg font-semibold text-slate-700">
                No Agents Found
              </h2>
            </div>
          )}
        </div>
      </div>

      {selectedAgent && (
        <AgentDetailsModal
          setSelectedAgent={setSelectedAgent}
          selectedAgent={selectedAgent}
        />
      )}
    </div>
  );
};

export default AgentManagement;
