import { useState } from "react";
import { useAppSelector } from "../../../shared/hooks/reduxHooks";
import ProfileForm from "../Components/ProfileForm";
import ChangePasswordForm from "../Components/ChangePasswordForm";
import ProfileView from "../Components/ProfileView";

type Tab = "info" | "password";

const ProfilePage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("info");

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-[13px]">Loading profile...</p>
      </div>
    );
  }

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const handleTabSwitch = (tab: Tab) => {
    setActiveTab(tab);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-lg">

        <div className="bg-gradient-to-r from-blue-700 to-cyan-500 px-8 py-8 relative">
          <div>
            <h1 className="text-2xl font-bold text-white">My Profile</h1>
            <p className="text-blue-100 text-sm mt-1">Manage your account information</p>
          </div>
          {activeTab === "info" && (
            <button
              onClick={() => setIsEditing((prev) => !prev)}
              title={isEditing ? "Cancel editing" : "Edit Profile"}
              className="absolute top-6 right-6 w-9 h-9 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl flex items-center justify-center text-white transition"
            >
              <i className={`fa-solid ${isEditing ? "fa-xmark" : "fa-pen-to-square"} text-[14px]`} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-5 px-8 py-5 border-b border-gray-100">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {getInitials(user.name)}
          </div>
          <div>
            <h2 className="text-[16px] font-semibold text-gray-800">{user.name}</h2>
            <p className="text-[13px] text-gray-500 mt-0.5">{user.email}</p>
            <span className="inline-block mt-2 text-[11px] bg-violet-100 text-violet-700 px-2.5 py-0.5 rounded-full font-medium">
              {user.role}
            </span>
          </div>
        </div>

        <div className="flex border-b border-gray-100 px-8">
          <button
            onClick={() => handleTabSwitch("info")}
            className={`flex items-center gap-1.5 text-[13px] font-semibold py-3 mr-6 border-b-2 transition-colors ${
              activeTab === "info"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            <i className="fa-regular fa-user text-[12px]" />
            Profile Info
          </button>
          <button
            onClick={() => handleTabSwitch("password")}
            className={`flex items-center gap-1.5 text-[13px] font-semibold py-3 border-b-2 transition-colors ${
              activeTab === "password"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            <i className="fa-solid fa-lock text-[12px]" />
            Change Password
          </button>
        </div>

        <div className="px-8 py-6">
          {activeTab === "info" && (
            <>
              {isEditing ? (
                <ProfileForm onCancel={() => setIsEditing(false)} />
              ) : (
                <ProfileView user={user} />
              )}
            </>
          )}

          {activeTab === "password" && <ChangePasswordForm />}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;