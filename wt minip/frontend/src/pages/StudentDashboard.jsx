import { useEffect, useMemo, useState } from "react";
import { LogOut, Send, Sparkles, TrendingUp } from "lucide-react";

import FeedbackTable from "../components/FeedbackTable";
import SegmentTabs from "../components/SegmentTabs";
import StarRatingInput from "../components/StarRatingInput";
import StatCard from "../components/StatCard";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";


const initialForm = {
  course: "",
  teacher: "",
  rating: 5,
  comment: "",
  anonymous: false,
};


function StudentDashboard() {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState(initialForm);
  const [feedback, setFeedback] = useState([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("history");

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/feedback");
      setFeedback(response.data.feedback);
      setSummary(response.data.summary);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load feedback history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.course.trim() || !formData.teacher.trim() || !formData.comment.trim()) {
      setError("Please complete every field before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/api/feedback", formData);
      setSuccess("Feedback submitted successfully.");
      setFormData(initialForm);
      fetchFeedback();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  const stats = useMemo(() => {
    const total = feedback.length;
    const average =
      total > 0 ? (feedback.reduce((sum, item) => sum + item.rating, 0) / total).toFixed(1) : "0.0";
    const anonymousCount = feedback.filter((item) => item.anonymous).length;
    return { total, average, anonymousCount };
  }, [feedback]);

  return (
    <div className="min-h-screen px-6 py-8 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="section-title">Student dashboard</p>
            <h1 className="mt-2 text-4xl font-black">Welcome, {user.username}</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Submit reviews, track what you've shared, and stay anonymous when needed.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ThemeToggle />
            <button type="button" onClick={logout} className="btn-secondary gap-2">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Feedback Submitted" value={stats.total} helper="Your review activity" tone="brand" />
          <StatCard label="Average Rating Given" value={`${stats.average} / 5`} helper="Based on your history" tone="amber" />
          <StatCard label="Anonymous Posts" value={stats.anonymousCount} helper="Identity hidden on these entries" tone="emerald" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="panel-card p-6">
            <h2 className="text-2xl font-bold">Submit Feedback</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Use the interactive form below to create a detailed review.</p>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <input
                className="input-field"
                placeholder="Course name"
                value={formData.course}
                onChange={(event) => setFormData((current) => ({ ...current, course: event.target.value }))}
              />
              <input
                className="input-field"
                placeholder="Teacher name"
                value={formData.teacher}
                onChange={(event) => setFormData((current) => ({ ...current, teacher: event.target.value }))}
              />
              <StarRatingInput
                value={formData.rating}
                onChange={(value) => setFormData((current) => ({ ...current, rating: value }))}
              />
              <textarea
                className="input-field min-h-32"
                placeholder="Share your feedback"
                value={formData.comment}
                onChange={(event) => setFormData((current) => ({ ...current, comment: event.target.value }))}
              />
              <label className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.anonymous}
                  onChange={(event) => setFormData((current) => ({ ...current, anonymous: event.target.checked }))}
                />
                Submit anonymously
              </label>
              {error ? <p className="text-sm text-rose-500">{error}</p> : null}
              {success ? <p className="text-sm text-emerald-500">{success}</p> : null}
              <button type="submit" className="btn-primary w-full gap-2" disabled={submitting}>
                <Send size={16} />
                {submitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Live preview</p>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                {formData.course || "Course"} with {formData.teacher || "Teacher"} rated{" "}
                <span className="font-semibold text-amber-500">{formData.rating}/5</span>
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {formData.comment || "Your comments will appear here as you type."}
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <div className="panel-card p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-brand-500/15 p-3 text-brand-500">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className="section-title">AI summary</p>
                  <h2 className="mt-1 text-2xl font-bold">Your feedback snapshot</h2>
                </div>
              </div>
              <p className="mt-4 text-slate-600 dark:text-slate-300">{summary || "No summary available yet."}</p>
            </div>
            <div className="panel-card p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-500">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="section-title">Engagement</p>
                  <h2 className="mt-1 text-2xl font-bold">How your activity looks</h2>
                </div>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Total</p>
                  <p className="mt-2 text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Average</p>
                  <p className="mt-2 text-2xl font-bold">{stats.average}</p>
                </div>
                <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Anonymous</p>
                  <p className="mt-2 text-2xl font-bold">{stats.anonymousCount}</p>
                </div>
              </div>
            </div>
            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-bold">Feedback History</h2>
                <SegmentTabs
                  tabs={[
                    { label: "All", value: "history" },
                    { label: "Anonymous", value: "anonymous" },
                  ]}
                  activeTab={activeTab}
                  onChange={setActiveTab}
                />
                {loading ? <span className="text-sm text-slate-500">Loading...</span> : null}
              </div>
              <FeedbackTable
                feedback={activeTab === "anonymous" ? feedback.filter((item) => item.anonymous) : feedback}
                emptyMessage="No feedback matches this view yet."
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
