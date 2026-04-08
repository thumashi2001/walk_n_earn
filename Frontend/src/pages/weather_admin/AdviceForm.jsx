import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdviceForm({ isOpen, onClose, onSuccess, initialData }) {
  const defaultState = {
    title: "",
    advice: "",
    category: "General Health",
    severity: "Normal",
    priority: 3,
    active: true,
    trigger: {
      parameter: "Temperature",
      conditionType: "RANGE",
      range: { min: "", max: "" },
      exactValue: "Clear",
    },
    validFrom: "",
    validTo: "",
    timeStart: "",
    timeEnd: "",
  };

  const [formData, setFormData] = useState(defaultState);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          ...initialData,
          // Convert ISO Dates to YYYY-MM-DD for input fields
          validFrom: initialData.validFrom ? initialData.validFrom.split('T')[0] : "",
          validTo: initialData.validTo ? initialData.validTo.split('T')[0] : "",
          trigger: {
            ...initialData.trigger,
            range: {
              min: initialData.trigger.range?.min ?? "",
              max: initialData.trigger.range?.max ?? "",
            },
          },
        });
      } else {
        setFormData(defaultState);
      }
    }
  }, [initialData, isOpen]);

  const getUnit = (param) => {
    switch (param) {
      case "Temperature": return "(°C)";
      case "Humidity": return "(%)";
      case "Wind": return "(km/h)";
      default: return "";
    }
  };

  useEffect(() => {
    const isNumeric = ["Temperature", "Humidity", "Wind"].includes(formData.trigger.parameter);
    setFormData((prev) => ({
      ...prev,
      trigger: {
        ...prev.trigger,
        conditionType: isNumeric ? "RANGE" : "EXACT",
      },
    }));
  }, [formData.trigger.parameter]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = { ...formData };

    // Clean up Trigger Logic
    if (submissionData.trigger.conditionType === "RANGE") {
      submissionData.trigger.range.min = formData.trigger.range.min !== "" ? Number(formData.trigger.range.min) : null;
      submissionData.trigger.range.max = formData.trigger.range.max !== "" ? Number(formData.trigger.range.max) : null;
      delete submissionData.trigger.exactValue;
    } else {
      delete submissionData.trigger.range;
    }

    // Clean up empty strings for Dates/Times so they don't break MongoDB Date type
    if (!submissionData.validFrom) delete submissionData.validFrom;
    if (!submissionData.validTo) delete submissionData.validTo;

    onSuccess(submissionData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-stone-900">
              {initialData ? "Edit Health Advice" : "Create Health Advice"}
            </h2>
            <button type="button" onClick={onClose} className="text-stone-400 hover:text-stone-600 text-2xl">×</button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Title & Message */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Title</label>
              <input required className="w-full rounded-xl border-stone-200 bg-stone-50 p-3 text-sm" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., Extreme Heat Warning" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Advice Message</label>
              <textarea required className="w-full rounded-xl border-stone-200 bg-stone-50 p-3 text-sm h-20" value={formData.advice} onChange={(e) => setFormData({ ...formData, advice: e.target.value })} placeholder="What should the user do?" />
            </div>

            {/* Category, Severity, Priority */}
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Category</label>
              <select className="w-full rounded-xl border-stone-200 bg-stone-50 p-3 text-sm" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                {["Temperature", "Rain / Storm", "Wind", "Humidity", "General Health"].map((c) => (<option key={c}>{c}</option>))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Severity</label>
                <select className="w-full rounded-xl border-stone-200 bg-stone-50 p-3 text-sm" value={formData.severity} onChange={(e) => setFormData({ ...formData, severity: e.target.value })}>
                  {["Normal", "Low", "Caution", "Moderate"].map((s) => (<option key={s}>{s}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Priority (1-3)</label>
                <select className="w-full rounded-xl border-stone-200 bg-stone-50 p-3 text-sm" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}>
                  {[1, 2, 3].map((p) => (<option key={p} value={p}>{p} {p === 1 ? '(High)' : p === 3 ? '(Low)' : ''}</option>))}
                </select>
              </div>
            </div>

            {/* Weather Trigger */}
            <div className="bg-amber-50/50 p-4 rounded-2xl sm:col-span-2 border border-amber-100">
              <p className="text-xs font-black uppercase text-amber-800 mb-3">Weather Trigger Configuration</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-amber-700 mb-1">Parameter</label>
                  <select className="w-full rounded-lg border-amber-200 p-2 text-sm" value={formData.trigger.parameter} onChange={(e) => setFormData({ ...formData, trigger: { ...formData.trigger, parameter: e.target.value } })}>
                    {["Temperature", "WeatherCondition", "Humidity", "Wind"].map((p) => (<option key={p}>{p}</option>))}
                  </select>
                </div>

                {formData.trigger.conditionType === "RANGE" ? (
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-amber-700 mb-1">Min {getUnit(formData.trigger.parameter)}</label>
                      <input type="number" className="w-full rounded-lg border-amber-200 p-2 text-sm" value={formData.trigger.range.min} onChange={(e) => setFormData({ ...formData, trigger: { ...formData.trigger, range: { ...formData.trigger.range, min: e.target.value } } })} />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-amber-700 mb-1">Max {getUnit(formData.trigger.parameter)}</label>
                      <input type="number" className="w-full rounded-lg border-amber-200 p-2 text-sm" value={formData.trigger.range.max} onChange={(e) => setFormData({ ...formData, trigger: { ...formData.trigger, range: { ...formData.trigger.range, max: e.target.value } } })} />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[10px] font-bold text-amber-700 mb-1">Exact Condition</label>
                    <select className="w-full rounded-lg border-amber-200 p-2 text-sm" value={formData.trigger.exactValue} onChange={(e) => setFormData({ ...formData, trigger: { ...formData.trigger, exactValue: e.target.value } })}>
                      {["Clear", "Clouds", "Rain", "Drizzle", "Thunderstorm", "Snow", "Mist"].map((v) => (<option key={v}>{v}</option>))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Validity & Status */}
            <div className="bg-stone-50 p-4 rounded-2xl sm:col-span-2 border border-stone-100">
              <p className="text-xs font-black uppercase text-stone-500 mb-3">Validity & Status</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-stone-400 mb-1">From Date</label>
                    <input type="date" className="w-full rounded-lg border-stone-200 p-2 text-xs" value={formData.validFrom} onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-stone-400 mb-1">To Date</label>
                    <input type="date" className="w-full rounded-lg border-stone-200 p-2 text-xs" value={formData.validTo} onChange={(e) => setFormData({ ...formData, validTo: e.target.value })} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-stone-400 mb-1">Start Time</label>
                    <input type="time" className="w-full rounded-lg border-stone-200 p-2 text-xs" value={formData.timeStart} onChange={(e) => setFormData({ ...formData, timeStart: e.target.value })} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-stone-400 mb-1">End Time</label>
                    <input type="time" className="w-full rounded-lg border-stone-200 p-2 text-xs" value={formData.timeEnd} onChange={(e) => setFormData({ ...formData, timeEnd: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <input type="checkbox" id="active-status" checked={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })} className="rounded text-amber-600 focus:ring-amber-500" />
                <label htmlFor="active-status" className="text-xs font-bold text-stone-600">Active (Visible to users)</label>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl bg-stone-100 py-3 text-sm font-bold text-stone-600 transition-all hover:bg-stone-200">Cancel</button>
            <button type="submit" className="flex-1 rounded-xl bg-stone-900 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-stone-800 active:scale-95">
              {initialData ? "Update Changes" : "Save Advice"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}