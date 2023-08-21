import { QuestionCollection } from "inquirer";

import { AggregateImport } from "./core/ast/types/parse-payload";

export const createPackageQuestions = (
  payload: readonly AggregateImport[]
): QuestionCollection[] => {
  return payload.map((importStatement, i) => {
    return {
      type: "confirm",
      name: i.toString(), // index hack because inquirer doesn't support file path as name
      message: `Do you want to mock "${importStatement.packageName}"?`,
      default: true,
    };
  });
};
