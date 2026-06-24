import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../shared/hooks/reduxHooks";
import { loginUser } from "../authSlice";
import logistic_img from "../../../assets/bg4.avif";
import type { FormErrors } from "../authTypes";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error, accessToken, user } = useAppSelector(
    (state) => state.auth,
  );

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    // const mailRegex = /^[^\s@]+@(gmail|logistics)\.(com|in|ai)$/;

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      // } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    }
    // else if (!mailRegex.test(form.email)) {
    //   newErrors.email = "Enter a valid email";
    // }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(loginUser(form));
    // alert("Login functionality is currently disabled for demonstration purposes.");
    // navigate("/customerDashboard");
  };

  useEffect(() => {
    if (accessToken && user) {
      const role = user.role;

      if (role === "customer") {
        navigate("/customerDashboard");
      } else if (role === "admin") {
        navigate("/adminDashboard");
      } else if (role === "deliveryAgent") {
        navigate("/agentDashboard");
      } else {
        // console.log("Unknown role:", role);
        navigate("/");
      }
    }
  }, [accessToken, user, navigate]);

  const passwordError =
    errors.password || (error === "Invalid credentials" ? error : undefined);

  // const emailError =
  //   errors.email ||
  //   (error === "Email already exists" || error === "User not found"
  //     ? error
  //     : undefined);

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] overflow-hidden grid grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md border border-slate-200 rounded-2xl bg-white shadow-lg p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome Back
            </h1>

            <p className="text-slate-500 text-sm">
              Sign in to continue to LDMS
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email address"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              error={errors.email}
              onchange={handleChange}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              error={passwordError}
              onchange={handleChange}
            />

            {(error && error !== "Email already exists") && <p className="text-red-400 text-xs">{error}</p>}

            <Button
              type="submit"
              isLoading={loading}
              loadingText="Signing in..."
              className="w-full"
            >
              Sign In
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-slate-400 text-xs">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <p className="text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              Create one
            </Link>
          </p>
          <p className="text-center text-[12px] text-slate-600 mt-2">
            want to go landing page?{" "}
            <a
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Landing
            </a>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - IMAGE */}
      <div className="hidden md:block h-screen">
        <img
          src={logistic_img}
          alt="Logistics"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
