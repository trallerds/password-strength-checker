import { AnalyzerResult, PasswordIssue, IssueType, IssueSeverity } from "../types";

const BREACHED_PASSWORDS = new Set([
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
  "111111",
  "123123",
  "1234",
  "12345",
  "1234567",
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
  "p@ssw0rd",
  "P@ssw0rd",
  "p@55w0rd",
  "passw0rd",
  "summer2026",
  "spring2026",
  "winter2026",
  "fall2026",
  "20252026",
  "20262026",
]);

export async function analyzeBreach(password: string): Promise<AnalyzerResult> {
  const issues: PasswordIssue[] = [];
  let score = 0;

  const isBreached = BREACHED_PASSWORDS.has(password.toLowerCase());

  if (isBreached) {
    issues.push({
      type: IssueType.COMPROMISED,
      severity: IssueSeverity.CRITICAL,
      message: "This password has appeared in known data breaches.",
    });
    score -= 60;
  }

  return { score, issues };
}

export async function checkBreachKAnonymity(password: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  const prefix = hashHex.slice(0, 5);
  const suffix = hashHex.slice(5).toUpperCase();

  try {
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { "User-Agent": "PasswordStrengthChecker/1.0" },
    });

    if (!response.ok) {
      return false;
    }

    const text = await response.text();
    const lines = text.split("\n");

    for (const line of lines) {
      const [hash, count] = line.split(":");
      if (hash && hash.trim().toUpperCase() === suffix) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}
