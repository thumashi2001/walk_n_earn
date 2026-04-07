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
      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FFA500] via-[#FF7518] to-[#FF5F1F] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#FF7518]/30 transition-all duration-300 ease-out hover:from-[#FF7518] hover:via-[#FF5F1F] hover:to-[#FF5F1F] hover:shadow-xl hover:shadow-[#FF5F1F]/20 active:scale-[0.98] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60"
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
