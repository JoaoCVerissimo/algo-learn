import Fastify from "fastify";
import cors from "@fastify/cors";
import { runMigrations } from "./db/index.js";
import { problemRoutes } from "./routes/problems.js";
import { submissionRoutes } from "./routes/submissions.js";

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: ["http://localhost:3000", "http://localhost:5173"],
});

app.register(problemRoutes);
app.register(submissionRoutes);

app.get("/api/health", async () => ({ status: "ok" }));

try {
  runMigrations();
  console.log("Database migrations applied");
} catch (error) {
  console.log("Skipping migrations (run db:migrate first):", error);
}

const port = parseInt(process.env.PORT || "3001", 10);
const host = process.env.HOST || "0.0.0.0";

app.listen({ port, host }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
