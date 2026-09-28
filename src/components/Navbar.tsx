import React, { useState } from 'react';
import {
  FileText,
  Layers,
  BarChart2,
  Bookmark,
  AlertCircle,
  Menu,
  X,
  Target,
  User,
  Trophy
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  bookmarksCount: number;
  mistakesCount: number;
  onStartDailyPractice?: () => void;
}

export const Navbar: React.FC<NavbarProps> = React.memo(({
  currentView,
  onNavigate,
  bookmarksCount,
  mistakesCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, openAuthModal } = useAuth();

  const navItems = [
    { id: 'exams', label: 'Exams', icon: FileText },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'bank', label: 'Question Bank', icon: Layers },
    { id: 'generator', label: 'Custom Exam', icon: Target },
    { id: 'mistakes', label: 'Mistakes', icon: AlertCircle, count: mistakesCount },
    { id: 'saved', label: 'Bookmarks', icon: Bookmark, count: bookmarksCount },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 }
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-2 sm:top-3 z-40 w-full max-w-7xl mx-auto px-2.5 sm:px-6 transform-gpu">
      <div className="w-full rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.35),inset_0_1px_1px_0_rgba(255,255,255,0.12)] text-white px-3 sm:px-5 transition-all">
        <div className="flex items-center justify-between h-14 gap-1.5 sm:gap-2 min-w-0">
          {/* Brand Mark: Distinctive Testing Platform Identity */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 shrink">
            <button
              onClick={() => handleNavClick('exams')}
              className="flex items-center gap-2 sm:gap-2.5 group focus:outline-none cursor-pointer min-w-0"
            >
              {/* Exam Room Assessment Paper Brand Mark */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#22223B] border border-[#C9ADA7]/40 flex items-center justify-center shadow-xs group-hover:border-[#C9ADA7]/80 group-hover:bg-[#4A4E69] transition-all shrink-0">
                <svg
                  className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#F2E9E4]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Paper sheet */}
                  <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" stroke="#C9ADA7" fill="#22223B" />
                  {/* Folded corner */}
                  <path d="M14 3v4h4" stroke="#C9ADA7" />
                  {/* Subtle test question lines */}
                  <line x1="9" y1="10.5" x2="15" y2="10.5" stroke="#9A8C98" strokeWidth="1.5" />
                  <line x1="9" y1="13.5" x2="12.5" y2="13.5" stroke="#9A8C98" strokeWidth="1.5" />
                  {/* Assessment checkmark */}
                  <path d="M9 17l1.75 1.75L15 14.5" stroke="#F2E9E4" strokeWidth="2" />
                </svg>
              </div>

              <div className="flex flex-col text-left min-w-0">
                <span className="text-xs sm:text-base font-bold tracking-tight text-white leading-none truncate">
                  EXAM ROOM
                </span>
                <span className="text-[8px] sm:text-[10px] font-mono tracking-widest text-[#C9ADA7] uppercase truncate">
                  CBT PLATFORM
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links (>= 1280px XL screens) */}
          <nav className="hidden xl:flex items-center space-x-1 flex-1 justify-center max-w-3xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-white/12 text-white ring-1 ring-white/20 shadow-xs font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-white/8 ring-1 ring-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-950/80 text-indigo-300 border border-white/10 rounded-md font-semibold tabular-nums">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Quick Action & Account (>= 1280px XL screens) */}
          <div className="hidden xl:flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleNavClick('leaderboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs font-bold rounded-lg border transition-all shadow-xs cursor-pointer ${
                currentView === 'leaderboard'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-1 ring-amber-500/30'
                  : 'bg-white/6 text-amber-400 hover:text-amber-300 hover:bg-white/10 border-white/10'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Leaderboard</span>
            </button>

            {user ? (
              <button
                onClick={() => handleNavClick('account')}
                title={user.email || 'Account'}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  currentView === 'account'
                    ? 'bg-white/12 text-white border-white/20 ring-1 ring-white/20'
                    : 'bg-white/6 text-slate-300 hover:text-white border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="max-w-[110px] truncate">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('signin')}
                className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs font-semibold text-slate-200 hover:text-white bg-white/8 hover:bg-white/14 rounded-lg border border-white/12 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
              >
                <User className="w-3.5 h-3.5 text-slate-300" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Tablet & Mobile Header Right (< 1280px screens) */}
          <div className="flex xl:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Leaderboard Action: ALWAYS VISIBLE across Desktop, Tablet, and Mobile */}
            <button
              onClick={() => handleNavClick('leaderboard')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 font-mono text-xs font-bold rounded-lg border transition-all cursor-pointer shadow-xs ${
                currentView === 'leaderboard'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-1 ring-amber-500/30'
                  : 'bg-white/6 text-amber-400 hover:text-amber-300 hover:bg-white/10 border-white/10'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">Leaderboard</span>
              <span className="sm:hidden">Ranks</span>
            </button>

            {user ? (
              <button
                onClick={() => handleNavClick('account')}
                className="p-1.5 text-slate-300 hover:text-white bg-white/8 hover:bg-white/12 border border-white/10 rounded-lg flex items-center gap-1.5 cursor-pointer max-w-[120px] sm:max-w-[160px]"
                title={user.email || 'Account'}
                aria-label="Account"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-xs font-mono font-medium truncate hidden md:inline">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
                <User className="w-3.5 h-3.5 text-slate-300 md:hidden" />
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('signin')}
                className="px-2.5 py-1 font-mono text-xs font-bold text-slate-200 hover:text-white bg-white/8 hover:bg-white/14 border border-white/10 rounded-lg cursor-pointer"
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Tablet & Mobile Drawer (< 1280px screens) */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-white/10 pt-3 pb-3 space-y-1 w-full animate-in fade-in duration-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pb-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white/14 text-white ring-1 ring-white/20 font-bold'
                        : 'text-slate-300 hover:bg-white/8 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && item.count > 0 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-950/80 text-indigo-300 border border-white/10 rounded-md font-semibold tabular-nums">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-white/10 space-y-1">
              {user ? (
                <button
                  onClick={() => handleNavClick('account')}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg text-slate-300 hover:bg-white/8 cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <User className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">Account ({user.displayName || user.email?.split('@')[0]})</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 shrink-0 uppercase font-bold">Synced</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('signin');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-indigo-200 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-400/20 cursor-pointer"
                >
                  <User className="w-4 h-4 text-indigo-400" />
                  <span>Sign In / Create Account</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
});
