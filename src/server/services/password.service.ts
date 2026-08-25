import { PasswordAnalysis } from "../../core";
import { analyzePassword } from "../../core/engine";

export class PasswordService {
  async checkStrength(password: string): Promise<PasswordAnalysis> {
    const analysis = await analyzePassword(password);
    return analysis;
  }
}
