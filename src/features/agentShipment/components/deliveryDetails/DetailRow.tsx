interface DetailRowProps {
  label: string;
  value: string;
}

const DetailRow = ({ label, value }: DetailRowProps) => {
  return (
    <>
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <span className="text-sm text-zinc-400">{label}</span>
        <span className="text-sm font-medium text-white">{value}</span>
      </div>
    </>
  );
};

export default DetailRow;
