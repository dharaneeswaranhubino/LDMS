import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "../../../../shared/components/Toast";
import { useAppDispatch } from "../../../../shared/hooks/reduxHooks";
import { sendDeliveryOtp, verifyDeliveryOtp } from "../../agentSlice";

interface OtpVerificationModalProps {
  onClose: () => void;
  onVerified: () => void;
  shipmentId: number;
}

const OTP_LENGTH = 4;

const formatCountdown = (expiresAt: string): string => {
  const diff = Math.max(
    0,
    Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000),
  );
  const m = Math.floor(diff / 60)
    .toString()
    .padStart(2, "0");
  const s = (diff % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const OtpVerificationModal = ({
  onClose,
  onVerified,
  shipmentId,
}: OtpVerificationModalProps) => {
  const dispatch = useAppDispatch();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [otpSent, setOtpSent] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [otpExpiresAt, setOtpExpiresAt] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<string>("");
  const [expired, setExpired] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isOtpComplete = otp.every((d) => d !== "");

  useEffect(() => {
    if (!otpExpiresAt) return;

    timerRef.current = setInterval(() => {
      const diff = Math.floor(
        (new Date(otpExpiresAt).getTime() - Date.now()) / 1000,
      );
      if (diff <= 0) {
        setCountdown("00:00");
        setExpired(true);
        clearInterval(timerRef.current!);
      } else {
        setExpired(false);
        setCountdown(formatCountdown(otpExpiresAt));
      }
    }, 1000);

    return () => clearInterval(timerRef.current!);
  }, [otpExpiresAt]);

  const handleSendOtp = async () => {
    setSendLoading(true);
    try {
      const res = await dispatch(sendDeliveryOtp(shipmentId)).unwrap();
      setOtpExpiresAt(res.otpExpiresAt);
      setOtpSent(true);
      setOtp(Array(OTP_LENGTH).fill(""));
      setExpired(false);
      showToast({ type: "success", message: "OTP sent to receiver's phone email" });
      setTimeout(() => document.getElementById("otp-modal-0")?.focus(), 100);
    } catch (err: unknown) {
      showToast({
        type: "error",
        message: (err as string) || "Failed to send OTP",
      });
    } finally {
      setSendLoading(false);
    }
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < OTP_LENGTH - 1) {
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
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => {
      if (i < OTP_LENGTH) newOtp[i] = char;
    });
    setOtp(newOtp);
    document
      .getElementById(`otp-modal-${Math.min(pasted.length, OTP_LENGTH - 1)}`)
      ?.focus();
  };

  const handleVerify = async () => {
    if (!isOtpComplete || expired) return;
    setVerifyLoading(true);
    try {
      await dispatch(
        verifyDeliveryOtp({ shipmentId, otp: otp.join("") }),
      ).unwrap();
      showToast({
        type: "success",
        message: "OTP verified! Package marked as delivered.",
      });
      onVerified();
    } catch (err: unknown) {
      showToast({
        type: "error",
        message: (err as string) || "Invalid OTP. Please try again.",
      });
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimeout(() => document.getElementById("otp-modal-0")?.focus(), 100);
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.3, y: 120, rotateY: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 80 }}
          transition={{
            type: "spring",
            stiffness: 180,
            damping: 12,
            mass: 0.7,
          }}
          className="w-full max-w-md rounded-3xl bg-white/90 backdrop-blur-xl p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-[16px] font-semibold text-slate-700">
                Proof of Delivery
              </h2>
              <p className="text-[12px] text-slate-400 mt-0.5">
                Send OTP to customer and verify to confirm delivery
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-slate-400 hover:text-red-500 transition"
            >
              <i className="fa-solid fa-xmark text-lg" />
            </motion.button>
          </div>

          <div className="h-px bg-slate-100 my-4" />

          {/* Send OTP section */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 mb-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className="text-[13px] font-medium text-slate-700">
                  Customer OTP
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {otpSent
                    ? expired
                      ? "OTP expired — resend to try again"
                      : `OTP sent · expires in ${countdown}`
                    : "Tap to send a 6-digit OTP to the customer"}
                </p>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={sendLoading}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold transition-all
                  ${
                    otpSent && !expired
                      ? "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200"
                      : "bg-indigo-500 text-white hover:bg-indigo-600 shadow-sm shadow-indigo-200"
                  }
                  disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {sendLoading ? (
                  <i className="fa-solid fa-spinner animate-spin text-[11px]" />
                ) : (
                  <i
                    className={`fa-solid ${otpSent && !expired ? "fa-rotate-right" : "fa-paper-plane"} text-[11px]`}
                  />
                )}
                {otpSent && !expired ? "Send OTP" : "Send OTP"}
              </button>
            </div>

            {/* Expiry progress bar */}
            {otpSent && !expired && otpExpiresAt && (
              <div className="mt-3">
                <ExpiryBar expiresAt={otpExpiresAt} />
              </div>
            )}

            {expired && (
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-red-500">
                <i className="fa-solid fa-circle-exclamation" />
                OTP has expired. Please resend.
              </div>
            )}
          </div>

          {/* OTP Inputs */}
          <div className="mb-5">
            <p className="text-[12px] font-medium text-slate-500 mb-3 text-center">
              Enter the 4-digit OTP from customer
            </p>
            <div className="flex items-center justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={`otp-box-${index}`}
                  id={`otp-modal-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  disabled={!otpSent || expired || verifyLoading}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={`w-11 h-13 rounded-2xl border-2 text-center text-xl font-bold text-slate-800 outline-none transition-all duration-200
                    ${
                      otpSent && !expired
                        ? "border-indigo-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        : "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Verify button */}
          <motion.button
            whileHover={isOtpComplete && !expired ? { scale: 1.01 } : {}}
            whileTap={isOtpComplete && !expired ? { scale: 0.98 } : {}}
            onClick={handleVerify}
            disabled={!isOtpComplete || expired || verifyLoading || !otpSent}
            className={`w-full rounded-2xl py-3 font-semibold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2
              ${
                isOtpComplete && !expired && otpSent
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  : "bg-slate-300 cursor-not-allowed"
              }`}
          >
            {verifyLoading ? (
              <>
                <i className="fa-solid fa-spinner animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <i className="fa-solid fa-shield-check" />
                {!otpSent
                  ? "Send OTP first"
                  : expired
                    ? "OTP expired"
                    : !isOtpComplete
                      ? "Enter complete OTP"
                      : "Verify & Mark Delivered"}
              </>
            )}
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Expiry progress bar subComponent
const ExpiryBar = ({ expiresAt }: { expiresAt: string }) => {
  const [pct, setPct] = useState(100);
  const totalMs = useRef<number | null>(null);

  useEffect(() => {
    const now = Date.now();
    const end = new Date(expiresAt).getTime();
    totalMs.current = end - now;

    const tick = () => {
      const remaining = new Date(expiresAt).getTime() - Date.now();
      const p = Math.max(0, (remaining / totalMs.current!) * 100);
      setPct(p);
    };

    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [expiresAt]);

  return (
    <div className="h-1 rounded-full bg-slate-200 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${pct > 50 ? "bg-indigo-400" : pct > 20 ? "bg-amber-400" : "bg-red-400"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

export default OtpVerificationModal;
