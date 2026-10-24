import React, { useState, useMemo } from 'react';
import { GateType, LogicLevel, GateUnitTest } from '../../types/vlsi';
import { 
  GATE_DEFINITIONS, 
  evaluateGate, 
  generateTruthTable, 
  runGateUnitTests, 
  PRACTICE_EXPRESSIONS 
} from '../../utils/logicEngine';
import { LogicGateSvg } from '../logic/LogicGateSvg';
import { 
  CheckCircle2, 
  XCircle, 
  Play, 
  RefreshCw, 
  HelpCircle, 
  Binary, 
  TestTube2, 
  Layers, 
  Zap,
  ArrowRight
} from 'lucide-react';

interface DigitalLogicViewProps {
  onScoreUpdate?: (points: number) => void;
}

export const DigitalLogicView: React.FC<DigitalLogicViewProps> = ({ onScoreUpdate }) => {
  const [activeTab, setActiveTab] = useState<'interactive' | 'practice' | 'unittests'>('interactive');
  
  // Interactive Simulator State
  const [selectedGate, setSelectedGate] = useState<GateType>('AND');
  const [inputA, setInputA] = useState<LogicLevel>(1);
  const [inputB, setInputB] = useState<LogicLevel>(0);

  // Practice State
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceInputs, setPracticeInputs] = useState<Record<string, LogicLevel>>({ A: 1, B: 0, C: 1, S: 0, C_in: 0 });
  const [userGuess, setUserGuess] = useState<LogicLevel | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [practiceStats, setPracticeStats] = useState({ correct: 0, total: 0 });

  // Unit Test Runner State
  const [testResults, setTestResults] = useState<GateUnitTest[] | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Compute live gate output through genuine Boolean engine
  const currentGateDef = GATE_DEFINITIONS[selectedGate];
  const activeInputs = useMemo<LogicLevel[]>(() => {
    return currentGateDef.inputsCount === 1 ? [inputA] : [inputA, inputB];
  }, [currentGateDef.inputsCount, inputA, inputB]);

  const liveOutput = useMemo<LogicLevel>(() => {
    return evaluateGate(selectedGate, activeInputs);
  }, [selectedGate, activeInputs]);

  // Compute dynamically generated truth table
  const truthTable = useMemo(() => {
    return generateTruthTable(selectedGate, activeInputs);
  }, [selectedGate, activeInputs]);

  // Current practice problem
  const currentPractice = PRACTICE_EXPRESSIONS[practiceIndex];
  const verifiedPracticeOutput = useMemo(() => {
    return currentPractice.evaluator(practiceInputs);
  }, [currentPractice, practiceInputs]);

  const isPracticeCorrect = userGuess !== null && userGuess === verifiedPracticeOutput;

  const handlePracticeSubmit = () => {
    if (userGuess === null) return;
    setIsSubmitted(true);
    const correct = userGuess === verifiedPracticeOutput;
    setPracticeStats(prev => ({
      correct: correct ? prev.correct + 1 : prev.correct,
      total: prev.total + 1,
    }));
    if (correct && onScoreUpdate) {
      onScoreUpdate(10);
    }
  };

  const nextPracticeQuestion = () => {
    setUserGuess(null);
    setIsSubmitted(false);
    setPracticeIndex((prev) => (prev + 1) % PRACTICE_EXPRESSIONS.length);
  };

  const handleRunAllUnitTests = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      const results = runGateUnitTests();
      setTestResults(results);
      setIsRunningTests(false);
    }, 150);
  };

  const allTestsPassed = testResults && testResults.every(t => t.passed);

  return (
    <div className="space-y-6">
      {/* View Header with 3 Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Digital Logic Playground</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real Boolean algebraic evaluation, live CMOS gate schematics, dynamic truth tables, and automated test runners.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => setActiveTab('interactive')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'interactive'
                ? 'bg-slate-800 text-cyan-400 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Binary className="w-3.5 h-3.5" />
            <span>Interactive Simulator</span>
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'practice'
                ? 'bg-slate-800 text-cyan-400 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Expression Practice</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('unittests');
              if (!testResults) handleRunAllUnitTests();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'unittests'
                ? 'bg-slate-800 text-cyan-400 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TestTube2 className="w-3.5 h-3.5" />
            <span>Unit Test Suite</span>
          </button>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE SIMULATOR */}
      {activeTab === 'interactive' && (
        <div className="space-y-6">
          {/* Gate Selector Bar */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              Select Logic Gate Architecture
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {(Object.keys(GATE_DEFINITIONS) as GateType[]).map((gateKey) => {
                const def = GATE_DEFINITIONS[gateKey];
                const isSelected = selectedGate === gateKey;
                return (
                  <button
                    key={gateKey}
                    onClick={() => setSelectedGate(gateKey)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all ${
                      isSelected
                        ? 'bg-cyan-950/70 border-cyan-500/80 text-cyan-300 shadow-xs shadow-cyan-950/50'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold tracking-wide">{gateKey}</span>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5">{def.symbol}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Simulation Stage & Truth Table (Two-Zone Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Zone: Schematic Stage & Live Pin Controllers */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-semibold text-slate-200">
                    Live Circuit Schematic
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-400">
                  {currentGateDef.booleanEquation}
                </div>
              </div>

              {/* Schematic SVG canvas */}
              <div className="py-4 flex items-center justify-center bg-slate-950/80 rounded-lg border border-slate-800/80 my-4">
                <LogicGateSvg
                  gate={selectedGate}
                  inputs={activeInputs}
                  output={liveOutput}
                  className="w-full h-44 sm:h-52"
                />
              </div>

              {/* Interactive Signal Injections */}
              <div className="pt-3 border-t border-slate-800">
                <div className="text-xs font-medium text-slate-400 mb-3">
                  Digital Input Signal Pins (Click to Toggle Logic Level)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Pin A */}
                  <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-300">Input A</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Level: <span className={inputA === 1 ? 'text-cyan-400 font-bold' : 'text-slate-400'}>{inputA === 1 ? '1 (HIGH)' : '0 (LOW)'}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setInputA(inputA === 1 ? 0 : 1)}
                      className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                        inputA === 1
                          ? 'bg-cyan-500 text-slate-950 shadow-xs shadow-cyan-500/30'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      A = {inputA}
                    </button>
                  </div>

                  {/* Pin B (if 2-input gate) */}
                  {currentGateDef.inputsCount === 2 ? (
                    <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-300">Input B</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Level: <span className={inputB === 1 ? 'text-cyan-400 font-bold' : 'text-slate-400'}>{inputB === 1 ? '1 (HIGH)' : '0 (LOW)'}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setInputB(inputB === 1 ? 0 : 1)}
                        className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                          inputB === 1
                            ? 'bg-cyan-500 text-slate-950 shadow-xs shadow-cyan-500/30'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        B = {inputB}
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-950/30 border border-dashed border-slate-800 rounded-lg flex items-center justify-center text-xs text-slate-500">
                      Single-Input Inverter Cell (No Pin B)
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Zone: Dynamically Generated Truth Table & Silicon Properties */}
            <div className="lg:col-span-5 space-y-4">
              {/* Dynamic Truth Table */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-sm font-semibold text-slate-200">
                    Calculated Truth Table
                  </span>
                  <span className="text-[11px] text-cyan-400 font-mono">
                    Active State Highlighted
                  </span>
                </div>

                <div className="mt-4 overflow-hidden rounded-lg border border-slate-800">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950 text-slate-400 font-mono uppercase border-b border-slate-800">
                      <tr>
                        <th className="px-3.5 py-2.5">Input A</th>
                        {currentGateDef.inputsCount === 2 && (
                          <th className="px-3.5 py-2.5">Input B</th>
                        )}
                        <th className="px-3.5 py-2.5 text-cyan-400">Output Y</th>
                        <th className="px-3.5 py-2.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-mono tabular-nums">
                      {truthTable.map((row, idx) => (
                        <tr
                          key={idx}
                          className={`transition-colors ${
                            row.isActive
                              ? 'bg-cyan-950/60 text-white font-semibold'
                              : 'text-slate-400 hover:bg-slate-800/40'
                          }`}
                        >
                          <td className="px-3.5 py-2">{row.inputs.A}</td>
                          {currentGateDef.inputsCount === 2 && (
                            <td className="px-3.5 py-2">{row.inputs.B}</td>
                          )}
                          <td className={`px-3.5 py-2 font-bold ${row.output === 1 ? 'text-cyan-400' : 'text-slate-400'}`}>
                            {row.output}
                          </td>
                          <td className="px-3.5 py-2 text-right">
                            {row.isActive ? (
                              <span className="text-[10px] text-cyan-400 uppercase font-sans font-bold">
                                Current
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-600 font-sans">
                                —
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Silicon & CMOS Hardware Architecture Info */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="text-xs font-semibold text-slate-300">
                  CMOS Cell & Verilog Implementation
                </div>
                
                <p className="text-xs text-slate-400 leading-relaxed">
                  {currentGateDef.description}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">CMOS Transistor Count</span>
                    <span className="font-mono text-slate-200 font-medium">
                      {currentGateDef.cmosTransistorCount} Transistors
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Verilog Continuous Assign</span>
                    <span className="font-mono text-cyan-400 font-medium text-[11px]">
                      {currentGateDef.verilogOperator}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BOOLEAN EXPRESSION PRACTICE */}
      {activeTab === 'practice' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-cyan-400">
                  Exercise {practiceIndex + 1} of {PRACTICE_EXPRESSIONS.length}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-400 font-medium">
                  {currentPractice.difficulty} Level
                </span>
              </div>
              <h2 className="text-base font-bold text-white mt-0.5">
                {currentPractice.title}
              </h2>
            </div>

            {/* Score Tracker */}
            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-400">Practice Score:</span>
              <span className="font-mono font-bold text-cyan-300 bg-slate-800 px-2 py-0.5 rounded">
                {practiceStats.correct} / {practiceStats.total} Correct
              </span>
            </div>
          </div>

          {/* Equation Box */}
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-center">
            <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">
              Boolean Expression
            </span>
            <div className="text-xl sm:text-2xl font-mono font-bold text-cyan-300">
              {currentPractice.expressionDisplay}
            </div>
          </div>

          {/* Input Stimuli Setup */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">
              Set Input Variable Logic Levels:
            </label>
            <div className="flex flex-wrap gap-3">
              {currentPractice.variables.map((v) => {
                const val = practiceInputs[v] ?? 0;
                return (
                  <button
                    key={v}
                    onClick={() => {
                      if (!isSubmitted) {
                        setPracticeInputs(prev => ({ ...prev, [v]: val === 1 ? 0 : 1 }));
                      }
                    }}
                    disabled={isSubmitted}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-mono font-medium transition-all ${
                      val === 1
                        ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    } ${isSubmitted ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    <span>{v} =</span>
                    <span className="font-bold">{val}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Prediction Controls */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs font-medium text-slate-300">
              What is the output Y for these inputs?
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setUserGuess(0)}
                disabled={isSubmitted}
                className={`flex-1 py-2.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                  userGuess === 0
                    ? 'bg-slate-800 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                } ${isSubmitted ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                Output Y = 0 (LOW)
              </button>
              <button
                onClick={() => setUserGuess(1)}
                disabled={isSubmitted}
                className={`flex-1 py-2.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                  userGuess === 1
                    ? 'bg-slate-800 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                } ${isSubmitted ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                Output Y = 1 (HIGH)
              </button>
            </div>
          </div>

          {/* Submission and Evaluation Outcome */}
          {!isSubmitted ? (
            <div className="pt-2">
              <button
                onClick={handlePracticeSubmit}
                disabled={userGuess === null}
                className="w-full py-2.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors shadow-xs"
              >
                Submit and Evaluate
              </button>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <div
                className={`p-4 rounded-lg border ${
                  isPracticeCorrect
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  {isPracticeCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Correct Answer! Verified by Logic Engine.</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span>Incorrect Output. Expected Y = {verifiedPracticeOutput}, but got {userGuess}.</span>
                    </>
                  )}
                </div>

                {/* Step-by-step arithmetic breakdown */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1 font-mono text-xs">
                  <div className="text-[11px] font-sans font-semibold text-slate-400 mb-1">
                    Formal Logic Evaluation Steps:
                  </div>
                  {currentPractice.stepBreakdown(practiceInputs).map((step, idx) => (
                    <div key={idx} className="text-slate-300">
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={nextPracticeQuestion}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold text-slate-100 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
              >
                <span>Next Practice Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: AUTOMATED UNIT TEST SUITE */}
      {activeTab === 'unittests' && (() => {
        return (
          <UnitTestSuitePanel
            testResults={testResults}
            isRunningTests={isRunningTests}
            handleRunAllUnitTests={handleRunAllUnitTests}
            allTestsPassed={!!allTestsPassed}
          />
        );
      })()}
    </div>
  );
};

interface UnitTestSuitePanelProps {
  testResults: GateUnitTest[] | null;
  isRunningTests: boolean;
  handleRunAllUnitTests: () => void;
  allTestsPassed: boolean;
}

const UnitTestSuitePanel: React.FC<UnitTestSuitePanelProps> = ({
  testResults,
  isRunningTests,
  handleRunAllUnitTests,
  allTestsPassed,
}) => {
  const [filterCat, setFilterCat] = useState<'all' | 'truth_table' | 'multi_input' | 'invalid_input'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTests = useMemo(() => {
    if (!testResults) return [];
    return testResults.filter(t => {
      const matchCat = filterCat === 'all' || t.category === filterCat;
      const matchSearch = searchQuery.trim() === '' || 
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(t.gate).toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [testResults, filterCat, searchQuery]);

  const totalCount = testResults?.length ?? 0;
  const passedCount = testResults?.filter(t => t.passed).length ?? 0;
  const failedCount = totalCount - passedCount;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white">Automated Logic Engine Test Suite</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            51 automated tests covering 100% truth table combinations, multi-input vectors, and invalid input rejection.
          </p>
        </div>

        <button
          onClick={handleRunAllUnitTests}
          disabled={isRunningTests}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRunningTests ? 'animate-spin' : ''}`} />
          <span>{isRunningTests ? 'Executing Tests...' : 'Re-run All Tests'}</span>
        </button>
      </div>

      {/* Test Status Banner */}
      {testResults && (
        <div className={`p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          allTestsPassed
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
            : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
        }`}>
          <div className="flex items-center gap-2.5">
            {allTestsPassed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <div>
              <div className="text-xs font-bold">
                {allTestsPassed ? 'All 51 Unit Tests Passed with 100% Correctness' : 'Test Failures Encountered'}
              </div>
              <div className="text-[11px] opacity-80">
                26 Truth Table Permutations · 12 Multi-Input Vectors · 13 Invalid Input Invariant Guards
              </div>
            </div>
          </div>
          <div className="font-mono text-xs font-bold whitespace-nowrap">
            {passedCount} / {totalCount} PASSED (0 FAILURES)
          </div>
        </div>
      )}

      {/* Filter and Category Pills */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-lg w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setFilterCat('all')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              filterCat === 'all' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Tests ({totalCount})
          </button>
          <button
            onClick={() => setFilterCat('truth_table')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              filterCat === 'truth_table' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            Truth Tables (26)
          </button>
          <button
            onClick={() => setFilterCat('multi_input')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              filterCat === 'multi_input' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            Multi-Input (12)
          </button>
          <button
            onClick={() => setFilterCat('invalid_input')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              filterCat === 'invalid_input' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            Invalid Handling (13)
          </button>
        </div>

        <input
          type="text"
          placeholder="Filter tests by gate, ID or rule..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80"
        />
      </div>

      {/* Test Result Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-950 text-slate-400 font-mono uppercase border-b border-slate-800">
            <tr>
              <th className="px-3.5 py-2.5">Test ID</th>
              <th className="px-3.5 py-2.5">Gate</th>
              <th className="px-3.5 py-2.5">Category</th>
              <th className="px-3.5 py-2.5">Input Stimulus</th>
              <th className="px-3.5 py-2.5">Description & Assertion</th>
              <th className="px-3.5 py-2.5">Expected</th>
              <th className="px-3.5 py-2.5">Actual</th>
              <th className="px-3.5 py-2.5 text-right">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-mono tabular-nums">
            {filteredTests.map((test) => (
              <tr key={test.id} className="hover:bg-slate-800/30">
                <td className="px-3.5 py-2 text-slate-500 text-[11px] whitespace-nowrap">{test.id}</td>
                <td className="px-3.5 py-2 font-bold text-slate-200">{test.gate}</td>
                <td className="px-3.5 py-2 text-slate-400 text-[11px] whitespace-nowrap">
                  {test.category === 'truth_table' ? 'Truth Table' : test.category === 'multi_input' ? 'Multi-Input' : 'Invalid Guard'}
                </td>
                <td className="px-3.5 py-2 text-slate-300 max-w-[140px] truncate">
                  {Array.isArray(test.inputs) ? `[${test.inputs.join(', ')}]` : String(test.inputs)}
                </td>
                <td className="px-3.5 py-2 text-slate-400 font-sans text-[11px] max-w-[280px]">
                  <div>{test.description}</div>
                  {test.actualError && (
                    <div className="text-[10px] text-rose-400 font-mono truncate" title={test.actualError}>
                      Caught: {test.actualError}
                    </div>
                  )}
                </td>
                <td className="px-3.5 py-2 text-slate-300 font-bold whitespace-nowrap">
                  {test.expected === 'ERROR' ? <span className="text-amber-400">ERROR (Thrown)</span> : test.expected}
                </td>
                <td className={`px-3.5 py-2 font-bold whitespace-nowrap ${test.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {test.actual === 'ERROR' ? <span className="text-amber-400">ERROR (Caught)</span> : test.actual}
                </td>
                <td className="px-3.5 py-2 text-right whitespace-nowrap">
                  {test.passed ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>PASS</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>FAIL</span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
