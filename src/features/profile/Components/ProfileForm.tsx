import { useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../shared/hooks/reduxHooks";
// import type { UpdateProfilePayload } from "@/features/auth/authTypes";
import { clearProfileMessages, updateProfile } from "@/features/auth/authSlice";
import { showToast } from "@/shared/components/Toast";

interface Props {
  onCancel: () => void;
}

const ProfileForm = ({ onCancel }: Props) => {
  const dispatch = useAppDispatch();
  const {
    user,
    updateProfileLoading,
    updateProfileError,
    // updateProfileSuccess,
  } = useAppSelector((state) => state.auth);

  const [name, setName] = useState(user?.name ?? "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? "");
  const [validationError, setValidationError] = useState("");

  const handleSave = async () => {
    setValidationError("");
    if (!name.trim()) {
      setValidationError("Name cannot be empty");
      return;
    }
    if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
      setValidationError("Phone number must be 10 digits");
      return;
    }

    const result = await dispatch(
      updateProfile({ name: name.trim(), phoneNumber: phoneNumber.trim() }),
    );
    if (updateProfile.fulfilled.match(result)) {
      showToast({ type: "success", message: "Profile updated successfully" });
      dispatch(clearProfileMessages());
      onCancel();
    }
  };

  const handleCancel = () => {
    dispatch(clearProfileMessages());
    onCancel();
  };

  const displayError = validationError || updateProfileError;

  return (
    <div>
      <p className="text-[14px] font-semibold text-gray-800 mb-4">
        Edit Profile
      </p>

      {displayError && (
        <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-50 border border-red-100 text-[13px] text-red-600 flex items-center gap-2">
          <i className="fa-solid fa-circle-exclamation text-[13px]" />
          {displayError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div>
          <label className="block text-[12px] font-medium text-gray-600 mb-1">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-3 py-2 text-[13px] rounded-lg border border-slate-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
          />
        </div>

        <div>
          <label className="block text-[12px] font-medium text-gray-600 mb-1">
            Email Address
          </label>
          <div className="w-full px-3 py-2 text-[13px] rounded-lg border border-slate-100 bg-gray-50 text-gray-400 flex items-center justify-between">
            <span>{user?.email}</span>
            <span className="text-[10px] text-gray-300 font-medium">
              read only
            </span>
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-medium text-gray-600 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="9876543210"
            maxLength={10}
            className="w-full px-3 py-2 text-[13px] rounded-lg border border-slate-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={updateProfileLoading}
          className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {updateProfileLoading ? (
            <>
              <i className="fa-solid fa-circle-notch animate-spin text-[12px]" />
              Saving...
            </>
          ) : (
            <>
              <i className="fa-solid fa-check text-[12px]" />
              Save changes
            </>
          )}
        </button>
        <button
          onClick={handleCancel}
          disabled={updateProfileLoading}
          className="px-4 py-2 rounded-lg border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ProfileForm;
