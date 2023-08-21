import prettier from "prettier";
import { DeDupedParsePayload, createVitestAst } from "./create-vitest-ast";

export const createTest = async (
  payload: DeDupedParsePayload
): Promise<string> => {
  const output = createVitestAst(payload);

  const formattedOutput = await prettier.format(output.getFullText(), {
    semi: true,
    trailingComma: "all",
    parser: "babel",
  });

  return formattedOutput;
};
