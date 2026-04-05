export default function AuthPageShell({ title, description, children, footer }) {
  return (
    <div className="relative mx-auto flex max-w-lg justify-center px-0 sm:px-4">
      <div
        className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-amber-200/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-stone-300/25 blur-3xl"
        aria-hidden
      />

      <div className="relative w-full overflow-hidden rounded-3xl bg-white/95 shadow-xl shadow-stone-300/40 ring-1 ring-stone-200/80 backdrop-blur-sm">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-700/80" />

        <div className="px-8 pb-10 pt-9 sm:px-10 sm:pb-12 sm:pt-10">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800/80">
              Walk n Earn
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="mt-2 text-sm text-stone-600">{description}</p>
            )}
          </div>

          {children}

          {footer}
        </div>
      </div>
    </div>
  );
}
