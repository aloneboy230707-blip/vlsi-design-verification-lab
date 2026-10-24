import { GateType, LogicLevel, TruthTableRow, GateUnitTest, ExpressionPracticeItem, GateDefinition } from '../types/vlsi';

export class InvalidLogicInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidLogicInputError';
  }
}

export const GATE_DEFINITIONS: Record<GateType, GateDefinition> = {
  AND: {
    type: 'AND',
    name: 'AND Gate',
    symbol: '&',
    inputsCount: 2,
    booleanEquation: 'Y = A · B',
    verilogOperator: 'assign Y = A & B;',
    description: 'Output is 1 (HIGH) if and only if all inputs are 1 (HIGH). In CMOS, implemented as a NAND stage followed by an inverter (6 transistors).',
    cmosTransistorCount: 6,
  },
  OR: {
    type: 'OR',
    name: 'OR Gate',
    symbol: '≥1',
    inputsCount: 2,
    booleanEquation: 'Y = A + B',
    verilogOperator: 'assign Y = A | B;',
    description: 'Output is 1 (HIGH) if at least one input is 1 (HIGH). In CMOS, constructed from a NOR stage followed by an inverter (6 transistors).',
    cmosTransistorCount: 6,
  },
  NOT: {
    type: 'NOT',
    name: 'Inverter (NOT Gate)',
    symbol: '1',
    inputsCount: 1,
    booleanEquation: 'Y = Ā (NOT A)',
    verilogOperator: 'assign Y = ~A;',
    description: 'Inverts the binary input. In CMOS, built with 1 PMOS pull-up and 1 NMOS pull-down (2 transistors). The foundational VLSI standard cell.',
    cmosTransistorCount: 2,
  },
  NAND: {
    type: 'NAND',
    name: 'NAND Gate',
    symbol: '& with bubble',
    inputsCount: 2,
    booleanEquation: 'Y = (A · B)̄',
    verilogOperator: 'assign Y = ~(A & B);',
    description: 'Universal gate. Output is 0 only when all inputs are 1. Preferred in static CMOS layouts because NMOS pulldown in series is faster than PMOS in series (4 transistors).',
    cmosTransistorCount: 4,
  },
  NOR: {
    type: 'NOR',
    name: 'NOR Gate',
    symbol: '≥1 with bubble',
    inputsCount: 2,
    booleanEquation: 'Y = (A + B)̄',
    verilogOperator: 'assign Y = ~(A | B);',
    description: 'Universal gate. Output is 1 only when all inputs are 0. Has series PMOS in pull-up network, requiring larger PMOS sizing for balanced propagation delay (4 transistors).',
    cmosTransistorCount: 4,
  },
  XOR: {
    type: 'XOR',
    name: 'Exclusive-OR Gate',
    symbol: '=1',
    inputsCount: 2,
    booleanEquation: 'Y = A ⊕ B = ĀB + AB̄',
    verilogOperator: 'assign Y = A ^ B;',
    description: 'Output is 1 if inputs are distinct (parity generator / 1-bit half adder sum). Critical building block for arithmetic logic units and carry-save adders.',
    cmosTransistorCount: 8,
  },
  XNOR: {
    type: 'XNOR',
    name: 'Exclusive-NOR (Equivalence Gate)',
    symbol: '=1 with bubble',
    inputsCount: 2,
    booleanEquation: 'Y = (A ⊕ B)̄ = AB + ĀB̄',
    verilogOperator: 'assign Y = ~(A ^ B);',
    description: 'Output is 1 if inputs are identical (bit comparator). High when both inputs are 0 or both inputs are 1.',
    cmosTransistorCount: 8,
  },
};

/**
 * Validates gate type and input array for strict digital electronics correctness
 */
export function validateGateInputs(type: GateType, inputs: unknown): { isValid: boolean; error?: string } {
  if (!Array.isArray(inputs)) {
    return { isValid: false, error: 'Inputs must be provided as an array.' };
  }

  const def = GATE_DEFINITIONS[type];
  if (!def) {
    return { isValid: false, error: `Unsupported gate architecture: "${type}". Supported gates: ${Object.keys(GATE_DEFINITIONS).join(', ')}` };
  }

  // NOT gate requires strictly 1 input
  if (type === 'NOT') {
    if (inputs.length !== 1) {
      return { isValid: false, error: `NOT gate requires exactly 1 input, but received ${inputs.length}.` };
    }
  } else {
    // 2-or-more input gates
    if (inputs.length < 2) {
      return { isValid: false, error: `${type} gate requires at least 2 inputs, but received ${inputs.length}.` };
    }
  }

  // Validate that every input level is strictly binary 0 or 1
  for (let i = 0; i < inputs.length; i++) {
    const val = inputs[i];
    if (val !== 0 && val !== 1) {
      return {
        isValid: false,
        error: `Invalid logic level at pin [${i}]: received ${JSON.stringify(val)}. Only binary 0 (LOW) or 1 (HIGH) are permissible.`
      };
    }
  }

  return { isValid: true };
}

/**
 * Pure Boolean logic computation for single, dual, and N-input gates.
 * Throws InvalidLogicInputError if inputs violate binary invariants or count rules.
 */
export function evaluateGate(type: GateType, inputs: LogicLevel[]): LogicLevel {
  const validation = validateGateInputs(type, inputs);
  if (!validation.isValid) {
    throw new InvalidLogicInputError(validation.error!);
  }

  if (type === 'NOT') {
    return inputs[0] === 1 ? 0 : 1;
  }

  if (type === 'AND') {
    return inputs.every(x => x === 1) ? 1 : 0;
  }

  if (type === 'OR') {
    return inputs.some(x => x === 1) ? 1 : 0;
  }

  if (type === 'NAND') {
    return inputs.every(x => x === 1) ? 0 : 1;
  }

  if (type === 'NOR') {
    return inputs.every(x => x === 0) ? 1 : 0;
  }

  if (type === 'XOR') {
    // Odd parity reduction (XOR over all inputs)
    const parity = inputs.reduce<number>((acc, curr) => acc ^ curr, 0);
    return (parity % 2 === 1 ? 1 : 0);
  }

  if (type === 'XNOR') {
    // Even parity reduction
    const parity = inputs.reduce<number>((acc, curr) => acc ^ curr, 0);
    return (parity % 2 === 0 ? 1 : 0);
  }

  throw new InvalidLogicInputError(`Unsupported gate type: "${type}"`);
}

/**
 * Safe wrapper around evaluateGate that catches errors and returns structured result
 */
export function safeEvaluateGate(type: GateType, inputs: unknown): {
  success: boolean;
  output?: LogicLevel;
  error?: string;
} {
  try {
    const out = evaluateGate(type, inputs as LogicLevel[]);
    return { success: true, output: out };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err)
    };
  }
}

/**
 * Automatically dynamically generates exhaustive truth tables
 * computed directly from the Boolean logic engine
 */
export function generateTruthTable(type: GateType, currentInputs: LogicLevel[]): TruthTableRow[] {
  const def = GATE_DEFINITIONS[type];
  const rows: TruthTableRow[] = [];

  if (def.inputsCount === 1) {
    const values: LogicLevel[] = [0, 1];
    for (const a of values) {
      const out = evaluateGate(type, [a]);
      const isActive = currentInputs.length >= 1 && currentInputs[0] === a;
      rows.push({
        inputs: { A: a },
        output: out,
        isActive,
      });
    }
  } else {
    const values: LogicLevel[] = [0, 1];
    for (const a of values) {
      for (const b of values) {
        const out = evaluateGate(type, [a, b]);
        const isActive =
          currentInputs.length >= 2 &&
          currentInputs[0] === a &&
          currentInputs[1] === b;
        rows.push({
          inputs: { A: a, B: b },
          output: out,
          isActive,
        });
      }
    }
  }

  return rows;
}

/**
 * Exhaustive unit tests suite:
 * 1. Every gate across every valid input combination (26 tests)
 * 2. Multi-input gates (12 tests)
 * 3. Invalid input handling (13 tests)
 * Total: 51 automated unit tests
 */
export function runGateUnitTests(): GateUnitTest[] {
  interface TestCaseSpec {
    id: string;
    gate: GateType | string;
    category: 'truth_table' | 'multi_input' | 'invalid_input';
    description: string;
    inputs: any[];
    expected: LogicLevel | string;
    expectError: boolean;
    expectedErrorSubstring?: string;
  }

  const specs: TestCaseSpec[] = [
    // --- 1. Exhaustive Truth Table Tests for 1-input NOT Gate (2 tests) ---
    { id: 'tt-not-0', gate: 'NOT', category: 'truth_table', description: 'NOT with input [0] produces 1', inputs: [0], expected: 1, expectError: false },
    { id: 'tt-not-1', gate: 'NOT', category: 'truth_table', description: 'NOT with input [1] produces 0', inputs: [1], expected: 0, expectError: false },

    // --- 2. Exhaustive Truth Table Tests for 2-input AND Gate (4 tests) ---
    { id: 'tt-and-00', gate: 'AND', category: 'truth_table', description: 'AND with inputs [0, 0] produces 0', inputs: [0, 0], expected: 0, expectError: false },
    { id: 'tt-and-01', gate: 'AND', category: 'truth_table', description: 'AND with inputs [0, 1] produces 0', inputs: [0, 1], expected: 0, expectError: false },
    { id: 'tt-and-10', gate: 'AND', category: 'truth_table', description: 'AND with inputs [1, 0] produces 0', inputs: [1, 0], expected: 0, expectError: false },
    { id: 'tt-and-11', gate: 'AND', category: 'truth_table', description: 'AND with inputs [1, 1] produces 1', inputs: [1, 1], expected: 1, expectError: false },

    // --- 3. Exhaustive Truth Table Tests for 2-input OR Gate (4 tests) ---
    { id: 'tt-or-00', gate: 'OR', category: 'truth_table', description: 'OR with inputs [0, 0] produces 0', inputs: [0, 0], expected: 0, expectError: false },
    { id: 'tt-or-01', gate: 'OR', category: 'truth_table', description: 'OR with inputs [0, 1] produces 1', inputs: [0, 1], expected: 1, expectError: false },
    { id: 'tt-or-10', gate: 'OR', category: 'truth_table', description: 'OR with inputs [1, 0] produces 1', inputs: [1, 0], expected: 1, expectError: false },
    { id: 'tt-or-11', gate: 'OR', category: 'truth_table', description: 'OR with inputs [1, 1] produces 1', inputs: [1, 1], expected: 1, expectError: false },

    // --- 4. Exhaustive Truth Table Tests for 2-input NAND Gate (4 tests) ---
    { id: 'tt-nand-00', gate: 'NAND', category: 'truth_table', description: 'NAND with inputs [0, 0] produces 1', inputs: [0, 0], expected: 1, expectError: false },
    { id: 'tt-nand-01', gate: 'NAND', category: 'truth_table', description: 'NAND with inputs [0, 1] produces 1', inputs: [0, 1], expected: 1, expectError: false },
    { id: 'tt-nand-10', gate: 'NAND', category: 'truth_table', description: 'NAND with inputs [1, 0] produces 1', inputs: [1, 0], expected: 1, expectError: false },
    { id: 'tt-nand-11', gate: 'NAND', category: 'truth_table', description: 'NAND with inputs [1, 1] produces 0', inputs: [1, 1], expected: 0, expectError: false },

    // --- 5. Exhaustive Truth Table Tests for 2-input NOR Gate (4 tests) ---
    { id: 'tt-nor-00', gate: 'NOR', category: 'truth_table', description: 'NOR with inputs [0, 0] produces 1', inputs: [0, 0], expected: 1, expectError: false },
    { id: 'tt-nor-01', gate: 'NOR', category: 'truth_table', description: 'NOR with inputs [0, 1] produces 0', inputs: [0, 1], expected: 0, expectError: false },
    { id: 'tt-nor-10', gate: 'NOR', category: 'truth_table', description: 'NOR with inputs [1, 0] produces 0', inputs: [1, 0], expected: 0, expectError: false },
    { id: 'tt-nor-11', gate: 'NOR', category: 'truth_table', description: 'NOR with inputs [1, 1] produces 0', inputs: [1, 1], expected: 0, expectError: false },

    // --- 6. Exhaustive Truth Table Tests for 2-input XOR Gate (4 tests) ---
    { id: 'tt-xor-00', gate: 'XOR', category: 'truth_table', description: 'XOR with inputs [0, 0] produces 0', inputs: [0, 0], expected: 0, expectError: false },
    { id: 'tt-xor-01', gate: 'XOR', category: 'truth_table', description: 'XOR with inputs [0, 1] produces 1', inputs: [0, 1], expected: 1, expectError: false },
    { id: 'tt-xor-10', gate: 'XOR', category: 'truth_table', description: 'XOR with inputs [1, 0] produces 1', inputs: [1, 0], expected: 1, expectError: false },
    { id: 'tt-xor-11', gate: 'XOR', category: 'truth_table', description: 'XOR with inputs [1, 1] produces 0', inputs: [1, 1], expected: 0, expectError: false },

    // --- 7. Exhaustive Truth Table Tests for 2-input XNOR Gate (4 tests) ---
    { id: 'tt-xnor-00', gate: 'XNOR', category: 'truth_table', description: 'XNOR with inputs [0, 0] produces 1', inputs: [0, 0], expected: 1, expectError: false },
    { id: 'tt-xnor-01', gate: 'XNOR', category: 'truth_table', description: 'XNOR with inputs [0, 1] produces 0', inputs: [0, 1], expected: 0, expectError: false },
    { id: 'tt-xnor-10', gate: 'XNOR', category: 'truth_table', description: 'XNOR with inputs [1, 0] produces 0', inputs: [1, 0], expected: 0, expectError: false },
    { id: 'tt-xnor-11', gate: 'XNOR', category: 'truth_table', description: 'XNOR with inputs [1, 1] produces 1', inputs: [1, 1], expected: 1, expectError: false },

    // --- 8. Multi-Input Gates Tests (3-input vectors) (12 tests) ---
    { id: 'mi-and-111', gate: 'AND', category: 'multi_input', description: '3-input AND with [1, 1, 1] produces 1', inputs: [1, 1, 1], expected: 1, expectError: false },
    { id: 'mi-and-101', gate: 'AND', category: 'multi_input', description: '3-input AND with [1, 0, 1] produces 0', inputs: [1, 0, 1], expected: 0, expectError: false },
    { id: 'mi-or-000', gate: 'OR', category: 'multi_input', description: '3-input OR with [0, 0, 0] produces 0', inputs: [0, 0, 0], expected: 0, expectError: false },
    { id: 'mi-or-010', gate: 'OR', category: 'multi_input', description: '3-input OR with [0, 1, 0] produces 1', inputs: [0, 1, 0], expected: 1, expectError: false },
    { id: 'mi-nand-111', gate: 'NAND', category: 'multi_input', description: '3-input NAND with [1, 1, 1] produces 0', inputs: [1, 1, 1], expected: 0, expectError: false },
    { id: 'mi-nand-101', gate: 'NAND', category: 'multi_input', description: '3-input NAND with [1, 0, 1] produces 1', inputs: [1, 0, 1], expected: 1, expectError: false },
    { id: 'mi-nor-000', gate: 'NOR', category: 'multi_input', description: '3-input NOR with [0, 0, 0] produces 1', inputs: [0, 0, 0], expected: 1, expectError: false },
    { id: 'mi-nor-100', gate: 'NOR', category: 'multi_input', description: '3-input NOR with [1, 0, 0] produces 0', inputs: [1, 0, 0], expected: 0, expectError: false },
    { id: 'mi-xor-111', gate: 'XOR', category: 'multi_input', description: '3-input XOR (odd parity) with [1, 1, 1] produces 1', inputs: [1, 1, 1], expected: 1, expectError: false },
    { id: 'mi-xor-110', gate: 'XOR', category: 'multi_input', description: '3-input XOR (even parity) with [1, 1, 0] produces 0', inputs: [1, 1, 0], expected: 0, expectError: false },
    { id: 'mi-xnor-111', gate: 'XNOR', category: 'multi_input', description: '3-input XNOR with [1, 1, 1] produces 0', inputs: [1, 1, 1], expected: 0, expectError: false },
    { id: 'mi-xnor-110', gate: 'XNOR', category: 'multi_input', description: '3-input XNOR with [1, 1, 0] produces 1', inputs: [1, 1, 0], expected: 1, expectError: false },

    // --- 9. Invalid Input Handling Tests (13 tests) ---
    { id: 'inv-not-empty', gate: 'NOT', category: 'invalid_input', description: 'NOT gate with empty array [] throws count error', inputs: [], expected: 'ERROR', expectError: true, expectedErrorSubstring: 'requires exactly 1 input' },
    { id: 'inv-not-too-many', gate: 'NOT', category: 'invalid_input', description: 'NOT gate with [0, 1] throws count error', inputs: [0, 1], expected: 'ERROR', expectError: true, expectedErrorSubstring: 'requires exactly 1 input' },
    { id: 'inv-and-empty', gate: 'AND', category: 'invalid_input', description: 'AND gate with empty array [] throws count error', inputs: [], expected: 'ERROR', expectError: true, expectedErrorSubstring: 'requires at least 2 inputs' },
    { id: 'inv-or-single', gate: 'OR', category: 'invalid_input', description: 'OR gate with single input [1] throws count error', inputs: [1], expected: 'ERROR', expectError: true, expectedErrorSubstring: 'requires at least 2 inputs' },
    { id: 'inv-nand-val-2', gate: 'NAND', category: 'invalid_input', description: 'NAND gate with out-of-range value 2 throws logic level error', inputs: [2, 0], expected: 'ERROR', expectError: true, expectedErrorSubstring: 'Only binary 0 (LOW) or 1 (HIGH) are permissible' },
    { id: 'inv-nor-val-neg', gate: 'NOR', category: 'invalid_input', description: 'NOR gate with negative value -1 throws logic level error', inputs: [-1, 0], expected: 'ERROR', expectError: true, expectedErrorSubstring: 'Only binary 0 (LOW) or 1 (HIGH) are permissible' },
    { id: 'inv-xor-val-float', gate: 'XOR', category: 'invalid_input', description: 'XOR gate with float 0.5 throws logic level error', inputs: [0.5, 1], expected: 'ERROR', expectError: true, expectedErrorSubstring: 'Only binary 0 (LOW) or 1 (HIGH) are permissible' },
    { id: 'inv-xnor-val-nan', gate: 'XNOR', category: 'invalid_input', description: 'XNOR gate with NaN throws logic level error', inputs: [NaN, 1], expected: 'ERROR', expectError: true, expectedErrorSubstring: 'Only binary 0 (LOW) or 1 (HIGH) are permissible' },
    { id: 'inv-and-val-null', gate: 'AND', category: 'invalid_input', description: 'AND gate with null value throws logic level error', inputs: [null, 1], expected: 'ERROR', expectError: true, expectedErrorSubstring: 'Only binary 0 (LOW) or 1 (HIGH) are permissible' },
    { id: 'inv-or-val-undef', gate: 'OR', category: 'invalid_input', description: 'OR gate with undefined value throws logic level error', inputs: [undefined, 0], expected: 'ERROR', expectError: true, expectedErrorSubstring: 'Only binary 0 (LOW) or 1 (HIGH) are permissible' },
    { id: 'inv-nand-val-str', gate: 'NAND', category: 'invalid_input', description: 'NAND gate with string "1" throws logic level error', inputs: ['1', 0], expected: 'ERROR', expectError: true, expectedErrorSubstring: 'Only binary 0 (LOW) or 1 (HIGH) are permissible' },
    { id: 'inv-gate-not-array', gate: 'AND', category: 'invalid_input', description: 'Gate with non-array input throws array error', inputs: null as any, expected: 'ERROR', expectError: true, expectedErrorSubstring: 'must be provided as an array' },
    { id: 'inv-gate-unknown', gate: 'BUFFER', category: 'invalid_input', description: 'Unknown gate type throws architecture error', inputs: [1], expected: 'ERROR', expectError: true, expectedErrorSubstring: 'Unsupported gate architecture' },
  ];

  return specs.map((spec) => {
    const t0 = performance.now();
    let actual: LogicLevel | string;
    let actualError: string | undefined;
    let passed = false;

    try {
      actual = evaluateGate(spec.gate as GateType, spec.inputs);
      if (!spec.expectError) {
        passed = actual === spec.expected;
      } else {
        passed = false; // Expected an error but didn't throw
        actualError = 'Expected error but function succeeded';
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      actualError = errMsg;
      actual = 'ERROR';

      if (spec.expectError) {
        if (spec.expectedErrorSubstring) {
          passed = errMsg.includes(spec.expectedErrorSubstring);
        } else {
          passed = true;
        }
      } else {
        passed = false; // Threw unexpectedly
      }
    }

    const t1 = performance.now();

    return {
      id: spec.id,
      gate: spec.gate,
      category: spec.category,
      description: spec.description,
      inputs: spec.inputs,
      expected: spec.expected,
      actual,
      passed,
      expectedError: spec.expectedErrorSubstring,
      actualError,
      runtimeMs: Number((t1 - t0).toFixed(4)),
    };
  });
}

/**
 * Boolean Expression Practice questions with live procedural evaluator
 */
export const PRACTICE_EXPRESSIONS: ExpressionPracticeItem[] = [
  {
    id: 'exp-1',
    title: 'Dual-Stage Sum of Products',
    expressionDisplay: 'Y = (A · B) + C',
    variables: ['A', 'B', 'C'],
    difficulty: 'Beginner',
    evaluator: (vars) => {
      const term1 = evaluateGate('AND', [vars.A, vars.B]);
      return evaluateGate('OR', [term1, vars.C]);
    },
    stepBreakdown: (vars) => [
      `1. Evaluate AND term: (A · B) = (${vars.A} · ${vars.B}) = ${evaluateGate('AND', [vars.A, vars.B])}`,
      `2. Evaluate OR term: Term1 + C = ${evaluateGate('AND', [vars.A, vars.B])} + ${vars.C} = ${evaluateGate('OR', [evaluateGate('AND', [vars.A, vars.B]), vars.C])}`,
    ],
  },
  {
    id: 'exp-2',
    title: 'XOR Parity Mask',
    expressionDisplay: 'Y = (A ⊕ B) · (~C)',
    variables: ['A', 'B', 'C'],
    difficulty: 'Intermediate',
    evaluator: (vars) => {
      const xorTerm = evaluateGate('XOR', [vars.A, vars.B]);
      const notC = evaluateGate('NOT', [vars.C]);
      return evaluateGate('AND', [xorTerm, notC]);
    },
    stepBreakdown: (vars) => {
      const xorTerm = evaluateGate('XOR', [vars.A, vars.B]);
      const notC = evaluateGate('NOT', [vars.C]);
      const out = evaluateGate('AND', [xorTerm, notC]);
      return [
        `1. Evaluate XOR: (A ⊕ B) = (${vars.A} ⊕ ${vars.B}) = ${xorTerm}`,
        `2. Evaluate Inverter: (~C) = (~${vars.C}) = ${notC}`,
        `3. Evaluate AND: ${xorTerm} · ${notC} = ${out}`,
      ];
    },
  },
  {
    id: 'exp-3',
    title: 'De Morgan Dual Form',
    expressionDisplay: 'Y = ~((A + B) · C)',
    variables: ['A', 'B', 'C'],
    difficulty: 'Intermediate',
    evaluator: (vars) => {
      const orTerm = evaluateGate('OR', [vars.A, vars.B]);
      const andTerm = evaluateGate('AND', [orTerm, vars.C]);
      return evaluateGate('NOT', [andTerm]);
    },
    stepBreakdown: (vars) => {
      const orTerm = evaluateGate('OR', [vars.A, vars.B]);
      const andTerm = evaluateGate('AND', [orTerm, vars.C]);
      const notTerm = evaluateGate('NOT', [andTerm]);
      return [
        `1. Sub-expression (A + B) = (${vars.A} + ${vars.B}) = ${orTerm}`,
        `2. Sub-expression Inner AND = (${orTerm} · ${vars.C}) = ${andTerm}`,
        `3. Inversion ~(Inner AND) = ~(${andTerm}) = ${notTerm}`,
      ];
    },
  },
  {
    id: 'exp-4',
    title: 'Full Adder Carry Logic',
    expressionDisplay: 'C_out = (A · B) + (B · C_in) + (A · C_in)',
    variables: ['A', 'B', 'C_in'],
    difficulty: 'Advanced',
    evaluator: (vars) => {
      const ab = evaluateGate('AND', [vars.A, vars.B]);
      const bc = evaluateGate('AND', [vars.B, vars.C_in]);
      const ac = evaluateGate('AND', [vars.A, vars.C_in]);
      const ab_or_bc = evaluateGate('OR', [ab, bc]);
      return evaluateGate('OR', [ab_or_bc, ac]);
    },
    stepBreakdown: (vars) => {
      const ab = evaluateGate('AND', [vars.A, vars.B]);
      const bc = evaluateGate('AND', [vars.B, vars.C_in]);
      const ac = evaluateGate('AND', [vars.A, vars.C_in]);
      const total = evaluateGate('OR', [evaluateGate('OR', [ab, bc]), ac]);
      return [
        `1. Term 1 (A · B) = (${vars.A} · ${vars.B}) = ${ab}`,
        `2. Term 2 (B · C_in) = (${vars.B} · ${vars.C_in}) = ${bc}`,
        `3. Term 3 (A · C_in) = (${vars.A} · ${vars.C_in}) = ${ac}`,
        `4. Majority Carry: ${ab} + ${bc} + ${ac} = ${total}`,
      ];
    },
  },
  {
    id: 'exp-5',
    title: '2:1 Multiplexer Boolean Equation',
    expressionDisplay: 'Y = (~S · A) + (S · B)',
    variables: ['S', 'A', 'B'],
    difficulty: 'Beginner',
    evaluator: (vars) => {
      const notS = evaluateGate('NOT', [vars.S]);
      const term0 = evaluateGate('AND', [notS, vars.A]);
      const term1 = evaluateGate('AND', [vars.S, vars.B]);
      return evaluateGate('OR', [term0, term1]);
    },
    stepBreakdown: (vars) => {
      const notS = evaluateGate('NOT', [vars.S]);
      const term0 = evaluateGate('AND', [notS, vars.A]);
      const term1 = evaluateGate('AND', [vars.S, vars.B]);
      const out = evaluateGate('OR', [term0, term1]);
      return [
        `1. Invert Select Line (~S): ~${vars.S} = ${notS}`,
        `2. Path 0 (~S · A): ${notS} · ${vars.A} = ${term0}`,
        `3. Path 1 (S · B): ${vars.S} · ${vars.B} = ${term1}`,
        `4. Output Multiplexed Signal: ${term0} + ${term1} = ${out} (selected: input ${vars.S === 0 ? 'A' : 'B'})`,
      ];
    },
  },
];
