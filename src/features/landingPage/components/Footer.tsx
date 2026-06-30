const Footer = () => {
  return (
    <footer id="contact" className="bg-[#060a10] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-20 grid gap-12 md:grid-cols-4">
        <div>
          <a href="#home" className="flex items-center gap-3">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-sky-400 flex items-center justify-center">
                <i className="fa-solid fa-truck-fast text-white text-[18px] relative z-10"></i>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">SmartShip</h2>
                <p className="text-xs text-slate-400">Smart Logistics</p>
              </div>
            </div>
          </a>
          <p className="text-slate-500 leading-7">
            Modern logistics and supply chain solutions for businesses
            worldwide.
          </p>
        </div>

        <div>
          <h3 className="text-white font-bold mb-5">Services</h3>
          <div className="flex flex-col gap-3 text-slate-400">
            <a>Air Freight</a>
            <a>Ocean Freight</a>
            <a>Warehousing</a>
            <a>Truck Delivery</a>
          </div>
        </div>

        <div>
          <h3 className="text-white font-bold mb-5">Company</h3>
          <div className="flex flex-col gap-3 text-slate-400">
            <a>About Us</a>
            <a>Careers</a>
            <a>Solutions</a>
            <a>Contact</a>
          </div>
        </div>

        <div>
          <h3 className="text-white font-bold mb-5">Contact</h3>
          <div className="flex flex-col gap-4 text-slate-400">
            <p>
              <i className="fa-solid fa-location-dot text-emerald-400 text-xl"></i>{" "}
              Chennai, India
            </p>
            <p>
              <i className="fa-solid fa-phone text-sky-600 text-xl"></i> +91
              98765 43210
            </p>
            <p>
              <i className="fa-solid fa-envelope text-sky-400 text-lg"></i>{" "}
              support@supplylink.com
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-wrap gap-4 justify-end text-sm text-slate-500">
          <p>© 2026 SmartShip Supply Link. All rights reserved.</p>
          {/* <div className="flex gap-6">
            <a>Privacy</a>
            <a>Terms</a>
            <a>Cookies</a>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
