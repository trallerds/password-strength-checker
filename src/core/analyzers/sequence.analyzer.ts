import { AnalyzerResult, PasswordIssue, IssueType, IssueSeverity } from "../types";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";

export function analyzeSequence(password: string): AnalyzerResult {
  const issues: PasswordIssue[] = [];
  let score = 0;
  const lower = password.toLowerCase();

  const alphaChars = lower.split("").filter((c) => /[a-z]/.test(c)).join("");
  const digitChars = lower.split("").filter((c) => /[0-9]/.test(c)).join("");

  const hasSequential = (str: string, length: number): boolean => {
    for (let i = 0; i <= str.length - length; i++) {
      const slice = str.slice(i, i + length);
      let sequential = true;
      for (let j = 1; j < slice.length; j++) {
        if (slice.charCodeAt(j) !== slice.charCodeAt(j - 1) + 1) {
          sequential = false;
          break;
        }
      }
      if (sequential) return true;
    }
    return false;
  };

  const hasReverseSequential = (str: string, length: number): boolean => {
    for (let i = 0; i <= str.length - length; i++) {
      const slice = str.slice(i, i + length);
      let sequential = true;
      for (let j = 1; j < slice.length; j++) {
        if (slice.charCodeAt(j) !== slice.charCodeAt(j - 1) - 1) {
          sequential = false;
          break;
        }
      }
      if (sequential) return true;
    }
    return false;
  };

  const hasAlphaSeq = hasSequential(alphaChars, 3) || hasReverseSequential(alphaChars, 3);
  const hasDigitSeq = hasSequential(digitChars, 3) || hasReverseSequential(digitChars, 3);

  if (hasAlphaSeq || hasDigitSeq) {
    issues.push({
      type: IssueType.SEQUENTIAL_CHARACTERS,
      severity: IssueSeverity.HIGH,
      message: "Password contains sequential characters (e.g., abc, 123).",
    });
    score -= 25;
  }

  return { score, issues };
}
