import { useState, type ChangeEvent } from "react";
import { type AgentFormData } from "../adminTypes";
import { validateAgentDetails } from "../components/agentDetailsValidation";
import { useAppDispatch } from "../../../shared/hooks/reduxHooks";
import { createAgentDetails } from "../adminSlice";
import { toast } from "react-toastify";
import notificationSound from "../../../assets/universfield-new-notification-051-494246.mp3"

const vehicleTypes = ["Bike", "Scooter", "Van", "Mini Truck", "Truck"];

const CreateAgent = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useAppDispatch();
  //   const {shipments} = useAppSelector((state)=>state.admin);

  const [agentForm, setAgentForm] = useState<AgentFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    vehicleType: "",
    vehicleNumber: "",
    licenseNumber: "",
    serviceZone: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setAgentForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = () => {
    const validationErrors = validateAgentDetails(agentForm);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    // console.log("agentForm :", agentForm);
    dispatch(
      createAgentDetails({
        name: agentForm.name,
        email: agentForm.email,
        password: agentForm.password,
        phoneNumber: agentForm.phoneNumber,
        vehicleType: agentForm.vehicleType,
        vehicleNumber: agentForm.vehicleNumber,
        licenseNumber: agentForm.licenseNumber,
        serviceZone: agentForm.serviceZone,
      }),
    );

    setAgentForm({
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      vehicleType: "",
      vehicleNumber: "",
      licenseNumber: "",
      serviceZone: "",
    });

    const audio = new Audio(notificationSound);
    audio.play();
    toast.success("new Agent added Successfully!");
  };

  return (
    <div className="rounded-lg bg-gradient-to-br from-sky-50 via-cyan-100 to-indigo-50 min-h-screen p-6 overflow-hidden">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Create New Agent Details
        </h1>

        <p className="text-[14px] text-slate-500 mt-1">
          Fill in details below to create your new Agent Details
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 mt-4 shadow-sm">
        <form>
          <p className="text-[18px] font-semibold text-slate-800 flex items-center gap-2">
            <i className="fa-solid fa-headset text-sky-500"></i>
            Agent Details
          </p>

          {/* Agent Name */}
          <div className="flex flex-col gap-2 mt-5">
            <label className="text-[13px] font-medium text-slate-700">
              Agent Name
              <i className="fa-solid fa-asterisk ml-1 text-red-700 text-[10px]"></i>
            </label>

            <input
              type="text"
              placeholder="Enter agent name"
              value={agentForm.name}
              name="name"
              onChange={handleChange}
              className="border border-slate-300 rounded-lg h-10 px-3 text-[14px] outline-none focus:border-sky-500"
            />

            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}
          </div>

          {/* Email + phoneNumber */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-slate-700">
                Email
                <i className="fa-solid fa-asterisk ml-1 text-red-700 text-[10px]"></i>
              </label>

              <input
                type="email"
                placeholder="Enter email"
                value={agentForm.email}
                name="email"
                onChange={handleChange}
                className="border border-slate-300 rounded-lg h-10 px-3 text-[14px] outline-none focus:border-sky-500"
              />

              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-slate-700">
                phone Number
                <i className="fa-solid fa-asterisk ml-1 text-red-700 text-[10px]"></i>
              </label>

              <input
                type="text"
                placeholder="Enter phone number"
                value={agentForm.phoneNumber}
                name="phoneNumber"
                maxLength={10}
                onChange={handleChange}
                className="border border-slate-300 rounded-lg h-10 px-3 text-[14px] outline-none focus:border-sky-500"
              />

              {errors.phoneNumber && (
                <p className="text-red-500 text-xs">{errors.phoneNumber}</p>
              )}
            </div>
          </div>

          {/* Password + Confirm Password */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-slate-700">
                Password
                <i className="fa-solid fa-asterisk ml-1 text-red-700 text-[10px]"></i>
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={agentForm.password}
                  name="password"
                  onChange={handleChange}
                  className="border border-slate-300 rounded-lg h-10 px-3 pr-10 w-full text-[14px] outline-none focus:border-sky-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900"
                >
                  <i
                    className={`fa-solid ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-slate-700">
                Confirm Password
                <i className="fa-solid fa-asterisk ml-1 text-red-700 text-[10px]"></i>
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={agentForm.confirmPassword}
                  name="confirmPassword"
                  onChange={handleChange}
                  className="border border-slate-300 rounded-lg h-10 px-3 pr-10 w-full text-[14px] outline-none focus:border-sky-500"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900"
                >
                  <i
                    className={`fa-solid ${
                      showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-slate-700">
                Vehicle Type
                <span className="ml-2 px-2 py-1 rounded-full bg-sky-50 text-sky-400 text-[10px] font-semibold">
                  Optional
                </span>
              </label>

              <select
                name="vehicleType"
                value={agentForm.vehicleType}
                onChange={handleChange}
                className="border border-slate-300 rounded-lg h-10 px-3 text-[14px] outline-none focus:border-sky-500 bg-white"
              >
                <option value="">Select Vehicle Type</option>

                {vehicleTypes.map((vehicle) => (
                  <option key={vehicle} value={vehicle}>
                    {vehicle}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-slate-700">
                Vehicle Number
                <span className="ml-2 px-2 py-1 rounded-full bg-sky-50 text-sky-400 text-[10px] font-semibold">
                  Optional
                </span>
              </label>

              <input
                type="text"
                placeholder="TN 00 AB 1234"
                value={agentForm.vehicleNumber}
                name="vehicleNumber"
                onChange={handleChange}
                className="border border-slate-300 rounded-lg h-10 px-3 text-[14px] outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* License + Service Zone */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-slate-700">
                License Number
                <span className="ml-2 px-2 py-1 rounded-full bg-sky-50 text-sky-400 text-[10px] font-semibold">
                  Optional
                </span>
              </label>

              <input
                type="text"
                placeholder="Enter license number"
                value={agentForm.licenseNumber}
                name="licenseNumber"
                onChange={handleChange}
                className="border border-slate-300 rounded-lg h-10 px-3 text-[14px] outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-slate-700">
                Service Zone
                <span className="ml-2 px-2 py-1 rounded-full bg-sky-50 text-sky-400 text-[10px] font-semibold">
                  Optional
                </span>
              </label>

              <input
                type="text"
                placeholder="Enter service zone"
                value={agentForm.serviceZone}
                name="serviceZone"
                onChange={handleChange}
                className="border border-slate-300 rounded-lg h-10 px-3 text-[14px] outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full h-11 bg-sky-400 hover:bg-sky-500 text-white rounded-lg text-[14px] font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <i className="fa-solid fa-arrow-right-to-bracket mr-2"></i>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAgent;
