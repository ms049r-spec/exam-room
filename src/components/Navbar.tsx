import React, { useState } from 'react';
import {
  FileText,
  Layers,
  Sparkles,
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
  onStartDailyPractice: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  bookmarksCount,
  mistakesCount,
  onStartDailyPractice
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
    <header className="sticky top-0 z-40 w-full bg-slate-900 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 w-full">
        <div className="flex items-center justify-between h-14 gap-2">
          {/* Brand Mark: Distinctive Testing Platform Identity */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => handleNavClick('exams')}
              className="flex items-center gap-2 sm:gap-2.5 group focus:outline-none cursor-pointer"
            >
              {/* CBT Test Grid Icon */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-indigo-600 border border-indigo-400/40 flex items-center justify-center shadow-xs group-hover:bg-indigo-500 transition-colors shrink-0">
                <div className="grid grid-cols-2 gap-0.5 sm:gap-1 p-1">
                  <div className="w-1.5 h-1.5 rounded-[1px] bg-white"></div>
                  <div className="w-1.5 h-1.5 rounded-[1px] bg-indigo-200"></div>
                  <div className="w-1.5 h-1.5 rounded-[1px] bg-indigo-300"></div>
                  <div className="w-1.5 h-1.5 rounded-[1px] bg-white"></div>
                </div>
              </div>

              <div className="flex flex-col text-left">
                <span className="text-sm sm:text-base font-bold tracking-tight text-white leading-none">
                  EXAM ROOM
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-indigo-300 uppercase">
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
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-white ring-1 ring-slate-700 shadow-xs border-b-2 border-indigo-400 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60 ring-1 ring-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-950 text-indigo-300 border border-slate-700/80 rounded font-semibold tabular-nums">
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
              className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs font-bold rounded-md border transition-all shadow-xs cursor-pointer ${
                currentView === 'leaderboard'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-1 ring-amber-500/30'
                  : 'bg-slate-800/80 text-amber-400 hover:text-amber-300 hover:bg-slate-800 border-slate-700/80'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Leaderboard</span>
            </button>

            <button
              onClick={onStartDailyPractice}
              className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md border border-indigo-400/40 transition-all shadow-xs active:scale-[0.98] tracking-tight cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span>Daily Sprint</span>
            </button>

            {user ? (
              <button
                onClick={() => handleNavClick('account')}
                title={user.email || 'Account'}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-xs font-semibold rounded-md border transition-all cursor-pointer ${
                  currentView === 'account'
                    ? 'bg-slate-800 text-white border-slate-700 ring-1 ring-slate-700'
                    : 'bg-slate-800/80 text-slate-300 hover:text-white border-slate-700/80 hover:bg-slate-800'
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
                className="flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-md border border-slate-700/80 transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Tablet & Mobile Header Right (< 1280px screens) */}
          <div className="flex xl:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => handleNavClick('leaderboard')}
              className={`hidden sm:flex items-center gap-1 px-2 sm:px-2.5 py-1 font-mono text-xs font-bold rounded-md border transition-all cursor-pointer shadow-xs ${
                currentView === 'leaderboard'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-1 ring-amber-500/30'
                  : 'bg-slate-800/80 text-amber-400 hover:text-amber-300 hover:bg-slate-800 border-slate-700/80'
              }`}
            >
              <Trophy className="w-3 h-3 text-amber-400" />
              <span className="hidden md:inline">Leaderboard</span>
              <span className="md:hidden">Ranks</span>
            </button>

            <button
              onClick={onStartDailyPractice}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 font-mono text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md border border-indigo-400/40 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3 h-3 text-indigo-200" />
              <span className="hidden sm:inline">Daily Sprint</span>
              <span className="sm:hidden">Sprint</span>
            </button>

            {user ? (
              <button
                onClick={() => handleNavClick('account')}
                className="p-1.5 text-slate-300 hover:text-white bg-slate-800 border border-slate-700 rounded-md flex items-center gap-1.5 cursor-pointer max-w-[120px] sm:max-w-[160px]"
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
                className="px-2.5 py-1 font-mono text-xs font-bold text-slate-300 hover:text-white bg-slate-800 border border-slate-700 rounded cursor-pointer"
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md cursor-pointer transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Tablet & Mobile Drawer (< 1280px screens) */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-800 bg-slate-900 px-4 py-3 space-y-1 w-full animate-in fade-in duration-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pb-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-white ring-1 ring-slate-700 border-l-2 border-indigo-400 font-bold'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-950 text-indigo-300 border border-slate-700/80 rounded font-semibold tabular-nums">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800">
            {user ? (
              <button
                onClick={() => handleNavClick('account')}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-md text-slate-300 hover:bg-slate-800/60 cursor-pointer"
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
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-md text-indigo-300 bg-slate-800/50 hover:bg-slate-800 cursor-pointer"
              >
                <User className="w-4 h-4 text-indigo-400" />
                <span>Sign In / Create Account</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
