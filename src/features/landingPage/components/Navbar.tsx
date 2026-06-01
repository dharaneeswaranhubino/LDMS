import { Link } from "react-router-dom";
import { useAppSelector } from "../../../shared/hooks/reduxHooks";
import { FaArrowRightLong } from "react-icons/fa6";

interface NavbarProps {
  scrollY: number;
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar = ({ scrollY, menuOpen, setMenuOpen }: NavbarProps) => {
  const navItems = [
    {
      label: "Home",
      href: "#home",
    },
    {
      label: "Services",
      href: "#services",
    },
    {
      label: "Solutions",
      href: "#solutions",
    },
    {
      label: "Contact",
      href: "#contact",
    },
  ];
  const { user } = useAppSelector((state) => state.auth);
  // console.log(user);
  
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 50
          ? "bg-[#080c14]/90 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto h-[80px] px-6 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-sky-400 flex items-center justify-center">
            <i className="fa-solid fa-truck-fast text-white text-[18px] relative z-10"></i>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">LDMS</h2>
            <p className="text-xs text-slate-400">Smart Logistics</p>
          </div>
        </a>

        <div className="hidden lg:flex items-center gap-10">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-300 hover:text-white transition duration-300"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          {!user?.name
          ?(<Link
            to="/login"
            className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:scale-105 transition duration-300"
          >
            Login <FaArrowRightLong />
            {/* Login <i className="fa-solid fa-arrow-right"></i> */}
          </Link>)
          :(<Link
            to="/login"
            className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:scale-105 transition duration-300"
          >
            Dashboard <FaArrowRightLong />
          </Link>)
          }
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-white text-3xl"
        >
          {menuOpen ? <i className="fa-solid fa-x"></i> : <i className="fa-solid fa-bars"></i>}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
