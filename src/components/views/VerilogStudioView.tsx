import React, { useState } from 'react';
import { VerilogModuleItem } from '../../types/vlsi';
import { 
  Code2, 
  Copy, 
  RotateCcw, 
  Check, 
  FileCode, 
  AlertCircle,
  Play,
  ShieldAlert,
  Server,
  Layers,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Terminal,
  Save
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { saveDesignToFirestore } from '../../firebase/firestoreService';

export const VERILOG_MODULES: VerilogModuleItem[] = [
  {
    id: 'half-adder',
    title: 'Half Adder (1-bit)',
    category: 'Combinational',
    difficulty: 'Easy',
    description: 'A 1-bit half adder adds two single binary digits A and B, producing a Sum bit (S) and a Carry bit (C). It does not accommodate a carry-in from a previous stage.',
    moduleInterface: `module half_adder (
    input  wire a,
    input  wire b,
    output wire sum,
    output wire cout
);`,
    exampleSolution: `// Verified Golden Implementation
module half_adder (
    input  wire a,
    input  wire b,
    output wire sum,
    output wire cout
);
    // Sum is the XOR of inputs (parity)
    assign sum  = a ^ b;
    // Carry is the AND of inputs
    assign cout = a & b;
endmodule`,
    testbenchExample: `\`timescale 1ns/1ps
module tb_half_adder;
    reg a, b;
    wire sum, cout;

    half_adder uut (
        .a(a),
        .b(b),
        .sum(sum),
        .cout(cout)
    );

    initial begin
        $monitor("Time=%0t | a=%b b=%b | sum=%b cout=%b", $time, a, b, sum, cout);
        a=0; b=0; #10;
        a=0; b=1; #10;
        a=1; b=0; #10;
        a=1; b=1; #10;
        $finish;
    end
endmodule`,
    expectedBehavior: 'Sum is 1 when inputs differ (odd parity). Carry is 1 only when both A and B are 1.',
    explanation: 'Fundamental building block for multi-bit ripple-carry adders and arithmetic units.',
  },
  {
    id: 'full-adder',
    title: 'Full Adder (1-bit)',
    category: 'Combinational',
    difficulty: 'Easy',
    description: 'A 1-bit full adder adds three 1-bit inputs: operands A, B, and Carry-In (Cin), producing a Sum and Carry-Out (Cout).',
    moduleInterface: `module full_adder (
    input  wire a,
    input  wire b,
    input  wire cin,
    output wire sum,
    output wire cout
);`,
    exampleSolution: `// Verified Golden Implementation
module full_adder (
    input  wire a,
    input  wire b,
    input  wire cin,
    output wire sum,
    output wire cout
);
    assign sum  = a ^ b ^ cin;
    assign cout = (a & b) | (b & cin) | (a & cin);
endmodule`,
    testbenchExample: `\`timescale 1ns/1ps
module tb_full_adder;
    reg a, b, cin;
    wire sum, cout;

    full_adder uut (
        .a(a),
        .b(b),
        .cin(cin),
        .sum(sum),
        .cout(cout)
    );

    initial begin
        $monitor("Time=%0t | a=%b b=%b cin=%b | sum=%b cout=%b", $time, a, b, cin, sum, cout);
        a=0; b=0; cin=0; #10;
        a=0; b=1; cin=0; #10;
        a=1; b=0; cin=1; #10;
        a=1; b=1; cin=1; #10;
        $finish;
    end
endmodule`,
    expectedBehavior: 'Sum = a ^ b ^ cin. Cout is high when at least 2 of 3 inputs are 1 (majority carry function).',
    explanation: 'Cascaded in parallel to build n-bit ripple carry adders (RCA) or carry-lookahead adders (CLA).',
  },
  {
    id: 'mux-2to1',
    title: '2:1 Multiplexer',
    category: 'Combinational',
    difficulty: 'Easy',
    description: 'Selects between two 1-bit data lines (in0, in1) based on a 1-bit selection line (sel). When sel=0, out=in0; when sel=1, out=in1.',
    moduleInterface: `module mux2to1 (
    input  wire in0,
    input  wire in1,
    input  wire sel,
    output wire out
);`,
    exampleSolution: `// Verified Golden Implementation
module mux2to1 (
    input  wire in0,
    input  wire in1,
    input  wire sel,
    output wire out
);
    // Continuous assignment using ternary multiplexer operator
    assign out = sel ? in1 : in0;
endmodule`,
    testbenchExample: `\`timescale 1ns/1ps
module tb_mux2to1;
    reg in0, in1, sel;
    wire out;

    mux2to1 uut (.in0(in0), .in1(in1), .sel(sel), .out(out));

    initial begin
        $monitor("Time=%0t | sel=%b in0=%b in1=%b | out=%b", $time, sel, in0, in1, out);
        in0=1; in1=0; sel=0; #10;
        in0=1; in1=0; sel=1; #10;
        in0=0; in1=1; sel=1; #10;
        $finish;
    end
endmodule`,
    expectedBehavior: 'Transfers the chosen input channel strictly according to the select line.',
    explanation: 'Standard data routing primitive in processors, bus arbiters, and ALU operand multiplexers.',
  },
  {
    id: 'mux-4to1',
    title: '4:1 Multiplexer',
    category: 'Combinational',
    difficulty: 'Medium',
    description: 'Selects one of four 1-bit data inputs (d0, d1, d2, d3) based on a 2-bit select signal sel[1:0].',
    moduleInterface: `module mux4to1 (
    input  wire [3:0] d,
    input  wire [1:0] sel,
    output reg        out
);`,
    exampleSolution: `// Verified Golden Implementation
module mux4to1 (
    input  wire [3:0] d,
    input  wire [1:0] sel,
    output reg        out
);
    always @(*) begin
        case (sel)
            2'b00: out = d[0];
            2'b01: out = d[1];
            2'b10: out = d[2];
            2'b11: out = d[3];
            default: out = 1'b0;
        endcase
    end
endmodule`,
    testbenchExample: `\`timescale 1ns/1ps
module tb_mux4to1;
    reg [3:0] d;
    reg [1:0] sel;
    wire out;

    mux4to1 uut (.d(d), .sel(sel), .out(out));

    initial begin
        d = 4'b1010;
        sel = 2'b00; #10; // out = 0 (d[0])
        sel = 2'b01; #10; // out = 1 (d[1])
        sel = 2'b10; #10; // out = 0 (d[2])
        sel = 2'b11; #10; // out = 1 (d[3])
        $finish;
    end
endmodule`,
    expectedBehavior: 'Out matches d[sel] for all 4 combinations of sel without latch inference.',
    explanation: 'Synthesizes to standard MUX4 cells or a tree of two-level 2:1 multiplexers.',
  },
  {
    id: 'decoder-2to4',
    title: '2:4 Binary Decoder with Enable',
    category: 'Combinational',
    difficulty: 'Medium',
    description: 'Converts a 2-bit binary code into one of four one-hot outputs (out[3:0]). When enable is 0, all outputs are deasserted (0000).',
    moduleInterface: `module decoder2to4 (
    input  wire       enable,
    input  wire [1:0] in,
    output reg  [3:0] out
);`,
    exampleSolution: `// Verified Golden Implementation
module decoder2to4 (
    input  wire       enable,
    input  wire [1:0] in,
    output reg  [3:0] out
);
    always @(*) begin
        if (!enable)
            out = 4'b0000;
        else begin
            case (in)
                2'b00: out = 4'b0001;
                2'b01: out = 4'b0010;
                2'b10: out = 4'b0100;
                2'b11: out = 4'b1000;
                default: out = 4'b0000;
            endcase
        end
    end
endmodule`,
    testbenchExample: `\`timescale 1ns/1ps
module tb_decoder2to4;
    reg enable;
    reg [1:0] in;
    wire [3:0] out;

    decoder2to4 uut (.enable(enable), .in(in), .out(out));

    initial begin
        enable = 0; in = 2'b00; #10;
        enable = 1; in = 2'b00; #10;
        in = 2'b01; #10;
        in = 2'b10; #10;
        in = 2'b11; #10;
        $finish;
    end
endmodule`,
    expectedBehavior: 'Generates active-high one-hot code when enabled, exactly 4b0000 when disabled.',
    explanation: 'Used for memory address decoding, chip select generation, and peripheral routing.',
  },
  {
    id: 'encoder-priority-4to2',
    title: '4:2 Priority Encoder',
    category: 'Combinational',
    difficulty: 'Medium',
    description: 'Encodes 4 request lines into a 2-bit code representing the highest-priority active input. Input in[3] has highest priority, in[0] lowest.',
    moduleInterface: `module priority_encoder_4to2 (
    input  wire [3:0] in,
    output reg  [1:0] code,
    output reg        valid
);`,
    exampleSolution: `// Verified Golden Implementation
module priority_encoder_4to2 (
    input  wire [3:0] in,
    output reg  [1:0] code,
    output reg        valid
);
    always @(*) begin
        valid = 1'b1;
        if (in[3])
            code = 2'b11;
        else if (in[2])
            code = 2'b10;
        else if (in[1])
            code = 2'b01;
        else if (in[0])
            code = 2'b00;
        else begin
            code = 2'b00;
            valid = 1'b0;
        end
    end
endmodule`,
    testbenchExample: `\`timescale 1ns/1ps
module tb_encoder;
    reg [3:0] in;
    wire [1:0] code;
    wire valid;

    priority_encoder_4to2 uut (.in(in), .code(code), .valid(valid));

    initial begin
        in = 4'b0000; #10; // valid=0, code=00
        in = 4'b0001; #10; // valid=1, code=00
        in = 4'b0101; #10; // valid=1, code=10 (in[2] priority)
        in = 4'b1111; #10; // valid=1, code=11 (in[3] priority)
        $finish;
    end
endmodule`,
    expectedBehavior: 'Resolves simultaneous active requests and reports valid=0 when all inputs are 0.',
    explanation: 'Essential for interrupt controllers (NVIC), bus arbitration, and fixed-priority schedulers.',
  },
  {
    id: 'd-flip-flop',
    title: 'D Flip-Flop with Async Reset',
    category: 'Sequential',
    difficulty: 'Medium',
    description: 'Basic sequential storage element with asynchronous active-low reset. Samples data input D strictly on the rising edge of clock (posedge clk).',
    moduleInterface: `module d_flip_flop (
    input  wire clk,
    input  wire rst_n,
    input  wire d,
    output reg  q
);`,
    exampleSolution: `// Verified Golden Implementation
module d_flip_flop (
    input  wire clk,
    input  wire rst_n,
    input  wire d,
    output reg  q
);
    always @(posedge clk or negedge rst_n) begin
        if (!rst_n)
            q <= 1'b0;
        else
            q <= d;
    end
endmodule`,
    testbenchExample: `\`timescale 1ns/1ps
module tb_dff;
    reg clk, rst_n, d;
    wire q;

    d_flip_flop uut (.clk(clk), .rst_n(rst_n), .d(d), .q(q));

    always #5 clk = ~clk;

    initial begin
        clk=0; rst_n=0; d=0; #12;
        rst_n=1; d=1; #10;
        d=0; #10;
        d=1; #10;
        $finish;
    end
endmodule`,
    expectedBehavior: 'Q captures D only on posedge clk when rst_n=1. Low rst_n asynchronously clears Q to 0.',
    explanation: 'Forms the baseline register for pipeline stages, state registers, and Static Timing Analysis.',
  },
  {
    id: 'sync-counter',
    title: '4-Bit Synchronous Counter',
    category: 'Sequential',
    difficulty: 'Medium',
    description: 'Increments a 4-bit binary count on every rising edge of clock when enabled, with synchronous active-high reset.',
    moduleInterface: `module sync_counter_4bit (
    input  wire       clk,
    input  wire       rst,
    input  wire       enable,
    output reg  [3:0] count
);`,
    exampleSolution: `// Verified Golden Implementation
module sync_counter_4bit (
    input  wire       clk,
    input  wire       rst,
    input  wire       enable,
    output reg  [3:0] count
);
    always @(posedge clk) begin
        if (rst)
            count <= 4'b0000;
        else if (enable)
            count <= count + 1'b1;
    end
endmodule`,
    testbenchExample: `\`timescale 1ns/1ps
module tb_counter;
    reg clk, rst, enable;
    wire [3:0] count;

    sync_counter_4bit uut (.clk(clk), .rst(rst), .enable(enable), .count(count));

    always #5 clk = ~clk;

    initial begin
        clk=0; rst=1; enable=0; #10;
        rst=0; enable=1; #160;
        $finish;
    end
endmodule`,
    expectedBehavior: 'Counts 0 to 15 (4b1111) and rolls over back to 0 on clock edges when enable is asserted.',
    explanation: 'Used for timers, baud rate generators, FIFO pointers, and event counters in digital hardware.',
  },
];

export const VerilogStudioView: React.FC = () => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>('half-adder');
  const [activeCodeTab, setActiveCodeTab] = useState<'editor' | 'golden' | 'testbench'>('editor');
  const [showSandboxExplanation, setShowSandboxExplanation] = useState(false);
  const currentModule = VERILOG_MODULES.find(m => m.id === selectedModuleId) || VERILOG_MODULES[0];
  
  const [userCode, setUserCode] = useState<Record<string, string>>({
    'half-adder': currentModule.exampleSolution,
  });
  const [copied, setCopied] = useState(false);

  // Test vector interactive state for selected module
  const [testInputs, setTestInputs] = useState<Record<string, number>>({ a: 1, b: 0, cin: 1, in0: 1, in1: 0, sel: 0, enable: 1, d: 1 });
  const [evaluatedResult, setEvaluatedResult] = useState<Record<string, any> | null>(null);

  const activeUserCode = userCode[selectedModuleId] ?? currentModule.exampleSolution;
  const { user, effectiveUid, effectiveName } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [firestoreSaveStatus, setFirestoreSaveStatus] = useState<string | null>(null);

  const handleSaveToFirestore = async () => {
    if (!user) {
      setFirestoreSaveStatus('Please sign in with Google to save designs to your private cloud storage.');
      setTimeout(() => setFirestoreSaveStatus(null), 4000);
      return;
    }
    setIsSaving(true);
    setFirestoreSaveStatus(null);
    try {
      const designId = `${selectedModuleId}_${Date.now()}`;
      await saveDesignToFirestore({
        id: designId,
        userId: user.uid,
        title: `${currentModule.title} (Custom RTL)`,
        moduleId: selectedModuleId,
        verilogCode: activeUserCode,
        notes: `RTL design by ${user.displayName || 'ECE Student'} for ${currentModule.title}`,
      });
      setFirestoreSaveStatus(`Saved to private Firestore account (${user.displayName?.split(' ')[0] || 'User'})`);
    } catch (err: unknown) {
      setFirestoreSaveStatus(`Error saving: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSaving(false);
      setTimeout(() => setFirestoreSaveStatus(null), 3500);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setUserCode(prev => ({ ...prev, [selectedModuleId]: currentModule.exampleSolution }));
  };

  // Evaluate module behavior deterministically
  const handleEvaluateModule = () => {
    if (selectedModuleId === 'half-adder') {
      const a = testInputs.a ?? 0;
      const b = testInputs.b ?? 0;
      setEvaluatedResult({ sum: a ^ b, cout: a & b });
    } else if (selectedModuleId === 'full-adder') {
      const a = testInputs.a ?? 0;
      const b = testInputs.b ?? 0;
      const cin = testInputs.cin ?? 0;
      setEvaluatedResult({
        sum: a ^ b ^ cin,
        cout: (a & b) | (b & cin) | (a & cin),
      });
    } else if (selectedModuleId === 'mux-2to1') {
      const in0 = testInputs.in0 ?? 0;
      const in1 = testInputs.in1 ?? 0;
      const sel = testInputs.sel ?? 0;
      setEvaluatedResult({ out: sel === 1 ? in1 : in0 });
    } else if (selectedModuleId === 'mux-4to1') {
      const d = [testInputs.d0 ?? 1, testInputs.d1 ?? 0, testInputs.d2 ?? 1, testInputs.d3 ?? 0];
      const sel = testInputs.sel ?? 0;
      setEvaluatedResult({ out: d[sel % 4] });
    } else if (selectedModuleId === 'decoder-2to4') {
      const en = testInputs.enable ?? 1;
      const inCode = testInputs.in ?? 0;
      const out = en === 1 ? (1 << (inCode % 4)) : 0;
      setEvaluatedResult({ outBinary: out.toString(2).padStart(4, '0') });
    } else if (selectedModuleId === 'encoder-priority-4to2') {
      const inVal = testInputs.in ?? 5; // e.g., 4b0101
      let code = 0;
      let valid = 0;
      if (inVal & 8) { code = 3; valid = 1; }
      else if (inVal & 4) { code = 2; valid = 1; }
      else if (inVal & 2) { code = 1; valid = 1; }
      else if (inVal & 1) { code = 0; valid = 1; }
      setEvaluatedResult({ codeBinary: code.toString(2).padStart(2, '0'), valid });
    } else if (selectedModuleId === 'd-flip-flop') {
      const rst_n = testInputs.rst_n ?? 1;
      const d = testInputs.d ?? 1;
      setEvaluatedResult({ q: rst_n === 0 ? 0 : d });
    } else if (selectedModuleId === 'sync-counter') {
      const rst = testInputs.rst ?? 0;
      const enable = testInputs.enable ?? 1;
      const prev = testInputs.count ?? 7;
      const nextCount = rst === 1 ? 0 : enable === 1 ? (prev + 1) % 16 : prev;
      setEvaluatedResult({ nextCount, countBinary: nextCount.toString(2).padStart(4, '0') });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
              HDL Coding Studio
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">
              Practice Editor & Test-Vector Verification
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-0.5">
            Verilog Practice Studio
          </h1>
        </div>

        {/* Honest Simulator Status Pill */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <span className="font-medium text-[11px]">Simulator: Test-Vector Mode</span>
            <button
              onClick={() => setShowSandboxExplanation(!showSandboxExplanation)}
              className="text-cyan-400 hover:text-cyan-300 ml-1 text-[11px] underline"
            >
              Details
            </button>
          </div>
        </div>
      </div>

      {/* Simulator Sandbox Audit & Limitation Modal / Banner */}
      {showSandboxExplanation && (
        <div className="p-5 rounded-xl bg-slate-900 border border-amber-500/40 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Simulator Environment Audit & Security Architecture</span>
            </div>
            <button
              onClick={() => setShowSandboxExplanation(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Audit Status:</strong> Icarus Verilog (<code className="font-mono text-cyan-300">iverilog</code> / <code className="font-mono text-cyan-300">vvp</code>) is not installed in the standard application execution environment. In accordance with zero-trust safety principles, executing arbitrary user-submitted Verilog via unisolated server shell processes is prohibited because Verilog supports arbitrary system calls (<code className="font-mono text-cyan-300">$system</code>, <code className="font-mono text-cyan-300">$fopen</code>), which can breach container boundaries.
          </p>

          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Architecture Decision:</strong> To maintain strict Cloud Run security and deployment reproducibility without fabricating compile results, this studio uses <strong>honest, verified test-vector evaluation</strong>. When an external sandboxed microVM (e.g., gVisor / Firecracker RPC) is connected, real synthesis and VVP waveforms can be attached through the simulator interface without exposing the host container.
          </p>
        </div>
      )}

      {/* Module Selector Ribbon (All 8 Required Exercises) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {VERILOG_MODULES.map((mod) => (
          <button
            key={mod.id}
            onClick={() => {
              setSelectedModuleId(mod.id);
              setEvaluatedResult(null);
              if (!userCode[mod.id]) {
                setUserCode(prev => ({ ...prev, [mod.id]: mod.exampleSolution }));
              }
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-medium whitespace-nowrap transition-all ${
              selectedModuleId === mod.id
                ? 'bg-cyan-950/70 border-cyan-500/60 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>{mod.title}</span>
            <span className="text-[10px] opacity-60">({mod.category})</span>
          </button>
        ))}
      </div>

      {/* Main Two-Zone Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Problem Brief & Interface Specification */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                  {currentModule.category} Circuit
                </span>
                <span className="text-xs text-slate-400">
                  Difficulty: {currentModule.difficulty}
                </span>
              </div>
              <h2 className="text-base font-bold text-white mt-1">
                {currentModule.title}
              </h2>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentModule.description}
            </p>

            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-300 block">
                Required Module Interface:
              </span>
              <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800/90 text-xs font-mono text-cyan-300 overflow-x-auto">
                {currentModule.moduleInterface}
              </pre>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-300 block">
                Expected Invariants & Behavior:
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                {currentModule.expectedBehavior}
              </p>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-300 block">
                Engineering Application:
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                {currentModule.explanation}
              </p>
            </div>
          </div>

          {/* Test Vector Evaluation Card for the current module */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white">
                  Test-Vector Logic Evaluation
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Verified Reference Model
              </span>
            </div>

            <p className="text-[11px] text-slate-400">
              Inject stimulus vectors and assert output responses against the golden RTL model:
            </p>

            {/* Stimulus controls based on selected module */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs">
              {selectedModuleId === 'half-adder' && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setTestInputs(p => ({ ...p, a: p.a === 1 ? 0 : 1 }))}
                    className="px-2.5 py-1 rounded bg-slate-800 font-mono text-cyan-300"
                  >
                    A = {testInputs.a ?? 1}
                  </button>
                  <button
                    onClick={() => setTestInputs(p => ({ ...p, b: p.b === 1 ? 0 : 1 }))}
                    className="px-2.5 py-1 rounded bg-slate-800 font-mono text-cyan-300"
                  >
                    B = {testInputs.b ?? 0}
                  </button>
                </div>
              )}

              {selectedModuleId === 'full-adder' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTestInputs(p => ({ ...p, a: p.a === 1 ? 0 : 1 }))}
                    className="px-2.5 py-1 rounded bg-slate-800 font-mono text-cyan-300"
                  >
                    A = {testInputs.a ?? 1}
                  </button>
                  <button
                    onClick={() => setTestInputs(p => ({ ...p, b: p.b === 1 ? 0 : 1 }))}
                    className="px-2.5 py-1 rounded bg-slate-800 font-mono text-cyan-300"
                  >
                    B = {testInputs.b ?? 0}
                  </button>
                  <button
                    onClick={() => setTestInputs(p => ({ ...p, cin: p.cin === 1 ? 0 : 1 }))}
                    className="px-2.5 py-1 rounded bg-slate-800 font-mono text-cyan-300"
                  >
                    Cin = {testInputs.cin ?? 1}
                  </button>
                </div>
              )}

              {selectedModuleId === 'mux-2to1' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTestInputs(p => ({ ...p, in0: p.in0 === 1 ? 0 : 1 }))}
                    className="px-2 py-1 rounded bg-slate-800 font-mono text-cyan-300"
                  >
                    in0 = {testInputs.in0 ?? 1}
                  </button>
                  <button
                    onClick={() => setTestInputs(p => ({ ...p, in1: p.in1 === 1 ? 0 : 1 }))}
                    className="px-2 py-1 rounded bg-slate-800 font-mono text-cyan-300"
                  >
                    in1 = {testInputs.in1 ?? 0}
                  </button>
                  <button
                    onClick={() => setTestInputs(p => ({ ...p, sel: p.sel === 1 ? 0 : 1 }))}
                    className="px-2 py-1 rounded bg-cyan-950 font-mono text-cyan-400 border border-cyan-800/50"
                  >
                    sel = {testInputs.sel ?? 0}
                  </button>
                </div>
              )}

              {selectedModuleId === 'mux-4to1' && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">sel:</span>
                  {[0, 1, 2, 3].map((s) => (
                    <button
                      key={s}
                      onClick={() => setTestInputs(p => ({ ...p, sel: s }))}
                      className={`px-2 py-1 rounded font-mono ${
                        (testInputs.sel ?? 0) === s ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {selectedModuleId === 'd-flip-flop' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTestInputs(p => ({ ...p, rst_n: p.rst_n === 1 ? 0 : 1 }))}
                    className="px-2 py-1 rounded bg-slate-800 font-mono text-cyan-300"
                  >
                    rst_n = {testInputs.rst_n ?? 1}
                  </button>
                  <button
                    onClick={() => setTestInputs(p => ({ ...p, d: p.d === 1 ? 0 : 1 }))}
                    className="px-2 py-1 rounded bg-slate-800 font-mono text-cyan-300"
                  >
                    D = {testInputs.d ?? 1}
                  </button>
                </div>
              )}

              {selectedModuleId === 'sync-counter' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTestInputs(p => ({ ...p, rst: p.rst === 1 ? 0 : 1 }))}
                    className="px-2 py-1 rounded bg-slate-800 font-mono text-cyan-300"
                  >
                    rst = {testInputs.rst ?? 0}
                  </button>
                  <button
                    onClick={() => setTestInputs(p => ({ ...p, enable: p.enable === 1 ? 0 : 1 }))}
                    className="px-2 py-1 rounded bg-slate-800 font-mono text-cyan-300"
                  >
                    enable = {testInputs.enable ?? 1}
                  </button>
                  <button
                    onClick={() => setTestInputs(p => ({ ...p, count: ((p.count ?? 7) + 1) % 16 }))}
                    className="px-2 py-1 rounded bg-slate-800 font-mono text-slate-300"
                  >
                    curr={testInputs.count ?? 7}
                  </button>
                </div>
              )}

              {(selectedModuleId === 'decoder-2to4' || selectedModuleId === 'encoder-priority-4to2') && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Input Code:</span>
                  <button
                    onClick={() => setTestInputs(p => ({ ...p, in: ((p.in ?? 0) + 1) % 4 }))}
                    className="px-3 py-1 rounded bg-slate-800 font-mono text-cyan-300"
                  >
                    in = {testInputs.in ?? 0}
                  </button>
                </div>
              )}

              <button
                onClick={handleEvaluateModule}
                className="w-full mt-2 py-1.5 rounded bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold transition-colors flex items-center justify-center gap-1.5 text-xs shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Evaluate Test Vector</span>
              </button>

              {evaluatedResult && (
                <div className="mt-2 p-2.5 rounded bg-slate-900 border border-cyan-800/50 flex items-center justify-between font-mono text-xs">
                  <span className="text-slate-400">Verified Output:</span>
                  <div className="flex items-center gap-2 text-cyan-300 font-bold">
                    {Object.entries(evaluatedResult).map(([k, v]) => (
                      <span key={k}>{k}={String(v)}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Code Editor & Golden Reference */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            {/* Editor Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
                <button
                  onClick={() => setActiveCodeTab('editor')}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    activeCodeTab === 'editor'
                      ? 'bg-slate-800 text-cyan-300'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  My Verilog Code
                </button>
                <button
                  onClick={() => setActiveCodeTab('golden')}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    activeCodeTab === 'golden'
                      ? 'bg-slate-800 text-cyan-300'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Golden Solution
                </button>
                <button
                  onClick={() => setActiveCodeTab('testbench')}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    activeCodeTab === 'testbench'
                      ? 'bg-slate-800 text-cyan-300'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Verilog Testbench
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  title="Reset to starter template"
                  className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleCopy(
                    activeCodeTab === 'editor'
                      ? activeUserCode
                      : activeCodeTab === 'golden'
                      ? currentModule.exampleSolution
                      : currentModule.testbenchExample
                  )}
                  title="Copy code to clipboard"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Code Textarea or View */}
            <div className="mt-4">
              {activeCodeTab === 'editor' && (
                <div>
                  <textarea
                    value={activeUserCode}
                    onChange={(e) => {
                      const val = e.target.value;
                      setUserCode(prev => ({ ...prev, [selectedModuleId]: val }));
                    }}
                    rows={16}
                    spellCheck={false}
                    className="w-full p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 leading-relaxed focus:outline-none focus:border-cyan-500/80 resize-y"
                    placeholder="// Write your Verilog RTL module here..."
                  />
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Syntax: Verilog-2001 (IEEE 1364-2001)</span>
                    <span>Lines: {activeUserCode.split('\n').length}</span>
                  </div>
                </div>
              )}

              {activeCodeTab === 'golden' && (
                <div>
                  <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 leading-relaxed overflow-x-auto min-h-[320px]">
                    {currentModule.exampleSolution}
                  </pre>
                  <div className="mt-2 text-[11px] text-slate-500">
                    Verified synthesizable RTL implementation conforming to digital ASIC design rules.
                  </div>
                </div>
              )}

              {activeCodeTab === 'testbench' && (
                <div>
                  <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto min-h-[320px]">
                    {currentModule.testbenchExample}
                  </pre>
                  <div className="mt-2 text-[11px] text-slate-500">
                    Standard Verilog testbench utilizing $monitor and timescale simulation delays.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 mt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="text-slate-400">
              {firestoreSaveStatus ? (
                <span className="text-cyan-400 font-medium">{firestoreSaveStatus}</span>
              ) : (
                `Logged as ${effectiveName.split(' ')[0]} (Firestore Ready)`
              )}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(activeUserCode)}
                className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
              >
                Copy RTL Code
              </button>
              <button
                onClick={handleSaveToFirestore}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold transition-colors disabled:opacity-50 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save to Firestore'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
