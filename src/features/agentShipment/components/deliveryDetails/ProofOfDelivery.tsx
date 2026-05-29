// import { useState } from "react";
// import delivery_proof from "../../../../assets/delivery_box.jfif";
// import { useAppDispatch } from "../../../../shared/hooks/reduxHooks";
// import { updateTrackStatus } from "../../agentSlice";

// const ProofOfDelivery = ({ data }) => {
//   const dispatch = useAppDispatch();
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const handleChange = (value: string, index: number) => {
//     if (!/^\d*$/.test(value)) return;
//     const newOtp = [...otp];
//     newOtp[index] = value.slice(-1);
//     setOtp(newOtp);
//     if (value && index < otp.length - 1) {
//       const nextInput = document.getElementById(`otp-${index + 1}`);
//       nextInput?.focus();
//     }
//   };

//   const handleKeyDown = (
//     e: React.KeyboardEvent<HTMLInputElement>,
//     index: number,
//   ) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       const prevInput = document.getElementById(`otp-${index - 1}`);
//       prevInput?.focus();
//     }
//   };

//   const isOtpComplete = otp.every((digit) => digit !== "");

//   const handleConfirmDelivery = async () => {
//     try {
//       await dispatch(
//         updateTrackStatus({
//           id: String(data.shipmentId),
//           data: {
//             status: "DELIVERED",
//           },
//         }),
//       ).unwrap();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50 to-blue-50 p-5 shadow-xl">
//       <div className="mb-4">
//         <h2 className="font-semibold text-slate-700">Proof of Delivery</h2>
//         <p className="mt-1 text-sm text-slate-500">
//           Verify delivery securely using OTP confirmation and delivery proof.
//         </p>
//       </div>
//       <button className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 py-2 font-semibold text-white shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-lg">
//         Send OTP to Customer
//       </button>

//       <div className="mt-5 flex items-center justify-center gap-3">
//         {otp.map((digit, index) => (
//           <input
//             key={index}
//             id={`otp-${index}`}
//             type="text"
//             inputMode="numeric"
//             maxLength={1}
//             value={digit}
//             onChange={(e) => handleChange(e.target.value, index)}
//             onKeyDown={(e) => handleKeyDown(e, index)}
//             className="w-9 lg:h-14 lg:w-14 rounded-2xl border-2 border-indigo-200 bg-white text-center text-2xl font-bold text-slate-800 shadow-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200"
//           />
//         ))}
//       </div>

//       <div className="relative mt-5 overflow-hidden rounded-3xl border border border-indigo-300 text-center shadow-inner">
//         <div
//           className=" brightness-80 w-full hover:scale-110 transition duration-700"
//           style={{
//             backgroundImage: `url(${delivery_proof})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//           }}
//         >
//           <div className="relative z-10 flex flex-col items-center justify-center py-2 text-white">
//             <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
//               <i className="fa-solid fa-camera text-2xl"></i>
//             </div>

//             <h3 className="mt-4 text-lg font-semibold">
//               Upload Delivery Photo
//             </h3>

//             <p className="mt-1 text-sm text-slate-200">
//               Optional — Tap to attach proof image
//             </p>
//           </div>
//         </div>
//       </div>

//       <button
//         onClick={handleConfirmDelivery}
//         disabled={!isOtpComplete}
//         className={`mt-6 w-full rounded-2xl py-2 font-semibold text-white shadow-md transition-all duration-300 ${
//           isOtpComplete
//             ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:scale-[1.01] hover:shadow-lg"
//             : "cursor-not-allowed bg-slate-300"
//         }`}
//       >
//         Confirm Delivery
//       </button>
//       <p className="mt-3 text-center text-xs text-slate-500">
//         {isOtpComplete
//           ? "OTP verified. Ready to confirm delivery."
//           : "Enter full OTP to activate confirmation"}
//       </p>
//     </div>
//   );
// };

// export default ProofOfDelivery;

import { useState } from "react";
import delivery_proof from "../../../../assets/delivery_box.jfif";
import { showToast } from "../../../../shared/components/Toast";

interface ProofOfDeliveryProps {
  currentStatus: string;
  otpVerified: boolean;
  setOtpVerified: (value: boolean) => void;
}

const ProofOfDelivery = ({
  currentStatus,
  otpVerified,
  setOtpVerified,
}: ProofOfDeliveryProps) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);

    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  const handleVerifyOtp = () => {
    if (!isOtpComplete) return;

    setOtpVerified(true);

    showToast({
      type: "success",
      message: "OTP verified successfully",
    });
  };

  return (
    <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50 to-blue-50 p-5 shadow-xl">
      <div className="mb-4">
        <h2 className="font-semibold text-slate-700">Proof of Delivery</h2>

        <p className="mt-1 text-sm text-slate-500">
          Verify delivery securely using OTP confirmation.
        </p>
      </div>

      <button className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 py-2 font-semibold text-white shadow-md">
        Send OTP to Customer
      </button>

      <div className="mt-5 flex items-center justify-center gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={otpVerified}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-9 lg:h-14 lg:w-14 rounded-2xl border-2 border-indigo-200 bg-white text-center text-2xl font-bold text-slate-800 shadow-sm outline-none"
          />
        ))}
      </div>

      <div className="relative mt-5 overflow-hidden rounded-3xl border border-indigo-300 text-center shadow-inner">
        <div
          className="brightness-80 w-full hover:scale-110 transition duration-700"
          style={{
            backgroundImage: `url(${delivery_proof})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="relative z-10 flex flex-col items-center justify-center py-2 text-white">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
              <i className="fa-solid fa-camera text-2xl"></i>
            </div>

            <h3 className="mt-4 text-lg font-semibold">
              Upload Delivery Photo
            </h3>

            <p className="mt-1 text-sm text-slate-200">
              Optional — Tap to attach proof image
            </p>
          </div>
        </div>
      </div>

      {!otpVerified ? (
        <button
          disabled={!isOtpComplete}
          onClick={handleVerifyOtp}
          className={`mt-6 w-full rounded-2xl py-2 font-semibold text-white shadow-md transition-all duration-300 ${
            isOtpComplete
              ? "bg-gradient-to-r from-green-500 to-emerald-500"
              : "cursor-not-allowed bg-slate-300"
          }`}
        >
          Verify OTP
        </button>
      ) : (
        <div className="mt-6 rounded-2xl bg-green-100 py-3 text-center font-semibold text-green-700">
          OTP Verified Successfully
        </div>
      )}
    </div>
  );
};

export default ProofOfDelivery;
