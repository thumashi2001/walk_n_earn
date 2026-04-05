export default function AuthPrimaryButton({
  children,
  loading,
  loadingLabel,
  type = "submit",
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={loading || rest.disabled}
      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 py-3.5 text-sm font-semibold text-white shadow-lg shadow-amber-900/30 transition-all duration-300 ease-out hover:from-amber-700 hover:via-amber-800 hover:to-amber-900 hover:shadow-xl hover:shadow-amber-950/20 active:scale-[0.98] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60"
      {...rest}
    >
      {loading ? (
        <>
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
            aria-hidden
          />
          {loadingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
