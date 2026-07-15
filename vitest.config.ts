import { defineConfig } from "vitest/config";

// All suites run against ONE local Supabase database, so files must not run in parallel — otherwise
// one suite's TRUNCATE/UPDATE would race another's assertions. `fileParallelism: false` serialises
// files; within a file, the concurrency tests still fire genuinely-parallel RPCs on purpose.
export default defineConfig({
  test: {
    environment: "node",
    fileParallelism: false,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.ts"],
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
