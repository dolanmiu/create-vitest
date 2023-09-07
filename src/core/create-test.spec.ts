import { describe, it, expect } from "vitest";

import { createTest } from "./create-test";

describe("createTest", () => {
  it("should create a test file", async () => {
    const output = await createTest({
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
          namespaceImports: ["coolModule"],
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
      exports: ["getPostCssConfig", "postCssPluginsToArray"],
      fileName: "test.ts",
    });

    expect(output)
      .toEqual(`import { vi, describe, it, expect, afterAll, vitest } from "vitest";

vi.mock("path", () => ({
  default: {
    join: vi.fn(),
  },
}));
vi.mock("vitest", () => ({
  default: {
    awesome: vi.fn(),
  },
  vi: vi.fn(),
  describe: vi.fn(),
  it: vi.fn(),
  expect: vi.fn(),
  afterAll: vi.fn(),
}));
vi.mock("test", () => ({
  wow: vi.fn(),
  world: vi.fn(),
}));
vi.mock("my-module", () => ({
  default: {},
  hello: vi.fn(),
}));
vi.mock("module-name", () => ({}));

describe("my-awesome-tests", () => {
  afterAll(() => {
    vi.resetAllMocks();
  });

  describe("getPostCssConfig", () => {
    it("should work", async () => {
      expect(true).toEqual(true);
    });
  });

  describe("postCssPluginsToArray", () => {
    it("should work", async () => {
      expect(true).toEqual(true);
    });
  });
});
`);
  });

  it("should create a test file with single export", async () => {
    const output = await createTest({
      exports: ["removeConstructorAssignment"],
      imports: [
        {
          defaultImports: [],
          namedImports: [
            "ClassDeclaration",
            "Node",
            "Scope",
            "SourceFile",
            "StatementedNode",
            "SyntaxKind",
          ],
          namespaceImports: [],
          packageName: "ts-morph",
        },
        {
          defaultImports: [],
          namedImports: ["getParent", "getScope", "iterate"],
          namespaceImports: [],
          packageName: "./util",
        },
      ],
      propertyAccess: {
        SyntaxKind: new Set([
          "Parameter",
          "Constructor",
          "ClassDeclaration",
          "Identifier",
        ]),
        console: new Set(["log"]),
        node: new Set(["getKind", "getParent", "getType"]),
        sourceFile: new Set(["forEachDescendant", "getText"]),
      },
      fileName: "test.ts",
    });

    expect(output)
      .toEqual(`import { vi, describe, it, expect, afterAll, vitest } from "vitest";

vi.mock("ts-morph", () => ({
  ClassDeclaration: vi.fn(),
  Node: vi.fn(),
  Scope: vi.fn(),
  SourceFile: vi.fn(),
  StatementedNode: vi.fn(),
  SyntaxKind: vi.fn(),
}));
vi.mock("./util", () => ({
  getParent: vi.fn(),
  getScope: vi.fn(),
  iterate: vi.fn(),
}));

describe("removeConstructorAssignment", () => {
  afterAll(() => {
    vi.resetAllMocks();
  });

  it("should work", async () => {
    expect(true).toEqual(true);
  });
});
`);
  });
});
