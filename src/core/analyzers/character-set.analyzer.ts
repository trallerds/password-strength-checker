import { AnalyzerResult, PasswordIssue, IssueType, IssueSeverity } from "../types";

export function analyzeCharacterSet(password: string): AnalyzerResult {
  const issues: PasswordIssue[] = [];
  let score = 0;

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);

  const varietyCount = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length;

  if (varietyCount === 1) {
    issues.push({
      type: IssueType.LOW_CHARACTER_VARIETY,
      severity: IssueSeverity.MEDIUM,
      message: "Password uses only one type of character.",
    });
    score -= 10;
  } else if (varietyCount === 2) {
    issues.push({
      type: IssueType.LOW_CHARACTER_VARIETY,
      severity: IssueSeverity.LOW,
      message: "Password uses only two types of characters.",
    });
    score -= 5;
  }

  if (hasLower && hasUpper && hasDigit && hasSymbol) {
    score += 25;
  } else if (varietyCount === 3) {
    score += 15;
  }

  return { score, issues };
}
