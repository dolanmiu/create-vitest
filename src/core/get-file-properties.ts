import { Project, ScriptTarget } from "ts-morph";
import { traverse } from "./ast/router";
import { DeDupedParsePayload } from "./create-vitest-ast";
import { aggregateImports } from "./import-aggregator";

export const getFileProperties = (
  fileName: string,
  content: string
): DeDupedParsePayload => {
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

  const deDupedPayload: DeDupedParsePayload = {
    ...payload,
    imports: aggregateImports(payload.imports),
  };

  return deDupedPayload;
};
