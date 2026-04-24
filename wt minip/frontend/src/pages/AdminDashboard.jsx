import { useEffect, useMemo, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { BrainCircuit, Filter, Search, Trash2 } from "lucide-react";

import AdminSidebar from "../components/AdminSidebar";
import FeedbackTable from "../components/FeedbackTable";
import SegmentTabs from "../components/SegmentTabs";
import StatCard from "../components/StatCard";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";


ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);


function AdminDashboard() {
  const { logout } = useAuth();
  const [filters, setFilters] = useState({ course: "", teacher: "", rating: "" });
  const [dashboard, setDashboard] = useState({
    feedback: [],
    stats: {
      total_feedback: 0,
      teacher_average_ratings: [],
      course_average_ratings: [],
      rating_distribution: [],
      summary: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("table");

  const fetchDashboard = async (activeFilters = filters) => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/api/admin/feedback", { params: activeFilters });
      setDashboard(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load admin dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleDelete = async (feedbackId) => {
    try {
      await api.delete(`/api/admin/delete/${feedbackId}`);
      fetchDashboard();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete feedback.");
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get("/api/admin/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "feedback_export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to export feedback.");
    }
  };

  const barData = useMemo(() => ({
    labels: dashboard.stats.teacher_average_ratings.map((item) => item.teacher),
    datasets: [
      {
        label: "Average Rating",
        data: dashboard.stats.teacher_average_ratings.map((item) => item.average_rating),
        backgroundColor: ["#06b6d4", "#22c55e", "#f59e0b", "#8b5cf6", "#ef4444"],
        borderRadius: 12,
      },
    ],
  }), [dashboard.stats.teacher_average_ratings]);

  const pieData = useMemo(() => ({
    labels: dashboard.stats.rating_distribution.map((item) => `${item.rating} Star`),
    datasets: [
      {
        data: dashboard.stats.rating_distribution.map((item) => item.count),
        backgroundColor: ["#ef4444", "#f97316", "#f59e0b", "#22c55e", "#06b6d4"],
        borderWidth: 0,
      },
    ],
  }), [dashboard.stats.rating_distribution]);

  const quickInsights = useMemo(() => {
    const topTeacher = dashboard.stats.teacher_average_ratings[0];
    const strongestRating = [...dashboard.stats.rating_distribution].sort((a, b) => b.count - a.count)[0];
    return {
      topTeacher: topTeacher ? `${topTeacher.teacher} (${topTeacher.average_rating})` : "No data",
      strongestRating: strongestRating ? `${strongestRating.rating} star` : "No data",
    };
  }, [dashboard.stats]);

  return (
    <div className="min-h-screen px-6 py-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[280px_1fr]">
        <AdminSidebar onLogout={logout} onExport={handleExport} />

        <main className="space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="section-title">Administrative insights</p>
              <h1 className="mt-2 text-4xl font-black">Feedback Review Dashboard</h1>
              <p className="mt-2 text-slate-600 dark:text-slate-300">Track sentiment, compare teachers, and manage the full review pipeline.</p>
            </div>
            <ThemeToggle />
          </div>

          {error ? <div className="rounded-2xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-600 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300">{error}</div> : null}

          <section className="grid gap-4 md:grid-cols-3">
            <StatCard label="Total Feedback" value={dashboard.stats.total_feedback} helper="Live submission count" tone="brand" />
            <StatCard
              label="Teachers Tracked"
              value={dashboard.stats.teacher_average_ratings.length}
              helper="Average ratings updated automatically"
              tone="amber"
            />
            <StatCard
              label="Courses Tracked"
              value={dashboard.stats.course_average_ratings.length}
              helper="Filter-ready across your catalog"
              tone="emerald"
            />
          </section>

          <section className="panel-card p-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
              <div className="grid flex-1 gap-3 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium">Course</label>
                  <input
                    className="input-field"
                    placeholder="Filter by course"
                    value={filters.course}
                    onChange={(event) => setFilters((current) => ({ ...current, course: event.target.value }))}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Teacher</label>
                  <input
                    className="input-field"
                    placeholder="Filter by teacher"
                    value={filters.teacher}
                    onChange={(event) => setFilters((current) => ({ ...current, teacher: event.target.value }))}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Rating</label>
                  <select
                    className="input-field"
                    value={filters.rating}
                    onChange={(event) => setFilters((current) => ({ ...current, rating: event.target.value }))}
                  >
                    <option value="">All ratings</option>
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" className="btn-primary gap-2" onClick={() => fetchDashboard(filters)}>
                  <Search size={16} />
                  Apply Filters
                </button>
                <button
                  type="button"
                  className="btn-secondary gap-2"
                  onClick={() => {
                    const reset = { course: "", teacher: "", rating: "" };
                    setFilters(reset);
                    fetchDashboard(reset);
                  }}
                >
                  <Filter size={16} />
                  Reset
                </button>
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            <div className="panel-card p-6 xl:col-span-2">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-brand-500/15 p-3 text-brand-500">
                  <BrainCircuit size={20} />
                </div>
                <div>
                  <p className="section-title">AI summary</p>
                  <h2 className="mt-1 text-2xl font-bold">Overall sentiment</h2>
                </div>
              </div>
              <p className="mt-4 text-slate-600 dark:text-slate-300">{dashboard.stats.summary || "No feedback available yet."}</p>
            </div>
            <div className="panel-card p-6">
              <h2 className="text-2xl font-bold">Quick highlights</h2>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Top teacher</p>
                  <p className="mt-2 text-lg font-bold">{quickInsights.topTeacher}</p>
                </div>
                <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Most common rating</p>
                  <p className="mt-2 text-lg font-bold">{quickInsights.strongestRating}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <div className="panel-card p-6">
              <h2 className="mt-3 text-2xl font-bold">Bar Chart: Teacher Ratings</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">A fast read on your current filtered data.</p>
              <div className="mt-6 h-80">
                <Bar
                  data={barData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, max: 5 } },
                  }}
                />
              </div>
            </div>
            <div className="panel-card p-6">
              <h2 className="text-2xl font-bold">Average Ratings by Course</h2>
              <div className="mt-4 space-y-3">
                {dashboard.stats.course_average_ratings.map((item) => (
                  <div key={item.course} className="flex items-center justify-between rounded-xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
                    <span>{item.course}</span>
                    <span className="font-semibold text-brand-500">{item.average_rating} / 5</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <div className="panel-card p-6 xl:col-span-2">
              <h2 className="text-2xl font-bold">Pie Chart: Rating Distribution</h2>
              <div className="mt-6 h-80">
                <Pie data={pieData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </section>

          <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold">All Feedback</h2>
              <SegmentTabs
                tabs={[
                  { label: "Table", value: "table" },
                  { label: "Cards", value: "cards" },
                ]}
                activeTab={view}
                onChange={setView}
              />
              {loading ? <span className="text-sm text-slate-500">Refreshing data...</span> : null}
            </div>
            {view === "table" ? (
              <FeedbackTable feedback={dashboard.feedback} onDelete={handleDelete} showDelete />
            ) : (
              dashboard.feedback.length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {dashboard.feedback.map((item) => (
                    <div key={item.id} className="panel-card p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm text-slate-500">{item.student_name}</p>
                          <h3 className="mt-1 text-xl font-bold">{item.course}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-300">{item.teacher}</p>
                        </div>
                        <div className="rounded-2xl bg-amber-50 px-3 py-2 text-sm font-bold text-amber-500 dark:bg-amber-500/10">
                          {item.rating}/5
                        </div>
                      </div>
                      <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{item.comment}</p>
                      <div className="mt-5 flex items-center justify-between">
                        <span className="text-xs uppercase tracking-[0.25em] text-slate-500">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="panel-card p-10 text-center text-sm text-slate-500">No feedback matches the current filters.</div>
              )
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
