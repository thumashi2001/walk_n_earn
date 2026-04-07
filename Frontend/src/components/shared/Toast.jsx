import { useEffect } from "react";

const STYLES = {
  success: "bg-green-50 border-green-300 text-green-800",
  error: "bg-red-50 border-red-300 text-red-800",
};

const ICONS = {
  success: "✅",
  error: "❌",
};

export default function Toast({ type = "success", message, onClose, duration = 5000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 px-4 py-3 mb-6 border rounded-xl shadow-sm ${STYLES[type]}`}
    >
      <span className="text-lg leading-tight">{ICONS[type]}</span>
      <p className="flex-1 text-sm font-medium leading-snug">{message}</p>
      <button
        onClick={onClose}
        aria-label="Dismiss"
        className="text-lg leading-none opacity-50 hover:opacity-100 transition-opacity"
      >
        ×
      </button>
    </div>
  );
}
