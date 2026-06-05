import { useRef } from "react";
import type { SortKey } from "../../adminTypes";

interface Props {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  searchFocused: boolean;
  setSearchFocused: (val: boolean) => void;
  sortKey: SortKey;
  setSortKey: (val: SortKey) => void;
}

const AdminShipmentSearchSort = ({
  searchQuery,
  setSearchQuery,
  searchFocused,
  setSearchFocused,
  sortKey,
  setSortKey,
}: Props) => {
  const searchRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      {/* Search */}
      <div
        className={`flex items-center gap-2 border bg-white rounded-xl h-10 px-3 shadow-sm transition-all duration-300 overflow-hidden cursor-pointer flex-1
          ${searchFocused ? "border-indigo-400" : "border-slate-200 hover:border-indigo-300"}`}
        onClick={() => searchRef.current?.focus()}
      >
        <i className="fa-solid fa-magnifying-glass text-slate-400 text-[14px] flex-shrink-0" />
        <input
          ref={searchRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => {
            if (!searchQuery) setSearchFocused(false);
          }}
          placeholder="Search by tracking ID, customer, item, city, agent…"
          className="bg-transparent outline-none text-[13px] h-10 text-slate-700 placeholder-slate-400 w-full"
        />
        {searchQuery && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSearchQuery("");
              setSearchFocused(false);
            }}
            className="text-slate-400 hover:text-slate-600 flex-shrink-0"
          >
            <i className="fa-solid fa-xmark text-[13px]" />
          </button>
        )}
      </div>

      {/* Sort */}
      <select
        value={sortKey}
        onChange={(e) => setSortKey(e.target.value as SortKey)}
        className="border border-slate-200 bg-white rounded-xl h-10 px-3 text-[13px] text-slate-600 outline-none focus:border-indigo-400 shadow-sm cursor-pointer w-full sm:w-44 flex-shrink-0"
      >
        <option value="newest">Sort: Newest first</option>
        <option value="oldest">Sort: Oldest first</option>
        <option value="amount_high">Sort: Amount high–low</option>
        <option value="amount_low">Sort: Amount low–high</option>
      </select>
    </div>
  );
};
export default AdminShipmentSearchSort;
