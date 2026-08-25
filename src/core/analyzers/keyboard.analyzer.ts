import { AnalyzerResult, PasswordIssue, IssueType, IssueSeverity } from "../types";

const KEYBOARD_ROWS = [
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm",
];

const KEYBOARD_PATTERNS = [
  "qwerty",
  "asdfgh",
  "zxcvbn",
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm",
  "1qaz",
  "2wsx",
  "3edc",
  "4rfv",
  "5tgb",
  "6yhn",
  "7ujm",
  "8ik,",
  "9ol.",
  "0p;/",
];

export function analyzeKeyboard(password: string): AnalyzerResult {
  const issues: PasswordIssue[] = [];
  let score = 0;
  const lower = password.toLowerCase();

  for (const pattern of KEYBOARD_PATTERNS) {
    if (lower.includes(pattern)) {
      issues.push({
        type: IssueType.KEYBOARD_PATTERN,
        severity: IssueSeverity.HIGH,
        message: `Password contains keyboard pattern: "${pattern}".`,
      });
      score -= 20;
      break;
    }
  }

  const reversedLower = lower.split("").reverse().join("");
  for (const pattern of KEYBOARD_PATTERNS) {
    if (reversedLower.includes(pattern)) {
      issues.push({
        type: IssueType.KEYBOARD_PATTERN,
        severity: IssueSeverity.HIGH,
        message: `Password contains reversed keyboard pattern: "${pattern}".`,
      });
      score -= 20;
      break;
    }
  }

  return { score, issues };
}
