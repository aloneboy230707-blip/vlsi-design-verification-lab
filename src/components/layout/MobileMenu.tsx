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
  Settings,
  X 
} from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

const ITEMS: Array<{ id: ActiveView; label: string; desc: string; icon: React.ElementType }> = [
  { id: 'dashboard', label: 'Dashboard', desc: 'Overview, stats and active curriculum', icon: LayoutDashboard },
  { id: 'digital-logic', label: 'Logic Playground', desc: '7 logic gates, dynamic truth tables & tests', icon: Binary },
  { id: 'verilog-studio', label: 'Verilog Practice Studio', desc: 'Adders, Muxes, Decoders, Flip-Flops & Counters', icon: Code2 },
  { id: 'verification-bench', label: 'Verification Workbench', desc: 'Test vector evaluation & golden models', icon: Microscope },
  { id: 'learning-library', label: 'Learning Library', desc: 'Digital logic, CMOS, FSM, and STA theory', icon: BookOpen },
  { id: 'interview-prep', label: 'VLSI Interview Prep', desc: 'Curated technical interview questions', icon: GraduationCap },
  { id: 'my-progress', label: 'My Progress', desc: 'Track mastery, practice streaks & milestones', icon: LineChart },
  { id: 'profile-settings', label: 'Settings', desc: 'User profile, theme and configuration', icon: Settings },
];

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  activeView,
  setActiveView,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-slate-900 border-l border-slate-800 p-6 shadow-xl flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <span className="text-sm font-semibold text-slate-200">Lab Navigation</span>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 space-y-1">
            {ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-cyan-950/80 border border-cyan-500/30 text-cyan-300'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs font-semibold">{item.label}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{item.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 text-xs text-slate-500">
          VLSI Design & Verification Lab
        </div>
      </div>
    </div>
  );
};
