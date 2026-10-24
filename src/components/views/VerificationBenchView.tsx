import React, { useState } from 'react';
import { CheckCircle2, XCircle, Plus, Trash2, Play, AlertCircle, Cpu, Activity } from 'lucide-react';

interface TestVectorRow {
  id: string;
  inputs: Record<string, number>;
  expected: Record<string, number>;
  actual?: Record<string, number>;
  passed?: boolean;
}

export const VerificationBenchView: React.FC = () => {
  const [selectedCircuit, setSelectedCircuit] = useState<'half_adder' | 'full_adder' | 'mux2to1'>('full_adder');

  // Initial verified test vectors for Full Adder
  const [vectors, setVectors] = useState<TestVectorRow[]>([
    { id: 'vec-1', inputs: { a: 0, b: 0, cin: 0 }, expected: { sum: 0, cout: 0 } },
    { id: 'vec-2', inputs: { a: 0, b: 1, cin: 0 }, expected: { sum: 1, cout: 0 } },
    { id: 'vec-3', inputs: { a: 1, b: 0, cin: 0 }, expected: { sum: 1, cout: 0 } },
    { id: 'vec-4', inputs: { a: 1, b: 1, cin: 0 }, expected: { sum: 0, cout: 1 } },
    { id: 'vec-5', inputs: { a: 0, b: 0, cin: 1 }, expected: { sum: 1, cout: 0 } },
    { id: 'vec-6', inputs: { a: 0, b: 1, cin: 1 }, expected: { sum: 0, cout: 1 } },
    { id: 'vec-7', inputs: { a: 1, b: 0, cin: 1 }, expected: { sum: 0, cout: 1 } },
    { id: 'vec-8', inputs: { a: 1, b: 1, cin: 1 }, expected: { sum: 1, cout: 1 } },
  ]);

  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Verified Reference Evaluators (Verified Hardware Logic Models)
  const evaluateVector = (circuit: string, inputs: Record<string, number>): Record<string, number> => {
    if (circuit === 'half_adder') {
      const a = inputs.a === 1 ? 1 : 0;
      const b = inputs.b === 1 ? 1 : 0;
      return {
        sum: a ^ b,
        cout: a & b,
      };
    } else if (circuit === 'full_adder') {
      const a = inputs.a === 1 ? 1 : 0;
      const b = inputs.b === 1 ? 1 : 0;
      const cin = inputs.cin === 1 ? 1 : 0;
      return {
        sum: (a ^ b ^ cin) & 1,
        cout: ((a & b) | (b & cin) | (a & cin)) & 1,
      };
    } else if (circuit === 'mux2to1') {
      const in0 = inputs.in0 === 1 ? 1 : 0;
      const in1 = inputs.in1 === 1 ? 1 : 0;
      const sel = inputs.sel === 1 ? 1 : 0;
      return {
        out: sel === 1 ? in1 : in0,
      };
    }
    return {};
  };

  const handleCircuitChange = (newCircuit: 'half_adder' | 'full_adder' | 'mux2to1') => {
    setSelectedCircuit(newCircuit);
    setHasEvaluated(false);
    if (newCircuit === 'half_adder') {
      setVectors([
        { id: 'ha-1', inputs: { a: 0, b: 0 }, expected: { sum: 0, cout: 0 } },
        { id: 'ha-2', inputs: { a: 0, b: 1 }, expected: { sum: 1, cout: 0 } },
        { id: 'ha-3', inputs: { a: 1, b: 0 }, expected: { sum: 1, cout: 0 } },
        { id: 'ha-4', inputs: { a: 1, b: 1 }, expected: { sum: 0, cout: 1 } },
      ]);
    } else if (newCircuit === 'full_adder') {
      setVectors([
        { id: 'fa-1', inputs: { a: 0, b: 0, cin: 0 }, expected: { sum: 0, cout: 0 } },
        { id: 'fa-2', inputs: { a: 0, b: 1, cin: 0 }, expected: { sum: 1, cout: 0 } },
        { id: 'fa-3', inputs: { a: 1, b: 0, cin: 0 }, expected: { sum: 1, cout: 0 } },
        { id: 'fa-4', inputs: { a: 1, b: 1, cin: 0 }, expected: { sum: 0, cout: 1 } },
        { id: 'fa-5', inputs: { a: 0, b: 0, cin: 1 }, expected: { sum: 1, cout: 0 } },
        { id: 'fa-6', inputs: { a: 0, b: 1, cin: 1 }, expected: { sum: 0, cout: 1 } },
        { id: 'fa-7', inputs: { a: 1, b: 0, cin: 1 }, expected: { sum: 0, cout: 1 } },
        { id: 'fa-8', inputs: { a: 1, b: 1, cin: 1 }, expected: { sum: 1, cout: 1 } },
      ]);
    } else if (newCircuit === 'mux2to1') {
      setVectors([
        { id: 'mux-1', inputs: { in0: 0, in1: 1, sel: 0 }, expected: { out: 0 } },
        { id: 'mux-2', inputs: { in0: 0, in1: 1, sel: 1 }, expected: { out: 1 } },
        { id: 'mux-3', inputs: { in0: 1, in1: 0, sel: 0 }, expected: { out: 1 } },
        { id: 'mux-4', inputs: { in0: 1, in1: 0, sel: 1 }, expected: { out: 0 } },
      ]);
    }
  };

  const runEvaluation = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      const updated = vectors.map(vec => {
        const actual = evaluateVector(selectedCircuit, vec.inputs);
        const keys = Object.keys(vec.expected);
        const passed = keys.every(k => vec.expected[k] === actual[k]);
        return {
          ...vec,
          actual,
          passed,
        };
      });
      setVectors(updated);
      setHasEvaluated(true);
      setIsEvaluating(false);
    }, 150);
  };

  const addTestVector = () => {
    const id = `custom-${Date.now()}`;
    if (selectedCircuit === 'half_adder') {
      setVectors(prev => [...prev, { id, inputs: { a: 0, b: 0 }, expected: { sum: 0, cout: 0 } }]);
    } else if (selectedCircuit === 'full_adder') {
      setVectors(prev => [...prev, { id, inputs: { a: 0, b: 0, cin: 0 }, expected: { sum: 0, cout: 0 } }]);
    } else {
      setVectors(prev => [...prev, { id, inputs: { in0: 0, in1: 0, sel: 0 }, expected: { out: 0 } }]);
    }
  };

  const deleteVector = (id: string) => {
    setVectors(prev => prev.filter(v => v.id !== id));
  };

  const passedCount = vectors.filter(v => v.passed).length;
  const totalCount = vectors.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
              Test-Vector Verification
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">
              Deterministic Logic Assertion Engine
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-0.5">
            Verification Workbench
          </h1>
        </div>

        <button
          onClick={runEvaluation}
          disabled={isEvaluating}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors disabled:opacity-50 shadow-xs"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isEvaluating ? 'Asserting...' : 'Execute Test Vectors'}</span>
        </button>
      </div>

      {/* Target Module Switcher */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-slate-400">Target DUT:</label>
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => handleCircuitChange('full_adder')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              selectedCircuit === 'full_adder' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            Full Adder (1-bit)
          </button>
          <button
            onClick={() => handleCircuitChange('half_adder')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              selectedCircuit === 'half_adder' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            Half Adder
          </button>
          <button
            onClick={() => handleCircuitChange('mux2to1')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              selectedCircuit === 'mux2to1' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            2:1 Multiplexer
          </button>
        </div>
      </div>

      {/* Evaluation Results Banner */}
      {hasEvaluated && totalCount > 0 && (
        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          passedCount === totalCount
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
            : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
        }`}>
          <div className="flex items-center gap-3">
            {passedCount === totalCount ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400" />
            )}
            <div>
              <div className="text-xs font-bold">
                {passedCount === totalCount ? 'All Vectors Passed Assertion' : `${totalCount - passedCount} Vector Assertion Failures`}
              </div>
              <div className="text-[11px] opacity-80">
                Evaluation performed against verified reference behavioral models.
              </div>
            </div>
          </div>
          <div className="font-mono text-sm font-bold tabular-nums">
            {passedCount} / {totalCount} PASSED
          </div>
        </div>
      )}

      {/* Test Vectors Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-slate-200">
              Input Stimuli & Expected Output Matrix
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCircuitChange(selectedCircuit)}
              className="px-3 py-1 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800 rounded-md transition-colors"
            >
              Reset Defaults
            </button>
            <button
              onClick={addTestVector}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Vector</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase border-b border-slate-800">
              <tr>
                <th className="px-4 py-2.5">Vector ID</th>
                <th className="px-4 py-2.5">Input Stimuli</th>
                <th className="px-4 py-2.5">Expected Output</th>
                <th className="px-4 py-2.5">Actual Evaluated</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono tabular-nums">
              {vectors.map((vec, idx) => (
                <tr key={vec.id} className="hover:bg-slate-800/30">
                  <td className="px-4 py-2 text-slate-500">#{idx + 1}</td>
                  {/* Inputs */}
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      {Object.keys(vec.inputs).map(pin => (
                        <button
                          key={pin}
                          onClick={() => {
                            const current = vec.inputs[pin];
                            const updated = current === 1 ? 0 : 1;
                            setVectors(prev => prev.map(v => v.id === vec.id ? {
                              ...v,
                              inputs: { ...v.inputs, [pin]: updated },
                              passed: undefined,
                              actual: undefined,
                            } : v));
                            setHasEvaluated(false);
                          }}
                          className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-colors ${
                            vec.inputs[pin] === 1
                              ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                              : 'bg-slate-950 text-slate-400 border-slate-800'
                          }`}
                        >
                          {pin}={vec.inputs[pin]}
                        </button>
                      ))}
                    </div>
                  </td>
                  {/* Expected */}
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      {Object.keys(vec.expected).map(outPin => (
                        <button
                          key={outPin}
                          onClick={() => {
                            const current = vec.expected[outPin];
                            const updated = current === 1 ? 0 : 1;
                            setVectors(prev => prev.map(v => v.id === vec.id ? {
                              ...v,
                              expected: { ...v.expected, [outPin]: updated },
                              passed: undefined,
                              actual: undefined,
                            } : v));
                            setHasEvaluated(false);
                          }}
                          className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-500 transition-colors"
                        >
                          {outPin}={vec.expected[outPin]}
                        </button>
                      ))}
                    </div>
                  </td>
                  {/* Actual Evaluated */}
                  <td className="px-4 py-2">
                    {vec.actual ? (() => {
                      const actualMap = vec.actual;
                      return (
                        <div className="flex items-center gap-2">
                          {Object.keys(actualMap).map(k => (
                            <span
                              key={k}
                              className={`font-bold ${
                                vec.expected[k] === actualMap[k] ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              {k}={actualMap[k]}
                            </span>
                          ))}
                        </div>
                      );
                    })() : (
                      <span className="text-slate-600 font-sans text-[11px]">Unasserted</span>
                    )}
                  </td>
                  {/* Pass/Fail */}
                  <td className="px-4 py-2">
                    {vec.passed !== undefined ? (
                      vec.passed ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>PASS</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>FAIL</span>
                        </span>
                      )
                    ) : (
                      <span className="text-slate-600 font-sans text-[11px]">Pending</span>
                    )}
                  </td>
                  {/* Action */}
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => deleteVector(vec.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Illustrative Waveform Timing Visualizer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-200">
              Evaluated Vector Timeline (Cycle Discretization)
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Ground Truth: Reference Logic Model
          </span>
        </div>

        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3 overflow-x-auto">
          {vectors.slice(0, 4).map((vec, cycleIdx) => (
            <div key={vec.id} className="flex items-center gap-4 text-xs font-mono">
              <span className="text-slate-500 w-16 shrink-0">Cycle #{cycleIdx}:</span>
              <div className="flex items-center gap-2">
                {Object.entries(vec.inputs).map(([k, v]) => (
                  <span key={k} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    {k}:{v}
                  </span>
                ))}
              </div>
              <span className="text-slate-600">→</span>
              <div className="flex items-center gap-2">
                {Object.entries(vec.expected).map(([k, v]) => (
                  <span key={k} className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                    {k}:{v}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
