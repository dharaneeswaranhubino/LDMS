import type { StatCardProps } from "../../../adminShipment/adminTypes";

const StatCard = ({ icon, value, label, iconBg, accent, formatValue }: StatCardProps) => {
  return (
    <div className="flex flex-1 justify-between items-center gap-3 rounded-xl border-l-5 border-cyan-300 bg-white px-5 py-[18px] shadow-md">
      <div>
        <div
          className="text-[34px] font-extrabold leading-none"
          style={{ color: accent }}
        >
          {formatValue ? formatValue(value) : value}
        </div>
        <div className="text-[11px] font-medium uppercase tracking-[0.07em] text-slate-500 mt-2">
          {label}
        </div>
      </div>
      <div
        className="flex h-14 w-14 items-center justify-center rounded-[10px] text-[2em]"
        style={{ backgroundColor: iconBg, color: accent }}
      >
        {icon}
      </div>
    </div>
  );
};

export default StatCard;