import { useEffect, useRef, useState } from "react";
import { CalendarDays } from "lucide-react";

const formatDate = (date: Date) => date.toISOString().split("T")[0];
const today = formatDate(new Date());

export function displayDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface DateRangePickerProps {
  fromDate: string;
  toDate: string;
  onApply: (from: string, to: string) => void;
}

export default function DateRangePicker({
  fromDate,
  toDate,
  onApply,
}: DateRangePickerProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [localFrom, setLocalFrom] = useState(fromDate);
  const [localTo, setLocalTo] = useState(toDate);

  useEffect(() => {
    setLocalFrom(fromDate);
  }, [fromDate]);

  useEffect(() => {
    setLocalTo(toDate);
  }, [toDate]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApply = () => {
    onApply(localFrom, localTo);
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 whitespace-nowrap rounded-xl bg-gradient-to-br from-cyan-700 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition-opacity hover:opacity-90"
      >
        <CalendarDays size={17} />
        <span>
          {displayDate(fromDate)} → {displayDate(toDate)}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-[100] w-60 rounded-2xl bg-gradient-to-br from-cyan-700 to-cyan-500 p-4 shadow-2xl shadow-cyan-500/25">
          <div className="flex flex-col gap-3">
            {/* From */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-cyan-100">
                From
              </label>

              <input
                type="date"
                value={localFrom}
                max={localTo}
                onChange={(e) => setLocalFrom(e.target.value)}
                className="w-full rounded-lg border-0 bg-white/20 px-3 py-2 text-sm text-white outline-none box-border [color-scheme:dark] placeholder:text-white/70"
              />
            </div>

            {/* To */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-cyan-100">
                To
              </label>

              <input
                type="date"
                value={localTo}
                min={localFrom}
                max={today}
                onChange={(e) => setLocalTo(e.target.value)}
                className="w-full rounded-lg border-0 bg-white/20 px-3 py-2 text-sm text-white outline-none box-border [color-scheme:dark] placeholder:text-white/70"
              />
            </div>

            {/* Apply */}
            <button
              onClick={handleApply}
              className="mt-1 rounded-lg bg-white py-2 text-sm font-bold text-cyan-700 transition-opacity hover:opacity-85"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}