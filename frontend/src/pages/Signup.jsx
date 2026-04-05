import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthPageShell from "../components/auth/AuthPageShell";
import FormAlert from "../components/auth/FormAlert";
import LabeledIconInput from "../components/auth/LabeledIconInput";
import AuthPrimaryButton from "../components/auth/AuthPrimaryButton";
import { IconEnvelope, IconLock, IconUser } from "../components/auth/icons";
import { register, getAuthErrorMessage } from "../services/auth";

export default function Signup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
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
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      });
      navigate("/login", { replace: true });
    } catch (err) {
      setError(
        getAuthErrorMessage(err, {
          actionFallback: "Could not create your account. Please try again.",
        })
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthPageShell
      title="Create your account"
      description="Join Walk n Earn and start turning steps into rewards."
      footer={
        <p className="mt-8 text-center text-sm text-stone-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-amber-900 underline-offset-2 hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {error && <FormAlert variant="error">{error}</FormAlert>}

        <LabeledIconInput
          id="signup-fullName"
          name="fullName"
          label="Full name"
          type="text"
          autoComplete="name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Alex Johnson"
          icon={<IconUser />}
        />

        <LabeledIconInput
          id="signup-email"
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
          id="signup-password"
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          icon={<IconLock />}
          labelRight={
            <button
              type="button"
              className="text-xs font-medium text-amber-800/90 hover:text-amber-950"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          }
        />

        <AuthPrimaryButton loading={submitting} loadingLabel="Creating account…">
          Create account
        </AuthPrimaryButton>
      </form>
    </AuthPageShell>
  );
}
