import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  login,
  persistSession,
  getLoginErrorMessage,
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
      setError(getLoginErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative mx-auto flex max-w-lg justify-center px-0 sm:px-4">
      <div
        className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-amber-200/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-stone-300/25 blur-3xl"
        aria-hidden
      />

      <div className="relative w-full overflow-hidden rounded-3xl bg-white/95 shadow-xl shadow-stone-300/40 ring-1 ring-stone-200/80 backdrop-blur-sm">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-700/80" />

        <div className="px-8 pb-10 pt-9 sm:px-10 sm:pb-12 sm:pt-10">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800/80">
              Walk n Earn
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              Sign in with your email to continue earning rewards.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {error && (
              <div
                className="rounded-2xl border border-red-200/80 bg-red-50/90 px-4 py-3 text-sm text-red-800 shadow-sm ring-1 ring-red-100"
                role="alert"
              >
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="login-email"
                className="mb-1.5 block text-sm font-medium text-stone-700"
              >
                Email
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>
                </span>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-stone-200 bg-[#fffefb] py-3 pl-11 pr-4 text-stone-900 shadow-inner shadow-stone-100/80 outline-none ring-0 transition placeholder:text-stone-400 focus:border-amber-300 focus:bg-white focus:shadow-md focus:shadow-amber-100/50 focus:ring-2 focus:ring-amber-200/60"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label
                  htmlFor="login-password"
                  className="text-sm font-medium text-stone-700"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-amber-800/90 hover:text-amber-950"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                  </svg>
                </span>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-stone-200 bg-[#fffefb] py-3 pl-11 pr-4 text-stone-900 shadow-inner shadow-stone-100/80 outline-none transition placeholder:text-stone-400 focus:border-amber-300 focus:bg-white focus:shadow-md focus:shadow-amber-100/50 focus:ring-2 focus:ring-amber-200/60"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-800 py-3.5 text-sm font-semibold text-white shadow-lg shadow-amber-900/25 transition hover:from-amber-700 hover:to-amber-900 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                    aria-hidden
                  />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-stone-600">
            New here?{" "}
            <Link
              to="/signup"
              className="font-semibold text-amber-900 underline-offset-2 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
