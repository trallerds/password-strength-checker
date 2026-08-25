import { buildApp } from "./app";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

async function main() {
  const app = await buildApp();

  try {
    await app.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
