import { Project, ScriptTarget } from "ts-morph";
import prettier from "prettier";
import { traverse } from "./ast/router";
import { createVitestAst } from "./create-vitest-ast";
import { aggregateImports } from "./import-aggregator";

export const createTest = async (
  fileName: string,
  content: string
): Promise<string> => {
  const project = new Project({
    compilerOptions: {
      target: ScriptTarget.ESNext,
    },
  });
  const sourceFile = project.createSourceFile(fileName, content);

  const payload = traverse(sourceFile, {
    imports: [],
    propertyAccess: {},
    exports: [],
  });

  const output = createVitestAst({
    ...payload,
    imports: aggregateImports(payload.imports),
  });

  const formattedOutput = await prettier.format(output.getFullText(), {
    semi: true,
    trailingComma: "all",
    parser: "babel",
  });

  return formattedOutput;
};
