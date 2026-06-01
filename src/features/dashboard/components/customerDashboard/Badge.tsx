
const Badge = ({
  status,
  config,
}: {
  status: string;
  config: Record<string, { label: string; cls: string }>;
}) => {
  const c = config[status] ?? {
    label: status,
    cls: "bg-gray-100 text-gray-500 border border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${c.cls}`}
    >
      {c.label}
    </span>
  );
}

export default Badge;