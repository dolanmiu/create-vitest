import { defineConfig } from "vite";
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
    },
  },
});
