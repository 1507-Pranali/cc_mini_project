import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";


function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "", role: "student" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Username and password are required.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/api/register", formData);
      login(response.data.token, response.data.user);
      navigate("/student");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to register right now.");
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
        <p className="section-title">Student onboarding</p>
        <h1 className="mt-3 text-3xl font-bold">Create your account</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Students can register here and start sharing feedback immediately.</p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <input
            className="input-field"
            placeholder="Choose a username"
            value={formData.username}
            onChange={(event) => setFormData((current) => ({ ...current, username: event.target.value }))}
          />
          <input
            type="password"
            className="input-field"
            placeholder="Create a password"
            value={formData.password}
            onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
          />
          {error ? <p className="text-sm text-rose-500">{error}</p> : null}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-500 hover:text-brand-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
