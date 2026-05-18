import { Eye } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const agentsData = [
  {
    id: "#AGT-001",
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    status: "Busy",
    workload: 5,
    maxWorkload: 8,
    deliveries: 245,
    joined: "01 Jan 2025",
    initials: "RK",
  },
  {
    id: "#AGT-002",
    name: "Meera Singh",
    phone: "+91 87654 32109",
    status: "Available",
    workload: 2,
    maxWorkload: 8,
    deliveries: 189,
    joined: "05 Jan 2025",
    initials: "MS",
  },
  {
    id: "#AGT-003",
    name: "Suresh P",
    phone: "+91 76543 21098",
    status: "Available",
    workload: 1,
    maxWorkload: 8,
    deliveries: 312,
    joined: "10 Jan 2025",
    initials: "SP",
  },
  {
    id: "#AGT-004",
    name: "Arjun K",
    phone: "+91 65432 10987",
    status: "Busy",
    workload: 7,
    maxWorkload: 8,
    deliveries: 98,
    joined: "15 Jan 2025",
    initials: "AK",
  },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Available":
      return "bg-lime-100 text-lime-700 border border-lime-200";

    case "Busy":
      return "bg-orange-100 text-orange-700 border border-orange-200";

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

  const [statusFilter, setStatusFilter] = useState("");

  const filteredAgents = agentsData.filter((agent) => {
    if (!statusFilter) return true;

    return agent.status === statusFilter;
  });

  const sendShipment = () => {
    navigate("/agentRegisteration");
  };

  return (
    <div className="rounded-lg h-[calc(100vh-72px)] overflow-y-auto bg-gradient-to-br from-sky-50 via-cyan-100 to-indigo-50 p-5 scrollbar-none">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800">
            Agent Management
          </h1>
          <p className="mt-1 text-[14px] text-slate-500">
            Manage all delivery agents — create, monitor workload and status
          </p>
        </div>

        <button
          onClick={sendShipment}
          className="flex h-[44px] items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-600 px-5 text-[13px] font-medium text-white shadow-md transition-all hover:from-sky-600 hover:to-cyan-500"
        >
          <i className="fa-solid fa-plus text-[11px]"></i>
          Add New Agent
        </button>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[32px] font-bold text-slate-800">
                {agentsData.length}
              </h2>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Total Agents
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100">
              <i className="fa-solid fa-users text-lg text-sky-600"></i>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-lime-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[32px] font-bold text-slate-800">
                {
                  agentsData.filter((agent) => agent.status === "Available")
                    .length
                }
              </h2>

              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Available
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-100">
              <i className="fa-solid fa-user-check text-lg text-lime-600"></i>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[32px] font-bold text-slate-800">
                {agentsData.filter((agent) => agent.status === "Busy").length}
              </h2>

              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Busy Today
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">
              <i className="fa-solid fa-clock text-lg text-orange-600"></i>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[32px] font-bold text-slate-800">0</h2>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Inactive
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <i className="fa-solid fa-user-slash text-lg text-slate-500"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <div className="flex h-11 w-full items-center justify-start rounded-xl border border-cyan-100 bg-white text-slate-500 shadow-sm px-2">
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-200 bg-white rounded-xl h-10 px-3 text-[13px] text-slate-600
            outline-none focus:border-indigo-400 shadow-sm cursor-pointer transition-all duration-300 w-44 flex-shrink-0"
        >
          <option value="">All Status</option>
          <option value="Available">Available</option>
          <option value="Busy">Busy</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="mt-5 rounded-3xl border border-cyan-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[420px] scrollbar-none">
          <table className="w-full border-collapse min-w-[800px]">
            <thead className="bg-sky-50 sticky top-0 z-10">
              <tr className="text-[13px] uppercase tracking-wide text-slate-500">
                <th className="px-6 py-5 text-left font-semibold w-[220px]">
                  Agent
                </th>
                <th className="px-6 py-5 text-left font-semibold w-[160px]">
                  Phone
                </th>
                <th className="px-6 py-5 text-left font-semibold w-[120px]">
                  Status
                </th>
                <th className="px-6 py-5 text-left font-semibold w-[180px]">
                  Today's Workload
                </th>
                <th className="px-6 py-5 text-left font-semibold w-[150px]">
                  Total Deliveries
                </th>
                <th className="px-6 py-5 text-left font-semibold w-[130px]">
                  Joined
                </th>
                <th className="px-6 py-5 text-left font-semibold w-[110px]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredAgents.map((agent, index) => (
                <tr
                  key={index}
                  className="border-t border-sky-100 transition hover:bg-sky-50/70"
                >
                  <td className="px-4 py-4 w-[220px]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-cyan-100 text-sm font-bold text-sky-700 shrink-0">
                        {agent.initials}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {agent.name}
                        </h3>
                        <p className="text-sm text-slate-400 whitespace-nowrap">
                          {agent.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 w-[160px] font-medium text-slate-700 whitespace-nowrap">
                    {agent.phone}
                  </td>
                  <td className="px-6 py-5 w-[120px]">
                    <span
                      className={`rounded-full px-4 py-1 text-sm font-semibold ${getStatusStyle(agent.status)}`}
                    >
                      {agent.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 w-[180px]">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={`h-full rounded-full ${getProgressColor(agent.workload)}`}
                          style={{
                            width: `${(agent.workload / agent.maxWorkload) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-600">
                        {agent.workload}/{agent.maxWorkload}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 w-[150px] font-semibold text-slate-800">
                    {agent.deliveries}
                  </td>
                  <td className="px-6 py-5 w-[130px] text-slate-500 whitespace-nowrap">
                    {agent.joined}
                  </td>
                  <td className="px-6 py-5 w-[110px]">
                    <button className="flex items-center gap-2 rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-sky-50">
                      <Eye size={16} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAgents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sky-100">
                <i className="fa-solid fa-users text-3xl text-sky-500"></i>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-700">
                No Agents Found
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Try changing the filter option
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentManagement;
