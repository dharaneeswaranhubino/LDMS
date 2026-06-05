import type { FilterTab } from "../../adminTypes";
import { TABS } from "../../utils/adminShipmentHelper";

interface Props {
  activeTab: FilterTab;
  tabCounts: Record<string, number>;
  onTabChange: (tab: FilterTab) => void;
}
const AdminShipmentTabs = ({ activeTab, tabCounts, onTabChange }: Props) => {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 mb-4">
      {TABS.map(({ key, label }) => {
        const count = tabCounts[key] ?? 0;
        const isActive = activeTab === key;
        const isDelayed = key === "DELAYED" && count > 0;

        return (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-medium border transition-all
              ${
                isActive
                  ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white border-transparent shadow-md"
                  : isDelayed
                    ? "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-indigo-300"
              }`}
          >
            {isDelayed && !isActive && (
              <i className="fa-solid fa-triangle-exclamation text-[10px]" />
            )}
            {label}
            <span
              className={`text-[10px] font-semibold px-2 py-[1px] rounded-full
              ${isActive ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-700"}`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default AdminShipmentTabs;
