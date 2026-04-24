import { Link } from "react-router-dom";
import { BarChart3, MessageSquareHeart, ShieldCheck } from "lucide-react";

import ThemeToggle from "../components/ThemeToggle";


function LandingPage() {
  const features = [
    {
      icon: MessageSquareHeart,
      title: "Fast student feedback",
      description: "Collect thoughtful reviews with anonymous options and instant submission history.",
    },
    {
      icon: BarChart3,
      title: "Insightful analytics",
      description: "Visualize teacher performance, average ratings, and distribution trends in seconds.",
    },
    {
      icon: ShieldCheck,
      title: "Secure role-based access",
      description: "JWT-protected student and admin experiences with bcrypt password hashing.",
    },
  ];

  return (
    <div className="min-h-screen px-6 py-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-500">Student feedback review system</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight lg:text-6xl">
              Turn student voices into actionable academic insight.
            </h1>
          </div>
          <ThemeToggle />
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="panel-card overflow-hidden p-8 lg:p-10">
            <div className="floating-dot left-8 top-8 h-16 w-16 bg-brand-300/40" />
            <div className="floating-dot bottom-12 right-12 h-20 w-20 bg-sky-400/30" style={{ animationDelay: "1.2s" }} />
            <div className="relative z-10 max-w-2xl">
              <p className="section-title">Modern full-stack platform</p>
              <h2 className="mt-4 text-3xl font-bold lg:text-5xl">Review courses, rate teachers, and discover what students really think.</h2>
              <p className="mt-6 text-lg text-slate-600 dark:text-slate-300">
                Built for campuses that want polished feedback collection, strong admin oversight, and quick decision-ready reporting.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/login" className="btn-primary">Login</Link>
                <Link to="/register" className="btn-secondary">Create Student Account</Link>
              </div>
              <div className="mt-10 grid gap-4 md:grid-cols-3">
                <div className="metric-orb"><div><p className="text-xs uppercase tracking-[0.25em] text-brand-200">Anonymous</p><p className="mt-2 text-2xl font-bold">Safe</p></div></div>
                <div className="metric-orb"><div><p className="text-xs uppercase tracking-[0.25em] text-brand-200">Analytics</p><p className="mt-2 text-2xl font-bold">Visual</p></div></div>
                <div className="metric-orb"><div><p className="text-xs uppercase tracking-[0.25em] text-brand-200">Admin</p><p className="mt-2 text-2xl font-bold">Actionable</p></div></div>
              </div>
            </div>
          </section>

          <section className="grid gap-4">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="panel-card p-6">
                <div className="inline-flex rounded-2xl bg-brand-500/15 p-3 text-brand-500">
                  <Icon size={24} />
                </div>
                <h3 className="mt-4 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
