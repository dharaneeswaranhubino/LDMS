import { useEffect, useMemo } from "react";
import Select from "react-select";
import {
  getMyDeliveries,
  // setActiveTab,
  setCurrentPage,
  setPriorityFilter,
  setSearch,
} from "../agentSlice";
import DeliveryCard from "../components/MyDeliveries/DeliveryCard";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../shared/hooks/reduxHooks";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";

const DeliveryHistory = () => {
  const dispatch = useAppDispatch();

  const {
    deliveries,
    search,
    priorityFilter,
    activeTab,
    currentPage,
    itemsPerPage,
    loading,
  } = useAppSelector((state) => state.agent);

  useEffect(() => {
    dispatch(getMyDeliveries());
  }, [dispatch]);

  const options = [
    { value: "ALL", label: "All priority" },
    { value: "SAME_DAY", label: "Same day" },
    { value: "EXPRESS", label: "Express" },
    { value: "STANDARD", label: "Standard" },
  ];

  const filteredDeliveries = useMemo(() => {
    let filtered = [...deliveries];

    if (search) {
      filtered = filtered.filter((item) => {
        const value = search.toLowerCase();
        return (
          item.trackingId.toLowerCase().includes(value) ||
          item.senderName.toLowerCase().includes(value) ||
          item.receiverName.toLowerCase().includes(value) ||
          item.deliveryCity.toLowerCase().includes(value) ||
          item.itemName.toLowerCase().includes(value)
        );
      });
    }
    if (priorityFilter !== "ALL") {
      filtered = filtered.filter(
        (item) => item.shipmentPriority === priorityFilter,
      );
    }
    if (activeTab === "THIS_WEEK") {
      filtered = filtered.slice(0, 6);
    }
    if (activeTab === "THIS_MONTH") {
      filtered = filtered.slice(0, 10);
    }
    return filtered;
  }, [deliveries, search, priorityFilter, activeTab]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDeliveries.length / itemsPerPage),
  );
  const paginatedData = filteredDeliveries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (loading) {
    return (
      <div className="h-[calc(100vh-72px)] overflow-y-auto rounded-lg bg-gradient-to-br from-sky-50 via-cyan-100 to-indigo-50 scrollbar-none">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-cyan-50 via-indigo-200 to-sky-50 p-5">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-600">
            Delivery History
          </h1>
          <p className="text-[13px] text-slate-500 mt-1">All your deliveries</p>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex items-center w-full ">
            <i className="fa-solid fa-magnifying-glass absolute left-3 z-10 text-gray-500 pointer-events-none"></i>
            <input
              type="text"
              placeholder="Search tracking ID, sender, receiver, item..."
              value={search}
              onChange={(e) => dispatch(setSearch(e.target.value))}
              className="w-full rounded-lg border border-indigo-100 bg-white py-2 pl-10 pr-10 outline-none backdrop-blur focus-within:border-violet-400"
            />
          </div>
          <div className="rounded-lg border border-indigo-100 bg-white lg:w-72 relative focus-within:border-violet-400">
            <Select
              options={options}
              defaultValue={options[0]}
              onChange={(selected) =>
                dispatch(setPriorityFilter(selected?.value ?? "ALL"))
              }
              styles={{
                control: (base) => ({
                  ...base,
                  border: "none",
                  boxShadow: "none",
                  borderRadius: "10px",
                }),
              }}
              components={{
                IndicatorSeparator: () => null,
                // DropdownIndicator: () => null,
              }}
            />
          </div>
        </div>

        <p className="text-sm font-medium text-gray-700">
          Showing {filteredDeliveries.length} deliveries
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-hidden overflow-y-scroll scrollbar-none rounded-2xl">
          {paginatedData.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16">
              <i className="fa-solid fa-box-open text-5xl text-slate-300 mb-4"></i>

              <h2 className="text-lg font-semibold text-slate-700">
                No deliveries assigned
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                New assigned shipments will appear here.
              </p>
            </div>
          ) : (
            paginatedData.map((item) => (
              <DeliveryCard key={item?.shipmentId} item={item} />
            ))
          )}
        </div>

        <div
          className={`flex flex-col gap-4 pt-5 lg:flex-row lg:items-center lg:justify-between ${paginatedData.length === 0 && "hidden"}`}
        >
          <p className="text-center text-sm text-slate-600 lg:text-left">
            Showing{" "}
            <span className="font-semibold">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>
            {" - "}
            <span className="font-semibold">
              {Math.min(currentPage * itemsPerPage, filteredDeliveries.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold">{filteredDeliveries.length}</span>{" "}
            deliveries
          </p>

          <div
            className={`w-full overflow-x-auto lg:w-auto scrollbar-none ${paginatedData.length === 0 && "hidden"}`}
          >
            <div className="flex min-w-max items-center justify-center gap-2 pb-1">
              <button
                disabled={currentPage === 1}
                onClick={() => dispatch(setCurrentPage(currentPage - 1))}
                className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium
                  transition-all hover:border-violet-300 hover:text-violet-600
                  disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  return (
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                  );
                })
                .map((page, index, arr) => {
                  const prev = arr[index - 1];

                  return (
                    <div key={page} className="flex items-center gap-2">
                      {prev && page - prev > 1 && (
                        <span className="px-1 text-slate-400">...</span>
                      )}

                      <button
                        onClick={() => dispatch(setCurrentPage(page))}
                        className={`h-9 min-w-[36px] rounded-xl px-3 text-sm font-semibold transition-all
                          ${
                            currentPage === page
                              ? "bg-violet-600 text-white shadow-md"
                              : "border border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:text-violet-600"
                          }`}
                      >
                        {page}
                      </button>
                    </div>
                  );
                })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => dispatch(setCurrentPage(currentPage + 1))}
                className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium
                  transition-all hover:border-violet-300 hover:text-violet-600
                  disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryHistory;
