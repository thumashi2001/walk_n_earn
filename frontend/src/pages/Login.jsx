import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthPageShell from "../components/auth/AuthPageShell";
import FormAlert from "../components/auth/FormAlert";
import LabeledIconInput from "../components/auth/LabeledIconInput";
import AuthPrimaryButton from "../components/auth/AuthPrimaryButton";
import { IconEnvelope, IconLock } from "../components/auth/icons";
import {
  login,
  persistSession,
  getAuthErrorMessage,
} from "../services/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = await login({
        email: email.trim(),
        password,
      });
      const token = data?.token;
      const role = data?.role ?? "user";
      if (!token) {
        setError("Invalid response from server. Please try again.");
        return;
      }
      persistSession({ token, role });
      navigate(role === "admin" ? "/admin" : "/rewards", { replace: true });
    } catch (err) {
      setError(
        getAuthErrorMessage(err, {
          actionFallback: "Sign-in failed. Please try again.",
        })
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthPageShell
      title="Welcome back"
      description="Sign in with your email to continue earning rewards."
      sideTitle="Welcome Back!"
      sideDescription="Enter your personal details to use all of the features"
      sideAction={
        <Link
          to="/signup"
          className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/10 px-10 py-3 text-sm font-semibold text-white shadow-sm backdrop-blur transition-all duration-200 hover:bg-white/15 hover:shadow-md active:scale-[0.98]"
        >
          SIGN UP
        </Link>
      }
      footer={
        <p className="mt-8 text-center text-sm text-stone-600">
          New here?{" "}
          <Link
            to="/signup"
            className="font-semibold text-[#FF5F1F] underline-offset-4 transition-all duration-300 hover:text-[#d64b12] hover:underline hover:decoration-[#FF7518]/60"
          >
            Create an account
          </Link>
        </p>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {error && <FormAlert variant="error">{error}</FormAlert>}

        <LabeledIconInput
          id="login-email"
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          icon={<IconEnvelope />}
        />

        <LabeledIconInput
          id="login-password"
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          icon={<IconLock />}
          labelRight={
            <button
              type="button"
              className="rounded-lg px-1.5 py-0.5 text-xs font-medium text-[#FF5F1F] transition-all duration-200 hover:bg-[#FFA500]/15 hover:text-[#d64b12] active:scale-95"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          }
        />

        <AuthPrimaryButton loading={submitting} loadingLabel="Signing in…">
          Sign in
        </AuthPrimaryButton>
      </form>
    </AuthPageShell>
  );
}
