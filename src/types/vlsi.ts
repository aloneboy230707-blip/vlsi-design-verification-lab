export type ActiveView = 
  | 'dashboard'
  | 'digital-logic'
  | 'verilog-studio'
  | 'verification-bench'
  | 'learning-library'
  | 'interview-prep'
  | 'my-progress'
  | 'profile-settings';

export type GateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';

export type LogicLevel = 0 | 1;

export interface GateDefinition {
  type: GateType;
  name: string;
  symbol: string;
  inputsCount: number;
  booleanEquation: string;
  verilogOperator: string;
  description: string;
  cmosTransistorCount: number;
}

export interface TruthTableRow {
  inputs: Record<string, LogicLevel>;
  output: LogicLevel;
  isActive?: boolean;
}

export interface GateUnitTest {
  id: string;
  gate: GateType | string;
  category: 'truth_table' | 'multi_input' | 'invalid_input';
  description: string;
  inputs: any[];
  expected: LogicLevel | string;
  actual?: LogicLevel | string;
  passed?: boolean;
  runtimeMs?: number;
  expectedError?: string;
  actualError?: string;
}

export interface ExpressionPracticeItem {
  id: string;
  title: string;
  expressionDisplay: string;
  variables: string[];
  evaluator: (vars: Record<string, LogicLevel>) => LogicLevel;
  stepBreakdown: (vars: Record<string, LogicLevel>) => string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface VerilogModuleItem {
  id: string;
  title: string;
  category: 'Combinational' | 'Sequential';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  moduleInterface: string;
  exampleSolution: string;
  testbenchExample: string;
  expectedBehavior: string;
  explanation: string;
}

export interface InterviewQuestionItem {
  id: string;
  topic: string;
  difficulty: 'Core Fundamentals' | 'Intermediate RTL' | 'Advanced Verification / STA';
  question: string;
  modelAnswer: string;
  frequentlyAskedAt: string[];
  keyTakeaway: string;
}

export interface LearningTopicItem {
  id: string;
  title: string;
  category: string;
  estimatedMinutes: number;
  summary: string;
  prerequisites: string[];
  subtopics: string[];
}

export interface UserProgressData {
  completedGateQuizzes: number;
  totalGateQuizzes: number;
  verilogCompletedIds: string[];
  testVectorsRunCount: number;
  practiceStreakDays: number;
  logicScore: number;
  lastActiveDate: string;
  theme: 'dark' | 'light';
  userName: string;
  targetRole: string;
}
