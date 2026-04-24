function StatCard({ label, value, helper, tone = "default" }) {
  const toneClass =
    tone === "brand"
      ? "from-brand-500/15 to-cyan-500/10"
      : tone === "amber"
        ? "from-amber-500/15 to-orange-500/10"
        : tone === "emerald"
          ? "from-emerald-500/15 to-teal-500/10"
          : "from-slate-200/70 to-white";

  return (
    <div className={`panel-card bg-gradient-to-br ${toneClass} p-5`}>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <h3 className="mt-3 text-3xl font-bold">{value}</h3>
      {helper ? <p className="mt-2 text-sm text-brand-600 dark:text-brand-300">{helper}</p> : null}
    </div>
  );
}

export default StatCard;
