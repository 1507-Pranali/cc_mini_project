import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";


function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Please fill in both username and password.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/api/login", formData);
      login(response.data.token, response.data.user);
      navigate(response.data.user.role === "admin" ? "/admin" : "/student");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to login right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>
      <div className="panel-card w-full max-w-md p-8">
        <p className="section-title">Welcome back</p>
        <h1 className="mt-3 text-3xl font-bold">Login to your account</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Student and admin accounts use the same secure sign-in form.</p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <input
            className="input-field"
            placeholder="Username"
            value={formData.username}
            onChange={(event) => setFormData((current) => ({ ...current, username: event.target.value }))}
          />
          <input
            type="password"
            className="input-field"
            placeholder="Password"
            value={formData.password}
            onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
          />
          {error ? <p className="text-sm text-rose-500">{error}</p> : null}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-dashed border-brand-300/60 bg-brand-50/70 p-4 text-xs text-slate-600 dark:border-brand-700 dark:bg-brand-950/20 dark:text-slate-300">
          Demo accounts: <span className="font-semibold">admin / admin123</span>, <span className="font-semibold">alice / student123</span>
        </div>

        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          New student?{" "}
          <Link to="/register" className="font-semibold text-brand-500 hover:text-brand-400">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
