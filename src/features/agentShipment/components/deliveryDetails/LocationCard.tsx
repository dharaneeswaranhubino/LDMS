interface LocationCardProps {
  title: string;
  address: string;
  city: string;
}

const LocationCard = ({ title, address, city }: LocationCardProps) => {
  return (
    <>
      <div className="rounded-2xl border border-zinc-700 bg-zinc-900/40 p-5">
        <p className="text-xs uppercase tracking-wider text-zinc-500">
          {title}
        </p>

        <div className="mt-3 space-y-1">
          <h3 className="text-lg font-semibold">{address}</h3>
          <p className="text-sm text-zinc-400">{city}</p>
        </div>
      </div>
    </>
  );
};

export default LocationCard;
