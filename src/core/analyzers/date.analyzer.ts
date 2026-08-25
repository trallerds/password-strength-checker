import { AnalyzerResult, PasswordIssue, IssueType, IssueSeverity } from "../types";

const YEAR_REGEX = /(19|20)\d{2}/;

export function analyzeDate(password: string): AnalyzerResult {
  const issues: PasswordIssue[] = [];
  let score = 0;
  const lower = password.toLowerCase();

  const yearMatch = lower.match(YEAR_REGEX);
  if (yearMatch) {
    issues.push({
      type: IssueType.YEAR_PATTERN,
      severity: IssueSeverity.MEDIUM,
      message: `Password contains a predictable year pattern: "${yearMatch[0]}".`,
    });
    score -= 15;
  }

  const dateMatch = lower.match(/\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/);
  if (dateMatch) {
    issues.push({
      type: IssueType.DATE_PATTERN,
      severity: IssueSeverity.MEDIUM,
      message: `Password contains a date pattern: "${dateMatch[0]}".`,
    });
    score -= 15;
  }

  return { score, issues };
}
