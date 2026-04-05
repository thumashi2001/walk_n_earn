export default function HealthAdviceCard() {
  return (
    <section className="rounded-3xl border border-amber-100/50 bg-gradient-to-br from-amber-50/50 to-white p-8 shadow-lg shadow-amber-900/5">
      <h2 className="text-lg font-bold text-amber-900">Health Advice</h2>
      <div className="mt-6 flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-amber-100">
          <span className="text-xl">💡</span>
        </div>
        <p className="mt-4 text-sm text-stone-600 italic">
          "Check back here for tips from our experts based on today's weather."
        </p>
      </div>
    </section>
  );
}
