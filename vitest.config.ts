import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["**/*.test.{ts,tsx}"],
    setupFiles: ["./test/setup.ts"],
    coverage: {
      provider: "v8",
      include: ["lib/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
      exclude: [
        "**/*.test.{ts,tsx}",
        // WebGL field: all logic lives inside a useEffect that needs a real
        // GL context + RAF loop — not meaningfully unit-testable in jsdom.
        // Excluded with rationale rather than padded with fake assertions.
        "components/ShaderField.tsx",
      ],
      reporter: ["text-summary", "text"],
    },
  },
  resolve: {
    // Mirror the tsconfig "@/*" path alias so tests can import @/lib/*.
    alias: {
      "@": import.meta.dirname,
    },
  },
});
