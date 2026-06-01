import { Link } from "react-router-dom";
import { useAppSelector } from "../../../shared/hooks/reduxHooks";
import { FaArrowRightLong } from "react-icons/fa6";

interface MobileMenuProps {
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileMenu = ({ setMenuOpen }: MobileMenuProps) => {
  const links = [
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

  return (
    <div className="fixed top-[80px] left-0 right-0 z-40 bg-[#080c14]/95 backdrop-blur-2xl border-b border-white/10 lg:hidden">
      <div className="flex flex-col p-6 gap-1">
        {links.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={() => setMenuOpen(false)}
            className="text-slate-300 py-2 px-3 rounded-lg text-lg hover:text-white transition hover:bg-gray-800"
          >
            {item.label}
          </a>
        ))}

        {!user?.name ? (
          <Link
            to="/login"
            className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:scale-105 transition duration-300"
          >
            Login <FaArrowRightLong />
          </Link>
        ) : (
          <Link
            to="/customerDashboard"
            className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:scale-105 transition duration-300"
          >
            Dashboard <FaArrowRightLong />
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
