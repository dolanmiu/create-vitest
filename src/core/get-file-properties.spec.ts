import { describe, it, expect } from "vitest";

import { GET_CONFIG_MOCK } from "@mocks/get-config.mock";
import { REMOVE_CONSTRUCTOR_ASSIGNMENT_MOCK } from "@mocks/remove-constructor-assignment.mock";

import { getFileProperties } from "./get-file-properties";

describe("getFileProperties", () => {
  it("should create test properties", async () => {
    const output = getFileProperties(
      "test.spec.ts",
      GET_CONFIG_MOCK,
      "test.ts"
    );

    expect(output).toEqual({
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
  });

  it("should create test properties with single export", async () => {
    const output = getFileProperties(
      "test.spec.ts",
      REMOVE_CONSTRUCTOR_ASSIGNMENT_MOCK,
      "test.ts",
    );

    expect(output).toEqual({
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
  });
});
