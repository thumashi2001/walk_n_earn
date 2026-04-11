export default function Walking() {
  return (
    <div className="group mx-auto max-w-3xl rounded-3xl border border-white/70 bg-gradient-to-b from-white/95 to-[#FFA500]/12 p-8 shadow-lg shadow-[#FF7518]/15 ring-1 ring-[#FFA500]/20 backdrop-blur-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#FF5F1F]/20 sm:p-10">
      <div className="h-1 w-16 rounded-full bg-gradient-to-r from-[#FFA500] via-[#FF7518] to-[#FF5F1F] transition-all duration-500 group-hover:w-24" />
      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-stone-800 transition-colors duration-300 group-hover:text-stone-900">
        Walking
      </h1>
      <p className="mt-3 leading-relaxed text-stone-600">
        Walking component placeholder. Your teammate's walking management module
        can be integrated here.
      </p>
    </div>
  );
}
