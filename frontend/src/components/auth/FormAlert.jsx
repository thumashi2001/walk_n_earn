const variants = {
  error:
    "border-red-200/80 bg-gradient-to-b from-red-50/95 to-red-50/75 text-red-800 ring-red-100 shadow-md shadow-red-900/5",
  success:
    "border-emerald-200/80 bg-gradient-to-b from-emerald-50/95 to-emerald-50/70 text-emerald-900 ring-emerald-100 shadow-md shadow-emerald-900/5",
};

export default function FormAlert({ variant = "error", children, role = "alert" }) {
  return (
    <div
      role={role}
      className={`rounded-2xl border px-4 py-3 text-sm shadow-sm ring-1 transition-shadow duration-300 ${variants[variant] ?? variants.error}`}
    >
      {children}
    </div>
  );
}
