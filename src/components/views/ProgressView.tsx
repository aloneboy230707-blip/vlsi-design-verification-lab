import React from 'react';
import { UserProgressData } from '../../types/vlsi';
import { Award, CheckCircle2, Flame, LineChart, Target, Zap, Clock, ShieldCheck } from 'lucide-react';

interface ProgressViewProps {
  progress: UserProgressData;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ progress }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
            Placement Analytics
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-xs text-slate-400">
            Student Performance & Milestones
          </span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white mt-0.5">
          My Learning Progress
        </h1>
      </div>

      {/* Top 4 Quantitative Scorecards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Boolean Logic Score</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono tabular-nums">
            {progress.logicScore}
          </div>
          <div className="text-[11px] text-cyan-400 font-medium mt-0.5">
            Points Earned
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Verified Unit Tests</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono tabular-nums">
            51 / 51
          </div>
          <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
            100% Logic Verified
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Practice Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono tabular-nums">
            {progress.practiceStreakDays} Days
          </div>
          <div className="text-[11px] text-amber-400 font-medium mt-0.5">
            Consecutive Learning
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Stage Status</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono tabular-nums">
            Stage 1 & 2
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-0.5">
            Core Prototype Verified
          </div>
        </div>
      </div>

      {/* Curriculum Mastery Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white">
            Curriculum Domain Mastery
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-slate-300">Digital Logic & Gate Level Equations</span>
                <span className="font-mono text-cyan-400">100%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-cyan-400 h-full rounded-full transition-all" style={{ width: '100%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-slate-300">Boolean Expression Reduction & Practice</span>
                <span className="font-mono text-cyan-400">75%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-cyan-400 h-full rounded-full transition-all" style={{ width: '75%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-slate-300">Verilog RTL Module Construction (Stage 3)</span>
                <span className="font-mono text-slate-500">40%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-cyan-500/50 h-full rounded-full transition-all" style={{ width: '40%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-slate-300">Testbench Assertions & Verification Vectors (Stage 4)</span>
                <span className="font-mono text-slate-500">30%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-cyan-500/40 h-full rounded-full transition-all" style={{ width: '30%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-slate-300">Static Timing Analysis & CDC Concepts</span>
                <span className="font-mono text-slate-500">20%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-cyan-500/30 h-full rounded-full transition-all" style={{ width: '20%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Target Profile Card */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">Target Placement Goal</h2>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-500">Primary Role</div>
            <div className="text-xs font-bold text-white">{progress.targetRole}</div>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-500">Target Companies</div>
            <div className="text-xs font-bold text-cyan-300">Intel, NVIDIA, Qualcomm, AMD, TI</div>
          </div>

          <div className="pt-2 text-xs text-slate-400 leading-relaxed">
            Persistent profile and Firestore database synchronization will be connected in Stage 5.
          </div>
        </div>
      </div>
    </div>
  );
};
