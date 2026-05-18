import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { FilterTab, Shipment, SortKey } from "../adminTypes";
import { avatarColor, formatDate, getInitials, matchSearch, MOCK_AGENTS, MOCK_SHIPMENTS, PRIORITY_LABEL, PRIORITY_STYLE, STATUS_LABEL, STATUS_STYLE, TABS } from "../utils/adminShipmentHelper";

const AdminAllShipments = () => {
  const navigate = useNavigate();

  // When backend dev fixes API → replace MOCK_SHIPMENTS with Redux state
  const shipments = MOCK_SHIPMENTS;

  const [activeTab,    setActiveTab]    = useState<FilterTab>("ALL");
  const [searchQuery,  setSearchQuery]  = useState("");
  const [sortKey,      setSortKey]      = useState<SortKey>("newest");
  const [searchFocused, setSearchFocused] = useState(false);

  // Reassign modal state
  const [reassignModal, setReassignModal] = useState<Shipment | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<number | "">("");
  const [reassignLoading, setReassignLoading] = useState(false);

  // Complete modal state
  const [completeModal, setCompleteModal] = useState<Shipment | null>(null);
  const [completeLoading, setCompleteLoading] = useState(false);

  // ─── KPI counts ─────────────────────────────────────────────────────────────
  const kpi = useMemo(() => ({
    total:    shipments.length,
    active:   shipments.filter(s => ["CONFIRMED","PICKED_UP","IN_TRANSIT","OUT_FOR_DELIVERY"].includes(s.shipmentStatus)).length,
    delayed:  shipments.filter(s => s.shipmentStatus === "DELAYED").length,
    delivered:shipments.filter(s => ["DELIVERED","CANCELLED"].includes(s.shipmentStatus) === false && s.shipmentStatus === "DELIVERED").length,
    pending:  shipments.filter(s => s.shipmentStatus === "PENDING").length,
  }), [shipments]);

  // ─── Tab counts ──────────────────────────────────────────────────────────────
  const tabCounts = useMemo(() => {
    const c: Record<string, number> = { ALL: shipments.length };
    TABS.slice(1).forEach(({ key }) => {
      c[key] = shipments.filter(s => s.shipmentStatus === key).length;
    });
    return c;
  }, [shipments]);

  // ─── Filtered + sorted list ───────────────────────────────────────────────────
  const displayed = useMemo(() => {
    let list = [...shipments];
    if (activeTab !== "ALL") list = list.filter(s => s.shipmentStatus === activeTab);
    if (searchQuery.trim()) list = list.filter(s => matchSearch(s, searchQuery));
    list.sort((a, b) => {
      switch (sortKey) {
        case "newest":      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "amount_high": return b.amount - a.amount;
        case "amount_low":  return a.amount - b.amount;
        default:            return 0;
      }
    });
    return list;
  }, [shipments, activeTab, searchQuery, sortKey]);

  // ─── Action button logic ─────────────────────────────────────────────────────
  const renderAction = (s: Shipment) => {
    switch (s.shipmentStatus) {
      case "CONFIRMED":
        return (
          <button
            onClick={() => { setReassignModal(s); setSelectedAgentId(""); }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition-all whitespace-nowrap"
          >
            <i className="fa-solid fa-rotate-right text-[10px]" />
            Reassign
          </button>
        );
      case "DELAYED":
        return (
          <button
            onClick={() => { setReassignModal(s); setSelectedAgentId(""); }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-all whitespace-nowrap animate-pulse"
          >
            <i className="fa-solid fa-triangle-exclamation text-[10px]" />
            Reassign
          </button>
        );
      case "DELIVERED":
        return (
          <button
            onClick={() => setCompleteModal(s)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-all whitespace-nowrap"
          >
            <i className="fa-solid fa-circle-check text-[10px]" />
            Complete
          </button>
        );
      default:
        return (
          <button
            onClick={() => navigate(`/admin/shipments/${s.id}`)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-all whitespace-nowrap"
          >
            <i className="fa-solid fa-eye text-[10px]" />
            View
          </button>
        );
    }
  };

  // ─── Reassign submit ─────────────────────────────────────────────────────────
  const handleReassign = async () => {
    if (!selectedAgentId || !reassignModal) return;
    setReassignLoading(true);
    try {
      // TODO: replace with real API call
      // await api.patch(`/shipments/${reassignModal.id}/reassign`, { agentId: selectedAgentId });
      console.log("Reassign shipment", reassignModal.id, "to agent", selectedAgentId);
      await new Promise(r => setTimeout(r, 800)); // mock delay
      setReassignModal(null);
    } finally {
      setReassignLoading(false);
    }
  };

  // ─── Complete submit ─────────────────────────────────────────────────────────
  const handleComplete = async () => {
    if (!completeModal) return;
    setCompleteLoading(true);
    try {
      // TODO: replace with real API call
      // await api.patch(`/shipments/${completeModal.id}/complete`);
      console.log("Complete shipment", completeModal.id);
      await new Promise(r => setTimeout(r, 800)); // mock delay
      setCompleteModal(null);
    } finally {
      setCompleteLoading(false);
    }
  };
  
  return (
    <div className="rounded-lg h-[calc(100vh-72px)] overflow-y-auto scrollbar-none bg-gradient-to-br from-sky-50 via-cyan-100 to-indigo-50 p-5">

      {/* Page header */}
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-slate-800">All shipments</h1>
        <p className="text-[14px] text-slate-500 mt-1">
          Monitor and manage every shipment across all customers
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-5 gap-3 mb-5">
        {[
          { label: "Total",    val: kpi.total,    icon: "fa-boxes-stacked",  color: "text-slate-700",  bg: "bg-slate-100"  },
          { label: "Active",   val: kpi.active,   icon: "fa-truck-moving",   color: "text-blue-700",   bg: "bg-blue-50"    },
          { label: "Delayed",  val: kpi.delayed,  icon: "fa-triangle-exclamation", color: "text-orange-700", bg: "bg-orange-50" },
          { label: "Delivered",val: kpi.delivered,icon: "fa-circle-check",   color: "text-green-700",  bg: "bg-green-50"   },
          { label: "Pending",  val: kpi.pending,  icon: "fa-clock",          color: "text-sky-700",  bg: "bg-sky-50"   },
        ].map(({ label, val, icon, color, bg }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-slate-800">{val}</p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wide mt-1">{label}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
              <i className={`fa-solid ${icon} ${color} text-[16px]`} />
            </div>
          </div>
        ))}
      </div>

      {/* Delayed banner */}
      {kpi.delayed > 0 && (
        <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-4">
          <i className="fa-solid fa-triangle-exclamation text-orange-500 text-[16px] flex-shrink-0" />
          <p className="text-[12px] text-orange-700">
            <strong>{kpi.delayed} shipment{kpi.delayed > 1 ? "s" : ""} delayed</strong>
            {" "}— exceeded assigned slot time. Reassign immediately.
          </p>
        </div>
      )}

      {/* Search + Sort */}
      <div className="flex gap-2 mb-4">
        {/* Search */}
        <div
          className={`flex items-center gap-2 border bg-white rounded-xl h-10 px-3 shadow-sm
            transition-all duration-300 overflow-hidden cursor-pointer flex-1 
            ${searchFocused ? "border-indigo-400" : "border-slate-200 hover:border-indigo-300"}`}
          onClick={() => setSearchFocused(true)}
        >
          <i className="fa-solid fa-magnifying-glass text-slate-400 text-[14px] flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => { if (!searchQuery) setSearchFocused(false); }}
            placeholder="Search by tracking ID, customer, item, city, agent…"
            className={`bg-transparent outline-none text-[13px] text-slate-700 placeholder-slate-400 w-full`}
            //   transition-all duration-300 ${searchFocused ? "w-full" : "w-0"}
          />
          {searchQuery && (
            <button onClick={e => { e.stopPropagation(); setSearchQuery(""); setSearchFocused(false); }}
              className="text-slate-400 hover:text-slate-600 flex-shrink-0">
              <i className="fa-solid fa-xmark text-[13px]" />
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={sortKey}
          onChange={e => setSortKey(e.target.value as SortKey)}
          className={`border border-slate-200 bg-white rounded-xl h-10 px-3 text-[13px] text-slate-600
            outline-none focus:border-indigo-400 shadow-sm cursor-pointer transition-all duration-300 w-44 flex-shrink-0`}
            // ${searchFocused ? "w-44 flex-shrink-0" : "flex-1"}
        >
          <option value="newest">Sort: Newest first</option>
          <option value="oldest">Sort: Oldest first</option>
          <option value="amount_high">Sort: Amount high–low</option>
          <option value="amount_low">Sort: Amount low–high</option>
        </select>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 mb-4">
        {TABS.map(({ key, label }) => {
          const count = tabCounts[key] ?? 0;
          const isActive = activeTab === key;
          const isDelayed = key === "DELAYED" && count > 0;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-medium
                border transition-all
                ${isActive
                  ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white border-transparent shadow-md"
                  : isDelayed
                    ? "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-indigo-300"
                }`}
            >
              {isDelayed && !isActive && <i className="fa-solid fa-triangle-exclamation text-[10px]" />}
              {label}
              <span className={`text-[10px] font-semibold px-2 py-[1px] rounded-full
                ${isActive ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-700"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Result count */}
      <p className="text-[12px] text-slate-400 mb-3">
        {searchQuery
          ? `${displayed.length} result${displayed.length !== 1 ? "s" : ""} for "${searchQuery}"`
          : `Showing ${displayed.length} of ${shipments.length} shipments`}
      </p>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto overflow-y-auto max-h-[420px] scrollbar-none">
          <table className="w-full text-[12px]" style={{ minWidth: "900px" }}>
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
              <tr>
                {["Shipment", "Customer", "Route", "Priority", "Status", "Agent / Slot", "Amount", "Date", "Action"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-600 text-slate-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-slate-400">
                    <i className="fa-solid fa-box-open text-4xl mb-3 block text-slate-300" />
                    {searchQuery ? `No shipments match "${searchQuery}"` : "No shipments found"}
                  </td>
                </tr>
              ) : displayed.map(s => (
                <tr
                  key={s.id}
                  onClick={() => navigate(`/admin/shipments/${s.id}`)}
                  className={`hover:bg-sky-50 transition-all cursor-pointer
                    ${s.shipmentStatus === "DELAYED" ? "bg-orange-50/40" : ""}`}
                >
                  {/* Shipment ID */}
                  <td className="px-4 py-3">
                    <p className="font-mono font-semibold text-slate-800 text-[11px]">
                      {s.trackingId.substring(0, 15)}…
                    </p>
                    {s.isFragile && (
                      <span className="text-[10px] text-yellow-600">
                        <i className="fa-solid fa-wine-glass-crack mr-1" />Fragile
                      </span>
                    )}
                  </td>

                  {/* Customer */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0 ${avatarColor(s.customerName)}`}>
                        {getInitials(s.customerName)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{s.customerName}</p>
                        <p className="text-[10px] text-slate-400">{s.customerPhone}</p>
                      </div>
                    </div>
                  </td>

                  {/* Route */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-slate-700">{s.pickupCity}</span>
                      <i className="fa-solid fa-arrow-right text-slate-300 text-[9px]" />
                      <span className="font-medium text-slate-700">{s.deliveryCity}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{s.packageWeight} kg · {s.itemName}</p>
                  </td>

                  {/* Priority */}
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-semibold border ${PRIORITY_STYLE[s.shipmentPriority]}`}>
                      {PRIORITY_LABEL[s.shipmentPriority]}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-semibold border flex items-center gap-1 w-fit ${STATUS_STYLE[s.shipmentStatus]}`}>
                      {s.shipmentStatus === "DELAYED" && <i className="fa-solid fa-triangle-exclamation text-[9px]" />}
                      {STATUS_LABEL[s.shipmentStatus]}
                    </span>
                  </td>

                  {/* Agent / Slot */}
                  <td className="px-4 py-3">
                    {s.assignedAgentName ? (
                      <>
                        <p className="font-medium text-slate-700">{s.assignedAgentName}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          <i className="fa-regular fa-clock mr-1" />{s.assignedSlot}
                        </p>
                      </>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Not assigned</span>
                    )}
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800">₹{s.amount}</p>
                    <p className={`text-[10px] mt-0.5 ${s.paymentStatus === "PAID" ? "text-green-600" : s.paymentStatus === "FAILED" ? "text-red-500" : "text-sky-600"}`}>
                      {s.paymentStatus}
                    </p>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 text-[11px] text-slate-500 font-mono">
                    {formatDate(s.createdAt)}
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    {renderAction(s)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Reassign Modal ───────────────────────────────────────────────────── */}
      {reassignModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setReassignModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            onClick={e => e.stopPropagation()}>

            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[15px] font-semibold text-slate-800">Reassign delivery agent</h2>
                <p className="text-[12px] text-slate-500 mt-1 font-mono">{reassignModal.trackingId}</p>
              </div>
              <button onClick={() => setReassignModal(null)}
                className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all">
                <i className="fa-solid fa-xmark text-slate-500 text-[13px]" />
              </button>
            </div>

            {/* Current agent info */}
            {reassignModal.assignedAgentName && (
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4">
                <i className="fa-solid fa-user-clock text-slate-400 text-[15px]" />
                <div>
                  <p className="text-[11px] text-slate-500">Currently assigned to</p>
                  <p className="text-[13px] font-medium text-slate-700">{reassignModal.assignedAgentName}</p>
                  <p className="text-[11px] text-slate-400">{reassignModal.assignedSlot}</p>
                </div>
              </div>
            )}

            {/* Agent dropdown */}
            <div className="mb-5">
              <label className="text-[11px] font-medium text-slate-600 uppercase tracking-wide mb-2 block">
                Select new agent
              </label>
              <select
                value={selectedAgentId}
                onChange={e => setSelectedAgentId(Number(e.target.value))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] text-slate-700 outline-none focus:border-indigo-400 bg-white"
              >
                <option value="">— Choose an agent —</option>
                {MOCK_AGENTS.map(agent => (
                  <option key={agent.id} value={agent.id}
                    disabled={agent.name === reassignModal.assignedAgentName}>
                    {agent.name}
                    {" "}({agent.todayCount}/8 today · {agent.status})
                    {agent.name === reassignModal.assignedAgentName ? " — current" : ""}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1.5">
                <i className="fa-solid fa-circle-info mr-1" />
                Backend will auto-assign the next available slot for the selected agent.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={() => setReassignModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition-all">
                Cancel
              </button>
              <button
                onClick={handleReassign}
                disabled={!selectedAgentId || reassignLoading}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-[13px] font-medium
                  hover:from-indigo-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2"
              >
                {reassignLoading
                  ? <><i className="fa-solid fa-spinner fa-spin text-[12px]" />Reassigning…</>
                  : <><i className="fa-solid fa-rotate-right text-[12px]" />Confirm reassign</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Mark Complete Modal ──────────────────────────────────────────────── */}
      {completeModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setCompleteModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
            onClick={e => e.stopPropagation()}>

            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-circle-check text-green-600 text-2xl" />
            </div>

            <h2 className="text-[15px] font-semibold text-slate-800 text-center mb-1">
              Mark as completed?
            </h2>
            <p className="text-[12px] text-slate-500 text-center mb-1">
              {completeModal.trackingId}
            </p>
            <p className="text-[12px] text-slate-400 text-center mb-5">
              This will close the shipment permanently. Chat becomes read-only. This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button onClick={() => setCompleteModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition-all">
                Cancel
              </button>
              <button
                onClick={handleComplete}
                disabled={completeLoading}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[13px] font-medium
                  hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50
                  flex items-center justify-center gap-2"
              >
                {completeLoading
                  ? <><i className="fa-solid fa-spinner fa-spin text-[12px]" />Processing…</>
                  : <><i className="fa-solid fa-circle-check text-[12px]" />Yes, complete it</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminAllShipments;