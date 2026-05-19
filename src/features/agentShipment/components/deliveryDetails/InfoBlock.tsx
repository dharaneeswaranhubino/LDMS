interface InfoBlockProps {
  label: string;
  value: string;
  success?: boolean;
}

const InfoBlock = ({ label, value, success }: InfoBlockProps) => {
  return (
    <>
      <div className="rounded-2xl border border-zinc-700 bg-zinc-900/40 p-4">
        <p className="text-xs uppercase tracking-wider text-zinc-500">
          {label}
        </p>
        <p
          className={`mt-2 font-semibold ${
            success ? "text-green-400" : "text-white"
          }`}
        >
          {value}
        </p>
      </div>
    </>
  );
};

export default InfoBlock;
