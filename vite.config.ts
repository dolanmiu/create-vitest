import { defineConfig } from "vitest/config";
import { resolve } from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { Plugin } from "vite";
import { node } from '@liuli-util/vite-plugin-node'

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
    node({
      entry: resolve(__dirname, "src/main.ts"),
    }),
    tsconfigPaths(),
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
