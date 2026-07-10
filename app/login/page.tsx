"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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

  // Field-specific validation states
  const [userIdError, setUserIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [userName, setUserName] = useState("");

  // ── If already logged in, skip the login page ──────────────────────
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedIn = sessionStorage.getItem("isLoggedIn");
      if (loggedIn === "true") {
        router.replace("/dashboard");
      }
    }
  }, [router]);
  // ──────────────────────────────────────────────────────────────────

  const handleUserIdChange = (val: string) => {
    setUserId(val);
    if (userIdError) setUserIdError("");
    if (error) setError("");
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (passwordError) setPasswordError("");
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUserIdError("");
    setPasswordError("");

    let hasError = false;

    // Validate User ID
    if (!userId.trim()) {
      setUserIdError("User ID is required.");
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userId.trim())) {
        setUserIdError("Please enter a valid email address.");
        hasError = true;
      }
    }

    // Validate Password
    if (!password.trim()) {
      setPasswordError("Password is required.");
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      hasError = true;
    }

    if (hasError) {
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

    // ── Persist auth so refresh doesn't loop back to login ──────────
    if (typeof window !== "undefined") {
      sessionStorage.setItem("isLoggedIn", "true");
    }
    // ──────────────────────────────────────────────────────────────────

    // Extract display name (e.g. "Admin" or "Aman")
    const displayName = match.username.split("@")[0];
    const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
    setUserName(formattedName);
    setIsSuccess(true);

    // Give a beautiful 1.8 second success loading feel before page redirect
    setTimeout(() => {
      router.push("/dashboard");
    }, 1800);
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
        layout
      >
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="login-content"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
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
                <h1 className="login-title">ForgeAxis</h1>
                <p className="login-subtitle">Sign in to your account</p>
              </div>

              <motion.form
                onSubmit={handleSubmit}
                className="login-form"
                noValidate
                animate={error || userIdError || passwordError ? { x: [-8, 8, -8, 8, -4, 4, 0] } : { x: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* User ID */}
                <div className="login-field relative">
                  <label htmlFor="userId" className="login-label">User ID</label>
                  <div className="login-input-wrap">
                    <User size={16} className="login-input-icon" />
                    <input
                      id="userId"
                      type="text"
                      autoComplete="username"
                      placeholder="Enter your user ID"
                      value={userId}
                      onChange={(e) => handleUserIdChange(e.target.value)}
                      className={`login-input ${userIdError ? "login-input-error" : ""}`}
                      disabled={loading}
                    />
                  </div>
                  <AnimatePresence>
                    {userIdError && (
                      <motion.span
                        className="login-field-error-text"
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 4 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        {userIdError}
                      </motion.span>
                    )}
                  </AnimatePresence>
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
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      className={`login-input login-input-pw ${passwordError ? "login-input-error" : ""}`}
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
                  <AnimatePresence>
                    {passwordError && (
                      <motion.span
                        className="login-field-error-text"
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 4 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        {passwordError}
                      </motion.span>
                    )}
                  </AnimatePresence>
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
              </motion.form>
            </motion.div>
          ) : (
            <motion.div
              key="success-loader"
              className="login-success-view"
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Glowing checkmark animation */}
              <div className="success-icon-wrap">
                <motion.div
                  className="success-icon-glow"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                />
                <svg className="success-svg" viewBox="0 0 52 52">
                  <motion.circle
                    className="success-circle"
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                  <motion.path
                    className="success-check"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    d="M14 27l7.5 7.5 16.5-16.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
                  />
                </svg>
              </div>

              <div className="success-text-wrap">
                <h2 className="success-title">Welcome back, {userName}!</h2>
                <p className="success-subtitle">Establishing secure connection...</p>
              </div>

              {/* Glowing horizontal progress bar */}
              <div className="success-progress-bg">
                <motion.div
                  className="success-progress-bar"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.6, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
