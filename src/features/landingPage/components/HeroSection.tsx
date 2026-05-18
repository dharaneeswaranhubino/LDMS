import Banner from "../../../assets/main_banner_img.png";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      <img
        src={Banner}
        alt="Logistics Banner"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080c14] via-[#080c14]/70 to-transparent" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 min-h-screen flex items-center">
        <div className="max-w-3xl">
          <h1 className="text-2xl mt-20 md:text-4xl mt-10 font-extrabold leading-tight text-white">
            Smart Logistics
            <br />
            <span className="bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              For Modern
            </span>
            <br />
            Supply Chains
          </h1>

          <p className="mt-8 text-lg md:text-xl text-slate-300 leading-8 max-w-2xl">
            Real-time tracking, global delivery, warehouse operations and modern
            logistics management for growing businesses.
          </p>

          <div className="mt-10 flex flex-wrap gap-5">
            <a
              href="#services"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold shadow-2xl shadow-indigo-500/30 hover:scale-105 transition duration-300"
            >
              Explore Services →
            </a>

            <a
              href="#contact"
              className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-white hover:bg-white/10 transition"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
