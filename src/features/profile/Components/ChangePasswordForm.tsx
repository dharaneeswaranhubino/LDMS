import { useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../shared/hooks/reduxHooks";
import {
  changePassword,
  clearProfileMessages,
} from "@/features/auth/authSlice";
// import { changePassword, clearProfileMessages } from "../../../features/auth/authSlice";

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  show: boolean;
  onToggle: () => void;
}
const PasswordInput = ({
  id,
  value,
  onChange,
  placeholder,
  show,
  onToggle,
}: PasswordInputProps) => (
  <div className="relative">
    <input
      id={id}
      type={show ? "text" : "password"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 pr-10 text-[13px] rounded-lg border border-slate-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
    />
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
    >
      <i
        className={`fa-solid ${show ? "fa-eye-slash" : "fa-eye"} text-[12px]`}
      />
    </button>
  </div>
);

const ChangePasswordForm = () => {
  const dispatch = useAppDispatch();
  const { changePasswordLoading, changePasswordError, changePasswordSuccess } =
    useAppSelector((state) => state.auth);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async () => {
    setValidationError("");
    dispatch(clearProfileMessages());

    if (!currentPassword || !newPassword || !confirmPassword) {
      setValidationError("All fields are required");
      return;
    }
    if (newPassword.length < 6) {
      setValidationError("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setValidationError("New passwords do not match");
      return;
    }
    if (currentPassword === newPassword) {
      setValidationError(
        "New password must be different from current password",
      );
      return;
    }

    const result = await dispatch(
      changePassword({ currentPassword, newPassword }),
    );
    if (changePassword.fulfilled.match(result)) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => dispatch(clearProfileMessages()), 3000);
    }
  };

  const displayError = validationError || changePasswordError;

  return (
    <div>
      <p className="text-[14px] font-semibold text-gray-800 mb-4">
        Change Password
      </p>

      {/* Toast */}
      {displayError && (
        <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-50 border border-red-100 text-[13px] text-red-600 flex items-center gap-2">
          <i className="fa-solid fa-circle-exclamation text-[13px]" />
          {displayError}
        </div>
      )}
      {changePasswordSuccess && (
        <div className="mb-4 px-4 py-2.5 rounded-lg bg-green-50 border border-green-100 text-[13px] text-green-600 flex items-center gap-2">
          <i className="fa-solid fa-circle-check text-[13px]" />
          {changePasswordSuccess}
        </div>
      )}

      <div className="flex flex-col gap-4 max-w-sm">
        <div>
          <label className="block text-[12px] font-medium text-gray-600 mb-1">
            Current Password
          </label>
          <PasswordInput
            id="cur-pw"
            value={currentPassword}
            onChange={setCurrentPassword}
            placeholder="Enter current password"
            show={showCurrent}
            onToggle={() => setShowCurrent((p) => !p)}
          />
        </div>

        <div>
          <label className="block text-[12px] font-medium text-gray-600 mb-1">
            New Password
          </label>
          <PasswordInput
            id="new-pw"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="Enter new password"
            show={showNew}
            onToggle={() => setShowNew((p) => !p)}
          />
          {newPassword && newPassword.length < 6 && (
            <p className="text-[11px] text-amber-500 mt-1">
              Minimum 6 characters required
            </p>
          )}
        </div>

        <div>
          <label className="block text-[12px] font-medium text-gray-600 mb-1">
            Confirm New Password
          </label>
          <PasswordInput
            id="conf-pw"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Re-enter new password"
            show={showConfirm}
            onToggle={() => setShowConfirm((p) => !p)}
          />
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-[11px] text-red-400 mt-1">
              Passwords do not match
            </p>
          )}
          {confirmPassword &&
            newPassword === confirmPassword &&
            confirmPassword.length >= 6 && (
              <p className="text-[11px] text-green-500 mt-1 flex items-center gap-1">
                <i className="fa-solid fa-check text-[10px]" /> Passwords match
              </p>
            )}
        </div>

        <div>
          <button
            onClick={handleSubmit}
            disabled={changePasswordLoading}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {changePasswordLoading ? (
              <>
                <i className="fa-solid fa-circle-notch animate-spin text-[12px]" />
                Updating...
              </>
            ) : (
              <>
                <i className="fa-solid fa-lock text-[12px]" />
                Update password
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
