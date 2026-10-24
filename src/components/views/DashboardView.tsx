import React from 'react';
import { ActiveView, UserProgressData } from '../../types/vlsi';
import { 
  Binary, 
  Code2, 
  Microscope, 
  GraduationCap, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  Award,
  Zap,
  Clock
} from 'lucide-react';

interface DashboardViewProps {
  setActiveView: (view: ActiveView) => void;
  progress: UserProgressData;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ setActiveView, progress }) => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 p-6 sm:p-8">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>Digital VLSI & Verification Training Ground</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white text-balance">
            Master RTL Design, Digital Electronics, and ASIC Verification
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            Prepare for top semiconductor and product company placements (Intel, NVIDIA, Qualcomm, AMD, TI) through hands-on Boolean logic simulations, Verilog HDL exercises, testbench verification, and interview questions.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveView('digital-logic')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-xs"
            >
              <span>Explore Digital Logic Playground</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveView('learning-library')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>Browse Syllabus</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Quick Stats Strip (Tabular Numerals, Unboxed text) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Verified Logic Tests</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono tabular-nums">
            51 / 51
          </div>
          <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
            100% Pass Rate
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Logic Score</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono tabular-nums">
            {progress.logicScore} pts
          </div>
          <div className="text-[11px] text-cyan-400 font-medium mt-0.5">
            Boolean Mastery
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Practice Streak</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono tabular-nums">
            {progress.practiceStreakDays} Days
          </div>
          <div className="text-[11px] text-amber-400 font-medium mt-0.5">
            Active Momentum
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Placement Readiness</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono tabular-nums">
            Stage 1 & 2 Active
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-0.5">
            Foundations Online
          </div>
        </div>
      </div>

      {/* Lab Modules Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white">Interactive Engineering Modules</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Hands-on environments designed for deep conceptual mastery and placement practice.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Module 1: Digital Logic Playground (Stage 2 - Active) */}
          <div 
            onClick={() => setActiveView('digital-logic')}
            className="group cursor-pointer p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-900 transition-colors">
                  <Binary className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-emerald-400">
                  Ready · Interactive
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                Digital Logic Playground
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                7 IEEE standard gates (AND, OR, NOT, NAND, NOR, XOR, XNOR) with dynamic live truth tables, Boolean expression evaluations, and automated unit test suite.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-cyan-400 font-medium">
              <span>Launch Simulator</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 2: Verilog Practice Studio (Stage 3 Preview) */}
          <div 
            onClick={() => setActiveView('verilog-studio')}
            className="group cursor-pointer p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-cyan-400 transition-colors">
                  <Code2 className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-400">
                  Stage 3 Lab
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                Verilog Practice Studio
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Problem statements, RTL code editors, and verified golden solutions for Half/Full Adders, 2:1 & 4:1 Multiplexers, Decoders, D-Flip-Flops, and Synchronous Counters.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-cyan-400 font-medium">
              <span>View Code Modules</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 3: Verification Workbench (Stage 4 Preview) */}
          <div 
            onClick={() => setActiveView('verification-bench')}
            className="group cursor-pointer p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-cyan-400 transition-colors">
                  <Microscope className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-400">
                  Stage 4 Lab
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                Verification Workbench
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Test-vector input injection, expected vs actual assertion checkers, edge-case validation, and timing waveform visualizers.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-cyan-400 font-medium">
              <span>View Testbench System</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 4: Learning Library */}
          <div 
            onClick={() => setActiveView('learning-library')}
            className="group cursor-pointer p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-cyan-400 transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-cyan-400">
                  7 Core Tracks
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                Learning Library
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Comprehensive curriculum covering Boolean algebra, CMOS layouts, combinational & sequential RTL, FSMs, and Static Timing Analysis (STA).
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-cyan-400 font-medium">
              <span>Open Library</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 5: Interview Preparation */}
          <div 
            onClick={() => setActiveView('interview-prep')}
            className="group cursor-pointer p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-cyan-400 transition-colors">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-cyan-400">
                  Placement Focus
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                VLSI Interview Preparation
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Real technical interview questions on setup/hold violations, CDC, metastability, blocking vs non-blocking assignments, and UVM basics.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-cyan-400 font-medium">
              <span>Practice Questions</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
