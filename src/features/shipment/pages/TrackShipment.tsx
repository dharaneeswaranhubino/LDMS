import {
  Check,
  Truck,
  MapPin,
  CircleCheck,
  CreditCard,
  UserCheck,
  PackageCheck,
} from "lucide-react";

type StepStatus = "done" | "active" | "pending";

interface TimelineStep {
  id: string;
  label: string;
  time: string;
  status: StepStatus;
  note?: string;
  icon: React.ReactNode;
}

const timelineSteps: TimelineStep[] = [
  {
    id: "created",
    label: "Shipment created",
    time: "9:00 AM",
    status: "done",
    icon: <PackageCheck size={13} />,
  },
  {
    id: "payment",
    label: "Payment confirmed",
    time: "9:15 AM",
    status: "done",
    note: "₹620 paid via UPI",
    icon: <CreditCard size={13} />,
  },
  {
    id: "assigned",
    label: "Agent assigned",
    time: "9:30 AM",
    status: "done",
    note: "Rajesh Kumar · Slot 10–11 AM",
    icon: <UserCheck size={13} />,
  },
  {
    id: "started",
    label: "Delivery started",
    time: "10:05 AM",
    status: "done",
    icon: <Check size={13} />,
  },
  {
    id: "pickup",
    label: "Pickup reached",
    time: "10:18 AM",
    status: "done",
    icon: <Check size={13} />,
  },
  {
    id: "enroute",
    label: "En route",
    time: "Now",
    status: "active",
    note: "Package picked up — heading to you",
    icon: <Truck size={13} />,
  },
  {
    id: "near",
    label: "Near location",
    time: "Pending",
    status: "pending",
    icon: <MapPin size={13} />,
  },
  {
    id: "delivered",
    label: "Delivered",
    time: "Pending",
    status: "pending",
    icon: <CircleCheck size={13} />,
  },
];

const TimelineStep: React.FC<{
  step: TimelineStep;
  isLast: boolean;
}> = ({ step, isLast }) => {
  const isDone    = step.status === "done";
  const isActive  = step.status === "active";
  const isPending = step.status === "pending";

  return (
    <div className="relative flex flex-1 flex-col items-center">
      {/* Connector line */}
      {!isLast && (
        <div
          className={`absolute top-[15px] left-1/2 h-0.5 w-full z-0 ${
            isDone ? "bg-green-600" : "bg-gray-300"
          }`}
        />
      )}

      {/* Icon circle */}
      <div
        className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
          isDone
            ? "border-green-600 bg-green-950 text-green-400"
            : isActive
            ? "border-blue-400 bg-white text-blue-400"
            : "border-gray-300 bg-white text-gray-400"
        }`}
      >
        {step.icon}
      </div>

      {/* Label */}
      <div className="mt-2 px-1 text-center">
        <p
          className={`text-[11px] font-medium leading-tight ${
            isPending
              ? "text-gray-400"
              : isActive
              ? "text-blue-500"
              : "text-slate-700"
          }`}
        >
          {step.label}
        </p>
        <p
          className={`mt-0.5 text-[11px] ${
            isActive
              ? "text-blue-400"
              : isPending
              ? "text-gray-400"
              : "text-gray-500"
          }`}
        >
          {step.time}
        </p>
      </div>

      {/* Active tooltip note */}
      {isActive && step.note && (
        <div className="absolute top-[52px] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-[11px] text-slate-600 shadow-sm">
          {step.note}
        </div>
      )}
    </div>
  );
};

const TrackShipment = () => {
//   const navigate = useNavigate();

//   const sendShipment = async () => {
//     navigate("/sendShipment");
//   };

//   const handleFilter = () => {};

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  return (
    <>
      <div className="h-[calc(100vh-72px)] overflow-y-auto scrollbar-none bg-gradient-to-br from-slate-50 via-sky-50 to-purple-50 p-5 mt-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-slate-200 bg-white rounded-lg h-10 px-3 text-[18px] outline-none hover:border-violet-400 shadow-sm">
            <i className="fa-solid fa-arrow-left"></i>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">
              Track shipment — #SHP-001
            </h1>

            <p className="text-[14px] text-slate-500">
              MG Road, Bangalore → Indiranagar, Bangalore
            </p>
          </div>
        </div>

        <div className="w-full flex justify-between py-2 px-4 gap-2 mt-3 bg-[#e7f1fb] rounded-lg border border-[#b5d3f5] shadow-sm">
          <div className="flex justify-center items-center gap-3">
            <span className="flex items-center border border-[#b5d3f5] bg-[#b5d3f5] rounded-[50%] h-12 px-3 text-[#376a9c] outline-none hover:border-violet-400 shadow-sm">
              <i className="fa-regular fa-truck"></i>
            </span>
            <div>
              <p className="text-[#0f4378]">Your shipment is in transit</p>
              <p className="text-[#4c78a1]">
                Agent Rajesh Kumar is on the way to deliver your package
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[#4c78a1]">Estimated arrival</p>
            <p className="text-[#0f4378]">~25 min</p>
            <p className="text-[#4c78a1]">Slot: 10:00 – 11:00 AM</p>
          </div>
        </div>

        <div className="w-full flex items-center text-violet-900 py-3 px-4 gap-2 mt-3 bg-violet-100 rounded-lg border border-violet-200 shadow-sm">
          <i className="fa-regular fa-calendar"></i>
          <p className=" text-[14px]">
            Assigned slot: Today, 10:00 AM – 11:00 AM · Booked: 12 Jan 2025 ·
            Priority: SAME_DAY · Weight: 2.5 kg
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-5 pb-10 text-slate-600">
          <div className="bg-gray-100 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <i className="fa-regular fa-map text-[12px] text-slate-500"></i>
              <h4 className="text-[13px] font-semibold text-slate-800">
                Route details
              </h4>
            </div>

            <div className="flex justify-between items-center gap-3 mb-3 bg-gray-200 py-2 px-4 rounded-lg border border-gray-300 shadow-sm">
              <div>
                <p className="text-slate-500">Pickup</p>
                <p>No. 12, MG Road Bangalore – 560001</p>
              </div>
              <i className="fa-solid fa-arrow-right text-slate-400"></i>
              <div className="text-right">
                <p className="text-slate-500">Delivery</p>
                <p>No. 45, Indiranagar Bangalore – 560038</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 justify-center">
              <div>
                <p>Shipment ID</p>
                <p>#SHP-001</p>
              </div>
              <div>
                <p>Payment</p>
                <p>Paid — ₹620</p>
              </div>
              <div>
                <p>Package</p>
                <p>2.5 kg · Fragile</p>
              </div>
              <div>
                <p>Description</p>
                <p>Electronics</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 flex flex-col justify-between border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <i className="fa-regular fa-user text-[12px] text-slate-500"></i>
              <h4 className="text-[13px] font-semibold text-slate-800">
                Your delivery agen
              </h4>
            </div>

            <div className="w-full flex gap-2 mt-3 ">
              <div className="flex justify-center items-center gap-3">
                <div className="flex items-center border border-gray-300 bg-gray-200 rounded-[50%] h-11 px-3 text-[#376a9c] outline-none hover:border-gray-400 shadow-sm">
                  {getInitials("Rajesh Kumar")}
                </div>
                <div>
                  <p>Rajesh Kumar</p>
                  <p className="text-[14px] text-gray-600">
                    Delivery agent · ID #AGT-012
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between my-3">
              <div className="bg-gray-300 py-2 px-8 rounded-lg text-center">
                <p>245</p>
                <p className="text-gray-600">Deliveries</p>
              </div>
              <div className="bg-gray-300 py-2 px-8 rounded-lg text-center">
                <p>95%</p>
                <p className="text-gray-600">On time</p>
              </div>
              <div className="bg-gray-300 py-2 px-8 rounded-lg text-center">
                <p>4.8</p>
                <p className="text-gray-600">Rating</p>
              </div>
            </div>

            <div className="bg-gray-200 py-2 px-8 rounded-lg text-center border-2 border-gray-300 hover:border-gray-500">
              <button>
                <i className="fa-regular fa-comment"></i>Send message
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 flex flex-col justify-between border border-slate-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <i className="fa-solid fa-list-check text-[12px] text-slate-500"></i>
            <h4 className="text-[13px] font-semibold text-slate-800">
              Delivery timeline
            </h4>
          </div>
          <div>
            <div className="bg-gray-100 flex flex-col justify-between border border-slate-200 rounded-2xl p-4 mb-10">
              <div className="flex items-center gap-2 mb-6">
                <i className="fa-solid fa-list-check text-[12px] text-slate-500"></i>
                <h4 className="text-[13px] font-semibold text-slate-800">
                  Delivery timeline
                </h4>
              </div>

              <div className="overflow-x-auto pb-10">
                <div className="flex items-start min-w-[680px]">
                  {timelineSteps.map((step, i) => (
                    <TimelineStep
                      key={step.id}
                      step={step}
                      isLast={i === timelineSteps.length - 1}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrackShipment;
