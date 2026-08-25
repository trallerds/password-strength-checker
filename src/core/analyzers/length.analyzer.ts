import { AnalyzerResult, PasswordIssue, IssueType, IssueSeverity } from "../types";

export function analyzeLength(password: string): AnalyzerResult {
  const issues: PasswordIssue[] = [];
  let score = 0;

  const len = password.length;

  if (len < 8) {
    issues.push({
      type: IssueType.TOO_SHORT,
      severity: IssueSeverity.CRITICAL,
      message: `Password is too short (${len} characters). Minimum recommended length is 8.`,
    });
    score = -30;
  } else if (len < 12) {
    issues.push({
      type: IssueType.TOO_SHORT,
      severity: IssueSeverity.HIGH,
      message: `Password is short (${len} characters). Consider using at least 12 characters.`,
    });
    score = 5;
  } else if (len < 16) {
    score = 15;
  } else if (len < 20) {
    score = 25;
  } else {
    score = 45;
  }

  return { score, issues };
}
