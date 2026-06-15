import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "../../../../shared/components/Toast";

interface OtpVerificationModalProps {
  onClose: () => void;
  onVerified: () => void;
}

const OtpVerificationModal = ({
  onClose,
  onVerified,
}: OtpVerificationModalProps) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpEnabled, setOtpEnabled] = useState(false); // dummy toggle
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const isOtpComplete = otp.every((d) => d !== "");

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-modal-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-modal-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    const lastIndex = Math.min(pasted.length, 5);
    document.getElementById(`otp-modal-${lastIndex}`)?.focus();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleVerify = () => {
    if (!otpEnabled) {
      showToast({ type: "warning", message: "Enable OTP verification first" });
      return;
    }
    if (!isOtpComplete) {
      showToast({ type: "warning", message: "Please enter the complete OTP" });
      return;
    }
    showToast({ type: "success", message: "OTP verified successfully" });
    onVerified();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(6px)" }}
        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.3, y: 120, rotateY: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 80 }}
          transition={{ type: "spring", stiffness: 180, damping: 12, mass: 0.7 }}
          className="w-full max-w-md rounded-3xl bg-white/90 backdrop-blur-xl p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-[16px] font-semibold text-slate-700">
                Proof of Delivery
              </h2>
              <p className="text-[12px] text-slate-400 mt-0.5">
                Verify delivery securely using OTP confirmation
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-slate-400 transition hover:text-red-500"
            >
              <i className="fa-solid fa-xmark text-lg" />
            </motion.button>
          </div>

          <div className="h-px bg-slate-100 my-4" />

          <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 mb-5">
            <div>
              <p className="text-[13px] font-medium text-slate-700">
                OTP Verification
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {otpEnabled
                  ? "Enter the OTP sent to customer"
                  : "Toggle to enable OTP input"}
              </p>
            </div>

            <button
              onClick={() => {
                setOtpEnabled((prev) => !prev);
                if (otpEnabled) setOtp(["", "", "", "", "", ""]);
              }}
              className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
                otpEnabled ? "bg-indigo-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
                  otpEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mb-5">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-modal-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                disabled={!otpEnabled}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={`w-11 h-13 rounded-2xl border-2 text-center text-xl font-bold text-slate-800 outline-none transition-all duration-200
                  ${
                    otpEnabled
                      ? "border-indigo-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                      : "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                  }`}
              />
            ))}
          </div>

          <div className="mb-5">
            <p className="text-[12px] font-medium text-slate-600 mb-2">
              Delivery Photo{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </p>

            {photoPreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-indigo-200">
                <img
                  src={photoPreview}
                  alt="delivery proof"
                  className="w-full h-40 object-cover"
                />
                <button
                  onClick={removePhoto}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                >
                  <i className="fa-solid fa-xmark text-xs" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">
                  {photoFile?.name}
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 py-6 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-all">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <i className="fa-solid fa-camera text-indigo-400 text-lg" />
                </div>
                <p className="text-[12px] font-medium text-indigo-500">
                  Upload Delivery Photo
                </p>
                <p className="text-[11px] text-slate-400">
                  Tap to attach proof image
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>
            )}
          </div>

          <motion.button
            whileHover={otpEnabled && isOtpComplete ? { scale: 1.01 } : {}}
            whileTap={otpEnabled && isOtpComplete ? { scale: 0.98 } : {}}
            onClick={handleVerify}
            disabled={!otpEnabled || !isOtpComplete}
            className={`w-full rounded-2xl py-3 font-semibold text-white shadow-lg transition-all duration-300 ${
              otpEnabled && isOtpComplete
                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                : "bg-slate-300 cursor-not-allowed"
            }`}
          >
            {!otpEnabled
              ? "Enable OTP to verify"
              : !isOtpComplete
                ? "Enter complete OTP"
                : "Verify OTP"}
          </motion.button>

          <p className="text-center text-[11px] text-slate-400 mt-3">
            OTP integration coming soon — use toggle to simulate verification
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OtpVerificationModal;