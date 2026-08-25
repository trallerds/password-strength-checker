import { AnalyzerResult, PasswordIssue, IssueType, IssueSeverity } from "../types";

const COMMON_PASSWORDS = new Set([
  "password",
  "123456",
  "12345678",
  "123456789",
  "1234567890",
  "qwerty",
  "abc123",
  "password1",
  "iloveyou",
  "admin",
  "letmein",
  "welcome",
  "monkey",
  "dragon",
  "master",
  "login",
  "princess",
  "football",
  "shadow",
  "sunshine",
  "trustno1",
  "iloveu",
  "superman",
  "batman",
  "harley",
  "qwerty123",
  "1q2w3e4r",
  "donald",
  "password123",
  "0",
  "111111",
  "123123",
  "1234",
  "12345",
  "1234567",
  "12345678910",
  "654321",
  "666666",
  "7777777",
  "888888",
  "999999",
  "123qwe",
  "qwe123",
  "1q2w3e",
  "qazwsx",
  "password!",
  "p@ssword",
  "admin123",
  "root",
  "toor",
  "pass",
  "test",
  "guest",
]);

const COMMON_SUBSTITUTIONS: Record<string, string> = {
  "@": "a",
  "4": "a",
  "3": "e",
  "1": "i",
  "!": "i",
  "0": "o",
  "5": "s",
  "$": "s",
  "7": "t",
  "+": "t",
};

export function analyzeDictionary(password: string): AnalyzerResult {
  const issues: PasswordIssue[] = [];
  let score = 0;
  const lower = password.toLowerCase();

  if (COMMON_PASSWORDS.has(lower)) {
    issues.push({
      type: IssueType.COMMON_PASSWORD,
      severity: IssueSeverity.CRITICAL,
      message: "Password is a commonly used password.",
    });
    score -= 50;
    return { score, issues };
  }

  const normalized = normalizeSubstitutions(lower);
  if (COMMON_PASSWORDS.has(normalized)) {
    issues.push({
      type: IssueType.COMMON_PASSWORD,
      severity: IssueSeverity.CRITICAL,
      message: "Password is a commonly used password with substitutions.",
    });
    score -= 45;
    return { score, issues };
  }

  for (const common of COMMON_PASSWORDS) {
    if (common.length >= 6 && normalized.includes(common)) {
      issues.push({
        type: IssueType.PREDICTABLE_SUBSTITUTION,
        severity: IssueSeverity.HIGH,
        message: `Password contains common word pattern: "${common}".`,
      });
      score -= 30;
      break;
    }
  }

  return { score, issues };
}

function normalizeSubstitutions(str: string): string {
  let result = str;
  for (const [sub, letter] of Object.entries(COMMON_SUBSTITUTIONS)) {
    result = result.split(sub).join(letter);
  }
  return result;
}
