import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: true,
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    const result = signup(form);

    setLoading(false);

    if (result.ok) {
      toast.success(result.message);

      navigate("/dashboard");
    } else {
      toast.error(result.message);
    }
  }

  const passwordStrong =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
      form.password
    );

  return (
    <AuthLayout>
      <h2 className="font-display text-2xl font-bold">
        Create your account
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Start managing your warehouse today.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5"
      >
        {/* Name */}

        <div>
          <label className="label-field">
            Full Name
          </label>

          <div className="relative">
            <User
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              className="input-field pl-9"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Fatima Tanveer"
              required
            />
          </div>
        </div>

        {/* Email */}

        <div>
          <label className="label-field">
            Email
          </label>

          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="email"
              className="input-field pl-9"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        {/* Password */}

        <div>
          <label className="label-field">
            Password
          </label>

          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type={
                showPassword ? "text" : "password"
              }
              className="input-field pl-9 pr-10"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          <p
            className={`mt-2 text-xs ${
              passwordStrong
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            Password must contain uppercase,
            lowercase, number, special character
            and be at least 8 characters.
          </p>
        </div>

        {/* Confirm Password */}

        <div>
          <label className="label-field">
            Confirm Password
          </label>

          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type={
                showConfirm ? "text" : "password"
              }
              className="input-field pl-9 pr-10"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirm(!showConfirm)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showConfirm ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Remember Me */}

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="rememberMe"
            checked={form.rememberMe}
            onChange={handleChange}
          />

          Remember Me
        </label>

        {/* Submit */}

        <button
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <UserPlus size={18} />

          {loading
            ? "Creating Account..."
            : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-blue-600 hover:underline"
        >
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}