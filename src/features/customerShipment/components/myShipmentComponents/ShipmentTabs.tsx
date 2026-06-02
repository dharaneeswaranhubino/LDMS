import type { FilterTab } from "../../shipmentTypes";
import { FILTER_TABS } from "../../utils/shipmentHelpers";

interface Props {
  activeTab: FilterTab;
  setActiveTab: (tab: FilterTab) => void;
  tabCounts: Record<string, number>;
}

const ShipmentTabs = ({
  activeTab,
  setActiveTab,
  tabCounts,
}: Props) => {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 mb-4">
      {FILTER_TABS.map(({ key, label }) => {
        const count = tabCounts[key] ?? 0;
        const isActive = activeTab === key;

        return (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium border transition-all
            ${
              isActive
                ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white border-transparent shadow-md"
                : "border-slate-200 bg-white/70 text-slate-600 hover:bg-white hover:border-violet-300"
            }`}
          >
            {label}

            <span
              className={`text-[11px] font-semibold px-2 py-[1px] rounded-full
              ${
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-violet-100 text-violet-700"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ShipmentTabs;