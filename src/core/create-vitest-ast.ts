import { Project, Node, StructureKind } from "ts-morph";

import { AggregateImport, ParsePayload } from "./ast/types/parse-payload";

export type DeDupedParsePayload = Omit<ParsePayload, "imports"> & {
  imports: readonly AggregateImport[];
};

export const createVitestAst = (payload: DeDupedParsePayload): Node => {
  const project = new Project();

  const testSourceFile = project.createSourceFile("test.spec.ts", {
    statements: [
      {
        kind: StructureKind.ImportDeclaration,
        moduleSpecifier: "vitest",
        namedImports: [
          "vi",
          "describe",
          "it",
          "expect",
          "afterAll",
          "beforeAll",
        ],
      },
      "\n",
      ...payload.imports.map(
        (i) =>
          `vi.mock("${i.packageName}", () => (${JSON.stringify(
            createMockObject(i, payload.propertyAccess),
            null,
            4
          ).replace(/["']/g, "")}));`
      ),
      "\n",
      payload.exports.length > 1
        ? `describe("my-awesome-tests", () => {
    afterAll(() => {
      vi.resetAllMocks();
    });

    ${payload.exports
      .map(
        (e) => `describe("${e}", () => {
      it("should work", () => {
        expect(true).toBe(true);
      });
    });`
      )
      .join("\n\n")}
})`
        : payload.exports
            .map(
              (e) => `describe("${e}", () => {
    it("should work", () => {
      expect(true).toBe(true);
    });
  });`
            )
            .join("\n\n"),
    ],
  });

  testSourceFile.formatText({});

  return testSourceFile;
};

const createMockObject = (
  i: AggregateImport,
  propertyAccess: Record<string, Set<string>>
) => {
  const mock = {
    default:
      i.defaultImports.length > 0
        ? createImportObject(i.defaultImports, propertyAccess)
        : undefined,
    ...createImportObject(i.namespaceImports, propertyAccess),
    ...(i.namedImports.length > 0
      ? i.namedImports.reduce(
          (acc, curr) => ({
            ...acc,
            [curr]: `vi.fn()`,
          }),
          {}
        )
      : {}),
  };

  return mock;
};

const createImportObject = (
  imports: readonly string[],
  propertyAccess: Record<string, Set<string>>
): Record<string, string> => {
  return imports
    .map((i) => {
      if (propertyAccess[i]) {
        return Array.from(propertyAccess[i]);
      } else {
        return [];
      }
    })
    .flat()
    .reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: `vi.fn()`,
      }),
      {}
    );
};
