import airFreight from "../../../assets/airFreight_img.jfif";
import oceanFreight from "../../../assets/oceanFreight.jfif";
import truckDelivery from "../../../assets/truckDelivery.jfif";
import warehousing from "../../../assets/warehousing.jfif"
import supplyChain from "../../../assets/supplyChain.jfif"
import liveTracking from "../../../assets/liveTracking.jfif"

const ServicesSection = () => {
  const services = [
    {
      bgImg: airFreight,
      title: "Air Freight",
      desc: "Fast and secure international air cargo solutions.",
    },
    {
      bgImg: oceanFreight,
      title: "Ocean Freight",
      desc: "Global container shipping with reliable tracking.",
    },
    {
      bgImg: truckDelivery,
      title: "Truck Delivery",
      desc: "Efficient road transportation across regions.",
    },
    {
      bgImg: warehousing,
      title: "Warehousing",
      desc: "Modern warehouse management and storage systems.",
    },
    {
      bgImg: supplyChain,
      title: "Supply Chain",
      desc: "End-to-end logistics and inventory optimization.",
    },
    {
      bgImg: liveTracking,
      title: "Live Tracking",
      desc: "Track shipments in real-time with smart updates.",
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
              className="group relative overflow-hidden rounded-3xl border border-white/10 hover:border-indigo-500/40 transition duration-500"
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
                <p className="text-slate-200 leading-7">{service.desc}</p>
                {/* <button className="mt-6 text-indigo-300 font-semibold">
                  Learn More →
                </button> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
