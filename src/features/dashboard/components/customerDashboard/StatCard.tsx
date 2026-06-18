import type { ReactNode } from "react";

const StatCard = ({
  icon,
  label,
  value,
  sub,
  iconBg,
  accent,
}: {
  icon: ReactNode | string;
  label: string;
  value: number;
  sub: string;
  iconBg: string;
  accent?: string;
}) => {
  return (
    <div className="flex flex-1 justify-between items-center gap-3 rounded-xl border-l-5 border-sky-300 bg-white px-5 py-[18px] shadow-md">
      <div>
        <p
          className={`text-[34px] font-extrabold leading-none ${accent ?? "text-gray-800"}`}
        >
          {value}
        </p>
        <div className="text-[11px] font-medium uppercase tracking-[0.07em] text-slate-500 mt-2">
          <span>{label}</span>
        </div>
        <p className="mt-1.5 text-[11px] text-gray-400">{sub}</p>
      </div>
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-[10px] text-[2em] ${iconBg} ${accent}`}
      >
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
