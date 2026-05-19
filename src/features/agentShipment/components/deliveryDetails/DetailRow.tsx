interface DetailRowProps {
  label: string;
  value: string;
}

const DetailRow = ({ label, value }: DetailRowProps) => {
  return (
    <>
      <div className="flex items-center justify-between border-b-2 border-slate-300">
        <span className="text-sm text-slate-500">{label}</span>
        <span className="text-sm font-medium text-slate-500">{value}</span>
      </div>
    </>
  );
};

export default DetailRow;
