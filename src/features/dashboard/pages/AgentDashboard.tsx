import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { AssignedShipment} from "../DashobardTypes/agentTypes";
import { ALL_SLOTS, getGreeting, isActive, isDone, MOCK_PROFILE, MOCK_SHIPMENTS, STATUS_CONFIG, today } from "../utils/AgentDashboardHelper";
// import { fetchAgentSchedule } from "../../features/agent/agentSlice";

const AgentDashboard = () => {
  const navigate = useNavigate();
  // const dispatch = useAppDispatch();

  // When API ready — replace mock with Redux state
  // const { schedule, profile, loading } = useAppSelector(s => s.agent);
  const profile = MOCK_PROFILE;
  const shipments = MOCK_SHIPMENTS;

  // useEffect(() => { dispatch(fetchAgentSchedule()); }, [dispatch]);

  // ─── Active delivery ────────────────────────────────────────────────────────
  const activeDelivery = useMemo(
    () => shipments.find(s => isActive(s.shipmentStatus)) ?? null,
    [shipments]
  );

  // ─── Customer messages (shipments with lastMessage) ─────────────────────────
  const messages = useMemo(
    () => shipments.filter(s => s.lastMessage && s.shipmentStatus !== "DELIVERED" && s.shipmentStatus !== "COMPLETED"),
    [shipments]
  );
  const unreadCount = messages.filter(m => m.unread).length;

  // ─── Completed today ────────────────────────────────────────────────────────
  const completedToday = useMemo(
    () => shipments.filter(s => isDone(s.shipmentStatus)),
    [shipments]
  );

  // ─── Map shipments to slots ─────────────────────────────────────────────────
  const slotMap = useMemo(() => {
    const map: Record<string, AssignedShipment | null> = {};
    ALL_SLOTS.forEach(slot => { map[slot.start] = null; });
    shipments.forEach(s => { map[s.assignedSlotStart] = s; });
    return map;
  }, [shipments]);

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="h-[calc(100vh-72px)] overflow-y-auto scrollbar-none bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50 p-5">

      {/* Page header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            {getGreeting()}, {profile.name.split(" ")[0]}!
          </h1>
          <p className="text-[13px] text-slate-500 mt-1">{today}</p>
        </div>
        <span className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-[12px] font-medium">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Available
        </span>
      </div>

      {/* ── ROW 1: Stats full width ────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4 shadow-sm">
        <div className="grid grid-cols-6 gap-4">

          {/* On time % */}
          <div className="flex items-center gap-3 col-span-1">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-gauge text-blue-600 text-[16px]" />
            </div>
            <div>
              <p className="text-[20px] font-semibold text-slate-800 leading-none">{profile.onTimePercent}%</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide mt-1">On time</p>
            </div>
          </div>

          <div className="w-px bg-slate-200 self-stretch" />

          {/* Rating */}
          <div className="flex items-center gap-3 col-span-1">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-star text-amber-500 text-[16px]" />
            </div>
            <div>
              <p className="text-[20px] font-semibold text-slate-800 leading-none">{profile.rating}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide mt-1">Rating</p>
            </div>
          </div>

          <div className="w-px bg-slate-200 self-stretch" />

          {/* Total delivered */}
          <div className="flex items-center gap-3 col-span-1">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-boxes-stacked text-green-600 text-[16px]" />
            </div>
            <div>
              <p className="text-[20px] font-semibold text-slate-800 leading-none">{profile.totalDelivered}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide mt-1">All time</p>
            </div>
          </div>

          <div className="w-px bg-slate-200 self-stretch" />

          {/* Today assigned */}
          <div className="flex items-center gap-3 col-span-1">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-truck text-indigo-600 text-[16px]" />
            </div>
            <div>
              <p className="text-[20px] font-semibold text-slate-800 leading-none">{profile.todayAssigned}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide mt-1">Today</p>
            </div>
          </div>

          <div className="w-px bg-slate-200 self-stretch" />

          {/* Workload bar */}
          <div className="col-span-1 flex flex-col justify-center">
            <div className="flex justify-between text-[10px] text-slate-500 mb-1.5">
              <span>Today's workload</span>
              <span className="font-medium">{profile.todayAssigned} / 8 slots</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all"
                style={{ width: `${(profile.todayAssigned / 8) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {profile.todayCompleted} completed · {profile.todayActive} active
            </p>
          </div>

        </div>
      </div>

      {/* ── ROW 2: Active delivery + Customer messages ────────────────────── */}
      <div className="grid grid-cols-2 gap-4 mb-4">

        {/* Active delivery */}
        <div className="bg-white border border-blue-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-truck text-blue-600 text-[15px]" />
              <span className="text-[13px] font-semibold text-slate-800">Active delivery</span>
            </div>
            {activeDelivery
              ? <span className={`px-2 py-1 rounded-lg text-[10px] font-semibold border ${STATUS_CONFIG[activeDelivery.shipmentStatus].style}`}>
                  <i className={`fa-solid ${STATUS_CONFIG[activeDelivery.shipmentStatus].icon} mr-1 text-[9px]`} />
                  {STATUS_CONFIG[activeDelivery.shipmentStatus].label}
                </span>
              : null
            }
          </div>

          {activeDelivery ? (
            <>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-3">
                <p className="text-[11px] font-mono font-semibold text-blue-800">{activeDelivery.trackingId}</p>
                <p className="text-[12px] font-semibold text-slate-800 mt-1">{activeDelivery.customerName}</p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                  <span>{activeDelivery.pickupCity}</span>
                  <i className="fa-solid fa-arrow-right text-slate-300 text-[9px]" />
                  <span>{activeDelivery.deliveryCity}</span>
                </div>
                <div className="flex gap-3 mt-1">
                  <span className="text-[10px] text-slate-400">
                    <i className="fa-solid fa-weight-hanging mr-1" />{activeDelivery.packageWeight} kg
                  </span>
                  {activeDelivery.isFragile && (
                    <span className="text-[10px] text-amber-600">
                      <i className="fa-solid fa-triangle-exclamation mr-1" />Fragile
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400">
                    <i className="fa-regular fa-clock mr-1" />{activeDelivery.assignedSlotStart} – {activeDelivery.assignedSlotEnd}
                  </span>
                </div>
              </div>

              {/* Checkpoints */}
              <div className="space-y-0">
                {[
                  { label: "Started delivery",       done: true,  active: false },
                  { label: "Reached pickup location", done: true,  active: false },
                  { label: "Package picked up",       done: true,  active: false },
                  { label: "En route to delivery",    done: false, active: true  },
                  { label: "Near delivery location",  done: false, active: false },
                  { label: "Mark as delivered",       done: false, active: false },
                ].map((cp, i, arr) => (
                  <div key={i} className="flex gap-2 items-stretch">
                    <div className="flex flex-col items-center">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border text-[10px]
                        ${cp.done ? "bg-green-100 border-green-300 text-green-700"
                          : cp.active ? "bg-blue-100 border-blue-300 text-blue-700"
                          : "bg-slate-100 border-slate-200 text-slate-400"}`}>
                        <i className={`fa-solid ${cp.done ? "fa-check" : cp.active ? "fa-truck" : "fa-circle"} text-[8px]`} />
                      </div>
                      {i < arr.length - 1 && (
                        <div className={`w-px flex-1 min-h-[12px] my-[2px] ${cp.done ? "bg-green-300" : "bg-slate-200"}`} />
                      )}
                    </div>
                    <div className={`pb-2 flex-1 flex items-start justify-between ${i === arr.length - 1 ? "pb-0" : ""}`}>
                      <span className={`text-[11px] font-medium mt-0.5
                        ${cp.done ? "text-slate-600"
                          : cp.active ? "text-blue-700"
                          : "text-slate-400"}`}>
                        {cp.label}
                      </span>
                      {cp.active && (
                        <button
                          onClick={() => navigate(`/agent/delivery/${activeDelivery.id}`)}
                          className="text-[10px] px-2 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition-all flex items-center gap-1 flex-shrink-0"
                        >
                          <i className="fa-solid fa-location-dot text-[9px]" />Update
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate(`/agent/delivery/${activeDelivery.id}`)}
                className="w-full mt-3 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[12px] font-medium hover:from-blue-600 hover:to-indigo-600 transition-all flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-arrow-right text-[11px]" />Open delivery detail
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <i className="fa-solid fa-truck text-slate-200 text-3xl mb-3" />
              <p className="text-[12px] text-slate-500 font-medium">No active delivery right now</p>
              <p className="text-[11px] text-slate-400 mt-1">Your next delivery will appear here when started</p>
            </div>
          )}
        </div>

        {/* Customer messages */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-message text-slate-500 text-[15px]" />
              <span className="text-[13px] font-semibold text-slate-800">Customer messages</span>
            </div>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-700 border border-red-200">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="divide-y divide-slate-100">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <i className="fa-regular fa-comment text-slate-200 text-3xl mb-2" />
                <p className="text-[12px] text-slate-400">No messages yet</p>
              </div>
            ) : messages.map(msg => (
              <div
                key={msg.id}
                onClick={() => navigate(`/agent/chat/${msg.id}`)}
                className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-semibold mt-0.5
                  ${msg.unread ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>
                  {msg.customerName.split(" ").map(w => w[0]).slice(0,2).join("").toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <div className="flex items-center gap-2">
                      {msg.unread && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />}
                      <span className="text-[11px] font-mono font-semibold text-slate-700 truncate">{msg.trackingId.substring(0,14)}…</span>
                    </div>
                    <span className="text-[10px] text-slate-400 flex-shrink-0">{msg.lastMessageTime}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    <span className="font-medium text-slate-700">{msg.customerName}:</span> {msg.lastMessage}
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <button className="text-[10px] font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      <i className="fa-solid fa-reply text-[9px]" />Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {messages.length > 0 && (
            <div className="px-4 py-2 border-t border-slate-100">
              <button
                onClick={() => navigate("/agent/chat")}
                className="text-[11px] text-blue-600 hover:text-blue-700 font-medium"
              >
                View all conversations →
              </button>
            </div>
          )}
        </div>

      </div>

      {/* ── ROW 3: Today's schedule + Completed today ──────────────────────── */}
      <div className="grid grid-cols-2 gap-4">

        {/* Today's schedule — all 12 slots */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-calendar-day text-slate-500 text-[15px]" />
              <span className="text-[13px] font-semibold text-slate-800">Today's schedule</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">12 slots · 9AM–9PM</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto scrollbar-none">
            {ALL_SLOTS.map(slot => {
              const shipment = slotMap[slot.start];

              // Free slot
              if (!shipment) return (
                <div key={slot.start} className="flex items-center gap-0">
                  <div className="w-[72px] flex-shrink-0 px-3 py-3 border-r border-slate-100">
                    <p className="text-[10px] font-mono font-medium text-slate-400">{slot.start}</p>
                    <p className="text-[9px] font-mono text-slate-300 mt-0.5">{slot.end}</p>
                  </div>
                  <div className="flex-1 px-3 py-3">
                    <p className="text-[11px] text-slate-300 italic">Free slot</p>
                  </div>
                  <div className="px-3">
                    <span className="px-2 py-0.5 rounded text-[9px] bg-slate-50 text-slate-300 border border-slate-100">Free</span>
                  </div>
                </div>
              );

              const cfg = STATUS_CONFIG[shipment.shipmentStatus];
              const cancelled = shipment.shipmentStatus === "CANCELLED";
              const done = isDone(shipment.shipmentStatus);
              const active = isActive(shipment.shipmentStatus);

              return (
                <div
                  key={slot.start}
                  onClick={() => !cancelled && navigate(`/agent/delivery/${shipment.id}`)}
                  className={`flex items-start gap-0 transition-all
                    ${cancelled ? "opacity-50" : "cursor-pointer hover:bg-slate-50"}
                    ${active ? "bg-blue-50/40" : ""}
                  `}
                >
                  <div className="w-[72px] flex-shrink-0 px-3 py-3 border-r border-slate-100">
                    <p className={`text-[10px] font-mono font-medium ${active ? "text-blue-700" : "text-slate-500"}`}>{slot.start}</p>
                    <p className="text-[9px] font-mono text-slate-300 mt-0.5">{slot.end}</p>
                  </div>
                  <div className="flex-1 px-3 py-3 min-w-0">
                    <p className={`text-[11px] font-mono font-semibold truncate ${cancelled ? "line-through text-slate-400" : "text-slate-700"}`}>
                      {shipment.trackingId.substring(0, 14)}…
                    </p>
                    <p className={`text-[11px] font-medium mt-0.5 ${cancelled ? "text-slate-300 line-through" : "text-slate-700"}`}>
                      {shipment.customerName}
                    </p>
                    <div className={`flex items-center gap-1 text-[10px] mt-0.5 ${cancelled ? "text-slate-300" : "text-slate-400"}`}>
                      <span>{shipment.pickupCity}</span>
                      <i className="fa-solid fa-arrow-right text-[8px]" />
                      <span>{shipment.deliveryCity}</span>
                    </div>
                    {cancelled && (
                      <p className="text-[10px] text-red-400 mt-1 italic">Cancelled — slot now free</p>
                    )}
                  </div>
                  <div className="px-3 py-3 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-semibold border ${cfg.style}`}>
                      {cfg.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completed today */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-circle-check text-green-500 text-[15px]" />
              <span className="text-[13px] font-semibold text-slate-800">Completed today</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700 border border-green-200">
              {completedToday.length} done
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {completedToday.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <i className="fa-regular fa-circle-check text-slate-200 text-3xl mb-3" />
                <p className="text-[12px] text-slate-500 font-medium">No completions yet today</p>
                <p className="text-[11px] text-slate-400 mt-1">Delivered shipments will appear here</p>
              </div>
            ) : completedToday.map(s => (
              <div
                key={s.id}
                onClick={() => navigate(`/agent/delivery/${s.id}`)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-check text-green-600 text-[12px]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-mono font-semibold text-slate-700 truncate">{s.trackingId.substring(0, 16)}…</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{s.customerName}</p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                    <span>{s.pickupCity}</span>
                    <i className="fa-solid fa-arrow-right text-[8px]" />
                    <span>{s.deliveryCity}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] text-slate-400">{s.assignedSlotStart}</p>
                  <span className="mt-1 inline-block px-2 py-0.5 rounded text-[9px] bg-green-100 text-green-700 border border-green-200 font-semibold">
                    On time
                  </span>
                </div>
              </div>
            ))}
          </div>

          {completedToday.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Completion rate today</span>
                <span className="font-semibold text-slate-700">
                  {completedToday.length} / {profile.todayAssigned} shipments
                </span>
              </div>
              <div className="h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-green-400 transition-all"
                  style={{ width: `${(completedToday.length / Math.max(profile.todayAssigned, 1)) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default AgentDashboard;