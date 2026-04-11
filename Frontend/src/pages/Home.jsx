export default function Home() {
  return (
    <div className="group mx-auto max-w-3xl rounded-3xl border border-white/70 bg-gradient-to-b from-white/95 to-amber-50/20 p-8 shadow-lg shadow-stone-300/20 ring-1 ring-stone-200/50 backdrop-blur-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-900/10 sm:p-10">
      <div className="h-1 w-16 rounded-full bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700/80 transition-all duration-500 group-hover:w-24" />
      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-stone-800 transition-colors duration-300 group-hover:text-stone-900">
        Home
      </h1>
      <p className="mt-3 leading-relaxed text-stone-600">
        Welcome to Walk n Earn — your steps, your rewards.
      </p>
    </div>
  );
}
