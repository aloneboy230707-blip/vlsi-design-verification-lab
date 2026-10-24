import React from 'react';
import { ActiveView } from '../../types/vlsi';
import { Cpu, Sun, Moon, Menu, X, CheckCircle2, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  theme,
  setTheme,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const { effectiveName } = useAuth();
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => setActiveView('dashboard')}
          className="flex items-center gap-2.5 text-left text-slate-100 hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors">
            <Cpu className="w-4 h-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-white group-hover:text-cyan-300">
            VLSI Lab
          </span>
        </button>

        {/* Zone 2: Primary navigation links (single line, concise) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeView === 'dashboard'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveView('digital-logic')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeView === 'digital-logic'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Logic Playground
          </button>
          <button
            onClick={() => setActiveView('verilog-studio')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeView === 'verilog-studio'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Verilog Studio
          </button>
          <button
            onClick={() => setActiveView('verification-bench')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeView === 'verification-bench'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Workbench
          </button>
          <button
            onClick={() => setActiveView('interview-prep')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeView === 'interview-prep'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Interview Prep
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action & Utilities */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleTheme}
            aria-label="Toggle visual theme"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>

          <button
            onClick={() => setActiveView('profile-settings')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md transition-colors whitespace-nowrap"
            title="Account & Isolation Settings"
          >
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{effectiveName.split(' ')[0]}</span>
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
