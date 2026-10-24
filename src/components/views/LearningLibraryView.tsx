import React, { useState } from 'react';
import { BookOpen, CheckCircle2, ChevronRight, Clock, Award, HelpCircle } from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  category: string;
  duration: string;
  overview: string;
  keyConcepts: string[];
  sampleQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

const TOPICS: Topic[] = [
  {
    id: 'topic-1',
    title: 'Digital Electronics & Boolean Algebra',
    category: 'Foundations',
    duration: '25 min',
    overview: 'Core postulates of Boolean algebra, De Morgan theorems, canonical SOP/POS forms, Karnaugh Maps (K-maps) for minimization, and essential logic identities.',
    keyConcepts: [
      'De Morgan duality: ~(A · B) = ~A + ~B and ~(A + B) = ~A · ~B',
      'Karnaugh map grouping rules and prime implicants',
      'Minimization of hazard-free combinational logic',
    ],
    sampleQuiz: {
      question: 'According to De Morgan\'s Theorem, what is the simplified dual form of ~(A + (B · C))?',
      options: [
        '~A · (~B + ~C)',
        '~A + ~B · ~C',
        '~A · ~B · ~C',
        'A · (B + C)',
      ],
      correctIndex: 0,
      explanation: 'Applying De Morgan: ~(A + X) = ~A · ~X. Here X = (B · C), so ~X = (~B + ~C). Thus, ~(A + (B·C)) = ~A · (~B + ~C).',
    },
  },
  {
    id: 'topic-2',
    title: 'Combinational & Sequential Circuits',
    category: 'Architecture',
    duration: '35 min',
    overview: 'Distinction between time-independent combinational circuits (adders, muxes, priority encoders) and clock-synchronized memory elements (latches, edge-triggered flip-flops).',
    keyConcepts: [
      'Level-sensitive latches vs edge-triggered flip-flops',
      'Transparency hazards and race-around condition in JK flip-flops',
      'Synchronous up/down counters and shift registers',
    ],
    sampleQuiz: {
      question: 'What is the primary operational hazard of an SR latch that is avoided in an edge-triggered D flip-flop?',
      options: [
        'High quiescent leakage current',
        'Undefined output state when S=1 and R=1 simultaneously',
        'Inability to hold data when clock is low',
        'Excessive gate delay in master stage',
      ],
      correctIndex: 1,
      explanation: 'In an active-high SR latch, asserting S=1 and R=1 forces both outputs Q and ~Q to 0, creating a race condition when inputs deassert.',
    },
  },
  {
    id: 'topic-3',
    title: 'Verilog HDL Fundamentals',
    category: 'RTL Design',
    duration: '40 min',
    overview: 'Structural, dataflow, and behavioral modeling in Verilog-2001. Blocking (=) vs non-blocking (<=) assignment rules for combinational and sequential blocks.',
    keyConcepts: [
      'Golden rule: use blocking (=) for combinational always blocks',
      'Golden rule: use non-blocking (<=) for sequential always @(posedge clk)',
      'Avoiding inferred latches by completely specifying all if/else and case branches',
    ],
    sampleQuiz: {
      question: 'What hardware anomaly occurs when an incomplete if-statement without an \'else\' branch is written inside a combinational \'always @(*)\' block?',
      options: [
        'A combinational loop is synthesized',
        'An unintended transparent latch is inferred by the synthesis tool',
        'The clock frequency is halved',
        'A static race condition creates a setup violation',
      ],
      correctIndex: 1,
      explanation: 'In synthesis, if a variable is not assigned in every possible branch of a combinational always block, the simulator and synthesis tool must preserve its previous value, inferring a transparent hardware latch.',
    },
  },
  {
    id: 'topic-4',
    title: 'Testbenches & RTL Verification',
    category: 'Verification',
    duration: '30 min',
    overview: 'Verification methodologies, self-checking testbenches, stimulus generation, assertions, code coverage (line, branch, toggle, FSM), and UVM testbench architecture.',
    keyConcepts: [
      'Self-checking testbenches with golden behavioral references',
      'Difference between code coverage and functional coverage',
      'SystemVerilog assertions (SVA) for protocol checking',
    ],
    sampleQuiz: {
      question: 'Which type of coverage measures whether all user-defined features and corner cases specified in the test plan have been stimulated?',
      options: [
        'Line coverage',
        'Toggle coverage',
        'Functional coverage',
        'Branch coverage',
      ],
      correctIndex: 2,
      explanation: 'Functional coverage is user-defined using covergroups and coverpoints to verify that specific design scenarios, states, and corner cases occurred during simulation.',
    },
  },
  {
    id: 'topic-5',
    title: 'Timing Concepts & Finite State Machines (FSM)',
    category: 'Digital Systems',
    duration: '45 min',
    overview: 'Mealy vs Moore state machines, one-hot vs binary state encoding, setup time (Tsu), hold time (Th), clock skew, and metastability in clock domain crossing (CDC).',
    keyConcepts: [
      'Moore FSM outputs depend solely on current state',
      'Mealy FSM outputs depend on current state and current inputs (reacts 1 cycle earlier)',
      '2-Flip-Flop synchronizer for single-bit asynchronous signal crossing',
    ],
    sampleQuiz: {
      question: 'In a Moore state machine, the output values depend on:',
      options: [
        'Only the current state',
        'Both the current state and the current primary inputs',
        'The previous state and clock duty cycle',
        'The clock skew between registers',
      ],
      correctIndex: 0,
      explanation: 'By definition, a Moore state machine outputs are strictly a function of the current state registers, whereas Mealy machine outputs depend on both state and current inputs.',
    },
  },
  {
    id: 'topic-6',
    title: 'Semiconductor Physics & CMOS Concepts',
    category: 'VLSI Silicon',
    duration: '30 min',
    overview: 'MOSFET transistor operation, NMOS pull-down and PMOS pull-up networks, dynamic power consumption (P = α·C·V²·f), static leakage, and standard cell layout principles.',
    keyConcepts: [
      'Electron mobility (μn) is ~2.5x higher than hole mobility (μp)',
      'PMOS width is sized 2x-3x larger than NMOS for symmetric rise/fall times',
      'CMOS logic gates naturally invert signals (NAND/NOR/NOT)',
    ],
    sampleQuiz: {
      question: 'Why are NAND gates preferred over NOR gates in static CMOS silicon design?',
      options: [
        'NOR gates require more total transistors than NAND gates',
        'NAND gates put NMOS transistors in series, which have higher electron mobility than PMOS',
        'NOR gates cannot be synthesized into standard cell libraries',
        'NAND gates consume zero static leakage current',
      ],
      correctIndex: 1,
      explanation: 'In static CMOS, NAND gates place NMOS in the series pull-down network. Because NMOS electron mobility is 2-3x higher than PMOS hole mobility, NAND gates achieve faster propagation delays with smaller area compared to NOR gates with series PMOS.',
    },
  },
  {
    id: 'topic-7',
    title: 'Synthesis & Static Timing Analysis (STA)',
    category: 'Backend & STA',
    duration: '40 min',
    overview: 'Logic synthesis from RTL to gate-level netlist, setup slack (Tclk - Tsu - Tcq - Tcomb >= 0), hold slack (Tcq + Tcomb - Th >= 0), and timing constraint files (SDC).',
    keyConcepts: [
      'Setup time violation is fixed by reducing clock frequency or optimizing datapath delay',
      'Hold time violation CANNOT be fixed by reducing clock frequency (must add delay buffers)',
      'Clock jitter and clock skew impact on setup and hold margins',
    ],
    sampleQuiz: {
      question: 'If a post-route timing report exhibits a hold time violation on a critical register path, can it be resolved by lowering the clock operating frequency?',
      options: [
        'Yes, lowering frequency increases clock period and resolves hold slack',
        'No, hold time constraints are independent of clock period (Tclk)',
        'Only if the registers are negative-edge triggered',
        'Only if clock gating is disabled',
      ],
      correctIndex: 1,
      explanation: 'Hold check equation: T_cq + T_comb_min >= T_hold + T_skew. Notice the clock period (T_clk) does not appear in the hold equation! Therefore, changing the clock frequency has zero effect on hold violations. Delay buffers must be inserted.',
    },
  },
];

export const LearningLibraryView: React.FC = () => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>('topic-1');
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const currentTopic = TOPICS.find(t => t.id === selectedTopicId) || TOPICS[0];

  const handleTopicSelect = (id: string) => {
    setSelectedTopicId(id);
    setQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const isCorrect = quizAnswer === currentTopic.sampleQuiz.correctIndex;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
            Curriculum Library
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-xs text-slate-400">
            7 Comprehensive VLSI Placement Domains
          </span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white mt-0.5">
          Learning Library
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Topic List */}
        <div className="lg:col-span-5 space-y-2">
          {TOPICS.map((topic, idx) => {
            const isSelected = topic.id === selectedTopicId;
            return (
              <button
                key={topic.id}
                onClick={() => handleTopicSelect(topic.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'bg-cyan-950/70 border-cyan-500/60 text-white shadow-xs'
                    : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1">
                    <span className="font-mono text-cyan-400">0{idx + 1}.</span>
                    <span>{topic.category}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{topic.duration}</span>
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-100">{topic.title}</h3>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 mt-2 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
              </button>
            );
          })}
        </div>

        {/* Selected Topic Content and Interactive Quiz */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold uppercase tracking-wider">
              <span>{currentTopic.category}</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 font-normal">{currentTopic.duration} Estimated</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              {currentTopic.title}
            </h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {currentTopic.overview}
            </p>
          </div>

          {/* Key Engineering Principles */}
          <div className="space-y-2.5 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-slate-200">
              Core Technical Invariants & Rules:
            </h3>
            <ul className="space-y-2">
              {currentTopic.keyConcepts.map((concept, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{concept}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Placement Assessment Quiz */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white">
                Concept Checkpoint Quiz
              </h3>
            </div>

            <p className="text-xs text-slate-200 font-medium">
              {currentTopic.sampleQuiz.question}
            </p>

            <div className="space-y-2">
              {currentTopic.sampleQuiz.options.map((opt, oIdx) => {
                const isPicked = quizAnswer === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => {
                      if (!quizSubmitted) setQuizAnswer(oIdx);
                    }}
                    disabled={quizSubmitted}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                      isPicked
                        ? 'bg-slate-800 border-cyan-400 text-white font-medium ring-1 ring-cyan-400/40'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                    } ${quizSubmitted ? 'opacity-80 cursor-not-allowed' : ''}`}
                  >
                    <span className="font-mono text-cyan-400 mr-2">{String.fromCharCode(65 + oIdx)}.</span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {!quizSubmitted ? (
              <button
                onClick={() => setQuizSubmitted(true)}
                disabled={quizAnswer === null}
                className="w-full py-2.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 rounded-lg transition-colors"
              >
                Submit Answer
              </button>
            ) : (
              <div className={`p-4 rounded-lg border text-xs space-y-2 ${
                isCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              }`}>
                <div className="font-bold flex items-center gap-2">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Correct!</span>
                    </>
                  ) : (
                    <span>Incorrect Choice</span>
                  )}
                </div>
                <p className="leading-relaxed text-slate-300">
                  {currentTopic.sampleQuiz.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
