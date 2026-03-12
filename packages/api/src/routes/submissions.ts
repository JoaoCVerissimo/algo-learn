import type { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { submissions, testCases, problems, userProgress } from "../db/schema.js";
import { executeCode } from "../services/codeRunner.js";

export async function submissionRoutes(app: FastifyInstance) {
  app.post<{
    Body: { problemId: number; code: string; language?: string };
  }>("/api/submissions", async (request, reply) => {
    const { problemId, code, language = "typescript" } = request.body;

    const problem = await db
      .select()
      .from(problems)
      .where(eq(problems.id, problemId))
      .get();

    if (!problem) {
      return reply.status(404).send({ error: "Problem not found" });
    }

    const allTestCases = await db
      .select()
      .from(testCases)
      .where(eq(testCases.problemId, problemId))
      .orderBy(testCases.order)
      .all();

    const submission = await db
      .insert(submissions)
      .values({
        problemId,
        code,
        language,
        status: "running",
      })
      .returning()
      .get();

    try {
      const result = await executeCode(
        code,
        allTestCases.map((tc) => ({
          id: tc.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
        })),
        problem.functionName
      );

      const updated = await db
        .update(submissions)
        .set({
          status: result.status,
          results: JSON.stringify(result.results),
          executionTimeMs: result.totalTimeMs,
        })
        .where(eq(submissions.id, submission.id))
        .returning()
        .get();

      // Update user progress
      const existing = await db
        .select()
        .from(userProgress)
        .where(eq(userProgress.problemId, problemId))
        .get();

      if (result.status === "accepted") {
        if (existing) {
          await db
            .update(userProgress)
            .set({
              status: "solved",
              bestSubmissionId: submission.id,
              updatedAt: new Date(),
            })
            .where(eq(userProgress.problemId, problemId));
        } else {
          await db.insert(userProgress).values({
            problemId,
            status: "solved",
            bestSubmissionId: submission.id,
          });
        }
      } else if (!existing) {
        await db.insert(userProgress).values({
          problemId,
          status: "attempted",
        });
      } else if (existing.status === "not_started") {
        await db
          .update(userProgress)
          .set({ status: "attempted", updatedAt: new Date() })
          .where(eq(userProgress.problemId, problemId));
      }

      return {
        id: updated.id,
        status: updated.status,
        results: result.results,
        totalTimeMs: result.totalTimeMs,
      };
    } catch (error) {
      await db
        .update(submissions)
        .set({ status: "runtime_error" })
        .where(eq(submissions.id, submission.id));

      return reply.status(500).send({
        error: "Code execution failed",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  app.get<{ Params: { id: string } }>(
    "/api/submissions/:id",
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const submission = await db
        .select()
        .from(submissions)
        .where(eq(submissions.id, id))
        .get();

      if (!submission) {
        return reply.status(404).send({ error: "Submission not found" });
      }

      return {
        id: submission.id,
        status: submission.status,
        results: submission.results ? JSON.parse(submission.results) : [],
        totalTimeMs: submission.executionTimeMs,
      };
    }
  );

  app.get("/api/progress", async () => {
    return db.select().from(userProgress).all();
  });
}
