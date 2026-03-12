import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const problems = sqliteTable("problems", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  categoryId: integer("category_id")
    .references(() => categories.id)
    .notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  difficulty: text("difficulty", { enum: ["easy", "medium", "hard"] }).notNull(),
  description: text("description").notNull(),
  starterCode: text("starter_code").notNull(),
  solutionCode: text("solution_code").notNull(),
  functionName: text("function_name").notNull(),
  expectedComplexity: text("expected_complexity"),
  hasVisualization: integer("has_visualization", { mode: "boolean" })
    .notNull()
    .default(false),
  visualizationType: text("visualization_type"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const testCases = sqliteTable("test_cases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  problemId: integer("problem_id")
    .references(() => problems.id)
    .notNull(),
  input: text("input").notNull(),
  expectedOutput: text("expected_output").notNull(),
  isHidden: integer("is_hidden", { mode: "boolean" }).notNull().default(false),
  order: integer("order").notNull(),
});

export const submissions = sqliteTable("submissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  problemId: integer("problem_id")
    .references(() => problems.id)
    .notNull(),
  code: text("code").notNull(),
  language: text("language").notNull().default("typescript"),
  status: text("status", {
    enum: [
      "pending",
      "running",
      "accepted",
      "wrong_answer",
      "runtime_error",
      "timeout",
    ],
  }).notNull(),
  results: text("results"),
  executionTimeMs: integer("execution_time_ms"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const userProgress = sqliteTable("user_progress", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  problemId: integer("problem_id")
    .references(() => problems.id)
    .notNull()
    .unique(),
  status: text("status", {
    enum: ["not_started", "attempted", "solved"],
  }).notNull(),
  bestSubmissionId: integer("best_submission_id").references(
    () => submissions.id
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
