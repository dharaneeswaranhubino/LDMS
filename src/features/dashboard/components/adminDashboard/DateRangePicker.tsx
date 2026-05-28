import React, { useEffect, useRef, useState } from "react";
import { CalendarDays } from "lucide-react";

const DateRangePicker = () => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // format today date
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const today = formatDate(new Date());

  // default = today
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);

  const [open, setOpen] = useState(false);

  // close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // format display
  const displayDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-xl flex items-center justify-center bg-blue-500 hover:bg-blue-600">
      <div className="relative" ref={dropdownRef}>
        {/* Single Input UI */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-cyan-600 to-cyan-400 hover:from-cyan-400 hover:to-cyan-600 px-4 py-3 transition-all text-slate-200 text-sm shadow-md"
        >
          <CalendarDays className="h-5 w-5" />

          <span>
            {displayDate(fromDate)} → {displayDate(toDate)}
          </span>
        </button>

        {open && (
          <div className="absolute mt-1 w-66 rounded-2xl bg-gradient-to-br from-cyan-600 to-cyan-300 px-4 py-3 transition-all text-slate-100 p-4 shadow-2xl">
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm">From</label>

                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 px-3 py-2 text-slate-200 outline-none [color-scheme:dark]"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm">To</label>

                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 px-3 py-2 text-slate-200 outline-none [color-scheme:dark]"
                />
              </div>

              {/* Done */}
              <button
                onClick={() => setOpen(false)}
                className="mt-2 rounded-xl bg-white/30 py-2 text-sm font-semibold text-black transition hover:opacity-90"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateRangePicker;
