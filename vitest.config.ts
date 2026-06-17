import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["**/*.test.{ts,tsx}"],
    setupFiles: ["./test/setup.ts"],
    coverage: {
      provider: "v8",
      include: [
        "lib/**/*.{ts,tsx}",
        "components/**/*.{ts,tsx}",
        "app/**/*.{ts,tsx}",
      ],
      exclude: ["**/*.test.{ts,tsx}"],
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
