export default function LoadingSpinner({ size = "lg", label = "Loading..." }) {
  const dim = size === "lg" ? "w-10 h-10" : "w-5 h-5";
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div
        className={`${dim} border-4 border-green-100 border-t-green-500 rounded-full animate-spin`}
        role="status"
        aria-label={label}
      />
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}
