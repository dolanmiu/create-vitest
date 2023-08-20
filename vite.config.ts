import { defineConfig } from "vitest/config";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";
import { Plugin } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { builtinModules } from "module";

export const addShebangPlugin = (): Plugin => ({
  name: "add-shebang",
  enforce: "post",
  generateBundle(_, bundle) {
    for (const [, output] of Object.entries(bundle)) {
      if (output.type === "chunk") {
        output.code = `#!/usr/bin/env node\n${output.code}`;
      }
    }
  },
});

export default defineConfig({
  plugins: [
    dts(),
    tsconfigPaths(),
    nodePolyfills(),
    addShebangPlugin(),
  ],
  build: {
    sourcemap: true,
    lib: {
      entry: [resolve(__dirname, "src/main.ts")],
      name: "create-vitest",
      fileName: () => `main.js`,
      formats: ["es"],
    },
    outDir: resolve(__dirname, "dist"),
    rollupOptions: {
      external: [...builtinModules, /^node:/],
    },
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
