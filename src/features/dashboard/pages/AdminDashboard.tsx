import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../shared/hooks/reduxHooks";
import DateRangePicker from "../components/adminDashboard/DateRangePicker";
import { LuBoxes } from "react-icons/lu";
import { FaRegCheckCircle } from "react-icons/fa";

const stateCards = [
  {
    count: 120,
    title: "Total Shipments",
    statusIcon: <i className="fa-solid fa-arrow-trend-up"></i>,
    status: "+12 today",
    icon: <LuBoxes size={40} />,
    iconColor:"text-cyan-700",
    iconBgColor:"bg-cyan-100"
  },
  {
    count: 85,
    title: "Delivered",
    statusIcon: <i className="fa-solid fa-arrow-trend-up"></i>,
    status: "+12 today",
    icon: <FaRegCheckCircle size={40} />,
    iconColor:"text-lime-700",
    iconBgColor:"bg-lime-100"
  },
  {
    count: 20,
    title: "Active Delivered",
    statusIcon: <i className="fa-solid fa-arrow-trend-up"></i>,
    status: "+12 today",
    icon: <FaRegCheckCircle size={40} />,
    iconColor:"text-lime-700",
    iconBgColor:"bg-lime-100"
  },
];
const AdminDashboard = () => {
  // const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  // const createAgent = async () => {
  //   navigate("/agentRegisteration");
  // };
  return (
    <>
      <div className="rounded-lg h-[calc(100vh-72px)] overflow-y-auto scrollbar-none bg-gradient-to-br from-sky-50 via-cyan-100 to-indigo-50 p-5 mt-2">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">
              Good morning, {user?.name}!
            </h1>

            <p className="text-[14px] text-slate-500 mt-1">
              Sunday, 25 May 2026 · Overview of all operations
            </p>
          </div>
          <DateRangePicker />
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6">
          {stateCards.map((item, index) => (
            <div key={index} className="flex items-center justify-around bg-white border border-slate-200 rounded-2xl p-4 gap-5">
              <div>
                <h2 className="text-[30px] font-bold text-slate-800">{item.count}</h2>
                <p className="text-[11px] text-slate-400 uppercase font-semibold">
                  {item.title}
                </p>
                {/* <p className="text-[12px] mt-1 text-green-500">
                  {item.statusIcon} {item.status}
                </p> */}
              </div>
              <div className={`${item.iconBgColor} p-2 rounded-lg ${item.iconColor}`}>
                {item.icon}
              </div>
            </div>
          ))}
          {/* <div className="flex items-center justify-around bg-white border border-slate-200 rounded-2xl p-4">
            <div>
              <h2 className="text-[30px] font-bold text-slate-800">14</h2>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">
                Active shipments
              </p>
              <p className="text-[12px] text-slate-500 mt-1">2 offline today</p>
            </div>
            <div className="bg-blue-200 p-2 rounded-lg text-cyan-700">
              <i className="fa-regular fa-circle-check"></i>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-[11px] text-slate-400 uppercase font-semibold">
              Pending Assignment
            </p>

            <h2 className="text-[30px] font-bold text-slate-800 mt-2">8</h2>

            <p className="text-[12px] text-slate-500 mt-1">Action needed</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-[11px] text-slate-400 uppercase font-semibold">
              Revenue This Month
            </p>

            <h2 className="text-[30px] font-bold text-slate-800 mt-2">
              ₹1.24L
            </h2>

            <p className="text-[12px] text-slate-500 mt-1">
              <i className="fa-solid fa-arrow-trend-up"></i> +18% vs last
            </p>
          </div> */}
        </div>

        {/* <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-semibold text-slate-800">
              Active shipments
            </h3>

            <button className="text-[12px] text-blue-600 hover:text-blue-700 transition-all">
              See all
            </button>
          </div>

          <div className="space-y-3">
            {shipments.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-start justify-between"
              >
                <div>
                  <p className="text-[13px] font-semibold text-slate-800">
                    {item.id}
                  </p>
                  <p className="text-[12px] text-slate-600 mt-1">
                    {item.route}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {item.agent} {item.time}
                  </p>
                </div>
                <span
                  className={`px-3 h-[24px] rounded-full text-[11px] font-semibold flex items-center ${item.statusColor}`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-5 pb-10">
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <i className="fa-regular fa-bell text-[12px] text-slate-500"></i>
              <h4 className="text-[13px] font-semibold text-slate-800">
                Recent notifications
              </h4>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-[12px] font-semibold text-slate-700">
                  #SHP-001 is now in transit
                </p>
                <p className="text-[11px] text-slate-400 mt-1">10 min ago</p>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-slate-700">
                  Agent assigned to #SHP-002
                </p>
                <p className="text-[11px] text-slate-400 mt-1">1 hr ago</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <i className="fa-regular fa-credit-card text-[12px] text-slate-500"></i>
              <h4 className="text-[13px] font-semibold text-slate-800">
                Recent payments
              </h4>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-semibold text-slate-700">
                    #SHP-001
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">₹620</p>
                </div>
                <span className="px-2 h-[22px] rounded-full bg-green-100 text-green-700 text-[10px] font-semibold flex items-center">
                  Paid
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-semibold text-slate-700">
                    #SHP-002
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">₹880</p>
                </div>
                <span className="px-2 h-[22px] rounded-full bg-green-100 text-green-700 text-[10px] font-semibold flex items-center">
                  Paid
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-semibold text-slate-700">
                    #SHP-003
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">₹450</p>
                </div>

                <span className="px-2 h-[22px] rounded-full bg-amber-100 text-amber-700 text-[10px] font-semibold flex items-center">
                  Pending
                </span>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default AdminDashboard;
