import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { PasswordService } from "../services/password.service";
import { passwordRequestSchema } from "../../shared/schemas/password.schema";

export async function passwordController(app: FastifyInstance) {
  const service = new PasswordService();

  app.post("/password/strength", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = passwordRequestSchema.parse(request.body);
      const result = await service.checkStrength(body.password);

      return reply.send(result);
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({ error: error.message });
      }
      return reply.status(400).send({ error: "Invalid request" });
    }
  });
}
