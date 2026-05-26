import { FaBox, FaClock, FaStar, FaCalendarAlt } from "react-icons/fa";

interface Props {
  total: number;
}

const DeliveryStats = ({ total }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div className="rounded-2xl border border-white/40 bg-white/70 p-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">TOTAL DELIVERED</p>
            <h2 className="text-3xl font-bold">{total}</h2>
          </div>
          <div className="rounded-xl bg-green-100 p-3 text-green-600">
            <FaBox />
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-white/40 bg-white/70 p-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">ON-TIME RATE</p>
            <h2 className="text-3xl font-bold">95%</h2>
          </div>
          <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
            <FaClock />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/40 bg-white/70 p-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">AVG RATING</p>
            <h2 className="text-3xl font-bold">4.8</h2>
          </div>
          <div className="rounded-xl bg-yellow-100 p-3 text-yellow-600">
            <FaStar />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/40 bg-white/70 p-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">THIS MONTH</p>
            <h2 className="text-3xl font-bold">18</h2>
          </div>
          <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
            <FaCalendarAlt />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryStats;
