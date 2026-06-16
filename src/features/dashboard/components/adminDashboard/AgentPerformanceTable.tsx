import type { AgentPerformanceTableProps } from "../../../adminShipment/adminTypes";
import { AVATAR_COLORS, getInitials } from "../../utils/AdminDashboardHelper";
import { GrDocumentPerformance } from "react-icons/gr";

const AgentPerformanceTable = ({
  agentPerformance,
}: AgentPerformanceTableProps) => {
  return (
    <div className="rounded-[14px] border border-sky-200/60 bg-white px-6 py-5 shadow-[0_2px_12px_rgba(6,182,212,0.08)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-sky-900">
            <GrDocumentPerformance />
          </span>

          <span className="text-[15px] font-bold text-sky-900">
            Agent Performance
          </span>
        </div>

        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
          This month
        </span>
      </div>

      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            {["AGENT", "TOTAL", "ACTIVE", "COMPLETED"].map((h) => (
              <th
                key={h}
                className={`pb-2.5 text-[11px] font-semibold tracking-[0.06em] text-slate-400 ${
                  h === "AGENT" ? "text-left" : "text-center"
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {agentPerformance.map((agent, i) => (
            <tr key={agent.agentId} className="border-t border-slate-100">
              <td className="py-2.5">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{
                      backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
                    }}
                  >
                    {getInitials(agent.agentName)}
                  </div>

                  <span className="font-semibold text-sky-900">
                    {agent.agentName}
                  </span>
                </div>
              </td>

              <td className="text-center font-medium text-slate-600">
                {agent.totalDeliveries}
              </td>

              <td className="text-center">
                <span className="rounded-md bg-yellow-100 px-2.5 py-0.5 text-xs font-bold text-yellow-700">
                  {agent.activeShipments}
                </span>
              </td>

              <td className="text-center">
                <span className="rounded-md bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">
                  {agent.completedShipments}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AgentPerformanceTable;
