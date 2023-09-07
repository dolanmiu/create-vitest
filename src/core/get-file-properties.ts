import path from "path";
import { Project, ScriptTarget } from "ts-morph";
import { traverse } from "./ast/router";
import { DeDupedParsePayload } from "./create-vitest-ast";
import { aggregateImports } from "./import-aggregator";

export const getFileProperties = (
  specFilePath: string,
  content: string,
  originalFilePath: string
): DeDupedParsePayload => {
  const project = new Project({
    compilerOptions: {
      target: ScriptTarget.ESNext,
    },
  });
  const sourceFile = project.createSourceFile(specFilePath, content);

  const payload = traverse(sourceFile, {
    imports: [],
    propertyAccess: {},
    exports: [],
  });

  const deDupedPayload: DeDupedParsePayload = {
    ...payload,
    fileName: path.basename(originalFilePath),
    imports: aggregateImports(payload.imports),
  };

  return deDupedPayload;
};
