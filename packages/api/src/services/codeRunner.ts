import Docker from "dockerode";
import { mkdtemp, writeFile, rm } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import type { TestCaseResult } from "@algo-learn/shared";

const docker = new Docker();
const RUNNER_IMAGE = process.env.RUNNER_IMAGE || "algo-learn-runner:latest";
const TIMEOUT_MS = 10_000;

interface RunnerOutput {
  results: Array<{
    testCaseId: number;
    passed: boolean;
    actualOutput: string | null;
    error: string | null;
    executionTimeMs: number;
  }>;
}

export async function executeCode(
  userCode: string,
  testCases: Array<{
    id: number;
    input: string;
    expectedOutput: string;
  }>,
  functionName: string
): Promise<{ status: "accepted" | "wrong_answer" | "runtime_error" | "timeout"; results: TestCaseResult[]; totalTimeMs: number }> {
  const tmpDir = await mkdtemp(join(tmpdir(), "algo-learn-"));

  try {
    await writeFile(join(tmpDir, "solution.ts"), userCode);
    await writeFile(join(tmpDir, "tests.json"), JSON.stringify(testCases));
    await writeFile(
      join(tmpDir, "meta.json"),
      JSON.stringify({ functionName })
    );

    const container = await docker.createContainer({
      Image: RUNNER_IMAGE,
      HostConfig: {
        Memory: 128 * 1024 * 1024,
        MemorySwap: 128 * 1024 * 1024,
        NanoCpus: 0.5e9,
        NetworkMode: "none",
        ReadonlyRootfs: true,
        Binds: [`${tmpDir}:/sandbox/work:ro`],
        Tmpfs: { "/tmp": "rw,noexec,nosuid,size=16m" },
        PidsLimit: 64,
        SecurityOpt: ["no-new-privileges"],
      },
      StopTimeout: 10,
    });

    const startTime = Date.now();
    await container.start();

    const waitResult = await Promise.race([
      container.wait(),
      new Promise<{ StatusCode: number }>((resolve) =>
        setTimeout(() => {
          container.kill().catch(() => {});
          resolve({ StatusCode: -1 });
        }, TIMEOUT_MS)
      ),
    ]);

    const totalTimeMs = Date.now() - startTime;

    const logStream = await container.logs({
      stdout: true,
      stderr: true,
    });
    const rawOutput = logStream.toString("utf-8");

    await container.remove({ force: true }).catch(() => {});

    if (waitResult.StatusCode === -1) {
      return {
        status: "timeout",
        results: testCases.map((tc) => ({
          testCaseId: tc.id,
          passed: false,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: null,
          error: "Execution timed out (10s limit)",
          executionTimeMs: TIMEOUT_MS,
        })),
        totalTimeMs,
      };
    }

    try {
      const cleaned = cleanDockerOutput(rawOutput);
      const output: RunnerOutput = JSON.parse(cleaned);

      const allPassed = output.results.every((r) => r.passed);
      const hasErrors = output.results.some((r) => r.error);

      return {
        status: allPassed
          ? "accepted"
          : hasErrors
            ? "runtime_error"
            : "wrong_answer",
        results: output.results.map((r) => {
          const tc = testCases.find((t) => t.id === r.testCaseId)!;
          return {
            testCaseId: r.testCaseId,
            passed: r.passed,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            actualOutput: r.actualOutput,
            error: r.error,
            executionTimeMs: r.executionTimeMs,
          };
        }),
        totalTimeMs,
      };
    } catch {
      return {
        status: "runtime_error",
        results: testCases.map((tc) => ({
          testCaseId: tc.id,
          passed: false,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: null,
          error: `Runner error: ${rawOutput.slice(0, 500)}`,
          executionTimeMs: totalTimeMs,
        })),
        totalTimeMs,
      };
    }
  } finally {
    await rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}

function cleanDockerOutput(raw: string): string {
  // Docker multiplexed stream output has 8-byte headers per frame
  // Try to find JSON in the output
  const jsonStart = raw.indexOf("{");
  if (jsonStart === -1) return raw;
  const jsonEnd = raw.lastIndexOf("}");
  if (jsonEnd === -1) return raw;
  return raw.slice(jsonStart, jsonEnd + 1);
}
