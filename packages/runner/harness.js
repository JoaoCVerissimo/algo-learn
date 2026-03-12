// Test harness - runs inside the Docker sandbox
// Reads user solution + test cases, executes, outputs structured JSON

const { readFileSync } = require("fs");
const { join } = require("path");
const { createRequire } = require("module");

const WORK_DIR = "/sandbox/work";

async function run() {
  try {
    const meta = JSON.parse(readFileSync(join(WORK_DIR, "meta.json"), "utf-8"));
    const tests = JSON.parse(readFileSync(join(WORK_DIR, "tests.json"), "utf-8"));
    const solutionCode = readFileSync(join(WORK_DIR, "solution.ts"), "utf-8");

    // Strip TypeScript type annotations for plain JS execution
    const jsCode = stripTypes(solutionCode);

    // Write transpiled code to tmp for execution
    const { writeFileSync } = require("fs");
    writeFileSync("/tmp/solution.js", jsCode);

    // Load the user's module
    const userModule = require("/tmp/solution.js");
    const fn = userModule[meta.functionName] || userModule.default;

    if (typeof fn !== "function") {
      console.log(JSON.stringify({
        results: tests.map((t) => ({
          testCaseId: t.id,
          passed: false,
          actualOutput: null,
          error: `Function "${meta.functionName}" not found or not exported`,
          executionTimeMs: 0,
        })),
      }));
      return;
    }

    const results = [];

    for (const test of tests) {
      const startTime = performance.now();
      try {
        const input = JSON.parse(test.input);
        const args = Array.isArray(input) ? input : [input];
        const result = fn(...args);
        const endTime = performance.now();
        const actualOutput = JSON.stringify(result);
        const expectedOutput = test.expectedOutput.replace(/\s/g, "");
        const actualNormalized = actualOutput.replace(/\s/g, "");

        results.push({
          testCaseId: test.id,
          passed: actualNormalized === expectedOutput,
          actualOutput,
          error: null,
          executionTimeMs: Math.round(endTime - startTime),
        });
      } catch (err) {
        const endTime = performance.now();
        results.push({
          testCaseId: test.id,
          passed: false,
          actualOutput: null,
          error: err.message || String(err),
          executionTimeMs: Math.round(endTime - startTime),
        });
      }
    }

    console.log(JSON.stringify({ results }));
  } catch (err) {
    console.log(JSON.stringify({
      results: [{
        testCaseId: 0,
        passed: false,
        actualOutput: null,
        error: `Harness error: ${err.message || String(err)}`,
        executionTimeMs: 0,
      }],
    }));
  }
}

// Simple TypeScript type stripping (handles common patterns)
function stripTypes(code) {
  return code
    // Remove import type statements
    .replace(/import\s+type\s+\{[^}]*\}\s+from\s+['"][^'"]*['"];?\s*/g, "")
    // Remove type annotations from parameters: (x: Type) -> (x)
    .replace(/:\s*(?:number|string|boolean|void|any|unknown|never|null|undefined|object)(?:\[\])*(?:\s*\|\s*(?:number|string|boolean|void|any|unknown|never|null|undefined|object|null)(?:\[\])*)*\s*/g, " ")
    // Remove generic type params: <T, U> -> empty
    .replace(/<[A-Z][A-Za-z0-9,\s]*>/g, "")
    // Remove type assertions: as Type
    .replace(/\s+as\s+\w+/g, "")
    // Remove interface/type declarations
    .replace(/(?:export\s+)?(?:interface|type)\s+\w+[^{]*\{[^}]*\}/g, "")
    // Remove return type annotations: ): Type { -> ) {
    .replace(/\)\s*:\s*[A-Za-z<>\[\]|,\s{}\(\)]+\s*\{/g, ") {")
    // Fix remaining complex type annotations in function params
    .replace(/(\w+)\s*:\s*(?:Record|Array|Map|Set|Promise)<[^>]+>/g, "$1")
    // Remove remaining simple type annotations
    .replace(/(\w+)\s*:\s*(?:[A-Z]\w*(?:\[\])?)/g, "$1")
    // export function -> module.exports style handled by wrapping
    .replace(/export\s+function\s+/g, "exports.")
    .replace(/export\s+const\s+/g, "exports.")
    // Fix exports.name = function syntax
    .replace(/exports\.(\w+)\s*=?\s*\(/g, "exports.$1 = function $1(")
    // Handle "exports.fn = function fn(...args) {" that was already a function declaration
    .replace(/exports\.(\w+)\s*=\s*function\s+\1\s*=\s*function/g, "exports.$1 = function");
}

run();
