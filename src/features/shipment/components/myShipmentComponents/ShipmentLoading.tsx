const ShipmentLoading = () => {
  return (
    <div className="h-[calc(100vh-72px)] overflow-y-auto scrollbar-none bg-gradient-to-br from-slate-50 via-sky-50 to-purple-50 p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-7 w-40 bg-slate-200 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-64 bg-slate-100 rounded animate-pulse" />
        </div>

        <div className="h-10 w-44 bg-slate-200 rounded-xl animate-pulse" />
      </div>

      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-5 mb-3 animate-pulse"
        >
          <div className="flex justify-between mb-3">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-5 w-20 bg-slate-100 rounded-full" />
          </div>

          <div className="h-3 w-56 bg-slate-100 rounded mb-2" />
          <div className="h-3 w-48 bg-slate-100 rounded" />
        </div>
      ))}
    </div>
  );
};

export default ShipmentLoading;