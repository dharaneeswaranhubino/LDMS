import airFreight from "../../../assets/airFreight_img.jfif";
import oceanFreight from "../../../assets/oceanFreight.jfif";
import truckDelivery from "../../../assets/truckDelivery.jfif";
import warehousing from "../../../assets/warehousing.jfif";
import supplyChain from "../../../assets/supplyChain.jfif";
import liveTracking from "../../../assets/liveTracking.jfif";
import { useState } from "react";
import { GiCheckMark } from "react-icons/gi";

interface Service {
  bgImg: string;
  title: string;
  desc: string;
  details: string;
  features: string[];
}

const ServicesSection = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const services = [
    {
      bgImg: airFreight,
      title: "Air Freight",
      desc: "Fast and secure international air cargo solutions.",
      details:
        "Our air freight service ensures rapid global delivery with priority handling, customs support, and real-time shipment visibility for time-sensitive cargo.",
      features: [
        "Express Delivery",
        "Global Coverage",
        "Customs Assistance",
        "Real-Time Tracking",
      ],
    },
    {
      bgImg: oceanFreight,
      title: "Ocean Freight",
      desc: "Global container shipping with reliable tracking.",
      details:
        "We provide cost-effective ocean freight solutions with worldwide port connectivity, container tracking, and flexible shipping options for businesses of all sizes.",
      features: [
        "FCL & LCL Shipping",
        "Worldwide Port Network",
        "Container Tracking",
        "Cost-Effective Transport",
      ],
    },
    {
      bgImg: truckDelivery,
      title: "Truck Delivery",
      desc: "Efficient road transportation across regions.",
      details:
        "Our road freight services offer dependable transportation with optimized routes, professional drivers, and timely delivery across cities and regions.",
      features: [
        "Door-to-Door Delivery",
        "Regional Coverage",
        "Fleet Management",
        "Scheduled Dispatches",
      ],
    },
    {
      bgImg: warehousing,
      title: "Warehousing",
      desc: "Modern warehouse management and storage systems.",
      details:
        "Secure and scalable warehousing facilities designed to support inventory management, order fulfillment, and distribution operations.",
      features: [
        "Secure Storage",
        "Inventory Management",
        "Order Fulfillment",
        "24/7 Monitoring",
      ],
    },
    {
      bgImg: supplyChain,
      title: "Supply Chain",
      desc: "End-to-end logistics and inventory optimization.",
      details:
        "Streamline your logistics operations with end-to-end supply chain solutions that improve efficiency, reduce costs, and increase visibility.",
      features: [
        "Inventory Optimization",
        "Demand Planning",
        "Operational Visibility",
        "Cost Reduction",
      ],
    },
    {
      bgImg: liveTracking,
      title: "Live Tracking",
      desc: "Track shipments in real-time with smart updates.",
      details:
        "Stay informed throughout the delivery journey with live shipment tracking, status notifications, and location updates in real time.",
      features: [
        "Real-Time Updates",
        "GPS Location Tracking",
        "Delivery Notifications",
        "Shipment Visibility",
      ],
    },
  ];

  return (
    <section id="services" className="py-28 bg-[#080c14]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="uppercase tracking-[4px] text-indigo-400 text-sm font-semibold">
            Our Services
          </span>

          <h2 className="mt-5 text-2xl md:text-4xl font-extrabold text-white leading-tight">
            Logistics Solutions
            <br />
            <span className="bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              Built For Scale
            </span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              onClick={() => setSelectedService(service)}
              className="group relative overflow-hidden rounded-3xl border border-white/10 hover:border-indigo-500/40 transition duration-500 cursor-pointer"
            >
              <img
                src={service.bgImg}
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition duration-500" />
              <div className="relative p-8 z-10 min-h-[320px] flex flex-col justify-end">
                <h3 className="text-3xl font-black text-white mb-4">
                  {service.title}
                </h3>
                <p className="text-slate-200 leading-7">
                  {service.desc}

                  {/* <span className="ml-2 text-indigo-300 font-semibold">
                    Learn More →
                  </span> */}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="relative bg-[#101826] rounded-3xl overflow-y-auto scrollbar-none max-h-[90vh] max-w-3xl w-full border border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.15)] animate-[fadeIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white text-2xl flex items-center justify-center transition"
            >
              <i className="fa-solid fa-x"></i>
            </button>

            <div className="relative h-72 overflow-hidden">
              <img
                src={selectedService.bgImg}
                alt={selectedService.title}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#101826] via-black/30 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h2 className="text-4xl md:text-5xl font-black text-white">
                  {selectedService.title}
                </h2>

                <p className="mt-2 text-slate-300">{selectedService.desc}</p>
              </div>
            </div>

            <div className="p-8 md:p-10">
              <h3 className="text-xl font-bold text-white mb-4">
                Service Overview
              </h3>

              <p className="text-slate-300 leading-8 mb-8">
                {selectedService.details}
              </p>

              <h3 className="text-xl font-bold text-white mb-5">
                Key Features
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                {selectedService.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold">
                      <GiCheckMark />
                    </div>

                    <span className="text-slate-200">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex justify-end">
                <button
                  onClick={() => setSelectedService(null)}
                  className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServicesSection;
