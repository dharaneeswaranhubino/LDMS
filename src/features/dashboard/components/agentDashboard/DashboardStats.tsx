interface profile{
  onTimePercent:number;
  rating:number;
  totalDelivered:number;
  todayAssigned:number;
  todayCompleted:number;
  todayActive:number;
}

interface dashboardProfile{
  profile:profile;
}
const DashboardStats = ({ profile }:dashboardProfile) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4 shadow-sm">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <i className="fa-solid fa-gauge text-blue-600 text-[16px]" />
          </div>

          <div>
            <p className="text-[20px] font-semibold">
              {profile.onTimePercent}%
            </p>

            <p className="text-[10px] text-slate-400 uppercase">
              On Time
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <i className="fa-solid fa-star text-amber-500 text-[16px]" />
          </div>

          <div>
            <p className="text-[20px] font-semibold">
              {profile.rating}
            </p>

            <p className="text-[10px] text-slate-400 uppercase">
              Rating
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 col-span-1">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-boxes-stacked text-green-600 text-[16px]" />
            </div>
            <div>
              <p className="text-[20px] font-semibold text-slate-800 leading-none">
                {profile.totalDelivered}
              </p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide mt-1">
                All time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 col-span-1">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-truck text-indigo-600 text-[16px]" />
            </div>
            <div>
              <p className="text-[20px] font-semibold text-slate-800 leading-none">
                {profile.todayAssigned}
              </p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide mt-1">
                Today
              </p>
            </div>
          </div>

          <div className="col-span-1 flex flex-col justify-center">
            <div className="flex justify-between text-[10px] text-slate-500 mb-1.5">
              <span>Today's workload</span>
              <span className="font-medium">
                {profile.todayAssigned} / 8 slots
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all"
                style={{ width: `${(profile.todayAssigned / 8) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {profile.todayCompleted} completed · {profile.todayActive} active
            </p>
          </div>

      </div>
    </div>
  );
};

export default DashboardStats;