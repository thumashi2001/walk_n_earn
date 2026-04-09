import { useMemo, useState } from "react";

function RoleBadge({ role }) {
  const isAdmin = String(role).toLowerCase() === "admin";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm transition-shadow duration-200 ${
        isAdmin
          ? "bg-gradient-to-r from-[#FFA500] to-[#FF5F1F] text-white ring-1 ring-[#FF7518]/35"
          : "bg-gradient-to-b from-stone-200/90 to-stone-100/80 text-stone-600 ring-1 ring-stone-300/50"
      }`}
    >
      {isAdmin ? "Admin" : "User"}
    </span>
  );
}

export default function UserTable({ users, loading, error }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const name = String(u.fullName || "").toLowerCase();
      const email = String(u.email || "").toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [users, query]);

  return (
    <section className="overflow-hidden rounded-3xl border border-stone-200/40 bg-gradient-to-b from-white/98 to-[#FFA500]/10 shadow-xl shadow-[#FF7518]/15 ring-1 ring-[#FFA500]/15 backdrop-blur-sm transition-shadow duration-500 hover:shadow-2xl">
      <div className="flex flex-col gap-3 border-b border-stone-200/80 bg-gradient-to-r from-[#FFA500]/16 via-[#FF7518]/8 to-transparent px-5 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <h2 className="text-base font-bold tracking-tight text-stone-900">
            Users
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            Manage users and roles.
          </p>
        </div>

        <div className="w-full sm:w-80">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email"
            className="w-full rounded-2xl border border-stone-200/80 bg-white px-4 py-2.5 text-sm text-stone-800 shadow-sm outline-none transition-all duration-300 placeholder:text-stone-400 focus:border-[#FF7518]/60 focus:ring-2 focus:ring-[#FF7518]/25"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-[#FFA500]/30 border-t-[#FF5F1F]" />
          <p className="text-sm text-stone-600">Loading users…</p>
        </div>
      ) : error ? (
        <div className="p-6 text-center text-sm text-red-800">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="p-10 text-center text-sm text-stone-600">No data.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200/80 bg-gradient-to-r from-[#FFA500]/16 via-[#FF7518]/8 to-transparent">
                <th className="px-4 py-3 font-semibold text-stone-700 sm:px-6">
                  Name
                </th>
                <th className="px-4 py-3 font-semibold text-stone-700 sm:px-6">
                  Email
                </th>
                <th className="px-4 py-3 font-semibold text-stone-700 sm:px-6">
                  Total Points
                </th>
                <th className="px-4 py-3 font-semibold text-stone-700 sm:px-6">
                  Role
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((u) => (
                <tr
                  key={u._id || u.email}
                  className="transition-colors duration-200 ease-out hover:bg-gradient-to-r hover:from-[#FFA500]/14 hover:to-transparent"
                >
                  <td className="px-4 py-3 font-semibold text-stone-900 sm:px-6">
                    {u.fullName || "—"}
                  </td>
                  <td className="px-4 py-3 text-stone-700 sm:px-6">
                    {u.email || "—"}
                  </td>
                  <td className="px-4 py-3 font-medium tabular-nums text-stone-800 sm:px-6">
                    {typeof u.totalPoints === "number" ? u.totalPoints : 0}
                  </td>
                  <td className="px-4 py-3 sm:px-6">
                    <RoleBadge role={u.role} />
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

