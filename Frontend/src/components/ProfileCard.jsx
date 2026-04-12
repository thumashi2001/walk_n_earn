function initialsFromName(name = "") {
  const words = String(name).trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "U";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

function StatItem({ label, value }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#FFA500]/14 to-[#FF7518]/10 px-4 py-3 shadow-sm shadow-[#FF7518]/10 ring-1 ring-[#FFA500]/25">
      <p className="text-xs font-medium uppercase tracking-wide text-[#a33a00]/80">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-[#7a2b00]">{value}</p>
    </div>
  );
}

export default function ProfileCard({
  user,
  role,
  avatarPreview,
  onAvatarChange,
  locationText,
  loggingOut,
  onLogout,
}) {
  const avatarFallback = initialsFromName(user?.fullName);

  return (
    <section className="mx-auto w-full max-w-4xl rounded-3xl border border-white/70 bg-gradient-to-br from-white/95 via-white/90 to-[#FFA500]/10 p-6 shadow-xl shadow-[#FF7518]/20 ring-1 ring-[#FFA500]/20 backdrop-blur-sm sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-full bg-gradient-to-br from-[#FFA500] via-[#FF7518] to-[#FF5F1F] p-[2px] shadow-lg shadow-[#FF7518]/30">
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold text-[#7a2b00]">
                  {avatarFallback}
                </span>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-stone-900">
                {user?.fullName || "User"}
              </h1>
              {role === "admin" ? (
                <span className="rounded-full bg-gradient-to-r from-[#FFA500] to-[#FF5F1F] px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                  Admin
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-sm text-stone-600">{user?.email || "—"}</p>
            <p className="mt-1 text-xs font-medium text-[#a33a00]/85">
              You are currently in: {locationText}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <label
            htmlFor="profile-avatar-upload"
            className="cursor-pointer rounded-xl bg-gradient-to-r from-[#FFA500] via-[#FF7518] to-[#FF5F1F] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-[#FF7518]/25 transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Upload photo
          </label>
          <input
            id="profile-avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onAvatarChange}
          />

          <button
            type="button"
            onClick={onLogout}
            disabled={loggingOut}
            className="rounded-xl border border-[#FF7518]/35 bg-white px-4 py-2 text-sm font-semibold text-[#7a2b00] shadow-sm transition-all duration-200 hover:bg-[#FFA500]/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatItem label="Total Points" value={user?.totalPoints ?? 0} />
        <StatItem
          label="Total Distance"
          value={
            user?.totalDistance != null ? `${user.totalDistance} km` : "Not available"
          }
        />
        <StatItem
          label="CO2 Saved"
          value={user?.totalCO2Saved != null ? `${user.totalCO2Saved} kg` : "Not available"}
        />
        <StatItem label="Role" value={role === "admin" ? "Admin" : "User"} />
      </div>
    </section>
  );
}
