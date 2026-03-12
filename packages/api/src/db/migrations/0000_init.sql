CREATE TABLE IF NOT EXISTS `categories` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `categories_slug_unique` ON `categories` (`slug`);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `problems` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `category_id` integer NOT NULL REFERENCES `categories`(`id`),
  `title` text NOT NULL,
  `slug` text NOT NULL,
  `difficulty` text NOT NULL,
  `description` text NOT NULL,
  `starter_code` text NOT NULL,
  `solution_code` text NOT NULL,
  `function_name` text NOT NULL,
  `expected_complexity` text,
  `has_visualization` integer NOT NULL DEFAULT 0,
  `visualization_type` text,
  `created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `problems_slug_unique` ON `problems` (`slug`);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `test_cases` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `problem_id` integer NOT NULL REFERENCES `problems`(`id`),
  `input` text NOT NULL,
  `expected_output` text NOT NULL,
  `is_hidden` integer NOT NULL DEFAULT 0,
  `order` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `submissions` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `problem_id` integer NOT NULL REFERENCES `problems`(`id`),
  `code` text NOT NULL,
  `language` text NOT NULL DEFAULT 'typescript',
  `status` text NOT NULL,
  `results` text,
  `execution_time_ms` integer,
  `created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `user_progress` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `problem_id` integer NOT NULL REFERENCES `problems`(`id`),
  `status` text NOT NULL,
  `best_submission_id` integer REFERENCES `submissions`(`id`),
  `updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `user_progress_problem_id_unique` ON `user_progress` (`problem_id`);
