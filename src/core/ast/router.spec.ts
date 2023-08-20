import { describe, it, expect } from "vitest";
import { Project, ScriptTarget } from "ts-morph";

import { GET_CONFIG_MOCK } from "@mocks/get-config.mock";

import { traverse } from "./router";
import { ParsePayload } from "./types/parse-payload";

describe("traverse", () => {
  it("should traverse the AST", async () => {
    const project = new Project({
      compilerOptions: {
        target: ScriptTarget.ESNext,
      },
    });
    const sourceFile = project.createSourceFile(
      "test.spec.ts",
      GET_CONFIG_MOCK
    );

    const payload: ParsePayload = {
      imports: [],
      propertyAccess: {},
      exports: [],
    };

    const output = traverse(sourceFile, payload);

    expect(output).toEqual({
      imports: [
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
          namespaceImport: "coolModule",
          packageName: "my-module",
          type: "default-and-namespace",
        },
        {
          packageName: "module-name",
          type: "none",
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
    });
  });
});
