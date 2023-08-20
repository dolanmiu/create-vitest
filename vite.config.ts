import { defineConfig } from "vitest/config";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [dts(), tsconfigPaths()],
  build: {
    sourcemap: true,
    lib: {
      entry: [resolve(__dirname, "src/main.ts")],
      name: "create-vitest",
      fileName: (format) => `${format}/index.js`,
      formats: ["cjs", "es"],
    },
    outDir: resolve(__dirname, "dist"),
  },
  test: {
    coverage: {
      provider: "v8",
      lines: 100,
      branches: 100,
      functions: 100,
      statements: 100,
      reporter: ["text", "html"],
    },
  },
});
