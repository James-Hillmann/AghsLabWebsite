import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Scratch worktrees carry their own .next build output, which the pattern above only
    // ignores at the repo root. Without this, linting the repo also lints a full compiled
    // Next bundle and buries real findings under thousands of generated-code complaints.
    ".claude/**",
  ]),
]);

export default eslintConfig;
