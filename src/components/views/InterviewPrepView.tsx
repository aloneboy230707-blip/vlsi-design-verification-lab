import React, { useState } from 'react';
import { InterviewQuestionItem } from '../../types/vlsi';
import { GraduationCap, ChevronDown, ChevronUp, Building2, Lightbulb, Search } from 'lucide-react';

const INTERVIEW_QUESTIONS: InterviewQuestionItem[] = [
  {
    id: 'int-1',
    topic: 'Static Timing Analysis (STA)',
    difficulty: 'Core Fundamentals',
    question: 'Explain Setup Time and Hold Time. What happens if either is violated, and how is each violation fixed?',
    modelAnswer: `1. Setup Time (Tsu): The minimum duration before the active clock edge during which data must remain stable at the register input pin.
   - Violation causes the register to capture invalid/metastable data.
   - Fixed by: Decreasing combinational logic delay, pipelining, sizing up driver cells, or reducing the clock operating frequency (increasing clock period Tclk).

2. Hold Time (Th): The minimum duration after the active clock edge during which data must remain stable.
   - Violation causes the new data launched by the current clock edge to race ahead and corrupt the data being captured by the same or subsequent register on the same edge.
   - Fixed by: Adding delay buffers into the datapath (increasing Tcomb_min). Lowering clock frequency does NOT fix hold violations!`,
    frequentlyAskedAt: ['NVIDIA', 'Intel', 'Qualcomm', 'Apple'],
    keyTakeaway: 'Setup violations depend on clock period (Tclk); hold violations are completely independent of clock period.',
  },
  {
    id: 'int-2',
    topic: 'Verilog RTL Semantics',
    difficulty: 'Intermediate RTL',
    question: 'What is the precise difference between blocking (=) and non-blocking (<=) procedural assignments in Verilog?',
    modelAnswer: `In the Verilog event scheduler:
- Blocking (=): Evaluated and assigned immediately in the Active event region before the execution proceeds to the next statement in the procedural block. If used for sequential circuits, it creates simulation race conditions that depend on order of execution.
- Non-blocking (<=): Evaluates the right-hand side (RHS) during the Active event region, but schedules the actual write update to the left-hand side (LHS) for the Non-Blocking Assignment (NBA) event region at the end of the simulation time step.

Golden rule: Always use non-blocking assignments (<=) for sequential logic (clocked always blocks) to accurately model concurrent hardware register updates and prevent simulation mismatches. Use blocking (=) for purely combinational always blocks.`,
    frequentlyAskedAt: ['Qualcomm', 'Broadcom', 'AMD', 'TI'],
    keyTakeaway: 'Sequential registers update concurrently in silicon; non-blocking NBA preserves this concurrent behavior in simulation.',
  },
  {
    id: 'int-3',
    topic: 'Clock Domain Crossing (CDC)',
    difficulty: 'Advanced Verification / STA',
    question: 'How do you transfer a single-bit control signal between two completely asynchronous clock domains? Why is a 2-flip-flop synchronizer used?',
    modelAnswer: `When a signal transitions close to the receiving clock edge, the receiving register violates setup or hold time, causing its output to enter a metastable state (neither valid 0 nor 1 for a duration).

To prevent metastability from propagating into downstream logic, a 2-Flip-Flop (2-FF) synchronizer is used:
1. First Flip-Flop (FF1) samples the asynchronous signal in the destination clock domain. If timing is violated, FF1 may become metastable.
2. The full destination clock period provides time for FF1's internal feedback inverter latch to resolve and settle to a deterministic 0 or 1 before the second Flip-Flop (FF2) samples it.
3. FF2 provides a clean, synchronized logic level to downstream logic with a high Mean Time Between Failures (MTBF).

Note: For multi-bit buses, a 2-FF synchronizer cannot be used directly because bits may arrive with different skew, creating invalid intermediate values. An asynchronous FIFO, Gray code pointer, or handshake protocol must be used instead.`,
    frequentlyAskedAt: ['NVIDIA', 'AMD', 'MediaTek', 'Synopsys'],
    keyTakeaway: '2-FF synchronizers reduce probability of metastability (MTBF) for 1-bit signals; never synchronize independent multi-bit parallel buses directly.',
  },
  {
    id: 'int-4',
    topic: 'Low Power & CMOS',
    difficulty: 'Core Fundamentals',
    question: 'What are the three major components of power dissipation in CMOS circuits? How is clock gating implemented to reduce power?',
    modelAnswer: `Total Power = P_dynamic_switching + P_short_circuit + P_static_leakage:
1. Dynamic Switching: P = α · C_load · Vdd² · f_clk (energy charged/discharged across capacitive nodes).
2. Short-Circuit Power: Current flowing directly from Vdd to GND during input transitions when both PMOS and NMOS are momentarily ON.
3. Static Leakage: Subthreshold leakage, gate oxide tunneling, and reverse-biased junction leakage current even when the circuit is idle.

Clock Gating:
Disables the clock distribution to inactive registers or idle execution units. An integrated clock gating (ICG) cell uses an active-low latch paired with an AND gate to eliminate glitches on the gated clock signal, reducing dynamic switching power to near zero when the unit is inactive.`,
    frequentlyAskedAt: ['Intel', 'Apple', 'Arm', 'Qualcomm'],
    keyTakeaway: 'Clock gating targets the dynamic power term (α·C·V²·f) by forcing activity factor α to 0 during idle cycles.',
  },
  {
    id: 'int-5',
    topic: 'RTL Verification & UVM',
    difficulty: 'Advanced Verification / STA',
    question: 'What is the difference between Code Coverage and Functional Coverage? Can 100% code coverage guarantee a bug-free design?',
    modelAnswer: `1. Code Coverage: Automatically measured by the HDL simulator. Analyzes the execution of written RTL code (Line coverage, Branch/Decision coverage, Condition/Expression coverage, FSM state/transition coverage, Toggle coverage).
2. Functional Coverage: User-defined metrics based on the design specification. Uses covergroups and coverpoints to verify that specific functional scenarios, corner cases, error responses, and protocol combinations occurred.

Does 100% code coverage guarantee a bug-free design?
NO. Code coverage only proves that the code you wrote was executed; it CANNOT detect:
- Missing hardware features that were never written in the RTL.
- Incomplete specification requirements.
- Incorrect functionality that happens to execute every line of code without failing an assertion.
Only a comprehensive verification plan with 100% functional coverage and constrained-random testing provides confidence.`,
    frequentlyAskedAt: ['Cadence', 'Synopsys', 'NVIDIA', 'Cisco'],
    keyTakeaway: 'Code coverage verifies implementation execution; functional coverage verifies design intent satisfaction.',
  },
];

export const InterviewPrepView: React.FC = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>('int-1');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuestions = INTERVIEW_QUESTIONS.filter(q => {
    const matchesDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          q.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          q.modelAnswer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDiff && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
              Technical Placement Prep
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">
              Silicon Industry Questions & Model Answers
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-0.5">
            VLSI Interview Preparation
          </h1>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search STA, CDC, Verilog, CMOS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80"
          />
        </div>

        {/* Difficulty Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg w-full sm:w-auto overflow-x-auto">
          {['All', 'Core Fundamentals', 'Intermediate RTL', 'Advanced Verification / STA'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setSelectedDifficulty(lvl)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedDifficulty === lvl
                  ? 'bg-slate-800 text-cyan-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Accordion List */}
      <div className="space-y-3">
        {filteredQuestions.map((item, idx) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden transition-all"
            >
              {/* Question Clickable Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="w-full p-4 text-left flex items-start justify-between gap-4 hover:bg-slate-800/40 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                    <span className="font-mono text-cyan-400">Q{idx + 1}.</span>
                    <span className="font-medium text-slate-300">{item.topic}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-cyan-400">{item.difficulty}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug">
                    {item.question}
                  </h3>
                </div>
                <div className="shrink-0 p-1 rounded-md text-slate-400 mt-1">
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Collapsible Model Answer */}
              {isExpanded && (
                <div className="p-5 border-t border-slate-800 bg-slate-950/70 space-y-4">
                  {/* Model Answer Body */}
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                      Comprehensive Model Answer:
                    </span>
                    <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                      {item.modelAnswer}
                    </div>
                  </div>

                  {/* Key Placement Takeaway */}
                  <div className="p-3.5 rounded-lg bg-cyan-950/50 border border-cyan-800/40 flex items-start gap-2.5">
                    <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-cyan-300">
                        Interview Gold Takeaway
                      </div>
                      <div className="text-xs text-slate-300 mt-0.5">
                        {item.keyTakeaway}
                      </div>
                    </div>
                  </div>

                  {/* Frequently Asked Companies */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-500">Frequently Asked At:</span>
                    <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-slate-300">
                      {item.frequentlyAskedAt.map((company, cIdx) => (
                        <span key={company}>
                          {company}{cIdx < item.frequentlyAskedAt.length - 1 ? ' ·' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
