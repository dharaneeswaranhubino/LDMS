import type { ComplaintFiltersProps } from "../../adminTypes";
import { ComplaintFiltersTABS } from "../../utils/adminShipmentHelper";

const ComplaintFilters = ({
  activeTab,
  // pagination,
  onTabChange,
}: ComplaintFiltersProps) => {
  // console.log(pagination);

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      {ComplaintFiltersTABS.map((tab) => {
        const isActive = activeTab === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              isActive
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
            }`}
          >
            {tab.label}
            {/* {tab.value === "ALL" && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {pagination.total}
              </span>
            )} */}
          </button>
        );
      })}
    </div>
  );
};

export default ComplaintFilters;
