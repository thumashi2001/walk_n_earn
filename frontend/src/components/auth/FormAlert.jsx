const variants = {
  error:
    "border-red-200/80 bg-red-50/90 text-red-800 ring-red-100",
  success:
    "border-emerald-200/80 bg-emerald-50/90 text-emerald-900 ring-emerald-100",
};

export default function FormAlert({ variant = "error", children, role = "alert" }) {
  return (
    <div
      role={role}
      className={`rounded-2xl border px-4 py-3 text-sm shadow-sm ring-1 ${variants[variant] ?? variants.error}`}
    >
      {children}
    </div>
  );
}
