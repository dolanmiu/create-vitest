import { QuestionCollection } from "inquirer";

import { DeDupedParsePayload } from "./core/create-vitest-ast";

export const createPackageQuestions = ({
  imports,
  propertyAccess,
}: DeDupedParsePayload): QuestionCollection[] => {
  return imports
    .map((importStatement, i) => {
      const globalMockQuestion: QuestionCollection = {
        type: "confirm",
        name: i.toString(), // index hack because inquirer doesn't support file path as name
        message: `Do you want to mock "${importStatement.packageName}"?`,
        default: true,
      };

      const localMockQuestion: QuestionCollection = {
        type: "confirm",
        name: `${i.toString()}-local`,
        message: `Do you want to mock "${importStatement.packageName}" locally for each test? (so you can modify it per test)`,
        default: false,
        when: (answers) => answers[i.toString()] === true,
      };

      const propertiesOfImport = Array.from(
        propertyAccess[importStatement.packageName] ?? []
      );

      const namedImportQuestions = importStatement.namedImports.map(
        (namedImport) =>
          ({
            type: "confirm",
            name: `${i.toString()}-named_import:${namedImport}`,
            message: `Do you want to locally mock "${namedImport}" from "${importStatement.packageName}"?`,
            default: true,
            when: (answers) => answers[`${i.toString()}-local`] === true,
          }) as QuestionCollection
      );

      const propertyQuestions = propertiesOfImport.map(
        (property) =>
          ({
            type: "confirm",
            name: `${i.toString()}-property:${property}`,
            message: `Do you want to locally mock "${property}" from "${importStatement.packageName}"?`,
            default: true,
            when: (answers) => answers[`${i.toString()}-local`] === true,
          }) as QuestionCollection
      );

      return [
        globalMockQuestion,
        localMockQuestion,
        ...namedImportQuestions,
        ...propertyQuestions,
      ];
    })
    .flat();
};
