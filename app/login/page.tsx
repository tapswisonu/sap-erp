"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, User, Loader2 } from "lucide-react";

// ── Allowed users ────────────────────────────────────────────────────
const USERS = [
  { username: "admin@test.com", password: "test@123" },
  { username: "aman@test.com",  password: "test@123" },
];
// ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!userId.trim() || !password.trim()) {
      setError("Please enter both User ID and Password.");
      return;
    }

    setLoading(true);
    await new Promise((res) => setTimeout(res, 800));

    const match = USERS.find(
      (u) => u.username === userId.trim() && u.password === password
    );

    if (!match) {
      setLoading(false);
      setError("Invalid User ID or Password.");
      return;
    }

    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="login-root">
      {/* Animated background orbs */}
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />
      <div className="login-orb login-orb-3" />

      {/* Grid overlay */}
      <div className="login-grid" />

      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Logo / Brand */}
        <div className="login-brand">
          <div className="login-logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="url(#lg)" />
              <path d="M7 14h14M14 7v14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
              <defs>
                <linearGradient id="lg" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#22d3ee" />
                  <stop offset="1" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="login-title">XYZ Manufacturing</h1>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {/* User ID */}
          <div className="login-field">
            <label htmlFor="userId" className="login-label">User ID</label>
            <div className="login-input-wrap">
              <User size={16} className="login-input-icon" />
              <input
                id="userId"
                type="text"
                autoComplete="username"
                placeholder="Enter your user ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="login-input"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-field">
            <label htmlFor="password" className="login-label">Password</label>
            <div className="login-input-wrap">
              <Lock size={16} className="login-input-icon" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input login-input-pw"
                disabled={loading}
              />
              <button
                type="button"
                id="toggle-password"
                className="login-eye-btn"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.p
              className="login-error"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.p>
          )}

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="login-spinner" />
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
