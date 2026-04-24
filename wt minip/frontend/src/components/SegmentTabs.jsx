function SegmentTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {tabs.map((tab) => {
        const active = tab.value === activeTab;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              active
                ? "bg-brand-600 text-white shadow-glow"
                : "text-slate-600 hover:text-brand-500 dark:text-slate-300 dark:hover:text-brand-300"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default SegmentTabs;
