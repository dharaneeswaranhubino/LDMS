import type { ComplaintStatus } from "../../shipmentTypes";

const TABS: { label: string; value: "ALL" | ComplaintStatus }[] = [
  // { label: "All", value: "ALL" },
  // { label: "Open", value: "OPEN" },
  // { label: "In Review", value: "IN_REVIEW" },
  // { label: "Resolved", value: "RESOLVED" },
];

interface Props {
  activeTab: "ALL" | ComplaintStatus;
  onTabChange: (tab: "ALL" | ComplaintStatus) => void;
}

const MyComplaintFilters = ({ activeTab, onTabChange }: Props) => {
  return (
    <div className="flex items-center gap-2 flex-wrap mb-4">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all
            ${
              activeTab === tab.value
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default MyComplaintFilters;