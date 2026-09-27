import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatAuthError } from '../lib/auth';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  Trophy,
  ShieldCheck
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, authModalTab, closeAuthModal, signIn, signUp, resetPassword } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(authModalTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [leaderboardOptIn, setLeaderboardOptIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Sync mode with parent tab when modal opens
  useEffect(() => {
    if (authModalOpen) {
      setMode(authModalTab);
      setErrorMsg(null);
      setResetSuccess(false);
      setShowPassword(false);
    }
  }, [authModalOpen, authModalTab]);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setResetSuccess(false);
    setSubmitting(true);

    try {
      if (mode === 'signin') {
        if (!email.trim() || !password) {
          setErrorMsg('Please enter both email and password.');
          setSubmitting(false);
          return;
        }
        await signIn(email, password);
      } else if (mode === 'signup') {
        const cleanName = displayName.trim();
        if (!cleanName) {
          setErrorMsg('Please enter a display name for your account.');
          setSubmitting(false);
          return;
        }
        if (!email.trim() || !password) {
          setErrorMsg('Please enter both email and password.');
          setSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setErrorMsg('Password must be at least 6 characters long.');
          setSubmitting(false);
          return;
        }
        await signUp(email, password, cleanName, leaderboardOptIn);
      } else if (mode === 'reset') {
        if (!email.trim()) {
          setErrorMsg('Please enter your email address to receive reset instructions.');
          setSubmitting(false);
          return;
        }
        await resetPassword(email);
        setResetSuccess(true);
      }
    } catch (err) {
      setErrorMsg(formatAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div
        className="w-full max-w-md max-h-[92vh] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden relative my-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        {/* Top Brand Bar */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center font-mono text-[10px] font-bold text-white shadow-2xs">
              EX
            </div>
            <div>
              <div className="text-xs font-mono font-bold tracking-widest text-indigo-300 uppercase">
                EXAM ROOM
              </div>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Header Content */}
        <div className="px-6 pt-5 pb-3 border-b border-slate-100">
          <h2 id="auth-modal-title" className="text-lg font-bold text-slate-900 tracking-tight">
            {mode === 'signin' && 'Sign in to your account'}
            {mode === 'signup' && 'Create your account'}
            {mode === 'reset' && 'Reset your password'}
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-1">
            {mode === 'signin' && 'Save your exam history, progress, bookmarks and mistakes across devices.'}
            {mode === 'signup' && 'Save your exam history and progress across devices.'}
            {mode === 'reset' && 'Enter your email address to receive password reset instructions.'}
          </p>
        </div>

        {/* Tab Switcher (SignIn / SignUp) */}
        {mode !== 'reset' && (
          <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200 gap-1 text-xs font-mono font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
              }}
              className={`py-2 text-center rounded-lg transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg(null);
              }}
              className={`py-2 text-center rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3 text-xs bg-rose-50 border border-rose-200 text-rose-800 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span className="font-mono">{errorMsg}</span>
            </div>
          )}

          {resetSuccess && (
            <div className="flex items-start gap-2.5 p-3 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span className="font-mono">
                Password reset link has been sent to <strong>{email}</strong>. Please check your inbox.
              </span>
            </div>
          )}

          {/* Display Name (Required during SignUp) */}
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold text-slate-700">
                Display name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. StudyBeast, BioNerd"
                  maxLength={24}
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-bold text-slate-700">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="candidate@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
              />
            </div>
          </div>

          {/* Password Field */}
          {mode !== 'reset' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono font-bold text-slate-700">
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('reset');
                      setErrorMsg(null);
                    }}
                    className="text-[11px] font-mono text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Leaderboard Option during Signup */}
          {mode === 'signup' && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
              <div className="flex items-start gap-2.5">
                <Trophy className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="text-xs font-mono font-bold text-slate-900">
                    Join the leaderboard?
                  </div>
                  <p className="text-[11px] font-mono text-slate-500 leading-relaxed">
                    Your best exam score can appear on public leaderboards under your display name. Your email and other account details stay private.
                  </p>
                </div>
              </div>

              <div className="pt-1.5 border-t border-slate-200/80">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={leaderboardOptIn}
                    onChange={(e) => setLeaderboardOptIn(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="text-xs font-mono font-bold text-slate-800">
                    Show my scores on leaderboards
                  </span>
                </label>
                <div className="text-[10px] font-mono text-slate-400 pl-6 pt-0.5">
                  You can change this anytime in Account Settings.
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </span>
              ) : (
                <>
                  <span>
                    {mode === 'signin' && 'Sign In'}
                    {mode === 'signup' && 'Create Account'}
                    {mode === 'reset' && 'Send Reset Link'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Reset password return */}
          {mode === 'reset' && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg(null);
                  setResetSuccess(false);
                }}
                className="text-xs font-mono font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                ← Return to Sign In
              </button>
            </div>
          )}

          {/* Alternate Mode Action for Sign In */}
          {mode === 'signin' && (
            <div className="pt-2 text-center">
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-[11px] font-mono text-slate-400 uppercase">
                  <span className="bg-white px-2">or</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg(null);
                }}
                className="text-xs font-mono font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
              >
                Create an account →
              </button>
            </div>
          )}

          {/* Alternate Mode Action for Sign Up */}
          {mode === 'signup' && (
            <div className="pt-2 text-center">
              <p className="text-xs font-mono text-slate-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMsg(null);
                  }}
                  className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            </div>
          )}

          {/* Privacy Note */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-center text-[11px] font-mono text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Practice freely with no account required.</span>
          </div>
        </form>
      </div>
    </div>
  );
};
