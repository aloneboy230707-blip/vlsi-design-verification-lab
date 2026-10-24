import React from 'react';
import { ActiveView } from '../../types/vlsi';
import { 
  LayoutDashboard, 
  Binary, 
  Code2, 
  Microscope, 
  BookOpen, 
  GraduationCap, 
  LineChart, 
  Settings 
} from 'lucide-react';

interface AppSubNavProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

const NAV_ITEMS: Array<{ id: ActiveView; label: string; icon: React.ElementType }> = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'digital-logic', label: 'Logic Playground', icon: Binary },
  { id: 'verilog-studio', label: 'Verilog Studio', icon: Code2 },
  { id: 'verification-bench', label: 'Workbench', icon: Microscope },
  { id: 'learning-library', label: 'Learning Library', icon: BookOpen },
  { id: 'interview-prep', label: 'Interview Prep', icon: GraduationCap },
  { id: 'my-progress', label: 'My Progress', icon: LineChart },
  { id: 'profile-settings', label: 'Settings', icon: Settings },
];

export const AppSubNav: React.FC<AppSubNavProps> = ({ activeView, setActiveView }) => {
  return (
    <nav className="w-full bg-slate-900/60 border-b border-slate-800/80 overflow-x-auto scrollbar-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 py-1.5 min-w-max">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
