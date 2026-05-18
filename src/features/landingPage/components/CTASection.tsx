import ctaScreenBg from "../../../assets/CTAScreen_bg_img.png";

const CTASection = () => {
  return (
    <section id="solutions" className="py-28 px-6 bg-[#0d1220]">
      <div className="relative overflow-hidden max-w-6xl mx-auto rounded-[40px] border border-indigo-500/20 from-indigo-500/20 to-cyan-500/10 p-12 md:p-20 text-center">
        <img
          src={ctaScreenBg}
          alt="CTAScreenBgImg"
          className="absolute inset-0 w-full h-full object-cover brightness-64"
        />
        <div className="relative z-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-600 leading-tight">
            Ready To Upgrade
            <br />
            <span className="bg-gradient-to-r from-indigo-500 to-cyan-300 bg-clip-text text-transparent">
              Your Logistics?
            </span>
          </h2>

          <p className="mt-6 text-slate-200 max-w-2xl mx-auto text-lg leading-8">
            Build faster supply chains with modern logistics operations and
            global shipment management.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-5">
            <a
              href="/register"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-700 text-slate-300 font-semibold shadow-xl shadow-indigo-500/30 hover:scale-105 transition"
            >
              Get Started <i className="fa-solid fa-arrow-right"></i>
            </a>

            <a
              href="#contact"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-700 text-slate-300 font-semibold shadow-xl shadow-indigo-500/30 hover:scale-105 transition"
            >
              Talk To Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
