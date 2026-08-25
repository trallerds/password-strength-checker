import { describe, it, expect } from "vitest";
import { analyzePassword } from "../src/core/engine";

describe("Password Strength Checker", () => {
  it("should flag very weak passwords like 'password'", async () => {
    const result = await analyzePassword("password");
    expect(result.level).toBe("VERY_WEAK");
    expect(result.score).toBeLessThan(20);
    expect(result.compromised).toBe(true);
  });

  it("should flag '123456' as very weak", async () => {
    const result = await analyzePassword("123456");
    expect(result.level).toBe("VERY_WEAK");
    expect(result.compromised).toBe(true);
  });

  it("should detect keyboard patterns like 'qwerty123'", async () => {
    const result = await analyzePassword("qwerty123");
    const hasKeyboardIssue = result.issues.some((i) => i.type === "KEYBOARD_PATTERN");
    expect(hasKeyboardIssue).toBe(true);
  });

  it("should detect substitutions like 'P@ssw0rd'", async () => {
    const result = await analyzePassword("P@ssw0rd");
    const hasDictIssue = result.issues.some(
      (i) => i.type === "COMMON_PASSWORD" || i.type === "PREDICTABLE_SUBSTITUTION"
    );
    expect(hasDictIssue).toBe(true);
  });

  it("should penalize repeated characters like 'aaaaBBBB1111'", async () => {
    const result = await analyzePassword("aaaaBBBB1111");
    const hasRepetition = result.issues.some(
      (i) => i.type === "REPEATED_CHARACTERS" || i.type === "REPEATED_PATTERN"
    );
    expect(hasRepetition).toBe(true);
  });

  it("should detect sequential characters like 'abcdef'", async () => {
    const result = await analyzePassword("abcdef");
    const hasSeq = result.issues.some((i) => i.type === "SEQUENTIAL_CHARACTERS");
    expect(hasSeq).toBe(true);
  });

  it("should reward long passwords", async () => {
    const result = await analyzePassword("X9$mKp2@vLn7!rT4#bQw8&zJf5*hY1");
    expect(result.level).toBe("STRONG");
    expect(result.score).toBeGreaterThanOrEqual(60);
  });

  it("should recommend longer password for short inputs", async () => {
    const result = await analyzePassword("short");
    expect(result.recommendations).toContain("Use a longer password (at least 12 characters).");
  });

  it("should flag compromised passwords", async () => {
    const result = await analyzePassword("password123");
    expect(result.compromised).toBe(true);
    expect(result.issues.some((i) => i.type === "COMPROMISED")).toBe(true);
  });
});
