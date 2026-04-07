export default function AuthPageShell({
  title,
  description,
  children,
  footer,
  sideTitle = "Welcome back!",
  sideDescription = "Enter your personal details to use all of the features",
  sideAction,
}) {
  return (
    <div className="relative flex min-h-[calc(100vh-0px)] items-center justify-center bg-gradient-to-br from-[#FFA500] via-[#FF7518] to-[#FF5F1F] px-4 py-10 sm:px-6">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side_at_15%_20%,rgba(255,255,255,0.48),transparent_58%),radial-gradient(closest-side_at_80%_75%,rgba(255,255,255,0.35),transparent_58%)]"
        aria-hidden
      />

      <div className="relative w-full max-w-5xl overflow-hidden rounded-[32px] bg-gradient-to-br from-white via-[#FFA500]/12 to-white shadow-[0_30px_80px_-35px_rgba(0,0,0,0.45)] ring-1 ring-white/40">
        <div className="grid min-h-[560px] grid-cols-1 lg:grid-cols-2">
          <section className="relative overflow-hidden bg-gradient-to-br from-[#FFA500] via-[#FF7518] to-[#FF5F1F] px-10 py-12 text-white lg:px-12 lg:py-14">
            <div
              className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#FFA500]/28 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-[#FF5F1F]/20 blur-3xl"
              aria-hidden
            />

            <div className="relative flex h-full flex-col items-start justify-center">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {sideTitle}
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/90">
                {sideDescription}
              </p>

              {sideAction ? (
                <div className="mt-10">{sideAction}</div>
              ) : null}
            </div>
          </section>

          <section className="px-8 pb-10 pt-10 sm:px-12 sm:pb-12 sm:pt-12">
            <div className="mb-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                Walk n Earn
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                {title}
              </h1>
              {description ? (
                <p className="mt-2 text-sm text-stone-600">{description}</p>
              ) : null}
            </div>

            {children}

            {footer}
          </section>
        </div>
      </div>
    </div>
  );
}
