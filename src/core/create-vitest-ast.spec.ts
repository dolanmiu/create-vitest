import { describe, it, expect } from "vitest";
import { createVitestAst } from "./create-vitest-ast";

describe("createVitestAst", () => {
  it("should create a test file", async () => {
    const output = createVitestAst({
      imports: [
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
      ],
      propertyAccess: {
        Object: new Set(["keys"]),
        config: new Set(["plugins"]),
        coolModule: new Set(["hello"]),
        ff: new Set(["wow", "world"]),
        path: new Set(["join"]),
        process: new Set(["cwd"]),
        viDefault: new Set(["awesome"]),
      },
      exports: [],
      fileName: "my-file.ts",
    });

    expect(output.getFullText())
      .toEqual(`import { vi, describe, it, expect, afterAll } from "vitest";

vi.mock("path", () => ({
    default: {
        join: vi.fn()
    }
}));
vi.mock("vitest", () => ({
    default: {
        awesome: vi.fn()
    },
    vi: vi.fn(),
    describe: vi.fn(),
    it: vi.fn(),
    expect: vi.fn(),
    afterAll: vi.fn()
}));
vi.mock("test", () => ({
    wow: vi.fn(),
    world: vi.fn()
}));
vi.mock("my-module", () => ({
    default: {}
}));
vi.mock("module-name", () => ({}));

`);
  });
});
