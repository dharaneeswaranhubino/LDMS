import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../shared/hooks/reduxHooks";
import { logoutUser } from "../../auth/authSlice";

const ProfileDropdown = () => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profile");
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* PROFILE BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none"
      >
        <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-[13px] font-semibold">
          {user?.name ? getInitials(user.name) : "U"}
        </div>
      </button>

      {/* DROPDOWN */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-[0_4px_20px_rgba(15,23,42,0.08)] overflow-hidden z-50">
          {/* TOP */}
          <div className="px-4 py-4 border-b border-slate-100">
            <p className="text-[14px] font-semibold text-slate-800">
              {user?.name}
            </p>

            <p className="text-[12px] text-slate-500 mt-1">
              {user?.email ? user.email : "user@email.com"}
            </p>

            <div className="mt-3">
              <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-[11px] font-medium">
                {user?.role ? user.role : "Customer"}
              </span>
            </div>
          </div>

          {/* MENU */}
          <div className="py-2">
            <button
              onClick={handleProfile}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-slate-700 hover:bg-slate-50 transition-all"
            >
              <i className="fa-regular fa-user text-[13px]"></i>
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-600 hover:bg-red-50 transition-all"
            >
              <i className="fa-solid fa-arrow-right-from-bracket text-[13px]"></i>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
