import { BarChart3, Download, LayoutDashboard, LogOut, MessagesSquare } from "lucide-react";


function AdminSidebar({ onLogout, onExport }) {
  const items = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: MessagesSquare, label: "Feedback" },
    { icon: BarChart3, label: "Insights" },
  ];

  return (
    <aside className="panel-card flex h-fit flex-col gap-3 p-4 lg:sticky lg:top-6">
      <div className="rounded-2xl bg-brand-600 p-5 text-white shadow-glow">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-100">Admin panel</p>
        <h2 className="mt-3 text-2xl font-bold">Review Control Center</h2>
        <p className="mt-2 text-sm text-brand-50">Monitor trends, remove noise, and export reports.</p>
      </div>
      <nav className="space-y-2">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3 rounded-xl border border-slate-200/70 px-4 py-3 text-sm font-medium text-slate-700 dark:border-slate-800 dark:text-slate-200">
            <Icon size={16} />
            {label}
          </div>
        ))}
      </nav>
      <button type="button" onClick={onExport} className="btn-secondary gap-2">
        <Download size={16} />
        Export CSV
      </button>
      <button type="button" onClick={onLogout} className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-rose-500 dark:hover:bg-rose-400">
        <span className="inline-flex items-center gap-2">
          <LogOut size={16} />
          Logout
        </span>
      </button>
    </aside>
  );
}

export default AdminSidebar;
