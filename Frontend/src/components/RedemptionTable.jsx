function formatDate(dateLike) {
  try {
    const d = new Date(dateLike);
    return d.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export default function RedemptionTable({ rows, loading, error }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-stone-200/40 bg-gradient-to-b from-white/98 to-[#FFA500]/10 shadow-xl shadow-[#FF7518]/15 ring-1 ring-[#FFA500]/15 backdrop-blur-sm transition-shadow duration-500 hover:shadow-2xl">
      <div className="border-b border-stone-200/80 bg-gradient-to-r from-[#FFA500]/16 via-[#FF7518]/8 to-transparent px-5 py-4 sm:px-8">
        <h2 className="text-base font-bold tracking-tight text-stone-900">
          Redemption History
        </h2>
        <p className="mt-1 text-sm text-stone-600">
          Track recent reward redemptions.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-[#FFA500]/30 border-t-[#FF5F1F]" />
          <p className="text-sm text-stone-600">Loading redemption history…</p>
        </div>
      ) : error ? (
        <div className="p-6 text-center text-sm text-red-800">{error}</div>
      ) : rows.length === 0 ? (
        <div className="p-10 text-center text-sm text-stone-600">No data.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200/80 bg-gradient-to-r from-[#FFA500]/16 via-[#FF7518]/8 to-transparent">
                <th className="px-4 py-3 font-semibold text-stone-700 sm:px-6">
                  User Name
                </th>
                <th className="px-4 py-3 font-semibold text-stone-700 sm:px-6">
                  Reward Name
                </th>
                <th className="px-4 py-3 font-semibold text-stone-700 sm:px-6">
                  Points Used
                </th>
                <th className="px-4 py-3 font-semibold text-stone-700 sm:px-6">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {rows.map((r) => (
                <tr
                  key={r._id}
                  className="transition-colors duration-200 ease-out hover:bg-gradient-to-r hover:from-[#FFA500]/14 hover:to-transparent"
                >
                  <td className="px-4 py-3 font-semibold text-stone-900 sm:px-6">
                    {r.userName}
                  </td>
                  <td className="px-4 py-3 text-stone-700 sm:px-6">
                    {r.rewardName}
                  </td>
                  <td className="px-4 py-3 font-medium tabular-nums text-stone-800 sm:px-6">
                    {r.pointsUsed}
                  </td>
                  <td className="px-4 py-3 text-stone-700 sm:px-6">
                    {formatDate(r.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

