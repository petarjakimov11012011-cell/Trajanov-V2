import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// All suites run against ONE local Supabase database, so files must not run in parallel — otherwise
// one suite's TRUNCATE/UPDATE would race another's assertions. `fileParallelism: false` serialises
// files; within a file, the concurrency tests still fire genuinely-parallel RPCs on purpose.
export default defineConfig({
  // Mirror the tsconfig `@/*` → `src/*` path alias so a pure unit test can import a src module that
  // uses the alias (e.g. src/lib/seo/*, which imports @/lib/site). Added in 2.04 for the SEO tests.
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    fileParallelism: false,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.ts"],
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
