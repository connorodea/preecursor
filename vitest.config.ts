import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
  },
  resolve: {
    // Mirror the tsconfig "@/*" path alias so tests can import @/lib/*.
    alias: {
      "@": import.meta.dirname,
    },
  },
});
