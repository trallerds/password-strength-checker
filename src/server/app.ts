import Fastify from "fastify";
import cors from "@fastify/cors";
import { passwordController } from "./controllers/password.controller";

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || "info",
    },
  });

  await app.register(cors, {
    origin: true,
  });

  app.get("/health", async () => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });

  await passwordController(app);

  return app;
}
