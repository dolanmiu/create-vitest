import { describe, it, expect } from "vitest";


import { aggregateImports } from "./import-aggregator";

describe("aggregateImports", () => {
  it("should aggregate in an extreme case", async () => {
    const output = aggregateImports([
      {
        defaultImport: "path",
        packageName: "vitest",
        type: "default",
      },
      {
        namedImports: ["vi", "describe", "it", "expect", "afterAll"],
        packageName: "vitest",
        type: "named",
      },
      {
        defaultImport: "viDefault",
        namedImports: ["vi", "describe", "it", "expect"],
        packageName: "vitest",
        type: "default-and-named",
      },
      {
        namespaceImport: "ff",
        packageName: "vitest",
        type: "namespace",
      },
      {
        defaultImport: "defaultMember",
        namespaceImport: "name",
        packageName: "vitest",
        type: "default-and-namespace",
      },
      {
        packageName: "vitest",
        type: "none",
      },
    ]);

    expect(output).toEqual([
      {
        packageName: "vitest",
        defaultImports: ["path", "viDefault", "defaultMember"],
        namespaceImports: ["ff", "name"],
        namedImports: [
          "vi",
          "describe",
          "it",
          "expect",
          "afterAll",
          "vi",
          "describe",
          "it",
          "expect",
        ],
      },
    ]);
  });

  it("should aggregate in a normal case", async () => {
    const output = aggregateImports([
      {
        defaultImport: "path",
        packageName: "path",
        type: "default",
      },
      {
        namedImports: ["vi", "describe", "it", "expect", "afterAll"],
        packageName: "vitest",
        type: "named",
      },
      {
        defaultImport: "viDefault",
        namedImports: ["vi", "describe", "it", "expect"],
        packageName: "vitest",
        type: "default-and-named",
      },
      {
        namespaceImport: "ff",
        packageName: "test",
        type: "namespace",
      },
      {
        defaultImport: "defaultMember",
        namespaceImport: "name",
        packageName: "my-module",
        type: "default-and-namespace",
      },
      {
        packageName: "module-name",
        type: "none",
      },
    ]);

    expect(output).toEqual([
      {
        packageName: "path",
        defaultImports: ["path"],
        namespaceImports: [],
        namedImports: [],
      },
      {
        packageName: "vitest",
        defaultImports: ["viDefault"],
        namespaceImports: [],
        namedImports: [
          "vi",
          "describe",
          "it",
          "expect",
          "afterAll",
          "vi",
          "describe",
          "it",
          "expect",
        ],
      },
      {
        packageName: "test",
        defaultImports: [],
        namespaceImports: ["ff"],
        namedImports: [],
      },
      {
        packageName: "my-module",
        defaultImports: ["defaultMember"],
        namespaceImports: ["name"],
        namedImports: [],
      },
      {
        packageName: "module-name",
        defaultImports: [],
        namespaceImports: [],
        namedImports: [],
      },
    ]);
  });
});
