import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../shared/hooks/reduxHooks";
import { registerUser } from "../authSlice";
// import logistic_img from "../../../assets/auth_bg_side.jpg";
import logistic_img from "../../../assets/register_banner.png";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validation = (): boolean => {
    const newErrors: FormErrors = {};
    // const mailRegex = /^[^\s@]+@(gmail|logistics)\.(com|in|ai)$/;

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must br atleast 2 charectors";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      // } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    }
    // else if (!mailRegex.test(form.email)) {
    //   newErrors.email = "Enter valid email";
    // }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "password must be at least 6 characters";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Password do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation()) return;

    const result = await dispatch(
      registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      }),
    );
    // alert("Login functionality is currently disabled for demonstration purposes.");

    if (registerUser.fulfilled.match(result)) {
      setSuccess(true);
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate("/login"), 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-10 text-center">
          {/* Success Icon */}
          <div className="relative mx-auto mb-6 w-20 h-20">
            <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-30"></div>

            <div className="relative w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
              <i className="fa-solid fa-check text-white text-3xl"></i>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Account Created!
          </h2>

          {/* Subtext */}
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Your account has been successfully created.
            <br />
            Redirecting you to login...
          </p>

          {/* Loader */}
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
            <span
              className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.15s" }}
            ></span>
            <span
              className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.3s" }}
            ></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:block min-h-screen">
        <img
          src={logistic_img}
          alt="Logistics"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-md border border-slate-200 rounded-2xl bg-white shadow-lg p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Sign up</h1>

            <p className="text-slate-500 text-sm">
              Welcome to logistics supply chain platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              error={errors.name}
              onchange={handleChange}
            />

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
              placeholder="Min. 6 characters"
              value={form.password}
              error={errors.password}
              onchange={handleChange}
            />

            <Input
              label="Confirm password"
              name="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              value={form.confirmPassword}
              error={errors.confirmPassword}
              onchange={handleChange}
            />

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <Button
              type="submit"
              isLoading={loading}
              loadingText="Creating account..."
              className="w-full"
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Sign in
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
    </div>
  );
};

export default Register;
