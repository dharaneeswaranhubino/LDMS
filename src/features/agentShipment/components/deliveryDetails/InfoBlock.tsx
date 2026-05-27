interface InfoBlockProps {
  label: string;
  value: string | number | undefined;
  success?: boolean;
}

const InfoBlock = ({ label, value, success }: InfoBlockProps) => {
  return (
    <>
      <div className="flex px-3 items-center gap-1">
        <p className="text-slate-700">{label} :</p>
        <p className={`${success ? "text-green-500" : "text-slate-500"}`}>
          {value}
        </p>
      </div>
    </>
  );
};

export default InfoBlock;
