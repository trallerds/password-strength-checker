# Password Strength Checker

Security-focused password strength analysis for Node.js and TypeScript.

## Install

### GitHub Packages

```bash
npm install @trallerds/password-strength-checker
```

Make sure your project has an `.npmrc` with:

```ini
@trallerds:registry=https://npm.pkg.github.com
```

And authenticate with a GitHub personal access token (classic) with `read:packages` scope:

```bash
npm login --scope=@trallerds --auth-type=legacy --registry=https://npm.pkg.github.com
```

### npmjs.com

```bash
npm install @trallerds/password-strength-checker
```

## Usage

```ts
import { checkPassword } from "@trallerds/password-strength-checker";

const result = await checkPassword("MinhaSenha123!");

console.log(result.level); // "WEAK"
console.log(result.score); // 42
console.log(result.issues); // [...]
console.log(result.recommendations); // [...]
```

## Response

```ts
{
  score: number;
  level: "VERY_WEAK" | "WEAK" | "FAIR" | "STRONG" | "VERY_STRONG";
  entropyBits: number;
  estimatedGuesses: number;
  compromised: boolean;
  issues: Array<{
    type: string;
    severity: "critical" | "high" | "medium" | "low" | "info";
    message: string;
  }>;
  recommendations: string[];
}
```

## API

### `checkPassword(password: string): Promise<PasswordAnalysis>`

Runs the full analysis pipeline:
- Length analysis
- Character set variety
- Repetition detection
- Sequential character detection
- Keyboard pattern detection
- Dictionary / common password detection
- Date and year pattern detection
- Breach detection

## Server

```bash
npm run dev
```

Then:

```bash
curl -X POST http://localhost:3000/password/strength \
  -H "Content-Type: application/json" \
  -d '{"password":"P@ssword2026!"}'
```

## License

ISC
