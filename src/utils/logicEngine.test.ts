import { evaluateGate, validateGateInputs, runGateUnitTests, InvalidLogicInputError } from './logicEngine';

console.log('=== VLSI DESIGN & VERIFICATION LAB: DIGITAL LOGIC AUDIT & TEST RUNNER ===\n');

const tests = runGateUnitTests();

let passedCount = 0;
let failedCount = 0;

console.log(`Executing ${tests.length} automated test cases across 3 categories:\n`);

// Group by category
const categories = ['truth_table', 'multi_input', 'invalid_input'] as const;

for (const cat of categories) {
  const catTests = tests.filter(t => t.category === cat);
  const catLabel = cat === 'truth_table' 
    ? 'Category 1: Exhaustive Truth Tables (Every Gate & 100% Valid Permutations)' 
    : cat === 'multi_input' 
    ? 'Category 2: Multi-Input Vector Evaluations (3-Input Signals)' 
    : 'Category 3: Invalid Input Handling & Invariant Rejection';

  console.log(`--- ${catLabel} (${catTests.length} tests) ---`);

  for (const test of catTests) {
    if (test.passed) {
      passedCount++;
      const inputStr = Array.isArray(test.inputs) ? `[${test.inputs.join(', ')}]` : String(test.inputs);
      console.log(`  ✓ [PASS] ${test.id.padEnd(18)} | Gate: ${test.gate.padEnd(6)} | Inputs: ${inputStr.padEnd(12)} | Result: ${test.actual} (${test.runtimeMs}ms)`);
    } else {
      failedCount++;
      console.error(`  ✗ [FAIL] ${test.id} | Gate: ${test.gate} | Description: ${test.description}`);
      console.error(`     Expected: ${test.expected}, Actual: ${test.actual}, Error: ${test.actualError}`);
    }
  }
  console.log('');
}

console.log('================================================================');
console.log(`TOTAL TESTS: ${tests.length} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
console.log(`PASS RATE: ${((passedCount / tests.length) * 100).toFixed(1)}%`);
console.log('================================================================');

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log('\nAll digital logic test vectors verified successfully without error.');
}
