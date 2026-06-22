import type { RefObject } from "react";
import type { SortKey } from "../../shipmentTypes";
import { SORT_OPTIONS } from "../../utils/shipmentHelpers";

interface Props {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  searchFocused: boolean;
  setSearchFocused: (value: boolean) => void;
  searchRef: RefObject<HTMLInputElement | null>;
  sortKey: SortKey;
  setSortKey: (value: SortKey) => void;
}

const ShipmentToolbar = ({
  searchQuery,
  setSearchQuery,
  searchFocused,
  setSearchFocused,
  searchRef,
  sortKey,
  setSortKey,
}: Props) => {
  return (
    <div className="sm:flex gap-2 mt-3 mb-4">
      {/* Search */}
      <div
        className="flex items-center gap-2 border border-slate-300 focus-within:border-violet-400 bg-white rounded-lg h-10 px-3 shadow-sm
        transition-all duration-300 overflow-hidden flex-1"
        onClick={() => {
          if (!searchFocused) {
            setSearchFocused(true);
            setTimeout(() => searchRef.current?.focus(), 50);
          }
        }}
      >
        <i className="fa-solid fa-magnifying-glass text-slate-400 text-[15px] flex-shrink-0" />

        <input
          ref={searchRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => {
            if (!searchQuery) setSearchFocused(false);
          }}
          placeholder="Search by tracking ID, item, city, address…"
          className="bg-transparent outline-none text-[13px] text-slate-700 placeholder-slate-400 transition-all duration-300 w-full"
        />

        {searchQuery && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSearchQuery("");
              setSearchFocused(false);
              searchRef.current?.blur();
            }}
            className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <i className="fa-solid fa-xmark text-[13px]" />
          </button>
        )}
      </div>

      <select
        value={sortKey}
        onChange={(e) => setSortKey(e.target.value as SortKey)}
        className="border border-slate-200 bg-white rounded-lg h-10 px-3 text-[13px]
        text-slate-600 outline-none focus:border-violet-400 shadow-sm cursor-pointer
        transition-all duration-300 w-full sm:w-48 flex-shrink-0 mt-3 sm:mt-0"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ShipmentToolbar;
