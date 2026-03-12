import { db } from "../db/index.js";
import { categories, problems, testCases } from "../db/schema.js";
import { seedCategories, seedProblems } from "./problems.js";

async function seed() {
  console.log("Seeding database...");

  // Insert categories
  for (const cat of seedCategories) {
    await db
      .insert(categories)
      .values(cat)
      .onConflictDoNothing();
  }
  console.log(`Seeded ${seedCategories.length} categories`);

  // Get categories for lookup
  const allCategories = await db.select().from(categories).all();
  const categoryMap = new Map(allCategories.map((c) => [c.slug, c.id]));

  // Insert problems and test cases
  for (const problem of seedProblems) {
    const categoryId = categoryMap.get(problem.categorySlug);
    if (!categoryId) {
      console.warn(`Category not found: ${problem.categorySlug}`);
      continue;
    }

    const inserted = await db
      .insert(problems)
      .values({
        categoryId,
        title: problem.title,
        slug: problem.slug,
        difficulty: problem.difficulty,
        description: problem.description,
        starterCode: problem.starterCode,
        solutionCode: problem.solutionCode,
        functionName: problem.functionName,
        expectedComplexity: problem.expectedComplexity,
        hasVisualization: problem.hasVisualization,
        visualizationType: problem.visualizationType,
      })
      .onConflictDoNothing()
      .returning()
      .get();

    if (inserted) {
      for (let i = 0; i < problem.testCases.length; i++) {
        const tc = problem.testCases[i];
        await db.insert(testCases).values({
          problemId: inserted.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          isHidden: tc.isHidden,
          order: i + 1,
        });
      }
      console.log(`  Seeded problem: ${problem.title} (${problem.testCases.length} test cases)`);
    } else {
      console.log(`  Skipped (exists): ${problem.title}`);
    }
  }

  console.log("Seeding complete!");
}

seed().catch(console.error);
