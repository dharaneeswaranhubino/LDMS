const StatCard = ({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  sub: string;
  accent?: string;
}) => {
  return (
    <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
      <div className="mb-3 flex items-center gap-2 text-xs text-gray-400">
        <Icon size={13} />
        <span>{label}</span>
      </div>
      <p
        className={`text-3xl font-semibold leading-none tracking-tight ${accent ?? "text-gray-800"}`}
      >
        {value}
      </p>
      <p className="mt-1.5 text-[11px] text-gray-400">{sub}</p>
    </div>
  );
};

export default StatCard;
