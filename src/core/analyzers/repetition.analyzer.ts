import { AnalyzerResult, PasswordIssue, IssueType, IssueSeverity } from "../types";

export function analyzeRepetition(password: string): AnalyzerResult {
  const issues: PasswordIssue[] = [];
  let score = 0;

  const lower = password.toLowerCase();

  const repeatedChars = (str: string): boolean => {
    const counts = new Map<string, number>();
    for (const c of str) {
      counts.set(c, (counts.get(c) || 0) + 1);
    }
    const max = Math.max(...counts.values());
    return max >= 6;
  };

  if (repeatedChars(lower)) {
    issues.push({
      type: IssueType.REPEATED_CHARACTERS,
      severity: IssueSeverity.HIGH,
      message: "Password contains too many repeated characters.",
    });
    score -= 20;
  }

  const repeatedPatterns: string[] = [];
  for (let len = 2; len <= Math.floor(lower.length / 2); len++) {
    const pattern = lower.slice(0, len);
    const repeats = lower.match(new RegExp(`(${escapeRegex(pattern)})+`, "g"));
    if (repeats && repeats[0].length >= pattern.length * 2) {
      repeatedPatterns.push(pattern);
    }
  }

  if (repeatedPatterns.length > 0) {
    issues.push({
      type: IssueType.REPEATED_PATTERN,
      severity: IssueSeverity.HIGH,
      message: `Password contains repeated pattern: "${repeatedPatterns[0]}".`,
    });
    score -= 25;
  }

  return { score, issues };
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
