import { PasswordLevel, PasswordAnalysis, PasswordIssue } from "./types";
import { analyzeLength } from "./analyzers/length.analyzer";
import { analyzeCharacterSet } from "./analyzers/character-set.analyzer";
import { analyzeRepetition } from "./analyzers/repetition.analyzer";
import { analyzeSequence } from "./analyzers/sequence.analyzer";
import { analyzeKeyboard } from "./analyzers/keyboard.analyzer";
import { analyzeDictionary } from "./analyzers/dictionary.analyzer";
import { analyzeBreach } from "./analyzers/breach.analyzer";
import { analyzeDate } from "./analyzers/date.analyzer";

export function computeScore(results: Array<{ score: number; issues: PasswordIssue[] }>): PasswordAnalysis {
  let totalScore = 0;
  const allIssues: PasswordIssue[] = [];
  let compromised = false;

  for (const result of results) {
    totalScore += result.score;
    allIssues.push(...result.issues);
    for (const issue of result.issues) {
      if (issue.type === "COMPROMISED") {
        compromised = true;
      }
    }
  }

  totalScore = Math.max(0, Math.min(100, totalScore));

  const level = getLevel(totalScore);

  const recommendations = generateRecommendations(allIssues);

  return {
    score: totalScore,
    level,
    entropyBits: 0,
    estimatedGuesses: 0,
    compromised,
    issues: allIssues,
    recommendations,
  };
}

function getLevel(score: number): PasswordLevel {
  if (score < 20) return PasswordLevel.VERY_WEAK;
  if (score < 40) return PasswordLevel.WEAK;
  if (score < 60) return PasswordLevel.FAIR;
  if (score < 80) return PasswordLevel.STRONG;
  return PasswordLevel.VERY_STRONG;
}

function generateRecommendations(issues: PasswordIssue[]): string[] {
  const recommendations: string[] = [];

  const hasType = (type: string) => issues.some((i) => i.type === type);

  if (hasType("TOO_SHORT")) {
    recommendations.push("Use a longer password (at least 12 characters).");
  }
  if (hasType("COMMON_PASSWORD")) {
    recommendations.push("Avoid common passwords.");
  }
  if (hasType("PREDICTABLE_SUBSTITUTION")) {
    recommendations.push("Avoid predictable substitutions like p@ssw0rd.");
  }
  if (hasType("REPEATED_CHARACTERS")) {
    recommendations.push("Avoid excessive repeated characters.");
  }
  if (hasType("REPEATED_PATTERN")) {
    recommendations.push("Avoid repeated patterns in your password.");
  }
  if (hasType("SEQUENTIAL_CHARACTERS")) {
    recommendations.push("Avoid sequential characters like abc or 123.");
  }
  if (hasType("KEYBOARD_PATTERN")) {
    recommendations.push("Avoid keyboard patterns like qwerty or asdf.");
  }
  if (hasType("YEAR_PATTERN")) {
    recommendations.push("Avoid using years or dates in your password.");
  }
  if (hasType("DATE_PATTERN")) {
    recommendations.push("Avoid using dates in your password.");
  }
  if (hasType("COMPROMISED")) {
    recommendations.push("Use a unique password that has not been exposed in data breaches.");
  }
  if (hasType("LOW_CHARACTER_VARIETY")) {
    recommendations.push("Use a mix of uppercase, lowercase, numbers, and symbols.");
  }

  if (recommendations.length === 0) {
    recommendations.push("Password looks good!");
  }

  return recommendations;
}

export async function analyzePassword(password: string): Promise<PasswordAnalysis> {
  const lengthResult = analyzeLength(password);
  const characterSetResult = analyzeCharacterSet(password);
  const repetitionResult = analyzeRepetition(password);
  const sequenceResult = analyzeSequence(password);
  const keyboardResult = analyzeKeyboard(password);
  const dictionaryResult = analyzeDictionary(password);
  const dateResult = analyzeDate(password);
  const breachResult = await analyzeBreach(password);

  const results = [
    lengthResult,
    characterSetResult,
    repetitionResult,
    sequenceResult,
    keyboardResult,
    dictionaryResult,
    dateResult,
    breachResult,
  ];

  const analysis = computeScore(results);

  analysis.entropyBits = estimateEntropy(password);
  analysis.estimatedGuesses = estimateGuesses(password, analysis.score);

  return analysis;
}

function estimateEntropy(password: string): number {
  let poolSize = 0;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);

  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasDigit) poolSize += 10;
  if (hasSymbol) poolSize += 32;

  if (poolSize === 0) return 0;

  const len = password.length;
  return len * Math.log2(poolSize);
}

function estimateGuesses(password: string, score: number): number {
  const entropy = estimateEntropy(password);
  const base = Math.pow(2, entropy);

  const penalty = score < 40 ? 100 : score < 60 ? 10 : 1;

  return Math.floor(base / penalty);
}
