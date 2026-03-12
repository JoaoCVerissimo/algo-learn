import type { FastifyInstance } from "fastify";
import { eq, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { problems, testCases, categories } from "../db/schema.js";

export async function problemRoutes(app: FastifyInstance) {
  app.get("/api/categories", async () => {
    return db.select().from(categories).all();
  });

  app.get<{
    Querystring: { category?: string; difficulty?: string };
  }>("/api/problems", async (request) => {
    const { category, difficulty } = request.query;

    const allProblems = await db
      .select({
        id: problems.id,
        title: problems.title,
        slug: problems.slug,
        difficulty: problems.difficulty,
        categorySlug: categories.slug,
        categoryName: categories.name,
        hasVisualization: problems.hasVisualization,
        expectedComplexity: problems.expectedComplexity,
      })
      .from(problems)
      .innerJoin(categories, eq(problems.categoryId, categories.id))
      .all();

    return allProblems.filter((p) => {
      if (category && p.categorySlug !== category) return false;
      if (difficulty && p.difficulty !== difficulty) return false;
      return true;
    });
  });

  app.get<{ Params: { slug: string } }>(
    "/api/problems/:slug",
    async (request, reply) => {
      const { slug } = request.params;

      const problem = await db
        .select({
          id: problems.id,
          title: problems.title,
          slug: problems.slug,
          difficulty: problems.difficulty,
          description: problems.description,
          starterCode: problems.starterCode,
          functionName: problems.functionName,
          expectedComplexity: problems.expectedComplexity,
          hasVisualization: problems.hasVisualization,
          visualizationType: problems.visualizationType,
          categoryName: categories.name,
          categorySlug: categories.slug,
        })
        .from(problems)
        .innerJoin(categories, eq(problems.categoryId, categories.id))
        .where(eq(problems.slug, slug))
        .get();

      if (!problem) {
        return reply.status(404).send({ error: "Problem not found" });
      }

      const visibleTests = await db
        .select({
          id: testCases.id,
          input: testCases.input,
          expectedOutput: testCases.expectedOutput,
          order: testCases.order,
        })
        .from(testCases)
        .where(
          and(
            eq(testCases.problemId, problem.id),
            eq(testCases.isHidden, false)
          )
        )
        .orderBy(testCases.order)
        .all();

      return { ...problem, testCases: visibleTests };
    }
  );
}
