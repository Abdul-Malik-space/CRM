function StatCard({ title, value, note, active = false, icon = "●" }) {
  return (
    <div
      className={`relative min-w-0 overflow-hidden rounded-xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        active
          ? "border-slate-900 bg-slate-950 text-white"
          : "border-slate-200 bg-white text-slate-950"
      }`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold ${
            active ? "bg-white/15 text-white" : "bg-slate-100 text-slate-700"
          }`}
        >
          {icon}
        </div>

        <span className={active ? "text-white/60" : "text-slate-300"}>⌁</span>
      </div>

      <p
        className={`mt-4 text-xs font-semibold uppercase tracking-wide ${
          active ? "text-white/70" : "text-slate-500"
        }`}
      >
        {title}
      </p>

      <h3 className="mt-1 truncate text-3xl font-extrabold">{value}</h3>

      <p
        className={`mt-2 text-xs font-semibold ${
          active ? "text-emerald-300" : "text-emerald-600"
        }`}
      >
        {note}
      </p>
    </div>
  );
}

export default StatCard;