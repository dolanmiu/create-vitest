import { Project, Node, StructureKind } from "ts-morph";

import { AggregateImport, ParsePayload } from "./ast/types/parse-payload";

export type SpyOnMockConfig = {
  readonly packageName: string;
  readonly property: string;
};

export type DeDupedParsePayload = Omit<ParsePayload, "imports"> & {
  readonly imports: readonly AggregateImport[];
  readonly fileName: string;
  readonly localMocks: {
    readonly namedImportMocks: readonly SpyOnMockConfig[];
    readonly defaultMocks: readonly SpyOnMockConfig[];
  };
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
          "vitest",
          "afterEach",
          // "beforeAll",
        ],
      },
      // TODO: Later feature
      // Difficult right now because of node module resolution
      // {
      //   kind: StructureKind.ImportDeclaration,
      //   moduleSpecifier: `./${payload.fileName.replace(/\.tsx?$/, "")}`,
      //   namedImports: [...payload.exports],
      // },
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

    afterEach(() => {
      vi.clearAllMocks();
    });

    ${payload.exports
      .map(
        (e) => `describe("${e}", () => {
      it("should work", async () => {
        ${payload.localMocks.namedImportMocks.map(createSpyOnNamedImportMockObject).join("\n")}
        ${payload.localMocks.defaultMocks.map(createSpyOnDefaultMockObject).join("\n")}

        expect(true).toEqual(true);
      });
    });`
      )
      .join("\n\n")}
})`
        : payload.exports
            .map(
              (e) => `describe("${e}", () => {
    afterAll(() => {
      vi.resetAllMocks();
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it("should work", async () => {
      ${payload.localMocks.namedImportMocks.map(createSpyOnNamedImportMockObject).join("\n")}
      ${payload.localMocks.defaultMocks.map(createSpyOnDefaultMockObject).join("\n")}

      expect(true).toEqual(true);
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

const createSpyOnNamedImportMockObject = (spyOnConfig: SpyOnMockConfig): string => {
  return `vi.spyOn(await import("${spyOnConfig.packageName}"), "${spyOnConfig.property}").mockReturnValue(undefined);`;
};

const createSpyOnDefaultMockObject = (spyOnConfig: SpyOnMockConfig): string => {
  return `vi.spyOn((await import("${spyOnConfig.packageName}")).default, "${spyOnConfig.property}").mockReturnValue(undefined);`;
};
