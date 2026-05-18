interface Props {
  searchQuery: string;
  onCreate: () => void;
}

const ShipmentEmpty = ({ searchQuery, onCreate }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <i className="fa-solid fa-box-open text-slate-300 text-5xl mb-4" />

      <p className="text-slate-500 font-medium mb-1">
        {searchQuery
          ? "No shipments match your search"
          : "No shipments found"}
      </p>

      <p className="text-slate-400 text-sm">
        {searchQuery
          ? "Try a different keyword or clear the search"
          : "Create your first shipment to get started"}
      </p>

      {!searchQuery && (
        <button
          onClick={onCreate}
          className="mt-4 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white text-[13px] font-medium shadow-md hover:from-blue-600 hover:to-violet-600 transition-all"
        >
          <i className="fa-solid fa-plus mr-2 text-[11px]" />
          Send shipment
        </button>
      )}
    </div>
  );
};

export default ShipmentEmpty;