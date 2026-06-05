interface Props {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const Pagination = ({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
}: Props) => {
  return (
    <div className="flex flex-col gap-4 px-5 py-4 bg-transparent sm:flex-row sm:items-center sm:justify-between">
      {/* Left: result info + limit picker */}
      <div className="flex items-center gap-3">
        <p className="text-[11px] text-slate-500">
          Page <span className="font-semibold">{page}</span> of{" "}
          <span className="font-semibold">{totalPages}</span> ·{" "}
          <span className="font-semibold">{total}</span> total
        </p>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="border border-slate-200 bg-white rounded-lg h-8 px-2 text-[11px] text-slate-600 outline-none focus:border-indigo-400 cursor-pointer"
        >
          <option value={6}>6 / page</option>
          <option value={12}>12 / page</option>
          <option value={18}>18 / page</option>
          <option value={24}>24 / page</option>
        </select>
      </div>

      <div className="w-full overflow-x-auto sm:w-auto scrollbar-none">
        <div className="flex min-w-max items-center justify-center gap-2 pb-1">
          <button
            disabled={page === 1}
            onClick={() => onPageChange(Math.max(1, page - 1))}
            className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium
              transition-all hover:border-violet-300 hover:text-violet-600
              disabled:cursor-not-allowed disabled:opacity-40"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
            )
            .map((p, index, arr) => {
              const prev = arr[index - 1];
              return (
                <div key={p} className="flex items-center gap-2">
                  {prev && p - prev > 1 && (
                    <span className="px-1 text-slate-400">...</span>
                  )}
                  <button
                    onClick={() => onPageChange(p)}
                    className={`h-9 min-w-[36px] rounded-xl px-3 text-sm font-semibold transition-all
                      ${
                        page === p
                          ? "bg-violet-600 text-white shadow-md"
                          : "border border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:text-violet-600"
                      }`}
                  >
                    {p}
                  </button>
                </div>
              );
            })}

          <button
            disabled={page === totalPages}
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium
              transition-all hover:border-violet-300 hover:text-violet-600
              disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;