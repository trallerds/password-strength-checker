import { z } from "zod";

export const passwordRequestSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export type PasswordRequest = z.infer<typeof passwordRequestSchema>;
