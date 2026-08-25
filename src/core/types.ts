export enum PasswordLevel {
  VERY_WEAK = "VERY_WEAK",
  WEAK = "WEAK",
  FAIR = "FAIR",
  STRONG = "STRONG",
  VERY_STRONG = "VERY_STRONG",
}

export enum IssueType {
  TOO_SHORT = "TOO_SHORT",
  COMMON_PASSWORD = "COMMON_PASSWORD",
  PREDICTABLE_SUBSTITUTION = "PREDICTABLE_SUBSTITUTION",
  REPEATED_CHARACTERS = "REPEATED_CHARACTERS",
  REPEATED_PATTERN = "REPEATED_PATTERN",
  SEQUENTIAL_CHARACTERS = "SEQUENTIAL_CHARACTERS",
  KEYBOARD_PATTERN = "KEYBOARD_PATTERN",
  YEAR_PATTERN = "YEAR_PATTERN",
  DATE_PATTERN = "DATE_PATTERN",
  LOW_ENTROPY = "LOW_ENTROPY",
  COMPROMISED = "COMPROMISED",
  LOW_CHARACTER_VARIETY = "LOW_CHARACTER_VARIETY",
}

export enum IssueSeverity {
  CRITICAL = "critical",
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
  INFO = "info",
}

export interface PasswordIssue {
  type: IssueType;
  severity: IssueSeverity;
  message: string;
}

export interface AnalyzerResult {
  score: number;
  issues: PasswordIssue[];
}

export interface PasswordAnalysis {
  score: number;
  level: PasswordLevel;
  entropyBits: number;
  estimatedGuesses: number;
  compromised: boolean;
  issues: PasswordIssue[];
  recommendations: string[];
}
